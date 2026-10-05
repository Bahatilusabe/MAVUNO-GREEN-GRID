import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { initDb, getClient } from "./pool.js";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");

// Initialize Oracle Pool
await initDb();
const connection = await getClient();

try {
  // 1. Oracle doesn't support 'IF NOT EXISTS', so we catch the "already exists" error (ORA-00955)
  try {
    await connection.execute(`
      CREATE TABLE _migrations (
        name VARCHAR2(255) PRIMARY KEY, 
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
      )
    `);
  } catch (err) {
    if (err.errorNum !== 955) throw err; // Ignore "name already used by existing object"
  }

  // 2. Get list of already applied migrations
  const result = await connection.execute("SELECT name FROM _migrations");
  // Note: Oracle returns column names in uppercase by default (NAME)
  const done = new Set(result.rows.map((r) => r.NAME || r.name)); 
  
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (done.has(file)) continue;
    
    const sqlContent = await readFile(path.join(dir, file), "utf8");
    
    // 3. Oracle CANNOT execute multiple statements in one string. We must split them.
    const statements = sqlContent
      .split(/(?:;|\/)\s*(?:\r?\n|$)/)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    try {
      // Oracle starts transactions automatically, no need for "BEGIN"
      for (const stmt of statements) {
        await connection.execute(stmt);
      }
      
      // 4. Record migration using Oracle's bind syntax (:1 instead of $1)
      await connection.execute(
        "INSERT INTO _migrations (name) VALUES (:1)", 
        [file]
      );
      
      // 5. Native Oracle commit
      await connection.commit();
      console.log("applied", file);
    } catch (err) {
      // Native Oracle rollback
      await connection.rollback();
      console.error("failed", file, "-", err.message);
      process.exitCode = 1;
      break;
    }
  }
} finally {
  if (connection) {
    await connection.close();
  }
  process.exit(process.exitCode || 0);
}