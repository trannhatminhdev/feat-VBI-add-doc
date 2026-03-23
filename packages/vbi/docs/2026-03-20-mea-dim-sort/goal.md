------
status: in-progress
---

---

生成 architecture-decisions 文档, 命名为 ./adr.md

这里是 packages/vbi 计划要完成的开发任务:
[] measure 和 dimension 要支持排序, 设计好合适的VBI DSL, 然后修改 buildVQuery, 正确取数.
[] 如果没有任何 dimension、 measure 被配置过排序, 则buildVQuery时, 默认按第一个维度排序. 这一点可能导致单元测试出现变化, 可以执行pnpm g重新构建单测并更新快照. 允许这一步出现的breakChange.
[] 如果有 measure 或 dimension 被配置过排序, 则buildVQuery时, 按配置的排序字段排序, 忽略默认逻辑
