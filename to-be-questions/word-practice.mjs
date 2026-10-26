const base={topic:'Слова clear и right',explanation:'Clear — понятно / понятный. Right — права / прав (о верном ответе или мнении).'};
const pick=(prompt,answer,options,example='Ready — «готова / готов».')=>({...base,type:'choice',action:'Выбери значение',instruction:'Прочитай слово или выражение. Нажми на подходящий ответ, затем на «Проверить».',format:'Один выбранный ответ.',example,prompt,answers:[answer],options});
const write=(prompt,answer)=>({...base,type:'text',action:'Напиши слово по памяти',instruction:'Прочитай русский смысл. Вспомни английское слово и напиши его в поле. Затем нажми «Проверить».',format:'Одно английское слово.',example:'Готова / готов → ready.',prompt,answers:[answer]});
const gap=(prompt,ru,answer)=>({...base,type:'text',action:'Вставь знакомое слово',instruction:'Прочитай предложение и его перевод. Напиши только пропущенное слово. Всё предложение переписывать не нужно.',format:'Одно пропущенное слово.',example:'She is ___. Она занята. → busy.',prompt,ru,answers:[answer]});
const letters=(prompt,answer,tokens)=>({...base,type:'letters',action:'Собери слово из букв',instruction:'Нажимай на буквы по порядку. Используй все буквы. Если ошиблась, нажми «Убрать последнее». Затем проверь слово.',format:'Одно слово, собранное из всех букв.',example:'r → e → a → d → y: ready — готова / готов.',prompt,answers:[answer],tokens});
export const wordLessons=[
 {part:1,title:'Выучить clear и right',questions:[
  pick('clear','понятно',['готова','понятно','права']),
  pick('right','права / прав',['устала','дома','права / прав']),
  pick('Понятно (про объяснение)','clear',['right','clear','ready'],'Готова / готов → ready.'),
  pick('Права / прав (про ответ)','right',['ready','right','clear'],'Занята / занят → busy.'),
  letters('Понятно','clear',['r','c','a','l','e']),
  letters('Права / прав','right',['t','i','r','h','g']),
  write('Понятно (про объяснение)','clear'),
  write('Права / прав (про ответ или мнение)','right')
 ]},
 {part:2,title:'Вспомнить и применить',questions:[
  write('Понятно (про объяснение)','clear'),write('Права / прав','right'),
  gap('It is ___.','Это понятно.','clear'),gap('He is ___.','Он прав.','right'),
  pick('It is clear.','Это понятно.',['Это понятно.','Он прав.','Я устала.'],'She is busy. — Она занята.'),
  pick('I am right.','Я права.',['Я готова.','Я права.','Это понятно.'],'I am ready. — Я готова.')
 ]},
 {part:3,title:'Вспомнить в новой ситуации',questions:[
  pick('Объяснение понятно. Какое слово подходит?','clear',['right','busy','clear'],'Человек занят — busy.'),
  pick('Собеседник прав. Какое слово подходит?','right',['clear','ready','right'],'Человек готов — ready.'),
  gap('It is ___.','Это понятно.','clear'),gap('She is ___.','Она права.','right'),
  write('Понятно. Напиши английское слово.','clear'),write('Права / прав. Напиши английское слово.','right')
 ]}
].map(p=>({...p,questions:p.questions.map((q,i)=>({...q,id:`w${p.part}q${i+1}`}))}));

// Separate learning practice. Daily work retains its own questions and results.
export const learningQuestions=wordLessons[0].questions.map((q,i)=>({...q,id:`learnq${i+1}`}));
