# True-Face API Reference V2 — Mimari

## Ürün katmanları

1. **Sunum katmanı:** Referanstaki siyah navigasyon, beyaz analiz çalışma alanı, karşılaştırma kartları ve skor panelleri `index.html` ile tanımlanır.
2. **Etkileşim katmanı:** `app.js`; yükleme, analiz simülasyonu, request geçmişi, mobil menü ve ayrıntı pencerelerini yönetir.
3. **Veri katmanı:** `data.js`; kalite metrikleri, politika eşikleri, geçmiş istekler ve dokümantasyon içeriğini taşır.
4. **Bütünlük katmanı:** `integrity.js`; piksel özetleme, histogram, simetri ve benzerlik hesaplarını saf fonksiyonlar olarak sunar.
5. **Yerel durum:** `store.js`; kullanıcının demo ayarlarını yalnızca tarayıcıdaki `localStorage` alanında tutar.

## İstemci akışı

```text
Görsel seçimi
  └─ MIME / 10 MB kontrolü
      └─ Geçici object URL
          ├─ 5 varyant karşılaştırması
          ├─ Kalite ve koruma skoru üretimi
          ├─ Identity drift hesabı
          └─ Recent Requests kaydı
```

## Üretim servisi için önerilen topoloji

```text
API Gateway
  ├─ Kimlik ve kota doğrulama
  ├─ Yükleme imzası
  └─ Request yönlendirme
       ├─ Face Detection Worker
       ├─ Landmark / Anatomy Worker
       ├─ Identity Preservation Worker
       └─ Quality Audit Worker
            └─ Signed Result Manifest + Webhook
```

Ham kaynaklar kısa ömürlü, şifreli ve bölgesel tutulmalıdır. Landmark çıktıları ile biyometrik olabilecek türevler ayrı erişim politikalarına bağlanmalı; tamamlanan işlerin kaynak dosyaları otomatik silinmelidir.
