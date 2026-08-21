"use strict";

/*
 QURAN COMPANION
 No eval
 No inline JavaScript
 Uses AlQuran.cloud API
*/

const API = "https://api.alquran.cloud/v1";

let surahs = [];
let currentSurah = 0;
let currentAyah = 1;
let currentAyahs = [];
let audioIndex = -1;
let currentTranslation = "ur.jalandhry";

const audio = new Audio();

/* =========================
   START
========================= */

document.addEventListener("DOMContentLoaded", function () {

  loadSurahs();
  loadDuas();
  loadTasbeeh();

});

/* =========================
   SCREEN
========================= */

function showScreen(id) {

  document.querySelectorAll("main > section").forEach(function (section) {
    section.classList.add("hidden");
  });

  const screen = document.getElementById(id);

  if (screen) {
    screen.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  const title = document.getElementById("headerTitle");

  if (title) {

    const titles = {
      homeScreen: "Quran Companion",
      quranScreen: "📖 قرآن",
      readerScreen: "📖 قرآن",
      duasScreen: "🤲 دعائیں",
      tasbeehScreen: "📿 تسبیح"
    };

    title.textContent = titles[id] || "Quran Companion";
  }
}

function goHome() {

  stopAudio();
  showScreen("homeScreen");

}

/* =========================
   QURAN LIST
========================= */

function openQuran() {

  stopAudio();
  showScreen("quranScreen");

  if (!surahs.length) {
    loadSurahs();
  }
}

async function loadSurahs() {

  const list = document.getElementById("surahList");

  if (!list) return;

  list.innerHTML =
    '<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>';

  try {

    const response = await fetch(API + "/surah");

    if (!response.ok) {
      throw new Error("Surah API failed");
    }

    const json = await response.json();

    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid surah data");
    }

    surahs = json.data;

    renderSurahs(surahs);

  } catch (error) {

    console.error(error);

    list.innerHTML = `
      <div class="card">
        <h3>سورتیں لوڈ نہیں ہو سکیں</h3>
        <p>Internet connection چیک کریں۔</p>
        <button class="primary" type="button" id="retrySurahs">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;

    const retry = document.getElementById("retrySurahs");

    if (retry) {
      retry.addEventListener("click", loadSurahs);
    }
  }
}

function renderSurahs(data) {

  const list = document.getElementById("surahList");

  if (!list) return;

  list.innerHTML = "";

  data.forEach(function (surah) {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "surah-card";

    const number = document.createElement("span");
    number.className = "surah-number";
    number.textContent = surah.number;

    const name = document.createElement("span");
    name.className = "surah-name";

    const strong = document.createElement("strong");
    strong.textContent = surah.name;

    const small = document.createElement("small");

    small.textContent =
      surah.englishName +
      " • " +
      surah.numberOfAyahs +
      " آیات";

    name.appendChild(strong);
    name.appendChild(small);

    const arrow = document.createElement("span");
    arrow.textContent = "←";

    button.appendChild(number);
    button.appendChild(name);
    button.appendChild(arrow);

    button.addEventListener("click", function () {
      openSurah(surah.number);
    });

    list.appendChild(button);

  });
}

/* =========================
   SEARCH
========================= */

function filterSurahs() {

  const input =
    document.getElementById("surahSearch");

  if (!input) return;

  const value =
    input.value.trim().toLowerCase();

  if (!value) {
    renderSurahs(surahs);
    return;
  }

  const result = surahs.filter(function (surah) {

    return (
      String(surah.number).includes(value) ||
      String(surah.name).toLowerCase().includes(value) ||
      String(surah.englishName).toLowerCase().includes(value)
    );

  });

  renderSurahs(result);
}

/* =========================
   OPEN SURAH
========================= */

async function openSurah(number, savedAyah) {

  const n = Number(number);

  if (!Number.isInteger(n) || n < 1 || n > 114) {
    showMessage("غلط سورت نمبر");
    return;
  }

  currentSurah = n;
  currentAyah = Number(savedAyah) || 1;

  stopAudio();
  showScreen("readerScreen");

  const title =
    document.getElementById("readerTitle");

  const container =
    document.getElementById("ayahContainer");

  if (!container) {
    showMessage("Reader container نہیں ملا");
    return;
  }

  const surah =
    surahs.find(function (item) {
      return Number(item.number) === currentSurah;
    });

  if (title) {
    title.textContent =
      "📖 " +
      (surah ? surah.name : "سورت " + currentSurah);
  }

  container.innerHTML =
    '<div class="loading">عربی، ترجمہ اور تلاوت لوڈ ہو رہی ہے...</div>';

  try {

    /*
      تینوں requests ایک ساتھ۔
      اس سے page زیادہ تیزی سے load ہوگا۔
    */

    const results = await Promise.all([

      fetch(
        API +
        "/surah/" +
        currentSurah +
        "/quran-uthmani"
      ),

      fetch(
        API +
        "/surah/" +
        currentSurah +
        "/" +
        currentTranslation
      ),

      fetch(
        API +
        "/surah/" +
        currentSurah +
        "/ar.alafasy"
      )

    ]);

    for (const response of results) {

      if (!response.ok) {
        throw new Error(
          "API request failed: " +
          response.status
        );
      }

    }

    const arabicJson =
      await results[0].json();

    const translationJson =
      await results[1].json();

    const audioJson =
      await results[2].json();

    const arabic =
      arabicJson &&
      arabicJson.data &&
      Array.isArray(arabicJson.data.ayahs)
        ? arabicJson.data.ayahs
        : [];

    const translations =
      translationJson &&
      translationJson.data &&
      Array.isArray(translationJson.data.ayahs)
        ? translationJson.data.ayahs
        : [];

    const audios =
      audioJson &&
      audioJson.data &&
      Array.isArray(audioJson.data.ayahs)
        ? audioJson.data.ayahs
        : [];

    if (!arabic.length) {
      throw new Error("No ayahs returned");
    }

    currentAyahs =
      arabic.map(function (ayah, index) {

        return {
          number: Number(ayah.numberInSurah),
          arabic: ayah.text || "",
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

  } catch (error) {

    console.error("OPEN SURAH:", error);

    container.innerHTML = `
      <div class="card">
        <h3>سورت لوڈ نہیں ہو سکی</h3>
        <p>Internet connection چیک کریں اور دوبارہ کوشش کریں۔</p>
        <button class="primary" type="button" id="retrySurah">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;

    const retry =
      document.getElementById("retrySurah");

    if (retry) {

      retry.addEventListener(
        "click",
        function () {
          openSurah(currentSurah, currentAyah);
        }
      );

    }
  }
}

/* =========================
   RENDER AYAT
========================= */

function renderAyahs() {

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML = "";

  currentAyahs.forEach(function (ayah, index) {

    const article =
      document.createElement("article");

    article.className = "ayah-card";
    article.id = "ayah-" + ayah.number;

    const top =
      document.createElement("div");

    top.className = "ayah-top";

    const number =
      document.createElement("span");

    number.className = "ayah-number";
    number.textContent = ayah.number;

    const actions =
      document.createElement("div");

    actions.className = "actions";

    const play =
      document.createElement("button");

    play.type = "button";
    play.textContent = "▶️";
    play.title = "آیت چلائیں";

    play.addEventListener(
      "click",
      function () {
        playAyah(index);
      }
    );

    const save =
      document.createElement("button");

    save.type = "button";
    save.textContent = "🔖";
    save.title = "آیت محفوظ کریں";

    save.addEventListener(
      "click",
      function () {
        saveAyah(ayah.number);
        showMessage("آیت محفوظ ہوگئی");
      }
    );

    actions.appendChild(play);
    actions.appendChild(save);

    top.appendChild(number);
    top.appendChild(actions);

    const arabic =
      document.createElement("div");

    arabic.className = "arabic";
    arabic.textContent = ayah.arabic;

    const translation =
      document.createElement("div");

    translation.className = "translation";

    const translationTitle =
      document.createElement("div");

    translationTitle.className =
      "translation-title";

    translationTitle.textContent =
      currentTranslation === "en.sahih"
        ? "English Translation"
        : "اردو ترجمہ";

    const translationText =
      document.createElement("div");

    translationText.textContent =
      ayah.translation;

    translation.appendChild(translationTitle);
    translation.appendChild(translationText);

    /*
      تفسیر:
      یہاں الگ box رکھا گیا ہے تاکہ translation
      اور tafseer mix نہ ہوں۔
    */

    const tafseerButton =
      document.createElement("button");

    tafseerButton.type = "button";
    tafseerButton.className = "tafseer-btn";
    tafseerButton.textContent = "📚 تفسیر / تشریح دیکھیں";

    const tafseer =
      document.createElement("div");

    tafseer.className =
      "tafseer hidden";

    const tafseerHeading =
      document.createElement("strong");

    tafseerHeading.textContent =
      "تفسیر / تشریح";

    const tafseerText =
      document.createElement("p");

    tafseerText.textContent =
      "اس آیت کا مفہوم سمجھنے کے لیے اوپر دیا گیا مستند ترجمہ پڑھیں۔ تفصیلی تفسیر کے لیے مستند تفسیری کتاب یا عالمِ دین سے رجوع کریں۔";

    tafseer.appendChild(tafseerHeading);
    tafseer.appendChild(tafseerText);

    tafseerButton.addEventListener(
      "click",
      function () {

        tafseer.classList.toggle("hidden");

        tafseerButton.textContent =
          tafseer.classList.contains("hidden")
            ? "📚 تفسیر / تشریح دیکھیں"
            : "📕 تفسیر بند کریں";

      }
    );

    article.appendChild(top);
    article.appendChild(arabic);
    article.appendChild(translation);
    article.appendChild(tafseerButton);
    article.appendChild(tafseer);

    container.appendChild(article);

  });

  highlightCurrentAyah();
}

/* =========================
   TRANSLATION
========================= */

async function changeTranslation(value) {

  currentTranslation =
    value || "ur.jalandhry";

  if (!currentSurah || !currentAyahs.length) {
    return;
  }

  const container =
    document.getElementById("ayahContainer");

  if (!container) return;

  container.innerHTML =
    '<div class="loading">ترجمہ تبدیل ہو رہا ہے...</div>';

  try {

    const response =
      await fetch(
        API +
        "/surah/" +
        currentSurah +
        "/" +
        currentTranslation
      );

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const json =
      await response.json();

    const translations =
      json &&
      json.data &&
      Array.isArray(json.data.ayahs)
        ? json.data.ayahs
        : [];

    currentAyahs =
      currentAyahs.map(function (ayah, index) {

        return {
          number: ayah.number,
          arabic: ayah.arabic,
          translation:
            translations[index]
              ? translations[index].text || ""
              : "",
          audio: ayah.audio
        };

      });

    renderAyahs();

  } catch (error) {

    console.error(error);

    showMessage("ترجمہ لوڈ نہیں ہو سکا");

    renderAyahs();

  }
}

/* =========================
   SETTINGS
========================= */

function toggleSettings() {

  const box =
    document.getElementById("readerSettings");

  if (box) {
    box.classList.toggle("hidden");
  }
}

function changeArabicSize(value) {

  const size =
    Number(value);

  document
    .querySelectorAll(".arabic")
    .forEach(function (element) {
      element.style.fontSize =
        size + "px";
    });
}

/* =========================
   AUDIO
========================= */

function playAyah(index) {

  const ayah =
    currentAyahs[index];

  if (!ayah) return;

  if (!ayah.audio) {
    showMessage("اس آیت کی آڈیو دستیاب نہیں");
    return;
  }

  audioIndex = index;
  currentAyah = ayah.number;

  saveAyah(ayah.number);

  audio.src = ayah.audio;
  audio.currentTime = 0;

  audio.play()
    .then(function () {

      showAudioPlayer(ayah);
      updateMainPlay();
      highlightCurrentAyah();

    })
    .catch(function (error) {

      console.error(error);

      showMessage(
        "آڈیو نہیں چل سکی۔ دوبارہ Play دبائیں۔"
      );

    });
}

function showAudioPlayer(ayah) {

  const player =
    document.getElementById("audioPlayer");

  if (!player) return;

  player.classList.remove("hidden");

  const title =
    document.getElementById("audioTitle");

  if (title) {
    title.textContent =
      "تلاوت — آیت " + ayah.number;
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
      .catch(function (error) {
        console.error(error);
      });

  } else {

    audio.pause();

  }
}

function updateMainPlay() {

  const button =
    document.getElementById("mainPlay");

  if (!button) return;

  button.textContent =
    audio.paused ? "▶️" : "⏸️";
}

function previousAudio() {

  if (audioIndex <= 0) {
    showMessage("یہ پہلی آیت ہے");
    return;
  }

  playAyah(audioIndex - 1);
}

function nextAudio() {

  if (
    audioIndex < 0 ||
    audioIndex >= currentAyahs.length - 1
  ) {
    showMessage("یہ آخری آیت ہے");
    return;
  }

  playAyah(audioIndex + 1);
}

function seekAudio(value) {

  if (!audio.duration) return;

  audio.currentTime =
    Number(value) / 100 *
    audio.duration;
}

function stopAudio() {

  audio.pause();
  audio.currentTime = 0;
  audio.removeAttribute("src");
  audio.load();

  audioIndex = -1;

  updateMainPlay();

  const player =
    document.getElementById("audioPlayer");

  if (player) {
    player.classList.add("hidden");
  }
}

audio.addEventListener("play", updateMainPlay);
audio.addEventListener("pause", updateMainPlay);

audio.addEventListener(
  "timeupdate",
  function () {

    if (!audio.duration) return;

    const bar =
      document.getElementById("audioProgress");

    if (bar) {

      bar.value =
        (
          audio.currentTime /
          audio.duration
        ) * 100;

    }

    const current =
      document.getElementById("currentTime");

    const total =
      document.getElementById("totalTime");

    if (current) {
      current.textContent =
        formatTime(audio.currentTime);
    }

    if (total) {
      total.textContent =
        formatTime(audio.duration);
    }

  }
);

audio.addEventListener(
  "ended",
  function () {

    if (
      audioIndex >= 0 &&
      audioIndex < currentAyahs.length - 1
    ) {

      playAyah(audioIndex + 1);

    } else {

      updateMainPlay();

    }

  }
);

/* =========================
   SAVE / CONTINUE
========================= */

function saveAyah(number) {

  currentAyah =
    Number(number);

  localStorage.setItem(
    "quranLastRead",
    JSON.stringify({
      surah: currentSurah,
      ayah: currentAyah
    })
  );
}

function continueReading() {

  const saved =
    localStorage.getItem("quranLastRead");

  if (!saved) {

    openQuran();

    showMessage(
      "ابھی کوئی آیت محفوظ نہیں"
    );

    return;
  }

  try {

    const data =
      JSON.parse(saved);

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
    .querySelectorAll(".ayah-card.current")
    .forEach(function (element) {
      element.classList.remove("current");
    });

  const element =
    document.getElementById(
      "ayah-" + currentAyah
    );

  if (element) {

    element.classList.add("current");

  }
}

function backToSurahs() {

  stopAudio();
  openQuran();

}

/* =========================
   DUAS
========================= */

const duas = [

  {
    title: "علم کی دعا",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    translation:
      "اے میرے رب! میرے علم میں اضافہ فرما۔"
  },

  {
    title: "والدین کے لیے دعا",
    arabic:
      "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    translation:
      "اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں میری پرورش کی۔"
  },

  {
    title: "دنیا و آخرت کی بھلائی",
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    translation:
      "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
  }

];

function openDuas() {

  stopAudio();
  showScreen("duasScreen");
  loadDuas();

}

function loadDuas() {

  const list =
    document.getElementById("duasList");

  if (!list) return;

  list.innerHTML = "";

  duas.forEach(function (dua) {

    const card =
      document.createElement("div");

    card.className = "card";

    const title =
      document.createElement("h3");

    title.textContent = dua.title;

    const arabic =
      document.createElement("div");

    arabic.className = "arabic";
    arabic.textContent = dua.arabic;

    const translation =
      document.createElement("div");

    translation.className = "translation";
    translation.textContent =
      dua.translation;

    card.appendChild(title);
    card.appendChild(arabic);
    card.appendChild(translation);

    list.appendChild(card);

  });
}

/* =========================
   TASBEEH
========================= */

let tasbeeh =
  Number(
    localStorage.getItem("tasbeeh") || 0
  );

function openTasbeeh() {

  stopAudio();
  showScreen("tasbeehScreen");
  loadTasbeeh();

}

function loadTasbeeh() {

  const count =
    document.getElementById("tasbeehCount");

  if (count) {
    count.textContent = tasbeeh;
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

  tasbeeh = 0;

  localStorage.setItem(
    "tasbeeh",
    "0"
  );

  loadTasbeeh();

}

/* =========================
   HELPERS
========================= */

function formatTime(seconds) {

  if (!Number.isFinite(seconds)) {
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

function showMessage(text) {

  const old =
    document.querySelector(".message");

  if (old) {
    old.remove();
  }

  const message =
    document.createElement("div");

  message.className = "message";
  message.textContent = text;

  document.body.appendChild(message);

  setTimeout(function () {

    if (message.parentNode) {
      message.remove();
    }

  }, 3000);
}
