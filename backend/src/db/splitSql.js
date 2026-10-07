const PLSQL_START = /^\s*(CREATE\s+(OR\s+REPLACE\s+)?(EDITIONABLE\s+)?(TRIGGER|PROCEDURE|FUNCTION|PACKAGE)\b|DECLARE\b|BEGIN\b)/i;
const PLSQL_END = /^END(\s+\w+)?\s*;\s*$/i; // unindented END; or END name;

export function splitSql(text) {
  const out = [];
  let buf = [];
  let inPlsql = false;

  const flush = (keepSemicolon) => {
    let stmt = buf.join("\n").trim();
    buf = [];
    inPlsql = false;
    if (!keepSemicolon) stmt = stmt.replace(/;\s*$/, "");
    if (stmt) out.push(stmt);
  };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    const trimmed = line.trim();

    // A lone "/" is a SQL*Plus terminator, never part of a statement
    if (trimmed === "/") {
      if (inPlsql) flush(true);
      continue;
    }

    if (!inPlsql && buf.length === 0) {
      if (trimmed === "" || trimmed.startsWith("--")) continue;
      if (PLSQL_START.test(line)) inPlsql = true;
    }

    if (inPlsql) {
      buf.push(line);
      if (PLSQL_END.test(line)) flush(true);
      continue;
    }

    if (trimmed.startsWith("--")) continue;
    buf.push(line);
    if (/;\s*$/.test(trimmed)) flush(false);
  }

  if (buf.length) flush(inPlsql);
  return out;
}