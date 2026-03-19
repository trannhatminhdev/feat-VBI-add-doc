# @visactor/vbi-react Design Document

## 0. Status Tracking

**Last Updated**: 2026-03-19

This file is a living design and delivery record. It must stay aligned with the actual repository state.

**Status Legend**:

- **Completed**: code already exists in the repository
- **In Progress**: partially implemented or implemented but not yet fully verified
- **Pending**: not started yet

### Current Delivery Status

| Area                                                              | Status          | Notes                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/vbi-react` package scaffold                             | **Completed**   | `package.json`, `tsconfig`, `rslib`, `vitest`, `eslint`, `README` are added                                                                                                                                                                       |
| Core hooks: `useVBI`, `useVSeed`                                  | **Completed**   | Implemented in `packages/vbi-react/src/hooks/` and verified by package tests                                                                                                                                                                      |
| Basic field hooks: `useChartType`, `useMeasures`, `useDimensions` | **Completed**   | Implemented against current `@visactor/vbi` builder APIs; `useChartType` and `useMeasures` are covered by package tests, while `useDimensions` follows the same pattern but still lacks dedicated test coverage                                   |
| `buildVSeed({ signal })` support in `@visactor/vbi`               | **Completed**   | `signal` is now accepted by `VBIBuilder.buildVSeed` and forwarded to `connector.query`                                                                                                                                                            |
| `useWhereFilter`, `useHavingFilter`                               | **Completed**   | Implemented as reactive snapshots plus mutation callbacks around the singular `whereFilter` / `havingFilter` builder APIs and verified by package tests                                                                                           |
| `@visactor/vbi-react/components` submodule                        | **In Progress** | Starter submodule now exports `FieldPanel`, `ChartTypeSelector`, `ChartRenderer`, and `BuilderLayout`; `FilterPanel`, `ThemeSelector`, and richer renderer integration are still pending                                                       |
| `practices/professional` components validation                    | **In Progress** | `practices/professional` now includes a switchable `vbi-react Starter` preview that validates `FieldPanel`, `ChartTypeSelector`, `ChartRenderer`, and `BuilderLayout`; loading demo data in starter mode refreshes the available fields from the same explicit supermarket schema used by the other demos, parses quoted CSV rows correctly before seeding local data, recreates the local dataset when that schema changes, keeps dimension / measure selection explicit, and surfaces build errors directly in the preview while keeping the summary / DSL sections stacked below the builder so they no longer overlap the editing canvas; deeper end-to-end migration and formal verification are still pending |
| Website docs / examples integration                               | **Pending**     | Components should double as site examples                                                                                                                                                                                                         |
| Verification (`typecheck`, tests, build, lint`)                   | **In Progress** | Under Node `24.12.0`, `@visactor/vbi-react` tests, `typecheck`, and `build` pass with the starter components included; `lint` still needs dedicated follow-up, and `@visactor/vbi` currently has upstream typecheck issues in chart-type enums    |

## 1. Current Architecture Analysis

### 1.1 VBIBuilder Responsibilities

**File**: `packages/vbi/src/builder/builder.ts`

```
VBIBuilder
├── doc: Y.Doc              # Yjs document
├── dsl: Y.Map              # DSL storage
├── adapters                # buildVQuery / buildVSeed pipeline hooks
├── undoManager             # Undo/redo
├── chartType: ChartTypeBuilder
├── measures: MeasuresBuilder
├── dimensions: DimensionsBuilder
├── havingFilter: HavingFilterBuilder
├── whereFilter: WhereFilterBuilder
├── theme: ThemeBuilder
├── locale: LocaleBuilder
└── limit: LimitBuilder

Core Methods:
├── buildVSeed(options?) → Promise<TSeedDSL>  # Async build via adapters
├── buildVQuery() → TQueryDSL
└── build() → VBIDSL
```

### 1.2 Yjs in State Management

```typescript
// VBIBuilder constructor (builder.ts)
constructor(doc: Y.Doc, options?: VBIBuilderOptions<TQueryDSL, TSeedDSL>) {
  this.doc = doc
  this.dsl = doc.getMap('dsl') as Y.Map<any>
  this.adapters = resolveVBIBuilderAdapters(options?.adapters)
  // sub-builders share the same Yjs doc
  this.undoManager = new UndoManager(this.dsl)
  this.chartType = new ChartTypeBuilder(doc, this.dsl)
  this.measures = new MeasuresBuilder(doc, this.dsl)
  // ...
}

// Change listener pattern (chart-type-builder.ts:27-37)
observe(callback: ObserveCallback): () => void {
  const wrapper: ObserveCallback = (e, trans) => {
    if (e.keysChanged.has('chartType')) {
      callback(e, trans)
    }
  }
  this.dsl.observe(wrapper)
  return () => {
    this.dsl.unobserve(wrapper)
  }
}
```

**Key Findings**:

- Yjs is the **only** source of truth for state changes
- `doc.on('update', callback)` listens to global changes
- Each sub-builder can listen to its own fields separately

### 1.3 buildVSeed Pipeline

```typescript
// builder.ts + builder/adapters/vquery-vseed/build-vseed.ts
public buildVSeed = async (options?: { signal?: AbortSignal }): Promise<TSeedDSL> => {
  // 1. Build the normalized VBIDSL snapshot
  const vbiDSL = this.build()

  // 2. Build query through the configured adapter
  const queryDSL = this.adapters.buildVQuery({
    dsl: this.dsl,
    vbiDSL,
    builder: this,
  })

  // 3. Build VSeed through the configured adapter
  return this.adapters.buildVSeed({
    dsl: this.dsl,
    vbiDSL,
    queryDSL,
    options: options ?? {},
    builder: this,
  })
}
```

**Pipeline Stages**:

1. `build()` → VBIDSL (sync)
2. `adapters.buildVQuery()` → Query DSL (sync)
3. `adapters.buildVSeed()` → VSeed DSL (async)
4. Default adapter calls `connector.query({ ..., signal })` and merges dataset + field metadata

### 1.4 practices/demo Hooks Implementation Analysis

**File**: `practices/demo/src/hooks/useVBI.ts`

```typescript
// ⚠️ Issue 1: Two useEffects listening to the same event
useEffect(() => {
  const updateHandler = async () => {
    /* buildVSeed */
  }
  builder.doc.on('update', updateHandler)
  return () => builder.doc.off('update', updateHandler)
}, [builder])

useEffect(() => {
  // Initialize calls again
  const initialize = async () => {
    const newVSeed = await builder.buildVSeed()
    // ...
  }
  initialize()
}, [builder])
```

**Issues Summary**:

| Issue               | Description                                             |
| ------------------- | ------------------------------------------------------- |
| Duplicate listeners | Two useEffects listening to doc 'update' triggers twice |
| No debounce         | Rapid changes trigger multiple buildVSeed calls         |
| No error handling   | Async errors not caught                                 |
| No cancellation     | Async operations may update state after unmount         |
| Type safety         | any type abuse                                          |

---

## 2. Design Goals and Responsibilities

### 2.1 Design Goals

| Goal                    | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| **Headless**            | No UI framework binding, only provides business logic interfaces |
| **React 18 Compatible** | Uses useSyncExternalStore for render consistency                 |
| **Type Safe**           | Complete TypeScript type inference                               |
| **Extensible**          | Easy to add new hooks and features                               |
| **No Global State**     | Users manage VBIBuilder instances themselves                     |
| **Dual Usage Modes**    | Hooks for deep customization, slim components for rapid setup    |

### 2.2 State Ownership

This is the core concept of headless architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     VBI Architecture                         │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Yjs Doc (Source of Truth)               │  │
│   │   - Single source of data                           │  │
│   │   - Collaborative editing support                   │  │
│   │   - Immutable updates                               │  │
│   └─────────────────────────────────────────────────────┘  │
│                          ▲                                  │
│                          │                                  │
│              ┌───────────┴───────────┐                     │
│              │                       │                     │
│   ┌──────────▼──────────┐  ┌────────▼─────────┐         │
│   │   @visactor/vbi     │  │ @visactor/vbi-  │         │
│   │   (Core Logic)      │  │ react (Adapter) │         │
│   │                     │  │                 │         │
│   │  - VBIBuilder      │  │ - useVBI        │         │
│   │  - Sub-builders   │  │ - useVSeed      │         │
│   │  - Pipeline       │  │ - useChartType  │         │
│   └───────────────────┘  └─────────────────┘         │
│                          │                               │
│                          ▼                                │
│   ┌─────────────────────────────────────────────────┐    │
│   │              React Components                     │    │
│   │   - Only as subscriber, doesn't hold state     │    │
│   │   - Gets data through hooks                     │    │
│   └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Core Principles**:

- **Yjs doc** is the single source of truth
- **React is just a subscriber**, doesn't hold state
- All state changes must go through Yjs

### 2.3 vbi-react Responsibilities

#### What It Is Responsible For

| Responsibility                | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| **React State Sync**          | Sync Yjs state changes to React state               |
| **Lifecycle Management**      | Properly register/unregister Yjs listeners          |
| **Async Pipeline Management** | buildVSeed loading/error/cancellation               |
| **Hooks API**                 | Stable, type-safe hooks                             |
| **Components Module**         | Provide slim components built entirely on hooks     |
| **Best-Practice Examples**    | Components should double as official usage examples |

#### What It Is NOT Responsible For

| Responsibility                | Description                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------- |
| **VBIBuilder Implementation** | Provided by @visactor/vbi                                                       |
| **Yjs Document Creation**     | Created by caller or user code                                                  |
| **UI Rendering**              | Completely headless                                                             |
| **Connector Implementation**  | Provided by @visactor/vbi                                                       |
| **VSeed Rendering**           | Handled by @visactor/vseed rendering layer                                      |
| **Heavy All-in-One UI**       | Components should stay minimal and avoid absorbing overly specific requirements |

---

## 3. API Design

### Design Decision: No Global Provider

The library does not provide a global Provider. Users manage `VBIBuilder` instances themselves, which allows multiple independent builders in the same application.

### Hook Signature Pattern

All hooks receive `builder` as the first argument:

```typescript
useMeasures(builder)
useDimensions(builder)
useChartType(builder)
useVSeed(builder)
```

This approach:

- ✅ Provides explicit dependency tracking
- ✅ Supports multiple independent builders
- ✅ No hidden global state
- ✅ Easy to test and reason about

---

## 4. React Integration (useSyncExternalStore)

### 4.1 Why useSyncExternalStore

React 18 recommends using `useSyncExternalStore` to subscribe to external state:

| Advantage              | Description                                       |
| ---------------------- | ------------------------------------------------- |
| **Render Consistency** | React guarantees data consistency between renders |
| **Concurrent Mode**    | Correctly handles React 18 concurrent rendering   |
| **SSR Support**        | No hydration mismatch in server-side rendering    |
| **Performance**        | Avoids unnecessary re-renders                     |

**Used by**:

- Redux
- Zustand
- TanStack Query
- Jotai

### 4.2 Design Pattern

```typescript
// packages/vbi-react/src/internal/useBuilderSync.ts

import { useSyncExternalStore } from 'react'

export function useBuilderSync<T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T): T {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot, // serverSnapshot for SSR
  )
}
```

### 4.3 Usage Example

```typescript
export function useChartType(builder: VBIBuilder) {
  const chartType = useSyncExternalStore(
    (callback) => builder.chartType.observe(callback),
    () => builder.chartType.getChartType(),
    () => builder.chartType.getChartType(),
  )

  const availableChartTypes = builder.chartType.getAvailableChartTypes()

  return {
    chartType,
    availableChartTypes,
    setChartType: builder.chartType.changeChartType.bind(builder.chartType),
  }
}
```

### 4.4 Alternative Implementation

The hooks could also be implemented using `useEffect + setState`. However, `useSyncExternalStore` is preferred because:

1. **Official React Solution** - It's the officially recommended API for external stores
2. **Render Consistency** - Automatically handles concurrent mode
3. **SSR Compatibility** - Built-in support for server-side rendering
4. **Industry Standard** - Used by Redux, Zustand, TanStack Query

```typescript
// Alternative: useEffect + setState approach
function useChartTypeAlternative(builder: VBIBuilder) {
  const [chartType, setChartType] = useState(() => builder.chartType.getChartType())

  useEffect(() => {
    const handleChange = () => {
      setChartType(builder.chartType.getChartType())
    }

    const unobserve = builder.chartType.observe(handleChange)
    return unobserve
  }, [builder])

  return {
    chartType,
    availableChartTypes: builder.chartType.getAvailableChartTypes(),
    setChartType: builder.chartType.changeChartType.bind(builder.chartType),
  }
}
```

### 4.5 useEffect vs useSyncExternalStore Comparison

| Aspect             | useEffect               | useSyncExternalStore   |
| ------------------ | ----------------------- | ---------------------- |
| Render Consistency | ❌ May be inconsistent  | ✅ Guaranteed by React |
| Concurrent Mode    | ⚠️ May have issues      | ✅ Fully compatible    |
| SSR                | ⚠️ Needs extra handling | ✅ Built-in support    |
| Code Complexity    | Lower                   | Slightly higher        |

---

## 5. Hooks API Design

### 5.1 Core Types

### 5.2 Infrastructure: useBuilderObserver

useBuilderObserver is the core abstraction for subscribing to builder submodule changes:

```typescript
// packages/vbi-react/src/internal/useBuilderObserver.ts

import { useSyncExternalStore } from 'react'

export function useBuilderObserver<T>(subscribe: (callback: () => void) => () => void, getSnapshot: () => T): T {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
```

### 5.3 useVBI Hook

```typescript
// packages/vbi-react/src/hooks/useVBI.ts

import { useSyncExternalStore } from 'react'
import type { VBIBuilder, VBIDSL } from '@visactor/vbi'

export interface UseVBIReturn {
  dsl: VBIDSL
  builder: VBIBuilder
}

/**
 * Core Hook: Get VBIBuilder and DSL state
 * Uses useSyncExternalStore for React render consistency
 *
 * @example
 * const { dsl, builder } = useVBI(myBuilder)
 *
 * // Modify DSL
 * builder.chartType.changeChartType('bar')
 */
export function useVBI(builder: VBIBuilder): UseVBIReturn {
  const dsl = useSyncExternalStore(
    (callback) => {
      builder.doc.on('update', callback)
      return () => builder.doc.off('update', callback)
    },
    () => builder.build(),
    () => builder.build(), // SSR snapshot
  )

  return { dsl, builder }
}
```

### 5.4 useVSeed Hook

```typescript
// packages/vbi-react/src/hooks/useVSeed.ts

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react'
import type { VBIBuilder } from '@visactor/vbi'
import type { VSeedDSL } from '@visactor/vseed'

export interface UseVSeedOptions {
  builder: VBIBuilder
  /** Debounce delay in ms, default 300 */
  debounce?: number
  /** Custom error handler */
  onError?: (error: Error) => void
}

export interface UseVSeedReturn {
  vseed: VSeedDSL | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Internal hook: Debounced value
 */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook: Build VSeed DSL
 * Uses AbortController to cancel in-flight requests
 * Single subscription via debounced DSL change
 *
 * @example
 * const { vseed, loading, error, refetch } = useVSeed(myBuilder, { debounce: 300 })
 *
 * return <VChart spec={vseed?.spec} />
 */
export function useVSeed(builder: VBIBuilder, options: UseVSeedOptions = {}): UseVSeedReturn {
  const { debounce = 300, onError } = options

  const [vseed, setVseed] = useState<VSeedDSL | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Use useSyncExternalStore to subscribe to DSL changes (single subscription source)
  const dsl = useSyncExternalStore(
    (callback) => {
      builder.doc.on('update', callback)
      return () => builder.doc.off('update', callback)
    },
    () => builder.build(),
    () => builder.build(),
  )

  // Use debounced value to trigger build
  const debouncedDsl = useDebouncedValue(dsl, debounce)

  // AbortController for cancelling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null)
  const isUnmountedRef = useRef(false)

  const build = useCallback(async () => {
    // Cancel previous request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const result = await builder.buildVSeed({
        signal: abortControllerRef.current.signal,
      })

      // Check if cancelled or unmounted
      if (isUnmountedRef.current || abortControllerRef.current.signal.aborted) {
        return
      }

      setVseed(result)
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      if (!isUnmountedRef.current) {
        if (err instanceof Error) {
          setError(err)
          onError?.(err)
        }
      }
    } finally {
      if (!isUnmountedRef.current) {
        setLoading(false)
      }
    }
  }, [builder, onError])

  // Trigger build on debounced DSL change (single subscription)
  useEffect(() => {
    isUnmountedRef.current = false
    build()
  }, [debouncedDsl, build]) // eslint-disable-line react-hooks/exhaustive-deps

  return { vseed, loading, error, refetch: build }
}
```

### 5.5 useChartType Hook

```typescript
// packages/vbi-react/src/hooks/useChartType.ts

import { useSyncExternalStore } from 'react'
import type { VBIBuilder } from '@visactor/vbi'

export interface UseChartTypeReturn {
  chartType: string
  availableChartTypes: string[]
  setChartType: (chartType: string) => void
}

/**
 * Hook: Manage chart type
 * Uses useSyncExternalStore for consistency
 *
 * @example
 * const { chartType, availableChartTypes, setChartType } = useChartType(myBuilder)
 *
 * return (
 *   <select value={chartType} onChange={e => setChartType(e.target.value)}>
 *     {availableChartTypes.map(type => (
 *       <option key={type} value={type}>{type}</option>
 *     ))}
 *   </select>
 * )
 */
export function useChartType(builder: VBIBuilder): UseChartTypeReturn {
  const chartType = useBuilderObserver(
    (callback) => builder.chartType.observe(() => callback()),
    () => builder.chartType.getChartType(),
  )

  return {
    chartType,
    availableChartTypes: builder.chartType.getAvailableChartTypes(),
    setChartType: (chartTypeValue) => builder.chartType.changeChartType(chartTypeValue),
  }
}
```

### 5.6 useMeasures Hook

```typescript
// packages/vbi-react/src/hooks/useMeasures.ts

import type { VBIBuilder } from '@visactor/vbi'
import type { VBIMeasure } from '@visactor/vbi'

export type UseMeasuresConfig = Partial<Pick<VBIMeasure, 'aggregate' | 'alias' | 'encoding'>>

export interface UseMeasuresReturn {
  measures: VBIMeasure[]
  addMeasure: (field: string, config?: UseMeasuresConfig) => void
  removeMeasure: (id: string) => void
  updateMeasure: (id: string, config: UseMeasuresConfig) => void
}

/**
 * Hook: Manage measures
 *
 * @example
 * const { measures, addMeasure, removeMeasure } = useMeasures(myBuilder)
 */
export function useMeasures(builder: VBIBuilder): UseMeasuresReturn {
  const measures = useBuilderObserver(
    (callback) => builder.measures.observe(() => callback()),
    () => builder.measures.toJSON(),
  )

  const addMeasure = (field: string, config: UseMeasuresConfig = {}) => {
    builder.measures.add(field, (node) => {
      if (config.alias !== undefined) node.setAlias(config.alias)
      if (config.aggregate !== undefined) node.setAggregate(config.aggregate)
      if (config.encoding !== undefined) node.setEncoding(config.encoding)
    })
  }

  const removeMeasure = (id: string) => {
    builder.measures.remove(id)
  }

  const updateMeasure = (id: string, config: UseMeasuresConfig) => {
    builder.measures.update(id, (node) => {
      if (config.alias !== undefined) node.setAlias(config.alias)
      if (config.aggregate !== undefined) node.setAggregate(config.aggregate)
      if (config.encoding !== undefined) node.setEncoding(config.encoding)
    })
  }

  return { measures, addMeasure, removeMeasure, updateMeasure }
}
```

### 5.7 useDimensions Hook

```typescript
// packages/vbi-react/src/hooks/useDimensions.ts

import type { VBIBuilder } from '@visactor/vbi'
import type { VBIDimension } from '@visactor/vbi'

export type UseDimensionsConfig = Partial<Pick<VBIDimension, 'alias'>>

export interface UseDimensionsReturn {
  dimensions: VBIDimension[]
  addDimension: (field: string, config?: UseDimensionsConfig) => void
  removeDimension: (id: string) => void
  updateDimension: (id: string, config: UseDimensionsConfig) => void
}

/**
 * Hook: Manage dimensions
 *
 * @example
 * const { dimensions, addDimension, removeDimension } = useDimensions(myBuilder)
 */
export function useDimensions(builder: VBIBuilder): UseDimensionsReturn {
  const dimensions = useBuilderObserver(
    (callback) => builder.dimensions.observe(() => callback()),
    () => builder.dimensions.toJSON(),
  )

  const addDimension = (field: string, config: UseDimensionsConfig = {}) => {
    builder.dimensions.add(field, (node) => {
      if (config.alias !== undefined) node.setAlias(config.alias)
    })
  }

  const removeDimension = (id: string) => {
    builder.dimensions.remove(id)
  }

  const updateDimension = (id: string, config: UseDimensionsConfig) => {
    builder.dimensions.update(id, (node) => {
      if (config.alias !== undefined) node.setAlias(config.alias)
    })
  }

  return { dimensions, addDimension, removeDimension, updateDimension }
}
```

---

## 6. Derived State Model

### 6.1 Complete Data Derivation Chain

VBI's data flow is a complete derived state chain:

```
┌─────────────────────────────────────────────────────────────┐
│                      Source of Truth                        │
│                    Y.js Doc (VBIDSL)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (sync)
┌─────────────────────────────────────────────────────────────┐
│                   Derived State Lv.1                       │
│                   VBIDSL (JSON)                           │
│                   useVBI() returns                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (sync)
┌─────────────────────────────────────────────────────────────┐
│                   Derived State Lv.2                       │
│                   VQueryDSL                                │
│                   buildVQuery() returns                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (async)
┌─────────────────────────────────────────────────────────────┐
│                   Derived State Lv.3                       │
│                   Dataset                                  │
│                   connector.query() returns                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (sync)
┌─────────────────────────────────────────────────────────────┐
│                   Derived State Lv.4                       │
│                   VSeedDSL                                │
│                   useVSeed() returns                      │
│                                                             │
│   VSeed = f(VBIDSL, Dataset)                             │
│   - chartType: from VBIDSL                               │
│   - dataset: from VQuery → Dataset                       │
│   - theme: from VBIDSL                                   │
│   - locale: from VBIDSL                                  │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Derivation Principles

| Principle          | Description                                          |
| ------------------ | ---------------------------------------------------- |
| **One-way Flow**   | Yjs → VBIDSL → VQueryDSL → Dataset → VSeedDSL        |
| **Immutable**      | Each level produces a new object                     |
| **Idempotent**     | Same input produces same output                      |
| **Sync/Async Mix** | DSL transformation is sync, query execution is async |

### 6.3 Derived State in React

In React, derived state should be computed from props/state:

```typescript
// Wrong: Independent subscriptions, two state sources
const [vbidsl, setVbidsl] = useState(...)
const [vseed, setVseed] = useState(...)

// Correct: Single source, derived computation
const { dsl } = useVBI(builder)
const { vseed, loading } = useVSeed(builder) // Internal derivation
```

---

## 7. Async Pipeline Design

### 7.1 State Machine

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌─────────┐
│  Idle    │────▶│ Building  │────▶│ Success  │      │ Error   │
└──────────┘     └───────────┘     └──────────┘      └────┬────┘
                              │                          │
                              │◀─────────────────────────┘
                              │         refetch()
```

### 7.2 AbortController for Request Cancellation

Use AbortController to cancel in-flight requests and prevent stale results:

```typescript
// Core pattern
const abortControllerRef = useRef<AbortController | null>(null)

const build = async () => {
  // Cancel previous request
  abortControllerRef.current?.abort()
  abortControllerRef.current = new AbortController()

  try {
    const result = await builder.buildVSeed({
      signal: abortControllerRef.current.signal,
    })

    // Check if cancelled
    if (abortControllerRef.current.signal.aborted) {
      return
    }

    setVseed(result)
  } catch (err) {
    // Ignore abort errors
    if (err.name === 'AbortError') {
      return
    }
    setError(err)
  }
}
```

**Advantages**:

- ✅ Truly cancels in-flight requests
- ✅ Prevents unnecessary backend work
- ✅ Avoids stale results
- ✅ Industry standard approach

### 7.3 Error Handling

```typescript
const { vseed, loading, error, refetch } = useVSeed(builder, {
  onError: (err) => {
    // Custom error handling
    console.error('VSeed build failed:', err)

    // Auto-fix (e.g., filter error handling from practices/demo)
    if (err.message.includes('filter')) {
      builder.whereFilter.remove(...)
    }
  }
})

if (error) {
  return <ErrorFallback error={error} onRetry={refetch} />
}
```

---

## 8. Components Architecture

The library provides two usage modes to accommodate different use cases.

Current implementation status: the hooks mode is complete for the current builder surface, and a first `@visactor/vbi-react/components` slice is now shipped. The current starter components are `FieldPanel`, `ChartTypeSelector`, `ChartRenderer`, and `BuilderLayout`. A first `practices/professional` starter preview is integrated to validate these components in a real demo flow, and loading demo data there now refreshes the available fields from the same explicit supermarket schema used by the other demos, parses quoted CSV rows correctly before seeding local data, recreates the local dataset when that schema changes, keeps field selection explicit, surfaces build errors directly in the preview, and keeps its summary / DSL sections stacked below the builder so the main editing area stays visible. `FilterPanel`, `ThemeSelector`, and a richer built-in chart renderer remain target architecture.

### Core Principle

All stateful components in `@visactor/vbi-react/components` must be implemented by composing hooks from `@visactor/vbi-react`. Pure layout shells such as `BuilderLayout` can stay presentational.

That gives us a clean split:

- Users who want maximum control can use hooks directly
- Users who want fast setup can use components directly
- Components become the official best-practice reference for using hooks
- Components stay intentionally slim and focused on core functionality
- The documentation website can reuse these same components as examples

### 8.1 Headless Mode

Users build their own UI using hooks:

```typescript
function CustomChartEditor({ builder }: { builder: VBIBuilder }) {
  const { chartType, availableChartTypes, setChartType } = useChartType(builder)
  const { measures, addMeasure, removeMeasure } = useMeasures(builder)
  const { dimensions, addDimension, removeDimension } = useDimensions(builder)
  const { vseed, loading, error, refetch } = useVSeed(builder)

  return (
    <div>
      <select value={chartType} onChange={e => setChartType(e.target.value)}>
        {availableChartTypes.map(t => <option key={t} value={t}>{t}</option>)}
      </select>

      <MeasuresPanel measures={measures} onAdd={addMeasure} onRemove={removeMeasure} />
      <DimensionsPanel dimensions={dimensions} onAdd={addDimension} onRemove={removeDimension} />

      {loading && <Spinner />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {vseed && <ChartRenderer spec={vseed.spec} />}
    </div>
  )
}
```

### 8.2 Component Mode

Users can directly use prebuilt UI components from the same package:

```typescript
// Simple component-based usage
import { FieldPanel, ChartTypeSelector, ChartRenderer, BuilderLayout } from '@visactor/vbi-react/components'

function SimpleBuilder({ builder }: { builder: VBIBuilder }) {
  return (
    <BuilderLayout
      leftPanel={
        <FieldPanel
          builder={builder}
          dimensionOptions={[{ value: 'region' }, { value: 'category' }]}
          measureOptions={[{ value: 'sales' }, { value: 'profit' }]}
        />
      }
      topBar={<ChartTypeSelector builder={builder} />}
      main={<ChartRenderer builder={builder} />}
    />
  )
}
```

### 8.3 Prebuilt Components

The library will provide the following minimal components:

| Component             | Description                         |
| --------------------- | ----------------------------------- |
| **FieldPanel**        | Dimension and measure management UI |
| **ChartTypeSelector** | Chart type selection dropdown       |
| **ChartRenderer**     | `useVSeed` wrapper with render prop / JSON preview fallback |
| **BuilderLayout**     | Common builder layout template      |
| **FilterPanel**       | Where/Having filter UI              |
| **ThemeSelector**     | Theme switching UI                  |

Current shipping status:

- **Completed**: `FieldPanel`, `ChartTypeSelector`, `ChartRenderer`, `BuilderLayout`
- **Pending**: `FilterPanel`, `ThemeSelector`
- `ChartRenderer` currently focuses on `useVSeed` state handling and leaves richer VChart/VTable embedding to a later pass or a custom `renderVSeed` prop

**Design Constraints**:

- Every stateful component must be a thin composition layer over hooks
- Every component should focus on one core responsibility
- Every component should be simple enough to serve as a documentation example
- Advanced customization should always be possible by dropping down to hooks

---

## 9. Package Structure

### 9.1 Multi-Package Architecture

Current repository reality:

```
packages/
├── vbi/               # Framework-agnostic core builder, pipeline, DSL types
├── vbi-react/         # React hooks + components submodule
├── vquery/            # Query layer
└── vseed/             # Rendering DSL
```

Future adapters such as `vbi-vue` can still be added later, but components are no longer planned as a separate package.

### 9.2 Package Responsibilities

| Package       | Responsibility                                                     |
| ------------- | ------------------------------------------------------------------ |
| **vbi**       | Framework-agnostic business logic, VBIBuilder, pipeline, DSL types |
| **vbi-react** | React hooks plus `components` submodule built on top of hooks      |
| **vquery**    | Query generation and execution support                             |
| **vseed**     | Rendering DSL and downstream render integration                    |

### 9.3 Build System

All packages will be built using **rslib**, which provides:

- Fast build times
- Tree-shaking support
- Multiple output formats (ESM, CJS)
- TypeScript support out of the box

### 9.4 vbi-react Package Structure

```
packages/vbi-react/
├── package.json
├── tsconfig.json
├── tsconfig.test.json
├── vite.config.ts
├── eslint.config.mjs
├── rslib.config.ts
├── DESIGN.md
├── src/
│   ├── index.ts                 # Entry point
│   │
│   ├── hooks/                   # React Hooks
│   │   ├── index.ts
│   │   ├── useVBI.ts
│   │   ├── useVSeed.ts
│   │   ├── useChartType.ts
│   │   ├── useMeasures.ts
│   │   ├── useDimensions.ts
│   │   ├── useHavingFilter.ts
│   │   └── useWhereFilter.ts
│   │
│   ├── components/              # Exported as @visactor/vbi-react/components
│   │   ├── index.ts
│   │   ├── FieldPanel.tsx
│   │   ├── ChartTypeSelector.tsx
│   │   ├── ChartRenderer.tsx
│   │   ├── BuilderLayout.tsx
│   │   ├── types.ts
│   │   └── utils.ts
│   │
│   └── internal/                # Internal utilities
│       ├── index.ts
│       └── useBuilderObserver.ts
│
├── tests/                       # Tests
│   ├── components/
│   │   ├── BuilderLayout.test.tsx
│   │   ├── ChartRenderer.test.tsx
│   │   ├── ChartTypeSelector.test.tsx
│   │   └── FieldPanel.test.tsx
│   ├── hooks/
│   │   ├── useVBI.test.ts
│   │   ├── useVSeed.test.ts
│   │   ├── useChartType.test.ts
│   │   ├── useMeasures.test.ts
│   │   ├── useHavingFilter.test.ts
│   │   └── useWhereFilter.test.ts
│   ├── setup-dom.ts
│   └── utils/
│       └── createTestBuilder.ts
│
└── README.md
```

---

## 10. Component Testing Strategy

### 10.1 Testing Approach

Current starter components are verified with interaction-oriented component tests:

1. Render component
2. Drive the public UI through clicks / changes
3. Assert visible output or builder state changes

### 10.2 Tools

| Tool                      | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| **React Testing Library** | Component rendering and interaction testing |
| **Vitest**                | Test runner                                 |
| **happy-dom**             | DOM bootstrap for hook tests in Node        |
| **component interaction tests** | Public UI flow verification            |

Current hook and component tests run in Vitest's `node` environment, with `tests/setup-dom.ts` installing a `happy-dom` window onto `globalThis`. `tests/utils/createTestBuilder.ts` uses a local fake builder so package tests no longer depend on `@visactor/vbi` runtime imports during verification.

### 10.3 Example Test

```typescript
import { fireEvent, render } from '@testing-library/react'
import { ChartTypeSelector } from '../components/ChartTypeSelector'

describe('ChartTypeSelector', () => {
  it('updates chart type through the component UI', () => {
    const builder = createMockBuilder()
    const view = render(<ChartTypeSelector builder={builder} />)

    fireEvent.change(view.getByRole('combobox', { name: 'Chart type' }), {
      target: { value: 'line' },
    })

    expect(builder.chartType.getChartType()).toBe('line')
  })
})
```

### 10.4 Test Coverage Goals

- **Hooks**: 100% coverage on business logic
- **Components**: Key user flows covered
- **Integration**: End-to-end builder workflows

---

## 11. Migration Strategy

### 11.1 From practices/demo

**Existing Code**:

```typescript
// practices/demo/src/hooks/useVBI.ts
import { useState, useEffect } from 'react'
import { VBIBuilder } from '@visactor/vbi'

export const useVBI = (builder: VBIBuilder = defaultBuilder) => {
  const [vseed, setVSeed] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const updateHandler = async () => {
      setLoading(true)
      const newVSeed = await builder.buildVSeed()
      setVSeed(() => newVSeed)
      setLoading(false)
    }
    builder.doc.on('update', updateHandler)
    return () => builder.doc.off('update', updateHandler)
  }, [builder])

  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      const newVSeed = await builder.buildVSeed()
      setVSeed(() => newVSeed)
      setLoading(false)
    }
    initialize()
  }, [builder])

  return { vseed, builder, loading }
}
```

**After Migration**:

```typescript
import { useVSeed, useVBI } from '@visactor/vbi-react'

// Use useVSeed (recommended)
const { vseed, loading, error, refetch } = useVSeed(builder)

// Or use useVBI for DSL state
const { dsl, builder } = useVBI(builder)
```

### 11.2 Recommended Rollout Order

1. **Phase 1: Finish the hooks surface**
   - Keep `packages/vbi-react` hooks stable against the current `@visactor/vbi` builder APIs
   - Keep `useWhereFilter` and `useHavingFilter` aligned with the singular builder APIs
   - Reach a clean verification baseline for `@visactor/vbi-react` (`typecheck`, tests, lint)

2. **Phase 2: Build the components layer**
   - Add the `@visactor/vbi-react/components` submodule
   - Implement slim components entirely by composing hooks from `@visactor/vbi-react`
   - Keep these components focused on core behavior so they can double as documentation examples

3. **Phase 3: Validate with the professional demo**
   - Integrate the components layer into `practices/professional`
   - Refactor `practices/professional` if needed so it becomes the primary end-to-end validation target
   - Keep `practices/demo`, `practices/minimalist`, and `practices/streamlined` unchanged during this first rollout

4. **Phase 4: Documentation and release**
   - Reuse the completed components as website examples
   - Write README and VBI site documentation
   - Publish a beta only after the hooks, components, and `practices/professional` validation pass

### 11.3 Demo Validation Scope

After the `@visactor/vbi-react/components` layer is implemented, the primary integration and UX validation target should be `practices/professional`.

Rules for that stage:

- `practices/professional` is the designated demo for validating the components layer end to end
- Refactoring `practices/professional` is allowed if needed to make it a strong real-world validation target
- Current rollout status: `practices/professional` now includes a dedicated `vbi-react Starter` preview mode for validating the starter components in isolation, with the extra preview metadata stacked below the builder instead of overlapping it
- Do **not** modify `practices/demo`, `practices/minimalist`, or `practices/streamlined` as part of the components rollout unless a later explicit decision changes this scope
- The other three practice demos should remain stable references while `professional` absorbs the first round of component-level integration changes
- This scope supersedes earlier exploratory ideas about using `practices/demo` as the first migration target for the components rollout

---

## 12. Documentation Integration

### 12.1 VBI Documentation Website

This design will be integrated into the VBI documentation website under the **VBI** section.

### 12.2 Documentation Structure

| Section             | Content                                   |
| ------------------- | ----------------------------------------- |
| **Introduction**    | What is vbi-react, core concepts          |
| **Getting Started** | Installation, basic usage                 |
| **Hooks API**       | Detailed hook documentation with examples |
| **Components**      | Prebuilt component reference              |
| **Examples**        | Common usage patterns                     |
| **Migration Guide** | Upgrading from practices/demo             |

### 12.3 Design Document Integration

This design document will become part of the architecture documentation, providing:

- Architecture decisions and rationale
- Implementation details for contributors
- API design reference

---

## 13. Implementation Plan

### Phase 1: Infrastructure (2 weeks)

| Week | Task                                                    | Deliverable         | Status        |
| ---- | ------------------------------------------------------- | ------------------- | ------------- |
| 1    | Create packages/vbi-react project structure             | Project skeleton    | **Completed** |
| 1    | Configure tsconfig, package.json, rslib                 | Build configuration | **Completed** |
| 1    | Implement core `useVBI` hook (useSyncExternalStore)     | useVBI.ts           | **Completed** |
| 2    | Implement `useVSeed` hook (AbortController)             | useVSeed.ts         | **Completed** |
| 2    | Add unit tests                                          | tests/hooks/        | **Completed** |
| 2    | Add `buildVSeed({ signal })` support in `@visactor/vbi` | signal plumbing     | **Completed** |

**Key Configuration**:

```typescript
// packages/vbi-react/package.json
{
  "name": "@visactor/vbi-react",
  "version": "0.1.0",
  "peerDependencies": {
    "react": ">=18",
    "@visactor/vbi": "workspace:*"
  }
}
```

### Phase 2: Complete Hooks (2 weeks)

| Week | Task                                          | Deliverable        | Status        |
| ---- | --------------------------------------------- | ------------------ | ------------- |
| 3    | Implement useChartType (useSyncExternalStore) | useChartType.ts    | **Completed** |
| 3    | Implement useMeasures                         | useMeasures.ts     | **Completed** |
| 3    | Implement useDimensions                       | useDimensions.ts   | **Completed** |
| 4    | Implement useWhereFilter                      | useWhereFilter.ts  | **Completed** |
| 4    | Implement useHavingFilter                     | useHavingFilter.ts | **Completed** |

### Phase 3: Components (2 weeks)

| Week | Task                                              | Deliverable                   | Status      |
| ---- | ------------------------------------------------- | ----------------------------- | ----------- |
| 5    | Add `@visactor/vbi-react/components` submodule    | components entry              | **Completed** |
| 5    | Design and implement core slim components         | FieldPanel, ChartTypeSelector | **Completed** |
| 5    | Implement ChartRenderer                           | ChartRenderer.tsx             | **In Progress** |
| 6    | Implement BuilderLayout                           | BuilderLayout.tsx             | **Completed** |
| 6    | Ensure every stateful component is implemented by hooks | architecture rule        | **In Progress** |
| 6    | Reuse components as docs/examples building blocks | site examples                 | **Pending** |

### Phase 4: Integration and Documentation (1 week)

| Week | Task                                                                                                                     | Deliverable          | Status          |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | -------------------- | --------------- |
| 7    | Integrate with `practices/professional` for components validation                                                        | Verify functionality | **In Progress** |
| 7    | Keep `practices/demo`, `practices/minimalist`, and `practices/streamlined` unchanged during the first components rollout | scope guard          | **In Progress** |
| 7    | Write README documentation                                                                                               | Documentation        | **Pending**     |
| 7    | Integrate docs under VBI website section                                                                                 | documentation pages  | **Pending**     |
| 7    | Keep `DESIGN.md` synchronized with implementation status                                                                 | living design record | **In Progress** |
| 7    | Publish Beta version                                                                                                     | npm package          | **Pending**     |

---

## 14. Summary

| Item                         | Description                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| **Core Value**               | Expose VBI core capabilities as React Hooks for true headless UI                                 |
| **React Integration**        | Use useSyncExternalStore for React 18 render consistency                                         |
| **API Design**               | All hooks receive builder as first argument, no global Provider                                  |
| **Async Handling**           | Use AbortController for request cancellation                                                     |
| **Multiple Usage Modes**     | Headless hooks for deep customization + slim components for rapid setup                          |
| **Package Strategy**         | Keep hooks and components in `vbi-react`, export components as `@visactor/vbi-react/components`  |
| **Testing**                  | Hook unit tests and starter component interaction tests are active today; richer snapshot coverage can be added later |
| **Key Challenges**           | Yjs lifecycle management, useSyncExternalStore adaptation                                        |
| **Estimated Timeline**       | 7 weeks for MVP                                                                                  |
| **Backward Compatibility**   | Smooth migration from practices/demo                                                             |
| **Documentation Discipline** | DESIGN.md tracks completed vs pending work continuously                                          |

---
