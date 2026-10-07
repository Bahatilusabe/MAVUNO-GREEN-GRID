import oracledb from "oracledb";
import bcrypt from "bcryptjs";
import { getConnection } from "../../db/pool.js";

export async function createUser(data) {
  const connection = await getConnection();
  try {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await connection.execute(
      `INSERT INTO users (name, email, phone, password_hash, role, county)
       VALUES (:name, :email, :phone, :password_hash, :role, :county)
       RETURNING id, status, created_at INTO :out_id, :out_status, :out_created_at`,
      {
        name: data.full_name,
        email: data.email.toLowerCase(),
        phone: data.phone || null,
        password_hash: passwordHash,
        role: String(data.role).toLowerCase(),
        county: data.location || null,
        out_id: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        out_status: { type: oracledb.STRING, dir: oracledb.BIND_OUT },
        out_created_at: { type: oracledb.DB_TYPE_TIMESTAMP_TZ, dir: oracledb.BIND_OUT },
      },
      { autoCommit: true }
    );

    return {
      id: result.outBinds.out_id[0],
      full_name: data.full_name,
      email: data.email.toLowerCase(),
      role: String(data.role).toLowerCase(),
      status: result.outBinds.out_status[0],
      created_at: result.outBinds.out_created_at[0],
    };
  } catch (error) {
    if (error.errorNum === 1) {
      throw Object.assign(new Error("A user with this email already exists."), {
        status: 409,
      });
    }
    throw error;
  } finally {
    await connection.close();
  }
}

export async function getUserByEmail(email) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `SELECT id AS "id",
              name AS "full_name",
              email AS "email",
              password_hash AS "password_hash",
              role AS "role",
              status AS "status"
         FROM users
        WHERE email = :email`,
      { email: String(email).toLowerCase() },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    return result.rows[0];
  } finally {
    await connection.close();
  }
}