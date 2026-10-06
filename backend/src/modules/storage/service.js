import oracledb from "oracledb";
import { getConnection } from "../../db/pool.js";

export async function getStorageByFarm(farmId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, farm_id, facility_id, volume_tonnes, status, created_at, updated_at 
       FROM storage_reservations 
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

export async function createStorageReservation(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO storage_reservations (
         farm_id, facility_id, volume_tonnes, status
       )
       VALUES (
         :farm_id, :facility_id, :volume, :status
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        farm_id: data.farm_id,
        facility_id: data.facility_id,
        volume: data.volume_tonnes,
        status: data.status,
        out_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        out_created_at: { type: oracledb.TIMESTAMP, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
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

export async function updateStorageStatus(reservationId, status) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE storage_reservations 
       SET status = :status
       WHERE id = :id`,
      { status, id: reservationId },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}