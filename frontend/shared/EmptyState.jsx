export default function EmptyState({ icon: Icon, title, text, action, onAction }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
      {Icon && (
        <div className="p-3.5 bg-green-100 text-green-700 rounded-2xl shadow-xs">
          <Icon size={28} aria-hidden="true" />
        </div>
      )}
      
      <div className="space-y-1 max-w-sm">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{text}</p>
      </div>

      {action && (
        <button 
          className="mt-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm" 
          onClick={onAction}
        >
          {action}
        </button>
      )}
    </div>
  );
}