# Cómo contribuir

¡Gracias! Este proyecto existe para ayudar después de un desastre, así que priorizamos lo que hace el
directorio **más confiable, más rápido y más fácil de usar en un teléfono con mala señal**.

## Formas de ayudar

- **Probar en teléfonos reales**, sobre todo Android de gama baja y conexión 3G, y abrir issues con lo que falle.
- **Difundir**: que centros reales se publiquen y se mantengan al día.
- **Código**: revisa los issues con etiqueta `bueno-para-empezar` o `ayuda-bienvenida`.
- **Textos**: lenguaje claro para todas las edades y niveles digitales.

## Flujo de trabajo

1. Haz un fork y crea una rama desde `main` (`feat/filtro-por-distrito`, `fix/horario-medianoche`…).
2. Corre el proyecto en local (ver README) y escribe pruebas para lo que cambies en la API (`apps/api/test`).
3. Abre un PR con la plantilla. La CI corre tipos, pruebas contra PostgreSQL, el build web, la auditoría de
   dependencias, CodeQL y el build de las imágenes Docker.
4. Una persona mantenedora revisa. Al fusionar en `main` se publica y se despliega automáticamente.

Commits pequeños y descriptivos (se aceptan [Conventional Commits](https://www.conventionalcommits.org/es/)).

## Reglas que no se negocian

Estas reglas protegen a la gente que usa el directorio. Un PR que las rompa no se fusiona:

- **Privacidad:** los correos nunca son públicos. Los teléfonos y nombres de contacto solo se publican con
  consentimiento expreso. La ubicación del usuario («cerca de mí») nunca sale del navegador. No se guardan IPs:
  se usa un identificador diario cifrado.
- **Sin rastreadores:** nada de analítica de terceros, píxeles ni fuentes o scripts externos. La CSP es estricta;
  si un cambio la toca, explícalo.
- **Antifraude:** las fichas no pueden pedir dinero. No se debilita ese filtro sin una alternativa mejor.
- **Auto-mantenimiento:** se prefieren reglas automáticas a tareas manuales de moderación.
- **Base de datos:** los cambios van en una migración nueva (`apps/api/migrations/00N_*.sql`); nunca se editan
  migraciones ya publicadas.
- **Datos de prueba:** siempre ficticios (dominio `.test`). Nunca uses datos reales de personas en issues,
  PRs ni pruebas.

## Estilo

- TypeScript estricto. Validación de entrada con zod en la API.
- Interfaz con `@demogar/mola-ui`, en español de Panamá, de tú, móvil primero (375 px) y accesible.
- Mensajes de error útiles para personas, no códigos.

## Conducta

Al participar aceptas el [Código de conducta](CODE_OF_CONDUCT.md).
