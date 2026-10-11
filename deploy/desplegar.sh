#!/usr/bin/env bash
# Lo ejecuta GitHub Actions en el servidor (usuario `deploy`) tras publicar las imágenes.
# Recibe por stdin el token de GHCR (GITHUB_TOKEN del job: caduca al terminar el job).
# Variables: GHCR_USER, IMAGE_TAG (sha-… del commit desplegado).
set -euo pipefail
cd /opt/acopiospanama

docker login ghcr.io -u "$GHCR_USER" --password-stdin > /dev/null
trap 'docker logout ghcr.io > /dev/null 2>&1 || true' EXIT

# Fijamos la versión en .env: para volver atrás basta cambiar IMAGE_TAG y hacer `docker compose up -d`.
if grep -q '^IMAGE_TAG=' .env; then
  sed -i "s|^IMAGE_TAG=.*|IMAGE_TAG=$IMAGE_TAG|" .env
else
  echo "IMAGE_TAG=$IMAGE_TAG" >> .env
fi

docker compose pull --quiet
docker compose up -d --remove-orphans --wait --wait-timeout 180
docker image prune -f > /dev/null
docker compose ps --format 'table {{.Service}}\t{{.Status}}'
