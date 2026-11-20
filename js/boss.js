/* [b3 · 925-935] */
const BOSSES={lava:{n:'THE LAVA KING',c:'#ff6a1f'},frost:{n:'FROST TITAN',c:'#7fe0ff'},shadow:{n:'THE SHADOW LORD',c:'#b06bff'},mecha:{n:'MECHA OVERLORD',c:'#00f0ff'}};
const BR_ORDER=['lava','frost','shadow','mecha'];
/* Boss Rush order: the host shuffles BRO at the start of every run and sends it in every snapshot (bo),
   so guests (also late joiners / rejoiners) always fight the same boss at the same time.
   Escorts belong to the boss (same mix as before); how many depends only on the fight's position: 0,1,1,2. */
const BR_ESC={lava:['n','n'],frost:['n','n'],shadow:['g','s'],mecha:['r','r']},BR_NE=[0,1,1,2];
let BRO=BR_ORDER.slice(),BR=[];
function brBuild(){BR=BRO.map((k,i)=>['b',...BR_ESC[k].slice(0,BR_NE[i]||0)])}brBuild();
function brShuffle(){const a=BR_ORDER.slice();for(let i=a.length-1;i>0;i--){const j=R()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}BRO=a;brBuild()}
function brApply(s){if(typeof s!='string')return;const a=s.split(',');if(a.length!=BR_ORDER.length||new Set(a).size!=a.length||!a.every(k=>BOSSES[k]))return;if(a.join()!=BRO.join()){BRO=a;brBuild()}}
WV.splice(0,WV.length,['n','n'],['f','f','g','n'],['t','t','g','f'],['r','s','n','n','t'],['b','f','g']);
/* [b3 · 937-937] */
const bossKind=()=>S.mode==6?BRO[Math.max(0,wv-1)%BRO.length]:menc().boss;
/* Boss health (v4 nerf). A bomb hit deals 10 (critical 15).
   Co-op Siege: 70 for 2 players (was 85). Boss Rush rises with the fight's POSITION, not the boss, so whichever
   boss comes last is the toughest: 70 / 85 / 100 / 115 (was 95 / 125 / 150 / 180).
   Solo x0.8 (was x0.82); every online player beyond 2 adds +12% (was +18%). */
/* [b3 · 942-948] */
function bossHP(){let h=S.mode==6?55+15*Math.max(1,Math.min(4,wv)):70;if(NPL==1)h=Math.round(h*.8/5)*5;else if(NPL>2)h=Math.round(h*(1+.12*(NPL-2))/5)*5;return Math.max(25,h)}
/* seconds between boss attacks: Siege 4.0 (was 3.0); Boss Rush 4.0 / 3.8 / 3.6 / 3.4 by position (was 2.75 / 2.5 / 2.25 / 2.0); solo +15% */
function bossCD(){return(S.mode==6?4.2-.2*Math.max(1,Math.min(4,wv)):4)*(NPL==1?1.15:1)}
/* boss damage + safety. Boss hits use kd 'B' (hazard, shown as 'h') or 'Q' (melee, shown as 'm');
   every boss hit that lands grants at least BDMG.grace seconds of invulnerability, so no chain hits. */
const BDMG={touch:22,tile:20,met:22,fire:.6,warn:.5,grace:1.6};
const _hurtB=hurt;hurt=function(p,force,by,dmg,kd){if(kd!='B'&&kd!='Q')return _hurtB(p,force,by,dmg,kd);const h0=p?p.hp:0;_hurtB(p,force,by,dmg,kd=='B'?'h':'m');if(p&&p.alive&&p.hp<h0)p.inv=Math.max(p.inv||0,BDMG.grace)};
/* [b3 · 950-951] */
function sfxBoss(){tn(70,1.2,'sawtooth',.35,-30);tn(110,1,'square',.15,-50,.2);nz(.9,.5,300)}
const _mk=mk;mk=function(x,y,t,sl){_mk(x,y,t,sl);const e=en[en.length-1];if(t=='b'){e.bk=bossKind();e.hp=e.mh=bossHP();e.at=3.5;e.ph=1}if(t=='r')e.rt=2.5;if(t=='s')e.vt=R()*3};
/* [b3 · 1024-1038] */
function bossBar(){const b=en.find(e=>e.t=='b');if(!b)return;
 if(b.hd==null)b.hd=b.hp;b.hd=b.hd>b.hp?Math.max(b.hp,b.hd-Math.max(6,(b.hd-b.hp)*2)*fdt):b.hp;
 if(b.hv==null)b.hv=b.hp;b.hv+=(b.hp-b.hv)*Math.min(1,fdt*12);
 const B=BOSSES[b.bk]||BOSSES.lava,w=Math.min(440,W*T-160),x=(W*T-w)/2,y=OY+6;
 c.save();
 if(b.ph==2){c.shadowColor='#ff4d5e';c.shadowBlur=12}
 rc(x-5,y-3,w+10,26,13,b.ph==2?'rgba(40,10,20,.92)':'rgba(5,6,25,.88)');
 c.shadowBlur=0;
 rc(x,y+2,w,16,8,'#1c0c18');
 if(b.hd>0)rc(x,y+2,w*Math.max(0,b.hd/b.mh),16,8,'rgba(255,245,210,.85)');
 if(b.hv>0)rc(x,y+2,Math.max(16,w*Math.max(0,b.hv/b.mh)),16,8,b.ph==2?'#ff4d5e':B.c);
 c.fillStyle='rgba(255,255,255,.28)';c.fillRect(x+8,y+4,Math.max(0,w*Math.max(0,b.hv/b.mh)-16),3);
 c.font='12px Bungee,Impact';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=3;
 const s=B.n+'  '+Math.ceil(b.hp)+' / '+b.mh+(b.ph==2?' · [ENRAGED]':'');
 c.strokeText(s,W*T/2,y+10);c.fillText(s,W*T/2,y+10);c.restore()}

/* [b4 · 1535-1579] */
/* ---------- BOSSES (bigger silhouettes, same hitbox) ---------- */
function drawBoss(e,px,py,s){s=s||eState(e);const k=e.bk||'lava',ph2=e.ph==2,a=e.atk>0?Math.min(1,e.atk/.45):0,sh=Math.sin(tm*60)*1.5*s.hk,B=BOSSES[k]||BOSSES.lava;c.save();c.translate(sh,0);
 const aura=(col,r)=>{c.save();c.globalAlpha=(ph2?.32:.18)+.08*Math.sin(tm*4);E(c,0,0,r,r,col);c.restore()};
 if(k=='lava'){aura('#ff5a1f',30+(ph2?4:0));if(R()<fdt*(ph2?14:7))fxLocal({k:'ember',x:e.x+rr(-.6,.6),y:e.y+rr(-.2,.4),vx:rr(-.4,.4),vy:rr(-2,-1),r:rr(1.5,3),t:.8,ml:.8,c:R()<.5?'#ffd060':'#ff6a1f'});
  const bb=Math.sin(tm*2)*1.2;
  for(const d of[-1,1]){const fx=d*(22-a*3),fy=6-a*16+bb;E(c,fx,fy,8.5,7.5,'#3a1a12',OL,2);L(c,fx-4,fy-1,fx+1,fy+3,lavaGlow(d),1.6);L(c,fx+1,fy+3,fx+5,fy-2,lavaGlow(d+1),1.6);if(a>.2)flame(c,fx,fy-6,3+a*2,d)}
  const g=c.createRadialGradient(0,2,3,0,2,21);g.addColorStop(0,s.fl?'#fff':'#7a2a14');g.addColorStop(1,'#2a0e08');E(c,0,3+bb,19,17,g,OL,2.5);
  c.save();c.strokeStyle=lavaGlow(0);c.lineWidth=2;c.beginPath();c.moveTo(-14,-2);c.lineTo(-7,5);c.lineTo(-11,13);c.moveTo(14,0);c.lineTo(7,6);c.lineTo(12,13);c.moveTo(-3,14);c.lineTo(0,10);c.lineTo(3,15);c.stroke();c.restore();
  for(const d of[-1,1])P(c,[[d*8,-6],[d*19,-4],[d*18,6],[d*10,4]],'#4a2016',OL,1.6);
  const cg=c.createRadialGradient(0,5,0,0,5,8);cg.addColorStop(0,'#fff');cg.addColorStop(.4,ph2?'#fff3a0':'#ffd060');cg.addColorStop(1,'rgba(255,90,20,0)');E(c,0,5+bb,8+Math.sin(tm*6)*1,8,cg);
  E(c,0,-10+bb,11,9,'#4a2016',OL,2);
  for(const d of[-1,1]){c.beginPath();c.moveTo(d*7,-15+bb);c.quadraticCurveTo(d*20,-17,d*19,-29);c.quadraticCurveTo(d*14,-20,d*3,-17);c.closePath();c.fillStyle='#1d0c08';c.fill();c.strokeStyle=OL;c.lineWidth=1.5;c.stroke()}
  P(c,[[-9,-15+bb],[-10,-24+bb],[-5,-19+bb],[0,-27+bb],[5,-19+bb],[10,-24+bb],[9,-15+bb]],'#ffc21a',OL,1.6);for(const[x0,y0]of[[-10,-24],[0,-27],[10,-24]])flame(c,x0,y0-2+bb,2.4,x0);E(c,0,-18+bb,2,2,'#ff3b3b');
  for(const d of[-1,1])P(c,[[d*2,-11+bb],[d*8,-13+bb],[d*7,-8.5+bb]],'#fff6b0');
  c.beginPath();c.arc(0,-6+bb,4+a*2,.1*Math.PI,.9*Math.PI);c.fillStyle='#ffb020';c.fill()}
 else if(k=='frost'){aura('#7fe0ff',30+(ph2?4:0));if(R()<fdt*8)fxLocal({k:'shard',x:e.x+rr(-.8,.8),y:e.y+rr(-.6,.2),vx:rr(-.3,.3),vy:.3,r:2,a:R()*6,t:1,ml:1,c:'#ffffff'});
  const bb=Math.sin(tm*1.6)*1;
  for(const d of[-1,1]){const fx=d*(23-a*2),fy=7-a*15;E(c,fx,fy,8,7,'#bfeaff',OL,2);P(c,[[fx-4,fy-5],[fx-1,fy-12],[fx+2,fy-5]],'#e8fbff',OL,1);P(c,[[fx+1,fy-5],[fx+5,fy-10],[fx+5,fy-3]],'#e8fbff',OL,1)}
  const g=c.createLinearGradient(0,-14,0,16);g.addColorStop(0,s.fl?'#fff':'#f0fcff');g.addColorStop(.5,s.fl?'#eef':'#9adfff');g.addColorStop(1,'#3a86c8');
  P(c,[[-15,13],[-19,-1],[-12,-12],[12,-12],[19,-1],[15,13],[0,17]],g,OL,2.5);L(c,-12,-12,-4,4,'rgba(255,255,255,.5)',1.2);L(c,12,-12,4,4,'rgba(60,130,200,.5)',1.2);L(c,-4,4,4,4,'rgba(255,255,255,.4)',1.2);
  for(const d of[-1,1]){for(const[ox,oy,h,w]of[[13,-10,14,4],[19,-6,11,3.5],[8,-13,9,3]])P(c,[[d*ox-w,oy+bb],[d*(ox+2),oy-h+bb],[d*ox+w,oy+bb]],'#dff8ff',OL,1.5);E(c,d*15,-6+bb,7,5,'#5aa8de',OL,1.8)}
  c.save();c.globalAlpha=.6+.4*Math.sin(tm*5);E(c,0,4,9,9,'rgba(80,240,255,.35)');c.restore();P(c,[[0,-3],[5,4],[0,11],[-5,4]],ph2?'#ffffff':'#7ffcff',OL,1.5);
  P(c,[[-7,-12+bb],[-8,-20+bb],[0,-24+bb],[8,-20+bb],[7,-12+bb]],'#cdeeff',OL,2);for(const x0 of[-5,0,5])P(c,[[x0-2,-21+bb],[x0,-29-(x0?0:3)+bb],[x0+2,-21+bb]],'#ffffff',OL,1.2);
  for(const d of[-1,1]){E(c,d*3.5,-17+bb,2.6,1.8,'rgba(120,255,255,.5)');E(c,d*3.5,-17+bb,1.4,1.2,'#e8ffff')}}
 else if(k=='shadow'){aura('#7a2cff',32+(ph2?5:0));if(R()<fdt*9)fxLocal({k:'puff',x:e.x+rr(-.7,.7),y:e.y+rr(0,.6),vx:rr(-.3,.3),vy:-.4,r:rr(6,10),t:.8,ml:.8,c:'rgba(30,5,60,.5)'});
  const bb=Math.sin(tm*2)*2.5-2;c.translate(0,bb);
  const hem=[];for(let i=0;i<=6;i++){const x0=-22+i*44/6;hem.push([x0,17+(i%2?-4:3)+Math.sin(tm*5+i)*2.5])}
  const g=c.createLinearGradient(0,-16,0,18);g.addColorStop(0,s.fl?'#fff':'#3a1870');g.addColorStop(1,'#07020f');
  c.beginPath();c.moveTo(-12,-12);c.quadraticCurveTo(-22-a*6,0,-22,17);for(const[x0,y0]of hem)c.lineTo(x0,y0);c.quadraticCurveTo(22+a*6,0,12,-12);c.closePath();c.fillStyle=g;c.fill();c.strokeStyle='#9a5cff';c.lineWidth=2;c.stroke();
  c.fillStyle='rgba(0,0,0,.5)';c.beginPath();c.moveTo(-5,-6);c.lineTo(-8,15);c.lineTo(8,15);c.lineTo(5,-6);c.fill();
  for(const d of[-1,1]){const hx=d*(18+a*4),hy=4-a*12;E(c,hx,hy,4,3.5,'#1a0a30','#9a5cff',1.5);c.save();c.globalAlpha=.5+.5*a;E(c,hx,hy-5,3+a*5,3+a*5,'rgba(199,125,255,.55)');E(c,hx,hy-5,1.5+a*2,1.5+a*2,'#f2dcff');c.restore()}
  P(c,[[-11,-6],[-10,-18],[0,-25],[10,-18],[11,-6],[0,-2]],'#1a0a30','#9a5cff',2);E(c,0,-11,7.5,7,'#000');
  P(c,[[-8,-19],[-9,-27],[-4,-22],[0,-29],[4,-22],[9,-27],[8,-19]],'#2a1050','#c77dff',1.5);for(const x0 of[-6,0,6])E(c,x0,-21,1.5,1.5,'#ff5ad9');
  for(const d of[-1,1]){E(c,d*3.5,-11,3.2,2,'rgba(220,160,255,.5)');E(c,d*3.5,-11,2,1.2,'#f6e6ff')}
  for(let i=0;i<3;i++){const an=tm*2.4+i*2.09;E(c,Math.cos(an)*25,Math.sin(an)*9-2,3.2,3.2,'rgba(199,125,255,.85)');E(c,Math.cos(an)*25,Math.sin(an)*9-2,1.4,1.4,'#fff')}}
 else{aura('#00f0ff',31+(ph2?4:0));if(R()<fdt*(ph2?6:3))fxLocal({k:'bolt',x:e.x+rr(-.5,.5),y:e.y+rr(-.5,.3),x2:e.x+rr(-.8,.8),y2:e.y+rr(-.8,.3),t:.12,ml:.12,c:'#9ffcff'});
  const tr=(tm*30)%6;for(const d of[-1,1]){c.fillStyle='#2a3038';c.beginPath();c.roundRect(d*19-5,-8,10,24,4);c.fill();c.strokeStyle=OL;c.lineWidth=1.8;c.stroke();c.strokeStyle='#5c6680';c.lineWidth=1.5;for(let j=0;j<4;j++){const y0=-6+((j*6+tr*s.mv)%22);L(c,d*19-4,y0,d*19+4,y0,'#5c6680',1.5)}}
  const g=c.createLinearGradient(-17,-14,17,14);g.addColorStop(0,s.fl?'#fff':'#c9d3e6');g.addColorStop(.5,s.fl?'#eee':'#7d8aa0');g.addColorStop(1,'#3e4860');
  c.beginPath();c.roundRect(-16,-12,32,26,7);c.fillStyle=g;c.fill();c.strokeStyle=OL;c.lineWidth=2.5;c.stroke();
  c.save();c.beginPath();c.roundRect(-16,9,32,5,2);c.clip();for(let i=-20;i<20;i+=6){L(c,i,15,i+5,8,'#ffd23f',3)}c.restore();
  c.save();c.translate(0,2);E(c,0,0,8,8,'#0b1a2a',OL,1.5);E(c,0,0,5,5,`rgba(0,240,255,${.7+.3*Math.sin(tm*8)})`);c.rotate(tm*3);c.strokeStyle='#9ffcff';c.lineWidth=1.5;for(let i=0;i<3;i++){c.beginPath();c.arc(0,0,7,i*2.09,i*2.09+1.2);c.stroke()}c.restore();
  for(const d of[-1,1]){const rec=a*3;c.fillStyle='#4a5468';c.beginPath();c.roundRect(d*14-4,-26+rec,8,15,3);c.fill();c.strokeStyle=OL;c.lineWidth=1.8;c.stroke();E(c,d*14,-26+rec,3.4,2,'#1a1d24',OL,1);if(a>0){E(c,d*14,-29+rec,4+a*4,4+a*4,'rgba(0,240,255,.45)');E(c,d*14,-29+rec,2+a*2,2+a*2,'#e8ffff')}}
  c.fillStyle='#5c6680';c.beginPath();c.roundRect(-8,-21,16,11,4);c.fill();c.strokeStyle=OL;c.lineWidth=2;c.stroke();c.fillStyle='#0d141c';c.fillRect(-6,-18,12,4);E(c,Math.sin(tm*3)*4,-16,ph2?3.5:2.4,1.6,'#ff3b3b');
  for(const d of[-1,1])P(c,[[d*5,-21],[d*10,-29],[d*8,-20]],'#ffd23f',OL,1.2)}
 c.restore()}

/* [b4 · 1600-1618] */
/* ---------- BOSS ATTACKS (same rules as before, now with themed warnings and effects) ---------- */
function bossAttack(e){const bx=e.x|0,by=e.y|0,k=e.bk,ps=targets(),ph2=e.hp<=e.mh/2,ki=BKI[k]||1,ML=(x,y,t)=>markLava(x,y,(t||1.3)+BDMG.warn,ki),BM={kd:'B',dmg:BDMG.met};tn(90,.4,'sawtooth',.25,-40);
 const n=(R()*4)|0;e.atk=.6;
 if(k=='lava'){if(n==0){for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)==2||Math.abs(dx)+Math.abs(dy)==1)ML(bx+dx,by+dy);ring(e.x,e.y,3,'#ff6a1f',1);for(let i=0;i<14;i++)fxl.push({k:'ember',x:e.x+rr(-1,1),y:e.y+rr(-.5,.5),vx:rr(-2.5,2.5),vy:rr(-4,-1),r:rr(2,4),t:.8,ml:.8,c:'#ffb020'});txt.push({x:e.x,y:e.y-1.4,t:1,s:'GROUND SLAM!',c:'#ff8a3d'})}
  else if(n==1){ps.forEach(p=>sym(p.x|0,p.y|0,1.9,met,{k:1,...BM}));txt.push({x:e.x,y:e.y-1.4,t:.9,s:'MAGMA RAIN!',c:'#ff8a3d'})}
  else if(n==2){for(let i=0;i<(ph2?6:4);i++){const[x,y]=freeCell();ML(x,y)}ring(e.x,e.y,2,'#ffd060',.6)}
  else ps.forEach(p=>{for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]])ML((p.x|0)+dx,(p.y|0)+dy,1.5)})}
 else if(k=='frost'){if(n==0){ps.forEach(p=>met.push({x:p.x|0,y:p.y|0,t:1.9,k:2,...BM}));txt.push({x:e.x,y:e.y-1.4,t:.9,s:'ICICLES!',c:'#bff'})}
  else if(n==1){for(let i=-5;i<=5;i++){ML(bx+i,by,1.4);ML(bx,by+i,1.4)}ring(e.x,e.y,2.5,'#bff',.7,.4);txt.push({x:e.x,y:e.y-1.4,t:1,s:'ICE SPIKES!',c:'#bff'})}
  else if(n==2){for(let i=0;i<(ph2?7:5);i++){const[x,y]=freeCell();ML(x,y)}}
  else{ring(e.x,e.y,3.5,'#bff',1.5,.5);ring(e.x,e.y,3.5,'#ffffff',1.5,3.1);txt.push({x:e.x,y:e.y-1.4,t:1.5,s:'DEEP FREEZE!',c:'#bff'});pend.push({t:1.5,f:()=>{ps.forEach(p=>{if(p.alive&&Math.hypot(p.x-e.x,p.y-e.y)<3.5){p.fz=.8;puff(p.x,p.y,'#e8fbff',8)}});ring(e.x,e.y,3.5,'#fff',.4);for(let i=0;i<16;i++){const a=i*.39;fxl.push({k:'shard',x:e.x+Math.cos(a)*.8,y:e.y+Math.sin(a)*.8,vx:Math.cos(a)*5,vy:Math.sin(a)*5,g:0,r:4,a,t:.5,ml:.5,c:'#e8fbff'})}}})}}
 else if(k=='shadow'){if(n==0){puff(e.x,e.y,'#3a2050',12,14);ring(e.x,e.y,1.8,'#c77dff',.4,1.6);const[x,y]=freeCell();e.x=e.tx=x+.5;e.y=e.ty=y+.5;puff(e.x,e.y,'#b06bff',12,14);ring(e.x,e.y,2.2,'#c77dff',.5,.2);tn(300,.3,'sine',.2,-200)}
  else if(n==1){ps.forEach(p=>met.push({x:p.x|0,y:p.y|0,t:1.7,k:3,...BM}));txt.push({x:e.x,y:e.y-1.4,t:.9,s:'DARK ORBS!',c:'#d9b3ff'})}
  else if(n==2){if(en.length<6){const t=minion();[[1,0],[-1,0],[0,1],[0,-1]].slice(0,ph2?2:1).forEach(([dx,dy])=>{const x=bx+dx*2,y=by+dy*2;if(G[y]&&G[y][x]===0)warn(x,y,t,2)});txt.push({x:e.x,y:e.y-1.4,t:1,s:'RISE, MINIONS!',c:'#d9b3ff'})}}
  else{for(let i=0;i<(ph2?5:3);i++){const[x,y]=freeCell();for(const[dx,dy]of[[0,0],[1,0],[0,1]])ML(x+dx,y+dy,1.6)}ring(e.x,e.y,5,'#7a2cff',.9,.5);txt.push({x:e.x,y:e.y-1.4,t:.9,s:'SHADOW WAVE!',c:'#d9b3ff'})}}
 else{if(n==0&&ps.length){const p=ps[R()*ps.length|0],row=R()<.5;for(let i=1;i<W-1;i++)row?ML(i,p.y|0,1.3):(i<H-1&&ML(p.x|0,i,1.3));fxl.push(row?{k:'beam',x:1,y:(p.y|0)+.5,x2:W-1,y2:(p.y|0)+.5,t:1.8,ml:1.8,c:'#00f0ff'}:{k:'beam',x:(p.x|0)+.5,y:1,x2:(p.x|0)+.5,y2:H-1,t:1.8,ml:1.8,c:'#00f0ff'});txt.push({x:e.x,y:e.y-1.4,t:1,s:'LASER BEAM!',c:'#0ff'})}
  else if(n==1){for(let i=0;i<(ph2?5:3);i++){const[x,y]=freeCell();met.push({x,y,t:1.7+i*.2,k:4,...BM})}txt.push({x:e.x,y:e.y-1.4,t:.9,s:'MISSILE BARRAGE!',c:'#0ff'})}
  else if(n==2){ring(e.x,e.y,3,'#0ff',1.2,.5);for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const d=Math.abs(dx)+Math.abs(dy);if(d==3)ML(bx+dx,by+dy,1.2)}}
  else{if(en.length<6)(ph2?[[2,0],[-2,0]]:[[2,0]]).forEach(([dx,dy])=>{const x=bx+dx,y=by+dy;if(G[y]&&G[y][x]===0)warn(x,y,'r',2)});txt.push({x:e.x,y:e.y-1.4,t:1,s:'DEPLOY GUARDS!',c:'#0ff'})}}}

/* [b6 · 2095-2122] */
/* ---------- bosses: extra patterns, intro sequence, staged defeat ---------- */
const BOSS_SUB={lava:'TYRANT OF THE MOLTEN DEPTHS',frost:'WARDEN OF THE ETERNAL ICE',shadow:'MASTER OF THE ENDLESS NIGHT',mecha:'SUPREME WAR MACHINE'};
let bossNx=0;
const _bossAttackC=bossAttack;bossAttack=function(e){if(bossIntro>.2){e.at=Math.max(e.at,.6);return}
 const ph2=e.hp<=e.mh/2;bossNx++;
 if(bossNx>=4+(R()<.5?1:0)&&!(e.lastX>0)){bossNx=0;e.lastX=1;bossExtra(e,ph2)}else{e.lastX=0;_bossAttackC(e)}};
function bossExtra(e,ph2){const k=e.bk,bx=e.x|0,by=e.y|0;e.atk=.6;tn(90,.4,'sawtooth',.25,-40);
 if(k=='lava'){const n=6,o=R()*.4;exAdd({k:'bt',x:e.x,y:e.y,a:n,b:o,t:1.1,ml:1.1});txt.push({x:e.x,y:e.y-1.4,t:1,s:'MOLTEN VOLLEY!',c:'#ff8a3d'});
  const fire=(off)=>{for(let i=0;i<n;i++){const an=off+i*Math.PI*2/n;exAdd({k:'lb',x:e.x+Math.cos(an)*.5,y:e.y+Math.sin(an)*.5,a:Math.cos(an)*3.6,b:Math.sin(an)*3.6,t:2.4,ml:2.4,dmg:EDMG.volley})}tn(160,.4,'sawtooth',.2,300);nz(.3,.3,600)};
  pend.push({t:1.1,f:()=>fire(o)});if(ph2){pend.push({t:1.7,f:()=>{exAdd({k:'bt',x:e.x,y:e.y,a:n,b:o+Math.PI/n,t:.7,ml:.7})}});pend.push({t:2.4,f:()=>fire(o+Math.PI/n)})}}
 else if(k=='frost'){const lanes=DIR4.map(([dx,dy])=>({dx,dy,L:lane(bx,by,dx,dy,8)}));for(const l of lanes)for(const[x,y]of l.L)exAdd({k:'wz',x,y,t:1.35,ml:1.35,c:'#9ee7ff'});txt.push({x:e.x,y:e.y-1.4,t:1,s:'GLACIER LINES!',c:'#bff'});tn(1500,.9,'sine',.08,-300);
  for(let i=1;i<=8;i++)pend.push({t:1.35+i*.1,f:()=>{for(const l of lanes){const c0=l.L[i-1];if(!c0)continue;exAdd({k:'iw',x:c0[0],y:c0[1],t:1,ml:1});eHit(c0[0]+.5,c0[1]+.5,.7,EDMG.glacier,'Q',p=>slowP(p,1))}if(i==1){tn(1200,.5,'triangle',.14,-900);nz(.45,.25,2600)}}})}
 else if(k=='shadow'){const n=ph2?2:1;txt.push({x:e.x,y:e.y-1.4,t:1,s:'SHADOW CLONES!',c:'#d9b3ff'});for(let i=0;i<n;i++){const[x,y]=freeCell();exAdd({k:'sc',x:x+.5,y:y+.5,t:1.6+i*.3,ml:1.6+i*.3});puff(x+.5,y+.5,'rgba(40,10,70,.8)',6,10)}tn(220,.6,'sine',.14,-120)}
 else{const ps=targets();txt.push({x:e.x,y:e.y-1.4,t:1,s:'TARGET LOCK!',c:'#0ff'});for(const p of ps){const f=exAdd({k:'tl',x:p.x,y:p.y,a:p.id,t:2.2,ml:2.2});pend.push({t:1.5,f:()=>{if(!p.alive)return;f.lx=p.x|0;f.ly=p.y|0;tn(2000,.08,'square',.1)}});pend.push({t:2.2,f:()=>{if(f.lx==null)return;met.push({x:f.lx,y:f.ly,t:1,k:4,kd:'B',dmg:BDMG.met});exAdd({k:'rm',x:e.x,y:e.y-.6,a:f.lx+.5,b:f.ly+.5,t:1,ml:1});tn(500,.25,'sawtooth',.14,600)}})}
  if(ph2){const[x,y]=freeCell();met.push({x,y,t:2,k:4,kd:'B',dmg:BDMG.met})}tn(1800,.06,'square',.08);tn(1800,.06,'square',.08,0,.25)}}
function bossDefeatFX(e){const B=BOSSES[e.bk]||BOSSES.lava;for(let i=0;i<6;i++)pend.push({t:.12+i*.18,f:()=>{const x=e.x+rr(-1,1),y=e.y+rr(-1,.6);fxl.push({k:'flash',x,y,r:1.4,t:.25,ml:.25,c:i%2?'#fff0b0':B.c});ring(x,y,1.6,B.c,.4,.2);puff(x,y,'rgba(90,90,110,.6)',6,12);tn(90+i*25,.3,'sawtooth',.2,-40);shk=Math.min(1,shk+.25)}});
 pend.push({t:1.3,f:()=>{fxl.push({k:'flash',x:e.x,y:e.y,r:5,t:.5,ml:.5,c:'#ffffff'});ring(e.x,e.y,6,'#ffffff',.6,.3);nz(.8,.5,250)}})}
/* intro: letterbox bars + title card (bossIntro is synced, so guests see it too); 50% notch on the bar */
const _bossBarC=bossBar;bossBar=function(){_bossBarC();const b=en.find(e=>e.t=='b');
 if(b){const w=Math.min(420,W*T-170),x=(W*T-w)/2,y=OY+6;c.save();c.fillStyle='rgba(255,255,255,.85)';c.fillRect(x+w/2-1,y+1,2,18);c.restore()}
 if(bossIntro>0){const k=b?b.bk:bossKind(),B=BOSSES[k]||BOSSES.lava,q=Math.min(1,(2.6-bossIntro)/.35,bossIntro/.35),bh=46*q;c.save();c.fillStyle='rgba(0,0,0,.85)';c.fillRect(0,OY,W*T,bh);c.fillRect(0,OY+H*T-bh,W*T,bh);
  c.globalAlpha=q;c.textAlign='center';c.font='13px Bungee,Impact';c.fillStyle='#fff';c.fillText(BOSS_SUB[k]||'',W*T/2,OY+H*T-bh/2+5);c.restore()}
 waveBanner()};
/* wave announcement (computed on every device from the synced wave number) */
let wvSeen=-1,wvBan=0,wvAt=0;
function waveBanner(){if(!(S.mode==5||S.mode==6)||typeof wv=='undefined')return;const now=performance.now()/1000;if(wv!=wvSeen){wvSeen=wv;wvAt=wv>0?now:-9}wvBan=2-(now-wvAt);if(wvBan<=0||st=='pause')return;
 const L=(WL()[wv-1]||[]).filter(t=>t!='|'),boss=L.includes('b'),names=[...(boss?[BOSSES[bossKind()].n]:[]),...[...new Set(L.filter(t=>t!='b'))].map(t=>EN[t]||t)],q=Math.min(1,(2-wvBan)/.25,wvBan/.4),y=OY+T*1.2;
 c.save();c.globalAlpha=q;c.textAlign='center';rc(W*T/2-170,y-24,340,52,14,'rgba(5,6,25,.82)');c.font='20px Bungee,Impact';c.fillStyle=boss?'#ff4d5e':'#ffd23f';c.fillText((S.mode==6?'BOSS ':boss?'BOSS WAVE ':'WAVE ')+wv+' / '+WL().length,W*T/2,y);c.font='12px Rubik,sans-serif';c.fillStyle='#fff';c.fillText(names.join(' · ')||'',W*T/2,y+18);c.restore()}
/* [b7 · 2202-2205] */
/* ===== Boss Rush random order (v4): host/local shuffles on every new run (start, rematch, restart); guests take it from the snapshot ===== */
const _nrBR=newRound;newRound=function(){if(S.mode==6&&net.role!='guest')brShuffle();return _nrBR.apply(this,arguments)};
const _snapBR=snap;snap=function(){const o=_snapBR();if(S.mode==6)o.bo=BRO.join();return o};
const _applySnapBR=applySnap;applySnap=function(m){if(m&&m.bo)brApply(m.bo);return _applySnapBR(m)};
