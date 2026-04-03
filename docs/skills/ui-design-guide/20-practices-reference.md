# 20. UI 开发参考的 Practices

> 本文档记录开发 VBI UI 时参考了哪些 practices，以及每个 practice 提供哪些具体参考价值。

---

## 参考索引

### dashboard（本次新建）

- **位置**：`practices/dashboard/`
- **参考价值**：完整的全功能 BI Dashboard 实现，适合作为新 UI 的起点
- **涵盖内容**：
  - 三栏布局（Left FieldPanel + Middle ConfigPanel + Right Canvas）
  - 可拖拽调整面板宽度
  - 浅色/深色主题切换
  - 中英文国际化
  - ChartTypeSelector 下拉组件（带分组、搜索、`position: fixed` 浮动）
  - FieldPanel（维度/度量字段浏览，tab 切换，搜索）
  - FilterPanel（WHERE 过滤，支持 `in` 多值筛选）
  - HavingFilterPanel（HAVING 过滤，支持聚合函数）
  - ConfigPanel（维度/度量配置：别名、聚合函数、日期粒度）
  - VSeedRender（VChart / VTable / PivotChart / PivotTable）
  - CSV 文件上传（自动推断 schema）
  - Demo 数据自动加载
  - Undo/Redo
  - Stats Bar（图表类型、维度数量、度量数量、行数限制）

---

### professional

- **位置**：`practices/professional/`
- **参考价值**：最完整、最可靠的参考实现，所有 API 使用方式都经过验证
- **涵盖内容**：
  - 完整的 hooks 实现（所有 hooks 的标准签名）
  - `useVBISchemaFields` 返回 `fieldRoleMap` 和 `fieldTypeMap`
  - `useVBIWhereFilter` 的 `replaceFilters` 方法
  - `useVBIHavingFilter` 的 `replaceFilters` 方法
  - `useVBIBuilder` 返回 `theme`、`setTheme`、`limit`、`setLimit`
  - `useVBIChartType` 返回 `availableChartTypes`
  - VSeedRender 错误处理（移除最后一个坏的 WHERE 过滤）
  - Antd 组件使用（ConfigProvider、Dropdown、Spin 等）
  - `setLocalDataWithSchema` 加载 demo 数据
  - **LocalConnector 的 measure 类型规范化逻辑**（`localConnector.ts` 中的 `normalizedDataset` 处理）
  - **CSV 解析和 schema 推断**（`parseCsv` + `supermarketSchema`）

---

### streamlined

- **位置**：`practices/streamlined/`
- **参考价值**：Connector 注册和 VSeedRender 的最简实现；数据流清晰
- **涵盖内容**：
  - `demoConnector.ts` 的标准结构（`registerDemoConnector` + `defaultBuilder` 导出）
  - `VBIStore` 的最简实现（无 `setDsl`，直接监听 `builder.buildVSeed()`）
  - `useVBI.ts` hook 的简洁模式（直接返回 `vseed`）
  - **VQuery + CSV URL 直接创建数据集**（`type: 'csv', rawDataset: url` 方式）
  - `bindEvent` 中的错误处理和自动移除坏的过滤条件
  - `window.dispatchEvent('vbi-filter-error')` 用于 UI 层同步 filter 状态

---

### standard

- **位置**：`practices/standard/`
- **参考价值**：标准的完整实现，是 docs/skills 中所有代码示例的来源
- **涵盖内容**：
  - 所有 hooks 的标准实现模式
  - VBIStore + VBIStoreProvider 完整模板
  - demoConnector 的标准模板
  - VSeedRender 的标准模板
  - 完整的目录结构

---

## 按 API 分组的参考来源

| API / 功能                      | 主要参考       | 备选参考       |
| ------------------------------- | -------------- | -------------- |
| demoConnector 模板              | `streamlined`  | `standard`     |
| localConnector + 类型规范化     | `professional` | -              |
| VBIStore                        | `professional` | `streamlined`  |
| VBIStoreProvider                | `standard`     | -              |
| 所有 hooks 签名                 | `professional` | `standard`     |
| VSeedRender                     | `professional` | `standard`     |
| WHERE 过滤                      | `professional` | `streamlined`  |
| HAVING 过滤                     | `professional` | -              |
| ChartTypeSelector               | `dashboard`    | -              |
| FieldPanel                      | `dashboard`    | -              |
| FilterPanel / HavingFilterPanel | `dashboard`    | `professional` |
| ConfigPanel                     | `dashboard`    | -              |
| 主题切换                        | `professional` | `dashboard`    |
| i18n 国际化                     | `dashboard`    | -              |
| CSV 上传 + schema 推断          | `professional` | -              |
| Undo/Redo                       | `professional` | `standard`     |
| 可拖拽面板                      | `dashboard`    | -              |

---

## 使用建议

### 新建 VBI UI 时

1. 以 `dashboard` 为视觉参考起点（完整布局、主题、i18n）
2. 以 `professional` 为逻辑参考起点（所有 hooks 的正确用法）
3. 以 `streamlined` 为 Connector 参考（简洁的注册模式）
4. 以 `standard` 为代码模板参考（完整的目录结构）

### 不要参考的旧模式

- `minimalist` practice：过度简化，缺少实际功能
- 直接使用 `@visactor/vbi-react` hooks：与 practice 自带 hooks 签名不同，容易混淆

### 关键原则

- **每个 practice 必须独立实现所有模块**，不能跨 practice 引用
- Connector、数据集注册在 `demoConnector.ts` 中完成
- VSeedRender 必须自己实现，不能复用其他 practice 的
- Hooks 必须使用 practice 自己的版本（`src/hooks/`），不要用 `@visactor/vbi-react` 的
