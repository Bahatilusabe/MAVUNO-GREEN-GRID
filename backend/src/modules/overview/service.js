import { query } from "../../db/pool.js";

const AI_SURPLUS_URL =
  process.env.AI_SURPLUS_URL || "http://localhost:8010/api/v1/surplus-alerts";

const AI_TTL_MS = 10 * 60 * 1000;
const aiCache = { at: 0, data: null, inflight: null };

async function fetchAiSurplus() {
  const res = await fetch(AI_SURPLUS_URL, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new Error(`AI backend returned HTTP ${res.status}`);
  const json = await res.json();
  if (json?.status !== "success") throw new Error("AI backend returned an error payload");
  return {
    alerts: Array.isArray(json.data) ? json.data : [],
    globalImpact: json.global_impact ?? null,
  };
}

// Never blocks: returns the cached value (possibly stale or null) and refreshes in the background
function getAiSurplus() {
  const fresh = aiCache.data && Date.now() - aiCache.at < AI_TTL_MS;
  if (!fresh && !aiCache.inflight) {
    aiCache.inflight = fetchAiSurplus()
      .then((data) => {
        aiCache.data = data;
        aiCache.at = Date.now();
      })
      .catch((err) => console.warn("AI surplus service unavailable:", err.message))
      .finally(() => {
        aiCache.inflight = null;
      });
  }
  return aiCache.data;
}

export async function getOverview(userId) {
  const ai = getAiSurplus();

  const [farmsRes, cropsRes, notesRes] = await Promise.all([
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
    query(
      `SELECT id AS "id",
              kind AS "kind",
              icon AS "icon",
              tone AS "tone",
              title AS "title",
              body AS "body",
              action_to AS "actionTo",
              action_label AS "actionLabel",
              unread AS "unread",
              created_at AS "createdAt"
         FROM notifications
        WHERE user_id = :1 AND dismissed_at IS NULL
        ORDER BY created_at DESC
        FETCH FIRST 6 ROWS ONLY`,
      [userId]
    ),
  ]);

  const crops = cropsRes.rows;
  const high = crops.filter((c) => c.risk === "high");
  const top = [...high].sort((a, b) => b.expectedKg - a.expectedKg)[0];

  const aiAlerts = ai?.alerts ?? [];
  const globalImpact = ai?.globalImpact ?? null;

  // The AI models regional supply, so only its risk ratio is used here, never its tonnage.
  const totalSurplusT = aiAlerts.reduce((s, a) => s + Number(a.surplus_t || 0), 0);
  const weightedRisk =
    totalSurplusT > 0
      ? aiAlerts.reduce(
          (s, a) => s + Number(a.surplus_t || 0) * Number(a.risk || 0),
          0
        ) / totalSurplusT
      : null;

  const highKg = high.reduce((sum, c) => sum + c.expectedKg, 0);
  const atRiskKg = Math.round(highKg * (weightedRisk ?? 1));

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
          exposedKg: Math.round(top.expectedKg * (weightedRisk ?? 1)),
        }
      : null,
    harvests: crops,
    activity: notesRes.rows,
    aiSurplusAlerts: aiAlerts,
  };
}