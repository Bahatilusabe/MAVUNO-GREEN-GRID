import { getConnection } from "../../db/pool.js";

export async function createMatchRequest(data) {
  const { farmer_id, partner_id, crop_id, kg, offer_price, pickup_date } = data;
  
  // Check partner capacity first
  const partnerRes = await pool.query(
    "SELECT capacity, current_load FROM partners WHERE id = $1",
    [partner_id]
  );
  const partner = partnerRes.rows[0];

  if (!partner || (partner.current_load + kg > partner.capacity)) {
    throw new Error("Requested quantity exceeds partner's remaining capacity.");
  }

  const { rows } = await pool.query(
    `INSERT INTO match_requests (farmer_id, partner_id, crop_id, kg, offer_price, pickup_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *`,
    [farmer_id, partner_id, crop_id, kg, offer_price, pickup_date]
  );
  
  return rows[0];
}

export async function updateRequestStatus(requestId, status) {
  const { rows } = await pool.query(
    `UPDATE match_requests SET status = $1 WHERE id = $2 RETURNING *`,
    [status, requestId]
  );
  return rows[0];
}