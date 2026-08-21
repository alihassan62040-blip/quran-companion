"use strict";

/* =====================================================
   QURAN COMPANION — COMPLETE APP
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

let verses = [];
let currentIndex = 0;
let currentAudio = null;
let currentSurah = 0;
let isPlaying = false;

/* =====================================================
   NAVIGATION
===================================================== */

function hideAllScreens(){
  document.querySelectorAll(
    "#homeScreen,#quranScreen,#readerScreen,#prayerScreen,#duasScreen,#tasbeehScreen,#kaabaScreen"
  ).forEach(function(x){
    x.classList.add("hidden");
  });
}

function show(id,title){
  hideAllScreens();
  const el=document.getElementById(id);
  if(el) el.classList.remove("hidden");
  const h=document.getElementById("headerTitle");
  if(h) h.textContent=title;
}

function goHome(){
  stopAudio();
  show("homeScreen","Quran Companion");
}

function openQuran(){
  show("quranScreen","قرآن");
  renderSurahs();
}

function continueReading(){
  const n=Number(localStorage.getItem("lastSurah")||0);
  if(n>=1&&n<=114){
    openQuran();
    setTimeout(()=>openSurah(n),100);
  }else openQuran();
}

function openPrayer(){
  show("prayerScreen","نماز کے اوقات");
  loadPrayerTimes();
}

function openDuas(){
  show("duasScreen","دعائیں");
  renderDuas();
}

function openTasbeeh(){
  show("tasbeehScreen","تسبیح");
  updateTasbeeh();
}

function openKaaba(){
  show("kaabaScreen","خانہ کعبہ");
}

/* =====================================================
   QURAN LIST
===================================================== */

function renderSurahs(list=surahs){
  const box=document.getElementById("surahList");
  if(!box)return;

  box.innerHTML="";

  list.forEach(function(s){
    const b=document.createElement("button");
    b.className="surah-card";
    b.type="button";

    b.innerHTML=`
      <span class="surah-number">${s[0]}</span>
      <span class="surah-name">
        <strong>${s[1]}</strong>
        <small>${s[2]} — ${s[3]} آیات</small>
      </span>
    `;

    b.onclick=()=>openSurah(s[0]);
    box.appendChild(b);
  });
}

function filterSurahs(){
  const input=document.getElementById("surahSearch");
  if(!input)return;

  const q=input.value.trim().toLowerCase();

  renderSurahs(
    surahs.filter(s=>
      String(s[0]).includes(q) ||
      s[1].includes(q) ||
      s[2].toLowerCase().includes(q)
    )
  );
}

/* =====================================================
   OPEN SURAH
===================================================== */

async function openSurah(number){
  stopAudio();

  currentSurah=number;
  currentIndex=0;
  verses=[];

  show("readerScreen","قرآن");

  const s=surahs.find(x=>x[0]===number);

  const title=document.getElementById("readerTitle");
  if(title&&s) title.textContent="📖 "+s[1];

  localStorage.setItem("lastSurah",String(number));

  const box=document.getElementById("ayahContainer");
  if(!box)return;

  box.innerHTML='<div class="loading">قرآن، ترجمہ اور تفسیر لوڈ ہو رہی ہے...</div>';

  try{
    const response=await fetch(QURAN_FUNCTION_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({surah:number})
    });

    const result=await response.json();

    if(!response.ok||!result.success){
      throw new Error(result.error||"Quran data error");
    }

    verses=Array.isArray(result.verses)?result.verses:[];

    if(!verses.length){
      throw new Error("آیات نہیں ملیں");
    }

    renderAyahs();

  }catch(error){
    console.error(error);

    box.innerHTML=`
      <div class="card">
        <h3>⚠️ قرآن لوڈ نہیں ہو سکا</h3>
        <p>${escapeHTML(error.message)}</p>
        <button class="primary" onclick="openSurah(${number})">
          دوبارہ کوشش کریں
        </button>
      </div>
    `;
  }
}

/* =====================================================
   AYAT
===================================================== */

function renderAyahs(){
  const box=document.getElementById("ayahContainer");
  if(!box)return;

  box.innerHTML="";

  verses.forEach(function(a,i){
    const card=document.createElement("article");
    card.className="ayah-card";
    card.id="ayah-"+i;

    const tafseer=a.tafseer||a.tafseerText||a.tafsir||"";

    card.innerHTML=`
      <div class="ayah-top">
        <span class="ayah-number">${a.number||i+1}</span>

        <div class="actions">
          <button onclick="playIndex(${i})">🔊</button>
        </div>
      </div>

      <div class="arabic">${escapeHTML(a.arabic||"")}</div>

      <div class="translation">
        <div class="translation-title">اردو ترجمہ</div>
        <div>${escapeHTML(a.urdu||"ترجمہ دستیاب نہیں")}</div>
      </div>

      <button class="tafseer-btn" onclick="toggleTafseer(${i})">
        📚 تفسیر دکھائیں
      </button>

      <div id="tafseer-${i}" class="tafseer hidden">
        ${tafseer?escapeHTML(tafseer):"اس آیت کی تفسیر دستیاب نہیں۔"}
      </div>
    `;

    box.appendChild(card);
  });
}

function toggleTafseer(i){
  const el=document.getElementById("tafseer-"+i);
  if(!el)return;

  el.classList.toggle("hidden");

  const buttons=document.querySelectorAll(".tafseer-btn");

  if(buttons[i]){
    buttons[i].textContent=el.classList.contains("hidden")
      ?"📚 تفسیر دکھائیں"
      :"📕 تفسیر چھپائیں";
  }
}

/* =====================================================
   AUDIO
===================================================== */

function playIndex(i){
  if(!verses[i])return;

  currentIndex=i;
  playCurrent();
}

function playCurrent(){
  const a=verses[currentIndex];

  if(!a)return;

  if(!a.audio){
    message("اس آیت کی آڈیو دستیاب نہیں۔");
    return;
  }

  stopAudio(false);

  currentAudio=new Audio(a.audio);
  currentAudio.preload="auto";

  currentAudio.onloadedmetadata=updateTime;
  currentAudio.ontimeupdate=updateProgress;

  currentAudio.onended=function(){
    if(currentIndex<verses.length-1){
      currentIndex++;
      scrollAyah();
      playCurrent();
    }else{
      isPlaying=false;
      updatePlay();
      message("سورت مکمل ہو گئی۔");
    }
  };

  currentAudio.onerror=function(){
    isPlaying=false;
    updatePlay();
    message("آڈیو چلانے میں مسئلہ آیا۔");
  };

  const player=document.getElementById("audioPlayer");
  if(player)player.classList.remove("hidden");

  updateTitle();
  highlight();
  scrollAyah();

  currentAudio.play().then(function(){
    isPlaying=true;
    updatePlay();
  }).catch(function(){
    isPlaying=false;
    updatePlay();
    message("آڈیو چلانے کے لیے ▶️ دبائیں۔");
  });
}

function toggleMainAudio(){
  if(!currentAudio){
    playCurrent();
    return;
  }

  if(currentAudio.paused){
    currentAudio.play().then(()=>{
      isPlaying=true;
      updatePlay();
    }).catch(()=>message("آڈیو نہیں چل سکی۔"));
  }else{
    currentAudio.pause();
    isPlaying=false;
    updatePlay();
  }
}

function nextAudio(){
  if(currentIndex<verses.length-1){
    currentIndex++;
    playCurrent();
  }
}

function previousAudio(){
  if(currentIndex>0){
    currentIndex--;
    playCurrent();
  }
}

function stopAudio(hide=true){
  if(currentAudio){
    currentAudio.pause();
    currentAudio.src="";
    currentAudio=null;
  }

  isPlaying=false;
  updatePlay();

  if(hide){
    const p=document.getElementById("audioPlayer");
    if(p)p.classList.add("hidden");
  }
}

function updatePlay(){
  const b=document.getElementById("mainPlay");
  if(b)b.textContent=isPlaying?"⏸️":"▶️";
}

function updateTitle(){
  const t=document.getElementById("audioTitle");
  if(t)t.textContent="آیت "+(verses[currentIndex]?.number||currentIndex+1);
}

function highlight(){
  document.querySelectorAll(".ayah-card").forEach(x=>x.classList.remove("current"));

  const el=document.getElementById("ayah-"+currentIndex);
  if(el)el.classList.add("current");
}

function scrollAyah(){
  setTimeout(()=>{
    const el=document.getElementById("ayah-"+currentIndex);
    if(el)el.scrollIntoView({behavior:"smooth",block:"center"});
  },100);
}

function updateProgress(){
  if(!currentAudio)return;

  const p=document.getElementById("audioProgress");
  const c=document.getElementById("currentTime");

  if(p&&currentAudio.duration){
    p.value=(currentAudio.currentTime/currentAudio.duration)*100;
  }

  if(c)c.textContent=formatTime(currentAudio.currentTime);

  updateTime();
}

function updateTime(){
  const t=document.getElementById("totalTime");

  if(t&&currentAudio&&isFinite(currentAudio.duration)){
    t.textContent=formatTime(currentAudio.duration);
  }
}

function seekAudio(value){
  if(currentAudio&&isFinite(currentAudio.duration)){
    currentAudio.currentTime=(Number(value)/100)*currentAudio.duration;
  }
}

function formatTime(s){
  if(!isFinite(s))return"0:00";

  const m=Math.floor(s/60);
  const sec=Math.floor(s%60).toString().padStart(2,"0");

  return m+":"+sec;
}

function backToSurahs(){
  stopAudio();
  openQuran();
}

/* =====================================================
   PRAYER TIMES
===================================================== */

async function loadPrayerTimes(){
  const list=document.getElementById("prayerList");
  const location=document.getElementById("prayerLocation");

  if(!list)return;

  list.innerHTML='<div class="loading">اوقات حاصل ہو رہے ہیں...</div>';

  /*
    Pehle browser location.
    Agar permission na mile to Pakistan fallback.
  */

  let lat=30.3753;
  let lon=69.3451;

  try{
    const position=await new Promise(function(resolve,reject){
      if(!navigator.geolocation){
        reject(new Error("Geolocation unavailable"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {enableHighAccuracy:false,timeout:7000}
      );
    });

    lat=position.coords.latitude;
    lon=position.coords.longitude;

    if(location){
      location.textContent="آپ کے موجودہ مقام کے مطابق اوقات";
    }

  }catch(error){
    if(location){
      location.textContent="پاکستان کے عمومی مقام کے مطابق اوقات";
    }
  }

  try{
    const date=new Date();

    const url=
      "https://api.aladhan.com/v1/timings/" +
      date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear()+
      "?latitude="+lat+"&longitude="+lon+"&method=1";

    const response=await fetch(url);
    const result=await response.json();

    if(!response.ok||result.code!==200){
      throw new Error("Prayer API error");
    }

    const t=result.data.timings;

    const prayers=[
      ["فجر",t.Fajr],
      ["طلوع آفتاب",t.Sunrise],
      ["ظہر",t.Dhuhr],
      ["عصر",t.Asr],
      ["مغرب",t.Maghrib],
      ["عشاء",t.Isha]
    ];

    list.innerHTML="";

    prayers.forEach(function(p){
      const card=document.createElement("div");
      card.className="prayer-card";

      card.innerHTML=`
        <strong>${p[0]}</strong>
        <span>${p[1]}</span>
      `;

      list.appendChild(card);
    });

  }catch(error){
    console.error(error);

    list.innerHTML=`
      <div class="card">
        ⚠️ نماز کے اوقات ابھی حاصل نہیں ہو سکے۔
        <br><br>
        دوبارہ کوشش کریں۔
      </div>
    `;
  }
}

/* =====================================================
   DUAS
===================================================== */

function renderDuas(){
  const box=document.getElementById("duasList");
  if(!box)return;

  const duas=[
    ["کھانے سے پہلے","بِسْمِ اللّٰهِ"],
    ["کھانے کے بعد","الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ"],
    ["سونے کی دعا","بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا"],
    ["گھر سے نکلنے کی دعا","بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ"],
    ["مسجد میں داخل ہونے کی دعا","اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ"],
    ["مسجد سے نکلنے کی دعا","اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ"]
  ];

  box.innerHTML="";

  duas.forEach(function(d){
    const card=document.createElement("div");
    card.className="dua-card";

    card.innerHTML=`
      <strong>${d[0]}</strong>
      <div class="dua-arabic">${d[1]}</div>
    `;

    box.appendChild(card);
  });
}

/* =====================================================
   TASBEEH
===================================================== */

function updateTasbeeh(){
  const n=Number(localStorage.getItem("tasbeehCount")||0);
  const el=document.getElementById("tasbeehCount");
  if(el)el.textContent=n;
}

function countTasbeeh(){
  let n=Number(localStorage.getItem("tasbeehCount")||0);
  n++;
  localStorage.setItem("tasbeehCount",String(n));
  updateTasbeeh();
}

function resetTasbeeh(){
  localStorage.setItem("tasbeehCount","0");
  updateTasbeeh();
}

/* =====================================================
   SETTINGS
===================================================== */

function toggleSettings(){
  const s=document.getElementById("readerSettings");
  if(s)s.classList.toggle("hidden");
}

function changeArabicSize(value){
  document.querySelectorAll(".arabic").forEach(function(el){
    el.style.fontSize=Number(value)+"px";
  });

  localStorage.setItem("arabicFontSize",String(value));
}

/* =====================================================
   MESSAGE + SAFE TEXT
===================================================== */

let messageTimer=null;

function message(text){
  const el=document.getElementById("appMessage");
  if(!el)return;

  el.textContent=text;
  el.classList.remove("hidden");

  clearTimeout(messageTimer);

  messageTimer=setTimeout(function(){
    el.classList.add("hidden");
  },3000);
}

function escapeHTML(value){
  if(value===null||value===undefined)return"";

  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* =====================================================
   START
===================================================== */

document.addEventListener("DOMContentLoaded",function(){

  const saved=localStorage.getItem("arabicFontSize");

  const input=document.getElementById("fontSize");

  if(saved&&input){
    input.value=saved;
  }

  console.log("Quran Companion complete app loaded");
});
