let countryCapitals = [
  { country: "Japan", capital: "Tokyo" },
  { country: "France", capital: "Paris" },
  { country: "United States", capital: "Washington DC" },
  { country: "United Kingdom", capital: "London" },
  { country: "Germany", capital: "Berlin" },
  { country: "Italy", capital: "Rome" },
  { country: "Spain", capital: "Madrid" },
  { country: "Russia", capital: "Moscow" },
  { country: "China", capital: "Beijing" },
  { country: "India", capital: "New Delhi" },
  { country: "Thailand", capital: "Bangkok" },
  { country: "Australia", capital: "Canberra" },
  { country: "Canada", capital: "Ottawa" },
  { country: "Brazil", capital: "Brasilia" },
  { country: "Mexico", capital: "Mexico City" },
  { country: "Argentina", capital: "Buenos Aires" },
  { country: "Egypt", capital: "Cairo" },
  { country: "Turkey", capital: "Ankara" },
  { country: "South Korea", capital: "Seoul" },
  { country: "Indonesia", capital: "Jakarta" },
  { country: "Saudi Arabia", capital: "Riyadh" },
  { country: "Sweden", capital: "Stockholm" },
  { country: "Norway", capital: "Oslo" },
  { country: "Finland", capital: "Helsinki" },
  { country: "Denmark", capital: "Copenhagen" },
  { country: "Poland", capital: "Warsaw" },
  { country: "Netherlands", capital: "Amsterdam" },
  { country: "Belgium", capital: "Brussels" },
  { country: "Switzerland", capital: "Bern" },
  { country: "Portugal", capital: "Lisbon" },
  { country: "Greece", capital: "Athens" },
  { country: "Austria", capital: "Vienna" },
  { country: "Hungary", capital: "Budapest" },
  { country: "Czech Republic", capital: "Prague" },
  { country: "Ukraine", capital: "Kyiv" },
  { country: "Vietnam", capital: "Hanoi" },
  { country: "Philippines", capital: "Manila" },
  { country: "Malaysia", capital: "Kuala Lumpur" },
  { country: "Singapore", capital: "Singapore" },
];

function generateGeographyQuestion() {
  if (countryCapitals.length === 0) return true; // All countries used

  // Pick a random index
  const randomIndex = Math.floor(Math.random() * countryCapitals.length);

  // Remove the selected country from the list (so it won't be picked again)
  const { country, capital } = countryCapitals.splice(randomIndex, 1)[0];

  // Prepare question and reversed answer
  const question = `What is the capital of ${country}? Spell backward.`;
  const answer = capital.split("").reverse().join("").toUpperCase();

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
  currentQuestionType = "geography";

  //   return { question, answer };
}
