#!/bin/sh
set -e

DB_NAME="${DB_NAME:-biblioteca}"
DB_USER="${DB_USER:-biblioteca}"
DB_PASSWORD="${DB_PASSWORD:-biblioteca}"
DB_PORT="${DB_PORT:-3306}"

# Definir puerto interno por defecto para la API Node.js
export PORT="${PORT:-3001}"

DATADIR=/var/lib/mysql
SOCKET=/run/mysqld/mysqld.sock

mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld "$DATADIR" 2>/dev/null || true

FIRST_RUN=0
if [ ! -d "$DATADIR/mysql" ]; then
  echo ">> Inicializando MariaDB (primera vez)..."
  mariadb-install-db --user=mysql --datadir="$DATADIR" --skip-test-db
  FIRST_RUN=1
fi

# 🛠️ SOLUCIÓN: Desactivar restricciones de red que Alpine impone por defecto
echo ">> Desactivando restricciones de red en archivos de configuración..."
if [ -f /etc/my.cnf.d/mariadb-server.cnf ]; then
  sed -i 's/skip-networking/#skip-networking/g' /etc/my.cnf.d/mariadb-server.cnf
fi
if [ -f /etc/my.cnf ]; then
  sed -i 's/skip-networking/#skip-networking/g' /etc/my.cnf
fi

# 🚀 SOLUCIÓN: Forzar enlace a 0.0.0.0 y habilitar red explícitamente (--skip-networking=0)
echo ">> Arrancando MariaDB en el puerto TCP:${DB_PORT}..."
mariadbd --user=mysql --datadir="$DATADIR" --socket="$SOCKET" \
  --bind-address=0.0.0.0 --port="$DB_PORT" --skip-networking=0 &
MYSQL_PID=$!

# Esperar a que MariaDB responda
for i in $(seq 1 60); do
  if mariadb-admin --socket="$SOCKET" ping >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! mariadb-admin --socket="$SOCKET" ping >/dev/null 2>&1; then
  echo ">> MariaDB no arranco a tiempo" >&2
  exit 1
fi

echo ">> Creando usuario y base de datos..."
mariadb --socket="$SOCKET" -uroot <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASSWORD}';
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
CREATE USER IF NOT EXISTS '${DB_USER}'@'%' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%';
FLUSH PRIVILEGES;
SQL

export DB_HOST=127.0.0.1
export DB_PORT
export DB_USER
export DB_PASSWORD
export DB_NAME

if [ "$FIRST_RUN" = "1" ]; then
  echo ">> Sembrando base de datos (primera vez)..."
  npm run seed || echo ">> Advertencia: No se pudo ejecutar el seed de forma directa, continuando..."
fi

echo ">> Arrancando la app (API + SPA en http://localhost:${PORT})..."

# Ejecutar Node en primer plano para mantener el contenedor de Docker vivo de forma estable
exec npm start
