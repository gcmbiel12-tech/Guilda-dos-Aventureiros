const puppeteer = require('puppeteer');
(async () => {
 const browser = await puppeteer.launch({headless:true});
 const page = await browser.newPage({viewport:{width:1000,height:800},deviceScaleFactor:1});
 await page.goto('file:///C:/Users/gcmbi/Documents/Projetos/Guilda%20dos%20Aventureiros/NPC/Sede/blockout.html',{waitUntil:'load'});
 await page.addStyleTag({content:'.zone-label,.small,#hero{display:none!important}'});
 const rect=await page.evaluate(()=>{const r=document.querySelector('svg').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}});
 await page.screenshot({path:'NPC/Sede/blockout-reference-clean.png',clip:rect});
 await browser.close(); console.log(JSON.stringify({exported:true,rect}));
})().catch(e=>{console.error(e);process.exit(1)});
