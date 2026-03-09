/**
 * Build docs from JSON files
 * Generates MDX documentation for website with preview
 * Organizes examples by directory (chartType/, theme/, etc.)
 *
 * JSON Schema Support:
 * - name: 示例名称
 * - description: 示例描述（支持 {zh-CN} 和 {en-US} 多语言）
 * - tags: 标签数组
 * - category: 分类
 * - priority: 优先级 (1-10)
 * - schema: 数据schema
 * - dsl: VBI DSL配置
 *   - chartType, dimensions, measures, filters, whereFilters
 *   - havingFilters, limit, orderBy, theme, locale
 * - code: applyBuilder 函数代码
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXAMPLES_DIR = path.resolve(__dirname, '../tests/examples')
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/examples')

/**
 * Parse multi-language description
 * Supports: {zh-CN}中文{/zh-CN} {en-US}English{/en-US}
 */
function parseDescription(json, locale = 'zh-CN') {
  const desc = json.description || json.name || ''

  // Match {locale}content{/locale} pattern
  const localePattern = new RegExp(`\\{${locale}\\}([^]*?)\\{/${locale}\\}`, 'i')
  const match = desc.match(localePattern)

  if (match) {
    return match[1].trim()
  }

  // Fallback: return raw description
  return desc.replace(/\{[^}]+\}/g, '').trim() || desc
}

/**
 * Extract tags from JSON
 */
function parseTags(json) {
  return json.tags || []
}

/**
 * Find all subdirectories in examples
 */
function findSubDirs(dir) {
  const subDirs = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    if (item.isDirectory()) {
      subDirs.push(item.name)
    }
  }

  return subDirs
}

/**
 * Find JSON files in a specific directory
 */
function findJsonFilesInDir(dir) {
  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isFile() && item.name.endsWith('.json')) {
      files.push(fullPath)
    }
  }

  // Sort by priority (lower = higher priority) then by name
  files.sort((a, b) => {
    const jsonA = JSON.parse(fs.readFileSync(a, 'utf-8'))
    const jsonB = JSON.parse(fs.readFileSync(b, 'utf-8'))
    const priorityA = jsonA.priority ?? 5
    const priorityB = jsonB.priority ?? 5
    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }
    return (jsonA.name || a).localeCompare(jsonB.name || b)
  })

  return files
}

/**
 * Generate mock data from schema
 */
function generateMockData(schema) {
  const lines = []
  const dataCount = 5

  for (let i = 0; i < dataCount; i++) {
    const row = schema
      .map((field) => {
        if (field.type === 'string') {
          const values = field.example ? [field.example] : [`${field.name}${i}`]
          return `${field.name}: '${values[i % values.length]}'`
        } else if (field.type === 'number') {
          const value = field.example ?? (i + 1) * 100
          return `${field.name}: ${value}`
        } else if (field.type === 'boolean') {
          return `${field.name}: ${i % 2 === 0}`
        }
        return `${field.name}: null`
      })
      .join(', ')
    lines.push(`      { ${row} },`)
  }

  return lines.join('\n')
}

/**
 * Generate DSL config for preview
 */
function generateDSLConfig(dsl) {
  const config = {
    chartType: dsl.chartType || 'line',
    dimensions: dsl.dimensions || [],
    measures: dsl.measures || [],
    // Support both filters and whereFilters
    whereFilters: dsl.whereFilters || dsl.filters || [],
    havingFilters: dsl.havingFilters || [],
    theme: dsl.theme || 'light',
    locale: dsl.locale || 'zh-CN',
    version: dsl.version ?? 1,
  }

  // Add optional fields if present
  if (dsl.limit !== undefined) {
    config.limit = dsl.limit
  }
  if (dsl.orderBy) {
    config.orderBy = dsl.orderBy
  }

  return config
}

/**
 * Generate single example preview code
 */
function generateExamplePreview(json) {
  const mockData = generateMockData(json.schema || [])
  const dslConfig = generateDSLConfig(json.dsl || {})

  let code = ''
  code += "import { VBI } from '@visactor/vbi'\n"
  code += "import { VSeedRender } from '@components'\n"
  code += "import { useEffect, useState } from 'react'\n\n"
  code += 'export default () => {\n'
  code += '  const [vseed, setVSeed] = useState(null)\n\n'
  code += '  useEffect(() => {\n'
  code += '    const run = async () => {\n'
  code += '      const schema = [\n'
  for (const field of json.schema || []) {
    code += `        { name: '${field.name}', type: '${field.type}' },\n`
  }
  code += '      ]\n'
  code += '      const dataset = [\n'
  code += mockData + '\n'
  code += '      ]\n\n'
  code += "      VBI.registerConnector('demo', async () => ({\n"
  code += '        discoverSchema: async () => schema,\n'
  code += '        query: async () => ({ dataset })\n'
  code += '      }))\n\n'
  code += '      const builder = VBI.from({\n'
  code += "        connectorId: 'demo',\n"
  code += `        chartType: ${JSON.stringify(dslConfig.chartType)},\n`
  code += `        dimensions: ${JSON.stringify(dslConfig.dimensions)},\n`
  code += `        measures: ${JSON.stringify(dslConfig.measures)},\n`
  code += `        whereFilters: ${JSON.stringify(dslConfig.whereFilters)},\n`
  code += `        havingFilters: ${JSON.stringify(dslConfig.havingFilters)},\n`
  code += `        theme: ${JSON.stringify(dslConfig.theme)},\n`
  code += `        locale: ${JSON.stringify(dslConfig.locale)},\n`
  code += `        version: ${dslConfig.version}\n`

  // Add optional fields
  if (dslConfig.limit !== undefined) {
    code += `        , limit: ${dslConfig.limit}`
  }
  if (dslConfig.orderBy) {
    code += `, orderBy: ${JSON.stringify(dslConfig.orderBy)}`
  }

  code += '\n      })\n\n'
  code += `      ${json.code}\n`
  code += '      applyBuilder(builder)\n\n'
  code += '      const result = await builder.buildVSeed()\n'
  code += '      setVSeed(result)\n'
  code += '    }\n'
  code += '    run()\n'
  code += '  }, [])\n\n'
  code += '  if (!vseed) return <div>Loading...</div>\n\n'
  code += '  return <VSeedRender vseed={vseed} />\n'
  code += '}\n'

  return code
}

/**
 * Generate tags badge HTML
 */
function generateTagsHtml(tags) {
  if (!tags || tags.length === 0) return ''

  const tagColors = {
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

  const badges = tags
    .map((tag) => {
      const color = tagColors[tag] || 'default'
      return `<Badge type="${color}">${tag}</Badge>`
    })
    .join(' ')

  return `\n\n<Tip>${badges}</Tip>\n`
}

/**
 * Generate docs for a directory
 */
function generateDirDocs(dirName, locale = 'zh-CN') {
  const dirPath = path.join(EXAMPLES_DIR, dirName)
  const jsonFiles = findJsonFilesInDir(dirPath)

  if (jsonFiles.length === 0) return ''

  let md = `# ${dirName}\n\n`

  for (const file of jsonFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const json = JSON.parse(content)
    const name = json.name || path.basename(file, '.json')
    const description = parseDescription(json, locale)
    const tags = parseTags(json)

    md += `## ${name}\n\n`
    md += `${description}\n`

    // Add tags if present
    if (tags.length > 0) {
      md += generateTagsHtml(tags)
    }

    md += '\n\n```tsx preview\n'
    md += generateExamplePreview(json)
    md += '```\n\n'
  }

  return md
}

/**
 * Generate index page with all examples
 */
function generateIndexPage(subDirs, locale = 'zh-CN') {
  let md = '# VBI 示例\n\n'
  md += '本页面展示 VBI 的各种使用示例。\n\n'

  // Group by category
  for (const dir of subDirs) {
    const dirPath = path.join(EXAMPLES_DIR, dir)
    const jsonFiles = findJsonFilesInDir(dirPath)

    if (jsonFiles.length === 0) continue

    const examples = jsonFiles.map((file) => {
      const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
      return {
        name: json.name || path.basename(file, '.json'),
        description: parseDescription(json, locale),
        tags: parseTags(json),
      }
    })

    md += `## ${dir}\n\n`
    md += '| 示例 | 描述 | 标签 |\n'
    md += '| --- | --- | --- |\n'

    for (const ex of examples) {
      const tagsStr = ex.tags.join(', ') || '-'
      md += `| [${ex.name}](./${dir}#${ex.name}) | ${ex.description} | ${tagsStr} |\n`
    }

    md += '\n'
  }

  return md
}

/**
 * Collect all tags from examples
 */
function collectAllTags(subDirs) {
  const tagSet = new Set()

  for (const dir of subDirs) {
    const dirPath = path.join(EXAMPLES_DIR, dir)
    const jsonFiles = findJsonFilesInDir(dirPath)

    for (const file of jsonFiles) {
      const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
      const tags = parseTags(json)
      tags.forEach((tag) => tagSet.add(tag))
    }
  }

  return Array.from(tagSet).sort()
}

/**
 * Generate statistics for examples
 */
function generateStats(subDirs) {
  const stats = {
    total: 0,
    byCategory: {},
    byTag: {},
  }

  for (const dir of subDirs) {
    const dirPath = path.join(EXAMPLES_DIR, dir)
    const jsonFiles = findJsonFilesInDir(dirPath)

    stats.byCategory[dir] = jsonFiles.length
    stats.total += jsonFiles.length

    for (const file of jsonFiles) {
      const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
      const tags = parseTags(json)

      for (const tag of tags) {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1
      }
    }
  }

  return stats
}

/**
 * Generate all tags page
 */
function generateTagsPage(subDirs) {
  const tags = collectAllTags(subDirs)
  const stats = generateStats(subDirs)

  let md = '# 标签\n\n'
  md += `共 ${stats.total} 个示例，${tags.length} 个标签。\n\n`

  // Group tags by count
  const tagEntries = Object.entries(stats.byTag).sort((a, b) => b[1] - a[1])

  md += '| 标签 | 数量 |\n'
  md += '| --- | --- |\n'

  for (const [tag, count] of tagEntries) {
    md += `| ${tag} | ${count} |\n`
  }

  return md
}

/**
 * Generate docs with enhanced features
 */
function generateDocs() {
  console.log('Building docs from JSON files...')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const subDirs = findSubDirs(EXAMPLES_DIR)
  const stats = generateStats(subDirs)

  console.log(`Found ${stats.total} examples in ${subDirs.length} categories`)

  const meta = []

  for (const dir of subDirs) {
    const label = dir.charAt(0).toUpperCase() + dir.slice(1).replace(/-/g, ' ')
    const count = stats.byCategory[dir] || 0
    meta.push({ type: 'file', name: dir, label, count })
  }

  // Write _meta.json with counts
  fs.writeFileSync(path.join(OUTPUT_DIR, '_meta.json'), JSON.stringify(meta, null, 2), 'utf-8')
  console.log('Generated: _meta.json')

  // Generate index page
  const indexMd = generateIndexPage(subDirs)
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.mdx'), indexMd, 'utf-8')
  console.log('Generated: index.mdx')

  // Generate tags page
  const tagsMd = generateTagsPage(subDirs)
  fs.writeFileSync(path.join(OUTPUT_DIR, 'tags.mdx'), tagsMd, 'utf-8')
  console.log('Generated: tags.mdx')

  // Generate each category page
  let totalExamples = 0
  for (const dir of subDirs) {
    const md = generateDirDocs(dir)
    if (md) {
      const outputPath = path.join(OUTPUT_DIR, `${dir}.mdx`)
      fs.writeFileSync(outputPath, md, 'utf-8')
      console.log(`Generated: ${dir}.mdx`)

      const jsonFiles = findJsonFilesInDir(path.join(EXAMPLES_DIR, dir))
      totalExamples += jsonFiles.length
    }
  }

  console.log(`\n✅ Successfully generated docs for ${totalExamples} examples in ${subDirs.length} categories`)
}

generateDocs()
