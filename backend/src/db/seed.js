import oracledb from "oracledb";
import bcrypt from "bcryptjs";
import { initDb, getClient } from "./pool.js";
import { config } from "../config.js";

if (config.NODE_ENV === "production") {
  console.error("Refusing to seed a production database.");
  process.exit(1);
}

const password = process.env.SEED_PASSWORD || "Password123!";
const hash = await bcrypt.hash(password, 10);

await initDb();
const connection = await getClient();

try {
  // Delete in reverse dependency order. geo_places and geo_fetches are a shared cache of public
  // map data, not user data, so a reseed keeps them.
  const tables = ["notifications", "match_requests", "crops", "farms", "partners", "users"];
  for (const table of tables) {
    await connection.execute(`DELETE FROM ${table}`);
  }

  const addUser = async (name, email, role, county) => {
    const result = await connection.execute(
      `INSERT INTO users (name, email, password_hash, role, county)
       VALUES (:name, :email, :hash, :role, :county)
       RETURNING id INTO :out_id`,
      {
        name, email, hash, role, county,
        out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      }
    );
    return result.outBinds.out_id[0];
  };

  await addUser("Admin", "admin@mavuno.test", "admin", null);
  const samuel = await addUser("Samuel Kamau", "samuel@mavuno.test", "farmer", "Kirinyaga");
  const kagioUser = await addUser("Kagio Juice Processors", "kagio@mavuno.test", "partner", "Kirinyaga");

  const farms = [
    ["Kiambaina Farm", 1.2, "Borehole", "Drip", -0.5186, 37.3675, ["Tomatoes", "Flowering", 4500, "2026-10-18", "high"]],
    ["Mwea Plot 02", 0.8, "Canal", "Flood", -0.67, 37.35, ["Rice", "Tillering", 3200, "2026-11-03", "low"]],
    ["Kutus Farm", 0.4, "River", "Drip", -0.56, 37.28, ["French Beans", "Pod fill", 2100, "2026-10-24", "medium"]],
  ];

  const cropIds = [];

  for (const [name, area, water, irrigation, lat, lng, crop] of farms) {
    const result = await connection.execute(
      `INSERT INTO farms (owner_id, name, county, area_ha, water_source, irrigation, lat, lng)
       VALUES (:owner_id, :name, 'Kirinyaga', :area, :water, :irrigation, :lat, :lng)
       RETURNING id INTO :out_id`,
      {
        owner_id: samuel, name, area, water, irrigation, lat, lng,
        out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
      }
    );
    const farmId = result.outBinds.out_id[0];

    const [cropName, cropStage, cropKg, cropHarvest, cropRisk] = crop;
    const cropResult = await connection.execute(
      `INSERT INTO crops (farm_id, name, stage, expected_kg, expected_harvest, risk)
       VALUES (:1, :2, :3, :4, TO_DATE(:5, 'YYYY-MM-DD'), :6)
       RETURNING id INTO :out_id`,
      [farmId, cropName, cropStage, cropKg, cropHarvest, cropRisk],
      { out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING } }
    );
    cropIds.push(cropResult.outBinds.out_id[0]);
  }

  // Approximate coordinates for the demo partner. Use the real site coordinates outside a demo.
  const partnerResult = await connection.execute(
    `INSERT INTO partners (user_id, name, type, county, lat, lng, price_per_kg, capacity_kg, status)
     VALUES (:1, 'Kagio Juice Processors', 'processor', 'Kirinyaga', -0.668, 37.317, 20, 2000, 'approved')
     RETURNING id INTO :out_id`,
    [kagioUser],
    { out_id: { dir: oracledb.BIND_OUT, type: oracledb.STRING } }
  );
  const partnerId = partnerResult.outBinds.out_id[0];

  // The farmer -> partner request stream, in every state the portal renders.
  // This is the link that makes the partner inbox, the farmer's market view
  // and the admin match counters agree.
  const requests = [
    [cropIds[0], 900, 20, "2026-10-18", "pending"],
    [cropIds[0], 600, 20, "2026-10-12", "scheduled"],
    [cropIds[0], 800, 19, "2026-10-01", "delivered"],
  ];

  for (const [cropId, kg, price, pickup, status] of requests) {
    await connection.execute(
      `INSERT INTO match_requests
         (farmer_id, partner_id, crop_id, kg, price_per_kg, pickup_date, status, idempotency_key, notes)
       VALUES (:1, :2, :3, :4, :5, TO_DATE(:6, 'YYYY-MM-DD'), :7, :8, :9)`,
      [
        samuel,
        partnerId,
        cropId,
        kg,
        price,
        pickup,
        status,
        `seed-${cropId}-${kg}-${status}`,
        "Seeded demo request",
      ]
    );
  }

  const notes = [
    ["alert", "risk", "amber", "High surplus risk detected", "Tomatoes, Kiambaina Farm. Act within 72 hours.", "recs", "View plan", true, 2],
    ["message", "deal", "green", "Buyer A accepted your offer", "1,200 kg tomatoes", "market", "View buyers", true, 3],
    ["message", "truck", "green", "Transporter assigned", "KCC 342A for 1,500 kg", "transport", "Track", false, 5],
    ["message", "storage", "blue", "Storage reservation confirmed", "Kirinyaga Cold Storage", "storage", "View", false, 6],
    ["system", "price", "amber", "Market price update", "Tomatoes up 12% in Nairobi", "market", "Market", false, 24],
    ["alert", "weather", "red", "Weather alert", "Heavy rain expected in Kirinyaga", null, null, false, 26],
  ];

  for (const [kind, icon, tone, title, body, to, label, unread, hours] of notes) {
    await connection.execute(
      `INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label, unread, created_at)
       VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, SYSTIMESTAMP - NUMTODSINTERVAL(:10, 'HOUR'))`,
      [samuel, kind, icon, tone, title, body, to, label, unread ? 1 : 0, hours]
    );
  }

  // The partner's own feed: what the farmer's requests look like from the
  // other side of the loop.
  const partnerNotes = [
    ["message", "deal", "green", "New request from Samuel Kamau", "900 kg of Tomatoes", "market", "View", true, 1],
    ["system", "shield", "blue", "Listing live", "Kagio Juice Processors is visible to farmers nearby", "market", "View", false, 20],
  ];

  for (const [kind, icon, tone, title, body, to, label, unread, hours] of partnerNotes) {
    await connection.execute(
      `INSERT INTO notifications (user_id, kind, icon, tone, title, body, action_to, action_label, unread, created_at)
       VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, SYSTIMESTAMP - NUMTODSINTERVAL(:10, 'HOUR'))`,
      [kagioUser, kind, icon, tone, title, body, to, label, unread ? 1 : 0, hours]
    );
  }

  await connection.commit();
  console.log(`Seeded. Logins: admin@mavuno.test, samuel@mavuno.test, kagio@mavuno.test (password: ${password})`);
} catch (err) {
  await connection.rollback();
  console.error(err);
  process.exitCode = 1;
} finally {
  if (connection) await connection.close();
  process.exit(process.exitCode || 0);
}