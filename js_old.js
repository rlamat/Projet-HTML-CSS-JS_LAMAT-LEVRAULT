// Sélection des éléments DOM
const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const difficultySelect = document.getElementById("difficulty");
const wordLengthSelect = document.getElementById("word-length");
const corpusSelect = document.getElementById("corpus");

// Variables globales
let score = 0;
let currentWord = "";
let gameInterval;
let gameTimer;
let timeLeft = 60;
let gameRunning = false;

// Corpus de mots
const words = {
    general: ["voiture", "arbre", "maison", "école", "ordinateur", "chat", "chien", "bicyclette", "jardin", "ballon"],
    animals: ["chat", "chien", "éléphant", "tigre", "lion", "panda", "koala", "zèbre", "girafe"],
    sports: ["football", "basketball", "tennis", "rugby", "cyclisme", "natation", "course", "handball"]
};

// Fonction pour obtenir un mot aléatoire du corpus sélectionné
function getRandomWord() {
    const selectedCorpus = corpusSelect.value;
    let wordList = words[selectedCorpus];
    const wordLength = wordLengthSelect.value;

    // Filtrer les mots en fonction de la longueur choisie
    wordList = filterWordsByLength(wordList, wordLength);

    // Retourner un mot aléatoire
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// Fonction pour filtrer les mots par longueur
function filterWordsByLength(wordList, wordLength) {
    switch (wordLength) {
        case "short":
            return wordList.filter(word => word.length >= 3 && word.length <= 5);
        case "medium":
            return wordList.filter(word => word.length >= 6 && word.length <= 8);
        case "long":
            return wordList.filter(word => word.length >= 9);
        default:
            return wordList;
    }
}

// Fonction pour démarrer la partie
function startGame() {
    // Réinitialiser les variables de jeu
    score = 0;
    timeLeft = 60;
    gameRunning = true;

    // Mettre à jour l'affichage
    updateDisplay();

    // Démarrer le chronomètre
    startTimer();

    // Démarrer l'intervalle pour afficher de nouveaux mots
    setNewWordInterval();
}

// Fonction pour mettre à jour l'affichage du score et du temps restant
function updateDisplay() {
    scoreDisplay.textContent = `Score : ${score}`;
    timerDisplay.textContent = `Temps restant : ${timeLeft}s`;
    wordInput.value = "";
    wordInput.focus();
}

// Fonction pour démarrer le timer du jeu
function startTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Temps restant : ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            clearInterval(gameInterval);
            alert(`Le temps est écoulé ! Score final : ${score}`);
        }
    }, 1000);
}

// Fonction pour démarrer ou mettre à jour l'intervalle de mots
function setNewWordInterval() {
    // Arrêter l'intervalle précédent, s'il existe
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // Définir la durée de l'intervalle en fonction de la difficulté
    const intervalDuration = getIntervalDuration();
    
    // Initialiser l'intervalle pour afficher un mot à chaque fois
    gameInterval = setInterval(() => {
        if (gameRunning) {
            currentWord = getRandomWord();
            wordDisplay.textContent = currentWord;
        }
    }, intervalDuration);
}

// Fonction pour obtenir la durée de l'intervalle en fonction de la difficulté
function getIntervalDuration() {
    switch (difficultySelect.value) {
        case "1":
            return 5000; // Facile : 2 secondes
        case "2":
            return 2500; // Moyenne : 2.5 secondes
        default:
            return 1500; // Difficile : 1.5 secondes
    }
}

// Fonction pour vérifier si l'utilisateur a tapé le bon mot
function checkInput() {
    if (wordInput.value === currentWord) {
        // Mettre à jour le score
        score += 10;
        scoreDisplay.textContent = `Score : ${score}`;

        // Réinitialiser l'input et le mot
        wordInput.value = "";
        currentWord = "";

        // Afficher un feedback visuel
        wordDisplay.textContent = "Correct!";

        // Relancer l'intervalle pour afficher un nouveau mot
        setTimeout(() => {
            setNewWordInterval(); // Reconfigurer le prochain intervalle pour afficher un mot
        }, 10); // Petit délai avant de relancer
    }
}

// Événements
wordInput.addEventListener("input", checkInput);

startButton.addEventListener("click", () => {
    if (!gameRunning) {
        startGame();
    }
});
