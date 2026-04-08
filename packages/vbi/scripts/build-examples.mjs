import fs from 'fs'
import path from 'path'
import {
  BUILDER_ORDER,
  DEFAULT_LOCALE,
  EXAMPLES_DIR,
  findJsonFilesInDir,
  findSubDirs,
  formatBuilderLabel,
  formatDirLabel,
  getDirBuilderKind,
  parseDescription,
  parseTags,
  readJsonFile,
  renderPreview,
} from './example-utils.mjs'

const OUTPUT_DIR = path.resolve(EXAMPLES_DIR, '../../../../apps/website/docs/zh-CN/vbi/examples')

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

const resetDir = (dirPath) => {
  fs.rmSync(dirPath, { recursive: true, force: true })
  fs.mkdirSync(dirPath, { recursive: true })
}

const toMetaFile = (name, label) => ({ type: 'file', name, label })

const toMetaDir = (name, label) => ({
  type: 'dir',
  name,
  label,
  collapsible: true,
  collapsed: false,
})

const getActiveDirs = () =>
  findSubDirs(EXAMPLES_DIR).filter((dir) => findJsonFilesInDir(path.join(EXAMPLES_DIR, dir)).length > 0)

const groupDirsByBuilder = (dirs) =>
  BUILDER_ORDER.map((kind) => ({
    kind,
    dirs: dirs.filter((dir) => getDirBuilderKind(dir) === kind),
  })).filter((group) => group.dirs.length > 0)

const shouldRenderBuilderIndexOnly = (group) => group.dirs.length === 1 && group.dirs[0] === group.kind

function generateTagsHtml(tags) {
  if (!tags.length) {
    return ''
  }
  const badges = tags.map((tag) => `\`${tag}\``).join(' ')
  return `\n\n> 标签: ${badges}\n`
}

function generateDirDocs(dirName, locale = DEFAULT_LOCALE, title = dirName) {
  const dirPath = path.join(EXAMPLES_DIR, dirName)
  const jsonFiles = findJsonFilesInDir(dirPath)

  if (!jsonFiles.length) {
    return ''
  }

  let md = `# ${title}\n\n`
  md += `import { registerDemoConnector } from '@components'\n\n`
  md += `{registerDemoConnector()}\n\n`

  for (const file of jsonFiles) {
    const json = readJsonFile(file)
    md += `## ${json.name || path.basename(file, '.json')}\n\n`
    md += `${parseDescription(json, locale)}\n`
    md += `${generateTagsHtml(parseTags(json))}\n\n`
    md += '```tsx preview\n'
    md += `${renderPreview(json)}\n`
    md += '```\n\n'
  }

  return md
}

function resolveExampleLink(group, dirName, exampleName, fromBuilderRoot = false) {
  const base = shouldRenderBuilderIndexOnly(group)
    ? fromBuilderRoot
      ? './'
      : `./${group.kind}`
    : fromBuilderRoot
      ? `./${dirName}`
      : `./${group.kind}/${dirName}`
  return `${base}#${exampleName}`
}

function generateBuilderIndexPage(group, locale = DEFAULT_LOCALE) {
  let md = `# ${formatBuilderLabel(group.kind)}\n\n`
  md += `本页面展示 ${group.kind} builder 的示例。\n\n`

  for (const dir of group.dirs) {
    const examples = findJsonFilesInDir(path.join(EXAMPLES_DIR, dir)).map((file) => {
      const json = readJsonFile(file)
      return {
        name: json.name || path.basename(file, '.json'),
        description: parseDescription(json, locale),
        tags: parseTags(json),
      }
    })

    if (!examples.length) {
      continue
    }

    md += `## ${formatDirLabel(dir)}\n\n| 示例 | 描述 | 标签 |\n| --- | --- | --- |\n`
    md += examples
      .map((example) => {
        const href = resolveExampleLink(group, dir, example.name, true)
        return `| [${example.name}](${href}) | ${example.description} | ${example.tags.join(', ') || '-'} |`
      })
      .join('\n')
    md += '\n\n'
  }

  return md
}

function generateTopIndexPage(groups) {
  let md = '# VBI 示例\n\n本页面展示 VBI 的各种使用示例。\n\n'

  for (const group of groups) {
    const total = group.dirs.reduce((sum, dir) => sum + findJsonFilesInDir(path.join(EXAMPLES_DIR, dir)).length, 0)
    md += `## ${formatBuilderLabel(group.kind)}\n\n`
    md += `共 ${total} 个示例。\n\n`
    md += '| 分类 | 数量 |\n| --- | --- |\n'
    md += group.dirs
      .map(
        (dir) =>
          `| [${formatDirLabel(dir)}](./${group.kind}${shouldRenderBuilderIndexOnly(group) ? '' : `/${dir}`}) | ${findJsonFilesInDir(path.join(EXAMPLES_DIR, dir)).length} |`,
      )
      .join('\n')
    md += '\n\n'
  }

  return md
}

function generateTagsPage(groups) {
  const tagStats = {}
  let total = 0

  for (const group of groups) {
    for (const dir of group.dirs) {
      const files = findJsonFilesInDir(path.join(EXAMPLES_DIR, dir))
      total += files.length
      for (const file of files) {
        for (const tag of parseTags(readJsonFile(file))) {
          tagStats[tag] = (tagStats[tag] || 0) + 1
        }
      }
    }
  }

  const entries = Object.entries(tagStats).sort((a, b) => b[1] - a[1])
  let md = `# 标签\n\n共 ${total} 个示例，${entries.length} 个标签。\n\n`
  md += '| 标签 | 数量 |\n| --- | --- |\n'
  md += entries.map(([tag, count]) => `| ${tag} | ${count} |`).join('\n')
  return md
}

function writeBuilderDocs(group) {
  const builderDir = path.join(OUTPUT_DIR, group.kind)
  ensureDir(builderDir)

  if (shouldRenderBuilderIndexOnly(group)) {
    fs.writeFileSync(
      path.join(builderDir, 'index.mdx'),
      generateDirDocs(group.dirs[0], DEFAULT_LOCALE, formatBuilderLabel(group.kind)),
    )
    fs.writeFileSync(path.join(builderDir, '_meta.json'), JSON.stringify([], null, 2))
    console.log(`Generated: ${group.kind}/index.mdx`)
    return
  }

  fs.writeFileSync(path.join(builderDir, 'index.mdx'), generateBuilderIndexPage(group))
  fs.writeFileSync(
    path.join(builderDir, '_meta.json'),
    JSON.stringify(
      group.dirs.map((dir) => toMetaFile(dir, formatDirLabel(dir))),
      null,
      2,
    ),
  )
  console.log(`Generated: ${group.kind}/index.mdx`)

  for (const dir of group.dirs) {
    fs.writeFileSync(path.join(builderDir, `${dir}.mdx`), generateDirDocs(dir))
    console.log(`Generated: ${group.kind}/${dir}.mdx`)
  }
}

function generateDocs() {
  console.log('Building docs from JSON files...')

  resetDir(OUTPUT_DIR)

  const groups = groupDirsByBuilder(getActiveDirs())

  fs.writeFileSync(
    path.join(OUTPUT_DIR, '_meta.json'),
    JSON.stringify(
      groups.map((group) => toMetaDir(group.kind, formatBuilderLabel(group.kind))),
      null,
      2,
    ),
  )
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.mdx'), generateTopIndexPage(groups))
  fs.writeFileSync(path.join(OUTPUT_DIR, 'tags.mdx'), generateTagsPage(groups))

  let totalExamples = 0
  for (const group of groups) {
    writeBuilderDocs(group)
    totalExamples += group.dirs.reduce((sum, dir) => sum + findJsonFilesInDir(path.join(EXAMPLES_DIR, dir)).length, 0)
  }

  console.log(`\n✅ Successfully generated docs for ${totalExamples} examples in ${groups.length} builder groups`)
}

generateDocs()
