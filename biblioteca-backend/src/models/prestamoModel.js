import pool from "../config/db.js";

export const PrestamoModel = {
  async findAll() {
    const [rows] = await pool.query("SELECT * FROM prestamos ORDER BY id DESC");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM prestamos WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async findByUsuario(usuario) {
    const [rows] = await pool.query(
      "SELECT * FROM prestamos WHERE usuario = ? ORDER BY id DESC",
      [usuario]
    );
    return rows;
  },

  async create({ id, libro, usuario, usuario_id, libro_id, prestamo, vence, estado }) {
    await pool.query(
      "INSERT INTO prestamos (id, libro, usuario, usuario_id, libro_id, prestamo, vence, estado, notificado_tardio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)",
      [id, libro, usuario, usuario_id || null, libro_id || null, prestamo, vence, estado || "Al dia"]
    );
    return this.findById(id);
  },

  async updateEstado(id, estado) {
    await pool.query("UPDATE prestamos SET estado = ? WHERE id = ?", [estado, id]);
    return this.findById(id);
  },

  async marcarNotificado(id) {
    await pool.query("UPDATE prestamos SET notificado_tardio = 1 WHERE id = ?", [id]);
    return this.findById(id);
  },

  async delete(id) {
    await pool.query("DELETE FROM prestamos WHERE id = ?", [id]);
  },

  async existsPendiente(usuario, libro) {
    const [rows] = await pool.query(
      "SELECT id FROM prestamos WHERE usuario = ? AND libro = ? AND estado = 'Pendiente'",
      [usuario, libro]
    );
    return rows.length > 0;
  },

  async nextId() {
    const [rows] = await pool.query(
      "SELECT id FROM prestamos ORDER BY CAST(SUBSTR(id, 3) AS UNSIGNED) DESC LIMIT 1"
    );
    if (rows.length === 0) return "P-3001";
    const num = parseInt(rows[0].id.split("-")[1], 10) + 1;
    return `P-${num}`;
  },
};
