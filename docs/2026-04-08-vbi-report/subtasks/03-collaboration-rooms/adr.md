# ADR: 协同房间统一为 `{type}:{id}`

## Summary

资源化模型要求不同资源类型拥有独立协同上下文，因此 room 不能再只依赖 `id`，必须显式带上资源类型。

## Decision

### 1. room 命名统一为 `{type}:{id}`

示例：

- `chart:123`
- `report:456`
- `insight:789`

这样可以避免同一个 `id` 在不同资源类型下共享状态语义。

### 2. Hocuspocus 按资源类型初始化空文档

`onLoadDocument` 根据 `type` 初始化：

- `chart` -> 空 chart DSL
- `report` -> 空 report DSL
- `insight` -> 空 insight DSL

### 3. snapshot / update 按资源类型与资源 id 读写

协同存储层需要确保：

- 加载路径与 room 解析一致
- 持久化对象与资源类型匹配
- 断连恢复后仍能得到正确类型的默认文档

## Consequences

优点：

- 不同资源类型彻底隔离
- room 命名可直接用于排障和观测

代价：

- 前后端所有协同接入点都要同步改造
