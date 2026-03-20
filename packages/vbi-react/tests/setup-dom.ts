import { cleanup } from '@testing-library/react'
import { Window } from 'happy-dom'
import { afterEach } from 'vitest'

const windowInstance = new Window({
  url: 'http://localhost',
})

const assignGlobal = (key: PropertyKey, value: unknown) => {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    writable: true,
    value,
  })
}

assignGlobal('window', windowInstance)
assignGlobal('self', windowInstance)
assignGlobal('document', windowInstance.document)
assignGlobal('navigator', windowInstance.navigator)

for (const key of [
  'AbortController',
  'AbortSignal',
  'CSSStyleSheet',
  'CustomEvent',
  'Element',
  'Event',
  'EventTarget',
  'HTMLElement',
  'MutationObserver',
  'Node',
  'SVGElement',
  'Text',
  'getComputedStyle',
  'requestAnimationFrame',
  'cancelAnimationFrame',
] as const) {
  const value = windowInstance[key]
  if (value !== undefined) {
    assignGlobal(key, value)
  }
}

afterEach(() => {
  cleanup()
  document.body.innerHTML = ''
})
