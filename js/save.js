/* [b11 · 2539-2564] */
/* ---------- versioned save: v1 (fighters stored as list positions) -> v2 (stored by character ID) ---------- */
const SAVE_KEY='bbSaveV',SAVE_V=2,CH_KEY='bbChar',BAK_KEY='bbBak1';
const BAK_KEYS=['bbSet','bbProfile','bbStars','bbUnl','bbBest','bbBs','bbBsUnl','bbEcoV2','bbEcoDay'];
const SAVE={v:1,ro:0,from:0,mig:0,err:''};
function rawGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function rawSet(k,v){try{localStorage.setItem(k,v);return 1}catch(e){SAVE.err=String(e&&e.name||e);return 0}}
const idOk=(id,need)=>typeof id=='string'&&CID[id]!=null&&(!need||isUnl(CID[id]));
function chWrite(){if(SAVE.ro)return;const sel=[0,1,2,3].map(i=>SK[S.sk[i]]?SK[S.sk[i]].id:SK[SKD[i]].id);
 const o={v:SAVE_V,data:RPG_V,sel,gk:S.gk>=0&&SK[S.gk]?SK[S.gk].id:'',upd:Date.now()};const old=SAVE.rec||{};if(old.mig)o.mig=old.mig;SAVE.rec=o;rawSet(CH_KEY,JSON.stringify(o))}
function chRead(){let o=null;try{o=JSON.parse(rawGet(CH_KEY)||'null')}catch(e){o=null}return o&&typeof o=='object'&&!Array.isArray(o)?o:null}
function chApply(o){if(!o)return;if(Array.isArray(o.sel))for(let i=0;i<4;i++)if(idOk(o.sel[i],1))S.sk[i]=CID[o.sel[i]];
 if(o.gk==='')S.gk=-1;else if(idOk(o.gk,1))S.gk=CID[o.gk]}
(function migrateSave(){
 const rv=rawGet(SAVE_KEY);let v=rv==null?1:+JSON.parse(rv);if(!(v>=1))v=1;SAVE.from=v;
 if(v>SAVE_V){SAVE.v=v;SAVE.ro=1;chApply(chRead());return}           /* save from a newer version: read only, never downgrade */
 if(v<2){
  if(rawGet(BAK_KEY)==null){const keys={};for(const k of BAK_KEYS){const s=rawGet(k);if(s!=null)keys[k]=s}rawSet(BAK_KEY,JSON.stringify({from:v,at:Date.now(),keys}))}
  /* a device with no history (no profile, stars or best time) that still has the old default picks gets the new champions as defaults */
  const fresh=rawGet('bbProfile')==null&&rawGet('bbStars')==null&&rawGet('bbBest')==null&&[0,1,2,3].every(i=>S.sk[i]===SKD_OLD[i])&&S.gk===-1;
  if(fresh)for(let i=0;i<4;i++)S.sk[i]=SKD[i];
  SAVE.rec={mig:{from:v,at:Date.now(),fresh:fresh?1:0}};chWrite();
  if(SAVE.err)return;                                                /* storage full / blocked: try again next start */
  if(fresh)LS.set('bbSet',S);rawSet(SAVE_KEY,String(SAVE_V));SAVE.v=2;SAVE.mig=1;return}
 const o=chRead();SAVE.rec=o||{};SAVE.v=2;if(o&&o.v===2)chApply(o);else chWrite()})();
/* keep bbChar in step with every settings save (saveS writes bbSet through LS.set) */
const _lsSetRPG=LS.set;LS.set=function(k,v){const r=_lsSetRPG.call(LS,k,v);if(k==='bbSet'&&!SAVE.ro&&SAVE.v===2)chWrite();return r};
coreLoadSettings();
coreInit1();
mapInit1();
mapInit2();

