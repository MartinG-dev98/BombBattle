/* [b2 · 386-386] */
const net={role:null,peer:null,conn:null,conns:[],slot:0,np:2,code:'',seq:0,sqr:0,iq:0,iqr:0,rid:0,grd:-1,gst:null,ls:0,lastIn:0,nb:0,ns:0,nm:0,earn:0,rk:{l:0,r:0,u:0,d:0,b:0},on(){return this.role=='host'?this.conns.some(o=>o.c.open):!!(this.conn&&this.conn.open)},guests(){return this.conns.filter(o=>o.c.open).length}};
/* [b2 · 442-442] */
setInterval(()=>{if(net.role=='host'&&$('net').classList.contains('on'))netUI()},1000);
/* [b2 · 445-445] */
function curNP(){return net.role=='host'?Math.max(2,1+net.guests()):net.role=='guest'?net.np||2:S.np}
/* [b5 · 1620-1799] */
/* ================= ONLINE PLAY (PeerJS, host-authoritative, 2-4 players) =================
   Host  (ALPHA): runs the whole simulation. Up to three guests connect to it (BETA, GAMMA, DELTA).
                  Each guest gets a slot 1-3; its inputs arrive over WebRTC and drive player[slot]
                  through that slot's key map (CT[slot]). Slots are packed 1..n at every match start.
   Guests       : send their own inputs (~30 Hz on change + 10 Hz heartbeat) and render ~30 Hz state
                  snapshots from the host with smoothing. Every guest keeps its own local touch pad /
                  keyboard controls no matter what kind of device the host is.
   3-4 player battles are online only; local play stays 1-2 players. */
const PRE='bombbattle-',CH='ABCDEFGHJKMNPQRSTUVWXYZ23456789',f2=v=>Math.round(v*100)/100;
let evq=[],evb=[],toastT=0;
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2800)}
const nstat=m=>{$('nst').textContent=m},noPeer='Online play needs the PeerJS library, which did not load. Reload the page and try again.';

function setRoom(n){if(net.role=='host'&&1+net.conns.length>n){toast((1+net.conns.length)+' players are already in the room.');return}S.room=n;saveS();netUI();sel()}
function netUI(){document.querySelectorAll('#roomSeg button').forEach(b=>b.classList.toggle('on',+b.dataset.n==S.room));const h=$('roomHint');if(h)h.textContent='Room size: up to '+S.room+' players';
 const sl=$('slots'),hr=$('hrost'),why=$('rdyWhy'),sb=$('startBtn'),host=net.role=='host',w=host&&typeof rdyWhy=='function'?rdyWhy():'';
 if(sb){sb.classList.toggle('off',!!w);sb.setAttribute('aria-disabled',w?'true':'false')}if(why){why.textContent=w;why.style.display=w?'':'none'}
 if(!host){if(sl){sl.innerHTML='';sl._h=''}if(hr){hr.innerHTML='';hr._h='';hr.style.display='none'}return}let s='';
 const NN=netNames();for(let i=0;i<S.room;i++){const o=i?net.conns.find(o=>o.slot==i&&o.c.open):null,ok=i==0||!!o,f=ok&&SK[skFor(i)]?SK[skFor(i)].n:'',lb=i==0?'YOU (HOST)':!ok?'waiting…':o.rdy?'READY ✓':'NOT READY',cl=i==0?'ok':!ok?'wt':o.rdy?'ok':'nr';s+=`<div><b style="color:${PCOL[i]}">${ok?esc(NN[i])+'<small>'+PNAME[i]+'</small>':PNAME[i]}</b><span class="${cl}">${lb}${f?'<i>'+esc(f)+'</i>':''}</span></div>`}
 if(net.guests())s+=`<div class="rsum ${w?'nr':'ok'}">${w?esc(w):'EVERYONE IS READY ✓'}</div>`;
 if(sl&&sl._h!=s){sl._h=s;sl.innerHTML=s}if(hr){hr.style.display='';if(hr._h!=s){hr._h=s;hr.innerHTML=s}}}
function skFor(i){if(net.role=='host'&&i>0){const o=net.conns.find(o=>o.slot==i&&o.c.open);return o&&Number.isInteger(o.sk)&&SK[o.sk]?o.sk:SKD[i]}return S.sk[i]??SKD[i]}
function mySk(){const j=S.gk;return j>=0&&SK[j]&&isUnl(j)?j:(SKD[net.slot]??SKD[1])}
function sendSk(){if(net.role=='guest'&&net.on())try{net.conn.send({t:'sk',k:mySk()})}catch(e){}}
function wskUI(){const box=$('wsk');if(!box)return;if(net.role!='guest'){box.innerHTML='';box.style.display='none';return}box.style.display='';
 const i=net.slot||1,k=mySk(),s=SK[k],ab=abOf(k);
 box.innerHTML=`<div class='top'><canvas class='pv big' data-k='${k}' width='120' height='120'></canvas><div><div class='pn' style='color:${PCOL[i]}'>CHOOSE YOUR FIGHTER</div><div class='cn'>${s.n}</div><div class='ab'>${ab.n} · ${ab.cd}s cooldown<br>${ab.d}</div><div class='ps'>★ ${stars} stars · used from the next round</div></div></div>`+GROUPS.map(g=>`<div class='gl'>${g}${g=='Elite'?' · unlock with ★ stars':''}</div><div class='grid'>`+SK.map((q,j)=>q.g==g?`<div class='chip${k==j?' sel':''}${isUnl(j)?'':' lock'}' data-j='${j}' title='${q.n}${isUnl(j)?'':' (locked)'}'><canvas class='pv' data-k='${j}' width='48' height='48'></canvas>${isUnl(j)?q.n:'🔒'+q.cost+'★'}</div>`:'').join('')+'</div>').join('')}
$('wait').onclick=e=>{const b=e.target.closest('.chip');if(!b||net.role!='guest')return;const j=+b.dataset.j;
 if(!isUnl(j)){const cost=SK[j].cost;if(stars>=cost){stars-=cost;LS.set('bbStars',stars);UNL.add(j);LS.set('bbUnl',[...UNL]);toast('Unlocked '+SK[j].n+'!');jingle(1)}else{toast('Need '+(cost-stars)+' more ★ to unlock '+SK[j].n+'.');return}}
 S.gk=j;saveS();sendSk();wskUI();tn(880,.08,'triangle',.18);tn(1320,.12,'triangle',.15,0,.06)};
function roleUI(){const r=$('myRole');if(r){r.textContent=netNames()[net.slot||1]||'BETA';r.className='role '+'abcd'[net.slot||1]}const ri=$('roomInfo');if(ri)ri.textContent=net.room?'This room holds up to '+net.room+' players.':'';wskUI();sendSk()}

function hostGame(){if(typeof Peer=='undefined')return nstat(noPeer);leaveNet(1);net.role='host';net.slot=0;$('code').textContent='…';nstat('Creating room…');mkRoom(0);netUI()}
function freeSlot(){for(let i=1;i<4;i++)if(!net.conns.some(o=>o.slot==i))return i;return 3}
function mkRoom(tries){const code=Array.from({length:4},()=>CH[R()*CH.length|0]).join(''),peer=new Peer(PRE+code);net.peer=peer;
 peer.on('open',()=>{if(net.peer!=peer)return;net.code=code;$('code').textContent=code;nstat('Tell your friends this code (up to '+(S.room-1)+' can join), then wait for them.');sel()});
 peer.on('connection',c=>{if(net.peer!=peer)return;
  if(1+net.conns.length>=S.room){c.on('open',()=>{try{c.send({t:'full'})}catch(e){}setTimeout(()=>{try{c.close()}catch(e){}},400)});return}
  const o={c,slot:freeSlot(),rk:{},nb:0,ns:0,nm:0,iqr:0,lastIn:performance.now()};net.conns.push(o);wireH(o);
  /* a join that never finishes must not keep its seat reserved */
  setTimeout(()=>{if(net.conns.includes(o)&&!o.c.open){net.conns.splice(net.conns.indexOf(o),1);try{o.c.close()}catch(e){}netUI()}},15000)});
 peer.on('error',e=>{if(net.peer!=peer)return;if(e.type=='unavailable-id'&&tries<5){try{peer.destroy()}catch(x){}mkRoom(tries+1)}else if(e.type!='peer-unavailable')nstat('Connection problem ('+e.type+'). Check your internet and try again.')});
 peer.on('disconnected',()=>{if(net.peer==peer&&!peer.destroyed)try{peer.reconnect()}catch(x){}})}
function sendSlot(o){try{o.c.send({t:'slot',i:o.slot,n:S.room})}catch(e){}}
function wireH(o){const c=o.c;
 c.on('open',()=>{if(!net.conns.includes(o))return;o.nb=o.ns=o.nm=0;o.iqr=0;o.gS='';o.gF=1;o.evs=null;o.lastIn=performance.now();o.rk={};sendSlot(o);$('goBtn').style.display='';
  nstat((1+net.guests())+' / '+S.room+' players in the room. Pick a map and start whenever you are ready.');setTimeout(()=>{if(!o.pn&&net.conns.includes(o)&&o.c.open)toast(PNAME[o.slot]+' joined')},2500);
  if(st!='menu'&&!(pl&&pl[o.slot]&&!pl[o.slot].off))try{c.send({t:'msg',m:'Match in progress. You will play from the next match the host starts.'})}catch(e){}
  sel()});
 c.on('data',m=>onDataH(o,m));c.on('close',()=>goneH(o));c.on('error',()=>goneH(o))}
/* pack open guests into slots 1..n (in join order) so the match has no empty seats; tell each guest its seat */
function compactSlots(){for(let i=1;i<4;i++)for(const a of ACTS)delete K[CT[i][a]];
 const op=net.conns.filter(o=>o.c.open).sort((a,b)=>a.slot-b.slot);let i=1;for(const o of op){if(o.slot!=i){o.slot=i;o.rk={}}i++;sendSlot(o)}
 for(const o of net.conns)if(!o.c.open)o.slot=i++;netUI();sendNames()}
function goneH(o){const i=net.conns.indexOf(o);if(i<0)return;net.conns.splice(i,1);for(const a of ACTS)delete K[CT[o.slot][a]];
 toast((o.pn||PNAME[o.slot])+' disconnected');sendNames();if(!net.guests())$('goBtn').style.display='none';
 nstat(net.guests()?(1+net.guests())+' / '+S.room+' players in the room.':'Everyone left. Share the code again so friends can rejoin.');sel();
 if(['play','count','over'].includes(st)&&pl&&pl[o.slot]&&!pl[o.slot].off)pause()}
function onDataH(o,m){if(!m||!m.t)return;
 if(m.t=='in'){if(m.q<=o.iqr)return;const first=!o.iqr;o.iqr=m.q;o.lastIn=performance.now();const k=m.k||{},ok=o.rk,p=pl&&pl[o.slot],cc=CT[o.slot];
  if(p){if((k.l&&!ok.l)||(k.r&&!ok.r))p.ax='x';if((k.u&&!ok.u)||(k.d&&!ok.d))p.ax='y'}
  if(first){o.nb=m.n[0];o.ns=m.n[1];o.nm=m.n[2]}
  if(m.n[0]!=o.nb){o.nb=m.n[0];tap[cc.b]=1}if(m.n[1]!=o.ns){o.ns=m.n[1];tap[cc.s]=1}if(m.n[2]!=o.nm){o.nm=m.n[2];tap[cc.m]=1}
  o.rk=k}
 else if(m.t=='sk'){if(Number.isInteger(m.k)&&SK[m.k]){o.sk=m.k;if($('skins').classList.contains('on'))skUI()}}
 else if(m.t=='hi'){sendSlot(o);sendNames(o)}
 else if(m.t=='nm'){const nw=performance.now();if(nw-(o.nmT||0)<300)return;o.nmT=nw;const v=validateName(m.n),first=!o.pn;o.pn=v.ok?v.name:'';sendNames();refreshNames();netUI();if(first&&o.pn)toast(netNames()[o.slot]+' joined')}
 else if(m.t=='gr')o.gF=1
 else if(m.t=='cmd'&&m.c=='start'&&st=='match')start()}

function joinGame(){const code=$('jc').value.trim().toUpperCase();if(code.length!=4)return nstat('Enter the 4-letter room code.');if(typeof Peer=='undefined')return nstat(noPeer);
 leaveNet(1);net.role='guest';net.slot=1;nstat('Connecting…');const peer=new Peer();net.peer=peer;
 const fail=m=>{if(net.peer!=peer)return;nstat(m);leaveNet(1)};
 peer.on('open',()=>{if(net.peer!=peer)return;const c=peer.connect(PRE+code,{serialization:'json'});net.conn=c;
  c.on('open',()=>{if(net.conn!=c)return;net.sqr=0;net.iq=0;net.gst=null;net.grd=-1;net.ps=null;net.gG=net.gQ=null;c.send({t:'hi'});sendMyName();roleUI();show('wait');toast('Connected to host')});
  c.on('data',onDataG);c.on('close',()=>{if(net.conn==c)goneG()});c.on('error',()=>{if(net.conn==c)goneG()})});
 peer.on('error',e=>fail(e.type=='peer-unavailable'?'No game found with that code.':'Connection problem ('+e.type+').'));
 setTimeout(()=>{if(net.role=='guest'&&net.peer==peer&&!net.on())fail('Could not connect. Check the code and that both devices are online.')},12000)}
function goneG(){if(net.role!='guest')return;toast(net.full?'That room is full.':'Host disconnected');const f=net.full;net.full=0;leaveNet(f?1:0);if(f){show('net');nstat('That room is full. Ask the host for a bigger room or wait for a free seat.')}}
function onDataG(m){if(!m||!m.t)return;
 if(m.t=='s'){queueSnap(m);return}
 flushSnap();
 if(m.t=='menu'&&net.gst!='menu'){net.gst='menu';st='menu';show('wait')}
 else if(m.t=='slot'){net.slot=m.i;net.room=m.n;roleUI()}
 else if(m.t=='full'){net.full=1}
 else if(m.t=='names')applyNamesG(m.a);
 else if(m.t=='msg')toast(m.m)}
function leaveNet(silent){const p=net.peer,cs=net.conns;net.names=null;net.ps=null;net.role=null;net.peer=null;net.conn=null;net.conns=[];net.slot=0;net.gst=null;net.code='';$('code').textContent='';$('goBtn').style.display='none';
 for(const a of ACTS)VI[a]=0;for(let i=1;i<4;i++)for(const a of ACTS)delete K[CT[i][a]];for(const o of cs)try{o.c.close()}catch(e){}if(p)try{p.destroy()}catch(e){}netUI();wskUI();if(silent)sel();else show('main')}
function applyRemote(){if(net.role!='host')return;const now=performance.now();for(const o of net.conns){if(!o.c.open||!CT[o.slot])continue;const cc=CT[o.slot],k=now-o.lastIn>700?{}:o.rk;for(const a of['l','r','u','d','b']){if(k[a])K[cc[a]]=1;else delete K[cc[a]]}}}
function sendIn(){if(!net.on())return;try{net.conn.send({t:'in',q:++net.iq,k:{l:VI.l,r:VI.r,u:VI.u,d:VI.d,b:VI.b},n:[VN.b,VN.s,VN.m]})}catch(e){}}

/* ---- host: build a snapshot (extended with HP, ability states, warnings, toxic puddles, missiles, damage events, FX) ---- */
function fxNew(){const out=[];for(const f of fxl){if(f._s)continue;f._s=1;if(out.length<30){const o={};for(const k in f)if(k!='_s')o[k]=typeof f[k]=='number'?f2(f[k]):f[k];out.push(o)}}return out}
function snap(){const o={t:'s',v:2,q:++net.seq,st,rd:net.rid,el:f2(el),cdn:f2(cdn),w:winner,ws:wins,r:round,mp:CM,md:S.mode,np:NPL,dw:[W,H],wv,cw:coopWon,fz:f2(frzT),sh:f2(shk),bi:f2(bossIntro),
 G:G.map(r=>r.join('')).join(''),sq:sq.map(r=>r.join('')).join(''),
 p:pl.map(p=>[f2(p.x),f2(p.y),f2(p.vx),f2(p.vy),Math.round(p.hp),p.maxB,p.rng,p.spd,p.shield,f2(p.ghost),p.mega,f2(p.remote),f2(p.inv),p.fx,p.fy,f2(p.cd),p.cdm||4,f2(p.throwT),f2(p.fz),p.alive?0:f2(Math.min(99,tm-p.dtm)),p.alive?1:0,p.sk,f2(p.ivT),f2(p.phT),f2(p.fsT),f2(p.pry),f2(p.vkT),f2(p.rv),p.off?1:0,f2(p.hf),f2(p.slow||0),f2(p.gT||0)]),
 b:bombs.map(b=>[b.x,b.y,f2(b.t),b.mega?1:0,b.rem?1:0,b.dx,b.dy,f2(b.k),b.bn!=null?1:0]),
 f:fires.map(x=>[x.x,x.y,f2(x.t),x.m?1:0,x.l||0]),
 i:items.map(i=>[i.x,i.y,i.k,f2(i.age)]),
 e:en.map(e=>[f2(e.x),f2(e.y),e.hp,e.mh,e.t,f2(e.hit),f2(e.sl),e.fx,e.fy,f2(e.st||0),e.bk||'',e.ph||1,f2(e.atk||0),f2(e.vt||0)]),
 l:lava.map(l=>[l.x,l.y,f2(l.t),l.k||0,f2(l.ml||1.3)]),m:met.map(l=>[l.x,l.y,f2(l.t),l.k||0]),hz:mh.map(h=>[h.x,h.y,f2(h.t),h.ml,h.k]),c:cl.map(l=>[l.x,l.y,f2(l.t)]),
 wn:ws.map(w=>[w.x,w.y,w.t,f2(w.d),w.md]),tx:tox.map(t=>[t.x,t.y,f2(t.t),t.o]),ms:msl.map(m=>[f2(m.x),f2(m.y),f2(m.vx),f2(m.vy)]),
 x:txt.map(t=>[f2(t.x),f2(t.y),f2(t.t),t.s,t.c]),ev:evq,eb:evb,dm:dmq,fx:fxNew()};
 if(st=='match')o.me=[$('mt').textContent,$('ms').textContent,$('mt').style.color,$('stt').innerHTML,net.earnA||[0,0,0,0]];
 evq=[];evb=[];dmq=[];return o}

/* ---- guest: apply a snapshot ---- */
function applySnap(m){if(m.q<=net.sqr)return;net.sqr=m.q;const nr=m.rd!=net.grd;net.grd=m.rd;const np0=NPL;NPL=net.np=m.np||2;
 if(m.dw&&(m.dw[0]!=W||m.dw[1]!=H||NPL!=np0))setDims(m.dw[0],m.dw[1]);
 st=m.st;el=m.el;cdn=m.cdn;winner=m.w;wins=m.ws;round=m.r;wv=m.wv;coopWon=m.cw;frzT=m.fz;shk=Math.max(shk,m.sh);bossIntro=m.bi||0;
 if(CM!=m.mp||nr){CM=m.mp;mkAmb()}S.mode=m.md;
 const bad=A=>!A||A.length!=H||!A[0]||A[0].length!=W;
 if(m.G!=null){if(m.G!==net.gG||bad(G)){G=gridIn(G,m.G);net.gG=m.G}if(m.sq!==net.gQ||bad(sq)){sq=gridIn(sq,m.sq);net.gQ=m.sq}}
 else if(bad(G)||bad(sq)){const nw=performance.now();if(nw-(net.grq||0)>400&&net.on()){net.grq=nw;try{net.conn.send({t:'gr'})}catch(e){}}}
 if(nr||!pl||pl.length!=m.p.length){pl=m.p.map((a,i)=>({id:i,x:a[0],y:a[1],tx:a[0],ty:a[1],anim:0,hd:a[4],hv:a[4],c:PCOL[i],n:pname(i)}));pts=[];dmgs=[];fxl=[]}
 m.p.forEach((a,i)=>{const p=pl[i];p.tx=a[0];p.ty=a[1];if(Math.hypot(p.tx-p.x,p.ty-p.y)>1.2){p.x=p.tx;p.y=p.ty}p.vx=a[2];p.vy=a[3];p.hp=a[4];p.maxB=a[5];p.rng=a[6];p.spd=a[7];p.shield=a[8];p.ghost=a[9];p.mega=a[10];p.remote=a[11];p.inv=a[12];p.fx=a[13];p.fy=a[14];p.cd=a[15];p.cdm=a[16];p.throwT=a[17];p.fz=a[18];p.dtm=tm-a[19];p.alive=a[20];p.sk=a[21];
  p.ivT=a[22];p.phT=a[23];p.fsT=a[24];p.pry=a[25];p.vkT=a[26];p.rv=a[27];p.off=a[28];if(a[29]>.05)p.hf=Math.max(p.hf||0,a[29]);p.slow=a[30];p.gT=a[31]});
 bombs=rl(bombs,m.b,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.mega=a[3],o.rem=a[4],o.dx=a[5],o.dy=a[6],o.k=a[7],o.bn=a[8]?1:undefined,o));
 fires=rl(fires,m.f,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.m=a[3],o.l=a[4],o));
 items=rl(items,m.i,(o,a)=>(o.x=a[0],o.y=a[1],o.k=a[2],o.age=a[3],o));
 const old=en;en=m.e.map((a,i)=>{const o=old[i],e=(o&&o.t==a[4]&&Math.hypot(o.x-a[0],o.y-a[1])<1.5)?o:{x:a[0],y:a[1]};e.tx=a[0];e.ty=a[1];e.hp=a[2];e.mh=a[3];e.t=a[4];e.hit=a[5];e.sl=a[6];e.fx=a[7];e.fy=a[8];e.st=a[9];e.bk=a[10]||undefined;e.ph=a[11];e.atk=a[12];e.vt=a[13];return e});
 lava=rl(lava,m.l,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.k=a[3]|0,o.ml=a[4]||1.3,o));met=rl(met,m.m,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.k=a[3]|0,o));mh=rl(mh,m.hz,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.ml=a[3],o.k=a[4],o));cl=rl(cl,m.c,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o));
 ws=rl(ws,m.wn,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.d=a[3],o.md=a[4],o));tox=rl(tox,m.tx,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.o=a[3],o));msl=rl(msl,m.ms,(o,a)=>(o.x=a[0],o.y=a[1],o.vx=a[2],o.vy=a[3],o));
 txt=rl(txt,m.x,(o,a)=>(o.x=a[0],o.y=a[1],o.t=a[2],o.s=a[3],o.c=a[4],o));
 if(m.st!=net.gst){const pv=net.gst;net.gst=m.st;
  if(m.st=='match'&&m.me){$('mt').textContent=m.me[0];$('ms').textContent=m.me[1];$('mt').style.color=m.me[2];$('stt').innerHTML=m.me[3]||'';{const ea=m.me[4];net.earn=Array.isArray(ea)?(ea[net.slot]|0):(ea|0)}show('matchEnd',1)}
  else if(['count','play','over','pause'].includes(m.st)&&(!pv||pv=='menu'||pv=='match'))show('',1)}
 for(const a of m.ev||[]){if(a[0]=='t')_tn(a[1],a[2],a[3],a[4],a[5],a[6]);else if(a[0]=='n')_nz(a[1],a[2],a[3]);else if(a[0]=='cf')_confetti()}
 for(const a of m.eb||[])_burst(a[0],a[1],a[2],LOWFX?Math.ceil(a[3]/2):a[3]);
 for(const a of m.dm||[])dmgNum(a[0],a[1],a[2],a[3]);
 for(const f of m.fx||[]){f._s=1;if(!LOWFX||fxl.length<140)fxl.push(f)}}
/* guest helpers: fill a grid from its digit string in place; reuse list objects between snapshots */
function gridIn(A,s){if(!A||A.length!=H||!A[0]||A[0].length!=W||s.length!=W*H)return Array.from({length:H},(_,y)=>Array.from(s.slice(y*W,y*W+W),Number));
 for(let y=0,i=0;y<H;y++){const r=A[y];for(let x=0;x<W;x++,i++){const v=s.charCodeAt(i)-48;if(r[x]!==v)r[x]=v}}return A}
function rl(A,src,f){if(!Array.isArray(A))A=[];const n=src?src.length:0;for(let i=0;i<n;i++)A[i]=f(A[i]||{},src[i]);A.length=n;return A}
/* one-shot event caps per message (sounds, bursts, damage numbers, fx) */
const EVCAP={ev:24,eb:30,dm:30,fx:40};
/* guest: hold only the newest snapshot until the next frame; carry grids, events and names over from any dropped ones */
function queueSnap(m){if(!(m.q>net.sqr))return;const p=net.ps;if(p){if(m.q<=p.q)return;if(m.G==null&&p.G!=null){m.G=p.G;m.sq=p.sq}
 for(const k in EVCAP)if(p[k]&&p[k].length){const a=m[k]&&m[k].length?p[k].concat(m[k]):p[k];m[k]=a.length>EVCAP[k]?a.slice(-EVCAP[k]):a}if(!m.pn&&p.pn)m.pn=p.pn}net.ps=m}
function flushSnap(){const m=net.ps;if(!m)return;net.ps=null;try{applySnap(m)}catch(e){console.error(e)}}
function guestTick(dt){shk=Math.max(0,shk-dt*2.2);const k=Math.min(1,dt*24);
 for(const p of pl){p.x+=(p.tx-p.x)*k;p.y+=(p.ty-p.y)*k;p.anim+=Math.hypot(p.vx,p.vy)*dt*2}
 for(const e of en){e.x+=(e.tx-e.x)*k;e.y+=(e.ty-e.y)*k}
 for(const a of[bombs,fires,lava,met,cl,tox,mh])for(const o of a)o.t=Math.max(0,o.t-dt);
 for(const w of ws)w.d=Math.max(0,w.d-dt);
 for(const ms of msl){ms.x+=ms.vx*5.5*dt;ms.y+=ms.vy*5.5*dt}
 for(const b of bombs)if(b.dx||b.dy)b.k=Math.min(1,b.k+9*dt);
 parts(dt)}
/* host -> guests: the snapshot is serialized once per tick and shared; a guest whose channel is backed up is skipped this tick;
   map grids ride along only when changed, every 2 s, on a new round, on join/rejoin, or on request;
   one-shot events (sounds, bursts, damage numbers, fx) wait in a short log until each guest receives them (dropped after 1.5 s, when stale) */
class RawJ{constructor(s){this.s=s}}
const NBUF=16384,NMAX=16000,_te=typeof TextEncoder=='function'?new TextEncoder():null,msgB=s=>s.length*3<NMAX?s.length:_te?_te.encode(s).length:s.length*3;
function rawSend(c,s){if(c.serialization=='json'&&typeof c.stringify=='function'){if(!c._rawW){const js=c.stringify;c.stringify=d=>d instanceof RawJ?d.s:js(d);c._rawW=1}c.send(new RawJ(s))}else c.send(JSON.parse(s))}
function dcBusy(c){let b=0;try{const d=c.dataChannel||c._dc;b=d&&d.bufferedAmount||0}catch(e){}try{if(c.bufferSize>0)return 1}catch(e){}return b>NBUF}
function evPart(from){let s='';for(const k in EVCAP){let a=[];for(const B of net.evl)if(B.i>from&&B[k].length)a=a.concat(B[k]);if(a.length>EVCAP[k])a=a.slice(-EVCAP[k]);if(a.length)s+=',"'+k+'":'+JSON.stringify(a)}return s}
function netTick(t){if(!net.on())return;
 if(net.role=='host'){const op=net.conns.filter(o=>o.c.open);
  if(st=='menu'){evq=[];evb=[];dmq=[];net.evl=[];if(t-net.ls>500){net.ls=t;for(const o of op)try{o.c.send({t:'menu'})}catch(e){}}}
  else if(t-net.ls>=(op.length>1?50:33)){net.ls=t;const s=snap(),gq=s.G+'|'+s.sq,B={i:net.evi=(net.evi|0)+1,ev:s.ev||[],eb:s.eb||[],dm:s.dm||[],fx:s.fx||[],t};
   const gp=',"G":'+JSON.stringify(s.G)+',"sq":'+JSON.stringify(s.sq);delete s.G;delete s.sq;delete s.ev;delete s.eb;delete s.dm;delete s.fx;
   if(!net.evl)net.evl=[];if(B.ev.length||B.eb.length||B.dm.length||B.fx.length)net.evl.push(B);
   let lo=net.evi;for(const o of op){if(o.evs==null)o.evs=net.evi-1;lo=Math.min(lo,o.evs)}net.evl=net.evl.filter(b=>b.i>lo&&t-b.t<1500);
   const bs=JSON.stringify(s).slice(0,-1),cache={};
   for(const o of op){if(dcBusy(o.c))continue;
    const ng=o.gF||o.gS!==gq||o.grd!==net.rid||t-(o.gT||0)>2000,key=(ng?'g':'')+o.evs;
    let m=cache[key];if(m===undefined){m=bs+(ng?gp:'')+evPart(o.evs)+'}';if(msgB(m)>=NMAX)m=bs+(ng?gp:'')+'}';if(msgB(m)>=NMAX)m=null;cache[key]=m}
    if(!m)continue;try{rawSend(o.c,m);o.evs=net.evi;if(ng){o.gS=gq;o.gT=t;o.grd=net.rid;o.gF=0}}catch(e){}}}}
 else if(net.role=='guest'&&t-net.ls>=100){net.ls=t;sendIn()}}

/* host-side capture of sounds & particle bursts so the guest can replay them */
const _tn=tn,_nz=nz,_burst=burst,_confetti=confetti,_newRound=newRound,rec=()=>net.role=='host'&&net.on();
tn=function(f,d,ty,v,sl,dl,dst){if(!dst&&rec()&&evq.length<14)evq.push(['t',f,d,ty||'square',v==null?.15:v,sl||0,dl||0]);return _tn(f,d,ty,v,sl,dl,dst)};
nz=function(d,v,f){if(rec()&&evq.length<14)evq.push(['n',d,v,f]);return _nz(d,v,f)};
burst=function(x,y,c,n){if(rec()&&evb.length<18)evb.push([f2(x),f2(y),c,n]);return _burst(x,y,c,n)};
confetti=function(){if(rec())evq.push(['cf']);return _confetti()};
newRound=function(){net.rid++;return _newRound()};
/* [b7 · 2197-2199] */
/* names ride along with the existing snapshot (a few times per second) so late joiners and reconnects stay correct */
const _snapPF=snap;snap=function(){const o=_snapPF();if(net.seq%30==1)o.pn=namesWire();return o};
const _applySnapPF=applySnap;applySnap=function(m){_applySnapPF(m);if(m&&m.pn)applyNamesG(m.pn)};
