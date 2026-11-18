import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const USER_SELECT = `
  u.id AS "id",
  u.name AS "name",
  u.email AS "email",
  u.phone AS "phone",
  u.role AS "role",
  u.status AS "status",
  u.county AS "county",
  TO_CHAR(u.created_at, 'YYYY-MM-DD') AS "createdAt",
  (SELECT COUNT(*) FROM farms f WHERE f.owner_id = u.id) AS "farms",
  (SELECT NVL(SUM(c.expected_kg), 0)
     FROM crops c JOIN farms f ON f.id = c.farm_id
    WHERE f.owner_id = u.id) AS "kg"`;

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
  TO_CHAR(p.created_at, 'YYYY-MM-DD') AS "createdAt",
  u.name AS "userName",
  u.email AS "userEmail",
  (SELECT COUNT(*) FROM match_requests m WHERE m.partner_id = p.id) AS "requests",
  (SELECT COUNT(*) FROM match_requests m WHERE m.partner_id = p.id AND m.status = 'pending') AS "pendingRequests"`;

export async function listUsers() {
  const { rows } = await query(
    `SELECT ${USER_SELECT} FROM users u ORDER BY u.created_at DESC`
  );
  return rows.map((u) => ({ ...u, kg: Number(u.kg || 0) }));
}

export async function setUserStatus(id, status) {
  const { rows } = await query(`SELECT id FROM users WHERE id = :1`, [id]);
  if (!rows[0]) throw new HttpError(404, "User not found");

  await query(`UPDATE users SET status = :1 WHERE id = :2`, [status, id]);
  return { id, status };
}

export async function listPartners() {
  const { rows } = await query(
    `SELECT ${PARTNER_SELECT} FROM partners p LEFT JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC`
  );
  return rows;
}

export async function setPartnerStatus(id, d) {
  const { rows } = await query(`SELECT id FROM partners WHERE id = :1`, [id]);
  if (!rows[0]) throw new HttpError(404, "Partner not found");

  // Only the fields the caller supplied are written, so approving a partner
  // never silently unlinks the account that owns them.
  const sets = [];
  const binds = [];

  if (d.status !== undefined) {
    sets.push(`status = :${binds.length + 1}`);
    binds.push(d.status);
  }
  if (d.userId !== undefined) {
    sets.push(`user_id = :${binds.length + 1}`);
    binds.push(d.userId || null);
  }
  if (!sets.length) throw new HttpError(400, "Nothing to update");

  binds.push(id);
  await query(`UPDATE partners SET ${sets.join(", ")} WHERE id = :${binds.length}`, binds);

  if (d.status === "approved" || d.status === "rejected") {
    await query(
      `INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label)
       SELECT p.user_id, 'system', 'shield', :1, :2, :3, 'settings', 'Review'
         FROM partners p
        WHERE p.id = :4 AND p.user_id IS NOT NULL`,
      [
        d.status === "approved" ? "green" : "amber",
        d.status === "approved" ? "Partner account approved" : "Partner account rejected",
        d.status === "approved"
          ? "Your partner profile is live. Farmer requests will now reach your inbox."
          : "Your partner profile was not approved. Contact the platform team for details.",
        id,
      ]
    );
  }

  const { rows: after } = await query(
    `SELECT ${PARTNER_SELECT} FROM partners p LEFT JOIN users u ON u.id = p.user_id WHERE p.id = :1`,
    [id]
  );
  return after[0];
}

/**
 * Platform-wide numbers for the admin KPI row. Every figure comes from the
 * database so the console and the farmer's own numbers cannot disagree.
 */
export async function platformSummary() {
  const [users, partners, farms, crops, alerts, matches] = await Promise.all([
    query(`SELECT COUNT(*) AS "total",
                  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS "active",
                  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS "pending"
             FROM users WHERE role = 'farmer'`),
    query(`SELECT COUNT(*) AS "total",
                  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS "pending",
                  SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS "approved"
             FROM partners`),
    query(`SELECT COUNT(*) AS "total", NVL(SUM(area_ha), 0) AS "areaHa" FROM farms`),
    query(`SELECT NVL(SUM(expected_kg), 0) AS "kg",
                  SUM(CASE WHEN risk = 'high' THEN 1 ELSE 0 END) AS "highRisk"
             FROM crops`),
    query(`SELECT COUNT(*) AS "total" FROM notifications
            WHERE kind = 'alert' AND dismissed_at IS NULL`),
    query(`SELECT COUNT(*) AS "total",
                  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS "pending"
             FROM match_requests`),
  ]);

  return {
    farmers: Number(users.rows[0]?.total || 0),
    activeFarmers: Number(users.rows[0]?.active || 0),
    pendingFarmers: Number(users.rows[0]?.pending || 0),
    partners: Number(partners.rows[0]?.total || 0),
    pendingPartners: Number(partners.rows[0]?.pending || 0),
    approvedPartners: Number(partners.rows[0]?.approved || 0),
    farms: Number(farms.rows[0]?.total || 0),
    areaHa: Number(farms.rows[0]?.areaHa || 0),
    expectedKg: Number(crops.rows[0]?.kg || 0),
    highRiskCrops: Number(crops.rows[0]?.highRisk || 0),
    openAlerts: Number(alerts.rows[0]?.total || 0),
    matchRequests: Number(matches.rows[0]?.total || 0),
    pendingMatches: Number(matches.rows[0]?.pending || 0),
  };
}

/** Per-county exposure used by the admin risk chart. */
export async function countyRisk() {
  const { rows } = await query(
    `SELECT f.county AS "county",
            COUNT(DISTINCT f.id) AS "farms",
            NVL(SUM(c.expected_kg), 0) AS "kg",
            SUM(CASE WHEN c.risk = 'high' THEN 1 ELSE 0 END) AS "highRisk",
            SUM(CASE WHEN c.risk = 'medium' THEN 1 ELSE 0 END) AS "mediumRisk"
       FROM farms f
       LEFT JOIN crops c ON c.farm_id = f.id
      GROUP BY f.county
      ORDER BY f.county`
  );

  return rows.map((r) => {
    const farms = Number(r.farms || 0);
    const high = Number(r.highRisk || 0);
    const medium = Number(r.mediumRisk || 0);
    return {
      county: r.county,
      farms,
      kg: Number(r.kg || 0),
      // Share of crops flagged high or medium — the same 0-100 scale the
      // horizontal risk bars already use.
      risk: farms ? Math.round(((high + medium) / farms) * 100) : 0,
    };
  });
}
