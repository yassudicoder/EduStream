"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, Zap } from "lucide-react";
import { useState, createContext, useContext, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "achievement";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  icon?: React.ReactNode;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number, icon?: React.ReactNode) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType, duration = 4000, icon?: React.ReactNode) => {
      const id = Date.now().toString();
      const newToast: Toast = { id, message, type, duration, icon };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  const bgColors: Record<ToastType, string> = {
    success: "from-emerald-500 to-emerald-600",
    error: "from-red-500 to-red-600",
    info: "from-blue-500 to-blue-600",
    achievement: "from-purple-500 to-pink-500",
  };

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={20} className="text-white" />,
    error: <AlertCircle size={20} className="text-white" />,
    info: <Info size={20} className="text-white" />,
    achievement: <Zap size={20} className="text-white" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`bg-gradient-to-r ${bgColors[toast.type]} rounded-lg px-4 py-3 text-white shadow-lg flex items-center gap-3 max-w-sm`}
          >
            <div>{toast.icon || icons[toast.type]}</div>
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(toast.id)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
