import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const COLS = `id, kind, icon, tone, title, body, action_to AS "actionTo", action_label AS "actionLabel", unread, created_at AS "createdAt"`;

export async function list(userId) {
  const { rows } = await query(
    `SELECT ${COLS} FROM notifications WHERE user_id = $1 AND dismissed_at IS NULL ORDER BY created_at DESC LIMIT 100`,
    [userId],
  );
  return { notifications: rows, unread: rows.filter((n) => n.unread).length };
}

// `set` is always a constant from this file, never user input
async function touch(id, userId, set) {
  const { rowCount } = await query(`UPDATE notifications SET ${set} WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (!rowCount) throw new HttpError(404, "Notification not found");
}

export const markRead = (id, userId) => touch(id, userId, "unread = false");
export const dismiss = (id, userId) => touch(id, userId, "dismissed_at = now()");
export const restore = (id, userId) => touch(id, userId, "dismissed_at = NULL");

export async function markAllRead(userId) {
  await query("UPDATE notifications SET unread = false WHERE user_id = $1 AND unread", [userId]);
}