// Parcours réel dans Chromium contre `vite preview` (dist/). Usage : node e2e/smoke.mjs [outDir]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // nécessite Playwright + Chromium installés
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] ?? 'e2e/out';
mkdirSync(OUT, { recursive: true });
const PORT = 4183;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const URL = `http://localhost:${PORT}/`;
const KEY = 'guitar-leveling:v2';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitServer() { for (let i = 0; i < 50; i++) { try { if ((await fetch(URL)).ok) return; } catch {} await wait(200); } throw new Error('preview server not up'); }

let browser;
try {
  await waitServer();
  browser = await chromium.launch();
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const saved = () => page.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  const xpOf = async () => Number((await page.locator('[data-testid="crystals"]').count()) >= 0);
  void xpOf;

  await page.goto(URL);
  check('création du héros au premier lancement', await page.getByRole('dialog', { name: 'Créer ton héros' }).isVisible());
  await page.getByRole('radio', { name: /Guitariste/ }).nth(1).click();
  await page.getByLabel('Ton nom de héros').fill('Amir');
  await page.getByRole('button', { name: /Commencer l’aventure/ }).click();
  check('profil créé (fille, Amir)', (await page.locator('.hero-name').textContent()) === 'Amir' && (await saved()).profile.avatar === 'girl');

  // 7 quêtes quotidiennes
  for (const q of ['echauf', 'arp', 'gamme', 'theo', 'lect', 'etude', 'morceau']) await page.getByTestId(`q-${q}`).click();
  check('7/7 quêtes cochées', (await page.getByTestId('qcount').textContent()).trim() === '7 / 7');
  await page.screenshot({ path: `${OUT}/01-quetes.png`, fullPage: true });

  // Limit Break
  await page.getByRole('button', { name: 'Briser la limite' }).click();
  await page.getByRole('button', { name: 'Défi relevé !' }).click();
  check('Limit Break relevé', !!(await saved()).days[Object.keys((await saved()).days)[0]].lb);

  // Portail + défi hebdo
  await page.getByRole('button', { name: 'Portail fermé' }).click();
  const weekly = page.locator('.panel', { hasText: 'Défis de la semaine' }).getByRole('checkbox').first();
  await weekly.click();
  const s1 = await saved();
  const d1 = s1.days[Object.keys(s1.days)[0]];
  check('portail fermé + défi hebdo enregistrés', !!d1.urg && Object.values(s1.weeks).flat().length === 1);

  // Donjon
  await page.getByRole('button', { name: /Donjons/ }).first().click();
  await page.getByTestId('E-obj-0').click();
  await page.getByTestId('E-boss-0').click();
  check('objectif + boss du donjon E validés', !!(await saved()).items['E-obj-0'] && !!(await saved()).items['E-boss-0']);
  await page.screenshot({ path: `${OUT}/02-donjons.png`, fullPage: true });

  // Répertoire : fiche, étape, maîtrise
  await page.getByRole('button', { name: /Répertoire/ }).first().click();
  await page.getByLabel('Rechercher').fill('Chemin du vent');
  await page.locator('.song-row').first().click();
  await page.getByRole('dialog').getByRole('checkbox').first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Maîtrisé', exact: true }).click();
  const s2 = await saved();
  check('morceau : étape du plan + maîtrise', s2.rep['gh-kaze']?.st?.includes(0) && !!s2.items['R-gh-kaze']);
  await page.screenshot({ path: `${OUT}/03-fiche-morceau.png` });
  await page.getByRole('button', { name: 'Fermer' }).click();

  // Entraînement : session guidée 15 min complète
  await page.getByRole('button', { name: /Entraînement/ }).first().click();
  await page.getByLabel('Durée').selectOption('15');
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Bloc terminé' }).click();
  check('session guidée complète (+bonus)', (await saved()).days[Object.keys((await saved()).days)[0]].sess === 1);

  // Journal : record + révision d'ombre
  await page.getByRole('button', { name: /Journal/ }).first().click();
  await page.getByLabel('Nouveau record Gammes').fill('72');
  await page.locator('form.rec').first().getByRole('button', { name: 'Noter' }).click();
  await page.locator('.shadow').first().getByRole('button', { name: 'Rejouer' }).click();
  const s3 = await saved();
  check('record noté + ombre rejouée', s3.records.gamme?.best === 72 && (s3.days[Object.keys(s3.days)[0]].rev ?? []).length === 1);
  await page.screenshot({ path: `${OUT}/04-journal.png`, fullPage: true });

  // Boutique : achat selon progression
  await page.getByRole('button', { name: /Héros/ }).first().click();
  const before = Number((await page.getByTestId('shop-crystals').textContent()).replace(/\D/g, ''));
  await page.getByTestId('buy-t2').click();
  const s4 = await saved();
  const after = Number((await page.getByTestId('shop-crystals').textContent()).replace(/\D/g, ''));
  check('achat d’un titre débloqué par la progression', s4.shop.owned.includes('t2') && before - after === 40, `${before} → ${after}`);
  check('objet à condition non remplie : bouton désactivé', await page.getByTestId('buy-guitar_crystal').isDisabled());
  await page.screenshot({ path: `${OUT}/05-boutique.png`, fullPage: true });
  await page.getByRole('tab', { name: 'Garde-robe' }).click();
  await page.getByLabel('Titre').selectOption('t2');
  await page.getByRole('button', { name: /Quêtes/ }).first().click();
  check('titre équipé affiché sur la fiche', (await page.locator('.hero-name-row .tag').textContent()) === 'Ami des cordes à vide');

  // Persistance
  await page.reload();
  check('progression conservée après rechargement', (await page.getByTestId('qcount').textContent()).trim() === '7 / 7');

  // Thèmes
  for (const t of ['Sakura', 'Cyberpunk', 'Ombre']) {
    await page.getByRole('button', { name: /Thèmes/ }).click();
    await page.getByRole('button', { name: new RegExp(t) }).first().click();
    await page.keyboard.press('Escape');
    await wait(450);
    check(`thème ${t}`, (await page.evaluate(() => document.documentElement.dataset.theme)) === t.toLowerCase());
    await page.screenshot({ path: `${OUT}/06-theme-${t.toLowerCase()}.png` });
  }

  // Grimoire
  await page.getByRole('button', { name: /Grimoire/ }).first().click();
  check('grimoire (méthode)', await page.getByText('Apprendre un nouveau morceau').isVisible());

  // Reprise d'une sauvegarde du projet de base
  const legacy = JSON.stringify({ days: { '2026-11-01': { q: ['echauf', 'arp', 'gamme', 'theo', 'lect'], train: 40 } }, items: { 'E-obj-0': '2026-11-01', 'E-theo-0': '2026-11-01' }, weeks: {}, records: { gamme: { best: 66, beats: 2 } }, meta: { v: 4, peak: 'E' }, gacha: { spent: 30 }, rep: {}, repc: {}, ui: { theme: 'ombre' } });
  const lc = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await lc.addInitScript((v) => { if (!localStorage.getItem('guitar-leveling:v2')) localStorage.setItem('guitar-leveling-v1', v); }, legacy);
  const lp = await lc.newPage();
  lp.on('pageerror', (e) => errors.push(e.message));
  await lp.goto(URL);
  await lp.getByLabel('Ton nom de héros').fill('Ancien');
  await lp.getByRole('button', { name: /Commencer l’aventure/ }).click();
  const lv = await lp.getByTestId('level').textContent();
  // 20+30+30+20+20 quêtes + 40 entraînement + 120 + 80 donjon + 2×40 records = 440 XP → niveau 2
  check('sauvegarde du projet de base reprise (XP recalculée)', lv === '2', `niveau ${lv}`);
  await lc.close();

  // Mobile
  const storage = await page.evaluate((k) => localStorage.getItem(k), KEY);
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.addInitScript(([k, s]) => localStorage.setItem(k, s), [KEY, storage]);
  const mp = await m.newPage();
  mp.on('pageerror', (e) => errors.push(e.message));
  for (const h of ['quetes', 'donjons', 'repertoire', 'heros', 'journal', 'entrainement']) {
    await mp.goto(URL + '#/' + h);
    await wait(450);
    const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`mobile 390 px ${h} : pas de défilement horizontal`, overflow <= 0, `overflow=${overflow}px`);
    await mp.screenshot({ path: `${OUT}/07-mobile-${h}.png` });
  }

  check('aucune erreur JS / console', errors.length === 0, errors.join(' | '));
} catch (e) {
  check('exécution du parcours', false, e.message);
} finally {
  await browser?.close();
  server.kill();
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} vérifications OK`);
process.exit(failed ? 1 : 0);
