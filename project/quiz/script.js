let quizData = [];
let currentQuestion = 0;
let score = 0;
let mistakes = [];

// サウンド関連
const correctSound = new Audio('quiz/sound/Quiz-Correct_Answer01-1.mp3');
const wrongSound = new Audio('quiz/sound/Quiz-Wrong_Buzzer02-1.mp3');
const resultSound = new Audio('quiz/sound/Quiz-Results01-1.mp3');

// 各要素の取得
const topicSelector = document.getElementById("topicSelector");
const startBtn = document.getElementById("startBtn");
const quizArea = document.getElementById("quizArea");
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const scoreDisplay = document.getElementById("score");
const mistakesContainer = document.getElementById("mistakes");

// 「理科」クイズ用全単元一覧（全20項目）
// ※ファイル名としても用いるので、CSVファイル名と一致するように注意してください。
const topics = [
  "1回　磁石",
  "2回　昆虫",
  "3回　流れる水のはたらき",
  "4回　季節と天気",
  "5回　総合（第1回～第4回の復習）",
  "6回　春の生物",
  "7回　太陽",
  "8回　水のすがた",
  "9回　光",
  "10回　総合（第6回～第9回の復習）",
  "11回　植物の成長",
  "12回　植物のつくりとはたらき",
  "13回　身のまわりの空気と水",
  "14回　金属",
  "15回　総合（第11回～第14回の復習）",
  "16回　夏の生物",
  "17回　星座をつくる星",
  "18回　星座の動き",
  "19回　動物",
  "20回　総合（第16回～第19回の復習）"
];

// 単元セレクターに各 option を追加（CSV存在チェック付き）
function populateTopicSelector() {
  topicSelector.innerHTML = "<option value=''>-- 単元を選んでね --</option>";
  topics.forEach(topic => {
    let option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    // CSVファイルの存在チェック (理科の場合)
    let csvPath = `quiz/quizzes/理科/${topic}.csv`;
    // HEADリクエストで存在確認
    fetch(csvPath, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) {
          // 存在しない場合は選択不可にし、表示に注釈を追加
          option.disabled = true;
          option.textContent += " (CSV未設定)";
        }
      })
      .catch(err => {
        option.disabled = true;
        option.textContent += " (CSV未設定)";
      });
    topicSelector.appendChild(option);
  });
}

// 単元選択が変わったら、選択状態の option が有効かチェックし、開始ボタンの有効・無効を更新
topicSelector.addEventListener("change", () => {
  let selectedOption = topicSelector.options[topicSelector.selectedIndex];
  startBtn.disabled = (selectedOption.value === "" || selectedOption.disabled);
});

// クイズ開始処理（CSV読み込み→パース→クイズ表示）
function loadSelectedQuiz() {
  const subject = "理科";  // subjectは固定
  const topic = topicSelector.value;
  const path = `quiz/quizzes/${subject}/${topic}.csv`;

  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error("ファイルが見つかりません: " + path);
      return res.text();
    })
    .then(csv => {
      quizData = parseCSV(csv);
      if (quizData.length === 0) throw new Error("CSVデータが空です");
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
      console.error("読み込みエラー:", err);
    });
}

// CSVをパースする処理
function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const result = [];

  // ヘッダー行を除いて読み込む
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
    } else {
      console.warn("無効な行（スキップされました）:", values);
    }
  }
  return result;
}

// 正解時のコンフェッティ演出（ちょっとしたお祝い！）
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

// 問題を表示
function showQuestion() {
  const q = quizData[currentQuestion];
  if (!q || !q.question || !q.options) {
    alert("クイズデータの読み込みに失敗しました。内容をご確認ください。");
    return;
  }
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

// 回答チェック
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
    showConfetti();  // 正解はお祝いしちゃいましょう！
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

// 結果表示
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

// クイズのリトライ処理
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  mistakes = [];
  resultContainer.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  showQuestion();
}

// DOMロード後に単元セレクターを初期化（準備万端！）
document.addEventListener("DOMContentLoaded", populateTopicSelector);

