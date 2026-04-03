import path from 'node:path'
import fs from 'node:fs'
import { pkgDir, readText, lowerFirst } from './shared.mjs'

const hooksIndex = path.resolve(pkgDir, 'src/hooks/index.ts')
const componentsIndex = path.resolve(pkgDir, 'src/components/index.ts')

function resolveSourcePath(indexPath, relativePath) {
  const basePath = path.resolve(path.dirname(indexPath), relativePath)
  if (path.extname(basePath)) {
    return basePath
  }

  const tryTs = `${basePath}.ts`
  const tryTsx = `${basePath}.tsx`
  if (fs.existsSync(tryTs)) {
    return tryTs
  }
  if (fs.existsSync(tryTsx)) {
    return tryTsx
  }
  throw new Error(`[collect-exports] cannot resolve source file for ${relativePath} from ${indexPath}`)
}

function extractFunctionSignature(sourceCode, name) {
  const marker = `export function ${name}`
  const start = sourceCode.indexOf(marker)
  if (start === -1) {
    return `${name}(...)`
  }

  const end = sourceCode.indexOf('{', start)
  if (end === -1) {
    return `${name}(...)`
  }

  const signature = sourceCode
    .slice(start, end)
    .replace(/^export\s+/, '')
    .replace(/^function\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()

  return signature || `${name}(...)`
}

function parseExportIndex(indexPath, group, importPath) {
  const lines = readText(indexPath).split('\n')
  const exports = []
  const exportPattern = /^export\s+\{\s*([A-Za-z_$][\w$]*)\s*\}\s+from\s+'([^']+)'/

  for (const line of lines) {
    if (line.startsWith('export type')) {
      continue
    }
    const match = line.match(exportPattern)
    if (!match) {
      continue
    }

    const [, name, relativePath] = match
    const sourcePath = resolveSourcePath(indexPath, relativePath)
    const signature = extractFunctionSignature(readText(sourcePath), name)
    const slug = group === 'hooks' ? name : lowerFirst(name)
    exports.push({ group, importPath, name, signature, slug, sourcePath })
  }

  return exports
}

export function collectPublicExports() {
  const hooks = parseExportIndex(hooksIndex, 'hooks', '@visactor/vbi-react')
  const components = parseExportIndex(componentsIndex, 'components', '@visactor/vbi-react/components')
  return { hooks, components, all: [...hooks, ...components] }
}
