                  const voiceSelect = document.getElementById("voice");
const story = document.getElementById("story");
const mouth = document.getElementById("mouth");
const status = document.getElementById("status");

let voices = [];
let mouthAnimation;


// Browser voices load करणे
function loadVoices() {

  voices = speechSynthesis.getVoices();

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {

    const option = document.createElement("option");

    option.value = index;
    option.textContent =
      voice.name + " (" + voice.lang + ")";

    voiceSelect.appendChild(option);

  });
}

loadVoices();

speechSynthesis.onvoiceschanged = loadVoices;


// Story बोलणे
function speakStory() {

  const text = story.value.trim();

  if (!text) {
    alert("कृपया आधी कथा लिहा.");
    return;
  }

  speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  const selectedVoice =
    voices[voiceSelect.value];

  if (selectedVoice) {
    speech.voice = selectedVoice;
  }

  speech.rate = 1;
  speech.pitch = 1;


  speech.onstart = function () {

    status.textContent =
      "🗣️ Cartoon बोलत आहे...";

    startMouth();

  };


  speech.onend = function () {

    status.textContent =
      "✅ कथा पूर्ण झाली!";

    stopMouth();

  };


  speech.onerror = function () {

    status.textContent =
      "❌ Voice मध्ये समस्या आली.";

    stopMouth();

  };


  speechSynthesis.speak(speech);
}


// Speech थांबवणे
function stopStory() {

  speechSynthesis.cancel();

  stopMouth();

  status.textContent =
    "⏹️ कथा थांबवली.";
}


// Mouth animation
function startMouth() {

  clearInterval(mouthAnimation);

  mouthAnimation = setInterval(() => {

    const height =
      Math.random() > 0.5 ? 35 : 12;

    mouth.style.height =
      height + "px";

  }, 120);
}


// Mouth बंद
function stopMouth() {

  clearInterval(mouthAnimation);

  mouth.style.height =
    "18px";
}
