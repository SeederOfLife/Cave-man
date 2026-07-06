"use strict";
// ---------- stats: recompute from owned items · on-hit effects · dots ----------
function recalcStats(){
  const S={dmg:0,aspd:0,mv:0,hp:0,regen:0,pierce:0,projspd:0,crit:0,lifemeat:0,execute:0,
    knock:0,double4:0,splash:0,bigbonus:0,ultrate:0,burn:0,slowhit:0,chain:0,venom:0,fear:0,
    mark:0,spirit:0,cdr:0,skillheal:0,chill:0,hungerslow:0,blockcd:0,thorns:0,revive:0,
    waterwalk:0,lowbuff:0};
  for(const id of game.items){
    const it=ITEM_BY_ID[id];if(!it)continue;
    for(const k in it.s)S[k]=(S[k]||0)+it.s[k];
  }
  // blockcd: two block items -> keep the fastest
  const blocks=game.items.map(id=>ITEM_BY_ID[id]&&ITEM_BY_ID[id].s.blockcd||0).filter(Boolean);
  if(blocks.length)S.blockcd=Math.min(...blocks);
  S.cdr=Math.min(S.cdr,.4);S.crit=Math.min(S.crit,.6);
  game.stats=S;
  for(const P of game.players){
    const oldMax=P.maxhp;
    P.maxhp=Math.max(2,6+P.bonushp+S.hp);
    if(P.maxhp>oldMax)P.hp=Math.min(P.maxhp,P.hp+(P.maxhp-oldMax));
    P.hp=Math.min(P.hp,P.maxhp);
    P.dmg=1+S.dmg;
    P.cdMax=Math.max(.12,.38/(1+S.aspd));
  }
  game.pierce=S.pierce;
  game.projMul=1+S.projspd;
}
// stone-vs-enemy hit: returns final damage, applies side effects (called once per hit)
function stoneHitMods(s,e,room){
  const S=game.stats;let d=s.dmg;
  if(s.dart||s.ember)return d; // tools keep their own numbers
  if(S.lowbuff&&game.players.some(p=>!p.down&&p.hp<=p.maxhp*.5))d+=S.lowbuff;
  if(S.execute&&e.hp<=e.maxhp*.35)d+=S.execute;
  if(S.bigbonus&&e.maxhp>=8)d+=S.bigbonus;
  if(e.markT>0)d+=1;
  if(S.crit&&Math.random()<S.crit){d*=2;floatText(e.x,e.y-e.r-20,'CRIT!','#ffd93b');}
  if(S.mark)e.markT=Math.max(e.markT||0,S.mark);
  if(S.burn)e.burnD=Math.max(e.burnD||0,S.burn),e.burnT=2;
  if(S.venom)e.venomT=4,e.venomD=S.venom/4;
  if(S.slowhit)e.slow=Math.max(e.slow,S.slowhit);
  if(S.fear&&!e.boss){e.vx+=s.vx*.5;e.vy+=s.vy*.5;}
  if(S.knock&&!e.boss){e.vx+=s.vx*.12*S.knock;e.vy+=s.vy*.12*S.knock;}
  if(S.chain){
    let best=null,bd=TILE*3.2;
    for(const o of room.live){if(o!==e&&o.hp>0){const dd=Math.hypot(o.x-e.x,o.y-e.y);if(dd<bd){bd=dd;best=o;}}}
    if(best){best.hp-=S.chain;best.hitFlash=.12;burst(best.x,best.y,'#b9e2ff',6,TILE*2);
      floatText(best.x,best.y-best.r-8,'-'+S.chain,'#b9e2ff');
      if(best.hp<=0)onEnemyDeath(room,best);}
  }
  if(S.splash){
    for(const o of room.live){if(o!==e&&o.hp>0&&Math.hypot(o.x-e.x,o.y-e.y)<TILE*.95){
      o.hp-=S.splash;o.hitFlash=.1;if(o.hp<=0)onEnemyDeath(room,o);}}
  }
  gainUlt(3);
  return d;
}
// dots + chill aura, run per enemy per frame (from enemies.js)
function tickDots(e,room,dt){
  if(e.burnT>0){e.burnT-=dt;e.hp-=e.burnD*dt;if((game.time*10|0)%4===0)burst(e.x,e.y,'#ff8c2e',1,TILE);}
  if(e.venomT>0){e.venomT-=dt;e.hp-=e.venomD*dt;}
  if(e.markT>0)e.markT-=dt;
  if((e.burnT>0||e.venomT>0)&&e.hp<=0){e.hp=0;onEnemyDeath(room,e);}
  if(game.stats.chill){
    for(const p of alivePlayers())if(Math.hypot(p.x-e.x,p.y-e.y)<TILE*2.5){e.slow=Math.max(e.slow,.15);break;}
  }
}
// regen + block/shield timers, run once per frame (from update.js)
function tickStats(dt){
  const S=game.stats;
  if(game.blockT>0)game.blockT-=dt;
  if(game.shieldT>0)game.shieldT-=dt;
  if(game.decoy){game.decoy.t-=dt;if(game.decoy.t<=0)game.decoy=null;}
  if(S.regen>0){
    game.regenT=(game.regenT||0)+dt;
    const period=20/S.regen;
    if(game.regenT>=period){game.regenT=0;
      for(const p of alivePlayers())if(p.hp<p.maxhp){p.hp++;floatText(p.x,p.y-TILE*.6,'+1','#8ac24a');break;}}
  }
}
