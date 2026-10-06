export function Skeleton({ h = 16, w = "100%", r = 8 }) {
  return (
    <div
      className="bg-gray-200 animate-pulse"
      style={{ height: h, width: w, borderRadius: r }}
      aria-hidden="true"
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 flex" role="status" aria-label="Loading">
      {/* Sidebar Placeholder */}
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 p-5 space-y-6">
        <Skeleton h={32} w="80%" r={10} />
        <div className="space-y-3 pt-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} h={40} r={10} />
          ))}
        </div>
      </div>

      {/* Main Content Placeholder */}
      <div className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton h={32} w="35%" r={10} />
        
        {/* KPI Row Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} h={84} r={14} />
          ))}
        </div>

        {/* Main Chart Card Skeleton */}
        <Skeleton h={280} r={14} />

        {/* Secondary Row Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <Skeleton key={i} h={180} r={14} />
          ))}
        </div>
      </div>
    </div>
  );
}