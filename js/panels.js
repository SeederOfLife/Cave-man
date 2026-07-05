"use strict";
// ---------- craft panel · minimap ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- craft panel ----------
function craftPanelTap(clientX,clientY){
  const r=cvs.getBoundingClientRect();
  const x=clientX-r.left,y=clientY-r.top;
  for(const row of touch.panelRows){
    if(x>=row.x&&x<=row.x+row.w&&y>=row.y&&y<=row.y+row.h){
      if(row.close)game.craftOpen=false;
      else craft(row.i);
      return;
    }
  }
}
function drawCraftPanel(){
  touch.panelRows=[];
  if(!game.craftOpen)return;
  const pw=Math.min(660,VW-40),ph=Math.min(540,VH-50);
  const px=(VW-pw)/2,py=(VH-ph)/2;
  ctx.fillStyle='rgba(5,3,2,.85)';ctx.fillRect(0,0,VW,VH);
  ctx.fillStyle='#1c130c';roundRect(ctx,px,py,pw,ph,14);ctx.fill();
  ctx.strokeStyle='#57422c';ctx.lineWidth=3;ctx.stroke();
  ctx.strokeStyle='#c1642a';ctx.lineWidth=1;roundRect(ctx,px+5,py+5,pw-10,ph-10,10);ctx.stroke();
  ctx.textAlign='center';
  ctx.font='800 20px Trebuchet MS';
  ctx.fillStyle='#c1642a';ctx.fillText('KNAPPING & HAFTING',px+pw/2,py+30);
  ctx.font='10px Trebuchet MS';
  const np=REC.filter(x=>x.kind==='passive'&&game.crafted[x.id]).length;
  ctx.fillStyle='#8a7660';ctx.fillText('CRAFTS '+np+'/3 · TOOLS '+game.actives.length+'/2 · '+(IS_TOUCH?'TAP TO CRAFT':'[1-9,0] CRAFT · [C] CLOSE'),px+pw/2,py+48);
  ctx.textAlign='left';
  // close button
  const cbx=px+pw-28,cby=py+26;
  touch.panelRows.push({x:cbx-18,y:cby-18,w:36,h:36,close:true});
  ctx.strokeStyle='#8a7660';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(cbx-8,cby-8);ctx.lineTo(cbx+8,cby+8);ctx.moveTo(cbx+8,cby-8);ctx.lineTo(cbx-8,cby+8);ctx.stroke();
  const rowH=(ph-72)/REC.length;
  const compact=rowH<46;
  for(let i=0;i<REC.length;i++){
    const r=REC[i],y=py+62+i*rowH;
    const done=!!game.crafted[r.id];
    let can=!done;
    for(const m in r.cost)if((game.mats[m]||0)<r.cost[m])can=false;
    if(r.kind==='active'&&game.actives.length>=2&&!done)can=false;
    if(r.kind==='passive'&&np>=3&&!done)can=false;
    touch.panelRows.push({x:px+10,y:y-12,w:pw-20,h:rowH-4,i});
    ctx.globalAlpha=done?.45:can?1:.6;
    if(can&&!done){ctx.fillStyle='rgba(193,100,42,.14)';roundRect(ctx,px+12,y-11,pw-24,rowH-6,8);ctx.fill();}
    ctx.fillStyle=r.kind==='active'?'#5f8a4a':'#8a7660';
    ctx.font='bold 8px Trebuchet MS';
    ctx.fillText(r.kind==='active'?'TOOL':'CRAFT',px+22,y-1);
    ctx.fillStyle=done?'#6b5236':can?'#ffa63e':'#8a7660';
    ctx.font='bold '+(compact?12:14)+'px Trebuchet MS';
    ctx.fillText((IS_TOUCH?'':'['+(i+1)+'] ')+r.name,px+22,y+13);
    let ix=px+pw*.4;
    for(const m in r.cost){
      ctx.drawImage(SPR[m],ix,y-4,18,18);
      const have=(game.mats[m]||0)>=r.cost[m];
      ctx.fillStyle=have?'#e8d9c0':'#c8402e';
      ctx.font='bold 10px Trebuchet MS';
      ctx.fillText((game.mats[m]||0)+'/'+r.cost[m],ix+18,y+9);
      ix+=48;
    }
    ctx.fillStyle=done?'#5f8a4a':'#c9a06a';
    ctx.font='bold 9px Trebuchet MS';
    ctx.fillText(done?'MADE':r.fx,px+pw*.68,y+9);
    if(!compact){
      ctx.fillStyle='#8a7660';ctx.font='italic 10px Trebuchet MS';
      ctx.fillText(r.lore,px+22,y+27);
    }
    ctx.globalAlpha=1;
  }
}

// ---------- minimap ----------
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
