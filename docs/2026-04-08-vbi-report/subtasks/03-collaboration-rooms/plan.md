# Plan: 协同 room 与文档初始化改造

> 基于 ADR: `./adr.md`

## 范围

本计划覆盖 `apps/vbi_be` 协同服务与 `apps/vbi_fe` 协同接入协议。

## TDD 与质量约束

1. 先补跨类型隔离、默认文档初始化、断连恢复测试
2. room 协议改造不得只靠人工联调验证
3. 每次修改 room 解析或持久化映射，都要补对应回归测试
4. 收尾前必须证明 `chart`、`report`、`insight` 三类 room 不串写

## Phase 1: 统一 room 协议

任务：

1. 先补 room 生成与解析的失败测试
2. 约定 room 格式为 `{type}:{id}`
3. 修改前端 room 生成逻辑
4. 修改后端 room 解析逻辑

## Phase 2: 按类型初始化文档

任务：

1. 调整 `onLoadDocument`
2. 为 chart / report / insight 分配默认空 DSL
3. 校验默认文档与 builder 类型一致

## Phase 3: 调整持久化链路

任务：

1. 让 snapshot / update 读写绑定 `resource_id`
2. 保证 room 解析后能落到正确资源记录
3. 补断连恢复与跨类型隔离测试

验收标准：

1. `chart:id`、`report:id`、`insight:id` 不串写
2. 同类资源可正确恢复历史快照和增量更新
3. room 解析、初始化、恢复链路均有自动化测试
