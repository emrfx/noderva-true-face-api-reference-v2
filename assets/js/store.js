(function () {
  "use strict";
  const KEY = "noderva_trueface_v1";
  const defaults = {
    theme: "dark",
    activePolicy: "strict",
    settings: {
      localOnly: true,
      retainOriginal: true,
      auditLog: true,
      autoExportManifest: false,
      reduceMotion: false,
      textureThreshold: 90,
      geometryThreshold: 96,
      smoothingLimit: 8
    },
    notes: "",
    customPolicies: [],
    recentScans: []
  };

  function read() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { ...defaults, ...parsed, settings: { ...defaults.settings, ...(parsed.settings || {}) } };
    } catch (_) {
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  let state = read();
  function commit() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* private mode */ }
    return state;
  }

  window.TRUEFACE_STORE = {
    get: () => state,
    set(patch) { state = { ...state, ...patch }; return commit(); },
    setSettings(patch) { state.settings = { ...state.settings, ...patch }; return commit(); },
    addScan(scan) {
      state.recentScans = [scan, ...state.recentScans].slice(0, 12);
      return commit();
    },
    addPolicy(policy) {
      state.customPolicies = [policy, ...state.customPolicies.filter((item) => item.id !== policy.id)];
      return commit();
    },
    reset() { state = JSON.parse(JSON.stringify(defaults)); return commit(); }
  };
})();
