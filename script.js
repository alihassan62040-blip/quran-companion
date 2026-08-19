"use strict";

/*
==================================================
QURAN COMPANION
MAIN SCRIPT.JS
==================================================
*/

console.log("Quran Companion started successfully");


/*
==================================================
SUPABASE QURAN FUNCTION
==================================================
*/

const QURAN_FUNCTION_URL =
  "https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";


/*
==================================================
SURAH DATA
==================================================
*/

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


/*
==================================================
SCREEN MANAGEMENT
==================================================
*/

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

  } else {

    console.error(
      "Screen not found:",
      id
    );

  }

}


function goHome() {

  openScreen("homeScreen");

}


/*
==================================================
HOME BUTTONS
==================================================
*/

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


/*
==================================================
CONTINUE READING
==================================================
*/

function continueReading() {

  const lastSurah =
    Number(
      localStorage.getItem("lastSurah")
    );

  if (
    lastSurah >= 1 &&
    lastSurah <= 114
  ) {

    openQuran();

    setTimeout(function() {

      openSurah(lastSurah);

    }, 100);

  } else {

    openQuran();

  }

}


/*
==================================================
DAILY AYAH AUDIO
==================================================
*/

function playDailyAyah() {

  const audio =
    new Audio(
      "https://cdn.islamic.network/quran/audio/128/ar.alafasy/6203.mp3"
    );

  audio.play().catch(function(error) {

    console.error(
      "Daily audio error:",
      error
    );

  });

}


/*
==================================================
SEARCH
==================================================
*/

function toggleSearch() {

  const box =
    document.getElementById(
      "quranSearch"
    );

  if (box) {

    box.classList.toggle(
      "hidden"
    );

  }

}


function filterSurahs() {

  const input =
    document.getElementById(
      "surahSearch"
    );

  if (!input) return;

  const value =
    input.value
      .trim()
      .toLowerCase();

  const filtered =
    surahs.filter(function(surah) {

      return (

        surah[1].includes(value) ||

        surah[2]
          .toLowerCase()
          .includes(value) ||

        String(surah[0])
          .includes(value)

      );

    });

  renderSurahs(filtered);

}


/*
==================================================
SURAH LIST
==================================================
*/

function renderSurahs(list) {

  const container =
    document.getElementById(
      "surahList"
    );

  if (!container) {

    console.error(
      "surahList not found"
    );

    return;

  }

  container.innerHTML = "";

  const data =
    list || surahs;

  data.forEach(function(surah) {

    const number =
      surah[0];

    const arabic =
      surah[1];

    const english =
      surah[2];

    const ayahs =
      surah[3];


    const box =
      document.createElement(
        "button"
      );

    box.type = "button";

    box.className =
      "surah-box";


    box.innerHTML = `

      <span class="surah-number">
        ${number}
      </span>

      <span class="surah-arabic">
        ${escapeHTML(arabic)}
      </span>

      <span class="surah-english">
        ${escapeHTML(english)}
      </span>

      <span class="surah-count">
        ${ayahs} آیات
      </span>

    `;


    box.onclick =
      function() {

        openSurah(number);

      };


    container.appendChild(box);

  });

}


/*
==================================================
OPEN SURAH
==================================================
*/

async function openSurah(number) {

  openScreen("readerScreen");


  const title =
    document.getElementById(
      "readerTitle"
    );


  const container =
    document.getElementById(
      "ayahContainer"
    );


  const loading =
    document.getElementById(
      "readerLoading"
    );


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

    loading.classList.remove(
      "hidden"
    );

  }


  localStorage.setItem(
    "lastSurah",
    String(number)
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
        "Quran server error: " +
        response.status
      );

    }


    if (loading) {

      loading.classList.add(
        "hidden"
      );

    }


    renderAyahs(result);


  } catch (error) {

    if (loading) {

      loading.classList.add(
        "hidden"
      );

    }


    if (container) {

      container.innerHTML = `

        <div class="coming-card">

          <span>⚠️</span>

          <h2>
            قرآن لوڈ نہیں ہو سکا
          </h2>

          <p>
            ${escapeHTML(
              error.message
            )}
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


    console.error(
      "Quran loading error:",
      error
    );

  }

}


/*
==================================================
RENDER AYAT
==================================================
*/

function renderAyahs(result) {

  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (!container) {

    console.error(
      "ayahContainer not found"
    );

    return;

  }


  container.innerHTML = "";


  const verses =
    result.verses || [];


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


  verses.forEach(function(ayah) {


    /*
    ==========================================
    AYAH CARD
    ==========================================
    */

    const card =
      document.createElement(
        "article"
      );

    card.className =
      "ayah-card";


    /*
    ==========================================
    AYAH NUMBER
    ==========================================
    */

    const number =
      document.createElement(
        "span"
      );

    number.className =
      "ayah-number";

    number.textContent =
      ayah.number || "";


    /*
    ==========================================
    ARABIC
    ==========================================
    */

    const arabic =
      document.createElement(
        "div"
      );

    arabic.className =
      "arabic-text";

    arabic.textContent =
      ayah.arabic || "";


    /*
    ==========================================
    TRANSLATION LABEL
    ==========================================
    */

    const translationLabel =
      document.createElement(
        "div"
      );

    translationLabel.className =
      "translation-label";

    translationLabel.textContent =
      "اردو ترجمہ";


    /*
    ==========================================
    URDU TRANSLATION
    ==========================================
    */

    const urdu =
      document.createElement(
        "div"
      );

    urdu.className =
      "urdu-text";

    urdu.textContent =
      ayah.urdu || "";


    /*
    ==========================================
    TAFSEER BUTTON
    ==========================================
    */

    const tafseerButton =
      document.createElement(
        "button"
      );

    tafseerButton.type =
      "button";

    tafseerButton.className =
      "tafseer-toggle";

    tafseerButton.textContent =
      "📚 تفسیر دیکھیں";


    /*
    ==========================================
    TAFSEER BOX
    ==========================================
    */

    const tafseer =
      document.createElement(
        "div"
      );

    tafseer.className =
      "tafseer-box hidden";


    /*
      Tafseer initially HIDDEN hai.
      User button dabayega tab hi
      Tafseer open hogi.
    */

    if (ayah.tafseer) {

      tafseer.innerHTML =
        ayah.tafseer;

    } else {

      tafseer.textContent =
        "اس آیت کی تفسیر ابھی دستیاب نہیں۔";

    }


    /*
    ==========================================
    TAFSEER OPEN / CLOSE
    ==========================================
    */

    tafseerButton.onclick =
      function() {

        const hidden =
          tafseer.classList.contains(
            "hidden"
          );


        if (hidden) {

          tafseer.classList.remove(
            "hidden"
          );

          tafseerButton.textContent =
            "📕 تفسیر چھپائیں";

        } else {

          tafseer.classList.add(
            "hidden"
          );

          tafseerButton.textContent =
            "📚 تفسیر دیکھیں";

        }

      };


    /*
    ==========================================
    AUDIO BUTTON
    ==========================================
    */

    const audioButton =
      document.createElement(
        "button"
      );

    audioButton.type =
      "button";

    audioButton.className =
      "audio-btn";

    audioButton.textContent =
      "▶ آیت سنیں";


    audioButton.onclick =
      function() {

        playAyah(
          ayah.audio,
          audioButton
        );

      };


    /*
    ==========================================
    ADD ELEMENTS
    ==========================================
    */

    card.appendChild(
      number
    );

    card.appendChild(
      arabic
    );

    card.appendChild(
      translationLabel
    );

    card.appendChild(
      urdu
    );

    card.appendChild(
      tafseerButton
    );

    card.appendChild(
      tafseer
    );

    card.appendChild(
      audioButton
    );


    container.appendChild(
      card
    );

  });

}


/*
==================================================
AUDIO SYSTEM
==================================================
*/

let currentAudio =
  null;

let currentButton =
  null;


function playAyah(
  url,
  button
) {

  if (!url) {

    alert(
      "اس آیت کی آواز دستیاب نہیں۔"
    );

    return;

  }


  /*
  Stop previous audio
  */

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.currentTime =
      0;

  }


  /*
  Reset previous button
  */

  if (currentButton) {

    currentButton.textContent =
      "▶ آیت سنیں";

    currentButton.classList.remove(
      "playing"
    );

  }


  /*
  New audio
  */

  currentAudio =
    new Audio(url);

  currentButton =
    button;


  button.textContent =
    "⏸ چل رہا ہے...";

  button.classList.add(
    "playing"
  );


  currentAudio.play().catch(
    function(error) {

      console.error(
        "Audio error:",
        error
      );

      button.textContent =
        "▶ آیت سنیں";

      button.classList.remove(
        "playing"
      );

    }
  );


  currentAudio.onended =
    function() {

      button.textContent =
        "▶ آیت سنیں";

      button.classList.remove(
        "playing"
      );

    };

}


/*
==================================================
BACK TO SURAH LIST
==================================================
*/

function backToSurahs() {

  if (currentAudio) {

    currentAudio.pause();

    currentAudio.currentTime =
      0;

  }


  if (currentButton) {

    currentButton.textContent =
      "▶ آیت سنیں";

    currentButton.classList.remove(
      "playing"
    );

  }


  openQuran();

}


/*
==================================================
READER MODE
==================================================
*/

function toggleReaderMode() {

  const mode =
    document.getElementById(
      "readerMode"
    );

  if (mode) {

    mode.classList.toggle(
      "hidden"
    );

  }

}


/*
==================================================
SAFE HTML TEXT
==================================================
*/

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


/*
==================================================
PAGE START
==================================================
*/

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "Quran Companion ready"
    );

    renderSurahs();

  }
);


/*
==================================================
MAKE FUNCTIONS AVAILABLE TO HTML
==================================================
*/

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

console.log(
  "Quran Companion JavaScript loaded successfully"
);
