/**
 * Build tests from JSON files
 * Scans tests/examples/ directory and generates .test.ts files
 * JSON format:
 * {
 *   "name": "test-name",
 *   "description": "Test description",
 *   "schema": [{ "name": "field1", "type": "string" }, ...],
 *   "dsl": { chartType, dimensions, measures },
 *   "code": "const applyBuilder = (builder) => { ... }"
 * }
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXAMPLES_DIR = path.resolve(__dirname, '../tests/examples')

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
  const lines = ['const mockData = [']
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
    lines.push(`  { ${row} },`)
  }

  lines.push(']')
  return lines.join('\n')
}

/**
 * Generate connector setup from schema
 */
function generateConnectorSetup(connectorId, schema) {
  const schemaLines = schema.map((f) => `      { name: '${f.name}', type: '${f.type}' }`).join(',\n')

  return `VBI.registerConnector('${connectorId}', async () => {
    return {
      discoverSchema: async () => [
${schemaLines}
      ],
      query: async () => ({ dataset: mockData })
    }
  })`
}

/**
 * Generate test file from JSON
 */
function generateTestFile(jsonPath) {
  const content = fs.readFileSync(jsonPath, 'utf-8')
  const json = JSON.parse(content)

  const name = json.name || path.basename(jsonPath, '.json')
  const description = json.description || name
  const schema = json.schema || []

  // Generate mock data and connector setup
  const mockData = generateMockData(schema)
  const connectorSetup = generateConnectorSetup('test-connector', schema)

  // Generate initial DSL
  const dsl = {
    connectorId: 'test-connector',
    chartType: json.chartType || 'line',
    dimensions: json.dimensions || [],
    measures: json.measures || [],
    filters: [],
    theme: 'light',
    locale: 'zh-CN',
    version: 1,
    ...json.dsl,
  }

  const dslLines = JSON.stringify(dsl, null, 2).split('\n')
  const dslCode = dslLines.map((line, i) => (i === 0 ? line : '    ' + line)).join('\n')

  // Generate applyBuilder code
  const applyBuilderCode = json.code || ''

  const template = `import { VBI, VBIBuilder } from '@visactor/vbi'

${mockData}

describe('${description}', () => {
  beforeAll(async () => {
    ${connectorSetup}
  })

  it('${name}', async () => {
    const builder = VBI.from(${dslCode})

    // Apply custom builder code
    ${applyBuilderCode}
    applyBuilder(builder)

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot('vbi-dsl')

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot('vquery-dsl')

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot('vseed-dsl')
  })
})
`

  const dirPath = path.dirname(jsonPath)
  const testFileName = path.basename(jsonPath).replace('.json', '.test.ts')
  const testPath = path.join(dirPath, testFileName)

  fs.writeFileSync(testPath, template, 'utf-8')
  console.log(`Generated: ${testPath}`)
}

function buildTests() {
  console.log('Building tests from JSON files...')

  // Clean old test files
  const items = fs.readdirSync(EXAMPLES_DIR, { withFileTypes: true })
  for (const item of items) {
    if (item.isFile() && item.name.endsWith('.test.ts')) {
      const testPath = path.join(EXAMPLES_DIR, item.name)
      fs.unlinkSync(testPath)
      console.log(`Removed: ${testPath}`)
    }
  }

  // Generate new test files
  const jsonFiles = findJsonFiles(EXAMPLES_DIR)
  for (const jsonFile of jsonFiles) {
    generateTestFile(jsonFile)
  }

  console.log(`Generated ${jsonFiles.length} test files`)
}

buildTests()
