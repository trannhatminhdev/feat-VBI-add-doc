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
    name: 'Builder',
    file: 'vbi-builder.ts',
    description: 'VBI 主构建器，管理所有子构建器',
    category: 'main',
  },
  // Sub-builders - go to builder/ directory
  {
    name: 'chartType',
    label: 'chartType',
    file: 'sub-builders/chart-type/chart-type-builder.ts',
    description: '图表类型构建器，用于切换和获取图表类型',
    category: 'sub-builders',
  },
  {
    name: 'measures',
    label: 'measures',
    file: 'sub-builders/measures/measures-builder.ts',
    description: '度量构建器，用于添加、修改、删除度量配置',
    category: 'sub-builders',
  },
  {
    name: 'dimensions',
    label: 'dimensions',
    file: 'sub-builders/dimensions/dimensions-builder.ts',
    description: '维度构建器，用于添加、修改、删除维度配置',
    category: 'sub-builders',
  },
  {
    name: 'whereFilters',
    label: 'whereFilters',
    file: 'sub-builders/whereFilters/filters-builder.ts',
    description: 'Where 过滤构建器，用于添加、修改、删除行级过滤条件',
    category: 'sub-builders',
  },
  {
    name: 'havingFilters',
    label: 'havingFilters',
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

    // Extract description from JSDoc - handle both simple * description and @description
    let description = ''
    const descMatch = jsdoc.match(/\* ([^\n]+)/)
    if (descMatch) {
      description = descMatch[1].trim()
      // Remove @description prefix if present
      description = description.replace(/^@description\s+/, '')
    }

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

  // Use displayName: main builder uses 'VBIBuilder', sub-builders use label
  const displayName = builder.category === 'main' ? 'VBIBuilder' : builder.label || builder.name

  let md = `# ${displayName}\n\n`
  md += `${builder.description}\n\n`

  // Constructor section
  md += `## 构造函数\n\n`
  md += `\`\`\`typescript\n`
  md += `new ${displayName}(doc: Y.Doc)\n`
  md += `\`\`\`\n\n`

  // Properties section
  md += `## 属性\n\n`
  const builderInstances = getBuilderProperties(displayName)
  if (builderInstances.length > 0) {
    md += `| 属性 | 类型 | 说明 |\n`
    md += `| --- | --- | --- |\n`
    for (const prop of builderInstances) {
      md += `| **${prop.name}** | \`${prop.type}\` | ${prop.description} |\n`
    }
    md += '\n'
  }

  // Methods section - each method with its own table
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

    // Method definition in code block - simplify return type
    md += `**定义**:\n\n`
    md += '```typescript\n'
    let params = method.params || ''
    let returnType = method.returnType || ''

    // Simplify return type: remove implementation details
    if (returnType) {
      // Handle patterns like "return this.encoding.getMeasureEncodings(...)"
      if (returnType.includes('this.')) {
        returnType = 'any'
      } else if (returnType.startsWith('const ') || returnType.startsWith('let ')) {
        // Handle "const measures = ..." pattern
        const match = returnType.match(/^(const|let)\s+\w+\s+=\s+/)
        if (match) {
          returnType = returnType.slice(match[0].length)
          // If it's a getter like "this.dsl.get('measures')", simplify
          if (returnType.includes('.get(')) {
            returnType = 'any'
          }
        }
      }
      // Clean up arrow functions
      returnType = returnType.replace(/\s*=>.*$/, '').trim()
      md += `${method.name}(${params}): ${returnType}\n`
    } else {
      md += `${method.name}(${params})\n`
    }
    md += '```\n\n'

    // Return value - simplified
    if (method.returnType) {
      let returnType = method.returnType
      // Simplify return type
      if (returnType.includes('this.')) {
        returnType = 'any'
      } else if (returnType.startsWith('const ') || returnType.startsWith('let ')) {
        const match = returnType.match(/^(const|let)\s+\w+\s+=\s+/)
        if (match) {
          returnType = returnType.slice(match[0].length)
          if (returnType.includes('.get(')) {
            returnType = 'any'
          }
        }
      }
      returnType = returnType.replace(/\s*=>.*$/, '').trim()
      md += `**返回**: \`${returnType}\`\n\n`
    }

    // Parameters table - better parsing for complex types
    if (method.params) {
      // Split by comma but respect brackets
      const paramsList = []
      let current = ''
      let bracketDepth = 0
      for (const char of method.params) {
        if (char === '(' || char === '<' || char === '{' || char === '[') {
          bracketDepth++
          current += char
        } else if (char === ')' || char === '>' || char === '}' || char === ']') {
          bracketDepth--
          current += char
        } else if (char === ',' && bracketDepth === 0) {
          paramsList.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      if (current.trim()) {
        paramsList.push(current.trim())
      }

      if (paramsList.length > 0) {
        md += `**参数**:\n\n`
        md += `| 参数 | 类型 |\n`
        md += `| --- | --- |\n`
        for (const param of paramsList) {
          // Split on last colon for type
          const colonIdx = param.lastIndexOf(':')
          let name = param
          let type = ''
          if (colonIdx > 0) {
            name = param.slice(0, colonIdx).trim()
            type = param.slice(colonIdx + 1).trim()
          }
          // Check for default value
          const defaultMatch = name.match(/^(\w+)\s*=\s*(.+)$/)
          let paramName = name
          let defaultVal = ''
          if (defaultMatch) {
            paramName = defaultMatch[1]
            defaultVal = defaultMatch[2]
          }
          md += `| \`${paramName}\`${defaultVal ? ` = ${defaultVal}` : ''} | ${type || '-'} |\n`
        }
        md += '\n'
      }
    }
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

  // Create builder directory for sub-builders
  const builderDir = path.join(OUTPUT_DIR, 'builder')
  if (!fs.existsSync(builderDir)) {
    fs.mkdirSync(builderDir, { recursive: true })
  }

  const mainMeta = [] // For root _meta.json (VBIBuilder file + builder dir)
  const subMeta = [] // For builder/_meta.json

  // Generate builder docs
  for (const builder of BUILDERS) {
    const fileName = kebabCase(builder.name)
    const md = generateBuilderDocs(builder)

    if (builder.category === 'main') {
      // Builder goes to root as builder.md
      const outputPath = path.join(OUTPUT_DIR, 'builder.md')
      fs.writeFileSync(outputPath, md, 'utf-8')
      console.log('Generated: builder.md')

      // Skip adding to mainMeta - only keep dir in _meta.json
      // rspress handles same-name file + dir automatically
    } else {
      // Sub-builders go to builder directory
      const outputPath = path.join(builderDir, `${fileName}.md`)
      fs.writeFileSync(outputPath, md, 'utf-8')
      console.log(`Generated: builder/${fileName}.md`)

      subMeta.push({
        type: 'file',
        name: fileName,
        label: builder.label || builder.name,
      })
    }
  }

  // Write _meta.json for builder directory
  fs.writeFileSync(path.join(builderDir, '_meta.json'), JSON.stringify(subMeta, null, 2), 'utf-8')
  console.log('Generated: api/builder/_meta.json')

  // Write main _meta.json (VBIBuilder file + builder directory)
  mainMeta.push({
    type: 'dir',
    name: 'builder',
    label: 'builder',
  })
  fs.writeFileSync(path.join(OUTPUT_DIR, '_meta.json'), JSON.stringify(mainMeta, null, 2), 'utf-8')
  console.log('Generated: api/_meta.json')

  // Generate index page with overview: true
  const indexPath = path.join(OUTPUT_DIR, 'index.md')
  fs.writeFileSync(indexPath, '---\noverview: true\n---\n', 'utf-8')
  console.log('Generated: index.md')

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
