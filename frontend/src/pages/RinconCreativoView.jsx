import { useState } from "react";
import {
  Palette,
  BookOpen,
  Star,
  PenTool,
  Upload,
  Heart,
  ShieldCheck,
  Check,
  Clock,
  AlertTriangle,
  Sparkles,
  FileText,
  Image,
  Pencil,
  Users,
} from "lucide-react";
import Modal from "../components/Modal";import PatternBg from "../components/PatternBg";
import FormField from "../components/FormField";
import FormButton from "../components/FormButton";
import { getInputClass } from "../utils/helpers";

const AGE_GROUPS = ["3-5", "6-8", "9-12", "Todos"];

const AVATARS = ["\u{1F981}", "\u{1F438}", "\u{1F430}", "\u{1F437}", "\u{1F436}", "\u{1F431}", "\u{1F980}", "\u{1F98A}", "\u{1F43B}", "\u{1F415}"];

const MOCK_BOOKS = [
  { id: "lb-001", title: "El Pequeño Girasol", age: "3-5", emoji: "\u{1F33B}", author: "María Ríos", recommended: true },
  { id: "lb-002", title: "Aventuras en la Selva", age: "6-8", emoji: "\u{1F410}", author: "Carlos Vega", recommended: true },
  { id: "lb-003", title: "Los Planetas Coloridos", age: "6-8", emoji: "\u{1F30C}", author: "Ana López", recommended: true },
  { id: "lb-004", title: "Dragones y Princesas", age: "3-5", emoji: "\u{1F409}", author: "Luis Moreno", recommended: false },
  { id: "lb-005", title: "Misterios del Océano", age: "9-12", emoji: "\u{1F41F}", author: "Sofía Pérez", recommended: true },
  { id: "lb-006", title: "El Bosque Encantado", age: "3-5", emoji: "\u{1F333}", author: "Diego Herrera", recommended: true },
  { id: "lb-007", title: "Ciencia para Peques", age: "9-12", emoji: "\u{1F52C}", author: "Lucía Castro", recommended: false },
  { id: "lb-008", title: "Cuentos de la Abuela", age: "6-8", emoji: "\u{1F4D6}", author: "Rosa Méndez", recommended: true },
];

const MOCK_STORIES = [
  { id: "cu-001", title: "La Estrella Perdida", age: "3-5", emoji: "\u2B50", text: "Había una vez una estrellita que se cayó del cielo. Un conejito la encontró en el bosque y decidió ayudarla a volver con sus amigas. Juntos subieron la montaña más alta y la estrellita pudo brillar de nuevo en el cielo nocturno." },
  { id: "cu-002", title: "El Gato Pintor", age: "6-8", emoji: "\u{1F408}", text: "Don Gato era el mejor pintor del pueblo. Cada mañana sacaba sus pinceles y pintaba las nubes de colores. Un día los niños del pueblo le pidieron que pintara un arcoíris gigante y Don Gato trabajó todo el día hasta lograr el arcoíris más hermoso que nadie hubiera visto." },
  { id: "cu-003", title: "El Viaje Lunar", age: "6-8", emoji: "\u{1F680}", text: "Valentina construyó una nave de cartón y papel brillante. Una noche de luna llena, la nave cobró vida y la llevó hasta la luna. Ahí conoció a Luna, un conejo que cuidaba las estrellas. Juntos contaron las estrellas y Valentina volvió a casa soñando con regresar." },
  { id: "cu-004", title: "El Robot Amigable", age: "9-12", emoji: "\u{1F916}", text: "Chip era un robot diferente: en lugar de cables tenía flores y en lugar de batería tenía un corazón de cristal. Los otros robots no lo entendían, hasta que un día Chip usó sus flores para salvar un jardín entero. Desde entonces todos los robots aprendieron que ser diferente es genial." },
  { id: "cu-005", title: "La Isla de los Sueños", age: "9-12", emoji: "\u{1F3DD}\uFE0F", text: "Mateo descubrió que si cerraba los ojos y pensaba muy fuerte, podía viajar a una isla mágica donde los sueños se hacían realidad. En cada visita conocía a alguien nuevo y aprendía algo importante sobre el poder de la imaginación." },
];

const MOCK_CHALLENGES = [
  { id: "rt-001", title: "Dibuja tu personaje favorito", description: "Crea un dibujo del personaje que más te guste de cualquier cuento o libro.", difficulty: "Fácil", deadline: "15 sep 2026", participants: 24, emoji: "\u{1F3A8}" },
  { id: "rt-002", title: "Escribe un cuento corto", description: "Inventa una historia con al menos 3 personajes y un final sorpresa.", difficulty: "Medio", deadline: "22 sep 2026", participants: 18, emoji: "\u{1F4DD}" },
  { id: "rt-003", title: "Crea un poema de la naturaleza", description: "Escribe un poema inspirado en la naturaleza: flores, animales, el mar o las estrellas.", difficulty: "Fácil", deadline: "18 sep 2026", participants: 31, emoji: "\u{1F33F}" },
  { id: "rt-004", title: "Diseña la portada de tu libro", description: "Si pudieras escribir un libro, ¿cómo sería su portada? ¡Diseñala!", difficulty: "Medio", deadline: "30 sep 2026", participants: 12, emoji: "\u{1F4D6}" },
];

const MOCK_GALLERY = [
  { id: "ga-001", title: "Mi Familia de Colores", type: "Dibujo", nickname: "PequeAstronauta", age: "6-8", emoji: "\u{1F469}\u200D\u{1F467}", hearts: 15 },
  { id: "ga-002", title: "El Dragón Azul", type: "Dibujo", nickname: "PequeGato99", age: "9-12", emoji: "\u{1F409}", hearts: 23 },
  { id: "ga-003", title: "Mi Perro MAX", type: "Dibujo", nickname: "EstrellitaFeliz", age: "3-5", emoji: "\u{1F436}", hearts: 32 },
  { id: "ga-004", title: "El Bosque de los Duendes", type: "Cuento", nickname: "PequeAstronauta", age: "6-8", emoji: "\u{1F333}", hearts: 18 },
  { id: "ga-005", title: "La Princesa Valiente", type: "Cuento", nickname: "PequeGato99", age: "9-12", emoji: "\u{1F478}", hearts: 27 },
  { id: "ga-006", title: "Un Día en el Zoológico", type: "Cuento", nickname: "EstrellitaFeliz", age: "3-5", emoji: "\u{1F435}", hearts: 19 },
];

const MOCK_MY_WORKS = [
  { id: "mo-001", title: "Mi Casa Soñada", type: "Dibujo", status: "Aprobado", date: "5 sep 2026" },
  { id: "mo-002", title: "El Ratón valiente", type: "Cuento", status: "En revisión", date: "7 sep 2026" },
];

const AGE_COLORS = {
  "3-5": { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300", dot: "bg-pink-500", grad: "from-pink-400 to-rose-500" },
  "6-8": { bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-300", dot: "bg-sky-500", grad: "from-sky-400 to-blue-500" },
  "9-12": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300", dot: "bg-emerald-500", grad: "from-emerald-400 to-green-500" },
};

const STATUS_STYLES = {
  "Aprobado": { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  "En revisión": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
  "Rechazado": { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
};

const DIFFICULTY_STYLES = {
  "Fácil": { bg: "bg-green-100", text: "text-green-700" },
  "Medio": { bg: "bg-amber-100", text: "text-amber-700" },
  "Difícil": { bg: "bg-red-100", text: "text-red-700" },
};

function AgeBadge({ age, _small }) {
  const c = AGE_COLORS[age] || AGE_COLORS["6-8"];
  return (
    <span className={`${c.bg} ${c.text} border ${c.border} text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full`}>
      {age}
    </span>
  );
}

function StatusBadge({ status }) {
  const c = STATUS_STYLES[status] || STATUS_STYLES["En revisión"];
  return (
    <span className={`${c.bg} ${c.text} border ${c.border} text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full`}>
      {status}
    </span>
  );
}

function DifficultyBadge({ level }) {
  const c = DIFFICULTY_STYLES[level] || DIFFICULTY_STYLES["Medio"];
  return (
    <span className={`${c.bg} ${c.text} text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full`}>
      {level}
    </span>
  );
}

export default function RinconCreativoView({ user: _user, addToast }) {
  const [activeTab, setActiveTab] = useState("libros");
  const [ageFilter, setAgeFilter] = useState("Todos");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(null);
  const [likedGallery, setLikedGallery] = useState({});

  const [workTitle, setWorkTitle] = useState("");
  const [workType, setWorkType] = useState("Dibujo");
  const [workDescription, setWorkDescription] = useState("");
  const [workAge, setWorkAge] = useState("");
  const [workNickname, setWorkNickname] = useState("");
  const [workAvatar, setWorkAvatar] = useState(AVATARS[0]);
  const [workErrors, setWorkErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [myWorks, setMyWorks] = useState(MOCK_MY_WORKS);
  const [challenges, setChallenges] = useState(MOCK_CHALLENGES);

  const tabs = [
    { key: "libros", label: "Libros", icon: BookOpen },
    { key: "cuentos", label: "Cuentos Recomendados", icon: FileText },
    { key: "retos", label: "Retos Creativos", icon: Sparkles },
    { key: "galeria", label: "Galería", icon: Image },
    { key: "misObras", label: "Mis Obras", icon: Palette },
  ];

  const filteredBooks = MOCK_BOOKS.filter((b) => ageFilter === "Todos" || b.age === ageFilter);
  const filteredStories = MOCK_STORIES.filter((s) => ageFilter === "Todos" || s.age === ageFilter);
  const filteredGallery = MOCK_GALLERY.filter((g) => ageFilter === "Todos" || g.age === ageFilter);

  const resetForm = () => {
    setWorkTitle("");
    setWorkType("Dibujo");
    setWorkDescription("");
    setWorkAge("");
    setWorkNickname("");
    setWorkAvatar(AVATARS[0]);
    setWorkErrors({});
    setSubmitSuccess(false);
  };

  const handleSubmitWork = () => {
    const e = {};
    if (!workTitle.trim()) e.workTitle = "El título es obligatorio";
    if (!workDescription.trim()) e.workDescription = "Escribe una descripción";
    if (!workAge.trim()) e.workAge = "Indica tu edad";
    if (!workNickname.trim()) e.workNickname = "Elige un apodo";
    setWorkErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitSuccess(true);
    addToast({ type: "success", message: "Tu obra ha sido enviada para revisión" });
  };

  const handleSubmitFinal = () => {
    const newWork = {
      id: `mo-${Date.now()}`,
      title: workTitle.trim(),
      type: workType,
      status: "En revisión",
      date: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
    };
    setMyWorks((prev) => [newWork, ...prev]);
    setShowSubmitModal(false);
    resetForm();
  };

  const toggleLike = (id) => setLikedGallery((p) => ({ ...p, [id]: !p[id] }));

  const handleParticipate = (id) => {
    setChallenges((prev) => prev.map((ch) => ch.id === id ? { ...ch, participants: ch.participants + 1 } : ch));
    addToast({ type: "success", message: "¡Te has inscrito en el reto!" });
  };

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />

      {/* ================= WELCOME BANNER ================= */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-400 via-purple-400 to-sky-400 p-8 shadow-xl shadow-purple-300/30">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
<div className="absolute top-4 right-8 text-5xl animate-bounce" style={{ animationDelay: "0s" }}>{"\u{1F365}"}</div>
<div className="absolute top-8 right-28 text-3xl animate-bounce" style={{ animationDelay: "0.3s" }}>{"\u2B50"}</div>
<div className="absolute bottom-4 left-8 text-4xl animate-bounce" style={{ animationDelay: "0.6s" }}>{"\u{1F3A8}"}</div>
<div className="absolute bottom-6 right-40 text-3xl animate-bounce" style={{ animationDelay: "0.9s" }}>{"\u{1F3C6}"}</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Palette size={28} className="text-white" />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight">Rincón Creativo Infantil</h1>
              <p className="text-white/80 text-sm mt-0.5">Un espacio mágico donde la imaginación de los pequeños cobra vida</p>
            </div>
          </div>
          <p className="text-white/90 text-sm max-w-2xl leading-relaxed mt-2">
            Aquí los niños pueden descubrir libros maravillosos, escribir sus propias historias, dibujar y participar en retos creativos. ¡Todo de forma segura y supervisada!
          </p>
          <div className="flex gap-4 mt-5 flex-wrap">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
              <p className="text-2xl font-bold text-white">342</p>
              <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">niños registrados</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
              <p className="text-2xl font-bold text-white">89</p>
              <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">obras creadas</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">cuentos este mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODERATION NOTICE ================= */}
      <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 shadow-sm">
        <ShieldCheck size={20} className="text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Espacio seguro para niños.</span> Todas las publicaciones pasan por moderación antes de ser visibles. Protegemos la privacidad de los menores usando apodos en lugar de nombres reales.
        </p>
      </div>

      {/* ================= AGE FILTER BAR ================= */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
        <span className="text-xs uppercase tracking-widest text-[#6f6a55] font-bold mr-1">Edad:</span>
        {AGE_GROUPS.map((age) => {
          const active = ageFilter === age;
          return (
            <button
              key={age}
              onClick={() => setAgeFilter(age)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-300/30 scale-105"
                  : "bg-white border border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
              }`}
            >
              {age === "Todos" ? "\u{1F30D} Todos" : `${age} años`}
            </button>
          );
        })}
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex gap-2 flex-wrap border-b border-purple-200/60 pb-px mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === key
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-[#6f6a55] hover:bg-purple-50"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* ================= LIBROS TAB ================= */}
      {activeTab === "libros" && (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-sm">
              <BookOpen size={15} className="text-white" />
            </div>
            <h3 className="font-serif text-base text-[#2B2118]">Libros para niños</h3>
            <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full border border-pink-200">{filteredBooks.length}</span>
          </div>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <BookOpen size={28} className="text-pink-400/60" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">No hay libros para esta edad</p>
              <p className="text-[#8a8368] text-sm mt-1">Prueba seleccionando otra categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="group relative bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400" />
                  {book.recommended && (
                    <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={10} fill="currentColor" /> Recomendado
                    </div>
                  )}
                  <div className="p-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-200 shadow-inner">
                      {book.emoji}
                    </div>
                    <h4 className="font-serif text-sm text-[#2B2118] text-center leading-snug mb-2 min-h-[36px]">{book.title}</h4>
                    <p className="text-[11px] text-[#8a8368] text-center mb-2">{book.author}</p>
                    <div className="flex justify-center">
                      <AgeBadge age={book.age} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= CUENTOS RECOMENDADOS TAB ================= */}
      {activeTab === "cuentos" && (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-sm">
              <FileText size={15} className="text-white" />
            </div>
            <h3 className="font-serif text-base text-[#2B2118]">Cuentos Recomendados</h3>
            <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200">{filteredStories.length}</span>
          </div>
          {filteredStories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <FileText size={28} className="text-sky-400/60" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">No hay cuentos para esta edad</p>
              <p className="text-[#8a8368] text-sm mt-1">Prueba seleccionando otra categoría</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStories.map((story, i) => (
                <div
                  key={story.id}
                  className="relative flex flex-col sm:flex-row gap-5 bg-white rounded-2xl border border-sky-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500" />
                  <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform duration-200">
                    {story.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-serif text-base text-[#2B2118] leading-snug">{story.title}</h4>
                      <AgeBadge age={story.age} />
                    </div>
                    <p className="text-xs text-[#8a8368] line-clamp-2 leading-relaxed mt-1">{story.text}</p>
                    <button
                      onClick={() => setShowStoryModal(story)}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white text-xs font-bold hover:from-sky-400 hover:to-blue-400 active:scale-[0.97] transition-all duration-200 shadow-md shadow-sky-300/30 cursor-pointer"
                    >
                      <BookOpen size={13} /> Leer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= RETOS CREATIVOS TAB ================= */}
      {activeTab === "retos" && (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Sparkles size={15} className="text-white" />
            </div>
            <h3 className="font-serif text-base text-[#2B2118]">Retos Creativos</h3>
            <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full border border-violet-200">{challenges.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {challenges.map((ch, i) => (
              <div
                key={ch.id}
                className="relative bg-white rounded-2xl border border-violet-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {ch.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-[#2B2118] leading-snug mb-1">{ch.title}</h4>
                      <p className="text-xs text-[#8a8368] line-clamp-2 leading-relaxed">{ch.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <DifficultyBadge level={ch.difficulty} />
                    <div className="flex items-center gap-1 text-[11px] text-[#8a8368]">
                      <Clock size={12} className="text-violet-500" />
                      <span>{ch.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#8a8368]">
                      <Users size={12} className="text-violet-500" />
                      <span>{ch.participants} niños</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleParticipate(ch.id)}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold hover:from-violet-400 hover:to-purple-400 active:scale-[0.97] transition-all duration-200 shadow-md shadow-purple-300/30 cursor-pointer"
                  >
                    <Sparkles size={13} /> Participar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= GALERÍA TAB ================= */}
      {activeTab === "galeria" && (
        <div className="animate-fadeIn">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
              <Image size={15} className="text-white" />
            </div>
            <h3 className="font-serif text-base text-[#2B2118]">Galería de Obras Aprobadas</h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">{filteredGallery.length}</span>
          </div>
          <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-5 py-3 shadow-sm">
            <ShieldCheck size={18} className="text-green-600 shrink-0" />
            <p className="text-xs text-green-800">
              <span className="font-bold">Todas las publicaciones pasan por moderación</span> antes de ser visibles en la galería. Solo las obras aprobadas por un empleado se muestran aquí.
            </p>
          </div>
          {filteredGallery.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Image size={28} className="text-amber-400/60" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">No hay obras para esta edad</p>
              <p className="text-[#8a8368] text-sm mt-1">¡Sé el primero en crear algo!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGallery.map((work, i) => (
                <div
                  key={work.id}
                  className="relative bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400" />
                  <div className="p-5">
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform duration-200 shadow-inner border border-amber-100">
                      {work.emoji}
                    </div>
                    <h4 className="font-serif text-sm text-[#2B2118] leading-snug mb-1">{work.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] text-[#8a8368]">Por</span>
                      <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">{work.nickname}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">{work.type}</span>
                      <AgeBadge age={work.age} />
                    </div>
                    <button
                      onClick={() => toggleLike(work.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        likedGallery[work.id]
                          ? "bg-pink-100 text-pink-600 border border-pink-300"
                          : "bg-gray-50 text-[#8a8368] border border-gray-200 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200"
                      }`}
                    >
                      <Heart size={13} fill={likedGallery[work.id] ? "currentColor" : "none"} />
                      {work.hearts + (likedGallery[work.id] ? 1 : 0)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MIS OBRAS TAB ================= */}
      {activeTab === "misObras" && (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm">
                <Palette size={15} className="text-white" />
              </div>
              <h3 className="font-serif text-base text-[#2B2118]">Mis Obras</h3>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">{myWorks.length}</span>
            </div>
            <button
              onClick={() => { resetForm(); setShowSubmitModal(true); }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-4 py-2.5 rounded-xl hover:from-purple-400 hover:to-pink-400 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-purple-300/30 cursor-pointer font-semibold"
            >
              <Upload size={14} /> Nueva obra
            </button>
          </div>
          <div className="mb-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 shadow-sm">
            <AlertTriangle size={16} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              Tus obras serán revisadas por un empleado antes de ser publicadas. Esto puede tomar hasta 48 horas.
            </p>
          </div>
          {myWorks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Palette size={28} className="text-rose-400/60" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">Aún no tienes obras</p>
              <p className="text-[#8a8368] text-sm mt-1">¡Empieza a crear tu primera obra!</p>
              <button
                onClick={() => { resetForm(); setShowSubmitModal(true); }}
                className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-5 py-2.5 rounded-xl hover:from-purple-400 hover:to-pink-400 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-purple-300/30 cursor-pointer font-semibold"
              >
                <Upload size={15} /> Nueva obra
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myWorks.map((work) => (
                <div key={work.id} className="flex items-center gap-4 bg-white rounded-2xl border border-rose-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xl shrink-0 shadow-inner">
                    {work.type === "Dibujo" ? "\u{1F58C}\uFE0F" : work.type === "Cuento" ? "\u{1F4D6}" : "\u{1F33F}"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-[#2B2118] truncate">{work.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-[#8a8368]">{work.type}</span>
                      <span className="text-[11px] text-[#a89f81]">·</span>
                      <span className="text-[11px] text-[#8a8368]">{work.date}</span>
                    </div>
                  </div>
                  <StatusBadge status={work.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= STORY READER MODAL ================= */}
      <Modal
        isOpen={!!showStoryModal}
        onClose={() => setShowStoryModal(null)}
        title={showStoryModal?.title || ""}
        icon={BookOpen}
      >
        {showStoryModal && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-3xl shadow-inner">
                {showStoryModal.emoji}
              </div>
              <div>
                <AgeBadge age={showStoryModal.age} />
                <p className="text-xs text-[#8a8368] mt-1">Cuento recomendado</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-100">
              <p className="text-sm text-[#2B2118] leading-relaxed font-serif whitespace-pre-line">{showStoryModal.text}</p>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-[#8a8368] italic">{"\u{1F4D6}"} ¡Esperamos que te haya gustado este cuento!</p>
            </div>
          </div>
        )}
      </Modal>

      {/* ================= SUBMIT WORK MODAL ================= */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => { setShowSubmitModal(false); resetForm(); }}
        title="Enviar Nueva Obra"
        icon={Upload}
      >
        {submitSuccess ? (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Check size={36} className="text-green-600" />
            </div>
            <h4 className="font-serif text-lg text-[#2B2118] mb-2">¡Obra enviada!</h4>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-amber-800 leading-relaxed">
                Tu obra ha sido enviada y será revisada por un empleado antes de ser publicada. Esto puede tomar hasta 48 horas.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-green-800 leading-relaxed">
                <ShieldCheck size={14} className="inline mr-1" />
                Protegemos la seguridad de los menores. Solo se publican obras aprobadas y usando apodos, nunca nombres reales.
              </p>
            </div>
            <FormButton variant="primary" onClick={handleSubmitFinal}>Entendido</FormButton>
          </div>
        ) : (
          <div>
            <FormField label="Título de la obra" icon={PenTool} error={workErrors.workTitle} required>
              <input
                type="text"
                placeholder="Ej: Mi Aventura en el Bosque"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                maxLength={80}
                className={getInputClass(workErrors.workTitle)}
              />
            </FormField>
            <FormField label="Tipo de obra" icon={FileText} required>
              <div className="flex gap-2">
                {["Dibujo", "Cuento", "Poema"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setWorkType(t)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                      workType === t
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-md"
                        : "bg-white text-purple-600 border-purple-200 hover:bg-purple-50"
                    }`}
                  >
                    {t === "Dibujo" ? <Pencil size={13} /> : t === "Cuento" ? <FileText size={13} /> : <PenTool size={13} />}
                    {t}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Descripción" icon={BookOpen} error={workErrors.workDescription} required>
              <textarea
                placeholder="Cuéntanos sobre tu obra..."
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                rows={3}
                maxLength={300}
                className={`${getInputClass(workErrors.workDescription)} resize-none`}
              />
            </FormField>
            <FormField label="Tu edad" icon={Users} error={workErrors.workAge} required>
              <input
                type="number"
                min={3}
                max={12}
                placeholder="Ej: 8"
                value={workAge}
                onChange={(e) => setWorkAge(e.target.value)}
                className={getInputClass(workErrors.workAge)}
              />
            </FormField>
            <FormField label="Tu apodo (no uses tu nombre real)" icon={Star} error={workErrors.workNickname} required>
              <input
                type="text"
                placeholder="Ej: PequeGato99"
                value={workNickname}
                onChange={(e) => setWorkNickname(e.target.value)}
                maxLength={30}
                className={getInputClass(workErrors.workNickname)}
              />
              <p className="text-[11px] text-[#8a8368] mt-1 flex items-center gap-1">
                <ShieldCheck size={11} className="text-green-600" />
                Por tu seguridad, usa un apodo en lugar de tu nombre real
              </p>
            </FormField>
            <FormField label="Elige tu avatar" icon={Star} required>
              <div className="flex gap-2 flex-wrap">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setWorkAvatar(av)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-200 cursor-pointer border-2 ${
                      workAvatar === av
                        ? "bg-purple-100 border-purple-500 ring-2 ring-purple-300 scale-110 shadow-md"
                        : "bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </FormField>
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-[11px] text-purple-800 leading-relaxed flex items-start gap-2">
                <Upload size={13} className="text-purple-600 shrink-0 mt-0.5" />
                <span>Arrastra tu archivo aquí o haz clic para seleccionar. Se aceptan imágenes (PNG, JPG) y documentos (PDF, TXT). Tamaño máximo: 5MB.</span>
              </p>
              <div className="mt-2 border-2 border-dashed border-purple-300 rounded-xl py-4 text-center bg-white/60 hover:bg-purple-50 transition-colors cursor-pointer">
                <Upload size={20} className="mx-auto text-purple-400 mb-1" />
                <p className="text-[11px] text-purple-500 font-semibold">Haz clic para subir tu obra</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
                <ShieldCheck size={13} className="text-amber-600 shrink-0 mt-0.5" />
                <span><span className="font-bold">Aviso importante:</span> Todas las obras son revisadas por un empleado antes de ser publicadas. Nos comprometemos a mantener un espacio seguro para los niños.</span>
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <FormButton variant="secondary" onClick={() => { setShowSubmitModal(false); resetForm(); }}>Cancelar</FormButton>
              <FormButton variant="primary" onClick={handleSubmitWork}>Enviar obra</FormButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
