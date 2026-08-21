"use strict";

/* =====================================================
   QURAN COMPANION — FINAL SCRIPT
   Quran + Urdu + Tafseer + Audio + Auto Next
===================================================== */

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";

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
   STATE
===================================================== */

let currentSurah = 0;
let verses = [];
let currentIndex = 0;
let currentAudio = null;
let isPlaying = false;

/* =====================================================
   SCREEN
===================================================== */

function hideAllScreens() {
  document.querySelectorAll(
    "#homeScreen,#quranScreen,#readerScreen,#duasScreen,#tasbeehScreen"
  ).forEach(function(el) {
    el.classList.add("hidden");
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

  const el = document.getElementById(id);

  if (el) {
    el.classList.remove("hidden");
  }
}

/* =====================================================
   HOME
===================================================== */

function openQuran() {
  openScreen("quranScreen");
  setHeader("قرآن");
  renderSurahs();
}

function continueReading() {
  const saved = Number(localStorage.getItem("lastSurah"));

  if (saved >= 1 && saved <= 114) {
    openQuran();

    setTimeout(function() {
      openSurah(saved);
    }, 100);
  } else {
    openQuran();
  }
}

function openDuas() {
  openScreen("duasScreen");
  setHeader("دعائیں");

  const list = document.getElementById("duasList");

  if (!list) return;

  list.innerHTML = `
    <div class="card">
      <h3>کھانے سے پہلے</h3>
      <p>بِسْمِ اللّٰهِ</p>
    </div>

    <div class="card">
      <h3>کھانے کے بعد</h3>
      <p>الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنِي</p>
    </div>

    <div class="card">
      <h3>سونے کی دعا</h3>
      <p>بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا</p>
    </div>
  `;
}

function openTasbeeh() {
  openScreen("tasbeehScreen");
  setHeader("تسبیح");

  const saved = Number(localStorage.getItem("tasbeehCount") || 0);

  const el = document.getElementById("tasbeehCount");

  if (el) {
    el.textContent = saved;
  }
}

function countTasbeeh() {
  let count = Number(localStorage.getItem("tasbeehCount") || 0);

  count++;

  localStorage.setItem("tasbeehCount", String(count));

  const el = document.getElementById("tasbeehCount");

  if (el) {
    el.textContent = count;
  }
}

function resetTasbeeh() {
  localStorage.setItem("tasbeehCount", "0");

  const el = document.getElementById("tasbeehCount");

  if (el) {
    el.textContent = "0";
  }
}

function setHeader(text) {
  const el = document.getElementById("headerTitle");

  if (el) {
    el.textContent = text;
  }
}

/* =====================================================
   SEARCH
===================================================== */

function filterSurahs() {
  const input = document.getElementById("surahSearch");

  if (!input) return;

  const value = input.value.trim().toLowerCase();

  const result = surahs.filter(function(s) {
    return (
      String(s[0]).includes(value) ||
      s[1].includes(value) ||
      s[2].toLowerCase().includes(value)
    );
  });

  renderSurahs(result);
}

/* =====================================================
   SURAH LIST
===================================================== */

function renderSurahs(list) {
  const container = document.getElementById("surahList");

  if (!container) return;

  container.innerHTML = "";

  (list || surahs).forEach(function(surah) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "surah-card";

    button.innerHTML = `
      <span class="surah-number">${surah[0]}</span>

      <span class="surah-name">
        <strong>${surah[1]}</strong>
        <small>${surah[2]} — ${surah[3]} آیات</small>
      </span>
    `;

    button.onclick = function() {
      openSurah(surah[0]);
    };

    container.appendChild(button);
  });
}

/* =====================================================
   OPEN SURAH
===================================================== */

async function openSurah(number) {
  stopAudio();

  currentSurah = number;
  verses = [];
  currentIndex = 0;

  openScreen("readerScreen");

  const surah = surahs.find(function(s) {
    return s[0] === number;
  });

  if (surah) {
    setHeader(surah[1]);

    const title = document.getElementById("readerTitle");

    if (title) {
      title.textContent = "📖 " + surah[1];
    }
  }

  localStorage.setItem("lastSurah", String(number));

  const container = document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML =
    '<div class="loading">قرآن، ترجمہ اور تفسیر لوڈ ہو رہی ہے...</div>';

  try {
    const response = await fetch(QURAN_FUNCTION_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        surah: number
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.error || "Quran data load نہیں ہو سکا"
      );
    }

    verses = Array.isArray(result.verses)
      ? result.verses
      : [];

    if (!verses.length) {
      throw new Error("اس سورت کی آیات نہیں ملیں");
    }

    renderAyahs();

  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <div class="card">
        <h3>⚠️ قرآن لوڈ نہیں ہو سکا</h3>
        <p>${escapeHTML(error.message)}</p>

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

/* =====================================================
   RENDER AYAT
===================================================== */

function renderAyahs() {
  const container = document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML = "";

  verses.forEach(function(ayah, index) {
    const card = document.createElement("article");

    card.className = "ayah-card";
    card.id = "ayah-" + index;

    const tafseerText =
      ayah.tafseer ||
      ayah.tafseerText ||
      ayah.tafsir ||
      "";

    card.innerHTML = `
      <div class="ayah-top">

        <span class="ayah-number">
          ${ayah.number || index + 1}
        </span>

        <div class="actions">

          <button
            type="button"
            onclick="playIndex(${index})"
          >
            🔊
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
          ${escapeHTML(ayah.urdu || "ترجمہ دستیاب نہیں")}
        </div>

      </div>

      <button
        type="button"
        class="tafseer-btn"
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
            ? escapeHTML(tafseerText)
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
  const box = document.getElementById("tafseer-" + index);

  if (!box) return;

  box.classList.toggle("hidden");

  const buttons = document.querySelectorAll(".tafseer-btn");

  if (buttons[index]) {
    buttons[index].textContent =
      box.classList.contains("hidden")
        ? "📚 تفسیر دکھائیں"
        : "📕 تفسیر چھپائیں";
  }
}

/* =====================================================
   AUDIO
===================================================== */

function playIndex(index) {
  if (!verses[index]) return;

  currentIndex = index;

  playCurrentAudio();
}

function playCurrentAudio() {
  const ayah = verses[currentIndex];

  if (!ayah) return;

  if (!ayah.audio) {
    showMessage("اس آیت کی آواز دستیاب نہیں۔");
    return;
  }

  stopAudio();

  currentAudio = new Audio(ayah.audio);

  currentAudio.preload = "auto";

  currentAudio.addEventListener("loadedmetadata", updateAudioTime);

  currentAudio.addEventListener("timeupdate", updateAudioProgress);

  currentAudio.addEventListener("ended", function() {
    autoNextAudio();
  });

  currentAudio.addEventListener("error", function() {
    showMessage("آڈیو چلانے میں مسئلہ آیا۔");
    resetPlayerButton();
  });

  const player = document.getElementById("audioPlayer");

  if (player) {
    player.classList.remove("hidden");
  }

  updatePlayerTitle();

  highlightAyah();

  currentAudio.play()
    .then(function() {
      isPlaying = true;
      updatePlayButton();
    })
    .catch(function(error) {
      console.error("Audio play error:", error);

      isPlaying = false;
      updatePlayButton();

      showMessage(
        "آڈیو چلانے میں مسئلہ آیا۔ دوبارہ ▶️ دبائیں۔"
      );
    });
}

function autoNextAudio() {
  if (currentIndex < verses.length - 1) {
    currentIndex++;

    scrollToAyah();

    playCurrentAudio();

  } else {
    isPlaying = false;
    updatePlayButton();

    showMessage("سورت مکمل ہو گئی۔");

    /* اگلی سورت خود شروع نہیں ہوگی */
  }
}

function nextAudio() {
  if (!verses.length) return;

  if (currentIndex < verses.length - 1) {
    currentIndex++;

    scrollToAyah();

    playCurrentAudio();
  }
}

function previousAudio() {
  if (!verses.length) return;

  if (currentIndex > 0) {
    currentIndex--;

    scrollToAyah();

    playCurrentAudio();
  }
}

function toggleMainAudio() {
  if (!currentAudio) {
    playCurrentAudio();
    return;
  }

  if (currentAudio.paused) {
    currentAudio.play()
      .then(function() {
        isPlaying = true;
        updatePlayButton();
      })
      .catch(function() {
        showMessage("آڈیو دوبارہ چل نہیں سکی۔");
      });

  } else {
    currentAudio.pause();

    isPlaying = false;

    updatePlayButton();
  }
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();

    currentAudio.currentTime = 0;

    currentAudio.src = "";

    currentAudio = null;
  }

  isPlaying = false;

  resetPlayerButton();
}

function resetPlayerButton() {
  const button = document.getElementById("mainPlay");

  if (button) {
    button.textContent = "▶️";
  }
}

function updatePlayButton() {
  const button = document.getElementById("mainPlay");

  if (!button) return;

  button.textContent = isPlaying
    ? "⏸️"
    : "▶️";
}

/* =====================================================
   PLAYER UI
===================================================== */

function updatePlayerTitle() {
  const title = document.getElementById("audioTitle");

  if (!title) return;

  const ayah = verses[currentIndex];

  title.textContent =
    "آیت " +
    (ayah?.number || currentIndex + 1);
}

function highlightAyah() {
  document.querySelectorAll(".ayah-card").forEach(function(card) {
    card.classList.remove("current");
  });

  const current = document.getElementById(
    "ayah-" + currentIndex
  );

  if (current) {
    current.classList.add("current");
  }
}

function scrollToAyah() {
  setTimeout(function() {
    const current = document.getElementById(
      "ayah-" + currentIndex
    );

    if (current) {
      current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, 150);
}

function updateAudioProgress() {
  if (!currentAudio) return;

  const progress =
    document.getElementById("audioProgress");

  const currentTime =
    document.getElementById("currentTime");

  if (progress && currentAudio.duration) {
    progress.value =
      (currentAudio.currentTime /
        currentAudio.duration) * 100;
  }

  if (currentTime) {
    currentTime.textContent =
      formatTime(currentAudio.currentTime);
  }

  updateAudioTime();
}

function updateAudioTime() {
  if (!currentAudio) return;

  const total =
    document.getElementById("totalTime");

  if (total && isFinite(currentAudio.duration)) {
    total.textContent =
      formatTime(currentAudio.duration);
  }
}

function seekAudio(value) {
  if (!currentAudio) return;

  if (!isFinite(currentAudio.duration)) return;

  currentAudio.currentTime =
    (Number(value) / 100) *
    currentAudio.duration;
}

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

/* =====================================================
   SETTINGS
===================================================== */

function toggleSettings() {
  const readerSettings =
    document.getElementById("readerSettings");

  if (readerSettings) {
    readerSettings.classList.toggle("hidden");
  }
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
  /*
    Current Edge Function already sends Urdu.
    This setting is saved for future translation support.
  */

  localStorage.setItem(
    "translation",
    value
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
   MESSAGE
===================================================== */

let messageTimer = null;

function showMessage(text) {
  let message =
    document.getElementById("appMessage");

  if (!message) {
    message = document.createElement("div");

    message.id = "appMessage";
    message.className = "message";

    document.body.appendChild(message);
  }

  message.textContent = text;
  message.classList.remove("hidden");

  clearTimeout(messageTimer);

  messageTimer = setTimeout(function() {
    message.classList.add("hidden");
  }, 3000);
}

/* =====================================================
   SAFE HTML
===================================================== */

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    const savedFont =
      localStorage.getItem("arabicFontSize");

    if (savedFont) {
      const input =
        document.getElementById("fontSize");

      if (input) {
        input.value = savedFont;
      }
    }

    console.log(
      "Quran Companion — Final JS loaded"
    );
  }
);
