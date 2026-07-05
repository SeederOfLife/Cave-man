"use strict";
// ---------- boss AI · transitions · damage ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- boss AI ----------
function updateBoss(e,T,dt,room){
  if(e.state==='chase'){
    e.atkT-=dt;
    const d=Math.hypot(T.x-e.x,T.y-e.y)||1;
    const eff=e.slow>0?e.spd*.35:e.spd;
    e.vx+=((T.x-e.x)/d*eff-e.vx)*Math.min(1,dt*4);
    e.vy+=((T.y-e.y)/d*eff-e.vy)*Math.min(1,dt*4);
    moveCircle(room,e,e.vx*dt,e.vy*dt,false);
    if(e.atkT<=0){e.state='wind';e.wind=.7;e.vx=0;e.vy=0;}
    if(e.serpent&&e.spitCd<=0){
      e.spitCd=2.4;
      const base=Math.atan2(T.y-e.y,T.x-e.x);
      for(const off of [-.3,0,.3]){
        game.spits.push({x:e.x,y:e.y,vx:Math.cos(base+off)*TILE*4.6,vy:Math.sin(base+off)*TILE*4.6,life:2.2});
      }
    }
  } else if(e.state==='wind'){
    e.wind-=dt;
    e.hitFlash=.05;
    if(e.wind<=0){
      e.state='charge';e.charge=.85;
      const d=Math.hypot(T.x-e.x,T.y-e.y)||1;
      e.cdx=(T.x-e.x)/d;e.cdy=(T.y-e.y)/d;
      sfx('slam');
    }
  } else if(e.state==='charge'){
    e.charge-=dt;
    moveCircle(room,e,e.cdx*TILE*6.5*dt,e.cdy*TILE*6.5*dt,false);
    keepInRoom(e);
    if((game.time*30|0)%2===0)burst(e.x,e.y+e.r*.6,'#6b5c4d',2,TILE*1.2);
    if(e.charge<=0){e.state='chase';e.atkT=2.6+Math.random();}
  }
  if(!e.summoned&&e.hp<=e.maxhp*.5){
    e.summoned=true;
    showMsg(e.serpent?'THE PRIEST CALLS THE DEEP...':'GHUR ROARS FOR HIS KIN...');
    const adds=e.serpent?['slither','bat']:['bat','bat'];
    if(e.tier>=3)adds.push(e.serpent?'slither':'boar');
    for(const a of adds){
      const ang=Math.random()*6.3;
      room.live.push(newEnemy(a,e.x+Math.cos(ang)*TILE*2,e.y+Math.sin(ang)*TILE*2,game.depth));
    }
    sfx('boss');shake=7;
  }
  for(const p of alivePlayers()){
    if(Math.hypot(p.x-e.x,p.y-e.y)<e.r+p.r-2)hurtPlayer(p,e.dmg,e.name);
  }
}

// ---------- transitions ----------
function startTrans(dir){
  const room=game.cur;
  const nx=room.gx+DIRV[dir][0],ny=room.gy+DIRV[dir][1];
  const next=game.rooms[key(nx,ny)];
  if(!next)return;
  buildRoom(next,game.depth);
  game.stones.length=0;game.spits.length=0;game.bolas.length=0;game.parts.length=0;game.floats.length=0;
  game.trans={dir,from:room,to:next,t:0};
}
function updateTrans(dt){
  const T=game.trans;
  T.t+=dt/0.45;
  if(T.t>=1){
    const dir=T.dir,next=T.to;
    game.cur=next;
    next.visited=true;
    const od=DOOR[OPP[dir]];
    const bx=(od.ti+.5)*TILE+(OPP[dir]==='w'?TILE*.9:OPP[dir]==='e'?-TILE*.9:0);
    const by=(od.tj+.5)*TILE+(OPP[dir]==='n'?TILE*.9:OPP[dir]==='s'?-TILE*.9:0);
    game.players.forEach((p,i)=>{
      const perp=(OPP[dir]==='w'||OPP[dir]==='e')?{x:0,y:1}:{x:1,y:0};
      p.x=bx+(i?perp.x*TILE*.5:game.twoP?-perp.x*TILE*.5:0);
      p.y=by+(i?perp.y*TILE*.5:game.twoP?-perp.y*TILE*.5:0);
    });
    revivePlayers();
    game.trans=null;
    if(!next.spawned&&['normal','water','dino','exit','treasure'].includes(next.type)){
      spawnEnemies(next,game.depth,dir);
      for(const en of next.live)burst(en.x,en.y,'#6b5c4d',8,TILE*2);
      if(next.live.length>0){sfx('slam');shake=5;next.slabT=.35;}
      else next.cleared=true;
    } else if(!next.spawned){
      next.spawned=true;next.cleared=true;
    }
  }
}

// ---------- damage ----------
function hurtPlayer(P,dmg,from){
  if(P.hurtCd>0||P.down)return;
  P.hurtCd=.85;P.hp-=dmg;
  sfx('hurt');shake=Math.min(shake+6,10);
  burst(P.x,P.y,'#d0392b',14,TILE*3);
  floatText(P.x,P.y-TILE*.6,'-'+dmg,'#ff5a4e');
  if(P.hp<=0){
    P.hp=0;P.down=true;
    burst(P.x,P.y,'#cfc2a8',20,TILE*3);
    if(alivePlayers().length===0)die(from);
    else showMsg('A HUNTER FALLS. CLEAR THE ROOM. URM MAY GIVE ANOTHER STONE.');
  }
}
function die(from){
  game.dead=true;sfx('die');
  const ov=document.getElementById('death');
  ov.classList.remove('hidden');
  ov.innerHTML=`
    <div class="caption">☠ THE TRIBE ENDS HERE ☠</div>
    <h1 class="comic-title" style="font-size:34px;margin:14px 0 16px">SLAIN BY ${from||'THE CAVE'}</h1>
    <div style="font-size:15px;line-height:2;margin-bottom:20px">REACHED ${game.mode==='tower'?'TOWER '+game.towerTier:'CAVE '+game.depth}<br>BONKED <b style="color:#ffa63e">${game.kills}</b> BEAST${game.kills===1?'':'S'}</div>
    <div><button onclick="deathRestart()">ROCK AGAIN</button>
    <button onclick="goTitle()">TITLE</button></div>
    <div class="tbc">TO BE CONTINUED... ?</div>`;
}
function deathRestart(){
  document.getElementById('death').classList.add('hidden');
  start(game&&game.twoP?2:1);
}
