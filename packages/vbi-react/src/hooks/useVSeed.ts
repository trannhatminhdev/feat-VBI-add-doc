import { useEffect, useRef, useState } from 'react'
import type { VBIChartBuilder } from '@visactor/vbi'
import type { VSeedDSL } from '@visactor/vseed'

import { useBuilderObserver } from '../internal'

export interface UseVSeedOptions {
  debounce?: number
  onError?: (error: Error) => void
}

export interface UseVSeedReturn {
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
  vseed: VSeedDSL | null
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (delay <= 0) {
      setDebouncedValue(value)
      return
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [delay, value])

  return debouncedValue
}

export function useVSeed(builder: VBIChartBuilder, options: UseVSeedOptions = {}): UseVSeedReturn {
  const { debounce = 300, onError } = options
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)
  const [vseed, setVseed] = useState<VSeedDSL | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const buildRef = useRef<() => Promise<void>>(async () => undefined)
  const onErrorRef = useRef(onError)

  onErrorRef.current = onError

  const dslSignature = useBuilderObserver(
    (callback) => {
      const handleUpdate = () => {
        callback()
      }

      builder.doc.on('update', handleUpdate)

      return () => {
        builder.doc.off('update', handleUpdate)
      }
    },
    () => JSON.stringify(builder.build()),
  )

  const debouncedDslSignature = useDebouncedValue(dslSignature, debounce)

  buildRef.current = async () => {
    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const nextVseed = await builder.buildVSeed({ signal: controller.signal })

      if (controller.signal.aborted || abortControllerRef.current !== controller) {
        return
      }

      setVseed(nextVseed)
    } catch (caughtError) {
      if (controller.signal.aborted || abortControllerRef.current !== controller || isAbortError(caughtError)) {
        return
      }

      const nextError = caughtError instanceof Error ? caughtError : new Error('Failed to build VSeed')
      setError(nextError)
      onErrorRef.current?.(nextError)
    } finally {
      if (abortControllerRef.current === controller && !controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    void buildRef.current()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [builder, debouncedDslSignature])

  return {
    error,
    loading,
    refetch: () => buildRef.current(),
    vseed,
  }
}
