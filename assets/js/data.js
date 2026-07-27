(function () {
  "use strict";

  const quality = [
    { icon: "◉", label: "Overall Image Quality", value: "93.6 / 100", numeric: 93.6 },
    { icon: "▣", label: "Face Detection Confidence", value: "99.2%", numeric: 99.2 },
    { icon: "⌖", label: "Landmark Confidence", value: "98.1%", numeric: 98.1 },
    { icon: "♙", label: "Pose Consistency", value: "97.4%", numeric: 97.4 },
    { icon: "☼", label: "Illumination Consistency", value: "94.8%", numeric: 94.8 },
    { icon: "◒", label: "Occlusion Level", value: "2.1%", numeric: 97.9 },
    { icon: "⌗", label: "Resolution Adequacy", value: "95.7%", numeric: 95.7 },
    { icon: "≋", label: "Noise Level", value: "3.3%", numeric: 96.7 }
  ];

  const requests = [
    { id: "tfc_live_8f7a2c19", time: "Today, 09:42:18 AM", images: 5, level: "Comprehensive", drift: 4.8, score: 94.1, status: "Completed" },
    { id: "tfc_live_3c9b7d11", time: "Today, 09:15:33 AM", images: 4, level: "Comprehensive", drift: 6.2, score: 92.7, status: "Completed" },
    { id: "tfc_live_a12d4e77", time: "Yesterday, 05:33:21 PM", images: 5, level: "Quick", drift: 7.9, score: 91.3, status: "Completed" }
  ];

  const policies = [
    { id: "comprehensive", name: "Comprehensive Identity", code: "TFC-ID-01", threshold: 90, drift: 8, smoothing: 18, texture: 86 },
    { id: "forensic", name: "Forensic Structure", code: "TFC-AN-02", threshold: 95, drift: 5, smoothing: 8, texture: 92 },
    { id: "quick", name: "Quick Validation", code: "TFC-QK-03", threshold: 85, drift: 12, smoothing: 24, texture: 78 }
  ];

  const metrics = [
    { id: "identity", label: "Identity Preservation", value: 94.1 },
    { id: "geometry", label: "Structural Similarity", value: 96.3 },
    { id: "landmarks", label: "Landmark Confidence", value: 98.1 },
    { id: "texture", label: "Micro-Asymmetry", value: 94.7 },
    { id: "asymmetry", label: "Profile Correlation", value: 97.1 },
    { id: "contour", label: "Jawline Match", value: 95.6 }
  ];

  const dialogContent = {
    history: {
      title: "Analysis History",
      intro: "Trace every identity analysis request, model decision and exported report.",
      cards: requests.map((item) => ({ label: item.id, title: `${item.score}% preservation`, text: `${item.time} · ${item.images} images · ${item.level}` }))
    },
    batch: {
      title: "Batch Jobs",
      intro: "Process larger image sets with one shared preservation policy and a single audit trail.",
      cards: [
        { label: "RUNNING", title: "Editorial Set / 36 images", text: "28 completed · 8 remaining · estimated 41 seconds" },
        { label: "QUEUED", title: "Archive Recovery / 120 images", text: "Forensic Structure policy · starts after current job" },
        { label: "COMPLETED", title: "Campaign Portraits / 48 images", text: "Average preservation 95.4% · 2 flagged for review" },
        { label: "AUTOMATION", title: "Webhook Delivery", text: "Signed results are delivered as each image completes." }
      ]
    },
    quota: {
      title: "Usage & Quotas",
      intro: "Enterprise capacity and request usage for the active workspace.",
      cards: [
        { label: "REQUESTS", title: "2.45M / 10M", text: "24.5% of the current monthly request quota used." },
        { label: "STORAGE", title: "184 GB / 2 TB", text: "Encrypted result manifests and temporary derivatives." },
        { label: "CONCURRENCY", title: "18 / 50 workers", text: "32 processing slots are currently available." },
        { label: "RESET", title: "12 days", text: "Quotas reset automatically at the next billing window." }
      ]
    },
    docs: {
      title: "True-Face API Docs",
      intro: "Core endpoints and production integration notes for identity-preserving image workflows.",
      cards: [
        { label: "POST", title: "/v1/analyze/identity", text: "Runs comprehensive preservation analysis across one or more images." },
        { label: "POST", title: "/v1/analyze/anatomy", text: "Returns 71 landmarks, bone structure similarity and profile correlation." },
        { label: "GET", title: "/v1/requests/{id}", text: "Reads scores, metrics, status and the signed audit manifest." },
        { label: "WEBHOOK", title: "analysis.completed", text: "Delivers request results to your verified HTTPS endpoint." }
      ]
    },
    settings: {
      title: "Workspace Settings",
      intro: "Model, retention and delivery defaults for this local product demonstration.",
      cards: [
        { label: "MODEL", title: "v2.4.1 Stable", text: "Default identity analysis model for all new requests." },
        { label: "RETENTION", title: "Zero source retention", text: "Source images are discarded after in-browser analysis." },
        { label: "REGION", title: "EU / Frankfurt", text: "Selected API residency for metadata and signed manifests." },
        { label: "SECURITY", title: "Signed requests", text: "HMAC signatures and rotating API keys are enabled." }
      ]
    }
  };

  window.TRUEFACE_DATA = {
    version: "2.0.0",
    session: {
      id: "tfc_live_8f7a2c19",
      source: "identity_source.png",
      dimensions: "2048 × 2048",
      hash: "f73e9c36ad1145dd8a2f3f7fbdf8016b",
      score: 94.1
    },
    metrics,
    policies,
    quality,
    requests,
    dialogContent
  };
})();
