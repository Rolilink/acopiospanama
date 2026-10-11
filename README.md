# Acopio Panamá

**Dónde llevar donaciones y qué necesitan hoy.** Directorio nacional y abierto de centros de acopio,
puntos de distribución, comedores y albergues en Panamá, creado tras el terremoto del 9 de octubre de 2026.

Lo mantiene la comunidad:

- **Cualquiera publica un centro** con su correo (sin contraseñas) y queda como responsable.
- **Cualquiera confirma** «estuve aquí y sigue funcionando» o **reporta** un problema.
- **Reglas automáticas** deciden qué se muestra. Nadie tiene que estar pendiente:
  - un centro sin confirmar en 72 h pasa a «sin confirmar», y a los 14 días deja de mostrarse;
  - con reportes de 2 personas se marca «verifica antes de ir»;
  - con 3 reportes graves (que pide dinero, que es falso o que cerró) se oculta, salvo que lo confirmen más personas de las que lo reportan;
  - las fichas **no pueden pedir dinero**: se bloquea al guardar;
  - quienes responden por un centro reciben un recordatorio de un toque para confirmar que sigue abierto.
- La moderación humana es solo el último recurso.

Cada ficha incluye el tipo de centro, quién lo organiza, la ubicación exacta (con botones de Google Maps y Waze),
el horario por día con «abierto ahora», el contacto (solo si esa persona lo acepta) y qué aceptan, qué es urgente
y qué ya no reciben.

> Si hay una emergencia, llama al **911**. Este directorio no reemplaza a SINAPROC ni a las autoridades.

## Contribuir

Es código abierto (MIT) y construido en público. Cualquier ayuda suma: código, diseño, textos, pruebas en
teléfonos reales y difusión. Lee [CONTRIBUTING.md](CONTRIBUTING.md). Cada PR corre la CI completa, y al
fusionarse en `main` se despliega solo.

## Stack

| Parte | Tecnología |
| --- | --- |
| API (`apps/api`) | NestJS 11, Kysely + PostgreSQL 16, migraciones SQL, `otplib`, `nodemailer` |
| Web (`apps/web`) | Next.js 16 (App Router), React 19, Tailwind v4, [`@demogar/mola-ui`](https://demogar.github.io/molaui/), Leaflet + OpenStreetMap |
| Infra | Docker, GitHub Actions → GHCR → VPS (Docker Compose + Caddy), respaldos cifrados con `age` |

## Correr en local

Requisitos: Node 22.23+ (o 24) y PostgreSQL 16.

```bash
npm ci
createuser -P acopio            # contraseña: acopio
createdb -O acopio acopio && createdb -O acopio acopio_test
cp apps/api/.env.example apps/api/.env.development   # ajusta DATABASE_URL si cambiaste el usuario
npm run build -w apps/api
(cd apps/api && set -a && . ./.env.development && set +a && npm run seed && npm start)   # API en :3011
npm run dev -w apps/web                                                                     # web en :3010
```

Abre http://localhost:3010. Para entrar, el código aparece en http://localhost:3010/api/dev/outbox, porque en
desarrollo no se envían correos. Los datos de demostración son ficticios. Para las pruebas:
`TEST_DATABASE_URL=postgresql://acopio:acopio@127.0.0.1:5432/acopio_test npm test`.

## Documentación

- [Cómo funciona por dentro](docs/ARQUITECTURA.md): reglas automáticas, privacidad y seguridad.
- [Despliegue y CI/CD](docs/DESPLIEGUE.md)
- [Seguridad](SECURITY.md) · [Código de conducta](CODE_OF_CONDUCT.md)
