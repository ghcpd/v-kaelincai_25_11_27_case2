const { chromium, devices } = require('playwright');
(async()=>{
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5173');
  await page.waitForSelector('.header');
  await page.waitForSelector('.onboarding-panel');
  console.log('Initial panel HTML:', await page.$eval('.onboarding-panel', el=>el.innerHTML));

  // Focus main and try keyboard navigation
  await page.focus('main');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  console.log('After Enter:', await page.$eval('.onboarding-panel', el=>el.innerHTML));

  // Now move to next step using Next button
  try{
    await page.click('button[aria-label="Next"]');
  }catch(e){ console.log('Click Next failed', e.message) }
  await page.waitForTimeout(500);
  console.log('After click Next:', await page.$eval('.onboarding-panel', el=>el.innerHTML));

  // Try focusing next button and pressing Enter to go to submit
  try{
    await page.focus('button[aria-label="Next"]');
    await page.keyboard.press('Enter');
  }catch(e){ console.log('focus/Enter failed', e.message) }
  await page.waitForTimeout(500);
  console.log('After focus Enter:', await page.$eval('.onboarding-panel', el=>el.innerHTML));

  await page.screenshot({path: 'c:/workspace/responsive_onboarding_ui_v2/docs/screenshots/debug_keyboard.png', fullPage:true})
  await browser.close();
})()
