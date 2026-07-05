export default function DeleteConfirmModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-title">Delete history?</div>
        <div className="modal-body">This permanently removes all past daily history. This can't be undone.</div>
        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn modal-btn--confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
