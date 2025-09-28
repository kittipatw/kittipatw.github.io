const toggleBtn = document.getElementById("rhythm-toggle-btn");
const bpmSlider = document.getElementById("bpm-slider");
const bpmDisplay = document.getElementById("bpm-display");
const randomCheckbox = document.getElementById("random-metronome");

let audioCtx;
let metronomeInterval = null;
let isPlaying = false;
let wasPlayingBeforeHold = false;
let bpm = parseInt(bpmSlider.value);
let bpmChangeTimeout = null;
let randomTimeout = null;

bpmDisplay.textContent = bpm;

/* ---------- Variables for Random Pause ---------- */
let beatCounter = 0;
let pauseAfterBeats = null; // how many beats until next pause
let inPause = false;

// Stop metronome immediately when slider is held
bpmSlider.addEventListener("mousedown", () => {
  if (isPlaying) {
    wasPlayingBeforeHold = true;
    stopMetronome();
  } else {
    wasPlayingBeforeHold = false;
  }
});

// Update bpm while dragging
bpmSlider.addEventListener("input", () => {
  bpm = parseInt(bpmSlider.value);
  bpmDisplay.textContent = bpm;

  // Reset the restart timer on every change
  if (bpmChangeTimeout) clearTimeout(bpmChangeTimeout);
  bpmChangeTimeout = setTimeout(() => {
    if (wasPlayingBeforeHold && !randomCheckbox.checked) {
      startMetronome();
    }
  }, 1000);
});

// Optional: for touch devices
bpmSlider.addEventListener("touchstart", () => {
  if (isPlaying) {
    wasPlayingBeforeHold = true;
    stopMetronome();
  } else {
    wasPlayingBeforeHold = false;
  }
});

// Also support pointer events (for better cross-browser compatibility)
bpmSlider.addEventListener("pointerdown", () => {
  if (isPlaying) {
    wasPlayingBeforeHold = true;
    stopMetronome();
  } else {
    wasPlayingBeforeHold = false;
  }
});

toggleBtn.addEventListener("click", () => {
  if (isPlaying) {
    stopMetronome();
    toggleBtn.textContent = "Start";
    toggleBtn.classList.remove("btn-danger");
    toggleBtn.classList.add("btn-primary");
  } else {
    startMetronome();
    toggleBtn.textContent = "Stop";
    toggleBtn.classList.remove("btn-primary");
    toggleBtn.classList.add("btn-danger");
  }
  isPlaying = !isPlaying;
});

// 🔹 Handle random checkbox toggle
randomCheckbox.addEventListener("change", () => {
  bpmSlider.disabled = randomCheckbox.checked;

  if (isPlaying) {
    stopMetronome();
    startMetronome();
  }
});

function startMetronome() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  stopMetronome(); // clear any old interval/timeouts

  beatCounter = 0;
  pauseAfterBeats = getRandomInt(5, 10); // set first pause
  inPause = false;

  if (randomCheckbox.checked) {
    scheduleRandomTick();
  } else {
    const interval = 60000 / bpm;
    bpmDisplay.textContent = bpm; // reset display
    metronomeInterval = setInterval(playClick, interval);
    playClick(); // Play immediately
  }
}

function stopMetronome() {
  clearInterval(metronomeInterval);
  metronomeInterval = null;
  clearTimeout(randomTimeout);
  randomTimeout = null;
  inPause = false;
}

function playClick() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.frequency.value = 1000;
  gain.gain.setValueAtTime(1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
}

/* ---------- Random Metronome Mode with Pauses ---------- */
function scheduleRandomTick() {
  if (inPause) return; // don't tick while paused

  playClick();
  beatCounter++;

  // Check if it's time to pause
  if (beatCounter >= pauseAfterBeats) {
    inPause = true;

    // Show "PAUSE" during the break
    bpmDisplay.textContent = "PAUSE";

    const pauseDuration = getRandomInt(1000, 5000); // 1–5 seconds
    setTimeout(() => {
      // Reset counters after pause
      beatCounter = 0;
      pauseAfterBeats = getRandomInt(5, 20);
      inPause = false;

      // Resume ticking only if still in random mode
      if (isPlaying && randomCheckbox.checked) {
        scheduleRandomTick();
      }
    }, pauseDuration);

    return; // stop here until pause finishes
  }

  // Normal tick scheduling
  const randomBpm = getRandomInt(40, 120);
  const interval = 60000 / randomBpm;

  bpmDisplay.textContent = randomBpm;

  randomTimeout = setTimeout(() => {
    // Only continue if still random mode
    if (isPlaying && randomCheckbox.checked) {
      scheduleRandomTick();
    }
  }, interval);
}

/* ---------- Helper ---------- */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
