import oracledb from "oracledb";
import { getConnection, query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const MATCH_SELECT = `
  SELECT m.id AS "id",
         m.crop_id AS "cropId",
         c.name AS "crop",
         m.kg AS "kg",
         m.price_per_kg AS "pricePerKg",
         TO_CHAR(m.pickup_date, 'YYYY-MM-DD') AS "pickupDate",
         m.status AS "status",
         m.partner_id AS "partnerId",
         m.place_id AS "placeId",
         NVL(p.name, g.name) AS "targetName",
         m.notes AS "notes",
         m.created_at AS "createdAt"
    FROM match_requests m
    LEFT JOIN crops c ON c.id = m.crop_id
    LEFT JOIN partners p ON p.id = m.partner_id
    LEFT JOIN geo_places g ON g.id = m.place_id`;

export async function listMatches(ownerId) {
  const { rows } = await query(
    `${MATCH_SELECT} WHERE m.farmer_id = :1 ORDER BY m.created_at DESC`,
    [ownerId]
  );
  return rows;
}

async function getMatch(ownerId, id) {
  const { rows } = await query(`${MATCH_SELECT} WHERE m.farmer_id = :1 AND m.id = :2`, [ownerId, id]);
  if (!rows[0]) throw new HttpError(404, "Match not found");
  return rows[0];
}

async function findByKey(ownerId, key) {
  const { rows } = await query(
    `SELECT id AS "id", crop_id AS "cropId", kg AS "kg", partner_id AS "partnerId", place_id AS "placeId"
       FROM match_requests WHERE farmer_id = :1 AND idempotency_key = :2`,
    [ownerId, key]
  );
  return rows[0] ?? null;
}

const same = (a, b) => String(a ?? "").toUpperCase() === String(b ?? "").toUpperCase();

async function replay(ownerId, row, d) {
  const identical =
    same(row.cropId, d.crop_id) &&
    row.kg === d.kg &&
    same(row.partnerId, d.partner_id) &&
    same(row.placeId, d.place_id);
  if (!identical) {
    throw new HttpError(409, "This idempotency key was already used for a different request");
  }
  return { match: await getMatch(ownerId, row.id), created: false };
}

export async function createMatch(ownerId, d) {
  const prior = await findByKey(ownerId, d.idempotency_key);
  if (prior) return replay(ownerId, prior, d);

  if (d.pickup_date && d.pickup_date < new Date().toISOString().slice(0, 10)) {
    throw new HttpError(422, "pickup_date is in the past");
  }

  const conn = await getConnection();
  let id;
  try {
    // Lock the crop row so two simultaneous commits cannot both claim the same kilograms
    const cropRes = await conn.execute(
      `SELECT c.id AS "id", c.name AS "name", c.status AS "status",
              NVL(c.actual_kg, c.expected_kg) AS "totalKg"
         FROM crops c JOIN farms f ON f.id = c.farm_id
        WHERE c.id = :id AND f.owner_id = :owner
        FOR UPDATE OF c.id`,
      { id: d.crop_id, owner: ownerId }
    );
    const crop = cropRes.rows[0];
    if (!crop) throw new HttpError(404, "Crop not found");
    if (crop.status === "sold" || crop.status === "lost") {
      throw new HttpError(409, `This crop is already marked ${crop.status}`);
    }

    const committedRes = await conn.execute(
      `SELECT NVL(SUM(kg), 0) AS "committed" FROM match_requests
        WHERE crop_id = :id AND status IN ('pending', 'scheduled', 'in_transit', 'delivered')`,
      { id: crop.id }
    );
    const available = crop.totalKg - committedRes.rows[0].committed;
    if (d.kg > available) {
      throw new HttpError(409, `Only ${Math.max(available, 0)} kg of ${crop.name} left to commit`);
    }

    let price = d.price_per_kg;
    let targetName;
    if (d.partner_id) {
      const pr = await conn.execute(
        `SELECT name AS "name", price_per_kg AS "pricePerKg", capacity_kg AS "capacityKg",
                accepting AS "accepting", status AS "status"
           FROM partners WHERE id = :id`,
        { id: d.partner_id }
      );
      const partner = pr.rows[0];
      if (!partner) throw new HttpError(404, "Partner not found");
      if (partner.status !== "approved" || !partner.accepting) {
        throw new HttpError(422, `${partner.name} is not accepting new requests`);
      }
      if (partner.capacityKg != null && d.kg > partner.capacityKg) {
        throw new HttpError(422, `${partner.name} can take at most ${partner.capacityKg} kg`);
      }
      price = price ?? partner.pricePerKg;
      targetName = partner.name;
    } else {
      const g = await conn.execute(`SELECT name AS "name" FROM geo_places WHERE id = :id`, {
        id: d.place_id,
      });
      if (!g.rows[0]) throw new HttpError(404, "Place not found");
      targetName = g.rows[0].name ?? "the selected site";
    }
    if (price == null) throw new HttpError(422, "No price available. Provide price_per_kg.");

    const ins = await conn.execute(
      `INSERT INTO match_requests
         (farmer_id, partner_id, place_id, crop_id, kg, price_per_kg, pickup_date, status, idempotency_key, notes)
       VALUES
         (:farmer, :partner, :place, :crop, :kg, :price, TO_DATE(:pickup, 'YYYY-MM-DD'), 'pending', :idem, :notes)
       RETURNING id INTO :out_id`,
      {
        farmer: ownerId,
        partner: d.partner_id ?? null,
        place: d.place_id ?? null,
        crop: crop.id,
        kg: d.kg,
        price,
        pickup: d.pickup_date ?? null,
        idem: d.idempotency_key,
        notes: d.notes ?? null,
        out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      }
    );
    id = ins.outBinds.out_id[0];

 await conn.execute(
  `INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label, match_id)
   VALUES (:user_id, 'message', 'deal', 'green', :title, :body, :to, :label, :match_id)`,
  {
    user_id: ownerId,
    title: "Match request sent",
    body: `${d.kg} kg of ${crop.name} to ${targetName}. Waiting for confirmation.`,
    to: d.partner_id ? "messages" : "transport",
    label: d.partner_id ? "Open" : "Track",
    match_id: d.partner_id ? id : null,
  }
);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    if (err.errorNum === 1) {
      // A concurrent request with the same idempotency key won the race
      const winner = await findByKey(ownerId, d.idempotency_key);
      if (winner) return replay(ownerId, winner, d);
    }
    throw err;
  } finally {
    await conn.close();
  }

  return { match: await getMatch(ownerId, id), created: true };
}

export async function cancelMatch(ownerId, id) {
  const conn = await getConnection();
  let affected;
  try {
    const result = await conn.execute(
      `UPDATE match_requests SET status = 'cancelled'
        WHERE id = :id AND farmer_id = :owner AND status = 'pending'`,
      { id, owner: ownerId },
      { autoCommit: true }
    );
    affected = result.rowsAffected;
  } finally {
    await conn.close();
  }
  if (!affected) {
    await getMatch(ownerId, id); // 404 if it is not theirs
    throw new HttpError(409, "Only pending requests can be cancelled");
  }
  return getMatch(ownerId, id);
}