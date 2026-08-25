/* =========================================================
   Quran Companion — app.js
   Corrected / Complete Version
   ========================================================= */

"use strict";

/* ===================== API CONFIG ===================== */

const QURAN_BASE = "https://api.alquran.cloud/v1";
const TAFSIR_BASE = "https://api.quran.com/api/v4";
const ALADHAN_BASE = "https://api.aladhan.com/v1";

/*
  Hadith API:
  Primary CDN + JSON fallback + GitHub raw fallback.
*/
const HADITH_CDN =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

const HADITH_RAW =
  "https://raw.githubusercontent.com/fawazahmed0/hadith-api/1";

/* ===================== STATE ===================== */

let state = {
  surahList: [],
  currentSurahNumber: null,
  currentAyahs: [],

  translation:
    localStorage.getItem("translation") || "ur.jalandhry",

  reciter:
    localStorage.getItem("reciter") || "ar.alafasy",

  fontSize:
    localStorage.getItem("fontSize") || "32",

  playIndex: -1,
  isPlaying: false,

  currentBook: null,
  hadithOffset: 0,

  tafsirEditionId: null,

  orientationListenerAdded: false
};

/* ===================== HELPERS ===================== */

function $(id) {
  return document.getElementById(id);
}

function safeText(value) {
  return String(value ?? "");
}

function escapeHTML(value) {
  return safeText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toast(msg) {
  const t = $("toast");

  if (!t) {
    console.log(msg);
    return;
  }

  t.textContent = msg;
  t.classList.remove("hidden");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    t.classList.add("hidden");
  }, 2500);
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

  if (el) {
    el.textContent = title;
  }
}

function isOnline() {
  return navigator.onLine !== false;
}

/* ===================== NETWORK ===================== */

async function getJSON(url, options = {}) {
  if (!isOnline()) {
    throw new Error("offline");
  }

  const response = await fetch(url, {
    cache: "no-store",
    ...options
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}

/*
  Hadith API has multiple fallback URLs.
*/
async function getHadithJSON(edition) {
  const urls = [
    `${HADITH_CDN}/editions/${edition}.min.json`,
    `${HADITH_CDN}/editions/${edition}.json`,
    `${HADITH_RAW}/editions/${edition}.min.json`,
    `${HADITH_RAW}/editions/${edition}.json`
  ];

  let lastError = null;

  for (const url of urls) {
    try {
      return await getJSON(url);
    } catch (error) {
      lastError = error;
      console.warn("Hadith URL failed:", url, error);
    }
  }

  throw lastError || new Error("Hadith API unavailable");
}

/* ===================== NAVIGATION ===================== */

function goHome() {
  stopAudio();

  showSection("home");
  setTitle("Quran Companion");
}

function toggleSettings() {
  const settings = $("settings");

  if (settings) {
    settings.classList.toggle("hidden");
  }
}

function openAbout() {
  showSection("about");
  setTitle("اسلامی معلومات");
}

function openKaaba() {
  showSection("kaaba");
  setTitle("خانہ کعبہ");
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
    list.innerHTML =
      `<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>`;
  }

  try {
    const data = await getJSON(`${QURAN_BASE}/surah`);

    state.surahList = data.data || [];

    renderSurahList(state.surahList);
  } catch (error) {
    console.error("Surah loading error:", error);

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
    container.innerHTML =
      `<div class="loading">کوئی سورت نہیں ملی۔</div>`;
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

  const query = input.value
    .trim()
    .toLowerCase();

  if (!query) {
    renderSurahList(state.surahList);
    return;
  }

  const filtered = state.surahList.filter(s =>
    safeText(s.englishName)
      .toLowerCase()
      .includes(query) ||

    safeText(s.englishNameTranslation)
      .toLowerCase()
      .includes(query) ||

    safeText(s.name)
      .includes(query) ||

    String(s.number) === query
  );

  renderSurahList(filtered);
}

function backToSurahs() {
  stopAudio();

  showSection("quran");
  setTitle("قرآن مجید");
}

/* ===================== OPEN SURAH ===================== */

async function openSurah(number, scrollToAyah = null) {
  number = Number(number);

  if (!number || number < 1 || number > 114) {
    return;
  }

  stopAudio();

  showSection("reader");

  const settings = $("settings");

  if (settings) {
    settings.classList.add("hidden");
  }

  const container = $("ayahContainer");

  if (container) {
    container.innerHTML =
      `<div class="loading">قرآن لوڈ ہو رہا ہے...</div>`;
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

  localStorage.setItem(
    "lastSurah",
    String(number)
  );

  try {
    /*
      Quran API editions:
      quran-uthmani
      translation
      reciter audio
    */

    const editions =
      `quran-uthmani,${state.translation},${state.reciter}`;

    const data = await getJSON(
      `${QURAN_BASE}/surah/${number}/editions/${editions}`
    );

    if (!data.data || data.data.length < 3) {
      throw new Error("Invalid Quran API response");
    }

    const arabicEd = data.data[0];
    const transEd = data.data[1];
    const audioEd = data.data[2];

    setTitle(arabicEd.name);

    const readerTitle = $("readerTitle");

    if (readerTitle) {
      readerTitle.textContent =
        `${arabicEd.englishName} — ${arabicEd.name}`;
    }

    state.currentAyahs =
      (arabicEd.ayahs || []).map((ayah, index) => ({
        numberInSurah: ayah.numberInSurah,
        globalNumber: ayah.number,
        arabic: ayah.text,

        translation:
          transEd?.ayahs?.[index]?.text ||
          "ترجمہ دستیاب نہیں۔",

        audio:
          audioEd?.ayahs?.[index]?.audio ||
          ""
      }));

    renderAyahs();

    if (scrollToAyah) {
      setTimeout(() => {
        const element =
          $(`ayah-${Number(scrollToAyah)}`);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 250);
    }

  } catch (error) {
    console.error("Surah error:", error);

    if (container) {
      container.innerHTML = `
        <div class="loading">
          قرآن لوڈ نہیں ہو سکا۔
          <br>
          انٹرنیٹ کنکشن چیک کریں۔
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

/* ===================== AYAH RENDER ===================== */

function renderAyahs() {
  const container = $("ayahContainer");

  if (!container) return;

  const surah =
    state.surahList.find(
      item =>
        Number(item.number) ===
        Number(state.currentSurahNumber)
    );

  let bismillah = "";

  if (
    surah &&
    state.currentSurahNumber !== 1 &&
    state.currentSurahNumber !== 9
  ) {
    bismillah = `
      <div
        class="ayah"
        style="text-align:center"
      >
        <div
          class="arabic"
          style="font-size:${state.fontSize}px"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      </div>
    `;
  }

  container.innerHTML =
    bismillah +
    state.currentAyahs
      .map((ayah, index) => `
        <div
          class="ayah"
          id="ayah-${ayah.numberInSurah}"
        >

          <div class="ayah-top">

            <div class="ayah-number">
              ${escapeHTML(ayah.numberInSurah)}
            </div>

            <div class="ayah-actions">

              <button
                class="icon-btn"
                onclick="playFromIndex(${index})"
                title="سنیں"
              >
                🔊
              </button>

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
            onclick="toggleTafseer(
              ${ayah.globalNumber},
              this
            )"
          >
            📘 تفسیر دیکھیں
          </button>

          <div
            class="tafseer hidden"
            id="tafseer-${ayah.globalNumber}"
          ></div>

        </div>
      `)
      .join("");
}

/* ===================== QURAN SETTINGS ===================== */

function changeArabicSize(value) {
  state.fontSize = Number(value);

  localStorage.setItem(
    "fontSize",
    String(state.fontSize)
  );

  document.documentElement.style.setProperty(
    "--arSize",
    `${state.fontSize}px`
  );

  document
    .querySelectorAll(".arabic")
    .forEach(element => {
      element.style.fontSize =
        `${state.fontSize}px`;
    });
}

function changeTranslation(value) {
  if (!value) return;

  state.translation = value;

  localStorage.setItem(
    "translation",
    value
  );

  if (state.currentSurahNumber) {
    openSurah(
      state.currentSurahNumber
    );
  }
}

function changeReciter(value) {
  if (!value) return;

  state.reciter = value;

  localStorage.setItem(
    "reciter",
    value
  );

  if (state.currentSurahNumber) {
    openSurah(
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

  box.innerHTML =
    `<div class="loading">تفسیر لوڈ ہو رہی ہے...</div>`;

  try {
    if (!state.tafsirEditionId) {
      const list = await getJSON(
        `${TAFSIR_BASE}/resources/tafsirs?language=urdu`
      );

      const tafsirs =
        list.tafsirs || [];

      const urdu =
        tafsirs.find(
          item =>
            String(item.language_name)
              .toLowerCase() === "urdu"
        ) ||
        tafsirs[0];

      if (!urdu) {
        throw new Error(
          "No Urdu tafsir found"
        );
      }

      state.tafsirEditionId =
        urdu.id;
    }

    const currentAyah =
      state.currentAyahs.find(
        item =>
          Number(item.globalNumber) ===
          Number(globalAyahNumber)
      );

    if (!currentAyah) {
      throw new Error(
        "Ayah not found"
      );
    }

    const key =
      `${state.currentSurahNumber}:${currentAyah.numberInSurah}`;

    const response =
      await getJSON(
        `${TAFSIR_BASE}/tafsirs/${state.tafsirEditionId}/by_ayah/${key}`
      );

    let text =
      response?.tafsir?.text ||
      response?.tafsir ||
      "تفسیر دستیاب نہیں۔";

    text = safeText(text)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, " ");

    box.textContent = text;
    box.dataset.loaded = "1";

  } catch (error) {
    console.error(
      "Tafseer error:",
      error
    );

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
    String(state.currentSurahNumber)
  );

  localStorage.setItem(
    "lastAyah",
    String(numberInSurah)
  );

  toast("محفوظ کر لیا گیا ✓");
}

function continueReading() {
  const surah =
    localStorage.getItem("lastSurah");

  const ayah =
    localStorage.getItem("lastAyah");

  if (!surah) {
    toast(
      "ابھی کوئی محفوظ شدہ مقام نہیں ہے۔"
    );

    openQuran();
    return;
  }

  openSurah(
    Number(surah),
    ayah ? Number(ayah) : null
  );
}

/* ===================== AUDIO PLAYER ===================== */

function audioEl() {
  return $("audioEl");
}

function playFromIndex(index) {
  if (
    index < 0 ||
    index >= state.currentAyahs.length
  ) {
    return;
  }

  state.playIndex = index;

  playCurrent();
}

async function playCurrent() {
  const audioData =
    state.currentAyahs[
      state.playIndex
    ];

  if (!audioData) return;

  if (!audioData.audio) {
    toast(
      "اس آیت کی آڈیو دستیاب نہیں۔"
    );
    return;
  }

  const player =
    $("audioPlayer");

  const audio =
    audioEl();

  if (!audio) {
    toast(
      "Audio player HTML میں موجود نہیں ہے۔"
    );
    return;
  }

  if (player) {
    player.classList.remove(
      "hidden"
    );
  }

  const title =
    $("audioTitle");

  if (title) {
    title.textContent =
      `آیت ${audioData.numberInSurah} — تلاوت`;
  }

  document
    .querySelectorAll(".ayah")
    .forEach(el =>
      el.classList.remove("current")
    );

  const ayahElement =
    $(`ayah-${audioData.numberInSurah}`);

  if (ayahElement) {
    ayahElement.classList.add(
      "current"
    );

    ayahElement.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  try {
    audio.src =
      audioData.audio;

    audio.load();

    await audio.play();

    state.isPlaying = true;

    const playButton =
      $("playPauseBtn");

    if (playButton) {
      playButton.textContent =
        "⏸";
    }

    localStorage.setItem(
      "lastSurah",
      String(state.currentSurahNumber)
    );

    localStorage.setItem(
      "lastAyah",
      String(audioData.numberInSurah)
    );

  } catch (error) {
    console.error(
      "Audio playback error:",
      error
    );

    state.isPlaying = false;

    if (
      error.name ===
      "NotAllowedError"
    ) {
      toast(
        "آڈیو چلانے کے لیے دوبارہ 🔊 دبائیں۔"
      );
    } else {
      toast(
        "آڈیو نہیں چل سکی۔ انٹرنیٹ کنکشن چیک کریں۔"
      );
    }
  }
}

function togglePlay() {
  const audio =
    audioEl();

  if (!audio) return;

  if (!audio.src) {
    if (
      state.currentAyahs.length
    ) {
      state.playIndex =
        state.playIndex >= 0
          ? state.playIndex
          : 0;

      playCurrent();
    }

    return;
  }

  if (state.isPlaying) {
    audio.pause();

    state.isPlaying =
      false;

    const button =
      $("playPauseBtn");

    if (button) {
      button.textContent =
        "▶";
    }

  } else {
    audio.play()
      .then(() => {
        state.isPlaying =
          true;

        const button =
          $("playPauseBtn");

        if (button) {
          button.textContent =
            "⏸";
        }
      })
      .catch(error => {
        console.error(
          "Resume audio error:",
          error
        );
      });
  }
}

function nextAyah() {
  if (
    state.playIndex <
    state.currentAyahs.length - 1
  ) {
    state.playIndex++;

    playCurrent();
  } else {
    state.isPlaying = false;

    const button =
      $("playPauseBtn");

    if (button) {
      button.textContent =
        "▶";
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
  const audio =
    audioEl();

  if (audio) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }

  const player =
    $("audioPlayer");

  if (player) {
    player.classList.add(
      "hidden"
    );
  }

  state.isPlaying = false;
  state.playIndex = -1;

  document
    .querySelectorAll(".ayah")
    .forEach(el =>
      el.classList.remove("current")
    );
}

function stopAudio() {
  const audio =
    audioEl();

  if (audio) {
    audio.pause();
  }

  state.isPlaying = false;

  const button =
    $("playPauseBtn");

  if (button) {
    button.textContent =
      "▶";
  }
}

function fmtTime(seconds) {
  seconds =
    Math.floor(
      Number(seconds) || 0
    );

  return (
    Math.floor(seconds / 60) +
    ":" +
    String(
      seconds % 60
    ).padStart(2, "0")
  );
}

/* ===================== HADITH ===================== */

/*
  Correct edition names:
  ara-bukhari
  urd-bukhari

  NOT:
  urd-bukhari1
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

function openHadith() {
  showSection("hadithBooks");

  setTitle("کتب حدیث");

  const list =
    $("bookList");

  if (!list) {
    toast(
      "Hadith books کا HTML section موجود نہیں۔"
    );
    return;
  }

  list.innerHTML =
    HADITH_BOOKS
      .map(book => `
        <button
          class="book"
          onclick="openHadithBook('${book.key}')"
        >
          <div class="surah-number">
            📗
          </div>

          <div class="surah-name">
            <strong>
              ${escapeHTML(book.ur)}
            </strong>
          </div>
        </button>
      `)
      .join("");
}

function backToBooks() {
  showSection(
    "hadithBooks"
  );

  setTitle("کتب حدیث");
}

async function openHadithBook(key) {
  const book =
    HADITH_BOOKS.find(
      item => item.key === key
    );

  if (!book) {
    return;
  }

  state.currentBook =
    book;

  state.hadithOffset = 0;

  showSection(
    "hadithReader"
  );

  setTitle(book.ur);

  const title =
    $("hadithTitle");

  if (title) {
    title.textContent =
      book.ur;
  }

  const container =
    $("hadithContainer");

  if (!container) {
    toast(
      "Hadith reader HTML موجود نہیں۔"
    );
    return;
  }

  container.innerHTML =
    `<div class="loading">احادیث لوڈ ہو رہی ہیں...</div>`;

  try {
    const [
      arabicData,
      urduData
    ] = await Promise.all([
      getHadithJSON(
        book.ara
      ),
      getHadithJSON(
        book.urd
      )
    ]);

    book.araHadiths =
      Array.isArray(
        arabicData.hadiths
      )
        ? arabicData.hadiths
        : [];

    book.urdHadiths =
      Array.isArray(
        urduData.hadiths
      )
        ? urduData.hadiths
        : [];

    if (
      !book.araHadiths.length
    ) {
      throw new Error(
        "No Arabic hadiths found"
      );
    }

    renderHadithBatch();

  } catch (error) {
    console.error(
      "Hadith loading error:",
      error
    );

    container.innerHTML = `
      <div class="loading">
        احادیث لوڈ نہیں ہو سکیں۔
        <br><br>
        <small>
          انٹرنیٹ کنکشن چیک کریں۔
        </small>
        <br><br>

        <button
          class="btn"
          onclick="openHadithBook('${book.key}')"
        >
          دوبارہ کوشش کریں
        </button>
      </div>
    `;
  }
}

function findUrduHadith(
  hadithNumber
) {
  const book =
    state.currentBook;

  if (!book?.urdHadiths) {
    return null;
  }

  return (
    book.urdHadiths.find(
      item =>
        String(item.hadithnumber) ===
        String(hadithNumber)
    ) ||
    null
  );
}

function renderHadithBatch() {
  const book =
    state.currentBook;

  const container =
    $("hadithContainer");

  if (
    !book ||
    !container
  ) {
    return;
  }

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

  if (start === 0) {
    container.innerHTML = "";
  }

  const oldButton =
    $("loadMoreBtn");

  if (oldButton) {
    oldButton.remove();
  }

  list.forEach(hadith => {
    const urdu =
      findUrduHadith(
        hadith.hadithnumber
      );

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "hadith-card";

    const number =
      escapeHTML(
        hadith.hadithnumber
      );

    const arabic =
      escapeHTML(
        hadith.text
      );

    const urduText =
      urdu
        ? escapeHTML(
            urdu.text
          )
        : "اردو ترجمہ دستیاب نہیں۔";

    card.innerHTML = `
      <div class="hadith-num">
        حدیث نمبر ${number}
      </div>

      <div class="hadith-ar">
        ${arabic}
      </div>

      <div class="hadith-ur">
        ${urduText}
      </div>
    `;

    container.appendChild(
      card
    );
  });

  state.hadithOffset =
    end;

  if (
    state.hadithOffset <
    book.araHadiths.length
  ) {
    const button =
      document.createElement(
        "button"
      );

    button.id =
      "loadMoreBtn";

    button.className =
      "load-more";

    button.textContent =
      "مزید احادیث لوڈ کریں";

    button.onclick =
      renderHadithBatch;

    container.appendChild(
      button
    );
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
      "آپ ﷺ کو معراج کا شرف حاصل ہوا، جس میں آپ ﷺ مسجد حرام سے مسجد اقصیٰ اور پھر آسمانوں کی سیر کو لے جائے گئے، اور اسی سفر میں پانچ وقت کی نماز فرض ہوئی۔"
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
  showSection("seerah");

  setTitle(
    "سیرت النبی ﷺ"
  );

  const container =
    $("seerahList");

  if (!container) {
    toast(
      "Seerah section HTML میں موجود نہیں۔"
    );
    return;
  }

  container.innerHTML =
    SEERAH_CHAPTERS
      .map(
        (chapter, index) => `
          <div class="seerah-chapter">

            <h3>
              ${index + 1}.
              ${escapeHTML(chapter.title)}
            </h3>

            <p>
              ${escapeHTML(chapter.text)}
            </p>

          </div>
        `
      )
      .join("");
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
    ar:
      "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    ur:
      "تمام تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھلایا اور بغیر میری طاقت و قوت کے یہ رزق عطا کیا۔"
  },

  {
    title: "گھر سے نکلنے کی دعا",
    ar:
      "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    ur:
      "اللہ کے نام سے، میں نے اللہ پر بھروسہ کیا، اور کوئی طاقت و قوت نہیں مگر اللہ کی مدد سے۔"
  },

  {
    title: "سونے سے پہلے کی دعا",
    ar:
      "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    ur:
      "اے اللہ! تیرے نام کے ساتھ میں مرتا اور جیتا ہوں۔"
  },

  {
    title: "سفر کی دعا",
    ar:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    ur:
      "پاک ہے وہ ذات جس نے اس سواری کو ہمارے تابع کیا، ورنہ ہم اسے قابو میں لانے والے نہ تھے۔"
  },

  {
    title: "مصیبت کے وقت کی دعا",
    ar:
      "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
    ur:
      "بے شک ہم اللہ ہی کے ہیں اور اسی کی طرف لوٹنے والے ہیں۔"
  }
];

function openDuas() {
  showSection("duas");

  setTitle(
    "مسنون دعائیں"
  );

  const container =
    $("duasList");

  if (!container) {
    toast(
      "Duas section HTML میں موجود نہیں۔"
    );
    return;
  }

  container.innerHTML =
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

  const display =
    $("tasbeehCount");

  if (display) {
    display.textContent =
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

  const display =
    $("tasbeehCount");

  if (display) {
    display.textContent =
      "0";
  }
}

/* ===================== PRAYER TIMES ===================== */

function loadPrayerTimes() {
  const container =
    $("prayerList");

  if (container) {
    container.innerHTML =
      `<div class="loading">مقام معلوم کیا جا رہا ہے...</div>`;
  }

  if (
    !navigator.geolocation
  ) {
    if (container) {
      container.textContent =
        "آپ کے براؤزر میں Location دستیاب نہیں۔";
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
          `${ALADHAN_BASE}/timings?latitude=${latitude}&longitude=${longitude}&method=2`;

        const data =
          await getJSON(url);

        const timings =
          data?.data?.timings || {};

        const names = {
          Fajr: "فجر",
          Sunrise: "طلوع آفتاب",
          Dhuhr: "ظہر",
          Asr: "عصر",
          Maghrib: "مغرب",
          Isha: "عشاء"
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

        const currentMinutes =
          now.getHours() * 60 +
          now.getMinutes();

        let nextKey = null;

        for (
          const key of order
        ) {
          if (!timings[key]) {
            continue;
          }

          const parts =
            timings[key]
              .split(":")
              .map(Number);

          const minutes =
            parts[0] * 60 +
            parts[1];

          if (
            minutes >
            currentMinutes
          ) {
            nextKey = key;
            break;
          }
        }

        if (!container) {
          return;
        }

        container.innerHTML =
          order
            .filter(
              key =>
                timings[key]
            )
            .map(
              key => `
                <div
                  class="prayer ${
                    key === nextKey
                      ? "active"
                      : ""
                  }"
                >
                  <span>
                    ${names[key]}
                  </span>

                  <span>
                    ${escapeHTML(
                      timings[key]
                    )}
                  </span>
                </div>
              `
            )
            .join("") +

          `<p class="note">
            تاریخ:
            ${escapeHTML(
              data?.data?.date?.readable ||
              ""
            )}
          </p>`;

      } catch (error) {
        console.error(
          "Prayer times error:",
          error
        );

        if (container) {
          container.innerHTML =
            `
              اوقات نماز حاصل نہیں ہو سکے۔
              <br><br>
              انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔
            `;
        }
      }
    },

    error => {
      console.error(
        "Location error:",
        error
      );

      if (container) {
        container.innerHTML =
          `
            لوکیشن کی اجازت نہیں ملی۔
            <br><br>
            Browser کی Location permission کو Allow کریں۔
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

  setTitle(
    "قبلہ کی سمت"
  );
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
        "آپ کے براؤزر میں Location دستیاب نہیں۔";
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

        const data =
          await getJSON(
            `${ALADHAN_BASE}/qibla/${latitude}/${longitude}`
          );

        const direction =
          Number(
            data?.data?.direction
          );

        if (
          !Number.isFinite(
            direction
          )
        ) {
          throw new Error(
            "Invalid qibla direction"
          );
        }

        const compass =
          $("compass");

        if (compass) {
          compass.style.transform =
            `rotate(${direction}deg)`;
        }

        if (text) {
          text.textContent =
            `قبلہ کی سمت: شمال سے ${direction.toFixed(
              1
            )}°`;
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

async function enableOrientation(
  qiblaDegree
) {
  if (
    typeof DeviceOrientationEvent ===
      "undefined"
  ) {
    return;
  }

  try {
    if (
      typeof DeviceOrientationEvent.requestPermission ===
      "function"
    ) {
      const permission =
        await DeviceOrientationEvent.requestPermission();

      if (
        permission !==
        "granted"
      ) {
        return;
      }
    }

    if (
      state.orientationListenerAdded
    ) {
      window.removeEventListener(
        "deviceorientation",
        window.__qiblaOrientationHandler
      );
    }

    window.__qiblaOrientationHandler =
      event => {
        handleOrientation(
          event,
          qiblaDegree
        );
      };

    window.addEventListener(
      "deviceorientation",
      window.__qiblaOrientationHandler
    );

    state.orientationListenerAdded =
      true;

  } catch (error) {
    console.warn(
      "Orientation permission:",
      error
    );
  }
}

function handleOrientation(
  event,
  qiblaDegree
) {
  let heading = 0;

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
  }

  const relative =
    (
      qiblaDegree -
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

/* ===================== ONLINE / OFFLINE ===================== */

window.addEventListener(
  "offline",
  () => {
    toast(
      "انٹرنیٹ کنکشن ختم ہو گیا ہے۔"
    );
  }
);

window.addEventListener(
  "online",
  () => {
    toast(
      "انٹرنیٹ دوبارہ منسلک ہو گیا ہے۔"
    );
  }
);

/* ===================== AUDIO EVENTS ===================== */

function setupAudio() {
  const audio =
    audioEl();

  if (!audio) {
    return;
  }

  audio.addEventListener(
    "ended",
    () => {
      nextAyah();
    }
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
    event => {
      console.error(
        "Audio element error:",
        event
      );

      state.isPlaying =
        false;

      const button =
        $("playPauseBtn");

      if (button) {
        button.textContent =
          "▶";
      }

      toast(
        "آڈیو سرور سے حاصل نہیں ہو سکی۔"
      );
    }
  );

  audio.addEventListener(
    "timeupdate",
    () => {
      if (
        !audio.duration ||
        !Number.isFinite(
          audio.duration
        )
      ) {
        return;
      }

      const progress =
        $("audioProgress");

      const current =
        $("audioCur");

      const duration =
        $("audioDur");

      if (progress) {
        progress.value =
          (
            audio.currentTime /
            audio.duration
          ) * 100;
      }

      if (current) {
        current.textContent =
          fmtTime(
            audio.currentTime
          );
      }

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
          audio.duration &&
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

/* ===================== INIT ===================== */

function initApp() {
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

  setupAudio();

  /*
    Register service worker.
    Use sw.js because this app.js is written
    to work with your current project structure.
  */

  if (
    "serviceWorker" in navigator
  ) {
    window.addEventListener(
      "load",
      () => {
        navigator.serviceWorker
          .register("./sw.js")
          .then(
            registration => {
              console.log(
                "Service Worker registered:",
                registration.scope
              );
            }
          )
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

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initApp
  );
} else {
  initApp();
}

/* ===================== GLOBAL EXPORTS ===================== */

/*
  These make functions available to
  onclick="..." in index.html.
*/

window.goHome = goHome;
window.toggleSettings = toggleSettings;
window.openAbout = openAbout;
window.openKaaba = openKaaba;

window.openQuran = openQuran;
window.filterSurahs = filterSurahs;
window.openSurah = openSurah;
window.backToSurahs = backToSurahs;

window.changeArabicSize =
  changeArabicSize;

window.changeTranslation =
  changeTranslation;

window.changeReciter =
  changeReciter;

window.toggleTafseer =
  toggleTafseer;

window.bookmarkAyah =
  bookmarkAyah;

window.continueReading =
  continueReading;

window.playFromIndex =
  playFromIndex;

window.togglePlay =
  togglePlay;

window.nextAyah =
  nextAyah;

window.prevAyah =
  prevAyah;

window.closeAudio =
  closeAudio;

window.openHadith =
  openHadith;

window.openHadithBook =
  openHadithBook;

window.backToBooks =
  backToBooks;

window.openSeerah =
  openSeerah;

window.openDuas =
  openDuas;

window.openTasbeeh =
  openTasbeeh;

window.countTasbeeh =
  countTasbeeh;

window.resetTasbeeh =
  resetTasbeeh;

window.loadPrayerTimes =
  loadPrayerTimes;

window.openQibla =
  openQibla;

window.findQibla =
  findQibla;
