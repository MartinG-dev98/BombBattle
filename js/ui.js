
/* [b2 · 419-441] */
/* ---------- UI ---------- */
function show(id,g){if(net.role=='guest'&&['main','maps','modes','skins','net'].includes(id))id='wait';if(id&&id!='pause'&&id!='matchEnd')st='menu';document.querySelectorAll('.scr').forEach(e=>e.classList.toggle('on',e.id==id));cv.style.display=g?'block':'none';sel();if(id=='skins')skUI();if(document.activeElement)document.activeElement.blur();navTrack(id)}
/* ---------- menu navigation: back button, history, leave confirmation (v3) ---------- */
const NAVM=['main','maps','modes','skins','set','how','net','prof','wait'];let NAV=[],NCUR='main',navT=0,cfmF=null;
function navTrack(id){navT=performance.now();cfmClose();
 if(!NAVM.includes(id)||id=='main'||id=='wait'){NAV=[];NCUR=id}
 else if(id!=NCUR){const i=NAV.indexOf(id);if(i>=0)NAV.length=i;else if(NAVM.includes(NCUR))NAV.push(NCUR);if(NAV.length>10)NAV.shift();NCUR=id}
 const b=$('bk');if(b)b.classList.toggle('on',NAVM.includes(id)&&id!='main')}
function goBack(){if($('cfm').classList.contains('on')){cfmClose();return}if(!$('bk').classList.contains('on')||st!='menu')return;const id=NCUR;
 if(id=='prof'){if($('pBtns').style.display=='none')profMode(0);else $('pBack').onclick();return}
 if(id=='set'){setBack();return}
 if(id=='wait'||(id=='net'&&net.role)){leaveAsk();return}
 if(net.role=='guest'){show('wait');return}
 show(NAV[NAV.length-1]||'main')}
function leaveAsk(){if(!net.role){leaveNet();return}const n=net.role=='host'?net.guests():0;
 ask(net.role=='host'?'Close room '+(net.code||'')+'?'+(n?' '+n+(n>1?' players':' player')+' will be disconnected.':''):net.on()?'Leave the online room?':'Stop joining this room?',net.role=='host'?'CLOSE ROOM':'LEAVE',()=>leaveNet())}
function ask(m,y,f){$('cfmT').textContent=m;$('cfmY').textContent=y;cfmF=f;$('cfm').classList.add('on');navT=performance.now();setTimeout(()=>{if($('cfm').classList.contains('on'))$('cfmN').focus()},40)}
function cfmClose(){const c=$('cfm');if(c)c.classList.remove('on');cfmF=null}
$('cfmY').onclick=()=>{const f=cfmF;cfmClose();if(f)f()};$('cfmN').onclick=cfmClose;$('cfm').onclick=e=>{if(e.target.id=='cfm')cfmClose()};
/* ghost-tap guard: a second tap right after a screen change must not hit the next screen's button in the same spot */
document.addEventListener('click',e=>{if(performance.now()-navT<320&&e.target.closest&&e.target.closest('.scr button,.scr .card,.scr .chip,#bk,#cfm button')){e.stopImmediatePropagation();e.preventDefault()}},true);
/* Escape = back in menus (in a match it still pauses / resumes through the normal key handler) */
addEventListener('keydown',e=>{if(e.code!='Escape'||(st!='menu'&&!$('cfm').classList.contains('on')))return;if(e.target&&e.target.id=='pInp')return;e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)goBack()},true);
/* [b2 · 443-444] */
function cards(el,arr,key,sw){el.innerHTML=arr.map((m,i)=>`<div class="card" data-i="${i}">${m.p2?'<span class="tag">2P</span>':''}<i style="background:${sw?sw(m):'linear-gradient(135deg,#35a7ff,#ff4d5e)'}"></i><b>${m.n}</b><br>${m.d}</div>`).join('');el.onclick=e=>{const k=e.target.closest('.card');if(k){if(k.classList.contains('dis')){toast('This mode needs 2 players. Switch to 2 PLAYERS on the main menu.');return}S[key]=+k.dataset.i;saveS();sel();SFX.click()}}}
function setNP(n){if(net.role){toast('Online player count = you + the friends who joined (up to 4).');return}S.np=n;if(n==1&&MODES[S.mode].p2)S.mode=4;saveS();sel()}
/* [b2 · 446-447] */
function sel(){const solo=!net.role&&S.np==1,npn=curNP();document.querySelectorAll('#mc .card').forEach((k,i)=>k.classList.toggle('sel',i==S.map));document.querySelectorAll('#gc .card').forEach((k,i)=>{k.classList.toggle('sel',i==S.mode);k.classList.toggle('dis',solo&&!!MODES[i].p2)});document.querySelectorAll('#npSeg button').forEach(b=>b.classList.toggle('on',+b.dataset.n==S.np));$('cur').innerHTML='Map: <b>'+MAPS[S.map].n+'</b>'+(S.rm?' <small>(then random)</small>':'')+'<br>Mode: <b>'+MODES[S.mode].n+'</b> · <b>'+npn+(npn==1?' player':' players')+'</b>'+(net.role=='host'?'<br>Online: <b>room '+net.code+' · '+(1+net.guests())+' / '+S.room+' connected'+(net.on()?' ✓':' (waiting…)')+'</b>':'');document.querySelectorAll('#npSeg button').forEach(b=>b.classList.toggle('on',!net.role&&+b.dataset.n==S.np));if(typeof netUI=='function')netUI()}
cards($('mc'),MAPS,'map',m=>`linear-gradient(135deg,${m.f},${m.w} 50%,${m.a})`);cards($('gc'),MODES,'mode');
/* [b2 · 450-452] */
function tgUI(){$('rmb').textContent='Random map each round: '+(S.rm?'On':'Off');$('bob').textContent='Match: Best of '+S.bo;$('shb').textContent='Screen shake: '+(S.shake?'On':'Off');$('mub').textContent='Sound: '+(S.mute?'Muted':'On');$('mub').classList.toggle('off',!!S.mute);$('mv').value=Math.round(S.mv*100);$('sv').value=Math.round(S.sv*100)}
function tg(k){if(k=='bo')S.bo=S.bo==3?5:3;else if(k=='rm')S.rm^=1;else if(k=='mute'){S.mute^=1;applyVol()}else S.shake^=1;saveS();tgUI();sel();SFX.click()}
$('mv').oninput=e=>{S.mv=e.target.value/100;applyVol();saveS()};$('sv').oninput=e=>{S.sv=e.target.value/100;applyVol();saveS();SFX.click()};tgUI();
/* [b2 · 454-455] */
function rstS(){ST=[0,1,2,3].map(()=>({hits:0,dmg:0,sl:0,cr:0,pu:0,ch:0}))}rstS();
function start(){if(net.role=='guest'){if(net.on())net.conn.send({t:'cmd',c:'start'});return}if(net.role=='host'){if(typeof compactSlots=='function')compactSlots();NPL=curNP()}else NPL=S.np==1?1:2;if(NPL==1&&MODES[S.mode].p2)S.mode=4;ai();CM=S.map;rstS();wins=[0,0,0,0];round=1;lastSp=[];newRound();show('',1)}

/* [b2 · 678-682] */
/* ---------- RENDER ---------- */
function rc(x,y,w,h,r,f){c.fillStyle=f;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
function bomb(x2,x,y,r,glow,blink){x2.save();x2.shadowColor=glow;x2.shadowBlur=blink?22:10;x2.fillStyle=blink?'#b01020':'#15162e';x2.beginPath();x2.arc(x,y,r,0,7);x2.fill();x2.shadowBlur=0;x2.fillStyle='rgba(255,255,255,.35)';x2.beginPath();x2.arc(x-r*.35,y-r*.35,r*.22,0,7);x2.fill();x2.strokeStyle='#caa468';x2.lineWidth=Math.max(2,r*.12);x2.beginPath();x2.moveTo(x+r*.5,y-r*.8);x2.quadraticCurveTo(x+r,y-r*1.3,x+r*1.2,y-r*1.1);x2.stroke();x2.fillStyle=R()<.5?'#ffe066':'#ff8a3d';x2.beginPath();x2.arc(x+r*1.2,y-r*1.1,r*.22,0,7);x2.fill();x2.restore()}
const fb=[...Array(16)].map(()=>({x:R(),y:R(),s:rr(18,52),v:rr(.01,.04),r:R()*6,c:R()<.5?'#35a7ff':'#ff4d5e'}));
function bgDraw(dt){bc.clearRect(0,0,bgc.width,bgc.height);for(const b of fb){b.y-=b.v*dt;b.r+=dt;if(b.y<-.1)b.y=1.1;bc.save();bc.globalAlpha=.55;bomb(bc,b.x*bgc.width+Math.sin(b.r)*20,b.y*bgc.height,b.s,b.c,Math.sin(b.r*5+b.x*9)>.7);bc.restore()}}
function drawE(e){const px=e.x*T,py=OY+e.y*T,b=Math.sin(tm*8+e.x*3)*2,fl=e.hit>0&&Math.floor(tm*20)%2;c.save();c.translate(px,py);c.scale(ET[e.t].sc,ET[e.t].sc);c.translate(-px,-py);if(e.sl>0)c.globalAlpha=.5+.3*Math.sin(tm*12);c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(px,py+15,13,5,0,0,7);c.fill();c.fillStyle=fl?'#fff':frzT>0||e.st>0?'#9ee7ff':ET[e.t].col;c.shadowColor='#b06bff';c.shadowBlur=12;c.beginPath();c.moveTo(px-16,py+14);c.quadraticCurveTo(px-18,py-19+b,px,py-19+b);c.quadraticCurveTo(px+18,py-19+b,px+16,py+14);c.closePath();c.fill();c.shadowBlur=0;c.fillStyle='#fff';c.beginPath();c.arc(px-6,py-4+b,5,0,7);c.arc(px+6,py-4+b,5,0,7);c.fill();c.fillStyle='#200';c.beginPath();c.arc(px-6+e.fx*2,py-4+b+e.fy*2,2.4,0,7);c.arc(px+6+e.fx*2,py-4+b+e.fy*2,2.4,0,7);c.fill();c.strokeStyle='#200';c.lineWidth=2.5;c.beginPath();c.moveTo(px-12,py-12+b);c.lineTo(px-3,py-8+b);c.moveTo(px+12,py-12+b);c.lineTo(px+3,py-8+b);c.stroke();c.fillStyle='#ff4d5e';for(let i=0;i<e.hp;i++)c.fillRect(px-e.mh*5+1+i*10,py-27,8,4);c.restore()}
/* [b2 · 727-774] */
function hudOld(){c.fillStyle='#0a0c26';c.fillRect(0,0,720,OY);
 pl.forEach((p,i)=>{const x=i?470:6;rc(x,4,244,56,10,'rgba(255,255,255,.07)');c.fillStyle=p.c;c.fillRect(x,10,4,44);c.textBaseline='middle';c.fillStyle=p.c;c.font='13px Bungee,Impact,sans-serif';c.textAlign='left';c.fillText(p.n,x+12,18);
  c.font='16px Rubik,sans-serif';for(let h=0;h<Math.max(3,p.lives);h++){c.fillStyle=h<p.lives?'#ff4d6d':'#3a3d60';c.fillText('♥',x+70+h*17,18)}
  c.fillStyle='#fff';c.font='12px Rubik,sans-serif';c.fillText(`💣${p.maxB>8?'∞':p.maxB} 🔥${p.rng} ⚡${p.spd}  ${p.shield?'🛡️'+p.shield:''}${p.ghost>0?'👟':''}${p.remote>0?'⏱️':''}${p.mega?'🧨'+p.mega:''}${p.throwT>0?'💪':''}`,x+12,35);
  const mx=p.cdm||4,cd=p.cd,rdy=cd<=0;c.font='10px Rubik,sans-serif';c.fillStyle=rdy?'#7dffb0':'#aab';c.fillText(AB[abil(p)].n+(i?' [SHIFT]':' [Q]'),x+12,50);rc(x+106,45,128,9,4,'#222');rc(x+106,45,128*(1-cd/mx),9,4,rdy?'#7dffb0':p.c)});
 c.textAlign='center';c.fillStyle='#fff';c.font='22px Bungee,Impact,sans-serif';const t=S.mode==1?Math.max(0,90-el):el;c.fillText((t/60|0)+':'+String(t%60|0).padStart(2,'0'),360,20);
 c.font='11px Rubik,sans-serif';c.fillStyle='#ccd';c.fillText(MAPS[CM].n+' / '+MODES[S.mode].n,360,38);c.font='12px Bungee,Impact,sans-serif';c.fillStyle='#ffd23f';c.fillText(S.mode>=5?'WAVE '+Math.max(1,wv)+' / '+WL().length:`${wins[0]} – ${wins[1]}   ROUND ${round}`,360,53);c.textAlign='left'}
function banner(s,sub,col){c.save();c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(5,6,25,.55)';c.fillRect(0,OY+H*T/2-70,W*T,140);c.font='54px Bungee,Impact,sans-serif';{const bw=c.measureText(s).width,mx=W*T-30;if(bw>mx)c.font=Math.max(14,Math.floor(54*mx/bw))+'px Bungee,Impact,sans-serif'}c.fillStyle=col;c.shadowColor=col;c.shadowBlur=20;c.fillText(s,W*T/2,OY+H*T/2-12);c.shadowBlur=0;c.font='18px Rubik,sans-serif';c.fillStyle='#fff';c.fillText(sub,W*T/2,OY+H*T/2+36);c.restore()}
function draw(){const m=MAPS[CM];smooth();c.save();c.fillStyle=m.bg;c.fillRect(0,0,cv.width,cv.height);if(shk>0&&S.shake)c.translate(rr(-1,1)*shk*9,rr(-1,1)*shk*9);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=OY+y*T,v=G[y][x];
  if(v!=1){floorT(x,y,px,py);const s=sq[y][x];
   if(s==1)bogT(px,py);else if(s>=4)padT(x,y,px,py,s);
   if(s==2||s==3){const col=s==2?'#0ff':'#f2d';c.strokeStyle=col;c.lineWidth=3;c.shadowColor=col;c.shadowBlur=10;for(let i=0;i<3;i++){c.beginPath();c.arc(px+T/2,py+T/2,6+i*5,tm*(2+i)+i,tm*(2+i)+i+4);c.stroke()}c.shadowBlur=0}}}
 for(const t of tox){const px=t.x*T,py=OY+t.y*T,a=Math.min(1,t.t/.5);c.save();c.globalAlpha=.8*a;c.shadowColor='#7dff3a';c.shadowBlur=12;E(c,px+T/2,py+T/2+3,20,14,'rgba(110,220,40,.55)');c.shadowBlur=0;E(c,px+T/2-5,py+T/2,7,3,'rgba(220,255,160,.55)');for(let i=0;i<2;i++){const ph=(tm*1.4+i*.5+t.x*.37+t.y*.21)%1;E(c,px+15+i*17,py+T/2+6-ph*15,1.5+ph*2.5,1.5+ph*2.5,'rgba(200,255,120,'+(1-ph)*.9+')')}c.restore()}
 c.fillStyle=m.a;for(const a of ambs){c.globalAlpha=.3+.3*Math.sin(tm*3+a.p);if(CM==4)c.fillRect(a.x*T,OY+a.y*T,1.5,10);else c.fillRect(a.x*T,OY+a.y*T,a.s,a.s)}c.globalAlpha=1;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const px=x*T,py=OY+y*T,v=G[y][x];
  if(v==1)wallT(x,y,px,py);
  else if(v==2)crateT(x,y,px,py)}
 for(const q of cl){const px=q.x*T,py=OY+q.y*T;c.fillStyle='rgba(255,40,60,'+(.3+.3*Math.sin(tm*30))+')';c.fillRect(px,py,T,T);c.strokeStyle='#fff';c.lineWidth=2;c.strokeRect(px+3,py+3,T-6,T-6)}
 for(const q of lava)lavaDraw(q);mhDraw();
 for(const q of met)metDraw(q);
 for(const it of items){const d=PU[it.k],px=(it.x+.5)*T,py=OY+(it.y+.5)*T+Math.sin(tm*4+it.x)*3,sc=Math.min(1,it.age*4+.3);const gr=c.createRadialGradient(px,py,2,px,py,22);gr.addColorStop(0,d.c+'cc');gr.addColorStop(1,d.c+'00');c.fillStyle=gr;c.beginPath();c.arc(px,py,22*(1+.15*Math.sin(tm*6)),0,7);c.fill();c.font=(24*sc)+'px serif';c.textAlign='center';c.textBaseline='middle';c.fillText(d.e,px,py);c.textAlign='left'}
 for(const w of ws){const px=(w.x+.5)*T,py=OY+(w.y+.5)*T,col=ET[w.t].col,q=.5+.5*Math.sin(tm*10);c.save();c.globalAlpha=.3+.35*q;c.fillStyle=col;c.beginPath();c.arc(px,py,(12+6*q)*ET[w.t].sc,0,7);c.fill();c.globalAlpha=1;c.strokeStyle='#fff';c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.arc(px,py,20*ET[w.t].sc,tm*2,tm*2+6.3);c.stroke();c.setLineDash([]);const ay=py-26*ET[w.t].sc-6-Math.abs(Math.sin(tm*6))*8;c.fillStyle=col;c.strokeStyle='#fff';c.beginPath();c.moveTo(px-10,ay-12);c.lineTo(px+10,ay-12);c.lineTo(px,ay+2);c.closePath();c.fill();c.stroke();c.font='14px Bungee,Impact,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=3;const n=w.t=='b'?'BOSS':Math.ceil(w.d)+'';c.strokeText(n,px,py);c.fillText(n,px,py);c.restore()}
 for(const b of bombs){
 const px=(b.x+b.dx*b.k+.5)*T,py=OY+(b.y+b.dy*b.k+.5)*T;
 const crit=b.t<.6,pr=b.t<.3?60:b.t<.8?35:15;
 const bl=b.t<1.4&&Math.sin(b.t*pr)>0;
 const swell=crit?(0.6-b.t)/0.6*.16:0;
 const r=T*(b.mega?.42:.34)*(1+.06*Math.sin(tm*10)+swell);
 bomb(c,px,py,r,b.mega?'#d66bff':b.rem?'#7dffb0':crit?'#ff3b3b':'#ff6a3d',bl,bSkin(b),(b.dx||b.dy)?(b.ra=((b.x+b.dx*b.k)*b.dx+(b.y+b.dy*b.k)*b.dy)*2.2):(b.ra||0));
 if(crit&&R()<.4)fxLocal({k:'ember',x:b.x+.5+rr(-.15,.15),y:b.y+.2+rr(-.15,.15),vx:rr(-1,1),vy:rr(-2,-.5),r:rr(1.5,3),t:.3,ml:.3,c:'#ffd23f'});
 if(b.rem){c.fillStyle='#7dffb0';c.beginPath();c.arc(px,py+2,3,0,7);c.fill()}
 if(b.mega){c.strokeStyle='#d66bff';c.lineWidth=2;c.beginPath();c.arc(px,py,r+3,0,7);c.stroke()}
}
 for(const ms of msl){const X=ms.x*T,Y=OY+ms.y*T;c.save();c.translate(X,Y);c.rotate(Math.atan2(ms.vy,ms.vx));c.shadowColor='#ff8a1f';c.shadowBlur=12;P(c,[[-9,-4],[-17-R()*7,0],[-9,4]],'#ffb020');c.shadowBlur=0;P(c,[[-8,-5],[-12,-9],[-4,-5]],'#ff4d5e',OL,1);P(c,[[-8,5],[-12,9],[-4,5]],'#ff4d5e',OL,1);c.beginPath();c.roundRect(-10,-5,18,10,5);c.fillStyle='#d6dcea';c.fill();c.strokeStyle=OL;c.lineWidth=2;c.stroke();E(c,7,0,3,3,'#ff3b3b');c.restore()}
 for(const f of fires){const px=f.x*T,py=OY+f.y*T,a=Math.min(1,f.t/.2),fl=1+.1*Math.sin(tm*40+f.x*3);c.globalAlpha=a;
  if(f.l){c.shadowColor=f.l==2?'#0ff':f.l==3?'#bff':f.l==4?'#a050ff':'#f60';c.shadowBlur=14;hzFire(f,px,py,a,fl)}
  else{c.shadowColor=f.m?'#d66bff':'#ff8a1f';c.shadowBlur=18;rc(px+2,py+2,T-4,T-4,12*fl,f.m?'#b04bff':'#ff9a1f');rc(px+9,py+9,T-18,T-18,8,f.m?'#f0c8ff':'#fff2a0')}c.shadowBlur=0;c.globalAlpha=1}
 vignette();pl.forEach(drawP);en.forEach(drawE);topWarn();
 for(const p of pts){c.globalAlpha=Math.max(0,p.l/p.ml);c.fillStyle=p.c;c.fillRect(p.x*T,OY+p.y*T,p.s,p.s)}c.globalAlpha=1;
 c.font='14px Bungee,Impact,sans-serif';c.textAlign='center';for(const t of txt){c.globalAlpha=Math.min(1,t.t*2);c.fillStyle=t.c;c.strokeStyle='#000';c.lineWidth=3;c.strokeText(t.s,t.x*T,OY+t.y*T);c.fillText(t.s,t.x*T,OY+t.y*T)}c.globalAlpha=1;c.textAlign='left';drawDmg();
 if(st=='count')pl.forEach(p=>{if(p.off)return;const sk=SK[p.sk],s1=p.n+' · '+sk.n.toUpperCase(),s2=AB[abil(p)].n+' ['+keyName(p)+']';c.font='13px Bungee,Impact,sans-serif';const w1=c.measureText(s1).width;c.font='11px Rubik,sans-serif';const w=Math.max(w1,c.measureText(s2).width)+22,cx=p.x*T,bx=Math.max(w/2+4,Math.min(W*T-w/2-4,cx)),up=p.y<4,by=up?OY+p.y*T+30:OY+p.y*T-(sk.a=='wizard'?92:70),hh=38;rc(bx-w/2,by,w,hh,10,'rgba(5,6,25,.88)');c.strokeStyle=p.c;c.lineWidth=2;c.beginPath();c.roundRect(bx-w/2,by,w,hh,10);c.stroke();c.fillStyle=p.c;c.beginPath();if(up){c.moveTo(cx-7,by);c.lineTo(cx+7,by);c.lineTo(cx,by-8)}else{c.moveTo(cx-7,by+hh);c.lineTo(cx+7,by+hh);c.lineTo(cx,by+hh+8)}c.fill();c.textAlign='center';c.textBaseline='middle';c.font='13px Bungee,Impact,sans-serif';c.fillStyle=p.c;c.fillText(s1,bx,by+13);c.font='11px Rubik,sans-serif';c.fillStyle='#fff';c.fillText(s2,bx,by+28);c.textAlign='left'});
 drawFX();c.restore();hud();bossBar();
 const closing=(S.mode==2&&el>30)||(S.mode==0&&el>120);if(st=='play'&&closing&&Math.floor(tm*2)%2&&el<(S.mode==2?34:124))banner('ARENA CLOSING!','Stay away from the edges','#ff6b6b');
 if(st=='count'){const n=Math.ceil(cdn-.6);banner(n+'',MAPS[CM].n+([...ws,...en].some(e=>e.t=='b')?' - BOSS INCOMING!':ws.length+en.length?' - ENEMIES INCOMING!':''),ws.length+en.length?'#ff8a3d':'#ffd23f')}
 else if(st=='play'&&cdn>0)banner('GO!','','#7dffb0');
 else if(st=='pause'&&net.role=='guest')banner('PAUSED','The host paused the game','#ffd23f');
 else if(st=='over'&&S.mode<5&&!pl[1].off)banner(winner>=0?pl[winner].n+' WINS THE ROUND!':'DRAW!',winner>=0?'':'Nobody scores. Replaying...',winner>=0?pl[winner].c:'#fff')}

/* ---------- BOMB ---------- */
/* [b3 · 920-920] */
function bomb(x2,x,y,r,glow,blink){x2.save();x2.shadowColor=glow;x2.shadowBlur=blink?24:10;const g=x2.createRadialGradient(x-r*.4,y-r*.4,r*.1,x,y,r);g.addColorStop(0,blink?'#ff7a7a':'#5a5f8a');g.addColorStop(1,blink?'#a00818':'#12132a');x2.fillStyle=g;x2.beginPath();x2.arc(x,y,r,0,7);x2.fill();x2.shadowBlur=0;x2.strokeStyle=OL;x2.lineWidth=2;x2.stroke();x2.fillStyle='#3a3d5c';x2.fillRect(x-r*.3,y-r*1.12,r*.6,r*.3);x2.fillStyle='rgba(255,255,255,.45)';x2.beginPath();x2.ellipse(x-r*.38,y-r*.38,r*.25,r*.16,-.6,0,7);x2.fill();x2.strokeStyle='#caa468';x2.lineWidth=Math.max(2,r*.12);x2.beginPath();x2.moveTo(x,y-r*1.1);x2.quadraticCurveTo(x+r*.5,y-r*1.6,x+r*.9,y-r*1.3);x2.stroke();const sp=r*(.25+.12*R());x2.shadowColor='#ffb020';x2.shadowBlur=12;x2.fillStyle=R()<.5?'#fff6a0':'#ff8a3d';star(x2,x+r*.9,y-r*1.3,sp*1.4,x2.fillStyle);x2.restore()}


/* ---------- MENUS ---------- */
/* [b3 · 1042-1042] */
let backTo='';function setBack(){const b=backTo;backTo='';if(b=='pause'){show('pause',1);st='pause'}else show('main')}
/* [b3 · 1055-1055] */
cards($('mc'),MAPS,'map',m=>`linear-gradient(135deg,${m.f},${m.w} 50%,${m.a})`);cards($('gc'),MODES,'mode');sel();

/* [b3 · 1153-1161] */
/* ---------- HEALTH BARS ---------- */
const hpCol=r=>r>.6?'#3ddc84':r>.3?'#ffd23f':'#ff4d5e';
function hpBar(x,y,w,h,p){const mx=Math.max(100,p.hp,p.hd||0),r=h/2;rc(x-1.5,y-1.5,w+3,h+3,r+1.5,'rgba(5,6,25,.8)');rc(x,y,w,h,r,'#2a2d55');
 if(p.hd>p.hv)rc(x,y,Math.max(h,w*Math.min(1,p.hd/mx)),h,r,'rgba(255,255,255,.8)');
 if(p.hv>0){const v=Math.min(p.hv,100);rc(x,y,Math.max(h,w*v/mx),h,r,hpCol(p.hp/100));if(p.hv>100)rc(x+w*100/mx-r,y,w*(p.hv-100)/mx+r,h,r,'#ffd23f')}
 c.fillStyle='rgba(255,255,255,.28)';c.fillRect(x+r,y+1,Math.max(0,w*Math.min(p.hv,mx)/mx-h),Math.max(1,h*.3))}
function smooth(){if(!pl)return;for(const p of pl){if(p.hp==null)continue;if(p.hd==null)p.hd=p.hp;if(p.hv==null)p.hv=p.hp;p.hv+=(p.hp-p.hv)*Math.min(1,fdt*12);if(Math.abs(p.hv-p.hp)<.3)p.hv=p.hp;p.hd=p.hd>p.hp?Math.max(p.hp,p.hd-Math.max(10,(p.hd-p.hp)*2)*fdt):p.hp;p.hf=Math.max(0,(p.hf||0)-fdt)}}
function keyName(p){return TOUCH||net.role?'SKILL':p.id?'R-SHIFT':'Q'}
function roleTag(p){if(net.role){const me=p.id==(net.role=='host'?0:net.slot);return(p.id?'GUEST':'HOST')+(me?' · YOU':'')}return pl[1].off?'SOLO':'P'+(p.id+1)}

/* [b3 · 1163-1218] */
/* ---------- HUD ---------- */
/* ---------- HUD LAYOUT ----------
   hudLayout() runs from setDims(): it picks the wide 2-panel HUD or a compact grid (3-4 players,
   narrow arenas, phones held upright) and sets OY, the HUD strip height above the arena.
   OY is render-only, so host and guests may use different layouts. */
let HK=1,HCOMP=0,HCOLS=2,HROWS=1;
function hudLayout(){const n=Math.max(1,NPL),WW=W*T;HK=typeof portraitTouch=='function'&&portraitTouch()?Math.max(1.5,Math.min(2,WW/480)):TOUCH&&innerHeight<600?1.3:1;const VW=WW/HK;
 HCOMP=n>2||VW<690?1:0;if(!HCOMP){OY=64;return}HCOLS=Math.max(1,Math.min(n,Math.floor((VW-8)/140)));HROWS=Math.ceil(n/HCOLS);OY=Math.ceil((24+HROWS*44)*HK)}
function hud(){if(HCOMP)return hudC();hudW()}
function hudC(){const n=pl.length,VW=W*T/HK,solo=pl[1]&&pl[1].off;c.save();c.scale(HK,HK);const HH=OY/HK;
 const gr=c.createLinearGradient(0,0,0,HH);gr.addColorStop(0,'#141842');gr.addColorStop(1,'#0a0c26');c.fillStyle=gr;c.fillRect(0,0,VW,HH);c.fillStyle='rgba(255,255,255,.08)';c.fillRect(0,HH-2/HK,VW,2/HK);
 c.textBaseline='middle';const t=S.mode==1?Math.max(0,90-el):el;
 c.textAlign='center';c.fillStyle='#fff';c.font='16px Bungee,Impact,sans-serif';c.fillText(fmtT(t),VW/2,12);
 c.textAlign='left';c.font='9px Rubik,sans-serif';c.fillStyle='#ccd';c.fillText(MAPS[CM].n,6,7);c.fillText(MODES[S.mode].n,6,17);
 const act=pl.filter(p=>!p.off),alive=act.filter(p=>p.alive).length;
 c.textAlign='right';c.font='9px Bungee,Impact,sans-serif';c.fillStyle='#ffd23f';c.fillText(S.mode>=5?'WAVE '+Math.max(1,wv)+' / '+WL().length:solo?'BEST '+fmtT(LS.get('bbBest',0)):act.map(p=>wins[p.id]).join('–')+' · R'+round,VW-6,7);
 c.font='9px Rubik,sans-serif';c.fillStyle=alive<act.length?'#ff8a8a':'#9aa3e8';c.fillText('ALIVE '+alive+'/'+act.length+(net.role?' · ONLINE':''),VW-6,17);
 const ps=pl.filter(p=>!p.off),pw=(VW-8-(HCOLS-1)*6)/HCOLS;
 ps.forEach((p,j)=>{const col=j%HCOLS,row=j/HCOLS|0,x=4+col*(pw+6),y=24+row*44,w=pw;c.save();if(!p.alive)c.globalAlpha=.5;
  rc(x,y,w,40,8,'rgba(255,255,255,.07)');c.fillStyle=p.c;c.fillRect(x,y+5,3,30);c.textAlign='left';
  c.font='11px Bungee,Impact,sans-serif';c.fillStyle=p.c;const dn=fitName(p.n,Math.max(56,Math.min(120,w*.45)));c.fillText(dn,x+8,y+8);const nw=c.measureText(dn).width;
  c.textAlign='right';c.font='11px Bungee,Impact,sans-serif';c.fillStyle=p.alive?hpCol(p.hp/(p.mhp||100)):'#888';c.fillText(Math.ceil(p.hp)+'',x+w-6,y+8);const hw=c.measureText(Math.ceil(p.hp)+'').width;
  c.textAlign='left';c.font='8px Rubik,sans-serif';c.fillStyle='#aab3ee';const tag=(net.role?roleTag(p)+' · ':'')+SK[p.sk].n.toUpperCase();c.save();c.beginPath();c.rect(x+12+nw,y,Math.max(0,w-nw-hw-24),16);c.clip();c.fillText(tag,x+12+nw,y+8.5);c.restore();
  hpBar(x+8,y+15,w-14,6,p);
  const ab=abil(p),A=AB[ab],tk=ABT[ab],ac=tk&&p[tk]>0,mx=p.cdm||A.cd||4,cd=p.cd,rdy=cd<=0,bx=x+w*.52,bw=w*.48-7;
  c.save();c.beginPath();c.rect(x+6,y+24,bx-x-8,14);c.clip();c.font='9px Rubik,sans-serif';c.fillStyle='#fff';c.fillText(`💣${p.maxB>8?'∞':p.maxB} 🔥${p.rng} ⚡${p.spd}${p.shield?' 🛡️'+p.shield:''}${p.ghost>0?'👟':''}${p.remote>0?'⏱️':''}${p.mega?'🧨'+p.mega:''}${p.throwT>0?'💪':''}`,x+8,y+32);c.restore();
  c.font='7px Rubik,sans-serif';c.fillStyle=ac?'#ffd23f':rdy?'#7dffb0':'#aab';c.fillText(A.n,bx,y+28);
  rc(bx,y+32,bw,5,2.5,'#222645');if(ac)rc(bx,y+32,Math.max(5,bw*p[tk]/(A.dur||3)),5,2.5,'#ffd23f');else rc(bx,y+32,Math.max(5,bw*(1-cd/mx)),5,2.5,rdy?'#7dffb0':p.c);
  c.restore();
  if(!p.alive){c.save();c.translate(x+w/2,y+22);c.rotate(-.06);c.font='14px Bungee,Impact,sans-serif';c.textAlign='center';c.lineWidth=3;c.strokeStyle='#0a0c26';c.strokeText('ELIMINATED',0,0);c.fillStyle='#ff4d5e';c.fillText('ELIMINATED',0,0);c.restore()}});
 c.restore();c.textAlign='left'}
function hudW(){const WW=W*T,solo=pl[1].off;const gr=c.createLinearGradient(0,0,0,OY);gr.addColorStop(0,'#141842');gr.addColorStop(1,'#0a0c26');c.fillStyle=gr;c.fillRect(0,0,WW,OY);c.fillStyle='rgba(255,255,255,.08)';c.fillRect(0,OY-2,WW,2);
 pl.forEach((p,i)=>{if(p.off)return;const x=i?WW-250:6,w=244;c.save();if(!p.alive)c.globalAlpha=.5;
  rc(x,4,w,56,10,'rgba(255,255,255,.07)');c.fillStyle=p.c;c.fillRect(x,10,4,44);c.textBaseline='middle';c.textAlign='left';
  c.font='13px Bungee,Impact,sans-serif';c.fillStyle=p.c;const dn=fitName(p.n,100);c.fillText(dn,x+12,14);const nw=c.measureText(dn).width;
  c.save();c.beginPath();c.rect(x+17+nw,0,Math.max(0,w-97-nw),30);c.clip();c.font='9px Rubik,sans-serif';c.fillStyle='#aab3ee';c.fillText(roleTag(p)+' · '+SK[p.sk].n.toUpperCase(),x+17+nw,14.5);c.restore();
  c.textAlign='right';c.font='12px Bungee,Impact,sans-serif';c.fillStyle=p.alive?hpCol(p.hp/(p.mhp||100)):'#888';c.fillText(Math.ceil(p.hp)+' HP',x+w-8,14);c.textAlign='left';
  hpBar(x+12,22,w-22,8,p);
  c.fillStyle='#fff';c.font='11px Rubik,sans-serif';c.fillText(`💣${p.maxB>8?'∞':p.maxB} 🔥${p.rng} ⚡${p.spd}  ${p.shield?'🛡️'+p.shield:''}${p.ghost>0?'👟':''}${p.remote>0?'⏱️':''}${p.mega?'🧨'+p.mega:''}${p.throwT>0?'💪':''}`,x+12,39);
  const ab=abil(p),A=AB[ab],tk=ABT[ab],act=tk&&p[tk]>0,mx=p.cdm||A.cd||4,cd=p.cd,rdy=cd<=0;c.font='10px Rubik,sans-serif';c.fillStyle=act?'#ffd23f':rdy?'#7dffb0':'#aab';c.fillText(A.n+' ['+keyName(p)+']',x+12,52);
  const bx=x+120,bw=w-130;rc(bx,48,bw,8,4,'#222645');if(act)rc(bx,48,Math.max(8,bw*p[tk]/(A.dur||3)),8,4,'#ffd23f');else rc(bx,48,Math.max(8,bw*(1-cd/mx)),8,4,rdy?'#7dffb0':p.c);
  if(!rdy&&!act){c.font='9px Bungee,Impact,sans-serif';c.textAlign='center';c.fillStyle='#fff';c.fillText(Math.ceil(cd),bx+bw/2,52.5);c.textAlign='left'}
  c.restore();
  if(!p.alive){c.save();c.translate(x+w/2,32);c.rotate(-.08);c.font='20px Bungee,Impact,sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=4;c.strokeStyle='#0a0c26';c.strokeText('ELIMINATED',0,0);c.fillStyle='#ff4d5e';c.fillText('ELIMINATED',0,0);c.restore()}});
 const cx=solo?(250+WW)/2:WW/2;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.font='20px Bungee,Impact,sans-serif';const t=S.mode==1?Math.max(0,90-el):el;c.fillText(fmtT(t),cx,15);
 c.font='10px Rubik,sans-serif';c.fillStyle='#ccd';c.fillText(MAPS[CM].n+' · '+MODES[S.mode].n,cx,31);
 c.font='11px Bungee,Impact,sans-serif';c.fillStyle='#ffd23f';c.fillText(S.mode>=5?'WAVE '+Math.max(1,wv)+' / '+WL().length:solo?'SOLO SURVIVAL · BEST '+fmtT(LS.get('bbBest',0)):`${wins[0]} – ${wins[1]}  ·  ROUND ${round}`,cx,45);
 const act=pl.filter(p=>!p.off),alive=act.filter(p=>p.alive).length;c.font='9px Rubik,sans-serif';c.fillStyle=alive<act.length?'#ff8a8a':'#9aa3e8';c.fillText((S.mode>=5&&!solo?'TEAM ':'')+'ALIVE '+alive+' / '+act.length+(net.role?'  ·  ONLINE':''),cx,57);c.textAlign='left'}

/* ---------- DAMAGE NUMBERS ---------- */
const DS={n:['#fff1a8',18],c:['#ff5a3d',25],s:['#7fe9ff',19],h:['#ff9a3d',18],m:['#ff8ad8',18],t:['#9dff5a',17],heal:['#7dffb0',17],x:['#ff4d5e',22]};
function drawDmg(){if(!dmgs.length)return;c.save();c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
 for(const d of dmgs){const u=1-d.t/d.ml,st2=DS[d.k]||DS.n,pop=u<.12?1+(.12-u)*4:1;c.globalAlpha=Math.min(1,d.t/.45);c.font=Math.round(st2[1]*pop)+'px Bungee,Impact,sans-serif';
  const s=(d.k=='heal'?'+':'-')+d.v+(d.k=='c'?'!':''),X=d.x*T,Y=OY+d.y*T;c.lineWidth=4;c.strokeStyle='#120a1e';c.strokeText(s,X,Y);c.fillStyle=st2[0];c.fillText(s,X,Y);
  if(d.k=='c'&&u<.5){c.font='9px Bungee,Impact,sans-serif';c.strokeText('CRIT',X,Y-st2[1]*.8);c.fillStyle='#ffd23f';c.fillText('CRIT',X,Y-st2[1]*.8)}}
 c.restore()}

/* [b5 · 1801-1843] */
/* ================= TOUCH CONTROLS ================= */
let tcOn=false,lastTouch=-1e9,fitT=0;
/* any real touch turns touch mode (back) on, so a guest phone always gets its pad even after typing the room code */
function touchSeen(){lastTouch=performance.now();if(!TOUCH){TOUCH=true;fit();if(W)setDims(W,H)}}
addEventListener('pointerdown',e=>{if(e.pointerType=='touch')touchSeen()},true);
addEventListener('touchstart',touchSeen,{capture:true,passive:true});
/* ---------- RESPONSIVE LAYOUT ----------
   Desktop / landscape: the arena fits the screen, touch controls sit in the side margins.
   Phones held upright: the arena spans the full width at the top (HUD drawn 1.5x larger),
   the joystick and buttons get a roomy band underneath instead of covering the map. */
function portraitTouch(){return TOUCH&&innerHeight>innerWidth*1.1}
function safeIns(){const s=getComputedStyle($('sa'));return{t:parseFloat(s.paddingTop)||0,r:parseFloat(s.paddingRight)||0,b:parseFloat(s.paddingBottom)||0,l:parseFloat(s.paddingLeft)||0}}
function fit(){const vw=innerWidth,vh=innerHeight,sa=safeIns(),ar=cv.width/cv.height,tv=$('touch').style,px=v=>Math.round(v)+'px';let cw,ch,L,Tp;
 if(portraitTouch()){const band0=Math.max(200,vh*.3);cw=vw-sa.l-sa.r;ch=cw/ar;const maxH=vh-sa.t-band0-6;if(ch>maxH){ch=maxH;cw=ch*ar}
  L=(vw-cw)/2;Tp=sa.t+Math.max(4,Math.min(24,(maxH-ch)*.3));const band=vh-Tp-ch-sa.b;
  const pd=Math.max(120,Math.min(200,band*.8,vw*.44)),bb=Math.max(84,Math.min(126,pd*.64,band*.5)),sb=bb*.7,mb=bb*.62;
  const pbt=sa.b+Math.max(10,(band-pd)/2),bbt=sa.b+Math.max(10,(band-bb-14-mb)/2);
  for(const[k,v]of[['--pd',pd],['--bb',bb],['--sb',sb],['--mb',mb],['--pl',Math.max(14,sa.l+14)],['--pbt',pbt],['--br',Math.max(14,sa.r+14)],['--bbt',bbt]])tv.setProperty(k,px(v))}
 else{cw=Math.min(vw,vh*ar);ch=cw/ar;L=(vw-cw)/2;Tp=(vh-ch)/2;
  if(TOUCH){const side=L,pd=Math.max(118,Math.min(170,side-20,vh*.42)),bb=Math.max(72,Math.min(104,pd*.64)),sb=bb*.7,mb=bb*.62,cl=bb+12+sb;
   const pl=side>=pd+16?Math.max(sa.l+8,(side-pd)/2):sa.l+12,br=side>=cl+16?Math.max(sa.r+8,(side-cl)/2+sb*.2):sa.r+12;
   for(const[k,v]of[['--pd',pd],['--bb',bb],['--sb',sb],['--mb',mb],['--pl',pl],['--pbt',sa.b+14],['--br',br],['--bbt',sa.b+14]])tv.setProperty(k,px(v))}}
 Object.assign(cv.style,{left:px(L),top:px(Tp),width:px(cw),height:px(ch),transform:'none'});
 const tp=$('tpause').style;if(portraitTouch()){tp.top=px(Tp+ch+10);tp.right=px(Math.max(10,sa.r+10))}else{tp.top='';tp.right=''}}
const refit=()=>{clearTimeout(fitT);fitT=setTimeout(()=>{if(W)setDims(W,H);fit()},60)};
addEventListener('resize',refit);addEventListener('orientationchange',refit);if(window.visualViewport)visualViewport.addEventListener('resize',refit);
function touchSync(){const want=TOUCH&&cv.style.display=='block'&&['count','play','over'].includes(st);
 if(want!=tcOn){tcOn=want;document.body.classList.toggle('tc',want);if(!want)ACTS.forEach(a=>press(a,0))}
 $('tpause').style.display=net.role=='guest'?'none':''}
(function(){const pad=$('pad'),kn=$('knob');let pid=null;const cur={l:0,r:0,u:0,d:0};
 const set=n=>{for(const a in n)if(n[a]!=cur[a]){cur[a]=n[a];press(a,n[a])}};
 function mvp(e){const r=pad.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=r.width/2,d=Math.hypot(dx,dy),sc=d>m?m/d:1,n={l:0,r:0,u:0,d:0};
  kn.style.transform=`translate(${dx*sc*.62}px,${dy*sc*.62}px)`;
  if(d>m*.2){const ax=Math.abs(dx),ay=Math.abs(dy),h=cur.l||cur.r,v=cur.u||cur.d;const useX=h&&!v?ax>=ay*.8:v&&!h?ax>ay*1.25:ax>=ay;if(useX)n[dx<0?'l':'r']=1;else n[dy<0?'u':'d']=1}
  set(n)}
 pad.addEventListener('pointerdown',e=>{e.preventDefault();ai();keepAwake();pid=e.pointerId;pad.setPointerCapture(pid);mvp(e)});
 pad.addEventListener('pointermove',e=>{if(e.pointerId==pid)mvp(e)});
 const end=e=>{if(e.pointerId!=pid)return;pid=null;kn.style.transform='';set({l:0,r:0,u:0,d:0})};
 pad.addEventListener('pointerup',end);pad.addEventListener('pointercancel',end);
 document.querySelectorAll('.tb').forEach(b=>{const a=b.dataset.a;
  b.addEventListener('pointerdown',e=>{e.preventDefault();ai();b.setPointerCapture(e.pointerId);b.classList.add('on');press(a,1)});
  const up=()=>{b.classList.remove('on');press(a,0)};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up)})})();
addEventListener('contextmenu',e=>e.preventDefault());

/* [b5 · 1845-1851] */
/* ================= PWA: install prompt, wake lock, service worker ================= */
let dip=null,wl=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dip=e;$('inst').style.display=''});
addEventListener('appinstalled',()=>{$('inst').style.display='none'});
function doInstall(){if(dip){dip.prompt();dip=null;$('inst').style.display='none'}}
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform=='MacIntel'&&navigator.maxTouchPoints>1);
if(isIOS&&!navigator.standalone&&!matchMedia('(display-mode: standalone)').matches)$('iosHint').style.display='';
