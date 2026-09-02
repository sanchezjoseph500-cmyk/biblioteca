import { PrestamoModel } from "../models/prestamoModel.js";
import { LibroModel } from "../models/libroModel.js";
import { UsuarioModel } from "../models/usuarioModel.js";

function formatDate(d) {
  return new Date(d).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export const PrestamoController = {
  async getAll(req, res) {
    try {
      const prestamos = await PrestamoModel.findAll();
      res.json(prestamos);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener préstamos" });
    }
  },

  async getMisPrestamos(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.usuario.id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const prestamos = await PrestamoModel.findByUsuario(usuario.nombre);
      res.json(prestamos);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener tus préstamos" });
    }
  },

  async getById(req, res) {
    try {
      const prestamo = await PrestamoModel.findById(req.params.id);
      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      res.json(prestamo);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener préstamo" });
    }
  },

  async create(req, res) {
    try {
      const { libro, usuario, prestamo, vence } = req.body;

      const libroObj = await LibroModel.findByTitulo(libro);
      const allUsers = await UsuarioModel.findAll();
      const usuarioObj = allUsers.find((u) => u.nombre === usuario.trim());

      const id = await PrestamoModel.nextId();
      const hoy = new Date();
      const venceDate = new Date(vence);
      const estado = venceDate < hoy ? "Vencido" : "Al dia";

      const prestamoCreado = await PrestamoModel.create({
        id, libro: libro.trim(), usuario: usuario.trim(),
        usuario_id: usuarioObj?.id || null,
        libro_id: libroObj?.id || null,
        prestamo, vence, estado,
      });

      if (libroObj) {
        await LibroModel.setDisponible(libroObj.id, false);
      }
      if (usuarioObj) {
        await UsuarioModel.incrementarPrestamos(usuarioObj.id);
      }

      res.status(201).json(prestamoCreado);
    } catch (err) {
      res.status(500).json({ error: "Error al crear préstamo" });
    }
  },

  async solicitud(req, res) {
    try {
      const { libro } = req.body;
      if (!libro || !libro.trim()) {
        return res.status(400).json({ error: "El libro es obligatorio" });
      }

      const libroObj = await LibroModel.findByTitulo(libro.trim());
      if (!libroObj) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }
      if (!libroObj.disponible) {
        return res.status(400).json({ error: "El libro no está disponible actualmente" });
      }

      const usuarioObj = await UsuarioModel.findById(req.usuario.id);
      if (!usuarioObj) {
        return res.status(404).json({ error: "Usuario no encontrado" });

      }

      const existePendiente = await PrestamoModel.existsPendiente(usuarioObj.nombre, libro.trim());
      if (existePendiente) {
        return res.status(400).json({ error: "Ya tienes una solicitud pendiente para este libro" });
      }

      const id = await PrestamoModel.nextId();
      const hoy = new Date();
      const en2Semanas = new Date(hoy);
      en2Semanas.setDate(en2Semanas.getDate() + 14);

      const prestamoCreado = await PrestamoModel.create({
        id,
        libro: libro.trim(),
        usuario: usuarioObj.nombre,
        usuario_id: usuarioObj.id,
        libro_id: libroObj.id,
        prestamo: formatDate(hoy),
        vence: formatDate(en2Semanas),
        estado: "Pendiente",
      });

      res.status(201).json(prestamoCreado);
    } catch (err) {
      res.status(500).json({ error: "Error al crear solicitud" });
    }
  },

  async aprobar(req, res) {
    try {
      const prestamo = await PrestamoModel.findById(req.params.id);
      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      if (prestamo.estado !== "Pendiente") {
        return res.status(400).json({ error: "Solo se pueden aprobar préstamos pendientes" });
      }

      await PrestamoModel.updateEstado(req.params.id, "Al dia");

      if (prestamo.libro_id) {
        await LibroModel.setDisponible(prestamo.libro_id, false);
      }
      if (prestamo.usuario_id) {
        await UsuarioModel.incrementarPrestamos(prestamo.usuario_id);
      }

      const actualizado = await PrestamoModel.findById(req.params.id);
      res.json(actualizado);
    } catch (err) {
      res.status(500).json({ error: "Error al aprobar préstamo" });
    }
  },

  async notificarTardio(req, res) {
    try {
      const prestamo = await PrestamoModel.findById(req.params.id);
      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }
      if (prestamo.estado !== "Vencido") {
        return res.status(400).json({ error: "Solo se puede notificar préstamos vencidos" });
      }

      const actualizado = await PrestamoModel.marcarNotificado(req.params.id);
      res.json(actualizado);
    } catch (err) {
      res.status(500).json({ error: "Error al notificar" });
    }
  },

  async delete(req, res) {
    try {
      const prestamo = await PrestamoModel.findById(req.params.id);
      if (!prestamo) {
        return res.status(404).json({ error: "Préstamo no encontrado" });
      }

      if (prestamo.libro_id) {
        await LibroModel.setDisponible(prestamo.libro_id, true);
      }
      if (prestamo.usuario_id && prestamo.estado !== "Pendiente") {
        await UsuarioModel.decrementarPrestamos(prestamo.usuario_id);
      }

      await PrestamoModel.delete(req.params.id);
      res.json({ message: "Préstamo eliminado" });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar préstamo" });
    }
  },
};
