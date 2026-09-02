import { LibroModel } from "../models/libroModel.js";

export const LibroController = {
  async getAll(req, res) {
    try {
      const libros = await LibroModel.findAll();
      res.json(libros);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener libros" });
    }
  },

  async getById(req, res) {
    try {
      const libro = await LibroModel.findById(req.params.id);
      if (!libro) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }
      res.json(libro);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener libro" });
    }
  },

  async create(req, res) {
    try {
      const titulo = req.body.titulo.trim();
      const autor = req.body.autor.trim();
      const genero = req.body.genero;
      const disponible = req.body.disponible !== undefined ? req.body.disponible : true;
      const sinopsis = req.body.sinopsis || null;
      const imagen_url = req.body.imagen_url || null;

      const id = await LibroModel.nextId();
      const libro = await LibroModel.create({ id, titulo, autor, genero, disponible, sinopsis, imagen_url });
      res.status(201).json(libro);
    } catch (err) {
      res.status(500).json({ error: "Error al crear libro" });
    }
  },

  async update(req, res) {
    try {
      const existente = await LibroModel.findById(req.params.id);
      if (!existente) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      const titulo = req.body.titulo !== undefined ? req.body.titulo.trim() : existente.titulo;
      const autor = req.body.autor !== undefined ? req.body.autor.trim() : existente.autor;
      const genero = req.body.genero || existente.genero;
      const disponible = req.body.disponible !== undefined ? req.body.disponible : existente.disponible;
      const sinopsis = req.body.sinopsis !== undefined ? (req.body.sinopsis || null) : existente.sinopsis;
      const imagen_url = req.body.imagen_url !== undefined ? (req.body.imagen_url || null) : existente.imagen_url;

      const libro = await LibroModel.update(req.params.id, { titulo, autor, genero, disponible, sinopsis, imagen_url });
      res.json(libro);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar libro" });
    }
  },

  async delete(req, res) {
    try {
      const existente = await LibroModel.findById(req.params.id);
      if (!existente) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }
      await LibroModel.delete(req.params.id);
      res.json({ message: "Libro eliminado" });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar libro" });
    }
  },
};
