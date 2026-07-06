"use strict";
// ---------- main loop · update(dt) ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- loop ----------
let last=performance.now();
function frame(now){
  requestAnimationFrame(frame);
  let dt=Math.min((now-last)/1000,.05);last=now;
  if(!game)return;
  if(game.dead){render();return;}
  if(game.paused){render();return;}
  if(game.trans){updateTrans(dt);render();return;}
  update(dt);render();
}
requestAnimationFrame(frame);

const P1KEYS={up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD',throw:'Space',a0:'Digit1',a1:'Digit2',s0:'KeyQ',s1:'KeyE',s2:'KeyR',ult:'KeyF'};
const P2KEYS={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight',throw:'Enter',s0:'ShiftRight',s1:'ControlRight',s2:'Slash',ult:'Period'};

function update(dt){
  const room=game.cur;
  if(msgTimer>0){msgTimer-=dt;if(msgTimer<=0)document.getElementById('msg').style.opacity=0;}
  if(game.craftOpen||game.lvlOpen)return;
  game.time+=dt;
  if(game.clearFlash>0)game.clearFlash-=dt;
  for(const k in game.acd)if(game.acd[k]>0)game.acd[k]-=dt;
  for(const k in game.scd)if(game.scd[k]>0)game.scd[k]-=dt;
  tickStats(dt);

  // ---- players ----
  for(const P of game.players){
    if(P.down)continue;
    const K=(P.id===0)?P1KEYS:P2KEYS;
    let ix=0,iy=0;
    if(keys[K.up]||(!game.twoP&&P.id===0&&keys['ArrowUp']))iy-=1;
    if(keys[K.down]||(!game.twoP&&P.id===0&&keys['ArrowDown']))iy+=1;
    if(keys[K.left]||(!game.twoP&&P.id===0&&keys['ArrowLeft']))ix-=1;
    if(keys[K.right]||(!game.twoP&&P.id===0&&keys['ArrowRight']))ix+=1;
    // touch joystick (P1)
    if(P.id===0&&touch.moveId!==null){
      const m=Math.hypot(touch.moveDx,touch.moveDy);
      if(m>8){ix=touch.moveDx/52;iy=touch.moveDy/52;}
    }
    const inWater=cellAtPx(room,P.x,P.y)===O_WATER&&!game.stats.waterwalk;
    const spd=(inWater?TILE*2.9:TILE*5.2)*(1+(game.stats.mv||0));
    const len=Math.hypot(ix,iy)||1;
    const nl=Math.min(1,len);
    moveCircle(room,P,ix/len*spd*nl*dt,iy/len*spd*nl*dt,false);
    // player safety clamp (never through outer void)
    if(P.x<2)P.x=2;if(P.x>C*TILE-2)P.x=C*TILE-2;
    if(P.y<2)P.y=2;if(P.y>R*TILE-2)P.y=R*TILE-2;
    if(Math.abs(ix)>.01||Math.abs(iy)>.01){P.fdx=ix/len;P.fdy=iy/len;}
    if(P.id===0&&!IS_TOUCH)P.face=(mouse.x-ORX>P.x)?1:-1;
    else P.face=(P.fdx>=0?1:-1);
    P.walk=(Math.abs(ix)>.01||Math.abs(iy)>.01)?P.walk+dt*10:0;
    if(P.hurtCd>0)P.hurtCd-=dt;
    if(P.cd>0)P.cd-=dt;
    // throw
    let throwing=(P.id===0)?(keys[K.throw]||(!IS_TOUCH&&mouse.down)):keys[K.throw];
    if(P.id===0&&IS_TOUCH){
      if(aimMode==='twin')throwing=throwing||(touch.aimId!==null&&Math.hypot(touch.aimDx,touch.aimDy)>14);
      throwing=throwing||touch.firing;
    }
    if(throwing&&P.cd<=0){
      P.cd=P.cdMax;
      const a=aimOf(P);
      const sp=TILE*10.5*game.projMul;
      game.stones.push({x:P.x,y:P.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1.2*game.projMul,dmg:P.dmg,pierce:game.pierce});
      P._thr=(P._thr||0)+1;
      if(game.stats.double4&&P._thr%4===0)game.stones.push({x:P.x,y:P.y,vx:Math.cos(a+.16)*sp,vy:Math.sin(a+.16)*sp,life:1.2*game.projMul,dmg:P.dmg,pierce:game.pierce});
      sfx('throw');
    }
    if(K.a0&&keys[K.a0])useActive(0,P);
    if(K.a1&&keys[K.a1])useActive(1,P);
    if(keys[K.s0])castSkill(0,P);
    if(keys[K.s1])castSkill(1,P);
    if(keys[K.s2])castSkill(2,P);
    if(keys[K.ult])castSkill(3,P);
    const ti=P.x/TILE|0,tj=P.y/TILE|0;
    const d=isDoorTile(ti,tj);
    if(d&&room.doors[d]&&roomDoorsOpen(room)){startTrans(d);return;}
    P._inWater=inWater;
  }

  // ---- tribe hunger ----
  const anyWater=game.players.some(p=>!p.down&&p._inWater);
  game.hunger=Math.max(0,game.hunger-dt*(anyWater?1.6:.8)*(game.twoP?1.25:1)*DIFF[difficulty].hunger*(1-(game.stats.hungerslow||0)));
  if(game.hunger<=0){
    game.starveT+=dt;
    if(game.starveT>2.2){game.starveT=0;for(const p of alivePlayers())hurtPlayer(p,1,'STARVING');}
  }

  // ---- bolas ----
  for(let i=game.bolas.length-1;i>=0;i--){
    const b=game.bolas[i];
    b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;b.rot+=dt*14;
    if(b.life<=0||solidAt(room,b.x,b.y,false)){burst(b.x,b.y,'#c9a06a',6,TILE*2);game.bolas.splice(i,1);continue;}
    for(const e of room.live){
      if(e.hp>0&&Math.hypot(e.x-b.x,e.y-b.y)<e.r+TILE*.14){
        e.hp-=1;e.hitFlash=.12;e.slow=2.2;
        burst(b.x,b.y,'#c9a06a',10,TILE*2.4);sfx('hit');
        floatText(e.x,e.y-e.r-8,'SNARED','#c9a06a');
        game.bolas.splice(i,1);
        if(e.hp<=0)onEnemyDeath(room,e);
        break;
      }
    }
  }

  // ---- stones ----
  for(let i=game.stones.length-1;i>=0;i--){
    const s=game.stones[i];
    s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
    if(s.life<=0){if(s.ember)emberBlast(s,room);game.stones.splice(i,1);continue;}
    const ti=s.x/TILE|0,tj=s.y/TILE|0;
    if(solidAt(room,s.x,s.y,false)){
      const inRing=(ti<=0||tj<=0||ti>=C-1||tj>=R-1);
      const cell=(!inRing&&room.obst)?room.obst[tj][ti]:O_NONE;
      if(cell===O_ROCK||cell===O_ROOT||cell===O_OBROCK){
        const k=ti+','+tj;
        room.tileHP[k]=(room.tileHP[k]||1)-1;
        burst(s.x,s.y,cell===O_ROOT?'#a89d84':'#a39a8e',7,TILE*2.4);sfx('rock');
        if(room.tileHP[k]<=0){
          room.obst[tj][ti]=O_NONE;
          shake=Math.min(shake+2,6);
          const cx=(ti+.5)*TILE,cy=(tj+.5)*TILE;
          burst(cx,cy,'#6b5c4d',14,TILE*3);
          let mat=null,ch=Math.random();
          if(cell===O_ROCK&&ch<.6)mat='flint';
          else if(cell===O_ROOT&&ch<.9)mat='wood';
          else if(cell===O_OBROCK&&ch<.85)mat='obsidian';
          if(mat)room.drops.push({x:cx,y:cy,mat,t:0});
        }
      } else {
        burst(s.x,s.y,'#a39a8e',6,TILE*2.4);sfx('rock');
      }
      if(s.ember)emberBlast(s,room);
      game.stones.splice(i,1);continue;
    }
    for(const e of room.live){
      if(e.hp>0&&Math.hypot(e.x-s.x,e.y-s.y)<e.r+TILE*.12){
        const dd=stoneHitMods(s,e,room);
        e.hp-=dd;e.hitFlash=.12;
        if(!e.boss){e.vx+=s.vx*.12;e.vy+=s.vy*.12;}
        burst(s.x,s.y,s.dart?'#6a5490':'#d0392b',8,TILE*3);sfx('hit');shake=Math.min(shake+3.5,7);
        floatText(e.x,e.y-e.r-8,'-'+dd,s.dart?'#b9a6e8':'#ffd166');
        if(e.hp<=0)onEnemyDeath(room,e);
        if(s.pierce>0){s.pierce--;}else{if(s.ember)emberBlast(s,room);game.stones.splice(i,1);}
        break;
      }
    }
  }
  const before=room.live.length;
  room.live=room.live.filter(e=>e.hp>0);
  if(before>0)checkClear(room);

  // ---- spits ----
  for(let i=game.spits.length-1;i>=0;i--){
    const s=game.spits[i];
    s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
    if(s.life<=0||solidAt(room,s.x,s.y,false)){burst(s.x,s.y,'#8ac24a',5,TILE*1.8);game.spits.splice(i,1);continue;}
    let hitP=false;
    for(const p of alivePlayers()){
      if(Math.hypot(p.x-s.x,p.y-s.y)<p.r+TILE*.1){hurtPlayer(p,1,'SPIT');hitP=true;break;}
    }
    if(hitP)game.spits.splice(i,1);
  }

  // ---- enemies (AI in enemies.js) ----
  updateEnemies(room,dt);

  // ---- drops ----
  for(let i=room.drops.length-1;i>=0;i--){
    const d=room.drops[i];d.t+=dt;
    let taken=false;
    for(const p of alivePlayers()){
      if(Math.hypot(p.x-d.x,p.y-d.y)<p.r+TILE*.4){taken=true;break;}
    }
    if(taken){
      game.mats[d.mat]++;
      floatText(d.x,d.y-12,'+'+d.mat.toUpperCase(),'#e8d9c0');
      sfx('pickup');burst(d.x,d.y,'#e8d9c0',6,TILE*1.6);
      room.drops.splice(i,1);
    }
  }

  // ---- shrine ----
  if(room.shrine&&!room.shrine.used){
    const shx=(room.shrine.ti+.5)*TILE,shy=(room.shrine.tj+.5)*TILE;
    for(const p of alivePlayers()){
      if(Math.hypot(p.x-shx,p.y-shy)<TILE*1.1){
        room.shrine.used=true;sfx('grok');
        for(const q of game.players)if(!q.down)q.hp=Math.min(q.maxhp,q.hp+2);
        const m=MATS[Math.random()*MATS.length|0];
        game.mats[m]++;
        showMsg('URM SAYS NOTHING. URM GIVES '+m.toUpperCase()+'.');
        burst(shx,shy-10,'#c1642a',16,TILE*2.2);
        break;
      }
    }
  }

  // ---- grok ----
  if(room.grok){
    const G=room.grok;G.t+=dt;
    const gx=(G.ti+.5)*TILE,gy=(G.tj+.5)*TILE;
    if(!G.gave){
      for(const p of alivePlayers()){
        if(Math.hypot(p.x-gx,p.y-gy)<TILE*1.1){
          G.gave=true;sfx('grok');
          game.hunger=Math.min(100,game.hunger+35);
          for(const q of game.players)if(!q.down)q.hp=Math.min(q.maxhp,q.hp+1);
          if(Math.random()<.5){const m=MATS[Math.random()*MATS.length|0];game.mats[m]++;floatText(gx,gy-TILE,'+'+m.toUpperCase(),'#e8d9c0');}
          showMsg(GROK_LINES[Math.random()*GROK_LINES.length|0]);
          burst(gx,gy-10,'#ffd166',14,TILE*2);
          break;
        }
      }
    }
  }

  // ---- items ----
  for(let i=room.items.length-1;i>=0;i--){
    const it=room.items[i];
    const x=(it.ti+.5)*TILE,y=(it.tj+.5)*TILE;
    let taker=null;
    for(const p of alivePlayers()){
      if(Math.hypot(p.x-x,p.y-y)<p.r+TILE*.35){taker=p;break;}
    }
    if(taker){
      if(it.type==='meat'){game.hunger=Math.min(100,game.hunger+38);floatText(x,y-14,'+MEAT','#ffb54d');}
      else if(it.type==='heart'){taker.hp=Math.min(taker.maxhp,taker.hp+2);floatText(x,y-14,'+HP','#ff6a5e');}
      else if(it.type==='flint_item'){game.mats.flint+=2;game.mats.obsidian+=1;floatText(x,y-14,'+SHINIES','#b9c6cf');}
      burst(x,y,'#ffd166',12,TILE*2.4);sfx('pickup');
      room.items.splice(i,1);
    }
  }

  // ---- exit hole ----
  if((room.type==='exit'||room.type==='tower')&&roomDoorsOpen(room)){
    for(const p of alivePlayers()){
      if(Math.hypot(p.x-8.5*TILE,p.y-5.5*TILE)<TILE*.55){
        sfx('stairs');shake=6;
        if(game.mode==='cave'&&game.depth%3===0){
          game.towerTier=game.depth/3;
          newTowerFloor();
        } else {
          game.depth++;
          newCaveFloor();
        }
        return;
      }
    }
  }

  // ---- particles / floats ----
  for(let i=game.parts.length-1;i>=0;i--){const p=game.parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.9;p.vy*=.9;p.life-=dt;if(p.life<=0)game.parts.splice(i,1);}
  for(let i=game.floats.length-1;i>=0;i--){const f=game.floats[i];f.y-=28*dt;f.life-=dt;if(f.life<=0)game.floats.splice(i,1);}
  if(shake>0)shake=Math.max(0,shake-dt*22);
}
