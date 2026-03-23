import type {
  VBIChartBuilder,
  VBIConnector,
  VBIDimension,
  VBIWhereFilter,
  VBIHavingAggregate,
  VBIHavingClause,
  VBIHavingFilter,
  VBIHavingGroup,
  VBIMeasure,
  VBISchema,
  VBIWhereClause,
  VBIWhereGroup,
} from '@visactor/vbi'
import type { VSeedDSL } from '@visactor/vseed'

let builderCount = 0
let dimensionCount = 0
let measureCount = 0
let whereFilterCount = 0
let whereGroupCount = 0
let havingFilterCount = 0
let havingGroupCount = 0

type UpdateListener = () => void

interface TestWhereNodeBuilder {
  getField: () => string
  getId: () => string
  getOperator: () => string | undefined
  setField: (field: string) => TestWhereNodeBuilder
  setOperator: (operator: string) => TestWhereNodeBuilder
  setValue: (value: unknown) => TestWhereNodeBuilder
  toJSON: () => VBIWhereFilter
}

interface TestWhereGroupBuilder {
  add: (field: string, callback: (node: TestWhereNodeBuilder) => void) => TestWhereGroupBuilder
  addGroup: (op: 'and' | 'or', callback: (nestedGroup: TestWhereGroupBuilder) => void) => TestWhereGroupBuilder
  clear: () => TestWhereGroupBuilder
  getConditions: () => VBIWhereClause[]
  getId: () => string
  getOperator: () => 'and' | 'or'
  remove: (idOrIndex: string | number) => TestWhereGroupBuilder
  setOperator: (op: 'and' | 'or') => TestWhereGroupBuilder
  toJSON: () => VBIWhereGroup
}

interface TestHavingNodeBuilder {
  getAggregate: () => VBIHavingAggregate | undefined
  getField: () => string
  getId: () => string
  getOperator: () => string | undefined
  setAggregate: (aggregate: VBIHavingAggregate) => TestHavingNodeBuilder
  setOperator: (operator: string) => TestHavingNodeBuilder
  setValue: (value: unknown) => TestHavingNodeBuilder
  toJSON: () => VBIHavingFilter
}

interface TestHavingGroupBuilder {
  add: (field: string, callback: (node: TestHavingNodeBuilder) => void) => TestHavingGroupBuilder
  addGroup: (op: 'and' | 'or', callback: (nestedGroup: TestHavingGroupBuilder) => void) => TestHavingGroupBuilder
  clear: () => TestHavingGroupBuilder
  getConditions: () => VBIHavingClause[]
  getId: () => string
  getOperator: () => 'and' | 'or'
  remove: (idOrIndex: string | number) => TestHavingGroupBuilder
  setOperator: (op: 'and' | 'or') => TestHavingGroupBuilder
  toJSON: () => VBIHavingGroup
}

interface TestBuilderState {
  chartType: string
  connectorId: string
  dimensions: VBIDimension[]
  havingFilter: VBIHavingGroup
  locale: string
  measures: VBIMeasure[]
  theme: string
  version: number
  whereFilter: VBIWhereGroup
}

function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function createAbortError(): Error {
  const error = new Error('Aborted')
  error.name = 'AbortError'
  return error
}

function createObservableDoc(notify: () => void) {
  const listeners = new Set<UpdateListener>()

  return {
    off: (event: string, callback: UpdateListener) => {
      if (event === 'update') {
        listeners.delete(callback)
      }
    },
    on: (event: string, callback: UpdateListener) => {
      if (event === 'update') {
        listeners.add(callback)
      }
    },
    notify: () => {
      notify()
      listeners.forEach((listener) => listener())
    },
  }
}

function createChartTypeFeature(state: TestBuilderState, notify: () => void) {
  const listeners = new Set<UpdateListener>()

  return {
    changeChartType: (chartType: string) => {
      state.chartType = chartType
      listeners.forEach((listener) => listener())
      notify()
    },
    getAvailableChartTypes: () => ['table', 'line', 'column', 'bar', 'pie', 'scatter'],
    getChartType: () => state.chartType,
    observe: (callback: UpdateListener) => {
      listeners.add(callback)
      return () => {
        listeners.delete(callback)
      }
    },
  }
}

function createMeasureNode(measure: VBIMeasure) {
  return {
    setAggregate: (aggregate: VBIMeasure['aggregate']) => {
      measure.aggregate = aggregate
    },
    setAlias: (alias: string) => {
      measure.alias = alias
    },
    setEncoding: (encoding: VBIMeasure['encoding']) => {
      measure.encoding = encoding
    },
  }
}

function createMeasuresFeature(state: TestBuilderState, notify: () => void) {
  const listeners = new Set<UpdateListener>()

  const emit = () => {
    listeners.forEach((listener) => listener())
    notify()
  }

  return {
    add: (field: string, callback: (node: ReturnType<typeof createMeasureNode>) => void) => {
      const measure: VBIMeasure = {
        aggregate: { func: 'sum' },
        alias: field,
        encoding: 'yAxis',
        field,
        id: `measure-${measureCount++}`,
      }

      callback(createMeasureNode(measure))
      state.measures.push(measure)
      emit()
    },
    observe: (callback: UpdateListener) => {
      listeners.add(callback)
      return () => {
        listeners.delete(callback)
      }
    },
    remove: (id: string) => {
      state.measures = state.measures.filter((measure) => measure.id !== id)
      emit()
    },
    toJSON: () => cloneState(state.measures),
    update: (id: string, callback: (node: ReturnType<typeof createMeasureNode>) => void) => {
      const measure = state.measures.find((item) => item.id === id)
      if (!measure) {
        throw new Error(`Measure with id "${id}" not found`)
      }

      callback(createMeasureNode(measure))
      emit()
    },
  }
}

function createDimensionNode(dimension: VBIDimension) {
  return {
    setAlias: (alias: string) => {
      dimension.alias = alias
    },
  }
}

function createDimensionsFeature(state: TestBuilderState, notify: () => void) {
  const listeners = new Set<UpdateListener>()

  const emit = () => {
    listeners.forEach((listener) => listener())
    notify()
  }

  return {
    add: (field: string, callback: (node: ReturnType<typeof createDimensionNode>) => void) => {
      const dimension: VBIDimension = {
        alias: field,
        field,
        id: `dimension-${dimensionCount++}`,
      }

      callback(createDimensionNode(dimension))
      state.dimensions.push(dimension)
      emit()
    },
    observe: (callback: UpdateListener) => {
      listeners.add(callback)
      return () => {
        listeners.delete(callback)
      }
    },
    remove: (id: string) => {
      state.dimensions = state.dimensions.filter((dimension) => dimension.id !== id)
      emit()
    },
    toJSON: () => cloneState(state.dimensions),
    update: (id: string, callback: (node: ReturnType<typeof createDimensionNode>) => void) => {
      const dimension = state.dimensions.find((item) => item.id === id)
      if (!dimension) {
        throw new Error(`Dimension with id "${id}" not found`)
      }

      callback(createDimensionNode(dimension))
      emit()
    },
  }
}

function isWhereGroup(entry: VBIWhereClause): entry is VBIWhereGroup {
  return 'conditions' in entry
}

function isHavingGroup(entry: VBIHavingClause): entry is VBIHavingGroup {
  return 'conditions' in entry
}

function findWhereEntry(
  collection: VBIWhereClause[],
  id: string,
): { collection: VBIWhereClause[]; entry: VBIWhereClause; index: number } | undefined {
  for (let index = 0; index < collection.length; index++) {
    const entry = collection[index]
    if (entry.id === id) {
      return { collection, entry, index }
    }

    if (isWhereGroup(entry)) {
      const nestedMatch = findWhereEntry(entry.conditions, id)
      if (nestedMatch) {
        return nestedMatch
      }
    }
  }

  return undefined
}

function findHavingEntry(
  collection: VBIHavingClause[],
  id: string,
): { collection: VBIHavingClause[]; entry: VBIHavingClause; index: number } | undefined {
  for (let index = 0; index < collection.length; index++) {
    const entry = collection[index]
    if (entry.id === id) {
      return { collection, entry, index }
    }

    if (isHavingGroup(entry)) {
      const nestedMatch = findHavingEntry(entry.conditions, id)
      if (nestedMatch) {
        return nestedMatch
      }
    }
  }

  return undefined
}

function createWhereNodeBuilder(filter: VBIWhereFilter): TestWhereNodeBuilder {
  const api: TestWhereNodeBuilder = {
    getField: () => filter.field,
    getId: () => filter.id,
    getOperator: () => filter.op,
    setField: (field: string) => {
      filter.field = field
      return api
    },
    setOperator: (operator: string) => {
      filter.op = operator
      return api
    },
    setValue: (value: unknown) => {
      filter.value = value
      return api
    },
    toJSON: () => cloneState(filter),
  }

  return api
}

function createHavingNodeBuilder(filter: VBIHavingFilter): TestHavingNodeBuilder {
  const api: TestHavingNodeBuilder = {
    getAggregate: () => filter.aggregate,
    getField: () => filter.field,
    getId: () => filter.id,
    getOperator: () => filter.op,
    setAggregate: (aggregate: VBIHavingAggregate) => {
      filter.aggregate = aggregate
      return api
    },
    setOperator: (operator: string) => {
      filter.op = operator
      return api
    },
    setValue: (value: unknown) => {
      filter.value = value
      return api
    },
    toJSON: () => cloneState(filter),
  }

  return api
}

function createWhereGroupBuilder(group: VBIWhereGroup, notify: () => void): TestWhereGroupBuilder {
  const api: TestWhereGroupBuilder = {
    add: (field: string, callback: (node: TestWhereNodeBuilder) => void) => {
      const filter: VBIWhereFilter = {
        field,
        id: `where-filter-${whereFilterCount++}`,
        op: '',
      }

      group.conditions.push(filter)
      callback(createWhereNodeBuilder(filter))
      notify()
      return api
    },
    addGroup: (op: 'and' | 'or', callback: (nestedGroup: TestWhereGroupBuilder) => void) => {
      const nestedGroup: VBIWhereGroup = {
        conditions: [],
        id: `where-group-${whereGroupCount++}`,
        op,
      }

      group.conditions.push(nestedGroup)
      callback(createWhereGroupBuilder(nestedGroup, notify))
      notify()
      return api
    },
    clear: () => {
      group.conditions = []
      notify()
      return api
    },
    getConditions: () => group.conditions,
    getId: () => group.id,
    getOperator: () => group.op,
    remove: (idOrIndex: string | number) => {
      if (typeof idOrIndex === 'number') {
        if (idOrIndex >= 0 && idOrIndex < group.conditions.length) {
          group.conditions.splice(idOrIndex, 1)
          notify()
        }

        return api
      }

      const index = group.conditions.findIndex((entry) => entry.id === idOrIndex)
      if (index !== -1) {
        group.conditions.splice(index, 1)
        notify()
      }

      return api
    },
    setOperator: (op: 'and' | 'or') => {
      group.op = op
      notify()
      return api
    },
    toJSON: () => cloneState(group),
  }

  return api
}

function createHavingGroupBuilder(group: VBIHavingGroup, notify: () => void): TestHavingGroupBuilder {
  const api: TestHavingGroupBuilder = {
    add: (field: string, callback: (node: TestHavingNodeBuilder) => void) => {
      const filter: VBIHavingFilter = {
        aggregate: { func: 'sum' },
        field,
        id: `having-filter-${havingFilterCount++}`,
        op: '',
      }

      group.conditions.push(filter)
      callback(createHavingNodeBuilder(filter))
      notify()
      return api
    },
    addGroup: (op: 'and' | 'or', callback: (nestedGroup: TestHavingGroupBuilder) => void) => {
      const nestedGroup: VBIHavingGroup = {
        conditions: [],
        id: `having-group-${havingGroupCount++}`,
        op,
      }

      group.conditions.push(nestedGroup)
      callback(createHavingGroupBuilder(nestedGroup, notify))
      notify()
      return api
    },
    clear: () => {
      group.conditions = []
      notify()
      return api
    },
    getConditions: () => group.conditions,
    getId: () => group.id,
    getOperator: () => group.op,
    remove: (idOrIndex: string | number) => {
      if (typeof idOrIndex === 'number') {
        if (idOrIndex >= 0 && idOrIndex < group.conditions.length) {
          group.conditions.splice(idOrIndex, 1)
          notify()
        }

        return api
      }

      const index = group.conditions.findIndex((entry) => entry.id === idOrIndex)
      if (index !== -1) {
        group.conditions.splice(index, 1)
        notify()
      }

      return api
    },
    setOperator: (op: 'and' | 'or') => {
      group.op = op
      notify()
      return api
    },
    toJSON: () => cloneState(group),
  }

  return api
}

function createWhereFilterFeature(state: TestBuilderState, notify: () => void) {
  const listeners = new Set<UpdateListener>()

  const emit = () => {
    listeners.forEach((listener) => listener())
    notify()
  }

  return {
    add: (field: string, callback: (node: TestWhereNodeBuilder) => void) => {
      const filter: VBIWhereFilter = {
        field,
        id: `where-filter-${whereFilterCount++}`,
        op: '',
      }

      state.whereFilter.conditions.push(filter)
      callback(createWhereNodeBuilder(filter))
      emit()
    },
    addGroup: (op: 'and' | 'or', callback: (group: TestWhereGroupBuilder) => void) => {
      const group: VBIWhereGroup = {
        conditions: [],
        id: `where-group-${whereGroupCount++}`,
        op,
      }

      state.whereFilter.conditions.push(group)
      callback(createWhereGroupBuilder(group, emit))
      emit()
    },
    clear: () => {
      state.whereFilter.conditions = []
      emit()
    },
    find: (predicate: (entry: TestWhereNodeBuilder | TestWhereGroupBuilder, index: number) => boolean) => {
      const visit = (collection: VBIWhereClause[]): TestWhereNodeBuilder | TestWhereGroupBuilder | undefined => {
        for (let index = 0; index < collection.length; index++) {
          const entry = collection[index]
          const builder: TestWhereNodeBuilder | TestWhereGroupBuilder = isWhereGroup(entry)
            ? createWhereGroupBuilder(entry, emit)
            : createWhereNodeBuilder(entry)

          if (predicate(builder, index)) {
            return builder
          }

          if (isWhereGroup(entry)) {
            const nestedMatch: TestWhereNodeBuilder | TestWhereGroupBuilder | undefined = visit(entry.conditions)
            if (nestedMatch) {
              return nestedMatch
            }
          }
        }

        return undefined
      }

      return visit(state.whereFilter.conditions)
    },
    observe: (callback: UpdateListener) => {
      listeners.add(callback)
      return () => {
        listeners.delete(callback)
      }
    },
    remove: (idOrIndex: string | number) => {
      if (typeof idOrIndex === 'number') {
        if (idOrIndex >= 0 && idOrIndex < state.whereFilter.conditions.length) {
          state.whereFilter.conditions.splice(idOrIndex, 1)
          emit()
        }

        return
      }

      const match = findWhereEntry(state.whereFilter.conditions, idOrIndex)
      if (match) {
        match.collection.splice(match.index, 1)
        emit()
      }
    },
    toJSON: () => cloneState(state.whereFilter),
    update: (id: string, callback: (node: TestWhereNodeBuilder) => void) => {
      const match = findWhereEntry(state.whereFilter.conditions, id)
      if (!match) {
        throw new Error(`Where filter with id ${id} not found`)
      }

      if (isWhereGroup(match.entry)) {
        throw new Error(`Item with id ${id} is not a filter`)
      }

      callback(createWhereNodeBuilder(match.entry))
      emit()
    },
    updateGroup: (id: string, callback: (group: TestWhereGroupBuilder) => void) => {
      const match = findWhereEntry(state.whereFilter.conditions, id)
      if (!match) {
        throw new Error(`Where group with id ${id} not found`)
      }

      if (!isWhereGroup(match.entry)) {
        throw new Error(`Item with id ${id} is not a group`)
      }

      callback(createWhereGroupBuilder(match.entry, emit))
      emit()
    },
  }
}

function createHavingFilterFeature(state: TestBuilderState, notify: () => void) {
  const listeners = new Set<UpdateListener>()

  const emit = () => {
    listeners.forEach((listener) => listener())
    notify()
  }

  return {
    add: (field: string, callback: (node: TestHavingNodeBuilder) => void) => {
      const filter: VBIHavingFilter = {
        aggregate: { func: 'sum' },
        field,
        id: `having-filter-${havingFilterCount++}`,
        op: '',
      }

      state.havingFilter.conditions.push(filter)
      callback(createHavingNodeBuilder(filter))
      emit()
    },
    addGroup: (op: 'and' | 'or', callback: (group: TestHavingGroupBuilder) => void) => {
      const group: VBIHavingGroup = {
        conditions: [],
        id: `having-group-${havingGroupCount++}`,
        op,
      }

      state.havingFilter.conditions.push(group)
      callback(createHavingGroupBuilder(group, emit))
      emit()
    },
    clear: () => {
      state.havingFilter.conditions = []
      emit()
    },
    find: (predicate: (entry: TestHavingNodeBuilder | TestHavingGroupBuilder, index: number) => boolean) => {
      const visit = (collection: VBIHavingClause[]): TestHavingNodeBuilder | TestHavingGroupBuilder | undefined => {
        for (let index = 0; index < collection.length; index++) {
          const entry = collection[index]
          const builder: TestHavingNodeBuilder | TestHavingGroupBuilder = isHavingGroup(entry)
            ? createHavingGroupBuilder(entry, emit)
            : createHavingNodeBuilder(entry)

          if (predicate(builder, index)) {
            return builder
          }

          if (isHavingGroup(entry)) {
            const nestedMatch: TestHavingNodeBuilder | TestHavingGroupBuilder | undefined = visit(entry.conditions)
            if (nestedMatch) {
              return nestedMatch
            }
          }
        }

        return undefined
      }

      return visit(state.havingFilter.conditions)
    },
    observe: (callback: UpdateListener) => {
      listeners.add(callback)
      return () => {
        listeners.delete(callback)
      }
    },
    remove: (idOrIndex: string | number) => {
      if (typeof idOrIndex === 'number') {
        if (idOrIndex >= 0 && idOrIndex < state.havingFilter.conditions.length) {
          state.havingFilter.conditions.splice(idOrIndex, 1)
          emit()
        }

        return
      }

      const match = findHavingEntry(state.havingFilter.conditions, idOrIndex)
      if (match) {
        match.collection.splice(match.index, 1)
        emit()
      }
    },
    toJSON: () => cloneState(state.havingFilter),
    update: (id: string, callback: (node: TestHavingNodeBuilder) => void) => {
      const match = findHavingEntry(state.havingFilter.conditions, id)
      if (!match) {
        throw new Error(`Having filter with id ${id} not found`)
      }

      if (isHavingGroup(match.entry)) {
        throw new Error(`Item with id ${id} is not a filter`)
      }

      callback(createHavingNodeBuilder(match.entry))
      emit()
    },
    updateGroup: (id: string, callback: (group: TestHavingGroupBuilder) => void) => {
      const match = findHavingEntry(state.havingFilter.conditions, id)
      if (!match) {
        throw new Error(`Having group with id ${id} not found`)
      }

      if (!isHavingGroup(match.entry)) {
        throw new Error(`Item with id ${id} is not a group`)
      }

      callback(createHavingGroupBuilder(match.entry, emit))
      emit()
    },
  }
}

export function createTestBuilder(connectorOverrides: Partial<VBIConnector> = {}): VBIChartBuilder {
  const connectorId = `vbi-react-test-${builderCount++}`

  const connector: VBIConnector = {
    discoverSchema: async () => [{ name: 'value', type: 'number' }] as VBISchema,
    query: async () => ({
      dataset: [],
    }),
    ...connectorOverrides,
  }

  const state: TestBuilderState = {
    chartType: 'table',
    connectorId,
    dimensions: [],
    havingFilter: {
      conditions: [],
      id: 'root',
      op: 'and',
    },
    locale: 'zh-CN',
    measures: [],
    theme: 'light',
    version: 0,
    whereFilter: {
      conditions: [],
      id: 'root',
      op: 'and',
    },
  }

  const doc = createObservableDoc(() => undefined)
  const notify = () => doc.notify()

  const builder = {
    build: () => cloneState(state),
    buildVSeed: async ({ signal }: { signal?: AbortSignal } = {}): Promise<VSeedDSL> => {
      if (signal?.aborted) {
        throw createAbortError()
      }

      const schema = await connector.discoverSchema()
      const queryResult = await connector.query({
        connectorId: state.connectorId,
        queryDSL: {} as never,
        schema,
        signal,
      })

      if (signal?.aborted) {
        throw createAbortError()
      }

      return {
        chartType: state.chartType,
        dataset: queryResult.dataset,
        dimensions: cloneState(state.dimensions).map((dimension) => ({
          alias: dimension.alias,
          id: dimension.id,
        })),
        locale: state.locale,
        measures: cloneState(state.measures).map((measure) => ({
          alias: measure.alias,
          id: measure.id,
        })),
        theme: state.theme,
      } as VSeedDSL
    },
    chartType: undefined as unknown,
    dimensions: undefined as unknown,
    doc,
    havingFilter: undefined as unknown,
    measures: undefined as unknown,
    whereFilter: undefined as unknown,
  } as {
    build: () => TestBuilderState
    buildVSeed: (options?: { signal?: AbortSignal }) => Promise<VSeedDSL>
    chartType: ReturnType<typeof createChartTypeFeature>
    dimensions: ReturnType<typeof createDimensionsFeature>
    doc: ReturnType<typeof createObservableDoc>
    havingFilter: ReturnType<typeof createHavingFilterFeature>
    measures: ReturnType<typeof createMeasuresFeature>
    whereFilter: ReturnType<typeof createWhereFilterFeature>
  }

  builder.chartType = createChartTypeFeature(state, notify)
  builder.measures = createMeasuresFeature(state, notify)
  builder.dimensions = createDimensionsFeature(state, notify)
  builder.whereFilter = createWhereFilterFeature(state, notify)
  builder.havingFilter = createHavingFilterFeature(state, notify)

  return builder as unknown as VBIChartBuilder
}
