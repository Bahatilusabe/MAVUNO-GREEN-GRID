import { query } from "../../db/pool.js";

// placeholder until the AI surplus forecast supplies real exposure per crop
const EXPOSED_SHARE = 0.8;

export async function getOverview(userId) {
  const [farmsRes, cropsRes] = await Promise.all([
    query(
      `SELECT count(*) AS "farms", COALESCE(sum(area_ha), 0) AS "areaHa" 
       FROM farms 
       WHERE owner_id = :1`, 
      [userId]
    ),
    query(
      `SELECT c.id, c.name, c.stage, c.expected_kg AS "expectedKg", c.expected_harvest AS "expectedHarvest", c.risk,
              f.id AS "farmId", f.name AS "farm"
       FROM crops c JOIN farms f ON f.id = c.farm_id
       WHERE f.owner_id = :1
       ORDER BY c.expected_harvest NULLS LAST`,
      [userId],
    ),
  ]);

  const crops = cropsRes.rows;
  const high = crops.filter((c) => c.risk === "high");
  const exposed = (c) => Math.round(c.expectedKg * EXPOSED_SHARE);
  const top = [...high].sort((a, b) => b.expectedKg - a.expectedKg)[0];

  return {
    stats: {
      farms: farmsRes.rows[0].farms,
      areaHa: farmsRes.rows[0].areaHa,
      expectedKg: crops.reduce((s, c) => s + c.expectedKg, 0),
      atRiskKg: high.reduce((s, c) => s + exposed(c), 0),
      highRiskCrops: high.length,
    },
    topRisk: top
      ? { cropId: top.id, crop: top.name, farmId: top.farmId, farm: top.farm, expectedKg: top.expectedKg, exposedKg: exposed(top) }
      : null,
    harvests: crops,
  };
}