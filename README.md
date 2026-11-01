# Harput Ulu Camii ve Eğri Minare

GakCoding örnek çalışmasıdır. Türkçe mimari keşif; resmî kurum sitesi, rölöve veya birebir dijital ikiz değildir.

## Çalıştırma

Node.js bulunan bu klasörde `npm start` çalıştırın. Varsayılan adres `http://127.0.0.1:5182/`.

Sunucu `0.0.0.0` üzerinde `PORT` ortam değişkenini, değişken verilmezse 5182 portunu kullanır. Haricî npm bağımlılığı ve kurulum adımı yoktur. Three.js r180, aynı sürüm OrbitControls ve Three lisansı `dist/vendor/` içinde yereldir. Ayrı bir derleme adımı yoktur; `dist/` içindeki dosyalar doğrudan geliştirilir ve sunulur.

## Proje Yapısı

- `dist/index.html`, `dist/style.css`: sayfa ve duyarlı görünüm.
- `dist/app.js`: kamera, gezi durakları ve etkileşimler.
- `dist/hero-media.js`: arka plan videosunun veri/hareket tercihi, görünürlük ve oynatma denetimi.
- `dist/architecture.js`, `dist/minaret.js`: temsili 3D yapı.
- `dist/story-content.js`: kaynaklı durak açıklamaları.
- `dist/assets/`: görseller ve kaynak/lisans manifesti.
- `server.cjs`: Node.js statik dosya sunucusu.

Geliştirme bu GitHub reposu üzerinden sürdürülür. Barındırma servisi Node.js çalıştırıyorsa başlangıç komutu `npm start`; statik barındırma kullanılıyorsa yayın klasörü `dist/` olur. Yayınlama bu sürüme dahil değildir.

## Deneyim

Beş durak aynı kamera, açıklama ve fotoğraf durumunu yönetir: **Bütün yapı**, **Avlu**, **Harim**, **Tuğla işçiliği**, **Şerefe**. 3D ile kaynak fotoğrafı arasında geçiş yapılabilir. Bakış sürgüsü ve sürükleme, düşey referans, akşam ışığı, sıfırlama ve tam ekran kontrolleri bulunur. Harita bağlantısı Harput Ulu Camii/Elazığ hedefini kullanır.

`İçeride gez` seçeneği insan göz hizasında altı duraklı bir rota açar: giriş, eşik, avlu, revak, harim ve mihrap. Gezi oynatılabilir, duraklatılabilir, zaman çizgisinden aranabilir ve duraklar arasında atlanabilir. Fare veya dokunma sürüklemesi bakış yönünü sınırlı olarak değiştirir. `Gerçek görüntü` bağlantısı bulunduğun durağa ait lisanslı arşiv fotoğrafını açar. Düşük hareket tercihi açık olduğunda gezi otomatik başlamaz.

Yakın çevredeki seyrek ağaçlar dış fotoğraftaki siluet ve yerleşim ilişkilerinden yorumlanmıştır; peyzaj rölövesi değildir. İç mekândaki kiremit tonlu halı, beyaz sıvalı payeler, tuğla kemerler, mihrap ve ahşap minber `Harput Ulu Cami 9627` fotoğrafından geliştirilmiştir.

Kaynaklı hikâye, gerçek avlu fotoğrafı ve resmî drone filmi sayfada ayrı bölümlerdedir. Alt bölümdeki resmî film ancak kullanıcı açtığında YouTube iframe'i içinde yüklenir; bu gömme için video dosyası indirilmez.

İlk ekrandaki ayrı, yerel `hero-drone.mp4` dosyası sessiz, döngülü ve satır içi arka plan videosudur. `cami.jpg` poster ve yedek görüntü olarak korunur. Düşük hareket tercihi veya Save-Data etkinken video kaynağı atanmaz ve video baytları istenmez. Görünmeyen sekmede veya ekran dışında video durur; kullanıcının duraklatma tercihi korunur. Otomatik oynatma reddedilirse fotoğraf görünür kalır ve oynatma düğmesiyle yeniden denenebilir. Statik Node sunucusu MP4 MIME türünü, gövdesiz HEAD yanıtlarını ve tek aralıklı byte-range aktarımını destekler; dosyaları akışla sunar.

## Mimari Doğruluk Sınırları

Model, gerçek dış cephe fotoğrafları ve avlu/revak/iki sahınlı harim tanımlarından geliştirilmiş **temsili** bir anlatımdır. Ölçüm, mimari rölöve, tam iç mekân taraması veya fotogrametri modeli değildir. Gösterilen model eğimi, doğrulanmış açı ölçümü olarak kullanılmamalıdır.

Avlu durağında modern koruyucu örtü, mekân ilişkisini görünür kılmak için gizlenir. Harim durağı, bazı duvar ve çatı parçaları kaldırılmış temsili bir kesittir; günümüzde yapının çatısının açık olduğu anlamına gelmez. `harim.jpg` adlı fotoğraf gerçekte avluya açılan **revak ayrıntısıdır**, harimin tam panoraması değildir. Bu ayrım arayüz künyesinde de belirtilir.

## Görseller ve Lisans

Fotoğraflar Dosseman, 2006, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) lisanslıdır:

| Yerel Dosya | Kaynak | Kullanım/Değişiklik |
| --- | --- | --- |
| `dist/assets/cami.jpg` | [Harput Ulu Cami 9621](https://commons.wikimedia.org/wiki/File:Harput_Ulu_Cami_9621.jpg) | Dış yapı; boyutlandırıldı, arayüzde kadraja uyarlandı. |
| `dist/assets/minare.jpg` | [Harput Ulu Cami 1128](https://commons.wikimedia.org/wiki/File:Harput_Ulu_Cami_1128.jpg) | Minare ayrıntısı; boyutlandırıldı. |
| `dist/assets/avlu.jpg` | [Harput Ulu Cami 1123](https://commons.wikimedia.org/wiki/File:Harput_Ulu_Cami_1123.jpg) | İç avlu ve koruyucu örtü; boyutlandırıldı. |
| `dist/assets/harim.jpg` | [Harput Ulu Cami 1120](https://commons.wikimedia.org/wiki/File:Harput_Ulu_Cami_1120.jpg) | Revak ayrıntısı; boyutlandırıldı. Tam harim görüntüsü değildir. |
| `dist/assets/ic-mekan.jpg` | [Harput Ulu Cami 9627](https://commons.wikimedia.org/wiki/File:Harput_Ulu_Cami_9627.jpg) | Harim, mihrap ve minber yönü; boyutlandırıldı ve JPEG olarak sıkıştırıldı. Tam panorama değildir. |
| `dist/assets/stone-surface.jpg` | `cami.jpg` ile aynı Dosseman/9621 fotoğrafı | Taş duvar bölgesi kırpıldı, dört yöne aynalanarak tekrar edebilir yüzey türetildi. Türev görsel de CC BY-SA 4.0 kapsamındadır. |

Repoda optimize edilmiş görseller bulunur. Görsel künyeleri sayfada, makine okunur kayıtlar `dist/assets/asset-manifest.json` içindedir. Lisans, fotoğrafçı, kaynak ve değişiklik bilgisini yeni dağıtımlarda koruyun.

[Drone filmi](https://www.youtube.com/watch?v=jeS2PVqWVcQ): Elazığ İl Kültür ve Turizm Müdürlüğü, 2021. YouTube gömme oynatıcısı üzerinden sunulur; yerel bir video varlığı veya CC BY-SA fotoğraf lisansının parçası değildir.

`dist/assets/hero-drone.mp4`, kullanıcının sağladığı yerel `videoplayback.mp4` dosyasının baytları değiştirilmeden yeniden adlandırılmış kopyasıdır; bu çalışma sırasında indirilmedi veya yeniden kodlanmadı. Bu yerel dosya için eser sahibi veya yeniden dağıtım lisansı sağlanmamıştır; fotoğrafların CC BY-SA 4.0 lisansı videoyu kapsamaz. Yerel klibin alt bölümdeki YouTube kaydıyla aynı eser olduğu doğrulanmamıştır. Kamuya yeniden dağıtımdan önce kullanım hakları doğrulanmalıdır.

## İçerik Kaynakları

- [Kültür ve Turizm Bakanlığı, Ulu Cami envanteri](https://www.kulturportali.gov.tr/turkiye/elazig/kulturenvanteri/ulu-cami225546)
- [Elazığ İl Kültür ve Turizm Müdürlüğü, Harput](https://elazig.ktb.gov.tr/TR-187349/harput.html)
- [Elazığ gezi rehberi](https://elazig.ktb.gov.tr/Eklenti/66342%2Celazig-gezi-rehberi-2019pdf.pdf?0=)
- [Fırat Üniversitesi, Harput araştırmaları](https://web.firat.edu.tr/harput/ulu_camii.html)

## Yarışma

Yönergedeki kaynaklı araştırma ve özgün ekip markası çalışması korunmalıdır. Footer'da aynen `GakCoding örnek çalışmasıdır` ibaresi bulunur. Gerçek firma markası veya coğrafi işaret amblemi kullanılmaz. Genel ürün/sipariş şeması, bu kültürel miras konusu için zorunlu bir e-ticaret akışı olarak uygulanmamıştır.

Yerel tarayıcıda beş durak, fotoğraf geçişi, ışık, düşey referans, tam ekran ve video oynatma kontrol edildi. Mobil ve tablet yerleşimleri incelendi. Gerçek telefonda dokunma, WebGL kapalı cihaz ve sayısal performans ölçümleri ayrıca doğrulanmalıdır.
