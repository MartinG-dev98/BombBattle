/* [b2 · 313-321] */
const MAPS=[
{n:'Grassland Arena',d:'Sunny meadow with fences, trees and flowers. Classic bomb-slinging.',bg:'#2f7d3a',f:'#7ccf5a',f2:'#71c451',w:'#7a5534',wt:'#9b6d43',c:'#d9a55a',ce:'#8a5a22',a:'#fff59a'},
{n:'Lava Kingdom',d:'Lava erupts under warning markers. Move when the ground glows.',bg:'#1c0606',f:'#3a1d1a',f2:'#43221e',w:'#2a2228',wt:'#45363f',c:'#7b4a3a',ce:'#ff6a1f',a:'#ff6a1f'},
{n:'Frozen Fortress',d:'Slippery ice floor. Plan your stops before you slide.',bg:'#123a64',f:'#dff2ff',f2:'#cfe9fb',w:'#6fa8dc',wt:'#a8d6f5',c:'#bfe6ff',ce:'#5aa8de',a:'#ffffff'},
{n:'Haunted Forest',d:'Cursed bogs slow everyone. Ghosts drift through the trees.',bg:'#120a22',f:'#2a2240',f2:'#30284a',w:'#3b2a2a',wt:'#55403a',c:'#5c4a7a',ce:'#b98cff',a:'#c69cff'},
{n:'Cyber City',d:'Two pairs of teleporters link the neon grid.',bg:'#05051a',f:'#121236',f2:'#16163e',w:'#1e1e5a',wt:'#2c2c80',c:'#1f2d55',ce:'#00f0ff',a:'#ff2bd6'},
{n:'Candy Kingdom',d:'Sticky jelly puddles slow you down. Watch the lollipops!',bg:'#ffb3d9',f:'#ffe0ef',f2:'#ffd3e8',w:'#ff6fae',wt:'#ff9ac7',c:'#8a4b2a',ce:'#5a2d14',a:'#ffffff'},
{n:'Classic Arena',d:'The original battleground. Pure bomb-slinging under the stadium lights.',bg:'#12183a',f:'#2d3a6e',f2:'#33427a',w:'#59659a',wt:'#7c88c0',c:'#d49a52',ce:'#8a5a22',a:'#ffd23f'},
{n:'Jungle Arena',d:'Mud patches slow everyone down. Fireflies drift through the vines.',bg:'#0b2a14',f:'#2f6b3a',f2:'#367a43',w:'#5b4a32',wt:'#7b6544',c:'#c9a14a',ce:'#6b4e1c',a:'#9bff6a'}];

/* ---------- ROUND SETUP ---------- */
/* [b2 · 475-475] */
function spir(){const o=[];let x0=1,y0=1,x1=W-2,y1=H-2;while(x0<=x1&&y0<=y1){for(let x=x0;x<=x1;x++)o.push([x,y0]);for(let y=y0+1;y<=y1;y++)o.push([x1,y]);if(y1>y0)for(let x=x1-1;x>=x0;x--)o.push([x,y1]);if(x1>x0)for(let y=y1-1;y>y0;y--)o.push([x0,y]);x0++;y0++;x1--;y1--}return o}
/* ---------- RANDOMIZED SAFE SPAWNS ----------
   Host-only. Picks a random walkable cell away from monster spots and the arena centre.
   Two players get point-mirrored cells (fair on the symmetric crate layout), at least
   (W+H)/2 tiles apart, randomly assigned, and never the same area as last round. */
/* [b2 · 490-504] */
function pickSpawns(n){if(n>2)return pickSpawns4(n);const md=n>1?Math.round((W+H)*.5):0,sp=spots(),cand=[];
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(G[y][x]!==0||sq[y][x]||padNear(x,y))continue;if(Math.abs(x-CX)+Math.abs(y-CY)<3)continue;if(sp.some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)<3))continue;
  if(n>1&&Math.abs(2*x-(W-1))+Math.abs(2*y-(H-1))<md)continue;cand.push([x,y])}
 let pool=cand.filter(([x,y])=>!lastSp.some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)<3));if(!pool.length)pool=cand;
 const[x,y]=pool[R()*pool.length|0],out=n>1?[[x,y],[W-1-x,H-1-y]]:[[x,y]];if(n>1&&R()<.5)out.reverse();lastSp=out;return out}
/* 3-4 players: pick one random cell in the top-left quadrant and mirror it into all four quadrants (fair on the 4-fold crate layout) */
function pickSpawns4(n){const sp=spots(),cand=[];for(let y=1;y<=CY-2;y++)for(let x=1;x<=CX-2;x++){if(mir4(x,y).some(([a,b])=>G[b][a]!==0||sq[b][a]||padNear(a,b)))continue;if(sp.some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)<3))continue;cand.push([x,y])}
 let pool=cand.filter(([x,y])=>!lastSp.some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)<2));if(!pool.length)pool=cand;const[x,y]=pool[R()*pool.length|0];
 const out=[[x,y],[W-1-x,H-1-y],[W-1-x,y],[x,H-1-y]];for(let i=out.length-1;i>0;i--){const j=R()*(i+1)|0;[out[i],out[j]]=[out[j],out[i]]}lastSp=out.slice(0,n);return lastSp}
const mir4=(x,y)=>[[x,y],[W-1-x,H-1-y],[W-1-x,y],[x,H-1-y]];
/* escape check: a fighter must be able to step out of the cross of a bomb dropped on its spawn */
function escOK(x,y){const seen=new Set([x+','+y]),q=[[x,y,0]];while(q.length){const[a,b,d]=q.shift();if(a!=x&&b!=y)return 1;if(d>=4)continue;for(const[dx,dy]of DIR){const nx=a+dx,ny=b+dy,k=nx+','+ny;if(!seen.has(k)&&G[ny]&&G[ny][nx]===0){seen.add(k);q.push([nx,ny,d+1])}}}return 0}
function openEscape(x,y,mir){if(escOK(x,y))return;const prev=new Map([[x+','+y,null]]),q=[[x,y]];let end=null;
 while(q.length&&!end){const[a,b]=q.shift();for(const[dx,dy]of DIR){const nx=a+dx,ny=b+dy,k=nx+','+ny,v=G[ny]&&G[ny][nx];if(prev.has(k)||(v!==0&&v!==2))continue;prev.set(k,[a,b]);if(nx!=x&&ny!=y){end=[nx,ny];break}q.push([nx,ny])}}
 const clr=(a,b)=>{if(G[b][a]==2){G[b][a]=0;pu[b][a]=-1}};for(let c2=end;c2;c2=prev.get(c2[0]+','+c2[1])){if(mir==4){for(const[a,b]of mir4(c2[0],c2[1]))clr(a,b)}else{clr(c2[0],c2[1]);if(mir)clr(W-1-c2[0],H-1-c2[1])}}}
/* [b2 · 583-591] */
function sym(x,y,t,list,extra){list.push({x,y,t,...extra});list.push({x:W-1-x,y:H-1-y,t,...extra})}
function haz(dt){const m=CM;
 if(m==1){lava_t-=dt;if(lava_t<=0){lava_t=Math.max(3,6.5-el*.03);for(let i=0;i<2;i++){const x=1+R()*(W-2)|0,y=1+R()*(H-2)|0;if(G[y][x]!=1)sym(x,y,1.5,lava)}}}
 lava.forEach(l=>{l.t-=dt;if(l.t<=0){fires.push({x:l.x,y:l.y,t:l.k?BDMG.fire:.9,l:LFX[l.k|0]||1,dmg:l.k?BDMG.tile:30,kd:l.k?'B':'h'});SFX.boom(0)}});lava=lava.filter(l=>l.t>0);
 const md=S.mode;if(md==3||md==4){met_t-=dt;if(met_t<=0){met_t=md==3?3.2:Math.max(.6,2.4-el*.02);const x=1+R()*(W-2)|0,y=1+R()*(H-2)|0;if(G[y][x]!=1)sym(x,y,1.4,met)}
  if(md==4){wave_t-=dt;if(wave_t<=0){wave_t=20;survWave();txt.push({x:W/2,y:H/2,t:1.6,s:'MONSTER WAVE!',c:'#ff8a3d'});for(let i=0;i<3;i++){const x=1+R()*(W-2)|0,y=1+R()*(H-2)|0;if(G[y][x]!=1)sym(x,y,1.5,met)}}}}
 met.forEach(q=>{q.t-=dt;if(q.t<=0)blast(q.x,q.y,1,0,undefined,1,undefined,{dmg:q.dmg||30,kd:q.kd||'h',l:q.k?LFX[q.k]:0})});met=met.filter(q=>q.t>0);
 const s0=md==2?30:md==0?120:1e9;if(el>s0){sh_t-=dt;if(sh_t<=0){sh_t=md==2?.7:1;while(spI<spiral.length){const[x,y]=spiral[spI++];if(G[y][x]!=1&&!cl.some(q=>q.x==x&&q.y==y)){sym(x,y,.7,cl);break}}}}
 cl.forEach(q=>{q.t-=dt;if(q.t<=0){G[q.y][q.x]=1;pu[q.y][q.x]=-1;bombs=bombs.filter(b=>!(b.x==q.x&&b.y==q.y));items=items.filter(i=>!(i.x==q.x&&i.y==q.y));pl.forEach(p=>{if((p.x|0)==q.x&&(p.y|0)==q.y)hurt(p,1)});shk=Math.min(1,shk+.15);burst(q.x+.5,q.y+.5,'#889',6)}});cl=cl.filter(q=>q.t>0)}
/* [b3 · 684-688] */
function deco(x,y,px,py){const m=CM,h=(x*7+y*13)%5;
 if(m==1&&h==0){c.strokeStyle='rgba(255,120,30,.35)';c.lineWidth=2;c.beginPath();c.moveTo(px+8,py+10);c.lineTo(px+22,py+24);c.lineTo(px+38,py+20);c.stroke()}
 if(m==2){c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=2;c.beginPath();c.moveTo(px+8,py+T-8);c.lineTo(px+T-8,py+8);c.stroke()}
 if(m==4){c.strokeStyle='rgba(0,255,220,.12)';c.lineWidth=1;c.strokeRect(px+.5,py+.5,T-1,T-1)}
 if(m==3&&h==1){c.fillStyle='rgba(20,80,20,.4)';c.beginPath();c.ellipse(px+14,py+30,7,3,.5,0,7);c.fill()}}

/* ---------- MAP TILES ---------- */
/* [b3 · 891-917] */
const hsh=(x,y)=>((x*73+y*151)^(x*y*17))%11;
const isBorder=(x,y)=>x==0||y==0||x==W-1||y==H-1;
function hzc(){return['rgba(255,70,20,','rgba(255,70,20,','rgba(120,200,255,','rgba(180,90,255,','rgba(0,240,255,','rgba(255,60,160,'][CM]}
function floorT(x,y,px,py){const m=MAPS[CM],h=hsh(x,y),o=(x+y)%2;c.fillStyle=o?m.f:m.f2;c.fillRect(px,py,T,T);
 if(CM==0){c.strokeStyle='rgba(40,120,40,.55)';c.lineWidth=2;const sw=Math.sin(tm*2+x*.7+y)*2;for(let i=0;i<3;i++){const bx=px+8+((h*7+i*13)%32),by=py+12+((h*5+i*11)%28);c.beginPath();c.moveTo(bx,by);c.lineTo(bx+sw,by-6);c.stroke()}
  if(h==2||h==7){const fx=px+14+h*2,fy=py+30-h;for(let i=0;i<5;i++)E(c,fx+Math.cos(i*1.26)*3.5,fy+Math.sin(i*1.26)*3.5,2.6,2.6,h==2?'#fff':'#ff7ac8');E(c,fx,fy,2,2,'#ffd23f')}}
 else if(CM==1){if(h<4){const gl=.45+.35*Math.sin(tm*3+x+y);c.save();c.shadowColor='#ff5a00';c.shadowBlur=8;c.strokeStyle=`rgba(255,${120+h*20},30,${gl})`;c.lineWidth=2;c.beginPath();c.moveTo(px+6,py+10+h*4);c.lineTo(px+20,py+24);c.lineTo(px+30,py+18);c.lineTo(px+42,py+30-h*3);c.stroke();c.restore()}else if(h==6)E(c,px+30,py+32,5,3,'rgba(0,0,0,.25)')}
 else if(CM==2){c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.moveTo(px+6,py+T-10);c.lineTo(px+12,py+T-10);c.lineTo(px+T-6,py+12);c.lineTo(px+T-6,py+6);c.closePath();c.globalAlpha=.25;c.fill();c.globalAlpha=1;if(h==3)E(c,px+14,py+16,5,3,'#fff')}
 else if(CM==3){if(h==4||h==9){const gl=.6+.4*Math.sin(tm*2+x);c.save();c.shadowColor='#7dffd8';c.shadowBlur=10*gl;L(c,px+24,py+34,px+24,py+28,'#e8e0ff',3);x2m(px+24,py+27,h==4?'#7dffd8':'#ff8af0');c.restore()}else if(h==1)E(c,px+18,py+30,8,3,'rgba(0,0,0,.25)')}
 else if(CM==4){const pu=.18+.12*Math.sin(tm*3+(x+y)*.6);c.strokeStyle=`rgba(0,240,255,${pu})`;c.lineWidth=1;c.strokeRect(px+.5,py+.5,T-1,T-1);if(h==5){c.fillStyle=`rgba(255,43,214,${pu*2})`;c.fillRect(px+20,py+20,8,8)}}
 else if(CM==5){const cols=['#ff4d8d','#4dc3ff','#ffd23f','#7ddc5a','#b06bff'];if(h<5){c.save();c.translate(px+10+h*6,py+12+h*5);c.rotate(h);c.fillStyle=cols[h];c.fillRect(-4,-1.2,8,2.4);c.restore();c.save();c.translate(px+34-h*3,py+34-h*2);c.rotate(-h);c.fillStyle=cols[(h+2)%5];c.fillRect(-4,-1.2,8,2.4);c.restore()}}}
function x2m(x,y,col){c.beginPath();c.arc(x,y,7,Math.PI,0);c.fillStyle=col;c.fill();c.strokeStyle=OL;c.lineWidth=1.5;c.stroke();E(c,x-3,y-3,1.5,1.5,'#fff');E(c,x+3,y-2,1.2,1.2,'#fff')}
function block(px,py,top,side,r){c.fillStyle=side;c.beginPath();c.roundRect(px+1,py+4,T-2,T-4,r);c.fill();c.fillStyle=top;c.beginPath();c.roundRect(px+1,py+1,T-2,T-9,r);c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1.5;c.beginPath();c.roundRect(px+1,py+1,T-2,T-2,r);c.stroke()}
function wallT(x,y,px,py){const m=MAPS[CM],b=isBorder(x,y),h=hsh(x,y),cx=px+T/2;
 if(CM==0){c.fillStyle=m.f2;c.fillRect(px,py,T,T);if(b){c.fillStyle='#5c9e3e';c.fillRect(px,py,T,T);c.fillStyle='#a8743f';for(const u of[8,T-12])c.fillRect(px+u,py+8,6,T-12);c.fillRect(px,py+16,T,5);c.fillRect(px,py+30,T,5);c.strokeStyle=OL;c.lineWidth=1;c.strokeRect(px,py+16,T,5);c.strokeRect(px,py+30,T,5)}else if(h%2){E(c,cx,py+38,16,6,'rgba(0,0,0,.25)');c.fillStyle='#7a4f2a';c.fillRect(cx-4,py+24,8,16);E(c,cx,py+18,18,16,'#3fa244',OL,2);E(c,cx-6,py+12,7,5,'#6ccf5c')}else{E(c,cx,py+38,16,6,'rgba(0,0,0,.25)');E(c,cx,py+26,18,14,'#9aa2ad',OL,2);E(c,cx-5,py+21,7,4,'#c8ced6');E(c,cx+8,py+32,4,3,'#6ccf5c')}}
 else if(CM==1){block(px,py,'#4a3a42','#231a20',6);c.save();c.shadowColor='#ff5a00';c.shadowBlur=10;c.strokeStyle=`rgba(255,140,30,${.6+.3*Math.sin(tm*4+x)})`;c.lineWidth=2;c.beginPath();c.moveTo(px+8,py+8);c.lineTo(px+20,py+20);c.lineTo(px+16,py+32);c.moveTo(px+20,py+20);c.lineTo(px+38,py+14);c.stroke();c.restore();if(!b&&h%3==0){c.fillStyle='#ffb020';P(c,[[cx-5,py+6],[cx,py-4+Math.sin(tm*12)*2],[cx+5,py+6]],'#ff7a1a')}}
 else if(CM==2){block(px,py,b?'#b8e2fb':'#d8f1ff','#5f9ccc',8);c.fillStyle='rgba(255,255,255,.7)';c.fillRect(px+7,py+6,10,3);if(!b){c.save();c.shadowColor='#6ff';c.shadowBlur=12;P(c,[[cx,py+4],[cx+7,py+20],[cx,py+34],[cx-7,py+20]],'rgba(120,220,255,.85)','#fff',1.5);c.restore()}else{c.fillStyle='#fff';c.fillRect(px+1,py+1,T-2,6)}}
 else if(CM==3){c.fillStyle='#160f2a';c.fillRect(px,py,T,T);if(b){E(c,cx,py+24,24,22,'#1f3a2a',OL,2);E(c,cx-8,py+16,8,6,'#2c5a3a')}else{c.fillStyle='#3b2a2a';c.fillRect(cx-5,py+14,10,32);L(c,cx,py+18,cx-14,py+6,'#3b2a2a',4);L(c,cx,py+22,cx+15,py+10,'#3b2a2a',4);E(c,cx,py+12,18,12,'#2d1f45',OL,2);const gl=Math.sin(tm*2+x*3)>.2;if(gl){E(c,cx-4,py+28,2,2.5,'#ffe36a');E(c,cx+4,py+28,2,2.5,'#ffe36a')}}}
 else if(CM==4){block(px,py,'#24246a','#11113a',4);c.save();c.shadowColor=b?'#00f0ff':'#ff2bd6';c.shadowBlur=8;c.strokeStyle=b?'#00f0ff':'#ff2bd6';c.lineWidth=1.5;c.strokeRect(px+4,py+4,T-8,T-12);c.restore();for(let i=0;i<3;i++)for(let j=0;j<2;j++){c.fillStyle=(h+i+j+Math.floor(tm*2))%4?'rgba(255,240,120,.7)':'rgba(0,240,255,.3)';c.fillRect(px+9+i*11,py+10+j*12,6,6)}}
 else if(CM==5){c.fillStyle=m.f;c.fillRect(px,py,T,T);if(b){block(px,py,'#fff','#e8d0dc',8);c.save();c.beginPath();c.roundRect(px+1,py+1,T-2,T-2,8);c.clip();c.strokeStyle='#ff3d6e';c.lineWidth=6;for(let i=-T;i<T*2;i+=14){c.beginPath();c.moveTo(px+i,py);c.lineTo(px+i+T,py+T);c.stroke()}c.restore()}else{c.fillStyle='#fff';c.fillRect(cx-2,py+26,4,20);const cl=['#ff4d8d','#4dc3ff','#ffd23f','#7ddc5a'][h%4];E(c,cx,py+18,15,15,cl,OL,2);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=3;c.beginPath();for(let a=0;a<12;a+=.3){const r=a*1.1;c.lineTo(cx+Math.cos(a+tm)*r,py+18+Math.sin(a+tm)*r)}c.stroke()}}}
function crateT(x,y,px,py){const cx=px+T/2,cy=py+T/2,h=hsh(x,y);
 if(CM==0){block(px+3,py+3,'#d9a55a','#9b6a2d',5);c.strokeStyle='#7a4a1a';c.lineWidth=3;c.strokeRect(px+7,py+7,T-14,T-16);L(c,px+9,py+9,px+T-9,py+T-12,'#7a4a1a',3)}
 else if(CM==1){E(c,cx,cy+2,18,16,'#6b3a2a',OL,2);c.save();c.shadowColor='#f60';c.shadowBlur=8;L(c,cx-8,cy-4,cx+2,cy+4,'#ffa040',2);L(c,cx+2,cy+4,cx+9,cy-2,'#ffa040',2);c.restore()}
 else if(CM==2){E(c,cx,cy+4,19,14,'#ffffff',OL,2);E(c,cx-2,cy-4,14,10,'#f2fbff');E(c,cx-6,cy-7,4,2,'#fff')}
 else if(CM==3){E(c,cx,cy+3,18,15,'#ff8a1f',OL,2);L(c,cx,cy-10,cx+2,cy-16,'#3a6b2a',3);c.fillStyle='#3a1500';P(c,[[cx-9,cy-1],[cx-4,cy-5],[cx-3,cy]],'#ffe36a');P(c,[[cx+9,cy-1],[cx+4,cy-5],[cx+3,cy]],'#ffe36a');c.beginPath();c.moveTo(cx-8,cy+6);c.lineTo(cx-4,cy+10);c.lineTo(cx,cy+6);c.lineTo(cx+4,cy+10);c.lineTo(cx+8,cy+6);c.strokeStyle='#ffe36a';c.lineWidth=2;c.stroke()}
 else if(CM==4){block(px+3,py+3,'#2b3a6a','#162048',4);c.save();c.shadowColor='#0ff';c.shadowBlur=8;c.strokeStyle='#00f0ff';c.lineWidth=2;c.strokeRect(px+9,py+9,T-18,T-20);c.fillStyle=`rgba(0,240,255,${.4+.3*Math.sin(tm*5+h)})`;c.fillRect(px+14,py+15,T-28,4);c.restore()}
 else{block(px+3,py+3,'#8a4b2a','#5a2d14',4);c.strokeStyle='#5a2d14';c.lineWidth=2;for(const u of[1/3,2/3]){L(c,px+3+(T-6)*u,py+6,px+3+(T-6)*u,py+T-9,'#5a2d14',2)}L(c,px+6,py+T/2-2,px+T-6,py+T/2-2,'#5a2d14',2);E(c,px+12,py+10,4,2,'rgba(255,255,255,.3)')}}

/* ---------- MAP ATMOSPHERE + the two restored live-version maps ---------- */
/* [b3 · 1221-1233] */
const VG=['rgba(10,40,10,.32)','rgba(70,0,0,.45)','rgba(10,40,90,.32)','rgba(10,0,30,.55)','rgba(20,0,60,.45)','rgba(120,30,80,.22)','rgba(0,0,25,.45)','rgba(0,25,5,.5)'];
function vignette(){const WW=W*T,HH=H*T,g=c.createRadialGradient(WW/2,OY+HH/2,Math.min(WW,HH)*.38,WW/2,OY+HH/2,Math.max(WW,HH)*.72);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,VG[CM]||VG[0]);c.fillStyle=g;c.fillRect(0,OY,WW,HH);
 if(CM==1){c.save();c.globalAlpha=.06+.04*Math.sin(tm*2);c.fillStyle='#ff5a00';c.fillRect(0,OY,WW,HH);c.restore()}}
hzc=function(){return['rgba(255,70,20,','rgba(255,70,20,','rgba(120,200,255,','rgba(180,90,255,','rgba(0,240,255,','rgba(255,60,160,','rgba(255,210,63,','rgba(255,120,30,'][CM]||'rgba(255,70,20,'};
const _floorT=floorT;floorT=function(x,y,px,py){_floorT(x,y,px,py);const h=hsh(x,y);
 if(CM==6){c.strokeStyle='rgba(255,255,255,.05)';c.lineWidth=1;c.strokeRect(px+.5,py+.5,T-1,T-1);if(h==3){c.fillStyle='rgba(255,210,63,.12)';c.fillRect(px+20,py+20,8,8)}if(x==CX){c.fillStyle='rgba(255,255,255,.07)';c.fillRect(px+T/2-1,py,2,T)}}
 else if(CM==7){c.fillStyle='rgba(20,70,25,.35)';if(h<3){c.save();c.translate(px+14+h*8,py+16+h*6);c.rotate(h*1.3);E(c,0,0,6,2.5,'#4f9a3a');c.restore()}if(h==5)E(c,px+30,py+30,9,4,'rgba(10,40,10,.35)');if(h==8){for(let i=0;i<5;i++)E(c,px+16+Math.cos(i*1.26)*3,py+18+Math.sin(i*1.26)*3,2.2,2.2,'#ffd23f');E(c,px+16,py+18,1.6,1.6,'#ff7a1a')}}};
const _wallT=wallT;wallT=function(x,y,px,py){if(CM<6)return _wallT(x,y,px,py);const m=MAPS[CM],b=isBorder(x,y),h=hsh(x,y),cx=px+T/2;
 if(CM==6){block(px,py,m.wt,m.w,6);c.strokeStyle=m.a+'66';c.lineWidth=1.5;c.beginPath();c.roundRect(px+1.5,py+1.5,T-3,T-3,6);c.stroke();if(b){c.save();c.beginPath();c.roundRect(px+1,py+1,T-2,8,4);c.clip();for(let i=-T;i<T*2;i+=10){L(c,px+i,py+10,px+i+8,py,'#ffd23f',4)}c.restore()}else{E(c,cx,py+18,6,4,'rgba(255,255,255,.18)')}}
 else{c.fillStyle=m.f2;c.fillRect(px,py,T,T);if(b){E(c,cx,py+26,24,20,'#1f5a2a',OL,2);E(c,cx-9,py+16,9,7,'#2f7a3a');E(c,cx+8,py+20,7,6,'#3a8f45');if(h%3==0)E(c,cx+6,py+12,2.5,2.5,'#ff5a7a')}else{block(px+2,py+2,'#8a8f86','#5c6158',6);c.fillStyle='#4f9a3a';c.beginPath();c.roundRect(px+3,py+3,T-6,9,4);c.fill();L(c,px+12,py+12,px+10,py+24,'#3f8a2e',3);L(c,px+34,py+12,px+36,py+20,'#3f8a2e',3);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1.5;c.beginPath();c.moveTo(px+8,py+30);c.lineTo(px+T-8,py+30);c.stroke()}}};
const _crateT=crateT;crateT=function(x,y,px,py){if(CM<6)return _crateT(x,y,px,py);const m=MAPS[CM];
 if(CM==6){block(px+3,py+3,m.c,m.ce,5);c.strokeStyle=m.ce;c.lineWidth=3;c.strokeRect(px+7.5,py+7.5,T-15,T-17);L(c,px+9,py+9,px+T-9,py+T-12,m.ce,3);L(c,px+T-9,py+9,px+9,py+T-12,m.ce,3)}
 else{block(px+3,py+3,'#d8b25a','#8f6a24',5);for(const u of[11,19,27,35])L(c,px+u,py+7,px+u,py+T-10,'rgba(110,80,25,.6)',2);L(c,px+5,py+16,px+T-5,py+16,'#6b4e1c',3);L(c,px+5,py+30,px+T-5,py+30,'#6b4e1c',3);E(c,px+24,py+16,3,2.5,'#c9a14a',OL,1)}};
/* =====================================================================
   BOMB BATTLE — WORLD LAYER (maps, map enemies, hazards)
   Map look lives in MAPS; layout lives in MCFG; enemy rules live in MENC.
   Everything here is point-symmetric so mirrored 2-player spawns stay fair,
   and everything the guest needs is either synced (G, sq, hazard list) or
   computed from the map index and arena size (wall styles, decorations).
   ===================================================================== */
/* [b4 · 1243-1293] */
const pil=(x,y)=>x%2==0&&y%2==0;
const MD=(x,y)=>Math.abs(x-CX)+Math.abs(y-CY);
const cheb=(x,y,a,b)=>Math.max(Math.abs(x-a),Math.abs(y-b));
/* nearest inner floor cell to (x,y) using the map's wall rule (deterministic) */
function flr(M,x,y){x=Math.max(1,Math.min(W-2,x));y=Math.max(1,Math.min(H-2,y));if(!M.wall(x,y))return[x,y];
 for(let r=1;r<4;r++)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){const a=x+dx*r,b=y+dy*r;if(a>0&&b>0&&a<W-1&&b<H-1&&!M.wall(a,b))return[a,b]}return[x,y]}
/* add a cell and its point mirror */
function addS(o,x,y,v){const m=NPL>2?mir4(x,y):[[x,y],[W-1-x,H-1-y]];for(const[a,b]of m)if(!o.some(q=>q[0]==a&&q[1]==b))o.push([a,b,v])}
function plusS(o,M,x,y,v){for(const[dx,dy]of[[0,0],...DIR]){const a=x+dx,b=y+dy;if(a>0&&b>0&&a<W-1&&b<H-1&&!M.wall(a,b))addS(o,a,b,v)}}
const clr3=(x,y)=>{const a=[CX-3,CY-2];return(NPL>2?mir4(a[0],a[1]):[a,[W-1-a[0],H-1-a[1]]]).some(([p,q])=>cheb(x,y,p,q)<=1)};
const ruinC=(x,y)=>{const r1=[(CX-2)|1,2],r2=[2,(CY-1)|1];for(const[a,b]of[r1,r2])if((NPL>2?mir4(a,b):[[a,b],[W-1-a,H-1-b]]).some(([p,q])=>p==x&&q==y))return 1;return 0};
const lavaC=(x,y)=>(x==3||x==W-4)&&(y==2||y==H-3);
/* sq pad values: 1 slow (bog / jelly / mud), 2-3 teleporters, 4 hazard pad, 5 ice patch, 6 frost rune */
const MCFG=[
 {/* 0 Grassland: centre clearing, dirt paths on the middle row/column, four small crate clusters */
  wall:(x,y)=>pil(x,y)&&MD(x,y)>2?'tree':0,dens:[.43,.455],
  cw:(x,y)=>{const ax=Math.abs(x-CX),ay=Math.abs(y-CY);if(MD(x,y)<=2)return 0;if(x==CX||y==CY)return .3;return Math.abs(ax-Math.round(W*.26))<=1&&Math.abs(ay-Math.round(H*.26))<=1?1.75:.85},pads:()=>[]},
 {/* 1 Lava Kingdom: lava pools + channels in rows 2 and H-3, open boss crater, 4 eruption vents */
  wall:(x,y)=>lavaC(x,y)?'chan':pil(x,y)&&MD(x,y)>(NPL==1?2:3)?(y==2||y==H-3?'pool':'rock'):0,dens:[.5,.435],
  cw:(x,y)=>MD(x,y)<=2?.15:1,
  pads(){const o=[];let[a,b]=flr(this,CX-3,CY);addS(o,a,b,4);[a,b]=flr(this,CX,2);addS(o,a,b,4);return o},
  hz:{k:'e',pad:4,w:1.8,e:[5.5,8.5]}},
 {/* 2 Frozen Fortress: spaced ice pillars, slippery ice patches, two frost runes */
  wall:(x,y)=>pil(x,y)&&MD(x,y)>2&&(Math.ceil(Math.abs(x-CX)/2)+Math.ceil(Math.abs(y-CY)/2))%2==0?'ice':0,dens:[.46,.44],
  cw:(x,y)=>MD(x,y)<=1?.3:1,
  pads(){const o=[];for(const[px,py]of[[CX-4,CY-3],[CX+4,CY-3]]){const[a,b]=flr(this,px,py);plusS(o,this,a,b,5)}const[a,b]=flr(this,CX,2);addS(o,a,b,6);return o},
  hz:{k:'f',pad:6,w:1.8,e:[7,11]}},
 {/* 3 Haunted Forest: dense haunted trees, two dark clearings, cursed bogs */
  wall:(x,y)=>pil(x,y)&&!clr3(x,y)?'tree':0,dens:[.6,.5],
  cw:(x,y)=>{const a=[CX-3,CY-2],d=Math.min(cheb(x,y,a[0],a[1]),cheb(x,y,W-1-a[0],H-1-a[1]));return d<=1?0:d==2?.5:1.05},
  pads(){const o=[];for(const[px,py]of[[CX-2,CY-4],[CX+3,CY-1]]){const[a,b]=flr(this,px,py);addS(o,a,b,1);if(!this.wall(a+1,b)&&a+1<W-1)addS(o,a+1,b,1)}return o}},
 {/* 4 Cyber City: barriers + machinery, crate-free neon lanes linking the teleporters, shock panels */
  wall:(x,y)=>pil(x,y)&&MD(x,y)>2?(hsh(x,y)%3==0?'mach':'bar'):0,dens:[.445,.405],
  cw:(x,y)=>x==CX||y==CY||MD(x,y)<=2?0:1.25,
  pads(){const o=[];for(const[px,py]of[[CX-3,CY-3],[CX+3,CY-3]]){const[a,b]=flr(this,px,py);addS(o,a,b,4)}return o},
  hz:{k:'z',pad:4,w:1.6,e:[6,9]}},
 {/* 5 Candy Kingdom: lollipops ring a wide open centre, jelly puddles */
  wall:(x,y)=>pil(x,y)&&MD(x,y)>3?'lolli':0,dens:[.43,.47],
  cw:(x,y)=>{const d=MD(x,y),r=NPL==1?2:3;return d<=r?0:d==r+1?.5:1.18},
  pads(){const o=[];for(const[px,py]of[[CX-4,CY-2],[CX-2,CY-3],[CX-2,CY]]){const[a,b]=flr(this,px,py);addS(o,a,b,1)}return o}},
 {/* 6 Classic Arena: traditional grid, metal barriers and machinery, open central arena */
  wall:(x,y)=>pil(x,y)&&MD(x,y)>1?(hsh(x,y)%4==0?'mach':'bar'):0,dens:[.435,.4],
  cw:(x,y)=>MD(x,y)<=2?0:1.12,pads:()=>[]},
 {/* 7 Jungle Arena: mossy ruins, central clearing, bushy ambush corners, mud */
  wall:(x,y)=>ruinC(x,y)?'ruin':pil(x,y)&&MD(x,y)>2?(ruinC(x+1,y)||ruinC(x-1,y)||ruinC(x,y+1)||ruinC(x,y-1)?'ruin':'stone'):0,dens:[.465,.455],
  cw:(x,y)=>{if(MD(x,y)<=2)return 0;const c=Math.min(cheb(x,y,1,1),cheb(x,y,W-2,1),cheb(x,y,1,H-2),cheb(x,y,W-2,H-2));return c>=1&&c<=2?1.6:.85},
  pads(){const o=[];for(const[px,py]of[[CX-4,CY+1],[CX+2,CY-4]]){const[a,b]=flr(this,px,py);addS(o,a,b,1)}return o}}];
const mcfg=()=>MCFG[CM]||MCFG[0];
const wkind=(x,y)=>isBorder(x,y)?0:mcfg().wall(x,y);
const mapWall=(x,y)=>!!wkind(x,y);
function mapPads(){const M=mcfg();return M.pads?M.pads.call(M):[]}

/* ---------- MAP HAZARDS (host simulates, guest renders the synced list) ---------- */
/* [b4 · 1333-1348] */
let mh=[],mhT=6;
const mhCells=h=>[[0,0],...DIR].map(([dx,dy])=>[h.x+dx,h.y+dy]).filter(([x,y])=>G[y]&&G[y][x]===0);
function mapHaz(dt){const Z=mcfg().hz;
 if(Z&&st=='play'){mhT-=dt;if(mhT<=0){mhT=rr(Z.e[0],Z.e[1])*(S.mode>=5?1.15:1);
  const pads=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(sq[y][x]==Z.pad&&!mh.some(h=>h.x==x&&h.y==y))pads.push([x,y]);
  if(pads.length){const[x,y]=pads[R()*pads.length|0],pair=NPL>2?mir4(x,y):[[x,y],[W-1-x,H-1-y]];for(const[a,b]of pair)if(!mh.some(h=>h.x==a&&h.y==b))mh.push({x:a,y:b,t:Z.w,ml:Z.w,k:Z.k});tn(Z.k=='f'?1200:Z.k=='z'?700:160,.25,Z.k=='e'?'sawtooth':'sine',.12,Z.k=='f'?-600:200)}}}
 for(const h of mh){h.t-=dt;if(h.t<=0)mhFire(h)}mh=mh.filter(h=>h.t>0)}
function mhFire(h){const cells=mhCells(h);
 if(h.k=='e'){for(const[x,y]of cells)fires.push({x,y,t:.9,l:1,dmg:30,kd:'h'});SFX.boom(0);shk=Math.min(1,shk+.25);for(let i=0;i<10;i++)fxl.push({k:'ember',x:h.x+.5+rr(-.3,.3),y:h.y+.5,vx:rr(-1.5,1.5),vy:rr(-4,-1.5),r:rr(2,4),t:rr(.5,.9),ml:.9,c:R()<.5?'#ffd060':'#ff6a1f'});ring(h.x+.5,h.y+.5,1.6,'#ff8a3d',.4,.3)}
 else if(h.k=='z'){for(const[x,y]of cells)fires.push({x,y,t:.5,l:2,dmg:20,kd:'h'});SFX.zap();for(let i=0;i<6;i++){const a=i*1.05+rr(-.3,.3);fxl.push({k:'bolt',x:h.x+.5,y:h.y+.5,x2:h.x+.5+Math.cos(a)*1.4,y2:h.y+.5+Math.sin(a)*1.4,t:.3,ml:.3,c:'#7ffcff'})}}
 else if(h.k=='f'){for(const p of pl)if(p.alive&&cells.some(([x,y])=>(p.x|0)==x&&(p.y|0)==y)){p.fz=Math.max(p.fz,1.1);txt.push({x:p.x,y:p.y-.8,t:.9,s:'FROZEN!',c:'#bff'})}
  for(const e of en)if(e.t!='b'&&cells.some(([x,y])=>(e.x|0)==x&&(e.y|0)==y))e.st=Math.max(e.st||0,1.6);
  tn(1500,.35,'triangle',.15,-900);nz(.3,.25,5000);for(const[x,y]of cells)for(let i=0;i<3;i++)fxl.push({k:'shard',x:x+.5,y:y+.5,vx:rr(-1.5,1.5),vy:rr(-2,.5),r:rr(3,5),a:R()*6,t:rr(.4,.7),ml:.7,c:'#e8fbff'});ring(h.x+.5,h.y+.5,1.7,'#bff',.45,.3)}}
const _haz3=haz;haz=function(dt){_haz3(dt);mapHaz(dt)};
const padNear=(x,y)=>{for(const[dx,dy]of[[0,0],...DIR]){const v=sq[y+dy]&&sq[y+dy][x+dx];if(v==4||v==6)return 1}return 0};
const _nr3=newRound;newRound=function(){_nr3();mh=[];mhT=S.mode>=5?8:6;reinf=[]};
/* [b4 · 1351-1351] */
function markLava(x,y,t=1.3,k=0){if(G[y]&&G[y][x]!==undefined&&G[y][x]!=1&&!lava.some(l=>l.x==x&&l.y==y))lava.push({x,y,t,k,ml:t})}

/* ---------- MENU TEXT ---------- */
/* [b4 · 1354-1364] */
const BN={lava:'Lava King',frost:'Frost Titan',shadow:'Shadow Lord',mecha:'Mecha Overlord'};
const MDESC=['Sunny meadow with trees, rocks and small wooden crate clusters around an open clearing.',
 'Lava rivers and volcanic rock. Vents glow before they erupt, so keep moving.',
 'Spaced crystal pillars and slippery ice patches. Frost runes flash, then freeze anyone on them.',
 'Haunted trees, cursed bogs that slow you, and two dark clearings.',
 'Neon lanes link two pairs of teleporters. Shock panels spark after a warning.',
 'Sticky jelly slows you down. Lollipops and candy blocks ring a wide open centre.',
 'The traditional grid of metal barriers and machinery around an open central arena.',
 'Mossy ruins, roots and vines. Mud slows you, and bushy corners hide ambushes.'];
function mapInit1(){MAPS.forEach((m,i)=>{const E2=MENC[i];m.d=MDESC[i]+'<br><small class="men">Enemies: '+[...new Set(E2.pool)].map(t=>EN[t][0]+EN[t].slice(1).toLowerCase().replace(/ (\w)/g,(a,b)=>' '+b.toUpperCase())).join(', ')+' · Boss: '+BN[E2.boss]+'</small>'});}cards($('mc'),MAPS,'map',m=>`linear-gradient(135deg,${m.f},${m.w} 50%,${m.a})`);sel();

/* [b4 · 1366-1428] */
/* =====================================================================
   BOMB BATTLE — WORLD ART (tiles, hazard pads, hazard warnings)
   ===================================================================== */
const _wallT3=wallT;wallT=function(x,y,px,py){const k=wkind(x,y),f=k&&WK[k];if(f)f(x,y,px,py);else _wallT3(x,y,px,py)};
function lavaGlow(a){return`rgba(255,${130+Math.round(60*Math.sin(tm*3+a))},30,1)`}
const WK={
 pool(x,y,px,py){const m=MAPS[CM],cx=px+T/2,cy=py+T/2;c.fillStyle=m.f;c.fillRect(px,py,T,T);E(c,cx,cy+2,22,19,'#2a1a1c',OL,2);
  const g=c.createRadialGradient(cx,cy,2,cx,cy,18);g.addColorStop(0,'#fff0a0');g.addColorStop(.35,'#ffb020');g.addColorStop(1,'#d8380f');E(c,cx,cy+1,17,14,g);
  for(let i=0;i<2;i++){const ph=(tm*.8+i*.5+x*.3)%1;E(c,cx-6+i*11,cy+3-i*4,1.5+ph*3,1.5+ph*3,`rgba(255,240,170,${.9*(1-ph)})`)}
  for(const d of[-1,1])if(lavaC(x+d,y))c.fillStyle='#ff8a1f',c.fillRect(d<0?px:cx+12,cy-4,T/2-12,9)},
 chan(x,y,px,py){const m=MAPS[CM];c.fillStyle=m.f;c.fillRect(px,py,T,T);c.fillStyle='#2a1a1c';c.fillRect(px,py+8,T,T-14);
  const g=c.createLinearGradient(px,py+12,px,py+T-10);g.addColorStop(0,'#ff7a1a');g.addColorStop(.5,'#ffd060');g.addColorStop(1,'#e0400f');c.fillStyle=g;c.fillRect(px,py+12,T,T-22);
  c.strokeStyle='rgba(255,250,200,.7)';c.lineWidth=2;for(let i=0;i<3;i++){const o=((tm*22+i*16)%T);c.beginPath();c.moveTo(px+o,py+18+i*4);c.lineTo(px+Math.min(T,o+8),py+18+i*4);c.stroke()}
  c.strokeStyle=OL;c.lineWidth=2;c.strokeRect(px,py+8,T,T-14)},
 rock(x,y,px,py){block(px,py,'#4a3a42','#231a20',9);const h=hsh(x,y);c.save();c.strokeStyle=lavaGlow(x+y);c.lineWidth=2;c.beginPath();c.moveTo(px+9,py+9+h);c.lineTo(px+20,py+20);c.lineTo(px+15,py+31);c.moveTo(px+20,py+20);c.lineTo(px+37,py+13);c.stroke();c.restore();E(c,px+14,py+10,5,3,'rgba(255,255,255,.12)')},
 mach(x,y,px,py){const cy=CM==4,top=cy?'#2a2a72':'#6a76a8',side=cy?'#13133e':'#3f4876';block(px,py,top,side,5);
  c.fillStyle=cy?'#0a0a26':'#262c4c';c.beginPath();c.roundRect(px+7,py+6,T-14,T-18,4);c.fill();
  const cx=px+T/2,yy=py+19;E(c,cx,yy,10,10,cy?'#16164a':'#3a4268',OL,1.5);c.save();c.translate(cx,yy);c.rotate(tm*6+x);c.fillStyle=cy?'#00f0ff':'#ffd23f';for(let i=0;i<3;i++){c.rotate(2.09);c.beginPath();c.ellipse(0,-5,2.4,5,0,0,7);c.fill()}c.restore();E(c,cx,yy,2,2,'#fff');
  for(let i=0;i<3;i++){c.fillStyle=(Math.floor(tm*3)+i+x)%3?(cy?'rgba(255,43,214,.85)':'rgba(125,255,176,.85)'):'rgba(255,255,255,.2)';c.fillRect(px+10+i*10,py+T-12,6,3)}},
 ruin(x,y,px,py){const m=MAPS[CM];c.fillStyle=m.f2;c.fillRect(px,py,T,T);block(px+1,py+2,'#9a9886','#5f5d50',4);
  c.strokeStyle='rgba(40,40,30,.45)';c.lineWidth=1.5;c.beginPath();c.moveTo(px+2,py+16);c.lineTo(px+T-2,py+16);c.moveTo(px+2,py+29);c.lineTo(px+T-2,py+29);c.moveTo(px+18,py+3);c.lineTo(px+18,py+16);c.moveTo(px+30,py+16);c.lineTo(px+30,py+29);c.moveTo(px+14,py+29);c.lineTo(px+14,py+T-6);c.stroke();
  c.fillStyle='#3f8a2e';c.beginPath();c.roundRect(px+2,py+2,T-4,7,4);c.fill();const h=hsh(x,y);L(c,px+8+h,py+8,px+6+h,py+24,'#3f8a2e',3);L(c,px+36-h,py+8,px+38-h,py+30,'#2f7a24',3);E(c,px+7+h,py+25,3,2.2,'#5fb34a');E(c,px+38-h,py+31,3,2.2,'#5fb34a')}};
const _floorT3=floorT;floorT=function(x,y,px,py){_floorT3(x,y,px,py);const h=hsh(x,y);
 if(CM==0){if(MD(x,y)<=2&&h<3){E(c,px+12+h*9,py+34-h*4,3,2,'#ffffff');E(c,px+12+h*9,py+34-h*4,1.2,1.2,'#ffd23f')}if((x==CX||y==CY)&&MD(x,y)>2){c.fillStyle='rgba(150,110,60,.22)';c.beginPath();c.roundRect(px+6,py+6,T-12,T-12,10);c.fill()}}
 else if(CM==3&&clr3(x,y)){c.fillStyle='rgba(5,0,15,.35)';c.fillRect(px,py,T,T);if(h%4==0){E(c,px+12,py+36,3.5,2.2,'#7dffd8');L(c,px+12,py+36,px+12,py+40,'#cfc6ff',1.5)}c.fillStyle=`rgba(200,170,255,${.05+.04*Math.sin(tm*1.5+x+y)})`;c.fillRect(px,py,T,T)}
 else if(CM==4&&(x==CX||y==CY)){c.fillStyle='rgba(0,240,255,.09)';c.fillRect(x==CX?px+18:px,y==CY&&x!=CX?py+18:py,x==CX?12:T,y==CY&&x!=CX?12:T);const o=(tm*1.2+(x+y)*.25)%1;c.fillStyle='rgba(0,240,255,.35)';x==CX?c.fillRect(px+22,py+o*T,4,6):c.fillRect(px+o*T,py+22,6,4)}
 else if(CM==6&&MD(x,y)==3){c.strokeStyle='rgba(255,210,63,.18)';c.lineWidth=2;c.strokeRect(px+4,py+4,T-8,T-8)}
 else if(CM==7){if(h==2||h==9){c.strokeStyle='rgba(90,60,25,.55)';c.lineWidth=3;c.beginPath();c.moveTo(px+4,py+10+h);c.quadraticCurveTo(px+20,py+30,px+T-4,py+18+h);c.stroke()}}};
function padT(x,y,px,py,s){const cx=px+T/2,cy=py+T/2,act=mh.find(h=>h.x==x&&h.y==y),q=act?1-act.t/act.ml:0,pul=act?.5+.5*Math.sin(tm*(10+q*20)):0;
 if(s==5){c.fillStyle='rgba(190,235,255,.75)';c.fillRect(px,py,T,T);c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=2;c.beginPath();c.moveTo(px+6,py+T-12);c.lineTo(px+20,py+8);c.moveTo(px+18,py+T-6);c.lineTo(px+T-8,py+14);c.stroke();c.fillStyle=`rgba(255,255,255,${.3+.3*Math.sin(tm*2+x)})`;c.fillRect(px+8+((tm*20+x*9)%30),py+6,3,3);c.strokeStyle='rgba(90,160,220,.5)';c.lineWidth=1;c.strokeRect(px+.5,py+.5,T-1,T-1);return}
 if(s==6){c.save();c.translate(cx,cy);c.strokeStyle=act?`rgba(255,255,255,${.6+.4*pul})`:'rgba(80,170,230,.75)';c.lineWidth=2.5;E(c,0,0,18,18,act?`rgba(150,230,255,${.25+.35*pul})`:'rgba(150,220,255,.2)',c.strokeStyle,2);c.rotate(tm*.6);for(let i=0;i<6;i++){c.rotate(Math.PI/3);L(c,0,0,0,-13,c.strokeStyle,2);L(c,0,-8,-4,-11,c.strokeStyle,1.5);L(c,0,-8,4,-11,c.strokeStyle,1.5)}c.restore();return}
 if(CM==1){E(c,cx,cy+2,18,14,'#1a0d0d',OL,2);E(c,cx,cy+2,12,9,act?`rgba(255,${180+60*pul},60,1)`:'#7a1f0a');E(c,cx,cy+1,6,4,act?'#fff6c0':'#ff6a1f');if(!act&&R()<fdt*.8)fxl.push({k:'puff',x:x+.5,y:y+.4,vx:0,vy:-.5,r:4,t:.8,ml:.8,c:'rgba(80,60,60,.5)',_s:1})}
 else{c.fillStyle='#1a1d3a';c.beginPath();c.roundRect(px+4,py+4,T-8,T-8,6);c.fill();c.save();c.beginPath();c.roundRect(px+4,py+4,T-8,T-8,6);c.clip();c.strokeStyle=act?'#ff3b5c':'#ffd23f';c.lineWidth=4;for(let i=-T;i<T*2;i+=11){c.beginPath();c.moveTo(px+i,py+T);c.lineTo(px+i+T,py);c.stroke()}c.restore();E(c,cx,cy,10,10,'#0b0d22',OL,2);E(c,cx,cy,6,6,act?`rgba(180,255,255,${.6+.4*pul})`:'#1f6f8a');if(act&&R()<.5)fxl.push({k:'bolt',x:x+.5,y:y+.5,x2:x+.5+rr(-.6,.6),y2:y+.5+rr(-.6,.6),t:.12,ml:.12,c:'#bffcff',_s:1})}}
function bogT(px,py){const cx=px+T/2,cy=py+T/2;if(CM==5){E(c,cx,cy+2,20,15,'rgba(255,90,170,.78)','#d63d86',2);E(c,cx-6,cy-3,7,3.5,'rgba(255,255,255,.65)');E(c,cx+8,cy+6,2,2,'rgba(255,255,255,.7)')}
 else if(CM==3){E(c,cx,cy,20,15,'rgba(80,30,130,.8)','#2a1040',2);E(c,cx,cy,12,8,'rgba(150,80,220,.45)');for(let i=0;i<2;i++){const ph=(tm*.7+i*.5+px*.01)%1;E(c,cx-6+i*12,cy+4-ph*14,1.5+ph*2,1.5+ph*2,`rgba(210,170,255,${.8*(1-ph)})`)}}
 else{E(c,cx,cy,20,15,'rgba(70,42,18,.75)','#3a2410',2);E(c,cx-3,cy-2,12,8,'rgba(110,75,35,.8)');E(c,cx+6,cy+3,2.5,1.5,'rgba(200,170,120,.5)')}}
function hzCol(k){return['#ff5a1f','#ff5a1f','#8fe8ff','#c77dff','#00f0ff','#ff3b5c'][k|0]||'#ff5a1f'}
function lavaDraw(q){const px=q.x*T+T/2,py=OY+q.y*T+T/2,col=q.k?hzCol(q.k):null,a=.25+.3*Math.sin(tm*14);
 c.fillStyle=col?col:hzc()+a+')';if(col){c.globalAlpha=.35+.3*Math.sin(tm*14)}c.beginPath();c.arc(px,py,20,0,7);c.fill();c.globalAlpha=1;
 c.strokeStyle=col||'#ffb070';c.lineWidth=2;c.beginPath();c.arc(px,py,21,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,1-q.t/(q.ml||1.5)));c.stroke();
 c.fillStyle='#fff';c.font='20px Bungee,Impact';c.textAlign='center';c.textBaseline='middle';c.fillText(q.k==2?'❄':'!',px,py);c.textAlign='left'}
function metDraw(q){const px=q.x*T+T/2,py=OY+q.y*T+T/2,k=q.k|0,col=k?hzCol(k):'#ff4040',h=q.t*q.t*T*7;
 c.strokeStyle=col;c.lineWidth=2;c.beginPath();c.arc(px,py,8+q.t*14,0,7);c.stroke();c.globalAlpha=.25;c.fillStyle=col;c.beginPath();c.arc(px,py,16,0,7);c.fill();c.globalAlpha=1;
 if(k==5||k==4){c.save();c.strokeStyle=col;c.lineWidth=1.5;L(c,px-12,py,px+12,py,col,1.5);L(c,px,py-12,px,py+12,col,1.5);c.restore();c.save();c.globalAlpha=Math.min(1,.3+(1.4-q.t));L(c,px,py-h-30,px,py-h,k==5?'rgba(255,80,80,.9)':'rgba(0,240,255,.9)',4);E(c,px,py-h,5,5,'#fff');c.restore();return}
 if(k==2){c.save();c.translate(px,py-h);P(c,[[0,10],[-6,-6],[0,-12],[6,-6]],'#dff8ff','#5aa8de',1.5);c.restore();return}
 if(k==3){c.save();c.globalAlpha=.9;E(c,px,py-h,9,9,'#2a1050','#c77dff',2);E(c,px,py-h,4,4,'#e0b0ff');c.restore();return}
 c.fillStyle='#ff9a3d';c.beginPath();c.arc(px,py-h,9,0,7);c.fill();c.fillStyle='rgba(255,230,140,.8)';c.beginPath();c.arc(px-2,py-h-2,4,0,7);c.fill()}
function mhDraw(){for(const h of mh){const q=1-h.t/h.ml,col=h.k=='f'?'#8fe8ff':h.k=='z'?'#00f0ff':'#ff5a1f',pul=.5+.5*Math.sin(tm*(10+q*22));
  for(const[x,y]of mhCells(h)){const px=x*T,py=OY+y*T;c.globalAlpha=.18+.32*q*pul+.1;c.fillStyle=col;c.fillRect(px+3,py+3,T-6,T-6);c.globalAlpha=1;c.strokeStyle=col;c.lineWidth=2;c.setLineDash([6,4]);c.strokeRect(px+4,py+4,T-8,T-8);c.setLineDash([])}
  const px=(h.x+.5)*T,py=OY+(h.y+.5)*T;c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(px,py,20,-Math.PI/2,-Math.PI/2+Math.PI*2*q);c.stroke()}}
/* top layer: warning outlines drawn above fighters, monsters and bosses so nothing hides them */
function topWarn(){c.save();c.lineWidth=2;
 const mark=(x,y,col,s)=>{const px=x*T+T/2,py=OY+y*T+T/2;c.globalAlpha=.85;c.strokeStyle=col;c.setLineDash([5,4]);c.beginPath();c.arc(px,py,21,tm*3,tm*3+6.3);c.stroke();c.setLineDash([]);c.font='13px Bungee,Impact';c.textAlign='center';c.textBaseline='middle';c.lineWidth=3;c.strokeStyle='#000';c.strokeText(s,px+15,py-15);c.fillStyle=col;c.fillText(s,px+15,py-15);c.lineWidth=2};
 for(const q of lava)mark(q.x,q.y,q.k?hzCol(q.k):'#ffb070',q.k==2?'❄':'!');for(const q of met)mark(q.x,q.y,q.k?hzCol(q.k):'#ff6060','!');
 for(const h of mh)mark(h.x,h.y,h.k=='f'?'#bff':h.k=='z'?'#7ffcff':'#ffb070',h.k=='f'?'❄':'!');
 for(const b of bombs)if(b.t<1.4){const px=(b.x+b.dx*b.k+.5)*T,py=OY+(b.y+b.dy*b.k+.5)*T;c.globalAlpha=.55+.4*Math.sin(tm*20);c.strokeStyle='#ff4040';c.beginPath();c.arc(px,py,19,0,7);c.stroke()}
 c.restore()}
/* hazard flames: 1 lava, 2 electric, 3 ice spikes, 4 shadow energy */
function hzFire(f,px,py,a,fl){const X=px+T/2,Y=py+T/2;
 if(f.l==2){c.fillStyle='rgba(0,200,255,.45)';c.fillRect(px+3,py+3,T-6,T-6);c.strokeStyle='#e8ffff';c.lineWidth=2.5;c.beginPath();c.moveTo(px+6,Y+rr(-6,6));for(let i=1;i<5;i++)c.lineTo(px+6+i*9,Y+rr(-12,12));c.stroke();E(c,X,Y,8*fl,8*fl,'rgba(220,255,255,.9)')}
 else if(f.l==3){E(c,X,Y+4,20*fl,14*fl,'rgba(150,230,255,.55)');for(const[dx,h]of[[-10,16],[0,24],[10,15],[-4,11],[6,12]])P(c,[[X+dx-4,Y+10],[X+dx,Y+10-h*fl],[X+dx+4,Y+10]],'#e8fbff','#5aa8de',1.2)}
 else if(f.l==4){E(c,X,Y,21*fl,21*fl,'rgba(60,10,110,.7)');E(c,X,Y,13*fl,13*fl,'rgba(199,125,255,.75)');E(c,X,Y,5,5,'#f2dcff')}
 else{c.fillStyle='#ff3b1f';c.beginPath();c.arc(X,Y,20*fl,0,7);c.fill();c.fillStyle='#ffd060';c.beginPath();c.arc(X,Y,10,0,7);c.fill()}}
