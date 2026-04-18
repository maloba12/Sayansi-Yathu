const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  console.log('--- BROWSER CONSOLE LOGS ---');
  page.on('console', msg => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });
  page.on('requestfailed', request => {
    console.error(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
  });

  try {
    console.log('Navigating to http://localhost:3000/dashboard.html...');
    await page.goto('http://localhost:3000/dashboard.html', { waitUntil: 'networkidle2', timeout: 10000 });
    
    // Wait for render
    await new Promise(r => setTimeout(r, 2000));
    
    // Check if the React app mounted
    const appHtml = await page.evaluate(() => {
      const el = document.getElementById('app');
      return el ? el.innerHTML : 'NO #app ELEMENT FOUND';
    });
    
    console.log('--- #APP CONTENT ---');
    console.log(appHtml.substring(0, 500) + (appHtml.length > 500 ? '...' : ''));
    
    // Take a screenshot
    await page.screenshot({ path: 'dashboard_screenshot.png' });
    console.log('Saved screenshot to dashboard_screenshot.png');
    
  } catch (err) {
    console.error('Navigation error:', err);
  } finally {
    await browser.close();
  }
})();
