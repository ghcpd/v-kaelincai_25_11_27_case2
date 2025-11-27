const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

const cmd = 'npx playwright test --config=playwright.config.ts'
const buildCmd = 'npm run build:esbuild'
const serveCmd = 'npm run serve:dist'
const axios = require('axios')

async function waitForUrl(url, timeout = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      await axios.get(url)
      return true
    } catch (e) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  return false
}

(async () => {
  console.log('Building dist with esbuild...')
  const b = exec(buildCmd, { cwd: path.resolve(__dirname, '..') })
  b.stdout.on('data', (d) => process.stdout.write(d))
  b.stderr.on('data', (d) => process.stderr.write(d))
  await new Promise((resolve) => b.on('exit', resolve))

  console.log('Serving dist and running UI suite...')

  // find a free port in range 5173..5183
  const ports = Array.from({ length: 11 }, (_, i) => 5173 + i)
  let serverPort = null
  const net = require('net')
  for (const ptest of ports) {
    const server = net.createServer()
    try {
      await new Promise((resolve, reject) => {
        server.once('error', () => reject())
        server.listen(ptest, '127.0.0.1', () => resolve())
      })
      server.close()
      serverPort = ptest
      break
    } catch (e) {
      // in use
    }
  }

  if (!serverPort) {
    console.error('No free port available in 5173..5183')
    process.exit(11)
  }

  const finalServeCmd = `npx http-server ./dist -p ${serverPort} -a 127.0.0.1`
  const dev = exec(finalServeCmd, { cwd: path.resolve(__dirname, '..') })
  dev.stdout.on('data', (d) => process.stdout.write(d))
  dev.stderr.on('data', (d) => process.stderr.write(d))

  const baseUrl = `http://127.0.0.1:${serverPort}`
  console.log('Serving dist on', baseUrl)
  const ok = await waitForUrl(baseUrl)
  if (!ok) {
    console.error('Dist server did not start in time')
    process.exit(10)
  }

  // set base URL for playwright run
  const env = Object.assign({}, process.env)
  env.BASE_URL = baseUrl
  const p = exec(cmd, { cwd: path.resolve(__dirname, '..'), env })
  p.stdout.on('data', (d) => process.stdout.write(d))
  p.stderr.on('data', (d) => process.stderr.write(d))
  p.on('exit', (code) => {
    console.log('Playwright finished with', code)
    // kill dev server
    dev.kill('SIGINT')
    process.exit(code)
  })
})()
