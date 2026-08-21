"use strict";

/* =====================================================
   QURAN COMPANION — SCRIPT.JS
   ===================================================== */

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";

console.log("Quran Companion started successfully");


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
let currentSurahNumber = 1;


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
}


function goHome() {
  stopAudio();
  openScreen("homeScreen");

  const title = document.getElementById("headerTitle");

  if (title) {
    title.textContent = "Quran Companion";
  }
}


function openQuran() {
  openScreen("quranScreen");

  const title = document.getElementById("headerTitle");

  if (title) {
    title.textContent = "قرآن";
  }

  renderSurahs();
}


function openDuas() {
  openScreen("duasScreen");

  const title = document.getElementById("headerTitle");

  if (title) {
    title.textContent = "دعائیں";
  }

  renderDuas();
}


function openTasbeeh() {
  openScreen("tasbeehScreen");

  const title = document.getElementById("headerTitle");

  if (title) {
    title.textContent = "تسبیح";
  }

  loadTasbeeh();
}


/* =====================================================
   SETTINGS
   ===================================================== */

function toggleSettings() {
  const box = document.getElementById("readerSettings");

  if (box) {
    box.classList.toggle("hidden");
  }
}


function changeArabicSize(value) {
  document.querySelectorAll(".arabic").forEach(function(el) {
    el.style.fontSize = value + "px";
  });

  localStorage.setItem("arabicFontSize", value);
}


function changeTranslation(value) {
  localStorage.setItem("translation", value);

  if (currentSurahNumber) {
    openSurah(currentSurahNumber);
  }
}


/* =====================================================
   SURAH LIST
   ===================================================== */

function renderSurahs(list) {
  const container = document.getElementById("surahList");

  if (!container) return;

  const data = list || surahs;

  container.innerHTML = "";

  data.forEach(function(surah) {

    const number = surah[0];
    const arabic = surah[1];
    const english = surah[2];
    const ayahs = surah[3];

    const button = document.createElement("button");

    button.type = "button";
    button.className = "surah-card";

    button.innerHTML = `
      <span class="surah-number">${number}</span>

      <span class="surah-name">
        <strong>${escapeHTML(arabic)}</strong>
        <small>${escapeHTML(english)} — ${ayahs} آیات</small>
      </span>

      <span>›</span>
    `;

    button.addEventListener("click", function() {
      openSurah(number);
    });

    container.appendChild(button);
  });
}


function filterSurahs() {
  const input = document.getElementById("surahSearch");

  if (!input) return;

  const search = input.value.trim().toLowerCase();

  const filtered = surahs.filter(function(surah) {
    return (
      surah[1].includes(search) ||
      surah[2].toLowerCase().includes(search) ||
      String(surah[0]).includes(search)
    );
  });

  renderSurahs(filtered);
}


/* =====================================================
   OPEN SURAH
   ===================================================== */

async function openSurah(number) {

  currentSurahNumber = Number(number);

  openScreen("readerScreen");

  const title = document.getElementById("readerTitle");
  const container = document.getElementById("ayahContainer");
  const headerTitle = document.getElementById("headerTitle");

  if (title) {
    const surah = surahs.find(function(item) {
      return item[0] === currentSurahNumber;
    });

    if (surah) {
      title.textContent = "📖 " + surah[1];
    }
  }

  if (headerTitle) {
    headerTitle.textContent = "قرآن";
  }

  if (container) {
    container.innerHTML = `
      <div class="loading">
        قرآن، ترجمہ اور تفسیر لوڈ ہو رہی ہے...
      </div>
    `;
  }

  localStorage.setItem(
    "lastSurah",
    String(currentSurahNumber)
  );

  stopAudio();

  try {

    const response = await fetch(
      QURAN_FUNCTION_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          surah: currentSurahNumber
        })
      }
    );

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch (e) {
      throw new Error(
        "Server نے درست JSON جواب نہیں دیا۔"
      );
    }

    if (!response.ok || !result.success) {
      throw new Error(
        result.error ||
        "Quran data load نہیں ہو سکا۔"
      );
    }

    currentVerses = Array.isArray(result.verses)
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
        <div class="card" style="text-align:center">
          <h2>⚠️ قرآن لوڈ نہیں ہوا</h2>
          <p>${escapeHTML(error.message)}</p>

          <button
            class="primary"
            type="button"
            onclick="openSurah(${currentSurahNumber})">
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
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML = "";

  const verses =
    Array.isArray(result.verses)
      ? result.verses
      : [];

  currentVerses = verses;

  if (verses.length === 0) {
    container.innerHTML = `
      <div class="card">
        قرآن کی آیات دستیاب نہیں ہوئیں۔
      </div>
    `;

    return;
  }

  verses.forEach(function(ayah, index) {

    const card =
      document.createElement("article");

    card.className = "ayah-card";

    card.id = "ayah-" + index;

    const top =
      document.createElement("div");

    top.className = "ayah-top";

    const number =
      document.createElement("span");

    number.className = "ayah-number";

    number.textContent =
      ayah.number || index + 1;

    const actions =
      document.createElement("div");

    actions.className = "actions";

    const audioButton =
      document.createElement("button");

    audioButton.type = "button";
    audioButton.textContent = "🔊";

    audioButton.title = "آیت سنیں";

    audioButton.addEventListener(
      "click",
      function() {
        playAyah(index);
      }
    );

    actions.appendChild(audioButton);

    top.appendChild(number);
    top.appendChild(actions);


    const arabic =
      document.createElement("div");

    arabic.className = "arabic";

    arabic.textContent =
      ayah.arabic || "";


    const translation =
      document.createElement("div");

    translation.className =
      "translation";

    translation.innerHTML = `
      <div class="translation-title">
        اردو ترجمہ
      </div>
      <div>${escapeHTML(
        ayah.urdu || ""
      )}</div>
    `;


    const tafseerButton =
      document.createElement("button");

    tafseerButton.type = "button";
    tafseerButton.className = "tafseer-btn";

    tafseerButton.textContent =
      ayah.tafseer
        ? "📚 تفسیر دکھائیں"
        : "📚 تفسیر دستیاب نہیں";


    const tafseerBox =
      document.createElement("div");

    tafseerBox.className =
      "tafseer hidden";

    if (ayah.tafseer) {

      tafseerBox.innerHTML = `
        <strong>
          📚 ${escapeHTML(
            ayah.tafseerSource ||
            "تفسیر"
          )}
        </strong>

        <br><br>

        ${formatTafseer(
          ayah.tafseer
        )}
      `;

      tafseerButton.addEventListener(
        "click",
        function() {
          tafseerBox.classList.toggle("hidden");

          tafseerButton.textContent =
            tafseerBox.classList.contains("hidden")
              ? "📚 تفسیر دکھائیں"
              : "📕 تفسیر چھپائیں";
        }
      );

    } else {

      tafseerButton.disabled = true;
      tafseerButton.style.opacity = "0.6";
    }


    card.appendChild(top);
    card.appendChild(arabic);
    card.appendChild(translation);
    card.appendChild(tafseerButton);
    card.appendChild(tafseerBox);

    container.appendChild(card);
  });


  const savedSize =
    localStorage.getItem("arabicFontSize");

  if (savedSize) {
    changeArabicSize(savedSize);
  }
}


/* =====================================================
   TAFSEER FORMAT
   ===================================================== */

function formatTafseer(text) {

  if (!text) return "";

  /*
    Tafseer API کبھی HTML دیتی ہے۔
    اسے محفوظ طریقے سے دکھائیں گے۔
  */

  const temp =
    document.createElement("div");

  temp.innerHTML = String(text);

  const clean =
    temp.textContent ||
    temp.innerText ||
    "";

  return escapeHTML(clean)
    .replace(/\n/g, "<br>");
}


/* =====================================================
   AUDIO
   ===================================================== */

function playAyah(index) {

  if (
    !currentVerses[index] ||
    !currentVerses[index].audio
  ) {
    showMessage(
      "اس آیت کی آواز دستیاب نہیں۔"
    );

    return;
  }

  const ayah =
    currentVerses[index];

  if (
    currentAudio &&
    currentAudioIndex === index
  ) {

    if (currentAudio.paused) {
      currentAudio.play();
    } else {
      currentAudio.pause();
    }

    updateMainPlayButton();

    return;
  }

  stopAudio();

  currentAudioIndex = index;

  currentAudio =
    new Audio(ayah.audio);

  const player =
    document.getElementById("audioPlayer");

  const title =
    document.getElementById("audioTitle");

  if (player) {
    player.classList.remove("hidden");
  }

  if (title) {
    title.textContent =
      "آیت " +
      (ayah.number || index + 1);
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
        updateMainPlayButton();
      }
    }
  );

  currentAudio.addEventListener(
    "error",
    function() {
      showMessage(
        "آڈیو چلانے میں مسئلہ آیا۔"
      );
    }
  );

  currentAudio
    .play()
    .then(function() {
      updateMainPlayButton();
    })
    .catch(function(error) {
      console.error(
        "Audio play error:",
        error
      );

      showMessage(
        "آڈیو چل نہیں سکی۔ دوبارہ ▶️ دبائیں۔"
      );
    });
}


function toggleMainAudio() {

  if (!currentAudio) return;

  if (currentAudio.paused) {

    currentAudio
      .play()
      .then(updateMainPlayButton)
      .catch(function() {});

  } else {

    currentAudio.pause();

    updateMainPlayButton();
  }
}


function previousAudio() {

  if (currentVerses.length === 0) return;

  let index =
    currentAudioIndex - 1;

  if (index < 0) {
    index = 0;
  }

  playAyah(index);
}


function nextAudio() {

  if (currentVerses.length === 0) return;

  let index =
    currentAudioIndex + 1;

  if (index >= currentVerses.length) {
    index = currentVerses.length - 1;
  }

  playAyah(index);
}


function stopAudio() {

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
  }

  currentAudio = null;
  currentAudioIndex = -1;

  const player =
    document.getElementById("audioPlayer");

  if (player) {
    player.classList.add("hidden");
  }
}


function updateMainPlayButton() {

  const button =
    document.getElementById("mainPlay");

  if (!button) return;

  if (
    currentAudio &&
    !currentAudio.paused
  ) {
    button.textContent = "⏸️";
  } else {
    button.textContent = "▶️";
  }
}


function updateAudioProgress() {

  if (!currentAudio) return;

  const progress =
    document.getElementById("audioProgress");

  if (!progress) return;

  if (
    currentAudio.duration &&
    isFinite(currentAudio.duration)
  ) {
    progress.value =
      (
        currentAudio.currentTime /
        currentAudio.duration
      ) * 100;
  }

  updateAudioTime();
}


function updateAudioTime() {

  if (!currentAudio) return;

  const current =
    document.getElementById("currentTime");

  const total =
    document.getElementById("totalTime");

  if (current) {
    current.textContent =
      formatTime(
        currentAudio.currentTime
      );
  }

  if (total) {
    total.textContent =
      formatTime(
        currentAudio.duration || 0
      );
  }
}


function seekAudio(value) {

  if (!currentAudio) return;

  if (
    !currentAudio.duration ||
    !isFinite(currentAudio.duration)
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

  if (!seconds || !isFinite(seconds)) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secs =
    Math.floor(seconds % 60);

  return (
    minutes +
    ":" +
    String(secs).padStart(2, "0")
  );
}


/* =====================================================
   BACK TO SURAHS
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
      localStorage.getItem("lastSurah")
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
   TASBEEH
   ===================================================== */

function loadTasbeeh() {

  const saved =
    Number(
      localStorage.getItem(
        "tasbeehCount"
      )
    ) || 0;

  const element =
    document.getElementById(
      "tasbeehCount"
    );

  if (element) {
    element.textContent =
      saved;
  }
}


function countTasbeeh() {

  let count =
    Number(
      localStorage.getItem(
        "tasbeehCount"
      )
    ) || 0;

  count++;

  localStorage.setItem(
    "tasbeehCount",
    String(count)
  );

  const element =
    document.getElementById(
      "tasbeehCount"
    );

  if (element) {
    element.textContent =
      count;
  }
}


function resetTasbeeh() {

  localStorage.setItem(
    "tasbeehCount",
    "0"
  );

  const element =
    document.getElementById(
      "tasbeehCount"
    );

  if (element) {
    element.textContent = "0";
  }
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
      title: "سفر کی دعا",
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا",
      urdu:
        "پاک ہے وہ ذات جس نے ہمارے لیے اس سواری کو مسخر کیا۔"
    },

    {
      title: "کھانے سے پہلے",
      arabic:
        "بِسْمِ اللَّهِ",
      urdu:
        "اللہ کے نام سے شروع کرتا ہوں۔"
    },

    {
      title: "علم کی دعا",
      arabic:
        "رَبِّ زِدْنِي عِلْمًا",
      urdu:
        "اے میرے رب! میرے علم میں اضافہ فرما۔"
    },

    {
      title: "دنیا و آخرت کی دعا",
      arabic:
        "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
      urdu:
        "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
    }

  ];

  container.innerHTML = "";

  duas.forEach(function(dua) {

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <h3>${escapeHTML(dua.title)}</h3>

      <div class="arabic">
        ${escapeHTML(dua.arabic)}
      </div>

      <div class="translation">
        ${escapeHTML(dua.urdu)}
      </div>
    `;

    container.appendChild(card);
  });
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

  message.className = "message";

  message.textContent = text;

  document.body.appendChild(message);

  setTimeout(function() {

    message.remove();

  }, 3000);
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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =====================================================
   STARTUP
   ===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "Quran Companion ready"
    );

    /*
      Home screen پہلے سے visible ہے۔
      صرف settings کی saved value لگائیں۔
    */

    const savedSize =
      localStorage.getItem(
        "arabicFontSize"
      );

    const fontInput =
      document.getElementById(
        "fontSize"
      );

    if (
      savedSize &&
      fontInput
    ) {
      fontInput.value =
        savedSize;
    }

    renderSurahs();

  }
);
