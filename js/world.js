"use strict";
// ---------- layout · utils · floor generation · room content ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- layout ----------
let TILE=56,ORX=0,ORY=0,HUDH=64;
function computeLayout(lockTile){
  if(!lockTile)TILE=Math.floor(Math.min((VW-16)/C,(VH-HUDH-(IS_TOUCH?36:24))/R));
  ORX=(VW-C*TILE)/2|0;
  ORY=HUDH+((VH-HUDH-R*TILE)/2|0);
}

// ---------- utils ----------
function hash(i,j,s){let n=i*374761393+j*668265263+s*974634311;n=(n^(n>>13))*1274126177;return((n^(n>>16))>>>0)/4294967295;}
function key(x,y){return x+','+y;}
let game=null,shake=0,msgTimer=0;
function showMsg(t){const m=document.getElementById('msg');m.textContent=t;m.style.opacity=1;msgTimer=2.8;}

// ---------- floor generation ----------
// One persistent MOBA map (no dungeon levels). Base at the bottom (0,0), guardian
// objective at the top (0,-6). Three lanes rise north — SOLO gx=-2, MID gx=0,
// BOT gx=2 — with fractal jungle clusters between them (gx=-1, gx=1): each jungle
// column alternates fight camps ('dino'), hide rooms ('brush', dense cover to
// duck and reposition), and a buff (shrine / relic). Difficulty is by position,
// not by depth: room.tier grows the further north you push (base easy → boss hard).
const MOBA_LANES=[-2,0,2];
function genFloor(){
  const rooms={};
  const add=(x,y,type)=>{rooms[key(x,y)]={gx:x,gy:y,type:type||'normal',tier:Math.max(1,-y),
    visited:false,cleared:false,spawned:false,seed:(Math.random()*1e9)|0,
    obst:null,live:[],items:[],grok:null,shrine:null,slabT:0,tileHP:{},drops:[]};};
  add(0,0,'start');add(-1,0,'grok');add(1,0,'dino');           // base cluster
  // fractal jungle columns: camp / hide / buff, repeating up each side
  const JL={'-1':'brush','-2':'dino','-3':'shrine','-4':'brush','-5':'dino'};
  const JR={'-1':'brush','-2':'dino','-3':'treasure','-4':'brush','-5':'dino'};
  for(let gy=-1;gy>=-5;gy--){
    for(const gx of MOBA_LANES)add(gx,gy,'normal');            // lane creeps
    add(-1,gy,JL[gy]);add(1,gy,JR[gy]);                        // jungle clusters
  }
  add(0,-6,'exit');                                            // guardian objective
  for(const r of Object.values(rooms)){
    r.doors={};
    for(const d of ['n','s','w','e'])if(rooms[key(r.gx+DIRV[d][0],r.gy+DIRV[d][1])])r.doors[d]=true;
  }
  const startR=rooms[key(0,0)];
  startR.cleared=true;startR.spawned=true;startR.visited=true;
  return rooms;
}

// ---------- room content ----------
function buildRoom(room,depth){
  if(room.obst)return;
  const g=(i,j)=>hash(i,j,room.seed);
  const obst=Array.from({length:R},()=>Array(C).fill(O_NONE));
  const laneX=DOOR.n.ti,laneY=DOOR.w.tj;
  if(room.type==='tower'){
    for(const [pi,pj] of [[4,3],[12,3],[4,7],[12,7]])obst[pj][pi]=O_ROCK;
  } else {
    for(let j=2;j<R-2;j++)for(let i=2;i<=C>>1;i++){
      const nearLane=(Math.abs(i-laneX)<=1)||(Math.abs(j-laneY)<=1);
      const center=(Math.abs(i-8)<=2&&Math.abs(j-5)<=1);
      if(nearLane||center)continue;
      const v=g(i,j);
      let cell=O_NONE;
      if(room.type==='water'){if(v<.18)cell=O_WATER;else if(v<.26)cell=O_ROCK;}
      else if(room.type==='brush'){if(v<.30)cell=O_ROOT;else if(v<.42)cell=O_ROCK;}
      else if(room.type==='dino'){if(v<.16)cell=O_ROCK;}
      else if(['treasure','grok','start','shrine'].includes(room.type)){if(v<.06)cell=O_BONES;}
      else{if(v<.1)cell=O_ROCK;else if(v<.14)cell=(depth>=3&&v<.12)?O_OBROCK:O_ROCK;else if(v<.18)cell=O_ROOT;else if(v<.21)cell=O_BONES;else if(v<.24&&depth>=2)cell=O_WATER;}
      obst[j][i]=cell;obst[j][C-1-i]=cell;
    }
    if(room.type==='water'){
      for(let j=4;j<=6;j++)for(let i=6;i<=10;i++)if(!(j===5&&Math.abs(i-8)<=1))obst[j][i]=O_WATER;
    }
  }
  room.obst=obst;
  room.tileHP={};
  room.drops=room.drops||[];
  for(let j=0;j<R;j++)for(let i=0;i<C;i++){
    if(obst[j][i]===O_ROCK)room.tileHP[i+','+j]=3;
    else if(obst[j][i]===O_ROOT)room.tileHP[i+','+j]=2;
    else if(obst[j][i]===O_OBROCK)room.tileHP[i+','+j]=4;
  }
  if(room.type==='shrine')room.shrine={ti:8,tj:5,used:false};
  if(room.type==='treasure')room.items.push({type:(depth>=3?'flint_item':'heart'),ti:8,tj:5,bob:0,pedestal:true});
  if(room.type==='grok')room.grok={ti:8,tj:5,gave:false,t:Math.random()*10};
}
function spawnEnemies(room,depth,entryDir){
  room.spawned=true;
  // the guardian objective is a single boss (killing it wins the run)
  if(room.type==='exit'){room.live.push(newBoss(2));sfx('boss');shake=8;return;}
  const defs=[];
  function pick(pool,n){const out=[];for(let i=0;i<n;i++)out.push(pool[Math.random()*pool.length|0]);return out;}
  const mult=game&&game.twoP?1:0;
  if(room.type==='normal'){
    const pool=['bat','bat','bear','spider'];
    if(depth>=2)pool.push('boar');
    if(depth>=4)pool.push('slither','slither');
    defs.push(...pick(pool,2+Math.min(depth,3)+mult));
  }
  else if(room.type==='water'){defs.push('bat','bat');if(depth>=2)defs.push('dino');if(mult)defs.push('bat');}
  else if(room.type==='dino'){defs.push('dino','dino');defs.push(depth>=2?'boar':'bat');if(depth>=4)defs.push('slither');if(mult)defs.push('dino');}
  else if(room.type==='treasure'&&depth>=3)defs.push(depth>=4?'spider':'bat');
  const ed=DOOR[OPP[entryDir]||'s'];
  const cells=[];
  for(let j=1;j<R-1;j++)for(let i=1;i<C-1;i++){
    const c=room.obst[j][i];
    if(c===O_ROCK||c===O_ROOT||c===O_OBROCK)continue;
    if(Math.hypot(i-ed.ti,j-ed.tj)<4.5)continue;
    if(Math.hypot(i-8,j-5)<2&&room.type==='exit')continue;
    cells.push([i,j]);
  }
  for(const d of defs){
    if(!cells.length)break;
    const [i,j]=cells.splice(Math.random()*cells.length|0,1)[0];
    room.live.push(newEnemy(d,(i+.5)*TILE,(j+.5)*TILE,depth));
  }
  if(room.type==='dino'&&room.live.length)makeLord(room.live[0]); // jungle camp lord
}
function newEnemy(type,x,y,depth){
  const B={
    bat:{hp:2,spd:TILE*2.3,dmg:1,r:TILE*.24,fly:true,spr:SPR.bat,f:.85},
    bear:{hp:6+depth,spd:TILE*1.25,dmg:2,r:TILE*.42,fly:false,spr:SPR.bear,f:1.3},
    dino:{hp:3+((depth/2)|0),spd:TILE*1.1,dmg:1,r:TILE*.3,fly:false,spr:SPR.dino,f:1.05},
    spider:{hp:1,spd:TILE*3.0,dmg:1,r:TILE*.2,fly:false,spr:SPR.spider,f:.72},
    boar:{hp:4+depth,spd:TILE*1.55,dmg:2,r:TILE*.34,fly:false,spr:SPR.boar,f:1.1},
    slither:{hp:5+depth,spd:TILE*1.5,dmg:2,r:TILE*.3,fly:false,spr:SPR.slither,f:1.15},
  }[type];
  const D=DIFF[difficulty];
  // the war escalates: beasts harden slowly over time and with every lord felled
  // (~+40% hp per minute, +12% per lord); noticeable across a long session, not explosive
  const esc=1+(game?game.warT*0.0065+game.hordeBuff*0.12:0);
  const hp2=Math.max(1,Math.round(B.hp*D.hp*esc));
  const dmg2=Math.max(1,Math.round(B.dmg*D.dmg*(1+(game?game.warT*0.0025+game.hordeBuff*0.06:0))));
  return{type,x,y,hp:hp2,maxhp:hp2,spd:B.spd,dmg:dmg2,r:B.r,fly:B.fly,spr:B.spr,sc:TILE*B.f/S,
    ranged:type==='dino'||type==='slither',brave:type==='slither',lungeCd:1.2+Math.random(),
    aggroR:TILE*4.6,march:false,
    vx:0,vy:0,t:Math.random()*10,hitFlash:0,wanderA:Math.random()*6.3,wanderT:0,spitCd:1+Math.random(),slow:0};
}
// jungle elite: tanky, hits harder, bigger, better loot; felling it hardens the horde
function makeLord(e){
  e.lord=true;e.hp=e.maxhp=Math.round(e.maxhp*3.2)+6;e.dmg+=1;e.sc*=1.45;e.r*=1.3;e.spd*=.85;e.aggroR=TILE*5.4;
  return e;
}
// one marching creep enters from the enemy (north) side and pushes south — the
// tower-defense pressure; if it reaches the base edge it despawns (it "pushed on")
function spawnWave(room){
  const pool=room.type==='dino'?['dino','boar','spider']:['bat','bear','spider'];
  if(game.hordeBuff>=2)pool.push('slither');
  const t=pool[Math.random()*pool.length|0];
  const i=3+Math.random()*(C-6)|0;
  const e=newEnemy(t,(i+.5)*TILE,1.5*TILE,room.tier);
  e.march=true;
  room.live.push(e);
}
function newBoss(tier){
  const serpent=tier>=2;
  const D=DIFF[difficulty];
  const bhp=Math.max(8,Math.round((22+12*tier)*D.hp));
  return{boss:true,type:'boss',
    name:serpent?'SLITHER-PRIEST OF THE TOWER':'GHUR, FIRST OF BEARS',
    x:8.5*TILE,y:3.2*TILE,
    hp:bhp,maxhp:bhp,
    spd:TILE*(serpent?1.0:0.9),dmg:2,r:TILE*.6,fly:false,
    spr:serpent?SPR.priest:SPR.ghur,sc:TILE*(serpent?2.2:2.5)/S,
    ranged:false,vx:0,vy:0,t:0,hitFlash:0,wanderA:0,wanderT:0,spitCd:2.5,slow:0,
    state:'chase',atkT:3,wind:0,charge:0,cdx:0,cdy:0,summoned:false,serpent,tier};
}
