"use strict";

/* =========================================================
   QURAN COMPANION — FINAL SCRIPT
   Matches the HTML provided by user
========================================================= */

const QURAN_API = "https://api.alquran.cloud/v1";
const QURAN_COM_API = "https://api.quran.com/api/v4";
const AUDIO_BASE =
  "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

let surahs = [];
let verses = [];

let currentSurah = null;
let currentAyahIndex = 0;

let translationId =
  localStorage.getItem("translationId") || "ur.jalandhry";

let arabicFontSize =
  Number(localStorage.getItem("arabicFontSize")) || 32;

let tasbeeh =
  Number(localStorage.getItem("tasbeeh")) || 0;

let tafsirResourceId = null;

const audio = new Audio();
audio.preload = "auto";

/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  updateTasbeeh();

  const font = document.getElementById("fontSize");
  if (font) font.value = arabicFontSize;

  const translation =
    document.getElementById("translationSelect");

  if (translation) {
    translation.value = translationId;
  }

  audio.addEventListener("ended", () => {
    nextAudio(true);
  });

  audio.addEventListener("timeupdate", updateAudioTime);

  audio.addEventListener("loadedmetadata", updateAudioTime);

  audio.addEventListener("play", () => {
    const btn = document.getElementById("mainPlay");
    if (btn) btn.textContent = "⏸️";
  });

  audio.addEventListener("pause", () => {
    const btn = document.getElementById("mainPlay");
    if (btn) btn.textContent = "▶️";
  });

  loadSurahs();
});

/* =========================================================
   SCREENS
========================================================= */

function hideAllScreens() {

  [
    "home",
    "quran",
    "reader",
    "duas",
    "tasbeeh",
    "prayer",
    "qibla",
    "kaaba",
    "about"
  ].forEach(id => {

    const el = document.getElementById(id);

    if (el) {
      el.classList.add("hidden");
    }

  });
}

function setHeader(title) {

  const el = document.getElementById("headerTitle");

  if (el) {
    el.textContent = title;
  }
}

function goHome() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("home");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("Quran Companion");
}

function openQuran() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("quran");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("قرآن");

  if (!surahs.length) {
    loadSurahs();
  }
}

function backToSurahs() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("quran");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("قرآن");
}

function openDuas() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("duas");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("دعائیں");

  renderDuas();
}

function openTasbeeh() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("tasbeeh");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("تسبیح");

  updateTasbeeh();
}

function openPrayer() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("prayer");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("نماز کے اوقات");
}

function openQibla() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("qibla");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("قبلہ");
}

function openKaaba() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("kaaba");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("خانہ کعبہ");
}

function openAbout() {

  stopAudio();
  hideAllScreens();

  const el = document.getElementById("about");

  if (el) {
    el.classList.remove("hidden");
  }

  setHeader("اسلامی معلومات");
}

function toggleSettings() {

  const settings =
    document.getElementById("settings");

  if (settings) {
    settings.classList.toggle("hidden");
  }
}

/* =========================================================
   SURAH LIST
========================================================= */

async function loadSurahs() {

  const list =
    document.getElementById("surahList");

  if (!list) return;

  list.innerHTML =
    `<div class="loading">
      سورتیں لوڈ ہو رہی ہیں...
    </div>`;

  try {

    const response =
      await fetch(`${QURAN_API}/surah`);

    if (!response.ok) {
      throw new Error("Surah API failed");
    }

    const result =
      await response.json();

    if (!result.data) {
      throw new Error("Invalid API response");
    }

    surahs = result.data;

    renderSurahs(surahs);

  } catch (error) {

    console.error(error);

    list.innerHTML = `
      <div class="card">
        سورتیں لوڈ نہیں ہو سکیں۔
        <br><br>
        Internet چیک کریں۔
        <br><br>
        <button
          class="primary"
          onclick="loadSurahs()">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;
  }
}

function renderSurahs(data) {

  const list =
    document.getElementById("surahList");

  if (!list) return;

  if (!data.length) {

    list.innerHTML =
      `<div class="loading">
        کوئی سورت نہیں ملی۔
      </div>`;

    return;
  }

  list.innerHTML =
    data.map(surah => `

      <button
        class="surah"
        type="button"
        onclick="openSurah(${surah.number})">

        <div class="surah-number">
          ${surah.number}
        </div>

        <div class="surah-name">

          <strong>
            ${escapeHTML(surah.name)}
          </strong>

          <small>
            ${escapeHTML(surah.englishName)}
            — ${surah.numberOfAyahs} آیات
          </small>

        </div>

      </button>

    `).join("");
}

function filterSurahs() {

  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const value =
    input.value.toLowerCase().trim();

  const filtered =
    surahs.filter(s =>

      String(s.number).includes(value) ||

      String(s.name)
        .toLowerCase()
        .includes(value) ||

      String(s.englishName)
        .toLowerCase()
        .includes(value)

    );

  renderSurahs(filtered);
}

/* =========================================================
   OPEN SURAH
========================================================= */

async function openSurah(number) {

  stopAudio();

  hideAllScreens();

  const reader =
    document.getElementById("reader");

  const container =
    document.getElementById("ayahContainer");

  if (!reader || !container) {

    showMessage("Reader HTML میں نہیں ملا۔");

    return;
  }

  reader.classList.remove("hidden");

  setHeader("قرآن");

  container.innerHTML =
    `<div class="loading">
      قرآن لوڈ ہو رہا ہے...
    </div>`;

  currentSurah = Number(number);
  currentAyahIndex = 0;
  verses = [];

  try {

    const url =
      `${QURAN_API}/surah/${number}/editions/` +
      `quran-uthmani,${encodeURIComponent(translationId)}`;

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error("Quran API failed");
    }

    const result =
      await response.json();

    if (!result.data) {
      throw new Error("Invalid Quran response");
    }

    const arabic =
      result.data.find(item =>
        item.edition &&
        item.edition.identifier ===
        "quran-uthmani"
      );

    const translation =
      result.data.find(item =>
        item.edition &&
        item.edition.identifier ===
        translationId
      );

    if (!arabic || !arabic.ayahs) {
      throw new Error("Arabic Quran missing");
    }

    verses =
      arabic.ayahs.map((ayah, index) => {

        return {

          number:
            ayah.numberInSurah,

          globalNumber:
            ayah.number,

          arabic:
            ayah.text,

          translation:
            translation &&
            translation.ayahs &&
            translation.ayahs[index]
              ? translation.ayahs[index].text
              : "",

          audio:
            `${AUDIO_BASE}/${ayah.number}.mp3`,

          tafseer: null

        };

      });

    localStorage.setItem(
      "lastSurah",
      String(number)
    );

    const info =
      surahs.find(
        s => s.number === Number(number)
      );

    const title =
      document.getElementById("readerTitle");

    if (title) {

      title.textContent =
        `📖 ${info ? info.name : "قرآن"}`;

    }

    renderVerses();

  } catch (error) {

    console.error("Quran error:", error);

    container.innerHTML = `
      <div class="card">

        قرآن لوڈ نہیں ہو سکا۔

        <br><br>

        Internet connection چیک کریں۔

        <br><br>

        <button
          class="primary"
          onclick="openSurah(${number})">

          دوبارہ کوشش کریں

        </button>

      </div>
    `;
  }
}

/* =========================================================
   AYAT
========================================================= */

function renderVerses() {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML =
    verses.map((v, index) => `

      <article
        class="ayah"
        id="ayah-${index}">

        <div class="ayah-top">

          <div class="ayah-number">
            ${v.number}
          </div>

          <button
            class="btn"
            type="button"
            onclick="playAyah(${index})">

            🔊 سنیں

          </button>

        </div>

        <div
          class="arabic"
          style="font-size:${arabicFontSize}px">

          ${escapeHTML(v.arabic)}

        </div>

        <div class="translation">

          <div class="translation-title">
            اردو ترجمہ
          </div>

          ${
            v.translation
              ? escapeHTML(v.translation)
              : "ترجمہ دستیاب نہیں۔"
          }

        </div>

        <button
          class="tafseer-btn"
          type="button"
          onclick="toggleTafseer(${index})">

          📚 تفسیر دکھائیں

        </button>

        <div
          id="tafseer-${index}"
          class="tafseer hidden">

          تفسیر دیکھنے کے لیے بٹن دبائیں۔

        </div>

      </article>

    `).join("");
}

/* =========================================================
   TAFSEER
========================================================= */

async function getTafsirResource() {

  if (tafsirResourceId) {
    return tafsirResourceId;
  }

  const response =
    await fetch(
      `${QURAN_COM_API}/resources/tafsirs`
    );

  if (!response.ok) {
    throw new Error("Tafsir resources failed");
  }

  const result =
    await response.json();

  const list =
    result.tafsirs || [];

  let resource =
    list.find(item => {

      const language =
        String(
          item.language_name ||
          item.language ||
          ""
        ).toLowerCase();

      return language.includes("urdu");

    });

  if (!resource) {

    resource =
      list.find(item =>
        String(item.name || "")
          .toLowerCase()
          .includes("ibn kathir")
      );
  }

  if (!resource && list.length) {
    resource = list[0];
  }

  if (!resource) {
    throw new Error("No tafsir found");
  }

  tafsirResourceId =
    resource.id;

  return resource.id;
}

async function toggleTafseer(index) {

  const box =
    document.getElementById(
      `tafseer-${index}`
    );

  if (!box || !verses[index]) return;

  if (!box.classList.contains("hidden")) {

    box.classList.add("hidden");

    return;
  }

  box.classList.remove("hidden");

  if (verses[index].tafseer) {

    box.innerHTML =
      verses[index].tafseer;

    return;
  }

  box.textContent =
    "تفسیر لوڈ ہو رہی ہے...";

  try {

    const resourceId =
      await getTafsirResource();

    const response =
      await fetch(
        `${QURAN_COM_API}/tafsirs/` +
        `${resourceId}/by_ayah/` +
        `${verses[index].globalNumber}`
      );

    if (!response.ok) {
      throw new Error("Tafsir request failed");
    }

    const result =
      await response.json();

    const data =
      result.tafsir ||
      result.data ||
      null;

    let text = "";

    if (typeof data === "string") {

      text = data;

    } else if (
      data &&
      typeof data.text === "string"
    ) {

      text = data.text;
    }

    if (!text) {
      text = "اس آیت کی تفسیر دستیاب نہیں۔";
    }

    verses[index].tafseer =
      escapeHTML(stripHTML(text));

    box.innerHTML =
      verses[index].tafseer;

  } catch (error) {

    console.error("Tafsir:", error);

    box.textContent =
      "تفسیر لوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔";
  }
}

/* =========================================================
   AUDIO
========================================================= */

function playAyah(index) {

  if (!verses[index]) return;

  currentAyahIndex = index;

  const verse =
    verses[index];

  audio.pause();

  audio.src =
    verse.audio;

  audio.currentTime = 0;

  const player =
    document.getElementById("audioPlayer");

  if (player) {
    player.classList.remove("hidden");
  }

  const title =
    document.getElementById("audioTitle");

  if (title) {

    title.textContent =
      `آیت ${verse.number}`;

  }

  const progress =
    document.getElementById("audioProgress");

  if (progress) {
    progress.value = 0;
  }

  highlightAyah(index);

  audio.play()
    .catch(error => {

      console.error("Audio:", error);

      showMessage(
        "Audio نہیں چل رہی۔ دوبارہ Play دبائیں۔"
      );

    });
}

function toggleMainAudio() {

  if (!audio.src) {

    if (verses.length) {
      playAyah(0);
    } else {
      showMessage("پہلے کوئی سورت کھولیں۔");
    }

    return;
  }

  if (audio.paused) {

    audio.play()
      .catch(() => {

        showMessage(
          "Audio چل نہیں رہی۔"
        );

      });

  } else {

    audio.pause();
  }
}

function nextAudio(autoNext = false) {

  if (!verses.length) return;

  if (
    currentAyahIndex <
    verses.length - 1
  ) {

    playAyah(
      currentAyahIndex + 1
    );

  } else {

    audio.pause();

    if (autoNext) {

      showMessage(
        "اس سورت کی تلاوت مکمل ہو گئی۔"
      );

    }
  }
}

function previousAudio() {

  if (!verses.length) return;

  if (audio.currentTime > 3) {

    audio.currentTime = 0;

    return;
  }

  if (currentAyahIndex > 0) {

    playAyah(
      currentAyahIndex - 1
    );
  }
}

function stopAudio() {

  audio.pause();

  audio.removeAttribute("src");

  audio.load();

  currentAyahIndex = 0;

  const player =
    document.getElementById("audioPlayer");

  if (player) {
    player.classList.add("hidden");
  }

  const progress =
    document.getElementById("audioProgress");

  if (progress) {
    progress.value = 0;
  }
}

function highlightAyah(index) {

  document
    .querySelectorAll(".ayah")
    .forEach(el => {
      el.classList.remove("current");
    });

  const el =
    document.getElementById(
      `ayah-${index}`
    );

  if (el) {

    el.classList.add("current");

    el.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

function updateAudioTime() {

  const progress =
    document.getElementById(
      "audioProgress"
    );

  const current =
    document.getElementById(
      "currentTime"
    );

  const total =
    document.getElementById(
      "totalTime"
    );

  if (
    !audio.duration ||
    !Number.isFinite(audio.duration)
  ) {
    return;
  }

  if (progress) {

    progress.value =
      (audio.currentTime /
        audio.duration) * 100;
  }

  if (current) {

    current.textContent =
      formatTime(audio.currentTime);
  }

  if (total) {

    total.textContent =
      formatTime(audio.duration);
  }
}

function seekAudio(value) {

  if (
    !audio.duration ||
    !Number.isFinite(audio.duration)
  ) {
    return;
  }

  audio.currentTime =
    (Number(value) / 100) *
    audio.duration;
}

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return `${minutes}:${secs}`;
}

/* =========================================================
   CONTINUE READING
========================================================= */

function continueReading() {

  const last =
    Number(
      localStorage.getItem("lastSurah")
    );

  if (last >= 1 && last <= 114) {

    openSurah(last);

  } else {

    openQuran();
  }
}

/* =========================================================
   SETTINGS
========================================================= */

function changeArabicSize(value) {

  arabicFontSize =
    Number(value);

  localStorage.setItem(
    "arabicFontSize",
    String(arabicFontSize)
  );

  document
    .querySelectorAll(".arabic")
    .forEach(el => {

      el.style.fontSize =
        `${arabicFontSize}px`;

    });
}

async function changeTranslation(value) {

  translationId = value;

  localStorage.setItem(
    "translationId",
    value
  );

  if (currentSurah) {

    const number =
      currentSurah;

    stopAudio();

    await openSurah(number);
  }
}

/* =========================================================
   TASBEEH
========================================================= */

function updateTasbeeh() {

  const el =
    document.getElementById(
      "tasbeehCount"
    );

  if (el) {
    el.textContent = tasbeeh;
  }
}

function countTasbeeh() {

  tasbeeh++;

  localStorage.setItem(
    "tasbeeh",
    String(tasbeeh)
  );

  updateTasbeeh();
}

function resetTasbeeh() {

  tasbeeh = 0;

  localStorage.setItem(
    "tasbeeh",
    "0"
  );

  updateTasbeeh();
}

/* =========================================================
   DUAS
========================================================= */

const duas = [

  {
    title: "سفر کی دعا",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    urdu:
      "پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کیا، ورنہ ہم اسے قابو میں نہ لا سکتے۔"
  },

  {
    title: "کھانے سے پہلے",
    arabic:
      "بِسْمِ اللّٰهِ",
    urdu:
      "اللہ کے نام سے شروع کرتا ہوں۔"
  },

  {
    title: "والدین کے لیے",
    arabic:
      "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    urdu:
      "اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں مجھے پالا۔"
  },

  {
    title: "دنیا و آخرت کی بھلائی",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    urdu:
      "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
  }

];

function renderDuas() {

  const list =
    document.getElementById("duasList");

  if (!list) return;

  list.innerHTML =
    duas.map(dua => `

      <div class="dua">

        <h3>
          🤲 ${escapeHTML(dua.title)}
        </h3>

        <div class="arabic">
          ${escapeHTML(dua.arabic)}
        </div>

        <div class="translation">
          ${escapeHTML(dua.urdu)}
        </div>

      </div>

    `).join("");
}

/* =========================================================
   PRAYER TIMES
========================================================= */

function loadPrayerTimes() {

  const output =
    document.getElementById("prayerList");

  if (!output) return;

  if (!navigator.geolocation) {

    output.textContent =
      "آپ کے براؤزر میں Location دستیاب نہیں۔";

    return;
  }

  output.textContent =
    "📍 مقام معلوم کیا جا رہا ہے...";

  navigator.geolocation.getCurrentPosition(

    async position => {

      try {

        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;

        const date =
          new Date();

        const d =
          `${date.getDate()}-` +
          `${date.getMonth() + 1}-` +
          `${date.getFullYear()}`;

        const url =
          `https://api.aladhan.com/v1/timings/${d}` +
          `?latitude=${lat}` +
          `&longitude=${lon}` +
          `&method=1`;

        const response =
          await fetch(url);

        const result =
          await response.json();

        if (
          !result.data ||
          !result.data.timings
        ) {
          throw new Error("Prayer API failed");
        }

        const t =
          result.data.timings;

        const names = [
          ["Fajr", "فجر"],
          ["Sunrise", "طلوع آفتاب"],
          ["Dhuhr", "ظہر"],
          ["Asr", "عصر"],
          ["Maghrib", "مغرب"],
          ["Isha", "عشاء"]
        ];

        output.innerHTML =
          names.map(item => `

            <div class="prayer">

              <strong>
                ${item[1]}
              </strong>

              <span>
                ${escapeHTML(t[item[0]])}
              </span>

            </div>

          `).join("");

      } catch (error) {

        console.error(error);

        output.textContent =
          "نماز کے اوقات حاصل نہیں ہو سکے۔";

      }

    },

    () => {

      output.textContent =
        "Location کی اجازت دیں۔";

    }
  );
}

/* =========================================================
   QIBLA
========================================================= */

function findQibla() {

  const text =
    document.getElementById(
      "qiblaText"
    );

  const compass =
    document.getElementById(
      "compass"
    );

  if (!text) return;

  if (!navigator.geolocation) {

    text.textContent =
      "Location دستیاب نہیں۔";

    return;
  }

  text.textContent =
    "📍 مقام معلوم کیا جا رہا ہے...";

  navigator.geolocation.getCurrentPosition(

    async position => {

      try {

        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;

        const response =
          await fetch(
            `https://api.aladhan.com/v1/qibla/` +
            `${lat}/${lon}`
          );

        const result =
          await response.json();

        if (
          !result.data ||
          typeof result.data.direction !==
          "number"
        ) {
          throw new Error("Qibla failed");
        }

        const direction =
          result.data.direction;

        if (compass) {

          compass.style.transform =
            `rotate(${direction}deg)`;
        }

        text.innerHTML =
          `🕋 قبلہ کی سمت تقریباً ` +
          `<strong>${direction.toFixed(1)}°</strong> ہے۔`;

      } catch (error) {

        console.error(error);

        text.textContent =
          "قبلہ کی سمت حاصل نہیں ہو سکی۔";
      }

    },

    () => {

      text.textContent =
        "Location کی اجازت دیں تاکہ قبلہ معلوم ہو سکے۔";

    }
  );
}

/* =========================================================
   HELPERS
========================================================= */

function showMessage(text) {

  const old =
    document.querySelector(".message");

  if (old) old.remove();

  const box =
    document.createElement("div");

  box.className = "message";
  box.textContent = text;

  document.body.appendChild(box);

  setTimeout(() => {

    if (box.parentNode) {
      box.remove();
    }

  }, 3500);
}

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripHTML(value) {

  const div =
    document.createElement("div");

  div.innerHTML =
    String(value ?? "");

  return div.textContent ||
    div.innerText ||
    "";
}

/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.goHome = goHome;
window.openQuran = openQuran;
window.backToSurahs = backToSurahs;
window.openDuas = openDuas;
window.openTasbeeh = openTasbeeh;
window.openPrayer = openPrayer;
window.openQibla = openQibla;
window.openKaaba = openKaaba;
window.openAbout = openAbout;

window.toggleSettings = toggleSettings;

window.loadSurahs = loadSurahs;
window.filterSurahs = filterSurahs;
window.openSurah = openSurah;

window.toggleTafseer = toggleTafseer;

window.playAyah = playAyah;
window.toggleMainAudio = toggleMainAudio;
window.nextAudio = nextAudio;
window.previousAudio = previousAudio;
window.stopAudio = stopAudio;
window.seekAudio = seekAudio;

window.continueReading = continueReading;

window.changeArabicSize = changeArabicSize;
window.changeTranslation = changeTranslation;

window.countTasbeeh = countTasbeeh;
window.resetTasbeeh = resetTasbeeh;

window.loadPrayerTimes = loadPrayerTimes;
window.findQibla = findQibla;
