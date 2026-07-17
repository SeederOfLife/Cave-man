"use strict";
// ---------- enemy AI: chase, flee, spit, lunge, zigzag ----------
// Per-frame update for every non-boss beast (bosses route to updateBoss in combat.js).
function updateEnemies(room,dt){
  for(const e of room.live){
    e.t+=dt;if(e.hitFlash>0)e.hitFlash-=dt;if(e.spitCd>0)e.spitCd-=dt;
    if(e.slow>0)e.slow-=dt;
    tickDots(e,room,dt);
    if(e.hp<=0)continue;
    const T=nearestPlayer(e.x,e.y);
    if(!T)break;
    if(e.boss){updateBoss(e,T,dt,room);continue;}
    const dToP=Math.hypot(T.x-e.x,T.y-e.y)||1;
    // sneak & tower-defense march: unaware beasts push south toward base; you can
    // slip past them (and hide in brush) if you stay beyond their aggro radius.
    let aggroR=e.aggroR||TILE*4.6;
    if(room.type==='brush')aggroR*=.5;                 // brush hides you — sneak past
    const aware=dToP<aggroR;
    if(!aware){
      if(e.march){                                     // tower-defense: push south to base
        const eff=e.slow>0?e.spd*.3:e.spd*.55;
        e.vx+=(-eff*.15-e.vx)*Math.min(1,dt*4);
        e.vy+=(eff-e.vy)*Math.min(1,dt*4);
        moveCircle(room,e,e.vx*dt,e.vy*dt,e.fly);keepInRoom(e);
        if(e.y>(R-1.5)*TILE){e.hp=0;e.pushed=true;}    // reached the base edge → pushed on
      } else {                                         // garrison idles/wanders until it spots you
        e.wanderT-=dt;if(e.wanderT<=0){e.wanderA=Math.random()*6.3;e.wanderT=1+Math.random()*2.5;}
        const eff=e.spd*.22;
        e.vx+=(Math.cos(e.wanderA)*eff-e.vx)*Math.min(1,dt*3);
        e.vy+=(Math.sin(e.wanderA)*eff-e.vy)*Math.min(1,dt*3);
        moveCircle(room,e,e.vx*dt,e.vy*dt,e.fly);keepInRoom(e);
      }
      for(const p of alivePlayers())if(Math.hypot(p.x-e.x,p.y-e.y)<e.r+p.r-2)hurtPlayer(p,e.dmg,e.type.toUpperCase(),e);
      continue;
    }
    e.march=false;                                     // spotted you — engage
    let tx,ty;
    // ranged cowards (dino) keep their distance; slither-men hold ground
    if(e.ranged&&!e.brave&&dToP<TILE*3.4){tx=(e.x-T.x)/dToP;ty=(e.y-T.y)/dToP;}
    else{tx=(T.x-e.x)/dToP;ty=(T.y-e.y)/dToP;}
    if(e.ranged&&e.spitCd<=0){
      e.spitCd=e.type==='slither'?2.3:1.6;
      const a=Math.atan2(T.y-e.y,T.x-e.x);
      game.spits.push({x:e.x,y:e.y,vx:Math.cos(a)*TILE*4.4,vy:Math.sin(a)*TILE*4.4,life:2});
    }
    if(e.fly){tx+=Math.cos(e.t*7)*.55;ty+=Math.sin(e.t*5.3)*.55;}
    // spider: fast erratic scuttle
    if(e.type==='spider'){tx+=Math.cos(e.t*11)*.7;ty+=Math.sin(e.t*8.5)*.7;}
    // boar: telegraphed lunge when close
    if(e.type==='boar'){
      e.lungeCd-=dt;
      if(e.lungeCd<=0&&dToP<TILE*4.5){
        e.vx=tx*e.spd*3.6;e.vy=ty*e.spd*3.6;e.lungeCd=2.2;
        sfx('slam');burst(e.x,e.y+e.r*.6,'#6b5c4d',6,TILE*1.6);
      }
    }
    const eff=e.slow>0?e.spd*.35:e.spd;
    e.vx+=(tx*eff-e.vx)*Math.min(1,dt*6);
    e.vy+=(ty*eff-e.vy)*Math.min(1,dt*6);
    moveCircle(room,e,e.vx*dt,e.vy*dt,e.fly);
    keepInRoom(e);
    for(const p of alivePlayers()){
      if(Math.hypot(p.x-e.x,p.y-e.y)<e.r+p.r-2)hurtPlayer(p,e.dmg,e.type==='slither'?'A SLITHER-MAN':e.type.toUpperCase(),e);
    }
  }
  room.live=room.live.filter(e=>e.hp>0);
}
