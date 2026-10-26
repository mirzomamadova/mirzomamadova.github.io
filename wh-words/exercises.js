export const exerciseModes={
 hw1:{type:'letters',title:'Собери слово',text:'Нажимай на буквы по порядку. Затем нажми «Проверить».',example:'h → o → w: how — «как».',tokens:['e','w','n','h']},
 hw2:{type:'choice',title:'Выбери слово по смыслу',text:'Нажми на вопросительное слово, которое подходит. Затем проверь ответ.',example:'Спрашиваем о месте — where («где»).',prompt:'Кто?',ru:'Спрашиваем о человеке.',options:['Where','Who','Why']},
 hw3:{type:'choice',title:'What или Which?',text:'Посмотри на ситуацию и выбери слово для вопроса.',example:'What is it? — «Что это?» Мы хотим узнать, что перед нами.',prompt:'Которую из них?',ru:'Перед тобой две чашки. Уточняешь выбор.',options:['What','Which','Who'],art:'cups'},
 hw4:{type:'text',title:'Вспомни сама',text:'Напиши одно английское слово без подсказки.',example:'кто → Who'},
 hw5:{type:'letters',title:'Собери слово по памяти',text:'Нажимай на буквы в нужном порядке. Лишних букв нет.',example:'h → o → w: how — «как».',tokens:['y','w','h']},
 hw6:{type:'gap',title:'Верни слово в вопрос',text:'Напиши только пропущенное слово.',example:'___ is she? Кто она? → Who',prompt:'___ are you?',ru:'Где ты?'},
 hw7:{type:'choice',title:'Начни знакомый вопрос',text:'Выбери одно слово для пропуска.',example:'___ is she? Кто она? → Who',prompt:'___ are you?',ru:'Как дела?',options:['When','How','Where']},
 hw8:{type:'order',prompt:'Какой именно?',ru:'Перед тобой два предмета. Уточни выбор.',title:'Собери вопрос',text:'Нажимай на слова по порядку. Используй оба слова, затем проверь.',example:'How → are → you? Получается: How are you?',tokens:['one?','Which']},
 hw9:{type:'choice',title:'Ответь в разговоре',text:'Прочитай вопрос и выбери ответ по ситуации.',example:'How are you? — I am okay.',prompt:'Where are you?',ru:'Тебя спрашивают, где ты. По условию ты дома.',options:['I am at home.','It is tea.','This one.'],answers:['I am at home.',"I'm at home."]},
 hw10:{type:'order',prompt:'А ты?',title:'Продолжи разговор',text:'Ты уже сказала, как у тебя дела. Собери реплику «А ты?» из всех слов.',example:'How → are → you? → How are you?',tokens:['you?','What','about']},
 hw11:{type:'order',prompt:'Что это?',title:'Спроси о предмете',text:'Собери вопрос из всех слов. Здесь используем полную форму.',example:'Where → are → you? → Where are you?',tokens:['this?','What','is'],answers:['What is this?',"What's this?"]},
 hw12:{type:'text',prompt:'What is this?',ru:'В чашке чай. Ответь по-английски.',title:'Напиши ответ сама',text:'Прочитай вопрос. По картинке и условию напиши ответ по-английски.',example:'Where are you? По условию ты дома. → I am at home.'},
 hw13:{type:'choice',title:'Что скажешь первой?',text:'Выбери подходящий вопрос для этой ситуации.',example:'Хочешь узнать, где собеседник. → Where are you?',prompt:'Как дела?',ru:'Начинаешь разговор и спрашиваешь о самочувствии.',options:['How are you?','Which one?','What is this?'],answers:['How are you?']},
 hw14:{type:'order',title:'Спроси, где собеседник',text:'Нажимай на слова по порядку, чтобы получить «Где ты?»',example:'How → are → you? → How are you?',prompt:'Где ты?',tokens:['you?','Where','are'],answers:['Where are you?']},
 hw15:{type:'text',prompt:'Which one?',ru:'Тебя спрашивают, какую чашку ты выбираешь.',title:'Выбери и ответь',text:'Нажми на любую чашку. Напиши короткую реплику «Вот эту».',example:'What is this? В чашке чай. → It is tea.'}
};
export function taskDisplay(task){return {...task,...(exerciseModes[task.id]||{})};}
export function builtAnswer(task,indexes){const mode=exerciseModes[task.id];return indexes.map(i=>mode.tokens[i]).join(mode.type==='letters'?'':' ');}
