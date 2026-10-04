import { useMemo, useState } from "react";

export default function FarmersTable({ users, onStatus }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState({ key: "name", dir: 1 });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users
      .filter((u) => (status === "All" || u.status === status) && (!term || u.name.toLowerCase().includes(term) || u.county.toLowerCase().includes(term)))
      .sort((a, b) => {
        const x = a[sort.key], y = b[sort.key];
        return (typeof x === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir;
      });
  }, [users, q, status, sort]);

  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }));
  const arrow = (k) => (sort.key === k ? (sort.dir === 1 ? " ▲" : " ▼") : "");

  return (
    <section className="ad-card">
      <div className="ad-row">
        <h3 className="grow">Farmers</h3>
        <input className="ad-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or county…" aria-label="Search farmers" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          {["All", "Active", "Pending", "Suspended"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="ad-table-wrap">
        <table>
          <thead>
            <tr>
              <th><button onClick={() => sortBy("name")}>Name{arrow("name")}</button></th>
              <th><button onClick={() => sortBy("county")}>County{arrow("county")}</button></th>
              <th><button onClick={() => sortBy("farms")}>Farms{arrow("farms")}</button></th>
              <th><button onClick={() => sortBy("tons")}>Harvest (t){arrow("tons")}</button></th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong><small>Joined {u.joined}</small></td>
                <td>{u.county}</td><td>{u.farms}</td><td>{u.tons}</td>
                <td><span className={`ad-pill ${u.status.toLowerCase()}`}>{u.status}</span></td>
                <td className="ad-actions">
                  {u.status === "Pending" && <button className="ad-btn sm" onClick={() => onStatus(u.id, "Active")}>Approve</button>}
                  {u.status === "Active" && <button className="ad-btn sm ghost" onClick={() => onStatus(u.id, "Suspended")}>Suspend</button>}
                  {u.status === "Suspended" && <button className="ad-btn sm" onClick={() => onStatus(u.id, "Active")}>Reactivate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="ad-empty">No farmers match.</p>}
      </div>
    </section>
  );
}