const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const env = Object.assign({}, process.env)

// start vite dev server first
console.log('Starting vite dev server...')
const viteDir = path.resolve(__dirname, '..')
const vite = exec('npx vite', { env, cwd: viteDir })
let server = null
vite.stdout.on('data', d => console.log('[vite]', d.toString().trim()))
vite.stderr.on('data', d => console.error('[vite]', d.toString().trim()))

// Wait for dev server to become available (poll), up to 30s
function waitForUrl(url, timeoutMs = 30000){
  const https = require('http')
  return new Promise((resolve, reject) => {
    const start = Date.now()
    function check(){
      https.get(url, (res) => {
        resolve()
      }).on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('Timeout waiting for server '+url))
        setTimeout(check, 500)
      })
    }
    check()
  })
}

waitForUrl('http://localhost:5174').then(() => {
  console.log('Dev server is up; starting mock API...')
  // start mock server
  server = exec('node ./mocks/server.js', { env, cwd: viteDir })
  server.stdout.on('data', d => console.log('[mock]', d.toString().trim()))
  server.stderr.on('data', d => console.error('[mock]', d.toString().trim()))

  console.log('Running Playwright tests')
  const test = exec('npx playwright test --reporter=json', { env })
  test.stdout.on('data', d => console.log('[pw]', d.toString()))
  test.stderr.on('data', d => console.error('[pw]', d.toString()))
  test.on('exit', code => {
    console.log('Tests completed with code', code)
    // Attempt to read the json reporter output
    const reports = 'playwright-report'
    try{
      if (fs.existsSync('playwright-report')){
        console.log('Playwright report generated in playwright-report/');
      }
    }catch(e){}
    // gather screenshots summary
    const screenshotsDir = path.resolve(__dirname, '..', 'docs', 'screenshots')
    if (fs.existsSync(screenshotsDir)){
      console.log('Screenshots:')
      fs.readdirSync(screenshotsDir).forEach(f => console.log(f))
    }
    // kill mock server
    server.kill()
    vite.kill()
    process.exit(code)
  })
}).catch(err => { console.error('Error waiting for dev server', err); process.exit(1) })
