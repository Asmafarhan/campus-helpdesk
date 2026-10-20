import { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`toast-container ${isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-info'}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {isSuccess ? '✓' : isError ? '✕' : 'ℹ'}
      </div>
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  );
}
