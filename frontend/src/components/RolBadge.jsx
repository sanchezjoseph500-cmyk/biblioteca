import { ShieldCheck, Feather, BookOpen, User } from "lucide-react";

const ROL_LABEL = {
  admin: "Administrador",
  empleado: "Empleado",
  usuario: "Usuario",
};

const ROL_BADGE_STYLE = {
  admin: { cls: "bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-300/60", icon: ShieldCheck, dot: "bg-rose-500" },
  empleado: { cls: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-300/60", icon: Feather, dot: "bg-amber-500" },
  usuario: { cls: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-300/60", icon: BookOpen, dot: "bg-emerald-500" },
};

export function RolBadge({ rol }) {
  const info = ROL_BADGE_STYLE[rol] || { cls: "bg-stone-200 text-stone-600", icon: User, dot: "bg-stone-500" };
  const Icon = info.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-default ${info.cls}`}>
      <Icon size={11} />
      {ROL_LABEL[rol] || rol}
    </span>
  );
}

export default RolBadge;
export { ROL_LABEL, ROL_BADGE_STYLE };
