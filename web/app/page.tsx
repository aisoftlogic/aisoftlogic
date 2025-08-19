'use client';

import { useAuth } from '@/src/contexts/AuthContext';

export default function Home() {
  const { loading, authenticated, hasKc, login, logout } = useAuth();

  return (
    <main className="p-6 space-y-4">
      <h1>AiSoftLogic</h1>
      <p>Welcome to the platform.</p>

      {loading ? (
        <p>Checking session…</p>
      ) : authenticated ? (
        <div className="space-x-3">
          <a className="underline" href="/dashboard">Go to Dashboard</a>
          <button className="underline" onClick={logout}>Logout</button>
        </div>
      ) : (
        <button className="underline" onClick={login}>
          Login
        </button>
      )}

      <details>
        <summary>Auth debug</summary>
        <pre className="text-sm">
{JSON.stringify(
  {
    loading,
    authenticated,
    hasKc,
    kcRealm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
    kcUrl: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
    kcClient: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  },
  null,
  2
)}
        </pre>
      </details>
    </main>
  );
}