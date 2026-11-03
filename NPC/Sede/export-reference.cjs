const puppeteer = require('puppeteer');
(async () => {
 const browser = await puppeteer.launch({headless:true});
 const page = await browser.newPage({viewport:{width:1000,height:800},deviceScaleFactor:1});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///C:/Users/gcmbi/Documents/Projetos/Guilda%20dos%20Aventureiros/NPC/Sede/blockout.html',{waitUntil:'load'});
 const rect=await page.evaluate(()=>{const r=document.querySelector('svg').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}});
 await page.screenshot({path:'NPC/Sede/blockout-reference.png',clip:rect});
 await browser.close();
 console.log(JSON.stringify({rect,errors}));
 if(errors.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
