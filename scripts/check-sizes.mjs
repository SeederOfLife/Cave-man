#!/usr/bin/env node
/**
 * Garde-fou : aucun fichier js/ ne dépasse 300 lignes.
 * Commande : node scripts/check-sizes.mjs
 * Règle : 300 lignes max, cible 150-200. Découper AVANT d'ajouter des features.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const JS = join(__dirname, '..', 'js');
const LIMIT = 300;

const violations = readdirSync(JS)
  .filter(f => f.endsWith('.js'))
  .map(f => ({ rel: 'js/' + f, lines: readFileSync(join(JS, f), 'utf8').split('\n').length }))
  .filter(f => f.lines > LIMIT)
  .sort((a, b) => b.lines - a.lines);

if (violations.length === 0) {
  console.log('✅  Tous les fichiers js sont sous 300 lignes. Architecture saine.');
  process.exit(0);
} else {
  console.log(`\n🚨  ${violations.length} fichier(s) dépassent ${LIMIT} lignes :\n`);
  for (const { rel, lines } of violations) {
    const icon = lines > 600 ? '🔴' : lines > 400 ? '🟠' : '🟡';
    console.log(`  ${icon}  ${String(lines).padStart(5)} lignes  →  ${rel}`);
  }
  console.log("\n  → Règle : découper AVANT d'ajouter des features.\n");
  process.exit(1);
}
