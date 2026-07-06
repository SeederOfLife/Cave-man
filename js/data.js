"use strict";
// ---------- constants (rooms, recipes, lore) · settings ----------
// Load order matters: see index.html. Plain script scope, no modules.
// ---------- constants ----------
const C=17,R=11;
const DOOR={n:{ti:8,tj:0},s:{ti:8,tj:R-1},w:{ti:0,tj:5},e:{ti:C-1,tj:5}};
const OPP={n:'s',s:'n',w:'e',e:'w'};
const DIRV={n:[0,-1],s:[0,1],w:[-1,0],e:[1,0]};
const O_NONE=0,O_ROCK=1,O_WATER=2,O_BONES=3,O_ROOT=4,O_OBROCK=5;
const MATS=['flint','wood','bone','sinew','feather','fang','obsidian'];
// item catalog (shop) lives in items-data.js / items-data2.js
const POW_WORDS=['KRAK!','THWOK!','WHUMP!','CRUNCH!','BONK!'];
const DEPTH_LORE=['THE CAVE SWALLOWS YOU','OLD BONES. OLDER WALLS.','BLACK GLASS GROWS HERE','THE PAINTINGS WATCH BACK','SLITHER-MARKS IN THE DUST','YOU HEAR THE TOWER BREATHE','ROOTS OF THE FIRST TOWER','BEFORE IRON. BEFORE PRAYERS. URM WAS.','THE COILED ONE DREAMED HERE ONCE','WHAT SLEEPS BELOW WAS OLD WHEN URM WAS YOUNG'];
const TOWER_LORE=['GHUR, FIRST OF BEARS, BARS THE WAY','A SLITHER-PRIEST HISSES YOUR NAME','THE TOWER REMEMBERS BEING WORSHIPPED','THEY BUILT IT TO REACH THE COILED ONE. THEY DUG DOWN.','PRAY AND URM SENDS DOOM. CLIMB, HUNTER.'];
const GROK_LINES=['"GROK GIVE MEAT. FRIEND STRONG."','"GROK SEE SLITHER-MEN BELOW. GROK NO GO."','"BLACK STONE CUT DEEP. GROK KNOW."','"TOWER OLD. OLDER THAN URM? GROK NOT SAY."','"URM GIVE STONE AND COURAGE AT BIRTH. NOTHING MORE. GROK ASKED TWICE."','"SLITHER-MEN WEAR MAN-FACES ABOVE. GROK SMELL THEM ANYWAY."','"COILED ONE OLDER THAN MOUNTAIN. URM NOT SAY ITS NAME."'];

// ---------- settings ----------
let aimMode='auto'; // 'auto' | 'twin'
let difficulty='hunter';
let soundOn=true;
const DIFF={cub:{hp:.7,dmg:.66,hunger:.6},hunter:{hp:1,dmg:1,hunger:1},chosen:{hp:1.4,dmg:1.5,hunger:1.3}};
function setDiff(d){difficulty=d;
  document.getElementById('diffcub').classList.toggle('sel',d==='cub');
  document.getElementById('diffhunter').classList.toggle('sel',d==='hunter');
  document.getElementById('diffchosen').classList.toggle('sel',d==='chosen');}
document.getElementById('diffcub').addEventListener('click',()=>setDiff('cub'));
document.getElementById('diffhunter').addEventListener('click',()=>setDiff('hunter'));
document.getElementById('diffchosen').addEventListener('click',()=>setDiff('chosen'));
document.getElementById('sndbtn').addEventListener('click',()=>{
  soundOn=!soundOn;
  const b=document.getElementById('sndbtn');
  b.textContent=soundOn?'SOUND ON':'SOUND OFF';
  b.classList.toggle('sel',soundOn);
});
const btnAuto=document.getElementById('aimauto');
const btnTwin=document.getElementById('aimtwin');
function setAim(m){aimMode=m;btnAuto.classList.toggle('sel',m==='auto');btnTwin.classList.toggle('sel',m==='twin');}
btnAuto.addEventListener('click',()=>setAim('auto'));
btnTwin.addEventListener('click',()=>setAim('twin'));
