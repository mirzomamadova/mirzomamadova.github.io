import {words,phrases,normalizeAnswer} from './content.js';

export const memoryDecks={words,phrases};
const alternatives={
  'how-are-you':{question:['How are you?'],reply:["I'm okay.",'I am okay.']},
  'what-about-you':{question:['What about you?','And you?'],reply:["I'm tired.",'I am tired.']},
  'whats-this':{question:["What's this?",'What is this?'],reply:["It's tea.",'It is tea.']},
  'which-one':{question:['Which one?'],reply:['This one.']},
  'where-are-you':{question:['Where are you?'],reply:["I'm at home.",'I am at home.']}
};
export function makeMemory(kind){return {active:false,queue:memoryDecks[kind].map(x=>({id:x.id,repeat:false})),pos:0,phase:'study',question:'',reply:'',first:{},last:{},checked:null,error:''};}
export function checkMemory(kind,id,question,reply=''){
  const item=memoryDecks[kind].find(x=>x.id===id);
  if(!item)return {question:false,reply:false,correct:false};
  const accepted=kind==='words'?{question:[item.en],reply:[]}:alternatives[id];
  const q=accepted.question.some(x=>normalizeAnswer(x)===normalizeAnswer(question));
  const r=kind==='words'||accepted.reply.some(x=>normalizeAnswer(x)===normalizeAnswer(reply));
  return {question:q,reply:r,correct:q&&r};
}
export function recordMemory(m,kind,revealed=false){
  const current=m.queue[m.pos];
  if(!current)return;
  const checked=revealed?{question:false,reply:kind==='words',correct:false,revealed:true}:checkMemory(kind,current.id,m.question,m.reply);
  if(!(current.id in m.first))m.first[current.id]=checked.correct;
  m.last[current.id]=checked.correct;m.checked=checked;m.phase='checked';m.error='';
  if(!current.repeat&&!checked.correct)m.queue.push({id:current.id,repeat:true});
}
export function nextMemory(m){
  if(m.phase!=='checked')return;
  m.pos++;m.question='';m.reply='';m.checked=null;m.error='';
  m.phase=m.pos>=m.queue.length?'done':m.queue[m.pos].repeat?'recall':'study';
}
export function restoreMemory(raw){
  const restored={};
  for(const kind of ['words','phrases']){
    const m=makeMemory(kind),r=raw?.[kind],ids=memoryDecks[kind].map(x=>x.id);
    if(r&&typeof r==='object'){
      const base=ids.map(id=>({id,repeat:false}));
      const repeated=Array.isArray(r.queue)?[...new Set(r.queue.filter(x=>x?.repeat&&ids.includes(x.id)).map(x=>x.id))]:[];
      m.queue=[...base,...repeated.map(id=>({id,repeat:true}))];
      m.pos=Math.max(0,Math.min(m.queue.length,Math.floor(Number(r.pos)||0)));
      m.phase=m.pos===m.queue.length?'done':['study','recall','checked'].includes(r.phase)?r.phase:'study';
      m.active=!!r.active;m.question=typeof r.question==='string'?r.question.slice(0,120):'';m.reply=typeof r.reply==='string'?r.reply.slice(0,120):'';
      for(const id of ids){if(typeof r.first?.[id]==='boolean')m.first[id]=r.first[id];if(typeof r.last?.[id]==='boolean')m.last[id]=r.last[id];}
      if(m.phase==='checked')m.checked=r.checked?.revealed?{question:false,reply:kind==='words',correct:false,revealed:true}:checkMemory(kind,m.queue[m.pos].id,m.question,m.reply);
    }
    restored[kind]=m;
  }
  return restored;
}
