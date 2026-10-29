import {makeReportText} from './report.js?v=20261029-report-errors';
import {tasks} from './content.js?v=20261029-report-errors';
import {makeState} from './progress.js?v=20261029-report-errors';
import {recordMemory} from './memory.js?v=20261029-report-errors';

// Read-only demonstrations use fresh state, never a student's answers.
export const tourSteps = [
  {screen:'plan',target:'[data-plan-day="tuesday"] [data-memory-start="words"]',title:'Начни с этой кнопки',text:'Во вторник нажми «Начать со слов», в среду — «Начать с повторения». Сейчас я покажу весь путь. Нажимай «Дальше» в белой подсказке. В конце обязательно отправь отчёт преподавателю.'},
  {screen:'word',target:'.memory-model .audio-controls',title:'Послушай и повтори',text:'«Слушать» включает запись. «Медленно» — ту же запись медленнее. Повтори слово вслух два раза. Можно слушать сколько нужно.',sound:'What'},
  {screen:'word',target:'[data-memory-hide]',title:'Теперь спрячь образец',text:'Когда послушала и повторила, нажми эту кнопку. Английское слово исчезнет — попробуй вспомнить его сама.'},
  {screen:'recall',target:'#memory-question',title:'Скажи, потом напиши',text:'Нажми в белое поле. Переключи клавиатуру на английский и напиши слово. Затем нажми «Проверить себя» под полем. Если забыла — «Не помню — покажи образец».'},
  {screen:'checked',target:'[data-memory-next]',title:'После проверки — дальше',text:'Сайт покажет, верно ли написано слово, и откроет образец. Послушай его. Затем нажми «Дальше», чтобы перейти к следующему слову. Ошибаться можно.'},
  {screen:'theory',target:'.guide-progress [data-guide-step="3"]',title:'Здесь объясняется правило',text:'После слов откроется схема. Нажимай шаги 1–4: от обычного предложения к вопросу и ответу. Четвёртый шаг показывает, почему одного Yes / No недостаточно.'},
  {screen:'phrase',target:'.memory-model .audio-row',title:'У вопроса есть свой ответ',text:'«Слушать» — вопрос, «Ответ» — пример ответа. Повтори обе реплики. Затем скрой образец: появятся два поля, для вопроса и ответа.',sound:'How are you?'},
  {screen:'choice',target:'.exercise-options',title:'Если даны варианты — выбери',text:'Прочитай задание и пример над ним. Нажми на один из вариантов, затем на «Проверить». Просто выбрать вариант недостаточно — нужна проверка.'},
  {screen:'order',target:'.word-bank',title:'Собери вопрос кнопками',text:'Нажимай слова в нужном порядке: они появятся в строке выше. «Убрать последнее» отменяет последний выбор. Когда вопрос собран, нажми «Проверить».'},
  {screen:'error',target:'#answer-feedback',title:'Почему не пускает дальше?',text:'Если ответ неверный, сайт прямо пишет «Здесь ошибка» и объясняет причину. Исправь ответ и снова нажми «Проверить». После верного ответа кнопка «Дальше» станет доступна.'},
  {screen:'help',target:'.help-actions',title:'Застряла? Здесь помощь',text:'В заданиях с белым полем напиши свой ответ и нажми «Проверить». Если не получается, открой «Нужна подсказка» или «Показать ответ», затем попробуй снова.'},
  {screen:'next',target:'[data-quiz-next]',title:'Как перейти к следующему заданию',text:'После верного ответа синяя кнопка «Дальше» станет доступна. Пока ответ не проверен или есть ошибка, она бледная. После последнего задания здесь будет результат.'},
  {screen:'speaking',target:'[data-speech-reveal]',title:'В конце — скажи сама',text:'Сначала произнеси ответ вслух, затем нажми «Я сказала — сравнить с образцом». Послушай и сравни. Записывать голос не нужно: сайт не оценивает произношение.'},
  {screen:'report',target:'[data-report-send]',title:'Главный последний шаг — отчёт',text:'После устной минутки откроется отчёт. Нажми эту кнопку. На телефоне выбери мессенджер и ваш чат. Если открылось копирование, текст нужно вставить в чат самой.'},
  {screen:'copied',target:'.report-instructions li:nth-child(2)',title:'Теперь открой ваш чат',text:'После копирования открой переписку с преподавателем. Удерживай поле сообщения → «Вставить». На компьютере — Ctrl + V. Затем обязательно нажми «Отправить» в чате.'},
  {screen:'confirm',target:'[data-report-confirm]',title:'Проверь, что сообщение ушло',text:'Когда сообщение появилось в вашем чате, вернись сюда и нажми «Я отправила отчёт». Одного копирования мало: сначала нужно отправить текст преподавателю.'},
  {screen:'plan',target:'.top-nav [data-plan]',title:'Всегда можно вернуться сюда',text:'«План» возвращает к практике. «Отчёт» открывает отправку в любой момент, даже если не всё получилось. «Как заниматься» повторяет подсказки. Сейчас вернёмся на твоё место.'}
];

export function makeTourState(screen){
  const s=makeState();
  if(['word','recall','checked','phrase'].includes(screen)){
    const kind=screen==='phrase'?'phrases':'words';s.tab=kind;s.memory[kind].active=true;
    if(screen==='recall')s.memory.words.phase='recall';
    if(screen==='checked'){s.memory.words.question='What';recordMemory(s.memory.words,'words');}
  }else if(screen==='theory'){s.tab='theory';s.theory.step=3;}
  else if(screen==='speaking'){s.tab='speaking';s.speaking.day='wednesday';}
  else if(['report','copied','confirm'].includes(screen)){
    s.tab='report';for(const t of tasks.filter(x=>s.quiz.queue.includes(x.id)))s.quiz.answers[t.id]={draft:t.answers[0],cup:null,tokens:t.id==='wh5'?[1,2,0]:[],correct:true,attempts:1,help:false,revealed:false,firstTry:true,feedback:'correct'};s.oralDone.tuesday=true;
    if(screen!=='report'){s.report.stage=screen==='copied'?'copied':'shared';s.report.preparedText=makeReportText(s,'tuesday');s.report.message=screen==='copied'?'Открой ваш чат и отправь скопированный текст.':'После отправки сообщения отметь это кнопкой ниже.';}
  }
  else if(['choice','order','help','next','error'].includes(screen)){
    s.quiz.started=true;s.quiz.pos=screen==='choice'?0:screen==='order'?4:screen==='next'?5:6;
    if(screen==='error')s.quiz.answers.wh7={draft:'Where she is?',cup:null,tokens:[],correct:false,attempts:1,help:false,revealed:false,firstTry:false,feedback:'wrong'};
    if(screen==='next')s.quiz.answers.wh6={draft:'I am at home.',cup:null,tokens:[],correct:true,attempts:1,help:false,revealed:false,firstTry:true,feedback:'correct'};
  }
  return s;
}

const clamp=(n,min,max)=>Math.min(Math.max(n,min),Math.max(min,max));
export function tourPlacement(rect,panel,width,height){
  const gap=16,edge=12;
  const x=clamp(rect.left-7,6,width-6),y=clamp(rect.top-7,6,height-6);
  const hole={x,y,width:Math.max(0,Math.min(width-6,rect.right+7)-x),height:Math.max(0,Math.min(height-6,rect.bottom+7)-y)};
  const left=clamp(x+(hole.width-panel.width)/2,edge,width-panel.width-edge);
  const below=y+hole.height+gap,above=y-panel.height-gap;
  let top;
  if(below+panel.height<=height-edge)top=below;
  else if(above>=edge)top=above;
  else if(rect.right+gap+panel.width<=width-edge)return {hole,left:rect.right+gap,top:clamp(y,edge,height-panel.height-edge)};
  else top=clamp(below,edge,height-panel.height-edge);
  return {hole,left,top};
}

export function createGuidedTour({show,onEnter,onExit,onSound,onStop}){
  let steps=tourSteps,mode='all',active=false,index=0,layer,dialog,hole,outline,title,body,count,prev,next,sound,originalScroll=0,inertNodes=[],frame=0,run=0,resizeObserver;
  const by=s=>layer.querySelector(s);
  function position(){
    if(!active)return;
    const target=document.querySelector(steps[index].target);
    const width=document.documentElement.clientWidth,height=window.visualViewport?.height||window.innerHeight;
    layer.style.height=height+'px';
    let rect=target?.getBoundingClientRect();
    dialog.style.maxHeight=Math.max(150,height-(rect?.height||0)-48)+'px';
    if(!rect||!rect.width||!rect.height){hole.setAttribute('width','0');outline.setAttribute('width','0');dialog.style.left='12px';dialog.style.top='12px';return;}
    let p=tourPlacement(rect,dialog.getBoundingClientRect(),width,height);
    const d=dialog.getBoundingClientRect();
    if(!(p.left+d.width<=p.hole.x||p.left>=p.hole.x+p.hole.width||p.top+d.height<=p.hole.y||p.top>=p.hole.y+p.hole.height)){
      window.scrollTo({top:Math.max(0,window.scrollY+rect.top-20),behavior:'instant'});
      rect=target.getBoundingClientRect();p=tourPlacement(rect,dialog.getBoundingClientRect(),width,height);
    }
    for(const node of [hole,outline])for(const [name,value] of Object.entries(p.hole))node.setAttribute(name,String(value));
    dialog.style.left=p.left+'px';dialog.style.top=p.top+'px';
  }
  function requestPosition(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{frame=0;position();});}
  function present(){
    const step=steps[index],last=index===steps.length-1;run++;
    onStop();show(makeTourState(step.screen));
    count.textContent=`Шаг ${index+1} из ${steps.length}`;by('progress').value=index+1;
    title.textContent=step.title;body.textContent=step.text;prev.disabled=index===0;
    next.textContent=last?(mode==='report'?'Вернуться к отчёту':'Вернуться к занятию'):'Дальше →';sound.hidden=!step.sound;
    dialog.style.visibility='hidden';const token=run;
    requestAnimationFrame(()=>{
      if(!active||token!==run)return;
      const target=document.querySelector(step.target);
      if(target){const r=target.getBoundingClientRect(),h=window.visualViewport?.height||window.innerHeight;dialog.style.maxHeight=Math.max(150,h-r.height-48)+'px';const room=h-dialog.getBoundingClientRect().height-r.height-36;const top=clamp(room,20,260);window.scrollTo({top:Math.max(0,window.scrollY+r.top-top),behavior:'instant'});}
      position();dialog.style.visibility='visible';title.focus({preventScroll:true});
    });
  }
  function close(){
    if(!active)return;
    active=false;run++;onStop();cancelAnimationFrame(frame);resizeObserver?.disconnect();
    window.removeEventListener('resize',requestPosition);window.removeEventListener('scroll',requestPosition);window.visualViewport?.removeEventListener('resize',requestPosition);
    document.removeEventListener('keydown',keys,true);
    for(const [node,wasInert] of inertNodes)node.inert=wasInert;
    inertNodes=[];layer.remove();document.body.classList.remove('tour-running');
    onExit();window.scrollTo({top:originalScroll,behavior:'instant'});document.querySelector('#tour-start')?.focus({preventScroll:true});
  }
  function keys(e){
    if(!active)return;
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key==='Tab'){
      const buttons=[...dialog.querySelectorAll('button:not(:disabled)')].filter(b=>!b.hidden);
      const first=buttons[0],last=buttons.at(-1),focus=document.activeElement;
      if(e.shiftKey&&(focus===first||!buttons.includes(focus))){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&(focus===last||!dialog.contains(focus))){e.preventDefault();first.focus();}
    }
  }
  function start(requestedMode='all'){
    if(active)return;
    mode=requestedMode;steps=mode==='report'?tourSteps.filter(s=>['report','copied','confirm'].includes(s.screen)):tourSteps;
    originalScroll=window.scrollY;active=true;index=0;onEnter();
    layer=document.createElement('div');layer.id='guided-tour';
    layer.innerHTML=`<svg class="tour-shade" aria-hidden="true"><defs><mask id="tour-mask"><rect width="100%" height="100%" fill="white"/><rect id="tour-hole" fill="black" rx="9"/></mask></defs><rect width="100%" height="100%" fill="rgba(15,23,42,.72)" mask="url(#tour-mask)"/><rect id="tour-outline" rx="9" fill="none" stroke="white" stroke-width="3"/></svg><section class="tour-dialog" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-text"><div class="tour-top"><span id="tour-count"></span><button type="button" data-tour-close aria-label="Закрыть подсказки">Закрыть ×</button></div><progress max="${steps.length}" value="1" aria-label="Шаги ознакомления"></progress><div class="tour-copy"><h2 id="tour-title" tabindex="-1"></h2><p id="tour-text"></p><button type="button" class="tour-listen" data-tour-sound hidden>▶ Попробовать звук</button><p class="audio-note tour-audio-status" aria-live="polite"></p><p class="tour-safe">Это показ. Задания за тебя не выполняются.</p></div><div class="tour-actions"><button type="button" data-tour-prev>← Назад</button><button type="button" data-tour-next>Дальше →</button></div></section>`;
    document.body.append(layer);document.body.classList.add('tour-running');
    dialog=by('.tour-dialog');hole=by('#tour-hole');outline=by('#tour-outline');title=by('#tour-title');body=by('#tour-text');count=by('#tour-count');prev=by('[data-tour-prev]');next=by('[data-tour-next]');sound=by('[data-tour-sound]');
    inertNodes=[...document.body.children].filter(n=>n!==layer&&n.tagName!=='SCRIPT').map(n=>[n,n.inert]);for(const [node] of inertNodes)node.inert=true;
    layer.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.hasAttribute('data-tour-close'))close();
      else if(b.hasAttribute('data-tour-prev')&&index>0){index--;present();}
      else if(b.hasAttribute('data-tour-next')){if(index===steps.length-1)close();else{index++;present();}}
      else if(b.hasAttribute('data-tour-sound'))onSound(steps[index].sound,b);
    });
    document.addEventListener('keydown',keys,true);window.addEventListener('resize',requestPosition);window.addEventListener('scroll',requestPosition,{passive:true});window.visualViewport?.addEventListener('resize',requestPosition);
    if(typeof ResizeObserver!=='undefined'){resizeObserver=new ResizeObserver(requestPosition);resizeObserver.observe(dialog);}
    present();
  }
  return {start,close,get active(){return active;}};
}
