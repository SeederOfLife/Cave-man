"use strict";
// ---------- beast sprites: spider, boar, slither-man ----------
// Same procedural vector style as sprites-defs.js; all pass through outlined().
SPR.spider=mkS((g,s)=>{
  // legs (4 pairs, arched)
  g.strokeStyle='#241a2e';g.lineWidth=s*.035;g.lineCap='round';
  for(let i=0;i<4;i++){
    const a=-.9+i*.6;
    g.beginPath();g.moveTo(s*.5,s*.52);
    g.quadraticCurveTo(s*(.5-Math.cos(a)*.3),s*(.5+Math.sin(a)*.12),s*(.5-Math.cos(a)*.42),s*(.62+Math.sin(a)*.18));g.stroke();
    g.beginPath();g.moveTo(s*.5,s*.52);
    g.quadraticCurveTo(s*(.5+Math.cos(a)*.3),s*(.5+Math.sin(a)*.12),s*(.5+Math.cos(a)*.42),s*(.62+Math.sin(a)*.18));g.stroke();
  }
  // abdomen + head
  g.fillStyle=rg(g,s*.5,s*.56,s*.2,'#4a3a5c','#241a2e');
  g.beginPath();g.ellipse(s*.5,s*.58,s*.19,s*.16,0,0,7);g.fill();
  ell(g,s*.5,s*.4,s*.11,s*.09,'#38284a');
  // eyes (three, red)
  g.fillStyle='#ff5a4e';
  g.beginPath();g.arc(s*.46,s*.38,s*.02,0,7);g.fill();
  g.beginPath();g.arc(s*.54,s*.38,s*.02,0,7);g.fill();
  g.beginPath();g.arc(s*.5,s*.34,s*.016,0,7);g.fill();
  // ochre back mark
  g.strokeStyle='#c1642a';g.lineWidth=s*.02;
  g.beginPath();g.moveTo(s*.5,s*.48);g.lineTo(s*.5,s*.66);g.moveTo(s*.42,s*.56);g.lineTo(s*.58,s*.56);g.stroke();
});
SPR.boar=mkS((g,s)=>{
  // body
  g.fillStyle=rg(g,s*.45,s*.55,s*.34,'#5c4630','#38281a');
  g.beginPath();g.ellipse(s*.46,s*.58,s*.33,s*.24,0,0,7);g.fill();
  // bristle ridge
  g.fillStyle='#2c1f12';
  for(let i=0;i<4;i++){
    const bx=s*(.2+i*.13);
    g.beginPath();g.moveTo(bx,s*.4);g.lineTo(bx+s*.05,s*.3);g.lineTo(bx+s*.1,s*.4);g.closePath();g.fill();
  }
  // legs
  ell(g,s*.26,s*.8,s*.05,s*.07,'#2c1f12');
  ell(g,s*.4,s*.82,s*.05,s*.07,'#2c1f12');
  ell(g,s*.56,s*.82,s*.05,s*.07,'#2c1f12');
  ell(g,s*.68,s*.8,s*.05,s*.07,'#2c1f12');
  // head + snout
  g.fillStyle=rg(g,s*.76,s*.5,s*.16,'#5c4630','#402d1c');
  g.beginPath();g.arc(s*.76,s*.52,s*.16,0,7);g.fill();
  ell(g,s*.88,s*.58,s*.07,s*.055,'#8a6a48');
  ell(g,s*.9,s*.57,s*.018,s*.022,'#241a10');
  // tusk
  g.strokeStyle='#fffaf0';g.lineWidth=s*.03;g.lineCap='round';
  g.beginPath();g.moveTo(s*.84,s*.62);g.quadraticCurveTo(s*.9,s*.66,s*.93,s*.6);g.stroke();
  // eye
  g.fillStyle='#ffd94e';g.beginPath();g.arc(s*.73,s*.46,s*.022,0,7);g.fill();
  g.fillStyle='#241a10';g.beginPath();g.arc(s*.74,s*.46,s*.011,0,7);g.fill();
});
SPR.slither=mkS((g,s)=>{
  // serpent tail instead of legs
  g.fillStyle=rg(g,s*.5,s*.75,s*.2,'#5f8a4a','#3a5a3e');
  g.beginPath();g.moveTo(s*.34,s*.62);
  g.quadraticCurveTo(s*.3,s*.9,s*.5,s*.9);
  g.quadraticCurveTo(s*.7,s*.9,s*.66,s*.62);g.closePath();g.fill();
  // scaled torso
  g.fillStyle=rg(g,s*.5,s*.55,s*.2,'#4e7530','#3a5a22');
  g.beginPath();g.moveTo(s*.34,s*.46);
  g.quadraticCurveTo(s*.5,s*.4,s*.66,s*.46);
  g.lineTo(s*.68,s*.68);g.quadraticCurveTo(s*.5,s*.74,s*.32,s*.68);g.closePath();g.fill();
  // scale ticks
  g.strokeStyle='#2c4a1c';g.lineWidth=s*.014;
  for(let i=0;i<3;i++){g.beginPath();g.arc(s*(.42+i*.09),s*.58,s*.03,3.5,6);g.stroke();}
  // arms + stone knife
  ell(g,s*.3,s*.56,s*.045,s*.08,'#5f8a4a');
  ell(g,s*.7,s*.56,s*.045,s*.08,'#5f8a4a');
  g.fillStyle='#b9c6cf';
  g.beginPath();g.moveTo(s*.72,s*.5);g.lineTo(s*.8,s*.36);g.lineTo(s*.76,s*.52);g.closePath();g.fill();
  // serpent head, snout right
  g.fillStyle=rg(g,s*.5,s*.28,s*.15,'#6d9c5a','#3a5a3e');
  g.beginPath();g.ellipse(s*.5,s*.28,s*.16,s*.12,0,0,7);g.fill();
  g.beginPath();g.ellipse(s*.62,s*.32,s*.08,s*.05,.2,0,7);g.fill();
  // slit eyes
  g.fillStyle='#ffd94e';
  g.beginPath();g.arc(s*.45,s*.25,s*.028,0,7);g.fill();
  g.beginPath();g.arc(s*.57,s*.25,s*.028,0,7);g.fill();
  g.fillStyle='#241a10';
  g.fillRect(s*.445,s*.22,s*.011,s*.05);g.fillRect(s*.565,s*.22,s*.011,s*.05);
  // forked tongue
  g.strokeStyle='#c8402e';g.lineWidth=s*.014;
  g.beginPath();g.moveTo(s*.68,s*.34);g.lineTo(s*.76,s*.36);g.moveTo(s*.76,s*.36);g.lineTo(s*.8,s*.33);g.moveTo(s*.76,s*.36);g.lineTo(s*.79,s*.4);g.stroke();
});
for(const k of ['spider','boar','slither'])SPR[k]=outlined(SPR[k],'#17100a',5);
