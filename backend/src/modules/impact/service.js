import oracledb from "oracledb";
import { getConnection } from "../../db/pool.js";
export async function getGlobalImpactSummary() {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT 
         SUM(waste_diverted_kg) AS TOTAL_WASTE_DIVERTED,
         SUM(co2_saved_kg) AS TOTAL_CO2_SAVED,
         SUM(water_saved_liters) AS TOTAL_WATER_SAVED
       FROM impact_metrics`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  } finally {
    if (connection) await connection.close();
  }
}

export async function getImpactByUser(userId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT * FROM impact_metrics 
       WHERE user_id = :userId 
       ORDER BY created_at DESC`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function recordImpactMetric(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO impact_metrics (
         user_id, county, waste_diverted_kg, co2_saved_kg, water_saved_liters, intervention_type
       )
       VALUES (
         :user_id, :county, :waste, :co2, :water, :type
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        user_id: data.user_id,
        county: data.county,
        waste: data.waste_diverted_kg,
        co2: data.co2_saved_kg,
        water: data.water_saved_liters,
        type: data.intervention_type,
        // Oracle requires out-binds to return generated data
        out_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        out_created_at: { type: oracledb.DATE, dir: oracledb.BIND_OUT }
      },
      { 
        autoCommit: true, 
        outFormat: oracledb.OUT_FORMAT_OBJECT 
      }
    );
    
    return {
      id: result.outBinds.out_id[0],
      created_at: result.outBinds.out_created_at[0],
      ...data
    };
  } finally {
    if (connection) await connection.close();
  }
}