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
  else if(e.type==='spider'){if(ch<.5)mat='sinew';else if(ch<.65)mat='bone';}
  else if(e.type==='boar'){if(ch<.4)mat='fang';else if(ch<.8)mat='sinew';}
  else if(e.type==='slither'){if(ch<.4)mat='obsidian';else if(ch<.85)mat='fang';}
  if(mat)room.drops.push({x:e.x,y:e.y,mat,t:0});
}
// crafting is now the shop (shop.js); this file keeps loot, actives and pause/restart
function relicDrop(){
  for(const P of game.players){P.bonushp+=2;}
  recalcStats();
  for(const P of game.players)P.hp=P.maxhp;
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
  } else if(id==='ember'){
    game.acd.ember=ACD_MAX.ember;
    game.stones.push({x:P.x,y:P.y,vx:Math.cos(a)*TILE*9,vy:Math.sin(a)*TILE*9,life:.9,dmg:2,pierce:0,ember:true});
    sfx('throw');
  } else if(id==='shield'){
    game.acd.shield=ACD_MAX.shield;game.shieldT=2;
    sfx('rock');burst(P.x,P.y,'#8ad0e2',14,TILE*2);
    showMsg('STONE SKIN. TWO BREATHS.');
  } else if(id==='decoy'){
    game.acd.decoy=ACD_MAX.decoy;game.decoy={x:P.x,y:P.y,t:3};
    sfx('grok');burst(P.x,P.y,'#cfc2a8',10,TILE*1.6);
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
function emberBlast(s,room){
  // fire burst on impact/expiry: AoE damage; the stones-loop filter removes the dead
  burst(s.x,s.y,'#ff8c2e',22,TILE*3.5);burst(s.x,s.y,'#ffe9a8',10,TILE*2);
  sfx('slam');shake=Math.min(shake+4,8);
  for(const e of room.live){
    if(e.hp<=0)continue;
    const d=Math.hypot(e.x-s.x,e.y-s.y);
    if(d<TILE*1.3){
      e.hp-=2;e.hitFlash=.15;
      floatText(e.x,e.y-e.r-8,'-2','#ff8c2e');
      if(e.hp<=0)onEnemyDeath(room,e);
    }
  }
}
function onEnemyDeath(room,e){
  if(e._died)return;e._died=true;
  if(e.pushed)return;                 // marched off the base edge — no reward, it escaped
  game.kills++;
  dropLoot(room,e);
  gainXp(Math.max(2,e.maxhp)+(e.boss?20:0)+(e.lord?12:0));
  gainUlt(e.boss?40:e.lord?20:8);
  if(game.stats.lifemeat)game.hunger=Math.min(100,game.hunger+game.stats.lifemeat);
  burst(e.x,e.y,'#d0392b',e.boss?34:e.lord?26:18,TILE*(e.boss?5:e.lord?4.2:3.6));
  floatText(e.x,e.y-e.r-14,e.boss?'DOOM!':POW_WORDS[Math.random()*POW_WORDS.length|0],'#ff8c2e',true);
  if(e.lord){                          // felling a lord hardens the whole horde
    game.hordeBuff++;
    dropLoot(room,e);dropLoot(room,e); // richer loot for the risk
    sfx('boss');shake=Math.min(shake+7,12);
    showMsg('THE LORD FALLS — THE HORDE HARDENS. (+STRENGTH TO ALL BEASTS)');
  }
  if(e.boss){sfx('boss');shake=14;win();}
}
// lane & jungle rooms are endless (waves keep coming); only one-off rooms "clear"
function checkClear(room){
  if(['normal','dino'].includes(room.type))return;
  if(room.spawned&&room.live.length===0&&!room.cleared){
    room.cleared=true;sfx('clear');game.clearFlash=.5;
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
  buildRoom(room,room.tier);
  game.stones.length=0;game.spits.length=0;game.bolas.length=0;game.parts.length=0;game.floats.length=0;
  for(const p of game.players){if(p.down){p.down=false;p.hp=2;}}
  if(['normal','water','dino','exit','treasure'].includes(room.type)&&room.type!=='start'){
    placePlayers(8.5*TILE,8.8*TILE);
    spawnEnemies(room,room.tier,'s');
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
