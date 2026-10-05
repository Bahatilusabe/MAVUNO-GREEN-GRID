import pg from "pg";
import { config } from "../config.js";

pg.types.setTypeParser(1700, parseFloat); // numeric -> number
pg.types.setTypeParser(20, (v) => parseInt(v, 10)); // bigint (counts) -> number
pg.types.setTypeParser(1082, (v) => v); // date -> "YYYY-MM-DD" string

export const pool = new pg.Pool({ connectionString: config.DATABASE_URL });
export const query = (text, params) => pool.query(text, params);