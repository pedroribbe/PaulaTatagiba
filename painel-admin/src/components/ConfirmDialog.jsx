export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger = true }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-icon" onClick={onCancel}>
            <span className="icon">close</span>
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-2)', fontSize: '.9rem', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            <span className="icon" style={{ fontSize: '1rem' }}>{danger ? 'delete' : 'check'}</span>
            {danger ? 'Excluir' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
