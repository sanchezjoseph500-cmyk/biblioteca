import pool from "../config/db.js";

export const LibroModel = {
  async findAll() {
    const [rows] = await pool.query("SELECT * FROM libros");
    return rows.map((r) => ({ ...r, disponible: !!r.disponible }));
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM libros WHERE id = ?", [id]);
    if (!rows[0]) return null;
    return { ...rows[0], disponible: !!rows[0].disponible };
  },

  async findByTitulo(titulo) {
    const [rows] = await pool.query("SELECT * FROM libros WHERE titulo = ?", [titulo]);
    if (!rows[0]) return null;
    return { ...rows[0], disponible: !!rows[0].disponible };
  },

  async create({ id, titulo, autor, genero, disponible = true, sinopsis = null, imagen_url = null }) {
    await pool.query(
      "INSERT INTO libros (id, titulo, autor, genero, disponible, sinopsis, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, titulo, autor, genero, disponible ? 1 : 0, sinopsis, imagen_url]
    );
    return this.findById(id);
  },

  async update(id, { titulo, autor, genero, disponible, sinopsis, imagen_url }) {
    await pool.query(
      "UPDATE libros SET titulo = ?, autor = ?, genero = ?, disponible = ?, sinopsis = ?, imagen_url = ? WHERE id = ?",
      [titulo, autor, genero, disponible ? 1 : 0, sinopsis, imagen_url, id]
    );
    return this.findById(id);
  },

  async setDisponible(id, disponible) {
    await pool.query("UPDATE libros SET disponible = ? WHERE id = ?", [disponible ? 1 : 0, id]);
  },

  async delete(id) {
    await pool.query("DELETE FROM libros WHERE id = ?", [id]);
  },

  async nextId() {
    const [rows] = await pool.query(
      "SELECT id FROM libros ORDER BY CAST(SUBSTR(id, 3) AS UNSIGNED) DESC LIMIT 1"
    );
    if (rows.length === 0) return "L-1001";
    const num = parseInt(rows[0].id.split("-")[1], 10) + 1;
    return `L-${num}`;
  },
};
