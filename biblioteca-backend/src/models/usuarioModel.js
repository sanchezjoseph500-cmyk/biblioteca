import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const UsuarioModel = {
  async findAll() {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol, prestamos, estado FROM usuarios"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, rol, prestamos, estado FROM usuarios WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  },

  async create({ id, nombre, email, password, rol }) {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO usuarios (id, nombre, email, password, rol, prestamos, estado) VALUES (?, ?, ?, ?, ?, 0, 'Activo')",
      [id, nombre, email, hash, rol]
    );
    return this.findById(id);
  },

  async update(id, { nombre, email, password, rol, prestamos, estado }) {
    let passwordF = password;
    if (password && !(/^\$2[aby]\$\d+\$/.test(password))) {
      passwordF = await bcrypt.hash(password, 10);
    }
    await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ?, prestamos = ?, estado = ? WHERE id = ?",
      [nombre, email, passwordF, rol, prestamos, estado, id]
    );
    return this.findById(id);
  },

  async delete(id) {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
  },

  async nextId() {
    const [rows] = await pool.query(
      "SELECT id FROM usuarios ORDER BY CAST(SUBSTR(id, 3) AS UNSIGNED) DESC LIMIT 1"
    );
    if (rows.length === 0) return "U-001";
    const num = parseInt(rows[0].id.split("-")[1], 10) + 1;
    return `U-${String(num).padStart(3, "0")}`;
  },

  async incrementarPrestamos(id) {
    await pool.query("UPDATE usuarios SET prestamos = prestamos + 1 WHERE id = ?", [id]);
  },

  async decrementarPrestamos(id) {
    await pool.query("UPDATE usuarios SET prestamos = GREATEST(prestamos - 1, 0) WHERE id = ?", [id]);
  },
};
