"use strict";
// ---------- minimap ----------
// The craft panel became the shop (shop.js).
// Load order matters: see index.html. Plain script scope, no modules.
function drawMinimap(){
  if(game.mode==='tower'){
    ctx.textAlign='right';
    ctx.font='bold 11px Trebuchet MS';
    ctx.fillStyle='#5f8a4a';
    ctx.fillText('— THE FIRST TOWER —',VW-16,HUDH+16);
    ctx.textAlign='left';
    return;
  }
  // whole MOBA map is always shown so the lanes read at a glance; visited rooms
  // are filled, the rest outlined. Doors drawn as links between adjacent rooms.
  const rooms=game.rooms;
  const all=Object.values(rooms);
  const cw=13,ch=9,gap=3;
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
  for(const r of all){minx=Math.min(minx,r.gx);maxx=Math.max(maxx,r.gx);miny=Math.min(miny,r.gy);maxy=Math.max(maxy,r.gy);}
  const mw=(maxx-minx+1)*(cw+gap),mh=(maxy-miny+1)*(ch+gap);
  const px=VW-mw-(IS_TOUCH?76:16),py=HUDH+4;
  const cx=r=>px+(r.gx-minx)*(cw+gap),cy=r=>py+(r.gy-miny)*(ch+gap);
  ctx.fillStyle='rgba(12,8,5,.62)';roundRect(ctx,px-6,py-6,mw+12,mh+12,8);ctx.fill();
  ctx.strokeStyle='#57422c';ctx.lineWidth=1.5;ctx.stroke();
  // links
  ctx.strokeStyle='rgba(120,90,54,.5)';ctx.lineWidth=2;
  for(const r of all)for(const d of ['e','s']){
    const n=rooms[key(r.gx+DIRV[d][0],r.gy+DIRV[d][1])];
    if(n){ctx.beginPath();ctx.moveTo(cx(r)+cw/2,cy(r)+ch/2);ctx.lineTo(cx(n)+cw/2,cy(n)+ch/2);ctx.stroke();}
  }
  for(const r of all){
    const x=cx(r),y=cy(r),cur=r===game.cur;
    if(r.visited){ctx.fillStyle=cur?'#ffa63e':'#6b5236';roundRect(ctx,x,y,cw,ch,2);ctx.fill();}
    else{ctx.strokeStyle='#4a3826';ctx.lineWidth=1.5;roundRect(ctx,x+.5,y+.5,cw-1,ch-1,2);ctx.stroke();}
    let icon=null;
    if(r.type==='start')icon='#8ad0e2';
    else if(r.type==='exit')icon='#c8402e';        // the objective / guardian
    else if(r.type==='treasure')icon='#b9c6cf';
    else if(r.type==='grok')icon='#8ac24a';
    else if(r.type==='shrine')icon='#c1642a';
    else if(r.type==='brush')icon='#3f5a2c';       // jungle hide
    if(icon){ctx.fillStyle=icon;ctx.beginPath();ctx.arc(x+cw/2,y+ch/2,r.type==='exit'?3:2,0,7);ctx.fill();}
  }
}
