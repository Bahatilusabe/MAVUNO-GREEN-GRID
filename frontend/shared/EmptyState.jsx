export default function EmptyState({ icon: Icon, title, text, action, onAction }) {
  return (
    <div className="card empty-state">
      {Icon && (
        <span className="empty-ico">
          <Icon size={28} aria-hidden="true" />
        </span>
      )}
      <h3>{title}</h3>
      <p>{text}</p>
      {action && (
        <button className="btn" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}
