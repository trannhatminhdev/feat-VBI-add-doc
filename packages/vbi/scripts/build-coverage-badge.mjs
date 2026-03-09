#!/usr/bin/env node

/**
 * Generate coverage badge for README.md
 * This script can be run locally to test coverage badge generation
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function getCoverageData() {
  try {
    const coveragePath = join(__dirname, '../coverage/coverage-final.json')

    if (!existsSync(coveragePath)) {
      console.log('coverage-final.json not found, using fallback data')
      return {
        lines: 0,
        statements: 0,
        functions: 0,
        branches: 0,
        color: 'brightgreen',
        badgeUrl: 'https://img.shields.io/badge/Coverage-0%25-red.svg',
      }
    }

    const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'))

    // Calculate totals from coverage-final.json
    let totalStatements = 0
    let coveredStatements = 0
    let totalFunctions = 0
    let coveredFunctions = 0
    let totalBranches = 0
    let coveredBranches = 0

    Object.values(coverage).forEach((file) => {
      if (file.s) {
        Object.values(file.s).forEach((count) => {
          totalStatements++
          if (count > 0) coveredStatements++
        })
      }
      if (file.f) {
        Object.values(file.f).forEach((count) => {
          totalFunctions++
          if (count > 0) coveredFunctions++
        })
      }
      if (file.b) {
        Object.values(file.b).forEach((branch) => {
          branch.forEach((count) => {
            totalBranches++
            if (count > 0) coveredBranches++
          })
        })
      }
    })

    // Use statement coverage as lines coverage approximation
    const linesPct = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0
    const statementsPct = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0
    const functionsPct = totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0
    const branchesPct = totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0

    const getColor = (pct) => {
      if (pct >= 90) return 'brightgreen'
      if (pct >= 80) return 'green'
      if (pct >= 70) return 'yellowgreen'
      if (pct >= 60) return 'yellow'
      if (pct >= 50) return 'orange'
      return 'red'
    }

    return {
      lines: linesPct.toFixed(2),
      statements: statementsPct.toFixed(2),
      functions: functionsPct.toFixed(2),
      branches: branchesPct.toFixed(2),
      color: getColor(linesPct),
      badgeUrl: `https://img.shields.io/badge/Coverage-${linesPct.toFixed(0)}%25-${getColor(linesPct)}.svg`,
    }
  } catch (error) {
    console.error('Error reading coverage data:', error.message)
    return {
      lines: 0,
      statements: 0,
      functions: 0,
      branches: 0,
      color: 'red',
      badgeUrl: 'https://img.shields.io/badge/Coverage-0%25-red.svg',
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updatePackageReadme(coverageData) {
  try {
    const readmePath = join(__dirname, '../README.md')
    if (!existsSync(readmePath)) {
      writeFileSync(readmePath, '# VBI\n\n', 'utf8')
    }
    let readme = readFileSync(readmePath, 'utf8')

    const badgeRegex = /\[!\[Coverage\]\([^)]+\)\]\([^)]+\)/
    const newBadge = `[![Coverage](${coverageData.badgeUrl})](https://github.com/VisActor/VBI/actions/workflows/coverage.yml)`

    if (badgeRegex.test(readme)) {
      readme = readme.replace(badgeRegex, newBadge)
    } else {
      // If no badge exists, insert it after the first header or at the top
      const headerRegex = /(^#\s+.*$)/m
      if (headerRegex.test(readme)) {
        readme = readme.replace(headerRegex, `$1\n\n${newBadge}`)
      } else {
        readme = `${newBadge}\n\n${readme}`
      }
    }

    writeFileSync(readmePath, readme, 'utf8')
    console.log('Package README.md updated successfully')
  } catch (error) {
    console.error('Error updating Package README.md:', error.message)
  }
}

function updateRootReadme(coverageData) {
  try {
    const readmePath = join(__dirname, '../../../README.md')
    if (!existsSync(readmePath)) {
      console.warn('Root README.md not found')
      return
    }
    let readme = readFileSync(readmePath, 'utf8')

    const newBadge = `[![Coverage](${coverageData.badgeUrl})](https://github.com/VisActor/VBI/actions/workflows/coverage.yml)`

    // First try to match row with existing coverage badge
    const rowWithBadgeRegex = /(\|\s*\[vbi\]\([^)]+\)\s*\|[^|]+\|\s*)(\[!\[Coverage\]\([^)]+\)\]\([^)]+\))([^|]+\|)/
    if (rowWithBadgeRegex.test(readme)) {
      readme = readme.replace(rowWithBadgeRegex, `$1${newBadge}$3`)
      writeFileSync(readmePath, readme, 'utf8')
      console.log('Root README.md updated successfully')
      return
    }

    // If no badge exists, match row without badge and add it
    // Match vbi row with empty coverage column (between | |)
    const rowWithoutBadgeRegex = /(\|\s*\[vbi\]\([^)]+\)\s*\|[^|]+\|)(\s*)\|/
    if (rowWithoutBadgeRegex.test(readme)) {
      readme = readme.replace(rowWithoutBadgeRegex, `$1 ${newBadge} |`)
      writeFileSync(readmePath, readme, 'utf8')
      console.log('Root README.md updated successfully')
      return
    }

    console.warn('vbi row not found in Root README table. Check table format.')
  } catch (error) {
    console.error('Error updating Root README.md:', error.message)
  }
}

const coverage = getCoverageData()
console.log('Coverage data:', coverage)
// updatePackageReadme(coverage)
updateRootReadme(coverage)
