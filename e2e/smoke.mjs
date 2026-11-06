// Parcours réel dans Chromium contre `vite preview` (dist/). Usage : node e2e/smoke.mjs [outDir]
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // Playwright doit être installé (npm i -D playwright && npx playwright install chromium)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const OUT = process.argv[2] ?? 'e2e/out';
mkdirSync(OUT, { recursive: true });
const PORT = 4183;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const URL = `http://localhost:${PORT}/`;
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

async function waitServer() {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(URL); if (r.ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('preview server not up');
}

let browser;
try {
  await waitServer();
  browser = await chromium.launch();
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(URL);
  check('onboarding affiché au premier lancement', await page.getByRole('dialog', { name: 'Créer ton héros' }).isVisible());
  await page.getByRole('radio', { name: /Guitariste/ }).nth(1).click();
  await page.getByLabel('Ton nom de héros').fill('Amir');
  await page.getByRole('button', { name: /Commencer l’aventure/ }).click();
  check('profil créé', (await page.locator('.hero-name').textContent()) === 'Amir');
  await page.screenshot({ path: `${OUT}/01-accueil-nouveau.png` });

  // Coffre du jour
  await page.getByRole('button', { name: /Coffre du jour/ }).click();
  const crystalsAfterChest = await page.evaluate(() => JSON.parse(localStorage.getItem('guitar-leveling:save')).crystals);
  check('coffre du jour crédite 20–50 cristaux', crystalsAfterChest >= 20 && crystalsAfterChest <= 50, String(crystalsAfterChest));
  check('coffre bloqué après ouverture', await page.getByRole('button', { name: /Coffre ouvert/ }).isDisabled());

  // Séance d'entraînement
  await page.getByRole('button', { name: /Commencer une séance/ }).click();
  await page.getByRole('button', { name: /Accords ouverts/ }).click();
  await page.getByRole('button', { name: 'Démarrer' }).click();
  await page.waitForTimeout(1300);
  await page.getByRole('button', { name: 'Lancer le clic' }).click();
  await page.waitForTimeout(600);
  const beatSeen = await page.locator('.dot.on').count();
  check('métronome démarre et anime les temps (son non vérifié à l’oreille)', beatSeen > 0);
  await page.screenshot({ path: `${OUT}/02-entrainement.png` });
  await page.getByRole('button', { name: 'Terminer la séance' }).click();
  await page.getByLabel('Durée réelle (minutes)').fill('30');
  await page.getByText('Propre', { exact: true }).click();
  await page.getByRole('button', { name: 'Valider la séance' }).click();
  const s1 = await page.evaluate(() => JSON.parse(localStorage.getItem('guitar-leveling:save')));
  check('séance enregistrée : 30 min propre = 360 XP', s1.xp === 360 && s1.sessions.length === 1, `xp=${s1.xp}`);

  // Quête principale
  await page.getByRole('button', { name: /Quêtes/ }).first().click();
  await page.locator('.quest', { hasText: 'Reprendre la guitare' }).getByRole('button', { name: 'Réclamer' }).click();
  const s2 = await page.evaluate(() => JSON.parse(localStorage.getItem('guitar-leveling:save')));
  check('quête « Reprendre la guitare » réclamée (+100 XP, +100 cristaux)', s2.xp === 460 && s2.claimedMain.includes('m_restart'));
  await page.screenshot({ path: `${OUT}/03-quetes.png`, fullPage: true });

  // Invocation
  await page.getByRole('button', { name: /Héros/ }).first().click();
  const canPull = s2.crystals >= 100;
  if (canPull) {
    await page.getByRole('button', { name: /Invoquer/ }).click();
    check('invocation affiche un objet', await page.locator('.pull-result').isVisible());
  } else check('invocation (cristaux insuffisants : bouton désactivé)', await page.getByRole('button', { name: /Invoquer/ }).isDisabled());
  await page.screenshot({ path: `${OUT}/04-heros.png`, fullPage: true });

  // Répertoire
  await page.getByRole('button', { name: /Répertoire/ }).first().click();
  await page.getByLabel('Titre').fill('Wonderwall');
  await page.getByLabel('Artiste').fill('Oasis');
  await page.getByRole('button', { name: 'Ajouter' }).click();
  check('morceau ajouté', await page.getByRole('heading', { name: 'Wonderwall' }).isVisible());

  // Persistance après rechargement
  await page.reload();
  check('progression conservée après rechargement', (await page.evaluate(() => JSON.parse(localStorage.getItem('guitar-leveling:save')).songs.length)) === 1);

  // Thèmes
  for (const t of ['Sakura', 'Cyberpunk', 'Ombre']) {
    await page.goto(URL + '#/home');
    await page.getByRole('button', { name: /Thèmes/ }).click();
    await page.getByRole('button', { name: new RegExp(t) }).first().click();
    await page.keyboard.press('Escape');
    await page.mouse.click(5, 5);
    await page.waitForTimeout(450); // fin des transitions de couleur
    const applied = await page.evaluate(() => document.documentElement.dataset.theme);
    check(`thème ${t} appliqué`, applied === t.toLowerCase());
    await page.screenshot({ path: `${OUT}/05-theme-${t.toLowerCase()}-desktop.png` });
  }

  // Grimoire & Journal
  await page.goto(URL + '#/grimoire');
  check('grimoire Méthode', await page.getByText('Apprendre un nouveau morceau').isVisible());
  await page.goto(URL + '#/journal');
  check('journal liste la séance', await page.getByText('Accords ouverts').first().isVisible());

  // Mobile
  const storage = await page.evaluate(() => localStorage.getItem('guitar-leveling:save'));
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.addInitScript((s) => localStorage.setItem('guitar-leveling:save', s), storage);
  const mp = await m.newPage();
  mp.on('pageerror', (e) => errors.push(e.message));
  for (const [hash, name] of [['home', 'accueil'], ['training', 'entrainement'], ['hero', 'heros']]) {
    await mp.goto(URL + '#/' + hash);
    await mp.waitForTimeout(450);
    const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(`mobile 390px ${name} : pas de défilement horizontal`, overflow <= 0, `overflow=${overflow}px`);
    await mp.screenshot({ path: `${OUT}/06-mobile-${name}.png` });
  }
  check('nav mobile fixée en bas', await mp.evaluate(() => getComputedStyle(document.querySelector('.nav')).position === 'fixed'));

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
