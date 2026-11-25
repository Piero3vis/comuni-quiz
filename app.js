// Quiz: tutti i comuni d'Italia
// Carica data/map.json + data/groups.json + data/extra.json + data/facts.json + data/geo.json + data/borghi.json (oppure i dati incorporati nel file unico generato da scripts/build_single_file.py).

async function loadData() {
  let map, groups, extra, facts, geo, borghi;
  const inline = document.getElementById('data');
  if (inline) {
    ({ map, groups, extra, facts, geo, borghi } = JSON.parse(inline.textContent));
  } else {
    [map, groups, extra, facts, geo, borghi] = await Promise.all([
      fetch('data/map.json').then(r => r.json()),
      fetch('data/groups.json').then(r => r.json()),
      fetch('data/extra.json').then(r => r.json()),
      fetch('data/facts.json').then(r => r.json()),
      fetch('data/geo.json').then(r => r.json()),
      fetch('data/borghi.json').then(r => r.json()),
    ]);
  }
  // extra.json (scripts/build_extra.py): popolazione, capoluoghi e comuni da record, con gli indici di map.json
  if (extra.pop.length !== map.n.length) throw new Error('data/extra.json non allineato a map.json: rigenerarlo');
  Object.assign(map, extra);
  // geo.json (scripts/build_geo.py): confinanti (nb), mare dei comuni costieri (sea, seas), comuni delle isole (ins)
  if (geo.sea.length !== map.n.length) throw new Error('data/geo.json non allineato a map.json: rigenerarlo');
  Object.assign(map, geo);
  return withGroups(map, groups, facts, borghi);
}

// Trasforma i gruppi (isole, cammini) da nomi di comuni a indici.
// Un gruppo con "union": true contiene tutti i comuni degli altri gruppi della lista (piu' gli eventuali "comuni" extra), esclusi quelli con "noUnion": true.
// Anche le curiosita' (facts.json, { "Nome": { "testo": "...", "fonte": "https://..." } }) usano i nomi: diventano map.fact, una Map indice -> testo.
// I Borghi piu' belli d'Italia (borghi.json, { agg, fonte, reg: { regione: [nomi] }, fraz: { comune: frazione } }) diventano map.bpb = { agg, reg: [[k, indici]], fraz: Map indice -> frazione }.
function withGroups(map, groups, facts, borghi) {
  const byName = new Map();
  map.n.forEach((nm, i) => { if (!byName.has(nm)) byName.set(nm, []); byName.get(nm).push(i); });
  // "Nome" oppure, per i nomi doppi, "Nome (SIGLA)"
  const lookup = nm => {
    const m = /^(.*) \(([A-Z]{2})\)$/.exec(nm);
    const a = m ? (byName.get(m[1]) || []).filter(i => map.p[i] === m[2]) : byName.get(nm);
    if (!a || a.length !== 1) throw new Error('Nome comune non risolvibile: ' + nm);
    return a[0];
  };
  // ogni gruppo diventa [nome, indici ordinati, nota]
  const resolve = list => {
    const parsed = list.map(g => ({ name: g.name, nota: g.nota || '', union: !!g.union, noUnion: !!g.noUnion, set: new Set((g.comuni || []).map(lookup)) }));
    const all = new Set();
    parsed.filter(g => !g.union && !g.noUnion).forEach(g => g.set.forEach(i => all.add(i)));
    return parsed.map(g => [g.name, [...(g.union ? new Set([...g.set, ...all]) : g.set)].sort((a, b) => a - b), g.nota]);
  };
  map.isl = resolve(groups.isole);
  map.cam = resolve(groups.cammini);
  map.conf = resolve(groups.confini);
  map.mar = resolve(groups.marinare);
  map.sto = resolve(groups.storia);
  map.min = resolve(groups.minoranze);
  map.cog = resolve(groups.cognomi);
  map.fact = new Map(Object.entries(facts).map(([nm, f]) => [lookup(nm), f.testo]));
  map.bpb = { agg: borghi.agg, fraz: new Map(Object.entries(borghi.fraz).map(([nm, f]) => [lookup(nm), f])),
    reg: Object.entries(borghi.reg).map(([rn, list]) => {
      const k = map.regs.indexOf(rn), a = list.map(lookup).sort((x, y) => x - y);
      if (k < 0 || a.some(i => map.r[i] !== k)) throw new Error('Borghi: regione sbagliata in ' + rn);
      return [k, a];
    }) };
  return map;
}

(async function main() {
const D = await loadData();
const N = D.n.length, PAL = ['#e6194b','#3cb44b','#d4a600','#4363d8','#f58231','#911eb4','#2aa5b8','#e040a0','#8fb800','#b06a2c','#008080','#7a5cc7','#c0392b','#2e8b57','#c77d00','#3b6fb6','#a23b72','#5a8f29','#d2691e','#6a7f8f'];
const paths = D.d.map(s => new Path2D(s)); const regPath = new Path2D(D.rb); const provPath = new Path2D(D.pb);
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const keyMap = new Map();
D.n.forEach((nm,i) => { new Set(nm.split('/').concat(nm.includes('/')?[nm]:[])).forEach(part => { const k = norm(part); if(!k) return; if(!keyMap.has(k)) keyMap.set(k,[]); const a = keyMap.get(k); if(!a.includes(i)) a.push(i); }); });
const LW = new Set(['di','del','della','dei','delle','dello','de','d','da','dal','in','sul','sulla','nel','nell','nella']);
const lk = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().split(/[^a-z0-9]+/).filter(w => w && !LW.has(w)).join('');
const looseMap = new Map();
D.n.forEach((nm,i) => nm.split('/').forEach(part => { const k = lk(part); if(!k) return; if(!looseMap.has(k)) looseMap.set(k,[]); const a = looseMap.get(k); if(!a.includes(i)) a.push(i); }));
const found = new Uint8Array(N);
let foundCount = 0, running = false, elapsed = 0, t0 = 0, timer = null, gaveUp = false, flash = -1;
const $ = id => document.getElementById(id);
$('tot').textContent = N;

// ---- canvas / view ----
const cv = $('cv'), ctx = cv.getContext('2d'), box = $('mapbox');
const [bx0,by0,bx1,by1] = D.bb;
let scale = 1, ox = 0, oy = 0, W = 0, H = 0, dpr = 1, minScale = 1;
function fit(){ const s = Math.min(W/(bx1-bx0), H/(by1-by0)) * .95; scale = minScale = s; ox = (W - (bx1-bx0)*s)/2 - bx0*s; oy = (H - (by1-by0)*s)/2 - by0*s; }
// telefono (≤ 600 px): la mappa arriva fino alla linguetta del pannello, anche con la tastiera aperta (visualViewport)
const PHONE = window.matchMedia ? matchMedia('(max-width:600px)') : null, isPhone = () => !!(PHONE && PHONE.matches);
function fitBox(){ if(!isPhone()){ box.style.height = ''; return; } const vh = window.visualViewport ? visualViewport.height : innerHeight, top = box.getBoundingClientRect().top + (window.scrollY||0); box.style.height = Math.max(220, Math.round(vh - top - 66)) + 'px'; }
function resize(){ fitBox(); dpr = window.devicePixelRatio||1; const pw = W, ph = H, ps = minScale; W = box.clientWidth; H = box.clientHeight; cv.width = W*dpr; cv.height = H*dpr; if(!pw){ fit(); } else { const cx = (pw/2-ox)/scale, cy = (ph/2-oy)/scale, ratio = scale/ps; fit(); scale = minScale*ratio; ox = W/2-cx*scale; oy = H/2-cy*scale; } draw(); }
let raf = 0; function draw(){ if(raf) return; raf = requestAnimationFrame(()=>{ raf = 0; render(); }); }
function render(){
  ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,W,H);
  ctx.setTransform(dpr*scale,0,0,dpr*scale,dpr*ox,dpr*oy);
  const cs = getComputedStyle(document.documentElement);
  const unf = cs.getPropertyValue('--unf').trim(), stroke = cs.getPropertyValue('--stroke').trim();
  ctx.lineWidth = Math.max(0.35/scale, Math.min(1.2/scale, 0.6/scale*Math.max(1,scale/minScale/6))); ctx.strokeStyle = stroke; ctx.lineJoin = 'round';
  const showAll = gaveUp;
  for(let i=0;i<N;i++){
    if(found[i]) ctx.fillStyle = PAL[D.r[i]];
    else if(showAll) ctx.fillStyle = PAL[D.r[i]] + '80';
    else ctx.fillStyle = unf;
    ctx.fill(paths[i]); ctx.stroke(paths[i]);
  }
  ctx.lineJoin='round'; ctx.lineWidth = 1.1/scale; ctx.strokeStyle = cs.getPropertyValue('--pline').trim(); ctx.stroke(provPath);
  ctx.lineWidth = 4.5/scale; ctx.strokeStyle = cs.getPropertyValue('--rhalo').trim(); ctx.stroke(regPath);
  ctx.lineWidth = 2/scale; ctx.strokeStyle = cs.getPropertyValue('--rline').trim(); ctx.stroke(regPath);
  if(flash>=0){ ctx.lineWidth = 2.5/scale; ctx.strokeStyle = '#fff'; ctx.stroke(paths[flash]); ctx.lineWidth = 1.2/scale; ctx.strokeStyle = '#000'; ctx.stroke(paths[flash]); }
}
function zoomAt(f,cx,cy){ hideInfo(); const ns = Math.max(minScale*.9, Math.min(minScale*400, scale*f)); const k = ns/scale; ox = cx-(cx-ox)*k; oy = cy-(cy-oy)*k; scale = ns; draw(); }
cv.addEventListener('wheel',e=>{ e.preventDefault(); const r = cv.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY*0.0015), e.clientX-r.left, e.clientY-r.top); },{passive:false});
$('zi').onclick = ()=>zoomAt(1.6,W/2,H/2); $('zo').onclick = ()=>zoomAt(1/1.6,W/2,H/2); $('zr').onclick = ()=>{ fit(); draw(); };
const ptrs = new Map(); let lastPinch = 0, moved = 0;
cv.addEventListener('pointerdown',e=>{ cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId,[e.clientX,e.clientY]); moved = 0; lastPinch = 0; hideInfo(); cv.style.cursor='grabbing'; });
cv.addEventListener('pointerup',e=>{ const single = ptrs.size===1 && !lastPinch && moved<6; ptrs.delete(e.pointerId); cv.style.cursor='grab'; if(single){ const r = cv.getBoundingClientRect(); clickAt(e.clientX-r.left, e.clientY-r.top); } });
cv.addEventListener('pointercancel',e=>ptrs.delete(e.pointerId));
cv.addEventListener('pointermove',e=>{
  const r = cv.getBoundingClientRect();
  if(ptrs.has(e.pointerId)){
    const p = ptrs.get(e.pointerId);
    if(ptrs.size===1){ ox += e.clientX-p[0]; oy += e.clientY-p[1]; moved += Math.abs(e.clientX-p[0])+Math.abs(e.clientY-p[1]); ptrs.set(e.pointerId,[e.clientX,e.clientY]); draw(); }
    else if(ptrs.size===2){ ptrs.set(e.pointerId,[e.clientX,e.clientY]); const [a,b] = [...ptrs.values()]; const dist = Math.hypot(a[0]-b[0],a[1]-b[1]); if(lastPinch) zoomAt(dist/lastPinch,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top); lastPinch = dist; }
  } else hover(e.clientX-r.left, e.clientY-r.top);
});
cv.addEventListener('pointerleave',()=>$('tip').style.display='none');
const hc = document.createElement('canvas').getContext('2d');
function hover(x,y){
  const tip = $('tip'); const wx = (x-ox)/scale, wy = (y-oy)/scale; let hit = -1;
  for(let i=0;i<N;i++){ if(hc.isPointInPath(paths[i],wx,wy,'evenodd')){ hit = i; break; } }
  if(hit>=0 && (found[hit]||gaveUp)){ tip.textContent = D.n[hit] + ' (' + D.p[hit] + ')'; tip.style.display='block'; tip.style.left = Math.min(x+14,W-160)+'px'; tip.style.top = (y+14)+'px'; }
  else tip.style.display='none';
}
function bboxOf(i){ let x=0,y=0,mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9; for(const seg of D.d[i].split('z').filter(Boolean)){ const m = seg.match(/^M(-?\d+) (-?\d+)l?(.*)$/); x=+m[1]; y=+m[2]; const pts=[[x,y]]; if(m[3]){ const v = m[3].trim().split(' ').map(Number); for(let k=0;k+1<v.length;k+=2){ x+=v[k]; y+=v[k+1]; pts.push([x,y]); } } for(const [a,b] of pts){ mnx=Math.min(mnx,a);mxx=Math.max(mxx,a);mny=Math.min(mny,b);mxy=Math.max(mxy,b); } } return [mnx,mny,mxx,mxy]; }
let anim = 0;
function ensureVisible(i){
  const [a,b,c,d] = bboxOf(i);
  const x0 = a*scale+ox, x1 = c*scale+ox, y0 = b*scale+oy, y1 = d*scale+oy;
  if(x1 > 0 && x0 < W && y1 > 0 && y0 < H) return;
  const tx = W/2-(a+c)/2*scale, ty = H/2-(b+d)/2*scale, sx = ox, sy = oy, st = performance.now(), dur = 450;
  cancelAnimationFrame(anim);
  const step = now => { const t = Math.min(1,(now-st)/dur), e = 1-Math.pow(1-t,3); ox = sx+(tx-sx)*e; oy = sy+(ty-sy)*e; render(); if(t<1) anim = requestAnimationFrame(step); };
  anim = requestAnimationFrame(step);
}
const info = document.createElement('div'); info.style.cssText = 'position:absolute;display:none;background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:13px;max-width:240px;box-shadow:0 4px 14px rgba(0,0,0,.25);z-index:5'; box.appendChild(info);
function hideInfo(){ info.style.display = 'none'; if(flash>=0){ flash = -1; draw(); } }
function pick(x,y){ const wx = (x-ox)/scale, wy = (y-oy)/scale; for(let i=0;i<N;i++){ if(hc.isPointInPath(paths[i],wx,wy,'evenodd')) return i; } return -1; }
function clickAt(x,y){
  hideInfo(); const i = pick(x,y); if(i<0) return;
  const base = D.n[i].split('/')[0], reg = D.regs[D.r[i]].split('/')[0], letters = base.replace(/[^A-Za-z\u00C0-\u00FF]/g,'').length;
  flash = i; draw();
  const known = found[i]||gaveUp, fact = D.fact.get(i);
  if(known){ info.innerHTML = '<b>'+D.n[i]+'</b> ('+D.p[i]+') · '+reg+'<div style="color:var(--muted)">👥 '+fmtN(D.pop[i])+' abitanti · 💎 '+RAR[i]+' punti rarità</div>'; }
  else { info.innerHTML = '<div style="color:var(--muted)">'+reg+' · '+D.p[i]+'</div><div id="infoMain">Non ancora trovato · inizia con «'+base[0]+'» · '+letters+' lettere</div><button id="reveal" style="margin-top:6px;padding:4px 10px">Rivela nome</button>'; info.querySelector('#reveal').onclick = ()=>{ info.querySelector('#infoMain').innerHTML = '<b>'+base+'</b>'; info.querySelector('#reveal').remove(); }; }
  // curiosità chiusa in un menu: prima di indovinare fa da indizio (il testo non contiene il nome), dopo resta da leggere
  if(fact){ const det = document.createElement('details'); det.className = 'fact'; det.innerHTML = '<summary>'+(known ? '💡 Curiosità' : '💡 Indizio: una curiosità')+'</summary><p></p>'; det.querySelector('p').textContent = fact; det.ontoggle = ()=>placeInfo(x,y); info.appendChild(det); }
  info.style.display = 'block'; placeInfo(x,y);
}
// il riquadro resta dentro la mappa anche quando la curiosità si apre
function placeInfo(x,y){ info.style.left = Math.max(6,Math.min(x+12,W-info.offsetWidth-6))+'px'; info.style.top = Math.max(6,Math.min(y+12,H-info.offsetHeight-6))+'px'; }
function zoomTo(i){
  const c = document.createElement('canvas').getContext('2d'); // bbox via path sampling
  const s = D.d[i]; const nums = s.split(/[Mlz ]+/).filter(Boolean).map(Number); let x=0,y=0,mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9, first = true;
  const segs = s.split('z').filter(Boolean);
  for(const seg of segs){ const m = seg.match(/^M(-?\d+) (-?\d+)l?(.*)$/); x=+m[1]; y=+m[2]; const pts=[[x,y]]; if(m[3]){ const v = m[3].trim().split(' ').map(Number); for(let k=0;k+1<v.length;k+=2){ x+=v[k]; y+=v[k+1]; pts.push([x,y]); } } for(const [a,b] of pts){ mnx=Math.min(mnx,a);mxx=Math.max(mxx,a);mny=Math.min(mny,b);mxy=Math.max(mxy,b); } }
  const w = Math.max(mxx-mnx,1), h = Math.max(mxy-mny,1);
  const ns = Math.min(minScale*30, Math.max(minScale*2, Math.min(W/(w*14), H/(h*14)))); scale = ns;
  ox = W/2 - (mnx+mxx)/2*ns; oy = H/2 - (mny+mxy)/2*ns;
}

// ---- quiz ----
const regCount = new Array(D.regs.length).fill(0), regTot = new Array(D.regs.length).fill(0), regLists = D.regs.map(()=>[]);
D.r.forEach(r=>regTot[r]++);
const regAll = D.regs.map(()=>[]); D.r.forEach((r,i)=>regAll[r].push(i));
function buildSide(){
  $('regs').innerHTML = D.regs.map((r,k)=>`<details class="reg" id="rg${k}"><summary><span class="dot" style="background:${PAL[k]}"></span><span class="rn">${r.split('/')[0]}</span><span class="pc" id="rp${k}">0%</span><span class="c" id="rc${k}">0/${regTot[k]}</span><span class="rbar"><i id="rb${k}" style="background:${PAL[k]}"></i></span></summary><div id="rl${k}"></div></details>`).join('');
}
const PN = {"TO":"Torino","VC":"Vercelli","NO":"Novara","CN":"Cuneo","AT":"Asti","AL":"Alessandria","AO":"Valle d'Aosta","IM":"Imperia","SV":"Savona","GE":"Genova","SP":"La Spezia","VA":"Varese","CO":"Como","SO":"Sondrio","MI":"Milano","BG":"Bergamo","BS":"Brescia","PV":"Pavia","CR":"Cremona","MN":"Mantova","BZ":"Bolzano","TN":"Trento","VR":"Verona","VI":"Vicenza","BL":"Belluno","TV":"Treviso","VE":"Venezia","PD":"Padova","RO":"Rovigo","UD":"Udine","GO":"Gorizia","TS":"Trieste","PC":"Piacenza","PR":"Parma","RE":"Reggio nell'Emilia","MO":"Modena","BO":"Bologna","FE":"Ferrara","RA":"Ravenna","FC":"Forlì-Cesena","PU":"Pesaro e Urbino","AN":"Ancona","MC":"Macerata","AP":"Ascoli Piceno","MS":"Massa-Carrara","LU":"Lucca","PT":"Pistoia","FI":"Firenze","LI":"Livorno","PI":"Pisa","AR":"Arezzo","SI":"Siena","GR":"Grosseto","PG":"Perugia","TR":"Terni","VT":"Viterbo","RI":"Rieti","RM":"Roma","LT":"Latina","FR":"Frosinone","CE":"Caserta","BN":"Benevento","NA":"Napoli","AV":"Avellino","SA":"Salerno","AQ":"L'Aquila","TE":"Teramo","PE":"Pescara","CH":"Chieti","CB":"Campobasso","FG":"Foggia","BA":"Bari","TA":"Taranto","BR":"Brindisi","LE":"Lecce","PZ":"Potenza","MT":"Matera","CS":"Cosenza","CZ":"Catanzaro","RC":"Reggio Calabria","TP":"Trapani","PA":"Palermo","ME":"Messina","AG":"Agrigento","CL":"Caltanissetta","EN":"Enna","CT":"Catania","RG":"Ragusa","SR":"Siracusa","PN":"Pordenone","IS":"Isernia","BI":"Biella","LC":"Lecco","LO":"Lodi","RN":"Rimini","PO":"Prato","KR":"Crotone","VV":"Vibo Valentia","VB":"Verbano-Cusio-Ossola","MB":"Monza e della Brianza","FM":"Fermo","BT":"Barletta-Andria-Trani","SS":"Sassari","OT":"Gallura Nord-Est Sardegna","NU":"Nuoro","OR":"Oristano","OG":"Ogliastra","VS":"Medio Campidano","CA":"Cagliari","CI":"Sulcis Iglesiente"};
// Città metropolitane secondo ISTAT (dal 1° gennaio 2026 anche Sassari); scripts/check_istat.py controlla che l'elenco sia aggiornato.
const CM = new Set(['BA','BO','CA','CT','FI','GE','ME','MI','NA','PA','RC','RM','SS','TO','VE']);
const provLabel = p => (CM.has(p) ? 'Città metropolitana di ' : 'Provincia di ') + (PN[p]||p);
const provTot = {}; D.p.forEach(p => provTot[p] = (provTot[p]||0)+1);
const regProvs = D.regs.map(()=>new Set()); D.r.forEach((r,i)=>regProvs[r].add(D.p[i]));
const openProv = new Set();
function updateReg(k){
  $('rc'+k).textContent = regCount[k]+'/'+regTot[k]; $('rp'+k).textContent = pct(regCount[k],regTot[k]); $('rb'+k).style.width = (100*regCount[k]/regTot[k])+'%';
  const by = {}; (gaveUp ? regAll[k] : regLists[k]).forEach(i => (by[D.p[i]] = by[D.p[i]]||[]).push(i));
  const provs = [...regProvs[k]].sort((a,b)=>(PN[a]||a).localeCompare(PN[b]||b,'it'));
  $('rl'+k).innerHTML = provs.map(p => {
    const arr = by[p]||[], nm = PN[p]||p, f = provFound[p]||0, cnt = f+'/'+provTot[p], bar = `<span class="pbar"><i style="width:${100*f/provTot[p]}%;background:${PAL[k]}"></i></span>`;
    if(!arr.length) return `<div class="prov0"><span>${nm}</span>${bar}<span class="c">${cnt}</span></div>`;
    const lis = arr.slice().sort((a,b)=>D.n[a].localeCompare(D.n[b],'it')).map(i=>`<li data-i="${i}"${found[i]?'':' class="miss"'}>${D.n[i].split('/')[0]}</li>`).join('');
    return `<details class="prov" data-p="${p}"${openProv.has(p)?' open':''}><summary><span>${nm}</span>${bar}<span class="c">${cnt}</span></summary><ul>${lis}</ul></details>`;
  }).join('');
  sortRegs();
}
// Percentuale leggibile: "<1%" appena si trova qualcosa, 100% solo a regione completa
const pct = (f,t) => f===t ? '100%' : f && 100*f/t < 1 ? '<1%' : Math.floor(100*f/t)+'%';
// Ordine delle regioni: alfabetico, per percentuale o per comuni mancanti (via CSS order, senza ridisegnare)
let regSort = 'az';
function sortRegs(){
  const key = { az: k=>k, pct: k=>-regCount[k]/regTot[k], miss: k=>regTot[k]-regCount[k] }[regSort];
  [...REGK0].sort((a,b)=>key(a)-key(b) || a-b).forEach((k,o)=>{ const el = $('rg'+k); if(el) el.style.order = o; });
}
const REGK0 = D.regs.map((_,k)=>k);
document.querySelectorAll('#regsort button').forEach(b => b.onclick = () => { regSort = b.dataset.s; document.querySelectorAll('#regsort button').forEach(x => x.setAttribute('aria-pressed', x===b)); sortRegs(); });
$('regs').addEventListener('toggle', e => { const el = e.target; if(el.classList && el.classList.contains('prov')){ el.open ? openProv.add(el.dataset.p) : openProv.delete(el.dataset.p); } }, true);
$('regs').addEventListener('click',e=>{ const li = e.target.closest('li'); if(li){ const i = +li.dataset.i; flash = i; draw(); setTimeout(()=>{ flash=-1; draw(); },1800); } });
function addFound(i){ if(found[i]) return false; found[i] = 1; foundCount++; const k = D.r[i]; regCount[k]++; regLists[k].push(i); provFound[D.p[i]] = (provFound[D.p[i]]||0)+1; popFound += D.pop[i]; rarFound += RAR[i]; BG.forEach((b,j)=>{ if(D.pop[i]<b.lim) bgFound[j]++; }); if(CO.has(i)){ coastFound++; coastRegFound[D.r[i]]++; } coastStep(i); walkStep(i); return true; }
const provFound = {}; let popFound = 0, rarFound = 0;
// Rarità: più il comune è piccolo più punti vale, 10·log10(abitanti di Roma / abitanti), almeno 1 (Roma 1, Milano 3, metà dei comuni oltre 31, Morterone 49)
const PMAX = Math.max(...D.pop), RAR = D.pop.map(x => Math.max(1, Math.round(10*Math.log10(PMAX/x)))); const POP = D.pop.reduce((a,b)=>a+b,0), fmtN = n => n.toLocaleString('it-IT');
const CO = new Set(D.co), coastRegFound = D.regs.map(()=>0), coastRegTot = D.regs.map(()=>0); let coastFound = 0; D.co.forEach(i=>coastRegTot[D.r[i]]++);
const CMS = [[10,'Primi bagni'],[50,'Lupo di mare'],[100,'Marinaio'],[250,'Capitano'],[Math.ceil(CO.size*.5),'Mezza costa'],[CO.size,'Tutta la costa italiana!']].sort((a,b)=>a[0]-b[0]);
const MS = [[1,'Primo passo'],[10,'Si comincia'],[100,'Cento comuni'],[500,'Cinquecento'],[666,'Il numero della bestia'],[1000,'Mille comuni'],[Math.ceil(N*.25),'Un quarto d’Italia'],[Math.ceil(N*.5),'Metà Italia'],[Math.ceil(N*.75),'Tre quarti d’Italia'],[5000,'Cinquemila'],[N,'Tutta l’Italia!']].sort((a,b)=>a[0]-b[0]);
// Traguardi segreti: nascosti nell'elenco finché non si sbloccano. [soglia, nome, icona, testo dell'avviso]
const SEC = [[69,'Nice.','😏','Nice.'],[420,'Blaze it','🌿','420 comuni. Blaze it.']];
// Occhiolini segreti: n risposte giuste di fila sullo stesso tema (un nome con più comuni conta una volta); id sw:<chiave>, salvati con le sfide.
const wkName = i => ' '+D.n[i].split('/')[0].normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’-]/g,' ')+' ';
// comuni che sono parole di tutti i giorni (colori, oggetti, numeri, piante…): controllati su map.json, niente nomi che sono solo città (Bari, Torino)
// parole di Elementare divise per tema (solo per l'elenco nei Segreti, che mostra solo le parole trovate)
const PAROLEG = [
  ['🎨','Colori e aspetto',['Alto','Amaro','Bella','Bianco','Bruno','Calvi','Grosso','Riccia','Rossa','Vasto','Vermiglio','Viola']],
  ['🔢','Numeri e tempo',['Alba','Cento','Mese','Nove','Ora','Quarto','Quindici','Sesto','Terzo','Tramonti']],
  ['🐾','Animali',['Capriolo','Cavallino','Cervo','Cicala','Manta','Toro']],
  ['🌸','Piante e frutti',['Erba','Frassino','Ginestra','Mele','Noci','Pero','Pesche','Pigna','Rose']],
  ['⛰️','Paesaggio',['Canale','Cave','Fonte','Grotte','Laghi','Lago','Monti','Pizzo','Prato','Rive','Serre','Spiazzo','Stella','Tufo']],
  ['🏠','Casa e paese',['Altare','Arena','Badia','Camino','Cascina','Castelli','Chiusa','Colonna','Contrada','Ferriere','Fornace','Fortezza','Lavello','Macello','Mura','Paese','Ponte','Ponti','Porte','Scala','Taverna','Torretta']],
  ['🧰','Oggetti',['Arco','Barile','Campana','Candela','Carbone','Carro','Lana','Lavagna','Nave','Penne','Piatto','Pila','Sacco','Sale','Volano']],
  ['💬','Parole varie',['Ala','Calcio','Fondi','Lettere','Massa','Nomi','Ossi','Re','Vita']],
];
const PAROLE = new Set(PAROLEG.flatMap(g=>g[2]));
const PARI = new Map([...PAROLE].map(w=>[w, D.n.map((nm,i)=>nm.split('/')[0]===w ? i : -1).filter(i=>i>=0)]));
// Divinità nel nome (elenco fisso: Martello, Ceresole o Serdiana contengono le lettere solo per caso)
const DEI = new Set(['Giove','Collegiove','Campo di Giove','Casagiove','Portovenere','Castelvenere','Giano dell\'Umbria','Giano Vetusto','Nettuno','Spigno Saturnia','Cefalà Diana','Minervino Murge','Minervino di Lecce','Ercolano']);
// Laghi: comuni con lo stesso identico nome di un lago (Garda sì, Castelnuovo del Garda no); categoria Laghi, id lg:<quanti>
const LAGHI = new Set(['Alserio','Andalo','Avigliana','Barrea','Bolsena','Bomba','Bracciano','Caldonazzo','Campotosto','Cavedine','Chiusi','Cingoli','Comabbio','Como','Dobbiaco','Fiastra','Fondi','Garda','Garlate','Idro','Iseo','Lago','Lavarone','Ledro','Lesina','Mergozzo','Molveno','Montepulciano','Montorfano','Nemi','Olginate','Orbetello','Penne','Posada','Pusiano','Scanno','Tenno','Varese','Viverone']);
const LG = D.n.map((nm,i)=>LAGHI.has(nm.split('/')[0]) ? i : -1).filter(i=>i>=0), LGS = [5, 15, LG.length], LGSET = new Set(LG);
const WINKS = [
  { k:'santi', ic:'📈', l:'Jesus increasing', n:5, fit: i => / (san|santo|santa|santi|sant) /.test(wkName(i)), t:'Jesus increasing', d:'Cinque santi di fila.' },
  { k:'gallo', ic:'🐓', l:'Urca tirulero', n:3, fit: i => /gall/.test(wkName(i)), t:'Robin Hood e Little John van per la foresta\nEd ognun con l’altro ride e scherza come vuol\nSon felici del successo delle loro gesta\nUrca urca tirulero oggi splende il sol', d:'Tre comuni «gall…» di fila: galli, Gallipoli, Galliera…' },
  { k:'cervi', ic:'🦌', l:'310 gradi', n:3, fit: i => / cerv/.test(wkName(i)), t:'Tre cervi di fila. Un cervo vede quasi a 310 gradi, ma anche noi ti abbiamo visto.', d:'Tre cervi di fila.' },
  { k:'dei', ic:'🔱', l:'Olimpo', n:3, fit: i => DEI.has(D.n[i].split('/')[0]), t:'Only Giano can judge me.', d:'Tre comuni con il nome di una divinità, di fila.' },
  { k:'parole', ic:'💬', l:'Elementare', n:3, fit: i => PAROLE.has(D.n[i].split('/')[0]), t:'Bravo. Ora passiamo alle parole con più di tre sillabe, va bene?', d:'Tre comuni che sono parole di tutti i giorni, di fila.' },
].map(w => Object.assign(w, { id: 'sw:'+w.k, run: 0 }));
// Traguardi sulle persone "beccate" (abitanti dei comuni trovati, ISTAT 2025): percentuali della popolazione; id pp<percentuale>.
const PPS = [[1,'Un italiano su cento'],[10,'Un italiano su dieci'],[25,'Un quarto degli italiani'],[50,'Metà degli italiani'],[75,'Tre quarti degli italiani'],[100,'Tutti gli italiani']].map(([q,l])=>[q,l,Math.ceil(POP*q/100)]);
const ISL = D.isl, islOf = new Map(); ISL.forEach((g,gi)=>g[1].forEach(i=>{ if(!islOf.has(i)) islOf.set(i,[]); islOf.get(i).push(gi); }));
const islFound = g => g[1].filter(i=>found[i]).length, islDone = g => g[1].every(i=>found[i]);
const PT = {}; Object.keys(provTot).forEach(p=>{ const T = provTot[p]; if(T>=4) PT[p] = [Math.ceil(T*.25),Math.ceil(T*.5)]; });
const NP = Object.keys(provTot).length, provsTouched = () => Object.keys(provFound).length, regsTouched = () => regCount.filter(x=>x>0).length;
// Capoluoghi (anche co-capoluoghi) e comuni da record, da data/extra.json
const CAPS = new Set(D.cap), capFound = () => D.cap.filter(i=>found[i]).length;
// Grandi città (comuni con almeno 100.000 / 50.000 abitanti, id big:<soglia>) e comuni più estesi (D.ext: i 100 più grandi per superficie, id ext:<quanti>)
const BIGS = [100000, 50000].map(lim => ({ lim, list: D.pop.map((x,i)=>x>=lim ? i : -1).filter(i=>i>=0) }));
const POPORD = D.pop.map((_,i)=>i).sort((a,b)=>D.pop[b]-D.pop[a] || a-b);
const POPS = [10, 25, 50, 100].map(n => ({ n, list: POPORD.slice(0, n) })), POPSET = new Set(POPS[3].list);
const EXTS = [10, 25, 50, 100].map(n => ({ n, list: D.ext.slice(0, n) })), EXT = new Set(D.ext);
const nFound = list => list.filter(i=>found[i]).length;
// Borghi più belli d'Italia (data/borghi.json): passi nazionali e un traguardo per regione
const BBR = D.bpb.reg, BB = BBR.flatMap(([,a])=>a), BBSET = new Set(BB), BBS = [10,50,100,200].filter(n=>n<BB.length).concat([BB.length]);
const bbName = i => regName0(i)+(D.bpb.fraz.has(i) ? ' ('+D.bpb.fraz.get(i)+')' : '');
const BBAGG = new Date(D.bpb.agg+'T12:00:00').toLocaleDateString('it-IT',{ day:'numeric', month:'long', year:'numeric' });
// Nomi: lunghezza in lettere (senza spazi, apostrofi e trattini; per i nomi bilingui vale la parte italiana); id nm:<k>
const NLEN = D.n.map(nm => (nm.split('/')[0].match(/\p{L}/gu) || []).length);
const NBYLEN = D.n.map((_,i)=>i).sort((a,b)=>NLEN[b]-NLEN[a] || a-b), NL10 = NLEN[NBYLEN[9]];
const NMS = [
  { k:'lungo', l:'Il nome più lungo', list: NBYLEN.filter(i=>NLEN[i]===NLEN[NBYLEN[0]]) },
  // almeno 10, a parità di lettere entrano tutti (oggi 11: si contano anche Š, č, ž)
  { k:'l10', list: NBYLEN.filter(i=>NLEN[i]>=NL10) },
  { k:'2', l:'Due lettere', list: NBYLEN.filter(i=>NLEN[i]<=2) },
  { k:'3', l:'Tre lettere o meno', list: NBYLEN.filter(i=>NLEN[i]<=3) },
].map(x => Object.assign(x, { id: 'nm:'+x.k, l: x.l || ([8,11].includes(x.list.length) ? 'Gli ' : 'I ')+x.list.length+' nomi più lunghi' })), NMSET = new Set(NMS.flatMap(x=>x.list));
// ---- geografia (data/geo.json) ----
// NB[i]: comuni confinanti; MAIN[i]: comune della penisola (non su un'isola); RADJ[k]: regioni confinanti sulla penisola; MREGN: regioni della penisola (18)
const NB = D.n.map(()=>[]); D.nb.forEach((ds,i)=>ds.forEach(dj=>{ NB[i].push(i+dj); NB[i+dj].push(i); }));
const INS = new Set(D.ins), MAIN = D.n.map((_,i)=>!INS.has(i)), rn = k => D.regs[k].split('/')[0];
const RADJ = D.regs.map(()=>new Set()); NB.forEach((a,i)=>a.forEach(j=>{ if(MAIN[i] && MAIN[j] && D.r[i]!==D.r[j]) RADJ[D.r[i]].add(D.r[j]); }));
const MREGN = new Set(D.r.filter((_,i)=>MAIN[i])).size, bits = x => { let c = 0; while(x){ x &= x-1; c++; } return c; };
const find = (P,x) => { while(P[x]!==x){ P[x] = P[P[x]]; x = P[x]; } return x; };
// Da costa a costa: gruppi di comuni dell'entroterra trovati e confinanti (union-find ccP); per ogni gruppo i mari raggiunti
// da un comune costiero trovato che lo tocca (ccM, bit per mare) e un esempio di comune per mare (ccE). Si ricava dai comuni trovati.
const SEAL = 'LTIACS', CC = [['T','A'],['A','I'],['I','T'],['L','A'],['L','T'],['L','I'],['T','C'],['I','C'],['T','S']].map(([a,b])=>{ const x = SEAL.indexOf(a), y = SEAL.indexOf(b); return { id:'cc:'+a+b, x, y, l: D.seas[x]+' – '+D.seas[y] }; });
const ccP = new Int32Array(N).fill(-1), ccM = new Int32Array(N), ccE = new Map(), ccDone = new Map();
function ccAdd(r,s,i){ ccM[r] |= 1<<s; const e = ccE.get(r); if(e[s]<0) e[s] = i; }
function ccUnion(a,b){ a = find(ccP,a); b = find(ccP,b); if(a===b) return a; ccP[b] = a; ccM[a] |= ccM[b]; const ea = ccE.get(a), eb = ccE.get(b); ea.forEach((v,k)=>{ if(v<0) ea[k] = eb[k]; }); ccE.delete(b); return a; }
function ccTouch(r){ CC.forEach(c=>{ if(!ccDone.has(c.id) && (ccM[r]>>c.x&1) && (ccM[r]>>c.y&1)) ccDone.set(c.id, [ccE.get(r)[c.x], ccE.get(r)[c.y]]); }); }
function coastStep(i){
  if(CO.has(i)){ NB[i].forEach(j=>{ if(ccP[j]>=0){ const r = find(ccP,j); ccAdd(r,D.sea[i],i); ccTouch(r); } }); return; }
  ccP[i] = i; ccE.set(i, D.seas.map(()=>-1)); let r = i;
  NB[i].forEach(j=>{ if(ccP[j]>=0) r = ccUnion(r,j); else if(found[j] && CO.has(j)) ccAdd(find(ccP,r),D.sea[j],j); });
  ccTouch(find(ccP,r));
}
// Italia a piedi: gruppi di comuni della penisola trovati e confinanti, capoluoghi compresi (union-find wkP), con le regioni toccate (wkM);
// wkBest/wkBestM: regioni del gruppo migliore
// vale WALKW obiettivi nel totale (è di gran lunga il più difficile)
const wkP = new Int32Array(N).fill(-1), wkM = new Int32Array(N), WALKW = 10; let wkBest = 0, wkBestM = 0;
function walkStep(i){
  if(!MAIN[i]) return; wkP[i] = i; wkM[i] = 1<<D.r[i];
  NB[i].forEach(j=>{ if(wkP[j]>=0){ const b = find(wkP,j); if(b!==i){ wkP[b] = i; wkM[i] |= wkM[b]; } } });
  const n = bits(wkM[i]); if(n > wkBest){ wkBest = n; wkBestM = wkM[i]; }
}
// Giri a tappe: conta l'ordine delle risposte. Ogni tappa è un comune della penisola che non sia capoluogo (allowed), nella stessa unità
// (regione o provincia) della tappa precedente o in una confinante; si può tornare in unità già toccate. Un capoluogo, un comune delle
// isole o un salto interrompono il giro. Stato: last (unità dell'ultima tappa o null) e seen (unità toccate), salvati in comuniQuizV1.tr
const allowed = i => MAIN[i] && !CAPS.has(i);
const PADJ = {}; NB.forEach((a,i)=>a.forEach(j=>{ if(MAIN[i] && MAIN[j] && D.p[i]!==D.p[j]) (PADJ[D.p[i]] = PADJ[D.p[i]] || new Set()).add(D.p[j]); }));
const MPROVN = new Set(D.p.filter((_,i)=>MAIN[i])).size;
// In pausa finché scrivendo un nome più lungo (Castrocaro Terme) si prende prima quello più corto (Castro), che interrompe il giro:
// con TOURS_ON = false i giri non si vedono e non contano, ma un giro salvato (tr) e gli id giro/giroP restano nel salvataggio
const TOURS_ON = false;
const TOURS = [
  { id:'giro', ic:'🚴', l:'Giro d’Italia a tappe', unit: i => D.r[i], adj: k => RADJ[k], total: MREGN, name: rn, many:'regioni', every: 1, breakAt: 3 },
  { id:'giroP', ic:'🚲', l:'Giro delle province a tappe', unit: i => D.p[i], adj: q => PADJ[q], total: MPROVN, name: q => PN[q]||q, many:'province', every: 10, breakAt: 5 },
].filter(() => TOURS_ON).map(t => Object.assign(t, { last: null, seen: new Set() }));
let trKept = null;   // con i giri spenti: il valore tr letto dal salvataggio, riscritto così com'è
function tourStep(t, added){
  const ok = added.filter(allowed);
  const next = t.last===null ? [] : ok.filter(i => t.unit(i)===t.last || t.adj(t.last).has(t.unit(i)));
  const i = next.find(j => !t.seen.has(t.unit(j))) ?? next[0];
  if(i !== undefined){
    const u = t.unit(i), isNew = !t.seen.has(u); t.last = u; t.seen.add(u);
    const n = t.seen.size;
    if(!isNew) return;
    if(n === t.total){ if(!earned.has(t.id)){ earned.add(t.id); unlocked.add(t.id); toast(t.ic, t.l+': tutte le '+t.total+' '+t.many+' della penisola, senza salti!'); } }
    else if(n >= 2 && n % t.every === 0) toast(t.ic, t.l+': '+t.name(u)+', '+n+'/'+t.total+' '+t.many);
    return;
  }
  const n = t.seen.size;
  if(n >= t.breakAt){ const j = ok[0] ?? added[0], why = ok.length ? 'da '+t.name(t.last)+' a '+t.name(t.unit(j))+' è un salto' : regName0(j)+(CAPS.has(j) ? ' è un capoluogo' : ' è su un’isola'); toast(t.ic, t.l+' interrotto dopo '+n+' '+t.many+': '+why); }
  t.last = ok.length ? t.unit(ok[0]) : null; t.seen = new Set(t.last===null ? [] : [t.last]);
}
// Testo di stato di un giro per il pannello: come iniziare, oppure ultima tappa, dove può andare la prossima e cosa manca
const byIt = (a,b) => a.localeCompare(b,'it');
// Cosa manca: l'elenco se è corto (fino a 8), altrimenti solo quante
const missing = (names, many) => names.length===1 ? 'Manca: '+names[0]+'.' : names.length<=8 && names[0]!==undefined ? 'Mancano: '+names.sort(byIt).join(', ')+'.' : 'Mancano '+names.length+' '+many+'.';
function tourStatus(t){
  if(t.last===null) return 'Per iniziare: scrivi un comune della penisola che non sia un capoluogo.';
  const n = t.seen.size, nextU = [t.last, ...t.adj(t.last)].map(t.name).sort(byIt).join(', ');
  const miss = t.id==='giro' ? missing(REGK.filter(k=>MAIN_REG.has(k) && !t.seen.has(k)).map(rn), 'regioni') : missing(Array(t.total-n), 'province');
  return 'In corso: '+n+'/'+t.total+', ultima tappa in '+t.name(t.last)+'. Prossima tappa in: '+nextU+'.'+(n<t.total ? ' '+miss : '');
}
const MAIN_REG = new Set(D.r.filter((_,i)=>MAIN[i]));
const REC = [['nord','⬆️','Il più a nord'],['sud','⬇️','Il più a sud'],['est','➡️','Il più a est'],['ovest','⬅️','Il più a ovest'],['grande','🗺️','Il più grande'],['piccolo','🔎','Il più piccolo'],['popoloso','🏙️','Il più popoloso'],['spopolato','🏚️','Il meno popoloso']];
const RECT = { nord:'il comune più a nord d’Italia', sud:'il comune più a sud d’Italia', est:'il comune più a est d’Italia', ovest:'il comune più a ovest d’Italia', grande:'il comune più grande d’Italia', piccolo:'il comune più piccolo d’Italia', popoloso:'il comune più popoloso d’Italia', spopolato:'il comune meno popoloso d’Italia' };
// Borghi: comuni sotto una soglia di abitanti; id b<soglia>:<quanti> (0 = tutti)
const BG = [[1000,'🏘️','Borghi','borghi'],[500,'🛖','Paesini','paesini'],[100,'🔬','Microcomuni','microcomuni']].map(([lim,ic,t,l])=>{ const tot = D.pop.filter(x=>x<lim).length; return { lim, ic, t, l, tot, steps: [10,100,500].filter(n=>n<tot).concat([tot]) }; });
const bgFound = BG.map(()=>0);
// Tesori: il comune meno popoloso di ogni provincia; id t<quanti>
const TES = new Map(); Object.keys(provTot).forEach(p=>{ let best = -1; D.p.forEach((q,i)=>{ if(q===p && (best<0 || D.pop[i]<D.pop[best])) best = i; }); TES.set(best, p); });
const TS = [10,50,TES.size], tesFound = () => [...TES.keys()].filter(i=>found[i]);
const RT = regTot.map(T=>[Math.ceil(T*.25),Math.ceil(T*.5)]);
const openAch = new Set();
const CAM = D.cam, camOf = new Map(); CAM.forEach((g,gi)=>g[1].forEach(i=>{ if(!camOf.has(i)) camOf.set(i,[]); camOf.get(i).push(gi); }));
// Gruppi a tema da groups.json (confini, repubbliche marinare, storia, minoranze linguistiche, stesso cognome): id <pre>:<gi>, sbloccati quando il gruppo è completo
const CONF = D.conf, CONFA = { 'Francia':'la Francia', 'Svizzera':'la Svizzera', 'Austria':'l’Austria', 'Slovenia':'la Slovenia', 'Città del Vaticano':'il Vaticano' };
const confTouched = () => CONF.filter(g=>g[1].some(i=>found[i])).length;
const MLG = D.min, minTouched = () => MLG.filter(g=>g[1].some(i=>found[i])).length;
const TG = [
  { pre:'f', ic:'🛂', list: CONF, label: g => 'Tutto il confine con '+(CONFA[g[0]]||g[0]) },
  { pre:'mr', ic:'⚓', list: D.mar, label: g => g[0] },
  { pre:'h', ic:'📜', list: D.sto, label: g => g[0] },
  { pre:'ml', ic:'🗣️', list: D.min, label: g => 'Minoranza '+g[0].toLowerCase() },
  { pre:'cg', ic:'🏷️', list: D.cog, label: g => g[0] },
];
const tgOf = new Map(); TG.forEach(t=>t.list.forEach((g,gi)=>g[1].forEach(i=>{ if(!tgOf.has(i)) tgOf.set(i,[]); tgOf.get(i).push([t,gi]); })));
// Sfide legate al momento della risposta: non si ricavano dai comuni trovati, quindi i loro id si salvano in comuniQuizV1.a
// Sfide a tempo: n comuni (che passano ok, raggruppati per key) entro ms di tempo di gioco; record personale salvato in comuniQuizV1.rb
const MIN = 60000, initial = i => norm(D.n[i].split('/')[0])[0];
const TIMED = [
  { id:'raffica', ic:'⚡', l:'Raffica', n:10, ms:MIN },
  { id:'raffica20', ic:'🔥', l:'Raffica doppia', n:20, ms:MIN },
  { id:'t50', ic:'⏱️', l:'Cinquanta in cinque', n:50, ms:5*MIN },
  { id:'t100', ic:'💯', l:'Cento in cinque', n:100, ms:5*MIN },
  { id:'t250', ic:'🏃', l:'Mezza maratona', n:250, ms:15*MIN },
  { id:'t500', ic:'🏅', l:'Maratona', n:500, ms:30*MIN },
  { id:'tcap', ic:'🎯', l:'Raffica di capoluoghi', n:10, ms:MIN, ok: i => CAPS.has(i), what:'capoluoghi di provincia' },
  { id:'tborg', ic:'🌾', l:'Raffica di borghi', n:10, ms:5*MIN, ok: i => D.pop[i] < 1000, what:'comuni sotto i 1.000 abitanti' },
  { id:'tlet', ic:'🔤', l:'Stessa lettera', n:10, ms:MIN, key: initial, what:'comuni con la stessa iniziale' },
].map(c => Object.assign(c, { q: new Map(), best: 0, span: c.ms===MIN ? 'un minuto' : (c.ms/MIN)+' minuti' }));
const CH = TIMED.map(c=>[c.id]).concat([['giro'],['giroP']], WINKS.map(w=>[w.id])), earned = new Set();
const unlocked = new Set(), toastQ = []; let toasting = false;
const toastEl = document.createElement('div'); toastEl.style.cssText = 'position:absolute;left:50%;bottom:16px;transform:translateX(-50%);background:var(--panel);color:var(--text);border:2px solid var(--accent);border-radius:10px;padding:8px 14px;font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.3);opacity:0;transition:opacity .3s;pointer-events:none;z-index:6;max-width:90%;text-align:center;white-space:pre-line'; box.appendChild(toastEl);
// festa per i 1000 comuni: scritta grande e coriandoli sulla mappa (solo la scritta se il sistema chiede meno movimento)
function celebrate(big){
  const el = document.createElement('div'); el.className = 'party'; el.setAttribute('aria-hidden','true');
  const still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, cols = ['#e6194b','#3cb44b','#d4a600','#4363d8','#f58231','#911eb4','#2aa5b8'];
  el.innerHTML = '<b>'+big+'</b>' + (still ? '' : Array.from({length:120},(_,k)=>`<i style="left:${Math.random()*100}%;background:${cols[k%cols.length]};animation-delay:${(Math.random()*.8).toFixed(2)}s;animation-duration:${(2.2+Math.random()*1.6).toFixed(2)}s;transform:rotate(${Math.random()*360|0}deg)"></i>`).join(''));
  box.appendChild(el); setTimeout(()=>el.remove(), 4500);
}
function toast(icon,text){ toastQ.push([icon,text]); if(!toasting) nextToast(); }
function nextToast(){ const q = toastQ.shift(); if(!q){ toasting = false; return; } toasting = true; toastEl.textContent = q[0]+' '+q[1]; toastEl.style.opacity = 1; setTimeout(()=>{ toastEl.style.opacity = 0; setTimeout(nextToast,350); },Math.max(2800, q[1].length*45)); }
function achInit(){ CAM.forEach((g,gi)=>{ if(islDone(g)) unlocked.add('w:'+gi); }); Object.keys(PT).forEach(p=>{ const f = provFound[p]||0; if(f>=PT[p][0]) unlocked.add('p25:'+p); if(f>=PT[p][1]) unlocked.add('p50:'+p); }); RT.forEach((x,k)=>{ if(regCount[k]>=x[0]) unlocked.add('r25:'+k); if(regCount[k]>=x[1]) unlocked.add('r50:'+k); }); ISL.forEach((g,gi)=>{ if(islDone(g)) unlocked.add('i:'+gi); }); CMS.forEach(([n])=>{ if(coastFound>=n) unlocked.add('c'+n); }); coastRegTot.forEach((tt,k)=>{ if(tt>0 && coastRegFound[k]===tt) unlocked.add('k:'+k); }); MS.forEach(([n])=>{ if(foundCount>=n) unlocked.add('m'+n); }); SEC.forEach(([n])=>{ if(foundCount>=n) unlocked.add('s'+n); }); PPS.forEach(([q,,n])=>{ if(popFound>=n) unlocked.add('pp'+q); }); Object.keys(provTot).forEach(p=>{ if(provFound[p]===provTot[p]) unlocked.add('p:'+p); }); D.regs.forEach((_,k)=>{ if(regCount[k]===regTot[k]) unlocked.add('r:'+k); }); if(provsTouched()===NP) unlocked.add('e:p'); if(regsTouched()===D.regs.length) unlocked.add('e:r'); if(capFound()===CAPS.size) unlocked.add('cap'); BIGS.forEach(b=>{ if(nFound(b.list)===b.list.length) unlocked.add('big:'+b.lim); }); POPS.forEach(p=>{ if(nFound(p.list)===p.n) unlocked.add('pop:'+p.n); }); EXTS.forEach(e=>{ if(nFound(e.list)===e.n) unlocked.add('ext:'+e.n); }); { const lf = nFound(LG); LGS.forEach(n=>{ if(lf>=n) unlocked.add('lg:'+n); }); } NMS.forEach(x=>{ if(nFound(x.list)===x.list.length) unlocked.add(x.id); }); BG.forEach((b,j)=>b.steps.forEach(n=>{ if(bgFound[j]>=n) unlocked.add('b'+b.lim+':'+n); })); { const tf = tesFound().length; TS.forEach(n=>{ if(tf>=n) unlocked.add('tes:'+n); }); } earned.forEach(id=>unlocked.add(id)); TG.forEach(t=>t.list.forEach((g,gi)=>{ if(islDone(g)) unlocked.add(t.pre+':'+gi); })); if(confTouched()===CONF.length) unlocked.add('f:giro'); if(minTouched()===MLG.length) unlocked.add('ml:giro'); REC.forEach(([k])=>{ if(found[D.rec[k]]) unlocked.add('x:'+k); }); ccDone.forEach((_,id)=>unlocked.add(id)); if(wkBest===MREGN) unlocked.add('walk'); { const bf = nFound(BB); BBS.forEach(n=>{ if(bf>=n) unlocked.add('bb:'+n); }); } BBR.forEach(([k,a])=>{ if(nFound(a)===a.length) unlocked.add('bb:r'+k); }); }
function winkCheck(added){
  WINKS.forEach(w=>{
    w.run = added.some(w.fit) ? w.run+1 : 0;
    if(w.run >= w.n && !earned.has(w.id)){ earned.add(w.id); unlocked.add(w.id); toast(w.ic, w.t); }
  });
}
// finestra mobile per ogni sfida (e gruppo): tempo di gioco, così una pausa non conta; gli omonimi contano uno per uno
function timedCheck(added){
  const now = Date.now()-t0;
  TIMED.forEach(c=>added.forEach(i=>{
    if(c.ok && !c.ok(i)) return;
    const k = c.key ? c.key(i) : '', q = c.q.get(k) || []; c.q.set(k, q);
    q.push(now); while(now-q[0] > c.ms) q.shift();
    c.best = Math.max(c.best, q.length);
    if(q.length >= c.n && !earned.has(c.id)){ earned.add(c.id); unlocked.add(c.id); toast(c.ic, c.l+': '+c.n+' '+(c.what||'comuni')+' in '+c.span+'!'); }
  }));
}
function achCheck(i){
  for(const [n,l] of MS){ const id = 'm'+n; if(foundCount>=n && !unlocked.has(id)){ unlocked.add(id); if(n===1000){ celebrate('1.000'); toast('🎉','Mille comuni! Un comune italiano su otto è già tuo.'); } else toast('🏆',l+' ('+n+')'); } }
  for(const [n,,ic,t] of SEC){ const id = 's'+n; if(foundCount>=n && !unlocked.has(id)){ unlocked.add(id); toast(ic,t); } }
  for(const [q,l,n] of PPS){ const id = 'pp'+q; if(popFound>=n && !unlocked.has(id)){ unlocked.add(id); toast('👥',l+' ('+q+'% della popolazione)'); } }
  if(CO.has(i)){
    for(const [n,l] of CMS){ const id = 'c'+n; if(coastFound>=n && !unlocked.has(id)){ unlocked.add(id); toast('🏖️',l+' (costa: '+n+')'); } }
    const kk = D.r[i]; if(coastRegFound[kk]===coastRegTot[kk] && !unlocked.has('k:'+kk)){ unlocked.add('k:'+kk); toast('🌊','Costa completata: '+D.regs[kk].split('/')[0]); }
  }
  (islOf.get(i)||[]).forEach(gi=>{ if(!unlocked.has('i:'+gi) && islDone(ISL[gi])){ unlocked.add('i:'+gi); toast('🏝️','Isole: '+ISL[gi][0]+' al completo!'); } });
  (camOf.get(i)||[]).forEach(gi=>{ if(!unlocked.has('w:'+gi) && islDone(CAM[gi])){ unlocked.add('w:'+gi); toast('🥾','Cammino completato: '+CAM[gi][0]); } });
  (tgOf.get(i)||[]).forEach(([t,gi])=>{ const g = t.list[gi], id = t.pre+':'+gi; if(!unlocked.has(id) && islDone(g)){ unlocked.add(id); toast(t.ic, t.label(g)+(g[2] ? ': '+g[2] : '!')); } });
  if(MLG.some(g=>g[1].includes(i)) && !unlocked.has('ml:giro') && minTouched()===MLG.length){ unlocked.add('ml:giro'); toast('🗣️','Giro delle minoranze: un comune per ogni minoranza linguistica!'); }
  if(CONF.some(g=>g[1].includes(i)) && !unlocked.has('f:giro') && confTouched()===CONF.length){ unlocked.add('f:giro'); toast('🛂','Giro delle frontiere: un comune al confine con ogni Stato vicino!'); }
  const p = D.p[i], k = D.r[i];
  if(PT[p]){ const f = provFound[p]; [['p25',0,'un quarto'],['p50',1,'metà']].forEach(([s,x,l])=>{ const id = s+':'+p; if(f>=PT[p][x] && !unlocked.has(id)){ unlocked.add(id); toast('📍',provLabel(p)+': '+l+' dei comuni'); } }); }
  { const f = regCount[k]; [['r25',0,'un quarto'],['r50',1,'metà']].forEach(([s,x,l])=>{ const id = s+':'+k; if(f>=RT[k][x] && !unlocked.has(id)){ unlocked.add(id); toast('🗺️',D.regs[k].split('/')[0]+': '+l+' dei comuni'); } }); }
  if(D.pop[i]<100) toast('🔍','Comune raro: '+D.n[i].split('/')[0]+', '+fmtN(D.pop[i])+' abitanti!');
  BG.forEach((b,j)=>{ if(D.pop[i]<b.lim) b.steps.forEach(n=>{ const id = 'b'+b.lim+':'+n; if(bgFound[j]>=n && !unlocked.has(id)){ unlocked.add(id); toast(b.ic, (n===b.tot ? 'Tutti i '+fmtN(n)+' '+b.l : fmtN(n)+' '+b.l)+' trovati (comuni sotto i '+fmtN(b.lim)+' abitanti)'); } }); });
  if(TES.has(i)){ toast('🗝️','Tesoro: '+D.n[i].split('/')[0]+' è il comune meno popoloso della '+provLabel(D.p[i])); const tf = tesFound().length; TS.forEach(n=>{ if(tf>=n && !unlocked.has('tes:'+n)){ unlocked.add('tes:'+n); toast('🗝️', n===TES.size ? 'Tutti i tesori di provincia!' : n+' tesori di provincia'); } }); }
  BIGS.forEach(b=>{ const id = 'big:'+b.lim; if(D.pop[i]>=b.lim && !unlocked.has(id) && nFound(b.list)===b.list.length){ unlocked.add(id); toast('🏙️','Tutti i '+b.list.length+' comuni sopra i '+fmtN(b.lim)+' abitanti!'); } });
  if(LGSET.has(i)){ const lf = nFound(LG); LGS.forEach(n=>{ const id = 'lg:'+n; if(lf>=n && !unlocked.has(id)){ unlocked.add(id); toast('🏞️', n===LG.length ? 'Tutti i '+n+' laghi: hai fatto il giro dei laghi d’Italia!' : n+' comuni-lago trovati'); } }); }
  if(BBSET.has(i)){ const bf = nFound(BB); BBS.forEach(n=>{ const id = 'bb:'+n; if(bf>=n && !unlocked.has(id)){ unlocked.add(id); toast('🌸', n===BB.length ? 'Tutti i '+n+' Borghi più belli d’Italia!' : n+' Borghi più belli d’Italia trovati'); } });
    const r = BBR.find(([k])=>k===D.r[i]); if(r && !unlocked.has('bb:r'+r[0]) && nFound(r[1])===r[1].length){ unlocked.add('bb:r'+r[0]); toast('🌸','Borghi più belli: '+D.regs[r[0]].split('/')[0]+' al completo!'); } }
  if(NMSET.has(i)) NMS.forEach(x=>{ if(!unlocked.has(x.id) && nFound(x.list)===x.list.length){ unlocked.add(x.id); toast('🔤', 'Nomi: '+x.l.toLowerCase()+(x.list.length>1 ? ' ('+x.list.length+' comuni)' : ': '+regName0(x.list[0])+', '+NLEN[x.list[0]]+' lettere')+'!'); } });
  if(POPSET.has(i)) POPS.forEach(p=>{ const id = 'pop:'+p.n; if(!unlocked.has(id) && nFound(p.list)===p.n){ unlocked.add(id); toast('🏙️','I '+p.n+' comuni più popolosi d’Italia!'); } });
  if(EXT.has(i)) EXTS.forEach(e=>{ const id = 'ext:'+e.n; if(!unlocked.has(id) && nFound(e.list)===e.n){ unlocked.add(id); toast('📐','I '+e.n+' comuni più estesi d’Italia!'); } });
  if(CAPS.has(i) && !unlocked.has('cap') && capFound()===CAPS.size){ unlocked.add('cap'); toast('🏛️','Tutti i '+CAPS.size+' capoluoghi trovati!'); }
  ccDone.forEach(([a,b],id)=>{ if(!unlocked.has(id)){ unlocked.add(id); toast('⛵','Da costa a costa: '+CC.find(c=>c.id===id).l+', da '+regName0(a)+' a '+regName0(b)+'!'); } });
  if(wkBest===MREGN && !unlocked.has('walk')){ unlocked.add('walk'); toast('🚶','Italia a piedi: una catena di comuni confinanti attraverso tutte le '+MREGN+' regioni della penisola!'); }
  REC.forEach(([kk,ic])=>{ if(D.rec[kk]===i && !unlocked.has('x:'+kk)){ unlocked.add('x:'+kk); toast(ic,'Record: '+D.n[i].split('/')[0]+' è '+RECT[kk]+'!'); } });
  if(regCount[k]===1 && regsTouched()===D.regs.length && !unlocked.has('e:r')){ unlocked.add('e:r'); toast('🇮🇹','Giro d’Italia: almeno un comune in ogni regione!'); }
  if(provFound[p]===1 && provsTouched()===NP && !unlocked.has('e:p')){ unlocked.add('e:p'); toast('🧭','Giro delle province: almeno un comune in ogni provincia!'); }
  if(provFound[p]===provTot[p] && !unlocked.has('p:'+p)){ unlocked.add('p:'+p); toast('🏅',provLabel(p)+' completata!'); }
  if(regCount[k]===regTot[k] && !unlocked.has('r:'+k)){ unlocked.add('r:'+k); toast('🥇',D.regs[k].split('/')[0]+' completata!'); }
  // curiosità del comune appena trovato (solo risposte durante il gioco: achCheck non gira al caricamento)
  if(D.fact.has(i)) toast('💡','Curiosità su '+regName0(i)+': '+D.fact.get(i));
}
$('achlist').addEventListener('toggle', e => { const el = e.target; if(el.dataset && el.dataset.a){ el.open ? openAch.add(el.dataset.a) : openAch.delete(el.dataset.a); } }, true);
// Traguardi per categoria: ogni voce è { u: sbloccato, ic: icona, l: nome, c: testo a destra }; il totale è la somma delle voci
const byProv = (a,b)=>(PN[a]||a).localeCompare(PN[b]||b,'it'), regName = k => D.regs[k].split('/')[0];
const PROVS = Object.keys(provTot).sort(byProv), REGK = D.regs.map((_,k)=>k);
// Gruppi del pannello, nell'ordine in cui si vedono: ogni categoria (chiave k) sta in un solo gruppo; gli id dei traguardi non cambiano
const ACHG = [['Progressi',['m','pp','e','cap','ext','r','p','r25','r50','p25','p50']], ['Sfide',['tm','ch','cc']], ['Geografia',['c','k','lg','cg','i','f','x']],
  ['Città e borghi',['gc',...BG.map(b=>'b'+b.lim),'t','bb']], ['Cultura e storia',['w','h','mr','ml','nm']], ['Segreti',['s']]];
const ACHO = new Map(ACHG.flatMap(([g,ks],gi)=>ks.map((k,j)=>[k,[gi*100+j,g]])));
function achCats(){
  // ogni id compare una volta sola: due traguardi con lo stesso id si sbloccherebbero insieme (era successo a t50: sfida a tempo e tesori)
  const has = id => unlocked.has(id), ids = new Set(), it = (id,ic,l,c,d) => { if(ids.has(id)) throw new Error('Traguardo doppio: '+id); ids.add(id); return { u: has(id), ic, l, c, d }; };
  const tg = (t,g,gi) => it(t.pre+':'+gi, t.ic, t.label(g), islFound(g)+'/'+g[1].length, g[2]);
  const tf = tesFound();
  return [
    { k:'m', ic:'🏆', t:'Traguardi', items: MS.map(([n,l])=>it('m'+n,'🏆',l,fmtN(n))) },
    // segreti: da bloccati si vede solo il nome criptico, senza regola né conteggio; la descrizione (d) arriva con lo sblocco
    { k:'s', ic:'🤫', t:'Segreti', items: SEC.map(([n,l,ic])=>has('s'+n) ? it('s'+n,ic,l,n) : { u:false, ic, l, c:'' }).concat(WINKS.map(w=>has(w.id) ? it(w.id,w.ic,w.l,'',w.d) : { u:false, ic:w.ic, l:w.l, c:'' })),
      // sbloccato Elementare, solo le parole già trovate (le altre restano da scoprire)
      more: has('sw:parole') ? (fw => `<details class="sub" data-a="parl"${openAch.has('parl')?' open':''}><summary>Parole di Elementare trovate (${fw.length}/${PAROLE.size})</summary><ul>${
        PAROLEG.map(([ic,t,ws]) => [ic, t, ws.length, ws.filter(w=>fw.includes(w)).sort(byIt)]).filter(g=>g[3].length).map(([ic,t,n,f])=>`<li>${ic} ${t} (${f.length}/${n}): ${f.join(', ')}</li>`).join('')
      }</ul></details>`)([...PAROLE].filter(w=>PARI.get(w).some(i=>found[i]))) : '' },
    { k:'pp', ic:'👥', t:'Persone beccate', info: fmtN(popFound)+' persone su '+fmtN(POP), items: PPS.map(([q,l])=>it('pp'+q,'👥',l,q+'%')) },
    { k:'e', ic:'🧭', t:'Esplorazione', items: [it('e:r','🇮🇹','Giro d’Italia',regsTouched()+'/'+D.regs.length), it('e:p','🧭','Giro delle province',provsTouched()+'/'+NP)] },
    { k:'tm', ic:'⏱️', t:'A tempo', info: 'Conta il tempo di gioco: in pausa l’orologio si ferma. Un nome con più comuni (Castro) li conta tutti.',
      items: TIMED.map(c => Object.assign(it(c.id,c.ic,c.l,''), { h: 'Trova '+c.n+' '+(c.what||'comuni')+' in '+c.span+'.', s: c.best ? 'Il tuo record: '+c.best+' in '+c.span+'.' : 'Nessun tentativo per ora.' })) },
    { k:'ch', ic:'🚶', t:'Percorsi', info: TOURS_ON ? 'Nei percorsi conta come e in che ordine trovi i comuni. I giri in corso si salvano con la partita.' : 'Nei percorsi conta come sono collegati tra loro i comuni che trovi.',
      items: [
        ...TOURS.map(t => Object.assign(it(t.id,t.ic,t.l,t.seen.size+'/'+t.total), { s: tourStatus(t), h: t.id==='giro'
          ? 'Parti da una regione qualsiasi della penisola. Ogni comune deve stare nella stessa regione del precedente o in una confinante; puoi tornare in regioni già toccate. Un capoluogo, un comune delle isole o un salto in una regione non confinante interrompono il giro.'
          : 'Come il Giro d’Italia a tappe, ma per province: tutte le '+t.total+' della penisola, ogni comune nella stessa provincia del precedente o in una confinante.' })),
        Object.assign(it('walk','🚶','Italia a piedi',wkBest+'/'+MREGN), { w: WALKW, h: 'Vale '+WALKW+' obiettivi. Trova comuni confinanti tra loro fino a formare una catena che tocca tutte le '+MREGN+' regioni della penisola. L’ordine non conta; i capoluoghi valgono, le isole no.',
          s: wkBest ? 'La catena più lunga tocca '+wkBest+'/'+MREGN+' regioni.'+(wkBest<MREGN ? ' '+missing(REGK.filter(k=>MAIN_REG.has(k) && !(wkBestM>>k&1)).map(rn), 'regioni') : '') : 'Nessuna catena per ora.' }),
      ] },
    { k:'cc', ic:'⛵', t:'Da costa a costa', info: 'Come si fa: trova un comune sulla costa del primo mare, poi uno o più comuni dell’entroterra confinanti uno con l’altro, fino a un comune sulla costa del secondo mare. Lungo la costa non vale; l’ordine non conta.',
      items: CC.map(c=>{ const r = ccDone.get(c.id); return it(c.id,'⛵',c.l,'',r ? 'da '+regName0(r[0])+' a '+regName0(r[1]) : ''); }) },
    { k:'cap', ic:'🏛️', t:'Capoluoghi', items: [it('cap','🏛️','Tutti i capoluoghi',capFound()+'/'+CAPS.size)] },
    { k:'gc', ic:'🏙️', t:'Grandi città', info: 'Le città più popolose, da Roma in giù.', items: [...POPS.map(p=>it('pop:'+p.n,'🏙️','I '+p.n+' comuni più popolosi',nFound(p.list)+'/'+p.n)), ...BIGS.map(b=>it('big:'+b.lim,'🏙️','Tutti i comuni sopra i '+fmtN(b.lim)+' abitanti',nFound(b.list)+'/'+b.list.length))].sort((a,b)=>+a.c.split('/')[1]-b.c.split('/')[1]) },
    { k:'ext', ic:'📐', t:'I più estesi', info: 'I comuni con la superficie più grande, da Roma in giù.', items: EXTS.map(e=>it('ext:'+e.n,'📐','I '+e.n+' comuni più estesi',nFound(e.list)+'/'+e.n)),
      more: `<details class="sub" data-a="extl"${openAch.has('extl')?' open':''}><summary>Più estesi trovati (${nFound(D.ext)})</summary><ul>${D.ext.map((i,k)=>found[i] ? `<li>${k+1}. ${regName0(i)}</li>` : '').join('')}</ul></details>` },
    { k:'x', ic:'📌', t:'Record d’Italia', items: REC.map(([k,ic,l])=>it('x:'+k,ic,l,has('x:'+k) ? regName0(D.rec[k]) : '?')) },
    ...BG.map((b,j)=>({ k:'b'+b.lim, ic:b.ic, t:b.t+' (sotto '+fmtN(b.lim)+' ab.)', info: bgFound[j]+'/'+fmtN(b.tot)+' '+b.l+' trovati', items: b.steps.map(n=>it('b'+b.lim+':'+n,b.ic,n===b.tot ? 'Tutti i '+b.l : fmtN(n)+' '+b.l,fmtN(n))) })),
    { k:'t', ic:'🗝️', t:'Tesori di provincia', info: tf.length+'/'+TES.size+' trovati', items: TS.map(n=>it('tes:'+n,'🗝️',n===TES.size ? 'Tutti i tesori' : n+' tesori',n)),
      more: `<details class="sub" data-a="tes"${openAch.has('tes')?' open':''}><summary>Tesori trovati (${tf.length})</summary><ul>${tf.map(i=>[PN[TES.get(i)]||TES.get(i), regName0(i)]).sort((a,b)=>a[0].localeCompare(b[0],'it')).map(([p,nm])=>`<li>${p}: ${nm}</li>`).join('')}</ul></details>` },
    { k:'bb', ic:'🌸', t:'Borghi più belli d’Italia', info: 'I comuni dell’associazione «I Borghi più belli d’Italia» (elenco al '+BBAGG+'); se il borgo è una frazione conta il suo comune. '+nFound(BB)+'/'+BB.length+' trovati',
      items: BBS.map(n=>it('bb:'+n,'🌸',n===BB.length ? 'Tutti i borghi più belli' : n+' borghi',n)).concat([...BBR].sort((a,b)=>byIt(regName(a[0]),regName(b[0]))).map(([k,a])=>it('bb:r'+k,'🌸',regName(k),nFound(a)+'/'+a.length))),
      more: `<details class="sub" data-a="bbl"${openAch.has('bbl')?' open':''}><summary>Borghi trovati (${nFound(BB)})</summary><ul>${BB.filter(i=>found[i]).map(bbName).sort(byIt).map(nm=>`<li>${nm}</li>`).join('')}</ul></details>` },
    { k:'c', ic:'🏖️', t:'Costa italiana', info: coastFound+'/'+CO.size+' comuni costieri', items: CMS.map(([n,l])=>it('c'+n,'🏖️',l,n)) },
    { k:'k', ic:'🌊', t:'Coste regionali', items: REGK.filter(k=>coastRegTot[k]>0).map(k=>it('k:'+k,'🌊',regName(k),coastRegFound[k]+'/'+coastRegTot[k])) },
    { k:'lg', ic:'🏞️', t:'Laghi', info: 'Comuni con lo stesso nome di un lago. '+nFound(LG)+'/'+LG.length+' trovati', items: LGS.map(n=>it('lg:'+n,'🏞️',n===LG.length ? 'Tutti i laghi' : n+' laghi',n)),
      more: `<details class="sub" data-a="lgl"${openAch.has('lgl')?' open':''}><summary>Laghi trovati (${nFound(LG)})</summary><ul>${LG.filter(i=>found[i]).map(regName0).sort(byIt).map(nm=>`<li>${nm}</li>`).join('')}</ul></details>` },
    { k:'i', ic:'🏝️', t:'Isole', items: ISL.map((g,gi)=>it('i:'+gi,'🏝️',g[0],islFound(g)+'/'+g[1].length)) },
    { k:'nm', ic:'🔤', t:'Nomi', info: 'Si contano solo le lettere, senza spazi né apostrofi; per i nomi bilingui vale quello italiano.', items: NMS.map(x=>it(x.id,'🔤',x.l,nFound(x.list)+'/'+x.list.length)),
      more: `<details class="sub" data-a="nml"${openAch.has('nml')?' open':''}><summary>Nomi trovati (${nFound([...NMSET])})</summary><ul>${NBYLEN.filter(i=>NMSET.has(i) && found[i]).map(i=>`<li>${regName0(i)} (${NLEN[i]})</li>`).join('')}</ul></details>` },
    { k:'w', ic:'🥾', t:'Cammini', items: CAM.map((g,gi)=>it('w:'+gi,'🥾',g[0],islFound(g)+'/'+g[1].length)) },
    { k:'h', ic:'📜', t:'Storia', items: TG[2].list.map((g,gi)=>tg(TG[2],g,gi)) },
    { k:'ml', ic:'🗣️', t:'Minoranze linguistiche', info: 'Comuni dove la lingua della minoranza è tutelata (legge 482/1999 e statuti speciali).',
      items: [it('ml:giro','🗣️','Giro delle minoranze',minTouched()+'/'+MLG.length,'un comune per ogni minoranza linguistica')].concat(MLG.map((g,gi)=>tg(TG[3],g,gi))) },
    { k:'cg', ic:'🏷️', t:'Stesso cognome', info: 'Tutti i comuni che finiscono allo stesso modo: Pieve di Cadore, San Vito di Cadore…',
      items: TG[4].list.map((g,gi)=>tg(TG[4],g,gi)) },
    { k:'mr', ic:'⚓', t:'Repubbliche marinare', items: TG[1].list.map((g,gi)=>tg(TG[1],g,gi)) },
    { k:'f', ic:'🛂', t:'Confini', items: [it('f:giro','🛂','Giro delle frontiere',confTouched()+'/'+CONF.length,'un comune al confine con ogni Stato vicino')].concat(CONF.map((g,gi)=>tg(TG[0],g,gi))) },
    { k:'r', ic:'🥇', t:'Regioni completate', items: REGK.map(k=>it('r:'+k,'🥇',regName(k),regCount[k]+'/'+regTot[k])) },
    { k:'p', ic:'🏅', t:'Province completate', items: PROVS.map(p=>it('p:'+p,'🏅',PN[p]||p,(provFound[p]||0)+'/'+provTot[p])) },
    { k:'r25', ic:'🗺️', t:'Regioni: un quarto', items: REGK.map(k=>it('r25:'+k,'🗺️',regName(k),regCount[k]+'/'+RT[k][0])) },
    { k:'r50', ic:'🗺️', t:'Regioni: metà', items: REGK.map(k=>it('r50:'+k,'🗺️',regName(k),regCount[k]+'/'+RT[k][1])) },
    { k:'p25', ic:'📍', t:'Province: un quarto', items: Object.keys(PT).sort(byProv).map(p=>it('p25:'+p,'📍',PN[p]||p,(provFound[p]||0)+'/'+PT[p][0])) },
    { k:'p50', ic:'📍', t:'Province: metà', items: Object.keys(PT).sort(byProv).map(p=>it('p50:'+p,'📍',PN[p]||p,(provFound[p]||0)+'/'+PT[p][1])) },
  ].map(c => { const o = ACHO.get(c.k); if(!o) throw new Error('Categoria senza gruppo: '+c.k); return Object.assign(c, { o: o[0], g: o[1] }); }).sort((a,b)=>a.o-b.o);
}
const regName0 = i => D.n[i].split('/')[0];
let achFilter = 'all';
function renderAch(){
  // ogni obiettivo vale 1, tranne quelli con un peso w (Italia a piedi); i conteggi delle categorie restano numeri di voci
  const cats = achCats(), all = cats.flatMap(c=>c.items), wt = x => x.w || 1;
  const done = all.filter(x=>x.u).reduce((a,x)=>a+wt(x),0), tot = all.reduce((a,x)=>a+wt(x),0);
  $('achc').textContent = done+'/'+tot; $('achn').textContent = done; $('acht').textContent = tot; $('achbar').style.width = (100*done/tot)+'%';
  const show = x => achFilter==='all' || (achFilter==='done') === x.u;
  let lastG = '';
  $('achlist').innerHTML = cats.map(c=>{
    const u = c.items.filter(x=>x.u).length, n = c.items.length, items = c.items.filter(show);
    if(!items.length) return '';
    // la nota (aneddoto) si vede solo a traguardo sbloccato: per alcuni svelerebbe la risposta
    const rows = items.map(x=>`<div class="ai${x.u?' ok':' lock'}"${x.w ? ` data-w="${x.w}"` : ''}><span>${x.u?x.ic:'🔒'} ${x.l}${x.h ? `<small>${x.h}</small>` : ''}${x.s ? `<small class="st">${x.s}</small>` : ''}${x.u && x.d ? `<small>${x.d}</small>` : ''}</span><span class="c">${x.c}</span></div>`).join('');
    // titolo del gruppo prima della sua prima categoria visibile (con il filtro un gruppo può sparire del tutto)
    const head = c.g !== lastG ? `<h3 class="ag">${c.g}</h3>` : ''; lastG = c.g;
    return head + `<details class="cat${u===n?' full':''}" data-a="${c.k}"${openAch.has(c.k)?' open':''}><summary><span class="ci">${c.ic}</span><span class="ct">${c.t}</span><span class="c">${u}/${n}</span><span class="mbar"><i style="width:${100*u/n}%"></i></span></summary>`
      + (c.info ? `<div class="info">${c.info}</div>` : '') + rows + (c.more||'') + `</details>`;
  }).join('') || '<div class="empty">Nessun traguardo qui, per ora.</div>';
}
document.querySelectorAll('#achfilt button').forEach(b => b.onclick = () => { achFilter = b.dataset.f; document.querySelectorAll('#achfilt button').forEach(x => x.setAttribute('aria-pressed', x===b)); renderAch(); });

function fmt(t){ t = Math.floor(t/1000); const h = Math.floor(t/3600), m = Math.floor(t%3600/60), s = t%60; return h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
function tick(){ if(running) elapsed = Date.now()-t0; $('time').firstChild.textContent = fmt(elapsed); }
function refreshStats(){ $('cnt').textContent = foundCount; $('pop').textContent = fmtN(popFound); $('rar').textContent = fmtN(rarFound); }
function save(){ try{ localStorage.setItem('comuniQuizV1', JSON.stringify({f:[...found].map((v,i)=>v?i:-1).filter(i=>i>=0), t:elapsed, a:[...earned], ...(TIMED.some(c=>c.best) ? { rb: Object.fromEntries(TIMED.filter(c=>c.best).map(c=>[c.id, c.best])) } : {}), ...(TOURS_ON ? (TOURS.some(t=>t.last!==null) ? { tr: Object.fromEntries(TOURS.filter(t=>t.last!==null).map(t=>[t.id, [t.last, [...t.seen]]])) } : {}) : trKept ? { tr: trKept } : {}), ...(gaveUp ? {g:1} : {})})); }catch(e){} }
function load(){ try{ const s = JSON.parse(localStorage.getItem('comuniQuizV1')||'null'); if(s&&s.f){ s.f.forEach(addFound); elapsed = s.t||0; gaveUp = !!s.g; const tr = s.tr || (Array.isArray(s.gr) ? { giro: [s.gr[0], REGK.filter(k=>s.gr[1]>>k&1)] } : {}); if(!TOURS_ON && Object.keys(tr).length) trKept = tr; TOURS.forEach(t=>{ const v = tr[t.id]; if(Array.isArray(v) && Array.isArray(v[1]) && v[1].includes(v[0]) && t.adj(v[0])){ t.last = v[0]; t.seen = new Set(v[1]); } }); const rb = s.rb || {}; TIMED.forEach(c=>{ if(Number.isInteger(rb[c.id]) && rb[c.id]>0) c.best = rb[c.id]; }); (s.a||[]).forEach(id=>{ if(CH.some(c=>c[0]===id)) earned.add(id); }); } }catch(e){} }
// la casella è sempre attiva (tranne a partita finita): scrivere un comune fa partire o riprendere la partita; il pulsante serve solo per il tempo
const ph = (long, short) => isPhone() ? short : long, PAUSED = ph('In pausa: scrivi un comune per riprendere…', 'In pausa: scrivi per riprendere…');
function start(){
  running = true; t0 = Date.now()-elapsed; timer = setInterval(()=>{ tick(); }, 500);
  $('inp').placeholder = ph('Scrivi il nome di un comune…', 'Scrivi un comune…'); $('inp').focus(); $('giveup').disabled = false; $('go').textContent = 'Pausa'; $('go').dataset.state = 'run';
}
function pause(){ tick(); running = false; clearInterval(timer); save(); $('inp').placeholder = PAUSED; $('go').textContent = 'Riprendi'; $('go').dataset.state = 'pause'; }
// Partita finita (resa o tutti trovati): input fermo, il pulsante principale diventa "Ricomincia"
const over = () => gaveUp || foundCount===N;
function showOver(){ $('inp').disabled = true; $('inp').placeholder = gaveUp ? 'Ti sei arreso: ecco tutti i comuni. Premi Ricomincia per una nuova partita.' : 'Hai trovato tutti i comuni! Premi Ricomincia per una nuova partita.'; $('giveup').disabled = true; $('go').disabled = false; $('go').textContent = 'Ricomincia'; delete $('go').dataset.state; if(gaveUp) D.regs.forEach((_,k)=>updateReg(k)); draw(); }
function finish(){ tick(); running = false; clearInterval(timer); save(); showOver(); if(gaveUp) toast('🏳️','Hai trovato '+fmtN(foundCount)+' comuni su '+fmtN(N)+' in '+fmt(elapsed)); }
// Ricomincia: cancella solo la partita (comuniQuizV1), il tema resta; la pagina si ricarica da zero
function restart(){ if(!confirm('Ricominciare da zero? Comuni trovati, tempo e sfide verranno cancellati.')) return; try{ localStorage.removeItem('comuniQuizV1'); }catch(e){} location.reload(); }
$('go').onclick = ()=>{ over() ? restart() : running ? pause() : start(); };
addEventListener('pagehide', ()=>{ if(running){ tick(); save(); } });
$('giveup').onclick = ()=>{ if(confirm('Vuoi arrenderti? Verranno mostrati tutti i comuni mancanti.')){ gaveUp = true; finish(); } };
const dupEl = document.createElement('div'); dupEl.style.cssText = 'position:absolute;left:50%;top:12px;transform:translateX(-50%);background:var(--panel);color:var(--text);border:2px solid var(--bad);border-radius:10px;padding:6px 14px;font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.3);opacity:0;transition:opacity .25s;pointer-events:none;z-index:6;max-width:80%;text-align:center'; box.appendChild(dupEl);
let dupT = 0, dupClr = 0;
function notice(text, inp, i){
  dupEl.textContent = text; dupEl.style.opacity = 1; inp.classList.add('shake'); if(i>=0){ flash = i; draw(); }
  clearTimeout(dupT); dupT = setTimeout(()=>{ dupEl.style.opacity = 0; inp.classList.remove('shake'); if(i>=0 && flash===i){ flash = -1; draw(); } }, 1800);
}
function dupNotice(hits, inp){
  const i = hits[0], nm = D.n[i].split('/')[0];
  notice('Già indovinato: ' + nm + (hits.length>1 ? ' (' + hits.length + ' comuni con questo nome)' : ''), inp, i);
  const v = inp.value; clearTimeout(dupClr); dupClr = setTimeout(()=>{ if(inp.value===v) inp.value = ''; }, 1500);
}
// Invio su un nome che non è un comune: un avviso, così il gioco non sembra bloccato (il testo resta)
$('inp').addEventListener('keydown', e => { const v = e.target.value; if(e.key==='Enter' && !over() && norm(v) && !keyMap.get(norm(v)) && !looseMap.get(lk(v))) notice('Nessun comune si chiama così', e.target, -1); });
$('inp').addEventListener('input',e=>{
  if(over()) return; const k = norm(e.target.value); if(!k) return; const hits = keyMap.get(k) || looseMap.get(lk(e.target.value)); if(!hits) return;
  if(!running) start();
  let added = [], touched = new Set();
  hits.forEach(i=>{ if(addFound(i)){ added.push(i); touched.add(D.r[i]); } });
  if(added.length){ e.target.value = ''; touched.forEach(updateReg); added.forEach(achCheck); timedCheck(added); winkCheck(added); TOURS.forEach(t=>tourStep(t, added)); renderAch(); refreshStats(); save(); if(added.length===1){ flash = added[0]; ensureVisible(added[0]); setTimeout(()=>{ flash=-1; draw(); },1200); } draw(); if(foundCount===N) finish(); } else dupNotice(hits, e.target);
});
// ---- tema: automatico (segue il sistema) -> chiaro -> scuro; scelta salvata a parte in localStorage['comuniQuizTheme'] ----
const THEMES = [['', '◐', 'automatico'], ['light', '☀', 'chiaro'], ['dark', '☾', 'scuro']];
function showTheme(){ const t = document.documentElement.dataset.theme || '', [, icon, l] = THEMES.find(x=>x[0]===t) || THEMES[0], b = $('theme'); b.textContent = icon; b.title = 'Tema: '+l; b.setAttribute('aria-label', 'Tema: '+l); }
$('theme').onclick = ()=>{
  const root = document.documentElement, k = THEMES.findIndex(x=>x[0]===(root.dataset.theme||'')), t = THEMES[(k+1)%THEMES.length][0];
  if(t) root.dataset.theme = t; else delete root.dataset.theme;
  try{ if(t) localStorage.setItem('comuniQuizTheme', t); else localStorage.removeItem('comuniQuizTheme'); }catch(e){}
  showTheme(); draw(); if(running) $('inp').focus();
};
if(window.matchMedia){ const mq = matchMedia('(prefers-color-scheme: dark)'); (mq.addEventListener ? mq.addEventListener('change', draw) : mq.addListener(draw)); }
// Schede del pannello laterale: Regioni / Traguardi
// telefono: il pannello è una linguetta in basso; una scheda la apre, la freccia la apre e la chiude
const sideEl = document.querySelector('.side'), setSheet = o => { sideEl.classList.toggle('open', o); $('sheet').setAttribute('aria-expanded', o); $('sheet').textContent = o ? '▼' : '▲'; $('sheet').setAttribute('aria-label', o ? 'Chiudi il pannello' : 'Apri il pannello'); };
$('sheet').onclick = () => setSheet(!sideEl.classList.contains('open'));
document.querySelectorAll('.tabs button[role=tab]').forEach(b => b.onclick = () => { if(isPhone()) setSheet(true);
  document.querySelectorAll('.tabs button[role=tab]').forEach(x => { const on = x===b; x.setAttribute('aria-selected', on); $(x.getAttribute('aria-controls')).hidden = !on; });
});
showTheme();
// spiegazione dei punti rarità: tooltip col mouse, avviso al clic (anche da telefono)
const rarInfo = () => { if(!toastQ.some(t => t[0]==='💎')) toast('💎', 'Punti rarità: ' + $('rarbox').title); };
$('rarbox').onclick = rarInfo; $('rarbox').onkeydown = e => { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); rarInfo(); } };
// avviso sul telefono (puntatore grossolano): da computer si gioca meglio; chiuso una volta, resta chiuso (localStorage['comuniQuizMobileNote'], a parte dalla partita)
{ const el = $('mobnote'); let off = false; try{ off = localStorage.getItem('comuniQuizMobileNote')==='1'; }catch(e){}
  if(el && !off && window.matchMedia && matchMedia('(pointer: coarse)').matches){ el.hidden = false; el.querySelector('button').onclick = () => { el.hidden = true; try{ localStorage.setItem('comuniQuizMobileNote', '1'); }catch(e){} }; } }
// telefono: la pagina non scorre, quindi la presentazione e i crediti (attribuzione CC BY) vanno in fondo al pannello a linguetta
if(isPhone()) document.querySelector('.side').append(document.querySelector('.about'), document.querySelector('.foot'));
// link per sostenere il progetto: l'indirizzo sta solo nel footer (#support), il pannello laterale lo copia
{ const s = $('support'), side = $('supportSide'); if(s && side){ side.href = s.href; $('supportBox').hidden = false; } }
buildSide(); load(); D.regs.forEach((_,k)=>updateReg(k)); refreshStats(); achInit(); renderAch(); tick();
if(isPhone() && !over() && !foundCount) $('inp').placeholder = 'Scrivi un comune per iniziare…';
if(over()) showOver(); else if(foundCount>0){ $('go').textContent = 'Riprendi'; $('inp').placeholder = PAUSED; }
window.addEventListener('resize',resize); if(window.visualViewport) visualViewport.addEventListener('resize',resize); resize();
})();
