import bcrypt from "bcryptjs";
import { pool } from "./pool.js";
import { config } from "../config.js";

if (config.NODE_ENV === "production") {
  console.error("Refusing to seed a production database.");
  process.exit(1);
}

const password = process.env.SEED_PASSWORD || "Password123!";
const hash = await bcrypt.hash(password, 10);
const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query("TRUNCATE notifications, match_requests, partners, crops, farms, users CASCADE");

  const addUser = async (name, email, role, county) => {
    const { rows } = await client.query(
      "INSERT INTO users (name, email, password_hash, role, county) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [name, email, hash, role, county],
    );
    return rows[0].id;
  };

  await addUser("Admin", "admin@mavuno.test", "admin", null);
  const samuel = await addUser("Samuel Kamau", "samuel@mavuno.test", "farmer", "Kirinyaga");
  const kagioUser = await addUser("Kagio Juice Processors", "kagio@mavuno.test", "partner", "Kirinyaga");

  const farms = [
    ["Kiambaina Farm", 1.2, "Borehole", "Drip", -0.5186, 37.3675, ["Tomatoes", "Flowering", 4500, "2026-10-18", "high"]],
    ["Mwea Plot 02", 0.8, "Canal", "Flood", -0.67, 37.35, ["Rice", "Tillering", 3200, "2026-11-03", "low"]],
    ["Kutus Farm", 0.4, "River", "Drip", -0.56, 37.28, ["French Beans", "Pod fill", 2100, "2026-10-24", "medium"]],
  ];
  for (const [name, area, water, irrigation, lat, lng, crop] of farms) {
    const { rows } = await client.query(
      "INSERT INTO farms (owner_id, name, county, area_ha, water_source, irrigation, lat, lng) VALUES ($1, $2, 'Kirinyaga', $3, $4, $5, $6, $7) RETURNING id",
      [samuel, name, area, water, irrigation, lat, lng],
    );
    await client.query(
      "INSERT INTO crops (farm_id, name, stage, expected_kg, expected_harvest, risk) VALUES ($1, $2, $3, $4, $5, $6)",
      [rows[0].id, ...crop],
    );
  }

  await client.query(
    "INSERT INTO partners (user_id, name, type, county, price_per_kg, capacity_kg, status) VALUES ($1, 'Kagio Juice Processors', 'processor', 'Kirinyaga', 20, 2000, 'approved')",
    [kagioUser],
  );

    const notes = [
    ["alert", "risk", "amber", "High surplus risk detected", "Tomatoes, Kiambaina Farm. Act within 72 hours.", "recs", "View plan", true, 2],
    ["message", "deal", "green", "Buyer A accepted your offer", "1,200 kg tomatoes", "market", "View buyers", true, 3],
    ["message", "truck", "green", "Transporter assigned", "KCC 342A for 1,500 kg", "transport", "Track", false, 5],
    ["message", "storage", "blue", "Storage reservation confirmed", "Kirinyaga Cold Storage", "storage", "View", false, 6],
    ["system", "price", "amber", "Market price update", "Tomatoes up 12% in Nairobi", "market", "Market", false, 24],
    ["alert", "weather", "red", "Weather alert", "Heavy rain expected in Kirinyaga", null, null, false, 26],
  ];
  for (const [kind, icon, tone, title, body, to, label, unread, hours] of notes) {
    await client.query(
      "INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label, unread, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now() - make_interval(hours => $10))",
      [samuel, kind, icon, tone, title, body, to, label, unread, hours],
    );
  }
  await client.query("COMMIT");
  console.log(`Seeded. Logins: admin@mavuno.test, samuel@mavuno.test, kagio@mavuno.test (password: ${password})`);
} catch (err) {
  await client.query("ROLLBACK");
  console.error(err);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}