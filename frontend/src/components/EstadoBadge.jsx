export function EstadoBadge({ estado }) {
  const styles = {
    Activo: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300/60 shadow-sm shadow-green-500/15",
    Suspendido: "bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border border-rose-300/60 shadow-sm shadow-rose-500/15",
    Pendiente: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-300/60 shadow-sm shadow-amber-500/15 animate-pulse-subtle",
    "Al dia": "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300/60 shadow-sm shadow-green-500/15",
    Vencido: "bg-gradient-to-r from-rose-100 to-red-100 text-rose-800 border border-rose-300/60 shadow-sm shadow-rose-500/15 animate-pulse-subtle",
  };
  const dotColors = { Activo: "bg-green-500", Suspendido: "bg-rose-500", Pendiente: "bg-amber-500", "Al dia": "bg-green-500", Vencido: "bg-rose-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-200 hover:scale-105 cursor-default ${styles[estado] || "bg-stone-200 text-stone-600"}`}>
      <span className={`w-2 h-2 rounded-full ${dotColors[estado] || "bg-stone-500"}`} />
      {estado}
    </span>
  );
}

export default EstadoBadge;
