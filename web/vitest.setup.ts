import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { expect, afterEach, beforeAll } from 'vitest'

// extend Vitest's expect with jest-dom matchers
expect.extend(matchers as any)

// auto-clean after each test to avoid act() warnings in prod builds
afterEach(() => cleanup())

beforeAll(() => {
  // jsdom polyfills if needed later
})