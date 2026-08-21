"use strict";

/* =========================================================
   QURAN COMPANION — COMPLETE SCRIPT
   Matches the user's current index.html
========================================================= */

const QURAN_API = "https://api.alquran.cloud/v1";
const QURAN_COM_API = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

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

const audio = new Audio();
audio.preload = "auto";

/* =========================================================
   START
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  updateTasbeeh();

  const font = document.getElementById("fontSize");
  if (font) {
    font.value = arabicFontSize;
  }

  const translation =
    document.getElementById("translationSelect");

  if (translation) {
    translation.value = translationId;
  }

  audio.addEventListener("ended", function () {
    nextAudio(true);
  });

  audio.addEventListener("timeupdate", updateAudioTime);

  audio.addEventListener("loadedmetadata", function () {
    updateAudioTime();
  });

  audio.addEventListener("play", function () {
    const btn = document.getElementById("mainPlay");
    if (btn) btn.textContent = "⏸️";
  });

  audio.addEventListener("pause", function () {
    const btn = document.getElementById("mainPlay");
    if (btn) btn.textContent = "▶️";
  });

  loadSurahs();
});

/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function hideAllScreens() {

  [
    "homeScreen",
    "quranScreen",
    "readerScreen",
    "duasScreen",
    "tasbeehScreen"
  ].forEach(function (id) {

    const el = document.getElementById(id);

    if (el) {
      el.classList.add("hidden");
    }

  });
}

function setHeader(title) {

  const header =
    document.getElementById("headerTitle");

  if (header) {
    header.textContent = title;
  }
}

function goHome() {

  stopAudio();

  hideAllScreens();

  const home =
    document.getElementById("homeScreen");

  if (home) {
    home.classList.remove("hidden");
  }

  setHeader("Quran Companion");
}

function openQuran() {

  hideAllScreens();

  const quran =
    document.getElementById("quranScreen");

  if (quran) {
    quran.classList.remove("hidden");
  }

  setHeader("قرآن");

  if (!surahs.length) {
    loadSurahs();
  }
}

function backToSurahs() {

  stopAudio();

  hideAllScreens();

  const quran =
    document.getElementById("quranScreen");

  if (quran) {
    quran.classList.remove("hidden");
  }

  setHeader("قرآن");
}

function openDuas() {

  stopAudio();

  hideAllScreens();

  const screen =
    document.getElementById("duasScreen");

  if (screen) {
    screen.classList.remove("hidden");
  }

  setHeader("دعائیں");

  renderDuas();
}

function openTasbeeh() {

  stopAudio();

  hideAllScreens();

  const screen =
    document.getElementById("tasbeehScreen");

  if (screen) {
    screen.classList.remove("hidden");
  }

  setHeader("تسبیح");

  updateTasbeeh();
}

function toggleSettings() {

  const readerSettings =
    document.getElementById("readerSettings");

  if (readerSettings) {
    readerSettings.classList.toggle("hidden");
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
    '<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>';

  try {

    const response =
      await fetch(QURAN_API + "/surah");

    if (!response.ok) {
      throw new Error("Surah request failed");
    }

    const result =
      await response.json();

    if (
      !result ||
      !result.data ||
      !Array.isArray(result.data)
    ) {
      throw new Error("Invalid surah data");
    }

    surahs = result.data;

    renderSurahs(surahs);

  } catch (error) {

    console.error("Surah error:", error);

    list.innerHTML = `
      <div class="card">
        سورتیں لوڈ نہیں ہو سکیں۔
        <br><br>
        Internet چیک کریں اور دوبارہ کوشش کریں۔
        <br><br>
        <button class="primary" onclick="loadSurahs()">
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
      '<div class="loading">کوئی سورت نہیں ملی</div>';

    return;
  }

  list.innerHTML = data.map(function (surah) {

    return `
      <button
        class="surah-card"
        type="button"
        onclick="openSurah(${surah.number})">

        <div class="surah-number">
          ${surah.number}
        </div>

        <div class="surah-name">
          <strong>${escapeHTML(surah.name)}</strong>

          <small>
            ${escapeHTML(surah.englishName)}
            — ${surah.numberOfAyahs} آیات
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

  const filtered =
    surahs.filter(function (s) {

      return (
        String(s.number).includes(value) ||
        String(s.name)
          .toLowerCase()
          .includes(value) ||
        String(s.englishName)
          .toLowerCase()
          .includes(value)
      );

    });

  renderSurahs(filtered);
}

/* =========================================================
   OPEN SURAH
========================================================= */

async function openSurah(number) {

  stopAudio();

  hideAllScreens();

  const reader =
    document.getElementById("readerScreen");

  const container =
    document.getElementById("ayahContainer");

  if (!reader || !container) {
    showMessage("Reader نہیں ملا۔ HTML چیک کریں۔");
    return;
  }

  reader.classList.remove("hidden");

  setHeader("قرآن");

  container.innerHTML =
    '<div class="loading">قرآن لوڈ ہو رہا ہے...</div>';

  currentSurah = Number(number);
  currentAyahIndex = 0;
  verses = [];

  try {

    /*
      Arabic + selected translation
    */

    const url =
      QURAN_API +
      "/surah/" +
      number +
      "/editions/quran-uthmani," +
      encodeURIComponent(translationId);

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error("Quran request failed");
    }

    const result =
      await response.json();

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

        let translatedText = "";

        if (
          translation &&
          translation.ayahs &&
          translation.ayahs[index]
        ) {
          translatedText =
            translation.ayahs[index].text || "";
        }

        return {

          number:
            ayah.numberInSurah,

          globalNumber:
            ayah.number,

          arabic:
            ayah.text,

          translation:
            translatedText,

          audio:
            AUDIO_BASE +
            "/" +
            ayah.number +
            ".mp3",

          tafseer:
            null

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

    const readerTitle =
      document.getElementById("readerTitle");

    if (readerTitle) {

      readerTitle.textContent =
        "📖 " +
        (info ? info.name : "قرآن");

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
          type="button"
          onclick="openSurah(${number})">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;

  }
}

/* =========================================================
   RENDER AYAT
========================================================= */

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
    verses.map(function (v, index) {

      return `
        <article
          class="ayah-card"
          id="ayah-${index}">

          <div class="ayah-top">

            <div class="ayah-number">
              ${v.number}
            </div>

            <div class="actions">

              <button
                type="button"
                onclick="playAyah(${index})">
                🔊
              </button>

            </div>

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
      `;

    }).join("");
}

/* =========================================================
   TAFSEER
   Uses Quran.com tafsir resources.
========================================================= */

let tafseerResourceId = null;
let tafseerResourcePromise = null;

async function getTafseerResource() {

  if (tafseerResourceId) {
    return tafseerResourceId;
  }

  if (tafseerResourcePromise) {
    return tafseerResourcePromise;
  }

  tafseerResourcePromise =
    fetch(
      QURAN_COM_API +
      "/resources/tafsirs"
    )
      .then(function (response) {

        if (!response.ok) {
          throw new Error("Tafsir resources failed");
        }

        return response.json();

      })
      .then(function (result) {

        const list =
          result.tafsirs || [];

        /*
          Prefer Urdu.
        */

        let resource =
          list.find(function (item) {

            const language =
              String(
                item.language_name ||
                item.language ||
                ""
              ).toLowerCase();

            return language.includes("urdu");

          });

        /*
          If Urdu isn't available,
          use Ibn Kathir as fallback.
        */

        if (!resource) {

          resource =
            list.find(function (item) {

              return String(
                item.name || ""
              )
                .toLowerCase()
                .includes("ibn kathir");

            });

        }

        /*
          Final fallback:
          first available tafsir.
        */

        if (!resource && list.length) {
          resource = list[0];
        }

        if (!resource) {
          throw new Error("No tafsir resource");
        }

        tafseerResourceId =
          resource.id;

        return resource.id;

      })
      .catch(function (error) {

        tafseerResourcePromise = null;

        throw error;

      });

  return tafseerResourcePromise;
}

async function toggleTafseer(index) {

  const box =
    document.getElementById(
      "tafseer-" + index
    );

  if (!box || !verses[index]) {
    return;
  }

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
      await getTafseerResource();

    const url =
      QURAN_COM_API +
      "/tafsirs/" +
      resourceId +
      "/by_ayah/" +
      verses[index].globalNumber;

    const response =
      await fetch(url);

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

    /*
      Tafsir API can contain HTML.
      Keep only safe text.
    */

    const safe =
      stripHTML(text);

    verses[index].tafseer =
      escapeHTML(safe);

    box.innerHTML =
      verses[index].tafseer;

  } catch (error) {

    console.error("Tafsir error:", error);

    box.textContent =
      "تفسیر لوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔";

  }
}

/* =========================================================
   AUDIO PLAYER
========================================================= */

function playAyah(index) {

  if (!verses[index]) {
    return;
  }

  currentAyahIndex = index;

  const verse =
    verses[index];

  /*
    Stop old audio before changing source.
  */

  audio.pause();

  audio.src = verse.audio;

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
      "آیت " +
      verse.number;

  }

  const progress =
    document.getElementById("audioProgress");

  if (progress) {
    progress.value = 0;
  }

  highlightAyah(index);

  /*
    Browser autoplay policy:
    play() is allowed because this normally
    starts from the user's button click.
  */

  audio.play()
    .then(function () {

      const btn =
        document.getElementById("mainPlay");

      if (btn) {
        btn.textContent = "⏸️";
      }

    })
    .catch(function (error) {

      console.error(
        "Audio play error:",
        error
      );

      showMessage(
        "Audio چلانے میں مسئلہ آیا۔ Play دوبارہ دبائیں۔"
      );

    });
}

function toggleMainAudio() {

  /*
    If no audio has ever been selected,
    start first ayah.
  */

  if (!audio.src) {

    playAyah(0);

    return;
  }

  if (audio.paused) {

    audio.play()
      .then(function () {

        const btn =
          document.getElementById("mainPlay");

        if (btn) {
          btn.textContent = "⏸️";
        }

      })
      .catch(function (error) {

        console.error(error);

        showMessage(
          "Audio چل نہیں رہی۔ دوبارہ Play دبائیں۔"
        );

      });

  } else {

    audio.pause();

    const btn =
      document.getElementById("mainPlay");

    if (btn) {
      btn.textContent = "▶️";
    }

  }
}

function nextAudio(autoNext) {

  if (!verses.length) {
    return;
  }

  if (
    currentAyahIndex <
    verses.length - 1
  ) {

    playAyah(
      currentAyahIndex + 1
    );

    return;
  }

  /*
    End of Surah.
  */

  audio.pause();

  const btn =
    document.getElementById("mainPlay");

  if (btn) {
    btn.textContent = "▶️";
  }

  if (autoNext) {

    showMessage(
      "اس سورت کی تلاوت مکمل ہو گئی۔"
    );

  }
}

function previousAudio() {

  if (!verses.length) {
    return;
  }

  /*
    If current audio has played more than
    3 seconds, restart the same ayah.
  */

  if (
    audio.currentTime > 3
  ) {

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
    .querySelectorAll(".ayah-card")
    .forEach(function (el) {

      el.classList.remove("current");

    });

  const current =
    document.getElementById(
      "ayah-" + index
    );

  if (current) {

    current.classList.add("current");

    current.scrollIntoView({
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

  if (!audio.duration || !Number.isFinite(audio.duration)) {

    if (current) {
      current.textContent = "0:00";
    }

    if (total) {
      total.textContent = "0:00";
    }

    return;
  }

  if (progress) {

    progress.value =
      (
        audio.currentTime /
        audio.duration
      ) * 100;

  }

  if (current) {

    current.textContent =
      formatTime(
        audio.currentTime
      );

  }

  if (total) {

    total.textContent =
      formatTime(
        audio.duration
      );

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
    (
      Number(value) /
      100
    ) * audio.duration;
}

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  const secs =
    Math.floor(
      seconds % 60
    )
      .toString()
      .padStart(2, "0");

  return minutes + ":" + secs;
}

/* =========================================================
   CONTINUE READING
========================================================= */

function continueReading() {

  const last =
    Number(
      localStorage.getItem(
        "lastSurah"
      )
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
    .forEach(function (el) {

      el.style.fontSize =
        arabicFontSize + "px";

    });
}

async function changeTranslation(value) {

  translationId =
    value;

  localStorage.setItem(
    "translationId",
    value
  );

  /*
    If a Surah is currently open,
    reload it with the new translation.
  */

  if (currentSurah) {

    const surahToReload =
      currentSurah;

    stopAudio();

    await openSurah(
      surahToReload
    );
  }
}

/* =========================================================
   TASBEEH
========================================================= */

function updateTasbeeh() {

  const count =
    document.getElementById(
      "tasbeehCount"
    );

  if (count) {
    count.textContent =
      tasbeeh;
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
    document.getElementById(
      "duasList"
    );

  if (!list) {
    return;
  }

  list.innerHTML =
    duas.map(function (dua) {

      return `
        <div class="card">

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
      `;

    }).join("");
}

/* =========================================================
   MESSAGE
========================================================= */

function showMessage(text) {

  const old =
    document.querySelector(
      ".message"
    );

  if (old) {
    old.remove();
  }

  const box =
    document.createElement(
      "div"
    );

  box.className =
    "message";

  box.textContent =
    text;

  document.body.appendChild(
    box
  );

  setTimeout(function () {

    if (box.parentNode) {
      box.remove();
    }

  }, 3500);
}

/* =========================================================
   SAFE HTML HELPERS
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripHTML(value) {

  const temp =
    document.createElement(
      "div"
    );

  temp.innerHTML =
    String(value ?? "");

  return temp.textContent ||
    temp.innerText ||
    "";
}

/* =========================================================
   PREVENT OLD INLINE ERRORS
========================================================= */

window.goHome = goHome;
window.openQuran = openQuran;
window.backToSurahs = backToSurahs;
window.openDuas = openDuas;
window.openTasbeeh = openTasbeeh;
window.toggleSettings = toggleSettings;

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
