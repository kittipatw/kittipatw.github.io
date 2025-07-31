const big_label = document.getElementById("big-label");
const checkbox = document.getElementById("hide-question");
const read_question_checkbox = document.getElementById("read-question");

let currentQuestion = "";
let currentAnswer = "";
let waitingForAnswer = false;

let display_status = "none";

let read_question = false;

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
  let num1 = Math.floor(Math.random() * 90) + 10; // 10 to 99
  let num2 = Math.floor(Math.random() * 90) + 10; // 10 to 99
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
      question_speech = `${num1} minus ${num2}`;
      break;
    case "x":
      answer = num1 * num2;
      question_speech = `${num1} times ${num2}`;
      break;
  }

  currentQuestion = question;
  currentAnswer = answer;
  document.getElementById("big-label").innerText = question;
  document.getElementById("small-label").innerText = "";

  let speech = new SpeechSynthesisUtterance(question_speech);

  speech.rate = 1;
  speech.lang = "en-US";

  if (read_question) {
    speechSynthesis.speak(speech);
  }

  waitingForAnswer = true;
}

// This function contains the core logic to be shared
function handleInteraction() {
  if (waitingForAnswer) {
    checkbox.disabled = true;

    // Move question to small-label and show answer in big-label
    document.getElementById("small-label").innerText = currentQuestion;
    document.getElementById("big-label").innerText = currentAnswer;

    let speech_2 = new SpeechSynthesisUtterance(currentAnswer);
    speech_2.rate = 1;
    speech_2.lang = "en-US";

    if (read_question) {
      speechSynthesis.speak(speech_2);
    }

    if (big_label.classList.contains("hide") && checkbox.checked) {
      big_label.classList.remove("hide");
    }

    waitingForAnswer = false;
  } else {
    checkbox.disabled = false;
    // Generate a new question
    if (!big_label.classList.contains("hide") && checkbox.checked) {
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

checkbox.addEventListener("change", function () {
  document.getElementById("big-label").classList.toggle("hide");
});

read_question_checkbox.addEventListener("change", function () {
  read_question = this.checked;
});
