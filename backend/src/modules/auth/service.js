import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const PUBLIC = `id, name, email, phone, role, status, county, language, created_at AS "createdAt"`;
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12); // keeps login timing similar for unknown emails

const sign = (user) => jwt.sign({ role: user.role }, config.JWT_SECRET, { subject: user.id, expiresIn: config.JWT_EXPIRES_IN });

export async function register({ name, email, phone, password, role, county }) {
  const hash = await bcrypt.hash(password, 12);
  const status = role === "partner" ? "pending" : "active"; // partners wait for admin approval
  const { rows } = await query(
    `INSERT INTO users (name, email, phone, password_hash, role, status, county)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${PUBLIC}`,
    [name, email, phone ?? null, hash, role, status, county ?? null],
  );
  return { user: rows[0], token: sign(rows[0]) };
}

export async function login({ email, password }) {
  const { rows } = await query(`SELECT ${PUBLIC}, password_hash FROM users WHERE email = $1`, [email]);
  const row = rows[0];
  const ok = await bcrypt.compare(password, row?.password_hash ?? DUMMY_HASH);
  if (!row || !ok) throw new HttpError(401, "Invalid email or password");
  if (row.status === "suspended") throw new HttpError(403, "Account suspended");

  const { password_hash: _omit, ...user } = row;
  return { user, token: sign(user) };
}

export async function getUser(id) {
  const { rows } = await query(`SELECT ${PUBLIC} FROM users WHERE id = $1`, [id]);
  if (!rows[0]) throw new HttpError(404, "User not found");
  return rows[0];
}