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

const BUILDER_ROOTS = {
  chart: path.resolve(__dirname, '../src/chart-builder'),
  report: path.resolve(__dirname, '../src/report-builder'),
}
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/api')

// ============================================================================
// 配置
// ============================================================================

const API_SECTIONS = [
  {
    name: 'chartBuilder',
    label: 'chartBuilder',
    root: 'chart',
    index: {
      file: 'builder.ts',
      displayName: 'VBIChartBuilder',
    },
    items: [
      {
        type: 'file',
        name: 'chartType',
        label: 'chartBuilder.chartType',
        file: 'features/chart-type/chart-type-builder.ts',
        displayName: 'ChartTypeBuilder',
      },
      {
        type: 'dir',
        name: 'measures',
        label: 'chartBuilder.measures',
        file: 'features/measures/mea-builder.ts',
        displayName: 'MeasuresBuilder',
        children: [
          {
            name: 'measureNode',
            label: 'measureNode',
            file: 'features/measures/mea-node-builder.ts',
            displayName: 'MeasureNodeBuilder',
          },
        ],
      },
      {
        type: 'dir',
        name: 'dimensions',
        label: 'chartBuilder.dimensions',
        file: 'features/dimensions/dim-builder.ts',
        displayName: 'DimensionsBuilder',
        children: [
          {
            name: 'dimensionNode',
            label: 'dimensionNode',
            file: 'features/dimensions/dim-node-builder.ts',
            displayName: 'DimensionNodeBuilder',
          },
        ],
      },
      {
        type: 'dir',
        name: 'whereFilter',
        label: 'chartBuilder.whereFilter',
        file: 'features/whereFilter/where-builder.ts',
        displayName: 'WhereFilterBuilder',
        children: [
          {
            name: 'whereNode',
            label: 'whereNode',
            file: 'features/whereFilter/where-node-builder.ts',
            displayName: 'WhereFilterNodeBuilder',
          },
          {
            name: 'whereGroup',
            label: 'whereGroup',
            file: 'features/whereFilter/where-group-builder.ts',
            displayName: 'WhereGroupBuilder',
          },
        ],
      },
      {
        type: 'dir',
        name: 'havingFilter',
        label: 'chartBuilder.havingFilter',
        file: 'features/havingFilter/having-builder.ts',
        displayName: 'HavingFilterBuilder',
        children: [
          {
            name: 'havingNode',
            label: 'havingNode',
            file: 'features/havingFilter/having-node-builder.ts',
            displayName: 'HavingFilterNodeBuilder',
          },
          {
            name: 'havingGroup',
            label: 'havingGroup',
            file: 'features/havingFilter/having-group-builder.ts',
            displayName: 'HavingGroupBuilder',
          },
        ],
      },
      {
        type: 'file',
        name: 'theme',
        label: 'chartBuilder.theme',
        file: 'features/theme/theme-builder.ts',
        displayName: 'ThemeBuilder',
      },
      {
        type: 'file',
        name: 'locale',
        label: 'chartBuilder.locale',
        file: 'features/locale/locale-builder.ts',
        displayName: 'LocaleBuilder',
      },
      {
        type: 'file',
        name: 'limit',
        label: 'chartBuilder.limit',
        file: 'features/limit/limit-builder.ts',
        displayName: 'LimitBuilder',
      },
      {
        type: 'file',
        name: 'undoManager',
        label: 'chartBuilder.undoManager',
        file: 'features/undo-manager/undo-manager.ts',
        displayName: 'UndoManager',
      },
    ],
  },
  {
    name: 'reportBuilder',
    label: 'reportBuilder',
    root: 'report',
    index: {
      file: 'builder.ts',
      displayName: 'VBIReportBuilder',
    },
    items: [
      {
        type: 'dir',
        name: 'page',
        label: 'reportBuilder.page',
        file: 'features/page/page-collection-builder.ts',
        displayName: 'ReportPageCollectionBuilder',
        children: [
          {
            name: 'reportPage',
            label: 'reportPage',
            file: 'features/page/page-builder.ts',
            displayName: 'ReportPageBuilder',
          },
          {
            name: 'reportText',
            label: 'reportText',
            file: 'features/page/text-builder.ts',
            displayName: 'ReportTextBuilder',
          },
        ],
      },
    ],
  },
]

// ============================================================================
// 工具函数
// ============================================================================

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

const resetDir = (dirPath) => {
  fs.rmSync(dirPath, { recursive: true, force: true })
  fs.mkdirSync(dirPath, { recursive: true })
}

const writeFile = (filePath, content) => fs.writeFileSync(filePath, content, 'utf-8')

const writeJson = (filePath, data) => writeFile(filePath, JSON.stringify(data, null, 2))

/** 转义 markdown table 中的 | 字符 */
const escapeTableCell = (str) => str.replace(/\|/g, '\\|')

const resolveBuilderPath = (config) => {
  const root = BUILDER_ROOTS[config.root]
  if (!root) {
    throw new Error(`Unknown builder root "${config.root}"`)
  }
  return path.join(root, config.file)
}

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
    if (method.hasModifier(SyntaxKind.PrivateKeyword)) continue
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
  const filePath = resolveBuilderPath(config)
  const { description, properties, methods } = parseClass(filePath)
  const displayName = config.displayName || config.label || config.name

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

const writeDoc = (filePath, content) => writeFile(filePath, content)

const toDocConfig = (root, config) => ({ ...config, root })

const createMetaFileEntry = (name, label) => ({ type: 'file', name, label })

const createMetaDirEntry = (name, label, collapsed = true) => ({
  type: 'dir',
  name,
  label,
  collapsible: true,
  collapsed,
})

const generateSection = (section) => {
  const sectionDir = path.join(OUTPUT_DIR, section.name)
  ensureDir(sectionDir)

  writeDoc(path.join(sectionDir, 'index.md'), renderBuilderDoc(toDocConfig(section.root, section.index)))
  console.log(`Generated: ${section.name}/index.md`)

  const sectionMeta = []
  for (const item of section.items) {
    if (item.type === 'file') {
      writeDoc(path.join(sectionDir, `${item.name}.md`), renderBuilderDoc(toDocConfig(section.root, item)))
      console.log(`Generated: ${section.name}/${item.name}.md`)
      sectionMeta.push(createMetaFileEntry(item.name, item.label))
      continue
    }

    const itemDir = path.join(sectionDir, item.name)
    ensureDir(itemDir)
    writeDoc(path.join(itemDir, 'index.md'), renderBuilderDoc(toDocConfig(section.root, item)))
    console.log(`Generated: ${section.name}/${item.name}/index.md`)

    const childMeta = []
    for (const child of item.children || []) {
      writeDoc(path.join(itemDir, `${child.name}.md`), renderBuilderDoc(toDocConfig(section.root, child)))
      console.log(`Generated: ${section.name}/${item.name}/${child.name}.md`)
      childMeta.push(createMetaFileEntry(child.name, child.label))
    }

    writeJson(path.join(itemDir, '_meta.json'), childMeta)
    console.log(`Generated: ${section.name}/${item.name}/_meta.json`)
    sectionMeta.push(createMetaDirEntry(item.name, item.label))
  }

  writeJson(path.join(sectionDir, '_meta.json'), sectionMeta)
  console.log(`Generated: ${section.name}/_meta.json`)
}

// ============================================================================
// 主函数
// ============================================================================

function generateDocs() {
  console.log('Building API docs from builder classes...\n')

  resetDir(OUTPUT_DIR)

  for (const section of API_SECTIONS) {
    generateSection(section)
  }

  writeJson(path.join(OUTPUT_DIR, '_meta.json'), [
    createMetaFileEntry('index', 'API'),
    ...API_SECTIONS.map((section) => createMetaDirEntry(section.name, section.label, false)),
  ])
  console.log('Generated: api/_meta.json')

  writeFile(path.join(OUTPUT_DIR, 'index.md'), '---\noverview: true\ntitle: API\n---\n')
  console.log('Generated: index.md')

  // 4. 确保父级 _meta.json 包含 api 条目
  const parentMetaPath = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/_meta.json')
  const parentMeta = JSON.parse(fs.readFileSync(parentMetaPath, 'utf-8'))
  if (!parentMeta.some((item) => item.name === 'api')) {
    parentMeta.splice(2, 0, { type: 'dir', name: 'api', label: 'API' })
    writeJson(parentMetaPath, parentMeta)
    console.log('Updated: _meta.json')
  }

  console.log(`\n✅ Generated API docs for ${API_SECTIONS.length} builder sections`)
}

generateDocs()
