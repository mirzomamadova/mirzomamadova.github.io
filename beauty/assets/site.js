document.body.classList.add('js');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(menu&&nav){
  menu.hidden=false;
  const closeMenu=()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
}
const filters=document.querySelector('.filters');
if(filters){
  filters.hidden=false;
  const cards=Array.from(document.querySelectorAll('.gallery-item'));
  const count=document.querySelector('#gallery-count');
  filters.addEventListener('click',e=>{
    const button=e.target.closest('[data-filter]');if(!button)return;
    const selected=button.dataset.filter;
    filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let visible=0;
    cards.forEach(card=>{const show=selected==='all'||card.dataset.category===selected||card.dataset.type===selected;card.hidden=!show;if(show)visible++;else card.querySelector('video')?.pause();});
    count.textContent=`Показано: ${visible}`;
  });
  document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();})));
}
const dialog=document.querySelector('.lightbox');
const source=document.querySelector('#photos-data');
if(dialog&&source&&typeof dialog.showModal==='function'){
  const works=JSON.parse(source.textContent);
  let current=0,work=works[0];
  const display=index=>{current=(index+work.photos.length)%work.photos.length;const photo=work.photos[current];const img=document.querySelector('#photo-full');img.src=photo.src+'?v=2';img.alt=work.title+' — фото '+(current+1);document.querySelector('#photo-title').textContent=work.title;document.querySelector('#photo-counter').textContent=`Фото ${current+1} / ${work.photos.length}`;document.querySelector('#photo-prev').hidden=work.photos.length<2;document.querySelector('#photo-next').hidden=work.photos.length<2;};
  document.querySelectorAll('[data-work]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();work=works[Number(link.dataset.work)];display(Number(link.dataset.photo));dialog.showModal();document.body.style.overflow='hidden';}));
  document.querySelector('#photo-close').addEventListener('click',()=>dialog.close());
  document.querySelector('#photo-prev').addEventListener('click',()=>display(current-1));
  document.querySelector('#photo-next').addEventListener('click',()=>display(current+1));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();display(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();display(current-1);}});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';});
}
