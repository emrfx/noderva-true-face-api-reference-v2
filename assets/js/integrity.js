(function () {
  "use strict";

  const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
  const round = (value, digits = 1) => Number(value.toFixed(digits));

  function luminance(r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function summarizePixels(data, width, height) {
    if (!data || !data.length || !width || !height) throw new Error("Geçerli piksel verisi gerekli.");
    const count = width * height;
    const stride = Math.max(1, Math.floor(count / 50000));
    let sampled = 0;
    let sum = 0;
    let sumSq = 0;
    let edges = 0;
    let color = 0;
    let previous = null;
    const histogram = new Array(16).fill(0);

    for (let p = 0; p < count; p += stride) {
      const i = p * 4;
      const y = luminance(data[i], data[i + 1], data[i + 2]);
      sum += y;
      sumSq += y * y;
      color += Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);
      histogram[Math.min(15, Math.floor(y / 16))] += 1;
      if (previous !== null && Math.abs(y - previous) > 22) edges += 1;
      previous = y;
      sampled += 1;
    }

    const mean = sum / sampled;
    const variance = Math.max(0, sumSq / sampled - mean * mean);
    return {
      width,
      height,
      sampled,
      brightness: round(mean),
      contrast: round(Math.sqrt(variance)),
      edgeDensity: round((edges / sampled) * 100, 2),
      colorfulness: round(color / sampled),
      histogram: histogram.map((value) => round(value / sampled, 4))
    };
  }

  function symmetryScore(data, width, height) {
    if (!data || !data.length || width < 2 || height < 2) return 0;
    const stepX = Math.max(1, Math.floor(width / 120));
    const stepY = Math.max(1, Math.floor(height / 120));
    let diff = 0;
    let pairs = 0;
    for (let y = 0; y < height; y += stepY) {
      for (let x = 0; x < width / 2; x += stepX) {
        const left = (y * width + x) * 4;
        const right = (y * width + (width - 1 - x)) * 4;
        diff += Math.abs(luminance(data[left], data[left + 1], data[left + 2]) - luminance(data[right], data[right + 1], data[right + 2]));
        pairs += 1;
      }
    }
    const naturalDifference = pairs ? diff / pairs : 255;
    return round(clamp(100 - Math.abs(naturalDifference - 14) * 1.4));
  }

  function compareSummaries(original, processed, policy) {
    const p = policy || { threshold: 92, drift: 2.4, smoothing: 18, texture: 84 };
    const brightnessDelta = Math.abs(original.brightness - processed.brightness);
    const contrastDelta = Math.abs(original.contrast - processed.contrast);
    const edgeDelta = Math.abs(original.edgeDensity - processed.edgeDensity);
    const colorDelta = Math.abs(original.colorfulness - processed.colorfulness);
    const histogramDelta = original.histogram.reduce((sum, value, index) => sum + Math.abs(value - processed.histogram[index]), 0);

    const geometry = clamp(100 - edgeDelta * 2.2 - histogramDelta * 18);
    const texture = clamp(100 - edgeDelta * 4.1 - contrastDelta * 0.65);
    const tone = clamp(100 - brightnessDelta * 0.75 - colorDelta * 0.2);
    const identity = clamp(geometry * 0.46 + texture * 0.31 + tone * 0.23);
    const drift = round(clamp((100 - identity) / 3.4, 0, 99), 2);

    return {
      identity: round(identity),
      geometry: round(geometry),
      texture: round(texture),
      tone: round(tone),
      drift,
      pass: identity >= p.threshold && drift <= p.drift,
      violations: [
        identity < p.threshold ? `Kimlik skoru politika eşiğinin altında (${round(identity)} < ${p.threshold}).` : null,
        drift > p.drift ? `Tahmini geometri sapması toleransı aşıyor (%${drift} > %${p.drift}).` : null,
        texture < p.texture ? `Mikro doku korunumu hedefin altında (${round(texture)} < ${p.texture}).` : null
      ].filter(Boolean)
    };
  }

  function weightedScore(metrics) {
    if (!Array.isArray(metrics) || !metrics.length) return 0;
    const weights = { identity: 0.28, geometry: 0.24, landmarks: 0.18, texture: 0.13, asymmetry: 0.1, contour: 0.07 };
    let sum = 0;
    let total = 0;
    metrics.forEach((item) => {
      const weight = weights[item.id] || 1 / metrics.length;
      sum += clamp(Number(item.value) || 0) * weight;
      total += weight;
    });
    return round(sum / total);
  }

  function validatePolicy(policy) {
    const errors = [];
    if (!policy || !String(policy.name || "").trim()) errors.push("Politika adı gerekli.");
    if (Number(policy.threshold) < 70 || Number(policy.threshold) > 100) errors.push("Kimlik eşiği 70–100 arasında olmalı.");
    if (Number(policy.drift) < 0.2 || Number(policy.drift) > 8) errors.push("Sapma toleransı %0.2–%8 arasında olmalı.");
    if (Number(policy.smoothing) < 0 || Number(policy.smoothing) > 50) errors.push("Yumuşatma limiti %0–%50 arasında olmalı.");
    return { valid: errors.length === 0, errors };
  }

  function createManifest(session, metrics, policy) {
    return {
      schema: "noderva.trueface.manifest/v1",
      generatedAt: new Date().toISOString(),
      session: session.id,
      source: { name: session.source, dimensions: session.dimensions, hash: session.hash },
      policy: { id: policy.id, name: policy.name, code: policy.code, threshold: policy.threshold },
      result: { score: weightedScore(metrics), status: weightedScore(metrics) >= policy.threshold ? "pass" : "review", metrics },
      privacy: { processing: "local-browser", uploaded: false, retained: false }
    };
  }

  window.TRUEFACE_INTEGRITY = { clamp, round, luminance, summarizePixels, symmetryScore, compareSummaries, weightedScore, validatePolicy, createManifest };
})();
