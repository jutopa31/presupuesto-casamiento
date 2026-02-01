import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packagePath = path.join(root, 'package.json')
const versionPath = path.join(root, 'src', 'version.ts')
const changelogPath = path.join(root, 'CHANGELOG.md')

const bumpType = process.argv[2] ?? 'patch'
const today = new Date().toISOString().slice(0, 10)

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
const currentVersion = packageJson.version

function bumpVersion(version, type) {
  const [major, minor, patch] = version.split('.').map((value) => Number(value))
  if (!Number.isFinite(major) || !Number.isFinite(minor) || !Number.isFinite(patch)) {
    throw new Error(`Version invalida: ${version}`)
  }

  if (type === 'major') return `${major + 1}.0.0`
  if (type === 'minor') return `${major}.${minor + 1}.0`
  if (type === 'patch') return `${major}.${minor}.${patch + 1}`

  throw new Error(`Tipo de version no soportado: ${type}`)
}

const nextVersion = bumpVersion(currentVersion, bumpType)
packageJson.version = nextVersion
fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)

fs.writeFileSync(versionPath, `export const APP_VERSION = '${nextVersion}'\n`)

const existingChangelog = fs.existsSync(changelogPath)
  ? fs.readFileSync(changelogPath, 'utf8')
  : '# Changelog\n\n'

const entryHeader = `## ${nextVersion} - ${today}`
const entry = `${entryHeader}\n- Pendiente de documentar.\n\n`

let updatedChangelog = existingChangelog
if (!existingChangelog.includes(entryHeader)) {
  updatedChangelog = existingChangelog.replace(
    /^# Changelog\\n\\n/,
    `# Changelog\n\n${entry}`,
  )
}

fs.writeFileSync(changelogPath, updatedChangelog)

console.log(`Version actualizada: ${currentVersion} -> ${nextVersion}`)
