"use strict";

/* =========================================================
   QURAN COMPANION
   UPGRADED SCRIPT.JS
   ========================================================= */

/*
  Supabase Quran Function
*/

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";


/* =========================================================
   SURAH DATA
   ========================================================= */

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


/* =========================================================
   GLOBAL AUDIO
   ========================================================= */

let currentAudio = null;
let currentButton = null;


/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function hideAllScreens() {

  document
    .querySelectorAll("#homeScreen, .app-screen")
    .forEach(function(screen) {
      screen.classList.add("hidden");
    });

}


function openScreen(id) {

  hideAllScreens();

  const screen = document.getElementById(id);

  if (!screen) {
    console.error("Screen not found:", id);
    return;
  }

  screen.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function goHome() {

  stopAudio();

  openScreen("homeScreen");

}


/* =========================================================
   MAIN FEATURES
   ========================================================= */

function openQuran() {

  stopAudio();

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


/* =========================================================
   CONTINUE READING
   ========================================================= */

function continueReading() {

  const lastSurah =
    Number(localStorage.getItem("lastSurah"));

  const lastAyah =
    Number(localStorage.getItem("lastAyah"));

  if (
    lastSurah >= 1 &&
    lastSurah <= 114
  ) {

    openScreen("quranScreen");

    renderSurahs();

    setTimeout(function() {

      openSurah(
        lastSurah,
        lastAyah || 1
      );

    }, 150);

  } else {

    openQuran();

  }

}


/* =========================================================
   SAVE READING POSITION
   ========================================================= */

function saveReadingPosition(
  surahNumber,
  ayahNumber
) {

  localStorage.setItem(
    "lastSurah",
    String(surahNumber)
  );

  localStorage.setItem(
    "lastAyah",
    String(ayahNumber || 1)
  );

}


/* =========================================================
   DAILY AYAH
   ========================================================= */

function playDailyAyah() {

  const audioUrl =
    "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6203.mp3";

  const button =
    document.querySelector(".daily-card .read-btn");

  playAudio(
    audioUrl,
    button,
    "🔊 آیت سنیں"
  );

}


/* =========================================================
   SEARCH
   ========================================================= */

function toggleSearch() {

  const box =
    document.getElementById("quranSearch");

  if (!box) return;

  box.classList.toggle("hidden");

  if (!box.classList.contains("hidden")) {

    const input =
      document.getElementById("surahSearch");

    if (input) {
      setTimeout(function() {
        input.focus();
      }, 100);
    }

  }

}


function filterSurahs() {

  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const value =
    normalizeText(input.value);

  if (!value) {

    renderSurahs();

    return;

  }

  const filtered =
    surahs.filter(function(surah) {

      const number =
        String(surah[0]);

      const arabic =
        normalizeText(surah[1]);

      const english =
        normalizeText(surah[2]);

      return (
        number.includes(value) ||
        arabic.includes(value) ||
        english.includes(value)
      );

    });

  renderSurahs(filtered);

}


/* =========================================================
   TEXT NORMALIZATION
   ========================================================= */

function normalizeText(text) {

  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ی")
    .replace(/ة/g, "ه");

}


/* =========================================================
   RENDER SURAH LIST
   ========================================================= */

function renderSurahs(list) {

  const container =
    document.getElementById("surahList");

  if (!container) {
    console.error("surahList not found");
    return;
  }

  container.innerHTML = "";

  const data =
    Array.isArray(list)
      ? list
      : surahs;


  if (!data.length) {

    container.innerHTML = `

      <div class="coming-card">

        <span>🔎</span>

        <h2>
          کوئی سورت نہیں ملی
        </h2>

        <p>
          دوسرا نام یا سورت نمبر تلاش کریں۔
        </p>

      </div>

    `;

    return;

  }


  data.forEach(function(surah) {

    const number = surah[0];
    const arabic = surah[1];
    const english = surah[2];
    const ayahs = surah[3];


    const box =
      document.createElement("button");

    box.type = "button";
    box.className = "surah-box";


    const numberSpan =
      document.createElement("span");

    numberSpan.className =
      "surah-number";

    numberSpan.textContent =
      number;


    const arabicSpan =
      document.createElement("span");

    arabicSpan.className =
      "surah-arabic";

    arabicSpan.textContent =
      arabic;


    const englishSpan =
      document.createElement("span");

    englishSpan.className =
      "surah-english";

    englishSpan.textContent =
      english;


    const countSpan =
      document.createElement("span");

    countSpan.className =
      "surah-count";

    countSpan.textContent =
      ayahs + " آیات";


    box.appendChild(numberSpan);
    box.appendChild(arabicSpan);
    box.appendChild(englishSpan);
    box.appendChild(countSpan);


    box.addEventListener(
      "click",
      function() {

        openSurah(number, 1);

      }
    );


    container.appendChild(box);

  });

}


/* =========================================================
   OPEN SURAH
   ========================================================= */

async function openSurah(
  number,
  startAyah = 1
) {

  stopAudio();

  openScreen("readerScreen");


  const title =
    document.getElementById("readerTitle");

  const container =
    document.getElementById("ayahContainer");

  const loading =
    document.getElementById("readerLoading");


  const surah =
    surahs.find(function(item) {
      return item[0] === Number(number);
    });


  if (!surah) {

    showReaderError(
      "یہ سورت دستیاب نہیں۔",
      number
    );

    return;

  }


  if (title) {

    title.textContent =
      "📖 " + surah[1];

  }


  if (container) {

    container.innerHTML = "";

  }


  if (loading) {

    loading.classList.remove("hidden");

  }


  saveReadingPosition(
    number,
    startAyah
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
            surah: Number(number)
          })

        }
      );


    if (!response.ok) {

      throw new Error(
        "Server error: " +
        response.status
      );

    }


    const result =
      await response.json();


    if (!result || !result.success) {

      throw new Error(
        result?.error ||
        "Quran data unavailable"
      );

    }


    if (loading) {

      loading.classList.add("hidden");

    }


    renderAyahs(
      result,
      Number(number),
      Number(startAyah)
    );


  } catch (error) {

    if (loading) {

      loading.classList.add("hidden");

    }


    console.error(
      "Quran loading error:",
      error
    );


    showReaderError(
      error.message ||
      "قرآن لوڈ نہیں ہو سکا۔",
      number
    );

  }

}


/* =========================================================
   READER ERROR
   ========================================================= */

function showReaderError(
  message,
  number
) {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;


  container.innerHTML = `

    <div class="coming-card">

      <span>⚠️</span>

      <h2>
        قرآن لوڈ نہیں ہو سکا
      </h2>

      <p>
        ${escapeHTML(message)}
      </p>

      <button
        type="button"
        class="read-btn"
        onclick="openSurah(${Number(number)}, 1)"
      >
        دوبارہ کوشش کریں
      </button>

    </div>

  `;

}


/* =========================================================
   RENDER AYAT
   ========================================================= */

function renderAyahs(
  result,
  surahNumber,
  startAyah
) {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;


  container.innerHTML = "";


  const verses =
    Array.isArray(result.verses)
      ? result.verses
      : [];


  if (!verses.length) {

    container.innerHTML = `

      <div class="coming-card">

        <span>📖</span>

        <h2>
          آیات دستیاب نہیں
        </h2>

        <p>
          اس سورت کا ڈیٹا ابھی دستیاب نہیں۔
        </p>

      </div>

    `;

    return;

  }


  verses.forEach(function(ayah, index) {

    const ayahNumber =
      Number(
        ayah.number ||
        ayah.ayah ||
        index + 1
      );


    const card =
      document.createElement("article");

    card.className =
      "ayah-card";

    card.dataset.ayah =
      String(ayahNumber);


    /*
      AYAH NUMBER
    */

    const number =
      document.createElement("span");

    number.className =
      "ayah-number";

    number.textContent =
      ayahNumber;


    /*
      ARABIC
    */

    const arabic =
      document.createElement("div");

    arabic.className =
      "arabic-text";

    arabic.textContent =
      ayah.arabic || "";


    /*
      TRANSLATION LABEL
    */

    const translationLabel =
      document.createElement("div");

    translationLabel.className =
      "translation-label";

    translationLabel.textContent =
      "اردو ترجمہ";


    /*
      URDU
    */

    const urdu =
      document.createElement("div");

    urdu.className =
      "urdu-text";

    urdu.textContent =
      ayah.urdu ||
      ayah.translation ||
      "ترجمہ دستیاب نہیں۔";


    /*
      TAFSEER BUTTON
    */

    const tafseerButton =
      document.createElement("button");

    tafseerButton.type =
      "button";

    tafseerButton.className =
      "tafseer-toggle";

    tafseerButton.textContent =
      "📚 تفسیر دیکھیں";


    /*
      TAFSEER BOX
    */

    const tafseer =
      document.createElement("div");

    tafseer.className =
      "tafseer-box hidden";


    if (ayah.tafseer) {

      /*
        tafseer کو textContent سے render کر رہے ہیں
        تاکہ unsafe HTML execute نہ ہو۔
      */

      tafseer.textContent =
        stripHTML(ayah.tafseer);

    } else {

      tafseer.textContent =
        "اس آیت کی تفسیر ابھی دستیاب نہیں۔";

    }


    /*
      TAFSEER TOGGLE
    */

    tafseerButton.addEventListener(
      "click",
      function() {

        const isHidden =
          tafseer.classList.contains("hidden");


        if (isHidden) {

          tafseer.classList.remove("hidden");

          tafseerButton.textContent =
            "📕 تفسیر چھپائیں";

        } else {

          tafseer.classList.add("hidden");

          tafseerButton.textContent =
            "📚 تفسیر دیکھیں";

        }

      }
    );


    /*
      AUDIO
    */

    const audioButton =
      document.createElement("button");

    audioButton.type =
      "button";

    audioButton.className =
      "audio-btn";

    audioButton.textContent =
      "▶ آیت سنیں";


    audioButton.addEventListener(
      "click",
      function() {

        playAyah(
          ayah.audio,
          audioButton,
          surahNumber,
          ayahNumber
        );

      }
    );


    /*
      SAVE POSITION WHEN CARD IS CLICKED
    */

    card.addEventListener(
      "click",
      function(event) {

        if (
          event.target === audioButton ||
          event.target === tafseerButton
        ) {
          return;
        }

        saveReadingPosition(
          surahNumber,
          ayahNumber
        );

      }
    );


    /*
      ADD ELEMENTS
    */

    card.appendChild(number);
    card.appendChild(arabic);
    card.appendChild(translationLabel);
    card.appendChild(urdu);
    card.appendChild(tafseerButton);
    card.appendChild(tafseer);
    card.appendChild(audioButton);


    container.appendChild(card);

  });


  /*
    CONTINUE READING:
    Scroll to last ayah.
  */

  if (
    startAyah &&
    startAyah > 1
  ) {

    setTimeout(function() {

      const target =
        container.querySelector(
          `[data-ayah="${startAyah}"]`
        );

      if (target) {

        target.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        target.style.outline =
          "2px solid rgba(215,181,109,0.35)";

        setTimeout(function() {

          target.style.outline =
            "";

        }, 1800);

      }

    }, 300);

  }

}


/* =========================================================
   PLAY AYAH
   ========================================================= */

function playAyah(
  url,
  button,
  surahNumber,
  ayahNumber
) {

  if (!url) {

    alert(
      "اس آیت کی آواز دستیاب نہیں۔"
    );

    return;

  }


  /*
    If same audio is playing:
    pause it.
  */

  if (
    currentAudio &&
    currentButton === button &&
    !currentAudio.paused
  ) {

    currentAudio.pause();

    button.textContent =
      "▶ آیت سنیں";

    button.classList.remove(
      "playing"
    );

    return;

  }


  playAudio(
    url,
    button,
    "▶ آیت سنیں",
    surahNumber,
    ayahNumber
  );

}


/* =========================================================
   GENERIC AUDIO PLAYER
   ========================================================= */

function playAudio(
  url,
  button,
  defaultText,
  surahNumber,
  ayahNumber
) {

  if (!url) {

    alert(
      "آڈیو دستیاب نہیں۔"
    );

    return;

  }


  stopAudio();


  try {

    currentAudio =
      new Audio();

    currentAudio.preload =
      "auto";

    currentAudio.src =
      url;

    currentButton =
      button;


    if (button) {

      button.textContent =
        "⏸ چل رہا ہے...";

      button.classList.add(
        "playing"
      );

    }


    /*
      Save reading position.
    */

    if (
      surahNumber &&
      ayahNumber
    ) {

      saveReadingPosition(
        surahNumber,
        ayahNumber
      );

    }


    const playPromise =
      currentAudio.play();


    if (
      playPromise &&
      typeof playPromise.catch === "function"
    ) {

      playPromise.catch(
        function(error) {

          console.error(
            "Audio play error:",
            error
          );

          resetAudioButton(
            button,
            defaultText
          );

          currentAudio = null;
          currentButton = null;

        }
      );

    }


    currentAudio.onended =
      function() {

        resetAudioButton(
          button,
          defaultText
        );

        currentAudio = null;
        currentButton = null;

      };


    currentAudio.onerror =
      function() {

        console.error(
          "Audio loading error"
        );

        resetAudioButton(
          button,
          defaultText
        );

        currentAudio = null;
        currentButton = null;

      };


  } catch (error) {

    console.error(
      "Audio system error:",
      error
    );

    resetAudioButton(
      button,
      defaultText
    );

    currentAudio = null;
    currentButton = null;

  }

}


/* =========================================================
   STOP AUDIO
   ========================================================= */

function stopAudio() {

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.currentTime =
      0;

  }


  if (currentButton) {

    resetAudioButton(
      currentButton,
      "▶ آیت سنیں"
    );

  }


  currentAudio = null;
  currentButton = null;

}


/* =========================================================
   RESET AUDIO BUTTON
   ========================================================= */

function resetAudioButton(
  button,
  text
) {

  if (!button) return;

  button.textContent =
    text || "▶ آیت سنیں";

  button.classList.remove(
    "playing"
  );

}


/* =========================================================
   BACK TO SURAH LIST
   ========================================================= */

function backToSurahs() {

  stopAudio();

  openQuran();

}


/* =========================================================
   READER MODE
   ========================================================= */

function toggleReaderMode() {

  const mode =
    document.getElementById("readerMode");

  if (!mode) return;

  mode.classList.toggle("hidden");

}


/* =========================================================
   SAFE HTML
   ========================================================= */

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


/* =========================================================
   STRIP HTML
   ========================================================= */

function stripHTML(text) {

  if (!text) return "";

  const div =
    document.createElement("div");

  div.innerHTML =
    String(text);

  return div.textContent ||
    div.innerText ||
    "";

}


/* =========================================================
   KEYBOARD SEARCH
   ========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    /*
      Press "/" to focus Quran search
    */

    if (
      event.key === "/" &&
      !isTypingField(event.target)
    ) {

      const searchBox =
        document.getElementById(
          "quranSearch"
        );

      const input =
        document.getElementById(
          "surahSearch"
        );

      if (
        searchBox &&
        input
      ) {

        searchBox.classList.remove(
          "hidden"
        );

        input.focus();

        event.preventDefault();

      }

    }

    /*
      Escape closes search
    */

    if (event.key === "Escape") {

      const searchBox =
        document.getElementById(
          "quranSearch"
        );

      if (searchBox) {

        searchBox.classList.add(
          "hidden"
        );

      }

    }

  }
);


/* =========================================================
   CHECK TYPING FIELD
   ========================================================= */

function isTypingField(element) {

  if (!element) return false;

  const tag =
    element.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT"
  );

}


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "Quran Companion ready"
    );

    /*
      Start on Home.
    */

    openScreen("homeScreen");

    /*
      Render Quran list in background.
    */

    renderSurahs();

  }
);


/* =========================================================
   BROWSER BACK BUTTON
   ========================================================= */

window.addEventListener(
  "popstate",
  function() {

    openScreen("homeScreen");

  }
);


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML
   ========================================================= */

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

window.stopAudio =
  stopAudio;


/* =========================================================
   FINAL LOG
   ========================================================= */

console.log(
  "Quran Companion JavaScript loaded successfully"
);
