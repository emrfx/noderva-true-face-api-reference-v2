# NODERVA True-Face API — Reference UI V2

Bu sürüm, NODERVA Software ana sitesindeki `true-face-api.png` ürün görseli esas alınarak baştan oluşturuldu. Arayüz yalnızca statik bir ekran görüntüsü değildir; dosya yükleme, analiz çalıştırma, skor üretme, istek geçmişi, navigasyon ve ayrıntı pencereleri çalışır.

## Başlatma

- `BASLAT.html` veya `index.html` dosyasını çift tıklayın.
- Harici sunucu ya da paket kurulumu gerekmez.
- Uygulama tamamen yerel dosyalardan çalışır.

## Ana özellikler

- Referanstaki siyah sol navigasyon + beyaz analiz konsolu düzeni
- Original ve dört processed görüntü karşılaştırması
- 71 anatomik landmark görselleştirmesi
- Bone structure consistency ve profil eşleşme modülleri
- Micro-asymmetry, identity drift ve preservation summary
- API request paneli ve yerel görsel yükleme
- Gerçek zamanlı skor, drift, kalite ve request ID güncellemesi
- Recent Requests tablosu
- History, Batch Jobs, Usage, Docs ve Settings ayrıntı pencereleri
- Tablet ve mobil cihazlar için responsive navigasyon
- `prefers-reduced-motion` erişilebilirlik desteği

## Klavye

- `Ctrl + Enter`: analizi çalıştırır
- `Esc`: mobil menüyü kapatır

## Teknik yapı

- `index.html`: ürün arayüzü ve SVG analiz grafikleri
- `assets/css/app.css`: referans uyumlu tasarım ve responsive davranış
- `assets/js/data.js`: örnek analiz verileri ve ürün içeriği
- `assets/js/app.js`: kullanıcı etkileşimleri ve dinamik analiz akışı
- `assets/js/integrity.js`: yerel piksel özetleme / bütünlük hesapları
- `assets/js/store.js`: tarayıcı içi yerel durum deposu
- `docs/`: API, mimari, güvenlik ve test dokümanları
- `tests/smoke-test.cjs`: yapısal ve algoritmik doğrulama

## Gizlilik

Yüklenen görsel demo içinde sunucuya gönderilmez. Tarayıcı içinde geçici bir object URL ile gösterilir; sayfa kapanınca kaynak serbest bırakılır. Bu prototip, üretim ortamında gerçek biyometrik karar mekanizması yerine kullanılmamalıdır.
