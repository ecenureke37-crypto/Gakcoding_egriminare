const inventory = 'https://www.kulturportali.gov.tr/turkiye/elazig/kulturenvanteri/ulu-cami225546';
const localCulture = 'https://elazig.ktb.gov.tr/TR-187349/harput.html';

export const chapters = {
  whole: {
    label: 'Bütün yapı',
    title: 'Bir minareden daha fazlası.',
    paragraph: 'Harput Ulu Camii, 1156-1157 yıllarında Artuklu hükümdarı Fahreddin Karaarslan döneminde yapılmış kabul edilir. Eğri Minare, avlusu ve harimiyle yaşayan bu yapının şehirden görünen işaretidir.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Ulu Cami envanteri',
    confidence: 'Yüksek; tarihlendirme kaynakta genel kabul olarak veriliyor.'
  },
  courtyard: {
    label: 'Avlu',
    title: 'Duvarların içinde gökyüzü.',
    paragraph: 'Dıştaki taş kütlenin içinde bir açık avlu bulunur. Çevresindeki revaklar, avlu ile kapalı ibadet alanı arasında bir geçiş oluşturur. Yapıyı anlamak, yalnızca dış siluetine bakmaktan fazlasıdır.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Ayrıntılı tanım',
    confidence: 'Yüksek; avlu ve revaklar envanterde açıkça tanımlanıyor.'
  },
  interior: {
    label: 'Harim',
    title: 'Mekânı taşıyan ritim.',
    paragraph: 'Harim, mihraba paralel uzanan iki sahından oluşur. Kütlesel payeler ve beşik tonozlar iç mekânın ritmini kurar; mihrap önündeki kubbe bu düzenden ayrılır. Bu kesit ilişkileri sadeleştirerek gösterir.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Harim ve örtü sistemi',
    confidence: 'Yüksek; görsel model temsili olup ölçüm değildir.'
  },
  brick: {
    label: 'Tuğla',
    title: 'İki malzeme, bir yapı.',
    paragraph: 'Kalın duvarlarda moloz taş; kemerlerde, revaklarda, kubbede ve minarede tuğla kullanılır. Minareye yaklaşınca malzemenin yalnızca taşıyıcı değil, yapının görsel kimliğini de kurduğu fark edilir.',
    source: localCulture,
    sourceLabel: 'Elazığ İl Kültür ve Turizm Müdürlüğü',
    confidence: 'Yüksek; malzeme bilgisi resmî kaynakta mevcut.'
  },
  balcony: {
    label: 'Şerefe',
    title: 'Zamanın eklediği katman.',
    paragraph: 'Envanter, minarenin şerefeden yukarı bölümünün restore edildiğini kaydeder. Bugün gördüğümüz siluet, tarihî malzeme kadar koruma çalışmalarının da izlerini taşır.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Genel tanım',
    confidence: 'Yüksek; restorasyonun kapsamı dışında ayrıntı eklenmedi.',
    note: 'Yarışma föyünde eğim için kaynaklara göre 3,5-7 derece aralığı ve farklı nedenler aktarılır. Bu model açı ölçümü veya neden kanıtı değildir.'
  }
};

export const facts = [
  {
    id: 'artuklu',
    title: 'Artuklu döneminden bir iz',
    text: 'Yapının 1156-1157 tarihlerinde Fahreddin Karaarslan döneminde inşa edildiği genel kabul görür.',
    source: inventory,
    sourceLabel: 'Kültür Portalı',
    confidence: 'Yüksek; kaynak tarihlendirmedeki görüş farklılığını da belirtir.'
  },
  {
    id: 'courtyard',
    title: 'İçe açılan avlu',
    text: 'Cami, dış duvarların içinde açık avlu ve onu çevreleyen revaklar barındırır.',
    source: inventory,
    sourceLabel: 'Kültür Portalı',
    confidence: 'Yüksek'
  },
  {
    id: 'material',
    title: 'Taş ile tuğlanın birlikteliği',
    text: 'Duvarlar moloz taştandır; kemerler, revaklar, kubbe ve minarede tuğla kullanılmıştır.',
    source: localCulture,
    sourceLabel: 'Elazığ İl Kültür ve Turizm Müdürlüğü',
    confidence: 'Yüksek'
  },
  {
    id: 'minbar',
    title: 'Yer değiştiren minber',
    text: 'Caminin kündekârî ahşap minberi önce Sarahatun, ardından Harput Kurşunlu Camii’ne taşınmıştır.',
    source: localCulture,
    sourceLabel: 'Elazığ İl Kültür ve Turizm Müdürlüğü',
    confidence: 'Yüksek; mevcut konum ziyaret öncesi ayrıca doğrulanmalı.'
  },
  {
    id: 'restoration',
    title: 'Siluette bir koruma izi',
    text: 'Resmî envanter, minarenin şerefeden üst bölümünün restore edildiğini belirtir.',
    source: inventory,
    sourceLabel: 'Kültür Portalı',
    confidence: 'Yüksek; özgün ve yenilenen parçaların ayrıntılı sınırı bu modelde gösterilmez.'
  }
];
