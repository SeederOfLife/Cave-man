#!/usr/bin/env node
/**
 * Headless smoke test : stub window/document/canvas, charge les fichiers js/
 * dans l'ordre d'index.html, puis vérifie démarrage, mouvement, limites de
 * craft, containment et le flow cave→tower.
 * Commande : node tests/smoke.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- l'ordre de chargement vient d'index.html, pas d'une liste dupliquée ---
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(js\/[^"]+)"><\/script>/g)].map(m => m[1]);
if (files.length < 2) { console.error('FAIL: index.html ne liste pas les scripts js/'); process.exit(1); }

// --- stubs DOM/canvas ---
// stub that mimics the real canvas's throwing behavior so sprite bugs surface:
// - addColorStop rejects non-string colors (a gradient passed as a color stop)
// - createRadialGradient rejects negative radii (IndexSizeError)
// - drawImage rejects an undefined/null image (missing SPR key)
function makeCtx() {
  const grad = { addColorStop(_o, c) { if (typeof c !== 'string') throw new TypeError('addColorStop: color must be a string, got ' + typeof c); } };
  return new Proxy({ filter: 'none', globalAlpha: 1, textAlign: 'left' }, {
    get(t, p) {
      if (p in t) return t[p];
      if (p === 'createLinearGradient') return () => grad;
      if (p === 'createRadialGradient') return (x0, y0, r0, x1, y1, r1) => { if (r0 < 0 || r1 < 0) throw new RangeError('createRadialGradient: negative radius'); return grad; };
      if (p === 'drawImage') return img => { if (img == null) throw new TypeError('drawImage: image is ' + img); };
      return (t[p] = () => {});
    },
    set(t, p, v) { t[p] = v; return true; },
  });
}
function makeEl() {
  return {
    width: 0, height: 0, style: {}, textContent: '', innerHTML: '',
    classList: { add() {}, remove() {}, toggle() {} },
    addEventListener() {},
    getContext: () => makeCtx(),
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 960, height: 600 }),
  };
}
const els = {};
const sandbox = {
  document: {
    getElementById: id => (els[id] ||= makeEl()),
    createElement: () => makeEl(),
  },
  navigator: { maxTouchPoints: 0 },
  performance,
  addEventListener() {}, removeEventListener() {},
  requestAnimationFrame() {},
  console, Math, Object, Array, JSON,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.innerWidth = 960; sandbox.innerHeight = 600;
Object.defineProperty(sandbox.window, 'innerWidth', { value: 960 });
Object.defineProperty(sandbox.window, 'innerHeight', { value: 600 });
vm.createContext(sandbox);

const src = files.map(f => readFileSync(join(ROOT, f), 'utf8')).join('\n')
  + `\n;globalThis.__T = { start, update, render, keepInRoom, newTowerFloor, checkClear, newEnemy, keys,
       shopBuy, castSkill, chooseSkill, gainXp, recalcStats, ITEM_BY_ID, COMPS, SHOP_TABS, SKILLS,
       get game() { return game }, get TILE() { return TILE } };`;
vm.runInContext(src, sandbox, { filename: 'game-concat.js' });
const T = sandbox.__T;

let passed = 0, failed = 0;
function assert(cond, name) {
  if (cond) { passed++; console.log('  ✅ ' + name); }
  else { failed++; console.log('  ❌ ' + name); }
}

// 1. démarrage
T.start(1);
assert(T.game && T.game.players.length === 1 && T.game.depth === 1, 'start(1) : partie créée, 1 joueur, cave 1');
assert(T.game.cur && T.game.cur.type === 'start' && T.game.cur.obst, 'room de départ construite');
// render de la salle de départ : exerce le héros (SPR.caveman) et le Silent Trader
T.render();
assert(true, 'render() de la salle de départ sans crash (héros + trader)');

// 1bis. carte MOBA : base, objectif, 3 lanes, jungle, et graphe connexe
const R = T.game.rooms;
assert(R['0,0'] && R['0,0'].type === 'start', 'base au sud (0,0)');
assert(R['0,-4'] && R['0,-4'].type === 'exit', 'objectif/gardien au nord (0,-4)');
assert(['-2,-1', '0,-1', '2,-1'].every(k => R[k] && R[k].type === 'normal'), '3 lanes (solo/mid/bot)');
assert(R['-1,-2'].type === 'shrine' && R['1,-2'].type === 'treasure', 'camps de jungle (shrine + relic)');
const DV = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] };
const seen = new Set(['0,0']), q = ['0,0'];
while (q.length) { const k = q.pop(), r = R[k]; for (const d in DV) if (r.doors[d]) { const nk = (r.gx + DV[d][0]) + ',' + (r.gy + DV[d][1]); if (R[nk] && !seen.has(nk)) { seen.add(nk); q.push(nk); } } }
assert(seen.size === Object.keys(R).length, `carte connexe depuis la base (${seen.size}/${Object.keys(R).length})`);

// 2. boucle + mouvement
const x0 = T.game.players[0].x;
T.keys['KeyD'] = true;
for (let i = 0; i < 60; i++) T.update(1 / 60);
T.keys['KeyD'] = false;
assert(T.game.players[0].x > x0, 'le joueur bouge vers la droite');
assert(T.game.hunger < 100, 'la faim draine');
for (let i = 0; i < 600; i++) T.update(1 / 60);
assert(true, '10 s de update sans crash');

// 3. shop : composants → fusion en objet fini, stats appliquées, cap 6 slots
for (const m in T.game.mats) T.game.mats[m] = 99;
T.shopBuy(T.ITEM_BY_ID.flint2); T.shopBuy(T.ITEM_BY_ID.haft);
assert(T.game.items.length === 2, 'deux composants achetés');
T.shopBuy(T.ITEM_BY_ID.p01); // SPEAR OF FIRST BLOOD = flint2 + haft
assert(T.game.items.length === 1 && T.game.items[0] === 'p01', 'les composants fusionnent en objet fini');
assert(T.game.players[0].dmg >= 3, `+dmg appliqué (dmg=${T.game.players[0].dmg})`);
for (const c of ['hide','hide','bone2','bone2','glass','plume']) T.shopBuy(T.ITEM_BY_ID[c]);
assert(T.game.items.length === 6, 'pouch plein à 6');
const before6 = T.game.items.length;
T.shopBuy(T.ITEM_BY_ID.cord);
assert(T.game.items.length === before6, 'cap 6 slots respecté');
T.shopBuy(T.ITEM_BY_ID.bola); // bola = cord+bone2 → cord manquant : refusé
assert(!T.game.items.includes('bola'), 'objet refusé sans ses composants');

// 3bis. skills : cast + XP + level-up choisi
T.game.scd.volley = 0;
const nStones = T.game.stones.length;
T.castSkill(0, T.game.players[0]);
assert(T.game.stones.length > nStones, 'STONE VOLLEY lance des pierres');
const lvl0 = T.game.level;
T.gainXp(1000);
assert(T.game.level > lvl0 && T.game.pendingPts > 0, 'XP → level-up + points en attente');
const lvVolley = T.game.skillLv.volley;
T.chooseSkill(0);
assert(T.game.skillLv.volley === lvVolley + 1, 'choix du skill au level-up');
T.game.ultCharge = 100;
T.game.lvlOpen = false;
T.castSkill(3, T.game.players[0]);
assert(T.game.ultCharge === 0, "l'ult consomme sa charge");

// 4. containment
const e = { x: -9999, y: -9999, r: T.TILE * 0.3, fly: false };
T.keepInRoom(e);
assert(e.x >= T.TILE && e.y >= T.TILE && e.x <= 16 * T.TILE && e.y <= 10 * T.TILE, 'keepInRoom ramène une entité éjectée');

// 5. flow tower : un gardien scelle la sortie
T.game.depth = 3;
T.game.towerTier = 1;
T.newTowerFloor();
assert(T.game.mode === 'tower' && T.game.cur.live.some(b => b.boss), 'tower floor : boss présent');
assert(!(T.game.cur.cleared || T.game.cur.live.length === 0), 'sortie scellée tant que le gardien vit');
T.game.cur.live.length = 0;
T.checkClear(T.game.cur);
assert(T.game.cur.cleared, 'gardien mort → salle clear');

// 6. nouveaux monstres : spawn direct + 2 s d'IA (lunge du boar, zigzag spider, spit slither)
for (const t of ['spider', 'boar', 'slither']) T.game.cur.live.push(T.newEnemy(t, 3 * T.TILE, 3 * T.TILE, 5));
for (let i = 0; i < 120; i++) T.update(1 / 60);
assert(T.game.cur.live.every(e => Number.isFinite(e.x) && Number.isFinite(e.y)), 'spider/boar/slither : IA stable');

// 7. ember : explose à l'expiration sans crash
T.game.stones.push({ x: 3 * T.TILE, y: 3 * T.TILE, vx: 0, vy: 0, life: 0.05, dmg: 2, pierce: 0, ember: true });
for (let i = 0; i < 10; i++) T.update(1 / 60);
assert(T.game.stones.every(s => !s.ember), 'ember blast déclenché');

// 8. render ne crash pas (ctx stub), y compris POW burst, speed lines et passe comic
T.newTowerFloor();
const boss = T.game.cur.live.find(b => b.boss);
boss.state = 'charge'; boss.cdx = 1; boss.cdy = 0;
T.game.floats.push({ x: 100, y: 100, txt: 'KRAK!', color: '#fff', life: 0.8, pow: true, rot: 0.1 });
T.render();
assert(true, 'render() sans crash');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
