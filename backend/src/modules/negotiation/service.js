import oracledb from "oracledb";
import { getConnection, query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const same = (a, b) => a != null && b != null && String(a).toUpperCase() === String(b).toUpperCase();

async function inTx(fn) {
  const conn = await getConnection();
  try {
    const out = await fn(conn);
    await conn.commit();
    return out;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.close();
  }
}

// The one place that decides who may touch a deal. Everything below goes through it.
// Outsiders get a 404 so the existence of a deal is not revealed.
async function assertParticipant(conn, matchId, userId, { lock = false } = {}) {
  if (lock) {
    await conn.execute(`SELECT id FROM match_requests WHERE id = :id FOR UPDATE`, { id: matchId });
  }
  const { rows } = await conn.execute(
    `SELECT m.id AS "id", m.status AS "status", m.kg AS "kg", m.price_per_kg AS "pricePerKg",
            m.farmer_id AS "farmerId", m.partner_id AS "partnerId", p.user_id AS "partnerUserId",
            c.name AS "crop"
       FROM match_requests m
       LEFT JOIN partners p ON p.id = m.partner_id
       LEFT JOIN crops c ON c.id = m.crop_id
      WHERE m.id = :id`,
    { id: matchId }
  );
  const match = rows[0];
  if (!match) throw new HttpError(404, "Deal not found");

  let side = null;
  if (same(match.farmerId, userId)) side = "farmer";
  else if (same(match.partnerUserId, userId)) side = "partner";
  if (!side) throw new HttpError(404, "Deal not found");
  if (!match.partnerId) throw new HttpError(409, "This request has no buyer to negotiate with");

  return { match, side, otherUserId: side === "farmer" ? match.partnerUserId : match.farmerId };
}

async function notify(conn, userId, matchId, title, body) {
  if (!userId) return;
  await conn.execute(
    `INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label, match_id)
     VALUES (:u, 'message', 'deal', 'green', :t, :b, 'messages', 'Open', :m)`,
    { u: userId, t: title, b: body, m: matchId }
  );
}

export async function listDeals(userId) {
  const { rows } = await query(
    `SELECT m.id AS "id", c.name AS "crop", m.kg AS "kg", m.price_per_kg AS "pricePerKg",
            m.status AS "status", p.name AS "partnerName",
            f.name AS "farmerName", f.county AS "county",
            TO_CHAR(m.pickup_date, 'YYYY-MM-DD') AS "pickupDate",
            CASE WHEN m.farmer_id = :1 THEN 'farmer' ELSE 'partner' END AS "side",
            (SELECT o.price_per_kg FROM match_offers o WHERE o.match_id = m.id AND o.status = 'pending') AS "pendingPrice",
            (SELECT o.made_by_role FROM match_offers o WHERE o.match_id = m.id AND o.status = 'pending') AS "pendingFrom",
            m.created_at AS "createdAt"
       FROM match_requests m
       JOIN partners p ON p.id = m.partner_id
       JOIN users f ON f.id = m.farmer_id
       LEFT JOIN crops c ON c.id = m.crop_id
      WHERE m.farmer_id = :2 OR p.user_id = :3
      ORDER BY m.created_at DESC`,
    [userId, userId, userId]
  );
  return rows;
}

export async function getDeal(userId, matchId) {
  const conn = await getConnection();
  try {
    const { match, side } = await assertParticipant(conn, matchId, userId);
    const offers = await conn.execute(
      `SELECT id AS "id", made_by_role AS "madeBy", price_per_kg AS "pricePerKg",
              status AS "status", created_at AS "createdAt"
         FROM match_offers WHERE match_id = :id ORDER BY created_at, id`,
      { id: matchId }
    );
    const messages = await conn.execute(
      `SELECT id AS "id", sender_role AS "senderRole", body AS "body", created_at AS "createdAt"
         FROM deal_messages WHERE match_id = :id ORDER BY created_at, id
         FETCH FIRST 500 ROWS ONLY`,
      { id: matchId }
    );
    return {
      deal: { id: match.id, crop: match.crop, kg: match.kg, pricePerKg: match.pricePerKg, status: match.status, side },
      offers: offers.rows,
      messages: messages.rows,
    };
  } finally {
    await conn.close();
  }
}

export async function postMessage(userId, matchId, body) {
  await inTx(async (conn) => {
    const { match, side, otherUserId } = await assertParticipant(conn, matchId, userId);
    if (match.status === "cancelled" || match.status === "declined") {
      throw new HttpError(409, `This deal is ${match.status}`);
    }
    await conn.execute(
      `INSERT INTO deal_messages (match_id, sender_id, sender_role, body) VALUES (:m, :u, :r, :b)`,
      { m: matchId, u: userId, r: side, b: body }
    );
    await notify(conn, otherUserId, matchId, "New message", `About ${match.kg} kg of ${match.crop}.`);
  });
  return getDeal(userId, matchId);
}

export async function makeOffer(userId, matchId, price) {
  await inTx(async (conn) => {
    const { match, side, otherUserId } = await assertParticipant(conn, matchId, userId, { lock: true });
    if (match.status !== "pending") throw new HttpError(409, "Negotiation is closed for this deal");

    const cur = await conn.execute(
      `SELECT id AS "id", made_by_role AS "madeBy" FROM match_offers WHERE match_id = :id AND status = 'pending'`,
      { id: matchId }
    );
    const pending = cur.rows[0];
    if (pending && pending.madeBy === side) {
      throw new HttpError(409, "Your offer is still waiting for a response");
    }
    if (pending) {
      await conn.execute(
        `UPDATE match_offers SET status = 'superseded', responded_at = SYSTIMESTAMP WHERE id = :id`,
        { id: pending.id }
      );
    }
    await conn.execute(
      `INSERT INTO match_offers (match_id, made_by_user_id, made_by_role, price_per_kg, status)
       VALUES (:m, :u, :r, :p, 'pending')`,
      { m: matchId, u: userId, r: side, p: price }
    );
    await notify(conn, otherUserId, matchId, "New offer", `${price} per kg for ${match.kg} kg of ${match.crop}.`);
  });
  return getDeal(userId, matchId);
}

export async function respondToOffer(userId, matchId, offerId, action) {
  await inTx(async (conn) => {
    const { match, side, otherUserId } = await assertParticipant(conn, matchId, userId, { lock: true });
    if (match.status !== "pending") throw new HttpError(409, "Negotiation is closed for this deal");

    const { rows } = await conn.execute(
      `SELECT id AS "id", made_by_role AS "madeBy", price_per_kg AS "price", status AS "status"
         FROM match_offers WHERE id = :o AND match_id = :m`,
      { o: offerId, m: matchId }
    );
    const offer = rows[0];
    if (!offer) throw new HttpError(404, "Offer not found");
    if (offer.status !== "pending") {
      throw new HttpError(409, "This offer is no longer open. It was countered or already answered.");
    }
    if (offer.madeBy === side) throw new HttpError(409, "You cannot respond to your own offer");

    if (action === "accept") {
      await conn.execute(
        `UPDATE match_offers SET status = 'accepted', responded_at = SYSTIMESTAMP WHERE id = :id`,
        { id: offer.id }
      );
      await conn.execute(
        `UPDATE match_requests SET price_per_kg = :p, status = 'scheduled' WHERE id = :id`,
        { p: offer.price, id: matchId }
      );
      await notify(conn, otherUserId, matchId, "Offer accepted", `Agreed at ${offer.price} per kg for ${match.kg} kg of ${match.crop}.`);
    } else {
      await conn.execute(
        `UPDATE match_offers SET status = 'declined', responded_at = SYSTIMESTAMP WHERE id = :id`,
        { id: offer.id }
      );
      await conn.execute(`UPDATE match_requests SET status = 'declined' WHERE id = :id`, { id: matchId });
      await notify(conn, otherUserId, matchId, "Offer declined", `The deal for ${match.kg} kg of ${match.crop} was declined.`);
    }
  });
  return getDeal(userId, matchId);
}
const NEXT_STATUS = { scheduled: "in_transit", in_transit: "delivered" };
const STATUS_TEXT = { in_transit: "is on its way", delivered: "was delivered" };

// Partner only. Moves an agreed deal one step: scheduled -> in_transit -> delivered.
export async function advanceDeal(userId, matchId) {
  await inTx(async (conn) => {
    const { match, side, otherUserId } = await assertParticipant(conn, matchId, userId, { lock: true });
    if (side !== "partner") throw new HttpError(403, "Only the buyer can update delivery status");
    const next = NEXT_STATUS[match.status];
    if (!next) throw new HttpError(409, `A ${match.status.replace("_", " ")} deal cannot be advanced`);

    await conn.execute(`UPDATE match_requests SET status = :s WHERE id = :id`, { s: next, id: matchId });
    await notify(
      conn,
      otherUserId,
      matchId,
      next === "delivered" ? "Order delivered" : "Order in transit",
      `Your ${match.kg} kg of ${match.crop} ${STATUS_TEXT[next]}.`
    );
  });
  return getDeal(userId, matchId);
}