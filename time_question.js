function generateTimeQuestion() {
  const operations = ["add", "subtract", "timezone", "duration"];
  const op = operations[Math.floor(Math.random() * operations.length)];

  // --- helpers ---
  const pad = (n) => String(n).padStart(2, "0");
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const use12h = Math.random() < 0.5; // random 12h / 24h format

  function formatTime(date, tzOffset = 0) {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const local = new Date(utc + tzOffset * 3600000);
    let hh = local.getHours();
    const mm = pad(local.getMinutes());
    if (use12h) {
      const suffix = hh >= 12 ? "pm" : "am";
      hh = hh % 12 || 12;
      return `${hh}:${mm} ${suffix}`;
    } else {
      return `${pad(hh)}:${mm}`;
    }
  }

  function snapTo5(n) {
    return (Math.round(n / 5) * 5) % 60;
  }

  function durationText(h, m) {
    if (h > 0 && m > 0) return `${h} hours ${m} minutes`;
    if (h > 0) return `${h} hours`;
    return `${m} minutes`;
  }

  function randomDuration() {
    let h, m;
    do {
      h = rand(0, 6);
      m = rand(0, 59);
    } while (h === 0 && m === 0);
    return { h, m };
  }

  // --- easy mode toggle ---
  const easyMode = Math.random() < 0.5;
  const easyTarget = rand(1, 3);

  // --- base time ---
  const baseDate = new Date(
    2025,
    rand(0, 11),
    rand(1, 28),
    rand(0, 23),
    easyMode && (easyTarget === 1 || easyTarget === 3)
      ? snapTo5(rand(0, 59))
      : rand(0, 59)
  );

  // --- duration ---
  let { h, m } = randomDuration();
  if (easyMode && (easyTarget === 2 || easyTarget === 3)) {
    m = snapTo5(m);
    if (h === 0 && m === 0) m = 5;
  }

  let question = "";
  let answer = "";

  // --- ADD / SUBTRACT ---
  if (op === "add" || op === "subtract") {
    const date = new Date(baseDate);
    if (op === "add") {
      date.setHours(date.getHours() + h);
      date.setMinutes(date.getMinutes() + m);
      question = `${formatTime(baseDate)} plus ${durationText(h, m)}.`;
    } else {
      date.setHours(date.getHours() - h);
      date.setMinutes(date.getMinutes() - m);
      question = `${formatTime(baseDate)} minus ${durationText(h, m)}.`;
    }
    answer = formatTime(date);
  }

  // --- TIMEZONE ---
  else if (op === "timezone") {
    const baseUTC = new Date(
      Date.UTC(
        2025,
        rand(0, 11),
        rand(1, 28),
        rand(0, 23),
        easyMode ? snapTo5(rand(0, 59)) : rand(0, 59)
      )
    );

    let { h: plusH, m: plusM } = randomDuration();
    if (easyMode) plusM = snapTo5(plusM);

    // question time (unchanged)
    const questionTime = new Date(baseUTC);

    // arrival UTC
    const arrivalUTC = new Date(baseUTC);
    arrivalUTC.setUTCHours(arrivalUTC.getUTCHours() + plusH);
    arrivalUTC.setUTCMinutes(arrivalUTC.getUTCMinutes() + plusM);

    const fromTz = rand(-5, 5);
    const toTz = rand(-12, 12);

    question = `${formatTime(questionTime, fromTz)} GMT${
      fromTz >= 0 ? "+" + fromTz : fromTz
    } plus ${durationText(plusH, plusM)}, what time in GMT${
      toTz >= 0 ? "+" + toTz : toTz
    }?`;
    answer = formatTime(arrivalUTC, toTz);
  }

  // --- DURATION ---
  else if (op === "duration") {
    const tz1 = rand(-12, 12);
    const tz2 = rand(-12, 12);

    const depart = new Date(
      Date.UTC(
        2025,
        rand(0, 11),
        rand(1, 28),
        rand(0, 23),
        easyMode && (easyTarget === 1 || easyTarget === 3)
          ? snapTo5(rand(0, 59))
          : rand(0, 59)
      )
    );

    const arrive = new Date(depart);
    let { h: travelH, m: travelM } = randomDuration();
    if (easyMode && (easyTarget === 2 || easyTarget === 3)) {
      travelM = snapTo5(travelM);
      if (travelH === 0 && travelM === 0) travelM = 5;
    }

    arrive.setUTCHours(arrive.getUTCHours() + travelH);
    arrive.setUTCMinutes(arrive.getUTCMinutes() + travelM);

    question = `Depart ${formatTime(depart, tz1)} GMT${
      tz1 >= 0 ? "+" + tz1 : tz1
    }, arrive ${formatTime(arrive, tz2)} GMT${
      tz2 >= 0 ? "+" + tz2 : tz2
    }, how long?`;
    answer = durationText(travelH, travelM);
  }

  // Logic for displaying question and answer then call speech
  currentQuestion = question;
  currentAnswer = answer;
  big_label.style.fontSize = "3em";
  big_label.innerText = question;
  small_label.innerText = "";

  // Add here for custom speech (different from display)
  let question_speech = question;

  let speech = new SpeechSynthesisUtterance(question_speech);

  speech.rate = currentSpeechRate;
  speech.voice = currentVoice;
  speech.lang = currentLang;

  if (read_question) {
    speechSynthesis.speak(speech);
  }

  waitingForAnswer = true;
  currentDisplay = "question";
  currentQuestionType = "time";

  // return { question, answer };
}

// const data = generateTimeQuestion();

// document.getElementById("debug-area").innerHTML = `
//     <p><strong>Question:</strong> ${data.question}</p>
//     <p><strong>Answer:</strong> ${data.answer}</p>
// `;
