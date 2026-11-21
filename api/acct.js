/* Smalley's Zombies - account server.
   Put this file in your GitHub repo as  api/acct.js  (a folder called api, with this file inside).
   Vercel runs it automatically. It needs an Upstash Redis database connected in Vercel -> Storage.
   Check it works by opening  https://YOUR-SITE/api/acct  in a browser. */
'use strict';
/* ===== SMALLEY'S ZOMBIES: ACCOUNT CATALOG (shared by the game and the account server) ===== */
const ACAT=(function(){
  const RAR={c:{n:'COMMON',col:'#b8c4cc',w:60},r:{n:'RARE',col:'#4aa8ff',w:27},e:{n:'EPIC',col:'#c06aff',w:10},l:{n:'LEGENDARY',col:'#ffb020',w:3},x:{n:'EXCLUSIVE',col:'#ff5a3a',w:0}};
  const PRICE={sk:{c:500,r:1000,e:2000,l:3500},nc:{c:100,r:200,e:400,l:800},fr:{c:200,r:400,e:800,l:1500}};
  const CRATE={nc:{n:'NAME COLOR CRATE',p:150,col:'#ffd84a'},fr:{n:'FRAME CRATE',p:300,col:'#4aa8ff'},sk:{n:'SKIN CRATE',p:750,col:'#ff7a2a'}};
  const I={};
  const add=(t,id,n,r,o)=>{I[id]=Object.assign({id,t,n,r,shop:true,crate:true},o||{});};
  // ---- skins ----
  add('sk','def','Classic Survivor','c',{shop:false,crate:false,free:true});
  const D=[['Sheriff','r'],['Masked Outlaw','r'],['Poncho Rider','c'],['Prospector','c'],['Gambler','r'],['Banker','c'],['Sun Hat Drifter','c'],['Blue Bandit','c'],['Railroad Engineer','r'],['Undertaker','e'],['Saloon Star','e'],['Bounty Hunter','e'],['Gold Digger','r'],['Desert Raider','c'],['Dust Devil Punk','l']];
  D.forEach((d,i)=>add('sk','d'+(i+1),d[0],d[1],{set:'Desert',src:['az6',i],aura:d[1]==='l'?'fire':null}));
  add('sk','h1','Teal Track Jacket','c',{set:'Horizon High',src:['az0',6]});
  add('sk','h2','Varsity Captain','r',{set:'Horizon High',src:['az0',7]});
  const S=[['Hard Hat Hero','c'],['Lab Assistant','r'],['Hazmat Monitor','e'],['Cadet','c'],['Safety Officer','c'],['Night Welder','r'],['Field Scout','c'],['Shadow Ops','e']];
  S.forEach((d,i)=>add('sk','s'+(i+1),d[0],d[1],{set:'Second Floor',src:['az1',i]}));
  const M=[['DJ Neon','r'],['Arcade Ace','r'],['Toxic Punk','e'],['Mall Walker','c'],['Pop Star','r'],['Ultraviolet','e'],['Fire Starter','e'],['Ice Cool','c']];
  M.forEach((d,i)=>add('sk','m'+(i+1),d[0],d[1],{set:'Midnight Mall',src:['az4',i]}));
  add('sk','x1','Ghost Pilgrim','l',{set:'Crate Legends',shop:false,src:['own','x1'],aura:'ghost'});
  add('sk','x2','Golden Gunslinger','l',{set:'Crate Legends',shop:false,src:['own','x2'],aura:'gold'});
  add('sk','x3','Neon Nightmare','l',{set:'Crate Legends',shop:false,src:['own','x3'],aura:'neon'});
  const T=[['Scarecrow','e','leaf'],['Harvest Chef','e','leaf'],['Pilgrim Captain','l','gold'],['Pumpkin King','l','fire'],['Turkey Tom','l','feather']];
  T.forEach((d,i)=>add('sk','t'+(i+1),d[0],d[1],{set:'Harvest Pass',shop:false,crate:false,pass:true,src:['own','t'+(i+1)],aura:d[2]}));
  // ---- name colors ----
  add('nc','n0','Classic White','c',{shop:false,crate:false,free:true,col:'#ffffff'});
  [['Sunflower','c','#ffd84a'],['Pumpkin','c','#ff9a3c'],['Cranberry','c','#ff5a72'],['Sky','c','#6ac8ff'],['Mint','c','#7affc0'],
   ['Maple','r','#ff6a2a'],['Lavender','r','#c49bff'],['Forest','r','#4ad86a'],['Rose','r','#ff8ad8'],
   ['Candy Corn','e','#ffb020','candy'],['Ember','e','#ff5a1a','ember'],['Gold Shine','l','#ffd24a','gold'],['Rainbow','l','#ff4a4a','rainbow']]
   .forEach((d,i)=>add('nc','n'+(i+1),d[0],d[1],{col:d[2],fx:d[3]||null}));
  // ---- profile frames ----
  add('fr','f0','No Frame','c',{shop:false,crate:false,free:true,css:'#3a2a1a'});
  [['Wood','c','linear-gradient(135deg,#8a5a2a,#c08a4a,#6a4018)'],['Copper','c','linear-gradient(135deg,#b8642a,#f0a060,#8a4418)'],['Autumn Leaves','c','conic-gradient(#ff7a1a,#ffd84a,#c0392b,#ff9a3c,#8a3a0a,#ff7a1a)'],
   ['Silver','r','linear-gradient(135deg,#9aa4b0,#ffffff,#6a7480)'],['Pumpkin Patch','r','repeating-linear-gradient(90deg,#ff8a1c 0 8px,#d0600a 8px 12px)'],['Storm','r','conic-gradient(#6a2ad8,#c06aff,#3a0a7a,#a04aff,#6a2ad8)'],
   ['Gold','e','linear-gradient(135deg,#a87a0a,#ffe27a,#c9962a,#fff3b0)'],['Neon','e','conic-gradient(#ff3ad8,#2ad8ff,#6aff4a,#ffd633,#ff3ad8)'],
   ['Turkey Feathers','l','conic-gradient(#8a3a0a,#e0701c,#ffd84a,#c0392b,#5a2a0a,#e0b030,#8a3a0a)'],['Diamond','l','conic-gradient(#a8f0ff,#ffffff,#6ac8ff,#e8ffff,#4a8cff,#a8f0ff)']]
   .forEach((d,i)=>add('fr','f'+(i+1),d[0],d[1],{css:d[2],anim:d[1]==='l'||d[1]==='e'}));
  add('fr','f11','Champion','x',{shop:false,crate:false,css:'conic-gradient(#ffd24a,#ff5a3a,#ffd24a,#fff3b0,#ffd24a)',anim:true,excl:'Top 3 on the monthly Gun Game ladder'});
  // ---- account levels: the 15 desert skins unlock one by one ----
  const LEVEL_SKINS=['d3','d4','d6','d7','d8','d14','d1','d2','d5','d9','d13','d10','d11','d12','d15'];
  const xpTotal=L=>{L=Math.max(1,L|0);return 300*(L-1)+50*(L-1)*L;};   // total XP needed to reach level L
  const levelReward=L=>{const r=[{c:L<=16?100:150}];if(L>=2&&L<=16)r.push({it:LEVEL_SKINS[L-2]});if(L%5===0)r.push({cr:['nc','fr','sk'][((L/5)-1)%3]});return r;};
  // ---- the season pass (update SEASON to start a new season) ----
  const SEASON={id:'s1',n:'HARVEST HAVOC',sub:'Season 1  -  Thanksgiving',start:'2026-11-20',end:'2027-01-01',xpPer:1000,tiers:[
    [{c:500}],[{it:'n1'}],[{c:150}],[{it:'m4'}],[{cr:'nc'}],[{it:'f1'}],[{c:200}],[{it:'n6'}],[{it:'s4'}],[{it:'t1'},{cr:'fr'}],
    [{c:200}],[{it:'f3'}],[{it:'s5'}],[{it:'n2'}],[{cr:'sk'}],[{c:250}],[{it:'f2'}],[{it:'h1'}],[{it:'n3'}],[{it:'t2'},{cr:'nc'}],
    [{c:250}],[{it:'f5'}],[{it:'m2'}],[{it:'n7'}],[{cr:'sk'}],[{c:300}],[{it:'f4'}],[{it:'s6'}],[{it:'n10'}],[{it:'t3'},{cr:'fr'}],
    [{c:300}],[{it:'f6'}],[{it:'s2'}],[{it:'n9'}],[{cr:'sk'}],[{c:350}],[{it:'f7'}],[{it:'m6'}],[{it:'n11'}],[{it:'t4'},{cr:'sk'}],
    [{c:400}],[{it:'f8'}],[{it:'m7'}],[{it:'n12'}],[{cr:'sk'}],[{c:500}],[{it:'f9'}],[{it:'s8'}],[{c:1000}],[{it:'t5'},{cr:'sk'}]]};
  // ---- quests ----
  const Q={
    // daily: one zombie quest, one Gun Game quest, one general quest every day
    dz:[{id:'dz1',n:'Get 15 zombie kills',k:'zk',g:15},{id:'dz2',n:'Get 40 zombie kills',k:'zk',g:40},{id:'dz3',n:'Survive 5 rounds',k:'rs',g:5},{id:'dz4',n:'Survive 10 rounds',k:'rs',g:10}],
    dg:[{id:'dg1',n:'Win a Gun Game round',k:'ggr',g:1},{id:'dg2',n:'Get 5 Gun Game kills',k:'ggk',g:5},{id:'dg3',n:'Grab a heal pack after a kill',k:'ggh',g:1},{id:'dg4',n:'Make the final 3 in Gun Game twice',k:'ggt3',g:2}],
    dx:[{id:'dx1',n:'Finish 2 games',k:'gc',g:2},{id:'dx2',n:'Play for 15 minutes',k:'tp',g:900,time:1},{id:'dx3',n:'Deal 2,000 damage',k:'dmg',g:2000}],
    w:[{id:'w1',n:'Finish games on 3 different maps',k:'gcm',g:3,set:1},{id:'w2',n:'Get 300 zombie kills',k:'zk',g:300},{id:'w3',n:'Win 3 Gun Game matches',k:'ggm',g:3},{id:'w4',n:'Survive 40 rounds',k:'rs',g:40},{id:'w5',n:'Get 30 Gun Game kills',k:'ggk',g:30}],
    m:[{id:'mq1',n:'Horizon High: reach round 10',k:'br.0',g:10,map:0},{id:'mq2',n:'Horizon High: escape up the stairs',k:'mw.0',g:1,map:0},{id:'mq3',n:'The Second Floor: reach round 10',k:'br.1',g:10,map:1},
       {id:'mq4',n:"Gobbler's Hollow: beat the Gobbler",k:'mw.3',g:1,map:3},{id:'mq5',n:'Midnight Mall: survive all 20 rounds',k:'mw.4',g:1,map:4},
       {id:'mq6',n:'Western Arizona City: reach round 10',k:'br.5',g:10,map:5},{id:'mq7',n:'Western Arizona City: reach round 20',k:'br.5',g:20,map:5},{id:'mq8',n:'Gun Game: win a match',k:'ggm',g:1,map:6}],
    g:[{id:'gq1',n:'Win a round with a melee weapon',k:'ggml',g:1},{id:'gq2',n:'Survive the storm to the last 3',k:'ggt3',g:1},{id:'gq3',n:'Get a barrel kill',k:'ggbk',g:1},{id:'gq4',n:'Grab 5 heal packs',k:'ggh',g:5},
       {id:'gq5',n:'Get 25 Gun Game kills',k:'ggk',g:25},{id:'gq6',n:'Win 10 Gun Game rounds',k:'ggr',g:10},{id:'gq7',n:'Win 5 Gun Game matches',k:'ggm',g:5},{id:'gq8',n:'Win 3 matches in a row',k:'ggbs',g:3}]
  };
  const QR={d:[{x:250},{c:75}],w:[{x:1200},{c:300}],m:[{x:1000},{c:400}],g:[{x:600},{c:200}]};
  const XP={zk:5,rs:40,gc:100,mw:500,ggk:30,ggr:80,ggm:300,ggl:60,ggt3:20};
  const CO={rs:5,gc:25,mw:250,ggr:20,ggm:100};
  const LADDER={pts:{ggk:1,ggr:3,ggm:10},prize:[{c:3000,it:'f11'},{c:2000,it:'f11'},{c:1500,it:'f11'},{c:750},{c:750},{c:750},{c:750},{c:750},{c:750},{c:750}]};
  const MAPN=['Horizon High','The Second Floor','The Final Lesson',"Gobbler's Hollow",'Midnight Mall','Western Arizona City','Gun Game'];
  return {RAR,PRICE,CRATE,I,LEVEL_SKINS,xpTotal,levelReward,SEASON,Q,QR,XP,CO,LADDER,MAPN};
})();

/* ===== the account server (one Vercel function, no packages needed) ===== */
const crypto=require('crypto');
const SRV_V='1.0';
const SESS_TTL=60*60*24*45;               // logins last 45 days (refreshed every visit)
const DAY=86400000,PT=8*3600000;           // days and weeks roll over at midnight Pacific time
const BAD=['fuck','shit','bitch','cunt','dick','pussy','nigg','fag','rape','nazi','porn','sex','cock','whore','slut','penis','vagin','hitler','kkk','retard'];

function U(msg,code){const e=new Error(msg);e.user=1;e.code=code||400;return e;}
function envDB(){
  const e=process.env;
  const keys=Object.keys(e).filter(k=>/(_REST_API_URL|_REDIS_REST_URL)$/.test(k)&&e[k]).sort((a,b)=>(/^KV_/.test(a)?-1:0)-(/^KV_/.test(b)?-1:0));
  for(const k of keys){const tk=k.replace(/URL$/,'TOKEN');if(e[tk])return {url:String(e[k]).replace(/\/+$/,''),tok:e[tk],un:k};}
  return null;
}
async function R(db,cmd){
  const r=await fetch(db.url,{method:'POST',headers:{Authorization:'Bearer '+db.tok,'Content-Type':'application/json'},body:JSON.stringify(cmd)});
  let j;try{j=await r.json();}catch(e){throw new Error('database gave a bad answer ('+r.status+')');}
  if(j&&j.error)throw new Error('database: '+j.error);
  return j?j.result:null;
}
async function RP(db,cmds){
  if(!cmds.length)return [];
  const r=await fetch(db.url+'/pipeline',{method:'POST',headers:{Authorization:'Bearer '+db.tok,'Content-Type':'application/json'},body:JSON.stringify(cmds)});
  let j;try{j=await r.json();}catch(e){throw new Error('database gave a bad answer ('+r.status+')');}
  if(!Array.isArray(j))throw new Error('database: '+((j&&j.error)||'bad pipeline answer'));
  return j.map(x=>{if(x&&x.error)throw new Error('database: '+x.error);return x?x.result:null;});
}
async function readBody(req){
  if(req.body&&typeof req.body==='object'&&!Buffer.isBuffer(req.body))return req.body;
  if(typeof req.body==='string'){try{return JSON.parse(req.body||'{}');}catch(e){return {};}}
  if(Buffer.isBuffer(req.body)){try{return JSON.parse(req.body.toString('utf8')||'{}');}catch(e){return {};}}
  return await new Promise(res=>{let s='';req.on('data',c=>{s+=c;if(s.length>200000)s='';});req.on('end',()=>{try{res(JSON.parse(s||'{}'));}catch(e){res({});}});req.on('error',()=>res({}));});
}
function qs(req){if(req.query)return req.query;const o={};const i=(req.url||'').indexOf('?');if(i>=0)for(const kv of req.url.slice(i+1).split('&')){const [k,v]=kv.split('=');o[decodeURIComponent(k)]=decodeURIComponent(v||'');}return o;}
const ln=n=>String(n||'').toLowerCase();
function cleanUser(n){
  n=String(n||'').trim();
  if(!/^[A-Za-z0-9_]{3,11}$/.test(n))throw U('Usernames are 3 to 11 letters, numbers or _ (no spaces).');
  const l=n.toLowerCase().replace(/_/g,'');if(BAD.some(b=>l.includes(b)))throw U('Please pick a different username.');
  return n;
}
function cleanPass(p){p=String(p||'');if(p.length<4)throw U('Passwords need at least 4 characters.');if(p.length>64)throw U('That password is too long.');return p;}
const hashPw=(pw,salt)=>crypto.scryptSync(String(pw),String(salt),32).toString('hex');
const same=(a,b)=>{try{const x=Buffer.from(String(a),'hex'),y=Buffer.from(String(b),'hex');return x.length===y.length&&x.length>0&&crypto.timingSafeEqual(x,y);}catch(e){return false;}};
function recCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';const b=crypto.randomBytes(12);for(let i=0;i<12;i++)s+=A[b[i]%A.length];return s.slice(0,4)+'-'+s.slice(4,8)+'-'+s.slice(8);}
const normRC=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const dayKey=(t)=>Math.floor(((t||Date.now())-PT)/DAY);
const weekKey=(t)=>Math.floor((dayKey(t)+3)/7);
function monthKey(t,back){const d=new Date((t||Date.now())-PT);let y=d.getUTCFullYear(),m=d.getUTCMonth()-(back||0);while(m<0){m+=12;y--;}return y+'-'+String(m+1).padStart(2,'0');}
function seed(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return ()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return ((h>>>0)%100000)/100000;};}
function ip(req){return String((req.headers&&(req.headers['x-forwarded-for']||req.headers['x-real-ip']))||'?').split(',')[0].trim().slice(0,60);}
async function limit(db,key,max,sec){const r=await RP(db,[['SET','rl:'+key,'0','EX',sec,'NX'],['INCR','rl:'+key]]);return (r[1]|0)>max;}

/* ---------- profiles ---------- */
function newUser(n,pw,rc){
  const ps=crypto.randomBytes(12).toString('hex'),rs=crypto.randomBytes(12).toString('hex');
  return fix({v:1,n,ph:hashPw(pw,ps),ps,rh:hashPw(normRC(rc),rs),rs,c:Date.now()});
}
function fix(u){
  u.v=1;u.xp=u.xp|0;u.lv=Math.max(1,u.lv|0);u.co=u.co|0;u.st=u.st||{};
  for(const k of ['gcm','mw','br','gp'])u.st[k]=u.st[k]||{};
  u.inv=u.inv||{};u.inv.sk=u.inv.sk||['def'];u.inv.nc=u.inv.nc||['n0'];u.inv.fr=u.inv.fr||['f0'];u.inv.cr=Object.assign({nc:0,fr:0,sk:0},u.inv.cr||{});
  u.eq=Object.assign({sk:'def',nc:'n0',fr:'f0'},u.eq||{});
  u.q=u.q||{};u.q.done=u.q.done||[];
  u.sp=u.sp||{id:null,xp:0,got:0};u.lad=u.lad||{paid:''};u.nt=u.nt||[];u.fx=u.fx||{};
  return u;
}
async function loadUser(db,l){const s=await R(db,['GET','u:'+l]);if(!s)return null;try{return fix(JSON.parse(s));}catch(e){return null;}}
function card(u){return {n:u.n,lv:u.lv,nc:u.eq.nc,fr:u.eq.fr,sk:u.eq.sk};}
async function saveUser(db,u){await RP(db,[['SET','u:'+ln(u.n),JSON.stringify(u)],['SET','pc:'+ln(u.n),JSON.stringify(card(u))]]);}
async function auth(db,b){
  const tok=String(b.tok||'');if(!/^[a-f0-9]{48}$/.test(tok))throw U('Please log in again.',401);
  const r=await RP(db,[['GET','s:'+tok],['EXPIRE','s:'+tok,SESS_TTL]]);
  if(!r[0])throw U('Your login ran out. Please log in again.',401);
  const u=await loadUser(db,r[0]);if(!u)throw U('That account was not found.',401);
  return u;
}
async function newSession(db,u){const tok=crypto.randomBytes(24).toString('hex');await R(db,['SET','s:'+tok,ln(u.n),'EX',SESS_TTL]);return tok;}

/* ---------- rewards ---------- */
const own=(u,id)=>{const it=ACAT.I[id];return !!it&&(u.inv[it.t]||[]).includes(id);};
const dupCoins=it=>Math.round(((ACAT.PRICE[it.t]||{})[it.r]||200)*0.4);
function give(u,rw,G,why){
  for(const r of rw){
    if(r.c){u.co+=r.c;G.co+=r.c;G.list.push({k:'c',v:r.c,why});}
    if(r.x)addXP(u,r.x,G,why);
    if(r.cr){u.inv.cr[r.cr]=(u.inv.cr[r.cr]|0)+1;G.list.push({k:'cr',v:r.cr,why});}
    if(r.it){const it=ACAT.I[r.it];if(!it)continue;
      if(own(u,r.it)){const d=dupCoins(it);u.co+=d;G.co+=d;G.list.push({k:'dup',v:r.it,c:d,why});}
      else{u.inv[it.t].push(r.it);G.list.push({k:'it',v:r.it,why});}}
  }
}
function seasonOn(t){const S=ACAT.SEASON;t=t||Date.now();return t>=Date.parse(S.start+'T08:00:00Z')&&t<Date.parse(S.end+'T08:00:00Z');}
function tiers(u,G){
  const S=ACAT.SEASON;if(u.sp.id!==S.id){if(!seasonOn())return;u.sp={id:S.id,xp:0,got:0};}
  const reach=Math.min(S.tiers.length,1+Math.floor(u.sp.xp/S.xpPer));
  while(u.sp.got<reach){u.sp.got++;give(u,S.tiers[u.sp.got-1],G,'Season tier '+u.sp.got);G.tier=u.sp.got;}
}
function addXP(u,x,G,why,noPass){
  x=Math.max(0,Math.round(x));if(!x)return;u.xp+=x;G.xp+=x;
  if(!noPass&&seasonOn()&&u.sp.id===ACAT.SEASON.id)u.sp.xp+=x;
  while(u.lv<100&&u.xp>=ACAT.xpTotal(u.lv+1)){u.lv++;G.lv=u.lv;give(u,ACAT.levelReward(u.lv),G,'Level '+u.lv);}
}
function nowQuests(u,l){
  const dk=dayKey(),wk=weekKey(),Q=ACAT.Q;
  if(!u.q.d||u.q.d.k!==dk){const r=seed(l+'|d|'+dk),pk=a=>a[Math.floor(r()*a.length)];u.q.d={k:dk,l:[pk(Q.dz),pk(Q.dg),pk(Q.dx)].map(q=>({id:q.id,p:0,s:[]}))};}
  if(!u.q.w||u.q.w.k!==wk){const r=seed(l+'|w|'+wk),a=Q.w.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}u.q.w={k:wk,l:a.slice(0,3).map(q=>({id:q.id,p:0,s:[]}))};}
}
const qdef=id=>{for(const k in ACAT.Q)for(const q of ACAT.Q[k])if(q.id===id)return q;return null;};
function statAt(st,k){if(k.indexOf('.')<0)return st[k]|0;const [a,b]=k.split('.');return (st[a]&&st[a][b])|0;}
async function ladderPay(db,u){
  const prev=monthKey(0,1);if(u.lad.paid===prev)return;u.lad.paid=prev;
  const r=await RP(db,[['ZREVRANK','lad:'+prev,ln(u.n)],['ZSCORE','lad:'+prev,ln(u.n)]]);
  const rk=r[0],sc=+r[1]||0;if(rk===null||rk===undefined||sc<=0)return;
  const P=ACAT.LADDER.prize[rk|0];if(!P)return;
  const G={xp:0,co:0,list:[]};const rw=[{c:P.c}];if(P.it)rw.push({it:P.it});give(u,rw,G,'Ladder #'+((rk|0)+1));
  u.nt.push({k:'lad',m:prev,rk:(rk|0)+1,g:G.list});
}
function view(u){
  const S=ACAT.SEASON;
  const v={n:u.n,lv:u.lv,xp:u.xp,xpL:ACAT.xpTotal(u.lv),xpN:ACAT.xpTotal(u.lv+1),co:u.co,st:u.st,inv:u.inv,eq:u.eq,
    q:{d:u.q.d,w:u.q.w,done:u.q.done},sp:u.sp.id===S.id?u.sp:{id:S.id,xp:0,got:0},son:seasonOn(),nt:u.nt.slice(-6),rcw:!!u.rcw};
  return v;
}

/* ---------- actions ---------- */
const H={};
H.reg=async(db,b,req)=>{
  if(await limit(db,'reg:'+ip(req),8,3600))throw U('Too many new accounts from here. Try again in an hour.',429);
  const n=cleanUser(b.name),pw=cleanPass(b.pass);
  const rc=recCode(),u=newUser(n,pw,rc);u.rcw=1;
  const ok=await R(db,['SET','u:'+ln(n),JSON.stringify(u),'NX']);
  if(ok!=='OK')throw U('That username is taken. Try another one.');
  const G={xp:0,co:0,list:[]};nowQuests(u,ln(n));tiers(u,G);u.lad.paid=monthKey(0,1);
  await saveUser(db,u);const tok=await newSession(db,u);
  return {tok,rc,me:view(u),g:G};
};
H.login=async(db,b,req)=>{
  const n=String(b.name||'').trim(),l=ln(n);if(!l)throw U('Type your username.');
  if(await limit(db,'lg:'+l,12,900)||await limit(db,'lgip:'+ip(req),40,900))throw U('Too many tries. Wait 15 minutes and try again.',429);
  const u=await loadUser(db,l);if(!u||!same(u.ph,hashPw(String(b.pass||''),u.ps)))throw U('Wrong username or password.',401);
  await R(db,['DEL','rl:lg:'+l]);
  const G={xp:0,co:0,list:[]};nowQuests(u,l);tiers(u,G);await ladderPay(db,u);await saveUser(db,u);
  const tok=await newSession(db,u);return {tok,me:view(u),g:G};
};
H.recover=async(db,b,req)=>{
  const l=ln(String(b.name||'').trim());if(!l)throw U('Type your username.');
  if(await limit(db,'rc:'+l,8,3600)||await limit(db,'rcip:'+ip(req),30,3600))throw U('Too many tries. Try again later.',429);
  const pw=cleanPass(b.pass);const u=await loadUser(db,l);
  if(!u||!same(u.rh,hashPw(normRC(b.rc),u.rs)))throw U('That recovery code does not match this username.',401);
  const rc=recCode();u.ps=crypto.randomBytes(12).toString('hex');u.ph=hashPw(pw,u.ps);u.rs=crypto.randomBytes(12).toString('hex');u.rh=hashPw(normRC(rc),u.rs);u.rcw=1;
  const G={xp:0,co:0,list:[]};nowQuests(u,l);tiers(u,G);await ladderPay(db,u);await saveUser(db,u);
  const tok=await newSession(db,u);return {tok,rc,me:view(u),g:G};
};
H.out=async(db,b)=>{const tok=String(b.tok||'');if(/^[a-f0-9]{48}$/.test(tok))await R(db,['DEL','s:'+tok]);return {};};
H.me=async(db,b)=>{const u=await auth(db,b);const G={xp:0,co:0,list:[]};nowQuests(u,ln(u.n));tiers(u,G);await ladderPay(db,u);await saveUser(db,u);return {me:view(u),g:G};};
H.rcok=async(db,b)=>{const u=await auth(db,b);u.rcw=0;await saveUser(db,u);return {me:view(u)};};
H.seen=async(db,b)=>{const u=await auth(db,b);u.nt=[];await saveUser(db,u);return {me:view(u)};};

const CAP={zk:600,rs:20,gc:3,ggk:60,ggr:12,ggt3:12,ggml:6,ggbk:12,ggh:20,dmg:60000};
H.rep=async(db,b)=>{
  const u=await auth(db,b),l=ln(u.n),now=Date.now();
  if(now-(u.fx.lr||0)<5000)throw U('Slow down',429);
  const since=u.fx.lr?Math.min(3600,(now-u.fx.lr)/1000):900;u.fx.lr=now;
  const d=b.d||{},n=(k)=>Math.max(0,Math.min(CAP[k]||0,Math.floor(+d[k]||0)));
  const maps=a=>Array.isArray(a)?[...new Set(a.map(x=>x|0).filter(x=>x>=0&&x<=6&&x!==2))].slice(0,4):[];
  const D={};for(const k in CAP)D[k]=n(k);
  D.tp=Math.max(0,Math.min(since+90,Math.floor(+d.tp||0),3600));
  const gcm=maps(d.gcm),mw=maps(d.mw),ggo=Array.isArray(d.ggo)?d.ggo.slice(0,3).map(x=>x?1:0):[];
  D.ggm=ggo.filter(x=>x).length;D.gc=Math.max(D.gc,0);
  const st=u.st;
  for(const k in D)st[k]=(st[k]|0)+D[k];
  for(const m of gcm){st.gcm[m]=(st.gcm[m]|0)+1;}
  for(const m of mw){st.mw[m]=(st.mw[m]|0)+1;}
  if(d.br&&typeof d.br==='object')for(const k in d.br){const m=k|0,v=Math.min(80,Math.floor(+d.br[k]||0));if(m>=0&&m<=6&&m!==2&&v>(st.br[m]|0))st.br[m]=v;}
  for(const o of ggo){st.ggd=(st.ggd|0)+1;if(o){st.ggst=(st.ggst|0)+1;if(st.ggst>(st.ggbs|0))st.ggbs=st.ggst;}else st.ggst=0;}
  const G={xp:0,co:0,list:[],q:[]};
  nowQuests(u,l);tiers(u,G);
  const X=ACAT.XP,C=ACAT.CO;
  addXP(u,D.zk*X.zk+D.rs*X.rs+D.gc*X.gc+mw.length*X.mw+D.ggk*X.ggk+D.ggr*X.ggr+D.ggm*X.ggm+(ggo.length-D.ggm)*X.ggl+D.ggt3*X.ggt3,G,'Playing');
  const coins=D.rs*C.rs+D.gc*C.gc+mw.length*C.mw+D.ggr*C.ggr+D.ggm*C.ggm;if(coins>0){u.co+=coins;G.co+=coins;}
  // daily + weekly quests
  for(const [grp,rw] of [['d',ACAT.QR.d],['w',ACAT.QR.w]]){
    for(const q of u.q[grp].l){if(q.dn)continue;const def=qdef(q.id);if(!def)continue;
      if(def.set){q.s=q.s||[];for(const m of gcm)if(!q.s.includes(m))q.s.push(m);q.p=q.s.length;}
      else q.p+=(def.k==='ggm'?D.ggm:(D[def.k]|0));
      if(q.p>=def.g){q.p=def.g;q.dn=1;G.q.push(q.id);give(u,rw,G,def.n);}}
  }
  // one-time map + Gun Game quests
  for(const [grp,rw] of [['m',ACAT.QR.m],['g',ACAT.QR.g]])for(const def of ACAT.Q[grp]){
    if(u.q.done.includes(def.id))continue;if(statAt(st,def.k)>=def.g){u.q.done.push(def.id);G.q.push(def.id);give(u,rw,G,def.n);}
  }
  tiers(u,G);
  const L=ACAT.LADDER.pts,pts=D.ggk*L.ggk+D.ggr*L.ggr+D.ggm*L.ggm;const mk=monthKey();
  const cmds=[['SET','u:'+l,JSON.stringify(u)],['SET','pc:'+l,JSON.stringify(card(u))]];
  if(pts>0)cmds.push(['ZINCRBY','lad:'+mk,pts,l],['EXPIRE','lad:'+mk,60*60*24*120]);
  await RP(db,cmds);
  return {me:view(u),g:G};
};
H.buy=async(db,b)=>{
  const u=await auth(db,b),it=ACAT.I[b.id];
  if(!it||!it.shop)throw U('That item is not in the shop.');if(own(u,it.id))throw U('You already own that.');
  const p=ACAT.PRICE[it.t][it.r];if(u.co<p)throw U('You need '+(p-u.co)+' more coins.');
  u.co-=p;u.inv[it.t].push(it.id);await saveUser(db,u);return {me:view(u),got:it.id};
};
H.crate=async(db,b)=>{
  const u=await auth(db,b),t=String(b.t||''),C=ACAT.CRATE[t];if(!C)throw U('Unknown crate.');
  let free=false;
  if((u.inv.cr[t]|0)>0){u.inv.cr[t]--;free=true;}else{if(u.co<C.p)throw U('You need '+(C.p-u.co)+' more coins.');u.co-=C.p;}
  const pool=Object.values(ACAT.I).filter(i=>i.t===t&&i.crate);
  const R0=ACAT.RAR,rr=Math.random()*100;let acc=0,rar='c';
  for(const k of ['l','e','r','c']){acc+=R0[k].w;if(rr<acc){rar=k;break;}}
  let ch=pool.filter(i=>i.r===rar);if(!ch.length)ch=pool;
  const it=ch[Math.floor(Math.random()*ch.length)];
  const G={xp:0,co:0,list:[]};give(u,[{it:it.id}],G,C.n);
  await saveUser(db,u);
  const dup=G.list[0]&&G.list[0].k==='dup'?G.list[0].c:0;
  return {me:view(u),got:it.id,dup,free};
};
H.eq=async(db,b)=>{
  const u=await auth(db,b),it=ACAT.I[b.id];if(!it||!['sk','nc','fr'].includes(it.t))throw U('Unknown item.');
  if(!own(u,it.id))throw U('You do not own that yet.');u.eq[it.t]=it.id;await saveUser(db,u);return {me:view(u)};
};
/* friends */
async function friendOK(db,name){const l=ln(String(name||'').trim());if(!/^[a-z0-9_]{3,11}$/.test(l))throw U('Type a real username.');const ex=await R(db,['EXISTS','u:'+l]);if(!ex)throw U('Nobody has the username "'+String(name).slice(0,11)+'".');return l;}
H.fadd=async(db,b)=>{
  const u=await auth(db,b),me=ln(u.n),them=await friendOK(db,b.name);if(them===me)throw U('You cannot friend yourself!');
  const r=await RP(db,[['SISMEMBER','fr:'+me,them],['SISMEMBER','frq:'+me,them],['SCARD','fr:'+me],['SCARD','frq:'+them]]);
  if(r[0])throw U('You are already friends.');
  if(r[2]>=60)throw U('Your friends list is full (60).');
  if(r[1]){await RP(db,[['SADD','fr:'+me,them],['SADD','fr:'+them,me],['SREM','frq:'+me,them],['SREM','frq:'+them,me]]);return {msg:'You are now friends!'};}
  if(r[3]>=40)throw U('That player has too many friend requests right now.');
  await R(db,['SADD','frq:'+them,me]);return {msg:'Friend request sent!'};
};
H.facc=async(db,b)=>{const u=await auth(db,b),me=ln(u.n),them=ln(b.name);const r=await R(db,['SISMEMBER','frq:'+me,them]);if(!r)throw U('That request is gone.');await RP(db,[['SADD','fr:'+me,them],['SADD','fr:'+them,me],['SREM','frq:'+me,them],['SREM','frq:'+them,me]]);return {msg:'You are now friends!'};};
H.fdec=async(db,b)=>{const u=await auth(db,b);await R(db,['SREM','frq:'+ln(u.n),ln(b.name)]);return {};};
H.frem=async(db,b)=>{const u=await auth(db,b),me=ln(u.n),them=ln(b.name);await RP(db,[['SREM','fr:'+me,them],['SREM','fr:'+them,me]]);return {};};
H.fl=async(db,b)=>{
  const u=await auth(db,b),me=ln(u.n);const r=await RP(db,[['SMEMBERS','fr:'+me],['SMEMBERS','frq:'+me]]);
  const fr=(r[0]||[]).slice(0,60),rq=(r[1]||[]).slice(0,40),all=fr.concat(rq);
  let cards=[],on=[];
  if(all.length){cards=await R(db,['MGET',...all.map(x=>'pc:'+x)]);}
  if(fr.length){on=await R(db,['MGET',...fr.map(x=>'on:'+x)]);}
  const P=s=>{try{return JSON.parse(s);}catch(e){return null;}};
  return {fr:fr.map((x,i)=>({c:P(cards[i])||{n:x,lv:1},on:P(on[i])})),rq:rq.map((x,i)=>({c:P(cards[fr.length+i])||{n:x,lv:1}}))};
};
H.hb=async(db,b)=>{
  const u=await auth(db,b),me=ln(u.n),s=b.s||{};
  const o={t:Date.now(),ph:String(s.ph||'menu').slice(0,8),c:/^[A-Z0-9]{5}$/.test(String(s.c||''))?String(s.c):'',m:Math.max(-1,Math.min(6,s.m|0)),n:Math.max(0,Math.min(15,s.n|0)),x:Math.max(0,Math.min(15,s.x|0)),p:s.p?1:0};
  const r=await RP(db,[['SET','on:'+me,JSON.stringify(o),'EX',100],['SCARD','frq:'+me]]);
  return {rq:r[1]|0};
};
H.prof=async(db,b)=>{
  await auth(db,b);const u=await loadUser(db,ln(b.name));if(!u)throw U('Player not found.');
  return {p:{n:u.n,lv:u.lv,eq:u.eq,st:u.st,c:u.c,nsk:u.inv.sk.length}};
};
H.lad=async(db,b)=>{
  const u=await auth(db,b),me=ln(u.n),mk=monthKey(),pk=monthKey(0,1);
  const r=await RP(db,[['ZREVRANGE','lad:'+mk,0,19,'WITHSCORES'],['ZREVRANK','lad:'+mk,me],['ZSCORE','lad:'+mk,me],['ZREVRANGE','lad:'+pk,0,2,'WITHSCORES']]);
  const pairs=a=>{const o=[];for(let i=0;i+1<(a||[]).length;i+=2)o.push([a[i],+a[i+1]]);return o;};
  const top=pairs(r[0]),prev=pairs(r[3]);const names=[...new Set(top.concat(prev).map(x=>x[0]))];
  const cards=names.length?await R(db,['MGET',...names.map(x=>'pc:'+x)]):[];const cm={};names.forEach((x,i)=>{try{cm[x]=JSON.parse(cards[i]);}catch(e){cm[x]={n:x,lv:1};}});
  return {m:mk,top:top.map(x=>({c:cm[x[0]]||{n:x[0]},p:x[1]})),my:{rk:r[1]===null?null:(r[1]|0)+1,p:+r[2]||0},prev:{m:pk,top:prev.map(x=>({c:cm[x[0]]||{n:x[0]},p:x[1]}))}};
};

module.exports=async function handler(req,res){
  const send=(code,obj)=>{res.statusCode=code;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(obj));};
  try{
    const q=qs(req),b=req.method==='POST'?await readBody(req):{};const a=String(b.a||q.a||'');
    const db=envDB();
    if(a==='ping'||(req.method==='GET'&&!a)){
      let st='missing',err=null;
      if(db){try{const p=await R(db,['PING']);st=p?'connected':'error';}catch(e){st='error';err=String(e.message||e).slice(0,160);}}
      return send(200,{ok:true,server:"Smalley's Zombies accounts",v:SRV_V,database:st,dbVariable:db?db.un:null,error:err,season:ACAT.SEASON.id,
        help:st==='connected'?'Everything works! Accounts are ready.':st==='missing'?'No database is connected. In Vercel open Storage, connect an Upstash Redis database to this project, then redeploy.':'The database is connected but did not answer. Check the Upstash database still exists, then redeploy.'});
    }
    if(!db)return send(503,{ok:false,err:'Accounts are not set up on this site yet (no database connected).'});
    if(req.method!=='POST')return send(405,{ok:false,err:'Use POST.'});
    const f=H[a];if(!f)return send(400,{ok:false,err:'Unknown action.'});
    const out=await f(db,b,req);
    return send(200,Object.assign({ok:true},out));
  }catch(e){
    if(e&&e.user)return send(e.code||400,{ok:false,err:e.message});
    console.error(e);return send(500,{ok:false,err:'The account server had a problem: '+String((e&&e.message)||e).slice(0,140)});
  }
};
