import fs from 'node:fs'
import path from 'node:path'
import { repoDir, pkgDir, readText, ensureCleanDir, writeText, writeJson } from './shared.mjs'

const sourceDir = path.resolve(pkgDir, 'docs/examples-source')
const manifestPath = path.join(sourceDir, 'manifest.json')
const outputDir = path.resolve(repoDir, 'apps/website/docs/zh-CN/vbi-react/examples')

function buildIndexPage(items) {
  const links = items.map((item) => `- [${item.label}](./${item.slug})`).join('\n')
  return `# 示例总览

以下示例都可以直接复制到 \`.tsx\` 文件运行。

${links}
`
}

function main() {
  const manifest = JSON.parse(readText(manifestPath))
  ensureCleanDir(outputDir)

  manifest.forEach((item) => {
    const sourceFile = path.join(sourceDir, `${item.slug}.md`)
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`[build-examples] missing source file: ${sourceFile}`)
    }
    writeText(path.join(outputDir, `${item.slug}.md`), readText(sourceFile))
  })

  writeText(path.join(outputDir, 'index.md'), buildIndexPage(manifest))
  writeJson(path.join(outputDir, '_meta.json'), [
    { type: 'file', name: 'index', label: '总览' },
    ...manifest.map((item) => ({ type: 'file', name: item.slug, label: item.label })),
  ])

  console.log(`[build-examples] generated ${manifest.length} example pages in ${outputDir}`)
}

main()
