# 新增图表类型

本指南将指导你如何从零开始在 VSeed 中实现一个 `raceBar`（动态条形图）图表类型。

`raceBar` 是一种特殊的条形图，它引入了时间维度（通过 `player` 播放器控制），展示数据随时间变化的排名情况。

## 1. 核心概念

与普通 `bar` 图表相比，`raceBar` 的核心区别在于：
- **数据处理**：需要处理时间切片数据。
- **坐标轴**：X轴/Y轴的域（Domain）需要随时间动态变化。
- **动画**：需要平滑的过渡动画来展示排名的变化。

在 VSeed 中，我们通过**Pipeline（管道）**机制来实现这些差异，并复用大部分基础逻辑。

## 2. 实现步骤

### 2.1 定义图表类型 (Type Definition)

首先，我们需要定义 `raceBar` 的数据结构和校验规则。

**文件位置**: `packages/vseed/src/types/chartType/raceBar/`

1.  **接口定义 (`raceBar.ts`)**:
    继承基础属性，但必须强制包含 `player` 和 `sort` 属性。
    ```typescript
    export interface RaceBar {
      chartType: 'raceBar'
      // ...
      player?: Player // 核心：播放器配置
      sort?: Sort     // 核心：动态排序
    }
    ```

2.  **校验 Schema (`zRaceBar.ts`)**:
    使用 Zod 定义运行时校验逻辑。

3.  **注册类型**:
    在 `packages/vseed/src/types/chartType/index.ts` 中导出。

4.  **全局类型更新 (VSeed & zVSeed)**:
    **重要**：不要忘记在全局类型定义中引入新类型。
    - `packages/vseed/src/types/vseed.ts`: 将 `RaceBar` 添加到 `VSeed` 联合类型中。
44→    - `packages/vseed/src/types/zVseed.ts`: 将 `zRaceBar` 添加到 `zVSeed` 联合 Schema 中。
45→
46→5.  **Config Schema 定义 (`types/properties/config/`)**:
47→    **重要**：还需要定义图表的配置 Schema，并在全局 Config 中注册。
48→    - 创建 `packages/vseed/src/types/properties/config/race.ts`，导出 `zRaceBarConfig`。
49→    - 更新 `packages/vseed/src/types/properties/config/config.ts`，将 `raceBar: zRaceBarConfig.nullish()` 添加到 `zConfig` 中。
50→
51→### 2.2 实现构建管线 (Pipeline)

这是实现逻辑的核心。我们需要创建两条管线：Spec Pipeline 和 Advanced Pipeline。

**文件位置**: `packages/vseed/src/pipeline/`

1.  **Spec Pipeline (`spec/chart/pipeline/raceBar.ts`)**:
    这里定义了如何将 VSeed Spec 转换为 VChart Spec。
    **关键点**：使用 `player` 相关的 Pipe 替换静态 Pipe。
    - 使用 `playerYX` 替代 `datasetYX`：处理带时间维度的数据。
    - 使用 `playerXLinear` / `playerYBand`：处理动态坐标轴。

    ```typescript
    const raceBar: VChartSpecPipeline = [
      initBar,
      playerYX,      // <--- 动态数据处理
      progressive,
      playerXLinear, // <--- 动态X轴
      playerYBand,   // <--- 动态Y轴
      // ... 其他通用 Pipe (color, tooltip, etc.)
    ]
    ```

2.  **Advanced Pipeline (`advanced/chart/pipeline/raceBar.ts`)**:
    处理高级配置（如智能推荐）。通常可以直接复用 `bar` 的逻辑，但需要确保类型判断函数能识别 `raceBar`。

3.  **工具函数更新**:
    不要忘记更新 `packages/vseed/src/pipeline/utils/constant.ts` (ChartTypeEnum) 和 `chatType.ts`，确保系统知道 `raceBar` 是一种“类柱状图”。

### 2.3 配置主题 (Theme)

为了让图表开箱即用，需要在默认主题中添加配置。

**文件位置**: `packages/vseed/src/theme/`

在 `light.ts` 和 `dark.ts` 中添加 `raceBar` 字段。务必包含 `player` 的默认配置，否则可能会导致运行时错误（如 "Cannot destructure property 'enable' of 'label'"）。

```typescript
raceBar: {
  ...baseConfig,
  xAxis: linearAxis,
  yAxis: barBandAxis,
  player, // <--- 必须包含
  // ...
}
```

### 2.4 注册图表 (Registration)

最后，将新图表注册到 Builder 中。

**文件位置**: `packages/vseed/src/builder/register/chartType/raceBar.ts`

```typescript
export const registerRaceBar = () => {
  Builder.registerAdvancedPipeline('raceBar', raceBarAdvancedPipeline)
  Builder.registerSpecPipeline('raceBar', raceBarSpecPipeline)
}
```

并在全局注册文件 `packages/vseed/src/builder/register/all.ts` 中调用它。

## 3. 验证与调试

完成上述步骤后，你可以通过以下方式验证：
1.  **类型检查**：运行 `tsc` 确保没有类型错误。
2.  **单元测试**：编写测试用例验证 Pipeline 的输出。
3.  **Demo**：在 `apps/website` 或测试工程中创建一个 `raceBar` 的示例，检查动画和播放功能是否正常。

## 4. 常见问题

-   **报错 "Cannot destructure property..."**：通常是因为 Theme 中缺少默认配置。
-   **图表不动画**：检查 `player` 配置中的 `interval` 字段，以及数据是否正确按照时间字段分组。
