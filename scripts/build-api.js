const path = require('path')
const fs = require('fs')
const { Project, SyntaxKind } = require('ts-morph')

// ==================================================================================
// Constants
// ==================================================================================

const outputDir = path.resolve(__dirname, '../apps/website/docs/zh-CN/vseed/api')
const srcDir = path.resolve(__dirname, '../packages/vseed/src')
const tsConfigPath = path.resolve(__dirname, '../packages/vseed/tsconfig.json')

const targets = [
  { name: 'Builder', file: 'builder/builder/builder.ts', kind: 'class' },
  { name: 'registerAll', file: 'builder/register/all.ts', kind: 'function' },
  { name: 'updateAdvanced', file: 'builder/register/custom.ts', kind: 'function' },
  { name: 'updateSpec', file: 'builder/register/custom.ts', kind: 'function' },
  { name: 'registerDarkTheme', file: 'builder/register/theme/dark.ts', kind: 'function' },
  { name: 'registerLightTheme', file: 'builder/register/theme/light.ts', kind: 'function' },
  { name: 'registerCustomTheme', file: 'builder/register/theme/custom.ts', kind: 'function' },
]

// ==================================================================================
// Main Orchestration
// ==================================================================================

function main() {
  // 1. Clean and prepare output directory
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true })
  }
  ensureDir(outputDir)

  // 2. Initialize ts-morph project
  const project = new Project({
    tsConfigFilePath: tsConfigPath,
  })

  // 3. Process each target
  targets.forEach((target) => {
    processTarget(project, target)
  })

  // 4. Generate root files
  generateMetaJsonRecursive(outputDir)

  console.log('API 文档生成完成，目录：', outputDir)
}

function processTarget(project, target) {
  const inputFile = path.join(srcDir, target.file)
  if (!fs.existsSync(inputFile)) {
    console.log(`Skipping ${target.name}: ${inputFile} does not exist.`)
    return
  }

  project.addSourceFileAtPath(inputFile)
  const sourceFile = project.getSourceFileOrThrow(inputFile)

  let content = ''
  let found = false

  if (target.kind === 'class') {
    const classDecl = sourceFile.getClass(target.name)
    if (classDecl) {
      content = generateClassMarkdown(classDecl)
      found = true
    }
  } else if (target.kind === 'function') {
    // Try FunctionDeclaration
    let funcDecl = sourceFile.getFunction(target.name)
    if (funcDecl) {
      content = generateFunctionMarkdown(funcDecl)
      found = true
    } else {
      // Try VariableDeclaration
      const varDecl = sourceFile.getVariableDeclaration(target.name)
      if (varDecl) {
        content = generateVariableFunctionMarkdown(varDecl)
        found = true
      }
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

// ==================================================================================
// Markdown Generation
// ==================================================================================

function generateClassMarkdown(classDecl) {
  const name = classDecl.getName()
  const jsDocs = classDecl.getJsDocs()
  const tags = parseJsDocTags(jsDocs)

  let markdown = `# ${name}\n\n`

  if (tags.description) {
    markdown += `:::note{title=描述}\n${tags.description.join('\n\n')}\n:::\n\n`
  }

  // Properties / Methods
  const members = classDecl.getMembers()

  // Filter for public members
  const publicMembers = members.filter((m) => {
    // Check if it has private/protected modifier
    const modifiers = m.getModifiers ? m.getModifiers() : []
    const isPrivate = modifiers.some(
      (mod) => mod.getKind() === SyntaxKind.PrivateKeyword || mod.getKind() === SyntaxKind.ProtectedKeyword,
    )
    return !isPrivate
  })

  if (publicMembers.length > 0) {
    markdown += `## Members\n\n`

    publicMembers.forEach((member) => {
      if (member.getKind() === SyntaxKind.Constructor) return

      let memberName = ''
      if (member.getName) {
        memberName = member.getName()
      }

      if (!memberName) return

      const memberJsDocs = member.getJsDocs()
      const memberTags = parseJsDocTags(memberJsDocs)

      markdown += `### ${memberName}\n\n`

      let signatureCode = ''

      if (member.getKind() === SyntaxKind.MethodDeclaration) {
        // Method: foo(a: string): void
        // We can get the text of the declaration up to the body
        const text = member.getText()
        const signatureEnd = text.indexOf('{')
        if (signatureEnd !== -1) {
          signatureCode = text.substring(0, signatureEnd).trim()
        } else {
          signatureCode = text
        }
      } else if (member.getKind() === SyntaxKind.GetAccessor) {
        const text = member.getText()
        const signatureEnd = text.indexOf('{')
        if (signatureEnd !== -1) {
          signatureCode = text.substring(0, signatureEnd).trim()
        } else {
          signatureCode = text
        }
      } else if (member.getKind() === SyntaxKind.SetAccessor) {
        const text = member.getText()
        const signatureEnd = text.indexOf('{')
        if (signatureEnd !== -1) {
          signatureCode = text.substring(0, signatureEnd).trim()
        } else {
          signatureCode = text
        }
      } else if (member.getKind() === SyntaxKind.PropertyDeclaration) {
        // Property or Arrow Function Property
        // build = <T extends Spec>(): T => ...
        const initializer = member.getInitializer()
        const typeNode = member.getTypeNode()

        if (
          initializer &&
          (initializer.getKind() === SyntaxKind.ArrowFunction ||
            initializer.getKind() === SyntaxKind.FunctionExpression)
        ) {
          // It is a function property
          // Try to construct signature from type
          // If typeNode exists, use it? No, usually type is inferred or explicit
          // Let's use the type text but format it as a method

          // If explicit type node exists: build: <T>() => T = ...
          // member.getText() is like "build = <T... "

          // Let's try to parse the arrow function
          const arrowFunc = initializer
          const params = arrowFunc
            .getParameters()
            .map((p) => p.getText())
            .join(', ')
          const returnType = arrowFunc.getReturnType().getText(member) // Use context
          const typeParams = arrowFunc
            .getTypeParameters()
            .map((tp) => tp.getText())
            .join(', ')

          let typeParamStr = typeParams ? `<${typeParams}>` : ''

          // Check if it's static
          const isStatic = member.isStatic() ? 'static ' : ''

          signatureCode = `${isStatic}${memberName}${typeParamStr}(${params}): ${returnType}`
        } else {
          // Regular property
          // static _themeMap: ...
          const isStatic = member.isStatic() ? 'static ' : ''
          const type = member.getType().getText(member)
          signatureCode = `${isStatic}${memberName}: ${type}`
        }
      }

      // Clean up the signature code
      signatureCode = cleanType(signatureCode)

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
    })
  }

  return markdown
}

function generateFunctionMarkdown(funcDecl) {
  return generateCommonFunctionMarkdown(funcDecl.getName(), funcDecl)
}

function generateVariableFunctionMarkdown(varDecl) {
  const name = varDecl.getName()
  const initializer = varDecl.getInitializer()
  if (!initializer) return ''

  // We can try to get the signature from the variable declaration
  return generateCommonFunctionMarkdown(name, varDecl)
}

function generateCommonFunctionMarkdown(name, node) {
  let markdown = `# ${name}\n\n`

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

  // Signature
  let signature = ''
  if (node.getKind() === SyntaxKind.FunctionDeclaration) {
    const text = node.getText()
    signature = text.split('{')[0].trim()
  } else if (node.getKind() === SyntaxKind.VariableDeclaration) {
    // export const foo = (a: string) => ...
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
  // Remove import("...").
  let cleaned = text.replace(/import\(".*?"\)\./g, '')

  // Truncate extremely long types (optional, but good for readability)
  // If a type is like { a: ..., b: ... } and extremely long, we might want to truncate
  // But be careful not to break syntax if we are not parsing.
  // For now just cleaning imports is a big win.

  return cleaned
}

// ==================================================================================
// File & Metadata Generation
// ==================================================================================

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

// ==================================================================================
// Utility Helpers
// ==================================================================================

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
      // Special handling for param to include name
      if (tagName === 'param') {
        // The structure of tagText for param is usually "paramName description"
        // We might want to keep it as is
      }
      tags[tagName].push(tagText.trim())
    })
  })
  return tags
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// ==================================================================================
// Script Execution
// ==================================================================================

main()
