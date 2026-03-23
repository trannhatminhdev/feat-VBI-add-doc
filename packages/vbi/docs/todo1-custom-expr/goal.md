------
status: in-progress
---

---

生成 architecture-decisions 文档, 命名为 ./adr.md

这里是 packages/vbi 计划要完成的开发任务:
[] 确保 packages/vquery/docs/2026-03-22-custom-expr 已经完成
[] packages/vbi内计划要增加计算字段, 例如 sales(销售额) - profit(利润) 可以得到“成本”字段, 为此 VBIChartDSL 的数据连接器, 需要支持用户自定义字段, 我认为这可能涉及到修改 discoverSchema, 要给每一个字段增加 expr 的功能, expr 时 duckdb 的风格.
[] vbidsl 需要配合 vquery的设计, 在vbidsl合适的位置设计好新的结构
[] 修改buildVQuery以实现新的结构
[] 设计完成后, 根据TDD驱动, 先编写测试用例让其失败, 然后实现功能, 让测试用例全部通过.
[] 预期生成的SQL会有较大的差异变化, 因此允许一定程度的breakChange, 例如sql改变, 但是example内的查询结果, 必须和以前一致.
[] 保证 vquery、vbi 的lint、typecheck、g、test全部通过
[] 保证 仓库的typecheck、test完全通过
