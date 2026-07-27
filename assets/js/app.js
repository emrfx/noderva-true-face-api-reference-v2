(function () {
  "use strict";

  const data = window.TRUEFACE_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let toastTimer;

  const state = {
    file: null,
    analysisCount: 0,
    requests: data.requests.slice(),
    scores: [96.2, 91.4, 95.1, 93.7]
  };

  function toast(message) {
    const node = $("#toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 2600);
  }

  function createLandmarks() {
    const group = $("#landmark-dots");
    const micro = $("#micro-dots");
    const points = [];
    for (let row = 0; row < 8; row += 1) {
      const y = 74 + row * 18;
      const width = 34 + row * 3;
      const count = row < 2 ? 7 : 9;
      for (let index = 0; index < count; index += 1) {
        const x = 110 - width + (width * 2 * index / (count - 1));
        const curve = Math.abs(index - (count - 1) / 2) * 1.15;
        points.push([x, y + curve]);
      }
    }
    points.slice(0, 71).forEach(([x, y], index) => {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x.toFixed(1));
      dot.setAttribute("cy", y.toFixed(1));
      dot.setAttribute("r", index % 5 === 0 ? "2.1" : "1.5");
      dot.setAttribute("class", "landmark-dot");
      group.appendChild(dot);
    });
    [[81,129],[88,136],[96,142],[102,130],[76,143],[139,128],[132,138],[124,144],[145,146],[118,132],[85,155],[136,156]].forEach(([x,y]) => {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x); dot.setAttribute("cy", y); dot.setAttribute("r", "2"); dot.setAttribute("class", "micro-dot"); micro.appendChild(dot);
    });
  }

  function renderQuality() {
    $("#quality-list").innerHTML = data.quality.map((item) => `<li><i>${item.icon}</i><span>${item.label}</span><b>${item.value}</b></li>`).join("");
  }

  function renderRequests() {
    $("#requests-body").innerHTML = state.requests.slice(0, 6).map((item) => `
      <tr>
        <td>${item.id}</td><td>${item.time}</td><td>${item.images}</td><td>${item.level}</td>
        <td>${item.drift.toFixed(1)}%</td><td>${item.score.toFixed(1)}%</td><td class="status">${item.status}</td>
      </tr>`).join("");
  }

  function mean(values) { return values.reduce((sum, value) => sum + value, 0) / values.length; }
  function standardDeviation(values) {
    const average = mean(values);
    return Math.sqrt(mean(values.map((value) => (value - average) ** 2)));
  }

  function updateScores(scores, drift, quality) {
    state.scores = scores;
    $$(".score-tag").forEach((tag, index) => {
      tag.dataset.score = scores[index].toFixed(1);
      tag.textContent = `${scores[index].toFixed(1)}%`;
    });
    const average = mean(scores);
    $("#average-score").textContent = `${average.toFixed(1)}%`;
    $("#min-score").textContent = `${Math.min(...scores).toFixed(1)}%`;
    $("#max-score").textContent = `${Math.max(...scores).toFixed(1)}%`;
    $("#std-score").textContent = `${standardDeviation(scores).toFixed(1)}%`;
    $("#drift-value").textContent = `${drift.toFixed(1)}%`;
    $("#drift-ring").style.setProperty("--drift-angle", `${(drift * 3.6).toFixed(2)}deg`);
    $("#quality-score").innerHTML = `${quality.toFixed(1)} <em>/ 100</em>`;
    $("#structural-score").textContent = `${Math.min(99.2, average + 2.2).toFixed(1)}%`;
    return average;
  }

  function setUploadedImage(file) {
    if (!file || !file.type.startsWith("image/")) {
      toast("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("Image exceeds the 10 MB limit.");
      return;
    }
    state.file = file;
    const url = URL.createObjectURL(file);
    $$(".portrait-stage").forEach((stage, index) => {
      stage.style.backgroundImage = `linear-gradient(${index ? "rgba(255,255,255,.08),rgba(255,255,255,.08)" : "rgba(0,0,0,.12),rgba(0,0,0,.12)"}),url('${url}')`;
      stage.style.backgroundSize = "cover";
      stage.style.backgroundPosition = "center";
      const svg = $("svg", stage);
      if (svg) svg.style.opacity = index === 0 ? ".23" : ".16";
    });
    const trigger = $("#upload-trigger");
    trigger.classList.add("has-file");
    $("#upload-label").textContent = file.name;
    toast("Image staged for local analysis.");
  }

  function randomRequestId() {
    const suffix = Math.random().toString(16).slice(2, 10).padEnd(8, "0");
    return `tfc_live_${suffix}`;
  }

  async function runAnalysis() {
    const button = $("#run-analysis");
    if (button.classList.contains("loading")) return;
    button.classList.add("loading");
    $("#analysis-status").classList.add("loading");
    $("#analysis-status").textContent = "ANALYZING";

    await wait(420);
    $$(".portrait-card").forEach((card, index) => setTimeout(() => card.animate([
      { opacity: .5, transform: "translateY(5px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 420, fill: "both", easing: "ease-out" }), index * 130));
    await wait(1050);

    const level = $("#analysis-level").value;
    const base = level === "Quick" ? 90.8 : level === "Standard" ? 92.4 : 94.2;
    const fileVariance = state.file ? (state.file.size % 250000) / 250000 : Math.random();
    const scores = [2.1, -2.5, 1.0, -.4].map((offset, index) => Math.max(78, Math.min(99.3, base + offset + Math.sin(fileVariance * 8 + index) * 1.1)));
    const drift = Math.max(1.8, 100 - mean(scores) + .7);
    const quality = Math.min(99, mean(scores) + 1.2);
    const average = updateScores(scores, drift, quality);
    const id = randomRequestId();
    state.analysisCount += 1;
    $("#request-id").textContent = id;
    $("#request-time").textContent = "Just now";
    $("#analysis-status").classList.remove("loading");
    $("#analysis-status").textContent = "✓ COMPLETED";
    state.requests.unshift({ id, time: "Just now", images: Number($("#image-count").value), level, drift, score: average, status: "Completed" });
    renderRequests();
    const used = 2.45 + state.analysisCount * .01;
    $("#used-count").textContent = `${used.toFixed(2)}M`;
    $("#quota-fill").style.width = `${used * 10}%`;
    button.classList.remove("loading");
    toast(`Analysis complete · ${average.toFixed(1)}% identity preservation.`);
  }

  function focusSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("flash-focus");
    setTimeout(() => target.classList.remove("flash-focus"), 1200);
    if (innerWidth <= 980) closeMobileMenu();
  }

  function openDialog(key) {
    const info = data.dialogContent[key];
    if (!info) return;
    $("#dialog-content").innerHTML = `<h2>${info.title}</h2><p>${info.intro}</p><div class="dialog-grid">${info.cards.map((card) => `<article class="dialog-card"><small>${card.label}</small><strong>${card.title}</strong><p>${card.text}</p></article>`).join("")}</div>`;
    $("#detail-dialog").showModal();
  }

  function openMobileMenu() {
    $("#sidebar").classList.add("open");
    $("#mobile-backdrop").classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeMobileMenu() {
    $("#sidebar").classList.remove("open");
    $("#mobile-backdrop").classList.remove("show");
    document.body.style.overflow = "";
  }

  function bindEvents() {
    $("#analysis-toggle").addEventListener("click", () => {
      $("#analysis-menu").classList.toggle("collapsed");
      $("#analysis-toggle").classList.toggle("expanded");
    });
    $$('[data-focus]').forEach((button) => button.addEventListener("click", () => focusSection(button.dataset.focus)));
    $$('[data-modal]').forEach((button) => button.addEventListener("click", () => openDialog(button.dataset.modal)));
    $$('[data-target="overview"]').forEach((button) => button.addEventListener("click", () => focusSection("overview")));
    $$(".submenu button").forEach((button) => button.addEventListener("click", () => {
      $$(".submenu button").forEach((item) => item.classList.remove("active")); button.classList.add("active");
    }));
    $("#upload-trigger").addEventListener("click", () => $("#image-input").click());
    $("#image-input").addEventListener("change", (event) => setUploadedImage(event.target.files[0]));
    $("#run-analysis").addEventListener("click", runAnalysis);
    $("#view-all").addEventListener("click", () => openDialog("history"));
    $("#dialog-close").addEventListener("click", () => $("#detail-dialog").close());
    $("#mobile-menu").addEventListener("click", openMobileMenu);
    $("#mobile-backdrop").addEventListener("click", closeMobileMenu);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") runAnalysis();
    });
  }

  createLandmarks();
  renderQuality();
  renderRequests();
  bindEvents();
})();
