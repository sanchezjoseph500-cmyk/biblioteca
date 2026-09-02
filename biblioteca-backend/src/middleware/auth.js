import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "biblioteca_central_secret_2024";
const JWT_EXPIRES = "15m";
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;
const REFRESH_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 días

export function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function generarRefreshToken(usuario) {
  const jti = crypto.randomBytes(32).toString("hex");
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol, type: "refresh", jti },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_SECONDS }
  );
  return { token, jti, expira_at: new Date(Date.now() + REFRESH_EXPIRES_SECONDS * 1000) };
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function guardarRefreshToken(usuario) {
  const { token, jti, expira_at } = generarRefreshToken(usuario);
  await pool.query(
    "INSERT INTO refresh_tokens (usuario_id, token_hash, expira_at) VALUES (?, ?, ?)",
    [usuario.id, hashToken(token), expira_at]
  );
  return { token, jti };
}

export async function revocarRefreshToken(refreshToken) {
  if (!refreshToken) return;
  await pool.query("DELETE FROM refresh_tokens WHERE token_hash = ?", [
    hashToken(refreshToken),
  ]);
}

export async function verificarRefreshToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("Token de refresco requerido");
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch {
    throw new Error("Token de refresco inválido o expirado");
  }
  if (payload.type !== "refresh") {
    throw new Error("Token no válido");
  }

  const [rows] = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token_hash = ? AND usado = FALSE",
    [hashToken(refreshToken)]
  );
  if (rows.length === 0) {
    throw new Error("Token de refresco no válido");
  }

  const [usuarios] = await pool.query(
    "SELECT * FROM usuarios WHERE id = ? AND estado = 'Activo'",
    [payload.id]
  );
  if (usuarios.length === 0) {
    throw new Error("Usuario no encontrado o suspendido");
  }
  return usuarios[0];
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticación requerido" });
  }
  try {
    const token = header.split(" ")[1];
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: "No tienes permiso para realizar esta acción" });
    }
    next();
  };
}
