/* [b2 · 324-326] */
const SK=[{n:'Captain',g:'Hero',c:'#3b6df0',a:'cape'},{n:'Robot',g:'Hero',c:'#9aa7b5',a:'robot'},{n:'Ninja',g:'Hero',c:'#2c2f3a',a:'ninja'},{n:'Wizard',g:'Hero',c:'#8a5cf0',a:'wizard'},{n:'Doge',g:'Meme',c:'#e0a95a',a:'doge'},{n:'Troll',g:'Meme',c:'#f2f2f2',a:'troll'},{n:'Pickle',g:'Meme',c:'#5aa84a',a:'pickle'},{n:'Potato',g:'Meme',c:'#b98a52',a:'potato'},{n:'Blue',g:'Colour',c:'#35a7ff'},{n:'Red',g:'Colour',c:'#ff4d5e'},{n:'Green',g:'Colour',c:'#3ddc84'},{n:'Yellow',g:'Colour',c:'#ffd23f'},{n:'Purple',g:'Colour',c:'#a66bff'},{n:'Pink',g:'Colour',c:'#ff7ac8'},{n:'Orange',g:'Colour',c:'#ff9a3d'},{n:'White',g:'Colour',c:'#f4f4f4'},
{n:'Shadow',g:'Elite',c:'#3b2a5c',a:'shadow',cost:12},{n:'Cyber',g:'Elite',c:'#1e7bff',a:'cyber',cost:12},{n:'Pirate',g:'Elite',c:'#c0392b',a:'pirate',cost:18},{n:'Viking',g:'Elite',c:'#4f74b0',a:'viking',cost:18},{n:'Samurai',g:'Elite',c:'#c0262d',a:'samurai',cost:25},{n:'Ghost',g:'Elite',c:'#e9ecff',a:'phase',cost:25},{n:'Toxic',g:'Elite',c:'#7ad12a',a:'toxic',cost:30},{n:'Mecha',g:'Elite',c:'#6f7d96',a:'mecha',cost:35},{n:'Firefighter',g:'Elite',c:'#f0a020',a:'fireman',cost:30},{n:'Alien',g:'Elite',c:'#6fe0b2',a:'alien',cost:40}];
const GROUPS=['Hero','Meme','Colour','Elite'];
/* [b2 · 448-449] */
function skUI(){[0,1].forEach(i=>{$('sk'+i).innerHTML=`<b style='color:${i?'#ff4d5e':'#35a7ff'}'>${i?'RED (arrow keys, Shift = ability)':'BLUE (WASD, Q = ability)'}</b><br><small>${AB[SK[S.sk[i]].a||'dash'].n}: ${AB[SK[S.sk[i]].a||'dash'].d}</small>`+['Hero','Meme','Colour'].map(g=>`<div>${g}: `+SK.map((s,j)=>s.g==g?`<button class='chip${S.sk[i]==j?' sel':''}' data-p='${i}' data-j='${j}'><i style='background:${s.c}'></i>${s.n}</button>`:'').join('')+'</div>').join('')})}
$('skins').onclick=e=>{const b=e.target.closest('.chip');if(b){S.sk[+b.dataset.p]=+b.dataset.j;skUI()}};
/* [b2 · 603-615] */
const AB={dash:{n:'DASH',cd:4,d:'Burst forward to escape danger.'},cape:{n:'IRON GUARD',cd:12,d:'3 seconds of total invincibility.'},robot:{n:'BARRAGE',cd:10,d:'Drops 3 bombs in a line ahead.'},ninja:{n:'BLINK',cd:6,d:'Teleport up to 4 tiles ahead, even past walls.'},wizard:{n:'FIREBALL',cd:8,d:'Hurl a fireball that explodes on impact.'},doge:{n:'BARK',cd:10,d:'Stuns nearby rivals and slimes.'},troll:{n:'TROLL',cd:12,d:'Reverses your rival controls for 4 seconds.'},pickle:{n:'FORT',cd:12,d:'Raise crates around you for cover.'},potato:{n:'SPUD',cd:8,d:'Lob a fast-fuse bomb up to 4 tiles ahead.'},
shadow:{n:'VANISH',cd:12,dur:3.5,d:'Turn invisible for 3.5s. Monsters and bosses lose track of you.'},
cyber:{n:'EMP PULSE',cd:11,d:'Electric pulse: stuns and shocks foes within 2.5 tiles (15 damage).'},
pirate:{n:'CANNONBALL',cd:9,d:'Fire a bomb that rolls ahead and bounces off walls before it blows.'},
viking:{n:'SHIELD WALL',cd:14,dur:5,d:'Gain a shield charge and take half damage for 5s.'},
samurai:{n:'PARRY',cd:7,dur:.7,d:'0.7s stance: deflect an incoming blast and strike back 3 tiles.'},
phase:{n:'PHASE',cd:12,dur:2.5,d:'Drift through crates and walls for 2.5s.'},
toxic:{n:'TOXIC PUDDLE',cd:12,d:'Spill a 5-tile puddle for 5s that slows and poisons rivals.'},
mecha:{n:'HOMING MISSILE',cd:10,d:'Launch a guided mini-bomb that seeks the nearest foe (25 damage).'},
fireman:{n:'FIRE SUIT',cd:14,dur:4,d:'Immune to explosions and lava for 4s.'},
alien:{n:'WARP',cd:10,d:'Teleport to a safe tile at least 4 tiles away.'}};
const ABT={shadow:'ivT',viking:'vkT',samurai:'pry',phase:'phT',fireman:'fsT',cape:'gT'};
const abil=p=>SK[p.sk].a||'dash';
/* [b2 · 617-637] */
function useAb(p){const a=abil(p),dx=p.fx,dy=p.fy,x=p.x|0,y=p.y|0,RV=rivals(p),occ=(tx,ty)=>RV.some(o=>(o.x|0)==tx&&(o.y|0)==ty);let ok=1;
 if(a=='dash'){p.dsh=.16;SFX.dash()}
 else if(a=='cape'){p.inv=Math.max(p.inv,3);burst(p.x,p.y,'#ffd23f',20);txt.push({x:p.x,y:p.y-.7,t:1,s:'INVINCIBLE!',c:'#ffd23f'});tn(500,.4,'sine',.2,400)}
 else if(a=='robot'){ok=0;for(let i=1;i<=3;i++){const tx=x+dx*i,ty=y+dy*i;if(G[ty][tx]!==0||bombs.some(b=>b.x==tx&&b.y==ty))break;dropB(tx,ty,2.2+i*.3,p.rng,p);burst(tx+.5,ty+.5,'#0ff',6);ok=1}}
 else if(a=='ninja'){ok=0;for(let i=4;i>0;i--){const tx=x+dx*i,ty=y+dy*i;if(G[ty]&&G[ty][tx]===0&&!bombs.some(b=>b.x==tx&&b.y==ty)&&!fa[ty*W+tx]&&!occ(tx,ty)&&!en.some(e=>(e.x|0)==tx&&(e.y|0)==ty)){burst(p.x,p.y,'#222',14);p.x=tx+.5;p.y=ty+.5;p.vx=p.vy=0;p.inv=Math.max(p.inv,.5);burst(p.x,p.y,'#e63946',14);ok=1;break}}}
 else if(a=='wizard'){let tx=x,ty=y;for(let i=1;i<=7;i++){const nx=x+dx*i,ny=y+dy*i,v=G[ny]&&G[ny][nx];if(v===undefined||v==1)break;tx=nx;ty=ny;if(v==2||bombs.some(b=>b.x==nx&&b.y==ny)||occ(nx,ny)||en.some(e=>(e.x|0)==nx&&(e.y|0)==ny))break}const n=Math.abs(tx-x)+Math.abs(ty-y);if(n<2)ok=0;else{for(let i=1;i<=n;i++)burst(x+dx*i+.5,y+dy*i+.5,'#ff8a3d',3);if(G[ty][tx]==2)crate(tx,ty,p.id);blast(tx,ty,1,0,p.id,1,undefined,{dmg:25,kd:'s'})}}
 else if(a=='doge'){if(pvp())RV.forEach(q=>{if(Math.hypot(q.x-p.x,q.y-p.y)<4.5)q.fz=1.5});en.forEach(e=>{if(Math.hypot(e.x-p.x,e.y-p.y)<4)e.st=2.5});burst(p.x,p.y,'#ffe08a',26);txt.push({x:p.x,y:p.y-.7,t:1,s:'WOOF!',c:'#ffe08a'});tn(140,.3,'sawtooth',.3,-60)}
 else if(a=='troll'){const q=pvp()?nearRival(p,p.x,p.y):null;p._tq=q;if(q){q.rv=4;txt.push({x:q.x,y:q.y-.7,t:1.2,s:'TROLLED!',c:'#fff'})}else en.forEach(e=>{if(Math.hypot(e.x-p.x,e.y-p.y)<5)e.st=2});burst(p.x,p.y,'#fff',16);tn(700,.3,'square',.15,-500)}
 else if(a=='pickle'){let n=0;for(const[ux,uy]of[[1,0],[-1,0],[0,1],[0,-1]]){if(ux==dx&&uy==dy)continue;const tx=x+ux,ty=y+uy;if(G[ty][tx]===0&&!bombs.some(b=>b.x==tx&&b.y==ty)&&!items.some(i=>i.x==tx&&i.y==ty)&&!pl.some(o=>o.alive&&(o.x|0)==tx&&(o.y|0)==ty)&&!en.some(e=>(e.x|0)==tx&&(e.y|0)==ty)){G[ty][tx]=2;pu[ty][tx]=-1;burst(tx+.5,ty+.5,'#5aa84a',8);n++}}ok=n>0}
 else if(a=='potato'){ok=0;for(let i=4;i>0;i--){const tx=x+dx*i,ty=y+dy*i;if(G[ty]&&G[ty][tx]===0&&!bombs.some(b=>b.x==tx&&b.y==ty)){dropB(tx,ty,1,p.rng+1,null).sid=p.id;burst(tx+.5,ty+.5,'#b98a52',10);ok=1;break}}}
 else if(a=='shadow'){p.ivT=AB.shadow.dur;tn(240,.4,'sine',.18,-120)}
 else if(a=='cyber'){const rd=2.6;if(pvp())RV.forEach(q=>{if(Math.hypot(q.x-p.x,q.y-p.y)<rd){q.fz=Math.max(q.fz,1.2);hurt(q,0,p.id,15,'s')}});en.forEach(e=>{if(Math.hypot(e.x-p.x,e.y-p.y)<rd){e.st=2;if(e.hit<=0){e.hp=Math.max(0,e.hp-10);e.hit=.5;e.lh=p.id;dmgNum(e.x,e.y-.5,10,'s')}}});SFX.zap()}
 else if(a=='pirate'){const tx=x+dx,ty=y+dy;if(!(dx||dy)||!G[ty]||G[ty][tx]!==0||bombs.some(b=>b.x==tx&&b.y==ty)||occ(tx,ty))ok=0;else{const b=dropB(tx,ty,2.4,p.rng,null);b.sid=p.id;b.dx=dx;b.dy=dy;b.k=0;b.bn=3;tn(180,.25,'square',.22,-80)}}
 else if(a=='viking'){p.shield=Math.min(2,p.shield+1);p.vkT=AB.viking.dur;tn(220,.35,'triangle',.25,-60)}
 else if(a=='samurai'){p.pry=AB.samurai.dur;tn(2200,.1,'triangle',.12,-600)}
 else if(a=='phase'){p.phT=AB.phase.dur;p.phW=1;tn(400,.5,'sine',.15,300)}
 else if(a=='toxic'){let n=0;for(const[ux,uy]of[[0,0],...DIR]){const tx=x+ux,ty=y+uy;if(G[ty]&&G[ty][tx]===0){tox=tox.filter(t=>!(t.x==tx&&t.y==ty));tox.push({x:tx,y:ty,t:5,o:p.id});n++}}ok=n>0;if(ok)nz(.5,.35,600)}
 else if(a=='mecha'){msl.push({x:p.x+dx*.3,y:p.y+dy*.3,vx:dx||1,vy:dy,o:p.id,t:3,lx:x,ly:y});tn(500,.4,'sawtooth',.15,700)}
 else if(a=='fireman'){p.fsT=AB.fireman.dur;tn(300,.3,'triangle',.2,200)}
 else if(a=='alien'){const w=warpCell(p);if(!w)ok=0;else{p.x=w[0]+.5;p.y=w[1]+.5;p.vx=p.vy=0;p.inv=Math.max(p.inv,.6);SFX.warp()}}
 if(ok){p.cd=p.cdm=AB[a].cd;if(a!='dash')tn(600,.2,'sawtooth',.2,300)}else txt.push({x:p.x,y:p.y-.7,t:.8,s:'NO ROOM',c:'#aab'})}
const _useAb=useAb;useAb=function(p){const ox=p.x,oy=p.y,a=abil(p);_useAb(p);if(p.cd<=0)return;
 if(a=='cape'){p.gT=3;ring(p.x,p.y,1.4,'#ffd23f',.5)}
 else if(a=='robot'){for(let i=0;i<10;i++)fxl.push({k:'puff',x:p.x,y:p.y,vx:rr(-3,3),vy:rr(-3,3),r:3,t:.35,ml:.35,c:'#0ff'});ring(p.x,p.y,1.1,'#0ff',.3)}
 else if(a=='ninja'){puff(ox,oy,'rgba(70,70,90,.85)',12,14);puff(p.x,p.y,'rgba(200,200,220,.7)',8,10)}
 else if(a=='wizard'){for(let i=0;i<4;i++)fxl.push({k:'star',x:p.x+p.fx*(1+i),y:p.y+p.fy*(1+i),vx:0,vy:-.5,r:6,t:.6+i*.1,ml:.8,c:'#ffd23f'});ring(p.x,p.y,1,'#b06bff',.4)}
 else if(a=='doge'){for(let i=0;i<3;i++)fxl.push({k:'ring',x:p.x,y:p.y,r0:.5,r1:4.5,t:.6+i*.15,ml:.6+i*.15,c:'#ffe08a',w:5})}
 else if(a=='troll'){const q=p._tq||p;fxl.push({k:'text',x:q.x,y:q.y-1,vx:0,vy:-.5,t:1.2,ml:1.2,s:'U MAD?',c:'#fff'});ring(p.x,p.y,2,'#ff7ac8',.4);ring(p.x,p.y,1.5,'#7dffb0',.5)}
 else if(a=='pickle'){ring(p.x,p.y,1.6,'#7cdc5a',.5);puff(p.x,p.y,'rgba(124,220,90,.7)',8,10)}
 else if(a=='potato'){for(let i=0;i<8;i++)fxl.push({k:'puff',x:p.x,y:p.y,vx:p.fx*4+rr(-1,1),vy:p.fy*4+rr(-1,1),r:4,t:.4,ml:.4,c:'#b98a52'})}
 else if(a=='shadow'){puff(p.x,p.y,'rgba(60,30,110,.85)',14,14);ring(p.x,p.y,1.6,'#b06bff',.5,.2)}
 else if(a=='cyber'){ring(p.x,p.y,2.6,'#4ff3ff',.5,.3);ring(p.x,p.y,2,'#e8ffff',.35,.3);for(let i=0;i<8;i++){const an=i*Math.PI/4+rr(-.2,.2);fxl.push({k:'bolt',x:p.x,y:p.y,x2:p.x+Math.cos(an)*2.4,y2:p.y+Math.sin(an)*2.4,t:.3,ml:.3,c:'#7ffcff'})}}
 else if(a=='pirate'){puff(p.x+p.fx*.6,p.y+p.fy*.6,'rgba(230,230,240,.85)',10,10);ring(p.x+p.fx*.6,p.y+p.fy*.6,.9,'#ffd23f',.3,.2)}
 else if(a=='viking'){ring(p.x,p.y,1.3,'#ffd23f',.45,.2);ring(p.x,p.y,1.7,'#c0c6cf',.55,.2)}
 else if(a=='samurai'){fxl.push({k:'slash',x:p.x,y:p.y,a:Math.atan2(p.fy,p.fx),t:.25,ml:.25,c:'#ffe6e6'})}
 else if(a=='phase'){puff(p.x,p.y,'rgba(220,225,255,.7)',10,12);ring(p.x,p.y,1.2,'#e9ecff',.4,.2)}
 else if(a=='toxic'){puff(p.x,p.y,'rgba(140,240,60,.7)',12,12);ring(p.x,p.y,1.6,'#7dff3a',.5,.2)}
 else if(a=='mecha'){puff(p.x,p.y,'rgba(255,170,60,.8)',8,8);ring(p.x,p.y,.9,'#ff3b3b',.3,.2)}
 else if(a=='fireman'){for(let i=0;i<14;i++)fxl.push({k:'puff',x:p.x,y:p.y,vx:rr(-2,2),vy:rr(-2.5,.5),r:3,t:.5,ml:.5,c:'rgba(110,190,255,.85)'});ring(p.x,p.y,1.3,'#6fc8ff',.45,.2)}
 else if(a=='alien'){ring(ox,oy,1.4,'#ff7ae0',.45,.2);ring(p.x,p.y,1.4,'#7dffb0',.45,2);puff(ox,oy,'rgba(255,122,224,.7)',10,10);puff(p.x,p.y,'rgba(125,255,176,.7)',10,10)}
 else{for(let i=0;i<4;i++)fxl.push({k:'puff',x:p.x-p.fx*i*.3,y:p.y-p.fy*i*.3,vx:0,vy:0,r:8-i,t:.3,ml:.3,c:p.c})}};
/* ---------- NEW ABILITY HELPERS ---------- */
/* [b2 · 639-639] */
function counter(p){const x=p.x|0,y=p.y|0;for(let i=1;i<=3;i++){const tx=x+p.fx*i,ty=y+p.fy*i,v=G[ty]&&G[ty][tx];if(v===undefined||v==1)break;fires.push({x:tx,y:ty,t:.45,m:0,o:p.id,dmg:25,kd:'s'});burst(tx+.5,ty+.5,'#fff',5);if(v==2){crate(tx,ty,p.id);break}}fxl.push({k:'slash',x:p.x,y:p.y,a:Math.atan2(p.fy,p.fx),t:.3,ml:.3,c:'#fff'})}
/* [b2 · 641-641] */
function warpCell(p){const o=[],RV=rivals(p);for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(G[y][x]!==0||sq[y][x]>=2||Math.abs(x-(p.x|0))+Math.abs(y-(p.y|0))<4||danger(x,y))continue;if(en.some(e=>Math.hypot(e.x-x-.5,e.y-y-.5)<2)||ws.some(w=>w.x==x&&w.y==y))continue;if(RV.some(q=>Math.hypot(q.x-x-.5,q.y-y-.5)<1.5))continue;o.push([x,y])}return o.length?o[R()*o.length|0]:null}
/* [b2 · 666-666] */
function swap(p){const RV=rivals(p);if(!RV.length)return;const q=RV[R()*RV.length|0];[p.x,q.x]=[q.x,p.x];[p.y,q.y]=[q.y,p.y];p.vx=p.vy=q.vx=q.vy=0;for(const o of[p,q]){o.inv=Math.max(o.inv,.8);if(G[o.y|0][o.x|0]==2)o.ghost=Math.max(o.ghost,1);bombs.forEach(b=>{if(Math.abs(o.x-b.x-.5)<.86&&Math.abs(o.y-b.y-.5)<.86)b.pass.add(o.id)});burst(o.x,o.y,'#ff9ff3',16)}tn(500,.3,'sine',.2,500)}
/* [b2 · 689-698] */
function drawP(p){if(!p.alive)return;const px=p.x*T,py=OY+p.y*T,win=st!='play'&&winner==p.id,jump=win?-Math.abs(Math.sin(tm*8))*12:0,mvg=Math.hypot(p.vx,p.vy)>.3,bob=mvg?Math.sin(p.anim*6)*2:0;
 c.save();if(p.inv>0&&Math.floor(tm*14)%2)c.globalAlpha=.35;if(p.ghost>0)c.globalAlpha*=.6;
 c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(px,py+15,13,5,0,0,7);c.fill();
 c.fillStyle='#222';const fs=mvg?Math.sin(p.anim*6)*3:0;c.beginPath();c.ellipse(px-7,py+12+fs+jump,5,4,0,0,7);c.ellipse(px+7,py+12-fs+jump,5,4,0,0,7);c.fill();
 const by=py+bob+jump;c.fillStyle=p.c;c.beginPath();c.arc(px,by,16,0,7);c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=2;c.stroke();c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.arc(px-5,by-7,6,0,7);c.fill();
 if(p.id==0){c.strokeStyle='#222';c.lineWidth=2;c.beginPath();c.moveTo(px,by-15);c.lineTo(px,by-23);c.stroke();c.fillStyle='#ffd23f';c.beginPath();c.arc(px,by-24,3.5,0,7);c.fill()}else{c.fillStyle='#fff';for(const s of[-1,1]){c.beginPath();c.moveTo(px+s*8,by-12);c.lineTo(px+s*14,by-24);c.lineTo(px+s*14,by-9);c.fill()}}
 c.fillStyle='#fff';c.beginPath();c.arc(px-6,by-3,5,0,7);c.arc(px+6,by-3,5,0,7);c.fill();c.fillStyle='#111';c.beginPath();c.arc(px-6+p.fx*1.8,by-3+p.fy*1.8,2.4,0,7);c.arc(px+6+p.fx*1.8,by-3+p.fy*1.8,2.4,0,7);c.fill();
 c.strokeStyle='#111';c.lineWidth=2;c.beginPath();c.arc(px,by+5,4,.1*Math.PI,.9*Math.PI);c.stroke();
 if(p.shield){c.strokeStyle='rgba(120,230,255,'+(.6+.3*Math.sin(tm*8))+')';c.lineWidth=3;c.beginPath();c.arc(px,by,22,0,7);c.stroke()}
 c.restore()}
/* [b2 · 699-725] */
function drawP(p){const da=tm-p.dtm;if(!p.alive&&da>=1.2)return;
 const px=p.x*T,sk=SK[p.sk],a=sk.a,mvg=Math.hypot(p.vx,p.vy)>.3,s=mvg?Math.abs(Math.sin(p.anim*6)):0,win=(st=='over'||st=='match')&&p.alive&&(S.mode>=5?coopWon:winner==p.id),gy=OY+p.y*T;
 let py=gy,rot=Math.max(-.3,Math.min(.3,p.vx*.03)),sx=1+.14*s+.02*Math.sin(tm*3),sy=1-.14*s-.02*Math.sin(tm*3);
 if(win){py-=Math.abs(Math.sin(tm*7))*14;rot=Math.sin(tm*7)*.3}
 c.save();
 if(!p.alive){const u=da/1.2;py-=u*34;rot=da*12;sx=sy=1-u*.7;c.globalAlpha=1-u}else{if(p.inv>0&&Math.floor(tm*14)%2)c.globalAlpha=.35;if(p.ghost>0)c.globalAlpha*=.6}
 c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(px,gy+15,13,5,0,0,7);c.fill();c.strokeStyle=p.c;c.lineWidth=2.5;c.beginPath();c.ellipse(px,gy+15,16,6.5,0,0,7);c.stroke();
 c.translate(px,py+14);c.rotate(rot);c.scale(sx,sy);c.translate(-px,-py-14);
 const by=py,sw=Math.sin(tm*8)*3;
 c.fillStyle='#222';const fs=mvg?Math.sin(p.anim*6)*3:0;c.beginPath();c.ellipse(px-7,py+12+fs,5,4,0,0,7);c.ellipse(px+7,py+12-fs,5,4,0,0,7);c.fill();
 if(a=='cape'){c.fillStyle='#d62839';c.beginPath();c.moveTo(px-14,by-6);c.lineTo(px+14,by-6);c.lineTo(px+20+sw,by+18);c.lineTo(px-20-sw,by+18);c.fill()}
 c.strokeStyle=sk.c;c.lineWidth=5;c.lineCap='round';for(const d of[-1,1]){c.beginPath();c.moveTo(px+d*14,by+2);c.lineTo(px+d*(win?22:19),win?by-14+Math.sin(tm*14+d)*4:by+8+(mvg?Math.sin(p.anim*6+d)*3:0));c.stroke()}
 c.fillStyle=sk.c;c.beginPath();if(a=='pickle')c.ellipse(px,by,13,18,0,0,7);else c.arc(px,by,16,0,7);c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=2;c.stroke();c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.arc(px-5,by-7,6,0,7);c.fill();
 if(a=='doge'){c.fillStyle='#b9792e';for(const d of[-1,1]){c.beginPath();c.moveTo(px+d*6,by-13);c.lineTo(px+d*15,by-26);c.lineTo(px+d*16,by-8);c.fill()}c.fillStyle='#fff3d6';c.beginPath();c.ellipse(px,by+6,9,7,0,0,7);c.fill()}
 if(a=='potato'||a=='pickle'){c.fillStyle='rgba(0,0,0,.22)';[[-7,-8],[6,-10],[-3,10],[8,6],[-10,4]].forEach(([u,v])=>{c.beginPath();c.arc(px+u,by+v,2,0,7);c.fill()})}
 if(a=='cape'||a=='ninja'){c.fillStyle='#111';c.fillRect(px-(a=='ninja'?16:13),by-9,a=='ninja'?32:26,a=='ninja'?10:8)}
 if(a=='ninja'){c.strokeStyle='#e63946';c.lineWidth=3;c.beginPath();c.moveTo(px+15,by-6);c.lineTo(px+25+sw,by-2);c.moveTo(px+15,by-6);c.lineTo(px+24-sw,by-12);c.stroke()}
 if(a=='robot'){c.fillStyle='#0ff';c.shadowColor='#0ff';c.shadowBlur=8;c.fillRect(px-12,by-8,24,9);c.shadowBlur=0;c.strokeStyle='#555';c.lineWidth=2;c.beginPath();c.moveTo(px,by-15);c.lineTo(px,by-24);c.stroke();c.fillStyle='#f33';c.beginPath();c.arc(px,by-25,3.5,0,7);c.fill()}
 else{c.fillStyle='#fff';c.beginPath();c.arc(px-6,by-3,5,0,7);c.arc(px+6,by-3,5,0,7);c.fill();c.fillStyle='#111';c.beginPath();c.arc(px-6+p.fx*1.8,by-3+p.fy*1.8,2.4,0,7);c.arc(px+6+p.fx*1.8,by-3+p.fy*1.8,2.4,0,7);c.fill()}
 c.strokeStyle='#111';c.lineWidth=2;
 if(a=='troll'){c.beginPath();c.arc(px,by+2,9,.05*Math.PI,.95*Math.PI);c.stroke();c.beginPath();c.moveTo(px-12,by-12);c.lineTo(px-3,by-9);c.moveTo(px+12,by-12);c.lineTo(px+3,by-9);c.stroke()}
 else if(a!='wizard'&&a!='doge'){c.beginPath();c.arc(px,by+5,4,.1*Math.PI,.9*Math.PI);c.stroke()}
 if(a=='wizard'){c.fillStyle='#eee';c.beginPath();c.moveTo(px-9,by+4);c.lineTo(px,by+21);c.lineTo(px+9,by+4);c.fill();c.fillStyle='#5b3fd6';c.beginPath();c.moveTo(px-18,by-9);c.lineTo(px,by-40);c.lineTo(px+18,by-9);c.fill();c.fillStyle='#ffd23f';c.beginPath();c.arc(px,by-22,2.5,0,7);c.fill()}
 if(a=='doge'){c.fillStyle='#111';c.beginPath();c.arc(px,by+3,2.5,0,7);c.fill()}
 if(p.shield){c.strokeStyle='rgba(120,230,255,'+(.6+.3*Math.sin(tm*8))+')';c.lineWidth=3;c.beginPath();c.arc(px,by,22,0,7);c.stroke()}
 if(p.fz>0){c.fillStyle='rgba(150,230,255,.55)';c.beginPath();c.arc(px,by,19,0,7);c.fill()}
 c.restore()}

/* =====================================================================
   BOMB BATTLE — REDESIGN LAYER
   Characters, maps, enemies, bosses and effects. Each section is a
   table or a draw function, so new content can be added in one place.
   ===================================================================== */
const OL='#1d1838';
function shade(h,a){let n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,a<0?v*(1+a):v+(255-v)*a))|0;return`rgb(${f(r)},${f(g)},${f(b)})`}
function E(x2,x,y,rx,ry,f,st,lw){x2.beginPath();x2.ellipse(x,y,rx,ry,0,0,7);if(f){x2.fillStyle=f;x2.fill()}if(st){x2.strokeStyle=st;x2.lineWidth=lw||2.5;x2.stroke()}}
function P(x2,pts,f,st,lw){x2.beginPath();pts.forEach(([a,b],i)=>i?x2.lineTo(a,b):x2.moveTo(a,b));x2.closePath();if(f){x2.fillStyle=f;x2.fill()}if(st){x2.strokeStyle=st;x2.lineWidth=lw||2.5;x2.stroke()}}
function L(x2,a,b,c2,d,st,lw){x2.strokeStyle=st;x2.lineWidth=lw;x2.lineCap='round';x2.beginPath();x2.moveTo(a,b);x2.lineTo(c2,d);x2.stroke()}
function star(x2,x,y,r,f){const p=[];for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,q=i%2?r*.45:r;p.push([x+Math.cos(a)*q,y+Math.sin(a)*q])}P(x2,p,f,OL,1.5)}

/* ---------- CHARACTER DATA ---------- */
/* [b3 · 790-844] */
const PERS=['Brave leader who never backs down.','Precise machine with a love for big numbers.','Silent, swift and gone in a puff of smoke.','Mysterious spell-caster with a fiery temper.','Very bomb. Much wow. Such brave.','Lives to annoy. Problem?','Crunchy, briny and surprisingly sturdy.','Lumpy, lovable and full of starch.','Chill vibes, headphones always on.','Hot-headed and first into every fight.','Calm gardener with a lucky sprout.','Sunny optimist with a star clip.','Dreamy night owl under a moon cap.','Sweet but fierce, never without her bow.','Daredevil tinkerer with flight goggles.','Gentle soul with a tiny halo.',
'Strikes from the dark, gone before the smoke clears.','Overclocked circuits and a crackling temper.','Sails the seven seas looking for things to blow up.','Horned helmet, iron shield, zero fear.','Disciplined blade master who turns blasts aside.','Boo! Floats through walls like they are not there.','Leaves a trail of bubbling green goo.','Heavy armour, homing missiles, no mercy.','First in, last out, and never gets burned.','Came in peace. Brought bombs anyway.'];

function drawChar(x,cx,cy,k,o={}){const sk=SK[k],a=sk.a||'',col=sk.c,t=tm,fx=o.fx||0,fy=o.fy||0,sw=Math.sin(t*8)*3,mvg=o.mv,an=o.anim||0;
 // cape (behind)
 if(a=='cape'){const fl=mvg?Math.sin(t*14)*4:Math.sin(t*3)*2;P(x,[[cx-12,cy-6],[cx+12,cy-6],[cx+19+fl,cy+18],[cx,cy+15],[cx-19-fl,cy+18]],'#e0283c',OL,2)}
 if(a=='ninja'){const d=fx?-fx:1;L(x,cx+13*d,cy-8,cx+(26+sw)*d,cy-4+Math.sin(t*10)*3,'#e63946',3.5);L(x,cx+13*d,cy-8,cx+(24-sw)*d,cy-14,'#e63946',3)}
 // feet
 const fs=mvg?Math.sin(an*6)*3:0;E(x,cx-7,cy+13+fs,6,4.5,shade(col,-.55),OL,2);E(x,cx+7,cy+13-fs,6,4.5,shade(col,-.55),OL,2);
 // arms
 for(const d of[-1,1]){const hx=cx+d*(o.win?21:19),hy=o.win?cy-14+Math.sin(t*14+d)*4:o.hurt?cy-10:cy+6+(mvg?Math.sin(an*6+d)*3:Math.sin(t*3+d)*1);E(x,hx,hy,4.5,4.5,shade(col,-.15),OL,2)}
 // body
 const g=x.createRadialGradient(cx-6,cy-9,2,cx,cy,20);g.addColorStop(0,shade(col,.45));g.addColorStop(.55,col);g.addColorStop(1,shade(col,-.35));
 if(a=='pickle')E(x,cx,cy-1,13,19,g,OL,2.5);else if(a=='potato'){x.beginPath();x.moveTo(cx-17,cy);x.bezierCurveTo(cx-18,cy-15,cx-4,cy-18,cx+4,cy-16);x.bezierCurveTo(cx+18,cy-14,cx+19,cy+4,cx+14,cy+11);x.bezierCurveTo(cx+6,cy+18,cx-14,cy+16,cx-17,cy);x.fillStyle=g;x.fill();x.strokeStyle=OL;x.lineWidth=2.5;x.stroke()}else E(x,cx,cy,16.5,16,g,OL,2.5);
 E(x,cx-6,cy-9,5,3.2,'rgba(255,255,255,.45)');
 // body details
 if(a=='pickle'){for(const[u,v]of[[-6,-11],[5,-6],[-7,4],[6,9],[-2,14],[1,-15]])E(x,cx+u,cy+v,1.8,1.8,'#8fd46f');for(const[u,v]of[[3,2],[-4,10],[7,-12]])E(x,cx+u,cy+v,1,1,'#2e6b25')}
 if(a=='potato')for(const[u,v]of[[-9,-8],[8,-9],[-4,11],[10,5],[-12,3],[3,-13]])E(x,cx+u,cy+v,1.8,1.4,'#7a5530');
 if(a=='robot'){x.strokeStyle='rgba(30,30,50,.45)';x.lineWidth=1.5;x.beginPath();x.moveTo(cx-14,cy+5);x.lineTo(cx+14,cy+5);x.stroke();for(const u of[-11,11])E(x,cx+u,cy+9,1.6,1.6,'#5c6470');E(x,cx,cy+10,3,2,`rgba(0,240,255,${.5+.5*Math.sin(t*6)})`)}
 if(a=='cape')star(x,cx,cy+9,4.5,'#ffd23f');
 if(a=='doge'){for(const d of[-1,1])P(x,[[cx+d*5,cy-13],[cx+d*15,cy-27],[cx+d*16,cy-8]],'#b9792e',OL,2);E(x,cx,cy+6,10,7.5,'#fff3d6',OL,1.5)}
 // eyes
 const ey=cy-3,ex=6;
 if(a=='robot'){x.save();x.shadowColor='#0ff';x.shadowBlur=10;x.beginPath();x.roundRect(cx-13,ey-6,26,10,5);x.fillStyle='#0b1a2a';x.fill();x.strokeStyle=OL;x.lineWidth=2;x.stroke();x.fillStyle='#3ff';const sc=Math.sin(t*3)*6+fx*2;x.fillRect(cx-4+sc,ey-3,8,4);x.restore()}
 else if(o.win){for(const d of[-1,1]){x.strokeStyle=OL;x.lineWidth=2.5;x.beginPath();x.arc(cx+d*ex,ey+1,3.5,Math.PI*1.1,Math.PI*1.9);x.stroke()}}
 else if(o.hurt){for(const d of[-1,1]){L(x,cx+d*ex-3,ey-3,cx+d*ex+3,ey+3,OL,2.2);L(x,cx+d*ex+3,ey-3,cx+d*ex-3,ey+3,OL,2.2)}}
 else{const blink=Math.sin(t*1.3+k)>.985;for(const d of[-1,1]){const rx=a=='potato'?(d<0?4.5:5.5):5;if(blink){L(x,cx+d*ex-3,ey,cx+d*ex+3,ey,OL,2)}else{E(x,cx+d*ex,ey,rx,a=='purple'?3:5.5,'#fff',OL,1.5);E(x,cx+d*ex+fx*1.8,ey+fy*1.8+.5,2.6,2.8,'#111');E(x,cx+d*ex+fx*1.8-1,ey+fy*1.8-.8,.9,.9,'#fff')}}}
 // ninja mask over eyes
 if(a=='ninja'){x.save();x.globalCompositeOperation='source-over';x.fillStyle='#14151c';x.beginPath();x.roundRect(cx-16.5,ey-8,33,4,2);x.fill();x.beginPath();x.roundRect(cx-16.5,ey+4,33,8,3);x.fill();L(x,cx-16,ey-8,cx+16,ey-8,'#e63946',3);x.restore()}
 // brows
 x.strokeStyle=OL;x.lineWidth=2.2;x.lineCap='round';
 if(a=='cape'){L(x,cx-10,ey-9,cx-3,ey-7,OL,2.4);L(x,cx+10,ey-9,cx+3,ey-7,OL,2.4)}
 if(a=='troll'){L(x,cx-12,ey-12,cx-3,ey-8,OL,2.5);L(x,cx+12,ey-12,cx+3,ey-10,OL,2.5)}
 if(a=='doge'){L(x,cx-9,ey-9,cx-3,ey-10,'#6b4a1a',2.5);L(x,cx+3,ey-11,cx+9,ey-8,'#6b4a1a',2.5)}
 // mouth
 if(a=='troll'){x.beginPath();x.moveTo(cx-11,cy+3);x.quadraticCurveTo(cx,cy+16,cx+11,cy+3);x.quadraticCurveTo(cx,cy+8,cx-11,cy+3);x.fillStyle='#fff';x.fill();x.strokeStyle=OL;x.lineWidth=2;x.stroke();for(let i=-2;i<=2;i++)L(x,cx+i*3.6,cy+5,cx+i*3.6,cy+9.5,OL,1)}
 else if(a=='doge'){E(x,cx,cy+3,3.2,2.4,'#111');x.beginPath();x.arc(cx,cy+7,3.5,.1*Math.PI,.9*Math.PI);x.stroke();if(o.win||mvg)E(x,cx+1,cy+11,2,2.6,'#ff7a93')}
 else if(a=='potato'){x.beginPath();x.arc(cx,cy+5,5,.1*Math.PI,.9*Math.PI);x.stroke();x.fillStyle='#fff';x.fillRect(cx-2.5,cy+8.5,5,3.5)}
 else if(a=='wizard'){P(x,[[cx-9,cy+4],[cx,cy+22],[cx+9,cy+4]],'#f1f1f1',OL,1.5)}
 else if(a=='robot'){x.fillStyle='#2a3038';for(let i=-2;i<=2;i++)x.fillRect(cx+i*4-1,cy+3,2,3)}
 else if(a!='ninja'){x.beginPath();if(o.hurt)x.arc(cx,cy+9,3.5,Math.PI*1.1,Math.PI*1.9);else if(a=='yellow'||o.win){x.arc(cx,cy+4,5.5,.05*Math.PI,.95*Math.PI);x.fillStyle='#5a1a1a';x.fill()}else x.arc(cx,cy+4,4,.15*Math.PI,.85*Math.PI);x.stroke()}
 if(a!='robot'&&a!='ninja'){E(x,cx-11,cy+3,2.6,1.6,'rgba(255,90,120,.35)');E(x,cx+11,cy+3,2.6,1.6,'rgba(255,90,120,.35)')}
 // headwear
 if(a=='cape'){L(x,cx,cy-15,cx+2,cy-23,OL,2);E(x,cx+2,cy-24,3.5,3.5,'#ffd23f',OL,1.5)}
 if(a=='robot'){L(x,cx,cy-15,cx,cy-24,'#555',2.5);E(x,cx,cy-25,3.5,3.5,Math.sin(t*6)>0?'#ff3b3b':'#7a1010',OL,1.5)}
 if(a=='wizard'){const tl=Math.sin(t*2)*3;P(x,[[cx-20,cy-9],[cx+tl,cy-42],[cx+20,cy-9]],'#4b2fb8',OL,2);E(x,cx,cy-9,21,4,'#5b3fd6',OL,2);star(x,cx+tl*.4,cy-23,4.5,'#ffd23f');if(Math.sin(t*5)>.6){E(x,cx+tl+3,cy-42,1.6,1.6,'#fff7a0')}}
 if(a=='blue'){x.strokeStyle=OL;x.lineWidth=3;x.beginPath();x.arc(cx,cy-2,18,Math.PI*1.08,Math.PI*1.92);x.stroke();E(x,cx-17,cy-1,3.5,6,'#222c55',OL,1.5);E(x,cx+17,cy-1,3.5,6,'#222c55',OL,1.5)}
 if(a=='red'){P(x,[[cx-8,cy-14],[cx-4,cy-24],[cx-1,cy-15],[cx+3,cy-25],[cx+6,cy-14]],'#c8102e',OL,1.5);L(x,cx-15,cy-8,cx+15,cy-8,'#fff',2.5)}
 if(a=='green'){L(x,cx,cy-15,cx,cy-21,'#2e7d32',2);P(x,[[cx,cy-21],[cx-9,cy-27],[cx-3,cy-19]],'#7cdc5a',OL,1.2);P(x,[[cx,cy-21],[cx+9,cy-25],[cx+3,cy-18]],'#7cdc5a',OL,1.2)}
 if(a=='yellow')star(x,cx+9,cy-13,5,'#ff8a3d');
 if(a=='purple'){x.beginPath();x.arc(cx,cy-12,13,Math.PI,0);x.fillStyle='#5c2ea8';x.fill();x.strokeStyle=OL;x.lineWidth=2;x.stroke();E(x,cx+8,cy-20,3,3,'#ffe36a')}
 if(a=='pink'){P(x,[[cx+4,cy-14],[cx+14,cy-21],[cx+14,cy-9]],'#ff3d97',OL,1.5);P(x,[[cx+4,cy-14],[cx-6,cy-21],[cx-6,cy-9]],'#ff3d97',OL,1.5);E(x,cx+4,cy-14,2.5,2.5,'#ffb3d6',OL,1)}
 if(a=='orange'){L(x,cx-16,cy-11,cx+16,cy-11,'#4a2a10',3);for(const d of[-1,1])E(x,cx+d*6,cy-12,5,4,'#8fe3ff',OL,2)}
 if(a=='white'){x.save();x.shadowColor='#ffe36a';x.shadowBlur=8;x.strokeStyle='#ffd23f';x.lineWidth=2.5;E(x,cx,cy-24+Math.sin(t*3)*1.5,9,3,null,'#ffd23f',2.5);x.restore()}
}
// give every colour skin an accessory key (keeps ability mapping: colours still use DASH)
/* [b3 · 846-847] */
SK.forEach(s=>{if(!s.a)s.acc=s.n.toLowerCase()});
const _dc=drawChar;drawChar=function(x,cx,cy,k,o){const s=SK[k];if(s.acc){const sv=s.a;s.a=s.acc;try{_dc(x,cx,cy,k,o)}finally{s.a=sv}}else _dc(x,cx,cy,k,o)};

/* ---------- PLAYER RENDER ---------- */
/* [b3 · 850-888] */
function drawP(p){if(p.off)return;const da=tm-p.dtm;if(!p.alive&&da>=1.3)return;
 const px=p.x*T+(p.hf>0?Math.sin(tm*90)*3*p.hf/.3:0),mvg=Math.hypot(p.vx,p.vy)>.3,s=mvg?Math.abs(Math.sin(p.anim*6)):0,win=(st=='over'||st=='match')&&p.alive&&(S.mode>=5?coopWon:winner==p.id),gy=OY+p.y*T;
 let py=gy,rot=Math.max(-.3,Math.min(.3,p.vx*.03)),sx=1+.12*s+.03*Math.sin(tm*3),sy=1-.12*s-.03*Math.sin(tm*3);
 if(win){py-=Math.abs(Math.sin(tm*7))*14;rot=Math.sin(tm*7)*.3}
 c.save();
 if(!p.alive){
  if(da<.35){
   const u=da/.35;py-=Math.sin(u*Math.PI)*10;rot=Math.sin(da*25)*.4;sx=1+.2*Math.sin(u*Math.PI);sy=1-.2*Math.sin(u*Math.PI);c.globalAlpha=1;
   for(let i=0;i<3;i++){const an=da*14+i*2.09;star(c,px+Math.cos(an)*15,py-18+Math.sin(an)*4,3.5,'#ffd23f')}
  }else{
   const u=(da-.35)/.95;py-=12+u*38;rot=Math.sin((da-.35)*6)*.18;sx=sy=Math.max(.3,1-u*.4);c.globalAlpha=Math.max(0,1-u);
   c.save();c.strokeStyle='rgba(255,230,100,'+Math.max(0,1-u)+')';c.lineWidth=2.5;c.beginPath();c.ellipse(px,py-16,10,3.5,0,0,7);c.stroke();c.restore();
  }
 }else{
  if(p.inv>0&&!(p.gT>0)&&!(p.ivT>0)&&Math.floor(tm*16)%2)c.globalAlpha=.45;
  if(p.ghost>0)c.globalAlpha*=.6;
  if(p.phT>0)c.globalAlpha*=.5+.12*Math.sin(tm*9);
  if(p.ivT>0)c.globalAlpha*=.16+.06*Math.sin(tm*7);
 }
 if(p.alive&&mvg&&(SK[p.sk].a=='shadow'||p.ivT>0)&&R()<.35)fxLocal({k:'puff',x:p.x+rr(-.2,.2),y:p.y+.3,vx:0,vy:-.4,r:6,t:.45,ml:.45,c:'rgba(70,35,130,.45)',_s:1});
 if(p.alive&&mvg&&R()<.18)fxLocal({k:'puff',x:p.x+rr(-.2,.2),y:p.y+.4,vx:-p.vx*.15,vy:-.2,r:3,t:.25,ml:.25,c:'rgba(200,200,220,.45)',_s:1});
 E(c,px,gy+16,13,5,'rgba(0,0,0,.35)');E(c,px,gy+16,16,6.5,null,p.c,2.5);
 c.translate(px,py+14);c.rotate(rot);c.scale(sx*.95,sy*.95);c.translate(-px,-py-14);
 drawChar(c,px,py,p.sk,{fx:p.fx,fy:p.fy,mv:mvg,anim:p.anim,win,hurt:p.alive&&p.inv>1.5&&!(p.gT>0)});
 if(p.gT>0){c.save();c.globalAlpha=.35+.2*Math.sin(tm*10);E(c,px,py,24,24,'rgba(255,210,63,.25)','#ffd23f',3);c.restore();star(c,px+Math.cos(tm*5)*22,py+Math.sin(tm*5)*22,4,'#ffd23f')}
 if(p.shield){c.strokeStyle='rgba(120,230,255,'+(.6+.3*Math.sin(tm*8))+')';c.lineWidth=3;c.beginPath();c.arc(px,py,23,0,7);c.stroke()}
 if(p.fz>0)E(c,px,py,20,20,'rgba(150,230,255,.55)','#fff',1.5);
 if(p.slow>0)E(c,px,py+14,14,4,'rgba(140,220,255,.5)');
 if(p.rv>0){c.font='14px Bungee';c.textAlign='center';c.fillStyle='#fff';c.fillText('?',px+Math.sin(tm*6)*8,py-26);c.textAlign='left'}
 if(p.alive){
  if(p.fsT>0){E(c,px,py,24,24,'rgba(80,180,255,.14)','rgba(130,210,255,'+(.55+.3*Math.sin(tm*8))+')',2.5);for(let i=0;i<3;i++){const an=tm*3+i*2.1;E(c,px+Math.cos(an)*22,py+Math.sin(an)*22,2.4,3.2,'#8fd6ff')}}
  if(p.vkT>0){c.save();c.shadowColor='#ffd23f';c.shadowBlur=10;c.strokeStyle='rgba(255,210,63,'+(.6+.3*Math.sin(tm*6))+')';c.lineWidth=4;const fa2=Math.atan2(p.fy,p.fx);c.beginPath();c.arc(px,py,24,fa2-.9,fa2+.9);c.stroke();c.restore()}
  if(p.pry>0){c.save();c.strokeStyle='#fff';c.shadowColor='#fff';c.shadowBlur=14;c.lineWidth=3;const fa2=Math.atan2(p.fy,p.fx);c.beginPath();c.arc(px,py,26,fa2-1.2,fa2+1.2);c.stroke();c.restore()}
  if(p.phT>0){c.save();c.setLineDash([4,4]);c.strokeStyle='rgba(233,236,255,.8)';c.lineWidth=2;c.beginPath();c.arc(px,py,23,tm*3,tm*3+6.3);c.stroke();c.restore()}
  if(p.inv>0&&!(p.gT>0)){c.save();const pu=.5+.5*Math.sin(tm*16);c.strokeStyle='rgba(255,255,255,'+(.4+.4*pu)+')';c.lineWidth=2.5;c.setLineDash([4,3]);c.beginPath();c.arc(px,py+14,24,tm*4,tm*4+6.28);c.stroke();c.setLineDash([]);c.restore()}
  if(p.hf>0){c.save();c.globalCompositeOperation='lighter';E(c,px,py,21,21,p.hf>.15?'rgba(255,255,255,.9)':'rgba(255,50,50,.75)');c.restore()}
 }
 c.restore();
 if(p.alive&&!(p.ivT>0)&&st!='match'){const bw=40;hpBar(px-bw/2,gy-41,bw,6,p)}}
/* [b3 · 1043-1051] */
function abOf(k){return AB[SK[k].a||'dash']}
function skUI(){const n=curNP();[0,1,2,3].forEach(i=>{const box=$('sk'+i);box.style.display=i>=n?'none':'';if(i>=n)return;const k=skFor(i),ro=net.role=='host'&&i>0,s=SK[k],ab=abOf(k),pc=PCOL[i];
 const NN=netNames(),who=net.role=='host'?(i?esc(NN[i])+' · FRIEND '+i+' (PICKS ON THEIR OWN SCREEN)':esc(NN[0])+' · YOU (HOST)'):(i?'BETA · P2 · ARROWS · ENTER · R-SHIFT':esc(NN[0])+' · P1 · WASD · SPACE · Q');
 box.innerHTML=`<div class="top"><canvas class="pv big" data-k="${k}" data-pp="${i}" width="120" height="120"></canvas><div><div class="pn" style="color:${pc}">${who}</div><div class="cn">${s.n}</div><div class="ab">${ab.n} · ${ab.cd}s cooldown<br>${ab.d}</div><div class="ps">${PERS[k]}</div></div></div>`+(ro?`<div class='ps'>${esc(NN[i])} chooses their fighter on their own device. It shows up here.</div>`:'')+(ro?[]:GROUPS).map(g=>`<div class="gl">${g}${g=='Elite'?' · unlock with ★ stars':''}</div><div class="grid">`+SK.map((q,j)=>q.g==g?`<div class="chip${k==j?' sel':''}${isUnl(j)?'':' lock'}" data-p="${i}" data-j="${j}" title="${q.n}${isUnl(j)?'':' (locked)'}"><canvas class="pv" data-k="${j}" width="48" height="48"></canvas>${isUnl(j)?q.n:'🔒'+q.cost+'★'}</div>`:'').join('')+'</div>').join('')});
 $('skStars').textContent='★ '+stars+' STARS'}
$('skins').onclick=e=>{const b=e.target.closest('.chip');if(b){const j=+b.dataset.j;if(!isUnl(j)){const cost=SK[j].cost;if(stars>=cost){stars-=cost;LS.set('bbStars',stars);UNL.add(j);LS.set('bbUnl',[...UNL]);toast('Unlocked '+SK[j].n+'! ('+AB[SK[j].a].n+')');jingle(1)}else{toast('Need '+(cost-stars)+' more ★ to unlock '+SK[j].n+'. Earn stars in every match.');return}}S.sk[+b.dataset.p]=j;saveS();skUI();tn(880,.08,'triangle',.18);tn(1320,.12,'triangle',.15,0,.06);const cv2=$('sk'+b.dataset.p).querySelector('.big');cv2&&cv2.classList.add('pop')}};
function previews(){const on=id=>$(id).classList.contains('on');if(on('skins')||on('wait')||on('prof'))document.querySelectorAll('canvas.pv').forEach(cc=>{const x=cc.getContext('2d'),w=cc.width,s=w/48;x.clearRect(0,0,w,w);x.save();x.scale(s,s);const big=cc.classList.contains('big'),bounce=big?-Math.abs(Math.sin(tm*3))*3:0;E(x,24,40,12,4,'rgba(0,0,0,.3)');drawChar(x,24,26+bounce,+cc.dataset.k,{fx:Math.sin(tm*.8),fy:0,mv:big,anim:tm*1.5,win:big&&Math.sin(tm*.7)>.8});x.restore()});
 if(on('matchEnd')){const cc=$('winc'),x=cc.getContext('2d');x.clearRect(0,0,200,170);x.save();x.scale(3,3);E(x,33,52,13,4,'rgba(0,0,0,.3)');drawChar(x,33,36-Math.abs(Math.sin(tm*6))*6,winSk,{win:1});x.restore();for(let i=0;i<5;i++){const a=tm*2+i*1.26;star(x,100+Math.cos(a)*80,80+Math.sin(a)*30,6,['#ffd23f','#ff7ac8','#7dffb0','#35a7ff','#ff9a3d'][i])}}
 requestAnimationFrame(previews)}
/* [b3 · 1056-1057] */
$('abl').innerHTML=SK.filter(s=>s.g!='Colour').map(s=>`<span><b>${s.n}</b> · ${AB[s.a].n}: ${AB[s.a].d}</span>`).join('')+`<span><b>Colour fighters</b> · DASH: ${AB.dash.d}</span>`;
requestAnimationFrame(previews);

/* =====================================================================
   BOMB BATTLE — UPGRADE LAYER
   Elite fighters, health bars, damage numbers, two-player HUD, extra maps.
   ===================================================================== */
/* ---------- ELITE FIGHTER ART ---------- */
/* [b3 · 1064-1151] */
const NEWA=new Set(['shadow','cyber','pirate','viking','samurai','phase','toxic','mecha','fireman','alien']);
function drawNew(x,cx,cy,k,o){const s=SK[k],a=s.a,col=s.c,t=tm,fx=o.fx||0,fy=o.fy||0,mvg=o.mv,an=o.anim||0,sw=Math.sin(t*8)*3,ey=cy-3;
 const g=x.createRadialGradient(cx-6,cy-9,2,cx,cy,20);g.addColorStop(0,shade(col,.45));g.addColorStop(.55,col);g.addColorStop(1,shade(col,-.35));
 const fs=mvg?Math.sin(an*6)*3:0;
 const feet=f=>{E(x,cx-7,cy+13+fs,6,4.5,f||shade(col,-.55),OL,2);E(x,cx+7,cy+13-fs,6,4.5,f||shade(col,-.55),OL,2)};
 const arms=f=>{for(const d of[-1,1]){const hx=cx+d*(o.win?21:19),hy=o.win?cy-14+Math.sin(t*14+d)*4:o.hurt?cy-10:cy+6+(mvg?Math.sin(an*6+d)*3:Math.sin(t*3+d));E(x,hx,hy,4.5,4.5,f||shade(col,-.15),OL,2)}};
 const body=()=>{E(x,cx,cy,16.5,16,g,OL,2.5);E(x,cx-6,cy-9,5,3.2,'rgba(255,255,255,.4)')};
 const xeyes=(c1=OL)=>{for(const d of[-1,1]){L(x,cx+d*6-3,ey-3,cx+d*6+3,ey+3,c1,2.2);L(x,cx+d*6+3,ey-3,cx+d*6-3,ey+3,c1,2.2)}};
 const eyes=(only)=>{const blink=Math.sin(t*1.3+k)>.985;for(const d of[-1,1]){if(only&&d!=only)continue;const X=cx+d*6;if(o.hurt){L(x,X-3,ey-3,X+3,ey+3,OL,2.2);L(x,X+3,ey-3,X-3,ey+3,OL,2.2)}else if(o.win){x.strokeStyle=OL;x.lineWidth=2.5;x.beginPath();x.arc(X,ey+1,3.5,Math.PI*1.1,Math.PI*1.9);x.stroke()}else if(blink)L(x,X-3,ey,X+3,ey,OL,2);else{E(x,X,ey,5,5.5,'#fff',OL,1.5);E(x,X+fx*1.8,ey+fy*1.8+.5,2.6,2.8,'#111');E(x,X+fx*1.8-1,ey+fy*1.8-.8,.9,.9,'#fff')}}};
 const smile=(w=4)=>{x.strokeStyle=OL;x.lineWidth=2;x.beginPath();if(o.hurt)x.arc(cx,cy+9,3.5,Math.PI*1.1,Math.PI*1.9);else if(o.win){x.arc(cx,cy+4,5.5,.05*Math.PI,.95*Math.PI);x.fillStyle='#5a1a1a';x.fill()}else x.arc(cx,cy+4,w,.15*Math.PI,.85*Math.PI);x.stroke()};
 const blush=()=>{E(x,cx-11,cy+3,2.6,1.6,'rgba(255,90,120,.35)');E(x,cx+11,cy+3,2.6,1.6,'rgba(255,90,120,.35)')};
 if(a=='shadow'){
  for(let i=0;i<3;i++){const ph=(t*1.2+i/3)%1;E(x,cx+(i-1)*8+Math.sin(t*3+i)*2,cy+13+ph*7,5*(1-ph)+1.5,4*(1-ph)+1,`rgba(140,70,230,${.55*(1-ph)})`)}
  arms('#1a1228');body();
  x.beginPath();x.moveTo(cx-18,cy+3);x.quadraticCurveTo(cx-20,cy-23,cx,cy-25);x.quadraticCurveTo(cx+20,cy-23,cx+18,cy+3);x.quadraticCurveTo(cx+12,cy-11,cx,cy-11);x.quadraticCurveTo(cx-12,cy-11,cx-18,cy+3);x.fillStyle='#140c24';x.fill();x.strokeStyle=OL;x.lineWidth=2;x.stroke();
  E(x,cx,ey+1,11.5,7.5,'rgba(4,2,10,.9)');
  if(o.hurt)xeyes('#d9a6ff');else{x.save();x.shadowColor='#c77dff';x.shadowBlur=10;for(const d of[-1,1])P(x,[[cx+d*2,ey+(o.win?1:0)],[cx+d*9,ey-3],[cx+d*8,ey+1.5]],'#e2b8ff');x.restore()}
  x.beginPath();x.roundRect(cx-13,cy+6,26,5,2);x.fillStyle='#6b2fb3';x.fill();L(x,cx+9,cy+9,cx+19+sw,cy+15,'#6b2fb3',3)}
 else if(a=='cyber'){
  feet('#0e1a33');arms('#1d3a6e');body();
  x.save();x.shadowColor='#3ff';x.shadowBlur=8;x.strokeStyle='#4ff3ff';x.lineWidth=1.5;x.beginPath();x.moveTo(cx-13,cy+6);x.lineTo(cx-6,cy+6);x.lineTo(cx-3,cy+11);x.moveTo(cx+13,cy+5);x.lineTo(cx+7,cy+5);x.lineTo(cx+5,cy+11);x.stroke();
  x.beginPath();x.roundRect(cx-14,ey-6,28,10,5);x.fillStyle='#03101f';x.fill();x.strokeStyle='#4ff3ff';x.lineWidth=1.5;x.stroke();
  if(o.hurt)xeyes('#ff5a5a');else{x.fillStyle='#9ffcff';for(const d of[-1,1])x.fillRect(cx+d*6-3+fx*1.5,ey-3+(o.win?1:0),6,o.win?2:3.5)}x.restore();
  for(const d of[-1,1])E(x,cx+d*16.5,cy-2,3,6,'#1d3a6e','#4ff3ff',1.5);
  L(x,cx+6,cy-15,cx+9,cy-24,'#4ff3ff',2);E(x,cx+9,cy-24,2.5,2.5,'#bffcff');
  if(Math.sin(t*9)>.2){x.save();x.shadowColor='#3ff';x.shadowBlur=8;x.strokeStyle='#e8ffff';x.lineWidth=1.5;x.beginPath();x.moveTo(cx+9,cy-24);x.lineTo(cx+13,cy-27);x.lineTo(cx+10,cy-29);x.lineTo(cx+15,cy-33);x.stroke();x.restore()}
  x.fillStyle='#03101f';for(let i=-1;i<=1;i++)x.fillRect(cx+i*4-1,cy+3,2,3)}
 else if(a=='pirate'){
  feet('#2a1a10');arms('#f1c39b');body();
  x.fillStyle='#2a1a10';x.fillRect(cx-15,cy+7,30,4);x.fillStyle='#ffd23f';x.fillRect(cx-3,cy+6,6,6);
  eyes(-1);E(x,cx+6,ey,5.5,5,'#111');L(x,cx-15,ey-8,cx+16,ey-1,'#111',1.5);
  E(x,cx-4,cy+3,4.5,1.8,'#4a2a10');E(x,cx+4,cy+3,4.5,1.8,'#4a2a10');
  x.strokeStyle=OL;x.lineWidth=2;x.beginPath();x.arc(cx,cy+5,3.5,.15*Math.PI,.85*Math.PI);x.stroke();
  P(x,[[cx-22,cy-11],[cx-13,cy-26],[cx,cy-22],[cx+13,cy-26],[cx+22,cy-11],[cx,cy-14]],'#1c1c24',OL,2);L(x,cx-18,cy-13,cx+18,cy-13,'#ffd23f',2);
  E(x,cx,cy-19,3.4,3,'#fff');E(x,cx-1.2,cy-19.5,.8,.8,'#111');E(x,cx+1.2,cy-19.5,.8,.8,'#111');L(x,cx-4,cy-15.5,cx+4,cy-15.5,'#fff',1.2);
  E(x,cx-16,cy+4,2,2,null,'#ffd23f',1.5)}
 else if(a=='viking'){
  feet('#4a3020');E(x,cx-20,cy+5,9,9,'#8b5a2b',OL,2);L(x,cx-29,cy+5,cx-11,cy+5,'#c0c6cf',1.5);L(x,cx-20,cy-4,cx-20,cy+14,'#c0c6cf',1.5);E(x,cx-20,cy+5,3,3,'#c0c6cf',OL,1.2);
  arms('#e0b48a');body();eyes();
  P(x,[[cx-12,cy+2],[cx+12,cy+2],[cx+8,cy+14],[cx+3,cy+20],[cx,cy+15],[cx-3,cy+20],[cx-8,cy+14]],'#e07b2a',OL,1.8);
  E(x,cx-4,cy+3,5,2.2,'#c45f1a');E(x,cx+4,cy+3,5,2.2,'#c45f1a');if(o.win)E(x,cx,cy+7,3,2,'#5a1a1a');
  for(const d of[-1,1]){x.beginPath();x.moveTo(cx+d*13,cy-11);x.quadraticCurveTo(cx+d*27,cy-15,cx+d*24,cy-30);x.quadraticCurveTo(cx+d*20,cy-17,cx+d*9,cy-15);x.closePath();x.fillStyle='#f3ead2';x.fill();x.strokeStyle=OL;x.lineWidth=1.8;x.stroke()}
  x.beginPath();x.arc(cx,cy-7,16,Math.PI,0);x.closePath();x.fillStyle='#9aa3ad';x.fill();x.strokeStyle=OL;x.lineWidth=2;x.stroke();
  x.fillStyle='#c0c6cf';x.fillRect(cx-16,cy-9,32,4);x.fillRect(cx-1.5,cy-9,3,7);for(const d of[-10,0,10])E(x,cx+d,cy-15,1.2,1.2,'#6b737d')}
 else if(a=='samurai'){
  L(x,cx-17,cy+15,cx+18,cy-23,'#e8eef5',3);L(x,cx-20,cy+18,cx-11,cy+9,'#3a1d0f',4.5);E(x,cx-11,cy+9,3,3,'#ffd23f',OL,1);
  feet('#1a1a1a');arms('#7a1a1a');body();
  for(let i=0;i<3;i++){x.beginPath();x.roundRect(cx-13+i*9,cy+4,8,9,2);x.fillStyle=shade(col,-.3);x.fill();x.strokeStyle='#ffd23f';x.lineWidth=1;x.stroke()}
  eyes();if(!o.hurt&&!o.win){L(x,cx-11,ey-8,cx-3,ey-6,OL,2.4);L(x,cx+11,ey-8,cx+3,ey-6,OL,2.4)}L(x,cx-3,cy+3,cx+3,cy+3,OL,2);
  x.beginPath();x.arc(cx,cy-7,15.5,Math.PI,0);x.closePath();x.fillStyle='#1f1f2a';x.fill();x.strokeStyle=OL;x.lineWidth=2;x.stroke();
  for(const d of[-1,1])P(x,[[cx+d*15,cy-9],[cx+d*22,cy-1],[cx+d*14,cy+1]],'#1f1f2a',OL,1.5);
  x.beginPath();x.arc(cx,cy-19,11,Math.PI*1.08,Math.PI*1.92);x.arc(cx,cy-15,9,Math.PI*1.85,Math.PI*1.15,true);x.closePath();x.fillStyle='#ffd23f';x.fill();x.strokeStyle=OL;x.lineWidth=1.2;x.stroke();
  E(x,cx,cy-21,2.5,2.5,'#ff3b3b',OL,1)}
 else if(a=='phase'){x.save();x.globalAlpha*=.85;const yy=cy+Math.sin(t*3)*1.5;arms('#d6dbff');
  x.beginPath();x.moveTo(cx-16,yy+11);x.lineTo(cx-16,yy-2);x.arc(cx,yy-2,16,Math.PI,0);x.lineTo(cx+16,yy+11);for(let i=0;i<4;i++)x.lineTo(cx+16-(i*2+1)*4,yy+(i%2?17:11)+Math.sin(t*10+i)*2);x.lineTo(cx-16,yy+11);x.closePath();
  const g2=x.createLinearGradient(cx,yy-18,cx,yy+18);g2.addColorStop(0,'#ffffff');g2.addColorStop(1,'#c9cfff');x.fillStyle=g2;x.fill();x.strokeStyle=OL;x.lineWidth=2.2;x.stroke();
  if(o.hurt)xeyes();else{const sq2=Math.sin(t*1.3+k)>.985?.2:1;for(const d of[-1,1]){E(x,cx+d*6,ey+(yy-cy),4,5.5*sq2,'#1a1838');E(x,cx+d*6-1+fx,ey+(yy-cy)-2+fy,1.3,1.6,'#fff')}}
  if(o.win)smile();else E(x,cx,yy+6,2.6,3.2,'#1a1838');E(x,cx-11,yy+3,2.6,1.6,'rgba(255,120,170,.45)');E(x,cx+11,yy+3,2.6,1.6,'rgba(255,120,170,.45)');x.restore()}
 else if(a=='toxic'){
  feet('#2a3a10');arms('#33421c');body();
  for(const[d,ph0]of[[-8,0],[2,.4],[9,.75]]){const ph=(t*.9+ph0)%1;E(x,cx+d,cy+12+ph*5,1.8+ph,2.4+ph*1.5,`rgba(122,209,42,${1-ph*.6})`)}
  P(x,[[cx,cy+3],[cx-6.5,cy+13],[cx+6.5,cy+13]],'#ffd23f',OL,1.2);E(x,cx,cy+10,1.4,1.4,OL);
  L(x,cx-16,ey-2,cx-11,ey-1,'#1d2a0a',2.5);L(x,cx+16,ey-2,cx+11,ey-1,'#1d2a0a',2.5);
  for(const d of[-1,1]){E(x,cx+d*6.5,ey-1,5.5,5,'#1d2a0a',OL,1.5);if(o.hurt){L(x,cx+d*6.5-2.5,ey-3.5,cx+d*6.5+2.5,ey+1.5,'#ff5a5a',2);L(x,cx+d*6.5+2.5,ey-3.5,cx+d*6.5-2.5,ey+1.5,'#ff5a5a',2)}else{x.save();x.shadowColor='#aaff50';x.shadowBlur=8;E(x,cx+d*6.5+fx,ey-1+fy,3.4,3.1,'rgba(180,255,90,.9)');x.restore()}}
  E(x,cx,cy+3,6,4.5,'#3a3a3a',OL,1.5);E(x,cx,cy+3,3,2,'#808080');
  for(let i=0;i<3;i++){const ph=(t*.8+i/3)%1;E(x,cx-8+i*8,cy-18-ph*12,1.5+ph*2,1.5+ph*2,`rgba(170,255,80,${.9*(1-ph)})`)}}
 else if(a=='mecha'){
  feet('#3a4250');arms('#5c6680');body();
  P(x,[[cx-12,cy+3],[cx+12,cy+3],[cx+8,cy+13],[cx-8,cy+13]],'#4a5468',OL,1.5);E(x,cx,cy+8,3,3,`rgba(255,80,60,${.6+.4*Math.sin(t*6)})`);
  for(const d of[-1,1]){x.beginPath();x.roundRect(cx+d*17-6,cy-4,12,10,3);x.fillStyle='#8d99b0';x.fill();x.strokeStyle=OL;x.lineWidth=1.8;x.stroke();x.fillStyle='#2a3038';x.fillRect(cx+d*17-2,cy-11,4,8)}
  P(x,[[cx-11,ey-7],[cx+11,ey-7],[cx+12,ey+2],[cx-12,ey+2]],'#2a3038',OL,1.5);
  if(o.hurt)xeyes('#ff5a5a');else{x.save();x.shadowColor='#f33';x.shadowBlur=10;E(x,cx+Math.sin(t*2)*7+fx*2,ey-3,o.win?5:3.5,o.win?2:3,'#ff3b3b');x.restore()}
  P(x,[[cx,cy-13],[cx-11,cy-24],[cx-3,cy-13]],'#ffd23f',OL,1.2);P(x,[[cx,cy-13],[cx+11,cy-24],[cx+3,cy-13]],'#ffd23f',OL,1.2)}
 else if(a=='fireman'){
  feet('#2a2a2a');arms('#3a3a3a');body();
  x.fillStyle='#eef4ff';x.fillRect(cx-15,cy+6,30,3);x.fillStyle='#c9ff3a';x.fillRect(cx-15,cy+9,30,2);
  eyes();smile();blush();
  E(x,cx,cy-8,21,4,'#b01e1e',OL,1.8);x.beginPath();x.arc(cx,cy-9,15,Math.PI,0);x.closePath();x.fillStyle='#d62828';x.fill();x.strokeStyle=OL;x.lineWidth=2;x.stroke();
  L(x,cx,cy-23,cx,cy-11,'#a01818',2.5);P(x,[[cx-4.5,cy-21],[cx+4.5,cy-21],[cx+5.5,cy-14],[cx,cy-10.5],[cx-5.5,cy-14]],'#ffd23f',OL,1.2)}
 else if(a=='alien'){
  feet();arms();
  x.beginPath();x.ellipse(cx,cy-1,16,17.5,0,0,7);x.fillStyle=g;x.fill();x.strokeStyle=OL;x.lineWidth=2.5;x.stroke();E(x,cx-6,cy-10,5,3.2,'rgba(255,255,255,.4)');
  for(const[u,v]of[[-10,7],[9,9],[11,-6]])E(x,cx+u,cy+v,1.6,1.6,shade(col,-.25));
  if(o.hurt)xeyes();else for(const d of[-1,1]){x.save();x.translate(cx+d*6.5,ey);x.rotate(d*.45);E(x,0,0,4.3,o.win?3:6.5,'#0b0b1a',OL,1.2);E(x,-1+fx,-2+fy,1.3,2,'#bff');x.restore()}
  if(o.win)smile(3);else L(x,cx-2.5,cy+8,cx+2.5,cy+8,OL,1.8);
  for(const d of[-1,1]){const ay=cy-28+Math.sin(t*4+d)*2;L(x,cx+d*5,cy-16,cx+d*10,ay,OL,2);x.save();x.shadowColor='#ff5ad9';x.shadowBlur=10;E(x,cx+d*10,ay-1,3,3,'#ff7ae0',OL,1.2);x.restore()}}
}
const _dc3=drawChar;drawChar=function(x,cx,cy,k,o){o=o||{};if(SK[k]&&NEWA.has(SK[k].a))drawNew(x,cx,cy,k,o);else _dc3(x,cx,cy,k,o)};
