"use strict";

/* =====================================================
   QURAN COMPANION
   COMPLETE SCRIPT
   Arabic + Urdu + Tafseer + Audio + Auto Next
===================================================== */

console.log("Quran Companion started");

/* =====================================================
   SUPABASE QURAN FUNCTION
===================================================== */

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";

/* =====================================================
   SURAH DATA
===================================================== */

const surahs = [
  [1,"الفاتحة","Al-Fatihah",7],
  [2,"البقرة","Al-Baqarah",286],
  [3,"آل عمران","Aal-Imran",200],
  [4,"النساء","An-Nisa",176],
  [5,"المائدة","Al-Maidah",120],
  [6,"الأنعام","Al-Anam",165],
  [7,"الأعراف","Al-Araf",206],
  [8,"الأنفال","Al-Anfal",75],
  [9,"التوبة","At-Tawbah",129],
  [10,"يونس","Yunus",109],
  [11,"هود","Hud",123],
  [12,"يوسف","Yusuf",111],
  [13,"الرعد","Ar-Rad",43],
  [14,"إبراهيم","Ibrahim",52],
  [15,"الحجر","Al-Hijr",99],
  [16,"النحل","An-Nahl",128],
  [17,"الإسراء","Al-Isra",111],
  [18,"الكهف","Al-Kahf",110],
  [19,"مريم","Maryam",98],
  [20,"طه","Ta-Ha",135],
  [21,"الأنبياء","Al-Anbiya",112],
  [22,"الحج","Al-Hajj",78],
  [23,"المؤمنون","Al-Muminun",118],
  [24,"النور","An-Nur",64],
  [25,"الفرقان","Al-Furqan",77],
  [26,"الشعراء","Ash-Shuara",227],
  [27,"النمل","An-Naml",93],
  [28,"القصص","Al-Qasas",88],
  [29,"العنكبوت","Al-Ankabut",69],
  [30,"الروم","Ar-Rum",60],
  [31,"لقمان","Luqman",34],
  [32,"السجدة","As-Sajdah",30],
  [33,"الأحزاب","Al-Ahzab",73],
  [34,"سبأ","Saba",54],
  [35,"فاطر","Fatir",45],
  [36,"يس","Ya-Sin",83],
  [37,"الصافات","As-Saffat",182],
  [38,"ص","Sad",88],
  [39,"الزمر","Az-Zumar",75],
  [40,"غافر","Ghafir",85],
  [41,"فصلت","Fussilat",54],
  [42,"الشورى","Ash-Shura",53],
  [43,"الزخرف","Az-Zukhruf",89],
  [44,"الدخان","Ad-Dukhan",59],
  [45,"الجاثية","Al-Jathiyah",37],
  [46,"الأحقاف","Al-Ahqaf",35],
  [47,"محمد","Muhammad",38],
  [48,"الفتح","Al-Fath",29],
  [49,"الحجرات","Al-Hujurat",18],
  [50,"ق","Qaf",45],
  [51,"الذاريات","Adh-Dhariyat",60],
  [52,"الطور","At-Tur",49],
  [53,"النجم","An-Najm",62],
  [54,"القمر","Al-Qamar",55],
  [55,"الرحمن","Ar-Rahman",78],
  [56,"الواقعة","Al-Waqiah",96],
  [57,"الحديد","Al-Hadid",29],
  [58,"المجادلة","Al-Mujadilah",22],
  [59,"الحشر","Al-Hashr",24],
  [60,"الممتحنة","Al-Mumtahanah",13],
  [61,"الصف","As-Saff",14],
  [62,"الجمعة","Al-Jumuah",11],
  [63,"المنافقون","Al-Munafiqun",11],
  [64,"التغابن","At-Taghabun",18],
  [65,"الطلاق","At-Talaq",12],
  [66,"التحريم","At-Tahrim",12],
  [67,"الملك","Al-Mulk",30],
  [68,"القلم","Al-Qalam",52],
  [69,"الحاقة","Al-Haqqah",52],
  [70,"المعارج","Al-Maarij",44],
  [71,"نوح","Nuh",28],
  [72,"الجن","Al-Jinn",28],
  [73,"المزمل","Al-Muzzammil",20],
  [74,"المدثر","Al-Muddaththir",56],
  [75,"القيامة","Al-Qiyamah",40],
  [76,"الإنسان","Al-Insan",31],
  [77,"المرسلات","Al-Mursalat",50],
  [78,"النبأ","An-Naba",40],
  [79,"النازعات","An-Naziat",46],
  [80,"عبس","Abasa",42],
  [81,"التكوير","At-Takwir",29],
  [82,"الانفطار","Al-Infitar",19],
  [83,"المطففين","Al-Mutaffifin",36],
  [84,"الانشقاق","Al-Inshiqaq",25],
  [85,"البروج","Al-Buruj",22],
  [86,"الطارق","At-Tariq",17],
  [87,"الأعلى","Al-Ala",19],
  [88,"الغاشية","Al-Ghashiyah",26],
  [89,"الفجر","Al-Fajr",30],
  [90,"البلد","Al-Balad",20],
  [91,"الشمس","Ash-Shams",15],
  [92,"الليل","Al-Layl",21],
  [93,"الضحى","Ad-Duha",11],
  [94,"الشرح","Ash-Sharh",8],
  [95,"التين","At-Tin",8],
  [96,"العلق","Al-Alaq",19],
  [97,"القدر","Al-Qadr",5],
  [98,"البينة","Al-Bayyinah",8],
  [99,"الزلزلة","Az-Zalzalah",8],
  [100,"العاديات","Al-Adiyat",11],
  [101,"القارعة","Al-Qariah",11],
  [102,"التكاثر","At-Takathur",8],
  [103,"العصر","Al-Asr",3],
  [104,"الهمزة","Al-Humazah",9],
  [105,"الفيل","Al-Fil",5],
  [106,"قريش","Quraysh",4],
  [107,"الماعون","Al-Maun",7],
  [108,"الكوثر","Al-Kawthar",3],
  [109,"الكافرون","Al-Kafirun",6],
  [110,"النصر","An-Nasr",3],
  [111,"المسد","Al-Masad",5],
  [112,"الإخلاص","Al-Ikhlas",4],
  [113,"الفلق","Al-Falaq",5],
  [114,"الناس","An-Nas",6]
];

/* =====================================================
   STATE
===================================================== */

let currentSurah = 1;
let currentAyahIndex = 0;
let currentVerses = [];

let currentAudio = null;
let audioList = [];

let tafseerOpen = {};

let selectedTranslation = "ur.jalandhry";

/* =====================================================
   BASIC SCREEN CONTROL
===================================================== */

function hideAllScreens() {

  document
    .querySelectorAll(
      "#homeScreen, .app-screen, main > section"
    )
    .forEach(function(screen) {

      screen.classList.add("hidden");

    });

}

function openScreen(id) {

  hideAllScreens();

  const screen =
    document.getElementById(id);

  if (screen) {
    screen.classList.remove("hidden");
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

function setHeader(text) {

  const title =
    document.getElementById("headerTitle");

  if (title) {
    title.textContent = text;
  }

}

/* =====================================================
   QURAN
===================================================== */

function openQuran() {

  stopAudio();

  openScreen("quranScreen");

  setHeader("قرآن");

  renderSurahs();

}

function renderSurahs(list) {

  const container =
    document.getElementById("surahList");

  if (!container) return;

  const data =
    Array.isArray(list)
      ? list
      : surahs;

  container.innerHTML = "";

  data.forEach(function(surah) {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "surah-card";

    button.innerHTML = `

      <span class="surah-number">
        ${surah[0]}
      </span>

      <span class="surah-name">

        <strong>
          ${escapeHTML(surah[1])}
        </strong>

        <small>
          ${escapeHTML(surah[2])}
          — ${surah[3]} آیات
        </small>

      </span>

    `;

    button.onclick =
      function() {
        openSurah(surah[0]);
      };

    container.appendChild(button);

  });

}

function filterSurahs() {

  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const search =
    input.value
      .trim()
      .toLowerCase();

  const result =
    surahs.filter(function(surah) {

      return (
        surah[1].includes(search) ||
        surah[2]
          .toLowerCase()
          .includes(search) ||
        String(surah[0])
          .includes(search)
      );

    });

  renderSurahs(result);

}

/* =====================================================
   OPEN SURAH
===================================================== */

async function openSurah(number) {

  currentSurah = Number(number);

  currentAyahIndex = 0;

  currentVerses = [];

  stopAudio();

  openScreen("readerScreen");

  const surah =
    surahs.find(function(item) {
      return item[0] === currentSurah;
    });

  setHeader(
    surah
      ? "📖 " + surah[1]
      : "قرآن"
  );

  const title =
    document.getElementById("readerTitle");

  if (title && surah) {
    title.textContent =
      "📖 " + surah[1];
  }

  const container =
    document.getElementById("ayahContainer");

  if (container) {

    container.innerHTML = `
      <div class="loading">
        قرآن لوڈ ہو رہا ہے...
      </div>
    `;

  }

  try {

    const response =
      await fetch(
        QURAN_FUNCTION_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            surah: currentSurah
          })
        }
      );

    const result =
      await response.json();

    if (!response.ok) {

      throw new Error(
        result.error ||
        "Server error: " +
        response.status
      );

    }

    if (!result.success) {

      throw new Error(
        result.error ||
        "Quran data unavailable"
      );

    }

    currentVerses =
      Array.isArray(result.verses)
        ? result.verses
        : [];

    if (
      currentVerses.length === 0
    ) {

      throw new Error(
        "اس سورت کی آیات نہیں ملیں۔"
      );

    }

    renderAyahs(result);

  } catch (error) {

    console.error(
      "Quran loading error:",
      error
    );

    if (container) {

      container.innerHTML = `

        <div class="card">

          <h2>⚠️ قرآن لوڈ نہیں ہو سکا</h2>

          <p>
            ${escapeHTML(error.message)}
          </p>

          <button
            class="primary"
            type="button"
            onclick="openSurah(${currentSurah})"
          >
            دوبارہ کوشش کریں
          </button>

        </div>

      `;

    }

  }

}

/* =====================================================
   RENDER AYAT
===================================================== */

function renderAyahs(result) {

  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (!container) return;

  container.innerHTML = "";

  const verses =
    result.verses || [];

  verses.forEach(
    function(ayah, index) {

      const card =
        document.createElement("article");

      card.className =
        "ayah-card";

      card.id =
        "ayah-" + index;

      const tafseerText =
        ayah.tafseer ||
        ayah.tafseerText ||
        "";

      const translation =
        ayah.urdu ||
        ayah.translation ||
        "";

      const audio =
        ayah.audio ||
        ayah.audioUrl ||
        "";

      card.innerHTML = `

        <div class="ayah-top">

          <span class="ayah-number">
            ${ayah.number || index + 1}
          </span>

          <div class="actions">

            <button
              type="button"
              onclick="playAyah(${index})"
              title="آیت سنیں"
            >
              🔊
            </button>

          </div>

        </div>

        <div class="arabic">
          ${escapeHTML(
            ayah.arabic || ""
          )}
        </div>

        <div class="translation">

          <div class="translation-title">
            اردو ترجمہ
          </div>

          <div>
            ${escapeHTML(
              translation
            )}
          </div>

        </div>

        <button
          class="tafseer-btn"
          type="button"
          onclick="toggleTafseer(${index})"
        >
          📚 تفسیر دکھائیں
        </button>

        <div
          id="tafseer-${index}"
          class="tafseer hidden"
        >

          ${
            tafseerText
              ? escapeHTML(
                  tafseerText
                )
              : "اس آیت کی تفسیر ابھی دستیاب نہیں۔"
          }

          ${
            ayah.tafseerSource
              ? `
                <hr>
                <small>
                  ماخذ:
                  ${escapeHTML(
                    ayah.tafseerSource
                  )}
                </small>
              `
              : ""
          }

        </div>

      `;

      container.appendChild(card);

    }
  );

  audioList =
    verses.map(function(ayah) {

      return (
        ayah.audio ||
        ayah.audioUrl ||
        ""
      );

    });

}

/* =====================================================
   TAFSEER
===================================================== */

function toggleTafseer(index) {

  const box =
    document.getElementById(
      "tafseer-" + index
    );

  if (!box) return;

  box.classList.toggle("hidden");

}

/* =====================================================
   AUDIO
===================================================== */

function playAyah(index) {

  if (
    index < 0 ||
    index >= currentVerses.length
  ) {
    return;
  }

  currentAyahIndex = index;

  const ayah =
    currentVerses[index];

  const url =
    ayah.audio ||
    ayah.audioUrl ||
    "";

  if (!url) {

    showMessage(
      "اس آیت کی آواز دستیاب نہیں۔"
    );

    return;

  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  currentAudio =
    new Audio(url);

  currentAudio.preload = "auto";

  showAudioPlayer(ayah);

  highlightAyah(index);

  currentAudio.addEventListener(
    "loadedmetadata",
    updateAudioInfo
  );

  currentAudio.addEventListener(
    "timeupdate",
    updateAudioProgress
  );

  currentAudio.addEventListener(
    "ended",
    function() {

      if (
        currentAyahIndex <
        currentVerses.length - 1
      ) {

        currentAyahIndex++;

        playAyah(
          currentAyahIndex
        );

      } else {

        updatePlayButton(false);

        showMessage(
          "سورت مکمل ہو گئی۔"
        );

      }

    }
  );

  currentAudio.addEventListener(
    "error",
    function() {

      console.error(
        "Audio failed:",
        url
      );

      updatePlayButton(false);

      showMessage(
        "آڈیو چلانے میں مسئلہ آیا۔"
      );

    }
  );

  currentAudio
    .play()
    .then(function() {

      updatePlayButton(true);

    })
    .catch(function(error) {

      console.error(
        "Audio play error:",
        error
      );

      updatePlayButton(false);

      showMessage(
        "آڈیو چلانے کے لیے دوبارہ Play دبائیں۔"
      );

    });

}

function toggleMainAudio() {

  if (!currentAudio) {

    playAyah(
      currentAyahIndex
    );

    return;

  }

  if (currentAudio.paused) {

    currentAudio
      .play()
      .then(function() {
        updatePlayButton(true);
      })
      .catch(function() {
        showMessage(
          "آڈیو دوبارہ نہیں چل سکی۔"
        );
      });

  } else {

    currentAudio.pause();

    updatePlayButton(false);

  }

}

function nextAudio() {

  if (
    currentAyahIndex <
    currentVerses.length - 1
  ) {

    currentAyahIndex++;

    playAyah(
      currentAyahIndex
    );

  }

}

function previousAudio() {

  if (
    currentAyahIndex > 0
  ) {

    currentAyahIndex--;

    playAyah(
      currentAyahIndex
    );

  }

}

function stopAudio() {

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.currentTime = 0;

    currentAudio = null;

  }

  audioList = [];

  updatePlayButton(false);

  const player =
    document.getElementById(
      "audioPlayer"
    );

  if (player) {
    player.classList.add("hidden");
  }

}

function showAudioPlayer(ayah) {

  const player =
    document.getElementById(
      "audioPlayer"
    );

  const title =
    document.getElementById(
      "audioTitle"
    );

  if (player) {
    player.classList.remove(
      "hidden"
    );
  }

  if (title) {

    title.textContent =
      "آیت " +
      (ayah.number ||
       currentAyahIndex + 1);

  }

}

function updatePlayButton(
  playing
) {

  const button =
    document.getElementById(
      "mainPlay"
    );

  if (!button) return;

  button.textContent =
    playing
      ? "⏸️"
      : "▶️";

}

function updateAudioInfo() {

  if (!currentAudio) return;

  const total =
    document.getElementById(
      "totalTime"
    );

  if (total) {

    total.textContent =
      formatTime(
        currentAudio.duration
      );

  }

}

function updateAudioProgress() {

  if (!currentAudio) return;

  const progress =
    document.getElementById(
      "audioProgress"
    );

  const current =
    document.getElementById(
      "currentTime"
    );

  if (progress) {

    const percent =
      currentAudio.duration
        ? (
            currentAudio.currentTime /
            currentAudio.duration
          ) * 100
        : 0;

    progress.value =
      String(percent);

  }

  if (current) {

    current.textContent =
      formatTime(
        currentAudio.currentTime
      );

  }

}

function seekAudio(value) {

  if (
    !currentAudio ||
    !Number.isFinite(
      currentAudio.duration
    )
  ) {
    return;
  }

  currentAudio.currentTime =
    (
      Number(value) / 100
    ) *
    currentAudio.duration;

}

function formatTime(seconds) {

  if (
    !Number.isFinite(seconds)
  ) {
    return "0:00";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  const secs =
    Math.floor(
      seconds % 60
    );

  return (
    minutes +
    ":" +
    String(secs).padStart(
      2,
      "0"
    )
  );

}

function highlightAyah(index) {

  document
    .querySelectorAll(
      ".ayah-card"
    )
    .forEach(function(card) {

      card.classList.remove(
        "current"
      );

    });

  const card =
    document.getElementById(
      "ayah-" + index
    );

  if (card) {

    card.classList.add(
      "current"
    );

    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

}

/* =====================================================
   SETTINGS
===================================================== */

function toggleSettings() {

  const settings =
    document.getElementById(
      "readerSettings"
    );

  if (settings) {

    settings.classList.toggle(
      "hidden"
    );

  }

}

function changeArabicSize(value) {

  document
    .querySelectorAll(
      ".arabic"
    )
    .forEach(function(element) {

      element.style.fontSize =
        value + "px";

    });

  localStorage.setItem(
    "arabicFontSize",
    value
  );

}

function changeTranslation(value) {

  selectedTranslation =
    value;

  localStorage.setItem(
    "translation",
    value
  );

  showMessage(
    "ترجمہ بدلنے کے لیے سورت دوبارہ کھولیں۔"
  );

}

/* =====================================================
   BACK
===================================================== */

function backToSurahs() {

  stopAudio();

  openQuran();

}

/* =====================================================
   CONTINUE READING
===================================================== */

function continueReading() {

  const saved =
    Number(
      localStorage.getItem(
        "lastSurah"
      )
    );

  if (
    saved >= 1 &&
    saved <= 114
  ) {

    openSurah(saved);

  } else {

    openQuran();

  }

}

/* =====================================================
   DUAS
===================================================== */

const duas = [

  {
    title: "سفر کی دعا",
    text:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ"
  },

  {
    title: "کھانے سے پہلے",
    text:
      "بِسْمِ اللّٰهِ"
  },

  {
    title: "علم کی دعا",
    text:
      "رَبِّ زِدْنِي عِلْمًا"
  },

  {
    title: "والدین کے لیے دعا",
    text:
      "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا"
  }

];

function openDuas() {

  stopAudio();

  openScreen(
    "duasScreen"
  );

  setHeader(
    "🤲 دعائیں"
  );

  const list =
    document.getElementById(
      "duasList"
    );

  if (!list) return;

  list.innerHTML = "";

  duas.forEach(function(dua) {

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "card";

    card.innerHTML = `

      <h3>
        ${escapeHTML(
          dua.title
        )}
      </h3>

      <div
        class="arabic"
        style="font-size:26px"
      >
        ${escapeHTML(
          dua.text
        )}
      </div>

    `;

    list.appendChild(card);

  });

}

/* =====================================================
   TASBEEH
===================================================== */

let tasbeehCount =
  Number(
    localStorage.getItem(
      "tasbeehCount"
    ) || 0
  );

function openTasbeeh() {

  stopAudio();

  openScreen(
    "tasbeehScreen"
  );

  setHeader(
    "📿 تسبیح"
  );

  updateTasbeeh();

}

function countTasbeeh() {

  tasbeehCount++;

  localStorage.setItem(
    "tasbeehCount",
    String(tasbeehCount)
  );

  updateTasbeeh();

}

function resetTasbeeh() {

  tasbeehCount = 0;

  localStorage.setItem(
    "tasbeehCount",
    "0"
  );

  updateTasbeeh();

}

function updateTasbeeh() {

  const element =
    document.getElementById(
      "tasbeehCount"
    );

  if (element) {

    element.textContent =
      String(tasbeehCount);

  }

}

/* =====================================================
   MESSAGE
===================================================== */

let messageTimer = null;

function showMessage(text) {

  let message =
    document.getElementById(
      "appMessage"
    );

  if (!message) {

    message =
      document.createElement(
        "div"
      );

    message.id =
      "appMessage";

    message.className =
      "message";

    document.body.appendChild(
      message
    );

  }

  message.textContent =
    text;

  message.classList.remove(
    "hidden"
  );

  clearTimeout(
    messageTimer
  );

  messageTimer =
    setTimeout(function() {

      message.classList.add(
        "hidden"
      );

    }, 3500);

}

/* =====================================================
   SAFE HTML
===================================================== */

function escapeHTML(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }

  return String(value)
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

/* =====================================================
   INITIAL SETTINGS
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const savedFont =
      localStorage.getItem(
        "arabicFontSize"
      );

    if (savedFont) {

      const slider =
        document.getElementById(
          "fontSize"
        );

      if (slider) {
        slider.value =
          savedFont;
      }

    }

    const savedTranslation =
      localStorage.getItem(
        "translation"
      );

    if (savedTranslation) {

      selectedTranslation =
        savedTranslation;

      const select =
        document.getElementById(
          "translationSelect"
        );

      if (select) {
        select.value =
          savedTranslation;
      }

    }

    updateTasbeeh();

    console.log(
      "Quran Companion ready"
    );

  }
);

/* =====================================================
   GLOBAL ERROR HANDLING
===================================================== */

window.addEventListener(
  "error",
  function(event) {

    console.error(
      "JavaScript error:",
      event.error ||
      event.message
    );

  }
);

window.addEventListener(
  "unhandledrejection",
  function(event) {

    console.error(
      "Promise error:",
      event.reason
    );

  }
);
