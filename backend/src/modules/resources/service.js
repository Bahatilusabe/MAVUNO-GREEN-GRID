import oracledb from "oracledb";
import { getConnection } from "../../db/pool.js";
export async function getResourcesByFarm(farmId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, farm_id, resource_type, name, quantity, unit, status, 
              TO_CHAR(purchase_date, 'YYYY-MM-DD') AS purchase_date, 
              TO_CHAR(expiry_date, 'YYYY-MM-DD') AS expiry_date, 
              cost, supplier, created_at, updated_at 
       FROM resources 
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

export async function createResource(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO resources (
         farm_id, resource_type, name, quantity, unit, status, 
         purchase_date, expiry_date, cost, supplier
       )
       VALUES (
         :farm_id, :type, :name, :qty, :unit, :status, 
         TO_DATE(:purchase_date, 'YYYY-MM-DD'), 
         TO_DATE(:expiry_date, 'YYYY-MM-DD'), 
         :cost, :supplier
       )
       RETURNING id, created_at INTO :out_id, :out_created_at`,
      {
        farm_id: data.farm_id,
        type: data.resource_type,
        name: data.name,
        qty: data.quantity,
        unit: data.unit,
        status: data.status,
        purchase_date: data.purchase_date || null,
        expiry_date: data.expiry_date || null,
        cost: data.cost || null,
        supplier: data.supplier || null,
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

export async function updateResourceQuantity(resourceId, quantity) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE resources 
       SET quantity = :quantity,
           status = CASE WHEN :quantity = 0 THEN 'DEPLETED' ELSE status END
       WHERE id = :id`,
      {
        quantity: quantity,
        id: resourceId
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}

export async function updateResourceStatus(resourceId, status) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `UPDATE resources 
       SET status = :status
       WHERE id = :id`,
      {
        status: status,
        id: resourceId
      },
      { autoCommit: true }
    );
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}