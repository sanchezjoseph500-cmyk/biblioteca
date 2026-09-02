const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s'-]{2,}$/;

function trim(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateLogin(req, res, next) {
  const errors = {};
  const email = trim(req.body.email);
  if (!email) errors.email = "El correo es obligatorio";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Ingresa un correo válido";

  if (!req.body.password) errors.password = "La contraseña es obligatoria";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: Object.values(errors)[0] });
  }
  next();
}

export function validateRegistro(req, res, next) {
  const errors = {};
  const nombre = trim(req.body.nombre);
  const email = trim(req.body.email);

  if (!nombre) errors.nombre = "El nombre es obligatorio";
  else if (nombre.length < 2) errors.nombre = "El nombre debe tener al menos 2 caracteres";
  else if (nombre.length > 80) errors.nombre = "El nombre no puede exceder 80 caracteres";
  else if (!NAME_REGEX.test(nombre)) errors.nombre = "El nombre solo puede contener letras, espacios, apóstrofes y guiones";

  if (!email) errors.email = "El correo es obligatorio";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Ingresa un correo válido";

  if (!req.body.password) errors.password = "La contraseña es obligatoria";
  else if (req.body.password.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: Object.values(errors)[0] });
  }
  next();
}

export function validateUsuario(req, res, next) {
  const errors = {};
  const isUpdate = req.method === "PUT";

  if (!isUpdate || req.body.nombre !== undefined) {
    const nombre = trim(req.body.nombre);
    if (!nombre) errors.nombre = "El nombre es obligatorio";
    else if (nombre.length < 2) errors.nombre = "El nombre debe tener al menos 2 caracteres";
    else if (nombre.length > 80) errors.nombre = "El nombre no puede exceder 80 caracteres";
    else if (!NAME_REGEX.test(nombre)) errors.nombre = "El nombre solo puede contener letras, espacios, apóstrofes y guiones";
  }

  if (!isUpdate || req.body.email !== undefined) {
    const email = trim(req.body.email);
    if (!email) errors.email = "El correo es obligatorio";
    else if (!EMAIL_REGEX.test(email)) errors.email = "Ingresa un correo válido";
  }

  if (!isUpdate || req.body.rol !== undefined) {
    if (!req.body.rol) errors.rol = "El rol es obligatorio";
    else if (!["admin", "empleado", "usuario"].includes(req.body.rol)) errors.rol = "Rol no válido";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: Object.values(errors)[0] });
  }
  next();
}

export function validateLibro(req, res, next) {
  const errors = {};
  const isUpdate = req.method === "PUT";

  if (!isUpdate || req.body.titulo !== undefined) {
    const titulo = trim(req.body.titulo);
    if (!titulo) errors.titulo = "El título es obligatorio";
    else if (titulo.length < 2) errors.titulo = "El título debe tener al menos 2 caracteres";
    else if (titulo.length > 100) errors.titulo = "El título no puede exceder 100 caracteres";
  }

  if (!isUpdate || req.body.autor !== undefined) {
    const autor = trim(req.body.autor);
    if (!autor) errors.autor = "El autor es obligatorio";
    else if (autor.length < 2) errors.autor = "El autor debe tener al menos 2 caracteres";
    else if (autor.length > 80) errors.autor = "El autor no puede exceder 80 caracteres";
  }

  if (!isUpdate || req.body.genero !== undefined) {
    if (!req.body.genero) errors.genero = "El género es obligatorio";
    else if (!["Novela", "Cuento", "Poesía", "Ensayo", "Historia", "Ciencia"].includes(req.body.genero)) errors.genero = "Selecciona un género válido";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: Object.values(errors)[0] });
  }
  next();
}

export function validatePrestamo(req, res, next) {
  const errors = {};
  if (!req.body.libro || !trim(req.body.libro)) errors.libro = "El libro es obligatorio";
  if (!req.body.usuario || !trim(req.body.usuario)) errors.usuario = "El usuario es obligatorio";
  if (!req.body.prestamo || !trim(req.body.prestamo)) errors.prestamo = "La fecha de préstamo es obligatoria";
  if (!req.body.vence || !trim(req.body.vence)) errors.vence = "La fecha de vencimiento es obligatoria";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: Object.values(errors)[0] });
  }
  next();
}
