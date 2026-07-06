"use strict";
// ---------- skills: 3 quick (Q/E/R) + charged ult (F) · XP · level-up choice ----------
const SKILLS=[
 {id:'volley',key:'Q',name:'STONE VOLLEY',desc:'FAN OF STONES',cd:5,
  per:l=>({n:2+l,d:Math.ceil(l/2)})},
 {id:'step',key:'E',name:"URM'S STEP",desc:'DASH THROUGH DANGER',cd:4,
  per:l=>({dist:1.8+l*.35})},
 {id:'howl',key:'R',name:'WAR HOWL',desc:'SLOW & HURT NEARBY',cd:8,
  per:l=>({r:1.8+l*.35,d:l})},
 {id:'wrath',key:'F',name:'WRATH OF THE MOUNTAIN',desc:'CHARGED BY BLOOD. STRIKES ALL.',ult:true,
  per:l=>({d:2+l*2})},
];
function skillLvl(i){return game.skillLv[SKILLS[i].id];}
function gainUlt(n){if(game)game.ultCharge=Math.min(100,game.ultCharge+n*(1+game.stats.ultrate));}
function gainXp(n){
  game.xp+=n;
  while(game.xp>=xpNeed()){game.xp-=xpNeed();game.level++;game.pendingPts++;}
  if(game.pendingPts>0&&!game.lvlOpen&&!game.craftOpen)game.lvlOpen=true;
}
function xpNeed(){return 10+8*game.level;}
function chooseSkill(i){
  if(game.pendingPts<=0||i<0||i>3)return;
  const s=SKILLS[i];
  if(game.skillLv[s.id]>=5){showMsg(s.name+' IS ALREADY PERFECT.');return;}
  game.skillLv[s.id]++;game.pendingPts--;
  sfx('clear');showMsg(s.name+' GROWS. ('+game.skillLv[s.id]+'/5)');
  if(game.pendingPts<=0)game.lvlOpen=false;
}
function castSkill(i,P){
  if(!game||game.dead||!P||P.down||game.craftOpen||game.lvlOpen)return;
  const s=SKILLS[i],lv=game.skillLv[s.id];
  const S=game.stats;
  if(s.ult){
    if(game.ultCharge<100)return;
    game.ultCharge=0;
    const v=s.per(lv),room=game.cur;
    sfx('boss');shake=14;game.clearFlash=.4;
    floatText(P.x,P.y-TILE,'WRATH!','#ffd93b',true);
    for(const e of room.live){
      const d=v.d+S.spirit;
      e.hp-=d;e.hitFlash=.3;e.slow=Math.max(e.slow,2.5);
      burst(e.x,e.y,'#c1642a',16,TILE*3);
      floatText(e.x,e.y-e.r-8,'-'+d,'#c1642a');
      if(e.hp<=0)onEnemyDeath(room,e);
    }
    room.live=room.live.filter(e=>e.hp>0);checkClear(room);
    if(S.skillheal)for(const p of alivePlayers())p.hp=Math.min(p.maxhp,p.hp+S.skillheal);
    return;
  }
  if(game.scd[s.id]>0)return;
  game.scd[s.id]=s.cd*(1-S.cdr);
  const a=aimOf(P),v=s.per(lv);
  if(s.id==='volley'){
    for(let k=0;k<v.n;k++){
      const off=(k-(v.n-1)/2)*.16;
      const sp=TILE*10*game.projMul;
      game.stones.push({x:P.x,y:P.y,vx:Math.cos(a+off)*sp,vy:Math.sin(a+off)*sp,life:1.1,dmg:v.d+S.spirit,pierce:game.pierce});
    }
    sfx('throw');
  } else if(s.id==='step'){
    const dist=v.dist*TILE,steps=8;
    for(let k=0;k<steps;k++){
      const nx=P.x+Math.cos(a)*dist/steps,ny=P.y+Math.sin(a)*dist/steps;
      if(solidAt(game.cur,nx,ny,false))break;
      P.x=nx;P.y=ny;
    }
    P.hurtCd=Math.max(P.hurtCd,.5);
    burst(P.x,P.y,'#e8d9c0',10,TILE*2);sfx('stairs');
  } else if(s.id==='howl'){
    const r=v.r*TILE,room=game.cur;
    burst(P.x,P.y,'#ffa63e',20,TILE*3);sfx('slam');shake=Math.min(shake+5,9);
    for(const e of room.live){
      if(Math.hypot(e.x-P.x,e.y-P.y)<r){
        e.slow=Math.max(e.slow,2.2);
        if(v.d>0){const d=v.d+S.spirit;e.hp-=d;e.hitFlash=.15;floatText(e.x,e.y-e.r-8,'-'+d,'#ffa63e');
          if(e.hp<=0)onEnemyDeath(room,e);}
      }
    }
    room.live=room.live.filter(e=>e.hp>0);checkClear(room);
  }
  if(S.skillheal)P.hp=Math.min(P.maxhp,P.hp+S.skillheal);
}
function drawLevelPanel(){
  if(!game.lvlOpen)return;
  touch.panelRows=[];
  const pw=Math.min(520,VW-40),ph=250,px=(VW-pw)/2,py=(VH-ph)/2;
  ctx.fillStyle='rgba(5,3,2,.85)';ctx.fillRect(0,0,VW,VH);
  ctx.fillStyle='#1c130c';roundRect(ctx,px,py,pw,ph,14);ctx.fill();
  ctx.strokeStyle='#c1642a';ctx.lineWidth=3;ctx.stroke();
  ctx.textAlign='center';ctx.font='800 18px Trebuchet MS';ctx.fillStyle='#ffd93b';
  ctx.fillText('THE TRIBE GROWS WISE — LEVEL '+game.level,px+pw/2,py+28);
  ctx.font='10px Trebuchet MS';ctx.fillStyle='#8a7660';
  ctx.fillText('CHOOSE ONE PATH ('+game.pendingPts+' LEFT) · [1-4] OR TAP',px+pw/2,py+44);
  ctx.textAlign='left';
  for(let i=0;i<4;i++){
    const s=SKILLS[i],lv=game.skillLv[s.id],y=py+58+i*46;
    touch.panelRows.push({x:px+10,y,w:pw-20,h:42,i});
    ctx.fillStyle=lv>=5?'rgba(90,76,60,.3)':'rgba(193,100,42,.14)';roundRect(ctx,px+10,y,pw-20,42,8);ctx.fill();
    ctx.fillStyle=lv>=5?'#6b5236':'#ffa63e';ctx.font='bold 13px Trebuchet MS';
    ctx.fillText('['+(i+1)+'] '+s.name+(s.ult?' (ULT)':''),px+22,y+17);
    ctx.fillStyle='#8a7660';ctx.font='9px Trebuchet MS';
    ctx.fillText(s.desc,px+22,y+32);
    for(let p=0;p<5;p++){
      ctx.fillStyle=p<lv?'#ffd93b':'#3a2c1c';
      ctx.beginPath();ctx.arc(px+pw-90+p*15,y+21,5,0,7);ctx.fill();
    }
  }
}
function levelPanelTap(clientX,clientY){
  const r=cvs.getBoundingClientRect();
  const x=clientX-r.left,y=clientY-r.top;
  for(const row of touch.panelRows){
    if(x>=row.x&&x<=row.x+row.w&&y>=row.y&&y<=row.y+row.h&&row.i!==undefined){chooseSkill(row.i);return;}
  }
}
