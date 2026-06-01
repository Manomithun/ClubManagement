export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="skeleton h-8 w-24 rounded-xl" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="table-wrapper animate-pulse">
      <div className="table-head flex gap-4 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-3 flex-1 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="table-row flex gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="skeleton h-3 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-5 flex items-start gap-4 animate-pulse">
          <div className="skeleton w-12 h-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <div className="skeleton h-6 w-16 rounded" />
            <div className="skeleton h-3 w-28 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
