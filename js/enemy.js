/* [b2 · 327-327] */
const ET={n:{hp:16,sp:1.7,col:'#7a2cff',sc:1},f:{hp:8,sp:2.8,col:'#2cd67a',sc:.75},t:{hp:24,sp:1.1,col:'#c2542d',sc:1.25},b:{hp:75,sp:1.25,col:'#d01f6a',sc:1.9}};
/* monster spawn spots, scaled to the arena (identical to the original list on the 15x13 arena) */
/* [b2 · 478-478] */
function spots(){const o=(x,y)=>{if(G&&G[y]&&G[y][x]==1){for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]])if(G[y+dy]&&G[y+dy][x+dx]!==undefined&&G[y+dy][x+dx]!=1)return[x+dx,y+dy]}return[x,y]};return[o(CX,3),o(CX,H-4),o(3,CY),o(W-4,CY),o(CX-2,CY-1),o(CX+2,CY+1),o(CX-2,CY+1),o(CX+2,CY-1)]}
/* [b2 · 597-602] */
function enUpd(dt){frzT=Math.max(0,frzT-dt);for(const e of en){e.hit=Math.max(0,e.hit-dt);e.sl=Math.max(0,e.sl-dt);e.st=Math.max(0,(e.st||0)-dt);
 if(e.sl<=0&&frzT<=0&&!e.st){let d=(ET[e.t].sp+Math.min(e.t=='b'?.5:1.3,el*.012))*dt;for(let i=0;i<6&&d>0;i++){const dx=e.tx-e.x,dy=e.ty-e.y,ds=Math.abs(dx)+Math.abs(dy);if(ds>d){e.x+=Math.sign(dx)*d;e.y+=Math.sign(dy)*d;d=0}else{e.x=e.tx;e.y=e.ty;d-=ds;if(!pick(e))break}}
  for(const p of pl)if(p.alive&&Math.hypot(p.x-e.x,p.y-e.y)<.4+.22*ET[e.t].sc)hurtM(p,e)}
 if(G[e.y|0][e.x|0]==1){e.hp=0;e.lh=-1}
 const ci=(e.y|0)*W+(e.x|0);if(fa[ci]&&e.hit<=0){e.lh=fa[ci]-2;const cr=fk[ci]=='c',d=cr?15:10;e.hp=Math.max(0,e.hp-d);e.hit=.9;dmgNum(e.x,e.y-.45*ET[e.t].sc,d,cr?'c':fk[ci]=='s'?'s':'n');burst(e.x,e.y,EPC[e.t]||'#fff',10);SFX.ehit(e.t);if(e.t=='b')shk=Math.min(1,shk+.2)}}
 en=en.filter(e=>{if(e.hp>0)return 1;if(e.lh>=0&&ST[e.lh])ST[e.lh].sl++;burst(e.x,e.y,EPC[e.t]||'#fff',e.t=='b'?30:16);txt.push({x:e.x,y:e.y-.6,t:1,s:(EN[e.t]||'ENEMY')+' DOWN!',c:'#d9b3ff'});if(e.t!='b'&&e.t!='m'&&R()<.35)spawnItem(e.x|0,e.y|0,wpick());return 0})}
/* [b2 · 654-659] */
function warn(x,y,t,d=3){G[y][x]=0;pu[y][x]=-1;ws.push({x,y,t,d,md:d})}
function wsUpd(dt){for(const w of ws){w.d-=dt;if(w.d<=0&&G[w.y][w.x]!=1){mk(w.x,w.y,w.t,1);burst(w.x+.5,w.y+.5,ET[w.t].col,18)}}ws=ws.filter(w=>w.d>0)}
function mk(x,y,t,sl=2.5){G[y][x]=0;pu[y][x]=-1;const d=ET[t];en.push({x:x+.5,y:y+.5,tx:x+.5,ty:y+.5,hp:d.hp,mh:d.hp,t,hit:0,sl,fx:0,fy:1,lx:0,ly:0})}
const WV=[['n','n'],['f','f','f','n'],['t','t','f','f'],['n','n','n','n','t','t'],['b','f','f']],SPOTS=[[7,3],[7,9],[3,6],[11,6],[5,5],[9,7],[5,7],[9,5]];
function spawnWave(){const L=WL()[wv-1],sp=spots();L.forEach((t,i)=>{const[x,y]=t=='b'?[CX,CY]:sp[i%8];warn(x,y,t,1.6)});if(L.includes('b')){bossIntro=2.6;sfxBoss()}txt.push({x:W/2,y:H/2,t:1.8,s:L.includes('b')?BOSSES[bossKind()].n+'!':'WAVE '+wv+' / '+WL().length,c:'#ffd23f'});tn(200,.4,'sawtooth',.2,200)}
function coop(dt){if(!pl.some(p=>p.alive))return coopEnd(0);if(!en.length&&!ws.length){if(wv>=WL().length)return coopEnd(1);wvt-=dt;if(wvt<=0){wv++;wvt=2.5;spawnWave()}}}

/* ---------- ENEMIES ---------- */
/* [b3 · 923-924] */
Object.assign(ET,{g:{hp:16,sp:1.5,col:'#cfd8ff',sc:.95},r:{hp:32,sp:1.1,col:'#8f9bb0',sc:1.1},s:{hp:24,sp:2.5,col:'#2a1840',sc:1.05}});
const EN={n:'SLIME',f:'FIRE IMP',t:'ICE MONSTER',g:'GHOST',r:'ROBOT GUARD',s:'SHADOW BEAST',b:'BOSS'};
/* [b3 · 936-936] */
const WL=()=>S.mode==6?BR:menc().waves;
/* [b3 · 956-977] */
const _enUpd=enUpd;enUpd=function(dt){const before=new Set(en);_enUpd(dt);
 for(const e of before)if(!en.includes(e)){deathFX(e);SFX.edie(e.t);if(e.t=='b'){confetti();shk=1;txt.push({x:W/2,y:H/2-1,t:2.2,s:BOSSES[e.bk].n+' DEFEATED!',c:'#ffd23f'});spawnItem(e.x|0,e.y|0,7,1);const[x,y]=freeCell();spawnItem(x,y,wpick(),1);jingle(1);nz(1,.6,400)}}
 pend.forEach(q=>{q.t-=dt;if(q.t<=0)q.f()});pend=pend.filter(q=>q.t>0);
 if(st!='play')return;
 for(const e of en){if(e.atk)e.atk=Math.max(0,e.atk-dt);
  if(e.t=='f'&&R()<dt*12)fxl.push({k:'puff',x:e.x+rr(-.2,.2),y:e.y+.3,vx:0,vy:-.6,r:4,t:.5,ml:.5,c:'#ff8a1f'});
  if(e.t=='t')pl.forEach(p=>{if(p.alive&&Math.hypot(p.x-e.x,p.y-e.y)<1.5)p.slow=.4});
  if(e.t=='s'){e.vt=(e.vt||0)+dt}
  if(e.t=='r'){e.rt-=dt;if(e.rt<=0){e.rt=3.5;const p=targets().sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];if(p&&Math.hypot(p.x-e.x,p.y-e.y)>2&&Math.hypot(p.x-e.x,p.y-e.y)<8){met.push({x:p.x|0,y:p.y|0,t:1.4,k:5});e.atk=.5;tn(1200,.1,'square',.08,-600)}}}
  if(e.t=='b'){
 if(e.ph==1&&e.hp<=e.mh/2){
  e.ph=2;txt.push({x:e.x,y:e.y-1.8,t:2.2,s:'PHASE 2: ENRAGED!',c:'#ff4d5e'});
  sfxBoss();shk=1;ring(e.x,e.y,5.5,BOSSES[e.bk].c,1.2,.5);
  for(let i=0;i<16;i++){const an=i*Math.PI/8;fxLocal({k:'ember',x:e.x+Math.cos(an)*.8,y:e.y+Math.sin(an)*.8,vx:Math.cos(an)*4,vy:Math.sin(an)*4,r:4,t:.8,ml:.8,c:BOSSES[e.bk].c})}
 }
 e.at-=dt*(e.ph==2?1.3:1);
 if(e.at<=0&&e.sl<=0){
  e.at=bossCD();
  bossAttack(e);
  e.atk=e.ph==2?1.1:1.5;
 }
}}};

/* [b4 · 1295-1313] */
/* ---------- MAP ENEMIES & WAVES (kept separate from map appearance) ----------
   pool: enemy types used on the map. waves: Co-op Monster Siege waves ('|' = reinforcements
   arrive a few seconds later or when the first group is nearly gone). surv: Survival pool,
   later entries unlock over time. amb: reinforcements ambush from the far corners. */
const MENC=[
 {pool:['n','g'],boss:'lava',surv:['n','n','g','g'],waves:[['n','n'],['n','n','g'],['n','g','g','|','n'],['n','n','g','g','|','n','g'],['b','n','|','g']]},
 {pool:['f','s'],boss:'lava',surv:['f','f','s','s'],waves:[['f','f'],['f','f','s'],['s','f','f','|','f','f'],['s','s','f','f','|','s','f'],['b','f','f','|','s']]},
 {pool:['t','g'],boss:'frost',surv:['t','g','t','g'],waves:[['t','g'],['t','g','g'],['t','t','g','|','g','g'],['t','t','g','g','|','t'],['b','g','|','t','g']]},
 {pool:['g','s'],boss:'shadow',surv:['g','g','s','s'],waves:[['g','g'],['g','g','s'],['s','s','g','|','g'],['g','g','s','s','|','g','s'],['b','g','s']]},
 {pool:['r'],boss:'mecha',surv:['r','r','r','r'],waves:[['r','r'],['r','r','|','r'],['r','r','r','|','r'],['r','r','r','|','r','r'],['b','r','|','r']]},
 {pool:['n','g'],boss:'shadow',surv:['n','n','g','n'],waves:[['n','n','n'],['n','n','g','g'],['g','g','n','|','n','n','n'],['n','n','n','g','|','g','g'],['b','n','n','|','g']]},
 {pool:['n','f','r'],boss:'mecha',surv:['n','f','r','f','r'],waves:[['n','n','f'],['f','f','r'],['r','n','n','|','f','f'],['r','r','f','n','|','f','n'],['b','f','|','n','r']]},
 {pool:['s','n','g'],boss:'shadow',amb:1,surv:['n','g','s','s'],waves:[['n','n','g'],['s','n','|','n','g'],['s','g','g','|','s','n'],['s','s','g','|','n','n','g'],['b','s','|','g','n']]}];
const menc=()=>MENC[CM]||MENC[0];
/* Shadow Lord minions follow the map; Boss Rush keeps its original mix */
function minion(){if(S.mode==6)return R()<.5?'g':'s';const p=menc().pool.filter(t=>t=='g'||t=='s');return p.length?p[R()*p.length|0]:'g'}
const BKI={lava:1,frost:2,shadow:3,mecha:4};
/* lava-list kind -> hazard flame style (1 lava, 2 electric, 3 ice, 4 shadow) */
const LFX=[1,1,3,4,2,2];

/* [b4 · 1315-1330] */
/* ---------- WAVES ---------- */
let reinf=[];
function spawnWave(){const L=WL()[wv-1],sp=spots(),cut=L.indexOf('|'),now=cut<0?L:L.slice(0,cut),later=cut<0?[]:L.slice(cut+1);let i=0;
 for(const t of now){const[x,y]=t=='b'?[CX,CY]:sp[i++%8];warn(x,y,t,1.6)}
 if(later.length)reinf.push({t:S.mode==6?4:6,L:later,i});
 if(L.includes('b')){bossIntro=2.6;sfxBoss()}
 txt.push({x:W/2,y:H/2,t:1.8,s:L.includes('b')?BOSSES[bossKind()].n+'!':'WAVE '+wv+' / '+WL().length,c:'#ffd23f'});tn(200,.4,'sawtooth',.2,200)}
function ambushSpots(){const cs=[[1,1],[W-2,H-2],[W-2,1],[1,H-2]],ps=pl.filter(p=>p.alive);return cs.map(c=>[c,ps.length?Math.min(...ps.map(p=>Math.hypot(p.x-c[0],p.y-c[1]))):9]).filter(a=>a[1]>3.5).sort((a,b)=>b[1]-a[1]).map(a=>a[0])}
function reinfSpawn(r){const sp=spots(),am=menc().amb&&S.mode!=6?ambushSpots():[];let j=0;
 for(const t of r.L){let[x,y]=am.length?am[j%am.length]:sp[(r.i+j)%8];j++;if(ws.some(w=>w.x==x&&w.y==y)||en.some(e=>(e.x|0)==x&&(e.y|0)==y))[x,y]=sp[(r.i+j+3)%8];if(G[y][x]==1)continue;warn(x,y,t,1.6)}
 txt.push({x:W/2,y:H/2,t:1.3,s:am.length?'AMBUSH!':'REINFORCEMENTS!',c:'#ff8a3d'});tn(260,.3,'sawtooth',.18,160)}
function coop(dt){if(!pl.some(p=>p.alive))return coopEnd(0);
 for(const r of reinf){r.t-=dt;const left=en.filter(e=>e.t!='b').length+ws.length;if(r.t<=0||left<=1){r.t=-1;reinfSpawn(r)}}reinf=reinf.filter(r=>r.t>-1);
 if(!en.length&&!ws.length&&!reinf.length){if(wv>=WL().length)return coopEnd(1);wvt-=dt;if(wvt<=0){wv++;wvt=2.5;spawnWave()}}}
function survWave(small){if(S.mode!=4)return;const pool=menc().surv,lv=Math.min(pool.length,2+(el/25|0)),n=small?1+(el>60):2+(el/40|0),SP=spots();
 for(let i=0;i<n&&en.length<10;i++){const[x,y]=SP[R()*SP.length|0];let t=pool[R()*lv|0];if(t=='r'&&[...en,...ws].filter(e=>e.t=='r').length>=5)continue;if(G[y][x]!=1&&!ws.some(w=>w.x==x&&w.y==y))warn(x,y,t,2)}}

/* [b4 · 1430-1439] */
/* =====================================================================
   BOMB BATTLE — MONSTER ART
   Visual only: every enemy keeps its original speed, health, collision and
   attacks. Animation state is derived from synced fields (position, hit,
   atk, sl, st, vt) so host and guest show the same thing.
   ===================================================================== */
Object.assign(ET.n,{col:'#5ad13a'});Object.assign(ET.f,{col:'#ff6a1f'});Object.assign(ET.t,{col:'#7fd6ff'});Object.assign(ET.s,{col:'#8a3dd6'});Object.assign(ET.g,{col:'#cfd8ff'});Object.assign(ET.r,{col:'#9aa7b5'});
/* draw-only size boost for small monsters (hitboxes unchanged) */
const VSC={f:1.22,g:1.05};
const EPC={n:'#7dff5a',f:'#ffb020',t:'#dff8ff',g:'#e8ecff',r:'#ffd23f',s:'#c77dff',b:'#ffd23f'};
/* [b4 · 1443-1533] */
function eState(e){if(e._lx==null){e._lx=e.x;e._ly=e.y;e._m=0;e._o=R()*6;e._a=0}
 const v=Math.hypot(e.x-e._lx,e.y-e._ly)/(fdt||1/60);e._lx=e.x;e._ly=e.y;e._m+=(Math.min(1,v/1.1)-e._m)*Math.min(1,fdt*8);
 let nd=9;if(pl)for(const p of pl)if(p.alive&&!p.off)nd=Math.min(nd,Math.hypot(p.x-e.x,p.y-e.y));const near=Math.max(0,Math.min(1,(2-nd)/1.2));e._a+=(near-e._a)*Math.min(1,fdt*6);
 const hk=e.hit>0?Math.min(1,Math.max(0,(e.hit-.6)/.3)):0;
 return{mv:e._m,a:Math.max(e._a,e.atk>0?Math.min(1,e.atk/.4):0),hk,fl:e.hit>0&&Math.floor(tm*20)%2,stn:frzT>0||e.st>0,ph:tm+e._o,fx:e.fx||0,fy:e.fy||0}}
const ENDRAW={
 n(e,s){/* SLIME: glossy squishy blob, big eyes, hop with squash and stretch */
  const hp=Math.abs(Math.sin(s.ph*6)),h=s.mv*hp,jy=-h*7,sq=s.mv*(1-hp),sx=1+sq*.2+.05*Math.sin(s.ph*4)+s.hk*.25,sy=1/sx;
  c.save();c.translate(0,13);c.scale(sx,sy);c.translate(0,-13+jy);
  const g=c.createRadialGradient(-6,-9,2,0,0,22);g.addColorStop(0,s.fl?'#fff':'#d8ff9a');g.addColorStop(.45,s.fl?'#eaffea':'#5ad13a');g.addColorStop(1,'#237a18');
  c.beginPath();c.moveTo(-17,11);c.bezierCurveTo(-19,-6,-10,-18,0,-18);c.bezierCurveTo(10,-18,19,-6,17,11);c.quadraticCurveTo(0,17,-17,11);c.fillStyle=g;c.fill();c.strokeStyle=OL;c.lineWidth=2.5;c.stroke();
  E(c,14,7+Math.sin(s.ph*3)*1.5,3,4,'#5ad13a',OL,1.5);E(c,-8,-10,5.5,3.2,'rgba(255,255,255,.75)');E(c,-1,-14,2,1.4,'rgba(255,255,255,.7)');
  if(s.hk>0){for(const d of[-1,1]){L(c,d*6.5-3,-6,d*6.5+3,-2,OL,2.4);L(c,d*6.5-3,2,d*6.5+3,-2,OL,2.4)}}
  else for(const d of[-1,1]){E(c,d*6.5,-3,5.5,6.5,'#fff',OL,1.5);E(c,d*6.5+s.fx*1.8,-2+s.fy*1.8,3,3.6,'#13202a');E(c,d*6.5+s.fx*1.8-1.2,-3.6+s.fy*1.8,1.2,1.2,'#fff')}
  if(s.a>.3){E(c,0,8,3.5,2+3*s.a,'#1a3a12',OL,1.5)}else{c.strokeStyle=OL;c.lineWidth=2;c.beginPath();c.arc(0,6,3.5,.15*Math.PI,.85*Math.PI);c.stroke()}
  E(c,-11,4,2.6,1.6,'rgba(255,120,150,.4)');E(c,11,4,2.6,1.6,'rgba(255,120,150,.4)');c.restore()},
 f(e,s){/* FIRE IMP: horned demon, glowing eyes, flaming hands and feet, lunges when close */
  const jy=-Math.abs(Math.sin(s.ph*11))*3*s.mv,rot=s.fx*.18*s.mv+Math.sin(tm*60)*.05*s.hk;c.save();c.translate(0,jy);c.rotate(rot);
  E(c,0,0,23,23,'rgba(255,120,30,.16)');
  c.strokeStyle='#8a1a0f';c.lineWidth=3;c.beginPath();c.moveTo(7,9);c.quadraticCurveTo(20,12+Math.sin(tm*6)*3,19,2);c.stroke();P(c,[[19,-3],[23,3],[16,3]],'#8a1a0f',OL,1.2);
  const fs=s.mv?Math.sin(s.ph*12)*2:0;flame(c,-6,14+fs,3.5,1);flame(c,6,14-fs,3.5,2);
  const g=c.createRadialGradient(-4,-6,2,0,0,16);g.addColorStop(0,s.fl?'#fff':'#ffc06a');g.addColorStop(.5,s.fl?'#ffe':'#ff5a1f');g.addColorStop(1,'#9a1a0a');
  c.beginPath();c.moveTo(0,-13);c.bezierCurveTo(12,-13,15,4,10,11);c.quadraticCurveTo(0,16,-10,11);c.bezierCurveTo(-15,4,-12,-13,0,-13);c.fillStyle=g;c.fill();c.strokeStyle=OL;c.lineWidth=2.5;c.stroke();
  E(c,0,6,6,5,'rgba(255,215,140,.85)');
  for(const d of[-1,1]){c.beginPath();c.moveTo(d*5,-11);c.quadraticCurveTo(d*15,-14,d*13,-26);c.quadraticCurveTo(d*10,-17,d*1,-12);c.closePath();c.fillStyle='#4a0c0c';c.fill();c.strokeStyle=OL;c.lineWidth=1.6;c.stroke()}
  flame(c,0,-14,3,4);
  for(const d of[-1,1]){E(c,d*5.5,-3,4.5,3.4,'rgba(255,230,80,.35)');P(c,[[d*1.5,-4],[d*9.5,-7],[d*8.5,-1.2]],s.hk?'#fff':'#ffe36a',OL,1.2);E(c,d*6+s.fx,-3.4+s.fy,1,1.6,'#3a0a00')}
  if(s.a>.3){c.beginPath();c.moveTo(-6,4);c.quadraticCurveTo(0,4+7*s.a,6,4);c.closePath();c.fillStyle='#3a0606';c.fill();P(c,[[-4,4],[-3,7],[-2,4]],'#fff');P(c,[[2,4],[3,7],[4,4]],'#fff')}
  else{c.beginPath();c.moveTo(-6,4);for(let i=1;i<=4;i++)c.lineTo(-6+i*3,i%2?7:4);c.strokeStyle=OL;c.lineWidth=1.8;c.stroke()}
  for(const d of[-1,1]){const hx=d*15+s.fx*6*s.a,hy=3-s.a*5+s.fy*6*s.a+(s.mv?Math.sin(s.ph*12+d)*2:0);E(c,hx,hy,3.6,3.6,'#ff5a1f',OL,1.5);flame(c,hx,hy-2,3.2+s.a*2.2,d+5)}
  c.restore()},
 t(e,s){/* ICE MONSTER: hulking frost brute with crystal spikes, frozen armour and cold mist */
  const st=Math.sin(s.ph*5),jy=-Math.abs(st)*2.2*s.mv,rot=st*.06*s.mv;if(R()<fdt*(2+s.mv*4))fxLocal({k:'puff',x:e.x+rr(-.4,.4),y:e.y+.35,vx:rr(-.2,.2),vy:-.15,r:rr(5,8),t:.9,ml:.9,c:'rgba(225,245,255,.35)'});
  c.save();c.translate(0,jy);c.rotate(rot+Math.sin(tm*50)*.04*s.hk);
  c.save();c.globalAlpha*=.3;c.setLineDash([3,5]);E(c,0,0,23,23,null,'#cff4ff',1.5);c.restore();
  E(c,-8,13,6,4,'#2f6fae',OL,2);E(c,8,13,6,4,'#2f6fae',OL,2);
  const g=c.createLinearGradient(0,-16,0,14);g.addColorStop(0,s.fl?'#fff':'#e8fbff');g.addColorStop(.5,s.fl?'#eef':'#8fd6ff');g.addColorStop(1,'#3c8fd0');
  c.beginPath();c.moveTo(-14,12);c.lineTo(-17,-3);c.quadraticCurveTo(-16,-14,-6,-14);c.lineTo(6,-14);c.quadraticCurveTo(16,-14,17,-3);c.lineTo(14,12);c.quadraticCurveTo(0,17,-14,12);c.fillStyle=g;c.fill();c.strokeStyle=OL;c.lineWidth=2.5;c.stroke();
  for(const[x0,h0,w0]of[[-8,10,4],[0,15,5],[8,9,4]])P(c,[[x0-w0,-12],[x0,-12-h0],[x0+w0,-12]],'#dff8ff',OL,1.4),L(c,x0,-12-h0+2,x0,-12,'rgba(120,190,240,.8)',1);
  for(const d of[-1,1])E(c,d*14,-6,6.5,5,'#2f6fae',OL,1.8),E(c,d*13,-8,3,1.5,'rgba(255,255,255,.6)');
  c.fillStyle='#24578f';c.beginPath();c.roundRect(-10,-8,20,6,3);c.fill();
  for(const d of[-1,1]){E(c,d*5,-4,3.6,2.8,'rgba(120,255,255,.35)');E(c,d*5,-4,s.hk?1:2.2,2,'#bfffff')}
  c.fillStyle='#1d3f66';c.beginPath();c.roundRect(-6,2,12,5+3*s.a,2);c.fill();P(c,[[-5,6],[-3.5,1],[-2,6]],'#fff');P(c,[[2,6],[3.5,1],[5,6]],'#fff');
  for(const d of[-1,1]){const fy=4-s.a*14,fx=d*(19-s.a*3);E(c,fx,fy,6,6,'#bfeaff',OL,1.8);P(c,[[fx-3,fy-4],[fx,fy-10],[fx+3,fy-4]],'#e8fbff',OL,1)}
  c.restore()},
 g(e,s){/* GHOST: floating translucent spirit, glowing eyes, fades in and out */
  const fy=Math.sin(s.ph*2.4)*3-3;c.save();c.globalAlpha*=Math.min(1,.66+.18*Math.sin(s.ph*1.6)+.3*s.a);c.translate(Math.sin(tm*60)*2*s.hk,fy);
  if(s.mv>.3&&R()<fdt*8)fxLocal({k:'puff',x:e.x-s.fx*.3,y:e.y+.1-s.fy*.3,vx:0,vy:-.2,r:5,t:.5,ml:.5,c:'rgba(200,215,255,.3)'});
  E(c,0,-2,21,21,'rgba(170,200,255,.2)');E(c,0,-3,16,16,'rgba(220,230,255,.18)');const st2=1+.12*s.a;c.scale(1/st2,st2);
  c.beginPath();c.moveTo(-14,9);c.lineTo(-14,-4);c.arc(0,-4,14,Math.PI,0);c.lineTo(14,9);for(let i=0;i<4;i++)c.lineTo(14-(i*2+1)*3.5-s.fx*3*s.mv,9+(i%2?6:1)+Math.sin(tm*8+i)*2);c.lineTo(-14,9);c.closePath();
  const g=c.createLinearGradient(0,-18,0,14);g.addColorStop(0,'#ffffff');g.addColorStop(1,s.fl?'#ffffff':'#aebcff');c.fillStyle=g;c.fill();c.strokeStyle=OL;c.lineWidth=2;c.stroke();
  for(const d of[-1,1])E(c,d*15,-1+Math.sin(tm*4+d)*2-s.a*5,3.6,3,'#e4e9ff',OL,1.4);
  E(c,-5,-10,4,2.5,'rgba(255,255,255,.9)');
  for(const d of[-1,1]){E(c,d*5,-4,3.6,5,'#1b1f4a');E(c,d*5,-5,1.6+.6*s.a,2.4,'#8ffcff')}
  E(c,0,4,2.4+1.6*s.a,3+2.5*s.a,'#1b1f4a');c.restore()},
 r(e,s){/* ROBOT GUARD: armoured sentry, scanning visor, walking legs, arm blaster */
  const wk=s.ph*9,l1=Math.max(0,Math.sin(wk))*3*s.mv,l2=Math.max(0,-Math.sin(wk))*3*s.mv,sh=Math.sin(tm*70)*2*s.hk,fire=e.atk>0;c.save();c.translate(sh,0);
  c.fillStyle='#3a414c';c.fillRect(-9,7-l1,6,8);c.fillRect(3,7-l2,6,8);E(c,-6,15-l1,5,2.6,'#262b33',OL,1.5);E(c,6,15-l2,5,2.6,'#262b33',OL,1.5);
  const g=c.createLinearGradient(-14,-13,14,11);g.addColorStop(0,s.fl?'#fff':'#eef3f8');g.addColorStop(.5,s.fl?'#eee':'#9aa7b5');g.addColorStop(1,'#56606f');
  c.beginPath();c.roundRect(-14,-13,28,23,6);c.fillStyle=g;c.fill();c.strokeStyle=OL;c.lineWidth=2.5;c.stroke();
  c.fillStyle='rgba(255,255,255,.18)';c.fillRect(-11,-11,22,3);c.fillStyle='#6b7686';c.beginPath();c.roundRect(-7,2,14,6,2);c.fill();E(c,0,5,2,2,fire?'#ff3b3b':'#ffd23f');for(const u of[-11,11])E(c,u,6,1.2,1.2,'#3a414c');
  c.fillStyle='#0d141c';c.beginPath();c.roundRect(-11,-8,22,7,3.5);c.fill();
  const sx=fire?0:Math.sin(tm*2.5+e._o)*7+s.fx*2;E(c,sx,-4.5,fire?9:3.4,2.4,'rgba(255,60,60,.35)');E(c,sx,-4.5,fire?7:2.4,1.6,'#ff4040');
  L(c,6,-13,8,-20,'#4a525e',2);E(c,8,-21,2.3,2.3,Math.sin(tm*5)>0?'#ffd23f':'#6a5a10',OL,1);
  for(const d of[-1,1])E(c,d*15,-7,5,4.5,'#b5c0cc',OL,1.8);
  c.fillStyle='#56606f';c.fillRect(-19,-4,5,10);c.strokeStyle=OL;c.lineWidth=1.5;c.strokeRect(-19,-4,5,10);
  const ay=fire?-10:-2;c.save();c.translate(17,ay);c.fillStyle='#4a525e';c.beginPath();c.roundRect(-3,-2,7,13,2);c.fill();c.stroke();c.fillStyle='#262b33';c.fillRect(-1,10,3,4);if(fire){E(c,.5,15,5,5,'rgba(255,120,60,.6)');E(c,.5,15,2.4,2.4,'#fff6c0')}c.restore();
  if((s.hk>0&&R()<.4)||R()<fdt*.6)fxLocal({k:'spark',x:e.x+rr(-.3,.3),y:e.y+rr(-.3,.1),vx:rr(-2,2),vy:rr(-3,-1),t:.3,ml:.3,c:'#ffe36a'});c.restore()},
 s(e,s){/* SHADOW BEAST: hunched clawed horror wrapped in smoke, vanishes in and out */
  const vis=Math.sin((e.vt||0)*2)>-.6;if(R()<fdt*7)fxLocal({k:'puff',x:e.x+rr(-.4,.4),y:e.y+rr(0,.35),vx:rr(-.2,.2),vy:-.35,r:rr(5,8),t:.6,ml:.6,c:vis?'rgba(40,10,70,.45)':'rgba(40,10,70,.2)'});
  const run=Math.sin(s.ph*14)*s.mv,lean=s.a*3;c.save();c.translate(s.fx*lean+Math.sin(tm*60)*2*s.hk,s.fy*lean);c.save();c.globalAlpha*=vis?1:.22;
  c.scale(1+.06*run,1-.06*run);
  const g=c.createRadialGradient(0,-4,2,0,0,22);g.addColorStop(0,s.fl?'#fff':'#6a3aa8');g.addColorStop(.6,s.fl?'#ddd':'#2a1450');g.addColorStop(1,'#0c0418');
  P(c,[[-18,12],[-16,-2],[-12,-9],[-10,-18],[-5,-11],[-2,-21],[2,-12],[6,-19],[9,-10],[13,-15],[16,-2],[18,12],[0,16]],g,OL,2.5);
  for(const d of[-1,1]){const px=d*12,py=12+(d<0?run:-run)*2;E(c,px,py,5.5,4,'#1a0a30',OL,1.5);for(let i=-1;i<=1;i++)P(c,[[px+i*3-1,py+2],[px+i*3.4,py+7+s.a*2],[px+i*3+1,py+2]],'#efe3ff',OL,.8)}
  c.restore();
  c.save();c.globalAlpha*=vis?1:.7;for(const d of[-1,1]){E(c,d*6,-4,5,3.6,'rgba(255,60,214,.35)');P(c,[[d*2,-5],[d*10,-8],[d*9,-2]],'#ff5ad9')}c.restore();
  c.save();c.globalAlpha*=vis?1:.22;
  if(s.a>.25){c.beginPath();c.moveTo(-8,3);c.quadraticCurveTo(0,4+9*s.a,8,3);c.closePath();c.fillStyle='#4a0020';c.fill();for(let i=0;i<4;i++)P(c,[[-7+i*4,3],[-5.5+i*4,7],[-4+i*4,3]],'#fff')}
  else{c.beginPath();c.moveTo(-8,5);for(let i=0;i<5;i++)c.lineTo(-8+i*4,i%2?9:5);c.strokeStyle='#efe3ff';c.lineWidth=1.5;c.stroke()}
  c.restore();c.restore()},
 b(e,s){drawBoss(e,0,0,s)}};
function drawE(e){const t=e.t,sc=ET[t].sc,px=e.x*T,py=OY+e.y*T,s=eState(e),ap=e.sl>0?Math.min(1,Math.max(0,1-e.sl)*2.5):1;
 c.save();c.translate(px,py);c.save();c.scale(sc,sc);const hop=t=='n'?Math.abs(Math.sin(s.ph*6))*s.mv:t=='g'?.5:0;E(c,0,15,13*(1-hop*.3),5*(1-hop*.3),'rgba(0,0,0,.35)');c.restore();
 if(e.sl>0)c.globalAlpha=.55+.45*ap;const vs=sc*(VSC[t]||1)*(.55+.45*ap);c.scale(vs,vs);if(t!='b'&&e.atk>0)c.scale(1+e.atk*.15,1-e.atk*.1);
 (ENDRAW[t]||ENDRAW.n)(e,s);
 if(s.fl&&t!='b')E(c,0,-2,18,17,'rgba(255,255,255,.35)');
 if(s.stn){c.globalAlpha=.5;E(c,0,0,19,18,'rgba(160,230,255,.35)','#e8fbff',1.5);c.globalAlpha=1}
 c.restore();
 if(s.stn){for(let i=0;i<3;i++){const a=tm*4+i*2.1;star(c,px+Math.cos(a)*14*sc,py-22*sc+Math.sin(a)*4,3.5,'#ffe36a')}}
 if(t!='b'&&e.mh>10){if(e.hd==null)e.hd=e.hp;e.hd=e.hd>e.hp?Math.max(e.hp,e.hd-25*fdt):e.hp;const bw=28,bx=px-bw/2,by=py-28*sc-8;rc(bx-1.5,by-1.5,bw+3,7,3.5,'rgba(5,6,25,.75)');if(e.hd>0)rc(bx,by,bw*e.hd/e.mh,4,2,'rgba(255,255,255,.8)');if(e.hp>0)rc(bx,by,Math.max(4,bw*e.hp/e.mh),4,2,e.hp/e.mh>.5?'#ff8a3d':'#ff4d5e')}}

/* [b4 · 1581-1598] */
/* ---------- DEFEAT ANIMATIONS (fx entry, synced to the guest) ---------- */
function deathFX(e){const sc=ET[e.t].sc;fxl.push({k:'ed',x:e.x,y:e.y,e:e.t,bk:e.bk||'',sc,t:e.t=='b'?1.3:.75,ml:e.t=='b'?1.3:.75});
 const col=EPC[e.t]||'#fff';ring(e.x,e.y,e.t=='b'?4:1.3,col,.5,.3);if(e.t=='b'){shk=1;ring(e.x,e.y,5.5,BOSSES[e.bk||'lava'].c,.9,.5)}}
function drawDeath(f,u){const p=1-u,X=f.x*T,Y=OY+f.y*T,s=f.sc||1,k=f.e;c.save();c.translate(X,Y);c.scale(s,s);
 if(k=='n'){c.globalAlpha=u;E(c,0,12,14+p*12,4+p*3,'rgba(90,209,58,.8)');for(let i=0;i<7;i++){const a=i*.9,d=p*24;E(c,Math.cos(a)*d,12-Math.sin(p*Math.PI)*16+Math.sin(a)*d*.35,3*u+1,3*u+1,'#7dff5a',OL,1)}c.save();c.translate(0,12);c.scale(1+p*.8,Math.max(.05,1-p*1.2));c.translate(0,-12);E(c,0,0,16,14,'#5ad13a',OL,2);c.restore()}
 else if(k=='f'){c.globalAlpha=u;for(let i=0;i<8;i++){const a=i*.785+p,d=6+p*24;flame(c,Math.cos(a)*d,Math.sin(a)*d,4*u+1.5,i)}c.rotate(p*8);c.scale(1-p,1-p);E(c,0,0,13,13,'#ff5a1f',OL,2)}
 else if(k=='t'){c.globalAlpha=u;for(let i=0;i<8;i++){const a=i*.785+.3,d=p*28;c.save();c.translate(Math.cos(a)*d,Math.sin(a)*d+p*p*10);c.rotate(a+p*6);P(c,[[0,-7],[4,0],[0,7],[-4,0]],i%2?'#dff8ff':'#8fd6ff',OL,1.2);c.restore()}E(c,0,0,18*p+4,18*p+4,`rgba(230,250,255,${.5*u})`)}
 else if(k=='g'){c.globalAlpha=u*.8;c.translate(0,-p*26);c.scale(1-p*.4,1+p*.9);c.beginPath();c.moveTo(-13,9);c.lineTo(-13,-4);c.arc(0,-4,13,Math.PI,0);c.lineTo(13,9);c.closePath();c.fillStyle='#eef2ff';c.fill();E(c,-5,-4,3,4,'#1b1f4a');E(c,5,-4,3,4,'#1b1f4a')}
 else if(k=='r'){c.globalAlpha=Math.min(1,u*1.6);c.save();c.translate(-p*16,-Math.sin(p*Math.PI)*22);c.rotate(-p*5);c.fillStyle='#9aa7b5';c.beginPath();c.roundRect(-10,-6,20,8,3);c.fill();c.strokeStyle=OL;c.lineWidth=1.5;c.stroke();E(c,0,-2,2.5,1.5,'#ff4040');c.restore();
  c.save();c.translate(p*8,p*6);c.rotate(p*1.2);c.fillStyle='#6b7686';c.beginPath();c.roundRect(-12,-4,24,16,4);c.fill();c.stroke();c.restore();for(let i=0;i<5;i++){const a=i*1.3;E(c,Math.cos(a)*p*26,Math.sin(a)*p*20,2,2,'#ffd23f')}E(c,0,0,10+p*16,10+p*16,`rgba(255,200,80,${.4*u})`)}
 else if(k=='s'){c.globalAlpha=u;for(let i=0;i<9;i++){const a=i*.698,d=8+p*26;P(c,[[Math.cos(a-.15)*6,Math.sin(a-.15)*6],[Math.cos(a)*d,Math.sin(a)*d],[Math.cos(a+.15)*6,Math.sin(a+.15)*6]],'#2a1450','#c77dff',1)}E(c,0,0,10*(1-p)+2,10*(1-p)+2,'#1a0a30');for(const d of[-1,1])P(c,[[d*2,-5],[d*10,-8],[d*9,-2]],`rgba(255,90,217,${u})`)}
 else if(k=='b'){const bk=f.bk||'lava',col=(BOSSES[bk]||BOSSES.lava).c;c.globalAlpha=u;E(c,0,0,10+p*40,10+p*40,col+'55');for(let i=0;i<12;i++){const a=i*.524+p*2,d=10+p*44;if(bk=='frost'){c.save();c.translate(Math.cos(a)*d,Math.sin(a)*d);c.rotate(a+p*5);P(c,[[0,-8],[4,0],[0,8],[-4,0]],'#dff8ff',OL,1);c.restore()}else if(bk=='lava')flame(c,Math.cos(a)*d,Math.sin(a)*d,5*u+2,i);else E(c,Math.cos(a)*d,Math.sin(a)*d,4*u+1,4*u+1,bk=='shadow'?'#c77dff':'#9ffcff')}c.scale(1-p*.8,1-p*.8);c.rotate(p*3);E(c,0,0,18,17,bk=='lava'?'#4a2016':bk=='frost'?'#bfe9ff':bk=='shadow'?'#1a0a30':'#7d8aa0',OL,2)}
 c.restore()}
const FXD={ed:drawDeath,
 ember(f,u){f.vy+=2*fdt;E(c,f.x*T,OY+f.y*T,f.r,f.r,f.c)},
 shard(f,u){f.vy+=(f.g||4)*fdt;c.save();c.translate(f.x*T,OY+f.y*T);c.rotate(f.a+tm*6);P(c,[[0,-f.r],[f.r*.5,0],[0,f.r],[-f.r*.5,0]],f.c,'rgba(60,140,210,.8)',1);c.restore()},
 spark(f,u){f.vy+=8*fdt;L(c,f.x*T,OY+f.y*T,(f.x-f.vx*.03)*T,OY+(f.y-f.vy*.03)*T,f.c,2)},
 beam(f,u){c.save();c.globalAlpha=.25+.5*(1-u)*(.5+.5*Math.sin(tm*30));L(c,f.x*T,OY+f.y*T,f.x2*T,OY+f.y2*T,f.c,3+6*(1-u));c.restore()}};

/* [b6 · 1884-1898] */
/* ---------- mini slimes (from Slime Split) ---------- */
ET.m={hp:8,sp:2.6,col:'#9cf06a',sc:.6};EN.m='MINI SLIME';EPC.m='#b6ff8a';ENDRAW.m=ENDRAW.n;
const MINI_MAX=6,MINI_LIFE=6.5;

/* ---------- per-type attack configuration ----------
   rng: detection range in tiles. cdN / cdS: cooldown ranges (s) for the normal attack and the special. */
const EAI={
 n:{rng:4.5,cdN:[3,4],cdS:[10,13],nrm:'leap',spc:'split'},
 f:{rng:6,cdN:[3.2,4.2],cdS:[8,11],nrm:'fball',spc:'fdash'},
 t:{rng:5,cdN:[3.6,4.6],cdS:[8,10],nrm:'iwave',spc:'breath'},
 g:{rng:5.5,cdN:[3.2,4.2],cdS:[10,13],nrm:'gstrike',spc:'phase'},
 r:{rng:8,cdN:[3.6,4.6],cdS:[12,15],nrm:'tmiss',spc:'barrage'},
 s:{rng:6.5,cdN:[3.8,4.8],cdS:[12,15],nrm:'pounce',spc:'ambush'}};
/* damage values (players have 100 HP; plain monster contact is 20) */
const EDMG={leap:15,fball:15,dash:15,trail:10,iwave:12,gstrike:15,pounce:18,ambush:20,mini:10,volley:14,orb:10,glacier:10}; /* volley, orb, glacier = boss-only (v4 nerf: were 20 / 15 / 15) */

/* [b6 · 1900-2009] */
let EX=[];               /* enemy projectiles + ground effects, synced to guests */
const EXMAX=70;
function exAdd(o){if(EX.length<EXMAX)EX.push(o);return o}
const fl0=(x,y)=>G[y]&&G[y][x]===0&&!bombs.some(b=>b.x==x&&b.y==y);
const DIR4=[[1,0],[-1,0],[0,1],[0,-1]];
function los(ax,ay,bx,by){const d=Math.hypot(bx-ax,by-ay),n=Math.ceil(d*3);for(let i=1;i<n;i++){const x=(ax+(bx-ax)*i/n)|0,y=(ay+(by-ay)*i/n)|0;if(!G[y]||G[y][x]!==0)return 0}return 1}
/* straight lane of open floor from tile (x,y) in direction (dx,dy) */
function lane(x,y,dx,dy,max){const o=[];for(let i=1;i<=max;i++){const a=x+dx*i,b=y+dy*i;if(!fl0(a,b))break;o.push([a,b])}return o}
/* frost-breath cone: 1 tile, then 3 wide for two tiles; blocked cells stop their column */
function cone(x,y,dx,dy){const o=[],px=dy,py=dx;if(!fl0(x+dx,y+dy))return o;o.push([x+dx,y+dy]);
 for(const l of[-1,0,1]){let ok=1;for(let d=2;d<=3;d++){const a=x+dx*d+px*l,b=y+dy*d+py*l;if(!ok||!(G[b]&&G[b][a]===0)){ok=0;continue}o.push([a,b])}}return o}
function dirTo(e,p){const dx=p.x-e.x,dy=p.y-e.y;return Math.abs(dx)>=Math.abs(dy)?[Math.sign(dx)||1,0]:[0,Math.sign(dy)||1]}
function nearFloor(x,y,avoid){let best=null,bd=9;for(let r=0;r<=2;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const a=x+dx,b=y+dy;if(!fl0(a,b)||(avoid&&avoid(a,b)))continue;const d=Math.abs(dx)+Math.abs(dy);if(d<bd){bd=d;best=[a,b]}}return best}
function eHit(x,y,r,dmg,kd,after){let n=0;for(const p of pl){if(!p.alive||p.off||Math.hypot(p.x-x,p.y-y)>=r)continue;const h0=p.hp,s0=p.shield;hurt(p,0,-1,dmg,kd||'m');if(p.hp<h0||p.shield<s0){n++;after&&after(p)}}return n}
function slowP(p,t){if(!p.alive)return;if(!(p.slow>.3))txt.push({x:p.x,y:p.y-.9,t:.9,s:'SLOWED!',c:'#9ee7ff'});p.slow=Math.max(p.slow||0,t)}
const minis=()=>en.filter(e=>e.t=='m').length;
const robotShots=()=>met.filter(q=>q.rb).length;
const PH=(e)=>{const a=e.ac;return a&&ATK[a.k]?ATK[a.k].ph[a.p]:null};
const phN=e=>{const p=PH(e);return p?p[0]:''};
/* monsters that are currently untouchable (phased ghost, hidden shadow beast) */
const eImm=e=>{const n=phN(e);return n=='phased'||n=='vanish'||n=='hidden'};

/* ---------- attack definitions ----------
   ph: list of [name, duration (s) or fn(e), onEnter(e), onTick(e,dt,u)]; ok(e,p,d) decides if the attack fits. */
const ATK={
 /* SLIME — Slime Leap: squash, aim, jump at the player's tile, land with an impact */
 leap:{ok:(e,p,d)=>d<=3.6&&d>.9,start(e,p){const t=nearFloor(p.x|0,p.y|0);if(!t||Math.abs(t[0]+.5-e.x)+Math.abs(t[1]+.5-e.y)>4.2)return 0;Object.assign(e.ac,{tx:t[0]+.5,ty:t[1]+.5});tn(240,.3,'sine',.14,-110)},
  ph:[['squash',.6],['jump',.5,e=>{e.ac.x0=e.x;e.ac.y0=e.y;tn(330,.32,'sine',.16,380)},(e,dt,u)=>{const a=e.ac;e.x=a.x0+(a.tx-a.x0)*u;e.y=a.y0+(a.ty-a.y0)*u;e.fx=Math.sign(a.tx-a.x0);e.fy=Math.sign(a.ty-a.y0)}],
   ['land',.55,e=>{const a=e.ac;e.x=a.tx;e.y=a.ty;eHit(e.x,e.y,.9,EDMG.leap,'m');ring(e.x,e.y+.2,1.3,'#7dff5a',.35,.2);puff(e.x,e.y+.35,'rgba(120,230,80,.75)',8,9);tn(120,.22,'square',.2,-50);nz(.18,.25,500);shk=Math.min(1,shk+.12)}]]},
 /* SLIME — Slime Split: wobble, then pop into two fast mini slimes that merge back later (once per slime) */
 split:{ok:(e,p,d)=>!e.spl&&d<=5&&e.hp>=e.mh*.5&&minis()<=MINI_MAX-2,start(e){txt.push({x:e.x,y:e.y-.9,t:.8,s:'!',c:'#b6ff8a'});tn(520,.5,'sine',.12,-200)},
  ph:[['wobble',.7],['pop',.1,e=>{e.spl=1;e.shr=MINI_LIFE;let n=0;const x=e.x|0,y=e.y|0;
    for(const[dx,dy]of DIR4.slice().sort(()=>R()-.5)){if(n>=2)break;const a=x+dx,b=y+dy;if(!fl0(a,b)||en.some(o=>(o.x|0)==a&&(o.y|0)==b))continue;mk(a,b,'m',.2);const m=en[en.length-1];m.life=MINI_LIFE;m.par=e;m.x=e.x;m.y=e.y;n++}
    if(!n){e.spl=0;e.shr=0}else{puff(e.x,e.y,'rgba(140,240,90,.8)',10,9);ring(e.x,e.y,1.4,'#b6ff8a',.35,.2);txt.push({x:e.x,y:e.y-.9,t:.9,s:'SPLIT!',c:'#b6ff8a'});tn(700,.12,'square',.14,-400);tn(900,.12,'square',.12,-500,.08)}}],['settle',.4]]},
 /* FIRE IMP — Fireball: stop, glow, charge, aim and throw a fireball */
 fball:{ok:(e,p,d)=>d<=6&&d>1.2&&EX.filter(x=>x.k=='fb').length<10&&los(e.x,e.y,p.x,p.y),start(e){tn(180,.6,'sawtooth',.08,260)},
  ph:[['charge',.7,null,(e,dt)=>{const p=pl[e.ac.tid];if(p&&p.alive){e.ac.tx=p.x;e.ac.ty=p.y;const d=dirTo(e,p);e.fx=d[0];e.fy=d[1]}}],
   ['throw',.12,e=>{const a=e.ac,dx=a.tx-e.x,dy=a.ty-e.y,d=Math.hypot(dx,dy)||1;exAdd({k:'fb',x:e.x+dx/d*.4,y:e.y+dy/d*.4,a:dx/d*5.2,b:dy/d*5.2,t:1.5,ml:1.5,dmg:EDMG.fball});tn(320,.3,'sawtooth',.14,520);nz(.25,.2,900)}],['cool',.5]]},
 /* FIRE IMP — Flame Dash: lane warning, then a charge along it that leaves a short fire trail */
 fdash:{ok:(e,p,d)=>{if(d>5.2)return 0;const x=e.x|0,y=e.y|0,px=p.x|0,py=p.y|0;if(x!=px&&y!=py)return 0;const[dx,dy]=x==px?[0,Math.sign(py-y)]:[Math.sign(px-x),0];if(!dx&&!dy)return 0;const L=lane(x,y,dx,dy,5);return L.some(([a,b])=>a==px&&b==py)},
  start(e,p){const x=e.x|0,y=e.y|0,px=p.x|0,py=p.y|0,[dx,dy]=x==px?[0,Math.sign(py-y)]:[Math.sign(px-x),0];const L=lane(x,y,dx,dy,5);Object.assign(e.ac,{dx,dy,n:L.length,x0:x+.5,y0:y+.5});e.fx=dx;e.fy=dy;e.x=x+.5;e.y=y+.5;txt.push({x:e.x,y:e.y-.9,t:.7,s:'!',c:'#ff8a3d'});tn(150,.7,'sawtooth',.1,120)},
  ph:[['aim',.75],['dash',e=>Math.max(.15,e.ac.n/9),e=>{tn(220,.4,'sawtooth',.18,700);nz(.35,.25,700);e.ac.hit=0},(e,dt,u)=>{const a=e.ac,s=a.n*u;e.x=a.x0+a.dx*s;e.y=a.y0+a.dy*s;const cx=e.x|0,cy=e.y|0;
     if(!EX.some(f=>f.k=='ft'&&f.x==cx&&f.y==cy)&&(cx!=(a.x0|0)||cy!=(a.y0|0)))exAdd({k:'ft',x:cx,y:cy,t:2.2,ml:2.2});if(!a.hit&&eHit(e.x,e.y,.6,EDMG.dash,'h'))a.hit=1;if(R()<.6)fxLocal({k:'ember',x:e.x,y:e.y+.2,vx:rr(-1,1),vy:rr(-2,-.5),r:rr(2,3.5),t:.5,ml:.5,c:R()<.5?'#ffd060':'#ff6a1f'})}],
   ['skid',.6,e=>{const a=e.ac;e.x=a.x0+a.dx*a.n;e.y=a.y0+a.dy*a.n;puff(e.x,e.y+.3,'rgba(120,80,60,.6)',5,8)}]]},
 /* ICE MONSTER — Ice Wave: frost gathers, then a wave of ice runs along the row/column */
 iwave:{ok:(e,p,d)=>{if(d>5.2)return 0;const x=e.x|0,y=e.y|0,px=p.x|0,py=p.y|0;return(Math.abs(x-px)<=0||Math.abs(y-py)<=0)&&!(x==px&&y==py)},
  start(e,p){const x=e.x|0,y=e.y|0,px=p.x|0,py=p.y|0,[dx,dy]=x==px?[0,Math.sign(py-y)]:[Math.sign(px-x),0];const L=lane(x,y,dx,dy,5);if(L.length<2)return 0;Object.assign(e.ac,{dx,dy,n:L.length,x0:x,y0:y});e.fx=dx;e.fy=dy;tn(1500,.8,'sine',.06,-300)},
  ph:[['gather',.85],['wave',e=>e.ac.n*.09,e=>{e.ac.i=0;tn(1300,.45,'triangle',.12,-900);nz(.4,.22,2600)},(e,dt,u)=>{const a=e.ac,k=Math.min(a.n,Math.ceil(u*a.n+.001));while(a.i<k){a.i++;const x=a.x0+a.dx*a.i,y=a.y0+a.dy*a.i;exAdd({k:'iw',x,y,t:1.1,ml:1.1});eHit(x+.5,y+.5,.7,EDMG.iwave,'m',p=>slowP(p,1.2))}}],['rest',.6]]},
 /* ICE MONSTER — Frost Breath: inhale, then a short cone of freezing air that slows (no damage, no freeze) */
 breath:{ok:(e,p,d)=>{if(d>3.4)return 0;const[dx,dy]=dirTo(e,p);return cone(e.x|0,e.y|0,dx,dy).some(([a,b])=>a==(p.x|0)&&b==(p.y|0))},
  start(e,p){const[dx,dy]=dirTo(e,p);Object.assign(e.ac,{dx,dy,x0:e.x|0,y0:e.y|0});e.fx=dx;e.fy=dy;tn(400,.8,'sine',.08,500)},
  ph:[['inhale',.8],['breathe',.65,e=>{nz(.65,.28,3200);tn(900,.6,'sine',.08,-500)},(e,dt)=>{const a=e.ac;for(const[x,y]of cone(a.x0,a.y0,a.dx,a.dy)){for(const p of pl)if(p.alive&&!p.off&&(p.x|0)==x&&(p.y|0)==y)slowP(p,1.8);if(R()<dt*6)fxLocal({k:'puff',x:x+rr(.2,.8),y:y+rr(.2,.8),vx:a.dx*1.5,vy:a.dy*1.5,r:rr(5,9),t:.45,ml:.45,c:'rgba(220,250,255,.55)'})}}],['rest',.6]]},
 /* GHOST — Ghost Strike: fade, glide close, reappear and swipe */
 gstrike:{ok:(e,p,d)=>d<=4.5&&d>.8,start(e){tn(600,.5,'sine',.08,-250)},
  ph:[['fade',.45],['glide',.9,null,(e,dt)=>{const p=pl[e.ac.tid];if(!p||!p.alive){e.ac.t=0;return}const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);if(d<1.05){e.ac.t=0;return}const s=Math.min(d,4.2*dt),nx=e.x+dx/d*s,ny=e.y+dy/d*s;if(G[ny|0]&&G[ny|0][nx|0]===0){e.x=nx;e.y=ny}else e.ac.t=0;const q=dirTo(e,p);e.fx=q[0];e.fy=q[1]}],
   ['windup',.38,e=>{const p=pl[e.ac.tid],a=e.ac;const ang=p?Math.atan2(p.y-e.y,p.x-e.x):Math.atan2(e.fy,e.fx);a.tx=e.x+Math.cos(ang)*.7;a.ty=e.y+Math.sin(ang)*.7;tn(1100,.3,'sine',.1,-700)}],
   ['strike',.12,e=>{const a=e.ac;eHit(a.tx,a.ty,.95,EDMG.gstrike,'m');fxl.push({k:'slash',x:a.tx,y:a.ty,a:Math.atan2(a.ty-e.y,a.tx-e.x),t:.25,ml:.25,c:'#dfe6ff'});tn(300,.2,'square',.12,-200)}],['drift',.6]]},
 /* GHOST — Phase Shift: shimmer, then intangible for a short time (drifts through crates) */
 phase:{ok:(e,p,d)=>d<=6.5&&(!los(e.x,e.y,p.x,p.y)||R()<.4),start(e){tn(500,.6,'sine',.1,300)},
  ph:[['shimmer',.5],['phased',2.2,e=>{puff(e.x,e.y,'rgba(220,225,255,.6)',8,10)},(e,dt)=>{const p=pl[e.ac.tid]&&pl[e.ac.tid].alive?pl[e.ac.tid]:targets()[0];if(!p)return;const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);if(d<.9)return;const s=2.4*dt,nx=e.x+dx/d*s,ny=e.y+dy/d*s;if(G[ny|0]&&G[ny|0][e.x|0]!==1)e.y=ny;if(G[e.y|0]&&G[e.y|0][nx|0]!==1)e.x=nx}],
   ['solid',.45,e=>{if(!fl0(e.x|0,e.y|0)){const f=nearFloor(e.x|0,e.y|0);if(f){e.x=f[0]+.5;e.y=f[1]+.5}}puff(e.x,e.y,'rgba(220,225,255,.6)',6,8);tn(350,.3,'sine',.1,-150)}]]},
 /* ROBOT GUARD — Targeted Missile: scan, lock on with a visible laser, fire one missile */
 tmiss:{ok:(e,p,d)=>d<=8&&d>1.6&&robotShots()<6,start(e){tn(1600,.08,'square',.06)},
  ph:[['scan',.35],['lock',.9,e=>{tn(1800,.06,'square',.07);tn(1800,.06,'square',.07,0,.3);tn(2100,.06,'square',.08,0,.6)},(e,dt)=>{const p=pl[e.ac.tid];if(p&&p.alive){e.ac.tx=p.x;e.ac.ty=p.y;const d=dirTo(e,p);e.fx=d[0];e.fy=d[1]}}],
   ['fire',.15,e=>{const a=e.ac,x=a.tx|0,y=a.ty|0;if(!(G[y]&&G[y][x]!==1))return;met.push({x,y,t:1.1,k:5,rb:1});exAdd({k:'rm',x:e.x,y:e.y-.4,a:x+.5,b:y+.5,t:1.1,ml:1.1});e.atk=.5;tn(500,.25,'sawtooth',.12,600);nz(.2,.2,1500)}],['cool',.6]]},
 /* ROBOT GUARD — Missile Barrage: deploy launcher, three staggered missiles that follow the target */
 barrage:{ok:(e,p,d)=>d<=8&&robotShots()<3,start(e){txt.push({x:e.x,y:e.y-.9,t:.8,s:'!',c:'#ffd23f'});tn(900,.5,'square',.06,300)},
  ph:[['deploy',.65],['salvo',1.05,e=>{e.ac.i=0},(e,dt,u)=>{const a=e.ac;while(a.i<3&&u>=a.i/3){a.i++;const p=pl[a.tid]&&pl[a.tid].alive?pl[a.tid]:null;let x,y;if(p){x=(p.x|0)+(a.i==1?0:(R()*3|0)-1);y=(p.y|0)+(a.i==1?0:(R()*3|0)-1)}else{[x,y]=freeCell()}if(!(G[y]&&G[y][x]===0)){x=p?p.x|0:x;y=p?p.y|0:y}
     met.push({x,y,t:1.25,k:5,rb:1,dmg:20});exAdd({k:'rm',x:e.x+(a.i-2)*.25,y:e.y-.5,a:x+.5,b:y+.5,t:1.25,ml:1.25});e.atk=.4;tn(600,.18,'sawtooth',.11,500)}}],['cool',.8]]},
 /* SHADOW BEAST — Shadow Pounce: crouch, vanish, reappear nearby, mark, pounce */
 pounce:{ok:(e,p,d)=>d<=6&&d>1.2,start(e){tn(110,.5,'sawtooth',.1,-30)},
  ph:[['crouch',.5],['vanish',.3,e=>{puff(e.x,e.y,'rgba(40,10,70,.85)',10,12);tn(250,.25,'sine',.12,-180)}],
   ['emerge',.25,e=>{const p=pl[e.ac.tid];if(!p||!p.alive)return;const px=p.x|0,py=p.y|0;let best=null,bd=1e9;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const a=px+dx,b=py+dy,m=Math.abs(dx)+Math.abs(dy);if(m<2||m>3||!fl0(a,b)||en.some(o=>o!=e&&(o.x|0)==a&&(o.y|0)==b))continue;const s=Math.hypot(a+.5-e.x,b+.5-e.y)+R();if(s<bd){bd=s;best=[a,b]}}if(best){e.x=best[0]+.5;e.y=best[1]+.5}puff(e.x,e.y,'rgba(40,10,70,.85)',8,10)}],
   ['mark',.42,e=>{const p=pl[e.ac.tid];const a=e.ac;if(p&&p.alive){a.tx=(p.x|0)+.5;a.ty=(p.y|0)+.5}else{a.tx=e.x;a.ty=e.y}const q=dirTo(e,{x:a.tx,y:a.ty});e.fx=q[0];e.fy=q[1];tn(160,.35,'sawtooth',.14,-60)}],
   ['lunge',.18,e=>{e.ac.x0=e.x;e.ac.y0=e.y},(e,dt,u)=>{const a=e.ac;e.x=a.x0+(a.tx-a.x0)*u;e.y=a.y0+(a.ty-a.y0)*u}],
   ['claw',.7,e=>{const a=e.ac;if(fl0(a.tx|0,a.ty|0)||G[a.ty|0][a.tx|0]===0){e.x=a.tx;e.y=a.ty}else{e.x=a.x0;e.y=a.y0}eHit(e.x,e.y,.75,EDMG.pounce,'m');fxl.push({k:'slash',x:e.x,y:e.y,a:Math.atan2(e.fy,e.fx),t:.25,ml:.25,c:'#c77dff'});tn(90,.25,'sawtooth',.2,-40);nz(.15,.25,400)}]]},
 /* SHADOW BEAST — Shadow Ambush: dissolve, hide, warning circle on the target area, burst out */
 ambush:{ok:(e,p,d)=>d<=7,start(e){tn(80,.6,'sawtooth',.12,-20)},
  ph:[['dissolve',.45],['hidden',1.3,e=>{const p=pl[e.ac.tid],a=e.ac;let t=p&&p.alive?nearFloor(p.x|0,p.y|0):null;if(!t)t=[e.x|0,e.y|0];a.tx=t[0]+.5;a.ty=t[1]+.5;puff(e.x,e.y,'rgba(30,5,60,.85)',12,12);tn(200,1.2,'sine',.06,-120)}],
   ['burst',.15,e=>{const a=e.ac;e.x=a.tx;e.y=a.ty;eHit(e.x,e.y,1.15,EDMG.ambush,'m');ring(e.x,e.y,1.5,'#c77dff',.4,.2);puff(e.x,e.y,'rgba(60,20,110,.8)',12,12);tn(70,.35,'sawtooth',.25,-20);nz(.3,.35,300);shk=Math.min(1,shk+.2)}],['recover',.8]]}
};
const ACN=Object.keys(ATK);

/* ---------- AI runner ---------- */
function acEnter(e){const a=e.ac,ph=ATK[a.k].ph[a.p];if(!ph){e.ac=null;return}const d=typeof ph[1]=='function'?ph[1](e):ph[1];a.t=a.d=d;ph[2]&&ph[2](e)}
function acEnd(e){e.ac=null;if(!fl0(e.x|0,e.y|0)&&!(G[e.y|0]&&G[e.y|0][e.x|0]===0)){const f=nearFloor(e.x|0,e.y|0);if(f){e.x=f[0]+.5;e.y=f[1]+.5}}e.tx=(e.x|0)+.5;e.ty=(e.y|0)+.5;e.lx=e.ly=0}
function acRun(e,dt){const a=e.ac,A=ATK[a.k],ph=A.ph[a.p];a.t-=dt;if(ph[3])ph[3](e,dt,Math.min(1,1-Math.max(0,a.t)/(a.d||1)));
 if(e.ac&&a.t<=0){a.p++;if(a.p>=A.ph.length)acEnd(e);else acEnter(e)}}
function eAI(dt){const ts=targets(),cap=3+(NPL>2?1:0);let busy=0;for(const e of en)if(e.ac&&e.ac.p<ATK[e.ac.k].ph.length-1)busy++;
 for(const e of en){const C=EAI[e.t];if(!C)continue;
  if(e.cn==null){e.cn=rr(1.5,3);e.cs=rr(4.5,7.5)}
  const stun=e.st>0||frzT>0||e.sl>0;
  if(e.ac){if(stun&&e.ac.p==0){acEnd(e);e.cn=Math.max(e.cn,1)}else if(!stun)acRun(e,dt);continue}
  e.cn-=dt;e.cs-=dt;
  let p=null,bd=1e9;for(const q of ts){const d=Math.hypot(q.x-e.x,q.y-e.y);if(d<bd){bd=d;p=q}}
  e.aw=p&&bd<=C.rng?Math.min(1,(e.aw||0)+dt*3):Math.max(0,(e.aw||0)-dt*2);
  if(stun||!p||bd>C.rng||busy>=cap)continue;
  let k=null;if(e.cs<=0&&ATK[C.spc].ok(e,p,bd))k=C.spc;else if(e.cn<=0&&ATK[C.nrm].ok(e,p,bd))k=C.nrm;if(!k)continue;
  e.ac={k,p:0,t:0,d:1,tid:p.id,tx:p.x,ty:p.y,x0:e.x,y0:e.y,dx:0,dy:0,n:0};
  if(ATK[k].start&&ATK[k].start(e,p)===0){e.ac=null;if(k==C.spc)e.cs=1.5;else e.cn=.8;continue}
  acEnter(e);busy++;
  const m=NPL==1?1.15:1;if(k==C.spc){e.cs=rr(...C.cdS)*m;e.cn=Math.max(e.cn,1.6)}else{e.cn=rr(...C.cdN)*m;e.cs=Math.max(e.cs,2)}}}
/* projectiles and ground effects (host) */
function exUpd(dt){for(const f of EX){f.t-=dt;
  if(f.k=='fb'||f.k=='lb'||f.k=='do'){f.x+=f.a*dt;f.y+=f.b*dt;const x=f.x|0,y=f.y|0;
   if(!G[y]||G[y][x]!==0){f.t=0;puff(f.x-f.a*.04,f.y-f.b*.04,f.k=='do'?'rgba(120,60,200,.7)':'rgba(255,140,40,.7)',5,7);continue}
   if(eHit(f.x,f.y,f.k=='lb'?.55:.48,f.dmg,f.k=='do'?'Q':f.k=='lb'?'B':'h')){f.t=0;ring(f.x,f.y,.9,f.k=='do'?'#c77dff':'#ff8a3d',.3,.2);tn(200,.2,'square',.12,-100)}}
  else if(f.k=='ft'||f.k=='lt'){for(const p of pl)if(p.alive&&!p.off&&(p.x|0)==f.x&&(p.y|0)==f.y)hurt(p,0,-1,EDMG.trail,'h')}
  else if(f.k=='sc'&&f.t<=0&&!f.done){f.done=1;const p=targets().sort((a,b)=>Math.hypot(a.x-f.x,a.y-f.y)-Math.hypot(b.x-f.x,b.y-f.y))[0];if(p){const dx=p.x-f.x,dy=p.y-f.y,d=Math.hypot(dx,dy)||1;exAdd({k:'do',x:f.x,y:f.y,a:dx/d*3,b:dy/d*3,t:3,ml:3,dmg:EDMG.orb})}puff(f.x,f.y,'rgba(60,20,110,.8)',6,10);tn(260,.25,'sine',.12,-160)}}
 EX=EX.filter(f=>f.t>0)}

/* ---------- hook into the monster update ---------- */
/* [b6 · 2012-2023] */
const _enUpdC=enUpd;enUpd=function(dt){const act=[],imm=[];
 for(const e of en){if(e.t=='r')e.rt=99;if(e.ac)act.push([e,e.x,e.y,e.fx,e.fy]);if(eImm(e)){imm.push([e,e.hit]);e.hit=99}}
 _enUpdC(dt);
 for(const[e,x,y,fx,fy]of act){e.x=x;e.y=y;e.fx=fx;e.fy=fy;e.tx=x;e.ty=y}
 for(const[e,h]of imm)e.hit=Math.max(0,h-dt);
 /* mini slimes merge back into their parent (or just pop) when their time is up */
 for(const e of en){if(e.shr>0)e.shr-=dt;if(e.t=='m'){e.life=(e.life||MINI_LIFE)-dt;if(e.life<=0){e.hp=-1;puff(e.x,e.y,'rgba(140,240,90,.7)',5,7);const q=e.par;if(q&&en.includes(q)&&q.hp>0){q.hp=Math.min(q.mh,q.hp+4);ring(q.x,q.y,.9,'#b6ff8a',.3,.2)}}}}
 en=en.filter(e=>e.hp!==-1);
 if(st=='play'){eAI(dt);exUpd(dt)}};
const _hurtMC=hurtM;hurtM=function(p,e){if(eImm(e))return;if(e.t=='m'){hurt(p,0,-1,EDMG.mini,'m');return}_hurtMC(p,e)};
const _deathFXC=deathFX;deathFX=function(e){if(e.t=='m'){puff(e.x,e.y,'rgba(140,240,90,.8)',6,8);ring(e.x,e.y,.8,'#b6ff8a',.3,.2);return}_deathFXC(e);if(e.t=='b')bossDefeatFX(e)};
const _nrC=newRound;newRound=function(){_nrC();EX=[];bossNx=0;wvSeen=-1;wvBan=0};

/* ---------- drawing: monster bodies (pose, fade) ---------- */
/* [b6 · 2026-2093] */
function acU(e){const a=e.ac;return a?Math.min(1,Math.max(0,1-a.t/(a.d||1))):0}
const _drawEC=drawE;drawE=function(e){const n=phN(e),u=acU(e),t=e.t;let al=1,sx=1,sy=1,oy=0;
 if(t=='m'&&e.life<1.2)al=Math.max(.15,e.life/1.2);
 if(e.shr>0){sx*=.82;sy*=.82}
 if(n=='squash'){sx*=1+.28*u;sy*=1-.3*u}else if(n=='jump'){oy=-Math.sin(u*Math.PI)*1.1;sx*=.85;sy*=1.2}else if(n=='land'){const k=Math.max(0,1-u*2.2);sx*=1+.35*k;sy*=1-.32*k}
 else if(n=='wobble'){sx*=1+.12*Math.sin(tm*40);sy*=1-.12*Math.sin(tm*40)}
 else if(n=='charge'||n=='aim'){sx*=1+.06*Math.sin(tm*30)}else if(n=='skid'){sx*=1.12;sy*=.9}
 else if(n=='gather'||n=='inhale'){sx*=1+.08*u;sy*=1+.08*u}else if(n=='breathe'||n=='wave'){sx*=1.08;sy*=.95}
 else if(n=='fade')al=1-.65*u;else if(n=='glide')al=.35;else if(n=='windup'){al=.35+.65*u;sx*=1+.1*u}else if(n=='strike'){sx*=1.15}
 else if(n=='shimmer')al=.6+.3*Math.sin(tm*30);else if(n=='phased')al=.32+.1*Math.sin(tm*12);
 else if(n=='crouch'){sx*=1+.2*u;sy*=1-.25*u}else if(n=='vanish')al=Math.max(0,1-u*1.4);else if(n=='emerge')al=u;else if(n=='mark'){sx*=1.18;sy*=.82}else if(n=='lunge'){sx*=.85;sy*=1.15}
 else if(n=='dissolve')al=1-u;else if(n=='hidden')al=0;else if(n=='burst'){sx*=1.2;sy*=1.2}
 else if(n=='deploy'||n=='lock'){sy*=1+.04*Math.sin(tm*25)}
 if(t=='b'&&bossIntro>0){const k=Math.min(1,Math.max(0,(2.6-bossIntro)/1.1));sx*=.35+.65*k;sy*=.35+.65*k;al=Math.min(al,.25+.75*k)}
 const px=e.x*T,py=OY+e.y*T;
 if(al<=.02){if(R()<.3)fxLocal({k:'puff',x:e.x+rr(-.3,.3),y:e.y+rr(-.1,.3),vx:0,vy:-.3,r:4,t:.4,ml:.4,c:'rgba(40,10,70,.35)'});return}
 if(oy){c.save();c.globalAlpha=.35*(1-Math.sin(u*Math.PI)*.5);E(c,px,py+15,12,4,'rgba(0,0,0,.6)');c.restore()}
 c.save();EA=Math.max(.001,al);c.globalAlpha=1;c.translate(px,py+14+oy*T);c.scale(sx,sy);c.translate(-px,-(py+14));
 try{_drawEC(e)}finally{c.restore();EA=1}
 eOverlay(e,n,u,px,py+oy*T)};
/* glows, eyes and status icons drawn over a monster while it prepares or recovers */
function eOverlay(e,n,u,px,py){const t=e.t;
 if(n=='charge'){c.save();c.globalCompositeOperation='lighter';const r=6+u*10,X=px+e.fx*12,Y=py-6+e.fy*8;const g=c.createRadialGradient(X,Y,0,X,Y,r*1.8);g.addColorStop(0,'#fff6c0');g.addColorStop(.4,'#ffb020');g.addColorStop(1,'rgba(255,80,0,0)');c.fillStyle=g;c.fillRect(X-r*2,Y-r*2,r*4,r*4);c.restore()}
 else if(n=='gather'||n=='inhale'){c.save();for(let i=0;i<6;i++){const a=i*1.047+tm*3,d=(1-u)*26+8;E(c,px+Math.cos(a)*d,py-4+Math.sin(a)*d*.6,2.5,2.5,'rgba(220,250,255,.9)')}c.restore()}
 else if(n=='lock'||n=='scan'){const a=n=='scan'?Math.sin(tm*18)*.5:0;c.save();E(c,px+Math.cos(a)*4,py-18,3,2,'#ff3b3b');c.restore()}
 else if(n=='phased'){c.save();c.strokeStyle='rgba(200,210,255,.85)';c.setLineDash([4,4]);c.lineWidth=2;c.beginPath();c.arc(px,py-2,22+2*Math.sin(tm*8),0,7);c.stroke();c.setLineDash([]);c.restore()}
 else if(n=='crouch'||n=='mark'){c.save();for(const d of[-1,1])E(c,px+d*6,py-6,2.6,1.8,'#ff5ad9');c.restore()}
 else if(n=='wobble'&&R()<.3)fxLocal({k:'puff',x:e.x+rr(-.3,.3),y:e.y+rr(-.3,.2),vx:0,vy:-.4,r:3,t:.3,ml:.3,c:'rgba(160,255,110,.7)'});
 /* "spotted you" marker the moment a monster detects a player */
 if(!e.ac&&EAI[t]&&e.aw>0&&e.aw<1){c.save();c.globalAlpha=Math.sin(e.aw*Math.PI);c.font='16px Bungee,Impact';c.textAlign='center';c.fillStyle='#ffd23f';c.strokeStyle='#000';c.lineWidth=3;c.strokeText('!',px,py-34);c.fillText('!',px,py-34);c.restore()}}

/* ---------- drawing: telegraphs on the ground (under fighters) ---------- */
function cellMark(x,y,col,a,dash){const px=x*T,py=OY+y*T;c.globalAlpha=a;c.fillStyle=col;c.fillRect(px+3,py+3,T-6,T-6);c.globalAlpha=Math.min(1,a+.4);c.strokeStyle=col;c.lineWidth=2;if(dash)c.setLineDash([6,4]);c.strokeRect(px+4,py+4,T-8,T-8);c.setLineDash([]);c.globalAlpha=1}
function groundTele(){const pul=.5+.5*Math.sin(tm*14);
 for(const f of EX){if(f.k=='ft'||f.k=='lt'){const px=f.x*T,py=OY+f.y*T,a=Math.min(1,f.t/.4);c.save();c.globalAlpha=.5*a;rc(px+5,py+5,T-10,T-10,10,'#ff5a1f');c.globalAlpha=.8*a;for(let i=0;i<3;i++)flame(c,px+12+i*12,py+T-12-Math.sin(tm*12+i+f.x)*3,4+2*Math.sin(tm*9+i),i);c.restore()}
  else if(f.k=='iw'){const px=f.x*T,py=OY+f.y*T,a=Math.min(1,f.t/.5);c.save();c.globalAlpha=.65*a;rc(px+3,py+3,T-6,T-6,8,'#bfefff');c.globalAlpha=a;for(let i=0;i<3;i++){const x0=px+10+i*14,h=10+((f.x*7+f.y*3+i*5)%9);P(c,[[x0-5,py+T-8],[x0,py+T-8-h],[x0+5,py+T-8]],'#e8fbff','#5aa8de',1.2)}c.restore()}
  else if(f.k=='wz'){cellMark(f.x,f.y,f.c||'#bff',.18+.25*pul,1)}}
 for(const e of en){const n=phN(e),a=e.ac;if(!a)continue;
  if(a.k=='fdash'&&n=='aim'){for(let i=1;i<=a.n;i++)cellMark((a.x0|0)+a.dx*i,(a.y0|0)+a.dy*i,'#ff6a1f',.15+.25*pul,1)}
  else if(a.k=='iwave'&&n=='gather'){for(let i=1;i<=a.n;i++)cellMark(a.x0+a.dx*i,a.y0+a.dy*i,'#8fe8ff',.12+.22*pul*acU(e),1)}
  else if(a.k=='breath'&&(n=='inhale'||n=='breathe')){for(const[x,y]of cone(a.x0,a.y0,a.dx,a.dy))cellMark(x,y,'#cfefff',n=='breathe'?.45:.1+.22*pul,n!='breathe')}
  else if(a.k=='leap'&&(n=='squash'||n=='jump')){const px=a.tx*T,py=OY+a.ty*T;c.save();c.globalAlpha=.3+.3*pul;E(c,px,py+6,20,10,'rgba(90,209,58,.55)');c.restore()}
  else if(a.k=='ambush'&&n=='hidden'){const px=a.tx*T,py=OY+a.ty*T,q=acU(e);c.save();c.globalAlpha=.25+.3*pul;E(c,px,py,1.15*T,1.15*T*.8,'rgba(90,30,150,.5)');c.restore()}
  else if(a.k=='pounce'&&n=='mark'){cellMark(a.tx|0,a.ty|0,'#c77dff',.2+.3*pul,1)}}}
/* ---------- drawing: projectiles, aim lines and warning outlines (above everything) ---------- */
function topTele(){const pul=.5+.5*Math.sin(tm*14);c.save();
 for(const f of EX){
  if(f.k=='fb'||f.k=='lb'){const X=f.x*T,Y=OY+f.y*T,r=f.k=='lb'?9:7,an=Math.atan2(f.b,f.a);c.save();c.translate(X,Y);c.rotate(an);c.globalAlpha=.55;for(let i=1;i<=4;i++)E(c,-i*5,0,r*(1-i*.18),r*(1-i*.18)*.8,i%2?'#ff6a1f':'#ffb020');c.globalAlpha=1;c.shadowColor='#ff8a1f';c.shadowBlur=14;E(c,0,0,r,r,'#ff7a1f');E(c,1,0,r*.55,r*.55,'#fff2a0');c.restore()}
  else if(f.k=='do'){const X=f.x*T,Y=OY+f.y*T;c.save();c.shadowColor='#c77dff';c.shadowBlur=14;E(c,X,Y,9,9,'#2a1050','#c77dff',2);E(c,X,Y,4,4,'#f0d8ff');c.restore()}
  else if(f.k=='rm'){const q=1-f.t/f.ml,X0=f.x*T,Y0=OY+f.y*T,X1=f.a*T,Y1=OY+f.b*T,h=Math.max(40,Math.hypot(X1-X0,Y1-Y0)*.55),mx=(X0+X1)/2,my=Math.min(Y0,Y1)-h;
   const bz=s=>[(1-s)*(1-s)*X0+2*(1-s)*s*mx+s*s*X1,(1-s)*(1-s)*Y0+2*(1-s)*s*my+s*s*Y1];
   c.globalAlpha=.35;c.strokeStyle='#ffd23f';c.lineWidth=2;c.setLineDash([4,6]);c.beginPath();for(let i=0;i<=16;i++){const[a,b]=bz(i/16);i?c.lineTo(a,b):c.moveTo(a,b)}c.stroke();c.setLineDash([]);c.globalAlpha=1;
   const[a,b]=bz(q),[a2,b2]=bz(Math.min(1,q+.04));c.save();c.translate(a,b);c.rotate(Math.atan2(b2-b,a2-a));c.shadowColor='#ff8a1f';c.shadowBlur=10;P(c,[[-7,-3],[-14-R()*5,0],[-7,3]],'#ffb020');c.beginPath();c.roundRect(-8,-4,14,8,4);c.fillStyle='#d6dcea';c.fill();c.strokeStyle=OL;c.lineWidth=1.5;c.stroke();E(c,5,0,2.4,2.4,'#ff3b3b');c.restore()}
  else if(f.k=='sc'){const X=f.x*T,Y=OY+f.y*T,q=1-f.t/f.ml;c.save();c.globalAlpha=.45+.3*Math.sin(tm*20);E(c,X,Y+4,16,18,'rgba(40,10,80,.8)','#c77dff',2);c.globalAlpha=1;E(c,X,Y-2,3+q*5,3+q*5,'#f0d8ff');for(const d of[-1,1])E(c,X+d*5,Y-6,2,1.4,'#ff5ad9');c.restore()}
  else if(f.k=='tl'){const p=pl[f.a];if(!p||!p.alive)continue;const X=(f.lx!=null?f.lx+.5:p.x)*T,Y=OY+(f.ly!=null?f.ly+.5:p.y)*T,q=1-f.t/f.ml,r=26-q*10;c.save();c.strokeStyle=f.lx!=null?'#ff3b3b':'#00f0ff';c.lineWidth=2.5;c.beginPath();c.arc(X,Y,r,0,7);c.stroke();for(let i=0;i<4;i++){const an=i*Math.PI/2+tm*2;L(c,X+Math.cos(an)*(r-6),Y+Math.sin(an)*(r-6),X+Math.cos(an)*(r+6),Y+Math.sin(an)*(r+6),c.strokeStyle,2.5)}c.restore()}
  else if(f.k=='bt'){const X=f.x*T,Y=OY+f.y*T;c.save();c.globalAlpha=.35+.4*pul;for(let i=0;i<f.a;i++){const an=f.b+i*Math.PI*2/f.a;L(c,X+Math.cos(an)*30,Y+Math.sin(an)*30,X+Math.cos(an)*95,Y+Math.sin(an)*95,'#ff8a3d',4);P(c,[[X+Math.cos(an)*105,Y+Math.sin(an)*105],[X+Math.cos(an+.18)*88,Y+Math.sin(an+.18)*88],[X+Math.cos(an-.18)*88,Y+Math.sin(an-.18)*88]],'#ff8a3d')}c.restore()}}
 for(const e of en){const n=phN(e),a=e.ac;if(!a)continue;const ex=e.x*T,ey=OY+e.y*T;
  if((a.k=='fball'&&n=='charge')){c.globalAlpha=.25+.35*acU(e);c.strokeStyle='#ff8a3d';c.lineWidth=2;c.setLineDash([6,6]);c.beginPath();c.moveTo(ex,ey);c.lineTo(a.tx*T,OY+a.ty*T);c.stroke();c.setLineDash([]);c.globalAlpha=1}
  else if(a.k=='tmiss'&&(n=='lock'||n=='scan')){const X=a.tx*T,Y=OY+a.ty*T;c.globalAlpha=n=='lock'?.5+.4*pul:.3;c.strokeStyle='#ff3b3b';c.lineWidth=1.5;c.beginPath();c.moveTo(ex,ey-16);c.lineTo(X,Y);c.stroke();c.globalAlpha=1;if(n=='lock'){const r=24-acU(e)*12;c.strokeStyle='#ff3b3b';c.lineWidth=2.5;c.beginPath();c.arc(X,Y,r,0,7);c.stroke();L(c,X-r-6,Y,X-r+5,Y,'#ff3b3b',2.5);L(c,X+r-5,Y,X+r+6,Y,'#ff3b3b',2.5);L(c,X,Y-r-6,X,Y-r+5,'#ff3b3b',2.5);L(c,X,Y+r-5,X,Y+r+6,'#ff3b3b',2.5)}}
  else if(a.k=='barrage'&&n=='deploy'){c.font='14px Bungee,Impact';c.textAlign='center';c.fillStyle='#ffd23f';c.fillText('▲▲▲',ex,ey-36)}
  else if(a.k=='leap'&&n!='land'){const X=a.tx*T,Y=OY+a.ty*T;c.strokeStyle='#7dff5a';c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.arc(X,Y,20,0,7);c.stroke();c.setLineDash([])}
  else if(a.k=='ambush'&&n=='hidden'){const X=a.tx*T,Y=OY+a.ty*T,q=acU(e);c.strokeStyle='#c77dff';c.lineWidth=2.5;c.setLineDash([6,5]);c.beginPath();c.arc(X,Y,1.15*T,0,7);c.stroke();c.setLineDash([]);c.lineWidth=3;c.strokeStyle='#fff';c.beginPath();c.arc(X,Y,1.15*T-6,-Math.PI/2,-Math.PI/2+Math.PI*2*q);c.stroke();c.font='20px Bungee,Impact';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#e0b0ff';c.fillText('!',X,Y);c.textBaseline='alphabetic'}
  else if(a.k=='pounce'&&n=='mark'){const X=a.tx*T,Y=OY+a.ty*T;c.strokeStyle='#e0b0ff';c.lineWidth=2.5;for(let i=-1;i<=1;i++)L(c,X-10+i*7,Y-12,X+2+i*7,Y+12,'#e0b0ff',2.5)}
  else if(a.k=='gstrike'&&n=='windup'){const X=a.tx*T,Y=OY+a.ty*T;c.strokeStyle='#dfe6ff';c.lineWidth=2;c.setLineDash([4,4]);c.beginPath();c.arc(X,Y,.95*T,0,7);c.stroke();c.setLineDash([])}
  else if(a.k=='fdash'&&n=='aim'){const X=((a.x0|0)+a.dx*a.n+.5)*T,Y=OY+((a.y0|0)+a.dy*a.n+.5)*T;c.globalAlpha=.6+.4*pul;L(c,ex,ey,X,Y,'#ff6a1f',3);P(c,[[X+a.dx*10,Y+a.dy*10],[X-a.dx*4+a.dy*9,Y-a.dy*4+a.dx*9],[X-a.dx*4-a.dy*9,Y-a.dy*4-a.dx*9]],'#ff6a1f');c.globalAlpha=1}}
 c.restore()}
const _mhDrawC=mhDraw;mhDraw=function(){_mhDrawC();groundTele()};
const _topWarnC=topWarn;topWarn=function(){_topWarnC();topTele()};
/* 3-4 player online sieges: one extra monster in the middle waves */
/* [b6 · 2124-2134] */
const _spawnWaveC=spawnWave;spawnWave=function(){_spawnWaveC();if(NPL>2&&S.mode==5&&wv>=2&&wv<WL().length){const P=menc().pool,[x,y]=spots()[(wv*3)%8];if(G[y][x]!=1&&!ws.some(w=>w.x==x&&w.y==y))warn(x,y,P[R()*P.length|0],1.8)}};

/* ---------- online: monster actions + effect list ride along with each snapshot ---------- */
const _snapC=snap;snap=function(){const o=_snapC();
 o.ea=en.map(e=>e.ac||e.shr>0||e.t=='m'?[e.ac?ACN.indexOf(e.ac.k):-1,e.ac?e.ac.p:0,e.ac?f2(e.ac.t):0,e.ac?f2(e.ac.d):1,e.ac?f2(e.ac.tx):0,e.ac?f2(e.ac.ty):0,e.ac?f2(e.ac.x0):0,e.ac?f2(e.ac.y0):0,e.ac?e.ac.dx:0,e.ac?e.ac.dy:0,e.ac?e.ac.n:0,e.ac?e.ac.tid:0,f2(e.shr||0),f2(e.life||0)]:0);
 o.ex=EX.map(f=>[f.k,f2(f.x),f2(f.y),f2(f.t),f2(f.ml),f2(f.a||0),f2(f.b||0),f.c||'',f.lx==null?-1:f.lx,f.ly==null?-1:f.ly]);o.aw=en.map(e=>e.aw>0?f2(e.aw):0);return o};
const _applySnapC=applySnap;applySnap=function(m){const q0=net.sqr;_applySnapC(m);if(net.sqr!==m.q||q0===m.q)return;
 const ea=m.ea||[],aw=m.aw||[];en.forEach((e,i)=>{const a=ea[i];e.aw=aw[i]||0;if(!a){e.ac=null;e.shr=0;e.life=0;return}e.shr=a[12];e.life=a[13]||undefined;
  if(a[0]<0){e.ac=null;return}const k=ACN[a[0]];e.ac=Object.assign(e.ac&&e.ac.k==k?e.ac:{},{k,p:a[1],t:a[2],d:a[3],tx:a[4],ty:a[5],x0:a[6],y0:a[7],dx:a[8],dy:a[9],n:a[10],tid:a[11]})});
 EX=(m.ex||[]).map(a=>({k:a[0],x:a[1],y:a[2],t:a[3],ml:a[4],a:a[5],b:a[6],c:a[7]||undefined,lx:a[8]<0?undefined:a[8],ly:a[9]<0?undefined:a[9]}))};
const _guestTickC=guestTick;guestTick=function(dt){_guestTickC(dt);for(const f of EX){f.t=Math.max(0,f.t-dt);if(f.k=='fb'||f.k=='lb'||f.k=='do'){f.x+=f.a*dt;f.y+=f.b*dt}}for(const e of en){if(e.ac)e.ac.t=Math.max(0,e.ac.t-dt);if(e.shr>0)e.shr-=dt;if(e.life>0)e.life-=dt}};
