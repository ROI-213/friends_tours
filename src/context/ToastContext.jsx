import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'success', duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-item"
            style={{
              borderLeftColor:
                toast.type === 'error'
                  ? 'var(--color-error)'
                  : toast.type === 'warning'
                  ? 'var(--color-warning)'
                  : 'var(--color-primary)',
            }}
          >
            {toast.type === 'error' && <AlertCircle size={20} color="var(--color-error)" />}
            {toast.type === 'warning' && <AlertCircle size={20} color="var(--color-warning)" />}
            {toast.type === 'success' && <CheckCircle2 size={20} color="var(--color-primary)" />}
            {toast.type === 'info' && <Info size={20} color="var(--color-info)" />}
            
            <p className="body-sm" style={{ fontWeight: 500, flex: 1, color: 'var(--color-text-main)' }}>
              {toast.message}
            </p>
            
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer', padding: 4 }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
