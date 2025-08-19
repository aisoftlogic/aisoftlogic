// src/__tests__/auth.context.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

// 1) Hoist-safe mock KC instance
const { mockKC } = vi.hoisted(() => {
  const mk = {
    init: vi.fn().mockResolvedValue(false), // unauthenticated by default
    login: vi.fn(),
    logout: vi.fn(),
    token: 't',
    tokenParsed: {},
    refreshToken: 'rt',
  }
  return { mockKC: mk }
})

// 2) Mock the module that AuthContext imports
vi.mock('@/src/lib/keycloak', () => {
  return {
    createKeycloak: () => ({
      kc: mockKC,
      initOptions: { onLoad: 'check-sso' },
    }),
  }
})

// Import AFTER the mock
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext'

function Harness() {
  const { login, logout } = useAuth()
  return (
    <div>
      <button onClick={login}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

beforeEach(() => {
  process.env.NEXT_PUBLIC_KEYCLOAK_URL = 'http://localhost:8081'
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM = 'aisoftlogic'
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID = 'web'

  vi.clearAllMocks()
  mockKC.init = vi.fn().mockResolvedValue(false)
  mockKC.login = vi.fn()
  mockKC.logout = vi.fn()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('AuthContext', () => {
  it('initializes Keycloak and exposes unauthenticated state', async () => {
    render(
      <AuthProvider>
        <div>hello</div>
      </AuthProvider>
    )

    // waitFor is act-aware; this resolves the async state update
    await waitFor(() => expect(mockKC.init).toHaveBeenCalledTimes(1))
  })

  it('calls kc.login and kc.logout', async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    )

    await waitFor(() => expect(mockKC.init).toHaveBeenCalledTimes(1))

    fireEvent.click(screen.getByText('login'))
    expect(mockKC.login).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByText('logout'))
    expect(mockKC.logout).toHaveBeenCalledTimes(1)
  })
})