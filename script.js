"use strict";

/* =========================================================
QURAN COMPANION — COMPLETE SCRIPT
Arabic + Urdu + Tafseer + Audio + Auto Next
========================================================= */

console.log("Quran Companion script loaded");

/* =========================================================
SUPABASE QURAN FUNCTION
========================================================= */

const QURAN_FUNCTION_URL =
"https://ejysbslxndujbnbejkqb.supabase.co/functions/v1/quran-data";

/* =========================================================
SURAH DATA
========================================================= */

const surahs = [

[1, "الفاتحة", "Al-Fatihah", 7],
[2, "البقرة", "Al-Baqarah", 286],
[3, "آل عمران", "Aal-Imran", 200],
[4, "النساء", "An-Nisa", 176],
[5, "المائدة", "Al-Maidah", 120],
[6, "الأنعام", "Al-Anam", 165],
[7, "الأعراف", "Al-Araf", 206],
[8, "الأنفال", "Al-Anfal", 75],
[9, "التوبة", "At-Tawbah", 129],
[10, "يونس", "Yunus", 109],
[11, "هود", "Hud", 123],
[12, "يوسف", "Yusuf", 111],
[13, "الرعد", "Ar-Rad", 43],
[14, "إبراهيم", "Ibrahim", 52],
[15, "الحجر", "Al-Hijr", 99],
[16, "النحل", "An-Nahl", 128],
[17, "الإسراء", "Al-Isra", 111],
[18, "الكهف", "Al-Kahf", 110],
[19, "مريم", "Maryam", 98],
[20, "طه", "Ta-Ha", 135],
[21, "الأنبياء", "Al-Anbiya", 112],
[22, "الحج", "Al-Hajj", 78],
[23, "المؤمنون", "Al-Muminun", 118],
[24, "النور", "An-Nur", 64],
[25, "الفرقان", "Al-Furqan", 77],
[26, "الشعراء", "Ash-Shuara", 227],
[27, "النمل", "An-Naml", 93],
[28, "القصص", "Al-Qasas", 88],
[29, "العنكبوت", "Al-Ankabut", 69],
[30, "الروم", "Ar-Rum", 60],
[31, "لقمان", "Luqman", 34],
[32, "السجدة", "As-Sajdah", 30],
[33, "الأحزاب", "Al-Ahzab", 73],
[34, "سبأ", "Saba", 54],
[35, "فاطر", "Fatir", 45],
[36, "يس", "Ya-Sin", 83],
[37, "الصافات", "As-Saffat", 182],
[38, "ص", "Sad", 88],
[39, "الزمر", "Az-Zumar", 75],
[40, "غافر", "Ghafir", 85],
[41, "فصلت", "Fussilat", 54],
[42, "الشورى", "Ash-Shura", 53],
[43, "الزخرف", "Az-Zukhruf", 89],
[44, "الدخان", "Ad-Dukhan", 59],
[45, "الجاثية", "Al-Jathiyah", 37],
[46, "الأحقاف", "Al-Ahqaf", 35],
[47, "محمد", "Muhammad", 38],
[48, "الفتح", "Al-Fath", 29],
[49, "الحجرات", "Al-Hujurat", 18],
[50, "ق", "Qaf", 45],
[51, "الذاريات", "Adh-Dhariyat", 60],
[52, "الطور", "At-Tur", 49],
[53, "النجم", "An-Najm", 62],
[54, "القمر", "Al-Qamar", 55],
[55, "الرحمن", "Ar-Rahman", 78],
[56, "الواقعة", "Al-Waqiah", 96],
[57, "الحديد", "Al-Hadid", 29],
[58, "المجادلة", "Al-Mujadilah", 22],
[59, "الحشر", "Al-Hashr", 24],
[60, "الممتحنة", "Al-Mumtahanah", 13],
[61, "الصف", "As-Saff", 14],
[62, "الجمعة", "Al-Jumuah", 11],
[63, "المنافقون", "Al-Munafiqun", 11],
[64, "التغابن", "At-Taghabun", 18],
[65, "الطلاق", "At-Talaq", 12],
[66, "التحريم", "At-Tahrim", 12],
[67, "الملك", "Al-Mulk", 30],
[68, "القلم", "Al-Qalam", 52],
[69, "الحاقة", "Al-Haqqah", 52],
[70, "المعارج", "Al-Maarij", 44],
[71, "نوح", "Nuh", 28],
[72, "الجن", "Al-Jinn", 28],
[73, "المزمل", "Al-Muzzammil", 20],
[74, "المدثر", "Al-Muddaththir", 56],
[75, "القيامة", "Al-Qiyamah", 40],
[76, "الإنسان", "Al-Insan", 31],
[77, "المرسلات", "Al-Mursalat", 50],
[78, "النبأ", "An-Naba", 40],
[79, "النازعات", "An-Naziat", 46],
[80, "عبس", "Abasa", 42],
[81, "التكوير", "At-Takwir", 29],
[82, "الانفطار", "Al-Infitar", 19],
[83, "المطففين", "Al-Mutaffifin", 36],
[84, "الانشقاق", "Al-Inshiqaq", 25],
[85, "البروج", "Al-Buruj", 22],
[86, "الطارق", "At-Tariq", 17],
[87, "الأعلى", "Al-Ala", 19],
[88, "الغاشية", "Al-Ghashiyah", 26],
[89, "الفجر", "Al-Fajr", 30],
[90, "البلد", "Al-Balad", 20],
[91, "الشمس", "Ash-Shams", 15],
[92, "الليل", "Al-Layl", 21],
[93, "الضحى", "Ad-Duha", 11],
[94, "الشرح", "Ash-Sharh", 8],
[95, "التين", "At-Tin", 8],
[96, "العلق", "Al-Alaq", 19],
[97, "القدر", "Al-Qadr", 5],
[98, "البينة", "Al-Bayyinah", 8],
[99, "الزلزلة", "Az-Zalzalah", 8],
[100, "العاديات", "Al-Adiyat", 11],
[101, "القارعة", "Al-Qariah", 11],
[102, "التكاثر", "At-Takathur", 8],
[103, "العصر", "Al-Asr", 3],
[104, "الهمزة", "Al-Humazah", 9],
[105, "الفيل", "Al-Fil", 5],
[106, "قريش", "Quraysh", 4],
[107, "الماعون", "Al-Maun", 7],
[108, "الكوثر", "Al-Kawthar", 3],
[109, "الكافرون", "Al-Kafirun", 6],
[110, "النصر", "An-Nasr", 3],
[111, "المسد", "Al-Masad", 5],
[112, "الإخلاص", "Al-Ikhlas", 4],
[113, "الفلق", "Al-Falaq", 5],
[114, "الناس", "An-Nas", 6]

];

/* =========================================================
GLOBAL STATE
========================================================= */

let currentAudio = null;
let currentSurahNumber = null;
let currentVerses = [];
let currentAudioIndex = -1;
let currentAudioButton = null;

/* =========================================================
SCREEN CONTROL
========================================================= */

function hideAllScreens() {

document
.querySelectorAll("#homeScreen, .app-screen, main > section")
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

setHeaderTitle("Quran Companion");

}

/* =========================================================
HEADER
========================================================= */

function setHeaderTitle(text) {

const title =
document.getElementById("headerTitle");

if (title) {
title.textContent = text;
}

}

/* =========================================================
QURAN HOME
========================================================= */

function openQuran() {

openScreen("quranScreen");

setHeaderTitle("قرآن");

renderSurahs();

}

function continueReading() {

const saved =
Number(localStorage.getItem("lastSurah"));

if (
saved >= 1 &&
saved <= 114
) {

openSurah(saved);

} else {

openQuran();

}

}

/* =========================================================
SURAH LIST
========================================================= */

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
    <strong>${escapeHTML(surah[1])}</strong>
    <small>${escapeHTML(surah[2])} — ${surah[3]} آیات</small>
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
document.getElementById("surahSearch");

if (!input) return;

const value =
input.value
.trim()
.toLowerCase();

if (!value) {

renderSurahs();

return;

}

const filtered =
surahs.filter(function(surah) {

  return (
    String(surah[0]).includes(value) ||
    surah[1].includes(value) ||
    surah[2].toLowerCase().includes(value)
  );

});

renderSurahs(filtered);

}

/* =========================================================
OPEN SURAH
========================================================= */

async function openSurah(number) {

number = Number(number);

if (
!Number.isInteger(number) ||
number < 1 ||
number > 114
) {
return;
}

stopAudio();

currentSurahNumber = number;
currentVerses = [];
currentAudioIndex = -1;

openScreen("readerScreen");

const surah =
surahs.find(function(item) {
return item[0] === number;
});

if (surah) {

setHeaderTitle(surah[1]);

const readerTitle =
  document.getElementById("readerTitle");

if (readerTitle) {
  readerTitle.textContent =
    "📖 " + surah[1];
}

}

const container =
document.getElementById("ayahContainer");

const loading =
document.createElement("div");

loading.className = "loading";
loading.textContent =
"قرآن، ترجمہ اور تفسیر لوڈ ہو رہی ہے...";

if (container) {
container.innerHTML = "";
container.appendChild(loading);
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
        onclick="openSurah(${number})"
      >
        دوبارہ کوشش کریں
      </button>

    </div>

  `;

}

}

}

/* =========================================================
RENDER AYAT
========================================================= */

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


const audioButton =
  document.createElement("button");

audioButton.type =
  "button";

audioButton.textContent =
  "🔊";

audioButton.title =
  "آیت سنیں";

audioButton.addEventListener(
  "click",
  function() {

    playVerse(
      index,
      audioButton
    );

  }
);


actions.appendChild(
  audioButton
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

arabic.textContent =
  ayah.arabic || "";


/* URDU */

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
  ayah.urdu || "ترجمہ دستیاب نہیں";


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
  "📚 تفسیر دکھائیں";


/* TAFSEER BOX */

const tafseerBox =
  document.createElement("div");

tafseerBox.className =
  "tafseer hidden";

const tafseerText =
  cleanTafseer(
    ayah.tafseer
  );

const source =
  ayah.tafseerSource ||
  "Verified Tafseer source";

if (tafseerText) {

  tafseerBox.innerHTML = `
    <div>
      ${tafseerText}
    </div>

    <div style="
      margin-top:12px;
      font-size:12px;
      color:#83c7a3;
    ">
      ماخذ: ${escapeHTML(source)}
    </div>
  `;

} else {

  tafseerBox.innerHTML = `
    <div>
      تفسیر ابھی دستیاب نہیں۔
    </div>

    <div style="
      margin-top:12px;
      font-size:12px;
      color:#83c7a3;
    ">
      Verified Tafseer source
    </div>
  `;

}


tafseerButton.addEventListener(
  "click",
  function() {

    const hidden =
      tafseerBox.classList.contains(
        "hidden"
      );

    if (hidden) {

      tafseerBox.classList.remove(
        "hidden"
      );

      tafseerButton.textContent =
        "📚 تفسیر چھپائیں";

    } else {

      tafseerBox.classList.add(
        "hidden"
      );

      tafseerButton.textContent =
        "📚 تفسیر دکھائیں";

    }

  }
);


/* APPEND */

card.appendChild(top);
card.appendChild(arabic);
card.appendChild(translation);
card.appendChild(tafseerButton);
card.appendChild(tafseerBox);

container.appendChild(card);

});

}

/* =========================================================
TAFSEER CLEANER
========================================================= */

function cleanTafseer(value) {

if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}

let text =
String(value);

/*
API kabhi <p>...</p>
HTML format mein tafseer deta hai.
*/

text =
text
.replace(/<br\s*/?>/gi, "\n")
.replace(/</p>/gi, "\n")
.replace(/<p[^>]>/gi, "")
.replace(/<[^>]>/g, "");

/*
HTML entities
*/

const textarea =
document.createElement("textarea");

textarea.innerHTML =
text;

text =
textarea.value;

return escapeHTML(
text.trim()
).replace(
/\n/g,
"<br>"
);

}

/* =========================================================
AUDIO PLAYER
========================================================= */

function showAudioPlayer(
index
) {

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
  (index + 1);

}

}

function hideAudioPlayer() {

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

/* =========================================================
PLAY VERSE
========================================================= */

function playVerse(
index,
button
) {

if (
!currentVerses[index]
) {
return;
}

const verse =
currentVerses[index];

if (!verse.audio) {

showMessage(
  "اس آیت کی آواز دستیاب نہیں۔"
);

return;

}

currentAudioIndex =
index;

currentAudioButton =
button;

if (currentAudio) {

currentAudio.pause();

currentAudio.currentTime =
  0;

}

currentAudio =
new Audio(
verse.audio
);

currentAudio.preload =
"auto";

showAudioPlayer(
index
);

updateCurrentAyah(
index
);

updatePlayButton(
true
);

currentAudio.addEventListener(
"loadedmetadata",
function() {

  updateAudioTime();

}

);

currentAudio.addEventListener(
"timeupdate",
function() {

  updateAudioTime();

}

);

currentAudio.addEventListener(
"ended",
function() {

  updatePlayButton(
    false
  );

  autoNextAyah();

}

);

currentAudio.addEventListener(
"error",
function() {

  console.error(
    "Audio failed:",
    verse.audio
  );

  updatePlayButton(
    false
  );

  showMessage(
    "آڈیو چلانے میں مسئلہ آیا۔ دوبارہ کوشش کریں۔"
  );

}

);

currentAudio.play()
.then(function() {

  updatePlayButton(
    true
  );

})
.catch(function(error) {

  console.error(
    "Audio play error:",
    error
  );

  updatePlayButton(
    false
  );

  showMessage(
    "آڈیو چلانے میں مسئلہ آیا۔ Play دوبارہ دبائیں۔"
  );

});

}

/* =========================================================
AUTO NEXT
========================================================= */

function autoNextAyah() {

const next =
currentAudioIndex + 1;

if (
next < currentVerses.length
) {

setTimeout(
  function() {

    playVerse(
      next,
      getAyahAudioButton(next)
    );

  },
  250
);

return;

}

/*
Current Surah complete.
*/

updateCurrentAyah(
-1
);

showMessage(
"سورت مکمل ہو گئی۔"
);

}

/* =========================================================
FIND AYAH AUDIO BUTTON
========================================================= */

function getAyahAudioButton(
index
) {

const card =
document.getElementById(
"ayah-" + index
);

if (!card) {
return null;
}

return card.querySelector(
".actions button"
);

}

/* =========================================================
MAIN PLAYER PLAY / PAUSE
========================================================= */

function toggleMainAudio() {

if (!currentAudio) {

if (
  currentVerses.length > 0
) {

  playVerse(
    0,
    getAyahAudioButton(0)
  );

}

return;

}

if (
currentAudio.paused
) {

currentAudio.play()
  .then(function() {

    updatePlayButton(
      true
    );

  })
  .catch(function() {

    showMessage(
      "آڈیو دوبارہ چل نہیں سکی۔"
    );

  });

} else {

currentAudio.pause();

updatePlayButton(
  false
);

}

}

/* =========================================================
PREVIOUS
========================================================= */

function previousAudio() {

if (
currentVerses.length === 0
) {
return;
}

let index =
currentAudioIndex - 1;

if (index < 0) {
index = 0;
}

playVerse(
index,
getAyahAudioButton(index)
);

}

/* =========================================================
NEXT
========================================================= */

function nextAudio() {

if (
currentVerses.length === 0
) {
return;
}

let index =
currentAudioIndex + 1;

if (
currentAudioIndex < 0
) {
index = 0;
}

if (
index >= currentVerses.length
) {

index =
  currentVerses.length - 1;

}

playVerse(
index,
getAyahAudioButton(index)
);

}

/* =========================================================
STOP AUDIO
========================================================= */

function stopAudio() {

if (currentAudio) {

currentAudio.pause();

currentAudio.currentTime =
  0;

currentAudio.src =
  "";

currentAudio =
  null;

}

currentAudioIndex =
-1;

currentAudioButton =
null;

updatePlayButton(
false
);

updateCurrentAyah(
-1
);

hideAudioPlayer();

}

/* =========================================================
UPDATE PLAY BUTTON
========================================================= */

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

/* =========================================================
AUDIO PROGRESS
========================================================= */

function updateAudioTime() {

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

const duration =
Number.isFinite(
currentAudio.duration
)
? currentAudio.duration
: 0;

const current =
currentAudio.currentTime || 0;

if (progress && duration > 0) {

progress.value =
  String(
    (current / duration) * 100
  );

}

if (currentTime) {

currentTime.textContent =
  formatTime(current);

}

if (totalTime) {

totalTime.textContent =
  formatTime(duration);

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

const percent =
Number(value) / 100;

currentAudio.currentTime =
currentAudio.duration *
percent;

}

/* =========================================================
FORMAT TIME
========================================================= */

function formatTime(seconds) {

if (
!Number.isFinite(seconds) ||
seconds < 0
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

/* =========================================================
HIGHLIGHT CURRENT AYAH
========================================================= */

function updateCurrentAyah(
index
) {

document
.querySelectorAll(".ayah-card.current")
.forEach(function(card) {

  card.classList.remove(
    "current"
  );

});

if (index < 0) {
return;
}

const card =
document.getElementById(
"ayah-" + index
);

if (!card) {
return;
}

card.classList.add(
"current"
);

card.scrollIntoView({
behavior: "smooth",
block: "center"
});

}

/* =========================================================
SETTINGS
========================================================= */

function toggleSettings() {

const settings =
document.getElementById(
"readerSettings"
);

if (!settings) {
return;
}

settings.classList.toggle(
"hidden"
);

}

function changeArabicSize(
value
) {

document
.querySelectorAll(".arabic")
.forEach(function(element) {

  element.style.fontSize =
    Number(value) + "px";

});

localStorage.setItem(
"arabicFontSize",
String(value)
);

}

/* =========================================================
TRANSLATION SELECT
========================================================= */

function changeTranslation(
value
) {

/*
Current Supabase function
Urdu translation return karti hai.
Isliye Urdu ko preserve karte hain.

English select ko future API
edition ke liye ready rakha gaya hai.

*/

if (
value === "ur.jalandhry"
) {

showMessage(
  "اردو ترجمہ منتخب ہے۔"
);

return;

}

if (
value === "en.sahih"
) {

showMessage(
  "English translation ke liye Quran function mein English edition add karni hogi."
);

}

}

/* =========================================================
BACK TO SURAHS
========================================================= */

function backToSurahs() {

stopAudio();

openQuran();

}

/* =========================================================
DUAS
========================================================= */

function openDuas() {

stopAudio();

openScreen(
"duasScreen"
);

setHeaderTitle(
"دعائیں"
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
  title: "سفر کی دعا",
  arabic:
    "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا",
  urdu:
    "پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کیا۔"
},

{
  title: "کھانے سے پہلے",
  arabic:
    "بِسْمِ اللّٰهِ",
  urdu:
    "اللہ کے نام سے۔"
},

{
  title: "والدین کے لیے",
  arabic:
    "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
  urdu:
    "اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں مجھے پالا۔"
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
    ${escapeHTML(dua.urdu)}
  </div>
`;

container.appendChild(card);

});

}

/* =========================================================
TASBEEH
========================================================= */

function openTasbeeh() {

stopAudio();

openScreen(
"tasbeehScreen"
);

setHeaderTitle(
"تسبیح"
);

updateTasbeeh();

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

updateTasbeeh();

}

function resetTasbeeh() {

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

if (!element) {
return;
}

element.textContent =
String(
Number(
localStorage.getItem(
"tasbeehCount"
)
) || 0
);

}

/* =========================================================
MESSAGE
========================================================= */

function showMessage(
text
) {

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

/* =========================================================
SAFE HTML
========================================================= */

function escapeHTML(
value
) {

if (
value === null ||
value === undefined
) {
return "";
}

return String(value)
.replace(
/&/g,
"&"
)
.replace(
/</g,
"<"
)
.replace(
/>/g,
">"
)
.replace(
/"/g,
"""
)
.replace(
/'/g,
"'"
);

}

/* =========================================================
GLOBAL FUNCTIONS
IMPORTANT:
HTML onclick ke liye window par expose
========================================================= */

window.openQuran =
openQuran;

window.openSurah =
openSurah;

window.goHome =
goHome;

window.continueReading =
continueReading;

window.filterSurahs =
filterSurahs;

window.backToSurahs =
backToSurahs;

window.toggleSettings =
toggleSettings;

window.changeArabicSize =
changeArabicSize;

window.changeTranslation =
changeTranslation;

window.openDuas =
openDuas;

window.openTasbeeh =
openTasbeeh;

window.countTasbeeh =
countTasbeeh;

window.resetTasbeeh =
resetTasbeeh;

window.previousAudio =
previousAudio;

window.nextAudio =
nextAudio;

window.toggleMainAudio =
toggleMainAudio;

window.seekAudio =
seekAudio;

/* =========================================================
STARTUP
========================================================= */

document.addEventListener(
"DOMContentLoaded",
function() {

console.log(
  "Quran Companion ready"
);

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

/*
  Home screen visible by default.
*/

hideAllScreens();

const home =
  document.getElementById(
    "homeScreen"
  );

if (home) {

  home.classList.remove(
    "hidden"
  );

}

}
);
