import oracledb from 'oracledb';

// Match PostgreSQL's default auto-commit behavior
oracledb.autoCommit = true;

let pool;

export const initDb = async () => {
  try {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Connected to Oracle Database');
  } catch (err) {
    console.error('Oracle pool creation failed:', err);
    process.exit(1);
  }
};

export const query = async (sql, binds = []) => {
  let connection;
  try {
    if (!pool) await initDb();
    connection = await pool.getConnection();
    
    // outFormat ensures Oracle returns objects like Postgres does
    const result = await connection.execute(sql, binds, { 
      outFormat: oracledb.OUT_FORMAT_OBJECT 
    });
    
    return { 
      rows: result.rows || [], 
      rowCount: result.rowsAffected || 0 
    };
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing Oracle connection:', err);
      }
    }
  }
};

export const getClient = async () => {
  if (!pool) await initDb();
  return await pool.getConnection();
};