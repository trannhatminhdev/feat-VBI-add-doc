import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TESTS_DIR = path.resolve(__dirname, '../tests/examples')

// Recursive function to find dsl.json files
function findDslFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findDslFiles(filePath, fileList)
    } else if (file === 'dsl.json') {
      fileList.push(filePath)
    }
  })

  return fileList
}

function generateTestContent(dsl) {
  const { dataset, cases } = dsl

  const datasetSetup = `
    const vquery = new VQuery()
    const datasetId = '${dataset.id}'

    const rawDataset = ${JSON.stringify(dataset.data, null, 2)}

    if (await vquery.hasDataset(datasetId)) {
      await vquery.dropDataset(datasetId)
    }

    const schema: DatasetColumn[] = ${JSON.stringify(dataset.schema, null, 2)}
    const datasetSource: RawDatasetSource = { type: 'json', rawDataset }
    await vquery.createDataset(datasetId, schema, datasetSource)
    
    const dataset = await vquery.connectDataset(datasetId)
`

  const testCases = cases
    .map((testCase, index) => {
      const { name, query, assertions } = testCase

      let assertionsCode = ''
      if (assertions) {
        assertionsCode = assertions
          .map((assertion) => {
            if (assertion.type === 'length') {
              return `    expect(result${index}.dataset).toHaveLength(${assertion.value})`
            } else if (assertion.type === 'value') {
              return `    expect(result${index}.dataset[${assertion.row}]['${assertion.field}'] as unknown).toBe(${assertion.value})`
            } else if (assertion.type === 'datePart') {
              if (assertion.part === 'year') {
                return `    expect(new Date(result${index}.dataset[${assertion.row}]['${assertion.field}'] as unknown as string).getFullYear()).toBe(${assertion.value})`
              } else if (assertion.part === 'month') {
                return `    expect(new Date(result${index}.dataset[${assertion.row}]['${assertion.field}'] as unknown as string).getMonth()).toBe(${assertion.value})`
              }
            }
            return ''
          })
          .join('\n')
      }

      return `
    // ${name}
    const query${index}: VQueryDSL<{ [key: string]: any }> = ${JSON.stringify(query, null, 2)}
    const result${index} = await dataset.query(query${index})
${assertionsCode}
`
    })
    .join('\n')

  return `/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatasetColumn, RawDatasetSource, VQueryDSL } from '@visactor/vquery'
import { VQuery } from '@visactor/vquery'

describe('Generated VQuery Tests', () => {
  it('runs generated tests from dsl.json', async () => {
${datasetSetup}
${testCases}

    await dataset.disconnect()
    await vquery.close()
  })
})
`
}

function build() {
  const dslFiles = findDslFiles(TESTS_DIR)

  dslFiles.forEach((dslFile) => {
    try {
      const dslContent = fs.readFileSync(dslFile, 'utf-8')
      const dsl = JSON.parse(dslContent)

      const testContent = generateTestContent(dsl)
      const testFilePath = dslFile.replace('dsl.json', 'date-trunc.test.ts')

      fs.writeFileSync(testFilePath, testContent)
      console.log(`Generated ${testFilePath}`)
    } catch (error) {
      console.error(`Error processing ${dslFile}:`, error)
    }
  })
}

build()
