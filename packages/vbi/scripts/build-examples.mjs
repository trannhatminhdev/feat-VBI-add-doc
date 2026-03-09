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

const EXAMPLES_DIR = path.resolve(__dirname, '../tests/examples')
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/examples')

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
          return `${field.name}: '${field.name}${i}'`
        } else if (field.type === 'number') {
          return `${field.name}: ${(i + 1) * 100}`
        }
        return `${field.name}: null`
      })
      .join(', ')
    lines.push(`      { ${row} },`)
  }

  return lines.join('\n')
}

/**
 * Generate single example preview code
 */
function generateExamplePreview(json) {
  const mockData = generateMockData(json.schema || [])

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
  code += `        chartType: ${JSON.stringify(json.dsl?.chartType || 'line')},\n`
  code += `        dimensions: ${JSON.stringify(json.dsl?.dimensions || [])},\n`
  code += `        measures: ${JSON.stringify(json.dsl?.measures || [])},\n`
  code += `        whereFilters: ${JSON.stringify(json.dsl?.whereFilters || [])},\n`
  code += `        theme: ${JSON.stringify(json.dsl?.theme || 'light')},\n`
  code += "        locale: 'zh-CN',\n"
  code += '        version: 1\n'
  code += '      })\n\n'
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
 * Generate docs for a directory
 */
function generateDirDocs(dirName) {
  const dirPath = path.join(EXAMPLES_DIR, dirName)
  const jsonFiles = findJsonFilesInDir(dirPath)

  if (jsonFiles.length === 0) return ''

  let md = `# ${dirName}\n\n`

  for (const file of jsonFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const json = JSON.parse(content)
    const name = json.name || path.basename(file, '.json')
    const description = json.description || name

    md += `## ${name}\n\n`
    md += `${description}\n\n`
    md += '```tsx preview\n'
    md += generateExamplePreview(json)
    md += '```\n\n'
  }

  return md
}

function generateDocs() {
  console.log('Building docs from JSON files...')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const subDirs = findSubDirs(EXAMPLES_DIR)

  const meta = []

  for (const dir of subDirs) {
    const label = dir.charAt(0).toUpperCase() + dir.slice(1).replace(/-/g, ' ')
    meta.push({ type: 'file', name: dir, label })
  }

  // Write _meta.json
  fs.writeFileSync(path.join(OUTPUT_DIR, '_meta.json'), JSON.stringify(meta, null, 2), 'utf-8')
  console.log('Generated: _meta.json')

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

  console.log(`Generated docs for ${totalExamples} examples in ${subDirs.length} categories`)
}

generateDocs()
