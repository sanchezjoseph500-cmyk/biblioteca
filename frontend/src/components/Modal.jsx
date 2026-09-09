import { useEffect, useState } from "react";
import { X } from "lucide-react";
import PatternBg from "./PatternBg";

export default function Modal({ isOpen, onClose, title, icon: Icon, children }) {
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
    <div className={`fixed inset-0 z-50 overflow-y-auto transition-all duration-300 ${animating ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-full flex items-center justify-center p-4 pointer-events-none">
        <div className={`relative bg-gradient-to-b from-[#FFF8E7] to-[#F4E8D0] rounded-2xl border border-[#C49A55]/60 shadow-2xl w-full max-w-md transition-all duration-300 overflow-hidden pointer-events-auto ${animating ? "scale-100 translate-y-0" : "scale-90 translate-y-6"}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C49A55] via-[#B85C38] to-[#C49A55]" />
          <div className="relative px-6 py-5 border-b border-[#C49A55]/40">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C49A55] to-[#B85C38] flex items-center justify-center shadow-md shrink-0">
                  <Icon size={20} className="text-white" />
                </div>
              )}
              <h2 className="font-serif text-xl text-[#2B2118]">{title}</h2>
            </div>
            <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-[#C49A55]/30 transition-colors text-[#6B4226] cursor-pointer">
              <X size={18} />
            </button>
          </div>
          <div className="px-6 py-5 relative max-h-[70vh] overflow-y-auto">
            {children}
            <PatternBg />
          </div>
        </div>
      </div>
    </div>
  );
}
