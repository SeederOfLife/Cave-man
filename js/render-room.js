"use strict";
// ---------- render orchestrator · renderRoom ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- render ----------
function easeInOut(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}
function render(){
  resetT(ctx);
  ctx.fillStyle=game.mode==='tower'?'#08080c':'#0a0705';ctx.fillRect(0,0,VW,VH);
  const sx=(Math.random()-.5)*shake,sy=(Math.random()-.5)*shake;

  if(game.trans){
    const T=game.trans,e=easeInOut(Math.min(1,T.t));
    const dx=DIRV[T.dir][0]*C*TILE,dy=DIRV[T.dir][1]*R*TILE;
    renderRoom(T.from,ORX-dx*e+sx,ORY-dy*e+sy,false);
    renderRoom(T.to,ORX+dx*(1-e)+sx,ORY+dy*(1-e)+sy,false);
    const od=DOOR[OPP[T.dir]];
    game.players.forEach((p,i)=>{
      drawPlayerScreen(p,ORX+dx*(1-e)+(od.ti+.5)*TILE+(i?TILE*.4:game.twoP?-TILE*.4:0)+sx,
                        ORY+dy*(1-e)+(od.tj+.5)*TILE+sy);
    });
  } else {
    renderRoom(game.cur,ORX+sx,ORY+sy,true);
  }
  renderLight();
  drawHUD();
  drawMinimap();
  if(IS_TOUCH&&!game.craftOpen&&!game.lvlOpen)drawTouchUI();
  drawShop();
  drawLevelPanel();
  drawComicPrint();
}

function renderRoom(room,ox,oy,active){
  const s=room.seed||1;
  const tower=room.type==='tower';
  ctx.save();ctx.translate(ox,oy);
  for(let j=0;j<R;j++)for(let i=0;i<C;i++){
    const x=i*TILE,y=j*TILE,v=hash(i,j,s);
    const border=(i===0||j===0||i===C-1||j===R-1);
    if(border){
      const d=isDoorTile(i,j);
      ctx.fillStyle=tower?(v<.5?'#15151d':'#1a1a24'):(v<.5?'#241a10':'#2a1e13');
      ctx.fillRect(x,y,TILE+1,TILE+1);
      if(j===0){
        const wg=ctx.createLinearGradient(0,y+TILE-10,0,y+TILE);
        wg.addColorStop(0,tower?'#2a2a3a':'#43331f');
        wg.addColorStop(1,tower?'#3f3f56':'#6b5236');
        ctx.fillStyle=wg;ctx.fillRect(x,y+TILE-10,TILE+1,10);
      }
      if(j===0&&!d&&v>.62&&v<.75)drawPainting(x,y,v,tower);
      if(d&&room.doors[d]){
        const open=roomDoorsOpen(room);
        const ns=(d==='n'||d==='s');
        ctx.fillStyle='#100a06';
        if(ns)ctx.fillRect(x+4,y,TILE-8,TILE);else ctx.fillRect(x,y+4,TILE,TILE-8);
        // carved doorposts so doors read at a glance
        ctx.fillStyle=tower?'#4a4a66':'#7a5c38';
        if(ns){ctx.fillRect(x,y,5,TILE+1);ctx.fillRect(x+TILE-4,y,5,TILE+1);}
        else{ctx.fillRect(x,y,TILE+1,5);ctx.fillRect(x,y+TILE-4,TILE+1,5);}
        if(!open){
          const sl=room.slabT>0?Math.sin(room.slabT*40)*2:0;
          ctx.drawImage(SPR.slab,x+3+sl,y+3,TILE-6,TILE-6);
        } else {
          const pulse=.16+Math.sin(game.time*4)*.09;
          ctx.fillStyle='rgba(255,166,62,'+pulse+')';
          ctx.fillRect(ns?x+4:x,ns?y:y+4,ns?TILE-8:TILE,ns?TILE:TILE-8);
        }
      }
    } else {
      ctx.fillStyle=tower?(v<.5?'#212129':'#252532'):(v<.5?'#352a20':(v<.8?'#392e20':'#31281e'));
      ctx.fillRect(x,y,TILE+1,TILE+1);
      if(v>.82){
        ctx.fillStyle=tower?'rgba(255,255,255,.025)':'rgba(255,200,140,.03)';
        ctx.beginPath();ctx.arc(x+TILE*(.3+v*.4),y+TILE*(.3+v*.3),TILE*.4,0,7);ctx.fill();
      }
      const cell=room.obst?room.obst[j][i]:O_NONE;
      if(cell===O_WATER){
        const wgr=ctx.createLinearGradient(0,y,0,y+TILE);
        wgr.addColorStop(0,'#265a63');wgr.addColorStop(1,'#183f47');
        ctx.fillStyle=wgr;ctx.fillRect(x,y,TILE+1,TILE+1);
        ctx.strokeStyle='rgba(120,210,220,.35)';ctx.lineWidth=2;
        const w=Math.sin(game.time*2+i*1.3+j*.8)*3;
        ctx.beginPath();ctx.moveTo(x+4,y+TILE*.35+w);
        ctx.quadraticCurveTo(x+TILE/2,y+TILE*.35-w,x+TILE-4,y+TILE*.35+w);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x+8,y+TILE*.68-w);
        ctx.quadraticCurveTo(x+TILE/2,y+TILE*.68+w,x+TILE-8,y+TILE*.68-w);ctx.stroke();
      } else if(cell===O_ROCK||cell===O_OBROCK){
        ctx.drawImage(cell===O_OBROCK?SPR.obrock:SPR.rock,x+TILE*.02,y+TILE*.02,TILE*.96,TILE*.96);
        const hp=room.tileHP[i+','+j],mx=cell===O_OBROCK?4:3;
        if(hp!==undefined&&hp<mx){
          ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(x+TILE*.3,y+TILE*.35);ctx.lineTo(x+TILE*.55,y+TILE*.6);
          if(hp<=mx-2){ctx.moveTo(x+TILE*.65,y+TILE*.3);ctx.lineTo(x+TILE*.45,y+TILE*.7);}
          ctx.stroke();
        }
      } else if(cell===O_ROOT){
        ctx.drawImage(SPR.root,x+TILE*.05,y,TILE*.9,TILE*.98);
        const hp=room.tileHP[i+','+j];
        if(hp!==undefined&&hp<2){
          ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(x+TILE*.4,y+TILE*.3);ctx.lineTo(x+TILE*.6,y+TILE*.6);ctx.stroke();
        }
      } else if(cell===O_BONES){
        ctx.save();ctx.translate(x+TILE/2,y+TILE/2);
        ctx.rotate(hash(j,i,s)*3);
        ctx.drawImage(SPR.bone,-TILE*.25,-TILE*.25,TILE*.5,TILE*.5);
        ctx.restore();
      }
    }
  }

  // soft room vignette (depth without noise)
  const vg=ctx.createRadialGradient(C*TILE/2,R*TILE/2,TILE*3,C*TILE/2,R*TILE/2,TILE*9);
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.32)');
  ctx.fillStyle=vg;ctx.fillRect(TILE,TILE,(C-2)*TILE,(R-2)*TILE);

  // exit hole
  if(room.type==='exit'||room.type==='tower'){
    const cx=8.5*TILE,cy=5.5*TILE;
    const open=roomDoorsOpen(room);
    const hg=ctx.createRadialGradient(cx,cy,TILE*.1,cx,cy,TILE*.75);
    hg.addColorStop(0,'#000');hg.addColorStop(.7,'#0a0705');hg.addColorStop(1,'rgba(28,19,12,.9)');
    ctx.fillStyle=hg;
    ctx.beginPath();ctx.ellipse(cx,cy,TILE*.72,TILE*.52,0,0,7);ctx.fill();
    ctx.strokeStyle='#1c130c';ctx.lineWidth=4;ctx.stroke();
    if(!open){
      ctx.drawImage(SPR.slab,cx-TILE*.62,cy-TILE*.5,TILE*1.24,TILE*1.0);
    } else {
      const pulse=Math.sin(game.time*3)*.15+.3;
      ctx.fillStyle='rgba(255,166,62,'+pulse*.25+')';
      ctx.beginPath();ctx.ellipse(cx,cy,TILE*.95,TILE*.7,0,0,7);ctx.fill();
    }
  }

  // shrine
  if(room.shrine){
    const shx=(room.shrine.ti+.5)*TILE,shy=(room.shrine.tj+.5)*TILE;
    ell(ctx,shx,shy+TILE*.5,TILE*.42,TILE*.12,'rgba(0,0,0,.35)');
    ctx.drawImage(SPR.shrine,shx-TILE*.55,shy-TILE*.75,TILE*1.1,TILE*1.35);
    if(!room.shrine.used){
      const g=Math.sin(game.time*3)*.08+.2;
      ctx.fillStyle='rgba(193,100,42,'+g+')';
      ctx.beginPath();ctx.arc(shx,shy,TILE*.9,0,7);ctx.fill();
      ctx.fillStyle='#c1642a';ctx.font='bold '+Math.max(11,TILE*.2)+'px Trebuchet MS';ctx.textAlign='center';
      ctx.fillText('urm',shx,shy-TILE*.95);ctx.textAlign='left';
    }
  }

  // drops (warm glow: loot pops)
  for(const d of room.drops){
    const bob=Math.sin(game.time*4+d.t)*TILE*.05;
    const gl=Math.sin(game.time*5+d.t)*.06+.16;
    ctx.fillStyle='rgba(255,209,102,'+gl+')';
    ctx.beginPath();ctx.arc(d.x,d.y+bob,TILE*.3,0,7);ctx.fill();
    ell(ctx,d.x,d.y+TILE*.18,TILE*.14,TILE*.05,'rgba(0,0,0,.3)');
    ctx.drawImage(SPR[d.mat],d.x-TILE*.22,d.y-TILE*.22+bob,TILE*.44,TILE*.44);
  }

  // items
  for(const it of room.items){
    const x=(it.ti+.5)*TILE,y=(it.tj+.5)*TILE;
    if(it.pedestal)ctx.drawImage(SPR.rock,x-TILE*.42,y-TILE*.1,TILE*.84,TILE*.62);
    const bob=Math.sin(game.time*3+(it.bob||0))*TILE*.06;
    ell(ctx,x,y+TILE*.3,TILE*.2,TILE*.07,'rgba(0,0,0,.3)');
    const spr=it.type==='meat'?SPR.meat:it.type==='heart'?SPR.heart:SPR.flint;
    const iy=y-(it.pedestal?TILE*.32:0)+bob;
    ctx.drawImage(spr,x-TILE*.3,iy-TILE*.3,TILE*.6,TILE*.6);
    if(it.pedestal){
      const g=Math.sin(game.time*4)*.1+.22;
      ctx.fillStyle='rgba(255,209,102,'+g+')';
      ctx.beginPath();ctx.arc(x,y-TILE*.32,TILE*.45,0,7);ctx.fill();
    }
  }

  // the Silent Trader (decor in start rooms — shop is opened anywhere with C)
  if(room.type==='start'){
    const tx=13.5*TILE,ty=2.5*TILE;
    ell(ctx,tx,ty+TILE*.5,TILE*.28,TILE*.1,'rgba(0,0,0,.4)');
    const tb=Math.sin(game.time*1.5)*1.5;
    ctx.drawImage(SPR.trader,tx-TILE*.55,ty-TILE*.55+tb,TILE*1.1,TILE*1.1);
    const gl=Math.sin(game.time*3)*.06+.14;
    ctx.fillStyle='rgba(74,154,208,'+gl+')';
    ctx.beginPath();ctx.arc(tx,ty,TILE*.7,0,7);ctx.fill();
    ctx.fillStyle='#8ad0e2';ctx.font='bold '+Math.max(10,TILE*.2)+'px Trebuchet MS';ctx.textAlign='center';
    ctx.fillText('[C] TRADE',tx,ty-TILE*.7);ctx.textAlign='left';
  }

  // grok
  if(room.grok){
    const G=room.grok;
    const gx=(G.ti+.5)*TILE,gy=(G.tj+.5)*TILE;
    ell(ctx,gx,gy+TILE*.45,TILE*.24,TILE*.09,'rgba(0,0,0,.3)');
    const gb=Math.sin(G.t*2)*2;
    ctx.drawImage(SPR.grok,gx-TILE*.5,gy-TILE*.55+gb,TILE,TILE);
    if(!G.gave){
      ctx.fillStyle='#e8d9c0';ctx.font='bold '+Math.max(11,TILE*.22)+'px Trebuchet MS';ctx.textAlign='center';
      ctx.fillText('grok?',gx,gy-TILE*.75);ctx.textAlign='left';
    }
  }

  if(active){
    for(const sp of game.spits){
      const spg=ctx.createRadialGradient(sp.x,sp.y,1,sp.x,sp.y,TILE*.11);
      spg.addColorStop(0,'#c8f088');spg.addColorStop(1,'#6a9c38');
      ctx.fillStyle=spg;ctx.beginPath();ctx.arc(sp.x,sp.y,TILE*.1,0,7);ctx.fill();
    }
    for(const st of game.stones){
      if(st.dart){
        ctx.save();ctx.translate(st.x,st.y);ctx.rotate(Math.atan2(st.vy,st.vx));
        ctx.drawImage(SPR.obsidian,-TILE*.22,-TILE*.22,TILE*.44,TILE*.44);
        ctx.restore();
      } else if(st.ember){
        const eg=ctx.createRadialGradient(st.x,st.y,1,st.x,st.y,TILE*.22);
        eg.addColorStop(0,'#ffe9a8');eg.addColorStop(.5,'#ffb545');eg.addColorStop(1,'rgba(255,110,30,0)');
        ctx.fillStyle=eg;ctx.beginPath();ctx.arc(st.x,st.y,TILE*.22,0,7);ctx.fill();
      } else {
        ctx.drawImage(SPR.stone,st.x-TILE*.16,st.y-TILE*.16,TILE*.32,TILE*.32);
      }
    }
    for(const b of game.bolas){
      ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.rot);
      ctx.drawImage(SPR.bola,-TILE*.22,-TILE*.22,TILE*.44,TILE*.44);
      ctx.restore();
    }
    if(game.decoy){
      const D=game.decoy;
      ctx.globalAlpha=.5+Math.sin(game.time*6)*.2;
      ctx.drawImage(SPR.bone,D.x-TILE*.4,D.y-TILE*.4,TILE*.8,TILE*.8);
      ctx.globalAlpha=1;
    }
    for(const e of game.cur.live){
      if(e.boss&&e.state==='charge')drawSpeedLines(e.x,e.y,e.cdx,e.cdy);
      ell(ctx,e.x,e.y+e.r*.9,e.r,e.r*.38,'rgba(0,0,0,.32)');
      const bobY=e.fly?Math.sin(e.t*8)*TILE*.08:0;
      const w=S*e.sc;
      ctx.save();ctx.translate(e.x,e.y+bobY);
      if(e.vx<0||(e.state==='charge'&&e.cdx<0))ctx.scale(-1,1);
      if(e.hitFlash>0)ctx.filter='brightness(2.2)';
      ctx.drawImage(e.spr,-w/2,-w/2,w,w);
      ctx.filter='none';ctx.restore();
      if(e.slow>0){ctx.strokeStyle='rgba(201,160,106,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.r+3,0,7);ctx.stroke();}
      if(!e.boss&&e.hp<e.maxhp){
        ctx.fillStyle='rgba(0,0,0,.6)';roundRect(ctx,e.x-e.r,e.y-e.r-11,e.r*2,5,2.5);ctx.fill();
        ctx.fillStyle='#c8402e';roundRect(ctx,e.x-e.r+1,e.y-e.r-10,(e.r*2-2)*(e.hp/e.maxhp),3,1.5);ctx.fill();
      }
    }
    const boss=game.cur.live.find(e=>e.boss);
    if(boss){
      const bw=C*TILE*.6,bx2=(C*TILE-bw)/2,by2=TILE*.35;
      ctx.fillStyle='rgba(0,0,0,.6)';roundRect(ctx,bx2-4,by2-4,bw+8,18,8);ctx.fill();
      ctx.strokeStyle='#57422c';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='#c8402e';roundRect(ctx,bx2,by2,Math.max(2,bw*(boss.hp/boss.maxhp)),10,5);ctx.fill();
      ctx.fillStyle='#e8d9c0';ctx.font='bold '+Math.max(11,TILE*.2)+'px Trebuchet MS';ctx.textAlign='center';
      ctx.fillText(boss.name,C*TILE/2,by2+26);ctx.textAlign='left';
    }
    for(const P of game.players){
      if(P.down){
        ctx.save();ctx.translate(P.x,P.y);ctx.rotate(.4);
        ctx.drawImage(SPR.bone,-TILE*.3,-TILE*.3,TILE*.6,TILE*.6);
        ctx.restore();
        continue;
      }
      ell(ctx,P.x,P.y+TILE*.45,TILE*.22,TILE*.08,'rgba(0,0,0,.35)');
      drawPlayerLocal(P);
    }
    for(const p of game.parts){
      ctx.globalAlpha=Math.max(0,p.life*2.5);ctx.fillStyle=p.color;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size/1.6,0,7);ctx.fill();
    }
    ctx.globalAlpha=1;
    ctx.font='bold '+Math.max(13,TILE*.26)+'px Trebuchet MS';ctx.textAlign='center';
    for(const f of game.floats){
      if(f.pow){
        ctx.globalAlpha=Math.max(0,Math.min(1,f.life*1.6));
        drawPow(f.x,f.y,f.txt,1+(1-f.life)*.3,f.rot||0);
        ctx.font='bold '+Math.max(13,TILE*.26)+'px Trebuchet MS';ctx.textAlign='center';
        continue;
      }
      ctx.globalAlpha=Math.max(0,f.life);
      ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillText(f.txt,f.x+1.5,f.y+1.5);
      ctx.fillStyle=f.color;ctx.fillText(f.txt,f.x,f.y);
    }
    ctx.globalAlpha=1;ctx.textAlign='left';
    if(room.slabT>0)room.slabT-=1/60;
  }
  ctx.restore();
}
