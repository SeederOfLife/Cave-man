"use strict";
// ---------- keyboard/mouse · touch ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- input: keyboard/mouse ----------
const keys={};
let mouse={x:0,y:0,down:false};
window.addEventListener('keydown',e=>{keys[e.code]=true;
  if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
  if(e.code==='KeyR'&&game&&game.dead)start(game.twoP?2:1);
  if(e.code==='KeyC'&&game&&!game.dead&&!game.trans&&!game.paused&&!game.lvlOpen)game.craftOpen=!game.craftOpen;
  if(e.code==='KeyT'&&game&&!game.dead&&game.pendingPts>0&&!game.craftOpen)game.lvlOpen=true;
  if(e.code==='Tab'&&game&&game.craftOpen){e.preventDefault();shopTab=(shopTab+1)%SHOP_TABS.length;}
  if((e.code==='Escape'||e.code==='KeyP')&&game&&!game.dead){
    if(game.lvlOpen)game.lvlOpen=false;
    else if(game.craftOpen)game.craftOpen=false;
    else setPause(!game.paused);
  }
  if(game&&game.lvlOpen&&/^Digit[1-4]$/.test(e.code)){chooseSkill(parseInt(e.code[5])-1);return;}
  if(game&&game.craftOpen&&/^Digit[0-9]$/.test(e.code))shopKey(e.code==='Digit0'?9:parseInt(e.code[5])-1);
});
window.addEventListener('keyup',e=>{keys[e.code]=false;});
cvs.addEventListener('mousemove',e=>{const r=cvs.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
cvs.addEventListener('mousedown',e=>{
  mouse.down=true;
  if(game&&game.lvlOpen)levelPanelTap(e.clientX,e.clientY);
  else if(game&&game.craftOpen)shopTap(e.clientX,e.clientY);
});
window.addEventListener('mouseup',()=>{mouse.down=false;});
window.addEventListener('contextmenu',e=>e.preventDefault());

// ---------- input: touch ----------
const touch={
  moveId:null,moveOx:0,moveOy:0,moveDx:0,moveDy:0,
  aimId:null,aimOx:0,aimOy:0,aimDx:0,aimDy:0,
  firing:false,btns:{},panelRows:[],
};
function touchXY(t){const r=cvs.getBoundingClientRect();return{x:t.clientX-r.left,y:t.clientY-r.top};}
function hitBtn(x,y){
  for(const id in touch.btns){
    const b=touch.btns[id];
    if(Math.hypot(x-b.x,y-b.y)<b.r+8)return id;
  }
  return null;
}
cvs.addEventListener('touchstart',e=>{
  e.preventDefault();
  if(!game||game.dead)return;
  for(const t of e.changedTouches){
    const p=touchXY(t);
    if(game.lvlOpen){levelPanelTap(t.clientX,t.clientY);continue;}
    if(game.craftOpen){shopTap(t.clientX,t.clientY);continue;}
    const b=hitBtn(p.x,p.y);
    if(b){
      if(b==='throw'){touch.firing=true;touch.btns.throw.tid=t.identifier;}
      else if(b==='tool0')useActive(0,game.players[0]);
      else if(b==='tool1')useActive(1,game.players[0]);
      else if(b==='skill0')castSkill(0,game.players[0]);
      else if(b==='skill1')castSkill(1,game.players[0]);
      else if(b==='skill2')castSkill(2,game.players[0]);
      else if(b==='ult')castSkill(3,game.players[0]);
      else if(b==='craft')game.craftOpen=true;
      else if(b==='pause')setPause(true);
      continue;
    }
    if(p.x<VW*.45&&touch.moveId===null){
      touch.moveId=t.identifier;touch.moveOx=p.x;touch.moveOy=p.y;touch.moveDx=0;touch.moveDy=0;
    } else if(p.x>=VW*.45&&aimMode==='twin'&&touch.aimId===null){
      touch.aimId=t.identifier;touch.aimOx=p.x;touch.aimOy=p.y;touch.aimDx=0;touch.aimDy=0;
    }
  }
},{passive:false});
cvs.addEventListener('touchmove',e=>{
  e.preventDefault();
  for(const t of e.changedTouches){
    const p=touchXY(t);
    if(t.identifier===touch.moveId){
      touch.moveDx=p.x-touch.moveOx;touch.moveDy=p.y-touch.moveOy;
      const m=Math.hypot(touch.moveDx,touch.moveDy),max=52;
      if(m>max){touch.moveDx*=max/m;touch.moveDy*=max/m;}
    } else if(t.identifier===touch.aimId){
      touch.aimDx=p.x-touch.aimOx;touch.aimDy=p.y-touch.aimOy;
      const m=Math.hypot(touch.aimDx,touch.aimDy),max=52;
      if(m>max){touch.aimDx*=max/m;touch.aimDy*=max/m;}
    }
  }
},{passive:false});
function touchEnd(e){
  for(const t of e.changedTouches){
    if(t.identifier===touch.moveId){touch.moveId=null;touch.moveDx=0;touch.moveDy=0;}
    if(t.identifier===touch.aimId){touch.aimId=null;touch.aimDx=0;touch.aimDy=0;}
    if(touch.btns.throw&&touch.btns.throw.tid===t.identifier){touch.firing=false;touch.btns.throw.tid=null;}
  }
}
cvs.addEventListener('touchend',touchEnd);
cvs.addEventListener('touchcancel',touchEnd);
