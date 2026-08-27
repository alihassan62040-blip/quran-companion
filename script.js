/* ===================== Quran Companion — script.js ===================== */

const QURAN_BASE = "https://api.alquran.cloud/v1";
const TAFSIR_BASE = "https://api.quran.com/api/v4";
const ALADHAN_BASE = "https://api.aladhan.com/v1";
const CDN_AUDIO_SURAH = "https://cdn.islamic.network/quran/audio-surah/128";

let state = {
  surahList: [],
  currentSurahNumber: null,
  currentJuz: null,
  currentAyahs: [],
  translation: localStorage.getItem("translation") || "ur.jalandhry",
  reciter: localStorage.getItem("reciter") || "ar.alafasy",
  fontSize: localStorage.getItem("fontSize") || 36,
  fontFamily: localStorage.getItem("fontFamily") || "'Amiri',serif",
  playIndex: -1,
  isPlaying: false
};

/* ---------- helpers ---------- */
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 2500);
}
function showSection(id) {
  document.querySelectorAll("main > section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
function setTitle(t) { document.getElementById("headerTitle").textContent = t; }
async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("network");
  return res.json();
}

/* ---------- theme ---------- */
function applyTheme() {
  const light = localStorage.getItem("theme") === "light";
  document.body.classList.toggle("light", light);
  document.getElementById("themeBtn").textContent = light ? "☀️" : "🌙";
}
function toggleTheme() {
  const light = localStorage.getItem("theme") === "light";
  localStorage.setItem("theme", light ? "dark" : "light");
  applyTheme();
}

/* ---------- navigation ---------- */
function goHome() { showSection("home"); setTitle("قرآن کریم"); }
function toggleSettings() { document.getElementById("settings")?.classList.toggle("hidden"); }

/* ===================== QURAN — SURAH LIST ===================== */
async function openQuran() {
  showSection("quran");
  setTitle("قرآن کریم");
  if (state.surahList.length) { renderSurahList(state.surahList); return; }
  try {
    const data = await getJSON(`${QURAN_BASE}/surah`);
    state.surahList = data.data;
    renderSurahList(state.surahList);
  } catch (e) {
    document.getElementById("surahList").innerHTML = `<div class="loading">لوڈ نہیں ہو سکا۔ انٹرنیٹ چیک کریں۔ <br><button class="btn" onclick="openQuran()">دوبارہ کوشش کریں</button></div>`;
  }
}
function renderSurahList(list) {
  document.getElementById("surahList").innerHTML =
    `<div class="surah-list">${list.map(s => `
      <button class="surah" onclick="openSurah(${s.number})">
        <div class="surah-number">${s.number}</div>
        <div class="surah-name">
          <strong>${s.name}</strong>
          <small>${s.englishName} — ${s.englishNameTranslation} · ${s.numberOfAyahs} آیات</small>
        </div>
      </button>`).join("")}</div>`;
}
function filterSurahs() {
  const q = document.getElementById("surahSearch").value.trim().toLowerCase();
  if (!q) { renderSurahList(state.surahList); return; }
  if (/^\d+\s*:\s*\d+$/.test(q)) return; // looks like ayah ref, wait for Enter
  renderSurahList(state.surahList.filter(s =>
    s.englishName.toLowerCase().includes(q) ||
    s.englishNameTranslation.toLowerCase().includes(q) ||
    s.name.includes(q) || String(s.number) === q));
}
function trySearchAyah() {
  const q = document.getElementById("surahSearch").value.trim();
  const m = q.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);
  if (!m) return;
  const surahNum = Number(m[1]), ayahNum = Number(m[2]);
  const s = state.surahList.find(x => x.number === surahNum);
  if (!s) { toast("سورہ نمبر غلط ہے"); return; }
  if (ayahNum < 1 || ayahNum > s.numberOfAyahs) { toast("آیت نمبر غلط ہے"); return; }
  openSurah(surahNum, ayahNum);
}
function backToSurahs() { showSection("quran"); setTitle("قرآن کریم"); }

/* ===================== JUZ (PARA) ===================== */
function openJuzList() {
  showSection("juzList");
  setTitle("پارہ منتخب کریں");
  const grid = document.getElementById("juzGrid");
  let html = "";
  for (let i = 1; i <= 30; i++) {
    html += `<button class="juz-item" onclick="openJuz(${i})">${i}<small>پارہ</small></button>`;
  }
  grid.innerHTML = html;
}
async function openJuz(juzNumber) {
  showSection("reader");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("fullSurahBtn").classList.add("hidden");
  document.getElementById("ayahContainer").innerHTML = `<div class="loading">لوڈ ہو رہا ہے...</div>`;
  state.currentSurahNumber = null;
  state.currentJuz = juzNumber;
  setTitle(`پارہ ${juzNumber}`);
  document.getElementById("readerTitle").textContent = `پارہ ${juzNumber}`;
  try {
    const editions = `quran-uthmani,${state.translation},${state.reciter}`;
    const data = await getJSON(`${QURAN_BASE}/juz/${juzNumber}/editions/${editions}`);
    const [arabicEd, transEd, audioEd] = data.data;
    state.currentAyahs = arabicEd.ayahs.map((a, i) => ({
      numberInSurah: a.numberInSurah,
      globalNumber: a.number,
      surahNumber: a.surah ? a.surah.number : null,
      surahName: a.surah ? a.surah.name : "",
      arabic: a.text,
      translation: transEd.ayahs[i].text,
      audio: audioEd.ayahs[i].audio
    }));
    renderAyahs(true);
  } catch (e) {
    document.getElementById("ayahContainer").innerHTML = `<div class="loading">لوڈ نہیں ہو سکا۔ <button class="btn" onclick="openJuz(${juzNumber})">دوبارہ کوشش کریں</button></div>`;
  }
}

/* ===================== READER (SURAH) ===================== */
async function openSurah(number, scrollToAyah) {
  showSection("reader");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("fullSurahBtn").classList.remove("hidden");
  document.getElementById("ayahContainer").innerHTML = `<div class="loading">لوڈ ہو رہا ہے...</div>`;
  document.getElementById("translationSelect").value = state.translation;
  document.getElementById("reciterSelect").value = state.reciter;
  document.getElementById("fontSize").value = state.fontSize;
  document.getElementById("fontFamilySelect").value = state.fontFamily;
  state.currentSurahNumber = number;
  state.currentJuz = null;
  localStorage.setItem("lastSurah", number);
  try {
    const editions = `quran-uthmani,${state.translation},${state.reciter}`;
    const data = await getJSON(`${QURAN_BASE}/surah/${number}/editions/${editions}`);
    const [arabicEd, transEd, audioEd] = data.data;
    setTitle(arabicEd.name);
    document.getElementById("readerTitle").textContent = arabicEd.englishName + " — " + arabicEd.name;
    state.currentAyahs = arabicEd.ayahs.map((a, i) => ({
      numberInSurah: a.numberInSurah,
      globalNumber: a.number,
      surahNumber: number,
      surahName: arabicEd.name,
      arabic: a.text,
      translation: transEd.ayahs[i].text,
      audio: audioEd.ayahs[i].audio
    }));
    renderAyahs(false);
    if (scrollToAyah) {
      setTimeout(() => {
        const el = document.getElementById("ayah-" + scrollToAyah);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  } catch (e) {
    document.getElementById("ayahContainer").innerHTML = `<div class="loading">لوڈ نہیں ہو سکا۔ <button class="btn" onclick="openSurah(${number})">دوبارہ کوشش کریں</button></div>`;
  }
}

function renderAyahs(isJuz) {
  let bismillah = "";
  if (!isJuz) {
    const s = state.surahList.find(x => x.number === state.currentSurahNumber);
    if (s && state.currentSurahNumber !== 1 && state.currentSurahNumber !== 9) {
      bismillah = `<div class="ayah" style="text-align:center"><div class="arabic" style="font-size:${state.fontSize}px;font-family:${state.fontFamily}">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div></div>`;
    }
  }
  const savedList = getBookmarks();
  document.getElementById("ayahContainer").innerHTML = bismillah + state.currentAyahs.map((a, i) => {
    const isSaved = savedList.some(b => b.globalNumber === a.globalNumber);
    const juzHeader = isJuz && (i === 0 || state.currentAyahs[i - 1].surahNumber !== a.surahNumber)
      ? `<div class="reader-top" style="margin-top:6px"><h2>${a.surahName}</h2><span></span></div>` : "";
    return `${juzHeader}
    <div class="ayah" id="ayah-${a.globalNumber}">
      <div class="ayah-top">
        <div class="ayah-number">${a.numberInSurah}</div>
        <div class="ayah-actions">
          <button class="icon-btn" onclick="playFromIndex(${i})" title="سنیں">🔊</button>
          <button class="icon-btn ${isSaved ? "saved" : ""}" id="bm-${a.globalNumber}" onclick="toggleBookmark(${a.globalNumber})" title="محفوظ کریں">⭐</button>
        </div>
      </div>
      <div class="arabic" style="font-size:${state.fontSize}px;font-family:${state.fontFamily}">${a.arabic}</div>
      <div class="translation"><div class="translation-title">ترجمہ</div>${a.translation}</div>
      <button class="tafseer-btn" onclick="toggleTafseer(${a.globalNumber}, ${a.surahNumber}, ${a.numberInSurah})">📘 تفسیر دیکھیں</button>
      <div class="tafseer hidden" id="tafseer-${a.globalNumber}"></div>
    </div>`;
  }).join("");
}

function changeArabicSize(v) {
  state.fontSize = v;
  localStorage.setItem("fontSize", v);
  document.querySelectorAll(".arabic").forEach(el => el.style.fontSize = v + "px");
}
function changeFontFamily(v) {
  state.fontFamily = v;
  localStorage.setItem("fontFamily", v);
  document.querySelectorAll(".arabic").forEach(el => el.style.fontFamily = v);
}
function changeTranslation(v) {
  state.translation = v;
  localStorage.setItem("translation", v);
  if (state.currentJuz) openJuz(state.currentJuz); else openSurah(state.currentSurahNumber);
}
function changeReciter(v) {
  state.reciter = v;
  localStorage.setItem("reciter", v);
  if (state.currentJuz) openJuz(state.currentJuz); else openSurah(state.currentSurahNumber);
}

/* ---------- tafseer ---------- */
let tafsirEditionId = null;
async function toggleTafseer(globalAyahNumber, surahNumber, ayahInSurah) {
  const box = document.getElementById("tafseer-" + globalAyahNumber);
  if (!box.classList.contains("hidden")) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  if (box.dataset.loaded) return;
  box.innerHTML = `<div class="loading">تفسیر لوڈ ہو رہی ہے...</div>`;
  try {
    if (!tafsirEditionId) {
      const list = await getJSON(`${TAFSIR_BASE}/resources/tafsirs?language=urdu`);
      const urdu = (list.tafsirs || []).find(t => t.language_name === "urdu") || (list.tafsirs || [])[0];
      tafsirEditionId = urdu ? urdu.id : null;
    }
    if (!tafsirEditionId) throw new Error("no tafsir edition");
    const key = `${surahNumber}:${ayahInSurah}`;
    const tf = await getJSON(`${TAFSIR_BASE}/tafsirs/${tafsirEditionId}/by_ayah/${key}`);
    const text = tf.tafsir ? tf.tafsir.text : "تفسیر دستیاب نہیں۔";
    box.innerHTML = text.replace(/<[^>]*>/g, " ");
    box.dataset.loaded = "1";
  } catch (e) {
    box.innerHTML = `تفسیر لوڈ نہیں ہو سکی۔ انٹرنیٹ چیک کریں یا دوبارہ کوشش کریں۔`;
  }
}

/* ===================== BOOKMARKS (multiple) ===================== */
function getBookmarks() {
  try { return JSON.parse(localStorage.getItem("bookmarks") || "[]"); } catch (e) { return []; }
}
function saveBookmarks(list) { localStorage.setItem("bookmarks", JSON.stringify(list)); }

function toggleBookmark(globalAyahNumber) {
  const a = state.currentAyahs.find(x => x.globalNumber === globalAyahNumber);
  if (!a) return;
  let list = getBookmarks();
  const idx = list.findIndex(b => b.globalNumber === globalAyahNumber);
  const btn = document.getElementById("bm-" + globalAyahNumber);
  if (idx >= 0) {
    list.splice(idx, 1);
    btn.classList.remove("saved");
    toast("محفوظ شدہ سے ہٹا دیا گیا");
  } else {
    list.unshift({
      globalNumber: a.globalNumber,
      surahNumber: a.surahNumber,
      surahName: a.surahName,
      numberInSurah: a.numberInSurah,
      savedAt: Date.now()
    });
    btn.classList.add("saved");
    toast("محفوظ کر لیا گیا ✓");
  }
  saveBookmarks(list);
  localStorage.setItem("lastSurah", a.surahNumber);
  localStorage.setItem("lastAyah", a.numberInSurah);
}

function openBookmarks() {
  showSection("bookmarksSection");
  setTitle("محفوظ شدہ مقامات");
  const list = getBookmarks();
  const container = document.getElementById("bookmarksList");
  if (!list.length) {
    container.innerHTML = `<div class="loading">ابھی کوئی مقام محفوظ نہیں۔ کسی آیت پر ⭐ دبا کر محفوظ کریں۔</div>`;
    return;
  }
  container.innerHTML = list.map(b => `
    <div class="bookmark-card">
      <button class="bookmark-del" onclick="removeBookmark(${b.globalNumber}, event)">🗑</button>
      <button class="bookmark-info" style="background:none;border:0;color:inherit" onclick="openSurah(${b.surahNumber}, ${b.numberInSurah})">
        <strong>${b.surahName} — آیت ${b.numberInSurah}</strong>
        <small>${new Date(b.savedAt).toLocaleDateString("ur")}</small>
      </button>
    </div>`).join("");
}
function removeBookmark(globalAyahNumber, e) {
  e.stopPropagation();
  let list = getBookmarks().filter(b => b.globalNumber !== globalAyahNumber);
  saveBookmarks(list);
  openBookmarks();
}
function continueReading() {
  const s = localStorage.getItem("lastSurah");
  const a = localStorage.getItem("lastAyah");
  if (!s) { toast("ابھی کوئی محفوظ شدہ مقام نہیں"); openQuran(); return; }
  openSurah(Number(s), a ? Number(a) : null);
}

/* ---------- audio player (per-ayah) ---------- */
const audioEl = () => document.getElementById("audioEl");
function playFromIndex(i) {
  state.playIndex = i;
  playCurrent();
}
function playCurrent() {
  const a = state.currentAyahs[state.playIndex];
  if (!a) return;
  document.getElementById("audioPlayer").classList.remove("hidden");
  document.getElementById("audioTitle").textContent = `${a.surahName} — آیت ${a.numberInSurah}`;
  document.querySelectorAll(".ayah").forEach(el => el.classList.remove("current"));
  document.getElementById("ayah-" + a.globalNumber)?.classList.add("current");
  document.getElementById("ayah-" + a.globalNumber)?.scrollIntoView({ behavior: "smooth", block: "center" });
  audioEl().src = a.audio;
  audioEl().play();
  state.isPlaying = true;
  document.getElementById("playPauseBtn").textContent = "⏸";
  if (a.surahNumber) {
    localStorage.setItem("lastSurah", a.surahNumber);
    localStorage.setItem("lastAyah", a.numberInSurah);
  }
}
function playFullSurah() {
  if (!state.currentSurahNumber) return;
  document.getElementById("audioPlayer").classList.remove("hidden");
  document.getElementById("audioTitle").textContent = `پوری سورت — مسلسل تلاوت`;
  document.querySelectorAll(".ayah").forEach(el => el.classList.remove("current"));
  state.playIndex = -1;
  audioEl().src = `${CDN_AUDIO_SURAH}/${state.reciter}/${state.currentSurahNumber}.mp3`;
  audioEl().play();
  state.isPlaying = true;
  document.getElementById("playPauseBtn").textContent = "⏸";
}
function togglePlay() {
  if (!audioEl().src) return;
  if (state.isPlaying) { audioEl().pause(); state.isPlaying = false; document.getElementById("playPauseBtn").textContent = "▶"; }
  else { audioEl().play(); state.isPlaying = true; document.getElementById("playPauseBtn").textContent = "⏸"; }
}
function nextAyah() {
  if (state.playIndex >= 0 && state.playIndex < state.currentAyahs.length - 1) { state.playIndex++; playCurrent(); }
}
function prevAyah() {
  if (state.playIndex > 0) { state.playIndex--; playCurrent(); }
}
function closeAudio() {
  audioEl().pause();
  document.getElementById("audioPlayer").classList.add("hidden");
  state.isPlaying = false;
}
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  const el = audioEl();
  el.addEventListener("ended", () => { if (state.playIndex >= 0) nextAyah(); });
  el.addEventListener("timeupdate", () => {
    if (el.duration) {
      document.getElementById("audioProgress").value = (el.currentTime / el.duration) * 100;
      document.getElementById("audioCur").textContent = fmtTime(el.currentTime);
      document.getElementById("audioDur").textContent = fmtTime(el.duration);
    }
  });
  document.getElementById("audioProgress").addEventListener("input", e => {
    if (el.duration) el.currentTime = (e.target.value / 100) * el.duration;
  });
});
function fmtTime(s) {
  s = Math.floor(s || 0);
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}

/* ===================== PRAYER TIMES ===================== */
function openPrayer() { showSection("prayer"); setTitle("نماز کے اوقات"); }
function loadPrayerTimes() {
  document.getElementById("prayerList").innerHTML = `<div class="loading">مقام معلوم کیا جا رہا ہے...</div>`;
  if (!navigator.geolocation) { toast("لوکیشن دستیاب نہیں"); return; }
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude, longitude } = pos.coords;
      const data = await getJSON(`${ALADHAN_BASE}/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
      const t = data.data.timings;
      const names = { Fajr: "فجر", Sunrise: "طلوع آفتاب", Dhuhr: "ظہر", Asr: "عصر", Maghrib: "مغرب", Isha: "عشاء" };
      const order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      let nextKey = null;
      for (const k of order) {
        const [h, m] = t[k].split(":").map(Number);
        if (h * 60 + m > nowMin) { nextKey = k; break; }
      }
      document.getElementById("prayerList").innerHTML = order.map(k =>
        `<div class="prayer ${k === nextKey ? "active" : ""}"><span>${names[k]}</span><span>${t[k]}</span></div>`
      ).join("") + `<p class="note">تاریخ: ${data.data.date.readable}</p>`;
    } catch (e) {
      document.getElementById("prayerList").innerHTML = `اوقات حاصل نہیں ہو سکے۔ دوبارہ کوشش کریں۔`;
    }
  }, () => {
    document.getElementById("prayerList").innerHTML = `لوکیشن کی اجازت نہیں ملی۔`;
  });
}

/* ===================== QIBLA ===================== */
function openQibla() { showSection("qibla"); setTitle("قبلہ"); }
function findQibla() {
  document.getElementById("qiblaText").textContent = "مقام معلوم کیا جا رہا ہے...";
  if (!navigator.geolocation) { toast("لوکیشن دستیاب نہیں"); return; }
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude, longitude } = pos.coords;
      const data = await getJSON(`${ALADHAN_BASE}/qibla/${latitude}/${longitude}`);
      const deg = data.data.direction;
      document.getElementById("compass").style.transform = `rotate(${deg}deg)`;
      document.getElementById("qiblaText").textContent = `قبلہ کی سمت: شمال سے ${deg.toFixed(1)}° (اپنے فون کے قطب نما کو اس زاویے پر ملائیں)`;
      enableOrientation(deg);
    } catch (e) {
      document.getElementById("qiblaText").textContent = "سمت معلوم نہیں ہو سکی۔ دوبارہ کوشش کریں۔";
    }
  }, () => {
    document.getElementById("qiblaText").textContent = "لوکیشن کی اجازت نہیں ملی۔";
  });
}
function enableOrientation(qiblaDeg) {
  if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
    DeviceOrientationEvent.requestPermission().then(r => {
      if (r === "granted") window.addEventListener("deviceorientation", e => handleOrientation(e, qiblaDeg));
    }).catch(() => {});
  } else {
    window.addEventListener("deviceorientation", e => handleOrientation(e, qiblaDeg));
  }
}
function handleOrientation(e, qiblaDeg) {
  const heading = e.webkitCompassHeading || (360 - e.alpha) || 0;
  const rel = (qiblaDeg - heading + 360) % 360;
  document.getElementById("compass").style.transform = `rotate(${rel}deg)`;
}

/* ---------- init ---------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
