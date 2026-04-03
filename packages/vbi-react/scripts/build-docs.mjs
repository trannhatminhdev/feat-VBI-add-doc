import fs from 'node:fs'
import path from 'node:path'
import { repoDir, writeJson, writeText } from './shared.mjs'

const rootDir = path.resolve(repoDir, 'apps/website/docs/zh-CN/vbi-react')

function ensureIndex() {
  const indexPath = path.join(rootDir, 'index.md')
  if (fs.existsSync(indexPath)) {
    return
  }

  writeText(
    indexPath,
    `# VBI React

\`@visactor/vbi-react\` 提供基于 \`VBIChartBuilder\` 的 React Hooks 与组件封装。
`,
  )
}

function main() {
  fs.mkdirSync(rootDir, { recursive: true })
  ensureIndex()

  writeJson(path.join(rootDir, '_meta.json'), [
    'index',
    { type: 'dir', name: 'examples', label: '示例', collapsed: true },
    { type: 'dir', name: 'api', label: 'API', collapsed: true },
  ])

  console.log(`[build-docs] synced root metadata in ${rootDir}`)
}

main()
