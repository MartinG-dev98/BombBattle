/* [b2 · 592-595] */
function burst(x,y,col,n){for(let i=0;i<n;i++)pts.push({x,y,vx:rr(-3,3),vy:rr(-4,1.5),l:rr(.3,.8),ml:.8,c:col,s:rr(2,5),g:9})}
function confetti(){for(let i=0;i<120;i++)pts.push({x:rr(0,W),y:rr(-4,0),vx:rr(-1,1),vy:rr(1,4),l:rr(2,4),ml:4,c:['#ffd23f','#35a7ff','#ff4d5e','#7dffb0','#ff5ad9'][i%5],s:rr(3,6),g:1.5})}
function parts(dt){for(const p of pts){p.l-=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}pts=pts.filter(p=>p.l>0);txt.forEach(t=>{t.t-=dt;t.y-=dt*.8});txt=txt.filter(t=>t.t>0);dmgs.forEach(d=>{d.t-=dt;d.y-=dt*(d.t>.5?1.1:.4)});dmgs=dmgs.filter(d=>d.t>0);
 for(const a of ambs){a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.y<-.2)a.y=H;if(a.y>H+.2)a.y=-.1;if(a.x<0)a.x=W;if(a.x>W)a.x=0}}
/* [b3 · 949-949] */
let bossIntro=0,fxl=[],pend=[];
/* [b3 · 952-953] */
function ring(x,y,r1,col,ml=.5,r0=4){fxl.push({k:'ring',x,y,r0,r1,t:ml,ml,c:col})}
function puff(x,y,col,n=6,sz=10){for(let i=0;i<n;i++)fxl.push({k:'puff',x:x+rr(-.3,.3),y:y+rr(-.3,.3),vx:rr(-.8,.8),vy:rr(-1.2,-.2),r:rr(sz*.5,sz),t:rr(.4,.8),ml:.8,c:col})}
const _ctl=ctl;ctl=function(p,dt){if(p.gT>0)p.gT-=dt;_ctl(p,dt)};
const _nr=newRound;newRound=function(){_nr();fxl=[];pend=[];bossIntro=0;survT=10};

/* [b3 · 1014-1023] */
function drawFX(){const dt=1/60;for(const f of fxl){f.t-=dt;const u=Math.max(0,f.t/f.ml);if(f.vx!==undefined){f.x+=f.vx*dt;f.y+=f.vy*dt}c.globalAlpha=Math.min(1,u*1.5);
  if(f.k=='ring'){const r=(f.r1-(f.r1-f.r0)*u)*T;c.strokeStyle=f.c;c.lineWidth=(f.w||4)*u+1;c.beginPath();c.arc(f.x*T,OY+f.y*T,r,0,7);c.stroke()}
  else if(f.k=='puff')E(c,f.x*T,OY+f.y*T,f.r*(1.6-u*.6),f.r*(1.6-u*.6),f.c);
  else if(f.k=='star')star(c,f.x*T,OY+f.y*T,f.r,f.c);
  else if(f.k=='flash'){c.save();c.globalCompositeOperation='lighter';const X=f.x*T,Y=OY+f.y*T,r=f.r*T*(1.2-u*.4),g=c.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,f.c);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(X-r,Y-r,r*2,r*2);c.restore()}
  else if(f.k=='bolt'){c.save();c.shadowColor=f.c;c.shadowBlur=10;c.strokeStyle=f.c;c.lineWidth=2;c.beginPath();c.moveTo(f.x*T,OY+f.y*T);for(let i=1;i<=5;i++){const q=i/5;c.lineTo((f.x+(f.x2-f.x)*q)*T+(i<5?rr(-6,6):0),OY+(f.y+(f.y2-f.y)*q)*T+(i<5?rr(-6,6):0))}c.stroke();c.restore()}
  else if(f.k=='slash'){c.save();c.strokeStyle=f.c;c.shadowColor='#fff';c.shadowBlur=12;c.lineWidth=5*u+1;c.beginPath();c.arc(f.x*T,OY+f.y*T,30,f.a-1.1+(1-u)*.6,f.a+1.1+(1-u)*.6);c.stroke();c.restore()}
  else if(FXD[f.k])FXD[f.k](f,u);else if(f.k=='text'){c.font='16px Bungee';c.textAlign='center';c.fillStyle=f.c;c.strokeStyle='#000';c.lineWidth=3;c.strokeText(f.s,f.x*T,OY+f.y*T);c.fillText(f.s,f.x*T,OY+f.y*T);c.textAlign='left'}}
 c.globalAlpha=1;fxl=fxl.filter(f=>f.t>0);if(fxl.length>400)fxl.splice(0,fxl.length-400);
 if(bossIntro>0){bossIntro-=dt;const b=[...en,...ws].find(e=>e.t=='b');const k=bossKind(),B=BOSSES[k];c.save();c.globalAlpha=Math.min(1,bossIntro);c.fillStyle='rgba(0,0,0,.55)';c.fillRect(0,OY+H*T/2-60,W*T,120);c.textAlign='center';c.font='46px Bungee,Impact';c.fillStyle=B.c;c.shadowColor=B.c;c.shadowBlur=24;const sl=Math.max(0,bossIntro-2)*400;c.fillText(B.n,W*T/2-sl,OY+H*T/2);c.shadowBlur=0;c.font='15px Rubik';c.fillStyle='#fff';c.fillText('Watch the glowing warning tiles. Bomb it to win!',W*T/2,OY+H*T/2+34);c.restore()}}
/* [b4 · 1440-1442] */
function fxLocal(o){if(fxl.length<380){o._s=1;fxl.push(o)}}
function flame(x2,x,y,r,ph,c1='#ff7a1a',c2='#ffe36a'){const w=Math.sin(tm*18+ph)*r*.25;x2.beginPath();x2.moveTo(x+w,y-r*1.7);x2.quadraticCurveTo(x+r*1.1,y-r*.2,x,y+r*.7);x2.quadraticCurveTo(x-r*1.1,y-r*.2,x+w,y-r*1.7);x2.fillStyle=c1;x2.fill();
 x2.beginPath();x2.moveTo(x+w*.6,y-r*.9);x2.quadraticCurveTo(x+r*.55,y,x,y+r*.4);x2.quadraticCurveTo(x-r*.55,y,x+w*.6,y-r*.9);x2.fillStyle=c2;x2.fill()}
/* =====================================================================
   BOMB BATTLE — COMBAT LAYER (loaded last, after online play)
   Adds, without replacing the systems underneath:
   - an enemy attack state machine: every monster type gets a normal attack and a
     special ability, each with anticipation -> telegraph -> execution -> recovery
     and its own cooldowns (EAI / ATK below)
   - extra boss patterns, a boss introduction sequence and a staged defeat
   - wave announcement banners, low-effects mode, stuck-input protection
   Host-authoritative like everything else: the host runs the AI, guests receive
   each monster's current action (snapshot field "ea") and the effect list ("ex").
   ===================================================================== */

/* [b6 · 1877-1882] */
/* ---------- canvas helpers: fade whole sprites, and low-effects mode ---------- */
let EA=1,LOWFX=0;
(function(){const pr=CanvasRenderingContext2D.prototype,ga=Object.getOwnPropertyDescriptor(pr,'globalAlpha'),sb=Object.getOwnPropertyDescriptor(pr,'shadowBlur');
 if(!ga||!sb)return;
 Object.defineProperty(c,'globalAlpha',{configurable:true,get(){return ga.get.call(this)/EA},set(v){ga.set.call(this,Math.max(0,Math.min(1,+v||0))*EA)}});
 Object.defineProperty(c,'shadowBlur',{configurable:true,get(){return sb.get.call(this)},set(v){sb.set.call(this,LOWFX?0:v)}})})();

/* [b6 · 2136-2148] */
/* ---------- visual effects quality: Auto / High / Low ---------- */
S.fx=(()=>{try{const v=LS.get('bbSet',{}).fx;return[0,1,2].includes(v)?v:0}catch(e){return 0}})();
let fxAuto=0,fxAcc=0,fxN=0;
function fxApply(){LOWFX=S.fx==2||(S.fx==0&&fxAuto)?1:0;document.body.classList.toggle('lofx',!!LOWFX)}
fxApply();
const _tgC=tg;tg=function(k){if(k=='fx'){S.fx=(S.fx+1)%3;fxAuto=0;fxApply();saveS();tgUI();SFX.click();return}_tgC(k)};
const _tgUIC=tgUI;tgUI=function(){_tgUIC();const b=$('fxb');if(b)b.textContent='Visual effects: '+['Auto','High','Low'][S.fx]+(S.fx==0&&fxAuto?' (low now)':'')};
/* auto mode: if the game keeps running below ~40 fps during play, switch to low effects */
function fxWatch(dt){if(S.fx!=0||fxAuto||st!='play'||!(dt>0))return;fxAcc+=dt;fxN++;if(fxAcc>=3){if(fxAcc/fxN>1/40){fxAuto=1;fxApply();if(typeof toast=='function')toast('Visual effects lowered to keep the game smooth')}fxAcc=0;fxN=0}}
const _burstC=burst;burst=function(x,y,col,n){return _burstC(x,y,col,LOWFX?Math.ceil(n/2):n)};
const _fxLocalC=fxLocal;fxLocal=function(o){if(LOWFX&&(fxl.length>140||R()<.5))return;_fxLocalC(o)};
const _partsC=parts;parts=function(dt){_partsC(dt);const cap=LOWFX?160:360;if(pts.length>cap)pts.splice(0,pts.length-cap);if(LOWFX&&fxl.length>200)fxl.splice(0,fxl.length-200)};
const _drawC=draw;draw=function(){fxWatch(fdt);_drawC()};
/* [b9 · 2290-2290] */
const _drawFXMR=drawFX;drawFX=function(){_drawFXMR();mrDraw()};
