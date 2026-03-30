import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)
export const pkgDir = path.resolve(__dirname, '..')
export const repoDir = path.resolve(pkgDir, '../..')

export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

export function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
}

export function writeJson(filePath, value) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

export function ensureCleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true })
  fs.mkdirSync(dirPath, { recursive: true })
}

export function lowerFirst(input) {
  if (!input) {
    return input
  }
  return `${input[0].toLowerCase()}${input.slice(1)}`
}
