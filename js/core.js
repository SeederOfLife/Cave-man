"use strict";
// ---------- canvas & DPR · sfx ----------
// Load order matters: see index.html. Plain script scope, no modules.
/* =====================================================================
   CAVE MAN v5 — smooth vector art · mobile touch · auto-aim/twin-stick
   ===================================================================== */

// ---------- canvas & DPR ----------
const cvs=document.getElementById('game');
const ctx=cvs.getContext('2d');
const lightCvs=document.createElement('canvas');
const lctx=lightCvs.getContext('2d');
let VW=960,VH=600,DPR=1;
function resetT(c){c.setTransform(DPR,0,0,DPR,0,0);}
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  VW=window.innerWidth;VH=window.innerHeight;
  cvs.width=VW*DPR;cvs.height=VH*DPR;
  cvs.style.width=VW+'px';cvs.style.height=VH+'px';
  lightCvs.width=VW*DPR;lightCvs.height=VH*DPR;
  ctx.imageSmoothingEnabled=true;lctx.imageSmoothingEnabled=true;
  if(game)computeLayout(true);
}
window.addEventListener('resize',resize);
const IS_TOUCH=('ontouchstart' in window)||navigator.maxTouchPoints>0;

// ---------- sfx ----------
let AC=null;
function audio(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();return AC;}
function sfx(type){
  if(!soundOn)return;
  try{
    const ac=audio(),t=ac.currentTime;
    const o=ac.createOscillator(),g=ac.createGain();
    o.connect(g);g.connect(ac.destination);
    const P={
      throw:()=>{o.type='square';o.frequency.setValueAtTime(340,t);o.frequency.exponentialRampToValueAtTime(120,t+.12);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.stop(t+.13);},
      hit:()=>{o.type='sawtooth';o.frequency.setValueAtTime(160,t);o.frequency.exponentialRampToValueAtTime(60,t+.1);g.gain.setValueAtTime(.08,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);o.stop(t+.11);},
      rock:()=>{o.type='square';o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(40,t+.08);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.08);o.stop(t+.09);},
      pickup:()=>{o.type='triangle';o.frequency.setValueAtTime(420,t);o.frequency.setValueAtTime(640,t+.07);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.stop(t+.19);},
      hurt:()=>{o.type='sawtooth';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(45,t+.22);g.gain.setValueAtTime(.1,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.stop(t+.23);},
      die:()=>{o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(30,t+.7);g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.7);o.stop(t+.72);},
      stairs:()=>{o.type='triangle';o.frequency.setValueAtTime(200,t);o.frequency.setValueAtTime(300,t+.1);o.frequency.setValueAtTime(450,t+.2);g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+.4);o.stop(t+.42);},
      slam:()=>{o.type='square';o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(35,t+.15);g.gain.setValueAtTime(.11,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.stop(t+.16);},
      clear:()=>{o.type='triangle';o.frequency.setValueAtTime(330,t);o.frequency.setValueAtTime(440,t+.09);o.frequency.setValueAtTime(550,t+.18);g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+.34);o.stop(t+.36);},
      grok:()=>{o.type='triangle';o.frequency.setValueAtTime(240,t);o.frequency.setValueAtTime(180,t+.12);g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.stop(t+.32);},
      boss:()=>{o.type='sawtooth';o.frequency.setValueAtTime(55,t);o.frequency.setValueAtTime(48,t+.25);o.frequency.setValueAtTime(40,t+.5);g.gain.setValueAtTime(.14,t);g.gain.exponentialRampToValueAtTime(.001,t+.8);o.stop(t+.82);},
    };
    (P[type]||P.hit)();o.start(t);
  }catch(e){}
}
