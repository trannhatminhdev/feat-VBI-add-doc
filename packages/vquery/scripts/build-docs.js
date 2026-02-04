import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const examplesDir = path.resolve(__dirname, '../tests/examples')
const outputDir = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vquery/examples')

// Map<category, Array<{name, description, content}>>
const examplesMap = new Map()

function scanDir(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`)
    return
  }

  const files = fs.readdirSync(dir, { withFileTypes: true })

  // Sort files to ensure consistent order
  files.sort((a, b) => a.name.localeCompare(b.name))

  for (const file of files) {
    const res = path.resolve(dir, file.name)
    if (file.isDirectory()) {
      scanDir(res)
    } else if (file.name.endsWith('.json')) {
      processJson(res)
    }
  }
}

function processJson(jsonPath) {
  try {
    const content = fs.readFileSync(jsonPath, 'utf-8')
    const json = JSON.parse(content)

    // Determine category from parent directory name
    const parentDir = path.dirname(jsonPath)
    const category = path.basename(parentDir)

    // Skip if directly in examples root (optional, depending on structure)
    if (path.resolve(parentDir) === examplesDir) {
      return
    }

    if (!examplesMap.has(category)) {
      examplesMap.set(category, [])
    }

    examplesMap.get(category).push({
      fileName: path.basename(jsonPath),
      json,
    })
  } catch (error) {
    console.error(`Error processing ${jsonPath}:`, error)
  }
}

function generateDocs() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const sortedCategories = Array.from(examplesMap.keys()).sort()

  for (const category of sortedCategories) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1)
    const outputFile = path.join(outputDir, `${category}.mdx`)

    let md = `# ${categoryTitle}\n\n`

    const examples = examplesMap.get(category)
    for (const example of examples) {
      const { json, fileName } = example
      const title = json.description || fileName.replace('.json', '')

      md += `## ${title}\n\n`

      md += '```tsx preview\n'
      md += "import { VQueryResultRender } from '@components'\n\n"
      md += `export default () => {\n`
      const jsonString = JSON.stringify(json, null, 2)
      const indentedJson = jsonString
        .split('\n')
        .map((line, index) => {
          return index === 0 ? line : '  ' + line
        })
        .join('\n')
      md += `  const vqueryConfig = ${indentedJson}\n\n`
      md += `  return <VQueryResultRender vqueryConfig={vqueryConfig} />\n`
      md += `}\n`
      md += '```\n\n'
    }

    fs.writeFileSync(outputFile, md, 'utf-8')
    console.log(`Generated documentation for ${category} at ${outputFile}`)
  }
}

console.log('Building documentation...')
scanDir(examplesDir)
generateDocs()
console.log('Done.')
