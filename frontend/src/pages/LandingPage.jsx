import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Users,
  Monitor,
  Palette,
  Star,
  ChevronRight,
  Quote,
  Library,
  BookMarked,
  Heart,
  MapPin,
  Clock,
  TrendingUp,
  Sparkles,
  Feather,
  Brain,
  Globe,
  Atom,
  ArrowRight,
  X,
  Menu,
  Phone,
  Mail,
} from 'lucide-react';
import useAnimatedCounter from '../hooks/useAnimatedCounter';

const sampleBooks = [
  { id: 1, title: 'Cien años de soledad', author: 'Gabriel García Márquez', genre: 'Novela', available: true, emoji: '\u{1F4DA}' },
  { id: 2, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', genre: 'Novela', available: true, emoji: '\u{1F4D6}' },
  { id: 3, title: 'Rayuela', author: 'Julio Cortázar', genre: 'Novela', available: false, emoji: '\u{1F4D5}' },
  { id: 4, title: 'La casa de los espíritus', author: 'Isabel Allende', genre: 'Novela', available: true, emoji: '\u{1F4D7}' },
  { id: 5, title: 'Pedro Páramo', author: 'Juan Rulfo', genre: 'Novela', available: true, emoji: '\u{1F4D8}' },
  { id: 6, title: 'Ficciones', author: 'Jorge Luis Borges', genre: 'Cuento', available: true, emoji: '\u{1F4D9}' },
  { id: 7, title: 'Veinte poemas de amor', author: 'Pablo Neruda', genre: 'Poesía', available: false, emoji: '\u{1F4DA}' },
  { id: 8, title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez', genre: 'Novela', available: true, emoji: '\u{1F4DA}' },
  { id: 9, title: 'Aura', author: 'Carlos Fuentes', genre: 'Novela', available: true, emoji: '\u{1F4D6}' },
  { id: 10, title: 'El principito', author: 'Antoine de Saint-Exupéry', genre: 'Cuento', available: true, emoji: '\u{1F4D6}' },
  { id: 11, title: 'Crónica de una muerte anunciada', author: 'Gabriel García Márquez', genre: 'Novela', available: true, emoji: '\u{1F4D9}' },
  { id: 12, title: 'Sobre héroes y tumbas', author: 'Ernesto Sábato', genre: 'Novela', available: false, emoji: '\u{1F4D5}' },
];

const featuredBooks = [
  { title: 'Cien años de soledad', author: 'Gabriel García Márquez', genre: 'Novela', available: true, emoji: '\u{1F4DA}', color: 'from-emerald-700 to-emerald-900', rating: 4.9 },
  { title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', genre: 'Novela', available: true, emoji: '\u{1F4D6}', color: 'from-amber-700 to-amber-900', rating: 5.0 },
  { title: 'Ficciones', author: 'Jorge Luis Borges', genre: 'Cuento', available: true, emoji: '\u{1F4D9}', color: 'from-indigo-700 to-indigo-900', rating: 4.8 },
  { title: 'La casa de los espíritus', author: 'Isabel Allende', genre: 'Novela', available: false, emoji: '\u{1F4D7}', color: 'from-rose-700 to-rose-900', rating: 4.7 },
  { title: 'Veinte poemas de amor', author: 'Pablo Neruda', genre: 'Poesía', available: true, emoji: '\u{1F4DA}', color: 'from-pink-700 to-pink-900', rating: 4.9 },
  { title: 'Rayuela', author: 'Julio Cortázar', genre: 'Novela', available: true, emoji: '\u{1F4D5}', color: 'from-violet-700 to-violet-900', rating: 4.6 },
];

const categories = [
  { name: 'Novela', icon: BookOpen, count: 1243, gradient: 'from-emerald-600 to-emerald-800' },
  { name: 'Cuento', icon: Feather, count: 487, gradient: 'from-amber-600 to-amber-800' },
  { name: 'Poesía', icon: Heart, count: 312, gradient: 'from-rose-600 to-rose-800' },
  { name: 'Ensayo', icon: Brain, count: 256, gradient: 'from-indigo-600 to-indigo-800' },
  { name: 'Historia', icon: Globe, count: 389, gradient: 'from-orange-600 to-orange-800' },
  { name: 'Ciencia', icon: Atom, count: 160, gradient: 'from-cyan-600 to-cyan-800' },
];

const events = [
  { date: '15 Sep', title: 'Noche de Poesía Latinoamericana', type: 'Poesía', color: 'bg-rose-100 text-rose-700', time: '7:00 PM' },
  { date: '22 Sep', title: 'Taller de Escritura Creativa', type: 'Taller', color: 'bg-indigo-100 text-indigo-700', time: '10:00 AM' },
  { date: '30 Sep', title: 'Club de Lectura: García Márquez', type: 'Club', color: 'bg-emerald-100 text-emerald-700', time: '5:00 PM' },
];

const clubs = [
  { name: 'Los Inquietos', genre: 'Novela contemporánea', members: 24, book: 'La sombra del viento', color: 'border-emerald-500', accent: 'bg-emerald-500' },
  { name: 'Versos del Alma', genre: 'Poesía', members: 18, book: 'Cantos de amor y muerte', color: 'border-rose-500', accent: 'bg-rose-500' },
  { name: 'Mentes Curiosas', genre: 'Divulgación científica', members: 31, book: 'Breve historia del tiempo', color: 'border-amber-500', accent: 'bg-amber-500' },
];

const childrenWorks = [
  { title: 'Mi Familia Feliz', author: 'Sofía, 8 años', emoji: '\u{1F31F}', color: 'from-pink-400 to-rose-400' },
  { title: 'El Dragón Azul', author: 'Mateo, 10 años', emoji: '\u{1F432}', color: 'from-blue-400 to-indigo-400' },
  { title: 'Un Día en el Espacio', author: 'Valentina, 9 años', emoji: '\u{1F680}', color: 'from-purple-400 to-violet-400' },
];

function AnimatedStat({ target, label, icon: Icon }) {
  const count = useAnimatedCounter(target, 2000);
  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 shadow-md">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <span className="text-3xl font-bold font-serif text-[#2B2118]">{count.toLocaleString()}</span>
      <span className="text-sm text-[#3A2618]/70 mt-1 font-sans">{label}</span>
    </div>
  );
}

export default function LandingPage({ onLogin, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const filteredBooks = searchQuery.trim()
    ? sampleBooks.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const fadeClass = (id, delay = 0) =>
    visibleSections.has(id)
      ? `opacity-100 translate-y-0 transition-all duration-700 ease-out delay-${delay}`
      : 'opacity-0 translate-y-8';

  return (
    <div className="min-h-screen bg-[#faf6eb] font-sans text-gray-800">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2B2118]/95 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Library className="w-8 h-8 text-[#C49A55]" />
              <span className="font-serif text-xl font-bold text-white">Biblioteca Central</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate('libros')} className="text-white/80 hover:text-[#C49A55] transition-colors text-sm font-medium">Catálogo</button>
              <button onClick={() => document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/80 hover:text-[#C49A55] transition-colors text-sm font-medium">Eventos</button>
              <button onClick={() => document.getElementById('clubes')?.scrollIntoView({ behavior: 'smooth' })} className="text-white/80 hover:text-[#C49A55] transition-colors text-sm font-medium">Clubes</button>
              <button onClick={onLogin} className="px-5 py-2 bg-[#C49A55] text-[#2B2118] font-semibold rounded-full hover:bg-[#d4b05e] transition-all duration-300 text-sm shadow-md hover:shadow-lg">Iniciar sesión</button>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2B2118] border-t border-white/10 px-4 pb-4 space-y-2">
            <button onClick={() => { onNavigate('libros'); setMobileMenuOpen(false); }} className="block w-full text-left text-white/80 hover:text-[#C49A55] py-2 text-sm">Catálogo</button>
            <button onClick={() => { document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block w-full text-left text-white/80 hover:text-[#C49A55] py-2 text-sm">Eventos</button>
            <button onClick={() => { document.getElementById('clubes')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block w-full text-left text-white/80 hover:text-[#C49A55] py-2 text-sm">Clubes</button>
            <button onClick={() => { onLogin(); setMobileMenuOpen(false); }} className="block w-full text-left px-5 py-2 bg-[#C49A55] text-[#2B2118] font-semibold rounded-full text-sm text-center mt-2">Iniciar sesión</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2B2118] via-[#3A2618] to-[#2B2118]">
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute top-20 left-10 w-32 h-32 text-[#C49A55]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M20 10 C20 10, 15 50, 20 90 M20 10 C20 10, 80 15, 85 50 C80 15, 20 10, 20 10 Z M85 50 C85 50, 20 55, 20 90 C20 55, 85 50, 85 50 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <svg className="absolute bottom-32 right-20 w-40 h-40 text-[#C49A55]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M20 10 C20 10, 15 50, 20 90 M20 10 C20 10, 80 15, 85 50 C80 15, 20 10, 20 10 Z M85 50 C85 50, 20 55, 20 90 C20 55, 85 50, 85 50 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <svg className="absolute top-1/3 right-1/4 w-20 h-20 text-[#C49A55]/50" viewBox="0 0 100 100">
            <path d="M10 90 L50 10 L90 90 Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#C49A55] rounded-full animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-[#C49A55]/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/5 w-1.5 h-1.5 bg-[#C49A55]/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#C49A55]/20 border border-[#C49A55]/30 rounded-full px-5 py-2 mb-8 animate-fadeIn">
            <BookMarked className="w-4 h-4 text-[#C49A55]" />
            <span className="text-[#C49A55] text-sm font-medium">Desde 1952 sirviendo a nuestra comunidad</span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-6 animate-fadeIn leading-tight">
            Biblioteca<br />
            <span className="text-[#C49A55]">Central</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fadeIn font-sans leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Tu puerta al conocimiento. Explora miles de libros, únete a clubes de lectura y descubre un mundo de historias.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={() => onNavigate('libros')}
              className="group flex items-center gap-2 px-8 py-4 bg-[#C49A55] text-[#2B2118] font-bold rounded-full hover:bg-[#d4b05e] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#C49A55]/20 hover:-translate-y-0.5"
            >
              Explorar catálogo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-8 py-4 border-2 border-[#C49A55]/50 text-[#C49A55] font-semibold rounded-full hover:bg-[#C49A55]/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              Iniciar sesión
            </button>
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              Registrarse
            </button>
          </div>
          <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-4 max-w-xl mx-auto">
              <Quote className="w-8 h-8 text-[#C49A55] shrink-0" />
              <p className="text-white/70 text-sm italic font-serif text-left">
                "Un lector vive mil vidas antes de morir. El que no lee, solo vive una."
                <span className="block text-[#C49A55] not-italic font-sans text-xs mt-1">— George R.R. Martin</span>
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#faf6eb] to-transparent" />
      </section>

      {/* BUSCADOR */}
      <section id="buscador" data-animate className="py-16 bg-[#faf6eb]">
        <div className="max-w-4xl mx-auto px-4">
          <div className={`text-center mb-8 ${fadeClass('buscador')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2118] mb-3">Encuentra tu próxima lectura</h2>
            <p className="text-[#3A2618]/70">Busca entre nuestra colección de más de 2,800 libros</p>
          </div>
          <div className={`relative ${fadeClass('buscador')}`} style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3A2618]/40" />
              <input
                type="text"
                placeholder="Buscar por título, autor o género..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-[#3A2618]/10 bg-white text-[#2B2118] placeholder:text-[#3A2618]/30 focus:outline-none focus:border-[#C49A55] focus:shadow-lg focus:shadow-[#C49A55]/10 transition-all duration-300 text-lg shadow-sm"
              />
            </div>
          </div>
          {filteredBooks.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#3A2618]/5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer" onClick={() => onNavigate('libros')}>
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-[#3A2618] to-[#2B2118] flex items-center justify-center text-xl shrink-0">
                    {book.emoji}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-[#2B2118] text-sm truncate">{book.title}</h4>
                    <p className="text-xs text-[#3A2618]/60 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#C49A55]/10 text-[#C49A55] font-medium">{book.genre}</span>
                      <span className={`text-xs ${book.available ? 'text-emerald-600' : 'text-red-500'}`}>
                        {book.available ? '\u{2713} Disponible' : '\u{2717} Prestado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {searchQuery.trim() && filteredBooks.length === 0 && (
            <div className="mt-6 text-center py-8 text-[#3A2618]/50">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No se encontraron resultados para "{searchQuery}"</p>
            </div>
          )}
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section id="stats" data-animate className="py-20 bg-gradient-to-br from-[#f5f0e4] to-[#faf6eb]">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-12 ${fadeClass('stats')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2118] mb-3">Números que hablan</h2>
            <p className="text-[#3A2618]/70">El impacto de nuestra comunidad lectora</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <AnimatedStat target={2847} label="Libros disponibles" icon={BookOpen} />
            <AnimatedStat target={1253} label="Usuarios activos" icon={Users} />
            <AnimatedStat target={8934} label="Préstamos realizados" icon={TrendingUp} />
            <AnimatedStat target={5} label="Clubes activos" icon={Sparkles} />
          </div>
        </div>
      </section>

      {/* LIBROS DESTACADOS */}
      <section id="destacados" data-animate className="py-20 bg-[#faf6eb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`text-center mb-12 ${fadeClass('destacados')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2118] mb-3">Libros Destacados</h2>
            <p className="text-[#3A2618]/70">Las lecturas más populares de nuestra biblioteca</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBooks.map((book, i) => (
              <div
                key={i}
                className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#3A2618]/5 ${fadeClass('destacados')}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`h-48 bg-gradient-to-br ${book.color} flex items-center justify-center relative overflow-hidden`}>
                  <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{book.emoji}</span>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span className="text-white text-xs font-medium">{book.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C49A55]/10 text-[#C49A55] font-semibold">{book.genre}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${book.available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {book.available ? 'Disponible' : 'Prestado'}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-[#2B2118] text-lg leading-tight mb-1">{book.title}</h3>
                  <p className="text-sm text-[#3A2618]/60">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`text-center mt-10 ${fadeClass('destacados')}`}>
            <button onClick={() => onNavigate('libros')} className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B2118] text-white font-semibold rounded-full hover:bg-[#3A2618] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Ver todo el catálogo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section id="categorias" data-animate className="py-20 bg-gradient-to-br from-[#f5f0e4] to-[#faf6eb]">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-12 ${fadeClass('categorias')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2118] mb-3">Categorías Populares</h2>
            <p className="text-[#3A2618]/70">Explora nuestra colección por género</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => onNavigate('libros')}
                className={`group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${fadeClass('categorias')}`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <cat.icon className="w-8 h-8 text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-serif font-bold text-white text-sm mb-1">{cat.name}</h3>
                  <p className="text-white/60 text-xs">{cat.count} libros</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" data-animate className="py-20 bg-[#2B2118]">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-12 ${fadeClass('servicios')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">Nuestros Servicios</h2>
            <p className="text-white/60">Todo lo que necesitas en un solo lugar</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Préstamo de libros', desc: 'Accede a nuestra colección con préstamo gratuito por hasta 3 semanas. Renovación en línea disponible.' },
              { icon: Monitor, title: 'Biblioteca digital', desc: 'Miles de ebooks y audiolibros disponibles 24/7 desde cualquier dispositivo.' },
              { icon: Users, title: 'Clubes de lectura', desc: 'Únete a grupos de discusión y comparte tu pasión por la lectura con otros entusiastas.' },
              { icon: Palette, title: 'Rincón creativo infantil', desc: 'Espacio dedicado para los más pequeños con talleres, cuentacuentos y actividades.' },
            ].map((service, i) => (
              <div
                key={i}
                className={`group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 ${fadeClass('servicios')}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-[#C49A55]/20 flex items-center justify-center mb-5 group-hover:bg-[#C49A55]/30 transition-colors">
                  <service.icon className="w-7 h-7 text-[#C49A55]" />
                </div>
                <h3 className="font-serif font-bold text-white text-lg mb-2">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTOS */}
      <section id="eventos" data-animate className="py-20 bg-[#faf6eb]">
        <div className="max-w-5xl mx-auto px-4">
          <div className={`text-center mb-12 ${fadeClass('eventos')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2118] mb-3">Próximos Eventos</h2>
            <p className="text-[#3A2618]/70">No te pierdas lo que tenemos preparado</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev, i) => (
              <div
                key={i}
                className={`group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-[#3A2618]/5 ${fadeClass('eventos')}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2B2118] to-[#3A2618] flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-medium opacity-70">{ev.date.split(' ')[0]}</span>
                    <span className="text-xl font-bold font-serif">{ev.date.split(' ')[1]}</span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${ev.color}`}>{ev.type}</span>
                </div>
                <h3 className="font-serif font-bold text-[#2B2118] text-lg mb-3">{ev.title}</h3>
                <div className="flex items-center gap-2 text-sm text-[#3A2618]/50">
                  <Clock className="w-4 h-4" />
                  <span>{ev.time}</span>
                </div>
                <button className="mt-4 text-[#C49A55] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Más información <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className={`text-center mt-8 ${fadeClass('eventos')}`}>
            <button className="inline-flex items-center gap-2 text-[#2B2118] font-semibold hover:text-[#C49A55] transition-colors">
              Ver todos los eventos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CLUBES DE LECTURA */}
      <section id="clubes" data-animate className="py-20 bg-gradient-to-br from-[#f5f0e4] to-[#faf6eb]">
        <div className="max-w-5xl mx-auto px-4">
          <div className={`text-center mb-12 ${fadeClass('clubes')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B2118] mb-3">Únete a Nuestros Clubes</h2>
            <p className="text-[#3A2618]/70">Comparte la experiencia de la lectura con otros</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clubs.map((club, i) => (
              <div
                key={i}
                className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-t-4 ${club.color} ${fadeClass('clubes')}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="p-6">
                  <div className={`w-12 h-12 ${club.accent} rounded-xl flex items-center justify-center mb-4`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-[#2B2118] text-xl mb-1">{club.name}</h3>
                  <p className="text-sm text-[#3A2618]/50 mb-4">{club.genre}</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#3A2618]/70">
                      <Users className="w-4 h-4" />
                      <span>{club.members} miembros</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#3A2618]/70">
                      <BookMarked className="w-4 h-4" />
                      <span className="italic">"{club.book}"</span>
                    </div>
                  </div>
                  <button className="mt-5 w-full py-2.5 border-2 border-[#2B2118]/10 text-[#2B2118] font-semibold rounded-xl hover:bg-[#2B2118] hover:text-white transition-all duration-300 text-sm">
                    Unirme al club
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RINCÓN CREATIVO */}
      <section id="rincon" data-animate className="py-20 bg-[#2B2118]">
        <div className="max-w-6xl mx-auto px-4">
          <div className={`text-center mb-12 ${fadeClass('rincon')}`}>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">Rincón Creativo Infantil</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Un espacio mágico diseñado para los más pequeños de la casa. Aquí la imaginación no tiene límites: cuentacuentos, talleres de arte, manualidades y mucho más.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {childrenWorks.map((work, i) => (
              <div
                key={i}
                className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${fadeClass('rincon')}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`h-48 bg-gradient-to-br ${work.color} flex items-center justify-center`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{work.emoji}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4">
                  <h4 className="font-serif font-bold text-white">{work.title}</h4>
                  <p className="text-white/50 text-sm">{work.author}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`text-center ${fadeClass('rincon')}`}>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#C49A55] text-[#2B2118] font-bold rounded-full hover:bg-[#d4b05e] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              <Palette className="w-5 h-5" />
              Conocer el Rincón Creativo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-[#3d2b1a] to-[#2a1f14] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Library className="w-8 h-8 text-[#C49A55]" />
                <span className="font-serif text-xl font-bold">Biblioteca Central</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Tu puerta al conocimiento desde 1952. Sirviendo a nuestra comunidad con amor por la lectura y el aprendizaje.
              </p>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Calle Principal #123, Ciudad</span>
              </div>
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#C49A55] mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2">
                {['Catálogo de libros', 'Mis préstamos', 'Clubes de lectura', 'Eventos', 'Rincón creativo'].map((link, i) => (
                  <li key={i}>
                    <button className="text-white/50 hover:text-[#C49A55] transition-colors text-sm">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#C49A55] mb-4">Servicios</h4>
              <ul className="space-y-2">
                {['Préstamo de libros', 'Biblioteca digital', 'Sala de estudio', 'Wi-Fi gratuito', 'Impresiones'].map((link, i) => (
                  <li key={i}>
                    <button className="text-white/50 hover:text-[#C49A55] transition-colors text-sm">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#C49A55] mb-4">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/50 text-sm">
                  <Phone className="w-4 h-4 text-[#C49A55]" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-white/50 text-sm">
                  <Mail className="w-4 h-4 text-[#C49A55]" />
                  <span>info@bibliotecacentral.com</span>
                </li>
                <li className="flex items-center gap-2 text-white/50 text-sm">
                  <Clock className="w-4 h-4 text-[#C49A55]" />
                  <span>Lun - Vie: 8:00 AM - 8:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">© 2026 Biblioteca Central. Todos los derechos reservados.</p>
            <p className="text-white/30 text-sm flex items-center gap-1">
              Hecho con <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> por <span className="text-[#C49A55] font-medium">Joseph Sanchez</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}