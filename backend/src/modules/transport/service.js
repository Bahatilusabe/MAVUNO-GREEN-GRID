import oracledb from "oracledb";
import { getConnection, query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

export async function getTransportRequestsByFarm(ownerId, farmId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT t.id, t.match_request_id, t.farm_id, t.crop_id, t.partner_id, t.place_id,
              t.transporter_id, t.load_weight_kg, t.pickup_lat, t.pickup_lng,
              t.status, t.created_at, t.updated_at
       FROM transport_requests t
       JOIN farms f ON f.id = t.farm_id
       WHERE t.farm_id = :farmId AND f.owner_id = :ownerId
       ORDER BY t.created_at DESC`,
      { farmId, ownerId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createTransportRequest(ownerId, data) {
  const connection = await getConnection();
  try {
    const farm = await connection.execute(
      `SELECT id, lat, lng FROM farms WHERE id = :farm_id AND owner_id = :owner_id`,
      { farm_id: data.farm_id, owner_id: ownerId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (!farm.rows[0]) throw new HttpError(404, "Farm not found");
    const farmRow = farm.rows[0];

    const result = await connection.execute(
      `INSERT INTO transport_requests (
         farmer_id, farm_id, load_weight_kg, pickup_lat, pickup_lng, status, partner_id, place_id
       )
       VALUES (
         :owner_id, :farm_id, :weight, :lat, :lng, :status, :partner_id, :place_id
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        owner_id: ownerId,
        farm_id: data.farm_id,
        weight: data.load_weight_kg,
        lat: data.pickup_lat ?? farmRow.LAT,
        lng: data.pickup_lng ?? farmRow.LNG,
        status: data.status,
        partner_id: data.partner_id || null,
        place_id: data.place_id || null,
        out_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        out_created_at: { type: oracledb.TIMESTAMP, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    return {
      id: result.outBinds.out_id[0],
      created_at: result.outBinds.out_created_at[0],
      ...data
    };
  } finally {
    if (connection) await connection.close();
  }
}

export async function updateTransportStatus(requestId, data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE transport_requests 
       SET status = :status,
           transporter_id = COALESCE(:transporter_id, transporter_id)
       WHERE id = :id
         AND (:owner_id IS NULL OR farmer_id = :owner_id)`,
      {
        status: data.status,
        transporter_id: data.transporter_id || null,
        id: requestId,
        owner_id: data.owner_id || null,
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}

export async function commitMatchAsTransportOrder(ownerId, matchId) {
  const connection = await getConnection();
  let orderId;
  try {
    const existing = await connection.execute(
      `SELECT id
         FROM transport_requests
        WHERE match_request_id = :match_id AND farmer_id = :owner_id`,
      { match_id: matchId, owner_id: ownerId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (existing.rows[0]) {
      return { order: await getTransportOrder(ownerId, existing.rows[0].ID ?? existing.rows[0].id), created: false };
    }

    const matchResult = await connection.execute(
      `SELECT m.id, m.farmer_id, m.crop_id, m.kg, m.partner_id, m.place_id,
              f.id AS farm_id, f.lat AS pickup_lat, f.lng AS pickup_lng,
              m.status
         FROM match_requests m
         JOIN crops c ON c.id = m.crop_id
         JOIN farms f ON f.id = c.farm_id
        WHERE m.id = :match_id AND m.farmer_id = :owner_id
        FOR UPDATE OF m.id`,
      { match_id: matchId, owner_id: ownerId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const match = matchResult.rows[0];
    if (!match) throw new HttpError(404, "Match not found");
    if (!["pending", "scheduled"].includes(String(match.STATUS ?? match.status).toLowerCase())) {
      throw new HttpError(409, "Only pending or scheduled matches can be sent for transport");
    }

    const insert = await connection.execute(
      `INSERT INTO transport_requests
         (match_request_id, farmer_id, farm_id, crop_id, partner_id, place_id,
          load_weight_kg, pickup_lat, pickup_lng, status)
       VALUES
         (:match_id, :owner_id, :farm_id, :crop_id, :partner_id, :place_id,
          :kg, :pickup_lat, :pickup_lng, 'pending')
       RETURNING id INTO :out_id`,
      {
        match_id: match.id,
        owner_id: ownerId,
        farm_id: match.FARM_ID ?? match.farm_id,
        crop_id: match.CROP_ID ?? match.crop_id,
        partner_id: match.PARTNER_ID ?? match.partner_id ?? null,
        place_id: match.PLACE_ID ?? match.place_id ?? null,
        kg: match.KG ?? match.kg,
        pickup_lat: match.PICKUP_LAT ?? match.pickup_lat ?? null,
        pickup_lng: match.PICKUP_LNG ?? match.pickup_lng ?? null,
        out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      }
    );
    orderId = insert.outBinds.out_id[0];
    await connection.execute(
      `UPDATE match_requests SET status = 'scheduled'
        WHERE id = :match_id AND farmer_id = :owner_id AND status = 'pending'`,
      { match_id: match.id, owner_id: ownerId }
    );
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    if (err.errorNum === 1) {
      const { rows } = await query(
        `SELECT id FROM transport_requests WHERE match_request_id = :1 AND farmer_id = :2`,
        [matchId, ownerId]
      );
      if (rows[0]) return { order: await getTransportOrder(ownerId, rows[0].id), created: false };
    }
    throw err;
  } finally {
    await connection.close();
  }
  return { order: await getTransportOrder(ownerId, orderId), created: true };
}

async function getTransportOrder(ownerId, orderId) {
  const { rows } = await query(
    `SELECT t.id, t.match_request_id AS "matchId", t.farm_id AS "farmId",
            t.crop_id AS "cropId", t.partner_id AS "partnerId", t.place_id AS "placeId",
            t.load_weight_kg AS "loadWeightKg", t.pickup_lat AS "pickupLat",
            t.pickup_lng AS "pickupLng", t.status, t.transporter_id AS "transporterId",
            t.created_at AS "createdAt", t.updated_at AS "updatedAt"
       FROM transport_requests t
      WHERE t.id = :1 AND t.farmer_id = :2`,
    [orderId, ownerId]
  );
  if (!rows[0]) throw new HttpError(404, "Transport order not found");
  return rows[0];
}