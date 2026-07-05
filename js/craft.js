"use strict";
// ---------- loot & crafting · actives · pause/restart ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- loot & crafting ----------
function dropLoot(room,e){
  if(e.boss)return;
  const ch=Math.random();let mat=null;
  if(e.type==='bat'){if(ch<.5)mat='feather';else if(ch<.7)mat='bone';}
  else if(e.type==='bear'){if(ch<.55)mat='sinew';else if(ch<.9)mat='bone';}
  else if(e.type==='dino'){if(ch<.55)mat='fang';else if(ch<.85)mat='bone';}
  if(mat)room.drops.push({x:e.x,y:e.y,mat,t:0});
}
function craft(i){
  const r=REC[i];if(!r)return;
  if(game.crafted[r.id]){showMsg('ALREADY MADE.');return;}
  if(r.kind==='active'&&game.actives.length>=2){showMsg('TWO HANDS ONLY. TOOLS FULL.');return;}
  if(r.kind==='passive'){
    const np=REC.filter(x=>x.kind==='passive'&&game.crafted[x.id]).length;
    if(np>=3){showMsg('CARRY TOO MUCH. THREE CRAFTS ONLY.');return;}
  }
  for(const m in r.cost)if((game.mats[m]||0)<r.cost[m]){showMsg('NEED '+Object.keys(r.cost).map(k=>k.toUpperCase()).join(' + ')+'.');return;}
  for(const m in r.cost)game.mats[m]-=r.cost[m];
  game.crafted[r.id]=true;
  if(r.kind==='active')game.actives.push(r.id);
  for(const P of game.players){
    if(r.id==='spear'){P.dmg+=1;}
    else if(r.id==='edge'){P.dmg+=2;}
    else if(r.id==='totem'){P.maxhp+=2;P.hp=Math.min(P.maxhp,P.hp+2);}
    else if(r.id==='fletch'){P.cdMax=Math.max(.14,P.cdMax*.65);}
  }
  if(r.id==='spear')game.pierce+=1;
  if(r.id==='atlatl')game.projMul=1.5;
  sfx('clear');
  showMsg(r.name+' MADE. '+r.fx);
}
function relicDrop(){
  for(const P of game.players){P.maxhp+=2;P.hp=P.maxhp;}
  game.hunger=100;
  game.mats.obsidian+=2;
  const m=MATS[Math.random()*MATS.length|0];game.mats[m]+=2;
  showMsg('TOWER RELIC TAKEN. THE TRIBE GROWS. (+1 HEART)');
}

// ---------- actives ----------
function aimOf(P){
  if(P.id===0){
    if(IS_TOUCH){
      if(aimMode==='twin'&&touch.aimId!==null&&Math.hypot(touch.aimDx,touch.aimDy)>10)
        return Math.atan2(touch.aimDy,touch.aimDx);
      const ne=nearestEnemy(P.x,P.y);
      if(ne)return Math.atan2(ne.y-P.y,ne.x-P.x);
      return Math.atan2(P.fdy,P.fdx);
    }
    return Math.atan2(mouse.y-ORY-P.y,mouse.x-ORX-P.x);
  }
  return Math.atan2(P.fdy,P.fdx);
}
function useActive(slot,P){
  if(!game||!P||P.down)return;
  const id=game.actives[slot];
  if(!id||game.acd[id]>0)return;
  const a=aimOf(P);
  if(id==='bola'){
    game.acd.bola=ACD_MAX.bola;
    game.bolas.push({x:P.x,y:P.y,vx:Math.cos(a)*TILE*7.5,vy:Math.sin(a)*TILE*7.5,life:1.4,rot:0});
    sfx('throw');
  } else if(id==='dart'){
    game.acd.dart=ACD_MAX.dart;
    game.stones.push({x:P.x,y:P.y,vx:Math.cos(a)*TILE*16,vy:Math.sin(a)*TILE*16,life:1.0,dmg:4,pierce:99,dart:true});
    sfx('throw');
  } else if(id==='fist'){
    game.acd.fist=ACD_MAX.fist;
    sfx('slam');shake=Math.min(shake+9,12);
    burst(P.x,P.y,'#c1642a',26,TILE*4);
    const room=game.cur;
    for(const e of room.live){
      const d=Math.hypot(e.x-P.x,e.y-P.y);
      if(d<TILE*2.4){
        e.hp-=2;e.hitFlash=.15;e.slow=Math.max(e.slow,1);
        const kn=TILE*7/(d/TILE+1);
        e.vx+=(e.x-P.x)/(d||1)*kn;e.vy+=(e.y-P.y)/(d||1)*kn;
        floatText(e.x,e.y-e.r-8,'-2','#c1642a');
        if(e.hp<=0)onEnemyDeath(room,e);
      }
    }
    for(const e2 of room.live)keepInRoom(e2);
    room.live=room.live.filter(e=>e.hp>0);
    checkClear(room);
  }
}
function onEnemyDeath(room,e){
  game.kills++;
  dropLoot(room,e);
  burst(e.x,e.y,'#d0392b',e.boss?34:18,TILE*(e.boss?5:3.6));
  floatText(e.x,e.y-e.r-14,e.boss?'DOOM!':POW_WORDS[Math.random()*POW_WORDS.length|0],'#ff8c2e',true);
  if(e.boss){sfx('boss');shake=12;relicDrop();}
}
function checkClear(room){
  if(room.spawned&&room.live.length===0&&!room.cleared){
    room.cleared=true;sfx('clear');game.clearFlash=.5;
    if(room.type==='tower')showMsg('THE HOLE OPENS BELOW THE GUARDIAN...');
    else{
      showMsg('ROOM CLEAR. DOORS OPEN.');
      if(Math.random()<.4&&room.type!=='exit')room.items.push({type:'meat',ti:8,tj:5,bob:0});
    }
  }
}

// ---------- pause / restart ----------
function setPause(v){
  if(!game)return;
  game.paused=v;
  document.getElementById('pause').classList.toggle('hidden',!v);
}
function restartRoom(){
  if(!game)return;
  const room=game.cur;
  room.obst=null;room.live=[];room.drops=[];room.items=[];
  room.grok=null;room.shrine=null;room.slabT=0;room.tileHP={};
  room.cleared=false;room.spawned=false;
  buildRoom(room,game.depth);
  game.stones.length=0;game.spits.length=0;game.bolas.length=0;game.parts.length=0;game.floats.length=0;
  for(const p of game.players){if(p.down){p.down=false;p.hp=2;}}
  if(room.type==='tower'){
    room.spawned=true;
    room.live.push(newBoss(game.towerTier));
    placePlayers(8.5*TILE,8.6*TILE);
  } else if(['normal','water','dino','exit','treasure'].includes(room.type)&&room.type!=='start'){
    placePlayers(8.5*TILE,8.8*TILE);
    spawnEnemies(room,game.depth,'s');
    if(room.live.length>0){room.slabT=.35;}
    else room.cleared=true;
  } else {
    room.spawned=true;room.cleared=true;
    placePlayers(8.5*TILE,5.5*TILE);
  }
  setPause(false);
  showMsg('THE CAVE FORGETS. AGAIN.');
}
function restartRun(){setPause(false);start(game&&game.twoP?2:1);}
function goTitle(){
  setPause(false);
  document.getElementById('death').classList.add('hidden');
  document.getElementById('overlay').classList.remove('hidden');
  game=null;
}
document.getElementById('pbresume').addEventListener('click',()=>setPause(false));
document.getElementById('pbroom').addEventListener('click',restartRoom);
document.getElementById('pbrun').addEventListener('click',restartRun);
document.getElementById('pbtitle').addEventListener('click',goTitle);
