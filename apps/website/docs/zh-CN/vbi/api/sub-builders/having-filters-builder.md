# HavingFiltersBuilder

Having 过滤构建器，用于添加、修改、删除分组后过滤条件

## 构造函数

```typescript
new HavingFiltersBuilder(doc: Y.Doc)
```

## 属性

## 方法

### addFilter

HavingFiltersBuilder - 用于构建和管理筛选条件

**签名**:

```typescript
addFilter(field: string, operator: string, value: unknown): HavingFiltersNodeBuilder
```

**参数**:

- `field`: string
- `operator`: string
- `value`: unknown

**返回**: `HavingFiltersNodeBuilder`

### removeFilter

移除筛选条件

**签名**:

```typescript
removeFilter(field: string): boolean
```

**参数**:

- `field`: string

**返回**: `boolean`

### ~~getFilters~~

> ⚠️ 已废弃

获取所有筛选条件

**签名**:

```typescript
getFilters(): VBIHavingFilter[]
```

**返回**: `VBIHavingFilter[]`

### toJson

将当前所有筛选条件转换为 JSON 数组

**签名**:

```typescript
toJson(): VBIHavingFilter[]
```

**返回**: `VBIHavingFilter[]`

### clear

清空所有筛选条件

**签名**:

```typescript
clear(): void
```

**返回**: `void`

### getCount

观察筛选条件变化

**签名**:

```typescript
getCount(): number
```

**返回**: `number`

### isEmpty

检查是否为空

**签名**:

```typescript
isEmpty(): boolean
```

**返回**: `boolean`

