import { useState, useMemo } from "react";
import {
  Award,
  Trophy,
  Lock,
  Check,
  Zap,
  Gift,
  BookOpen,
  Users,
  Palette,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import PatternBg from "../components/PatternBg";

const RARITY = {
  comun: {
    label: "Común",
    border: "border-gray-300",
    bg: "bg-gray-50",
    badge: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    earnedBorder: "border-gray-300",
    earnedBg: "bg-gradient-to-br from-gray-50 to-slate-100",
  },
  raro: {
    label: "Raro",
    border: "border-blue-300",
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    earnedBorder: "border-blue-400",
    earnedBg: "bg-gradient-to-br from-blue-50 to-indigo-100",
  },
  epico: {
    label: "\u{1F525}",
    border: "border-purple-300",
    bg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
    earnedBorder: "border-purple-400",
    earnedBg: "bg-gradient-to-br from-purple-50 to-violet-100",
  },
  legendario: {
    label: "Legendario",
    border: "border-amber-400",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    earnedBorder: "border-amber-400",
    earnedBg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100",
    glow: "shadow-[0_0_20px_rgba(201,162,76,0.35)]",
  },
};

const CATEGORIES = [
  { key: "all", label: "Todas", icon: Trophy },
  { key: "prestamo", label: "Préstamo", icon: BookOpen },
  { key: "lectura", label: "Lectura", icon: BookOpen },
  { key: "social", label: "Social", icon: Users },
  { key: "creativa", label: "Creativa", icon: Palette },
  { key: "evento", label: "Evento", icon: CalendarDays },
];

function buildMockBadges() {
  return [
    {
      id: "b1",
      name: "Primer Préstamo",
      description: "Realiza tu primer préstamo de un libro en la biblioteca",
emoji: "\u{1F4D6}",
      rarity: "comun",
      category: "prestamo",
      earned: true,
      earnedDate: "15 jun 2026",
    },
    {
      id: "b2",
      name: "Lector Ávido",
      description: "Lee un total de 10 libros completados",
emoji: "\u{1F4DA}",
      rarity: "raro",
      category: "lectura",
      earned: true,
      earnedDate: "2 ago 2026",
    },
    {
      id: "b3",
      name: "Creador de Clubes",
      description: "Crea tu propio club de lectura y convoca a otros lectores",
emoji: "\u{1F465}",
      rarity: "raro",
      category: "social",
      earned: true,
      earnedDate: "20 jul 2026",
    },
    {
      id: "b4",
      name: "Participante Activo",
      description: "Participa en al menos 5 discusiones de tu club",
emoji: "\u{1F4AC}",
      rarity: "comun",
      category: "social",
      earned: true,
      earnedDate: "10 ago 2026",
    },
    {
      id: "b5",
      name: "Maratón Lector",
      description: "Lee 5 libros en un solo mes",
emoji: "\u{1F3C3}",
      rarity: "legendario",
      category: "lectura",
      earned: true,
      earnedDate: "30 ago 2026",
    },
    {
      id: "b6",
      name: "Coleccionista",
      description: "Préstamo 50 libros en total",
emoji: "\u{1F4E6}",
      rarity: "epico",
      category: "prestamo",
      earned: false,
      progress: 32,
      total: 50,
    },
    {
      id: "b7",
      name: "Poeta del Alma",
      description: "Escribe tu primer poema o reseña literaria en la plataforma",
emoji: "\u{1F396}\u{FE0F}",
      rarity: "comun",
      category: "creativa",
      earned: false,
      progress: 0,
      total: 1,
    },
    {
      id: "b8",
      name: "Viajero Literario",
      description: "Lee libros de al menos 5 países diferentes",
emoji: "\u{1F30D}",
      rarity: "raro",
      category: "lectura",
      earned: false,
      progress: 2,
      total: 5,
    },
    {
      id: "b9",
      name: "Convocatoria Perfecta",
      description: "Asiste a 10 reuniones de club consecutivas",
emoji: "\u{1F389}",
      rarity: "epico",
      category: "evento",
      earned: false,
      progress: 4,
      total: 10,
    },
    {
      id: "b10",
      name: "Estrella del Foro",
      description: "Recibe 25 \"me gusta\" en tus publicaciones y comentarios",
emoji: "\u2B50",
      rarity: "raro",
      category: "social",
      earned: false,
      progress: 11,
      total: 25,
    },
    {
      id: "b11",
      name: "Inspirador",
      description: "Escribe 3 reseñas de libros con más de 200 palabras",
emoji: "\u{1F4A1}",
      rarity: "epico",
      category: "creativa",
      earned: false,
      progress: 1,
      total: 3,
    },
    {
      id: "b12",
      name: "Rey de la Velada",
      description: "Asiste a un evento especial o lectura nocturna",
emoji: "\u{1F451}",
      rarity: "comun",
      category: "evento",
      earned: false,
      progress: 0,
      total: 1,
    },
    {
      id: "b13",
      name: "Préstamo de Honor",
      description: "Préstamo 100 libros en total",
emoji: "\u{1F3C6}",
      rarity: "legendario",
      category: "prestamo",
      earned: false,
      progress: 32,
      total: 100,
    },
    {
      id: "b14",
      name: "Recolector de Firmas",
      description: "Consigue que 20 personas se unan a tu club de lectura",
emoji: "\u{1F4DD}",
      rarity: "legendario",
      category: "social",
      earned: false,
      progress: 7,
      total: 20,
    },
    {
      id: "b15",
      name: "Cronista de Eventos",
      description: "Participa en 15 eventos de la biblioteca",
emoji: "\u{1F4C5}",
      rarity: "comun",
      category: "evento",
      earned: false,
      progress: 3,
      total: 15,
    },
  ];
}

export default function InsigniasView({ user: _user }) {
  const [badges] = useState(buildMockBadges);
  const [activeTab, setActiveTab] = useState("all");

  const earnedCount = useMemo(() => badges.filter((b) => b.earned).length, [badges]);
  const totalBadges = badges.length;

  const rarityCounts = useMemo(() => {
    const counts = { comun: 0, raro: 0, epico: 0, legendario: 0 };
    badges
      .filter((b) => b.earned)
      .forEach((b) => {
        counts[b.rarity]++;
      });
    return counts;
  }, [badges]);

  const filteredBadges = useMemo(() => {
    if (activeTab === "all") return badges;
    return badges.filter((b) => b.category === activeTab);
  }, [badges, activeTab]);

  const earnedFiltered = useMemo(
    () => filteredBadges.filter((b) => b.earned),
    [filteredBadges]
  );
  const lockedFiltered = useMemo(
    () => filteredBadges.filter((b) => !b.earned),
    [filteredBadges]
  );

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />

      <SectionHeader
        eyebrow="Gamificación"
        title="Insignias y Logros"
        subtitle={`${earnedCount} de ${totalBadges} insignias desbloqueadas`}
        icon={Award}
      />

      {/* ================= PROGRESS OVERVIEW ================= */}
      <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm mb-8 animate-fadeIn">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg text-[#2B2118]">Progreso general</h3>
              <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {earnedCount}/{totalBadges}
              </span>
            </div>
            <div className="h-4 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 transition-all duration-1000 ease-out relative"
                style={{ width: `${(earnedCount / totalBadges) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <p className="text-xs text-[#8a8368] mt-1.5">
              Te faltan {totalBadges - earnedCount} insignias para completar tu colección
            </p>
          </div>

          {/* XP Counter */}
          <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/60 rounded-2xl px-5 py-4 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-amber-700 leading-none">2,450</p>
              <p className="text-[10px] uppercase tracking-widest text-amber-600 font-bold mt-0.5">puntos XP</p>
            </div>
          </div>
        </div>

        {/* Rarity stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { key: "comun", label: "Común", color: "gray", count: rarityCounts.comun, total: badges.filter((b) => b.rarity === "comun").length },
            { key: "raro", label: "Raro", color: "blue", count: rarityCounts.raro, total: badges.filter((b) => b.rarity === "raro").length },
  { key: "epico", label: "\u{1F525}", color: "purple", count: rarityCounts.epico, total: badges.filter((b) => b.rarity === "epico").length },
            { key: "legendario", label: "Legendario", color: "amber", count: rarityCounts.legendario, total: badges.filter((b) => b.rarity === "legendario").length },
          ].map((stat) => (
            <div
              key={stat.key}
              className={`rounded-xl border p-3 text-center ${
                stat.color === "gray"
                  ? "border-gray-200 bg-gray-50"
                  : stat.color === "blue"
                  ? "border-blue-200 bg-blue-50"
                  : stat.color === "purple"
                  ? "border-purple-200 bg-purple-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              <p className={`text-xl font-black ${
                stat.color === "gray"
                  ? "text-gray-600"
                  : stat.color === "blue"
                  ? "text-blue-600"
                  : stat.color === "purple"
                  ? "text-purple-600"
                  : "text-amber-600"
              }`}>
                {stat.count}/{stat.total}
              </p>
              <p className={`text-[10px] uppercase tracking-widest font-bold ${
                stat.color === "gray"
                  ? "text-gray-500"
                  : stat.color === "blue"
                  ? "text-blue-500"
                  : stat.color === "purple"
                  ? "text-purple-500"
                  : "text-amber-500"
              }`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CATEGORY TABS ================= */}
      <div className="flex gap-2 flex-wrap border-b border-[#C9A97E]/60 pb-px mb-6 animate-fadeIn">
        {CATEGORIES.map(({ key, label, icon: Icon }) => {
          const count = key === "all" ? badges.length : badges.filter((b) => b.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === key
                  ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white shadow-md"
                  : "text-[#6f6a55] hover:bg-amber-50"
              }`}
            >
              <Icon size={15} />
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === key ? "bg-white/20" : "bg-amber-100 text-amber-700"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= BADGE GRID ================= */}
      {filteredBadges.length === 0 ? (
        <div className="text-center py-20 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Trophy size={36} className="text-amber-400/50" />
          </div>
          <p className="text-[#2B2118] text-lg font-serif">No hay insignias en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Earned badges */}
          {earnedFiltered.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Check size={16} className="text-emerald-600" />
                <h3 className="font-serif text-base text-[#2B2118]">Desbloqueadas</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  {earnedFiltered.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedFiltered.map((badge, i) => {
                  const rarity = RARITY[badge.rarity];
                  return (
                    <div
                      key={badge.id}
                      className={`relative rounded-2xl border-2 p-5 shadow-sm hover:shadow-lg transition-all duration-300 animate-fadeIn ${rarity.earnedBorder} ${rarity.earnedBg} ${rarity.glow || ""}`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                          <Check size={14} className="text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <div className="text-center mb-3">
                        <span className="text-5xl block mb-2 drop-shadow-md animate-[bounce_3s_ease-in-out_infinite]">{badge.emoji}</span>
                        <h4 className="font-serif text-base text-[#2B2118] leading-tight">{badge.name}</h4>
                      </div>
                      <p className="text-xs text-[#6f6a55] text-center leading-relaxed mb-3 min-h-[32px]">
                        {badge.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${rarity.badge}`}>
                          {rarity.label}
                        </span>
                        <span className="text-[10px] text-[#8a8368] font-semibold">
                          {badge.earnedDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Locked badges */}
          {lockedFiltered.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} className="text-[#8a8368]" />
                <h3 className="font-serif text-base text-[#2B2118]">Por desbloquear</h3>
                <span className="text-xs font-bold text-[#8a8368] bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  {lockedFiltered.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedFiltered.map((badge, i) => {
                  const rarity = RARITY[badge.rarity];
                  const progressPct = badge.total > 0 ? Math.round((badge.progress / badge.total) * 100) : 0;
                  return (
                    <div
                      key={badge.id}
                      className={`relative rounded-2xl border p-5 opacity-50 grayscale hover:opacity-70 hover:grayscale-[0.5] transition-all duration-300 bg-white border-[#C9A97E]/60 animate-fadeIn`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="absolute top-3 right-3">
                        <Lock size={14} className="text-[#8a8368]" />
                      </div>
                      <div className="text-center mb-3">
                        <span className="text-5xl block mb-2">{badge.emoji}</span>
                        <h4 className="font-serif text-base text-[#2B2118] leading-tight">{badge.name}</h4>
                      </div>
                      <p className="text-xs text-[#6f6a55] text-center leading-relaxed mb-3 min-h-[32px]">
                        {badge.description}
                      </p>
                      {badge.total > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[10px] text-[#8a8368] font-bold mb-1">
                            <span>Progreso</span>
                            <span>{badge.progress}/{badge.total}</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-700"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${rarity.badge}`}>
                          {rarity.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= HOW TO EARN ================= */}
      <div className="mt-10 bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
            <Gift size={15} className="text-white" />
          </div>
          <h3 className="font-serif text-lg text-[#2B2118]">Cómo ganar insignias</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { emoji: "\u{1F4D6}", action: "Realiza tu primer préstamo", badge: "Primer Préstamo", category: "Préstamo" },
            { emoji: "\u{1F4DA}", action: "Lee 10 libros completados", badge: "Lector Ávido", category: "Lectura" },
            { emoji: "\u{1F465}", action: "Crea un club de lectura", badge: "Creador de Clubes", category: "Social" },
            { emoji: "\u{1F4AC}", action: "Participa en 5 discusiones", badge: "Participante Activo", category: "Social" },
            { emoji: "\u{1F3C3}", action: "Lee 5 libros en un mes", badge: "Maratón Lector", category: "Lectura" },
            { emoji: "\u{1F396}\u{FE0F}", action: "Escribe tu primer poema o reseña", badge: "Poeta del Alma", category: "Creativa" },
            { emoji: "\u{1F30D}", action: "Lee libros de 5 países distintos", badge: "Viajero Literario", category: "Lectura" },
            { emoji: "\u{1F389}", action: "Asiste a 10 reuniones seguidas", badge: "Convocatoria Perfecta", category: "Evento" },
            { emoji: "\u2B50", action: "Recibe 25 likes en tus publicaciones", badge: "Estrella del Foro", category: "Social" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-[#f5f0e4] to-[#faf6eb] border border-[#C9A97E]/40 p-4 transition-all duration-200 hover:shadow-sm"
            >
              <span className="text-2xl shrink-0">{item.emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#2B2118] leading-tight">{item.action}</p>
                <p className="text-xs text-[#8a8368] mt-1 flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-emerald-600 shrink-0" />
                  <span>Insignia: <span className="font-bold text-emerald-700">{item.badge}</span></span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
