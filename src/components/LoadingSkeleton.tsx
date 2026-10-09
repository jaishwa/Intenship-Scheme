export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded shimmer w-3/4" />
              <div className="h-3 rounded shimmer w-1/2" />
            </div>
            <div className="w-14 h-14 rounded-full shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-3 rounded shimmer" />
            <div className="h-3 rounded shimmer w-4/5" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-5 w-16 rounded-full shimmer" />
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-10 flex-1 rounded-xl shimmer" />
            <div className="h-10 w-28 rounded-xl shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
