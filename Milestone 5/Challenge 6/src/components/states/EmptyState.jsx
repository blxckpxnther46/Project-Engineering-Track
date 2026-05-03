export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 mb-4">{message}</p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}