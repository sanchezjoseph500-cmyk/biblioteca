# Stage 1: build de la SPA (Vite)
FROM node:22-alpine AS build-frontend
WORKDIR /build/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: imagen final (API Express + SPA estática + MariaDB)
FROM node:22-alpine
RUN apk add --no-cache mariadb mariadb-client
WORKDIR /app
COPY biblioteca-backend/package*.json ./
RUN npm ci --omit=dev
COPY biblioteca-backend/ ./
RUN rm -f .env
COPY --from=build-frontend /build/frontend/dist /app/frontend-dist
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV PORT=3001 \
    STATIC_DIR=/app/frontend-dist \
    DB_HOST=127.0.0.1 \
    DB_PORT=3306 \
    DB_USER=biblioteca \
    DB_PASSWORD=biblioteca \
    DB_NAME=biblioteca \
    JWT_SECRET=biblioteca_central_secret_2024

EXPOSE 3001
CMD ["/usr/local/bin/entrypoint.sh"]