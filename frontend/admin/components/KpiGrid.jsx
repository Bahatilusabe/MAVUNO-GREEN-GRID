export default function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map(([Icon, label, value, sub, danger]) => (
        <div
          key={label}
          className={`p-5 rounded-xl border bg-white shadow-sm flex items-center gap-4 transition-all hover:shadow-md ${
            danger ? "border-red-300 bg-red-50/40" : "border-gray-200"
          }`}
        >
          <div className={`p-3 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
            danger ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
          }`}>
            <Icon aria-hidden="true" size={20} />
          </div>

          <div className="min-w-0 space-y-0.5">
            <small className="text-xs font-medium text-gray-500 block truncate">{label}</small>
            <strong className={`text-xl font-bold tracking-tight block truncate ${
              danger ? "text-red-700" : "text-gray-900"
            }`}>
              {value}
            </strong>
            {sub && (
              <small className="text-[11px] text-gray-400 font-medium block truncate pt-0.5">
                {sub}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}