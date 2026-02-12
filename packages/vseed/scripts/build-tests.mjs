import fs from 'fs/promises'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const rootDir = path.resolve(__dirname, '../')

async function generateTests() {
  try {
    const testsRoots = [
      path.join(rootDir, './tests/integrations'),
      path.join(rootDir, './tests/examples')
    ]

    // Helper: Recursively find all JSON files
    async function findAllJsonFiles(dir) {
      let results = []
      const list = await fs.readdir(dir, { withFileTypes: true })
      for (const entry of list) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
           if (entry.name === '__snapshots__') {
            await fs.rm(fullPath, { recursive: true, force: true })
            // console.log(`Removed directory: ${fullPath}`)
          } else {
            results = results.concat(await findAllJsonFiles(fullPath))
          }
        } else if (entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'tsconfig.json') {
          results.push(fullPath)
        }
      }
      return results
    }

    // Helper: Recursively delete all .test.ts files
    async function deleteAllTestFiles(dir) {
      const list = await fs.readdir(dir, { withFileTypes: true })
      for (const entry of list) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          await deleteAllTestFiles(fullPath)
        } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
          await fs.unlink(fullPath)
          // console.log(`Deleted: ${fullPath}`)
        }
      }
    }

    // Process each root directory (integrations, examples)
    for (const rootPath of testsRoots) {
      if (
        !(await fs
          .access(rootPath)
          .then(() => true)
          .catch(() => false))
      ) {
        console.warn(`Directory not found: ${rootPath}`)
        continue
      }

      // Get direct subdirectories (Groups)
      const groups = await fs.readdir(rootPath, { withFileTypes: true })
      
      for (const group of groups) {
        if (!group.isDirectory()) continue
        
        const groupPath = path.join(rootPath, group.name)
        const groupName = group.name

        // 1. Find all JSON files recursively in this group
        const jsonFiles = await findAllJsonFiles(groupPath)
        
        if (jsonFiles.length === 0) continue

        // 2. Delete ALL existing .test.ts files in this group
        await deleteAllTestFiles(groupPath)

        // 3. Generate ONE test file for the group
        await generateGroupTestFile(groupPath, groupName, jsonFiles)
      }
    }

    async function generateGroupTestFile(dir, groupName, jsonFiles) {
      // Sort files to ensure deterministic order
      jsonFiles.sort()

      const imports = jsonFiles
        .map((file, index) => {
          // Calculate relative path from group directory to json file
          const relativePath = path.relative(dir, file)
          // Ensure path starts with ./ if it's in the same directory or subdirectory
          const importPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`
          return `import config_${index} from '${importPath}'`
        })
        .join('\n')

      const cases = jsonFiles
        .map((file, index) => {
          // Use a unique name for the test case, e.g., relative path without extension
          const relativePath = path.relative(dir, file)
          const name = relativePath.replace(/\.json$/, '')
          return `{ name: '${name}', vseed: config_${index} }`
        })
        .join(',\n  ')

      const testContent = `import type { VSeed } from '@visactor/vseed'
import { Builder, registerAll } from '@visactor/vseed'
${imports}

const cases = [
  ${cases}
]

describe('${groupName}', () => {
  cases.forEach(({ name, vseed }) => {
    test(name, () => {
      registerAll()
      const { vseed: vseedConfig } = vseed as { vseed: unknown }
      const builder = Builder.from(vseedConfig as VSeed)
      const advanced = builder.buildAdvanced()
      
      expect(advanced).toBeDefined()
      expect(advanced).not.toBeNull()
      
      const spec = builder.buildSpec(advanced!)
      
      expect(spec).toBeDefined()
      expect(spec).not.toBeNull()
      
      // Verify builder methods return valid results
      expect(builder.getColorIdMap()).toBeDefined()
      expect(builder.getColorItems()).toBeDefined()
      expect(Builder.getAdvancedPipeline(builder.vseed.chartType)).toBeDefined()
      expect(Builder.getSpecPipeline(builder.vseed.chartType)).toBeDefined()
      expect(Builder.getTheme(builder.vseed.theme)).toBeDefined()
      expect(Builder.getThemeMap()).toBeDefined()
    });
  });
});
`
      const testFilePath = path.join(dir, `${groupName}.test.ts`)
      await fs.writeFile(testFilePath, testContent)
      console.log(`Generated aggregated test file: ${testFilePath}`)
    }

    console.log('Test generation complete.')

  } catch (err) {
    console.error('Error generating tests:', err)
    process.exit(1)
  }
}

generateTests()
