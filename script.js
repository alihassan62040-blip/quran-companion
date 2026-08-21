"use strict";

/* ==============================
   GLOBAL DATA
============================== */

const API_QURAN =
  "https://api.alquran.cloud/v1";

const API_QURAN_COM =
  "https://api.quran.com/api/v4";

let surahs = [];
let verses = [];

let currentSurah = null;
let currentAyahIndex = 0;

let audio = new Audio();
audio.preload = "auto";

let translationId =
  localStorage.getItem("translationId") ||
  "ur.jalandhry";

let arabicFontSize =
  Number(localStorage.getItem("arabicFontSize")) ||
  32;

let tasbeeh =
  Number(localStorage.getItem("tasbeeh")) ||
  0;


/* ==============================
   INITIALIZE
============================== */

document.addEventListener("DOMContentLoaded", () => {

  updateTasbeeh();

  const font =
    document.getElementById("fontSize");

  if (font) {
    font.value = arabicFontSize;
  }

  const translation =
    document.getElementById("translationSelect");

  if (translation) {
    translation.value = translationId;
  }

  audio.addEventListener("ended", () => {
    nextAudio(true);
  });

  audio.addEventListener("timeupdate", updateAudioTime);

  audio.addEventListener("loadedmetadata", () => {
    updateAudioTime();
  });

  loadSurahs();

});


/* ==============================
   SCREEN SYSTEM
============================== */

function hideAllScreens(){

  [
    "home",
    "quran",
    "reader",
    "duas",
    "tasbeeh",
    "prayer",
    "qibla",
    "kaaba",
    "about"
  ].forEach(id => {

    const el =
      document.getElementById(id);

    if (el) {
      el.classList.add("hidden");
    }

  });

}


function goHome(){

  stopAudio();

  hideAllScreens();

  document
    .getElementById("home")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "Quran Companion";

}


function openQuran(){

  hideAllScreens();

  document
    .getElementById("quran")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "قرآن";

}


function backToSurahs(){

  stopAudio();

  hideAllScreens();

  document
    .getElementById("quran")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "قرآن";

}


function openDuas(){

  hideAllScreens();

  document
    .getElementById("duas")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "دعائیں";

  renderDuas();

}


function openTasbeeh(){

  hideAllScreens();

  document
    .getElementById("tasbeeh")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "تسبیح";

}


function openPrayer(){

  hideAllScreens();

  document
    .getElementById("prayer")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "نماز کے اوقات";

}


function openQibla(){

  hideAllScreens();

  document
    .getElementById("qibla")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "قبلہ";

}


function openKaaba(){

  hideAllScreens();

  document
    .getElementById("kaaba")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "خانہ کعبہ";

}


function openAbout(){

  hideAllScreens();

  document
    .getElementById("about")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "اسلامی معلومات";

}


function toggleSettings(){

  const settings =
    document.getElementById("settings");

  if (settings) {
    settings.classList.toggle("hidden");
  }

}


/* ==============================
   QURAN SURAH LIST
============================== */

async function loadSurahs(){

  const list =
    document.getElementById("surahList");

  try {

    const response =
      await fetch(
        `${API_QURAN}/surah`
      );

    if (!response.ok) {
      throw new Error("Surah API error");
    }

    const result =
      await response.json();

    surahs =
      result.data || [];

    renderSurahs(surahs);

  } catch (error) {

    console.error(error);

    list.innerHTML = `
      <div class="card">
        سورتیں لوڈ نہیں ہو سکیں۔
        <br><br>
        Internet چیک کریں اور دوبارہ کوشش کریں۔
      </div>
    `;

  }

}


function renderSurahs(data){

  const list =
    document.getElementById("surahList");

  if (!data.length) {

    list.innerHTML =
      `<div class="loading">کوئی سورت نہیں ملی</div>`;

    return;
  }

  list.innerHTML =
    data.map(surah => `

      <button
        class="surah"
        onclick="openSurah(${surah.number})">

        <div class="surah-number">
          ${surah.number}
        </div>

        <div class="surah-name">

          <strong>
            ${escapeHTML(surah.name)}
          </strong>

          <small>
            ${escapeHTML(surah.englishName)}
            — ${surah.numberOfAyahs} آیات
          </small>

        </div>

      </button>

    `).join("");

}


function filterSurahs(){

  const value =
    document
      .getElementById("surahSearch")
      .value
      .toLowerCase()
      .trim();

  const filtered =
    surahs.filter(s =>

      String(s.number).includes(value) ||

      String(s.name)
        .toLowerCase()
        .includes(value) ||

      String(s.englishName)
        .toLowerCase()
        .includes(value)

    );

  renderSurahs(filtered);

}


/* ==============================
   OPEN SURAH
============================== */

async function openSurah(number){

  hideAllScreens();

  document
    .getElementById("reader")
    .classList.remove("hidden");

  document
    .getElementById("headerTitle")
    .textContent =
    "قرآن";

  const container =
    document.getElementById("ayahContainer");

  container.innerHTML =
    `<div class="loading">
      قرآن لوڈ ہو رہا ہے...
    </div>`;

  try {

    const url =
      `${API_QURAN}/surah/${number}/editions/` +
      `quran-uthmani,${translationId}`;

    const response =
      await fetch(url);

    if (!response.ok) {
      throw new Error("Quran API error");
    }

    const result =
      await response.json();

    const arabic =
      result.data.find(
        x =>
          x.edition &&
          x.edition.identifier ===
          "quran-uthmani"
      );

    const translation =
      result.data.find(
        x =>
          x.edition &&
          x.edition.identifier ===
          translationId
      );

    if (!arabic) {
      throw new Error(
        "Arabic Quran data missing"
      );
    }

    currentSurah = number;

    verses =
      arabic.ayahs.map((ayah,index) => {

        return {

          number:
            ayah.numberInSurah,

          globalNumber:
            ayah.number,

          arabic:
            ayah.text,

          translation:
            translation &&
            translation.ayahs[index]
              ? translation.ayahs[index].text
              : "",

          audio:
            `https://cdn.islamic.network/` +
            `quran/audio/128/ar.alafasy/` +
            `${ayah.number}.mp3`,

          tafseer:null

        };

      });

    localStorage.setItem(
      "lastSurah",
      String(number)
    );

    const info =
      surahs.find(
        s => s.number === number
      );

    document
      .getElementById("readerTitle")
      .textContent =
      `📖 ${info ? info.name : "قرآن"}`;

    renderVerses();

    loadTafseer();

  } catch(error){

    console.error(error);

    container.innerHTML =
      `<div class="card">
        قرآن لوڈ نہیں ہو سکا۔
        <br><br>
        Internet connection چیک کریں۔
      </div>`;

  }

}


/* ==============================
   RENDER AYAT
============================== */

function renderVerses(){

  const container =
    document.getElementById(
      "ayahContainer"
    );

  container.innerHTML =
    verses.map((v,index) => `

      <article
        class="ayah"
        id="ayah-${index}">

        <div class="ayah-top">

          <div class="ayah-number">
            ${v.number}
          </div>

          <button
            class="btn"
            onclick="playAyah(${index})">
            🔊 سنیں
          </button>

        </div>

        <div
          class="arabic"
          style="font-size:${arabicFontSize}px">

          ${escapeHTML(v.arabic)}

        </div>

        <div class="translation">

          <div class="translation-title">
            اردو ترجمہ
          </div>

          ${escapeHTML(v.translation)}

        </div>

        <button
          class="tafseer-btn"
          onclick="toggleTafseer(${index})">

          📚 تفسیر دکھائیں

        </button>

        <div
          id="tafseer-${index}"
          class="tafseer hidden">

          تفسیر لوڈ ہو رہی ہے...

        </div>

      </article>

    `).join("");

}


/* ==============================
   TAFSEER
============================== */

async function loadTafseer(){

  for(let i=0;i<verses.length;i++){

    try{

      const globalNumber =
        verses[i].globalNumber;

      const resourceResponse =
        await fetch(
          `${API_QURAN_COM}/resources/tafsirs`
        );

      if(!resourceResponse.ok){
        continue;
      }

      const resourceResult =
        await resourceResponse.json();

      const list =
        resourceResult.tafsirs || [];

      let resource =
        list.find(t => {

          const language =
            String(
              t.language_name ||
              t.language ||
              ""
            ).toLowerCase();

          return language.includes("urdu");

        });

      if(!resource){

        resource =
          list.find(t =>
            String(t.name || "")
              .toLowerCase()
              .includes("ibn kathir")
          );

      }

      if(!resource){
        continue;
      }

      const response =
        await fetch(
          `${API_QURAN_COM}/tafsirs/` +
          `${resource.id}/by_ayah/` +
          `${globalNumber}`
        );

      if(!response.ok){
        continue;
      }

      const result =
        await response.json();

      const t =
        result.tafsir ||
        result.data ||
        null;

      let text = "";

      if(typeof t === "string"){
        text = t;
      }else if(t && typeof t.text === "string"){
        text = t.text;
      }

      verses[i].tafseer =
        text || "تفسیر دستیاب نہیں۔";

    }catch(error){

      console.error(
        "Tafseer error:",
        error
      );

    }

  }

}


/* ==============================
   SHOW TAFSEER
============================== */

async function toggleTafseer(index){

  const box =
    document.getElementById(
      `tafseer-${index}`
    );

  if(!box) return;

  if(!box.classList.contains("hidden")){
    box.classList.add("hidden");
    return;
  }

  box.classList.remove("hidden");

  if(verses[index].tafseer){

    box.innerHTML =
      escapeHTML(
        verses[index].tafseer
      );

    return;

  }

  box.textContent =
    "تفسیر لوڈ ہو رہی ہے...";

  try{

    const resources =
      await fetch(
        `${API_QURAN_COM}/resources/tafsirs`
      );

    const result =
      await resources.json();

    const list =
      result.tafsirs || [];

    let resource =
      list.find(t =>
        String(
          t.language_name ||
          t.language ||
          ""
        ).toLowerCase()
        .includes("urdu")
      );

    if(!resource){

      resource =
        list.find(t =>
          String(t.name || "")
            .toLowerCase()
            .includes("ibn kathir")
        );

    }

    if(!resource){
      box.textContent =
        "تفسیر دستیاب نہیں۔";
      return;
    }

    const response =
      await fetch(
        `${API_QURAN_COM}/tafsirs/` +
        `${resource.id}/by_ayah/` +
        `${verses[index].globalNumber}`
      );

    const data =
      await response.json();

    const t =
      data.tafsir ||
      data.data ||
      null;

    let text = "";

    if(typeof t === "string"){
      text = t;
    }else if(t && typeof t.text === "string"){
      text = t.text;
    }

    verses[index].tafseer =
      text || "تفسیر دستیاب نہیں۔";

    box.innerHTML =
      escapeHTML(
        verses[index].tafseer
      );

  }catch(error){

    console.error(error);

    box.textContent =
      "تفسیر لوڈ نہیں ہو سکی۔";

  }

}


/* ==============================
   AUDIO
============================== */

function playAyah(index){

  if(!verses[index]) return;

  currentAyahIndex = index;

  const verse =
    verses[index];

  audio.src =
    verse.audio;

  audio.currentTime = 0;

  document
    .getElementById("audioPlayer")
    .classList.remove("hidden");

  document
    .getElementById("audioTitle")
    .textContent =
    `سورت — آیت ${verse.number}`;

  highlightAyah(index);

  audio.play()
    .then(() => {

      document
        .getElementById("mainPlay")
        .textContent =
        "⏸️";

    })
    .catch(error => {

      console.error(
        "Audio play error:",
        error
      );

      showMessage(
        "Audio چلانے میں مسئلہ آیا۔ دوبارہ Play دبائیں۔"
      );

    });

}


function toggleMainAudio(){

  if(!audio.src){

    playAyah(0);

    return;
  }

  if(audio.paused){

    audio.play()
      .then(() => {

        document
          .getElementById("mainPlay")
          .textContent =
          "⏸️";

      })
      .catch(() => {

        showMessage(
          "Audio چل نہیں رہی۔"
        );

      });

  }else{

    audio.pause();

    document
      .getElementById("mainPlay")
      .textContent =
      "▶️";

  }

}


function nextAudio(auto=false){

  if(!verses.length) return;

  if(currentAyahIndex <
     verses.length - 1){

    playAyah(
      currentAyahIndex + 1
    );

  }else{

    document
      .getElementById("mainPlay")
      .textContent =
      "▶️";

    if(auto){

      showMessage(
        "اس سورت کی تلاوت مکمل ہو گئی۔"
      );

    }

  }

}


function previousAudio(){

  if(!verses.length) return;

  if(currentAyahIndex > 0){

    playAyah(
      currentAyahIndex - 1
    );

  }

}


function stopAudio(){

  audio.pause();

  audio.currentTime = 0;

  document
    .getElementById("audioPlayer")
    ?.classList.add("hidden");

  document
    .getElementById("mainPlay")
    ?.textContent =
    "▶️";

}


function highlightAyah(index){

  document
    .querySelectorAll(".ayah")
    .forEach(el =>
      el.classList.remove("current")
    );

  const el =
    document.getElementById(
      `ayah-${index}`
    );

  if(el){

    el.classList.add("current");

    el.scrollIntoView({
      behavior:"smooth",
      block:"center"
    });

  }

}


function updateAudioTime(){

  if(!audio.duration) return;

  const progress =
    document.getElementById(
      "audioProgress"
    );

  progress.value =
    (audio.currentTime /
      audio.duration) * 100;

  document
    .getElementById("currentTime")
    .textContent =
    formatTime(
      audio.currentTime
    );

  document
    .getElementById("totalTime")
    .textContent =
    formatTime(
      audio.duration
    );

}


function seekAudio(value){

  if(!audio.duration) return;

  audio.currentTime =
    (Number(value) / 100) *
    audio.duration;

}


function formatTime(seconds){

  if(!Number.isFinite(seconds)){
    return "0:00";
  }

  const min =
    Math.floor(seconds / 60);

  const sec =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2,"0");

  return `${min}:${sec}`;

}


/* ==============================
   CONTINUE READING
============================== */

function continueReading(){

  const last =
    Number(
      localStorage.getItem(
        "lastSurah"
      )
    );

  if(last >= 1 && last <= 114){

    openSurah(last);

  }else{

    openQuran();

  }

}


/* ==============================
   SETTINGS
============================== */

function changeArabicSize(value){

  arabicFontSize =
    Number(value);

  localStorage.setItem(
    "arabicFontSize",
    arabicFontSize
  );

  document
    .querySelectorAll(".arabic")
    .forEach(el => {

      el.style.fontSize =
        `${arabicFontSize}px`;

    });

}


async function changeTranslation(value){

  translationId = value;

  localStorage.setItem(
    "translationId",
    value
  );

  if(currentSurah){

    stopAudio();

    await openSurah(
      currentSurah
    );

  }

}


/* ==============================
   TASBEEH
============================== */

function updateTasbeeh(){

  const el =
    document.getElementById(
      "tasbeehCount"
    );

  if(el){
    el.textContent =
      tasbeeh;
  }

}


function countTasbeeh(){

  tasbeeh++;

  localStorage.setItem(
    "tasbeeh",
    tasbeeh
  );

  updateTasbeeh();

}


function resetTasbeeh(){

  tasbeeh = 0;

  localStorage.setItem(
    "tasbeeh",
    "0"
  );

  updateTasbeeh();

}


/* ==============================
   DUAS
============================== */

const duas = [

 {
  title:"سفر کی دعا",
  arabic:"سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
  urdu:"پاک ہے وہ ذات جس نے اسے ہمارے لیے مسخر کیا، ورنہ ہم اسے قابو میں نہ لا سکتے۔"
 },

 {
  title:"کھانے سے پہلے",
  arabic:"بِسْمِ اللّٰهِ",
  urdu:"اللہ کے نام سے شروع کرتا ہوں۔"
 },

 {
  title:"والدین کے لیے",
  arabic:"رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
  urdu:"اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں مجھے پالا۔"
 },

 {
  title:"دنیا و آخرت کی بھلائی",
  arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
  urdu:"اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
 }

];


function renderDuas(){

  const list =
    document.getElementById(
      "duasList"
    );

  list.innerHTML =
    duas.map(d => `

      <div class="dua">

       <h3>
        🤲 ${escapeHTML(d.title)}
       </h3>

       <div class="arabic">
        ${escapeHTML(d.arabic)}
       </div>

       <div class="translation">
        ${escapeHTML(d.urdu)}
       </div>

      </div>

    `).join("");

}


/* ==============================
   PRAYER TIMES
============================== */

function loadPrayerTimes(){

  const output =
    document.getElementById(
      "prayerList"
    );

  if(!navigator.geolocation){

    output.textContent =
      "آپ کے براؤزر میں location دستیاب نہیں۔";

    return;

  }

  output.innerHTML =
    "📍 مقام معلوم کیا جا رہا ہے...";

  navigator.geolocation.getCurrentPosition(

    async position => {

      const lat =
        position.coords.latitude;

      const lon =
        position.coords.longitude;

      try{

        const today =
          new Date();

        const date =
          `${today.getDate()}-` +
          `${today.getMonth()+1}-` +
          `${today.getFullYear()}`;

        const url =
          `https://api.aladhan.com/v1/timings/` +
          `${date}?latitude=${lat}` +
          `&longitude=${lon}` +
          `&method=1`;

        const response =
          await fetch(url);

        const result =
          await response.json();

        if(
          !result.data ||
          !result.data.timings
        ){

          throw new Error(
            "Prayer API error"
          );

        }

        const t =
          result.data.timings;

        const names = [

          ["Fajr","فجر"],
          ["Sunrise","طلوع آفتاب"],
          ["Dhuhr","ظہر"],
          ["Asr","عصر"],
          ["Maghrib","مغرب"],
          ["Isha","عشاء"]

        ];

        output.innerHTML =
          names.map(item => `

            <div class="prayer">

              <strong>
                ${item[1]}
              </strong>

              <span>
                ${t[item[0]]}
              </span>

            </div>

          `).join("");

      }catch(error){

        console.error(error);

        output.innerHTML =
          "نماز کے اوقات حاصل نہیں ہو سکے۔";

      }

    },

    () => {

      output.innerHTML =
        "Location کی اجازت ضروری ہے۔";

    }

  );

}


/* ==============================
   QIBLA
============================== */

function findQibla(){

  const text =
    document.getElementById(
      "qiblaText"
    );

  if(!navigator.geolocation){

    text.textContent =
      "Location دستیاب نہیں۔";

    return;

  }

  text.textContent =
    "📍 مقام معلوم کیا جا رہا ہے...";

  navigator.geolocation.getCurrentPosition(

    async position => {

      const lat =
        position.coords.latitude;

      const lon =
        position.coords.longitude;

      try{

        const url =
          `https://api.aladhan.com/v1/qibla/` +
          `${lat}/${lon}`;

        const response =
          await fetch(url);

        const result =
          await response.json();

        const direction =
          result.data.direction;

        document
          .getElementById("compass")
          .style.transform =
          `rotate(${direction}deg)`;

        text.innerHTML =
          `🕋 قبلہ کی سمت تقریباً <strong>${direction.toFixed(1)}°</strong> ہے۔`;

      }catch(error){

        console.error(error);

        text.textContent =
          "قبلہ کی سمت حاصل نہیں ہو سکی۔";

      }

    },

    () => {

      text.textContent =
        "Location کی اجازت دیں تاکہ قبلہ معلوم ہو سکے۔";

    }

  );

}


/* ==============================
   HELPERS
============================== */

function showMessage(text){

  const old =
    document.querySelector(
      ".message"
    );

  if(old) old.remove();

  const box =
    document.createElement(
      "div"
    );

  box.className =
    "message";

  box.textContent =
    text;

  document.body.appendChild(box);

  setTimeout(() => {

    box.remove();

  },3500);

}


function escapeHTML(value){

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}
