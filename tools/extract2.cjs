const fs=require('fs'),vm=require('vm');
const [,,src,out]=process.argv;
const L=fs.readFileSync(src,'utf8').split('\n');
const part=(a,b)=>L.slice(a-1,b).join('\n');
const code=part(2744,2990)+'\n'+part(2992,2993)+'\n'+part(3002,3014)+'\n'+part(3530,3569);
const ctx={};vm.createContext(ctx);
vm.runInContext(code+'\n;globalThis.__o={DIFF,DIFF_RANK,REP_XP,STEP_XP,GENRES,GORDER,COLLS,SONGS_RAW,PIECE_GENRE,RANK_DIFF,PLAN,COMPAS,LB_XP,LB_SONG_XP,LB_POOL};',ctx);
const o=JSON.parse(JSON.stringify(ctx.__o));
for(const g of Object.values(o.GENRES)){delete g.c;delete g.ic}
fs.writeFileSync(out,JSON.stringify(o));
console.log(Object.entries(o).map(([k,v])=>k+':'+(typeof v==='object'?(Array.isArray(v)?v.length:Object.keys(v).length):v)).join(' '));
