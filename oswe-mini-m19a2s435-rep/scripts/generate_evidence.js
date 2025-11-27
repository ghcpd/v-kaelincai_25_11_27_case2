const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

(async ()=>{
  const out = path.resolve(__dirname, '..', 'docs')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width:1280, height:800 } })
  await page.goto('http://localhost:5173')
  const dom = await page.content()
  fs.writeFileSync(path.join(out, 'dom_snapshot_1280.html'), dom)
  const vars = await page.evaluate(()=>{
    const computed = getComputedStyle(document.documentElement)
    return Object.fromEntries(Array.from(computed).map(k=>[k, computed.getPropertyValue(k)]))
  })
  fs.writeFileSync(path.join(out, 'css_vars.json'), JSON.stringify(vars, null, 2))
  await browser.close()
  console.log('Evidence generated: dom_snapshot_1280.html and css_vars.json')
})()
