/**
 * Build API docs from builder classes
 * Generates MD documentation for website using ts-morph
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Project, SyntaxKind } from 'ts-morph'

// ============================================================================
// 常量
// ============================================================================

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BUILDER_DIR = path.resolve(__dirname, '../src/builder')
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/api')

// ============================================================================
// 配置
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
  {
    name: 'dimensions',
    label: 'dimensions',
    file: 'sub-builders/dimensions/dim-builder.ts',
    category: 'sub-builders',
  },
  {
    name: 'whereFilter',
    label: 'whereFilter',
    file: 'sub-builders/whereFilter/where-builder.ts',
    category: 'sub-builders',
  },
  {
    name: 'havingFilter',
    label: 'havingFilter',
    file: 'sub-builders/havingFilter/having-builder.ts',
    category: 'sub-builders',
  },
  {
    name: 'undoManager',
    label: 'undoManager',
    file: 'undo-manager.ts',
    category: 'utilities',
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
    parent: 'whereFilter',
    name: 'WhereNodeBuilder',
    label: 'where-node',
    file: 'sub-builders/whereFilter/where-node-builder.ts',
  },
  {
    parent: 'whereFilter',
    name: 'WhereGroupBuilder',
    label: 'where-group',
    file: 'sub-builders/whereFilter/where-group-builder.ts',
  },
  {
    parent: 'havingFilter',
    name: 'HavingFilterNodeBuilder',
    label: 'having-node',
    file: 'sub-builders/havingFilter/having-node-builder.ts',
  },
  {
    parent: 'havingFilter',
    name: 'HavingGroupBuilder',
    label: 'having-group',
    file: 'sub-builders/havingFilter/having-group-builder.ts',
  },
]

// ============================================================================
// 工具函数
// ============================================================================

const kebabCase = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

const writeFile = (filePath, content) => fs.writeFileSync(filePath, content, 'utf-8')

const writeJson = (filePath, data) => writeFile(filePath, JSON.stringify(data, null, 2))

/** 转义 markdown table 中的 | 字符 */
const escapeTableCell = (str) => str.replace(/\|/g, '\\|')

// ============================================================================
// 类型解析
// ============================================================================

/** 简化 import 类型路径为短名称 */
const simplifyType = (typeText) => {
  if (!typeText) return ''
  if (typeText.includes('this.')) return 'any'

  // 全局替换所有 import("...").TypeName -> TypeName
  const simplified = typeText.replace(/import\([^)]+\)\.\s*([\w$]+)/g, '$1')
  if (simplified !== typeText) return simplified

  return typeText
}

/** 获取节点的类型文本，自动简化 import 路径 */
const getTypeText = (node) => {
  const explicit = node.getTypeNode?.()?.getText() || ''
  if (explicit && !explicit.includes('import(')) return explicit
  return simplifyType(node.getType?.().getText() || '')
}

// ============================================================================
// JSDoc 解析
// ============================================================================

/** 从 JSDoc 提取 @description 或首行描述文本 */
const getDescription = (node) => {
  const docs = node.getJsDocs()
  if (!docs.length) return ''

  const doc = docs[0]
  for (const tag of doc.getTags()) {
    if (tag.getTagName() === 'description') {
      return tag.getComment()?.trim() || ''
    }
  }

  // 回退：取第一行非 @ 开头的文本
  for (const line of doc.getFullText().split('\n')) {
    const trimmed = line.replace(/^\s*\*?\s*/, '').trim()
    if (trimmed && !trimmed.startsWith('@') && !trimmed.startsWith('/')) return trimmed
  }
  return ''
}

/** 从 JSDoc 提取所有 @param 描述 */
const getParamDocs = (node) => {
  const params = {}
  const docs = node.getJsDocs()
  if (!docs.length) return params

  for (const tag of docs[0].getTags()) {
    if (tag.getTagName() === 'param') {
      params[tag.getName()] = tag.getComment()
    }
  }
  return params
}

// ============================================================================
// 类解析（单次 Project 实例）
// ============================================================================

const project = new Project({ compilerOptions: { allowJs: true, noEmit: true } })

/** 解析参数列表 */
const parseParams = (node) =>
  node.getParameters().map((param) => ({
    name: param.getName(),
    type: getTypeText(param),
    defaultValue: param.getInitializer()?.getText() || '',
  }))

/**
 * 解析一个类文件，返回 { description, properties, methods }
 * - 自动过滤 private 属性
 * - 解析 static 方法标记
 * - 解析箭头函数属性为方法
 */
const parseClass = (filePath) => {
  const sourceFile = project.addSourceFileAtPath(filePath)
  const classDecl = sourceFile.getClasses()[0]
  if (!classDecl) return { description: '', properties: [], methods: [] }

  const description = getDescription(classDecl)

  // 属性（过滤 private，排除箭头函数）
  const properties = classDecl
    .getProperties()
    .filter((p) => !p.hasModifier(SyntaxKind.PrivateKeyword))
    .filter((p) => {
      // 排除箭头函数属性（它们会作为方法处理）
      const init = p.getInitializer()
      return !init || init.getKind() !== SyntaxKind.ArrowFunction
    })
    .map((p) => ({
      name: p.getName(),
      type: getTypeText(p),
      description: getDescription(p),
    }))

  const methods = []

  // 构造函数
  const ctors = classDecl.getConstructors()
  if (ctors.length) {
    methods.push({
      name: 'constructor',
      params: parseParams(ctors[0]),
      returnType: '',
      description: getDescription(ctors[0]),
      paramsDoc: getParamDocs(ctors[0]),
      isStatic: false,
    })
  }

  // 普通方法
  for (const method of classDecl.getMethods()) {
    methods.push({
      name: method.getName(),
      params: parseParams(method),
      returnType: method.getReturnTypeNode() ? simplifyType(method.getReturnTypeNode().getText()) : '',
      description: getDescription(method),
      paramsDoc: getParamDocs(method),
      isStatic: method.isStatic(),
    })
  }

  // 箭头函数属性（视为方法）
  for (const prop of classDecl.getProperties()) {
    const init = prop.getInitializer()
    if (!init || init.getKind() !== SyntaxKind.ArrowFunction) continue
    if (prop.hasModifier(SyntaxKind.PrivateKeyword)) continue

    const arrowFn = init
    // 优先使用显式返回类型注解，否则用推断类型
    const returnTypeNode = arrowFn.getReturnTypeNode()
    const returnType = returnTypeNode
      ? simplifyType(returnTypeNode.getText())
      : simplifyType(arrowFn.getReturnType().getText())
    methods.push({
      name: prop.getName(),
      params: parseParams(arrowFn),
      returnType,
      description: getDescription(prop),
      paramsDoc: getParamDocs(prop),
      isStatic: prop.isStatic?.() || false,
    })
  }

  // 清理以避免重复添加
  project.removeSourceFile(sourceFile)

  return { description, properties, methods }
}

// ============================================================================
// Markdown 生成
// ============================================================================

const renderPropertyTable = (properties) => {
  if (!properties.length) return ''
  const rows = properties
    .map((p) => `| **${p.name}** | \`${escapeTableCell(p.type)}\` | ${p.description || '-'} |`)
    .join('\n')
  return `| 属性 | 类型 | 说明 |\n| --- | --- | --- |\n${rows}\n`
}

const renderMethodDoc = (method) => {
  const paramsStr = method.params.map((p) => `${p.name}: ${p.type || 'any'}`).join(', ')
  const prefix = method.isStatic ? 'static ' : ''
  const signature = `${prefix}${method.name}(${paramsStr})${method.returnType ? `: ${method.returnType}` : ''}`

  const parts = [`### ${prefix}${method.name}`]

  if (method.description) parts.push(method.description)

  parts.push(`**定义**:\n\n\`\`\`typescript\n${signature}\n\`\`\``)

  if (method.returnType) {
    parts.push(`**返回**: \`${escapeTableCell(method.returnType)}\``)
  }

  if (method.params.length) {
    const rows = method.params
      .map((p) => {
        const defaultStr = p.defaultValue ? ` = ${p.defaultValue}` : ''
        const desc = method.paramsDoc?.[p.name] || '-'
        return `| \`${p.name}\`${defaultStr} | ${escapeTableCell(p.type || '-')} | ${desc} |`
      })
      .join('\n')
    parts.push(`**参数**:\n\n| 参数 | 类型 | 说明 |\n| --- | --- | --- |\n${rows}`)
  }

  return parts.join('\n\n')
}

const renderBuilderDoc = (config) => {
  const filePath = path.join(BUILDER_DIR, config.file)
  const { description, properties, methods } = parseClass(filePath)
  const displayName = config.category === 'main' ? 'VBIBuilder' : config.label || config.name

  const parts = [
    `# ${displayName}`,
    description || '',
    '## 属性',
    renderPropertyTable(properties),
    '## 方法',
    methods.map(renderMethodDoc).join('\n\n'),
  ]

  return parts.filter(Boolean).join('\n\n')
}

const renderNodeBuilderDoc = (config) => {
  const filePath = path.join(BUILDER_DIR, config.file)
  const { description, methods } = parseClass(filePath)

  const parts = [`# ${config.name}`, description || '', '## 方法', methods.map(renderMethodDoc).join('\n\n')]

  return parts.filter(Boolean).join('\n\n')
}

// ============================================================================
// 主函数
// ============================================================================

function generateDocs() {
  console.log('Building API docs from builder classes...\n')

  ensureDir(OUTPUT_DIR)

  // 收集哪些 parent 拥有子文档
  const parentsWithChildren = new Set(NODE_BUILDER_CONFIG.map((n) => kebabCase(n.parent)))

  // 1. 生成 Builder 文档（主 builder + 子 builder 均输出到 OUTPUT_DIR）
  const apiMeta = []
  for (const builder of BUILDER_CONFIG) {
    const fileName = kebabCase(builder.name)
    const md = renderBuilderDoc(builder)

    if (builder.category === 'main') {
      writeFile(path.join(OUTPUT_DIR, 'builder.md'), md)
      console.log(`Generated: builder.md`)
      apiMeta.push({ type: 'file', name: 'builder', label: 'builder' })
    } else {
      writeFile(path.join(OUTPUT_DIR, `${fileName}.md`), md)
      console.log(`Generated: ${fileName}.md`)

      apiMeta.push({
        type: parentsWithChildren.has(fileName) ? 'dir' : 'file',
        name: fileName,
        label: `builder.${builder.label || builder.name}`,
        collapsed: true,
      })
    }
  }

  // 2. 生成 NodeBuilder 文档 + _meta.json（按 parent 分组，输出到 OUTPUT_DIR/<parent>）
  const nodeMetaByParent = {}
  for (const nodeBuilder of NODE_BUILDER_CONFIG) {
    const parentName = kebabCase(nodeBuilder.parent)
    ensureDir(path.join(OUTPUT_DIR, parentName))

    const md = renderNodeBuilderDoc(nodeBuilder)
    writeFile(path.join(OUTPUT_DIR, parentName, `${nodeBuilder.label}.md`), md)
    console.log(`Generated: ${parentName}/${nodeBuilder.label}.md`)

    if (!nodeMetaByParent[parentName]) nodeMetaByParent[parentName] = []
    nodeMetaByParent[parentName].push({
      type: 'file',
      name: nodeBuilder.label,
      label: nodeBuilder.label,
      collapsed: true,
    })
  }

  // 3. 生成 _meta.json 文件
  for (const [parentName, items] of Object.entries(nodeMetaByParent)) {
    writeJson(path.join(OUTPUT_DIR, parentName, '_meta.json'), items)
    console.log(`Generated: api/${parentName}/_meta.json`)
  }

  writeJson(path.join(OUTPUT_DIR, '_meta.json'), apiMeta)
  console.log('Generated: api/_meta.json')

  writeFile(path.join(OUTPUT_DIR, 'index.md'), '---\noverview: true\n---\n')
  console.log('Generated: index.md')

  // 4. 确保父级 _meta.json 包含 api 条目
  const parentMetaPath = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/_meta.json')
  const parentMeta = JSON.parse(fs.readFileSync(parentMetaPath, 'utf-8'))
  if (!parentMeta.some((item) => item.name === 'api')) {
    parentMeta.splice(2, 0, { type: 'dir', name: 'api', label: 'API' })
    writeJson(parentMetaPath, parentMeta)
    console.log('Updated: _meta.json')
  }

  console.log(
    `\n✅ Generated API docs for ${BUILDER_CONFIG.length} builders and ${NODE_BUILDER_CONFIG.length} node-builders`,
  )
}

generateDocs()
