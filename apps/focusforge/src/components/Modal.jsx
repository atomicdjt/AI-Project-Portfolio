import { GameIcon } from './GameIcon.jsx';

// Accessible confirmation dialog used for destructive session and save actions.
export function Modal({ open, title, children, confirmLabel, tone = 'danger', onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog">
          <GameIcon name="X" size={18} />
        </button>
        <div className={`modal-symbol ${tone}`}><GameIcon name={tone === 'danger' ? 'ShieldAlert' : 'Info'} size={26} /></div>
        <h2 id="modal-title">{title}</h2>
        <div className="modal-copy">{children}</div>
        <div className="modal-actions">
          <button className="button secondary" type="button" onClick={onClose}>Cancel</button>
          <button className={`button ${tone}`} type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
