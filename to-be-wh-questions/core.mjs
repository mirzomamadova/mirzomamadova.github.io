import data from './data.mjs';
export {data};
export const STORAGE_KEY='nigor-wh-homework-v1';
export const questions=[...data.days.flatMap(d=>[...d.words,...d.questions]),...data.learn];
export const byId=id=>questions.find(q=>q.id===id);
export const dayById=id=>data.days.find(d=>d.id===id);
export const normalize=s=>String(s??'').normalize('NFKC').toLowerCase().replace(/[’‘`]/g,"'").replace(/[.,!?]/g,' ').replace(/\s+/g,' ').trim();
export const judge=(q,value)=>q.answers.some(a=>normalize(a)===normalize(value));
export const freshItem=()=>({value:'',tokens:[],first:null,firstValue:null,tries:0,done:false,correct:false,helped:false,revealed:false});
export const fresh=()=>({version:1,view:'home',day:1,active:null,report:null,drafts:{},runs:[],flash:0,model:0});
export function newDraft(day,kind,ids=null,source=null){
 const qs=ids|| (kind==='learn'?data.learn:dayById(day)[kind]).map(q=>q.id);
 return {day,kind,ids:qs,index:0,items:Object.fromEntries(qs.map(id=>[id,freshItem()])),source,wordReport:null};
}
export function checkItem(q,s){
 if(s.done)return {valid:false,message:'Задание уже завершено.'};
 if(!s.value.trim()||(['letters','order'].includes(q.type)&&s.tokens.length!==q.tokens.length))return {valid:false,message:q.type==='letters'?'Используй все буквы и собери слово.':q.type==='order'?'Используй все карточки и собери вопрос.':'Сначала дай свой ответ.'};
 const ok=judge(q,s.value);
 if(s.first===null){s.first=ok&&!s.helped;s.firstValue=s.value;}
 s.tries++;s.correct=ok;s.done=ok;
 let hint=q.word?'Вспомни значение слова. Если трудно, открой «Разобрать ответ». Потом слово можно повторить.':q.type==='choice'?'Прочитай русский смысл и пример сверху. Выбери другой ответ.':'Проверь: вопросительное слово, затем am / is / are, затем тот, о ком спрашиваем. I — am; he / she / it — is; you / we / they — are.';
 return {valid:true,correct:ok,message:ok?'Верно. '+q.explanation:'Пока неверно. '+hint};
}
export function reveal(s){if(s.first===null)s.first=false;s.helped=true;s.revealed=true;s.done=true;}
export const score=r=>({correct:r.details.filter(x=>x.first).length,total:r.details.length});
export function finish(d,runs=[]){
 if(!d.ids.every(id=>d.items[id]?.done))throw new Error('Есть незавершённые задания');
 return {id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`,day:d.day,kind:d.kind,source:d.source,wordReport:d.wordReport,attempt:runs.filter(r=>r.day===d.day&&r.kind===d.kind).length+1,finished:new Date().toISOString(),details:d.ids.map(id=>{const q=byId(id),s=d.items[id];return {id,prompt:q.prompt,first:s.first===true&&!s.helped,firstValue:s.firstValue,finalValue:s.value,expected:q.answers[0],helped:s.helped};})};
}
export function reportText(r,runs=[]){
 const sc=score(r),w=r.wordReport&&runs.find(x=>x.id===r.wordReport);
 return ['WH-вопросы с to be',r.kind==='learn'?'Отдельное заучивание':`${dayById(r.day)?.name||''} · ${r.kind==='words'?'слова':r.kind==='questions'?'вопросы':'повторение ошибок'}`,`Попытка ${r.attempt}`,`Верно с первой проверки: ${sc.correct}/${sc.total}. Примеры были видны.`,...(w?[`Слова этого дня: ${score(w).correct}/${score(w).total} с первой проверки.`]:[]),...r.details.filter(x=>!x.first).map(x=>`Повторить: ${x.prompt}\nПервый ответ: ${x.firstValue??'открыт разбор'}\nПравильно: ${x.expected}`)].join('\n');
}
export function loadState(raw){
 try{
  const s=JSON.parse(raw);if(s?.version!==1)return fresh();const n=fresh();
  n.day=dayById(s.day)?s.day:1;n.flash=Number.isInteger(s.flash)&&s.flash>=0&&s.flash<6?s.flash:0;n.model=Number.isInteger(s.model)&&s.model>=0&&s.model<6?s.model:0;
  n.runs=Array.isArray(s.runs)?s.runs.filter(r=>r&&typeof r.id==='string'&&['words','questions','learn','review'].includes(r.kind)&&Array.isArray(r.details)&&r.details.length&&r.details.every(x=>byId(x.id)&&typeof x.expected==='string')):[];
  for(const [key,d] of Object.entries(s.drafts||{})){
   if(!d||!['words','questions','learn','review'].includes(d.kind)||!Array.isArray(d.ids)||!d.ids.length||new Set(d.ids).size!==d.ids.length||!d.ids.every(id=>byId(id))||!(dayById(d.day)||d.kind==='learn'||d.day===0&&d.kind==='review'))continue;
   const cp=newDraft(d.day,d.kind,d.ids,d.source);cp.wordReport=n.runs.some(r=>r.id===d.wordReport)?d.wordReport:null;cp.index=Math.max(0,Math.min(d.ids.length-1,Number.isInteger(d.index)?d.index:0));
   for(const id of d.ids){const q=byId(id),a=d.items?.[id];if(!a)continue;const t=freshItem();t.value=String(a.value||'').slice(0,240);t.tokens=Array.isArray(a.tokens)?[...new Set(a.tokens)].filter(i=>Number.isInteger(i)&&i>=0&&i<(q.tokens?.length||0)):[];if(['order','letters'].includes(q.type))t.value=t.tokens.map(i=>q.tokens[i]).join(q.type==='letters'?'':' ');t.first=[null,false,true].includes(a.first)?a.first:null;t.firstValue=typeof a.firstValue==='string'?a.firstValue:null;t.tries=Math.max(0,Number(a.tries)||0);t.helped=a.helped===true;t.revealed=a.revealed===true;t.correct=judge(q,t.value);t.done=t.revealed||(t.correct&&t.first!==null);cp.items[id]=t;}
   n.drafts[key]=cp;
  }
  n.active=n.drafts[s.active]?s.active:null;n.report=n.runs.some(r=>r.id===s.report)?s.report:null;
  n.view=['home','intro','words','cards','theory','quiz','result'].includes(s.view)?s.view:'home';if(n.view==='quiz'&&!n.active||n.view==='result'&&!n.report)n.view='home';return n;
 }catch{return fresh();}
}
