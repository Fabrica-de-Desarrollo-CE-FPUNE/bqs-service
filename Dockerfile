# --- 1. Etapa de Construcción (Builder) ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- 2. Etapa de Producción ---
FROM node:22-alpine

WORKDIR /app

# 1. Crea un grupo y un usuario dedicados para la aplicación
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia los archivos de dependencias e instálalos como root
COPY package*.json ./
RUN npm install --omit=dev

# Copia el código compilado desde la etapa 'builder'
COPY --from=builder /app/dist ./dist

# 2. Asigna la propiedad de los archivos al nuevo usuario
RUN chown -R appuser:appgroup /app

# 3. Cambia al usuario no-root
USER appuser

EXPOSE 3000
CMD ["npm", "run", "start"]