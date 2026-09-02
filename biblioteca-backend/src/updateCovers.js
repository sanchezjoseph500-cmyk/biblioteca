import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_PORT = parseInt(process.env.DB_PORT || "3306");
const DB_NAME = process.env.DB_NAME || "biblioteca";

const AGENT = "BibliotecaCentral/2.0 (gestion-biblioteca local)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchCover(titulo) {
  const normalized = titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, " ").trim();
  const q = encodeURIComponent(normalized);
  const url = `https://openlibrary.org/search.json?q=${q}&limit=5&fields=cover_i,title,author_name`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": AGENT } });
    if (res.status === 429) {
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.docs || data.docs.length === 0) return null;
    const doc = data.docs.find((d) => d.cover_i) || data.docs[0];
    if (doc.cover_i) return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
    return null;
  }
  return null;
}

async function main() {
  const conn = await mysql.createConnection({
    host: DB_HOST, user: DB_USER, password: DB_PASSWORD, port: DB_PORT, database: DB_NAME,
  });

  const [rows] = await conn.query("SELECT id, titulo, imagen_url FROM libros");
  console.log(`Actualizando portadas de ${rows.length} libros...`);

  let ok = 0, fail = 0;
  for (let i = 0; i < rows.length; i++) {
    const { id, titulo } = rows[i];
    process.stdout.write(`[${i + 1}/${rows.length}] ${titulo.slice(0, 30)}... `);
    try {
      const cover = await searchCover(titulo);
      if (cover) {
        await conn.query("UPDATE libros SET imagen_url = ? WHERE id = ?", [cover, id]);
        ok++;
        console.log(`OK ${cover}`);
      } else {
        fail++;
        console.log("SIN portada");
      }
    } catch (err) {
      fail++;
      console.log(`ERROR ${err.message}`);
    }
    await sleep(350);
  }

  console.log(`\nTerminado: ${ok} actualizados, ${fail} sin portada/error`);
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
