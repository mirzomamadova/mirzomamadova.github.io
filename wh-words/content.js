import {exerciseModes} from './exercises.js';
export const words = [
  {id:'what',en:'What',ru:'что; какой',context:'Обычно спрашиваем без заданных вариантов.',example:'What is it?',exampleRu:'Что это?'},
  {id:'who',en:'Who',ru:'кто',context:'Спрашиваем о человеке.',example:'Who is she?',exampleRu:'Кто она?'},
  {id:'where',en:'Where',ru:'где',context:'Спрашиваем о месте.',example:'Where are you?',exampleRu:'Где ты?'},
  {id:'when',en:'When',ru:'когда',context:'Спрашиваем о времени.',example:'When is the lesson?',exampleRu:'Когда урок? The lesson — урок, о котором говорим.'},
  {id:'why',en:'Why',ru:'почему',context:'Спрашиваем о причине.',example:'Why are you tired?',exampleRu:'Почему ты устала?'},
  {id:'how',en:'How',ru:'как',context:'В знакомом вопросе узнаём о самочувствии.',example:'How are you?',exampleRu:'Как дела?'},
  {id:'which',en:'Which',ru:'какой / который из вариантов',context:'Выбираем из понятных собеседникам вариантов.',example:'Which one?',exampleRu:'Какой именно? / Который из них?'}
];
export const phrases = [
  {id:'how-are-you',en:'How are you?',ru:'Как дела? / Как ты?',context:'Начинаешь разговор и спрашиваешь о самочувствии.',reply:"I'm okay.",replyRu:'У меня всё в порядке.',note:'Можно ответить правдиво: I am happy. / I am tired. Полная и сокращённая формы подходят.'},
  {id:'what-about-you',en:'What about you?',ru:'А ты? / А у тебя?',context:'Ты уже рассказала о себе и возвращаешь тот же вопрос собеседнику.',reply:"I'm tired.",replyRu:'Я устала.',note:"Сначала: I'm okay. Затем: What about you? Учим эту реплику целиком."},
  {id:'whats-this',en:"What's this?",ru:'Что это?',context:'Показываешь на предмет рядом и хочешь узнать, что это.',reply:"It's tea.",replyRu:'Это чай.',note:"What's this? = What is this? It's tea. = It is tea.",art:'tea'},
  {id:'which-one',en:'Which one?',ru:'Какой именно? / Который из них?',context:'Перед вами две чашки. Уточняешь, какую выбирает собеседник.',reply:'This one.',replyRu:'Вот эту. Покажи на выбранную чашку.',note:'Which cup? → Which one? Cup — чашка. One заменяет название одного предмета. Is / are здесь не нужны.',art:'cups'},
  {id:'where-are-you',en:'Where are you?',ru:'Где ты?',context:'Хочешь узнать, где находится собеседник.',reply:"I'm at home.",replyRu:'Я дома.',note:'Where + are + you? В ответе о себе: I am at home. / I’m at home.'}
];
export const tasks = [
  {id:'hw1',n:1,kind:'word',prompt:'когда',answers:['When'],hint:'Спрашиваем о времени. Слово начинается с W.'},
  {id:'hw2',n:2,kind:'word',prompt:'кто',answers:['Who'],hint:'Нужно вопросительное слово о человеке.'},
  {id:'hw3',n:3,kind:'word',prompt:'какой / который из вариантов',answers:['Which'],hint:'Есть конкретные варианты. Нужно слово для выбора.'},
  {id:'hw4',n:4,kind:'word',prompt:'что; какой',answers:['What'],hint:'Обычно спрашиваем открыто, без заданных вариантов.'},
  {id:'hw5',n:5,kind:'word',prompt:'почему',answers:['Why'],hint:'Нужно вопросительное слово о причине.'},
  {id:'hw6',n:6,kind:'word',prompt:'где',answers:['Where'],hint:'Спрашиваем о месте.'},
  {id:'hw7',n:7,kind:'word',prompt:'как',answers:['How'],hint:'Это слово начинает знакомый вопрос «Как дела?».'},
  {id:'hw8',n:8,kind:'phrase',prompt:'Какой именно? Выбираем из двух предметов.',answers:['Which one?'],hint:'Вспомни вопрос целиком: слово для выбора + one. Is / are не нужны.',art:'cups'},
  {id:'hw9',n:9,kind:'phrase',prompt:'Вот этот / эта / это. Показываем выбранный предмет.',answers:['This one.'],hint:'Ответ состоит из двух слов. Второе — one.',art:'cups'},
  {id:'hw10',n:10,kind:'phrase',prompt:'А ты? Возвращаем собеседнику вопрос о самочувствии.',answers:['What about you?','And you?'],hint:'Вспомни целую реплику из карточек. Она начинается с What.',preferred:'What about you?'},
  {id:'hw11',n:11,kind:'phrase',prompt:'Что это? Показываем на предмет рядом.',answers:["What's this?",'What is this?'],hint:'Нужно this — «это». Полная и сокращённая формы подходят.'},
  {id:'hw12',n:12,kind:'situation',prompt:'Тебя спросили: What is this? В чашке чай. Напиши ответ.',answers:["It's tea.",'It is tea.'],hint:'Не повторяй вопрос. Начни ответ с It is… или It’s…',art:'tea'},
  {id:'hw13',n:13,kind:'situation',prompt:'Ты сказала: I am tired. Спроси собеседника в ответ: «А ты?»',answers:['What about you?','And you?'],hint:'Возвращаем тот же вопрос собеседнику.',preferred:'What about you?'},
  {id:'hw14',n:14,kind:'situation',prompt:'Ты предложила чай. Перед вами две чашки. Уточни, какую выбирает собеседник.',answers:['Which one?'],hint:'Уточняем выбор, поэтому нужен вопрос с Which.',art:'cups'},
  {id:'hw15',n:15,kind:'situation',prompt:'Тебя спросили: Which one? Выбери чашку на картинке и напиши короткий ответ.',answers:['This one.'],hint:'Покажи выбранную чашку словами This one.',art:'cups',requiresChoice:true}
].map(t=>({...t,...(exerciseModes[t.id]?.answers?{answers:exerciseModes[t.id].answers}:{}),...(['hw9','hw13','hw14'].includes(t.id)?{art:null,preferred:null}:{}),...({hw9:{hint:'Ответ о себе: I am at home. — Я дома.'},hw13:{hint:'Вспомни вопрос о самочувствии: How are you?'},hw14:{hint:'Сначала Where, затем are, затем you.'}}[t.id]||{})}));
export function normalizeAnswer(value){
  return String(value).normalize('NFKC').replace(/[’‘`]/g,"'").trim().toLowerCase().replace(/[.!?,]+$/g,'').replace(/\s+/g,' ').trim();
}
export function gradeAnswer(task,value){
  const answer=normalizeAnswer(value);
  return answer.length>0&&task.answers.some(x=>normalizeAnswer(x)===answer);
}
export const instructions={
  word:{title:'Вспомни слово',text:'Напиши одно вопросительное слово по-английски.',example:'где → Where',placeholder:'Одно английское слово'},
  phrase:{title:'Вспомни целую реплику',text:'Напиши подходящий вопрос или ответ по-английски.',example:'Как дела? → How are you?',placeholder:'Твоя реплика по-английски'},
  situation:{title:'Что скажешь в этой ситуации?',text:'Напиши одну подходящую реплику. Условие переписывать не нужно.',example:'How are you? По условию ты счастлива. → I am happy.',placeholder:'Твой ответ по-английски'}
};

export const days=[
  {id:'tuesday',title:'Вторник',date:'27 октября',iso:'2026-10-27',focus:'Семь вопросительных слов',range:'1–7',taskMinutes:6,taskIds:tasks.slice(0,7).map(t=>t.id),steps:[
    {minutes:5,title:'Запомни 7 слов',text:'Открой тренировку. Прочитай образец, скрой его и напиши слово по памяти. Трудное повторится в конце.'},
    {minutes:3,title:'Вспомни без подсказки',text:'Включи «Вспоминаю». Скажи слово по-английски, затем открой ответ и проверь себя.'},
    {minutes:6,title:'Выполни задания 1–7',text:'Выбирай слово по смыслу, собирай буквы и вспоминай без подсказки.'},
    {minutes:1,title:'Закончи вслух',text:'Выбери два трудных слова. Закрой перевод, назови их по-английски и проверь себя.'}
  ]},
  {id:'wednesday',title:'Среда',date:'28 октября',iso:'2026-10-28',focus:'Полезные вопросы и ответы',range:'8–15',taskMinutes:7,taskIds:tasks.slice(7).map(t=>t.id),steps:[
    {minutes:2,title:'Вспомни слова вторника',text:'Открой слова в режиме «Вспоминаю». Скажи 7 слов вслух и проверь себя.'},
    {minutes:5,title:'Запомни 5 вопросов и ответов',text:'В тренировке прочитай короткий диалог, скрой образец и напиши обе реплики по памяти. Трудное повторится в конце.'},
    {minutes:7,title:'Выполни задания 8–15',text:'Собирай вопросы из слов, выбирай ответ и продолжай короткие разговоры.'},
    {minutes:1,title:'Разыграй мини-диалог',text:'Поставь рядом два предмета. Скажи Which one? Покажи на один и ответь This one. Повтори с другим выбором.'}
  ]}
];
export const lessonDay={title:'Четверг',date:'29 октября',iso:'2026-10-29'};
