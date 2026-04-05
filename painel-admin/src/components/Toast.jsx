export default function Toast({ toasts }) {
  const icon = { ok: 'check_circle', err: 'error', info: 'info' };
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="icon" style={{ fontSize: '1.1rem' }}>{icon[t.type]}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
