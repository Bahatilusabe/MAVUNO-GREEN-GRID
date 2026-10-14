import { getConnection } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const SELECT = `
  SELECT id AS "id", name AS "name", type AS "type", county AS "county",
         price_per_kg AS "pricePerKg", capacity_kg AS "capacityKg",
         accepting AS "accepting", status AS "status"
    FROM partners WHERE user_id = :uid`;

function shape(row) {
  return { ...row, accepting: row.accepting === 1 };
}

export async function getMyPartner(userId) {
  const conn = await getConnection();
  try {
    const { rows } = await conn.execute(SELECT, { uid: userId });
    if (!rows[0]) throw new HttpError(404, "No partner profile is linked to this account");
    return shape(rows[0]);
  } finally {
    await conn.close();
  }
}

export async function updateMyPartner(userId, d) {
  // Column names come from this fixed list, never from user input
  const sets = [];
  const binds = { uid: userId };
  if (d.price_per_kg !== undefined) {
    sets.push("price_per_kg = :price");
    binds.price = d.price_per_kg;
  }
  if (d.capacity_kg !== undefined) {
    sets.push("capacity_kg = :cap");
    binds.cap = d.capacity_kg;
  }
  if (d.accepting !== undefined) {
    sets.push("accepting = :acc");
    binds.acc = d.accepting ? 1 : 0;
  }
  if (!sets.length) throw new HttpError(400, "Nothing to update");

  const conn = await getConnection();
  try {
    if (d.capacity_kg !== undefined) {
      const { rows } = await conn.execute(
        `SELECT NVL(SUM(m.kg), 0) AS "load"
           FROM match_requests m JOIN partners p ON p.id = m.partner_id
          WHERE p.user_id = :uid AND m.status IN ('scheduled', 'in_transit')`,
        { uid: userId }
      );
      if (d.capacity_kg < rows[0].load) {
        throw new HttpError(409, `Capacity can't go below your current load (${rows[0].load} kg)`);
      }
    }
    const res = await conn.execute(
      `UPDATE partners SET ${sets.join(", ")} WHERE user_id = :uid`,
      binds,
      { autoCommit: true }
    );
    if (!res.rowsAffected) throw new HttpError(404, "No partner profile is linked to this account");
  } finally {
    await conn.close();
  }
  return getMyPartner(userId);
}