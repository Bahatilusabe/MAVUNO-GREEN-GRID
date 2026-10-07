import "dotenv/config";
import oracledb from "oracledb";
import { createApp } from "./app.js";
import { initDb } from "./db/pool.js";

const port = Number(process.env.PORT) || 4000;
const app = createApp();

async function start() {
  try {
    await initDb();
    console.log("Oracle pool ready");
  } catch (err) {
    console.warn("Oracle unavailable, DB routes will fail:", err.message);
  }

  const server = app.listen(port, () =>
    console.log(`API listening on :${port}`)
  );

  const shutdown = async () => {
    server.close();
    try {
      await oracledb.getPool().close(5);
    } catch {}
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start();