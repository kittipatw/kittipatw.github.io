const big_label = document.getElementById("big-label");
const hide_question_toggle = document.getElementById("hide-question");
const voice_toggle = document.getElementById("voice");
const read_answer_toggle = document.getElementById("read-answer");

let currentQuestion = "";
let currentAnswer = "";
let waitingForAnswer = false;

let display_status = "none";

let read_question = false;
let read_answer = true;

let voices = speechSynthesis.getVoices();
let engVoice = null;
let thaiVoice = voices.find((voice) => voice.lang === "th-TH");

let currentVoice = engVoice;
let currentLang = "en-US";
let currentSpeechRate = 1;

let currentDisplay = "none";

const debug_area = document.getElementById("debug-area");

document.getElementById("btn-en").addEventListener("change", () => {
  if (document.getElementById("btn-en").checked) {
    currentVoice = engVoice;
    currentLang = "en-US";
    currentSpeechRate = 1;
    updateDebugArea();
  }
});

document.getElementById("btn-th").addEventListener("change", () => {
  if (document.getElementById("btn-th").checked) {
    currentVoice = thaiVoice;
    currentLang = "th-TH";
    currentSpeechRate = 1;
    updateDebugArea();
  }
});

// For generate medium difficulty multiplication problem
function generate_multiplication_operand() {
  const roundFriendly = [10, 20, 30, 40, 50];

  while (true) {
    const a = Math.floor(Math.random() * 90) + 10; // 10 to 99
    const b = Math.floor(Math.random() * 30) + 10; // 10 to 39

    const closeToRoundA = roundFriendly.some(
      (num) => a - num <= 2 && a - num >= 0
    );
    const closeToRoundB = roundFriendly.some(
      (num) => b - num <= 2 && b - num >= 0
    );
    const divisibleA = a % 10 === 0;
    const divisibleB = b % 10 === 0;

    if (divisibleA && divisibleB) {
      continue;
    }

    if (closeToRoundA && b % 10 > 4) {
      continue;
    }
    if (closeToRoundB && a % 10 > 4) {
      continue;
    }

    if (
      (closeToRoundA || closeToRoundB || divisibleA || divisibleB) &&
      a !== 10 &&
      b !== 10
    ) {
      if (Math.random() < 0.5) {
        return [a, b];
      } else {
        return [b, a];
      }
    }
  }
}

function generateQuestion() {
  let num1 = Math.floor(Math.random() * (99 - 11 + 1)) + 11; // 11 to 99
  let num2 = Math.floor(Math.random() * (99 - 11 + 1)) + 11; // 11 to 99
  const operators = ["+", "-", "x"];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  // If the random operator is multiplication, we call the function to give us medium difficulty problem
  if (operator === "x") {
    [num1, num2] = generate_multiplication_operand();
  }

  let question = `${num1} ${operator} ${num2}`;
  let question_speech = `${num1} ${operator} ${num2}`;
  let answer;
  switch (operator) {
    case "+":
      answer = num1 + num2;
      break;
    case "-":
      answer = num1 - num2;
      if (currentLang === "en-US") {
        question_speech = `${num1} minus ${num2}`;
      } else if (currentLang === "th-TH") {
        question_speech = `${num1} ลบ ${num2}`;
      }
      break;
    case "x":
      answer = num1 * num2;
      if (currentLang === "en-US") {
        question_speech = `${num1} times ${num2}`;
      } else if (currentLang === "th-TH") {
        question_speech = `${num1} คูณ ${num2}`;
      }
      break;
  }

  currentQuestion = question;
  currentAnswer = answer;
  document.getElementById("big-label").innerText = question;
  document.getElementById("small-label").innerText = "";

  let speech = new SpeechSynthesisUtterance(question_speech);

  speech.rate = currentSpeechRate;
  speech.voice = currentVoice;
  speech.lang = currentLang;

  if (read_question) {
    speechSynthesis.speak(speech);
  }

  waitingForAnswer = true;
  currentDisplay = "question";
}

// This function contains the core logic to be shared
function handleInteraction() {
  if (waitingForAnswer) {
    // hide_question_toggle.disabled = true;

    // Move question to small-label and show answer in big-label
    document.getElementById("small-label").innerText = currentQuestion;
    document.getElementById("big-label").innerText = currentAnswer;

    if (currentAnswer < 0 && currentLang === "th-TH") {
      currentAnswer = `ลบ${Math.abs(currentAnswer)}`;
    }

    let speech_2 = new SpeechSynthesisUtterance(currentAnswer);
    speech_2.rate = currentSpeechRate;
    speech_2.voice = currentVoice;
    speech_2.lang = currentLang;

    if (read_question && read_answer) {
      speechSynthesis.speak(speech_2);
    }

    big_label.classList.remove("hide");

    waitingForAnswer = false;
    currentDisplay = "answer";
  } else {
    // hide_question_toggle.disabled = false;
    // Generate a new question
    if (hide_question_toggle.checked) {
      big_label.classList.add("hide");
    }
    generateQuestion();
  }
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault(); // prevent page scroll
    handleInteraction();
  }
});

document.querySelectorAll(".touch-area").forEach(function (el) {
  el.addEventListener(
    "touchstart",
    function (event) {
      event.preventDefault(); // Prevents scrolling or zooming if needed
      handleInteraction();
    },
    { passive: false }
  );
});

hide_question_toggle.addEventListener("change", function () {
  if (currentDisplay === "question" && this.checked) {
    big_label.classList.add("hide");
  } else if (currentDisplay === "question" && !this.checked) {
    big_label.classList.remove("hide");
  }
  // document.getElementById("big-label").classList.toggle("hide");
});

voice_toggle.addEventListener("change", function () {
  read_question = this.checked;
  if (this.checked) {
    voiceControl.classList.remove("d-none");
  } else {
    voiceControl.classList.add("d-none");
  }
});

read_answer_toggle.addEventListener("change", function () {
  read_answer = this.checked;
});
