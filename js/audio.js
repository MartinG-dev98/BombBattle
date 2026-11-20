
/* [b2 · 390-417] */
/* ---------- AUDIO ---------- */
let AC,mG,sG,ms=0;
function ai(){if(AC){AC.state=='suspended'&&AC.resume();return}try{AC=new(window.AudioContext||window.webkitAudioContext)();mG=AC.createGain();sG=AC.createGain();mG.connect(AC.destination);sG.connect(AC.destination);applyVol();music()}catch(e){}}
function applyVol(){if(mG)mG.gain.value=S.mute?0:S.mv*.5;if(sG)sG.gain.value=S.mute?0:S.sv}
function tn(f,d,ty='square',v=.15,sl=0,dl=0,dst){if(!AC)return;const t=AC.currentTime+dl,o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(20,f+sl),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(dst||sG);o.start(t);o.stop(t+d+.02)}
function nz(d,v,f){if(!AC)return;const n=AC.sampleRate*d|0,b=AC.createBuffer(1,n,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(R()*2-1)*(1-i/n);const s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();s.buffer=b;fl.type='lowpass';fl.frequency.value=f;g.gain.value=v;s.connect(fl);fl.connect(g);g.connect(sG);s.start()}
const SFX={
 place:()=>{tn(520,.05,'triangle',.14,-200);tn(190,.1,'sine',.22,-90)},
 tick:()=>tn(1400,.04,'square',.05),
 boom:(m,ch)=>{const c=ch>1?Math.min(ch,5):0,bf=85+c*15;nz(.65,m?1:.75,m?550:850+c*80);tn(bf,.42,'sawtooth',.35,-55);tn(bf*.6,.5,'sine',.3,-25)},
 crate:()=>{nz(.18,.45,2200);tn(160,.08,'sawtooth',.18,-80)},
 pu:()=>{tn(523,.07,'sine',.16);tn(659,.08,'sine',.16,0,.06);tn(784,.09,'sine',.18,0,.12);tn(1046,.16,'triangle',.18,0,.18)},
 hit:()=>{tn(140,.2,'sawtooth',.28,-80);tn(340,.15,'triangle',.22,-180);nz(.15,.3,900)},
 ehit:(t)=>{if(t=='b')SFX.bhit();else if(t=='n'||t=='m'){tn(220,.12,'sine',.2,-80);tn(360,.08,'triangle',.15,-150)}else if(t=='r'){tn(1100,.08,'square',.18,-500);nz(.08,.25,3000)}else{tn(380,.14,'sawtooth',.22,-240)}},
 edie:(t)=>{if(t=='b')return;tn(440,.08,'triangle',.18,200);tn(660,.12,'sine',.16,0,.05);nz(.15,.25,1200)},
 click:()=>tn(700,.05,'square',.1),
 dash:()=>tn(300,.15,'sawtooth',.12,600),
 kick:()=>tn(150,.12,'square',.2,-60),
 elim:()=>{tn(480,.45,'sawtooth',.24,-380);tn(240,.55,'triangle',.22,-160,.1);nz(.4,.35,600)},
 bhit:()=>{tn(95,.22,'square',.26,-45);tn(55,.3,'sine',.35,-20);nz(.16,.35,1200)},
 batk:()=>{tn(75,.45,'sawtooth',.28,40);tn(50,.55,'triangle',.3,-20)},
 heal:()=>{tn(660,.1,'triangle',.15);tn(990,.16,'triangle',.15,0,.08)},
 parry:()=>{tn(1800,.12,'square',.12,-900);tn(2400,.2,'triangle',.12,0,.05)},
 zap:()=>{nz(.25,.4,4000);tn(1600,.2,'sawtooth',.12,-1200)},
 warp:()=>{tn(300,.3,'sine',.2,1200);tn(1500,.25,'sine',.12,-1000,.15)}
};
function jingle(w){[0,4,7,12,16].forEach((n,i)=>tn(262*2**((w?n:-n)/12),.28,'triangle',.22,0,i*.13))}
function music(){if(AC&&S.mv>0&&!S.mute){const root=[45,41,43,40][(ms>>4)&3],n=ms&15,hz=x=>440*2**((x-69)/12);if(n%4==0)tn(hz(root),.25,'triangle',.5,0,0,mG);tn(hz(root+24+[0,3,7,10,12,10,7,3][n%8]),.1,'square',.07,0,0,mG);if(st!='menu'&&n%4==2)tn(hz(root+12),.08,'square',.05,0,0,mG)}ms++;setTimeout(music,st=='menu'?190:Math.max(95,150-Math.min(55,el*.4)))}
/* [b2 · 453-453] */
document.addEventListener('click',e=>{ai();if(e.target.closest('button'))SFX.click()});
