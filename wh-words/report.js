import {days,tasks,words,phrases} from './content.js?v=20261029-report-errors';
import {summarizeDay} from './progress.js?v=20261029-report-errors';

export function makeReportText(state,dayId){
  const stat=summarizeDay(state.quiz.answers,dayId),day=stat.day;
  const rows=tasks.filter(t=>day.taskIds.includes(t.id));
  const pending=rows.filter(t=>!state.quiz.answers[t.id]?.correct);
  const repeat=rows.filter(t=>{const a=state.quiz.answers[t.id];return a&&(a.firstTry===false||a.help||(!a.correct&&a.attempts>0));});
  const unresolved=pending.filter(t=>state.quiz.answers[t.id]?.feedback==='wrong');
  const list=day.id==='tuesday'?words:phrases,kind=day.id==='tuesday'?'words':'phrases',memory=state.memory[kind];
  const remembered=list.filter(x=>memory.last[x.id]===true).length;
  const hard=list.filter(x=>memory.last[x.id]===false).map(x=>x.en);
  return [
    `Домашняя работа · ${day.title}, ${day.date}`,
    'Тема: вопросительные слова и ответы',
    '',
    `Письменные задания: ${stat.done} из ${stat.total}.`,
    `С первой попытки без подсказки: ${stat.first}.`,
    `После ошибки или подсказки: ${stat.done-stat.first}.`,
    repeat.length?'Повторить на уроке: '+repeat.map(t=>'№ '+t.n).join(', ')+'.':'Заданий с отмеченными ошибками пока нет.',
    pending.length?'Не завершила: '+pending.map(t=>'№ '+t.n).join(', ')+'.':'Все письменные задания этого дня выполнены.',
    ...unresolved.map(t=>`№ ${t.n}: мой последний ответ «${state.quiz.answers[t.id].draft||'пусто'}» — ещё не исправлен.`),
    '',
    `${kind==='words'?'Заучивание слов':'Заучивание вопросов и ответов'}: ${remembered} из ${list.length} получилось написать по памяти.`,
    ...(hard.length?['Ещё трудно: '+hard.join(', ')+'.']:[]),
    `Устная минутка: ${state.oralDone[day.id]?'сделана (моя отметка).':'пока не отмечена.'}`
  ].join('\n');
}

// Opening a share sheet or copying text does not confirm message delivery.
export async function prepareReportDelivery(text,{share,copy}={}){
  if(share){
    try{await share({title:'Отчёт по английскому',text});return {stage:'shared',message:'Проверь, что сообщение появилось в вашем чате. Затем отметь отправку ниже.'};}
    catch(error){if(error?.name==='AbortError')return {stage:'ready',message:'Отправка отменена. Попробуй ещё раз или скопируй отчёт.'};}
  }
  if(copy){try{await copy(text);return {stage:'copied',message:'Отчёт скопирован. Теперь открой ваш чат и отправь текст.'};}catch{}}
  return {stage:'manual',message:'Не удалось скопировать автоматически. Выдели текст ниже и скопируй его вручную.'};
}

export function reportView(state,{esc,canShare}){
  const r=state.report,day=days.find(d=>d.id===r.day)||days[0],text=r.preparedText||makeReportText(state,day.id);
  const sent=state.reports[day.id].sentText===text;
  const prepared=['copied','shared','manual'].includes(r.stage);
  const first=canShare?'Нажми «Отправить отчёт».':'Нажми «Скопировать отчёт».';
  const second=canShare?'Выбери мессенджер и ваш чат с преподавателем.':'Открой ваш обычный чат с преподавателем.';
  return `<section class="report-page" aria-labelledby="section-title"><p class="eyebrow">ПОСЛЕДНИЙ ШАГ ДОМАШНЕЙ РАБОТЫ</p><h2 id="section-title" tabindex="-1">${sent?'Ты отметила, что отчёт отправлен':'Отправь отчёт преподавателю'}</h2><p class="report-lead">${sent?'Спасибо! Можно закончить на сегодня. Если сообщение не ушло, отправь его ещё раз.':'Результаты уже собраны. Отправь их в ваш обычный чат — даже если не всё получилось.'}</p><div class="report-days" role="group" aria-label="Отчёт за день">${days.map(d=>`<button type="button" data-report-day="${d.id}" aria-pressed="${d.id===day.id}">${d.title}</button>`).join('')}</div>
    ${sent?'<div class="report-success" role="status"><b>Отправка отмечена ✓</b><p>Эту отметку поставила ты после отправки сообщения.</p></div>':''}
    <div class="report-card">
      <p class="report-day">${day.title} · ${day.date}</p>
      ${prepared&&!sent?`<div class="report-status" role="status"><b>${r.stage==='copied'?'Текст скопирован. Осталось отправить.':r.stage==='shared'?'Проверь сообщение в чате.':'Скопируй текст вручную.'}</b><p>${esc(r.message)}</p></div>`:''}
      ${!sent?`<ol class="report-instructions">
        <li><b>1</b><span>${r.stage==='shared'?'Открой ваш чат с преподавателем.':r.stage==='manual'?'Нажми «Выделить текст» и выбери «Копировать».':r.stage==='copied'?'Текст отчёта уже скопирован.':first}</span></li>
        <li><b>2</b><span>${r.stage==='shared'?'Проверь, что в переписке появилось сообщение с отчётом.':r.stage==='copied'||r.stage==='manual'?'Открой ваш обычный чат. Удерживай поле сообщения и нажми «Вставить». На компьютере — Ctrl + V.':second}</span></li>
        <li><b>3</b><span>${r.stage==='shared'?'Если сообщение ушло, вернись сюда и нажми <strong>«Я отправила отчёт»</strong>.':'В чате нажми <strong>«Отправить»</strong>. Вернись сюда и нажми <strong>«Я отправила отчёт»</strong>.'}</span></li>
      </ol>`:''}
      ${!prepared&&r.message?`<p class="report-status" role="status">${esc(r.message)}</p>`:''}
      <div class="report-actions"><button type="button" class="button report-send ${prepared||sent?'secondary':''}" data-report-send ${r.busy?'disabled':''}>${r.busy?'Готовлю отчёт…':sent?'Отправить ещё раз':prepared?'Повторить отправку':canShare?'Отправить отчёт →':'Скопировать отчёт →'}</button>${canShare?'<button type="button" class="text-button" data-report-copy>Или скопировать отчёт</button>':''}</div>
      ${!sent?'<p class="report-note">Копирование ещё не отправляет сообщение. Последнее нажатие — «Отправить» в вашем чате.</p>':''}
      ${prepared&&!sent?'<button type="button" class="button report-confirm" data-report-confirm>Я отправила отчёт ✓</button>':''}
    </div>
    <details class="report-preview" ${r.stage==='manual'?'open':''}><summary>Текст отчёта — посмотреть или скопировать</summary><label class="sr-only" for="report-text">Текст отчёта</label><textarea id="report-text" readonly>${esc(text)}</textarea><button type="button" class="text-button" data-report-select>Выделить текст</button></details>
    <div class="report-bottom"><button type="button" class="text-button" data-report-tour>Покажи по шагам, как отправить →</button><button type="button" class="text-button" data-plan>Вернуться к плану →</button></div>
  </section>`;
}
