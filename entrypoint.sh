#!/bin/sh

# Salir inmediatamente si un comando falla
set -e

# Ejecuta el comando de migración de producción
echo "Running database migrations..."
npm run migration:run:prod

# Ejecuta el comando principal que se pasa al script
exec "$@"