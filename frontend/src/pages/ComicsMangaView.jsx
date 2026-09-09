import { useMemo, useState } from "react";
import { BookOpen, SlidersHorizontal, Search, FilterX, ChevronDown, Sparkles, X } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { COMICS, COMIC_GENEROS, COMIC_FORMATOS } from "../data/comicsData";

export default function ComicsMangaView({ user, addToast }) {
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState("Todos");
  const [formato, setFormato] = useState("Todos");
  const [disponible, setDisponible] = useState("Todos");
  const [orden, setOrden] = useState("relevancia");
  const [detalle, setDetalle] = useState(null);

  const generos = ["Todos", ...COMIC_GENEROS];
  const formatos = ["Todos", ...COMIC_FORMATOS];
  const editoriales = ["Todas", ...Array.from(new Set(COMICS.map((c) => c.editorial)))];

  const filtrados = useMemo(() => {
    let lista = COMICS.filter((c) => {
      const q = busqueda.toLowerCase();
      const matchQ =
        !q ||
        c.titulo.toLowerCase().includes(q) ||
        c.autor.toLowerCase().includes(q) ||
        c.editorial.toLowerCase().includes(q);
      const matchGen = genero === "Todos" || c.genero === genero;
      const matchForm = formato === "Todos" || c.formato === formato;
      const matchDisp =
        disponible === "Todos" ||
        (disponible === "Disponibles" && c.disponible) ||
        (disponible === "Prestados" && !c.disponible);
      return matchQ && matchGen && matchForm && matchDisp;
    });

    if (orden === "titulo") lista = [...lista].sort((a, b) => a.titulo.localeCompare(b.titulo));
    else if (orden === "anio") lista = [...lista].sort((a, b) => b.anio - a.anio);
    else if (orden === "autor") lista = [...lista].sort((a, b) => a.autor.localeCompare(b.autor));

    return lista;
  }, [busqueda, genero, formato, disponible, orden]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setGenero("Todos");
    setFormato("Todos");
    setDisponible("Todos");
    setOrden("relevancia");
  };

  const hayFiltros =
    busqueda || genero !== "Todos" || formato !== "Todos" || disponible !== "Todos";

  const solicitar = (item) => {
    if (item.disponible) {
      addToast({ type: "success", message: `Solicitud de "${item.titulo}" registrada` });
      setDetalle(null);
    } else {
      addToast({ type: "error", message: `"${item.titulo}" no está disponible en este momento` });
    }
  };

  return (
    <div className="animate-fadeIn">
      <SectionHeader
        eyebrow="Sección especializada"
        title="Cómics y Manga"
        subtitle="Una colección curada de historietas, manga, manhwa y novelas gráficas para todos los gustos"
        icon={BookOpen}
        action={
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-[#657153]/15 text-[#657153] border border-[#657153]/30">
            <Sparkles size={12} /> {COMICS.length} títulos en colección
          </span>
        }
      />

      {/* Barra de búsqueda y filtros */}
      <div className="bg-gradient-to-b from-[#FFF8E7] to-[#F4E8D0] rounded-2xl border border-[#C49A55]/50 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B4226]/50" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título, autor o editorial..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C49A55]/40 bg-[#FFF8E7] text-sm text-[#2B2118] placeholder-[#6B4226]/40 focus:outline-none focus:ring-2 focus:ring-[#C49A55]/50 focus:border-[#C49A55] transition-all"
            />
          </div>
          <button
            onClick={limpiarFiltros}
            disabled={!hayFiltros}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${hayFiltros ? "bg-[#B85C38] text-white hover:bg-[#a9502f] shadow-md shadow-[#B85C38]/25" : "bg-[#F4E8D0] text-[#6B4226]/40 cursor-not-allowed border border-[#C49A55]/30"}`}
          >
            <FilterX size={15} /> Limpiar
          </button>
        </div>

        {/* Selectores de filtro */}
        <div className="px-4 pb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Género", val: genero, set: setGenero, opciones: generos },
            { label: "Formato", val: formato, set: setFormato, opciones: formatos },
            { label: "Editorial", val: "editorial", set: null, opciones: null },
            { label: "Disponibilidad", val: disponible, set: setDisponible, opciones: ["Todos", "Disponibles", "Prestados"] },
          ].map((filtro, i) => {
            if (filtro.val === "editorial") {
              return (
                <div key={i} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-[#C49A55]/30 bg-[#FFF8E7] text-[11px] font-semibold text-[#6B4226]/60">
                  <SlidersHorizontal size={13} /> {editoriales.length - 1} editoriales
                </div>
              );
            }
            return (
              <div key={i} className="relative">
                <select
                  value={filtro.val}
                  onChange={(e) => filtro.set(e.target.value)}
                  className="w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border border-[#C49A55]/40 bg-[#FFF8E7] text-sm text-[#2B2118] focus:outline-none focus:ring-2 focus:ring-[#C49A55]/50 transition-all cursor-pointer"
                >
                  {filtro.opciones.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B4226]/60" />
              </div>
            );
          })}
          <div className="relative">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border border-[#C49A55]/40 bg-[#FFF8E7] text-sm text-[#2B2118] focus:outline-none focus:ring-2 focus:ring-[#C49A55]/50 transition-all cursor-pointer"
            >
              <option value="relevancia">Relevancia</option>
              <option value="titulo">Título A-Z</option>
              <option value="autor">Autor A-Z</option>
              <option value="anio">Año (recientes)</option>
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B4226]/60" />
          </div>
        </div>
      </div>

      {/* Resultados */}
      <p className="text-xs text-[#6B4226]/60 mb-4 font-medium">
        {filtrados.length} {filtrados.length === 1 ? "título encontrado" : "títulos encontrados"}
      </p>

      {filtrados.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-b from-[#FFF8E7] to-[#F4E8D0] rounded-2xl border border-dashed border-[#C49A55]/40">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#C49A55]/10 flex items-center justify-center mb-4">
            <Search size={28} className="text-[#C49A55]" />
          </div>
          <p className="font-serif text-lg text-[#2B2118]">No se encontraron resultados</p>
          <p className="text-sm text-[#6B4226]/60 mt-1">Prueba ajustando los filtros o el término de búsqueda</p>
          <button onClick={limpiarFiltros} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#B85C38] to-[#a9502f] text-white hover:from-[#c96a43] hover:to-[#b85c38] transition-all cursor-pointer shadow-lg shadow-[#B85C38]/25">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtrados.map((item) => (
            <div
              key={item.id}
              onClick={() => setDetalle(item)}
              className="group bg-gradient-to-b from-[#FFF8E7] to-[#F4E8D0] rounded-2xl border border-[#C49A55]/40 shadow-sm hover:shadow-xl hover:border-[#C49A55]/70 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
            >
              {/* Portada estilo estantería */}
              <div className="relative aspect-[3/4] bg-gradient-to-br overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                <div className="absolute inset-3 rounded-xl bg-black/20 backdrop-blur-[1px] border border-white/15 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">{item.portadaEmoji}</span>
                  {item.portada && (
                    <img
                      src={`${item.portada}-M.jpg`}
                      alt={item.titulo}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/90 text-[#2B2118] shadow-sm">
                    {item.formato}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full shadow-sm ${item.disponible ? "bg-emerald-500 text-white" : "bg-[#B85C38] text-white"}`}>
                    {item.disponible ? "Disponible" : "Prestado"}
                  </span>
                </div>
              </div>
              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <p className="font-serif font-bold text-sm text-[#2B2118] leading-tight line-clamp-2 group-hover:text-[#B85C38] transition-colors">{item.titulo}</p>
                <p className="text-xs text-[#6B4226]/70 mt-1 truncate">{item.autor}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C49A55]/15 text-[#6B4226] border border-[#C49A55]/30 font-semibold">{item.genero}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#657153]/10 text-[#657153] border border-[#657153]/25 font-semibold">{item.anio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {detalle && (
        <div className="fixed inset-0 z-50 overflow-y-auto transition-all duration-300 opacity-100">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetalle(null)} />
          <div className="relative min-h-full flex items-center justify-center p-4">
            <div className="relative bg-gradient-to-b from-[#FFF8E7] to-[#F4E8D0] rounded-2xl border border-[#C49A55]/60 shadow-2xl w-full max-w-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C49A55] via-[#B85C38] to-[#C49A55]" />
              <button onClick={() => setDetalle(null)} className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-[#C49A55]/20 transition-colors text-[#6B4226] cursor-pointer">
                <X size={18} />
              </button>
              <div className="grid md:grid-cols-[220px_1fr] gap-0">
                <div className={`relative md:h-full min-h-[240px] bg-gradient-to-br ${detalle.color} p-6 flex items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="relative text-8xl drop-shadow-xl">{detalle.portadaEmoji}</span>
                  {detalle.portada && (
                    <img
                      src={`${detalle.portada}-L.jpg`}
                      alt={detalle.titulo}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 border border-[#C49A55]/30 text-[#2B2118]">{detalle.formato}</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#657153]/15 text-[#657153] border border-[#657153]/25">{detalle.genero}</span>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${detalle.disponible ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-[#B85C38]/15 text-[#B85C38] border border-[#B85C38]/30"}`}>
                      {detalle.disponible ? "Disponible" : "Prestado"}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl text-[#2B2118] leading-tight">{detalle.titulo}</h2>
                  <p className="text-sm text-[#6B4226]/80 mt-1">{detalle.autor}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-xs">
                    <div><span className="text-[#6B4226]/50">Editorial:</span> <span className="font-semibold text-[#2B2118]">{detalle.editorial}</span></div>
                    <div><span className="text-[#6B4226]/50">Año:</span> <span className="font-semibold text-[#2B2118]">{detalle.anio}</span></div>
                    <div><span className="text-[#6B4226]/50">Idioma:</span> <span className="font-semibold text-[#2B2118]">{detalle.idioma}</span></div>
                    <div><span className="text-[#6B4226]/50">Páginas:</span> <span className="font-semibold text-[#2B2118]">{detalle.paginas}</span></div>
                  </div>
                  <p className="text-sm text-[#6B4226]/80 leading-relaxed mt-4 border-t border-[#C49A55]/30 pt-4">{detalle.sinopsis}</p>
                  <div className="mt-5 flex gap-3">
                    <button onClick={() => solicitar(detalle)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-md ${detalle.disponible ? "bg-gradient-to-r from-[#B85C38] to-[#a9502f] text-white hover:from-[#c96a43] hover:to-[#b85c38] shadow-[#B85C38]/25" : "bg-[#F4E8D0] text-[#6B4226]/50 cursor-not-allowed border border-[#C49A55]/30"}`}>
                      {detalle.disponible ? "Solicitar préstamo" : "No disponible"}
                    </button>
                    <button onClick={() => setDetalle(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#F4E8D0] text-[#6B4226] border border-[#C49A55]/40 hover:bg-[#ece0c4] transition-all cursor-pointer">
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
