# havingFilters

Having 过滤构建器，用于添加、修改、删除分组后过滤条件

## 构造函数

```typescript
new havingFilters(doc: Y.Doc)
```

## 属性

## 方法

### remove

Having 过滤构建器 - 用于构建 SQL HAVING 条件

**定义**:

```typescript
remove(field: string): boolean
```

**返回**: `boolean`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |

### update

更新指定字段的过滤条件

**定义**:

```typescript
update(field: string, updates: Partial<Omit<VBIHavingFilter, 'field'>>): boolean
```

**返回**: `boolean`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |
| `updates` | Partial<Omit<VBIHavingFilter, 'field'>> |

### find

根据字段名查找 Having 过滤条件

**定义**:

```typescript
find(field: string): VBIHavingFilter | undefined
```

**返回**: `VBIHavingFilter | undefined`

**参数**:

| 参数 | 类型 |
| --- | --- |
| `field` | string |

### findAll

获取所有 Having 过滤条件

**定义**:

```typescript
findAll(): VBIHavingFilter[]
```

**返回**: `VBIHavingFilter[]`

### toJson

导出所有 Having 过滤条件为 JSON 数组

**定义**:

```typescript
toJson(): VBIHavingFilter[]
```

**返回**: `VBIHavingFilter[]`

### clear

清空所有 Having 过滤条件

**定义**:

```typescript
clear(): void
```

**返回**: `void`

### getCount

监听过滤条件变化

**定义**:

```typescript
getCount(): number
```

**返回**: `number`

### isEmpty

检查是否没有过滤条件

**定义**:

```typescript
isEmpty(): boolean
```

**返回**: `boolean`

