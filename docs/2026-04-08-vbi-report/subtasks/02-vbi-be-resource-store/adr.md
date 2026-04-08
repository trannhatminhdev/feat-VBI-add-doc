# ADR: apps/vbi_be 采用资源主表与引用关系模型

## Summary

`apps/vbi_be` 不再用单一 `Document / DocumentUpdate` 模型承载所有协同对象，而改为资源主表加引用关系模型。

核心目标：

- 支持 `chart`、`report`、`insight` 三类资源
- 支持 report 引用独立内容资源
- 删除 page 时只删除引用，不删除底层资源

## Decision

### 1. 引入 Resource 主表

统一资源元数据：

- `id`
- `type`
- `name`
- `meta`
- `createdAt`
- `updatedAt`

协同快照和增量更新绑定 `resource_id`，不再混用 document 语义。

### 2. 引入资源引用关系

新增引用关系表，至少表达：

- report page -> chart
- report page -> insight

引用关系要能支持：

- 查询 report 使用了哪些资源
- 查询某个 chart / insight 被哪些 report page 使用

### 3. 删除策略改为“先校验引用”

- 删除 page: 只删 report 结构和引用记录
- 删除资源: 先校验是否仍被引用
- 不做 page 删除时的级联资源删除

## Consequences

优点：

- 后端模型与资源化 report 一致
- 资源可复用，可追踪引用
- 为后续权限、统计、复用分析预留空间

代价：

- 需要迁移现有 document 读写路径
- 服务层接口会比单表模型更复杂
