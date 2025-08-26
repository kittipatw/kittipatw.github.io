const big_label = document.getElementById("big-label");

const hide_question_toggle = document.getElementById("hide-question");
const voice_toggle = document.getElementById("voice");
const read_answer_toggle = document.getElementById("read-answer");

const include_time_question = document.getElementById("time_question");
const include_geography_question =
  document.getElementById("geography_question");

let currentQuestion = "";
let currentAnswer = "";
let currentThaiAnswer = "";
let currentQuestionType = "";
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
  }
});

document.getElementById("btn-th").addEventListener("change", () => {
  if (document.getElementById("btn-th").checked) {
    currentVoice = thaiVoice;
    currentLang = "th-TH";
    currentSpeechRate = 1;
  }
});

// This function contains the core logic to be shared
function handleInteraction() {
  // const use_time_question = Math.random() < 0.3;
  const use_addon_question = Math.random() < 1;
  const addon_mode = Math.floor(Math.random() * 2) + 1; // Random [1,2] 1=TIME 2=GEO

  if (waitingForAnswer) {
    // Show Answer
    // Move question to small-label and show answer in big-label
    small_label.innerText = currentQuestion;

    if (currentQuestionType === "math") {
      big_label.style.fontSize = "10em";
    } else if (currentQuestionType === "time") {
      big_label.style.fontSize = "7em";
    } else if (currentQuestionType === "geography") {
      big_label.style.fontSize = "7em";
    }

    big_label.innerText = currentAnswer;

    if (currentQuestionType === "math") {
      if (currentAnswer < 0 && currentLang === "th-TH") {
        currentAnswer = `ลบ${Math.abs(currentAnswer)}`;
      }
    }
    if (currentQuestionType === "time") {
      currentAnswer = currentThaiAnswer;
    }
    if (currentQuestionType === "geography") {
      currentAnswer = currentAnswer.split("").join(",");
    }

    let speech_2 = new SpeechSynthesisUtterance(currentAnswer);
    speech_2.rate = currentSpeechRate;

    if (currentQuestionType === "geography") {
      speech_2.voice = engVoice;
      speech_2.lang = "en-US";
    } else {
      speech_2.voice = currentVoice;
      speech_2.lang = currentLang;
    }

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

    if (include_time_question.checked && include_geography_question.checked) {
      if (use_addon_question) {
        if (addon_mode === 1) {
          generateTimeQuestion();
        } else if (addon_mode === 2) {
          const all_use = generateGeographyQuestion();
          if (all_use) {
            generateQuestion();
          }
        }
      } else {
        generateQuestion();
      }
    } else if (include_time_question.checked) {
      if (use_addon_question) {
        generateTimeQuestion();
      } else {
        generateQuestion();
      }
    } else if (include_geography_question.checked) {
      if (use_addon_question) {
        const all_use = generateGeographyQuestion();
        if (all_use) {
          generateQuestion();
        }
      } else {
        generateQuestion();
      }
    } else {
      generateQuestion();
    }
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
