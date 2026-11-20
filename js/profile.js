
/* [b2 · 338-380] */
/* ===== PLAYER PROFILE (Phase 1): one permanent, global character name =====
   Stored under its own key 'bbProfile' ({v:1,name,created,updated}); never mixed with bbSet / bbStars / bbUnl / bbBest.
   Names are display info only: they are validated on entry, on load and on every network receive, and are always escaped. */
const PROF_KEY='bbProfile',PROF_V=1,NAME_MIN=2,NAME_MAX=16;
const esc=v=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function nameNorm(raw){return typeof raw=='string'?raw.normalize('NFC').replace(/[ \t\r\n\f\v\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g,' ').trim():''}
function validateName(raw){
 if(typeof raw!='string'||raw.length>96)return{ok:0,msg:'That name is too long.'};
 const t=nameNorm(raw);if(!t)return{ok:0,msg:'Please type a name.',short:1};
 /* ZWJ/ZWNJ are allowed because some scripts need them; every other control / invisible / unassigned character is rejected */
 if(/[\p{Cc}\p{Cf}\p{Co}\p{Cs}\p{Cn}\p{Zl}\p{Zp}]/u.test(t.replace(/[\u200C\u200D]/g,'')))return{ok:0,msg:'Names cannot contain control or invisible characters.'};
 const n=[...t].length;
 if(n<NAME_MIN)return{ok:0,msg:'Names need at least '+NAME_MIN+' characters.',short:1};
 if(n>NAME_MAX)return{ok:0,msg:'Names can be at most '+NAME_MAX+' characters (you have '+n+').'};
 if(!/^[\p{L}\p{N}][\p{L}\p{M}\p{N}\u200C\u200D .,'’_!()&+#*-]*$/u.test(t))return{ok:0,msg:"Use letters, numbers, spaces and . , ' - _ ! ( ) & + # * only."};
 return{ok:1,name:t}}
const Prof={name:'',data:null,saved:1,
 load(){let d=null;try{const t=localStorage.getItem(PROF_KEY);if(t)d=JSON.parse(t)}catch(e){d=null}
  const obj=d&&typeof d=='object'&&!Array.isArray(d);this.data=obj?d:null;this.name='';
  if(obj){const v=validateName(d.name);if(v.ok)this.name=v.name}},
 save(raw){const v=validateName(raw);if(!v.ok)return v;const now=Date.now(),o=Object.assign({},this.data||{});
  o.v=Math.max(PROF_V,+o.v||0);o.name=v.name;if(!(o.created>0))o.created=now;o.updated=now;this.data=o;this.name=v.name;
  try{localStorage.setItem(PROF_KEY,JSON.stringify(o));this.saved=1}catch(e){this.saved=0}return v},
 clear(){this.name='';this.data=null;this.saved=1;try{localStorage.removeItem(PROF_KEY)}catch(e){}}};
Prof.load();
/* display name per seat. Local play: P1 = profile name, P2 keeps BETA. Host: guests' validated names. Guest: names the host sent. */
function dedupeNames(a){const seen=new Set();return a.map(n=>{let m=n,k=n.toLowerCase(),c=1;while(seen.has(k)){c++;m=[...n].slice(0,NAME_MAX-4).join('')+' ('+c+')';k=m.toLowerCase()}seen.add(k);return m})}
function netNames(){const out=PNAME.slice();
 if(net.role=='guest'){const g=net.names,me=net.slot||1;for(let i=0;i<4;i++)if(g&&g[i])out[i]=g[i];if(!(g&&g[me]))out[me]=Prof.name||PNAME[me];return out}
 out[0]=Prof.name||PNAME[0];
 if(net.role=='host')for(const o of net.conns)if(o.c.open&&o.pn&&o.slot>0&&o.slot<4)out[o.slot]=o.pn;
 return dedupeNames(out)}
const pname=i=>netNames()[i]||PNAME[i];
const namesWire=()=>netNames().map((n,i)=>i==0||net.conns.some(o=>o.c.open&&o.slot==i)?n:'');
function sendNames(o){if(net.role!='host')return;const m={t:'names',a:namesWire()};for(const q of o?[o]:net.conns)if(q.c.open)try{q.c.send(m)}catch(e){}}
function sendMyName(){if(net.role=='guest'&&net.on()&&Prof.name)try{net.conn.send({t:'nm',n:Prof.name})}catch(e){}}
function refreshNames(){if(pl){const a=netNames();pl.forEach((p,i)=>{if(a[i])p.n=a[i]})}if(typeof wlistUI=='function')wlistUI()}
function applyNamesG(a){if(!Array.isArray(a))return;const o=['','','',''];for(let i=0;i<4;i++){const v=validateName(a[i]);o[i]=v.ok?v.name:''}net.names=o;refreshNames();const r=$('myRole');if(r&&net.role=='guest')r.textContent=netNames()[net.slot||1]}
/* canvas text: shorten with an ellipsis so long names never collide with the HP readout */
function fitName(t,maxW){if(c.measureText(t).width<=maxW)return t;const a=[...t];while(a.length>1&&c.measureText(a.join('')+'…').width>maxW)a.pop();return a.join('').trimEnd()+'…'}
const nmc=(p,n4)=>'<span class="nm'+(n4?' n4':'')+'">'+esc(p.n)+'</span>';
function coopMsg(w,solo){const nm=pl.filter(p=>!p.off).map(p=>p.n),nj=nm.length>2?nm.slice(0,-1).join(', ')+' & '+nm[nm.length-1]:nm.join(' & ');
 return w?(S.mode==6?nj+': all four bosses defeated!':solo?nj+', you cleared every wave on your own.':nj+' cleared every wave together.'):'The monsters won at wave '+wv+'. Rise again, '+nj+'!'}

/* [b7 · 2159-2196] */
/* ===== PLAYER PROFILE UI + network glue (Phase 1) ===== */
let profFrom='main';
function wlistUI(){const el=$('wlist');if(!el)return;if(net.role!='guest'||!net.names){el.innerHTML='';el.style.display='none';return}
 const NN=netNames(),ra=net.ra||[];el.style.display='';el.innerHTML=NN.map((n,i)=>{if(!net.names[i])return'';const r=i==net.slot?net.my:ra[i]===true;return`<div><b style="color:${PCOL[i]}">${esc(n)}</b><span>${PNAME[i]}${i==0?' · HOST':''}${i==net.slot?' · YOU':''}${i>0?(r?' · <em class="ok">READY ✓</em>':' · <em class="nr">NOT READY</em>'):''}</span></div>`}).join('')}
function updateProfBtn(){const b=$('profName');if(b)b.textContent=Prof.name}
function onNameChanged(){refreshNames();updateProfBtn();if(net.role=='guest')sendMyName();else if(net.role=='host')sendNames();sel()}
/* live preview + validation message for a name input */
function nameField(inp,prev,msg){const upd=()=>{const raw=inp.value,t=nameNorm(raw),v=validateName(raw);
  prev.querySelector('b').textContent=t||'YOUR NAME';prev.classList.toggle('empty',!t);
  if(!raw){msg.textContent="2–16 characters: letters, numbers, spaces and . , ' - _ ! ( ) & + # *";msg.className='nmmsg';inp.classList.remove('bad')}
  else if(v.ok){msg.textContent=[...t].length+' / '+NAME_MAX;msg.className='nmmsg';inp.classList.remove('bad')}
  else if(v.short){msg.textContent='Names need at least '+NAME_MIN+' characters.';msg.className='nmmsg';inp.classList.remove('bad')}
  else{msg.textContent=v.msg;msg.className='nmmsg bad';inp.classList.add('bad')}};
 inp.addEventListener('input',upd);return upd}
function nameSubmit(inp,msg,done){const v=validateName(inp.value);
 if(!v.ok){msg.textContent=v.msg;msg.className='nmmsg bad';inp.classList.add('bad');inp.focus();return}
 Prof.save(v.name);if(!Prof.saved)toast('Could not save your name on this device. You may be asked again next time.');done(v.name)}
const wUpd=nameField($('wName'),$('wPrev'),$('wMsg')),pUpd=nameField($('pInp'),$('pPrev'),$('pMsg'));
function showWelcome(){$('wName').value=Prof.name||'';wUpd();show('welcome');setTimeout(()=>$('wName').focus(),80)}
$('wGo').onclick=()=>nameSubmit($('wName'),$('wMsg'),()=>{onNameChanged();show('main')});
$('wName').addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();$('wGo').click()}});
/* player profile screen (Settings -> Player Profile, or the profile chip on the main menu) */
function renderProf(){const k=S.sk[0],sk=SK[k]||SK[0],unl=SK.filter((q,j)=>isUnl(j)).length,best=+LS.get('bbBest',0)||0;
 $('pName').textContent=Prof.name;$('pvc').dataset.k=k;$('pFight').textContent='Fighter: '+sk.n+' · '+sk.g;
 $('pStats').innerHTML=[['★ Stars',stars],['Fighters unlocked',unl+' / '+SK.length],['Best solo survival',best>0?fmtT(best):'—']].map(r=>`<span>${r[0]}</span><b>${esc(r[1])}</b>`).join('')}
function profMode(m){$('pEdit').style.display=m=='edit'?'':'none';$('pConfirm').style.display=m=='reset'?'':'none';$('pBtns').style.display=m?'none':'';$('prof').querySelector('.pcard').style.display=m=='reset'?'none':''}
function openProfile(from){profFrom=from||'main';renderProf();profMode(0);show('prof',backTo=='pause'?1:0)}
$('pEditBtn').onclick=()=>{$('pInp').value=Prof.name;pUpd();profMode('edit');setTimeout(()=>$('pInp').focus(),50)};
$('pSave').onclick=()=>nameSubmit($('pInp'),$('pMsg'),()=>{onNameChanged();renderProf();profMode(0);toast('Name updated')});
$('pInp').addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();$('pSave').click()}else if(e.key=='Escape'){e.preventDefault();profMode(0)}});
$('pCancel').onclick=()=>profMode(0);
$('pBack').onclick=()=>{show(profFrom,profFrom=='set'&&backTo=='pause'?1:0)};
$('pResetBtn').onclick=()=>{if(net.role||backTo=='pause'){toast('Leave the online room or finish the current match first, then reset from the main menu.');return}profMode('reset')};
$('pNo').onclick=()=>profMode(0);
$('pYes').onclick=()=>{Prof.clear();onNameChanged();showWelcome()};
/* guard: the main menu can never be reached without a saved name */
const _showPF=show;show=function(id,g){if(!Prof.name&&id!='welcome'){id='welcome';g=0}return _showPF.call(this,id,g)};
/* [b7 · 2200-2201] */
updateProfBtn();
if(!Prof.name)showWelcome();
