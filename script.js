let questions = JSON.parse(localStorage.getItem("questions")) || [];
let currentQuestionIndex = -1;
let correctCount = 0;
let wrongCount = 0;
let answeredQuestions = new Set();

const addMode = document.getElementById("add-mode");
const cardsMode = document.getElementById("cards-mode");
const congrats = document.getElementById("congrats");
const menu = document.getElementById("menu");
const saveBtn = document.getElementById("save-btn");
const backBtn = document.getElementById("back-btn");
const cardsBackBtn = document.getElementById("cards-back-btn");
const nextBtn = document.getElementById("next-btn");
const againBtn = document.getElementById("again-btn");
const congratsBackBtn = document.getElementById("congrats-back-btn");

const questionInput = document.getElementById("question");
const optionAInput = document.getElementById("optionA");
const optionBInput = document.getElementById("optionB");
const optionCInput = document.getElementById("optionC");
const optionDInput = document.getElementById("optionD");
const correctInput = document.getElementById("correct-answer");

const correctCountElement = document.getElementById("correct-count");
const wrongCountElement = document.getElementById("wrong-count");
const remainingCountElement = document.getElementById("remaining-count");

const quizQuestion = document.getElementById("quiz-question");
const optionsContainer = document.getElementById("options-container");

document.getElementById("add-mode-btn").addEventListener("click", () => {
    menu.classList.add("hidden");
    addMode.classList.remove("hidden");
});

document.getElementById("cards-mode-btn").addEventListener("click", () => {
    menu.classList.add("hidden");
    cardsMode.classList.remove("hidden");
    resetQuiz();
});

backBtn.addEventListener("click", () => {
    addMode.classList.add("hidden");
    menu.classList.remove("hidden");
});

cardsBackBtn.addEventListener("click", () => {
    cardsMode.classList.add("hidden");
    menu.classList.remove("hidden");
});

congratsBackBtn.addEventListener("click", () => {
    congrats.classList.add("hidden");
    menu.classList.remove("hidden");
});

againBtn.addEventListener("click", () => {
    congrats.classList.add("hidden");
    cardsMode.classList.remove("hidden");
    resetQuiz();
});

saveBtn.addEventListener("click", () => {
    const question = questionInput.value.trim();
    const options = {
        A: optionAInput.value.trim(),
        B: optionBInput.value.trim(),
        C: optionCInput.value.trim(),
        D: optionDInput.value.trim(),
    };
    const correctAnswer = correctInput.value.trim().toUpperCase();

    if (question && options.A && options.B && options.C && options.D && ["A", "B", "C", "D"].includes(correctAnswer)) {
        questions.push({ question, options, correctAnswer });
        localStorage.setItem("questions", JSON.stringify(questions));
        alert("Question saved!");
        questionInput.value = optionAInput.value = optionBInput.value = optionCInput.value = optionDInput.value = correctInput.value = "";
    } else {
        alert("Please fill all fields correctly!");
    }
});

function loadRandomQuestion() {
    if (answeredQuestions.size === questions.length) {
        showCongrats();
        return;
    }

    do {
        currentQuestionIndex = Math.floor(Math.random() * questions.length);
    } while (answeredQuestions.has(currentQuestionIndex));

    const { question, options } = questions[currentQuestionIndex];

    quizQuestion.textContent = question;
    optionsContainer.innerHTML = "";
    nextBtn.classList.add("hidden");

    Object.keys(options).forEach((key) => {
        const button = document.createElement("button");
        button.textContent = `${key}: ${options[key]}`;
        button.addEventListener("click", () => checkAnswer(key, button));
        optionsContainer.appendChild(button);
    });

    updateProgress();
}

function checkAnswer(selected, button) {
    const { correctAnswer } = questions[currentQuestionIndex];
    const buttons = optionsContainer.getElementsByTagName("button");

    Array.from(buttons).forEach((btn) => btn.disabled = true);

    if (selected === correctAnswer) {
        button.classList.add("correct");
        correctCount++;
        answeredQuestions.add(currentQuestionIndex);
    } else {
        button.classList.add("wrong");
        wrongCount++;
        Array.from(buttons).forEach((btn) => {
            if (btn.textContent.startsWith(correctAnswer)) {
                btn.classList.add("correct");
            }
        });
    }

    nextBtn.classList.remove("hidden");
    nextBtn.addEventListener("click", loadRandomQuestion, { once: true });
}

function updateProgress() {
    correctCountElement.textContent = correctCount;
    wrongCountElement.textContent = wrongCount;
    remainingCountElement.textContent = questions.length - answeredQuestions.size;
}

function showCongrats() {
    cardsMode.classList.add("hidden");
    congrats.classList.remove("hidden");
}

function resetQuiz() {
    correctCount = 0;
    wrongCount = 0;
    answeredQuestions = new Set();
    updateProgress();
    loadRandomQuestion();
}
