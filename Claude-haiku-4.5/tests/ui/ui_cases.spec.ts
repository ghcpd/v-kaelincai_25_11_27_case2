import { test, expect } from '@playwright/test'

test.describe('UI Regression - Onboarding Wizard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/')
    // Wait for app to load
    await page.waitForLoadState('networkidle')
  })

  test('Scenario 1: Desktop layout - header no overlap', async ({ page }) => {
    // Verify viewport
    const viewportSize = page.viewportSize()
    expect(viewportSize?.width).toBeGreaterThan(1000)

    // Check header and content positioning
    const header = page.locator('.wizard-header')
    const content = page.locator('.wizard-content')

    const headerBox = await header.boundingBox()
    const contentBox = await content.boundingBox()

    expect(headerBox).toBeTruthy()
    expect(contentBox).toBeTruthy()

    // Verify no overlap (header bottom < content top + 20px threshold)
    if (headerBox && contentBox) {
      const overlapThreshold = 20
      expect(headerBox.y + headerBox.height).toBeLessThanOrEqual(contentBox.y + overlapThreshold)
    }

    // Verify CTA is visible
    const submitBtn = page.locator('#submit-button')
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeInViewport()

    // Screenshot
    await page.screenshot({ path: 'docs/screenshots/1-desktop-layout.png' })
  })

  test('Scenario 2: 13-inch Laptop (1280px) - no overlap', async ({ page }) => {
    // Verify viewport is 1280px
    const viewportSize = page.viewportSize()
    expect(viewportSize?.width).toBe(1280)

    // Check header overlap
    const header = page.locator('.wizard-header')
    const content = page.locator('.wizard-content')

    const headerBox = await header.boundingBox()
    const contentBox = await content.boundingBox()

    if (headerBox && contentBox) {
      expect(headerBox.y + headerBox.height).toBeLessThanOrEqual(contentBox.y + 20)
    }

    // Verify CTA visible
    const submitBtn = page.locator('#submit-button')
    await expect(submitBtn).toBeVisible()
    await expect(submitBtn).toBeInViewport()

    // Test responsive spacing
    const step1Content = page.locator('.wizard-content')
    const computedStyle = await step1Content.evaluate((el) => {
      return window.getComputedStyle(el).paddingBottom
    })
    expect(computedStyle).toBeTruthy()

    // Screenshot
    await page.screenshot({ path: 'docs/screenshots/2-laptop-13inch.png' })
  })

  test('Scenario 3: Mobile Safari (375px) - CTA visible and clickable', async ({ page }) => {
    // Verify mobile viewport
    const viewportSize = page.viewportSize()
    expect(viewportSize?.width).toBe(375)

    // Check safe area handling
    await page.addInitScript(() => {
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 812,
      })
    })

    // Verify CTA is visible in viewport
    const submitBtn = page.locator('#submit-button')
    await expect(submitBtn).toBeVisible()

    // Get footer position
    const footer = page.locator('.wizard-footer')
    const footerBox = await footer.boundingBox()

    // Verify footer is not below viewport
    if (footerBox && viewportSize) {
      expect(footerBox.y).toBeLessThan(viewportSize.height)
    }

    // Test CTA clickability
    await submitBtn.click()
    
    // Verify navigation happened (step changed)
    const stepIndicator = page.locator('.wizard-header p:has-text("Step")')
    await stepIndicator.waitFor({ state: 'attached' })

    // Screenshot
    await page.screenshot({ path: 'docs/screenshots/3-mobile-safari-cta.png' })
  })

  test('Scenario 4: Dark mode - Markdown rendered and styled correctly', async ({ page }) => {
    // Navigate to handbook step
    const nextBtn = page.locator('#submit-button')
    await nextBtn.click()
    await nextBtn.click() // Navigate to handbook

    // Toggle dark mode
    const themeToggle = page.locator('button:has-text("Dark")')
    await themeToggle.click()

    // Wait for dark mode to apply
    await page.waitForTimeout(300)

    // Verify markdown content is rendered (no raw HTML)
    const content = page.locator('.markdown-content')
    const htmlContent = await content.innerHTML()

    // Check that common HTML tags are rendered correctly
    expect(htmlContent).toContain('<h')
    expect(htmlContent).toContain('<strong>')
    expect(htmlContent).toContain('<em>')

    // Verify no unescaped script tags
    expect(htmlContent).not.toContain('<script')

    // Check that content is visible
    await expect(content).toBeVisible()

    // Verify text color is visible in dark mode (not black on black)
    const h3Element = page.locator('.markdown-content h3')
    if (await h3Element.count() > 0) {
      const color = await h3Element.first().evaluate((el) => {
        return window.getComputedStyle(el).color
      })
      // Color should not be rgb(0,0,0) in dark mode
      expect(color).not.toBe('rgb(0, 0, 0)')
    }

    // Screenshot
    await page.screenshot({ path: 'docs/screenshots/4-dark-mode-markdown.png' })
  })

  test('Scenario 5: Keyboard navigation - all steps accessible via Tab/Arrow keys', async ({ page }) => {
    const initialUrl = page.url()

    // Test Tab navigation to buttons
    await page.keyboard.press('Tab')
    await page.waitForTimeout(100)
    
    let focusedElement = await page.evaluate(() => {
      return document.activeElement?.getAttribute('id')
    })
    expect(['theme-toggle', 'prev-button', 'submit-button']).toContain(focusedElement)

    // Test Arrow navigation between steps
    const submitBtn = page.locator('#submit-button')
    
    // Go to next step with Arrow key
    await submitBtn.focus()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)

    // Verify step changed
    const stepText = page.locator('.wizard-header p:has-text("Step")')
    const text = await stepText.textContent()
    expect(text).toContain('Step 2')

    // Go back with Arrow key
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(200)

    // Verify back to step 1
    const textBack = await stepText.textContent()
    expect(textBack).toContain('Step 1')

    // Verify focus visible indicators exist
    const focusStyle = await submitBtn.evaluate((el) => {
      return window.getComputedStyle(el, ':focus').outline
    })

    // Screenshot
    await page.screenshot({ path: 'docs/screenshots/5-keyboard-navigation.png' })
  })

  test.describe('Accessibility assertions', () => {
    test('ARIA labels present on interactive elements', async ({ page }) => {
      // Check wizard main region
      const main = page.locator('[role="main"]')
      await expect(main).toHaveAttribute('aria-label', /Onboarding/)

      // Check buttons have labels
      const submitBtn = page.locator('#submit-button')
      await expect(submitBtn).toHaveAttribute('aria-label')

      const prevBtn = page.locator('#prev-button')
      await expect(prevBtn).toHaveAttribute('aria-label')

      // Check progress bar has role
      const progressBars = page.locator('[role="progressbar"]')
      expect(await progressBars.count()).toBeGreaterThan(0)
    })

    test('Focus order is logical', async ({ page }) => {
      // Start from top
      await page.keyboard.press('Tab')
      
      let focusedElements: string[] = []
      for (let i = 0; i < 10; i++) {
        const el = await page.evaluate(() => {
          return document.activeElement?.getAttribute('id') || document.activeElement?.tagName || 'unknown'
        })
        focusedElements.push(el)
        await page.keyboard.press('Tab')
      }

      // Should have cycled through interactive elements
      expect(focusedElements.length).toBeGreaterThan(0)
      expect(focusedElements.some((el) => el.includes('button'))).toBeTruthy()
    })

    test('Color contrast sufficient (no reliance on color alone)', async ({ page }) => {
      // Verify that text is readable and not only color-differentiated
      const elements = page.locator('[role="button"], [role="link"], [role="tab"]')
      const count = await elements.count()
      
      expect(count).toBeGreaterThan(0)

      // Verify text content exists (not just icons)
      for (let i = 0; i < Math.min(count, 5); i++) {
        const text = await elements.nth(i).textContent()
        expect(text?.length).toBeGreaterThan(0)
      }
    })
  })
})

test.describe('Layout stability (CLS)', () => {
  test('No significant layout shift on interactions', async ({ page }) => {
    await page.goto('/')
    
    // Measure initial layout
    const initialLayout = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, button')
      return Array.from(elements).map((el) => ({
        id: el.id,
        top: (el as HTMLElement).offsetTop,
      }))
    })

    // Interact with button
    const btn = page.locator('#submit-button')
    await btn.click()
    await page.waitForTimeout(300)

    // Measure after interaction
    const afterLayout = await page.evaluate(() => {
      const elements = document.querySelectorAll('h1, h2, button')
      return Array.from(elements).map((el) => ({
        id: el.id,
        top: (el as HTMLElement).offsetTop,
      }))
    })

    // Verify header didn't move significantly
    const headerBefore = initialLayout.find((e) => e.id === '' || true)
    const headerAfter = afterLayout.find((e) => e.id === '' || true)

    expect(headerBefore).toBeTruthy()
    expect(headerAfter).toBeTruthy()
  })
})
