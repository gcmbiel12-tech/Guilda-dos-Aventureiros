const puppeteer=require('puppeteer');
(async()=>{
 const browser=await puppeteer.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1000,height:800},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto('file:///C:/Users/gcmbi/Documents/Projetos/Guilda%20dos%20Aventureiros/NPC/Sede/blockout.html',{waitUntil:'load'});
 const api=await page.evaluate(()=>{
  const n=window.GuildaSedeNavigation;
  const start={x:480,y:285},target={x:600,y:250},path=n.findPath(start,target);
  return {loaded:!!n,pathLength:path?.length||0,pathSafe:!!path&&path.every(p=>n.walkable(p,n.FLOOR,n.OBSTACLES)),blockedRejected:n.findPath(start,{x:480,y:190})===null,outsideRejected:n.findPath(start,{x:900,y:300})===null,approaches:[{x:300,y:300},{x:600,y:290},{x:480,y:270}].every(p=>{const route=n.findPath(start,p);return !!route&&route.every(q=>n.walkable(q,n.FLOOR,n.OBSTACLES));})};
 });
 if(!api.loaded||!api.pathLength||!api.pathSafe||!api.blockedRejected||!api.outsideRejected||!api.approaches)throw new Error('Pure navigation checks failed: '+JSON.stringify(api));
 await page.evaluate(()=>{
  const svg=document.querySelector('svg'),pt=svg.createSVGPoint();pt.x=600;pt.y=250;
  const screen=pt.matrixTransform(svg.getScreenCTM());svg.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:screen.x,clientY:screen.y}));
 });
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('chegou ao destino'),{timeout:5000});
 const arrived=await page.evaluate(()=>({position:window.guildaNavigator.getPosition(),transform:document.querySelector('#hero').getAttribute('transform')}));
 if(Math.abs(arrived.position.x-600)>10||Math.abs(arrived.position.y-250)>10)throw new Error('Character did not reach destination: '+JSON.stringify(arrived));
 const before=await page.evaluate(()=>window.guildaNavigator.getPosition());
 await page.evaluate(()=>{
  const svg=document.querySelector('svg'),pt=svg.createSVGPoint();pt.x=480;pt.y=190;
  const screen=pt.matrixTransform(svg.getScreenCTM());svg.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:screen.x,clientY:screen.y}));
 });
 const blockedMessage=await page.$eval('#status',e=>e.textContent);
 const after=await page.evaluate(()=>window.guildaNavigator.getPosition());
 if(!blockedMessage.includes('não está acessível')||before.x!==after.x||before.y!==after.y)throw new Error('Blocked destination was not rejected');
 await page.evaluate(()=>document.querySelector('svg').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true})));
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('caminhando'),{timeout:1000});
 await new Promise(resolve=>setTimeout(resolve,500));
 await page.evaluate(()=>document.querySelectorAll('.zone')[1].dispatchEvent(new MouseEvent('click',{bubbles:true})));
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Pressione Enter'),{timeout:5000});
 await page.evaluate(()=>document.querySelector('svg').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})));
 const hotspot=await page.$eval('#status',e=>e.textContent);
 if(!hotspot.includes('recrutamento e gest'))throw new Error('Reception hotspot did not activate after approach');
 if(!hotspot.includes('recrutamento e gest'))throw new Error('Reception hotspot did not explain its role');
 await page.screenshot({path:'NPC/Sede/navigation-desktop.png',fullPage:true});
 await page.setViewport({width:390,height:844});
 const mobile=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,overflow:document.documentElement.scrollWidth>innerWidth}));
 if(mobile.overflow)throw new Error('Mobile horizontal overflow: '+JSON.stringify(mobile));
 await page.screenshot({path:'NPC/Sede/navigation-mobile.png',fullPage:true});
 console.log(JSON.stringify({api,arrived,blockedMessage,hotspot,mobile,errors}));
 await browser.close();if(errors.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
