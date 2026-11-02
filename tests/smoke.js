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
  console.log(' errors:', errors.length ? errors : 'none');
  const ok = (cond, msg) => { if (!cond) { console.error('FAIL (' + label + '): ' + msg); process.exitCode = 1; } };
  ok($('tot').textContent === '7896', 'totale comuni');
  ok(errors.length === 0, 'errori JS');
  ok(before === 8, 'conteggio dopo le risposte di prova');
  ok(afterCastro === before + 2, 'omonimi: entrambi i Castro');
  ok(castroDup === 'Già indovinato: Castro (2 comuni con questo nome)', 'avviso doppione per omonimi');
  ok(themes.join('|') === 'light:light:Tema: chiaro|dark:dark:Tema: scuro|auto:-:Tema: automatico', 'ciclo del tema');
  // licenza dei dati e privacy nel footer
  const foot = d.querySelector('.foot'), links = [...foot.querySelectorAll('a')].map(a=>a.href);
  ok(/ISTAT/.test(foot.textContent) && /semplificati e modificati/.test(foot.textContent), 'attribuzione ISTAT');
  ok(links.includes('https://github.com/openpolis/geojson-italy') && links.includes('https://creativecommons.org/licenses/by/4.0/deed.it'), 'link openpolis e licenza CC BY 4.0');
  ok(/Natural Earth/.test(foot.textContent) && /pubblico dominio/.test(foot.textContent), 'credito Natural Earth');
  ok(/Nessun cookie/.test(foot.textContent) && d.cookie === '', 'nessun cookie');
  if(!useFetch) ok(!d.querySelector('script[src], link[rel="stylesheet"]') && d.getElementById('data'), 'file unico senza risorse esterne');
  ok(/Isole Eolie/.test(al) && /Cammini/.test(al) && /Costa italiana/.test(al), 'sezioni traguardi');
  dom.window.close();
}
(async()=>{ await run('single-file', 'dist/quiz.html', false); await run('multi-file', 'index.html', true); console.log(process.exitCode ? 'TEST FALLITO' : 'OK'); process.exit(process.exitCode || 0); })();
