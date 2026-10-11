# Despliegue y CI/CD

## Cómo fluye un cambio

```
PR (fork o rama) ─▶ CI: tipos · pruebas con PostgreSQL · build web · npm audit · CodeQL · build Docker
                       (sin secretos; los PR de forks no pueden publicar ni desplegar)
merge a main ─────▶ CI otra vez ─▶ imágenes a GHCR (latest + sha) ─▶ webhook de Coolify ─▶ /api/health
```

El servidor nunca compila: solo descarga imágenes. Por eso convive bien con otras apps en un VPS pequeño.

## Puesta en marcha (una vez)

### 1. GitHub

1. Repo público `demogar/acopiospanama`.
2. *Settings › Branches › Add rule* para `main`:
   - Require a pull request before merging, con 1 aprobación y revisión de Code Owners.
   - Require status checks to pass: `API · tipos y pruebas`, `Web · tipos y build`, `Dependencias`,
     `Imágenes Docker (api)`, `Imágenes Docker (web)` e `Imágenes Docker (backup)`.
   - Do not allow bypassing the above settings (opcional).
3. *Settings › Actions › General*: «Require approval for all outside collaborators» en los workflows de forks.
4. *Settings › Environments › production*: opcionalmente añade revisores obligatorios para aprobar cada despliegue.
5. Tras el primer `push` a `main`, en *Packages* marca como **públicas** las imágenes
   `acopiospanama-api`, `acopiospanama-web` y `acopiospanama-backup`. Así Coolify las descarga sin credenciales.
   Si prefieres mantenerlas privadas, configura en Coolify un registro con un token de solo lectura.

### 2. Coolify

1. *New Resource › Docker Compose*, desde este repositorio (rama `main`, archivo `docker-compose.yml`).
   Coolify usa las imágenes de GHCR y no construye nada.
2. Variables: copia `deploy/.env.example` y complétalas (`openssl rand -base64 48` para los secretos).
3. Dominio: asigna `https://tu-dominio` **solo al servicio `web` (puerto 3000)**. Nunca expongas `api` ni `db`.
4. En el recurso: *Webhooks › Deploy webhook* (copia la URL) y en *Keys & Tokens › API tokens* crea un token
   con permiso de despliegue.
5. En GitHub, *Settings › Secrets and variables › Actions*:
   - Secret `COOLIFY_WEBHOOK_URL` = URL del webhook de despliegue.
   - Secret `COOLIFY_TOKEN` = el token.
   - Variable `PUBLIC_URL` = `https://tu-dominio`, para la verificación posterior.

Desde ese momento, cada merge a `main` se despliega solo. Para volver a una versión anterior, cambia en
Coolify `IMAGE_TAG` al `sha-…` de un commit anterior y redespliega.

### 3. Primer administrador

```bash
# En Coolify › api › Terminal (o docker compose exec api …)
node dist/cli/cli.js make-admin --email tu-correo@ejemplo.com
```

Entra en `/entrar` con ese correo y configura el segundo factor. Desde `/moderacion` puedes nombrar a otros
moderadores. Otros comandos: `make-moderator`, `revoke-role`, `reset-mfa`, `retention`, `reminders` y
`revoke-all-sessions`.

## Convivir con otra app en el mismo servidor

- El compose limita cada servicio: API y web, 384 MB y 0,75 CPU cada una; PostgreSQL, 256 MB. En total son
  ~1 GB como máximo, así que caben junto a otra app en un servidor de 4 GB.
- Cada app es un recurso de Coolify independiente, con su propia base de datos y red. Solo comparten el proxy.
- La lista pública se cachea 30 s en la API y se sirve con `Cache-Control: public`. Si hay un pico fuerte,
  pon Cloudflare delante del dominio (gratis) para que absorba el tráfico; si añades ese salto, ajusta `TRUST_PROXY`.
- El mapa usa las teselas de OpenStreetMap, que exige atribución y no admite tráfico masivo. Si el sitio crece,
  cambia `MAP_TILE_HOST` a un proveedor propio (MapTiler, Stadia, etc.).

## Respaldos

El servicio `backup` hace un `pg_dump` diario cifrado con la clave pública `age` (`BACKUP_AGE_RECIPIENT`) en
`./backups` y conserva 14 días. Copia esos archivos fuera del servidor. Para restaurar:

```bash
age -d -i acopio-respaldos.key backups/acopio-AAAAMMDDTHHMMSSZ.dump.age > /tmp/r.dump
docker compose exec -T db pg_restore --clean --if-exists --no-owner -U acopio -d acopio < /tmp/r.dump && rm /tmp/r.dump
docker compose exec api node dist/cli/cli.js revoke-all-sessions
```
