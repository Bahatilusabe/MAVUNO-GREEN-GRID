import { getConnection } from "../../db/pool.js";

export async function getCropsByFarm(farmId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, farm_id, crop_type, variety, 
              TO_CHAR(planting_date, 'YYYY-MM-DD') AS planting_date, 
              TO_CHAR(expected_harvest_date, 'YYYY-MM-DD') AS expected_harvest_date, 
              TO_CHAR(actual_harvest_date, 'YYYY-MM-DD') AS actual_harvest_date, 
              area_planted, expected_yield, actual_yield, yield_unit, status, 
              created_at, updated_at 
       FROM crops 
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

export async function createCrop(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO crops (
         farm_id, crop_type, variety, planting_date, expected_harvest_date, 
         area_planted, expected_yield, yield_unit, status
       )
       VALUES (
         :farm_id, :crop_type, :variety, 
         TO_DATE(:planting_date, 'YYYY-MM-DD'), 
         TO_DATE(:expected_harvest_date, 'YYYY-MM-DD'), 
         :area_planted, :expected_yield, :yield_unit, :status
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        farm_id: data.farm_id,
        crop_type: data.crop_type,
        variety: data.variety || null,
        planting_date: data.planting_date || null,
        expected_harvest_date: data.expected_harvest_date || null,
        area_planted: data.area_planted || null,
        expected_yield: data.expected_yield || null,
        yield_unit: data.yield_unit,
        status: data.status,
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

export async function recordCropHarvest(cropId, data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE crops 
       SET actual_harvest_date = TO_DATE(:actual_date, 'YYYY-MM-DD'),
           actual_yield = :actual_yield,
           status = :status
       WHERE id = :id`,
      {
        actual_date: data.actual_harvest_date,
        actual_yield: data.actual_yield,
        status: data.status,
        id: cropId
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}