import { beforeAll, vi } from 'vitest'
import 'vi-canvas-mock'
import { WorkerMock } from './tests/__mocks__/worker.mock'

beforeAll(async () => {
  await import('@visactor/vchart')
  await import('@visactor/vtable')
})

// Mock Web Worker
beforeAll(() => {
  // @ts-ignore
  global.Worker = WorkerMock

  // Mock URL.createObjectURL for Worker creation
  global.URL.createObjectURL = vi.fn((blob: Blob) => {
    return 'blob:mock-url'
  })

  global.URL.revokeObjectURL = vi.fn()
})

beforeAll(() => {
  // 1. 优化 Canvas mock
  vi.spyOn(CanvasRenderingContext2D.prototype, 'createLinearGradient').mockImplementation(() => ({
    addColorStop: vi.fn(),
  }))

  vi.spyOn(CanvasRenderingContext2D.prototype, 'createRadialGradient').mockImplementation(() => ({
    addColorStop: vi.fn(),
  }))

  // 2. 优化 ResizeObserver
  if (!window.ResizeObserver) {
    window.ResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  }
})
