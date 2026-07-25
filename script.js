const PASS_SCORE = 8;

// Пізніше заміни на посилання для запису на курс.
const SIGNUP_URL = "https://example.com";

const levels = [
  {
    id: "A1.1",
    questions: [
      {
        text: "Ich ___ Kati.",
        options: ["bin", "ist", "sind"],
        correct: 0
      },
      {
        text: "Wie heißt du?",
        options: ["Ich bin 23 Jahre alt.", "Ich heiße Anna.", "Ich komme aus Deutschland."],
        correct: 1
      },
      {
        text: "Wir ___ aus der Ukraine.",
        options: ["kommen", "komme", "kommt"],
        correct: 0
      },
      {
        text: "Was ist richtig?",
        options: ["Ich habe ein Bruder.", "Ich habe einen Bruder.", "Ich haben einen Bruder."],
        correct: 1
      },
      {
        text: "___ wohnst du?",
        options: ["Wie", "Wohin", "Wo"],
        correct: 2
      },
      {
        text: "Er ___ Lehrer.",
        options: ["bist", "ist", "seid"],
        correct: 1
      },
      {
        text: "Es ist 08:30 Uhr. Wie sagt man das?",
        options: ["halb acht", "halb neun", "acht Uhr dreißig Minuten"],
        correct: 1
      },
      {
        text: "Ich ___ heute nicht arbeiten.",
        options: ["kann", "kannst", "können"],
        correct: 0
      },
      {
        text: "Um 6 Uhr ___ ich ___.",
        options: ["aufstehe", "auf ... stehe", "stehe ... auf"],
        correct: 2
      },
      {
        text: "Anna arbeitet ___ Ärztin.",
        options: ["als", "bei", "wie"],
        correct: 0
      }
    ]
  },
  {
    id: "A1.2",
    questions: [
      {
        text: "Welcher Satz ist richtig?",
        options: ["Ich kann nicht heute kommen.", "Ich kann heute nicht kommen.", "Ich heute kann nicht kommen."],
        correct: 1
      },
      {
        text: "Der Supermarkt ist ___ der Bank.",
        options: ["neben", "in", "ohne"],
        correct: 0
      },
      {
        text: "A: Hast du heute Zeit? B: Nein, ich ___ arbeiten.",
        options: ["kann", "darf", "muss"],
        correct: 2
      },
      {
        text: "In meiner Stadt ___ viele Museen.",
        options: ["sind", "gibt es", "es gibt"],
        correct: 1
      },
      {
        text: "Berlin ist ___ als Erfurt.",
        options: ["am größten", "größer", "groß"],
        correct: 1
      },
      {
        text: "Das Buch liegt ___ Tisch.",
        options: ["auf dem", "auf den", "in den"],
        correct: 0
      },
      {
        text: "Welche Imperativform ist falsch?",
        options: ["Lies bitte den Text!", "Seid bitte pünktlich!", "Kommst bitte früher!"],
        correct: 2
      },
      {
        text: "Welche Antwort passt? – Kommst du morgen mit?",
        options: ["Ja, gern!", "Es gibt ein Kino.", "Ich bin größer."],
        correct: 0
      },
      {
        text: "Du möchtest deinem Freund sagen, dass er die Tür schließen soll.",
        options: ["Schließt die Tür!", "Schließ die Tür!", "Schließen Sie die Tür!"],
        correct: 1
      },
      {
        text: "Gestern ___ ich ins Kino ___.",
        options: ["bin ... gegangen", "habe ... gegangen", "gehe ... gegangen"],
        correct: 0
      }
    ]
  }
];

const state = {
  name: "",
  email: "",
  levelIndex: 0,
  questionIndex: 0,
  selected: null,
  score: 0,
  results: {},
  lastPassed: null
};

const app = document.getElementById("app");

function brand() {
  return `
    <div class="brand">
      <span class="logo">🇩🇪</span>
      <span>DeutschLab</span>
    </div>
  `;
}

function showStart() {
  app.innerHTML = `
    ${brand()}
    <h1>Dein Deutsch­niveau</h1>
    <p>Teste kostenlos deine Kenntnisse auf den Stufen A1.1 und A1.2.</p>

    <ul class="features">
      <li>✓ 20 kurze Fragen</li>
      <li>✓ automatische Auswertung</li>
      <li>✓ persönliche Kursempfehlung</li>
    </ul>

    <div class="form-grid">
      <label>
        Vorname
        <input id="name" type="text" autocomplete="given-name" placeholder="Dein Vorname">
      </label>
      <label>
        E-Mail
        <input id="email" type="email" autocomplete="email" placeholder="name@email.de">
      </label>
    </div>

    <div id="start-error" class="error" hidden></div>

    <div class="actions">
      <button id="start" class="primary">Test starten</button>
    </div>

    <p class="small">Der Test dient als Orientierung und ersetzt kein persönliches Einstufungsgespräch.</p>
  `;

  document.getElementById("start").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const error = document.getElementById("start-error");

    if (!name || !email.includes("@")) {
      error.hidden = false;
      error.textContent = "Bitte gib deinen Namen und eine gültige E-Mail-Adresse ein.";
      return;
    }

    state.name = name;
    state.email = email;
    showQuestion();
  });
}

function showQuestion() {
  const level = levels[state.levelIndex];
  const question = level.questions[state.questionIndex];
  const progress = ((state.questionIndex + 1) / level.questions.length) * 100;

  app.innerHTML = `
    ${brand()}

    <div class="progress-box">
      <div class="progress-info">
        <span>Niveau ${level.id}</span>
        <span>${state.questionIndex + 1} / ${level.questions.length}</span>
      </div>
      <div class="progress">
        <div class="progress-value" style="width:${progress}%"></div>
      </div>
    </div>

    <div class="question-number">Frage ${state.questionIndex + 1}</div>
    <h2>${question.text}</h2>

    <div class="options">
      ${question.options.map((option, index) => `
        <button class="option" data-index="${index}">${option}</button>
      `).join("")}
    </div>

    <div id="answer-error" class="error" hidden>Bitte wähle eine Antwort.</div>

    <div class="actions">
      <button id="next" class="primary">Weiter</button>
    </div>
  `;

  document.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".option").forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
      state.selected = Number(button.dataset.index);
    });
  });

  document.getElementById("next").addEventListener("click", submitAnswer);
}

function submitAnswer() {
  if (state.selected === null) {
    document.getElementById("answer-error").hidden = false;
    return;
  }

  const level = levels[state.levelIndex];
  const question = level.questions[state.questionIndex];

  if (state.selected === question.correct) {
    state.score += 1;
  }

  state.selected = null;
  state.questionIndex += 1;

  if (state.questionIndex < level.questions.length) {
    showQuestion();
  } else {
    finishLevel();
  }
}

function finishLevel() {
  const level = levels[state.levelIndex];
  state.results[level.id] = state.score;

  if (state.score >= PASS_SCORE) {
    state.lastPassed = level.id;

    if (state.levelIndex < levels.length - 1) {
      showPassed(level);
    } else {
      showFinal("A1.2", "A2.1");
    }
  } else {
    if (level.id === "A1.1") {
      showFinal("Anfänger", "A1.1");
    } else {
      showFinal("A1.1", "A1.2");
    }
  }
}

function showPassed(level) {
  app.innerHTML = `
    ${brand()}
    <div class="badge">Teilniveau bestanden 🎉</div>
    <h2>${level.id}: ${state.score}/10 Punkten</h2>
    <p>Sehr gut! Du hast mindestens ${PASS_SCORE} richtige Antworten und kannst jetzt mit A1.2 weitermachen.</p>

    <div class="actions">
      <button id="continue" class="primary">Weiter zu A1.2</button>
    </div>
  `;

  document.getElementById("continue").addEventListener("click", () => {
    state.levelIndex = 1;
    state.questionIndex = 0;
    state.selected = null;
    state.score = 0;
    showQuestion();
  });
}

function showFinal(level, recommendation) {
  const scoreLines = Object.entries(state.results).map(([name, score]) => `
    <div class="score-line">
      <span>${name}</span>
      <strong>${score}/10</strong>
    </div>
  `).join("");

  app.innerHTML = `
    ${brand()}
    <div class="badge">Test abgeschlossen</div>
    <h1>Dein Ergebnis: <span class="result-level">${level}</span></h1>
    <p>Hallo ${escapeHtml(state.name)}, wir empfehlen dir als nächsten Kurs <strong>${recommendation}</strong>.</p>

    <div class="score-list">${scoreLines}</div>

    <div class="actions">
      <a class="button-link primary" href="${SIGNUP_URL}" target="_blank" rel="noopener">Zum Kurs anmelden</a>
      <button id="restart" class="secondary">Test wiederholen</button>
    </div>

    <p class="small">Für eine besonders genaue Einstufung empfehlen wir zusätzlich ein kurzes Gespräch mit einer Lehrkraft.</p>
  `;

  document.getElementById("restart").addEventListener("click", restart);
}

function restart() {
  state.name = "";
  state.email = "";
  state.levelIndex = 0;
  state.questionIndex = 0;
  state.selected = null;
  state.score = 0;
  state.results = {};
  state.lastPassed = null;
  showStart();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

showStart();
