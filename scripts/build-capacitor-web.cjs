const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "www");
const entries = [
  "index.html",
  "styles.css",
  "game.js",
  "manifest.webmanifest",
  "Asssets",
];

function copyRecursive(source, target) {
  if (path.basename(source) === "originals_with_bg") {
    return;
  }
  const stats = fs.statSync(source);
  if (stats.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  copyRecursive(path.join(root, entry), path.join(outDir, entry));
}

console.log(`Capacitor web files copied to ${outDir}`);
