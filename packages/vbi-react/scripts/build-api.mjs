import path from 'node:path'
import { collectPublicExports } from './collect-exports.mjs'
import { buildApiOverview, buildApiMeta, buildApiPage } from './api-render.mjs'
import { repoDir, ensureCleanDir, writeText, writeJson } from './shared.mjs'

const outputDir = path.resolve(repoDir, 'apps/website/docs/zh-CN/vbi-react/api')

function main() {
  const { hooks, components, all } = collectPublicExports()
  ensureCleanDir(outputDir)

  writeText(path.join(outputDir, 'index.md'), buildApiOverview(hooks, components))
  writeJson(path.join(outputDir, '_meta.json'), buildApiMeta(hooks, components))

  all.forEach((item) => {
    writeText(path.join(outputDir, `${item.slug}.md`), buildApiPage(item))
  })

  console.log(`[build-api] generated ${all.length} api pages in ${outputDir}`)
}

main()
