// Captures du panneau personnage avec mesures. Usage : node e2e/preview-panel.mjs <theme> [outDir] [avatar] [variante, ex. v2]
// Produit preview_panel_<theme>_desktop.png / _mobile.png (+ variantes _clean) et preview_panel_<theme>.json
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const theme = process.argv[2] ?? 'sakura';
const OUT = process.argv[3] ?? 'art/previews';
const avatar = process.argv[4] ?? 'girl';
const variant = process.argv[5] ?? '';
const SUF = variant ? '_' + variant : '';
mkdirSync(OUT, { recursive: true });
const PORT = 4191;
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore', detached: true });
const URL = `http://localhost:${PORT}/`;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const BBOX = { boy: [304, 90, 719, 1170], girl: [250, 90, 774, 1170] };
const save = { v: 2, days: {}, items: {}, weeks: {}, records: {}, meta: {}, rep: {}, repc: {}, profile: { name: 'Amir', avatar, avatarConfirmed: true, theme, onboarded: true, sfx: true }, shop: { spent: 0, owned: [], equipped: {}, inv: { c_scroll: 0, c_key: 0 } } };
const report = { theme, variant: variant || 'v1', avatar, date: new Date().toISOString(), breakpoints: { mobile: '≤ 760 px : décor hauteur fixe 230 px, cadrage centré (côtés rognés)', desktop: '≥ 761 px : décor au ratio 1400:620' }, views: {} };

try {
  for (let i = 0; i < 50; i++) { try { if ((await fetch(URL)).ok) break; } catch {} await wait(200); }
  const browser = await chromium.launch();
  for (const [tag, vp] of [['desktop', { width: 1280, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await ctx.addInitScript((s) => localStorage.setItem('guitar-leveling:v2', s), JSON.stringify(save));
    const page = await ctx.newPage();
    await page.goto(URL + (variant ? `?panel=${variant}` : '') + '#/hub');
    await page.waitForLoadState('networkidle');
    await wait(400);
    await page.addStyleTag({ content: '.variant-switch{display:none!important}' }); // outil de QA, absent des captures
    const m = await page.evaluate((bbox) => {
      const r = (el) => { const b = el.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height) }; };
      const scene = document.querySelector('[data-testid="hub-stage"]');
      const box = document.querySelector('.hub-hero');
      const sc = r(scene), bx = r(box);
      const k = bx.h / 1280;
      const left = bx.x + (bx.w - 1024 * k) / 2;
      const vis = { x: Math.round(left + bbox[0] * k), y: Math.round(bx.y + bbox[1] * k), w: Math.round((bbox[2] - bbox[0]) * k), h: Math.round((bbox[3] - bbox[1]) * k) };
      const feetY = Math.round(bx.y + 1170 * k);
      return { panel: r(document.querySelector('.char-panel')), scene: sc, avatarBox: bx, avatarVisible: vis, feetY, feetInScene: +(((feetY - sc.y) / sc.h)).toFixed(3), groundTarget: +scene.dataset.ground, panelStatus: scene.dataset.panelStatus, characterHeightPctOfScene: +((vis.h / sc.h) * 100).toFixed(1), fullyVisible: vis.y >= sc.y && vis.y + vis.h <= sc.y + sc.h && vis.x >= sc.x && vis.x + vis.w <= sc.x + sc.w };
    }, BBOX[avatar]);
    report.views[tag] = { viewport: vp, ...m };
    const clip = { x: 0, y: Math.max(0, m.panel.y - 8), width: vp.width, height: Math.min(1400, m.panel.h + 330) };
    await page.screenshot({ path: `${OUT}/preview_panel_${theme}${SUF}_${tag}_clean.png`, clip, fullPage: true });
    await page.evaluate((mm) => {
      const box = (o, color, label) => { const d = document.createElement('div'); Object.assign(d.style, { position: 'absolute', left: o.x + 'px', top: o.y + 'px', width: o.w + 'px', height: o.h + 'px', outline: `2px dashed ${color}`, zIndex: 99, pointerEvents: 'none' }); const t = document.createElement('span'); t.textContent = label; Object.assign(t.style, { position: 'absolute', left: '2px', top: '2px', background: color, color: '#fff', font: '600 10px system-ui', padding: '1px 4px', whiteSpace: 'nowrap' }); d.appendChild(t); document.body.appendChild(d); };
      box(mm.scene, '#0a7d3b', `décor ${mm.scene.w}×${mm.scene.h}`);
      box(mm.avatarVisible, '#c8102e', `personnage ${mm.avatarVisible.w}×${mm.avatarVisible.h}`);
      const l = document.createElement('div'); Object.assign(l.style, { position: 'absolute', left: mm.scene.x + 'px', top: mm.feetY + 'px', width: mm.scene.w + 'px', borderTop: '2px solid #ffb000', zIndex: 99 }); document.body.appendChild(l);
      const t = document.createElement('span'); t.textContent = `sol / pieds y=${mm.feetY - mm.scene.y}px (${Math.round(mm.feetInScene * 100)} % du décor)`; Object.assign(t.style, { position: 'absolute', left: (mm.scene.x + 4) + 'px', top: (mm.feetY + 2) + 'px', background: '#ffb000', color: '#111', font: '600 10px system-ui', padding: '1px 4px', zIndex: 99 }); document.body.appendChild(t);
    }, m);
    await page.screenshot({ path: `${OUT}/preview_panel_${theme}${SUF}_${tag}.png`, clip, fullPage: true });
    await ctx.close();
  }
  await browser.close();
  writeFileSync(`${OUT}/preview_panel_${theme}${SUF}.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.views, null, 1));
} finally {
  try { process.kill(-server.pid); } catch {}
  process.exit(0);
}
