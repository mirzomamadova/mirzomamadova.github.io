(function(global){
'use strict';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const capital=s=>s[0].toUpperCase()+s.slice(1);
const reduce=()=>global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
function person(group=false){return `<svg viewBox="0 0 90 55" role="presentation" aria-hidden="true">${group?'<circle cx="24" cy="13" r="10"/><path d="M7 51v-9a17 17 0 0 1 34 0v9z"/><circle cx="66" cy="13" r="10"/><path d="M49 51v-9a17 17 0 0 1 34 0v9z"/>':'<circle cx="45" cy="13" r="11"/><path d="M27 51v-9a18 18 0 0 1 36 0v9z"/>'}</svg>`;}
function questionData(m){const rest=m.rest||m.ending;return {subject:m.subject,be:m.be,rest,statement:`${m.subject} ${m.be} ${rest}.`,question:`${capital(m.be)} ${m.subject==='I'?'I':m.subject.toLowerCase()} ${rest}?`,ru:m.ru,questionRu:m.questionRu||m.ruQuestion};}
function question(m){const d=questionData(m);return `<div class="theory-demo" data-theory-demo="question" data-phase="statement"><div class="theory-before"><span>Было</span><b lang="en">${escape(d.statement)}</b></div><p class="theory-step" data-theory-step>Форма <b>${d.be}</b> стоит после <b>${d.subject}</b>.</p><div class="theory-track"><div class="theory-route" aria-hidden="true">↶</div><div class="theory-sentence" lang="en"><span class="theory-token theory-subject" data-piece="subject">${d.subject}</span><span class="theory-token theory-be" data-piece="be">${d.be}</span><span class="theory-token theory-rest">${escape(d.rest)}</span><span class="theory-punctuation" data-piece="punctuation">.</span></div></div><p class="theory-translation" data-theory-translation>${escape(d.ru)}</p><p class="theory-status" data-theory-status role="status">Посмотри, как ${d.be} переедет перед ${d.subject}.</p><button type="button" class="primary" data-theory="move">Показать перестановку</button></div>`;}
async function move(root,m){
 if(root.dataset.busy==='true')return false;
 root.innerHTML=question(m);root.dataset.busy='true';
 const demo=root.querySelector('[data-theory-demo]'),d=questionData(m),subject=demo.querySelector('[data-piece="subject"]'),be=demo.querySelector('[data-piece="be"]'),punctuation=demo.querySelector('[data-piece="punctuation"]'),button=demo.querySelector('[data-theory="move"]'),step=demo.querySelector('[data-theory-step]'),status=demo.querySelector('[data-theory-status]');
 button.disabled=true;step.innerHTML=`Переносим <b>${d.be}</b> перед <b>${d.subject}</b>.`;status.textContent='Остальные слова сохраняются.';demo.dataset.phase='highlight';
 await pause(reduce()?0:350);if(!root.isConnected)return false;
 const beforeBe=be.getBoundingClientRect(),beforeSubject=subject.getBoundingClientRect();be.textContent=capital(d.be);subject.textContent=d.subject==='I'?'I':d.subject.toLowerCase();subject.parentNode.insertBefore(be,subject);
 const afterBe=be.getBoundingClientRect(),afterSubject=subject.getBoundingClientRect(),dx=beforeBe.left-afterBe.left,dy=beforeBe.top-afterBe.top,sx=beforeSubject.left-afterSubject.left,sy=beforeSubject.top-afterSubject.top;
 demo.dataset.phase='moving';
 if(!reduce()&&be.animate){
  const a=be.animate([{transform:`translate(${dx}px,${dy}px)`,offset:0},{transform:`translate(${dx*.85}px,-52px)`,offset:.25},{transform:`translate(${dx*.15}px,-52px)`,offset:.75},{transform:'translate(0,0)',offset:1}],{duration:1900,easing:'ease-in-out'});
  const b=subject.animate([{transform:`translate(${sx}px,${sy}px)`},{transform:'translate(0,0)'}],{duration:1900,easing:'ease-in-out'});
  await Promise.allSettled([a.finished,b.finished]);
 }
 if(!root.isConnected)return false;
 punctuation.textContent='?';demo.dataset.phase='question';demo.querySelector('[data-theory-translation]').textContent=d.questionRu;step.innerHTML=`Теперь <b>${capital(d.be)}</b> стоит перед <b>${subject.textContent}</b>.`;status.textContent=`Получился вопрос: ${d.question} Можно ответить «да» или «нет».`;button.disabled=false;button.textContent='Показать ещё раз';root.dataset.busy='false';return true;
}
function answerData(group){return group?{
 you:'вы',self:'мы',pronoun:'we',be:'are',meaning:'Вы готовы?',yes:'Yes, we are.',no:'No, we aren’t.',reply:'Да, мы готовы.',
 scene:'Преподаватель спрашивает двух учениц. Нигор отвечает за них обеих.',
 caption:'Спрашивают вас двоих: «вы». Ты отвечаешь за вас обеих: «мы».',
 reason:'В ответе «мы» — we. С we говорим are. Поэтому: Yes, we are.'
 }:{
 you:'ты',self:'я',pronoun:'I',be:'am',meaning:'Ты готова?',yes:'Yes, I am.',no:'No, I’m not.',reply:'Да, я готова.',
 scene:'Преподаватель спрашивает Нигор. Нигор отвечает о себе.',
 caption:'Преподаватель говорит тебе «ты». Ты говоришь о себе «я».',
 reason:'В ответе «я» — I. С I говорим am. Поэтому: Yes, I am.'
 };}
function answer(group=false,step=0){
 const d=answerData(group),english=step>0,rule=step===2;
 const questionRu=group?'Девочки, <b>вы</b> готовы?':'Нигор, <b>ты</b> готова?';
 const replyRu=group?'Да, <b>мы</b> готовы.':'Да, <b>я</b> готова.';
 const questionEn=`<span class="answer-form">Are</span> <span class="answer-person">you</span> ready?`;
 const replyEn=`Yes, <span class="answer-person">${d.pronoun}</span> <span class="answer-form">${d.be}</span>.`;
 return `<div class="answer-lesson" data-theory-demo="answer" data-answer-step="${step}">
 <div class="answer-step">Шаг ${step+1} из 3 · ${['Сначала по-русски','Тот же разговор по-английски','Выбираем am или are'][step]}</div>
 <p class="answer-scene">${d.scene}</p>
 <div class="answer-conversation">
 <section class="answer-turn teacher"><div class="answer-speaker">${person()}<b>Преподаватель спрашивает</b></div><p class="answer-speech" ${english?'lang="en"':''}>${english?questionEn:questionRu}</p>${english?`<p class="answer-meaning">${d.meaning}</p>`:''}<p class="answer-pair">${rule?'<b>you</b> → <strong>are</strong>':english?`<b>you</b> = ${d.you}`:'Обращается к тебе'+(group?' и другой ученице':'')}</p></section>
 <section class="answer-turn learner"><div class="answer-speaker">${person(group)}<b>${group?'Нигор отвечает за двоих':'Нигор отвечает'}</b></div><p class="answer-speech" ${english?'lang="en"':''}>${english?replyEn:replyRu}</p>${english?`<p class="answer-meaning">${d.reply}</p>`:''}<p class="answer-pair">${rule?`<b>${d.pronoun}</b> → <strong>${d.be}</strong>`:english?`<b>${d.pronoun}</b> = ${d.self}`:group?'Говорит о вас обеих':'Говорит о себе'}</p></section>
 </div>
 <p class="answer-explanation" role="status">${rule?d.reason:english?`Ты ответила «${d.self}» — по-английски <b>${d.pronoun}</b>.`:d.caption}</p>
 <button type="button" class="primary" data-theory="answer">${step===0?'Теперь по-английски':step===1?`Почему ${d.pronoun} ${d.be}?`:'Показать с начала'}</button>
 ${rule?`<details class="answer-extra"><summary>Если ответ «нет»</summary><p lang="en"><b>${d.no}</b></p><p>${group?'Нет, мы не готовы.':'Нет, я не готова.'}</p></details>`:''}
 </div>`;
}
async function showAnswer(root,group=false){
 const step=Number(root.querySelector('[data-answer-step]')?.dataset.answerStep||0);
 root.innerHTML=answer(group,(step+1)%3);
 const demo=root.querySelector('[data-theory-demo]');
 if(!reduce()&&demo.animate)await demo.animate([{opacity:.45},{opacity:1}],{duration:220,easing:'ease-out'}).finished.catch(()=>{});
 return true;
}
global.QuestionTheory={question,move,answer,showAnswer,questionData,answerData};
})(globalThis);
