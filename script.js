"use strict";

const API = "https://api.alquran.cloud/v1";
const AUDIO = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

let surahs = [];
let verses = [];
let currentSurah = null;
let currentAyah = 0;

let translationId =
  localStorage.getItem("translationId") || "ur.jalandhry";

let arabicFontSize =
  Number(localStorage.getItem("arabicFontSize")) || 32;

let tasbeeh =
  Number(localStorage.getItem("tasbeeh")) || 0;

const player = new Audio();
player.preload = "auto";


/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", function () {

  updateTasbeeh();

  const font = document.getElementById("fontSize");
  if (font) font.value = arabicFontSize;

  const select = document.getElementById("translationSelect");
  if (select) select.value = translationId;

  player.addEventListener("timeupdate", updateAudioTime);

  player.addEventListener("loadedmetadata", updateAudioTime);

  player.addEventListener("play", function () {
    const b = document.getElementById("mainPlay");
    if (b) b.textContent = "⏸️";
  });

  player.addEventListener("pause", function () {
    const b = document.getElementById("mainPlay");
    if (b) b.textContent = "▶️";
  });

  player.addEventListener("ended", function () {
    nextAudio(true);
  });

  loadSurahs();
});


/* =========================
   SCREEN
========================= */

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
  ].forEach(function (id) {

    const el = document.getElementById(id);

    if (el) {
      el.classList.add("hidden");
    }

  });
}


function setTitle(title) {

  const el = document.getElementById("headerTitle");

  if (el) {
    el.textContent = title;
  }
}


function goHome() {

  stopAudio();

  hideAllScreens();

  const home = document.getElementById("home");

  if (home) {
    home.classList.remove("hidden");
  }

  setTitle("Quran Companion");
}


function openQuran() {

  hideAllScreens();

  const quran = document.getElementById("quran");

  if (quran) {
    quran.classList.remove("hidden");
  }

  setTitle("قرآن");

  if (!surahs.length) {
    loadSurahs();
  }
}


function backToSurahs() {

  stopAudio();

  hideAllScreens();

  const quran = document.getElementById("quran");

  if (quran) {
    quran.classList.remove("hidden");
  }

  setTitle("قرآن");
}


function openDuas() {

  stopAudio();

  hideAllScreens();

  const el = document.getElementById("duas");

  if (el) {
    el.classList.remove("hidden");
  }

  setTitle("دعائیں");

  renderDuas();
}


function openTasbeeh() {

  stopAudio();

  hideAllScreens();

  const el = document.getElementById("tasbeeh");

  if (el) {
    el.classList.remove("hidden");
  }

  setTitle("تسبیح");

  updateTasbeeh();
}


function openPrayer() {

  hideAllScreens();

  document.getElementById("prayer")?.classList.remove("hidden");

  setTitle("نماز کے اوقات");
}


function openQibla() {

  hideAllScreens();

  document.getElementById("qibla")?.classList.remove("hidden");

  setTitle("قبلہ");
}


function openKaaba() {

  hideAllScreens();

  document.getElementById("kaaba")?.classList.remove("hidden");

  setTitle("خانہ کعبہ");
}


function openAbout() {

  hideAllScreens();

  document.getElementById("about")?.classList.remove("hidden");

  setTitle("اسلامی معلومات");
}


function toggleSettings() {

  const settings = document.getElementById("settings");

  if (settings) {
    settings.classList.toggle("hidden");
  }
}


/* =========================
   SURAH LIST
========================= */

async function loadSurahs() {

  const list = document.getElementById("surahList");

  if (!list) {
    console.error("surahList not found");
    return;
  }

  list.innerHTML =
    '<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>';

  try {

    const response = await fetch(
      API + "/surah",
      {
        method: "GET",
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error("API error " + response.status);
    }

    const result = await response.json();

    if (
      !result ||
      !Array.isArray(result.data)
    ) {
      throw new Error("Invalid API response");
    }

    surahs = result.data;

    renderSurahs(surahs);

  } catch (error) {

    console.error("SURAH ERROR:", error);

    list.innerHTML = `
      <div class="card">
        <h3>سورتیں لوڈ نہیں ہو سکیں</h3>

        <p>
          Internet connection چیک کریں۔
        </p>

        <button
          class="primary"
          type="button"
          onclick="loadSurahs()">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;

  }
}


function renderSurahs(data) {

  const list = document.getElementById("surahList");

  if (!list) return;

  if (!data || !data.length) {

    list.innerHTML =
      '<div class="loading">کوئی سورت نہیں ملی۔</div>';

    return;
  }

  list.innerHTML = data.map(function (surah) {

    return `
      <button
        class="surah"
        type="button"
        onclick="openSurah(${Number(surah.number)})">

        <div class="surah-number">
          ${Number(surah.number)}
        </div>

        <div class="surah-name">

          <strong>
            ${escapeHTML(surah.name)}
          </strong>

          <small>
            ${escapeHTML(surah.englishName)}
            — ${Number(surah.numberOfAyahs)} آیات
          </small>

        </div>

      </button>
    `;

  }).join("");
}


function filterSurahs() {

  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const value =
    input.value.toLowerCase().trim();

  const result = surahs.filter(function (s) {

    return (
      String(s.number).includes(value) ||
      String(s.name).toLowerCase().includes(value) ||
      String(s.englishName).toLowerCase().includes(value)
    );

  });

  renderSurahs(result);
}


/* =========================
   OPEN SURAH
========================= */

async function openSurah(number) {

  stopAudio();

  hideAllScreens();

  const reader =
    document.getElementById("reader");

  const container =
    document.getElementById("ayahContainer");

  if (!reader || !container) {

    alert("Reader HTML نہیں ملا");

    return;
  }

  reader.classList.remove("hidden");

  setTitle("قرآن");

  container.innerHTML =
    '<div class="loading">قرآن لوڈ ہو رہا ہے...</div>';

  currentSurah = Number(number);
  currentAyah = 0;
  verses = [];

  try {

    const url =
      API +
      "/surah/" +
      Number(number) +
      "/editions/quran-uthmani," +
      encodeURIComponent(translationId);

    const response = await fetch(
      url,
      {
        method: "GET",
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        "Quran API error " + response.status
      );
    }

    const result = await response.json();

    if (
      !result ||
      !Array.isArray(result.data)
    ) {
      throw new Error("Invalid Quran response");
    }

    const arabic =
      result.data.find(function (item) {

        return (
          item.edition &&
          item.edition.identifier ===
          "quran-uthmani"
        );

      });

    const translation =
      result.data.find(function (item) {

        return (
          item.edition &&
          item.edition.identifier ===
          translationId
        );

      });

    if (!arabic || !arabic.ayahs) {
      throw new Error("Arabic Quran missing");
    }

    verses =
      arabic.ayahs.map(function (ayah, index) {

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
            AUDIO +
            "/" +
            ayah.number +
            ".mp3",

          tafseer: null

        };

      });

    localStorage.setItem(
      "lastSurah",
      String(number)
    );

    const info =
      surahs.find(function (s) {
        return s.number === Number(number);
      });

    const title =
      document.getElementById("readerTitle");

    if (title) {

      title.textContent =
        "📖 " +
        (info ? info.name : "قرآن");

    }

    renderVerses();

  } catch (error) {

    console.error("QURAN ERROR:", error);

    container.innerHTML = `
      <div class="card">

        <h3>قرآن لوڈ نہیں ہو سکا</h3>

        <p>
          Internet connection چیک کریں۔
        </p>

        <p style="direction:ltr;text-align:left">
          ${escapeHTML(error.message)}
        </p>

        <button
          class="primary"
          type="button"
          onclick="openSurah(${Number(number)})">

          دوبارہ کوشش کریں

        </button>

      </div>
    `;

  }
}


/* =========================
   AYAT
========================= */

function renderVerses() {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  if (!verses.length) {

    container.innerHTML =
      '<div class="loading">آیات دستیاب نہیں۔</div>';

    return;
  }

  container.innerHTML =
    verses.map(function (v, i) {

      return `
        <article
          class="ayah"
          id="ayah-${i}">

          <div class="ayah-top">

            <div class="ayah-number">
              ${v.number}
            </div>

            <button
              class="btn"
              type="button"
              onclick="playAyah(${i})">

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
            onclick="toggleTafseer(${i})">

            📚 تفسیر دکھائیں

          </button>

          <div
            id="tafseer-${i}"
            class="tafseer hidden">

            تفسیر لوڈ کرنے کے لیے دبائیں۔

          </div>

        </article>
      `;

    }).join("");
}


/* =========================
   TAFSEER
========================= */

async function toggleTafseer(index) {

  const box =
    document.getElementById(
      "tafseer-" + index
    );

  if (!box || !verses[index]) return;

  if (!box.classList.contains("hidden")) {

    box.classList.add("hidden");

    return;
  }

  box.classList.remove("hidden");

  if (verses[index].tafseer) {

    box.textContent =
      verses[index].tafseer;

    return;
  }

  box.textContent =
    "تفسیر لوڈ ہو رہی ہے...";

  try {

    const resourceResponse =
      await fetch(
        "https://api.quran.com/api/v4/resources/tafsirs"
      );

    if (!resourceResponse.ok) {
      throw new Error("Tafsir resources failed");
    }

    const resourceData =
      await resourceResponse.json();

    const list =
      resourceData.tafsirs || [];

    let resource =
      list.find(function (t) {

        return String(
          t.language_name ||
          t.language ||
          ""
        )
          .toLowerCase()
          .includes("urdu");

      });

    if (!resource && list.length) {
      resource = list[0];
    }

    if (!resource) {
      throw new Error("No tafsir resource");
    }

    const response =
      await fetch(
        "https://api.quran.com/api/v4/tafsirs/" +
        resource.id +
        "/by_ayah/" +
        verses[index].globalNumber
      );

    if (!response.ok) {
      throw new Error("Tafsir failed");
    }

    const result =
      await response.json();

    let text = "";

    if (
      result.tafsir &&
      typeof result.tafsir.text === "string"
    ) {

      text = result.tafsir.text;

    } else if (
      typeof result.tafsir === "string"
    ) {

      text = result.tafsir;

    }

    text = stripHTML(text);

    if (!text) {
      text =
        "اس آیت کی تفسیر دستیاب نہیں۔";
    }

    verses[index].tafseer = text;

    box.textContent = text;

  } catch (error) {

    console.error("TAFSEER ERROR:", error);

    box.textContent =
      "تفسیر لوڈ نہیں ہو سکی۔";

  }
}


/* =========================
   AUDIO
========================= */

function playAyah(index) {

  if (!verses[index]) return;

  currentAyah = index;

  const verse =
    verses[index];

  player.pause();

  player.src = verse.audio;

  player.currentTime = 0;

  const audioBox =
    document.getElementById("audioPlayer");

  if (audioBox) {
    audioBox.classList.remove("hidden");
  }

  const title =
    document.getElementById("audioTitle");

  if (title) {
    title.textContent =
      "آیت " + verse.number;
  }

  highlightAyah(index);

  player.play().catch(function (error) {

    console.error("AUDIO ERROR:", error);

    showMessage(
      "Audio چلانے میں مسئلہ آیا۔"
    );

  });
}


function toggleMainAudio() {

  if (!player.src) {

    if (verses.length) {
      playAyah(0);
    }

    return;
  }

  if (player.paused) {

    player.play().catch(function () {

      showMessage(
        "Audio نہیں چل رہی۔"
      );

    });

  } else {

    player.pause();

  }
}


function nextAudio(autoNext) {

  if (!verses.length) return;

  if (
    currentAyah <
    verses.length - 1
  ) {

    playAyah(currentAyah + 1);

  } else {

    player.pause();

    if (autoNext) {

      showMessage(
        "اس سورت کی تلاوت مکمل ہو گئی۔"
      );

    }

  }
}


function previousAudio() {

  if (!verses.length) return;

  if (player.currentTime > 3) {

    player.currentTime = 0;

    return;
  }

  if (currentAyah > 0) {

    playAyah(currentAyah - 1);

  }
}


function stopAudio() {

  player.pause();

  player.removeAttribute("src");

  player.load();

  currentAyah = 0;

  const box =
    document.getElementById("audioPlayer");

  if (box) {
    box.classList.add("hidden");
  }

  const btn =
    document.getElementById("mainPlay");

  if (btn) {
    btn.textContent = "▶️";
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
    .forEach(function (el) {

      el.classList.remove("current");

    });

  const el =
    document.getElementById(
      "ayah-" + index
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
    document.getElementById("audioProgress");

  const current =
    document.getElementById("currentTime");

  const total =
    document.getElementById("totalTime");

  if (
    !Number.isFinite(player.duration) ||
    player.duration <= 0
  ) {
    return;
  }

  if (progress) {

    progress.value =
      (
        player.currentTime /
        player.duration
      ) * 100;

  }

  if (current) {

    current.textContent =
      formatTime(player.currentTime);

  }

  if (total) {

    total.textContent =
      formatTime(player.duration);

  }
}


function seekAudio(value) {

  if (
    !Number.isFinite(player.duration) ||
    player.duration <= 0
  ) {
    return;
  }

  player.currentTime =
    Number(value) /
    100 *
    player.duration;
}


function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secondsPart =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return minutes + ":" + secondsPart;
}


/* =========================
   CONTINUE
========================= */

function continueReading() {

  const last =
    Number(
      localStorage.getItem("lastSurah")
    );

  if (
    last >= 1 &&
    last <= 114
  ) {

    openSurah(last);

  } else {

    openQuran();

  }
}


/* =========================
   SETTINGS
========================= */

function changeArabicSize(value) {

  arabicFontSize =
    Number(value);

  localStorage.setItem(
    "arabicFontSize",
    String(arabicFontSize)
  );

  document
    .querySelectorAll(".arabic")
    .forEach(function (el) {

      el.style.fontSize =
        arabicFontSize + "px";

    });
}


async function changeTranslation(value) {

  translationId = value;

  localStorage.setItem(
    "translationId",
    value
  );

  if (currentSurah) {

    const surah =
      currentSurah;

    stopAudio();

    await openSurah(surah);

  }
}


/* =========================
   TASBEEH
========================= */

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


/* =========================
   DUAS
========================= */

const duas = [

  {
    title: "سفر کی دعا",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    urdu:
      "پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کیا۔"
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
    duas.map(function (d) {

      return `
        <div class="dua">

          <h3>
            🤲 ${escapeHTML(d.title)}
          </h3>

          <div class="arabic">
            ${escapeHTML(d.arabic)}
          </div>

          <div class="translation">
            ${escapeHTML(d.urdu)}
          </div>

        </div>
      `;

    }).join("");
}


/* =========================
   PRAYER
========================= */

async function loadPrayerTimes() {

  const output =
    document.getElementById("prayerList");

  if (!output) return;

  if (!navigator.geolocation) {

    output.textContent =
      "Location دستیاب نہیں۔";

    return;
  }

  output.textContent =
    "📍 مقام معلوم کیا جا رہا ہے...";

  navigator.geolocation.getCurrentPosition(

    async function (position) {

      try {

        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;

        const date =
          new Date();

        const day =
          date.getDate();

        const month =
          date.getMonth() + 1;

        const year =
          date.getFullYear();

        const response =
          await fetch(
            "https://api.aladhan.com/v1/timings/" +
            day +
            "-" +
            month +
            "-" +
            year +
            "?latitude=" +
            lat +
            "&longitude=" +
            lon +
            "&method=1"
          );

        if (!response.ok) {
          throw new Error("Prayer API failed");
        }

        const result =
          await response.json();

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
          names.map(function (x) {

            return `
              <div class="prayer">
                <strong>${x[1]}</strong>
                <span>${t[x[0]]}</span>
              </div>
            `;

          }).join("");

      } catch (error) {

        console.error(error);

        output.textContent =
          "نماز کے اوقات حاصل نہیں ہو سکے۔";

      }

    },

    function () {

      output.textContent =
        "Location کی اجازت دیں۔";

    }

  );
}


/* =========================
   QIBLA
========================= */

async function findQibla() {

  const text =
    document.getElementById("qiblaText");

  const compass =
    document.getElementById("compass");

  if (!navigator.geolocation) {

    if (text) {
      text.textContent =
        "Location دستیاب نہیں۔";
    }

    return;
  }

  if (text) {
    text.textContent =
      "📍 مقام معلوم کیا جا رہا ہے...";
  }

  navigator.geolocation.getCurrentPosition(

    async function (position) {

      try {

        const lat =
          position.coords.latitude;

        const lon =
          position.coords.longitude;

        const response =
          await fetch(
            "https://api.aladhan.com/v1/qibla/" +
            lat +
            "/" +
            lon
          );

        const result =
          await response.json();

        const direction =
          Number(
            result.data.direction
          );

        if (compass) {

          compass.style.transform =
            "rotate(" +
            direction +
            "deg)";

        }

        if (text) {

          text.innerHTML =
            "🕋 قبلہ کی سمت تقریباً " +
            "<strong>" +
            direction.toFixed(1) +
            "°</strong> ہے۔";

        }

      } catch (error) {

        console.error(error);

        if (text) {
          text.textContent =
            "قبلہ کی سمت حاصل نہیں ہو سکی۔";
        }

      }

    },

    function () {

      if (text) {
        text.textContent =
          "Location کی اجازت دیں۔";
      }

    }

  );
}


/* =========================
   HELPERS
========================= */

function showMessage(text) {

  const old =
    document.querySelector(".message");

  if (old) {
    old.remove();
  }

  const box =
    document.createElement("div");

  box.className =
    "message";

  box.textContent =
    text;

  document.body.appendChild(box);

  setTimeout(function () {

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

  return (
    div.textContent ||
    div.innerText ||
    ""
  );
}


/* =========================
   GLOBAL FUNCTIONS
========================= */

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
window.seekAudio = seekAudio;

window.continueReading = continueReading;

window.changeArabicSize = changeArabicSize;
window.changeTranslation = changeTranslation;

window.countTasbeeh = countTasbeeh;
window.resetTasbeeh = resetTasbeeh;

window.loadPrayerTimes = loadPrayerTimes;
window.findQibla = findQibla;
