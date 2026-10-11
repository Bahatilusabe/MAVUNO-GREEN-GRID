import oracledb from "oracledb";
import { getConnection, query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const CROP_SELECT = `
  c.id AS "id",
  c.farm_id AS "farmId",
  c.name AS "name",
  c.variety AS "variety",
  c.stage AS "stage",
  c.status AS "status",
  c.expected_kg AS "expectedKg",
  TO_CHAR(c.planting_date, 'YYYY-MM-DD') AS "plantingDate",
  TO_CHAR(c.expected_harvest, 'YYYY-MM-DD') AS "expectedHarvest",
  TO_CHAR(c.actual_harvest_date, 'YYYY-MM-DD') AS "actualHarvestDate",
  c.actual_kg AS "actualKg",
  c.risk AS "risk"`;

// Rough days from planting to first harvest. Defaults only: confirm with an agronomist
// and let the farmer override expected_harvest.
const MATURITY_DAYS = {
  tomatoes: 90,
  "french beans": 60,
  kale: 60,
  cabbage: 80,
  maize: 120,
  rice: 120,
  potatoes: 100,
  beans: 85,
  onions: 120,
};

export function defaultHarvestDate(cropName, plantingDate) {
  const days = MATURITY_DAYS[String(cropName ?? "").trim().toLowerCase()];
  if (!days || !plantingDate) return null;
  const [y, m, d] = plantingDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export async function listCrops(ownerId, farmId) {
  const binds = [ownerId];
  let extra = "";
  if (farmId) {
    extra = " AND c.farm_id = :2";
    binds.push(farmId);
  }
  const { rows } = await query(
    `SELECT ${CROP_SELECT}
       FROM crops c
       JOIN farms f ON f.id = c.farm_id
      WHERE f.owner_id = :1${extra}
      ORDER BY c.expected_harvest NULLS LAST`,
    binds
  );
  return rows;
}

export async function getCrop(ownerId, id) {
  const { rows } = await query(
    `SELECT ${CROP_SELECT}
       FROM crops c
       JOIN farms f ON f.id = c.farm_id
      WHERE c.id = :1 AND f.owner_id = :2`,
    [id, ownerId]
  );
  if (!rows[0]) throw new HttpError(404, "Crop not found");
  return rows[0];
}

export async function createCrop(ownerId, d) {
  const farm = await query(
    `SELECT id AS "id" FROM farms WHERE id = :1 AND owner_id = :2`,
    [d.farm_id, ownerId]
  );
  if (!farm.rows[0]) throw new HttpError(404, "Farm not found");

  const expectedHarvest = d.expected_harvest ?? defaultHarvestDate(d.name, d.planting_date);

  let id;
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `INSERT INTO crops (farm_id, name, variety, stage, status, expected_kg, planting_date, expected_harvest)
       VALUES (:farm_id, :name, :variety, :stage, NVL(:status, 'growing'), :expected_kg,
               TO_DATE(:planting_date, 'YYYY-MM-DD'), TO_DATE(:expected_harvest, 'YYYY-MM-DD'))
       RETURNING id INTO :out_id`,
      {
        farm_id: d.farm_id,
        name: d.name,
        variety: d.variety ?? null,
        stage: d.stage ?? null,
        status: d.status ?? null,
        expected_kg: d.expected_kg ?? 0,
        planting_date: d.planting_date ?? null,
        expected_harvest: expectedHarvest ?? null,
        out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      },
      { autoCommit: true }
    );
    id = result.outBinds.out_id[0];
  } finally {
    await conn.close();
  }
  return getCrop(ownerId, id);
}

const UPDATABLE = [
  ["name", "name = :name"],
  ["variety", "variety = :variety"],
  ["stage", "stage = :stage"],
  ["status", "status = :status"],
  ["expected_kg", "expected_kg = :expected_kg"],
  ["planting_date", "planting_date = TO_DATE(:planting_date, 'YYYY-MM-DD')"],
  ["expected_harvest", "expected_harvest = TO_DATE(:expected_harvest, 'YYYY-MM-DD')"],
];

const OWNED = "id = :id AND farm_id IN (SELECT id FROM farms WHERE owner_id = :owner_id)";

export async function updateCrop(ownerId, id, input) {
  const current = await getCrop(ownerId, id); // also enforces ownership (404)
  const d = { ...input };

  // New planting date without an explicit harvest date: recompute from the crop's default maturity
  if (d.planting_date && d.expected_harvest === undefined) {
    const computed = defaultHarvestDate(d.name ?? current.name, d.planting_date);
    if (computed) d.expected_harvest = computed;
  }

  const sets = [];
  const binds = { id, owner_id: ownerId };
  for (const [key, sql] of UPDATABLE) {
    if (d[key] !== undefined) {
      sets.push(sql);
      binds[key] = d[key];
    }
  }
  if (!sets.length) throw new HttpError(400, "Nothing to update");

  const conn = await getConnection();
  try {
    await conn.execute(`UPDATE crops SET ${sets.join(", ")} WHERE ${OWNED}`, binds, { autoCommit: true });
  } finally {
    await conn.close();
  }
  return getCrop(ownerId, id);
}

export async function recordHarvest(ownerId, id, { actual_kg, actual_harvest_date }) {
  await getCrop(ownerId, id);
  const harvestDate = actual_harvest_date ?? new Date().toISOString().slice(0, 10);

  const conn = await getConnection();
  try {
    await conn.execute(
      `UPDATE crops
          SET actual_kg = :actual_kg,
              actual_harvest_date = TO_DATE(:harvest_date, 'YYYY-MM-DD'),
              status = 'harvested'
        WHERE ${OWNED}`,
      { actual_kg, harvest_date: harvestDate, id, owner_id: ownerId },
      { autoCommit: true }
    );
  } finally {
    await conn.close();
  }
  return getCrop(ownerId, id);
}

export async function deleteCrop(ownerId, id) {
  const conn = await getConnection();
  let affected;
  try {
    const result = await conn.execute(`DELETE FROM crops WHERE ${OWNED}`, { id, owner_id: ownerId }, { autoCommit: true });
    affected = result.rowsAffected;
  } finally {
    await conn.close();
  }
  if (!affected) throw new HttpError(404, "Crop not found");
}