/* [b8 · 2207-2243] */
/* ===== READY system (v5, online rooms only) =====
   Guests lock their fighter with READY on the wait screen and send {t:'ready',r:bool,e:epoch}.
   The host keeps o.rdy per connection (next to o.sk), validates every message, and broadcasts
   {t:'rdy',e:epoch,a:[slot0..3 ready]} so every device shows the roster. When a match starts the
   host bumps the epoch and clears all flags, so everyone readies again for the next lobby start.
   A ready message carrying an old epoch is ignored and that guest is resynced. */
net.re=0;net.my=false;net.ra=null;
function rdyWire(){const a=[true,false,false,false];for(const o of net.conns)if(o.c.open&&o.slot>0&&o.slot<4)a[o.slot]=o.rdy===true;return a}
function sendRdy(o){if(net.role!='host')return;const m={t:'rdy',e:net.re,a:rdyWire()};for(const q of o?[o]:net.conns)if(q.c.open)try{q.c.send(m)}catch(e){}}
function notReady(){return net.role=='host'?net.conns.filter(o=>o.c.open&&o.rdy!==true):[]}
function rdyWhy(){const n=notReady().length;return n?'Waiting for '+n+(n>1?' players':' player')+' to be ready':''}
/* guest: wait-screen button + locked picker */
function rdyUI(){const b=$('rdyBtn'),r=net.role=='guest'&&net.my;if(b){b.classList.toggle('on',r);b.textContent=r?'READY ✓':'READY';b.setAttribute('aria-pressed',r?'true':'false')}
 const w=$('wsk');if(w)w.classList.toggle('lockd',r);const h=$('rdyHint');if(h)h.textContent=r?'Fighter locked in! Waiting for the host to start. Tap READY ✓ again to change fighter.':'Pick your fighter, then tap READY.';
 const sub=$('wSub');if(sub)sub.textContent=r?'READY ✓ · WAITING FOR HOST…':'WAITING FOR HOST…'}
function toggleReady(){if(net.role!='guest')return;if(!net.on()){toast('Not connected to the host yet.');return}const nv=!net.my;
 if(nv){if(!(S.gk>=0&&SK[S.gk]&&isUnl(S.gk))){S.gk=mySk();saveS()}sendSk()}
 net.my=nv;try{net.conn.send({t:'ready',r:nv,e:net.re})}catch(e){}rdyUI();wlistUI();if(nv){tn(660,.08,'triangle',.18);tn(990,.14,'triangle',.16,0,.07)}else tn(440,.1,'triangle',.14)}
function applyRdyG(m){if(net.role!='guest'||!m||!Number.isInteger(m.e))return;if(Array.isArray(m.a))net.ra=[0,1,2,3].map(i=>m.a[i]===true);
 if(m.e!==net.re){net.re=m.e;net.my=false}rdyUI();wlistUI()}
const _wskRD=wskUI;wskUI=function(){const r=_wskRD.apply(this,arguments);rdyUI();return r};
const _waitRD=$('wait').onclick;$('wait').onclick=function(e){if(net.role=='guest'&&net.my&&e.target.closest('.chip')){toast('You are ready. Tap READY ✓ to unlock and change fighter.');return}return _waitRD.call(this,e)};
/* host: validate ready messages, keep the fighter locked while ready, keep everyone's roster live */
const _odhRD=onDataH;onDataH=function(o,m){
 if(m&&m.t=='ready'){if(net.role!='host'||!net.conns.includes(o)||!o.c.open||!(o.slot>0&&o.slot<4)||typeof m.r!='boolean')return;
  if(m.e!==net.re){if(Number.isInteger(m.e))sendRdy(o);return}if(o.rdy!==m.r){o.rdy=m.r;sendRdy();netUI()}return}
 if(m&&m.t=='sk'&&o.rdy===true&&Number.isInteger(o.sk)&&m.k!==o.sk)return;
 const r=_odhRD.apply(this,arguments);if(m&&m.t=='hi')sendRdy();else if(m&&(m.t=='sk'||m.t=='nm'))netUI();return r};
const _odgRD=onDataG;onDataG=function(m){const r=_odgRD.apply(this,arguments);if(m&&m.t=='rdy')applyRdyG(m);return r};
const _ghRD=goneH;goneH=function(o){const had=net.conns.includes(o),r=_ghRD.apply(this,arguments);if(had&&net.role=='host'){sendRdy();netUI()}return r};
/* host: starting from the lobby needs every connected guest ready (no guests = old behaviour); rematch/restart are unchanged */
const _startRD=start;start=function(){
 if(net.role=='host'&&st=='menu'&&notReady().length){toast(rdyWhy()+'.');netUI();return}
 const r=_startRD.apply(this,arguments);if(net.role=='host'){net.re++;for(const o of net.conns)o.rdy=false;sendRdy();netUI()}return r};
const _lnRD=leaveNet;leaveNet=function(){net.my=false;net.ra=null;net.re=0;return _lnRD.apply(this,arguments)};
rdyUI();
