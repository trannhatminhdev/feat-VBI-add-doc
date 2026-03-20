# ADR-001: practices/demo Shelves 命名与二级交互收敛

## Status

Proposed

## Context

`practices/demo` 当前的 shelf 相关实现已经有一套稳定骨架，但仍有 4 个明显不一致点需要收敛：

1. 代码目录和 import 仍在使用错误复数 `Shelfs`，而 UI 文案和目标语义使用的是 `shelves`。
2. measure 和 dimension 的二级菜单依赖 `children + popupOffset` 展开，当前偏移量是负值，二级菜单会向左回拉，与一级菜单发生重叠。
3. 二级菜单容器存在额外 padding，导致 hover 到 `求和` 等菜单项时，背景无法贴齐容器左右边界。
4. where 的日期筛选虽然已经有 `VBIWhereDatePredicate` 和 `DateFilterEditor`，但当前交互仍是顶部 `Select` 切换 4 种类型，没有沿用 shelves 体系更稳定的 popover 面板表达。

当前相关代码位置：

- `practices/demo/src/components/Shelfs/common/FieldShelf.tsx`
- `practices/demo/src/components/Shelfs/shelves/MeasureShelf.tsx`
- `practices/demo/src/components/Shelfs/shelves/DimensionShelf.tsx`
- `practices/demo/src/components/Shelfs/utils/menuItemUtils.tsx`
- `practices/demo/src/components/Shelfs/common/FilterShelf.tsx`
- `practices/demo/src/components/Filter/FilterPanel.tsx`
- `practices/demo/src/components/Filter/DateFilterEditor.tsx`

这次改动的重点是 demo 交互与命名收敛，不是 DSL 重设计。`@visactor/vbi` 已经提供了 measure format、dimension aggregate、where date predicate 所需的核心表达能力，本 ADR 只决定 demo 侧如何组织它们。

## Decision

### 1. demo 代码中的复数命名统一为 `Shelves`

`practices/demo` 内所有错误命名 `Shelfs` / `shelfs` 统一改为 `Shelves` / `shelves`。

具体约束：

1. 目录 `practices/demo/src/components/Shelfs` 重命名为 `practices/demo/src/components/Shelves`
2. 所有 import / export / test path 一次性切到 `Shelves`
3. 保留单数 `Shelf` 相关命名，例如 `FieldShelf`、`FilterShelf`、`ShelfTrack`
4. 已经正确的 i18n key `shelves*` 不做重命名
5. 不保留长期兼容 alias，demo 内部直接完成原子迁移

原因：

1. `Shelfs` 是错误复数，继续保留只会扩大认知噪音
2. 这部分是 demo 内部模块，不值得为错误命名维护兼容层
3. 命名统一后，后续文档、测试、组件目录、用户任务描述会回到同一语义

### 2. 所有二级菜单统一贴在一级菜单右侧展开

measure 的 `Aggregate` / `Encoding` / `Format`，dimension 的 `Date Aggregate` / `Encoding`，统一视为二级交互面。

布局规则：

1. 一级菜单继续由 shelf tag 的 `Dropdown` 从 tag 下方展开
2. 所有二级菜单统一从一级菜单项右侧展开
3. 去掉当前负向 `popupOffset`
4. 改为统一正向水平间距，基准取 `4px`
5. 二级面板顶部与触发菜单项顶部对齐

实现约束：

1. `menuItemUtils` 提供唯一的 submenu gap 常量
2. 不允许在单个菜单项里私自覆盖一套新的 offset
3. `MeasureFormatPanel` 虽然是自定义 panel，但交互层级上仍属于二级面，位置规则与普通 submenu 一致

这样做的原因很直接：二级菜单的关系是“附着在右侧继续选择”，而不是“覆盖一级菜单重新选择”。

### 3. 二级菜单的留白改为 item 负责，容器不再吃左右 padding

二级菜单的 hover 背景必须完整覆盖菜单项所在行，不能被容器 padding 截断。

因此统一采用以下规则：

1. submenu 容器左右 padding 归零
2. item 本身负责点击热区和文字留白
3. hover / selected 背景贴齐 submenu 左右边界
4. divider 不再制造额外横向留白
5. item 保持整行可点击，不做局部热区

对自定义 panel 的要求：

1. panel 外层只保留边框、圆角、阴影
2. 结构留白由 panel 内部字段行控制
3. 不依赖外层壳子 padding 去模拟菜单边界

本决策优先保证交互反馈完整，再考虑视觉松弛感。

### 4. where 日期筛选改成单 Popover + Tabs，不引入第二层 overlay

where 日期筛选继续复用 `FilterShelf` / `FilterPanel` 现有的 item editor popover，不再额外开一层新的 popover、modal 或 drawer。

UI 规则：

1. 日期筛选始终在同一个 popover 内编辑
2. `DateFilterEditor` 顶部不再使用 `Select` 切类型
3. 改为固定 4 个 tabs：`range`、`relative`、`current`、`period`
4. 打开已有日期条件时，根据 `predicate.type` 回填当前 tab
5. 新增日期条件时，默认进入 `range` tab

状态规则：

1. 底层数据仍然是 `VBIWhereDatePredicate`
2. tab 切换只切换 `predicate.type`
3. 每个 tab 直接编辑同一个 `datePredicate` 草稿
4. 点击保存后，再统一写回 `builder.whereFilter.add(...)` / `update(...)`

这次不新增 demo 专用 date DSL，也不改变 `setDate(...)` 的 builder 入口。

### 5. 本次 ADR 只处理 demo 交互收敛，不修改核心 DSL 语义

明确范围：

1. 不修改 `@visactor/vbi` 的 `VBIWhereDatePredicate`
2. 不修改 measure format DSL
3. 不修改 dimension aggregate DSL
4. 不修改 chart pipeline 和 lowering 行为
5. 不顺带改造 `HavingFilterPanel`

原因是这些问题都不是表达层缺失，而是 demo 交互层组织方式不稳定。

### 6. 验证范围

需要覆盖以下验证：

1. `practices/demo` 下不再出现 `Shelfs` / `shelfs` 路径引用
2. measure / dimension 二级菜单和 format panel 都从一级菜单右侧展开
3. 二级菜单不再与一级菜单重叠
4. hover `求和` 等菜单项时，背景能贴齐二级菜单左右边界
5. 日期筛选的 4 个 tabs 可切换、可回填、可保存
6. 新增日期条件和编辑日期条件两条路径都能正确写回 `VBIWhereDatePredicate`
7. 现有 `shelfMenus`、aggregate、date aggregate、drag/drop 相关测试随目录迁移同步更新

## Reference

- `practices/demo/src/components/Shelfs/common/FieldShelf.tsx`
- `practices/demo/src/components/Shelfs/shelves/MeasureShelf.tsx`
- `practices/demo/src/components/Shelfs/shelves/DimensionShelf.tsx`
- `practices/demo/src/components/Shelfs/utils/menuItemUtils.tsx`
- `practices/demo/src/components/Shelfs/common/FilterShelf.tsx`
- `practices/demo/src/components/Filter/FilterPanel.tsx`
- `practices/demo/src/components/Filter/DateFilterEditor.tsx`
- Ant Design Dropdown / Popover / Tabs: https://ant.design/llms-full.txt

## 淘汰内容概述

本方案明确不采用以下做法：

- 不继续保留 `Shelfs` 目录作为兼容别名
- 不再使用负向 `popupOffset` 把二级菜单拉回一级菜单上方
- 不通过 submenu 容器左右 padding 营造留白
- 不为日期 `range / relative / current / period` 各自创建独立 overlay
- 不为了 demo 交互问题去修改 `@visactor/vbi` 的 DSL 结构
