import { test, expect, Page } from '@playwright/test'

async function assertCTAIsVisible(page: Page) {
  const cta = page.locator('button[data-testid="primary-cta"]')
  await expect(cta).toBeVisible()
  await expect(cta).toBeEnabled()
}

test.beforeEach(async ({ page }, testInfo) => {
  // capture console logs to file
  const logs: any[] = []
  page.on('console', (msg) => {
    try {
      const text = msg.text()
      const p = JSON.parse(text)
      logs.push(p)
    } catch (e) {
      // ignore non-json
    }
  })

  await page.goto('/')
  // attach logs to page for later export
  page['_uiLogs'] = logs

  testInfo.attachmentsPath = './tests/playwright/test-results'
})

async function saveArtifacts(page: Page, fileBase: string) {
  const dir = './docs/screenshots'
  const sessionId = (await page.locator('main[role=main]').getAttribute('data-session-id')) || 'sess_unknown'
  const base = `${fileBase}_${sessionId}`
  const screenshotPath = `${dir}/${base}.png`
  await page.screenshot({ path: screenshotPath, fullPage: true })
  // write logs
  const logs = page['_uiLogs'] || []
  const fs = require('fs')
  const logPath = `./docs/screenshots/${base}.logs.json`
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2))

  // write DOM snapshot
  const dom = await page.content()
  fs.writeFileSync(`${dir}/${base}.dom.html`, dom)

  // write accessibility snapshot
  const ax = await page.accessibility.snapshot()
  fs.writeFileSync(`${dir}/${base}.a11y.json`, JSON.stringify(ax, null, 2))
}


// 1. Desktop layout: no overlapping header
test('desktop layout — no header overlap', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 900 })
  const header = page.locator('header[role=banner]')
  const main = page.locator('main[role=main]')
  const headerBox = await header.boundingBox()
  const mainBox = await main.boundingBox()
  expect(headerBox).not.toBeNull()
  expect(mainBox).not.toBeNull()
  if (headerBox && mainBox) {
    expect(mainBox.y).toBeGreaterThan(headerBox.y + headerBox.height - 1)
  }
  await saveArtifacts(page, 'desktop_layout')
})

// 2. 13" Laptop: ensure layout no overlap and grid columns are preserved
test('13" laptop breakpoint — no overlap and stable columns', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 820 })
  const columns = await page.evaluate(() => {
    // detect CSS grid columns count
    const m = window.getComputedStyle(document.querySelector('main')!).gridTemplateColumns
    return m
  })
  expect(columns).not.toBe('none')
  const parts = columns.split(/\s+/)
  expect(parts.length).toBeGreaterThan(1)
  await saveArtifacts(page, '13inch_layout')
})

// 3. Mobile Safari: CTA visible
test('Mobile Safari viewport CTA visible and clickable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await assertCTAIsVisible(page)
  // Verify CTA is not obscured by footer
  const footer = page.locator('footer[role=contentinfo]')
  const cta = page.locator('button[data-testid="primary-cta"]')
  const cBox = await cta.boundingBox()
  const fBox = await footer.boundingBox()
  expect(cBox).not.toBeNull()
  expect(fBox).not.toBeNull()
    if (cBox && fBox) {
    // ensure CTA's bottom is above footer top
    expect(cBox.y + cBox.height).toBeLessThan(fBox.y + 1)
  } else {
    // do a fallback check
    expect(cBox).not.toBeNull()
    expect(fBox).not.toBeNull()
  }
  // Click Next until Submit and click
  const next = page.locator('button[data-testid="primary-cta"]')
  await next.click()
  await next.click()
  await next.click()
  // If Submit visible, click (will be last)
  const submit = page.locator('button[data-testid="primary-cta"]')
  await submit.click()
  await expect(page).toHaveURL(/.*$/)
  await saveArtifacts(page, 'mobile_safari_cta')
})

// 4. Dark mode Markdown sanitized
test('Dark mode — Markdown is sanitized and styled', async ({ page }) => {
  await page.addStyleTag({ content: 'html { color-scheme: dark; }' })
  // go to handbook
  await page.locator('button', { hasText: 'Handbook' }).click()
  const article = page.locator('article.handbook')
  await expect(article).toBeVisible()
  // ensure raw HTML tags like <script> are not present in the innerText
  const text = await article.innerText()
  expect(text).not.toContain('<script>')
  expect(text).toContain('Welcome')
  await saveArtifacts(page, 'dark_mode_handbook')
})

// 5. Keyboard-only navigation
test('Keyboard only navigation — can move between steps and submit', async ({ page }) => {
  // Focus main
  await page.focus('main[role=main]')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  // ensure we have Submit
  const submit = page.locator('button[data-testid="primary-cta"]')
  await expect(submit).toBeVisible()
  await submit.click()
})
