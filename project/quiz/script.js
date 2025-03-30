body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(to bottom, #cceeff, #ffffff);
  margin: 0;
  padding: 20px;
  color: #333;
}

.container {
  max-width: 800px;
  margin: auto;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #0088cc;
  font-size: 2rem;
}

label, select, button {
  display: block;
  width: 100%;
  margin: 10px 0;
  font-size: 1rem;
}

button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #4fc3f7;
  color: white;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.question {
  margin-bottom: 20px;
  padding: 15px;
  border: 2px solid #eee;
  border-radius: 10px;
  background: #f9f9f9;
}

.options button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 14px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  background-color: #e0f7fa;
  cursor: pointer;
}

.options button:hover {
  background-color: #b2ebf2;
}

button.correct {
  background-color: #a5d6a7 !important;
  animation: pop 0.3s ease-in-out;
}

button.wrong {
  background-color: #ef9a9a !important;
  animation: shake 0.3s ease-in-out;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

#result {
  text-align: center;
  margin-top: 30px;
}

.hidden {
  display: none;
}

#mistakes {
  text-align: left;
  margin-top: 20px;
  font-size: 1rem;
}

#mistakes p {
  margin: 10px 0;
  line-height: 1.6;
}

/* 🎉 紙吹雪 */
.confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: fall 1.5s ease-out forwards;
}

@keyframes fall {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* 📱 スマホ対応 */
@media screen and (max-width: 600px) {
  body {
    padding: 10px;
  }

  .container {
    padding: 15px;
    box-shadow: none;
    border-radius: 0;
  }

  h1 {
    font-size: 1.4rem;
  }

  .question h2 {
    font-size: 1.1rem;
  }

  .options button {
    font-size: 1rem;
    padding: 12px;
  }

  #mistakes {
    font-size: 0.95rem;
  }
}

