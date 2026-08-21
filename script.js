"use strict";

/* =========================================
   QURAN COMPANION
   Stable version
   ========================================= */

const QURAN_API = "https://api.alquran.cloud/v1";
const PRAYER_API = "https://api.aladhan.com/v1";

let surahs = [];
let currentSurah = 1;
let currentAyah = 1;
let currentAyahs = [];
let audioIndex = -1;
let currentTranslation = "ur.jalandhry";

const audio = new Audio();
audio.preload = "none";


/* =========================================
   SCREEN
   ========================================= */

function showScreen(id) {

  document.querySelectorAll(".screen").forEach(function(screen) {
    screen.classList.add("hidden");
  });

  const screen = document.getElementById(id);

  if (screen) {
    screen.classList.remove("hidden");
    window.scrollTo(0, 0);
  }
}


/* =========================================
   START
   ========================================= */

document.addEventListener("DOMContentLoaded", function() {

  bindEvents();

  loadSurahs();
  loadPrayerTimes();
  loadDuas();
  loadTasbeeh();

});


/* =========================================
   EVENTS
   ========================================= */

function bindEvents() {

  const events = {

    openQuranHome: openQuran,
    continueReading: continueReading,

    quranBack: goHome,
    searchButton: toggleSearch,

    backToSurahs: backToSurahs,
    readerSettingsButton: toggleReaderSettings,

    prayerBack: goHome,
    duasBack: goHome,
    tasbeehBack: goHome,

    navHome: goHome,
    navQuran: openQuran,
    navPrayer: openPrayer,
    navDuas: openDuas,
    navTasbeeh: openTasbeeh,

    tasbeehButton: countTasbeeh,
    resetTasbeeh: resetTasbeeh,

    previousAudio: previousAudio,
    mainPlay: toggleMainAudio,
    nextAudio: nextAudio,
    stopAudioButton: stopAudio
  };

  Object.keys(events).forEach(function(id) {

    const element =
      document.getElementById(id);

    if (element) {
      element.addEventListener(
        "click",
        events[id]
      );
    }

  });


  const search =
    document.getElementById("surahSearch");

  if (search) {
    search.addEventListener(
      "input",
      filterSurahs
    );
  }


  const arabicSize =
    document.getElementById("arabicSize");

  if (arabicSize) {
    arabicSize.addEventListener(
      "input",
      function() {
        changeArabicSize(this.value);
      }
    );
  }


  const translation =
    document.getElementById("translationSelect");

  if (translation) {
    translation.addEventListener(
      "change",
      function() {
        changeTranslation(this.value);
      }
    );
  }


  const progress =
    document.getElementById("audioProgress");

  if (progress) {
    progress.addEventListener(
      "input",
      function() {
        seekAudio(this.value);
      }
    );
  }

}


/* =========================================
   HOME
   ========================================= */

function goHome() {

  stopAudio();

  showScreen("homeScreen");

}


/* =========================================
   QURAN
   ========================================= */

function openQuran() {

  stopAudio();

  showScreen("quranScreen");

  if (!surahs.length) {
    loadSurahs();
  }

}


async function loadSurahs() {

  const list =
    document.getElementById("surahList");

  if (!list) return;

  list.innerHTML =
    '<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>';

  try {

    const response =
      await fetch(
        QURAN_API + "/surah",
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {
      throw new Error("Surah list failed");
    }

    const json =
      await response.json();

    if (
      !json ||
      !Array.isArray(json.data)
    ) {
      throw new Error("Invalid surah data");
    }

    surahs =
      json.data;

    renderSurahs(surahs);

  } catch (error) {

    console.error(error);

    list.innerHTML = `
      <div class="card">

        <h3>سورتیں لوڈ نہیں ہو سکیں</h3>

        <p>
          Internet connection چیک کریں۔
        </p>

        <button
          id="retrySurahs"
          class="primary-btn"
          type="button">
          دوبارہ کوشش کریں
        </button>

      </div>
    `;

    const retry =
      document.getElementById("retrySurahs");

    if (retry) {
      retry.addEventListener(
        "click",
        loadSurahs
      );
    }

  }

}


function renderSurahs(data) {

  const list =
    document.getElementById("surahList");

  if (!list) return;

  list.innerHTML = "";

  data.forEach(function(surah) {

    const button =
      document.createElement("button");

    button.type = "button";
    button.className = "surah-card";

    button.innerHTML = `
      <span class="surah-number">
        ${Number(surah.number)}
      </span>

      <span class="surah-name">

        <strong>
          ${escapeHTML(surah.name)}
        </strong>

        <small>
          ${escapeHTML(surah.englishName)}
          • ${Number(surah.numberOfAyahs)} آیات
        </small>

      </span>

      <span>←</span>
    `;

    button.addEventListener(
      "click",
      function() {

        openSurah(
          Number(surah.number)
        );

      }
    );

    list.appendChild(button);

  });

}


/* =========================================
   SEARCH
   ========================================= */

function toggleSearch() {

  const box =
    document.getElementById(
      "quranSearch"
    );

  if (box) {
    box.classList.toggle("hidden");
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

  if (!value) {
    renderSurahs(surahs);
    return;
  }

  const result =
    surahs.filter(function(surah) {

      return (

        String(surah.number)
          .includes(value)

        ||

        String(surah.name)
          .toLowerCase()
          .includes(value)

        ||

        String(surah.englishName)
          .toLowerCase()
          .includes(value)

      );

    });

  renderSurahs(result);

}


/* =========================================
   OPEN SURAH
   ========================================= */

async function openSurah(
  number,
  savedAyah = 1
) {

  const requestedSurah =
    Number(number);

  if (
    !Number.isInteger(requestedSurah) ||
    requestedSurah < 1 ||
    requestedSurah > 114
  ) {

    showMessage(
      "سورت نمبر درست نہیں ہے۔"
    );

    return;
  }

  currentSurah =
    requestedSurah;

  currentAyah =
    Number(savedAyah) || 1;

  showScreen("readerScreen");

  stopAudio();

  const title =
    document.getElementById(
      "readerTitle"
    );

  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (!container) {

    showMessage(
      "Reader میں ayahContainer موجود نہیں۔"
    );

    return;
  }

  const surah =
    surahs.find(function(item) {

      return (
        Number(item.number) ===
        currentSurah
      );

    });


  if (title) {

    title.textContent =
      "📖 " +
      (
        surah
          ? surah.name
          : "قرآن"
      );

  }


  container.innerHTML = `
    <div class="loading">
      ${escapeHTML(
        surah
          ? surah.name
          : "قرآن"
      )}
      لوڈ ہو رہا ہے...
    </div>
  `;


  try {

    /*
      Arabic + Translation + Audio
      تینوں requests parallel چلیں گی۔
    */

    const responses =
      await Promise.all([

        fetch(
          QURAN_API +
          "/surah/" +
          currentSurah +
          "/quran-uthmani"
        ),

        fetch(
          QURAN_API +
          "/surah/" +
          currentSurah +
          "/" +
          currentTranslation
        ),

        fetch(
          QURAN_API +
          "/surah/" +
          currentSurah +
          "/ar.alafasy"
        )

      ]);


    if (
      !responses[0].ok ||
      !responses[1].ok ||
      !responses[2].ok
    ) {

      throw new Error(
        "Quran API request failed"
      );

    }


    const arabicJson =
      await responses[0].json();

    const translationJson =
      await responses[1].json();

    const audioJson =
      await responses[2].json();


    const arabic =
      arabicJson &&
      arabicJson.data &&
      Array.isArray(
        arabicJson.data.ayahs
      )
        ? arabicJson.data.ayahs
        : [];


    const translations =
      translationJson &&
      translationJson.data &&
      Array.isArray(
        translationJson.data.ayahs
      )
        ? translationJson.data.ayahs
        : [];


    const audios =
      audioJson &&
      audioJson.data &&
      Array.isArray(
        audioJson.data.ayahs
      )
        ? audioJson.data.ayahs
        : [];


    if (!arabic.length) {

      throw new Error(
        "No Arabic ayahs returned"
      );

    }


    currentAyahs =
      arabic.map(function(
        ayah,
        index
      ) {

        return {

          number:
            Number(
              ayah.numberInSurah
            ),

          arabic:
            ayah.text || "",

          translation:
            translations[index]
              ? translations[index].text || ""
              : "",

          audio:
            audios[index]
              ? audios[index].audio || ""
              : ""

        };

      });


    renderAyahs();


    setTimeout(
      highlightCurrentAyah,
      150
    );


  } catch (error) {

    console.error(
      "OPEN SURAH ERROR:",
      error
    );


    container.innerHTML = `
      <div class="card">

        <h3>
          قرآن لوڈ نہیں ہو سکا
        </h3>

        <p>
          Internet یا Quran API چیک کریں۔
        </p>

        <button
          id="retrySurah"
          class="primary-btn"
          type="button">
          دوبارہ کوشش کریں
        </button>

      </div>
    `;


    const retry =
      document.getElementById(
        "retrySurah"
      );

    if (retry) {

      retry.addEventListener(
        "click",
        function() {

          openSurah(
            currentSurah,
            currentAyah
          );

        }
      );

    }

  }

}


/* =========================================
   RENDER AYAT
   ========================================= */

function renderAyahs() {

  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (!container) return;

  container.innerHTML = "";


  if (!currentAyahs.length) {

    container.innerHTML = `
      <div class="card">
        اس سورت کی آیات دستیاب نہیں ہیں۔
      </div>
    `;

    return;
  }


  currentAyahs.forEach(
    function(
      ayah,
      index
    ) {

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "ayah-card";

      card.id =
        "ayah-" +
        ayah.number;


      card.innerHTML = `

        <div class="ayah-top">

          <span class="ayah-number">
            ${ayah.number}
          </span>

          <div class="ayah-actions">

            <button
              type="button"
              data-play="${index}"
              aria-label="آیت چلائیں">
              ▶️
            </button>

            <button
              type="button"
              data-save="${ayah.number}"
              aria-label="آیت محفوظ کریں">
              🔖
            </button>

          </div>

        </div>


        <div class="arabic-text">
          ${escapeHTML(
            ayah.arabic
          )}
        </div>


        <div class="translation-box">

          <div class="translation-title">
            ${getTranslationTitle()}
          </div>

          <div class="translation-text">
            ${escapeHTML(
              ayah.translation
            )}
          </div>

        </div>


        <button
          class="tafseer-btn"
          type="button"
          data-tafseer="${index}">
          📚 تفسیر دیکھیں
        </button>


        <div
          id="tafseer-${index}"
          class="tafseer-box hidden">

          <strong>تفسیر</strong>

          <p>
            ${escapeHTML(
              getSimpleTafseer(
                ayah
              )
            )}
          </p>

        </div>

      `;


      const playButton =
        card.querySelector(
          "[data-play]"
        );

      const saveButton =
        card.querySelector(
          "[data-save]"
        );

      const tafseerButton =
        card.querySelector(
          "[data-tafseer]"
        );


      if (playButton) {

        playButton.addEventListener(
          "click",
          function() {

            playAyah(index);

          }
        );

      }


      if (saveButton) {

        saveButton.addEventListener(
          "click",
          function() {

            saveAyah(
              ayah.number
            );

            highlightCurrentAyah();

            showMessage(
              "🔖 آیت محفوظ ہوگئی"
            );

          }
        );

      }


      if (tafseerButton) {

        tafseerButton.addEventListener(
          "click",
          function() {

            const box =
              document.getElementById(
                "tafseer-" + index
              );

            if (box) {
              box.classList.toggle(
                "hidden"
              );
            }

          }
        );

      }


      container.appendChild(card);

    }
  );


  highlightCurrentAyah();

}


/* =========================================
   TRANSLATION
   ========================================= */

function getTranslationTitle() {

  if (
    currentTranslation ===
    "en.sahih"
  ) {

    return "English Translation";

  }

  return "اردو ترجمہ";

}


async function changeTranslation(
  value
) {

  currentTranslation =
    value ||
    "ur.jalandhry";


  if (!currentAyahs.length) {
    return;
  }


  const container =
    document.getElementById(
      "ayahContainer"
    );

  if (!container) return;


  const oldData =
    currentAyahs.map(
      function(ayah) {

        return {

          number:
            ayah.number,

          arabic:
            ayah.arabic,

          audio:
            ayah.audio

        };

      }
    );


  container.innerHTML = `
    <div class="loading">
      ترجمہ تبدیل ہو رہا ہے...
    </div>
  `;


  try {

    const response =
      await fetch(
        QURAN_API +
        "/surah/" +
        currentSurah +
        "/" +
        currentTranslation
      );


    if (!response.ok) {
      throw new Error(
        "Translation failed"
      );
    }


    const json =
      await response.json();


    const translations =
      json &&
      json.data &&
      Array.isArray(
        json.data.ayahs
      )
        ? json.data.ayahs
        : [];


    currentAyahs =
      oldData.map(
        function(ayah, index) {

          return {

            number:
              ayah.number,

            arabic:
              ayah.arabic,

            translation:
              translations[index]
                ? translations[index].text || ""
                : "",

            audio:
              ayah.audio

          };

        }
      );


    renderAyahs();


  } catch (error) {

    console.error(error);

    showMessage(
      "ترجمہ تبدیل نہیں ہو سکا۔"
    );

    renderAyahs();

  }

}


/* =========================================
   FONT
   ========================================= */

function changeArabicSize(
  value
) {

  document
    .querySelectorAll(
      ".arabic-text"
    )
    .forEach(
      function(element) {

        element.style.fontSize =
          Number(value) +
          "px";

      }
    );

}


/* =========================================
   TAFSEER
   ========================================= */

function getSimpleTafseer(
  ayah
) {

  /*
    یہ جگہ مستند تفسیری API لگانے کے لیے رکھی گئی ہے۔
    غلط یا غیرمستند تشریح خود سے نہیں بنائی جا رہی۔
  */

  return (
    "اس آیت کی مکمل تشریح کے لیے مستند تفسیری ماخذ سے رجوع کریں۔"
  );

}


/* =========================================
   AUDIO
   ========================================= */

function playAyah(
  index
) {

  const ayah =
    currentAyahs[index];

  if (!ayah) return;


  if (!ayah.audio) {

    showMessage(
      "اس آیت کی آڈیو دستیاب نہیں۔"
    );

    return;
  }


  audioIndex =
    index;

  currentAyah =
    ayah.number;


  saveAyah(
    ayah.number
  );


  audio.pause();

  audio.src =
    ayah.audio;

  audio.currentTime =
    0;


  audio.play()
    .then(
      function() {

        showAudioPlayer(
          ayah
        );

        updateAyahPlayButtons();

        highlightCurrentAyah();

      }
    )
    .catch(
      function(error) {

        console.error(
          error
        );

        showMessage(
          "آڈیو نہیں چل سکی۔ دوبارہ Play دبائیں۔"
        );

      }
    );

}


function showAudioPlayer(
  ayah
) {

  const player =
    document.getElementById(
      "audioPlayer"
    );

  if (!player) return;

  player.classList.remove(
    "hidden"
  );


  const title =
    document.getElementById(
      "audioTitle"
    );

  if (title) {

    title.textContent =
      "آیت " +
      ayah.number;

  }


  updateMainPlay();

}


function toggleMainAudio() {

  if (!audio.src) {

    if (currentAyahs.length) {
      playAyah(0);
    }

    return;
  }


  if (audio.paused) {

    audio.play()
      .catch(
        function(error) {
          console.error(error);
        }
      );

  } else {

    audio.pause();

  }

}


function updateMainPlay() {

  const button =
    document.getElementById(
      "mainPlay"
    );

  if (!button) return;

  button.textContent =
    audio.paused
      ? "▶️"
      : "⏸️";


  updateAyahPlayButtons();

}


function updateAyahPlayButtons() {

  document
    .querySelectorAll(
      "[data-play]"
    )
    .forEach(
      function(button) {

        const index =
          Number(
            button.getAttribute(
              "data-play"
            )
          );


        const playing =
          index === audioIndex &&
          !audio.paused;


        button.textContent =
          playing
            ? "⏸️"
            : "▶️";


        button.classList.toggle(
          "playing",
          playing
        );

      }
    );

}


function previousAudio() {

  if (audioIndex <= 0) {

    showMessage(
      "یہ پہلی آیت ہے۔"
    );

    return;
  }


  playAyah(
    audioIndex - 1
  );

}


function nextAudio() {

  if (
    audioIndex < 0 ||
    audioIndex >=
    currentAyahs.length - 1
  ) {

    showMessage(
      "یہ آخری آیت ہے۔"
    );

    return;
  }


  playAyah(
    audioIndex + 1
  );

}


function seekAudio(
  value
) {

  if (!audio.duration) {
    return;
  }


  audio.currentTime =
    (
      Number(value) /
      100
    ) *
    audio.duration;

}


function stopAudio() {

  audio.pause();

  audio.currentTime =
    0;

  audio.removeAttribute(
    "src"
  );

  audio.load();

  audioIndex =
    -1;


  const player =
    document.getElementById(
      "audioPlayer"
    );

  if (player) {
    player.classList.add(
      "hidden"
    );
  }


  updateMainPlay();

}


audio.addEventListener(
  "play",
  function() {

    updateMainPlay();

  }
);


audio.addEventListener(
  "pause",
  function() {

    updateMainPlay();

  }
);


audio.addEventListener(
  "timeupdate",
  function() {

    if (!audio.duration) {
      return;
    }


    const progress =
      (
        audio.currentTime /
        audio.duration
      ) *
      100;


    const bar =
      document.getElementById(
        "audioProgress"
      );

    if (bar) {
      bar.value =
        progress;
    }


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
          audio.currentTime
        );

    }


    if (total) {

      total.textContent =
        formatTime(
          audio.duration
        );

    }

  }
);


audio.addEventListener(
  "ended",
  function() {

    if (
      audioIndex >= 0 &&
      audioIndex <
      currentAyahs.length - 1
    ) {

      playAyah(
        audioIndex + 1
      );

    } else {

      updateMainPlay();

    }

  }
);


/* =========================================
   SAVE / CONTINUE
   ========================================= */

function saveAyah(
  number
) {

  currentAyah =
    Number(number);


  localStorage.setItem(
    "quranLastRead",
    JSON.stringify({

      surah:
        currentSurah,

      ayah:
        currentAyah

    })
  );

}


function continueReading() {

  const saved =
    localStorage.getItem(
      "quranLastRead"
    );


  if (!saved) {

    openQuran();

    showMessage(
      "ابھی کوئی آیت محفوظ نہیں۔"
    );

    return;
  }


  try {

    const data =
      JSON.parse(
        saved
      );


    openSurah(
      Number(data.surah),
      Number(data.ayah)
    );


  } catch (error) {

    console.error(error);

    openQuran();

  }

}


function highlightCurrentAyah() {

  document
    .querySelectorAll(
      ".ayah-card.current"
    )
    .forEach(
      function(card) {

        card.classList.remove(
          "current"
        );

      }
    );


  const element =
    document.getElementById(
      "ayah-" +
      currentAyah
    );


  if (element) {

    element.classList.add(
      "current"
    );

  }

}


/* =========================================
   READER SETTINGS
   ========================================= */

function toggleReaderSettings() {

  const box =
    document.getElementById(
      "readerSettings"
    );

  if (box) {

    box.classList.toggle(
      "hidden"
    );

  }

}


/* =========================================
   BACK
   ========================================= */

function backToSurahs() {

  stopAudio();

  openQuran();

}


/* =========================================
   PRAYER
   ========================================= */

function openPrayer() {

  showScreen(
    "prayerScreen"
  );

  loadPrayerTimes();

}


async function loadPrayerTimes() {

  const box =
    document.getElementById(
      "prayerTimes"
    );

  const home =
    document.getElementById(
      "homePrayerTimes"
    );


  if (box) {
    box.textContent =
      "اوقات لوڈ ہو رہے ہیں...";
  }


  if (home) {
    home.textContent =
      "اوقات لوڈ ہو رہے ہیں...";
  }


  const now =
    new Date();


  const date =
    String(
      now.getDate()
    ).padStart(2,"0") +
    "-" +
    String(
      now.getMonth()+1
    ).padStart(2,"0") +
    "-" +
    now.getFullYear();


  try {

    const response =
      await fetch(
        PRAYER_API +
        "/timingsByCity/" +
        date +
        "?city=Karachi&country=Pakistan&method=1&school=1"
      );


    if (!response.ok) {
      throw new Error(
        "Prayer request failed"
      );
    }


    const json =
      await response.json();


    const timings =
      json.data.timings;


    const prayers = [

      ["فجر","Fajr"],
      ["طلوع آفتاب","Sunrise"],
      ["ظہر","Dhuhr"],
      ["عصر","Asr"],
      ["مغرب","Maghrib"],
      ["عشاء","Isha"]

    ];


    let html = "";


    prayers.forEach(
      function(item) {

        html += `
          <div style="
            display:flex;
            justify-content:space-between;
            padding:10px 0;
            border-bottom:1px solid #193a2e;
          ">
            <span>
              ${item[0]}
            </span>

            <strong>
              ${timings[item[1]]}
            </strong>
          </div>
        `;

      }
    );


    if (box) {
      box.innerHTML =
        html;
    }


    if (home) {

      home.textContent =
        prayers
          .slice(0,3)
          .map(
            function(item) {

              return (
                item[0] +
                " " +
                timings[item[1]]
              );

            }
          )
          .join(" • ");

    }


  } catch (error) {

    console.error(error);


    if (box) {
      box.textContent =
        "نماز کے اوقات دستیاب نہیں۔";
    }


    if (home) {
      home.textContent =
        "اوقات دستیاب نہیں۔";
    }

  }

}


/* =========================================
   DUAS
   ========================================= */

const duas = [

  {
    title:"علم کی دعا",
    arabic:"رَبِّ زِدْنِي عِلْمًا",
    translation:
      "اے میرے رب! میرے علم میں اضافہ فرما۔"
  },

  {
    title:"والدین کے لیے دعا",
    arabic:
      "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation:
      "اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں میری پرورش کی۔"
  },

  {
    title:"دنیا و آخرت کی بھلائی",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    translation:
      "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
  },

  {
    title:"سفر کی دعا",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
    translation:
      "پاک ہے وہ ذات جس نے اس سواری کو ہمارے لیے مسخر کیا۔"
  }

];


function openDuas() {

  showScreen(
    "duasScreen"
  );

  loadDuas();

}


function loadDuas() {

  const list =
    document.getElementById(
      "duasList"
    );

  if (!list) return;


  list.innerHTML =
    duas.map(
      function(dua) {

        return `
          <div class="dua-card">

            <h3>
              ${escapeHTML(
                dua.title
              )}
            </h3>

            <div class="dua-arabic">
              ${escapeHTML(
                dua.arabic
              )}
            </div>

            <div class="dua-translation">
              ${escapeHTML(
                dua.translation
              )}
            </div>

          </div>
        `;

      }
    ).join("");

}


/* =========================================
   TASBEEH
   ========================================= */

let tasbeeh =
  Number(
    localStorage.getItem(
      "tasbeeh"
    ) || 0
  );


function openTasbeeh() {

  showScreen(
    "tasbeehScreen"
  );

  loadTasbeeh();

}


function loadTasbeeh() {

  const count =
    document.getElementById(
      "tasbeehCount"
    );

  if (count) {

    count.textContent =
      tasbeeh;

  }

}


function countTasbeeh() {

  tasbeeh++;

  localStorage.setItem(
    "tasbeeh",
    String(tasbeeh)
  );

  loadTasbeeh();

}


function resetTasbeeh() {

  tasbeeh =
    0;

  localStorage.setItem(
    "tasbeeh",
    "0"
  );

  loadTasbeeh();

}


/* =========================================
   HELPERS
   ========================================= */

function formatTime(
  seconds
) {

  if (
    !Number.isFinite(
      seconds
    )
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
    )
    .toString()
    .padStart(2,"0");


  return (
    minutes +
    ":" +
    secs
  );

}


function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )

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

      if (
        message &&
        message.parentNode
      ) {

        message.remove();

      }

    },
    3000
  );

}
