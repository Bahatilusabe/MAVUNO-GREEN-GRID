import { randomUUID } from "node:crypto";
import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

// admins see every farm, everyone else only their own
const scope = (user) => (user.role === "admin" ? null : user.id);

const COLS = {
  name: "name", county: "county", subCounty: "sub_county", areaHa: "area_ha", farmType: "farm_type",
  waterSource: "water_source", irrigation: "irrigation", lat: "lat", lng: "lng", photoUrl: "photo_url",
};

export async function listFarms(user) {
  const ownerId = scope(user);
  let farmQuery = `SELECT id, name, county, sub_county AS "subCounty", area_ha AS "areaHa",
                          farm_type AS "farmType", water_source AS "waterSource", irrigation,
                          lat, lng, photo_url AS "photoUrl", created_at AS "createdAt"
                   FROM farms`;
  let farmParams = [];
  if (ownerId) {
    farmQuery += ` WHERE owner_id = :1`;
    farmParams.push(ownerId);
  }
  farmQuery += ` ORDER BY created_at DESC`;

  const farmsRes = await query(farmQuery, farmParams);
  const farms = farmsRes.rows;

  if (farms.length === 0) return [];

  const farmIds = farms.map(f => f.ID || f.id);
  const placeholders = farmIds.map((_, i) => `:id${i + 1}`).join(', ');
  
  const cropsRes = await query(
    `SELECT id AS "id", farm_id AS "farmId", name AS "name", stage AS "stage", 
            expected_kg AS "expectedKg", expected_harvest AS "expectedHarvest", risk AS "risk"
     FROM crops 
     WHERE farm_id IN (${placeholders})
     ORDER BY expected_harvest`,
    farmIds
  );

  const cropsByFarm = {};
  for (const c of cropsRes.rows) {
    const fId = c.FARMID || c.farmId;
    if (!cropsByFarm[fId]) cropsByFarm[fId] = [];
    cropsByFarm[fId].push({
      id: c.ID || c.id,
      name: c.NAME || c.name,
      stage: c.STAGE || c.stage,
      expectedKg: c.EXPECTEDKG || c.expectedKg,
      expectedHarvest: c.EXPECTEDHARVEST || c.expectedHarvest,
      risk: c.RISK || c.risk
    });
  }

  return farms.map(f => {
    const id = f.ID || f.id;
    return {
      id,
      name: f.NAME || f.name,
      county: f.COUNTY || f.county,
      subCounty: f.SUBCOUNTY || f.subCounty,
      areaHa: f.AREAA || f.areaha || f.areaHa,
      farmType: f.FARMTYPE || f.farmType,
      waterSource: f.WATERSOURCE || f.waterSource,
      irrigation: f.IRRIGATION || f.irrigation,
      lat: f.LAT || f.lat,
      lng: f.LNG || f.lng,
      photoUrl: f.PHOTOURL || f.photoUrl,
      createdAt: f.CREATEDAT || f.createdAt,
      crops: cropsByFarm[id] || []
    };
  });
}

// also serves as the ownership check: someone else's farm is a 404, not a 403
export async function getFarm(id, user) {
  const ownerId = scope(user);
  let farmQuery = `SELECT id, name, county, sub_county AS "subCounty", area_ha AS "areaHa",
                          farm_type AS "farmType", water_source AS "waterSource", irrigation,
                          lat, lng, photo_url AS "photoUrl", created_at AS "createdAt"
                   FROM farms WHERE id = :1`;
  let farmParams = [id];
  if (ownerId) {
    farmQuery += ` AND owner_id = :2`;
    farmParams.push(ownerId);
  }

  const { rows } = await query(farmQuery, farmParams);
  if (!rows[0]) throw new HttpError(404, "Farm not found");
  
  const f = rows[0];
  const farmId = f.ID || f.id;

  const cropsRes = await query(
    `SELECT id AS "id", name AS "name", stage AS "stage", 
            expected_kg AS "expectedKg", expected_harvest AS "expectedHarvest", risk AS "risk"
     FROM crops WHERE farm_id = :1 ORDER BY expected_harvest`,
    [farmId]
  );

  return {
    id: farmId,
    name: f.NAME || f.name,
    county: f.COUNTY || f.county,
    subCounty: f.SUBCOUNTY || f.subCounty,
    areaHa: f.AREAA || f.areaha || f.areaHa,
    farmType: f.FARMTYPE || f.farmType,
    waterSource: f.WATERSOURCE || f.waterSource,
    irrigation: f.IRRIGATION || f.irrigation,
    lat: f.LAT || f.lat,
    lng: f.LNG || f.lng,
    photoUrl: f.PHOTOURL || f.photoUrl,
    createdAt: f.CREATEDAT || f.createdAt,
    crops: cropsRes.rows.map(c => ({
      id: c.ID || c.id,
      name: c.NAME || c.name,
      stage: c.STAGE || c.stage,
      expectedKg: c.EXPECTEDKG || c.expectedKg,
      expectedHarvest: c.EXPECTEDHARVEST || c.expectedHarvest,
      risk: c.RISK || c.risk
    }))
  };
}

export async function createFarm(user, d) {
  const id = randomUUID();
  await query(
    `INSERT INTO farms (id, owner_id, name, county, sub_county, area_ha, farm_type, water_source, irrigation, lat, lng, photo_url)
     VALUES (:1, :2, :3, :4, :5, :6, COALESCE(:7, 'Smallholder'), :8, :9, :10, :11, :12)`,
    [id, user.id, d.name, d.county, d.subCounty ?? null, d.areaHa, d.farmType ?? null, d.waterSource ?? null,
      d.irrigation ?? null, d.lat ?? null, d.lng ?? null, d.photoUrl ?? null]
  );
  return getFarm(id, user);
}

export async function updateFarm(id, user, data) {
  await getFarm(id, user);
  const entries = Object.entries(data).filter(([k]) => k in COLS);
  if (!entries.length) throw new HttpError(400, "Nothing to update");
  const sets = entries.map(([k], i) => `${COLS[k]} = :${i + 2}`).join(", ");
  await query(`UPDATE farms SET ${sets} WHERE id = :1`, [id, ...entries.map(([, v]) => v)]);
  return getFarm(id, user);
}

export async function deleteFarm(id, user) {
  await getFarm(id, user);
  await query("DELETE FROM farms WHERE id = :1", [id]);
}

export async function addCrop(farmId, user, d) {
  await getFarm(farmId, user);
  const cropId = randomUUID();
  await query(
    `INSERT INTO crops (id, farm_id, name, stage, expected_kg, expected_harvest, risk)
     VALUES (:1, :2, :3, :4, :5, TO_DATE(:6, 'YYYY-MM-DD'), COALESCE(:7, 'low'))`,
    [cropId, farmId, d.name, d.stage ?? null, d.expectedKg, d.expectedHarvest ?? null, d.risk ?? null],
  );
  return getFarm(farmId, user);
}