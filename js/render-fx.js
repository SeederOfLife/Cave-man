"use strict";
// ---------- draw helpers · paintings · lighting ----------
// Load order matters: see index.html. Plain script scope, no modules.
function roundRect(c,x,y,w,h,r){
  c.beginPath();
  if(c.roundRect){c.roundRect(x,y,w,h,r);}
  else{c.rect(x,y,w,h);}
}
function drawPlayerLocal(P){
  const hop=Math.abs(Math.sin(P.walk))*TILE*.06;
  const blink=P.hurtCd>0&&(game.time*20|0)%2===0;
  if(blink)return;
  ctx.save();
  ctx.translate(P.x,P.y-hop);
  ctx.scale(P.face<0?-1:1,1);
  const w=TILE*1.05;
  ctx.drawImage(P.id===0?SPR.caveman:SPR.caveman2,-w/2,-w*.58,w,w);
  ctx.restore();
}
function drawPlayerScreen(P,ax,ay){
  ctx.save();resetT(ctx);ctx.translate(ax,ay);
  ctx.scale(P.face<0?-1:1,1);
  const w=TILE*1.05;
  if(!P.down)ctx.drawImage(P.id===0?SPR.caveman:SPR.caveman2,-w/2,-w*.58,w,w);
  ctx.restore();
}
function drawPainting(x,y,v,tower){
  const o=tower?'#5f8a4a':'#a8552a';
  ctx.fillStyle=o;ctx.strokeStyle=o;ctx.globalAlpha=.7;
  const k=(v*100|0)%4;
  const u=TILE/14;
  ctx.lineWidth=u*.9;ctx.lineCap='round';
  if(tower){
    ctx.beginPath();
    for(let a=0;a<=10;a++){
      const px=x+3*u+a*u,py=y+6*u+Math.sin(a*1.2+v*10)*2*u;
      if(a===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.stroke();
  } else if(k===0){ // bison
    ctx.beginPath();ctx.ellipse(x+7*u,y+6.5*u,3.4*u,1.8*u,0,0,7);ctx.fill();
    ctx.beginPath();ctx.moveTo(x+4.5*u,y+8*u);ctx.lineTo(x+4.5*u,y+10*u);ctx.moveTo(x+9.5*u,y+8*u);ctx.lineTo(x+9.5*u,y+10*u);ctx.stroke();
    ctx.beginPath();ctx.arc(x+10.6*u,y+5*u,1.1*u,0,7);ctx.fill();
    ctx.beginPath();ctx.moveTo(x+11.2*u,y+4*u);ctx.lineTo(x+12*u,y+3*u);ctx.stroke();
  } else if(k===1){ // handprint
    ctx.beginPath();ctx.arc(x+7*u,y+7*u,2.2*u,0,7);ctx.fill();
    for(let f=0;f<5;f++){
      const ang=-2.2+f*.5;
      ctx.beginPath();ctx.moveTo(x+7*u+Math.cos(ang)*2*u,y+7*u+Math.sin(ang)*2*u);
      ctx.lineTo(x+7*u+Math.cos(ang)*4*u,y+7*u+Math.sin(ang)*4*u);ctx.stroke();
    }
  } else if(k===2){ // hunter
    ctx.beginPath();ctx.arc(x+6.5*u,y+3.5*u,u,0,7);ctx.fill();
    ctx.beginPath();ctx.moveTo(x+6.5*u,y+4.5*u);ctx.lineTo(x+6.5*u,y+7.5*u);
    ctx.moveTo(x+6.5*u,y+7.5*u);ctx.lineTo(x+5.4*u,y+10*u);
    ctx.moveTo(x+6.5*u,y+7.5*u);ctx.lineTo(x+7.6*u,y+10*u);
    ctx.moveTo(x+6.5*u,y+5.5*u);ctx.lineTo(x+10.5*u,y+4.5*u);ctx.stroke();
  } else { // spiral
    ctx.beginPath();
    for(let a=0;a<16;a++){
      const r=.3*u+a*.32*u,ang=a*.62;
      const px=x+7*u+Math.cos(ang)*r,py=y+6.5*u+Math.sin(ang)*r*.75;
      if(a===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }
  ctx.globalAlpha=1;
}

// ---------- lighting ----------
function renderLight(){
  resetT(lctx);
  lctx.globalCompositeOperation='source-over';
  lctx.clearRect(0,0,VW,VH);
  const dark=game.mode==='tower'?.68:Math.min(.8,.5+game.depth*.035);
  lctx.fillStyle='rgba(5,3,2,'+dark+')';
  lctx.fillRect(0,0,VW,VH);
  lctx.globalCompositeOperation='destination-out';
  function light(x,y,rad,str){
    const g=lctx.createRadialGradient(x,y,rad*.2,x,y,rad);
    g.addColorStop(0,'rgba(0,0,0,'+str+')');g.addColorStop(1,'rgba(0,0,0,0)');
    lctx.fillStyle=g;lctx.beginPath();lctx.arc(x,y,rad,0,7);lctx.fill();
  }
  const flick=Math.sin(game.time*8)*8;
  if(game.trans){
    const T=game.trans,e=easeInOut(Math.min(1,T.t));
    const dx=DIRV[T.dir][0]*C*TILE,dy=DIRV[T.dir][1]*R*TILE;
    light(ORX+dx*(1-e)+(DOOR[OPP[T.dir]].ti+.5)*TILE,ORY+dy*(1-e)+(DOOR[OPP[T.dir]].tj+.5)*TILE,TILE*4.5,1);
  } else {
    for(const p of game.players)if(!p.down)light(ORX+p.x,ORY+p.y,TILE*4.6+flick,1);
    light(ORX+1.5*TILE,ORY+1.5*TILE,TILE*2,.55);
    light(ORX+(C-1.5)*TILE,ORY+1.5*TILE,TILE*2,.55);
    light(ORX+1.5*TILE,ORY+(R-1.5)*TILE,TILE*2,.55);
    light(ORX+(C-1.5)*TILE,ORY+(R-1.5)*TILE,TILE*2,.55);
    if(game.cur.type==='exit'||game.cur.type==='tower')light(ORX+8.5*TILE,ORY+5.5*TILE,TILE*2,.6);
    const boss=game.cur.live.find(e=>e.boss);
    if(boss)light(ORX+boss.x,ORY+boss.y,TILE*3,.7);
  }
  resetT(ctx);
  ctx.drawImage(lightCvs,0,0,VW,VH);
  if(game.clearFlash>0){
    ctx.fillStyle='rgba(255,209,102,'+game.clearFlash*.25+')';
    ctx.fillRect(0,0,VW,VH);
  }
  if(!game.trans){
    for(const [tx,ty] of [[1.5,1.25],[C-1.5,1.25],[1.5,R-1.25],[C-1.5,R-1.25]]){
      ctx.drawImage(SPR.torch,ORX+tx*TILE-TILE*.25,ORY+ty*TILE-TILE*.3,TILE*.5,TILE*.6);
    }
  }
  ctx.globalCompositeOperation='overlay';
  ctx.fillStyle=game.mode==='tower'?'rgba(95,138,74,.05)':'rgba(255,140,50,.05)';
  ctx.fillRect(0,0,VW,VH);
  ctx.globalCompositeOperation='source-over';
}
