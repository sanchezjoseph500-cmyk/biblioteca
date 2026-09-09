import { useState } from "react";
import {
  BookOpen,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { login, registro } from "../services/api";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const DEMO_CUENTAS = [
  { rol: "Admin", email: "admin@biblioteca.com", password: "admin123", color: "from-rose-500 to-red-600" },
  { rol: "Empleado", email: "empleado@biblioteca.com", password: "empleado123", color: "from-amber-500 to-orange-600" },
  { rol: "Usuario", email: "usuario@biblioteca.com", password: "usuario123", color: "from-emerald-500 to-green-600" },
];

const ROL_INFO = {
  admin: { label: "Administrador", desc: "Acceso total al sistema" },
  empleado: { label: "Empleado", desc: "Gestiona libros y préstamos" },
  usuario: { label: "Usuario", desc: "Solicita préstamos del catálogo" },
};

function inputClass(hasError) {
  const base = "w-full rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-sm";
  if (hasError) {
    return `${base} bg-red-50/50 border-2 border-red-300 text-[#2B2118] placeholder:text-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200`;
  }
  return `${base} bg-white/80 border border-[#C9A97E] text-[#2B2118] placeholder:text-[#a89f81] focus:border-[#C49A55] focus:ring-2 focus:ring-[#C49A55]/20 focus:bg-white`;
}

export default function Login({ onLogin }) {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [errorCampos, setErrorCampos] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiarModo = () => {
    setModo(modo === "login" ? "registro" : "login");
    setErrorCampos({});
    setErrorServidor("");
  };

  const validar = () => {
    const e = {};
    if (!email.trim()) e.email = "El correo es obligatorio";
    else if (!EMAIL_REGEX.test(email.trim())) e.email = "Ingresa un correo válido";
    if (!password) e.password = "La contraseña es obligatoria";
    else if (modo === "registro" && password.length < 6) e.password = "Mínimo 6 caracteres";
    if (modo === "registro") {
      if (!nombre.trim()) e.nombre = "El nombre es obligatorio";
      else if (nombre.trim().length < 2) e.nombre = "Debe tener al menos 2 caracteres";
    }
    return e;
  };

  const handleSubmit = async () => {
    setErrorServidor("");
    const e = validar();
    setErrorCampos(e);
    if (Object.keys(e).length > 0) return;
    setCargando(true);
    try {
      if (modo === "login") {
        const data = await login(email.trim(), password);
        onLogin(data.usuario, data.token, data.refreshToken);
      } else {
        await registro({ nombre: nombre.trim(), email: email.trim(), password });
        setModo("login");
        setErrorServidor("");
        setPassword("");
        setErrorCampos({});
      }
    } catch (err) {
      const esRed = /fetch|network|conectar/i.test(err.message);
      setErrorServidor(
        esRed
          ? "No se pudo conectar con el servidor. Inicia el backend con \"npm run dev\" dentro de la carpeta biblioteca-backend."
          : err.message
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#faf6eb]">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gradient-to-br from-[#3A2618] via-[#4a3020] to-[#6B4226] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{ background: "radial-gradient(circle at 80% 20%, rgba(196,154,85,0.6) 0%, transparent 50%)" }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C49A55] to-[#B85C38] flex items-center justify-center shadow-lg shadow-black/30">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <p className="font-serif text-xl text-white">Biblioteca Central</p>
              <p className="text-[11px] text-[#d8c9a8]/80 uppercase tracking-widest">Sistema de gestión</p>
            </div>
          </div>
        </div>
        <div className="relative space-y-8">
          <h1 className="font-serif text-4xl leading-tight text-white drop-shadow-sm">
            Bienvenido a tu<br />biblioteca digital
          </h1>
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, titulo: "Roles y permisos", texto: "Admin, empleado y usuario con accesos dedicados", ring: "bg-white/10" },
              { icon: BookOpen, titulo: "Catálogo en línea", texto: "Explora y solicita libros disponibles", ring: "bg-white/10" },
              { icon: LogIn, titulo: "Acceso seguro", texto: "Sesión protegida con token JWT", ring: "bg-white/10" },
            ].map(({ icon: Icon, titulo, texto }, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#C49A55]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{titulo}</p>
                  <p className="text-xs text-[#d8c9a8]/70">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative font-serif italic text-[#C49A55]/90 text-sm">
          "Un lector vive mil vidas antes de morir" — George R.R. Martin
        </p>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/10 to-transparent blur-3xl pointer-events-none" />
        <div className="w-full max-w-md animate-fadeIn">
          <div className="bg-gradient-to-b from-[#FFF8E7] to-[#F4E8D0] rounded-3xl border border-[#C49A55]/60 shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#C49A55] via-[#B85C38] to-[#C49A55]" />
            <div className="px-8 py-8">
              <div className="lg:hidden flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <BookOpen size={20} className="text-white" />
                </div>
                <p className="font-serif text-lg text-[#2B2118]">Biblioteca Central</p>
              </div>

              <h2 className="font-serif text-2xl text-[#2B2118]">
                {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </h2>
              <p className="text-sm text-[#6f6a55] mt-1 mb-6">
                {modo === "login"
                  ? "Ingresa tus credenciales para continuar"
                  : "Regístrate como usuario de la biblioteca"}
              </p>

              {modo === "registro" && (
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#6f6a55] mb-1.5 font-semibold">
                    <User size={13} className="text-amber-600" /> Nombre completo <span className="text-red-500 text-[10px]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María López"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    maxLength={80}
                    className={inputClass(errorCampos.nombre)}
                  />
                  {errorCampos.nombre && (
                    <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium"><AlertCircle size={12} />{errorCampos.nombre}</p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#6f6a55] mb-1.5 font-semibold">
                  <Mail size={13} className="text-amber-600" /> Correo electrónico <span className="text-red-500 text-[10px]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Ej: maria@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  maxLength={100}
                  className={inputClass(errorCampos.email)}
                />
                {errorCampos.email && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium"><AlertCircle size={12} />{errorCampos.email}</p>
                )}
              </div>

              <div className="mb-2">
                <label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#6f6a55] mb-1.5 font-semibold">
                  <Lock size={13} className="text-amber-600" /> Contraseña <span className="text-red-500 text-[10px]">*</span>
                </label>
                <input
                  type="password"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  maxLength={72}
                  className={inputClass(errorCampos.password)}
                />
                {errorCampos.password && (
                  <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium"><AlertCircle size={12} />{errorCampos.password}</p>
                )}
              </div>

              {errorServidor && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 animate-fadeIn">
                  <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 font-medium leading-relaxed">{errorServidor}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={cargando}
                className={`w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] shadow-lg ${cargando ? "opacity-60 cursor-not-allowed bg-[#6B4226] text-white" : "cursor-pointer bg-gradient-to-r from-[#B85C38] to-[#a9502f] text-white hover:from-[#c96a43] hover:to-[#b85c38] shadow-[#B85C38]/30"}`}
              >
                {cargando ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {modo === "login" ? "Verificando..." : "Creando cuenta..."}
                  </>
                ) : modo === "login" ? (
                  <>
                    <LogIn size={16} /> Iniciar sesión
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Crear cuenta
                  </>
                )}
              </button>

              <p className="text-center text-sm text-[#6f6a55] mt-4">
                {modo === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
                <button onClick={cambiarModo} className="font-bold text-emerald-700 hover:text-emerald-600 cursor-pointer transition-colors">
                  {modo === "login" ? "Regístrate" : "Inicia sesión"}
                </button>
              </p>

              {modo === "login" && (
                <div className="mt-7 pt-5 border-t border-[#C9A97E]/60">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a8368] font-bold mb-3 text-center">Cuentas de prueba</p>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_CUENTAS.map((cuenta) => (
                      <button
                        key={cuenta.rol}
                        onClick={() => { setEmail(cuenta.email); setPassword(cuenta.password); setErrorCampos({}); setErrorServidor(""); }}
                        className="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-[#C9A97E]/60 bg-white/60 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 cursor-pointer"
                      >
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cuenta.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                          <ShieldCheck size={14} className="text-white" />
                        </div>
                        <span className="text-[10px] font-bold text-[#4a4738]">{cuenta.rol}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-[10px] text-[#a89f81] mt-3">Clic para autocompletar las credenciales</p>
                </div>
              )}

              {modo === "login" && (
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  {Object.entries(ROL_INFO).map(([rol, info]) => (
                    <div key={rol} className="rounded-xl bg-white/50 border border-[#C9A97E]/40 px-2 py-2">
                      <p className="text-[9px] font-black uppercase tracking-wider text-amber-700">{info.label}</p>
                      <p className="text-[9px] text-[#8a8368] leading-tight mt-0.5">{info.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-xs text-amber-700/70 mt-6">Hecho por <span className="font-semibold text-amber-800">Joseph Sanchez</span></p>
        </div>
      </div>
    </div>
  );
}
