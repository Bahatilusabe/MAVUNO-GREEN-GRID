function Skeleton({ h = 16, w = "100%", r = 8 }) {
  return (
    <div
      className="skel"
      style={{ height: h, width: w, borderRadius: r }}
      aria-hidden="true"
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="skel-page" role="status" aria-label="Loading">
      <div className="skel-side" />
      <div className="skel-main">
        <Skeleton h={28} w="40%" />
        <div className="skel-row">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} h={84} r={14} />
          ))}
        </div>
        <Skeleton h={220} r={14} />
        <div className="skel-row">
          {[0, 1].map((i) => (
            <Skeleton key={i} h={160} r={14} />
          ))}
        </div>
      </div>
    </div>
  );
}
