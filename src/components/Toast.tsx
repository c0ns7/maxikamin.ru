"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 2800);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div
          role="status"
          className="animate-toast-in fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-graphite px-5 py-3.5 text-sm text-cream shadow-lg"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-light" />
          <span>{message}</span>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setMessage(null)}
            className="ml-1 rounded-lg p-1 text-cream/60 transition hover:bg-white/10 hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}
