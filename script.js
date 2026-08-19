"use strict";

/* =========================================
   QURAN COMPANION
   ========================================= */

const QURAN_API =
"https://api.alquran.cloud/v1";

const PRAYER_API =
"https://api.aladhan.com/v1";

let surahs = [];
let currentSurah = 1;
let currentAyah = 1;
let currentAyahs = [];

let selectedTranslation =
"ur.jalandhry";

let audio = new Audio();

let audioIndex = -1;


/* =========================================
   START
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

loadSurahs();

loadPrayerTimes();

loadDuas();

updateHijri();

loadTasbeeh();

});


/* =========================================
   SCREEN SYSTEM
   ========================================= */

function hideScreens(){

document
.querySelectorAll(".screen")
.forEach(s => s.classList.add("hidden"));

}

function showScreen(id){

hideScreens();

const el =
document.getElementById(id);

if(el){
el.classList.remove("hidden");
}

}

function goHome(){

stopAudio();

showScreen("homeScreen");

}


/* =========================================
   NAVIGATION
   ========================================= */

function openQuran(){

showScreen("quranScreen");

if(!surahs.length){
loadSurahs();
}

}

function openPrayer(){

showScreen("prayerScreen");

loadPrayerTimes();

}

function openHadith(){

showScreen("hadithScreen");

}

function openDuas(){

showScreen("duasScreen");

loadDuas();

}

function openTasbeeh(){

showScreen("tasbeehScreen");

}

function openQibla(){

showScreen("qiblaScreen");

calculateQibla();

}

function openHistory(){

showScreen("historyScreen");

}

function openUniverse(){

showScreen("universeScreen");

}


/* =========================================
   QURAN SURAH LIST
   ========================================= */

async function loadSurahs(){

const list =
document.getElementById("surahList");

if(!list) return;

list.innerHTML =
`<div class="loading">سورتیں لوڈ ہو رہی ہیں...</div>`;

try{

const response =
await fetch(`${QURAN_API}/surah`);

const json =
await response.json();

surahs =
json.data || [];

renderSurahs(surahs);

}catch(error){

console.error(error);

list.innerHTML =
`<div class="card">سورتیں لوڈ نہیں ہو سکیں۔ Internet چیک کریں۔</div>`;

}

}


function renderSurahs(data){

const list =
document.getElementById("surahList");

if(!list) return;

list.innerHTML = "";

data.forEach(surah => {

const button =
document.createElement("button");

button.className =
"surah-card";

button.innerHTML = `

<span class="surah-number">
${surah.number}
</span>

<span class="surah-name">

<strong>
${escapeHTML(surah.name)}
</strong>

<small>
${escapeHTML(surah.englishName)}
 • ${surah.numberOfAyahs} آیات
</small>

</span>

<span>
←
</span>
`;

button.onclick =
() => openSurah(surah.number);

list.appendChild(button);

});

}


/* =========================================
   SEARCH
   ========================================= */

function toggleSearch(){

document
.getElementById("quranSearch")
.classList.toggle("hidden");

}

function filterSurahs(){

const input =
document.getElementById("surahSearch");

const value =
input.value.trim().toLowerCase();

if(!value){

renderSurahs(surahs);

return;

}

const result =
surahs.filter(s =>
s.name.toLowerCase().includes(value) ||
s.englishName.toLowerCase().includes(value) ||
String(s.number).includes(value)
);

renderSurahs(result);

}


/* =========================================
   OPEN SURAH
   ========================================= */

async function openSurah(
number,
savedAyah = 1
){

currentSurah =
Number(number);

currentAyah =
Number(savedAyah || 1);

showScreen("readerScreen");

stopAudio();

const title =
document.getElementById("readerTitle");

const surah =
surahs.find(s =>
Number(s.number) === currentSurah
);

if(title){

title.textContent =
"📖 " +
(surah ? surah.name : "قرآن");

}

const container =
document.getElementById("ayahContainer");

container.innerHTML =
`<div class="loading">
قرآن لوڈ ہو رہا ہے...
</div>`;

try{

const editions =
`quran-uthmani,${selectedTranslation},ar.alafasy`;

const response =
await fetch(
`${QURAN_API}/surah/${currentSurah}/editions/${editions}`
);

if(!response.ok){
throw new Error("Quran API failed");
}

const json =
await response.json();

const arabic =
json.data[0];

const translation =
json.data[1];

const audioData =
json.data[2];

currentAyahs =
arabic.ayahs.map((ayah,i)=>({

number:
ayah.numberInSurah,

arabic:
ayah.text,

translation:
translation.ayahs[i]?.text || "",

audio:
audioData.ayahs[i]?.audio || ""

}));

renderAyahs();

}catch(error){

console.error(error);

container.innerHTML =
`
<div class="card">
<h2>قرآن لوڈ نہیں ہو سکا</h2>
<p>Internet connection چیک کریں۔</p>
<button class="primary-btn"
onclick="openSurah(${currentSurah})">
دوبارہ کوشش کریں
</button>
</div>
`;

}

}


/* =========================================
   RENDER AYAT
   ========================================= */

function renderAyahs(){

const container =
document.getElementById("ayahContainer");

container.innerHTML = "";

currentAyahs.forEach((ayah,index)=>{

const card =
document.createElement("article");

card.className =
"ayah-card";

card.id =
"ayah-" + ayah.number;

card.innerHTML = `

<div class="ayah-top">

<span class="ayah-number">
${ayah.number}
</span>

<div class="ayah-actions">

<button
onclick="playAyah(${index})">
▶️
</button>

<button
onclick="saveAyah(${ayah.number})">
🔖
</button>

</div>

</div>

<div class="arabic-text">
${escapeHTML(ayah.arabic)}
</div>

<div class="translation-box">

<div class="translation-title">
اردو ترجمہ
</div>

<div class="translation-text">
${escapeHTML(ayah.translation)}
</div>

</div>

<button
class="tafseer-btn"
onclick="toggleTafseer(${index})">

📚 تفسیر دیکھیں

</button>

<div
id="tafseer-${index}"
class="tafseer-box hidden">

آیت کا مختصر مفہوم:

${escapeHTML(ayah.translation)}

</div>
`;

container.appendChild(card);

});

setTimeout(()=>{

const saved =
document.getElementById(
"ayah-" + currentAyah
);

if(saved){

saved.classList.add(
"saved-ayah"
);

saved.scrollIntoView({
behavior:"smooth",
block:"center"
});

}

},500);

}


/* =========================================
   AUDIO
   ========================================= */

function playAyah(index){

const ayah =
currentAyahs[index];

if(!ayah || !ayah.audio){
showMessage("اس آیت کی آڈیو دستیاب نہیں۔");
return;
}

audioIndex =
index;

audio.src =
ayah.audio;

audio.currentTime = 0;

audio.play()
.then(()=>{

showAudioPlayer(ayah);

})
.catch(error=>{

console.error(error);

showMessage(
"Audio نہیں چل سکی۔ دوبارہ Play دبائیں۔"
);

});

}


/* =========================================
   AUDIO PLAYER
   ========================================= */

function showAudioPlayer(ayah){

const player =
document.getElementById("audioPlayer");

player.classList.remove("hidden");

document.getElementById(
"audioTitle"
).textContent =
`آیت ${ayah.number}`;

updateMainPlay();

}

function toggleMainAudio(){

if(!audio.src){

if(currentAyahs.length){
playAyah(0);
}

return;

}

if(audio.paused){

audio.play();

}else{

audio.pause();

}

updateMainPlay();

}

function updateMainPlay(){

const btn =
document.getElementById("mainPlay");

if(!btn) return;

btn.textContent =
audio.paused ? "▶️" : "⏸️";

}

audio.addEventListener(
"timeupdate",
()=>{

if(!audio.duration) return;

const progress =
(audio.currentTime /
audio.duration) * 100;

const input =
document.getElementById(
"audioProgress"
);

if(input){
input.value = progress;
}

document.getElementById(
"currentTime"
).textContent =
formatTime(audio.currentTime);

document.getElementById(
"totalTime"
).textContent =
formatTime(audio.duration);

}
);


audio.addEventListener(
"play",
updateMainPlay
);

audio.addEventListener(
"pause",
updateMainPlay
);


audio.addEventListener(
"ended",
()=>{

if(
audioIndex >= 0 &&
audioIndex < currentAyahs.length - 1
){

audioIndex++;

const next =
currentAyahs[audioIndex];

audio.src =
next.audio;

audio.currentTime = 0;

audio.play();

showAudioPlayer(next);

}else{

updateMainPlay();

}

}
);


function seekAudio(value){

if(!audio.duration) return;

audio.currentTime =
(Number(value)/100) *
audio.duration;

}


function previousAudio(){

if(audioIndex <= 0){

showMessage(
"یہ پہلی آیت ہے۔"
);

return;

}

audioIndex--;

const ayah =
currentAyahs[audioIndex];

audio.src =
ayah.audio;

audio.currentTime = 0;

audio.play();

showAudioPlayer(ayah);

}


function nextAudio(){

if(
audioIndex >=
currentAyahs.length - 1
){

showMessage(
"یہ آخری آیت ہے۔"
);

return;

}

audioIndex++;

const ayah =
currentAyahs[audioIndex];

audio.src =
ayah.audio;

audio.currentTime = 0;

audio.play();

showAudioPlayer(ayah);

}


function stopAudio(){

audio.pause();

audio.currentTime = 0;

audio.src = "";

audioIndex = -1;

const player =
document.getElementById(
"audioPlayer"
);

if(player){
player.classList.add("hidden");
}

}


/* =========================================
   DAILY AYAH AUDIO
   ========================================= */

async function playDailyAyah(){

try{

const response =
await fetch(
`${QURAN_API}/ayah/94:5/ar.alafasy`
);

const json =
await response.json();

if(json.data?.audio){

audio.src =
json.data.audio;

audio.currentTime = 0;

audio.play();

showAudioPlayer({
number:5
});

}

}catch(error){

showMessage(
"آڈیو دستیاب نہیں۔"
);

}

}


/* =========================================
   BOOKMARK / CONTINUE
   ========================================= */

function saveAyah(number){

localStorage.setItem(
"quranLastRead",
JSON.stringify({
surah:currentSurah,
ayah:number
})
);

showMessage(
"🔖 آیت محفوظ ہوگئی"
);

}


function continueReading(){

const saved =
localStorage.getItem(
"quranLastRead"
);

if(!saved){

openQuran();

showMessage(
"ابھی کوئی آیت محفوظ نہیں۔ قرآن میں 🔖 دبائیں۔"
);

return;

}

try{

const data =
JSON.parse(saved);

openSurah(
data.surah,
data.ayah
);

}catch{

openQuran();

}

}


/* =========================================
   READER SETTINGS
   ========================================= */

function toggleReaderSettings(){

document
.getElementById("readerSettings")
.classList.toggle("hidden");

}

function changeArabicSize(value){

document
.querySelectorAll(".arabic-text")
.forEach(el=>{
el.style.fontSize =
value + "px";
});

}

function changeTranslation(value){

selectedTranslation =
value;

openSurah(currentSurah,currentAyah);

}


/* =========================================
   TAFSEER
   ========================================= */

function toggleTafseer(index){

const box =
document.getElementById(
"tafseer-" + index
);

if(box){
box.classList.toggle("hidden");
}

}


/* =========================================
   PRAYER TIMES
   ========================================= */

async function loadPrayerTimes(){

const box =
document.getElementById(
"prayerTimes"
);

const home =
document.getElementById(
"homePrayerTimes"
);

if(box)
box.innerHTML =
"اوقات لوڈ ہو رہے ہیں...";

if(home)
home.innerHTML =
"اوقات لوڈ ہو رہے ہیں...";


const date =
formatDate(new Date());


const url =
`${PRAYER_API}/timingsByCity/${date}?city=Karachi&country=Pakistan&method=1&school=1`;


try{

const response =
await fetch(url);

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

prayers.forEach(p=>{

html += `
<div class="prayer-row">
<span>${p[0]}</span>
<strong>${timings[p[1]]}</strong>
</div>
`;

});


if(box)
box.innerHTML = html;

if(home)
home.innerHTML =
`
${prayers.slice(0,3).map(p =>
`${p[0]} ${timings[p[1]]}`
).join(" • ")}
`;

}catch(error){

console.error(error);

if(box)
box.innerHTML =
"نماز کے اوقات لوڈ نہیں ہو سکے۔";

if(home)
home.innerHTML =
"نماز کے اوقات دستیاب نہیں۔";

}

}


/* =========================================
   DUAS
   ========================================= */

const duas = [

{
title:"سفر کی دعا",
arabic:"سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
translation:"پاک ہے وہ ذات جس نے اس سواری کو ہمارے لیے مسخر کیا۔"
},

{
title:"کھانے سے پہلے",
arabic:"بِسْمِ اللَّهِ",
translation:"اللہ کے نام سے۔"
},

{
title:"علم کی دعا",
arabic:"رَبِّ زِدْنِي عِلْمًا",
translation:"اے میرے رب! میرے علم میں اضافہ فرما۔"
},

{
title:"والدین کے لیے",
arabic:"رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
translation:"اے میرے رب! ان دونوں پر رحم فرما جیسے انہوں نے بچپن میں میری پرورش کی۔"
},

{
title:"دنیا و آخرت کی بھلائی",
arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
translation:"اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے۔"
}

];


function loadDuas(){

const list =
document.getElementById(
"duasList"
);

if(!list) return;

list.innerHTML =
duas.map(dua=>`

<div class="dua-card">

<h3>
${dua.title}
</h3>

<div class="dua-arabic">
${dua.arabic}
</div>

<div class="dua-translation">
${dua.translation}
</div>

</div>

`).join("");

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


function loadTasbeeh(){

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

loadTasbeeh();

}

function resetTasbeeh(){

tasbeeh = 0;

localStorage.setItem(
"tasbeeh",
0
);

loadTasbeeh();

}


/* =========================================
   QIBLA
   ========================================= */

function calculateQibla(){

if(!navigator.geolocation){

showMessage(
"آپ کے browser میں location دستیاب نہیں۔"
);

return;

}

navigator.geolocation.getCurrentPosition(
position=>{

const lat =
position.coords.latitude;

const lon =
position.coords.longitude;


/*
Kaaba:
21.4225 N
39.8262 E
*/

const bearing =
calculateBearing(
lat,
lon,
21.4225,
39.8262
);

document.getElementById(
"qiblaDegrees"
).textContent =
`قبلہ: ${Math.round(bearing)}°`;

document.getElementById(
"qiblaCompass"
).style.transform =
`rotate(${bearing}deg)`;

},
error=>{

console.error(error);

showMessage(
"Location کی اجازت دیں۔"
);

}
);

}


function calculateBearing(
lat1,
lon1,
lat2,
lon2
){

const rad =
Math.PI / 180;

const φ1 =
lat1 * rad;

const φ2 =
lat2 * rad;

const Δλ =
(lon2-lon1) * rad;

const y =
Math.sin(Δλ) *
Math.cos(φ2);

const x =
Math.cos(φ1) *
Math.sin(φ2) -
Math.sin(φ1) *
Math.cos(φ2) *
Math.cos(Δλ);

let bearing =
Math.atan2(y,x) / rad;

return (
bearing + 360
) % 360;

}


/* =========================================
   HIJRI
   ========================================= */

async function updateHijri(){

try{

const date =
formatDate(new Date());

const response =
await fetch(
`${PRAYER_API}/gpi/${date}`
);

const json =
await response.json();

if(json.data?.hijri){

document.getElementById(
"hijriDate"
).textContent =
json.data.hijri.date;

}

}catch{

document.getElementById(
"hijriDate"
).textContent =
"ہجری تاریخ";

}

}


/* =========================================
   HELPERS
   ========================================= */

function formatDate(date){

const d =
String(date.getDate())
.padStart(2,"0");

const m =
String(date.getMonth()+1)
.padStart(2,"0");

const y =
date.getFullYear();

return `${d}-${m}-${y}`;

}


function formatTime(seconds){

if(!isFinite(seconds))
return "0:00";

const min =
Math.floor(seconds/60);

const sec =
Math.floor(seconds%60)
.toString()
.padStart(2,"0");

return `${min}:${sec}`;

}


function escapeHTML(value){

return String(value ?? "")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#039;");

}


function showMessage(text){

const old =
document.querySelector(".message");

if(old)
old.remove();

const div =
document.createElement("div");

div.className =
"message";

div.textContent =
text;

document.body.appendChild(div);

setTimeout(()=>{
div.remove();
},3000);

}


/* =========================================
   BACK
   ========================================= */

function backToSurahs(){

stopAudio();

openQuran();

}


/* =========================================
   GLOBAL
   ========================================= */

window.goHome=goHome;
window.openQuran=openQuran;
window.openPrayer=openPrayer;
window.openHadith=openHadith;
window.openDuas=openDuas;
window.openTasbeeh=openTasbeeh;
window.openQibla=openQibla;
window.openHistory=openHistory;
window.openUniverse=openUniverse;

window.toggleSearch=toggleSearch;
window.filterSurahs=filterSurahs;

window.openSurah=openSurah;
window.backToSurahs=backToSurahs;

window.playAyah=playAyah;
window.playDailyAyah=playDailyAyah;

window.toggleMainAudio=toggleMainAudio;
window.previousAudio=previousAudio;
window.nextAudio=nextAudio;
window.seekAudio=seekAudio;

window.saveAyah=saveAyah;
window.continueReading=continueReading;

window.toggleReaderSettings=
toggleReaderSettings;

window.changeArabicSize=
changeArabicSize;

window.changeTranslation=
changeTranslation;

window.toggleTafseer=
toggleTafseer;

window.loadPrayerTimes=
loadPrayerTimes;

window.countTasbeeh=
countTasbeeh;

window.resetTasbeeh=
resetTasbeeh;

window.calculateQibla=
calculateQibla;
