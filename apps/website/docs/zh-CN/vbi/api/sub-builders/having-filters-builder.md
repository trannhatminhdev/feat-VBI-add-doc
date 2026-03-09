# HavingFiltersBuilder

Having 过滤构建器，用于添加、修改、删除分组后过滤条件

## 构造函数

```typescript
new HavingFiltersBuilder(doc: Y.Doc)
```

## 属性

## 方法

### removeFilter

Having 过滤构建器 - 用于构建 SQL HAVING 条件

**签名**:

```typescript
removeFilter(field: string): boolean
```

**参数**:

- `field`: string

**返回**: `boolean`

### updateFilter

**签名**:

```typescript
updateFilter(field: string, updates: Partial<Omit<VBIHavingFilter, 'field'>>): boolean
```

**参数**:

- `field`: string
- `updates`: Partial<Omit<VBIHavingFilter
- `'field'>>`

**返回**: `boolean`

### find

**签名**:

```typescript
find(field: string): VBIHavingFilter | undefined
```

**参数**:

- `field`: string

**返回**: `VBIHavingFilter | undefined`

### findAllHavingFilters

**签名**:

```typescript
findAllHavingFilters(): VBIHavingFilter[]
```

**返回**: `VBIHavingFilter[]`

### toJson

**签名**:

```typescript
toJson(): VBIHavingFilter[]
```

**返回**: `VBIHavingFilter[]`

### clear

**签名**:

```typescript
clear(): void
```

**返回**: `void`

### getCount

取消监听过滤条件变化 */

**签名**:

```typescript
getCount(): number
```

**返回**: `number`

### isEmpty

**签名**:

```typescript
isEmpty(): boolean
```

**返回**: `boolean`

