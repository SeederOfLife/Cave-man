"use strict";
// ---------- boss & npc sprites: ghur · priest · grok · trader ----------
// Dedicated art for the two Tower guardians (no longer scaled-up beasts),
// a friendly Grok distinct from the heroes, and the shop's Silent Trader.
SPR.ghur=mkS((g,s)=>{
  // GHUR, FIRST OF BEARS — massive, reared, roaring, scarred
  // hind legs planted
  g.fillStyle='#2e2012';
  ell(g,s*.34,s*.86,s*.09,s*.1,'#2e2012');ell(g,s*.62,s*.86,s*.09,s*.1,'#2e2012');
  // towering shaggy body
  g.fillStyle=lg(g,s*.32,s*.24,s*.5,s*.82,'#9a704a','#3f2c1a');
  g.beginPath();g.moveTo(s*.28,s*.82);
  g.quadraticCurveTo(s*.2,s*.5,s*.34,s*.28);
  g.quadraticCurveTo(s*.5,s*.14,s*.66,s*.28);
  g.quadraticCurveTo(s*.8,s*.5,s*.72,s*.82);
  g.quadraticCurveTo(s*.5,s*.9,s*.28,s*.82);g.closePath();g.fill();
  // battle scars
  g.strokeStyle='rgba(240,220,190,.5)';g.lineWidth=s*.014;
  g.beginPath();g.moveTo(s*.4,s*.42);g.lineTo(s*.5,s*.56);g.moveTo(s*.46,s*.4);g.lineTo(s*.56,s*.54);g.stroke();
  // fur clumps
  g.strokeStyle='rgba(0,0,0,.32)';g.lineWidth=s*.022;g.lineCap='round';
  for(const [fx,fy] of [[.34,.5],[.5,.44],[.62,.5],[.44,.66],[.58,.66]]){g.beginPath();g.moveTo(s*fx,s*fy);g.lineTo(s*(fx+.05),s*(fy+.1));g.stroke();}
  // raised clawed arms
  g.fillStyle='#7a5636';
  ell(g,s*.24,s*.44,s*.07,s*.13,'#7a5636');ell(g,s*.76,s*.44,s*.07,s*.13,'#7a5636');
  g.strokeStyle='#e8e0d0';g.lineWidth=s*.02;
  for(const sd of [-1,1]){const bx=s*.5+sd*s*.28;for(let i=-1;i<2;i++){g.beginPath();g.moveTo(bx+i*s*.03,s*.34);g.lineTo(bx+i*s*.03-sd*s*.02,s*.28);g.stroke();}}
  // roaring head
  g.fillStyle=rg(g,s*.5,s*.24,s*.19,'#9a704a','#4e3722');
  g.beginPath();g.arc(s*.5,s*.26,s*.18,0,7);g.fill();
  ell(g,s*.38,s*.12,s*.06,s*.06,'#4e3722');ell(g,s*.62,s*.12,s*.06,s*.06,'#4e3722');
  // gaping maw
  g.fillStyle='#3a0f0a';g.beginPath();g.ellipse(s*.5,s*.34,s*.09,s*.07,0,0,7);g.fill();
  g.fillStyle='#fffaf0';
  for(let i=0;i<4;i++){const tx=s*(.43+i*.05);g.beginPath();g.moveTo(tx,s*.28);g.lineTo(tx+s*.015,s*.34);g.lineTo(tx+s*.03,s*.28);g.closePath();g.fill();
    g.beginPath();g.moveTo(tx,s*.4);g.lineTo(tx+s*.015,s*.34);g.lineTo(tx+s*.03,s*.4);g.closePath();g.fill();}
  // burning eyes
  for(const ex of [.43,.57]){g.fillStyle=rg(g,s*ex,s*.22,s*.04,'#ffe9a8','#ff8c2e');g.beginPath();g.arc(s*ex,s*.22,s*.03,0,7);g.fill();
    g.fillStyle='#3a1a06';g.beginPath();g.arc(s*ex,s*.22,s*.012,0,7);g.fill();}
});
SPR.priest=mkS((g,s)=>{
  // SLITHER-PRIEST OF THE TOWER — coiled serpent sorcerer, hooded, idol raised
  // coils
  g.fillStyle=lg(g,s*.5,s*.6,s*.5,s*.9,'#5f8a4a','#2c4a1c');
  g.beginPath();g.ellipse(s*.5,s*.82,s*.34,s*.14,0,0,7);g.fill();
  g.beginPath();g.ellipse(s*.5,s*.68,s*.28,s*.13,0,0,7);g.fill();
  g.strokeStyle='#2c4a1c';g.lineWidth=s*.016;
  for(let i=0;i<4;i++){g.beginPath();g.arc(s*.5,s*.8,s*(.1+i*.06),3.5,6);g.stroke();}
  // robed torso
  g.fillStyle=lg(g,s*.4,s*.4,s*.6,s*.66,'#6d9c5a','#3a5a3e');
  g.beginPath();g.moveTo(s*.34,s*.42);g.quadraticCurveTo(s*.5,s*.36,s*.66,s*.42);
  g.lineTo(s*.72,s*.66);g.quadraticCurveTo(s*.5,s*.72,s*.28,s*.66);g.closePath();g.fill();
  // ceremonial bone necklace
  g.fillStyle='#e0d5bc';
  for(let i=0;i<5;i++){const a=-.9+i*.45;g.beginPath();g.arc(s*.5+Math.cos(a)*s*.16,s*.5+Math.sin(a)*s*.1+s*.04,s*.02,0,7);g.fill();}
  // arm raising a black-glass idol
  ell(g,s*.72,s*.42,s*.05,s*.09,'#6d9c5a');
  g.fillStyle=rg(g,s*.8,s*.2,s*.09,'#7a5aa8','#14101e');
  g.beginPath();g.moveTo(s*.72,s*.28);g.lineTo(s*.8,s*.1);g.lineTo(s*.88,s*.24);g.lineTo(s*.8,s*.32);g.closePath();g.fill();
  g.strokeStyle='rgba(160,130,240,.6)';g.lineWidth=s*.016;
  g.beginPath();g.moveTo(s*.78,s*.14);g.lineTo(s*.82,s*.28);g.stroke();
  // left arm
  ell(g,s*.28,s*.5,s*.05,s*.09,'#6d9c5a');
  // flared cobra hood
  g.fillStyle=lg(g,s*.5,s*.14,s*.5,s*.34,'#7fae62','#3a5a3e');
  g.beginPath();g.moveTo(s*.3,s*.34);g.quadraticCurveTo(s*.22,s*.16,s*.5,s*.1);
  g.quadraticCurveTo(s*.78,s*.16,s*.7,s*.34);g.quadraticCurveTo(s*.5,s*.4,s*.3,s*.34);g.closePath();g.fill();
  // hood glyph
  g.strokeStyle='#ffd94e';g.lineWidth=s*.014;
  g.beginPath();g.arc(s*.5,s*.22,s*.05,0,7);g.moveTo(s*.5,s*.16);g.lineTo(s*.5,s*.28);g.stroke();
  // serpent face
  g.fillStyle=rg(g,s*.5,s*.28,s*.1,'#8ac06a','#4e7530');
  g.beginPath();g.ellipse(s*.5,s*.28,s*.1,s*.08,0,0,7);g.fill();
  g.fillStyle='#ffd94e';g.beginPath();g.arc(s*.45,s*.27,s*.03,0,7);g.fill();g.beginPath();g.arc(s*.55,s*.27,s*.03,0,7);g.fill();
  g.fillStyle='#241a10';g.fillRect(s*.445,s*.24,s*.012,s*.055);g.fillRect(s*.545,s*.24,s*.012,s*.055);
  g.strokeStyle='#c8402e';g.lineWidth=s*.014;g.lineCap='round';
  g.beginPath();g.moveTo(s*.5,s*.36);g.lineTo(s*.5,s*.42);g.moveTo(s*.5,s*.42);g.lineTo(s*.47,s*.45);g.moveTo(s*.5,s*.42);g.lineTo(s*.53,s*.45);g.stroke();
});
SPR.grok=mkS((g,s)=>{
  // GROK — friendly, rounder and older than the heroes; offers a haunch of meat
  ell(g,s*.4,s*.88,s*.06,s*.07,'#7a5030');ell(g,s*.6,s*.88,s*.06,s*.07,'#7a5030');
  // stout fur-wrapped body
  g.fillStyle=lg(g,s*.5,s*.5,s*.5,s*.8,'#6e7a4a','#3e4828');
  g.beginPath();g.ellipse(s*.5,s*.64,s*.24,s*.22,0,0,7);g.fill();
  g.strokeStyle='#3e4828';g.lineWidth=s*.018;
  for(let i=0;i<4;i++){g.beginPath();g.moveTo(s*(.38+i*.08),s*.76);g.lineTo(s*(.37+i*.08),s*.82);g.stroke();}
  // arms; left holds meat out in welcome
  g.fillStyle='#c99055';
  ell(g,s*.3,s*.56,s*.05,s*.09,'#c99055');ell(g,s*.72,s*.58,s*.05,s*.08,'#c99055');
  // offered haunch
  g.strokeStyle='#e8d9c0';g.lineWidth=s*.05;g.lineCap='round';
  g.beginPath();g.moveTo(s*.24,s*.6);g.lineTo(s*.16,s*.66);g.stroke();
  g.fillStyle=rg(g,s*.2,s*.56,s*.09,'#d9705a','#a33d2b');
  g.beginPath();g.ellipse(s*.2,s*.55,s*.09,s*.07,-.5,0,7);g.fill();
  // kindly head, big beard
  g.fillStyle=rg(g,s*.5,s*.32,s*.17,'#d9a066','#9a6a3e');
  g.beginPath();g.arc(s*.5,s*.34,s*.16,0,7);g.fill();
  g.fillStyle='#8a7a5a';
  g.beginPath();g.moveTo(s*.36,s*.36);g.quadraticCurveTo(s*.5,s*.56,s*.64,s*.36);
  g.quadraticCurveTo(s*.58,s*.5,s*.5,s*.5);g.quadraticCurveTo(s*.42,s*.5,s*.36,s*.36);g.closePath();g.fill();
  ell(g,s*.5,s*.2,s*.16,s*.08,'#8a7a5a'); // grey hair
  // gentle eyes + smile
  g.fillStyle='#241a10';
  g.beginPath();g.arc(s*.44,s*.32,s*.02,0,7);g.fill();g.beginPath();g.arc(s*.56,s*.32,s*.02,0,7);g.fill();
  g.strokeStyle='#5a3a1e';g.lineWidth=s*.016;
  g.beginPath();g.arc(s*.5,s*.36,s*.04,.3,2.8);g.stroke();
});
SPR.trader=mkS((g,s)=>{
  // THE SILENT TRADER — a hooded shadow with only cold eyes
  // cloak
  g.fillStyle=lg(g,s*.5,s*.24,s*.5,s*.9,'#2a2436','#0e0b16');
  g.beginPath();g.moveTo(s*.5,s*.16);
  g.quadraticCurveTo(s*.22,s*.28,s*.2,s*.9);
  g.lineTo(s*.8,s*.9);
  g.quadraticCurveTo(s*.78,s*.28,s*.5,s*.16);g.closePath();g.fill();
  // cloak folds
  g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=s*.02;g.lineCap='round';
  g.beginPath();g.moveTo(s*.4,s*.4);g.lineTo(s*.36,s*.86);g.moveTo(s*.5,s*.38);g.lineTo(s*.5,s*.88);g.moveTo(s*.6,s*.4);g.lineTo(s*.64,s*.86);g.stroke();
  // deep hood
  g.fillStyle='#1a1626';
  g.beginPath();g.moveTo(s*.34,s*.34);g.quadraticCurveTo(s*.5,s*.1,s*.66,s*.34);
  g.quadraticCurveTo(s*.5,s*.44,s*.34,s*.34);g.closePath();g.fill();
  g.fillStyle='#000';
  g.beginPath();g.ellipse(s*.5,s*.32,s*.11,s*.1,0,0,7);g.fill();
  // cold eyes in the dark
  for(const ex of [.45,.55]){g.fillStyle=rg(g,s*ex,s*.32,s*.03,'#dff2ff','#4a9ad0');g.beginPath();g.arc(s*ex,s*.32,s*.022,0,7);g.fill();}
  // faint offered hand
  ell(g,s*.3,s*.6,s*.04,s*.05,'#3a3450');
});
for(const k of ['ghur','priest'])SPR[k]=outlined(SPR[k],'#140d07',5);
for(const k of ['grok','trader'])SPR[k]=outlined(SPR[k],'#17100a',4);
