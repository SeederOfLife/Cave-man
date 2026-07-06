"use strict";
// ---------- beast sprites: bat · bear · dino · spider · boar · slither-man ----------
// Pulp-menacing register: heavy silhouettes, fanged maws, glowing eyes, hard
// shading. All pass through outlined() at the end for the cel look.
SPR.bat=mkS((g,s)=>{
  // leathery wings (both sides via mirror)
  for(const sd of [-1,1]){
    const cx=s*.5;
    g.fillStyle=lg(g,cx,s*.3,cx,s*.6,'#5a4870','#2e2242');
    g.beginPath();g.moveTo(cx,s*.46);
    g.lineTo(cx+sd*s*.44,s*.28);g.lineTo(cx+sd*s*.34,s*.44);
    g.lineTo(cx+sd*s*.46,s*.5);g.lineTo(cx+sd*s*.32,s*.56);
    g.lineTo(cx+sd*s*.4,s*.64);g.lineTo(cx+sd*s*.22,s*.6);
    g.quadraticCurveTo(cx+sd*s*.1,s*.54,cx,s*.54);g.closePath();g.fill();
    // finger struts
    g.strokeStyle='rgba(20,12,28,.6)';g.lineWidth=s*.014;
    g.beginPath();g.moveTo(cx,s*.47);g.lineTo(cx+sd*s*.36,s*.44);
    g.moveTo(cx,s*.49);g.lineTo(cx+sd*s*.36,s*.52);g.stroke();
  }
  // furred body
  g.fillStyle=rg(g,s*.5,s*.48,s*.16,'#9a82b8','#4a3a5c');
  g.beginPath();g.ellipse(s*.5,s*.5,s*.13,s*.17,0,0,7);g.fill();
  groove(g,s,[.5,.4,.5,.6],.02,'rgba(0,0,0,.3)');
  // tall pointed ears
  g.fillStyle='#4a3a5c';
  g.beginPath();g.moveTo(s*.42,s*.4);g.lineTo(s*.4,s*.24);g.lineTo(s*.5,s*.36);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.58,s*.4);g.lineTo(s*.6,s*.24);g.lineTo(s*.5,s*.36);g.closePath();g.fill();
  // snarl + fangs
  g.strokeStyle='#241a10';g.lineWidth=s*.02;
  g.beginPath();g.arc(s*.5,s*.5,s*.06,.2,2.9);g.stroke();
  g.fillStyle='#fffaf0';
  g.beginPath();g.moveTo(s*.46,s*.55);g.lineTo(s*.48,s*.6);g.lineTo(s*.5,s*.55);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.5,s*.55);g.lineTo(s*.52,s*.6);g.lineTo(s*.54,s*.55);g.closePath();g.fill();
  // glowing eyes
  for(const ex of [.45,.55]){
    g.fillStyle=rg(g,s*ex,s*.46,s*.04,'#ffd0c0','#ff3a2e');
    g.beginPath();g.arc(s*ex,s*.46,s*.032,0,7);g.fill();
    g.fillStyle='#5a0a06';g.beginPath();g.arc(s*ex,s*.46,s*.012,0,7);g.fill();
  }
});
SPR.bear=mkS((g,s)=>{
  // shaggy body with shoulder hump
  g.fillStyle=lg(g,s*.4,s*.35,s*.5,s*.8,'#8a6440','#3f2c1a');
  g.beginPath();g.moveTo(s*.14,s*.7);
  g.quadraticCurveTo(s*.16,s*.4,s*.4,s*.36);   // hump
  g.quadraticCurveTo(s*.66,s*.34,s*.78,s*.5);
  g.quadraticCurveTo(s*.82,s*.74,s*.6,s*.82);
  g.quadraticCurveTo(s*.32,s*.86,s*.14,s*.7);g.closePath();g.fill();
  // fur clumps
  g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=s*.02;g.lineCap='round';
  for(const [fx,fy] of [[.3,.5],[.44,.46],[.4,.64],[.56,.6]]){g.beginPath();g.moveTo(s*fx,s*fy);g.lineTo(s*(fx+.05),s*(fy+.08));g.stroke();}
  // legs + claws
  g.fillStyle='#2e2012';
  ell(g,s*.26,s*.82,s*.08,s*.09,'#2e2012');ell(g,s*.6,s*.82,s*.08,s*.09,'#2e2012');
  g.strokeStyle='#e8e0d0';g.lineWidth=s*.016;
  for(const lx of [.2,.28,.54,.62]){g.beginPath();g.moveTo(s*lx,s*.88);g.lineTo(s*(lx-.015),s*.93);g.stroke();}
  // head, jaws open
  g.fillStyle=rg(g,s*.8,s*.4,s*.2,'#8a6440','#4e3722');
  g.beginPath();g.arc(s*.8,s*.44,s*.18,0,7);g.fill();
  ell(g,s*.7,s*.28,s*.055,s*.06,'#4e3722');ell(g,s*.9,s*.28,s*.055,s*.06,'#4e3722');
  // snout + open maw
  ell(g,s*.92,s*.5,s*.1,s*.07,'#a8815a');
  g.fillStyle='#3a0f0a';g.beginPath();g.ellipse(s*.86,s*.56,s*.07,s*.045,-.2,0,7);g.fill();
  g.fillStyle='#fffaf0';
  g.beginPath();g.moveTo(s*.82,s*.53);g.lineTo(s*.84,s*.59);g.lineTo(s*.86,s*.53);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.9,s*.53);g.lineTo(s*.92,s*.58);g.lineTo(s*.94,s*.53);g.closePath();g.fill();
  // furious eye + snout ridge
  g.fillStyle='#ffdb70';g.beginPath();g.arc(s*.76,s*.4,s*.026,0,7);g.fill();
  g.fillStyle='#241a10';g.beginPath();g.arc(s*.77,s*.4,s*.013,0,7);g.fill();
  groove(g,s,[.82,.42,.96,.46],.02,'rgba(0,0,0,.3)');
});
SPR.dino=mkS((g,s)=>{
  // whipping tail
  g.fillStyle=lg(g,s*.2,s*.5,s*.5,s*.7,'#7fae52','#3a5a22');
  g.beginPath();g.moveTo(s*.42,s*.56);
  g.quadraticCurveTo(s*.1,s*.44,s*.02,s*.58);
  g.quadraticCurveTo(s*.16,s*.62,s*.42,s*.7);g.closePath();g.fill();
  // sinewy body, crouched
  g.fillStyle=rg(g,s*.5,s*.6,s*.24,'#7fae52','#4e7530');
  g.beginPath();g.ellipse(s*.5,s*.62,s*.22,s*.17,0,0,7);g.fill();
  groove(g,s,[.4,.56,.6,.6],.02,'rgba(0,0,0,.25)');
  // raptor legs
  g.fillStyle='#3a5a22';
  g.beginPath();g.moveTo(s*.44,s*.66);g.lineTo(s*.38,s*.86);g.lineTo(s*.46,s*.86);g.lineTo(s*.5,s*.68);g.closePath();g.fill();
  g.beginPath();g.moveTo(s*.58,s*.66);g.lineTo(s*.6,s*.86);g.lineTo(s*.68,s*.86);g.lineTo(s*.62,s*.66);g.closePath();g.fill();
  g.strokeStyle='#e8e0d0';g.lineWidth=s*.014;
  g.beginPath();g.moveTo(s*.38,s*.86);g.lineTo(s*.34,s*.9);g.moveTo(s*.62,s*.86);g.lineTo(s*.7,s*.9);g.stroke();
  // neck + drooling head
  g.fillStyle='#7fae52';
  g.beginPath();g.moveTo(s*.6,s*.52);g.quadraticCurveTo(s*.72,s*.34,s*.8,s*.3);
  g.lineTo(s*.9,s*.34);g.quadraticCurveTo(s*.8,s*.5,s*.66,s*.6);g.closePath();g.fill();
  g.beginPath();g.ellipse(s*.84,s*.32,s*.11,s*.08,-.2,0,7);g.fill();
  g.fillStyle='#3a5a22';g.beginPath();g.ellipse(s*.9,s*.38,s*.07,s*.032,-.2,0,7);g.fill();
  // teeth + drool
  g.fillStyle='#fffaf0';
  for(let i=0;i<3;i++){g.beginPath();g.moveTo(s*(.8+i*.05),s*.4);g.lineTo(s*(.81+i*.05),s*.44);g.lineTo(s*(.82+i*.05),s*.4);g.closePath();g.fill();}
  g.strokeStyle='rgba(140,200,90,.6)';g.lineWidth=s*.012;
  g.beginPath();g.moveTo(s*.86,s*.44);g.lineTo(s*.86,s*.5);g.stroke();
  // slit eye
  g.fillStyle='#ffd94e';g.beginPath();g.arc(s*.82,s*.3,s*.028,0,7);g.fill();
  g.fillStyle='#241a10';g.fillRect(s*.815,s*.275,s*.01,s*.05);
  // back spikes
  g.fillStyle='#2c4418';
  for(let i=0;i<4;i++){const bx=s*(.36+i*.1);g.beginPath();g.moveTo(bx,s*.48);g.lineTo(bx+s*.04,s*.38);g.lineTo(bx+s*.08,s*.48);g.closePath();g.fill();}
});
SPR.spider=mkS((g,s)=>{
  // jointed legs
  g.strokeStyle='#241a2e';g.lineWidth=s*.03;g.lineCap='round';
  for(let i=0;i<4;i++){const a=-.95+i*.62;
    for(const sd of [-1,1]){
      const kx=s*.5+sd*Math.cos(a)*s*.24,ky=s*.5+Math.sin(a)*s*.1;
      g.beginPath();g.moveTo(s*.5,s*.52);g.lineTo(kx,ky);
      g.lineTo(s*.5+sd*Math.cos(a)*s*.44,s*.66+Math.sin(a)*s*.16);g.stroke();
    }
  }
  // abdomen + cephalothorax
  g.fillStyle=rg(g,s*.5,s*.58,s*.22,'#4a3a5c','#1e1428');
  g.beginPath();g.ellipse(s*.5,s*.6,s*.2,s*.17,0,0,7);g.fill();
  g.fillStyle=rg(g,s*.5,s*.4,s*.12,'#5a4a6e','#2c2038');
  g.beginPath();g.ellipse(s*.5,s*.42,s*.13,s*.11,0,0,7);g.fill();
  // ochre hourglass mark
  g.fillStyle='#d67f2e';
  g.beginPath();g.moveTo(s*.5,s*.5);g.lineTo(s*.45,s*.58);g.lineTo(s*.5,s*.62);g.lineTo(s*.55,s*.58);g.closePath();
  g.moveTo(s*.5,s*.72);g.lineTo(s*.46,s*.66);g.lineTo(s*.54,s*.66);g.closePath();g.fill();
  // fangs
  g.fillStyle='#fffaf0';
  g.beginPath();g.moveTo(s*.46,s*.5);g.lineTo(s*.47,s*.55);g.lineTo(s*.48,s*.5);g.closePath();
  g.moveTo(s*.52,s*.5);g.lineTo(s*.53,s*.55);g.lineTo(s*.54,s*.5);g.closePath();g.fill();
  // eye cluster
  g.fillStyle='#ff4a3e';
  for(const [ex,ey] of [[.45,.38],[.55,.38],[.48,.34],[.52,.34],[.5,.31]]){g.beginPath();g.arc(s*ex,s*ey,s*.017,0,7);g.fill();}
});
SPR.boar=mkS((g,s)=>{
  // muscular body
  g.fillStyle=lg(g,s*.4,s*.4,s*.5,s*.8,'#6e5236','#38281a');
  g.beginPath();g.moveTo(s*.16,s*.66);
  g.quadraticCurveTo(s*.22,s*.42,s*.46,s*.42);
  g.quadraticCurveTo(s*.66,s*.44,s*.72,s*.58);
  g.quadraticCurveTo(s*.72,s*.76,s*.46,s*.78);
  g.quadraticCurveTo(s*.24,s*.78,s*.16,s*.66);g.closePath();g.fill();
  groove(g,s,[.34,.5,.5,.52],.022,'rgba(0,0,0,.3)');
  // bristle ridge
  g.fillStyle='#241811';
  for(let i=0;i<6;i++){const bx=s*(.24+i*.08);g.beginPath();g.moveTo(bx,s*.44);g.lineTo(bx+s*.03,s*.32);g.lineTo(bx+s*.06,s*.44);g.closePath();g.fill();}
  // legs + hooves
  g.fillStyle='#2c1f12';
  ell(g,s*.28,s*.8,s*.05,s*.07,'#2c1f12');ell(g,s*.42,s*.82,s*.05,s*.07,'#2c1f12');ell(g,s*.58,s*.8,s*.05,s*.07,'#2c1f12');
  // head + snout
  g.fillStyle=rg(g,s*.78,s*.54,s*.17,'#6e5236','#402d1c');
  g.beginPath();g.arc(s*.76,s*.56,s*.17,0,7);g.fill();
  ell(g,s*.9,s*.62,s*.08,s*.06,'#8a6a48');
  g.fillStyle='#2c1f12';g.beginPath();g.arc(s*.92,s*.61,s*.012,0,7);g.arc(s*.88,s*.63,s*.012,0,7);g.fill();
  // tusks
  g.strokeStyle='#fffaf0';g.lineWidth=s*.03;g.lineCap='round';
  g.beginPath();g.moveTo(s*.84,s*.66);g.quadraticCurveTo(s*.9,s*.7,s*.94,s*.62);g.stroke();
  g.beginPath();g.moveTo(s*.82,s*.68);g.quadraticCurveTo(s*.86,s*.74,s*.9,s*.68);g.stroke();
  // small furious eye
  g.fillStyle='#ffd94e';g.beginPath();g.arc(s*.72,s*.48,s*.022,0,7);g.fill();
  g.fillStyle='#241a10';g.beginPath();g.arc(s*.73,s*.48,s*.011,0,7);g.fill();
});
SPR.slither=mkS((g,s)=>{
  // serpent tail coil
  g.fillStyle=lg(g,s*.5,s*.6,s*.5,s*.92,'#5f8a4a','#2c4a1c');
  g.beginPath();g.moveTo(s*.34,s*.6);
  g.quadraticCurveTo(s*.24,s*.92,s*.5,s*.92);
  g.quadraticCurveTo(s*.76,s*.92,s*.66,s*.6);g.closePath();g.fill();
  g.strokeStyle='#2c4a1c';g.lineWidth=s*.014;
  for(let i=0;i<3;i++){g.beginPath();g.arc(s*.5,s*(.7+i*.07),s*.14,3.6,5.8);g.stroke();}
  // scaled muscular torso
  g.fillStyle=lg(g,s*.4,s*.44,s*.6,s*.68,'#6d9c5a','#3a5a22');
  g.beginPath();g.moveTo(s*.32,s*.44);g.quadraticCurveTo(s*.5,s*.38,s*.68,s*.44);
  g.lineTo(s*.7,s*.66);g.quadraticCurveTo(s*.5,s*.72,s*.3,s*.66);g.closePath();g.fill();
  groove(g,s,[.5,.42,.5,.68],.02,'rgba(0,0,0,.25)');
  g.strokeStyle='#2c4a1c';g.lineWidth=s*.012;
  for(let i=0;i<4;i++){g.beginPath();g.arc(s*(.4+i*.06),s*.56,s*.03,3.4,6.1);g.stroke();}
  // arms + raised obsidian dagger
  ell(g,s*.28,s*.54,s*.05,s*.09,'#5f8a4a');
  ell(g,s*.72,s*.5,s*.05,s*.08,'#5f8a4a');
  g.fillStyle=lg(g,s*.78,s*.3,s*.84,s*.46,'#6a5490','#1e1430');
  g.beginPath();g.moveTo(s*.74,s*.48);g.lineTo(s*.82,s*.28);g.lineTo(s*.86,s*.3);g.lineTo(s*.79,s*.5);g.closePath();g.fill();
  // hooded serpent head
  g.fillStyle=rg(g,s*.5,s*.26,s*.16,'#7fae62','#3a5a3e');
  g.beginPath();g.moveTo(s*.36,s*.28);g.quadraticCurveTo(s*.34,s*.14,s*.5,s*.12);
  g.quadraticCurveTo(s*.66,s*.14,s*.64,s*.28);g.quadraticCurveTo(s*.6,s*.36,s*.5,s*.36);
  g.quadraticCurveTo(s*.4,s*.36,s*.36,s*.28);g.closePath();g.fill();
  // hood flare
  g.strokeStyle='#2c4a1c';g.lineWidth=s*.02;
  g.beginPath();g.moveTo(s*.36,s*.24);g.lineTo(s*.3,s*.2);g.moveTo(s*.64,s*.24);g.lineTo(s*.7,s*.2);g.stroke();
  // slit eyes + forked tongue
  g.fillStyle='#ffd94e';
  g.beginPath();g.arc(s*.45,s*.24,s*.03,0,7);g.fill();g.beginPath();g.arc(s*.57,s*.24,s*.03,0,7);g.fill();
  g.fillStyle='#241a10';g.fillRect(s*.445,s*.21,s*.012,s*.055);g.fillRect(s*.565,s*.21,s*.012,s*.055);
  g.strokeStyle='#c8402e';g.lineWidth=s*.014;g.lineCap='round';
  g.beginPath();g.moveTo(s*.5,s*.36);g.lineTo(s*.5,s*.42);g.moveTo(s*.5,s*.42);g.lineTo(s*.47,s*.46);g.moveTo(s*.5,s*.42);g.lineTo(s*.53,s*.46);g.stroke();
});
for(const k of ['bat','bear','dino','spider','boar','slither'])SPR[k]=outlined(SPR[k],'#140d07',5);
