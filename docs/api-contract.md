# True-Face API Sözleşmesi

## `POST /v1/analyze/identity`

Bir kaynak ve en fazla dört işlenmiş görüntü üzerinde kimlik koruma analizi çalıştırır.

```json
{
  "analysis_level": "comprehensive",
  "model": "v2.4.1",
  "images": [
    { "role": "original", "content": "base64://..." },
    { "role": "processed", "operation": "style_transfer", "content": "base64://..." }
  ],
  "return": ["landmarks", "structure", "profile", "quality", "audit_manifest"]
}
```

### Örnek yanıt

```json
{
  "request_id": "tfc_live_8f7a2c19",
  "status": "completed",
  "identity_preservation": {
    "average": 94.1,
    "minimum": 91.4,
    "maximum": 96.2,
    "drift_percent": 4.8
  },
  "anatomy": {
    "landmark_count": 71,
    "landmark_confidence": 98.1,
    "structural_similarity": 96.3,
    "jawline_match": 95.6,
    "nose_match": 97.1
  },
  "quality_score": 95.2
}
```

## Diğer uçlar

- `POST /v1/analyze/anatomy`: Landmark, profil ve kemik yapısı değerlendirmesi.
- `POST /v1/batch/identity`: Çoklu iş kuyruğu oluşturur.
- `GET /v1/requests/{id}`: İstek durumu ve imzalı sonuç manifesti.
- `GET /v1/usage`: Kota, depolama ve eşzamanlı worker kullanımı.

## Hata modeli

- `400 invalid_payload`
- `401 unauthorized`
- `413 image_too_large`
- `415 unsupported_media_type`
- `422 face_not_detected`
- `429 rate_limited`
- `503 model_unavailable`

Yerel V2 prototipi ağ çağrısı yapmaz; ürün akışını tarayıcı içinde simüle eder.
