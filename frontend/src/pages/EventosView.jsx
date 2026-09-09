import { useState } from "react";
import {
  CalendarDays,
  Search,
  Mic,
  MapPin,
  Clock,
  Users,
  Ticket,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Hourglass,
  Star,
  Palette,
  X,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import Modal from "../components/Modal";
import PatternBg from "../components/PatternBg";
import FormButton from "../components/FormButton";
import { getInputClass } from "../utils/helpers";

const TYPE_STYLES = {
  charla: {
    label: "Charla",
    badge: "bg-amber-100 text-amber-800 border border-amber-300",
    dot: "bg-amber-500",
    grad: "from-amber-500 to-orange-600",
    bar: "from-amber-500 to-yellow-500",
    icon: Mic,
  },
  taller: {
    label: "Taller",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    dot: "bg-emerald-500",
    grad: "from-emerald-600 to-green-700",
    bar: "from-emerald-500 to-green-600",
    icon: Sparkles,
  },
  club: {
    label: "Club",
    badge: "bg-[#2B2118]/10 text-[#3A2618] border border-[#3A2618]/25",
    dot: "bg-[#3A2618]",
    grad: "from-emerald-700 to-green-900",
    bar: "from-[#2B2118] to-[#3A2618]",
    icon: Users,
  },
  exhibicion: {
    label: "Exhibición",
    badge: "bg-[#C49A55]/15 text-[#7a5f16] border border-[#C49A55]/50",
    dot: "bg-[#C49A55]",
    grad: "from-amber-600 to-yellow-700",
    bar: "from-[#C49A55] to-amber-500",
    icon: Palette,
  },
  infantil: {
    label: "Infantil",
    badge: "bg-teal-50 text-teal-700 border border-teal-300",
    dot: "bg-teal-500",
    grad: "from-teal-500 to-emerald-700",
    bar: "from-teal-500 to-emerald-600",
    icon: Star,
  },
};

const STATUS_STYLES = {
  proximo: { label: "Próximo", badge: "bg-emerald-100 text-emerald-700 border border-emerald-300/70", dot: "bg-emerald-500" },
  en_curso: { label: "En curso", badge: "bg-amber-100 text-amber-700 border border-amber-300/70 animate-pulse-subtle", dot: "bg-amber-500" },
  finalizado: { label: "Finalizado", badge: "bg-stone-100 text-stone-500 border border-stone-300/70", dot: "bg-stone-400" },
};

const TYPE_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "charla", label: "Charlas" },
  { key: "taller", label: "Talleres" },
  { key: "club", label: "Clubes" },
  { key: "exhibicion", label: "Exhibiciones" },
  { key: "infantil", label: "Infantil" },
];

const STATUS_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "proximo", label: "Próximos" },
  { key: "en_curso", label: "En curso" },
  { key: "finalizado", label: "Finalizados" },
];

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DEFAULT_ENROLLED = ["ev-001", "ev-002", "ev-007"];

const MOCK_EVENTS = [
  {
    id: "ev-001",
    title: "Encuentro con la autora Marina Guzmán",
    type: "charla",
    status: "proximo",
    date: new Date(2026, 8, 12, 18, 0),
    time: "18:00",
    location: "Auditorio Central · Biblioteca",
    speaker: "Marina Guzmán",
    capacity: 40,
    registrados: 28,
    description:
      "Conversación abierta sobre su novela «La casa de las mareas», el proceso de escritura y los retos de publicar una voz propia en América Latina. Habrá sesión de preguntas del público y firma de ejemplares.",
    speakerBio:
      "Marina Guzmán es novelista y ensayista. Ha publicado cinco libros y su obra ha sido traducida a doce idiomas. Explora la memoria, el exilio y la identidad a través de una prosa cálida y precisa.",
  },
  {
    id: "ev-002",
    title: "Taller de escritura creativa: personajes memorables",
    type: "taller",
    status: "proximo",
    date: new Date(2026, 9, 3, 16, 30),
    time: "16:30",
    location: "Sala B · Biblioteca Central",
    speaker: "Carlos Fuentes R.",
    capacity: 20,
    registrados: 14,
    description:
      "Cuatro sesiones prácticas para construir personajes con voz propia: motivaciones, conflictos, diálogo y arcos de transformación. Incluye lecturas guiadas y entregas con retroalimentación.",
    speakerBio:
      "Carlos Fuentes R. es tallerista literario y editor. Ha coordinado más de 60 talleres de narrativa en centros culturales y ferias del libro de la región.",
  },
  {
    id: "ev-003",
    title: "Club de lectura «Rayuela» · Sesión I",
    type: "club",
    status: "proximo",
    date: new Date(2026, 8, 26, 18, 0),
    time: "18:00",
    location: "Terraza de lectura",
    speaker: "Coordinación: Lucía Herrera",
    capacity: 25,
    registrados: 25,
    description:
      "Primera sesión del club dedicado a «Rayuela» de Julio Cortázar. Compartiremos nuestras primeras impresiones del tablero de dirección y acordaremos el recorrido de lectura.",
    speakerBio:
      "Lucía Herrera es docente y mediadora de lectura. Conduce tres clubes de lectura en la biblioteca desde 2021 y ha formado a más de 300 lectores.",
  },
  {
    id: "ev-004",
    title: "Exposición «Luciérnagas en el papel»",
    type: "exhibicion",
    status: "en_curso",
    date: new Date(2026, 8, 1, 10, 0),
    endDate: new Date(2026, 9, 15),
    time: "10:00 - 19:00",
    location: "Galería del Fondo Antiguo",
    speaker: "Curaduría: Elena Marchetti",
    capacity: 60,
    registrados: 41,
    description:
      "Muestra de grabados y acuarelas que dialogan con textos de mujeres poetas del siglo XX. Visitas guiadas cada fin de semana y cierre con lectura colectiva.",
    speakerBio:
      "Elena Marchetti es curadora e historiadora del arte. Ha gestionado exposiciones en museos de Argentina, Chile y España y colabora con el archivo gráfico de la biblioteca.",
  },
  {
    id: "ev-005",
    title: "Cuentacuentos para pequeños viajeros",
    type: "infantil",
    status: "proximo",
    date: new Date(2026, 8, 19, 11, 0),
    time: "11:00",
    location: "Sala infantil · 1er piso",
    speaker: "Narradora: Valentina Ríos",
    capacity: 30,
    registrados: 18,
    description:
      "Recorrido de cuentos del mundo entero para niñas y niños de 4 a 9 años, con títeres, música en vivo y un pasaporte de lecturas para llevar a casa.",
    speakerBio:
      "Valentina Ríos es narradora oral y actriz. Participa en festivales de narración y coordina el programa «Leer camina» en escuelas de la ciudad.",
  },
  {
    id: "ev-006",
    title: "Taller de restauración de libros antiguos",
    type: "taller",
    status: "finalizado",
    date: new Date(2026, 7, 22, 15, 0),
    time: "15:00",
    location: "Laboratorio de conservación",
    speaker: "Restauradora: Paula Duarte",
    capacity: 12,
    registrados: 12,
    description:
      "Introducción a la conservación preventiva, limpieza y encuadernación básica aplicadas a fondos patrimoniales. Práctica con materiales del propio archivo.",
    speakerBio:
      "Paula Duarte es bibliotecóloga especializada en conservación. Dirige el laboratorio de restauración de la Biblioteca Central.",
  },
  {
    id: "ev-007",
    title: "Charla: Grandes librerías de Latinoamérica",
    type: "charla",
    status: "finalizado",
    date: new Date(2026, 7, 15, 18, 30),
    time: "18:30",
    location: "Auditorio Central · Biblioteca",
    speaker: "Santiago Capel",
    capacity: 80,
    registrados: 64,
    description:
      "Un recorrido ilustrado por librerías emblemáticas de Ciudad de México, Buenos Aires, Bogotá y São Paulo, y su papel en la vida cultural de cada ciudad.",
    speakerBio:
      "Santiago Capel es periodista cultural y escritor de viajes. Publica sobre el circuito librero latinoamericano en revistas especializadas.",
  },
  {
    id: "ev-008",
    title: "Club de lectura juvenil: distopías",
    type: "club",
    status: "proximo",
    date: new Date(2026, 9, 10, 17, 0),
    time: "17:00",
    location: "Aula de jóvenes · 2do piso",
    speaker: "Coordinación: Tomás Ríos",
    capacity: 22,
    registrados: 9,
    description:
      "Para lectores de 14 a 17 años. Leeremos «Un mundo feliz» y conversaremos sobre control, placer y libertad en las sociedades modernas.",
    speakerBio:
      "Tomás Ríos dirige el programa juvenil de la biblioteca y selecciona lecturas que conversan con la actualidad y la cultura del entretenimiento.",
  },
];

function dayNum(d) {
  return d.getDate();
}

function monthShort(d) {
  return MONTHS_ES[d.getMonth()];
}

function formatLong(d) {
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatMonth(year, month) {
  const s = new Date(year, month, 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function daysUntil(d) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function capBar(pct) {
  if (pct >= 90) return "from-rose-500 to-red-600";
  if (pct >= 75) return "from-[#C49A55] to-amber-600";
  return "from-emerald-500 to-green-600";
}

function CountdownChip({ event }) {
  if (event.status === "en_curso") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-300/70 animate-pulse-subtle">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        En curso ahora
      </span>
    );
  }
  const days = daysUntil(event.date);
  if (days === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#C49A55] text-white border border-[#C49A55]">
        <Sparkles size={11} />
        ¡Hoy!
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300/70">
      <Hourglass size={11} />
      {days === 1 ? "Falta 1 día" : `Faltan ${days} días`}
    </span>
  );
}

function TypeBadge({ type }) {
  const t = TYPE_STYLES[type] || TYPE_STYLES.charla;
  return (
    <span className={`inline-flex items-center rounded-full text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 ${t.badge}`}>
      {t.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.finalizado;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function DateBadge({ date, large }) {
  const d = dayNum(date);
  return (
    <div
      className={`shrink-0 rounded-2xl bg-gradient-to-br from-[#2B2118] to-[#3A2618] text-[#C49A55] flex flex-col items-center justify-center shadow-md group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-200 ${large ? "w-16 h-16" : "w-14 h-14"}`}
    >
      <span className="text-[9px] uppercase tracking-widest font-bold text-amber-200/80 leading-none">{monthShort(date)}</span>
      <span className={`font-black leading-none text-white ${large ? "text-2xl mt-0.5" : "text-xl mt-0.5"}`}>{d}</span>
    </div>
  );
}

export default function EventosView({ user, addToast }) {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [enrolledIds, setEnrolledIds] = useState(DEFAULT_ENROLLED);
  const [typeFilter, setTypeFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [myTab, setMyTab] = useState("inscritos");
  const [calView, setCalView] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [calSelected, setCalSelected] = useState(null);

  const currentName = user?.nombre || "lector";

  const upcoming = events.filter((e) => e.status === "proximo").sort((a, b) => a.date - b.date);
  const featured = upcoming[0];

  const filtered = events.filter((e) => {
    const q = search.trim().toLowerCase();
    const matchType = typeFilter === "todos" || e.type === typeFilter;
    const matchStatus = statusFilter === "todos" || e.status === statusFilter;
    const matchQ =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.speaker.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q);
    return matchType && matchStatus && matchQ;
  });

  const selectedEvent = events.find((e) => e.id === selectedId) || null;
  const isEnrolled = (id) => enrolledIds.includes(id);

  const myEvents = events.filter((e) => isEnrolled(e.id));
  const myInscritos = myEvents.filter((e) => e.status !== "finalizado");
  const myPasados = myEvents.filter((e) => e.status === "finalizado");

  const handleEnroll = (id) => {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    if (ev.status === "finalizado") {
      addToast({ type: "info", message: "Este evento ya finalizó" });
      return;
    }
    if (isEnrolled(id)) {
      addToast({ type: "info", message: `Ya estás inscrito en «${ev.title}»` });
      return;
    }
    setEnrolledIds((prev) => [...prev, id]);
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, registrados: Math.min(e.registrados + 1, e.capacity) } : e)));
    addToast({ type: "success", message: `Inscripción confirmada en «${ev.title}»` });
  };

  const handleCancel = (id) => {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    setEnrolledIds((prev) => prev.filter((x) => x !== id));
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, registrados: Math.max(e.registrados - 1, 0) } : e)));
    addToast({ type: "info", message: `Cancelaste tu inscripción a «${ev.title}»` });
  };

  const openDetail = (id) => setSelectedId(id);

  // ===== calendar helpers =====
  const changeMonth = (dir) => {
    setCalView((prev) => {
      const d = new Date(prev.year, prev.month + dir, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const firstOffset = (new Date(calView.year, calView.month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(calView.year, calView.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const eventsByDay = {};
  events.forEach((e) => {
    if (e.date.getFullYear() === calView.year && e.date.getMonth() === calView.month) {
      const day = e.date.getDate();
      eventsByDay[day] = eventsByDay[day] || [];
      eventsByDay[day].push(e);
    }
  });

  const selectedDayEvents = calSelected ? eventsByDay[calSelected.day] || [] : [];
  const now = new Date();

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />
      <SectionHeader
        eyebrow="Agenda cultural"
        title="Eventos y Actividades"
        subtitle="Charlas, talleres, clubes y exposiciones para toda la comunidad lectora"
        icon={CalendarDays}
        action={
          <div className="flex items-center gap-2.5 bg-white border border-[#C9A97E]/60 rounded-xl px-4 py-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-sm font-black text-[#2B2118]">{upcoming.length}</span>
            <span className="text-xs text-[#6f6a55] font-medium">eventos próximos</span>
          </div>
        }
      />

      {/* ================= FILTER BAR ================= */}
      <div className="relative bg-white border border-[#C9A97E]/60 rounded-2xl p-4 shadow-sm space-y-4 animate-fadeIn" style={{ animationDelay: "80ms" }}>
        <div className="flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((f) => {
            const active = typeFilter === f.key;
            const count = f.key === "todos" ? events.length : events.filter((e) => e.type === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer active:scale-[0.96] ${
                  active
                    ? "bg-gradient-to-r from-[#2B2118] to-[#3A2618] text-white shadow-md shadow-emerald-900/20"
                    : "bg-[#f5f0e4] text-[#4a4738] border border-[#C9A97E] hover:bg-[#ede6d2]"
                }`}
              >
                {f.label}
                <span className={`text-[10px] font-black rounded-full px-1.5 py-0.5 ${active ? "bg-[#C49A55] text-white" : "bg-white text-[#8a8368] border border-[#C9A97E]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#8a8368] mr-1">Estado</span>
            {STATUS_FILTERS.map((f) => {
              const active = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active ? "bg-[#C49A55] text-white shadow-md shadow-amber-600/25" : "bg-amber-50 text-[#6f6a55] border border-[#C9A97E] hover:bg-amber-100"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <div className="relative flex-1 lg:max-w-md">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C49A55]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, ponente o lugar..."
              className={`${getInputClass(false)}`}
              style={{ paddingLeft: "2.6rem", paddingRight: search ? "2.75rem" : "1rem" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= FEATURED EVENT ================= */}
      {featured && (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/25 animate-fadeIn" style={{ animationDelay: "140ms" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B2118] via-[#3A2618] to-[#2B2118]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 85% 15%, rgba(201,162,76,0.25) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(16,185,129,0.18) 0%, transparent 45%)",
            }}
          />
          <div className="relative px-6 sm:px-10 py-8 flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-4">
                <Sparkles size={13} className="text-[#C49A55]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200">Evento destacado</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl text-white leading-tight mb-3">{featured.title}</h2>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-emerald-100/85 text-sm mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#C49A55]" />
                  <span className="capitalize">{formatLong(featured.date)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#C49A55]" />
                  {featured.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#C49A55]" />
                  {featured.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mic size={14} className="text-[#C49A55]" />
                  {featured.speaker}
                </span>
              </div>
              <div className="max-w-xl">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-emerald-200/70">Cupos disponibles</span>
                  <span className="text-[#C49A55]">
                    {featured.registrados} / {featured.capacity} inscritos
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#C49A55] to-amber-500 transition-all duration-700"
                    style={{ width: `${Math.min((featured.registrados / featured.capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-60">
              <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-200/80 mb-1">{monthShort(featured.date)}</p>
                <p className="text-5xl font-black text-white leading-none">{dayNum(featured.date)}</p>
                <p className="text-xs text-emerald-100/70 mt-1.5">
                  {featured.date.toLocaleDateString("es-ES", { weekday: "long" })}
                </p>
                <button
                  onClick={() => (isEnrolled(featured.id) ? openDetail(featured.id) : handleEnroll(featured.id))}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97] cursor-pointer shadow-lg ${
                    isEnrolled(featured.id)
                      ? "bg-white/15 border border-white/25 text-emerald-200"
                      : "bg-gradient-to-r from-[#C49A55] to-amber-500 text-[#2B2118] shadow-amber-600/30 hover:from-[#d8b45f] hover:to-amber-400"
                  }`}
                >
                  {isEnrolled(featured.id) ? (
                    <>
                      <CheckCheck size={16} /> Inscrito
                    </>
                  ) : (
                    <>
                      <Ticket size={16} /> Inscribirse
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EVENTS GRID ================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center shadow-md shadow-emerald-700/20">
            <CalendarDays size={17} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#2B2118] leading-none">Todas las actividades</h3>
            <p className="text-xs text-[#8a8368] mt-1">{filtered.length} evento(s) según tu búsqueda</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-amber-100/60 rounded-2xl shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Search size={28} className="text-amber-400/60" />
            </div>
            <p className="text-[#2B2118] text-lg font-serif">No se encontraron eventos</p>
            <p className="text-[#8a8368] text-sm mt-1">Prueba con otros filtros o términos de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((e, i) => {
              const _t = TYPE_STYLES[e.type] || TYPE_STYLES.charla;
              const pct = Math.min((e.registrados / e.capacity) * 100, 100);
              const enrolled = isEnrolled(e.id);
              const done = e.status === "finalizado";
              const full = e.registrados >= e.capacity && !done;
              return (
                <div
                  key={e.id}
                  onClick={() => openDetail(e.id)}
                  className="group relative bg-white rounded-2xl border border-amber-100/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C49A55] via-emerald-600 to-[#C49A55]" />
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <DateBadge date={e.date} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                          <TypeBadge type={e.type} />
                          <StatusBadge status={e.status} />
                        </div>
                        <h3 className="font-serif text-base text-[#2B2118] leading-snug group-hover:text-[#3A2618] transition-colors">
                          {e.title}
                        </h3>
                        <div className="mt-2 space-y-1 text-xs text-[#6f6a55]">
                          <p className="flex items-center gap-1.5 truncate">
                            <Clock size={12} className="text-[#C49A55] shrink-0" />
                            <span className="font-semibold text-[#2B2118]">{e.time}</span>
                          </p>
                          <p className="flex items-center gap-1.5 truncate">
                            <MapPin size={12} className="text-[#C49A55] shrink-0" />
                            {e.location}
                          </p>
                          <p className="flex items-center gap-1.5 truncate">
                            <Mic size={12} className="text-[#C49A55] shrink-0" />
                            {e.speaker}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#C9A97E]/40">
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                        <span className="text-[#8a8368]">Capacidad</span>
                        <span className={full ? "text-rose-600" : pct >= 75 && !done ? "text-amber-700" : "text-emerald-700"}>
                          {done ? "Evento finalizado" : `${e.registrados} / ${e.capacity} inscritos`}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-amber-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${done ? "from-stone-400 to-stone-500" : capBar(pct)} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gradient-to-r from-[#f5f0e4] to-[#faf6eb] border-t border-[#C9A97E]/40">
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (done) {
                          openDetail(e.id);
                          return;
                        }
                        enrolled ? handleCancel(e.id) : handleEnroll(e.id);
                      }}
                      className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                        done
                          ? "bg-stone-100 text-stone-500 border border-stone-300/70"
                          : enrolled
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300/60 hover:bg-emerald-200"
                            : full
                              ? "bg-rose-100 text-rose-700 border border-rose-300/60 cursor-not-allowed"
                              : "bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-600 hover:to-green-700 shadow-sm active:scale-[0.97]"
                      }`}
                    >
                      {done ? (
                        "Ver detalles"
                      ) : enrolled ? (
                        <>
                          <CheckCheck size={13} /> Inscrito
                        </>
                      ) : full ? (
                        "Cupos llenos"
                      ) : (
                        <>
                          <Ticket size={13} /> Inscribirme
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= MY EVENTS ================= */}
      <section className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#faf6eb] to-[#f5f0e4] border border-[#C9A97E]/70 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C49A55] to-amber-600 flex items-center justify-center shadow-md shadow-amber-600/20">
              <Ticket size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-xl text-[#2B2118] leading-none">Mis eventos</h3>
              <p className="text-xs text-[#8a8368] mt-1">
                Hola, <span className="font-bold text-[#6f6a55]">{currentName}</span> — {myEvents.length} actividad(es) en tu agenda
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-5">
            {[
              { key: "inscritos", label: `Inscritos (${myInscritos.length})`, icon: Hourglass },
              { key: "pasados", label: `Pasados (${myPasados.length})`, icon: Calendar },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setMyTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  myTab === key
                    ? "bg-gradient-to-r from-[#2B2118] to-[#3A2618] text-white shadow-md shadow-emerald-900/20"
                    : "bg-white text-[#6f6a55] border border-[#C9A97E] hover:bg-amber-50"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {myTab === "inscritos" && myInscritos.length === 0 && (
            <div className="text-center py-10 bg-white/70 rounded-2xl border border-dashed border-[#C9A97E]">
              <Ticket size={26} className="mx-auto text-[#C49A55]/50 mb-2" />
              <p className="font-serif text-base text-[#2B2118]">Aún no tienes inscripciones activas</p>
              <p className="text-xs text-[#8a8368] mt-1">Explora la agenda y asegura tu lugar</p>
            </div>
          )}
          {myTab === "pasados" && myPasados.length === 0 && (
            <div className="text-center py-10 bg-white/70 rounded-2xl border border-dashed border-[#C9A97E]">
              <Calendar size={26} className="mx-auto text-[#C49A55]/50 mb-2" />
              <p className="font-serif text-base text-[#2B2118]">No hay eventos pasados</p>
              <p className="text-xs text-[#8a8368] mt-1">Tu historial de eventos aparecerá aquí</p>
            </div>
          )}

          <div className="space-y-3">
            {(myTab === "inscritos" ? myInscritos : myPasados).map((e) => {
              const _t = TYPE_STYLES[e.type] || TYPE_STYLES.charla;
              const enrolled = isEnrolled(e.id);
              return (
                <div
                  key={e.id}
                  onClick={() => openDetail(e.id)}
                  className="group flex items-center gap-4 rounded-2xl bg-white border border-amber-100/60 p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <DateBadge date={e.date} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <TypeBadge type={e.type} />
                      <StatusBadge status={e.status} />
                    </div>
                    <h4 className="font-serif text-base text-[#2B2118] leading-snug truncate">{e.title}</h4>
                    <p className="text-xs text-[#8a8368] mt-1 flex items-center gap-1.5 truncate">
                      <Clock size={11} className="text-[#C49A55] shrink-0" />
                      {e.time}
                      <span className="text-[#C9A97E]">{"\u{1F4C5}"}</span>
                      <MapPin size={11} className="text-[#C49A55] shrink-0" />
                      {e.location}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {e.status === "finalizado" ? (
                      <span className="text-xs text-stone-400 font-semibold">
                        Finalizado · {dayNum(e.date)} {monthShort(e.date)}
                      </span>
                    ) : (
                      <CountdownChip event={e} />
                    )}
                    {enrolled && e.status !== "finalizado" && (
                      <button
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleCancel(e.id);
                        }}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full px-3 py-1 transition-colors cursor-pointer"
                      >
                        Cancelar inscripción
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CALENDAR ================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C49A55] to-amber-600 flex items-center justify-center shadow-md shadow-amber-600/20">
            <Calendar size={17} className="text-white" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#2B2118] leading-none">Calendario de actividades</h3>
            <p className="text-xs text-[#8a8368] mt-1">Selecciona un día para ver qué se agenda</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-100/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#f5f0e4] to-[#faf6eb] border-b border-[#C9A97E]/50">
            <button
              onClick={() => changeMonth(-1)}
              className="w-9 h-9 rounded-xl bg-white border border-[#C9A97E] flex items-center justify-center text-[#6f6a55] hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <ChevronLeft size={17} />
            </button>
            <h4 className="font-serif text-lg text-[#2B2118] capitalize">{formatMonth(calView.year, calView.month)}</h4>
            <button
              onClick={() => changeMonth(1)}
              className="w-9 h-9 rounded-xl bg-white border border-[#C9A97E] flex items-center justify-center text-[#6f6a55] hover:bg-amber-50 transition-colors cursor-pointer"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] uppercase tracking-widest font-bold text-[#8a8368] py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} className="aspect-square" />;
                const dayEvents = eventsByDay[day] || [];
                const isSelected = calSelected && calSelected.year === calView.year && calSelected.month === calView.month && calSelected.day === day;
                const isToday = day === now.getDate() && calView.month === now.getMonth() && calView.year === now.getFullYear();
                const dots = dayEvents.slice(0, 3);
                return (
                  <button
                    key={day}
                    onClick={() => setCalSelected({ year: calView.year, month: calView.month, day })}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-br from-[#2B2118] to-[#3A2618] text-white shadow-md shadow-emerald-900/20 scale-[0.97]"
                        : isToday
                          ? "bg-[#C49A55]/15 text-[#7a5f16] border border-[#C49A55]/50 font-bold"
                          : dayEvents.length > 0
                            ? "bg-amber-50 hover:bg-amber-100 text-[#2B2118]"
                            : "text-[#4a4738] hover:bg-amber-50"
                    }`}
                  >
                    <span className="text-sm font-bold leading-none">{day}</span>
                    {dayEvents.length > 0 && (
                      <span className="flex gap-0.5">
                        {dots.map((ev, idx) => {
                          const s = STATUS_STYLES[ev.status] || STATUS_STYLES.finalizado;
                          return <span key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? s.dot : s.dot}`} />;
                        })}
                        {dayEvents.length > 3 && <span className="text-[8px] font-black text-[#8a8368] leading-none">+</span>}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[#C9A97E]/50 bg-gradient-to-r from-[#f5f0e4] to-[#faf6eb]">
            {calSelected ? (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-[#8a8368] mb-2">
                  {new Date(calSelected.year, calSelected.month, calSelected.day).toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-sm text-[#6f6a55]">Sin eventos para este día.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayEvents.map((e) => {
                      const t = TYPE_STYLES[e.type] || TYPE_STYLES.charla;
                      return (
                        <button
                          key={e.id}
                          onClick={() => openDetail(e.id)}
                          className="w-full flex items-center gap-3 rounded-xl bg-white border border-amber-100/60 px-4 py-2.5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                        >
                          <span className={`w-2 h-2 rounded-full ${t.dot} shrink-0`} />
                          <span className="text-xs font-black text-[#2B2118] w-16 shrink-0">{e.time}</span>
                          <span className="text-sm font-semibold text-[#2B2118] truncate group-hover:text-[#3A2618] transition-colors flex-1">
                            {e.title}
                          </span>
                          <StatusBadge status={e.status} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-[#8a8368]">Toca un día con indicadores para ver sus actividades.</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#6f6a55] px-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Próximo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> En curso
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400" /> Finalizado
          </span>
        </div>
      </section>

      {/* ================= DETAIL MODAL ================= */}
      <Modal
        isOpen={selectedEvent != null}
        onClose={() => setSelectedId(null)}
        title={selectedEvent?.title}
        icon={selectedEvent ? (TYPE_STYLES[selectedEvent.type] || TYPE_STYLES.charla).icon : CalendarDays}
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={selectedEvent.type} />
              <StatusBadge status={selectedEvent.status} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Fecha</p>
                <p className="text-sm font-bold text-[#2B2118] capitalize flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-600 shrink-0" />
                  <span className="capitalize">{formatLong(selectedEvent.date)}</span>
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Hora</p>
                <p className="text-sm font-bold text-[#2B2118] flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-600 shrink-0" /> {selectedEvent.time}
                </p>
              </div>
              <div className="col-span-2 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Lugar</p>
                <p className="text-sm font-bold text-[#2B2118] flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-600 shrink-0" /> {selectedEvent.location}
                </p>
              </div>
              <div className="col-span-2 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Ponente</p>
                <p className="text-sm font-bold text-[#2B2118] flex items-center gap-1.5">
                  <Mic size={13} className="text-amber-600 shrink-0" /> {selectedEvent.speaker}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center">
                  <CalendarDays size={13} className="text-white" />
                </div>
                <h4 className="font-serif text-sm text-[#2B2118]">Sobre este evento</h4>
              </div>
              <p className="text-sm text-[#4a4738] leading-relaxed">{selectedEvent.description}</p>
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Users size={13} className="text-white" />
                </div>
                <h4 className="font-serif text-sm text-[#2B2118]">Acerca de {selectedEvent.speaker.split(": ").pop()}</h4>
              </div>
              <p className="text-sm text-[#4a4738] leading-relaxed">{selectedEvent.speakerBio}</p>
            </div>

            {selectedEvent.capacity > 0 && (
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C49A55] to-amber-600 flex items-center justify-center">
                    <Ticket size={13} className="text-white" />
                  </div>
                  <h4 className="font-serif text-sm text-[#2B2118]">Cupos</h4>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-[#8a8368]">
                    {selectedEvent.registrados} de {selectedEvent.capacity} inscritos
                  </span>
                  <span className="text-emerald-700">{Math.round((selectedEvent.registrados / selectedEvent.capacity) * 100)}% lleno</span>
                </div>
                <div className="h-2.5 rounded-full bg-amber-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${capBar((selectedEvent.registrados / selectedEvent.capacity) * 100)} transition-all duration-700`}
                    style={{ width: `${Math.min((selectedEvent.registrados / selectedEvent.capacity) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              {selectedEvent.status === "finalizado" ? (
                <span className="text-xs font-bold text-stone-500 bg-stone-100 border border-stone-300/70 rounded-xl px-4 py-2.5 inline-flex items-center gap-2">
                  <CheckCheck size={14} /> Evento finalizado
                </span>
              ) : isEnrolled(selectedEvent.id) ? (
                <FormButton variant="danger" onClick={() => handleCancel(selectedEvent.id)}>
                  Cancelar inscripción
                </FormButton>
              ) : selectedEvent.registrados >= selectedEvent.capacity ? (
                <span className="text-xs font-bold text-rose-600 bg-rose-100 border border-rose-300/70 rounded-xl px-4 py-2.5 inline-flex items-center gap-2">
                  <Users size={14} /> Cupos llenos
                </span>
              ) : (
                <FormButton variant="primary" onClick={() => handleEnroll(selectedEvent.id)}>
                  <span className="inline-flex items-center gap-2">
                    <Ticket size={15} /> Inscribirme
                  </span>
                </FormButton>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}