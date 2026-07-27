# Test Senaryoları

## Yapısal

1. Beş karşılaştırma kartı görünür.
2. Altı analiz modülü bulunur.
3. API Request ve Quality Metrics panelleri sağ sütundadır.
4. Recent Requests tablosu en altta görünür.
5. Hiçbir harici script, font veya görsel kaynağı kullanılmaz.

## Etkileşim

1. JPG, PNG veya WEBP seçildiğinde karşılaştırma kartları yerel önizlemeyi gösterir.
2. 10 MB üstü dosya reddedilir.
3. Run Analysis skorları, drift değerini, request ID'yi ve geçmiş tablosunu günceller.
4. Sol menü analiz kartlarına odaklanır.
5. History, Batch, Usage, Docs ve Settings ayrıntı pencereleri açılır.
6. Mobil menü 980 px altında açılır/kapanır.

## Algoritmik

1. Aynı piksel özetleri en az 99 kimlik skoru üretir.
2. Büyük histogram ve kontrast farkı kimlik skorunu düşürür.
3. Histogram 16 kova döndürür.
4. Politika doğrulama 70-100 dışındaki eşikleri reddeder.

Otomatik doğrulama: `node tests/smoke-test.cjs`
