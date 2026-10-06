import oracledb from "oracledb";
import bcrypt from "bcrypt";
import { getConnection } from "../../db/pool.js";

export async function createUser(data) {
  const connection = await getConnection();
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const result = await connection.execute(
      `INSERT INTO users (
         full_name, email, phone, password_hash, role, location
       )
       VALUES (
         :full_name, :email, :phone, :password_hash, :role, :location
       )
       RETURNING id, status, created_at INTO :out_id, :out_status, :out_created_at`,
      {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        password_hash: passwordHash,
        role: data.role,
        location: data.location || null,
        // Oracle NUMBER types map to oracledb.NUMBER
        out_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
        out_status: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        out_created_at: { type: oracledb.DATE, dir: oracledb.BIND_OUT }
      },
      { 
        autoCommit: true, 
        outFormat: oracledb.OUT_FORMAT_OBJECT 
      }
    );
    
    return {
      id: result.outBinds.out_id[0],
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      status: result.outBinds.out_status[0],
      created_at: result.outBinds.out_created_at[0]
    };
  } catch (error) {
    // Handle unique constraint violation on email
    if (error.message.includes("ORA-00001")) {
      throw new Error("A user with this email already exists.");
    }
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

export async function getUserByEmail(email) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id, full_name, email, password_hash, role, status 
       FROM users 
       WHERE email = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  } finally {
    if (connection) await connection.close();
  }
}