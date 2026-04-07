# ADR: apps/vbi_fe 改为资源列表与按类型编辑入口

## Summary

前端不能再默认所有文档都是 chart。资源化方案要求列表、路由、协同 hook 都显式区分资源类型。

## Decision

### 1. 列表页支持 chart / report 双入口

- 创建时允许选择 Chart 或 Report
- 列表项展示 `type`
- insight 暂不作为常用顶层创建入口暴露

### 2. 路由按类型拆分

- `/chart/:id`
- `/report/:id`

chart 编辑页继续使用 standard。
report 编辑页使用 standard-report。

### 3. 协同 hook 抽象为资源工厂

原有面向单 chart 的协同 hook 需要收敛为：

- 按资源类型创建 builder
- 按资源类型生成 room
- 为 report 页按需打开子资源

## Consequences

优点：

- 前端信息架构与资源模型一致
- report 页面可以显式管理子资源连接

代价：

- 路由、页面装配、状态管理都需要拆分
