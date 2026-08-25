/* ===================== Quran Companion — app.js ===================== */

const QURAN_BASE = "https://api.alquran.cloud/v1";
const CDN_AUDIO = "https://cdn.islamic.network/quran/audio";
const TAFSIR_BASE = "https://api.quran.com/api/v4";
const HADITH_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";
const ALADHAN_BASE = "https://api.aladhan.com/v1";

let state = {
  surahList: [],
  currentSurahNumber: null,
  currentAyahs: [],
  translation: localStorage.getItem("translation") || "ur.jalandhry",
  reciter: localStorage.getItem("reciter") || "ar.alafasy",
  fontSize: localStorage.getItem("fontSize") || 32,
  playIndex: -1,
  isPlaying: false,
  currentBook: null,
  hadithOffset: 0
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


/* ---------- navigation ---------- */
function goHome() { showSection("home"); setTitle("Quran Companion"); }
function toggleSettings() { document.getElementById("settings")?.classList.toggle("hidden"); }
function openAbout() { showSection("about"); setTitle("اسلامی معلومات"); }
function openKaaba() { showSection("kaaba"); setTitle("خانہ کعبہ"); }

/* ===================== QURAN ===================== */
async function openQuran() {
  showSection("quran");
  setTitle("قرآن مجید");
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
  renderSurahList(state.surahList.filter(s =>
    s.englishName.toLowerCase().includes(q) ||
    s.englishNameTranslation.toLowerCase().includes(q) ||
    s.name.includes(q) || String(s.number) === q));
}
function backToSurahs() { showSection("quran"); setTitle("قرآن مجید"); }

async function openSurah(number, scrollToAyah) {
  showSection("reader");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("ayahContainer").innerHTML = `<div class="loading">لوڈ ہو رہا ہے...</div>`;
  document.getElementById("translationSelect").value = state.translation;
  document.getElementById("reciterSelect").value = state.reciter;
  document.getElementById("fontSize").value = state.fontSize;
  document.documentElement.style.setProperty("--arSize", state.fontSize + "px");
  state.currentSurahNumber = number;
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
      arabic: a.text,
      translation: transEd.ayahs[i].text,
      audio: audioEd.ayahs[i].audio
    }));
    renderAyahs();
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

function renderAyahs() {
  const s = state.surahList.find(x => x.number === state.currentSurahNumber);
  let bismillah = "";
  if (s && state.currentSurahNumber !== 1 && state.currentSurahNumber !== 9) {
    bismillah = `<div class="ayah" style="text-align:center"><div class="arabic" style="font-size:${state.fontSize}px">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div></div>`;
  }
  document.getElementById("ayahContainer").innerHTML = bismillah + state.currentAyahs.map((a, i) => `
    <div class="ayah" id="ayah-${a.numberInSurah}">
      <div class="ayah-top">
        <div class="ayah-number">${a.numberInSurah}</div>
        <div class="ayah-actions">
          <button class="icon-btn" onclick="playFromIndex(${i})" title="سنیں">🔊</button>
          <button class="icon-btn" onclick="bookmarkAyah(${a.numberInSurah})" title="جاری رکھیں کے لیے محفوظ کریں">🔖</button>
        </div>
      </div>
      <div class="arabic" style="font-size:${state.fontSize}px">${a.arabic}</div>
      <div class="translation"><div class="translation-title">ترجمہ</div>${a.translation}</div>
      <button class="tafseer-btn" onclick="toggleTafseer(${a.globalNumber}, this)">📘 تفسیر دیکھیں</button>
      <div class="tafseer hidden" id="tafseer-${a.globalNumber}"></div>
    </div>`).join("");
}

function changeArabicSize(v) {
  state.fontSize = v;
  localStorage.setItem("fontSize", v);
  document.querySelectorAll(".arabic").forEach(el => el.style.fontSize = v + "px");
}
function changeTranslation(v) {
  state.translation = v;
  localStorage.setItem("translation", v);
  openSurah(state.currentSurahNumber);
}
function changeReciter(v) {
  state.reciter = v;
  localStorage.setItem("reciter", v);
  openSurah(state.currentSurahNumber);
}

let tafsirEditionId = null;
async function toggleTafseer(globalAyahNumber, btn) {
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
    // convert global ayah number -> surah:ayah key
    const s = state.currentSurahNumber;
    const ayahInSurah = state.currentAyahs.find(a => a.globalNumber === globalAyahNumber).numberInSurah;
    const key = `${s}:${ayahInSurah}`;
    const tf = await getJSON(`${TAFSIR_BASE}/tafsirs/${tafsirEditionId}/by_ayah/${key}`);
    const text = tf.tafsir ? tf.tafsir.text : "تفسیر دستیاب نہیں۔";
    box.innerHTML = text.replace(/<[^>]*>/g, " ");
    box.dataset.loaded = "1";
  } catch (e) {
    box.innerHTML = `تفسیر لوڈ نہیں ہو سکی۔ انٹرنیٹ چیک کریں یا دوبارہ کوشش کریں۔`;
  }
}

function bookmarkAyah(numberInSurah) {
  localStorage.setItem("lastSurah", state.currentSurahNumber);
  localStorage.setItem("lastAyah", numberInSurah);
  toast("محفوظ کر لیا گیا ✓");
}
function continueReading() {
  const s = localStorage.getItem("lastSurah");
  const a = localStorage.getItem("lastAyah");
  if (!s) { toast("ابھی کوئی محفوظ شدہ مقام نہیں"); openQuran(); return; }
  openSurah(Number(s), a ? Number(a) : null);
}

/* ---------- audio player ---------- */
const audioEl = () => document.getElementById("audioEl");
function playFromIndex(i) {
  state.playIndex = i;
  playCurrent();
}
function playCurrent() {
  const a = state.currentAyahs[state.playIndex];
  if (!a) return;
  document.getElementById("audioPlayer").classList.remove("hidden");
  document.getElementById("audioTitle").textContent = `آیت ${a.numberInSurah} — تلاوت`;
  document.querySelectorAll(".ayah").forEach(el => el.classList.remove("current"));
  document.getElementById("ayah-" + a.numberInSurah)?.classList.add("current");
  document.getElementById("ayah-" + a.numberInSurah)?.scrollIntoView({ behavior: "smooth", block: "center" });
  audioEl().src = a.audio;
  audioEl().play();
  state.isPlaying = true;
  document.getElementById("playPauseBtn").textContent = "⏸";
  localStorage.setItem("lastSurah", state.currentSurahNumber);
  localStorage.setItem("lastAyah", a.numberInSurah);
}
function togglePlay() {
  if (!audioEl().src) return;
  if (state.isPlaying) { audioEl().pause(); state.isPlaying = false; document.getElementById("playPauseBtn").textContent = "▶"; }
  else { audioEl().play(); state.isPlaying = true; document.getElementById("playPauseBtn").textContent = "⏸"; }
}
function nextAyah() {
  if (state.playIndex < state.currentAyahs.length - 1) { state.playIndex++; playCurrent(); }
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
  const el = audioEl();
  el.addEventListener("ended", nextAyah);
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

/* ===================== HADITH ===================== */
const HADITH_BOOKS = [
  { key: "bukhari", ur: "صحیح بخاری", ara: "ara-bukhari", urd: "urd-bukhari1" },
  { key: "muslim", ur: "صحیح مسلم", ara: "ara-muslim", urd: "urd-muslim" },
  { key: "abudawud", ur: "سنن ابو داؤد", ara: "ara-abudawud", urd: "urd-abudawud" },
  { key: "tirmidhi", ur: "جامع ترمذی", ara: "ara-tirmidhi", urd: "urd-tirmidhi" },
  { key: "nasai", ur: "سنن نسائی", ara: "ara-nasai", urd: "urd-nasai" },
  { key: "ibnmajah", ur: "سنن ابن ماجہ", ara: "ara-ibnmajah", urd: "urd-ibnmajah" }
];
function openHadith() {
  showSection("hadithBooks");
  setTitle("کتب حدیث");
  document.getElementById("bookList").innerHTML = HADITH_BOOKS.map(b => `
    <button class="book" onclick="openHadithBook('${b.key}')">
      <div class="surah-number">📗</div>
      <div class="surah-name"><strong>${b.ur}</strong></div>
    </button>`).join("");
}
function backToBooks() { showSection("hadithBooks"); setTitle("کتب حدیث"); }

async function openHadithBook(key) {
  const book = HADITH_BOOKS.find(b => b.key === key);
  state.currentBook = book;
  state.hadithOffset = 0;
  showSection("hadithReader");
  setTitle(book.ur);
  document.getElementById("hadithTitle").textContent = book.ur;
  document.getElementById("hadithContainer").innerHTML = `<div class="loading">حدیثیں لوڈ ہو رہی ہیں...</div>`;
  try {
    const [araData, urdData] = await Promise.all([
      getJSON(`${HADITH_BASE}/editions/${book.ara}.min.json`),
      getJSON(`${HADITH_BASE}/editions/${book.urd}.min.json`)
    ]);
    book.araHadiths = araData.hadiths;
    book.urdHadiths = urdData.hadiths;
    renderHadithBatch();
  } catch (e) {
    document.getElementById("hadithContainer").innerHTML = `<div class="loading">لوڈ نہیں ہو سکا۔ <button class="btn" onclick="openHadithBook('${key}')">دوبارہ کوشش کریں</button></div>`;
  }
}
function renderHadithBatch() {
  const book = state.currentBook;
  const batch = 15;
  const list = book.araHadiths.slice(state.hadithOffset, state.hadithOffset + batch);
  const container = document.getElementById("hadithContainer");
  if (state.hadithOffset === 0) container.innerHTML = "";
  const existingBtn = document.getElementById("loadMoreBtn");
  if (existingBtn) existingBtn.remove();
  list.forEach(h => {
    const urd = book.urdHadiths.find(u => u.hadithnumber === h.hadithnumber);
    const div = document.createElement("div");
    div.className = "hadith-card";
    const urText = urd ? urd.text : "اردو ترجمہ دستیاب نہیں";
    div.innerHTML = `
      <div class="hadith-num">حدیث نمبر ${h.hadithnumber}</div>
      <div class="hadith-ar">${h.text}</div>
      <div class="hadith-ur">${urText}</div>`;
    container.appendChild(div);
  });
  state.hadithOffset += batch;
  if (state.hadithOffset < book.araHadiths.length) {
    const btn = document.createElement("button");
    btn.id = "loadMoreBtn";
    btn.className = "load-more";
    btn.textContent = "مزید احادیث لوڈ کریں";
    btn.onclick = renderHadithBatch;
    container.appendChild(btn);
  }
}

/* ===================== SEERAH (curated text) ===================== */
const SEERAH_CHAPTERS = [
  { title: "ولادت اور بچپن", text: "نبی کریم ﷺ کی ولادت مکہ مکرمہ میں عام الفیل کے سال ہوئی۔ آپ ﷺ کے والد حضرت عبداللہ کا انتقال ولادت سے پہلے ہو چکا تھا۔ آپ ﷺ کی پرورش پہلے دائی حلیمہ سعدیہ کے ہاں ہوئی، پھر دادا عبدالمطلب اور بعد ازاں چچا ابوطالب نے آپ ﷺ کی کفالت کی۔" },
  { title: "نبوت سے پہلے کی زندگی", text: "جوانی میں آپ ﷺ اپنی صداقت اور امانت کی وجہ سے 'الصادق الامین' کے لقب سے مشہور ہوئے۔ آپ ﷺ نے تجارت کی اور حضرت خدیجہ رضی اللہ عنہا سے نکاح ہوا۔ آپ ﷺ اکثر غار حرا میں تنہائی میں عبادت کیا کرتے تھے۔" },
  { title: "نزول وحی اور آغاز نبوت", text: "چالیس سال کی عمر میں غار حرا میں آپ ﷺ پر پہلی وحی نازل ہوئی، جس میں سورۃ العلق کی ابتدائی آیات شامل تھیں۔ اس کے بعد اسلام کی دعوت کا آغاز ہوا، پہلے خفیہ طور پر اور پھر علی الاعلان۔" },
  { title: "مکی دور اور مشکلات", text: "مکہ میں دعوت اسلام پر مشرکین مکہ نے سخت مخالفت کی۔ مسلمانوں کو ظلم و ستم کا سامنا کرنا پڑا، جس کی وجہ سے کچھ صحابہ کرام حبشہ ہجرت کر گئے۔ اس دور میں حضرت خدیجہ اور ابوطالب کی وفات ہوئی، جسے 'عام الحزن' کہا جاتا ہے۔" },
  { title: "معراج النبی ﷺ", text: "نبوت کے گیارہویں سال آپ ﷺ کو معراج کا شرف حاصل ہوا، جس میں آپ ﷺ مسجد حرام سے مسجد اقصیٰ اور پھر آسمانوں کی سیر کو لے جائے گئے، اور اسی سفر میں پانچ وقت کی نماز فرض ہوئی۔" },
  { title: "ہجرت مدینہ", text: "مکہ میں مسلسل مظالم کے بعد آپ ﷺ نے حضرت ابوبکر رضی اللہ عنہ کے ساتھ مدینہ منورہ کی طرف ہجرت کی۔ یہ ہجرت اسلامی تاریخ کا اہم موڑ ہے اور اسی سے اسلامی کیلنڈر کا آغاز ہوتا ہے۔" },
  { title: "مدنی دور", text: "مدینہ میں آپ ﷺ نے مسجد نبوی کی تعمیر کی، مہاجرین اور انصار کے درمیان بھائی چارہ قائم کیا، اور ایک منظم اسلامی معاشرے کی بنیاد رکھی۔ اسی دور میں بدر، احد اور خندق جیسے اہم غزوات پیش آئے۔" },
  { title: "فتح مکہ", text: "ہجرت کے آٹھویں سال آپ ﷺ نے مکہ مکرمہ کو فتح کیا۔ اس عظیم فتح کے باوجود آپ ﷺ نے اپنے سب سے بڑے دشمنوں کو بھی عام معافی دے دی، جو آپ ﷺ کے عفو و درگزر کی روشن مثال ہے۔" },
  { title: "حجۃ الوداع اور وصال", text: "دس ہجری میں آپ ﷺ نے آخری حج ادا کیا اور خطبہ حجۃ الوداع ارشاد فرمایا، جس میں انسانی حقوق اور مساوات کے آفاقی اصول بیان کیے۔ اس کے کچھ عرصے بعد ربیع الاول میں آپ ﷺ کا وصال مدینہ منورہ میں ہوا۔" }
];
function openSeerah() {
  showSection("seerah");
  setTitle("سیرت النبی ﷺ");
  document.getElementById("seerahList").innerHTML = SEERAH_CHAPTERS.map((c, i) => `
    <div class="seerah-chapter">
      <h3>${i + 1}. ${c.title}</h3>
      <p>${c.text}</p>
    </div>`).join("");
}

/* ===================== DUAS ===================== */
const DUAS = [
  { title: "صبح کی دعا", ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", ur: "ہم نے صبح کی اور بادشاہت اللہ ہی کے لیے ہے۔" },
  { title: "شام کی دعا", ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", ur: "ہم نے شام کی اور بادشاہت اللہ ہی کے لیے ہے۔" },
  { title: "کھانے سے پہلے کی دعا", ar: "بِسْمِ اللَّهِ", ur: "اللہ کے نام سے (کھانا شروع کرتا ہوں)۔" },
  { title: "کھانے کے بعد کی دعا", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", ur: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھلایا اور بغیر میری طاقت اور قوت کے یہ رزق عطا کیا۔" },
  { title: "گھر سے نکلنے کی دعا", ar: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", ur: "اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اور کوئی طاقت و قوت نہیں مگر اللہ کی مدد سے۔" },
  { title: "سونے سے پہلے کی دعا", ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", ur: "اے اللہ تیرے نام کے ساتھ میں مرتا اور جیتا ہوں۔" },
  { title: "سفر کی دعا", ar: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", ur: "پاک ہے وہ ذات جس نے اس سواری کو ہمارے تابع کیا، ورنہ ہم اسے قابو میں لانے والے نہ تھے۔" },
  { title: "مصیبت کے وقت کی دعا", ar: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ", ur: "بے شک ہم اللہ ہی کے ہیں اور اسی کی طرف لوٹنے والے ہیں۔" }
];
function openDuas() {
  showSection("duas");
  setTitle("مسنون دعائیں");
  document.getElementById("duasList").innerHTML = DUAS.map(d => `
    <div class="dua">
      <div class="dua-title">${d.title}</div>
      <div class="arabic">${d.ar}</div>
      <div class="translation"><div class="translation-title">ترجمہ</div>${d.ur}</div>
    </div>`).join("");
}

/* ===================== TASBEEH ===================== */
function openTasbeeh() {
  showSection("tasbeeh");
  setTitle("تسبیح");
  document.getElementById("tasbeehCount").textContent = localStorage.getItem("tasbeehCount") || "0";
}
function countTasbeeh() {
  let c = Number(localStorage.getItem("tasbeehCount") || 0) + 1;
  localStorage.setItem("tasbeehCount", c);
  document.getElementById("tasbeehCount").textContent = c;
  if (navigator.vibrate) navigator.vibrate(15);
}
function resetTasbeeh() {
  localStorage.setItem("tasbeehCount", 0);
  document.getElementById("tasbeehCount").textContent = 0;
}

/* ===================== PRAYER TIMES ===================== */
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
document.documentElement.style.setProperty("--arSize", state.fontSize + "px");
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
