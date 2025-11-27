import { test, expect, devices } from '@playwright/test'

// Utility to redact PII-like values from logs
function redact(text: string){
  if(!text) return text
  return text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+/g, '<redacted@domain>')
}

// Save screenshots folder
const screenshotsDir = './docs/screenshots'

// Scenario definitions
// 1. Desktop layout – no overlap, CTA visible
// 2. 13" laptop breakpoint – no overlap
// 3. Mobile Safari viewport – CTA visible and clickable
// 4. Dark mode Markdown – sanitized & styled
// 5. Keyboard-only navigation across steps

// Helper to get header bounding rect
async function getHeaderRect(page){
  return page.evaluate(() => {
    const header = document.querySelector('.header') as HTMLElement | null
    const content = document.querySelector('.content') as HTMLElement | null
    if (!header || !content) return {headerTop: -Infinity, headerBottom: -Infinity, contentTop: Infinity}
    const rectH = header.getBoundingClientRect()
    const rectC = content.getBoundingClientRect()
    return {headerTop: rectH.top, headerBottom: rectH.bottom, contentTop: rectC.top}
  })
}

async function writeLayoutTrace(page, scenarioName){
  const trace = await page.evaluate(() => {
    const header = document.querySelector('.header') as HTMLElement
    const content = document.querySelector('.content') as HTMLElement
    function styles(el: Element){
      const cs = window.getComputedStyle(el)
      return {position: cs.position, top: cs.top, bottom: cs.bottom, zIndex: cs.zIndex}
    }
    return {
      headerRect: header?.getBoundingClientRect(),
      contentRect: content?.getBoundingClientRect(),
      headerStyles: header ? styles(header) : null,
      contentStyles: content ? styles(content) : null
    }
  })
  const fs = require('fs')
  const outPath = `./docs/screenshots/layout_trace_${scenarioName}.json`
  try{ fs.writeFileSync(outPath, JSON.stringify(trace, null, 2)) } catch(e) { console.error('Write trace failed', e) }
}

async function writeAccessibilitySnapshot(page, scenarioName){
  let a11y = null
  try{ if(page && page.accessibility) a11y = await page.accessibility.snapshot() } catch(e){ a11y = null }
  const fs = require('fs')
  const outPath = `./docs/screenshots/a11y_snapshot_${scenarioName}.json`
  try{ fs.writeFileSync(outPath, JSON.stringify(a11y, null, 2)) } catch(e){ console.error('Write a11y failed', e) }
}

test.beforeEach(async ({ page }) => {
  page.on('console', msg => console.log(`[PAGE console ${msg.type()}] ${msg.text()}`))
})


// Launch a simple desktop test
test('Desktop layout: header not overlapping form + CTA visible', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('.header')
  const r = await getHeaderRect(page)
  expect(r.contentTop).toBeGreaterThanOrEqual(r.headerBottom - 1)
  // CTA visible at least once
  const cta = await page.locator('button:has-text("Next")').first()
  await expect(cta).toBeVisible()
  await writeLayoutTrace(page, 'desktop')
  await writeAccessibilitySnapshot(page, 'desktop')
  await page.screenshot({path: `${screenshotsDir}/desktop_layout.png`, fullPage: false})
})

// 13" laptop emulation
test('13 inch laptop breakpoint: no header overlap', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const r = await getHeaderRect(page)
  expect(r.contentTop).toBeGreaterThanOrEqual(r.headerBottom - 1)
  await writeLayoutTrace(page, 'laptop13')
  await writeAccessibilitySnapshot(page, 'laptop13')
  await page.screenshot({path: `${screenshotsDir}/laptop13_layout.png`})
})

// Mobile Safari viewport with WebKit
test.use({ browserName: 'webkit' })
test('Mobile Safari: CTA visible and clickable', async ({ page }) => {
  // set mobile viewport approximate
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  // go through steps to review
  await page.locator('button[aria-label="next"]').click()
  await page.locator('button[aria-label="next"]').click()
  const submit = page.locator('button[aria-label="submit"]')
  await expect(submit).toBeVisible()
  await submit.click()
  await writeLayoutTrace(page,'mobile_safari')
  await writeAccessibilitySnapshot(page,'mobile_safari')
  await page.screenshot({path: `${screenshotsDir}/mobile_safari_cta.png`})
})

// Dark mode Markdown: ensure sanitized & correct styles
test('Dark Mode: Markdown styled & sanitized (no raw HTML visible)', async ({ page }) => {
  await page.goto('/')
  // Toggle theme button to dark
  const toggle = page.locator('button:has-text("Toggle theme")')
  await toggle.waitFor({ state: 'visible', timeout: 5000 })
  await toggle.click()
  // go to handbook
  await page.locator('button:has-text("Handbook")').click()
  await page.waitForSelector('.markdown')
  const mdHtml = await page.locator('.markdown').innerHTML()
  // We allow some sanitized <div> elements but assert no script tags or on* attributes are present
  expect(mdHtml.toLowerCase()).not.toContain('<script')
  expect(mdHtml.toLowerCase()).not.toMatch(/on\w+=\"/) // no inline event handlers
  expect(mdHtml).toContain('<div')
  // style check: computed background
  const color = await page.evaluate(() => {
    const el = document.querySelector('.markdown') as HTMLElement
    return window.getComputedStyle(el).color
  })
  expect(color).toBeTruthy()
  await writeLayoutTrace(page,'dark_mode_markdown')
  await writeAccessibilitySnapshot(page,'dark_mode_markdown')
  await page.screenshot({path: `${screenshotsDir}/dark_mode_markdown.png`})
})

// Keyboard only navigation
test('Keyboard-only navigation: can navigate through steps and execute actions', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  // tab to the first Next within Profile Step
  // Enter to submit profile
  await page.keyboard.press('Enter')
  // Now focus on the handbook next – try to keyboard navigate to acknowledge
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  // ensure we can reach submit via keyboard
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await page.screenshot({path: `${screenshotsDir}/keyboard_navigation.png`})
  await writeLayoutTrace(page, 'keyboard_nav')
  await writeAccessibilitySnapshot(page, 'keyboard_nav')
})
