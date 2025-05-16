// quiz/script.js（初期安定版に戻しました）

// ── データとステート ──
let quizData = [];
let currentQuestion = 0;
let score = 0;
let mistakes = [];

const correctSound = new Audio('quiz/sound/Quiz-Correct_Answer01-1.mp3');
const wrongSound   = new Audio('quiz/sound/Quiz-Wrong_Buzzer02-1.mp3');
const resultSound  = new Audio('quiz/sound/Quiz-Results01-1.mp3');

const topicsBySubject = {
  "理科": ["1回　磁石","2回　昆虫","3回　流れる水のはたらき","4回　季節と天気"],
  "社会": ["第1回_健康で住みよいくらし","第12回_雪の多い地方のくらし"]
};

const topicSelector = document.getElementById("topicSelector");
const startBtn = document.getElementById("startBtn");
const quizArea = document.getElementById("quizArea");
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const mistakesContainer = document.getElementById("mistakes");

const SUBJECT = typeof QUIZ_SUBJECT !== 'undefined' ? QUIZ_SUBJECT : '理科';

function populateTopicSelector() {
  topicSelector.innerHTML = '<option value="">-- 単元を選んでね --</option>';
  (topicsBySubject[SUBJECT] || []).forEach(topic => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicSelector.appendChild(option);
  });
}

function loadSelectedQuiz() {
  const topic = topicSelector.value;
  const path = `quiz/quizzes/${SUBJECT}/${topic}.csv`;
  fetch(path)
    .then(res => res.text())
    .then(csv => {
      quizData = parseCSV(csv);
      currentQuestion = 0;
      score = 0;
      mistakes = [];
      startBtn.disabled = true;
      quizArea.classList.remove("hidden");
      resultContainer.classList.add("hidden");
      showQuestion();
    });
}

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");
  const hasImage = headers.includes("image");

  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.replace(/^"|"$/g, ""));
    let idx = 0;
    const q = { question: vals[idx++] };
    if (hasImage) q.image = vals[idx++] || null;
    q.options = [vals[idx++], vals[idx++], vals[idx++], vals[idx++]];
    q.answer = parseInt(vals[idx++], 10);
    q.explanation = vals[idx++] || "";
    return q;
  }).filter(q => q.options.length === 4 && !isNaN(q.answer));
}

function showQuestion() {
  const q = quizData[currentQuestion];
  const imgHtml = q.image ? `<img src="quiz/quizzes/${SUBJECT}/images/${q.image}" class="question-image">` : "";
  const optionsHtml = q.options.map((opt, i) => `<button onclick="checkAnswer(${i})">${opt}</button>`).join("");
  quizContainer.innerHTML = `<div class="question"><h2>問題 ${currentQuestion + 1}</h2>${imgHtml}<p>${q.question}</p><div class="options">${optionsHtml}</div></div>`;
}

function checkAnswer(selected) {
  const q = quizData[currentQuestion];
  const btns = document.querySelectorAll('.options button');
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add('correct');
    if (i === selected && i !== q.answer) b.classList.add('wrong');
  });
  if (selected === q.answer) {
    correctSound.play();
    score++;
  } else {
    wrongSound.play();
    mistakes.push({ q: q.question, correct: q.options[q.answer], explanation: q.explanation });
  }
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) showQuestion();
    else showResult();
  }, 1000);
}

function showResult() {
  resultSound.play();
  quizContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  scoreDisplay.textContent = `得点: ${score} / ${quizData.length}`;
  mistakesContainer.innerHTML = mistakes.map(m => `<p>Q: ${m.q}<br>正解: ${m.correct}<br>${m.explanation}</p>`).join('');
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  mistakes = [];
  resultContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  showQuestion();
}

window.addEventListener('load', populateTopicSelector);

