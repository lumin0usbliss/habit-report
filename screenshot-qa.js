const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport large enough to capture the QA page elements
  await page.setViewport({ width: 1400, height: 16000 });
  
  await page.goto('http://localhost:3001/qa', { waitUntil: 'networkidle0' });

  // Get coordinates for Page02 of CASE_A
  const page02Clip = await page.evaluate(() => {
    // Select the first Page02 (CASE A)
    const elements = document.querySelectorAll('.report-page'); // Assuming .report-page or similar
    if (!elements || elements.length < 2) return null;
    const el = elements[1]; // Page02 is the 2nd one in the first case
    const rect = el.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });

  if (page02Clip) {
    await page.screenshot({ path: path.join(__dirname, 'page02-qa.png'), clip: page02Clip });
    console.log('Page02 saved');
  }

  // Get coordinates for Page04 of CASE_A
  const page04Clip = await page.evaluate(() => {
    const elements = document.querySelectorAll('.report-page');
    if (!elements || elements.length < 4) return null;
    const el = elements[3]; // Page04 is the 4th one
    const rect = el.getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });

  if (page04Clip) {
    await page.screenshot({ path: path.join(__dirname, 'page04-qa.png'), clip: page04Clip });
    console.log('Page04 saved');
  }

  await browser.close();
})();
