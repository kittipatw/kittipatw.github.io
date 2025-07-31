const toggleBtn = document.getElementById("rhythm-toggle-btn");
const bpmSlider = document.getElementById("bpm-slider");
const bpmDisplay = document.getElementById("bpm-display");

let audioCtx;
let metronomeInterval = null;
let isPlaying = false;
let wasPlayingBeforeHold = false;
let bpm = parseInt(bpmSlider.value);
let bpmChangeTimeout = null;

bpmDisplay.textContent = bpm;

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
    if (wasPlayingBeforeHold) {
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

function startMetronome() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const interval = 60000 / bpm;
  metronomeInterval = setInterval(playClick, interval);
  playClick(); // Play immediately
}

function stopMetronome() {
  clearInterval(metronomeInterval);
  metronomeInterval = null;
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
