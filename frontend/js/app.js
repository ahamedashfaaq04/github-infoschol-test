// Simple quiz logic. Loads questions from backend/data/questions.json via fetch
(async () => {
  let questions = [];
  try {
    const resp = await fetch('../backend/data/questions.json');
    if (resp.ok) questions = await resp.json();
  } catch (e) {
    // fallback questions
    questions = [
      { id:1, q:"What is the capital of France?", options:["Paris","London","Berlin","Madrid"], a:0 },
      { id:2, q:"Which planet is known as the Red Planet?", options:["Earth","Mars","Jupiter","Venus"], a:1 },
      { id:3, q:"Which language is primarily used for web pages?", options:["Python","C++","HTML","Java"], a:2 }
    ];
  }

  const el = {
    qNumber: document.getElementById('questionNumber'),
    qText: document.getElementById('questionText'),
    answers: document.getElementById('answers'),
    nextBtn: document.getElementById('nextBtn'),
    restartBtn: document.getElementById('restartBtn'),
    result: document.getElementById('result'),
    scoreText: document.getElementById('scoreText'),
    themeToggle: document.getElementById('themeToggle'),
    questionCard: document.getElementById('questionCard')
  };

  let current = 0;
  let score = 0;
  let answered = false;
  const total = questions.length;

  function renderQuestion() {
    el.result.classList.add('hidden');
    el.questionCard.classList.remove('hidden');
    el.nextBtn.disabled = true;
    answered = false;

    const q = questions[current];
    el.qNumber.textContent = `Question ${current + 1} of ${total}`;
    el.qText.textContent = q.q;
    el.answers.innerHTML = '';

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.type = 'button';
      btn.textContent = opt;
      btn.setAttribute('data-idx', idx);
      btn.setAttribute('aria-pressed', 'false');
      btn.addEventListener('click', onSelect);
      el.answers.appendChild(btn);
    });
  }

  function onSelect(e) {
    if (answered) return;
    answered = true;
    const selected = Number(e.currentTarget.getAttribute('data-idx'));
    const correctIdx = questions[current].a;
    Array.from(el.answers.children).forEach(btn => {
      btn.setAttribute('aria-pressed', 'true');
      const idx = Number(btn.getAttribute('data-idx'));
      if (idx === correctIdx) btn.classList.add('correct');
      if (idx === selected && idx !== correctIdx) btn.classList.add('wrong');
      btn.disabled = true;
    });

    if (selected === correctIdx) score += 1;
    el.nextBtn.disabled = false;
    if (current === total - 1) el.nextBtn.textContent = 'Finish';
  }

  el.nextBtn.addEventListener('click', () => {
    if (!answered) return;
    current += 1;
    if (current >= total) return showResult();
    el.nextBtn.textContent = 'Next';
    renderQuestion();
  });

  el.restartBtn.addEventListener('click', () => {
    current = 0; score = 0; renderQuestion(); el.nextBtn.textContent = 'Next';
  });

  function showResult() {
    el.questionCard.classList.add('hidden');
    el.result.classList.remove('hidden');
    el.scoreText.textContent = `${score} / ${total} correct`;
  }

  // Theme toggle (dark <-> light)
  const root = document.documentElement;
  function updateThemeLabel() {
    const isLight = root.classList.contains('light');
    el.themeToggle.textContent = isLight ? 'Dark' : 'Light';
  }
  el.themeToggle.addEventListener('click', () => {
    root.classList.toggle('light');
    updateThemeLabel();
  });

  // init
  renderQuestion();
  updateThemeLabel();

})();