/* [b9 · 2245-2289] */
/* =====================================================================
   MECHA REWORK — LOCK-ON ROCKET (replaces the spammable homing missile)
   0.6s visible lock-on (laser + reticle) -> slow rocket with a capped turn rate,
   short range and life. Walls, crates and bombs stop it, blasts destroy it.
   Never locks onto invulnerable / frozen / vanished / just-hit targets.
   ===================================================================== */
const MR={cd:16,wind:.6,sp:2.6,turn:2.6,rng:6,lose:7.5,life:3,dmg:20,rehit:4};
AB.mecha={n:'LOCK-ON ROCKET',cd:MR.cd,d:'Aim for 0.6s at the nearest foe within 6 tiles (red laser), then fire a slow seeker rocket. Walls, crates and blasts stop it (20 damage).'};
$('abl').innerHTML=SK.filter(s=>s.g!='Colour').map(s=>`<span><b>${s.n}</b> · ${AB[s.a].n}: ${AB[s.a].d}</span>`).join('')+`<span><b>Colour fighters</b> · DASH: ${AB.dash.d}</span>`;
function mrOk(q,ow){if(!q)return 0;if(pl.includes(q))return pvp()&&q!==ow&&q.alive&&!q.off&&!(q.ivT>0)&&!(q.inv>0)&&!(q.fz>0)&&!(q.mhT>0);
 return en.includes(q)&&!(q.sl>0)&&!(q.t=='s'&&Math.sin((q.vt||0)*2)<=-.6)}
mtarget=function(m,ow){ow=ow||pl[m.o];let best=null,bd=MR.rng;if(pvp()&&ow)for(const q of rivals(ow))if(mrOk(q,ow)){const d=Math.hypot(q.x-m.x,q.y-m.y);if(d<bd){bd=d;best=q}}
 for(const e of en)if(mrOk(e,ow)){const d=Math.hypot(e.x-m.x,e.y-m.y);if(d<bd){bd=d;best=e}}return best};
function mrCode(t){if(!t)return -1;const i=pl.indexOf(t);if(i>=0)return i;const j=en.indexOf(t);return j>=0?10+j:-1}
function mrTgt(m){if(net.role=='guest'){const c=m.tc==null?-1:m.tc;return c<0?null:c<10?pl[c]:en[c-10]}return m.tr||null}
function mrBoom(m,x,y){m.t=0;m.dn=1;const ow=pl[m.o];if(ow&&ow.alive&&(ow.x|0)==x&&(ow.y|0)==y){puff(x+.5,y+.5,'rgba(200,200,220,.7)',6,8);return}blast(x,y,0,0,m.o,1,undefined,{dmg:MR.dmg,kd:'s'})}
function mrUpd(dt){for(const m of msl){const ow=pl[m.o];
  if(m.w>0){if(!ow||!ow.alive||ow.off){m.t=0;m.dn=1;continue}m.w-=dt;m.x=ow.x;m.y=ow.y;if(m.tr&&!mrOk(m.tr,ow))m.tr=mtarget(m,ow);
   if(m.tr){const dx=m.tr.x-m.x,dy=m.tr.y-m.y,d=Math.hypot(dx,dy)||1;m.vx=dx/d;m.vy=dy/d}else{m.vx=ow.fx||(ow.fy?0:1);m.vy=ow.fy||0}
   if(m.w<=0){m.w=0;m.x=ow.x+m.vx*.3;m.y=ow.y+m.vy*.3;m.lx=ow.x|0;m.ly=ow.y|0;tn(320,.35,'sawtooth',.16,600)}continue}
  m.t-=dt;const tg=m.tr;
  if(tg&&!(mrOk(tg,ow)&&Math.hypot(tg.x-m.x,tg.y-m.y)<=MR.lose))m.tr=null;
  if(m.tr){const a0=Math.atan2(m.vy,m.vx);let da=Math.atan2(m.tr.y-m.y,m.tr.x-m.x)-a0;da=Math.atan2(Math.sin(da),Math.cos(da));const mx=MR.turn*dt;da=Math.max(-mx,Math.min(mx,da));m.vx=Math.cos(a0+da);m.vy=Math.sin(a0+da)}
  m.x+=m.vx*MR.sp*dt;m.y+=m.vy*MR.sp*dt;const cx=m.x|0,cy=m.y|0,v=G[cy]&&G[cy][cx];
  if(v===undefined||cx<=0||cy<=0||cx>=W-1||cy>=H-1||v!==0||bombs.some(b=>b.x==cx&&b.y==cy)){mrBoom(m,m.lx,m.ly);continue}
  m.lx=cx;m.ly=cy;
  if(fa[cy*W+cx]){m.t=0;m.dn=1;puff(m.x,m.y,'rgba(200,200,220,.7)',6,8);ring(m.x,m.y,.6,'#ff3b3b',.25,.2);continue}
  let hit=null;if(pvp())for(const q of rivals(ow))if(mrOk(q,ow)&&Math.hypot(q.x-m.x,q.y-m.y)<.45){hit=q;break}
  if(!hit)for(const e of en)if(mrOk(e,ow)&&Math.hypot(e.x-m.x,e.y-m.y)<(e.t=='b'?.85:.45)){hit=e;break}
  if(hit){const hx=hit.x|0,hy=hit.y|0;if(pl.includes(hit))hit.mhT=MR.rehit;mrBoom(m,G[hy]&&G[hy][hx]===0?hx:m.lx,G[hy]&&G[hy][hx]===0?hy:m.ly);continue}
  if(R()<(LOWFX?.3:.6))fxl.push({k:'puff',x:m.x,y:m.y,vx:0,vy:-.3,r:4,t:.35,ml:.35,c:'rgba(200,200,220,.6)'});
  if(m.t<=0)mrBoom(m,m.lx,m.ly)}
 msl=msl.filter(m=>m.t>0&&!m.dn);for(const q of pl)if(q.mhT>0)q.mhT-=dt}
const _abUpdMR=abUpd;abUpd=function(dt){const keep=msl;msl=[];_abUpdMR(dt);msl=keep;mrUpd(dt)};
const _useAbMR=useAb;useAb=function(p){const a=abil(p),n0=msl.length;_useAbMR(p);if(a!='mecha'||msl.length<=n0)return;
 const m=msl[msl.length-1];m.w=MR.wind;m.t=MR.life;m.x=p.x;m.y=p.y;m.tr=mtarget(m,p);
 if(m.tr){txt.push({x:m.tr.x,y:m.tr.y-.9,t:.8,s:'LOCKED!',c:'#ff3b3b'});tn(1400,.09,'square',.12,0);tn(1400,.09,'square',.12,0,.15)}else txt.push({x:p.x,y:p.y-.9,t:.8,s:'NO LOCK',c:'#aab'})};
function mrDraw(){for(const m of msl){const tg=mrTgt(m),w=m.w||0,X=m.x*T,Y=OY+m.y*T;c.save();c.lineCap='round';
  if(w>0){const u=1-w/MR.wind;c.strokeStyle='#ff3b3b';c.lineWidth=3;c.beginPath();c.arc(X,Y,T*.55,-Math.PI/2,-Math.PI/2+u*Math.PI*2);c.stroke()}
  if(tg&&(tg.alive===undefined||tg.alive)){const tx=tg.x*T,ty=OY+tg.y*T,big=tg.t=='b'?1.7:1;
   if(w>0){c.globalAlpha=.45+.4*Math.sin(tm*40);c.strokeStyle='#ff3b3b';c.lineWidth=2;if(!LOWFX)c.setLineDash([6,5]);c.beginPath();c.moveTo(X,Y);c.lineTo(tx,ty);c.stroke();c.setLineDash([])}
   const r=T*.5*big*(w>0?1+.5*(w/MR.wind):.8),ro=tm*3;c.globalAlpha=w>0?.95:.6;c.strokeStyle='#ff3b3b';c.lineWidth=w>0?3:2;
   c.beginPath();c.arc(tx,ty,r,0,7);c.stroke();c.beginPath();for(let i=0;i<4;i++){const a=ro+i*Math.PI/2;c.moveTo(tx+Math.cos(a)*(r-6),ty+Math.sin(a)*(r-6));c.lineTo(tx+Math.cos(a)*(r+6),ty+Math.sin(a)*(r+6))}c.stroke()}
  c.restore()}}
/* [b9 · 2291-2294] */
const _snapMR=snap;snap=function(){const o=_snapMR();o.ms=msl.map(m=>[f2(m.x),f2(m.y),f2(m.vx),f2(m.vy),f2(Math.max(0,m.w||0)),mrCode(m.tr)]);return o};
const _applySnapMR=applySnap;applySnap=function(m){const q0=net.sqr;_applySnapMR(m);if(net.sqr!==m.q||q0===m.q||!m.ms)return;m.ms.forEach((a,i)=>{const o=msl[i];if(o){o.w=a[4]||0;o.tc=a[5]==null?-1:a[5]}})};
const _guestTickMR=guestTick;guestTick=function(dt){const s=msl.map(m=>[m.x,m.y]);_guestTickMR(dt);msl.forEach((m,i)=>{const a=s[i];if(!a)return;if(m.w>0){m.w=Math.max(0,m.w-dt);m.x=a[0];m.y=a[1]}else{m.x=a[0]+m.vx*MR.sp*dt;m.y=a[1]+m.vy*MR.sp*dt}})};
