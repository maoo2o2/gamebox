const quizData = [
  {
    question: "上流・中流・下流の特徴について、正しい組み合わせを選びなさい。",
    options: [
      "上流：緩やか、中流：急流、下流：蛇行",
      "上流：急流、中流：蛇行、下流：緩やか",
      "上流：蛇行、中流：緩やか、下流：急流",
      "上流：緩やか、中流：蛇行、下流：急流"
    ],
    answer: 1,
    explanation: "上流は山地で傾斜が急なため急流、中流は傾斜が緩やかになり蛇行し始め、下流は平地となり緩やかに流れます。"
  },
  {
    question: "侵食とは何ですか？",
    options: [
      "川底や川岸が削られること",
      "土や石が積もること",
      "川が曲がること",
      "水が蒸発すること"
    ],
    answer: 0,
    explanation: "侵食とは、流れる水の力で川底や川岸が削られることです。"
  },
  {
    question: "運搬とは何ですか？",
    options: [
      "魚が泳ぐこと",
      "水が流れること",
      "削られた土や石が水と一緒に運ばれること",
      "木の葉が浮かぶこと"
    ],
    answer: 2,
    explanation: "運搬とは、侵食によって削られた土や石が水の流れによって下流へ運ばれることです。"
  },
  {
    question: "堆積とは何ですか？",
    options: [
      "水が濁ること",
      "運ばれてきた土や石が積もること",
      "川が速く流れること",
      "川岸が崩れること"
    ],
    answer: 1,
    explanation: "堆積とは、上流から運ばれてきた土や石が水の流れが弱まったところで積もることです。"
  },
  {
    question: "川の上流で見られる地形は次のうちどれ？",
    options: ["扇状地", "三角州", "V字谷", "平野"],
    answer: 2,
    explanation: "上流では、激しい侵食作用によってV字型の深い谷（V字谷）が形成されます。"
  },
  {
    question: "川の中流でよく見られる地形は次のうちどれ？",
    options: ["滝", "三角州", "河岸段丘", "深い谷"],
    answer: 2,
    explanation: "中流では、川の侵食と堆積作用により河岸段丘が形成されることがあります。"
  },
  {
    question: "川の下流でよく見られる地形は次のうちどれ？",
    options: ["V字谷", "滝", "三角州", "急な斜面"],
    answer: 2,
    explanation: "下流では、運ばれてきた土砂が堆積して三角州が形成されます。"
  },
  {
    question: "流れる水の速さは、次のうち何に影響されますか？",
    options: ["水の色", "水の温度", "土地の傾き", "空の色"],
    answer: 2,
    explanation: "流れる水の速さは、主に土地の傾きによって変化します。傾きが急なほど水の流れは速くなります。"
  },
  {
    question: "河原の石が上流から下流に行くにつれて丸くなるのはなぜですか？",
    options: ["太陽に当たるから", "水に溶けるから", "転がりながら角が削れるから", "生物が食べるから"],
    answer: 2,
    explanation: "石は水と一緒に運ばれる間に、他の石とぶつかったり転がったりして角が削れ、徐々に丸くなっていきます。"
  },
  {
    question: "川の水量が増えると、運搬される土や石はどうなりますか？",
    options: ["変化しない", "少なくなる", "多くなる", "なくなる"],
    answer: 2,
    explanation: "水量が増えると水の流れが強くなり、より多くの土や石を運ぶことができるようになります。"
  },
  {
    question: "扇状地はどこにできやすいですか？",
    options: ["山地から平地に出たところ", "海に近いところ", "川の源流", "湖の中"],
    answer: 0,
    explanation: "扇状地は、山地から平地に出たところで、川の流れが急に弱まることで土砂が堆積してできます。"
  },
  {
    question: "川の水の量が増える原因として正しいものは？",
    options: ["晴れの日が続くこと", "強い雨が降ること", "気温が上がること", "風が強くなること"],
    answer: 1,
    explanation: "強い雨が降ると、地面に降った雨水が川に集まり、川の水量が増加します。"
  },
  {
    question: "川の流れが速いところでは、主にどの働きが強くなりますか？",
    options: ["堆積", "侵食", "蒸発", "凍結"],
    answer: 1,
    explanation: "川の流れが速いところでは、水の力が強くなるため、侵食の働きが特に強くなります。"
  },
  {
    question: "川の流れが遅いところでは、主にどの働きが見られますか？",
    options: ["堆積", "侵食", "蒸発", "凍結"],
    answer: 0,
    explanation: "川の流れが遅くなると水の力が弱まるため、運ばれてきた土や石が積もる堆積の働きが見られます。"
  },
  {
    question: "川の水の量が増えると、流れる水の働きはどうなりますか？",
    options: ["弱くなる", "変化しない", "強くなる", "なくなる"],
    answer: 2,
    explanation: "川の水量が増えると、水の力も強くなるため、侵食・運搬・堆積の働きがより強くなります。"
  },
  {
    question: "蛇行する川では、主にどの部分が削られやすいですか？",
    options: ["川の真ん中", "曲がっている外側", "曲がっている内側", "川底全体"],
    answer: 1,
    explanation: "蛇行している川では、水の流れが速い外側が特に削られやすくなります。"
  },
  {
    question: "流れる水の働きで正しい順番はどれですか？",
    options: ["堆積→侵食→運搬", "運搬→堆積→侵食", "侵食→運搬→堆積", "堆積→運搬→侵食"],
    answer: 2,
    explanation: "流れる水は、まず土や石を削り（侵食）、それを下流に運び（運搬）、最後に積もらせる（堆積）という順序で働きます。"
  },
  {
    question: "洪水から暮らしを守るための工夫として正しいものは？",
    options: ["木を切る", "堤防を作る", "川をせき止める", "川を埋める"],
    answer: 1,
    explanation: "堤防を作ることで、川の水が増えても周りの土地に水があふれにくくなります。"
  },
  {
    question: "河原の石の大きさは、上流から下流に向かってどのように変化しますか？",
    options: ["大きくなる", "変化しない", "小さくなる", "不規則に変化する"],
    answer: 2,
    explanation: "上流から下流に向かうにつれて、石は水に運ばれる間に削られて徐々に小さくなっていきます。"
  },
  {
    question: "三角州はなぜできるのでしょうか？",
    options: ["川の水が蒸発するから", "土や石が堆積するから", "波が強いから", "地震が起きるから"],
    answer: 1,
    explanation: "三角州は、川が海に注ぐ場所で水の流れが弱まり、運ばれてきた土や石が堆積してできます。"
  }
];
let currentQuestion = 0;
let score = 0;
let mistakes = [];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const mistakesContainer = document.getElementById('mistakes');

const correctSound = new Audio('sound/Quiz-Correct_Answer01-1.mp3');
const wrongSound = new Audio('sound/Quiz-Wrong_Buzzer02-1.mp3');
const resultSound = new Audio('sound/Quiz-Results01-1.mp3');

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
    mistakes.push({ q: q.question, correct: q.options[q.answer], explanation: q.explanation });
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
    mistakesContainer.innerHTML = '<h3>間違えた問題：</h3>' + mistakes.map(m => `<p><strong>Q:</strong> ${m.q}<br><strong>正解:</strong> ${m.correct}<br><em>${m.explanation}</em></p>`).join('');
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
