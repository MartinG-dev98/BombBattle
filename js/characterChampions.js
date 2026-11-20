/* [b11 · 2404-2538] */
/* =====================================================================
   BOMB BATTLE — CHARACTER OVERHAUL, STAGES C2 + C3 (loaded last)
   C2  Eight original RPG characters with a stat model (Health, Speed, Defense,
       Bomb Capacity, Blast Range) and one unique ability each. Stats and
       abilities run inside the host's match simulation; guests only send a
       character ID and render what the host sends back.
       Versioned save (bbSaveV 1 -> 2): fighter picks are stored by character ID
       in 'bbChar'. Nothing else is rewritten; a one-time copy of the old keys is
       kept in 'bbBak1'.
   C3  Directional hybrid pixel art: 16x20 pixel sprites (front / back / side,
       left = mirrored side) with idle + 2 walk frames, hurt and victory poses,
       auto outline, cached per frame, drawn crisp, plus light canvas FX on top.
   Old fighters (Heroes, Memes, Colours, Elites) are untouched and keep their
   neutral stats (100 HP, normal speed, 0% defense, 1 bomb, range 2).
   ===================================================================== */
const RPG_V=1;
/* spd = speed steps on top of the base 2.9 tiles/s (each step = 0.4 tiles/s, same unit as the speed power-up) */
const RPG=[
 {id:'kael', no:1,n:'Kael', t:'The Ironward',  cls:'GUARD',    role:'Tank / Defender',  a:'ironward',  c:'#4f7fd6',hp:130,spd:-.75,def:.25,bombs:1,rng:2,bio:'A wall of iron who stands between his friends and the blast.'},
 {id:'taven',no:2,n:'Taven',t:'The Wildbound', cls:'HEALER',   role:'Support / Healing',a:'embrace',   c:'#3f9a4a',hp:105,spd:0,   def:.10,bombs:1,rng:2,bio:'Raised by the forest; every wound he sees, he mends.'},
 {id:'eldra',no:3,n:'Eldra',t:'The Runebinder',cls:'MAGE',     role:'Area Control',     a:'arcane',    c:'#6a4ee0',hp:90, spd:0,   def:.05,bombs:1,rng:3,bio:'Writes runes into the ground and owns every tile around her.'},
 {id:'nyra', no:4,n:'Nyra', t:'The Nightveil', cls:'ASSASSIN', role:'Speed / Mobility', a:'shadowdash',c:'#3e3560',hp:80, spd:1.5, def:0,  bombs:1,rng:2,bio:'Gone before the fuse is lit. Fragile, and very hard to catch.'},
 {id:'bronn',no:5,n:'Bronn',t:'The Gearsmith', cls:'ENGINEER', role:'Traps / Utility',  a:'decoy',     c:'#3b6a8f',hp:110,spd:-.5, def:.15,bombs:2,rng:2,bio:'Never fights fair: decoys, gadgets and one spare bomb.'},
 {id:'rhea', no:6,n:'Rhea', t:'The Ashbound',  cls:'BERSERKER',role:'Damage / Offense', a:'ember',     c:'#d8452a',hp:100,spd:.5,  def:0,  bombs:2,rng:2,bio:'Burns hot and fights close. Her own flames never touch her.'},
 {id:'sorin',no:7,n:'Sorin',t:'The Frostwalker',cls:'RANGER',  role:'Control',          a:'frostfield',c:'#3a8fd0',hp:90, spd:.75, def:.05,bombs:1,rng:3,bio:'Hunts from afar and freezes the ground his prey must cross.'},
 {id:'vex',  no:8,n:'Vex',  t:'The Riftborn',  cls:'SUMMONER', role:'Special',          a:'riftecho',  c:'#7a3fc0',hp:90, spd:0,   def:.10,bombs:1,rng:2,bio:'Steps between moments and leaves an echo with a bomb behind.'}];
const RPGI={};RPG.forEach(r=>RPGI[r.id]=r);
/* stable string IDs for every fighter (old ones from their names) */
SK.forEach(s=>{if(!s.id)s.id=s.n.toLowerCase().replace(/[^a-z0-9]/g,'')});
const RIDX={};
RPG.forEach(r=>{RIDX[r.id]=SK.length;SK.push({n:r.n,g:'Champions',c:r.c,a:r.a,id:r.id,rpg:1});PERS[RIDX[r.id]]=r.bio});
const CID={};SK.forEach((s,j)=>{if(CID[s.id]==null)CID[s.id]=j});
if(!GROUPS.includes('Champions'))GROUPS.unshift('Champions');
/* new default fighters for players who never picked one */
const SKD_OLD=SKD.slice();['kael','rhea','sorin','nyra'].forEach((id,i)=>SKD[i]=RIDX[id]);
const chOf=k=>{const s=SK[k];return s&&s.rpg?RPGI[s.id]:null};
const chSpeed=r=>+(2.9+.4*(r?r.spd:0)).toFixed(2);

/* ---------- abilities ---------- */
Object.assign(AB,{
 ironward:{n:'IRON GUARD',cd:12,dur:3,d:'Raise an iron barrier for 3s: take 75% less damage and shrug off knockback.'},
 embrace:{n:"NATURE'S EMBRACE",cd:14,dur:3,d:'Heal 20 HP at once, then 4 HP per second for 3s. In co-op modes, allies within 3 tiles heal 15.'},
 arcane:{n:'ARCANE PULSE',cd:10,d:'Charge a rune for 0.5s, then blast every tile within 2 steps (20 damage, breaks crates).'},
 shadowdash:{n:'SHADOW DASH',cd:6,d:'Dash up to 3 tiles, untouchable while dashing. Anyone you pass through takes 12 damage.'},
 decoy:{n:'DECOY DEVICE',cd:14,d:'Drop a gear decoy for 6s. Monsters within 5 tiles chase it. It explodes (range 2) when a rival steps next to it or time runs out.'},
 ember:{n:'EMBER BURST',cd:10,d:'The 8 tiles around you burst into flame (22 damage, breaks crates). Your own flames never hurt you.'},
 frostfield:{n:'FROST FIELD',cd:12,dur:4,d:'Freeze a 3x3 field 2 tiles ahead for 4s. Rivals inside are slowed, monsters inside keep freezing up.'},
 riftecho:{n:'RIFT ECHO',cd:12,dur:3,d:'Open a rift where you stand. 3s later you snap back to it, and your echo leaves a fast bomb where you were.'}});
Object.assign(ABT,{ironward:'kgT',embrace:'tvT',riftecho:'rfT'});
const RAB=new Set(RPG.map(r=>r.a));
let DEC=[],FFD=[],APL=[];

/* ---------- stats in the match (host) ---------- */
function applyStats(p){const r=chOf(p.sk);p.mhp=r?r.hp:100;p.hp=p.hd=p.hv=p.mhp;p.def=r?r.def:0;p.spb=r?r.spd:0;
 if(S.mode!=3)p.maxB=r?r.bombs:1;p.rng=r?r.rng:2;p.kgT=0;p.tvT=0;p.tvA=0;p.rift=null;p.rfT=0;p.sd=null}
const _nrRPG=newRound;newRound=function(){const r=_nrRPG.apply(this,arguments);DEC=[];FFD=[];APL=[];if(net.role!='guest'&&pl)pl.forEach(applyStats);return r};
/* Defense, Iron Guard and "own flames never hurt you" — applied before the damage is dealt, so damage numbers stay exact */
const _hurtRPG=hurt;hurt=function(p,force,by,dmg,kd){
 if(p&&p.alive&&!force&&st=='play'&&(p.def>0||p.kgT>0||chOf(p.sk))){if(dmg==null)dmg=35;
  if(kd=='s'&&by===p.id&&chOf(p.sk))return;
  let m=1-(p.def||0);if(p.kgT>0)m*=.25;dmg=Math.max(1,Math.round(dmg*m))}
 return _hurtRPG.call(this,p,force,by,dmg,kd)};
const _hurtMRPG=hurtM;hurtM=function(p,e){if(p&&p.kgT>0){const x=p.x,y=p.y;_hurtMRPG(p,e);p.x=x;p.y=y;return}return _hurtMRPG(p,e)};
/* Speed: the character's base steps ride on top of the speed power-up level only while moving */
const _ctlRPG=ctl;ctl=function(p,dt){
 for(const k of['kgT','tvT'])if(p[k]>0)p[k]=Math.max(0,p[k]-dt);
 const b=p.spb||0;if(b){p.spd+=b;p._sb=1}try{_ctlRPG(p,dt)}finally{if(b){p.spd-=b;p._sb=0}}
 if(p.sd){const d=p.sd;d.t+=dt;const u=Math.min(1,d.t/d.d);p.x=d.x0+(d.x1-d.x0)*u;p.y=d.y0+(d.y1-d.y0)*u;p.vx=d.dx*14;p.vy=d.dy*14;
  if(u>=1){p.sd=null;p.vx=p.vy=0;if(hit(p,p.x,p.y))unstick(p)}}};
const _grabRPG=grab;grab=function(p,it){const b=p._sb?p.spb||0:0,off=100-(p.mhp||100),life=PU[it.k]&&PU[it.k].k=='life';
 p.spd-=b;if(life)p.hp+=off;try{return _grabRPG(p,it)}finally{p.spd+=b;if(life)p.hp-=off}};
/* health bars and HUD numbers show health relative to each fighter's own maximum */
const _hpBarRPG=hpBar;hpBar=function(x,y,w,h,p){const M=p&&p.mhp;if(M&&M!=100){const f=100/M;return _hpBarRPG(x,y,w,h,{hp:p.hp*f,hd:(p.hd||0)*f,hv:(p.hv||0)*f})}return _hpBarRPG(x,y,w,h,p)};
MODES[1].d='90 seconds. Most health left wins (as a share of each fighter\'s max health).';
/* ---------- the eight abilities (host only; results reach guests through the normal snapshot) ---------- */
const inA=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1;
function chainBomb(x,y){const b=bombs.find(o=>o.x==x&&o.y==y);if(b)b.t=Math.min(b.t,.08)}
function abFire(x,y,o,dmg,t){if(!inA(x,y)||!G[y]||G[y][x]==1)return 0;if(G[y][x]==2)crate(x,y,o);chainBomb(x,y);fires.push({x,y,t,m:0,o,dmg,kd:'s'});return 1}
function enDmg(e,d,o){if(e.hit>0||e.sl>0)return;e.hp=Math.max(0,e.hp-d);e.hit=.5;e.lh=o;dmgNum(e.x,e.y-.5,d,'s');burst(e.x,e.y,EPC[e.t]||'#fff',8)}
function heal(p,v){const h=Math.min(Math.round(v),Math.max(0,Math.ceil((p.mhp||100)-p.hp)));if(h>0){p.hp+=h;dmgNum(p.x,p.y-.4,h,'heal')}return h}
const RFX={
 ironward(p){p.kgT=AB.ironward.dur;ring(p.x,p.y,1.4,'#c9d2df',.5);burst(p.x,p.y,'#c9d2df',16);txt.push({x:p.x,y:p.y-.8,t:1,s:'IRON GUARD',c:'#dfe6f0'});tn(180,.35,'square',.22,-40);tn(1200,.15,'triangle',.12,-400,.05);return 1},
 embrace(p){heal(p,20);p.tvT=AB.embrace.dur;p.tvA=0;
  if(S.mode>=5)pl.forEach(q=>{if(q!=p&&q.alive&&!q.off&&Math.hypot(q.x-p.x,q.y-p.y)<=3){heal(q,15);ring(q.x,q.y,.9,'#7dffb0',.5)}});
  ring(p.x,p.y,3,'#7dffb0',.7,.3);puff(p.x,p.y,'rgba(125,255,176,.6)',8,8);SFX.heal();tn(660,.3,'sine',.15,220,.05);return 1},
 arcane(p){APL=APL.filter(a=>a.o!=p.id);APL.push({x:p.x|0,y:p.y|0,t:.5,ml:.5,o:p.id});ring(p.x,p.y,2.4,'#5ff2ff',.5,2.2);tn(300,.5,'sine',.15,500);return 1},
 shadowdash(p){const dx=p.fx,dy=p.fy,x0=p.x|0,y0=p.y|0;let n=0;
  for(let i=1;i<=3;i++){const tx=x0+dx*i,ty=y0+dy*i;if(!G[ty]||G[ty][tx]!==0||bombs.some(b=>b.x==tx&&b.y==ty))break;n=i}
  if(!n)return 0;const tx=x0+dx*n,ty=y0+dy*n,path=[];for(let i=0;i<=n;i++)path.push([x0+dx*i,y0+dy*i]);
  const on=o=>path.some(([a,b])=>(o.x|0)==a&&(o.y|0)==b);
  if(pvp())rivals(p).forEach(q=>{if(on(q))hurt(q,0,p.id,12,'s')});
  en.forEach(e=>{if(on(e))enDmg(e,12,p.id)});
  for(const[a,b]of path)puff(a+.5,b+.5,'rgba(90,60,150,.55)',2,9);
  p.sd={x0:p.x,y0:p.y,x1:tx+.5,y1:ty+.5,t:0,d:.16,dx,dy};p.inv=Math.max(p.inv,.35);tn(900,.18,'sawtooth',.12,-700);nz(.15,.2,3000);return 1},
 decoy(p){const x=p.x|0,y=p.y|0;if(DEC.some(d=>d.x==x&&d.y==y))return 0;DEC=DEC.filter(d=>d.o!=p.id);DEC.push({x,y,t:6,ml:6,o:p.id});burst(x+.5,y+.5,'#c9a24a',10);tn(1500,.08,'square',.12);tn(1100,.08,'square',.12,0,.1);return 1},
 ember(p){const x=p.x|0,y=p.y|0;let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;n+=abFire(x+dx,y+dy,p.id,22,.6)}
  if(!n)return 0;ring(p.x,p.y,1.6,'#ff8a3d',.45);burst(p.x,p.y,'#ff8a3d',22);burst(p.x,p.y,'#ffe36a',10);shk=Math.min(1,shk+.2);SFX.boom(0,1);return 1},
 frostfield(p){const cx=Math.max(1,Math.min(W-2,(p.x|0)+p.fx*2)),cy=Math.max(1,Math.min(H-2,(p.y|0)+p.fy*2));FFD=FFD.filter(f=>f.o!=p.id);FFD.push({x:cx,y:cy,t:AB.frostfield.dur,ml:AB.frostfield.dur,o:p.id,tk:0});
  ring(cx+.5,cy+.5,1.6,'#9ff0ff',.5);puff(cx+.5,cy+.5,'rgba(200,240,255,.7)',8,9);tn(1600,.3,'sine',.12,-900);nz(.3,.2,5000);return 1},
 riftecho(p){p.rift={x:p.x|0,y:p.y|0,t:AB.riftecho.dur};p.rfT=AB.riftecho.dur;ring(p.x,p.y,1,'#ff3df0',.5);tn(220,.4,'sine',.18,300);return 1}};
const _useAbRPG=useAb;useAb=function(p){const a=abil(p);if(!RAB.has(a))return _useAbRPG(p);
 if(RFX[a](p)){p.cd=p.cdm=AB[a].cd}else txt.push({x:p.x,y:p.y-.7,t:.8,s:'NO ROOM',c:'#aab'})};
/* monsters near a decoy chase it instead of the players (bosses ignore decoys) */
const _pickRPG=pick;pick=function(e){if(!DEC.length||e.t=='b')return _pickRPG(e);const nr=DEC.filter(d=>Math.abs(d.x+.5-e.x)+Math.abs(d.y+.5-e.y)<=5);if(!nr.length)return _pickRPG(e);
 const keep=pl;pl=nr.map(d=>({x:d.x+.5,y:d.y+.5,alive:1,ivT:0}));try{return _pickRPG(e)}finally{pl=keep}};
function rpgUpd(dt){
 for(const p of pl){if(!p.alive||p.off){p.rift=null;p.rfT=0;p.tvT=0;continue}
  if(p.tvT>0){p.tvA+=dt;if(p.tvA>=1){p.tvA-=1;if(heal(p,4))puff(p.x,p.y,'rgba(125,255,176,.5)',2,6)}}
  if(p.rift){const r=p.rift;r.t-=dt;p.rfT=Math.max(0,r.t);if(r.t<=0){p.rift=null;p.rfT=0;
   if(G[r.y][r.x]!==0||bombs.some(b=>b.x==r.x&&b.y==r.y)){txt.push({x:p.x,y:p.y-.8,t:1,s:'RIFT CLOSED',c:'#d6b0ff'});continue}
   const dx=p.x|0,dy=p.y|0;if((dx!=r.x||dy!=r.y)&&G[dy][dx]===0&&!bombs.some(b=>b.x==dx&&b.y==dy)){const b=dropB(dx,dy,1.2,p.rng,null);b.sid=p.id}
   puff(p.x,p.y,'rgba(255,61,240,.55)',6,9);p.x=r.x+.5;p.y=r.y+.5;p.vx=p.vy=0;p.sd=null;p.inv=Math.max(p.inv,.5);ring(p.x,p.y,1.2,'#3dfff0',.5);SFX.warp()}}}
 APL=APL.filter(a=>{a.t-=dt;if(a.t>0)return 1;let n=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const m=Math.abs(dx)+Math.abs(dy);if(m<1||m>2)continue;n+=abFire(a.x+dx,a.y+dy,a.o,20,.45)}
  ring(a.x+.5,a.y+.5,2.6,'#5ff2ff',.45);burst(a.x+.5,a.y+.5,'#5ff2ff',18);shk=Math.min(1,shk+.15);tn(140,.4,'sawtooth',.25,-60);nz(.3,.35,1800);return 0});
 DEC=DEC.filter(d=>{d.t-=dt;const o=pl[d.o];let go=d.t<=0||fa[d.y*W+d.x];
  if(!go&&d.ml-d.t>.5){if(pvp())go=rivals(o||{}).some(q=>Math.abs(q.x-d.x-.5)+Math.abs(q.y-d.y-.5)<1.3);if(!go)go=en.some(e=>e.t!='b'&&Math.hypot(e.x-d.x-.5,e.y-d.y-.5)<.8)}
  if(!go)return 1;const b=bombs.find(q=>q.x==d.x&&q.y==d.y);if(b)b.t=Math.min(b.t,.05);else if(G[d.y][d.x]===0){const nb=dropB(d.x,d.y,.03,2,null);nb.sid=d.o}return 0});
 FFD=FFD.filter(f=>{f.t-=dt;if(f.t<=0)return 0;const inF=o=>Math.abs((o.x|0)-f.x)<=1&&Math.abs((o.y|0)-f.y)<=1,ow=pl[f.o];
  if(pvp())pl.forEach(q=>{if(q!=ow&&q.alive&&!q.off&&inF(q))q.slow=Math.max(q.slow||0,.25)});
  f.tk-=dt;if(f.tk<=0){f.tk=1.2;en.forEach(e=>{if(e.t!='b'&&inF(e)){e.st=Math.max(e.st||0,.6);puff(e.x,e.y,'rgba(180,235,255,.6)',3,7)}})}return 1})}
const _updRPG=update;update=function(dt){const r=_updRPG.apply(this,arguments);if(st=='play'&&pl&&!(hitStopT>0))rpgUpd(dt);return r};
/* ---------- online: character IDs + ability state (host-authoritative) ---------- */
/* guests send their pick as an ID; the host resolves it against its own roster (stats never come from a guest) */
sendSk=function(){if(net.role=='guest'&&net.on())try{const k=mySk();net.conn.send({t:'sk',k,id:SK[k]?SK[k].id:'',u:[...UNL].filter(j=>SK[j]&&SK[j].cost)})}catch(e){}};
const _odhRPG=onDataH;onDataH=function(o,m){if(m&&m.t=='sk'&&typeof m.id=='string'){const j=CID[m.id];if(j!=null)m=Object.assign({},m,{k:j});else if(!(Number.isInteger(m.k)&&SK[m.k]&&SK[m.k].id===m.id))return}return _odhRPG.call(this,o,m)};
const _snapRPG=snap;snap=function(){const o=_snapRPG();
 o.ci=pl.map(p=>SK[p.sk]?SK[p.sk].id:'');
 o.rp=pl.map(p=>[p.mhp||100,f2(p.kgT||0),f2(p.tvT||0),p.rift?p.rift.x:-1,p.rift?p.rift.y:-1,f2(p.rfT||0),Math.round((p.def||0)*100)]);
 o.dc=DEC.map(d=>[d.x,d.y,f2(d.t),d.o]);o.ff=FFD.map(f=>[f.x,f.y,f2(f.t),f.o]);o.ap=APL.map(a=>[a.x,a.y,f2(a.t),a.o]);return o};
const _apsRPG=applySnap;applySnap=function(m){const q0=net.sqr;const r=_apsRPG.apply(this,arguments);if(!m||net.sqr!==m.q||q0===m.q||!pl)return r;
 pl.forEach((p,i)=>{const id=m.ci&&m.ci[i];if(typeof id=='string'&&CID[id]!=null)p.sk=CID[id];const a=m.rp&&m.rp[i];
  if(a){p.mhp=a[0]||100;p.kgT=a[1];p.tvT=a[2];p.rift=a[3]>=0?{x:a[3],y:a[4],t:a[5]}:null;p.rfT=a[5];p.def=(a[6]||0)/100}else{const c=chOf(p.sk);p.mhp=c?c.hp:100}});
 DEC=(m.dc||[]).map(a=>({x:a[0],y:a[1],t:a[2],ml:6,o:a[3]}));FFD=(m.ff||[]).map(a=>({x:a[0],y:a[1],t:a[2],ml:AB.frostfield.dur,o:a[3]}));APL=(m.ap||[]).map(a=>({x:a[0],y:a[1],t:a[2],ml:.5,o:a[3]}));return r};

/* [b11 · 2565-2690] */
/* ---------- menus: stat panel for the champions ---------- */
document.head.insertAdjacentHTML('beforeend',`<style>
.rst{display:grid;grid-template-columns:auto 1fr auto;gap:2px 8px;align-items:center;margin-top:6px;font:11px Rubik,sans-serif;color:#c9cdf5;max-width:300px}
.rst i{display:flex;gap:2px}.rst i b{display:block;width:14px;height:6px;border-radius:2px;background:#2a2d55}.rst i b.on{background:var(--y,#ffd23f)}
.rst em{font-style:normal;color:#fff;text-align:right;min-width:42px}.rcls{display:inline-block;font:400 10px Bungee,Impact,sans-serif;padding:1px 7px;border-radius:9px;background:rgba(255,255,255,.12);margin-left:6px;vertical-align:middle;letter-spacing:.5px}
.rttl{color:#aab3ee;font-size:12px;margin-top:-2px}
</style>`);
const STATROWS=[['HEALTH',r=>r.hp,r=>r.hp+' HP',r=>Math.round(1+(r.hp-80)/12.5)],['SPEED',r=>r.spd,r=>chSpeed(r)+'/s',r=>Math.round(3+r.spd*1.34)],['DEFENSE',r=>r.def,r=>Math.round(r.def*100)+'%',r=>Math.round(1+r.def*16)],['BOMBS',r=>r.bombs,r=>r.bombs+'',r=>r.bombs*2],['BLAST',r=>r.rng,r=>r.rng+' tiles',r=>(r.rng-1)*2]];
function statHTML(k){const r=chOf(k);if(!r)return'';return`<div class="rst">`+STATROWS.map(([l,,v,b])=>{const n=Math.max(1,Math.min(5,b(r)));return`<span>${l}</span><i>${[1,2,3,4,5].map(j=>`<b class="${j<=n?'on':''}"></b>`).join('')}</i><em>${v(r)}</em>`}).join('')+`</div>`}
function rpgDecor(box,k){if(!box)return;const r=chOf(k),inf=box.querySelector('.top>div');if(!r||!inf)return;const cn=inf.querySelector('.cn');
 if(cn&&!cn.querySelector('.rcls')){cn.insertAdjacentHTML('beforeend',`<span class="rcls">${r.cls}</span>`);cn.insertAdjacentHTML('afterend',`<div class="rttl">${r.t} · ${r.role}</div>`)}
 if(!inf.querySelector('.rst'))inf.insertAdjacentHTML('beforeend',statHTML(k))}
const _skUIRPG=skUI;skUI=function(){const r=_skUIRPG.apply(this,arguments);const n=curNP();for(let i=0;i<Math.min(n,4);i++){const b=$('sk'+i);if(b&&b.style.display!='none')rpgDecor(b,skFor(i))}return r};
const _wskUIRPG=wskUI;wskUI=function(){const r=_wskUIRPG.apply(this,arguments);if(net.role=='guest')rpgDecor($('wsk'),mySk());return r};
$('abl').innerHTML=SK.filter(s=>s.g!='Colour').map(s=>`<span><b>${s.n}</b>${s.rpg?' ('+RPGI[s.id].cls+')':''} · ${AB[s.a].n}: ${AB[s.a].d}</span>`).join('')+`<span><b>Colour fighters</b> · DASH: ${AB.dash.d}</span>`;
cards($('gc'),MODES,'mode');sel();

/* ---------- C3: directional hybrid pixel art ---------- */
/* 16x20 art pixels (+1px outline margin) drawn at 2 screen px per art pixel inside a 48px tile.
   dir 0 = facing down (front), 1 = up (back), 2 = right (side; left is the mirrored side sprite).
   frame 0 = idle, 1/2 = walk steps. pose: 0 normal, 1 hurt, 2 victory. */
const PXS=2,PXW=18,PXH=22,PXC=new Map();
const PAL={
 kael:{sk:'#f0c49c',skD:'#c9946e',hair:'#7a5232',hd:'#a9b4c4',hdD:'#6c7789',bd:'#2f5fb3',bdD:'#21447f',arm:'#a9b4c4',belt:'#ffd23f',leg:'#4a5368',boot:'#2b3040',ey:'#1b1f33',ac:'#ffd23f'},
 taven:{sk:'#e6b089',skD:'#b8805c',hair:'#6b4423',hd:'#3f9a4a',hdD:'#2c6e36',bd:'#8a5a2e',bdD:'#64401f',arm:'#3f9a4a',belt:'#7dffb0',leg:'#5a4026',boot:'#3a2814',ey:'#1d2b17',ac:'#7dffb0'},
 eldra:{sk:'#f3d6c8',skD:'#cfa898',hair:'#e8e6ff',hd:'#e8e6ff',hdD:'#b7b2e8',bd:'#5b3fd6',bdD:'#3f2a9e',arm:'#5b3fd6',belt:'#5ff2ff',leg:'#3f2a9e',boot:'#2a1c6a',ey:'#3b2a7a',ac:'#5ff2ff'},
 nyra:{sk:'#d8b7a8',skD:'#a88a7e',hair:'#1a1628',hd:'#3e3560',hdD:'#2a2440',bd:'#2f2a48',bdD:'#1f1b33',arm:'#2f2a48',belt:'#e0408a',leg:'#24203a',boot:'#141222',ey:'#d6b0ff',ac:'#e0408a'},
 bronn:{sk:'#eab38e',skD:'#c08560',hair:'#d97a2b',hd:'#c9a24a',hdD:'#8f7030',bd:'#3b6a8f',bdD:'#2b4d69',arm:'#e0e0e0',belt:'#2b4d69',leg:'#2b4d69',boot:'#3a2a1a',ey:'#1b1f33',ac:'#7fe3ff'},
 rhea:{sk:'#d99a6c',skD:'#a8704a',hair:'#ff5a2a',hd:'#ffb02a',hdD:'#c8341a',bd:'#5a2a22',bdD:'#3e1c17',arm:'#d99a6c',belt:'#c7ced8',leg:'#3e1c17',boot:'#22100c',ey:'#2a0d08',ac:'#ff3a3a'},
 sorin:{sk:'#f1cba8',skD:'#c99f7c',hair:'#8a5a2e',hd:'#eef6ff',hdD:'#b8d8f0',bd:'#3a8fd0',bdD:'#286aa0',arm:'#3a8fd0',belt:'#8a5a2e',leg:'#2a4a6a',boot:'#eef6ff',ey:'#1b2a3a',ac:'#9ff0ff'},
 vex:{sk:'#8a7aa8',skD:'#5e507a',hair:'#24123d',hd:'#3a1f5c',hdD:'#24123d',bd:'#2e1a4a',bdD:'#1d0f30',arm:'#3a1f5c',belt:'#ff3df0',leg:'#1d0f30',boot:'#120820',ey:'#3dfff0',ac:'#ff3df0'}};
function pxPaint(id,dir,fr,pose){const cv=document.createElement('canvas');cv.width=PXW;cv.height=PXH;const g=cv.getContext('2d'),P=PAL[id];
 const R=(x,y,w,h,col)=>{if(!col||w<=0||h<=0)return;g.fillStyle=col;g.fillRect(x+1,y+1,w,h)},D=(x,y,col)=>R(x,y,1,1,col);
 const side=dir==2,back=dir==1,win=pose==2,hurt=pose==1,robe=id=='eldra'||id=='vex';
 /* legs + boots (lifted leg is one pixel shorter) */
 if(!robe){if(!side){const lA=fr==1?1:0,lB=fr==2?1:0;R(5,15,2,3-lA,P.leg);R(5,18-lA,2,2,P.boot);R(9,15,2,3-lB,P.leg);R(9,18-lB,2,2,P.boot)}
  else{if(fr==0){R(6,15,2,3,P.leg);R(6,18,3,2,P.boot);R(9,15,1,3,P.leg)}else if(fr==1){R(5,15,2,2,P.leg);R(4,17,3,2,P.boot);R(9,15,2,3,P.leg);R(9,18,3,2,P.boot)}else{R(7,15,2,3,P.leg);R(7,18,3,2,P.boot)}}}
 else{R(4,15,8,3,P.bd);R(4,15,1,3,P.bdD);R(11,15,1,3,P.bdD);R(3,17,10,1,P.bdD);R(5,18,2,2,P.boot);R(9,18,2,2,P.boot);if(fr){R(fr==1?5:9,18,2,1,P.bd)}}
 /* torso */
 if(!side){R(4,9,8,6,P.bd);R(11,9,1,6,P.bdD);R(4,13,8,1,P.belt)}else{R(5,9,6,6,P.bd);R(5,9,1,6,P.bdD);R(5,13,6,1,P.belt)}
 /* arms (swing with the walk; raised for victory) */
 const sw=fr==1?-1:fr==2?1:0;
 if(!side){if(win){R(2,5,2,4,P.arm);R(2,4,2,1,P.sk);R(12,5,2,4,P.arm);R(12,4,2,1,P.sk)}else{R(2,10+sw,2,3,P.arm);R(2,13+sw,2,1,P.sk);R(12,10-sw,2,3,P.arm);R(12,13-sw,2,1,P.sk)}}
 else{if(win){R(7,5,2,4,P.arm);R(7,4,2,1,P.sk)}else{const hx=fr==1?9:fr==2?5:7;R(7,10,2,2,P.arm);R(hx,12,2,1,P.arm);R(hx,13,2,1,P.sk)}}
 /* head */
 if(!side){R(3,1,10,8,P.hair);if(!back){R(4,3,8,6,P.sk);R(4,8,8,1,P.skD)}}else{R(4,1,8,8,P.hair);if(!back)R(7,3,5,6,P.sk),R(7,8,5,1,P.skD)}
 /* face */
 const eyes=(xs,y)=>{for(const x of xs){if(hurt){D(x-1,y+1,P.ey);D(x,y+1,P.ey)}else if(win){D(x-1,y,P.ey);D(x,y,P.ey)}else{R(x,y,1,2,P.ey);if(id!='nyra'&&id!='vex')D(x,y,'#ffffff')}}};
 if(!back){if(!side){eyes([6,9],5);if(win){R(7,7,2,1,'#5a1a1a')}else if(!hurt&&id!='nyra')R(7,7,2,1,P.skD);if(id!='nyra'&&id!='vex'&&id!='bronn'){D(4,7,'#ff8a9a');D(11,7,'#ff8a9a')}}
  else{eyes([10],5);if(win)D(10,7,'#5a1a1a');D(12,6,P.sk)}}
 /* character details */
 ({
 kael(){if(!side){R(3,1,10,3,P.hd);R(3,1,10,1,P.hdD);R(3,4,2,5,P.hd);R(11,4,2,5,P.hd);R(7,0,2,2,P.belt);if(back){R(3,1,10,8,P.hd);R(4,4,8,1,P.hdD);R(7,0,2,2,P.belt)}
   R(7,10,2,3,P.belt);if(!back){R(12,9,4,7,'#c9d2df');R(13,10,2,5,'#3b6fd0');D(13,12,P.belt);D(14,12,P.belt);D(13,11,P.belt);D(13,13,P.belt)}else{R(12,9,3,6,'#c9d2df')}}
  else{R(4,1,8,3,P.hd);R(4,4,3,5,P.hd);R(7,0,2,1,P.belt);R(4,1,8,1,P.hdD);if(back)R(4,1,8,8,P.hd);else{R(10,8,5,8,'#c9d2df');R(11,9,3,6,'#3b6fd0');D(12,11,P.belt);D(12,12,P.belt)}}},
 taven(){if(!side){R(3,1,10,3,P.hd);R(3,4,1,5,P.hd);R(12,4,1,5,P.hd);R(4,3,8,1,P.hair);D(7,0,'#7dffb0');D(8,0,'#5ad07a');if(back)R(3,1,10,8,P.hd),R(5,9,6,4,P.hdD);
   R(4,10,8,1,P.hd);if(!back){R(14,3,1,15,'#8b5a2b');R(13,1,3,2,'#5ad07a');D(14,1,'#c8ffd8')}}
  else{R(4,1,8,3,P.hd);R(4,4,3,5,P.hd);D(9,0,'#7dffb0');R(7,3,5,1,P.hair);if(back)R(4,1,8,8,P.hd);else{R(12,3,1,15,'#8b5a2b');R(11,1,3,2,'#5ad07a')}R(5,10,6,1,P.hd)}},
 eldra(){if(!side){R(3,1,10,2,P.hair);R(3,3,1,8,P.hair);R(12,3,1,8,P.hair);R(4,3,8,1,'#ffd23f');D(7,3,'#5ff2ff');D(8,3,'#5ff2ff');if(back){R(3,1,10,10,P.hair);R(4,3,8,1,'#ffd23f')}
   if(!back){D(6,11,'#5ff2ff');D(9,11,'#5ff2ff');D(7,12,'#5ff2ff');D(8,12,'#5ff2ff');D(5,16,'#5ff2ff');D(10,16,'#5ff2ff')}}
  else{R(4,1,8,2,P.hair);R(4,3,3,8,P.hair);R(6,3,6,1,'#ffd23f');D(11,3,'#5ff2ff');if(back)R(4,1,8,10,P.hair);else D(9,11,'#5ff2ff')}},
 nyra(){if(!side){R(3,1,10,3,P.hd);R(3,4,1,5,P.hd);R(12,4,1,5,P.hd);R(4,7,8,2,'#1a1628');R(3,9,10,1,P.belt);if(back){R(3,1,10,8,P.hd);R(9,10,2,5,P.belt)}else{R(1,11,1,2,'#cfd6e6');R(14,11,1,2,'#cfd6e6')}}
  else{R(4,1,8,3,P.hd);R(4,4,3,5,P.hd);R(8,7,4,2,'#1a1628');R(5,9,6,1,P.belt);R(2,9+(fr==1?1:0),3,1,P.belt);R(1,10,2,1,P.belt);if(back)R(4,1,8,8,P.hd);else R(10,12,1,2,'#cfd6e6')}},
 bronn(){if(!side){R(3,1,10,3,P.hd);R(3,1,10,1,P.hdD);if(!back){R(4,3,3,2,'#5a4a2a');R(9,3,3,2,'#5a4a2a');R(5,3,1,1,P.ac);R(10,3,1,1,P.ac);R(4,7,8,4,P.hair);R(5,11,6,1,P.hair);R(7,7,2,1,'#b85a1a')}else{R(3,1,10,8,P.hd);R(3,4,10,1,'#5a4a2a')}
   R(5,9,1,4,P.belt);R(10,9,1,4,P.belt);R(2,10,12,1,P.bd);if(!back){R(14,11,1,4,'#aab3c0');R(13,10,3,1,'#aab3c0')}}
  else{R(4,1,8,3,P.hd);R(4,1,8,1,P.hdD);if(!back){R(9,3,3,2,'#5a4a2a');D(10,3,P.ac);R(8,7,4,4,P.hair);R(9,11,2,1,P.hair);R(12,11,1,4,'#aab3c0')}else{R(4,1,8,8,P.hd);R(4,4,8,1,'#5a4a2a')}}},
 rhea(){const f=fr%2;if(!side){R(3,1,10,3,P.hair);R(3,4,1,4,P.hair);R(12,4,1,4,P.hair);D(4,0,P.hd);D(7,0,P.hd);D(10,0,P.hd);R(5,0,1,1,P.hair);R(8+f,0,1,1,P.hair);D(11,0,P.hair);if(back)R(3,1,10,9,P.hair),D(6,1,P.hd),D(9,2,P.hd);
   if(!back){D(5,6,P.ac);D(10,6,P.ac);R(13,7,1,8,'#6b3e1e');R(13,6,3,3,'#c7ced8');D(15,7,'#ffffff')}R(4,9,8,1,'#c7ced8')}
  else{R(4,1,8,3,P.hair);R(4,4,3,5,P.hair);D(5,0,P.hd);D(8,0,P.hd);D(11,0,P.hd);R(1,2,3,1,P.hair);D(2,1,P.hd);if(back)R(4,1,8,9,P.hair);else{D(9,6,P.ac);R(11,7,1,8,'#6b3e1e');R(11,6,3,3,'#c7ced8')}}},
 sorin(){if(!side){R(2,1,12,3,P.hd);R(2,4,2,6,P.hd);R(12,4,2,6,P.hd);R(3,1,10,1,'#ffffff');R(4,3,8,1,P.hair);if(back){R(2,1,12,9,P.hd);R(4,10,8,5,P.bdD)}
   if(!back){R(1,6,1,10,'#8a5a2e');D(2,5,'#8a5a2e');D(2,16,'#8a5a2e');R(2,6,1,10,'rgba(255,255,255,.55)');D(1,5,P.ac)}else{R(11,8,1,7,'#8a5a2e')}}
  else{R(3,1,9,3,P.hd);R(3,4,4,6,P.hd);R(4,1,7,1,'#ffffff');R(7,3,5,1,P.hair);if(back)R(3,1,9,9,P.hd);else{R(12,6,1,10,'#8a5a2e');D(13,5,P.ac);R(11,6,1,10,'rgba(255,255,255,.5)')}R(2,10,3,5,P.bdD)}},
 vex(){if(!side){R(3,1,10,3,P.hd);R(3,4,1,6,P.hd);R(12,4,1,6,P.hd);R(2,0,1,2,'#d9c6ff');D(3,0,'#d9c6ff');R(13,0,1,2,'#d9c6ff');D(12,0,'#d9c6ff');if(!back){R(4,4,8,1,'#1a0f2a');R(7,10,2,2,P.belt);D(4,14,P.belt);D(11,14,P.belt)}else{R(3,1,10,9,P.hd);D(2,0,'#d9c6ff');D(13,0,'#d9c6ff')}}
  else{R(4,1,8,3,P.hd);R(4,4,3,6,P.hd);R(6,0,1,2,'#d9c6ff');D(7,0,'#d9c6ff');if(back)R(4,1,8,9,P.hd);else{R(7,4,5,1,'#1a0f2a');D(9,11,P.belt)}}}
 })[id]();
 /* auto outline: every empty pixel next to a filled one becomes the dark outline colour */
 const im=g.getImageData(0,0,PXW,PXH),d=im.data,o=new Uint8Array(PXW*PXH);for(let i=0;i<PXW*PXH;i++)o[i]=d[i*4+3]>40?1:0;
 for(let y=0;y<PXH;y++)for(let x=0;x<PXW;x++){const i=y*PXW+x;if(o[i])continue;if((x>0&&o[i-1])||(x<PXW-1&&o[i+1])||(y>0&&o[i-PXW])||(y<PXH-1&&o[i+PXW])){d[i*4]=29;d[i*4+1]=24;d[i*4+2]=56;d[i*4+3]=255}}
 g.putImageData(im,0,0);return cv}
function pxGet(id,dir,fr,pose){const k=id+dir+fr+pose;let s=PXC.get(k);if(!s){s=pxPaint(id,dir,fr,pose);PXC.set(k,s)}return s}
function pxDir(fx,fy){if(fy>.5)return 0;if(fy<-.5)return 1;if(fx>.3)return 2;if(fx<-.3)return 3;return 0}
function drawPix(x,cx,cy,k,o){const s=SK[k],id=s.id,dirR=pxDir(o.fx||0,o.fy||0),mir=dirR==3,dir=mir?2:dirR,fr=o.mv?1+(Math.floor((o.anim||0)*1.25)%2):0,pose=o.win?2:o.hurt?1:0,t=tm;
 const im=pxGet(id,dir,fr,pose),w=PXW*PXS,h=PXH*PXS,top=cy+18-h;
 /* hybrid layer behind the sprite */
 if(id=='vex'&&!LOWFX){const a=t*2.2;E(x,cx+Math.cos(a)*16,cy-4+Math.sin(a)*6,6,6,'rgba(255,61,240,.18)')}
 x.save();x.imageSmoothingEnabled=false;if(mir){x.translate(cx,0);x.scale(-1,1);x.drawImage(im,-w/2,top,w,h)}else x.drawImage(im,cx-w/2,top,w,h);x.restore();
 /* hybrid layer on top: small canvas effects that pixel art can't animate smoothly */
 const sx=v=>mir?cx-(v*PXS+PXS-w/2):cx-w/2+v*PXS+PXS,sy=v=>top+v*PXS+PXS;
 if(id=='eldra'){const a=t*2.6;x.save();if(!LOWFX){x.shadowColor='#5ff2ff';x.shadowBlur=8}const rx=cx+Math.cos(a)*17,ry=cy-6+Math.sin(a)*5;P(x,[[rx,ry-4],[rx+3,ry],[rx,ry+4],[rx-3,ry]],'#5ff2ff','#1d1838',1);x.restore()}
 else if(id=='vex'){const a=t*2.2;x.save();if(!LOWFX){x.shadowColor='#3dfff0';x.shadowBlur=10}E(x,cx+Math.cos(a)*16,cy-4+Math.sin(a)*6,3,3,'#3dfff0','#1d1838',1);x.restore()}
 else if(id=='rhea'&&!LOWFX){for(let i=0;i<2;i++){const u=(t*1.6+i*.5)%1;E(x,cx+Math.sin(t*5+i*3)*6,top+2-u*10,1.6*(1-u)+.4,1.6*(1-u)+.4,`rgba(255,${150+i*60},40,${1-u})`)}}
 else if(id=='taven'&&dir!=1){x.save();if(!LOWFX){x.shadowColor='#7dffb0';x.shadowBlur=10}E(x,sx(dir==2?12:14),sy(1.5),1.8+Math.sin(t*4)*.5,1.8+Math.sin(t*4)*.5,'#c8ffd8');x.restore()}
 else if(id=='sorin'&&!LOWFX&&Math.sin(t*3.1)>.75){const u=(Math.sin(t*3.1)-.75)*4;star(x,cx+(mir?-1:1)*(dir==2?14:-12),cy-8,2+u*2,'#e8fbff')}
 else if(id=='bronn'&&dir!=1&&(t*.7%1)<.12){E(x,sx(dir==2?10:5),sy(3),2,2,'rgba(255,255,255,.9)')}
 else if(id=='kael'&&dir!=1&&(t*.5%1)<.15){const u=(t*.5%1)/.15;x.save();x.globalAlpha=.7*(1-u);L(x,sx(dir==2?10:12),sy(9+u*6),sx(dir==2?14:15),sy(7+u*6),'#ffffff',2);x.restore()}
 else if(id=='nyra'&&o.mv&&!LOWFX){E(x,cx-(mir?-1:1)*(dir==2?10:0),cy+14,6,2.5,'rgba(70,35,130,.3)')}}
const _dcRPG=drawChar;drawChar=function(x,cx,cy,k,o){o=o||{};if(SK[k]&&SK[k].rpg)return drawPix(x,cx,cy,k,o);return _dcRPG(x,cx,cy,k,o)};
/* ---------- ability visuals (drawn on host and guests from the same synced state) ---------- */
function rpgGround(){c.save();
 for(const f of FFD){const u=Math.max(0,Math.min(1,f.t/f.ml)),a=Math.min(1,f.t*2)*(.35+.1*Math.sin(tm*4));
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=f.x+dx,y=f.y+dy;if(!G[y]||G[y][x]==1)continue;const px=x*T,py=OY+y*T;
   c.fillStyle=`rgba(170,230,255,${a})`;c.fillRect(px+2,py+2,T-4,T-4);c.strokeStyle=`rgba(255,255,255,${a+.2})`;c.lineWidth=1.5;
   const m=px+T/2,n=py+T/2;for(let i=0;i<3;i++){const an=i*Math.PI/3+tm*.3;c.beginPath();c.moveTo(m-Math.cos(an)*8,n-Math.sin(an)*8);c.lineTo(m+Math.cos(an)*8,n+Math.sin(an)*8);c.stroke()}}
  c.strokeStyle='rgba(159,240,255,.9)';c.lineWidth=2.5;c.strokeRect((f.x-1)*T+2,OY+(f.y-1)*T+2,T*3-4,T*3-4);
  c.fillStyle='#e8fbff';c.fillRect((f.x-1)*T+4,OY+(f.y-1)*T-3,(T*3-8)*u,3)}
 for(const a of APL){const u=1-Math.max(0,a.t/a.ml),cx=a.x*T+T/2,cy=OY+a.y*T+T/2;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const m=Math.abs(dx)+Math.abs(dy);if(m<1||m>2)continue;const x=a.x+dx,y=a.y+dy;if(!G[y]||G[y][x]==1)continue;
   c.fillStyle=`rgba(95,242,255,${.12+.3*u})`;c.fillRect(x*T+4,OY+y*T+4,T-8,T-8)}
  c.save();if(!LOWFX){c.shadowColor='#5ff2ff';c.shadowBlur=12}c.strokeStyle='#5ff2ff';c.lineWidth=3;c.beginPath();c.arc(cx,cy,T*2.3*u+6,0,7);c.stroke();
  c.translate(cx,cy);c.rotate(tm*3);c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;c.strokeRect(-12,-12,24,24);c.rotate(Math.PI/4);c.strokeRect(-12,-12,24,24);c.restore()}
 for(const p of pl||[]){if(!p.rift||!p.alive)continue;const r=p.rift,cx=r.x*T+T/2,cy=OY+r.y*T+T/2,u=Math.max(0,Math.min(1,(p.rfT||0)/AB.riftecho.dur));
  c.save();c.globalAlpha=.35;c.setLineDash([5,6]);c.strokeStyle='#ff3df0';c.lineWidth=2;c.beginPath();c.moveTo(cx,cy);c.lineTo(p.x*T,OY+p.y*T+10);c.stroke();c.restore();
  c.save();if(!LOWFX){c.shadowColor='#ff3df0';c.shadowBlur=14}c.translate(cx,cy);c.rotate(tm*2);
  for(let i=0;i<2;i++){c.strokeStyle=i?'#3dfff0':'#ff3df0';c.lineWidth=3;c.beginPath();c.ellipse(0,0,15-i*5,8-i*3,i*1.2,0,7);c.stroke()}c.restore();
  c.strokeStyle='#ffffff';c.lineWidth=2.5;c.beginPath();c.arc(cx,cy,19,-Math.PI/2,-Math.PI/2+Math.PI*2*u);c.stroke()}
 for(const d of DEC){const cx=d.x*T+T/2,cy=OY+d.y*T+T/2,u=Math.max(0,d.t/d.ml),bl=Math.sin(tm*(8+(1-u)*20))>0;
  E(c,cx,cy+12,13,4,'rgba(0,0,0,.35)');c.save();c.translate(cx,cy);c.rotate(tm*1.5);c.fillStyle='#8f7030';
  for(let i=0;i<8;i++){c.rotate(Math.PI/4);c.fillRect(-3,-15,6,6)}E(c,0,0,12,12,'#c9a24a',OL,2);c.restore();
  E(c,cx,cy,5,5,bl?'#ff4d5e':'#7a1010',OL,1.5);c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=2;c.beginPath();c.arc(cx,cy,17,-Math.PI/2,-Math.PI/2+Math.PI*2*u);c.stroke()}
 c.restore()}
const _mhDrawRPG=mhDraw;mhDraw=function(){_mhDrawRPG();rpgGround()};
const _drawPRPG=drawP;drawP=function(p){_drawPRPG(p);if(!p.alive||p.off)return;const px=p.x*T,py=OY+p.y*T;
 if(p.kgT>0){c.save();const a=.5+.25*Math.sin(tm*8);c.strokeStyle=`rgba(220,230,245,${a})`;c.lineWidth=3;c.beginPath();for(let i=0;i<=6;i++){const an=i*Math.PI/3+tm*.8,r=25;i?c.lineTo(px+Math.cos(an)*r,py+Math.sin(an)*r):c.moveTo(px+Math.cos(an)*r,py+Math.sin(an)*r)}c.stroke();
  c.fillStyle=`rgba(170,190,220,${a*.25})`;c.fill();c.restore()}
 if(p.tvT>0){for(let i=0;i<3;i++){const an=tm*2.5+i*2.09;c.save();c.translate(px+Math.cos(an)*20,py+Math.sin(an)*9);c.rotate(an);E(c,0,0,4,2,'#5ad07a',OL,1);c.restore()}}
 if(p.sd&&!LOWFX){c.save();c.globalAlpha=.35;E(c,px-p.sd.dx*14,py-p.sd.dy*14,14,14,'rgba(70,35,130,.6)');c.restore()}};

