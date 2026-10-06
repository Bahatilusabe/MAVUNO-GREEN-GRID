import dotenv from "dotenv";
import { createApp } from "./app.js";
import { initDb } from "./db/pool.js";

dotenv.config();

const port = process.env.PORT || 4000;

async function start() {
  try {
    // Initialize the Oracle connection pool first
    await initDb();
    console.log("Oracle database pool initialized successfully.");

    const app = createApp();
    
    app.listen(port, () => {
      console.log(`MAVUNO Green Grid Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err);
    process.exit(1);
  }
}

start();