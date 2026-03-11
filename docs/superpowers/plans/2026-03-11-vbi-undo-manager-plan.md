# VBI UndoManager Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 VBIBuilder 增加自定义 UndoManager 类，提供基于 YJS 的撤销/重做功能

**Architecture:** 创建独立的 undo-manager.ts 文件封装 YJS UndoManager，保持与 sub-builder 一致的 API 风格和 JSDoc 注释

**Tech Stack:** TypeScript, YJS, Rstest

---

## 文件结构

```
packages/vbi/src/builder/
├── undo-manager.ts        # 新建
├── vbi-builder.ts        # 修改
├── index.ts              # 修改
packages/vbi/scripts/
├── build-api.mjs         # 修改
packages/vbi/tests/
├── builder/
│   └── undo-manager.test.ts  # 新建
└── examples/
    └── undoManager/
        ├── undo-redo.json    # 新建
        └── undo-redo.test.ts # 新建 (由 build-tests.mjs 生成)
```

---

## Chunk 1: 实现 UndoManager 类

### Task 1: 创建 undo-manager.ts

**Files:**

- Create: `packages/vbi/src/builder/undo-manager.ts`

- [ ] **Step 1: 创建 UndoManager 类文件**

```typescript
import * as Y from 'yjs'

/**
 * @description 撤销/重做管理器，提供基于 YJS 的撤销和重做功能，支持栈管理和历史清除操作
 */
export class UndoManager {
  private manager: Y.UndoManager

  /**
   * @description 构造函数
   * @param scope - YJS 文档或类型作用域，用于定义撤销/重做的追踪范围
   */
  constructor(scope: Y.AbstractStructuredClone<any> | Y.Doc) {
    this.manager = new Y.UndoManager(scope)
  }

  /**
   * @description 撤销上一次修改
   * @returns 是否成功撤销
   */
  undo(): boolean {
    return this.manager.undo() !== null
  }

  /**
   * @description 重做被撤销的修改
   * @returns 是否成功重做
   */
  redo(): boolean {
    return this.manager.redo() !== null
  }

  /**
   * @description 检查是否有可撤销的操作
   * @returns 是否可以撤销
   */
  canUndo(): boolean {
    return this.manager.canUndo()
  }

  /**
   * @description 检查是否有可重做的操作
   * @returns 是否可以重做
   */
  canRedo(): boolean {
    return this.manager.canRedo()
  }

  /**
   * @description 清除历史记录
   * @param clearUndoStack - 是否清除撤销栈，默认 true
   * @param clearRedoStack - 是否清除重做栈，默认 true
   */
  clear(clearUndoStack?: boolean, clearRedoStack?: boolean): void {
    this.manager.clear(clearUndoStack, clearRedoStack)
  }
}
```

---

## Chunk 2: 修改 VBIBuilder 集成 UndoManager

### Task 2: 修改 vbi-builder.ts

**Files:**

- Modify: `packages/vbi/src/builder/vbi-builder.ts:1-93`

- [ ] **Step 1: 添加 UndoManager import**

在文件顶部添加:

```typescript
import { UndoManager } from './undo-manager'
```

- [ ] **Step 2: 修改 undoManager 属性类型**

将:

```typescript
public undoManager: Y.UndoManager
```

改为:

```typescript
public undoManager: UndoManager
```

- [ ] **Step 3: 修改构造函数中实例化方式**

将:

```typescript
this.undoManager = new Y.UndoManager(this.dsl)
```

改为:

```typescript
this.undoManager = new UndoManager(this.dsl)
```

### Task 3: 修改 index.ts

**Files:**

- Modify: `packages/vbi/src/builder/index.ts:1-4`

- [ ] **Step 1: 添加 UndoManager 导出**

```typescript
export { VBIBuilder } from './vbi-builder'
export { VBI } from './vbi'
export { MeasuresBuilder, DimensionsBuilder, ChartTypeBuilder, HavingFiltersBuilder } from './sub-builders'
export { UndoManager } from './undo-manager'
```

---

## Chunk 3: 注册 API 生成器

### Task 4: 修改 build-api.mjs

**Files:**

- Modify: `packages/vbi/scripts/build-api.mjs:24-51`

- [ ] **Step 1: 在 BUILDER_CONFIG 中添加 undoManager 配置**

在 BUILDER_CONFIG 数组末尾添加:

```javascript
{
  name: 'undoManager',
  label: 'undo-manager',
  file: 'undo-manager.ts',
  category: 'utilities'
},
```

---

## Chunk 4: 单元测试

### Task 5: 创建单元测试

**Files:**

- Create: `packages/vbi/tests/builder/undo-manager.test.ts`

- [ ] **Step 1: 编写单元测试**

```typescript
import { VBI } from '@visactor/vbi'

describe('UndoManager', () => {
  test('basic undo/redo', () => {
    const builder = VBI.from({})

    // 初始状态
    expect(builder.undoManager.canUndo()).toBe(false)
    expect(builder.undoManager.canRedo()).toBe(false)

    // 添加一个度量
    builder.measures.add('sales', (node) => {
      node.setAlias('Sales')
    })

    // 有可撤销，无可重做
    expect(builder.undoManager.canUndo()).toBe(true)
    expect(builder.undoManager.canRedo()).toBe(false)

    // 撤销
    const undoResult = builder.undoManager.undo()
    expect(undoResult).toBe(true)
    expect(builder.undoManager.canUndo()).toBe(false)
    expect(builder.undoManager.canRedo()).toBe(true)

    // 重做
    const redoResult = builder.undoManager.redo()
    expect(redoResult).toBe(true)
    expect(builder.undoManager.canUndo()).toBe(true)
    expect(builder.undoManager.canRedo()).toBe(false)
  })

  test('clear', () => {
    const builder = VBI.from({})

    builder.measures.add('sales', (node) => {
      node.setAlias('Sales')
    })

    expect(builder.undoManager.canUndo()).toBe(true)

    builder.undoManager.clear()

    expect(builder.undoManager.canUndo()).toBe(false)
    expect(builder.undoManager.canRedo()).toBe(false)
  })

  test('undo returns false when nothing to undo', () => {
    const builder = VBI.from({})

    const result = builder.undoManager.undo()
    expect(result).toBe(false)
  })

  test('redo returns false when nothing to redo', () => {
    const builder = VBI.from({})

    const result = builder.undoManager.redo()
    expect(result).toBe(false)
  })
})
```

- [ ] **Step 2: 运行单元测试**

```bash
pnpm --filter=@visactor/vbi run test
```

---

## Chunk 5: 集成测试

### Task 6: 创建集成测试

**Files:**

- Create: `packages/vbi/tests/examples/undoManager/undo-redo.json`

- [ ] **Step 1: 创建 JSON 测试用例**

```json
{
  "name": "undo-redo",
  "description": "撤销重做功能测试",
  "schema": [{ "name": "sales", "type": "number" }],
  "dsl": {
    "chartType": "bar",
    "dimensions": [],
    "measures": [{ "field": "sales", "alias": "销售额", "encoding": "yAxis", "aggregate": { "func": "sum" } }],
    "limit": 10
  },
  "code": "const applyBuilder = (builder: VBIBuilder) => { builder.undoManager.undo(); }"
}
```

- [ ] **Step 2: 运行生成器创建测试文件**

```bash
pnpm --filter=@visactor/vbi run g
```

- [ ] **Step 3: 验证生成的测试文件**

检查 `packages/vbi/tests/examples/undoManager/undo-redo.test.ts` 是否存在

---

## Chunk 6: 验证

### Task 7: 运行全部验证

- [ ] **Step 1: typecheck**

```bash
pnpm run typecheck
```

- [ ] **Step 2: lint**

```bash
pnpm run lint
```

- [ ] **Step 3: test**

```bash
pnpm --filter=@visactor/vbi run test
```

- [ ] **Step 4: 生成 API 文档**

```bash
pnpm --filter=@visactor/vbi run g
```

---

## 提交

- [ ] 提交所有更改

```bash
git add -A
git commit -m "feat(vbi): add UndoManager class for undo/redo support

- Add UndoManager class wrapping YJS UndoManager
- Integrate with VBIBuilder
- Add unit tests and integration tests
- Register in API generator"
```
