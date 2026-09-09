import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, Bell, X } from "lucide-react";

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

export function Toast({ toast, onRemove }) {
  const [exiting, setExiting] = useState(false);
  const styles = {
    success: { bg: "bg-gradient-to-r from-green-700 to-emerald-600", border: "border-green-400/30", text: "text-green-50" },
    error: { bg: "bg-gradient-to-r from-rose-700 to-red-600", border: "border-rose-400/30", text: "text-rose-50" },
    info: { bg: "bg-gradient-to-r from-amber-700 to-yellow-600", border: "border-amber-400/30", text: "text-amber-50" },
    warning: { bg: "bg-gradient-to-r from-orange-700 to-red-500", border: "border-orange-400/30", text: "text-orange-50" },
  };
  const icons = { success: CheckCircle2, error: AlertTriangle, info: Bell, warning: AlertTriangle };
  const Icon = icons[toast.type] || Bell;
  const s = styles[toast.type] || styles.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl backdrop-blur-md max-w-sm ${s.bg} ${s.border} ${s.text} ${exiting ? "animate-slideOut" : "animate-slideIn"}`}>
      <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <p className="text-sm flex-1 font-medium">{toast.message}</p>
      <button onClick={() => { setExiting(true); setTimeout(() => onRemove(toast.id), 300); }} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
}
