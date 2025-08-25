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
      if (currentLang === "en-US") {
        question_speech = `${num1} plus ${num2}`;
      } else if (currentLang === "th-TH") {
        question_speech = `${num1} บวก ${num2}`;
      }
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

  // Logic for displaying question and answer then call speech
  currentQuestion = question;
  currentAnswer = answer;
  big_label.style.fontSize = "10em";
  big_label.innerText = question;
  small_label.innerText = "";

  let speech = new SpeechSynthesisUtterance(question_speech);

  speech.rate = currentSpeechRate;
  speech.voice = currentVoice;
  speech.lang = currentLang;

  if (read_question) {
    speechSynthesis.speak(speech);
  }

  waitingForAnswer = true;
  currentDisplay = "question";
  currentQuestionType = "math";
}
