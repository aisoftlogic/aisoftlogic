'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider } from '@/src/contexts/AuthContext';

export default function Providers({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}