/* ASA Nursing: all processing stays on the device; no networking or patient data storage. */
(() => {
  'use strict';
  const root = document.getElementById('app');
  const state = { page:'home', previous:'list', selected:null, step:0, answers:[], term:'' };
  const fmt = n => new Intl.NumberFormat('fa-IR', {useGrouping:false}).format(n);
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const byId = id => TESTS.find(x => x.id === id);
  const header = (back=false) => `<header class="appbar"><button class="icon-button ${back?'':'is-hidden'}" type="button" data-action="back" aria-label="بازگشت">‹</button><div class="brand"><img src="asa_logo.png" alt="لوگوی ASA"><div><strong>ASA Nursing</strong><small>دستیار هوشمند ارزیابی پرستاری</small></div></div><div class="mini-tag">آفلاین</div></header>`;
  const footer = `<footer class="footer"><span>ساخته‌شده توسط <b>تیم ASA</b></span><span>نسخه آموزشی ۱.۰</span></footer>`;
  const shield = `<div class="safety"><span aria-hidden="true">ⓘ</span><span>این ابزار آموزشی است؛ برای تصمیم بالینی از ارزیابی کامل بیمار، نظر تیم درمان و دستورالعمل مرکز استفاده کنید.</span></div>`;
  const card = t => `<button class="test-card" type="button" data-action="detail" data-id="${t.id}">
    <span class="test-emoji" aria-hidden="true">${t.icon}</span><span class="test-copy"><b>${esc(t.title)}</b><small dir="ltr">${esc(t.en)}</small><span>${esc(t.blurb)}</span></span><span class="chevron">‹</span></button>`;
  function frame(content,back=false){ root.innerHTML=`<div class="shell">${header(back)}<main class="main">${content}</main>${footer}</div>`; window.scrollTo(0,0); }
  function home(){
    state.page='home'; state.selected=null;
    frame(`<section class="hero"><div class="hero-glow"></div><div class="pill">✦ ابزار یادگیری بالینی</div><h1>ارزیابی دقیق‌تر،<br><em>مراقبت آگاهانه‌تر</em></h1><p>۱۰ مقیاس کاربردی پرستاری با امتیازدهی خودکار، تفسیر نتیجه و پیشنهادهای مراقبتی.</p><div class="hero-icon"><img src="asa_logo.png" alt="ASA Nursing"></div></section>
      <section class="primary-actions"><button class="action-card" data-action="search"><span class="action-icon">⌕</span><b>جستجوی تست</b><small>پیدا کردن مقیاس مورد نیاز</small><span class="arrow">←</span></button>
      <button class="action-card" data-action="list"><span class="action-icon">▤</span><b>لیست تست‌ها</b><small>مشاهده تمامی ۱۰ مقیاس</small><span class="arrow">←</span></button></section>
      <div class="stats"><div><strong>۱۰</strong><small>مقیاس بالینی</small></div><div><strong>۱۰۰٪</strong><small>بدون اینترنت</small></div><div><strong>ASA</strong><small>تیم سازنده</small></div></div>${shield}`);
  }
  function list(isSearch=false){
    state.page = isSearch?'search':'list';
    frame(`<section class="page-heading"><div class="eyebrow">مرجع سریع دانشجوی پرستاری</div><h1>${isSearch?'جستجوی تست‌ها':'لیست تست‌ها'}</h1><p>برای مشاهده سؤالات و راهنمای کاربرد، یک تست را انتخاب کنید.</p></section>
      <label class="search-wrapper" for="test-search"><span aria-hidden="true">⌕</span><input id="test-search" type="search" placeholder="نام فارسی، انگلیسی یا کاربرد تست..." autocomplete="off" value="${esc(state.term)}"></label>
      <div class="list-meta" id="list-meta"></div><div id="test-list" class="test-list"></div>${shield}`,true);
    updateList();
    if(isSearch) document.getElementById('test-search').focus();
  }
  function updateList(){
    const query=state.term.trim().toLocaleLowerCase();
    const filtered=TESTS.filter(t=>`${t.title} ${t.en} ${t.blurb} ${t.category}`.toLocaleLowerCase().includes(query));
    document.getElementById('list-meta').textContent=`${fmt(filtered.length)} تست ${query?'یافت شد':'آماده ارزیابی'}`;
    document.getElementById('test-list').innerHTML=filtered.length ? filtered.map(card).join('') : `<div class="empty">نتیجه‌ای یافت نشد. عبارت دیگری وارد کنید.</div>`;
  }
  function detail(t){
    if(['home','list','search'].includes(state.page)) state.previous=state.page;
    state.page='detail'; state.selected=t.id;
    frame(`<section class="detail-hero"><div class="detail-icon">${t.icon}</div><div class="eyebrow">${esc(t.category)}</div><h1>${esc(t.title)}</h1><div class="en-title" dir="ltr">${esc(t.en)}</div><p>${esc(t.blurb)}</p></section>
      <div class="info-grid"><div><small>تعداد سؤالات</small><strong>${fmt(t.questions.length)}</strong></div><div><small>بازه امتیاز</small><strong dir="ltr">${fmt(t.min)} – ${fmt(t.max)}</strong></div></div>
      <section class="info-panel"><h2>موارد استفاده</h2><p>${esc(t.context)}</p><h2>تفسیر کلی</h2><p>${esc(t.direction)}</p></section>
      ${shield}<button class="solid-button" type="button" data-action="start">شروع ارزیابی <span>←</span></button>
      <p class="source-text">منبع معیار امتیازدهی: <a href="${esc(t.source)}" rel="noopener">${esc(t.sourceName)} ↗</a></p>`,true);
  }
  function quiz(){
    const t=byId(state.selected); if(!t) return home();
    state.page='quiz'; const q=t.questions[state.step]; const selected=state.answers[state.step];
    const pct=Math.round(100*(state.step+1)/t.questions.length);
    frame(`<div class="quiz-header"><div class="eyebrow">${esc(t.title)}</div><div class="quiz-count">سؤال ${fmt(state.step+1)} از ${fmt(t.questions.length)}</div><div class="progress-track"><div style="width:${pct}%"></div></div></div>
      <section class="question"><div class="question-indicator">${t.icon} <span>سؤال ${fmt(state.step+1)}</span></div><h1>${esc(q.title)}</h1><p>${esc(q.help)}</p><div class="option-list">${q.options.map((o,i)=>`<button type="button" class="option ${selected===i?'selected':''}" data-action="choose" data-index="${i}" aria-pressed="${selected===i}"><span class="option-radio"></span><span class="option-label">${esc(o.label)}</span><span class="points" dir="ltr">${o.value===null?'NT':fmt(o.value)}</span></button>`).join('')}</div></section>
      <div class="quiz-actions"><button class="outline-button" type="button" data-action="prev" ${state.step===0?'disabled':''}>→ قبلی</button><button class="solid-button" type="button" data-action="next" ${selected===undefined?'disabled':''}>${state.step===t.questions.length-1?'مشاهده نتیجه':'بعدی'} <span>←</span></button></div>`,true);
  }
  function decide(t, score, invalid){
    if(invalid) return {title:'امتیاز کل قابل محاسبه نیست',tone:'watch',description:'حداقل یکی از اجزای GCS غیرقابل ارزیابی (NT) است. نمره کل نباید با جایگزینی عدد ۱ محاسبه شود.',advice:[
      'اجزای قابل ارزیابی را به‌صورت E / V / M ثبت کنید و علت NT را یادداشت کنید.','تغییرات هوشیاری، تنفس و وضعیت عصبی را مطابق پروتکل پایش کنید.','در صورت افت حاد سطح هوشیاری یا مشکل راه هوایی، فوراً به تیم درمان اطلاع دهید.']};
    switch(t.id){
      case 'braden': {
        const risk=score<=9?'خطر بسیار بالا':score<=12?'خطر بالا':score<=14?'خطر متوسط':score<=18?'خطر خفیف':'خطر پایین در این مقیاس';
        return {title:risk,tone:score<=12?'danger':score<=18?'watch':'ok',description:'در برادن نمره کمتر با احتمال بیشتر آسیب فشاری همراه است. آستانه‌ها طبق پروتکل مرکز ممکن است متفاوت باشند.', advice:score<=18?[
          'پوست و نواحی تحت فشار را منظم مشاهده و ثبت کنید؛ هرگونه قرمزی پایدار را گزارش دهید.','برنامه تغییر وضعیت فردمحور، کاهش فشار و سطح حمایتی مناسب را اجرا کنید.','پوست را از رطوبت محافظت و وضعیت تغذیه و مایعات را با تیم درمان بررسی کنید.','از کشیدن بیمار روی ملحفه و ایجاد اصطکاک یا نیروهای برشی پرهیز کنید.'
        ]:['بررسی روزانه پوست و بازسنجی خطر با تغییر وضعیت بیمار را ادامه دهید.','تحرک ایمن، تغذیه کافی و مراقبت پوستی استاندارد را تقویت کنید.']}; }
      case 'morse': return {title:score>=45?'خطر بالای سقوط':score>=25?'خطر متوسط سقوط':'خطر پایین سقوط',tone:score>=45?'danger':score>=25?'watch':'ok',description:'نتیجه بر اساس برش رایج ۰–۲۴، ۲۵–۴۴ و ۴۵ به بالا است؛ خط‌مشی بیمارستان ملاک نهایی است.',advice:score>=25?[
        'برنامه پیشگیری از سقوط متناسب با خطر و پروتکل بخش را فعال کنید.','زنگ احضار و وسایل ضروری را در دسترس بیمار قرار دهید؛ مسیر رفت‌وآمد را ایمن کنید.','نیاز به کمک هنگام بلندشدن، سرویس بهداشتی و جابه‌جایی را مشخص کنید.','داروهای مرتبط با افت فشار یا سرگیجه و وضعیت شناختی را با تیم درمان مرور کنید.'
      ]:['آموزش استفاده از زنگ احضار و کفش مناسب را ادامه دهید.','با تغییر وضعیت بالینی یا سقوط جدید، خطر را دوباره ارزیابی کنید.']};
      case 'gcs': return {title:score<=8?'کاهش شدید پاسخ‌دهی':score<=12?'کاهش متوسط پاسخ‌دهی':'پاسخ‌دهی نسبتاً حفظ‌شده',tone:score<=8?'danger':score<=12?'watch':'ok',description:'برچسب‌های خفیف/متوسط/شدید معمولاً در ارزیابی آسیب مغزی تروماتیک استفاده می‌شوند؛ GCS به‌تنهایی تشخیص نیست.',advice:score<=12?[
        'وضعیت راه هوایی، تنفس، اکسیژناسیون و علائم حیاتی را فوراً بررسی کنید.','هر تغییر در اجزای E/V/M، مردمک‌ها و وضعیت عصبی را ثبت و طبق پروتکل گزارش کنید.','در کاهش حاد هوشیاری یا GCS پایین، ارزیابی فوری تیم درمان را درخواست کنید.'
      ]:['اجزای E/V/M را جداگانه ثبت کنید و تغییرات نسبت به ارزیابی قبلی را پایش کنید.','عوامل مداخله‌گر مانند داروهای آرام‌بخش، مشکلات شنوایی و اختلال ارتباط را لحاظ کنید.']};
      case 'nrs': return {title:score===0?'درد گزارش نشده':score<=3?'درد خفیف':score<=6?'درد متوسط':'درد شدید',tone:score>=7?'danger':score>=4?'watch':'ok',description:'نمره NRS گزارش خود بیمار است؛ برش‌های شدت تقریبی‌اند و هدف کنترل درد فردی است.',advice:score>0?[
        'محل، کیفیت، مدت، عوامل تشدیدکننده و اثر درد بر عملکرد را بررسی کنید.','مداخلات دارویی تجویزشده و روش‌های غیردارویی مناسب را طبق پروتکل بررسی و اجرا کنید.','پس از مداخله، شدت درد و پاسخ بیمار را دوباره ارزیابی و ثبت کنید.'
      ]:['در صورت تغییر وضعیت بیمار، درد را مجدداً سؤال و ثبت کنید.','بروز درد حین حرکت یا مراقبت را هم بررسی کنید.']};
      case 'rass': return {title:score>=2?'آشفتگی قابل‌توجه':score===1?'بی‌قراری خفیف':score===0?'هوشیار و آرام':score>=-2?'آرام‌بخشی سبک':'آرام‌بخشی عمیق‌تر',tone:score>=2||score<=-4?'danger':score===0?'ok':'watch',description:'هدف RASS بسته به وضعیت بیمار و دستور درمانی متفاوت است. امتیاز بالاتر یا پایین‌تر لزوماً نامطلوب نیست.',advice:[
        'امتیاز را با هدف آرام‌بخشی تجویزی و وضعیت بالینی بیمار مقایسه کنید.','علل قابل اصلاح آشفتگی یا کاهش هوشیاری مانند درد، هیپوکسی، دلیریوم و داروها را ارزیابی کنید.','تنفس، همودینامیک و ایمنی راه هوایی را پایش کرده و انحراف از هدف درمانی را گزارش کنید.']};
      case 'cpot':return {title:score>=3?'رفتارهای سازگار با درد قابل‌توجه':'رفتارهای درد کم در زمان ارزیابی',tone:score>=3?'watch':'ok',description:'CPOT رفتار درد را نشان می‌دهد؛ صفر بودن آن نبود درد را اثبات نمی‌کند.',advice:score>=3?[
        'منابع درد احتمالی، اقدامات دردناک و وضعیت فیزیولوژیک را بررسی کنید.','بر اساس دستورات معتبر درمانی و پروتکل ICU برای کنترل درد اقدام کنید.','CPOT را پس از مداخله و هنگام اقدامات دردناک دوباره اندازه بگیرید.'
      ]:['ارزیابی دوره‌ای و هنگام اقدامات دردناک را تکرار کنید.','در صورت امکان، خودگزارش‌دهی بیمار را بر ابزار رفتاری مقدم بدانید.']};
      case 'flacc':return {title:score===0?'نشانه آشکار درد دیده نشد':score<=3?'ناراحتی یا درد خفیف':score<=6?'درد متوسط':'درد یا ناراحتی شدید',tone:score>=7?'danger':score>=4?'watch':'ok',description:'FLACC بر رفتار تکیه دارد؛ اضطراب، سن، توانایی ارتباط و شرایط عصبی کودک نیز مهم‌اند.',advice:score>0?[
        'عوامل درد یا ناراحتی را با مشاهده، شرح‌حال والدین و معاینه مناسب بررسی کنید.','آرام‌سازی، حضور والدین و مداخلات ایمن طبق پروتکل را به کار گیرید.','پس از مراقبت یا درمان، امتیاز را دوباره ثبت کنید.'
      ]:['راحتی کودک را در طول مراقبت پایش کنید.','پیش از اقدامات دردناک برنامه پیشگیری و تسکین را مرور کنید.']};
      case 'apgar':return {title:score>=7?'وضعیت اولیه اطمینان‌بخش‌تر':score>=4?'امتیاز متوسط یا غیرطبیعی':'امتیاز پایین و نگران‌کننده',tone:score<=3?'danger':score<=6?'watch':'ok',description:'تفسیر متداول برای آپگار دقیقه پنجم است. امتیاز آپگار به‌تنهایی نیاز به احیا، آسفیکسی یا پیش‌آگهی آینده را مشخص نمی‌کند.',advice:score<7?[
        'ارزیابی و اقدامات ضروری نوزادی را فوراً طبق الگوریتم احیای نوزاد انجام دهید؛ منتظر امتیاز نمانید.','ضربان قلب، تنفس، اکسیژناسیون و وضعیت عمومی را با تیم نوزادان پایش کنید.','در صورت امتیاز کمتر از ۷ در دقیقه پنجم، ثبت مجدد هر ۵ دقیقه تا دقیقه ۲۰ را طبق پروتکل انجام دهید.'
      ]:['امتیاز دقیقه ۱ و ۵ را جداگانه همراه مداخلات حین تولد ثبت کنید.','مراقبت و پایش استاندارد نوزاد را ادامه دهید.']};
      case '4at':return {title:score>=4?'غربالگری مثبت به نفع دلیریوم احتمالی':score>=1?'احتمال اختلال شناختی':'غربالگری بدون نشانه واضح',tone:score>=4?'danger':score>=1?'watch':'ok',description:'امتیاز ۴ یا بیشتر نیازمند ارزیابی بالینی دلیریوم است؛ ۰ دلیریوم را به‌طور مطلق رد نمی‌کند.',advice:score>=4?[
        'یافته‌ها و شروع حاد یا نوسان‌دار علائم را سریعاً به تیم درمان گزارش کنید.','علل قابل درمان مانند عفونت، اختلال متابولیک، کم‌آبی، درد یا اثر داروها را بررسی کنید.','جهت‌یابی، خواب، عینک و سمعک، تحرک و ایمنی بیمار را حمایت کنید.'
      ]:score>=1?['سابقه شناختی، وضعیت پایه و تغییرات اخیر را از خانواده و پرونده بررسی کنید.','در صورت شک بالینی یا تغییر وضعیت، بررسی دقیق‌تر شناخت و دلیریوم انجام شود.']:
      ['در صورت تغییر حاد رفتار یا سطح هوشیاری، ارزیابی را تکرار کنید.','خواب، تحرک و جهت‌یابی بیمار را حمایت کنید.']};
      case 'barthel':return {title:score===100?'استقلال کامل در این شاخص':score>=91?'وابستگی اندک':score>=61?'وابستگی متوسط':score>=21?'وابستگی شدید':'وابستگی بسیار زیاد',tone:score<=20?'danger':score<=90?'watch':'ok',description:'نسخه بارتل ۰ تا ۱۰۰؛ دسته‌بندی شدت وابستگی تقریبی است و باید در کنار وضعیت واقعی بیمار سنجیده شود.',advice:score<100?[
        'برای فعالیت‌هایی که نمره پایین دارند، نیاز به کمک و برنامه مراقبت فردی را ثبت کنید.','با فیزیوتراپی، کاردرمانی و خانواده برای توانبخشی و تجهیزات کمکی همکاری کنید.','ایمنی انتقال، تغذیه، دفع و بهداشت فردی را متناسب با استقلال بیمار تأمین کنید.','در فواصل تعیین‌شده تغییر عملکرد را با همین نسخه از مقیاس مقایسه کنید.'
      ]:['استقلال بیمار را با آموزش ایمنی و فعالیت مناسب حفظ کنید.','در صورت بیماری جدید یا تغییر عملکرد، مجدداً ارزیابی کنید.']};
    }
    return {title:'نتیجه',tone:'watch',description:'',advice:[]};
  }
  function results(){
    const t=byId(state.selected); if(!t) return home();
    const invalid=t.questions.some((q,i)=>q.options[state.answers[i]]?.value===null);
    const sum=t.questions.reduce((s,q,i)=>s+(q.options[state.answers[i]]?.value ?? 0),0);
    const data=decide(t,sum,invalid);
    state.page='result';
    const entry=t.questions.map((q,i)=>{
      const a=q.options[state.answers[i]];
      return `<div class="score-line"><div><strong>${esc(q.title)}</strong><small>${esc(a.label)}</small></div><b dir="ltr">${a.value===null?'NT':fmt(a.value)}</b></div>`;
    }).join('');
    let note=t.id==='apgar'?`<div class="special-note">زمان انتخابی: <strong>${esc(t.questions[0].options[state.answers[0]].label)}</strong>. امتیاز آپگار هر زمان را جداگانه ثبت کنید.</div>`:'';
    if(t.id==='gcs') note=`<div class="special-note">ثبت جزءبه‌جزء: ${t.questions.map((q,i)=>['E','V','M'][i]+':'+(q.options[state.answers[i]].value===null?'NT':q.options[state.answers[i]].value)).join(' / ')}</div>`;
    frame(`<section class="result-top"><div class="eyebrow">نتیجه ارزیابی • ${esc(t.title)}</div><div class="score-circle ${data.tone}"><small>امتیاز کل</small><strong>${invalid?'NT':fmt(sum)}</strong><span>از بازه ${fmt(t.min)} تا ${fmt(t.max)}</span></div><h1>${esc(data.title)}</h1><p>${esc(data.description)}</p></section>${note}
      <section class="result-panel"><h2><span>✚</span> پیشنهادهای مراقبتی و پرستاری</h2><ul>${data.advice.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></section>
      <details class="breakdown"><summary>نمایش امتیاز تک‌تک سؤالات <span>⌄</span></summary><div>${entry}</div></details>
      ${shield}<div class="result-actions"><button class="solid-button" data-action="restart">ارزیابی دوباره ↻</button><button class="outline-button" data-action="list">بازگشت به لیست</button></div>
      <p class="source-text">معیار مرجع: <a href="${esc(t.source)}" rel="noopener">${esc(t.sourceName)} ↗</a></p>`,true);
  }
  function back(){
    switch(state.page){
      case 'quiz': if(state.step>0){state.step--;quiz();}else detail(byId(state.selected));break;
      case 'result': state.step=byId(state.selected).questions.length-1;quiz();break;
      case 'detail': state.previous==='home'?home():list(state.previous==='search');break;
      case 'list':case 'search':home();break;
      default:home();
    }
  }
  root.addEventListener('click', e=>{
    const btn=e.target.closest('[data-action]'); if(!btn||btn.disabled)return;
    const action=btn.dataset.action;
    if(action==='back')return back();
    if(action==='search'){state.term='';return list(true);}
    if(action==='list'){state.term='';return list(false);}
    if(action==='detail')return detail(byId(btn.dataset.id));
    if(action==='start'||action==='restart'){
      const t=byId(state.selected);state.answers=new Array(t.questions.length);state.step=0;return quiz();
    }
    if(action==='choose') {state.answers[state.step]=Number(btn.dataset.index);return quiz();}
    if(action==='prev'){if(state.step>0){state.step--;quiz();}return;}
    if(action==='next'){
      if(state.answers[state.step]===undefined)return;
      if(state.step===byId(state.selected).questions.length-1)results();else {state.step++;quiz();}
    }
  });
  root.addEventListener('input',e=>{
    if(e.target.id==='test-search'){state.term=e.target.value;updateList();}
  });
  window.asaBack=()=>{if(state.page==='home')return false;back();return true;};
  window.addEventListener('keydown',e=>{if(e.key==='Escape')back();});
  home();
})();