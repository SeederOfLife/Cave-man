"use strict";
// ---------- shop: tabs, component trees, 6 slots, buy/merge ----------
let shopTab=0;
function ownedCount(id){return game.items.filter(x=>x===id).length;}
function canAfford(cost){for(const m in cost)if((game.mats[m]||0)<cost[m])return false;return true;}
function payCost(cost){for(const m in cost)game.mats[m]-=cost[m];}
function shopBuy(it){
  if(!it)return;
  const isComp=!it.from;
  if(ownedCount(it.id)&&!isComp){showMsg('ALREADY CARRIED.');return;}
  if(isComp){
    if(game.items.length>=6){showMsg('SIX HANDS OF THE TRIBE. POUCH FULL.');return;}
    if(!canAfford(it.cost)){showMsg('NEED '+Object.keys(it.cost).map(k=>k.toUpperCase()).join(' + ')+'.');return;}
    payCost(it.cost);game.items.push(it.id);
  } else {
    // needs its two components in the pouch; they merge into the finished item
    const need=[...it.from];
    for(const id of game.items){const ix=need.indexOf(id);if(ix>=0)need.splice(ix,1);}
    if(need.length){showMsg('NEED '+need.map(id=>ITEM_BY_ID[id].name).join(' + ')+' FIRST.');return;}
    if(!canAfford(it.cost)){showMsg('NEED '+Object.keys(it.cost).map(k=>k.toUpperCase()).join(' + ')+'.');return;}
    payCost(it.cost);
    for(const c of it.from){game.items.splice(game.items.indexOf(c),1);}
    game.items.push(it.id);
    if(it.active&&!game.actives.includes(it.id))game.actives.push(it.id);
  }
  recalcStats();
  sfx('clear');
  showMsg(it.name+(isComp?' TAKEN.':' MADE. '+it.fx));
}
function shopKey(n){ // digits 1-9,0 buy the Nth entry of the tab; comps via clicks/taps
  const it=SHOP_TABS[shopTab].list[n];
  shopBuy(it);
}
function shopTap(clientX,clientY){
  const r=cvs.getBoundingClientRect();
  const x=clientX-r.left,y=clientY-r.top;
  for(const row of touch.panelRows){
    if(x>=row.x&&x<=row.x+row.w&&y>=row.y&&y<=row.y+row.h){
      if(row.close)game.craftOpen=false;
      else if(row.tab!==undefined)shopTab=row.tab;
      else shopBuy(ITEM_BY_ID[row.id]);
      return;
    }
  }
}
function drawCostIcons(cost,x,y,sz){
  for(const m in cost){
    ctx.drawImage(SPR[m],x,y-sz*.7,sz,sz);
    const have=(game.mats[m]||0)>=cost[m];
    ctx.fillStyle=have?'#e8d9c0':'#c8402e';ctx.font='bold '+(sz*.6|0)+'px Trebuchet MS';
    ctx.fillText(cost[m],x+sz,y);
    x+=sz*1.9;
  }
  return x;
}
function drawShop(){
  touch.panelRows=[];
  if(!game.craftOpen)return;
  const pw=Math.min(760,VW-24),ph=Math.min(560,VH-30);
  const px=(VW-pw)/2,py=(VH-ph)/2;
  ctx.fillStyle='rgba(5,3,2,.88)';ctx.fillRect(0,0,VW,VH);
  ctx.fillStyle='#1c130c';roundRect(ctx,px,py,pw,ph,14);ctx.fill();
  ctx.strokeStyle='#57422c';ctx.lineWidth=3;ctx.stroke();
  ctx.font='800 18px Trebuchet MS';ctx.textAlign='center';
  ctx.fillStyle='#c1642a';ctx.fillText('THE SILENT TRADER · '+game.items.length+'/6 CARRIED',px+pw/2,py+24);
  ctx.textAlign='left';
  // close
  const cbx=px+pw-26,cby=py+22;
  touch.panelRows.push({x:cbx-18,y:cby-18,w:36,h:36,close:true});
  ctx.strokeStyle='#8a7660';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(cbx-8,cby-8);ctx.lineTo(cbx+8,cby+8);ctx.moveTo(cbx+8,cby-8);ctx.lineTo(cbx-8,cby+8);ctx.stroke();
  // tabs
  const tw=(pw-20)/SHOP_TABS.length;
  for(let t=0;t<SHOP_TABS.length;t++){
    const tx=px+10+t*tw,ty=py+36;
    touch.panelRows.push({x:tx,y:ty,w:tw-4,h:24,tab:t});
    ctx.fillStyle=t===shopTab?'#c1642a':'#241a10';roundRect(ctx,tx,ty,tw-4,24,6);ctx.fill();
    ctx.fillStyle=t===shopTab?'#140d07':'#8a7660';ctx.font='bold 11px Trebuchet MS';ctx.textAlign='center';
    ctx.fillText(SHOP_TABS[t].name+' ('+SHOP_TABS[t].list.length+')',tx+tw/2-2,ty+16);ctx.textAlign='left';
  }
  // item grid: 2 columns
  const list=SHOP_TABS[shopTab].list;
  const rows=Math.ceil(list.length/2),gy0=py+70,rh=Math.min(40,(ph-160)/rows),cw=(pw-30)/2;
  ctx.font='10px Trebuchet MS';
  for(let i=0;i<list.length;i++){
    const it=list[i];
    const col=i%2,row2=(i/2)|0;
    const x=px+10+col*(cw+10),y=gy0+row2*rh;
    const owned=ownedCount(it.id)>0;
    let can=canAfford(it.cost)&&!owned;
    if(can){const need=[...it.from];for(const id of game.items){const ix=need.indexOf(id);if(ix>=0)need.splice(ix,1);}if(need.length)can=false;}
    touch.panelRows.push({x,y,w:cw,h:rh-3,id:it.id});
    ctx.globalAlpha=owned?.4:can?1:.65;
    if(can){ctx.fillStyle='rgba(193,100,42,.16)';roundRect(ctx,x,y,cw,rh-3,6);ctx.fill();}
    ctx.fillStyle=owned?'#6b5236':can?'#ffa63e':'#a08a70';
    ctx.font='bold 11px Trebuchet MS';
    ctx.fillText((i<9?'['+(i+1)+'] ':i===9?'[0] ':'')+it.name,x+6,y+12);
    ctx.fillStyle='#8a7660';ctx.font='9px Trebuchet MS';
    ctx.fillText(owned?'CARRIED':it.fx,x+6,y+23);
    // tree: components + extra cost
    let ix2=x+cw*.62;
    ctx.font='bold 9px Trebuchet MS';
    for(const cid of it.from){
      const has=game.items.includes(cid);
      ctx.fillStyle=has?'#8ac24a':'#5a4c3c';
      ctx.fillText(ITEM_BY_ID[cid].name.split(' ')[1]||ITEM_BY_ID[cid].name,ix2,y+11);
      ix2+=cw*.17;
    }
    drawCostIcons(it.cost,x+cw*.62,y+23,12);
    ctx.globalAlpha=1;
  }
  // component strip
  const sy=py+ph-64;
  ctx.fillStyle='#8a7660';ctx.font='bold 10px Trebuchet MS';
  ctx.fillText('RAW PARTS (TAP/CLICK TO BUY · THEY MERGE INTO THE BIG THINGS)',px+12,sy-6);
  const cw2=(pw-24)/COMPS.length;
  for(let i=0;i<COMPS.length;i++){
    const c=COMPS[i],x=px+12+i*cw2,y=sy;
    const n=ownedCount(c.id);
    touch.panelRows.push({x,y,w:cw2-4,h:44,id:c.id});
    ctx.fillStyle=n?'rgba(138,194,74,.15)':'rgba(36,26,16,.9)';roundRect(ctx,x,y,cw2-4,44,6);ctx.fill();
    ctx.strokeStyle='#57422c';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=n?'#8ac24a':'#c9a06a';ctx.font='bold 9px Trebuchet MS';
    ctx.fillText(c.name+(n?' ×'+n:''),x+5,y+12);
    ctx.fillStyle='#8a7660';ctx.fillText(c.fx,x+5,y+23);
    drawCostIcons(c.cost,x+5,y+38,11);
  }
  ctx.font='10px Trebuchet MS';ctx.fillStyle='#8a7660';ctx.textAlign='center';
  ctx.fillText('[TAB] CATEGORY · [1-9,0] BUY · [C] CLOSE · SAME SHOP FOR EVERY HUNTER',px+pw/2,py+ph-8);
  ctx.textAlign='left';
}
