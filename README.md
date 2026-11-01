# Harput Ulu Camii ve Eğri Minare

GakCoding örnek çalışmasıdır. Türkçe mimari keşif; resmî kurum sitesi, rölöve veya birebir dijital ikiz değildir.

## Çalıştırma

Node.js bulunan bu klasörde `npm start` çalıştırın. Varsayılan adres `http://127.0.0.1:5182/`.

Sunucu `0.0.0.0` üzerinde `PORT` ortam değişkenini, değişken verilmezse 5182 portunu kullanır. Haricî npm bağımlılığı ve kurulum adımı yoktur. Three.js r180, aynı sürüm OrbitControls ve Three lisansı `dist/vendor/` içinde yereldir. Ayrı bir derleme adımı yoktur; `dist/` içindeki dosyalar doğrudan geliştirilir ve sunulur.

## Proje Yapısı

- `dist/index.html`, `dist/style.css`: sayfa ve duyarlı görünüm.
- `dist/app.js`: kamera, gezi durakları ve etkileşimler.
- `dist/architecture.js`, `dist/minaret.js`: temsili 3D yapı.
- `dist/story-content.js`: kaynaklı durak açıklamaları.
- `dist/assets/`: görseller ve kaynak/lisans manifesti.
- `server.cjs`: Node.js statik dosya sunucusu.

Geliştirme bu GitHub reposu üzerinden sürdürülür. Barındırma servisi Node.js çalıştırıyorsa başlangıç komutu `npm start`; statik barındırma kullanılıyorsa yayın klasörü `dist/` olur. Yayınlama bu sürüme dahil değildir.

## Deneyim

Beş durak aynı kamera, açıklama ve fotoğraf durumunu yönetir: **Bütün yapı**, **Avlu**, **Harim**, **Tuğla işçiliği**, **Şerefe**. 3D ile kaynak fotoğrafı arasında geçiş yapılabilir. Bakış sürgüsü ve sürükleme, düşey referans, akşam ışığı, sıfırlama ve tam ekran kontrolleri bulunur. Harita bağlantısı Harput Ulu Camii/Elazığ hedefini kullanır.

Kaynaklı hikâye, gerçek avlu fotoğrafı ve resmî drone filmi sayfada ayrı bölümlerdedir. Drone filmi ancak kullanıcı açtığında YouTube iframe'i içinde yüklenir; video dosyası indirilmez ve arka planda otomatik oynatılmaz.

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
| `dist/assets/stone-surface.jpg` | `cami.jpg` ile aynı Dosseman/9621 fotoğrafı | Taş duvar bölgesi kırpıldı, dört yöne aynalanarak tekrar edebilir yüzey türetildi. Türev görsel de CC BY-SA 4.0 kapsamındadır. |

Repoda optimize edilmiş görseller bulunur. Görsel künyeleri sayfada, makine okunur kayıtlar `dist/assets/asset-manifest.json` içindedir. Lisans, fotoğrafçı, kaynak ve değişiklik bilgisini yeni dağıtımlarda koruyun.

[Drone filmi](https://www.youtube.com/watch?v=jeS2PVqWVcQ): Elazığ İl Kültür ve Turizm Müdürlüğü, 2021. YouTube gömme oynatıcısı üzerinden sunulur; yerel bir video varlığı veya CC BY-SA fotoğraf lisansının parçası değildir.

## İçerik Kaynakları

- [Kültür ve Turizm Bakanlığı, Ulu Cami envanteri](https://www.kulturportali.gov.tr/turkiye/elazig/kulturenvanteri/ulu-cami225546)
- [Elazığ İl Kültür ve Turizm Müdürlüğü, Harput](https://elazig.ktb.gov.tr/TR-187349/harput.html)
- [Elazığ gezi rehberi](https://elazig.ktb.gov.tr/Eklenti/66342%2Celazig-gezi-rehberi-2019pdf.pdf?0=)
- [Fırat Üniversitesi, Harput araştırmaları](https://web.firat.edu.tr/harput/ulu_camii.html)

## Yarışma

Yönergedeki kaynaklı araştırma ve özgün ekip markası çalışması korunmalıdır. Footer'da aynen `GakCoding örnek çalışmasıdır` ibaresi bulunur. Gerçek firma markası veya coğrafi işaret amblemi kullanılmaz. Genel ürün/sipariş şeması, bu kültürel miras konusu için zorunlu bir e-ticaret akışı olarak uygulanmamıştır.

Yerel tarayıcıda beş durak, fotoğraf geçişi, ışık, düşey referans, tam ekran ve video oynatma kontrol edildi. Mobil ve tablet yerleşimleri incelendi. Gerçek telefonda dokunma, WebGL kapalı cihaz ve sayısal performans ölçümleri ayrıca doğrulanmalıdır.
