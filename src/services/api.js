const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    ...options,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error((data && data.error) || `Error HTTP ${res.status}`);
  }
  return data;
}

export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const registro = (datos) =>
  request("/auth/registro", { method: "POST", body: JSON.stringify(datos) });

export const getPerfil = () => request("/auth/perfil");

export const getUsuarios = () => request("/usuarios");

export const getUsuario = (id) => request(`/usuarios/${encodeURIComponent(id)}`);

export const createUsuario = (usuario) =>
  request("/usuarios", { method: "POST", body: JSON.stringify(usuario) });

export const updateUsuario = (id, usuario) =>
  request(`/usuarios/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(usuario),
  });

export const deleteUsuario = (id) =>
  request(`/usuarios/${encodeURIComponent(id)}`, { method: "DELETE" });

export const getLibros = () => request("/libros");

export const getLibro = (id) => request(`/libros/${encodeURIComponent(id)}`);

export const createLibro = (libro) =>
  request("/libros", { method: "POST", body: JSON.stringify(libro) });

export const updateLibro = (id, libro) =>
  request(`/libros/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(libro),
  });

export const deleteLibro = (id) =>
  request(`/libros/${encodeURIComponent(id)}`, { method: "DELETE" });

export const getPrestamos = () => request("/prestamos");

export const getMisPrestamos = () => request("/prestamos/mis");

export const getPrestamo = (id) => request(`/prestamos/${encodeURIComponent(id)}`);

export const createPrestamo = (prestamo) =>
  request("/prestamos", { method: "POST", body: JSON.stringify(prestamo) });

export const crearSolicitudPrestamo = (libroTitulo) =>
  request("/prestamos/solicitud", { method: "POST", body: JSON.stringify({ libro: libroTitulo }) });

export const aprobarPrestamo = (id) =>
  request(`/prestamos/${encodeURIComponent(id)}/aprobar`, { method: "PUT", body: JSON.stringify({}) });

export const notificarTardio = (id) =>
  request(`/prestamos/${encodeURIComponent(id)}/notificar-tardio`, { method: "PUT", body: JSON.stringify({}) });

export const deletePrestamo = (id) =>
  request(`/prestamos/${encodeURIComponent(id)}`, { method: "DELETE" });
