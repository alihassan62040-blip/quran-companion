"use strict";

/* ===============================
   QURAN COMPANION - SCRIPT.JS
   =============================== */

const QURAN_API = "https://api.alquran.cloud/v1";
const PRAYER_API = "https://api.aladhan.com/v1";

let surahs = [];
let currentSurah = 1;
let currentAyah = 1;
let currentAyahs = [];
let audioIndex = -1;

const audio = new Audio();

/* ===============================
   SCREEN
   =============================== */

function showScreen(screenId) {

  document.querySelectorAll(".screen").forEach(function(screen) {
    screen.classList.add("hidden");
  });

  const screen = document.getElementById(screenId);

  if (screen) {
    screen.classList.remove("hidden");
  }
}

/* ===============================
   START
   =============================== */

document.addEventListener("DOMContentLoaded", function() {

  loadSurahs();
  loadPrayerTimes();
  loadDuas();
  loadTasbeeh();

});

/* ===============================
   HOME
   =============================== */

function goHome() {
  stopAudio();
  showScreen("homeScreen");
}

/* ===============================
   QURAN
   =============================== */

function openQuran() {

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

    const response =
      await fetch(QURAN_API + "/surah");

    if (!response.ok) {
      throw new Error("Surah list failed");
    }

    const json =
      await response.json();

    surahs =
      json.data || [];

    renderSurahs(surahs);

  } catch (error) {

    console.error(error);

    list.innerHTML = `
      <div class="card">
        سورتیں لوڈ نہیں ہو سکیں۔
        <br><br>
        Internet چیک کریں۔
        <br><br>
        <button class="primary-btn"
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

  list.innerHTML = "";

  data.forEach(function(surah) {

    const button =
      document.createElement("button");

    button.className =
      "surah-card";

    button.type =
      "button";

    button.innerHTML = `
      <span class="surah-number">
        ${surah.number}
      </span>

      <span class="surah-name">
        <strong>
          ${escapeHTML(surah.name)}
        </strong>

        <small>
          ${escapeHTML(surah.englishName)}
          • ${surah.numberOfAyahs} آیات
        </small>
      </span>

      <span>←</span>
    `;

    button.addEventListener(
      "click",
      function() {
        openSurah(surah.number);
      }
    );

    list.appendChild(button);

  });
}

/* ===============================
   SEARCH
   =============================== */

function toggleSearch() {

  const box =
    document.getElementById("quranSearch");

  if (box) {
    box.classList.toggle("hidden");
  }
}

function filterSurahs() {

  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const value =
    input.value.trim().toLowerCase();

  if (!value) {
    renderSurahs(surahs);
    return;
  }

  const result =
    surahs.filter(function(surah) {

      return (
        surah.name.toLowerCase().includes(value) ||
        surah.englishName.toLowerCase().includes(value) ||
        String(surah.number).includes(value)
      );

    });

  renderSurahs(result);
}

/* ===============================
   OPEN SURAH
   =============================== */

async function openSurah(number, savedAyah = 1) {

  currentSurah =
    Number(number);

  currentAyah =
    Number(savedAyah || 1);

  showScreen("readerScreen");

  stopAudio();

  const title =
    document.getElementById("readerTitle");

  const container =
    document.getElementById("ayahContainer");

  if (!container) {
    console.error("ayahContainer not found");
    return;
  }

  const surah =
    surahs.find(function(s) {
      return Number(s.number) === currentSurah;
    });

  if (title) {

    title.textContent =
      "📖 " +
      (surah ? surah.name : "قرآن");

  }

  container.innerHTML = `
    <div class="loading">
      قرآن لوڈ ہو رہا ہے...
    </div>
  `;

  try {

    /* Arabic */

    const arabicResponse =
      await fetch(
        QURAN_API +
        "/surah/" +
        currentSurah +
        "/quran-uthmani"
      );

    if (!arabicResponse.ok) {
      throw new Error(
        "Arabic Quran request failed"
      );
    }

    const arabicJson =
      await arabicResponse.json();


    /* Urdu */

    const urduResponse =
      await fetch(
        QURAN_API +
        "/surah/" +
        currentSurah +
        "/ur.jalandhry"
      );

    if (!urduResponse.ok) {
      throw new Error(
        "Urdu translation request failed"
      );
    }

    const urduJson =
      await urduResponse.json();


    /* Audio */

    const audioResponse =
      await fetch(
        QURAN_API +
        "/surah/" +
        currentSurah +
        "/ar.alafasy"
      );

    if (!audioResponse.ok) {
      throw new Error(
        "Audio request failed"
      );
    }

    const audioJson =
      await audioResponse.json();


    const arabic =
      arabicJson.data.ayahs || [];

    const translation =
      urduJson.data.ayahs || [];

    const audioData =
      audioJson.data.ayahs || [];


    currentAyahs =
      arabic.map(function(ayah, index) {

        return {

          number:
            ayah.numberInSurah,

          arabic:
            ayah.text,

          translation:
            translation[index]
              ? translation[index].text
              : "",

          audio:
            audioData[index]
              ? audioData[index].audio
              : ""

        };

      });


    renderAyahs();

  } catch (error) {

    console.error(
      "OPEN SURAH ERROR:",
      error
    );

    container.innerHTML = `
      <div class="card">

        <h2>
          قرآن لوڈ نہیں ہو سکا
        </h2>

        <p>
          Internet connection چیک کریں۔
        </p>

        <button
          class="primary-btn"
          type="button"
          onclick="openSurah(${currentSurah})">

          دوبارہ کوشش کریں

        </button>

      </div>
    `;

  }
}

/* ===============================
   RENDER AYAT
   =============================== */

function renderAyahs() {

  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (!container) return;

  container.innerHTML = "";

  if (!currentAyahs.length) {

    container.innerHTML = `
      <div class="card">
        اس سورت کی آیات دستیاب نہیں ہیں۔
      </div>
    `;

    return;
  }


  currentAyahs.forEach(
    function(ayah, index) {

      const card =
        document.createElement("article");

      card.className =
        "ayah-card";

      card.id =
        "ayah-" +
        ayah.number;


      card.innerHTML = `

        <div class="ayah-top">

          <span class="ayah-number">
            ${ayah.number}
          </span>

          <div class="ayah-actions">

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


        <div class="arabic-text">
          ${escapeHTML(ayah.arabic)}
        </div>


        <div class="translation-box">

          <div class="translation-title">
            اردو ترجمہ
          </div>

          <div class="translation-text">
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
          class="tafseer-box hidden">

          ${escapeHTML(ayah.translation)}

        </div>
      `;


      container.appendChild(card);

    }
  );


  const saved =
    document.getElementById(
      "ayah-" + currentAyah
    );

  if (saved) {

    saved.classList.add(
      "saved-ayah"
    );

  }
}

/* ===============================
   AUDIO
   =============================== */

function playAyah(index) {

  const ayah =
    currentAyahs[index];

  if (!ayah) return;

  if (!ayah.audio) {

    showMessage(
      "اس آیت کی آڈیو دستیاب نہیں۔"
    );

    return;
  }


  audioIndex =
    index;

  audio.src =
    ayah.audio;

  audio.currentTime =
    0;


  audio.play()
    .then(function() {

      showAudioPlayer(ayah);

    })
    .catch(function(error) {

      console.error(error);

      showMessage(
        "Audio نہیں چل سکی۔ دوبارہ Play دبائیں۔"
      );

    });
}


function showAudioPlayer(ayah) {

  const player =
    document.getElementById(
      "audioPlayer"
    );

  if (!player) return;

  player.classList.remove(
    "hidden"
  );


  const title =
    document.getElementById(
      "audioTitle"
    );

  if (title) {

    title.textContent =
      "آیت " +
      ayah.number;

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

    audio.play();

  } else {

    audio.pause();

  }

  updateMainPlay();
}


function updateMainPlay() {

  const button =
    document.getElementById(
      "mainPlay"
    );

  if (!button) return;

  button.textContent =
    audio.paused
      ? "▶️"
      : "⏸️";
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
  function() {

    if (!audio.duration) return;

    const progress =
      (
        audio.currentTime /
        audio.duration
      ) * 100;


    const bar =
      document.getElementById(
        "audioProgress"
      );

    if (bar) {
      bar.value =
        progress;
    }


    const current =
      document.getElementById(
        "currentTime"
      );

    const total =
      document.getElementById(
        "totalTime"
      );

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
);


audio.addEventListener(
  "ended",
  function() {

    if (
      audioIndex >= 0 &&
      audioIndex <
      currentAyahs.length - 1
    ) {

      audioIndex++;

      const next =
        currentAyahs[
          audioIndex
        ];

      audio.src =
        next.audio;

      audio.currentTime =
        0;

      audio.play();

      showAudioPlayer(next);

    } else {

      updateMainPlay();

    }

  }
);


function seekAudio(value) {

  if (!audio.duration)
    return;

  audio.currentTime =
    Number(value) /
    100 *
    audio.duration;
}


function previousAudio() {

  if (audioIndex <= 0) {

    showMessage(
      "یہ پہلی آیت ہے۔"
    );

    return;
  }

  audioIndex--;

  const ayah =
    currentAyahs[
      audioIndex
    ];

  audio.src =
    ayah.audio;

  audio.currentTime =
    0;

  audio.play();

  showAudioPlayer(ayah);
}


function nextAudio() {

  if (
    audioIndex >=
    currentAyahs.length - 1
  ) {

    showMessage(
      "یہ آخری آیت ہے۔"
    );

    return;
  }

  audioIndex++;

  const ayah =
    currentAyahs[
      audioIndex
    ];

  audio.src =
    ayah.audio;

  audio.currentTime =
    0;

  audio.play();

  showAudioPlayer(ayah);
}


function stopAudio() {

  audio.pause();

  audio.currentTime =
    0;

  audio.src = "";

  audioIndex =
    -1;

  const player =
    document.getElementById(
      "audioPlayer"
    );

  if (player) {

    player.classList.add(
      "hidden"
    );

  }
}


/* ===============================
   DAILY AYAH
   =============================== */

async function playDailyAyah() {

  try {

    const response =
      await fetch(
        QURAN_API +
        "/ayah/94:5/ar.alafasy"
      );

    const json =
      await response.json();

    if (
      json.data &&
      json.data.audio
    ) {

      audio.src =
        json.data.audio;

      audio.currentTime =
        0;

      audio.play();

      showAudioPlayer({
        number: 5
      });

    }

  } catch (error) {

    console.error(error);

    showMessage(
      "آڈیو دستیاب نہیں۔"
    );

  }
}


/* ===============================
   CONTINUE READING
   =============================== */

function saveAyah(number) {

  localStorage.setItem(
    "quranLastRead",
    JSON.stringify({
      surah:
        currentSurah,
      ayah:
        number
    })
  );

  showMessage(
    "🔖 آیت محفوظ ہوگئی"
  );
}


function continueReading() {

  const saved =
    localStorage.getItem(
      "quranLastRead"
    );

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
      data.surah,
      data.ayah
    );

  } catch {

    openQuran();

  }
}


/* ===============================
   TAFSEER
   =============================== */

function toggleTafseer(index) {

  const box =
    document.getElementById(
      "tafseer-" + index
    );

  if (box) {

    box.classList.toggle(
      "hidden"
    );

  }
}


/* ===============================
   PRAYER
   =============================== */

async function loadPrayerTimes() {

  const box =
    document.getElementById(
      "prayerTimes"
    );

  const home =
    document.getElementById(
      "homePrayerTimes"
    );


  if (box) {
    box.innerHTML =
      "اوقات لوڈ ہو رہے ہیں...";
  }

  if (home) {
    home.innerHTML =
      "اوقات لوڈ ہو رہے ہیں...";
  }


  const now =
    new Date();

  const date =
    String(now.getDate())
      .padStart(2, "0") +
    "-" +
    String(now.getMonth() + 1)
      .padStart(2, "0") +
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

    const timings =
      json.data.timings;


    const prayers = [
      ["فجر", "Fajr"],
      ["طلوع آفتاب", "Sunrise"],
      ["ظہر", "Dhuhr"],
      ["عصر", "Asr"],
      ["مغرب", "Maghrib"],
      ["عشاء", "Isha"]
    ];


    let html = "";


    prayers.forEach(
      function(item) {

        html += `
          <div class="prayer-row">

            <span>
              ${item[0]}
            </span>

            <strong>
              ${timings[item[1]]}
            </strong>

          </div>
        `;

      }
    );


    if (box) {
      box.innerHTML =
        html;
    }


    if (home) {

      home.innerHTML =
        prayers
          .slice(0, 3)
          .map(function(item) {

            return (
              item[0] +
              " " +
              timings[item[1]]
            );

          })
          .join(" • ");

    }

  } catch (error) {

    console.error(error);

    if (box) {

      box.innerHTML =
        "نماز کے اوقات لوڈ نہیں ہو سکے۔";

    }

    if (home) {

      home.innerHTML =
        "اوقات دستیاب نہیں۔";

    }

  }
}


/* ===============================
   DUAS
   =============================== */

const duas = [

  {
    title: "علم کی دعا",
    arabic:
      "رَبِّ زِدْنِي عِلْمًا",
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
    title: "دنیا و آخرت کی بھلائی",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    translation:
      "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
  },

  {
    title: "سفر کی دعا",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
    translation:
      "پاک ہے وہ ذات جس نے اس سواری کو ہمارے لیے مسخر کیا۔"
  }

];


function loadDuas() {

  const list =
    document.getElementById(
      "duasList"
    );

  if (!list) return;


  list.innerHTML =
    duas.map(function(dua) {

      return `
        <div class="dua-card">

          <h3>
            ${dua.title}
          </h3>

          <div class="dua-arabic">
            ${dua.arabic}
          </div>

          <div class="dua-translation">
            ${dua.translation}
          </div>

        </div>
      `;

    }).join("");
}


/* ===============================
   TASBEEH
   =============================== */

let tasbeeh =
  Number(
    localStorage.getItem(
      "tasbeeh"
    ) || 0
  );


function loadTasbeeh() {

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
    tasbeeh
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


/* ===============================
   QIBLA
   =============================== */

function calculateQibla() {

  if (!navigator.geolocation) {

    showMessage(
      "Location دستیاب نہیں۔"
    );

    return;
  }


  navigator.geolocation.getCurrentPosition(
    function(position) {

      const lat =
        position.coords.latitude;

      const lon =
        position.coords.longitude;


      const bearing =
        calculateBearing(
          lat,
          lon,
          21.4225,
          39.8262
        );


      const text =
        document.getElementById(
          "qiblaDegrees"
        );

      const compass =
        document.getElementById(
          "qiblaCompass"
        );


      if (text) {

        text.textContent =
          "قبلہ: " +
          Math.round(bearing) +
          "°";

      }


      if (compass) {

        compass.style.transform =
          "rotate(" +
          bearing +
          "deg)";

      }

    },

    function() {

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

  const phi1 =
    lat1 * rad;

  const phi2 =
    lat2 * rad;

  const delta =
    (lon2 - lon1) * rad;


  const y =
    Math.sin(delta) *
    Math.cos(phi2);

  const x =
    Math.cos(phi1) *
      Math.sin(phi2) -
    Math.sin(phi1) *
      Math.cos(phi2) *
      Math.cos(delta);


  return (
    Math.atan2(y, x) /
      rad +
    360
  ) % 360;
}


/* ===============================
   BACK
   =============================== */

function backToSurahs() {

  stopAudio();

  openQuran();
}


/* ===============================
   SETTINGS
   =============================== */

function toggleReaderSettings() {

  const box =
    document.getElementById(
      "readerSettings"
    );

  if (box) {

    box.classList.toggle(
      "hidden"
    );

  }
}


function changeArabicSize(value) {

  document
    .querySelectorAll(
      ".arabic-text"
    )
    .forEach(function(el) {

      el.style.fontSize =
        value + "px";

    });
}


function changeTranslation(value) {

  openSurah(
    currentSurah,
    currentAyah
  );
}


/* ===============================
   HELPERS
   =============================== */

function formatTime(seconds) {

  if (!isFinite(seconds)) {
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

  return (
    minutes +
    ":" +
    secs
  );
}


function escapeHTML(value) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


function showMessage(text) {

  const old =
    document.querySelector(
      ".message"
    );

  if (old) {
    old.remove();
  }


  const message =
    document.createElement(
      "div"
    );

  message.className =
    "message";

  message.textContent =
    text;

  document.body.appendChild(
    message
  );


  setTimeout(
    function() {

      message.remove();

    },
    3000
  );
}
