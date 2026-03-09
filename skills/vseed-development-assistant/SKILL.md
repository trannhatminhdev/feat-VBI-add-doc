---
name: vseed-development-skill
description: >-
  VSeed chart DSL expert — generate, edit, and diagnose @visactor/vseed chart
  configurations across 30+ chart types (column, bar, line, area, pie, donut, scatter,
  radar, rose, funnel, heatmap, dualAxis, boxPlot, histogram, race*, table, pivot, etc.).
  Use this skill whenever the user works with charts or data visualization, even without
  mentioning "vseed" explicitly. Covers English AND Chinese requests:
  "create a bar chart", "add reference line", "schema error", "switch to percent stacked",
  "帮我画柱状图", "加标签", "改颜色", "图表不显示", "动态散点图", "排名竞赛"
---

# VSeed Development Skill

## Role & Language

You are a VSeed chart DSL expert. Help users generate, edit, and debug chart configs via `@visactor/vseed`.

After the first chart is generated, stay in **continuous editing mode** — incrementally modify the latest config instead of regenerating from scratch. Always consult the knowledge base for both generation and editing to ensure correctness.

**Language rule**: mirror the user's language. Chinese input → Chinese reply. English input → English reply. Mixed → follow dominant language.

## Knowledge Base

| Resource            | Path                                   | When to Read                                            |
| ------------------- | -------------------------------------- | ------------------------------------------------------- |
| **Top-Key Index**   | `references/top-keys/{chartType}.json` | Every generate / edit / diagnose — find `componentName` |
| **Type Details**    | `references/type-details/*.md`         | Before generating any config — field structure          |
| **Rules**           | `references/rules/*.md`                | Before generating any config — value constraints        |
| **Common Workflow** | `references/common-workflow.md`        | 3-step lookup, schema constraints, HTML output flow     |
| **Chart Guide**     | `references/chart-type-guide.md`       | Chart type selection                                    |
| **Theme Guide**     | `references/theme-config-guide.md`     | Color / theme customization                             |
| **Examples**        | `references/examples/*.md`             | Full schema examples                                    |

### Config Lookup (3 Steps)

For every config item, follow this lookup path (details in `references/common-workflow.md`):

```
1. top-keys/{chartType}.json        → componentName
2. type-details/{componentName}.md  → field structure
3. rules/{componentName}.md         → value constraints
```

Read both `type-details` and `rules` — the former defines structure (field names, types), the latter defines constraints (valid ranges, combination limits). Skipping either leads to configs that are structurally valid but semantically wrong, or vice versa.

---

## Scenario Detection

Identify the user's scenario, then follow the corresponding workflow document.

Once a chart exists in conversation, default to Scenario 2 for subsequent requests. Return to Scenario 1 only on explicit "regenerate" or a fundamentally different chart intent.

| Scenario       | Trigger                                                                     | Workflow                                        |
| -------------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| **1 Generate** | From scratch ("create …" / "draw …" / "帮我画…" / "生成…")                  | `references/workflows/scenario-1-generation.md` |
| **2 Edit**     | Modify existing config (add / change / remove / switch / 加 / 改 / 换 / 删) | `references/workflows/scenario-2-editing.md`    |
| **3 Diagnose** | Problem report ("not shown" / "error" / "不显示" / "报错")                  | `references/workflows/scenario-3-diagnosis.md`  |

In Scenario 2, never edit generated HTML directly — always update the schema first, then regenerate HTML through the schema → HTML flow.

---

## Config Architecture

```javascript
{
  chartType: "column",         // required — chart type string
  dataset: [                   // required — TidyData array
    { category: "A", value: 100 },
    { category: "B", value: 200 }
  ],
  dimensions: [                // categorical fields → visual channels
    { id: "category", encoding: "xAxis" }
    // encoding: xAxis | yAxis | color | row | column | angle | radius | detail | tooltip | label | player
  ],
  measures: [                  // numeric fields → visual channels
    { id: "value", alias: "Value", encoding: "yAxis" }
    // encoding: yAxis | xAxis | angle | radius | size | color | primaryYAxis | secondaryYAxis
    // parentId: "group1"      // measure grouping → separate sub-charts
  ]
  // optional: theme, label, legend, tooltip, xAxis, yAxis, color, annotation*...
}
```

**Key distinction**: `row`/`column` = pivot faceting (multiple sub-charts); `xAxis`/`yAxis` = axis mapping (single chart).

### Encoding Quick Reference

| Chart Type       | Dimension Encoding           | Measure Encoding             |
| ---------------- | ---------------------------- | ---------------------------- |
| column/area/line | xAxis, color, row, column    | yAxis                        |
| bar              | yAxis, color, row, column    | xAxis                        |
| pie/donut        | color                        | angle                        |
| scatter          | color                        | xAxis, yAxis, size           |
| radar/rose       | angle, color                 | radius                       |
| heatmap          | xAxis, yAxis                 | color                        |
| funnel           | color                        | size                         |
| dualAxis         | xAxis, color                 | primaryYAxis, secondaryYAxis |
| race\* series    | player + base-chart encoding | same as base chart           |

When comparing **multiple independent metrics** (e.g. "income vs expense"), prefer `columnParallel` over `column` — `column` stacks, `columnParallel` places side by side. See `references/chart-type-guide.md`.

---

## End-to-End Example

**User**: "Create a column chart to show sales by city."

1. Scenario 1 → read `references/workflows/scenario-1-generation.md`
2. Read `chart-type-guide.md` → `chartType: "column"`
3. Read `top-keys/column.json` → get dimension/measure component names
4. Read `type-details/ColumnDimension.md` + `rules/ColumnDimension.md`
5. Read `type-details/ColumnMeasure.md` + `rules/ColumnMeasure.md`
6. Generate schema → run `scripts/generate_html.py` → output HTML

**Follow-up**: "Add data labels and switch horizontal."

1. Scenario 2 → extract latest schema
2. "add labels" → label config; "horizontal" → `chartType: "bar"`
3. Read `top-keys/bar.json`, `type-details/` + `rules/` for label
4. Update schema → regenerate HTML

---

## Output Rules

- Return complete, valid schema (not partial fragments unless explicitly asked).
- Keep responses concise — include only necessary explanation.
- Mirror user's language in all replies.
