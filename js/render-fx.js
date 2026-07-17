"use strict";
// ---------- draw helpers · paintings · lighting ----------
// Load order matters: see index.html. Plain script scope, no modules.
function roundRect(c,x,y,w,h,r){
  c.beginPath();
  if(c.roundRect){c.roundRect(x,y,w,h,r);}
  else{c.rect(x,y,w,h);}
}
// one animated leg: dark cel-outline underlay, then skin, then a foot
function drawLeg(cx,hx,hipY,footX,footY,pal,face){
  ctx.lineCap='round';
  ctx.strokeStyle='#17100a';ctx.lineWidth=TILE*.135;
  ctx.beginPath();ctx.moveTo(hx,hipY);ctx.quadraticCurveTo((hx+footX)/2,(hipY+footY)/2+TILE*.03,footX,footY);ctx.stroke();
  ctx.strokeStyle=pal.skinD;ctx.lineWidth=TILE*.1;
  ctx.beginPath();ctx.moveTo(hx,hipY);ctx.quadraticCurveTo((hx+footX)/2,(hipY+footY)/2+TILE*.03,footX,footY);ctx.stroke();
  ell(ctx,footX+face*TILE*.02,footY,TILE*.08,TILE*.05,'#17100a');
  ell(ctx,footX+face*TILE*.025,footY-TILE*.005,TILE*.06,TILE*.036,pal.skin);
}
// walk cycle: legs swing along screen-x and lift on the forward step; neutral stance when idle
function drawHeroLegs(P){
  const pal=HERO_PAL[P.id]||HERO_PAL[0];
  const face=P.face<0?-1:1;
  const moving=P.walk>0.001;
  const sw=moving?Math.sin(P.walk):0;
  const stride=TILE*.15,lift=TILE*.08,base=TILE*.07;
  const hipY=P.y+TILE*.03,footY=P.y+TILE*.42;
  drawLeg(P.x,P.x+TILE*.05,hipY,P.x+base+sw*stride,footY-Math.max(0,sw)*lift,pal,face);
  drawLeg(P.x,P.x-TILE*.05,hipY,P.x-base-sw*stride,footY-Math.max(0,-sw)*lift,pal,face);
}
function drawPlayerLocal(P){
  const blink=P.hurtCd>0&&(game.time*20|0)%2===0;
  if(blink)return;
  const moving=P.walk>0.001;
  const hop=(moving?Math.abs(Math.sin(P.walk)):0)*TILE*.05;
  drawHeroLegs(P);
  ctx.save();
  ctx.translate(P.x,P.y-hop);
  if(moving)ctx.rotate((P.face<0?-1:1)*Math.sin(P.walk*.5)*.035); // lean into the stride
  ctx.scale(P.face<0?-1:1,1);
  const w=TILE*1.05;
  ctx.drawImage(P.id===0?SPR.caveman:SPR.caveman2,-w/2,-w*.58,w,w);
  ctx.restore();
}
function drawPlayerScreen(P,ax,ay){
  if(P.down)return;
  const pal=HERO_PAL[P.id]||HERO_PAL[0];
  ctx.save();resetT(ctx);ctx.translate(ax,ay);
  // static idle legs during the room-slide transition
  drawLeg(0,-TILE*.05,TILE*.03,-TILE*.1,TILE*.42,pal,-1);
  drawLeg(0,TILE*.05,TILE*.03,TILE*.1,TILE*.42,pal,1);
  ctx.scale(P.face<0?-1:1,1);
  const w=TILE*1.05;
  ctx.drawImage(P.id===0?SPR.caveman:SPR.caveman2,-w/2,-w*.58,w,w);
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
    // open doors glow through the dark so exits always read
    if(roomDoorsOpen(game.cur))for(const d in game.cur.doors){
      if(game.cur.doors[d])light(ORX+(DOOR[d].ti+.5)*TILE,ORY+(DOOR[d].tj+.5)*TILE,TILE*2.2,.6);
    }
    for(const st of game.stones)if(st.ember)light(ORX+st.x,ORY+st.y,TILE*2.5,.85);
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
