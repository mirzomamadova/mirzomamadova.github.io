import {exerciseModes} from './exercises.js?v=20261029-report-errors';
export const words=[
 {id:'what',en:'What',ru:'что; какой',context:'Обычно без заданных вариантов.',example:'What is it?',exampleRu:'Что это? It — знакомое местоимение.'},
 {id:'who',en:'Who',ru:'кто',context:'Спрашиваем о человеке.',example:'Who is she?',exampleRu:'Кто она?'},
 {id:'where',en:'Where',ru:'где',context:'Спрашиваем о месте. Не путай с When — когда.',example:'Where are you?',exampleRu:'Где ты?'},
 {id:'when',en:'When',ru:'когда',context:'Спрашиваем о времени. Не путай с Where — где.',example:'When is the lesson?',exampleRu:'Когда урок? The lesson — урок: здесь это только пример с переводом.'},
 {id:'why',en:'Why',ru:'почему',context:'Спрашиваем о причине. Объяснение причины будем учить отдельно.',example:'Why are you tired?',exampleRu:'Почему ты устала?'},
 {id:'how',en:'How',ru:'как',context:'В знакомом вопросе узнаём о самочувствии.',example:'How are you?',exampleRu:'Как дела?'},
 {id:'which',en:'Which',ru:'какой / который из вариантов',context:'Выбираем из понятных собеседникам вариантов.',example:'Which one?',exampleRu:'Какой именно? / Который из них?'}
];
export const phrases=[
 {id:'how-are-you',en:'How are you?',ru:'Как дела? / Как ты?',context:'Начинаешь разговор и спрашиваешь о самочувствии.',reply:'I am okay.',replyRu:'У меня всё в порядке.',note:'Можно ответить о себе: I am happy. / I am tired. Полная и изученная сокращённая формы подходят.'},
 {id:'where-are-you',en:'Where are you?',ru:'Где ты?',context:'Хочешь узнать, где собеседник.',reply:'I am at home.',replyRu:'Я дома.',note:'Where спрашивает о месте. В ответе о себе you меняется на I, are — на am.'},
 {id:'where-is-she',en:'Where is she?',ru:'Где она?',context:'Спрашиваешь, где находится женщина. В примере она дома.',reply:'She is at home.',replyRu:'Она дома.',note:'Вопрос о ней — she. В ответе тоже she. С she нужна форма is.'},
 {id:'what-about-you',en:'What about you?',ru:'А ты? / А у тебя?',context:'Ты уже рассказала о себе и возвращаешь тот же вопрос собеседнику.',reply:'I am tired.',replyRu:'Я устала.',note:'Готовая разговорная реплика. Учим целиком; am, is и are в неё не добавляем.'},
 {id:'which-one',en:'Which one?',ru:'Какой именно? / Который из них?',context:'Перед вами две чашки. Уточняешь, какую выбирает собеседник.',reply:'This one.',replyRu:'Вот эту. Покажи на выбранную чашку.',note:'Which one? — This one. Учим как готовую пару с указанием на предмет. Отдельную тему this сейчас не изучаем.',art:'cups'}
];
export const tasks=Object.entries(exerciseModes).map(([id,t],i)=>({id,n:i+1,...t}));
export function normalizeAnswer(value){return String(value).normalize('NFKC').replace(/[’‘`]/g,"'").trim().toLowerCase().replace(/[.!?,]+$/g,'').replace(/\s+/g,' ').trim();}
export function gradeAnswer(task,value){const answer=normalizeAnswer(value);return answer.length>0&&task.answers.some(x=>normalizeAnswer(x)===answer);}
export const instructions={word:{title:'Вспомни слово',text:'Напиши одно вопросительное слово.',example:'где → Where',placeholder:'Одно английское слово'},phrase:{title:'Вспомни вопрос',text:'Напиши вопрос по-английски.',example:'Где ты? → Where are you?',placeholder:'Твоя реплика по-английски'},situation:{title:'Ответь по смыслу',text:'Напиши ответ по условию.',example:'По условию ты устала. → I am tired.',placeholder:'Твой ответ по-английски'}};
export const days=[
 {id:'tuesday',title:'Вторник',date:'27 октября',iso:'2026-10-27',focus:'Слова и устройство спецвопроса',range:'1–7',taskMinutes:7,taskIds:tasks.slice(0,7).map(t=>t.id),steps:[
 {minutes:5,title:'Послушай, скажи и напиши 7 слов',text:'Повтори за записью. Скрой образец, скажи слово по русскому значению и напиши по памяти.'},
 {minutes:2,title:'Разберись, как устроен вопрос',text:'Посмотри превращение You are at home. → Are you at home? → Where are you?'},
 {minutes:7,title:'От смысла — к своему вопросу',text:'Выбери слово, запиши услышанное, собери вопрос и напиши свой. Ответь именно на то, о чём спросили.'},
 {minutes:1,title:'Скажи без текста',text:'Задай два вопроса по ситуации. Затем открой образец и сравни произношение.'}]},
 {id:'wednesday',title:'Среда',date:'28 октября',iso:'2026-10-28',focus:'Вопросы и ответы без подсказки',range:'8–15',taskMinutes:7,taskIds:tasks.slice(7).map(t=>t.id),steps:[
 {minutes:2,title:'Вспомни 7 слов без образца',text:'Сначала произнеси по русскому значению, затем открой слово и послушай.'},
 {minutes:5,title:'Послушай и выучи 5 пар реплик',text:'Послушай вопрос и ответ. Повтори. Скрой образец, сначала скажи, затем напиши обе реплики.'},
 {minutes:7,title:'Спроси и ответь самостоятельно',text:'Запиши вопрос на слух, ответь по смыслу и составь вопросы без готовых слов.'},
 {minutes:1,title:'Два коротких разговора вслух',text:'Ответь о себе и спроси в ответ. Затем потренируй готовую пару выбора предмета.'}]}
];
export const lessonDay={title:'Четверг',date:'29 октября',iso:'2026-10-29'};
