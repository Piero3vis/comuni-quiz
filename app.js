// Quiz: tutti i comuni d'Italia
// Carica data/map.json + data/groups.json (oppure i dati incorporati nel file unico generato da scripts/build_single_file.py).

async function loadData() {
  let map, groups;
  const inline = document.getElementById('data');
  if (inline) {
    ({ map, groups } = JSON.parse(inline.textContent));
  } else {
    [map, groups] = await Promise.all([
      fetch('data/map.json').then(r => r.json()),
      fetch('data/groups.json').then(r => r.json()),
    ]);
  }
  return withGroups(map, groups);
}

// Trasforma i gruppi (isole, cammini) da nomi di comuni a indici.
// Un gruppo con "union": true contiene tutti i comuni degli altri gruppi della lista (piu' gli eventuali "comuni" extra).
function withGroups(map, groups) {
  const byName = new Map();
  map.n.forEach((nm, i) => { if (!byName.has(nm)) byName.set(nm, []); byName.get(nm).push(i); });
  const lookup = nm => {
    const a = byName.get(nm);
    if (!a || a.length !== 1) throw new Error('Nome comune non risolvibile: ' + nm);
    return a[0];
  };
  const resolve = list => {
    const parsed = list.map(g => ({ name: g.name, union: !!g.union, set: new Set((g.comuni || []).map(lookup)) }));
    const all = new Set();
    parsed.filter(g => !g.union).forEach(g => g.set.forEach(i => all.add(i)));
    return parsed.map(g => [g.name, [...(g.union ? new Set([...g.set, ...all]) : g.set)].sort((a, b) => a - b)]);
  };
  map.isl = resolve(groups.isole);
  map.cam = resolve(groups.cammini);
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
function resize(){ dpr = window.devicePixelRatio||1; const pw = W, ph = H, ps = minScale; W = box.clientWidth; H = box.clientHeight; cv.width = W*dpr; cv.height = H*dpr; if(!pw){ fit(); } else { const cx = (pw/2-ox)/scale, cy = (ph/2-oy)/scale, ratio = scale/ps; fit(); scale = minScale*ratio; ox = W/2-cx*scale; oy = H/2-cy*scale; } draw(); }
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
    else if(showAll) ctx.fillStyle = PAL[D.r[i]] + '55';
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
  if(found[i]||gaveUp){ info.innerHTML = '<b>'+D.n[i]+'</b> ('+D.p[i]+') · '+reg; }
  else { info.innerHTML = '<div style="color:var(--muted)">'+reg+' · '+D.p[i]+'</div><div id="infoMain">Non ancora trovato · inizia con «'+base[0]+'» · '+letters+' lettere</div><button id="reveal" style="margin-top:6px;padding:4px 10px">Rivela nome</button>'; info.querySelector('#reveal').onclick = ()=>{ info.querySelector('#infoMain').innerHTML = '<b>'+base+'</b>'; info.querySelector('#reveal').remove(); }; }
  info.style.display = 'block'; info.style.left = Math.max(6,Math.min(x+12,W-250))+'px'; info.style.top = Math.max(6,Math.min(y+12,H-120))+'px';
}
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
function buildSide(){
  $('regs').innerHTML = D.regs.map((r,k)=>`<details class="reg" id="rg${k}"><summary><span class="dot" style="background:${PAL[k]}"></span>${r.split('/')[0]}<span class="c" id="rc${k}">0/${regTot[k]}</span><span class="rbar"><i id="rb${k}" style="background:${PAL[k]}"></i></span></summary><div id="rl${k}"></div></details>`).join('');
}
const PN = {"TO":"Torino","VC":"Vercelli","NO":"Novara","CN":"Cuneo","AT":"Asti","AL":"Alessandria","AO":"Valle d'Aosta","IM":"Imperia","SV":"Savona","GE":"Genova","SP":"La Spezia","VA":"Varese","CO":"Como","SO":"Sondrio","MI":"Milano","BG":"Bergamo","BS":"Brescia","PV":"Pavia","CR":"Cremona","MN":"Mantova","BZ":"Bolzano","TN":"Trento","VR":"Verona","VI":"Vicenza","BL":"Belluno","TV":"Treviso","VE":"Venezia","PD":"Padova","RO":"Rovigo","UD":"Udine","GO":"Gorizia","TS":"Trieste","PC":"Piacenza","PR":"Parma","RE":"Reggio nell'Emilia","MO":"Modena","BO":"Bologna","FE":"Ferrara","RA":"Ravenna","FC":"Forlì-Cesena","PU":"Pesaro e Urbino","AN":"Ancona","MC":"Macerata","AP":"Ascoli Piceno","MS":"Massa-Carrara","LU":"Lucca","PT":"Pistoia","FI":"Firenze","LI":"Livorno","PI":"Pisa","AR":"Arezzo","SI":"Siena","GR":"Grosseto","PG":"Perugia","TR":"Terni","VT":"Viterbo","RI":"Rieti","RM":"Roma","LT":"Latina","FR":"Frosinone","CE":"Caserta","BN":"Benevento","NA":"Napoli","AV":"Avellino","SA":"Salerno","AQ":"L'Aquila","TE":"Teramo","PE":"Pescara","CH":"Chieti","CB":"Campobasso","FG":"Foggia","BA":"Bari","TA":"Taranto","BR":"Brindisi","LE":"Lecce","PZ":"Potenza","MT":"Matera","CS":"Cosenza","CZ":"Catanzaro","RC":"Reggio Calabria","TP":"Trapani","PA":"Palermo","ME":"Messina","AG":"Agrigento","CL":"Caltanissetta","EN":"Enna","CT":"Catania","RG":"Ragusa","SR":"Siracusa","PN":"Pordenone","IS":"Isernia","BI":"Biella","LC":"Lecco","LO":"Lodi","RN":"Rimini","PO":"Prato","KR":"Crotone","VV":"Vibo Valentia","VB":"Verbano-Cusio-Ossola","MB":"Monza e della Brianza","FM":"Fermo","BT":"Barletta-Andria-Trani","SS":"Sassari","OT":"Gallura Nord-Est Sardegna","NU":"Nuoro","OR":"Oristano","OG":"Ogliastra","VS":"Medio Campidano","CA":"Cagliari","CI":"Sulcis Iglesiente"};
// Città metropolitane secondo ISTAT (dal 1° gennaio 2026 anche Sassari); scripts/check_istat.py controlla che l'elenco sia aggiornato.
const CM = new Set(['BA','BO','CA','CT','FI','GE','ME','MI','NA','PA','RC','RM','SS','TO','VE']);
const provLabel = p => (CM.has(p) ? 'Città metropolitana di ' : 'Provincia di ') + (PN[p]||p);
const provTot = {}; D.p.forEach(p => provTot[p] = (provTot[p]||0)+1);
const regProvs = D.regs.map(()=>new Set()); D.r.forEach((r,i)=>regProvs[r].add(D.p[i]));
const openProv = new Set();
function updateReg(k){
  $('rc'+k).textContent = regCount[k]+'/'+regTot[k]; $('rb'+k).style.width = (100*regCount[k]/regTot[k])+'%';
  const by = {}; regLists[k].forEach(i => (by[D.p[i]] = by[D.p[i]]||[]).push(i));
  const provs = [...regProvs[k]].sort((a,b)=>(PN[a]||a).localeCompare(PN[b]||b,'it'));
  $('rl'+k).innerHTML = provs.map(p => {
    const arr = by[p]||[], nm = PN[p]||p, cnt = arr.length+'/'+provTot[p];
    if(!arr.length) return `<div class="prov0"><span>${nm}</span><span class="c">${cnt}</span></div>`;
    const lis = arr.slice().sort((a,b)=>D.n[a].localeCompare(D.n[b],'it')).map(i=>`<li data-i="${i}">${D.n[i].split('/')[0]}</li>`).join('');
    return `<details class="prov" data-p="${p}"${openProv.has(p)?' open':''}><summary><span>${nm}</span><span class="c">${cnt}</span></summary><ul>${lis}</ul></details>`;
  }).join('');
}
$('regs').addEventListener('toggle', e => { const el = e.target; if(el.classList && el.classList.contains('prov')){ el.open ? openProv.add(el.dataset.p) : openProv.delete(el.dataset.p); } }, true);
$('regs').addEventListener('click',e=>{ const li = e.target.closest('li'); if(li){ const i = +li.dataset.i; flash = i; draw(); setTimeout(()=>{ flash=-1; draw(); },1800); } });
function addFound(i){ if(found[i]) return false; found[i] = 1; foundCount++; const k = D.r[i]; regCount[k]++; regLists[k].push(i); provFound[D.p[i]] = (provFound[D.p[i]]||0)+1; if(CO.has(i)){ coastFound++; coastRegFound[D.r[i]]++; } return true; }
const provFound = {};
const CO = new Set(D.co), coastRegFound = D.regs.map(()=>0), coastRegTot = D.regs.map(()=>0); let coastFound = 0; D.co.forEach(i=>coastRegTot[D.r[i]]++);
const CMS = [[10,'Primi bagni'],[50,'Lupo di mare'],[100,'Marinaio'],[250,'Capitano'],[Math.ceil(CO.size*.5),'Mezza costa'],[CO.size,'Tutta la costa italiana!']].sort((a,b)=>a[0]-b[0]);
const MS = [[1,'Primo passo'],[10,'Si comincia'],[100,'Cento comuni'],[500,'Cinquecento'],[666,'Il numero della bestia'],[1000,'Mille comuni'],[Math.ceil(N*.25),'Un quarto d’Italia'],[Math.ceil(N*.5),'Metà Italia'],[Math.ceil(N*.75),'Tre quarti d’Italia'],[5000,'Cinquemila'],[N,'Tutta l’Italia!']].sort((a,b)=>a[0]-b[0]);
// Traguardi segreti: nascosti nell'elenco finché non si sbloccano. [soglia, nome, icona, testo dell'avviso]
const SEC = [[69,'Nice.','😏','Nice.'],[420,'Blaze it','🌿','420 comuni. Blaze it.']];
const ISL = D.isl, islOf = new Map(); ISL.forEach((g,gi)=>g[1].forEach(i=>{ if(!islOf.has(i)) islOf.set(i,[]); islOf.get(i).push(gi); }));
const islFound = g => g[1].filter(i=>found[i]).length, islDone = g => g[1].every(i=>found[i]);
const PT = {}; Object.keys(provTot).forEach(p=>{ const T = provTot[p]; if(T>=4) PT[p] = [Math.ceil(T*.25),Math.ceil(T*.5)]; });
const RT = regTot.map(T=>[Math.ceil(T*.25),Math.ceil(T*.5)]);
const openAch = new Set();
const CAM = D.cam, camOf = new Map(); CAM.forEach((g,gi)=>g[1].forEach(i=>{ if(!camOf.has(i)) camOf.set(i,[]); camOf.get(i).push(gi); }));
const unlocked = new Set(), toastQ = []; let toasting = false;
const toastEl = document.createElement('div'); toastEl.style.cssText = 'position:absolute;left:50%;bottom:16px;transform:translateX(-50%);background:var(--panel);color:var(--text);border:2px solid var(--accent);border-radius:10px;padding:8px 14px;font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.3);opacity:0;transition:opacity .3s;pointer-events:none;z-index:6;max-width:90%;text-align:center'; box.appendChild(toastEl);
function toast(icon,text){ toastQ.push([icon,text]); if(!toasting) nextToast(); }
function nextToast(){ const q = toastQ.shift(); if(!q){ toasting = false; return; } toasting = true; toastEl.textContent = q[0]+' '+q[1]; toastEl.style.opacity = 1; setTimeout(()=>{ toastEl.style.opacity = 0; setTimeout(nextToast,350); },2800); }
function achInit(){ CAM.forEach((g,gi)=>{ if(islDone(g)) unlocked.add('w:'+gi); }); Object.keys(PT).forEach(p=>{ const f = provFound[p]||0; if(f>=PT[p][0]) unlocked.add('p25:'+p); if(f>=PT[p][1]) unlocked.add('p50:'+p); }); RT.forEach((x,k)=>{ if(regCount[k]>=x[0]) unlocked.add('r25:'+k); if(regCount[k]>=x[1]) unlocked.add('r50:'+k); }); ISL.forEach((g,gi)=>{ if(islDone(g)) unlocked.add('i:'+gi); }); CMS.forEach(([n])=>{ if(coastFound>=n) unlocked.add('c'+n); }); coastRegTot.forEach((tt,k)=>{ if(tt>0 && coastRegFound[k]===tt) unlocked.add('k:'+k); }); MS.forEach(([n])=>{ if(foundCount>=n) unlocked.add('m'+n); }); SEC.forEach(([n])=>{ if(foundCount>=n) unlocked.add('s'+n); }); Object.keys(provTot).forEach(p=>{ if(provFound[p]===provTot[p]) unlocked.add('p:'+p); }); D.regs.forEach((_,k)=>{ if(regCount[k]===regTot[k]) unlocked.add('r:'+k); }); }
function achCheck(i){
  for(const [n,l] of MS){ const id = 'm'+n; if(foundCount>=n && !unlocked.has(id)){ unlocked.add(id); toast('🏆',l+' ('+n+')'); } }
  for(const [n,,ic,t] of SEC){ const id = 's'+n; if(foundCount>=n && !unlocked.has(id)){ unlocked.add(id); toast(ic,t); } }
  if(CO.has(i)){
    for(const [n,l] of CMS){ const id = 'c'+n; if(coastFound>=n && !unlocked.has(id)){ unlocked.add(id); toast('🏖️',l+' (costa: '+n+')'); } }
    const kk = D.r[i]; if(coastRegFound[kk]===coastRegTot[kk] && !unlocked.has('k:'+kk)){ unlocked.add('k:'+kk); toast('🌊','Costa completata: '+D.regs[kk].split('/')[0]); }
  }
  (islOf.get(i)||[]).forEach(gi=>{ if(!unlocked.has('i:'+gi) && islDone(ISL[gi])){ unlocked.add('i:'+gi); toast('🏝️','Isole: '+ISL[gi][0]+' al completo!'); } });
  (camOf.get(i)||[]).forEach(gi=>{ if(!unlocked.has('w:'+gi) && islDone(CAM[gi])){ unlocked.add('w:'+gi); toast('🥾','Cammino completato: '+CAM[gi][0]); } });
  const p = D.p[i], k = D.r[i];
  if(PT[p]){ const f = provFound[p]; [['p25',0,'un quarto'],['p50',1,'metà']].forEach(([s,x,l])=>{ const id = s+':'+p; if(f>=PT[p][x] && !unlocked.has(id)){ unlocked.add(id); toast('📍',provLabel(p)+': '+l+' dei comuni'); } }); }
  { const f = regCount[k]; [['r25',0,'un quarto'],['r50',1,'metà']].forEach(([s,x,l])=>{ const id = s+':'+k; if(f>=RT[k][x] && !unlocked.has(id)){ unlocked.add(id); toast('🗺️',D.regs[k].split('/')[0]+': '+l+' dei comuni'); } }); }
  if(provFound[p]===provTot[p] && !unlocked.has('p:'+p)){ unlocked.add('p:'+p); toast('🏅',provLabel(p)+' completata!'); }
  if(regCount[k]===regTot[k] && !unlocked.has('r:'+k)){ unlocked.add('r:'+k); toast('🥇',D.regs[k].split('/')[0]+' completata!'); }
}
$('achlist').addEventListener('toggle', e => { const el = e.target; if(el.dataset && el.dataset.a){ el.open ? openAch.add(el.dataset.a) : openAch.delete(el.dataset.a); } }, true);
function renderAch(){
  const ids = [...unlocked], ps = ids.filter(x=>x.startsWith('p:')).map(x=>x.slice(2)).sort((a,b)=>(PN[a]||a).localeCompare(PN[b]||b,'it')), rs = ids.filter(x=>x.startsWith('r:')).map(x=>+x.slice(2)), np = Object.keys(provTot).length;
  $('achc').textContent = unlocked.size+'/'+(MS.length+SEC.length+D.regs.length+np+CMS.length+coastRegTot.filter(x=>x>0).length+ISL.length+Object.keys(PT).length*2+D.regs.length*2+CAM.length);
  $('achlist').innerHTML = '<div class="ah">Traguardi</div>' + MS.map(([n,l])=>{ const u = unlocked.has('m'+n); return `<div class="ai${u?'':' lock'}"><span>${u?'🏆':'🔒'} ${l}</span><span class="c">${n}</span></div>`; }).join('')
    + `<div class="ah">Segreti <span class="c">${SEC.filter(([n])=>unlocked.has('s'+n)).length}/${SEC.length}</span></div>` + SEC.map(([n,l,ic])=>unlocked.has('s'+n) ? `<div class="ai"><span>${ic} ${l}</span><span class="c">${n}</span></div>` : `<div class="ai lock"><span>🔒 ???</span></div>`).join('')
    + `<div class="ah">Regioni completate <span class="c">${rs.length}/${D.regs.length}</span></div>` + rs.map(k=>`<div class="ai">🥇 ${D.regs[k].split('/')[0]}</div>`).join('')
    + `<div class="ah">Province completate <span class="c">${ps.length}/${np}</span></div>` + ps.map(p=>`<div class="ai">🏅 ${PN[p]||p}</div>`).join('')
    + `<div class="ah">Costa italiana <span class="c">${coastFound}/${CO.size}</span></div>` + CMS.map(([n,l])=>{ const u = unlocked.has('c'+n); return `<div class="ai${u?'':' lock'}"><span>${u?'🏖️':'🔒'} ${l}</span><span class="c">${n}</span></div>`; }).join('')
    + `<div class="ah">Coste regionali <span class="c">${ids.filter(x=>x.startsWith('k:')).length}/${coastRegTot.filter(x=>x>0).length}</span></div>` + ids.filter(x=>x.startsWith('k:')).map(x=>+x.slice(2)).map(k=>`<div class="ai">🌊 ${D.regs[k].split('/')[0]}</div>`).join('')
    + `<div class="ah">Isole <span class="c">${ISL.filter(g=>islDone(g)).length}/${ISL.length}</span></div>` + ISL.map(g=>{ const u = islDone(g); return `<div class="ai${u?'':' lock'}"><span>${u?'🏝️':'🔒'} ${g[0]}</span><span class="c">${islFound(g)}/${g[1].length}</span></div>`; }).join('')
    + `<div class="ah">Cammini <span class="c">${CAM.filter(g=>islDone(g)).length}/${CAM.length}</span></div>` + CAM.map(g=>{ const u = islDone(g); return `<div class="ai${u?'':' lock'}"><span>${u?'🥾':'🔒'} ${g[0]}</span><span class="c">${islFound(g)}/${g[1].length}</span></div>`; }).join('')
    + `<div class="ah">Avanzamento</div>`
    + [['p25','Province: un quarto'],['p50','Province: metà']].map(([pre,title])=>{ const l = Object.keys(PT).filter(p=>unlocked.has(pre+':'+p)).sort((a,b)=>(PN[a]||a).localeCompare(PN[b]||b,'it')); return `<details class="prov" data-a="${pre}"${openAch.has(pre)?' open':''}><summary><span>📍 ${title}</span><span class="c">${l.length}/${Object.keys(PT).length}</span></summary><ul>${l.map(p=>`<li>${PN[p]||p}</li>`).join('')}</ul></details>`; }).join('')
    + [['r25','Regioni: un quarto'],['r50','Regioni: metà']].map(([pre,title])=>{ const l = D.regs.map((r,k)=>k).filter(k=>unlocked.has(pre+':'+k)); return `<details class="prov" data-a="${pre}"${openAch.has(pre)?' open':''}><summary><span>🗺️ ${title}</span><span class="c">${l.length}/${D.regs.length}</span></summary><ul>${l.map(k=>`<li>${D.regs[k].split('/')[0]}</li>`).join('')}</ul></details>`; }).join('');
}
function fmt(t){ t = Math.floor(t/1000); const h = Math.floor(t/3600), m = Math.floor(t%3600/60), s = t%60; return h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
function tick(){ if(running) elapsed = Date.now()-t0; $('time').firstChild.textContent = fmt(elapsed); }
function refreshStats(){ $('cnt').textContent = foundCount; }
function save(){ try{ localStorage.setItem('comuniQuizV1', JSON.stringify({f:[...found].map((v,i)=>v?i:-1).filter(i=>i>=0), t:elapsed})); }catch(e){} }
function load(){ try{ const s = JSON.parse(localStorage.getItem('comuniQuizV1')||'null'); if(s&&s.f){ s.f.forEach(addFound); elapsed = s.t||0; } }catch(e){} }
function start(){
  running = true; gaveUp = false; t0 = Date.now()-elapsed; timer = setInterval(()=>{ tick(); }, 500);
  $('inp').disabled = false; $('inp').placeholder = 'Scrivi il nome di un comune…'; $('inp').focus(); $('giveup').disabled = false; $('go').textContent = 'Pausa';
}
function pause(){ tick(); running = false; clearInterval(timer); save(); $('inp').disabled = true; $('go').textContent = 'Riprendi'; }
function finish(){ tick(); running = false; clearInterval(timer); $('inp').disabled = true; $('go').disabled = true; $('giveup').disabled = true; $('go').textContent = foundCount===N?'Completato!':'Finito'; save(); draw(); }
$('go').onclick = ()=>{ running ? pause() : start(); };
addEventListener('pagehide', ()=>{ if(running){ tick(); save(); } });
$('giveup').onclick = ()=>{ if(confirm('Vuoi arrenderti? Verranno mostrati tutti i comuni mancanti.')){ gaveUp = true; finish(); } };
const dupEl = document.createElement('div'); dupEl.style.cssText = 'position:absolute;left:50%;top:12px;transform:translateX(-50%);background:var(--panel);color:var(--text);border:2px solid var(--bad);border-radius:10px;padding:6px 14px;font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.3);opacity:0;transition:opacity .25s;pointer-events:none;z-index:6;max-width:80%;text-align:center'; box.appendChild(dupEl);
let dupT = 0, dupClr = 0;
function dupNotice(hits, inp){
  const i = hits[0], nm = D.n[i].split('/')[0];
  dupEl.textContent = 'Già indovinato: ' + nm + (hits.length>1 ? ' (' + hits.length + ' comuni con questo nome)' : '');
  dupEl.style.opacity = 1; inp.classList.add('shake'); flash = i; draw();
  clearTimeout(dupT); dupT = setTimeout(()=>{ dupEl.style.opacity = 0; inp.classList.remove('shake'); if(flash===i){ flash = -1; draw(); } }, 1800);
  const v = inp.value; clearTimeout(dupClr); dupClr = setTimeout(()=>{ if(inp.value===v) inp.value = ''; }, 1500);
}
$('inp').addEventListener('input',e=>{
  if(!running) return; const k = norm(e.target.value); if(!k) return; const hits = keyMap.get(k) || looseMap.get(lk(e.target.value)); if(!hits) return;
  let added = [], touched = new Set();
  hits.forEach(i=>{ if(addFound(i)){ added.push(i); touched.add(D.r[i]); } });
  if(added.length){ e.target.value = ''; touched.forEach(updateReg); added.forEach(achCheck); renderAch(); refreshStats(); save(); if(added.length===1){ flash = added[0]; ensureVisible(added[0]); setTimeout(()=>{ flash=-1; draw(); },1200); } draw(); if(foundCount===N) finish(); } else dupNotice(hits, e.target);
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
showTheme();
buildSide(); load(); D.regs.forEach((_,k)=>updateReg(k)); refreshStats(); achInit(); renderAch(); tick();
if(foundCount>0){ $('go').textContent = 'Riprendi'; }
window.addEventListener('resize',resize); resize();
})();
