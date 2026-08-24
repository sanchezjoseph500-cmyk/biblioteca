import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Users,
  Library,
  ArrowLeftRight,
  Search,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Bell,
  Sparkles,
  RotateCcw,
  Calendar,
  Mail,
  User,
  Hash,
  BookMarked,
  Activity,
  SortAsc,
  SortDesc,
  Eye,
  Feather,
  BookCopy,
  AlertCircle,
  ShieldAlert,
  LogOut,
  ShieldCheck,
  Send,
  BellRing,
  BadgeCheck,
  Hourglass,
} from "lucide-react";
import {
  getUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getLibros,
  getLibro,
  createLibro,
  updateLibro,
  deleteLibro,
  getPrestamos,
  getPrestamo,
  getMisPrestamos,
  createPrestamo,
  crearSolicitudPrestamo,
  aprobarPrestamo,
  notificarTardio,
  deletePrestamo,
} from "./services/api";
import Login from "./pages/Login";

// ============ VALIDATION HELPERS ============

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s'-]{2,}$/;
const TITLE_REGEX = /^.{2,100}$/;

function validateEmail(value) {
  if (!value.trim()) return "El correo es obligatorio";
  if (!EMAIL_REGEX.test(value.trim())) return "Ingresa un correo válido (ej: nombre@dominio.com)";
  return "";
}

function validateName(value, label = "El nombre") {
  if (!value.trim()) return `${label} es obligatorio`;
  if (value.trim().length < 2) return `${label} debe tener al menos 2 caracteres`;
  if (!NAME_REGEX.test(value.trim())) return `${label} solo puede contener letras, espacios, apóstrofes y guiones`;
  return "";
}

function validateTitle(value, label = "El título") {
  if (!value.trim()) return `${label} es obligatorio`;
  if (value.trim().length < 2) return `${label} debe tener al menos 2 caracteres`;
  if (value.trim().length > 100) return `${label} no puede exceder 100 caracteres`;
  if (!TITLE_REGEX.test(value.trim())) return `${label} contiene caracteres no válidos`;
  return "";
}

function validateSelect(value, label = "Selecciona una opción") {
  if (!value || value === "") return label;
  return "";
}

function validateDate(value) {
  if (!value) return "La fecha es obligatoria";
  const fecha = new Date(value);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (isNaN(fecha.getTime())) return "Fecha no válida";
  if (fecha < hoy) return "La fecha debe ser hoy o en el futuro";
  return "";
}

function validateDatePrestamo(value) {
  if (!value) return "La fecha de préstamo es obligatoria";
  const fecha = new Date(value);
  if (isNaN(fecha.getTime())) return "Fecha no válida";
  return "";
}

function nextId(items, prefix) {
  const nums = items
    .map((item) => Number.parseInt(String(item.id).split("-")[1], 10))
    .filter((n) => !Number.isNaN(n));
  const base = prefix === "L" ? 1000 : prefix === "P" ? 3000 : 0;
  const max = nums.length > 0 ? Math.max(...nums) : base;
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

// ============ DECORATIVE SVG COMPONENTS ============

function BookshelfSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="20" height="90" rx="2" fill="#d4a017" opacity="0.4" />
      <rect x="34" y="20" width="16" height="80" rx="2" fill="#a0522d" opacity="0.35" />
      <rect x="54" y="15" width="18" height="85" rx="2" fill="#1a7a4a" opacity="0.4" />
      <rect x="76" y="25" width="14" height="75" rx="2" fill="#c0392b" opacity="0.35" />
      <rect x="94" y="12" width="20" height="88" rx="2" fill="#2980b9" opacity="0.4" />
      <rect x="118" y="18" width="16" height="82" rx="2" fill="#d4a017" opacity="0.3" />
      <rect x="138" y="22" width="18" height="78" rx="2" fill="#27ae60" opacity="0.35" />
      <rect x="160" y="16" width="22" height="84" rx="2" fill="#a0522d" opacity="0.4" />
      <line x1="5" y1="102" x2="195" y2="102" stroke="#8b5e3c" strokeWidth="3" opacity="0.2" />
      <line x1="5" y1="108" x2="195" y2="108" stroke="#8b5e3c" strokeWidth="2" opacity="0.1" />
    </svg>
  );
}

function FloatingBooksSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="animate-float-slow">
        <rect x="20" y="20" width="30" height="40" rx="2" fill="#d4a017" opacity="0.25" transform="rotate(-5 35 40)" />
      </g>
      <g className="animate-float-medium">
        <rect x="80" y="10" width="25" height="35" rx="2" fill="#1a7a4a" opacity="0.25" transform="rotate(8 92 27)" />
      </g>
      <g className="animate-float-slow" style={{ animationDelay: "1s" }}>
        <rect x="150" y="25" width="28" height="38" rx="2" fill="#c0392b" opacity="0.2" transform="rotate(-3 164 44)" />
      </g>
      <g className="animate-float-medium" style={{ animationDelay: "0.5s" }}>
        <rect x="220" y="15" width="22" height="32" rx="2" fill="#2980b9" opacity="0.25" transform="rotate(6 231 31)" />
      </g>
      <g className="animate-float-slow" style={{ animationDelay: "2s" }}>
        <rect x="270" y="30" width="20" height="28" rx="2" fill="#a0522d" opacity="0.2" transform="rotate(-7 280 44)" />
      </g>
    </svg>
  );
}

function QuoteDecor({ className }) {
  return (
    <svg className={className} viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 30C8 20 14 12 24 8L26 12C18 15 15 20 14 25H22V42H8V30Z" fill="#d4a017" opacity="0.3" />
      <path d="M32 30C32 20 38 12 48 8L50 12C42 15 39 20 38 25H46V42H32V30Z" fill="#d4a017" opacity="0.25" />
    </svg>
  );
}

function PatternBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/8 to-transparent blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/8 to-transparent blur-3xl" />
    </div>
  );
}

// ============ HOOKS ============

function useAnimatedCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ============ TOAST SYSTEM ============

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
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

// ============ CONFIRM DIALOG ============

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, icon: Icon }) {
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
    <div className={`fixed inset-0 z-[60] flex items-center justify-center transition-all duration-300 ${animating ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-gradient-to-b from-[#faf8f0] to-[#f5f0e4] rounded-2xl border border-[#d4c9a8] shadow-2xl w-full max-w-sm mx-4 transition-all duration-300 overflow-hidden ${animating ? "scale-100 translate-y-0" : "scale-90 translate-y-6"}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600" />
        <div className="px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
            {Icon ? <Icon size={28} className="text-rose-600" /> : <ShieldAlert size={28} className="text-rose-600" />}
          </div>
          <h3 className="font-serif text-lg text-[#1a2520] mb-2">{title}</h3>
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
  );
}

// ============ MODAL SYSTEM ============

function Modal({ isOpen, onClose, title, icon: Icon, children }) {
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${animating ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-gradient-to-b from-[#faf8f0] to-[#f5f0e4] rounded-2xl border border-[#d4c9a8] shadow-2xl w-full max-w-md mx-4 transition-all duration-300 overflow-hidden ${animating ? "scale-100 translate-y-0" : "scale-90 translate-y-6"}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500" />
        <div className="relative px-6 py-5 border-b border-[#d4c9a8]/60">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                <Icon size={20} className="text-white" />
              </div>
            )}
            <h2 className="font-serif text-xl text-[#1a2520]">{title}</h2>
          </div>
          <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-[#d4c9a8]/40 transition-colors text-[#6f6a55] cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 relative">
          {children}
          <PatternBg />
        </div>
      </div>
    </div>
  );
}

// ============ FORM COMPONENTS ============

function FormField({ label, icon: Icon, error, required, children }) {
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

function getInputClass(hasError) {
  const base = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-sm";
  if (hasError) {
    return `${base} bg-red-50/50 border-2 border-red-300 text-[#1a2520] placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200`;
  }
  return `${base} bg-white/80 border border-[#d4c9a8] text-[#1a2520] placeholder:text-[#a89f81] focus:border-[#c9a24c] focus:ring-2 focus:ring-[#c9a24c]/20 focus:bg-white`;
}

const selectClass = getInputClass(false) + " appearance-none cursor-pointer";

function FormButton({ children, onClick, variant = "primary", disabled, type = "button" }) {
  const styles = {
    primary: "bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-700/20",
    secondary: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    danger: "bg-gradient-to-r from-rose-700 to-red-700 text-white hover:from-rose-600 hover:to-red-600",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] shadow-sm ${styles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

// ============ ROLES ============

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

function RolBadge({ rol }) {
  const info = ROL_BADGE_STYLE[rol] || { cls: "bg-stone-200 text-stone-600", icon: User, dot: "bg-stone-500" };
  const Icon = info.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide cursor-default ${info.cls}`}>
      <Icon size={11} />
      {ROL_LABEL[rol] || rol}
    </span>
  );
}

function puede(rol, ...roles) {
  return roles.includes(rol);
}

// ============ ESTADO BADGE ============

function EstadoBadge({ estado }) {
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

// ============ SECTION HEADER ============

function SectionHeader({ eyebrow, title, subtitle, action, icon: Icon }) {
  return (
    <div className="flex items-end justify-between mb-8 pb-5 border-b border-[#d4c9a8]/60 animate-fadeIn">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Icon size={24} className="text-white" />
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-600 mb-1 font-bold">{eyebrow}</p>
          <h1 className="text-3xl font-serif text-[#1a2520]">{title}</h1>
          {subtitle && <p className="text-sm text-[#6f6a55] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ============ ANIMATED PROGRESS RING ============

function ProgressRing({ value, max, size = 100, strokeWidth = 7, color, delay = 0 }) {
  const animatedValue = useAnimatedCounter(value, 1400);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? (animatedValue / max) : 0;
  const offset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e8e0cc" strokeWidth={strokeWidth} opacity={0.5} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ transitionDelay: `${delay}ms` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-[#1a2520]">{animatedValue}</span>
      </div>
    </div>
  );
}

// ============ DONUT CHART ============

function DonutChart({ segments, size = 180 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((seg, i) => {
          const pct = total > 0 ? seg.value / total : 0;
          const dashLen = pct * circumference;
          const dashOff = circumference - accumulated * circumference;
          accumulated += pct;
          return (
            <circle
              key={i} cx={size / 2} cy={size / 2} r={radius} fill="none"
              stroke={seg.color} strokeWidth={22}
              strokeDasharray={`${dashLen} ${circumference - dashLen}`}
              strokeDashoffset={dashOff}
              strokeLinecap="butt"
              className={`transition-all duration-200 cursor-pointer ${hoveredIdx === i ? "opacity-100" : "opacity-85"}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#1a2520]">{total}</span>
        <span className="text-[10px] uppercase tracking-widest text-[#8a8368] font-semibold">total</span>
      </div>
    </div>
  );
}

// ============ INICIO ============

function Inicio({ usuarios, libros, prestamos }) {
  const librosCount = libros.length;
  const usuariosCount = usuarios.length;
  const prestamosCount = prestamos.length;
  const alDia = prestamos.filter((p) => p.estado === "Al dia").length;
  const vencidos = prestamos.filter((p) => p.estado === "Vencido").length;
  const disponibles = libros.filter((l) => l.disponible).length;

  const counts = {};
  prestamos.forEach((p) => { counts[p.libro] = (counts[p.libro] || 0) + 1; });
  const topBooks = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxBorrowed = topBooks.length > 0 ? topBooks[0][1] : 1;

  const bookAccents = [
    { bar: "from-emerald-500 to-green-600", bg: "bg-emerald-50", text: "text-emerald-700" },
    { bar: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
    { bar: "from-blue-500 to-indigo-600", bg: "bg-blue-50", text: "text-blue-700" },
    { bar: "from-rose-500 to-red-600", bg: "bg-rose-50", text: "text-rose-700" },
    { bar: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-700" },
  ];

  const donutSegments = [
    { label: "Al día", value: alDia, color: "#16a34a" },
    { label: "Vencidos", value: vencidos, color: "#e11d48" },
  ];

  const activityItems = [
    { time: "Hace 2h", icon: CheckCircle2, color: "text-emerald-500", ring: "bg-emerald-100", text: <><strong>Andrés Rojas</strong> devolvió <span className="font-semibold text-[#1a2520]">Pedro Páramo</span></> },
    { time: "Hace 5h", icon: Clock, color: "text-amber-500", ring: "bg-amber-100", text: <><strong>Julián Pérez</strong> tomó prestado <span className="font-semibold text-[#1a2520]">Ficciones</span></> },
    { time: "Ayer", icon: Plus, color: "text-blue-500", ring: "bg-blue-100", text: <><strong>Se agregó</strong> <span className="font-semibold text-[#1a2520]">La Casa de los Espíritus</span> al catálogo</> },
    { time: "Ayer", icon: User, color: "text-violet-500", ring: "bg-violet-100", text: <><strong>Paula Méndez</strong> se registró como nueva usuaria</> },
    { time: "Hace 3d", icon: AlertTriangle, color: "text-rose-500", ring: "bg-rose-100", text: <><span className="font-semibold text-[#1a2520]">Platero y Yo</span> está vencido — Andrés Rojas</> },
  ];

  return (
    <div className="relative space-y-8 animate-fadeIn">
      {/* HERO */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-green-600 to-teal-700" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 20%, rgba(251,191,36,0.18) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(16,185,129,0.2) 0%, transparent 50%)" }} />
        <div className="absolute top-0 right-0 opacity-[0.07]"><BookshelfSVG className="w-72 h-44" /></div>
        <div className="absolute bottom-0 left-0 opacity-[0.07]"><FloatingBooksSVG className="w-96 h-24" /></div>
        <div className="relative px-10 py-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={13} className="text-amber-300" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200">Dashboard</span>
            </div>
            <h1 className="text-4xl font-serif text-white mb-2 drop-shadow-sm">Biblioteca Central</h1>
            <p className="text-emerald-100/80 text-sm max-w-lg leading-relaxed">Panel de control del sistema de gestión. Monitorea préstamos, usuarios y el catálogo en tiempo real.</p>
          </div>
          <div className="hidden lg:flex flex-col items-end gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4 text-right">
              <p className="font-serif italic text-amber-200 text-base leading-snug">"Un lector vive mil vidas"</p>
              <p className="text-emerald-200/50 text-[10px] mt-1.5">— George R.R. Martin</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-200/60 text-xs">
              <Clock size={12} />
              <span>{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* STATS RING ROW */}
      <div className="grid grid-cols-4 gap-5">
        {[
          { label: "Libros", value: librosCount, icon: Library, color: "#16a34a", sub: `${disponibles} disponibles`, delay: 0 },
          { label: "Usuarios", value: usuariosCount, icon: Users, color: "#f59e0b", sub: `${usuarios.filter(u => u.estado === "Activo").length} activos`, delay: 100 },
          { label: "Préstamos", value: prestamosCount, icon: ArrowLeftRight, color: "#3b82f6", sub: "activos", delay: 200 },
          { label: "Vencidos", value: vencidos, icon: AlertTriangle, color: "#e11d48", sub: "requieren atención", delay: 300 },
        ].map(({ label, value, icon: Icon, color, sub, delay }) => (
          <div key={label} className="group relative bg-white rounded-2xl p-5 border border-amber-100/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-fadeIn overflow-hidden" style={{ animationDelay: `${delay}ms` }}>
            <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60" style={{ background: color }} />
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: `${color}99` }}>{label}</span>
            </div>
            <div className="flex items-center gap-4">
              <ProgressRing value={value} max={value + 5} size={72} strokeWidth={6} color={color} delay={delay} />
              <div>
                <p className="text-xs text-[#8a8368] mt-1">{sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-12 gap-5">

        {/* LEFT — Donut + Quick Info */}
        <div className="col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm animate-fadeIn" style={{ animationDelay: "400ms" }}>
            <h3 className="font-serif text-base text-[#1a2520] mb-4">Estado de préstamos</h3>
            <div className="flex justify-center mb-4">
              <DonutChart segments={donutSegments} size={170} />
            </div>
            <div className="flex justify-center gap-6">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
                  <span className="text-xs text-[#6f6a55] font-medium">{seg.label}</span>
                  <span className="text-xs font-bold text-[#1a2520]">{seg.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-100/60 p-5 shadow-sm animate-fadeIn" style={{ animationDelay: "500ms" }}>
            <h3 className="font-serif text-base text-[#1a2520] mb-4">Acciones rápidas</h3>
            <div className="space-y-2.5">
              {[
                { icon: Plus, label: "Registrar préstamo", gradient: "from-emerald-500 to-green-600" },
                { icon: User, label: "Nuevo usuario", gradient: "from-amber-500 to-orange-500" },
                { icon: BookCopy, label: "Agregar libro", gradient: "from-blue-500 to-indigo-600" },
              ].map(({ icon: Icon, label, gradient }, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50/60 transition-all duration-200 group cursor-pointer text-left">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#1a2520] group-hover:text-[#0d7a42] transition-colors">{label}</span>
                  <ChevronRight size={14} className="ml-auto text-[#a89f81] group-hover:text-[#0d7a42] group-hover:translate-x-0.5 transition-all duration-200" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — Top Books */}
        <div className="col-span-5">
          <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm h-full animate-fadeIn" style={{ animationDelay: "450ms" }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
                  <BookCopy size={15} className="text-white" />
                </div>
                <h3 className="font-serif text-base text-[#1a2520]">Libros más prestados</h3>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">Top 5</span>
            </div>
            <div className="space-y-3">
              {topBooks.map(([titulo, count], i) => {
                const libro = libros.find((l) => l.titulo === titulo);
                const pct = (count / maxBorrowed) * 100;
                const a = bookAccents[i];
                return (
                  <div key={titulo} className="flex items-center gap-4 p-3 rounded-xl hover:bg-amber-50/40 transition-all duration-200 group cursor-default">
                    <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <span className={`text-sm font-black ${a.text}`}>{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a2520] truncate">{titulo}</p>
                      <p className="text-[11px] text-[#8a8368]">{libro?.autor || "Desconocido"}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-28 h-2 rounded-full bg-amber-100 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${a.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-xs font-black ${a.text} w-6 text-right`}>{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Activity Timeline */}
        <div className="col-span-3">
          <div className="bg-white rounded-2xl border border-amber-100/60 p-5 shadow-sm h-full animate-fadeIn" style={{ animationDelay: "500ms" }}>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                <Activity size={15} className="text-white" />
              </div>
              <h3 className="font-serif text-base text-[#1a2520]">Actividad</h3>
            </div>
            <div className="relative">
              <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-emerald-300 via-amber-200 to-rose-200" />
              <ul className="space-y-4">
                {activityItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="relative flex gap-3 group">
                      <div className={`relative z-10 w-[30px] h-[30px] rounded-full ${item.ring} flex items-center justify-center shrink-0 border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                        <Icon size={13} className={item.color} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-[11px] font-bold text-[#8a8368] uppercase tracking-wider mb-0.5">{item.time}</p>
                        <p className="text-xs text-[#4a4738] leading-relaxed">{item.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM — Overdue Loans Horizontal Scroll */}
      <div className="animate-fadeIn" style={{ animationDelay: "600ms" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-sm">
              <AlertTriangle size={15} className="text-white" />
            </div>
            <h3 className="font-serif text-base text-[#1a2520]">Préstamos vencidos</h3>
            <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">{vencidos}</span>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
          {prestamos.filter((p) => p.estado === "Vencido").map((p, i) => (
            <div key={p.id} className="relative shrink-0 w-72 bg-gradient-to-br from-white to-rose-50/50 rounded-2xl border border-rose-200/50 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-default" style={{ animationDelay: `${650 + i * 80}ms` }}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-red-500" />
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-200 shadow-sm">
                  <BookMarked size={18} className="text-rose-600" />
                </div>
                <span className="text-[10px] font-mono font-bold text-rose-400">{p.id}</span>
              </div>
              <p className="text-sm font-serif font-bold text-[#1a2520] mb-1 leading-snug line-clamp-2">{p.libro}</p>
              <p className="text-[11px] text-[#8a8368] mb-3 flex items-center gap-1"><User size={10} /> {p.usuario}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-rose-500 font-semibold">
                  <Calendar size={10} />
                  vence {p.vence}
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold">
                  <AlertCircle size={9} /> vencido
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ USUARIOS VIEW ============

function UsuariosView({ usuarios, refresh, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("usuario");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [detalleId, setDetalleId] = useState(null);
  const [detalleData, setDetalleData] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const resetForm = () => { setNombre(""); setEmail(""); setRol("usuario"); setErrors({}); setTouched({}); };

  const handleOpenModal = () => { resetForm(); setShowModal(true); };

  const handleCloseModal = () => { setShowModal(false); setTimeout(resetForm, 300); };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = { ...errors };
    if (field === "nombre") newErrors.nombre = validateName(nombre, "El nombre");
    if (field === "email") newErrors.email = validateEmail(email);
    setErrors(newErrors);
  };

  const handleNombreChange = (v) => {
    setNombre(v);
    if (touched.nombre) setErrors((prev) => ({ ...prev, nombre: validateName(v, "El nombre") }));
  };

  const handleEmailChange = (v) => {
    setEmail(v);
    if (touched.email) setErrors((prev) => ({ ...prev, email: validateEmail(v) }));
  };

  const sorted = [...usuarios].sort((a, b) => {
    if (!sortField) return 0;
    const val = a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
    return sortDir === "asc" ? val : -val;
  });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleCreate = async () => {
    const e = { nombre: validateName(nombre, "El nombre"), email: validateEmail(email) };
    setErrors(e);
    setTouched({ nombre: true, email: true });
    if (e.nombre || e.email) return;
    const newUser = {
      id: nextId(usuarios, "U"),
      nombre: nombre.trim(), email: email.trim(), rol, password: "123456", prestamos: 0, estado: "Activo",
    };
    try {
      await createUsuario(newUser);
      await refresh();
      handleCloseModal();
      addToast({ type: "success", message: `Usuario "${newUser.nombre}" creado exitosamente` });
    } catch (err) {
      addToast({ type: "error", message: `No se pudo crear el usuario: ${err.message}` });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteUsuario(confirmDelete.id);
      await refresh();
      addToast({ type: "info", message: `Usuario "${confirmDelete.nombre}" eliminado` });
    } catch (err) {
      addToast({ type: "error", message: `No se pudo eliminar: ${err.message}` });
    }
    setConfirmDelete(null);
  };

  const handleToggleEstado = async (usuario) => {
    const nuevoEstado = usuario.estado === "Activo" ? "Suspendido" : "Activo";
    try {
      await updateUsuario(usuario.id, {
        nombre: usuario.nombre,
        email: usuario.email,
        prestamos: usuario.prestamos,
        estado: nuevoEstado,
      });
      await refresh();
      addToast({ type: "success", message: "Estado actualizado" });
    } catch (err) {
      addToast({ type: "error", message: `No se pudo actualizar: ${err.message}` });
    }
  };

  const verDetalle = async (id) => {
    setDetalleId(id);
    setDetalleData(null);
    try {
      setDetalleData(await getUsuario(id));
    } catch (err) {
      addToast({ type: "error", message: `No se pudo cargar el detalle: ${err.message}` });
      setDetalleId(null);
    }
  };

  const SortIcon = sortDir === "asc" ? SortAsc : SortDesc;
  const avatarColors = ["from-amber-500 to-orange-600", "from-emerald-600 to-green-800", "from-blue-600 to-indigo-800", "from-rose-600 to-red-800", "from-violet-600 to-purple-800"];

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />
      <SectionHeader
        eyebrow="Gestión de usuarios"
        title="Usuarios"
        subtitle={`${usuarios.length} usuarios registrados`}
        icon={Users}
        action={
          <button onClick={handleOpenModal} className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-green-800 text-white text-sm px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-emerald-700/25 cursor-pointer font-semibold">
            <Plus size={16} /> Nuevo usuario
          </button>
        }
      />
      <div className="relative bg-white border border-[#d4c9a8]/50 rounded-2xl overflow-hidden shadow-lg animate-fadeIn" style={{ animationDelay: "100ms" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500" />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-800 text-xs uppercase tracking-wide">
              {[{ key: "id", label: "ID", icon: Hash }, { key: "nombre", label: "Nombre", icon: User }, { key: "email", label: "Correo", icon: Mail }, { key: "rol", label: "Rol", icon: ShieldCheck }, { key: "prestamos", label: "Préstamos", icon: BookOpen }, { key: "estado", label: "Estado", icon: Eye }].map(({ key, label, icon: Icon }) => (
                <th key={key} className="text-left font-bold px-5 py-3.5 select-none">
                  <button onClick={() => handleSort(key)} className="flex items-center gap-1.5 hover:text-[#1a2520] transition-colors cursor-pointer">
                    <Icon size={12} />{label}{sortField === key && <SortIcon size={12} className="text-[#c9a24c]" />}
                  </button>
                </th>
              ))}
              <th className="w-16"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((u, i) => (
              <tr key={u.id} className={`border-t border-amber-200/50 transition-all duration-200 ${hoveredRow === u.id ? "bg-gradient-to-r from-amber-50 to-yellow-50" : "bg-transparent"}`} onMouseEnter={() => setHoveredRow(u.id)} onMouseLeave={() => setHoveredRow(null)}>
                <td className="px-5 py-3.5 font-mono text-xs text-amber-600 font-bold">{u.id}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>{u.nombre.split(" ").map((n) => n[0]).join("")}</div>
                    <span className="text-[#1a2520] font-semibold">{u.nombre}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[#6f6a55]">{u.email}</td>
                <td className="px-5 py-3.5"><RolBadge rol={u.rol} /></td>
                <td className="px-5 py-3.5"><span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 text-xs font-bold text-amber-700 shadow-sm">{u.prestamos}</span></td>
                <td className="px-5 py-3.5"><button onClick={() => handleToggleEstado(u)} className="cursor-pointer"><EstadoBadge estado={u.estado} /></button></td>
                <td className="px-5 py-3.5">
                  <div className={`flex items-center gap-1 transition-all duration-200 ${hoveredRow === u.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                    <button onClick={() => verDetalle(u.id)} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors cursor-pointer" title="Ver detalle"><Eye size={14} /></button>
                    <button onClick={() => setConfirmDelete(u)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer" title="Eliminar"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title="Nuevo Usuario" icon={UserPlus}>
        <FormField label="Nombre completo" icon={User} error={errors.nombre} required>
          <input type="text" placeholder="Ej: María López" value={nombre} onChange={(e) => handleNombreChange(e.target.value)} onBlur={() => handleBlur("nombre")} maxLength={80} className={getInputClass(errors.nombre && touched.nombre)} />
        </FormField>
        <FormField label="Correo electrónico" icon={Mail} error={errors.email} required>
          <input type="email" placeholder="Ej: maria@mail.com" value={email} onChange={(e) => handleEmailChange(e.target.value)} onBlur={() => handleBlur("email")} maxLength={100} className={getInputClass(errors.email && touched.email)} />
        </FormField>
        <FormField label="Rol del usuario" icon={ShieldCheck} required>
          <select value={rol} onChange={(e) => setRol(e.target.value)} className={selectClass}>
            <option value="usuario">Usuario — solo solicita préstamos</option>
            <option value="empleado">Empleado — agrega y presta libros</option>
            <option value="admin">Administrador — acceso total</option>
          </select>
        </FormField>
        <div className="flex justify-end gap-2 mt-6">
          <FormButton variant="secondary" onClick={handleCloseModal}>Cancelar</FormButton>
          <FormButton variant="primary" onClick={handleCreate}>Crear usuario</FormButton>
        </div>
      </Modal>

      <Modal isOpen={!!detalleId} onClose={() => setDetalleId(null)} title="Detalle del Usuario" icon={User}>
        {!detalleData ? (
          <p className="text-sm text-[#8a8368] text-center py-6 animate-fadeIn">Cargando...</p>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {detalleData.nombre.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-serif text-lg text-[#1a2520] leading-tight">{detalleData.nombre}</p>
                <p className="text-xs font-mono text-amber-600 font-bold">{detalleData.id}</p>
              </div>
            </div>
            <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Correo</p>
              <p className="text-sm text-[#1a2520] break-all">{detalleData.email}</p>
            </div>
            <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Rol</p>
              <div className="mt-0.5"><RolBadge rol={detalleData.rol} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Préstamos</p>
                <p className="text-sm font-bold text-[#1a2520]">{detalleData.prestamos}</p>
              </div>
              <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Estado</p>
                <div className="mt-0.5"><EstadoBadge estado={detalleData.estado} /></div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} title="Eliminar usuario" message={`¿Estás seguro de eliminar a "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`} icon={Trash2} />
    </div>
  );
}

const UserPlus = Plus;

// ============ LIBROS VIEW ============

function LibrosView({ libros, refresh, addToast, user, misPrestamos = [] }) {
  const rol = user?.rol;
  const esAdmin = rol === "admin";
  const esUsuarioLector = rol === "usuario";
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("Novela");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [detalleId, setDetalleId] = useState(null);
  const [detalleData, setDetalleData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const resetForm = () => { setTitulo(""); setAutor(""); setGenero("Novela"); setErrors({}); setTouched({}); };

  const handleOpenModal = () => { resetForm(); setShowModal(true); };

  const handleCloseModal = () => { setShowModal(false); setTimeout(resetForm, 300); };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = { ...errors };
    if (field === "titulo") newErrors.titulo = validateTitle(titulo, "El título");
    if (field === "autor") newErrors.autor = validateName(autor, "El autor");
    setErrors(newErrors);
  };

  const handleTituloChange = (v) => {
    setTitulo(v);
    if (touched.titulo) setErrors((prev) => ({ ...prev, titulo: validateTitle(v, "El título") }));
  };

  const handleAutorChange = (v) => {
    setAutor(v);
    if (touched.autor) setErrors((prev) => ({ ...prev, autor: validateName(v, "El autor") }));
  };

  const filtered = libros.filter(
    (l) => l.titulo.toLowerCase().includes(search.toLowerCase()) || l.autor.toLowerCase().includes(search.toLowerCase()) || l.genero.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    const e = { titulo: validateTitle(titulo, "El título"), autor: validateName(autor, "El autor") };
    setErrors(e);
    setTouched({ titulo: true, autor: true });
    if (e.titulo || e.autor) return;
    const newBook = {
      id: nextId(libros, "L"),
      titulo: titulo.trim(), autor: autor.trim(), genero, disponible: true,
    };
    try {
      await createLibro(newBook);
      await refresh();
      handleCloseModal();
      addToast({ type: "success", message: `"${newBook.titulo}" agregado al catálogo` });
    } catch (err) {
      addToast({ type: "error", message: `No se pudo agregar el libro: ${err.message}` });
    }
  };

  const toggleDisponible = async (libro) => {
    try {
      await updateLibro(libro.id, {
        titulo: libro.titulo,
        autor: libro.autor,
        genero: libro.genero,
        disponible: !libro.disponible,
      });
      await refresh();
    } catch (err) {
      addToast({ type: "error", message: `No se pudo actualizar: ${err.message}` });
    }
  };

  const yaSolicitado = (titulo) =>
    misPrestamos.some((p) => p.libro === titulo && p.estado === "Pendiente");

  const handleSolicitar = async (libro) => {
    try {
      await crearSolicitudPrestamo(libro.titulo);
      await refresh();
      addToast({ type: "success", message: `Solicitud de "${libro.titulo}" enviada. Te notificaremos cuando sea aprobada.` });
    } catch (err) {
      addToast({ type: "warning", message: err.message });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteLibro(confirmDelete.id);
      await refresh();
      addToast({ type: "info", message: `"${confirmDelete.titulo}" eliminado del catálogo` });
    } catch (err) {
      addToast({ type: "error", message: `No se pudo eliminar: ${err.message}` });
    }
    setConfirmDelete(null);
  };

  const verDetalle = async (id) => {
    setDetalleId(id);
    setDetalleData(null);
    try {
      setDetalleData(await getLibro(id));
    } catch (err) {
      addToast({ type: "error", message: `No se pudo cargar el detalle: ${err.message}` });
      setDetalleId(null);
    }
  };

  const coverGradients = ["from-emerald-600 to-green-800", "from-amber-500 to-orange-700", "from-blue-600 to-indigo-800", "from-rose-600 to-red-800", "from-violet-600 to-purple-800", "from-teal-500 to-cyan-700"];

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />
      <SectionHeader
        eyebrow="Catálogo de libros"
        title="Libros"
        subtitle={`${libros.length} libros · ${libros.filter(l => l.disponible).length} disponibles`}
        icon={Library}
        action={
          puede(rol, "admin", "empleado") ? (
            <button onClick={handleOpenModal} className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-green-800 text-white text-sm px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-emerald-700/25 cursor-pointer font-semibold">
              <Plus size={16} /> Nuevo libro
            </button>
          ) : (
            <span className="text-xs text-[#8a8368] bg-white/70 border border-[#d4c9a8]/60 px-4 py-2 rounded-xl">Explora y solicita préstamos</span>
          )
        }
      />
      <div className="relative mb-6 group">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 group-focus-within:text-amber-500 transition-colors" />
        <input placeholder="Buscar por título, autor o género..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-amber-200/60 rounded-2xl pl-11 pr-14 py-3 text-sm text-[#1a2520] placeholder:text-amber-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/15 focus:shadow-md transition-all duration-200 shadow-sm" />
        {search && (
          <>
            <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">{filtered.length}</div>
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-amber-100 text-amber-600 transition-all duration-200 cursor-pointer"><X size={16} /></button>
          </>
        )}
      </div>
      {filtered.length === 0 && search && (
        <div className="text-center py-20 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner"><Search size={36} className="text-amber-400/50" /></div>
          <p className="text-[#1a2520] text-lg font-serif">No se encontraron libros</p>
          <p className="text-[#8a8368] text-sm mt-1">Intenta con otro término de búsqueda</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-5">
        {filtered.map((l, i) => (
          <div key={l.id} onClick={() => verDetalle(l.id)} className="relative bg-white border border-[#d4c9a8]/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer animate-fadeIn group hover:-translate-y-1 hover:shadow-lg" style={{ animationDelay: `${i * 60}ms` }} onMouseEnter={() => setHoveredCard(l.id)} onMouseLeave={() => setHoveredCard(null)}>
            <div className={`h-28 bg-gradient-to-br ${coverGradients[i % coverGradients.length]} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10" />
              <BookOpen size={36} className="text-white/30 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute bottom-2 right-3"><span className="font-mono text-[10px] text-white/40">{l.id}</span></div>
              {esAdmin && (
                <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(l); }} className={`absolute top-2 right-2 p-1.5 rounded-lg bg-black/20 text-white/70 hover:bg-rose-500 hover:text-white transition-all duration-200 cursor-pointer ${hoveredCard === l.id ? "opacity-100" : "opacity-0"}`}><Trash2 size={12} /></button>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-serif text-[15px] text-[#1a2520] leading-snug mb-2">{l.titulo}</h3>
              <p className="text-sm text-[#8a8368] mb-3 flex items-center gap-1.5"><Feather size={12} className="text-[#8b5e3c]/50" />{l.autor}</p>
              <div className="mt-auto flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">{l.genero}</span>
                {esUsuarioLector ? (
                  l.disponible ? (
                    yaSolicitado(l.titulo) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-300/60">
                        <Hourglass size={11} /> Solicitado
                      </span>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleSolicitar(l); }} className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-green-700 text-white hover:from-emerald-500 hover:to-green-600 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm">
                        <Send size={11} /> Solicitar
                      </button>
                    )
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-300/60 cursor-not-allowed">Prestado</span>
                  )
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); if (esAdmin) toggleDisponible(l); }} className={`text-xs font-bold px-3 py-1 rounded-full transition-all duration-200 shadow-sm ${l.disponible ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300/60" : "bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-300/60"} ${esAdmin ? "hover:scale-105 cursor-pointer" : "cursor-default opacity-80"}`}>
                    {l.disponible ? "Disponible" : "Prestado"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title="Nuevo Libro" icon={BookCopy}>
        <FormField label="Título del libro" icon={BookOpen} error={errors.titulo} required>
          <input type="text" placeholder="Ej: Cien años de soledad" value={titulo} onChange={(e) => handleTituloChange(e.target.value)} onBlur={() => handleBlur("titulo")} maxLength={100} className={getInputClass(errors.titulo && touched.titulo)} />
        </FormField>
        <FormField label="Autor" icon={Feather} error={errors.autor} required>
          <input type="text" placeholder="Ej: Gabriel García Márquez" value={autor} onChange={(e) => handleAutorChange(e.target.value)} onBlur={() => handleBlur("autor")} maxLength={80} className={getInputClass(errors.autor && touched.autor)} />
        </FormField>
        <FormField label="Género" icon={Library} required>
          <select value={genero} onChange={(e) => setGenero(e.target.value)} className={selectClass}>
            <option>Novela</option><option>Cuento</option><option>Poesía</option><option>Ensayo</option><option>Historia</option><option>Ciencia</option>
          </select>
        </FormField>
        <div className="flex justify-end gap-2 mt-6">
          <FormButton variant="secondary" onClick={handleCloseModal}>Cancelar</FormButton>
          <FormButton variant="primary" onClick={handleCreate}>Agregar libro</FormButton>
        </div>
      </Modal>

      <Modal isOpen={!!detalleId} onClose={() => setDetalleId(null)} title="Detalle del Libro" icon={BookOpen}>
        {!detalleData ? (
          <p className="text-sm text-[#8a8368] text-center py-6 animate-fadeIn">Cargando...</p>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="h-24 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <BookOpen size={30} className="text-white/30 relative z-10" />
              <span className="absolute bottom-2 right-3 font-mono text-[10px] text-white/50">{detalleData.id}</span>
            </div>
            <div>
              <p className="font-serif text-lg text-[#1a2520] leading-snug">{detalleData.titulo}</p>
              <p className="text-sm text-[#8a8368] mt-1 flex items-center gap-1.5"><Feather size={12} />{detalleData.autor}</p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">{detalleData.genero}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${detalleData.disponible ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300/60" : "bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 border border-rose-300/60"}`}>
                {detalleData.disponible ? "Disponible" : "Prestado"}
              </span>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} title="Eliminar libro" message={`¿Estás seguro de eliminar "${confirmDelete?.titulo}" del catálogo? Esta acción no se puede deshacer.`} icon={Trash2} />
    </div>
  );
}

// ============ PRESTAMOS VIEW ============

function PrestamosView({ prestamos, usuarios, libros, refresh, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [detalleId, setDetalleId] = useState(null);
  const [detalleData, setDetalleData] = useState(null);
  const [libroSel, setLibroSel] = useState("");
  const [usuarioSel, setUsuarioSel] = useState("");
  const [fechaPrestamo, setFechaPrestamo] = useState(new Date().toISOString().split("T")[0]);
  const [fechaVence, setFechaVence] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

  const librosDisponibles = libros.filter((l) => l.disponible);

  const resetForm = () => { setLibroSel(""); setUsuarioSel(""); setFechaPrestamo(new Date().toISOString().split("T")[0]); setFechaVence(""); setErrors({}); setTouched({}); };

  const handleOpenModal = () => { resetForm(); setShowModal(true); };

  const handleCloseModal = () => { setShowModal(false); setTimeout(resetForm, 300); };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = { ...errors };
    if (field === "libroSel") newErrors.libroSel = validateSelect(libroSel, "Selecciona un libro");
    if (field === "usuarioSel") newErrors.usuarioSel = validateSelect(usuarioSel, "Selecciona un usuario");
    if (field === "fechaPrestamo") newErrors.fechaPrestamo = validateDatePrestamo(fechaPrestamo);
    if (field === "fechaVence") newErrors.fechaVence = validateDate(fechaVence);
    setErrors(newErrors);
  };

  const handleSelectChange = (field, value, setter) => {
    setter(value);
    if (touched[field]) {
      const newErrors = { ...errors };
      if (field === "libroSel") newErrors.libroSel = validateSelect(value, "Selecciona un libro");
      if (field === "usuarioSel") newErrors.usuarioSel = validateSelect(value, "Selecciona un usuario");
      setErrors(newErrors);
    }
  };

  const handleDateChange = (v) => {
    setFechaVence(v);
    if (touched.fechaVence) setErrors((prev) => ({ ...prev, fechaVence: validateDate(v) }));
  };

  const handleDatePrestamoChange = (v) => {
    setFechaPrestamo(v);
    if (touched.fechaPrestamo) setErrors((prev) => ({ ...prev, fechaPrestamo: validateDatePrestamo(v) }));
  };

  const handleCreate = async () => {
    const e = {
      libroSel: validateSelect(libroSel, "Selecciona un libro"),
      usuarioSel: validateSelect(usuarioSel, "Selecciona un usuario"),
      fechaPrestamo: validateDatePrestamo(fechaPrestamo),
      fechaVence: validateDate(fechaVence),
    };
    setErrors(e);
    setTouched({ libroSel: true, usuarioSel: true, fechaPrestamo: true, fechaVence: true });
    if (e.libroSel || e.usuarioSel || e.fechaPrestamo || e.fechaVence) return;
    const libroSelObj = librosDisponibles.find((l) => l.id === libroSel);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const newLoan = {
      id: nextId(prestamos, "P"),
      libro: libroSelObj?.titulo || "",
      usuario: usuarioSel,
      prestamo: formatDate(fechaPrestamo),
      vence: formatDate(fechaVence),
      estado: new Date(fechaVence) < hoy ? "Vencido" : "Al dia",
    };
    try {
      await createPrestamo(newLoan);
      if (libroSelObj && libroSelObj.disponible) {
        await updateLibro(libroSelObj.id, {
          titulo: libroSelObj.titulo,
          autor: libroSelObj.autor,
          genero: libroSelObj.genero,
          disponible: false,
        });
      }
      await refresh();
      handleCloseModal();
      addToast({ type: "success", message: `Préstamo registrado para "${newLoan.usuario}"` });
    } catch (err) {
      addToast({ type: "error", message: `No se pudo registrar el préstamo: ${err.message}` });
    }
  };

  const handleReturn = async (prestamo) => {
    try {
      await deletePrestamo(prestamo.id);
      const libro = libros.find((l) => l.titulo === prestamo.libro);
      if (libro && !libro.disponible) {
        await updateLibro(libro.id, {
          titulo: libro.titulo,
          autor: libro.autor,
          genero: libro.genero,
          disponible: true,
        });
      }
      await refresh();
      addToast({ type: "success", message: `"${prestamo.libro}" devuelto exitosamente` });
    } catch (err) {
      addToast({ type: "error", message: `No se pudo devolver: ${err.message}` });
    }
  };

  const verDetalle = async (id) => {
    setDetalleId(id);
    setDetalleData(null);
    try {
      setDetalleData(await getPrestamo(id));
    } catch (err) {
      addToast({ type: "error", message: `No se pudo cargar el detalle: ${err.message}` });
      setDetalleId(null);
    }
  };

  const solicitudesPendientes = prestamos.filter((p) => p.estado === "Pendiente");

  const handleAprobar = async (solicitud) => {
    try {
      await aprobarPrestamo(solicitud.id);
      await refresh();
      addToast({ type: "success", message: `Préstamo de "${solicitud.libro}" aprobado para ${solicitud.usuario}` });
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  };

  const handleRechazar = async (solicitud) => {
    try {
      await deletePrestamo(solicitud.id);
      await refresh();
      addToast({ type: "info", message: `Solicitud de "${solicitud.libro}" rechazada` });
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  };

  const handleNotificar = async (prestamoVencido) => {
    try {
      await notificarTardio(prestamoVencido.id);
      await refresh();
      addToast({ type: "warning", message: `Notificación de entrega tardía enviada a ${prestamoVencido.usuario}` });
    } catch (err) {
      addToast({ type: "error", message: err.message });
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />
      <SectionHeader
        eyebrow="Control de préstamos"
        title="Préstamos"
        subtitle={`${prestamos.length} préstamos activos`}
        icon={ArrowLeftRight}
        action={
          <button onClick={handleOpenModal} className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-green-800 text-white text-sm px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-emerald-700/25 cursor-pointer font-semibold">
            <Plus size={16} /> Registrar préstamo
          </button>
        }
      />
      {solicitudesPendientes.length > 0 && (
        <div className="mb-6 animate-fadeIn">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
              <Hourglass size={15} className="text-white" />
            </div>
            <h3 className="font-serif text-base text-[#1a2520]">Solicitudes de préstamo</h3>
            <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">{solicitudesPendientes.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {solicitudesPendientes.map((s) => (
              <div key={s.id} className="relative bg-gradient-to-br from-white to-amber-50/60 rounded-2xl border border-amber-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                    <BookMarked size={18} className="text-amber-600" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-400">{s.id}</span>
                </div>
                <p className="text-sm font-serif font-bold text-[#1a2520] mb-1 leading-snug line-clamp-2">{s.libro}</p>
                <p className="text-[11px] text-[#8a8368] mb-4 flex items-center gap-1"><User size={10} /> {s.usuario}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleAprobar(s)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white text-xs font-bold hover:from-emerald-500 hover:to-green-600 transition-all duration-150 cursor-pointer shadow-sm active:scale-[0.97]">
                    <BadgeCheck size={13} /> Aprobar
                  </button>
                  <button onClick={() => handleRechazar(s)} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-100 to-red-100 text-rose-700 text-xs font-bold hover:from-rose-200 hover:to-red-200 transition-all duration-150 cursor-pointer border border-rose-300/60 active:scale-[0.97]">
                    <X size={13} /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative bg-white border border-[#d4c9a8]/50 rounded-2xl overflow-hidden shadow-lg animate-fadeIn" style={{ animationDelay: "100ms" }}>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500" />
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-800 text-xs uppercase tracking-wide">
              <th className="text-left font-bold px-5 py-3.5">ID</th>
              <th className="text-left font-bold px-5 py-3.5">Libro</th>
              <th className="text-left font-bold px-5 py-3.5">Usuario</th>
              <th className="text-left font-bold px-5 py-3.5">Préstamo</th>
              <th className="text-left font-bold px-5 py-3.5">Vence</th>
              <th className="text-left font-bold px-5 py-3.5">Estado</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((p) => (
              <tr key={p.id} className={`border-t border-amber-200/50 transition-all duration-200 ${hoveredRow === p.id ? "bg-gradient-to-r from-amber-50 to-yellow-50" : "bg-transparent"}`} onMouseEnter={() => setHoveredRow(p.id)} onMouseLeave={() => setHoveredRow(null)}>
                <td className="px-5 py-3.5 font-mono text-xs text-amber-600 font-bold">{p.id}</td>
                <td className="px-5 py-3.5 text-[#1a2520] font-semibold">{p.libro}</td>
                <td className="px-5 py-3.5 text-[#6f6a55]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center"><User size={12} className="text-amber-600" /></div>
                    {p.usuario}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[#6f6a55]"><div className="flex items-center gap-1.5"><Calendar size={13} className="text-emerald-500/70" />{p.prestamo}</div></td>
                <td className="px-5 py-3.5 text-[#6f6a55]"><div className="flex items-center gap-1.5"><Calendar size={13} className="text-amber-500/70" />{p.vence}</div></td>
                <td className="px-5 py-3.5"><EstadoBadge estado={p.estado} /></td>
                <td className="px-5 py-3.5">
                  <div className={`flex items-center gap-1 transition-all duration-200 ${hoveredRow === p.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                    {p.estado === "Vencido" && (
                      p.notificado_tardio ? (
                        <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold cursor-default" title="Retraso ya notificado">
                          <BellRing size={12} /> Notificado
                        </span>
                      ) : (
                        <button onClick={() => handleNotificar(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs font-bold hover:from-orange-200 hover:to-red-200 transition-all duration-150 cursor-pointer border border-orange-300/60 shadow-sm" title="Notificar entrega tardía">
                          <BellRing size={12} /> Notificar
                        </button>
                      )
                    )}
                    <button onClick={() => verDetalle(p.id)} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors cursor-pointer" title="Ver detalle"><Eye size={14} /></button>
                    <button onClick={() => handleReturn(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-xs font-bold hover:from-emerald-200 hover:to-green-200 transition-all duration-150 cursor-pointer border border-emerald-300/60 shadow-sm">
                      <RotateCcw size={12} /> Devolver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title="Registrar Préstamo" icon={ArrowLeftRight}>
        <FormField label="Libro" icon={BookOpen} error={errors.libroSel} required>
          <select value={libroSel} onChange={(e) => handleSelectChange("libroSel", e.target.value, setLibroSel)} onBlur={() => handleBlur("libroSel")} className={`${selectClass} ${errors.libroSel && touched.libroSel ? "border-2 border-red-300 bg-red-50/50" : ""}`}>
            <option value="">Seleccionar libro...</option>
            {librosDisponibles.map((l) => (<option key={l.id} value={l.id}>{l.titulo} — {l.autor}</option>))}
          </select>
        </FormField>
        <FormField label="Usuario" icon={User} error={errors.usuarioSel} required>
          <select value={usuarioSel} onChange={(e) => handleSelectChange("usuarioSel", e.target.value, setUsuarioSel)} onBlur={() => handleBlur("usuarioSel")} className={`${selectClass} ${errors.usuarioSel && touched.usuarioSel ? "border-2 border-red-300 bg-red-50/50" : ""}`}>
            <option value="">Seleccionar usuario...</option>
            {usuarios.filter((u) => u.estado === "Activo").map((u) => (<option key={u.id} value={u.nombre}>{u.nombre}</option>))}
          </select>
        </FormField>
        <FormField label="Fecha de préstamo" icon={Calendar} error={errors.fechaPrestamo} required>
          <input type="date" value={fechaPrestamo} onChange={(e) => handleDatePrestamoChange(e.target.value)} onBlur={() => handleBlur("fechaPrestamo")} className={getInputClass(errors.fechaPrestamo && touched.fechaPrestamo)} />
        </FormField>
        <FormField label="Fecha de vencimiento" icon={Calendar} error={errors.fechaVence} required>
          <input type="date" value={fechaVence} onChange={(e) => handleDateChange(e.target.value)} onBlur={() => handleBlur("fechaVence")} min={minDate} className={getInputClass(errors.fechaVence && touched.fechaVence)} />
        </FormField>
        <div className="flex justify-end gap-2 mt-6">
          <FormButton variant="secondary" onClick={handleCloseModal}>Cancelar</FormButton>
          <FormButton variant="primary" onClick={handleCreate}>Registrar préstamo</FormButton>
        </div>
      </Modal>

      <Modal isOpen={!!detalleId} onClose={() => setDetalleId(null)} title="Detalle del Préstamo" icon={ArrowLeftRight}>
        {!detalleData ? (
          <p className="text-sm text-[#8a8368] text-center py-6 animate-fadeIn">Cargando...</p>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <p className="font-serif text-lg text-[#1a2520] leading-snug">{detalleData.libro}</p>
              <p className="text-xs font-mono text-amber-600 font-bold mt-1">{detalleData.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Usuario</p>
                <p className="text-sm font-semibold text-[#1a2520]">{detalleData.usuario}</p>
              </div>
              <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Estado</p>
                <div className="mt-0.5"><EstadoBadge estado={detalleData.estado} /></div>
              </div>
              <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Préstamo</p>
                <p className="text-sm text-[#1a2520]">{detalleData.prestamo}</p>
              </div>
              <div className="rounded-xl bg-white/80 border border-[#d4c9a8] px-4 py-2.5">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-0.5">Vence</p>
                <p className="text-sm text-[#1a2520]">{detalleData.vence}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============ MIS PRESTAMOS VIEW (USUARIO) ============

function MisPrestamosView({ misPrestamos, libros }) {
  const pendientes = misPrestamos.filter((p) => p.estado === "Pendiente");
  const activos = misPrestamos.filter((p) => p.estado === "Al dia");
  const vencidos = misPrestamos.filter((p) => p.estado === "Vencido");
  const disponibles = libros.filter((l) => l.disponible);

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />
      <SectionHeader
        eyebrow="Hola"
        title="Mis préstamos"
        subtitle={`${activos.length} activos · ${pendientes.length} en solicitud · ${vencidos.length} vencidos`}
        icon={BookMarked}
        action={
          <span className="text-xs text-[#8a8368] bg-white/70 border border-[#d4c9a8]/60 px-4 py-2 rounded-xl">
            Solicita nuevos libros desde el <strong>Catálogo</strong>
          </span>
        }
      />

      {pendientes.length > 0 && (
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
              <Hourglass size={15} className="text-white" />
            </div>
            <h3 className="font-serif text-base text-[#1a2520]">En espera de aprobación</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {pendientes.map((s) => (
              <div key={s.id} className="relative bg-gradient-to-br from-white to-amber-50/60 rounded-2xl border border-amber-200/60 p-5 shadow-sm overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500" />
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                    <BookMarked size={18} className="text-amber-600" />
                  </div>
                  <EstadoBadge estado={s.estado} />
                </div>
                <p className="text-sm font-serif font-bold text-[#1a2520] leading-snug line-clamp-2">{s.libro}</p>
                <p className="text-[11px] text-[#8a8368] mt-2">Un empleado revisará tu solicitud pronto</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {misPrestamos.filter((p) => p.estado !== "Pendiente").length > 0 ? (
        <div className="relative bg-white border border-[#d4c9a8]/50 rounded-2xl overflow-hidden shadow-lg animate-fadeIn">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500" />
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-800 text-xs uppercase tracking-wide">
                <th className="text-left font-bold px-5 py-3.5">Libro</th>
                <th className="text-left font-bold px-5 py-3.5">Fecha préstamo</th>
                <th className="text-left font-bold px-5 py-3.5">Vence</th>
                <th className="text-left font-bold px-5 py-3.5">Estado</th>
                <th className="text-left font-bold px-5 py-3.5">Aviso</th>
              </tr>
            </thead>
            <tbody>
              {misPrestamos.filter((p) => p.estado !== "Pendiente").map((p) => (
                <tr key={p.id} className="border-t border-amber-200/50 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-all duration-200">
                  <td className="px-5 py-3.5 text-[#1a2520] font-semibold">{p.libro}</td>
                  <td className="px-5 py-3.5 text-[#6f6a55]"><div className="flex items-center gap-1.5"><Calendar size={13} className="text-emerald-500/70" />{p.prestamo || "—"}</div></td>
                  <td className="px-5 py-3.5 text-[#6f6a55]"><div className="flex items-center gap-1.5"><Calendar size={13} className="text-amber-500/70" />{p.vence || "—"}</div></td>
                  <td className="px-5 py-3.5"><EstadoBadge estado={p.estado} /></td>
                  <td className="px-5 py-3.5">
                    {p.notificado_tardio ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-bold w-fit">
                        <BellRing size={11} /> Se te notificó el retraso
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#a89f81]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        pendientes.length === 0 && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <BookOpen size={36} className="text-amber-400/60" />
            </div>
            <p className="text-[#1a2520] text-lg font-serif">Aún no tienes préstamos</p>
            <p className="text-[#8a8368] text-sm mt-1">{disponibles.length} libros disponibles en el catálogo esperándote</p>
          </div>
        )
      )}
    </div>
  );
}

const NAV = [
  { key: "inicio", label: "Inicio", icon: Sparkles, roles: ["admin", "empleado"] },
  { key: "usuarios", label: "Usuarios", icon: Users, roles: ["admin"] },
  { key: "libros", label: "Catálogo", icon: Library, roles: ["admin", "empleado", "usuario"] },
  { key: "prestamos", label: "Préstamos", icon: ArrowLeftRight, roles: ["admin", "empleado"] },
  { key: "mis-prestamos", label: "Mis préstamos", icon: BookMarked, roles: ["usuario"] },
];

// ============ SIDEBAR ============

function Sidebar({ tab, setTab, collapsed, setCollapsed, user, onLogout }) {
  const items = NAV.filter((item) => item.roles.includes(user?.rol));
  const rolInfo = ROL_BADGE_STYLE[user?.rol];
  return (
    <aside className={`shrink-0 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-64"} bg-gradient-to-b from-[#0f2b1a] via-[#164a2d] to-[#0f2b1a] text-[#f7f2e7] shadow-2xl shadow-black/20`}>
      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25">
            <BookOpen size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fadeIn overflow-hidden">
              <p className="font-serif text-lg leading-tight whitespace-nowrap text-white">Biblioteca</p>
              <p className="text-[10px] text-[#8b9690] whitespace-nowrap">Sistema de gestión</p>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 py-4 px-2.5">
        {items.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} title={collapsed ? label : undefined} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 mb-1.5 cursor-pointer ${tab === key ? "bg-gradient-to-r from-amber-500/20 to-amber-400/5 text-white shadow-md shadow-amber-500/10 border border-amber-400/20" : "text-[#9aa69e] hover:bg-white/5 hover:text-white border border-transparent"}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${tab === key ? "bg-amber-500 text-white shadow-sm" : "bg-white/5"}`}>
              <Icon size={16} />
            </div>
            {!collapsed && <span className="whitespace-nowrap animate-fadeIn font-medium">{label}</span>}
            {!collapsed && tab === key && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-dot" />}
          </button>
        ))}
      </nav>
      <div className="px-3 mb-3 space-y-2">
        {!collapsed && (
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rolInfo?.cls.includes("rose") ? "from-rose-500 to-red-600" : rolInfo?.cls.includes("amber") ? "from-amber-500 to-orange-600" : "from-emerald-500 to-green-600"} flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm`}>
                {user?.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.nombre}</p>
                <p className="flex items-center gap-1 text-[10px] text-[#9aa69e]">
                  {rolInfo && <rolInfo.icon size={9} />}
                  {ROL_LABEL[user?.rol]}
                </p>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-[#8b9690] text-xs cursor-pointer border border-white/5">
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Colapsar</span></>}
        </button>
        <button onClick={onLogout} title="Cerrar sesión" className={`w-full flex items-center gap-2 py-2 rounded-xl transition-all duration-200 text-xs font-semibold cursor-pointer border border-rose-400/20 text-rose-200 hover:bg-rose-500/15 ${collapsed ? "justify-center" : "justify-center"}`}>
          <LogOut size={14} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
      <div className="px-4 py-3 border-t border-white/10 text-[10px] text-[#5a6a5e]">
        {collapsed ? "v2.0" : "v2.0 · Sesión segura"}
      </div>
    </aside>
  );
}

// ============ APP ============

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("inicio");
  const [collapsed, setCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [misPrestamos, setMisPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Restaurar sesión guardada
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getPerfil()
      .then((perfil) => setUser(perfil))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      });
  }, []);

  const handleLogin = (usuario, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    setUser(usuario);
    setTab(usuario.rol === "usuario" ? "libros" : "inicio");
    setLoading(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setTab("inicio");
    setUsuarios([]);
    setLibros([]);
    setPrestamos([]);
    setMisPrestamos([]);
    setApiError(null);
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      if (user.rol === "usuario") {
        const [l, p] = await Promise.all([getLibros(), getMisPrestamos()]);
        setLibros(l);
        setMisPrestamos(p);
      } else {
        const [u, l, p] = await Promise.all([getUsuarios(), getLibros(), getPrestamos()]);
        setUsuarios(u);
        setLibros(l);
        setPrestamos(p);
      }
      setApiError(null);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleRetry = () => {
    setLoading(true);
    refresh();
  };

  if (!user || !localStorage.getItem("token")) {
    return <Login onLogin={handleLogin} />;
  }

  const tabsPermitidos = NAV.filter((item) => item.roles.includes(user.rol));
  const tabDefault = user.rol === "usuario" ? "libros" : "inicio";
  const tabActual = tabsPermitidos.some((item) => item.key === tab) ? tab : tabDefault;

  const views = {
    inicio: <Inicio usuarios={usuarios} libros={libros} prestamos={prestamos} />,
    usuarios: <UsuariosView usuarios={usuarios} refresh={refresh} addToast={addToast} />,
    libros: <LibrosView libros={libros} refresh={refresh} addToast={addToast} user={user} misPrestamos={misPrestamos} />,
    prestamos: <PrestamosView prestamos={prestamos} usuarios={usuarios} libros={libros} refresh={refresh} addToast={addToast} />,
    "mis-prestamos": <MisPrestamosView misPrestamos={misPrestamos} libros={libros} />,
  };

  return (
    <div className="min-h-screen flex bg-[#faf6eb] font-sans">
      <Sidebar tab={tabActual} setTab={setTab} collapsed={collapsed} setCollapsed={setCollapsed} user={user} onLogout={handleLogout} />
      <main key={tabActual} className="flex-1 px-10 py-8 overflow-y-auto animate-fadeIn relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25 animate-pulse">
              <BookOpen size={28} className="text-white" />
            </div>
            <p className="text-sm text-[#8a8368]">Cargando datos desde el servidor...</p>
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center py-40 gap-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <AlertTriangle size={28} className="text-white" />
            </div>
            <p className="font-serif text-xl text-[#1a2520]">No se pudo conectar con el servidor</p>
            <p className="text-xs text-[#8a8368] max-w-md text-center break-all">{apiError}</p>
            <p className="text-[11px] text-[#a89f81]">Verifica que el backend esté corriendo en el puerto 3000.</p>
            <button onClick={handleRetry} className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-emerald-700/25 cursor-pointer">
              Reintentar
            </button>
          </div>
        ) : (
          views[tabActual]
        )}
        <footer className="mt-12 pt-6 border-t border-amber-200/60 text-center text-xs text-amber-700/70">
          Hecho por <span className="font-semibold text-amber-800">Joseph Sanchez</span>
        </footer>
      </main>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
