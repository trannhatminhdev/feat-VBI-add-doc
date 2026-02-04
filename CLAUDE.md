# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

VSeed 是一个 Monorepo 项目（VisActor 生态），核心组件包括：

- **@visactor/vseed**: 声明式图表生成器。通过 Builder 流水线（AdvancedPipeline -> SpecPipeline）将高级语义配置转换为 VChart/VTable Spec。
- **@visactor/vquery**: 通用数据查询引擎。将 JSON DSL 编译为 SQL，支持多种 Dialect（DuckDB, Postgres等）及适配器。

## 常用开发命令（必须在根目录执行）

**重要原则**: 所有 `pnpm` 命令必须在项目根目录执行。针对特定包的操作请使用 `--filter` 参数。

### 1. 核心工作流

- **生成器 (g 功能)**: 自动生成测试用例与 API 文档。修改代码后建议运行。
  ```bash
  pnpm run g
  ```
- **构建**:
  ```bash
  pnpm run build                       # 构建所有包
  pnpm --filter=@visactor/vseed build  # 仅构建 vseed
  ```
- **开发**:
  ```bash
  pnpm run dev                         # 启动文档站点 (apps/website)
  pnpm --filter=@visactor/vseed dev    # 监听 vseed 编译
  ```

### 2. 代码质量

```bash
pnpm run lint          # 全量 Lint
pnpm run typecheck     # 全量类型检查
pnpm run format        # 格式化代码
```

### 3. 测试 (Testing)

#### @visactor/vseed

VSeed 测试分为单元测试与集成测试：

- **单元测试 (Unit)**: 位于 `packages/vseed/tests/unit`。
  ```bash
  pnpm --filter=@visactor/vseed run test:unit
  ```
- **集成测试 (Integration)**: 位于 `packages/vseed/tests/integrations`。基于 JSON Spec 的快照测试。
  ```bash
  pnpm --filter=@visactor/vseed run test:integration
  ```
- **更新快照**:
  ```bash
  pnpm --filter=@visactor/vseed run test:update
  ```

#### @visactor/vquery

VQuery 使用 Rstest 框架进行测试：

- **运行测试**:
  ```bash
  pnpm --filter=@visactor/vquery run test
  ```

## 架构总览

### VSeed

- **Builder**: 核心入口，管理 Context 与 Pipeline。
- **Pipeline**:
  - `AdvancedPipeline`: 处理数据转换、主题应用、高级图表逻辑。
  - `SpecPipeline`: 负责最终 Spec 的生成。
- **插件系统**: 图表类型通过 Register 机制注册。

### VQuery

- **Compiler**: 将 Query DSL (`Select`, `Where`, `GroupBy`) 编译为 SQL 字符串。
- **Adapters**:
  - `DuckDB`: 浏览器/Node.js 环境下的高性能分析。
  - `Kysely`: 底层 SQL 构建器支持。

## 目录结构提示

- `packages/vseed/src`: 核心源码
- `packages/vquery/src`: 查询引擎源码
- `apps/website`: 文档与示例
- `packages/vseed/tests/integrations`: VSeed 集成测试用例 (JSON)
