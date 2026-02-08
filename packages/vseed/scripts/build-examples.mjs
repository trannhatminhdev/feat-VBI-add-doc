import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const examplesDir = path.resolve(__dirname, '../tests/examples')
const outputDir = path.resolve(__dirname, '../../../apps/website/docs/zh-CN/vseed/examples')

// Map<category, Array<{name, description, vseed}>>
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

    // Validate required fields
    // "json配置应该保护 name、description、vseed 3个属性配置"
    if (!json.name || !json.description || !json.vseed) {
      console.warn(`Skipping ${jsonPath}: Missing name, description, or vseed`)
      return
    }

    // Determine category from relative path
    const parentDir = path.dirname(jsonPath)
    const category = path.relative(examplesDir, parentDir)

    // Skip if directly in examples root
    if (!category) {
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
    const categoryName = path.basename(category)
    const categoryTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    const outputFile = path.join(outputDir, `${category}.mdx`)

    const outputParentDir = path.dirname(outputFile)
    if (!fs.existsSync(outputParentDir)) {
      fs.mkdirSync(outputParentDir, { recursive: true })
    }

    let md = `# ${categoryTitle}\n\n`

    const examples = examplesMap.get(category)
    for (const example of examples) {
      const { json, fileName } = example
      const title = json.name || fileName.replace('.json', '')

      md += `## ${title}\n\n`

      if (json.description) {
        md += `${json.description}\n\n`
      }

      md += '```tsx preview \n'
      md += "import { VSeedRender } from '@components'\n\n"
      md += `export default () => {\n`
      // We pass only the vseed part of the JSON to the component
      const vseedString = JSON.stringify(json.vseed, null, 2)
      md += `  const vseedConfig = ${vseedString}\n\n`
      md += `  return <VSeedRender vseed={vseedConfig} />\n`
      md += `}\n`
      md += '```\n\n'
    }

    fs.writeFileSync(outputFile, md, 'utf-8')
    console.log(`Generated documentation for ${category} at ${outputFile}`)
  }
}

function generateMeta() {
  // Generate _meta.json based on generated files/directories
  // This simplistic approach assumes we just want to list the categories
  // But usually we want a recursive meta generation if we have nested categories.
  // Given "examples/[feature]/xxx.json", categories are likely top-level features.
  // But let's look at vquery implementation.
  // VQuery implementation hardcoded some meta or generated it.
  // VQuery impl:
  /*
  const meta = [
    { type: 'dir', name: 'select', label: 'Select' },
    ...
  ]
  */
  // I should probably generate it dynamically based on sortedCategories

  const chartTypeOrder = [
    'table',
    'pivotTable',
    'line',
    'column',
    'columnPercent',
    'columnParallel',
    'bar',
    'barPercent',
    'barParallel',
    'area',
    'areaPercent',
    'scatter',
    'dualAxis',
    'rose',
    'roseParallel',
    'pie',
    'donut',
    'radar',
    'raceBar',
    'raceColumn',
    'raceScatter',
    'heatmap',
    'funnel',
    'boxPlot',
    'histogram',
  ]

  const sortedCategories = Array.from(examplesMap.keys()).sort((a, b) => {
    const nameA = path.basename(a)
    const nameB = path.basename(b)

    // Normalize casing for boxPlot/boxplot
    const normalize = (name) => (name.toLowerCase() === 'boxplot' ? 'boxPlot' : name)

    const indexA = chartTypeOrder.indexOf(normalize(nameA))
    const indexB = chartTypeOrder.indexOf(normalize(nameB))

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    return nameA.localeCompare(nameB)
  })

  const meta = sortedCategories.map((cat) => {
    // Assuming flat structure for now as per requirements "examples/[feature]/xxx.json"
    // If nested, we might need more complex logic.
    // cat could be "column" or "bar/stacked" if nested.
    // If strictly "examples/[feature]/xxx.json", cat is "feature".
    const name = path.basename(cat)
    const label = name.charAt(0).toUpperCase() + name.slice(1)
    return {
      type: 'file', // it's a file because we generate `${category}.mdx`
      name: name,
      label: label,
    }
  })

  // However, vquery example showed:
  // { type: 'dir', name: 'select', label: 'Select' }
  // But vquery generated `${category}.mdx`. Wait.
  // VQuery script: `const outputFile = path.join(outputDir, `${category}.mdx`)`
  // If `category` is a directory name, then creating a file with same name.mdx works.
  // But usually in Nextra/Rspress, if you have a folder, you use type: 'dir'. If you have a file, type: 'file'.
  // VQuery generated .mdx files for categories. So they are files in the outputDir.
  // So type: 'file' is correct for the top level list in `_meta.json`.

  const metaPath = path.join(outputDir, '_meta.json')
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')
  console.log(`Generated _meta.json at ${metaPath}`)
}

console.log('Building examples documentation...')
scanDir(examplesDir)
generateDocs()
generateMeta()
console.log('Done.')
