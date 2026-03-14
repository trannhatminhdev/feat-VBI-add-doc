/**
 * Build tests from JSON files
 * Generates .test.ts files organized by directory
 * Each directory becomes one test file with multiple test cases
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EXAMPLES_DIR = path.resolve(__dirname, '../tests/examples')

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
 * Generate test case for a single JSON example
 */
function generateTestCase(json, jsonPath) {
  const name = json.name || path.basename(jsonPath, '.json')
  const { whereFilters, whereFilter, havingFilter, ...restDSL } = json.dsl || {}

  // Generate initial DSL
  const dsl = {
    connectorId: 'demoSupermarket',
    chartType: json.chartType || 'line',
    dimensions: restDSL.dimensions || [],
    measures: restDSL.measures || [],
    whereFilter: whereFilter || {
      op: 'and',
      conditions: whereFilters || [],
    },
    havingFilter: havingFilter || {
      op: 'and',
      conditions: [],
    },
    theme: restDSL.theme || 'light',
    locale: 'zh-CN',
    version: 1,
    ...restDSL,
  }

  const dslLines = JSON.stringify(dsl, null, 2).split('\n')
  const dslCode = dslLines.map((line, i) => (i === 0 ? line : '      ' + line)).join('\n')

  // Generate applyBuilder code - use JSON code directly or empty function
  const hasCode = !!json.code
  const applyBuilderCode = hasCode ? json.code : 'const applyBuilder = (builder: any) => {}'
  const applyBuilderCall = hasCode ? 'applyBuilder(builder)' : ''

  return `
  it('${name}', async () => {
    const builder = VBI.from(${dslCode})

    // Apply custom builder code
    ${applyBuilderCode}
    ${applyBuilderCall}

    // Build VBI DSL
    const vbiDSL = builder.build()
    expect(vbiDSL).toMatchInlineSnapshot()

    // Build VQuery DSL
    const vQueryDSL = builder.buildVQuery()
    expect(vQueryDSL).toMatchInlineSnapshot()

    // Build VSeed DSL
    const vSeedDSL = await builder.buildVSeed()
    expect(vSeedDSL).toMatchInlineSnapshot()
  })`
}

/**
 * Generate test file for a directory
 */
function generateTestFile(dirName, testsDir) {
  const dirPath = path.join(EXAMPLES_DIR, dirName)
  const jsonFiles = findJsonFilesInDir(dirPath)

  if (jsonFiles.length === 0) return null

  // Generate test cases
  const testCases = jsonFiles
    .map((jsonPath) => {
      const content = fs.readFileSync(jsonPath, 'utf-8')
      const json = JSON.parse(content)
      return generateTestCase(json, jsonPath, testsDir)
    })
    .join('\n')

  // Calculate relative path to demoConnector for the main describe block
  const relativePath = path.relative(dirPath, testsDir)
  const connectorImport = relativePath === '' ? "'./demoConnector'" : `'${relativePath}/demoConnector'`

  // Convert directory name to label (e.g., chartType -> Chart Type)
  const label = dirName.charAt(0).toUpperCase() + dirName.slice(1).replace(/-/g, ' ')

  const template = `import { VBI, VBIBuilder } from '@visactor/vbi'
import { registerDemoConnector } from ${connectorImport}

describe('${label}', () => {
  beforeAll(async () => {
    registerDemoConnector()
  })
${testCases}
})
`

  const testFileName = `${dirName}.test.ts`
  const testPath = path.join(dirPath, testFileName)

  fs.writeFileSync(testPath, template, 'utf-8')
  console.log(`Generated: ${testPath}`)

  return testPath
}

function buildTests() {
  console.log('Building tests from JSON files...')

  const testsDir = path.resolve(__dirname, '../tests')
  const subDirs = findSubDirs(EXAMPLES_DIR)

  // Generate test files for each directory
  let totalTests = 0
  for (const dir of subDirs) {
    const testPath = generateTestFile(dir, testsDir)
    if (testPath) {
      const jsonFiles = findJsonFilesInDir(path.join(EXAMPLES_DIR, dir))
      totalTests += jsonFiles.length
    }
  }

  console.log(`Generated test files for ${totalTests} examples in ${subDirs.length} categories`)
}

buildTests()
