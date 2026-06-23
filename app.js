import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let words = [];
let current = 0;

// 获取数据
async function loadWords() {
    const snap = await getDocs(collection(db, "words"));

    words = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }));

    showWord();
}

// 显示单词
function showWord() {
    if (words.length === 0) return;

    const w = words[current];

    document.getElementById("word").innerText = w.french;
    document.getElementById("meaning").innerText = w.chinese;

    const img = document.getElementById("comicImg");
    img.src = w.imageUrl || "";
}

// 显示中文
window.showMeaning = function () {
    document.getElementById("meaning").style.display = "block";
};

// SRS算法
function calc(word, result) {

    let interval = word.interval || 1;
    let ease = word.ease || 2.5;

    if (result === "forgot") interval = 1;
    else if (result === "unsure") interval = Math.round(interval * 1.5);
    else interval = Math.round(interval * ease);

    const nextReview = Date.now() + interval * 86400000;

    return { interval, ease, nextReview };
}

// 复习
window.review = async function (result) {

    const w = words[current];
    const updated = calc(w, result);

    await updateDoc(doc(db, "words", w.id), updated);

    current++;
    if (current >= words.length) current = 0;

    showWord();
};

loadWords();
