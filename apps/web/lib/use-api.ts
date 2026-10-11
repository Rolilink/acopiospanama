'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api, ApiError } from './api';

/** Carga datos de la API con estados de carga/error y `reload()`. */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [tick, setTick] = useState(0);
  const pathRef = useRef(path);
  pathRef.current = path;

  useEffect(() => {
    if (!path) return;
    const ctrl = new AbortController();
    setLoading(true);
    api
      .get<T>(path, { signal: ctrl.signal })
      .then((d) => {
        if (pathRef.current === path) {
          setData(d);
          setError(null);
        }
      })
      .catch((e) => {
        if ((e as Error).name === 'AbortError') return;
        setError(e instanceof ApiError ? e : new ApiError(0, 'ERROR', 'Ocurrió un error inesperado.'));
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [path, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, loading, reload, setData };
}
