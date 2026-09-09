import { useMemo, useState } from "react";
import {
  BookOpen,
  Users,
  Plus,
  Search,
  ChevronLeft,
  MessageCircle,
  Send,
  Calendar,
  UserPlus,
  Check,
  MapPin,
  Clock,
  Sparkles,
  MessagesSquare,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import Modal from "../components/Modal";
import PatternBg from "../components/PatternBg";
import FormField from "../components/FormField";
import FormButton from "../components/FormButton";
import { getInputClass, selectClass } from "../utils/helpers";

const GENRES = ["Novela", "Ciencia ficción", "Fantasía", "Poesía", "Historia", "Ensayo", "Misterio", "Romance"];

const CLUB_COLORS = [
  { name: "Esmeralda", dot: "#3A2618", solid: "#3A2618", border: "border-[#3A2618]", soft: "bg-[#3A2618]/10", text: "text-[#3A2618]", grad: "from-emerald-700 to-green-800" },
  { name: "Dorado", dot: "#C49A55", solid: "#C49A55", border: "border-[#C49A55]", soft: "bg-[#C49A55]/10", text: "text-[#C49A55]", grad: "from-amber-500 to-yellow-600" },
  { name: "Cobre", dot: "#b87333", solid: "#b87333", border: "border-[#b87333]", soft: "bg-[#b87333]/10", text: "text-[#b87333]", grad: "from-orange-600 to-red-700" },
  { name: "Borgoña", dot: "#722f37", solid: "#722f37", border: "border-[#722f37]", soft: "bg-[#722f37]/10", text: "text-[#722f37]", grad: "from-rose-700 to-red-800" },
  { name: "Azul añil", dot: "#2e4057", solid: "#2e4057", border: "border-[#2e4057]", soft: "bg-[#2e4057]/10", text: "text-[#2e4057]", grad: "from-blue-700 to-indigo-800" },
  { name: "Verde oliva", dot: "#708238", solid: "#708238", border: "border-[#708238]", soft: "bg-[#708238]/10", text: "text-[#708238]", grad: "from-green-700 to-lime-700" },
];

function buildMockClubs() {
  return [
    {
      id: "club-1",
      name: "Clásicos Vivos",
      description: "Un espacio para redescubrir las grandes obras de la literatura universal y conversar sobre su vigencia hoy.",
      genre: "Novela",
      color: "Esmeralda",
      currentBook: "Cien años de soledad",
      bookAuthor: "Gabriel García Márquez",
      progress: 62,
      members: ["Ana Torres", "Luis Ramírez", "María López"],
      nextMeeting: { date: "12 sep 2026", time: "18:00", topic: "Capítulos 10-14", location: "Sala B · Biblioteca Central" },
      meetings: [
        { id: "m1", date: "12 sep 2026", time: "18:00", topic: "Capítulos 10-14", location: "Sala B · Biblioteca Central" },
        { id: "m2", date: "26 sep 2026", time: "18:00", topic: "Cierre y debate final", location: "Sala B · Biblioteca Central" },
      ],
      discussions: [
        {
          id: "d1",
          title: "El realismo mágico en la obra",
          author: "María López",
          date: "3 sep 2026",
          messages: [
            { id: "dm1", author: "María López", date: "3 sep 2026", text: "Me parece fascinante cómo el realismo mágico integra lo fantástico a la vida cotidiana de Macondo." },
            { id: "dm2", author: "Luis Ramírez", date: "4 sep 2026", text: "Coincido, y creo que es la clave para entender a toda la familia Buendía." },
            { id: "dm3", author: "Ana Torres", date: "5 sep 2026", text: "El hielo en la primera página siempre me impresionó. Es un símbolo enorme." },
          ],
        },
        {
          id: "d2",
          title: "Melquíades y el destino",
          author: "Luis Ramírez",
          date: "1 sep 2026",
          messages: [
            { id: "dm4", author: "Luis Ramírez", date: "1 sep 2026", text: "¿El destino de los Buendía estaba escrito por Melquíades desde el inicio?" },
            { id: "dm5", author: "María López", date: "2 sep 2026", text: "Creo que sí, los pergaminos ya lo predecían todo con siglos de anticipación." },
          ],
        },
        {
          id: "d3",
          title: "Personaje favorito",
          author: "Ana Torres",
          date: "29 ago 2026",
          messages: [
            { id: "dm6", author: "Ana Torres", date: "29 ago 2026", text: "Mi favorito es Úrsula, es el pilar que sostiene a toda la familia." },
            { id: "dm7", author: "Luis Ramírez", date: "30 ago 2026", text: "Úrsula es increíble, aunque yo siempre recordaré a Aureliano al frente del pelotón." },
          ],
        },
      ],
      chat: [
        { id: "c1", author: "Ana Torres", text: "¿Llegaron al capítulo 12?", time: "09:12" },
        { id: "c2", author: "Luis Ramírez", text: "Aún voy por el 11 pero no puedo soltarlo.", time: "09:14" },
        { id: "c3", author: "María López", text: "¡La lluvia interminable me tiene atrapada!", time: "09:20" },
        { id: "c4", author: "Ana Torres", text: "Jaja sí, ese final de capítulo es brutal.", time: "09:25" },
      ],
    },
    {
      id: "club-2",
      name: "Fronteras Imaginarias",
      description: "Exploramos universos de ciencia ficción y fantasía, desde los clásicos hasta los autores contemporáneos.",
      genre: "Ciencia ficción",
      color: "Azul añil",
      currentBook: "Dune",
      bookAuthor: "Frank Herbert",
      progress: 35,
      members: ["Pedro Sánchez", "Carolina Vega"],
      nextMeeting: { date: "14 sep 2026", time: "17:30", topic: "El planeta Arrakis", location: "Sala A · Biblioteca Central" },
      meetings: [
        { id: "m3", date: "14 sep 2026", time: "17:30", topic: "El planeta Arrakis", location: "Sala A · Biblioteca Central" },
        { id: "m4", date: "28 sep 2026", time: "17:30", topic: "La política de las casas", location: "Sala A · Biblioteca Central" },
      ],
      discussions: [
        {
          id: "d4",
          title: "La ecología de Dune",
          author: "Pedro Sánchez",
          date: "5 sep 2026",
          messages: [
            { id: "dm8", author: "Pedro Sánchez", date: "5 sep 2026", text: "Herbert crea un mundo tan coherente ecológicamente que es difícil creer que no exista." },
            { id: "dm9", author: "Carolina Vega", date: "6 sep 2026", text: "La idea de terraformar Arrakis es brillante. El agua como recurso central es genial." },
          ],
        },
        {
          id: "d5",
          title: "Paul Atreides: héroe o villano",
          author: "Carolina Vega",
          date: "2 sep 2026",
          messages: [
            { id: "dm10", author: "Carolina Vega", date: "2 sep 2026", text: "¿Es Paul un héroe trágico o un villano que desata una guerra santa?" },
            { id: "dm11", author: "Pedro Sánchez", date: "3 sep 2026", text: "Esa ambigüedad es lo mejor de la novela, para mí." },
          ],
        },
      ],
      chat: [
        { id: "c5", author: "Pedro Sánchez", text: "El primer capítulo me voló la cabeza.", time: "10:02" },
        { id: "c6", author: "Carolina Vega", text: "La traición de la casa Harkonnen es terrible.", time: "10:10" },
      ],
    },
    {
      id: "club-3",
      name: "Verso y Alma",
      description: "Compartimos poemas, leemos a los grandes autores y escribimos nuestros propios versos.",
      genre: "Poesía",
      color: "Borgoña",
      currentBook: "Veinte poemas de amor",
      bookAuthor: "Pablo Neruda",
      progress: 80,
      members: ["Julia Fernández", "Andrés Castro", "Rosa Quintero"],
      nextMeeting: { date: "18 sep 2026", time: "19:00", topic: "Poemas 15-20", location: "Terraza de lectura" },
      meetings: [
        { id: "m5", date: "18 sep 2026", time: "19:00", topic: "Poemas 15-20", location: "Terraza de lectura" },
        { id: "m6", date: "2 oct 2026", time: "19:00", topic: "Taller de escritura", location: "Auditorio pequeño" },
      ],
      discussions: [
        {
          id: "d6",
          title: "El amor en Neruda",
          author: "Julia Fernández",
          date: "6 sep 2026",
          messages: [
            { id: "dm12", author: "Julia Fernández", date: "6 sep 2026", text: "Me encanta cómo Neruda mezcla lo íntimo con lo natural." },
            { id: "dm13", author: "Andrés Castro", date: "7 sep 2026", text: "El poema 15 es uno de los más hermosos que he leído." },
          ],
        },
        {
          id: "d7",
          title: "Comparte tu verso favorito",
          author: "Rosa Quintero",
          date: "30 ago 2026",
          messages: [
            { id: "dm14", author: "Rosa Quintero", date: "30 ago 2026", text: "Quiero que compartan el verso que más los ha marcado de esta lectura." },
            { id: "dm15", author: "Julia Fernández", date: "1 sep 2026", text: "Yo me quedo con: 'Quiero hacer contigo lo que la primavera hace con los cerezos'." },
          ],
        },
      ],
      chat: [
        { id: "c7", author: "Julia Fernández", text: "Esos poemas me llegan al alma.", time: "11:00" },
        { id: "c8", author: "Rosa Quintero", text: "¡Ven a la tertulia del jueves!", time: "11:05" },
        { id: "c9", author: "Andrés Castro", text: "Ahí estaré.", time: "11:08" },
      ],
    },
    {
      id: "club-4",
      name: "Narrativa en Voz Alta",
      description: "Leemos cuentos y novelas cortas en grupo, fomentando la lectura compartida y el intercambio de perspectivas.",
      genre: "Misterio",
      color: "Cobre",
      currentBook: "El nombre de la rosa",
      bookAuthor: "Umberto Eco",
      progress: 45,
      members: ["Diego Mora", "Lucía Herrera"],
      nextMeeting: { date: "20 sep 2026", time: "18:30", topic: "Los enigmas de la abadía", location: "Sala B · Biblioteca Central" },
      meetings: [
        { id: "m7", date: "20 sep 2026", time: "18:30", topic: "Los enigmas de la abadía", location: "Sala B · Biblioteca Central" },
        { id: "m8", date: "4 oct 2026", time: "18:30", topic: "El papel de Guillermo", location: "Sala B · Biblioteca Central" },
      ],
      discussions: [
        {
          id: "d8",
          title: "El misterio del laberinto",
          author: "Diego Mora",
          date: "7 sep 2026",
          messages: [
            { id: "dm16", author: "Diego Mora", date: "7 sep 2026", text: "El laberinto como símbolo del conocimiento me parece fascinante." },
            { id: "dm17", author: "Lucía Herrera", date: "8 sep 2026", text: "Y el peligro de la censura toca temas muy actuales." },
          ],
        },
      ],
      chat: [
        { id: "c10", author: "Diego Mora", text: "Qué enrevesado es todo, me encanta.", time: "12:30" },
        { id: "c11", author: "Lucía Herrera", text: "La ambientación medieval es espectacular.", time: "12:41" },
      ],
    },
    {
      id: "club-5",
      name: "Huellas del Pasado",
      description: "Viajamos por la historia a través de relatos, ensayos y biografías que nos ayudan a entender el presente.",
      genre: "Historia",
      color: "Verde oliva",
      currentBook: "Sapiens",
      bookAuthor: "Yuval Noah Harari",
      progress: 25,
      members: ["Sofía Vargas", "Tomás Ríos", "Natalia Pino", "Ricardo Adán"],
      nextMeeting: { date: "22 sep 2026", time: "18:00", topic: "La revolución cognitiva", location: "Auditorio pequeño" },
      meetings: [
        { id: "m9", date: "22 sep 2026", time: "18:00", topic: "La revolución cognitiva", location: "Auditorio pequeño" },
        { id: "m10", date: "6 oct 2026", time: "18:00", topic: "La revolución agrícola", location: "Auditorio pequeño" },
      ],
      discussions: [
        {
          id: "d9",
          title: "Ficciones compartidas",
          author: "Sofía Vargas",
          date: "8 sep 2026",
          messages: [
            { id: "dm18", author: "Sofía Vargas", date: "8 sep 2026", text: "La idea de que las naciones son ficciones compartidas me parece revolucionaria." },
            { id: "dm19", author: "Tomás Ríos", date: "9 sep 2026", text: "Y las empresas o la religión van por el mismo camino." },
          ],
        },
        {
          id: "d10",
          title: "¿Felicidad en el pasado?",
          author: "Natalia Pino",
          date: "5 sep 2026",
          messages: [
            { id: "dm20", author: "Natalia Pino", date: "5 sep 2026", text: "¿Era el cazador-recolector más feliz que nosotros?" },
            { id: "dm21", author: "Ricardo Adán", date: "6 sep 2026", text: "Quizá más libre a su manera, aunque con menos comodidad." },
          ],
        },
      ],
      chat: [
        { id: "c12", author: "Sofía Vargas", text: "Qué libro tan adictivo.", time: "14:20" },
        { id: "c13", author: "Tomás Ríos", text: "Lo leo con mi hijo también.", time: "14:35" },
      ],
    },
  ];
}

const DEFAULT_USUARIO = "Usuario";
const USERNAME = "Tú";

export default function ClubesView({ user, addToast }) {
  const [clubs, setClubs] = useState(buildMockClubs);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [color, setColor] = useState(CLUB_COLORS[0].name);
  const [errors, setErrors] = useState({});

  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [discTitle, setDiscTitle] = useState("");
  const [discMessage, setDiscMessage] = useState("");
  const [discErrors, setDiscErrors] = useState({});

  const [chatInput, setChatInput] = useState("");
  const [expandedThread, setExpandedThread] = useState(null);

  const currentUser = user?.nombre || DEFAULT_USUARIO;

  const filteredClubs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clubs;
    return clubs.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.genre.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.currentBook || "").toLowerCase().includes(q)
    );
  }, [clubs, search]);

  const selectedClub = clubs.find((c) => c.id === selectedId) || null;

  const resetCreate = () => {
    setName("");
    setDescription("");
    setGenre(GENRES[0]);
    setColor(CLUB_COLORS[0].name);
    setErrors({});
  };

  const resetDiscussion = () => {
    setDiscTitle("");
    setDiscMessage("");
    setDiscErrors({});
  };

  const handleCreateClub = () => {
    const e = {};
    if (!name.trim()) e.name = "El nombre del club es obligatorio";
    if (!description.trim()) e.description = "Escribe una breve descripción";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const colorObj = CLUB_COLORS.find((c) => c.name === color) || CLUB_COLORS[0];
    const newClub = {
      id: `club-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      genre,
      color: colorObj.name,
      currentBook: "Aún sin asignar",
      bookAuthor: "\u{1F4D6} Autor por asignar",
      progress: 0,
      members: [currentUser],
      nextMeeting: { date: "Por definir", time: "Por definir", topic: "Primera reunión", location: "Biblioteca Central" },
      meetings: [
        { id: `m-${Date.now()}`, date: "Por definir", time: "Por definir", topic: "Primera reunión", location: "Biblioteca Central" },
      ],
      discussions: [],
      chat: [],
    };
    setClubs((prev) => [...prev, newClub]);
    setShowCreateModal(false);
    resetCreate();
    addToast({ type: "success", message: `Club "${newClub.name}" creado exitosamente` });
  };

  const handleJoin = (clubId) => {
    setClubs((prev) =>
      prev.map((c) => {
        if (c.id !== clubId) return c;
        if (c.members.includes(currentUser)) {
          addToast({ type: "info", message: `Ya eres miembro de "${c.name}"` });
          return c;
        }
        addToast({ type: "success", message: `Te uniste al club "${c.name}"` });
        return { ...c, members: [...c.members, currentUser] };
      })
    );
  };

  const handleCreateDiscussion = () => {
    const e = {};
    if (!discTitle.trim()) e.discTitle = "El título es obligatorio";
    if (!discMessage.trim()) e.discMessage = "Escribe el primer mensaje";
    setDiscErrors(e);
    if (Object.keys(e).length > 0 || !selectedClub) return;

    const today = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    const newThread = {
      id: `d-${Date.now()}`,
      title: discTitle.trim(),
      author: currentUser,
      date: today,
      messages: [
        { id: `dm-${Date.now()}`, author: currentUser, date: today, text: discMessage.trim() },
      ],
    };
    setClubs((prev) =>
      prev.map((c) => (c.id === selectedClub.id ? { ...c, discussions: [newThread, ...c.discussions] } : c))
    );
    setShowDiscussionModal(false);
    resetDiscussion();
    addToast({ type: "success", message: "Discusión publicada" });
  };

  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text || !selectedClub) return;
    const time = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    setClubs((prev) =>
      prev.map((c) =>
        c.id === selectedClub.id ? { ...c, chat: [...c.chat, { id: `c-${Date.now()}`, author: USERNAME, text, time }] } : c
      )
    );
    setChatInput("");
  };

  const colorOf = (name) => CLUB_COLORS.find((c) => c.name === name) || CLUB_COLORS[0];

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />
      <SectionHeader
        eyebrow="Comunidad lectora"
        title="Clubes de Lectura"
        subtitle={`${clubs.length} clubes activos · Encuentra tu comunidad lectora`}
        icon={Users}
        action={
          <button
            onClick={() => { resetCreate(); setShowCreateModal(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-green-800 text-white text-sm px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-emerald-700/25 cursor-pointer font-semibold"
          >
            <Plus size={16} /> Crear club
          </button>
        }
      />

      {/* ================= LIST VIEW ================= */}
      {!selectedId && (
        <div className="space-y-6">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              placeholder="Buscar club por nombre, género o libro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-amber-200/60 rounded-2xl pl-11 pr-14 py-3 text-sm text-[#2B2118] placeholder:text-amber-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/15 focus:shadow-md transition-all duration-200 shadow-sm"
            />
            {search && (
              <>
                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">{filteredClubs.length}</div>
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-amber-100 text-amber-600 transition-all duration-200 cursor-pointer">
                  ×
                </button>
              </>
            )}
          </div>

          {filteredClubs.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Search size={36} className="text-amber-400/50" />
              </div>
              <p className="text-[#2B2118] text-lg font-serif">No se encontraron clubes</p>
              <p className="text-[#8a8368] text-sm mt-1">Intenta con otro término de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredClubs.map((club, i) => {
                const col = colorOf(club.color);
                const isMember = club.members && club.members.includes(currentUser);
                return (
                  <div
                    key={club.id}
                    onClick={() => { setSelectedId(club.id); setActiveTab("info"); setExpandedThread(null); }}
                    className="group relative bg-white rounded-2xl border border-amber-100/60 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer animate-fadeIn"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 ${col.border}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${col.grad} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                          <BookOpen size={20} className="text-white" />
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${col.soft} ${col.text}`}>{club.genre}</span>
                      </div>
                      <h3 className="font-serif text-lg text-[#2B2118] mb-1 leading-snug group-hover:text-[#3A2618] transition-colors">{club.name}</h3>
                      <p className="text-xs text-[#8a8368] line-clamp-2 mb-4 min-h-[32px]">{club.description}</p>

                      <div className="space-y-2 text-xs text-[#6f6a55]">
                        <div className="flex items-center gap-2">
                          <Users size={13} className="text-[#C49A55]" />
                          <span className="font-semibold text-[#2B2118]">{club.members?.length || 0}</span>
                          <span>miembros</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen size={13} className="text-[#C49A55]" />
                          <span className="line-clamp-1">{club.currentBook || "Aún sin asignar"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-[#C49A55]" />
                          <span className="line-clamp-1">{club.nextMeeting?.date} · {club.nextMeeting?.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-gradient-to-r from-[#f5f0e4] to-[#faf6eb] border-t border-[#C9A97E]/40 flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleJoin(club.id); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${isMember ? "bg-emerald-100 text-emerald-700 border border-emerald-300/60 cursor-default" : "bg-gradient-to-r from-emerald-700 to-green-800 text-white hover:from-emerald-600 hover:to-green-700 shadow-sm active:scale-[0.97]"}`}
                      >
                        {isMember ? <Check size={13} /> : <UserPlus size={13} />}
                        {isMember ? "Miembro" : "Unirse"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= DETAIL VIEW ================= */}
      {selectedId && selectedClub && (
        <div className="space-y-6 animate-fadeIn">
          <button
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#C9A97E] text-[#2B2118] text-sm shadow-sm hover:bg-amber-50 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} /> Volver a clubes
          </button>

          <div className="relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-900/10">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorOf(selectedClub.color).grad}`} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 80% 20%, rgba(251,191,36,0.2) 0%, transparent 50%)" }} />
            <div className="relative px-8 py-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0`}>
                  <BookOpen size={30} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/20 text-white">
                    {selectedClub.genre}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white mt-2 leading-tight">{selectedClub.name}</h2>
                  <p className="text-emerald-100/80 text-sm mt-1 max-w-2xl">{selectedClub.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-white">{selectedClub.members?.length || 0}</p>
                    <p className="text-[10px] uppercase tracking-widest text-emerald-200/70">miembros</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap border-b border-[#C9A97E]/60 pb-px">
            {[
              { key: "info", label: "Info", icon: Sparkles },
              { key: "discusiones", label: "Discusiones", icon: MessagesSquare },
              { key: "chat", label: "Chat", icon: MessageCircle },
              { key: "eventos", label: "Eventos", icon: Calendar },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === key ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white shadow-md" : "text-[#6f6a55] hover:bg-amber-50"}`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* === INFO TAB === */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fadeIn">
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center shadow-sm">
                      <BookOpen size={15} className="text-white" />
                    </div>
                    <h3 className="font-serif text-base text-[#2B2118]">Lectura actual</h3>
                  </div>
                  <p className="font-serif text-lg text-[#2B2118]">{selectedClub.currentBook}</p>
                  <p className="text-sm text-[#8a8368] mt-0.5">{selectedClub.bookAuthor}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-[#6f6a55] font-semibold mb-1.5">
                      <span>Progreso de lectura</span>
                      <span className="text-emerald-700">{selectedClub.progress}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-amber-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colorOf(selectedClub.color).grad} transition-all duration-700`}
                        style={{ width: `${selectedClub.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                      <MapPin size={15} className="text-white" />
                    </div>
                    <h3 className="font-serif text-base text-[#2B2118]">Próxima reunión</h3>
                  </div>
                  <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/60 px-5 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Fecha</p>
                        <p className="font-bold text-[#2B2118] flex items-center gap-1.5"><Calendar size={13} className="text-amber-600" />{selectedClub.nextMeeting?.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Hora</p>
                        <p className="font-bold text-[#2B2118] flex items-center gap-1.5"><Clock size={13} className="text-amber-600" />{selectedClub.nextMeeting?.time}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Tema</p>
                        <p className="font-semibold text-[#2B2118]">{selectedClub.nextMeeting?.topic}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] uppercase tracking-wider text-[#8a8368] font-semibold mb-1">Lugar</p>
                        <p className="font-semibold text-[#2B2118] flex items-center gap-1.5"><MapPin size={13} className="text-amber-600" />{selectedClub.nextMeeting?.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-amber-100/60 p-6 shadow-sm h-fit">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-sm">
                    <Users size={15} className="text-white" />
                  </div>
                  <h3 className="font-serif text-base text-[#2B2118]">Miembros</h3>
                  <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">{selectedClub.members?.length || 0}</span>
                </div>
                <ul className="space-y-2.5">
                  {selectedClub.members?.map((m, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${["from-emerald-500 to-green-600", "from-amber-500 to-orange-600", "from-blue-500 to-indigo-600", "from-rose-500 to-red-600", "from-violet-500 to-purple-600"][i % 5]} flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}>
                        {m.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="text-sm font-semibold text-[#2B2118]">{m === USERNAME ? m : m}</span>
                      {m === currentUser && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Tú</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* === DISCUSIONES TAB === */}
          {activeTab === "discusiones" && (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-sm">
                    <MessagesSquare size={15} className="text-white" />
                  </div>
                  <h3 className="font-serif text-base text-[#2B2118]">Hilos de discusión</h3>
                  <span className="text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full border border-violet-200">{selectedClub.discussions.length}</span>
                </div>
                <button
                  onClick={() => { resetDiscussion(); setShowDiscussionModal(true); }}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-green-800 text-white text-xs px-4 py-2.5 rounded-xl hover:from-emerald-600 hover:to-green-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-emerald-700/25 cursor-pointer font-semibold"
                >
                  <Plus size={14} /> Nueva discusión
                </button>
              </div>

              {selectedClub.discussions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <MessagesSquare size={28} className="text-violet-400/60" />
                  </div>
                  <p className="text-[#2B2118] text-lg font-serif">Aún no hay discusiones</p>
                  <p className="text-[#8a8368] text-sm mt-1">Sé el primero en iniciar un hilo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedClub.discussions.map((thread) => {
                    const expanded = expandedThread === thread.id;
                    return (
                      <div key={thread.id} className="bg-white rounded-2xl border border-amber-100/60 shadow-sm overflow-hidden transition-all duration-300">
                        <button
                          onClick={() => setExpandedThread(expanded ? null : thread.id)}
                          className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-amber-50/50 transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-sm shrink-0">
                            <MessageCircle size={17} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-base text-[#2B2118] truncate">{thread.title}</p>
                            <p className="text-xs text-[#8a8368] flex items-center gap-2 mt-0.5 truncate">
                              <span className="font-semibold text-[#6f6a55]">{thread.author}</span>
                              <span>·</span>
                              <span>{thread.date}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                            <MessageCircle size={11} /> {thread.messages.length}
                          </div>
                        </button>
                        {expanded && (
                          <div className="px-5 py-4 border-t border-[#C9A97E]/40 bg-gradient-to-b from-[#faf8f0] to-[#f5f0e4] space-y-3 animate-fadeIn">
                            {thread.messages.map((msg) => (
                              <div key={msg.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
                                  {msg.author.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-[#2B2118]">{msg.author}</span>
                                    <span className="text-[10px] text-[#a89f81]">{msg.date}</span>
                                  </div>
                                  <p className="text-sm text-[#4a4738] leading-relaxed mt-0.5">{msg.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* === CHAT TAB === */}
          {activeTab === "chat" && (
            <div className="animate-fadeIn">
              <div className="bg-white rounded-2xl border border-amber-100/60 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#C9A97E]/40 flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-yellow-50">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center shadow-sm">
                    <MessageCircle size={15} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-[#2B2118]">Chat del club</h3>
                    <p className="text-[11px] text-[#8a8368]">Conversación en tiempo real (demostración)</p>
                  </div>
                </div>
                <div className="px-5 py-5 h-96 overflow-y-auto space-y-3">
                  {selectedClub.chat?.length === 0 ? (
                    <div className="text-center py-16">
                      <MessageCircle size={28} className="mx-auto text-[#C49A55]/50 mb-2" />
                      <p className="text-[#8a8368] text-sm">Aún no hay mensajes. Inicia la conversación.</p>
                    </div>
                  ) : (
                    selectedClub.chat.map((msg) => {
                      const mine = msg.author === USERNAME;
                      return (
                        <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] ${mine ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white" : "bg-gradient-to-r from-amber-50 to-yellow-50 text-[#2B2118] border border-amber-200/60"} rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm`}>
                            {!mine && <p className="text-[11px] font-bold text-emerald-700 mb-0.5">{msg.author}</p>}
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className={`text-[10px] mt-1 font-medium ${mine ? "text-emerald-100/70" : "text-[#a89f81]"} text-right`}>{msg.time}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-5 py-3.5 border-t border-[#C9A97E]/40 bg-[#faf6eb] flex items-center gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendChat(); }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-white/80 border border-[#C9A97E] text-[#2B2118] placeholder:text-[#a89f81] outline-none focus:border-[#C49A55] focus:ring-2 focus:ring-[#C49A55]/20 transition-all duration-200"
                  />
                  <button
                    onClick={handleSendChat}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-700 to-green-800 text-white flex items-center justify-center hover:from-emerald-600 hover:to-green-700 active:scale-[0.95] transition-all duration-200 shadow-md shadow-emerald-700/25 cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === EVENTOS TAB === */}
          {activeTab === "eventos" && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm">
                  <Calendar size={15} className="text-white" />
                </div>
                <h3 className="font-serif text-base text-[#2B2118]">Próximos encuentros</h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">{selectedClub.meetings.length}</span>
              </div>
              <div className="space-y-3">
                {selectedClub.meetings.map((meeting, i) => (
                  <div key={meeting.id} className="relative flex gap-4 rounded-2xl bg-white border border-amber-100/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
                    <div className={`absolute top-0 left-0 right-0 h-0.5 ${colorOf(selectedClub.color).border}`} />
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                      <span className="text-[9px] uppercase tracking-wider font-bold">{String(meeting.date).split(" ").slice(-1)[0]}</span>
                      <span className="text-lg font-black leading-none">{String(meeting.date).split(" ")[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-base text-[#2B2118]">{meeting.topic}</h4>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-[#6f6a55] flex-wrap">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-600" />{meeting.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber-600" />{meeting.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-amber-600" />{meeting.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-center block shrink-0">{i === 0 ? "Próximo" : "Programado"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= CREATE CLUB MODAL ================= */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetCreate(); }} title="Crear Club de Lectura" icon={Plus}>
        <FormField label="Nombre del club" icon={Users} error={errors.name} required>
          <input type="text" placeholder="Ej: Club de Clásicos" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className={getInputClass(errors.name)} />
        </FormField>
        <FormField label="Descripción" icon={BookOpen} error={errors.description} required>
          <textarea
            placeholder="¿De qué trata este club?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={300}
            className={`${getInputClass(errors.description)} resize-none`}
          />
        </FormField>
        <FormField label="Género" icon={Sparkles} required>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className={selectClass}>
            {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </FormField>
        <FormField label="Color del club" icon={Users} required>
          <div className="flex items-center gap-2 flex-wrap">
            {CLUB_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                title={c.name}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${color === c.name ? "ring-2 ring-[#2B2118] ring-offset-2 scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: c.solid }}
              >
                {color === c.name && <Check size={16} className="text-white" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#8a8368] mt-1.5">Color seleccionado: <span className="font-semibold" style={{ color: colorOf(color).solid }}>{color}</span></p>
        </FormField>
        <div className="flex justify-end gap-2 mt-6">
          <FormButton variant="secondary" onClick={() => { setShowCreateModal(false); resetCreate(); }}>Cancelar</FormButton>
          <FormButton variant="primary" onClick={handleCreateClub}>Crear club</FormButton>
        </div>
      </Modal>

      {/* ================= CREATE DISCUSSION MODAL ================= */}
      <Modal isOpen={showDiscussionModal} onClose={() => { setShowDiscussionModal(false); resetDiscussion(); }} title="Nueva Discusión" icon={MessagesSquare}>
        <FormField label="Título de la discusión" icon={MessageCircle} error={discErrors.discTitle} required>
          <input type="text" placeholder="Ej: ¿Cuál fue tu capítulo favorito?" value={discTitle} onChange={(e) => setDiscTitle(e.target.value)} maxLength={120} className={getInputClass(discErrors.discTitle)} />
        </FormField>
        <FormField label="Primer mensaje" icon={Send} error={discErrors.discMessage} required>
          <textarea
            placeholder="Comparte el tema que quieres debatir..."
            value={discMessage}
            onChange={(e) => setDiscMessage(e.target.value)}
            rows={4}
            maxLength={600}
            className={`${getInputClass(discErrors.discMessage)} resize-none`}
          />
        </FormField>
        <div className="flex justify-end gap-2 mt-6">
          <FormButton variant="secondary" onClick={() => { setShowDiscussionModal(false); resetDiscussion(); }}>Cancelar</FormButton>
          <FormButton variant="primary" onClick={handleCreateDiscussion}>Publicar discusión</FormButton>
        </div>
      </Modal>
    </div>
  );
}
