import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

// Rows come back as objects with UPPERCASE column names
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Thin mode by default (works with Oracle 23ai Free, no client install).
// Set ORACLE_CLIENT_DIR only if you need thick mode.
if (process.env.ORACLE_CLIENT_DIR) {
  oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_DIR });
}

export async function initDb() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING || process.env.DB_DSN,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2,
    });
    console.log("Oracle Database connection pool established.");
  } catch (err) {
    console.error("Error initializing Oracle connection pool:", err);
    throw err;
  }
}

export async function getConnection() {
  try {
    return await oracledb.getConnection();
  } catch (err) {
    console.error("Error acquiring connection from pool:", err);
    throw err;
  }
}

// Alias used by migrate.js and seed.js
export const getClient = getConnection;

export async function query(sql, values = []) {
  const connection = await getConnection();
  try {
    const oracleSql = sql.replace(/\$(\d+)/g, ":$1");
    const result = await connection.execute(oracleSql, values);
    return { rows: result.rows ?? [] };
  } finally {
    await connection.close();
  }
}

export async function closeDb() {
  try {
    await oracledb.getPool().close(5);
  } catch {
    /* pool not created */
  }
}