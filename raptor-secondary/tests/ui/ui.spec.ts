import { test, expect, type Page } from '@playwright/test'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const screenshotsDir = path.join(rootDir, 'docs', 'screenshots')

async function ensureDirs() {
  await fs.mkdir(screenshotsDir, { recursive: true })
}

async function saveJson(filename: string, data: unknown) {
  await ensureDirs()
  const serialized = JSON.stringify(data ?? null, null, 2)
  await fs.writeFile(path.join(screenshotsDir, filename), serialized, 'utf-8')
}

async function getBox(page: Page, selector: string) {
  const locator = page.locator(selector).first()
  await locator.waitFor()
  const box = await locator.boundingBox()
  return box
}

async function captureLayoutSnapshot(page: Page, label: string) {
  const [headerBox, contentBox, ctaBox] = await Promise.all([
    getBox(page, '.wizard-header'),
    getBox(page, '.wizard-panel'),
    getBox(page, '.cta-bar'),
  ])
  await saveJson(`${label}_layout.json`, {
    headerBox,
    contentBox,
    ctaBox,
    viewport: page.viewportSize(),
  })
  let a11yTree: any = null
  try {
    // @ts-ignore Playwright exposes accessibility API
    a11yTree = await (page as any).accessibility?.snapshot?.()
  } catch (err) {
    a11yTree = { error: String(err) }
  }
  await saveJson(`${label}_a11y.json`, a11yTree)
}

test.describe('Onboarding UI', () => {
  test('desktop layout stable', async ({ page }) => {
    await ensureDirs()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')

    await captureLayoutSnapshot(page, 'desktop')

    const headerBox = await getBox(page, '.wizard-header')
    const contentBox = await getBox(page, '.wizard-panel')
    expect(headerBox!.y + headerBox!.height).toBeLessThan(contentBox!.y + 1)

    // Verify structured UI logs are emitted
    const logs = await page.evaluate(() => (globalThis as any).__UI_LOGS__ || [])
    expect(Array.isArray(logs)).toBeTruthy()
    expect(logs.length).toBeGreaterThan(0)

    await page.screenshot({ path: path.join(screenshotsDir, 'desktop.png'), fullPage: true })
  })

  test('13-inch laptop no overlap', async ({ page }) => {
    await ensureDirs()
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await captureLayoutSnapshot(page, 'laptop13')

    const headerBox = await getBox(page, '.wizard-header')
    const contentBox = await getBox(page, '.wizard-panel')
    expect(headerBox!.y + headerBox!.height).toBeLessThan(contentBox!.y + 1)

    const mainMinHeight = await page.$eval('.wizard-main', (el) => getComputedStyle(el).minHeight)
    const minHeightPx = parseFloat(mainMinHeight)
    const metrics = await page.$eval(':root', (el) => {
      const cs = getComputedStyle(el)
      return {
        header: parseFloat(cs.getPropertyValue('--header-height')),
        cta: parseFloat(cs.getPropertyValue('--cta-height')),
      }
    })
    const viewport = page.viewportSize()!
    expect(minHeightPx + metrics.header + metrics.cta).toBeGreaterThanOrEqual(viewport.height - 4)

    await page.screenshot({ path: path.join(screenshotsDir, 'laptop13.png'), fullPage: true })
  })

  test('mobile Safari CTA visible', async ({ page }, testInfo) => {
    const isMobileSafariProject = testInfo.project.name === 'mobile-safari'
    await ensureDirs()
    if (!isMobileSafariProject) {
      // Align viewport to iPhone 12 for non-mobile projects
      await page.setViewportSize({ width: 390, height: 844 })
    }
    await page.goto('/')

    await captureLayoutSnapshot(page, 'mobile_safari')

    const ctaVisible = await page.isVisible('.cta-bar')
    expect(ctaVisible).toBeTruthy()

    const ctaBox = await getBox(page, '.cta-bar')
    const viewport = page.viewportSize()!
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(viewport.height + 1)

    await page.screenshot({ path: path.join(screenshotsDir, 'mobile_safari_cta.png'), fullPage: true })
  })

  test('dark mode Markdown sanitized', async ({ page }) => {
    await ensureDirs()
    await page.setViewportSize({ width: 1024, height: 768 })
    await page.goto('/')

    // Toggle dark mode
    await page.getByRole('button', { name: /dark mode/i }).click()

    await captureLayoutSnapshot(page, 'markdown_dark')

    const markdownText = await page.textContent('.markdown-body')
    expect(markdownText).not.toContain('<div>') // raw HTML should be rendered, not shown as tags

    await page.screenshot({ path: path.join(screenshotsDir, 'markdown_dark.png'), fullPage: true })
  })

  test('keyboard-only navigation', async ({ page }) => {
    await ensureDirs()
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    await captureLayoutSnapshot(page, 'keyboard_nav_start')

    await page.keyboard.press('Tab') // focus skip link
    await page.keyboard.press('Tab') // likely header button
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')

    const activeStepHeading = await page.locator('.wizard-panel h2').textContent()
    expect(activeStepHeading?.toLowerCase()).toContain('handbook')

    await captureLayoutSnapshot(page, 'keyboard_nav')

    await page.screenshot({ path: path.join(screenshotsDir, 'keyboard_nav.png'), fullPage: true })
  })
})
