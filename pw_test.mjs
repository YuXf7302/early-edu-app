import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://localhost:5173';
const shots = [];
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (err) => errors.push('PAGEERROR: ' + err.message));

async function shot(name) {
  const path = `pw_shots/${name}.png`;
  await page.screenshot({ path });
  shots.push(path);
}

fs.mkdirSync('pw_shots', { recursive: true });

try {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await shot('01_initial');

  console.log('TITLE:', await page.title());
  console.log('BODY TEXT (first 500):', (await page.innerText('body')).slice(0, 500));
} catch (e) {
  console.log('NAV ERROR:', e.message);
}

console.log('--- CONSOLE ERRORS ---');
console.log(JSON.stringify(errors, null, 2));

await browser.close();
