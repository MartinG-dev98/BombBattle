/* [b2 · 332-335] */
let UNL=new Set(LSA('bbUnl'));const isUnl=k=>!!SK[k]&&(!SK[k].cost||UNL.has(k));
/* ECONOMY v2 one-time migration (flag bbEcoV2): every star purchase made before this version is locked again ONCE.
   Stars are not refunded. Runs once per device; anything unlocked afterwards is never touched again. */
let ECO_MIG=0;(function(){if(LS.get('bbEcoV2',0)===1)return;UNL=new Set();LS.set('bbUnl',[]);LS.set('bbBsUnl',[]);LS.set('bbEcoV2',1);ECO_MIG=1})();
/* [b3 · 1052-1054] */
let winSk=0,stars=+LS.get('bbStars',0)||0;
const _show=show;show=function(id,g){if(id=='matchEnd'){const ps=pl||[];winSk=winner>=0&&pl[winner]?pl[winner].sk:(ps[0]?ps[0].sk:0);let earn=0,why='';if(net.role=='guest')earn=Math.max(0,Math.min(ECO.max,net.earn|0));else{const r=ecoMatch();earn=r.n;why=r.why}earn=ecoDaily(earn);if(ecoHalf)why=why||'daily bonus used, half rate';stars+=earn;LS.set('bbStars',stars);const nx=SK.map((s,j)=>j).filter(j=>!isUnl(j)).sort((a,b)=>SK[a].cost-SK[b].cost)[0];$('rew').textContent='REWARD: +'+earn+' ★'+(why?' ('+why+')':'')+' · total '+stars+' ★'+(nx!=null?(stars>=SK[nx].cost?' · '+SK[nx].n+' can be unlocked!':' · next unlock: '+SK[nx].n+' '+SK[nx].cost+'★'):'')}_show(id,g);if(id=='main'||!id)$('stars').textContent='★ '+stars+' STARS';if(id=='skins'||id=='main')tn(520,.06,'triangle',.08)};
$('stars').textContent='★ '+stars+' STARS';
/* [b10 · 2295-2403] */
/* =====================================================================
   BOMB SKINS + STAR ECONOMY v2 (v6)
   - Bomb skins are cosmetic only: same hitbox, fuse time and blast. Draw-only.
   - Storage: bbBs = [local P1, local P2, guest choice], bbBsUnl = bought skins (like bbSet.sk / bbUnl).
   - Online: guests send {t:'bs',k,u:[their unlocked skins]}; the host validates it, stores o.bs per
     connection (next to o.sk), reads it at round setup (bsFor) and ships p.bs per player ("pb") and the
     skin of every bomb ("bk") in each snapshot so every device draws the right bombs.
   - Stars: per-player performance rewards (ecoP), no stars for very short or idle matches, daily soft cap.
   ===================================================================== */
const BS=[{n:'Classic',a:'classic',cost:0},{n:'Candy',a:'candy',cost:8},{n:'Pumpkin',a:'pumpkin',cost:12},{n:'Ice',a:'ice',cost:15},{n:'Neon',a:'neon',cost:20},{n:'Skull',a:'skull',cost:25},{n:'Golden',a:'gold',cost:40}];
let BUNL=new Set(LSA('bbBsUnl').filter(j=>BS[j]&&BS[j].cost));
const bsUnl=j=>Number.isInteger(j)&&!!BS[j]&&(!BS[j].cost||BUNL.has(j));
const bsV=j=>Number.isInteger(j)&&j>=0&&j<BS.length?j:0;
let BSS=(a=>[0,1,2].map(i=>Array.isArray(a)&&bsUnl(a[i])?a[i]:0))(LS.get('bbBs',[0,0,0]));
const bsSave=()=>LS.set('bbBs',BSS);
const myBs=()=>bsUnl(BSS[2])?BSS[2]:0;
function bsFor(i){if(net.role=='host'&&i>0){const o=net.conns.find(o=>o.slot==i&&o.c.open);return o?bsV(o.bs):0}return bsUnl(BSS[i])?BSS[i]:0}
function bSkin(b){if(b.s!=null)return bsV(b.s);const o=b.o||(b.sid!=null&&pl?pl[b.sid]:null);return o?bsV(o.bs):0}
function sendBs(){if(net.role=='guest'&&net.on())try{net.conn.send({t:'bs',k:myBs(),u:[...BUNL]})}catch(e){}}
/* guests also send which elite fighters they own so the host can refuse a locked pick */
sendSk=function(){if(net.role=='guest'&&net.on())try{net.conn.send({t:'sk',k:mySk(),u:[...UNL].filter(j=>SK[j]&&SK[j].cost)})}catch(e){}};
function bsBuy(j){if(bsUnl(j))return 1;const cs=BS[j].cost;if(stars>=cs){stars-=cs;LS.set('bbStars',stars);BUNL.add(j);LS.set('bbBsUnl',[...BUNL]);toast('Unlocked the '+BS[j].n+' bomb!');jingle(1);return 1}
 toast('Need '+(cs-stars)+' more ★ to unlock the '+BS[j].n+' bomb. Win and fight well to earn stars.');return 0}

/* ---------- drawing: one function per skin, flat fills in low-effects mode ---------- */
function bsDraw(x2,x,y,r,glow,blink,s,ro){const lo=LOWFX,k=BS[s].a;x2.save();x2.translate(x,y);if(ro)x2.rotate(ro);
 const grad=(a,b)=>{if(lo)return b;const g=x2.createRadialGradient(-r*.4,-r*.4,r*.1,0,0,r);g.addColorStop(0,a);g.addColorStop(1,b);return g};
 const glo=()=>{if(!lo){x2.shadowColor=blink?'#ff3b3b':glow;x2.shadowBlur=blink?22:10}};
 const ball=f=>{glo();x2.fillStyle=f;x2.beginPath();x2.arc(0,0,r,0,7);x2.fill();x2.shadowBlur=0;x2.strokeStyle=OL;x2.lineWidth=2;x2.stroke()};
 const shine=()=>{if(lo)return;x2.fillStyle='rgba(255,255,255,.45)';x2.beginPath();x2.ellipse(-r*.38,-r*.38,r*.25,r*.16,-.6,0,7);x2.fill()};
 const cap=f=>{x2.fillStyle=f||'#3a3d5c';x2.fillRect(-r*.3,-r*1.12,r*.6,r*.3)};
 let fz='#caa468',sp='#fff6a0',top=-r*1.1;
 if(k=='candy'){for(const d of[-1,1])P(x2,[[d*r*.8,0],[d*r*1.45,-r*.5],[d*r*1.45,r*.5]],'#ff7ac8',OL,1.5);ball(grad('#ffd6ec','#ff4fa8'));
  x2.strokeStyle='#fff';x2.lineWidth=Math.max(1.5,r*.16);x2.lineCap='round';for(let i=0;i<(lo?1:3);i++){x2.beginPath();x2.arc(0,0,r*(.3+i*.22),i*2.1,i*2.1+2.4);x2.stroke()}shine();fz='#fff';sp='#ff9ff3'}
 else if(k=='pumpkin'){glo();E(x2,0,0,r*1.08,r*.94,grad('#ffb347','#d9620f'),OL,2);x2.shadowBlur=0;
  if(!lo){E(x2,0,0,r*.42,r*.92,null,'rgba(120,50,0,.5)',1.5);E(x2,0,0,r*.78,r*.93,null,'rgba(120,50,0,.35)',1.2)}
  const fc=blink?'#ffe36a':'#3a1500';P(x2,[[-r*.55,-r*.02],[-r*.18,-r*.02],[-r*.36,-r*.36]],fc);P(x2,[[r*.55,-r*.02],[r*.18,-r*.02],[r*.36,-r*.36]],fc);
  P(x2,[[-r*.5,r*.22],[-r*.25,r*.42],[0,r*.26],[r*.25,r*.42],[r*.5,r*.22],[r*.25,r*.58],[-r*.25,r*.58]],fc);
  x2.fillStyle='#3f7d2a';x2.fillRect(-r*.13,-r*1.18,r*.26,r*.34);fz='#6b9a3a';top=-r*1.16}
 else if(k=='ice'){ball(grad('#f2fbff','#4fa9e0'));if(!lo){L(x2,-r*.15,-r*.7,r*.25,r*.1,'rgba(255,255,255,.75)',1.5);L(x2,r*.25,r*.1,r*.05,r*.65,'rgba(255,255,255,.6)',1.2);L(x2,r*.25,r*.1,r*.7,r*.25,'rgba(255,255,255,.6)',1.2)}
  P(x2,[[0,-r*1.5],[r*.22,-r*1.05],[0,-r*.85],[-r*.22,-r*1.05]],'#dff6ff',OL,1.5);shine();fz='#bfe6ff';sp='#8be9ff';top=-r*1.25}
 else if(k=='neon'){ball(grad('#2c2c66','#07071a'));const pu=.5+.5*Math.sin(tm*8);
  x2.strokeStyle='#00f0ff';x2.lineWidth=Math.max(1.5,r*.13);if(!lo){x2.shadowColor='#00f0ff';x2.shadowBlur=8}x2.beginPath();x2.arc(0,0,r*.6,0,7);x2.stroke();
  for(const[a,b]of[[1,0],[-1,0],[0,1]]){x2.beginPath();x2.moveTo(a*r*.6,b*r*.6);x2.lineTo(a*r*.92,b*r*.92);x2.stroke()}x2.shadowBlur=0;
  E(x2,0,0,r*(.2+.06*pu),r*(.2+.06*pu),blink?'#fff':'#ff2bd6');cap('#1e1e5a');fz='#7a7ab0';sp='#ff2bd6'}
 else if(k=='skull'){ball(grad('#ffffff','#b9b2a2'));const ec=blink?'#ff3b3b':'#2a1f2f';E(x2,-r*.36,-r*.1,r*.24,r*.28,ec);E(x2,r*.36,-r*.1,r*.24,r*.28,ec);
  P(x2,[[0,r*.12],[-r*.1,r*.32],[r*.1,r*.32]],'#2a1f2f');x2.fillStyle='#2a1f2f';x2.fillRect(-r*.4,r*.45,r*.8,r*.08);if(!lo)for(const d of[-.2,0,.2])x2.fillRect(r*d-r*.025,r*.4,r*.05,r*.22);
  cap('#6a5f55');fz='#8a7a6a';sp='#b6ff6a'}
 else if(k=='gold'){ball(grad('#fff3a8','#c28a12'));star(x2,0,r*.06,r*.44,'#ffe14a');shine();
  if(!lo){const a=tm*3,tx=r*.55,ty=-r*.55,q=r*(.18+.1*Math.sin(tm*6));x2.fillStyle='#fff';x2.beginPath();x2.moveTo(tx,ty-q);x2.lineTo(tx+q*.25,ty);x2.lineTo(tx,ty+q);x2.lineTo(tx-q*.25,ty);x2.closePath();x2.fill();x2.beginPath();x2.moveTo(tx-q,ty);x2.lineTo(tx,ty+q*.25);x2.lineTo(tx+q,ty);x2.lineTo(tx,ty-q*.25);x2.closePath();x2.fill()}
  cap('#8a6a10');fz='#e8c060';sp='#ffffff'}
 /* pulse / flash before the blast */
 if(blink){x2.fillStyle='rgba(255,50,50,.45)';x2.beginPath();if(k=='pumpkin')x2.ellipse(0,0,r*1.08,r*.94,0,0,7);else x2.arc(0,0,r,0,7);x2.fill()}
 /* fuse + spark */
 x2.strokeStyle=fz;x2.lineWidth=Math.max(2,r*.12);x2.lineCap='round';x2.beginPath();x2.moveTo(0,top);x2.quadraticCurveTo(r*.5,top-r*.5,r*.9,top-r*.2);x2.stroke();
 const sc=R()<.5?sp:'#ff8a3d',sz=r*(.25+.12*R());if(lo){E(x2,r*.9,top-r*.2,sz,sz,sc)}else{x2.shadowColor='#ffb020';x2.shadowBlur=12;star(x2,r*.9,top-r*.2,sz*1.4,sc)}
 x2.restore()}
/* classic (index 0) keeps the original drawing; the menu background never passes a skin */
const _bombBS=bomb;bomb=function(x2,x,y,r,glow,blink,s,ro){if(!s||!BS[s])return _bombBS(x2,x,y,r,glow,blink);bsDraw(x2,x,y,r,glow,blink,s,ro||0)};

/* ---------- pickers ---------- */
function bsHTML(p){const cur=p==2?myBs():bsFor(p);return`<div class="gl">BOMB SKIN · ${esc(BS[cur].n.toUpperCase())} · unlock with ★ stars</div><div class="grid">`+BS.map((q,j)=>`<div class="chip bchip${cur==j?' sel':''}${bsUnl(j)?'':' lock'}" data-bp="${p}" data-b="${j}" title="${q.n} bomb${bsUnl(j)?'':' (locked)'}"><canvas class="bpv" data-b="${j}" width="48" height="48"></canvas>${bsUnl(j)?q.n:'🔒'+q.cost+'★'}</div>`).join('')+'</div>'}
const _skUIBS=skUI;skUI=function(){const r=_skUIBS.apply(this,arguments);const n=curNP();for(let i=0;i<Math.min(n,4);i++){const box=$('sk'+i);if(!box||box.style.display=='none')continue;
  if(net.role=='host'&&i>0)box.insertAdjacentHTML('beforeend',`<div class="ps">Bomb skin: <b>${esc(BS[bsFor(i)].n)}</b> (picked on their device)</div>`);else if(i<2)box.insertAdjacentHTML('beforeend',bsHTML(i))}return r};
const _skOnBS=$('skins').onclick;$('skins').onclick=function(e){const b=e.target.closest('.bchip');if(!b)return _skOnBS.call(this,e);
 const p=+b.dataset.bp,j=+b.dataset.b;if(!(p===0||p===1)||!BS[j]||(net.role=='host'&&p>0)||net.role=='guest')return;if(!bsBuy(j))return;
 BSS[p]=j;bsSave();skUI();tn(880,.08,'triangle',.18);tn(1320,.12,'triangle',.15,0,.06)};
const _wskBS=wskUI;wskUI=function(){const r=_wskBS.apply(this,arguments);const box=$('wsk');if(box&&net.role=='guest')box.insertAdjacentHTML('beforeend',bsHTML(2));return r};
const _waitBS=$('wait').onclick;$('wait').onclick=function(e){const b=e.target.closest('.bchip');if(!b)return _waitBS.call(this,e);if(net.role!='guest')return;
 if(net.my){toast('You are ready. Tap READY ✓ to unlock and change your bomb.');return}const j=+b.dataset.b;if(!BS[j]||!bsBuy(j))return;
 BSS[2]=j;bsSave();sendBs();wskUI();tn(880,.08,'triangle',.18);tn(1320,.12,'triangle',.15,0,.06)};
const _roleBS=roleUI;roleUI=function(){const r=_roleBS.apply(this,arguments);sendBs();return r};
const _trBS=toggleReady;toggleReady=function(){if(net.role=='guest'&&!net.my&&net.on()){if(!bsUnl(BSS[2])){BSS[2]=0;bsSave()}sendBs()}return _trBS.apply(this,arguments)};
function bsPrev(){const on=id=>{const e=$(id);return e&&e.classList.contains('on')};
 if(on('skins')||on('wait'))document.querySelectorAll('canvas.bpv').forEach(cc=>{const x=cc.getContext('2d'),w=cc.width;x.clearRect(0,0,w,w);bomb(x,w*.44,w*.6,w*.29,'#ff6a3d',false,+cc.dataset.b|0,0)});
 requestAnimationFrame(bsPrev)}
requestAnimationFrame(bsPrev);

/* ---------- network: host validates, stores per connection, ships per player + per bomb ---------- */
const _odhBS=onDataH;onDataH=function(o,m){
 if(m&&m.t=='bs'){if(net.role!='host'||!net.conns.includes(o)||!o.c.open)return;const k=m.k;if(!Number.isInteger(k)||k<0||k>=BS.length)return;
  const v=BS[k].cost&&!(Array.isArray(m.u)&&m.u.includes(k))?0:k;if(o.rdy===true&&Number.isInteger(o.bs)&&v!==o.bs)return;
  o.bs=v;if($('skins').classList.contains('on'))skUI();return}
 if(m&&m.t=='sk'&&Number.isInteger(m.k)&&SK[m.k]&&SK[m.k].cost&&!(Array.isArray(m.u)&&m.u.includes(m.k)))m={t:'sk',k:SKD[o.slot]??SKD[1]};
 return _odhBS.call(this,o,m)};
const _nrBS=newRound;newRound=function(){const r=_nrBS.apply(this,arguments);if(pl)pl.forEach((p,i)=>p.bs=bsFor(i));return r};
const _snapBS=snap;snap=function(){const o=_snapBS();o.pb=pl.map(p=>bsV(p.bs));o.bk=bombs.map(bSkin);return o};
const _applySnapBS=applySnap;applySnap=function(m){const q0=net.sqr;const r=_applySnapBS(m);if(net.sqr!==m.q||q0===m.q)return r;
 if(pl)pl.forEach((p,i)=>p.bs=bsV(m.pb&&m.pb[i]));bombs.forEach((b,i)=>b.s=bsV(m.bk&&m.bk[i]));return r};

/* ---------- STAR ECONOMY v2 ---------- */
const ECO={max:15,minT:45,day:50};let ecoT=0,ecoHalf=0;
const _startECO=start;start=function(){if(net.role!='guest')ecoT=0;return _startECO.apply(this,arguments)};
const _updECO=update;update=function(dt){if(st=='play')ecoT+=dt;return _updECO.apply(this,arguments)};
/* knockouts: credit the attacker when a hit eliminates a rival */
const _hurtECO=hurt;hurt=function(p,force,by,dmg,kd){const a=p&&p.alive;const r=_hurtECO.apply(this,arguments);if(a&&!p.alive&&by>=0&&by!=p.id&&ST[by])ST[by].ko=(ST[by].ko|0)+1;return r};
function ecoP(i){const p=pl&&pl[i],q=ST[i]||{};if(!p||p.off)return 0;if(ecoT<ECO.minT)return 0;if(!(q.dmg>0||q.sl>0||q.pu>0||q.cr>0))return 0;let n;
 if(S.mode>=5){n=coopWon?(S.mode==6?10:6):1;if(coopWon&&p.alive)n++;n+=Math.min(3,(q.sl|0)/5|0)}
 else if(pl[1]&&pl[1].off)n=1+Math.min(5,ecoT/60|0);
 else{const won=winner==i;n=won?4:1;if(!won)n+=Math.min(2,wins[i]|0);n+=Math.min(3,q.ko|0)+Math.min(2,(q.dmg|0)/100|0)+Math.min(2,(q.sl|0)/5|0)}
 return Math.max(0,Math.min(ECO.max,n|0))}
function ecoMatch(){const a=[0,1,2,3].map(ecoP);net.earnA=a;const n=net.role=='host'||NPL<2?a[0]:Math.max(a[0],a[1]);net.earn=n;
 const why=ecoT<ECO.minT?'match under '+ECO.minT+'s, no stars':n==0?'no action, no stars':'';return{n,why}}
/* daily soft cap on this device: full rate for the first ECO.day stars of the day, half rate after */
function ecoDaily(n){ecoHalf=0;if(!(n>0))return 0;const d=new Date().toDateString();let o=LS.get('bbEcoDay',null);if(!o||typeof o!='object'||o.d!==d||!(o.n>=0))o={d,n:0};
 const full=Math.max(0,ECO.day-o.n);let out=n;if(n>full){out=full+((n-full)>>1);ecoHalf=1}o.n+=n;LS.set('bbEcoDay',o);return out}
const _renderProfBS=renderProf;renderProf=function(){_renderProfBS();$('pStats').insertAdjacentHTML('beforeend',`<span>Bomb skins unlocked</span><b>${BS.filter((q,j)=>bsUnl(j)).length} / ${BS.length}</b>`)};
