/* =========================================================
   Quran Companion — Corrected app.js
   ========================================================= */

"use strict";

/* ===================== API CONFIG ===================== */

const QURAN_BASE = "https://api.alquran.cloud/v1";
const TAFSIR_BASE = "https://api.quran.com/api/v4";
const HADITH_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";
const ALADHAN_BASE = "https://api.aladhan.com/v1";

/* ===================== APP STATE ===================== */

const state = {
  surahList: [],
  currentSurahNumber: null,
  currentAyahs: [],
  translation: localStorage.getItem("translation") || "ur.jalandhry",
  reciter: localStorage.getItem("reciter") || "ar.alafasy",
  fontSize: Number(localStorage.getItem("fontSize") || 32),

  playIndex: -1,
  isPlaying: false,

  currentBook: null,
  hadithOffset: 0,

  tafsirEditionId: null
};

/* ===================== HELPERS ===================== */

function $(id) {
  return document.getElementById(id);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toast(message) {
  const existing = $("toast");

  if (existing) {
    existing.textContent = message;
    existing.classList.remove("hidden");

    clearTimeout(window.__toastTimer);

    window.__toastTimer = setTimeout(() => {
      existing.classList.add("hidden");
    }, 2500);

    return;
  }

  const t = document.createElement("div");
  t.id = "toast";
  t.className = "message";
  t.textContent = message;
  document.body.appendChild(t);

  setTimeout(() => t.remove(), 2500);
}

function showSection(id) {
  document
    .querySelectorAll("main > section")
    .forEach(section => section.classList.add("hidden"));

  const section = $(id);

  if (section) {
    section.classList.remove("hidden");
  }
}

function setTitle(title) {
  const el = $("headerTitle");
  if (el) el.textContent = title;
}

async function getJSON(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }

  return response.json();
}

/*
  Hadith API official README says .min.json and .json
  can be used as fallbacks.
*/
async function getHadithJSON(edition) {
  const minURL = `${HADITH_BASE}/editions/${edition}.min.json`;
  const normalURL = `${HADITH_BASE}/editions/${edition}.json`;

  try {
    return await getJSON(minURL);
  } catch (firstError) {
    console.warn("Hadith minified file failed:", minURL);

    return await getJSON(normalURL);
  }
}

/* ===================== NAVIGATION ===================== */

function goHome() {
  closeAudio();
  showSection("home");
  setTitle("Quran Companion");
}

function openAbout() {
  showSection("about");
  setTitle("اسلامی معلومات");
}

function openKaaba() {
  showSection("kaaba");
  setTitle("خانہ کعبہ");
}

function toggleSettings() {
  const settings = $("settings");

  if (settings) {
    settings.classList.toggle("hidden");
  }
}

function backToSurahs() {
  closeAudio();
  showSection("quran");
  setTitle("قرآن مجید");
}

function backToBooks() {
  showSection("hadithBooks");
  setTitle("کتب حدیث");
}

/* ===================== QURAN ===================== */

async function openQuran() {
  showSection("quran");
  setTitle("قرآن مجید");

  if (state.surahList.length) {
    renderSurahList(state.surahList);
    return;
  }

  const list = $("surahList");

  if (list) {
    list.innerHTML = `<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>`;
  }

  try {
    const data = await getJSON(`${QURAN_BASE}/surah`);

    if (!data || !Array.isArray(data.data)) {
      throw new Error("Invalid Quran API response");
    }

    state.surahList = data.data;

    renderSurahList(state.surahList);

  } catch (error) {
    console.error("Quran surah list error:", error);

    if (list) {
      list.innerHTML = `
        <div class="loading">
          سورتیں لوڈ نہیں ہو سکیں۔
          <br><br>
          <button class="btn" onclick="openQuran()">
            دوبارہ کوشش کریں
          </button>
        </div>
      `;
    }
  }
}

function renderSurahList(list) {
  const container = $("surahList");

  if (!container) return;

  if (!list || !list.length) {
    container.innerHTML = `
      <div class="loading">
        کوئی سورت نہیں ملی۔
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="surah-list">
      ${list.map(s => `
        <button
          class="surah"
          onclick="openSurah(${Number(s.number)})"
        >
          <div class="surah-number">
            ${escapeHTML(s.number)}
          </div>

          <div class="surah-name">
            <strong>
              ${escapeHTML(s.name)}
            </strong>

            <small>
              ${escapeHTML(s.englishName)}
              —
              ${escapeHTML(s.englishNameTranslation)}
              ·
              ${escapeHTML(s.numberOfAyahs)}
              آیات
            </small>
          </div>
        </button>
      `).join("")}
    </div>
  `;
}

function filterSurahs() {
  const input = $("surahSearch");

  if (!input) return;

  const query = input.value.trim().toLowerCase();

  if (!query) {
    renderSurahList(state.surahList);
    return;
  }

  const filtered = state.surahList.filter(s => {
    return (
      String(s.number) === query ||
      String(s.name || "").toLowerCase().includes(query) ||
      String(s.englishName || "").toLowerCase().includes(query) ||
      String(s.englishNameTranslation || "")
        .toLowerCase()
        .includes(query)
    );
  });

  renderSurahList(filtered);
}

/* ===================== OPEN SURAH ===================== */

async function openSurah(number, scrollToAyah = null) {
  number = Number(number);

  if (!number || number < 1 || number > 114) {
    toast("غلط سورت نمبر");
    return;
  }

  closeAudio();

  showSection("reader");

  const settings = $("settings");
  if (settings) settings.classList.add("hidden");

  const container = $("ayahContainer");

  if (container) {
    container.innerHTML = `
      <div class="loading">
        قرآن لوڈ ہو رہا ہے...
      </div>
    `;
  }

  const translationSelect = $("translationSelect");

  if (translationSelect) {
    translationSelect.value = state.translation;
  }

  const reciterSelect = $("reciterSelect");

  if (reciterSelect) {
    reciterSelect.value = state.reciter;
  }

  const fontSize = $("fontSize");

  if (fontSize) {
    fontSize.value = state.fontSize;
  }

  document.documentElement.style.setProperty(
    "--arSize",
    `${state.fontSize}px`
  );

  state.currentSurahNumber = number;

  localStorage.setItem("lastSurah", number);

  try {
    /*
      We request:
      1. Uthmani Arabic
      2. Selected translation
      3. Selected reciter
    */
    const editions = [
      "quran-uthmani",
      state.translation,
      state.reciter
    ].join(",");

    const url =
      `${QURAN_BASE}/surah/${number}/editions/${editions}`;

    const data = await getJSON(url);

    if (!data || !Array.isArray(data.data) || data.data.length < 2) {
      throw new Error("Invalid Surah response");
    }

    const arabicEd = data.data[0];
    const transEd = data.data[1];
    const audioEd = data.data[2] || null;

    setTitle(
      arabicEd.name ||
      arabicEd.englishName ||
      "قرآن"
    );

    const readerTitle = $("readerTitle");

    if (readerTitle) {
      readerTitle.textContent =
        `${arabicEd.englishName || ""} — ${arabicEd.name || ""}`;
    }

    state.currentAyahs = arabicEd.ayahs.map((ayah, index) => {

      const translationAyah =
        transEd &&
        Array.isArray(transEd.ayahs)
          ? transEd.ayahs[index]
          : null;

      const audioAyah =
        audioEd &&
        Array.isArray(audioEd.ayahs)
          ? audioEd.ayahs[index]
          : null;

      return {
        numberInSurah: ayah.numberInSurah,
        globalNumber: ayah.number,
        arabic: ayah.text,
        translation: translationAyah
          ? translationAyah.text
          : "ترجمہ دستیاب نہیں",
        audio: audioAyah
          ? audioAyah.audio
          : null
      };
    });

    state.playIndex = -1;

    renderAyahs();

    if (scrollToAyah) {
      setTimeout(() => {
        const element =
          document.getElementById(
            `ayah-${Number(scrollToAyah)}`
          );

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 250);
    }

  } catch (error) {
    console.error("Open Surah error:", error);

    if (container) {
      container.innerHTML = `
        <div class="loading">
          قرآن لوڈ نہیں ہو سکا۔
          <br><br>
          <button
            class="btn"
            onclick="openSurah(${number})"
          >
            دوبارہ کوشش کریں
          </button>
        </div>
      `;
    }
  }
}

/* ===================== RENDER AYahs ===================== */

function renderAyahs() {
  const container = $("ayahContainer");

  if (!container) return;

  const surah =
    state.surahList.find(
      item => Number(item.number) === Number(state.currentSurahNumber)
    );

  let html = "";

  if (
    surah &&
    Number(state.currentSurahNumber) !== 1 &&
    Number(state.currentSurahNumber) !== 9
  ) {
    html += `
      <div class="ayah" style="text-align:center">
        <div
          class="arabic"
          style="font-size:${state.fontSize}px"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      </div>
    `;
  }

  html += state.currentAyahs.map((ayah, index) => {

    const audioButton = ayah.audio
      ? `
        <button
          class="icon-btn"
          onclick="playFromIndex(${index})"
          title="سنیں"
        >
          🔊
        </button>
      `
      : `
        <button
          class="icon-btn"
          onclick="toast('اس آیت کی آڈیو دستیاب نہیں')"
          title="آڈیو دستیاب نہیں"
        >
          🔇
        </button>
      `;

    return `
      <div
        class="ayah"
        id="ayah-${ayah.numberInSurah}"
      >

        <div class="ayah-top">

          <div class="ayah-number">
            ${escapeHTML(ayah.numberInSurah)}
          </div>

          <div class="ayah-actions">

            ${audioButton}

            <button
              class="icon-btn"
              onclick="bookmarkAyah(${ayah.numberInSurah})"
              title="محفوظ کریں"
            >
              🔖
            </button>

          </div>

        </div>

        <div
          class="arabic"
          style="font-size:${state.fontSize}px"
        >
          ${escapeHTML(ayah.arabic)}
        </div>

        <div class="translation">

          <div class="translation-title">
            ترجمہ
          </div>

          ${escapeHTML(ayah.translation)}

        </div>

        <button
          class="tafseer-btn"
          onclick="
            toggleTafseer(
              ${ayah.globalNumber},
              this
            )
          "
        >
          📘 تفسیر دیکھیں
        </button>

        <div
          class="tafseer hidden"
          id="tafseer-${ayah.globalNumber}"
        ></div>

      </div>
    `;
  }).join("");

  container.innerHTML = html;
}

/* ===================== QURAN SETTINGS ===================== */

function changeArabicSize(value) {
  const size = Number(value);

  if (!size) return;

  state.fontSize = size;

  localStorage.setItem(
    "fontSize",
    String(size)
  );

  document
    .querySelectorAll(".arabic")
    .forEach(element => {
      element.style.fontSize = `${size}px`;
    });
}

async function changeTranslation(value) {
  if (!value) return;

  state.translation = value;

  localStorage.setItem(
    "translation",
    value
  );

  if (state.currentSurahNumber) {
    await openSurah(
      state.currentSurahNumber
    );
  }
}

async function changeReciter(value) {
  if (!value) return;

  state.reciter = value;

  localStorage.setItem(
    "reciter",
    value
  );

  if (state.currentSurahNumber) {
    await openSurah(
      state.currentSurahNumber
    );
  }
}

/* ===================== TAFSEER ===================== */

async function toggleTafseer(
  globalAyahNumber,
  button
) {
  const box =
    $(`tafseer-${globalAyahNumber}`);

  if (!box) return;

  if (!box.classList.contains("hidden")) {
    box.classList.add("hidden");
    return;
  }

  box.classList.remove("hidden");

  if (box.dataset.loaded === "1") {
    return;
  }

  box.innerHTML = `
    <div class="loading">
      تفسیر لوڈ ہو رہی ہے...
    </div>
  `;

  try {

    if (!state.tafsirEditionId) {

      const list =
        await getJSON(
          `${TAFSIR_BASE}/resources/tafsirs?language=urdu`
        );

      const tafsirs =
        Array.isArray(list.tafsirs)
          ? list.tafsirs
          : [];

      const urdu =
        tafsirs.find(
          t =>
            String(t.language_name || "")
              .toLowerCase() === "urdu"
        ) ||
        tafsirs[0];

      state.tafsirEditionId =
        urdu ? urdu.id : null;
    }

    if (!state.tafsirEditionId) {
      throw new Error("Urdu tafsir unavailable");
    }

    const currentAyah =
      state.currentAyahs.find(
        ayah =>
          Number(ayah.globalNumber) ===
          Number(globalAyahNumber)
      );

    if (!currentAyah) {
      throw new Error("Ayah not found");
    }

    const key =
      `${state.currentSurahNumber}:${currentAyah.numberInSurah}`;

    const response =
      await getJSON(
        `${TAFSIR_BASE}/tafsirs/${state.tafsirEditionId}/by_ayah/${key}`
      );

    let text =
      response &&
      response.tafsir
        ? response.tafsir.text
        : "تفسیر دستیاب نہیں۔";

    text = String(text)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]*>/g, " ")
      .trim();

    box.textContent = text || "تفسیر دستیاب نہیں۔";

    box.dataset.loaded = "1";

  } catch (error) {

    console.error("Tafseer error:", error);

    box.textContent =
      "تفسیر لوڈ نہیں ہو سکی۔ انٹرنیٹ چیک کریں اور دوبارہ کوشش کریں۔";
  }
}

/* ===================== BOOKMARK ===================== */

function bookmarkAyah(numberInSurah) {

  if (!state.currentSurahNumber) {
    return;
  }

  localStorage.setItem(
    "lastSurah",
    state.currentSurahNumber
  );

  localStorage.setItem(
    "lastAyah",
    numberInSurah
  );

  toast("محفوظ کر لیا گیا ✓");
}

function continueReading() {

  const surah =
    localStorage.getItem("lastSurah");

  const ayah =
    localStorage.getItem("lastAyah");

  if (!surah) {
    toast("ابھی کوئی محفوظ شدہ مقام نہیں");

    openQuran();

    return;
  }

  openSurah(
    Number(surah),
    ayah ? Number(ayah) : null
  );
}

/* ===================== AUDIO ===================== */

function audioEl() {
  return $("audioEl");
}

function playFromIndex(index) {

  const ayah =
    state.currentAyahs[index];

  if (!ayah) return;

  if (!ayah.audio) {
    toast("اس آیت کی آڈیو دستیاب نہیں");
    return;
  }

  state.playIndex = index;

  playCurrent();
}

async function playCurrent() {

  const ayah =
    state.currentAyahs[state.playIndex];

  if (!ayah) return;

  if (!ayah.audio) {
    toast("اس آیت کی آڈیو دستیاب نہیں");
    return;
  }

  const audio = audioEl();

  const player = $("audioPlayer");

  if (!audio) {
    toast("Audio player HTML میں موجود نہیں");
    return;
  }

  if (player) {
    player.classList.remove("hidden");
  }

  const title = $("audioTitle");

  if (title) {
    title.textContent =
      `آیت ${ayah.numberInSurah} — تلاوت`;
  }

  document
    .querySelectorAll(".ayah")
    .forEach(element =>
      element.classList.remove("current")
    );

  const currentAyah =
    $(`ayah-${ayah.numberInSurah}`);

  if (currentAyah) {
    currentAyah.classList.add("current");

    currentAyah.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  try {

    audio.pause();

    audio.src = ayah.audio;

    audio.load();

    await audio.play();

    state.isPlaying = true;

    const button = $("playPauseBtn");

    if (button) {
      button.textContent = "⏸";
    }

    localStorage.setItem(
      "lastSurah",
      state.currentSurahNumber
    );

    localStorage.setItem(
      "lastAyah",
      ayah.numberInSurah
    );

  } catch (error) {

    console.error("Audio playback error:", error);

    state.isPlaying = false;

    const button = $("playPauseBtn");

    if (button) {
      button.textContent = "▶";
    }

    toast(
      "آڈیو نہیں چل سکی۔ انٹرنیٹ کنکشن چیک کریں۔"
    );
  }
}

function togglePlay() {

  const audio = audioEl();

  if (!audio || !audio.src) {
    toast("پہلے کوئی آیت چلائیں");
    return;
  }

  if (state.isPlaying) {

    audio.pause();

    state.isPlaying = false;

    const button = $("playPauseBtn");

    if (button) {
      button.textContent = "▶";
    }

  } else {

    audio
      .play()
      .then(() => {

        state.isPlaying = true;

        const button = $("playPauseBtn");

        if (button) {
          button.textContent = "⏸";
        }

      })
      .catch(error => {

        console.error(error);

        toast(
          "آڈیو نہیں چل سکی۔ انٹرنیٹ چیک کریں۔"
        );
      });
  }
}

function nextAyah() {

  if (
    state.playIndex >= 0 &&
    state.playIndex <
      state.currentAyahs.length - 1
  ) {

    state.playIndex++;

    playCurrent();

  } else {

    state.isPlaying = false;

    const button = $("playPauseBtn");

    if (button) {
      button.textContent = "▶";
    }
  }
}

function prevAyah() {

  if (state.playIndex > 0) {

    state.playIndex--;

    playCurrent();

  }
}

function closeAudio() {

  const audio = audioEl();

  if (audio) {
    try {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    } catch (e) {}
  }

  const player = $("audioPlayer");

  if (player) {
    player.classList.add("hidden");
  }

  document
    .querySelectorAll(".ayah")
    .forEach(element =>
      element.classList.remove("current")
    );

  state.isPlaying = false;
}

function fmtTime(seconds) {

  seconds = Math.floor(
    Number(seconds) || 0
  );

  const minutes =
    Math.floor(seconds / 60);

  const remaining =
    seconds % 60;

  return (
    minutes +
    ":" +
    String(remaining).padStart(2, "0")
  );
}

/* ===================== HADITH ===================== */

/*
  IMPORTANT:
  Correct Bukhari Urdu edition is:
  urd-bukhari

  NOT:
  urd-bukhari1

  The official editions list confirms urd-bukhari,
  urd-muslim, urd-abudawud, urd-tirmidhi,
  urd-nasai and urd-ibnmajah.
*/

const HADITH_BOOKS = [

  {
    key: "bukhari",
    ur: "صحیح بخاری",
    ara: "ara-bukhari",
    urd: "urd-bukhari"
  },

  {
    key: "muslim",
    ur: "صحیح مسلم",
    ara: "ara-muslim",
    urd: "urd-muslim"
  },

  {
    key: "abudawud",
    ur: "سنن ابو داؤد",
    ara: "ara-abudawud",
    urd: "urd-abudawud"
  },

  {
    key: "tirmidhi",
    ur: "جامع ترمذی",
    ara: "ara-tirmidhi",
    urd: "urd-tirmidhi"
  },

  {
    key: "nasai",
    ur: "سنن نسائی",
    ara: "ara-nasai",
    urd: "urd-nasai"
  },

  {
    key: "ibnmajah",
    ur: "سنن ابن ماجہ",
    ara: "ara-ibnmajah",
    urd: "urd-ibnmajah"
  }

];

function ensureHadithSections() {

  const main = document.querySelector("main");

  if (!main) return;

  /*
    If your HTML already contains these sections,
    this function does nothing.

    If they are missing, JS creates them automatically.
  */

  if (!$("hadithBooks")) {

    const section =
      document.createElement("section");

    section.id = "hadithBooks";
    section.className = "hidden";

    section.innerHTML = `
      <div class="card">
        <h2>📚 کتب حدیث</h2>
      </div>

      <div id="bookList" class="surah-list"></div>
    `;

    main.appendChild(section);
  }

  if (!$("hadithReader")) {

    const section =
      document.createElement("section");

    section.id = "hadithReader";
    section.className = "hidden";

    section.innerHTML = `
      <div class="reader-top">

        <button
          class="btn"
          onclick="backToBooks()"
        >
          ← کتب حدیث
        </button>

        <h2 id="hadithTitle">
          حدیث
        </h2>

      </div>

      <div id="hadithContainer">
        <div class="loading">
          حدیثیں لوڈ ہو رہی ہیں...
        </div>
      </div>
    `;

    main.appendChild(section);
  }
}

function openHadith() {

  ensureHadithSections();

  showSection("hadithBooks");

  setTitle("کتب حدیث");

  const bookList = $("bookList");

  if (!bookList) return;

  bookList.innerHTML =
    HADITH_BOOKS.map(book => `
      <button
        class="surah"
        onclick="
          openHadithBook('${book.key}')
        "
      >

        <div class="surah-number">
          📗
        </div>

        <div class="surah-name">
          <strong>
            ${escapeHTML(book.ur)}
          </strong>

          <small>
            عربی + اردو
          </small>
        </div>

      </button>
    `).join("");
}

async function openHadithBook(key) {

  ensureHadithSections();

  const book =
    HADITH_BOOKS.find(
      item => item.key === key
    );

  if (!book) {
    toast("کتاب نہیں ملی");
    return;
  }

  state.currentBook = book;
  state.hadithOffset = 0;

  showSection("hadithReader");

  setTitle(book.ur);

  const title = $("hadithTitle");

  if (title) {
    title.textContent = book.ur;
  }

  const container =
    $("hadithContainer");

  if (container) {
    container.innerHTML = `
      <div class="loading">
        ${escapeHTML(book.ur)}
        لوڈ ہو رہی ہے...
      </div>
    `;
  }

  try {

    /*
      Load Arabic and Urdu independently.
      If Urdu fails but Arabic works, we still show Arabic.
    */

    const arabicPromise =
      getHadithJSON(book.ara);

    const urduPromise =
      getHadithJSON(book.urd);

    const [arabicResult, urduResult] =
      await Promise.allSettled([
        arabicPromise,
        urduPromise
      ]);

    if (
      arabicResult.status !== "fulfilled"
    ) {
      throw new Error(
        "Arabic hadith edition failed"
      );
    }

    const arabicData =
      arabicResult.value;

    const urduData =
      urduResult.status === "fulfilled"
        ? urduResult.value
        : null;

    book.araHadiths =
      Array.isArray(arabicData.hadiths)
        ? arabicData.hadiths
        : [];

    book.urdHadiths =
      urduData &&
      Array.isArray(urduData.hadiths)
        ? urduData.hadiths
        : [];

    if (!book.araHadiths.length) {
      throw new Error(
        "No Arabic hadiths returned"
      );
    }

    if (
      urduResult.status !== "fulfilled"
    ) {
      toast(
        "اردو ترجمہ دستیاب نہیں، عربی حدیث دکھائی جا رہی ہے۔"
      );
    }

    renderHadithBatch();

  } catch (error) {

    console.error(
      "Hadith loading error:",
      error
    );

    if (container) {

      container.innerHTML = `
        <div class="loading">

          ${escapeHTML(book.ur)}
          لوڈ نہیں ہو سکی۔

          <br><br>

          <small>
            انٹرنیٹ کنکشن چیک کریں۔
          </small>

          <br><br>

          <button
            class="btn"
            onclick="
              openHadithBook('${book.key}')
            "
          >
            دوبارہ کوشش کریں
          </button>

        </div>
      `;
    }
  }
}

function findHadithTranslation(
  arabicHadith
) {

  if (
    !state.currentBook ||
    !Array.isArray(
      state.currentBook.urdHadiths
    )
  ) {
    return null;
  }

  const arabicNumber =
    String(
      arabicHadith.hadithnumber ??
      arabicHadith.hadithNumber ??
      ""
    );

  /*
    First try exact hadith number.
  */
  let match =
    state.currentBook.urdHadiths.find(
      item =>
        String(
          item.hadithnumber ??
          item.hadithNumber ??
          ""
        ) === arabicNumber
    );

  /*
    Some datasets may expose number
    in another field.
  */
  if (!match && arabicNumber) {

    match =
      state.currentBook.urdHadiths.find(
        item =>
          String(item.reference || "")
            .includes(arabicNumber)
      );
  }

  return match || null;
}

function renderHadithBatch() {

  const book =
    state.currentBook;

  if (!book) return;

  const container =
    $("hadithContainer");

  if (!container) return;

  const batchSize = 15;

  const start =
    state.hadithOffset;

  const end =
    start + batchSize;

  const list =
    book.araHadiths.slice(
      start,
      end
    );

  if (state.hadithOffset === 0) {
    container.innerHTML = "";
  }

  const existing =
    $("loadMoreBtn");

  if (existing) {
    existing.remove();
  }

  list.forEach(hadith => {

    const urdu =
      findHadithTranslation(
        hadith
      );

    const number =
      hadith.hadithnumber ??
      hadith.hadithNumber ??
      "";

    const arabicText =
      hadith.text ||
      hadith.hadith ||
      "متن دستیاب نہیں";

    const urduText =
      urdu &&
      (
        urdu.text ||
        urdu.hadith
      )
        ? (
            urdu.text ||
            urdu.hadith
          )
        : "اردو ترجمہ دستیاب نہیں";

    const card =
      document.createElement("div");

    card.className =
      "hadith-card";

    card.style.cssText = `
      background:#0d281f;
      border:1px solid #1d4938;
      border-radius:17px;
      padding:17px;
      margin-bottom:12px;
      line-height:2;
    `;

    const numDiv =
      document.createElement("div");

    numDiv.style.cssText = `
      color:#83c7a3;
      font-weight:bold;
      margin-bottom:10px;
    `;

    numDiv.textContent =
      `حدیث نمبر ${number}`;

    const arabicDiv =
      document.createElement("div");

    arabicDiv.style.cssText = `
      direction:rtl;
      text-align:right;
      font-size:22px;
      margin-bottom:15px;
    `;

    arabicDiv.textContent =
      arabicText;

    const urduDiv =
      document.createElement("div");

    urduDiv.style.cssText = `
      direction:rtl;
      text-align:right;
      background:#102f25;
      border-radius:12px;
      padding:13px;
      color:#d8e6df;
    `;

    urduDiv.textContent =
      urduText;

    card.appendChild(numDiv);
    card.appendChild(arabicDiv);
    card.appendChild(urduDiv);

    container.appendChild(card);
  });

  state.hadithOffset += list.length;

  if (
    state.hadithOffset <
    book.araHadiths.length
  ) {

    const button =
      document.createElement("button");

    button.id =
      "loadMoreBtn";

    button.className =
      "primary";

    button.style.marginBottom =
      "20px";

    button.textContent =
      "مزید احادیث لوڈ کریں";

    button.onclick =
      renderHadithBatch;

    container.appendChild(button);
  }
}

/* ===================== SEERAH ===================== */

const SEERAH_CHAPTERS = [

  {
    title: "ولادت اور بچپن",
    text:
      "نبی کریم ﷺ کی ولادت مکہ مکرمہ میں عام الفیل کے سال ہوئی۔ آپ ﷺ کے والد حضرت عبداللہ کا انتقال ولادت سے پہلے ہو چکا تھا۔ آپ ﷺ کی پرورش پہلے دائی حلیمہ سعدیہ کے ہاں ہوئی، پھر دادا عبدالمطلب اور بعد ازاں چچا ابوطالب نے آپ ﷺ کی کفالت کی۔"
  },

  {
    title: "نبوت سے پہلے کی زندگی",
    text:
      "جوانی میں آپ ﷺ اپنی صداقت اور امانت کی وجہ سے الصادق الامین کے لقب سے مشہور ہوئے۔ آپ ﷺ نے تجارت کی اور حضرت خدیجہ رضی اللہ عنہا سے نکاح ہوا۔ آپ ﷺ اکثر غار حرا میں تنہائی میں عبادت کیا کرتے تھے۔"
  },

  {
    title: "نزول وحی اور آغاز نبوت",
    text:
      "چالیس سال کی عمر میں غار حرا میں آپ ﷺ پر پہلی وحی نازل ہوئی، جس میں سورۃ العلق کی ابتدائی آیات شامل تھیں۔ اس کے بعد اسلام کی دعوت کا آغاز ہوا، پہلے خفیہ طور پر اور پھر علی الاعلان۔"
  },

  {
    title: "مکی دور اور مشکلات",
    text:
      "مکہ میں دعوت اسلام پر مشرکین مکہ نے سخت مخالفت کی۔ مسلمانوں کو ظلم و ستم کا سامنا کرنا پڑا، جس کی وجہ سے کچھ صحابہ کرام حبشہ ہجرت کر گئے۔ اس دور میں حضرت خدیجہ اور ابوطالب کی وفات ہوئی، جسے عام الحزن کہا جاتا ہے۔"
  },

  {
    title: "معراج النبی ﷺ",
    text:
      "نبوت کے گیارہویں سال آپ ﷺ کو معراج کا شرف حاصل ہوا، جس میں آپ ﷺ مسجد حرام سے مسجد اقصیٰ اور پھر آسمانوں کی سیر کو لے جائے گئے، اور اسی سفر میں پانچ وقت کی نماز فرض ہوئی۔"
  },

  {
    title: "ہجرت مدینہ",
    text:
      "مکہ میں مسلسل مظالم کے بعد آپ ﷺ نے حضرت ابوبکر رضی اللہ عنہ کے ساتھ مدینہ منورہ کی طرف ہجرت کی۔ یہ ہجرت اسلامی تاریخ کا اہم موڑ ہے اور اسی سے اسلامی کیلنڈر کا آغاز ہوتا ہے۔"
  },

  {
    title: "مدنی دور",
    text:
      "مدینہ میں آپ ﷺ نے مسجد نبوی کی تعمیر کی، مہاجرین اور انصار کے درمیان بھائی چارہ قائم کیا، اور ایک منظم اسلامی معاشرے کی بنیاد رکھی۔ اسی دور میں بدر، احد اور خندق جیسے اہم غزوات پیش آئے۔"
  },

  {
    title: "فتح مکہ",
    text:
      "ہجرت کے آٹھویں سال آپ ﷺ نے مکہ مکرمہ کو فتح کیا۔ اس عظیم فتح کے باوجود آپ ﷺ نے اپنے دشمنوں کے ساتھ عفو و درگزر کا معاملہ فرمایا۔"
  },

  {
    title: "حجۃ الوداع اور وصال",
    text:
      "دس ہجری میں آپ ﷺ نے آخری حج ادا کیا اور خطبہ حجۃ الوداع ارشاد فرمایا۔ اس کے کچھ عرصے بعد ربیع الاول میں آپ ﷺ کا وصال مدینہ منورہ میں ہوا۔"
  }

];

function openSeerah() {

  const existing =
    $("seerah");

  if (!existing) {

    const main =
      document.querySelector("main");

    if (!main) return;

    const section =
      document.createElement("section");

    section.id =
      "seerah";

    section.className =
      "hidden";

    section.innerHTML = `
      <div
        id="seerahList"
      ></div>
    `;

    main.appendChild(section);
  }

  showSection("seerah");

  setTitle("سیرت النبی ﷺ");

  const list =
    $("seerahList");

  if (!list) return;

  list.innerHTML =
    SEERAH_CHAPTERS.map(
      (chapter, index) => `
        <div
          class="card"
          style="line-height:2"
        >
          <h3>
            ${index + 1}.
            ${escapeHTML(chapter.title)}
          </h3>

          <p>
            ${escapeHTML(chapter.text)}
          </p>
        </div>
      `
    ).join("");
}

/* ===================== DUAS ===================== */

const DUAS = [

  {
    title: "صبح کی دعا",
    ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    ur: "ہم نے صبح کی اور بادشاہت اللہ ہی کے لیے ہے۔"
  },

  {
    title: "شام کی دعا",
    ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    ur: "ہم نے شام کی اور بادشاہت اللہ ہی کے لیے ہے۔"
  },

  {
    title: "کھانے سے پہلے کی دعا",
    ar: "بِسْمِ اللَّهِ",
    ur: "اللہ کے نام سے کھانا شروع کرتا ہوں۔"
  },

  {
    title: "کھانے کے بعد کی دعا",
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ",
    ur: "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھانا کھلایا اور رزق عطا کیا۔"
  },

  {
    title: "گھر سے نکلنے کی دعا",
    ar: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    ur: "اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اور کوئی طاقت و قوت نہیں مگر اللہ کی مدد سے۔"
  },

  {
    title: "سونے سے پہلے کی دعا",
    ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    ur: "اے اللہ! تیرے نام کے ساتھ میں مرتا اور جیتا ہوں۔"
  },

  {
    title: "سفر کی دعا",
    ar: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    ur: "پاک ہے وہ ذات جس نے اس سواری کو ہمارے تابع کیا۔"
  },

  {
    title: "مصیبت کے وقت کی دعا",
    ar: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    ur: "بے شک ہم اللہ ہی کے ہیں اور اسی کی طرف لوٹنے والے ہیں۔"
  }

];

function openDuas() {

  showSection("duas");

  setTitle("مسنون دعائیں");

  const list =
    $("duasList");

  if (!list) return;

  list.innerHTML =
    DUAS.map(
      dua => `
        <div class="dua">

          <div class="dua-title">
            ${escapeHTML(dua.title)}
          </div>

          <div class="arabic">
            ${escapeHTML(dua.ar)}
          </div>

          <div class="translation">

            <div class="translation-title">
              ترجمہ
            </div>

            ${escapeHTML(dua.ur)}

          </div>

        </div>
      `
    ).join("");
}

/* ===================== TASBEEH ===================== */

function openTasbeeh() {

  showSection("tasbeeh");

  setTitle("تسبیح");

  const count =
    $("tasbeehCount");

  if (count) {
    count.textContent =
      localStorage.getItem(
        "tasbeehCount"
      ) || "0";
  }
}

function countTasbeeh() {

  let count =
    Number(
      localStorage.getItem(
        "tasbeehCount"
      ) || 0
    );

  count++;

  localStorage.setItem(
    "tasbeehCount",
    String(count)
  );

  const element =
    $("tasbeehCount");

  if (element) {
    element.textContent =
      String(count);
  }

  if (
    navigator.vibrate
  ) {
    navigator.vibrate(15);
  }
}

function resetTasbeeh() {

  localStorage.setItem(
    "tasbeehCount",
    "0"
  );

  const element =
    $("tasbeehCount");

  if (element) {
    element.textContent = "0";
  }
}

/* ===================== PRAYER TIMES ===================== */

function openPrayer() {

  showSection("prayer");

  setTitle("نماز کے اوقات");
}

function loadPrayerTimes() {

  const list =
    $("prayerList");

  if (list) {
    list.innerHTML = `
      <div class="loading">
        مقام معلوم کیا جا رہا ہے...
      </div>
    `;
  }

  if (
    !navigator.geolocation
  ) {

    if (list) {
      list.innerHTML =
        "آپ کے براؤزر میں لوکیشن دستیاب نہیں۔";
    }

    return;
  }

  navigator.geolocation.getCurrentPosition(

    async position => {

      try {

        const {
          latitude,
          longitude
        } = position.coords;

        const url =
          `${ALADHAN_BASE}/timings` +
          `?latitude=${latitude}` +
          `&longitude=${longitude}` +
          `&method=2`;

        const data =
          await getJSON(url);

        const timings =
          data.data.timings;

        const names = {

          Fajr: "فجر",

          Sunrise:
            "طلوع آفتاب",

          Dhuhr:
            "ظہر",

          Asr:
            "عصر",

          Maghrib:
            "مغرب",

          Isha:
            "عشاء"

        };

        const order = [
          "Fajr",
          "Sunrise",
          "Dhuhr",
          "Asr",
          "Maghrib",
          "Isha"
        ];

        const now =
          new Date();

        const nowMinutes =
          now.getHours() * 60 +
          now.getMinutes();

        let next =
          null;

        for (
          const key of order
        ) {

          const value =
            timings[key];

          if (!value) continue;

          const clean =
            String(value)
              .split(" ")[0];

          const parts =
            clean
              .split(":")
              .map(Number);

          const hour =
            parts[0];

          const minute =
            parts[1];

          if (
            hour * 60 +
            minute >
            nowMinutes
          ) {

            next = key;
            break;
          }
        }

        if (!list) return;

        list.innerHTML =
          order.map(
            key => `
              <div
                class="prayer ${
                  key === next
                    ? "active"
                    : ""
                }"
              >
                <span>
                  ${names[key]}
                </span>

                <span>
                  ${escapeHTML(
                    timings[key] || "--"
                  )}
                </span>
              </div>
            `
          ).join("") +
          `
            <p class="note">
              تاریخ:
              ${
                escapeHTML(
                  data.data.date.readable
                )
              }
            </p>
          `;

      } catch (error) {

        console.error(
          "Prayer times error:",
          error
        );

        if (list) {
          list.innerHTML =
            "اوقات حاصل نہیں ہو سکے۔ دوبارہ کوشش کریں۔";
        }
      }

    },

    error => {

      console.error(
        "Location error:",
        error
      );

      if (list) {
        list.innerHTML = `
          لوکیشن کی اجازت نہیں ملی۔
          <br><br>
          براہ کرم browser میں
          Location permission Allow کریں۔
        `;
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000
    }
  );
}

/* ===================== QIBLA ===================== */

function openQibla() {

  showSection("qibla");

  setTitle("قبلہ");

}

function findQibla() {

  const text =
    $("qiblaText");

  if (text) {
    text.textContent =
      "مقام معلوم کیا جا رہا ہے...";
  }

  if (
    !navigator.geolocation
  ) {

    if (text) {
      text.textContent =
        "آپ کے براؤزر میں لوکیشن دستیاب نہیں۔";
    }

    return;
  }

  navigator.geolocation.getCurrentPosition(

    async position => {

      try {

        const {
          latitude,
          longitude
        } = position.coords;

        const url =
          `${ALADHAN_BASE}/qibla/` +
          `${latitude}/` +
          `${longitude}`;

        const data =
          await getJSON(url);

        const direction =
          Number(
            data.data.direction
          );

        const compass =
          $("compass");

        if (compass) {
          compass.style.transform =
            `rotate(${direction}deg)`;
        }

        if (text) {

          text.textContent =
            `قبلہ کی سمت: شمال سے ` +
            `${direction.toFixed(1)}°`;
        }

        enableOrientation(
          direction
        );

      } catch (error) {

        console.error(
          "Qibla error:",
          error
        );

        if (text) {
          text.textContent =
            "قبلہ کی سمت معلوم نہیں ہو سکی۔ دوبارہ کوشش کریں۔";
        }
      }
    },

    error => {

      console.error(
        "Qibla location error:",
        error
      );

      if (text) {
        text.textContent =
          "لوکیشن کی اجازت نہیں ملی۔";
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000
    }
  );
}

function enableOrientation(
  qiblaDirection
) {

  if (
    typeof DeviceOrientationEvent ===
      "undefined"
  ) {
    return;
  }

  if (
    typeof DeviceOrientationEvent
      .requestPermission ===
      "function"
  ) {

    DeviceOrientationEvent
      .requestPermission()
      .then(permission => {

        if (
          permission ===
          "granted"
        ) {

          window.addEventListener(
            "deviceorientation",
            event =>
              handleOrientation(
                event,
                qiblaDirection
              )
          );
        }

      })
      .catch(error => {
        console.warn(
          "Orientation permission:",
          error
        );
      });

  } else {

    window.addEventListener(
      "deviceorientation",
      event =>
        handleOrientation(
          event,
          qiblaDirection
        )
    );
  }
}

function handleOrientation(
  event,
  qiblaDirection
) {

  let heading;

  if (
    typeof event.webkitCompassHeading ===
      "number"
  ) {

    heading =
      event.webkitCompassHeading;

  } else if (
    typeof event.alpha ===
      "number"
  ) {

    heading =
      360 - event.alpha;

  } else {

    return;
  }

  const relative =
    (
      qiblaDirection -
      heading +
      360
    ) % 360;

  const compass =
    $("compass");

  if (compass) {

    compass.style.transform =
      `rotate(${relative}deg)`;
  }
}

/* ===================== INITIALIZATION ===================== */

function initializeApp() {

  document.documentElement.style.setProperty(
    "--arSize",
    `${state.fontSize}px`
  );

  const fontSize =
    $("fontSize");

  if (fontSize) {
    fontSize.value =
      state.fontSize;
  }

  const translation =
    $("translationSelect");

  if (translation) {
    translation.value =
      state.translation;
  }

  const reciter =
    $("reciterSelect");

  if (reciter) {
    reciter.value =
      state.reciter;
  }

  /*
    Audio events
  */

  const audio =
    audioEl();

  if (audio) {

    audio.addEventListener(
      "ended",
      nextAyah
    );

    audio.addEventListener(
      "play",
      () => {

        state.isPlaying =
          true;

        const button =
          $("playPauseBtn");

        if (button) {
          button.textContent =
            "⏸";
        }
      }
    );

    audio.addEventListener(
      "pause",
      () => {

        state.isPlaying =
          false;

        const button =
          $("playPauseBtn");

        if (button) {
          button.textContent =
            "▶";
        }
      }
    );

    audio.addEventListener(
      "error",
      () => {

        state.isPlaying =
          false;

        const button =
          $("playPauseBtn");

        if (button) {
          button.textContent =
            "▶";
        }

        toast(
          "آڈیو لوڈ نہیں ہو سکی۔ انٹرنیٹ چیک کریں۔"
        );
      }
    );

    audio.addEventListener(
      "timeupdate",
      () => {

        if (
          !Number.isFinite(
            audio.duration
          )
        ) {
          return;
        }

        const progress =
          $("audioProgress");

        if (progress) {

          progress.value =
            (
              audio.currentTime /
              audio.duration
            ) * 100;
        }

        const current =
          $("audioCur");

        if (current) {
          current.textContent =
            fmtTime(
              audio.currentTime
            );
        }

        const duration =
          $("audioDur");

        if (duration) {
          duration.textContent =
            fmtTime(
              audio.duration
            );
        }
      }
    );

    const progress =
      $("audioProgress");

    if (progress) {

      progress.addEventListener(
        "input",
        event => {

          if (
            Number.isFinite(
              audio.duration
            )
          ) {

            audio.currentTime =
              (
                Number(
                  event.target.value
                ) / 100
              ) *
              audio.duration;
          }
        }
      );
    }
  }

  /*
    Create Hadith sections if
    they were not included in HTML.
  */

  ensureHadithSections();

  /*
    Service Worker
  */

  if (
    "serviceWorker" in navigator
  ) {

    window.addEventListener(
      "load",
      () => {

        navigator.serviceWorker
          .register("./sw.js")
          .then(() => {
            console.log(
              "Service Worker registered"
            );
          })
          .catch(error => {
            console.warn(
              "Service Worker registration failed:",
              error
            );
          });

      }
    );
  }
}

/* ===================== START ===================== */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();

}
