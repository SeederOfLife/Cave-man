"use strict";
// ---------- HUD · touch UI ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- HUD ----------
function drawHearts(P,x,y,hs){
  for(let i=0;i<P.maxhp/2;i++){
    let spr=SPR.heartEmpty;
    if(P.hp>=i*2+2)spr=SPR.heart;else if(P.hp===i*2+1)spr=SPR.heartHalf;
    ctx.drawImage(spr,x+i*(hs+4),y,hs,hs);
  }
}
function drawHUD(){
  resetT(ctx);
  const hgrad=ctx.createLinearGradient(0,0,0,HUDH);
  hgrad.addColorStop(0,'rgba(12,8,5,.85)');hgrad.addColorStop(1,'rgba(12,8,5,.55)');
  ctx.fillStyle=hgrad;
  ctx.fillRect(0,0,VW,HUDH-10);
  ctx.fillStyle='#57422c';ctx.fillRect(0,HUDH-11,VW,2);
  drawHearts(game.players[0],16,8,22);
  if(game.twoP){
    ctx.fillStyle='#8a7660';ctx.font='bold 10px Trebuchet MS';ctx.fillText('P2',16,42);
    drawHearts(game.players[1],34,30,16);
  }
  // hunger
  const bx=16,by=game.twoP?48:36,bw=160,bh=11;
  ctx.drawImage(SPR.meat,bx-4,by-6,22,22);
  ctx.fillStyle='#241a10';roundRect(ctx,bx+20,by,bw,bh,5);ctx.fill();
  ctx.strokeStyle='#57422c';ctx.lineWidth=1.5;ctx.stroke();
  const grd=ctx.createLinearGradient(bx+20,0,bx+20+bw,0);
  grd.addColorStop(0,'#d67f2e');grd.addColorStop(1,'#ffb54d');
  ctx.fillStyle=grd;roundRect(ctx,bx+22,by+2,Math.max(1,(bw-4)*(game.hunger/100)),bh-4,3);ctx.fill();
  // war clock — the horde hardens over time and with every lord felled
  ctx.textAlign='right';
  ctx.font='800 19px Trebuchet MS';
  const mm=(game.warT/60|0),ss=('0'+((game.warT|0)%60)).slice(-2);
  const label='WAR '+mm+':'+ss;
  ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(label,VW-14,28);
  ctx.fillStyle='#ffa63e';ctx.fillText(label,VW-15,27);
  ctx.font='bold 11px Trebuchet MS';
  ctx.fillStyle='#8a7660';ctx.fillText('BONES '+game.kills+(game.hordeBuff?'  ·  HORDE +'+game.hordeBuff:''),VW-15,44);
  ctx.textAlign='left';
  // materials pouch
  const pouchW=MATS.length*40+8;
  let mx=14,my=VH-(IS_TOUCH?128:56);
  ctx.fillStyle='rgba(12,8,5,.72)';roundRect(ctx,mx-6,my-16,pouchW,34,10);ctx.fill();
  ctx.strokeStyle='#57422c';ctx.lineWidth=1.5;ctx.stroke();
  ctx.font='bold 11px Trebuchet MS';
  for(const m of MATS){
    const n=game.mats[m]||0;
    ctx.globalAlpha=n>0?1:.3;
    ctx.drawImage(SPR[m],mx,my-12,20,20);
    ctx.fillStyle=n>0?'#e8d9c0':'#5a4c3c';
    ctx.fillText('×'+n,mx+18,my+5);
    ctx.globalAlpha=1;
    mx+=40;
  }
  drawXpBar();
  drawItemSlots();
  // desktop tool slots (active items on 1/2) + skill bar
  if(!IS_TOUCH){
    const slotIcons={bola:SPR.bola,dart:SPR.obsidian,fist:SPR.rock,ember:SPR.torch,shield:SPR.slab,decoy:SPR.bone};
    const labels=['1','2'];
    for(let s2=0;s2<2;s2++){
      const bx2=VW-96+s2*48,by2=VH-46;
      drawToolSlot(bx2,by2,17,game.actives[s2],slotIcons,labels[s2]);
    }
    ctx.fillStyle='#8a7660';ctx.font='bold 12px Trebuchet MS';ctx.textAlign='right';
    ctx.fillText('[C] SHOP',VW-16,VH-70);
    ctx.textAlign='left';
    drawSkillBarDesktop();
  }
}
function drawToolSlot(x,y,r,id,icons,label){
  ctx.fillStyle='rgba(12,8,5,.72)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  ctx.strokeStyle='#57422c';ctx.lineWidth=2;ctx.stroke();
  if(id){
    if(game.acd[id]>0){
      ctx.fillStyle='rgba(201,160,106,.35)';
      ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r-1,-Math.PI/2,-Math.PI/2+6.28*(game.acd[id]/ACD_MAX[id]));ctx.closePath();ctx.fill();
    }
    ctx.drawImage(icons[id],x-r*.62,y-r*.68,r*1.24,r*1.24);
  } else {
    ctx.fillStyle='#4a3826';ctx.font='bold 14px Trebuchet MS';ctx.textAlign='center';
    ctx.fillText('·',x,y+4);ctx.textAlign='left';
  }
  ctx.fillStyle='#e8d9c0';ctx.font='bold 9px Trebuchet MS';ctx.textAlign='center';
  ctx.fillText(label,x,y+r+11);ctx.textAlign='left';
}

// ---------- touch UI ----------
function drawTouchUI(){
  resetT(ctx);
  touch.btns={};
  // move joystick zone (left)
  const jx=touch.moveId!==null?touch.moveOx:VW*.15;
  const jy=touch.moveId!==null?touch.moveOy:VH-100;
  ctx.globalAlpha=touch.moveId!==null?.5:.22;
  ctx.strokeStyle='#e8d9c0';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.arc(jx,jy,50,0,7);ctx.stroke();
  ctx.fillStyle='#e8d9c0';
  ctx.beginPath();ctx.arc(jx+touch.moveDx,jy+touch.moveDy,22,0,7);ctx.fill();
  ctx.globalAlpha=1;
  // right side: aim stick (twin) or throw button (auto)
  if(aimMode==='twin'){
    const ax=touch.aimId!==null?touch.aimOx:VW*.85;
    const ay=touch.aimId!==null?touch.aimOy:VH-100;
    ctx.globalAlpha=touch.aimId!==null?.5:.22;
    ctx.strokeStyle='#ffa63e';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.arc(ax,ay,50,0,7);ctx.stroke();
    ctx.fillStyle='#ffa63e';
    ctx.beginPath();ctx.arc(ax+touch.aimDx,ay+touch.aimDy,22,0,7);ctx.fill();
    ctx.globalAlpha=1;
  } else {
    const tx=VW-72,ty=VH-88;
    touch.btns.throw={x:tx,y:ty,r:38,tid:touch.btns.throw?touch.btns.throw.tid:null};
    ctx.globalAlpha=touch.firing?.85:.5;
    ctx.fillStyle='#c1642a';ctx.beginPath();ctx.arc(tx,ty,38,0,7);ctx.fill();
    ctx.drawImage(SPR.stone,tx-18,ty-18,36,36);
    ctx.globalAlpha=1;
  }
  drawTouchSkills();
  // tool buttons (active items)
  const slotIcons={bola:SPR.bola,dart:SPR.obsidian,fist:SPR.rock,ember:SPR.torch,shield:SPR.slab,decoy:SPR.bone};
  const t0x=aimMode==='twin'?VW-56:VW-140,t0y=aimMode==='twin'?VH-190:VH-70;
  const t1x=aimMode==='twin'?VW-116:VW-160,t1y=aimMode==='twin'?VH-170:VH-134;
  touch.btns.tool0={x:t0x,y:t0y,r:24};
  touch.btns.tool1={x:t1x,y:t1y,r:24};
  ctx.globalAlpha=.75;
  drawToolSlot(t0x,t0y,24,game.actives[0],slotIcons,'T1');
  drawToolSlot(t1x,t1y,24,game.actives[1],slotIcons,'T2');
  ctx.globalAlpha=1;
  // pause button
  const px2=44,py2=HUDH+30;
  touch.btns.pause={x:px2,y:py2,r:20};
  ctx.globalAlpha=.7;
  ctx.fillStyle='rgba(12,8,5,.8)';ctx.beginPath();ctx.arc(px2,py2,20,0,7);ctx.fill();
  ctx.strokeStyle='#8a7660';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='#e8d9c0';
  ctx.fillRect(px2-7,py2-8,5,16);ctx.fillRect(px2+2,py2-8,5,16);
  ctx.globalAlpha=1;
  // craft button
  const cx2=VW-44,cy2=HUDH+30;
  touch.btns.craft={x:cx2,y:cy2,r:22};
  ctx.globalAlpha=.75;
  ctx.fillStyle='rgba(12,8,5,.8)';ctx.beginPath();ctx.arc(cx2,cy2,22,0,7);ctx.fill();
  ctx.strokeStyle='#c1642a';ctx.lineWidth=2;ctx.stroke();
  ctx.drawImage(SPR.flint,cx2-13,cy2-13,26,26);
  ctx.fillStyle='#c1642a';ctx.font='bold 8px Trebuchet MS';ctx.textAlign='center';
  ctx.fillText('SHOP',cx2,cy2+32);ctx.textAlign='left';
  ctx.globalAlpha=1;
}
