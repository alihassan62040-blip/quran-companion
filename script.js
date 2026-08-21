"use strict";

/* =====================================================
   QURAN COMPANION
   Complete Frontend JavaScript
===================================================== */

console.log("Quran Companion started successfully");

/* =====================================================
   SUPABASE QURAN FUNCTION
===================================================== */

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";


/* =====================================================
   114 SURAH DATA
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
   APP STATE
===================================================== */

let currentSurahNumber = null;
let currentVerses = [];
let currentAudioIndex = -1;
let currentAudio = null;

let arabicFontSize = Number(
  localStorage.getItem("arabicFontSize") || 32
);

let currentTranslation =
  localStorage.getItem("translation") ||
  "ur.jalandhry";


/* =====================================================
   SCREEN MANAGEMENT
===================================================== */

function hideAllScreens() {

  const screens = [
    "homeScreen",
    "quranScreen",
    "readerScreen",
    "duasScreen",
    "tasbeehScreen"
  ];

  screens.forEach(function(id) {

    const element =
      document.getElementById(id);

    if (element) {
      element.classList.add("hidden");
    }

  });

}


function showScreen(id) {

  hideAllScreens();

  const screen =
    document.getElementById(id);

  if (screen) {
    screen.classList.remove("hidden");
  }

}


function updateHeader(title) {

  const header =
    document.getElementById("headerTitle");

  if (header) {
    header.textContent = title;
  }

}


/* =====================================================
   HOME
===================================================== */

function goHome() {

  stopAudio();

  showScreen("homeScreen");

  updateHeader("Quran Companion");

}


function openQuran() {

  showScreen("quranScreen");

  updateHeader("📖 قرآن مجید");

  renderSurahs();

}


function continueReading() {

  const saved =
    Number(
      localStorage.getItem("lastSurah") || 0
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
   SURAH LIST
===================================================== */

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

    button.className =
      "surah-card";

    button.innerHTML = `
      <span class="surah-number">
        ${surah[0]}
      </span>

      <span class="surah-name">
        <strong>${escapeHTML(surah[1])}</strong>
        <small>
          ${escapeHTML(surah[2])}
          • ${surah[3]} آیات
        </small>
      </span>
    `;

    button.addEventListener(
      "click",
      function() {
        openSurah(surah[0]);
      }
    );

    container.appendChild(button);

  });

}


function filterSurahs() {

  const input =
    document.getElementById(
      "surahSearch"
    );

  if (!input) return;

  const query =
    input.value
      .trim()
      .toLowerCase();

  const filtered =
    surahs.filter(function(surah) {

      return (
        String(surah[0])
          .includes(query) ||

        surah[1]
          .toLowerCase()
          .includes(query) ||

        surah[2]
          .toLowerCase()
          .includes(query)
      );

    });

  renderSurahs(filtered);

}


/* =====================================================
   OPEN SURAH
===================================================== */

async function openSurah(number) {

  number = Number(number);

  if (
    !Number.isInteger(number) ||
    number < 1 ||
    number > 114
  ) {
    return;
  }

  currentSurahNumber = number;

  localStorage.setItem(
    "lastSurah",
    String(number)
  );

  showScreen("readerScreen");

  const surah =
    surahs.find(function(item) {
      return item[0] === number;
    });

  updateHeader(
    surah
      ? "📖 " + surah[1]
      : "📖 قرآن"
  );

  const title =
    document.getElementById(
      "readerTitle"
    );

  if (title) {

    title.textContent =
      surah
        ? "📖 " + surah[1]
        : "📖 قرآن";

  }

  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (container) {

    container.innerHTML = `
      <div class="loading">
        قرآن، ترجمہ اور تفسیر لوڈ ہو رہی ہے...
      </div>
    `;

  }

  stopAudio();

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

    const text =
      await response.text();

    let result;

    try {

      result =
        JSON.parse(text);

    } catch (parseError) {

      throw new Error(
        "Quran server ne valid JSON nahi bheja."
      );

    }

    if (!response.ok) {

      throw new Error(
        result.error ||
        "Quran server error: " +
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
            ${escapeHTML(
              error.message ||
              "Unknown error"
            )}
          </p>

          <button
            class="primary"
            type="button"
            onclick="openSurah(${number})"
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
    Array.isArray(result.verses)
      ? result.verses
      : [];

  if (verses.length === 0) {

    container.innerHTML = `
      <div class="card">
        <h2>آیات دستیاب نہیں</h2>
      </div>
    `;

    return;

  }

  verses.forEach(function(ayah, index) {

    const card =
      document.createElement("article");

    card.className =
      "ayah-card";

    card.dataset.index =
      String(index);


    /* AYAH TOP */

    const top =
      document.createElement("div");

    top.className =
      "ayah-top";


    const number =
      document.createElement("span");

    number.className =
      "ayah-number";

    number.textContent =
      ayah.number;


    const actions =
      document.createElement("div");

    actions.className =
      "actions";


    const playButton =
      document.createElement("button");

    playButton.type = "button";

    playButton.textContent =
      "▶️";

    playButton.title =
      "آیت سنیں";

    playButton.addEventListener(
      "click",
      function() {

        playVerse(
          index
        );

      }
    );


    actions.appendChild(
      playButton
    );

    top.appendChild(
      number
    );

    top.appendChild(
      actions
    );


    /* ARABIC */

    const arabic =
      document.createElement("div");

    arabic.className =
      "arabic";

    arabic.style.fontSize =
      arabicFontSize + "px";

    arabic.textContent =
      ayah.arabic || "";


    /* TRANSLATION */

    const translation =
      document.createElement("div");

    translation.className =
      "translation";

    const translationTitle =
      document.createElement("div");

    translationTitle.className =
      "translation-title";

    translationTitle.textContent =
      "اردو ترجمہ";


    const translationText =
      document.createElement("div");

    translationText.textContent =
      ayah.urdu || "";


    translation.appendChild(
      translationTitle
    );

    translation.appendChild(
      translationText
    );


    /* TAFSEER BUTTON */

    const tafseerButton =
      document.createElement("button");

    tafseerButton.type =
      "button";

    tafseerButton.className =
      "tafseer-btn";

    tafseerButton.textContent =
      "📚 تفسیر دیکھیں";


    /* TAFSEER BOX */

    const tafseerBox =
      document.createElement("div");

    tafseerBox.className =
      "tafseer hidden";


    const tafseerSource =
      ayah.tafseerSource ||
      "Verified Tafseer source";


    if (ayah.tafseer) {

      tafseerBox.innerHTML = `
        <strong>
          📚 ${escapeHTML(tafseerSource)}
        </strong>

        <div style="margin-top:8px">
          ${formatTafseer(
            ayah.tafseer
          )}
        </div>
      `;

    } else {

      tafseerBox.innerHTML = `
        <strong>
          📚 Verified Tafseer source
        </strong>

        <div style="margin-top:8px">
          Tafseer ka verified text
          is ayat ke liye available nahi hai.
        </div>
      `;

    }


    tafseerButton.addEventListener(
      "click",
      function() {

        tafseerBox.classList.toggle(
          "hidden"
        );

        if (
          tafseerBox.classList.contains(
            "hidden"
          )
        ) {

          tafseerButton.textContent =
            "📚 تفسیر دیکھیں";

        } else {

          tafseerButton.textContent =
            "📚 تفسیر چھپائیں";

        }

      }
    );


    /* APPEND */

    card.appendChild(
      top
    );

    card.appendChild(
      arabic
    );

    card.appendChild(
      translation
    );

    card.appendChild(
      tafseerButton
    );

    card.appendChild(
      tafseerBox
    );

    container.appendChild(
      card
    );

  });

}


/* =====================================================
   TAFSEER HTML SAFE FORMAT
===================================================== */

function formatTafseer(text) {

  if (!text) {
    return "";
  }

  /*
    Tafseer API kabhi <p> tags bhejti hai.
    Unhein safe tareeqe se paragraphs
    mein convert karte hain.
  */

  let value =
    String(text);

  value =
    value.replace(
      /<p>/gi,
      ""
    );

  value =
    value.replace(
      /<\/p>/gi,
      "<br><br>"
    );

  value =
    value.replace(
      /<br\s*\/?>/gi,
      "<br>"
    );

  /*
    Basic HTML safety.
  */

  value =
    value.replace(
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      ""
    );

  return value;
}


/* =====================================================
   AUDIO
===================================================== */

function playVerse(index) {

  if (
    !currentVerses[index]
  ) {
    return;
  }

  currentAudioIndex =
    index;

  const verse =
    currentVerses[index];

  if (!verse.audio) {

    showMessage(
      "اس آیت کی آواز دستیاب نہیں۔"
    );

    return;

  }

  stopAudio();

  currentAudio =
    new Audio(
      verse.audio
    );

  currentAudio.preload =
    "auto";

  const player =
    document.getElementById(
      "audioPlayer"
    );

  if (player) {

    player.classList.remove(
      "hidden"
    );

  }

  updateAudioUI();

  currentAudio.addEventListener(
    "timeupdate",
    updateAudioProgress
  );

  currentAudio.addEventListener(
    "loadedmetadata",
    updateAudioProgress
  );

  currentAudio.addEventListener(
    "ended",
    function() {

      markCurrentAyah(
        false
      );

      if (
        currentAudioIndex <
        currentVerses.length - 1
      ) {

        playVerse(
          currentAudioIndex + 1
        );

      } else {

        const button =
          document.getElementById(
            "mainPlay"
          );

        if (button) {
          button.textContent =
            "▶️";
        }

      }

    }
  );

  currentAudio.play()
    .then(function() {

      markCurrentAyah(
        true
      );

      updateAudioUI();

    })
    .catch(function(error) {

      console.error(
        "Audio error:",
        error
      );

      showMessage(
        "Audio play nahi ho saki."
      );

      updateAudioUI();

    });

}


function toggleMainAudio() {

  if (!currentAudio) {

    if (
      currentVerses.length > 0
    ) {

      playVerse(
        currentAudioIndex >= 0
          ? currentAudioIndex
          : 0
      );

    }

    return;

  }

  if (
    currentAudio.paused
  ) {

    currentAudio.play()
      .then(function() {

        markCurrentAyah(
          true
        );

        updateAudioUI();

      })
      .catch(function(error) {

        console.error(
          error
        );

      });

  } else {

    currentAudio.pause();

    markCurrentAyah(
      false
    );

    updateAudioUI();

  }

}


function stopAudio() {

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.src = "";

    currentAudio = null;

  }

  markCurrentAyah(
    false
  );

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


function previousAudio() {

  if (
    currentVerses.length === 0
  ) {
    return;
  }

  const next =
    Math.max(
      0,
      currentAudioIndex - 1
    );

  playVerse(next);

}


function nextAudio() {

  if (
    currentVerses.length === 0
  ) {
    return;
  }

  const next =
    Math.min(
      currentVerses.length - 1,
      currentAudioIndex + 1
    );

  playVerse(next);

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


function updateAudioProgress() {

  if (!currentAudio) {
    return;
  }

  const progress =
    document.getElementById(
      "audioProgress"
    );

  const currentTime =
    document.getElementById(
      "currentTime"
    );

  const totalTime =
    document.getElementById(
      "totalTime"
    );

  if (
    progress &&
    Number.isFinite(
      currentAudio.duration
    )
  ) {

    progress.value =
      String(
        (
          currentAudio.currentTime /
          currentAudio.duration
        ) * 100
      );

  }

  if (currentTime) {

    currentTime.textContent =
      formatTime(
        currentAudio.currentTime
      );

  }

  if (totalTime) {

    totalTime.textContent =
      formatTime(
        currentAudio.duration
      );

  }

}


function updateAudioUI() {

  const button =
    document.getElementById(
      "mainPlay"
    );

  if (!button) {
    return;
  }

  if (
    currentAudio &&
    !currentAudio.paused
  ) {

    button.textContent =
      "⏸️";

  } else {

    button.textContent =
      "▶️";

  }

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

  const remaining =
    Math.floor(
      seconds % 60
    );

  return (
    minutes +
    ":" +
    String(
      remaining
    ).padStart(2, "0")
  );

}


function markCurrentAyah(active) {

  document
    .querySelectorAll(
      ".ayah-card.current"
    )
    .forEach(function(card) {

      card.classList.remove(
        "current"
      );

    });

  if (
    active &&
    currentAudioIndex >= 0
  ) {

    const card =
      document.querySelector(
        '.ayah-card[data-index="' +
        currentAudioIndex +
        '"]'
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

}


/* =====================================================
   SETTINGS
===================================================== */

function toggleSettings() {

  const readerSettings =
    document.getElementById(
      "readerSettings"
    );

  if (!readerSettings) {
    return;
  }

  readerSettings.classList.toggle(
    "hidden"
  );

}


function changeArabicSize(value) {

  const size =
    Number(value);

  if (
    !Number.isFinite(size)
  ) {
    return;
  }

  arabicFontSize =
    size;

  localStorage.setItem(
    "arabicFontSize",
    String(size)
  );

  document
    .querySelectorAll(
      ".arabic"
    )
    .forEach(function(element) {

      element.style.fontSize =
        size + "px";

    });

}


function changeTranslation(value) {

  currentTranslation =
    value;

  localStorage.setItem(
    "translation",
    value
  );

  showMessage(
    "Translation setting save ho gayi. Quran ko dobara open karein."
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
   DUAS
===================================================== */

function openDuas() {

  showScreen(
    "duasScreen"
  );

  updateHeader(
    "🤲 مسنون دعائیں"
  );

  renderDuas();

}


function renderDuas() {

  const container =
    document.getElementById(
      "duasList"
    );

  if (!container) {
    return;
  }

  const duas = [

    {
      title:
        "سونے کی دعا",

      arabic:
        "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",

      meaning:
        "اے اللہ! تیرے ہی نام کے ساتھ مرتا اور جیتا ہوں۔"
    },

    {
      title:
        "کھانے سے پہلے",

      arabic:
        "بِسْمِ اللَّهِ",

      meaning:
        "اللہ کے نام سے۔"
    },

    {
      title:
        "علم میں اضافہ",

      arabic:
        "رَبِّ زِدْنِي عِلْمًا",

      meaning:
        "اے میرے رب! میرے علم میں اضافہ فرما۔"
    },

    {
      title:
        "والدین کے لیے دعا",

      arabic:
        "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",

      meaning:
        "اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے مجھے بچپن میں پالا۔"
    }

  ];

  container.innerHTML = "";

  duas.forEach(function(dua) {

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "card";

    card.innerHTML = `
      <h3>
        ${escapeHTML(dua.title)}
      </h3>

      <div
        class="arabic"
        style="font-size:28px"
      >
        ${escapeHTML(dua.arabic)}
      </div>

      <div class="translation">
        ${escapeHTML(dua.meaning)}
      </div>
    `;

    container.appendChild(
      card
    );

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

  showScreen(
    "tasbeehScreen"
  );

  updateHeader(
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

  tasbeehCount =
    0;

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
    String(text);

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


/* =====================================================
   ESCAPE HTML
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
   START APP
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const font =
      document.getElementById(
        "fontSize"
      );

    if (font) {

      font.value =
        String(
          arabicFontSize
        );

    }

    const translation =
      document.getElementById(
        "translationSelect"
      );

    if (translation) {

      translation.value =
        currentTranslation;

    }

    openQuran();

    /*
      Home screen initial state.
    */

    showScreen(
      "homeScreen"
    );

    updateHeader(
      "Quran Companion"
    );

    console.log(
      "Quran Companion ready"
    );

  }
);
