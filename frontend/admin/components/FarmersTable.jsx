import { useMemo, useState } from "react";
import { Search, ChevronUp, ChevronDown, UserCheck, UserX, ShieldAlert } from "lucide-react";

const STATUS_STYLES = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

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
  
  const renderSortIcon = (k) => {
    if (sort.key !== k) return null;
    return sort.dir === 1 ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header Controls: Title, Search, and Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h3 className="text-base font-bold text-gray-900">Farmers Management</h3>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              className="bg-gray-50 border border-gray-200 text-gray-900 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2 outline-none focus:border-green-600 transition-all w-full sm:w-64 placeholder:text-gray-400" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search name or county…" 
              aria-label="Search farmers" 
            />
          </div>

          {/* Status Select */}
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            aria-label="Filter by status"
            className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2 outline-none focus:border-green-600 transition-all cursor-pointer shadow-2xs"
          >
            {["All", "Active", "Pending", "Suspended"].map((s) => <option key={s} value={s}>{s} Status</option>)}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th className="p-3.5 sm:px-5">
                <button onClick={() => sortBy("name")} className="flex items-center hover:text-green-700 transition-colors">
                  Name {renderSortIcon("name")}
                </button>
              </th>
              <th className="p-3.5 sm:px-5">
                <button onClick={() => sortBy("county")} className="flex items-center hover:text-green-700 transition-colors">
                  County {renderSortIcon("county")}
                </button>
              </th>
              <th className="p-3.5 sm:px-5">
                <button onClick={() => sortBy("farms")} className="flex items-center hover:text-green-700 transition-colors">
                  Farms {renderSortIcon("farms")}
                </button>
              </th>
              <th className="p-3.5 sm:px-5">
                <button onClick={() => sortBy("tons")} className="flex items-center hover:text-green-700 transition-colors">
                  Harvest (t) {renderSortIcon("tons")}
                </button>
              </th>
              <th className="p-3.5 sm:px-5">Status</th>
              <th className="p-3.5 sm:px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {rows.map((u) => {
              const statusKey = u.status.toLowerCase();
              const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.default;

              return (
                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-3.5 sm:px-5">
                    <strong className="block font-bold text-gray-900">{u.name}</strong>
                    <small className="text-[11px] text-gray-400 font-medium">Joined {u.joined}</small>
                  </td>
                  <td className="p-3.5 sm:px-5 text-gray-600 font-medium">{u.county}</td>
                  <td className="p-3.5 sm:px-5 text-gray-800 font-semibold">{u.farms}</td>
                  <td className="p-3.5 sm:px-5 text-gray-800 font-semibold">{u.tons}</td>
                  <td className="p-3.5 sm:px-5">
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${statusStyle}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 sm:px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.status === "Pending" && (
                        <button 
                          className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer" 
                          onClick={() => onStatus(u.id, "Active")}
                        >
                          <UserCheck size={14} /> Approve
                        </button>
                      )}
                      {u.status === "Active" && (
                        <button 
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer" 
                          onClick={() => onStatus(u.id, "Suspended")}
                        >
                          <UserX size={14} /> Suspend
                        </button>
                      )}
                      {u.status === "Suspended" && (
                        <button 
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer" 
                          onClick={() => onStatus(u.id, "Active")}
                        >
                          <ShieldAlert size={14} /> Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!rows.length && (
          <div className="p-12 text-center text-gray-500 text-sm font-medium bg-white">
            No farmers match your search criteria.
          </div>
        )}
      </div>
    </section>
  );
}