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
function makeCtx() {
  return new Proxy({ filter: 'none', globalAlpha: 1, textAlign: 'left' }, {
    get(t, p) {
      if (p in t) return t[p];
      if (p === 'createRadialGradient' || p === 'createLinearGradient') return () => ({ addColorStop() {} });
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
  + `\n;globalThis.__T = { start, update, render, craft, keepInRoom, newTowerFloor, checkClear, newEnemy, REC, keys,
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

// 2. boucle + mouvement
const x0 = T.game.players[0].x;
T.keys['KeyD'] = true;
for (let i = 0; i < 60; i++) T.update(1 / 60);
T.keys['KeyD'] = false;
assert(T.game.players[0].x > x0, 'le joueur bouge vers la droite');
assert(T.game.hunger < 100, 'la faim draine');
for (let i = 0; i < 600; i++) T.update(1 / 60);
assert(true, '10 s de update sans crash');

// 3. limites de craft (2 tools / 3 passifs)
for (const m in T.game.mats) T.game.mats[m] = 99;
T.REC.forEach((r, i) => T.craft(i));
const nPassive = T.REC.filter(r => r.kind === 'passive' && T.game.crafted[r.id]).length;
assert(nPassive === 3, `3 crafts passifs max (obtenu : ${nPassive})`);
assert(T.game.actives.length === 2, `2 tools actifs max (obtenu : ${T.game.actives.length})`);

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
