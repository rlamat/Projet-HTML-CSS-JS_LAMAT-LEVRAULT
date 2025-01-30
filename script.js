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

let nbWords = nb_words.value;
let lenWord = length_words.value;
let words = [];
let isFirstWord = true;
let isGameRunning = false;
let nCategory = categoriy.value;
let timeCurrentChrono = 3;

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
    screen.innerHTML += "<p>" + word.name + "</p>";        
    
}

function changeEtat(){
    if(isGameRunning){
        clearInterval(interval)
        resetTimer()
        start.innerText = "Commencer"
        isGameRunning = false;
        score.innerText = "0";
        words = [];
        timeOver = false;
        get();
        screen.innerHTML = "";
        time.removeAttribute("disabled");
        nb_words.removeAttribute("disabled");
        categoriy.removeAttribute("disabled");
        length_words.removeAttribute("disabled");
    }else{
        startTimer();
        isGameRunning = true;
        start.innerText = "Recommencer"
    }
    return isGameRunning;
}

function startGame() {
    time.setAttribute("disabled", "");
    nb_words.setAttribute("disabled","");
    categoriy.setAttribute("disabled", "");
    length_words.setAttribute("disabled", "");
    changeEtat()
    if(isGameRunning){
        let wordsToPrint = [];
        if(words.length > 0) {
            let word = words[0];
            wordsToPrint.push(word);
            addWordToScreen(word);
            words.shift();
        }
        interval = setInterval(() => {
            if(words.length > 0) {
                let word = words[0];
                wordsToPrint.push(word);
                addWordToScreen(word);
                words.shift();
            }
        }, time.value * 1000);
    }
}

function check(){
    let input = inputZone.value;
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
    timeCurrentChrono = 3;
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

    //////////////////////////////////////////////////////////////
    // Convertir en JSON
    const jsonString = JSON.stringify(data, null, 2);

    // Créer un fichier et déclencher le téléchargement
    const blob = new Blob([jsonString], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    ////////////////////////////////////////////////////////////////
    // faire un tableau des scores {} avec les elements à afficher sur la session. pas de serveur, tant pis
}

function stopTimer(){
    console.log("stop timer")
    console.log(timeCurrentChrono)
    clearInterval(timerInterval);
    clearInterval(interval);
}

function resetTimer(){
    console.log("aaaaaaaaaaaaaaa");
    clearInterval(timerInterval);
    timeCurrentChrono = 3;
    timeChrono.textContent = timeCurrentChrono;
}

get();
