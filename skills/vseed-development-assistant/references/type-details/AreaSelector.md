### AreaSelector

```typescript
export type AreaSelector =
  | {
      field: string
      operator?: ('=' | '==' | '!=' | '>' | '<' | '>=' | '<=' | 'between') | null
      op?: ('=' | '==' | '!=' | '>' | '<' | '>=' | '<=' | 'between') | null
      value: string | number | (string | number)[]
    }
  | {
      field: string
      operator?: ('in' | 'not in') | null
      op?: ('in' | 'not in') | null
      value: string | number | (string | number)[]
    }
```

### AreaSelectors

```typescript
export type AreaSelectors = (
  | {
      field: string
      operator?: ('=' | '==' | '!=' | '>' | '<' | '>=' | '<=' | 'between') | null
      op?: ('=' | '==' | '!=' | '>' | '<' | '>=' | '<=' | 'between') | null
      value: string | number | (string | number)[]
    }
  | {
      field: string
      operator?: ('in' | 'not in') | null
      op?: ('in' | 'not in') | null
      value: string | number | (string | number)[]
    }
)[]
```
