"use strict";
// ---------- skill bar · ult meter · XP · 6 item slots (desktop + touch) ----------
const CATCOL={p:'#c8402e',m:'#b9a6e8',d:'#8ac24a',v:'#8ad0e2'};
function itemCol(id){
  const it=ITEM_BY_ID[id];
  if(it&&it.active)return '#ffd93b';
  if(CATCOL[id[0]]&&id.length===3)return CATCOL[id[0]];
  return '#8a7660';
}
function drawSkillCircle(x,y,r,i){
  const s=SKILLS[i],lv=game.skillLv[s.id];
  ctx.fillStyle='rgba(12,8,5,.75)';ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  ctx.strokeStyle=s.ult?'#c1642a':'#57422c';ctx.lineWidth=2;ctx.stroke();
  if(s.ult){
    const ch=game.ultCharge/100;
    ctx.strokeStyle=ch>=1?'#ffd93b':'#8a5a30';ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(x,y,r-3,-Math.PI/2,-Math.PI/2+6.28*ch);ctx.stroke();
    if(ch>=1&&(game.time*3|0)%2===0){ctx.fillStyle='rgba(255,217,59,.25)';ctx.beginPath();ctx.arc(x,y,r-5,0,7);ctx.fill();}
  } else if(game.scd[s.id]>0){
    ctx.fillStyle='rgba(90,76,60,.5)';
    ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r-2,-Math.PI/2,-Math.PI/2+6.28*(game.scd[s.id]/s.cd));ctx.closePath();ctx.fill();
  }
  ctx.fillStyle='#e8d9c0';ctx.font='bold '+(r*.7|0)+'px Trebuchet MS';ctx.textAlign='center';
  ctx.fillText(s.key,x,y+r*.25);
  ctx.font='bold 8px Trebuchet MS';ctx.fillStyle='#ffd93b';
  ctx.fillText('•'.repeat(lv),x,y+r+9);
  ctx.textAlign='left';
}
function drawSkillBarDesktop(){
  const y=VH-40,x0=VW/2-75;
  for(let i=0;i<3;i++)drawSkillCircle(x0+i*46,y,16,i);
  drawSkillCircle(x0+3*46+8,y,20,3);
}
function drawTouchSkills(){
  // right column above the throw zone; registers hit zones each frame
  const bx=VW-52,by0=VH-250;
  for(let i=0;i<3;i++){
    const x=bx-(aimMode==='twin'?64:0),y=by0-i*56;
    touch.btns['skill'+i]={x,y,r:23};
    ctx.globalAlpha=.8;drawSkillCircle(x,y,23,i);ctx.globalAlpha=1;
  }
  const ux=bx-(aimMode==='twin'?64:0),uy=by0-3*56-6;
  touch.btns.ult={x:ux,y:uy,r:27};
  ctx.globalAlpha=.85;drawSkillCircle(ux,uy,27,3);ctx.globalAlpha=1;
}
function drawXpBar(){
  const bx=16,by=game.twoP?64:52,bw=160;
  ctx.fillStyle='#241a10';roundRect(ctx,bx+20,by,bw,5,2.5);ctx.fill();
  ctx.fillStyle='#ffd93b';roundRect(ctx,bx+20,by,Math.max(2,bw*(game.xp/xpNeed())),5,2.5);ctx.fill();
  ctx.fillStyle='#ffd93b';ctx.font='bold 10px Trebuchet MS';
  ctx.fillText('LVL '+game.level+(game.pendingPts>0?' [T] +'+game.pendingPts:''),bx+20+bw+6,by+6);
}
function drawItemSlots(){
  const my=VH-(IS_TOUCH?128:56);
  let x=14,y=my-40;
  for(let i=0;i<6;i++){
    const id=game.items[i];
    ctx.fillStyle='rgba(12,8,5,.72)';roundRect(ctx,x,y,26,26,5);ctx.fill();
    ctx.strokeStyle=id?itemCol(id):'#3a2c1c';ctx.lineWidth=2;ctx.stroke();
    if(id){
      const it=ITEM_BY_ID[id];
      ctx.fillStyle=itemCol(id);ctx.font='bold 8px Trebuchet MS';ctx.textAlign='center';
      ctx.fillText(it.name.split(' ')[0].slice(0,4),x+13,y+16);ctx.textAlign='left';
    }
    x+=30;
  }
}
