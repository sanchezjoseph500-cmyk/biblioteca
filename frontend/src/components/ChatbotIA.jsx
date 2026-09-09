import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Sparkles, MessageCircle, User as UserIcon, RefreshCw } from "lucide-react";

const SUGERENCIAS = [
  "¿Cómo solicito un préstamo?",
  "¿Qué libros tengo prestados?",
  "Recomiéndame algo para leer",
  "¿Cuáles son mis insignias?",
  "¿Cómo funcionan los clubes de lectura?",
];

function generarRespuesta(mensaje, user, misPrestamos, libros) {
  const m = mensaje.toLowerCase();
  const nombre = user?.nombre?.split(" ")[0] || "lector";

  const contextos = [];
  if (user?.rol) contextos.push(`rol: ${user.rol}`);

  // Préstamos del usuario
  if (misPrestamos && misPrestamos.length) {
    const activos = misPrestamos.filter((p) => p.estado === "Activo" || p.estado === "Prestado");
    if (activos.length) {
      const titulos = libros
        ?.filter((l) => activos.some((a) => a.libro_id === l.id))
        .map((l) => l.titulo)
        .join(", ");
      if (titulos) contextos.push(`tienes ${activos.length} préstamo(s) activo(s)`);
    }
  }

  if (m.includes("hola") || m === "hola" || m.includes("buenos días") || m.includes("buenas") || m.includes("saludos")) {
    return `¡Hola, ${nombre}! 😊 Soy tu asistente de la Biblioteca Central. Puedo ayudarte con préstamos, catálogo, clubes de lectura, insignias, eventos y más. ¿En qué te ayudo hoy?`;
  }

  if (m.includes("préstamo") || m.includes("prestamo") || m.includes("solicitar") || m.includes("pedir")) {
    if (m.includes("tengo") || m.includes("mis") || m.includes("cuántos") || m.includes("activo")) {
      if (misPrestamos && misPrestamos.length) {
        const activos = misPrestamos.filter((p) => ["Activo", "Prestado"].includes(p.estado));
        if (activos.length) {
          return `Tienes ${activos.length} préstamo(s) activo(s) en tu cuenta. Puedes revisar "Mis préstamos" para ver las fechas de devolución. ¡No olvides devolverlos a tiempo! 📚`;
        }
        return `Actualmente no tienes préstamos activos. Puedes buscar un libro en el catálogo y solicitar el préstamo desde allí. ¡Aprovecha tu lectura! 📖`;
      }
      return `Para ver tus préstamos activos, dirígete a la sección "Mis préstamos" en el menú lateral.`;
    }
    return `Para solicitar un préstamo: busca el libro en el catálogo y pulsa el botón "Solicitar préstamo". Si el libro está disponible, tu solicitud se procesará de inmediato; si está prestado, podrás reservarlo. Si eres empleado o admin, también puedes gestionar préstamos desde la sección "Préstamos". 📚`;
  }

  if (m.includes("recomienda") || m.includes("recomiéndame") || m.includes("recomiend") || m.includes("qué leer") || m.includes("que leer") || m.includes("sugiere")) {
    const genero = ["acción", "aventura", "fantasía", "ciencia ficción", "romance", "misterio", "terror"].find((g) => m.includes(g));
    if (genero) return `¡Claro! Para el género de ${genero}, te recomiendo explorar la sección "Cómics y Manga" y el catálogo general, donde encontrarás varias joyas. También puedes revisar "Mi biblioteca" para ver tu historial y gustos. Si quieres, en "Clubes de lectura" encontrarás lecturas grupales del mes. 🎯`;
    return `¡Con gusto, ${nombre}! Te sugiero revisar la sección "Cómics y Manga" para algo visual y ágil, o el catálogo general para literatura clásica y contemporánea. También puedes inspirarte en los "Clubes de lectura" y los libros más populares. ¿Prefieres algún género en particular? 🎯`;
  }

  if (m.includes("insignia") || m.includes("logro") || m.includes("award") || m.includes("trofeo")) {
    return `Las insignias son logros que obtienes por tu actividad en la biblioteca: primeros préstamos, títulos leídos, participación en eventos y más. Puedes ver tu progreso en la sección "Insignias". ¡Sigue leyendo para desbloquearlas todas! 🏅`;
  }

  if (m.includes("club") || m.includes("clube")) {
    return `Los clubes de lectura son grupos donde debatimos libros con periodicidad. Puedes unirte a uno desde la sección "Clubes de lectura", ver las próximas reuniones y participar en las discusiones. ¡Es la mejor forma de compartir tu amor por los libros! 📖🤝`;
  }

  if (m.includes("evento") || m.includes("actividad") || m.includes("taller")) {
    return `En la sección "Eventos" encontrarás los próximos eventos, talleres y actividades de la biblioteca: presentaciones, cuentacuentos, ferias del libro y más. ¡Revisa el calendario y reserva tu lugar! 🗓️`;
  }

  if (m.includes("horario") || m.includes("hora") || m.includes("abierto") || m.includes("abren") || m.includes("cierra")) {
    return `La Biblioteca Central abre de lunes a viernes de 8:00 a 20:00 h y los sábados de 9:00 a 14:00 h. Los domingos y festivos permanece cerrada. ¿Necesitas algo más? ⏰`;
  }

  if (m.includes("devolver") || m.includes("devolución") || m.includes("devolucion")) {
    return `Puedes devolver los libros prestados en el mostrador de la biblioteca o en los puntos de devolución. Consulta "Mis préstamos" para ver las fechas de devolución de cada libro. 📚`;
  }

  if (m.includes("multa") || m.includes("sanción") || m.includes("sancion") || m.includes("pago") || m.includes("recargo")) {
    return `Las multas por retraso se calculan automáticamente. Puedes revisar y pagar tus recargos en la sección "Pagos" si eres usuario. Si tienes dudas sobre un cargo, contacta al personal de la biblioteca. 💳`;
  }

  if (m.includes("manga") || m.includes("cómic") || m.includes("comic") || m.includes("historieta")) {
    return `¡Tenemos una sección especial dedicada a Cómics y Manga! Encontrarás manga japonés, cómics de superhéroes, manhwa y novelas gráficas con filtros por género, formato y disponibilidad. ¡Está en el menú, búscala como "Cómics y Manga"! 🦸📚`;
  }

  if (m.includes("gracias") || m.includes("genial") || m.includes("perfecto")) {
    return `¡De nada, ${nombre}! Estoy aquí para ayudarte. No dudes en preguntarme cualquier cosa sobre la biblioteca. ¡Feliz lectura! 😊`;
  }

  if (m.includes(" quién eres") || m.includes("quien eres") || m.includes("qué eres") || m.includes("que eres") || m.includes("asistente") || m.includes("bot")) {
    return `Soy "Biblioteca IA", tu asistente virtual de la Biblioteca Central. Estoy aquí para ayudarte con préstamos, catálogo, clubes, eventos, insignias y mucho más, adaptándome a tu rol y actividad. 🤖📚`;
  }

  return `Entiendo tu pregunta sobre "${mensaje}". Para ayudarte mejor, te recomiendo revisar las secciones disponibles o preguntarme por: préstamos, catálogo, cómics y manga, clubes de lectura, eventos, insignias, horarios o pagos. ¿Sobre cuál de estos temas te gustaría más detalle? 🤖`;
}

export default function ChatbotIA({ user, misPrestamos, libros }) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [entrada, setEntrada] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const finRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    setMensajes([
      {
        autor: "bot",
        texto: `¡Hola, ${user?.nombre?.split(" ")[0] || "lector"}! 👋 Soy Biblioteca IA. Puedo ayudarte a encontrar libros, gestionar préstamos, o informarte sobre clubes y eventos. ¿En qué te ayudo hoy?`,
      },
    ]);
  }, [abierto, user]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo]);

  const enviarMensaje = (texto) => {
    const limpio = (texto || entrada).trim();
    if (!limpio || escribiendo) return;
    setEntrada("");
    setMensajes((prev) => [...prev, { autor: "user", texto: limpio }]);
    setEscribiendo(true);
    setTimeout(() => {
      const respuesta = generarRespuesta(limpio, user, misPrestamos, libros);
      setMensajes((prev) => [...prev, { autor: "bot", texto: respuesta }]);
      setEscribiendo(false);
    }, 700);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(!abierto)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer ${abierto ? "bg-[#B85C38] rotate-0" : "bg-gradient-to-br from-[#C49A55] to-[#B85C38] hover:scale-105"} shadow-[#B85C38]/40`}
        title="Asistente Biblioteca IA"
      >
        {abierto ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
        {!abierto && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#657153] border-2 border-[#FFF8E7] animate-pulse-dot" />}
      </button>

      {/* Panel de chat */}
      {abierto && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-gradient-to-b from-[#FFF8E7] to-[#F4E8D0] rounded-3xl border border-[#C49A55]/60 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Cabecera */}
          <div className="bg-gradient-to-r from-[#3A2618] via-[#4a3020] to-[#6B4226] px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C49A55] to-[#B85C38] flex items-center justify-center shrink-0 shadow-md">
              <Bot size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-white font-bold leading-tight">Biblioteca IA</p>
              <p className="text-[11px] text-[#d8c9a8] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#657153] inline-block" /> En línea · asistente virtual
              </p>
            </div>
            <button onClick={() => setAbierto(false)} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 text-[#d8c9a8] cursor-pointer">
              <X size={17} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto max-h-[50vh]">
            {mensajes.map((msg, i) => (
              <div key={i} className={`flex ${msg.autor === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.autor === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${msg.autor === "bot" ? "bg-gradient-to-br from-[#C49A55] to-[#B85C38]" : "bg-gradient-to-br from-[#657153] to-[#3A2618]"}`}>
                    {msg.autor === "bot" ? <Bot size={14} className="text-white" /> : <UserIcon size={14} className="text-white" />}
                  </div>
                  <div className={`px-3.5 py-2.5 text-sm rounded-2xl leading-relaxed ${msg.autor === "bot" ? "bg-white/80 border border-[#C49A55]/30 text-[#2B2118] rounded-tl-sm" : "bg-gradient-to-r from-[#B85C38] to-[#a9502f] text-white rounded-tr-sm"}`}>
                    {msg.texto}
                  </div>
                </div>
              </div>
            ))}
            {escribiendo && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg shrink-0 bg-gradient-to-br from-[#C49A55] to-[#B85C38] flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="px-4 py-3 bg-white/80 border border-[#C49A55]/30 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#B85C38] animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={finRef} />
          </div>

          {/* Sugerencias */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGERENCIAS.slice(0, 4).map((s, i) => (
              <button
                key={i}
                onClick={() => enviarMensaje(s)}
                disabled={escribiendo}
                className="text-[11px] px-2.5 py-1.5 rounded-full bg-[#C49A55]/10 border border-[#C49A55]/30 text-[#6B4226] hover:bg-[#C49A55]/20 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                <Sparkles size={10} /> {s}
              </button>
            ))}
          </div>

          {/* Entrada */}
          <div className="p-3 border-t border-[#C49A55]/30 flex items-center gap-2">
            <input
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#C49A55]/40 bg-white/80 text-sm text-[#2B2118] placeholder-[#6B4226]/40 focus:outline-none focus:ring-2 focus:ring-[#C49A55]/50 transition-all"
            />
            <button
              onClick={() => enviarMensaje()}
              disabled={!entrada.trim() || escribiendo}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#C49A55] to-[#B85C38] text-white flex items-center justify-center hover:opacity-90 transition-all cursor-pointer disabled:opacity-40 shrink-0 shadow-md shadow-[#B85C38]/30"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
