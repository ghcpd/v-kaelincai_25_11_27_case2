import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const casesPath = path.join(__dirname, 'ui', 'ui_cases.yaml')
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots')
const summaryPath = path.join(rootDir, 'test-results', 'ui_summary.json')

const cases = YAML.parse(fs.readFileSync(casesPath, 'utf-8')).cases

function runPlaywright() {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32'
    const cmd = isWin ? 'cmd' : 'npx'
    const args = isWin
      ? ['/c', 'npx', 'playwright', 'test', '--config=playwright.config.ts']
      : ['playwright', 'test', '--config=playwright.config.ts']
    const proc = spawn(cmd, args, {
      cwd: rootDir,
      stdio: 'inherit',
      shell: false,
    })
    proc.on('exit', (code) => {
      if (code === 0) return resolve(0)
      reject(new Error(`Playwright exited with code ${code}`))
    })
  })
}

function verifyScreenshots() {
  const results = []
  for (const c of cases) {
    const expected = path.join(screenshotsDir, c.screenshot)
    const exists = fs.existsSync(expected)
    results.push({ id: c.id, screenshot: c.screenshot, exists })
  }
  return results
}

async function main() {
  try {
    await runPlaywright()
  } catch (err) {
    console.error('Playwright run failed:', err)
  }

  const screenshots = verifyScreenshots()
  const summary = {
    timestamp: new Date().toISOString(),
    screenshots,
  }
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true })
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8')

  const missing = screenshots.filter((s) => !s.exists)
  if (missing.length) {
    console.warn('Missing screenshots:', missing.map((m) => m.screenshot).join(', '))
    process.exitCode = 1
  }
}

main()
