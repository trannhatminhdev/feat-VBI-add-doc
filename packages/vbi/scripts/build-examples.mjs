/**
 * Build docs from JSON files
 * Generates MDX documentation for website with preview
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXAMPLES_DIR = path.resolve(__dirname, '../tests/examples')
const OUTPUT_DIR = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vbi/examples')

function findJsonFiles(dir) {
  const files = []
  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files.push(...findJsonFiles(fullPath))
    } else if (item.name.endsWith('.json')) {
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

function generateDocs() {
  console.log('Building docs from JSON files...')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const jsonFiles = findJsonFiles(EXAMPLES_DIR)

  let md = '# VBI Examples\n\n'

  for (const file of jsonFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const json = JSON.parse(content)
    const name = json.name || path.basename(file, '.json')
    const description = json.description || name
    const mockData = generateMockData(json.schema || [])

    md += `## ${name}\n\n`
    md += `${description}\n\n`

    md += '```tsx preview\n'

    // Generate code based on whether code field exists
    if (json.code) {
      // With custom applyBuilder code
      md += "import { VBI } from '@visactor/vbi'\n"
      md += "import { VSeedRender } from '@components'\n"
      md += "import { useEffect, useState } from 'react'\n\n"
      md += 'export default () => {\n'
      md += '  const [vseed, setVSeed] = useState(null)\n\n'
      md += '  useEffect(() => {\n'
      md += '    const run = async () => {\n'
      md += '      const schema = [\n'
      for (const field of json.schema || []) {
        md += `        { name: '${field.name}', type: '${field.type}' },\n`
      }
      md += '      ]\n'
      md += '      const dataset = [\n'
      md += mockData + '\n'
      md += '      ]\n\n'
      md += "      VBI.registerConnector('demo', async () => ({\n"
      md += '        discoverSchema: async () => schema,\n'
      md += '        query: async () => ({ dataset })\n'
      md += '      }))\n\n'
      md += '      const builder = VBI.from({\n'
      md += "        connectorId: 'demo',\n"
      md += `        chartType: ${JSON.stringify(json.dsl?.chartType || 'line')},\n`
      md += `        dimensions: ${JSON.stringify(json.dsl?.dimensions || [])},\n`
      md += `        measures: ${JSON.stringify(json.dsl?.measures || [])},\n`
      md += '        filters: [],\n'
      md += "        theme: 'light',\n"
      md += "        locale: 'zh-CN',\n"
      md += '        version: 1\n'
      md += '      })\n\n'
      // Keep code exactly as is
      md += `      ${json.code}\n`
      md += '      applyBuilder(builder)\n\n'
      md += '      const result = await builder.buildVSeed()\n'
      md += '      setVSeed(result)\n'
      md += '    }\n'
      md += '    run()\n'
      md += '  }, [])\n\n'
      md += '  if (!vseed) return <div>Loading...</div>\n\n'
      md += '  return <VSeedRender vseed={vseed} />\n'
      md += '}\n'
    } else {
      // Simple mode without code
      md += "import { VBIResultRender } from '@components'\n\n"
      md += 'export default () => {\n'
      md += '  const vbiConfig = {\n'
      md += `    name: '${name}',\n`
      md += `    description: '${description}',\n`
      md += '    schema: [\n'
      for (const field of json.schema || []) {
        md += `      { name: '${field.name}', type: '${field.type}' },\n`
      }
      md += '    ],\n'
      md += '    dataset: [\n'
      md += mockData + '\n'
      md += '    ],\n'
      md += `    dsl: ${JSON.stringify(json.dsl || {}, null, 4)},\n`
      md += '  }\n\n'
      md += '  return <VBIResultRender vbiConfig={vbiConfig} />\n'
      md += '}\n'
    }

    md += '```\n\n'
  }

  const outputFile = path.join(OUTPUT_DIR, 'index.mdx')
  fs.writeFileSync(outputFile, md, 'utf-8')
  console.log(`Generated: ${outputFile}`)

  // Generate _meta.json
  const meta = [{ type: 'file', name: 'index', label: 'Examples' }]

  const metaFile = path.join(OUTPUT_DIR, '_meta.json')
  fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2), 'utf-8')
  console.log(`Generated: ${metaFile}`)

  console.log(`Generated docs for ${jsonFiles.length} examples`)
}

generateDocs()
