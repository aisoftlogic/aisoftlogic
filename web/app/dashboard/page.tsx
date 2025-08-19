'use client';

import { useAuth } from '@/src/contexts/AuthContext';

export default function DashboardPage() {
  const { loading, authenticated, keycloak } = useAuth();

  if (loading) return <main className="p-6">Loading…</main>;

  if (!authenticated) {
    return (
      <main className="p-6">
        <h1>Dashboard</h1>
        <p>You’re not logged in.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-2">
      <h1>Dashboard</h1>
      <p>Welcome, {keycloak?.tokenParsed?.preferred_username ?? 'user'}.</p>
    </main>
  );
}