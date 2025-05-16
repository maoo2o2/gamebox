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
  "理科": [
    "1回　磁石","2回　昆虫","3回　流れる水のはたらき","4回　季節と天気",
    "5回　総合（第1回～第4回の復習）","6回　春の生物","7回　太陽","8回　水のすがた",
    "9回　光","10回　総合（第6回～第9回の復習）","11回　植物の成長","12回　植物のつくりとはたらき",
    "13回　身のまわりの空気と水","14回　金属","15回　総合（第11回～第14回の復習）",
    "16回　夏の生物","17回　星座をつくる星","18回　星座の動き","19回　動物","20回　総合（第16回～第19回の復習）"
  ],
  "社会": [
    "第1回_健康で住みよいくらし","第2回_ものを売る仕事","第3回_昔のくらしと今のくらし",
    "第4回_都道府県と地方（1)","第6回_都道府県と地方（2)","第7回_地図の見方（1)",
    "第8回_地図の見方（2)","第9回_一年中あたたかい地方のくらし","第11回_寒さのきびしい地方のくらし",
    "第12回_雪の多い地方のくらし","第13回_冬に晴れる日の多い地方のくらし",
    "第14回_雨の少ない地方のくらし","第16回_盆地のくらし","第17回_低い土地のくらし",
    "第18回_高い土地のくらし","第19回_海とともにあるくらし"
  ]
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

