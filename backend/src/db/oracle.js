import oracledb from "oracledb";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let pool;

export async function getPool() {
  if (!pool) {
    pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING, // e.g. oracle:1521/FREEPDB1
      poolMin: 1,
      poolMax: 5,
    });
  }
  return pool;
}

export async function query(sql, binds = {}) {
  const conn = await (await getPool()).getConnection();
  try {
    const res = await conn.execute(sql, binds, { autoCommit: true });
    return res.rows;
  } finally {
    await conn.close();
  }
}