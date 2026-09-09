import { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Star,
  Download,
  ShoppingCart,
  Heart,
  BookMarked,
  Crown,
  Filter,
  SortAsc,
  FileText,
  Clock,
  Eye,
  CreditCard,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import Modal from "../components/Modal";
import PatternBg from "../components/PatternBg";
import FormField from "../components/FormField";
import FormButton from "../components/FormButton";
import { getInputClass } from "../utils/helpers";

const COVER_COLORS = [
  "from-emerald-700 to-teal-900",
  "from-amber-600 to-orange-800",
  "from-indigo-700 to-blue-900",
  "from-rose-600 to-pink-800",
  "from-violet-700 to-purple-900",
  "from-teal-600 to-cyan-800",
  "from-yellow-600 to-amber-800",
  "from-sky-600 to-blue-800",
  "from-red-700 to-rose-900",
  "from-lime-700 to-green-900",
];

const GENRES = [
  "Todos",
  "Novela",
  "Ficción",
  "Poesía",
  "Ensayo",
  "Historia",
  "Ciencia",
  "Filosofía",
  "Aventura",
];

const PRICE_FILTERS = [
  { key: "all", label: "Todos" },
  { key: "free", label: "Gratis" },
  { key: "under5", label: "Menos de $5" },
  { key: "5to15", label: "$5 - $15" },
  { key: "over15", label: "Más de $15" },
];

const SORT_OPTIONS = [
  { key: "popular", label: "Popular" },
  { key: "priceLow", label: "Precio bajo" },
  { key: "priceHigh", label: "Precio alto" },
  { key: "rating", label: "Mejor valorados" },
];

const SAMPLE_REVIEWS = [
  {
    id: "r1",
    user: "María López",
    rating: 5,
    text: "Una obra maestra. La narrativa te atrapa desde la primera página y no te suelta hasta el final.",
    date: "12 ago 2026",
  },
  {
    id: "r2",
    user: "Carlos Ruiz",
    rating: 4,
    text: "Muy buen libro, especialmente los capítulos finales. La edición digital es de excelente calidad.",
    date: "5 jul 2026",
  },
  {
    id: "r3",
    user: "Ana Martínez",
    rating: 4.5,
    text: "Perfecto para leer en cualquier dispositivo. El formato EPUB se ve increíble.",
    date: "20 jun 2026",
  },
];

function buildMockBooks() {
  return [
    {
      id: "dk-001",
      title: "El Jardín de las Sombras",
      author: "Elena Ríos Martínez",
      genre: "Novela",
      price: 0,
      freeWithSub: true,
      rating: 4.7,
      ratingCount: 342,
      downloads: 12450,
      format: "EPUB",
      pages: 328,
      size: "2.4 MB",
      description:
        "Una historia envolvente sobre una familia que descubre un jardín secreto en su mansión ancestral. Cada planta guarda un recuerdo, cada sendero una verdad oculta.",
      emoji: "\u{1F338}",
      portada: "https://covers.openlibrary.org/b/isbn/9788408245469",
      colorIdx: 0,
    },
    {
      id: "dk-002",
      title: "Crónicas del Tiempo Perdido",
      author: "Roberto Sánchez Díaz",
      genre: "Ficción",
      price: 12.99,
      freeWithSub: false,
      rating: 4.3,
      ratingCount: 187,
      downloads: 5680,
      format: "PDF",
      pages: 456,
      size: "4.1 MB",
      description:
        "Un viaje temporal que conecta el Madrid del siglo XVII con una sociedad futura donde la memoria es la moneda de cambio.",
      emoji: "\u231B",
      colorIdx: 1,
    },
    {
      id: "dk-003",
      title: "Versos del Alma",
      author: "Lucía Fernández Vargas",
      genre: "Poesía",
      price: 0,
      freeWithSub: true,
      rating: 4.8,
      ratingCount: 521,
      downloads: 18930,
      format: "EPUB",
      pages: 96,
      size: "0.8 MB",
      description:
        "Una colección de poemas que exploran el amor, la pérdida y la esperanza con una voz lírica única y desgarradora.",
      emoji: "\u2712\uFE0F",
      portada: "https://covers.openlibrary.org/b/isbn/9788412116243",
      colorIdx: 4,
    },
    {
      id: "dk-004",
      title: "La Ciencia en la Cocina",
      author: "Dr. Miguel Ángel Torres",
      genre: "Ciencia",
      price: 8.99,
      freeWithSub: false,
      rating: 4.1,
      ratingCount: 93,
      downloads: 3210,
      format: "PDF",
      pages: 224,
      size: "3.2 MB",
      description:
        "Descubre la química detrás de cada receta. Desde la reacción de Maillard hasta la ciencia del fermentado.",
      emoji: "\u{1F373}",
      portada: "https://covers.openlibrary.org/b/isbn/9788484285892",
      colorIdx: 5,
    },
    {
      id: "dk-005",
      title: "Senderos de Libertad",
      author: "Javier Morales Reyes",
      genre: "Aventura",
      price: 6.5,
      freeWithSub: false,
      rating: 4.5,
      ratingCount: 276,
      downloads: 7890,
      format: "EPUB",
      pages: 382,
      size: "2.9 MB",
      description:
        "La travesía de un joven explorador por la selva amazónica en busca de una civilización perdida que guarda un secreto milenario.",
      emoji: "\u{1F9ED}",
      portada: "https://covers.openlibrary.org/b/isbn/9788432234972",
      colorIdx: 3,
    },
    {
      id: "dk-006",
      title: "Ensayos sobre la Condición Humana",
      author: "Prof. Carmen Delgado",
      genre: "Ensayo",
      price: 14.99,
      freeWithSub: false,
      rating: 3.9,
      ratingCount: 64,
      downloads: 2100,
      format: "PDF",
      pages: 198,
      size: "1.8 MB",
      description:
        "Un análisis profundo de las decisiones humanas y cómo estas definen nuestra existencia en la era digital.",
      emoji: "\u{1F9E0}",
      colorIdx: 2,
    },
    {
      id: "dk-007",
      title: "Historia del Arte Latinoamericano",
      author: "Dra. Isabella Moreno",
      genre: "Historia",
      price: 0,
      freeWithSub: true,
      rating: 4.6,
      ratingCount: 189,
      downloads: 9870,
      format: "EPUB",
      pages: 512,
      size: "8.5 MB",
      description:
        "Un recorrido exhaustivo por los movimientos artísticos que forjaron la identidad visual de América Latina desde el siglo XVI.",
      emoji: "\u{1F5BC}\uFE0F",
      colorIdx: 8,
    },
    {
      id: "dk-008",
      title: "El Arte de Pensar Claro",
      author: "Dr. Alejandro Vargas",
      genre: "Filosofía",
      price: 19.99,
      freeWithSub: false,
      rating: 4.4,
      ratingCount: 312,
      downloads: 6540,
      format: "EPUB",
      pages: 276,
      size: "2.1 MB",
      description:
        "Una guía práctica para mejorar el pensamiento crítico basada en principios filosóficos fundamentales y ejercicios cotidianos.",
      emoji: "\u{1F4A1}",
      colorIdx: 6,
    },
    {
      id: "dk-009",
      title: "Cuentos del Altiplano",
      author: "Gabriela Quispe Mamani",
      genre: "Ficción",
      price: 3.99,
      freeWithSub: false,
      rating: 4.2,
      ratingCount: 148,
      downloads: 4320,
      format: "PDF",
      pages: 168,
      size: "1.5 MB",
      description:
        "Relatos mágicos ambientados en los Andes, donde la realidad se entrelaza con las leyendas ancestrales del altiplano.",
      emoji: "\u{1F3D4}\uFE0F",
      colorIdx: 7,
    },
    {
      id: "dk-010",
      title: "La Revolución Silenciosa",
      author: "Raúl Domínguez Ortiz",
      genre: "Historia",
      price: 0,
      freeWithSub: true,
      rating: 4.8,
      ratingCount: 456,
      downloads: 15670,
      format: "EPUB",
      pages: 340,
      size: "3.0 MB",
      description:
        "La historia no contada de los movimientos sociales que transformaron América Latina en el siglo XX sin disparar un solo tiro.",
      emoji: "\u270A",
      colorIdx: 9,
    },
  ];
}

function StarRating({ rating, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} size={size} className="text-amber-400 fill-amber-400" />);
    } else if (i - rating < 1 && i - rating > 0) {
      stars.push(
        <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
          <Star size={size} className="text-gray-300 absolute inset-0" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
            <Star size={size} className="text-amber-400 fill-amber-400" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} size={size} className="text-gray-300" />);
    }
  }
  return <span className="inline-flex items-center gap-0.5">{stars}</span>;
}

export default function BibliotecaDigitalView({ user: _user, addToast }) {
  const [books] = useState(buildMockBooks);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedBook, setSelectedBook] = useState(null);
  const [libraryTab, setLibraryTab] = useState("purchased");
  const [purchasedIds, setPurchasedIds] = useState(["dk-001", "dk-003", "dk-007"]);
  const [favoriteIds, setFavoriteIds] = useState(["dk-001", "dk-003"]);
  const [cartIds, setCartIds] = useState(["dk-005"]);

  const subscriptionBooks = useMemo(() => books.filter((b) => b.freeWithSub).length, [books]);

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== "Todos") {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    if (priceFilter === "free") {
      result = result.filter((b) => b.price === 0);
    } else if (priceFilter === "under5") {
      result = result.filter((b) => b.price > 0 && b.price < 5);
    } else if (priceFilter === "5to15") {
      result = result.filter((b) => b.price >= 5 && b.price <= 15);
    } else if (priceFilter === "over15") {
      result = result.filter((b) => b.price > 15);
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [books, searchQuery, selectedGenre, priceFilter, sortBy]);

  const purchasedBooks = useMemo(() => books.filter((b) => purchasedIds.includes(b.id)), [books, purchasedIds]);
  const favoriteBooks = useMemo(() => books.filter((b) => favoriteIds.includes(b.id)), [books, favoriteIds]);
  const recentBooks = useMemo(() => purchasedBooks.slice(0, 3), [purchasedBooks]);

  function handleSubscribe() {
    addToast({
      type: "info",
      message: "Redirigiendo al flujo de suscripción... Accede a lectura ilimitada por solo $9.99/mes.",
    });
    setTimeout(() => setIsSubscribed(true), 1500);
  }

  function handleBuy(book) {
    addToast({ type: "success", message: `"${book.title}" agregado a tu compra. Procesando pago...` });
    if (!purchasedIds.includes(book.id)) {
      setPurchasedIds((prev) => [...prev, book.id]);
    }
  }

  function handleAddToCart(book) {
    if (cartIds.includes(book.id)) {
      addToast({ type: "info", message: `"${book.title}" ya está en tu carrito.` });
    } else {
      setCartIds((prev) => [...prev, book.id]);
      addToast({ type: "success", message: `"${book.title}" agregado al carrito.` });
    }
  }

  function handleToggleFavorite(book) {
    setFavoriteIds((prev) =>
      prev.includes(book.id) ? prev.filter((id) => id !== book.id) : [...prev, book.id]
    );
  }

  function handleRead(book) {
    addToast({ type: "info", message: `Abriendo "${book.title}" en el lector digital...` });
  }

  return (
    <div className="relative animate-fadeIn">
      <PatternBg />

      <SectionHeader
        eyebrow="Biblioteca Digital"
        title="Biblioteca Digital"
        subtitle={`${books.length} libros disponibles · ${subscriptionBooks} gratis con suscripción`}
        icon={BookOpen}
        action={
          isSubscribed ? (
            <span className="flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-semibold">
              <Crown size={15} />
              Suscripción Activa
            </span>
          ) : null
        }
      />

      {/* ================= SUBSCRIPTION BANNER ================= */}
      {!isSubscribed && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B2118] via-[#3A2618] to-[#2B2118] p-6 sm:p-8 mb-8 shadow-xl shadow-emerald-900/20 animate-fadeIn">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br from-[#C49A55] to-transparent blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-gradient-to-tr from-emerald-400 to-transparent blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} className="text-[#C49A55]" />
                <span className="text-[#C49A55] text-xs uppercase tracking-[0.2em] font-bold">Suscripción Premium</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">
                Accede a más de 150 libros digitales
              </h2>
              <p className="text-emerald-100/70 text-sm mb-4 max-w-lg">
                Disfruta de nuestra colección completa con beneficios exclusivos.
              </p>
              <ul className="flex flex-col sm:flex-row gap-3 mb-6">
                {[
                  { icon: BookOpen, text: "Lectura ilimitada" },
                  { icon: Eye, text: "Sin anuncios" },
                  { icon: Download, text: "Descarga offline" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-emerald-100/90 text-sm">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Icon size={13} className="text-emerald-300" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <FormButton variant="primary" onClick={handleSubscribe}>
                <span className="flex items-center gap-2">
                  <Crown size={15} />
                  Suscribirse — $9.99/mes
                </span>
              </FormButton>
            </div>
            <div className="hidden lg:flex w-40 h-52 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 items-center justify-center">
              <span className="text-6xl opacity-60">{"\u{1F4D6}"}</span>
            </div>
          </div>
        </div>
      )}

      {isSubscribed && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-center gap-4 shadow-sm animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
            <Crown size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base text-emerald-900">Tu suscripción está activa</h3>
            <p className="text-sm text-emerald-700/70">
              Tienes acceso ilimitado a {subscriptionBooks} libros. Disfruta de lectura sin fronteras.
            </p>
          </div>
          <span className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shrink-0">
            <Check size={14} />
            Activa
          </span>
        </div>
      )}

      {/* ================= SEARCH AND FILTERS ================= */}
      <div className="bg-white rounded-2xl border border-[#C9A97E]/60 p-4 sm:p-5 mb-6 shadow-sm animate-fadeIn">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a89f81]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o autor..."
              className={`${getInputClass(false)} pl-11`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Género" icon={Filter}>
              <div className="relative">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className={`${getInputClass(false)} appearance-none cursor-pointer pr-10`}
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f81] pointer-events-none" />
              </div>
            </FormField>
            <FormField label="Precio" icon={CreditCard}>
              <div className="relative">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className={`${getInputClass(false)} appearance-none cursor-pointer pr-10`}
                >
                  {PRICE_FILTERS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f81] pointer-events-none" />
              </div>
            </FormField>
            <FormField label="Ordenar" icon={SortAsc}>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`${getInputClass(false)} appearance-none cursor-pointer pr-10`}
                >
                  {SORT_OPTIONS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89f81] pointer-events-none" />
              </div>
            </FormField>
          </div>
        </div>
      </div>

      {/* ================= BOOK GRID ================= */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <BookOpen size={36} className="text-amber-400/50" />
          </div>
          <p className="text-[#2B2118] text-lg font-serif mb-1">No se encontraron libros</p>
          <p className="text-sm text-[#8a8368]">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filteredBooks.map((book, i) => {
            const isPurchased = purchasedIds.includes(book.id);
            const isFav = favoriteIds.includes(book.id);
            const isInCart = cartIds.includes(book.id);
            const canReadFree = isSubscribed && book.freeWithSub;

            return (
              <div
                key={book.id}
                className="group bg-white rounded-2xl border border-[#C9A97E]/60 shadow-sm hover:shadow-xl hover:border-amber-300/60 transition-all duration-300 overflow-hidden cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => setSelectedBook(book)}
              >
                {/* Cover */}
                <div
                  className={`relative h-44 bg-gradient-to-br ${COVER_COLORS[book.colorIdx]} flex items-center justify-center overflow-hidden`}
                >
                  <span className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                    {book.emoji}
                  </span>
                  {book.portada && (
                    <img
                      src={`${book.portada}-M.jpg`}
                      alt={book.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                      {book.format}
                    </span>
                    {book.freeWithSub && (
                      <span className="bg-emerald-500/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg">
                        Gratis con sub
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(book);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isFav
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                        : "bg-black/30 backdrop-blur-sm text-white/80 hover:bg-rose-500 hover:text-white"
                    }`}
                  >
                    <Heart size={14} className={isFav ? "fill-current" : ""} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-sm text-[#2B2118] leading-tight truncate group-hover:text-emerald-800 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#8a8368] mt-0.5 truncate">{book.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-semibold bg-[#f5f0e4] text-[#6f6a55] border border-[#C9A97E]/60 px-2 py-0.5 rounded-full">
                      {book.genre}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#8a8368]">
                      <Download size={11} />
                      {book.downloads >= 1000 ? `${(book.downloads / 1000).toFixed(1)}k` : book.downloads}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={book.rating} size={12} />
                    <span className="text-xs font-semibold text-[#6f6a55]">{book.rating}</span>
                    <span className="text-[10px] text-[#a89f81]">({book.ratingCount})</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#C9A97E]/40">
                    {book.price === 0 ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Gratis
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-[#2B2118]">${book.price.toFixed(2)}</span>
                    )}
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isPurchased || canReadFree ? (
                        <button
                          onClick={() => handleRead(book)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-green-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 cursor-pointer shadow-sm"
                        >
                          <BookOpen size={12} />
                          Leer
                        </button>
                      ) : book.price > 0 ? (
                        <>
                          <button
                            onClick={() => handleBuy(book)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-[#C49A55] to-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:brightness-110 transition-all duration-200 cursor-pointer shadow-sm"
                          >
                            <CreditCard size={12} />
                            Comprar
                          </button>
                          <button
                            onClick={() => handleAddToCart(book)}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                              isInCart
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                : "bg-white border-[#C9A97E] text-[#6f6a55] hover:border-emerald-300 hover:text-emerald-700"
                            }`}
                          >
                            <ShoppingCart size={12} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRead(book)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-green-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 cursor-pointer shadow-sm"
                        >
                          <BookOpen size={12} />
                          {canReadFree ? "Leer gratis" : "Suscríbete para leer"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= MY LIBRARY (subscribed users) ================= */}
      {isSubscribed && (
        <div className="mt-4 mb-10 animate-fadeIn">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
              <BookMarked size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-serif text-xl text-[#2B2118]">Mi Biblioteca Digital</h2>
              <p className="text-xs text-[#8a8368]">Tu colección personal de libros</p>
            </div>
          </div>

          {/* Library Tabs */}
          <div className="flex gap-2 border-b border-[#C9A97E]/60 pb-px mb-6">
            {[
              { key: "purchased", label: "Comprados", icon: CreditCard, count: purchasedBooks.length },
              { key: "favorites", label: "Favoritos", icon: Heart, count: favoriteBooks.length },
              { key: "recent", label: "Recientes", icon: Clock, count: recentBooks.length },
            ].map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setLibraryTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  libraryTab === key
                    ? "bg-gradient-to-r from-emerald-700 to-green-800 text-white shadow-md"
                    : "text-[#6f6a55] hover:bg-amber-50"
                }`}
              >
                <Icon size={14} />
                {label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    libraryTab === key ? "bg-white/20" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Library Content */}
          {libraryTab === "purchased" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 bg-gradient-to-r from-[#f5f0e4] to-[#faf6eb] border border-[#C9A97E]/40 rounded-xl p-4 hover:shadow-md transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`relative w-14 h-20 rounded-lg bg-gradient-to-br ${COVER_COLORS[book.colorIdx]} flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}
                  >
                    <span className="text-2xl">{book.emoji}</span>
                    {book.portada && (
                      <img
                        src={`${book.portada}-M.jpg`}
                        alt={book.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-[#2B2118] truncate">{book.title}</h4>
                    <p className="text-xs text-[#8a8368] truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={book.rating} size={10} />
                      <span className="text-[10px] text-[#8a8368]">{book.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRead(book)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 cursor-pointer shadow-sm shrink-0"
                  >
                    <BookOpen size={13} />
                    Leer
                  </button>
                </div>
              ))}
              {purchasedBooks.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#8a8368] text-sm">Aún no has comprado libros.</p>
                </div>
              )}
            </div>
          )}

          {libraryTab === "favorites" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/60 rounded-xl p-4 hover:shadow-md transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`relative w-14 h-20 rounded-lg bg-gradient-to-br ${COVER_COLORS[book.colorIdx]} flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}
                  >
                    <span className="text-2xl">{book.emoji}</span>
                    {book.portada && (
                      <img
                        src={`${book.portada}-M.jpg`}
                        alt={book.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-[#2B2118] truncate">{book.title}</h4>
                    <p className="text-xs text-[#8a8368] truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={book.rating} size={10} />
                      <span className="text-[10px] text-[#8a8368]">{book.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(book)}
                    className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center hover:bg-rose-200 transition-colors cursor-pointer shrink-0"
                  >
                    <Heart size={14} className="fill-current" />
                  </button>
                </div>
              ))}
              {favoriteBooks.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#8a8368] text-sm">Aún no tienes libros favoritos.</p>
                </div>
              )}
            </div>
          )}

          {libraryTab === "recent" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentBooks.map((book, i) => (
                <div
                  key={book.id}
                  className="flex items-center gap-4 bg-white border border-[#C9A97E]/60 rounded-xl p-4 hover:shadow-md transition-all duration-200 animate-fadeIn"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`relative w-14 h-20 rounded-lg bg-gradient-to-br ${COVER_COLORS[book.colorIdx]} flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}
                  >
                    <span className="text-2xl">{book.emoji}</span>
                    {book.portada && (
                      <img
                        src={`${book.portada}-M.jpg`}
                        alt={book.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm text-[#2B2118] truncate">{book.title}</h4>
                    <p className="text-xs text-[#8a8368] truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={book.rating} size={10} />
                      <span className="text-[10px] text-[#8a8368]">{book.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRead(book)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-700 to-green-800 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 cursor-pointer shadow-sm shrink-0"
                  >
                    <BookOpen size={13} />
                    Leer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= BOOK DETAIL MODAL ================= */}
      <Modal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        title={selectedBook?.title || ""}
        icon={BookOpen}
      >
        {selectedBook && (() => {
          const isPurchased = purchasedIds.includes(selectedBook.id);
          const isFav = favoriteIds.includes(selectedBook.id);
          const canReadFree = isSubscribed && selectedBook.freeWithSub;

          return (
            <div className="relative z-10">
              {/* Cover & Basic Info */}
              <div className="flex gap-5 mb-6">
                <div
                  className={`w-28 h-40 rounded-xl bg-gradient-to-br ${COVER_COLORS[selectedBook.colorIdx]} flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <span className="text-5xl">{selectedBook.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl text-[#2B2118] mb-1">{selectedBook.title}</h3>
                  <p className="text-sm text-[#6f6a55] mb-3">{selectedBook.author}</p>
                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={selectedBook.rating} size={16} />
                    <span className="text-sm font-bold text-[#6f6a55]">{selectedBook.rating}</span>
                    <span className="text-xs text-[#a89f81]">({selectedBook.ratingCount} reseñas)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f5f0e4] text-[#6f6a55] border border-[#C9A97E]/60 px-2.5 py-1 rounded-full">
                      {selectedBook.genre}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full">
                      {selectedBook.format}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <p className="text-sm text-[#6f6a55] leading-relaxed">{selectedBook.description}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Páginas", value: selectedBook.pages, icon: BookOpen },
                  { label: "Tamaño", value: selectedBook.size, icon: FileText },
                  { label: "Descargas", value: `${selectedBook.downloads >= 1000 ? `${(selectedBook.downloads / 1000).toFixed(1)}k` : selectedBook.downloads}`, icon: Download },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-[#f5f0e4] rounded-xl p-3 text-center border border-[#C9A97E]/40">
                    <Icon size={14} className="text-amber-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#2B2118]">{value}</p>
                    <p className="text-[10px] text-[#8a8368]">{label}</p>
                  </div>
                ))}
              </div>

              {/* Price & Actions */}
              <div className="bg-gradient-to-r from-[#f5f0e4] to-[#faf6eb] rounded-xl p-4 mb-5 border border-[#C9A97E]/40">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {selectedBook.price === 0 ? (
                      <span className="text-lg font-bold text-emerald-700">Gratis</span>
                    ) : (
                      <span className="text-lg font-bold text-[#2B2118]">${selectedBook.price.toFixed(2)}</span>
                    )}
                    {selectedBook.freeWithSub && (
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        Gratis con suscripción activa
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(selectedBook)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isFav
                        ? "bg-rose-100 text-rose-500 border border-rose-200"
                        : "bg-white text-[#a89f81] border border-[#C9A97E] hover:text-rose-500 hover:border-rose-200"
                    }`}
                  >
                    <Heart size={18} className={isFav ? "fill-current" : ""} />
                  </button>
                </div>
                <div className="flex gap-2">
                  {isPurchased || canReadFree ? (
                    <FormButton variant="primary" onClick={() => handleRead(selectedBook)}>
                      <span className="flex items-center gap-2">
                        <BookOpen size={15} />
                        Leer Ahora
                      </span>
                    </FormButton>
                  ) : (
                    <>
                      {selectedBook.price > 0 && (
                        <FormButton variant="primary" onClick={() => handleBuy(selectedBook)}>
                          <span className="flex items-center gap-2">
                            <CreditCard size={15} />
                            Comprar
                          </span>
                        </FormButton>
                      )}
                      <FormButton
                        variant="secondary"
                        onClick={() => handleAddToCart(selectedBook)}
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingCart size={15} />
                          Agregar al carrito
                        </span>
                      </FormButton>
                    </>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h4 className="font-serif text-base text-[#2B2118] mb-3">Reseñas</h4>
                <div className="space-y-3">
                  {SAMPLE_REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-xl p-4 border border-[#C9A97E]/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#2B2118]">{review.user}</p>
                            <StarRating rating={review.rating} size={10} />
                          </div>
                        </div>
                        <span className="text-[10px] text-[#a89f81]">{review.date}</span>
                      </div>
                      <p className="text-xs text-[#6f6a55] leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
