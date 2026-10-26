import {wordLessons,learningQuestions} from './word-practice.mjs?v=4';
export {wordLessons,learningQuestions};
export const VERSION=1;
export const STORAGE_KEY='to-be-questions-homework-v1';
export const recipient='sitoshik';
export const words=[
 {en:'clear',ru:'понятно / понятный',cue:'понятно (про объяснение)',sentence:'It is clear.',translation:'Это понятно.',question:'Is it clear?'},
 {en:'right',ru:'права / прав',cue:'права / прав (про ответ или мнение)',sentence:'I am right.',translation:'Я права.',question:'Am I right?'}
];
export const models=[
 {subject:'You',be:'are',rest:'busy',ru:'Ты занята.',questionRu:'Ты занята?'},
 {subject:'She',be:'is',rest:'tired',ru:'Она устала.',questionRu:'Она устала?'},
 {subject:'I',be:'am',rest:'ready',ru:'Я готова.',questionRu:'Я готова?'}
];
const choice=(prompt,answer,options,explanation,extra={})=>({type:'choice',topic:'Механизм вопроса',action:'Выбери один ответ',instruction:'Прочитай задание. Нажми на один вариант, затем на «Проверить». Ничего печатать не нужно.',format:'Один выбранный вариант.',example:'Если нужно выбрать форму для I, нажми am.',prompt,answers:[answer],options,explanation,...extra});
const transform=(source,answer,ru)=>({type:'text',topic:'Построение вопроса',action:'Преврати предложение в вопрос',instruction:'Прочитай предложение. Найди am / is / are и поставь перед местоимением. Сохрани остальные слова. В поле ниже напиши весь вопрос и поставь ?.',format:'Весь вопрос по-английски, а не одно слово.',example:'You are busy. → Are you busy?',prompt:source,ru,answers:[answer],explanation:`${source} → ${answer} Форма to be переместилась перед местоимением. Остальные слова сохранились.`});
const order=(source,tokens,answer,ru)=>({type:'order',topic:'Построение вопроса',action:'Собери вопрос из слов',instruction:'Нажимай на слова в нужном порядке: сначала am / is / are, затем местоимение, затем остальные слова. Используй все карточки. Если ошиблась, нажми «Убрать последнее».',format:'Весь вопрос в строке над карточками. Печатать не нужно.',example:'Карточки busy? / you / Are → Are you busy?',prompt:source,ru,tokens,answers:[answer],explanation:`${answer} В начало перешла форма to be. Слова at home, если они есть, остаются вместе.`});
const fix=(source,answer,ru)=>({type:'text',topic:'Исправление ошибки',action:'Исправь вопрос',instruction:'В строке ниже есть ошибка. Проверь форму am / is / are и порядок слов. В поле ответа перепиши весь вопрос правильно.',format:'Правильный вопрос целиком. Объяснение печатать не нужно.',example:'Are she busy? → Is she busy? С she нужна is.',prompt:source,ru,answers:[answer],explanation:`Правильно: ${answer} Сначала подходящая форма to be, затем местоимение и остальные слова.`});
const build=(source,answer,ru)=>({type:'text',topic:'Построение вопроса',action:'Напиши вопрос сама',instruction:'Даны местоимение и знакомое выражение. Выбери для этого местоимения am / is / are. Напиши форму первой, затем местоимение и выражение. В конце поставь ?.',format:'Весь вопрос по-английски.',example:'She / busy → Is she busy?',prompt:source,ru,answers:[answer],explanation:`${answer} Сначала выбрали форму для местоимения и поставили её в начало.`});
const short=(prompt,answers,ru,explanation)=>({type:'text',topic:'Короткие ответы',action:'Дай короткий ответ',instruction:'Прочитай вопрос и указание «да» или «нет». Реши, о ком отвечаешь. Напиши Yes или No, местоимение и форму to be. В отрицании добавь not или знакомое сокращение.',format:'Короткий английский ответ целиком, не только Yes или No.',example:'Are you ready? Ответь «да» о себе → Yes, I am. Ответь «нет» → No, I’m not.',prompt,ru,answers,explanation});
const recall=(ru,answer)=>({type:'text',topic:'Слова clear и right',action:'Вспомни слово',instruction:'Прочитай русский смысл. Вспомни английское слово и напиши его в поле ниже. Предложение составлять не нужно.',format:'Одно английское слово.',example:'«Готова / готов» → ready.',prompt:ru,answers:[answer],explanation:answer==='clear'?'Clear — понятно / понятный. It is clear. Это понятно.':'Right — права / прав. I am right. Я права.'});
const vocabChoice=(en,answer,options)=>choice(en,answer,options,`${en} — ${answer}`,{topic:'Слова clear и right',action:'Вспомни перевод',instruction:'Прочитай английское слово. Нажми на его русский смысл, затем на «Проверить».',example:'Ready — «готова / готов».'});
const subjectChange=(source,answer,ru)=>({type:'text',topic:'Построение вопроса',action:'Спроси о другом человеке',instruction:'Прочитай подсказку под фразой. Замени местоимение на указанное. Выбери подходящую к нему форму to be и напиши весь вопрос.',format:'Вопрос с новым местоимением.',example:'Are you busy? Теперь спроси о ней: she → Is she busy?',prompt:source,ru,answers:[answer],explanation:`${answer} При смене местоимения проверь форму: I–am, he/she/it–is, you/we/they–are.`});
export const parts=[
 {id:1,title:'Разбираемся по шагам',minutes:'15–20',focus:'Находим форму to be и переносим её перед местоимением.',questions:[
  vocabChoice('clear','понятно',['устала','понятно','занята']),
  vocabChoice('right','права / прав',['дома','готова / готов','права / прав']),
  choice('Общий вопрос нужен, чтобы узнать: так это или нет. Как можно на него ответить?','Да или нет.',['Только назвать имя.','Да или нет.','Только назвать место.'],'Общий вопрос допускает ответ Yes или No.',{example:'Is she busy? — Yes, she is. / No, she isn’t.'}),
  choice('They are at home. Найди форму to be.','are',['They','are','at home'],'Are — форма to be. В вопросе она переместится перед they.',{example:'В She is ready. форма to be — is.'}),
  choice('They are at home. Куда перенести are, чтобы получился вопрос?','Перед they.',['Перед they.','После home.','Убрать из предложения.'],'Are they at home? Слово are теперь стоит перед they.',{example:'She is busy. → Is she busy? Слово is стоит перед she.'}),
  choice('___ she tired?','Is',['Am','Is','Are'],'С she нужна is: Is she tired?',{action:'Выбери форму для вопроса',example:'___ I ready? → Am I ready? С I нужна am.'}),
  choice('___ I right?','Am',['Are','Am','Is'],'С I нужна am: Am I right?',{action:'Выбери форму для вопроса',ru:'Я права?',example:'___ she busy? → Is she busy? С she нужна is.'}),
  choice('___ you busy?','Are',['Is','Am','Are'],'С you нужна are: Are you busy?',{action:'Выбери форму для вопроса',example:'___ he tired? → Is he tired?'}),
  order('We are ready.',['ready?','we','Are'],'Are we ready?','Нужно спросить: «Мы готовы?»'),
  order('It is clear.',['clear?','Is','it'],'Is it clear?','Нужно спросить: «Это понятно?»'),
  transform('He is at home.','Is he at home?','Нужно спросить: «Он дома?»'),
  transform('They are tired.','Are they tired?','Нужно спросить: «Они устали?»'),
  choice('Почему в вопросе Is she ready? стоит is?','Потому что с she нужна is.',['Потому что любой вопрос начинается с is.','Потому что с she нужна is.','Потому что ready всегда требует is.'],'Форму выбираем по местоимению: she → is. С they было бы Are they ready?',{example:'I am ready. → Am I ready? Форма am подходит к I.'}),
  transform('She is busy.','Is she busy?','Нужно спросить: «Она занята?»')
 ]},
 {id:2,title:'Меняем слова и местоимения',minutes:'15–20',focus:'Используем тот же порядок с I, you, he, she, it, we, they.',questions:[
  recall('Понятно (про объяснение)','clear'),recall('Права / прав (про ответ или мнение)','right'),
  transform('I am tired.','Am I tired?','Нужно спросить: «Я устала?»'),
  fix('Is you ready?','Are you ready?','Нужно спросить: «Ты готова?»'),
  transform('He is right.','Is he right?','Нужно спросить: «Он прав?»'),
  fix('She ready is?','Is she ready?','Нужно спросить: «Она готова?»'),
  transform('It is clear.','Is it clear?','Нужно спросить: «Это понятно?»'),
  order('We are at home.',['at home?','we','Are'],'Are we at home?','Нужно спросить: «Мы дома?»'),
  order('They are busy.',['they','busy?','Are'],'Are they busy?','Нужно спросить: «Они заняты?»'),
  subjectChange('Are you at home?','Is he at home?','Теперь спроси о нём: используй he. Смысл: «Он дома?»'),
  short('Are you busy?',['Yes, I am.'],'Ответь «да» о себе.','Спрашивают тебя одну: you. Ты отвечаешь о себе: I. Yes, I am. Последнюю форму после Yes не сокращаем.'),
  short('Is she at home?',["No, she isn't.",'No, she is not.',"No, she's not."],'Ответь «нет» о ней.','Она — she. С she нужна is: No, she isn’t. No, she is not. и No, she’s not. тоже подходят.'),
  choice('Are you ready? Вопрос обращён к тебе одной. Какое местоимение нужно в твоём ответе о себе?','I',['you','she','I'],'Когда говоришь о себе, используй I: Yes, I am. / No, I’m not.',{topic:'Короткие ответы',example:'Are you tired? — No, I’m not. Спрашивают тебя, а ты говоришь о себе.'}),
  choice('Is it clear? Выбери смысл вопроса.','Это понятно?',['Это понятно?','Она готова?','Я права?'],'Clear — понятно. It здесь относится к объяснению.',{topic:'Понимание смысла',example:'Are you busy? — «Ты занята?»'})
 ]},
 {id:3,title:'Строим вопросы самостоятельно',minutes:'15–20',focus:'Строим вопросы с новыми сочетаниями слов и объясняем порядок.',questions:[
  {...recall('It is ___. Это понятно.','clear'),instruction:'Прочитай предложение и перевод. Впиши только пропущенное английское слово.',example:'I am ___. Я готова. → ready.'},
  {...recall('She is ___. Она права.','right'),instruction:'Прочитай предложение и перевод. Впиши только пропущенное английское слово.',example:'She is ___. Она занята. → busy.'},
  build('I / busy','Am I busy?','Я занята?'),build('They / right','Are they right?','Они правы?'),build('He / at home','Is he at home?','Он дома?'),
  fix('Am they tired?','Are they tired?','Они устали?'),fix('You are ready?','Are you ready?','Ты готова?'),
  subjectChange('Is he busy?','Are we busy?','Теперь спроси о нас: используй we. Смысл: «Мы заняты?»'),
  transform('She is tired.','Is she tired?','Нужно спросить: «Она устала?»'),
  {type:'text',topic:'Механизм вопроса',action:'Верни обычное предложение',instruction:'Сейчас перед тобой вопрос. Сделай утверждение: поставь местоимение первым, затем форму to be. Сохрани остальные слова. В конце поставь точку.',format:'Всё утвердительное предложение по-английски.',example:'Is she busy? → She is busy.',prompt:'Are we ready?',ru:'Нужно сказать: «Мы готовы».',answers:['We are ready.'],explanation:'We are ready. В утверждении we стоит перед are.',reverse:true},
  short('Am I right?',['Yes, you are.'],'Собеседник спрашивает о себе. Ответь ему «да».','Собеседник сказал I о себе. Ты отвечаешь ему, поэтому you: Yes, you are.'),
  short('Is it clear?',["No, it isn't.",'No, it is not.',"No, it's not."],'Ответь «нет» про объяснение.','It относится к объяснению и остаётся в ответе: No, it isn’t.'),
  short('Are they tired?',['Yes, they are.'],'Ответь «да» о них.','Они — they. С they нужна are: Yes, they are. После Yes последнюю форму не сокращаем.'),
  choice('Как превратить утверждение с to be в общий вопрос?','Перенести am / is / are перед местоимением.',['Добавить not в конец.','Перенести am / is / are перед местоимением.','Убрать am / is / are.'],'We are busy. → Are we busy? Переносим форму to be перед местоимением и сохраняем остальные слова.',{example:'He is ready. → Is he ready? Остальные слова сохранились.'})
 ]}
].map(part=>({...part,questions:part.questions.map((q,i)=>({...q,id:`p${part.id}q${i+1}`}))}));
parts[1].questions.push({...short('Are you ready?',['Yes, we are.'],'Вопрос задают вашей группе. Ответь «да» за всех вас.','You относится к вашей группе. Вы отвечаете о себе вместе: we. С we нужна are: Yes, we are.'),id:'p2yougroup',answerSubject:'we',example:'Are you busy? Отвечаю только о себе → Yes, I am. За всю группу → Yes, we are.'});
parts[2].questions.push({...short('Are you tired?',["No, we aren't.",'No, we are not.',"No, we're not."],'Вопрос задают вашей группе. Ответь «нет» за всех вас.','Группа говорит о себе: we. С we нужна are. No, we aren’t.'),id:'p3yougroup',answerSubject:'we',example:'Are you ready? Отвечаю только о себе → No, I’m not. За всю группу → No, we aren’t.'});
export const allQuestions=[...parts.flatMap(p=>p.questions),...wordLessons.flatMap(p=>p.questions),...learningQuestions];
export const practiceFor=part=>wordLessons.find(p=>p.part===part);
export const allowedQuestions=part=>[...parts.find(p=>p.id===part).questions,...practiceFor(part).questions,...(part===1?learningQuestions:[])];
export const questionById=id=>allQuestions.find(q=>q.id===id);
export const normalize=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[’‘`]/g,"'").replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();
export function judge(q,value){return q.answers.some(a=>normalize(a)===normalize(value));}
export function feedback(q,value){
 const n=normalize(value),expected=normalize(q.answers[0]);
 if(judge(q,value))return 'Верно. Прочитай свой ответ вслух.';
 if(q.topic==='Слова clear и right')return 'Вспомни два слова: clear — понятно; right — права / прав. Затем попробуй ещё раз.';
 if(q.topic==='Короткие ответы'){
  if(q.answerSubject==='we')return 'Отвечаем за всю группу: we. С we нужна are. Проверь, нужен ответ «да» или «нет».';
  if(/^yes\b/.test(n)&&/\b(i'm|you're|he's|she's|it's|we're|they're)$/.test(n))return 'После Yes не сокращай последнюю форму. Например: Yes, I am.';
  if(q.prompt.startsWith('Are you'))return 'Спрашивают тебя одну. В ответе о себе нужно I, затем am. Проверь, нужен ответ «да» или «нет».';
  if(q.prompt.startsWith('Am I'))return 'Собеседник спрашивает о себе. Ты отвечаешь ему: you. С you нужна are.';
  return 'Сохрани местоимение из вопроса. Добавь подходящую форму to be. Для «нет» нужна not или сокращение.';
 }
 if(q.type==='choice')return 'Пока не совпало. Прочитай задание и пример ещё раз, затем выбери другой вариант.';
 if(q.reverse)return 'Нужно утверждение: местоимение, затем am / is / are, затем остальные слова.';
 if(!/^(am|is|are)\b/.test(n))return 'В общем вопросе am / is / are стоит перед местоимением. Перенеси форму в начало.';
 const a=n.split(' '),b=expected.split(' ');
 if(a[1]!==b[1])return 'Проверь, о ком спрашиваешь. Сразу после am / is / are нужно местоимение из задания.';
 if(a[0]!==b[0])return 'Проверь пару: I — am; he / she / it — is; you / we / they — are.';
 return 'Начало вопроса получилось. Проверь остальные слова: их нужно сохранить и написать без пропусков.';
}
export const freshItem=()=>({value:'',tokens:[],first:null,firstValue:null,helped:false,tries:0,correct:false,revealed:false,done:false});
export const fresh=()=>({version:VERSION,view:'home',part:1,active:null,runs:[],drafts:{},wordPassed:[],modelIndex:0,modelStep:0});
export function newDraft(part,kind='main',ids=null,source=null){return {part,kind,source,ids:ids||(kind==='learn'?learningQuestions:kind==='words'?practiceFor(part).questions:parts.find(p=>p.id===part).questions).map(q=>q.id),index:0,items:{},personal:'',started:new Date().toISOString()};}
export function markHelp(item){item.helped=true;return item;}
export function checkItem(q,item){const valid=item.value.trim()&&(!['order','letters'].includes(q.type)||item.tokens.length===q.tokens.length);if(!valid)return {valid:false,message:q.type==='letters'?'Сначала собери слово. Используй все буквы.':'Сначала дай свой ответ. В задании с карточками используй все слова.'};const ok=judge(q,item.value);if(item.first===null){item.first=ok&&!item.helped;item.firstValue=item.value;}item.tries++;item.correct=ok;item.done=ok;return {valid:true,correct:ok,message:feedback(q,item.value)};}
export function revealItem(item){if(item.first===null)item.first=false;item.helped=true;item.revealed=true;item.done=true;return item;}
export function reportFor(draft,runs=[]){
 if(!draft.ids.every(id=>draft.items[id]?.done))throw new Error('Сначала закончи задания.');
 const details=draft.ids.map(id=>{const q=questionById(id),s=draft.items[id];return {id,topic:q.topic,prompt:q.prompt,answer:s.firstValue??s.value,firstCaptured:s.firstValue!==null,finalAnswer:s.value,expected:q.answers[0],first:s.first===true&&!s.helped,helped:s.helped,correct:s.correct,tries:s.tries};});
 return {id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`,part:draft.part,kind:draft.kind,source:draft.source,attempt:runs.filter(r=>r.part===draft.part&&r.kind===draft.kind).length+1,details,personal:draft.personal,started:draft.started,finished:new Date().toISOString(),wordWork:draft.kind==='main'?runs.filter(r=>r.part===draft.part&&r.kind==='words').at(-1)?.details.map(d=>({...d})):undefined};
}
export function score(report,topic=null){const items=topic?report.details.filter(d=>d.topic===topic):report.details;return {correct:items.filter(d=>d.first).length,total:items.length};}
export function reportText(r){const s=score(r),v=score(r,'Слова clear и right'),g=r.details.filter(d=>d.topic!=='Слова clear и right');return [r.kind==='learn'||r.details.every(d=>d.id.startsWith('learn'))?'Clear и right · отдельное заучивание':`To be · общие вопросы · часть ${r.part}`,r.kind==='learn'?'Заучивание слов':r.kind==='words'?'Задания на слова этого дня':r.kind==='review'?'Работа над трудными заданиями':'Домашнее задание',`Попытка ${r.attempt}`,`С первой проверки (с образцами): ${s.correct}/${s.total}`,`Слова clear/right: ${v.correct}/${v.total}`,`Остальные задания: ${g.filter(d=>d.first).length}/${g.length}`,`Открыт разбор ответа: ${r.details.filter(d=>d.helped).length}`,...(r.kind==='main'?[r.wordWork?`Отдельные задания на слова: ${r.wordWork.filter(d=>d.first).length}/${r.wordWork.length} с первой проверки`:'Отдельные задания на слова: ещё не выполнены']:[]),`Выполнено: ${new Date(r.finished).toLocaleString('ru-RU',{timeZone:'Asia/Yekaterinburg'})}`,...r.details.filter(d=>!d.first).map(d=>`Повторить: ${d.prompt}\n${d.firstCaptured?'Первый ответ':'Сохранённый ответ'}: ${d.answer||'открыт разбор'}\nВерно: ${d.expected}`),...(r.personal.trim()?['Свои вопросы (проверяет преподаватель):',r.personal]:[])].join('\n');}
export function telegramUrl(r){let t=reportText(r);if(t.length>3000)t=t.slice(0,2850)+'\nПолный отчёт можно скопировать на сайте.';return `https://t.me/${recipient}?text=${encodeURIComponent(t)}`;}
export function loadState(raw){
 try{const s=JSON.parse(raw);if(!s||s.version!==VERSION)return fresh();const clean=fresh();
  clean.part=parts.some(p=>p.id===s.part)?s.part:1;
  clean.wordPassed=Array.isArray(s.wordPassed)?s.wordPassed.filter(x=>['clear-en','right-en','clear-ru','right-ru'].includes(x)):[];
  clean.runs=Array.isArray(s.runs)?s.runs.filter(r=>r&&typeof r.id==='string'&&parts.some(p=>p.id===r.part)&&['main','review','words','learn'].includes(r.kind)&&Array.isArray(r.details)&&r.details.length&&r.details.every(d=>questionById(d.id)&&typeof d.answer==='string')&&typeof r.personal==='string'&&Number.isFinite(Date.parse(r.finished))):[];
  for(const [key,d] of Object.entries(s.drafts||{})){
   if(!d||!parts.some(p=>p.id===d.part)||!['main','review','words','learn'].includes(d.kind)||!Array.isArray(d.ids)||!d.ids.length||new Set(d.ids).size!==d.ids.length||!d.ids.every(id=>allowedQuestions(d.part).some(q=>q.id===id)))continue;
   const copy=newDraft(d.part,d.kind,d.ids,d.source);copy.index=Math.min(d.ids.length-1,Math.max(0,Number.isInteger(d.index)?d.index:0));copy.personal=String(d.personal||'').slice(0,800);copy.started=Number.isFinite(Date.parse(d.started))?d.started:copy.started;
   for(const id of d.ids){const q=questionById(id),a=d.items?.[id];if(!a)continue;const st=freshItem();st.value=String(a.value||'').slice(0,240);st.tokens=['order','letters'].includes(q.type)&&Array.isArray(a.tokens)&&new Set(a.tokens).size===a.tokens.length&&a.tokens.every(i=>Number.isInteger(i)&&i>=0&&i<q.tokens.length)?a.tokens:[];if(['order','letters'].includes(q.type))st.value=st.tokens.map(i=>q.tokens[i]).join(q.type==='letters'?'':' ');st.first=[true,false,null].includes(a.first)?a.first:null;st.firstValue=typeof a.firstValue==='string'?a.firstValue.slice(0,240):null;st.helped=a.helped===true;st.tries=Math.max(0,Number(a.tries)||0);st.correct=judge(q,st.value);st.revealed=a.revealed===true;st.done=(st.correct&&st.first!==null)||st.revealed;copy.items[id]=st;}if(copy.kind==='main'){for(const q of parts.find(p=>p.id===copy.part).questions)if(!copy.ids.includes(q.id))copy.ids.push(q.id);}clean.drafts[key]=copy;
  }
  clean.active=clean.drafts[s.active]?s.active:null;clean.view=['home','words','model','part','quiz','result'].includes(s.view)?s.view:'home';clean.activeReport=clean.runs.some(r=>r.id===s.activeReport)?s.activeReport:null;if(clean.view==='quiz'&&!clean.active)clean.view='home';if(clean.view==='result'&&!clean.activeReport)clean.view='home';return clean;
 }catch{return fresh();}
}
