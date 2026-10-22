import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const PARTNER_SELECT = `
  p.id AS "id",
  p.user_id AS "userId",
  p.name AS "name",
  p.type AS "type",
  p.county AS "county",
  p.lat AS "lat",
  p.lng AS "lng",
  p.price_per_kg AS "pricePerKg",
  p.capacity_kg AS "capacityKg",
  p.accepting AS "accepting",
  p.status AS "status",
  TO_CHAR(p.created_at, 'YYYY-MM-DD') AS "createdAt"`;

const REQUEST_SELECT = `
  m.id AS "id",
  m.crop_id AS "cropId",
  c.name AS "crop",
  m.kg AS "kg",
  m.price_per_kg AS "pricePerKg",
  TO_CHAR(m.pickup_date, 'YYYY-MM-DD') AS "pickupDate",
  m.status AS "status",
  m.notes AS "notes",
  m.created_at AS "createdAt",
  m.farmer_id AS "farmerId",
  u.name AS "farmer",
  u.county AS "county",
  u.phone AS "phone",
  f.id AS "farmId",
  f.name AS "farm"`;

/**
 * The partner record linked to the signed-in partner account. Partners are
 * linked to a user through partners.user_id, which is what makes the farmer
 * -> partner request loop land in the right inbox.
 */
export async function getPartnerForUser(userId) {
  const { rows } = await query(
    `SELECT ${PARTNER_SELECT} FROM partners p WHERE p.user_id = :1`,
    [userId]
  );
  if (!rows[0]) {
    throw new HttpError(404, "No partner profile is linked to this account yet");
  }
  return rows[0];
}

export async function listPartnerRequests(partnerId) {
  const { rows } = await query(
    `SELECT ${REQUEST_SELECT}
       FROM match_requests m
       LEFT JOIN crops c ON c.id = m.crop_id
       LEFT JOIN users u ON u.id = m.farmer_id
       LEFT JOIN farms f ON f.id = c.farm_id
      WHERE m.partner_id = :1
      ORDER BY CASE m.status WHEN 'pending' THEN 0 WHEN 'scheduled' THEN 1 ELSE 2 END,
               m.created_at DESC`,
    [partnerId]
  );
  return rows;
}

/** Totals the partner KPI row needs, computed from the same request set. */
export async function partnerStats(partnerId) {
  const requests = await listPartnerRequests(partnerId);

  const pending = requests.filter((r) => r.status === "pending");
  const committed = requests.filter((r) =>
    ["scheduled", "in_transit", "delivered"].includes(r.status)
  );
  const delivered = requests.filter((r) => r.status === "delivered");

  return {
    requests,
    pending: pending.length,
    committedKg: committed.reduce((s, r) => s + Number(r.kg || 0), 0),
    deliveredKg: delivered.reduce((s, r) => s + Number(r.kg || 0), 0),
    revenue: delivered.reduce((s, r) => s + Number(r.kg || 0) * Number(r.pricePerKg || 0), 0),
  };
}

/**
 * Accept or decline a farmer request. Accepting moves it to `scheduled`,
 * which is the same state the transport module treats as "committed".
 */
export async function decideRequest(partnerId, matchId, decision) {
  const { rows } = await query(
    `SELECT ${REQUEST_SELECT}, m.farmer_id AS "ownerFarmerId"
       FROM match_requests m
       LEFT JOIN crops c ON c.id = m.crop_id
       LEFT JOIN users u ON u.id = m.farmer_id
       LEFT JOIN farms f ON f.id = c.farm_id
      WHERE m.id = :1 AND m.partner_id = :2`,
    [matchId, partnerId]
  );

  const match = rows[0];
  if (!match) throw new HttpError(404, "Request not found");
  if (match.status !== "pending") {
    throw new HttpError(409, `This request is already ${match.status}`);
  }

  const nextStatus = decision === "accept" ? "scheduled" : "declined";

  await query(
    `UPDATE match_requests SET status = :1 WHERE id = :2 AND partner_id = :3`,
    [nextStatus, matchId, partnerId]
  );

  // The farmer sees the outcome in their notification feed.
  await query(
    `INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label)
     VALUES (:1, 'message', 'deal', :2, :3, :4, 'market', 'View')`,
    [
      match.ownerFarmerId,
      decision === "accept" ? "green" : "amber",
      decision === "accept" ? "Request accepted" : "Request declined",
      decision === "accept"
        ? `${match.kg} kg of ${match.crop} was accepted. Pickup is being scheduled.`
        : `${match.kg} kg of ${match.crop} was declined. Try another buyer from your market list.`,
    ]
  );

  return { ...match, status: nextStatus };
}

/**
 * Move an accepted request along the fulfilment lifecycle:
 * scheduled -> in_transit -> delivered. Only a forward step is allowed, so a
 * delivered order can never be reopened by accident.
 */
const LIFECYCLE = ["scheduled", "in_transit", "delivered"];

export async function advanceRequest(partnerId, matchId, nextStatus) {
  if (!LIFECYCLE.includes(nextStatus)) {
    throw new HttpError(400, `Unknown order status "${nextStatus}"`);
  }

  const { rows } = await query(
    `SELECT ${REQUEST_SELECT}, m.farmer_id AS "ownerFarmerId"
       FROM match_requests m
       LEFT JOIN crops c ON c.id = m.crop_id
       LEFT JOIN users u ON u.id = m.farmer_id
       LEFT JOIN farms f ON f.id = c.farm_id
      WHERE m.id = :1 AND m.partner_id = :2`,
    [matchId, partnerId]
  );

  const match = rows[0];
  if (!match) throw new HttpError(404, "Request not found");

  const current = LIFECYCLE.indexOf(match.status);
  const target = LIFECYCLE.indexOf(nextStatus);

  if (current === -1) {
    throw new HttpError(409, `A ${match.status} request cannot be moved`);
  }
  if (target <= current) {
    throw new HttpError(409, "An order can only move forward");
  }

  await query(`UPDATE match_requests SET status = :1 WHERE id = :2`, [nextStatus, matchId]);

  if (nextStatus === "delivered") {
    await query(
      `INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label)
       VALUES (:1, 'message', 'check', 'green', :2, :3, 'market', 'View')`,
      [
        match.ownerFarmerId,
        "Order delivered",
        `${match.kg} kg of ${match.crop} was delivered and payment is on its way.`,
      ]
    );
  }

  return { ...match, status: nextStatus };
}

export async function updateListing(partnerId, d) {  const { rows } = await query(
    `SELECT ${PARTNER_SELECT} FROM partners p WHERE p.id = :1`,
    [partnerId]
  );
  if (!rows[0]) throw new HttpError(404, "Partner not found");

  await query(
    `UPDATE partners
        SET price_per_kg = :price,
            capacity_kg = :capacity,
            accepting  = :accepting
      WHERE id = :id`,
    {
      price: d.pricePerKg ?? rows[0].pricePerKg,
      capacity: d.capacityKg ?? rows[0].capacityKg,
      accepting: d.accepting == null ? rows[0].accepting : d.accepting ? 1 : 0,
      id: partnerId,
    }
  );

  return getPartnerById(partnerId);
}

export async function getPartnerById(id) {
  const { rows } = await query(`SELECT ${PARTNER_SELECT} FROM partners p WHERE p.id = :1`, [id]);
  if (!rows[0]) throw new HttpError(404, "Partner not found");
  return rows[0];
}
