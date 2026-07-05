"use strict";
// ---------- sprite helpers: mkS, rg, ell, heartPath, drawHunter, outlined ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- smooth vector sprites (pre-rendered) ----------
const S=96; // sprite canvas size
function mkS(fn,size){
  const sz=size||S;
  const c=document.createElement('canvas');c.width=sz;c.height=sz;
  const g=c.getContext('2d');g.imageSmoothingEnabled=true;
  fn(g,sz);return c;
}
function rg(g,x,y,r,c1,c2){const gr=g.createRadialGradient(x-r*.3,y-r*.35,r*.15,x,y,r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);return gr;}
function ell(g,x,y,rx,ry,fill){g.fillStyle=fill;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();}
function heartPath(g,s){
  g.beginPath();
  g.moveTo(s*.5,s*.88);
  g.bezierCurveTo(s*.08,s*.58,s*.04,s*.3,s*.28,s*.18);
  g.bezierCurveTo(s*.42,s*.11,s*.5,s*.24,s*.5,s*.32);
  g.bezierCurveTo(s*.5,s*.24,s*.58,s*.11,s*.72,s*.18);
  g.bezierCurveTo(s*.96,s*.3,s*.92,s*.58,s*.5,s*.88);
  g.closePath();
}
function drawHunter(g,s,skin,skinD,hair,tunic,tunicD){
  // club (behind body, in right hand)
  g.strokeStyle='#6b4423';g.lineWidth=s*.055;g.lineCap='round';
  g.beginPath();g.moveTo(s*.72,s*.6);g.lineTo(s*.88,s*.4);g.stroke();
  g.fillStyle=rg(g,s*.89,s*.37,s*.07,'#8a5a30','#5a3a1e');
  g.beginPath();g.ellipse(s*.89,s*.37,s*.075,s*.06,-.8,0,7);g.fill();
  // legs
  ell(g,s*.42,s*.85,s*.055,s*.09,skinD);
  ell(g,s*.58,s*.85,s*.055,s*.09,skinD);
  // tunic (fur)
  g.fillStyle=rg(g,s*.5,s*.62,s*.24,tunic,tunicD);
  g.beginPath();
  g.moveTo(s*.32,s*.48);
  g.quadraticCurveTo(s*.5,s*.42,s*.68,s*.48);
  g.lineTo(s*.72,s*.72);
  g.quadraticCurveTo(s*.5,s*.8,s*.28,s*.72);
  g.closePath();g.fill();
  // fur ticks
  g.strokeStyle=tunicD;g.lineWidth=s*.015;
  for(let i=0;i<4;i++){g.beginPath();g.moveTo(s*(.36+i*.09),s*.72);g.lineTo(s*(.34+i*.09),s*.78);g.stroke();}
  // arms
  ell(g,s*.28,s*.58,s*.05,s*.085,skin);
  ell(g,s*.72,s*.58,s*.05,s*.085,skin);
  // head
  g.fillStyle=rg(g,s*.5,s*.3,s*.19,skin,skinD);
  g.beginPath();g.arc(s*.5,s*.3,s*.185,0,7);g.fill();
  // hair cap
  g.fillStyle=hair;
  g.beginPath();g.arc(s*.5,s*.27,s*.19,Math.PI*1.02,Math.PI*1.98);
  g.quadraticCurveTo(s*.72,s*.34,s*.66,s*.2);
  g.closePath();g.fill();
  ell(g,s*.34,s*.3,s*.045,s*.07,hair);
  // eyes (facing right)
  g.fillStyle='#241a10';
  g.beginPath();g.arc(s*.55,s*.31,s*.022,0,7);g.fill();
  g.beginPath();g.arc(s*.64,s*.31,s*.022,0,7);g.fill();
  // brow
  g.strokeStyle=hair;g.lineWidth=s*.025;
  g.beginPath();g.moveTo(s*.51,s*.26);g.lineTo(s*.68,s*.26);g.stroke();
}
function outlined(c,col,px){
  col=col||'#17100a';px=px||3.5;
  const sil=document.createElement('canvas');sil.width=c.width;sil.height=c.height;
  const sg=sil.getContext('2d');
  sg.drawImage(c,0,0);
  sg.globalCompositeOperation='source-in';
  sg.fillStyle=col;sg.fillRect(0,0,c.width,c.height);
  const out=document.createElement('canvas');out.width=c.width;out.height=c.height;
  const og=out.getContext('2d');og.imageSmoothingEnabled=true;
  for(let a=0;a<8;a++){
    og.drawImage(sil,Math.cos(a*Math.PI/4)*px,Math.sin(a*Math.PI/4)*px);
  }
  og.drawImage(c,0,0);
  return out;
}
