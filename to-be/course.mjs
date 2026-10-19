export const VERSION = 'to-be-tue-wed-v1';
export const CLASS_DATE = '2026-10-22';
export const pronouns = [
  ['I','я','am',"I’m"],['you','ты / вы','are',"you’re"],['he','он','is',"he’s"],['she','она','is',"she’s"],['it','это; о предмете, животном, погоде','is',"it’s"],['we','мы','are',"we’re"],['they','они','are',"they’re"],
];
const choice=(prompt,answer,options,explanation,topic='Формы',instruction='Выбери ответ.')=>({type:'choice',prompt,answers:[answer],options,explanation,topic,instruction});
const forms=(prompt,answer,explanation)=>choice(prompt,answer,['am','is','are'],explanation);
const text=(prompt,answers,explanation,topic='Формы',instruction='Впиши ответ на английском.')=>({type:'text',prompt,answers:Array.isArray(answers)?answers:[answers],explanation,topic,instruction});
const recall=(p,answer)=>text(p+' → ___',answer,`С ${p} употребляется ${answer}: ${p} ${answer}.`,'Местоимения','Впиши только форму to be: am, is или are.');

export const days=[
  {
    id:1,date:'2026-10-20',weekday:'Вторник',title:'Понять и запомнить',focus:'Что такое to be · кто с какой формой',minutes:'10–15',outcome:'Разберёшься, зачем нужен to be, и свяжешь каждое местоимение с am, is или are.',
    lesson:[
      ['Что такое to be?', 'To be — глагол «быть». В настоящем времени у него три формы: am, is и are. С их помощью говорим, кто человек, какой он и где находится.'],
      ['В русском пропускаем, в английском ставим', '«Я дома» → I am at home. «Она добрая» → She is kind. «Мы друзья» → We are friends. В этих английских предложениях to be нужен, хотя в русском нет слова «есть».'],
      ['Запомни три группы', 'I → am. He / she / it → is. You / we / they → are. С you используем are и для «ты», и для «вы». Tom → he → is. My friends → they → are.'],
    ],
    example:'I am a student. She is my friend. We are at home.',translation:'Я учусь. Она моя подруга. Мы дома.',
    speaking:'Назови по памяти: I am; you are; he is; she is; it is; we are; they are. Затем проверь карточки.',
    personal:'Напиши 2 предложения о себе: кто ты и где сейчас. Образец: I am a student. I am at home.',
    questions:[
      choice('Что означает to be?','быть',['быть','иметь','делать'],'To be — «быть». В настоящем времени у него формы am, is, are.','Смысл'),
      choice('Что помогает выразить to be в этих примерах?','кто, какой или где',['кто, какой или где','как бегать','что покупать'],'I am a student — кто. I am happy — какая. I am at home — где.','Смысл'),
      choice('Как сказать «Я дома»?','I am at home.',['I at home.','I am at home.','I are at home.'],'В английском предложении нужно am: I am at home.','Смысл'),
      ...pronouns.map(([p,,verb])=>forms(p+' ___',verb,`Запомни связку: ${p} ${verb}.`)),
      forms('I ___ ready. (Я готова.)','am','С I нужна форма am: I am ready.'),
      forms('She ___ my friend. (Она моя подруга.)','is','She → is. She is my friend.'),
      forms('We ___ at home. (Мы дома.)','are','We → are. We are at home.'),
      forms('Tom ___ a student. (Том учится.)','is','Tom — один человек. Его имя можно заменить на he: Tom is a student.'),
      forms('My friends ___ here. (Мои друзья здесь.)','are','My friends → they → are.'),
      forms('It ___ cold. (Холодно.)','is','С it употребляется is: It is cold.'),
    ],
  },
  {
    id:2,date:'2026-10-21',weekday:'Среда',title:'Вспомнить без подсказки',focus:'Формы по памяти · сокращения · свои фразы',minutes:'12–15',outcome:'Вспомнишь формы самостоятельно, исправишь ошибки и подготовишься к занятию в четверг.',
    lesson:[
      ['Сначала вспомни вчерашнее', 'Не глядя в таблицу, назови формы для I, you, he, she, it, we, they. Затем открой карточки и проверь себя. Если вчера были ошибки, они появятся ниже для повторения.'],
      ['Один смысл — две записи', 'I am = I’m. You are = you’re. He is = he’s. She is = she’s. It is = it’s. We are = we’re. They are = they’re. Апостроф показывает пропущенные буквы. В наших примерах ’s означает is.'],
      ['Проверь себя перед занятием', 'Сначала найди подлежащее: о ком говорится? Подбери am, is или are. Anna → she → is. Anna and Tom → they → are. My bag → it → is. Затем прочитай всё предложение.'],
    ],
    example:'I’m ready. She’s here. They’re my friends.',translation:'Я готова. Она здесь. Они мои друзья.',
    speaking:'Назови все 7 связок без карточек. Затем скажи 3 правдивых предложения о себе и знакомых.',
    personal:'Напиши 3 предложения: кто ты; где или какая ты сейчас; кто или какая твоя подруга. Например: I am a student. I’m at home. My friend is kind.',
    questions:[
      ...pronouns.map(([p,,verb])=>recall(p,verb)),
      text('I am happy.',"I'm happy.",'I am = I’m. Happy — счастлива.','Сокращения','Сократи I am. Напиши предложение целиком.'),
      text('She is here.',"She's here.",'She is = she’s. Here — здесь.','Сокращения','Сократи she is. Напиши предложение целиком.'),
      text('They’re my friends.','They are my friends.','They’re = they are. My friends — мои друзья.','Сокращения','Раскрой сокращение. Напиши предложение целиком.'),
      text('You’re ready.','You are ready.','You’re = you are. Ready — готова.','Сокращения','Раскрой сокращение. Напиши предложение целиком.'),
      text('I ___ at home. (Я дома.)','am','I → am. I am at home.','Формы','Впиши только пропущенную форму to be.'),
      text('You ___ my friend. (Ты моя подруга.)','are','You → are. You are my friend.','Формы','Впиши только пропущенную форму to be.'),
      text('Anna ___ here. (Анна здесь.)','is','Anna → she → is.','Формы','Впиши только пропущенную форму to be.'),
      text('Anna and Tom ___ friends. (Анна и Том — друзья.)','are','Anna and Tom — два человека: they → are.','Формы','Впиши только пропущенную форму to be.'),
      text('My bag ___ here. (Моя сумка здесь.)','is','My bag → it → is.','Формы','Впиши только пропущенную форму to be.'),
      text('He are a student.','He is a student.','С he нужна форма is. Сохрани a перед student.','Исправление ошибок','Исправь ошибку. Напиши предложение целиком.'),
      text('We is at home.','We are at home.','С we нужна форма are.','Исправление ошибок','Исправь ошибку. Напиши предложение целиком.'),
      text('I ready.',['I am ready.',"I'm ready."],'В английском здесь нужен глагол: I am ready. / I’m ready.','Исправление ошибок','Добавь пропущенный глагол. Напиши предложение целиком.'),
      choice('Зачем в «She is kind» стоит is?','Это форма «быть»; в английском она здесь нужна.',['Это форма «быть»; в английском она здесь нужна.','Is переводится как «она».','Is означает «добрая».'],'She — она. Kind — добрая. Is — форма to be, которую в русском предложении обычно не переводим.','Смысл'),
    ],
  },
].map(day=>({...day,questions:day.questions.map((q,i)=>({...q,id:`d${day.id}q${i+1}`}))}));

export function normalize(value){return String(value??'').normalize('NFKC').toLowerCase().replace(/[’‘`]/g,"'").replace(/[,!?\.]/g,' ').replace(/\s+/g,' ').trim();}
export function evaluate(dayId,answers){
  const day=days.find(d=>d.id===dayId);if(!day)throw new Error('Unknown day');
  const details=day.questions.map(q=>({id:q.id,topic:q.topic,prompt:q.prompt,instruction:q.instruction,answer:String(answers[q.id]??'').trim(),expected:q.answers[0],correct:q.answers.some(a=>normalize(a)===normalize(answers[q.id])),explanation:q.explanation}));
  return{score:details.filter(q=>q.correct).length,total:details.length,details};
}
export function reportText(report){
  const day=days[report.day-1],date=new Date(report.finishedAt).toLocaleString('ru-RU',{timeZone:'Asia/Yekaterinburg'});
  const lines=[`TO BE · ${day.weekday.toUpperCase()}: ${day.title}`,`Балл: ${report.score}/${report.total}`,`Попытка: ${report.attempt}`,`Выполнено: ${date} (UTC+5)`,`Время от начала заданий: ${Math.max(1,Math.round(report.durationSeconds/60))} мин. (с перерывами)`,`Шпаргалка во время заданий: ${report.hintUsed?'да':'нет'}`,`Код: ${report.id}`,''];
  report.details.forEach((q,i)=>lines.push(`${i+1}. ${q.instruction} ${q.prompt}`,`Ответ: ${q.answer}`,q.correct?'✓ Верно':`Нужна правка → ${q.expected}`,''));
  if(report.personal.trim())lines.push('СВОИ ПРЕДЛОЖЕНИЯ (проверяет преподаватель; в балл не входят)',report.personal,'');
  const weak=[...new Set(report.details.filter(q=>!q.correct).map(q=>q.topic))];
  lines.push('К ЗАНЯТИЮ В ЧЕТВЕРГ: '+(weak.length?weak.join(', '):'все ответы верные; проверить перенос в свои предложения.'),'Учебная практика. Балл рассчитан в браузере; самостоятельность выполнения не подтверждается.');
  return lines.join('\n');
}
export function telegramText(report){
  const day=days[report.day-1],date=new Date(report.finishedAt).toLocaleDateString('ru-RU',{timeZone:'Asia/Yekaterinburg'});
  const lines=[`📘 To be · ${day.weekday} — ${day.title}`,`Выполнено: ${date}`,`Результат: ${report.score}/${report.total} · попытка ${report.attempt}`,`Шпаргалка: ${report.hintUsed?'использовала':'не открывала во время заданий'}`,''];
  const mistakes=report.details.filter(q=>!q.correct),weak=[...new Set(mistakes.map(q=>q.topic))];
  lines.push(weak.length?'К занятию в четверг повторить: '+weak.join(', '):'Все ответы верные.');
  if(mistakes.length){lines.push(`Ошибки (${mistakes.length}):`);for(const q of mistakes)lines.push(`${report.details.indexOf(q)+1}. ${q.prompt}\n${q.answer.slice(0,60)} → ${q.expected}`);}
  if(report.personal.trim())lines.push('','Мои предложения:',report.personal.slice(0,600));
  lines.push('',`Код отчёта: ${report.id.slice(0,8)}`);
  const result=lines.join('\n');return result.length<=3000?result:result.slice(0,2860)+'\n\nСообщение сокращено. Полный отчёт можно скачать на сайте.';
}
export function telegramUrl(username,report){
  const clean=String(username||'').replace(/^@/,'');if(!/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(clean))throw new Error('Не указан получатель Telegram.');
  return`https://t.me/${clean}?text=${encodeURIComponent(telegramText(report))}`;
}
