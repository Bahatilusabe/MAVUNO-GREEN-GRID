import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { initDb, getClient } from "./pool.js";
import { splitSql } from "./splitSql.js";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");
const TABLE = "schema_migrations";

let connection;
try {
  await initDb();
  connection = await getClient();

  try {
    await connection.execute(`
      CREATE TABLE ${TABLE} (
        name VARCHAR2(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL
      )
    `);
  } catch (err) {
    if (err.errorNum !== 955) throw err;
  }

  const result = await connection.execute(`SELECT name FROM ${TABLE}`);
  const done = new Set(result.rows.map((r) => (Array.isArray(r) ? r[0] : r.NAME)));

  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  console.log("Found:", files, "| already applied:", [...done]);
  if (files.length === 0) throw new Error("No .sql files found in " + dir);

  for (const file of files) {
    if (done.has(file)) {
      console.log("skip", file);
      continue;
    }

    const statements = splitSql(await readFile(path.join(dir, file), "utf8"));
    console.log(`${file}: ${statements.length} statements`);

    try {
      for (const [i, stmt] of statements.entries()) {
        try {
          await connection.execute(stmt);
        } catch (err) {
          console.error(`Statement ${i + 1} failed:\n${stmt.slice(0, 400)}\n`);
          throw err;
        }
      }
      await connection.execute(`INSERT INTO ${TABLE} (name) VALUES (:1)`, [file]);
      await connection.commit();
      console.log("applied", file);
    } catch (err) {
      await connection.rollback();
      console.error("failed", file, "-", err.message);
      process.exitCode = 1;
      break;
    }
  }
} catch (err) {
  console.error("migrate error:", err);
  process.exitCode = 1;
} finally {
  if (connection) await connection.close();
  process.exit(process.exitCode || 0);
}