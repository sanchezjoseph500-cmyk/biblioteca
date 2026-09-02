import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
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

async function seed() {
  console.log("Conectando a MySQL...");
  const conn = await mysql.createConnection({
    host: DB_HOST, user: DB_USER, password: DB_PASSWORD, port: DB_PORT,
  });

  console.log("Creando base de datos si no existe...");
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${DB_NAME}\``);

  console.log("Creando tablas...");
  await conn.query("DROP TABLE IF EXISTS refresh_tokens");
  await conn.query("DROP TABLE IF EXISTS prestamos");
  await conn.query("DROP TABLE IF EXISTS usuarios");
  await conn.query("DROP TABLE IF EXISTS libros");

  await conn.query(`
    CREATE TABLE usuarios (
      id VARCHAR(10) PRIMARY KEY,
      nombre VARCHAR(80) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      rol ENUM('admin','empleado','usuario') NOT NULL,
      prestamos INT DEFAULT 0,
      estado ENUM('Activo','Suspendido') DEFAULT 'Activo'
    )
  `);

  await conn.query(`
    CREATE TABLE libros (
      id VARCHAR(10) PRIMARY KEY,
      titulo VARCHAR(100) NOT NULL,
      autor VARCHAR(80) NOT NULL,
      genero ENUM('Novela','Cuento','Poesía','Ensayo','Historia','Ciencia') NOT NULL,
      disponible BOOLEAN DEFAULT TRUE,
      sinopsis TEXT,
      imagen_url VARCHAR(500)
    )
  `);

  await conn.query(`
    CREATE TABLE prestamos (
      id VARCHAR(10) PRIMARY KEY,
      libro VARCHAR(100) NOT NULL,
      usuario VARCHAR(80) NOT NULL,
      usuario_id VARCHAR(10),
      libro_id VARCHAR(10),
      prestamo VARCHAR(50) NOT NULL,
      vence VARCHAR(50) NOT NULL,
      estado ENUM('Al dia','Vencido','Pendiente') DEFAULT 'Al dia',
      notificado_tardio BOOLEAN DEFAULT FALSE
    )
  `);

  await conn.query(`
    CREATE TABLE refresh_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id VARCHAR(10) NOT NULL,
      token_hash VARCHAR(255) NOT NULL,
      expira_at DATETIME NOT NULL,
      usado BOOLEAN DEFAULT FALSE,
      creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY idx_usuario (usuario_id),
      KEY idx_token (token_hash)
    )
  `);

  console.log("Insertando usuarios...");
  const usuarios = [
    ["U-001", "Carlos Mendoza", "admin@biblioteca.com", "admin123", "admin", 0, "Activo"],
    ["U-002", "Laura Vega", "empleado@biblioteca.com", "empleado123", "empleado", 0, "Activo"],
    ["U-003", "Andrés Rojas", "usuario@biblioteca.com", "usuario123", "usuario", 3, "Activo"],
    ["U-004", "María López", "maria@mail.com", "123456", "usuario", 2, "Activo"],
    ["U-005", "Julián Pérez", "julian@mail.com", "123456", "usuario", 1, "Activo"],
    ["U-006", "Paula Méndez", "paula@mail.com", "123456", "usuario", 0, "Activo"],
    ["U-007", "Diego Torres", "diego@mail.com", "123456", "usuario", 1, "Suspendido"],
    ["U-008", "Valentina Cruz", "valentina@mail.com", "123456", "empleado", 0, "Activo"],
    ["U-009", "Santiago Herrera", "santiago@mail.com", "123456", "usuario", 2, "Activo"],
    ["U-010", "Camila Rodríguez", "camila@mail.com", "123456", "usuario", 1, "Activo"],
    ["U-011", "Nicolás Castillo", "nicolas@mail.com", "123456", "usuario", 0, "Activo"],
    ["U-012", "Isabella Moreno", "isabella@mail.com", "123456", "usuario", 1, "Activo"],
  ];
  for (const u of usuarios) {
    const hash = await bcrypt.hash(u[3], 10);
    await conn.query(
      "INSERT INTO usuarios (id, nombre, email, password, rol, prestamos, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [u[0], u[1], u[2], hash, u[4], u[5], u[6]]
    );
  }
  console.log(`  ${usuarios.length} usuarios insertados`);

  console.log("Insertando libros...");
  const libros = [
    ["L-1001", "Cien años de soledad", "Gabriel García Márquez", "Novela", false, "La saga de la familia Buendía en Macondo, un pueblo donde lo real se mezcla con lo mágico a lo largo de siete generaciones.", null],
    ["L-1002", "Pedro Páramo", "Juan Rulfo", "Novela", true, "Juan Preciado viaja a Comala para conocer a su padre, Pedro Páramo, y descubre un pueblo habitado por voces y recuerdos del más allá.", null],
    ["L-1003", "Ficciones", "Jorge Luis Borges", "Cuento", true, "Colección de relatos que exploran laberintos, bibliotecas infinitas, espejos y paradojas del tiempo y del infinito.", null],
    ["L-1004", "La Casa de los Espíritus", "Isabel Allende", "Novela", true, "La historia de la familia Trueba a lo largo de generaciones, entre el amor, la política y lo sobrenatural en un país sudamericano.", null],
    ["L-1005", "Platero y Yo", "Juan Ramón Jiménez", "Poesía", true, "El tierno retrato lírico de un poeta andaluz y su burro Platero, en una sucesión de breves escenas de la vida rural.", null],
    ["L-1006", "Rayuela", "Julio Cortázar", "Novela", true, "La historia de Horacio Oliveira y su búsqueda existencial entre París y Buenos Aires, una novela que puede leerse de múltiples formas.", null],
    ["L-1007", "El principito", "Antoine de Saint-Exupéry", "Cuento", true, "Un piloto perdido en el desierto conoce a un pequeño príncipe que viaja de planeta en planeta descubriendo el sentido de la amistad y la vida.", null],
    ["L-1008", "Don Quijote de la Mancha", "Miguel de Cervantes", "Novela", true, "Las aventuras del ingenioso hidalgo Alonso Quijano, quien enloquecido por los libros de caballerías, sale a enderezar entuertos.", null],
    ["L-1009", "La sombra del viento", "Carlos Ruiz Zafón", "Novela", true, "En la Barcelona de posguerra, Daniel Sempere descubre un libro maldito que lo lleva a desentrañar un oscuro misterio.", null],
    ["L-1010", "El amor en los tiempos del cólera", "Gabriel García Márquez", "Novela", false, "Florentino Ariza espera más de cincuenta años a su amada Fermina Daza, en una historia de amor que desafía el tiempo.", null],
    ["L-1011", "La ciudad y los perros", "Mario Vargas Llosa", "Novela", true, "Vida en el colegio militar Leoncio Prado del Perú, donde la violencia y la jerarquía forjan a los cadetes Alberto y el Jaguar.", null],
    ["L-1012", "Veinte poemas de amor", "Pablo Neruda", "Poesía", true, "Veinte poemas que celebran el amor y la melancolía, entre ellos el célebre Poema 20 con versos inolvidables sobre el deseo y la distancia.", null],
    ["L-1013", "El coronel no tiene quien le escriba", "Gabriel García Márquez", "Novela", true, "Un coronel jubilado espera cada viernes una carta con su pensión, mientras mantiene la dignidad con un gallo de pelea.", null],
    ["L-1014", "El Aleph", "Jorge Luis Borges", "Cuento", true, "Relatos donde mundos infinitos se concentran en un punto único, explorando el tiempo, la memoria y lo imposible.", null],
    ["L-1015", "Historia de dos ciudades", "Charles Dickens", "Historia", true, "Una historia de amor y sacrificio ambientada entre Londres y París durante la Revolución Francesa, con la frase célebre sobre los mejores y peores tiempos.", null],
    ["L-1016", "Breve historia del tiempo", "Stephen Hawking", "Ciencia", true, "Un recorrido accesible por el origen del universo, los agujeros negros y las grandes preguntas de la cosmología moderna.", null],
    ["L-1017", "Sapiens", "Yuval Noah Harari", "Historia", false, "La fascinante historia de la humanidad: de la revolución cognitiva a la era tecnológica, explicando cómo el Homo sapiens conquistó el mundo.", null],
    ["L-1018", "El mundo de Sofía", "Jostein Gaarder", "Ensayo", true, "Una novela que introduce a la filosofía a través de Sofía, una adolescente que recibe cartas de un misterioso filósofo.", null],
    ["L-1019", "Crónica de una muerte anunciada", "Gabriel García Márquez", "Novela", true, "El asesinato anunciado de Santiago Nasar, reconstruido a través de testimonios que revelan cómo todos sabían y nadie lo evitó.", null],
    ["L-1020", "La casa verde", "Mario Vargas Llosa", "Novela", true, "La vida en la selva y la ciudad se entrelazan en torno a un burdel llamado la Casa Verde, en el Perú profundo.", null],
    ["L-1021", "El túnel", "Ernesto Sabato", "Novela", true, "Juan Pablo Castel, un pintor obsesionado, narra cómo llegó a asesinar a la única mujer que entendía su obra.", null],
    ["L-1022", "Respiración artificial", "Ricardo Piglia", "Novela", true, "Una indagación sobre la historia argentina, la literatura y la memoria a través de cartas y conversaciones.", null],
    ["L-1023", "Los detectives salvajes", "Roberto Bolaño", "Novela", true, "Dos poetas mexicanos emprenden la búsqueda de una poeta desaparecida, en una novela que recorre todo el continente.", null],
    ["L-1024", "2666", "Roberto Bolaño", "Novela", true, "Una ambiciosa novela que gira en torno a la ciudad ficticia de Santa Teresa y los asesinatos de mujeres, con el enigma del escritor Benno von Archimboldi.", null],
    ["L-1025", "Inés del alma mía", "Isabel Allende", "Novela", true, "La historia de Inés Suárez, conquistadora española que participó en la fundación de Chile, contada en primera persona.", null],
    ["L-1026", "Orgullo y prejuicio", "Jane Austen", "Novela", true, "Elizabeth Bennet y el señor Darcy superan sus prejuicios y su orgullo en una de las historias de amor más queridas de la literatura.", null],
    ["L-1027", "1984", "George Orwell", "Novela", true, "En un mundo totalitario vigilado por el Gran Hermano, Winston Smith intenta escapar del control absoluto del pensamiento.", null],
    ["L-1028", "La metamorfosis", "Franz Kafka", "Cuento", true, "Gregorio Samsa amanece convertido en un insecto gigante, y su familia debe enfrentar las consecuencias de tan extraña transformación.", null],
    ["L-1029", "Moby Dick", "Herman Melville", "Novela", true, "La obsesiva persecución del capitán Ahab de la ballena blanca Moby Dick, una epopeya sobre el mar y la venganza.", null],
    ["L-1030", "Guerra y paz", "León Tolstói", "Novela", true, "La invasión napoleónica de Rusia y la vida de varias familias nobles, en una de las novelas más grandes jamás escritas.", null],
    ["L-1031", "Crimen y castigo", "Fiódor Dostoyevski", "Novela", true, "Raskólnikov, un estudiante empobrecido, comete un asesinato y lidia con la culpa y la conciencia en San Petersburgo.", null],
    ["L-1032", "El retrato de Dorian Gray", "Oscar Wilde", "Novela", true, "Dorian Gray conserva su juventud mientras su retrato envejece y muestra los estragos de su vida de excesos.", null],
    ["L-1033", "Drácula", "Bram Stoker", "Novela", true, "La lucha contra el conde Drácula, vampiro de Transilvania que extiende su sombra sobre la Inglaterra victoriana.", null],
    ["L-1034", "Frankenstein", "Mary Shelley", "Novela", true, "El doctor Victor Frankenstein crea una criatura a partir de cadáveres y debe enfrentar las terribles consecuencias de su experimento.", null],
    ["L-1035", "El origen de las especies", "Charles Darwin", "Ciencia", true, "La obra que revolucionó la biología, presentando la teoría de la evolución por selección natural.", null],
    ["L-1036", "Cosmos", "Carl Sagan", "Ciencia", true, "Un viaje fascinante por el universo, el origen de la vida y el lugar de la humanidad en el vasto cosmos.", null],
    ["L-1037", "Una breve historia de casi todo", "Bill Bryson", "Ciencia", true, "Un recorrido ameno y accesible por la ciencia, desde el Big Bang hasta la evolución y la historia de la Tierra.", null],
    ["L-1038", "El gen egoísta", "Richard Dawkins", "Ciencia", true, "Una provocadora explicación de la evolución desde la perspectiva de los genes, introduciendo el concepto de memes.", null],
    ["L-1039", "La teoría del todo", "Stephen Hawking", "Ciencia", true, "Un resumen claro de los grandes descubrimientos de la física moderna y la búsqueda de una teoría unificada.", null],
    ["L-1040", "El arte de la guerra", "Sun Tzu", "Ensayo", true, "Un tratado milenario sobre estrategia y táctica militar, cuyos principios se aplican a los negocios y la vida.", null],
    ["L-1041", "Meditaciones", "Marco Aurelio", "Ensayo", true, "Las reflexiones personales del emperador romano Marco Aurelio sobre la virtud, el deber y la filosofía estoica.", null],
    ["L-1042", "Así habló Zaratustra", "Friedrich Nietzsche", "Ensayo", true, "La obra central de Nietzsche, con el anuncio del superhombre y la crítica radical de la moral tradicional.", null],
    ["L-1043", "El contrato social", "Jean-Jacques Rousseau", "Ensayo", true, "Un tratado fundacional de la filosofía política sobre la soberanía del pueblo y el contrato entre gobernantes y gobernados.", null],
    ["L-1044", "Las penas del joven Werther", "Johann W. Goethe", "Novela", true, "La trágica historia de amor del joven Werther, cuyo desenlace conmovió a toda una generación europea.", null],
    ["L-1045", "Los miserables", "Victor Hugo", "Novela", true, "La epopeya de Jean Valjean, un exconvicto que busca la redención en medio de la pobreza y la revolución francesa.", null],
    ["L-1046", "Alicia en el país de las maravillas", "Lewis Carroll", "Cuento", true, "Alicia cae por la madriguera de un conejo a un mundo absurdo y surrealista lleno de criaturas extravagantes.", null],
    ["L-1047", "El mago de Oz", "L. Frank Baum", "Cuento", true, "Dorothy viaja por el camino de ladrillos amarillos con sus amigos en busca del poderoso Mago de Oz.", null],
    ["L-1048", "Cuentos de la selva", "Horacio Quiroga", "Cuento", true, "Relatos llenos de aventura protagonizados por animales de la selva misionera, con la huella de la naturaleza salvaje.", null],
    ["L-1049", "Antología poética", "Federico García Lorca", "Poesía", true, "Una selección de la obra del gran poeta granadino, del cante jondo al romancero gitano.", null],
    ["L-1050", "Poemas", "Constantino Cavafis", "Poesía", true, "La poesía de Cavafis sobre la historia, la nostalgia y el deseo, en la Alejandría cosmopolita de sus recuerdos.", null],
    ["L-1051", "Historia de la medicina", "Luis A. de Sánchez", "Historia", true, "Un recorrido por la evolución de la ciencia médica, desde las prácticas ancestrales hasta la moderna medicina.", null],
    ["L-1052", "La revolución francesa", "Thomas Carlyle", "Historia", true, "Una crónica apasionada y dramática de los acontecimientos que transformaron Francia entre 1789 y el Terror.", null],
    ["L-1053", "Imperio", "Michael Hardt", "Historia", true, "Un análisis de cómo el poder global contemporáneo se ejerce a través de redes descentralizadas de dominación.", null],
    ["L-1054", "El segundo sexo", "Simone de Beauvoir", "Ensayo", true, "La obra fundacional del feminismo moderno, que analiza la construcción social de la mujer a lo largo de la historia.", null],
    ["L-1055", "Los hermanos Karamázov", "Fiódor Dostoyevski", "Novela", true, "El drama de la familia Karamázov entre el parricidio, la fe, la duda y la libertad, en una de las cimas de la literatura.", null],
    ["L-1056", "Madame Bovary", "Gustave Flaubert", "Novela", true, "Emma Bovary, atrapada en un matrimonio mediocre, busca escapar a través de amantes y deudas hasta el trágico desenlace.", null],
    ["L-1057", "El gran Gatsby", "F. Scott Fitzgerald", "Novela", true, "El enigmático millonario Jay Gatsby persigue un amor imposible en la opulenta y decadente Nueva York de los años veinte.", null],
    ["L-1058", "Matar a un ruiseñor", "Harper Lee", "Novela", true, "La pequeña Scout observa a su padre, el abogado Atticus Finch, defender a un hombre negro acusado injustamente.", null],
    ["L-1059", "La naranja mecánica", "Anthony Burgess", "Novela", true, "Alex, un joven violento en una sociedad distópica, es sometido a un experimento de reeducación que lo despoja de su libertad.", null],
    ["L-1060", "Un mundo feliz", "Aldous Huxley", "Novela", true, "En una sociedad futura controlada y feliz, Bernard Marx cuestiona el orden que sacrifica la individualidad y el sentimiento.", null],
    ["L-1061", "El viejo y el mar", "Ernest Hemingway", "Novela", true, "El viejo pescador Santiago lucha contra un enorme pez en el mar, en un relato sobre la dignidad y la perseverancia.", null],
    ["L-1062", "La peste", "Albert Camus", "Novela", true, "La ciudad de Orán es azotada por una epidemia de peste, y sus habitantes enfrentan el sufrimiento y la solidaridad.", null],
    ["L-1063", "El extranjero", "Albert Camus", "Novela", true, "Meursault, indiferente ante el mundo, comete un asesinato y es juzgado menos por el crimen que por su manera de sentir.", null],
    ["L-1064", "Rayuela", "Julio Cortázar", "Novela", true, "La historia de Horacio Oliveira y su búsqueda existencial entre París y Buenos Aires, una novela que puede leerse de múltiples formas.", null],
    ["L-1065", "Aura", "Carlos Fuentes", "Novela", true, "El joven Felipe Montero es contratado para editar las memorias de una anciana que oculta un inquietante secreto.", null],
    ["L-1066", "La muerte de Artemio Cruz", "Carlos Fuentes", "Novela", true, "En su lecho de muerte, Artemio Cruz repasa su vida de ascenso social, traición y poder en el México revolucionario.", null],
    ["L-1067", "Pájaro de fuego", "Clarice Lispector", "Cuento", true, "Relatos de la gran escritora brasileña sobre los misterios del cuerpo, la identidad y la vida cotidiana.", null],
    ["L-1068", "La invención de Morel", "Adolfo Bioy Casares", "Novela", true, "Un fugitivo en una isla desierta descubre una máquina capaz de reproducir eternamente a un grupo de veraneantes.", null],
    ["L-1069", "El cartero de Neruda", "Antonio Skármeta", "Novela", true, "Un joven cartero de una isla chilena entabla amistad con el poeta Pablo Neruda y aprende el arte de la poesía para seducir.", null],
    ["L-1070", "Hombres de maíz", "Miguel Ángel Asturias", "Novela", true, "La lucha entre los indígenas mayas y la voracidad de la tierra, con el mito del hombre como sustento del maíz.", null],
    ["L-1071", "El señor Presidente", "Miguel Ángel Asturias", "Novela", true, "La dictadura de un déspota en una república latinoamericana, con el terror y la manipulación como protagonistas.", null],
    ["L-1072", "Doña Bárbara", "Rómulo Gallegos", "Novela", true, "La lucha entre la civilización, representada por Santos Luzardo, y la barbarie, personificada en la poderosa Doña Bárbara.", null],
    ["L-1073", "María", "Jorge Isaacs", "Novela", true, "Un idilio romántico y trágico entre Efraín y su prima María, ambientado en el valle del Cauca colombiano.", null],
    ["L-1074", "La vorágine", "José Eustasio Rivera", "Novela", true, "La historia de Arturo Cova y Alicia en las selvas del Orinoco y el Amazonas, donde la pasión devora a los personajes.", null],
  ];
  for (const l of libros) {
    const [id, titulo, autor, genero, disponible, sinopsis, imagen_url] = l;
    const img = imagen_url || `https://picsum.photos/seed/${id}/300/430`;
    await conn.query(
      "INSERT INTO libros (id, titulo, autor, genero, disponible, sinopsis, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, titulo, autor, genero, disponible, sinopsis, img]
    );
  }
  console.log(`  ${libros.length} libros insertados`);

  console.log("Insertando préstamos...");
  const fmt = (d) => d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  // Fecha dentro del mes actual (para que "más prestados del mes" tenga datos siempre)
  const dim = (day, venceOffsetDays = 14) => {
    const dt = new Date();
    dt.setDate(1);
    dt.setDate(day);
    const v = new Date(dt);
    v.setDate(v.getDate() + venceOffsetDays);
    return [dt, v];
  };
  const prevMes = (day) => {
    const dt = new Date();
    dt.setDate(1);
    dt.setMonth(dt.getMonth() - 1);
    dt.setDate(day);
    return dt;
  };
  const h = new Date();
  const [p1, v1] = dim(2);
  const [p2, v2] = dim(4);
  const [p3, v3] = dim(3);
  const [p4, v4] = dim(6);
  const [p5, v5] = dim(5);
  const [p6, v6] = dim(8);
  const [p7, v7] = dim(10);
  const [p8, v8] = dim(7);
  const [p9, v9] = dim(12);
  const [p10, v10] = dim(9);
  const [p11, v11] = dim(14);

  const prestamos = [
    // Este mes — concentramos varios préstamos de estos títulos en el mes actual
    ["P-3001", "Cien años de soledad", "Andrés Rojas", "U-003", "L-1001", fmt(p1), fmt(v1), "Al dia", false],
    ["P-3002", "Ficciones", "Julián Pérez", "U-005", "L-1003", fmt(p2), fmt(v2), "Al dia", false],
    ["P-3003", "Cien años de soledad", "María López", "U-004", "L-1001", fmt(p3), fmt(v3), "Al dia", false],
    ["P-3004", "El amor en los tiempos del cólera", "María López", "U-004", "L-1010", fmt(p4), fmt(v4), "Al dia", false],
    ["P-3005", "Sapiens", "Santiago Herrera", "U-009", "L-1017", fmt(p5), fmt(v5), "Al dia", false],
    ["P-3006", "Cien años de soledad", "Camila Rodríguez", "U-010", "L-1001", fmt(p6), fmt(v6), "Vencido", true],
    ["P-3007", "Pedro Páramo", "María López", "U-004", "L-1002", fmt(p7), fmt(v7), "Al dia", false],
    ["P-3008", "Sapiens", "Isabella Moreno", "U-012", "L-1017", fmt(p8), fmt(v8), "Al dia", false],
    ["P-3009", "El principito", "Camila Rodríguez", "U-010", "L-1007", fmt(p9), fmt(v9), "Al dia", false],
    ["P-3010", "La sombra del viento", "Andrés Rojas", "U-003", "L-1009", fmt(p10), fmt(v10), "Al dia", false],
    ["P-3011", "Veinte poemas de amor", "Paula Méndez", "U-006", "L-1012", fmt(p11), fmt(v11), "Al dia", false],
    // Mes anterior (para contexto histórico)
    ["P-3012", "Don Quijote de la Mancha", "Diego Torres", "U-007", "L-1008", fmt(prevMes(5)), fmt(prevMes(19)), "Vencido", true],
    ["P-3013", "La ciudad y los perros", "Nicolás Castillo", "U-011", "L-1011", fmt(h), fmt(new Date(h.getTime() + 14 * 86400000)), "Pendiente", false],
    ["P-3014", "El principito", "Andrés Rojas", "U-003", "L-1007", fmt(h), fmt(new Date(h.getTime() + 14 * 86400000)), "Pendiente", false],
  ];
  for (const p of prestamos) {
    await conn.query(
      "INSERT INTO prestamos (id, libro, usuario, usuario_id, libro_id, prestamo, vence, estado, notificado_tardio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", p
    );
  }
  console.log(`  ${prestamos.length} préstamos insertados`);

  await conn.end();
  console.log("\nBase de datos sembrada exitosamente!");
  console.log("\nCuentas de prueba:");
  console.log("  Admin:     admin@biblioteca.com / admin123");
  console.log("  Empleado:  empleado@biblioteca.com / empleado123");
  console.log("  Usuario:   usuario@biblioteca.com / usuario123");
}

seed().catch((err) => {
  console.error("Error al sembrar la base de datos:", err.message);
  process.exit(1);
});
