var o,n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},r={exports:{}},e=r,t=r.exports;(function(){"object"==typeof self&&self.self===self&&self||"object"==typeof n&&n.global,d=9007199254740991;function g(e){return!("number"!=typeof e||e!=e||e===1/0||e===-1/0)}function m(e){return"number"==typeof e&&Math.abs(e)<=d}var y=/(hundred|thousand|(m|b|tr|quadr)illion)$/,j=/teen$/,h=/y$/,u=/(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/,v={zero:"zeroth",one:"first",two:"second",three:"third",four:"fourth",five:"fifth",six:"sixth",seven:"seventh",eight:"eighth",nine:"ninth",ten:"tenth",eleven:"eleventh",twelve:"twelfth"};function l(e){return y.test(e)||j.test(e)?e+"th":h.test(e)?e.replace(h,"ieth"):u.test(e)?e.replace(u,b):e}function b(e,t){return v[t]}var o,d,s=1e3,c=1e6,r=1e9,a=1e12,i=1e15,f=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],_=["zero","ten","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];function p(e,t){var n,o=parseInt(e,10);if(!g(o))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!m(o))throw new RangeError("Input is not a safe number, it’s either too large or too small.");return n=function e(t){var n,o,l=arguments[1];return 0===t?l?l.join(" ").replace(/,$/,""):"zero":(l||(l=[]),t<0&&(l.push("minus"),t=Math.abs(t)),t<20?(n=0,o=f[t]):t<100?(n=t%10,o=_[Math.floor(t/10)],n&&(o+="-"+f[n],n=0)):t<s?(n=t%100,o=e(Math.floor(t/100))+" hundred"):t<c?(n=t%s,o=e(Math.floor(t/s))+" thousand,"):t<r?(n=t%c,o=e(Math.floor(t/c))+" million,"):t<a?(n=t%r,o=e(Math.floor(t/r))+" billion,"):t<i?(n=t%a,o=e(Math.floor(t/a))+" trillion,"):t<=9007199254740992&&(n=t%i,o=e(Math.floor(t/i))+" quadrillion,"),l.push(o),e(n,l))}(o),t?l(n):n}o={toOrdinal:function(e){if(t=parseInt(e,10),!g(t))throw new TypeError("Not a finite number: "+e+" ("+typeof e+")");if(!m(t))throw new RangeError("Input is not a safe number, it’s either too large or too small.");var t,n=String(t),o=Math.abs(t%100),i=11<=o&&o<=13,s=n.charAt(n.length-1);return n+(i?"th":"1"===s?"st":"2"===s?"nd":"3"===s?"rd":"th")},toWords:p,toWordsOrdinal:function(e){return l(p(e))}},e.exports&&(t=e.exports=o),t.numberToWords=o})(),o=r.exports;const playPanel=document.getElementById("playPanel"),infoPanel=document.getElementById("infoPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),gameTime=120;let gameTimer,firstRun=!0,problem="Talk Numbers",answer="Talk Numbers",catCounter=0,solveCount=0,totalCount=0,englishVoices=[],audioContext;const audioBufferCache={},voiceInput=setVoiceInput();loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}function toggleVoice(){localStorage.getItem("voice")!=0?(localStorage.setItem("voice",0),document.getElementById("voiceOn").classList.add("d-none"),document.getElementById("voiceOff").classList.remove("d-none"),speechSynthesis.cancel()):(localStorage.setItem("voice",1),document.getElementById("voiceOn").classList.remove("d-none"),document.getElementById("voiceOff").classList.add("d-none"),voiceInput.stop(),speak(answer))}function createAudioContext(){return globalThis.AudioContext?new globalThis.AudioContext:(console.error("Web Audio API is not supported in this browser"),null)}function unlockAudio(){audioContext?audioContext.resume():(audioContext=createAudioContext(),loadAudio("end","mp3/end.mp3"),loadAudio("error","mp3/cat.mp3"),loadAudio("correct","mp3/correct3.mp3")),document.removeEventListener("pointerdown",unlockAudio),document.removeEventListener("keydown",unlockAudio)}async function loadAudio(e,t){if(!audioContext)return;if(audioBufferCache[e])return audioBufferCache[e];try{const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}catch(t){throw console.error(`Loading audio ${e} error:`,t),t}}function playAudio(e,t){if(!audioContext)return;const o=audioBufferCache[e];if(!o){console.error(`Audio ${e} is not found in cache`);return}const n=audioContext.createBufferSource();n.buffer=o;const s=audioContext.createGain();t&&(s.gain.value=t),s.connect(audioContext.destination),n.connect(s),n.start()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},1e3)}}),t=["com.apple.speech.synthesis.voice.Bahh","com.apple.speech.synthesis.voice.Albert","com.apple.speech.synthesis.voice.Hysterical","com.apple.speech.synthesis.voice.Organ","com.apple.speech.synthesis.voice.Cellos","com.apple.speech.synthesis.voice.Zarvox","com.apple.speech.synthesis.voice.Bells","com.apple.speech.synthesis.voice.Trinoids","com.apple.speech.synthesis.voice.Boing","com.apple.speech.synthesis.voice.Whisper","com.apple.speech.synthesis.voice.Deranged","com.apple.speech.synthesis.voice.GoodNews","com.apple.speech.synthesis.voice.BadNews","com.apple.speech.synthesis.voice.Bubbles"];e.then(e=>{englishVoices=e.filter(e=>e.lang=="en-US").filter(e=>!t.includes(e.voiceURI))})}loadVoices();function speak(e){speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);return t.onend=()=>{voiceInput.start()},t.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],t.lang="en-US",voiceInput.stop(),speechSynthesis.speak(t),t}function respeak(){speak(problem)}function getRandomInt(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function hideAnswer(){document.getElementById("reply").textContent=""}function showAnswer(){const e=speak(problem+" "+answer);firstRun||(e.onend=()=>{setTimeout(nextProblem,2e3)}),document.getElementById("reply").textContent=problem+" [ "+answer+" ]"}function nextProblem(){hideAnswer(),totalCount+=1;const[e,t,n,s]=generateData(),o=document.getElementById("gradeOption").selectedIndex;switch(o){case 0:problem=toEnglish1(t,e,n);break;case 1:problem=toEnglish2(t,e,n);break;case 2:getRandomInt(0,1)==0?problem=toEnglish1(t,e,n):problem=toEnglish2(t,e,n);break;default:problem=toEnglish1(t,e,n);break}answer=s.toString(),speak(problem)}function catNyan(){playAudio("error")}function loadImage(e){return new Promise((t,n)=>{const s=new Image;s.onload=()=>t(s),s.onerror=e=>n(e),s.src=e})}function loadCatImage(e){const t=128;return new Promise(n=>{loadImage(e).then(e=>{const s=document.createElement("canvas");s.setAttribute("role","button"),s.width=t,s.height=t,s.style.position="absolute",s.getContext("2d").drawImage(e,0,0),n(s)}).catch(e=>{console.log(e)})})}loadCatImage("kohacu.webp").then(e=>{catsWalk(e)});function catWalk(e,t){const s=document.getElementById("catsWalk"),i=s.offsetWidth,a=s.offsetHeight,n=t.cloneNode(!0);n.getContext("2d").drawImage(t,0,0);const o=128;n.style.top=getRandomInt(0,a-o)+"px",n.style.left=i-o+"px",n.addEventListener("click",()=>{catCounter+=1,speak(catCounter),n.remove()},{once:!0}),s.appendChild(n);const r=setInterval(()=>{const e=parseInt(n.style.left)-1;e>-128?n.style.left=e+"px":(clearInterval(r),n.remove())},e)}function catsWalk(e){setInterval(()=>{Math.random()>.995&&catWalk(getRandomInt(5,20),e)},10)}function countdown(){solveCount=totalCount=0,firstRun=!1,countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const e=document.getElementById("counter");e.textContent=3;const t=setInterval(()=>{const n=["skyblue","greenyellow","violet","tomato"];if(parseInt(e.textContent)>1){const t=parseInt(e.textContent)-1;e.style.backgroundColor=n[t],e.textContent=t}else clearInterval(t),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),nextProblem(),startGameTimer()},1e3)}function startGame(){clearInterval(gameTimer),initTime(),countdown()}function startGameTimer(){clearInterval(gameTimer);const e=document.getElementById("time");gameTimer=setInterval(()=>{const t=parseInt(e.textContent);t>0?e.textContent=t-1:(clearInterval(gameTimer),playAudio("end"),scoring())},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}function scoring(){playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=solveCount,document.getElementById("total").textContent=totalCount}function toEnglish1(e,t,n){const o=[["[a] plus [b] is","[a] plus [b] equals"],["[a] minus [b] is","[a] minus [b] equals","[a] take away [b] is","[a] take away [b] equals","[b] from [a] is","[b] from [a] equals"],["[a] times [b] is","[a] times [b] equals","[a] multiplied by [b] is","[a] multiplied by [b] equals"],["[a] divided by [b] is","[a] divided by [b] equals"]],s=o[e],i=s[getRandomInt(0,s.length)];return i.replace("[a]",t).replace("[b]",n)}function toEnglish2(e,t,n){const o=[["When you add [a] and [b], you get","What do you get if you add [a] and [b]?"],["When we substract [a] from [b], we get","When you take [a] away from [b], you get","What do you get if you substract [a] and [b]?","What do you get if you take [a] away from [b]?"],["When we multiply [a] by [b], we get","What do you get if you multiply [a] by [b]?"],["When you divide [a] by [b], you get","What do you get if you divide [a] by [b]?"]],s=o[e],i=s[getRandomInt(0,s.length)];return i.replace("[a]",t).replace("[b]",n)}function generateData(){const a=document.getElementById("courseOption").selectedIndex,e=[8,2,8,2,9,0,8,2];let n,t,s,o,i;switch(a){case 0:i=Math.floor(Math.random()*4);break;case 1:i=Math.floor(Math.random()*1);break;case 2:i=Math.floor(Math.random()*1);break;default:i=a-3}switch(i){case 0:n=Math.floor(Math.random()*e[0]+e[1]),t=Math.floor(Math.random()*e[0]+e[1]),s=n+t,o="＋";break;case 1:t=Math.floor(Math.random()*e[2]+e[3]),s=Math.floor(Math.random()*e[2]+e[3]),n=t+s,o="−";break;case 2:n=Math.floor(Math.random()*e[4]+e[5]),t=Math.floor(Math.random()*e[4]+e[5]),s=n*t,o="×";break;case 3:t=Math.floor(Math.random()*e[6]+e[7]),s=Math.floor(Math.random()*e[6]+e[7]),n=t*s,o="÷";break;default:console.log("error")}const r="＋−×÷";return[n,r.indexOf(o),t,s]}function toWords(e){return/[0-9]/.test(e)?/\d+(?:\.\d+)?/.test(e)?o.toWords(e):(e=e.replace(/[^\d.-]/g,""),o.toWords(e)):e}function setVoiceInput(){if(globalThis.webkitSpeechRecognition){const e=new globalThis.webkitSpeechRecognition;return e.lang="en-US",e.continuous=!0,e.onstart=voiceInputOnStart,e.onend=()=>{speechSynthesis.speaking||e.start()},e.onresult=t=>{const n=t.results[0][0].transcript;document.getElementById("reply").textContent=n,toWords(n)===toWords(n)&&(solveCount+=1,playAudio("correct",.3),setTimeout(nextProblem,500)),e.stop()},e}document.getElementById("noSTT").classList.remove("d-none")}function voiceInputOnStart(){document.getElementById("startVoiceInput").classList.add("d-none"),document.getElementById("stopVoiceInput").classList.remove("d-none")}function voiceInputOnStop(){document.getElementById("startVoiceInput").classList.remove("d-none"),document.getElementById("stopVoiceInput").classList.add("d-none")}function startVoiceInput(){voiceInput.start()}function stopVoiceInput(){voiceInputOnStop(),voiceInput.stop()}[...document.getElementsByTagName("table")].forEach(e=>{[...e.getElementsByTagName("tr")].forEach(e=>{e.onclick=()=>{speak(e.innerText)}})}),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("toggleVoice").onclick=toggleVoice,document.getElementById("restartButton").onclick=startGame,document.getElementById("startButton").onclick=startGame,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("kohacu").onclick=catNyan,document.getElementById("respeak").onclick=respeak,document.getElementById("startVoiceInput").onclick=startVoiceInput,document.getElementById("stopVoiceInput").onclick=stopVoiceInput,document.addEventListener("pointerdown",unlockAudio,{once:!0}),document.addEventListener("keydown",unlockAudio,{once:!0})