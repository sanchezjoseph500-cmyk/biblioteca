import { AlertCircle } from "lucide-react";

export default function FormField({ label, icon: Icon, error, required, children }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#6f6a55] mb-1.5 font-semibold">
        {Icon && <Icon size={13} className="text-amber-600" />}
        {label}
        {required && <span className="text-red-500 text-[10px]">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium animate-fadeIn">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}
