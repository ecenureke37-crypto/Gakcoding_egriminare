const inventory='https://www.kulturportali.gov.tr/turkiye/elazig/kulturenvanteri/ulu-cami225546';
export const tourDuration=80;
export const tourStops=[
 {id:'arrival',time:0,label:'Giriş',title:'Harput’un taş eşiğinde.',text:'Taş beden duvarı, tuğla minare ve giriş cephesi. Yapıya bu kez dışarıdan bakmakla yetinmeyip içeriye ilerliyoruz.',position:[6,1.45,-.05],target:[1.6,1.4,-.05],photo:'whole',source:inventory},
 {id:'threshold',time:12,label:'Eşik',title:'Dışarıdaki ses geride kalır.',text:'Batı girişi, kalın duvarların içindeki mekânlara açılır. Revaklar, avlu ile kapalı bölümler arasında bir geçiş kurar.',position:[.7,1.3,-.05],target:[-2,1.35,1],photo:'courtyard',source:inventory},
 {id:'court',time:28,label:'Avlu',title:'Kemerlerin arasında ışık.',text:'Sivri tuğla kemerler taş payelere oturur. Ortadaki alçak, kapaklı su öğesi fotoğrafa göre temsilen gösterilir; özgün işlevi kesinleştirilmemiştir.',position:[-2.75,1.3,2.15],target:[-2,0.55,2.55],photo:'courtyard',source:inventory},
 {id:'arcade',time:42,label:'Revak',title:'Taşın taşıdığı ritim.',text:'Avlunun çevresinde ışık ve gölge değişir. Tuğla kemerlerin altında ilerlerken, yapının içe dönük düzeni okunur.',position:[-4.35,1.3,3.25],target:[-4.75,1.35,.2],photo:'interior',source:inventory},
 {id:'prayer',time:58,label:'Harim',title:'Payeler arasında.',text:'Mihraba paralel iki sahın, kütlesel payeler ve beşik tonozlarla biçimlenir. Çatı artık bir kesit değil, başımızın üzerindeki mekândır.',position:[-4.3,1.3,-2.6],target:[-2,1.5,-2.5],photo:'interior',source:inventory},
 {id:'mihrab',time:72,label:'Mihrap',title:'Yönün ve mekânın odağı.',text:'Sığ, sıvalı mihrap nişi ve yanındaki ahşap minber aynı duvarda okunur. Mihrap önündeki küçük kubbe, harimin örtü düzeninde farklılaşır.',position:[-2.75,1.38,-1.55],target:[-1.75,1.28,-3.45],photo:'interior',source:inventory}
];

const viaPoints=[
 [[3.7,1.4,-.05],[2.15,1.3,-.05]],
 [[-.4,1.3,-.45],[-1.85,1.3,-.45],[-1.3,1.3,1.4]],
 [[-2.8,1.3,3.25],[-3.4,1.3,3.25]],
 [[-4.75,1.3,.65],[-4.75,1.3,.1],[-5.05,1.3,-1.3],[-5.05,1.3,-2.3]],
 [[-3.55,1.34,-2.35],[-2.75,1.37,-2.22]]
];

export function createTourPlayer(T){
 const curves=tourStops.slice(0,-1).map((stop,i)=>new T.CatmullRomCurve3([stop.position,...viaPoints[i],tourStops[i+1].position].map(p=>new T.Vector3(...p)),false,'centripetal'));
 let time=0,playing=false,travel=null;
 const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
 const api={
  get time(){return time},
  get playing(){return playing},
  get stopIndex(){let i=0;while(i<tourStops.length-1&&time>=tourStops[i+1].time)i++;return i},
  play(){if(time>=tourDuration)time=0;travel=null;playing=true},
  pause(){playing=false;travel=null},
  seek(value){if(!Number.isFinite(value))return;time=clamp(value,0,tourDuration);travel=null;if(time===tourDuration)playing=false},
  goTo(index,{immediate=false}={}){
   if(!Number.isFinite(index))return;
   const next=tourStops[clamp(Math.round(index),0,tourStops.length-1)].time;
   playing=false;
   if(immediate){time=next;travel=null}
   else travel={from:time,to:next,elapsed:0};
  },
  update(delta){
   const step=Number.isFinite(delta)?clamp(delta,0,.1):0;
   if(travel){travel.elapsed+=step;const p=Math.min(travel.elapsed/2.4,1),e=p*p*(3-2*p);time=travel.from+(travel.to-travel.from)*e;if(p===1)travel=null;return true}
   if(!playing)return false;
   time=Math.min(tourDuration,time+step);if(time===tourDuration)playing=false;return true;
  },
  pose(){
   const index=api.stopIndex,stop=tourStops[index],next=tourStops[index+1];
   if(!next)return {position:new T.Vector3(...stop.position),target:new T.Vector3(...stop.target)};
   const p=clamp((time-stop.time-3)/(next.time-stop.time-3),0,1),e=p*p*(3-2*p);
   return {position:curves[index].getPointAt(e),target:new T.Vector3(...stop.target).lerp(new T.Vector3(...next.target),e)};
  }
 };
 return api;
}
