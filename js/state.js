"use strict";
// ---------- game start · solidity · fx ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- game start ----------
function mkPlayer(id){
  return{id,x:8.5*TILE,y:5.5*TILE,hp:6,maxhp:6,bonushp:0,r:TILE*.27,
    cd:0,cdMax:.38,dmg:1,hurtCd:0,face:1,walk:0,down:false,fdx:1,fdy:0};
}
function start(np){
  computeLayout(false);
  const acd={};for(const k in ACD_MAX)acd[k]=0;
  game={
    twoP:np===2,mode:'cave',depth:1,towerTier:0,kills:0,dead:false,
    players:[],hunger:100,starveT:0,
    rooms:null,cur:null,
    stones:[],spits:[],bolas:[],parts:[],floats:[],
    trans:null,time:0,clearFlash:0,
    mats:{flint:0,wood:0,bone:0,sinew:0,feather:0,fang:0,obsidian:0},
    items:[],stats:{},actives:[],acd,
    skillLv:{volley:1,step:1,howl:1,wrath:1},scd:{volley:0,step:0,howl:0},
    xp:0,level:1,pendingPts:0,ultCharge:0,lvlOpen:false,
    blockT:0,shieldT:0,decoy:null,reviveUsed:false,regenT:0,
    warT:0,hordeBuff:0,warMsgT:60,
    pierce:0,projMul:1,craftOpen:false,
  };
  game.players.push(mkPlayer(0));
  if(game.twoP)game.players.push(mkPlayer(1));
  recalcStats();
  newCaveFloor();
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('death').classList.add('hidden');
  document.getElementById('pause').classList.add('hidden');
  document.getElementById('controls').textContent=IS_TOUCH?
    'LEFT THUMB: MOVE · '+(aimMode==='twin'?'RIGHT THUMB: AIM & FIRE':'HOLD ⦿ TO THROW (AUTO-AIM)')+' · TAP SKILLS, TOOLS & SHOP':
    (game.twoP?
    'P1: WASD·MOUSE·SPACE · Q/E/R+F SKILLS · 1/2 TOOLS   P2: ARROWS·ENTER · RSHIFT/RCTRL//·. SKILLS   [C] SHOP':
    'WASD MOVE · MOUSE AIM · SPACE THROW · Q/E/R SKILLS · F WRATH · 1/2 TOOLS · [C] SHOP · [T] LEVEL UP');
}
function placePlayers(x,y){
  game.players.forEach((p,i)=>{
    p.x=x+(i?TILE*.5:game.twoP?-TILE*.5:0);p.y=y;
  });
}
function revivePlayers(){
  for(const p of game.players){
    if(p.down){p.down=false;p.hp=2;floatText(p.x,p.y-TILE*.6,'URM GIVES ANOTHER STONE','#c1642a');}
  }
}
function newCaveFloor(){
  game.mode='cave';
  game.rooms=genFloor();
  game.cur=game.rooms[key(0,0)];
  buildRoom(game.cur,game.cur.tier);
  placePlayers(8.5*TILE,5.5*TILE);
  revivePlayers();
  game.stones.length=0;game.spits.length=0;game.bolas.length=0;
  showMsg('THE FIRST TOWER OPENS  ·  FARM THE LANES & JUNGLE, PUSH NORTH, FELL THE GUARDIAN');
}
function newTowerFloor(){
  game.mode='tower';
  const room={gx:0,gy:0,type:'tower',visited:true,cleared:false,spawned:true,
    seed:(Math.random()*1e9)|0,obst:null,live:[],items:[],grok:null,shrine:null,slabT:0,tileHP:{},drops:[],doors:{}};
  game.rooms={'0,0':room};
  game.cur=room;
  buildRoom(room,game.depth);
  room.live.push(newBoss(game.towerTier));
  placePlayers(8.5*TILE,8.6*TILE);
  revivePlayers();
  game.stones.length=0;game.spits.length=0;game.bolas.length=0;
  sfx('boss');shake=8;
  showMsg(TOWER_LORE[Math.min(game.towerTier-1,TOWER_LORE.length-1)]);
}
document.getElementById('startbtn').addEventListener('click',()=>{audio();start(1);});
document.getElementById('start2btn').addEventListener('click',()=>{audio();start(2);});

// ---------- solidity ----------
function isDoorTile(ti,tj){for(const d in DOOR){if(DOOR[d].ti===ti&&DOOR[d].tj===tj)return d;}return null;}
// free roam: doors are never locked — you rove the map, farm, sneak, retreat
function roomDoorsOpen(room){return true;}
function solidAt(room,px,py,fly){
  const ti=px/TILE|0,tj=py/TILE|0;
  if(ti<0||tj<0||ti>=C||tj>=R)return true;
  if(ti===0||tj===0||ti===C-1||tj===R-1){
    const d=isDoorTile(ti,tj);
    if(d&&room.doors[d]&&roomDoorsOpen(room))return false;
    return true;
  }
  if(!fly&&room.obst){const c=room.obst[tj][ti];if(c===O_ROCK||c===O_ROOT||c===O_OBROCK)return true;}
  return false;
}
function moveCircle(room,o,dx,dy,fly){
  let nx=o.x+dx;
  const r=o.r;
  if(!solidAt(room,nx-r,o.y-r*.6,fly)&&!solidAt(room,nx+r,o.y-r*.6,fly)&&!solidAt(room,nx-r,o.y+r*.6,fly)&&!solidAt(room,nx+r,o.y+r*.6,fly))o.x=nx;
  let ny=o.y+dy;
  if(!solidAt(room,o.x-r*.6,ny-r,fly)&&!solidAt(room,o.x+r*.6,ny-r,fly)&&!solidAt(room,o.x-r*.6,ny+r,fly)&&!solidAt(room,o.x+r*.6,ny+r,fly))o.y=ny;
}
function cellAtPx(room,px,py){
  const ti=px/TILE|0,tj=py/TILE|0;
  if(ti<1||tj<1||ti>=C-1||tj>=R-1)return O_NONE;
  return room.obst?room.obst[tj][ti]:O_NONE;
}
function keepInRoom(o){
  // hard clamp inside interior; if stuck in a solid tile, nudge toward room center
  const minX=TILE+o.r*.4,maxX=(C-1)*TILE-o.r*.4;
  const minY=TILE+o.r*.4,maxY=(R-1)*TILE-o.r*.4;
  if(o.x<minX)o.x=minX;if(o.x>maxX)o.x=maxX;
  if(o.y<minY)o.y=minY;if(o.y>maxY)o.y=maxY;
  let guard=0;
  const cx=8.5*TILE,cy=5.5*TILE;
  while(guard++<40&&solidAt(game.cur,o.x,o.y,o.fly)){
    const d=Math.hypot(cx-o.x,cy-o.y)||1;
    o.x+=(cx-o.x)/d*3;o.y+=(cy-o.y)/d*3;
  }
}
function alivePlayers(){return game.players.filter(p=>!p.down);}
function nearestPlayer(x,y){
  let best=null,bd=1e9;
  const cands=alivePlayers();
  if(game.decoy)cands.push({x:game.decoy.x,y:game.decoy.y,decoy:true});
  for(const p of cands){
    const d=Math.hypot(p.x-x,p.y-y);
    if(d<bd){bd=d;best=p;}
  }
  return best;
}
function nearestEnemy(x,y){
  let best=null,bd=1e9;
  for(const e of game.cur.live){
    const d=Math.hypot(e.x-x,e.y-y);
    if(d<bd){bd=d;best=e;}
  }
  return best;
}

// ---------- fx ----------
function burst(x,y,color,n,spd){
  for(let i=0;i<n;i++){const a=Math.random()*6.3,v=(0.3+Math.random()*.7)*spd;
    game.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.35+Math.random()*.3,color,size:2+Math.random()*3});}
}
function floatText(x,y,txt,color,pow){game.floats.push({x,y,txt,color,life:1,pow:!!pow,rot:(Math.random()-.5)*.3});}
