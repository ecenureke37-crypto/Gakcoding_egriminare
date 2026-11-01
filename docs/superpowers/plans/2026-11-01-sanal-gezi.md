# Sanal Gezi Implementation Plan

**Goal:** Cami ve yakın çevresinde insan göz hizasında kaynaklı, duraklatılabilir bir ziyaret rotası.

**Architecture:** Mevcut Three.js ve OrbitControls korunur. Bağımsız gezi oynatıcısı zaman çizelgesini ve güvenli kamera yolunu yönetir; uygulama bu pozları kameraya uygular. Normal model keşfi ve gezi ayrı durumlardır.

**Tech Stack:** Yerel Three.js r180, vanilla ES modülleri, Node.js yerleşik test çalıştırıcısı.

## İşler

- [ ] Referans ajanı gerçek iç mekân fotoğrafını ve çevre gözlemlerini doğrular; görsel lisansı manifestte tutulur.
- [ ] Mimari ajanı içeriden görünen tonoz, paye, halı, giriş kapısı ve seyrek ağaç çevresini hazırlar.
- [ ] Arayüz ajanı başlat/duraklat/önceki/sonraki/çık, zaman sürgüsü ve gerçek fotoğraf penceresini hazırlar.
- [ ] Ana ajan `dist/tour.js` oynatıcısını, testlerini ve `dist/app.js` bağlantısını uygular.
- [ ] Masaüstü ve mobilde gerçek WebGL görüntüsü, kamera hareketi, duraklar, duraklatma, fotoğraf ve çıkış akışları sınanır.

## Sınırlar

Gezi temsili bir mimari anlatımdır, ölçülü dijital ikiz değildir. Kaynak gösterilmeyen ayrıntılar tarihî gerçek olarak anlatılmaz. Ücretli servis veya yeni ağır bağımlılık eklenmez. Düşük hareket tercihinde otomatik yürüyüş başlatılmaz. GitHub'a gönderim ve yayın bu geliştirme talebinin sonrasında ayrıca raporlanır.

## Kontroller

Oynatıcı testi: duraklatınca zaman sabit; son durakta durur; aralık dışı seek sınırlandırılır; gizli sekmeden dönüşte büyük zaman sıçraması olmaz; bütün örnek pozlar sonlu ve kemer açıklıklarıyla uyumludur. UI testi: mobilde metin/sahne/kontroller çakışmaz, gezi çıkışı normal kamerayı ve kontrol yetkisini geri verir.
