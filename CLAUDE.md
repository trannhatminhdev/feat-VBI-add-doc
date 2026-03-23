# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目规范

- 遵循 Single Source of Truth 原则：VBIChartDSL、VQueryDSL、VSeedDSL 驱动核心功能
- 遵循第一性原理，做符合直觉的设计和实现
- 遵循小函数, 小文件理念, 单个文件不超过 100 行, 单个函数不超过 50 行

## 项目概览

VBI（Visual Business Intelligence）是 VisActor 生态的 Monorepo，实现从数据配置到图表渲染的完整可视化流水线。

```
用户配置 → VBI (配置层/VBIChartDSL) → VQuery (查询层/QueryDSL→SQL) → VSeed (渲染层/VSeedDSL→Spec)
```

| 包                   | 职责                                                  |
| -------------------- | ----------------------------------------------------- |
| **@visactor/vbi**    | BI 构建器，基于 Yjs 协同编辑 DSL，依赖 vseed + vquery |
| **@visactor/vquery** | 通用查询引擎，JSON DSL → SQL，支持 DuckDB/Postgres    |
| **@visactor/vseed**  | 声明式图表生成器，语义配置 → VChart/VTable Spec       |

### 目录结构

```
VBI/
├── apps/                           # 应用层：文档站点、前端、后端
│   ├── website/                    # 官网文档、示例与 playground
│   ├── vbi_fe/                     # VBI 前端应用
│   └── vbi_be/                     # VBI 后端应用
├── packages/                       # 包级实现，统一包含 src/ 与 docs/
│   ├── vbi/                        # 配置层，负责 VBIChartDSL、Builder、协同编辑
│   │   ├── src/                    # 源码
│   │   └── docs/                   # 包级目标、ADR、计划
│   ├── vquery/                     # 查询层，负责 QueryDSL → SQL 与数据查询
│   │   ├── src/
│   │   └── docs/
│   ├── vseed/                      # 渲染层，负责 VSeedDSL → VChart/VTable Spec
│   │   ├── src/
│   │   └── docs/
│   └── vbi-react/                  # React 适配与集成层
│       ├── src/
│       └── docs/
├── practices/                      # 不同复杂度的实践示例
│   ├── demo/                       # 标准版示例
│   │   ├── src/
│   │   └── docs/
│   ├── minimalist/                 # 极简实现示例
│   │   ├── src/
│   │   └── docs/
│   ├── professional/               # 偏业务化的完整示例
│   │   ├── src/
│   │   └── docs/
│   ├── streamlined/                # 精简结构示例
│   │   ├── src/
│   │   └── docs/
│   └── vbi-react-starter/          # React Starter 示例
│       ├── src/
│       └── docs/
├── docs/                           # 仓库级设计与演进记录，按主题目录组织
│   ├── README.md                   # 文档约定说明
│   └── YYYY-MM-DD-topic/           # 单个决策、功能、Topic目录
│       ├── goal.md                 # 目标/需求（按需）
│       ├── adr.md                  # 架构决策（按需）
│       └── plan.md                 # 执行计划（按需）
├── tools/                          # 开发辅助脚本与工具
├── docker/                         # 本地运行与部署相关容器配置
├── skills/                         # 仓库内置的开发辅助技能
├── README.md                       # 项目总览与使用说明
├── AGENTS.md                       # Coding Agent 协作说明
└── CLAUDE.md                       # Claude Code 协作说明
```

### 数据流

1. 用户通过 VBI 配置图表（chartType、measures、dimensions、having 等）
2. `VBIChartBuilder.buildVQuery()` 将 VBIChartDSL → VQueryDSL
3. Connector 调用 VQuery 执行 SQL，返回数据集
4. 合并 VBIChartDSL + 数据集，通过 VSeed Builder → VChart/VTable Spec
5. 前端渲染

## 常用命令

**所有 `pnpm` 命令必须在项目根目录执行，针对特定包用 `--filter`。**

```bash
# 全局
pnpm run build                  # 构建所有包
pnpm run dev                    # 启动文档站点，自动监听所有包源码
pnpm run lint                   # 全量 Lint
pnpm run typecheck              # 全量类型检查
pnpm run format                 # 格式化代码

# 子包通用（以 vbi 为例，替换 filter 即可）
pnpm --filter=@visactor/vbi run build
pnpm --filter=@visactor/vbi run test
pnpm --filter=@visactor/vbi run test:update
pnpm --filter=@visactor/vbi run test:coverage
pnpm --filter=@visactor/vbi run lint
pnpm --filter=@visactor/vbi run format
pnpm --filter=@visactor/vbi run g             # 从 JSON 生成文档、测试、API

# vseed 额外命令
pnpm --filter=@visactor/vseed run test:unit
pnpm --filter=@visactor/vseed run test:integration
```

## 开发流程（统一）

```
1. 先写测试用例（单元测试或集成测试 JSON Spec）
2. 开发实现代码
3. 运行 pnpm --filter=@visactor/[pkg] run g 生成测试文件、文档、API
4. 验证：typecheck → lint → format → test（仅子包）
```

## 验证指南

| 场景                      | 命令                                                                              |
| ------------------------- | --------------------------------------------------------------------------------- |
| **单包修改**（推荐）      | `pnpm --filter=@visactor/[pkg] run test` + `pnpm run lint` + `pnpm run typecheck` |
| **多包/破坏性变更**       | `pnpm run lint` + `pnpm run format` + `pnpm run typecheck`                        |
| **快速验证**（typo/文档） | `pnpm run lint`                                                                   |

> **注意**：鼓励 项目仓库级别的 lint 和 typecheck
