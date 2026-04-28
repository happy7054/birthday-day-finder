/* INTRO TEXT */
const introTexts = [
  "Your weekday personality is loading.",
  "Time bends. Dates reveal truths.",
  "Every day has a vibe.",
  "Born on a feeling, not just a date."
];

document.getElementById("intro-text").textContent =
  introTexts[Math.floor(Math.random() * introTexts.length)];

const confettiSound = new Audio("resources/confetti-pop.mp3");
confettiSound.volume = 0.75;

/* QUOTES */
const dayQuotes = {
  Sunday: [
    "You didn’t let your parents rest even on a Sunday.",
    "Born chill. Chooses chaos."
  ],
  Monday: [
    "Born on hard mode.",
    "Coffee energy in human form."
  ],
  Tuesday: [
    "Quietly powerful.",
    "Low drama, high impact."
  ],
  Wednesday: [
    "Perfectly balanced chaos.",
    "Main character energy."
  ],
  Thursday: [
    "Almost weekend, always impatient.",
    "Strategic timing."
  ],
  Friday: [
    "Born for celebration.",
    "Weekend-coded human."
  ],
  Saturday: [
    "Vibes first, responsibilities later.",
    "Alarm clocks fear you."
  ]
};

/* ELEMENTS */
const month = document.getElementById("month");
const day = document.getElementById("day");
const year = document.getElementById("year");
const button = document.getElementById("find-btn");
const resultBox = document.querySelector(".result");
const dayResult = document.getElementById("day-result");
const quoteResult = document.getElementById("quote-result");

const bgMusic = document.getElementById("bg-music");
const musicSwitch = document.getElementById("music-switch");

/* MUSIC STATE */
bgMusic.volume = 0.25;
bgMusic.loop = true;

let musicEnabled = true;
let musicUnlocked = false;

// visual state
musicSwitch.classList.add("on");

// toggle music
musicSwitch.addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  musicSwitch.classList.toggle("on", musicEnabled);

  if (!musicEnabled) {
    bgMusic.pause();
  } else if (musicUnlocked) {
    bgMusic.play().catch(() => {});
  }
});

// unlock music on first user interaction (EVERY reload needs this)
function unlockMusicOnce() {
  if (!musicUnlocked && musicEnabled) {
    bgMusic.play().catch(() => {});
    musicUnlocked = true;
  }
}

// listen for any interaction — DO NOT REMOVE
document.addEventListener("click", unlockMusicOnce);
document.addEventListener("keydown", unlockMusicOnce);
document.addEventListener("touchstart", unlockMusicOnce);

/* DROPDOWNS */
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

months.forEach((m, i) => month.add(new Option(m, i)));
for (let d = 1; d <= 31; d++) day.add(new Option(d, d));

const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= 1900; y--) year.add(new Option(y, y));

/* ENABLE BUTTON */
document.querySelectorAll("select").forEach(s =>
  s.addEventListener("change", () => {
    button.disabled = !(month.value && day.value && year.value);
  })
);

/* BUTTON CLICK */
button.addEventListener("click", () => {
  confettiSound.currentTime = 0;
  confettiSound.play();

  const date = new Date(year.value, month.value, day.value);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

  dayResult.textContent = `You were born on a ${weekday}`;
  quoteResult.textContent =
    dayQuotes[weekday][Math.floor(Math.random() * dayQuotes[weekday].length)];

  resultBox.classList.remove("hidden");
  launchConfetti();
});

/* CONFETTI */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function launchConfetti() {
  const pieces = [];
  const colors = Array.from({ length: 20 }, (_, i) =>
    `hsl(${i * 18}, 80%, 65%)`
  );

  for (let i = 0; i < 220; i++) {
    const fromLeft = i % 2 === 0;

    pieces.push({
      x: fromLeft ? 0 : canvas.width,
      y: canvas.height,
      vx: fromLeft
        ? Math.random() * 6 + 2
        : -Math.random() * 6 - 2,
      vy: -Math.random() * 12 - 6,
      g: 0.25,
      r: Math.random() * 6 + 4,
      c: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
    });

    frame++;
    if (frame < 256) requestAnimationFrame(animate);
  }

  animate();
}
