"use strict";
// ---------- SPR dictionary + cel-outline pass ----------
// Load order matters: see index.html. Plain script scope, no modules.
const SPR={};
SPR.caveman=mkS((g,s)=>drawHunter(g,s,'#d9a066','#b8834e','#4a3020','#8a5a30','#6b4423'));
SPR.caveman2=mkS((g,s)=>drawHunter(g,s,'#c98f5a','#a87546','#1c1410','#5a4a7a','#443860'));
SPR.grok=mkS((g,s)=>drawHunter(g,s,'#c99055','#a87646','#7a2f1d','#5a6e46','#465738'));
SPR.bat=mkS((g,s)=>{
  // wings
  g.fillStyle='#4a3a5c';
  g.beginPath();g.moveTo(s*.5,s*.5);
  g.quadraticCurveTo(s*.18,s*.28,s*.06,s*.5);
  g.quadraticCurveTo(s*.2,s*.5,s*.24,s*.6);
  g.quadraticCurveTo(s*.36,s*.52,s*.5,s*.58);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.5,s*.5);
  g.quadraticCurveTo(s*.82,s*.28,s*.94,s*.5);
  g.quadraticCurveTo(s*.8,s*.5,s*.76,s*.6);
  g.quadraticCurveTo(s*.64,s*.52,s*.5,s*.58);g.closePath();g.fill();
  // body
  g.fillStyle=rg(g,s*.5,s*.5,s*.16,'#7a6494','#584878');
  g.beginPath();g.ellipse(s*.5,s*.52,s*.13,s*.16,0,0,7);g.fill();
  // ears
  g.fillStyle='#584878';
  g.beginPath();g.moveTo(s*.42,s*.42);g.lineTo(s*.44,s*.3);g.lineTo(s*.5,s*.4);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.58,s*.42);g.lineTo(s*.56,s*.3);g.lineTo(s*.5,s*.4);g.closePath();g.fill();
  // eyes
  g.fillStyle='#ff5a4e';
  g.beginPath();g.arc(s*.45,s*.5,s*.025,0,7);g.fill();
  g.beginPath();g.arc(s*.55,s*.5,s*.025,0,7);g.fill();
});
SPR.bear=mkS((g,s)=>{
  // body
  g.fillStyle=rg(g,s*.45,s*.55,s*.36,'#7a5636','#4e3722');
  g.beginPath();g.ellipse(s*.45,s*.58,s*.36,s*.27,0,0,7);g.fill();
  // legs
  ell(g,s*.2,s*.82,s*.07,s*.08,'#3a2a1a');
  ell(g,s*.38,s*.84,s*.07,s*.08,'#3a2a1a');
  ell(g,s*.58,s*.84,s*.07,s*.08,'#3a2a1a');
  ell(g,s*.72,s*.82,s*.07,s*.08,'#3a2a1a');
  // head
  g.fillStyle=rg(g,s*.78,s*.42,s*.18,'#7a5636','#553c26');
  g.beginPath();g.arc(s*.78,s*.44,s*.17,0,7);g.fill();
  // ears
  ell(g,s*.68,s*.3,s*.05,s*.05,'#553c26');
  ell(g,s*.88,s*.3,s*.05,s*.05,'#553c26');
  // snout
  ell(g,s*.87,s*.5,s*.09,s*.065,'#a8815a');
  ell(g,s*.93,s*.48,s*.028,s*.022,'#241a10');
  // eye
  g.fillStyle='#ffdb70';
  g.beginPath();g.arc(s*.76,s*.4,s*.024,0,7);g.fill();
  g.fillStyle='#241a10';
  g.beginPath();g.arc(s*.77,s*.4,s*.012,0,7);g.fill();
  // claws
  g.strokeStyle='#e8e0d0';g.lineWidth=s*.014;
  for(const lx of [.16,.34]){g.beginPath();g.moveTo(s*lx,s*.88);g.lineTo(s*(lx-.02),s*.92);g.stroke();}
});
SPR.dino=mkS((g,s)=>{
  // tail
  g.fillStyle='#4e7530';
  g.beginPath();g.moveTo(s*.4,s*.58);
  g.quadraticCurveTo(s*.12,s*.5,s*.04,s*.62);
  g.quadraticCurveTo(s*.18,s*.62,s*.4,s*.7);g.closePath();g.fill();
  // body
  g.fillStyle=rg(g,s*.5,s*.6,s*.24,'#6d9c45','#4e7530');
  g.beginPath();g.ellipse(s*.5,s*.62,s*.22,s*.18,0,0,7);g.fill();
  // legs
  ell(g,s*.42,s*.84,s*.05,s*.07,'#40601f');
  ell(g,s*.6,s*.84,s*.05,s*.07,'#40601f');
  // neck+head
  g.fillStyle='#6d9c45';
  g.beginPath();g.moveTo(s*.62,s*.52);
  g.quadraticCurveTo(s*.7,s*.36,s*.78,s*.32);
  g.lineTo(s*.86,s*.36);
  g.quadraticCurveTo(s*.78,s*.48,s*.66,s*.6);g.closePath();g.fill();
  g.beginPath();g.ellipse(s*.82,s*.34,s*.1,s*.075,-.2,0,7);g.fill();
  // jaw
  g.fillStyle='#4e7530';
  g.beginPath();g.ellipse(s*.88,s*.39,s*.06,s*.03,-.2,0,7);g.fill();
  // eye
  g.fillStyle='#ffd94e';g.beginPath();g.arc(s*.8,s*.31,s*.024,0,7);g.fill();
  g.fillStyle='#241a10';g.beginPath();g.arc(s*.81,s*.31,s*.012,0,7);g.fill();
  // back spikes
  g.fillStyle='#3a5a22';
  for(let i=0;i<3;i++){
    const bx=s*(.36+i*.12);
    g.beginPath();g.moveTo(bx,s*.48);g.lineTo(bx+s*.05,s*.4);g.lineTo(bx+s*.1,s*.48);g.closePath();g.fill();
  }
});
SPR.serpent=mkS((g,s)=>{
  // coils
  g.fillStyle=rg(g,s*.5,s*.62,s*.3,'#5f8a4a','#3a5a3e');
  g.beginPath();g.ellipse(s*.5,s*.72,s*.32,s*.16,0,0,7);g.fill();
  g.beginPath();g.ellipse(s*.5,s*.55,s*.26,s*.14,0,0,7);g.fill();
  g.beginPath();g.ellipse(s*.5,s*.4,s*.19,s*.12,0,0,7);g.fill();
  // head
  g.fillStyle=rg(g,s*.5,s*.22,s*.15,'#6d9c5a','#3a5a3e');
  g.beginPath();g.ellipse(s*.5,s*.22,s*.16,s*.12,0,0,7);g.fill();
  // eyes
  g.fillStyle='#ffd94e';
  g.beginPath();g.arc(s*.43,s*.2,s*.03,0,7);g.fill();
  g.beginPath();g.arc(s*.57,s*.2,s*.03,0,7);g.fill();
  g.fillStyle='#241a10';
  g.fillRect(s*.425,s*.17,s*.012,s*.055);
  g.fillRect(s*.565,s*.17,s*.012,s*.055);
  // tongue
  g.strokeStyle='#c8402e';g.lineWidth=s*.018;
  g.beginPath();g.moveTo(s*.5,s*.32);g.lineTo(s*.5,s*.4);g.stroke();
  g.beginPath();g.moveTo(s*.5,s*.4);g.lineTo(s*.46,s*.45);g.moveTo(s*.5,s*.4);g.lineTo(s*.54,s*.45);g.stroke();
  // scale sheen
  g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=s*.02;
  g.beginPath();g.arc(s*.44,s*.55,s*.16,3.6,4.6);g.stroke();
});
SPR.meat=mkS((g,s)=>{
  g.strokeStyle='#e8d9c0';g.lineWidth=s*.09;g.lineCap='round';
  g.beginPath();g.moveTo(s*.62,s*.62);g.lineTo(s*.8,s*.8);g.stroke();
  ell(g,s*.84,s*.84,s*.06,s*.06,'#e8d9c0');
  g.fillStyle=rg(g,s*.42,s*.42,s*.3,'#d9705a','#a33d2b');
  g.beginPath();g.ellipse(s*.44,s*.44,s*.3,s*.24,-.7,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.18)';
  g.beginPath();g.ellipse(s*.36,s*.36,s*.12,s*.08,-.7,0,7);g.fill();
});
SPR.heart=mkS((g,s)=>{
  heartPath(g,s);
  g.fillStyle=rg(g,s*.5,s*.4,s*.45,'#f06a55','#b02a1e');g.fill();
  g.fillStyle='rgba(255,255,255,.25)';
  g.beginPath();g.ellipse(s*.34,s*.32,s*.09,s*.06,-.5,0,7);g.fill();
});
SPR.heartHalf=mkS((g,s)=>{
  g.save();g.beginPath();g.rect(0,0,s*.5,s);g.clip();
  heartPath(g,s);
  g.fillStyle=rg(g,s*.5,s*.4,s*.45,'#f06a55','#b02a1e');g.fill();
  g.restore();
  heartPath(g,s);
  g.strokeStyle='#4a3020';g.lineWidth=s*.05;g.stroke();
});
SPR.heartEmpty=mkS((g,s)=>{
  heartPath(g,s);
  g.strokeStyle='#4a3020';g.lineWidth=s*.05;g.stroke();
});
SPR.flint=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.5,s*.5,s*.35,'#b9c6cf','#75828c');
  g.beginPath();g.moveTo(s*.24,s*.8);g.lineTo(s*.42,s*.28);g.lineTo(s*.6,s*.2);g.lineTo(s*.74,s*.44);g.lineTo(s*.56,s*.78);g.closePath();g.fill();
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=s*.02;
  g.beginPath();g.moveTo(s*.42,s*.3);g.lineTo(s*.5,s*.72);g.moveTo(s*.6,s*.24);g.lineTo(s*.52,s*.5);g.stroke();
});
SPR.stone=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.5,s*.5,s*.3,'#a39a8e','#6e675e');
  g.beginPath();g.ellipse(s*.5,s*.52,s*.28,s*.25,0,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.2)';
  g.beginPath();g.ellipse(s*.42,s*.42,s*.09,s*.06,0,0,7);g.fill();
});
SPR.rock=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.48,s*.5,s*.42,'#6b5c4d','#3f352b');
  g.beginPath();
  g.moveTo(s*.14,s*.72);g.quadraticCurveTo(s*.1,s*.42,s*.32,s*.3);
  g.quadraticCurveTo(s*.52,s*.16,s*.72,s*.3);
  g.quadraticCurveTo(s*.92,s*.44,s*.86,s*.7);
  g.quadraticCurveTo(s*.5,s*.86,s*.14,s*.72);g.closePath();g.fill();
  g.fillStyle='rgba(255,255,255,.12)';
  g.beginPath();g.ellipse(s*.36,s*.36,s*.13,s*.08,-.4,0,7);g.fill();
  g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=s*.02;
  g.beginPath();g.moveTo(s*.5,s*.4);g.lineTo(s*.6,s*.62);g.stroke();
});
SPR.obrock=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.48,s*.5,s*.42,'#3a2f52','#14101e');
  g.beginPath();
  g.moveTo(s*.14,s*.72);g.quadraticCurveTo(s*.1,s*.42,s*.32,s*.3);
  g.quadraticCurveTo(s*.52,s*.16,s*.72,s*.3);
  g.quadraticCurveTo(s*.92,s*.44,s*.86,s*.7);
  g.quadraticCurveTo(s*.5,s*.86,s*.14,s*.72);g.closePath();g.fill();
  g.strokeStyle='rgba(140,110,220,.4)';g.lineWidth=s*.025;
  g.beginPath();g.moveTo(s*.3,s*.4);g.lineTo(s*.46,s*.66);g.moveTo(s*.6,s*.3);g.lineTo(s*.7,s*.55);g.stroke();
  g.fillStyle='rgba(160,130,240,.2)';
  g.beginPath();g.ellipse(s*.38,s*.36,s*.11,s*.07,-.4,0,7);g.fill();
});
SPR.root=mkS((g,s)=>{
  g.strokeStyle='#8a8070';g.lineWidth=s*.14;g.lineCap='round';
  g.beginPath();g.moveTo(s*.5,s*.85);
  g.quadraticCurveTo(s*.42,s*.55,s*.52,s*.3);g.stroke();
  g.fillStyle=rg(g,s*.52,s*.26,s*.18,'#c2b79c','#8a8070');
  g.beginPath();g.ellipse(s*.52,s*.26,s*.19,s*.13,0,0,7);g.fill();
  g.fillStyle='rgba(255,255,255,.15)';
  g.beginPath();g.ellipse(s*.46,s*.22,s*.07,s*.04,0,0,7);g.fill();
});
SPR.torch=mkS((g,s)=>{
  g.strokeStyle='#6b4423';g.lineWidth=s*.1;g.lineCap='round';
  g.beginPath();g.moveTo(s*.5,s*.9);g.lineTo(s*.5,s*.5);g.stroke();
  const fg=g.createRadialGradient(s*.5,s*.32,s*.03,s*.5,s*.36,s*.26);
  fg.addColorStop(0,'#ffe9a8');fg.addColorStop(.45,'#ffb545');fg.addColorStop(1,'rgba(255,110,30,0)');
  g.fillStyle=fg;
  g.beginPath();g.moveTo(s*.5,s*.08);
  g.quadraticCurveTo(s*.7,s*.32,s*.5,s*.52);
  g.quadraticCurveTo(s*.3,s*.32,s*.5,s*.08);g.closePath();g.fill();
});
SPR.bone=mkS((g,s)=>{
  g.strokeStyle='#cfc2a8';g.lineWidth=s*.11;g.lineCap='round';
  g.beginPath();g.moveTo(s*.3,s*.7);g.lineTo(s*.7,s*.3);g.stroke();
  for(const [bx,by] of [[.26,.62],[.36,.76],[.64,.24],[.76,.36]]){
    ell(g,s*bx,s*by,s*.075,s*.075,'#e0d5bc');
  }
});
SPR.slab=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.5,s*.5,s*.45,'#55483c','#2e2620');
  g.beginPath();
  if(g.roundRect)g.roundRect(s*.12,s*.12,s*.76,s*.76,s*.12);
  else g.rect(s*.12,s*.12,s*.76,s*.76);
  g.fill();
  g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=s*.025;
  g.beginPath();g.moveTo(s*.3,s*.3);g.lineTo(s*.7,s*.3);g.moveTo(s*.3,s*.5);g.lineTo(s*.66,s*.5);g.moveTo(s*.34,s*.7);g.lineTo(s*.7,s*.7);g.stroke();
});
SPR.wood=mkS((g,s)=>{
  g.strokeStyle='#8a5a30';g.lineWidth=s*.16;g.lineCap='round';
  g.beginPath();g.moveTo(s*.26,s*.76);g.lineTo(s*.74,s*.26);g.stroke();
  g.strokeStyle='#6b4423';g.lineWidth=s*.03;
  g.beginPath();g.moveTo(s*.34,s*.66);g.lineTo(s*.62,s*.36);g.stroke();
});
SPR.sinew=mkS((g,s)=>{
  g.strokeStyle='#c9a06a';g.lineWidth=s*.07;
  g.beginPath();g.arc(s*.5,s*.5,s*.24,0,5.6);g.stroke();
  g.beginPath();g.arc(s*.5,s*.5,s*.13,.8,6.2);g.stroke();
});
SPR.feather=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.5,s*.45,s*.35,'#d5e2ee','#8aa2ba');
  g.beginPath();g.moveTo(s*.3,s*.82);
  g.quadraticCurveTo(s*.24,s*.4,s*.62,s*.16);
  g.quadraticCurveTo(s*.74,s*.44,s*.42,s*.76);g.closePath();g.fill();
  g.strokeStyle='#6a82a0';g.lineWidth=s*.025;
  g.beginPath();g.moveTo(s*.32,s*.8);g.quadraticCurveTo(s*.44,s*.5,s*.6,s*.2);g.stroke();
});
SPR.fang=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.5,s*.4,s*.3,'#fffaf0','#cfc2a8');
  g.beginPath();g.moveTo(s*.36,s*.22);
  g.quadraticCurveTo(s*.66,s*.26,s*.62,s*.5);
  g.quadraticCurveTo(s*.58,s*.72,s*.44,s*.82);
  g.quadraticCurveTo(s*.4,s*.55,s*.36,s*.22);g.closePath();g.fill();
});
SPR.obsidian=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.5,s*.5,s*.32,'#4a3d6e','#120e1c');
  g.beginPath();g.moveTo(s*.3,s*.74);g.lineTo(s*.44,s*.26);g.lineTo(s*.64,s*.2);g.lineTo(s*.7,s*.5);g.lineTo(s*.52,s*.8);g.closePath();g.fill();
  g.strokeStyle='rgba(150,120,230,.55)';g.lineWidth=s*.022;
  g.beginPath();g.moveTo(s*.44,s*.28);g.lineTo(s*.54,s*.7);g.stroke();
});
SPR.shrine=mkS((g,s)=>{
  g.fillStyle=rg(g,s*.5,s*.5,s*.4,'#5c5044','#332b23');
  g.beginPath();
  g.moveTo(s*.32,s*.9);g.lineTo(s*.34,s*.24);
  g.quadraticCurveTo(s*.5,s*.08,s*.66,s*.24);
  g.lineTo(s*.68,s*.9);g.closePath();g.fill();
  // ochre spiral
  g.strokeStyle='#c1642a';g.lineWidth=s*.035;
  g.beginPath();
  for(let a=0;a<14;a++){
    const r=s*.02+a*s*.012,ang=a*.65;
    const px=s*.5+Math.cos(ang)*r,py=s*.5+Math.sin(ang)*r;
    if(a===0)g.moveTo(px,py);else g.lineTo(px,py);
  }
  g.stroke();
});
SPR.bola=mkS((g,s)=>{
  g.strokeStyle='#c9a06a';g.lineWidth=s*.05;
  g.beginPath();g.moveTo(s*.3,s*.32);g.quadraticCurveTo(s*.5,s*.5,s*.7,s*.32);g.stroke();
  ell(g,s*.28,s*.3,s*.11,s*.11,'#8a8176');
  ell(g,s*.72,s*.3,s*.11,s*.11,'#8a8176');
  g.fillStyle='rgba(255,255,255,.2)';
  ell(g,s*.25,s*.26,s*.035,s*.025,'rgba(255,255,255,.25)');
});
// cel-style dark outlines: characters pop against every background,
// pickups get a warm outline so saturation stays reserved for loot
for(const k of ['caveman','caveman2','grok','bat','bear','dino','serpent'])SPR[k]=outlined(SPR[k],'#17100a',5);
for(const k of ['meat','heart','flint','stone','rock','obrock','root','bone','slab','wood','sinew','feather','fang','obsidian','shrine','bola'])SPR[k]=outlined(SPR[k],'#1c130c',3);
