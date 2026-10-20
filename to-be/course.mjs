export const VERSION = 'to-be-tue-wed-v3';
export const CLASS_DATE = '2026-10-22';
export const pronouns = [
  ['I','я','am'],['you','ты / вы','are'],['he','он — о мужчине','is'],['she','она — о женщине','is'],['it','оно / это — о предмете','is'],['we','мы','are'],['they','они','are'],
];
export const vocabulary = [
  ['ready','готов / готова','I am ready.','Я готова.'],['okay','в порядке','I am okay.','Я в порядке.'],['tired','устал / устала','I am tired.','Я устала.'],['busy','занят / занята','She is busy.','Она занята.'],['happy','рад / рада','I am happy.','Я рада.'],['sad','грустно','I am sad.','Мне грустно.'],['at home','дома','We are at home.','Мы дома.'],
];
const choose=(prompt,answer,options,explanation,topic='Смысл to be')=>({type:'choice',prompt,answers:[answer],options,explanation,topic,action:'Выбери правильный ответ',instruction:'Прочитай вопрос и выбери один ответ.',format:'Выбери один вариант.',example:'Что значит we? Правильный ответ: «мы».'});
const form=(p,meaning,verb)=>({...choose(p+' ___',verb,['am','is','are'],`Запомни: ${p} ${verb}. ${verb==='am'?'Форма am используется с I.':verb==='is'?'He, she и it употребляются с is.':'You, we и they употребляются с are.'}`,'Местоимения и формы'),translation:meaning,action:'Выбери форму для местоимения',instruction:'Выбери форму to be для этого местоимения: am, is или are.',example:p==='I'?'Для she нужна форма is: she is. Нажми is.':'Для I нужна форма am: I am. Нажми am.'});
const recall=(prompt,answer,explanation)=>({type:'text',prompt,answers:[answer],explanation,topic:'Три группы',action:'Напиши am, is или are',instruction:'Впиши форму, которая подходит к местоимению или ко всей группе. Напиши только am, is или are.',format:'Одно слово.',example:answer==='am'?'they ___: напиши are. Получится they are.':'I ___: напиши am. Получится I am.'});
const gap=(p,verb,word,translation)=>({type:'text',prompt:`${p} ___ ${word}.`,answers:[verb],translation,explanation:`${p} → ${verb}. Полное предложение: ${p} ${verb} ${word}.`,topic:'Вставить форму',action:'Вставь am, is или are',instruction:'Впиши пропущенную форму to be. Напиши только am, is или are.',format:'Одно слово.',example:p==='I'?'She ___ sad. Впиши is. Получится: She is sad.':'I ___ happy. Впиши am. Получится: I am happy.'});
const order=(tokens,answer,translation,explanation)=>({type:'order',prompt:translation,answers:[answer],tokens,explanation,topic:'Собрать предложение',action:'Собери предложение из слов',instruction:'Составь английское предложение с тем же значением. Нажимай на слова по порядку. Используй все слова. Кнопка «Убрать последнее» отменяет последний выбор.',format:'Нажми на все слова по порядку.',example:'Даны слова: tired. / are / You. Нажми You, затем are, затем tired. Получится: You are tired.'});
const fix=(prompt,answer,translation,explanation)=>({type:'text',prompt,answers:[answer],translation,explanation,topic:'Исправить ошибку',action:'Исправь предложение',instruction:'В предложении ошибка: форма to be неверная или пропущена. Перепиши предложение целиком и исправь её.',format:'Полное предложение.',example:'Ошибка: They is sad. Правильно: They are sad.'});
const write=(prompt,answer,help,explanation)=>({type:'text',prompt,answers:[answer],translation:help,explanation,topic:'Написать предложение',action:'Напиши предложение по-английски',instruction:'Переведи предложение на английский. Напиши его целиком. Используй полные формы: I am, she is, we are.',format:'Полное предложение.',example:'Я устала. По-английски: I am tired.'});

export const days = [
  {id:1,date:'2026-10-20',weekday:'Вторник',minutes:15,title:'Что такое to be. Местоимения и формы',focus:'Повтори значение to be и запомни, какая форма нужна с каждым местоимением.',outcome:'Сначала прочитай правило и повтори местоимения. Потом выполни 16 коротких заданий.',sections:[{start:0,title:'Что такое to be'},{start:3,title:'Местоимения'},{start:10,title:'Три группы'}],personal:'Если хочешь, напиши, какую форму было трудно выбрать. Это увидит преподаватель.',questions:[
    choose('Что означает to be?','быть',['быть','иметь','делать'],'To be — глагол «быть». В настоящем времени используем am, is или are.'),
    {...choose('Какие формы to be используются в настоящем времени?','am, is, are',['I, you, we','am, is, are','ready, happy, tired'],'Am, is и are — формы глагола to be. I, you и we — местоимения. Ready, happy и tired — слова о состоянии человека.'),example:'Вопрос: «Где местоимение: we или are?» Ответ: we.'},
    {...choose('Зачем нужна форма am в I am ready?','Без неё в предложении нет глагола.',['Она переводится как «я».','Она переводится как «готова».','Без неё в предложении нет глагола.'],'По-русски говорим «Я готова» без слова «быть». В английском здесь нужен глагол: I am ready. I — «я», ready — «готова», am — форма to be.'),example:'She is happy. — Она рада. В английском предложении есть глагол is, хотя в русском переводе слова «быть» нет.'},
    ...pronouns.map(([p,meaning,verb])=>form(p,meaning,verb)),
    recall('I ___','am','Только с I используем am: I am.'),
    recall('he / she / it ___','is','Одна группа: he is, she is, it is.'),
    recall('you / we / they ___','are','Одна группа: you are, we are, they are.'),
    {...choose('You означает «ты». Какую форму выбираем?','are',['am','is','are'],'Даже когда you — это один человек («ты»), нужна форма are.','Три группы'),action:'Выбери форму to be',example:'He означает «он». Для he выбираем is: he is.'},
    {...choose('You означает «вы». Какую форму выбираем?','are',['am','is','are'],'И для «ты», и для «вы» используем you are.','Три группы'),action:'Выбери форму to be',example:'We означает «мы». Для we выбираем are: we are.'},
    {...choose('В какой строке все формы выбраны верно?','I am · she is · they are',['I is · she am · they are','I am · she is · they are','I are · she is · they am'],'С I используем am; с he, she, it — is; с you, we, they — are.','Три группы'),instruction:'Проверь каждую пару в строке. Выбери строку, в которой нет ошибок.',example:'В строке «he is · we are» обе пары верные. В строке «he are · we is» обе формы неверные.'},
  ]},
  {id:2,date:'2026-10-21',weekday:'Среда',minutes:15,title:'Утвердительные предложения с to be',focus:'Вставь форму, собери предложение из слов, исправь ошибку и напиши фразу сама.',outcome:'Сначала повтори порядок слов и знакомые слова. Потом выполни 20 заданий с утвердительными предложениями.',sections:[{start:0,title:'Вставь форму'},{start:7,title:'Собери фразу'},{start:11,title:'Исправь'},{start:15,title:'Напиши сама'}],personal:'Напиши два предложения о себе: как ты себя чувствуешь и где находишься. Например: I am tired. I am at home. Выбери слова, которые подходят тебе: ready, okay, tired, busy, happy, sad, at home.',questions:[
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
export const tuesdayExtra = [
  ...[['я','I am'],['ты','you are'],['он','he is'],['она','she is'],['оно / это (о предмете)','it is'],['мы','we are'],['они','they are'],['вы','you are']].map(([prompt,answer])=>({
    type:'text',prompt,answers:[answer],format:'Два слова: местоимение и форма to be.',placeholder:'Напиши два слова',action:'Напиши местоимение и форму to be',instruction:'Переведи местоимение на английский и добавь am, is или are. Напиши два слова.',example:answer==='we are'?'я: I am.':'мы: we are.',explanation:`${prompt} — ${answer.split(' ')[0]}. Правильная пара: ${answer}.`,topic:'Местоимения и формы',
  })),
  choose('Как переводится to be?','быть',['делать','быть','иметь'],'To be означает «быть». Am, is и are — его формы в настоящем времени.'),
  {...choose('Почему в «Она рада» нет слова «быть», а в She is happy есть is?','В английском здесь нужен глагол.',['Is означает «рада».','She и is означают одно и то же.','В английском здесь нужен глагол.'],'В русском переводе глагол «быть» опускается. В английском is нужно оставить: She is happy.'),example:'I am ready. — Я готова. В английском есть am, хотя в русском переводе слова «быть» нет.'},
].map((q,i)=>({...q,id:`extra${i+1}`}));
export function evaluateSet(questions,answers){
  const details=questions.map(q=>({id:q.id,topic:q.topic,prompt:q.prompt,instruction:q.instruction,answer:String(answers[q.id]??'').trim(),expected:q.answers[0],correct:q.answers.some(a=>normalize(a)===normalize(answers[q.id])),explanation:q.explanation}));
  return {score:details.filter(q=>q.correct).length,total:details.length,details};
}
export function errorProgress(report,runs=[]){
  const answers=new Map((report?.details||[]).filter(q=>!q.correct).map(q=>[q.id,false]));
  const rounds=runs.filter(run=>run.mode==='errors'&&run.sourceReportId===report?.id);
  for(const run of rounds)for(const q of run.details)if(answers.has(q.id))answers.set(q.id,q.correct);
  return {total:answers.size,fixed:[...answers.values()].filter(Boolean).length,rounds:rounds.length,remaining:[...answers].filter(([,correct])=>!correct).map(([id])=>id)};
}
export function evaluate(dayId,answers){
  const day=days.find(d=>d.id===dayId);if(!day)throw new Error('Unknown day');
  const details=day.questions.map(q=>({id:q.id,topic:q.topic,prompt:q.prompt,instruction:q.instruction,answer:String(answers[q.id]??'').trim(),expected:q.answers[0],correct:q.answers.some(a=>normalize(a)===normalize(answers[q.id])),explanation:q.explanation}));
  return {score:details.filter(q=>q.correct).length,total:details.length,details};
}
export function reportText(report){
  const day=days[report.day-1],date=new Date(report.finishedAt).toLocaleString('ru-RU',{timeZone:'Asia/Yekaterinburg'});
  const lines=[`TO BE · ${day.weekday.toUpperCase()}: ${day.title}`,`Балл с первой проверки: ${report.score}/${report.total}`,`Попытка: ${report.attempt}`,`Выполнено: ${date} (UTC+5)`,`Время от начала заданий: ${Math.max(1,Math.round(report.durationSeconds/60))} мин. (с перерывами)`,`Подсказки во время заданий: ${report.hintUsed?'да':'нет'}`,`Код: ${report.id}`,''];
  report.details.forEach((q,i)=>lines.push(`${i+1}. ${q.prompt}`,`Ответ: ${q.answer}`,q.correct?'Верно':`Верный ответ: ${q.expected}`,''));
  if(report.personal.trim())lines.push('ДОПОЛНИТЕЛЬНЫЙ ОТВЕТ (проверяет преподаватель; в балл не входит)',report.personal,'');
  const weak=[...new Set(report.details.filter(q=>!q.correct).map(q=>q.topic))];
  lines.push('К ЗАНЯТИЮ В ЧЕТВЕРГ: '+(weak.length?weak.join(', '):'все ответы верные; использовать формы в разговоре.'),'Проверялись формы to be и порядок слов.');
  return lines.join('\n');
}
export function telegramText(report){
  const day=days[report.day-1],date=new Date(report.finishedAt).toLocaleDateString('ru-RU',{timeZone:'Asia/Yekaterinburg'});
  const lines=[`To be · ${day.weekday} — ${day.title}`,`Выполнено: ${date}`,`Результат с первой проверки: ${report.score}/${report.total} · попытка ${report.attempt}`,`Подсказки: ${report.hintUsed?'открывала таблицу':'не открывала во время заданий'}`,''];
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
