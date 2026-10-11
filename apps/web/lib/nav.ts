/** Solo rutas internas: evita redirecciones abiertas a otros dominios. */
export function safeNext(value: string | null | undefined, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  if (value.startsWith('/entrar')) return fallback;
  return value;
}
