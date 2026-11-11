const { JSDOM } = require('jsdom');
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
// Smoke test: carica la pagina in jsdom (canvas finto), simula alcune risposte e controlla traguardi e avvisi.
async function run(label, htmlFile, useFetch){
  const html = fs.readFileSync(path.join(root, htmlFile), 'utf8');
  const errors = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w){
      w.Path2D = class { constructor(){} };
      const noop = new Proxy(function(){}, { get: (t,k)=> k==='isPointInPath' ? ()=>false : (k==='measureText'? ()=>({width:0}) : noop), apply: ()=>undefined, set: ()=>true });
      w.HTMLCanvasElement.prototype.getContext = ()=>noop;
      w.document.createElement.bind(w.document);
      w.addEventListener('error', e=>errors.push(e.message));
      w.confirm = ()=>true;
      Object.defineProperty(w.HTMLElement.prototype,'clientWidth',{get(){return 800}});
      Object.defineProperty(w.HTMLElement.prototype,'clientHeight',{get(){return 600}});
      if(useFetch){ w.fetch = (u)=>Promise.resolve({ json: ()=>Promise.resolve(JSON.parse(fs.readFileSync(path.join(root,u),'utf8'))) }); }
      w.localStorage.clear();
    }});
  // load external app.js manually for the multi-file variant
  if(useFetch){ const s = dom.window.document.createElement('script'); s.textContent = fs.readFileSync(path.join(root,'app.js'),'utf8'); dom.window.document.body.appendChild(s); }
  await new Promise(r=>setTimeout(r,1500));
  const w = dom.window, d = w.document, $ = id=>d.getElementById(id);
  console.log(label, 'tot=', $('tot').textContent, 'regs=', d.querySelectorAll('#regs details.reg').length, 'ach=', $('achc').textContent);
  const time0 = $('time').firstChild.textContent;
  $('rarbox').click(); const rarToast = d.body.textContent.includes('💎 Punti rarità: Più un comune è piccolo');
  $('go').click();
  const inp = $('inp'); const type = v=>{ inp.value = v; inp.dispatchEvent(new w.Event('input')); };
  type('vodo di cadore'); console.log(' after vodo di cadore:', $('cnt').textContent);
  type('Calalzo'); type('calalzo di cadore'); console.log(' after calalzo:', $('cnt').textContent);
  type('Lampedusa e Linosa'); type('lipari'); type('leni'); type('malfa'); type('santa marina salina');
  console.log(' after eolie:', $('cnt').textContent, '| ach:', $('achc').textContent);
  const al = $('achlist').textContent; console.log(' Eolie in list:', /Isole Eolie/.test(al), '| Cammini section:', /Cammini/.test(al), '| Costa:', /Costa italiana/.test(al));
  type('roma'); type('roma'); console.log(' dup notice:', d.querySelector('div[style*="--bad"]').textContent);
  console.log(' islands groups text:', (al.match(/Isole minori italiane[^\n]*/)||[''])[0].slice(0,60));
  // omonimi: "castro" vale per Castro (BG) e Castro (LE)
  const raffica = () => (($('achlist').textContent.match(/(🔒|⚡) Raffica/)||[])[1]);
  const raf0 = raffica();
  const before = +$('cnt').textContent; type('castro');
  const raf1 = raffica(), rafSaved = (JSON.parse(w.localStorage.getItem('comuniQuizV1')).a||[]).includes('raffica');
  console.log(' raffica:', raf0, '->', raf1, '| salvata:', rafSaved); const afterCastro = +$('cnt').textContent;
  type('Castro'); const castroDup = d.querySelector('div[style*="--bad"]').textContent;
  console.log(' castro:', before, '->', afterCastro, '| dup:', castroDup);
  // tema: automatico -> chiaro -> scuro -> automatico
  const docEl = d.documentElement, themes = [];
  for(let k=0;k<3;k++){ $('theme').click(); themes.push((docEl.dataset.theme||'auto') + ':' + (w.localStorage.getItem('comuniQuizTheme')||'-') + ':' + $('theme').title); }
  console.log(' theme cycle:', themes.join(' | '));
  // traguardi segreti: nascosti fino a 69 e 420 comuni
  const map = JSON.parse(fs.readFileSync(path.join(root, 'data/map.json'), 'utf8')), names = map.n;
  let ni = 0; const fillTo = n => { while(+$('cnt').textContent < n && ni < names.length) type(names[ni++]); };
  const achText = () => $('achlist').textContent;
  const tourRow = (re = /(🔒|🧭) Giro delle province\s*(\d+\/\d+)/) => { const m = achText().match(re); return m ? m[1]+' '+m[2] : '?'; };
  const italyRow = () => tourRow(/(🔒|🇮🇹) Giro d’Italia\s*(\d+\/\d+)/);
  const tour0 = tourRow(), italy0 = italyRow();
  fillTo(60); const sec60 = achText();
  fillTo(69); const sec69 = achText();
  fillTo(420); const sec420 = achText();
  // giro delle province: un comune per ciascuna provincia
  const provs = [...new Set(map.p)], tourBefore = tourRow();
  provs.forEach(p => { const i = map.p.indexOf(p); if(!tourRow().startsWith('🧭')) type(names[i]); });
  const tourAfter = tourRow(), italyAfter = italyRow();
  console.log(' province tour:', tour0, '->', tourBefore, '->', tourAfter, '| italy:', italy0, '->', italyAfter);
  const pops = JSON.parse(fs.readFileSync(path.join(root, 'data/extra.json'), 'utf8')).pop;
  const popShown = $('pop').textContent, popExpected = [...names.keys()].filter(i => w.document.querySelector('#regs li[data-i="'+i+'"]')).reduce((a,i)=>a+pops[i],0);
  console.log(' persone beccate:', popShown);
  const recRows = () => [...$('achlist').querySelectorAll('.ai')].filter(e => /Il (più|meno) /.test(e.textContent)).map(e => [...e.children].map(c => c.textContent).join(' = '));
  const rec0 = recRows();
  ['Predoi', 'Lampedusa e Linosa', 'Atrani', 'Morterone'].forEach(type);
  const rec1 = recRows();
  console.log(' records:', rec1.join(' | '));
  // storia, repubbliche marinare, confini
  const row = re => ([...$('achlist').querySelectorAll('.ai')].find(e => re.test(e.textContent)) || {}).textContent || '?';
  const mar0 = row(/Le quattro repubbliche/);
  ['Amalfi', 'Genova', 'Pisa', 'Venezia'].forEach(type);
  const mar1 = row(/Le quattro repubbliche/), mar2 = row(/Non erano solo quattro/);
  type('San Giustino'); const cosp = row(/Repubblica di Cospaia/);
  const confRows = ['la Francia', 'la Svizzera', 'l’Austria', 'la Slovenia', 'San Marino', 'il Vaticano'].map(s => (row(new RegExp('Tutto il confine con ' + s)).match(/\d+\/\d+$/) || ['?'])[0].split('/')[1]);
  ['Livo (CO)', 'Ventimiglia', 'Como', 'Brennero', 'Gorizia', 'Rimini'].forEach(n => type(n.replace(/ \(..\)$/, '')));
  const giro = row(/Giro delle frontiere/);
  console.log(' storia:', mar0.slice(0, 2), '->', mar1, '|', mar2.slice(0, 2), '|', cosp.slice(0, 60), '| confini', confRows.join(','), '|', giro);
  // capoluoghi: si trovano tutti scrivendone i nomi
  const caps = JSON.parse(fs.readFileSync(path.join(root, 'data/extra.json'), 'utf8')).cap;
  const capBefore = (achText().match(/Tutti i capoluoghi\s*(\d+\/\d+)/)||[])[1];
  caps.forEach(i => type(names[i].split('/')[0]));
  const capAfter = (achText().match(/(🔒|🏛️) Tutti i capoluoghi\s*(\d+\/\d+)/)||[]).slice(1).join(' ');
  console.log(' capoluoghi:', capBefore, '->', capAfter);
  // comuni piccoli: rarità, borghi, tesori di provincia
  const PMAX = Math.max(...pops), rar = pops.map(x => Math.max(1, Math.round(10*Math.log10(PMAX/x))));
  const foundIdx = () => [...names.keys()].filter(i => w.document.querySelector('#regs li[data-i="'+i+'"]'));
  const tesori = [...new Set(map.p)].map(p => map.p.reduce((b, q, i) => q === p && (b < 0 || pops[i] < pops[b]) ? i : b, -1));
  [...names.keys()].filter(i => pops[i] < 100).forEach(i => type(names[i].split('/')[0]));
  tesori.forEach(i => type(names[i].split('/')[0]));
  const fi = foundIdx(), rarShown = $('rar').textContent, rarExpected = fi.reduce((a,i)=>a+rar[i],0).toLocaleString('it-IT');
  const small = achText(), borghi = fi.filter(i => pops[i] < 1000).length;
  console.log(' rarità:', rarShown, '| borghi:', borghi, '| tesori:', (small.match(/Tesori di provincia\s*\d+\/\d+/)||['?'])[0]);
  console.log(' secrets:', [sec60, sec69, sec420].map(t => (t.match(/Segreti\s*\d+\/\d+/)||['?'])[0]).join(' -> '));
  // pannello laterale: schede, filtro dei traguardi, ordinamento delle regioni
  const tabs0 = $('paneA').hidden && !$('paneR').hidden; $('tabA').click();
  const tabs1 = !$('paneA').hidden && $('paneR').hidden && $('tabA').getAttribute('aria-selected') === 'true'; $('tabR').click();
  // righe pesate: Italia a piedi vale data-w obiettivi
  const filt = f => { d.querySelector('#achfilt [data-f="' + f + '"]').click(); return [...$('achlist').querySelectorAll('.ai')].reduce((a, e) => a + (+e.dataset.w || 1), 0); };
  const nAll = filt('all'), nDone = filt('done'), nTodo = filt('todo'); filt('all');
  const [achN, achT] = [+$('achn').textContent, +$('acht').textContent];
  const order = () => [...d.querySelectorAll('#regs > .reg')].sort((a,b) => a.style.order - b.style.order).map(e => e.querySelector('.rn').textContent);
  const sortBy = s => { d.querySelector('#regsort [data-s="' + s + '"]').click(); return order(); };
  const pctOf = n => { const e = [...d.querySelectorAll('#regs > .reg')].find(x => x.querySelector('.rn').textContent === n); return parseInt(e.querySelector('.pc').textContent) || 0; };
  const byPct = sortBy('pct'), byMiss = sortBy('miss'), byAz = sortBy('az');
  console.log(' side: tabs', tabs0, tabs1, '| traguardi', nDone, '+', nTodo, '=', nAll, '(', achN, '/', achT, ') | % first:', byPct[0], '| az first:', byAz[0]);
  console.log(' errors:', errors.length ? errors : 'none');
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (' + label + '): ' + msg); process.exitCode = 1; } };
  ok($('tot').textContent === '7896', 'totale comuni');
  ok(time0 === '0:00:00', 'timer a zero al caricamento (era ' + time0 + ')');
  ok(errors.length === 0, 'errori JS');
  ok(/^🔒/.test(mar0) && /^⚓ Le quattro repubbliche marinarei quattro stemmi/.test(mar1) && /^🔒 Non erano solo quattro0\/3$/.test(mar2), 'repubbliche marinare: le quattro, la nota delle altre nascosta');
  ok(/^📜 Repubblica di Cospaiadal 1441/.test(cosp), 'Cospaia sbloccata da San Giustino, con la nota');
  ok(confRows.join() === '39,87,27,25,7,1' && /^🛂 Giro delle frontiere/.test(giro), 'comuni di confine e giro delle frontiere');
  ok(tabs0 && tabs1 && !$('paneR').hidden, 'schede Regioni / Traguardi');
  ok(nDone + nTodo === nAll && nAll === achT && nDone === achN && nDone > 0 && nTodo > 0, 'filtro traguardi: sbloccati + da fare = tutti');
  ok(byAz[0] === 'Abruzzo' && byAz.join() === [...byAz].sort((a,b) => a.localeCompare(b,'it')).join(), 'regioni in ordine alfabetico');
  ok(byPct.every((n,j) => j === 0 || pctOf(byPct[j-1]) >= pctOf(n)) && byMiss.length === 20, 'regioni per percentuale');
  ok(before === 8, 'conteggio dopo le risposte di prova');
  ok(afterCastro === before + 2, 'omonimi: entrambi i Castro');
  ok(raf0 === '🔒' && raf1 === '⚡' && rafSaved, 'raffica: 10 comuni in pochi secondi, salvata');
  ok(castroDup === 'Già indovinato: Castro (2 comuni con questo nome)', 'avviso doppione per omonimi');
  ok(/Segreti\s*0\/2/.test(sec60) && !/Nice|Blaze/.test(sec60) && (sec60.match(/🔒 \?\?\?/g)||[]).length === 2, 'segreti nascosti prima di 69');
  // con Roma (2,7 milioni, il 4,7%) si supera subito l'1% della popolazione
  ok(/👥 Un italiano su cento/.test(sec60) && /🔒 Un italiano su dieci/.test(sec60), 'persone beccate: 1% sì, 10% no');
  ok(/Segreti\s*1\/2/.test(sec69) && /😏 Nice\./.test(sec69) && !/Blaze/.test(sec69), 'segreto 69: Nice.');
  ok(/Segreti\s*2\/2/.test(sec420) && /🌿 Blaze it/.test(sec420) && !/Quattro e venti/.test(sec420), 'segreto 420: Blaze it');
  ok(popShown === popExpected.toLocaleString('it-IT') && popExpected > 0, 'persone beccate (' + popShown + ' invece di ' + popExpected + ')');
  ok(tour0 === '🔒 6/' + provs.length && italy0 === '🔒 5/20', 'esplorazione: contatori iniziali');
  ok(italyAfter === '🇮🇹 20/20' && /Esplorazione\s*2\/2/.test(achText()), 'giro d’Italia sbloccato');
  ok(/^🔒/.test(tourBefore) && tourAfter === '🧭 ' + provs.length + '/' + provs.length, 'giro delle province sbloccato');
  // prima: Roma (più grande e più popoloso), Lampedusa (più a sud, già scritta) e Bardonecchia (più a ovest, tra i primi 420)
  ok(rec0.length === 8 && rec0.filter(r => /^🔒/.test(r)).length === 4 && rec0.includes('🏙️ Il più popoloso = Roma') && rec0.includes('🗺️ Il più grande = Roma') && rec0.includes('🔒 Il più a nord = ?'), 'record nascosti finché non trovati');
  ok(['⬆️ Il più a nord = Predoi', '⬇️ Il più a sud = Lampedusa e Linosa', '⬅️ Il più a ovest = Bardonecchia', '🔎 Il più piccolo = Atrani', '🏚️ Il meno popoloso = Morterone'].every(r => rec1.includes(r)) && rec1.filter(r => /^🔒/.test(r)).length === 1, 'record: nord, sud, ovest, piccolo, meno popoloso');
  ok(/^\d+\/119$/.test(capBefore) && capAfter === '🏛️ 119/119' && /Capoluoghi\s*1\/1/.test(achText()), 'capoluoghi');
  ok(rarToast && /Morterone \(32 abitanti\) 49/.test($('rarbox').title), 'spiegazione dei punti rarità');
  ok(rarShown === rarExpected,'punti rarità (' + rarShown + ' invece di ' + rarExpected + ')');
  ok(small.includes('Borghi (sotto ' + (1000).toLocaleString('it-IT') + ' ab.)') && small.includes(borghi + '/' + (2023).toLocaleString('it-IT') + ' borghi trovati') && /🔬 Tutti i microcomuni/.test(small), 'borghi e microcomuni');
  ok(/Tesori di provincia\s*3\/3/.test(small) && small.includes('110/110 trovati') && /🗝️ Tutti i tesori/.test(small) && /Lecco: Morterone/.test(small), 'tesori di provincia');
  ok(themes.join('|') === 'light:light:Tema: chiaro|dark:dark:Tema: scuro|auto:-:Tema: automatico', 'ciclo del tema');
  // licenza dei dati e privacy nel footer
  const foot = d.querySelector('.foot'), links = [...foot.querySelectorAll('a')].map(a=>a.href);
  ok(/ISTAT/.test(foot.textContent) && /semplificati e modificati/.test(foot.textContent), 'attribuzione ISTAT');
  ok(links.includes('https://github.com/openpolis/geojson-italy') && links.includes('https://creativecommons.org/licenses/by/4.0/deed.it'), 'link openpolis e licenza CC BY 4.0');
  ok(/Natural Earth/.test(foot.textContent) && /pubblico dominio/.test(foot.textContent), 'credito Natural Earth');
  ok(/Nessun cookie/.test(foot.textContent) && d.cookie === '', 'nessun cookie');
  if(!useFetch) ok(!d.querySelector('script[src], link[rel="stylesheet"]') && d.getElementById('data'), 'file unico senza risorse esterne');
  // ricerca: titolo, descrizione, indirizzo canonico, anteprime, dati strutturati, favicon incorporata, testo visibile
  const meta = sel => (d.querySelector(sel)||{}).content || '';
  const site = 'https://piero3vis.github.io/comuni-quiz/';
  ok(/^Quiz dei comuni d’Italia/.test(d.title), 'titolo');
  ok(meta('meta[name="description"]').length > 50 && meta('meta[property="og:description"]') === meta('meta[name="description"]'), 'descrizione');
  ok(d.querySelector('link[rel="canonical"]').href === site && meta('meta[property="og:url"]') === site, 'indirizzo canonico');
  ok(meta('meta[property="og:title"]') === d.title && meta('meta[property="og:locale"]') === 'it_IT', 'anteprime Open Graph');
  let ld = {}; try { ld = JSON.parse(d.querySelector('script[type="application/ld+json"]').textContent); } catch(e){}
  ok(ld['@type'] === 'WebApplication' && ld.inLanguage === 'it' && ld.isAccessibleForFree === true && ld.url === site, 'dati strutturati');
  ok(/^data:image\/svg\+xml,/.test(d.querySelector('link[rel="icon"]').getAttribute('href')), 'favicon incorporata');
  ok(/comuni italiani/.test(d.querySelector('.about').textContent) && /gioco di geografia/.test(d.querySelector('.about').textContent), 'testo visibile');
  ok(/Isole Eolie/.test(al) && /Cammini/.test(al) && /Costa italiana/.test(al), 'sezioni traguardi');
  dom.window.close();
}
// timer: riparte dal tempo salvato e lo salva correttamente in pausa
async function runTimer(){
  const html = fs.readFileSync(path.join(root, 'dist/quiz.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w){
      w.Path2D = class {};
      const noop = new Proxy(function(){}, { get: (t,k)=> k==='isPointInPath' ? ()=>false : (k==='measureText'? ()=>({width:0}) : noop), apply: ()=>undefined, set: ()=>true });
      w.HTMLCanvasElement.prototype.getContext = ()=>noop;
      w.localStorage.clear(); w.localStorage.setItem('comuniQuizV1', JSON.stringify({ f: [0, 1], t: 65000, a: ['raffica', 'sconosciuta'] }));
    }});
  await new Promise(r=>setTimeout(r,1500));
  const w = dom.window, $ = id=>w.document.getElementById(id), shown = ()=>$('time').firstChild.textContent;
  const onLoad = shown(), rafLoaded = /⚡ Raffica/.test($('achlist').textContent) && !/sconosciuta/.test($('achlist').textContent);
  $('go').click(); await new Promise(r=>setTimeout(r,1200)); const running = shown();
  $('go').click(); const saved = JSON.parse(w.localStorage.getItem('comuniQuizV1')).t;
  await new Promise(r=>setTimeout(r,700)); const paused = shown();
  console.log('timer: load', onLoad, '| running', running, '| paused', paused, '| saved', saved);
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (timer): ' + msg); process.exitCode = 1; } };
  ok(rafLoaded, 'raffica ripristinata dal salvataggio');
  ok(onLoad === '0:01:05', 'tempo salvato mostrato al caricamento');
  ok(running === '0:01:06', 'il timer riparte dal tempo salvato');
  ok(saved >= 66000 && saved < 68000, 'tempo salvato in pausa');
  ok(paused === running, 'il timer resta fermo in pausa');
  dom.window.close();
}
// resa: mostra tutti i comuni, resta valida dopo il ricaricamento, "Ricomincia" cancella la partita
async function runGiveUp(){
  const html = fs.readFileSync(path.join(root, 'dist/quiz.html'), 'utf8');
  const open = async saved => {
    const errors = [];
    const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
      beforeParse(w){
        w.Path2D = class {};
        const noop = new Proxy(function(){}, { get: (t,k)=> k==='isPointInPath' ? ()=>false : (k==='measureText'? ()=>({width:0}) : noop), apply: ()=>undefined, set: ()=>true });
        w.HTMLCanvasElement.prototype.getContext = ()=>noop; w.confirm = ()=>true;
        w.addEventListener('error', e=>errors.push(e.message));
        w.localStorage.clear(); if(saved) w.localStorage.setItem('comuniQuizV1', saved);
      }});
    await new Promise(r=>setTimeout(r,1500));
    const w = dom.window, d = w.document, $ = id=>d.getElementById(id);
    const state = () => [$('go').textContent, $('go').disabled, $('giveup').disabled, $('inp').disabled, d.querySelectorAll('#regs li').length, d.querySelectorAll('#regs li.miss').length].join(',');
    return { w, $, state, errors, dom };
  };
  let p = await open();
  p.$('go').click(); ['roma', 'milano', 'napoli'].forEach(n => { p.$('inp').value = n; p.$('inp').dispatchEvent(new p.w.Event('input')); });
  p.$('giveup').click();
  const after = p.state(), saved = p.w.localStorage.getItem('comuniQuizV1'); p.dom.window.close();
  p = await open(saved); const reload = p.state();
  p.$('go').click(); const cleared = p.w.localStorage.getItem('comuniQuizV1');
  console.log('resa:', after, '| ricaricata:', reload, '| dopo Ricomincia:', cleared);
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (resa): ' + msg); process.exitCode = 1; } };
  ok(after === 'Ricomincia,false,true,true,7896,7893', 'dopo la resa: tutti i comuni in elenco e pulsante Ricomincia');
  ok(JSON.parse(saved).g === 1 && reload === after, 'la resa resta dopo il ricaricamento');
  ok(cleared === null, 'Ricomincia cancella la partita salvata');
  ok(p.errors.length === 0, 'errori JS');
  p.dom.window.close();
}
// curiosità: nessun testo contiene il nome del comune; il riquadro del clic mostra il menu chiuso (indizio prima, curiosità dopo)
async function runFacts(){
  const map = JSON.parse(fs.readFileSync(path.join(root, 'data/map.json'), 'utf8')), facts = JSON.parse(fs.readFileSync(path.join(root, 'data/facts.json'), 'utf8'));
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (curiosità): ' + msg); process.exitCode = 1; } };
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const leaks = Object.entries(facts).filter(([nm, t]) => nm.replace(/ \([A-Z]{2}\)$/, '').split('/').some(part => norm(t).includes(norm(part))));
  ok(leaks.length === 0, 'il nome compare nella curiosità: ' + leaks.map(x => x[0]).join(', '));
  ok(Object.values(facts).every(t => t.length <= 200 && !/'/.test(t)), 'curiosità brevi, con l’apostrofo tipografico');
  const html = fs.readFileSync(path.join(root, 'dist/quiz.html'), 'utf8'), errors = [];
  const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
    beforeParse(w){
      w.Path2D = class { constructor(s){ this.s = s; } };
      const noop = new Proxy(function(){}, { get: (t,k)=> k==='isPointInPath' ? (p => !!p && p.s === w.hit) : (k==='measureText'? ()=>({width:0}) : noop), apply: ()=>undefined, set: ()=>true });
      w.HTMLCanvasElement.prototype.getContext = ()=>noop; w.HTMLElement.prototype.setPointerCapture = ()=>{};
      w.addEventListener('error', e=>errors.push(e.message)); w.localStorage.clear();
    }});
  await new Promise(r=>setTimeout(r,1500));
  const w = dom.window, d = w.document, $ = id=>d.getElementById(id), cv = $('cv');
  const click = nm => { w.hit = map.d[map.n.indexOf(nm)]; ['pointerdown','pointerup'].forEach(t => cv.dispatchEvent(new w.MouseEvent(t, { clientX: 100, clientY: 100 }))); return [...d.querySelectorAll('#mapbox > div')].find(el => el.style.display === 'block' && el.querySelector('#reveal, b')); };
  let box = click('Elva'); const before = box && box.querySelector('details.fact');
  const hint = before && !before.open && before.querySelector('summary').textContent === '💡 Indizio: una curiosità' && before.querySelector('p').textContent === facts['Elva'];
  $('go').click(); $('inp').value = 'elva'; $('inp').dispatchEvent(new w.Event('input'));
  box = click('Elva'); const after = box && box.querySelector('details.fact');
  const shown = after && !after.open && after.querySelector('summary').textContent === '💡 Curiosità' && /abitanti/.test(box.textContent);
  box = click('Milano'); const none = box && !box.querySelector('details.fact');
  console.log('curiosità:', Object.keys(facts).length, '| indizio:', !!hint, '| dopo:', !!shown, '| senza:', !!none);
  ok(hint, 'indizio chiuso per un comune non trovato'); ok(shown, 'curiosità chiusa sotto abitanti e rarità'); ok(none, 'nessun menu senza curiosità');
  ok(errors.length === 0, 'errori JS: ' + errors.join('; '));
  dom.window.close();
}
// geografia: confinanti, mari, isole (data/geo.json); da costa a costa, Giro d’Italia a tappe, Italia a piedi
async function runChallenges(){
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (sfide geografiche): ' + msg); process.exitCode = 1; } };
  const read = f => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
  const map = read('data/map.json'), geo = read('data/geo.json'), caps = new Set(read('data/extra.json').cap), N = map.n.length;
  const idx = nm => map.n.indexOf(nm), NB = map.n.map(() => []);
  geo.nb.forEach((ds, i) => ds.forEach(dj => { NB[i].push(i + dj); NB[i + dj].push(i); }));
  const co = new Set(map.co), ins = new Set(geo.ins), sea = i => geo.seas[geo.sea[i]], reg = i => map.regs[map.r[i]];
  // dati
  const bo = NB[idx('Bologna')].map(i => map.n[i]).sort().join(', ');
  ok(bo === "Anzola dell'Emilia, Calderara di Reno, Casalecchio di Reno, Castel Maggiore, Castenaso, Granarolo dell'Emilia, Pianoro, San Lazzaro di Savena, Sasso Marconi, Zola Predosa", 'confinanti di Bologna: ' + bo);
  ok(NB[idx('Messina')].every(i => reg(i) === 'Sicilia'), 'Messina non confina con la Calabria');
  const SEA = { Rimini: 'Adriatico', Gallipoli: 'Ionio', 'Villa San Giovanni': 'Tirreno', 'Reggio di Calabria': 'Ionio', Messina: 'Ionio', Agrigento: 'Canale di Sicilia', Alghero: 'Mar di Sardegna', Olbia: 'Tirreno', Livorno: 'Ligure', Follonica: 'Tirreno' };
  const badSea = Object.entries(SEA).filter(([nm, s]) => sea(idx(nm)) !== s).map(([nm]) => nm + '=' + sea(idx(nm)));
  ok(!badSea.length, 'mari di riferimento: ' + badSea.join(', '));
  ok(map.co.every(i => geo.sea[i] >= 0) && geo.sea.filter(s => s >= 0).length === map.co.length, 'un mare per ogni comune costiero, nessuno per gli altri');
  ok(['Palermo', 'Cagliari', 'Portoferraio', 'Lipari'].every(nm => ins.has(idx(nm))) && !ins.has(idx("Campione d'Italia")) && !ins.has(idx('Venezia')), 'comuni delle isole');
  // percorsi calcolati sui dati: nomi senza omonimi, cosi' ogni risposta trova un solo comune
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const keyCount = new Map(); map.n.forEach(nm => new Set(nm.split('/').concat([nm])).forEach(p => keyCount.set(norm(p), (keyCount.get(norm(p)) || 0) + 1)));
  const uniq = i => map.n[i].split('/').every(p => keyCount.get(norm(p)) === 1), allowed = i => !ins.has(i) && !caps.has(i);
  const bfs = (from, ok2, isGoal) => { const prev = new Map(from.map(s => [s, -1])), q = [...from]; for (let h = 0; h < q.length; h++) { const u = q[h]; if (isGoal(u)) { const p = []; for (let x = u; x >= 0; x = prev.get(x)) p.unshift(x); return p; } NB[u].forEach(v => { if (!prev.has(v) && ok2(v)) { prev.set(v, u); q.push(v); } }); } return null; };
  const html = fs.readFileSync(path.join(root, 'dist/quiz.html'), 'utf8');
  const open = async saved => {
    const errors = [], dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/', pretendToBeVisual: true,
      beforeParse(w){
        w.Path2D = class {};
        const noop = new Proxy(function(){}, { get: (t,k)=> k==='isPointInPath' ? ()=>false : (k==='measureText'? ()=>({width:0}) : noop), apply: ()=>undefined, set: ()=>true });
        w.HTMLCanvasElement.prototype.getContext = ()=>noop; w.addEventListener('error', e=>errors.push(e.message));
        const st = w.setTimeout.bind(w); w.setTimeout = (f, ms, ...a) => st(f, 0, ...a);   // gli avvisi in coda si mostrano subito
        w.localStorage.clear(); if (saved) w.localStorage.setItem('comuniQuizV1', saved);
      }});
    await new Promise(r=>setTimeout(r,1500));
    const w = dom.window, d = w.document, $ = id => d.getElementById(id);
    $('go').click();
    const type = i => { $('inp').value = map.n[i].split('/')[0]; $('inp').dispatchEvent(new w.Event('input')); };
    const row = re => ([...$('achlist').querySelectorAll('.ai')].find(e => re.test(e.textContent)) || {}).textContent || '?';
    const info = () => (d.querySelector('#achlist details[data-a="ch"] .info') || {}).textContent || '';
    const st = re => { const e = [...$('achlist').querySelectorAll('.ai')].find(x => re.test(x.textContent)); return e && e.querySelector('.st') ? e.querySelector('.st').textContent : '?'; };
    const toasts = []; new w.MutationObserver(() => [...d.querySelectorAll('#mapbox > div')].forEach(el => { if (/^(⛵|🚴|🚲|🚶|💡) /.test(el.textContent) && toasts[toasts.length - 1] !== el.textContent) toasts.push(el.textContent); })).observe(d.getElementById('mapbox'), { subtree: true, childList: true, characterData: true });
    return { w, d, $, type, row, info, st, toasts, errors, dom, saved: () => w.localStorage.getItem('comuniQuizV1'), settle: async () => { let n = -1; while (n !== toasts.length) { n = toasts.length; await new Promise(r => setTimeout(r, 300)); } } };   // finché arrivano avvisi
  };
  // 1. da costa a costa: lungo la costa intorno a Leuca non vale, con un comune dell'entroterra si'
  let p = await open();
  const ga = idx('Gagliano del Capo'), ca = idx('Castrignano del Capo');
  ok(co.has(ga) && co.has(ca) && NB[ga].includes(ca) && sea(ga) === 'Adriatico' && sea(ca) === 'Ionio', 'Leuca: due comuni costieri confinanti su mari diversi');
  [ga, ca].forEach(p.type); const leucaCoast = p.row(/Adriatico – Ionio/);
  // traversata piu' breve: comune costiero sul primo mare, comuni dell'entroterra, comune costiero sul secondo
  const on = s1 => j => co.has(j) && sea(j) === s1;
  const cross = (s1, s2) => { const mid = bfs([...map.n.keys()].filter(i => !co.has(i) && NB[i].some(on(s1))), i => !co.has(i), i => NB[i].some(on(s2))); return [NB[mid[0]].find(on(s1)), ...mid, NB[mid[mid.length - 1]].find(on(s2))]; };
  const ai = cross('Adriatico', 'Ionio'); ai.forEach(p.type); const leucaLand = p.row(/Adriatico – Ionio/);
  // Tirreno – Adriatico, scritto dall'Adriatico al Tirreno: l'ordine non conta
  const ta = cross('Tirreno', 'Adriatico');
  [...ta].reverse().forEach(p.type); const crossTA = p.row(/Tirreno – Adriatico/); await p.settle();
  console.log('costa a costa: Leuca', leucaCoast.slice(0, 2), '| A-I:', ai.map(i => map.n[i]).join(' > '), leucaLand, '| T-A:', ta.length, 'comuni,', crossTA, '|', p.toasts.filter(t => t.startsWith('⛵')).join(' / '));
  ok(/^🔒/.test(leucaCoast), 'lungo la costa non vale'); ok(/^⛵ Adriatico – Ionioda /.test(leucaLand), 'via terra vale, con "da … a …"');
  ok(/^⛵ Tirreno – Adriatico/.test(crossTA) && ta.slice(1, -1).every(i => !co.has(i)), 'Tirreno – Adriatico attraverso l’entroterra');
  ok(p.toasts.some(t => /^⛵ Da costa a costa: Tirreno – Adriatico, da .+ a .+!$/.test(t)), 'avviso da costa a costa');
  ok(p.errors.length === 0, 'errori JS: ' + p.errors.join('; ')); p.dom.window.close();
  // curiosità: avviso quando si trova un comune che ne ha una, nessun avviso per gli altri
  const facts = read('data/facts.json');
  p = await open(); p.type(idx('Elva')); p.type(idx('Milano')); await p.settle();
  const factToast = p.toasts.find(t => t.startsWith('💡')) || '-';
  console.log('curiosità sullo schermo:', factToast.slice(0, 60), '| totale', p.toasts.filter(t => t.startsWith('💡')).length);
  ok(factToast === '💡 Curiosità su Elva: ' + facts['Elva'] && p.toasts.filter(t => t.startsWith('💡')).length === 1, 'avviso con la curiosità solo per Elva');
  p.dom.window.close();
  // 2. Giro d’Italia a tappe
  const RADJ = map.regs.map(() => new Set()); NB.forEach((a, i) => a.forEach(j => { if (!ins.has(i) && !ins.has(j) && map.r[i] !== map.r[j]) RADJ[map.r[i]].add(map.r[j]); }));
  const R = nm => map.regs.indexOf(nm), used = new Set();
  const pickBy = test => { const i = map.n.findIndex((_, j) => test(j) && allowed(j) && uniq(j) && !used.has(j)); used.add(i); return i; };
  const pick = k => pickBy(j => map.r[j] === k), pickP = q => pickBy(j => map.p[j] === q);
  const mainRegs = [...new Set(map.r.filter((_, i) => !ins.has(i)))];
  const tour = []; (function dfs(k, seen){ seen.add(k); tour.push(k); [...RADJ[k]].sort((a, b) => a - b).forEach(x => { if (!seen.has(x)) { dfs(x, seen); tour.push(k); } }); })(R('Veneto'), new Set());
  p = await open();
  const GIRO = /^(🔒|🚴) Giro d’Italia a tappe/, GIROP = /^(🔒|🚲) Giro delle province a tappe/;
  const n18 = t => (/In corso: (\d+)\/18/.exec(t) || [])[1];
  const start0 = p.st(GIRO), help = p.row(GIRO);
  [R('Veneto'), R('Emilia-Romagna'), R('Toscana')].forEach(k => p.type(pick(k))); const g3 = p.st(GIRO);
  p.type(pick(R('Puglia'))); const jump = p.st(GIRO); await p.settle(); const jumpToast = p.toasts.find(t => /interrotto/.test(t)) || '-';
  p.type(pick(R('Campania'))); p.type(pick(R('Lazio'))); p.type(idx('Latina')); const capo = p.st(GIRO);
  let mid = null;
  let near = '';
  tour.forEach((k, s) => { p.type(pick(k)); if (s === 4) mid = { saved: p.saved(), next: tour[5] }; if (n18(p.st(GIRO)) === '13' && !near) near = p.st(GIRO); });
  const giroDone = p.row(GIRO), giroSaved = JSON.parse(p.saved()).a.includes('giro');
  console.log('giro:', start0, '|', g3, '|', jump, '|', jumpToast, '|', capo, '|', tour.length, 'tappe ->', giroDone.slice(0, 26), giroDone.slice(-5));
  ok(/^Per iniziare: /.test(start0) && /Parti da una regione qualsiasi/.test(help) && /puoi tornare in regioni già toccate/.test(help), 'regola e come iniziare');
  ok(/^In corso: 3\/18, ultima tappa in Toscana\. Prossima tappa in: Emilia-Romagna, Lazio, Liguria, Marche, Toscana, Umbria\. Mancano 15 regioni\.$/.test(g3), 'tre regioni confinanti di fila, con le prossime tappe');
  ok(/^In corso: 1\/18, ultima tappa in Puglia/.test(jump) && /^🚴 Giro d’Italia a tappe interrotto dopo 3 regioni: da Toscana a Puglia è un salto$/.test(jumpToast), 'un salto fa ripartire il giro');
  ok(/^Per iniziare: /.test(capo), 'un capoluogo interrompe il giro');
  ok(mainRegs.length === 18 && /^🚴 Giro d’Italia a tappe.*18\/18$/s.test(giroDone) && giroSaved, 'giro completo e salvato');
  ok(/ Mancano: [^,]+(, [^,]+){4}\.$/.test(near), 'con poche regioni mancanti si vede l’elenco: ' + near);
  ok(p.errors.length === 0, 'errori JS: ' + p.errors.join('; ')); p.dom.window.close();
  // il giro in corso resta dopo il ricaricamento (formato tr); un vecchio salvataggio gr si legge ancora
  const midN = JSON.parse(mid.saved).tr.giro; p = await open(mid.saved); const reload = p.st(GIRO);
  p.type(pick(mid.next)); const after = p.st(GIRO); p.dom.window.close();
  const fr = R('Friuli-Venezia Giulia'); p = await open(JSON.stringify({ f: [], t: 0, gr: [fr, 1 << fr] })); const old = p.st(GIRO); p.dom.window.close();
  console.log('giro ricaricato:', n18(reload), '->', n18(after), '| vecchio gr:', old);
  ok(Array.isArray(midN) && n18(reload) === String(midN[1].length), 'giro in corso ripristinato');
  ok(+n18(after) >= +n18(reload), 'la tappa successiva continua il giro');
  ok(old === 'In corso: 1/18, ultima tappa in Friuli-Venezia Giulia. Prossima tappa in: Friuli-Venezia Giulia, Veneto. Mancano 17 regioni.', 'vecchio salvataggio gr e prossime tappe dal Friuli');
  // 3. Giro delle province a tappe: Verona -> Mantova continua, Bari e' un salto; resta dopo il ricaricamento
  p = await open();
  const p0 = p.st(GIROP); p.type(pickP('VR')); p.type(pickP('MN')); const pVM = p.st(GIROP), pRow = p.row(GIROP), pSaved = p.saved();
  p.type(pickP('BA')); const pBA = p.st(GIROP); p.dom.window.close();
  p = await open(pSaved); const pReload = p.st(GIROP); p.dom.window.close();
  console.log('giro province:', pVM, '|', pBA.slice(0, 40), '| ricaricato:', pReload.slice(0, 40));
  ok(/^Per iniziare: /.test(p0) && /^In corso: 2\/93, ultima tappa in Mantova\. Prossima tappa in: .*Verona.*\. Mancano 91 province\.$/.test(pVM) && /2\/93$/.test(pRow), 'province confinanti di fila');
  ok(/^In corso: 1\/93, ultima tappa in Bari\./.test(pBA), 'salto tra province');
  ok(pReload === pVM, 'giro delle province ripristinato');
  // 4. Italia a piedi: i capoluoghi uniscono le catene; poi una catena attraverso le 18 regioni
  p = await open();
  const WALK = /^(🔒|🚶) Italia a piedi/, walkRow = () => p.row(WALK);
  let trio = null;
  for (const c of caps) { if (ins.has(c)) continue; const ns = NB[c].filter(allowed); for (const a of ns) { const b = ns.find(b => map.r[b] !== map.r[a] && !NB[a].includes(b) && !NB[a].some(x => NB[b].includes(x) && allowed(x))); if (b !== undefined) { trio = [a, c, b]; break; } } if (trio) break; }
  const walk0 = p.st(WALK); trio.forEach(p.type); const viaCap = walkRow(), viaCapSt = p.st(WALK);
  const start = trio[0], walk = new Set([start]);
  mainRegs.forEach(k => { const path2 = bfs([...walk], allowed, i => map.r[i] === k); path2.forEach(i => walk.add(i)); });
  let half = null; [...walk].forEach((i, s, all) => { p.type(i); if (s === Math.floor(all.length / 2)) half = walkRow(); });
  const walkDone = walkRow(); await p.settle();
  const okRows = [...p.$('achlist').querySelectorAll('.ai.ok')], wRow = okRows.find(e => /^🚶 Italia a piedi/.test(e.textContent));
  const weighted = okRows.reduce((a, e) => a + (+e.dataset.w || 1), 0) === +p.$('achn').textContent && +p.$('acht').textContent === p.$('achlist').querySelectorAll('.ai').length + 9;
  console.log('italia a piedi: via capoluogo', viaCapSt, '| a metà', half.slice(-5), '| fine', walkDone.slice(-5), '(', walk.size, 'comuni )');
  ok(walk0 === 'Nessuna catena per ora.' && /i capoluoghi valgono, le isole no/.test(viaCap), 'regola di Italia a piedi');
  ok(/^🔒 Italia a piedi.*2\/18$/s.test(viaCap) && /^La catena più lunga tocca 2\/18 regioni\. Mancano 16 regioni\.$/.test(viaCapSt), 'un capoluogo unisce due catene');
  ok(/^🔒 Italia a piedi.*\d+\/18$/s.test(half) && /^🚶 Italia a piedi.*18\/18$/s.test(walkDone), 'catena attraverso le 18 regioni');
  ok(p.toasts.some(t => /^🚶 Italia a piedi: /.test(t)), 'avviso Italia a piedi');
  ok(wRow && wRow.dataset.w === '10' && /Vale 10 obiettivi/.test(wRow.textContent) && weighted, 'Italia a piedi vale 10 nel totale');
  ok(p.errors.length === 0, 'errori JS: ' + p.errors.join('; ')); p.dom.window.close();
}
(async()=>{ await runChallenges(); await runFacts(); await runTimer(); await runGiveUp(); await run('single-file', 'dist/quiz.html', false); await run('multi-file', 'index.html', true); console.log(process.exitCode ? 'TEST FALLITO' : 'OK'); process.exit(process.exitCode || 0); })();
