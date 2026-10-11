#!/bin/sh
# Respaldo diario cifrado con age (clave pública). El servidor no puede descifrar sus propios
# respaldos: la clave privada se guarda fuera del servidor. Conserva BACKUP_RETENTION_DAYS días.
set -eu
: "${AGE_RECIPIENT:?Define AGE_RECIPIENT con una clave pública age (age1...)}"
INTERVAL="${BACKUP_INTERVAL_SECONDS:-86400}"
KEEP="${BACKUP_RETENTION_DAYS:-14}"
umask 077
sleep 60
while true; do
  ts="$(date -u +%Y%m%dT%H%M%SZ)"
  out="/backups/acopio-${ts}.dump.age"
  if pg_dump -Fc --no-owner | age -r "$AGE_RECIPIENT" -o "${out}.tmp" && [ -s "${out}.tmp" ]; then
    mv "${out}.tmp" "$out"
    echo "respaldo creado: $(basename "$out")"
  else
    rm -f "${out}.tmp"
    echo "ERROR: falló el respaldo ${ts}" >&2
  fi
  find /backups -name 'acopio-*.dump.age' -type f -mtime +"$KEEP" -delete
  sleep "$INTERVAL"
done
