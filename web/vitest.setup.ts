// vitest.setup.ts
import { afterEach, beforeAll, vi, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// 1) jest-dom matchers
expect.extend(matchers as any)

// 2) Auto-clean the DOM after every test
afterEach(() => {
  cleanup()
})

// 3) JSDOM / Node polyfills that are safe to add

beforeAll(() => {
  // --- TextEncoder / TextDecoder (used by many libs) ---
  const g = globalThis as any
  if (!g.TextEncoder || !g.TextDecoder) {
    const { TextEncoder, TextDecoder } = require('node:util')
    if (!g.TextEncoder) g.TextEncoder = TextEncoder
    if (!g.TextDecoder) g.TextDecoder = TextDecoder
  }

  // --- crypto.getRandomValues / crypto.randomUUID ---
  if (!globalThis.crypto) {
    // Node 20+ has a global crypto; fallback for older envs
    const { webcrypto } = require('node:crypto')
    ;(globalThis as any).crypto = webcrypto
  }
  if (!('randomUUID' in globalThis.crypto)) {
    const { randomUUID } = require('node:crypto')
    ;(globalThis.crypto as any).randomUUID = randomUUID
  }

  // --- matchMedia (used by UI libs / responsive code) ---
  if (!globalThis.matchMedia) {
    ;(globalThis as any).matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  }

  // --- ResizeObserver (charts, editors, etc.) ---
  if (!('ResizeObserver' in globalThis)) {
    ;(globalThis as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }

  // --- IntersectionObserver (lazy images, sentinels, etc.) ---
  if (!('IntersectionObserver' in globalThis)) {
    ;(globalThis as any).IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] }
      root = null
      rootMargin = ''
      thresholds = []
    }
  }

  // --- localStorage / sessionStorage stubs ---
  const makeStorage = () => {
    let store: Record<string, string> = {}
    return {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => { store[k] = String(v) },
      removeItem: (k: string) => { delete store[k] },
      clear: () => { store = {} },
      key: (i: number) => Object.keys(store)[i] ?? null,
      get length() { return Object.keys(store).length },
    }
  }
  if (!(globalThis as any).localStorage) (globalThis as any).localStorage = makeStorage()
  if (!(globalThis as any).sessionStorage) (globalThis as any).sessionStorage = makeStorage()

  // --- fetch (Node 20 has it; this is a safety net) ---
  if (!globalThis.fetch) {
    const { fetch, Headers, Request, Response } = require('undici')
    Object.assign(globalThis, { fetch, Headers, Request, Response })
  }

  // 4) Public env defaults so components don’t blow up if not set in test env
  process.env.NEXT_PUBLIC_API_URL ||= 'http://localhost:8000'
  process.env.NEXT_PUBLIC_KEYCLOAK_URL ||= 'http://localhost:8081'
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM ||= 'aisoftlogic-dev'
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ||= 'web'
})

// 5) (Optional) Quiet some extremely noisy console errors in tests
//    Uncomment if a library logs unavoidable warnings that clutter output.
// const originalError = console.error
// afterEach(() => { console.error = originalError })
// beforeAll(() => {
//   console.error = (...args: any[]) => {
//     const msg = String(args[0] ?? '')
//     if (msg.includes('Warning: An update to') || msg.includes('Deprecated')) return
//     originalError(...args)
//   }
// })