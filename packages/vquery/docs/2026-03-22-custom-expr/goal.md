------
status: in-progress
---

---

生成 architecture-decisions 文档, 命名为 ./adr.md

这里是 packages/vquery 计划要完成的开发任务:
[] packages/vbi内计划要增加计算字段, 例如 sales(销售额) - profit(利润) 可以得到“成本”字段, 为此在 VQuery 侧, 需要在 select 时, 可以自定义表达式, 支持 expr 结构. 考虑到一致性, 所有字段都应该要有expr, 从而做到一致性的构建VQuery DSL. 因此携带expr的字段, 可以如普通字段一般, 可以被正常的放入到 where、having、select、order、group子句.
[] 请设计合适的VQuery DSL, 对整体进行改造, 满足自定义表达式功能
[] 设计完成后, 根据TDD驱动, 先编写测试用例让其失败, 然后实现功能, 让测试用例全部通过.
[] 预期生成的SQL会有较大的差异变化, 因此允许一定程度的breakChange, 例如sql改变, 但是example内的查询结果, 必须和以前一致.
[] 保证 vquery、vbi 的lint、typecheck、g、test全部通过
[] 保证 仓库的typecheck、test完全通过
