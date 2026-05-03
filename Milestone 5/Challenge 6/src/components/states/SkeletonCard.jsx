export default function SkeletonCard({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}