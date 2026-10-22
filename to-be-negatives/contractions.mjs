export const shortForms=[
 {full:'I am not',short:"I'm not",meaning:'я не',example:"I'm not ready. — Я не готова."},
 {full:'is not',short:"isn't",meaning:'не: с he, she, it',example:"She isn't busy. — Она не занята."},
 {full:'are not',short:"aren't",meaning:'не: с you, we, they',example:"We aren't tired. — Мы не устали."}
];
const phrases=[
 ['I am not ready.',"I'm not ready.",'Я не готова.'],
 ['You are not busy.',"You aren't busy.",'Ты не занята.'],
 ['He is not tired.',"He isn't tired.",'Он не устал.'],
 ['She is not ready.',"She isn't ready.",'Она не готова.'],
 ['It is not at home.',"It isn't at home.",'Речь о коте: он не дома.'],
 ['We are not busy.',"We aren't busy.",'Мы не заняты.'],
 ['They are not tired.',"They aren't tired.",'Они не устали.']
];
export function contractionCards(day){return day===1?shortForms.map(x=>({front:x.full,back:x.short,meaning:x.meaning,example:x.example})):phrases.map(([full,short,meaning])=>({front:day===3?short:full,back:day===3?full:short,meaning,example:day===3?'Смысл тот же. Мы раскрыли сокращение.':'Смысл тот же. Мы записали фразу короче.'}));}
export const newRecall=day=>({started:false,queue:contractionCards(day).map((_,i)=>i),known:[]});
export function recallAnswer(session,remembered){const next={started:true,queue:[...session.queue],known:[...session.known]};const current=next.queue.shift();if(current===undefined)return next;if(remembered)next.known.push(current);else next.queue.push(current);return next;}
export function restoreRecall(day,s){const count=contractionCards(day).length;if(!s||!Array.isArray(s.queue)||!Array.isArray(s.known))return newRecall(day);const all=[...s.queue,...s.known];if(all.length!==count||new Set(all).size!==count||all.some(n=>!Number.isInteger(n)||n<0||n>=count))return newRecall(day);return {started:!!s.started,queue:[...s.queue],known:[...s.known]};}
const text=(prompt,answers,instruction,example,explanation,action='Напиши сокращённую форму',format='Полное предложение с сокращением.')=>({type:'text',prompt,answers,match:'exact',topic:'Сокращённые формы',action,instruction,example,explanation,format});
export const contractionQuestions={
 1:[
  {type:'choice',prompt:'Как сократить I am not?',answers:["I'm not"],options:["I'm not","I amn't",'I not'],match:'exact',topic:'Сокращённые формы',action:'Выбери сокращение',instruction:'Выбери короткую запись I am not. Смысл должен остаться «я не».',format:'Один вариант.',example:'I am not busy. → I’m not busy. Сокращаем I am. Слово not остаётся.',explanation:'I am превращается в I’m, а not остаётся отдельно: I’m not. В этих заданиях не пишем I amn’t.'},
  text('is not',["isn't"],'Сократи is not. Впиши одно слово с апострофом.','are not → aren’t. Апостроф — маленький знак между n и t.',"Is not → isn't. Апостроф заменяет букву o в not.",'Сократи два слова','Одно сокращение с апострофом.'),
  text('are not',["aren't"],'Сократи are not. Впиши одно слово с апострофом.','is not → isn’t.','Are not → aren’t. Это подходит для you, we, they.','Сократи два слова','Одно сокращение с апострофом.'),
  text('I am not ready.',["I'm not ready."],'Перепиши фразу короче. Сократи I am, а not оставь отдельным словом.','I am not tired. → I’m not tired.','I am not ready. → I’m not ready. Смысл: «Я не готова».')
 ],
 2:[
  text('He is not tired.',["He isn't tired.","He's not tired."],'Перепиши предложение с сокращением. Вспомни: is not → isn’t.','She is not busy. → She isn’t busy.','He is not tired. → He isn’t tired. Вариант He’s not tired тоже верный.'),
  text('They are not at home.',["They aren't at home.","They're not at home."],'Перепиши предложение с сокращением. Вспомни: are not → aren’t.','We are not ready. → We aren’t ready.','They are not at home. → They aren’t at home. Вариант They’re not at home тоже верный.'),
  {type:'order',prompt:'Ты не занята.',tokens:['busy.',"aren't",'You'],answers:["You aren't busy."],match:'exact',topic:'Сокращённые формы',action:'Собери фразу с сокращением',instruction:'Нажми на все слова в нужном порядке. Aren’t уже означает are not. Ещё одно not добавлять не нужно.',format:'Нажми на все слова по порядку.',example:'Слова: tired. / isn’t / He. Получится He isn’t tired.',explanation:'You aren’t busy. — Ты не занята. Aren’t = are not.'},
  text("She isn't ready.",['She is not ready.'],'Раскрой isn’t в is not. Напиши предложение целиком без сокращений.','He isn’t busy. → He is not busy.','She isn’t ready. → She is not ready. Смысл не изменился.','Раскрой сокращение','Полное предложение без сокращений.')
 ],
 3:[
  text("I amn't tired.",["I'm not tired."],'Исправь короткую форму. Перепиши фразу целиком. С I сокращаем I am, а not оставляем отдельно.','I am not busy. → I’m not busy.','Правильно: I’m not tired. Сокращение I am — это I’m.','Исправь сокращение'),
  text("We aren't at home.",['We are not at home.'],'Напиши ту же фразу без сокращения. Раскрой aren’t в are not.','They aren’t ready. → They are not ready.','We aren’t at home. → We are not at home.','Раскрой сокращение','Полное предложение без сокращений.'),
  text('Она не занята.',["She isn't busy.","She's not busy."],'Переведи фразу и используй сокращение. Напиши предложение целиком.','Он не готов. → He isn’t ready.','She isn’t busy. — Она не занята. Вариант She’s not busy тоже верный.','Переведи с сокращением'),
  text('Речь о коте: он не дома.',["It isn't at home.","It's not at home."],'Используй it и сокращённую форму. Напиши предложение целиком.','Он не устал. → He isn’t tired.','It isn’t at home. — Он не дома (о коте). Вариант It’s not at home тоже верный.','Переведи с сокращением')
 ]
};
