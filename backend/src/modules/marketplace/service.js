import crypto from "node:crypto";
import { getConnection, query } from "../../db/pool.js";
import { createMatch } from "../matches/service.js";
import { HttpError } from "../../utils/errors.js";

const MATCH_STATUSES = new Set(["pending", "declined", "cancelled", "scheduled", "in_transit", "delivered"]);

// Compatibility adapter for older marketplace callers. The canonical write path is
// the farmer-owned matches service, which validates the crop, target and capacity.
export async function createMatchRequest(data) {
  const idempotencyKey =
    data.idempotency_key ??
    crypto
      .createHash("sha256")
      .update(`${data.farmer_id}:${data.crop_id}:${data.partner_id ?? data.place_id}:${data.kg}`)
      .digest("hex")
      .slice(0, 64);

  const { match } = await createMatch(data.farmer_id, {
    crop_id: data.crop_id,
    kg: data.kg,
    price_per_kg: data.offer_price,
    pickup_date: data.pickup_date,
    partner_id: data.partner_id,
    place_id: data.place_id,
    notes: data.notes,
    idempotency_key: idempotencyKey,
  });
  return match;
}

export async function updateRequestStatus(requestId, status) {
  if (!MATCH_STATUSES.has(status)) throw new HttpError(400, "Invalid match request status");
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE match_requests
          SET status = :status
        WHERE id = :id`,
      { id: requestId, status }
    );
    if (!result.rowsAffected) return null;
    await connection.commit();
  } finally {
    await connection.close();
  }

  const { rows } = await query(
    `SELECT id, farmer_id, partner_id, place_id, crop_id, kg, price_per_kg,
            pickup_date, status, created_at, updated_at
       FROM match_requests
      WHERE id = :1`,
    [requestId]
  );
  return rows[0] ?? null;
}
