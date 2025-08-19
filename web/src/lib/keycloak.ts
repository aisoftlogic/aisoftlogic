// src/lib/keycloak.ts
'use client';

import Keycloak, { KeycloakInitOptions } from 'keycloak-js';

export type KCBundle = {
  kc: Keycloak;
  initOptions: KeycloakInitOptions;
};

export function createKeycloak(): KCBundle | undefined {
  // Only in the browser
  if (typeof window === 'undefined') return undefined;

  const url = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
  const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
  const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

  if (!url || !realm || !clientId) {
    console.error('Keycloak env missing', { url, realm, clientId });
    return undefined;
  }

  const kc = new Keycloak({ url, realm, clientId });

  const initOptions: KeycloakInitOptions = {
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    checkLoginIframe: false,
    pkceMethod: 'S256',
    flow: 'standard',
  };

  return { kc, initOptions };
}