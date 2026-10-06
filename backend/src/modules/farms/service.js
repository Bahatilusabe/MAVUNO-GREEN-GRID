import oracledb from "oracledb";
import { getConnection } from "../../db/pool.js";

export async function getFarmsByUser(userId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, user_id, name, location, latitude, longitude, 
              size_hectares, soil_type, climate_zone, status, 
              created_at, updated_at 
       FROM farms 
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

export async function createFarm(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO farms (
         user_id, name, location, latitude, longitude, 
         size_hectares, soil_type, climate_zone, status
       )
       VALUES (
         :user_id, :name, :location, :latitude, :longitude, 
         :size_hectares, :soil_type, :climate_zone, :status
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        user_id: data.user_id,
        name: data.name,
        location: data.location || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        size_hectares: data.size_hectares,
        soil_type: data.soil_type || null,
        climate_zone: data.climate_zone || null,
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

export async function updateFarmStatus(farmId, status) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE farms 
       SET status = :status
       WHERE id = :id`,
      {
        status: status,
        id: farmId
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}