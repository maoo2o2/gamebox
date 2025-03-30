const correctSound = new Audio('sound/Quiz-Correct_Answer01-1.mp3');
const wrongSound = new Audio('sound/Quiz-Wrong_Buzzer02-1.mp3');
const resultSound = new Audio('sound/Quiz-Results01-1.mp3');

let currentQuestion = 0;
let score = 0;
let mistakes = [];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const mistakesContainer = document.getElementById('mistakes');

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

window.onload = showQuestion;

