"use strict";

/* =====================================================
   QURAN COMPANION — MAIN SCRIPT
   No data.js required
===================================================== */

console.log("Quran Companion started successfully");

/* =====================================================
   SUPABASE EDGE FUNCTION
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
   GLOBAL AUDIO
===================================================== */

let currentAudio = null;
let currentAudioIndex = -1;
let currentVerses = [];


/* =====================================================
   SCREEN CONTROL
===================================================== */

function hideAllScreens() {

  document
    .querySelectorAll("#homeScreen, .app-screen, main > section")
    .forEach(function(screen) {

      screen.classList.add("hidden");

    });

}


function openScreen(id) {

  hideAllScreens();

  const screen = document.getElementById(id);

  if (screen) {
    screen.classList.remove("hidden");
  }

  updateHeader(id);
}


function updateHeader(id) {

  const title =
    document.getElementById("headerTitle");

  if (!title) return;

  const names = {
    homeScreen: "Quran Companion",
    quranScreen: "قرآن",
    readerScreen: "قرآن",
    duasScreen: "دعائیں",
    tasbeehScreen: "تسبیح"
  };

  title.textContent =
    names[id] || "Quran Companion";
}


/* =====================================================
   HOME
===================================================== */

function goHome() {

  stopAudio();

  openScreen("homeScreen");

}


function openQuran() {

  openScreen("quranScreen");

  renderSurahs();

}


function continueReading() {

  const saved =
    Number(localStorage.getItem("lastSurah") || 0);

  openQuran();

  if (saved >= 1 && saved <= 114) {

    setTimeout(function() {
      openSurah(saved);
    }, 100);

  }

}


function openDuas() {

  openScreen("duasScreen");

  renderDuas();

}


function openTasbeeh() {

  openScreen("tasbeehScreen");

  updateTasbeeh();

}


/* =====================================================
   SURAH LIST
===================================================== */

function renderSurahs(list) {

  const container =
    document.getElementById("surahList");

  if (!container) return;

  const data =
    Array.isArray(list) ? list : surahs;

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
        <small>${escapeHTML(surah[2])} • ${surah[3]} آیات</small>
      </span>

      <span>›</span>
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


/* =====================================================
   SEARCH
===================================================== */

function filterSurahs() {

  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const value =
    input.value.trim().toLowerCase();

  if (!value) {

    renderSurahs();

    return;

  }

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


/* =====================================================
   SETTINGS
===================================================== */

function toggleSettings() {

  const settings =
    document.getElementById("readerSettings");

  if (!settings) return;

  settings.classList.toggle("hidden");

}


function changeArabicSize(value) {

  document
    .querySelectorAll(".arabic")
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

  localStorage.setItem(
    "translation",
    value
  );

  showMessage(
    "ترجمہ کی ترتیب محفوظ ہوگئی۔"
  );

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

    showMessage("غلط سورت نمبر");

    return;

  }

  openScreen("readerScreen");

  localStorage.setItem(
    "lastSurah",
    String(number)
  );

  const title =
    document.getElementById("readerTitle");

  const container =
    document.getElementById("ayahContainer");

  if (title) {

    const surah =
      surahs.find(function(item) {
        return item[0] === number;
      });

    title.textContent =
      surah
        ? "📖 " + surah[1]
        : "📖 قرآن";

  }

  if (container) {

    container.innerHTML = `
      <div class="loading">
        قرآن، ترجمہ اور تفسیر لوڈ ہو رہی ہے...
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
            surah: number
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
          <p>${escapeHTML(error.message)}</p>

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

}


/* =====================================================
   RENDER AYAT + TAFSEER
===================================================== */

function renderAyahs(result) {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML = "";

  currentVerses =
    result.verses || [];

  currentAudioIndex = -1;

  if (!currentVerses.length) {

    container.innerHTML = `
      <div class="card">
        قرآن کی آیات دستیاب نہیں ہوئیں۔
      </div>
    `;

    return;

  }

  currentVerses.forEach(
    function(ayah, index) {

      const card =
        document.createElement("article");

      card.className =
        "ayah-card";

      card.id =
        "ayah-" + index;


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


      const play =
        document.createElement("button");

      play.type = "button";

      play.textContent =
        "▶️ سنیں";

      play.addEventListener(
        "click",
        function() {
          playAyah(index);
        }
      );


      actions.appendChild(play);

      top.appendChild(number);
      top.appendChild(actions);


      /* ARABIC */

      const arabic =
        document.createElement("div");

      arabic.className =
        "arabic";

      arabic.textContent =
        ayah.arabic || "";


      /* TRANSLATION */

      const translation =
        document.createElement("div");

      translation.className =
        "translation";

      translation.innerHTML = `
        <div class="translation-title">
          اردو ترجمہ
        </div>
        <div>
          ${escapeHTML(ayah.urdu || "ترجمہ دستیاب نہیں۔")}
        </div>
      `;


      /* TAFSEER BUTTON */

      const tafseerButton =
        document.createElement("button");

      tafseerButton.type = "button";

      tafseerButton.className =
        "tafseer-btn";

      tafseerButton.textContent =
        "📚 تفسیر دیکھیں";


      /* TAFSEER BOX */

      const tafseer =
        document.createElement("div");

      tafseer.className =
        "tafseer hidden";


      if (ayah.tafseer) {

        tafseer.innerHTML = `
          <div style="
            font-weight:bold;
            color:#83c7a3;
            margin-bottom:8px;
          ">
            📚 تفسیر
          </div>

          <div>
            ${cleanTafseer(ayah.tafseer)}
          </div>

          ${
            ayah.tafseerSource
              ? `
                <div style="
                  margin-top:12px;
                  font-size:12px;
                  color:#8fa99c;
                ">
                  ماخذ: ${escapeHTML(ayah.tafseerSource)}
                </div>
              `
              : ""
          }
        `;

      } else {

        tafseer.innerHTML = `
          <div>
            تفسیر اس آیت کے لیے ابھی دستیاب نہیں۔
          </div>
        `;

      }


      tafseerButton.addEventListener(
        "click",
        function() {

          tafseer.classList.toggle("hidden");

          if (tafseer.classList.contains("hidden")) {

            tafseerButton.textContent =
              "📚 تفسیر دیکھیں";

          } else {

            tafseerButton.textContent =
              "📕 تفسیر چھپائیں";

          }

        }
      );


      /* APPEND */

      card.appendChild(top);
      card.appendChild(arabic);
      card.appendChild(translation);
      card.appendChild(tafseerButton);
      card.appendChild(tafseer);

      container.appendChild(card);

    }
  );


  /* RESTORE FONT */

  const savedSize =
    localStorage.getItem("arabicFontSize");

  if (savedSize) {
    changeArabicSize(savedSize);
  }

}


/* =====================================================
   TAFSEER HTML CLEANING
===================================================== */

function cleanTafseer(text) {

  if (!text) return "";

  /*
    Tafseer source mein <p> tags
    aa sakte hain.
    Unhein proper HTML paragraphs
    mein convert karte hain.
  */

  let safe =
    String(text);

  safe =
    safe.replace(
      /<p>/gi,
      "<p>"
    );

  safe =
    safe.replace(
      /<\/p>/gi,
      "</p>"
    );

  /*
    Dangerous scripts remove.
  */

  safe =
    safe.replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    );

  return safe;

}


/* =====================================================
   AUDIO
===================================================== */

function playAyah(index) {

  if (
    !currentVerses[index]
  ) return;

  const ayah =
    currentVerses[index];

  if (!ayah.audio) {

    showMessage(
      "اس آیت کی آواز دستیاب نہیں۔"
    );

    return;

  }

  stopAudio();

  currentAudioIndex =
    index;

  currentAudio =
    new Audio(ayah.audio);

  currentAudio.preload =
    "auto";

  const player =
    document.getElementById("audioPlayer");

  const title =
    document.getElementById("audioTitle");

  const playButton =
    document.getElementById("mainPlay");

  if (player) {

    player.classList.remove(
      "hidden"
    );

  }

  if (title) {

    title.textContent =
      "آیت " + ayah.number;

  }

  if (playButton) {

    playButton.textContent =
      "⏸️";

  }

  currentAudio.addEventListener(
    "loadedmetadata",
    updateAudioTime
  );

  currentAudio.addEventListener(
    "timeupdate",
    updateAudioProgress
  );

  currentAudio.addEventListener(
    "ended",
    function() {

      if (
        currentAudioIndex <
        currentVerses.length - 1
      ) {

        playAyah(
          currentAudioIndex + 1
        );

      } else {

        if (playButton) {

          playButton.textContent =
            "▶️";

        }

      }

    }
  );

  currentAudio
    .play()
    .catch(function(error) {

      console.error(
        "Audio play error:",
        error
      );

      showMessage(
        "آڈیو چل نہیں سکی۔ Chromebook میں دوبارہ Play دبائیں۔"
      );

      if (playButton) {

        playButton.textContent =
          "▶️";

      }

    });

  const card =
    document.getElementById(
      "ayah-" + index
    );

  if (card) {

    document
      .querySelectorAll(".ayah-card")
      .forEach(function(item) {

        item.classList.remove(
          "current"
        );

      });

    card.classList.add(
      "current"
    );

    card.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

}


function toggleMainAudio() {

  if (!currentAudio) {

    if (currentVerses.length) {

      playAyah(
        currentAudioIndex >= 0
          ? currentAudioIndex
          : 0
      );

    }

    return;

  }

  const button =
    document.getElementById(
      "mainPlay"
    );

  if (currentAudio.paused) {

    currentAudio
      .play()
      .then(function() {

        if (button) {
          button.textContent = "⏸️";
        }

      })
      .catch(function(error) {

        console.error(
          "Audio resume error:",
          error
        );

      });

  } else {

    currentAudio.pause();

    if (button) {
      button.textContent = "▶️";
    }

  }

}


function previousAudio() {

  if (!currentVerses.length) return;

  let index =
    currentAudioIndex - 1;

  if (index < 0) {
    index = 0;
  }

  playAyah(index);

}


function nextAudio() {

  if (!currentVerses.length) return;

  let index =
    currentAudioIndex + 1;

  if (
    index >= currentVerses.length
  ) {
    index =
      currentVerses.length - 1;
  }

  playAyah(index);

}


function seekAudio(value) {

  if (!currentAudio) return;

  if (!currentAudio.duration) return;

  currentAudio.currentTime =
    (
      Number(value) / 100
    ) *
    currentAudio.duration;

}


function updateAudioProgress() {

  if (
    !currentAudio ||
    !currentAudio.duration
  ) return;

  const progress =
    document.getElementById(
      "audioProgress"
    );

  if (progress) {

    progress.value =
      (
        currentAudio.currentTime /
        currentAudio.duration
      ) *
      100;

  }

  updateAudioTime();

}


function updateAudioTime() {

  if (!currentAudio) return;

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
        currentAudio.currentTime
      );

  }

  if (total) {

    total.textContent =
      formatTime(
        currentAudio.duration
      );

  }

}


function formatTime(seconds) {

  if (
    !seconds ||
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
    String(secs).padStart(2,"0")
  );

}


function stopAudio() {

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.src = "";

    currentAudio = null;

  }

  currentAudioIndex = -1;

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


/* =====================================================
   BACK TO SURAHS
===================================================== */

function backToSurahs() {

  stopAudio();

  openQuran();

}


/* =====================================================
   DUAS
===================================================== */

function renderDuas() {

  const container =
    document.getElementById(
      "duasList"
    );

  if (!container) return;

  const duas = [

    {
      title:"سفر کی دعا",
      arabic:"سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
      meaning:"پاک ہے وہ ذات جس نے اس سواری کو ہمارے لیے مسخر کیا۔"
    },

    {
      title:"کھانے سے پہلے",
      arabic:"بِسْمِ اللَّهِ",
      meaning:"اللہ کے نام سے۔"
    },

    {
      title:"کھانے کے بعد",
      arabic:"الْحَمْدُ لِلَّهِ",
      meaning:"تمام تعریفیں اللہ کے لیے ہیں۔"
    },

    {
      title:"سونے کی دعا",
      arabic:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      meaning:"اے اللہ! تیرے ہی نام کے ساتھ مرتا اور جیتا ہوں۔"
    }

  ];

  container.innerHTML = "";

  duas.forEach(function(dua) {

    const card =
      document.createElement("div");

    card.className =
      "card";

    card.innerHTML = `
      <h3>${escapeHTML(dua.title)}</h3>

      <div class="arabic">
        ${escapeHTML(dua.arabic)}
      </div>

      <div class="translation">
        ${escapeHTML(dua.meaning)}
      </div>
    `;

    container.appendChild(card);

  });

}


/* =====================================================
   TASBEEH
===================================================== */

function getTasbeeh() {

  return Number(
    localStorage.getItem(
      "tasbeehCount"
    ) || 0
  );

}


function updateTasbeeh() {

  const element =
    document.getElementById(
      "tasbeehCount"
    );

  if (element) {

    element.textContent =
      getTasbeeh();

  }

}


function countTasbeeh() {

  const count =
    getTasbeeh() + 1;

  localStorage.setItem(
    "tasbeehCount",
    String(count)
  );

  updateTasbeeh();

}


function resetTasbeeh() {

  localStorage.setItem(
    "tasbeehCount",
    "0"
  );

  updateTasbeeh();

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
    document.createElement("div");

  message.className =
    "message";

  message.textContent =
    text;

  document.body.appendChild(
    message
  );

  setTimeout(function() {

    message.remove();

  }, 3000);

}


/* =====================================================
   SAFE HTML
===================================================== */

function escapeHTML(text) {

  if (
    text === null ||
    text === undefined
  ) {

    return "";

  }

  return String(text)
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
   SERVICE WORKER
===================================================== */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    function() {

      navigator.serviceWorker
        .register("./sw.js")
        .then(function() {

          console.log(
            "Service Worker registered"
          );

        })
        .catch(function(error) {

          console.log(
            "Service Worker registration failed:",
            error
          );

        });

    }
  );

}


/* =====================================================
   START APP
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "Quran Companion ready"
    );

    renderSurahs();

    updateTasbeeh();

  }
);
