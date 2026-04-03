const descriptions = {
  useVBI: '订阅 builder 的 DSL 快照变化，返回最新 `dsl` 与原始 `builder`。',
  useVSeed: '执行查询与 VSeed 生成流程，返回渲染所需状态与数据。',
  useChartType: '读取并更新当前图表类型，同时暴露可选图表类型列表。',
  useDimensions: '读取并更新维度配置，提供维度增删改能力。',
  useMeasures: '读取并更新度量配置，提供度量增删改能力。',
  useWhereFilter: '管理 Where 过滤树，并提供 mutation 入口。',
  useHavingFilter: '管理 Having 过滤树，并提供 mutation 入口。',
  BuilderLayout: '提供标准化三栏/双栏构建器布局容器。',
  ChartRenderer: '根据 builder 输出渲染图表，并处理加载与错误状态。',
  ChartTypeSelector: '提供图表类型下拉选择器。',
  FieldPanel: '提供维度/度量字段面板与基础编辑交互。',
}

const exampleOverrides = {
  useVSeed: `import type { VBIChartBuilder } from '@visactor/vbi'
import { useVSeed } from '@visactor/vbi-react'

export function Demo({ builder }: { builder: VBIChartBuilder }) {
  const { vseed, loading } = useVSeed(builder, { debounce: 100 })
  if (loading || !vseed) {
    return <div>Loading...</div>
  }
  return <pre>{JSON.stringify(vseed, null, 2)}</pre>
}`,
  BuilderLayout: `import { BuilderLayout } from '@visactor/vbi-react/components'

export function Demo() {
  return <BuilderLayout main={<div>Main Content</div>} />
}`,
}

function buildImportCode(item) {
  return `import { ${item.name} } from '${item.importPath}'`
}

function buildExampleCode(item) {
  const override = exampleOverrides[item.name]
  if (override) return override
  if (item.group === 'hooks') {
    return `import type { VBIChartBuilder } from '@visactor/vbi'
${buildImportCode(item)}

export function Demo({ builder }: { builder: VBIChartBuilder }) {
  const result = ${item.name}(builder)
  return <pre>{JSON.stringify(result, null, 2)}</pre>
}`
  }
  return `import type { VBIChartBuilder } from '@visactor/vbi'
${buildImportCode(item)}

export function Demo({ builder }: { builder: VBIChartBuilder }) {
  return <${item.name} builder={builder} />
}`
}

export function buildApiPage(item) {
  const description = descriptions[item.name] ?? '该能力由脚本根据公开导出自动生成，请结合源码使用。'
  return `# ${item.name}

## 导入

\`\`\`ts
${buildImportCode(item)}
\`\`\`

## 签名

\`\`\`ts
${item.signature}
\`\`\`

## 说明

${description}

## 最小示例

\`\`\`tsx
${buildExampleCode(item)}
\`\`\`
`
}

export function buildApiOverview(hooks, components) {
  const hookNames = hooks.map((item) => `\`${item.name}\``).join('、')
  const componentNames = components.map((item) => `\`${item.name}\``).join('、')
  return `# API 总览

\`@visactor/vbi-react\` 当前导出分为两部分：

| 模块 | 导入路径 | 内容 |
| --- | --- | --- |
| Hooks | \`@visactor/vbi-react\` | ${hookNames} |
| Components | \`@visactor/vbi-react/components\` | ${componentNames} |

所有 hooks/components 都围绕 \`VBIChartBuilder\` 工作，不额外维护业务状态源。
`
}

export function buildApiMeta(hooks, components) {
  return [
    { type: 'file', name: 'index', label: '总览' },
    ...hooks.map((item) => ({ type: 'file', name: item.slug, label: item.name })),
    ...components.map((item) => ({ type: 'file', name: item.slug, label: item.name })),
  ]
}
