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
  restartBtn: document.getElementById("restartBtn"),
  goShopBtn: document.getElementById("goShopBtn"),
  backMenuBtn: document.getElementById("backMenuBtn"),
};

const STORAGE_KEY = "kacakKuryeSave";
const WORLD = {
  width: 960,
  height: 540,
  roadY: 430,
  gravity: 760,
  lift: -420,
  maxFall: 620,
  startSpeed: 205,
};

const assets = loadAssets({
  courier: "Asssets/kurye.png",
  car: "Asssets/araç.png",
  bird: "Asssets/leylek.png",
  cat: "Asssets/kedi.png",
  pothole: "Asssets/cukur.png",
  barrier: "Asssets/zabıta.png",
  bump: "Asssets/tümsek.png",
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
});

const cityAssets = loadAssets({
  istanbul: "Asssets/cities/istanbul.png",
  newYork: "Asssets/cities/new-york.png",
  mexicoCity: "Asssets/cities/mexico-city.png",
  tokyo: "Asssets/cities/tokyo.png",
  dubai: "Asssets/cities/dubai.png",
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
    unlockPackages: 5,
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
    unlockPackages: 12,
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
    unlockPackages: 20,
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
    unlockPackages: 32,
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
    unlockPackages: 48,
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
    unlockPackages: 70,
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
    unlockPackages: 95,
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
    unlockPackages: 125,
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
    unlockPackages: 160,
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
  { id: "cat", label: "Kedi", asset: "cat", w: 104, h: 66, ground: true, minDistance: 0, damage: true },
  { id: "pothole", label: "Çukur", asset: "pothole", w: 112, h: 48, ground: true, minDistance: 0, damage: true },
  { id: "barrier", label: "Zabıta", asset: "barrier", w: 128, h: 82, ground: true, minDistance: 170, damage: true },
  { id: "bump", label: "Kasis", asset: "bump", w: 118, h: 36, ground: true, minDistance: 0, damage: true },
  { id: "cloud", label: "Yağmur", asset: "cloud", w: 132, h: 96, air: true, minDistance: 480, damage: false },
];

let save = loadSave();
let state = "menu";
let lastTime = 0;
let inputDown = false;
let game = createGame();
let shopTab = "motors";
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
      return {
        coins: Number(parsed.coins) || 0,
        bestScore: Number(parsed.bestScore) || 0,
        bestPackages: Number(parsed.bestPackages) || 0,
        equippedMotor: parsed.equippedMotor || migrateMotorId(parsed.equippedSkin) || "motor1",
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

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
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
    message: "",
    messageTimer: 0,
    lastObstacleId: "",
    nearMisses: 0,
  };
}

function loadAssets(manifest) {
  const loaded = {};
  for (const [key, source] of Object.entries(manifest)) {
    const image = new Image();
    image.onload = () => {
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

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function toWorldX(x) {
  return (x / window.innerWidth) * WORLD.width;
}

function toWorldY(y) {
  return (y / window.innerHeight) * WORLD.height;
}

function showScreen(name) {
  for (const [key, element] of Object.entries(screens)) {
    element.classList.toggle("is-visible", key === name);
  }
  state = name;
  syncUi();
}

function hideScreens() {
  for (const element of Object.values(screens)) {
    element.classList.remove("is-visible");
  }
}

function startGame() {
  game = createGame();
  inputDown = false;
  hideScreens();
  state = "playing";
}

function endGame() {
  state = "gameOver";
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
  ui.bestPackages.textContent = String(save.bestPackages);
  ui.walletCoins.textContent = String(save.coins);
  ui.shopCoins.textContent = String(save.coins);
  renderRecords();
  renderShop();
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
    const unlocked = isMotorUnlocked(motor);
    const equipped = save.equippedMotor === motor.id;
    const card = document.createElement("article");
    card.className = `shop-card${unlocked ? "" : " is-locked"}`;
    const asset = motorAssets[motor.asset];
    const preview = asset && asset.complete && asset.naturalWidth > 0
      ? `<img src="${asset.src}" alt="">`
      : `<div class="placeholder-bike" style="background: linear-gradient(135deg, ${motor.color}, ${motor.accent});"></div>`;
    const progress = motor.unlockPackages === 0 ? 100 : clamp((save.bestPackages / motor.unlockPackages) * 100, 0, 100);
    const remaining = Math.max(0, motor.unlockPackages - save.bestPackages);
    card.innerHTML = `
      <div class="motor-preview" style="background: linear-gradient(135deg, ${motor.color}22, ${motor.accent}33);">${preview}</div>
      <div class="motor-title-row">
        <h3>${motor.name}</h3>
        <span class="lock-badge ${unlocked ? "is-open" : ""}">${unlocked ? "AÇIK" : "KİLİTLİ"}</span>
      </div>
      <p>${motor.desc}</p>
      <div class="unlock-box">
        <div class="unlock-copy">
          <span>${unlocked ? "Paket rekoru yeterli" : "Açmak için paket rekoru"}</span>
          <strong>${unlocked ? `${save.bestPackages} paket` : `${remaining} paket kaldı`}</strong>
        </div>
        <div class="unlock-progress"><span style="width:${progress}%"></span></div>
        <small>${Math.min(save.bestPackages, motor.unlockPackages)} / ${motor.unlockPackages} paket</small>
      </div>
      <div class="stat-bars">
        <div class="stat-line"><span>Hız</span><div class="bar"><span style="width:${motor.speed * 10}%"></span></div><strong>${motor.speed}</strong></div>
        <div class="stat-line"><span>Güç</span><div class="bar"><span style="width:${motor.power * 10}%"></span></div><strong>${motor.power}</strong></div>
      </div>
    `;
    const button = document.createElement("button");
    button.textContent = equipped ? "Seçili" : unlocked ? "Seç" : "Kilitli";
    button.classList.toggle("is-equipped", equipped);
    button.disabled = equipped || !unlocked;
    button.addEventListener("click", () => {
      save.equippedMotor = motor.id;
      persist();
      syncUi();
    });
    card.appendChild(button);
    motorGrid.appendChild(card);
  }
  motorSection.appendChild(motorGrid);
  ui.shopItems.appendChild(motorSection);
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
          <strong>${owned ? "Sınırsız" : `${city.price.toLocaleString("tr-TR")} coin`}</strong>
        </div>
        <div class="unlock-progress"><span style="width:${progress}%"></span></div>
        <small>${owned ? "Satın alındı" : `${save.coins.toLocaleString("tr-TR")} / ${city.price.toLocaleString("tr-TR")} coin`}</small>
      </div>
    `;
    const button = document.createElement("button");
    button.textContent = equipped ? "Seçili" : owned ? "Seç" : canBuy ? "Satın al" : "Coin yetersiz";
    button.classList.toggle("is-equipped", equipped);
    button.disabled = equipped || (!owned && !canBuy);
    button.addEventListener("click", () => {
      if (!owned) {
        save.coins -= city.price;
        save.ownedCities.push(city.id);
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
  const selected = motors.find((motor) => motor.id === save.equippedMotor && isMotorUnlocked(motor));
  return selected || motors[0];
}

function currentCity() {
  const selected = cities.find((city) => city.id === save.equippedCity && save.ownedCities.includes(city.id));
  return selected || cities[0];
}

function pointerDown(event) {
  if (state !== "playing") return;
  event.preventDefault();
  inputDown = true;
  const impulse = game.player.grounded ? WORLD.lift * 0.86 : WORLD.lift * 0.62;
  game.player.vy = Math.min(game.player.vy, impulse);
  game.player.grounded = false;
}

function pointerUp(event) {
  if (state !== "playing") return;
  event.preventDefault();
  inputDown = false;
}

function update(dt) {
  if (state !== "playing") return;
  const g = game;
  const motor = currentMotor();
  const difficulty = Math.floor(g.distance / 300);
  tickPowerups(dt);
  const motorSpeed = 1 + (motor.speed - 1) * 0.055;
  const turboBoost = g.player.turboTimer > 0 ? 1.22 + (motor.turboBonus || 0) : 1;
  const rainSlow = g.player.rainTimer > 0 ? 1 - (0.34 * (motor.rainResist || 1)) : 1;
  g.speed = WORLD.startSpeed * (1 + difficulty * 0.045) * motorSpeed * turboBoost * rainSlow;
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
    endGame();
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

function spawnObstacle() {
  let available = obstacleTypes.filter((item) => game.distance >= item.minDistance);
  if (game.distance < 650) {
    available = available.filter((item) => item.id !== "cloud" && item.id !== game.lastObstacleId);
  }
  const type = available[Math.floor(Math.random() * available.length)];
  let y = groundObstacleY(type);
  let wave = 0;
  if (type.air) {
    y = type.id === "cloud" ? random(82, 138) : random(132, 278);
    wave = game.distance > 760 && type.id !== "cloud" ? random(12, 30) : 0;
  }
  game.lastObstacleId = type.id;
  game.obstacles.push({
    ...type,
    kind: "obstacle",
    x: WORLD.width + 70,
    y,
    baseY: y,
    wave,
    phase: random(0, Math.PI * 2),
  });
}

function groundObstacleY(type) {
  if (type.id === "pothole") return WORLD.roadY - type.h + 12;
  if (type.id === "bump") return WORLD.roadY - type.h + 4;
  if (type.id === "cat") return WORLD.roadY - type.h - 6;
  if (type.id === "barrier") return WORLD.roadY - type.h - 2;
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
    { id: "helmet", label: "Kask", color: "#65c7ff", icon: "K" },
    { id: "turbo", label: "Turbo", color: "#ffb238", icon: "T" },
    { id: "magnet", label: "Mıknatıs", color: "#ff5bcb", icon: "M" },
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
      spawnSpark(checkpoint.x + 40, checkpoint.y + 130, "#44d7b6", 20);
      flashMessage(`Teslimat tamam! +${bonus} coin`);
    }
  }
}

function applyPowerup(powerup) {
  if (powerup.id === "helmet") {
    game.player.shield = 1;
    flashMessage("Kask takıldı: 1 çarpma affı");
  } else if (powerup.id === "turbo") {
    game.player.turboTimer = 5;
    flashMessage("Turbo açıldı!");
  } else if (powerup.id === "magnet") {
    game.player.magnetTimer = 8;
    flashMessage("Manyetik çanta aktif");
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
  const playerBox = getPlayerBox();
  for (const obstacle of game.obstacles) {
    const hitbox = obstacleHitbox(obstacle);
    if (intersects(playerBox, hitbox)) {
      if (!obstacle.damage) {
        if (!obstacle.used) {
          obstacle.used = true;
          game.player.rainTimer = 3.2;
          flashMessage("Yağmur! Hız ve kontrol düştü");
          spawnSpark(game.player.x + 62, game.player.y + 34, "#65c7ff", 14);
        }
        continue;
      }
      spawnSpark(game.player.x + 42, game.player.y + 28, "#ff5b6e", 18);
      if (game.player.shield > 0) {
        game.player.shield = 0;
        obstacle.x = -obstacle.w - 100;
        flashMessage("Kask darbeyi aldı!");
        continue;
      }
      endGame();
      return;
    } else if (!obstacle.nearMiss && isNearMiss(playerBox, hitbox)) {
      obstacle.nearMiss = true;
      game.nearMisses += 1;
      game.runCoins += 2;
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
  if (obstacle.id === "bump") {
    return { x: obstacle.x + 18, y: WORLD.roadY - 26, w: obstacle.w - 36, h: 26 };
  }
  if (obstacle.id === "door") {
    return { x: obstacle.x + 58, y: obstacle.y + 38, w: obstacle.w - 78, h: obstacle.h - 44 };
  }
  if (obstacle.id === "seagull") {
    return { x: obstacle.x + 18, y: obstacle.y + 18, w: obstacle.w - 30, h: obstacle.h - 30 };
  }
  if (obstacle.id === "cloud") {
    return { x: obstacle.x + 18, y: obstacle.y + 44, w: obstacle.w - 36, h: 118 };
  }
  if (obstacle.id === "barrier") {
    return { x: obstacle.x + 18, y: obstacle.y + 24, w: obstacle.w - 36, h: obstacle.h - 30 };
  }
  return { x: obstacle.x + 16, y: obstacle.y + 12, w: obstacle.w - 32, h: obstacle.h - 22 };
}

function flashMessage(text) {
  game.message = text;
  game.messageTimer = 1.8;
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

function updateParticles(dt) {
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

function render() {
  camera = computeCamera();
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "#071327";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.translate(camera.offsetX, camera.offsetY);
  ctx.scale(camera.scale, camera.scale);
  drawWorld();
  ctx.restore();
  drawScreenHud();
}

function computeCamera() {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const aspect = screenW / screenH;
  const fitScale = Math.min(screenW / WORLD.width, screenH / WORLD.height);
  let scale = fitScale;
  let offsetX = (screenW - WORLD.width * scale) / 2;
  let offsetY = (screenH - WORLD.height * scale) / 2;

  if (aspect < 1.2) {
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
}

function drawBackground() {
  const city = currentCity();
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  sky.addColorStop(0, city.skyTop);
  sky.addColorStop(0.55, city.skyMid);
  sky.addColorStop(1, city.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  const asset = cityAssets[city.asset];
  if (asset && asset.complete && asset.naturalWidth > 0) {
    ctx.globalAlpha = 0.88;
    ctx.drawImage(asset, 0, 0, WORLD.width, WORLD.height);
    ctx.globalAlpha = 1;
  } else {
    drawSkyMarker(city);
    drawCityLayer(0.18, 265, city.far, city.id === "mexicoCity" ? 52 : 70, city);
    drawCityLayer(0.36, 330, city.near, city.id === "mexicoCity" ? 72 : 92, city);
  }
  drawRainReflections(city);
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

function drawHud() {
  if (state !== "playing") return;
  roundRect(18, 16, 206, 42, 8, "rgba(4, 9, 18, 0.55)", "rgba(255,255,255,0.12)");
  roundRect(WORLD.width - 186, 16, 168, 42, 8, "rgba(4, 9, 18, 0.55)", "rgba(255,255,255,0.12)");
  roundRect(WORLD.width / 2 - 78, 16, 156, 42, 8, "rgba(4, 9, 18, 0.55)", "rgba(255,255,255,0.12)");
  ctx.fillStyle = "#f9fbff";
  ctx.font = "800 18px system-ui";
  ctx.textAlign = "left";
  ctx.fillText(`Skor: ${Math.floor(game.distance)} m`, 34, 43);
  ctx.textAlign = "center";
  ctx.fillText(`${currentSpeedKmh()} km/s`, WORLD.width / 2, 43);
  ctx.textAlign = "right";
  ctx.fillText(`Coin: ${game.runCoins}`, WORLD.width - 34, 43);
  drawActivePowerHud();
  if (game.messageTimer > 0) {
    ctx.globalAlpha = clamp(game.messageTimer, 0, 1);
    roundRect(345, 70, 270, 42, 8, "rgba(255, 178, 56, 0.9)");
    ctx.fillStyle = "#241000";
    ctx.textAlign = "center";
    ctx.font = "900 17px system-ui";
    ctx.fillText(game.message, 480, 97);
    ctx.globalAlpha = 1;
  }
}

function drawScreenHud() {
  if (state !== "playing") return;
  ctx.save();
  const compact = window.innerWidth < 560;
  const pad = compact ? 10 : 18;
  const top = compact ? 10 : 16;
  const pillH = compact ? 34 : 42;
  const gap = compact ? 8 : 10;

  if (compact) {
    drawHudPill(pad, top, 142, pillH, `Mesafe ${Math.floor(game.distance)} m`, "left");
    drawHudPill(window.innerWidth - pad - 104, top, 104, pillH, `${currentSpeedKmh()} km/s`, "center");
    drawHudPill(pad, top + pillH + gap, 118, pillH, `Paket ${game.deliveries}`, "left", "#ffb238");
    drawHudPill(window.innerWidth - pad - 104, top + pillH + gap, 104, pillH, `Coin ${game.runCoins}`, "right");
    drawScreenPowerHud(pad, top + (pillH + gap) * 2);
  } else {
    drawHudPill(18, 16, 206, 42, `Skor: ${Math.floor(game.distance)} m`, "left");
    drawHudPill(window.innerWidth / 2 - 78, 16, 156, 42, `${currentSpeedKmh()} km/s`, "center");
    drawHudPill(window.innerWidth - 356, 16, 154, 42, `Paket: ${game.deliveries}`, "center", "#ffb238");
    drawHudPill(window.innerWidth - 186, 16, 168, 42, `Coin: ${game.runCoins}`, "right");
    drawScreenPowerHud(18, 66);
  }

  if (game.messageTimer > 0) {
    const width = compact ? Math.min(window.innerWidth - 24, 300) : 300;
    const x = window.innerWidth / 2 - width / 2;
    const y = compact ? window.innerHeight - 76 : 76;
    ctx.globalAlpha = clamp(game.messageTimer, 0, 1);
    roundRect(x, y, width, 42, 8, "rgba(255, 178, 56, 0.92)");
    ctx.fillStyle = "#241000";
    ctx.textAlign = "center";
    ctx.font = `900 ${compact ? 14 : 17}px system-ui`;
    ctx.fillText(game.message, x + width / 2, y + 27);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawHudPill(x, y, w, h, text, align, accent) {
  roundRect(x, y, w, h, 8, "rgba(4, 9, 18, 0.68)", accent || "rgba(255,255,255,0.14)");
  ctx.fillStyle = accent || "#f9fbff";
  ctx.font = `800 ${window.innerWidth < 560 ? 13 : 18}px system-ui`;
  ctx.textAlign = align;
  const textX = align === "left" ? x + 12 : align === "right" ? x + w - 12 : x + w / 2;
  ctx.fillText(text, textX, y + h / 2 + (window.innerWidth < 560 ? 5 : 7));
}

function drawScreenPowerHud(x, y) {
  const items = [];
  if (game.player.shield > 0) items.push({ text: "Kask", color: "#65c7ff" });
  if (game.player.turboTimer > 0) items.push({ text: `Turbo ${Math.ceil(game.player.turboTimer)}`, color: "#ffb238" });
  if (game.player.magnetTimer > 0) items.push({ text: `Mıknatıs ${Math.ceil(game.player.magnetTimer)}`, color: "#ff5bcb" });
  if (game.player.rainTimer > 0) items.push({ text: `Yağmur ${Math.ceil(game.player.rainTimer)}`, color: "#65c7ff" });
  let cursorX = x;
  for (const item of items) {
    const width = 68 + item.text.length * 4;
    roundRect(cursorX, y, width, 28, 8, "rgba(4, 9, 18, 0.68)", item.color);
    ctx.fillStyle = item.color;
    ctx.font = "800 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(item.text, cursorX + width / 2, y + 18);
    cursorX += width + 8;
  }
}

function currentSpeedKmh() {
  return Math.max(0, Math.round(game.speed * 0.34));
}

function drawActivePowerHud() {
  const items = [];
  if (game.player.shield > 0) items.push({ text: "Kask", color: "#65c7ff" });
  if (game.player.turboTimer > 0) items.push({ text: `Turbo ${Math.ceil(game.player.turboTimer)}`, color: "#ffb238" });
  if (game.player.magnetTimer > 0) items.push({ text: `Mıknatıs ${Math.ceil(game.player.magnetTimer)}`, color: "#ff5bcb" });
  if (game.player.rainTimer > 0) items.push({ text: `Yağmur ${Math.ceil(game.player.rainTimer)}`, color: "#65c7ff" });
  let x = 18;
  for (const item of items) {
    const width = 74 + item.text.length * 3;
    roundRect(x, 66, width, 28, 8, "rgba(4, 9, 18, 0.55)", item.color);
    ctx.fillStyle = item.color;
    ctx.font = "800 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(item.text, x + width / 2, 84);
    x += width + 8;
  }
}

function drawPlayer() {
  const player = game.player;
  const motor = currentMotor();
  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
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
    ctx.drawImage(selectedMotorAsset, -22, -16, 178, 120);
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
    ctx.fillStyle = powerup.color;
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#101827";
    ctx.font = "900 15px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(powerup.icon, 0, 1);
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
      case "bump":
        drawBump(obstacle);
        break;
      default:
        roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 8, "#ff5b6e");
    }
  }
}

function drawAssetObstacle(obstacle) {
  if (!obstacle.asset) return false;
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

function drawBump(o) {
  ctx.fillStyle = "#d6a650";
  ctx.beginPath();
  ctx.moveTo(o.x, o.y + o.h);
  ctx.quadraticCurveTo(o.x + o.w / 2, o.y - 6, o.x + o.w, o.y + o.h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  ctx.stroke();
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
  ctx.drawImage(image, x, y, w, h);
  return true;
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

ui.startBtn.addEventListener("click", startGame);
ui.restartBtn.addEventListener("click", startGame);
ui.shopBtn.addEventListener("click", () => showScreen("shop"));
ui.goShopBtn.addEventListener("click", () => showScreen("shop"));
ui.closeShopBtn.addEventListener("click", () => showScreen("menu"));
ui.backMenuBtn.addEventListener("click", () => showScreen("menu"));
ui.motorsTab.addEventListener("click", () => {
  shopTab = "motors";
  renderShop();
});
ui.citiesTab.addEventListener("click", () => {
  shopTab = "cities";
  renderShop();
});

canvas.addEventListener("pointerdown", pointerDown, { passive: false });
window.addEventListener("pointerup", pointerUp, { passive: false });
window.addEventListener("pointercancel", pointerUp, { passive: false });
window.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.code === "ArrowUp") {
    event.preventDefault();
    if (state === "menu" || state === "gameOver") startGame();
    inputDown = true;
    if (state === "playing") {
      const impulse = game.player.grounded ? WORLD.lift * 0.86 : WORLD.lift * 0.62;
      game.player.vy = Math.min(game.player.vy, impulse);
      game.player.grounded = false;
    }
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space" || event.code === "ArrowUp") {
    inputDown = false;
  }
});
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
syncUi();
requestAnimationFrame(loop);
