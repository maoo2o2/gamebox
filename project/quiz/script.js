let quizData = [];
let currentQuestion = 0;
let score = 0;
let mistakes = [];

// サウンド関連
const correctSound = new Audio('quiz/sound/Quiz-Correct_Answer01-1.mp3');
const wrongSound = new Audio('quiz/sound/Quiz-Wrong_Buzzer02-1.mp3');
const resultSound = new Audio('quiz/sound/Quiz-Results01-1.mp3');

// 単元リスト
const topicsBySubject = {
  "理科": [
    "1回　磁石", "2回　昆虫", "3回　流れる水のはたらき", "4回　季節と天気",
    "5回　総合（第1回～第4回の復習）", "6回　春の生物", "7回　太陽", "8回　水のすがた",
    "9回　光", "10回　総合（第6回～第9回の復習）", "11回　植物の成長", "12回　植物のつくりとはたらき",
    "13回　身のまわりの空気と水", "14回　金属", "15回　総合（第11回～第14回の復習）",
    "16回　夏の生物", "17回　星座をつくる星", "18回　星座の動き", "19回　動物", "20回　総合（第16回～第19回の復習）"
  ],
  "社会": [
    "第1回_健康で住みよいくらし",
    "第2回_ものを売る仕事",
    "第3回_昔のくらしと今のくらし",
    "第4回_都道府県と地方（1)",
    "第6回_都道府県と地方（2)",
    "第7回_地図の見方（1)",
    "第8回_地図の見方（2)",
    "第9回_一年中あたたかい地方のくらし",
    "第11回_寒さのきびしい地方のくらし",
    "第12回_雪の多い地方のくらし",
    "第13回_冬に晴れる日の多い地方のくらし",
    "第14回_雨の少ない地方のくらし",
    "第16回_盆地のくらし",
    "第17回_低い土地のくらし",
    "第18回_高い土地のくらし",
    "第19回_海とともにあるくらし"
  ]
};

// 各要素取得
const topicSelector = document.getElementById("topicSelector");
const startBtn = document.getElementById("startBtn");
const quizArea = document.getElementById("quizArea");
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const mistakesContainer = document.getElementById("mistakes");

// グローバルで設定された科目を取得
const SUBJECT = typeof QUIZ_SUBJECT !== 'undefined' ? QUIZ_SUBJECT : '理科';

// 単元セレクター初期化
function populateTopicSelector() {
  topicSelector.innerHTML = "<option value=''>-- 単元を選んでね --</option>";
  if (!topicsBySubject[SUBJECT]) return;
  topicsBySubject[SUBJECT].forEach(topic => {
    let option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    const csvPath = `quiz/quizzes/${SUBJECT}/${topic}.csv`;
    fetch(csvPath, { method: 'HEAD' })
      .then(res => { if (!res.ok) { option.disabled = true; option.textContent += " (CSV未設定)"; } })
      .catch(()=>{ option.disabled = true; option.textContent += " (CSV未設定)"; });
    topicSelector.appendChild(option);
  });
}

// ボタントグル
topicSelector.addEventListener("change", () => {
  const sel = topicSelector.options[topicSelector.selectedIndex];
  startBtn.disabled = (sel.value === "" || sel.disabled);
});

// クイズ開始
function loadSelectedQuiz() {
  const topic = topicSelector.value;
  const path  = `quizzes/${SUBJECT}/${topic}.csv`;
  fetch(path)
    .then(res => { if (!res.ok) throw new Error(path); return res.text(); })
    .then(csv => {
      quizData = parseCSV(csv);
      startBtn.disabled = true;
      quizArea.classList.remove("hidden");
      resultContainer.classList.add("hidden");
      currentQuestion = 0; score = 0; mistakes = [];
      showQuestion();
    })
    .catch(err => alert("読み込みエラー：" + err));
}

// CSVパース
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");
  const hasImage = headers[1] === "image";
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/("([^"]*)"|[^,]+)(?=,|$)/g).map(v=>v.replace(/^"|"$/g,""));
    if ((hasImage && values.length>=8) || (!hasImage && values.length>=7)) {
      let idx = 0;
      const q = { question: values[idx++] };
      if (hasImage) q.image = values[idx++];
      q.options = [values[idx++], values[idx++], values[idx++], values[idx++]];
      q.answer = parseInt(values[idx++],10);
      q.explanation = values[idx++];
      result.push(q);
    }
  }
  return result;
}

// コンフェッティ
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

// 問題表示
function showQuestion() {
  const q = quizData[currentQuestion];
  let imgHtml = q.image ? `<img src="quizzes/${SUBJECT}/images/${q.image}" alt="問題画像" class="question-image">` : "";
  quizContainer.innerHTML = `
    <div class="question">
      <h2>問題 ${currentQuestion + 1}</h2>
      ${imgHtml}
      <p>${q.question}</p>
      <div class="options">
        ${q.options.map((opt,i)=>`<button onclick="checkAnswer(${i})">${opt}</button>`).join("")}
      </div>
    </div>
  `;
}

// 回答チェック
function checkAnswer(selected) {
  const q = quizData[currentQuestion];
  const buttons = document.querySelectorAll('.options button');
  buttons.forEach((btn,i)=>{
    btn.disabled = true;
    if (i===q.answer) btn.classList.add('correct');
    if (i===selected && i!==q.answer) btn.classList.add('wrong');
  });
  if (selected === q.answer) {
    correctSound.play(); score++; showConfetti();
  } else {
    wrongSound.play();
    mistakes.push({ q: q.question, correct: q.options[q.answer], explanation: q.explanation });
  }
  setTimeout(()=>{
    currentQuestion++;
    if (currentQuestion < quizData.length) showQuestion();
    else showResult();
  }, 1500);
}

// 結果表示
function showResult() {
  resultSound.play();
  document.getElementById("quiz").classList.add('hidden');
  resultContainer.classList.remove('hidden');
  scoreDisplay.textContent = `あなたの得点は ${score} / ${quizData.length} 点です！`;
  if (mistakes.length) {
    mistakesContainer.innerHTML = '<h3>間違えた問題：</h3>' +
      mistakes.map(m=>`<p><strong>Q:</strong> ${m.q}<br><strong>正解:</strong> ${m.correct}<br><em>${m.explanation}</em></p>`).join('');
  } else {
    mistakesContainer.innerHTML = '<p>全問正解！すばらしい！</p>';
  }
}

// リトライ
function restartQuiz() {
  currentQuestion = 0; score = 0; mistakes = [];
  resultContainer.classList.add('hidden');
  document.getElementById("quiz").classList.remove('hidden');
  showQuestion();
}

// 初期化
document.addEventListener("DOMContentLoaded", populateTopicSelector);
