/* [b2 · 305-312] */
const $=i=>document.getElementById(i),cv=$('cv'),c=cv.getContext('2d'),bgc=$('bg'),bc=bgc.getContext('2d');
const T=48,R=Math.random;let OY=64;const rr=(a,b)=>a+R()*(b-a),DIR=[[1,0],[-1,0],[0,1],[0,-1]];let W=15,H=13,CX=7,CY=6;
/* Arena size depends on player count: 1 player = small 13x11, 2 players = small-medium 15x13 */
const DIMS={1:[13,11],2:[15,13],3:[17,13],4:[17,15]};
/* player colours / names for up to 4 fighters; slots 2 and 3 are online-only and use virtual key codes */
const PCOL=['#35a7ff','#ff4d5e','#3ddc84','#ffd23f'],PNAME=['ALPHA','BETA','GAMMA','DELTA'];let NPL=2;
function setDims(w,h){W=w;H=h;CX=W>>1;CY=H>>1;if(typeof hudLayout=='function')hudLayout();if(cv.width!=W*T||cv.height!=H*T+OY){cv.width=W*T;cv.height=H*T+OY}if(typeof fit=='function')fit()}
setDims(15,13);
/* [b2 · 322-322] */
const MODES=[{n:'Classic Battle',d:'Free for all: last one standing. The arena closes in after 2 minutes.',p2:1},{n:'Time Attack',d:'90 seconds. Most HP left wins.',p2:1},{n:'Sudden Death',d:'The arena starts closing after 30 seconds.',p2:1},{n:'Infinite Bombs',d:'Unlimited bombs plus a constant rain of meteors.',p2:1},{n:'Survival Mode',d:'Meteors fall and monsters keep spawning. Solo: survive as long as you can. Duo: last one standing.'},{n:'Co-op Monster Siege',d:'Solo or co-op against 5 waves of monsters. Beat the map boss to win.'},{n:'Boss Rush',d:'Solo or co-op: all four bosses in a new random order every run.'}];
/* [b2 · 328-331] */
const CT=[{l:'KeyA',r:'KeyD',u:'KeyW',d:'KeyS',b:'Space',s:'KeyQ',m:'KeyE'},{l:'ArrowLeft',r:'ArrowRight',u:'ArrowUp',d:'ArrowDown',b:'Enter',s:'ShiftRight',m:'Slash'},{l:'N2l',r:'N2r',u:'N2u',d:'N2d',b:'N2b',s:'N2s',m:'N2m'},{l:'N3l',r:'N3r',u:'N3u',d:'N3d',b:'N3b',s:'N3s',m:'N3m'}];
let CM=0,ST=[],ws=[];const S={sk:[8,9,10,11],map:0,rm:1,mode:0,bo:3,mv:.5,sv:.7,shake:1,np:2,mute:0,room:4,gk:-1};const SKD=[8,9,10,11];
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const LSA=k=>{const a=LS.get(k,[]);return Array.isArray(a)?a.filter(Number.isInteger):[]};
/* [b2 · 336-336] */
function coreLoadSettings(){let o=LS.get('bbSet',{});if(!o||typeof o!='object')o={};for(const k in S)if(o[k]!==undefined&&typeof o[k]==typeof S[k])S[k]=o[k];if(!Array.isArray(S.sk))S.sk=SKD.slice();S.sk=SKD.map((d,i)=>isUnl(S.sk[i])?S.sk[i]:d);if(![2,3,4].includes(S.room))S.room=4;if(!(S.map<MAPS.length))S.map=0;if(!(S.mode<MODES.length))S.mode=0;if(S.np!=1)S.np=2;if(!(Number.isInteger(S.gk)&&S.gk>=0&&isUnl(S.gk)))S.gk=-1;if(ECO_MIG)LS.set('bbSet',S)}
const saveS=()=>LS.set('bbSet',S);
let dmgs=[],dmq=[],tox=[],msl=[],fd=new Uint8Array(W*H),fk=[],puCD=0,lastSp=[],fdt=1/60;
/* [b2 · 387-388] */
const VI={l:0,r:0,u:0,d:0,b:0,s:0,m:0},VN={b:0,s:0,m:0};
let en=[],coopWon=0,frzT=0,wv=0,wvt=0,st='menu',G,sq,pu,pl,bombs,fires,items,pts,txt,met,lava,cl,ports,fa,ambs=[],el=0,tm=0,shk=0,cdn=0,endT=0,winner=-1,wins=[0,0,0,0],round=1,pst='',lava_t=0,met_t=0,wave_t=0,sh_t=0,spI=0,spiral=[],lastTick=0,K={},tap={};
/* [b2 · 456-463] */
function pause(){if(['play','count','over'].includes(st)){pst=st;st='pause';show('pause',1)}}
function resume(){st=pst;show('',1)}
function restartRound(){if(['play','count','over','pause'].includes(st)){newRound();show('',1)}}
/* input layer: keyboard + touch both funnel through press() so online/guest routing lives in one place */
const ACTS=['l','r','u','d','b','s','m'],ACT1={};for(const a of ACTS)ACT1[CT[1][a]]=a;
let TOUCH=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;
function nk(k){if(net.role=='host'||(net.role&&net.on())){const f=CT[net.role=='host'?1:0],t=CT[net.role=='host'?0:1];for(const a of ACTS)if(f[a]==k)return t[a]}return k}
function press(a,down){down=down?1:0;
 if(net.role=='guest'){if(VI[a]!=down){VI[a]=down;if(down&&VN[a]!==undefined)VN[a]++;sendIn()}return}
 const k=CT[0][a];if(down){if(!K[k]){tap[k]=1;if(pl&&pl[0]){if(a=='l'||a=='r')pl[0].ax='x';if(a=='u'||a=='d')pl[0].ax='y'}}K[k]=1}else delete K[k]}
/* [b2 · 466-472] */
addEventListener('keydown',e=>{if(e.target&&e.target.tagName=='INPUT')return;if(e.isComposing||e.keyCode==229||!e.code||e.code=='Unidentified')return;if(st!='menu'&&/^(Key[WASDQE]|Arrow|Space|Enter|Shift|Slash)/.test(e.code)&&TOUCH&&performance.now()-lastTouch>3000){TOUCH=false;if(typeof fit=='function')fit()}let k=e.code=='NumpadEnter'?'Enter':e.code;if(k=='KeyM'&&!e.repeat){tg('mute');return}k=nk(k);
 if(['play','count','over','pause'].includes(st)&&/Arrow|Space|Enter|Slash/.test(e.code))e.preventDefault();
 if(net.role=='guest'){const a=ACT1[k];if(a)press(a,1);return}
 if(!e.repeat){tap[k]=1;if(pl)pl.forEach((p,i)=>{const o=CT[i];if(k==o.l||k==o.r)p.ax='x';if(k==o.u||k==o.d)p.ax='y'});if(k=='Escape')st=='pause'?resume():pause();if(k=='KeyR')restartRound()}K[k]=1});
addEventListener('keyup',e=>{let k=e.code=='NumpadEnter'?'Enter':e.code;k=nk(k);if(net.role=='guest'){const a=ACT1[k];if(a)press(a,0);return}delete K[k]});
addEventListener('blur',()=>{K={};if(net.role=='guest'){ACTS.forEach(a=>press(a,0));return}if(st=='play')pause()});
addEventListener('gesturestart',e=>e.preventDefault());
/* [b2 · 505-520] */
function newRound(){const np=NPL;const dm=DIMS[np]||DIMS[2];if(!net.role&&np<=2&&typeof portraitTouch=='function'&&portraitTouch())setDims(dm[1],dm[0]);else setDims(dm[0],dm[1]);const M=mcfg(),bossM=S.mode>=5;
 /* walls come from the map's own layout (MCFG), then its pads (bogs, ice, vents...), then teleporters */
 G=[];sq=[];pu=[];for(let y=0;y<H;y++){G[y]=[];sq[y]=[];pu[y]=[];for(let x=0;x<W;x++){G[y][x]=(x==0||y==0||x==W-1||y==H-1||mapWall(x,y))?1:0;sq[y][x]=0;pu[y][x]=-1}}
 for(const[x,y,v]of mapPads())if(G[y]&&G[y][x]===0&&!sq[y][x])sq[y][x]=v;
 ports=[];if(CM==4){ports=[{x:CX,y:3,v:2},{x:CX,y:H-4,v:2},{x:3,y:CY,v:3},{x:W-4,y:CY,v:3}];ports.forEach(q=>{G[q.y][q.x]=0;pu[q.y][q.x]=-1;sq[q.y][q.x]=q.v})}
 const SP=pickSpawns(np),zone=(x,y)=>SP.some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)<=2),rate=puRate(),dens=M.dens[Math.min(np,2)-1]*(bossM?.8:1);
 /* crates: ~35% fewer than before, weighted per map (clusters, lanes, clearings); boss modes keep the centre open */
 if(np>2){for(let y=1;y<=CY;y++)for(let x=1;x<=CX;x++){const Q=mir4(x,y);if(Q.some(([a,b])=>G[b][a]||sq[b][a]||zone(a,b)))continue;const w=bossM&&MD(x,y)<=3?0:M.cw(x,y);if(R()<dens*w){const k=R()<rate?wpick():-1;for(const[a,b]of Q){G[b][a]=2;pu[b][a]=k}}}}
 else for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const mx=W-1-x,my=H-1-y;if(y*W+x>my*W+mx||G[y][x]||sq[y][x]||sq[my][mx]||zone(x,y)||zone(mx,my))continue;const w=bossM&&MD(x,y)<=3?0:M.cw(x,y);if(R()<dens*w){G[y][x]=G[my][mx]=2;if(R()<rate)pu[y][x]=pu[my][mx]=wpick()}}
 for(const[x,y]of SP)openEscape(x,y,np>2?4:np>1);
 pl=[0,1,2,3].slice(0,Math.max(2,np)).map(i=>{const on=i<np,s=on?SP[i]:[-9,-9];return{id:i,x:s[0]+.5,y:s[1]+.5,vx:0,vy:0,hp:100,hd:100,hv:100,maxB:S.mode==3?9:1,rng:2,spd:0,shield:0,ghost:0,mega:0,remote:0,inv:1.5,fx:s[0]<CX?1:-1,fy:0,cd:0,kcd:0,bcd:0,dsh:0,tp:0,ax:'x',anim:0,alive:on?1:0,off:on?0:1,sk:skFor(i),throwT:0,fz:0,rv:0,dtm:-99,ivT:0,phT:0,fsT:0,pry:0,vkT:0,hf:0,slow:0,gT:0,c:PCOL[i],n:pname(i)}});
 bombs=[];fires=[];items=[];pts=[];txt=[];met=[];lava=[];cl=[];fa=new Uint8Array(W*H);fd=new Uint8Array(W*H);fk=new Array(W*H).fill('');dmgs=[];tox=[];msl=[];puCD=0;spiral=spir();spI=0;
 en=[];ws=[];wv=0;wvt=1.5;coopWon=0;frzT=0;
 if(S.mode<5){const s=spots(),P=menc().pool;if(np>1&&wins.slice(0,np).filter(w=>w==need()-1).length>=2){warn(CX,CY,'b');warn(...s[0],P[0]);warn(...s[1],P[0])}else if(R()<.5){const sp=round>=3?s.slice(0,4):s.slice(0,2),ty=()=>round<2?P[0]:P[R()*P.length|0],t1=ty(),t2=ty();sp.forEach(([x,y],i)=>warn(x,y,i<2?t1:t2))}}
 el=0;cdn=3.6;st='count';winner=-1;lava_t=4;met_t=4;wave_t=20;sh_t=0;mkAmb();K={}}
function mkAmb(){const m=CM;ambs=[...Array(36)].map(()=>({x:R()*W,y:R()*H,vx:m==2||m==3||m==0||m==5||m==7?rr(-.3,.3):0,vy:[rr(-.2,.2),-.9,.7,rr(-.3,.3),2.8,.5,-.15,rr(-.25,.25)][m]||0,s:rr(1,3),p:R()*9}))}

/* ---------- LOGIC ---------- */
/* [b2 · 523-523] */
const need=()=>S.bo==3?2:3;
function endRound(w){st='over';endT=3;winner=w;if(w>=0)wins[w]++;jingle(w>=0);if(w>=0){confetti();pl[w].inv=0}}
/* [b2 · 668-676] */
let hitStopT=0;function hitStop(d){if(hitStopT<=0)hitStopT=d}
function update(dt){shk=Math.max(0,shk-dt*2.2);
 if(hitStopT>0){hitStopT-=dt;parts(dt);return}
 if(st=='count'){const c0=Math.ceil(cdn-.6);cdn-=dt;if(Math.ceil(cdn-.6)!=c0&&cdn>.6)tn(500,.12,'square',.15);if(cdn<=.6){st='play';tn(900,.35,'square',.2)}wsUpd(dt);parts(dt);return}
 const play=st=='play';if(cdn>0)cdn-=dt;
 if(play){el+=dt;puCD=Math.max(0,puCD-dt);for(const p of pl)if(p.alive)ctl(p,dt);wsUpd(dt);enUpd(dt);abUpd(dt)}
 bombsUpd(dt);fireUpd(dt);haz(dt);parts(dt);
 if(play&&S.mode>=5)coop(dt);else if(play&&pl[1].off){if(!pl[0].alive)soloEnd()}else if(play){const al=pl.filter(p=>!p.off&&p.alive);if(al.length<=1)endRound(al.length?al[0].id:-1);else if(S.mode==1&&el>=90){const hr=p=>p.hp/(p.mhp||100),mx=Math.max(...al.map(hr)),top=al.filter(p=>hr(p)==mx);endRound(top.length==1?top[0].id:-1)}}
 if(st=='over'){endT-=dt;if(endT<=0){if(winner>=0&&wins[winner]>=need()){st='match';$('mt').textContent=pl[winner].n+' WINS THE MATCH!';$('mt').style.color=pl[winner].c;$('ms').textContent='Rounds: '+pl.filter(p=>!p.off).map(p=>p.n+' '+wins[p.id]).join(' · ');$('stt').innerHTML=statsHTML();jingle(1);confetti();show('matchEnd',1)}else{if(winner>=0)round++;if(S.rm)CM=(CM+1+(R()*(MAPS.length-1)|0))%MAPS.length;newRound()}}}}
/* [b2 · 683-683] */
function onr(){bgc.width=innerWidth;bgc.height=innerHeight}addEventListener('resize',onr);onr();
/* [b5 · 1852-1855] */
async function keepAwake(){try{if('wakeLock' in navigator&&!wl){wl=await navigator.wakeLock.request('screen');wl.addEventListener('release',()=>{wl=null})}}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='visible'&&['count','play','over'].includes(st))keepAwake()});
document.addEventListener('click',keepAwake);
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

/* [b6 · 2150-2156] */
/* ---------- input safety: never leave a key or touch button stuck ---------- */
function releaseAll(){for(const k in K)delete K[k];if(typeof ACTS!='undefined'&&typeof press=='function')ACTS.forEach(a=>{try{press(a,0)}catch(e){}});document.querySelectorAll('.tb.on').forEach(b=>b.classList.remove('on'));const kn=$('knob');if(kn)kn.style.transform=''}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState=='hidden'){releaseAll();if(net.role!='guest'&&st=='play')pause()}});
addEventListener('pagehide',releaseAll);
document.querySelectorAll('.tb').forEach(b=>b.addEventListener('lostpointercapture',()=>{if(b.classList.contains('on')){b.classList.remove('on');press(b.dataset.a,0)}}));
(function(){const pad=$('pad');if(pad)pad.addEventListener('lostpointercapture',()=>{const kn=$('knob');if(kn)kn.style.transform='';['l','r','u','d'].forEach(a=>press(a,0))})})();
function coreInit1(){tgUI()}

