import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

try {
  oracledb.initOracleClient();
} catch (err) {
  // Ignored if thin mode is active or client is already initialized
}

export async function initDb() {
  try {
    await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      // Use DB_CONNECTION_STRING from your .env file
      connectString: process.env.DB_CONNECTION_STRING || process.env.DB_DSN,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 2
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

export async function query(sql, values = []) {
  const connection = await getConnection();
  try {
    const oracleSql = sql.replace(/\$(\d+)/g, ":$1");
    const result = await connection.execute(
      oracleSql,
      values,
      { outFormat: oracledb.OUT_FORMAT_OBJECT },
    );
    return { rows: result.rows ?? [] };
  } finally {
    await connection.close();
  }
}