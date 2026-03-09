# --- Etapa de Construcción ---
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa de Producción ---
FROM node:22-bookworm-slim

# 1. Instalar Google Chrome (esto instala TODAS las dependencias de sistema necesarias)
RUN apt-get update && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Configurar usuario y entorno
RUN groupadd -r appuser && useradd -r -g appuser -m appuser
# Forzamos a Puppeteer a usar el Chrome que acabamos de instalar
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# 3. Instalar dependencias de ejecución y copiar build
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

# 4. Permisos y ejecución
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3005
CMD ["npm", "run", "start"]