import test from 'node:test';
import assert from 'node:assert/strict';

const mediaModule=await import('../dist/hero-media.js').catch(()=>null);

function fixture({reduced=false,saveData=false,hidden=false,play}={}){
 const video=new EventTarget();
 Object.assign(video,{src:'',paused:true,muted:false,loop:false,playsInline:false,load(){},
  removeAttribute(name){if(name==='src')this.src='';},
  pause(){this.paused=true;this.dispatchEvent(new Event('pause'));},
  async play(){if(play)await play();this.paused=false;this.dispatchEvent(new Event('playing'));}});
 const button=new EventTarget();
 Object.assign(button,{hidden:true,attributes:{},setAttribute(name,value){this.attributes[name]=value;}});
 const document=Object.assign(new EventTarget(),{hidden});
 const motion=Object.assign(new EventTarget(),{matches:reduced});
 const connection=Object.assign(new EventTarget(),{saveData});
 const hero={dataset:{}};
 let intersection;
 class Observer{constructor(callback){intersection=callback;}observe(){}disconnect(){}}
 assert.equal(typeof mediaModule?.createHeroMedia,'function','hero media controller must exist');
 const controller=mediaModule.createHeroMedia({video,button,hero,document,motion,connection,IntersectionObserver:Observer});
 return {video,button,document,motion,connection,hero,controller,
  intersect(visible){intersection([{isIntersecting:visible}]);}};
}
const settle=()=>new Promise(resolve=>setImmediate(resolve));

test('reduced motion and Save-Data never attach a video source, including a play click',async()=>{
 for(const policy of [{reduced:true},{saveData:true}]){
  const f=fixture(policy);f.button.dispatchEvent(new Event('click'));await settle();
  assert.equal(f.video.src,'');assert.equal(f.video.paused,true);assert.equal(f.button.hidden,true);
 }
});

test('allowed media attaches the local muted looping inline source and exposes pause',async()=>{
 const f=fixture();await settle();
 assert.equal(f.video.src,'assets/hero-drone.mp4');
 assert.equal(f.video.muted,true);assert.equal(f.video.loop,true);assert.equal(f.video.playsInline,true);
 assert.equal(f.video.paused,false);assert.equal(f.hero.dataset.mediaReady,'true');
 assert.equal(f.button.hidden,false);assert.equal(f.button.attributes['aria-label'],'Arka plan videosunu duraklat');
});

test('autoplay rejection keeps the poster and permits an explicit retry',async()=>{
 let blocked=true;
 const f=fixture({play:()=>{if(blocked)throw Error('Autoplay denied');}});await settle();
 assert.equal(f.hero.dataset.mediaReady,'false');assert.equal(f.video.paused,true);
 assert.equal(f.button.attributes['aria-label'],'Arka plan videosunu oynat');
 blocked=false;f.button.dispatchEvent(new Event('click'));await settle();assert.equal(f.video.paused,false);
});

test('offscreen and hidden media pauses and resumes when visible',async()=>{
 const f=fixture();await settle();f.intersect(false);assert.equal(f.video.paused,true);
 f.intersect(true);await settle();assert.equal(f.video.paused,false);
 f.document.hidden=true;f.document.dispatchEvent(new Event('visibilitychange'));assert.equal(f.video.paused,true);
 f.document.hidden=false;f.document.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(f.video.paused,false);
});

test('user pause survives offscreen and hidden transitions until play is clicked',async()=>{
 const f=fixture();await settle();f.button.dispatchEvent(new Event('click'));
 f.intersect(false);f.intersect(true);f.document.hidden=true;f.document.dispatchEvent(new Event('visibilitychange'));
 f.document.hidden=false;f.document.dispatchEvent(new Event('visibilitychange'));await settle();
 assert.equal(f.video.paused,true);assert.equal(f.button.attributes['aria-pressed'],'false');
 f.button.dispatchEvent(new Event('click'));await settle();assert.equal(f.video.paused,false);
});

test('policy changes unload media and restore the poster without losing user pause',async()=>{
 const f=fixture();await settle();f.button.dispatchEvent(new Event('click'));
 f.motion.matches=true;f.motion.dispatchEvent(new Event('change'));await settle();
 assert.equal(f.video.src,'');assert.equal(f.hero.dataset.mediaReady,'false');assert.equal(f.button.hidden,true);
 f.motion.matches=false;f.motion.dispatchEvent(new Event('change'));await settle();assert.equal(f.video.paused,true);
 f.button.dispatchEvent(new Event('click'));await settle();assert.equal(f.video.paused,false);
 f.connection.saveData=true;f.connection.dispatchEvent(new Event('change'));await settle();assert.equal(f.video.src,'');
});

test('a late playback completion cannot restart a now-hidden or policy-blocked hero',async()=>{
 let resolvePlay;const f=fixture({play:()=>new Promise(resolve=>{resolvePlay=resolve;})});
 f.motion.matches=true;f.motion.dispatchEvent(new Event('change'));resolvePlay();await settle();
 assert.equal(f.video.paused,true);assert.equal(f.video.src,'');assert.equal(f.hero.dataset.mediaReady,'false');
});

test('unsupported or failed media restores the poster and stops automatic retries',async()=>{
 const f=fixture();await settle();f.video.dispatchEvent(new Event('error'));
 f.intersect(false);f.intersect(true);await settle();
 assert.equal(f.video.paused,true);assert.equal(f.hero.dataset.mediaReady,'false');assert.equal(f.button.hidden,true);
});

test('an initially hidden document defers attaching the source',async()=>{
 const f=fixture({hidden:true});await settle();assert.equal(f.video.src,'');
 f.document.hidden=false;f.document.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(f.video.paused,false);
});
