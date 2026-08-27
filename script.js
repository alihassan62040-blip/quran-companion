/* ===================== Quran Companion — script.js ===================== */

const QURAN_BASE = "https://api.alquran.cloud/v1";
const TAFSIR_BASE = "https://api.quran.com/api/v4";
const ALADHAN_BASE = "https://api.aladhan.com/v1";
const CDN_AUDIO_SURAH = "https://cdn.islamic.network/quran/audio-surah/128";

const GA_MEASUREMENT_ID = "G-2N96YJ324P";

/* ===================== GOOGLE ANALYTICS ===================== */

function analyticsEvent(name, params = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch (e) {}
}

/* ===================== STATE ===================== */

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

/* ===================== HELPERS ===================== */

function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;

  t.textContent = msg;
  t.classList.remove("hidden");

  setTimeout(() => {
    t.classList.add("hidden");
  }, 2500);
}

function showSection(id) {
  document
    .querySelectorAll("main > section")
    .forEach(s => s.classList.add("hidden"));

  const section = document.getElementById(id);

  if (section) {
    section.classList.remove("hidden");
  }
}

function setTitle(t) {
  const el = document.getElementById("headerTitle");

  if (el) {
    el.textContent = t;
  }
}

async function getJSON(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

/* ===================== THEME ===================== */

function applyTheme() {
  const light =
    localStorage.getItem("theme") === "light";

  document.body.classList.toggle("light", light);

  const btn = document.getElementById("themeBtn");

  if (btn) {
    btn.textContent = light ? "☀️" : "🌙";
  }
}

function toggleTheme() {
  const light =
    localStorage.getItem("theme") === "light";

  localStorage.setItem(
    "theme",
    light ? "dark" : "light"
  );

  applyTheme();

  analyticsEvent("theme_changed", {
    theme: light ? "dark" : "light"
  });
}

/* ===================== NAVIGATION ===================== */

function goHome() {
  showSection("home");
  setTitle("قرآن کریم");

  analyticsEvent("home_opened");
}

function toggleSettings() {
  const settings =
    document.getElementById("settings");

  if (!settings) return;

  settings.classList.toggle("hidden");

  analyticsEvent("settings_toggled", {
    visible: !settings.classList.contains("hidden")
  });
}

/* ===================== QURAN — SURAH LIST ===================== */

async function openQuran() {
  showSection("quran");
  setTitle("قرآن کریم");

  analyticsEvent("quran_opened");

  const listBox =
    document.getElementById("surahList");

  if (!listBox) return;

  if (state.surahList.length) {
    renderSurahList(state.surahList);
    return;
  }

  listBox.innerHTML =
    `<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>`;

  try {
    const data =
      await getJSON(`${QURAN_BASE}/surah`);

    state.surahList =
      Array.isArray(data.data)
        ? data.data
        : [];

    renderSurahList(state.surahList);

  } catch (e) {
    listBox.innerHTML = `
      <div class="loading">
        لوڈ نہیں ہو سکا۔
        <br>
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
  const container =
    document.getElementById("surahList");

  if (!container) return;

  container.innerHTML = `
    <div class="surah-list">
      ${list.map(s => `
        <button
          class="surah"
          onclick="openSurah(${s.number})"
        >
          <div class="surah-number">
            ${s.number}
          </div>

          <div class="surah-name">
            <strong>${s.name}</strong>

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
  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const q =
    input.value.trim().toLowerCase();

  if (!q) {
    renderSurahList(state.surahList);
    return;
  }

  if (/^\d+\s*:\s*\d+$/.test(q)) {
    return;
  }

  renderSurahList(
    state.surahList.filter(s =>
      s.englishName
        .toLowerCase()
        .includes(q) ||

      s.englishNameTranslation
        .toLowerCase()
        .includes(q) ||

      s.name.includes(q) ||

      String(s.number) === q
    )
  );
}

function trySearchAyah() {
  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const q = input.value.trim();

  const m =
    q.match(/^(\d{1,3})\s*:\s*(\d{1,3})$/);

  if (!m) return;

  const surahNum = Number(m[1]);
  const ayahNum = Number(m[2]);

  const s =
    state.surahList.find(
      x => x.number === surahNum
    );

  if (!s) {
    toast("سورہ نمبر غلط ہے");
    return;
  }

  if (
    ayahNum < 1 ||
    ayahNum > s.numberOfAyahs
  ) {
    toast("آیت نمبر غلط ہے");
    return;
  }

  analyticsEvent("ayah_search", {
    surah_number: surahNum,
    ayah_number: ayahNum
  });

  openSurah(
    surahNum,
    ayahNum
  );
}

function backToSurahs() {
  showSection("quran");
  setTitle("قرآن کریم");
}

/* ===================== JUZ ===================== */

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

  document.getElementById(
    "ayahContainer"
  ).innerHTML =
    `<div class="loading">لوڈ ہو رہا ہے...</div>`;

  state.currentSurahNumber = null;
  state.currentJuz = juzNumber;

  setTitle(`پارہ ${juzNumber}`);

  const readerTitle =
    document.getElementById("readerTitle");

  if (readerTitle) {
    readerTitle.textContent =
      `پارہ ${juzNumber}`;
  }

  analyticsEvent("juz_opened", {
    juz_number: juzNumber
  });

  try {
    const editions =
      `quran-uthmani,${state.translation},${state.reciter}`;

    const data =
      await getJSON(
        `${QURAN_BASE}/juz/${juzNumber}/editions/${editions}`
      );

    const [
      arabicEd,
      transEd,
      audioEd
    ] = data.data;

    state.currentAyahs =
      arabicEd.ayahs.map((a, i) => ({
        numberInSurah: a.numberInSurah,
        globalNumber: a.number,
        surahNumber:
          a.surah?.number || null,
        surahName:
          a.surah?.name || "",
        arabic: a.text,
        translation:
          transEd.ayahs[i]?.text || "",
        audio:
          audioEd.ayahs[i]?.audio || ""
      }));

    renderAyahs(true);

  } catch (e) {
    document.getElementById(
      "ayahContainer"
    ).innerHTML = `
      <div class="loading">
        لوڈ نہیں ہو سکا۔
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

/* ===================== SURAH READER ===================== */

async function openSurah(
  number,
  scrollToAyah = null
) {
  showSection("reader");

  document
    .getElementById("settings")
    ?.classList.add("hidden");

  document
    .getElementById("fullSurahBtn")
    ?.classList.remove("hidden");

  document.getElementById(
    "ayahContainer"
  ).innerHTML =
    `<div class="loading">لوڈ ہو رہا ہے...</div>`;

  const translationSelect =
    document.getElementById(
      "translationSelect"
    );

  if (translationSelect) {
    translationSelect.value =
      state.translation;
  }

  const reciterSelect =
    document.getElementById(
      "reciterSelect"
    );

  if (reciterSelect) {
    reciterSelect.value =
      state.reciter;
  }

  const fontSize =
    document.getElementById("fontSize");

  if (fontSize) {
    fontSize.value = state.fontSize;
  }

  const fontFamily =
    document.getElementById(
      "fontFamilySelect"
    );

  if (fontFamily) {
    fontFamily.value =
      state.fontFamily;
  }

  state.currentSurahNumber =
    number;

  state.currentJuz = null;

  localStorage.setItem(
    "lastSurah",
    number
  );

  analyticsEvent("surah_opened", {
    surah_number: number
  });

  try {
    const editions =
      `quran-uthmani,${state.translation},${state.reciter}`;

    const data =
      await getJSON(
        `${QURAN_BASE}/surah/${number}/editions/${editions}`
      );

    if (
      !data.data ||
      data.data.length < 3
    ) {
      throw new Error(
        "Invalid API response"
      );
    }

    const [
      arabicEd,
      transEd,
      audioEd
    ] = data.data;

    setTitle(
      arabicEd.name
    );

    const readerTitle =
      document.getElementById(
        "readerTitle"
      );

    if (readerTitle) {
      readerTitle.textContent =
        `${arabicEd.englishName} — ${arabicEd.name}`;
    }

    state.currentAyahs =
      arabicEd.ayahs.map((a, i) => ({
        numberInSurah:
          a.numberInSurah,

        globalNumber:
          a.number,

        surahNumber:
          number,

        surahName:
          arabicEd.name,

        arabic:
          a.text,

        translation:
          transEd.ayahs[i]?.text || "",

        audio:
          audioEd.ayahs[i]?.audio || ""
      }));

    renderAyahs(false);

    if (scrollToAyah) {
      setTimeout(() => {
        const el =
          document.getElementById(
            "ayah-" +
            scrollToAyah
          );

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 300);
    }

  } catch (e) {
    console.error(
      "openSurah error:",
      e
    );

    document.getElementById(
      "ayahContainer"
    ).innerHTML = `
      <div class="loading">
        قرآن لوڈ نہیں ہو سکا۔
        <br>
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

/* ===================== RENDER AYahs ===================== */

function renderAyahs(isJuz) {
  let bismillah = "";

  if (!isJuz) {
    const s =
      state.surahList.find(
        x =>
          x.number ===
          state.currentSurahNumber
      );

    if (
      s &&
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

  const savedList =
    getBookmarks();

  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (!container) return;

  container.innerHTML =
    bismillah +

    state.currentAyahs.map(
      (a, i) => {
        const isSaved =
          savedList.some(
            b =>
              b.globalNumber ===
              a.globalNumber
          );

        const juzHeader =
          isJuz &&
          (
            i === 0 ||
            state.currentAyahs[
              i - 1
            ].surahNumber !==
            a.surahNumber
          )
            ? `
              <div
                class="reader-top"
                style="margin-top:6px"
              >
                <h2>${a.surahName}</h2>
                <span></span>
              </div>
            `
            : "";

        return `
          ${juzHeader}

          <div
            class="ayah"
            id="ayah-${a.globalNumber}"
          >

            <div class="ayah-top">

              <div class="ayah-number">
                ${a.numberInSurah}
              </div>

              <div class="ayah-actions">

                <button
                  class="icon-btn"
                  onclick="playFromIndex(${i})"
                  title="سنیں"
                >
                  🔊
                </button>

                <button
                  class="icon-btn ${isSaved ? "saved" : ""}"
                  id="bm-${a.globalNumber}"
                  onclick="toggleBookmark(${a.globalNumber})"
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
              ${a.arabic}
            </div>

            <div class="translation">
              <div class="translation-title">
                ترجمہ
              </div>

              ${a.translation}
            </div>

            <button
              class="tafseer-btn"
              onclick="toggleTafseer(
                ${a.globalNumber},
                ${a.surahNumber},
                ${a.numberInSurah}
              )"
            >
              📘 تفسیر دیکھیں
            </button>

            <div
              class="tafseer hidden"
              id="tafseer-${a.globalNumber}"
            ></div>

          </div>
        `;
      }
    ).join("");
}

/* ===================== SETTINGS ===================== */

function changeArabicSize(v) {
  state.fontSize = v;

  localStorage.setItem(
    "fontSize",
    v
  );

  document
    .querySelectorAll(".arabic")
    .forEach(
      el =>
        el.style.fontSize =
          v + "px"
    );
}

function changeFontFamily(v) {
  state.fontFamily = v;

  localStorage.setItem(
    "fontFamily",
    v
  );

  document
    .querySelectorAll(".arabic")
    .forEach(
      el =>
        el.style.fontFamily =
          v
    );

  analyticsEvent(
    "font_family_changed",
    {
      font_family: v
    }
  );
}

function changeTranslation(v) {
  state.translation = v;

  localStorage.setItem(
    "translation",
    v
  );

  analyticsEvent(
    "translation_changed",
    {
      translation: v
    }
  );

  if (state.currentJuz) {
    openJuz(
      state.currentJuz
    );
  } else if (
    state.currentSurahNumber
  ) {
    openSurah(
      state.currentSurahNumber
    );
  }
}

function changeReciter(v) {
  state.reciter = v;

  localStorage.setItem(
    "reciter",
    v
  );

  analyticsEvent(
    "reciter_changed",
    {
      reciter: v
    }
  );

  if (state.currentJuz) {
    openJuz(
      state.currentJuz
    );
  } else if (
    state.currentSurahNumber
  ) {
    openSurah(
      state.currentSurahNumber
    );
  }
}

/* ===================== TAFSEER ===================== */

let tafsirEditionId = null;

async function toggleTafseer(
  globalAyahNumber,
  surahNumber,
  ayahInSurah
) {
  const box =
    document.getElementById(
      "tafseer-" +
      globalAyahNumber
    );

  if (!box) return;

  if (
    !box.classList.contains(
      "hidden"
    )
  ) {
    box.classList.add(
      "hidden"
    );

    return;
  }

  box.classList.remove(
    "hidden"
  );

  analyticsEvent(
    "tafsir_opened",
    {
      surah_number:
        surahNumber,

      ayah_number:
        ayahInSurah
    }
  );

  if (box.dataset.loaded) {
    return;
  }

  box.innerHTML =
    `<div class="loading">تفسیر لوڈ ہو رہی ہے...</div>`;

  try {
    if (!tafsirEditionId) {
      const list =
        await getJSON(
          `${TAFSIR_BASE}/resources/tafsirs?language=urdu`
        );

      const urdu =
        (list.tafsirs || [])
          .find(
            t =>
              t.language_name ===
              "urdu"
          ) ||
        (list.tafsirs || [])[0];

      tafsirEditionId =
        urdu
          ? urdu.id
          : null;
    }

    if (!tafsirEditionId) {
      throw new Error(
        "No tafsir edition"
      );
    }

    const key =
      `${surahNumber}:${ayahInSurah}`;

    const tf =
      await getJSON(
        `${TAFSIR_BASE}/tafsirs/${tafsirEditionId}/by_ayah/${key}`
      );

    const text =
      tf.tafsir
        ? tf.tafsir.text
        : "تفسیر دستیاب نہیں۔";

    box.innerHTML =
      text.replace(
        /<[^>]*>/g,
        " "
      );

    box.dataset.loaded =
      "1";

  } catch (e) {
    box.innerHTML =
      `تفسیر لوڈ نہیں ہو سکی۔
       <br>
       انٹرنیٹ چیک کریں یا دوبارہ کوشش کریں۔`;
  }
}

/* ===================== BOOKMARKS ===================== */

function getBookmarks() {
  try {
    return JSON.parse(
      localStorage.getItem(
        "bookmarks"
      ) || "[]"
    );
  } catch (e) {
    return [];
  }
}

function saveBookmarks(list) {
  localStorage.setItem(
    "bookmarks",
    JSON.stringify(list)
  );
}

function toggleBookmark(
  globalAyahNumber
) {
  const a =
    state.currentAyahs.find(
      x =>
        x.globalNumber ===
        globalAyahNumber
    );

  if (!a) return;

  let list =
    getBookmarks();

  const idx =
    list.findIndex(
      b =>
        b.globalNumber ===
        globalAyahNumber
    );

  const btn =
    document.getElementById(
      "bm-" +
      globalAyahNumber
    );

  if (idx >= 0) {
    list.splice(
      idx,
      1
    );

    btn?.classList.remove(
      "saved"
    );

    toast(
      "محفوظ شدہ سے ہٹا دیا گیا"
    );

    analyticsEvent(
      "bookmark_removed",
      {
        surah_number:
          a.surahNumber,

        ayah_number:
          a.numberInSurah
      }
    );

  } else {
    list.unshift({
      globalNumber:
        a.globalNumber,

      surahNumber:
        a.surahNumber,

      surahName:
        a.surahName,

      numberInSurah:
        a.numberInSurah,

      savedAt:
        Date.now()
    });

    btn?.classList.add(
      "saved"
    );

    toast(
      "محفوظ کر لیا گیا ✓"
    );

    analyticsEvent(
      "bookmark_added",
      {
        surah_number:
          a.surahNumber,

        ayah_number:
          a.numberInSurah
      }
    );
  }

  saveBookmarks(list);

  if (a.surahNumber) {
    localStorage.setItem(
      "lastSurah",
      a.surahNumber
    );

    localStorage.setItem(
      "lastAyah",
      a.numberInSurah
    );
  }
}

function openBookmarks() {
  showSection(
    "bookmarksSection"
  );

  setTitle(
    "محفوظ شدہ مقامات"
  );

  analyticsEvent(
    "bookmarks_opened"
  );

  const list =
    getBookmarks();

  const container =
    document.getElementById(
      "bookmarksList"
    );

  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="loading">
        ابھی کوئی مقام محفوظ نہیں۔
        <br>
        کسی آیت پر ⭐ دبا کر محفوظ کریں۔
      </div>
    `;

    return;
  }

  container.innerHTML =
    list.map(
      b => `
        <div class="bookmark-card">

          <button
            class="bookmark-del"
            onclick="removeBookmark(
              ${b.globalNumber},
              event
            )"
          >
            🗑
          </button>

          <button
            class="bookmark-info"
            style="
              background:none;
              border:0;
              color:inherit
            "
            onclick="openSurah(
              ${b.surahNumber},
              ${b.numberInSurah}
            )"
          >
            <strong>
              ${b.surahName}
              —
              آیت ${b.numberInSurah}
            </strong>

            <small>
              ${new Date(
                b.savedAt
              ).toLocaleDateString("ur")}
            </small>
          </button>

        </div>
      `
    ).join("");
}

function removeBookmark(
  globalAyahNumber,
  e
) {
  e.stopPropagation();

  const list =
    getBookmarks().filter(
      b =>
        b.globalNumber !==
        globalAyahNumber
    );

  saveBookmarks(list);

  analyticsEvent(
    "bookmark_removed_from_list"
  );

  openBookmarks();
}

function continueReading() {
  const s =
    localStorage.getItem(
      "lastSurah"
    );

  const a =
    localStorage.getItem(
      "lastAyah"
    );

  if (!s) {
    toast(
      "ابھی کوئی محفوظ شدہ مقام نہیں"
    );

    openQuran();
    return;
  }

  analyticsEvent(
    "continue_reading"
  );

  openSurah(
    Number(s),
    a
      ? Number(a)
      : null
  );
}

/* ===================== AUDIO ===================== */

function audioEl() {
  return document.getElementById(
    "audioEl"
  );
}

function playFromIndex(i) {
  state.playIndex = i;

  analyticsEvent(
    "ayah_audio_play",
    {
      surah_number:
        state.currentAyahs[i]
          ?.surahNumber,

      ayah_number:
        state.currentAyahs[i]
          ?.numberInSurah
    }
  );

  playCurrent();
}

function playCurrent() {
  const a =
    state.currentAyahs[
      state.playIndex
    ];

  if (!a) return;

  document
    .getElementById(
      "audioPlayer"
    )
    ?.classList.remove(
      "hidden"
    );

  document.getElementById(
    "audioTitle"
  ).textContent =
    `${a.surahName} — آیت ${a.numberInSurah}`;

  document
    .querySelectorAll(".ayah")
    .forEach(
      el =>
        el.classList.remove(
          "current"
        )
    );

  const ayahEl =
    document.getElementById(
      "ayah-" +
      a.globalNumber
    );

  ayahEl?.classList.add(
    "current"
  );

  ayahEl?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  const audio =
    audioEl();

  if (!audio) return;

  if (!a.audio) {
    toast(
      "اس آیت کی آڈیو دستیاب نہیں"
    );

    return;
  }

  audio.src =
    a.audio;

  audio.play()
    .then(() => {
      state.isPlaying =
        true;

      document.getElementById(
        "playPauseBtn"
      ).textContent =
        "⏸";
    })
    .catch(() => {
      state.isPlaying =
        false;

      document.getElementById(
        "playPauseBtn"
      ).textContent =
        "▶";
    });

  if (a.surahNumber) {
    localStorage.setItem(
      "lastSurah",
      a.surahNumber
    );

    localStorage.setItem(
      "lastAyah",
      a.numberInSurah
    );
  }
}

function playFullSurah() {
  if (!state.currentSurahNumber) {
    return;
  }

  document
    .getElementById(
      "audioPlayer"
    )
    ?.classList.remove(
      "hidden"
    );

  document.getElementById(
    "audioTitle"
  ).textContent =
    "پوری سورت — مسلسل تلاوت";

  document
    .querySelectorAll(".ayah")
    .forEach(
      el =>
        el.classList.remove(
          "current"
        )
    );

  state.playIndex = -1;

  const audio =
    audioEl();

  if (!audio) return;

  audio.src =
    `${CDN_AUDIO_SURAH}/${state.reciter}/${state.currentSurahNumber}.mp3`;

  audio.play()
    .then(() => {
      state.isPlaying =
        true;

      document.getElementById(
        "playPauseBtn"
      ).textContent =
        "⏸";

      analyticsEvent(
        "full_surah_audio_played",
        {
          surah_number:
            state.currentSurahNumber
        }
      );
    })
    .catch(() => {
      state.isPlaying =
        false;

      toast(
        "آڈیو چل نہیں سکی"
      );
    });
}

function togglePlay() {
  const audio =
    audioEl();

  if (!audio || !audio.src) {
    return;
  }

  if (state.isPlaying) {
    audio.pause();

    state.isPlaying =
      false;

    document.getElementById(
      "playPauseBtn"
    ).textContent =
      "▶";

  } else {
    audio.play()
      .then(() => {
        state.isPlaying =
          true;

        document.getElementById(
          "playPauseBtn"
        ).textContent =
          "⏸";
      })
      .catch(() => {});
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
  if (
    state.playIndex > 0
  ) {
    state.playIndex--;
    playCurrent();
  }
}

function closeAudio() {
  const audio =
    audioEl();

  if (audio) {
    audio.pause();
    audio.removeAttribute(
      "src"
    );
    audio.load();
  }

  document
    .getElementById(
      "audioPlayer"
    )
    ?.classList.add(
      "hidden"
    );

  state.isPlaying =
    false;
}

function fmtTime(s) {
  s = Math.floor(s || 0);

  return (
    Math.floor(s / 60) +
    ":" +
    String(
      s % 60
    ).padStart(2, "0")
  );
}

/* ===================== PRAYER TIMES ===================== */

function openPrayer() {
  showSection("prayer");

  setTitle(
    "نماز کے اوقات"
  );

  analyticsEvent(
    "prayer_opened"
  );
}

function loadPrayerTimes() {
  document.getElementById(
    "prayerList"
  ).innerHTML =
    `<div class="loading">مقام معلوم کیا جا رہا ہے...</div>`;

  analyticsEvent(
    "prayer_times_requested"
  );

  if (!navigator.geolocation) {
    toast(
      "لوکیشن دستیاب نہیں"
    );

    return;
  }

  navigator.geolocation.getCurrentPosition(
    async pos => {
      try {
        const {
          latitude,
          longitude
        } = pos.coords;

        const data =
          await getJSON(
            `${ALADHAN_BASE}/timings?latitude=${latitude}&longitude=${longitude}&method=2`
          );

        const t =
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

        const now =
          new Date();

        const nowMin =
          now.getHours() * 60 +
          now.getMinutes();

        let nextKey = null;

        for (
          const k of order
        ) {
          const [
            h,
            m
          ] =
            t[k]
              .split(":")
              .map(Number);

          if (
            h * 60 + m >
            nowMin
          ) {
            nextKey = k;
            break;
          }
        }

        document.getElementById(
          "prayerList"
        ).innerHTML =

          order.map(
            k =>
              `<div class="prayer ${
                k === nextKey
                  ? "active"
                  : ""
              }">
                <span>${names[k]}</span>
                <span>${t[k]}</span>
              </div>`
          ).join("") +

          `<p class="note">
            تاریخ:
            ${data.data.date.readable}
          </p>`;

      } catch (e) {
        document.getElementById(
          "prayerList"
        ).innerHTML =
          `اوقات حاصل نہیں ہو سکے۔ دوبارہ کوشش کریں۔`;
      }
    },

    () => {
      document.getElementById(
        "prayerList"
      ).innerHTML =
        `لوکیشن کی اجازت نہیں ملی۔`;
    }
  );
}

/* ===================== QIBLA ===================== */

function openQibla() {
  showSection("qibla");

  setTitle("قبلہ");

  analyticsEvent(
    "qibla_opened"
  );
}

function findQibla() {
  document.getElementById(
    "qiblaText"
  ).textContent =
    "مقام معلوم کیا جا رہا ہے...";

  analyticsEvent(
    "qibla_requested"
  );

  if (!navigator.geolocation) {
    toast(
      "لوکیشن دستیاب نہیں"
    );

    return;
  }

  navigator.geolocation.getCurrentPosition(
    async pos => {
      try {
        const {
          latitude,
          longitude
        } = pos.coords;

        const data =
          await getJSON(
            `${ALADHAN_BASE}/qibla/${latitude}/${longitude}`
          );

        const deg =
          data.data.direction;

        document.getElementById(
          "compass"
        ).style.transform =
          `rotate(${deg}deg)`;

        document.getElementById(
          "qiblaText"
        ).textContent =
          `قبلہ کی سمت: شمال سے ${deg.toFixed(
            1
          )}°`;

        analyticsEvent(
          "qibla_found"
        );

        enableOrientation(
          deg
        );

      } catch (e) {
        document.getElementById(
          "qiblaText"
        ).textContent =
          "سمت معلوم نہیں ہو سکی۔ دوبارہ کوشش کریں۔";
      }
    },

    () => {
      document.getElementById(
        "qiblaText"
      ).textContent =
        "لوکیشن کی اجازت نہیں ملی۔";
    }
  );
}

function enableOrientation(
  qiblaDeg
) {
  if (
    typeof DeviceOrientationEvent !==
      "undefined" &&

    typeof DeviceOrientationEvent
      .requestPermission ===
      "function"
  ) {
    DeviceOrientationEvent
      .requestPermission()
      .then(r => {
        if (r === "granted") {
          window.addEventListener(
            "deviceorientation",
            e =>
              handleOrientation(
                e,
                qiblaDeg
              )
          );
        }
      })
      .catch(() => {});
  } else {
    window.addEventListener(
      "deviceorientation",
      e =>
        handleOrientation(
          e,
          qiblaDeg
        )
    );
  }
}

function handleOrientation(
  e,
  qiblaDeg
) {
  const heading =
    e.webkitCompassHeading ||
    (
      e.alpha != null
        ? 360 - e.alpha
        : 0
    );

  const rel =
    (
      qiblaDeg -
      heading +
      360
    ) % 360;

  const compass =
    document.getElementById(
      "compass"
    );

  if (compass) {
    compass.style.transform =
      `rotate(${rel}deg)`;
  }
}

/* ===================== APP INIT ===================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    applyTheme();

    const el =
      audioEl();

    if (el) {
      el.addEventListener(
        "ended",
        () => {
          if (
            state.playIndex >= 0
          ) {
            nextAyah();
          }
        }
      );

      el.addEventListener(
        "play",
        () => {
          state.isPlaying =
            true;

          const btn =
            document.getElementById(
              "playPauseBtn"
            );

          if (btn) {
            btn.textContent =
              "⏸";
          }
        }
      );

      el.addEventListener(
        "pause",
        () => {
          state.isPlaying =
            false;

          const btn =
            document.getElementById(
              "playPauseBtn"
            );

          if (btn) {
            btn.textContent =
              "▶";
          }
        }
      );

      el.addEventListener(
        "timeupdate",
        () => {
          if (el.duration) {
            const progress =
              document.getElementById(
                "audioProgress"
              );

            const cur =
              document.getElementById(
                "audioCur"
              );

            const dur =
              document.getElementById(
                "audioDur"
              );

            if (progress) {
              progress.value =
                (
                  el.currentTime /
                  el.duration
                ) * 100;
            }

            if (cur) {
              cur.textContent =
                fmtTime(
                  el.currentTime
                );
            }

            if (dur) {
              dur.textContent =
                fmtTime(
                  el.duration
                );
            }
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
          e => {
            if (el.duration) {
              el.currentTime =
                (
                  e.target.value /
                  100
                ) *
                el.duration;
            }
          }
        );
      }
    }

    analyticsEvent(
      "app_loaded"
    );
  }
);

/* ===================== SERVICE WORKER ===================== */

if (
  "serviceWorker" in navigator
) {
  window.addEventListener(
    "load",
    () => {
      navigator.serviceWorker
        .register("./sw.js")
        .catch(() => {});
    }
  );
}
