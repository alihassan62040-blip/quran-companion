"use strict";

/* =========================
   QURAN COMPANION
   ========================= */

const API = "https://api.alquran.cloud/v1";

let currentSurah = 1;
let currentAyah = 1;
let currentAudio = null;
let currentButton = null;


/* =========================
   SURAH NAMES
   ========================= */

const surahs = [
"الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف",
"الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر",
"النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون",
"النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
"لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر",
"غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد",
"الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن",
"الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة",
"المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة",
"المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان",
"المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار",
"المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر",
"البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر",
"البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة",
"الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد",
"الإخلاص","الفلق","الناس"
];


/* =========================
   START
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

    buildSurahList();

    restoreReading();

});


/* =========================
   SCREEN CONTROL
   ========================= */

function hideScreens() {

    document
        .querySelectorAll("#homeScreen, .app-screen")
        .forEach(el => el.classList.add("hidden"));

}


function goHome() {

    hideScreens();

    const home = document.getElementById("homeScreen");

    if (home) {
        home.classList.remove("hidden");
    }

}


function openQuran() {

    hideScreens();

    const screen = document.getElementById("quranScreen");

    if (screen) {
        screen.classList.remove("hidden");
    }

    buildSurahList();

}


/* =========================
   OTHER SCREENS
   ========================= */

function openHadith() {
    showScreen("hadithScreen");
}

function openPrayer() {
    showScreen("prayerScreen");
}

function openKaaba() {
    showScreen("kaabaScreen");
}

function openHistory() {
    showScreen("historyScreen");
}

function openUniverse() {
    showScreen("universeScreen");
}

function openCreatures() {
    showScreen("creaturesScreen");
}

function openAI() {
    showScreen("aiScreen");
}


function showScreen(id) {

    hideScreens();

    const screen = document.getElementById(id);

    if (screen) {
        screen.classList.remove("hidden");
    }

}


/* =========================
   SURAH LIST
   ========================= */

function buildSurahList(list = null) {

    const container =
        document.getElementById("surahList");

    if (!container) return;

    const data = list || surahs.map((name, i) => ({
        number: i + 1,
        name: name
    }));


    container.innerHTML = "";


    data.forEach(surah => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "surah-card";


        button.innerHTML = `
            <span class="surah-number">
                ${surah.number}
            </span>

            <span class="surah-name">
                <strong>${surah.name}</strong>
                <small>سورۃ ${surah.number}</small>
            </span>

            <span class="surah-arrow">
                ←
            </span>
        `;


        button.onclick = () => {
            openSurah(surah.number);
        };


        container.appendChild(button);

    });

}


/* =========================
   SEARCH
   ========================= */

function toggleSearch() {

    const search =
        document.getElementById("quranSearch");

    if (!search) return;

    search.classList.toggle("hidden");


    if (!search.classList.contains("hidden")) {

        const input =
            document.getElementById("surahSearch");

        if (input) {
            input.focus();
        }

    }

}


function filterSurahs() {

    const input =
        document.getElementById("surahSearch");

    if (!input) return;


    const text =
        input.value.trim().toLowerCase();


    if (!text) {

        buildSurahList();

        return;

    }


    const results =
        surahs
            .map((name, i) => ({
                number: i + 1,
                name: name
            }))
            .filter(item =>
                item.name.includes(text) ||
                String(item.number).includes(text)
            );


    buildSurahList(results);

}


/* =========================
   OPEN SURAH
   ========================= */

async function openSurah(number, savedAyah = 1) {

    currentSurah = number;
    currentAyah = savedAyah || 1;


    hideScreens();


    const reader =
        document.getElementById("readerScreen");

    if (reader) {
        reader.classList.remove("hidden");
    }


    const title =
        document.getElementById("readerTitle");

    if (title) {

        title.textContent =
            "📖 " + surahs[number - 1];

    }


    const container =
        document.getElementById("ayahContainer");

    if (container) {

        container.innerHTML = `
            <div class="quran-loading">
                📖 قرآن لوڈ ہو رہا ہے...
            </div>
        `;

    }


    try {

        /*
          Arabic + Urdu translation + Mishary audio
        */

        const response = await fetch(
            `${API}/surah/${number}/editions/quran-uthmani,ur.jalandhry,ar.alafasy`
        );


        if (!response.ok) {
            throw new Error("API request failed");
        }


        const result =
            await response.json();


        const arabic =
            result.data[0];

        const translation =
            result.data[1];

        const audio =
            result.data[2];


        renderAyahs(
            arabic,
            translation,
            audio
        );


    } catch (error) {

        console.error(error);


        if (container) {

            container.innerHTML = `
                <div class="quran-error">

                    <div class="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        قرآن لوڈ نہیں ہو سکا
                    </h2>

                    <p>
                        انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔
                    </p>

                    <button
                        class="read-btn"
                        onclick="openSurah(${number})"
                    >
                        🔄 دوبارہ کوشش کریں
                    </button>

                </div>
            `;

        }

    }

}


/* =========================
   RENDER AYAT
   ========================= */

function renderAyahs(
    arabicData,
    translationData,
    audioData
) {

    const container =
        document.getElementById("ayahContainer");

    if (!container) return;


    container.innerHTML = "";


    const ayahs =
        arabicData.ayahs || [];


    ayahs.forEach((ayah, index) => {

        const translation =
            translationData.ayahs[index]?.text || "";


        const audioUrl =
            audioData.ayahs[index]?.audio || "";


        const card =
            document.createElement("article");


        card.className = "ayah-card";


        card.dataset.ayah =
            ayah.numberInSurah;


        card.innerHTML = `

            <div class="ayah-top">

                <span class="ayah-number">
                    ${ayah.numberInSurah}
                </span>

                <div class="ayah-buttons">

                    <button
                        type="button"
                        class="ayah-play"
                    >
                        ▶️
                    </button>

                    <button
                        type="button"
                        class="ayah-save"
                    >
                        🔖
                    </button>

                </div>

            </div>


            <div class="arabic-text">
                ${escapeHTML(ayah.text)}
            </div>


            <div class="translation-box">

                <div class="translation-title">
                    اردو ترجمہ
                </div>

                <div class="translation-text">
                    ${escapeHTML(translation)}
                </div>

            </div>


            <button
                type="button"
                class="tafseer-btn"
            >
                📚 تفسیر
            </button>


            <div class="tafseer-box hidden">

                <p>
                    اس آیت کی تفصیلی تفسیر اگلے مرحلے میں شامل کی جائے گی۔
                </p>

            </div>

        `;


        const playButton =
            card.querySelector(".ayah-play");


        const saveButton =
            card.querySelector(".ayah-save");


        const tafseerButton =
            card.querySelector(".tafseer-btn");


        const tafseerBox =
            card.querySelector(".tafseer-box");


        /* PLAY */

        playButton.onclick = () => {

            playAudio(
                audioUrl,
                playButton
            );

        };


        /* SAVE */

        saveButton.onclick = () => {

            saveReading(
                currentSurah,
                ayah.numberInSurah
            );


            showMessage(
                "🔖 آیت محفوظ ہوگئی"
            );

        };


        /* TAFSEER */

        tafseerButton.onclick = () => {

            tafseerBox.classList.toggle("hidden");

        };


        container.appendChild(card);

    });


    setTimeout(
        scrollToSavedAyah,
        400
    );

}


/* =========================
   AUDIO
   ========================= */

function playAudio(url, button) {

    if (!url) {

        showMessage(
            "اس آیت کی آڈیو دستیاب نہیں ہے۔"
        );

        return;

    }


    /* same audio */

    if (
        currentAudio &&
        currentButton === button &&
        !currentAudio.paused
    ) {

        currentAudio.pause();

        button.textContent = "▶️";

        return;

    }


    /* stop previous */

    if (currentAudio) {
        currentAudio.pause();
    }


    if (currentButton) {
        currentButton.textContent = "▶️";
    }


    currentAudio =
        new Audio(url);


    currentButton =
        button;


    button.textContent =
        "⏸️";


    currentAudio.play()
        .then(() => {

            button.textContent =
                "⏸️";

        })
        .catch(error => {

            console.error(
                "Audio error:",
                error
            );

            button.textContent =
                "▶️";

            showMessage(
                "آڈیو نہیں چل سکی۔ Chrome میں internet چیک کریں۔"
            );

        });


    currentAudio.onended = () => {

        button.textContent =
            "▶️";

        currentAudio =
            null;

        currentButton =
            null;

    };

}


/* =========================
   DAILY AYAH
   ========================= */

async function playDailyAyah() {

    /*
      Surah Ash-Sharh 94:5
    */

    try {

        const response =
            await fetch(
                `${API}/ayah/94:5/ar.alafasy`
            );


        const result =
            await response.json();


        const url =
            result.data.audio;


        if (url) {

            playAudio(
                url,
                document.querySelector(
                    ".daily-card .read-btn"
                )
            );

        }

    } catch (error) {

        console.error(error);

        showMessage(
            "آج کی آیت کی آڈیو دستیاب نہیں۔"
        );

    }

}


/* =========================
   CONTINUE READING
   ========================= */

function saveReading(surah, ayah) {

    const data = {
        surah: Number(surah),
        ayah: Number(ayah)
    };


    localStorage.setItem(
        "quran_last_read",
        JSON.stringify(data)
    );

}


function getLastReading() {

    try {

        const saved =
            localStorage.getItem(
                "quran_last_read"
            );


        if (!saved) {
            return null;
        }


        return JSON.parse(saved);

    } catch {

        return null;

    }

}


function restoreReading() {

    const saved =
        getLastReading();


    if (saved) {

        currentSurah =
            saved.surah;

        currentAyah =
            saved.ayah;

    }

}


function continueReading() {

    const saved =
        getLastReading();


    if (!saved) {

        showMessage(
            "ابھی کوئی آیت محفوظ نہیں ہے۔ قرآن کھولیں اور 🔖 دبائیں۔"
        );

        openQuran();

        return;

    }


    openSurah(
        saved.surah,
        saved.ayah
    );

}


/* =========================
   SCROLL TO SAVED AYAH
   ========================= */

function scrollToSavedAyah() {

    const card =
        document.querySelector(
            `.ayah-card[data-ayah="${currentAyah}"]`
        );


    if (!card) return;


    card.classList.add(
        "saved-ayah"
    );


    setTimeout(() => {

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 300);

}


/* =========================
   READER MODE
   ========================= */

function toggleReaderMode() {

    const mode =
        document.getElementById("readerMode");


    const reader =
        document.getElementById("readerScreen");


    if (!mode || !reader) return;


    mode.classList.toggle("hidden");

    reader.classList.toggle(
        "finger-reading"
    );

}


/* =========================
   BACK
   ========================= */

function backToSurahs() {

    if (currentAudio) {
        currentAudio.pause();
    }


    currentAudio = null;
    currentButton = null;


    openQuran();

}


/* =========================
   MESSAGE
   ========================= */

function showMessage(text) {

    const old =
        document.querySelector(
            ".app-message"
        );


    if (old) {
        old.remove();
    }


    const box =
        document.createElement("div");


    box.className =
        "app-message";


    box.textContent =
        text;


    document.body.appendChild(box);


    setTimeout(() => {

        box.classList.add("show");

    }, 20);


    setTimeout(() => {

        box.classList.remove("show");

        setTimeout(() => {
            box.remove();
        }, 300);

    }, 3000);

}


/* =========================
   ESCAPE HTML
   ========================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================
   GLOBAL FUNCTIONS
   ========================= */

window.openQuran = openQuran;
window.openHadith = openHadith;
window.openPrayer = openPrayer;
window.openKaaba = openKaaba;
window.openHistory = openHistory;
window.openUniverse = openUniverse;
window.openCreatures = openCreatures;
window.openAI = openAI;

window.goHome = goHome;

window.toggleSearch = toggleSearch;
window.filterSurahs = filterSurahs;

window.openSurah = openSurah;
window.backToSurahs = backToSurahs;

window.toggleReaderMode =
    toggleReaderMode;

window.playDailyAyah =
    playDailyAyah;

window.continueReading =
    continueReading;

console.log(
    "Quran Companion loaded successfully."
);
