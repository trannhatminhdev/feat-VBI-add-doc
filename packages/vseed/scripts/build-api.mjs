import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Project, SyntaxKind } from 'ts-morph'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputDir = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vseed/api')
const srcDir = path.resolve(__dirname, '../src')
const tsConfigPath = path.resolve(__dirname, '../tsconfig.json')

const builderTarget = { name: 'Builder', file: 'builder/builder/builder.ts', kind: 'class' }
const registerNameFilter = (name) => name.startsWith('register') || name.startsWith('update')

const registerConfig = {
  outputName: 'Register',
  groups: [
    {
      title: 'Theme',
      dir: 'builder/register/theme',
      exclude: ['index.ts'],
    },
    {
      title: 'ChartType',
      dir: 'builder/register/chartType',
      exclude: ['index.ts'],
    },
  ],
}

function main() {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true })
  }
  ensureDir(outputDir)

  const project = new Project({
    tsConfigFilePath: tsConfigPath,
  })

  processTarget(project, builderTarget)
  processRegisterGroup(project, registerConfig)
  generateMetaJsonRecursive(outputDir)

  console.log('API 文档生成完成，目录：', outputDir)
}

function processTarget(project, target) {
  const inputFile = path.join(srcDir, target.file)
  if (!fs.existsSync(inputFile)) {
    console.log(`Skipping ${target.name}: ${inputFile} does not exist.`)
    return
  }

  const sourceFile = getSourceFile(project, inputFile)
  if (!sourceFile) return

  let content = ''
  let found = false

  if (target.kind === 'class') {
    const classDecl = sourceFile.getClass(target.name)
    if (classDecl) {
      content = generateClassMarkdown(classDecl)
      found = true
    }
  }

  if (!found) {
    console.warn(`Could not find export "${target.name}" in ${inputFile}`)
    return
  }

  const mdPath = path.join(outputDir, `${target.name}.md`)
  fs.writeFileSync(mdPath, content, 'utf-8')
  console.log(`文档生成完成 for ${target.name}, 文件：`, mdPath)
}

function processRegisterGroup(project, config) {
  let content = `# ${config.outputName}\n\n`

  for (const group of config.groups) {
    content += `## ${group.title}\n\n`
    content += buildRegisterGroupContent(project, group)
  }

  const mdPath = path.join(outputDir, `${config.outputName}.md`)
  fs.writeFileSync(mdPath, content, 'utf-8')
  console.log(`文档生成完成 for ${config.outputName}, 文件：`, mdPath)
}

function buildRegisterGroupContent(project, group) {
  let content = ''
  if (group.items) {
    for (const item of group.items) {
      const itemContent = processFunctionItem(project, item)
      if (itemContent) content += itemContent
    }
  }

  if (group.dir) {
    const dirPath = path.join(srcDir, group.dir)
    const files = getGroupFiles(dirPath, group.exclude)
    for (const filePath of files) {
      const sourceFile = getSourceFile(project, filePath)
      if (!sourceFile) continue
      const exportedItems = getExportedFunctionItems(sourceFile)
      exportedItems.forEach(({ name, decl }) => {
        content += generateCommonFunctionMarkdown(name, decl)
      })
    }
  }

  return content
}

function processFunctionItem(project, item) {
  const inputFile = path.join(srcDir, item.file)
  if (!fs.existsSync(inputFile)) return ''

  const sourceFile = getSourceFile(project, inputFile)
  if (!sourceFile) return ''

  let funcDecl = sourceFile.getFunction(item.name)
  if (funcDecl) {
    return generateFunctionMarkdown(funcDecl)
  }

  const varDecl = sourceFile.getVariableDeclaration(item.name)
  if (varDecl) {
    return generateVariableFunctionMarkdown(varDecl)
  }

  return ''
}

function generateClassMarkdown(classDecl) {
  const name = classDecl.getName()
  const jsDocs = classDecl.getJsDocs()
  const tags = parseJsDocTags(jsDocs)

  let markdown = `# ${name}\n\n`

  if (tags.description) {
    markdown += `:::note{title=描述}\n${tags.description.join('\n\n')}\n:::\n\n`
  }

  const members = classDecl.getMembers()

  const categories = {
    Methods: [],
    'Static Methods': [],
    Properties: [],
    'Static Properties': [],
  }

  members.forEach((member) => {
    const modifiers = member.getModifiers ? member.getModifiers() : []
    const isPrivate = modifiers.some(
      (mod) => mod.getKind() === SyntaxKind.PrivateKeyword || mod.getKind() === SyntaxKind.ProtectedKeyword,
    )
    if (isPrivate || member.getKind() === SyntaxKind.Constructor) return

    const isStatic = member.isStatic()
    let isMethod = member.getKind() === SyntaxKind.MethodDeclaration

    if (member.getKind() === SyntaxKind.PropertyDeclaration) {
      const initializer = member.getInitializer()
      if (
        initializer &&
        (initializer.getKind() === SyntaxKind.ArrowFunction || initializer.getKind() === SyntaxKind.FunctionExpression)
      ) {
        isMethod = true
      }
    }

    if (isStatic) {
      categories[isMethod ? 'Static Methods' : 'Static Properties'].push(member)
    } else {
      categories[isMethod ? 'Methods' : 'Properties'].push(member)
    }
  })

  const sectionOrder = ['Methods', 'Static Methods', 'Properties', 'Static Properties']

  sectionOrder.forEach((title) => {
    markdown += renderSection(title, categories[title])
  })

  return markdown
}

function renderSection(title, membersList) {
  if (!membersList || membersList.length === 0) return ''
  let sectionMd = `## ${title}\n\n`
  membersList.forEach((member) => {
    sectionMd += generateMemberMarkdown(member)
  })
  return sectionMd
}

function generateMemberMarkdown(member) {
  let memberName = ''
  if (member.getName) {
    memberName = member.getName()
    if (member.getKind() === SyntaxKind.GetAccessor) {
      memberName = `get ${memberName}`
    } else if (member.getKind() === SyntaxKind.SetAccessor) {
      memberName = `set ${memberName}`
    }
  }
  if (!memberName) return ''

  const memberJsDocs = member.getJsDocs()
  const memberTags = parseJsDocTags(memberJsDocs)
  let markdown = `### ${memberName}\n\n`

  let signatureCode = getMemberSignature(member, memberName)
  markdown += `\`\`\`ts\n${signatureCode}\n\`\`\`\n\n`

  if (memberTags.description) {
    markdown += `${memberTags.description.join('\n\n')}\n\n`
  }

  if (memberTags.param) {
    markdown += `**Parameters:**\n\n`
    memberTags.param.forEach((p) => {
      markdown += `- ${p}\n`
    })
    markdown += '\n'
  }

  if (memberTags.returns) {
    markdown += `**Returns:** ${memberTags.returns.join(' ')}\n\n`
  }

  if (memberTags.example) {
    markdown += `**Example:**\n\n${memberTags.example.join('\n')}\n\n`
  }

  return markdown
}

function getMemberSignature(member, memberName) {
  let signatureCode = ''

  if (member.getKind() === SyntaxKind.MethodDeclaration) {
    const text = member.getText()
    const signatureEnd = text.indexOf('{')
    if (signatureEnd !== -1) {
      signatureCode = text.substring(0, signatureEnd).trim()
    } else {
      signatureCode = text
    }
  } else if (member.getKind() === SyntaxKind.GetAccessor || member.getKind() === SyntaxKind.SetAccessor) {
    const text = member.getText()
    const signatureEnd = text.indexOf('{')
    if (signatureEnd !== -1) {
      signatureCode = text.substring(0, signatureEnd).trim()
    } else {
      signatureCode = text
    }
  } else if (member.getKind() === SyntaxKind.PropertyDeclaration) {
    const initializer = member.getInitializer()

    if (
      initializer &&
      (initializer.getKind() === SyntaxKind.ArrowFunction || initializer.getKind() === SyntaxKind.FunctionExpression)
    ) {
      const arrowFunc = initializer
      const params = arrowFunc
        .getParameters()
        .map((p) => p.getText())
        .join(', ')
      const returnType = arrowFunc.getReturnType().getText(member)
      const typeParams = arrowFunc
        .getTypeParameters()
        .map((tp) => tp.getText())
        .join(', ')

      let typeParamStr = typeParams ? `<${typeParams}>` : ''
      const isStatic = member.isStatic() ? 'static ' : ''
      signatureCode = `${isStatic}${memberName}${typeParamStr}(${params}): ${returnType}`
    } else {
      const isStatic = member.isStatic() ? 'static ' : ''
      const type = member.getType().getText(member)
      signatureCode = `${isStatic}${memberName}: ${type}`
    }
  }
  return cleanType(signatureCode)
}

function generateFunctionMarkdown(funcDecl) {
  return generateCommonFunctionMarkdown(funcDecl.getName(), funcDecl)
}

function generateVariableFunctionMarkdown(varDecl) {
  const name = varDecl.getName()
  const initializer = varDecl.getInitializer()
  if (!initializer) return ''
  return generateCommonFunctionMarkdown(name, varDecl)
}

function generateCommonFunctionMarkdown(name, node) {
  let markdown = `### ${name}\n\n`

  let jsDocs = []
  if (node.getJsDocs) {
    jsDocs = node.getJsDocs()
  }

  if (jsDocs.length === 0 && node.getKind() === SyntaxKind.VariableDeclaration) {
    const statement = node.getParent().getParent()
    if (statement && statement.getJsDocs) {
      jsDocs = statement.getJsDocs()
    }
  }

  const tags = parseJsDocTags(jsDocs)

  if (tags.description) {
    markdown += `:::note{title=描述}\n${tags.description.join('\n\n')}\n:::\n\n`
  }

  let signature = ''
  if (node.getKind() === SyntaxKind.FunctionDeclaration) {
    const text = node.getText()
    signature = text.split('{')[0].trim()
  } else if (node.getKind() === SyntaxKind.VariableDeclaration) {
    const initializer = node.getInitializer()
    if (
      initializer &&
      (initializer.getKind() === SyntaxKind.ArrowFunction || initializer.getKind() === SyntaxKind.FunctionExpression)
    ) {
      const arrowFunc = initializer
      const params = arrowFunc
        .getParameters()
        .map((p) => p.getText())
        .join(', ')
      const returnType = arrowFunc.getReturnType().getText(node)
      const typeParams = arrowFunc
        .getTypeParameters()
        .map((tp) => tp.getText())
        .join(', ')
      let typeParamStr = typeParams ? `<${typeParams}>` : ''

      signature = `function ${name}${typeParamStr}(${params}): ${returnType}`
    } else {
      signature = `const ${node.getName()}: ${node.getType().getText(node)}`
    }
  }

  signature = cleanType(signature)

  markdown += `\`\`\`ts\n${signature}\n\`\`\`\n\n`

  if (tags.param) {
    markdown += `**Parameters:**\n\n`
    tags.param.forEach((p) => {
      markdown += `- ${p}\n`
    })
    markdown += '\n'
  }

  if (tags.returns) {
    markdown += `**Returns:** ${tags.returns.join(' ')}\n\n`
  }

  if (tags.example) {
    markdown += `**Example:**\n\n${tags.example.join('\n')}\n\n`
  }

  return markdown
}

function cleanType(text) {
  if (!text) return ''
  let cleaned = text.replace(/import\(".*?"\)\./g, '')
  return cleaned
}

function generateMetaJsonRecursive(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true })
  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      generateMetaJsonRecursive(path.join(directory, entry.name))
    }
  })

  const dirsForMeta = []
  const filesForMeta = []

  entries.forEach((entry) => {
    if (entry.name === '_meta.json' || entry.name === 'index.md' || entry.name === 'index.mdx') {
      return
    }

    if (entry.isDirectory()) {
      dirsForMeta.push({ type: 'dir', name: entry.name, label: `${entry.name} `, collapsed: true })
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      const name = entry.name.replace(/\.mdx?$/, '')
      filesForMeta.push({ type: 'file', name: name, label: `${name} ` })
    }
  })

  dirsForMeta.sort((a, b) => a.name.localeCompare(b.name))
  filesForMeta.sort((a, b) => a.name.localeCompare(b.name))

  let meta = [...filesForMeta, ...dirsForMeta]

  if (meta.length > 0) {
    fs.writeFileSync(path.join(directory, '_meta.json'), JSON.stringify(meta, null, 2))
  }
}

function parseJsDocTags(jsDocs) {
  const tags = {}
  jsDocs.forEach((jsDoc) => {
    const description = jsDoc.getDescription()
    if (description) {
      if (!tags.description) tags.description = []
      tags.description.push(description.trim())
    }
    jsDoc.getTags().forEach((tag) => {
      const tagName = tag.getTagName()
      const tagText = tag.getCommentText() || ''
      if (!tags[tagName]) {
        tags[tagName] = []
      }
      if (tagName === 'param') {
      }
      tags[tagName].push(tagText.trim())
    })
  })
  return tags
}

function getSourceFile(project, filePath) {
  if (!fs.existsSync(filePath)) return null
  project.addSourceFileAtPath(filePath)
  return project.getSourceFileOrThrow(filePath)
}

function getGroupFiles(dirPath, exclude) {
  if (!fs.existsSync(dirPath)) return []
  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith('.ts'))
  const filtered = exclude ? files.filter((file) => !exclude.includes(file)) : files
  return filtered.sort().map((file) => path.join(dirPath, file))
}

function getExportedFunctionItems(sourceFile) {
  const exportedDecls = sourceFile.getExportedDeclarations()
  const items = []
  for (const [name, decls] of exportedDecls) {
    if (!registerNameFilter(name)) continue
    for (const decl of decls) {
      if (isFunctionLikeDeclaration(decl)) {
        items.push({ name, decl })
      }
    }
  }
  return items
}

function isFunctionLikeDeclaration(decl) {
  return decl.getKind() === SyntaxKind.FunctionDeclaration || decl.getKind() === SyntaxKind.VariableDeclaration
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

main()
