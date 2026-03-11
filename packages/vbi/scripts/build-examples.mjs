/**
 * Build docs from JSON files
 * Generates MDX documentation for website with preview
 * Organizes examples by directory (chartType/, theme/, etc.)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============ Constants ============
const EXAMPLES_DIR = path.resolve(__dirname, '../tests/examples')
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/examples')
const DEFAULT_LOCALE = 'zh-CN'

const TAG_COLORS = {
  基础: 'blue',
  进阶: 'purple',
  高级: 'red',
  新增: 'green',
  实验性: 'orange',
  basic: 'blue',
  advanced: 'purple',
  pro: 'red',
  new: 'green',
  experimental: 'orange',
}

const DEFAULT_DSL = {
  chartType: 'line',
  dimensions: [],
  measures: [],
  whereFilters: [],
  havingFilters: [],
  theme: 'light',
  locale: DEFAULT_LOCALE,
  version: 1,
}

// ============ Utils ============
function parseDescription(json, locale = DEFAULT_LOCALE) {
  const desc = json.description || json.name || ''
  const match = desc.match(new RegExp(`\\{${locale}\\}([^]*?)\\{/${locale}\\}`, 'i'))
  return match ? match[1].trim() : desc.replace(/\{[^}]+\}/g, '').trim() || desc
}

function parseTags(json) {
  return json.tags || []
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function findSubDirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
}

function findJsonFilesInDir(dir) {
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isFile() && item.name.endsWith('.json'))
    .map((item) => path.join(dir, item.name))

  return files.sort((a, b) => {
    const jsonA = readJsonFile(a)
    const jsonB = readJsonFile(b)
    const [pa, pb] = [jsonA.priority ?? 5, jsonB.priority ?? 5]
    return pa !== pb ? pa - pb : (jsonA.name || a).localeCompare(jsonB.name || b)
  })
}

// ============ Code Generation ============
function generateDSLConfig(dsl) {
  return {
    ...DEFAULT_DSL,
    whereFilters: dsl.whereFilters || dsl.filters || [],
    ...dsl,
  }
}

function generateExamplePreview(json) {
  const dsl = generateDSLConfig(json.dsl || {})

  const code = `
import { VBI } from '@visactor/vbi'
import { DEMO_CONNECTOR_ID, VSeedRender } from '@components'
import { useEffect, useState } from 'react'

export default () => {
  const [vseed, setVSeed] = useState(null)

  useEffect(() => {
    const run = async () => {
      const builder = VBI.from({
        connectorId: DEMO_CONNECTOR_ID,
        chartType: ${JSON.stringify(dsl.chartType)},
        dimensions: ${JSON.stringify(dsl.dimensions)},
        measures: ${JSON.stringify(dsl.measures)},
        whereFilters: ${JSON.stringify(dsl.whereFilters)},
        havingFilters: ${JSON.stringify(dsl.havingFilters)},
        theme: ${JSON.stringify(dsl.theme)},
        locale: ${JSON.stringify(dsl.locale)},
        version: ${dsl.version}${dsl.limit !== undefined ? `,\n        limit: ${dsl.limit}` : ''}${dsl.orderBy ? `,\n        orderBy: ${JSON.stringify(dsl.orderBy)}` : ''}
      })

      ${json.code}
      applyBuilder(builder)

      const result = await builder.buildVSeed()
      setVSeed(result)
    }
    run()
  }, [])

  if (!vseed) return <div>Loading...</div>

  return <VSeedRender vseed={vseed} />
}`

  return code.trim()
}

function generateTagsHtml(tags) {
  if (!tags?.length) return ''
  const badges = tags.map((tag) => `<Badge type="${TAG_COLORS[tag] || 'default'}">${tag}</Badge>`).join(' ')
  return `\n\n<Tip>${badges}</Tip>\n`
}

// ============ Page Generation ============
function generateDirDocs(dirName, locale = DEFAULT_LOCALE) {
  const dirPath = path.join(EXAMPLES_DIR, dirName)
  const jsonFiles = findJsonFilesInDir(dirPath)
  if (!jsonFiles.length) return ''

  let md = `# ${dirName}\n\n`
  // Add connector registration once at the top of each MDX file
  md += `import { registerDemoConnector } from '@components'\n\n`
  md += `{registerDemoConnector()}\n\n`

  for (const file of jsonFiles) {
    const json = readJsonFile(file)
    md += `## ${json.name || path.basename(file, '.json')}\n\n`
    md += `${parseDescription(json, locale)}\n`
    md += `${generateTagsHtml(parseTags(json))}\n\n`
    md += '```tsx preview\n'
    md += `${generateExamplePreview(json)}\n`
    md += '```\n\n'
  }

  return md
}

function generateIndexPage(subDirs, locale = DEFAULT_LOCALE) {
  let md = '# VBI 示例\n\n本页面展示 VBI 的各种使用示例。\n\n'

  for (const dir of subDirs) {
    const jsonFiles = findJsonFilesInDir(path.join(EXAMPLES_DIR, dir))
    if (!jsonFiles.length) continue

    const examples = jsonFiles.map((file) => {
      const json = readJsonFile(file)
      return {
        name: json.name || path.basename(file, '.json'),
        description: parseDescription(json, locale),
        tags: parseTags(json),
      }
    })

    md += `## ${dir}\n\n| 示例 | 描述 | 标签 |\n| --- | --- | --- |\n`
    md += examples
      .map((ex) => `| [${ex.name}](./${dir}#${ex.name}) | ${ex.description} | ${ex.tags.join(', ') || '-'} |`)
      .join('\n')
    md += '\n\n'
  }

  return md
}

function generateStats(subDirs) {
  const stats = { total: 0, byCategory: {}, byTag: {} }

  for (const dir of subDirs) {
    const jsonFiles = findJsonFilesInDir(path.join(EXAMPLES_DIR, dir))
    stats.byCategory[dir] = jsonFiles.length
    stats.total += jsonFiles.length

    for (const file of jsonFiles) {
      for (const tag of parseTags(readJsonFile(file))) {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1
      }
    }
  }

  return stats
}

function generateTagsPage(subDirs) {
  const stats = generateStats(subDirs)
  const tagEntries = Object.entries(stats.byTag).sort((a, b) => b[1] - a[1])

  let md = `# 标签\n\n共 ${stats.total} 个示例，${tagEntries.length} 个标签。\n\n`
  md += '| 标签 | 数量 |\n| --- | --- |\n'
  md += tagEntries.map(([tag, count]) => `| ${tag} | ${count} |`).join('\n')

  return md
}

// ============ Main ============
function generateDocs() {
  console.log('Building docs from JSON files...')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const subDirs = findSubDirs(EXAMPLES_DIR)
  const stats = generateStats(subDirs)
  console.log(`Found ${stats.total} examples in ${subDirs.length} categories`)

  // _meta.json
  const meta = subDirs.map((dir) => ({
    type: 'file',
    name: dir,
    label: dir.charAt(0).toUpperCase() + dir.slice(1).replace(/-/g, ' '),
    count: stats.byCategory[dir],
  }))
  fs.writeFileSync(path.join(OUTPUT_DIR, '_meta.json'), JSON.stringify(meta, null, 2))
  console.log('Generated: _meta.json')

  // index.mdx
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.mdx'), generateIndexPage(subDirs))
  console.log('Generated: index.mdx')

  // tags.mdx
  fs.writeFileSync(path.join(OUTPUT_DIR, 'tags.mdx'), generateTagsPage(subDirs))
  console.log('Generated: tags.mdx')

  // category pages
  let totalExamples = 0
  for (const dir of subDirs) {
    const md = generateDirDocs(dir)
    if (md) {
      fs.writeFileSync(path.join(OUTPUT_DIR, `${dir}.mdx`), md)
      console.log(`Generated: ${dir}.mdx`)
      totalExamples += findJsonFilesInDir(path.join(EXAMPLES_DIR, dir)).length
    }
  }

  console.log(`\n✅ Successfully generated docs for ${totalExamples} examples in ${subDirs.length} categories`)
}

generateDocs()
