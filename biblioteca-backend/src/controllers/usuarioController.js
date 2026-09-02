import { UsuarioModel } from "../models/usuarioModel.js";

export const UsuarioController = {
  async getAll(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json(usuarios);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },

  async getById(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  },

  async create(req, res) {
    try {
      const nombre = req.body.nombre.trim();
      const email = req.body.email.trim().toLowerCase();
      const rol = req.body.rol;
      const password = req.body.password || "123456";

      const existente = await UsuarioModel.findByEmail(email);
      if (existente) {
        return res.status(409).json({ error: "Ya existe un usuario con ese correo" });
      }

      const id = await UsuarioModel.nextId();
      const usuario = await UsuarioModel.create({ id, nombre, email, password, rol });
      res.status(201).json(usuario);
    } catch (err) {
      res.status(500).json({ error: "Error al crear usuario" });
    }
  },

  async update(req, res) {
    try {
      const existente = await UsuarioModel.findById(req.params.id);
      if (!existente) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const nombre = req.body.nombre !== undefined ? req.body.nombre.trim() : existente.nombre;
      const email = req.body.email !== undefined ? req.body.email.trim().toLowerCase() : existente.email;
      const rol = req.body.rol || existente.rol;
      const estado = req.body.estado || existente.estado;
      const prestamos = req.body.prestamos !== undefined ? req.body.prestamos : existente.prestamos;
      const password = req.body.password || existente.password;

      if (email !== existente.email) {
        const dup = await UsuarioModel.findByEmail(email);
        if (dup) {
          return res.status(409).json({ error: "Ya existe un usuario con ese correo" });
        }
      }

      const usuario = await UsuarioModel.update(req.params.id, { nombre, email, password, rol, prestamos, estado });
      res.json(usuario);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  },

  async delete(req, res) {
    try {
      const existente = await UsuarioModel.findById(req.params.id);
      if (!existente) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      await UsuarioModel.delete(req.params.id);
      res.json({ message: "Usuario eliminado" });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  },
};
