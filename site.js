const reviews=[
['Приехали заранее, все подготовили, отработали профессионально свой блок. Накормили ватой больше 150 детей )','Компания ETART · городской праздник в Ильиногорске'],
['Классные ребята! Первый раз видела, чтобы все дети были заинтересованы без исключения) рекомендую 👍🏼','Елизавета · отзыв на Авито']
];
const dots=document.querySelector('.dots');
const reviewButtons=reviews.map((_,i)=>{const button=document.createElement('button');button.textContent='●';button.setAttribute('aria-label','Отзыв '+(i+1));button.onclick=()=>show(i);dots.append(button);return button;});
function show(i){document.querySelector('blockquote').textContent='«'+reviews[i][0]+'»';document.querySelector('.author').textContent=reviews[i][1];reviewButtons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));}
show(0);
const menu=document.querySelector('#menu');
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));
const dialog=document.querySelector('#photo');
const photos=[...document.querySelectorAll('[data-photo]')];
const photoImage=dialog.querySelector('img');
const photoPrev=dialog.querySelector('[data-photo-prev]');
const photoNext=dialog.querySelector('[data-photo-next]');
let photoIndex=0;
function showPhoto(index){
  photoIndex=Math.max(0,Math.min(photos.length-1,index));
  const item=photos[photoIndex];
  photoImage.src=item.dataset.photo;
  photoImage.alt=item.querySelector('img').alt;
  if(photoPrev) photoPrev.disabled=photoIndex===0;
  if(photoNext) photoNext.disabled=photoIndex===photos.length-1;
}
photos.forEach((button,index)=>button.addEventListener('click',()=>{showPhoto(index);dialog.showModal();}));
(dialog.querySelector('[data-photo-close]')||dialog.querySelector('button')).onclick=()=>dialog.close();
if(photoPrev) photoPrev.onclick=()=>showPhoto(photoIndex-1);
if(photoNext) photoNext.onclick=()=>showPhoto(photoIndex+1);
dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
    event.preventDefault(); showPhoto(photoIndex+(event.key==='ArrowRight'?1:-1));
  }
});

const booking=document.querySelector('#formbox');
function openBooking(){
  booking.hidden=false;
}
document.querySelectorAll('a[href="#booking"]').forEach(link=>link.addEventListener('click',openBooking));
if(location.hash==='#booking') booking.hidden=false;

const track=document.querySelector('.gallery-track');
const slides=Array.from(track.querySelectorAll('.gallery-slide'));
const prev=document.querySelector('[data-gallery-prev]');
const next=document.querySelector('[data-gallery-next]');
const counter=document.querySelector('.gallery-count');
let activeSlide=0;
let requestedSlide=null;
let scrollTimer;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function slideOffset(index){
  return slides[index].offsetLeft-slides[0].offsetLeft;
}
function lastPosition(){
  return Math.max(0,track.scrollWidth-track.clientWidth);
}
function updateGallery(){
  activeSlide=slides.reduce((closest,_,i)=>Math.abs(slideOffset(i)-track.scrollLeft)<Math.abs(slideOffset(closest)-track.scrollLeft)?i:closest,0);
  const visibleEnd=slides.reduce((end,slide,i)=>slideOffset(i)+slide.offsetWidth<=track.scrollLeft+track.clientWidth+2 ? i+1 : end,activeSlide+1);
  counter.textContent=(visibleEnd>activeSlide+1 ? (activeSlide+1)+'–'+visibleEnd : activeSlide+1)+' из '+slides.length;
  prev.disabled=activeSlide===0;
  next.disabled=track.scrollLeft>=lastPosition()-2;
}
function moveGallery(delta){
  requestedSlide=Math.max(0,Math.min(slides.length-1,(requestedSlide??activeSlide)+delta));
  track.scrollTo({left:Math.min(slideOffset(requestedSlide),lastPosition()),behavior:reducedMotion.matches?'instant':'smooth'});
}
track.addEventListener('scroll',()=>{updateGallery();clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{requestedSlide=null;updateGallery();},130);},{passive:true});
track.addEventListener('pointerdown',()=>{requestedSlide=null;},{passive:true});
track.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();moveGallery(e.key==='ArrowLeft'?-1:1);}});
prev.onclick=()=>moveGallery(-1);
next.onclick=()=>moveGallery(1);
new ResizeObserver(()=>{track.scrollLeft=Math.min(slideOffset(activeSlide),lastPosition());updateGallery();}).observe(track);
updateGallery();

const caseSection=document.querySelector('#cases');
const cases=(window.mishatkinaCases||[]).filter(item=>item.title&&item.type&&item.location&&item.task&&item.format&&item.result);
if(caseSection&&cases.length){
  const grid=caseSection.querySelector('.case-grid');
  function add(parent,tag,value){
    const el=document.createElement(tag);
    if(value) el.textContent=value;
    parent.append(el);return el;
  }
  cases.forEach(item=>{
    const card=add(grid,'article');card.className='case-card';
    if(item.photo){const img=add(card,'img');img.src=item.photo;img.loading='lazy';img.alt=item.photoAlt||item.title;}
    add(card,'h3',item.title);add(card,'p',item.type+' · '+item.location);
    const details=add(card,'details');add(details,'summary','Подробнее о празднике');
    for(const [key,label] of Object.entries({task:'Задача',format:'Формат',result:'Результат',review:'Отзыв'})){
      if(item[key]){const row=add(details,'p');add(row,'strong',label+': ');row.append(item[key]);}
    }
    if(item.video){const video=add(details,'video');video.controls=true;video.playsInline=true;video.preload='none';video.src=item.video;if(item.poster)video.poster=item.poster;}
  });
  caseSection.hidden=false;
}
