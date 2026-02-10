// Setup file for rstest
// This file runs before each test file

// Mock global Worker for browser-related tests
global.Worker = class MockWorker {
  constructor() {}
  terminate() {}
  postMessage() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

// Mock global URL methods if not available
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => 'blob:mock-url'
}
if (!global.URL.revokeObjectURL) {
  global.URL.revokeObjectURL = () => {}
}
