/* [b2 · 323-323] */
const PU=[{k:'fire',e:'🔥',c:'#ff7a1a',w:20},{k:'bomb',e:'💣',c:'#9aa5ff',w:18},{k:'speed',e:'⚡',c:'#ffe14a',w:16},{k:'shield',e:'🛡️',c:'#5fd8ff',w:10},{k:'ghost',e:'👟',c:'#c8a0ff',w:8},{k:'mega',e:'🧨',c:'#ff5ad9',w:8},{k:'remote',e:'⏱️',c:'#7dffb0',w:8},{k:'life',e:'❤️',c:'#ff5c7a',w:6},{k:'throw',e:'💪',c:'#ffa94d',w:8},{k:'freeze',e:'❄️',c:'#8be9ff',w:8},{k:'swap',e:'🔄',c:'#ff9ff3',w:6}];
/* [b2 · 383-385] */
const pvp=()=>S.mode<5&&NPL>1;
const rivals=p=>pl.filter(o=>o!=p&&!o.off&&o.alive);
const nearRival=(p,x,y)=>{let b=null,bd=1e9;for(const o of rivals(p)){const d=Math.hypot(o.x-x,o.y-y);if(d<bd){bd=d;b=o}}return b};
/* [b2 · 476-476] */
function wpick(){const ok=p=>!(NPL==1&&p.k=='swap');let t=0;PU.forEach(p=>{if(ok(p))t+=p.w});let r=R()*t;for(let i=0;i<PU.length;i++){if(!ok(PU[i]))continue;r-=PU[i].w;if(r<0)return i}return 0}
/* ---------- POWER-UP BALANCING ----------
   Crates hide power-ups less often, only a few can be on the field, and a cooldown
   separates reveals. Late in a round they get rarer still. Boss loot ignores the limits. */
/* [b2 · 482-485] */
const puRate=()=>NPL==1?.3:.28,maxItems=()=>NPL==1?3:NPL>2?7:5,puCool=()=>NPL==1?4.5:NPL>2?2.6:3.5;
function spawnItem(x,y,k,force){if(!force){if(puCD>0||items.length>=maxItems())return 0;if(R()>(el<90?1:el<180?.75:.5))return 0}
 if(!G[y]||G[y][x]!==0||items.some(i=>i.x==x&&i.y==y)||lava.some(l=>l.x==x&&l.y==y)||cl.some(q=>q.x==x&&q.y==y))return 0;
 items.push({x,y,k,age:0});if(!force)puCD=puCool();return 1}
/* [b2 · 524-551] */
function solid(tx,ty,p){const v=G[ty]&&G[ty][tx];if(v===undefined)return 1;if(v==1)return p.phT>0&&tx>0&&ty>0&&tx<W-1&&ty<H-1?0:1;if(v==2&&!(p.ghost>0||p.phT>0))return 1;for(const b of bombs)if(b.x==tx&&b.y==ty&&!b.pass.has(p.id))return 1;return 0}
function hit(p,x,y){const r=.36;for(let ty=Math.floor(y-r);ty<=Math.floor(y+r);ty++)for(let tx=Math.floor(x-r);tx<=Math.floor(x+r);tx++)if(solid(tx,ty,p))return 1;return 0}
function mv(p,dx,dy){const nx=p.x+dx,ny=p.y+dy;if(!hit(p,nx,ny)){p.x=nx;p.y=ny;return}
 if(dx){p.vx=0;const cy=Math.floor(p.y)+.5,o=cy-p.y;if(Math.abs(o)>.001&&Math.abs(o)<.45){const y2=p.y+Math.sign(o)*Math.min(Math.abs(o),Math.abs(dx));if(!hit(p,p.x,y2))p.y=y2}tryKick(p,Math.sign(dx),0)}
 if(dy){p.vy=0;const cx=Math.floor(p.x)+.5,o=cx-p.x;if(Math.abs(o)>.001&&Math.abs(o)<.45){const x2=p.x+Math.sign(o)*Math.min(Math.abs(o),Math.abs(dy));if(!hit(p,x2,p.y))p.x=x2}tryKick(p,0,Math.sign(dy))}}
function bfree(tx,ty,b){const v=G[ty]&&G[ty][tx];if(v!==0)return 0;if(bombs.some(o=>o!=b&&o.x==tx&&o.y==ty))return 0;return!pl.some(q=>q.alive&&(q.x|0)==tx&&(q.y|0)==ty)}
function tryKick(p,dx,dy){if(p.kcd>0)return;const tx=(p.x|0)+dx,ty=(p.y|0)+dy,b=bombs.find(o=>o.x==tx&&o.y==ty&&!o.dx&&!o.dy&&!o.pass.has(p.id));if(!b||!bfree(tx+dx,ty+dy,b))return;if(dx&&Math.abs(p.y-(ty+.5))>.3||dy&&Math.abs(p.x-(tx+.5))>.3)return;b.dx=dx;b.dy=dy;b.k=0;p.kcd=1.2;SFX.kick();burst(tx+.5,ty+.5,'#fff',6)}
function ctl(p,dt){const k=CT[p.id];p.inv=Math.max(0,p.inv-dt);p.cd=Math.max(0,p.cd-dt);p.kcd=Math.max(0,p.kcd-dt);p.bcd=Math.max(0,p.bcd-dt);p.tp=Math.max(0,p.tp-dt);p.remote=Math.max(0,p.remote-dt);p.dsh=Math.max(0,p.dsh-dt);p.throwT=Math.max(0,p.throwT-dt);p.fz=Math.max(0,p.fz-dt);for(const k2 of['ivT','phT','fsT','pry','vkT'])p[k2]=Math.max(0,p[k2]-dt);
 if(p.phW&&p.phT<=0){p.phW=0;if(hit(p,p.x,p.y))unstick(p)}
 if(p.ghost>0&&G[p.y|0][p.x|0]!=2)p.ghost=Math.max(0,p.ghost-dt);
 let ax=(K[k.r]?1:0)-(K[k.l]?1:0),ay=(K[k.d]?1:0)-(K[k.u]?1:0);if(ax&&ay){if(p.ax=='x')ay=0;else ax=0}if(p.fz>0)ax=ay=0;if(p.rv>0){p.rv-=dt;ax=-ax;ay=-ay}if(ax||ay){p.fx=ax;p.fy=ay}
 if(tap[k.s]&&p.cd<=0&&p.fz<=0)useAb(p);
 let sp=2.9+.4*p.spd;if(sq[p.y|0][p.x|0]==1)sp*=.55;if(p.slow>0){p.slow-=dt;sp*=.6}if(p.dsh>0){sp=12;ax=p.fx;ay=p.fy;if(R()<.6)burst(p.x,p.y,p.c,1)}
 const ic=CM==2&&p.dsh<=0?(sq[p.y|0][p.x|0]==5?2.4:8):0;if(ic){const f=Math.min(1,dt*ic);p.vx+=(ax*sp-p.vx)*f;p.vy+=(ay*sp-p.vy)*f}else{p.vx=ax*sp;p.vy=ay*sp}
 const n=Math.ceil(Math.max(Math.abs(p.vx),Math.abs(p.vy))*dt/.1)||1;for(let i=0;i<n;i++){mv(p,p.vx*dt/n,0);mv(p,0,p.vy*dt/n)}
 p.anim+=Math.hypot(p.vx,p.vy)*dt*2;
 if(tap[k.b]||(S.mode==3&&K[k.b]))place(p);
 if(tap[k.m])bombs.forEach(b=>{if(b.o==p&&b.rem)b.t=0});
 const tx=p.x|0,ty=p.y|0,pv=sq[ty][tx];if((pv==2||pv==3)&&!p.tp){const o=ports.find(q=>q.v==pv&&(q.x!=tx||q.y!=ty));if(o){burst(p.x,p.y,'#0ff',12);p.x=o.x+.5;p.y=o.y+.5;p.tp=1.2;burst(p.x,p.y,'#f2d',12);tn(900,.2,'sine',.2,600)}}
 for(const it of items.slice())if(Math.abs(p.x-it.x-.5)<.5&&Math.abs(p.y-it.y-.5)<.5){grab(p,it);items.splice(items.indexOf(it),1)}
 hurtCell(p)}
function unstick(p){const x0=p.x|0,y0=p.y|0,seen=new Set([x0+','+y0]),q=[[x0,y0]];while(q.length){const[a,b]=q.shift();if(G[b]&&G[b][a]===0&&!bombs.some(o=>o.x==a&&o.y==b)){p.x=a+.5;p.y=b+.5;p.vx=p.vy=0;puff(p.x,p.y,'rgba(220,225,255,.7)',6,8);return}for(const[dx,dy]of DIR){const nx=a+dx,ny=b+dy,k=nx+','+ny;if(!seen.has(k)&&nx>0&&ny>0&&nx<W-1&&ny<H-1){seen.add(k);q.push([nx,ny])}}}}
function hurtCell(p){const i=(p.y|0)*W+(p.x|0);if(p.alive&&fa[i])hurt(p,0,fa[i]-2,fd[i]||35,fk[i]||'n')}
function grab(p,it){const d=PU[it.k];ST[p.id]&&ST[p.id].pu++;SFX.pu();
 burst(it.x+.5,it.y+.5,d.c,20);ring(it.x+.5,it.y+.5,1.5,d.c,.45,.2);
 for(let i=0;i<8;i++)fxLocal({k:'star',x:it.x+.5,y:it.y+.5,vx:rr(-2,2),vy:rr(-2.5,1),r:rr(3,5),t:.4,ml:.4,c:d.c});
 if(d.k=='fire')p.rng=Math.min(8,p.rng+1);else if(d.k=='bomb')p.maxB=Math.min(S.mode==3?9:6,p.maxB+1);else if(d.k=='speed')p.spd=Math.min(5,p.spd+1);else if(d.k=='shield')p.shield=Math.min(2,p.shield+1);else if(d.k=='ghost')p.ghost=10;else if(d.k=='mega')p.mega=Math.min(3,p.mega+1);else if(d.k=='remote')p.remote=15;else if(d.k=='life'){const h=Math.min(35,150-p.hp);if(h>0){p.hp+=h;dmgNum(p.x,p.y-.4,h,'heal');SFX.heal()}}else if(d.k=='throw')p.throwT=12;else if(d.k=='freeze'){frzT=4;if(S.mode<5)rivals(p).forEach(q=>q.fz=2)}else if(d.k=='swap')swap(p);
 txt.push({x:p.x,y:p.y-.9,t:1,s:d.k=='life'?'+HEALTH':'+'+d.k.toUpperCase(),c:d.c})}
/* ---------- HEALTH SYSTEM ----------
   100 HP. kinds: n bomb, c critical (mega / chain x3+), s ability, h hazard (lava, meteor),
   m monster contact, t toxic, x crushed by the closing arena (always lethal). */
/* [b2 · 555-566] */
const FIREK='nchs';
function hurt(p,force,by,dmg,kd){if(!p||!p.alive||st!='play'||(p.inv>0&&!force))return;if(dmg==null)dmg=35;if(by==null)by=-1;kd=kd||(force?'x':'n');const fireK=FIREK.includes(kd);
 if(!force){
  if(p.fsT>0&&fireK){p.inv=.6;txt.push({x:p.x,y:p.y-.8,t:.8,s:'FIREPROOF!',c:'#7fd0ff'});burst(p.x,p.y,'#7fd0ff',8);tn(900,.15,'sine',.12,-300);return}
  if(p.pry>0&&fireK){p.pry=0;p.inv=.9;txt.push({x:p.x,y:p.y-.8,t:1,s:'PARRY!',c:'#fff'});counter(p);SFX.parry();shk=Math.min(1,shk+.25);return}
  if(p.shield){p.shield--;p.inv=1;txt.push({x:p.x,y:p.y-.8,t:1,s:'BLOCKED!',c:'#7df'});burst(p.x,p.y,'#7df',14);SFX.hit();return}
  if(p.vkT>0)dmg=Math.ceil(dmg/2)}
 const d=force?Math.max(1,Math.ceil(p.hp)):Math.min(Math.ceil(p.hp),Math.round(dmg));if(d<=0)return;p.hp=Math.max(0,p.hp-d);
 if(by>=0&&by!=p.id&&ST[by]){ST[by].hits++;ST[by].dmg+=d}
 dmgNum(p.x,p.y-.5,d,kd);p.hf=.3;p.inv=d>=20?2:1;SFX.hit();shk=Math.min(1,shk+.3+d/160);burst(p.x,p.y,p.c,16);
 if(p.hp<=0){p.alive=0;p.dtm=tm;burst(p.x,p.y,p.c,36);burst(p.x,p.y,'#fff',12);SFX.elim();txt.push({x:p.x,y:p.y-1,t:1.5,s:p.n+' ELIMINATED',c:p.c})}}
function hurtM(p,e){const hp0=p.hp;hurt(p,0,-1,e.t=='b'?BDMG.touch:20,e.t=='b'?'Q':'m');if(p.alive&&p.hp<hp0){const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;for(let i=0;i<3;i++){mv(p,dx/d*.1,0);mv(p,0,dy/d*.1)}}}
/* floating damage numbers; stacked so simultaneous hits don't overlap */
/* [b2 · 568-582] */
function dmgNum(x,y,v,k){v=Math.round(v);if(!(v>0))return;const near=dmgs.filter(d=>d.t>d.ml-.4&&Math.abs(d.x0-x)<.9&&Math.abs(d.y0-y)<.9).length;
 dmgs.push({x0:x,y0:y,x:x+(near?(near%2?.38:-.38)*Math.ceil(near/2):0),y:y-near*.32,v,k,t:1.1,ml:1.1});if(dmgs.length>48)dmgs.shift();
 if(typeof rec=='function'&&rec()&&dmq.length<24)dmq.push([f2(x),f2(y),v,k])}
function place(p){let x=p.x|0,y=p.y|0;if(p.fz>0)return;if(p.throwT>0&&!bombs.some(b=>b.x==x&&b.y==y)){for(let i=3;i>0;i--){const tx=x+p.fx*i,ty=y+p.fy*i;if(G[ty]&&G[ty][tx]===0&&!bombs.some(b=>b.x==tx&&b.y==ty)){x=tx;y=ty;burst(x+.5,y+.5,'#ffa94d',8);break}}}if(p.bcd>0||G[y][x]==2||bombs.some(b=>b.x==x&&b.y==y)||bombs.filter(b=>b.o==p).length>=p.maxB)return;const mg=p.mega>0;if(mg)p.mega--;
 const b={x,y,t:p.remote>0?6:2.5,o:p,range:p.rng+(mg?2:0),mega:mg,rem:p.remote>0,pass:new Set(),dx:0,dy:0,k:0,tk:0};pl.forEach(q=>{if(Math.abs(q.x-x-.5)<.86&&Math.abs(q.y-y-.5)<.86)b.pass.add(q.id)});bombs.push(b);p.bcd=S.mode==3?.3:.12;SFX.place()}
function crate(x,y,o){if(o>=0&&ST[o])ST[o].cr++;G[y][x]=0;burst(x+.5,y+.5,MAPS[CM].c,10);burst(x+.5,y+.5,MAPS[CM].ce,4);if(el-lastTick>.05){SFX.crate();}if(pu[y][x]>=0){spawnItem(x,y,pu[y][x]);pu[y][x]=-1}}
function blast(x,y,r,m,ow,ch,co,o){if(co===undefined)co=ow;o=o||(m?{dmg:50,kd:'c'}:ch>=3?{dmg:40,kd:'c'}:{dmg:35,kd:'n'});if(ch>1&&co>=0&&ST[co])ST[co].ch=Math.max(ST[co].ch,ch);const cells=[[x,y]];for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])for(let i=1;i<=r;i++){const tx=x+dx*i,ty=y+dy*i,v=G[ty]&&G[ty][tx];if(v===undefined||v==1)break;cells.push([tx,ty]);if(v==2){crate(tx,ty,ow);break}const o=bombs.find(b=>b.x==tx&&b.y==ty);if(o){o.t=Math.min(o.t,.08);if(ch>=1&&ch+1>(o.chn||1)){o.chn=ch+1;o.cow=co}break}}
 for(const[cx,cy]of cells){fires.push({x:cx,y:cy,t:.55,m,o:ow,dmg:o.dmg,kd:o.kd,l:o.l||0});burst(cx+.5,cy+.5,m?'#d66bff':'#ffb020',m?7:4)}shk=Math.min(1,shk+(m?.7:.25));SFX.boom(m)}
function bombsUpd(dt){for(const b of bombs){b.t-=dt;
  if(b.dx||b.dy){if(b.k==0&&!bfree(b.x+b.dx,b.y+b.dy,b)){if(b.bn>0&&bfree(b.x-b.dx,b.y-b.dy,b)){b.bn--;b.dx=-b.dx;b.dy=-b.dy;SFX.kick();burst(b.x+.5,b.y+.5,'#ffd23f',6)}else b.dx=b.dy=0}else{b.k+=9*dt;if(b.k>=1){b.x+=b.dx;b.y+=b.dy;b.k=0;pl.forEach(q=>{if(Math.abs(q.x-b.x-.5)<.86&&Math.abs(q.y-b.y-.5)<.86)b.pass.add(q.id)})}}}
  for(const id of[...b.pass]){const q=pl[id];if(!(Math.abs(q.x-b.x-.5)<.86&&Math.abs(q.y-b.y-.5)<.86))b.pass.delete(id)}
  if(b.t<1.4){const ph=Math.floor(b.t*(b.t<.7?12:6));if(ph!=b.tk){b.tk=ph;if(el-lastTick>.1){lastTick=el;SFX.tick()}}}}
 let a=1;while(a){a=0;for(const b of bombs.slice())if(b.t<=0){bombs=bombs.filter(o=>o!=b);blast(b.x,b.y,b.range,b.mega,b.o?b.o.id:(b.sid??-1),b.chn||1,b.cow);a=1}}}
function fireUpd(dt){fires.forEach(f=>f.t-=dt);fires=fires.filter(f=>f.t>0);fa.fill(0);fd.fill(0);fires.forEach(f=>{const i=f.y*W+f.x,dm=f.dmg||35;if(dm>=fd[i]){fd[i]=dm;fk[i]=f.kd||'n';fa[i]=f.o>=0?f.o+2:1}});
 pl.forEach(hurtCell);items.forEach(i=>i.age+=dt);items=items.filter(i=>i.age<.7||!fa[i.y*W+i.x]||(burst(i.x+.5,i.y+.5,'#fa0',6),0))}
/* [b2 · 596-596] */
function pick(e){const tx=e.x|0,ty=e.y|0;let tg=null,bd=1e9;pl.forEach(p=>{if(p.alive&&!(p.ivT>0)){const d=Math.abs(p.x-e.x)+Math.abs(p.y-e.y);if(d<bd){bd=d;tg=p}}});if(!tg)tg={x:e.x+rr(-4,4),y:e.y+rr(-4,4)};let best=null,bs=1e9;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=tx+dx,ny=ty+dy;if(G[ny][nx]==1||bombs.some(b=>b.x==nx&&b.y==ny))continue;const rev=(e.lx||e.ly)&&dx==-e.lx&&dy==-e.ly;const s=Math.abs(nx+.5-tg.x)+Math.abs(ny+.5-tg.y)+R()*1.6+(rev?3:0);if(s<bs){bs=s;best=[dx,dy]}}if(!best)return 0;e.lx=e.fx=best[0];e.ly=e.fy=best[1];e.tx=tx+best[0]+.5;e.ty=ty+best[1]+.5;return 1}
/* [b2 · 616-616] */
function dropB(x,y,t,range,o){const b={x,y,t,o,range,mega:0,rem:0,pass:new Set(),dx:0,dy:0,k:0,tk:0};pl.forEach(q=>{if(Math.abs(q.x-x-.5)<.86&&Math.abs(q.y-y-.5)<.86)b.pass.add(q.id)});bombs.push(b);return b}
/* [b2 · 640-640] */
function danger(x,y){if(fa[y*W+x]||lava.some(l=>l.x==x&&l.y==y)||cl.some(q=>q.x==x&&q.y==y)||met.some(q=>q.x==x&&q.y==y)||tox.some(t=>t.x==x&&t.y==y))return 1;for(const b of bombs)if((b.x==x&&Math.abs(b.y-y)<=b.range)||(b.y==y&&Math.abs(b.x-x)<=b.range))return 1;return 0}
/* [b2 · 642-653] */
function mtarget(m){let best=null,bd=1e9;if(pvp())for(const q of rivals(pl[m.o])){if(q.ivT>0)continue;const d=Math.hypot(q.x-m.x,q.y-m.y);if(d<bd){bd=d;best=q}}for(const e of en){const d=Math.hypot(e.x-m.x,e.y-m.y);if(d<bd){bd=d;best=e}}return best}
function abUpd(dt){
 for(const e of en)e.tox=Math.max(0,(e.tox||0)-dt);
 for(const t of tox){t.t-=dt;
  for(const p of pl)if(p.alive&&p.id!=t.o&&pvp()&&(p.x|0)==t.x&&(p.y|0)==t.y){p.slow=Math.max(p.slow||0,.25);hurt(p,0,t.o,10,'t')}
  for(const e of en)if((e.x|0)==t.x&&(e.y|0)==t.y&&e.tox<=0){e.tox=1;e.hp=Math.max(0,e.hp-10);e.lh=t.o;dmgNum(e.x,e.y-.5,10,'t')}}
 tox=tox.filter(t=>t.t>0);
 for(const m of msl){m.t-=dt;const tg=mtarget(m);if(tg){const dx=tg.x-m.x,dy=tg.y-m.y,d=Math.hypot(dx,dy)||1,s=Math.min(1,dt*5);m.vx+=(dx/d-m.vx)*s;m.vy+=(dy/d-m.vy)*s;const n=Math.hypot(m.vx,m.vy)||1;m.vx/=n;m.vy/=n;if(d<.45)m.t=0}
  m.x+=m.vx*5.5*dt;m.y+=m.vy*5.5*dt;const cx=m.x|0,cy=m.y|0,v=G[cy]&&G[cy][cx];if(v===undefined||cx<=0||cy<=0||cx>=W-1||cy>=H-1)m.t=0;else if(v===0){m.lx=cx;m.ly=cy}
  if(R()<.6)fxl.push({k:'puff',x:m.x,y:m.y,vx:0,vy:-.3,r:4,t:.35,ml:.35,c:'rgba(200,200,220,.6)'});
  if(m.t<=0)blast(m.lx,m.ly,1,0,m.o,1,undefined,{dmg:25,kd:'s'})}
 msl=msl.filter(m=>m.t>0)}
/* [b3 · 954-955] */
function freeCell(){for(let i=0;i<40;i++){const x=1+R()*(W-2)|0,y=1+R()*(H-2)|0;if(G[y][x]==0)return[x,y]}return[CX,CY]}
function targets(){return pl.filter(p=>p.alive&&!(p.ivT>0))}
const _haz=haz;let survT=10;haz=function(dt){_haz(dt);if(S.mode==4&&st=='play'){survT-=dt;if(survT<=0){survT=Math.max(5,12-el*.05);survWave(1)}}};
/* [b3 · 979-989] */
const _blast=blast;blast=function(x,y,r,m,ow,ch,co,o){
 _blast(x,y,r,m,ow,ch,co,o);
 ring(x+.5,y+.5,1.2+r*.4,m?'#e6a0ff':'#ffd060',.35);
 fxl.push({k:'flash',x:x+.5,y:y+.5,r:1.1+r*.5,t:.22,ml:.22,c:m?'#e6a0ff':'#fff0b0'});
 puff(x+.5,y+.5,'rgba(90,90,110,.6)',m?10:5,14);
 if(ch>1){
  txt.push({x:x+.5,y:y,t:.75,s:'CHAIN x'+ch,c:'#ffd23f'});
  tn(320+ch*90,.12,'triangle',.18,120);
 }
 if(m||ch>=3)hitStop(.045);
};
/* [b3 · 1010-1010] */
const _grab=grab;grab=function(p,it){_grab(p,it);ring(it.x+.5,it.y+.5,1.3,PU[it.k].c,.4)};
/* [b4 · 1349-1350] */
function danger(x,y){if(fa[y*W+x]||lava.some(l=>l.x==x&&l.y==y)||cl.some(q=>q.x==x&&q.y==y)||met.some(q=>q.x==x&&q.y==y)||tox.some(t=>t.x==x&&t.y==y))return 1;
 if(mh.some(h=>Math.abs(h.x-x)+Math.abs(h.y-y)<=1))return 1;for(const b of bombs)if((b.x==x&&Math.abs(b.y-y)<=b.range)||(b.y==y&&Math.abs(b.x-x)<=b.range))return 1;return 0}
