import {audioAssets} from './audio-map.js?v=20261027-audio-answers-final';
export function createAudioPlayer(media,notify,mark){
 let serial=0,active=null;
 const finish=()=>{if(active){mark(active,false);active=null;}};
 function stop(){serial++;media.pause();try{media.currentTime=0;}catch{}finish();}
 media.addEventListener('ended',()=>{if(!active)return;finish();notify('Теперь повтори сама.');});
 media.addEventListener('error',()=>{if(!active)return;finish();notify('Запись не загрузилась. Проверь интернет и нажми «Слушать» ещё раз.');});
 async function play(text,rate=1,button=null){
  if(active===button&&button){stop();notify('Запись остановлена.');return;}
  stop();const request=serial,path=audioAssets[text];
  if(!path){notify('Для этой реплики пока нет записи.');return;}
  active=button;media.src=path;media.playbackRate=rate;media.preservesPitch=true;
  if('webkitPreservesPitch' in media)media.webkitPreservesPitch=true;
  mark(button,true);notify('Загружаем запись…');
  try{await media.play();if(request===serial)notify(rate<1?'Слушай медленно, затем повтори в обычном темпе.':'Послушай и повтори вслух.');}
  catch(error){if(request!==serial)return;finish();notify('Не удалось включить запись. Нажми «Слушать» ещё раз; проверь звук и интернет.');}
 }
 return {play,stop};
}
