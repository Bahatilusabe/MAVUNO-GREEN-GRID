import oracledb from "oracledb";
import { getConnection } from "../../db/pool.js";

export async function getInterventionsByFarm(farmId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, farm_id, crop_id, intervention_type, description, 
              TO_CHAR(recommended_date, 'YYYY-MM-DD') AS recommended_date,
              TO_CHAR(implementation_date, 'YYYY-MM-DD') AS implementation_date,
              TO_CHAR(completion_date, 'YYYY-MM-DD') AS completion_date,
              status, outcome, cost, priority, created_at, updated_at
       FROM interventions 
       WHERE farm_id = :farmId 
       ORDER BY created_at DESC`,
      { farmId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createIntervention(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO interventions (
         farm_id, crop_id, intervention_type, description, 
         recommended_date, implementation_date, completion_date, 
         status, outcome, cost, priority
       )
       VALUES (
         :farm_id, :crop_id, :type, :description,
         TO_DATE(:rec_date, 'YYYY-MM-DD'),
         TO_DATE(:imp_date, 'YYYY-MM-DD'),
         TO_DATE(:comp_date, 'YYYY-MM-DD'),
         :status, :outcome, :cost, :priority
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        farm_id: data.farm_id,
        crop_id: data.crop_id || null,
        type: data.intervention_type,
        description: data.description || null,
        rec_date: data.recommended_date || null,
        imp_date: data.implementation_date || null,
        comp_date: data.completion_date || null,
        status: data.status,
        outcome: data.outcome || null,
        cost: data.cost || null,
        priority: data.priority,
        out_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
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

export async function updateInterventionStatus(interventionId, data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE interventions 
       SET status = :status,
           outcome = COALESCE(:outcome, outcome),
           completion_date = COALESCE(TO_DATE(:comp_date, 'YYYY-MM-DD'), completion_date)
       WHERE id = :id`,
      {
        status: data.status,
        outcome: data.outcome || null,
        comp_date: data.completion_date || null,
        id: interventionId
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}