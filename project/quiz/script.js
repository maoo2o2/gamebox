let quizData = [];
let currentQuestion = 0;
let score = 0;
let mistakes = [];

const correctSound = new Audio('quiz/sound/Quiz-Correct_Answer01-1.mp3');
const wrongSound = new Audio('quiz/sound/Quiz-Wrong_Buzzer02-1.mp3');
const resultSound = new Audio('quiz/sound/Quiz-Results01-1.mp3');

const subjectSelector = document.getElementById("subjectSelector");
const topicSelector = document.getElementById("topicSelector");
const startBtn = document.getElementById("startBtn");
const quizArea = document.getElementById("quizArea");
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const mistakesContainer = document.getElementById("mistakes");

const topics = {
  "理科": ["water"],
  "社会": []
};

subjectSelector.addEventListener("change", () => {
  const subject = subjectSelector.value;
  topicSelector.innerHTML = "<option value=''>-- 単元を選んでね --</option>";

  if (topics[subject]) {
    topics[subject].forEach(topic => {
      const option = document.createElement("option");
      option.value = topic;
      option.textContent = topic;
      topicSelector.appendChild(option);
    });
    topicSelector.disabled = false;
  } else {
    topicSelector.disabled = true;
  }
  startBtn.disabled = true;
});

topicSelector.addEventListener("change", () => {
  startBtn.disabled = !topicSelector.value;
});

function loadSelectedQuiz() {
  const subject = subjectSelector.value;
  const topic = topicSelector.value;
  const path = `quiz/quizzes/${subject}/${topic}.csv`;

  fetch(path)
    .then(res => res.text())
    .then(csv => {
      quizData = parseCSV(csv);
      startBtn.disabled = true;
      quizArea.classList.remove("hidden");
      resultContainer.classList.add("hidden");
      currentQuestion = 0;
      score = 0;
      mistakes = [];
      showQuestion();
    })
    .catch(err => {
      alert("CSVファイルが読み込めませんでした：" + err);
    });
}

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const regex = /("([^"]*)"|[^,]+)(?=,|$)/g;
    const values = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      values.push(match[2] !== undefined ? match[2] : match[1]);
    }

    if (values.length >= 7) {
      result.push({
        question: values[0],
        options: [values[1], values[2], values[3], values[4]],
        answer: parseInt(values[5]),
        explanation: values[6]
      });
    }
  }

  return result;
}

function showConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
    confetti.appendChild(piece);
  }
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1500);
}

function showQuestion() {
  const q = quizData[currentQuestion];
  quizContainer.innerHTML = `
    <div class="question">
      <h2>問題 ${currentQuestion + 1}</h2>
      <p>${q.question}</p>
      <div class="options">
        ${q.options.map((opt, i) => `<button onclick="checkAnswer(${i})">${opt}</button>`).join('')}
      </div>
    </div>
  `;
}

function checkAnswer(selected) {
  const q = quizData[currentQuestion];
  const buttons = document.querySelectorAll('.options button');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === selected && i !== q.answer) btn.classList.add('wrong');
  });

  if (selected === q.answer) {
    correctSound.play();
    score++;
    showConfetti();
  } else {
    wrongSound.play();
    mistakes.push({
      q: q.question,
      correct: q.options[q.answer],
      explanation: q.explanation
    });
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

function showResult() {
  resultSound.play();
  quizContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  scoreDisplay.textContent = `あなたの得点は ${score} / ${quizData.length} 点です！`;

  if (mistakes.length > 0) {
    mistakesContainer.innerHTML = '<h3>間違えた問題：</h3>' + mistakes.map(m =>
      `<p><strong>Q:</strong> ${m.q}<br><strong>正解:</strong> ${m.correct}<br><em>${m.explanation}</em></p>`
    ).join('');
  } else {
    mistakesContainer.innerHTML = '<p>全問正解！すばらしい！</p>';
  }
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  mistakes = [];
  resultContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  showQuestion();
}

