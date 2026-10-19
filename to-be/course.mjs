export const VERSION = 'to-be-tue-wed-v2';
export const CLASS_DATE = '2026-10-22';
export const pronouns = [
  ['I','я','am'],['you','ты / вы','are'],['he','он — о мужчине','is'],['she','она — о женщине','is'],['it','оно / это — о предмете','is'],['we','мы','are'],['they','они','are'],
];
export const vocabulary = [
  ['ready','готов / готова','I am ready.','Я готова.'],['okay','в порядке','I am okay.','Я в порядке.'],['tired','устал / устала','I am tired.','Я устала.'],['busy','занят / занята','She is busy.','Она занята.'],['happy','рад / рада','I am happy.','Я рада.'],['sad','грустно','I am sad.','Мне грустно.'],['at home','дома','We are at home.','Мы дома.'],
];
const choose=(prompt,answer,options,explanation,topic='Смысл to be')=>({type:'choice',prompt,answers:[answer],options,explanation,topic,action:'Выбери правильный ответ',instruction:'Прочитай вопрос. Нажми на один правильный вариант. Печатать ничего не нужно.',format:'Выбери один вариант.',example:'Пример: на вопрос «Что значит I?» выбери ответ «я».'});
const form=(p,meaning,verb)=>({...choose(p+' → ___',verb,['am','is','are'],`Запомни: ${p} ${verb}. ${verb==='am'?'Форма am используется с I.':verb==='is'?'He, she и it употребляются с is.':'You, we и they употребляются с are.'}`,'Местоимения и формы'),translation:meaning,action:'Выбери форму для местоимения',instruction:'Посмотри на местоимение. Нажми форму to be, которая нужна с ним: am, is или are.',example:p==='I'?'she → is. Значит, для she нужно нажать is.':'I → am. Значит, для I нужно нажать am.'});
const recall=(prompt,answer,explanation)=>({type:'text',prompt,answers:[answer],explanation,topic:'Три группы',action:'Вспомни форму и напиши её',instruction:'Напиши в поле только одно слово: am, is или are. Местоимения переписывать не нужно.',format:'Одно слово.',example:answer==='am'?'they → ___ → в поле напиши: are':'I → ___ → в поле напиши: am'});
const gap=(p,verb,word,translation)=>({type:'text',prompt:`${p} ___ ${word}.`,answers:[verb],translation,explanation:`${p} → ${verb}. Полное предложение: ${p} ${verb} ${word}.`,topic:'Вставить форму',action:'Вставь am, is или are',instruction:'В предложении пропущена форма to be. Напиши в поле только одно слово. Всё предложение переписывать не нужно.',format:'Одно слово.',example:p==='I'?'She ___ sad. → В поле напиши: is':'I ___ happy. → В поле напиши: am'});
const order=(tokens,answer,translation,explanation)=>({type:'order',prompt:translation,answers:[answer],tokens,explanation,topic:'Собрать предложение',action:'Собери предложение из слов',instruction:'Нажимай на слова в правильном порядке: сначала кто, затем форма to be, затем остальная часть. Чтобы отменить последний выбор, нажми «Убрать последнее».',format:'Нажми на все слова по порядку.',example:'happy. / am / I → нажми I, затем am, затем happy. Получится: I am happy.'});
const fix=(prompt,answer,translation,explanation)=>({type:'text',prompt,answers:[answer],translation,explanation,topic:'Исправить ошибку',action:'Исправь предложение',instruction:'Проверь форму to be: она неверная или пропущена. Напиши всё предложение целиком с правильной формой.',format:'Полное предложение.',example:'They is sad. → They are sad.'});
const write=(prompt,answer,help,explanation)=>({type:'text',prompt,answers:[answer],translation:help,explanation,topic:'Написать предложение',action:'Напиши предложение по-английски',instruction:'Напиши всё предложение целиком: местоимение + am / is / are + слово или выражение. Используй полную форму.',format:'Полное предложение.',example:'Я устала. → I am tired.'});

export const days = [
  {id:1,date:'2026-10-20',weekday:'Вторник',minutes:15,title:'Что такое to be. Местоимения и формы',focus:'Повтори значение to be и запомни, какая форма нужна с каждым местоимением.',outcome:'Сначала прочитай правило и повтори местоимения. Потом выполни 16 коротких заданий.',sections:[{start:0,title:'Что такое to be'},{start:3,title:'Местоимения'},{start:10,title:'Три группы'}],personal:'Если хочешь, напиши, какую связку было труднее всего запомнить. Это увидит преподаватель.',questions:[
    choose('Что означает to be?','быть',['быть','иметь','делать'],'To be — глагол «быть». В настоящем времени используем am, is или are.'),
    choose('Как правильно сказать «Я готова»?','I am ready.',['I ready.','I am ready.','I are ready.'],'В английском здесь нужен глагол: I am ready. С I используется am. Ready значит «готова».'),
    choose('Что можно сообщить с помощью to be?','Кто, какой или где.',['Кто, какой или где.','Только что человек делает.','Только сколько предметов.'],'To be помогает сказать, кто человек, какой он или где находится: I am happy. We are at home.'),
    ...pronouns.map(([p,meaning,verb])=>form(p,meaning,verb)),
    recall('I → ___','am','Только с I используем am: I am.'),
    recall('he / she / it → ___','is','Одна группа: he is, she is, it is.'),
    recall('you / we / they → ___','are','Одна группа: you are, we are, they are.'),
    {...choose('You означает «ты». Какую форму выбираем?','are',['am','is','are'],'Даже когда you — это один человек («ты»), нужна форма are.','Три группы'),example:'You are ready. — Ты готова.'},
    {...choose('You означает «вы». Какую форму выбираем?','are',['am','is','are'],'И для «ты», и для «вы» используем you are.','Три группы'),example:'You are at home. — Вы дома.'},
    choose('В какой строке все связки верные?','I am · she is · they are',['I am · she is · they are','I is · she am · they are','I are · she is · they am'],'Три группы: I → am; he/she/it → is; you/we/they → are.','Три группы'),
  ]},
  {id:2,date:'2026-10-21',weekday:'Среда',minutes:15,title:'Утвердительные предложения с to be',focus:'Вставь форму, собери предложение из слов, исправь ошибку и напиши фразу сама.',outcome:'Сначала повтори порядок слов и знакомые слова. Потом выполни 20 заданий с утвердительными предложениями.',sections:[{start:0,title:'Вставь форму'},{start:7,title:'Собери фразу'},{start:11,title:'Исправь'},{start:15,title:'Напиши сама'}],personal:'Дополнительно: напиши 2 правдивых предложения о себе. Например: I am ready. I am at home. Можно взять слова ready, okay, tired, busy, happy, sad, at home.',questions:[
    gap('I','am','ready','Я готова.'),gap('You','are','okay','Ты в порядке.'),gap('He','is','busy','Он занят.'),gap('She','is','happy','Она рада.'),gap('It','is','ready','Это готово.'),gap('We','are','tired','Мы устали.'),gap('They','are','at home','Они дома.'),
    order(['ready.','am','I'],'I am ready.','Я готова.','Сначала I, затем am, затем ready: I am ready.'),
    order(['is','busy.','She'],'She is busy.','Она занята.','She → is. Порядок слов: She is busy.'),
    order(['tired.','We','are'],'We are tired.','Мы устали.','We → are. Порядок слов: We are tired.'),
    order(['at home.','They','are'],'They are at home.','Они дома.','They → are. Выражение at home ставим после are: They are at home.'),
    fix('I is happy.','I am happy.','Нужно сказать: «Я рада».','С I нужна форма am: I am happy.'),
    fix('He are tired.','He is tired.','Нужно сказать: «Он устал».','С he нужна форма is: He is tired.'),
    fix('You am busy.','You are busy.','Нужно сказать: «Ты занята».','С you нужна форма are: You are busy.'),
    fix('She at home.','She is at home.','Нужно сказать: «Она дома».','Нельзя пропускать is: She is at home.'),
    write('Я в порядке.','I am okay.','в порядке → okay','I → am. Я в порядке: I am okay.'),
    write('Она рада.','She is happy.','рада → happy','She → is. Она рада: She is happy.'),
    write('Мы дома.','We are at home.','дома → at home','We → are. Мы дома: We are at home.'),
    write('Они готовы.','They are ready.','готовы → ready','They → are. Они готовы: They are ready.'),
    write('Он занят.','He is busy.','он — о мужчине; занят → busy','He → is. Он занят: He is busy.'),
  ]},
].map(day=>({...day,questions:day.questions.map((q,i)=>({...q,id:`d${day.id}q${i+1}`}))}));

export function normalize(value){return String(value??'').normalize('NFKC').toLowerCase().replace(/[’‘`]/g,"'").replace(/[,!?\.]/g,' ').replace(/\s+/g,' ').trim();}
export function evaluate(dayId,answers){
  const day=days.find(d=>d.id===dayId);if(!day)throw new Error('Unknown day');
  const details=day.questions.map(q=>({id:q.id,topic:q.topic,prompt:q.prompt,instruction:q.instruction,answer:String(answers[q.id]??'').trim(),expected:q.answers[0],correct:q.answers.some(a=>normalize(a)===normalize(answers[q.id])),explanation:q.explanation}));
  return {score:details.filter(q=>q.correct).length,total:details.length,details};
}
export function reportText(report){
  const day=days[report.day-1],date=new Date(report.finishedAt).toLocaleString('ru-RU',{timeZone:'Asia/Yekaterinburg'});
  const lines=[`TO BE · ${day.weekday.toUpperCase()}: ${day.title}`,`Балл с первой проверки: ${report.score}/${report.total}`,`Попытка: ${report.attempt}`,`Выполнено: ${date} (UTC+5)`,`Время от начала заданий: ${Math.max(1,Math.round(report.durationSeconds/60))} мин. (с перерывами)`,`Подсказки во время заданий: ${report.hintUsed?'да':'нет'}`,`Код: ${report.id}`,''];
  report.details.forEach((q,i)=>lines.push(`${i+1}. ${q.prompt}`,`Ответ: ${q.answer}`,q.correct?'✓ Верно':`Верный ответ: ${q.expected}`,''));
  if(report.personal.trim())lines.push('ДОПОЛНИТЕЛЬНЫЙ ОТВЕТ (проверяет преподаватель; в балл не входит)',report.personal,'');
  const weak=[...new Set(report.details.filter(q=>!q.correct).map(q=>q.topic))];
  lines.push('К ЗАНЯТИЮ В ЧЕТВЕРГ: '+(weak.length?weak.join(', '):'все ответы верные; использовать формы в разговоре.'),'Учебная практика. Балл рассчитан в браузере; самостоятельность выполнения не подтверждается.');
  return lines.join('\n');
}
export function telegramText(report){
  const day=days[report.day-1],date=new Date(report.finishedAt).toLocaleDateString('ru-RU',{timeZone:'Asia/Yekaterinburg'});
  const lines=[`📘 To be · ${day.weekday} — ${day.title}`,`Выполнено: ${date}`,`Результат с первой проверки: ${report.score}/${report.total} · попытка ${report.attempt}`,`Подсказки: ${report.hintUsed?'открывала таблицу или пример':'не открывала во время заданий'}`,''];
  const mistakes=report.details.filter(q=>!q.correct),weak=[...new Set(mistakes.map(q=>q.topic))];
  lines.push(weak.length?'К занятию в четверг повторить: '+weak.join(', '):'Все ответы верные.');
  if(mistakes.length){lines.push(`Ошибки (${mistakes.length}):`);for(const q of mistakes)lines.push(`${report.details.indexOf(q)+1}. ${q.prompt}\n${q.answer.slice(0,60)} → ${q.expected}`);}
  if(report.personal.trim())lines.push('','Дополнительно:',report.personal.slice(0,600));
  lines.push('',`Код отчёта: ${report.id.slice(0,8)}`);
  const result=lines.join('\n');return result.length<=3000?result:result.slice(0,2860)+'\n\nСообщение сокращено. Полный отчёт можно скачать на сайте.';
}
export function telegramUrl(username,report){
  const clean=String(username||'').replace(/^@/,'');if(!/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(clean))throw new Error('Не указан получатель Telegram.');
  return `https://t.me/${clean}?text=${encodeURIComponent(telegramText(report))}`;
}
