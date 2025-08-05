/**
 * Jest setup file for vue-draggable-next tests
 * This file runs before each test file
 */

import { config } from '@vue/test-utils'

// Mock Sortable.js globally since it's used in all tests
jest.mock('sortablejs', () => {
  const mockSortableInstance = {
    option: jest.fn(),
    destroy: jest.fn(),
    toArray: jest.fn(() => []),
    sort: jest.fn(),
    save: jest.fn(),
    closest: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  }

  return {
    create: jest.fn(() => mockSortableInstance),
    version: '1.14.0',
    // Mock static methods
    get: jest.fn(),
    set: jest.fn(),
    mount: jest.fn(),
    utils: {
      on: jest.fn(),
      off: jest.fn(),
      css: jest.fn(),
      find: jest.fn(),
      is: jest.fn(),
      closest: jest.fn(),
      toggleClass: jest.fn(),
      clone: jest.fn(),
      index: jest.fn(),
    },
  }
})

// Mock DOM APIs that might not be available in jsdom
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
    marginTop: '0px',
    marginLeft: '0px',
  }),
})

// Mock drag events
const createMockDragEvent = (type: string, data: any = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, {
    dataTransfer: {
      setData: jest.fn(),
      getData: jest.fn(),
      setDragImage: jest.fn(),
      dropEffect: 'move',
      effectAllowed: 'all',
    },
    ...data,
  })
  return event
}

// Add helper methods to global scope for tests
declare global {
  var createMockDragEvent: (type: string, data?: any) => Event
}
;(global as any).createMockDragEvent = createMockDragEvent

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 16)
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}

// Mock IntersectionObserver if needed for future features
;(global as any).IntersectionObserver = class MockIntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  get root() {
    return null
  }
  get rootMargin() {
    return '0px'
  }
  get thresholds() {
    return []
  }
  takeRecords() {
    return []
  }
}

// Mock ResizeObserver if needed for future features
;(global as any).ResizeObserver = class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Suppress Vue warnings in tests unless explicitly testing them
if (config.global?.config) {
  config.global.config.warnHandler = (msg: string) => {
    // Only log warnings that are test-relevant
    if (msg.includes('Invalid prop') || msg.includes('Missing required prop')) {
      console.warn(msg)
    }
  }
}

// Helper to wait for next tick in tests
export const flushPromises = () => new Promise(resolve => setImmediate(resolve))

// Helper to simulate drag and drop
export const simulateDragAndDrop = async (
  sourceElement: Element,
  targetElement: Element,
  options: any = {}
) => {
  const dragStartEvent = createMockDragEvent('dragstart', options)
  const dragEvent = createMockDragEvent('drag', options)
  const dragEndEvent = createMockDragEvent('dragend', options)
  const dropEvent = createMockDragEvent('drop', options)

  sourceElement.dispatchEvent(dragStartEvent)
  sourceElement.dispatchEvent(dragEvent)
  targetElement.dispatchEvent(dropEvent)
  sourceElement.dispatchEvent(dragEndEvent)

  await flushPromises()
}

// Helper to create test data
export const createTestItem = (overrides: any = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'Test Item',
  ...overrides,
})

export const createTestList = (count: number = 3) => {
  return Array.from({ length: count }, (_, index) =>
    createTestItem({ id: index + 1, name: `Item ${index + 1}` })
  )
}

// Console mocking helpers
export const mockConsole = () => {
  const originalConsole = { ...console }

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  return originalConsole
}

// Local storage mock
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {}

  const mockStorage = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    get length() {
      return Object.keys(store).length
    },
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  }

  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  })

  return mockStorage
}

// Fetch mock helper
export const mockFetch = (responseData: any = {}, ok: boolean = true) => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      status: ok ? 200 : 400,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve(JSON.stringify(responseData)),
    })
  )

  return global.fetch as jest.MockedFunction<typeof fetch>
}
