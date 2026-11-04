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
  provs.forEach(p => { const i = map.p.indexOf(p); if(!$('achlist').textContent.includes('🧭')) type(names[i]); });
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
  console.log(' errors:', errors.length ? errors : 'none');
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (' + label + '): ' + msg); process.exitCode = 1; } };
  ok($('tot').textContent === '7896', 'totale comuni');
  ok(time0 === '0:00:00', 'timer a zero al caricamento (era ' + time0 + ')');
  ok(errors.length === 0, 'errori JS');
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
  ok(rarShown === rarExpected, 'punti rarità (' + rarShown + ' invece di ' + rarExpected + ')');
  ok(small.includes('Borghi (sotto ' + (1000).toLocaleString('it-IT') + ' ab.) ' + borghi + '/' + (2023).toLocaleString('it-IT')) && /🔬 Tutti i microcomuni/.test(small), 'borghi e microcomuni');
  ok(/Tesori di provincia\s*110\/110/.test(small) && /🗝️ Tutti i tesori/.test(small) && /Lecco: Morterone/.test(small), 'tesori di provincia');
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
(async()=>{ await runTimer(); await runGiveUp(); await run('single-file', 'dist/quiz.html', false); await run('multi-file', 'index.html', true); console.log(process.exitCode ? 'TEST FALLITO' : 'OK'); process.exit(process.exitCode || 0); })();
