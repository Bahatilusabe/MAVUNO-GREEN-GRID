import { createApp } from './app.js';
import { initDb } from './db/pool.js';

const port = process.env.PORT || 4000;

async function start() {
  await initDb();
  const app = createApp();
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start();