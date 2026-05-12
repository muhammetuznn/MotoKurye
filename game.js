"use strict";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const screens = {
  menu: document.getElementById("menu"),
  shop: document.getElementById("shop"),
  gameOver: document.getElementById("gameOver"),
};

const ui = {
  bestScore: document.getElementById("bestScore"),
  bestPackages: document.getElementById("bestPackages"),
  walletCoins: document.getElementById("walletCoins"),
  shopCoins: document.getElementById("shopCoins"),
  shopNotice: document.getElementById("shopNotice"),
  shopItems: document.getElementById("shopItems"),
  motorsTab: document.getElementById("motorsTab"),
  citiesTab: document.getElementById("citiesTab"),
  recordsList: document.getElementById("recordsList"),
  finalDistance: document.getElementById("finalDistance"),
  finalDeliveries: document.getElementById("finalDeliveries"),
  finalCoins: document.getElementById("finalCoins"),
  startBtn: document.getElementById("startBtn"),
  shopBtn: document.getElementById("shopBtn"),
  closeShopBtn: document.getElementById("closeShopBtn"),
  settingsPanel: document.getElementById("settingsPanel"),
  settingsBtn: document.getElementById("settingsBtn"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),
  soundToggle: document.getElementById("soundToggle"),
  musicToggle: document.getElementById("musicToggle"),
  restartBtn: document.getElementById("restartBtn"),
  goShopBtn: document.getElementById("goShopBtn"),
  backMenuBtn: document.getElementById("backMenuBtn"),
  orientationPanel: document.getElementById("orientationPanel"),
  portraitStartBtn: document.getElementById("portraitStartBtn"),
};


const STORAGE_KEY = "kacakKuryeSave";
const SETTINGS_KEY = "kacakKuryeSettings";
const WORLD = {
  width: 960,
  height: 540,
  roadY: 430,
  gravity: 760,
  lift: -420,
  maxFall: 620,
  startSpeed: 205,
};
const MAX_PARTICLES = 130;
const DELIVERY_MILESTONES = [5, 10, 20, 30, 50, 75, 100];

const assets = loadAssets({
  courier: "Asssets/kurye.png",
  car: "Asssets/araç.png",
  bird: "Asssets/leylek.png",
  cat: "Asssets/kedi.png",
  pothole: "Asssets/cukur.png",
  barrier: "Asssets/zabıta.png",
  trash: "Asssets/cöpkovasi.png",
  delivery: "Asssets/teslimat.png",
  cloud: "Asssets/bulut.png",
});

const motorAssets = loadAssets({
  motor1: "Asssets/motors/motor-01.png",
  motor2: "Asssets/motors/motor-02.png",
  motor3: "Asssets/motors/motor-03.png",
  motor4: "Asssets/motors/motor-04.png",
  motor5: "Asssets/motors/motor-05.png",
  motor6: "Asssets/motors/motor-06.png",
  motor7: "Asssets/motors/motor-07.png",
  motor8: "Asssets/motors/motor-08.png",
  motor9: "Asssets/motors/motor-09.png",
  motor10: "Asssets/motors/motor-10.png",
}, { removeBackground: true, tolerance: 58 });

const cityAssets = loadAssets({
  istanbul: "Asssets/cities/istanbul.png",
  newYork: "Asssets/cities/new-york.png",
  mexicoCity: "Asssets/cities/mexico-city.png",
  tokyo: "Asssets/cities/tokyo.png",
  dubai: "Asssets/cities/dubai.png",
});

const powerupAssets = loadAssets({
  magnet: "Asssets/powerups/miknatis.png",
});

const cities = [
  {
    id: "istanbul",
    asset: "istanbul",
    name: "İstanbul Gece",
    price: 0,
    desc: "Başlangıç şehri. Islak asfalt, apartmanlar, dar sokak hissi.",
    skyTop: "#071327",
    skyMid: "#10243d",
    skyBottom: "#07101f",
    far: "#152b45",
    near: "#1d3651",
    road: "#1f2630",
    roadLine: "rgba(255,255,255,0.34)",
    window: "rgba(255, 199, 92, 0.45)",
    moon: true,
  },
  {
    id: "newYork",
    asset: "newYork",
    name: "New York City",
    price: 12000,
    desc: "Yüksek binalar, soğuk mavi gece ve yoğun şehir ışıkları.",
    skyTop: "#06111f",
    skyMid: "#13263f",
    skyBottom: "#050a14",
    far: "#16263d",
    near: "#23364f",
    road: "#222833",
    roadLine: "rgba(255,255,255,0.38)",
    window: "rgba(255, 224, 134, 0.62)",
    moon: true,
    spire: true,
  },

  
  {
    id: "mexicoCity",
    asset: "mexicoCity",
    name: "Mexico City",
    price: 18000,
    desc: "Sıcak mor/turuncu gece, alçak binalar ve canlı sokak ışığı.",
    skyTop: "#1a1027",
    skyMid: "#412044",
    skyBottom: "#160b1c",
    far: "#3a2850",
    near: "#5a334c",
    road: "#2a2429",
    roadLine: "rgba(255, 205, 120, 0.34)",
    window: "rgba(255, 176, 82, 0.58)",
    moon: false,
    sunGlow: "#ff9f43",
  },
  {
    id: "tokyo",
    asset: "tokyo",
    name: "Tokyo Neon",
    price: 26000,
    desc: "Neon renkleri, keskin silüetler ve hızlı gece temposu.",
    skyTop: "#08061c",
    skyMid: "#1f1644",
    skyBottom: "#090512",
    far: "#181f4a",
    near: "#2b275d",
    road: "#20202b",
    roadLine: "rgba(99, 255, 218, 0.36)",
    window: "rgba(255, 77, 216, 0.5)",
    moon: true,
  },
  {
    id: "dubai",
    asset: "dubai",
    name: "Dubai Altın Hat",
    price: 36000,
    desc: "Altın şehir ışıkları ve daha parlak yol yansımaları.",
    skyTop: "#0a1424",
    skyMid: "#2c2443",
    skyBottom: "#110d16",
    far: "#2a3448",
    near: "#493b51",
    road: "#28252d",
    roadLine: "rgba(255, 220, 130, 0.42)",
    window: "rgba(255, 205, 93, 0.68)",
    moon: false,
    sunGlow: "#ffd166",
    spire: true,
  },
];

const motors = [
  {
    id: "motor1",
    asset: "motor1",
    name: "Başlangıç Scooter",
    unlockPackages: 0,
    price: 0,
    desc: "Dengeli ve güvenilir başlangıç motoru.",
    color: "#ef4e45",
    accent: "#ffd06a",
    speed: 1,
    power: 1,
  },
  {
    id: "motor2",
    asset: "motor2",
    name: "Eski Kurye Motoru",
    unlockPackages: 4,
    price: 750,
    desc: "İlk ciddi teslimat hedefinden sonra açılır.",
    color: "#78a083",
    accent: "#e5b45c",
    speed: 2,
    power: 2,
  },
  {
    id: "motor3",
    asset: "motor3",
    name: "Neon Gece Motoru",
    unlockPackages: 8,
    price: 1600,
    desc: "Gece temposu için hızlı ama hassas.",
    color: "#2de2e6",
    accent: "#f6019d",
    speed: 4,
    power: 2,
  },
  {
    id: "motor4",
    asset: "motor4",
    name: "Altın Paket Motoru",
    unlockPackages: 14,
    price: 3000,
    desc: "Daha yüksek hız, daha iyi ivme.",
    color: "#f6c84c",
    accent: "#fff0a6",
    speed: 5,
    power: 4,
  },
  {
    id: "motor5",
    asset: "motor5",
    name: "Sahil Motoru",
    unlockPackages: 22,
    price: 5200,
    desc: "Yumuşak kontrol, orta hız.",
    color: "#44d7b6",
    accent: "#65c7ff",
    speed: 4,
    power: 6,
  },
  {
    id: "motor6",
    asset: "motor6",
    name: "Sanayi Canavarı",
    unlockPackages: 34,
    price: 8500,
    desc: "Ağır ama güçlü çıkış verir.",
    color: "#9ca3af",
    accent: "#ffb238",
    speed: 5,
    power: 7,
  },
  {
    id: "motor7",
    asset: "motor7",
    name: "Gece Roketi",
    unlockPackages: 50,
    price: 13500,
    desc: "Hızlı koşular için agresif seçim.",
    color: "#8b5cf6",
    accent: "#f6019d",
    speed: 8,
    power: 5,
  },
  {
    id: "motor8",
    asset: "motor8",
    name: "Yağmur Kaçkını",
    unlockPackages: 70,
    price: 20000,
    desc: "Yağmurda daha az hız kaybeder.",
    color: "#2563eb",
    accent: "#93c5fd",
    speed: 7,
    power: 7,
    rainResist: 0.55,
  },
  {
    id: "motor9",
    asset: "motor9",
    name: "Turbo Paket",
    unlockPackages: 95,
    price: 30000,
    desc: "Turbo etkisini daha iyi taşır.",
    color: "#f97316",
    accent: "#fde047",
    speed: 9,
    power: 7,
    turboBonus: 0.07,
  },
  {
    id: "motor10",
    asset: "motor10",
    name: "Efsane Kurye",
    unlockPackages: 125,
    price: 48000,
    desc: "En üst seviye hız ve güç.",
    color: "#f6c84c",
    accent: "#ffffff",
    speed: 10,
    power: 10,
    rainResist: 0.45,
    turboBonus: 0.1,
  },
];

const obstacleTypes = [
  { id: "door", label: "Kapı", asset: "car", w: 150, h: 104, ground: true, minDistance: 0, damage: true },
  { id: "seagull", label: "Martı", asset: "bird", w: 96, h: 68, air: true, minDistance: 260, damage: true },
  { id: "cat", label: "Kedi", asset: "cat", w: 104, h: 66, jumper: true, minDistance: 240, damage: true },
  { id: "pothole", label: "Çukur", asset: "pothole", w: 112, h: 48, ground: true, minDistance: 0, damage: true },
  { id: "barrier", label: "Zabıta", asset: "barrier", w: 128, h: 82, ground: true, minDistance: 170, damage: true },
  { id: "trash", label: "Çöp Kovası", asset: "trash", w: 74, h: 82, ground: true, minDistance: 360, damage: true },
  { id: "cloud", label: "Yağmur", asset: "cloud", w: 132, h: 96, air: true, minDistance: 480, damage: false },
];

let save = loadSave();
let settings = loadSettings();
let state = "menu";
let lastTime = 0;
let inputDown = false;
let game = createGame();
let shopTab = "motors";
let shopNoticeTimeout = 0;
let audioCtx = null;
let audioUnlocked = false;
let engineAudio = null;
let musicAudio = null;
let pendingLandscapeStart = false;
const cityBackgroundCache = new Map();
let camera = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  viewW: WORLD.width,
  viewH: WORLD.height,
};

function loadSave() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed && typeof parsed === "object") {
      const equippedMotor = parsed.equippedMotor || migrateMotorId(parsed.equippedSkin) || "motor1";
      return {
        coins: Number(parsed.coins) || 0,
        bestScore: Number(parsed.bestScore) || 0,
        bestPackages: Number(parsed.bestPackages) || 0,
        equippedMotor,
        ownedMotors: normalizeOwnedMotors(parsed.ownedMotors, equippedMotor),
        ownedCities: normalizeOwnedCities(parsed.ownedCities),
        equippedCity: parsed.equippedCity || "istanbul",
        records: normalizeRecords(parsed.records),
      };
    }
  } catch {
    // Ignore corrupt saves and start clean.
  }
  return {
    coins: 0,
    bestScore: 0,
    bestPackages: 0,
    equippedMotor: "motor1",
    ownedMotors: ["motor1"],
    ownedCities: ["istanbul"],
    equippedCity: "istanbul",
    records: [],
  };
}

function migrateMotorId(oldId) {
  const map = { red: "motor1", old: "motor2", neon: "motor3", gold: "motor4" };
  return map[oldId] || "";
}

function normalizeRecords(records) {
  if (!Array.isArray(records)) return [];
  return records
    .map((record) => ({
      distance: Number(record.distance) || 0,
      packages: Number(record.packages) || 0,
      coins: Number(record.coins) || 0,
      motor: record.motor || "motor1",
      date: record.date || "",
    }))
    .sort(compareRecords)
    .slice(0, 5);
}

function normalizeOwnedCities(ownedCities) {
  const owned = Array.isArray(ownedCities) ? ownedCities : ["istanbul"];
  return Array.from(new Set(["istanbul", ...owned.filter((id) => cities.some((city) => city.id === id))]));
}

function normalizeOwnedMotors(ownedMotors, equippedMotor) {
  const owned = Array.isArray(ownedMotors) ? ownedMotors : [];
  const valid = owned.filter((id) => motors.some((motor) => motor.id === id));
  if (equippedMotor && motors.some((motor) => motor.id === equippedMotor)) {
    valid.push(equippedMotor);
  }
  return Array.from(new Set(["motor1", ...valid]));
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (parsed && typeof parsed === "object") {
      return {
        sound: parsed.sound !== false,
        music: parsed.music !== false,
      };
    }
  } catch {
    // Ignore corrupt settings and use defaults.
  }
  return { sound: true, music: true };
}

function persistSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function formatNumber(value) {
  return Math.floor(Number(value) || 0).toLocaleString("tr-TR");
}

function showShopNotice(message, tone = "ok") {
  if (!ui.shopNotice) return;
  window.clearTimeout(shopNoticeTimeout);
  ui.shopNotice.textContent = message;
  ui.shopNotice.classList.toggle("is-warning", tone === "warning");
  ui.shopNotice.classList.add("is-visible");
  shopNoticeTimeout = window.setTimeout(() => {
    ui.shopNotice.classList.remove("is-visible");
  }, 1800);
}

function createGame() {
  return {
    player: {
      x: 168,
      y: WORLD.roadY - 112,
      w: 136,
      h: 96,
      vy: -160,
      tilt: 0,
      rainTimer: 0,
      shield: 0,
      turboTimer: 0,
      magnetTimer: 0,
      grounded: false,
      crashVx: 0,
      crashVy: 0,
      crashSpin: 0,
    },
    distance: 0,
    score: 0,
    runCoins: 0,
    deliveries: 0,
    combo: 0,
    speed: WORLD.startSpeed,
    startGrace: 1.4,
    spawnTimer: 2.05,
    coinTimer: 0.7,
    powerTimer: 5.5,
    checkpointTarget: 300,
    obstacles: [],
    coins: [],
    powerups: [],
    checkpoints: [],
    particles: [],
    iconBursts: [],
    crashing: false,
    crashTimer: 0,
    crashDuration: 0,
    screenShake: 0,
    message: "",
    messageTimer: 0,
    messageDuration: 0,
    celebratedMilestones: [],
    lastObstacleId: "",
    lastAirThreatDistance: 0,
    nearMisses: 0,
  };
}

function loadAssets(manifest, options = {}) {
  const loaded = {};
  for (const [key, source] of Object.entries(manifest)) {
    const image = new Image();
    image.onload = () => {
      if (options.removeBackground) {
        prepareTransparentAsset(image, options.tolerance || 52);
      }
      if (state !== "playing" && ui.shopItems) renderShop();
    };
    image.onerror = () => {
      image.datasetFailed = "true";
    };
    image.src = encodeURI(source);
    loaded[key] = image;
  }
  return loaded;
}

function prepareTransparentAsset(image, tolerance) {
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!width || !height) return;
  const work = document.createElement("canvas");
  work.width = width;
  work.height = height;
  const workCtx = work.getContext("2d", { willReadFrequently: true });
  workCtx.drawImage(image, 0, 0);
  let pixels;
  try {
    pixels = workCtx.getImageData(0, 0, width, height);
  } catch {
    return;
  }
  const data = pixels.data;
  const edgeColor = averageEdgeColor(data, width, height);
  const visited = new Uint8Array(width * height);
  const stack = [];
  const pushIfBackground = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const point = y * width + x;
    if (visited[point]) return;
    const index = point * 4;
    if (data[index + 3] < 8 || colorDistance(data, index, edgeColor) <= tolerance) {
      visited[point] = 1;
      stack.push(point);
    }
  };
  for (let x = 0; x < width; x += 1) {
    pushIfBackground(x, 0);
    pushIfBackground(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    pushIfBackground(0, y);
    pushIfBackground(width - 1, y);
  }
  while (stack.length) {
    const point = stack.pop();
    const x = point % width;
    const y = Math.floor(point / width);
    const index = point * 4;
    const distance = colorDistance(data, index, edgeColor);
    data[index + 3] = distance > tolerance - 10 ? Math.min(data[index + 3], 72) : 0;
    pushIfBackground(x + 1, y);
    pushIfBackground(x - 1, y);
    pushIfBackground(x, y + 1);
    pushIfBackground(x, y - 1);
  }
  removeInteriorBackgroundPixels(data, width, height, edgeColor, tolerance);
  softenTransparentEdges(data, width, height);
  workCtx.putImageData(pixels, 0, 0);
  image.processedCanvas = work;
  image.processedSrc = work.toDataURL("image/png");
}

function removeInteriorBackgroundPixels(data, width, height, edgeColor, tolerance) {
  const strictTolerance = tolerance * 0.72;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = (y * width + x) * 4;
      if (data[index + 3] < 8) continue;
      if (colorDistance(data, index, edgeColor) > strictTolerance) continue;
      const whiteness = (data[index] + data[index + 1] + data[index + 2]) / 3;
      const colorSpread = Math.max(data[index], data[index + 1], data[index + 2]) - Math.min(data[index], data[index + 1], data[index + 2]);
      const looksLikePlainBackground = whiteness > 210 && colorSpread < 34;
      if (!looksLikePlainBackground) continue;
      data[index + 3] = 0;
    }
  }
}

function averageEdgeColor(data, width, height) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const add = (x, y) => {
    const index = (y * width + x) * 4;
    if (data[index + 3] < 16) return;
    r += data[index];
    g += data[index + 1];
    b += data[index + 2];
    count += 1;
  };
  for (let x = 0; x < width; x += 1) {
    add(x, 0);
    add(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    add(0, y);
    add(width - 1, y);
  }
  return count ? [r / count, g / count, b / count] : [255, 255, 255];
}

function colorDistance(data, index, color) {
  const dr = data[index] - color[0];
  const dg = data[index + 1] - color[1];
  const db = data[index + 2] - color[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function softenTransparentEdges(data, width, height) {
  const alpha = new Uint8ClampedArray(width * height);
  for (let i = 0; i < alpha.length; i += 1) {
    alpha[i] = data[i * 4 + 3];
  }
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const point = y * width + x;
      const index = point * 4;
      if (alpha[point] === 0) continue;
      const hasTransparentNeighbor =
        alpha[point - 1] === 0 ||
        alpha[point + 1] === 0 ||
        alpha[point - width] === 0 ||
        alpha[point + width] === 0;
      if (hasTransparentNeighbor) {
        data[index + 3] = Math.min(data[index + 3], 205);
      }
    }
  }
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = viewportWidth();
  const height = viewportHeight();
  document.documentElement.style.setProperty("--app-height", `${height}px`);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function toWorldX(x) {
  return (x / viewportWidth()) * WORLD.width;
}

function toWorldY(y) {
  return (y / viewportHeight()) * WORLD.height;
}

function showScreen(name) {
  for (const [key, element] of Object.entries(screens)) {
    element.classList.toggle("is-visible", key === name);
  }
  state = name;
  stopEngineSound();
  stopMusicSound();
  syncUi();
}

function hideScreens() {
  for (const element of Object.values(screens)) {
    element.classList.remove("is-visible");
  }
}

function startGame() {
  unlockAudio();
  if (shouldPromptLandscape()) {
    pendingLandscapeStart = true;
    closeSettings();
    ui.orientationPanel.classList.add("is-visible");
    return;
  }
  beginGame();
}

function beginGame() {
  pendingLandscapeStart = false;
  ui.orientationPanel.classList.remove("is-visible");
  requestMobileFullscreen();
  game = createGame();
  inputDown = false;
  closeSettings();
  hideScreens();
  state = "playing";
  startEngineSound();
  startMusicSound();
}

function beginPortraitGame() {
  pendingLandscapeStart = false;
  ui.orientationPanel.classList.remove("is-visible");
  beginGame();
}

function shouldPromptLandscape() {
  return isMobileLike() && viewportWidth() < 820 && viewportHeight() > viewportWidth();
}

function handleViewportChange() {
  resizeCanvas();
  if (pendingLandscapeStart && !shouldPromptLandscape()) {
    beginGame();
  }
}

function viewportWidth() {
  return Math.floor(window.visualViewport?.width || window.innerWidth);
}

function viewportHeight() {
  return Math.floor(window.visualViewport?.height || window.innerHeight);
}

function isMobileLike() {
  return Boolean(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
}

function isMobileLandscape() {
  return isMobileLike() && viewportWidth() > viewportHeight();
}

function requestMobileFullscreen() {
  if (!isMobileLike() || document.fullscreenElement) return;
  const target = document.documentElement;
  if (target.requestFullscreen) {
    target.requestFullscreen().catch(() => {});
  }
  if (screen.orientation?.lock) {
    screen.orientation.lock("landscape").catch(() => {});
  }
}

function endGame() {
  state = "gameOver";
  stopEngineSound();
  stopMusicSound();
  save.coins += game.runCoins;
  save.bestScore = Math.max(save.bestScore, Math.floor(game.distance));
  save.bestPackages = Math.max(save.bestPackages, game.deliveries);
  save.records = normalizeRecords([
    ...(save.records || []),
    {
      distance: Math.floor(game.distance),
      packages: game.deliveries,
      coins: game.runCoins,
      motor: currentMotor().id,
      date: new Date().toISOString(),
    },
  ]);
  persist();
  ui.finalDistance.textContent = `${Math.floor(game.distance)} m`;
  ui.finalDeliveries.textContent = String(game.deliveries);
  ui.finalCoins.textContent = String(game.runCoins);
  showScreen("gameOver");
}

function syncUi() {
  ui.bestScore.textContent = `${Math.floor(save.bestScore)} m`;
  ui.bestPackages.textContent = formatNumber(save.bestPackages);
  ui.walletCoins.textContent = formatNumber(save.coins);
  ui.shopCoins.textContent = formatNumber(save.coins);
  syncSettingsUi();
  renderRecords();
  renderShop();
}

function syncSettingsUi() {
  ui.soundToggle.classList.toggle("is-off", !settings.sound);
  ui.soundToggle.querySelector("strong").textContent = settings.sound ? "Açık" : "Kapalı";
  ui.musicToggle.classList.toggle("is-off", !settings.music || !settings.sound);
  ui.musicToggle.disabled = !settings.sound;
  ui.musicToggle.querySelector("strong").textContent = settings.sound && settings.music ? "Açık" : "Kapalı";
}

function renderShop() {
  ui.shopItems.innerHTML = "";
  ui.motorsTab.classList.toggle("is-active", shopTab === "motors");
  ui.citiesTab.classList.toggle("is-active", shopTab === "cities");
  if (shopTab === "cities") {
    renderCityShop();
    return;
  }
  const motorSection = document.createElement("section");
  motorSection.className = "shop-section";
  motorSection.innerHTML = `<div class="shop-section-head"><h3>Motorlar</h3><p>Paket rekoru yükseldikçe açılır.</p></div>`;
  const motorGrid = document.createElement("div");
  motorGrid.className = "shop-grid";
  for (const motor of motors) {
    const packageReady = isMotorUnlocked(motor);
    const owned = save.ownedMotors.includes(motor.id);
    const equipped = save.equippedMotor === motor.id;
    const canBuy = packageReady && save.coins >= motor.price;
    const card = document.createElement("article");
    card.className = `shop-card${owned || canBuy ? "" : " is-locked"}`;
    const asset = motorAssets[motor.asset];
    const preview = asset && asset.complete && asset.naturalWidth > 0
      ? `<img src="${asset.processedSrc || asset.src}" alt="">`
      : `<div class="placeholder-bike" style="background: linear-gradient(135deg, ${motor.color}, ${motor.accent});"></div>`;
    const packageProgress = motor.unlockPackages === 0 ? 100 : clamp((save.bestPackages / motor.unlockPackages) * 100, 0, 100);
    const coinProgress = motor.price === 0 ? 100 : clamp((save.coins / motor.price) * 100, 0, 100);
    const remaining = Math.max(0, motor.unlockPackages - save.bestPackages);
    card.innerHTML = `
      <div class="motor-preview" style="background: linear-gradient(135deg, ${motor.color}22, ${motor.accent}33);">${preview}</div>
      <div class="motor-title-row">
        <h3>${motor.name}</h3>
        <span class="lock-badge ${owned ? "is-open" : ""}">${owned ? "GARAJDA" : packageReady ? "ALINABİLİR" : "KİLİTLİ"}</span>
      </div>
      <p>${motor.desc}</p>
      <div class="unlock-box">
        <div class="unlock-copy">
          <span>${packageReady ? "Paket şartı tamam" : "Paket rekoru şartı"}</span>
          <strong>${packageReady ? `${formatNumber(save.bestPackages)} paket` : `${formatNumber(remaining)} paket kaldı`}</strong>
        </div>
        <div class="unlock-progress"><span style="width:${packageProgress}%"></span></div>
        <small>${formatNumber(Math.min(save.bestPackages, motor.unlockPackages))} / ${formatNumber(motor.unlockPackages)} paket</small>
        <div class="unlock-copy">
          <span>${owned ? "Garajda" : "Satın alma bedeli"}</span>
          <strong>${owned ? "Kalıcı" : `${formatNumber(motor.price)} coin`}</strong>
        </div>
        <div class="unlock-progress"><span style="width:${coinProgress}%"></span></div>
        <small>${owned ? "Satın alındı" : `${formatNumber(save.coins)} / ${formatNumber(motor.price)} coin`}</small>
      </div>
      <div class="stat-bars">
        <div class="stat-line"><span>Hız</span><div class="bar"><span style="width:${motor.speed * 10}%"></span></div><strong>${motor.speed}</strong></div>
        <div class="stat-line"><span>Güç</span><div class="bar"><span style="width:${motor.power * 10}%"></span></div><strong>${motor.power}</strong></div>
      </div>
    `;
    const button = document.createElement("button");
    button.textContent = motorButtonLabel(owned, equipped, packageReady, canBuy);
    button.classList.toggle("is-equipped", equipped);
    button.disabled = equipped || (!owned && (!packageReady || !canBuy));
    button.addEventListener("click", () => {
      unlockAudio();
      playSound("ui");
      const alreadyOwned = save.ownedMotors.includes(motor.id);
      if (!alreadyOwned) {
        if (!isMotorUnlocked(motor)) {
          showShopNotice("Paket rekoru yetmiyor", "warning");
          return;
        }
        if (save.coins < motor.price) {
          showShopNotice("Coin yetersiz", "warning");
          return;
        }
        save.coins = Math.max(0, save.coins - motor.price);
        save.ownedMotors.push(motor.id);
        showShopNotice(`${motor.name} garaja eklendi: -${formatNumber(motor.price)} coin`);
        playSound("delivery");
      }
      save.equippedMotor = motor.id;
      playSound("powerup");
      persist();
      syncUi();
    });
    card.appendChild(button);
    motorGrid.appendChild(card);
  }
  motorSection.appendChild(motorGrid);
  ui.shopItems.appendChild(motorSection);
}

function motorButtonLabel(owned, equipped, packageReady, canBuy) {
  if (equipped) return "Seçili";
  if (owned) return "Seç";
  if (!packageReady) return "Kilitli";
  return canBuy ? "Satın al" : "Coin yetersiz";
}

function renderCityShop() {
  const citySection = document.createElement("section");
  citySection.className = "shop-section";
  citySection.innerHTML = `<div class="shop-section-head"><h3>Şehirler</h3><p>Pahalı şehir temaları coin ile açılır.</p></div>`;
  const cityGrid = document.createElement("div");
  cityGrid.className = "shop-grid city-grid";
  for (const city of cities) {
    const owned = save.ownedCities.includes(city.id);
    const equipped = save.equippedCity === city.id;
    const canBuy = save.coins >= city.price;
    const card = document.createElement("article");
    card.className = `shop-card city-card${owned ? "" : " is-locked"}`;
    const asset = cityAssets[city.asset];
    const preview = asset && asset.complete && asset.naturalWidth > 0
      ? `<img src="${asset.src}" alt="">`
      : `<div class="city-preview-art" style="background: linear-gradient(180deg, ${city.skyTop}, ${city.skyMid} 58%, ${city.skyBottom});">
          <span style="background:${city.far}"></span><span style="background:${city.near}"></span>
        </div>`;
    const progress = city.price === 0 ? 100 : clamp((save.coins / city.price) * 100, 0, 100);
    card.innerHTML = `
      <div class="city-preview">${preview}</div>
      <div class="motor-title-row">
        <h3>${city.name}</h3>
        <span class="lock-badge ${owned ? "is-open" : ""}">${owned ? "AÇIK" : "KİLİTLİ"}</span>
      </div>
      <p>${city.desc}</p>
      <div class="unlock-box">
        <div class="unlock-copy">
          <span>${owned ? "Şehir koleksiyonda" : "Açma bedeli"}</span>
          <strong>${owned ? "Sınırsız" : `${formatNumber(city.price)} coin`}</strong>
        </div>
        <div class="unlock-progress"><span style="width:${progress}%"></span></div>
        <small>${owned ? "Satın alındı" : `${formatNumber(save.coins)} / ${formatNumber(city.price)} coin`}</small>
      </div>
    `;
    const button = document.createElement("button");
    button.textContent = equipped ? "Seçili" : owned ? "Seç" : canBuy ? "Satın al" : "Coin yetersiz";
    button.classList.toggle("is-equipped", equipped);
    button.disabled = equipped || (!owned && !canBuy);
    button.addEventListener("click", () => {
      unlockAudio();
      playSound("ui");
      const alreadyOwned = save.ownedCities.includes(city.id);
      if (!alreadyOwned) {
        if (save.coins < city.price) {
          showShopNotice("Coin yetersiz", "warning");
          syncUi();
          return;
        }
        save.coins = Math.max(0, save.coins - city.price);
        save.ownedCities.push(city.id);
        playSound("delivery");
        showShopNotice(`${city.name} açıldı: -${formatNumber(city.price)} coin`);
      } else if (save.equippedCity !== city.id) {
        playSound("powerup");
        showShopNotice(`${city.name} seçildi`);
      }
      save.equippedCity = city.id;
      persist();
      syncUi();
    });
    card.appendChild(button);
    cityGrid.appendChild(card);
  }
  citySection.appendChild(cityGrid);
  ui.shopItems.appendChild(citySection);
}

function renderRecords() {
  if (!ui.recordsList) return;
  const records = save.records || [];
  if (records.length === 0) {
    ui.recordsList.innerHTML = `<div class="record-row"><span>-</span><strong>Henüz koşu yok</strong><span>0 m</span></div>`;
    return;
  }
  ui.recordsList.innerHTML = records
    .map((record, index) => {
      const motor = motors.find((item) => item.id === record.motor) || motors[0];
      return `<div class="record-row"><span>#${index + 1}</span><strong>${record.packages} paket</strong><span>${record.distance} m · ${motor.name}</span></div>`;
    })
    .join("");
}

function compareRecords(a, b) {
  if (b.packages !== a.packages) return b.packages - a.packages;
  return b.distance - a.distance;
}

function isMotorUnlocked(motor) {
  return save.bestPackages >= motor.unlockPackages;
}

function currentMotor() {
  const selected = motors.find((motor) => motor.id === save.equippedMotor && save.ownedMotors.includes(motor.id));
  return selected || motors[0];
}

function currentCity() {
  const selected = cities.find((city) => city.id === save.equippedCity && save.ownedCities.includes(city.id));
  return selected || cities[0];
}

function pointerDown(event) {
  if (state !== "playing") return;
  unlockAudio();
  event.preventDefault();
  const wasDown = inputDown;
  inputDown = true;
  const impulse = game.player.grounded ? WORLD.lift * 0.86 : WORLD.lift * 0.62;
  game.player.vy = Math.min(game.player.vy, impulse);
  game.player.grounded = false;
  if (!wasDown) playSound("jump");
}

function pointerUp(event) {
  if (state !== "playing") return;
  event.preventDefault();
  inputDown = false;
}

function update(dt) {
  if (state !== "playing") return;
  const g = game;
  if (g.crashing) {
    updateEngineSound(dt);
    updateCrash(dt);
    updateParticles(dt);
    updateIconBursts(dt);
    if (g.messageTimer > 0) {
      g.messageTimer -= dt;
    }
    return;
  }
  g.screenShake = Math.max(0, g.screenShake - dt * 0.8);
  const motor = currentMotor();
  const difficulty = Math.floor(g.distance / 300);
  tickPowerups(dt);
  const motorSpeed = 1 + (motor.speed - 1) * 0.055;
  const turboBoost = g.player.turboTimer > 0 ? 1.22 + (motor.turboBonus || 0) : 1;
  const rainSlow = g.player.rainTimer > 0 ? 1 - (0.34 * (motor.rainResist || 1)) : 1;
  g.speed = WORLD.startSpeed * (1 + difficulty * 0.045) * motorSpeed * turboBoost * rainSlow;
  updateEngineSound(dt);
  g.distance += (g.speed * dt) / 8;
  g.score = Math.floor(g.distance) + g.runCoins * 5 + g.deliveries * 100;

  if (g.player.rainTimer > 0) {
    g.player.rainTimer -= dt;
  }

  const motorPower = 1 + (motor.power - 1) * 0.035;
  if (inputDown && g.player.rainTimer <= 0) {
    g.player.vy += WORLD.lift * motorPower * dt * 1.95;
  } else if (inputDown) {
    g.player.vy += WORLD.lift * motorPower * dt * 0.72;
  }
  const rainGravity = g.player.rainTimer > 0 ? 1.16 + 0.08 * (motor.rainResist || 1) : 1;
  g.player.vy += WORLD.gravity * rainGravity * dt;
  g.player.vy = Math.max(Math.min(g.player.vy, WORLD.maxFall), -520);
  g.player.y += g.player.vy * dt;
  g.player.tilt = clamp(g.player.vy / 700, -0.38, 0.34);
  g.player.grounded = false;

  if (g.startGrace > 0) {
    g.startGrace -= dt;
    if (g.player.y < 36) {
      g.player.y = 36;
      g.player.vy = 40;
    }
    if (g.player.y + g.player.h > WORLD.roadY - 6) {
      g.player.y = WORLD.roadY - g.player.h - 6;
      g.player.vy = -120;
    }
  }

  if (g.player.y + g.player.h > WORLD.roadY) {
    g.player.y = WORLD.roadY - g.player.h;
    g.player.vy = Math.min(0, g.player.vy);
    g.player.tilt = 0;
    g.player.grounded = true;
  }

  if (g.player.y < 28) {
    startCrash();
    return;
  }

  g.spawnTimer -= dt;
  if (g.spawnTimer <= 0) {
    spawnObstacle();
    const pressure = clamp(g.distance / 1600, 0, 0.48);
    g.spawnTimer = random(1.78 - pressure, 2.42 - pressure);
  }

  g.coinTimer -= dt;
  if (g.coinTimer <= 0) {
    spawnCoinArc();
    g.coinTimer = random(0.85, 1.35);
  }

  g.powerTimer -= dt;
  if (g.powerTimer <= 0 && g.distance > 85) {
    spawnPowerup();
    g.powerTimer = random(7.2, 11.5);
  }

  if (g.distance >= g.checkpointTarget) {
    spawnCheckpoint();
    g.checkpointTarget += 300;
  }

  moveAndCull(g.obstacles, dt);
  moveAndCull(g.coins, dt);
  moveAndCull(g.powerups, dt);
  moveAndCull(g.checkpoints, dt);
  updateMagnet(dt);
  updateParticles(dt);
  updateIconBursts(dt);
  resolveCollections();
  resolveCollisions();

  if (g.messageTimer > 0) {
    g.messageTimer -= dt;
  }
}

function tickPowerups(dt) {
  const player = game.player;
  if (player.turboTimer > 0) player.turboTimer -= dt;
  if (player.magnetTimer > 0) player.magnetTimer -= dt;
}

function moveAndCull(items, dt) {
  for (const item of items) {
    item.x -= game.speed * dt;
    if (item.jumper) {
      updateJumpingObstacle(item, dt);
    }
    if (item.wave) {
      item.y = item.baseY + Math.sin(performance.now() / 320 + item.phase) * item.wave;
    }
  }
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (items[i].x + items[i].w < -80) {
      if (items[i].kind === "checkpoint" && !items[i].passed) {
        game.combo = 0;
      }
      items.splice(i, 1);
    }
  }
}

function updateJumpingObstacle(item, dt) {
  item.jumpTime = (item.jumpTime || 0) + dt * (item.jumpSpeed || 1);
  const cycle = item.jumpTime % 1;
  const arc = Math.sin(cycle * Math.PI);
  const lean = (cycle - 0.5) * 0.28;
  item.y = item.baseY - arc * (item.jumpHeight || 92);
  item.rotation = lean;
  item.squash = 1 - arc * 0.08;
}

function spawnObstacle() {
  let available = obstacleTypes.filter((item) => game.distance >= item.minDistance);
  if (game.distance < 650) {
    available = available.filter((item) => item.id !== "cloud" && item.id !== game.lastObstacleId);
  }
  const seagull = available.find((item) => item.id === "seagull");
  const needsAirThreat = seagull && game.distance > 420 && game.distance - game.lastAirThreatDistance > 620;
  const weighted = [];
  for (const item of available) {
    const weight = item.id === "seagull" ? 3 : item.id === "cloud" ? 1 : 2;
    for (let i = 0; i < weight; i += 1) {
      weighted.push(item);
    }
  }
  const type = needsAirThreat ? seagull : weighted[Math.floor(Math.random() * weighted.length)];
  let y = groundObstacleY(type);
  let wave = 0;
  if (type.air) {
    y = type.id === "cloud" ? random(82, 138) : random(132, 278);
    wave = game.distance > 760 && type.id !== "cloud" ? random(12, 30) : 0;
  }
  const jumpSpeed = type.jumper ? random(0.92, 1.2) : 0;
  const jumpHeight = type.jumper ? random(82, 118) : 0;
  const jumpTime = type.jumper ? random(0.05, 0.28) : 0;
  if (type.id === "seagull") {
    game.lastAirThreatDistance = game.distance;
  }
  game.lastObstacleId = type.id;
  game.obstacles.push({
    ...type,
    kind: "obstacle",
    x: WORLD.width + 70,
    y,
    baseY: y,
    wave,
    jumpSpeed,
    jumpHeight,
    jumpTime,
    rotation: 0,
    squash: 1,
    phase: random(0, Math.PI * 2),
  });
}

function groundObstacleY(type) {
  if (type.id === "pothole") return WORLD.roadY - type.h + 12;
  if (type.id === "cat") return WORLD.roadY - type.h - 6;
  if (type.id === "barrier") return WORLD.roadY - type.h - 2;
  if (type.id === "trash") return WORLD.roadY - type.h - 2;
  if (type.id === "door") return WORLD.roadY - type.h - 8;
  return WORLD.roadY - type.h;
}

function spawnCoinArc() {
  const baseY = random(145, 330);
  const count = Math.random() > 0.55 ? 4 : 3;
  for (let i = 0; i < count; i += 1) {
    game.coins.push({
      kind: "coin",
      x: WORLD.width + 60 + i * 34,
      y: baseY + Math.sin(i / Math.max(1, count - 1) * Math.PI) * -38,
      w: 24,
      h: 24,
      spin: random(0, Math.PI * 2),
    });
  }
}

function spawnPowerup() {
  const options = [
    { id: "helmet", color: "#65c7ff" },
    { id: "turbo", color: "#ffb238" },
    { id: "magnet", color: "#ef4444" },
  ];
  const type = options[Math.floor(Math.random() * options.length)];
  const y = random(150, 300);
  game.powerups.push({
    ...type,
    kind: "powerup",
    x: WORLD.width + 80,
    y,
    baseY: y,
    w: 34,
    h: 34,
    wave: 10,
    phase: random(0, Math.PI * 2),
  });
}

function spawnCheckpoint() {
  game.checkpoints.push({
    kind: "checkpoint",
    x: WORLD.width + 80,
    y: 112,
    w: 76,
    h: 260,
    passed: false,
  });
  flashMessage("Teslimat noktası!");
}

function resolveCollections() {
  const playerBox = getPlayerBox();
  for (let i = game.coins.length - 1; i >= 0; i -= 1) {
    const coin = game.coins[i];
    if (intersects(playerBox, coin)) {
      game.coins.splice(i, 1);
      game.runCoins += 1;
      playSound("coin");
      spawnSpark(coin.x + 12, coin.y + 12, "#ffd45b", 8);
    }
  }

  for (let i = game.powerups.length - 1; i >= 0; i -= 1) {
    const powerup = game.powerups[i];
    if (intersects(playerBox, powerup)) {
      game.powerups.splice(i, 1);
      applyPowerup(powerup);
      spawnSpark(powerup.x + 17, powerup.y + 17, powerup.color, 14);
    }
  }

  for (const checkpoint of game.checkpoints) {
    if (!checkpoint.passed && intersects(playerBox, checkpoint)) {
      checkpoint.passed = true;
      game.deliveries += 1;
      game.combo += 1;
      const multiplier = game.combo >= 5 ? 2 : game.combo >= 3 ? 1.5 : game.combo >= 2 ? 1.2 : 1;
      const bonus = Math.round(25 * multiplier);
      game.runCoins += bonus;
      game.score += Math.round(100 * multiplier);
      playSound("delivery");
      spawnSpark(checkpoint.x + 40, checkpoint.y + 130, "#44d7b6", 20);
      if (!maybeCelebrateDeliveryMilestone()) {
        flashMessage(`Teslimat tamam! +${bonus} coin`);
      }
    }
  }
}

function maybeCelebrateDeliveryMilestone() {
  const milestone = DELIVERY_MILESTONES.find((item) => item === game.deliveries);
  if (!milestone || game.celebratedMilestones.includes(milestone)) {
    return false;
  }
  game.celebratedMilestones.push(milestone);
  flashMessage(`${milestone} paket attın!`, 2.45);
  playSound("milestone");
  spawnConfetti(viewportWidth() / 2, viewportHeight() * 0.2, milestone >= 20 ? 42 : 28);
  game.screenShake = Math.max(game.screenShake, milestone >= 20 ? 0.14 : 0.08);
  return true;
}

function applyPowerup(powerup) {
  playSound(powerup.id === "turbo" ? "turbo" : "powerup");
  if (powerup.id === "helmet") {
    game.player.shield = 1;
    spawnIconBurst("helmet", "#65c7ff");
  } else if (powerup.id === "turbo") {
    game.player.turboTimer = 5;
    spawnIconBurst("turbo", "#ffb238");
  } else if (powerup.id === "magnet") {
    game.player.magnetTimer = 8;
    spawnIconBurst("magnet", "#ef4444");
  }
}

function updateMagnet(dt) {
  if (game.player.magnetTimer <= 0) return;
  const targetX = game.player.x + game.player.w * 0.58;
  const targetY = game.player.y + game.player.h * 0.48;
  for (const coin of game.coins) {
    const cx = coin.x + coin.w / 2;
    const cy = coin.y + coin.h / 2;
    const dx = targetX - cx;
    const dy = targetY - cy;
    const distance = Math.hypot(dx, dy);
    if (distance < 190 && distance > 1) {
      const pull = (1 - distance / 190) * 620 * dt;
      coin.x += (dx / distance) * pull;
      coin.y += (dy / distance) * pull;
    }
  }
}

function resolveCollisions() {
  if (game.crashing) return;
  const playerBox = getPlayerBox();
  for (const obstacle of game.obstacles) {
    const hitbox = obstacleHitbox(obstacle);
    if (intersects(playerBox, hitbox)) {
      if (!obstacle.damage) {
        if (!obstacle.used) {
          obstacle.used = true;
          game.player.rainTimer = 3.2;
          playSound("rain");
          spawnIconBurst("rain", "#65c7ff");
          spawnSpark(game.player.x + 62, game.player.y + 34, "#65c7ff", 14);
        }
        continue;
      }
      if (game.player.shield > 0) {
        game.player.shield = 0;
        obstacle.x = -obstacle.w - 100;
        spawnIconBurst("helmet", "#65c7ff");
        playSound("shield");
        spawnSpark(game.player.x + 42, game.player.y + 28, "#65c7ff", 22);
        game.screenShake = Math.max(game.screenShake, 0.16);
        continue;
      }
      startCrash(obstacle);
      return;
    } else if (!obstacle.nearMiss && isNearMiss(playerBox, hitbox)) {
      obstacle.nearMiss = true;
      game.nearMisses += 1;
      game.runCoins += 2;
      playSound("nearMiss");
      flashMessage("Yakın sıyrılma! +2 coin");
    }
  }
}

function isNearMiss(playerBox, hitbox) {
  const expanded = {
    x: hitbox.x - 18,
    y: hitbox.y - 18,
    w: hitbox.w + 36,
    h: hitbox.h + 36,
  };
  return intersects(playerBox, expanded);
}

function getPlayerBox() {
  return {
    x: game.player.x + 28,
    y: game.player.y + 18,
    w: game.player.w - 46,
    h: game.player.h - 30,
  };
}

function obstacleHitbox(obstacle) {
  if (obstacle.id === "pothole") {
    return { x: obstacle.x + 24, y: WORLD.roadY - 18, w: obstacle.w - 48, h: 22 };
  }
  if (obstacle.id === "door") {
    return { x: obstacle.x + 58, y: obstacle.y + 38, w: obstacle.w - 78, h: obstacle.h - 44 };
  }
  if (obstacle.id === "seagull") {
    return { x: obstacle.x + 18, y: obstacle.y + 18, w: obstacle.w - 30, h: obstacle.h - 30 };
  }
  if (obstacle.id === "cat") {
    return { x: obstacle.x + 18, y: obstacle.y + 14, w: obstacle.w - 36, h: obstacle.h - 20 };
  }
  if (obstacle.id === "cloud") {
    return { x: obstacle.x + 18, y: obstacle.y + 44, w: obstacle.w - 36, h: 118 };
  }
  if (obstacle.id === "barrier") {
    return { x: obstacle.x + 18, y: obstacle.y + 24, w: obstacle.w - 36, h: obstacle.h - 30 };
  }
  if (obstacle.id === "trash") {
    return { x: obstacle.x + 16, y: obstacle.y + 18, w: obstacle.w - 32, h: obstacle.h - 22 };
  }
  return { x: obstacle.x + 16, y: obstacle.y + 12, w: obstacle.w - 32, h: obstacle.h - 22 };
}

function flashMessage(text, duration = 1.8) {
  game.message = text;
  game.messageTimer = duration;
  game.messageDuration = duration;
}

function startCrash(obstacle = null) {
  if (game.crashing) return;
  const player = game.player;
  const hitX = obstacle ? obstacle.x + obstacle.w * 0.5 : player.x + player.w * 0.64;
  const hitY = obstacle ? obstacle.y + obstacle.h * 0.5 : player.y + player.h * 0.32;
  game.crashing = true;
  game.crashTimer = 0.78;
  game.crashDuration = 0.78;
  game.screenShake = 0.32;
  game.speed = Math.max(game.speed * 0.32, 70);
  inputDown = false;
  player.crashVx = obstacle && hitX < player.x + player.w * 0.5 ? 190 : -120;
  player.crashVy = -230;
  player.crashSpin = obstacle && obstacle.air ? 6.2 : -7.4;
  player.grounded = false;
  playSound("crash");
  flashMessage("Kaza!");
  spawnSpark(hitX, hitY, "#ff5b6e", 30);
  spawnSpark(player.x + player.w * 0.45, player.y + player.h * 0.72, "#ffb238", 18);
  spawnCrashDust(player.x + player.w * 0.52, WORLD.roadY - 8, 18);
}

function updateCrash(dt) {
  const player = game.player;
  const slowDt = dt * 0.82;
  game.crashTimer -= dt;
  game.screenShake = Math.max(0, game.screenShake - dt * 0.48);
  game.distance += (game.speed * slowDt) / 12;
  player.crashVy += WORLD.gravity * 0.92 * slowDt;
  player.x += player.crashVx * slowDt;
  player.y += player.crashVy * slowDt;
  player.tilt += player.crashSpin * slowDt;
  player.crashVx *= 1 - Math.min(0.9, dt * 1.8);
  if (player.y + player.h > WORLD.roadY + 8) {
    player.y = WORLD.roadY - player.h + 8;
    player.crashVy *= -0.22;
    player.crashSpin *= 0.72;
    spawnCrashDust(player.x + player.w * 0.58, WORLD.roadY - 5, 4);
  }
  moveAndCull(game.obstacles, slowDt * 0.45);
  moveAndCull(game.coins, slowDt * 0.45);
  moveAndCull(game.powerups, slowDt * 0.45);
  moveAndCull(game.checkpoints, slowDt * 0.45);
  if (game.crashTimer <= 0) {
    endGame();
  }
}

function spawnSpark(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    game.particles.push({
      x,
      y,
      vx: random(-110, 110),
      vy: random(-150, 40),
      life: random(0.35, 0.75),
      maxLife: 0.75,
      color,
      size: random(3, 6),
    });
  }
}

function spawnCrashDust(x, y, count) {
  for (let i = 0; i < count; i += 1) {
    game.particles.push({
      x: x + random(-26, 26),
      y: y + random(-8, 8),
      vx: random(-90, 90),
      vy: random(-70, 8),
      life: random(0.28, 0.62),
      maxLife: 0.62,
      color: "rgba(214, 198, 172, 0.82)",
      size: random(5, 11),
    });
  }
}

function spawnConfetti(screenX, screenY, count) {
  const worldX = (screenX - camera.offsetX) / Math.max(camera.scale, 0.001);
  const worldY = (screenY - camera.offsetY) / Math.max(camera.scale, 0.001);
  const colors = ["#ffb238", "#44d7b6", "#ff5b6e", "#65c7ff", "#f9fbff"];
  for (let i = 0; i < count; i += 1) {
    game.particles.push({
      x: worldX + random(-110, 110),
      y: worldY + random(-24, 18),
      vx: random(-120, 120),
      vy: random(-210, -40),
      life: random(0.7, 1.25),
      maxLife: 1.25,
      color: colors[i % colors.length],
      size: random(3, 7),
    });
  }
}

function updateParticles(dt) {
  if (game.particles.length > MAX_PARTICLES) {
    game.particles.splice(0, game.particles.length - MAX_PARTICLES);
  }
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 420 * dt;
    particle.life -= dt;
  }
  for (let i = game.particles.length - 1; i >= 0; i -= 1) {
    if (game.particles[i].life <= 0) {
      game.particles.splice(i, 1);
    }
  }
}

function spawnIconBurst(type, color) {
  game.iconBursts.push({
    type,
    color,
    x: game.player.x + game.player.w * 0.58,
    y: game.player.y + game.player.h * 0.18,
    life: 0.75,
    maxLife: 0.75,
  });
}

function updateIconBursts(dt) {
  for (const burst of game.iconBursts) {
    burst.life -= dt;
    burst.y -= 24 * dt;
  }
  for (let i = game.iconBursts.length - 1; i >= 0; i -= 1) {
    if (game.iconBursts[i].life <= 0) {
      game.iconBursts.splice(i, 1);
    }
  }
}

function render() {
  camera = computeCamera();
  const screenW = viewportWidth();
  const screenH = viewportHeight();
  ctx.save();
  ctx.clearRect(0, 0, screenW, screenH);
  ctx.fillStyle = "#071327";
  ctx.fillRect(0, 0, screenW, screenH);
  if (game.screenShake > 0) {
    const shake = game.screenShake * 18;
    ctx.translate(random(-shake, shake), random(-shake, shake));
  }
  ctx.translate(camera.offsetX, camera.offsetY);
  ctx.scale(camera.scale, camera.scale);
  drawWorld();
  ctx.restore();
  drawScreenHud();
}

function computeCamera() {
  const screenW = viewportWidth();
  const screenH = viewportHeight();
  const aspect = screenW / screenH;
  const fitScale = Math.min(screenW / WORLD.width, screenH / WORLD.height);
  let scale = fitScale;
  let offsetX = (screenW - WORLD.width * scale) / 2;
  let offsetY = (screenH - WORLD.height * scale) / 2;

  if (isMobileLandscape()) {
    scale = Math.max(screenW / WORLD.width, screenH / WORLD.height);
    offsetX = screenW * 0.25 - game.player.x * scale;
    offsetX = clamp(offsetX, screenW - WORLD.width * scale, 0);
    offsetY = screenH * 0.78 - WORLD.roadY * scale;
    offsetY = clamp(offsetY, screenH - WORLD.height * scale, 0);
  } else if (aspect < 1.2) {
    const targetViewW = aspect < 0.8 ? 460 : 560;
    scale = Math.min(screenH / (WORLD.height * 1.02), screenW / targetViewW);
    const playerScreenX = 0.28;
    offsetX = screenW * playerScreenX - game.player.x * scale;
    const minOffsetX = screenW - WORLD.width * scale;
    offsetX = clamp(offsetX, minOffsetX, 0);
    offsetY = screenH * 0.72 - WORLD.roadY * scale;
    const scaledWorldH = WORLD.height * scale;
    if (scaledWorldH < screenH) {
      offsetY = clamp(offsetY, 0, screenH - scaledWorldH);
    } else {
      offsetY = clamp(offsetY, screenH - scaledWorldH, 0);
    }
  }

  return {
    scale,
    offsetX,
    offsetY,
    viewW: screenW / scale,
    viewH: screenH / scale,
  };
}

function drawWorld() {
  drawBackground();
  drawRoad();
  drawCheckpoints();
  drawCoins();
  drawPowerups();
  drawObstacles();
  drawPlayer();
  drawParticles();
  drawIconBursts();
}

function drawBackground() {
  const city = currentCity();
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  sky.addColorStop(0, city.skyTop);
  sky.addColorStop(0.55, city.skyMid);
  sky.addColorStop(1, city.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  ctx.save();
  const asset = cityAssets[city.asset];
  if (asset && asset.complete && asset.naturalWidth > 0) {
    ctx.drawImage(getCachedCityBackground(city, asset), 0, 0);
  } else {
    ctx.filter = "blur(1px) saturate(0.84) brightness(0.8)";
    drawSkyMarker(city);
    drawCityLayer(0.18, 265, city.far, city.id === "mexicoCity" ? 52 : 70, city);
    drawCityLayer(0.36, 330, city.near, city.id === "mexicoCity" ? 72 : 92, city);
  }
  ctx.restore();
  const focusShade = ctx.createLinearGradient(0, 0, 0, WORLD.roadY);
  focusShade.addColorStop(0, "rgba(4, 8, 18, 0.2)");
  focusShade.addColorStop(0.62, "rgba(4, 8, 18, 0.27)");
  focusShade.addColorStop(1, "rgba(4, 8, 18, 0.14)");
  ctx.fillStyle = focusShade;
  ctx.fillRect(0, 0, WORLD.width, WORLD.roadY + 8);
  drawRainReflections(city);
}

function getCachedCityBackground(city, asset) {
  const key = `${city.id}:${asset.src}:${asset.naturalWidth}x${asset.naturalHeight}`;
  const cached = cityBackgroundCache.get(key);
  if (cached) return cached;
  const buffer = document.createElement("canvas");
  buffer.width = WORLD.width;
  buffer.height = WORLD.height;
  const bufferCtx = buffer.getContext("2d");
  bufferCtx.filter = "blur(1px) saturate(0.84) brightness(0.8)";
  bufferCtx.globalAlpha = 0.82;
  bufferCtx.drawImage(asset, 0, 0, WORLD.width, WORLD.height);
  bufferCtx.globalAlpha = 1;
  bufferCtx.filter = "none";
  cityBackgroundCache.set(key, buffer);
  return buffer;
}

function drawSkyMarker(city) {
  if (city.sunGlow) {
    const glow = ctx.createRadialGradient(806, 92, 4, 806, 92, 88);
    glow.addColorStop(0, city.sunGlow);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(806, 92, 88, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  if (city.moon) {
    ctx.fillStyle = "rgba(255, 236, 178, 0.9)";
    ctx.beginPath();
    ctx.arc(828, 72, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = city.skyTop;
    ctx.beginPath();
    ctx.arc(816, 62, 29, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCityLayer(speedFactor, baseY, color, height, city) {
  const offset = -(game.distance * speedFactor * 8) % 170;
  ctx.fillStyle = color;
  for (let x = offset - 170; x < WORLD.width + 260; x += 170) {
    const w = 95 + ((Math.floor(x) % 3) + 3) * (city.id === "newYork" ? 16 : 12);
    const h = height + ((Math.floor(x / 17) % 4) + 4) * (city.id === "newYork" ? 18 : 9);
    ctx.fillRect(x, baseY - h, w, h);
    if (city.spire && Math.floor(x / 170) % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(x + w * 0.5, baseY - h - 46);
      ctx.lineTo(x + w * 0.36, baseY - h);
      ctx.lineTo(x + w * 0.64, baseY - h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = city.window;
    for (let wx = x + 18; wx < x + w - 18; wx += 28) {
      for (let wy = baseY - h + 18; wy < baseY - 16; wy += 30) {
        if ((Math.floor(wx + wy) % 3) !== 0) ctx.fillRect(wx, wy, 10, 13);
      }
    }
    ctx.fillStyle = color;
  }
}

function drawRainReflections(city) {
  ctx.strokeStyle = city.roadLine;
  ctx.globalAlpha = 0.28;
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i += 1) {
    const x = (i * 81 - game.distance * 5) % (WORLD.width + 100);
    ctx.beginPath();
    ctx.moveTo(x, WORLD.roadY + 46 + (i % 4) * 11);
    ctx.lineTo(x + 62, WORLD.roadY + 46 + (i % 4) * 11);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawRoad() {
  const city = currentCity();
  ctx.fillStyle = city.road;
  ctx.fillRect(0, WORLD.roadY, WORLD.width, WORLD.height - WORLD.roadY);
  ctx.fillStyle = "#29313b";
  ctx.fillRect(0, WORLD.roadY, WORLD.width, 10);

  ctx.strokeStyle = city.roadLine;
  ctx.lineWidth = 6;
  ctx.setLineDash([54, 42]);
  ctx.lineDashOffset = -(game.distance * 11) % 96;
  ctx.beginPath();
  ctx.moveTo(0, WORLD.roadY + 58);
  ctx.lineTo(WORLD.width, WORLD.roadY + 58);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawScreenHud() {
  if (state !== "playing") return;
  ctx.save();
  const screenW = viewportWidth();
  const screenH = viewportHeight();
  const mobileLandscape = isMobileLandscape();
  const compact = screenW < 560 || mobileLandscape;
  const pad = compact ? 10 : 18;
  const top = compact ? Math.max(8, Math.round(screenH * 0.025)) : 16;
  const pillH = compact ? 32 : 42;
  const gap = compact ? 7 : 10;

  if (compact) {
    drawMetricPill(pad, top, 134, pillH, "distance", `${Math.floor(game.distance)} m`);
    drawSpeedGauge(screenW - pad - 112, top, 112, pillH, currentSpeedKmh(), true);
    drawMetricPill(pad, top + pillH + gap, 102, pillH, "package", game.deliveries, "#ffb238");
    drawMetricPill(screenW - pad - 94, top + pillH + gap, 94, pillH, "coin", game.runCoins, "#ffd166");
    drawScreenPowerHud(pad, top + (pillH + gap) * 2);
  } else {
    drawMetricPill(18, 16, 178, 42, "distance", `${Math.floor(game.distance)} m`);
    drawSpeedGauge(screenW / 2 - 88, 12, 176, 52, currentSpeedKmh(), false);
    drawMetricPill(screenW - 302, 16, 122, 42, "package", game.deliveries, "#ffb238");
    drawMetricPill(screenW - 164, 16, 146, 42, "coin", game.runCoins, "#ffd166");
    drawScreenPowerHud(18, 66);
  }

  if (game.messageTimer > 0) {
    const banner = messageBannerLayout(screenW, screenH, compact, mobileLandscape);
    const width = banner.width;
    const x = screenW / 2 - width / 2;
    const y = banner.y;
    const duration = game.messageDuration || 1.8;
    const life = clamp(game.messageTimer / duration, 0, 1);
    const intro = clamp((duration - game.messageTimer) / 0.22, 0, 1);
    const alpha = Math.min(intro, clamp(game.messageTimer / 0.28, 0, 1));
    drawMessageToast(x, y + (1 - intro) * -8, width, banner.height, game.message, compact, alpha, life);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function messageBannerLayout(screenW, screenH, compact, mobileLandscape) {
  if (mobileLandscape) {
    return {
      width: clamp(screenW * 0.3, 156, 226),
      height: clamp(screenH * 0.105, 28, 34),
      y: clamp(screenH * 0.035, 10, 18),
    };
  }
  if (compact) {
    return {
      width: Math.min(screenW * 0.76, 286),
      height: 38,
      y: Math.max(88, Math.round(screenH * 0.15)),
    };
  }
  return {
    width: 320,
    height: 40,
    y: 74,
  };
}

function drawMessageToast(x, y, width, height, text, compact, alpha, life) {
  const type = messageType(text);
  const palette = {
    delivery: { accent: "#44d7b6", glow: "rgba(68, 215, 182, 0.34)", icon: "package" },
    milestone: { accent: "#ffb238", glow: "rgba(255, 178, 56, 0.36)", icon: "star" },
    danger: { accent: "#ff5b6e", glow: "rgba(255, 91, 110, 0.34)", icon: "crash" },
    skill: { accent: "#65c7ff", glow: "rgba(101, 199, 255, 0.3)", icon: "spark" },
  }[type];
  const iconBox = height - 8;
  const progressWidth = Math.max(0, (width - 16) * life);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = palette.glow;
  ctx.shadowBlur = compact ? 9 : 14;
  ctx.shadowOffsetY = compact ? 3 : 5;
  roundRect(x, y, width, height, height / 2, "rgba(5, 10, 19, 0.76)", "rgba(255,255,255,0.16)");
  ctx.shadowColor = "transparent";
  roundRect(x + 4, y + 4, iconBox, iconBox, iconBox / 2, "rgba(255,255,255,0.09)", palette.accent);
  drawToastIcon(palette.icon, x + 4 + iconBox / 2, y + height / 2, iconBox * 0.55, palette.accent);

  ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
  roundRect(x + iconBox + 10, y + 7, width - iconBox - 18, height - 14, 999, "rgba(255, 255, 255, 0.09)");
  ctx.fillStyle = palette.accent;
  roundRect(x + 8, y + height - 4, progressWidth, 2, 999, palette.accent);

  ctx.fillStyle = "#f9fbff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const fontSize = clamp(height * 0.34, compact ? 10 : 12, compact ? 12 : 14);
  ctx.font = `900 ${fontSize}px system-ui`;
  const maxTextWidth = width - iconBox - 28;
  let label = text;
  while (ctx.measureText(label).width > maxTextWidth && label.length > 8) {
    label = `${label.slice(0, -2)}…`;
  }
  ctx.fillText(label, x + iconBox + 16, y + height / 2 + 1);
  ctx.restore();
}

function messageType(text) {
  if (text.includes("Kaza")) return "danger";
  if (text.includes("sıyrılma")) return "skill";
  if (text.includes("paket attın")) return "milestone";
  return "delivery";
}

function drawToastIcon(type, cx, cy, size, accent) {
  ctx.save();
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = Math.max(2, size * 0.14);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (type === "package") {
    ctx.strokeRect(cx - size * 0.36, cy - size * 0.28, size * 0.72, size * 0.56);
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.36, cy - size * 0.1);
    ctx.lineTo(cx, cy + size * 0.08);
    ctx.lineTo(cx + size * 0.36, cy - size * 0.1);
    ctx.stroke();
  } else if (type === "star") {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / 10;
      const radius = i % 2 === 0 ? size * 0.44 : size * 0.2;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  } else if (type === "crash") {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.42);
    ctx.lineTo(cx + size * 0.42, cy + size * 0.32);
    ctx.lineTo(cx - size * 0.42, cy + size * 0.32);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - size * 0.16);
    ctx.lineTo(cx, cy + size * 0.08);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + size * 0.22, size * 0.03, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx + size * 0.18, cy - size * 0.42);
    ctx.lineTo(cx - size * 0.08, cy - size * 0.02);
    ctx.lineTo(cx + size * 0.18, cy - size * 0.02);
    ctx.lineTo(cx - size * 0.22, cy + size * 0.42);
    ctx.lineTo(cx - size * 0.04, cy + size * 0.1);
    ctx.lineTo(cx - size * 0.28, cy + size * 0.1);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawMetricPill(x, y, w, h, icon, value, accent) {
  roundRect(x, y, w, h, 8, "rgba(4, 9, 18, 0.72)", accent || "rgba(255,255,255,0.14)");
  const iconSize = h - 14;
  drawHudIcon(icon, x + 18, y + h / 2, iconSize, accent);
  ctx.fillStyle = "#f9fbff";
  ctx.font = `900 ${viewportWidth() < 560 || isMobileLandscape() ? 14 : 18}px system-ui`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(String(value), x + 34, y + h / 2 + 1);
  ctx.textBaseline = "alphabetic";
}


function drawSpeedGauge(x, y, w, h, speed, compact) {
  const accent = speed > 125 ? "#ff5b6e" : speed > 95 ? "#ffb238" : "#44d7b6";
  roundRect(x, y, w, h, 8, "rgba(4, 9, 18, 0.74)", accent);
  const cx = x + (compact ? 25 : 34);
  const cy = y + h - 9;
  const radius = compact ? 18 : 23;
  const minA = Math.PI * 1.08;
  const maxA = Math.PI * 1.92;
  const ratio = clamp(speed / 170, 0, 1);
  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = compact ? 4 : 5;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, minA, maxA);
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, minA, minA + (maxA - minA) * ratio);
  ctx.stroke();
  for (let i = 0; i <= 4; i += 1) {
    const a = minA + (maxA - minA) * (i / 4);
    ctx.strokeStyle = i / 4 <= ratio ? "#f9fbff" : "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (radius - 2), cy + Math.sin(a) * (radius - 2));
    ctx.lineTo(cx + Math.cos(a) * (radius - 7), cy + Math.sin(a) * (radius - 7));
    ctx.stroke();
  }
  const needleA = minA + (maxA - minA) * ratio;
  ctx.strokeStyle = "#f9fbff";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(needleA) * (radius - 8), cy + Math.sin(needleA) * (radius - 8));
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f9fbff";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${compact ? 14 : 18}px system-ui`;
  ctx.fillText(String(speed), x + (compact ? 52 : 72), y + h / 2 - 2);
  ctx.fillStyle = "rgba(249,251,255,0.72)";
  ctx.font = `800 ${compact ? 9 : 10}px system-ui`;
  ctx.fillText("km/sa", x + (compact ? 52 : 72), y + h / 2 + 13);
  ctx.restore();
  ctx.textBaseline = "alphabetic";
}

function drawHudIcon(type, x, y, size, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.8, size * 0.1);
  if (type === "distance") {
    ctx.strokeStyle = accent || "#f9fbff";
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.moveTo(-size * 0.38, size * 0.34);
    ctx.lineTo(-size * 0.08, -size * 0.34);
    ctx.lineTo(size * 0.18, size * 0.34);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size * 0.24, -size * 0.22, size * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (type === "package") {
    ctx.fillStyle = "#f2a93b";
    ctx.strokeStyle = "#5a3307";
    ctx.beginPath();
    ctx.rect(-size * 0.36, -size * 0.28, size * 0.72, size * 0.58);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(90,51,7,0.7)";
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.28);
    ctx.lineTo(0, size * 0.3);
    ctx.moveTo(-size * 0.36, -size * 0.02);
    ctx.lineTo(size * 0.36, -size * 0.02);
    ctx.stroke();
  } else if (type === "coin") {
    const coinGradient = ctx.createRadialGradient(-size * 0.16, -size * 0.18, 2, 0, 0, size * 0.46);
    coinGradient.addColorStop(0, "#fff2a8");
    coinGradient.addColorStop(0.55, "#ffd166");
    coinGradient.addColorStop(1, "#c98513");
    ctx.fillStyle = coinGradient;
    ctx.strokeStyle = "#6b3d03";
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = Math.max(1.4, size * 0.07);
    ctx.beginPath();
    ctx.arc(-size * 0.06, -size * 0.06, size * 0.18, Math.PI * 0.88, Math.PI * 1.62);
    ctx.stroke();
  }
  ctx.restore();
}

function currentSpeedKmh() {
  return Math.max(0, Math.round(game.speed * 0.34));
}

function drawPowerSlot(x, y, item) {
  const size = 30;
  const progress = clamp(item.progress, 0, 1);
  const isMagnet = item.type === "magnet";
  const fill = isMagnet ? "rgba(255, 255, 255, 0.94)" : "rgba(4, 9, 18, 0.72)";
  const dark = isMagnet ? "#111827" : "#07101f";
  ctx.save();
  ctx.globalAlpha = 0.48 + progress * 0.52;
  roundRect(x, y, size, size, 8, fill, item.color);
  ctx.beginPath();
  ctx.strokeStyle = item.color;
  ctx.lineWidth = 3;
  ctx.arc(x + size / 2, y + size / 2, size / 2 - 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  ctx.stroke();
  drawPowerIcon(item.type, x + size / 2, y + size / 2, 18, { color: item.color, dark });
  ctx.restore();
}

function drawPowerIcon(type, x, y, size, options = {}) {
  const color = options.color || "#ffb238";
  const dark = options.dark || "#111827";
  const line = Math.max(2, size * 0.12);
  ctx.save();
  ctx.translate(x, y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = dark;
  ctx.fillStyle = color;
  ctx.lineWidth = line;

  if (drawPowerAsset(type, 0, 0, size)) {
    ctx.restore();
    return;
  }

  if (type === "helmet") {
    ctx.beginPath();
    ctx.arc(0, 1, size * 0.42, Math.PI * 1.05, Math.PI * 1.95);
    ctx.lineTo(size * 0.44, size * 0.18);
    ctx.quadraticCurveTo(size * 0.12, size * 0.45, -size * 0.42, size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.beginPath();
    ctx.ellipse(size * 0.15, -size * 0.08, size * 0.2, size * 0.1, -0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "turbo") {
    ctx.beginPath();
    ctx.moveTo(-size * 0.08, -size * 0.48);
    ctx.lineTo(size * 0.32, -size * 0.08);
    ctx.lineTo(size * 0.08, -size * 0.08);
    ctx.lineTo(size * 0.28, size * 0.48);
    ctx.lineTo(-size * 0.34, -size * 0.02);
    ctx.lineTo(-size * 0.06, -size * 0.02);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (type === "magnet") {
    ctx.lineWidth = line * 1.15;
    ctx.strokeStyle = dark;
    ctx.beginPath();
    ctx.arc(0, -size * 0.05, size * 0.38, Math.PI * 0.08, Math.PI * 0.92);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = line * 2.1;
    ctx.beginPath();
    ctx.arc(0, -size * 0.05, size * 0.36, Math.PI * 0.12, Math.PI * 0.88);
    ctx.stroke();
    roundRect(-size * 0.49, -size * 0.02, size * 0.25, size * 0.34, 3, "#e5e7eb", dark);
    roundRect(size * 0.24, -size * 0.02, size * 0.25, size * 0.34, 3, "#e5e7eb", dark);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = Math.max(1.5, line * 0.75);
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * size * 0.18, size * 0.3);
      ctx.lineTo(i * size * 0.12, size * 0.48);
      ctx.stroke();
    }
  } else if (type === "rain") {
    ctx.beginPath();
    ctx.arc(-size * 0.18, -size * 0.1, size * 0.22, Math.PI, 0);
    ctx.arc(size * 0.08, -size * 0.16, size * 0.28, Math.PI, 0);
    ctx.arc(size * 0.28, -size * 0.07, size * 0.18, Math.PI, 0);
    ctx.lineTo(size * 0.42, size * 0.1);
    ctx.lineTo(-size * 0.42, size * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = line;
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * size * 0.18, size * 0.25);
      ctx.lineTo(i * size * 0.18 - size * 0.08, size * 0.46);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawPowerAsset(type, x, y, size) {
  const image = powerupAssets[type];
  if (!image || !image.complete || image.naturalWidth === 0) {
    return false;
  }
  const maxW = size * 1.18;
  const maxH = size * 1.18;
  const ratio = Math.min(maxW / image.naturalWidth, maxH / image.naturalHeight);
  const w = image.naturalWidth * ratio;
  const h = image.naturalHeight * ratio;
  ctx.drawImage(image, x - w / 2, y - h / 2, w, h);
  return true;
}

function drawScreenPowerHud(x, y) {
  const items = [];
  if (game.player.shield > 0) items.push({ type: "helmet", color: "#65c7ff", progress: 1 });
  if (game.player.turboTimer > 0) items.push({ type: "turbo", color: "#ffb238", progress: game.player.turboTimer / 5 });
  if (game.player.magnetTimer > 0) items.push({ type: "magnet", color: "#ef4444", progress: game.player.magnetTimer / 8 });
  if (game.player.rainTimer > 0) items.push({ type: "rain", color: "#65c7ff", progress: game.player.rainTimer / 3.2 });
  let cursorX = x;
  for (const item of items) {
    drawPowerSlot(cursorX, y, item);
    cursorX += 40;
  }
}

function drawPlayer() {
  const player = game.player;
  const motor = currentMotor();
  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
  if (game.crashing) {
    const pulse = Math.max(0, game.crashTimer / game.crashDuration);
    ctx.translate(Math.sin(performance.now() / 28) * pulse * 2.8, Math.cos(performance.now() / 33) * pulse * 2.4);
    ctx.globalAlpha = 0.76 + pulse * 0.24;
  }
  ctx.rotate(player.tilt);
  ctx.translate(-player.w / 2, -player.h / 2);

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(68, 102, 72, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 0.34;
  ctx.fillStyle = motor.color;
  ctx.beginPath();
  ctx.moveTo(4, 64);
  ctx.lineTo(-42, 76);
  ctx.lineTo(8, 90);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  if (game.player.rainTimer > 0) {
    ctx.globalAlpha = 0.28 + Math.sin(performance.now() / 70) * 0.12;
    roundRect(14, 4, 112, 82, 8, "rgba(101, 199, 255, 0.24)", "rgba(101, 199, 255, 0.75)");
    ctx.globalAlpha = 1;
  }

  if (game.player.shield > 0) {
    ctx.globalAlpha = 0.34 + Math.sin(performance.now() / 110) * 0.1;
    ctx.strokeStyle = "#65c7ff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(70, 48, 82, 62, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  if (game.player.turboTimer > 0) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#ffb238";
    ctx.beginPath();
    ctx.moveTo(6, 74);
    ctx.lineTo(-70, 54);
    ctx.lineTo(0, 96);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const selectedMotorAsset = motorAssets[motor.asset];
  const hasSelectedMotorAsset = selectedMotorAsset && selectedMotorAsset.complete && selectedMotorAsset.naturalWidth > 0;
  if (hasSelectedMotorAsset) {
    ctx.drawImage(renderSource(selectedMotorAsset), -22, -16, 178, 120);
  } else if (!drawAsset("courier", -10, -20, 158, 132)) {
    drawFallbackCourier(motor);
  }

  ctx.restore();
}

function drawFallbackCourier(skin) {
  drawWheel(34, 72);
  drawWheel(104, 72);
  roundRect(36, 42, 72, 26, 8, skin.color, "#111827");
  roundRect(22, 6, 42, 42, 7, "#ff8a3d", "#111827");
  ctx.fillStyle = "#f7c68a";
  ctx.beginPath();
  ctx.arc(82, 18, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#111827";
  ctx.stroke();
}

function drawWheel(x, y) {
  ctx.fillStyle = "#10141d";
  ctx.beginPath();
  ctx.arc(x, y, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawCoins() {
  for (const coin of game.coins) {
    ctx.save();
    ctx.translate(coin.x + 12, coin.y + 12);
    const squeeze = 0.78 + Math.sin(performance.now() / 180 + coin.spin) * 0.2;
    ctx.scale(squeeze, 1);
    ctx.fillStyle = "#ffd45b";
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#9f6400";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#9f6400";
    ctx.font = "900 13px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("₺", 0, 1);
    ctx.restore();
  }
}

function drawPowerups() {
  for (const powerup of game.powerups) {
    ctx.save();
    const pulse = 1 + Math.sin(performance.now() / 130 + powerup.phase) * 0.08;
    ctx.translate(powerup.x + powerup.w / 2, powerup.y + powerup.h / 2);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 22, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    const isMagnet = powerup.id === "magnet";
    ctx.fillStyle = isMagnet ? "rgba(255, 255, 255, 0.96)" : powerup.color;
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawPowerIcon(powerup.id, 0, 0, 21, {
      color: isMagnet ? powerup.color : "#101827",
      dark: isMagnet ? "#111827" : "rgba(255,255,255,0.72)",
    });
    ctx.restore();
  }
}

function drawIconBursts() {
  for (const burst of game.iconBursts) {
    const t = clamp(burst.life / burst.maxLife, 0, 1);
    const size = 34 + (1 - t) * 28;
    ctx.save();
    ctx.globalAlpha = t;
    ctx.translate(burst.x, burst.y);
    if (burst.type === "magnet") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.68, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = burst.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    drawPowerIcon(burst.type, 0, 0, size, { color: burst.color, dark: "#111827" });
    ctx.restore();
  }
}

function drawCheckpoints() {
  for (const checkpoint of game.checkpoints) {
    ctx.save();
    ctx.globalAlpha = checkpoint.passed ? 0.36 : 1;
    if (!drawAsset("delivery", checkpoint.x - 45, checkpoint.y - 12, 166, 282)) {
      ctx.strokeStyle = checkpoint.passed ? "#44d7b6" : "#ffb238";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.ellipse(checkpoint.x + 38, checkpoint.y + 130, 38, 128, 0, 0, Math.PI * 2);
      ctx.stroke();
      roundRect(checkpoint.x - 26, checkpoint.y + 94, 128, 38, 8, "rgba(9,17,31,0.88)", ctx.strokeStyle);
      ctx.fillStyle = "#f9fbff";
      ctx.font = "900 15px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("TESLİMAT", checkpoint.x + 38, checkpoint.y + 119);
    }
    ctx.restore();
  }
}

function drawObstacles() {
  for (const obstacle of game.obstacles) {
    if (drawAssetObstacle(obstacle)) {
      continue;
    }
    switch (obstacle.id) {
      case "door":
        drawDoorObstacle(obstacle);
        break;
      case "seagull":
        drawSeagull(obstacle);
        break;
      case "cat":
        drawCat(obstacle);
        break;
      case "pothole":
        drawPothole(obstacle);
        break;
      case "barrier":
        drawBarrier(obstacle);
        break;
      default:
        roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 8, "#ff5b6e");
    }
  }
}

function drawAssetObstacle(obstacle) {
  if (!obstacle.asset) return false;
  if (obstacle.jumper) {
    return drawJumpingAssetObstacle(obstacle);
  }
  const bob = obstacle.id === "seagull" ? Math.sin(performance.now() / 140) * 4 : 0;
  const ok = drawAsset(obstacle.asset, obstacle.x, obstacle.y + bob, obstacle.w, obstacle.h);
  if (ok && obstacle.id === "cloud") {
    ctx.save();
    ctx.globalAlpha = obstacle.used ? 0.22 : 0.36;
    const rain = ctx.createLinearGradient(0, obstacle.y + 70, 0, obstacle.y + 190);
    rain.addColorStop(0, "rgba(101, 199, 255, 0)");
    rain.addColorStop(1, "rgba(101, 199, 255, 0.34)");
    ctx.fillStyle = rain;
    ctx.fillRect(obstacle.x + 22, obstacle.y + 64, obstacle.w - 44, 128);
    ctx.restore();
  }
  return ok;
}

function drawJumpingAssetObstacle(obstacle) {
  const image = assets[obstacle.asset];
  if (!image || !image.complete || image.naturalWidth === 0) {
    return false;
  }
  const shadowScale = clamp(1 - ((obstacle.baseY - obstacle.y) / Math.max(1, obstacle.jumpHeight || 1)) * 0.35, 0.45, 1);
  ctx.save();
  ctx.globalAlpha = 0.24 * shadowScale;
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.ellipse(obstacle.x + obstacle.w * 0.5, obstacle.baseY + obstacle.h - 4, obstacle.w * 0.34 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(obstacle.x + obstacle.w / 2, obstacle.y + obstacle.h / 2);
  ctx.rotate(obstacle.rotation || 0);
  ctx.scale(1 + (1 - (obstacle.squash || 1)) * 0.55, obstacle.squash || 1);
  ctx.drawImage(image, -obstacle.w / 2, -obstacle.h / 2, obstacle.w, obstacle.h);
  ctx.restore();
  return true;
}

function drawDoorObstacle(o) {
  roundRect(o.x, o.y + 18, 58, 48, 6, "#52657a", "#111827");
  ctx.fillStyle = "#9bdcff";
  ctx.fillRect(o.x + 11, o.y + 26, 22, 13);
  ctx.save();
  ctx.translate(o.x + 54, o.y + 25);
  ctx.rotate(-0.42);
  roundRect(0, 0, 16, 58, 4, "#ff7a2f", "#111827");
  ctx.restore();
}

function drawSeagull(o) {
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 5;
  ctx.fillStyle = "#f9fbff";
  ctx.beginPath();
  ctx.ellipse(o.x + 40, o.y + 24, 24, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(o.x + 24, o.y + 24);
  ctx.quadraticCurveTo(o.x + 6, o.y + 2, o.x - 8, o.y + 22);
  ctx.moveTo(o.x + 48, o.y + 22);
  ctx.quadraticCurveTo(o.x + 78, o.y + 0, o.x + 86, o.y + 26);
  ctx.stroke();
  ctx.fillStyle = "#ffb238";
  ctx.beginPath();
  ctx.moveTo(o.x + 63, o.y + 22);
  ctx.lineTo(o.x + 80, o.y + 18);
  ctx.lineTo(o.x + 64, o.y + 30);
  ctx.fill();
}

function drawCat(o) {
  ctx.fillStyle = "#2c2a32";
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(o.x + 34, o.y + 21, 28, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(o.x + 15, o.y + 12);
  ctx.lineTo(o.x + 20, o.y + 2);
  ctx.lineTo(o.x + 27, o.y + 12);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "#ffb238";
  ctx.beginPath();
  ctx.moveTo(o.x + 3, o.y + 18);
  ctx.quadraticCurveTo(o.x - 12, o.y + 2, o.x + 6, o.y - 6);
  ctx.stroke();
}

function drawPothole(o) {
  ctx.fillStyle = "#0b0f17";
  ctx.beginPath();
  ctx.ellipse(o.x + o.w / 2, o.y + 20, o.w / 2, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#617084";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawBarrier(o) {
  roundRect(o.x, o.y, o.w, o.h, 7, "#f4f5f7", "#111827");
  ctx.fillStyle = "#ff7a2f";
  for (let i = 0; i < 3; i += 1) {
    ctx.save();
    ctx.translate(o.x + 12 + i * 28, o.y + 8);
    ctx.rotate(-0.55);
    ctx.fillRect(0, 0, 12, 56);
    ctx.restore();
  }
  ctx.fillStyle = "#111827";
  ctx.font = "900 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("ZABITA", o.x + o.w / 2, o.y + 38);
}

function drawParticles() {
  for (const particle of game.particles) {
    ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function loop(time) {
  const dt = Math.min((time - lastTime) / 1000 || 0, 0.033);
  lastTime = time;
  update(dt);
  render();
  requestAnimationFrame(loop);
}

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function roundRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawAsset(name, x, y, w, h) {
  const image = assets[name];
  if (!image || !image.complete || image.naturalWidth === 0) {
    return false;
  }
  ctx.drawImage(renderSource(image), x, y, w, h);
  return true;
}

function renderSource(image) {
  return image.processedCanvas || image;
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function unlockAudio() {
  if (audioUnlocked) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx = audioCtx || new AudioContext();
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  audioUnlocked = true;
}

function startEngineSound() {
  if (!settings.sound || !audioUnlocked || !audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  if (engineAudio) return;
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  const piston = audioCtx.createOscillator();
  const body = audioCtx.createOscillator();
  const rumble = audioCtx.createBufferSource();
  const rumbleFilter = audioCtx.createBiquadFilter();
  const rumbleGain = audioCtx.createGain();
  const bodyFilter = audioCtx.createBiquadFilter();
  const wobble = audioCtx.createOscillator();
  const wobbleGain = audioCtx.createGain();

  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(0.018, now + 0.28);
  piston.type = "triangle";
  body.type = "sine";
  piston.frequency.setValueAtTime(44, now);
  body.frequency.setValueAtTime(88, now);
  rumble.buffer = makeNoiseBuffer(0.7);
  rumble.loop = true;
  rumbleFilter.type = "bandpass";
  rumbleFilter.frequency.setValueAtTime(74, now);
  rumbleFilter.Q.setValueAtTime(0.85, now);
  rumbleGain.gain.setValueAtTime(0.009, now);
  bodyFilter.type = "lowpass";
  bodyFilter.frequency.setValueAtTime(280, now);
  wobble.type = "sine";
  wobble.frequency.setValueAtTime(7, now);
  wobbleGain.gain.setValueAtTime(3.6, now);
  wobble.connect(wobbleGain);
  wobbleGain.connect(piston.frequency);
  wobbleGain.connect(body.frequency);
  piston.connect(bodyFilter);
  body.connect(bodyFilter);
  rumble.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  bodyFilter.connect(master);
  rumbleGain.connect(master);
  master.connect(audioCtx.destination);
  piston.start(now);
  body.start(now);
  rumble.start(now);
  wobble.start(now);
  engineAudio = { master, piston, body, rumble, rumbleFilter, rumbleGain, bodyFilter, wobble, wobbleGain, nextPulseTime: now };
}

function stopEngineSound() {
  if (!engineAudio || !audioCtx) return;
  const now = audioCtx.currentTime;
  const engine = engineAudio;
  engine.master.gain.cancelScheduledValues(now);
  engine.master.gain.setTargetAtTime(0.0001, now, 0.08);
  engine.piston.stop(now + 0.24);
  engine.body.stop(now + 0.24);
  engine.rumble.stop(now + 0.24);
  engine.wobble.stop(now + 0.22);
  engineAudio = null;
}

function updateEngineSound(dt) {
  if (!engineAudio || !audioCtx) return;
  const now = audioCtx.currentTime;
  const speedRatio = clamp(game.speed / 430, 0, 1.25);
  const motor = currentMotor();
  const turbo = game.player.turboTimer > 0 ? 1 : 0;
  const rain = game.player.rainTimer > 0 ? 1 : 0;
  const crash = game.crashing ? 1 : 0;
  const base = 38 + speedRatio * 36 + (motor.speed - 1) * 1.1 + turbo * 8 - rain * 5;
  const volume = crash ? 0.01 : 0.014 + speedRatio * 0.012 + turbo * 0.006 - rain * 0.005;
  engineAudio.master.gain.setTargetAtTime(Math.max(0.006, volume), now, 0.13);
  engineAudio.piston.frequency.setTargetAtTime(Math.max(34, base), now, 0.08);
  engineAudio.body.frequency.setTargetAtTime(Math.max(66, base * 1.85), now, 0.08);
  engineAudio.bodyFilter.frequency.setTargetAtTime(240 + speedRatio * 360 + turbo * 120 - rain * 70, now, 0.14);
  engineAudio.rumbleFilter.frequency.setTargetAtTime(64 + speedRatio * 58 + turbo * 18, now, 0.16);
  engineAudio.rumbleGain.gain.setTargetAtTime(crash ? 0.006 : 0.008 + speedRatio * 0.012, now, 0.12);
  engineAudio.wobble.frequency.setTargetAtTime(6 + speedRatio * 7 + turbo * 3, now, 0.16);
  engineAudio.wobbleGain.gain.setTargetAtTime(crash ? 5 : 3.2 + speedRatio * 2.2, now, 0.16);
  scheduleEnginePulses(now, speedRatio, turbo, rain, crash);
}

function scheduleEnginePulses(now, speedRatio, turbo, rain, crash) {
  if (!engineAudio || crash) return;
  const interval = clamp(0.17 - speedRatio * 0.065 - turbo * 0.025 + rain * 0.025, 0.075, 0.18);
  const intensity = clamp(0.028 + speedRatio * 0.028 + turbo * 0.018 - rain * 0.012, 0.018, 0.07);
  if (engineAudio.nextPulseTime < now) {
    engineAudio.nextPulseTime = now + interval * 0.3;
  }
  while (engineAudio.nextPulseTime < now + 0.08) {
    enginePulse(engineAudio.master, engineAudio.nextPulseTime, intensity);
    engineAudio.nextPulseTime += interval;
  }
}

function enginePulse(output, time, volume) {
  tone(output, time, 82, 48, 0.055, "sine", volume);
  noise(output, time, 0.045, volume * 0.32, 420);
}

function startMusicSound() {
  if (!settings.sound || !settings.music || !audioUnlocked || !audioCtx || musicAudio) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  const padFilter = audioCtx.createBiquadFilter();
  const padA = audioCtx.createOscillator();
  const padB = audioCtx.createOscillator();
  const padGain = audioCtx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(0.26, now + 0.8);
  padFilter.type = "lowpass";
  padFilter.frequency.setValueAtTime(680, now);
  padA.type = "triangle";
  padB.type = "sine";
  padA.frequency.setValueAtTime(164.81, now);
  padB.frequency.setValueAtTime(246.94, now);
  padGain.gain.setValueAtTime(0.08, now);
  padA.connect(padFilter);
  padB.connect(padFilter);
  padFilter.connect(padGain);
  padGain.connect(master);
  master.connect(audioCtx.destination);
  padA.start(now);
  padB.start(now);
  musicAudio = {
    master,
    padA,
    padB,
    padFilter,
    padGain,
    step: 0,
    nextTime: now + 0.08,
    timer: 0,
    stopped: false,
  };
  playSound("musicTest");
  tone(master, now + 0.04, 392, 784, 0.16, "triangle", 0.12);
  scheduleMusicLoop();
}

function stopMusicSound() {
  if (!musicAudio || !audioCtx) return;
  const now = audioCtx.currentTime;
  const music = musicAudio;
  music.stopped = true;
  window.clearTimeout(music.timer);
  music.master.gain.cancelScheduledValues(now);
  music.master.gain.setTargetAtTime(0.0001, now, 0.22);
  music.padA.stop(now + 0.28);
  music.padB.stop(now + 0.28);
  musicAudio = null;
}

function scheduleMusicLoop() {
  if (!musicAudio || musicAudio.stopped || !audioCtx) return;
  const lookAhead = 0.5;
  const stepDuration = 0.18;
  while (musicAudio.nextTime < audioCtx.currentTime + lookAhead) {
    playMusicStep(musicAudio.step, musicAudio.nextTime, musicAudio.master);
    musicAudio.nextTime += stepDuration;
    musicAudio.step = (musicAudio.step + 1) % 32;
  }
  musicAudio.timer = window.setTimeout(scheduleMusicLoop, 90);
}

function playMusicStep(step, time, output) {
  const bass = [110, 0, 0, 98, 0, 0, 130, 0, 110, 0, 147, 0, 98, 0, 0, 0];
  const lead = [392, 0, 440, 0, 523, 0, 494, 392, 0, 0, 440, 0, 587, 0, 523, 0];
  const bassNote = bass[step % bass.length];
  const leadNote = lead[step % lead.length];
  if (step % 4 === 0) {
    musicKick(output, time);
  }
  if (step % 8 === 4) {
    noise(output, time, 0.08, 0.04, 2400);
  }
  if (step % 2 === 1) {
    musicHat(output, time);
  }
  if (bassNote) {
    tone(output, time, bassNote, bassNote * 0.992, 0.16, "triangle", 0.13);
  }
  if (leadNote) {
    tone(output, time, leadNote, leadNote * 1.006, 0.13, "sine", 0.095);
    tone(output, time + 0.01, leadNote * 2, leadNote * 2.006, 0.08, "triangle", 0.035);
  }
}

function musicKick(output, time) {
  tone(output, time, 92, 42, 0.16, "sine", 0.18);
}

function musicHat(output, time) {
  const sampleRate = audioCtx.sampleRate;
  const duration = 0.035;
  const buffer = audioCtx.createBuffer(1, Math.floor(sampleRate * duration), sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(5200, time);
  gain.gain.setValueAtTime(0.034, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  source.start(time);
  source.stop(time + duration);
}

function playSound(type) {
  if (!settings.sound || !audioUnlocked || !audioCtx) return;
  const now = audioCtx.currentTime;
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(1, now);
  master.connect(audioCtx.destination);

  if (type === "coin") {
    tone(master, now, 760, 1120, 0.12, "triangle", 0.16);
  } else if (type === "jump") {
    tone(master, now, 260, 440, 0.14, "sine", 0.09);
  } else if (type === "delivery") {
    tone(master, now, 520, 780, 0.12, "triangle", 0.12);
    tone(master, now + 0.1, 780, 1040, 0.18, "triangle", 0.14);
  } else if (type === "powerup") {
    tone(master, now, 480, 980, 0.22, "sawtooth", 0.1);
  } else if (type === "turbo") {
    tone(master, now, 190, 760, 0.32, "sawtooth", 0.13);
    noise(master, now, 0.2, 0.055, 900);
  } else if (type === "rain") {
    noise(master, now, 0.24, 0.045, 1600);
    tone(master, now, 360, 230, 0.18, "sine", 0.055);
  } else if (type === "shield") {
    tone(master, now, 310, 220, 0.1, "square", 0.1);
    tone(master, now + 0.07, 820, 1220, 0.18, "triangle", 0.12);
  } else if (type === "nearMiss") {
    tone(master, now, 680, 520, 0.09, "square", 0.07);
  } else if (type === "crash") {
    noise(master, now, 0.36, 0.16, 520);
    tone(master, now, 140, 58, 0.38, "sawtooth", 0.18);
  } else if (type === "start") {
    tone(master, now, 360, 580, 0.11, "triangle", 0.09);
    tone(master, now + 0.08, 580, 820, 0.14, "triangle", 0.1);
  } else if (type === "ui") {
    tone(master, now, 520, 440, 0.06, "triangle", 0.055);
  } else if (type === "musicTest") {
    tone(master, now, 392, 784, 0.22, "triangle", 0.18);
    tone(master, now + 0.12, 523, 1046, 0.2, "sine", 0.12);
  } else if (type === "milestone") {
    tone(master, now, 523, 784, 0.12, "triangle", 0.14);
    tone(master, now + 0.1, 659, 988, 0.14, "triangle", 0.15);
    tone(master, now + 0.22, 784, 1175, 0.22, "triangle", 0.16);
    noise(master, now + 0.04, 0.16, 0.032, 3200);
  }
}

function tone(output, start, from, to, duration, type, volume) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(output);
  osc.start(start);
  osc.stop(start + duration + 0.03);
}

function noise(output, start, duration, volume, filterFrequency) {
  const buffer = makeNoiseBuffer(duration);
  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(filterFrequency, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  source.start(start);
  source.stop(start + duration);
}

function makeNoiseBuffer(duration) {
  const sampleRate = audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function bindButton(button, handler, sound = "ui") {
  button.addEventListener("click", () => {
    unlockAudio();
    playSound(sound);
    handler();
  });
}

function openSettings() {
  ui.settingsPanel.classList.add("is-visible");
}

function closeSettings() {
  ui.settingsPanel.classList.remove("is-visible");
}

function applyAudioSettings() {
  persistSettings();
  syncSettingsUi();
  if (!settings.sound) {
    stopEngineSound();
    stopMusicSound();
    return;
  }
  if (state === "playing") {
    startEngineSound();
    if (settings.music) {
      startMusicSound();
    } else {
      stopMusicSound();
    }
  } else {
    stopEngineSound();
    stopMusicSound();
  }
}

bindButton(ui.startBtn, startGame, "start");
bindButton(ui.restartBtn, startGame, "start");
bindButton(ui.shopBtn, () => showScreen("shop"));
bindButton(ui.goShopBtn, () => showScreen("shop"));
bindButton(ui.closeShopBtn, () => showScreen("menu"));
bindButton(ui.backMenuBtn, () => showScreen("menu"));
bindButton(ui.settingsBtn, openSettings);
bindButton(ui.closeSettingsBtn, closeSettings);
bindButton(ui.portraitStartBtn, beginPortraitGame, "start");
ui.settingsPanel.addEventListener("click", (event) => {
  if (event.target === ui.settingsPanel) closeSettings();
});
ui.soundToggle.addEventListener("click", () => {
  unlockAudio();
  settings.sound = !settings.sound;
  applyAudioSettings();
  playSound("ui");
});
ui.musicToggle.addEventListener("click", () => {
  if (!settings.sound) return;
  unlockAudio();
  settings.music = !settings.music;
  applyAudioSettings();
  playSound("ui");
});
ui.motorsTab.addEventListener("click", () => {
  unlockAudio();
  playSound("ui");
  shopTab = "motors";
  renderShop();
});
ui.citiesTab.addEventListener("click", () => {
  unlockAudio();
  playSound("ui");
  shopTab = "cities";
  renderShop();
});

canvas.addEventListener("pointerdown", pointerDown, { passive: false });
window.addEventListener("pointerup", pointerUp, { passive: false });
window.addEventListener("pointercancel", pointerUp, { passive: false });
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    unlockAudio();
    event.preventDefault();
    if (state === "menu" || state === "gameOver") {
      playSound("start");
      startGame();
      return;
    }
    if (state === "playing" && !inputDown) {
      inputDown = true;
      const impulse = game.player.grounded ? WORLD.lift * 0.86 : WORLD.lift * 0.62;
      game.player.vy = Math.min(game.player.vy, impulse);
      game.player.grounded = false;
      playSound("jump");
    }
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    inputDown = false;
  }
});
window.addEventListener("resize", handleViewportChange);
window.addEventListener("orientationchange", handleViewportChange);
window.visualViewport?.addEventListener("resize", handleViewportChange);
window.visualViewport?.addEventListener("scroll", handleViewportChange);
window.addEventListener("blur", () => {
  stopEngineSound();
  stopMusicSound();
});
window.addEventListener("focus", () => {
  if (state === "playing") {
    startEngineSound();
    startMusicSound();
  }
});

resizeCanvas();
syncUi();
requestAnimationFrame(loop);
