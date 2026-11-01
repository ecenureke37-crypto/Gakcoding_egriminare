const inventory = 'https://www.kulturportali.gov.tr/turkiye/elazig/kulturenvanteri/ulu-cami225546';
const localCulture = 'https://elazig.ktb.gov.tr/TR-187349/harput.html';
const academic = 'https://isamveri.org/pdfdrg/D03965/2014_2/2014_2_UZUNC.pdf';
const encyclopedia = 'https://islamansiklopedisi.org.tr/ulucami#25-harput-ulucamii';
const mulberryLegend = 'https://www.kulturportali.gov.tr/turkiye/elazig/kulturatlasi/secde-eden-dut-agaci-efsanesi';

export const chapters = {
  whole: {
    label: 'Bütün yapı',
    title: 'Bir minareden daha fazlası.',
    paragraph: 'Harput Ulu Camii genellikle 1156-1157 yıllarına, Fahreddin Karaarslan dönemine tarihlenir. Eğri Minare, avlu ve harim aynı yapının parçalarıdır.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Ulu Cami envanteri',
    confidence: 'Yüksek; tarihlendirme kaynakta genel kabul olarak veriliyor.'
  },
  courtyard: {
    label: 'Avlu',
    title: 'Duvarların içinde gökyüzü.',
    paragraph: 'Dış duvarların içinde revaklarla çevrili tarihî bir açık avlu bulunur. Fotoğraflardaki modern koruma örtüsü, yapının sonraki katmanıdır.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Ayrıntılı tanım',
    confidence: 'Yüksek; avlu ve revaklar envanterde açıkça tanımlanıyor.'
  },
  interior: {
    label: 'Harim',
    title: 'Mekânı taşıyan ritim.',
    paragraph: 'Mihraba paralel iki sahın, kütlesel payeler ve beşik tonozlar harimi biçimlendirir. Mihrap önünde kubbe yükselir. Sanal mekân bu ilişkilerin temsili yorumudur.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Harim ve örtü sistemi',
    confidence: 'Yüksek; görsel model temsili olup ölçüm değildir.'
  },
  brick: {
    label: 'Tuğla',
    title: 'İki malzeme, bir yapı.',
    paragraph: 'Moloz taş duvarlarla tuğla kemer, örtü ve minare bir aradadır. Minarenin geometrik örgüsü, malzemeyi aynı zamanda bezemeye dönüştürür.',
    source: localCulture,
    sourceLabel: 'Elazığ İl Kültür ve Turizm Müdürlüğü',
    confidence: 'Yüksek; malzeme bilgisi resmî kaynakta mevcut.'
  },
  balcony: {
    label: 'Şerefe',
    title: 'Zamanın eklediği katman.',
    paragraph: 'Minarenin şerefeden yukarısı restore edilmiştir. Bugünkü siluet, tarihî yapı kadar onarım dönemlerinin de izlerini taşır.',
    source: inventory,
    sourceLabel: 'Kültür Portalı · Genel tanım',
    confidence: 'Yüksek; restorasyonun kapsamı dışında ayrıntı eklenmedi.',
    note: 'Eğim açısı ve Pisa karşılaştırması için aynı yöntemle yapılmış ölçüm doğrulanmadı. Sanal model açı ölçümü değildir.'
  },
  mulberry: {
    label: 'Eğik dut',
    title: 'Mihrabın ardındaki Ulu Ağaç.',
    paragraph: 'Dut ağacı, mihrabın dışındaki güney kıble duvarına bitişiktir. Kadir Gecesi minareyle birlikte secde edercesine eğildiği anlatısı tarihsel bir olay değil, Harput sözlü kültüründe yaşayan bir rivayettir.',
    source: mulberryLegend,
    sourceLabel: 'Kültür Portalı · Secde Eden Dut Ağacı Efsanesi',
    confidence: 'Konum resmî kaynaklarla uyumludur; secde anlatısı halk anlatısıdır.'
  }
};

export const facts = [
  {
    id: 'artuklu',
    title: 'Artuklu döneminden bir iz',
    text: '1156-1157 ve Fahreddin Karaarslan tarihlendirmesi genel kabuldür; erken evreler hakkında farklı görüşler vardır.',
    source: academic,
    sourceLabel: 'Celalettin Uzun · 2014, s. 31',
    confidence: 'Tartışmalı tarihlendirme; genel kabul olarak sunuluyor.'
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
    text: 'Tarihî ahşap minber, Sarahatun’da kullanıldıktan sonra Kurşunlu Camii’ne taşınmıştır. Buradaki sanal minber özgün eserin birebir kopyası değildir.',
    source: academic,
    sourceLabel: 'Celalettin Uzun · 2014, s. 32',
    confidence: 'Tarihî nakil kaydı yüksek; güncel konum yerinde kontrol edilmedi.'
  },
  {
    id: 'restoration',
    title: 'Siluette bir koruma izi',
    text: 'Resmî envanter, minarenin şerefeden üst bölümünün restore edildiğini belirtir.',
    source: inventory,
    sourceLabel: 'Kültür Portalı',
    confidence: 'Yüksek; özgün ve yenilenen parçaların ayrıntılı sınırı bu modelde gösterilmez.'
  },
  {
    id: 'names',
    title: 'Bir yapının farklı adları',
    text: 'Cami-i Kebir, Cami-i Muazzam, Cami-i Azam ve Eğri Minareli Cami adlarıyla da anılır.',
    source: localCulture,
    sourceLabel: 'Elazığ İl Kültür ve Turizm Müdürlüğü',
    confidence: 'Yüksek; tarihî adlar arşiv atıflı akademik çalışmada da yer alır.'
  },
  {
    id: 'repairs',
    title: 'Yüzyıllara yayılan bakım',
    text: '1899, 1905, 1964-1967 ve 2000’li yıllardaki onarımlar yapının bugünkü görünümünü etkilemiştir.',
    source: encyclopedia,
    sourceLabel: 'TDV İslâm Ansiklopedisi · Abdüsselam Uluçam',
    confidence: 'Yüksek; güncel bir restorasyon takvimi değildir.'
  },
  {
    id: 'inscription',
    title: 'Taşa yazılmış bir yönetim kaydı',
    text: 'Avlunun kuzeyindeki kitabe, akademik yayınlarda vergi fermanı olarak tanımlanır. Yapım tarihi için tek ve kesin kanıt sayılmaz.',
    source: encyclopedia,
    sourceLabel: 'TDV İslâm Ansiklopedisi · Harput Ulucamii',
    confidence: 'Kitabenin niteliği yüksek; tarih okuması ve yapımla ilişkisi tartışmalı.'
  }
];

export const narratives = [
  {
    id: 'evliya',
    kind: 'Tarihî tanıklık',
    title: 'Bir seyyahın bakışı',
    text: 'Evliya Çelebi, Harput ziyaretinde caminin büyüklüğünü, güzelliğini ve minaresini anlatır.',
    source: academic,
    sourceLabel: 'Uzun, 2014, s. 32; Seyahatnâme, 3. Kitap, 1999, s. 135’e atıf',
    confidence: 'Akademik aktarım; özgün Seyahatnâme nüshası bu çalışmada incelenmedi.'
  },
  {
    id: 'mulberry',
    kind: 'Halk anlatısı',
    title: 'Eğilen dut ve minare',
    text: 'Yerel rivayette iki arkadaş, bir Kadir Gecesi dut ağacıyla minarenin eğilip doğrulduğunu görür. Sır anlatılınca ikisinin de eğik kaldığı söylenir.',
    source: localCulture,
    sourceLabel: 'Elazığ İl Kültür ve Turizm Müdürlüğü · rivayet aktarımı',
    confidence: 'Sözlü kültür kaydıdır; minarenin eğilmesinin bilimsel açıklaması değildir.'
  }
];
