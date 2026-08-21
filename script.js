"use strict";

/* =====================================================
   QURAN COMPANION — COMPLETE SCRIPT
===================================================== */

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";

/* =====================================================
   SURAH DATA
===================================================== */

const surahs = [
  [1,"الفاتحة","Al-Fatihah",7],[2,"البقرة","Al-Baqarah",286],
  [3,"آل عمران","Aal-Imran",200],[4,"النساء","An-Nisa",176],
  [5,"المائدة","Al-Maidah",120],[6,"الأنعام","Al-Anam",165],
  [7,"الأعراف","Al-Araf",206],[8,"الأنفال","Al-Anfal",75],
  [9,"التوبة","At-Tawbah",129],[10,"يونس","Yunus",109],
  [11,"هود","Hud",123],[12,"يوسف","Yusuf",111],
  [13,"الرعد","Ar-Rad",43],[14,"إبراهيم","Ibrahim",52],
  [15,"الحجر","Al-Hijr",99],[16,"النحل","An-Nahl",128],
  [17,"الإسراء","Al-Isra",111],[18,"الكهف","Al-Kahf",110],
  [19,"مريم","Maryam",98],[20,"طه","Ta-Ha",135],
  [21,"الأنبياء","Al-Anbiya",112],[22,"الحج","Al-Hajj",78],
  [23,"المؤمنون","Al-Muminun",118],[24,"النور","An-Nur",64],
  [25,"الفرقان","Al-Furqan",77],[26,"الشعراء","Ash-Shuara",227],
  [27,"النمل","An-Naml",93],[28,"القصص","Al-Qasas",88],
  [29,"العنكبوت","Al-Ankabut",69],[30,"الروم","Ar-Rum",60],
  [31,"لقمان","Luqman",34],[32,"السجدة","As-Sajdah",30],
  [33,"الأحزاب","Al-Ahzab",73],[34,"سبأ","Saba",54],
  [35,"فاطر","Fatir",45],[36,"يس","Ya-Sin",83],
  [37,"الصافات","As-Saffat",182],[38,"ص","Sad",88],
  [39,"الزمر","Az-Zumar",75],[40,"غافر","Ghafir",85],
  [41,"فصلت","Fussilat",54],[42,"الشورى","Ash-Shura",53],
  [43,"الزخرف","Az-Zukhruf",89],[44,"الدخان","Ad-Dukhan",59],
  [45,"الجاثية","Al-Jathiyah",37],[46,"الأحقاف","Al-Ahqaf",35],
  [47,"محمد","Muhammad",38],[48,"الفتح","Al-Fath",29],
  [49,"الحجرات","Al-Hujurat",18],[50,"ق","Qaf",45],
  [51,"الذاريات","Adh-Dhariyat",60],[52,"الطور","At-Tur",49],
  [53,"النجم","An-Najm",62],[54,"القمر","Al-Qamar",55],
  [55,"الرحمن","Ar-Rahman",78],[56,"الواقعة","Al-Waqiah",96],
  [57,"الحديد","Al-Hadid",29],[58,"المجادلة","Al-Mujadilah",22],
  [59,"الحشر","Al-Hashr",24],[60,"الممتحنة","Al-Mumtahanah",13],
  [61,"الصف","As-Saff",14],[62,"الجمعة","Al-Jumuah",11],
  [63,"المنافقون","Al-Munafiqun",11],[64,"التغابن","At-Taghabun",18],
  [65,"الطلاق","At-Talaq",12],[66,"التحريم","At-Tahrim",12],
  [67,"الملك","Al-Mulk",30],[68,"القلم","Al-Qalam",52],
  [69,"الحاقة","Al-Haqqah",52],[70,"المعارج","Al-Maarij",44],
  [71,"نوح","Nuh",28],[72,"الجن","Al-Jinn",28],
  [73,"المزمل","Al-Muzzammil",20],[74,"المدثر","Al-Muddaththir",56],
  [75,"القيامة","Al-Qiyamah",40],[76,"الإنسان","Al-Insan",31],
  [77,"المرسلات","Al-Mursalat",50],[78,"النبأ","An-Naba",40],
  [79,"النازعات","An-Naziat",46],[80,"عبس","Abasa",42],
  [81,"التكوير","At-Takwir",29],[82,"الانفطار","Al-Infitar",19],
  [83,"المطففين","Al-Mutaffifin",36],[84,"الانشقاق","Al-Inshiqaq",25],
  [85,"البروج","Al-Buruj",22],[86,"الطارق","At-Tariq",17],
  [87,"الأعلى","Al-Ala",19],[88,"الغاشية","Al-Ghashiyah",26],
  [89,"الفجر","Al-Fajr",30],[90,"البلد","Al-Balad",20],
  [91,"الشمس","Ash-Shams",15],[92,"الليل","Al-Layl",21],
  [93,"الضحى","Ad-Duha",11],[94,"الشرح","Ash-Sharh",8],
  [95,"التين","At-Tin",8],[96,"العلق","Al-Alaq",19],
  [97,"القدر","Al-Qadr",5],[98,"البينة","Al-Bayyinah",8],
  [99,"الزلزلة","Az-Zalzalah",8],[100,"العاديات","Al-Adiyat",11],
  [101,"القارعة","Al-Qariah",11],[102,"التكاثر","At-Takathur",8],
  [103,"العصر","Al-Asr",3],[104,"الهمزة","Al-Humazah",9],
  [105,"الفيل","Al-Fil",5],[106,"قريش","Quraysh",4],
  [107,"الماعون","Al-Maun",7],[108,"الكوثر","Al-Kawthar",3],
  [109,"الكافرون","Al-Kafirun",6],[110,"النصر","An-Nasr",3],
  [111,"المسد","Al-Masad",5],[112,"الإخلاص","Al-Ikhlas",4],
  [113,"الفلق","Al-Falaq",5],[114,"الناس","An-Nas",6]
];

/* =====================================================
   GLOBAL STATE
===================================================== */

let currentSurah = null;
let currentVerses = [];
let currentAudioIndex = 0;
let currentAudio = null;
let selectedTranslation = "ur.jalandhry";
let tafseerOpen = {};
let isLoading = false;

/* =====================================================
   SCREEN CONTROL
===================================================== */

function hideAllScreens() {
  document.querySelectorAll(
    "#homeScreen, #quranScreen, #readerScreen, #duasScreen, #tasbeehScreen"
  ).forEach(function(screen) {
    screen.classList.add("hidden");
  });
}

function goHome() {
  stopAudio();
  hideAllScreens();

  const home = document.getElementById("homeScreen");
  if (home) home.classList.remove("hidden");

  setHeader("Quran Companion");
}

function openScreen(id) {
  hideAllScreens();

  const screen = document.getElementById(id);

  if (screen) {
    screen.classList.remove("hidden");
  }
}

function setHeader(text) {
  const title = document.getElementById("headerTitle");
  if (title) title.textContent = text;
}

/* =====================================================
   HOME
===================================================== */

function openQuran() {
  stopAudio();

  openScreen("quranScreen");
  setHeader("قرآن");

  renderSurahs();
}

function openDuas() {
  stopAudio();

  openScreen("duasScreen");
  setHeader("دعائیں");

  renderDuas();
}

function openTasbeeh() {
  stopAudio();

  openScreen("tasbeehScreen");
  setHeader("تسبیح");

  updateTasbeeh();
}

function continueReading() {
  const saved = Number(localStorage.getItem("lastSurah"));

  if (saved >= 1 && saved <= 114) {
    openSurah(saved);
  } else {
    openQuran();
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
    const button = document.createElement("button");

    button.type = "button";
    button.className = "surah-card";

    button.innerHTML = `
      <span class="surah-number">${surah[0]}</span>

      <span class="surah-name">
        <strong>${escapeHTML(surah[1])}</strong>
        <small>${escapeHTML(surah[2])} — ${surah[3]} آیات</small>
      </span>
    `;

    button.addEventListener("click", function() {
      openSurah(surah[0]);
    });

    container.appendChild(button);
  });
}

function filterSurahs() {
  const input = document.getElementById("surahSearch");

  if (!input) return;

  const value = input.value.trim().toLowerCase();

  if (!value) {
    renderSurahs();
    return;
  }

  const filtered = surahs.filter(function(surah) {
    return (
      String(surah[0]).includes(value) ||
      surah[1].includes(value) ||
      surah[2].toLowerCase().includes(value)
    );
  });

  renderSurahs(filtered);
}

/* =====================================================
   OPEN SURAH
===================================================== */

async function openSurah(number) {
  if (isLoading) return;

  const surah = surahs.find(function(item) {
    return item[0] === Number(number);
  });

  if (!surah) return;

  currentSurah = Number(number);
  currentVerses = [];
  currentAudioIndex = 0;
  tafseerOpen = {};

  stopAudio();

  openScreen("readerScreen");
  setHeader(surah[1]);

  const title = document.getElementById("readerTitle");
  const container = document.getElementById("ayahContainer");

  if (title) {
    title.textContent = "📖 " + surah[1];
  }

  if (container) {
    container.innerHTML = `
      <div class="loading">
        قرآن، اردو ترجمہ اور تفسیر لوڈ ہو رہی ہے...<br><br>
        براہِ کرم انتظار کریں
      </div>
    `;
  }

  localStorage.setItem("lastSurah", String(number));

  isLoading = true;

  try {
    const response = await fetch(QURAN_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        surah: Number(number)
      })
    });

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch (e) {
      throw new Error(
        "Server نے درست JSON واپس نہیں کیا۔"
      );
    }

    if (!response.ok) {
      throw new Error(
        result.error ||
        "Server error: " + response.status
      );
    }

    if (!result.success) {
      throw new Error(
        result.error ||
        "Quran data unavailable"
      );
    }

    currentVerses = Array.isArray(result.verses)
      ? result.verses
      : [];

    if (currentVerses.length === 0) {
      throw new Error("اس سورت کی آیات نہیں ملیں۔");
    }

    renderAyahs();

  } catch (error) {
    console.error("Quran error:", error);

    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align:center">
          <h2>⚠️ قرآن لوڈ نہیں ہو سکا</h2>
          <p>${escapeHTML(error.message)}</p>

          <button
            class="primary"
            type="button"
            onclick="openSurah(${Number(number)})"
          >
            دوبارہ کوشش کریں
          </button>
        </div>
      `;
    }

  } finally {
    isLoading = false;
  }
}

/* =====================================================
   RENDER AYAT
===================================================== */

function renderAyahs() {
  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML = "";

  currentVerses.forEach(function(ayah, index) {
    const card = document.createElement("article");

    card.className = "ayah-card";
    card.id = "ayah-" + index;

    const tafseerText =
      ayah.tafseer ||
      ayah.tafseerText ||
      "";

    const urduText =
      ayah.urdu ||
      "";

    card.innerHTML = `
      <div class="ayah-top">

        <span class="ayah-number">
          ${ayah.number}
        </span>

        <div class="actions">

          <button
            type="button"
            title="اس آیت کو چلائیں"
            onclick="playAudioIndex(${index})"
          >
            🔊
          </button>

          <button
            type="button"
            title="اس آیت کو شیئر کریں"
            onclick="shareAyah(${index})"
          >
            ↗️
          </button>

        </div>

      </div>

      <div class="arabic">
        ${escapeHTML(ayah.arabic || "")}
      </div>

      <div class="translation">

        <div class="translation-title">
          اردو ترجمہ
        </div>

        <div>
          ${escapeHTML(urduText || "ترجمہ دستیاب نہیں")}
        </div>

      </div>

      <button
        id="tafseer-btn-${index}"
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
            ? escapeHTML(stripHTML(tafseerText))
            : "اس آیت کی تفسیر ابھی دستیاب نہیں۔"
        }
      </div>
    `;

    container.appendChild(card);
  });
}

/* =====================================================
   TAFSEER
===================================================== */

function toggleTafseer(index) {
  const box =
    document.getElementById("tafseer-" + index);

  const button =
    document.getElementById("tafseer-btn-" + index);

  if (!box) return;

  const hidden = box.classList.contains("hidden");

  if (hidden) {
    box.classList.remove("hidden");

    if (button) {
      button.textContent = "📚 تفسیر چھپائیں";
    }

    tafseerOpen[index] = true;

  } else {
    box.classList.add("hidden");

    if (button) {
      button.textContent = "📚 تفسیر دکھائیں";
    }

    tafseerOpen[index] = false;
  }
}

/* =====================================================
   AUDIO
===================================================== */

function getAudioUrl(index) {
  const ayah = currentVerses[index];

  if (!ayah) return null;

  return (
    ayah.audio ||
    ayah.audioUrl ||
    null
  );
}

function playAudioIndex(index) {
  if (!currentVerses[index]) return;

  currentAudioIndex = index;

  const url = getAudioUrl(index);

  if (!url) {
    showMessage("اس آیت کی آواز دستیاب نہیں۔");
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  currentAudio = new Audio();

  currentAudio.preload = "auto";

  currentAudio.src = url;

  currentAudio.addEventListener(
    "loadedmetadata",
    updateAudioTime
  );

  currentAudio.addEventListener(
    "timeupdate",
    updateAudioTime
  );

  currentAudio.addEventListener(
    "ended",
    function() {
      autoNextAudio();
    }
  );

  currentAudio.addEventListener(
    "error",
    function() {
      showMessage(
        "آڈیو چلانے میں مسئلہ آیا۔ اگلی آیت کی کوشش کریں۔"
      );
    }
  );

  highlightAyah(index);

  updatePlayer();

  const player =
    document.getElementById("audioPlayer");

  if (player) {
    player.classList.remove("hidden");
  }

  currentAudio.play()
    .then(function() {
      updatePlayer();
    })
    .catch(function(error) {
      console.error("Audio play error:", error);

      showMessage(
        "آڈیو چلنے میں مسئلہ آیا۔ دوبارہ ▶️ دبائیں۔"
      );

      updatePlayer();
    });
}

function autoNextAudio() {
  if (
    currentAudioIndex <
    currentVerses.length - 1
  ) {
    playAudioIndex(
      currentAudioIndex + 1
    );

    return;
  }

  showMessage("سورت مکمل ہو گئی۔");

  const button =
    document.getElementById("mainPlay");

  if (button) {
    button.textContent = "▶️";
  }
}

function toggleMainAudio() {
  if (!currentAudio) {
    if (currentVerses.length > 0) {
      playAudioIndex(currentAudioIndex);
    }

    return;
  }

  if (currentAudio.paused) {
    currentAudio.play()
      .then(function() {
        updatePlayer();
      })
      .catch(function(error) {
        console.error(error);
      });

  } else {
    currentAudio.pause();
    updatePlayer();
  }
}

function previousAudio() {
  if (currentAudioIndex > 0) {
    playAudioIndex(
      currentAudioIndex - 1
    );
  } else {
    showMessage("یہ پہلی آیت ہے۔");
  }
}

function nextAudio() {
  if (
    currentAudioIndex <
    currentVerses.length - 1
  ) {
    playAudioIndex(
      currentAudioIndex + 1
    );
  } else {
    showMessage("یہ آخری آیت ہے۔");
  }
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();

    try {
      currentAudio.currentTime = 0;
    } catch (e) {}

    currentAudio.src = "";

    currentAudio = null;
  }

  const player =
    document.getElementById("audioPlayer");

  if (player) {
    player.classList.add("hidden");
  }

  const button =
    document.getElementById("mainPlay");

  if (button) {
    button.textContent = "▶️";
  }
}

function seekAudio(value) {
  if (!currentAudio) return;

  if (!Number.isFinite(currentAudio.duration)) {
    return;
  }

  currentAudio.currentTime =
    currentAudio.duration *
    (Number(value) / 100);
}

function updateAudioTime() {
  if (!currentAudio) return;

  const progress =
    document.getElementById("audioProgress");

  const current =
    document.getElementById("currentTime");

  const total =
    document.getElementById("totalTime");

  if (
    progress &&
    Number.isFinite(currentAudio.duration) &&
    currentAudio.duration > 0
  ) {
    progress.value =
      (
        currentAudio.currentTime /
        currentAudio.duration
      ) * 100;
  }

  if (current) {
    current.textContent =
      formatTime(currentAudio.currentTime);
  }

  if (total) {
    total.textContent =
      formatTime(currentAudio.duration);
  }
}

function updatePlayer() {
  const title =
    document.getElementById("audioTitle");

  const button =
    document.getElementById("mainPlay");

  const ayah =
    currentVerses[currentAudioIndex];

  if (title && ayah) {
    title.textContent =
      "آیت " + ayah.number;
  }

  if (button) {
    if (
      currentAudio &&
      !currentAudio.paused
    ) {
      button.textContent = "⏸️";
    } else {
      button.textContent = "▶️";
    }
  }

  updateAudioTime();
}

function formatTime(seconds) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
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

function highlightAyah(index) {
  document
    .querySelectorAll(".ayah-card.current")
    .forEach(function(card) {
      card.classList.remove("current");
    });

  const card =
    document.getElementById(
      "ayah-" + index
    );

  if (card) {
    card.classList.add("current");

    setTimeout(function() {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);
  }
}

/* =====================================================
   BACK
===================================================== */

function backToSurahs() {
  stopAudio();
  openQuran();
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
    .forEach(function(el) {
      el.style.fontSize =
        Number(value) + "px";
    });

  localStorage.setItem(
    "arabicFontSize",
    String(value)
  );
}

function changeTranslation(value) {
  selectedTranslation = value;

  /*
    Current Edge Function Urdu translation
    already returns "urdu".
    Is setting ko future translation
    support ke liye save kar rahe hain.
  */

  localStorage.setItem(
    "translation",
    value
  );

  showMessage(
    "ترجمہ کی setting محفوظ ہو گئی۔"
  );
}

/* =====================================================
   DUAS
===================================================== */

function renderDuas() {
  const list =
    document.getElementById("duasList");

  if (!list) return;

  const duas = [
    {
      title: "سفر کی دعا",
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
      meaning:
        "پاک ہے وہ ذات جس نے اس سواری کو ہمارے تابع کر دیا۔"
    },
    {
      title: "کھانے سے پہلے",
      arabic:
        "بِسْمِ اللَّهِ",
      meaning:
        "اللہ کے نام سے۔"
    },
    {
      title: "سونے کی دعا",
      arabic:
        "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      meaning:
        "اے اللہ! تیرے ہی نام کے ساتھ مرتا اور جیتا ہوں۔"
    },
    {
      title: "والدین کے لیے",
      arabic:
        "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      meaning:
        "اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے مجھے بچپن میں پالا۔"
    }
  ];

  list.innerHTML = "";

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
        ${escapeHTML(dua.meaning)}
      </div>
    `;

    list.appendChild(card);
  });
}

/* =====================================================
   TASBEEH
===================================================== */

function getTasbeehCount() {
  return Number(
    localStorage.getItem("tasbeehCount") || 0
  );
}

function updateTasbeeh() {
  const count =
    document.getElementById("tasbeehCount");

  if (count) {
    count.textContent =
      getTasbeehCount();
  }
}

function countTasbeeh() {
  const value =
    getTasbeehCount() + 1;

  localStorage.setItem(
    "tasbeehCount",
    String(value)
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
   SHARE
===================================================== */

async function shareAyah(index) {
  const ayah =
    currentVerses[index];

  if (!ayah) return;

  const text =
    (ayah.arabic || "") +
    "\n\n" +
    (ayah.urdu || "");

  try {
    if (
      navigator.share
    ) {
      await navigator.share({
        title: "Quran Companion",
        text: text
      });

    } else if (
      navigator.clipboard
    ) {
      await navigator.clipboard.writeText(text);

      showMessage(
        "آیت کا متن کاپی ہو گیا۔"
      );
    } else {
      showMessage(
        "Share اس device پر دستیاب نہیں۔"
      );
    }

  } catch (error) {
    console.log("Share cancelled");
  }
}

/* =====================================================
   MESSAGE
===================================================== */

function showMessage(text) {
  let message =
    document.getElementById("appMessage");

  if (!message) {
    message =
      document.createElement("div");

    message.id = "appMessage";
    message.className = "message";

    document.body.appendChild(message);
  }

  message.textContent = text;
  message.classList.remove("hidden");

  clearTimeout(
    window.quranMessageTimer
  );

  window.quranMessageTimer =
    setTimeout(function() {
      message.classList.add("hidden");
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

function stripHTML(value) {
  const temp =
    document.createElement("div");

  temp.innerHTML = String(value || "");

  return temp.textContent ||
    temp.innerText ||
    "";
}

/* =====================================================
   STARTUP
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "Quran Companion started successfully"
    );

    const savedFont =
      localStorage.getItem(
        "arabicFontSize"
      );

    if (savedFont) {
      changeArabicSize(savedFont);

      const range =
        document.getElementById("fontSize");

      if (range) {
        range.value = savedFont;
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
  }
);
