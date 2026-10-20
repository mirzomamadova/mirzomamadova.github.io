import { days, pronouns, vocabulary, VERSION, evaluate, reportText, telegramText, telegramUrl, tuesdayExtra, evaluateSet, errorProgress } from './course.mjs?v=5';
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='english-practice:'+VERSION, username=window.TO_BE_CONFIG?.telegramUsername||'', unknown='Пока не помню';
let storageAvailable=true;
const fresh=()=>({version:VERSION,phase:'hub',day:1,viewReport:null,drafts:{},reports:{},practiceDrafts:{},practiceRuns:[],practiceKey:null,practiceViewId:null});
let state=load(), lessonStep=0, flashIndex=0, flashRevealed=false;

function load(){
  try{
    const data=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(!data||data.version!==VERSION||!data.drafts||!data.reports)return fresh();
    const clean={...fresh(),phase:data.phase,day:data.day,viewReport:data.viewReport};
    clean.day=Number.isInteger(clean.day)&&clean.day>=1&&clean.day<=days.length?clean.day:1;
    for(const day of days){
      const draft=data.drafts[day.id];
      if(draft&&draft.answers&&typeof draft.answers==='object'){
        const answers=Object.fromEntries(day.questions.filter(q=>typeof draft.answers[q.id]==='string').map(q=>[q.id,draft.answers[q.id].slice(0,180)]));
        const checked=Object.fromEntries(day.questions.filter(q=>answers[q.id]&&draft.checked?.[q.id]===true).map(q=>[q.id,true]));
        clean.drafts[day.id]={answers,checked,personal:String(draft.personal||'').slice(0,600),startedAt:Number.isFinite(Date.parse(draft.startedAt))?draft.startedAt:new Date().toISOString(),hintUsed:!!draft.hintUsed,attempt:Number.isInteger(draft.attempt)&&draft.attempt>0?draft.attempt:1,index:Number.isInteger(draft.index)?Math.min(day.questions.length-1,Math.max(0,draft.index)):0,wordOrder:{}};
        for(const q of day.questions.filter(q=>q.type==='order')){
          const order=draft.wordOrder?.[q.id];
          if(Array.isArray(order)&&new Set(order).size===order.length&&order.every(n=>Number.isInteger(n)&&n>=0&&n<q.tokens.length))clean.drafts[day.id].wordOrder[q.id]=order;
        }
      }
      clean.reports[day.id]=Array.isArray(data.reports[day.id])?data.reports[day.id].filter(r=>r&&r.day===day.id&&typeof r.id==='string'&&typeof r.personal==='string'&&Number.isFinite(r.score)&&r.total===day.questions.length&&Array.isArray(r.details)&&r.details.length===day.questions.length&&Number.isFinite(Date.parse(r.finishedAt))).map(({name,...report})=>report):[];
    }
    loadPractice(data,clean);
    if(!['hub','lesson','exercise','result','study','practice','practice-result'].includes(clean.phase))clean.phase='hub';
    return clean;
  }catch{storageAvailable=false;return fresh();}
}
function save(){
  try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{storageAvailable=false;}
  $('#storage-note').textContent=storageAvailable?'Прогресс сохраняется в этом браузере. Открывай практику на том же устройстве.':'Браузер не сохраняет прогресс. После выполнения скачай отчёт перед закрытием страницы.';
  $('#save-state').textContent=storageAvailable?'Ответы сохраняются':'Скачай отчёт перед закрытием';
}
function show(view){
  for(const id of ['hub','lesson','exercise','result','study','practice','practice-result'])$('#'+id).hidden=id!==view;
  state.phase=view;
  document.querySelectorAll('.top-nav button').forEach(button=>{
    const current=view==='hub'?button.hasAttribute('data-home'):Number(button.dataset.openDay)===state.day;
    if(current)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
  });
}
function focus(id){$('#'+id).focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
function currentDay(){return days[state.day-1];}
function currentDraft(){return state.drafts[state.day];}
function dayReports(id){return state.reports[id]||[];}
function latest(id){return dayReports(id).at(-1);}
function activeReport(){return dayReports(state.day).find(r=>r.id===state.viewReport)||latest(state.day);}
function dateLabel(day){return new Date(day.date+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});}
function dayLabel(day){return `${day.weekday}, ${dateLabel(day)} · ${day.minutes} минут`;}

function renderHub(moveFocus=true){
  show('hub');const done=days.filter(day=>dayReports(day.id).length).length;
  $('#hub-greeting').textContent='Во вторник повтори местоимения и формы. В среду составь утвердительные предложения. На каждый день запланировано 15 минут.';
  $('#days-done').textContent=`${done} / 2`;
  $('#day-grid').innerHTML=days.map(day=>{
    const reports=dayReports(day.id),report=reports.at(-1),draft=state.drafts[day.id];
    const status=draft?`Начато: ${Object.keys(draft.checked).length} из ${day.questions.length} проверено`:report?`Выполнено · ${report.score}/${report.total} с первой проверки`:`${day.questions.length} заданий`;
    const history=reports.length?`<details class="report-history"><summary>Сохранённые отчёты (${reports.length})</summary>${reports.map(r=>`<button type="button" data-report="${esc(r.id)}" data-day="${day.id}">Попытка ${r.attempt}: ${r.score}/${r.total}</button>`).join('')}</details>`:'';
    return `<article class="day-card"><div class="day-date"><h2>${day.weekday}</h2><span class="day-time">15 минут</span></div><p class="day-subtitle">${dateLabel(day)}</p><h3>${esc(day.title)}</h3><p>${esc(day.focus)}</p><ol class="day-plan"><li><b>3 мин</b><span>${day.id===1?'Прочитай правило и повтори местоимения':'Повтори порядок слов и знакомые слова'}</span></li><li><b>10 мин</b><span>Выполни ${day.questions.length} заданий по одному</span></li><li><b>2 мин</b><span>Посмотри ошибки и отправь отчёт</span></li></ol><div class="day-status">${status}</div><button type="button" class="button ${day.id===1?'primary':'secondary'}" data-day="${day.id}">${draft?'Продолжить':report?'Открыть результат':`Начать: ${day.weekday.toLowerCase()}`}</button>${day.id===1?'<button type="button" class="study-link" data-study>Правило и дополнительные задания</button><p class="small-note">Можно проходить несколько раз. После выполнения появится тренировка ошибок.</p>':''}${history}</article>`;
  }).join('');
  $('#course-end').hidden=done<2;save();if(moveFocus)focus('hub-title');
}
function openDay(id,reportId){
  state.day=id;lessonStep=0;flashIndex=0;flashRevealed=false;
  if(reportId){state.viewReport=reportId;$('#errors-only').checked=false;renderResult();}
  else if(currentDraft())renderQuiz();
  else if(latest(id)){state.viewReport=latest(id).id;$('#errors-only').checked=false;renderResult();}
  else renderLesson();
}
function table(){return `<table class="pronoun-table"><thead><tr><th>Местоимение</th><th>Что значит</th><th>Форма to be</th></tr></thead><tbody>${pronouns.map(([p,meaning,verb])=>`<tr><td lang="en"><b>${p}</b></td><td>${meaning}</td><td lang="en">${verb}</td></tr>`).join('')}</tbody></table>`;}
function groups(){return '<div class="form-groups"><p><span>I</span><b>am</b></p><p><span>he / she / it</span><b>is</b></p><p><span>you / we / they</span><b>are</b></p></div>';}
function lessonStages(){return state.day===1?[{id:'meaning',label:'Что такое to be',title:'To be значит «быть»',description:'Прочитай объяснение. Затем нажми «Дальше», чтобы повторить местоимения.'},{id:'pronouns',label:'Местоимения',title:'Вспомни местоимение и форму',description:'Посмотри на местоимение. Скажи вслух его перевод и форму to be. Затем нажми «Открыть ответ».'}]:[{id:'affirmative',label:'Порядок слов',title:'Как составить утвердительное предложение',description:'Прочитай правило и примеры. Обрати внимание на порядок слов.'},{id:'words',label:'Знакомые слова',title:'Повтори слова из первого урока',description:'Скажи вслух перевод слова, затем нажми «Открыть ответ». Прочитай английское предложение.'}];}
function renderLesson(moveFocus=true){
  show('lesson');const day=currentDay(),stages=lessonStages(),stage=stages[lessonStep];
  $('#lesson-counter').textContent=dayLabel(day);$('#lesson-title').textContent=stage.title;$('#lesson-description').textContent=stage.description;$('#lesson-count').textContent=`Повторение ${lessonStep+1} / ${stages.length}`;
  $('#lesson-route').innerHTML=stages.map((s,i)=>`<button type="button" data-lesson-step="${i}" ${i===lessonStep?'aria-current="step"':''}><span>0${i+1}</span>${s.label}</button>`).join('');
  if(stage.id==='meaning')$('#lesson-content').innerHTML=`<div class="rule-stage"><div class="contrast-pair"><div><p class="label">По-русски</p><p class="big-phrase">Я готова.</p></div><div><p class="label">По-английски</p><p class="big-phrase" lang="en">I <b class="be">am</b> ready.</p></div></div><p class="rule-explanation"><b>To be — «быть».</b> С ним говорим, кто человек, какой он или где находится. В русском «я готова» слова «быть» нет. В английском между <b>I</b> и <b>ready</b> нужна форма <b class="be">am</b>.</p><p class="label">В настоящем времени — три формы</p>${groups()}<p class="quiet-note">Выбирай форму по местоимению. Слово ready, happy или tired на выбор формы не влияет.</p></div>`;
  else if(stage.id==='affirmative')$('#lesson-content').innerHTML=`<div class="rule-stage"><div class="sentence-formula"><div><small>1. Кто?</small><strong>I</strong><span>я</span></div><b>+</b><div><small>2. Форма to be</small><strong class="be">am</strong><span>с I нужна am</span></div><b>+</b><div><small>3. Какая / где?</small><strong>ready.</strong><span>готова</span></div></div><p class="rule-explanation"><b>Утвердительное предложение сообщает факт:</b> «Я готова», «Она занята», «Мы дома». Сначала поставь местоимение, после него — am, is или are, затем слово или выражение.</p><div class="model-lines"><p><span lang="en">I <b class="be">am</b> ready.</span><span>Я готова.</span></p><p><span lang="en">She <b class="be">is</b> busy.</span><span>Она занята.</span></p><p><span lang="en">We <b class="be">are</b> at home.</span><span>Мы дома.</span></p></div><p class="quiet-note">Сегодня пиши полные формы: I am, she is, we are.</p></div>`;
  else{
    const isPronouns=stage.id==='pronouns',list=isPronouns?pronouns:vocabulary;
    flashIndex=Math.min(flashIndex,list.length-1);const row=list[flashIndex];
    $('#lesson-content').innerHTML=`<div class="word-tabs" role="group" aria-label="${isPronouns?'Местоимения':'Слова'}">${list.map((r,i)=>`<button type="button" data-flash-index="${i}" aria-pressed="${i===flashIndex}" aria-controls="flash-panel">${esc(r[0])}</button>`).join('')}</div><div id="flash-panel" class="flash-stage"><div class="flash-word" lang="en">${esc(row[0])}</div><div class="flash-answer">${flashRevealed?`<p class="meaning">${esc(row[1])}</p><p class="flash-example" lang="en">${isPronouns?`${row[0]} <b>${row[2]}</b>`:`${esc(row[2])}<small lang="ru">${esc(row[3])}</small>`}</p>`:`<p class="waiting">${isPronouns?'Что значит? Какая форма to be?':'Что значит это слово?'}</p>`}<button type="button" class="button" data-reveal>${flashRevealed?'Скрыть и вспомнить ещё раз':'Открыть ответ'}</button></div></div><div class="word-navigation"><button type="button" data-flash-move="-1" ${flashIndex===0?'disabled':''}>Предыдущее</button><span>${isPronouns?'Местоимение':'Слово'} ${flashIndex+1} / ${list.length}</span><button type="button" data-flash-move="1" ${flashIndex===list.length-1?'disabled':''}>Следующее</button></div>`;
  }
  const mistakes=state.day===2&&lessonStep===0?(latest(1)?.details||[]).filter(q=>!q.correct).slice(0,3):[];
  $('#yesterday-review').hidden=!mistakes.length;$('#review-flashcards').innerHTML=mistakes.map(q=>`<details><summary>${esc(q.prompt)}</summary><p><b>${esc(q.expected)}</b> · ${esc(q.explanation)}</p></details>`).join('');
  $('#lesson-previous').textContent=lessonStep?'Назад':'К плану';$('#lesson-next').textContent=lessonStep===stages.length-1?`К заданиям: ${day.questions.length}`:'Дальше';save();if(moveFocus)focus('lesson-title');
}
function begin(){
  if(!currentDraft())state.drafts[state.day]={answers:{},checked:{},wordOrder:{},personal:'',index:0,startedAt:new Date().toISOString(),hintUsed:false,attempt:(latest(state.day)?.attempt||0)+1};
  renderQuiz();
}
function renderQuiz(moveFocus=true){
  if(!currentDraft())return renderLesson(moveFocus);
  show('exercise');const day=currentDay(),draft=currentDraft(),index=draft.index,q=day.questions[index],checked=!!draft.checked[q.id],answer=draft.answers[q.id]||'',last=index===day.questions.length-1;
  $('#quiz-day').textContent=dayLabel(day);
  const section=day.sections.findLastIndex(s=>s.start<=index);
  $('#steps').innerHTML=day.sections.map((s,i)=>`<button type="button" data-section="${i}" ${i===section?'aria-current="step"':''}><span>0${i+1}</span>${esc(s.title)}</button>`).join('');
  $('#section-counter').textContent=`Задание ${index+1} из ${day.questions.length}`;$('#section-title').textContent=q.action;$('#quiz-description').textContent=q.instruction;$('#answered-count').textContent=`${Object.keys(draft.checked).length} / ${day.questions.length}`;
  let input='';
  if(q.type==='choice')input=`<div class="options ${q.options.some(s=>s.length>10)?'has-long-choices':''}">${q.options.map(option=>`<label class="option"><input type="radio" name="${q.id}" value="${esc(option)}" ${option===answer?'checked':''} ${checked?'disabled':''} aria-describedby="question-prompt"><span>${esc(option)}</span></label>`).join('')}</div>`;
  else if(q.type==='order'){
    const selected=draft.wordOrder[q.id]||[];
    input=`<p class="answer-label">Твоё предложение</p><div class="sentence-output" aria-live="polite">${answer&&answer!==unknown?esc(answer):'<span>Нажми на первое слово ниже</span>'}</div><div class="word-bank">${q.tokens.map((token,i)=>`<button type="button" data-token="${i}" ${checked||selected.includes(i)?'disabled':''}>${esc(token)}</button>`).join('')}</div><button type="button" class="undo-word" data-undo-word ${checked||!selected.length?'disabled':''}>Убрать последнее</button>`;
  }else input=`<label class="answer-label" for="answer-input">${esc(q.format)}</label><input id="answer-input" name="${q.id}" type="text" maxlength="180" autocomplete="off" autocapitalize="sentences" spellcheck="false" aria-describedby="question-prompt quiz-description" value="${esc(answer===unknown?'':answer)}" placeholder="${q.format==='Одно слово.'?'Напиши am, is или are':'Напиши предложение целиком'}" ${checked?'disabled':''}>`;
  $('#question-list').innerHTML=`<fieldset class="question-card"><legend>Задание ${index+1}</legend><p class="prompt" id="question-prompt">${esc(q.prompt)}</p>${q.translation?`<p class="translation">${esc(q.translation)}</p>`:''}${input}<button type="button" class="dont-know" ${checked?'disabled':''} data-unknown>${answer===unknown?'Отмечено: пока не помню':'Не помню. Показать ответ'}</button></fieldset>`;
  $('#question-example-text').textContent=q.example;$('#quiz-rule').open=false;$('#quiz-rule-content').innerHTML=table()+'<p>Порядок слов: <b>местоимение + am / is / are + слово или выражение</b>. I am ready. She is busy. We are at home.</p>';
  $('#answer-feedback').hidden=!checked;
  if(checked){const detail=evaluate(day.id,draft.answers).details[index];$('#answer-feedback').classList.toggle('wrong',!detail.correct);$('#answer-feedback').innerHTML=`<strong>${detail.correct?'Верно':answer===unknown?'Правильный ответ':'Нужно исправить'}</strong>${detail.correct?'':`<p class="correct-answer">${esc(detail.expected)}</p>`}<p>${esc(detail.explanation)}</p>${!detail.correct?'<p>Прочитай верный ответ вслух. Затем переходи дальше.</p>':''}`;}
  $('#personal-section').hidden=!last||!checked;$('#personal-section h2').textContent=state.day===1?'Вопрос преподавателю':'Напиши о себе';$('#personal-label').textContent=day.personal;$('#personal-note').textContent=state.day===1?'Необязательно. Вопрос появится в отчёте преподавателю.':'Необязательно. Преподаватель проверит эти предложения отдельно; в балл они не входят.';$('#personal').value=draft.personal;$('#personal').placeholder=state.day===1?'Что осталось непонятным?':'Твои предложения на английском…';
  $('#previous').textContent=index?'Назад':'К повторению';$('#next').textContent=checked?(last?'Завершить этот день':'Следующее задание'):'Проверить ответ';
  $('#step-note').textContent=checked?'Этот ответ сохранён в отчёте':'В отчёт попадёт первый проверенный ответ';$('#validation-error').textContent='';save();if(moveFocus)focus('section-title');
}
function checkCurrent(){
  const draft=currentDraft(),q=currentDay().questions[draft.index],answer=String(draft.answers[q.id]||'').trim();
  if(!answer||(q.type==='order'&&answer!==unknown&&(draft.wordOrder[q.id]||[]).length!==q.tokens.length)){
    $('#validation-error').textContent=q.type==='order'?'Используй все слова или нажми «Не помню. Показать ответ».':q.type==='choice'?'Выбери один вариант или нажми «Не помню. Показать ответ».':'Напиши ответ или нажми «Не помню. Показать ответ».';
    $('.question-card').classList.add('invalid');$('.question-card input, .question-card .word-bank button')?.focus();return false;
  }
  draft.checked[q.id]=true;renderQuiz(false);$('#answer-feedback').scrollIntoView({block:'nearest',behavior:'instant'});$('#next').focus({preventScroll:true});return true;
}
function finish(){
  const draft=currentDraft(),day=currentDay();if(!draft)return;
  const missing=day.questions.findIndex(q=>!draft.checked[q.id]);
  if(missing>=0){draft.index=missing;renderQuiz();$('#validation-error').textContent='Сначала проверь это задание. После всех ответов появится отчёт.';return;}
  const finishedAt=new Date().toISOString();
  const report={...evaluate(day.id,draft.answers),version:VERSION,id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,day:day.id,personal:draft.personal,attempt:draft.attempt,startedAt:draft.startedAt,finishedAt,durationSeconds:Math.max(0,Math.round((Date.parse(finishedAt)-Date.parse(draft.startedAt))/1000)),hintUsed:draft.hintUsed};
  state.reports[day.id]||=[];state.reports[day.id].push(report);state.viewReport=report.id;delete state.drafts[day.id];$('#errors-only').checked=false;$('#copy-status').textContent='';renderResult();
}
function renderReview(){
  const report=activeReport(),rows=report.details.filter(q=>!$('#errors-only').checked||!q.correct);
  $('#answer-review').innerHTML=rows.length?rows.map(q=>`<article class="review-card ${q.correct?'':'wrong'}"><p class="review-status">${q.correct?'Верно':'Ошибка'} · Задание ${report.details.indexOf(q)+1}</p><h3>${esc(q.prompt)}</h3><p><b>Твой ответ:</b> ${esc(q.answer)}</p>${q.correct?'':`<p><b>Верный ответ:</b> ${esc(q.expected)}</p>`}<p class="explanation">${esc(q.explanation)}</p></article>`).join(''):'<p class="review-empty">Все ответы верные.</p>';
}
function renderResult(moveFocus=true){
  const report=activeReport();if(!report)return renderHub(moveFocus);
  show('result');$('#result-day').textContent=`${dayLabel(days[report.day-1])} · попытка ${report.attempt}`;$('#score-value').textContent=`${report.score}/${report.total}`;
  const perfect=report.score===report.total;
  $('#result-message').textContent=perfect?(report.day===1?'Все ответы верные. Следующее задание — на среду.':'Все ответы верные. Отправь отчёт преподавателю.'):'Ниже показаны ошибки и правильные ответы. Прочитай объяснения перед отправкой отчёта.';
  const topics=[...new Set(report.details.map(q=>q.topic))];$('#score-breakdown').innerHTML=topics.map(topic=>{const rows=report.details.filter(q=>q.topic===topic);return `<div class="score-item"><span>${esc(topic)}</span><strong>${rows.filter(q=>q.correct).length}/${rows.length}</strong></div>`;}).join('');
  try{$('#telegram-link').href=telegramUrl(username,report);$('#telegram-link').hidden=false;}catch{$('#telegram-link').hidden=true;}
  $('#telegram-preview').textContent=telegramText(report);$('#telegram-status').textContent='Сайт не отправляет сообщение автоматически и не видит, доставлено ли оно.';
  $('#personal-review').hidden=!report.personal.trim();$('#personal-review h2').textContent=report.day===1?'Вопрос преподавателю':'Твои предложения';$('#personal-answer').textContent=report.personal;
  $('#next-day-note').innerHTML=report.day===1?'<strong>Среда, 21 октября · 15 минут</strong><p>В среду будем составлять утвердительные предложения: I am ready. She is busy.</p>':'<strong>Четверг, 22 октября — занятие</strong><p>Отправь отчёт преподавателю и подготовь вопросы по ошибкам.</p>';
  renderRepeatActions(report);$('#new-attempt').hidden=report.day===1;renderReview();save();if(moveFocus)focus('result-title');
}
function download(){const report=activeReport(),url=URL.createObjectURL(new Blob(['\ufeff'+reportText(report)],{type:'text/plain;charset=utf-8'})),link=document.createElement('a');link.href=url;link.download=`to-be-day-${report.day}-attempt-${report.attempt}.txt`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}

$('.brand').addEventListener('click',event=>{event.preventDefault();renderHub();});
document.querySelectorAll('[data-home]').forEach(button=>button.addEventListener('click',()=>renderHub()));
document.querySelectorAll('[data-open-day]').forEach(button=>button.addEventListener('click',()=>openDay(Number(button.dataset.openDay))));
$('#day-grid').addEventListener('click',event=>{const button=event.target.closest('button[data-day]');if(button)openDay(Number(button.dataset.day),button.dataset.report);});
$('#lesson-route').addEventListener('click',event=>{const button=event.target.closest('[data-lesson-step]');if(button){lessonStep=Number(button.dataset.lessonStep);flashIndex=0;flashRevealed=false;renderLesson();}});
$('#lesson-content').addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-flash-index')){flashIndex=Number(button.dataset.flashIndex);flashRevealed=false;}
  else if(button.hasAttribute('data-reveal'))flashRevealed=!flashRevealed;
  else if(button.hasAttribute('data-flash-move')){flashIndex+=Number(button.dataset.flashMove);flashRevealed=false;}
  else return;
  const focusSelector=button.hasAttribute('data-reveal')?'[data-reveal]':button.hasAttribute('data-flash-index')?'[data-flash-index="'+flashIndex+'"]':'[data-flash-move="'+button.dataset.flashMove+'"]';
  renderLesson(false);
  const nextControl=$(focusSelector);
  (nextControl&&!nextControl.disabled?nextControl:$('[data-flash-index="'+flashIndex+'"]'))?.focus({preventScroll:true});
});
$('#lesson-previous').addEventListener('click',()=>{if(lessonStep){lessonStep--;flashIndex=0;flashRevealed=false;renderLesson();}else renderHub();});
$('#lesson-next').addEventListener('click',()=>{if(lessonStep<lessonStages().length-1){lessonStep++;flashIndex=0;flashRevealed=false;renderLesson();}else begin();});
$('#steps').addEventListener('click',event=>{const button=event.target.closest('[data-section]');if(button){currentDraft().index=currentDay().sections[Number(button.dataset.section)].start;renderQuiz();}});
for(const id of ['quiz-rule'])$('#'+id).addEventListener('toggle',()=>{if($('#'+id).open&&state.phase==='exercise'&&currentDraft()){currentDraft().hintUsed=true;save();}});
$('#exercise-form').addEventListener('input',event=>{
  const input=event.target,draft=currentDraft();if(!draft)return;
  if(input.id==='personal')draft.personal=input.value;
  else{const q=currentDay().questions[draft.index];if(input.name!==q.id||draft.checked[q.id])return;draft.answers[q.id]=input.value;$('.question-card').classList.remove('invalid');$('#validation-error').textContent='';}
  save();
});
$('#question-list').addEventListener('click',event=>{
  const button=event.target.closest('button'),draft=currentDraft();if(!button||!draft)return;const q=currentDay().questions[draft.index];if(draft.checked[q.id])return;
  if(button.hasAttribute('data-unknown')){draft.answers[q.id]=unknown;checkCurrent();return;}
  if(q.type!=='order')return;
  const order=draft.wordOrder[q.id]||=[];
  if(button.hasAttribute('data-token')){const token=Number(button.dataset.token);if(!order.includes(token))order.push(token);}
  else if(button.hasAttribute('data-undo-word'))order.pop();else return;
  draft.answers[q.id]=order.map(i=>q.tokens[i]).join(' ');renderQuiz(false);
  ($('.word-bank button:not(:disabled)')||$('#next')).focus({preventScroll:true});
});
$('#exercise-form').addEventListener('submit',event=>{event.preventDefault();const draft=currentDraft(),day=currentDay();if(!draft.checked[day.questions[draft.index].id]){checkCurrent();return;}if(draft.index<day.questions.length-1){draft.index++;renderQuiz();}else finish();});
$('#previous').addEventListener('click',()=>{if(currentDraft().index){currentDraft().index--;renderQuiz();}else{lessonStep=0;renderLesson();}});
$('#errors-only').addEventListener('change',renderReview);
$('#telegram-link').addEventListener('click',()=>{$('#telegram-status').textContent='В Telegram проверь получателя @'+username+' и нажми «Отправить». Переход по кнопке сам по себе не отправляет сообщение.';});
$('#copy-report').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(telegramText(activeReport()));$('#copy-status').textContent='Скопировано. Вставь в диалог @'+username+'.';}catch{$('#copy-status').textContent='Открой «Посмотреть сообщение» и скопируй текст вручную.';}});
$('#download-report').addEventListener('click',download);
$('#new-attempt').addEventListener('click',()=>{lessonStep=0;flashIndex=0;flashRevealed=false;renderLesson();});

if(state.phase==='study')openStudy();else if(state.phase==='practice'&&practiceDraft())renderPractice(false);else if(state.phase==='practice-result'&&practiceRun())renderPracticeResult(false);else if(state.phase==='exercise'&&currentDraft())renderQuiz(false);else if(state.phase==='lesson')renderLesson(false);else if(state.phase==='result'&&activeReport())renderResult(false);else renderHub(false);

function practiceSource(id){return dayReports(1).find(r=>r.id===id);}
function practiceQuestions(draft){
  const bank=draft.mode==='extra'?tuesdayExtra:days[0].questions;
  return draft.questionIds.map(id=>bank.find(q=>q.id===id)).filter(Boolean);
}
function loadPractice(data,clean){
  const source=id=>clean.reports[1]?.find(r=>r.id===id);
  const validBase=value=>value&&['errors','extra'].includes(value.mode)&&Array.isArray(value.questionIds)&&value.questionIds.length&&new Set(value.questionIds).size===value.questionIds.length&&value.questionIds.every(id=>(value.mode==='extra'?tuesdayExtra:days[0].questions).some(q=>q.id===id))&&(value.mode==='extra'||source(value.sourceReportId));
  for(const[key,draft]of Object.entries(data.practiceDrafts||{})){
    if(!validBase(draft)||key!==(draft.mode==='extra'?'extra':'errors:'+draft.sourceReportId))continue;
    const answers=Object.fromEntries(draft.questionIds.filter(id=>typeof draft.answers?.[id]==='string').map(id=>[id,draft.answers[id].slice(0,180)]));
    clean.practiceDrafts[key]={mode:draft.mode,sourceReportId:draft.sourceReportId||null,questionIds:draft.questionIds,answers,checked:Object.fromEntries(draft.questionIds.filter(id=>answers[id]&&draft.checked?.[id]===true).map(id=>[id,true])),index:Math.max(0,Math.min(draft.questionIds.length-1,Number.isInteger(draft.index)?draft.index:0)),startedAt:Number.isFinite(Date.parse(draft.startedAt))?draft.startedAt:new Date().toISOString()};
  }
  clean.practiceRuns=Array.isArray(data.practiceRuns)?data.practiceRuns.filter(r=>validBase(r)&&typeof r.id==='string'&&Array.isArray(r.details)&&r.details.length===r.questionIds.length&&r.details.every(q=>r.questionIds.includes(q.id)&&typeof q.correct==='boolean')&&Number.isFinite(Date.parse(r.finishedAt))&&Number.isInteger(r.score)&&r.total===r.questionIds.length):[];
  clean.practiceKey=typeof data.practiceKey==='string'?data.practiceKey:null;
  clean.practiceViewId=typeof data.practiceViewId==='string'?data.practiceViewId:null;
}
function practiceDraft(){return state.practiceDrafts[state.practiceKey];}
function practiceRun(){return state.practiceRuns.find(r=>r.id===state.practiceViewId);}
function repeatHomework(){
  state.day=1;lessonStep=0;flashIndex=0;flashRevealed=false;
  if(currentDraft())renderQuiz();else begin();
}
function startPractice(mode,sourceId){
  state.day=1;
  const report=mode==='errors'?practiceSource(sourceId||activeReport()?.id):null;
  if(mode==='errors'&&!report)return renderHub();
  const key=mode==='extra'?'extra':'errors:'+report.id;
  state.practiceKey=key;
  if(!state.practiceDrafts[key]){
    const progress=errorProgress(report,state.practiceRuns);
    const questionIds=mode==='extra'?tuesdayExtra.map(q=>q.id):(progress.remaining.length?progress.remaining:report.details.filter(q=>!q.correct).map(q=>q.id));
    if(!questionIds.length)return renderResult();
    state.practiceDrafts[key]={mode,sourceReportId:report?.id||null,questionIds,answers:{},checked:{},index:0,startedAt:new Date().toISOString()};
  }
  renderPractice();
}
function renderRepeatActions(report){
  $('#tuesday-repeat').hidden=report.day!==1;
  if(report.day!==1)return;
  const progress=errorProgress(report,state.practiceRuns);
  $('#practice-errors').hidden=!progress.total;
  $('#practice-errors').textContent=progress.fixed===progress.total?'Повторить задания с ошибками ещё раз':`Потренировать ошибки (${progress.remaining.length})`;
  $('#retry-tuesday').textContent=state.drafts[1]?'Продолжить новую попытку':'Пройти все 16 заданий ещё раз';
  $('#error-progress').textContent=progress.total?(progress.rounds?`После повторения исправлено ${progress.fixed} из ${progress.total}. Результат основной попытки: ${report.score}/${report.total}.`:'Сначала прочитай объяснения ниже, затем выполни задания с ошибками ещё раз.'):'Ошибок нет. Можно повторить всё задание или попробовать дополнительные упражнения.';
}
function openStudy(topic){
  state.day=1;show('study');
  $('#study-content').innerHTML=`
    <details id="study-meaning"><summary>Что такое to be и зачем оно нужно</summary><div><p><b>To be означает «быть».</b> В настоящем времени у него три формы: am, is и are.</p><p>По-русски мы говорим «Я готова». Слова «быть» в этой фразе нет. По-английски нужен глагол: <b lang="en">I am ready.</b> Нельзя написать I ready.</p><p><span lang="en">She is happy.</span> — Она рада.<br><span lang="en">We are at home.</span> — Мы дома.</p><p>Am, is и are помогают сказать, какой человек или где он находится. Выбираем форму по местоимению.</p></div></details>
    <details id="study-pronouns"><summary>Местоимения: кто о ком говорит</summary><div><p>Местоимение заменяет имя или название. <b>I</b> — я, <b>you</b> — ты или вы, <b>he</b> — он, <b>she</b> — она, <b>it</b> — оно или это, <b>we</b> — мы, <b>they</b> — они.</p>${table()}<p>Сначала найди местоимение. Затем выбери форму из последнего столбца.</p></div></details>
    <details id="study-forms"><summary>Как выбрать am, is или are</summary><div>${groups()}<p><b>Am — только с I.</b> I am ready. — Я готова.</p><p><b>Is — с he, she и it.</b> He is tired. — Он устал. She is happy. — Она рада.</p><p><b>Are — с you, we и they.</b> You are ready. — Ты готова. They are at home. — Они дома.</p><p>Слова ready, happy и tired не меняют форму to be. В I am ready и I am tired форма одинаковая, потому что местоимение в обоих случаях I.</p></div></details>
    <details id="study-you"><summary>Почему you are, даже если это один человек</summary><div><p><b>You</b> переводится и как «ты», и как «вы». В обоих случаях нужна форма <b>are</b>.</p><p><span lang="en">You are ready.</span> — Ты готова.<br><span lang="en">You are ready.</span> — Вы готовы.</p><p>Для «ты» не нужно заменять are на is. Запоминай пару целиком: <b>you are</b>.</p></div></details>`;
  const selected=['meaning','pronouns','forms','you'].includes(topic)?topic:'meaning';$('#study-'+selected).open=true;
  $('#extra-history').innerHTML=state.practiceRuns.length?`<details class="report-history"><summary>Сохранённые повторения (${state.practiceRuns.length})</summary>${state.practiceRuns.map((r,i)=>`<button type="button" data-practice-report="${esc(r.id)}">${i+1}. ${r.mode==='errors'?'Работа над ошибками':r.total===10?'Дополнительные задания':'Ошибки дополнительных заданий'}: ${r.score}/${r.total}</button>`).join('')}</details>`:'';
  $('#study-resume').innerHTML=Object.entries(state.practiceDrafts).map(([key,draft])=>`<button type="button" class="button secondary" data-resume-practice="${esc(key)}">${draft.mode==='errors'?'Продолжить работу над ошибками':'Продолжить дополнительные задания'} (${Object.keys(draft.checked).length}/${draft.questionIds.length})</button>`).join('');
  save();focus('study-title');
}
function renderPractice(moveFocus=true){
  const draft=practiceDraft();if(!draft)return openStudy();
  show('practice');const questions=practiceQuestions(draft),q=questions[draft.index],checked=!!draft.checked[q.id],answer=draft.answers[q.id]||'';
  $('#practice-title').textContent=draft.mode==='errors'?'Работа над ошибками':q.action;
  $('#practice-description').textContent=q.instruction;
  $('#practice-counter').textContent=`Задание ${draft.index+1} из ${questions.length}`;
  $('#practice-example').textContent=q.example;
  let input=q.type==='choice'?`<div class="options ${q.options.some(s=>s.length>10)?'has-long-choices':''}">${q.options.map(option=>`<label class="option"><input type="radio" name="practice-answer" value="${esc(option)}" ${answer===option?'checked':''} ${checked?'disabled':''} aria-describedby="practice-prompt"><span>${esc(option)}</span></label>`).join('')}</div>`:`<label class="answer-label" for="practice-input">${esc(q.format)}</label><input id="practice-input" name="practice-answer" type="text" maxlength="180" autocomplete="off" spellcheck="false" value="${esc(answer===unknown?'':answer)}" placeholder="${esc(q.placeholder||'Напиши am, is или are')}" aria-describedby="practice-prompt practice-description" ${checked?'disabled':''}>`;
  $('#practice-question').innerHTML=`<fieldset class="question-card"><legend>Задание ${draft.index+1}</legend><p id="practice-prompt" class="prompt">${esc(q.prompt)}</p>${q.translation?`<p class="translation">${esc(q.translation)}</p>`:''}${input}<button type="button" class="dont-know" data-practice-unknown ${checked?'disabled':''}>Не помню. Показать ответ</button></fieldset>`;
  $('#practice-feedback').hidden=!checked;
  if(checked){const result=evaluateSet([q],draft.answers).details[0];$('#practice-feedback').classList.toggle('wrong',!result.correct);$('#practice-feedback').innerHTML=`<strong>${result.correct?'Верно':'Правильный ответ: '+esc(result.expected)}</strong><p>${esc(result.explanation)}</p>${result.correct?'':'<p>Прочитай ответ вслух. После остальных заданий можно будет вернуться к этой ошибке.</p>'}`;}
  $('#practice-next').textContent=checked?(draft.index===questions.length-1?'Посмотреть результат':'Следующее задание'):'Проверить ответ';$('#practice-validation').textContent='';save();if(moveFocus)focus('practice-title');
}
function checkPractice(){
  const draft=practiceDraft(),q=practiceQuestions(draft)[draft.index];
  if(!String(draft.answers[q.id]||'').trim()){$('#practice-validation').textContent='Ответь на вопрос или нажми «Не помню. Показать ответ».';return;}
  draft.checked[q.id]=true;renderPractice(false);$('#practice-feedback').scrollIntoView({block:'nearest'});$('#practice-next').focus({preventScroll:true});
}
function finishPractice(){
  const draft=practiceDraft(),questions=practiceQuestions(draft),missing=questions.findIndex(q=>!draft.checked[q.id]);
  if(missing>=0){draft.index=missing;return renderPractice();}
  const run={...evaluateSet(questions,draft.answers),id:crypto.randomUUID?crypto.randomUUID():Date.now()+'-practice',mode:draft.mode,sourceReportId:draft.sourceReportId,questionIds:draft.questionIds,startedAt:draft.startedAt,finishedAt:new Date().toISOString()};
  state.practiceRuns.push(run);state.practiceViewId=run.id;delete state.practiceDrafts[state.practiceKey];renderPracticeResult();
}
function renderPracticeResult(moveFocus=true){
  const run=practiceRun();if(!run)return openStudy();
  show('practice-result');const report=practiceSource(run.sourceReportId),progress=errorProgress(report,state.practiceRuns),wrong=run.details.filter(q=>!q.correct);
  $('#practice-result-title').textContent=run.mode==='errors'?'Результат работы над ошибками':'Результат дополнительной практики';
  $('#practice-score').textContent=`${run.score}/${run.total}`;
  $('#practice-result-message').textContent=run.mode==='errors'?`Исправлено ${progress.fixed} из ${progress.total} ошибок основной попытки. ${progress.remaining.length?'Прочитай объяснения и попробуй оставшиеся задания ещё раз.':'Все ошибки исправлены. Если нужно, можно повторить эти задания снова.'}`:(wrong.length?'Посмотри объяснения. Можно повторить только ошибки или пройти все дополнительные задания ещё раз.':'Все ответы верные. Можно повторить эти задания, когда понадобится.');
  $('#practice-again').textContent=run.mode==='extra'?(state.practiceDrafts.extra?'Продолжить начатое повторение':'Пройти все 10 заданий ещё раз'):progress.remaining.length?`Повторить оставшиеся ошибки (${progress.remaining.length})`:'Пройти ещё раз';
  $('#practice-only-wrong').hidden=run.mode!=='extra'||!wrong.length||!!state.practiceDrafts.extra;
  $('#practice-review').innerHTML=run.details.map(q=>`<article class="review-card ${q.correct?'':'wrong'}"><p class="review-status">${q.correct?'Верно':'Ошибка'}</p><h3>${esc(q.prompt)}</h3><p>Твой ответ: ${esc(q.answer)}</p>${q.correct?'':`<p>Правильный ответ: <b>${esc(q.expected)}</b></p>`}<p>${esc(q.explanation)}</p></article>`).join('');
  const date=new Date(run.finishedAt).toLocaleDateString('ru-RU',{timeZone:'Asia/Yekaterinburg'});
  const lines=['To be · Вторник',run.mode==='errors'?'Работа над ошибками':run.total===10?'Дополнительные задания':'Ошибки дополнительных заданий',`Выполнено: ${date}`,`Результат этого прохождения: ${run.score}/${run.total}`];
  if(report)lines.push(`Основная попытка ${report.attempt}: ${report.score}/${report.total}`,`Всего исправлено ошибок: ${progress.fixed}/${progress.total}`);
  if(wrong.length)lines.push('Осталось повторить:',...wrong.map(q=>`${q.prompt}: ${q.answer} → ${q.expected}`));
  else lines.push('Все ответы в этом прохождении верные.');
  $('#practice-telegram').href=`https://t.me/${encodeURIComponent(username)}?text=${encodeURIComponent(lines.join('\n').slice(0,3000))}`;
  save();if(moveFocus)focus('practice-result-title');
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-study'))openStudy(button.dataset.study);
  else if(button.hasAttribute('data-extra-practice'))startPractice('extra');
  else if(button.hasAttribute('data-resume-practice')){state.practiceKey=button.dataset.resumePractice;renderPractice();}
  else if(button.hasAttribute('data-practice-report')){state.practiceViewId=button.dataset.practiceReport;renderPracticeResult();}
});
$('#retry-tuesday').addEventListener('click',repeatHomework);
$('#practice-errors').addEventListener('click',()=>startPractice('errors'));
$('#study-cards').addEventListener('click',()=>{state.day=1;lessonStep=1;flashIndex=0;flashRevealed=false;renderLesson();});
$('#practice-form').addEventListener('input',event=>{if(event.target.name!=='practice-answer')return;const draft=practiceDraft(),q=practiceQuestions(draft)[draft.index];if(!draft.checked[q.id]){draft.answers[q.id]=event.target.value;$('#practice-validation').textContent='';save();}});
$('#practice-question').addEventListener('click',event=>{if(!event.target.closest('[data-practice-unknown]'))return;const draft=practiceDraft(),q=practiceQuestions(draft)[draft.index];if(!draft.checked[q.id]){draft.answers[q.id]=unknown;checkPractice();}});
$('#practice-form').addEventListener('submit',event=>{event.preventDefault();const draft=practiceDraft(),questions=practiceQuestions(draft);if(!draft.checked[questions[draft.index].id])return checkPractice();if(draft.index<questions.length-1){draft.index++;renderPractice();}else finishPractice();});
$('#practice-again').addEventListener('click',()=>{const run=practiceRun();startPractice(run.mode,run.sourceReportId);});
$('#practice-only-wrong').addEventListener('click',()=>{const run=practiceRun(),questionIds=run.details.filter(q=>!q.correct).map(q=>q.id);if(!questionIds.length)return;state.practiceKey='extra';state.practiceDrafts.extra={mode:'extra',sourceReportId:null,questionIds,answers:{},checked:{},index:0,startedAt:new Date().toISOString()};renderPractice();});
