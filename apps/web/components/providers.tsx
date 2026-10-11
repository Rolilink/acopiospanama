'use client';

import { ToastProvider } from '@demogar/mola-ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
