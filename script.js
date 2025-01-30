const words_api_link = "https://random-word-api.herokuapp.com/word?";
const word_to_write = document.getElementById("word_to_write");
const time = document.getElementById("chrono");

let nbWords = 3;
let words = [];
let isFirstWord = true;
let isGameRunning = false;


const buttonStart = document.getElementById("start");
buttonStart.addEventListener("click", startGame);

const screen = document.getElementById("screen");

const inputZone = document.getElementById("input_keyboard");
inputZone.addEventListener("input", check);

const score = document.getElementById("score");

async function getWords() {
    try {
        const response = await fetch(words_api_link + "lang=fr&number=" + nbWords);
        const data = await response.json();
        words.push(...data);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function addWordToScreen(word){
    screen.innerHTML += "<p>" + word + "</p>";        
    
}

function changeEtat(){
    if(isGameRunning){
        start.innerText = "Commencer"
        isGameRunning = false;
        score.innerText = "0";
        screen.innerHTML = "";
        words = [];
        clearInterval(interval)
        get();
    }else{
        isGameRunning = true;
        start.innerText = "Recommencer"
    }
    return isGameRunning;
}

function startGame() {
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

get();
