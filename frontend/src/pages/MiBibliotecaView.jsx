import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import PatternBg from '../components/PatternBg';
import RolBadge from '../components/RolBadge';
import EstadoBadge from '../components/EstadoBadge';
import {
  BookOpen, BookMarked, Heart, Calendar, Clock, Award, Users,
  ChevronRight, Edit3, X, Check, Bookmark,
  Library, MessageSquare, ArrowUpRight, CalendarDays,
  History, UserCheck, BookA, Timer, Trash2
} from 'lucide-react';

export default function MiBibliotecaView({ user, libros: _libros, misPrestamos, addToast }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [favorites, setFavorites] = useState([
    { id: 1, title: 'El Principito', author: 'Antoine de Saint-Exupéry', cover: null, genre: 'Clásico' },
    { id: 2, title: 'Cien años de soledad', author: 'Gabriel García Márquez', cover: null, genre: 'Realismo mágico' },
    { id: 3, title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', cover: null, genre: 'Clásico' },
    { id: 4, title: 'La sombra del viento', author: 'Carlos Ruiz Zafón', cover: null, genre: 'Misterio' },
  ]);
  const [savedBooks, setSavedBooks] = useState([
    { id: 11, title: 'Fahrenheit 451', author: 'Ray Bradbury', cover: null },
    { id: 12, title: 'Rebelión en la granja', author: 'George Orwell', cover: null },
    { id: 13, title: 'Matar a un ruiseñor', author: 'Harper Lee', cover: null },
  ]);

  const activos = misPrestamos?.filter(p => p.estado === 'Activo' || p.estado === 'Pendiente') || [];
  const historial = misPrestamos?.filter(p => p.estado === 'Devuelto' || p.estado === 'Vencido') || [];

  const clubs = [
    { id: 1, name: 'Club de Clásicos', genre: 'Literatura Clásica', nextMeeting: '2026-09-15', members: 12 },
    { id: 2, name: 'Lecturas del Viernes', genre: 'Ficción Contemporánea', nextMeeting: '2026-09-12', members: 8 },
  ];

  const badges = [
    { id: 1, name: 'Primer préstamo', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700' },
    { id: 2, name: 'Lector ávido', icon: BookMarked, color: 'bg-amber-100 text-amber-700' },
    { id: 3, name: 'Miembro activo', icon: UserCheck, color: 'bg-blue-100 text-blue-700' },
    { id: 4, name: 'Reseñador', icon: MessageSquare, color: 'bg-purple-100 text-purple-700' },
    { id: 5, name: 'Clásicos leídos', icon: BookA, color: 'bg-rose-100 text-rose-700' },
  ];

  const activities = [
    { id: 1, icon: BookOpen, text: 'Tomaste prestado "El Alquimista"', time: 'Hace 2 días', color: 'text-emerald-600 bg-emerald-100' },
    { id: 2, icon: Users, text: 'Te uniste al Club de Clásicos', time: 'Hace 1 semana', color: 'text-blue-600 bg-blue-100' },
    { id: 3, icon: Award, text: 'Obtuviste la insignia "Lector ávido"', time: 'Hace 2 semanas', color: 'text-amber-600 bg-amber-100' },
    { id: 4, icon: MessageSquare, text: 'Publicaste una reseña en "La casa de los espíritus"', time: 'Hace 3 semanas', color: 'text-purple-600 bg-purple-100' },
  ];

  const progressBooks = [
    { title: 'El Alquimista', author: 'Paulo Coelho', progress: 65, pages: '163 de 250' },
    { title: 'Rayuela', author: 'Julio Cortázar', progress: 30, pages: '96 de 320' },
    { title: 'Pedro Páramo', author: 'Juan Rulfo', progress: 85, pages: '85 de 100' },
  ];

  const dateOptions = { year: 'numeric', month: 'long' };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sin fecha';
    return new Date(dateStr).toLocaleDateString('es-ES', dateOptions);
  };

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return 0;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSaveProfile = () => {
    setEditModalOpen(false);
    addToast?.({ message: 'Perfil actualizado correctamente', type: 'success' });
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    addToast?.({ message: 'Libro eliminado de favoritos', type: 'info' });
  };

  const removeSaved = (id) => {
    setSavedBooks(prev => prev.filter(s => s.id !== id));
    addToast?.({ message: 'Libro eliminado de guardados', type: 'info' });
  };

  const avatarGradients = [
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-yellow-600',
    'from-green-600 to-emerald-700',
    'from-yellow-500 to-amber-600',
    'from-teal-500 to-green-600',
  ];

  return (
    <div className="min-h-screen bg-[#faf6eb] relative">
      <PatternBg />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Profile Header Card */}
        <section className="animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#C49A55]/20 shadow-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#2B2118] via-[#3A2618] to-[#2B2118] relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a24c' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#faf6eb]/20" />
            </div>

            <div className="px-8 pb-8 -mt-16 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${avatarGradients[0]} flex items-center justify-center text-white text-4xl font-serif font-bold shadow-xl border-4 border-[#faf6eb]`}>
                  {getInitials(user?.name)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-3xl font-serif font-bold text-[#2B2118]">
                      {user?.name || 'Usuario'}
                    </h1>
                    <RolBadge rol={user?.rol || 'Miembro'} />
                  </div>
                  <p className="text-[#2B2118]/60">{user?.email || 'usuario@email.com'}</p>
                  <p className="text-sm text-[#2B2118]/40 flex items-center gap-1">
                    <Calendar size={14} />
                    Miembro desde {formatDate(user?.fechaRegistro || '2024-01-15')}
                  </p>
                  <p className="text-xs font-serif text-[#C49A55] italic">Mi biblioteca personal</p>
                </div>
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#2B2118]/5 hover:bg-[#2B2118]/10 text-[#2B2118] rounded-lg border border-[#2B2118]/10 transition-all duration-200 text-sm"
                >
                  <Edit3 size={14} />
                  Editar perfil
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, count: activos.length, label: 'Libros prestados actualmente', accent: 'border-emerald-500', iconBg: 'bg-emerald-100 text-emerald-600' },
              { icon: History, count: historial.length, label: 'Préstamos históricos', accent: 'border-amber-500', iconBg: 'bg-amber-100 text-amber-600' },
              { icon: Users, count: 2, label: 'Clubes de lectura', accent: 'border-blue-500', iconBg: 'bg-blue-100 text-blue-600' },
              { icon: Award, count: 5, label: 'Insignias obtenidas', accent: 'border-purple-500', iconBg: 'bg-purple-100 text-purple-600' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-white/80 backdrop-blur-sm rounded-xl border-t-4 ${stat.accent} shadow-md p-5 hover:shadow-lg transition-shadow duration-200`}
              >
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center mb-3`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-3xl font-serif font-bold text-[#2B2118]">{stat.count}</p>
                <p className="text-sm text-[#2B2118]/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Currently Borrowed Books */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <SectionHeader
            icon={BookOpen}
            title="Libros Prestados Actualmente"
            subtitle="Libros que tienes en tu posesión"
          />
          {activos.length === 0 ? (
            <div className="bg-white/60 rounded-xl border border-dashed border-[#C49A55]/30 p-10 text-center">
              <BookOpen className="mx-auto text-[#2B2118]/20 mb-3" size={48} />
              <p className="text-[#2B2118]/40 font-serif text-lg">No tienes libros prestados actualmente</p>
              <p className="text-[#2B2118]/30 text-sm mt-1">Explora el catálogo para encontrar tu próxima lectura</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activos.map((prestamo, i) => {
                const daysUntil = getDaysUntil(prestamo.fechaDevolucion);
                return (
                  <div
                    key={prestamo.id || i}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C49A55]/15 shadow-md p-5 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-[#2B2118] text-lg leading-tight">
                          {prestamo.tituloLibro || prestamo.libro?.titulo || 'Libro sin título'}
                        </h3>
                        <p className="text-[#2B2118]/50 text-sm mt-1">
                          {prestamo.autorLibro || prestamo.libro?.autor || ''}
                        </p>
                      </div>
                      <EstadoBadge estado={prestamo.estado} />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-[#2B2118]/60">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Prestado: {formatDate(prestamo.fechaPrestamo)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#2B2118]/60">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          Devolver: {formatDate(prestamo.fechaDevolucion)}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                        daysUntil <= 0 ? 'bg-red-50 text-red-700' :
                        daysUntil <= 3 ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        <Timer size={14} />
                        {daysUntil <= 0
                          ? `Vencido hace ${Math.abs(daysUntil)} día(s)`
                          : `${daysUntil} día(s) restante(s)`
                        }
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Reading Progress */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <SectionHeader
            icon={TrendingUp}
            title="Progreso de Lectura"
            subtitle="Sigue tu avance en cada libro"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {progressBooks.map((book, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C49A55]/15 shadow-md p-5 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif font-bold text-[#2B2118]">{book.title}</h3>
                    <p className="text-[#2B2118]/50 text-sm">{book.author}</p>
                  </div>
                  <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    <BookOpen size={12} />
                    Libro actual
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-[#f5f0e4] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2B2118] to-[#3A2618] transition-all duration-700 ease-out"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#2B2118]/50">{book.pages}</span>
                    <span className="font-serif font-bold text-[#2B2118]">{book.progress}%</span>
                  </div>
                  <p className="text-xs text-[#2B2118]/40">
                    Est. completado: {Math.ceil((100 - book.progress) / 5)} días
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historial de Préstamos */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <SectionHeader
            icon={History}
            title="Historial de Préstamos"
            subtitle="Todos tus préstamos anteriores"
          />
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C49A55]/15 shadow-md overflow-hidden">
            {historial.length === 0 ? (
              <div className="p-10 text-center">
                <History className="mx-auto text-[#2B2118]/20 mb-3" size={48} />
                <p className="text-[#2B2118]/40 font-serif text-lg">No hay historial de préstamos aún</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f5f0e4]">
                {historial.map((prestamo, i) => (
                  <div
                    key={prestamo.id || i}
                    className="flex items-center gap-4 p-4 hover:bg-[#f5f0e4]/30 transition-colors duration-150"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      prestamo.estado === 'Devuelto' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {prestamo.estado === 'Devuelto' ? <Check size={20} /> : <Clock size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-medium text-[#2B2118] truncate">
                        {prestamo.tituloLibro || prestamo.libro?.titulo || 'Libro'}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-[#2B2118]/50 mt-0.5">
                        <span>Prestado: {formatDate(prestamo.fechaPrestamo)}</span>
                        <span>·</span>
                        <span>Devuelto: {formatDate(prestamo.fechaDevolucionReal || prestamo.fechaDevolucion)}</span>
                      </div>
                    </div>
                    <EstadoBadge estado={prestamo.estado} />
                    {prestamo.estado === 'Devuelto' && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
                        <Check size={12} />
                        A tiempo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Libros Favoritos */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <SectionHeader
            icon={Heart}
            title="Libros Favoritos"
            subtitle="Tus lecturas más queridas"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {favorites.map((book) => (
              <div
                key={book.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C49A55]/15 shadow-md p-5 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-[#2B2118] to-[#3A2618] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-white p-3">
                    <BookOpen className="mx-auto mb-2 opacity-60" size={28} />
                    <p className="font-serif text-sm font-bold leading-tight">{book.title}</p>
                  </div>
                  <Heart className="absolute top-2 right-2 text-rose-500 fill-rose-500" size={16} />
                </div>
                <h3 className="font-serif font-bold text-[#2B2118] text-sm truncate">{book.title}</h3>
                <p className="text-[#2B2118]/50 text-xs mt-0.5">{book.author}</p>
                <span className="inline-block mt-2 text-[10px] bg-[#faf6eb] text-[#2B2118]/50 px-2 py-0.5 rounded-full border border-[#C49A55]/20">
                  {book.genre}
                </span>
                <button
                  onClick={() => removeFavorite(book.id)}
                  className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-[#2B2118]/40 hover:text-rose-500 py-1.5 rounded-lg hover:bg-rose-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                  Quitar de favoritos
                </button>
              </div>
            ))}
          </div>

          {/* Guardar para después */}
          <div className="mt-6">
            <h3 className="font-serif text-lg font-bold text-[#2B2118] mb-4 flex items-center gap-2">
              <Bookmark size={18} className="text-[#C49A55]" />
              Guardar para después
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {savedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white/60 rounded-xl border border-dashed border-[#C49A55]/30 p-4 hover:bg-white/80 transition-all duration-200 group flex items-center gap-4"
                >
                  <div className="w-12 h-16 bg-gradient-to-br from-[#2B2118]/80 to-[#3A2618]/80 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-white/60" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-[#2B2118] text-sm truncate">{book.title}</p>
                    <p className="text-[#2B2118]/50 text-xs">{book.author}</p>
                  </div>
                  <button
                    onClick={() => removeSaved(book.id)}
                    className="text-[#2B2118]/30 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Eliminar"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clubes de Lectura */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <SectionHeader
            icon={Users}
            title="Clubes de Lectura"
            subtitle="Tus comunidades lectoras"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clubs.map((club) => (
              <div
                key={club.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C49A55]/15 shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-2 bg-gradient-to-r from-[#2B2118] via-[#3A2618] to-[#C49A55]" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#2B2118] to-[#3A2618] rounded-xl flex items-center justify-center">
                        <Library className="text-[#C49A55]" size={24} />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-[#2B2118] text-lg">{club.name}</h3>
                        <p className="text-[#2B2118]/50 text-sm">{club.genre}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-[#2B2118]/60">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} />
                      {formatDate(club.nextMeeting)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      {club.members} miembros
                    </span>
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-[#2B2118]/5 hover:bg-[#2B2118]/10 text-[#2B2118] rounded-lg text-sm font-medium transition-colors duration-200">
                    Ver detalles
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actividad Reciente */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.7s' }}>
          <SectionHeader
            icon={Zap}
            title="Actividad Reciente"
            subtitle="Tus últimas acciones en la biblioteca"
          />
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C49A55]/15 shadow-md p-6">
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#2B2118]/20 via-[#C49A55]/20 to-transparent" />
              <div className="space-y-6">
                {activities.map((activity, _i) => (
                  <div key={activity.id} className="relative flex items-start gap-4 pl-2">
                    <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                      <activity.icon size={16} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[#2B2118] text-sm">{activity.text}</p>
                      <p className="text-[#2B2118]/40 text-xs mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Insignias Recientes */}
        <section className="animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <SectionHeader
            icon={Award}
            title="Insignias Recientes"
            subtitle="Reconocimientos por tu actividad"
          />
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#C49A55]/15 shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div />
              <button className="text-sm text-[#C49A55] hover:text-[#2B2118] font-medium flex items-center gap-1 transition-colors duration-200">
                Ver todas
                <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {badges.map((badge) => {
                const IconComp = badge.icon;
                return (
                  <div key={badge.id} className="text-center group cursor-default">
                    <div className={`w-16 h-16 rounded-2xl ${badge.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <IconComp size={28} />
                    </div>
                    <p className="text-xs font-medium text-[#2B2118]/70 group-hover:text-[#2B2118] transition-colors duration-200">
                      {badge.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#C49A55]/20 w-full max-w-md p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-[#2B2118]">Editar Perfil</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 hover:bg-[#f5f0e4] rounded-lg transition-colors duration-200"
              >
                <X size={20} className="text-[#2B2118]/50" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2B2118]/70 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf6eb] border border-[#C49A55]/20 rounded-lg text-[#2B2118] focus:outline-none focus:ring-2 focus:ring-[#C49A55]/40 transition-all duration-200"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B2118]/70 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf6eb] border border-[#C49A55]/20 rounded-lg text-[#2B2118] focus:outline-none focus:ring-2 focus:ring-[#C49A55]/40 transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="flex-1 py-2.5 border border-[#2B2118]/10 text-[#2B2118] rounded-lg hover:bg-[#f5f0e4] transition-colors duration-200 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2.5 bg-[#2B2118] text-white rounded-lg hover:bg-[#3A2618] transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Check size={14} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
