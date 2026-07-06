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
// muscular pulp barbarian, 3/4 front, head turned right, club raised
function drawHunter(g,s,skin,skinD,hair,tunic,tunicD){
  const skHi=lg(g,s*.3,s*.3,s*.7,s*.7,'#fff2d8',skin);
  // ---- club, raised high in the right fist ----
  g.strokeStyle='#5a3a1e';g.lineWidth=s*.07;g.lineCap='round';
  g.beginPath();g.moveTo(s*.7,s*.42);g.lineTo(s*.9,s*.12);g.stroke();
  g.fillStyle=rg(g,s*.9,s*.11,s*.11,'#9a6636','#4a2f18');
  g.beginPath();g.ellipse(s*.9,s*.12,s*.12,s*.095,-.7,0,7);g.fill();
  g.fillStyle='#3c2614';g.beginPath();g.arc(s*.85,s*.1,s*.02,0,7);g.arc(s*.95,s*.15,s*.016,0,7);g.fill();
  // ---- legs, planted wide ----
  g.fillStyle=skinD;
  g.beginPath();g.moveTo(s*.38,s*.6);g.quadraticCurveTo(s*.31,s*.78,s*.34,s*.92);g.lineTo(s*.47,s*.92);g.quadraticCurveTo(s*.47,s*.75,s*.47,s*.62);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.53,s*.6);g.quadraticCurveTo(s*.62,s*.77,s*.66,s*.92);g.lineTo(s*.75,s*.9);g.quadraticCurveTo(s*.66,s*.72,s*.6,s*.6);g.closePath();g.fill();
  groove(g,s,[.4,.66,.4,.86]);groove(g,s,[.58,.66,.63,.86]);
  // ---- fur loincloth ----
  g.fillStyle=lg(g,s*.5,s*.56,s*.5,s*.72,tunic,tunicD);
  g.beginPath();g.moveTo(s*.34,s*.56);g.lineTo(s*.66,s*.56);g.lineTo(s*.7,s*.7);
  g.quadraticCurveTo(s*.5,s*.66,s*.3,s*.7);g.closePath();g.fill();
  g.strokeStyle=tunicD;g.lineWidth=s*.02;
  for(let i=0;i<5;i++){g.beginPath();g.moveTo(s*(.36+i*.07),s*.68);g.lineTo(s*(.35+i*.07),s*.76);g.stroke();}
  // ---- torso: V-shape, pecs + abs ----
  g.fillStyle=skHi;
  g.beginPath();g.moveTo(s*.3,s*.4);g.quadraticCurveTo(s*.5,s*.34,s*.7,s*.4);
  g.lineTo(s*.64,s*.58);g.quadraticCurveTo(s*.5,s*.63,s*.36,s*.58);g.closePath();g.fill();
  // pec + ab grooves, navel line
  groove(g,s,[.5,.4,.5,.56]);
  groove(g,s,[.38,.46,.5,.5,.62,.46]);
  groove(g,s,[.42,.53,.58,.53]);
  // ---- arms: thick, one raised (right) one at side (left) ----
  g.fillStyle=skin;
  // right upper arm to club
  g.beginPath();g.moveTo(s*.62,s*.42);g.quadraticCurveTo(s*.74,s*.4,s*.72,s*.44);g.quadraticCurveTo(s*.68,s*.44,s*.64,s*.5);g.closePath();g.fill();
  ell(g,s*.72,s*.43,s*.06,s*.05,skin);       // right shoulder/bicep
  ell(g,s*.3,s*.48,s*.055,s*.09,skin);        // left arm hanging
  ell(g,s*.3,s*.6,s*.045,s*.05,skinD);        // left fist
  rim(g,s*.3,s*.5,s*.075,2.4,3.9);            // rim on left arm
  // ---- head, turned right, strong jaw ----
  g.fillStyle=rg(g,s*.52,s*.28,s*.16,'#f6dcb4',skinD);
  g.beginPath();g.moveTo(s*.4,s*.24);g.quadraticCurveTo(s*.42,s*.12,s*.54,s*.12);
  g.quadraticCurveTo(s*.66,s*.13,s*.66,s*.26);g.quadraticCurveTo(s*.66,s*.38,s*.54,s*.4);
  g.quadraticCurveTo(s*.44,s*.39,s*.4,s*.24);g.closePath();g.fill();
  // wild mane
  g.fillStyle=hair;
  g.beginPath();g.moveTo(s*.38,s*.28);g.quadraticCurveTo(s*.3,s*.1,s*.46,s*.06);
  g.quadraticCurveTo(s*.62,s*.02,s*.66,s*.16);g.quadraticCurveTo(s*.6,s*.1,s*.5,s*.11);
  g.quadraticCurveTo(s*.42,s*.13,s*.42,s*.24);g.closePath();g.fill();
  ell(g,s*.4,s*.28,s*.05,s*.09,hair);          // sideburn/beard edge
  // beard
  g.fillStyle=hair;
  g.beginPath();g.moveTo(s*.44,s*.34);g.quadraticCurveTo(s*.54,s*.46,s*.62,s*.34);
  g.quadraticCurveTo(s*.58,s*.4,s*.53,s*.4);g.quadraticCurveTo(s*.48,s*.4,s*.44,s*.34);g.closePath();g.fill();
  // brow ridge, eyes, scowl
  g.strokeStyle=hair;g.lineWidth=s*.03;g.lineCap='round';
  g.beginPath();g.moveTo(s*.5,s*.24);g.lineTo(s*.63,s*.23);g.stroke();
  g.fillStyle='#241a10';
  g.beginPath();g.arc(s*.54,s*.27,s*.02,0,7);g.fill();
  g.beginPath();g.arc(s*.62,s*.27,s*.02,0,7);g.fill();
  // cheek/jaw shadow
  groove(g,s,[.42,.3,.46,.36],.018,'rgba(0,0,0,.25)');
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
