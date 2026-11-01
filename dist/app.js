import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {createArchitecture} from './architecture.js';
import {createMinaret} from './minaret.js';
import {chapters} from './story-content.js';
import {createEnvironment} from './environment.js';
import {createTourPlayer,tourStops,tourDuration} from './tour.js';
import {createHeroMedia} from './hero-media.js';

const $=s=>document.querySelector(s), host=$('#scene'), stage=$('.explorer');
createHeroMedia({video:$('#hero-video'),button:$('#hero-media-toggle'),hero:$('.hero'),document,
 motion:matchMedia('(prefers-reduced-motion: reduce)'),connection:navigator.connection,IntersectionObserver:window.IntersectionObserver});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile=()=>innerWidth<=900;
const order=['whole','courtyard','interior','brick','balcony','mulberry'];
const state={view:'whole',mode:'model',touring:false,evening:false,visited:new Set(['whole'])};
let renderer,scene,camera,controls,building,tower,environment,referenceLine,keyLight,fillLight,animation,lastFrame=0;
const tour=createTourPlayer(T),lookOffset=new T.Euler(0,0,0,'YXZ'),lookRotation=new T.Quaternion();
let lastTourStop=-1,tourDrag;
let dirty=true,inView=true,modelAvailable=false,renderCount=0;
T.DefaultLoadingManager.onLoad=()=>{dirty=true};
const photos={
 whole:{src:'assets/cami.jpg',alt:'Harput Ulu Camii taş dış cephesi ve Eğri Minare',caption:'Dış yapı. Dosseman, Eylül 2006. CC BY-SA 4.0.'},
 courtyard:{src:'assets/avlu.jpg',alt:'İç avluda taş payeler, sivri tuğla kemerler ve koruyucu cam örtü',caption:'İç avlu ve koruyucu örtü. Dosseman, 9 Eylül 2006. CC BY-SA 4.0.'},
 interior:{src:'assets/ic-mekan.jpg',alt:'Harput Ulu Camii hariminde açık renk payeler, tuğla kemerler, mihrap ve ahşap minber',caption:'Gerçek harim, mihrap ve minber yönü. Dosseman, 2006. CC BY-SA 4.0.'},
 brick:{src:'assets/minare.jpg',alt:'Minarenin geometrik tuğla işçiliği ve aşınmış harcı',caption:'Minare ayrıntısı. Dosseman, 9 Eylül 2006. CC BY-SA 4.0.'},
 balcony:{src:'assets/minare.jpg',alt:'Eğri Minare tek taş şerefesi ve kısa üst gövdesi',caption:'Şerefe ve üst gövde. Dosseman, 9 Eylül 2006. CC BY-SA 4.0.'},
 mulberry:{src:'assets/egik-dut-reference.png',alt:'Harput Ulu Camii güney duvarına bitişik, kökleri yatay uzanan eğik dut ağacı',caption:'Eğik dut ağacı. Kullanıcı tarafından sağlanan referans; eser sahibi ve lisans belirtilmedi.'}
};
const presets={
 whole:{target:[-1.6,3.3,1],offset:[23,13.8,-16]},
 courtyard:{target:[-2,1.4,2.55],offset:[5.8,9,7.6]},
 interior:{target:[-2,1.0,-1.5],offset:[8.2,10.5,-11.4]},
 brick:{target:[1.14,4.7,2.25],offset:[6.5,1.1,8]},
 balcony:{target:[.85,8.7,2.25],offset:[4.2,.8,6.2]},
 mulberry:{target:[-2,1.8,-4.7],offset:[13,6,-15]}
};
const spots={courtyard:new T.Vector3(-2,2.2,2.55),interior:new T.Vector3(-2,3.6,-2.1),brick:new T.Vector3(1.2,6.1,2.25),mulberry:new T.Vector3(-2,1.6,-4.7)};

function renderContent(){
 stage.dataset.view=state.view;
 const chapter=chapters[state.view], image=photos[state.view];
 $('#chapter-label').textContent=chapter.label;
 $('#chapter-title').textContent=chapter.title;
 $('#chapter-text').textContent=chapter.paragraph;
 $('#chapter-source').href=chapter.source;
 $('#reference-image').src=image.src;
 $('#reference-image').alt=image.alt;
 $('#reference-caption').textContent=image.caption;
 document.querySelectorAll('[data-view]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.view===state.view));b.dataset.visited=String(state.visited.has(b.dataset.view))});
 document.querySelectorAll('[data-spot]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.spot===state.view)));
 $('#model-note').textContent=state.view==='interior'?'Temsili iç kesit. Çatı ve bazı duvarlar, mekân ilişkilerini göstermek için kaldırıldı.':state.view==='courtyard'?'Mekânsal düzeni göstermek için koruyucu cam örtü bu görünümde gizlenir. Temsili modeldir.':state.view==='mulberry'?'Fotoğraf ve kaynaklardaki konumdan geliştirilmiş temsili eğik dut. Botanik veya peyzaj rölövesi değildir.':'Fotoğraf ve plan kaynaklarından geliştirilmiş temsili model. Rölöve değildir.';
 const datumRelevant=['whole','brick','balcony'].includes(state.view);
 $('#datum').disabled=!datumRelevant;
 if(referenceLine)referenceLine.visible=datumRelevant&&$('#datum').checked;
}
function cameraPose(view){
 const p=presets[view],target=new T.Vector3(...p.target),offset=new T.Vector3(...p.offset);
 if(mobile())offset.multiplyScalar(view==='whole'?1:1.03);
 else if(view!=='mulberry'){
  const right=new T.Vector3().crossVectors(offset,new T.Vector3(0,1,0)).normalize().negate();
  target.addScaledVector(right,view==='whole'?-2.2:-1.65);
 }
 return{target,position:target.clone().add(offset)};
}
function setCamera(view,immediate=false){
 if(!controls)return;
 const p=cameraPose(view);
 controls.minPolarAngle=.08;controls.maxPolarAngle=Math.PI*.48;
 if(immediate||reduced){animation=null;camera.position.copy(p.position);controls.target.copy(p.target);controls.update()}
 else animation={time:performance.now(),from:camera.position.clone(),to:p.position,fromTarget:controls.target.clone(),toTarget:p.target};
 dirty=true;
}
function selectView(view,{immediate=false}={}){
 if(!chapters[view])return;
 if(state.touring)exitTour(false);
 state.view=view;state.visited.add(view);
 if(building){const inside=view==='interior';building.roof.visible=!inside;building.cutWalls.visible=!inside;building.modernCover.visible=view!=='courtyard'}
 renderContent();setCamera(view,immediate);
}
function setMode(mode){
 if(state.touring)exitTour(false);
 if(mode==='model'&&!modelAvailable)mode='photo';
 state.mode=mode;const model=mode==='model';
 stage.dataset.mode=mode;host.hidden=!model;$('#reference-photo').hidden=model;
 $('#stage-settings').hidden=!model;$('#hotspots').hidden=!model;$('#model-note').hidden=!model;
 $('#model-btn').setAttribute('aria-pressed',String(model));$('#photo-btn').setAttribute('aria-pressed',String(!model));
 renderContent();if(model){resize();dirty=true}
}
function resize(){
 if(!renderer)return;
 const {width,height}=host.getBoundingClientRect();if(!width||!height)return;
 renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();
 if(state.touring)applyTourPose();else setCamera(state.view,true);dirty=true;
}
function addGround(){
 const material=new T.MeshStandardMaterial({color:0xc4c7ba,roughness:1});
 const base=new T.Mesh(new T.BoxGeometry(10.4,.15,12.4),material);base.position.set(-2,-.27,1);base.receiveShadow=true;scene.add(base);
 const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.15}));floor.rotation.x=-Math.PI/2;floor.position.y=-.36;floor.receiveShadow=true;scene.add(floor);
}
function build(){
 renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 scene=new T.Scene();camera=new T.PerspectiveCamera(37,1,.1,200);
 scene.add(new T.HemisphereLight(0xf1f6ec,0x6f7162,2.3));
 keyLight=new T.DirectionalLight(0xffecd1,3.4);keyLight.position.set(-7,17,12);keyLight.castShadow=true;
 keyLight.shadow.mapSize.set(2048,2048);Object.assign(keyLight.shadow.camera,{left:-17,right:15,top:17,bottom:-16,near:1,far:60});keyLight.shadow.normalBias=.025;scene.add(keyLight);
 fillLight=new T.DirectionalLight(0xc8dfeb,1.1);fillLight.position.set(9,8,-7);scene.add(fillLight);
 building=createArchitecture(T);scene.add(building.group);
 tower=createMinaret(T);tower.position.copy(building.group.userData.minaretBase);scene.add(tower);addGround();
 environment=createEnvironment(T);scene.add(environment.group);
 const points=[new T.Vector3(2.75,0,2.25),new T.Vector3(2.75,11.3,2.25)];
 referenceLine=new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineDashedMaterial({color:0x7b2436,dashSize:.14,gapSize:.1,depthTest:false,transparent:true,opacity:.8}));referenceLine.computeLineDistances();referenceLine.renderOrder=5;referenceLine.visible=false;scene.add(referenceLine);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=!reduced;controls.dampingFactor=.075;controls.enablePan=false;controls.enableZoom=false;controls.rotateSpeed=.65;
 renderer.domElement.style.touchAction='pan-y';controls.touches.ONE=T.TOUCH.ROTATE;
 controls.addEventListener('start',()=>{animation=null});controls.addEventListener('change',()=>{dirty=true;updateAngle()});
 new ResizeObserver(resize).observe(host);
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)dirty=true},{rootMargin:'100px'});observer.observe(host);
 const ray=new T.Raycaster(),pointer=new T.Vector2();let down;
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];if(state.touring){tourDrag={id:e.pointerId,x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId)}});
 renderer.domElement.addEventListener('pointermove',e=>{if(!state.touring||!tourDrag||e.pointerId!==tourDrag.id)return;lookOffset.y=T.MathUtils.clamp(lookOffset.y-(e.clientX-tourDrag.x)*.004,-Math.PI*.7,Math.PI*.7);lookOffset.x=T.MathUtils.clamp(lookOffset.x-(e.clientY-tourDrag.y)*.003,-.65,.65);tourDrag.x=e.clientX;tourDrag.y=e.clientY;dirty=true});
 renderer.domElement.addEventListener('pointercancel',()=>{tourDrag=null});
 renderer.domElement.addEventListener('pointerup',e=>{tourDrag=null;if(state.touring)return;if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const rect=host.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObject(tower,true).find(x=>x.object.userData.part);if(hit)selectView(hit.object.userData.part)});
 modelAvailable=true;$('#loading').remove();resize();selectView('whole',{immediate:true});renderer.setAnimationLoop(frame);
}
function updateAngle(){const a=((controls.getAzimuthalAngle()*180/Math.PI)%360+360)%360;$('#angle').value=Math.round(a);$('#angle-value').value=Math.round(a)+'°'}
function updateHotspots(){
 const box=host.getBoundingClientRect(),stageBox=stage.getBoundingClientRect();
 document.querySelectorAll('[data-spot]').forEach(b=>{
  const p=spots[b.dataset.spot].clone().project(camera),x=(p.x*.5+.5)*box.width,y=(-p.y*.5+.5)*box.height;
  b.hidden=state.view!=='whole'||p.z>1||p.z< -1||x<(!mobile()?280:12)||x>box.width-20||y<55||y>box.height-45;
  b.style.left=(x+box.left-stageBox.left)+'px';b.style.top=(y+box.top-stageBox.top)+'px';
 });
}
function frame(now){
 const delta=lastFrame?Math.min((now-lastFrame)/1000,.1):0;lastFrame=now;
 if(state.mode!=='model'||document.hidden||!inView)return;
 if(state.touring){
  if(tour.update(delta))dirty=true;
  if(dirty){applyTourPose();environment.update(reduced?0:now*.001);renderer.render(scene,camera);updateTourUI();dirty=false}
  return;
 }
 if(animation){const t=Math.min((now-animation.time)/1100,1),e=t*t*(3-2*t);camera.position.lerpVectors(animation.from,animation.to,e);controls.target.lerpVectors(animation.fromTarget,animation.toTarget,e);dirty=true;if(t===1)animation=null}
 controls.update();
 if(dirty){environment.update(reduced?0:now*.001);renderer.render(scene,camera);updateHotspots();dirty=false;renderCount++}
}

function applyTourPose(){
 const pose=tour.pose();camera.position.copy(pose.position);camera.lookAt(pose.target);
 lookRotation.setFromEuler(lookOffset);camera.quaternion.multiply(lookRotation);
}
const formatTime=value=>Math.floor(value/60)+':'+String(Math.floor(value%60)).padStart(2,'0');
function updateTourUI(){
 const index=tour.stopIndex,stop=tourStops[index];
 if(lastTourStop!==index){
  $('#tour-stop-label').textContent=String(index+1).padStart(2,'0')+' / 06 · '+stop.label;
  $('#tour-stop-title').textContent=stop.title;$('#tour-stop-text').textContent=stop.text;
  document.querySelectorAll('[data-tour-stop]').forEach(b=>{const active=Number(b.dataset.tourStop)===index;b.setAttribute('aria-pressed',String(active));if(active){b.setAttribute('aria-current','step');const route=$('#tour-stops');route.scrollTo({left:b.offsetLeft-(route.clientWidth-b.offsetWidth)/2,behavior:reduced?'auto':'smooth'})}else b.removeAttribute('aria-current')});
  lastTourStop=index;
 }
 $('#tour-progress').value=Math.round(tour.time/tourDuration*1000);
 $('#tour-progress').setAttribute('aria-valuetext',formatTime(tour.time)+' / '+formatTime(tourDuration));
 $('#tour-elapsed').value=formatTime(tour.time)+' / '+formatTime(tourDuration);
 $('#tour-play').setAttribute('aria-pressed',String(tour.playing));
 const action=tour.playing?'Geziyi duraklat':tour.time>=tourDuration?'Geziyi yeniden başlat':'Geziyi oynat';
 $('#tour-play').setAttribute('aria-label',action);$('#tour-play').title=action;
 $('#tour-prev').disabled=tour.time<.05;$('#tour-next').disabled=index===tourStops.length-1;
}
function startTour(){
 if(!modelAvailable)return;
 setMode('model');state.touring=true;animation=null;controls.enabled=false;
 stage.dataset.tour='true';$('#tour-overlay').hidden=false;
 building.roof.visible=building.cutWalls.visible=building.modernCover.visible=true;
 building.entranceDoor.visible=false;referenceLine.visible=false;
 camera.fov=mobile()?78:70;camera.near=.035;camera.updateProjectionMatrix();
 scene.background=new T.Color(0xcbd7d7);scene.fog=new T.Fog(0xcbd7d7,24,65);
 tour.seek(0);if(!reduced)tour.play();lookOffset.set(0,0,0);lastTourStop=-1;
 renderer.domElement.style.touchAction='none';host.tabIndex=0;
 applyTourPose();updateTourUI();resize();dirty=true;
 stage.scrollIntoView({behavior:'instant',block:'start'});$('#tour-play').focus({preventScroll:true});
}
function exitTour(restore=true){
 if(!state.touring)return;
 tour.pause();state.touring=false;tourDrag=null;stage.dataset.tour='false';$('#tour-overlay').hidden=true;
 controls.enabled=true;renderer.domElement.style.touchAction='pan-y';host.removeAttribute('tabindex');
 building.entranceDoor.visible=true;camera.fov=37;camera.near=.1;camera.updateProjectionMatrix();
 scene.background=null;scene.fog=null;lookOffset.set(0,0,0);
 if(restore)selectView('whole',{immediate:true});resize();dirty=true;
}
function moveTour(index){lookOffset.set(0,0,0);tour.goTo(index,{immediate:reduced});dirty=true;updateTourUI()}
tourStops.forEach((stop,index)=>{const b=document.createElement('button');b.type='button';b.dataset.tourStop=index;b.textContent=stop.label;b.setAttribute('aria-label',stop.label+' durağına git');b.onclick=()=>moveTour(index);$('#tour-stops').append(b)});
$('#start-tour').onclick=startTour;
$('#tour-exit').onclick=()=>{exitTour();$('#start-tour').focus({preventScroll:true})};
$('#tour-play').onclick=()=>{if(tour.playing)tour.pause();else tour.play();dirty=true;updateTourUI()};
$('#tour-prev').onclick=()=>moveTour(tour.time>tourStops[tour.stopIndex].time+.5?tour.stopIndex:tour.stopIndex-1);
$('#tour-next').onclick=()=>moveTour(tour.stopIndex+1);
$('#tour-progress').oninput=e=>{tour.pause();tour.seek(Number(e.target.value)/1000*tourDuration);lookOffset.set(0,0,0);dirty=true;updateTourUI()};
stage.addEventListener('keydown',e=>{if(!state.touring)return;if(e.key==='Escape'){e.preventDefault();exitTour();$('#start-tour').focus({preventScroll:true});return}if(e.target.closest('button,a,input'))return;if(e.key===' '){e.preventDefault();$('#tour-play').click()}else if(e.key==='ArrowRight'){e.preventDefault();moveTour(tour.stopIndex+1)}else if(e.key==='ArrowLeft'){e.preventDefault();moveTour(tour.stopIndex-1)}});
const tourPhoto=$('#tour-photo-dialog');
$('#tour-reference').onclick=e=>{
 e.preventDefault();tour.pause();updateTourUI();
 const stop=tourStops[tour.stopIndex],isRevak=stop.id==='arcade';
 const image=isRevak?{src:'assets/harim.jpg',alt:'Gerçek avlu revakları',caption:'Revak ayrıntısı. Dosseman, 2006. CC BY-SA 4.0.'}:photos[stop.photo];
 $('#tour-photo-image').src=image.src;$('#tour-photo-image').alt=image.alt;$('#tour-photo-caption').textContent=image.caption;
 const file=isRevak?'1120':stop.photo==='whole'?'9621':stop.photo==='courtyard'?'1123':'9627';
 $('#tour-photo-source').href='https://commons.wikimedia.org/wiki/File:Harput_Ulu_Cami_'+file+'.jpg';
 tourPhoto.showModal();
};
$('#tour-photo-close').onclick=()=>tourPhoto.close();

document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>selectView(b.dataset.view));
document.querySelectorAll('[data-spot]').forEach(b=>b.onclick=()=>selectView(b.dataset.spot));
$('#model-btn').onclick=()=>setMode('model');$('#photo-btn').onclick=()=>setMode('photo');
$('#next-stop').onclick=()=>selectView(order[(order.indexOf(state.view)+1)%order.length]);
$('#visit-courtyard').onclick=()=>{setMode('model');selectView('courtyard');$('#kesif').scrollIntoView({behavior:reduced?'instant':'smooth'})};
$('#datum').onchange=()=>{renderContent();dirty=true};
$('#angle').oninput=e=>{
 if(!controls)return;animation=null;
 const a=Number(e.target.value)*Math.PI/180,delta=camera.position.clone().sub(controls.target),radius=Math.hypot(delta.x,delta.z);
 camera.position.set(controls.target.x+Math.sin(a)*radius,camera.position.y,controls.target.z+Math.cos(a)*radius);controls.update();dirty=true;
};
function setLight(evening){
 state.evening=evening;$('#light-toggle').setAttribute('aria-pressed',String(evening));$('#light-toggle').title=evening?'Akşam ışığını kapat':'Akşam ışığını aç';
 if(keyLight){keyLight.color.setHex(evening?0xffc391:0xffecd1);keyLight.position.set(evening?-12:-7,evening?7:17,12);fillLight.intensity=evening?.6:1.1}dirty=true;
}
$('#light-toggle').onclick=()=>setLight(!state.evening);
$('#reset').onclick=()=>{setLight(false);$('#datum').checked=false;selectView('whole');if(state.mode==='photo')setMode('model')};
$('#expand').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#kesif').requestFullscreen();resize()}catch{$('#kesif').scrollIntoView({behavior:'smooth'})}};
document.addEventListener('fullscreenchange',resize);
const dialog=$('#film-dialog');
document.querySelectorAll('[data-film]').forEach(b=>b.onclick=()=>{
 if(!dialog.open)dialog.showModal();
 const iframe=document.createElement('iframe');iframe.src='https://www.youtube-nocookie.com/embed/jeS2PVqWVcQ?rel=0';iframe.title='Harput Ulu Camii - Elazığ İl Kültür ve Turizm Müdürlüğü, 2021';iframe.allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';$('#film-player').replaceChildren(iframe);
});
function closeFilm(){dialog.close();$('#film-player').replaceChildren()}
$('#close-film').onclick=closeFilm;dialog.addEventListener('close',()=>$('#film-player').replaceChildren());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeFilm()}});
try{build()}catch(error){console.error(error);$('#loading')?.remove();$('#model-btn').disabled=true;setMode('photo')}
window.addEventListener('pageshow',()=>{dirty=true});
