export default function SuccessModal({ isOpen, onClose,onDashboard, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal Card */}
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg flex flex-col items-center">
        
        {/* Checkmark Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text Details */}
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col w-full gap-2">
          <button
            type="button"
            onClick={onDashboard || onClose}
            className="w-full rounded-md bg-gray-800 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 cursor-pointer"
          >
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border border-gray-300 py-2 px-4 text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}