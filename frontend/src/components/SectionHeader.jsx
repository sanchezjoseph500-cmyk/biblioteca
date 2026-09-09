export default function SectionHeader({ eyebrow, title, subtitle, action, icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-5 border-b border-[#C49A55]/40 animate-fadeIn">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B85C38] to-[#6B4226] flex items-center justify-center shadow-lg shadow-[#B85C38]/25 shrink-0">
            <Icon size={24} className="text-white" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B85C38] mb-1 font-bold">{eyebrow}</p>
          <h1 className="text-xl sm:text-3xl font-serif text-[#2B2118] leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-[#6B4226]/70 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
