import oracledb from "oracledb";
import { getConnection } from "../../db/pool.js";

export async function getTransportRequestsByFarm(farmId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, farm_id, transporter_id, load_weight_kg, 
              pickup_lat, pickup_lng, status, created_at, updated_at 
       FROM transport_requests 
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

export async function createTransportRequest(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO transport_requests (
         farm_id, load_weight_kg, pickup_lat, pickup_lng, status
       )
       VALUES (
         :farm_id, :weight, :lat, :lng, :status
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        farm_id: data.farm_id,
        weight: data.load_weight_kg,
        lat: data.pickup_lat || null,
        lng: data.pickup_lng || null,
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

export async function updateTransportStatus(requestId, data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE transport_requests 
       SET status = :status,
           transporter_id = COALESCE(:transporter_id, transporter_id)
       WHERE id = :id`,
      {
        status: data.status,
        transporter_id: data.transporter_id || null,
        id: requestId
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}