"use strict";
// ---------- comic print pass: Ben-Day dots, speed lines, POW bursts ----------
// Old-school comix look (Silver Age dots + Savage Sword inks). Called from render-room.js.
const HALFTONE=(function(){
  const t=document.createElement('canvas');t.width=6;t.height=6;
  const g=t.getContext('2d');
  g.fillStyle='#140a05';
  g.beginPath();g.arc(1.5,1.5,1.1,0,7);g.fill();
  g.beginPath();g.arc(4.5,4.5,1.1,0,7);g.fill();
  return t;
})();
let HALFPAT=null;
function drawComicPrint(){
  // whole-frame print texture: subtle halftone dots + aged newsprint edge tint
  resetT(ctx);
  if(!HALFPAT){try{HALFPAT=ctx.createPattern(HALFTONE,'repeat');}catch(e){}}
  if(HALFPAT){
    ctx.globalAlpha=.05;
    ctx.fillStyle=HALFPAT;
    ctx.fillRect(0,0,VW,VH);
    ctx.globalAlpha=1;
  }
  const pg=ctx.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.42,VW/2,VH/2,Math.max(VW,VH)*.72);
  pg.addColorStop(0,'rgba(214,182,130,0)');pg.addColorStop(1,'rgba(214,182,130,.08)');
  ctx.fillStyle=pg;ctx.fillRect(0,0,VW,VH);
}
function drawSpeedLines(x,y,dx,dy){
  // trailing action lines opposite the movement direction (boss charge)
  ctx.save();
  ctx.strokeStyle='rgba(232,217,192,.45)';
  ctx.lineCap='round';
  for(let i=0;i<7;i++){
    const off=(i-3)*TILE*.17;
    const px=x-dy*off,py=y+dx*off;
    const l=TILE*(1.1+((i*37)%5)*.24);
    ctx.lineWidth=1+((i*13)%3);
    ctx.beginPath();
    ctx.moveTo(px-dx*TILE*.55,py-dy*TILE*.55);
    ctx.lineTo(px-dx*(TILE*.55+l),py-dy*(TILE*.55+l));
    ctx.stroke();
  }
  ctx.restore();
}
function burstStarPath(c,x,y,r1,r2,n,rot){
  c.beginPath();
  for(let i=0;i<n*2;i++){
    const r=(i%2)?r2:r1,a=rot+i*Math.PI/n;
    const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;
    if(i===0)c.moveTo(px,py);else c.lineTo(px,py);
  }
  c.closePath();
}
function drawPow(x,y,txt,scale,rot){
  // yellow jagged burst + red onomatopoeia, thick ink outline
  ctx.save();
  ctx.translate(x,y);ctx.rotate(rot);
  const r=TILE*.66*scale;
  burstStarPath(ctx,0,0,r,r*.52,9,rot*2);
  ctx.fillStyle='#ffd93b';ctx.fill();
  ctx.lineWidth=Math.max(2,TILE*.055);ctx.strokeStyle='#17100a';ctx.stroke();
  ctx.font='900 '+Math.max(14,TILE*.32*scale)+'px Impact,"Arial Black",sans-serif';
  ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=Math.max(3,TILE*.08);ctx.lineJoin='round';
  ctx.strokeText(txt,0,0);
  ctx.fillStyle='#c8402e';ctx.fillText(txt,0,0);
  ctx.restore();
}
