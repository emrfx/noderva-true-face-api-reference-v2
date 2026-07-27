# Bütünlük Modeli

V2 arayüzünde görülen ortalama koruma skoru dört işlenmiş varyantın aritmetik ortalamasıdır. Kimlik drift değeri, ortalama koruma kaybının düşük-is-better biçiminde normalize edilmiş karşılığıdır.

Tarayıcıdaki `integrity.js` şu sinyalleri üretir:

- parlaklık ve kontrast özeti
- 16 kovalı luminance histogramı
- kenar yoğunluğu
- yaklaşık renk canlılığı
- doğal yatay simetri skoru
- geometri, doku, ton, kimlik ve drift karşılaştırması

Üretim modelinde bu istatistikler; yüz algılama güveni, 71 anatomik landmark, kemik yapısı benzerliği, çene/burun profili ve kimlik embedding mesafesiyle birleştirilmelidir. Hiçbir tek skor tek başına biyometrik kimlik doğrulama kararı olarak kullanılmamalıdır.
