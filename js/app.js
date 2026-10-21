/*
 * Ábaco – la aplicación: inicio con racha, sesión diaria, resultados,
 * hojas imprimibles, sección para aprender y panel de padres.
 */
(function () {
  'use strict';

  const C = window.Curriculum;
  const $ = id => document.getElementById(id);
  const STORE_KEY = 'abaco.v1';
  const AVATARS = ['🐼', '🦊', '🐰', '🐯', '🦄', '🐸', '🐨', '🐙'];
  const PRAISE = ['¡Muy bien!', '¡Genial!', '¡Excelente!', '¡Así se hace!', '¡Perfecto!', '¡Bravo!'];
  const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  /* ---------- Datos guardados ---------- */

  function defaults() {
    return {
      name: '',
      avatar: '🐼',
      levelId: C.LEVELS[0].id,
      passes: 0,
      settings: { perSession: 10, sound: true, rtl: true, labels: true },
      history: []
    };
  }

  function load() {
    const data = defaults();
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved && Array.isArray(saved.history)) {
        Object.assign(data, saved);
        data.settings = Object.assign(defaults().settings, saved.settings);
      }
    } catch (e) {
      // Sin almacenamiento disponible: la app funciona igual, sin recordar.
    }
    return data;
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* ver load() */ }
  }

  let data = load();

  /* ---------- Fechas y racha ---------- */

  function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function parseKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function addDays(key, n) {
    const d = parseKey(key);
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  function today() { return dateKey(new Date()); }

  function shortDate(key) { return parseKey(key).toLocaleDateString('es', { day: 'numeric', month: 'short' }); }

  function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  // Racha actual: días seguidos con sesión que terminan hoy (o ayer, si hoy aún no ha practicado).
  function streakInfo() {
    const days = new Set(data.history.map(h => h.date));
    let current = 0;
    let day = today();
    if (!days.has(day)) day = addDays(day, -1);
    while (days.has(day)) { current++; day = addDays(day, -1); }
    let best = 0, run = 0, prev = null;
    for (const key of [...days].sort()) {
      run = prev && addDays(prev, 1) === key ? run + 1 : 1;
      best = Math.max(best, run);
      prev = key;
    }
    return { current, best, days, doneToday: days.has(today()) };
  }

  function starsFor(correct, total) {
    const ratio = total ? correct / total : 0;
    return ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
  }

  // Guarda una sesión (de pantalla o de papel) y aplica la regla de avance de nivel.
  function recordSession({ date, levelId, correct, total, seconds, source }) {
    const level = C.getLevel(levelId);
    const passed = correct / total >= 0.9 && seconds / total <= level.targetSec;
    const entry = { date: date || today(), levelId, correct, total, seconds, source, passed };
    data.history.push(entry);
    let levelUp = null;
    if (levelId === data.levelId) {
      data.passes = passed ? data.passes + 1 : 0;
      if (data.passes >= 2 && C.levelIndex(levelId) < C.LEVELS.length - 1) {
        levelUp = C.nextLevel(levelId);
        data.levelId = levelUp.id;
        data.passes = 0;
      }
    }
    save();
    return { entry, levelUp };
  }

  /* ---------- Sonido ---------- */

  let audioCtx = null;
  function playTones(freqs) {
    if (!data.settings.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t = audioCtx.currentTime + i * 0.12;
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) { /* sin audio */ }
  }
  const soundOk = () => playTones([660, 880]);
  const soundTry = () => playTones([300]);
  const soundWin = () => playTones([523, 659, 784, 1047]);

  /* ---------- Navegación ---------- */

  let currentView = 'home';
  function show(view) {
    if (currentView === 'session' && view !== 'session') stopSession();
    currentView = view;
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== 'view-' + view; });
    window.scrollTo(0, 0);
    if (view === 'home') renderHome();
    if (view === 'print') renderPrint();
    if (view === 'learn') renderLearn();
    if (view === 'parents') renderParents();
  }

  document.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) show(go.dataset.go);
  });

  /* ---------- Inicio ---------- */

  function renderHome() {
    const level = C.getLevel(data.levelId);
    const streak = streakInfo();
    $('home-avatar').textContent = data.avatar;
    $('home-title').textContent = data.name ? `¡Hola, ${data.name}!` : '¡Hola!';
    $('home-date').textContent = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
    $('onboarding').hidden = !!data.name;

    $('streak-count').textContent = streak.current;
    $('streak-unit').textContent = streak.current === 1 ? 'día seguido' : 'días seguidos';
    $('streak-flame').classList.toggle('is-off', !streak.doneToday);
    $('streak-best').textContent = streak.doneToday
      ? `¡Hoy ya practicaste! Mejor racha: ${streak.best}`
      : streak.current ? '¡Practica hoy para no perder tu racha!' : 'Practica hoy para empezar tu racha.';

    const week = $('week-strip');
    week.innerHTML = '';
    for (let i = 6; i >= 0; i--) {
      const key = addDays(today(), -i);
      const li = document.createElement('li');
      li.textContent = WEEKDAYS[parseKey(key).getDay()];
      li.classList.toggle('is-done', streak.days.has(key));
      li.classList.toggle('is-today', i === 0);
      week.appendChild(li);
    }

    $('today-level').textContent = `${level.id} · ${level.name}`;
    $('today-tip').textContent = '💡 ' + level.tip;
    const todays = data.history.filter(h => h.date === today());
    if (todays.length) {
      const best = Math.max(...todays.map(h => starsFor(h.correct, h.total)));
      $('today-status').textContent = `✅ Sesión de hoy hecha ${'⭐'.repeat(best)}`;
      $('start-session').textContent = '▶ Practicar más';
    } else {
      $('today-status').textContent = `${data.settings.perSession} ejercicios · unos 10 minutos`;
      $('start-session').textContent = '▶ Empezar';
    }
  }

  function renderAvatarPicker() {
    const box = $('onboarding-avatars');
    box.innerHTML = '';
    AVATARS.forEach(a => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = a;
      b.className = 'avatar-option' + (a === data.avatar ? ' is-selected' : '');
      b.addEventListener('click', () => { data.avatar = a; renderAvatarPicker(); });
      box.appendChild(b);
    });
  }

  $('onboarding-save').addEventListener('click', () => {
    const name = $('onboarding-name').value.trim();
    if (!name) { $('onboarding-name').focus(); return; }
    data.name = name;
    save();
    renderHome();
  });

  $('home-avatar').addEventListener('click', () => {
    $('onboarding-name').value = data.name;
    $('onboarding').hidden = false;
    renderAvatarPicker();
    $('onboarding-name').focus();
  });

  $('start-session').addEventListener('click', () => startSession());

  /* ---------- Sesión ---------- */

  let session = null;
  let cur = null;
  let helperSoroban = null;
  let flashToken = 0;
  let playToken = 0;

  function startSession() {
    const level = C.getLevel(data.levelId);
    // El primer intento del día usa la misma semilla que la hoja impresa de ese día.
    const attempt = data.history.filter(h => h.date === today() && h.levelId === level.id && h.source === 'pantalla').length;
    session = {
      level,
      exercises: C.buildSheet(level.id, `${today()}|${level.id}|${attempt}`, data.settings.perSession),
      index: 0,
      results: [],
      start: Date.now(),
      timer: null
    };
    show('session');
    session.timer = setInterval(updateTimer, 1000);
    updateTimer();
    renderProgress();
    loadExercise();
  }

  function stopSession() {
    if (session) clearInterval(session.timer);
    flashToken++;
    playToken++;
  }

  function elapsed() { return Math.round((Date.now() - session.start) / 1000); }

  function updateTimer() { $('session-timer').textContent = formatTime(elapsed()); }

  function renderProgress() {
    const list = $('session-progress');
    list.innerHTML = '';
    session.exercises.forEach((_, i) => {
      const li = document.createElement('li');
      const r = session.results[i];
      if (r) li.className = r.correct ? 'is-ok' : 'is-miss';
      else if (i === session.index) li.className = 'is-current';
      list.appendChild(li);
    });
  }

  function isSmallPair(ex) {
    return ex.terms.length === 2 && ex.terms.every(t => Math.abs(t) < 10);
  }

  function loadExercise() {
    const ex = session.exercises[session.index];
    const level = session.level;
    flashToken++;
    playToken++;
    cur = { ex, attempts: 0, answer: '', done: false, boxes: 0, rtl: false, soroban: null, locked: false };
    $('feedback').textContent = '';
    $('feedback').className = 'feedback';
    $('exercise-actions').innerHTML = '';
    const body = $('exercise-body');
    body.innerHTML = '';

    const instruction = {
      leer: '¿Qué número muestra el ábaco?',
      poner: 'Pon este número en el ábaco',
      flash: 'Mira los números y calcula de memoria',
      calculo: level.instruction
    }[ex.type];
    $('exercise-instruction').textContent = `(${session.index + 1}) ${instruction}`;
    $('keypad').hidden = ex.type === 'poner';
    $('helper').hidden = ex.type !== 'calculo';
    $('helper-step').hidden = true;

    if (ex.type === 'leer') {
      const holder = document.createElement('div');
      holder.className = 'exercise-abacus';
      body.appendChild(holder);
      new window.Soroban(holder, { rods: ex.rods, value: ex.value, interactive: false, showLabels: data.settings.labels });
      cur.boxes = ex.rods;
      body.appendChild(answerRow());
    } else if (ex.type === 'poner') {
      const target = document.createElement('div');
      target.className = 'target-number';
      target.textContent = ex.value;
      body.appendChild(target);
      const holder = document.createElement('div');
      holder.className = 'exercise-abacus';
      body.appendChild(holder);
      cur.soroban = new window.Soroban(holder, { rods: ex.rods, interactive: true, showLabels: data.settings.labels });
      addAction('¡Listo! ✓', 'btn-primary', check);
      addAction('Limpiar', 'btn-soft', () => cur.soroban.clear());
    } else if (ex.type === 'flash') {
      const stage = document.createElement('div');
      stage.className = 'flash-stage';
      stage.id = 'flash-stage';
      body.appendChild(stage);
      cur.boxes = Math.max(2, String(ex.answer).length);
      const row = answerRow();
      row.hidden = true;
      body.appendChild(row);
      playFlash();
    } else {
      const termLen = Math.max(...ex.terms.map(t => String(Math.abs(t)).length));
      // Escribir unidades primero solo tiene sentido con números de varias cifras en columna.
      cur.rtl = data.settings.rtl && termLen > 1;
      cur.boxes = Math.max(String(ex.answer).length, termLen + (ex.terms.slice(1).some(t => t > 0) ? 1 : 0));
      body.appendChild(buildOperation(ex, answerBoxes(cur.boxes)));
      setupHelper(ex);
    }
    renderAnswer();
  }

  function addAction(label, cls, fn) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn ' + cls;
    b.textContent = label;
    b.addEventListener('click', fn);
    $('exercise-actions').appendChild(b);
    return b;
  }

  function answerBoxes(n) {
    const wrap = document.createElement('span');
    wrap.className = 'answer-boxes';
    wrap.id = 'answer-boxes';
    for (let i = 0; i < n; i++) {
      const box = document.createElement('span');
      box.className = 'answer-box';
      wrap.appendChild(box);
    }
    return wrap;
  }

  function answerRow() {
    const row = document.createElement('div');
    row.className = 'answer-row';
    row.appendChild(answerBoxes(cur.boxes));
    return row;
  }

  // Operación al estilo de las hojas Kumon: horizontal si es corta, en columna si no.
  function buildOperation(ex, answerNode) {
    if (isSmallPair(ex) || ex.type === 'flash') {
      const line = document.createElement('div');
      line.className = 'op-inline';
      ex.terms.forEach((t, i) => {
        if (i > 0) line.appendChild(textSpan(t < 0 ? '−' : '+', 'op-sign'));
        line.appendChild(textSpan(String(Math.abs(t)), 'op-num'));
      });
      line.appendChild(textSpan('=', 'op-sign'));
      line.appendChild(answerNode);
      return line;
    }
    const width = Math.max(answerNode.childElementCount || 0, ...ex.terms.map(t => String(Math.abs(t)).length));
    const col = document.createElement('div');
    col.className = 'op-column';
    col.style.setProperty('--cols', width);
    ex.terms.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'op-row';
      row.appendChild(textSpan(i === 0 ? '' : t < 0 ? '−' : '+', 'op-sign'));
      const digits = String(Math.abs(t)).padStart(width, ' ');
      const cells = document.createElement('span');
      cells.className = 'op-cells';
      for (const ch of digits) cells.appendChild(textSpan(ch.trim(), 'op-cell'));
      row.appendChild(cells);
      col.appendChild(row);
    });
    const line = document.createElement('div');
    line.className = 'op-line';
    col.appendChild(line);
    const answer = document.createElement('div');
    answer.className = 'op-row';
    answer.appendChild(textSpan('', 'op-sign'));
    answer.appendChild(answerNode);
    col.appendChild(answer);
    return col;
  }

  function textSpan(text, cls) {
    const s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    return s;
  }

  function renderAnswer(revealed) {
    const wrap = $('answer-boxes');
    if (!wrap) return;
    const text = revealed ? String(cur.ex.answer) : cur.answer;
    const boxes = [...wrap.children];
    const offset = boxes.length - text.length;
    boxes.forEach((box, i) => {
      box.textContent = i >= offset ? text[i - offset] : '';
      box.classList.toggle('is-next', !cur.done && cur.rtl && i === offset - 1);
      box.classList.toggle('is-revealed', !!revealed);
    });
  }

  function handleKey(key) {
    if (!cur || cur.locked) return;
    if (cur.done) {
      if (key === 'Enter' && cur.waitingNext) nextExercise();
      return;
    }
    if (key === 'Enter') { check(); return; }
    if (cur.ex.type === 'poner') return;
    if (key === 'Backspace') {
      cur.answer = cur.rtl ? cur.answer.slice(1) : cur.answer.slice(0, -1);
    } else if (/^[0-9]$/.test(key) && cur.answer.length < cur.boxes) {
      cur.answer = cur.rtl ? key + cur.answer : cur.answer + key;
    }
    renderAnswer();
  }

  $('keypad').addEventListener('click', e => {
    const b = e.target.closest('[data-key]');
    if (b) handleKey(b.dataset.key);
  });

  document.addEventListener('keydown', e => {
    if (currentView !== 'session') return;
    if (e.target.closest('input, select, textarea, [tabindex]')) return;
    if (/^[0-9]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
      e.preventDefault();
      handleKey(e.key);
    }
  });

  function check() {
    const ex = cur.ex;
    let given;
    if (ex.type === 'poner') {
      given = cur.soroban.getValue();
    } else {
      if (cur.answer === '') return;
      given = parseInt(cur.answer, 10);
    }
    const fb = $('feedback');
    if (given === ex.answer) {
      cur.done = true;
      session.results[session.index] = { correct: cur.attempts === 0 };
      fb.textContent = PRAISE[Math.floor(Math.random() * PRAISE.length)] + ' ⭐';
      fb.className = 'feedback is-ok';
      if (cur.soroban) cur.soroban.setInteractive(false);
      renderAnswer();
      soundOk();
      renderProgress();
      cur.locked = true;
      setTimeout(nextExercise, 900);
      return;
    }
    cur.attempts++;
    soundTry();
    $('exercise-card').classList.remove('shake');
    void $('exercise-card').offsetWidth;
    $('exercise-card').classList.add('shake');
    if (cur.attempts < 2) {
      fb.textContent = 'Casi… revisa e inténtalo otra vez 💪';
      fb.className = 'feedback is-try';
      cur.answer = '';
      renderAnswer();
      return;
    }
    // Segundo error: se muestra la respuesta y cómo llegar a ella.
    cur.done = true;
    cur.waitingNext = true;
    session.results[session.index] = { correct: false };
    fb.textContent = `La respuesta es ${ex.answer}. ¡La próxima te sale!`;
    fb.className = 'feedback is-miss';
    renderProgress();
    if (ex.type === 'poner') {
      cur.soroban.setInteractive(false);
      cur.soroban.setValue(ex.answer);
    } else {
      renderAnswer(true);
    }
    $('exercise-actions').innerHTML = '';
    if (ex.type === 'calculo') addAction('🧮 Ver cómo se hace', 'btn-soft', () => playExplanation(ex));
    addAction('Siguiente ▶', 'btn-primary', nextExercise);
  }

  function nextExercise() {
    session.index++;
    if (session.index >= session.exercises.length) finishSession();
    else { renderProgress(); loadExercise(); }
  }

  /* --- Ábaco de ayuda y explicación paso a paso --- */

  function setupHelper(ex) {
    helperSoroban = new window.Soroban($('helper-abacus'), {
      rods: ex.rods, interactive: true, showDigits: false, showLabels: data.settings.labels
    });
  }

  $('helper-clear').addEventListener('click', () => {
    playToken++;
    $('helper-step').hidden = true;
    if (helperSoroban) { helperSoroban.highlight(null); helperSoroban.clear(); }
  });

  function playExplanation(ex) {
    const token = ++playToken;
    const steps = C.explain(ex.terms);
    const helper = $('helper');
    helper.hidden = false;
    helper.open = true;
    helper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const text = $('helper-step');
    text.hidden = false;
    let i = 0;
    (function step() {
      if (token !== playToken) return;
      const s = steps[i];
      helperSoroban.setValue(s.value);
      helperSoroban.highlight(s.place);
      text.textContent = s.text;
      if (++i < steps.length) setTimeout(step, 2600);
    })();
  }

  /* --- Flash (anzan) --- */

  function playFlash() {
    const token = ++flashToken;
    const ex = cur.ex;
    const stage = $('flash-stage');
    const row = stage.nextElementSibling;
    cur.locked = true;
    row.hidden = true;
    $('exercise-actions').innerHTML = '';
    const frames = [{ text: '¿Lista?', ms: 1000 }];
    ex.terms.forEach((t, i) => {
      frames.push({ text: (i === 0 ? '' : t < 0 ? '− ' : '+ ') + Math.abs(t), ms: ex.intervalMs, big: true });
      frames.push({ text: '', ms: 250 });
    });
    let i = 0;
    (function frame() {
      if (token !== flashToken) return;
      if (i >= frames.length) {
        stage.textContent = '= ?';
        stage.className = 'flash-stage';
        row.hidden = false;
        cur.locked = false;
        addAction('👀 Ver otra vez', 'btn-soft', playFlash);
        return;
      }
      const f = frames[i++];
      stage.textContent = f.text;
      stage.className = 'flash-stage' + (f.big ? ' is-big' : '');
      setTimeout(frame, f.ms);
    })();
  }

  $('session-exit').addEventListener('click', () => {
    if (window.confirm('¿Salir de la sesión? No se guardará.')) show('home');
  });

  /* ---------- Resultado ---------- */

  function finishSession() {
    stopSession();
    const total = session.exercises.length;
    const correct = session.results.filter(r => r && r.correct).length;
    const seconds = elapsed();
    const { entry, levelUp } = recordSession({ levelId: session.level.id, correct, total, seconds, source: 'pantalla' });
    const stars = starsFor(correct, total);
    $('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    $('result-title').textContent = stars === 3 ? '¡Increíble!' : stars === 2 ? '¡Muy bien!' : '¡Buen trabajo!';
    $('result-score').textContent = `${correct}/${total}`;
    $('result-time').textContent = formatTime(seconds);
    $('result-streak').textContent = streakInfo().current;
    $('result-level').textContent = levelMessage(entry, levelUp);
    show('result');
    soundWin();
    confetti(stars === 3 || levelUp ? 60 : 25);
  }

  function levelMessage(entry, levelUp) {
    if (levelUp) return `🎉 ¡Subiste de nivel! Ahora: ${levelUp.id} · ${levelUp.name}`;
    if (entry.passed) return '¡Dominaste esta sesión! Una más así y pasas de nivel.';
    if (entry.correct / entry.total >= 0.9) return '¡Todo muy bien! Ahora intenta ir un poquito más rápido.';
    return 'Repetiremos este nivel para dominarlo. ¡Practicar es el secreto! 💪';
  }

  $('result-more').addEventListener('click', () => startSession());

  function confetti(n) {
    const box = $('confetti');
    box.innerHTML = '';
    const pieces = ['⭐', '🎉', '✨', '🟠', '🟣', '🔵', '🟢'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = pieces[i % pieces.length];
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = Math.random() * 0.8 + 's';
      s.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
      box.appendChild(s);
    }
    setTimeout(() => { box.innerHTML = ''; }, 4000);
  }

  /* ---------- Hojas imprimibles ---------- */

  function fillLevelSelect(select) {
    select.innerHTML = '';
    let group = null, og = null;
    C.LEVELS.forEach(l => {
      if (l.group !== group) {
        group = l.group;
        og = document.createElement('optgroup');
        og.label = group;
        select.appendChild(og);
      }
      const o = document.createElement('option');
      o.value = l.id;
      o.textContent = `${l.id} · ${l.name}`;
      og.appendChild(o);
    });
    select.value = data.levelId;
  }

  function renderPrint() {
    fillLevelSelect($('print-level'));
    $('print-start').value = today();
    $('paper-date').value = today();
    $('paper-total').value = data.settings.perSession;
    $('paper-correct').value = data.settings.perSession;
    $('paper-msg').textContent = '';
    buildSheets();
  }

  ['print-level', 'print-start', 'print-pages', 'print-answers'].forEach(id => $(id).addEventListener('change', buildSheets));

  function buildSheets() {
    const levelId = $('print-level').value;
    const level = C.getLevel(levelId);
    const start = $('print-start').value || today();
    const pages = Math.min(14, Math.max(1, parseInt($('print-pages').value, 10) || 1));
    const box = $('print-sheets');
    box.innerHTML = '';
    const keys = [];
    for (let p = 0; p < pages; p++) {
      const date = addDays(start, p);
      const exercises = C.buildSheet(levelId, `${date}|${levelId}|0`, 10);
      keys.push({ date, exercises });
      box.appendChild(buildSheet(level, date, p + 1, exercises));
    }
    if ($('print-answers').checked) box.appendChild(buildAnswerSheet(level, keys));
  }

  function sheetHeader(level, date, n) {
    const head = document.createElement('header');
    head.className = 'sheet-head';
    head.innerHTML = `
      <div>
        <div class="sheet-code"><b></b> <span></span></div>
        <div class="sheet-title"></div>
      </div>
      <div class="sheet-fields">
        <div>Nombre <span class="line"></span></div>
        <div>Fecha <span class="line date"></span></div>
        <div>Tiempo <span class="line">:</span></div>
      </div>`;
    head.querySelector('b').textContent = level.id;
    head.querySelector('.sheet-code span').textContent = n ? `hoja ${n}` : 'respuestas';
    head.querySelector('.sheet-title').textContent = level.name;
    head.querySelector('.date').textContent = date ? parseKey(date).toLocaleDateString('es') : '';
    if (!n) head.querySelector('.sheet-fields').remove();
    return head;
  }

  function buildSheet(level, date, n, exercises) {
    const sheet = document.createElement('article');
    sheet.className = 'sheet';
    sheet.appendChild(sheetHeader(level, date, n));
    const kinds = new Set(exercises.map(e => e.type));
    const instruction = document.createElement('p');
    instruction.className = 'sheet-instruction';
    instruction.textContent = '◆ ' + (kinds.has('leer') || kinds.has('poner')
      ? 'Escribe el número que muestra el ábaco, o colorea las cuentas del número.'
      : kinds.has('flash') ? 'Calcula de memoria, sin ábaco:' : level.instruction + ':');
    sheet.appendChild(instruction);

    const grid = document.createElement('div');
    grid.className = 'sheet-grid' + (exercises.some(e => e.type === 'calculo' && e.terms.length > 2) ? ' cols-4' : '');
    exercises.forEach((ex, i) => {
      const item = document.createElement('div');
      item.className = 'sheet-item';
      item.appendChild(textSpan(`(${i + 1})`, 'sheet-num'));
      const content = document.createElement('div');
      content.className = 'sheet-content';
      if (ex.type === 'leer' || ex.type === 'poner') {
        if (ex.type === 'poner') content.appendChild(textSpan(String(ex.value), 'sheet-target'));
        const holder = document.createElement('div');
        holder.className = 'sheet-abacus';
        content.appendChild(holder);
        new window.Soroban(holder, { rods: ex.rods, value: ex.type === 'leer' ? ex.value : 0, interactive: false, animate: false });
        if (ex.type === 'leer') content.appendChild(textSpan('', 'sheet-blank'));
      } else {
        const blanks = document.createElement('span');
        blanks.className = 'answer-boxes paper';
        const termLen = Math.max(...ex.terms.map(t => String(Math.abs(t)).length));
        const n = Math.max(String(ex.answer).length, termLen + (ex.terms.slice(1).some(t => t > 0) ? 1 : 0));
        for (let k = 0; k < n; k++) blanks.appendChild(textSpan('', 'answer-box'));
        content.appendChild(buildOperation(ex, blanks));
      }
      item.appendChild(content);
      grid.appendChild(item);
    });
    sheet.appendChild(grid);

    const foot = document.createElement('footer');
    foot.className = 'sheet-foot';
    foot.textContent = `Aciertos: ______ / ${exercises.length}      ·      Mi Ábaco`;
    sheet.appendChild(foot);
    return sheet;
  }

  function buildAnswerSheet(level, keys) {
    const sheet = document.createElement('article');
    sheet.className = 'sheet answers';
    sheet.appendChild(sheetHeader(level, null, 0));
    keys.forEach(({ date, exercises }, p) => {
      const block = document.createElement('div');
      block.className = 'answer-block';
      const title = document.createElement('h3');
      title.textContent = `Hoja ${p + 1} · ${parseKey(date).toLocaleDateString('es')}`;
      block.appendChild(title);
      const list = document.createElement('ol');
      exercises.forEach(ex => {
        const li = document.createElement('li');
        li.textContent = ex.answer;
        list.appendChild(li);
      });
      block.appendChild(list);
      sheet.appendChild(block);
    });
    return sheet;
  }

  $('print-go').addEventListener('click', () => { buildSheets(); window.print(); });

  $('paper-save').addEventListener('click', () => {
    const total = Math.max(1, parseInt($('paper-total').value, 10) || 1);
    const correct = Math.min(total, Math.max(0, parseInt($('paper-correct').value, 10) || 0));
    const minutes = Math.max(1, parseInt($('paper-minutes').value, 10) || 1);
    const { levelUp } = recordSession({
      date: $('paper-date').value || today(),
      levelId: data.levelId,
      correct, total,
      seconds: minutes * 60,
      source: 'papel'
    });
    $('paper-msg').textContent = `¡Guardada! Racha: ${streakInfo().current} 🔥` + (levelUp ? ` · Nuevo nivel: ${levelUp.id}` : '');
  });

  /* ---------- Aprende ---------- */

  let freeSoroban = null;
  let demoSoroban = null;
  let demo = { steps: [], i: 0 };

  function renderLearn() {
    if (!freeSoroban) {
      freeSoroban = new window.Soroban($('free-abacus'), {
        rods: 4, showDigits: true, showLabels: true,
        onChange: v => { $('free-number').textContent = v; }
      });
      const examples = [[2, 2], [4, 3], [7, 5], [6, -2], [12, -5], [235, 149]];
      examples.forEach(([a, b]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.textContent = `${a} ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
        btn.addEventListener('click', () => {
          $('demo-a').value = a;
          $('demo-op').value = b < 0 ? '-' : '+';
          $('demo-b').value = Math.abs(b);
          startDemo();
        });
        $('demo-examples').appendChild(btn);
      });
      demoSoroban = new window.Soroban($('demo-abacus'), { rods: 4, showDigits: true, showLabels: true, interactive: false });
    }
  }

  $('free-clear').addEventListener('click', () => freeSoroban.clear());

  function startDemo() {
    const a = parseInt($('demo-a').value, 10);
    const b = parseInt($('demo-b').value, 10);
    const sub = $('demo-op').value === '-';
    if (!(a >= 0 && b >= 0 && a <= 9999 && b <= 9999)) {
      $('demo-text').textContent = 'Usa números del 0 al 9999.';
      return;
    }
    if (sub && b > a) {
      $('demo-text').textContent = 'Para restar, el primer número debe ser el más grande.';
      return;
    }
    const terms = [a, sub ? -b : b];
    const rods = C.rodsFor({ terms });
    if (rods !== demoSoroban.rods) {
      demoSoroban = new window.Soroban($('demo-abacus'), { rods, showDigits: true, showLabels: true, interactive: false });
    }
    demo = { steps: C.explain(terms), i: 0 };
    showDemoStep();
  }

  function showDemoStep() {
    const s = demo.steps[demo.i];
    if (!s) return;
    demoSoroban.setValue(s.value);
    demoSoroban.highlight(s.place);
    $('demo-text').textContent = `Paso ${demo.i + 1} de ${demo.steps.length}: ${s.text}`;
    $('demo-prev').disabled = demo.i === 0;
    $('demo-next').disabled = demo.i >= demo.steps.length - 1;
  }

  $('demo-start').addEventListener('click', startDemo);
  $('demo-prev').addEventListener('click', () => { if (demo.i > 0) { demo.i--; showDemoStep(); } });
  $('demo-next').addEventListener('click', () => { if (demo.i < demo.steps.length - 1) { demo.i++; showDemoStep(); } });

  /* ---------- Padres ---------- */

  let gate = null;
  let parentsUnlocked = false;

  function renderParents() {
    $('parents-gate').hidden = parentsUnlocked;
    $('parents-content').hidden = !parentsUnlocked;
    if (!parentsUnlocked) {
      gate = [6 + Math.floor(Math.random() * 4), 6 + Math.floor(Math.random() * 4)];
      $('gate-question').textContent = `${gate[0]} × ${gate[1]}`;
      $('gate-answer').value = '';
      return;
    }
    const level = C.getLevel(data.levelId);
    $('set-name').value = data.name;
    fillLevelSelect($('set-level'));
    $('set-count').value = String(data.settings.perSession);
    $('set-sound').checked = data.settings.sound;
    $('set-rtl').checked = data.settings.rtl;
    $('set-labels').checked = data.settings.labels;
    $('level-progress').textContent = `Nivel ${level.id}: ${data.passes} de 2 sesiones dominadas. Tiempo objetivo: ${level.targetSec} s por ejercicio.`;

    const atLevel = data.history.filter(h => h.levelId === level.id).slice(-2);
    const struggling = atLevel.length === 2 && atLevel.every(h => h.correct / h.total < 0.6);
    const suggestion = $('level-suggestion');
    suggestion.hidden = !struggling || C.levelIndex(level.id) === 0;
    suggestion.textContent = `Las dos últimas sesiones costaron trabajo. Considera volver a ${C.previousLevel(level.id).id} unos días para ganar confianza.`;

    const list = $('level-list');
    list.innerHTML = '';
    const idx = C.levelIndex(level.id);
    C.LEVELS.forEach((l, i) => {
      const li = document.createElement('li');
      li.textContent = `${i < idx ? '✅' : i === idx ? '👉' : '⬜'} ${l.id} · ${l.name}`;
      li.className = i === idx ? 'is-current' : '';
      list.appendChild(li);
    });

    const tbody = $('history-body');
    tbody.innerHTML = '';
    const rows = data.history.map((h, i) => ({ h, i })).reverse().slice(0, 60);
    if (!rows.length) {
      const tr = tbody.insertRow();
      const td = tr.insertCell();
      td.colSpan = 6;
      td.textContent = 'Todavía no hay sesiones.';
    }
    rows.forEach(({ h, i }) => {
      const tr = tbody.insertRow();
      [shortDate(h.date), h.levelId, `${h.correct}/${h.total}${h.passed ? ' ✓' : ''}`, formatTime(h.seconds), h.source === 'papel' ? '📄 papel' : '💻 pantalla']
        .forEach(text => { tr.insertCell().textContent = text; });
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'icon-btn small';
      del.textContent = '✕';
      del.setAttribute('aria-label', 'Borrar sesión');
      del.addEventListener('click', () => {
        if (!window.confirm('¿Borrar esta sesión del historial?')) return;
        data.history.splice(i, 1);
        save();
        renderParents();
      });
      tr.insertCell().appendChild(del);
    });
  }

  $('gate-go').addEventListener('click', () => {
    if (parseInt($('gate-answer').value, 10) === gate[0] * gate[1]) {
      parentsUnlocked = true;
      renderParents();
    } else {
      $('gate-answer').value = '';
      renderParents();
    }
  });
  $('gate-answer').addEventListener('keydown', e => { if (e.key === 'Enter') $('gate-go').click(); });

  $('set-name').addEventListener('change', e => { data.name = e.target.value.trim(); save(); });
  $('set-level').addEventListener('change', e => { data.levelId = e.target.value; data.passes = 0; save(); renderParents(); });
  $('set-count').addEventListener('change', e => { data.settings.perSession = parseInt(e.target.value, 10); save(); });
  $('set-sound').addEventListener('change', e => { data.settings.sound = e.target.checked; save(); });
  $('set-rtl').addEventListener('change', e => { data.settings.rtl = e.target.checked; save(); });
  $('set-labels').addEventListener('change', e => { data.settings.labels = e.target.checked; save(); });

  $('export-data').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `abaco-${(data.name || 'progreso').toLowerCase()}-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $('import-data').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (!imported || !Array.isArray(imported.history)) throw new Error('formato');
        data = Object.assign(defaults(), imported);
        data.settings = Object.assign(defaults().settings, imported.settings);
        save();
        renderParents();
        window.alert('¡Progreso importado!');
      } catch (err) {
        window.alert('Ese archivo no es una copia válida de Mi Ábaco.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });

  $('reset-data').addEventListener('click', () => {
    if (!window.confirm('¿Borrar todo el progreso? No se puede deshacer.')) return;
    data = defaults();
    save();
    renderParents();
  });

  /* ---------- Arranque ---------- */

  renderAvatarPicker();
  show('home');
})();
