// url de l'api où l'on récupère les mots
const wordsApiHost = "https://trouve-mot.fr/api/";

// éléments sur la page
const word_to_write = document.getElementById("word_to_write");
const nb_words = document.getElementById("nb_words");
const length_words = document.getElementById("length_words");
const categoriy = document.getElementById("category_words");
const screen = document.getElementById("screen");
const buttonStart = document.getElementById("start");
const inputZone = document.getElementById("input_keyboard");
const score = document.getElementById("score");
const timeChrono = document.getElementById("time");
const time = document.getElementById("chrono");
const checkAccel = document.getElementById("accel");
const score_table = document.getElementById("score_table");

// constantes
const timeTotalStart = 60;
const baseInterval = 1000;
const speedAccel = 20;

// variables pour la gestion du jeu
let nbWords = nb_words.value;
let lenWord = length_words.value;
let words = [];
let isGameRunning = false;
let nCategory = categoriy.value;
let timeCurrentChrono = timeTotalStart;
let currentInterval = baseInterval;
let interval;
let wordsToPrint = [];

buttonStart.addEventListener("click", () => {
	if (!isGameRunning) startGame();
	else stopGame();
});

inputZone.addEventListener("input", check);

length_words.addEventListener("change", () => {
	lenWord = length_words.value;
});

nb_words.addEventListener("change", () => {
	nbWords = nb_words.value;
});

categoriy.addEventListener("change", () => {
	nCategory = categoriy.value;
});

async function getRandomWords() {
	return await fetch(wordsApiHost + "random/" + nbWords);
}

async function getRandomWordsWithLen(){
	return await fetch(
		wordsApiHost + "maxsize/" + lenWord + "/" + nbWords
	);
}

async function getRandomWordsWithCategory(){
	return await fetch(
		wordsApiHost + "categorie/" + nCategory + "/" + nbWords
	)
}

/**
 * Recuperation des mots depuis l'API
 * Met les mots dans le tableau global words.
 */
async function getWords() {
	// cas où la catégorie n'est pas définie
	if (nCategory == 0) {
		let response;
		// catégorie sans nombre de caractères défini
		if (lenWord == 0) {
			response = await getRandomWords();
		} // nombre de caractères défini
		else {
			response = await getRandomWordsWithLen();
		}
		const data = await response.json();
		words.push(...data);
		// cas où la catégorie est définie
	} else {
		const response = await getRandomWordsWithCategory();
		const data = await response.json();
		words.push(...data);
	}
}

/**
 * Affiche le mot à l'écran
 * @param {Object} word Le mot récupéré dans l'API
 */
function addWordToScreen(word) {
	// screen est le "container" où les mots sont stockés
	screen.innerHTML += "<div><p>" + word.name + "</p></div>";
}

/**
 * Initialiser le lancement du jeu
 * @returns {Boolean}
 */
function stopGame() {
	clearInterval(interval);
	resetTimer();
	start.innerText = "Commencer";
	isGameRunning = false;	
	words = [];
	timeOver = false;
	currentInterval = baseInterval;
	screen.innerHTML = "";
	clearInterval(timerInterval);
	clearInterval(interval);
	addScore(score.textContent);
	inputZone.setAttribute("disabled", "");
	inputZone.value = "";
	score.innerText = "0";
	enableButtons();
}

/**
 * Lancer le jeu
 */
function startGame() {
	disableButtons();
	startTimer();
	try {
		getWords();
	} catch (error) {
		console.error("Erreur:", error);
	}
	isGameRunning = true;
	start.innerText = "Recommencer";
	displayNewWord();
	interval = setInterval(() => {
		accel();
		displayNewWord();
	}, getDisplayNewWordInterval());
}

function getDisplayNewWordInterval() {
	return time.value * currentInterval;
}

function displayNewWord() {
	if (words.length <= 0) return;
	let word = words[0];
	wordsToPrint.push(word);
	addWordToScreen(word);
	words.shift();
}

/**
 * Ne pas avoir accès aux configurations quand le jeu est en marche
 */
function disableButtons() {
	time.setAttribute("disabled", "");
	nb_words.setAttribute("disabled", "");
	categoriy.setAttribute("disabled", "");
	length_words.setAttribute("disabled", "");
	checkAccel.setAttribute("disabled", "");
}

/**
 * Configurer le jeu avant de commencer
 */
function enableButtons() {
	time.removeAttribute("disabled");
	nb_words.removeAttribute("disabled");
	categoriy.removeAttribute("disabled");
	length_words.removeAttribute("disabled");
	checkAccel.removeAttribute("disabled");
	inputZone.removeAttribute("disabled");
}

/**
 * Fonction pour la difficulté acceleration
 */
function accel() {
	if (!checkAccel.checked) return;
	clearInterval(interval);
	currentInterval = currentInterval - speedAccel;
	interval = setInterval(() => {
		if (words.length > 0) {
			accel();
			let word = words[0];
			wordsToPrint.push(word);
			addWordToScreen(word);
			words.shift();
		}
	}, time.value * currentInterval);
}

/**
 * Verification de la saisie du mot à recopier
 */
function check() {
	let input = inputZone.value.trim();
	let word = screen.children[0].innerText;
	if (input != word) return;

	screen.removeChild(screen.children[0]);
	inputZone.value = "";
	score.innerText = parseInt(score.innerText) + 1;
}

/**
 * Déclencher le compte à rebours
 */
function startTimer() {
	timeCurrentChrono = timeTotalStart + parseInt(time.value);
	timerInterval = setInterval(() => {
		timeCurrentChrono = timeCurrentChrono - 1;
		if (timeCurrentChrono == 0) {
			timeCurrentChrono = 0;
			stopGame();
		}
		timeChrono.textContent = timeCurrentChrono;
	}, 1000);
}

function resetTimer() {
	clearInterval(timerInterval);
	timeCurrentChrono = timeTotalStart;
	timeChrono.textContent = timeCurrentChrono;
}

function addScore(score) {
	const scores = JSON.parse(localStorage.getItem("scores"));
	scores.push(parseInt(score));
	scores.sort((a, b) => {
		return b - a;
	});
	localStorage.setItem("scores", JSON.stringify(scores));
	updateTable();
}

function updateTable() {
	let scores = JSON.parse(localStorage.getItem("scores"));
	if (!scores) {
		scores = [];
		localStorage.setItem("scores", JSON.stringify(scores));
	}

	const rows = Array.from(score_table.rows);
	rows.slice(1).forEach((row) => score_table.deleteRow(row.rowIndex)); // Supprime toutes les lignes sauf l'en-tête

	// Ajouter les nouvelles lignes triées
	for (let index = 0; index < 5 && index < scores.length; index++) {
		const row = score_table.insertRow();
		const scoreCell = row.insertCell(0);
		scoreCell.textContent = scores[index];
	}
}
updateTable();
