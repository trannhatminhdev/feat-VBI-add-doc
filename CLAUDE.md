# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

VBI (Visual Business Intelligence) 是一个 Monorepo 项目（VisActor 生态），实现从数据配置到图表渲染的完整数据可视化流水线。

### 核心架构

```
用户配置 (VBI)
    │
    ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  VBI (配置层)    │───▶│ VQuery (查询层)  │───▶│ VSeed (渲染层)   │
│  VBIDSL         │    │ QueryDSL → SQL  │    │ VSeedDSL → Spec │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 核心组件

| 组件       | 包名             | 职责                                                                                                  |
| ---------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| **VBI**    | @visactor/vbi    | 可视化配置与协同编辑平台。基于 Yjs 实现 DSL 协同，支持 chartType、measures、dimensions、having 等配置 |
| **VQuery** | @visactor/vquery | 通用数据查询引擎。将 JSON DSL 编译为 SQL，支持 DuckDB、Postgres 等方言                                |
| **VSeed**  | @visactor/vseed  | 声明式图表生成器。将高级语义配置转换为 VChart/VTable 的渲染 Spec                                      |

### 数据流

1. **用户配置**: 通过 VBI 配置图表（chartType、measures、dimensions、having 等）
2. **VBI 构建 Query**: `VBIBuilder.buildVQuery()` 将 VBIDSL 转换为 VQueryDSL
3. **VQuery 执行**: Connector 调用 VQuery 执行 SQL 查询，返回数据集
4. **VSeed 生成 Spec**: 合并 VBIDSL + 数据集，通过 Builder 转换为 VChart/VTable Spec
5. **前端渲染**: 使用 VChart/VTable 渲染图表

### 目录结构

```
VBI/
├── apps/           # 应用程序
│   ├── website/   # 文档站点
│   ├── vbi_fe/   # VBI 前端应用
│   └── vbi_be/   # VBI 后端应用
├── packages/      # 核心包 (Monorepo)
│   ├── vbi/      # VBI 主包 (配置层)
│   ├── vquery/   # 查询引擎 (查询层)
│   └── vseed/   # 图表生成器 (渲染层)
├── practices/     # 实践示例
│   ├── demo/
│   ├── minimalist/
│   ├── professional/
│   └── streamlined/
└── tools/         # 工具
```

---

## VBI 项目 (项目级别)

项目级别指整个 Monorepo 仓库的通用操作。

### 常用开发命令

**重要原则**: 所有 `pnpm` 命令必须在项目根目录执行。针对特定包的操作请使用 `--filter` 参数。

```bash
# 构建
pnpm run build  # 构建所有包

# 开发
pnpm run dev    # 启动文档站点 (apps/website), 会自动监听所有包源码编译

# 代码质量
pnpm run lint      # 全量 Lint
pnpm run typecheck # 全量类型检查
pnpm run format    # 格式化代码
```

---

## packages/vbi (@visactor/vbi)

vbi 包是 BI 构建器，依赖 vseed 和 vquery。基于 Yjs 实现协同编辑 DSL。

### 架构

| 模块          | 功能                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------- |
| **builder**   | 核心构建器 (VBIBuilder, MeasuresBuilder, DimensionsBuilder, ChartTypeBuilder, HavingBuilder) |
| **pipeline**  | 转换管道 (VBI DSL → VQuery DSL)                                                              |
| **types**     | VBIDSL 类型定义                                                                              |
| **insight**   | 数据洞察功能                                                                                 |
| **connector** | 数据源连接器注册表                                                                           |

### VBIDSL 结构

```typescript
{
  connectorId: string,   // 数据源连接器ID
  chartType: ChartType, // 图表类型
  dimensions: Dimension[],  // 维度树
  measures: Measure[],   // 度量树
  having: HavingFilter[], // 分组过滤
  theme: 'light' | 'dark',
  locale: string,
  version: number
}
```

### 开发流程

```
1. 先写测试用例 (单元测试或集成测试)
2. 开发实现代码
3. 验证: typecheck → lint → format → test
```

### 命令参考

```bash
# 构建
pnpm --filter=@visactor/vbi build  # 构建

# 测试
pnpm --filter=@visactor/vbi run test          # 运行测试
pnpm --filter=@visactor/vbi run test:update   # 更新快照
pnpm --filter=@visactor/vbi run test:coverage # 生成测试覆盖率报告

# 生成器
pnpm --filter=@visactor/vbi run g          # 从 JSON 生成文档、测试文件

# 代码质量
pnpm --filter=@visactor/vbi run lint
pnpm --filter=@visactor/vbi run format
pnpm --filter=@visactor/vbi run typecheck
```

### 测试结构

- 使用 Rstest 框架
- 依赖 @visactor/vseed 和 @visactor/vquery

### 目录结构

```
packages/
├── vbi/        # VBI 核心源码 (依赖 VSeed, VQuery)
├── vquery/     # VQuery 查询引擎源码
└── vseed/      # VSeed 核心源码

apps/
└── website/    # 文档站点

packages/vbi/tests/
├── builder/        # 单元测试
├── query/          # 查询集成测试
├── examples/       # 集成测试 (JSON Spec)
│   ├── line/       # 按图表类型分类
│   ├── bar/
│   ├── column/
│   ├── pie/
│   └── table/
├── mocks/          # Mock 文件
└── scripts/        # 构建脚本
    ├── build-tests.mjs
    └── build-docs.mjs
```

---

## packages/vquery (@visactor/vquery)

### 架构

| 模块                    | 功能                                            |
| ----------------------- | ----------------------------------------------- |
| **VQuery**              | 主类，管理数据集生命周期                        |
| **sql-builder**         | DSL → SQL 转换 (Select, Where, GroupBy, Having) |
| **adapters**            | DuckDB 浏览器执行引擎 (WASM)                    |
| **data-source-builder** | 数据源构建器                                    |

### QueryDSL 结构

```typescript
{
  select: Select<T>,       // 字段选择
  where?: Where<T>,       // 过滤条件
  groupBy?: GroupBy<T>,   // 分组
  having?: Having<T>,     // 分组过滤
  orderBy?: OrderBy<T>,   // 排序
  limit?: number          // 限制数量
}
```

### 开发流程

```
1. 先写测试用例 (单元测试或集成测试)
2. 开发实现代码
3. 运行 pnpm g 生成测试文件、文档和更新快照
4. 验证: typecheck → lint → format → test
```

### 命令参考

```bash
# 构建
pnpm --filter=@visactor/vquery build  # 构建

# 测试
pnpm --filter=@visactor/vquery run test          # 运行测试
pnpm --filter=@visactor/vquery run test:update   # 更新快照
pnpm --filter=@visactor/vquery run test:coverage # 生成测试覆盖率报告

# 生成器 (修改代码后执行)
pnpm --filter=@visactor/vquery run g

# 代码质量
pnpm --filter=@visactor/vquery run lint
pnpm --filter=@visactor/vquery run format
pnpm --filter=@visactor/vquery run typecheck
```

### 测试结构

- 使用 Rstest 框架
- 单元测试与集成测试

---

## packages/vseed (@visactor/vseed)

### 架构

| 模块             | 功能                                                   |
| ---------------- | ------------------------------------------------------ |
| **Builder**      | 核心入口，管理 Context 与 Pipeline                     |
| **Pipeline**     | AdvancedPipeline (高级配置) → SpecPipeline (最终 Spec) |
| **register**     | 图表类型注册 (line/bar/pie/table 等)                   |
| **dataReshape**  | 数据重塑/透视                                          |
| **dataSelector** | 数据选择器                                             |
| **theme**        | 主题管理                                               |
| **i18n**         | 国际化                                                 |

### 核心流程

```
VSeed DSL → Builder.buildAdvanced() → AdvancedVSeed → Builder.buildSpec() → VChart/VTable Spec
```

### 支持的图表类型

- 表格: Table, PivotTable
- 笛卡尔: Line, Column, Bar, Area, Scatter, DualAxis
- 极坐标: Rose, Pie, Donut, Radar
- 竞赛图: RaceBar, RaceColumn, RaceScatter, RaceLine, RacePie
- 层级: TreeMap, Sunburst, CirclePacking
- 其他: Funnel, Heatmap, BoxPlot, Histogram

### 开发流程

```
1. 先写集成测试用例 (JSON Spec)
2. 开发实现代码
3. 运行 pnpm g 生成测试文件、文档、示例和 API
4. 验证: typecheck → lint → format → test
```

### 命令参考

```bash
# 构建
pnpm --filter=@visactor/vseed build  # 构建

# 测试
pnpm --filter=@visactor/vseed run test:unit        # 单元测试
pnpm --filter=@visactor/vseed run test:integration # 集成测试
pnpm --filter=@visactor/vseed run test:update      # 更新快照
pnpm --filter=@visactor/vseed run test:coverage    # 生成测试覆盖率报告

# 生成器 (修改代码后执行)
pnpm --filter=@visactor/vseed run g

# 代码质量
pnpm --filter=@visactor/vseed run lint
pnpm --filter=@visactor/vseed run format
pnpm --filter=@visactor/vseed run typecheck
```

### 测试结构

- **单元测试 (Unit)**: 位于 `packages/vseed/tests/unit`
- **集成测试 (Integration)**: 位于 `packages/vseed/tests/integrations`，基于 JSON Spec 的快照测试

## 检测代码质量

如果开发过程中改动到了子包，需要进行全量验证：

```bash
pnpm run lint      # 全量 Lint
pnpm run format    # 格式化代码
pnpm run typecheck # 全量类型检查
```

## 持续改良 Claude.md

每一个任务完成后, 请阅读claude.md, 检查是否有新的建议或改进, 持续改良 Claude.md
