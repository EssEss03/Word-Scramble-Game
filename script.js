document.addEventListener("DOMContentLoaded", () => {
    const scrambledWordElement = document.getElementById("scrambledWord");
    const userInput = document.getElementById("userInput");
    const submitButton = document.getElementById("submitGuess");
    const hintButton = document.getElementById("hintButton");
    const hintElement = document.getElementById("hint");
    const timerElement = document.getElementById("timer");
    const scoreElement = document.getElementById("score");
    const startGameButton = document.getElementById("startGame");
    const genreSelect = document.getElementById("genre");
    const categorySelect = document.getElementById("category");
    const gameContent = document.querySelector(".game-content");

    let currentWord = "";
    let scrambledWord = "";
    let hint = "";
    let score = 0;
    let timeLeft = 30;
    let timer;

    startGameButton.addEventListener("click", () => {
        gameContent.style.display = "block";
        fetchWord();
        startTimer();
    });

    async function fetchWord() {
        const genre = genreSelect.value;
        const category = categorySelect.value;
        const wordLength = getWordLength(category);
        
        try {
            const response = await fetch("https://random-word-api.herokuapp.com/word?number=1&length=" + wordLength);
            const data = await response.json();
            currentWord = data[0];
            const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`);
            const definitionData = await definitionResponse.json();
            hint = definitionData[0].meanings[0].definitions[0].definition || "No hint available.";
            scrambledWord = scrambleWord(currentWord);
            scrambledWordElement.textContent = scrambledWord;
            hintElement.textContent = "Hint will appear here";
        } catch (error) {
            console.error("Error fetching word:", error);
        }
    }

    function getWordLength(category) {
        const lengthMap = { easy: 4, medium: 6, hard: 8 };
        return lengthMap[category] || 5;
    }

    function scrambleWord(word) {
        return word.split('').sort(() => Math.random() - 0.5).join('');
    }

    function startTimer() {
        timeLeft = 30;
        timerElement.textContent = timeLeft;
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert("Time's up! The correct word was " + currentWord);
                fetchWord();
            }
        }, 1000);
    }

    submitButton.addEventListener("click", () => {
        if (userInput.value.toLowerCase() === currentWord.toLowerCase()) {
            score++;
            scoreElement.textContent = score;
            fetchWord();
            startTimer();
            userInput.value = "";
        } else {
            alert("Incorrect! Try again.");
        }
    });

    hintButton.addEventListener("click", () => {
        hintElement.textContent = hint;
    });
});