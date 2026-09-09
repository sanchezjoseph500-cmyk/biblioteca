import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, icon: Icon }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      setTimeout(() => setVisible(false), 200);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[60] overflow-y-auto transition-all duration-300 ${animating ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-full flex items-center justify-center p-4 pointer-events-none">
        <div className={`relative bg-gradient-to-b from-[#faf8f0] to-[#f5f0e4] rounded-2xl border border-[#C9A97E] shadow-2xl w-full max-w-sm transition-all duration-300 overflow-hidden pointer-events-auto ${animating ? "scale-100 translate-y-0" : "scale-90 translate-y-6"}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="px-6 py-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              {Icon ? <Icon size={28} className="text-rose-600" /> : <ShieldAlert size={28} className="text-rose-600" />}
            </div>
            <h3 className="font-serif text-lg text-[#2B2118] mb-2">{title}</h3>
            <p className="text-sm text-[#6f6a55] mb-6">{message}</p>
            <div className="flex justify-center gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#e8e0cc] text-[#4a4738] hover:bg-[#ddd5be] transition-all duration-200 cursor-pointer">
                Cancelar
              </button>
              <button onClick={() => { onConfirm(); onClose(); }} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-rose-700 to-red-700 text-white hover:from-rose-600 hover:to-red-600 shadow-lg shadow-rose-500/20 transition-all duration-200 cursor-pointer">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
