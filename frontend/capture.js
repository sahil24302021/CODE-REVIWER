const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a nice desktop size
  await page.setViewport({ width: 1440, height: 900 });

  // Navigate to login
  await page.goto('http://localhost:3000/login');
  
  // Set localStorage explicitly to bypass login and simulate a logged-in state
  await page.evaluate(() => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify({
      id: '123',
      name: 'Senior Architect',
      email: 'architect@codelens.ai'
    }));
  });

  // Navigate directly to dashboard now that "token" is set
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });

  // Wait a moment for any animations to settle
  await new Promise(r => setTimeout(r, 1500));

  // Capture screenshot into the brain directory
  const savePath = '/Users/sahilkumar/.gemini/antigravity/brain/5028860f-0c22-47c1-bd09-5564f9e99094/dashboard_world_class.png';
  await page.screenshot({ path: savePath, fullPage: true });

  await browser.close();
  console.log('Dashboard screenshot saved to:', savePath);
})();
