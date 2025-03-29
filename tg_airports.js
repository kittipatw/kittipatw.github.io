const field1 = document.querySelector("#iata-code");
const field2 = document.querySelector("#icao-code");
const field3 = document.querySelector("#city");
const field4 = document.querySelector("#country");
const field5 = document.querySelector("#airport-name");

let answerField;
let answerValue;

function createToast(message, type) {
  const toastContainer = document.querySelector("#status-toast");

  // Create the toast element
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${type} border-0`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  // Append the toast to the container
  toastContainer.appendChild(toast);

  // Initialize and show the toast
  const bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();

  // Automatically remove the toast after it's hidden
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}

let all_airports;

fetch("./tg_airports.csv")
  .then((response) => response.text())
  .then((data) => {
    const lines = data.trim().split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());

    all_airports = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index] || "";
        return obj;
      }, {});
    });

    // console.log(all_airports);
  })
  .catch((error) => console.error("Error loading the file:", error));

let current_index;
let current_iata_code;
let current_icao_code;
let current_city;
let current_country;
let current_airport_name;

function getRandomAirport(data) {
  if (data.length === 0) {
    console.error("No airport data available.");
    return null;
  }
  const randomIndex = Math.floor(Math.random() * data.length);

  current_index = randomIndex;

  current_iata_code = all_airports[current_index].iata_code;
  current_icao_code = all_airports[current_index].icao_code;
  current_city = all_airports[current_index].city;
  current_country = all_airports[current_index].country;
  current_airport_name = all_airports[current_index].airport_name;

  return randomIndex;
}

function updateLabel() {
  let random_num = Math.floor(Math.random() * 4) + 1;

  field1.value = current_iata_code;
  field2.value = current_icao_code;
  field3.value = current_city;
  field4.value = current_country;
  field5.value = current_airport_name;

  if (random_num === 1) {
    field1.value = "";
    field1.readOnly = false;
    field1.focus();
    field1.setAttribute("onkeydown", "submitOnEnter(event)");
    answerField = field1;
    answerValue = current_iata_code;
  } else if (random_num === 2) {
    field2.value = "";
    field2.readOnly = false;
    field2.focus();
    field2.setAttribute("onkeydown", "submitOnEnter(event)");
    answerField = field2;
    answerValue = current_icao_code;
  } else if (random_num === 3) {
    field3.value = "";
    field3.readOnly = false;
    field3.focus();
    field3.setAttribute("onkeydown", "submitOnEnter(event)");
    answerField = field3;
    answerValue = current_city;
  } else if (random_num === 4) {
    field4.value = "";
    field4.readOnly = false;
    field4.focus();
    field4.setAttribute("onkeydown", "submitOnEnter(event)");
    answerField = field4;
    answerValue = current_country;
  }
}

let targetButton = document.getElementById("check-button");

function submitOnEnter(event) {
  if (event.key === "Enter") {
    targetButton.click();
  }
}

const skipButton = document.getElementById("skip-button");
const nextButton = document.getElementById("next-button");
const checkButton = document.getElementById("check-button");

function disableAllFields() {
  field1.readOnly = true;
  field2.readOnly = true;
  field3.readOnly = true;
  field4.readOnly = true;
  field5.readOnly = true;

  // field1.blur();
  // field2.blur();
  // field3.blur();
  // field4.blur();
  // field5.blur();
}

function showNextButton() {
  nextButton.style.display = "inline";
  skipButton.style.display = "none";
  checkButton.style.display = "none";
  // targetButton = nextButton;
  // nextButton.focus();
  setTimeout(() => {
    nextButton.focus();
  }, 0);
}

function hideNextButton() {
  nextButton.style.display = "none";
  skipButton.style.display = "inline";
  checkButton.style.display = "inline";
  // targetButton = checkButton;
}

function skip() {
  disableAllFields();
  field1.value = current_iata_code;
  field2.value = current_icao_code;
  field3.value = current_city;
  field4.value = current_country;
  field5.value = current_airport_name;
  showNextButton();
}

function checkAnswer() {
  if (answerField.value.toLowerCase() === answerValue.toLowerCase()) {
    createToast("Correct!", "success");
    disableAllFields();
    showNextButton();
  } else {
    createToast("Try Again!", "danger");
  }
}

function newQuestion() {
  hideNextButton();
  getRandomAirport(all_airports);
  updateLabel();
}

setTimeout(() => {
  getRandomAirport(all_airports);
  updateLabel();
  field5.classList.replace("label-input-field", "label-input-field-airport");
}, 1000);
