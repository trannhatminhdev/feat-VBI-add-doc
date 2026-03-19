import { useSyncExternalStore } from 'react'

export function useBuilderObserver<T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T): T {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
