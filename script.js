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
/* =========================================================
   QURAN COMPANION — EXTRA FEATURES PACK
   Prayer + Kaaba + Duas + Tasbeeh + Universe + Creatures
   Quran reader کو disturb نہیں کرتا
========================================================= */

(function () {
  "use strict";

  console.log("Quran Companion Extra Features loaded");

  /* =========================================================
     EXTRA CSS
  ========================================================= */

  const extraStyle = document.createElement("style");

  extraStyle.textContent = `
    .feature-grid{
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:12px;
      margin-top:15px;
    }

    .feature-card{
      background:#0d281f;
      border:1px solid #1d4938;
      border-radius:18px;
      padding:18px;
      margin-bottom:14px;
    }

    .feature-card h2,
    .feature-card h3{
      margin-top:0;
    }

    .feature-button{
      width:100%;
      background:#12382a;
      color:white;
      border:1px solid #315b49;
      border-radius:13px;
      padding:12px;
      margin-top:8px;
    }

    .feature-button.primary{
      background:#216c4d;
    }

    .prayer-grid{
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:10px;
      margin-top:15px;
    }

    .prayer-time{
      background:#102f25;
      border:1px solid #285440;
      border-radius:14px;
      padding:15px;
      text-align:center;
    }

    .prayer-time strong{
      display:block;
      font-size:18px;
      margin-bottom:7px;
    }

    .prayer-time span{
      font-size:22px;
      color:#8fd0ac;
    }

    .kaaba-box{
      text-align:center;
      overflow:hidden;
    }

    .kaaba-box img{
      width:100%;
      max-height:320px;
      object-fit:cover;
      border-radius:16px;
      margin-bottom:15px;
    }

    .dua-card{
      background:#0c251d;
      border:1px solid #1d4938;
      border-radius:18px;
      padding:18px;
      margin-bottom:14px;
    }

    .dua-arabic{
      font-size:25px;
      line-height:2.2;
      margin-bottom:12px;
    }

    .dua-urdu{
      color:#d4e4dc;
      line-height:2;
    }

    .tasbeeh-big{
      text-align:center;
      font-size:70px;
      color:#8fd0ac;
      margin:25px 0;
    }

    .zikr-text{
      text-align:center;
      font-size:28px;
      margin:15px 0;
    }

    .info-list{
      line-height:2.1;
      color:#d2e0d9;
    }

    .feature-back{
      margin-bottom:12px;
    }

    @media(max-width:600px){
      .feature-grid{
        grid-template-columns:repeat(2,1fr);
      }

      .prayer-grid{
        grid-template-columns:repeat(2,1fr);
      }
    }
  `;

  document.head.appendChild(extraStyle);


  /* =========================================================
     CREATE MISSING SCREENS
  ========================================================= */

  function createScreen(id, title) {

    if (document.getElementById(id)) {
      return document.getElementById(id);
    }

    const main = document.querySelector("main");

    if (!main) {
      console.error("Main element not found");
      return null;
    }

    const section = document.createElement("section");

    section.id = id;
    section.className = "hidden";

    section.innerHTML = `
      <div class="reader-top">
        <button
          class="header-btn feature-back"
          type="button"
          onclick="goHome()">
          ← واپس
        </button>

        <h2>${title}</h2>

        <div></div>
      </div>

      <div id="${id}Content"></div>
    `;

    main.appendChild(section);

    return section;
  }


  /* =========================================================
     CREATE ALL EXTRA SCREENS
  ========================================================= */

  createScreen("prayerScreen", "🕌 نماز");

  createScreen("kaabaScreen", "🕋 خانہ کعبہ");

  createScreen("duasScreen", "🤲 دعائیں");

  createScreen("tasbeehScreen", "📿 تسبیح");

  createScreen("universeScreen", "🌌 کائنات");

  createScreen("creaturesScreen", "🐾 جاندار");

  createScreen("historyScreen", "📚 اسلامی معلومات");

  createScreen("aiScreen", "🤖 Quran Companion");


  /* =========================================================
     SAFE SCREEN OPEN
  ========================================================= */

  window.openExtraScreen = function (id) {

    if (typeof hideAllScreens === "function") {
      hideAllScreens();
    } else {
      document
        .querySelectorAll("main section")
        .forEach(function (s) {
          s.classList.add("hidden");
        });
    }

    const screen = document.getElementById(id);

    if (screen) {
      screen.classList.remove("hidden");
    }
  };


  /* =========================================================
     PRAYER
  ========================================================= */

  window.openPrayer = function () {

    openExtraScreen("prayerScreen");

    renderPrayerInfo();

    loadPrayerTimes();
  };


  function renderPrayerInfo() {

    const box =
      document.getElementById("prayerScreenContent");

    if (!box) return;

    box.innerHTML = `
      <div class="feature-card">

        <h2>🕌 نماز</h2>

        <p>
          نماز اسلام کے بنیادی ارکان میں سے ہے۔
          یہاں آج کے نماز کے اوقات بھی دکھائے جائیں گے۔
        </p>

        <button
          class="feature-button primary"
          type="button"
          onclick="loadPrayerTimes()">
          🔄 نماز کے اوقات تازہ کریں
        </button>

      </div>

      <div class="feature-card">

        <h3>نماز کے پانچ اوقات</h3>

        <div
          id="prayerTimes"
          class="prayer-grid">

          <div class="loading">
            نماز کے اوقات حاصل ہو رہے ہیں...
          </div>

        </div>

      </div>

      <div class="feature-card">

        <h3>📖 نماز کا مختصر طریقہ</h3>

        <div class="info-list">

          <p><strong>1۔ نیت:</strong>
          دل میں نماز کی نیت کریں۔</p>

          <p><strong>2۔ تکبیر:</strong>
          اللہ اکبر کہہ کر نماز شروع کریں۔</p>

          <p><strong>3۔ قیام:</strong>
          سورۃ الفاتحہ اور قرآن کی تلاوت کریں۔</p>

          <p><strong>4۔ رکوع:</strong>
          رکوع میں اللہ کی تسبیح بیان کریں۔</p>

          <p><strong>5۔ سجدہ:</strong>
          اللہ کے سامنے سجدہ کریں۔</p>

          <p><strong>6۔ قعدہ:</strong>
          تشہد اور درود پڑھیں۔</p>

          <p><strong>7۔ سلام:</strong>
          دائیں اور بائیں سلام پھیر کر نماز مکمل کریں۔</p>

        </div>

      </div>
    `;
  }


  window.loadPrayerTimes = async function () {

    const box =
      document.getElementById("prayerTimes");

    if (!box) return;

    box.innerHTML =
      `<div class="loading">
        نماز کے اوقات حاصل ہو رہے ہیں...
      </div>`;

    let latitude = 24.8607;
    let longitude = 67.0011;

    try {

      if (
        navigator.geolocation &&
        location.protocol === "https:"
      ) {

        const position =
          await new Promise(function(resolve, reject) {

            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy:false,
                timeout:8000,
                maximumAge:3600000
              }
            );

          });

        latitude =
          position.coords.latitude;

        longitude =
          position.coords.longitude;
      }

    } catch (error) {

      console.log(
        "Location unavailable, using default location."
      );

    }

    try {

      const today =
        new Date();

      const date =
        today.getDate();

      const month =
        today.getMonth() + 1;

      const year =
        today.getFullYear();

      const url =
        "https://api.aladhan.com/v1/timings/" +
        date + "-" +
        month + "-" +
        year +
        "?latitude=" +
        encodeURIComponent(latitude) +
        "&longitude=" +
        encodeURIComponent(longitude) +
        "&method=1";

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Prayer API error"
        );
      }

      const result =
        await response.json();

      const timings =
        result?.data?.timings;

      if (!timings) {
        throw new Error(
          "Prayer times unavailable"
        );
      }

      box.innerHTML = `

        <div class="prayer-time">
          <strong>فجر</strong>
          <span>${timings.Fajr}</span>
        </div>

        <div class="prayer-time">
          <strong>ظہر</strong>
          <span>${timings.Dhuhr}</span>
        </div>

        <div class="prayer-time">
          <strong>عصر</strong>
          <span>${timings.Asr}</span>
        </div>

        <div class="prayer-time">
          <strong>مغرب</strong>
          <span>${timings.Maghrib}</span>
        </div>

        <div class="prayer-time">
          <strong>عشاء</strong>
          <span>${timings.Isha}</span>
        </div>

      `;

    } catch (error) {

      console.error(
        "Prayer times error:",
        error
      );

      box.innerHTML = `
        <div class="feature-card">
          نماز کے اوقات اس وقت حاصل نہیں ہو سکے۔
          <br><br>
          انٹرنیٹ کنکشن چیک کرکے دوبارہ کوشش کریں۔
        </div>
      `;
    }
  };


  /* =========================================================
     KAABA
  ========================================================= */

  window.openKaaba = function () {

    openExtraScreen("kaabaScreen");

    const box =
      document.getElementById("kaabaScreenContent");

    if (!box) return;

    box.innerHTML = `

      <div class="feature-card kaaba-box">

        <h2>🕋 خانہ کعبہ</h2>

        <img
          src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80"
          alt="Khana Kaaba"
          loading="lazy"
        >

        <p class="info-list">
          خانہ کعبہ مسجد الحرام، مکہ مکرمہ میں واقع ہے۔
          مسلمان نماز میں اسی سمت یعنی قبلہ رخ ہو کر نماز ادا کرتے ہیں۔
        </p>

      </div>

      <div class="feature-card">

        <h3>🕋 اہم معلومات</h3>

        <div class="info-list">

          <p>
            <strong>مقام:</strong>
            مکہ مکرمہ، سعودی عرب
          </p>

          <p>
            <strong>مسجد:</strong>
            مسجد الحرام
          </p>

          <p>
            <strong>قبلہ:</strong>
            خانہ کعبہ
          </p>

          <p>
            حضرت ابراہیم علیہ السلام اور حضرت اسماعیل علیہ السلام
            نے اللہ کے حکم سے بیت اللہ کی تعمیر میں حصہ لیا۔
          </p>

        </div>

      </div>
    `;
  };


  /* =========================================================
     DUAS
  ========================================================= */

  const duas = [

    {
      title:"سونے کی دعا",
      arabic:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      urdu:"اے اللہ! میں تیرے ہی نام کے ساتھ مرتا اور جیتا ہوں۔"
    },

    {
      title:"جاگنے کی دعا",
      arabic:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      urdu:"تمام تعریف اللہ کے لیے ہے جس نے ہمیں موت کے بعد زندگی دی اور اسی کی طرف لوٹ کر جانا ہے۔"
    },

    {
      title:"کھانے سے پہلے",
      arabic:"بِسْمِ اللَّهِ",
      urdu:"اللہ کے نام سے۔"
    },

    {
      title:"کھانے کے بعد",
      arabic:"الْحَمْدُ لِلَّهِ",
      urdu:"تمام تعریف اللہ کے لیے ہے۔"
    },

    {
      title:"والدین کے لیے دعا",
      arabic:"رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      urdu:"اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں مجھے پالا۔"
    },

    {
      title:"دنیا و آخرت کی بھلائی",
      arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      urdu:"اے ہمارے رب! ہمیں دنیا میں بھلائی عطا فرما اور آخرت میں بھی بھلائی عطا فرما اور ہمیں آگ کے عذاب سے بچا۔"
    }

  ];


  window.openDuas = function () {

    openExtraScreen("duasScreen");

    const box =
      document.getElementById("duasScreenContent");

    if (!box) return;

    box.innerHTML = "";

    duas.forEach(function(dua) {

      const card =
        document.createElement("div");

      card.className =
        "dua-card";

      card.innerHTML = `

        <h3>${escapeExtra(dua.title)}</h3>

        <div class="dua-arabic">
          ${escapeExtra(dua.arabic)}
        </div>

        <div class="dua-urdu">
          ${escapeExtra(dua.urdu)}
        </div>

        <button
          class="feature-button"
          type="button"
          onclick="speakArabic(this.dataset.text)"
          data-text="${escapeAttribute(dua.arabic)}">

          🔊 دعا سنیں

        </button>

      `;

      box.appendChild(card);
    });
  };


  /* =========================================================
     TEXT TO SPEECH
  ========================================================= */

  window.speakArabic = function(text) {

    if (!("speechSynthesis" in window)) {

      alert(
        "آپ کے Chromebook کے browser میں Text-to-Speech دستیاب نہیں۔"
      );

      return;
    }

    speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.lang = "ar-SA";

    speech.rate = 0.8;

    speech.pitch = 1;

    speechSynthesis.speak(speech);
  };


  /* =========================================================
     TASBEEH
  ========================================================= */

  let tasbeehCount =
    Number(
      localStorage.getItem(
        "tasbeehCount"
      ) || 0
    );

  window.openTasbeeh = function () {

    openExtraScreen("tasbeehScreen");

    renderTasbeeh();
  };


  function renderTasbeeh() {

    const box =
      document.getElementById(
        "tasbeehScreenContent"
      );

    if (!box) return;

    box.innerHTML = `

      <div class="feature-card">

        <h2 style="text-align:center">
          📿 تسبیح
        </h2>

        <div class="zikr-text">
          سُبْحَانَ اللّٰهِ
        </div>

        <div
          class="tasbeeh-big"
          id="tasbeehNumber">
          ${tasbeehCount}
        </div>

        <button
          class="feature-button primary"
          type="button"
          onclick="countTasbeeh()">

          📿 ذکر کریں

        </button>

        <button
          class="feature-button"
          type="button"
          onclick="resetTasbeeh()">

          🔄 ری سیٹ

        </button>

      </div>

      <div class="feature-card">

        <h3>اذکار</h3>

        <p>
          سُبْحَانَ اللّٰهِ
        </p>

        <p>
          الْحَمْدُ لِلّٰهِ
        </p>

        <p>
          اللّٰهُ أَكْبَرُ
        </p>

        <p>
          لَا إِلٰهَ إِلَّا اللّٰهُ
        </p>

      </div>
    `;
  }


  window.countTasbeeh = function () {

    tasbeehCount++;

    localStorage.setItem(
      "tasbeehCount",
      String(tasbeehCount)
    );

    const number =
      document.getElementById(
        "tasbeehNumber"
      );

    if (number) {
      number.textContent =
        tasbeehCount;
    }
  };


  window.resetTasbeeh = function () {

    tasbeehCount = 0;

    localStorage.setItem(
      "tasbeehCount",
      "0"
    );

    renderTasbeeh();
  };


  /* =========================================================
     UNIVERSE
  ========================================================= */

  window.openUniverse = function () {

    openExtraScreen("universeScreen");

    const box =
      document.getElementById(
        "universeScreenContent"
      );

    if (!box) return;

    box.innerHTML = `

      <div class="feature-card">

        <h2>🌌 کائنات</h2>

        <p class="info-list">
          قرآن مجید انسان کو آسمانوں، زمین، سورج، چاند،
          ستاروں اور اللہ تعالیٰ کی قدرت میں غور و فکر کی دعوت دیتا ہے۔
        </p>

      </div>

      <div class="feature-grid">

        <div class="feature-card">
          <h3>☀️ سورج</h3>
          <p>سورج زمین پر روشنی اور حرارت کا بنیادی ذریعہ ہے۔</p>
        </div>

        <div class="feature-card">
          <h3>🌙 چاند</h3>
          <p>چاند کی منزلیں اسلامی مہینوں کے تعین میں اہم ہیں۔</p>
        </div>

        <div class="feature-card">
          <h3>⭐ ستارے</h3>
          <p>قرآن میں آسمان کی نشانیوں اور ستاروں کا ذکر ملتا ہے۔</p>
        </div>

        <div class="feature-card">
          <h3>🌍 زمین</h3>
          <p>زمین اللہ تعالیٰ کی عظیم نشانیوں میں سے ایک ہے۔</p>
        </div>

      </div>
    `;
  };


  /* =========================================================
     CREATURES
  ========================================================= */

  window.openCreatures = function () {

    openExtraScreen("creaturesScreen");

    const box =
      document.getElementById(
        "creaturesScreenContent"
      );

    if (!box) return;

    box.innerHTML = `

      <div class="feature-card">

        <h2>🐾 جاندار</h2>

        <p class="info-list">
          قرآن مجید میں مختلف جانداروں کا ذکر آیا ہے۔
          ان واقعات میں انسان کے لیے نصیحت اور غور و فکر کے پہلو موجود ہیں۔
        </p>

      </div>

      <div class="feature-grid">

        <div class="feature-card">
          <h3>🐜 چیونٹی</h3>
          <p>
            حضرت سلیمان علیہ السلام کے واقعے میں چیونٹیوں کا ذکر آتا ہے۔
          </p>
        </div>

        <div class="feature-card">
          <h3>🐝 شہد کی مکھی</h3>
          <p>
            سورۃ النحل میں شہد کی مکھی اور اس سے حاصل ہونے والی شہد کا ذکر ہے۔
          </p>
        </div>

        <div class="feature-card">
          <h3>🐦 پرندے</h3>
          <p>
            حضرت سلیمان علیہ السلام کے واقعے میں پرندوں کا ذکر ملتا ہے۔
          </p>
        </div>

        <div class="feature-card">
          <h3>🐪 اونٹ</h3>
          <p>
            قرآن میں اونٹ کی تخلیق اور اس میں غور و فکر کی طرف توجہ دلائی گئی ہے۔
          </p>
        </div>

      </div>
    `;
  };


  /* =========================================================
     HISTORY / ISLAMIC INFO
  ========================================================= */

  window.openHistory = function () {

    openExtraScreen("historyScreen");

    const box =
      document.getElementById(
        "historyScreenContent"
      );

    if (!box) return;

    box.innerHTML = `

      <div class="feature-card">

        <h2>📚 اسلامی معلومات</h2>

        <div class="info-list">

          <p>
            <strong>قرآن:</strong>
            قرآن مجید اللہ تعالیٰ کی آخری کتاب ہے۔
          </p>

          <p>
            <strong>سورتیں:</strong>
            قرآن مجید میں 114 سورتیں ہیں۔
          </p>

          <p>
            <strong>نماز:</strong>
            نماز مسلمان کی اہم عبادت ہے۔
          </p>

          <p>
            <strong>قبلہ:</strong>
            مسلمانوں کا قبلہ خانہ کعبہ ہے۔
          </p>

        </div>

      </div>
    `;
  };


  /* =========================================================
     AI SCREEN
  ========================================================= */

  window.openAI = function () {

    openExtraScreen("aiScreen");

    const box =
      document.getElementById(
        "aiScreenContent"
      );

    if (!box) return;

    box.innerHTML = `

      <div class="feature-card">

        <h2>🤖 Quran Companion</h2>

        <p class="info-list">
          یہ حصہ مستقبل میں قرآن سے متعلق سوالات،
          تلاش، موضوعات اور وضاحت کے لیے استعمال کیا جا سکتا ہے۔
        </p>

        <p>
          فی الحال قرآن، ترجمہ، تفسیر، تلاوت، دعائیں
          اور تسبیح استعمال کریں۔
        </p>

      </div>
    `;
  };


  /* =========================================================
     EXTRA ESCAPE FUNCTIONS
  ========================================================= */

  function escapeExtra(value) {

    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }


  function escapeAttribute(value) {

    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll('"',"&quot;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;");
  }


  /* =========================================================
     FIX HOME MENU IF OLD BUTTONS EXIST
  ========================================================= */

  function addExtraHomeButtons() {

    const home =
      document.getElementById(
        "homeScreen"
      );

    if (!home) return;

    if (
      document.getElementById(
        "extraHomeFeatures"
      )
    ) {
      return;
    }

    const grid =
      home.querySelector(".grid");

    if (!grid) return;

    const wrapper =
      document.createElement("div");

    wrapper.id =
      "extraHomeFeatures";

    wrapper.style.marginTop =
      "12px";

    wrapper.innerHTML = `

      <div class="feature-card">

        <h3 style="text-align:center">
          مزید اسلامی سہولیات
        </h3>

        <div class="grid">

          <button
            class="menu-btn"
            type="button"
            onclick="openPrayer()">

            <span>🕌</span>
            نماز

          </button>

          <button
            class="menu-btn"
            type="button"
            onclick="openKaaba()">

            <span>🕋</span>
            خانہ کعبہ

          </button>

          <button
            class="menu-btn"
            type="button"
            onclick="openUniverse()">

            <span>🌌</span>
            کائنات

          </button>

          <button
            class="menu-btn"
            type="button"
            onclick="openCreatures()">

            <span>🐾</span>
            جاندار

          </button>

          <button
            class="menu-btn"
            type="button"
            onclick="openHistory()">

            <span>📚</span>
            اسلامی معلومات

          </button>

          <button
            class="menu-btn"
            type="button"
            onclick="openAI()">

            <span>🤖</span>
            Companion

          </button>

        </div>

      </div>

    `;

    home.appendChild(wrapper);
  }


  /* =========================================================
     PATCH EXISTING TASBEEH BUTTON
  ========================================================= */

  function patchExistingButtons() {

    document
      .querySelectorAll(
        '[onclick="openPrayer()"]'
      )
      .forEach(function(button) {

        button.onclick =
          function() {
            openPrayer();
          };

      });

    document
      .querySelectorAll(
        '[onclick="openKaaba()"]'
      )
      .forEach(function(button) {

        button.onclick =
          function() {
            openKaaba();
          };

      });

    document
      .querySelectorAll(
        '[onclick="openDuas()"]'
      )
      .forEach(function(button) {

        button.onclick =
          function() {
            openDuas();
          };

      });

    document
      .querySelectorAll(
        '[onclick="openTasbeeh()"]'
      )
      .forEach(function(button) {

        button.onclick =
          function() {
            openTasbeeh();
          };

      });

  }


  /* =========================================================
     START EXTRA FEATURES
  ========================================================= */

  function startExtraFeatures() {

    addExtraHomeButtons();

    patchExistingButtons();

    console.log(
      "All extra Quran Companion features ready"
    );
  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      startExtraFeatures
    );

  } else {

    startExtraFeatures();

  }

})();
