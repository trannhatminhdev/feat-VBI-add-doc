/**
 * Build API docs from builder classes
 * Generates MDX documentation for website using ts-morph
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Project, SyntaxKind } from 'ts-morph'

// ============================================================================
// 初始化
// ============================================================================

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUILDER_DIR = path.resolve(__dirname, '../src/builder')
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/api')

// ============================================================================
// 配置（只需提供文件路径和名称，description 从代码注释中解析）
// ============================================================================

const BUILDER_CONFIG = [
  { name: 'Builder', file: 'vbi-builder.ts', category: 'main' },
  {
    name: 'chartType',
    label: 'chartType',
    file: 'sub-builders/chart-type/chart-type-builder.ts',
    category: 'sub-builders',
  },
  { name: 'measures', label: 'measures', file: 'sub-builders/measures/mea-builder.ts', category: 'sub-builders' },
  { name: 'dimensions', label: 'dimensions', file: 'sub-builders/dimensions/dim-builder.ts', category: 'sub-builders' },
  {
    name: 'whereFilters',
    label: 'whereFilters',
    file: 'sub-builders/whereFilters/where-builder.ts',
    category: 'sub-builders',
  },
  {
    name: 'havingFilters',
    label: 'havingFilters',
    file: 'sub-builders/havingFilters/having-builder.ts',
    category: 'sub-builders',
  },
]

const NODE_BUILDER_CONFIG = [
  {
    parent: 'measures',
    name: 'MeasureNodeBuilder',
    label: 'measure-node',
    file: 'sub-builders/measures/mea-node-builder.ts',
  },
  {
    parent: 'dimensions',
    name: 'DimensionNodeBuilder',
    label: 'dimension-node',
    file: 'sub-builders/dimensions/dim-node-builder.ts',
  },
  {
    parent: 'whereFilters',
    name: 'WhereNodeBuilder',
    label: 'where-node',
    file: 'sub-builders/whereFilters/where-node-builder.ts',
  },
  {
    parent: 'havingFilters',
    name: 'HavingNodeBuilder',
    label: 'having-node',
    file: 'sub-builders/havingFilters/having-node-builder.ts',
  },
]

// ============================================================================
// 工具函数
// ============================================================================

const utils = {
  kebabCase: (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),

  ensureDir: (dirPath) => {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
  },

  writeJson: (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8'),
}

// ============================================================================
// JSDoc 解析
// ============================================================================

/**
 * 创建共享的 Project 实例
 */
const createProject = () => new Project({ compilerOptions: { allowJs: true, noEmit: true } })

/**
 * 解析类的 JSDoc，获取 @description 标签内容
 */
const parseClassDoc = (filePath) => {
  const project = createProject()
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClasses()[0]
  if (!classDecl) return { description: '', example: [] }

  const docs = classDecl.getJsDocs()
  if (!docs.length) return { description: '', example: [] }

  const doc = docs[0]

  // 获取 @description 标签
  for (const tag of doc.getTags()) {
    if (tag.getTagName() === 'description') {
      return { description: tag.getComment().trim() }
    }
  }

  // 回退：获取第一行非 @ 开头的文本
  const fullText = doc.getFullText()
  for (const line of fullText.split('\n')) {
    const trimmed = line.replace(/^\s*\*?\s*/, '').trim()
    if (trimmed && !trimmed.startsWith('@')) return { description: trimmed }
  }

  return { description: '' }
}

/**
 * 解析类属性
 */
const parseProperties = (filePath) => {
  const project = createProject()
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClasses()[0]
  if (!classDecl) return []

  return classDecl.getProperties().map((prop) => {
    let type = prop.getTypeNode()?.getText() || ''
    if (!type || type.includes('import(')) {
      type = typeParser.simplify({ getText: () => prop.getType().getText() })
    }
    return {
      name: prop.getName(),
      type,
      description: jsdoc.getDescription(prop),
      isPrivate: prop.hasModifier(SyntaxKind.PrivateKeyword),
    }
  })
}

/**
 * 类型解析
 */
const typeParser = {
  simplify: (returnType) => {
    if (!returnType) return ''
    let typeStr = returnType.getText()

    if (typeStr.includes('this.')) return 'any'

    // 简化 import("...").Type -> Type
    const match = typeStr.match(/import\([^)]+\)\.([\w$]+)$/)
    if (match) return match[1]

    // 简化 import(".../Type") -> Type
    const pathMatch = typeStr.match(/import\([^)]+\/([^/)]+)\)/)
    if (pathMatch) return pathMatch[1].replace('.d.ts', '').replace('.ts', '')

    return typeStr
  },

  parseParams: (method) => {
    return method.getParameters().map((param) => {
      let type = param.getTypeNode()?.getText() || ''
      if (!type || type.includes('import(')) {
        type = typeParser.simplify({ getText: () => param.getType().getText() })
      }
      return {
        name: param.getName(),
        type,
        defaultValue: param.getInitializer()?.getText() || '',
      }
    })
  },
}

// ============================================================================
// JSDoc 解析
// ============================================================================

const jsdoc = {
  getDescription: (node) => {
    const docs = node.getJsDocs()
    if (!docs.length) return ''

    const doc = docs[0]
    // 优先获取 @description 标签
    for (const tag of doc.getTags()) {
      if (tag.getTagName() === 'description') {
        return tag.getComment().trim()
      }
    }

    // 回退：获取第一行非 @ 开头的文本
    const fullText = doc.getFullText()
    for (const line of fullText.split('\n')) {
      const trimmed = line.replace(/^\s*\*?\s*/, '').trim()
      if (trimmed && !trimmed.startsWith('@')) return trimmed
    }
    return ''
  },

  getParams: (node) => {
    const params = {}
    const docs = node.getJsDocs()
    if (!docs.length) return params

    for (const tag of docs[0].getTags()) {
      if (tag.getTagName() === 'param') {
        params[tag.getName()] = tag.getComment()
      }
    }
    return params
  },
}

/**
 * 解析类方法
 */
const parseMethods = (filePath) => {
  const project = createProject()
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClasses()[0]
  if (!classDecl) return []

  const methods = []

  // 构造函数
  const constructors = classDecl.getConstructors()
  if (constructors.length) {
    methods.push({
      name: 'constructor',
      params: typeParser.parseParams(constructors[0]),
      returnType: '',
      description: jsdoc.getDescription(constructors[0]) || '',
      paramsDoc: jsdoc.getParams(constructors[0]),
      isConstructor: true,
    })
  }

  // 普通方法
  for (const method of classDecl.getMethods()) {
    const methodName = method.getName()
    if (methodName === 'constructor') continue

    methods.push({
      name: methodName,
      params: typeParser.parseParams(method),
      returnType: method.getReturnTypeNode() ? typeParser.simplify(method.getReturnTypeNode()) : '',
      description: jsdoc.getDescription(method),
      paramsDoc: jsdoc.getParams(method),
      isConstructor: false,
    })
  }

  return methods
}

// ============================================================================
// 文档生成
// ============================================================================

const mdGenerator = {
  propertyTable: (properties) => {
    if (!properties.length) return ''
    const rows = properties.map((p) => `| **${p.name}** | \`${p.type}\` | ${p.description || '-'} |`).join('\n')
    return `| 属性 | 类型 | 说明 |\n| --- | --- | --- |\n${rows}\n`
  },

  methodDoc: (method) => {
    const paramsStr = method.params.map((p) => `${p.name}: ${p.type || 'any'}`).join(', ')
    const paramsTable = method.params.length
      ? `| 参数 | 类型 | 说明 |\n| --- | --- | --- |\n${method.params.map((p) => `| \`${p.name}\`${p.defaultValue ? ` = ${p.defaultValue}` : ''} | ${p.type || '-'} | ${method.paramsDoc?.[p.name] || '-'} |`).join('\n')}\n`
      : ''

    return `### ${method.name}\n\n${method.description ? method.description + '\n\n' : ''}**定义**:\n\n\`\`\`typescript\n${method.name}(${paramsStr})${method.returnType ? `: ${method.returnType}` : ''}\n\`\`\`\n\n${method.returnType ? `**返回**: \`${method.returnType}\`\n\n` : ''}${paramsTable ? `**参数**:\n\n${paramsTable}\n` : ''}`
  },

  builder: (config) => {
    const filePath = path.join(BUILDER_DIR, config.file)
    const methods = parseMethods(filePath)
    const properties = parseProperties(filePath)
    const classDoc = parseClassDoc(filePath)
    const displayName = config.category === 'main' ? 'VBIBuilder' : config.label || config.name

    let md = `# ${displayName}\n\n${classDoc.description || config.description || ''}\n\n## 属性\n\n`

    // VBIBuilder 使用固定的属性列表
    if (displayName === 'VBIBuilder') {
      md += mdGenerator.propertyTable(VBI_BUILDER_PROPS)
    } else {
      md += mdGenerator.propertyTable(
        properties.map((p) => ({ name: p.name, type: p.type, description: p.description })),
      )
    }

    md += '## 方法\n\n'
    md += methods.map((m) => mdGenerator.methodDoc(m)).join('\n\n')
    return md
  },

  nodeBuilder: (config) => {
    const filePath = path.join(BUILDER_DIR, config.file)
    const methods = parseMethods(filePath)
    const classDoc = parseClassDoc(filePath)

    let md = `# ${config.name}\n\n${classDoc.description || ''}\n\n## 属性\n\n`
    md += mdGenerator.propertyTable([{ name: 'yMap', type: 'Y.Map<any>', description: 'Yjs Map 实例' }])
    md += '## 方法\n\n'
    md += methods.map((m) => mdGenerator.methodDoc(m)).join('\n\n')
    return md
  },
}

// VBIBuilder 的属性列表（硬编码，因为是主入口）
const VBI_BUILDER_PROPS = [
  { name: 'chartType', type: 'ChartTypeBuilder', description: '图表类型构建器' },
  { name: 'measures', type: 'MeasuresBuilder', description: '度量构建器' },
  { name: 'dimensions', type: 'DimensionsBuilder', description: '维度构建器' },
  { name: 'whereFilters', type: 'WhereFiltersBuilder', description: 'Where 过滤构建器' },
  { name: 'havingFilters', type: 'HavingFiltersBuilder', description: 'Having 过滤构建器' },
  { name: 'encoding', type: 'EncodingBuilder', description: '编码构建器' },
  { name: 'dsl', type: 'Y.Map<any>', description: 'Yjs 文档映射' },
  { name: 'doc', type: 'Y.Doc', description: 'Yjs 文档实例' },
  { name: 'undoManager', type: 'Y.UndoManager', description: '撤销管理器' },
]

// ============================================================================
// 主函数
// ============================================================================

function generateDocs() {
  console.log('Building API docs from builder classes...\n')

  // 初始化输出目录
  utils.ensureDir(OUTPUT_DIR)
  const builderDir = path.join(OUTPUT_DIR, 'builder')
  utils.ensureDir(builderDir)

  const subMeta = []
  const nodeBuilderDirs = new Set()

  // 1. 生成 Builder 文档
  for (const builder of BUILDER_CONFIG) {
    const fileName = utils.kebabCase(builder.name)
    const md = mdGenerator.builder(builder)

    if (builder.category === 'main') {
      const outputPath = path.join(OUTPUT_DIR, 'builder.md')
      fs.writeFileSync(outputPath, md, 'utf-8')
      console.log(`Generated: builder.md`)
    } else {
      const outputPath = path.join(builderDir, `${fileName}.md`)
      fs.writeFileSync(outputPath, md, 'utf-8')
      console.log(`Generated: builder/${fileName}.md`)

      subMeta.push({ type: 'dir', name: fileName, label: builder.label || builder.name, collapsed: true })
    }
  }

  // 2. 生成 NodeBuilder 文档
  for (const nodeBuilder of NODE_BUILDER_CONFIG) {
    const parentName = utils.kebabCase(nodeBuilder.parent)
    utils.ensureDir(path.join(builderDir, parentName))

    const md = mdGenerator.nodeBuilder(nodeBuilder)
    const outputPath = path.join(builderDir, parentName, `${nodeBuilder.label}.md`)
    fs.writeFileSync(outputPath, md, 'utf-8')
    console.log(`Generated: builder/${parentName}/${nodeBuilder.label}.md`)

    nodeBuilderDirs.add(parentName)
  }

  // 3. 生成 _meta.json 文件
  const updatedSubMeta = subMeta.map((item) => ({ ...item, type: nodeBuilderDirs.has(item.name) ? 'dir' : 'file' }))
  utils.writeJson(path.join(builderDir, '_meta.json'), updatedSubMeta)
  console.log('Generated: api/builder/_meta.json')

  for (const nodeBuilder of NODE_BUILDER_CONFIG) {
    const parentName = utils.kebabCase(nodeBuilder.parent)
    utils.writeJson(path.join(builderDir, parentName, '_meta.json'), [
      { type: 'file', name: nodeBuilder.label, label: nodeBuilder.label, collapsed: true },
    ])
    console.log(`Generated: api/builder/${parentName}/_meta.json`)
  }

  utils.writeJson(path.join(OUTPUT_DIR, '_meta.json'), [
    { type: 'dir', name: 'builder', label: 'builder', collapsed: true },
  ])
  console.log('Generated: api/_meta.json')

  // index.md
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.md'), '---\noverview: true\n---\n', 'utf-8')
  console.log('Generated: index.md\n')

  // 4. 更新父级 _meta.json
  const parentMetaPath = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/_meta.json')
  const parentMeta = JSON.parse(fs.readFileSync(parentMetaPath, 'utf-8'))
  if (!parentMeta.some((item) => item.name === 'api')) {
    parentMeta.splice(2, 0, { type: 'dir', name: 'api', label: 'API' })
    utils.writeJson(parentMetaPath, parentMeta)
    console.log('Updated: _meta.json')
  }

  console.log(
    `\n✅ Generated API docs for ${BUILDER_CONFIG.length} builders and ${NODE_BUILDER_CONFIG.length} node-builders`,
  )
}

generateDocs()
