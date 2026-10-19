import { days, pronouns, VERSION, evaluate, reportText, telegramText, telegramUrl } from './course.mjs?v=2';
const $ = selector => document.querySelector(selector);
const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='english-practice:'+VERSION;
const username=window.TO_BE_CONFIG?.telegramUsername||'';
const unknown='Пока не помню';
let storageAvailable=true;
const fresh=()=>({version:VERSION,startDate:'',phase:'welcome',day:1,viewReport:null,drafts:{},reports:{}});
let state=load();

function load(){
  try{
    const data=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(!data||data.version!==VERSION||!data.drafts||!data.reports)return fresh();
    const clean={...fresh(),startDate:data.startDate,phase:data.phase,day:data.day,viewReport:data.viewReport};
    clean.day=Number.isInteger(clean.day)&&clean.day>=1&&clean.day<=days.length?clean.day:1;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(clean.startDate))clean.startDate=localDate();
    for(const day of days){
      const draft=data.drafts[day.id];
      if(draft&&draft.answers&&typeof draft.answers==='object'){
        clean.drafts[day.id]={answers:Object.fromEntries(day.questions.filter(q=>typeof draft.answers[q.id]==='string').map(q=>[q.id,draft.answers[q.id].slice(0,180)])),personal:String(draft.personal||'').slice(0,600),startedAt:Number.isFinite(Date.parse(draft.startedAt))?draft.startedAt:new Date().toISOString(),hintUsed:!!draft.hintUsed,attempt:Number.isInteger(draft.attempt)&&draft.attempt>0?draft.attempt:1,part:Number.isInteger(draft.part)?Math.min(Math.ceil(day.questions.length/4)-1,Math.max(0,draft.part)):0};
      }
      clean.reports[day.id]=Array.isArray(data.reports[day.id])?data.reports[day.id].filter(r=>r&&r.day===day.id&&typeof r.id==='string'&&typeof r.personal==='string'&&Number.isFinite(r.score)&&r.total===day.questions.length&&Array.isArray(r.details)&&r.details.length===day.questions.length&&Number.isFinite(Date.parse(r.finishedAt))).map(({name,...report})=>report):[];
    }
    if(!['welcome','hub','lesson','exercise','result'].includes(clean.phase))clean.phase='hub';
    return clean;
  }catch{storageAvailable=false;return fresh();}
}
function save(){
  try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{storageAvailable=false;}
  const note=storageAvailable?'Прогресс сохраняется в этом браузере.':'Браузер не сохраняет прогресс. Не закрывай страницу; после проверки скачай отчёт.';
  $('#save-state').textContent=note;$('#storage-note').textContent=note;
}
function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function plannedDate(day){return new Date(days[day-1].date+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});}
function show(view){for(const id of ['welcome','hub','lesson','exercise','result'])$('#'+id).hidden=id!==view;state.phase=view;}
function focus(id){$('#'+id).focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
function currentDay(){return days[state.day-1];}
function currentDraft(){return state.drafts[state.day];}
function dayReports(day){return state.reports[day]||[];}
function latest(day){return dayReports(day).at(-1);}
function activeReport(){return dayReports(state.day).find(r=>r.id===state.viewReport)||latest(state.day);}
function countAnswers(){return currentDay().questions.filter(q=>String(currentDraft()?.answers[q.id]||'').trim()).length;}

function renderHub(moveFocus=true){
  show('hub');const done=days.filter(d=>dayReports(d.id).length).length;const next=days.find(d=>!dayReports(d.id).length)?.id;
  $('#hub-greeting').textContent=done===days.length?'Обе практики пройдены. Отправь отчёт и принеси вопросы на занятие в четверг.':'Во вторник разберись в правиле, в среду вспомни его сама. В четверг — занятие с преподавателем.';
  $('#days-done').textContent=`${done}/${days.length}`;
  $('#day-grid').innerHTML=days.map(day=>{
    const reports=dayReports(day.id);const report=reports.at(-1);const draft=state.drafts[day.id];
    const history=reports.length>1?`<details class="report-history"><summary>Все попытки (${reports.length})</summary>${reports.map(r=>`<button type="button" data-report="${esc(r.id)}" data-day="${day.id}">Попытка ${r.attempt}: ${r.score}/${r.total}</button>`).join('')}</details>`:'';
    return `<article class="day-card ${report?'complete':day.id===next?'recommended':''}"><div class="day-date"><span>${esc(plannedDate(day.id))}</span><span>${day.minutes} мин.</span></div><span class="day-number">${esc(day.weekday.toUpperCase())}</span><h2>${esc(day.title)}</h2><p>${esc(day.focus)}</p><div class="day-status">${draft?'◷ Есть сохранённые ответы':report?`✓ Выполнено · ${report.score}/${report.total}`:day.id===next?'↗ Твой следующий шаг':`${day.questions.length} заданий`}</div><button type="button" class="button ${day.id===next?'primary':'secondary'}" data-day="${day.id}">${draft?'Продолжить':report?'Посмотреть результат':'Открыть день'} →</button>${draft&&report?`<button type="button" class="history-link" data-day="${day.id}" data-report="${esc(report.id)}">Отчёт предыдущей попытки</button>`:''}${history}</article>`;
  }).join('');
  $('#course-end').hidden=done<days.length;save();if(moveFocus)focus('hub-title');
}
function table(day){
  return `<table class="pronoun-table"><thead><tr><th scope="col">Кто?</th><th scope="col">Значение</th><th scope="col">To be</th>${day>=2?'<th scope="col">Коротко</th>':''}</tr></thead><tbody>${pronouns.map(([p,meaning,verb,contracted])=>`<tr><td lang="en"><b>${esc(p)}</b></td><td>${esc(meaning)}</td><td lang="en">${esc(verb)}</td>${day>=2?`<td lang="en">${esc(contracted)}</td>`:''}</tr>`).join('')}</tbody></table>`;
}
function rule(day){return table(day)+`<p><b>Смысл:</b> to be — «быть». Говорим, кто, какой или где: I am a student. She is here. We are happy.</p><p><b>Подлежащее:</b> Tom → he → is. My friends → they → are. My bag → it → is.</p>${day>=2?'<p><b>Сокращения:</b> I am = I’m; she is = she’s; they are = they’re. Значение не меняется.</p>':''}`;}
function renderLesson(moveFocus=true){
  show('lesson');const day=currentDay();
  $('#lesson-counter').textContent=`${day.weekday.toUpperCase()}, ${plannedDate(day.id).toUpperCase()} · ${day.questions.length} ЗАДАНИЙ`;
  $('#lesson-title').textContent=day.title;$('#lesson-outcome').textContent=day.outcome;$('#lesson-time').textContent=day.minutes+' минут';
  $('#lesson-points').innerHTML=day.lesson.map(([title,body],i)=>`<article class="lesson-point"><span>0${i+1}</span><h2>${esc(title)}</h2><p>${esc(body)}</p></article>`).join('');
  $('#lesson-example').textContent=day.example;$('#lesson-translation').textContent=day.translation;$('#speaking-tip').textContent='Вслух для себя: '+day.speaking;
  $('#memory-cards').innerHTML=pronouns.map(([p],i)=>`<button type="button" class="memory-card" data-memory="${i}" aria-pressed="false" aria-label="${esc(p)}: вспомни форму, затем нажми"><strong lang="en">${esc(p)} …</strong><span>проверить себя</span></button>`).join('');
  $('#lesson-table').innerHTML=table(day.id);
  const mistakes=(latest(day.id-1)?.details||[]).filter(q=>!q.correct).slice(0,3);
  $('#yesterday-review').hidden=!mistakes.length;
  $('#review-flashcards').innerHTML=mistakes.map(q=>`<details><summary>${esc(q.prompt)}<br><small>${esc(q.instruction)}</small></summary><p><b>${esc(q.expected)}</b><br>${esc(q.explanation)}</p></details>`).join('');
  $('#go-practice').textContent=currentDraft()?'Продолжить мои задания →':'Теперь попробую сама →';save();if(moveFocus)focus('lesson-title');
}
function begin(){
  if(!currentDraft())state.drafts[state.day]={answers:{},personal:'',part:0,startedAt:new Date().toISOString(),hintUsed:false,attempt:(latest(state.day)?.attempt||0)+1};
  renderQuiz();
}
function updateProgress(){
  $('#answered-count').textContent=`${countAnswers()}/${currentDay().questions.length}`;
  document.querySelectorAll('.step-button').forEach((button,i)=>button.classList.toggle('complete',currentDay().questions.slice(i*4,i*4+4).every(q=>String(currentDraft().answers[q.id]||'').trim())));
}
function renderQuiz(moveFocus=true){
  if(!currentDraft())return renderLesson(moveFocus);
  show('exercise');const day=currentDay(),draft=currentDraft(),part=draft.part,totalParts=Math.ceil(day.questions.length/4),last=part===totalParts-1;
  $('#quiz-day').textContent=`${day.weekday.toUpperCase()} · ${day.title.toUpperCase()}`;
  const titles=Array.from({length:totalParts},(_,i)=>i===0?'Вспомни':i===totalParts-1?'Закрепи':i===1?'Продолжи':i===2?'Примени':'Проверь');
  $('#steps').style.gridTemplateColumns=`repeat(${totalParts},1fr)`;
  $('#steps').innerHTML=titles.map((title,i)=>`<button class="step-button" type="button" data-part="${i}" ${i===part?'aria-current="step"':''}><span>0${i+1}</span>${title}</button>`).join('');
  $('#section-counter').textContent=`ЧАСТЬ ${part+1} ИЗ ${totalParts}`;$('#section-title').textContent=titles[part]+(part===0?' сама.':'.');
  $('#quiz-rule').open=false;$('#quiz-rule-content').innerHTML=rule(day.id);
  $('#question-list').innerHTML=day.questions.slice(part*4,part*4+4).map((q,i)=>{
    const answer=draft.answers[q.id]||'';const dontKnow=answer===unknown;const long=q.options?.some(v=>v.length>8);
    const input=q.type==='choice'?`<div class="options ${long?'has-long-choices':''}">${q.options.map((option,j)=>`<label class="option"><input type="radio" name="${q.id}" value="${esc(option)}" ${answer===option?'checked':''} aria-describedby="prompt-${q.id}"><span>${esc(option)}</span></label>`).join('')}</div>`:`<label class="answer-label" for="${q.id}">Твой ответ</label><input type="text" id="${q.id}" name="${q.id}" maxlength="180" autocomplete="off" autocapitalize="sentences" spellcheck="false" aria-describedby="instruction-${q.id} prompt-${q.id}" value="${esc(dontKnow?'':answer)}" placeholder="${dontKnow?'Отмечено: пока не помню':'Напиши ответ на английском'}">`;
    return `<fieldset class="question-card" id="card-${q.id}" data-unknown="${dontKnow}"><legend>Задание ${String(part*4+i+1).padStart(2,'0')}</legend><p id="instruction-${q.id}" class="question-instruction">${esc(q.instruction)}</p><p id="prompt-${q.id}" class="prompt">${esc(q.prompt)}</p>${input}<button type="button" class="dont-know" data-unknown-question="${q.id}">${dontKnow?'✓ Отмечено: пока не помню':'Пока не помню'}</button></fieldset>`;
  }).join('');
  $('#personal-section').hidden=!last;$('#personal-label').textContent=day.personal;$('#personal').value=draft.personal;
  $('#previous').textContent=part===0?'← К объяснению':'← Назад';$('#next').textContent=last?'Проверить этот день ✓':'Дальше →';$('#step-note').textContent=last?'После проверки ответы фиксируются':'Проверка — в конце сегодняшнего дня';
  $('#validation-error').textContent='';updateProgress();save();if(moveFocus)focus('section-title');
}
function missingInPart(){return currentDay().questions.slice(currentDraft().part*4,currentDraft().part*4+4).filter(q=>!String(currentDraft().answers[q.id]||'').trim());}
function validatePart(){
  const missing=missingInPart();if(!missing.length)return true;
  for(const q of missing){$('#card-'+q.id).classList.add('invalid');$('#card-'+q.id).querySelectorAll('input').forEach(input=>input.setAttribute('aria-invalid','true'));}
  $('#validation-error').textContent=`Осталось ответить: ${missing.length}. Выбери ответ, напиши его или отметь «Пока не помню».`;
  $('#card-'+missing[0].id).querySelector('input').focus();return false;
}
function finish(){
  const draft=currentDraft();if(!draft)return;
  const day=currentDay();const missing=day.questions.findIndex(q=>!String(draft.answers[q.id]||'').trim());
  if(missing>=0){draft.part=Math.floor(missing/4);renderQuiz();validatePart();return;}
  const finishedAt=new Date().toISOString();
  const report={...evaluate(day.id,draft.answers),version:VERSION,id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,day:day.id,personal:draft.personal,attempt:draft.attempt,startedAt:draft.startedAt,finishedAt,durationSeconds:Math.max(0,Math.round((Date.parse(finishedAt)-Date.parse(draft.startedAt))/1000)),hintUsed:draft.hintUsed};
  state.reports[day.id] ||= [];state.reports[day.id].push(report);state.viewReport=report.id;delete state.drafts[day.id];$('#errors-only').checked=false;$('#copy-status').textContent='';renderResult();
}
function renderReview(){
  const report=activeReport();const rows=report.details.filter(q=>!$('#errors-only').checked||!q.correct);
  $('#answer-review').innerHTML=rows.length?rows.map(q=>`<article class="review-card ${q.correct?'':'wrong'}"><p class="review-status">${q.correct?'✓ ВЕРНО':'↗ ПОВТОРИ'} · ${String(report.details.indexOf(q)+1).padStart(2,'0')}</p><p class="question-instruction">${esc(q.instruction)}</p><h3>${esc(q.prompt)}</h3><p><b>Твой ответ:</b> ${esc(q.answer)}</p>${q.correct?'':`<p><b>Верный вариант:</b> ${esc(q.expected)}</p>`}<p class="explanation">${esc(q.explanation)}</p></article>`).join(''):'<p class="review-empty">Ошибок нет. Завтра попробуй вспомнить формы ещё раз!</p>';
}
function renderResult(moveFocus=true){
  const report=activeReport();if(!report)return renderHub(moveFocus);
  show('result');$('#result-day').textContent=`${days[report.day-1].weekday.toUpperCase()} · ПОПЫТКА ${report.attempt}`;$('#score-value').textContent=`${report.score}/${report.total}`;
  const ratio=report.score/report.total;$('#result-message').textContent=ratio===1?'Сегодня все ответы верные. Вернись завтра и вспомни правило ещё раз.':ratio>=.75?'Большая часть уже получается. Разбери ошибки — и на сегодня достаточно.':'Ты попробовала — теперь разберись в ответах. Открой объяснение к ошибкам и повтори трудные связки.';
  if(report.day===days.length&&ratio===1)$('#result-message').textContent='Всё верно! На занятии в четверг попробуй использовать to be в разговоре.';
  const topics=[...new Set(report.details.map(q=>q.topic))];$('#score-breakdown').innerHTML=topics.map(topic=>{const rows=report.details.filter(q=>q.topic===topic);return `<div class="score-item"><span>${esc(topic)}</span><strong>${rows.filter(q=>q.correct).length}/${rows.length}</strong></div>`;}).join('');
  try{$('#telegram-link').href=telegramUrl(username,report);$('#telegram-link').hidden=false;}catch{$('#telegram-link').hidden=true;}
  $('#telegram-preview').textContent=telegramText(report);$('#telegram-status').textContent='Сайт сам не отправляет сообщение и не видит, доставлено ли оно.';
  $('#personal-review').hidden=!report.personal.trim();$('#personal-answer').textContent=report.personal;
  const weak=[...new Set(report.details.filter(q=>!q.correct).map(q=>q.topic))];
  $('#next-day-note').innerHTML=report.day<days.length?'<strong>Завтра, в среду: вспомнить без подсказки.</strong><p>Вернись 21 октября. Сначала назови формы по памяти, затем открой вторую практику.</p>':`<strong>В четверг, 22 октября — занятие.</strong><p>${weak.length?'Что обсудить с преподавателем: '+esc(weak.join(', '))+'.':'Формы получаются. Подготовь три своих предложения с to be.'} Отправь отчёт в Telegram, чтобы преподаватель увидел результат.</p>`;
  renderReview();save();if(moveFocus)focus('result-title');
}
function download(){
  const report=activeReport();const url=URL.createObjectURL(new Blob(['\ufeff'+reportText(report)],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`to-be-day-${report.day}-attempt-${report.attempt}.txt`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

$('#welcome-map').innerHTML=days.map(day=>`<li><span>0${day.id}</span><div><b>${esc(day.title)}</b><small>${esc(day.focus)}</small></div></li>`).join('');
$('#start-practice').addEventListener('click',()=>{state.startDate ||= localDate();renderHub();});
$('.brand').addEventListener('click',event=>{event.preventDefault();if(state.phase==='welcome')window.scrollTo({top:0,behavior:'instant'});else renderHub();});
document.querySelectorAll('[data-home]').forEach(button=>button.addEventListener('click',()=>renderHub()));
$('#day-grid').addEventListener('click',event=>{const button=event.target.closest('button[data-day]');if(!button)return;state.day=Number(button.dataset.day);if(button.dataset.report){state.viewReport=button.dataset.report;$('#errors-only').checked=false;renderResult();}else if(currentDraft())renderQuiz();else if(latest(state.day)){state.viewReport=latest(state.day).id;$('#errors-only').checked=false;renderResult();}else renderLesson();});
$('#memory-cards').addEventListener('click',event=>{const button=event.target.closest('[data-memory]');if(!button)return;const [p,,verb]=pronouns[Number(button.dataset.memory)],open=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(open));button.setAttribute('aria-label',open?`${p} ${verb}: нажми, чтобы скрыть ответ`:`${p}: вспомни форму, затем нажми`);button.innerHTML=`<strong lang="en">${esc(p)} ${open?esc(verb):'…'}</strong><span>${open?'скрыть ответ':'проверить себя'}</span>`;});
$('#go-practice').addEventListener('click',begin);
$('#steps').addEventListener('click',event=>{const button=event.target.closest('[data-part]');if(button){currentDraft().part=Number(button.dataset.part);renderQuiz();}});
$('#quiz-rule').addEventListener('toggle',()=>{if($('#quiz-rule').open&&state.phase==='exercise'&&currentDraft()){currentDraft().hintUsed=true;save();}});
$('#exercise-form').addEventListener('input',event=>{const input=event.target,draft=currentDraft();if(!draft)return;if(input.id==='personal')draft.personal=input.value;else if(currentDay().questions.some(q=>q.id===input.name)){draft.answers[input.name]=input.value;const card=$('#card-'+input.name);card.dataset.unknown='false';card.classList.remove('invalid');card.querySelectorAll('input').forEach(el=>el.removeAttribute('aria-invalid'));card.querySelector('.dont-know').textContent='Пока не помню';}else return;$('#validation-error').textContent='';updateProgress();save();});
$('#question-list').addEventListener('click',event=>{const button=event.target.closest('[data-unknown-question]');if(!button)return;const id=button.dataset.unknownQuestion,card=$('#card-'+id);currentDraft().answers[id]=unknown;card.dataset.unknown='true';card.classList.remove('invalid');card.querySelectorAll('input').forEach(input=>{input.removeAttribute('aria-invalid');if(input.type==='radio')input.checked=false;else{input.value='';input.placeholder='Отмечено: пока не помню';}});button.textContent='✓ Отмечено: пока не помню';$('#validation-error').textContent='';updateProgress();save();});
$('#exercise-form').addEventListener('submit',event=>{event.preventDefault();if(!validatePart())return;if(currentDraft().part<Math.ceil(currentDay().questions.length/4)-1){currentDraft().part++;renderQuiz();}else finish();});
$('#previous').addEventListener('click',()=>{if(currentDraft().part){currentDraft().part--;renderQuiz();}else renderLesson();});
$('#errors-only').addEventListener('change',renderReview);
$('#telegram-link').addEventListener('click',()=>{$('#telegram-status').textContent='Откроется Telegram. Проверь получателя @'+username+', текст и нажми там «Отправить». Переход по кнопке сам по себе не отправляет сообщение.';});
$('#copy-report').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(telegramText(activeReport()));$('#copy-status').textContent='Скопировано. Вставь в диалог @'+username+'.';}catch{$('#copy-status').textContent='Открой «Посмотреть сообщение», выдели и скопируй текст вручную.';}});
$('#download-report').addEventListener('click',download);
$('#new-attempt').addEventListener('click',()=>{renderLesson();});

if(state.phase==='welcome')show('welcome');else if(state.phase==='exercise'&&currentDraft())renderQuiz(false);else if(state.phase==='lesson')renderLesson(false);else if(state.phase==='result'&&activeReport())renderResult(false);else renderHub(false);
save();
