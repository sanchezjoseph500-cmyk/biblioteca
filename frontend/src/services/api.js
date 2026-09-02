const BASE_URL = import.meta.env.VITE_API_URL || "/api";

let refreshPromise = null;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tryRefresh() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sesión expirada");
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function request(path, options = {}) {
  let res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    ...options,
  });

  if (res.status === 401 && path !== "/auth/login" && path !== "/auth/refresh") {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...authHeaders() },
        ...options,
      });
    }
  }

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

export const logout = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const token = localStorage.getItem("token");
  if (refreshToken && token) {
    fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("usuario");
};

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
