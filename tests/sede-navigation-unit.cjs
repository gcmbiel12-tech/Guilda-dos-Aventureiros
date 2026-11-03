const nav = require('../NPC/Sede/sede-navigation.js');
const assert = require('node:assert/strict');
const start = {x:480,y:285};
const destinations = [{x:600,y:250},{x:300,y:300},{x:590,y:290},{x:550,y:330}];
let checks=0;
for(const target of destinations){
 const path=nav.findPath(start,target);
 assert.ok(path && path.length>0,'path should exist to '+JSON.stringify(target));checks++;
 assert.ok(path.every(p=>nav.walkable(p,nav.FLOOR,nav.OBSTACLES)),'path must never cross furniture');checks++;
 assert.deepEqual(path.at(-1),{x:Math.round(target.x/10)*10,y:Math.round(target.y/10)*10});
 checks++;
}
assert.equal(nav.findPath(start,{x:480,y:190}),null,'blocked planning table must reject destination');checks++;
assert.equal(nav.findPath(start,{x:900,y:300}),null,'outside floor must reject destination');checks++;
assert.equal(nav.findPath({x:480,y:285},{x:480,y:285}).length,0,'same position returns empty path');checks++;

// Cada estação deve ser alcançável a partir de regiões distintas e caminháveis.
const origins=[{x:480,y:285},{x:350,y:300},{x:480,y:350}];
const stations=[{name:'contracts',target:{x:300,y:300}},{name:'reception',target:{x:600,y:290}},{name:'planning',target:{x:480,y:270}}];
for(const origin of origins){
 assert.ok(nav.walkable(origin,nav.FLOOR,nav.OBSTACLES),'origin must be walkable: '+JSON.stringify(origin));checks++;
 for(const station of stations){
  const path=nav.findPath(origin,station.target);
  assert.ok(path && path.length>0,'route from '+JSON.stringify(origin)+' to '+station.name+' should exist');checks++;
  assert.ok(path.every(p=>nav.walkable(p,nav.FLOOR,nav.OBSTACLES)),'route to '+station.name+' must avoid obstacles');checks++;
  assert.deepEqual(path.at(-1),{x:Math.round(station.target.x/10)*10,y:Math.round(station.target.y/10)*10},'route should end at '+station.name);checks++;
  let previous=origin;
  for(const point of path){
   const dx=point.x-previous.x,dy=point.y-previous.y;
   assert.ok(Math.max(Math.abs(dx),Math.abs(dy))<=10,'route steps must remain adjacent');
   checks++;
   if(dx!==0&&dy!==0){
    assert.ok(nav.walkable({x:previous.x+dx,y:previous.y},nav.FLOOR,nav.OBSTACLES),'diagonal step must not clip horizontal corner');
    assert.ok(nav.walkable({x:previous.x,y:previous.y+dy},nav.FLOOR,nav.OBSTACLES),'diagonal step must not clip vertical corner');
    checks+=2;
   }
   previous=point;
  }
 }
}
console.log('Sede navigation: '+checks+' checks passed.');
