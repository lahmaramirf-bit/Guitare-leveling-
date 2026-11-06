// Extrait les constantes de contenu du fichier d'origine dans un bac à sable (aucun DOM).
const fs=require('fs'),vm=require('vm');
const [,,src,out]=process.argv;
const L=fs.readFileSync(src,'utf8').split('\n');
const part=(a,b)=>L.slice(a-1,b).join('\n');
// lignes 4..579 = constantes (avant les outils DOM) ; on retire SHAPES-dépendances ? non, tout est pur.
let code=part(4,579);
const names=['QUESTS','XP','XPK','PORTAL_XP','STATS','DAILY','RANKS','WEEKLY','RECS','ACH','PORTALS','GRADES','SHAPES','CHORD_FAMS','FLAT_CHORDS','PROGS','PATTERNS','PIECES','PCAT','LEXG','LEX','TEMPI','TABG','EXCAT','EXOS','TCAT','TIPS','LAWS','METHOD','SESSION_PLAN'];
const ctx={};vm.createContext(ctx);
vm.runInContext(code.replace(/^const CHECK=.*$/m,'')+'\n;globalThis.__o={'+names.join(',')+'};',ctx);
const o=ctx.__o;
// ACH : convertit les prédicats "c=>c.k>=n" en données
o.ACH=o.ACH.map(a=>{const s=a[3].toString();const m=s.match(/c\.(\w+)>=(c\.\w+|\d+)/);return {id:a[0],name:a[1],desc:a[2],key:m[1],min:/^\d+$/.test(m[2])?Number(m[2]):m[2].slice(2)}});
o.RANKS=o.RANKS.map(r=>{const {min,...k}=r;return k});
o.EXOS=o.EXOS.map(e=>JSON.parse(JSON.stringify(e)));
fs.writeFileSync(out,JSON.stringify(o));
console.log(Object.entries(o).map(([k,v])=>k+':'+(Array.isArray(v)?v.length:Object.keys(v).length)).join(' '));
