const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('file:///C:/Users/gcmbi/Documents/Projetos/Guilda%20dos%20Aventureiros/NPC/Sede/preview.html');
  await page.screenshot({ path: 'NPC/Sede/preview-desktop.png', fullPage: true });
  const desktop = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }));
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: 'NPC/Sede/preview-mobile.png', fullPage: true });
  const mobile = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > innerWidth }));
  const images = await page.$$eval('img', elements => elements.map(img => ({ loaded: img.complete && img.naturalWidth > 0, width: img.naturalWidth, height: img.naturalHeight })));
  console.log(JSON.stringify({ title: await page.title(), desktop, mobile, images, errors }));
  await browser.close();
  if (errors.length || images.some(image => !image.loaded) || mobile.overflow) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
