"use strict";

/*
==================================================
QURAN COMPANION — NEW SCRIPT.JS
==================================================
Features:
• 114 Surahs
• Surah Search
• Arabic Quran
• Urdu Translation
• Arabic Audio
• Urdu Text-to-Speech
• Play / Pause
• Next / Previous Ayah
• Play All
• Tafseer Toggle
• Bookmark
• Continue Reading
• Reader Font Size
==================================================
*/

console.log("Quran Companion started");


/* ==============================================
   SUPABASE QURAN API
================================================ */

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";


/* ==============================================
   SURAH DATA
================================================ */

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


/* ==============================================
   GLOBAL AUDIO STATE
================================================ */

let currentAudio = null;
let currentButton = null;

let currentVerses = [];
let currentVerseIndex = -1;

let isPlayingAll = false;

let speechActive = false;


/* ==============================================
   SCREEN SYSTEM
================================================ */

function hideAllScreens() {

  document
    .querySelectorAll("#homeScreen, .app-screen")
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

  stopAllAudio();

  openScreen("homeScreen");

}


/* ==============================================
   HOME
================================================ */

function openQuran() {

  openScreen("quranScreen");

  renderSurahs();

}


function openHadith() {
  openScreen("hadithScreen");
}


function openPrayer() {
  openScreen("prayerScreen");
}


function openKaaba() {
  openScreen("kaabaScreen");
}


function openHistory() {
  openScreen("historyScreen");
}


function openUniverse() {
  openScreen("universeScreen");
}


function openCreatures() {
  openScreen("creaturesScreen");
}


function openAI() {
  openScreen("aiScreen");
}


/* ==============================================
   CONTINUE READING
================================================ */

function continueReading() {

  const savedSurah =
    Number(localStorage.getItem("lastSurah"));

  if (
    savedSurah >= 1 &&
    savedSurah <= 114
  ) {

    openQuran();

    setTimeout(function() {

      openSurah(savedSurah);

    }, 150);

  } else {

    openQuran();

  }

}


/* ==============================================
   SEARCH
================================================ */

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

  const filtered =
    surahs.filter(function(surah) {

      return (
        surah[1].includes(value) ||
        surah[2].toLowerCase().includes(value) ||
        String(surah[0]).includes(value)
      );

    });

  renderSurahs(filtered);

}


/* ==============================================
   SURAH LIST
================================================ */

function renderSurahs(list) {

  const container =
    document.getElementById("surahList");

  if (!container) return;

  container.innerHTML = "";

  const data = list || surahs;

  data.forEach(function(surah) {

    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "surah-box";

    button.innerHTML = `

      <span class="surah-number">
        ${surah[0]}
      </span>

      <span class="surah-arabic">
        ${escapeHTML(surah[1])}
      </span>

      <span class="surah-english">
        ${escapeHTML(surah[2])}
      </span>

      <span class="surah-count">
        ${surah[3]} آیات
      </span>

    `;

    button.onclick =
      function() {

        openSurah(surah[0]);

      };

    container.appendChild(button);

  });

}


/* ==============================================
   OPEN SURAH
================================================ */

async function openSurah(number) {

  stopAllAudio();

  isPlayingAll = false;

  openScreen("readerScreen");

  const title =
    document.getElementById("readerTitle");

  const container =
    document.getElementById("ayahContainer");

  const loading =
    document.getElementById("readerLoading");

  const surah =
    surahs.find(function(item) {

      return item[0] === number;

    });

  if (title && surah) {

    title.textContent =
      "📖 " + surah[1];

  }

  if (container) {

    container.innerHTML = "";

  }

  if (loading) {

    loading.classList.remove("hidden");

  }

  localStorage.setItem(
    "lastSurah",
    String(number)
  );

  localStorage.setItem(
    "lastSurahName",
    surah ? surah[1] : ""
  );

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
            surah: number
          })
        }
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.success
    ) {

      throw new Error(
        result.error ||
        "Quran server error"
      );

    }

    if (loading) {

      loading.classList.add("hidden");

    }

    currentVerses =
      result.verses || [];

    renderAyahs(result);

  } catch (error) {

    if (loading) {

      loading.classList.add("hidden");

    }

    if (container) {

      container.innerHTML = `

        <div class="coming-card">

          <span>⚠️</span>

          <h2>
            قرآن لوڈ نہیں ہو سکا
          </h2>

          <p>
            ${escapeHTML(error.message)}
          </p>

          <button
            type="button"
            class="read-btn"
            onclick="openSurah(${number})">

            دوبارہ کوشش کریں

          </button>

        </div>

      `;

    }

    console.error(error);

  }

}


/* ==============================================
   RENDER AYAT
================================================ */

function renderAyahs(result) {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML = "";

  const verses =
    result.verses || [];

  currentVerses = verses;

  if (!verses.length) {

    container.innerHTML = `

      <div class="coming-card">

        <span>📖</span>

        <h2>آیات دستیاب نہیں</h2>

        <p>
          اس سورت کا ڈیٹا دستیاب نہیں۔
        </p>

      </div>

    `;

    return;

  }


  /* ============================================
     SURAH AUDIO CONTROLS
  ============================================ */

  const controls =
    document.createElement("div");

  controls.className =
    "quran-player";

  controls.innerHTML = `

    <button
      type="button"
      class="read-btn"
      id="playAllBtn"
      onclick="playAllAyahs()">

      ▶ مکمل سورت چلائیں

    </button>

    <button
      type="button"
      class="read-btn"
      onclick="pauseAudio()">

      ⏸ Pause

    </button>

    <button
      type="button"
      class="read-btn"
      onclick="resumeAudio()">

      ▶ Resume

    </button>

  `;

  container.appendChild(controls);


  /* ============================================
     AYAT
  ============================================ */

  verses.forEach(function(ayah, index) {

    const card =
      document.createElement("article");

    card.className =
      "ayah-card";

    card.dataset.index =
      index;


    /* NUMBER */

    const number =
      document.createElement("span");

    number.className =
      "ayah-number";

    number.textContent =
      ayah.number || index + 1;


    /* ARABIC */

    const arabic =
      document.createElement("div");

    arabic.className =
      "arabic-text";

    arabic.textContent =
      ayah.arabic || "";


    /* TRANSLATION */

    const label =
      document.createElement("div");

    label.className =
      "translation-label";

    label.textContent =
      "اردو ترجمہ";


    const urdu =
      document.createElement("div");

    urdu.className =
      "urdu-text";

    urdu.textContent =
      ayah.urdu || "ترجمہ دستیاب نہیں";


    /* TAFSEER */

    const tafseerButton =
      document.createElement("button");

    tafseerButton.type =
      "button";

    tafseerButton.className =
      "tafseer-toggle";

    tafseerButton.textContent =
      "📚 تفسیر دیکھیں";


    const tafseer =
      document.createElement("div");

    tafseer.className =
      "tafseer-box hidden";

    tafseer.textContent =
      ayah.tafseer ||
      "اس آیت کی تفسیر ابھی دستیاب نہیں۔";


    tafseerButton.onclick =
      function() {

        const hidden =
          tafseer.classList.contains("hidden");

        if (hidden) {

          tafseer.classList.remove("hidden");

          tafseerButton.textContent =
            "📕 تفسیر چھپائیں";

        } else {

          tafseer.classList.add("hidden");

          tafseerButton.textContent =
            "📚 تفسیر دیکھیں";

        }

      };


    /* ARABIC AUDIO */

    const audioButton =
      document.createElement("button");

    audioButton.type =
      "button";

    audioButton.className =
      "audio-btn";

    audioButton.textContent =
      "▶ عربی تلاوت";


    audioButton.onclick =
      function() {

        currentVerseIndex =
          index;

        playAyah(
          ayah.audio,
          audioButton
        );

      };


    /* URDU SPEECH */

    const urduButton =
      document.createElement("button");

    urduButton.type =
      "button";

    urduButton.className =
      "audio-btn";

    urduButton.textContent =
      "🔊 اردو ترجمہ سنیں";


    urduButton.onclick =
      function() {

        currentVerseIndex =
          index;

        speakUrdu(
          ayah.urdu || ""
        );

      };


    /* BOOKMARK */

    const bookmarkButton =
      document.createElement("button");

    bookmarkButton.type =
      "button";

    bookmarkButton.className =
      "audio-btn";

    bookmarkButton.textContent =
      isBookmarked(
        getCurrentSurahNumber(),
        index
      )
        ? "🔖 محفوظ ہے"
        : "🔖 Bookmark";


    bookmarkButton.onclick =
      function() {

        toggleBookmark(
          getCurrentSurahNumber(),
          index
        );

        bookmarkButton.textContent =
          isBookmarked(
            getCurrentSurahNumber(),
            index
          )
            ? "🔖 محفوظ ہے"
            : "🔖 Bookmark";

      };


    /* PREVIOUS / NEXT */

    const nav =
      document.createElement("div");

    nav.className =
      "ayah-navigation";

    nav.innerHTML = `

      <button
        type="button"
        onclick="previousAyah(${index})">

        ⏮ پچھلی

      </button>

      <button
        type="button"
        onclick="nextAyah(${index})">

        اگلی ⏭

      </button>

    `;


    card.appendChild(number);
    card.appendChild(arabic);
    card.appendChild(label);
    card.appendChild(urdu);
    card.appendChild(tafseerButton);
    card.appendChild(tafseer);
    card.appendChild(audioButton);
    card.appendChild(urduButton);
    card.appendChild(bookmarkButton);
    card.appendChild(nav);

    container.appendChild(card);

  });

}


/* ==============================================
   ARABIC AUDIO
================================================ */

function playAyah(url, button) {

  if (!url) {

    alert("اس آیت کی عربی آواز دستیاب نہیں۔");

    return;

  }

  stopCurrentAudioOnly();

  speechActive = false;

  window.speechSynthesis.cancel();

  currentAudio =
    new Audio(url);

  currentButton =
    button;

  button.textContent =
    "⏸ چل رہا ہے...";

  button.classList.add("playing");

  currentAudio.play().catch(function(error) {

    console.error(error);

    resetAudioButton(button);

  });

  currentAudio.onended =
    function() {

      resetAudioButton(button);

      if (isPlayingAll) {

        playNextFromList();

      }

    };

}


/* ==============================================
   PLAY ALL
================================================ */

function playAllAyahs() {

  if (!currentVerses.length) return;

  isPlayingAll = true;

  currentVerseIndex = 0;

  playVerseByIndex(currentVerseIndex);

}


function playVerseByIndex(index) {

  if (
    index < 0 ||
    index >= currentVerses.length
  ) {

    isPlayingAll = false;

    return;

  }

  const verse =
    currentVerses[index];

  currentVerseIndex =
    index;

  const cards =
    document.querySelectorAll(".ayah-card");

  cards.forEach(function(card) {

    card.classList.remove("active-ayah");

  });

  if (cards[index]) {

    cards[index].classList.add(
      "active-ayah"
    );

    cards[index].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

  const buttons =
    cards[index]
      ? cards[index].querySelectorAll(".audio-btn")
      : [];

  const arabicButton =
    buttons[0];

  playAyah(
    verse.audio,
    arabicButton
  );

}


function playNextFromList() {

  const next =
    currentVerseIndex + 1;

  if (next >= currentVerses.length) {

    isPlayingAll = false;

    return;

  }

  playVerseByIndex(next);

}


/* ==============================================
   NEXT / PREVIOUS
================================================ */

function nextAyah(index) {

  const next =
    index + 1;

  if (
    next >= 0 &&
    next < currentVerses.length
  ) {

    playVerseByIndex(next);

  }

}


function previousAyah(index) {

  const previous =
    index - 1;

  if (
    previous >= 0 &&
    previous < currentVerses.length
  ) {

    playVerseByIndex(previous);

  }

}


/* ==============================================
   PAUSE / RESUME
================================================ */

function pauseAudio() {

  if (currentAudio) {

    currentAudio.pause();

  }

  if (window.speechSynthesis) {

    window.speechSynthesis.pause();

  }

}


function resumeAudio() {

  if (currentAudio) {

    currentAudio.play().catch(function() {});

  }

  if (window.speechSynthesis) {

    window.speechSynthesis.resume();

  }

}


/* ==============================================
   URDU TEXT TO SPEECH
================================================ */

function speakUrdu(text) {

  if (!text) {

    alert("اردو ترجمہ دستیاب نہیں۔");

    return;

  }

  stopCurrentAudioOnly();

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang =
    "ur-PK";

  utterance.rate =
    0.85;

  utterance.pitch =
    1;

  speechActive = true;

  utterance.onend =
    function() {

      speechActive = false;

    };

  window.speechSynthesis.speak(
    utterance
  );

}


/* ==============================================
   STOP AUDIO
================================================ */

function stopCurrentAudioOnly() {

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.currentTime = 0;

    currentAudio = null;

  }

  if (currentButton) {

    resetAudioButton(
      currentButton
    );

    currentButton = null;

  }

}


function stopAllAudio() {

  isPlayingAll = false;

  stopCurrentAudioOnly();

  speechActive = false;

  if (window.speechSynthesis) {

    window.speechSynthesis.cancel();

  }

  document
    .querySelectorAll(".active-ayah")
    .forEach(function(card) {

      card.classList.remove(
        "active-ayah"
      );

    });

}


function resetAudioButton(button) {

  if (!button) return;

  button.textContent =
    "▶ عربی تلاوت";

  button.classList.remove(
    "playing"
  );

}


/* ==============================================
   DAILY AYAH
================================================ */

function playDailyAyah() {

  const url =
    "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6203.mp3";

  stopAllAudio();

  const audio =
    new Audio(url);

  currentAudio =
    audio;

  audio.play().catch(function(error) {

    console.error(
      "Daily audio error:",
      error
    );

  });

}


/* ==============================================
   BOOKMARKS
================================================ */

function bookmarkKey(
  surah,
  ayah
) {

  return (
    "bookmark_" +
    surah +
    "_" +
    ayah
  );

}


function isBookmarked(
  surah,
  ayah
) {

  return (
    localStorage.getItem(
      bookmarkKey(surah, ayah)
    ) === "true"
  );

}


function toggleBookmark(
  surah,
  ayah
) {

  const key =
    bookmarkKey(surah, ayah);

  if (
    localStorage.getItem(key) === "true"
  ) {

    localStorage.removeItem(key);

  } else {

    localStorage.setItem(
      key,
      "true"
    );

  }

}


/* ==============================================
   CURRENT SURAH
================================================ */

function getCurrentSurahNumber() {

  const title =
    document.getElementById("readerTitle");

  if (!title) return 1;

  const text =
    title.textContent;

  const found =
    surahs.find(function(surah) {

      return text.includes(surah[1]);

    });

  return found
    ? found[0]
    : Number(
        localStorage.getItem("lastSurah")
      ) || 1;

}


/* ==============================================
   READER MODE
================================================ */

function toggleReaderMode() {

  const mode =
    document.getElementById("readerMode");

  if (mode) {

    mode.classList.toggle("hidden");

  }

}


/* ==============================================
   BACK TO SURAHS
================================================ */

function backToSurahs() {

  stopAllAudio();

  openQuran();

}


/* ==============================================
   SAFE HTML
================================================ */

function escapeHTML(text) {

  if (
    text === null ||
    text === undefined
  ) {

    return "";

  }

  return String(text)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* ==============================================
   PAGE START
================================================ */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "Quran Companion ready"
    );

    renderSurahs();

  }
);


/* ==============================================
   HTML ACCESS
================================================ */

window.openQuran =
  openQuran;

window.openHadith =
  openHadith;

window.openPrayer =
  openPrayer;

window.openKaaba =
  openKaaba;

window.openHistory =
  openHistory;

window.openUniverse =
  openUniverse;

window.openCreatures =
  openCreatures;

window.openAI =
  openAI;

window.goHome =
  goHome;

window.continueReading =
  continueReading;

window.openSurah =
  openSurah;

window.backToSurahs =
  backToSurahs;

window.toggleSearch =
  toggleSearch;

window.filterSurahs =
  filterSurahs;

window.toggleReaderMode =
  toggleReaderMode;

window.playDailyAyah =
  playDailyAyah;

window.playAyah =
  playAyah;

window.playAllAyahs =
  playAllAyahs;

window.pauseAudio =
  pauseAudio;

window.resumeAudio =
  resumeAudio;

window.nextAyah =
  nextAyah;

window.previousAyah =
  previousAyah;

window.speakUrdu =
  speakUrdu;

window.toggleBookmark =
  toggleBookmark;

console.log(
  "New Quran Companion script loaded"
);
