# Plan: apps/vbi_fe 资源列表、路由与协同接入改造

> 基于 ADR: `./adr.md`

## 范围

本计划覆盖 `apps/vbi_fe` 的列表页、路由、页面装配和资源协同 hook。

## TDD 与质量约束

1. 先补列表页、路由分流、资源 hook 的失败测试
2. 页面壳子可以先搭，但可交互行为必须由测试锁定
3. report 页对子资源的访问行为不能只靠手工点击验证
4. 收尾前至少覆盖页面入口、路由命中、资源连接三类行为

## Phase 1: 改造资源列表页

任务：

1. 先补列表页展示与创建入口的失败测试
2. 列表展示资源 `type`
3. 创建入口支持新建 chart 或 report
4. 保留 insight 的内部访问能力，但不默认暴露顶层创建按钮

## Phase 2: 拆分编辑路由

任务：

1. 新增 `/chart/:id`
2. 新增 `/report/:id`
3. chart 页继续挂 standard
4. report 页接入 standard-report

## Phase 3: 收敛协同 hook

任务：

1. 抽象按资源类型创建 builder 的通用 hook
2. 统一 room 生成规则
3. 为 report 页提供 `resourceGateway`
4. 支持按需打开 chart / insight 子资源

## Phase 4: 验证

任务：

1. 验证 chart 页单资源协同编辑
2. 验证 report 页结构文档加载
3. 验证 report 页对子资源的按需连接

验收标准：

1. chart / report 双入口可独立打开
2. 前端不再把 report 当作内嵌 chart 文档处理
3. 关键页面流转与资源连接行为有自动化测试
