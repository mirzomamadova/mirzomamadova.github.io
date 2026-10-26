import {exerciseModes,builtAnswer} from './exercises.js';
import {words,phrases,tasks,days,gradeAnswer} from './content.js';
import {restoreMemory} from './memory.js';

const taskMap=Object.fromEntries(tasks.map(t=>[t.id,t]));
export function makeState(){return {version:2,tab:'homework',memory:restoreMemory(null),decks:{words:{index:0,mode:'en',known:[]},phrases:{index:0,mode:'en',known:[]}},quiz:{day:'tuesday',started:false,queue:[...days[0].taskIds],pos:0,answers:{},result:false}};}
export function summarizeDay(answers,dayId){const day=days.find(d=>d.id===dayId)||days[0];const rows=day.taskIds.map(id=>taskMap[id]);const done=rows.filter(t=>answers[t.id]?.correct);return {day,total:rows.length,done:done.length,first:done.filter(t=>answers[t.id]?.firstTry===true).length,repeat:rows.filter(t=>answers[t.id]?.firstTry===false),complete:done.length===rows.length};}
export function restoreState(raw){
  const blank=makeState();
  if(!raw||![1,2].includes(raw.version))return blank;
  blank.memory=restoreMemory(raw.memory);
  if(raw.version===2&&['words','phrases','homework'].includes(raw.tab))blank.tab=raw.tab;
  for(const [kind,list] of Object.entries({words,phrases})){
    const d=raw.decks?.[kind];if(!d)continue;
    blank.decks[kind].index=Math.max(0,Math.min(list.length-1,Math.floor(Number(d.index)||0)));
    blank.decks[kind].mode=d.mode==='ru'?'ru':'en';
    blank.decks[kind].known=Array.isArray(d.known)?list.filter(x=>d.known.includes(x.id)).map(x=>x.id):[];
  }
  if(!raw.quiz)return blank;
  const q=blank.quiz;
  for(const task of tasks){
    const a=raw.quiz.answers?.[task.id];if(!a)continue;
    const draft=typeof a.draft==='string'?a.draft.slice(0,120):'';
    const cup=[0,1].includes(a.cup)?a.cup:null;
    const correct=!!a.correct&&gradeAnswer(task,draft)&&(!task.requiresChoice||cup!==null);
    const mode=exerciseModes[task.id],tokens=Array.isArray(a.tokens)&&mode?.tokens?[...new Set(a.tokens.filter(i=>Number.isInteger(i)&&i>=0&&i<mode.tokens.length))]:[];
    q.answers[task.id]={draft:mode?.tokens?builtAnswer(task,tokens):draft,tokens,cup,correct:correct&&(!mode?.tokens||gradeAnswer(task,builtAnswer(task,tokens))),attempts:Math.max(0,Number(a.attempts)||0),help:!!a.help,revealed:!!a.revealed,firstTry:typeof a.firstTry==='boolean'?a.firstTry:null,feedback:correct?'correct':''};
  }
  const currentId=Array.isArray(raw.quiz.queue)?raw.quiz.queue[Number(raw.quiz.pos)||0]:null;
  const day=days.find(d=>d.id===raw.quiz.day)||days.find(d=>d.taskIds.includes(currentId))||days[0];
  q.day=day.id;
  const ids=Array.isArray(raw.quiz.queue)?[...new Set(raw.quiz.queue.filter(id=>day.taskIds.includes(id)))]:[];
  q.queue=ids.length?ids:[...day.taskIds];
  q.pos=Math.max(0,q.queue.indexOf(currentId));
  q.started=raw.version===2&&!!raw.quiz.started;
  q.result=q.started&&!!raw.quiz.result&&summarizeDay(q.answers,q.day).complete;
  return blank;
}
