const messages = ["85 days until my favorite panda is here with me again. 🐼💗 Until then, I'll be counting every single day."];

const FLIGHT = new Date("2026-12-12T00:00:00");
const ARRIVAL = new Date("2026-12-13T00:00:00");
const START = new Date("2026-09-18T00:00:00");

const $ = (id) => document.getElementById(id);
const dayMs = 86400000;

function daysUntilArrival(now = new Date()) {
  return Math.ceil((ARRIVAL - now) / dayMs);
}

function renderCountdown() {
  const now = new Date();
  let diff = ARRIVAL - now;

  if (diff <= 0) {
    $("countdownLabel").textContent = "BUBU IS IN TURKEY ❤️";
    ["days","hours","minutes","seconds"].forEach(id => $(id).textContent = "00");
    return;
  }

  const d = Math.floor(diff / dayMs);
  diff -= d * dayMs;
  const h = Math.floor(diff / 3600000);
  diff -= h * 3600000;
  const m = Math.floor(diff / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  $("days").textContent = String(d).padStart(2,"0");
  $("hours").textContent = String(h).padStart(2,"0");
  $("minutes").textContent = String(m).padStart(2,"0");
  $("seconds").textContent = String(s).padStart(2,"0");
}

function getState() {
  const now = new Date();
  const remaining = daysUntilArrival(now);

  if (now >= ARRIVAL) return { type:"arrival", remaining:0 };
  if (now >= FLIGHT) return { type:"flight", remaining:1 };
  return { type:"daily", remaining:Math.min(86, Math.max(1, remaining)) };
}

function messageForRemaining(remaining) {
  // messages[0] = day 86, messages[85] = day 1
  return messages[86 - remaining];
}

function renderLetter(selectedRemaining = null) {
  const state = getState();
  let type = state.type;
  let remaining = selectedRemaining ?? state.remaining;

  if (selectedRemaining !== null && selectedRemaining > state.remaining) {
    return;
  }

  if (type === "arrival" && selectedRemaining === null) {
    $("dayPill").textContent = "DECEMBER 13 • REUNION DAY";
    $("dayTitle").textContent = "Bubu is here. ❤️";
    $("message").textContent = messages[87];
    return;
  }

  if (type === "flight" && selectedRemaining === null) {
    $("dayPill").textContent = "DECEMBER 12 • FLIGHT DAY";
    $("dayTitle").textContent = "Bubu is flying. ✈️";
    $("message").textContent = messages[86];
    return;
  }

  $("dayPill").textContent = `DAY ${remaining}`;
  $("dayTitle").textContent = `For Bubu — ${remaining} days to go`;
  $("message").textContent = messageForRemaining(remaining);
  $("surprise").classList.add("hidden");
}

function buildCalendar() {
  const calendar = $("calendar");
  calendar.innerHTML = "";
  const state = getState();

  for (let n = 86; n >= 1; n--) {
    const btn = document.createElement("button");
    btn.className = "day-btn";
    const unlocked = state.type === "arrival" || n >= state.remaining;
    if (!unlocked) btn.classList.add("locked");
    if (n === state.remaining && state.type === "daily") btn.classList.add("today");
    btn.innerHTML = `<span class="num">${n}</span><span class="small">${unlocked ? "open" : "locked"}</span>`;
    btn.title = unlocked ? `Open Day ${n}` : "This day hasn't arrived yet";
    btn.disabled = !unlocked;
    if (unlocked) btn.addEventListener("click", () => {
      renderLetter(n);
      document.querySelector(".letter-section").scrollIntoView({behavior:"smooth", block:"start"});
    });
    calendar.appendChild(btn);
  }

  const flight = document.createElement("button");
  flight.className = "day-btn special";
  flight.innerHTML = `<span class="num">✈️</span><span class="small">DEC 12 · FLIGHT</span>`;
  flight.disabled = new Date() < FLIGHT;
  if (!flight.disabled) flight.addEventListener("click", () => {
    $("dayPill").textContent = "DECEMBER 12 • FLIGHT DAY";
    $("dayTitle").textContent = "Bubu is flying. ✈️";
    $("message").textContent = messages[86];
    $("surprise").classList.add("hidden");
    document.querySelector(".letter-section").scrollIntoView({behavior:"smooth"});
  });
  calendar.appendChild(flight);

  const arrival = document.createElement("button");
  arrival.className = "day-btn special";
  arrival.innerHTML = `<span class="num">❤️</span><span class="small">DEC 13 · HERE</span>`;
  arrival.disabled = new Date() < ARRIVAL;
  if (!arrival.disabled) arrival.addEventListener("click", () => {
    $("dayPill").textContent = "DECEMBER 13 • REUNION DAY";
    $("dayTitle").textContent = "Bubu is here. ❤️";
    $("message").textContent = messages[87];
    $("surprise").classList.add("hidden");
    document.querySelector(".letter-section").scrollIntoView({behavior:"smooth"});
  });
  calendar.appendChild(arrival);
}

$("surpriseBtn").addEventListener("click", () => {
  $("surprise").classList.toggle("hidden");
  $("surpriseBtn").textContent = $("surprise").classList.contains("hidden")
    ? "Open a tiny surprise 💌" : "Hide the tiny surprise";
});

function makeHeart() {
  const h = document.createElement("div");

  h.className = "float-heart";

  // Cute heart styles
  const heartTypes = ["♥", "♡", "♥", "♡", "♥", "❤"];
  h.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];

  // Random position
  h.style.left = `${Math.random() * 100}%`;

  // Random speed
  h.style.animationDuration = `${7 + Math.random() * 7}s`;

  // Random size
  h.style.fontSize = `${12 + Math.random() * 18}px`;

  // Different pink shades
  const pinks = [
    "#ff4fa3",
    "#ff69b4",
    "#ff85c8",
    "#ff9ed6",
    "#ffb6e2",
    "#ffc4e1"
  ];

  h.style.color = pinks[Math.floor(Math.random() * pinks.length)];

  // Pink glowing outline
  h.style.textShadow = `
    0 0 4px #ff69b4,
    0 0 8px #ff69b4,
    0 0 14px rgba(255,105,180,.8),
    0 0 24px rgba(255,105,180,.5)
  `;

  document.querySelector(".hearts").appendChild(h);

  setTimeout(() => h.remove(), 15000);
}


// ==========================================
// 💗 FLOATING HEARTS
// ==========================================

// Start with 80 hearts
for (let i = 0; i < 80; i++) {
  setTimeout(() => makeHeart(), i * 100);
}

// Continuously create hearts
setInterval(makeHeart, 180);


// ==========================================
// ⏰ COUNTDOWN
// ==========================================

renderCountdown();
renderLetter();
buildCalendar();

setInterval(renderCountdown, 1000);

setInterval(() => {
  buildCalendar();
  renderLetter();
}, 60000);