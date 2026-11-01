# Egik Dut ve Yeni Hero Video Tasarimi

## Intent

Harput Ulu Camii'nin guney/kible duvarina bitisik egik dut agacini, kullanicinin sagladigi fotografi ve guvenilir kaynaklari temel alarak 3D modelin anlatisal bir parcasi yapmak. Yazi bindirmesi kaldirilmis `harput_son.mp4` klibini mevcut hero arka planinin yerine, mobil web icin makul boyutta kullanmak.

## Evidence Boundary

- Kultur Portali agaci caminin guney duvarina bitisik olarak, Elazig Il Kultur ve Turizm Mudurlugu ise mihrabin arkasinda tanimlar. Modelde bu ayni konumdur: harim icindeki mihrabin dis/guney tarafi.
- Akademik calisma agaci halk arasinda `Ulu Agac`, basliginda `karadut` olarak aktarir. Botanik tur teshisi yapilmaz; arayuzde `egik dut` denir.
- Secde anlatimi tarihsel veya bilimsel olgu degil, `Halk anlatisi / rivayet` etiketiyle sunulur.
- Fotograf ve video kullanici tarafindan saglanmistir; eser sahibi veya yeniden dagitim lisansi iddia edilmez.

## Chosen Approach

Genel peyzaj agacini egmek yerine `createEnvironment()` icinde ayri bir `makeMulberry()` grubu kurulacak. Agac `(-2, -.32, -4.7)` cevresinde, guney duvarina bitisik oval koruyucu cevre icinde yer alacak. Catmull-Rom egri govdeler, kalin kok kutlesi ve instanced yapraklarla fotografdaki yataydan yukselen cok kollu form okunacak. Govde sabit, yalniz tac cok hafif salinacak.

Yeni `mulberry` gorunumu; kamera preset'i, 3D hotspot, alt durak, kaynakli chapter ve kullanici fotografina bagli gercek goruntu modu ekleyecek. Mevcut hikaye karti konumu ve `rivayet` sinirini daha acik anlatacak.

Yeni video H.264/yuv420p, 1280x720, 30fps, sessiz ve fast-start olarak kodlanacak. Hedef kalite CRF 26; ayni `assets/hero-drone.mp4` yolu korunarak controller sozlesmesi degistirilmeyecek.

## Non-goals

- Agacin kesin yasi, anit agac tescili veya Latince turu iddia edilmeyecek.
- Efsane, minarenin egilmesine bilimsel aciklama olarak kullanilmayacak.
- Peyzaj rolovesi veya fotogrametrik dijital ikiz iddiasi yapilmayacak.
- Hero controller ya da sunucu protokolu yeniden tasarlanmayacak.

## Acceptance

- Ozel dut guney duvari disinda, mihrab eksenine yakin ve yuruyus/giris rotasindan uzakta.
- En az uc ayri ana govde kolu; ilk ana hareketi duseyden cok yatay; tac genisligi yuksekligine yakin veya daha fazla.
- `mulberry` chapter, hotspot, alt durak ve fotograf kaydi ayni kimlikle calisir.
- Rivayet metni kaynakli ve acikca halk anlatisi olarak kalir.
- Yeni video 10 MB altinda, fast-start, sessiz, 720p ve tarayicida otomatik oynatilir; reduced-motion ve Save-Data sozlesmeleri korunur.
- Masaustu ve mobil whole/mulberry gorunumleri nonblank, tasmasiz ve camiyi anlamsizca kapatmayan kadrajda.

## Approaches Considered

1. Genel agaci egmek: hizli ama fotografdaki kok/govde kimligini ve hikaye odagini kaybettirir.
2. Fotograf billboard'u: gercek goruntu verir ama 3D dolasimda duz ve yapmacik kalir.
3. Ozel prosedurel dut + ayri referans fotografi: secildi; gercek formu 3D'de anlatirken kaynak fotografini da dogrudan incelemeye izin verir.
