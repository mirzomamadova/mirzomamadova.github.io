import {words,phrases,normalizeAnswer} from './content.js?v=20261029-guided-tour';
export const memoryDecks={words,phrases};
const replies={
 'how-are-you':['I am okay.',"I'm okay."],
 'where-are-you':['I am at home.',"I'm at home."],
 'where-is-she':['She is at home.',"She's at home."],
 'what-about-you':['I am tired.',"I'm tired."],
 'which-one':['This one.']
};
export function makeMemory(kind){return {revision:2,active:false,queue:memoryDecks[kind].map(x=>({id:x.id,repeat:false})),pos:0,phase:'study',question:'',reply:'',first:{},last:{},checked:null,error:''};}
export function checkMemory(kind,id,question,reply=''){
 const item=memoryDecks[kind].find(x=>x.id===id);if(!item)return {question:false,reply:false,correct:false};
 const accepted=[item.en,...(id==='what-about-you'?['And you?']:[])];
 const q=accepted.some(x=>normalizeAnswer(x)===normalizeAnswer(question));
 const r=kind==='words'||replies[id].some(x=>normalizeAnswer(x)===normalizeAnswer(reply));
 return {question:q,reply:r,correct:q&&r};
}
export function recordMemory(m,kind,revealed=false){const current=m.queue[m.pos];if(!current)return;const checked=revealed?{question:false,reply:kind==='words',correct:false,revealed:true}:checkMemory(kind,current.id,m.question,m.reply);if(!(current.id in m.first))m.first[current.id]=checked.correct;m.last[current.id]=checked.correct;m.checked=checked;m.phase='checked';m.error='';if(!current.repeat&&!checked.correct)m.queue.push({id:current.id,repeat:true});}
export function nextMemory(m){if(m.phase!=='checked')return;m.pos++;m.question='';m.reply='';m.checked=null;m.error='';m.phase=m.pos>=m.queue.length?'done':m.queue[m.pos].repeat?'recall':'study';}
export function restoreMemory(raw){
 const restored={};for(const kind of ['words','phrases']){
  const m=makeMemory(kind),r=raw?.[kind],ids=memoryDecks[kind].map(x=>x.id);
  if(r&&typeof r==='object'){
   for(const id of ids){if(typeof r.first?.[id]==='boolean')m.first[id]=r.first[id];if(typeof r.last?.[id]==='boolean')m.last[id]=r.last[id];}
   if(kind==='phrases'&&r.revision!==2){restored[kind]=m;continue;}
   const repeated=Array.isArray(r.queue)?[...new Set(r.queue.filter(x=>x?.repeat&&ids.includes(x.id)).map(x=>x.id))]:[];
   m.queue=[...ids.map(id=>({id,repeat:false})),...repeated.map(id=>({id,repeat:true}))];
   m.pos=Math.max(0,Math.min(m.queue.length,Math.floor(Number(r.pos)||0)));
   m.phase=m.pos===m.queue.length?'done':['study','recall','checked'].includes(r.phase)?r.phase:'study';
   m.active=!!r.active;m.question=typeof r.question==='string'?r.question.slice(0,120):'';m.reply=typeof r.reply==='string'?r.reply.slice(0,120):'';
   if(m.phase==='checked')m.checked=r.checked?.revealed?{question:false,reply:kind==='words',correct:false,revealed:true}:checkMemory(kind,m.queue[m.pos].id,m.question,m.reply);
  }restored[kind]=m;
 }return restored;
}
