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
  const before = +$('cnt').textContent; type('castro'); const afterCastro = +$('cnt').textContent;
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
  console.log(' secrets:', [sec60, sec69, sec420].map(t => (t.match(/Segreti\s*\d+\/\d+/)||['?'])[0]).join(' -> '));
  console.log(' errors:', errors.length ? errors : 'none');
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (' + label + '): ' + msg); process.exitCode = 1; } };
  ok($('tot').textContent === '7896', 'totale comuni');
  ok(time0 === '0:00:00', 'timer a zero al caricamento (era ' + time0 + ')');
  ok(errors.length === 0, 'errori JS');
  ok(before === 8, 'conteggio dopo le risposte di prova');
  ok(afterCastro === before + 2, 'omonimi: entrambi i Castro');
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
      w.localStorage.clear(); w.localStorage.setItem('comuniQuizV1', JSON.stringify({ f: [0, 1], t: 65000 }));
    }});
  await new Promise(r=>setTimeout(r,1500));
  const w = dom.window, $ = id=>w.document.getElementById(id), shown = ()=>$('time').firstChild.textContent;
  const onLoad = shown();
  $('go').click(); await new Promise(r=>setTimeout(r,1200)); const running = shown();
  $('go').click(); const saved = JSON.parse(w.localStorage.getItem('comuniQuizV1')).t;
  await new Promise(r=>setTimeout(r,700)); const paused = shown();
  console.log('timer: load', onLoad, '| running', running, '| paused', paused, '| saved', saved);
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (timer): ' + msg); process.exitCode = 1; } };
  ok(onLoad === '0:01:05', 'tempo salvato mostrato al caricamento');
  ok(running === '0:01:06', 'il timer riparte dal tempo salvato');
  ok(saved >= 66000 && saved < 68000, 'tempo salvato in pausa');
  ok(paused === running, 'il timer resta fermo in pausa');
  dom.window.close();
}
(async()=>{ await runTimer(); await run('single-file', 'dist/quiz.html', false); await run('multi-file', 'index.html', true); console.log(process.exitCode ? 'TEST FALLITO' : 'OK'); process.exit(process.exitCode || 0); })();
