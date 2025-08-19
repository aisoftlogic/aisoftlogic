'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type Keycloak from 'keycloak-js';
import { createKeycloak } from '@/src/lib/keycloak';

type AuthState = {
  loading: boolean;
  authenticated: boolean;
  hasKc: boolean;
  keycloak?: Keycloak;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState>({
  loading: true,
  authenticated: false,
  hasKc: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [kc, setKc] = useState<Keycloak | undefined>(undefined);
  const [hasKc, setHasKc] = useState(false);

  useEffect(() => {
    const bundle = createKeycloak();

    if (!bundle) {
      console.warn('AuthProvider: Keycloak not created. Likely SSR or missing env.');
      setHasKc(false);
      setLoading(false);
      return;
    }

    setHasKc(true);
    setKc(bundle.kc);
    // add this so your debug <details> can see it
    ;(window as any).__kc = bundle.kc;

    // safety timeout so UI doesn’t hang if KC is unreachable
    const timeoutId = setTimeout(() => {
      console.warn('AuthProvider: KC init timeout → proceeding as unauthenticated.');
      setLoading(false);
    }, 5000);

    bundle.kc
      .init(bundle.initOptions)
      .then((auth) => {
        clearTimeout(timeoutId);
        setAuthenticated(Boolean(auth));
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.error('AuthProvider: KC init failed', err);
        setLoading(false);
      });

    return () => clearTimeout(timeoutId);
  }, []);

  const value = useMemo<AuthState>(() => {
    const login = () => {
      if (!kc) return;
      kc.login({ redirectUri: window.location.origin + '/dashboard' });
    };
    const logout = () => {
      if (!kc) return;
      kc.logout({ redirectUri: window.location.origin + '/' });
    };

    return {
      loading,
      authenticated,
      hasKc,
      keycloak: kc,
      login,
      logout,
    };
  }, [loading, authenticated, hasKc, kc]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);