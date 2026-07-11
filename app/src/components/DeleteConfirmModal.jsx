export default function DeleteConfirmModal({
  onCancel, onConfirm,
  title = 'Delete history?',
  body = "This permanently removes all past daily history. This can't be undone.",
  confirmLabel = 'Delete',
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-title">{title}</div>
        <div className="modal-body">{body}</div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn modal-btn--confirm" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
