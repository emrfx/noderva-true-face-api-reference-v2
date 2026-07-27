const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const memory = new Map();
global.window = global;
global.localStorage = {
  getItem: (key) => memory.has(key) ? memory.get(key) : null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key)
};

for (const file of ["data.js", "integrity.js", "store.js"]) {
  vm.runInThisContext(fs.readFileSync(path.join(root, "assets", "js", file), "utf8"), { filename: file });
}

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets", "css", "app.css"), "utf8");
const app = fs.readFileSync(path.join(root, "assets", "js", "app.js"), "utf8");

assert(index.includes("Identity Preservation Analysis"), "Reference dashboard title is missing.");
assert((index.match(/class="portrait-card/g) || []).length === 5, "Five image comparison cards are required.");
assert((index.match(/class="analysis-card/g) || []).length === 6, "Six analysis modules are required.");
assert(index.includes("API Request") && index.includes("Quality Metrics"), "Right-side analysis panels are missing.");
assert(index.includes("Recent Requests"), "Recent Requests table is missing.");
assert(css.includes("@media (max-width: 520px)"), "Mobile breakpoint is missing.");
assert(app.includes("runAnalysis") && app.includes("setUploadedImage"), "Interactive analysis flow is missing.");
assert(!/https?:\/\//.test(index), "Application HTML must not depend on external resources.");

for (const ref of [...index.matchAll(/(?:src|href)="([^"?#]+)"/g)].map((match) => match[1])) {
  if (ref.startsWith("#")) continue;
  assert(fs.existsSync(path.join(root, ref)), `Missing local file: ${ref}`);
}

const sample = new Uint8ClampedArray(8 * 8 * 4);
for (let i = 0; i < sample.length; i += 4) {
  const value = (i / 4 * 17) % 255;
  sample[i] = value; sample[i + 1] = Math.min(255, value + 10); sample[i + 2] = Math.max(0, value - 8); sample[i + 3] = 255;
}
const summary = TRUEFACE_INTEGRITY.summarizePixels(sample, 8, 8);
const same = TRUEFACE_INTEGRITY.compareSummaries(summary, summary, TRUEFACE_DATA.policies[0]);
assert(summary.histogram.length === 16, "Pixel summary must produce 16 histogram buckets.");
assert(same.identity >= 99 && same.pass, "Identical images must pass identity validation.");
assert(TRUEFACE_DATA.quality.length === 8, "Eight quality metrics are required.");
assert(TRUEFACE_DATA.requests.length >= 3, "Request history seed is incomplete.");

console.log("True-Face API Reference V2 smoke test: PASS");
console.log(JSON.stringify({ comparisonCards: 5, analysisModules: 6, qualityMetrics: TRUEFACE_DATA.quality.length, requestRows: TRUEFACE_DATA.requests.length, identicalScore: same.identity }, null, 2));
