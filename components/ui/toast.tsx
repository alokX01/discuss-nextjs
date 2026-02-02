"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "loading";
};

const ToastContext = createContext<{
  showToast: (message: string, type: Toast["type"]) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"]) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (type !== "loading") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    }
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]
              ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-900" : ""}
              ${toast.type === "error" ? "bg-red-50 border border-red-200 text-red-900" : ""}
              ${toast.type === "loading" ? "bg-blue-50 border border-blue-200 text-blue-900" : ""}
            `}
          >
            <span className="flex-1 text-sm">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}