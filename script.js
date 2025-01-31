// const words_api_link = "https://random-word-api.herokuapp.com/word?";
const words_api_link = "https://trouve-mot.fr/api/";

const word_to_write = document.getElementById("word_to_write");
const nb_words = document.getElementById("nb_words");
const length_words = document.getElementById("length_words");
const categoriy = document.getElementById("category_words");
const screen = document.getElementById("screen");
const buttonStart = document.getElementById("start");
const inputZone = document.getElementById("input_keyboard");
const score = document.getElementById("score");
const timeChrono = document.getElementById("time")
const time = document.getElementById("chrono");
const checkAccel = document.getElementById("accel");
const timeTotalStart = 10;
const baseTime = 1000;
const speedAccel = 20;

let nbWords = nb_words.value;
let lenWord = length_words.value;
let words = [];
let isFirstWord = true;
let isGameRunning = false;
let nCategory = categoriy.value;
let timeCurrentChrono = timeTotalStart;
let scores = [];
let basicTime = 1000;
let wordsToPrint = [];

buttonStart.addEventListener("click", startGame);
inputZone.addEventListener("input", check);
length_words.addEventListener("change", () => {
    words = [];
    lenWord = length_words.value;
    get();
});
nb_words.addEventListener("change", () => {
    words = [];
    nbWords = nb_words.value;
    get();
});
categoriy.addEventListener("change", () => {
    words = [];
    nCategory = categoriy.value;
    get();
})


async function getWords() {
    try {
        let response;
        if (nCategory == 0) {
            if (lenWord == 0) {
                response = await fetch(words_api_link + "random/" + nbWords);
            } else {
                response = await fetch(words_api_link + "maxsize/" + lenWord + "/" + nbWords);
            }
            const data = await response.json();
            words.push(...data);
        }else{
            response = await fetch(words_api_link + "categorie/" + nCategory + "/" + nbWords);
            const data = await response.json();
            words.push(...data);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function addWordToScreen(word){
    screen.innerHTML += "<div><p>" + word.name + "</p></div>";        
    
}

function changeEtat(){
    if(isGameRunning){
        clearInterval(interval)
        resetTimer()
        enableButtons();
        start.innerText = "Commencer"
        isGameRunning = false;
        score.innerText = "0";
        words = [];
        timeOver = false;
        basicTime = baseTime;
        get();
        screen.innerHTML = "";
    }else{
        startTimer();
        isGameRunning = true;
        start.innerText = "Recommencer"
    }
    return isGameRunning;
}

function startGame() {
    disableButtons();
    changeEtat()
    if(isGameRunning){
        if(words.length > 0) {
            let word = words[0];
            wordsToPrint.push(word);
            addWordToScreen(word);
            words.shift();
        }
        interval = setInterval(() => {
            if(words.length > 0) {
                accel();
                let word = words[0];
                wordsToPrint.push(word);
                addWordToScreen(word);
                words.shift();
            }
        }, time.value * basicTime);
    }
}

function disableButtons(){
    time.setAttribute("disabled", "");
    nb_words.setAttribute("disabled","");
    categoriy.setAttribute("disabled", "");
    length_words.setAttribute("disabled", "");
    checkAccel.setAttribute("disabled", "");
}

function enableButtons(){
    time.removeAttribute("disabled");
    nb_words.removeAttribute("disabled");
    categoriy.removeAttribute("disabled");
    length_words.removeAttribute("disabled");
    checkAccel.removeAttribute("disabled");
    inputZone.removeAttribute("disabled");
}

function accel(){
    if(checkAccel.checked){
        clearInterval(interval);
        basicTime = basicTime - speedAccel;
        interval = setInterval(() => {
            if(words.length > 0) {
                accel();
                let word = words[0];
                wordsToPrint.push(word);
                addWordToScreen(word);
                words.shift();
            }
        }, time.value * basicTime);
    }
}

function check(){
    let input = inputZone.value.trim();
    let word = screen.children[0].innerText;
    if(input == word){
        screen.removeChild(screen.children[0]);
        inputZone.value = "";
        score.innerText = parseInt(score.innerText) + 1;
    }
}

async function get() {
    await getWords();
    console.log(words);
}

function startTimer(){
    timeCurrentChrono = timeTotalStart;
    timeChrono.textContent = timeCurrentChrono;
    timerInterval = setInterval(() => {
        timeCurrentChrono = timeCurrentChrono - 1;
        if(timeCurrentChrono == 0){
            timeCurrentChrono = 0;
            stopTimer();
        }
        timeChrono.textContent = timeCurrentChrono;
    }, 1000);
    let data = { year: 2012 };
}

function stopTimer(){
    console.log("stop timer")
    console.log(timeCurrentChrono)
    clearInterval(timerInterval);
    clearInterval(interval);
    addScore(score.textContent);
    inputZone.setAttribute("disabled", "");
}

function resetTimer(){
    clearInterval(timerInterval);
    timeCurrentChrono = timeTotalStart;
    timeChrono.textContent = timeCurrentChrono;
}

function addScore(score) {
    scores.push({score: score });
    scores.sort((a, b) => b.score - a.score);
    updateTable();
}

function updateTable() {
    const table = document.getElementById('score_table');
    const rows = Array.from(table.rows);
    console.log("aaaaaa");
    rows.slice(1).forEach(row => table.deleteRow(row.rowIndex)); // Supprime toutes les lignes sauf l'en-tête
    
    // Ajouter les nouvelles lignes triées
    scores.forEach(scoreData => {
        const row = table.insertRow();
        const scoreCell = row.insertCell(0);
        scoreCell.textContent = scoreData.score;
    });
}


get();
