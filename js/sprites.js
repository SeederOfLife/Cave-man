"use strict";
// ---------- sprite helpers: mkS, gradients, muscle/rim shading, drawHunter, outlined ----------
// Pulp-heroic vector art (Frazetta / Savage Sword register): hard shadow one
// side, rim light the other, muscle grooves as dark strokes. Load order: index.html.
const S=96; // sprite canvas size
function mkS(fn,size){
  const sz=size||S;
  const c=document.createElement('canvas');c.width=sz;c.height=sz;
  const g=c.getContext('2d');g.imageSmoothingEnabled=true;
  fn(g,sz);return c;
}
function rg(g,x,y,r,c1,c2){const gr=g.createRadialGradient(x-r*.3,y-r*.35,r*.15,x,y,r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);return gr;}
function lg(g,x0,y0,x1,y1,c1,c2){const gr=g.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,c1);gr.addColorStop(1,c2);return gr;}
function ell(g,x,y,rx,ry,fill){g.fillStyle=fill;g.beginPath();g.ellipse(x,y,rx,ry,0,0,7);g.fill();}
// muscle/contour groove: a soft dark stroke
function groove(g,s,pts,w,col){
  g.strokeStyle=col||'rgba(0,0,0,.28)';g.lineWidth=s*(w||.02);g.lineCap='round';
  g.beginPath();g.moveTo(pts[0]*s,pts[1]*s);
  for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i]*s,pts[i+1]*s);
  g.stroke();
}
// rim highlight arc down one edge of a limb/mass
function rim(g,x,y,r,a0,a1,col){
  g.strokeStyle=col||'rgba(255,240,210,.5)';g.lineWidth=Math.max(1,r*.14);g.lineCap='round';
  g.beginPath();g.arc(x,y,r,a0,a1);g.stroke();
}
function heartPath(g,s){
  g.beginPath();
  g.moveTo(s*.5,s*.88);
  g.bezierCurveTo(s*.08,s*.58,s*.04,s*.3,s*.28,s*.18);
  g.bezierCurveTo(s*.42,s*.11,s*.5,s*.24,s*.5,s*.32);
  g.bezierCurveTo(s*.5,s*.24,s*.58,s*.11,s*.72,s*.18);
  g.bezierCurveTo(s*.96,s*.3,s*.92,s*.58,s*.5,s*.88);
  g.closePath();
}
// handsome long-haired barbarian (Jondalar × Conan), HIPS-UP only — the legs
// are drawn & animated procedurally at render time (drawHeroLegs in render-fx.js).
function drawHunter(g,s,skin,skinD,hair,tunic,tunicD){
  // ---- long flowing mane, behind everything ----
  g.fillStyle=hair;
  g.beginPath();g.moveTo(s*.42,s*.14);
  g.quadraticCurveTo(s*.16,s*.3,s*.26,s*.62);
  g.quadraticCurveTo(s*.33,s*.7,s*.43,s*.6);
  g.quadraticCurveTo(s*.34,s*.4,s*.5,s*.2);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.6,s*.14);
  g.quadraticCurveTo(s*.82,s*.3,s*.73,s*.6);
  g.quadraticCurveTo(s*.66,s*.68,s*.57,s*.58);
  g.quadraticCurveTo(s*.62,s*.38,s*.54,s*.16);g.closePath();g.fill();
  g.strokeStyle='rgba(0,0,0,.2)';g.lineWidth=s*.012;g.lineCap='round';
  g.beginPath();g.moveTo(s*.3,s*.32);g.quadraticCurveTo(s*.28,s*.5,s*.35,s*.6);
  g.moveTo(s*.69,s*.34);g.quadraticCurveTo(s*.71,s*.5,s*.63,s*.58);g.stroke();
  // ---- club raised high in right fist ----
  g.strokeStyle='#5a3a1e';g.lineWidth=s*.06;g.lineCap='round';
  g.beginPath();g.moveTo(s*.72,s*.4);g.lineTo(s*.9,s*.12);g.stroke();
  g.fillStyle=rg(g,s*.9,s*.11,s*.1,'#9a6636','#4a2f18');
  g.beginPath();g.ellipse(s*.9,s*.12,s*.11,s*.085,-.7,0,7);g.fill();
  g.fillStyle='#3c2614';g.beginPath();g.arc(s*.86,s*.1,s*.017,0,7);g.arc(s*.94,s*.15,s*.014,0,7);g.fill();
  // ---- fur loincloth (bottom of the hips-up sprite) ----
  g.fillStyle=lg(g,s*.5,s*.54,s*.5,s*.68,tunic,tunicD);
  g.beginPath();g.moveTo(s*.35,s*.54);g.lineTo(s*.65,s*.54);g.lineTo(s*.67,s*.68);
  g.quadraticCurveTo(s*.5,s*.64,s*.33,s*.68);g.closePath();g.fill();
  g.strokeStyle=tunicD;g.lineWidth=s*.018;
  for(let i=0;i<4;i++){g.beginPath();g.moveTo(s*(.4+i*.06),s*.65);g.lineTo(s*(.39+i*.06),s*.71);g.stroke();}
  // ---- muscular torso (V), pecs + abs ----
  g.fillStyle=rg(g,s*.5,s*.42,s*.2,'#f6dcb4',skinD);
  g.beginPath();g.moveTo(s*.32,s*.36);g.quadraticCurveTo(s*.5,s*.3,s*.68,s*.36);
  g.lineTo(s*.62,s*.56);g.quadraticCurveTo(s*.5,s*.6,s*.38,s*.56);g.closePath();g.fill();
  groove(g,s,[.5,.36,.5,.54]);
  groove(g,s,[.4,.42,.5,.46,.6,.42]);
  groove(g,s,[.43,.5,.57,.5]);
  // ---- arms: right raised to club, left at side ----
  g.fillStyle=skin;
  g.beginPath();g.moveTo(s*.64,s*.38);g.quadraticCurveTo(s*.77,s*.38,s*.73,s*.44);g.quadraticCurveTo(s*.68,s*.44,s*.64,s*.5);g.closePath();g.fill();
  ell(g,s*.71,s*.42,s*.055,s*.05,skin);       // right shoulder/bicep
  ell(g,s*.3,s*.47,s*.052,s*.1,skin);          // left arm hanging
  ell(g,s*.3,s*.59,s*.042,s*.045,skinD);       // left fist
  rim(g,s*.3,s*.49,s*.07,2.4,3.9);             // rim on left arm
  // ---- head, handsome strong jaw ----
  g.fillStyle=rg(g,s*.53,s*.24,s*.15,'#f6dcb4',skinD);
  g.beginPath();g.moveTo(s*.42,s*.22);g.quadraticCurveTo(s*.43,s*.09,s*.55,s*.09);
  g.quadraticCurveTo(s*.66,s*.1,s*.65,s*.24);
  g.quadraticCurveTo(s*.64,s*.37,s*.53,s*.39);
  g.quadraticCurveTo(s*.45,s*.37,s*.42,s*.22);g.closePath();g.fill();
  // front fringe framing the face
  g.fillStyle=hair;
  g.beginPath();g.moveTo(s*.42,s*.2);g.quadraticCurveTo(s*.4,s*.07,s*.57,s*.06);
  g.quadraticCurveTo(s*.5,s*.11,s*.46,s*.2);g.closePath();g.fill();
  ell(g,s*.42,s*.26,s*.028,s*.09,hair);        // sideburn strand
  // headband (hippie / barbarian)
  g.strokeStyle=tunicD;g.lineWidth=s*.028;g.lineCap='round';
  g.beginPath();g.moveTo(s*.42,s*.17);g.lineTo(s*.66,s*.16);g.stroke();
  g.fillStyle=tunic;g.beginPath();g.arc(s*.44,s*.17,s*.016,0,7);g.fill();
  // straight nose, brow, eyes
  g.strokeStyle=skinD;g.lineWidth=s*.013;
  g.beginPath();g.moveTo(s*.6,s*.24);g.lineTo(s*.62,s*.3);g.lineTo(s*.58,s*.31);g.stroke();
  g.strokeStyle=hair;g.lineWidth=s*.02;
  g.beginPath();g.moveTo(s*.5,s*.23);g.lineTo(s*.62,s*.22);g.stroke();
  g.fillStyle='#241a10';
  g.beginPath();g.arc(s*.545,s*.26,s*.018,0,7);g.fill();
  g.beginPath();g.arc(s*.62,s*.255,s*.018,0,7);g.fill();
  // stubble + slight smirk
  groove(g,s,[.46,.33,.56,.35],.016,'rgba(0,0,0,.18)');
  g.strokeStyle='#2e1e10';g.lineWidth=s*.013;g.lineCap='round';
  g.beginPath();g.moveTo(s*.55,s*.335);g.lineTo(s*.6,s*.325);g.stroke();
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
