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
  const rooms=game.rooms;
  const cw=13,ch=9,gap=3;
  let known=[];
  for(const k in rooms){
    const r=rooms[k];
    if(r.visited){known.push(r);continue;}
    for(const d of ['n','s','w','e']){
      const n=rooms[key(r.gx+DIRV[d][0],r.gy+DIRV[d][1])];
      if(n&&n.visited){known.push(r);break;}
    }
  }
  if(!known.length)return;
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
  for(const r of known){minx=Math.min(minx,r.gx);maxx=Math.max(maxx,r.gx);miny=Math.min(miny,r.gy);maxy=Math.max(maxy,r.gy);}
  const mw=(maxx-minx+1)*(cw+gap),mh=(maxy-miny+1)*(ch+gap);
  const px=VW-mw-(IS_TOUCH?76:16),py=HUDH+4;
  ctx.fillStyle='rgba(12,8,5,.6)';roundRect(ctx,px-6,py-6,mw+12,mh+12,8);ctx.fill();
  ctx.strokeStyle='#57422c';ctx.lineWidth=1.5;ctx.stroke();
  for(const r of known){
    const x=px+(r.gx-minx)*(cw+gap),y=py+(r.gy-miny)*(ch+gap);
    const cur=r===game.cur;
    if(r.visited){
      ctx.fillStyle=cur?'#ffa63e':'#6b5236';
      roundRect(ctx,x,y,cw,ch,2);ctx.fill();
    } else {
      ctx.strokeStyle='#4a3826';ctx.lineWidth=1.5;roundRect(ctx,x+.5,y+.5,cw-1,ch-1,2);ctx.stroke();
    }
    let icon=null;
    if(r.type==='treasure')icon='#b9c6cf';
    else if(r.type==='exit')icon='#000';
    else if(r.type==='grok')icon='#8ac24a';
    else if(r.type==='shrine')icon='#c1642a';
    if(icon){
      ctx.fillStyle=icon;
      ctx.beginPath();ctx.arc(x+cw/2,y+ch/2,2,0,7);ctx.fill();
    }
  }
}
