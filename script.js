"use strict";

const API = "https://api.alquran.cloud/v1";
const PRAYER_API = "https://api.aladhan.com/v1";

let surahs = [];
let currentSurah = 1;
let currentAyah = 1;
let currentAyahs = [];
let audioIndex = -1;
let translation = "ur.jalandhry";

const audio = new Audio();

document.addEventListener("DOMContentLoaded", function () {
  loadSurahs();
  loadDuas();
  loadTasbeeh();
});

/* SCREEN */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function (x) {
    x.classList.add("hidden");
  });

  const screen = document.getElementById(id);

  if (screen) {
    screen.classList.remove("hidden");
    window.scrollTo(0, 0);
  }
}

function goHome() {
  stopAudio();
  showScreen("homeScreen");
}

/* QURAN */

function openQuran() {
  stopAudio();
  showScreen("quranScreen");

  if (!surahs.length) {
    loadSurahs();
  }
}

async function loadSurahs() {

  const list = document.getElementById("surahList");

  if (!list) return;

  list.innerHTML =
    '<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>';

  try {

    const response = await fetch(API + "/surah");

    if (!response.ok) {
      throw new Error("Surah API failed");
    }

    const json = await response.json();

    surahs = json.data || [];

    renderSurahs(surahs);

  } catch (error) {

    console.error(error);

    list.innerHTML = `
      <div class="card">
        سورتیں لوڈ نہیں ہو سکیں۔
        <br><br>
        Internet چیک کریں۔
        <br><br>
        <button class="primary" onclick="loadSurahs()">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;
  }
}

function renderSurahs(data) {

  const list = document.getElementById("surahList");

  if (!list) return;

  list.innerHTML = "";

  data.forEach(function (surah) {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "surah-card";

    button.innerHTML = `
      <span class="surah-number">
        ${surah.number}
      </span>

      <span class="surah-name">
        <strong>${escapeHTML(surah.name)}</strong>
        <small>
          ${escapeHTML(surah.englishName)}
          • ${surah.numberOfAyahs} آیات
        </small>
      </span>

      <span>←</span>
    `;

    button.addEventListener("click", function () {
      openSurah(surah.number);
    });

    list.appendChild(button);
  });
}

function toggleSearch() {
  const box = document.getElementById("quranSearch");

  if (box) {
    box.classList.toggle("hidden");
  }
}

function filterSurahs() {

  const input = document.getElementById("surahSearch");

  if (!input) return;

  const value = input.value.trim().toLowerCase();

  if (!value) {
    renderSurahs(surahs);
    return;
  }

  const result = surahs.filter(function (s) {

    return (
      String(s.number).includes(value) ||
      String(s.name).toLowerCase().includes(value) ||
      String(s.englishName).toLowerCase().includes(value)
    );

  });

  renderSurahs(result);
}

/* OPEN SURAH */

async function openSurah(number, savedAyah = 1) {

  currentSurah = Number(number);
  currentAyah = Number(savedAyah || 1);

  showScreen("readerScreen");
  stopAudio();

  const title = document.getElementById("readerTitle");
  const container = document.getElementById("ayahContainer");

  if (!container) return;

  const surah = surahs.find(function (s) {
    return Number(s.number) === currentSurah;
  });

  if (title) {
    title.textContent =
      "📖 " + (surah ? surah.name : "قرآن");
  }

  container.innerHTML =
    '<div class="loading">قرآن، ترجمہ اور آیات لوڈ ہو رہی ہیں...</div>';

  try {

    /*
      ایک ہی request میں Arabic + translation
      اور الگ request میں audio
    */

    const editions =
      "quran-uthmani," +
      translation +
      ",ar.alafasy";

    const response = await fetch(
      API +
      "/surah/" +
      currentSurah +
      "/editions/" +
      editions
    );

    if (!response.ok) {
      throw new Error("Quran request failed");
    }

    const json = await response.json();

    const data = json.data || [];

    const arabicData =
      data.find(function (x) {
        return x.edition &&
          x.edition.identifier === "quran-uthmani";
      });

    const translationData =
      data.find(function (x) {
        return x.edition &&
          x.edition.identifier === translation;
      });

    const audioData =
      data.find(function (x) {
        return x.edition &&
          x.edition.identifier === "ar.alafasy";
      });

    const arabic =
      arabicData ? arabicData.ayahs : [];

    const trans =
      translationData ? translationData.ayahs : [];

    const audios =
      audioData ? audioData.ayahs : [];

    if (!arabic.length) {
      throw new Error("Arabic ayahs missing");
    }

    currentAyahs = arabic.map(function (ayah, i) {

      return {
        number: ayah.numberInSurah,
        arabic: ayah.text,
        translation:
          trans[i] ? trans[i].text : "",
        audio:
          audios[i] ? audios[i].audio : ""
      };

    });

    renderAyahs();

  } catch (error) {

    console.error(error);

    /*
      Fallback:
      اگر combined endpoint کسی وجہ سے fail ہو
      تو تین الگ requests چلیں گی۔
    */

    try {

      const [a, t, au] = await Promise.all([

        fetch(
          API +
          "/surah/" +
          currentSurah +
          "/quran-uthmani"
        ).then(function (r) {
          if (!r.ok) throw new Error("Arabic failed");
          return r.json();
        }),

        fetch(
          API +
          "/surah/" +
          currentSurah +
          "/" +
          translation
        ).then(function (r) {
          if (!r.ok) throw new Error("Translation failed");
          return r.json();
        }),

        fetch(
          API +
          "/surah/" +
          currentSurah +
          "/ar.alafasy"
        ).then(function (r) {
          if (!r.ok) throw new Error("Audio failed");
          return r.json();
        })

      ]);

      const arabic = a.data.ayahs || [];
      const trans = t.data.ayahs || [];
      const audios = au.data.ayahs || [];

      currentAyahs = arabic.map(function (ayah, i) {

        return {
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation:
            trans[i] ? trans[i].text : "",
          audio:
            audios[i] ? audios[i].audio : ""
        };

      });

      renderAyahs();

    } catch (finalError) {

      console.error(finalError);

      container.innerHTML = `
        <div class="card">
          <h3>قرآن لوڈ نہیں ہو سکا</h3>
          <p>
            Internet connection چیک کریں اور دوبارہ کوشش کریں۔
          </p>
          <button
            class="primary"
            onclick="openSurah(${currentSurah},${currentAyah})">
            دوبارہ کوشش کریں
          </button>
        </div>
      `;
    }
  }
}

/* AYAH RENDER */

function renderAyahs() {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML = "";

  currentAyahs.forEach(function (ayah, index) {

    const card =
      document.createElement("article");

    card.className = "ayah-card";
    card.id = "ayah-" + ayah.number;

    card.innerHTML = `

      <div class="ayah-top">

        <span class="ayah-number">
          ${ayah.number}
        </span>

        <div class="actions">

          <button
            type="button"
            onclick="playAyah(${index})">
            ▶️
          </button>

          <button
            type="button"
            onclick="saveAyah(${ayah.number})">
            🔖
          </button>

        </div>

      </div>

      <div class="arabic">
        ${escapeHTML(ayah.arabic)}
      </div>

      <div class="translation">

        <div class="translation-title">
          ${translation === "en.sahih"
            ? "English Translation"
            : "اردو ترجمہ"}
        </div>

        <div>
          ${escapeHTML(ayah.translation)}
        </div>

      </div>

      <button
        class="tafseer-btn"
        type="button"
        onclick="toggleTafseer(${index})">
        📚 تفسیر دیکھیں
      </button>

      <div
        id="tafseer-${index}"
        class="tafseer hidden">

        <strong>تفسیر</strong>

        <p>
          قرآن کی آیت کے مفہوم کو بہتر سمجھنے کے لیے
          مستند تفسیری ماخذ سے رجوع کریں۔
          یہ حصہ بعد میں منتخب مستند Tafseer API سے
          مکمل کیا جا سکتا ہے۔
        </p>

      </div>
    `;

    container.appendChild(card);
  });

  highlightCurrentAyah();
}

/* TRANSLATION */

async function changeTranslation(value) {

  translation =
    value || "ur.jalandhry";

  if (!currentSurah) return;

  await openSurah(
    currentSurah,
    currentAyah
  );
}

/* SETTINGS */

function toggleSettings() {

  const box =
    document.getElementById("readerSettings");

  if (box) {
    box.classList.toggle("hidden");
  }
}

function changeArabicSize(value) {

  document
    .querySelectorAll(".arabic")
    .forEach(function (el) {

      el.style.fontSize =
        Number(value) + "px";

    });
}

/* TAFSEER */

function toggleTafseer(index) {

  const box =
    document.getElementById(
      "tafseer-" + index
    );

  if (box) {
    box.classList.toggle("hidden");
  }
}

/* AUDIO */

function playAyah(index) {

  const ayah =
    currentAyahs[index];

  if (!ayah || !ayah.audio) {

    showMessage(
      "اس آیت کی آڈیو دستیاب نہیں۔"
    );

    return;
  }

  audioIndex = index;
  currentAyah = ayah.number;

  saveAyah(ayah.number);

  document
    .querySelectorAll(".ayah-card")
    .forEach(function (el) {
      el.classList.remove("playing");
    });

  const card =
    document.getElementById(
      "ayah-" + ayah.number
    );

  if (card) {
    card.classList.add("playing");
  }

  audio.src = ayah.audio;
  audio.currentTime = 0;

  audio.play()
    .then(function () {

      showAudioPlayer(ayah);
      updateMainPlay();

    })
    .catch(function (error) {

      console.error(error);

      showMessage(
        "Play دبانے کے بعد آڈیو نہیں چل سکی۔"
      );
    });
}

function showAudioPlayer(ayah) {

  const player =
    document.getElementById("audioPlayer");

  const title =
    document.getElementById("audioTitle");

  if (player) {
    player.classList.remove("hidden");
  }

  if (title) {
    title.textContent =
      "آیت " + ayah.number;
  }

  updateMainPlay();
}

function toggleMainAudio() {

  if (!audio.src) {

    if (currentAyahs.length) {
      playAyah(0);
    }

    return;
  }

  if (audio.paused) {

    audio.play()
      .then(updateMainPlay)
      .catch(function () {
        showMessage("آڈیو دوبارہ نہیں چل سکی۔");
      });

  } else {

    audio.pause();
  }
}

function updateMainPlay() {

  const button =
    document.getElementById("mainPlay");

  if (!button) return;

  button.textContent =
    audio.paused ? "▶️" : "⏸️";
}

function previousAudio() {

  if (audioIndex <= 0) {

    showMessage("یہ پہلی آیت ہے۔");
    return;
  }

  playAyah(audioIndex - 1);
}

function nextAudio() {

  if (
    audioIndex < 0 ||
    audioIndex >= currentAyahs.length - 1
  ) {

    showMessage("یہ آخری آیت ہے۔");
    return;
  }

  playAyah(audioIndex + 1);
}

function seekAudio(value) {

  if (!audio.duration) return;

  audio.currentTime =
    Number(value) / 100 *
    audio.duration;
}

function stopAudio() {

  audio.pause();

  audio.currentTime = 0;
  audio.src = "";
  audioIndex = -1;

  document
    .querySelectorAll(".ayah-card")
    .forEach(function (el) {
      el.classList.remove("playing");
    });

  const player =
    document.getElementById("audioPlayer");

  if (player) {
    player.classList.add("hidden");
  }

  updateMainPlay();
}

audio.addEventListener(
  "play",
  updateMainPlay
);

audio.addEventListener(
  "pause",
  updateMainPlay
);

audio.addEventListener(
  "timeupdate",
  function () {

    if (!audio.duration) return;

    const progress =
      audio.currentTime /
      audio.duration *
      100;

    const bar =
      document.getElementById("audioProgress");

    if (bar) {
      bar.value = progress;
    }

    const current =
      document.getElementById("currentTime");

    const total =
      document.getElementById("totalTime");

    if (current) {
      current.textContent =
        formatTime(audio.currentTime);
    }

    if (total) {
      total.textContent =
        formatTime(audio.duration);
    }
  }
);

audio.addEventListener(
  "ended",
  function () {

    if (
      audioIndex >= 0 &&
      audioIndex < currentAyahs.length - 1
    ) {

      playAyah(audioIndex + 1);

    } else {

      updateMainPlay();
    }
  }
);

/* BOOKMARK */

function saveAyah(number) {

  currentAyah =
    Number(number);

  localStorage.setItem(
    "quranLastRead",
    JSON.stringify({
      surah: currentSurah,
      ayah: currentAyah
    })
  );
}

function continueReading() {

  const saved =
    localStorage.getItem("quranLastRead");

  if (!saved) {

    openQuran();

    showMessage(
      "ابھی کوئی آیت محفوظ نہیں۔"
    );

    return;
  }

  try {

    const data =
      JSON.parse(saved);

    openSurah(
      Number(data.surah),
      Number(data.ayah)
    );

  } catch (error) {

    console.error(error);
    openQuran();
  }
}

function highlightCurrentAyah() {

  document
    .querySelectorAll(".ayah-card")
    .forEach(function (el) {
      el.classList.remove("playing");
    });

  const card =
    document.getElementById(
      "ayah-" + currentAyah
    );

  if (card) {

    card.classList.add("playing");

    setTimeout(function () {

      card.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }, 150);
  }
}

function backToSurahs() {

  stopAudio();
  openQuran();
}

/* PRAYER */

function openPrayer() {

  showScreen("prayerScreen");
  loadPrayerTimes();
}

async function loadPrayerTimes() {

  const box =
    document.getElementById("prayerTimes");

  if (!box) return;

  box.textContent =
    "اوقات لوڈ ہو رہے ہیں...";

  const now = new Date();

  const date =
    String(now.getDate()).padStart(2, "0") +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    now.getFullYear();

  try {

    const response =
      await fetch(
        PRAYER_API +
        "/timingsByCity/" +
        date +
        "?city=Karachi&country=Pakistan&method=1&school=1"
      );

    const json =
      await response.json();

    const t =
      json.data.timings;

    const prayers = [
      ["فجر", "Fajr"],
      ["طلوع آفتاب", "Sunrise"],
      ["ظہر", "Dhuhr"],
      ["عصر", "Asr"],
      ["مغرب", "Maghrib"],
      ["عشاء", "Isha"]
    ];

    box.innerHTML =
      prayers.map(function (p) {

        return `
          <div style="
            display:flex;
            justify-content:space-between;
            padding:10px 0;
            border-bottom:1px solid #1d3b31;
          ">
            <span>${p[0]}</span>
            <strong>${t[p[1]]}</strong>
          </div>
        `;

      }).join("");

  } catch (error) {

    console.error(error);

    box.textContent =
      "نماز کے اوقات لوڈ نہیں ہو سکے۔";
  }
}

/* DUAS */

const duas = [
  {
    title: "علم کی دعا",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation:
      "اے میرے رب! میرے علم میں اضافہ فرما۔"
  },
  {
    title: "والدین کے لیے دعا",
    arabic:
      "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation:
      "اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں میری پرورش کی۔"
  },
  {
    title: "دنیا و آخرت",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    translation:
      "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
  }
];

function openDuas() {

  showScreen("duasScreen");
  loadDuas();
}

function loadDuas() {

  const list =
    document.getElementById("duasList");

  if (!list) return;

  list.innerHTML =
    duas.map(function (dua) {

      return `
        <div class="dua">
          <h3>${escapeHTML(dua.title)}</h3>
          <div class="dua-arabic">
            ${escapeHTML(dua.arabic)}
          </div>
          <div>
            ${escapeHTML(dua.translation)}
          </div>
        </div>
      `;

    }).join("");
}

/* TASBEEH */

let tasbeeh =
  Number(
    localStorage.getItem("tasbeeh") || 0
  );

function openTasbeeh() {

  showScreen("tasbeehScreen");
  loadTasbeeh();
}

function loadTasbeeh() {

  const count =
    document.getElementById("tasbeehCount");

  if (count) {
    count.textContent = tasbeeh;
  }
}

function countTasbeeh() {

  tasbeeh++;

  localStorage.setItem(
    "tasbeeh",
    String(tasbeeh)
  );

  loadTasbeeh();
}

function resetTasbeeh() {

  tasbeeh = 0;

  localStorage.setItem(
    "tasbeeh",
    "0"
  );

  loadTasbeeh();
}

/* QIBLA */

function openQibla() {

  showScreen("qiblaScreen");
  calculateQibla();
}

function calculateQibla() {

  if (!navigator.geolocation) {

    showMessage(
      "آپ کے browser میں Location موجود نہیں۔"
    );

    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {

      const bearing =
        calculateBearing(
          position.coords.latitude,
          position.coords.longitude,
          21.4225,
          39.8262
        );

      const output =
        document.getElementById("qiblaDegrees");

      if (output) {

        output.textContent =
          "قبلہ: " +
          Math.round(bearing) +
          "°";
      }

    },
    function () {

      showMessage(
        "Location کی اجازت دیں۔"
      );
    }
  );
}

function calculateBearing(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const rad =
    Math.PI / 180;

  const p1 =
    lat1 * rad;

  const p2 =
    lat2 * rad;

  const delta =
    (lon2 - lon1) * rad;

  const y =
    Math.sin(delta) *
    Math.cos(p2);

  const x =
    Math.cos(p1) *
      Math.sin(p2) -
    Math.sin(p1) *
      Math.cos(p2) *
      Math.cos(delta);

  return (
    Math.atan2(y, x) / rad +
    360
  ) % 360;
}

/* HELPERS */

function formatTime(seconds) {

  if (!isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return minutes + ":" + secs;
}

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showMessage(text) {

  const old =
    document.querySelector(".message");

  if (old) {
    old.remove();
  }

  const message =
    document.createElement("div");

  message.className = "message";
  message.textContent = text;

  document.body.appendChild(message);

  setTimeout(function () {

    message.remove();

  }, 3000);
}
