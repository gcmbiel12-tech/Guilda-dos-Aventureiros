const puppeteer = require('puppeteer');
(async () => {
 const browser = await puppeteer.launch({headless:true});
 const page = await browser.newPage({viewport:{width:1280,height:900}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///C:/Users/gcmbi/Documents/Projetos/Guilda%20dos%20Aventureiros/NPC/Sede/blockout.html');
 await page.screenshot({path:'NPC/Sede/blockout-desktop.png',fullPage:true});
 const zones=await page.$$eval('.zone',els=>els.map(e=>e.dataset.name));
 await page.click('.zone[data-name="Recepção"]');
 const selected=await page.$eval('#status',e=>e.textContent);
 await page.setViewport({width:390,height:844});
 await page.screenshot({path:'NPC/Sede/blockout-mobile.png',fullPage:true});
 const mobile=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth}));
 console.log(JSON.stringify({zones,selected,mobile,errors}));
 await browser.close();
 if(zones.length!==3||!selected.includes('Recepção')||mobile.overflow||errors.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
