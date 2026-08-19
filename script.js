async function openSurah(number, savedAyah = 1) {

  currentSurah = Number(number);
  currentAyah = Number(savedAyah || 1);

  showScreen("readerScreen");
  stopAudio();

  const title = document.getElementById("readerTitle");
  const container = document.getElementById("ayahContainer");

  const surah = surahs.find(
    s => Number(s.number) === currentSurah
  );

  if (title) {
    title.textContent =
      "📖 " + (surah ? surah.name : "قرآن");
  }

  container.innerHTML = `
    <div class="loading">
      قرآن لوڈ ہو رہا ہے...
    </div>
  `;

  try {

    /* Arabic Quran */
    const arabicResponse = await fetch(
      `https://api.alquran.cloud/v1/surah/${currentSurah}/quran-uthmani`
    );

    if (!arabicResponse.ok) {
      throw new Error("Arabic Quran failed");
    }

    const arabicJson =
      await arabicResponse.json();

    /* Urdu Translation */
    const urduResponse = await fetch(
      `https://api.alquran.cloud/v1/surah/${currentSurah}/ur.jalandhry`
    );

    if (!urduResponse.ok) {
      throw new Error("Urdu translation failed");
    }

    const urduJson =
      await urduResponse.json();

    /* Alafasy Audio */
    const audioResponse = await fetch(
      `https://api.alquran.cloud/v1/surah/${currentSurah}/ar.alafasy`
    );

    if (!audioResponse.ok) {
      throw new Error("Audio failed");
    }

    const audioJson =
      await audioResponse.json();

    const arabic =
      arabicJson.data.ayahs;

    const translation =
      urduJson.data.ayahs;

    const audioData =
      audioJson.data.ayahs;

    currentAyahs = arabic.map((ayah, i) => {

      return {

        number:
          ayah.numberInSurah,

        arabic:
          ayah.text,

        translation:
          translation[i]
            ? translation[i].text
            : "",

        audio:
          audioData[i]
            ? audioData[i].audio
            : ""

      };

    });

    renderAyahs();

  } catch (error) {

    console.error(error);

    container.innerHTML = `

      <div class="card">

        <h2>
          قرآن لوڈ نہیں ہو سکا
        </h2>

        <p>
          Internet connection چیک کریں۔
        </p>

        <button
          class="primary-btn"
          onclick="openSurah(${currentSurah})">

          دوبارہ کوشش کریں

        </button>

      </div>

    `;

  }

}
