(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports) module.exports=api;
 if(root) root.GuildaSedeNavigation=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const FLOOR=[[110,260],[480,130],[850,260],[480,390]];
 const OBSTACLES=[
  [[145,205],[275,250],[275,300],[145,260]],
  [[405,170],[585,170],[600,225],[495,260],[405,225]],
  [[630,205],[840,200],[845,315],[700,335],[630,300]],
  [[300,175],[405,205],[405,250],[315,230]]
 ];
 const STEP=10, ORIGIN_X=110, ORIGIN_Y=120, COLS=75, ROWS=29;
 function inside(p,poly){let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if(((a[1]>p.y)!==(b[1]>p.y))&&(p.x<(b[0]-a[0])*(p.y-a[1])/(b[1]-a[1])+a[0]))c=!c;}return c;}
 function blocked(p,obstacles){return obstacles.some(poly=>inside(p,poly));}
 function walkable(p,floor,obstacles){return inside(p,floor)&&!blocked(p,obstacles);}
 class Heap{
  constructor(){this.a=[]}
  push(v){const a=this.a;a.push(v);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(a[p].f<=v.f)break;a[i]=a[p];i=p;}a[i]=v;}
  pop(){const a=this.a;if(!a.length)return null;const top=a[0],last=a.pop();if(a.length){let i=0;while(true){let l=i*2+1,r=l+1,s=i;if(l<a.length&&a[l].f<a[s].f)s=l;if(r<a.length&&a[r].f<a[s].f)s=r;if(s===i)break;a[i]=a[s];i=s;}a[i]=last;}return top;}
  get length(){return this.a.length}
 }
 function findPath(start,target,options={}){
  const floor=options.floor||FLOOR, obstacles=options.obstacles||OBSTACLES, step=options.step||STEP;
  const ox=options.originX??ORIGIN_X,oy=options.originY??ORIGIN_Y,cols=options.cols||COLS,rows=options.rows||ROWS;
  const toCell=p=>({x:Math.round((p.x-ox)/step),y:Math.round((p.y-oy)/step)});
  const point=c=>({x:ox+c.x*step,y:oy+c.y*step});
  function nearest(p){
   const c=toCell(p);let best=null,dist=Infinity;
   for(let radius=0;radius<=7&&!best;radius++){
    for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
     if(radius&&Math.max(Math.abs(dx),Math.abs(dy))!==radius)continue;
     const n={x:c.x+dx,y:c.y+dy};if(n.x<0||n.y<0||n.x>=cols||n.y>=rows)continue;
     const q=point(n);if(!walkable(q,floor,obstacles))continue;
     const d=(q.x-p.x)**2+(q.y-p.y)**2;if(d<dist){dist=d;best=n;}
    }
   }return best;
  }
  if(!inside(start,floor)||!inside(target,floor)||blocked(target,obstacles))return null;
  const s=nearest(start),goal=nearest(target);if(!s||!goal)return null;
  const key=c=>c.x+','+c.y, sk=key(s),gk=key(goal);
  const open=new Heap(),came=new Map(),cost=new Map([[sk,0]]),closed=new Set();
  const heuristic=c=>Math.hypot(c.x-goal.x,c.y-goal.y);
  open.push({c:s,k:sk,f:heuristic(s)});
  const dirs=[[-1,0],[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1]];
  let found=false,iterations=0;
  while(open.length&&iterations++<12000){
   const cur=open.pop();if(closed.has(cur.k))continue;
   if(cur.k===gk){found=true;break;}closed.add(cur.k);
   for(const [dx,dy] of dirs){
    const n={x:cur.c.x+dx,y:cur.c.y+dy};if(n.x<0||n.y<0||n.x>=cols||n.y>=rows)continue;
    const p=point(n),nk=key(n);if(closed.has(nk)||!walkable(p,floor,obstacles))continue;
    if(dx&&dy&&(!walkable(point({x:cur.c.x+dx,y:cur.c.y}),floor,obstacles)||!walkable(point({x:cur.c.x,y:cur.c.y+dy}),floor,obstacles)))continue;
    const tentative=cost.get(cur.k)+(dx&&dy?Math.SQRT2:1);
    if(tentative<(cost.get(nk)??Infinity)){came.set(nk,cur.k);cost.set(nk,tentative);open.push({c:n,k:nk,f:tentative+heuristic(n)});}
   }
  }
  if(!found)return null;
  const path=[];let k=gk;while(k!==sk){const [x,y]=k.split(',').map(Number);path.push(point({x,y}));k=came.get(k);if(!k)return null;}
  path.reverse();return path;
 }
 function createNavigator({svg,hero,status,speed=190,requestFrame,now,onArrive}){
  const raf=requestFrame||((fn)=>globalThis.requestAnimationFrame(fn));
  const clock=now||(()=>globalThis.performance.now());
  let position={x:480,y:285},frame=null,activePath=[];
  function setStatus(message){if(status)status.textContent=message;}
  function stop(){if(frame!==null&&globalThis.cancelAnimationFrame)globalThis.cancelAnimationFrame(frame);frame=null;activePath=[];}
  function render(p){position=p;hero.setAttribute('transform','translate('+p.x.toFixed(2)+' '+p.y.toFixed(2)+')');}
  function moveTo(target){
   const path=findPath(position,target);
   if(!path){setStatus('Esse destino não está acessível. Escolha um ponto livre do piso.');return false;}
   stop();if(!path.length){setStatus('O aventureiro já está nesse local.');if(onArrive)onArrive({...position});return true;}
   activePath=[position,...path];let lengths=[0],total=0;
   for(let i=1;i<activePath.length;i++){total+=Math.hypot(activePath[i].x-activePath[i-1].x,activePath[i].y-activePath[i-1].y);lengths.push(total);}
   const start=clock(),duration=total/speed*1000;
   function tick(t){
    const d=Math.min(total,Math.max(0,(t-start)/duration*total));let i=1;while(i<lengths.length-1&&lengths[i]<d)i++;
    const span=lengths[i]-lengths[i-1],ratio=span?(d-lengths[i-1])/span:1,a=activePath[i-1],b=activePath[i];
    render({x:a.x+(b.x-a.x)*ratio,y:a.y+(b.y-a.y)*ratio});
    if(d<total){frame=raf(tick);}else{frame=null;activePath=[];setStatus('Aventureiro chegou ao destino.');if(onArrive)onArrive({...position});}
   }
   setStatus('Aventureiro caminhando pelo salão.');frame=raf(tick);return true;
  }
  return {moveTo,getPosition:()=>({...position}),getPath:()=>activePath.map(p=>({...p})),stop};
 }
 return {FLOOR,OBSTACLES,inside,walkable,findPath,createNavigator};
});
