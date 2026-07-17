"use strict";
// ---------- SPR dictionary + cel-outline pass ----------
// Load order matters: see index.html. Plain script scope, no modules.
const SPR={};
// heroes: long-haired barbarians (Jondalar-blond P1, Conan-dark P2). Palettes are
// shared so the procedural animated legs (render-fx.js) match the sprite skin.
// [skin, skinD, hair, tunic, tunicD]
const HERO_PAL=[
  {skin:'#e0ad72',skinD:'#a9793f',hair:'#c9a24a',tunic:'#8a5a30',tunicD:'#5a3a1e'},
  {skin:'#cf9a63',skinD:'#8f6238',hair:'#241a12',tunic:'#4a4478',tunicD:'#332a52'},
];
SPR.caveman=mkS((g,s)=>{const p=HERO_PAL[0];drawHunter(g,s,p.skin,p.skinD,p.hair,p.tunic,p.tunicD);});
SPR.caveman2=mkS((g,s)=>{const p=HERO_PAL[1];drawHunter(g,s,p.skin,p.skinD,p.hair,p.tunic,p.tunicD);});
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
  // menhir carved with the blank face of URM
  g.fillStyle=lg(g,s*.3,s*.2,s*.7,s*.9,'#6a5c4c','#2c241c');
  g.beginPath();
  g.moveTo(s*.3,s*.92);g.lineTo(s*.32,s*.22);
  g.quadraticCurveTo(s*.5,s*.06,s*.68,s*.22);
  g.lineTo(s*.7,s*.92);g.closePath();g.fill();
  // chisel edge highlight
  g.strokeStyle='rgba(255,240,210,.25)';g.lineWidth=s*.014;
  g.beginPath();g.moveTo(s*.34,s*.3);g.lineTo(s*.34,s*.88);g.stroke();
  // sunken face: heavy brow, hollow eyes, grim mouth in ochre
  g.strokeStyle='#241a12';g.lineWidth=s*.03;g.lineCap='round';
  g.beginPath();g.moveTo(s*.4,s*.4);g.lineTo(s*.6,s*.4);g.stroke();
  g.fillStyle='#14100a';
  g.beginPath();g.ellipse(s*.44,s*.46,s*.035,s*.05,0,0,7);g.fill();
  g.beginPath();g.ellipse(s*.56,s*.46,s*.035,s*.05,0,0,7);g.fill();
  g.strokeStyle='#c1642a';g.lineWidth=s*.025;
  g.beginPath();g.moveTo(s*.42,s*.62);g.lineTo(s*.58,s*.62);g.stroke();
  // ochre offering handprints
  g.fillStyle='rgba(193,100,42,.6)';
  g.beginPath();g.arc(s*.4,s*.76,s*.03,0,7);g.arc(s*.6,s*.76,s*.03,0,7);g.fill();
});
SPR.bola=mkS((g,s)=>{
  g.strokeStyle='#c9a06a';g.lineWidth=s*.05;
  g.beginPath();g.moveTo(s*.3,s*.32);g.quadraticCurveTo(s*.5,s*.5,s*.7,s*.32);g.stroke();
  ell(g,s*.28,s*.3,s*.11,s*.11,'#8a8176');
  ell(g,s*.72,s*.3,s*.11,s*.11,'#8a8176');
  g.fillStyle='rgba(255,255,255,.2)';
  ell(g,s*.25,s*.26,s*.035,s*.025,'rgba(255,255,255,.25)');
});
// cel-style dark outlines: heroes pop against every background,
// pickups get a warm outline so saturation stays reserved for loot
for(const k of ['caveman','caveman2'])SPR[k]=outlined(SPR[k],'#17100a',5);
for(const k of ['meat','heart','flint','stone','rock','obrock','root','bone','slab','wood','sinew','feather','fang','obsidian','shrine','bola'])SPR[k]=outlined(SPR[k],'#1c130c',3);
