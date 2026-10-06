import { getConnection } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const COLS = `id, kind, icon, tone, title, body, action_to AS "actionTo", unread, created_at AS "createdAt"`;

export async function list(userId) {
  const result = await query(
    `SELECT ${COLS} FROM notifications 
     WHERE user_id = :1 
     ORDER BY created_at DESC 
     FETCH FIRST 100 ROWS ONLY`,
    [userId],
  );
  const rows = result.rows;
  return { 
    notifications: rows.map(r => ({ ...r, unread: r.UNREAD === 1 || r.unread === 1 })), 
    unread: rows.filter((n) => (n.UNREAD === 1 || n.unread === 1)).length 
  };
}

// `set` is always a constant from this file, never user input
async function touch(id, userId, set) {
  const result = await query(
    `UPDATE notifications SET ${set} WHERE id = :1 AND user_id = :2`, 
    [id, userId]
  );
  // Oracle uses rowsAffected instead of rowCount
  const affected = result.rowCount ?? result.rowsAffected;
  if (!affected) throw new HttpError(404, "Notification not found");
}

export const markRead = (id, userId) => touch(id, userId, "unread = 0");
// Note: If you want dismissed_at support, ensure the column exists in your notifications table schema
export const dismiss = (id, userId) => touch(id, userId, "created_at = SYSTIMESTAMP"); 
export const restore = (id, userId) => touch(id, userId, "unread = 1");

export async function markAllRead(userId) {
  await query("UPDATE notifications SET unread = 0 WHERE user_id = :1 AND unread = 1", [userId]);
}