// quiz/script.js

// ── データとステート ──
let quizData = [];
let currentQuestion = 0;
let score = 0;
let mistakes = [];

// ── サウンド設定 ──
const correctSound = new Audio('quiz/sound/Quiz-Correct_Answer01-1.mp3');
const wrongSound   = new Audio('quiz/sound/Quiz-Wrong_Buzzer02-1.mp3');
const resultSound  = new Audio('quiz/sound/Quiz-Results01-1.mp3');

// ── 科目別単元リスト ──
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
    "第4回_綿って何に使う？","第5回_働く人とわたしたち","第6回_どんな運ぶ？","第7回_初めての選挙",
    "第8回_情報を伝える","第9回_くらしを支える水","第10回_わたしたちのくらしと都道府県",
    "第11回_交通のはたらき","第12回_店ではたらく人","第13回_米づくり","第14回_日本の農業",
    "第15回_総合（第11回～第14回の復習）","第16回_世界の人々の暮らし","第17回_日本の位置と地形",
    "第18回_日本の気候区分","第19回_総合（第16回～第18回の復習）"
  ]
  // …他科目も同様に…
};

// ── 単元セレクターにオプションを追加 ──
function populateTopicSelector() {
  const subject = SUBJECT;
  const selector = document.getElementById('topicSelector');
  selector.innerHTML = '<option value="">-- 単元を選択 --</option>';
  topicsBySubject[subject].forEach((topic, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = topic;
    selector.appendChild(opt);
  });
  selector.addEventListener('change', () => {
    if (selector.value !== "") {
      loadQuizFile(selector.value);
    }
  });
}

// ── CSV 読み込み ──
function loadQuizFile(topicIndex) {
  fetch(`quiz/quizzes/${SUBJECT}/data/${topicIndex}.csv`)
    .then(res => res.text())
    .then(text => {
      quizData = parseCSV(text);
      currentQuestion = 0;
      score = 0;
      mistakes = [];
      showQuestion();
    })
    .catch(err => alert("読み込みエラー：" + err));
}

// ── CSVパース ──
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  const hasImage = headers.includes("image");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    // CSV の空セルにも空文字を割り当てて列ズレを防止
    let vals = lines[i].split(",").map(v => v.trim());
    while (vals.length < headers.length) vals.push("");

    let idx = 0;
    const q = { question: vals[idx++] || "" };

    if (hasImage) {
      q.image = vals[idx++].trim() || null;
    } else {
      q.image = null;
    }

    q.options = [vals[idx++], vals[idx++], vals[idx++], vals[idx++]];
    q.answer = parseInt(vals[idx++], 10);
    q.explanation = vals[idx++] || "";

    if (q.options.length === 4 && !isNaN(q.answer)) {
      result.push(q);
    } else {
      console.warn(`スキップ: 行${i + 1}`, q);
    }
  }

  return result;
}

// ── コンフェッティ演出 ──
function showConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = `hsl(${Math.random()*360},100%,70%)`;
    confetti.appendChild(piece);
  }
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1500);
}

// ── 問題表示 ──
function showQuestion() {
  const q = quizData[currentQuestion];
  const imgHtml = q.image
    ? `<img src="quiz/quizzes/${SUBJECT}/images/${q.image}" class="question-image" alt="問題画像">`
    : "";
  // …以下、元の実装のまま…
}

// ── 解答チェック、結果表示 などの関数──
// function checkAnswer() { … }
// function showResult() { … }

// ── リトライ ──
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  mistakes = [];
  resultContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  showQuestion();
}

// ── 初期化 ──
window.addEventListener('load', populateTopicSelector);
