import oracledb from "oracledb";
import { getConnection, query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";
import { listCrops } from "../crops/service.js";

const FARM_SELECT = `
  f.id AS "id",
  f.name AS "name",
  f.county AS "county",
  f.sub_county AS "subCounty",
  f.area_ha AS "areaHa",
  f.farm_type AS "farmType",
  f.water_source AS "waterSource",
  f.irrigation AS "irrigation",
  f.lat AS "lat",
  f.lng AS "lng",
  f.photo_url AS "photoUrl",
  f.video_url AS "videoUrl"`;

export async function listFarms(ownerId) {
  const [farmsRes, crops] = await Promise.all([
    query(`SELECT ${FARM_SELECT} FROM farms f WHERE f.owner_id = :1 ORDER BY f.created_at`, [ownerId]),
    listCrops(ownerId),
  ]);
  return farmsRes.rows.map((f) => ({ ...f, crops: crops.filter((c) => c.farmId === f.id) }));
}

export async function getFarm(ownerId, id) {
  const { rows } = await query(
    `SELECT ${FARM_SELECT} FROM farms f WHERE f.id = :1 AND f.owner_id = :2`,
    [id, ownerId]
  );
  if (!rows[0]) throw new HttpError(404, "Farm not found");
  return { ...rows[0], crops: await listCrops(ownerId, id) };
}

export async function createFarm(ownerId, d) {
  let id;
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `INSERT INTO farms (owner_id, name, county, sub_county, area_ha, farm_type, water_source, irrigation, lat, lng,video_url)
       VALUES (:owner_id, :name, :county, :sub_county, :area_ha, NVL(:farm_type, 'Smallholder'),
               :water_source, :irrigation, :lat, :lng , :video_url)
       RETURNING id INTO :out_id`,
      {
        owner_id: ownerId,
        name: d.name,
        county: d.county,
        sub_county: d.sub_county ?? null,
        area_ha: d.area_ha,
        farm_type: d.farm_type ?? null,
        water_source: d.water_source ?? null,
        irrigation: d.irrigation ?? null,
        lat: d.lat ?? null,
        lng: d.lng ?? null,
        video_url: d.video_url ?? null,
        out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      { autoCommit: true }
    );
    id = result.outBinds.out_id[0];
  } finally {
    await conn.close();
  }
  return getFarm(ownerId, id);
}

const COLUMNS = [
  "name",
  "county",
  "sub_county",
  "area_ha",
  "farm_type",
  "water_source",
  "irrigation",
  "lat",
  "lng",
  "video_url",
];

export async function updateFarm(ownerId, id, d) {
  const sets = [];
  const binds = { id, owner_id: ownerId };
  for (const col of COLUMNS) {
    if (d[col] !== undefined) {
      sets.push(`${col} = :${col}`);
      binds[col] = d[col];
    }
  }
  if (!sets.length) throw new HttpError(400, "Nothing to update");

  let affected;
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `UPDATE farms SET ${sets.join(", ")} WHERE id = :id AND owner_id = :owner_id`,
      binds,
      { autoCommit: true }
    );
    affected = result.rowsAffected;
  } finally {
    await conn.close();
  }
  if (!affected) throw new HttpError(404, "Farm not found");
  return getFarm(ownerId, id);
}

export async function deleteFarm(ownerId, id) {
  let affected;
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `DELETE FROM farms WHERE id = :id AND owner_id = :owner_id`,
      { id, owner_id: ownerId },
      { autoCommit: true }
    );
    affected = result.rowsAffected;
  } finally {
    await conn.close();
  }
  if (!affected) throw new HttpError(404, "Farm not found");
}