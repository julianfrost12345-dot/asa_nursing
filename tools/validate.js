const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('app/src/main/assets/tests.js', 'utf8');
const ctx = vm.createContext({});
const tests = vm.runInContext(src + '\nTESTS', ctx);
if (tests.length !== 10) throw Error('Expected exactly 10 tests');
for (const t of tests) {
  if (!t.questions.length) throw Error('No questions in ' + t.id);
  const lows = t.questions.map(q => Math.min(...q.options.map(o => o.value).filter(Number.isFinite).filter(Number.isFinite)));
  const highs = t.questions.map(q => Math.max(...q.options.map(o => o.value)));
  const min = lows.reduce((a,b)=>a+b,0);
  const max = highs.reduce((a,b)=>a+b,0);
  if(min!==t.min || max!==t.max) throw Error(t.id + ' expected ' + t.min+'..'+t.max+' got '+min+'..'+max);
  console.log('PASS '+t.id+': '+t.questions.length+' questions, scores '+min+'..'+max);
}
console.log('All 10 scale validations passed.');
