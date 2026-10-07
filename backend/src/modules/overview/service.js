import { query } from "../../db/pool.js";

const AI_SURPLUS_URL =
  process.env.AI_SURPLUS_URL || "http://localhost:8010/api/v1/surplus-alerts";

export async function getOverview(userId) {
  const [farmsRes, cropsRes] = await Promise.all([
    query(
      `SELECT COUNT(*) AS "farms", NVL(SUM(area_ha), 0) AS "areaHa"
         FROM farms
        WHERE owner_id = :1`,
      [userId]
    ),
    query(
      `SELECT c.id AS "id",
              c.name AS "name",
              c.stage AS "stage",
              c.expected_kg AS "expectedKg",
              TO_CHAR(c.expected_harvest, 'YYYY-MM-DD') AS "expectedHarvest",
              c.risk AS "risk",
              f.id AS "farmId",
              f.name AS "farm"
         FROM crops c
         JOIN farms f ON f.id = c.farm_id
        WHERE f.owner_id = :1
        ORDER BY c.expected_harvest NULLS LAST`,
      [userId]
    ),
  ]);

  const crops = cropsRes.rows;
  const high = crops.filter((c) => c.risk === "high");
  const top = [...high].sort((a, b) => b.expectedKg - a.expectedKg)[0];

  let aiAlerts = [];
  let globalImpact = null;
  try {
    const aiResponse = await fetch(AI_SURPLUS_URL, {
      signal: AbortSignal.timeout(120_000),
    });
    if (!aiResponse.ok) {
      throw new Error(`AI backend returned HTTP ${aiResponse.status}`);
    }
    const aiJson = await aiResponse.json();
    if (aiJson?.status === "success") {
      aiAlerts = Array.isArray(aiJson.data) ? aiJson.data : [];
      globalImpact = aiJson.global_impact ?? null;
    }
  } catch (error) {
    console.warn("AI surplus service unavailable:", error.message);
  }

  const atRiskKg =
    aiAlerts.length > 0
      ? Math.round(
          aiAlerts.reduce(
            (sum, a) => sum + Number(a.surplus_t || 0) * 1000 * Number(a.risk || 0),
            0
          )
        )
      : high.reduce((sum, c) => sum + c.expectedKg, 0);

  const alertSurplusKg = aiAlerts.reduce(
    (sum, a) => sum + Number(a.surplus_t || 0) * 1000,
    0
  );
  const surplusWeightedRisk = alertSurplusKg > 0 ? atRiskKg / alertSurplusKg : null;

  return {
    stats: {
      farms: farmsRes.rows[0].farms,
      areaHa: farmsRes.rows[0].areaHa,
      expectedKg: crops.reduce((s, c) => s + c.expectedKg, 0),
      atRiskKg,
      highRiskCrops: high.length,
      aiGlobalImpact: globalImpact,
    },
    topRisk: top
      ? {
          cropId: top.id,
          crop: top.name,
          farmId: top.farmId,
          farm: top.farm,
          expectedKg: top.expectedKg,
          exposedKg: Math.round(top.expectedKg * (surplusWeightedRisk ?? 1)),
        }
      : null,
    harvests: crops,
    aiSurplusAlerts: aiAlerts,
  };
}