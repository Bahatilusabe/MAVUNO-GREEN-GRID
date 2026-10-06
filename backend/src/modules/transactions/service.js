import oracledb from "oracledb";
import { getConnection } from "../../db/pool.js";

export async function getTransactionsByUser(userId) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, buyer_id, seller_id, crop_id, transaction_type, 
              quantity, unit, unit_price, total_amount, 
              status, payment_status, delivery_status, 
              TO_CHAR(transaction_date, 'YYYY-MM-DD HH24:MI:SS') AS transaction_date,
              TO_CHAR(payment_date, 'YYYY-MM-DD') AS payment_date,
              notes, created_at, updated_at 
       FROM transactions 
       WHERE buyer_id = :userId OR seller_id = :userId 
       ORDER BY transaction_date DESC`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
}

export async function createTransaction(data) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `INSERT INTO transactions (
         buyer_id, seller_id, crop_id, transaction_type, 
         quantity, unit, unit_price, total_amount, 
         status, payment_status, delivery_status, notes
       )
       VALUES (
         :buyer, :seller, :crop, :type, 
         :qty, :unit, :price, :total, 
         :status, :pay_status, :del_status, :notes
       )
       RETURNING id, transaction_date INTO :out_id, :out_trans_date`,
      {
        buyer: data.buyer_id,
        seller: data.seller_id,
        crop: data.crop_id || null,
        type: data.transaction_type,
        qty: data.quantity,
        unit: data.unit,
        price: data.unit_price,
        total: data.total_amount,
        status: data.status,
        pay_status: data.payment_status,
        del_status: data.delivery_status,
        notes: data.notes || null,
        out_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        out_trans_date: { type: oracledb.TIMESTAMP, dir: oracledb.BIND_OUT }
      },
      { 
        autoCommit: true, 
        outFormat: oracledb.OUT_FORMAT_OBJECT 
      }
    );
    
    return {
      id: result.outBinds.out_id[0],
      transaction_date: result.outBinds.out_trans_date[0],
      ...data
    };
  } finally {
    if (connection) await connection.close();
  }
}

export async function updateTransactionState(transactionId, data) {
  const connection = await getConnection();
  try {
    // Dynamically build the update query to only touch provided fields
    const updates = [];
    const binds = { id: transactionId };
    
    if (data.status) {
      updates.push("status = :status");
      binds.status = data.status;
    }
    if (data.payment_status) {
      updates.push("payment_status = :payment_status");
      binds.payment_status = data.payment_status;
    }
    if (data.delivery_status) {
      updates.push("delivery_status = :delivery_status");
      binds.delivery_status = data.delivery_status;
    }
    if (data.payment_date) {
      updates.push("payment_date = TO_DATE(:payment_date, 'YYYY-MM-DD')");
      binds.payment_date = data.payment_date;
    }

    if (updates.length === 0) return true; // Nothing to update

    const result = await connection.execute(
      `UPDATE transactions 
       SET ${updates.join(', ')}
       WHERE id = :id`,
      binds,
      { autoCommit: true }
    );
    
    return result.rowsAffected > 0;
  } finally {
    if (connection) await connection.close();
  }
}