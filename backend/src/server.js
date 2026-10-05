import { createApp } from "./app.js";
import { config } from "./config.js";
import { pool } from "./db/pool.js";

const server = createApp().listen(config.PORT, () => {
  console.log(`API listening on http://localhost:${config.PORT}`);
});

const shutdown = () => server.close(async () => { await pool.end(); process.exit(0); });
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);