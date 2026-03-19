import { act, renderHook, waitFor } from '@testing-library/react'
import type { VBIQueryResult } from '@visactor/vbi'

import { useVSeed } from '@visactor/vbi-react'

import { createTestBuilder } from '../utils/createTestBuilder'

function createDeferred<T>() {
  let reject!: (error?: unknown) => void
  let resolve!: (value: T | PromiseLike<T>) => void

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return { promise, reject, resolve }
}

describe('useVSeed', () => {
  it('builds VSeed and exposes loading state', async () => {
    const builder = createTestBuilder({
      query: async () => ({
        dataset: [{ value: 1 }],
      }),
    })

    const { result } = renderHook(() => useVSeed(builder, { debounce: 0 }))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.vseed?.dataset).toEqual([{ value: 1 }])
    expect(result.current.vseed?.chartType).toBe('table')
  })

  it('ignores stale results after a newer build starts', async () => {
    const queries: Array<ReturnType<typeof createDeferred<VBIQueryResult>>> = []
    const builder = createTestBuilder({
      query: async () => {
        const deferred = createDeferred<VBIQueryResult>()
        queries.push(deferred)
        return deferred.promise
      },
    })

    const { result } = renderHook(() => useVSeed(builder, { debounce: 0 }))

    await waitFor(() => {
      expect(queries).toHaveLength(1)
    })

    act(() => {
      builder.chartType.changeChartType('line')
    })

    await waitFor(() => {
      expect(queries).toHaveLength(2)
    })

    await act(async () => {
      queries[0].resolve({ dataset: [{ value: 1 }] })
      await Promise.resolve()
    })

    expect(result.current.vseed).toBeNull()
    expect(result.current.loading).toBe(true)

    await act(async () => {
      queries[1].resolve({ dataset: [{ value: 2 }] })
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.vseed?.dataset).toEqual([{ value: 2 }])
    expect(result.current.vseed?.chartType).toBe('line')
  })
})
