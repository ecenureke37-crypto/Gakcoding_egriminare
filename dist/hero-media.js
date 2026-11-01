export function createHeroMedia({video,button,hero,document,motion,connection,IntersectionObserver}){
 let userPaused=false,blocked=false,failed=false,inView=true,pending=false,attempt=0,attached=false;
 const allowed=()=>!motion.matches&&!connection?.saveData&&!failed;
 const shouldPlay=()=>allowed()&&!document.hidden&&inView&&!userPaused&&!blocked;
 video.muted=true;video.loop=true;video.playsInline=true;
 hero.dataset.mediaReady='false';

 function updateButton(){
  const playing=shouldPlay()&&!video.paused;
  const label=playing?'Arka plan videosunu duraklat':'Arka plan videosunu oynat';
  button.hidden=!allowed();button.setAttribute('aria-pressed',String(playing));
  button.setAttribute('aria-label',label);button.setAttribute('title',label);
 }
 function sync(){
  if(!shouldPlay()){
   attempt++;pending=false;video.pause();
   if(!allowed()){
    hero.dataset.mediaReady='false';
    if(attached){attached=false;video.removeAttribute('src');video.load();}
   }
   updateButton();return;
  }
  if(!attached){video.src='assets/hero-drone.mp4';attached=true;}
  updateButton();
  if(pending||!video.paused)return;
  pending=true;const current=++attempt;
  // Visibility or preference changes can overtake the asynchronous play promise.
  try{
   Promise.resolve(video.play()).then(()=>{
    if(!shouldPlay()){video.pause();return;}
    if(current!==attempt)return;
    pending=false;hero.dataset.mediaReady='true';updateButton();
   }).catch(()=>reject(current));
  }catch{reject(current);}
 }
 function reject(current){
  if(current!==attempt)return;
  pending=false;blocked=true;hero.dataset.mediaReady='false';video.pause();updateButton();
 }
 button.addEventListener('click',()=>{
  if(!allowed())return;
  if(shouldPlay()&&(!video.paused||pending))userPaused=true;
  else{userPaused=false;blocked=false;}
  sync();
 });
 video.addEventListener('playing',()=>{
  if(!shouldPlay()){video.pause();return;}
  hero.dataset.mediaReady='true';updateButton();
 });
 video.addEventListener('pause',updateButton);
 video.addEventListener('error',()=>{failed=true;sync();});
 document.addEventListener('visibilitychange',sync);
 motion.addEventListener('change',sync);
 connection?.addEventListener?.('change',sync);
 if(IntersectionObserver){
  const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();});
  observer.observe(hero);
 }
 sync();
}
