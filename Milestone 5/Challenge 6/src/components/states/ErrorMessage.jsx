export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-red-500 font-medium mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
        >
          Retry
        </button>
      )}
    </div>
  );
}