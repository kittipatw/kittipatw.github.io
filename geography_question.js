let countryCapitals = [
  { country: "Japan", capital: "Tokyo", thaiName: "ญี่ปุ่น" },
  { country: "France", capital: "Paris", thaiName: "ฝรั่งเศส" },
  {
    country: "United States",
    capital: "Washington DC",
    thaiName: "สหรัฐอเมริกา",
  },
  { country: "United Kingdom", capital: "London", thaiName: "สหราชอาณาจักร" },
  { country: "Germany", capital: "Berlin", thaiName: "เยอรมนี" },
  { country: "Italy", capital: "Rome", thaiName: "อิตาลี" },
  { country: "Spain", capital: "Madrid", thaiName: "สเปน" },
  { country: "Russia", capital: "Moscow", thaiName: "รัสเซีย" },
  { country: "China", capital: "Beijing", thaiName: "จีน" },
  { country: "India", capital: "New Delhi", thaiName: "อินเดีย" },
  { country: "Thailand", capital: "Bangkok", thaiName: "ไทย" },
  { country: "Australia", capital: "Canberra", thaiName: "ออสเตรเลีย" },
  { country: "Canada", capital: "Ottawa", thaiName: "แคนาดา" },
  { country: "Brazil", capital: "Brasilia", thaiName: "บราซิล" },
  { country: "Mexico", capital: "Mexico City", thaiName: "เม็กซิโก" },
  { country: "Argentina", capital: "Buenos Aires", thaiName: "อาร์เจนตินา" },
  { country: "Egypt", capital: "Cairo", thaiName: "อียิปต์" },
  { country: "Turkey", capital: "Ankara", thaiName: "ตุรกี" },
  { country: "South Korea", capital: "Seoul", thaiName: "เกาหลีใต้" },
  { country: "Indonesia", capital: "Jakarta", thaiName: "อินโดนีเซีย" },
  { country: "Saudi Arabia", capital: "Riyadh", thaiName: "ซาอุดีอาระเบีย" },
  { country: "Sweden", capital: "Stockholm", thaiName: "สวีเดน" },
  { country: "Norway", capital: "Oslo", thaiName: "นอร์เวย์" },
  { country: "Finland", capital: "Helsinki", thaiName: "ฟินแลนด์" },
  { country: "Denmark", capital: "Copenhagen", thaiName: "เดนมาร์ก" },
  { country: "Poland", capital: "Warsaw", thaiName: "โปแลนด์" },
  { country: "Netherlands", capital: "Amsterdam", thaiName: "เนเธอร์แลนด์" },
  { country: "Belgium", capital: "Brussels", thaiName: "เบลเยียม" },
  { country: "Switzerland", capital: "Bern", thaiName: "สวิตเซอร์แลนด์" },
  { country: "Portugal", capital: "Lisbon", thaiName: "โปรตุเกส" },
  { country: "Greece", capital: "Athens", thaiName: "กรีซ" },
  { country: "Austria", capital: "Vienna", thaiName: "ออสเตรีย" },
  { country: "Hungary", capital: "Budapest", thaiName: "ฮังการี" },
  { country: "Czech Republic", capital: "Prague", thaiName: "สาธารณรัฐเช็ก" },
  { country: "Ukraine", capital: "Kyiv", thaiName: "ยูเครน" },
  { country: "Vietnam", capital: "Hanoi", thaiName: "เวียดนาม" },
  { country: "Philippines", capital: "Manila", thaiName: "ฟิลิปปินส์" },
  { country: "Malaysia", capital: "Kuala Lumpur", thaiName: "มาเลเซีย" },
  { country: "Singapore", capital: "Singapore", thaiName: "สิงคโปร์" },
];

function generateGeographyQuestion() {
  if (countryCapitals.length === 0) return true; // All countries used

  // Pick a random index
  const randomIndex = Math.floor(Math.random() * countryCapitals.length);

  // Remove the selected country from the list (so it won't be picked again)
  const { country, capital, thaiName } = countryCapitals.splice(
    randomIndex,
    1
  )[0];

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
  if (currentLang === "th-TH") {
    question_speech = `เมืองหลวงของประเทศ ${thaiName}, สะกดกลับหลัง`;
  }

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
