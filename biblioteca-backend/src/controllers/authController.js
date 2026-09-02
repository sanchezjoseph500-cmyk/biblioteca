import bcrypt from "bcryptjs";
import { UsuarioModel } from "../models/usuarioModel.js";
import {
  generarToken,
  guardarRefreshToken,
  verificarRefreshToken,
  revocarRefreshToken,
} from "../middleware/auth.js";

export const AuthController = {
  async login(req, res) {
    try {
      const email = req.body.email.trim().toLowerCase();
      const password = req.body.password;

      const usuario = await UsuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ error: "Correo o contraseña incorrectos" });
      }
      const ok = await bcrypt.compare(password, usuario.password);
      if (!ok) {
        return res.status(401).json({ error: "Correo o contraseña incorrectos" });
      }
      if (usuario.estado === "Suspendido") {
        return res.status(403).json({ error: "Tu cuenta está suspendida. Contacta al administrador." });
      }

      const token = generarToken(usuario);
      const refresh = await guardarRefreshToken(usuario);
      const { password: _, ...sinPassword } = usuario;
      res.json({ usuario: sinPassword, token, refreshToken: refresh.token });
    } catch (err) {
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  },

  async registro(req, res) {
    try {
      const nombre = req.body.nombre.trim();
      const email = req.body.email.trim().toLowerCase();
      const password = req.body.password;

      const existente = await UsuarioModel.findByEmail(email);
      if (existente) {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo" });
      }

      const id = await UsuarioModel.nextId();
      const usuario = await UsuarioModel.create({ id, nombre, email, password, rol: "usuario" });

      const token = generarToken(usuario);
      const refresh = await guardarRefreshToken(usuario);
      res.status(201).json({ usuario, token, refreshToken: refresh.token });
    } catch (err) {
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      const usuario = await verificarRefreshToken(refreshToken);
      await revocarRefreshToken(refreshToken);

      const token = generarToken(usuario);
      const refresh = await guardarRefreshToken(usuario);
      res.json({ token, refreshToken: refresh.token });
    } catch (err) {
      res.status(401).json({ error: err.message || "Sesión expirada, inicia sesión nuevamente" });
    }
  },

  async logout(req, res) {
    try {
      await revocarRefreshToken(req.body.refreshToken);
      res.json({ message: "Sesión cerrada correctamente" });
    } catch (err) {
      res.status(500).json({ error: "Error al cerrar sesión" });
    }
  },

  async perfil(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener perfil" });
    }
  },
};
