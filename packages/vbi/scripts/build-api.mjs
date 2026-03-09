/**
 * Build API docs from builder classes
 * Generates MDX documentation for website
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUILDER_DIR = path.resolve(__dirname, '../src/builder')
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/api')

// Builder files to generate docs for
const BUILDERS = [
  // Main builder - goes to root of api/
  {
    name: 'VBIBuilder',
    file: 'vbi-builder.ts',
    description: 'VBI 主构建器，管理所有子构建器',
    category: 'main',
  },
  // Sub-builders - go to sub-builders/ directory
  {
    name: 'MeasuresBuilder',
    file: 'sub-builders/measures/measures-builder.ts',
    description: '度量构建器，用于添加、修改、删除度量配置',
    category: 'sub-builders',
  },
  {
    name: 'DimensionsBuilder',
    file: 'sub-builders/dimensions/dimensions-builder.ts',
    description: '维度构建器，用于添加、修改、删除维度配置',
    category: 'sub-builders',
  },
  {
    name: 'ChartTypeBuilder',
    file: 'sub-builders/chart-type/chart-type-builder.ts',
    description: '图表类型构建器，用于切换和获取图表类型',
    category: 'sub-builders',
  },
  {
    name: 'WhereFiltersBuilder',
    file: 'sub-builders/whereFilters/filters-builder.ts',
    description: 'Where 过滤构建器，用于添加、修改、删除行级过滤条件',
    category: 'sub-builders',
  },
  {
    name: 'HavingFiltersBuilder',
    file: 'sub-builders/havingFilters/having-builder.ts',
    description: 'Having 过滤构建器，用于添加、修改、删除分组后过滤条件',
    category: 'sub-builders',
  },
]

/**
 * Parse TypeScript file to extract class methods
 * Simplified parser for extracting public methods and JSDoc comments
 */
function parseClassMethods(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const methods = []

  // Match methods with JSDoc comments first
  const jsdocMethodRegex = /\/\*\*([\s\S]*?)\*\/[\s\n]*(?:public\s+)?(\w+)\s*\(([^)]*)\)\s*[:{]\s*([^{\n]+)?/g
  const jsdocMethods = new Map()

  let match
  while ((match = jsdocMethodRegex.exec(content)) !== null) {
    const jsdoc = match[1]
    const methodName = match[2]
    const params = match[3]
    const returnType = match[4] ? match[4].trim() : ''

    // Extract description from JSDoc
    const descMatch = jsdoc.match(/\* ([^\n]+)/)
    const description = descMatch ? descMatch[1].trim() : ''

    // Check for @deprecated
    const deprecated = jsdoc.includes('@deprecated')

    // Extract @param descriptions
    const paramMatches = jsdoc.matchAll(/@param\s+(?:\w+\s+)?(\w+)\s+([^\n]+)/g)
    const paramsDoc = {}
    for (const pm of paramMatches) {
      paramsDoc[pm[1]] = pm[2]
    }

    jsdocMethods.set(methodName, {
      name: methodName,
      params: params.trim(),
      returnType: returnType,
      description,
      deprecated,
      paramsDoc,
      hasJsdoc: true,
    })
  }

  // Now find methods without JSDoc - match both with and without return type
  // Match: methodName(params) { or methodName(params): returnType {
  const methodNoJsdocRegex = /(?:public\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*([^\n{]+?))?\s*\{/g

  while ((match = methodNoJsdocRegex.exec(content)) !== null) {
    const methodName = match[1]
    const params = match[2]
    const returnType = match[3] ? match[3].trim() : ''

    // Skip if already processed with JSDoc
    if (jsdocMethods.has(methodName)) {
      continue
    }

    // Skip keywords and special methods
    if (['if', 'else', 'for', 'while', 'return', 'throw', 'switch', 'constructor'].includes(methodName)) {
      continue
    }

    jsdocMethods.set(methodName, {
      name: methodName,
      params: params.trim(),
      returnType: returnType,
      description: '',
      deprecated: false,
      paramsDoc: {},
      hasJsdoc: false,
    })
  }

  // Convert to array
  for (const [, method] of jsdocMethods) {
    methods.push(method)
  }

  return methods
}

/**
 * Get properties for each builder (sub-builders access)
 */
function getBuilderProperties(builderName) {
  const properties = {
    VBIBuilder: [
      { name: 'chartType', type: 'ChartTypeBuilder', description: '图表类型构建器' },
      { name: 'measures', type: 'MeasuresBuilder', description: '度量构建器' },
      { name: 'dimensions', type: 'DimensionsBuilder', description: '维度构建器' },
      { name: 'whereFilters', type: 'WhereFiltersBuilder', description: 'Where 过滤构建器' },
      { name: 'havingFilters', type: 'HavingFiltersBuilder', description: 'Having 过滤构建器' },
      { name: 'encoding', type: 'EncodingBuilder', description: '编码构建器' },
      { name: 'dsl', type: 'Y.Map<any>', description: 'Yjs 文档映射' },
      { name: 'doc', type: 'Y.Doc', description: 'Yjs 文档实例' },
      { name: 'undoManager', type: 'Y.UndoManager', description: '撤销管理器' },
    ],
  }

  return properties[builderName] || []
}

/**
 * Generate API docs for a builder class
 */
function generateBuilderDocs(builder) {
  const filePath = path.join(BUILDER_DIR, builder.file)
  const methods = parseClassMethods(filePath)

  let md = `# ${builder.name}\n\n`
  md += `${builder.description}\n\n`

  // Constructor section
  md += `## 构造函数\n\n`
  md += `\`\`\`typescript\n`
  md += `new ${builder.name}(doc: Y.Doc)\n`
  md += `\`\`\`\n\n`

  // Properties section
  md += `## 属性\n\n`
  const builderInstances = getBuilderProperties(builder.name)
  if (builderInstances.length > 0) {
    for (const prop of builderInstances) {
      md += `- **${prop.name}**: ${prop.type} - ${prop.description}\n`
    }
    md += '\n'
  }

  // Methods section
  md += `## 方法\n\n`

  for (const method of methods) {
    if (method.deprecated) {
      md += `### ~~${method.name}~~\n\n`
      md += `> ⚠️ 已废弃\n\n`
    } else {
      md += `### ${method.name}\n\n`
    }

    if (method.description) {
      md += `${method.description}\n\n`
    }

    // Method signature
    md += `**签名**:\n\n`
    md += '```typescript\n'
    if (method.returnType) {
      md += `${method.name}(${method.params}): ${method.returnType}\n`
    } else {
      md += `${method.name}(${method.params})\n`
    }
    md += '```\n\n'

    // Parameters
    if (method.params) {
      md += `**参数**:\n\n`
      const params = method.params.split(',').filter((p) => p.trim())
      for (const param of params) {
        const [name, type] = param.trim().split(':').map((s) => s.trim())
        md += `- \`${name}\`${type ? `: ${type}` : ''}\n`
      }
      md += '\n'
    }

    // Return value
    if (method.returnType) {
      md += `**返回**: \`${method.returnType}\`\n\n`
    }
  }

  return md
}

/**
 * Generate main API index page
 */
function generateIndexPage() {
  let md = `# API 参考\n\n`
  md += `VBI 提供了多个构建器用于配置图表，每个构建器负责特定的功能领域。\n\n`
  md += `## 构建器概览\n\n`

  for (const builder of BUILDERS) {
    md += `### [${builder.name}](./api/${kebabCase(builder.name)})\n\n`
    md += `${builder.description}\n\n`
  }

  return md
}

/**
 * Convert camelCase to kebab-case
 */
function kebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Main function to generate all API docs
 */
function generateDocs() {
  console.log('Building API docs from builder classes...')

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // Create sub-builders directory
  const subBuildersDir = path.join(OUTPUT_DIR, 'sub-builders')
  if (!fs.existsSync(subBuildersDir)) {
    fs.mkdirSync(subBuildersDir, { recursive: true })
  }

  // Group builders by category
  const mainBuilders = BUILDERS.filter((b) => b.category === 'main')
  const subBuilders = BUILDERS.filter((b) => b.category === 'sub-builders')

  const mainMeta = []
  const subBuildersMeta = []

  // Generate main builder docs (VBIBuilder)
  for (const builder of mainBuilders) {
    const fileName = kebabCase(builder.name)
    const md = generateBuilderDocs(builder)
    const outputPath = path.join(OUTPUT_DIR, `${fileName}.md`)

    fs.writeFileSync(outputPath, md, 'utf-8')
    console.log(`Generated: ${fileName}.md`)

    mainMeta.push({
      type: 'file',
      name: fileName,
      label: builder.name,
    })
  }

  // Generate sub-builders docs
  for (const builder of subBuilders) {
    const fileName = kebabCase(builder.name)
    const md = generateBuilderDocs(builder)
    const outputPath = path.join(subBuildersDir, `${fileName}.md`)

    fs.writeFileSync(outputPath, md, 'utf-8')
    console.log(`Generated: sub-builders/${fileName}.md`)

    subBuildersMeta.push({
      type: 'file',
      name: fileName,
      label: builder.name,
    })
  }

  // Generate index page
  const indexMd = generateIndexPage()
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.md'), indexMd, 'utf-8')
  console.log('Generated: index.md')

  // Write main _meta.json
  fs.writeFileSync(path.join(OUTPUT_DIR, '_meta.json'), JSON.stringify(mainMeta, null, 2), 'utf-8')
  console.log('Generated: api/_meta.json')

  // Write sub-builders _meta.json
  fs.writeFileSync(
    path.join(subBuildersDir, '_meta.json'),
    JSON.stringify(subBuildersMeta, null, 2),
    'utf-8'
  )
  console.log('Generated: api/sub-builders/_meta.json')

  // Update parent _meta.json
  const parentMetaPath = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/_meta.json')
  const parentMeta = JSON.parse(fs.readFileSync(parentMetaPath, 'utf-8'))

  // Check if 'api' entry exists
  const hasApiEntry = parentMeta.some((item) => item.name === 'api')

  if (!hasApiEntry) {
    parentMeta.splice(2, 0, {
      type: 'dir',
      name: 'api',
      label: 'API',
    })
    fs.writeFileSync(parentMetaPath, JSON.stringify(parentMeta, null, 2), 'utf-8')
    console.log('Updated: _meta.json')
  }

  console.log(`\nGenerated API docs for ${BUILDERS.length} builders`)
}

generateDocs()
