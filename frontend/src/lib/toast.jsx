import { createContext, useContext, useCallback, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant, message) => {
      const id = ++idCounter;
      setToasts((list) => [...list, { id, variant, message }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const toast = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2.5">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};
const tones = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-info',
};

function Toast({ toast, onDismiss }) {
  const Icon = icons[toast.variant];
  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-lift animate-fade-in">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tones[toast.variant]}`} />
      <p className="flex-1 text-sm text-foreground">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-muted transition-colors hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
