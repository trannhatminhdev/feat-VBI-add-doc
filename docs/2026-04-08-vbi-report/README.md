# 2026-04-08 vbi-report

本目录记录 `vbi_fe` / `vbi_be` 接入 `standard-report` 的设计与执行材料。

## 执行原则

- 所有任务按 TDD 执行：先写失败测试，再写最小实现，最后重构
- 每个子任务结束前都要完成对应模块的自动化验证
- 总体合并门槛是仓库级 `lint` 与 `typecheck` 通过
- 子任务文档里的 `plan.md` 是执行约束，不是仅供参考的说明

## 文件说明

- [`goal.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/goal.md): 原始问题陈述
- [`adr.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/adr.md): 总体架构决策
- [`plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/plan.md): 可执行总计划
- `subtasks/`: 按执行边界拆分的子任务 ADR 与 Plan

## 子任务

1. [`01-vbi-resource-model`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/01-vbi-resource-model/plan.md)
2. [`02-vbi-be-resource-store`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/02-vbi-be-resource-store/plan.md)
3. [`03-collaboration-rooms`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/03-collaboration-rooms/plan.md)
4. [`04-vbi-fe-resource-entry`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/04-vbi-fe-resource-entry/plan.md)
5. [`05-standard-report-shell`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/subtasks/05-standard-report-shell/plan.md)

## 推荐阅读顺序

1. 先看 [`goal.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/goal.md)
2. 再看 [`adr.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/adr.md)
3. 执行时以 [`plan.md`](/Users/bytedance/Projects/VBI/docs/2026-04-08-vbi-report/plan.md) 为主入口
4. 开始具体实现前，再进入对应 `subtasks/*`

## 执行顺序

1. `01-vbi-resource-model`
2. `02-vbi-be-resource-store`
3. `03-collaboration-rooms`
4. `04-vbi-fe-resource-entry`
5. `05-standard-report-shell`
6. 联调验收
