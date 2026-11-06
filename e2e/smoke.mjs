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
  check('choix du personnage au premier lancement', await page.getByRole('dialog', { name: 'Choisis ton personnage' }).isVisible());
  check('confirmation impossible sans choix', await page.getByRole('button', { name: 'Choisis un personnage' }).isDisabled());
  const imgs = await page.getByRole('dialog').locator('[data-testid="avatar-body"]').evaluateAll((els) => els.map((e) => e.currentSrc || e.src));
  check('aperçus = vrais masters du kit (pas de recadrage)', imgs.length === 2 && imgs.every((u) => /characters\/(boy|girl)_base/.test(u)), imgs.join(' '));
  check('avant le choix : aucun avatar par défaut derrière la fenêtre', (await page.locator('.hub-hero [data-avatar]').count()) === 0 && (await page.locator('.hub-hero .avatar-pending').count()) === 1);
  await page.getByTestId('pick-girl').click();
  await page.getByLabel('Ton nom de héros').fill('Amir');
  await page.getByRole('button', { name: /Confirmer ce personnage/ }).click();
  const sv0 = await saved();
  check('personnage choisi et verrouillé (fille, Amir)', sv0.profile.avatar === 'girl' && sv0.profile.avatarConfirmed === true && sv0.profile.name === 'Amir');
  await page.screenshot({ path: `${OUT}/00-hub.png` });
  const fit = async (pg) => pg.evaluate(() => {
    const st = document.querySelector('[data-testid="hub-stage"]').getBoundingClientRect();
    const a = document.querySelector('.hub-hero').getBoundingClientRect();
    return { inStage: a.top >= st.top - 1 && a.bottom <= st.bottom + 1 && a.left >= st.left && a.right <= st.right, inView: a.top >= 0 && a.bottom <= window.innerHeight, h: Math.round(a.height), sh: Math.round(st.height) };
  });
  const f1 = await fit(page);
  check('hub desktop : personnage entier, dans la scène et l’écran', f1.inStage && f1.inView, JSON.stringify(f1));
  check('hub : avatar fille partout', (await page.locator('.hub-hero [data-avatar]').getAttribute('data-avatar')) === 'girl');
  await page.getByRole('button', { name: /Quêtes/ }).first().click();

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

  // Accueil : toucher le personnage → accord + notes
  await page.getByRole('button', { name: /Accueil/ }).first().click();
  await page.getByTestId('hero-play').click();
  check('toucher le personnage joue un accord (retour visuel)', await page.locator('.strum-fx .chord-name').count() === 1);
  check('le master reste affiché tant que l’art « guitare en main » manque', (await page.getByTestId('avatar-body').getAttribute('src')).includes('_base'));
  // Entraînement : session guidée 15 min complète
  await page.getByRole('button', { name: /Entraînement/ }).first().click();
  await page.getByRole('radio', { name: '15 min' }).click();
  await page.getByTestId('sess-start').click();
  await page.waitForTimeout(2300);
  const clockA = await page.getByTestId('sess-clock').textContent();
  check('séance : le minuteur décompte', clockA !== '02:00', clockA);
  await page.getByRole('tab', { name: 'Métronome' }).click().catch(() => page.getByRole('button', { name: 'Métronome', exact: true }).click());
  await page.getByRole('tab', { name: 'Session guidée' }).click().catch(() => page.getByRole('button', { name: 'Session guidée', exact: true }).click());
  const clockB = await page.getByTestId('sess-clock').textContent();
  check('séance conservée après passage par l’onglet Métronome', clockB <= clockA && clockB !== '02:00', `${clockA} → ${clockB}`);
  check('métronome intégré à la séance', await page.locator('.inline-metro [data-testid=metro-bpm]').count() === 1);
  await page.reload();
  await page.getByRole('button', { name: /Accueil/ }).first().click();
  check('accueil : « Reprendre ma séance » après rechargement', await page.getByTestId('hub-resume').count() === 1);
  await page.getByTestId('hub-resume').click();
  const clockC = await page.getByTestId('sess-clock').textContent();
  check('séance reprise au même point après rechargement', clockC !== '02:00', clockC);
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Bloc terminé' }).click();
  const sd = await saved(); const dd = sd.days[Object.keys(sd.days)[0]];
  check('session guidée complète (+bonus)', dd.sess === 1);
  check('temps de pratique enregistré', (dd.prac ?? 0) >= 2, `${dd.prac}s`);
  check('bilan de séance affiché', await page.getByTestId('sess-recap').isVisible());
  await page.screenshot({ path: `${OUT}/09-bilan-seance.png` });
  await page.getByRole('button', { name: 'Nouvelle séance' }).click();

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

  check('écran Héros : plus de sélecteur garçon/fille', (await page.getByRole('radiogroup').count()) === 0);

  // Persistance
  await page.reload();
  check('progression conservée après rechargement', (await page.getByTestId('qcount').textContent()).trim() === '7 / 7');
  check('aucun choix redemandé après rechargement', (await page.getByRole('dialog').count()) === 0);
  for (const h of ['hub', 'heros', 'quetes']) {
    await page.goto(URL + '#/' + h);
    const av = await page.locator('[data-avatar], .avatar-portrait').first().evaluate((e) => e.getAttribute('data-avatar') ?? e.style.backgroundImage);
    check(`avatar stable sur ${h}`, /girl/.test(av), av);
  }

  // Thèmes : captures du hub sans nom de thème (test de reconnaissance, doc 03)
  await page.goto(URL + '#/hub');
  for (const t of ['Sakura', 'Cyberpunk', 'Ombre']) {
    await page.getByRole('button', { name: /Thèmes/ }).click();
    await page.getByRole('button', { name: new RegExp(t) }).first().click();
    await page.keyboard.press('Escape');
    await wait(700);
    const w = await page.locator('.hub').getAttribute('class');
    check(`thème ${t} : univers appliqué au hub`, (await page.evaluate(() => document.documentElement.dataset.theme)) === t.toLowerCase() && w.includes('world-' + t.toLowerCase()));
    await page.addStyleTag({ content: '.provisional-tag{display:none!important}' });
    await page.getByTestId('hub-stage').screenshot({ path: `${OUT}/06-sans-nom-${['A', 'B', 'C'][['Sakura', 'Cyberpunk', 'Ombre'].indexOf(t)]}.png` });
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
  await lp.getByTestId('pick-boy').click();
  await lp.getByLabel('Ton nom de héros').fill('Ancien');
  await lp.getByRole('button', { name: /Confirmer ce personnage/ }).click();
  const lv = await lp.getByTestId('level').textContent();
  // 20+30+30+20+20 quêtes + 40 entraînement + 120 + 80 donjon + 2×40 records = 440 XP → niveau 2
  check('sauvegarde du projet de base reprise (XP recalculée)', lv === '2', `niveau ${lv}`);
  await lc.close();

  // Compte v0.2 existant (déjà onboardé, sans choix de personnage)
  const v02 = JSON.stringify({ v: 2, days: { '2026-11-01': { q: ['arp', 'gamme', 'echauf'] } }, items: {}, weeks: {}, records: {}, meta: {}, rep: {}, repc: {}, profile: { name: 'Vétéran', avatar: 'boy', theme: 'ombre', onboarded: true, sfx: true }, shop: { spent: 0, owned: [], equipped: {}, inv: { c_scroll: 0, c_key: 0 } } });
  const vc = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await vc.addInitScript((v) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('guitar-leveling:v2', v); sessionStorage.setItem('seeded', '1'); } }, v02);
  const vp = await vc.newPage();
  await vp.goto(URL);
  check('compte v0.2 : choix demandé une fois, sans champ nom', await vp.getByRole('dialog', { name: 'Choisis ton personnage' }).isVisible() && (await vp.getByLabel('Ton nom de héros').count()) === 0);
  await vp.getByTestId('pick-girl').click();
  await vp.getByRole('button', { name: /Confirmer ce personnage/ }).click();
  const vs = await vp.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  check('compte v0.2 : nom, thème et quêtes conservés', vs.profile.name === 'Vétéran' && vs.profile.theme === 'ombre' && vs.days['2026-11-01'].q.length === 3 && vs.profile.avatar === 'girl');
  await vp.reload();
  check('compte v0.2 : plus de choix après rechargement', (await vp.getByRole('dialog').count()) === 0);
  await vc.close();

  // Mouvement réduit
  const rc = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const rs = await page.evaluate((k) => localStorage.getItem(k), KEY);
  await rc.addInitScript(([k, s2]) => localStorage.setItem(k, s2), [KEY, rs]);
  const rp = await rc.newPage();
  await rp.goto(URL + '#/hub');
  const mode = await rp.locator('.hub-hero .avatar').getAttribute('data-anim-mode');
  const anim = await rp.locator('.hub-hero .avatar-rig').evaluate((e) => getComputedStyle(e).animationName);
  check('prefers-reduced-motion : personnage statique, aucune animation', mode === 'static' && anim === 'none', `${mode} / ${anim}`);
  await rc.close();

  // Mobile
  const storage = await page.evaluate((k) => localStorage.getItem(k), KEY);
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.addInitScript(([k, s]) => localStorage.setItem(k, s), [KEY, storage]);
  const mp = await m.newPage();
  mp.on('pageerror', (e) => errors.push(e.message));
  await mp.goto(URL + '#/hub');
  await wait(500);
  const f2 = await fit(mp);
  check('hub mobile 390×844 : personnage entier visible sans défiler', f2.inStage && f2.inView, JSON.stringify(f2));
  await mp.screenshot({ path: `${OUT}/07-mobile-hub.png` });
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
