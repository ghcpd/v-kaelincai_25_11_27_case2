const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

async function build() {
  const outdir = path.resolve(__dirname, '..', 'dist')
  if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true })

  // Copy index.html
  const srcIndex = path.resolve(__dirname, '..', 'index.html')
  const destIndex = path.join(outdir, 'index.html')
  fs.copyFileSync(srcIndex, destIndex)

  // Copy CSS files to dist so they are served as static files
  const srcStyle = path.resolve(__dirname, '..', 'src', 'styles.css')
  const destStyle = path.join(outdir, 'styles.css')
  if (fs.existsSync(srcStyle)) fs.copyFileSync(srcStyle, destStyle)

  const srcWizardStyle = path.resolve(__dirname, '..', 'src', 'components', 'Wizard.css')
  const destWizardStyle = path.join(outdir, 'Wizard.css')
  if (fs.existsSync(srcWizardStyle)) fs.copyFileSync(srcWizardStyle, destWizardStyle)

  await esbuild.build({
    entryPoints: [path.resolve(__dirname, '..', 'src', 'main.tsx')],
    bundle: true,
    outfile: path.join(outdir, 'bundle.js'),
    platform: 'browser',
    sourcemap: false,
    minify: false,
    define: { 'process.env.NODE_ENV': '"production"' },
    loader: { '.tsx': 'tsx', '.ts': 'ts' }
  })

  // Inject script and stylesheet link into index.html if not present
  const htmlPath = destIndex
  let html = fs.readFileSync(htmlPath, 'utf8')
  if (!html.includes('/styles.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="/styles.css">\n  <link rel="stylesheet" href="/Wizard.css">\n</head>')
  }
  // remove the original dev module script reference to avoid double loading
  html = html.replace('<script type="module" src="/src/main.tsx"></script>', '')
  if (!html.includes('bundle.js')) {
    html = html.replace('</body>', '<script src="/bundle.js"></script></body>')
  }
  fs.writeFileSync(htmlPath, html)

}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
