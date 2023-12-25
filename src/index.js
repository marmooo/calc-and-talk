const playPanel = document.getElementById("playPanel");
const infoPanel = document.getElementById("infoPanel");
const countPanel = document.getElementById("countPanel");
const scorePanel = document.getElementById("scorePanel");
const gameTime = 120;
let gameTimer;
let firstRun = true;
let problem = "Talk Numbers";
let answer = "123";
let catCounter = 0;
let solveCount = 0;
let totalCount = 0;
let englishVoices = [];
const voiceInput = setVoiceInput();
const audioContext = new AudioContext();
const audioBufferCache = {};
loadAudio("end", "mp3/end.mp3");
loadAudio("error", "mp3/cat.mp3");
loadAudio("correct", "mp3/correct3.mp3");
loadConfig();

function loadConfig() {
  if (localStorage.getItem("darkMode") == 1) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleDarkMode() {
  if (localStorage.getItem("darkMode") == 1) {
    localStorage.setItem("darkMode", 0);
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("darkMode", 1);
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
}

function toggleVoice() {
  if (localStorage.getItem("voice") != 0) {
    localStorage.setItem("voice", 0);
    document.getElementById("voiceOn").classList.add("d-none");
    document.getElementById("voiceOff").classList.remove("d-none");
    speechSynthesis.cancel();
  } else {
    localStorage.setItem("voice", 1);
    document.getElementById("voiceOn").classList.remove("d-none");
    document.getElementById("voiceOff").classList.add("d-none");
    voiceInput.stop();
    speak(answer);
  }
}

async function playAudio(name, volume) {
  const audioBuffer = await loadAudio(name, audioBufferCache[name]);
  const sourceNode = audioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  if (volume) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    sourceNode.connect(gainNode);
    sourceNode.start();
  } else {
    sourceNode.connect(audioContext.destination);
    sourceNode.start();
  }
}

async function loadAudio(name, url) {
  if (audioBufferCache[name]) return audioBufferCache[name];
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioBufferCache[name] = audioBuffer;
  return audioBuffer;
}

function unlockAudio() {
  audioContext.resume();
}

function loadVoices() {
  // https://stackoverflow.com/questions/21513706/
  const allVoicesObtained = new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      let supported = false;
      speechSynthesis.addEventListener("voiceschanged", () => {
        supported = true;
        voices = speechSynthesis.getVoices();
        resolve(voices);
      });
      setTimeout(() => {
        if (!supported) {
          document.getElementById("noTTS").classList.remove("d-none");
        }
      }, 1000);
    }
  });
  const jokeVoices = [
    // "com.apple.eloquence.en-US.Flo",
    "com.apple.speech.synthesis.voice.Bahh",
    "com.apple.speech.synthesis.voice.Albert",
    // "com.apple.speech.synthesis.voice.Fred",
    "com.apple.speech.synthesis.voice.Hysterical",
    "com.apple.speech.synthesis.voice.Organ",
    "com.apple.speech.synthesis.voice.Cellos",
    "com.apple.speech.synthesis.voice.Zarvox",
    // "com.apple.eloquence.en-US.Rocko",
    // "com.apple.eloquence.en-US.Shelley",
    // "com.apple.speech.synthesis.voice.Princess",
    // "com.apple.eloquence.en-US.Grandma",
    // "com.apple.eloquence.en-US.Eddy",
    "com.apple.speech.synthesis.voice.Bells",
    // "com.apple.eloquence.en-US.Grandpa",
    "com.apple.speech.synthesis.voice.Trinoids",
    // "com.apple.speech.synthesis.voice.Kathy",
    // "com.apple.eloquence.en-US.Reed",
    "com.apple.speech.synthesis.voice.Boing",
    "com.apple.speech.synthesis.voice.Whisper",
    "com.apple.speech.synthesis.voice.Deranged",
    "com.apple.speech.synthesis.voice.GoodNews",
    "com.apple.speech.synthesis.voice.BadNews",
    "com.apple.speech.synthesis.voice.Bubbles",
    // "com.apple.voice.compact.en-US.Samantha",
    // "com.apple.eloquence.en-US.Sandy",
    // "com.apple.speech.synthesis.voice.Junior",
    // "com.apple.speech.synthesis.voice.Ralph",
  ];
  allVoicesObtained.then((voices) => {
    englishVoices = voices
      .filter((voice) => voice.lang == "en-US")
      .filter((voice) => !jokeVoices.includes(voice.voiceURI));
  });
}
loadVoices();

function speak(text) {
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.onend = () => {
    voiceInput.start();
  };
  msg.voice = englishVoices[Math.floor(Math.random() * englishVoices.length)];
  msg.lang = "en-US";
  voiceInput.stop();
  speechSynthesis.speak(msg);
  return msg;
}

function respeak() {
  speak(problem);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function hideAnswer() {
  document.getElementById("reply").textContent = "";
}

function showAnswer() {
  const msg = speak(problem + " " + answer);
  if (!firstRun) {
    msg.onend = () => {
      setTimeout(nextProblem, 2000);
    };
  }
  document.getElementById("reply").textContent = problem + " [ " + answer +
    " ]";
}

function nextProblem() {
  hideAnswer();
  totalCount += 1;
  const [a, x, b, c] = generateData();
  const grade = document.getElementById("gradeOption").selectedIndex;
  switch (grade) {
    case 0:
      problem = toEnglish1(x, a, b);
      break;
    case 1:
      problem = toEnglish2(x, a, b);
      break;
    case 2:
      if (getRandomInt(0, 1) == 0) {
        problem = toEnglish1(x, a, b);
      } else {
        problem = toEnglish2(x, a, b);
      }
      break;
    default:
      problem = toEnglish1(x, a, b);
      break;
  }
  answer = c.toString();
  speak(problem);
}

function catNyan() {
  playAudio("error");
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function loadCatImage(url) {
  const imgSize = 128;
  return new Promise((resolve) => {
    loadImage(url).then((originalImg) => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("role", "button");
      canvas.width = imgSize;
      canvas.height = imgSize;
      canvas.style.position = "absolute";
      // drawImage() faster than putImageData()
      canvas.getContext("2d").drawImage(originalImg, 0, 0);
      resolve(canvas);
    }).catch((e) => {
      console.log(e);
    });
  });
}
loadCatImage("kohacu.webp").then((catCanvas) => {
  catsWalk(catCanvas);
});

function catWalk(freq, catCanvas) {
  const area = document.getElementById("catsWalk");
  const width = area.offsetWidth;
  const height = area.offsetHeight;
  const canvas = catCanvas.cloneNode(true);
  canvas.getContext("2d").drawImage(catCanvas, 0, 0);
  const size = 128;
  canvas.style.top = getRandomInt(0, height - size) + "px";
  canvas.style.left = width - size + "px";
  canvas.addEventListener("click", () => {
    catCounter += 1;
    speak(catCounter);
    canvas.remove();
  }, { once: true });
  area.appendChild(canvas);
  const timer = setInterval(() => {
    const x = parseInt(canvas.style.left) - 1;
    if (x > -size) {
      canvas.style.left = x + "px";
    } else {
      clearInterval(timer);
      canvas.remove();
    }
  }, freq);
}

function catsWalk(catCanvas) {
  setInterval(() => {
    if (Math.random() > 0.995) {
      catWalk(getRandomInt(5, 20), catCanvas);
    }
  }, 10);
}

function countdown() {
  solveCount = totalCount = 0;
  firstRun = false;
  countPanel.classList.remove("d-none");
  infoPanel.classList.add("d-none");
  playPanel.classList.add("d-none");
  scorePanel.classList.add("d-none");
  const counter = document.getElementById("counter");
  counter.textContent = 3;
  const timer = setInterval(() => {
    const colors = ["skyblue", "greenyellow", "violet", "tomato"];
    if (parseInt(counter.textContent) > 1) {
      const t = parseInt(counter.textContent) - 1;
      counter.style.backgroundColor = colors[t];
      counter.textContent = t;
    } else {
      clearTimeout(timer);
      countPanel.classList.add("d-none");
      infoPanel.classList.remove("d-none");
      playPanel.classList.remove("d-none");
      nextProblem();
      startGameTimer();
    }
  }, 1000);
}

function startGame() {
  clearInterval(gameTimer);
  initTime();
  countdown();
}

function startGameTimer() {
  clearInterval(gameTimer);
  const timeNode = document.getElementById("time");
  gameTimer = setInterval(() => {
    const t = parseInt(timeNode.textContent);
    if (t > 0) {
      timeNode.textContent = t - 1;
    } else {
      clearInterval(gameTimer);
      playAudio("end");
      scoring();
    }
  }, 1000);
}

function initTime() {
  document.getElementById("time").textContent = gameTime;
}

function scoring() {
  playPanel.classList.add("d-none");
  scorePanel.classList.remove("d-none");
  document.getElementById("score").textContent = solveCount;
  document.getElementById("total").textContent = totalCount;
}

function toEnglish1(type, a, b) {
  const sentences = [
    [
      "[a] plus [b] is",
      "[a] plus [b] equals",
    ],
    [
      "[a] minus [b] is",
      "[a] minus [b] equals",
      "[a] take away [b] is",
      "[a] take away [b] equals",
      "[b] from [a] is",
      "[b] from [a] equals",
    ],
    [
      "[a] times [b] is",
      "[a] times [b] equals",
      "[a] multiplied by [b] is",
      "[a] multiplied by [b] equals",
    ],
    [
      "[a] divided by [b] is",
      "[a] divided by [b] equals",
    ],
  ];
  const patterns = sentences[type];
  const pattern = patterns[getRandomInt(0, patterns.length)];
  return pattern.replace("[a]", a).replace("[b]", b);
}

function toEnglish2(type, a, b) {
  const sentences = [
    [
      "When you add [a] and [b], you get",
      "What do you get if you add [a] and [b]?",
    ],
    [
      "When we substract [a] from [b], we get",
      "When you take [a] away from [b], you get",
      "What do you get if you substract [a] and [b]?",
      "What do you get if you take [a] away from [b]?",
    ],
    [
      "When we multiply [a] by [b], we get",
      "What do you get if you multiply [a] by [b]?",
    ],
    [
      "When you divide [a] by [b], you get",
      "What do you get if you divide [a] by [b]?",
    ],
  ];
  const patterns = sentences[type];
  const pattern = patterns[getRandomInt(0, patterns.length)];
  return pattern.replace("[a]", a).replace("[b]", b);
}

function generateData() {
  const course = document.getElementById("courseOption").selectedIndex;
  const range = [8, 2, 8, 2, 9, 0, 8, 2];
  let a, b, c, x, s;
  switch (course) {
    case 0:
      s = Math.floor(Math.random() * 4);
      break;
    case 1:
      s = Math.floor(Math.random() * 1);
      break;
    case 2:
      s = Math.floor(Math.random() * 1);
      break;
    default:
      s = course - 3;
  }
  switch (s) {
    case 0:
      a = Math.floor(Math.random() * range[0] + range[1]);
      b = Math.floor(Math.random() * range[0] + range[1]);
      c = a + b;
      x = "＋";
      break;
    case 1:
      b = Math.floor(Math.random() * range[2] + range[3]);
      c = Math.floor(Math.random() * range[2] + range[3]);
      a = b + c;
      x = "−";
      break;
    case 2:
      a = Math.floor(Math.random() * range[4] + range[5]);
      b = Math.floor(Math.random() * range[4] + range[5]);
      c = a * b;
      x = "×";
      break;
    case 3:
      b = Math.floor(Math.random() * range[6] + range[7]);
      c = Math.floor(Math.random() * range[6] + range[7]);
      a = b * c;
      x = "÷";
      break;
    default:
      console.log("error");
  }
  const operation = "＋−×÷";
  return [a, operation.indexOf(x), b, c];
}

function setVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    document.getElementById("noSTT").classList.remove("d-none");
  } else {
    const voiceInput = new webkitSpeechRecognition();
    voiceInput.lang = "en-US";
    // voiceInput.interimResults = true;
    voiceInput.continuous = true;

    voiceInput.onstart = voiceInputOnStart;
    voiceInput.onend = () => {
      if (!speechSynthesis.speaking) {
        voiceInput.start();
      }
    };
    voiceInput.onresult = (event) => {
      const reply = event.results[0][0].transcript;
      document.getElementById("reply").textContent = reply;
      if (reply.toLowerCase() == answer.toLowerCase()) {
        solveCount += 1;
        playAudio("correct", 0.3);
        setTimeout(nextProblem, 500);
      }
      voiceInput.stop();
    };
    return voiceInput;
  }
}

function voiceInputOnStart() {
  document.getElementById("startVoiceInput").classList.add("d-none");
  document.getElementById("stopVoiceInput").classList.remove("d-none");
}

function voiceInputOnStop() {
  document.getElementById("startVoiceInput").classList.remove("d-none");
  document.getElementById("stopVoiceInput").classList.add("d-none");
}

function startVoiceInput() {
  voiceInput.start();
}

function stopVoiceInput() {
  voiceInputOnStop();
  voiceInput.stop();
}

[...document.getElementsByTagName("table")].forEach((table) => {
  [...table.getElementsByTagName("tr")].forEach((tr) => {
    tr.onclick = () => {
      speak(tr.innerText);
    };
  });
});

document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("toggleVoice").onclick = toggleVoice;
document.getElementById("restartButton").onclick = startGame;
document.getElementById("startButton").onclick = startGame;
document.getElementById("showAnswer").onclick = showAnswer;
document.getElementById("kohacu").onclick = catNyan;
document.getElementById("respeak").onclick = respeak;
document.getElementById("startVoiceInput").onclick = startVoiceInput;
document.getElementById("stopVoiceInput").onclick = stopVoiceInput;
document.addEventListener("click", unlockAudio, {
  once: true,
  useCapture: true,
});
