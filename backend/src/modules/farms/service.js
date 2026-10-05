import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const SELECT = `
  SELECT f.id, f.name, f.county, f.sub_county AS "subCounty", f.area_ha AS "areaHa",
         f.farm_type AS "farmType", f.water_source AS "waterSource", f.irrigation,
         f.lat, f.lng, f.photo_url AS "photoUrl", f.created_at AS "createdAt",
         COALESCE(
           json_agg(json_build_object(
             'id', c.id, 'name', c.name, 'stage', c.stage, 'expectedKg', c.expected_kg,
             'expectedHarvest', c.expected_harvest, 'risk', c.risk
           ) ORDER BY c.expected_harvest) FILTER (WHERE c.id IS NOT NULL),
           '[]'
         ) AS crops
  FROM farms f
  LEFT JOIN crops c ON c.farm_id = f.id`;

// admins see every farm, everyone else only their own
const scope = (user) => (user.role === "admin" ? null : user.id);

const COLS = {
  name: "name", county: "county", subCounty: "sub_county", areaHa: "area_ha", farmType: "farm_type",
  waterSource: "water_source", irrigation: "irrigation", lat: "lat", lng: "lng", photoUrl: "photo_url",
};

export async function listFarms(user) {
  const { rows } = await query(
    `${SELECT} WHERE ($1::uuid IS NULL OR f.owner_id = $1) GROUP BY f.id ORDER BY f.created_at DESC`,
    [scope(user)],
  );
  return rows;
}

// also serves as the ownership check: someone else's farm is a 404, not a 403
export async function getFarm(id, user) {
  const { rows } = await query(
    `${SELECT} WHERE f.id = $2 AND ($1::uuid IS NULL OR f.owner_id = $1) GROUP BY f.id`,
    [scope(user), id],
  );
  if (!rows[0]) throw new HttpError(404, "Farm not found");
  return rows[0];
}

export async function createFarm(user, d) {
  const { rows } = await query(
    `INSERT INTO farms (owner_id, name, county, sub_county, area_ha, farm_type, water_source, irrigation, lat, lng, photo_url)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'Smallholder'), $7, $8, $9, $10, $11) RETURNING id`,
    [user.id, d.name, d.county, d.subCounty ?? null, d.areaHa, d.farmType ?? null, d.waterSource ?? null,
      d.irrigation ?? null, d.lat ?? null, d.lng ?? null, d.photoUrl ?? null],
  );
  return getFarm(rows[0].id, user);
}

export async function updateFarm(id, user, data) {
  await getFarm(id, user);
  const entries = Object.entries(data).filter(([k]) => k in COLS);
  if (!entries.length) throw new HttpError(400, "Nothing to update");
  const sets = entries.map(([k], i) => `${COLS[k]} = $${i + 2}`).join(", "); // column names come from the whitelist above
  await query(`UPDATE farms SET ${sets} WHERE id = $1`, [id, ...entries.map(([, v]) => v)]);
  return getFarm(id, user);
}

export async function deleteFarm(id, user) {
  await getFarm(id, user);
  await query("DELETE FROM farms WHERE id = $1", [id]);
}

export async function addCrop(farmId, user, d) {
  await getFarm(farmId, user);
  await query(
    `INSERT INTO crops (farm_id, name, stage, expected_kg, expected_harvest, risk)
     VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'low'))`,
    [farmId, d.name, d.stage ?? null, d.expectedKg, d.expectedHarvest ?? null, d.risk ?? null],
  );
  return getFarm(farmId, user);
}