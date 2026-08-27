/* =========================================================
   QURAN COMPANION — CORRECTED script.js
   ========================================================= */

const QURAN_BASE = "https://api.alquran.cloud/v1";
const TAFSIR_BASE = "https://api.quran.com/api/v4";
const ALADHAN_BASE = "https://api.aladhan.com/v1";
const CDN_AUDIO_SURAH = "https://cdn.islamic.network/quran/audio-surah/128";

const GA_MEASUREMENT_ID = "G-2N96YJ324P";

/* =========================
   GOOGLE ANALYTICS
========================= */

function analyticsEvent(name, params = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch (e) {}
}

/* =========================
   APP STATE
========================= */

let state = {
  surahList: [],
  currentSurahNumber: null,
  currentJuz: null,
  currentAyahs: [],
  translation: localStorage.getItem("translation") || "ur.jalandhry",
  reciter: localStorage.getItem("reciter") || "ar.alafasy",
  fontSize: Number(localStorage.getItem("fontSize")) || 36,
  fontFamily: localStorage.getItem("fontFamily") || "'Amiri',serif",
  playIndex: -1,
  isPlaying: false
};

let tafsirEditionId = null;

/* =========================
   HELPERS
========================= */

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;

  t.textContent = msg;
  t.classList.remove("hidden");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    t.classList.add("hidden");
  }, 2500);
}

function showSection(id) {
  document
    .querySelectorAll("main > section")
    .forEach(section => section.classList.add("hidden"));

  const section = document.getElementById(id);

  if (section) {
    section.classList.remove("hidden");
  }
}

function setTitle(title) {
  const el = document.getElementById("headerTitle");
  if (el) el.textContent = title;
}

async function getJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

/* =========================
   THEME
========================= */

function applyTheme() {
  const light = localStorage.getItem("theme") === "light";

  document.body.classList.toggle("light", light);

  const btn = document.getElementById("themeBtn");

  if (btn) {
    btn.textContent = light ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  const isLight = localStorage.getItem("theme") === "light";
  const newTheme = isLight ? "dark" : "light";

  localStorage.setItem("theme", newTheme);
  applyTheme();

  analyticsEvent("theme_changed", {
    theme: newTheme
  });
}

/* =========================
   HOME
========================= */

function goHome() {
  showSection("home");
  setTitle("قرآن کریم");

  analyticsEvent("home_opened");
}

function toggleSettings() {
  const settings = document.getElementById("settings");

  if (!settings) return;

  settings.classList.toggle("hidden");

  analyticsEvent("settings_toggled", {
    visible: !settings.classList.contains("hidden")
  });
}

/* =========================
   SURAH LIST
========================= */

async function openQuran() {
  showSection("quran");
  setTitle("قرآن کریم");

  analyticsEvent("quran_opened");

  const container = document.getElementById("surahList");

  if (!container) return;

  if (state.surahList.length > 0) {
    renderSurahList(state.surahList);
    return;
  }

  container.innerHTML =
    `<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>`;

  try {
    const data = await getJSON(`${QURAN_BASE}/surah`);

    state.surahList = Array.isArray(data.data)
      ? data.data
      : [];

    renderSurahList(state.surahList);

  } catch (error) {
    console.error("Surah list error:", error);

    container.innerHTML = `
      <div class="loading">
        سورتیں لوڈ نہیں ہو سکیں۔
        <br><br>
        انٹرنیٹ چیک کریں۔
        <br><br>
        <button class="btn" onclick="openQuran()">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;
  }
}

function renderSurahList(list) {
  const container = document.getElementById("surahList");

  if (!container) return;

  if (!list.length) {
    container.innerHTML =
      `<div class="loading">کوئی سورت نہیں ملی۔</div>`;
    return;
  }

  container.innerHTML = `
    <div class="surah-list">

      ${list.map(s => `
        <button
          type="button"
          class="surah"
          onclick="openSurah(${s.number})"
        >

          <div class="surah-number">
            ${s.number}
          </div>

          <div class="surah-name">

            <strong>
              ${s.name}
            </strong>

            <small>
              ${s.englishName}
              —
              ${s.englishNameTranslation}
              ·
              ${s.numberOfAyahs}
              آیات
            </small>

          </div>

        </button>
      `).join("")}

    </div>
  `;
}

function filterSurahs() {
  const input = document.getElementById("surahSearch");

  if (!input) return;

  const q = input.value.trim().toLowerCase();

  if (!q) {
    renderSurahList(state.surahList);
    return;
  }

  if (/^\d+\s*:\s*\d+$/.test(q)) {
    return;
  }

  const filtered = state.surahList.filter(s =>
    s.englishName.toLowerCase().includes(q) ||
    s.englishNameTranslation.toLowerCase().includes(q) ||
    s.name.includes(q) ||
    String(s.number) === q
  );

  renderSurahList(filtered);
}

function trySearchAyah() {
  const input = document.getElementById("surahSearch");

  if (!input) return;

  const q = input.value.trim();

  const match = q.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);

  if (!match) return;

  const surahNumber = Number(match[1]);
  const ayahNumber = Number(match[2]);

  const surah = state.surahList.find(
    s => s.number === surahNumber
  );

  if (!surah) {
    toast("سورہ نمبر غلط ہے");
    return;
  }

  if (
    ayahNumber < 1 ||
    ayahNumber > surah.numberOfAyahs
  ) {
    toast("آیت نمبر غلط ہے");
    return;
  }

  openSurah(surahNumber, ayahNumber);
}

function backToSurahs() {
  showSection("quran");
  setTitle("قرآن کریم");
}

/* =========================
   SURAH READER
========================= */

async function openSurah(number, scrollToAyah = null) {
  showSection("reader");

  document
    .getElementById("settings")
    ?.classList.add("hidden");

  document
    .getElementById("fullSurahBtn")
    ?.classList.remove("hidden");

  const container = document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML =
    `<div class="loading">قرآن لوڈ ہو رہا ہے...</div>`;

  state.currentSurahNumber = Number(number);
  state.currentJuz = null;

  localStorage.setItem("lastSurah", number);

  setReaderSettings();

  analyticsEvent("surah_opened", {
    surah_number: number
  });

  try {
    const editions =
      `quran-uthmani,${state.translation},${state.reciter}`;

    const data = await getJSON(
      `${QURAN_BASE}/surah/${number}/editions/${editions}`
    );

    if (
      !data.data ||
      data.data.length < 3
    ) {
      throw new Error("Invalid API response");
    }

    const arabicEd = data.data[0];
    const transEd = data.data[1];
    const audioEd = data.data[2];

    setTitle(arabicEd.name);

    const readerTitle =
      document.getElementById("readerTitle");

    if (readerTitle) {
      readerTitle.textContent =
        `${arabicEd.englishName} — ${arabicEd.name}`;
    }

    state.currentAyahs = arabicEd.ayahs.map((ayah, index) => ({
      numberInSurah: ayah.numberInSurah,
      globalNumber: ayah.number,
      surahNumber: number,
      surahName: arabicEd.name,
      arabic: ayah.text,
      translation:
        transEd.ayahs[index]?.text || "",
      audio:
        audioEd.ayahs[index]?.audio || ""
    }));

    renderAyahs(false);

    if (scrollToAyah) {
      setTimeout(() => {
        const ayah = state.currentAyahs.find(
          a => a.numberInSurah === Number(scrollToAyah)
        );

        if (ayah) {
          const el =
            document.getElementById(
              `ayah-${ayah.globalNumber}`
            );

          el?.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 300);
    }

  } catch (error) {
    console.error("Open surah error:", error);

    container.innerHTML = `
      <div class="loading">
        قرآن لوڈ نہیں ہو سکا۔
        <br><br>
        انٹرنیٹ چیک کریں۔
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

/* =========================
   AYAH RENDER
========================= */

function renderAyahs(isJuz = false) {
  const container = document.getElementById("ayahContainer");

  if (!container) return;

  let html = "";

  if (!isJuz) {
    const surah = state.surahList.find(
      s => s.number === state.currentSurahNumber
    );

    if (
      surah &&
      state.currentSurahNumber !== 1 &&
      state.currentSurahNumber !== 9
    ) {
      html += `
        <div class="ayah" style="text-align:center">
          <div
            class="arabic"
            style="
              font-size:${state.fontSize}px;
              font-family:${state.fontFamily}
            "
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>
      `;
    }
  }

  const bookmarks = getBookmarks();

  state.currentAyahs.forEach((ayah, index) => {
    const saved = bookmarks.some(
      b => b.globalNumber === ayah.globalNumber
    );

    let juzHeader = "";

    if (
      isJuz &&
      (
        index === 0 ||
        state.currentAyahs[index - 1].surahNumber !==
          ayah.surahNumber
      )
    ) {
      juzHeader = `
        <div
          class="reader-top"
          style="margin-top:6px"
        >
          <h2>${ayah.surahName}</h2>
          <span></span>
        </div>
      `;
    }

    html += `
      ${juzHeader}

      <div
        class="ayah"
        id="ayah-${ayah.globalNumber}"
      >

        <div class="ayah-top">

          <div class="ayah-number">
            ${ayah.numberInSurah}
          </div>

          <div class="ayah-actions">

            <button
              type="button"
              class="icon-btn"
              onclick="playFromIndex(${index})"
              title="سنیں"
            >
              🔊
            </button>

            <button
              type="button"
              class="icon-btn ${saved ? "saved" : ""}"
              id="bm-${ayah.globalNumber}"
              onclick="toggleBookmark(${ayah.globalNumber})"
              title="محفوظ کریں"
            >
              ⭐
            </button>

          </div>

        </div>

        <div
          class="arabic"
          style="
            font-size:${state.fontSize}px;
            font-family:${state.fontFamily}
          "
        >
          ${ayah.arabic}
        </div>

        <div class="translation">

          <div class="translation-title">
            ترجمہ
          </div>

          ${ayah.translation}

        </div>

        <button
          type="button"
          class="tafseer-btn"
          onclick="
            toggleTafseer(
              ${ayah.globalNumber},
              ${ayah.surahNumber},
              ${ayah.numberInSurah}
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
  });

  container.innerHTML = html;
}

/* =========================
   SETTINGS
========================= */

function setReaderSettings() {
  const translation =
    document.getElementById("translationSelect");

  const reciter =
    document.getElementById("reciterSelect");

  const fontSize =
    document.getElementById("fontSize");

  const fontFamily =
    document.getElementById("fontFamilySelect");

  if (translation) {
    translation.value = state.translation;
  }

  if (reciter) {
    reciter.value = state.reciter;
  }

  if (fontSize) {
    fontSize.value = state.fontSize;
  }

  if (fontFamily) {
    fontFamily.value = state.fontFamily;
  }
}

function changeArabicSize(value) {
  state.fontSize = Number(value);

  localStorage.setItem(
    "fontSize",
    state.fontSize
  );

  document
    .querySelectorAll(".arabic")
    .forEach(el => {
      el.style.fontSize =
        `${state.fontSize}px`;
    });
}

function changeFontFamily(value) {
  state.fontFamily = value;

  localStorage.setItem(
    "fontFamily",
    value
  );

  document
    .querySelectorAll(".arabic")
    .forEach(el => {
      el.style.fontFamily = value;
    });

  analyticsEvent(
    "font_family_changed",
    {
      font_family: value
    }
  );
}

function changeTranslation(value) {
  state.translation = value;

  localStorage.setItem(
    "translation",
    value
  );

  if (state.currentJuz) {
    openJuz(state.currentJuz);
  } else if (state.currentSurahNumber) {
    openSurah(state.currentSurahNumber);
  }

  analyticsEvent(
    "translation_changed",
    {
      translation: value
    }
  );
}

function changeReciter(value) {
  state.reciter = value;

  localStorage.setItem(
    "reciter",
    value
  );

  if (state.currentJuz) {
    openJuz(state.currentJuz);
  } else if (state.currentSurahNumber) {
    openSurah(state.currentSurahNumber);
  }

  analyticsEvent(
    "reciter_changed",
    {
      reciter: value
    }
  );
}

/* =========================
   JUZ
========================= */

function openJuzList() {
  showSection("juzList");
  setTitle("پارہ منتخب کریں");

  analyticsEvent("juz_list_opened");

  const grid =
    document.getElementById("juzGrid");

  if (!grid) return;

  let html = "";

  for (let i = 1; i <= 30; i++) {
    html += `
      <button
        type="button"
        class="juz-item"
        onclick="openJuz(${i})"
      >
        ${i}
        <small>پارہ</small>
      </button>
    `;
  }

  grid.innerHTML = html;
}

async function openJuz(juzNumber) {
  showSection("reader");

  document
    .getElementById("settings")
    ?.classList.add("hidden");

  document
    .getElementById("fullSurahBtn")
    ?.classList.add("hidden");

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML =
    `<div class="loading">لوڈ ہو رہا ہے...</div>`;

  state.currentSurahNumber = null;
  state.currentJuz = Number(juzNumber);

  setTitle(`پارہ ${juzNumber}`);

  const readerTitle =
    document.getElementById("readerTitle");

  if (readerTitle) {
    readerTitle.textContent =
      `پارہ ${juzNumber}`;
  }

  setReaderSettings();

  analyticsEvent("juz_opened", {
    juz_number: juzNumber
  });

  try {
    const editions =
      `quran-uthmani,${state.translation},${state.reciter}`;

    const data = await getJSON(
      `${QURAN_BASE}/juz/${juzNumber}/editions/${editions}`
    );

    if (
      !data.data ||
      data.data.length < 3
    ) {
      throw new Error("Invalid Juz response");
    }

    const arabicEd = data.data[0];
    const transEd = data.data[1];
    const audioEd = data.data[2];

    state.currentAyahs =
      arabicEd.ayahs.map((ayah, index) => ({
        numberInSurah:
          ayah.numberInSurah,

        globalNumber:
          ayah.number,

        surahNumber:
          ayah.surah?.number || null,

        surahName:
          ayah.surah?.name || "",

        arabic:
          ayah.text,

        translation:
          transEd.ayahs[index]?.text || "",

        audio:
          audioEd.ayahs[index]?.audio || ""
      }));

    renderAyahs(true);

  } catch (error) {
    console.error("Juz error:", error);

    container.innerHTML = `
      <div class="loading">
        پارہ لوڈ نہیں ہو سکا۔
        <br><br>
        <button
          class="btn"
          onclick="openJuz(${juzNumber})"
        >
          دوبارہ کوشش کریں
        </button>
      </div>
    `;
  }
}

/* =========================
   TAFSIR
========================= */

async function toggleTafseer(
  globalAyahNumber,
  surahNumber,
  ayahInSurah
) {
  const box =
    document.getElementById(
      `tafseer-${globalAyahNumber}`
    );

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

  analyticsEvent(
    "tafsir_opened",
    {
      surah_number: surahNumber,
      ayah_number: ayahInSurah
    }
  );

  try {
    if (!tafsirEditionId) {
      const list = await getJSON(
        `${TAFSIR_BASE}/resources/tafsirs?language=urdu`
      );

      const tafsirs =
        Array.isArray(list.tafsirs)
          ? list.tafsirs
          : [];

      const urdu =
        tafsirs.find(
          t =>
            String(t.language_name).toLowerCase() ===
            "urdu"
        ) || tafsirs[0];

      tafsirEditionId =
        urdu?.id || null;
    }

    if (!tafsirEditionId) {
      throw new Error("No tafsir edition");
    }

    const key =
      `${surahNumber}:${ayahInSurah}`;

    const result =
      await getJSON(
        `${TAFSIR_BASE}/tafsirs/${tafsirEditionId}/by_ayah/${key}`
      );

    let text =
      result.tafsir?.text ||
      "تفسیر دستیاب نہیں۔";

    text = text.replace(
      /<[^>]*>/g,
      " "
    );

    box.innerHTML = text;
    box.dataset.loaded = "1";

  } catch (error) {
    console.error("Tafsir error:", error);

    box.innerHTML =
      "تفسیر لوڈ نہیں ہو سکی۔ دوبارہ کوشش کریں۔";
  }
}

/* =========================
   BOOKMARKS
========================= */

function getBookmarks() {
  try {
    return JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    );
  } catch (error) {
    return [];
  }
}

function saveBookmarks(list) {
  localStorage.setItem(
    "bookmarks",
    JSON.stringify(list)
  );
}

function toggleBookmark(globalAyahNumber) {
  const ayah =
    state.currentAyahs.find(
      a =>
        a.globalNumber ===
        globalAyahNumber
    );

  if (!ayah) return;

  let list = getBookmarks();

  const index =
    list.findIndex(
      b =>
        b.globalNumber ===
        globalAyahNumber
    );

  const button =
    document.getElementById(
      `bm-${globalAyahNumber}`
    );

  if (index >= 0) {
    list.splice(index, 1);

    button?.classList.remove("saved");

    toast(
      "محفوظ شدہ سے ہٹا دیا گیا"
    );

    analyticsEvent(
      "bookmark_removed",
      {
        surah_number:
          ayah.surahNumber,

        ayah_number:
          ayah.numberInSurah
      }
    );

  } else {
    list.unshift({
      globalNumber:
        ayah.globalNumber,

      surahNumber:
        ayah.surahNumber,

      surahName:
        ayah.surahName,

      numberInSurah:
        ayah.numberInSurah,

      savedAt:
        Date.now()
    });

    button?.classList.add("saved");

    toast(
      "محفوظ کر لیا گیا ✓"
    );

    analyticsEvent(
      "bookmark_added",
      {
        surah_number:
          ayah.surahNumber,

        ayah_number:
          ayah.numberInSurah
      }
    );
  }

  saveBookmarks(list);

  if (ayah.surahNumber) {
    localStorage.setItem(
      "lastSurah",
      ayah.surahNumber
    );

    localStorage.setItem(
      "lastAyah",
      ayah.numberInSurah
    );
  }
}

function openBookmarks() {
  showSection("bookmarksSection");

  setTitle("محفوظ شدہ مقامات");

  const container =
    document.getElementById(
      "bookmarksList"
    );

  if (!container) return;

  const list = getBookmarks();

  if (!list.length) {
    container.innerHTML = `
      <div class="loading">
        ابھی کوئی مقام محفوظ نہیں۔
        <br><br>
        کسی آیت پر ⭐ دبا کر محفوظ کریں۔
      </div>
    `;
    return;
  }

  container.innerHTML =
    list.map(bookmark => `
      <div class="bookmark-card">

        <button
          type="button"
          class="bookmark-del"
          onclick="
            removeBookmark(
              ${bookmark.globalNumber},
              event
            )
          "
        >
          🗑
        </button>

        <button
          type="button"
          class="bookmark-info"
          onclick="
            openSurah(
              ${bookmark.surahNumber},
              ${bookmark.numberInSurah}
            )
          "
        >

          <strong>
            ${bookmark.surahName}
            —
            آیت ${bookmark.numberInSurah}
          </strong>

          <small>
            ${new Date(
              bookmark.savedAt
            ).toLocaleDateString("ur-PK")}
          </small>

        </button>

      </div>
    `).join("");
}

function removeBookmark(
  globalAyahNumber,
  event
) {
  event?.stopPropagation();

  const list =
    getBookmarks().filter(
      b =>
        b.globalNumber !==
        globalAyahNumber
    );

  saveBookmarks(list);

  toast("محفوظ مقام حذف کر دیا گیا");

  openBookmarks();
}

function continueReading() {
  const surah =
    localStorage.getItem("lastSurah");

  const ayah =
    localStorage.getItem("lastAyah");

  if (!surah) {
    toast(
      "ابھی کوئی محفوظ شدہ مقام نہیں"
    );

    openQuran();
    return;
  }

  openSurah(
    Number(surah),
    ayah ? Number(ayah) : null
  );
}

/* =========================
   AUDIO
========================= */

function audioEl() {
  return document.getElementById("audioEl");
}

function showAudioPlayer() {
  document
    .getElementById("audioPlayer")
    ?.classList.remove("hidden");
}

function playFromIndex(index) {
  if (
    index < 0 ||
    index >= state.currentAyahs.length
  ) {
    return;
  }

  state.playIndex = index;

  const ayah =
    state.currentAyahs[index];

  analyticsEvent(
    "ayah_audio_play",
    {
      surah_number:
        ayah?.surahNumber,

      ayah_number:
        ayah?.numberInSurah
    }
  );

  playCurrent();
}

function playCurrent() {
  const ayah =
    state.currentAyahs[
      state.playIndex
    ];

  if (!ayah) return;

  showAudioPlayer();

  const title =
    document.getElementById(
      "audioTitle"
    );

  if (title) {
    title.textContent =
      `${ayah.surahName} — آیت ${ayah.numberInSurah}`;
  }

  document
    .querySelectorAll(".ayah")
    .forEach(el =>
      el.classList.remove("current")
    );

  const ayahElement =
    document.getElementById(
      `ayah-${ayah.globalNumber}`
    );

  ayahElement?.classList.add("current");

  ayahElement?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  const audio = audioEl();

  if (!audio) return;

  if (!ayah.audio) {
    toast("اس آیت کی آڈیو دستیاب نہیں");
    return;
  }

  audio.src = ayah.audio;

  audio.play()
    .then(() => {
      state.isPlaying = true;

      const btn =
        document.getElementById(
          "playPauseBtn"
        );

      if (btn) btn.textContent = "⏸";
    })
    .catch(error => {
      console.error("Audio error:", error);

      state.isPlaying = false;

      const btn =
        document.getElementById(
          "playPauseBtn"
        );

      if (btn) btn.textContent = "▶";
    });

  if (ayah.surahNumber) {
    localStorage.setItem(
      "lastSurah",
      ayah.surahNumber
    );

    localStorage.setItem(
      "lastAyah",
      ayah.numberInSurah
    );
  }
}

function playFullSurah() {
  if (!state.currentSurahNumber) {
    toast("پہلے کوئی سورت کھولیں");
    return;
  }

  const audio = audioEl();

  if (!audio) return;

  showAudioPlayer();

  state.playIndex = -1;

  const title =
    document.getElementById(
      "audioTitle"
    );

  if (title) {
    title.textContent =
      "پوری سورت — مسلسل تلاوت";
  }

  document
    .querySelectorAll(".ayah")
    .forEach(el =>
      el.classList.remove("current")
    );

  audio.src =
    `${CDN_AUDIO_SURAH}/${state.reciter}/${state.currentSurahNumber}.mp3`;

  audio.play()
    .then(() => {
      state.isPlaying = true;

      const btn =
        document.getElementById(
          "playPauseBtn"
        );

      if (btn) btn.textContent = "⏸";

      analyticsEvent(
        "full_surah_audio_played",
        {
          surah_number:
            state.currentSurahNumber
        }
      );
    })
    .catch(error => {
      console.error(
        "Full surah audio error:",
        error
      );

      toast(
        "آڈیو چل نہیں سکی"
      );
    });
}

function togglePlay() {
  const audio = audioEl();

  if (!audio || !audio.src) return;

  if (state.isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(() => {});
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
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }

  document
    .getElementById("audioPlayer")
    ?.classList.add("hidden");

  state.isPlaying = false;
  state.playIndex = -1;
}

function fmtTime(seconds) {
  const total =
    Math.floor(seconds || 0);

  return (
    Math.floor(total / 60) +
    ":" +
    String(total % 60).padStart(2, "0")
  );
}

/* =========================
   PRAYER TIMES
========================= */

function openPrayer() {
  showSection("prayer");
  setTitle("نماز کے اوقات");

  analyticsEvent("prayer_opened");
}

function loadPrayerTimes() {
  const container =
    document.getElementById(
      "prayerList"
    );

  if (!container) return;

  container.innerHTML =
    `<div class="loading">مقام معلوم کیا جا رہا ہے...</div>`;

  if (!navigator.geolocation) {
    container.innerHTML =
      "آپ کے فون میں لوکیشن دستیاب نہیں۔";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      try {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const data =
          await getJSON(
            `${ALADHAN_BASE}/timings?latitude=${latitude}&longitude=${longitude}&method=2`
          );

        const timings =
          data.data.timings;

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

        const now = new Date();

        const nowMinutes =
          now.getHours() * 60 +
          now.getMinutes();

        let nextPrayer = null;

        for (const key of order) {
          const parts =
            timings[key]
              .split(":")
              .map(Number);

          const minutes =
            parts[0] * 60 +
            parts[1];

          if (minutes > nowMinutes) {
            nextPrayer = key;
            break;
          }
        }

        container.innerHTML =
          order.map(key => `
            <div class="prayer ${
              key === nextPrayer
                ? "active"
                : ""
            }">

              <span>
                ${names[key]}
              </span>

              <span>
                ${timings[key]}
              </span>

            </div>
          `).join("") +
          `
            <p class="note">
              تاریخ:
              ${data.data.date.readable}
            </p>
          `;

        analyticsEvent(
          "prayer_times_loaded"
        );

      } catch (error) {
        console.error(
          "Prayer error:",
          error
        );

        container.innerHTML =
          "اوقات حاصل نہیں ہو سکے۔ دوبارہ کوشش کریں۔";
      }
    },

    () => {
      container.innerHTML =
        "لوکیشن کی اجازت نہیں ملی۔ براہ کرم Location Allow کریں۔";
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000
    }
  );
}

/* =========================
   QIBLA
========================= */

function openQibla() {
  showSection("qibla");
  setTitle("قبلہ");

  analyticsEvent("qibla_opened");
}

function findQibla() {
  const text =
    document.getElementById(
      "qiblaText"
    );

  if (text) {
    text.textContent =
      "مقام معلوم کیا جا رہا ہے...";
  }

  if (!navigator.geolocation) {
    toast("لوکیشن دستیاب نہیں");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      try {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const data =
          await getJSON(
            `${ALADHAN_BASE}/qibla/${latitude}/${longitude}`
          );

        const direction =
          Number(data.data.direction);

        const compass =
          document.getElementById(
            "compass"
          );

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

        analyticsEvent(
          "qibla_found"
        );

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

    () => {
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

function enableOrientation(qiblaDegree) {
  if (
    typeof DeviceOrientationEvent !==
      "undefined" &&
    typeof DeviceOrientationEvent.requestPermission ===
      "function"
  ) {
    DeviceOrientationEvent
      .requestPermission()
      .then(result => {
        if (result === "granted") {
          window.addEventListener(
            "deviceorientation",
            event =>
              handleOrientation(
                event,
                qiblaDegree
              )
          );
        }
      })
      .catch(() => {});
  } else {
    window.addEventListener(
      "deviceorientation",
      event =>
        handleOrientation(
          event,
          qiblaDegree
        )
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
    document.getElementById(
      "compass"
    );

  if (compass) {
    compass.style.transform =
      `rotate(${relative}deg)`;
  }
}

/* =========================
   AUDIO EVENTS
========================= */

function setupAudio() {
  const audio = audioEl();

  if (!audio) return;

  audio.addEventListener(
    "ended",
    () => {
      if (state.playIndex >= 0) {
        nextAyah();
      }
    }
  );

  audio.addEventListener(
    "play",
    () => {
      state.isPlaying = true;

      const button =
        document.getElementById(
          "playPauseBtn"
        );

      if (button) {
        button.textContent = "⏸";
      }
    }
  );

  audio.addEventListener(
    "pause",
    () => {
      state.isPlaying = false;

      const button =
        document.getElementById(
          "playPauseBtn"
        );

      if (button) {
        button.textContent = "▶";
      }
    }
  );

  audio.addEventListener(
    "timeupdate",
    () => {
      if (!audio.duration) return;

      const progress =
        document.getElementById(
          "audioProgress"
        );

      const current =
        document.getElementById(
          "audioCur"
        );

      const duration =
        document.getElementById(
          "audioDur"
        );

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
    document.getElementById(
      "audioProgress"
    );

  if (progress) {
    progress.addEventListener(
      "input",
      event => {
        if (audio.duration) {
          audio.currentTime =
            (
              Number(event.target.value) /
              100
            ) *
            audio.duration;
        }
      }
    );
  }
}

/* =========================
   APP START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    applyTheme();
    setupAudio();

    analyticsEvent(
      "app_loaded"
    );

    console.log(
      "Quran Companion loaded successfully."
    );
  }
);

/* =========================
   SERVICE WORKER
========================= */

if (
  "serviceWorker" in navigator
) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("./sw.js")
        .catch(error => {
          console.warn(
            "Service Worker:",
            error
          );
        });
    }
  );
}
