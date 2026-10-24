/*
 * Ábaco – la aplicación: el camino de niveles con su progreso, sesiones guiadas
 * por Mapi (Mira → Juntos → Tú) con ayuda «?», logros, práctica en papel,
 * ábaco libre y el área de padres (hojas para imprimir, ajustes e historial).
 */
(function () {
  'use strict';

  const C = window.Curriculum;
  const K = window.Caligrafia;
  const J = window.Juegos;
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
      levelStart: 0,
      settings: { perSession: 10, sound: true, rtl: true, labels: true, abacus: 'real', voice: true, gamesLock: true, dictation: 'auto' },
      lessons: {},
      games: { log: [] },
      dictations: [],
      levelStars: {},
      stars: 0,
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
        data.lessons = Object.assign({}, saved.lessons);
        data.levelStars = Object.assign({}, saved.levelStars);
        data.games = Object.assign(defaults().games, saved.games);
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
  normalizeGames();

  // Cada juego guarda su nivel, su registro de partidas y su avance de dominio.
  function normalizeGames() {
    window.Juegos.GAMES.forEach(g => { data.games[g.id] = window.Juegos.normalize(g.id, data.games[g.id]); });
    data.games.log = data.games.log || [];
  }

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

  function dayNumber(key) { return Math.round(parseKey(key).getTime() / 86400000); }

  function shortDate(key) { return parseKey(key).toLocaleDateString('es', { day: 'numeric', month: 'short' }); }

  function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  // Racha actual: días seguidos con sesión que terminan hoy (o ayer, si hoy aún no ha practicado).
  function streakInfo() {
    const days = new Set(data.history.map(h => h.date).concat((data.dictations || []).map(d => d.date)));
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

  // Estadísticas de un nivel. Para el nivel actual solo cuentan las sesiones
  // desde que se empezó (o se eligió) ese nivel.
  function levelStats(levelId) {
    const since = levelId === data.levelId ? data.levelStart || 0 : 0;
    const all = data.history.filter(h => h.levelId === levelId && (h.at || 0) >= since);
    const recent = all.slice(-3);
    const answered = all.reduce((sum, h) => sum + h.total, 0);
    const correct = all.reduce((sum, h) => sum + h.correct, 0);
    const seconds = all.reduce((sum, h) => sum + h.seconds, 0);
    const recentPassed = recent.filter(h => h.passed).length;
    return {
      practices: all.length,
      recentPassed,
      accuracy: answered ? Math.round((100 * correct) / answered) : null,
      consistency: recent.length ? Math.round((100 * recentPassed) / recent.length) : null,
      avgSeconds: answered ? Math.round(seconds / answered) : null
    };
  }

  function setLevel(levelId) {
    data.levelId = levelId;
    data.levelStart = Date.now();
  }

  // Guarda una sesión (de pantalla o de papel) y aplica la regla de avance de nivel:
  // 2 sesiones dominadas entre las últimas 3 del nivel actual.
  function recordSession({ date, levelId, correct, total, seconds, source }) {
    const level = C.getLevel(levelId);
    const passed = correct / total >= 0.9 && seconds / total <= level.targetSec;
    const entry = { date: date || today(), at: Date.now(), levelId, correct, total, seconds, source, passed };
    data.history.push(entry);
    let levelUp = null;
    const stats = levelStats(levelId);
    if (levelId === data.levelId && stats.recentPassed >= 2 && C.levelIndex(levelId) < C.LEVELS.length - 1) {
      levelUp = C.nextLevel(levelId);
      setLevel(levelUp.id);
    }
    save();
    return { entry, levelUp, stats };
  }

  // Por qué toca este nivel hoy y qué falta para superarlo.
  function recommendation(level, stats) {
    if (!stats.practices) return 'Primera vez en este nivel: hoy creas tu punto de partida.';
    if (stats.recentPassed === 1) return 'Ya dominaste 1 sesión. ¡Una más y pasas de nivel!';
    return `Para pasar de nivel: 2 sesiones con 9 de cada 10 bien y menos de ${level.targetSec} s por ejercicio.`;
  }

  /* ---------- Sonido y voz ---------- */

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
  const soundTick = () => playTones([880]);

  // Voz de Mapi con la síntesis del dispositivo. La calidad depende de las voces
  // instaladas: se elige la más natural en español (o la que elijan los padres).
  let voice = null;

  function spanishVoices() {
    try { return window.speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang)); } catch (e) { return []; }
  }

  // Puntaje para preferir voces neuronales/mejoradas y de Latinoamérica.
  function voiceScore(v) {
    let score = 0;
    if (/natural|neural|online|premium|enhanced|mejorad|siri|wavenet/i.test(v.name)) score += 40;
    if (/google/i.test(v.name)) score += 25;
    if (!v.localService) score += 10;
    if (/(CO|MX|US|419)/i.test(v.lang)) score += 8;
    if (/compact|espeak|robot/i.test(v.name)) score -= 50;
    return score;
  }

  function pickVoice() {
    const voices = spanishVoices();
    voice = voices.find(v => v.name === data.settings.voiceName)
      || voices.slice().sort((a, b) => voiceScore(b) - voiceScore(a))[0]
      || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = () => { pickVoice(); if (currentView === 'parents') fillVoiceSelect(); };
  }

  // Convierte el texto de pantalla en algo natural para decir en voz alta.
  function speakable(text) {
    return text
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/[★☆⭐]/g, '')
      .replace(/\(([+−-])(\d+)\)/g, (m, sign, n) => (sign === '+' ? 'más ' : 'menos ') + n)
      .replace(/\s?−\s?/g, ' menos ')
      .replace(/\s?\+\s?/g, ' más ')
      .replace(/\s?×\s?/g, ' por ')
      .replace(/\s?=\s?\?/g, ', ¿cuánto es?')
      .replace(/(\d+)\s?→\s?\?/g, 'el número después del $1')
      .replace(/\?\s?←\s?(\d+)/g, 'el número antes del $1')
      .replace(/^\s*…\s*/, '')
      .replace(/\s*…\s*$/, '.')
      .replace(/…/g, ', ')
      .replace(/\s?·\s?/g, ', ')
      .replace(/[«»]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function say(text) {
    if (!data.settings.voice || !('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      if (!voice) pickVoice();
      // Frase por frase: suena más natural y evita que algunos navegadores corten textos largos.
      const parts = speakable(text).split(/(?<=[.!?])\s+/).filter(Boolean);
      parts.forEach(part => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = voice ? voice.lang : 'es-MX';
        if (voice) u.voice = voice;
        u.rate = data.settings.voiceRate || 0.95;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
      });
    } catch (e) { /* sin voz */ }
  }

  function hush() {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { /* sin voz */ }
  }

  // Mapi dice algo: globo de texto, voz y un gesto.
  function mapi(bubbleId, text, mood, speech) {
    const bubble = $(bubbleId);
    bubble.textContent = text;
    bubble.className = 'bubble' + (mood ? ' is-' + mood : '');
    const mascot = bubble.parentElement.querySelector('.mascot');
    if (mascot) {
      mascot.classList.remove('is-happy', 'is-thinking');
      void mascot.offsetWidth;
      if (mood === 'ok') mascot.classList.add('is-happy');
      if (mood === 'try' || mood === 'miss') mascot.classList.add('is-thinking');
    }
    say(speech === undefined ? text : speech);
  }

  function spokenTerms(terms) {
    return terms.map((t, i) => (i === 0 ? '' : t < 0 ? ' menos ' : ' más ') + Math.abs(t)).join('');
  }

  /* ---------- Navegación ---------- */

  let currentView = 'home';
  function show(view) {
    if (currentView === 'session' && view !== 'session') stopSession();
    if (currentView === 'paper' && view !== 'paper') stopPaperTimer();
    if (currentView === 'game' && view !== 'game') stopGame();
    hush();
    currentView = view;
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== 'view-' + view; });
    document.body.classList.toggle('in-session', view === 'session' || view === 'game');
    $('print-sheets').hidden = view !== 'print';
    const tab = { home: 'home', dictation: 'home', games: 'games', awards: 'awards', abacus: 'abacus', parents: 'parents', print: 'parents', paper: 'home', result: 'home' }[view];
    document.querySelectorAll('#tabbar [data-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
    window.scrollTo(0, 0);
    if (view === 'home') renderHome();
    if (view === 'print') renderPrint();
    if (view === 'abacus') renderAbacus();
    if (view === 'parents') renderParents();
    if (view === 'awards') renderAwards();
    if (view === 'paper') renderPaper();
    if (view === 'games') renderGames();
    if (view === 'dictation') renderDictation();
  }

  document.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) {
      e.preventDefault();
      show(go.dataset.go);
    }
  });

  /* ---------- Inicio ---------- */

  function homeMessage(streak, level) {
    const name = data.name;
    const days = n => `${n} ${n === 1 ? 'día' : 'días'} seguidos`;
    if (!name) return '¡Hola! Soy Mapi y te voy a enseñar a usar el ábaco, paso a paso. ¿Cómo te llamas?';
    if (!data.lessons[level.id]) return `¡Hola, ${name}! Hoy aprendemos algo nuevo: ${level.name}. Yo te muestro primero.`;
    if (streak.doneToday) return `¡Ya practicaste hoy, ${name}! Llevas ${days(streak.current)}. ¿Otra ronda?`;
    if (streak.current) return `¡Hola, ${name}! Llevas ${days(streak.current)}. ¡No rompamos la racha!`;
    return `¡Hola, ${name}! Sigamos practicando: ${level.name}.`;
  }

  // Estado de los tres pasos de un nivel: Mira, Juntos y Tú (sesiones dominadas).
  function stepsState(level) {
    const seen = !!data.lessons[level.id];
    const stats = levelStats(level.id);
    return [
      { icon: '👀', label: 'Mira', note: seen ? 'Hecho' : 'Mapi enseña', state: seen ? 'is-done' : 'is-current' },
      { icon: '🤝', label: 'Juntos', note: seen ? 'Hecho' : 'Con Mapi', state: seen ? 'is-done' : '' },
      { icon: '⭐', label: 'Tú', note: `${stats.recentPassed} de 2`, state: seen ? 'is-current' : '' }
    ];
  }

  function renderSteps(list, level) {
    list.innerHTML = '';
    stepsState(level).forEach(st => {
      const li = document.createElement('li');
      li.className = st.state;
      li.appendChild(textSpan(st.icon, 'step-icon'));
      li.appendChild(textSpan(st.label));
      const note = document.createElement('small');
      note.textContent = st.note;
      li.appendChild(note);
      list.appendChild(li);
    });
  }

  function renderHome() {
    const level = C.getLevel(data.levelId);
    const streak = streakInfo();
    const seen = !!data.lessons[level.id];
    $('home-avatar').textContent = data.avatar;
    $('home-title').textContent = data.name ? `¡Hola, ${data.name}!` : '¡Hola!';
    $('home-date').textContent = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
    $('onboarding').hidden = !!data.name;
    $('home-bubble').textContent = homeMessage(streak, level);
    $('home-bubble').className = 'bubble';
    $('streak-count').textContent = streak.current;
    $('home-stars').textContent = data.stars || 0;
    $('streak-best').textContent = streak.best ? `Mejor racha: ${streak.best} 🔥` : '';

    const mod = C.moduleOf(level.id);
    $('hero-module').textContent = `Módulo ${C.MODULES.indexOf(mod) + 1} · ${mod.title}`;
    $('today-level').textContent = level.name;
    renderSteps($('today-steps'), level);
    $('start-session').textContent = seen ? '▶ Practicar' : '▶ Empezar la lección';
    $('paper-start').hidden = !seen;
    $('today-why').textContent = seen ? recommendation(level, levelStats(level.id)) : 'Primero miras, después lo hacemos juntos y al final lo intentas tú.';

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
    renderMap();
  }

  /* --- El camino: módulos y niveles con su progreso --- */

  const MODULE_COLORS = ['#3d7bff', '#8a5cf6', '#ff8a3d', '#16b3a3', '#ec5f9a', '#22a35a', '#4f5bd5', '#e0a100'];

  function renderMap() {
    const current = C.getLevel(data.levelId);
    const idx = C.levelIndex(current.id);
    const total = C.LEVELS.length;
    $('route-summary').textContent = `${idx} de ${total} niveles superados`;
    $('route-bar').style.width = Math.round((100 * idx) / total) + '%';
    const box = $('route-modules');
    box.innerHTML = '';
    C.MODULES.forEach((mod, m) => {
      const first = C.levelIndex(mod.levels[0].id);
      const done = mod.levels.filter(l => C.levelIndex(l.id) < idx).length;
      const card = document.createElement('section');
      card.className = 'module' + (first > idx ? ' is-locked' : '');
      const head = document.createElement('div');
      head.className = 'module-head';
      head.style.background = MODULE_COLORS[m % MODULE_COLORS.length];
      const text = document.createElement('div');
      const h = document.createElement('h3');
      h.textContent = `${m + 1}. ${mod.title}`;
      text.appendChild(h);
      const p = document.createElement('p');
      p.textContent = mod.objective;
      text.appendChild(p);
      head.appendChild(text);
      head.appendChild(textSpan(first > idx ? '🔒' : `${done}/${mod.levels.length}`, 'module-count'));
      card.appendChild(head);

      // Solo se dibuja el camino del módulo en curso y de los ya hechos.
      if (first <= idx) {
        const list = document.createElement('ol');
        list.className = 'path';
        mod.levels.forEach(l => {
          const i = C.levelIndex(l.id);
          const li = document.createElement('li');
          li.className = i < idx ? 'is-done' : i === idx ? 'is-current' : 'is-locked';
          if (i === idx) li.appendChild(textSpan(data.lessons[l.id] ? '¡Sigue aquí!' : '¡Empieza aquí!', 'node-start'));
          const node = document.createElement('button');
          node.type = 'button';
          node.className = 'node';
          node.textContent = i < idx ? '✓' : i === idx ? '★' : '🔒';
          node.setAttribute('aria-label', `${l.id} ${l.name}`);
          node.addEventListener('click', () => {
            if (i <= idx) startSession(l.id);
            else {
              mapi('home-bubble', `Ese nivel se abre cuando termines «${current.name}». ¡Vas muy bien!`, 'try');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          });
          li.appendChild(node);
          li.appendChild(textSpan(l.name, 'node-label'));
          const stars = data.levelStars[l.id] || 0;
          li.appendChild(textSpan(i <= idx ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '', 'node-stars'));
          list.appendChild(li);
        });
        card.appendChild(list);
      }
      box.appendChild(card);
    });
  }

  $('home-speak').addEventListener('click', () => say($('home-bubble').textContent));

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
    say(homeMessage(streakInfo(), C.getLevel(data.levelId)));
  });

  $('home-avatar').addEventListener('click', () => {
    $('onboarding-name').value = data.name;
    $('onboarding').hidden = false;
    renderAvatarPicker();
    $('onboarding-name').focus();
  });

  $('start-session').addEventListener('click', () => startSession());
  $('paper-start').addEventListener('click', () => show('paper'));

  /* ---------- Sesión ---------- */

  let session = null;
  let cur = null;
  let helperSoroban = null;
  let lessonSoroban = null;
  let stepper = null;
  let flashToken = 0;
  let playToken = 0;

  const onScreen = () => data.settings.abacus === 'pantalla';

  // Prepara la sesión. La primera vez en un nivel se aprende: Mira → Juntos → Tú.
  function startSession(levelId) {
    const level = C.getLevel(levelId || data.levelId);
    // El primer intento del día usa la misma semilla que la hoja impresa de ese día.
    const attempt = data.history.filter(h => h.date === today() && h.levelId === level.id && h.source === 'pantalla').length;
    session = {
      level,
      review: level.id !== data.levelId,
      exercises: C.buildSheet(level.id, `${today()}|${level.id}|${attempt}`, data.settings.perSession),
      index: 0,
      results: [],
      start: Date.now(),
      timer: null
    };
    // Medallas que ya tenía al empezar, para celebrar las nuevas al final (también las de la lección).
    session.badgesBefore = wonBadges().map(b => b.id);
    const seen = !!data.lessons[level.id];
    const mod = C.moduleOf(level.id);
    $('briefing-module').textContent = `Módulo ${C.MODULES.indexOf(mod) + 1} · ${mod.title}`;
    $('briefing-level').textContent = level.name + (session.review ? ' (repaso)' : '');
    renderSteps($('briefing-steps'), level);
    const concepts = $('briefing-concepts');
    concepts.innerHTML = '';
    mod.concepts.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      concepts.appendChild(li);
    });
    $('briefing-plan').textContent = seen
      ? `Hoy practicas sin ayuda: ${data.settings.perSession} ejercicios.`
      : 'Primero miras, después lo hacemos juntos y al final lo intentas tú.';
    $('briefing-go').textContent = seen ? '¡Vamos!' : '👀 Empezar la lección';
    $('briefing-lesson').hidden = !seen;
    setStage('briefing');
    show('session');
    $('session-timer').textContent = '0:00';
    updateVoiceButton();
    renderProgress();
    const name = data.name ? `, ${data.name}` : '';
    mapi('bubble', seen
      ? `¡Vamos${name}! Hoy practicamos: ${level.name}. ${level.tip}`
      : `¡Hola${name}! Hoy aprendemos algo nuevo: ${level.name}. Primero mira cómo se hace.`);
  }

  function setStage(stage) {
    $('briefing').hidden = stage !== 'briefing';
    $('lesson').hidden = stage !== 'lesson';
    $('exercise').hidden = stage !== 'exercises';
    $('session-phases').hidden = stage !== 'lesson';
    $('keypad').hidden = true;
    $('abacus-sheet').hidden = true;
  }

  function setPhase(phase) {
    const order = ['mira', 'juntos', 'tu'];
    document.querySelectorAll('#session-phases li').forEach(li => {
      const i = order.indexOf(li.dataset.phase);
      li.className = li.dataset.phase === phase ? 'is-current' : i < order.indexOf(phase) ? 'is-done' : '';
    });
  }

  $('briefing-go').addEventListener('click', () => {
    if (data.lessons[session.level.id]) beginExercises();
    else startLesson(3);
  });
  $('briefing-lesson').addEventListener('click', () => startLesson(2));

  // Botón «?»: la guía del nivel en cualquier momento. Durante la práctica se
  // pausa el tiempo y al terminar se vuelve al mismo ejercicio.
  $('session-help').addEventListener('click', () => {
    if (!session || stepper) return;
    if ($('exercise').hidden) { startLesson(data.lessons[session.level.id] ? 2 : 3); return; }
    const pausedAt = Date.now();
    clearInterval(session.timer);
    playToken++;
    const { steps, rods } = C.lessonSteps(session.level.id);
    runSteps({
      phase: 'mira', steps, rods, onDone: () => {
        session.start += Date.now() - pausedAt;
        session.timer = setInterval(updateTimer, 1000);
        setStage('exercises');
        setPhase('tu');
        $('keypad').hidden = !cur || cur.useAbacus || cur.ex.type === 'poner' || cur.ex.type === 'opciones';
        mapi('bubble', '¡Ahora inténtalo tú!');
      }
    });
  });

  /* --- «Mira» y «Juntos»: pasos con el ábaco en pantalla --- */

  // Muestra una lista de pasos { value, place, text, expr } uno a uno.
  function runSteps({ phase, steps, rods, expr, label, onDone }) {
    setStage('lesson');
    setPhase(phase);
    const digits = phase === 'mira';
    if (!lessonSoroban || lessonSoroban.rods !== rods || lessonSoroban.showDigits !== digits) {
      lessonSoroban = new window.Soroban($('lesson-abacus'), { rods, interactive: false, showDigits: digits, showLabels: data.settings.labels });
    }
    stepper = { phase, steps, expr, label, onDone, i: 0 };
    showStep();
  }

  function showStep() {
    const s = stepper.steps[stepper.i];
    const last = stepper.i === stepper.steps.length - 1;
    $('lesson-expr').textContent = s.expr || stepper.expr || '';
    const hasAbacus = s.value !== undefined && s.value !== null;
    $('lesson-abacus').hidden = !hasAbacus;
    if (hasAbacus) {
      lessonSoroban.setValue(s.value);
      lessonSoroban.highlight(s.place);
    }
    mapi('bubble', s.text);
    $('lesson-count').textContent = (stepper.label ? stepper.label + ' · ' : '') + `paso ${stepper.i + 1} de ${stepper.steps.length}`;
    $('lesson-prev').disabled = stepper.i === 0;
    $('lesson-next').textContent = stepper.phase === 'mira'
      ? (last ? '¡Entendido! ▶' : 'Siguiente ▶')
      : (last ? '¡Lo hicimos! ▶' : 'Hecho ✓');
  }

  $('lesson-prev').addEventListener('click', () => {
    if (stepper && stepper.i > 0) { stepper.i--; showStep(); }
  });
  $('lesson-next').addEventListener('click', () => {
    if (!stepper) return;
    if (stepper.i < stepper.steps.length - 1) { stepper.i++; showStep(); return; }
    const done = stepper.onDone;
    stepper = null;
    done();
  });

  // «Mira»: Mapi enseña el concepto y resuelve ejemplos.
  function startLesson(guided) {
    const { steps, rods } = C.lessonSteps(session.level.id);
    runSteps({ phase: 'mira', steps, rods, onDone: () => startGuided(guided) });
  }

  // «Juntos»: ella sigue cada paso en su ábaco y toca «Hecho».
  function startGuided(count) {
    const list = C.buildSheet(session.level.id, `${today()}|${session.level.id}|juntos`, count);
    let k = 0;
    const next = () => {
      if (k >= list.length) {
        data.lessons[session.level.id] = today();
        save();
        beginExercises();
        return;
      }
      const ex = list[k++];
      const steps = C.guidedSteps(ex).map((s, i) => i === 0 && ex.type !== 'opciones' && ex.type !== 'leer'
        ? Object.assign({}, s, { text: 'Hazlo conmigo en tu ábaco. ' + s.text })
        : s);
      runSteps({ phase: 'juntos', steps, rods: ex.rods, expr: C.exprText(ex), label: `Ejercicio ${k} de ${list.length}`, onDone: next });
    };
    next();
  }

  function beginExercises() {
    session.start = Date.now();
    clearInterval(session.timer);
    session.timer = setInterval(updateTimer, 1000);
    updateTimer();
    setStage('exercises');
    setPhase('tu');
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
      else if (i === session.index && !$('exercise').hidden) li.className = 'is-current';
      list.appendChild(li);
    });
  }

  function isSmallPair(ex) {
    return ex.terms.length === 2 && ex.terms.every(t => Math.abs(t) < 10);
  }

  function loadExercise() {
    const ex = session.exercises[session.index];
    flashToken++;
    playToken++;
    // Con ábaco en pantalla, «poner» y los cálculos se responden moviendo las cuentas.
    const useAbacus = onScreen() && (ex.type === 'poner' || ex.type === 'calculo');
    const typed = !useAbacus && ex.type !== 'poner' && ex.type !== 'opciones';
    cur = { ex, attempts: 0, answer: '', done: false, boxes: 0, rtl: false, soroban: null, locked: false, useAbacus };
    $('exercise-actions').innerHTML = '';
    $('abacus-sheet').hidden = true;
    const body = $('exercise-body');
    body.innerHTML = '';
    $('keypad').hidden = !typed;
    renderProgress();

    if (ex.type === 'opciones') {
      // La pregunta la dice Mapi en su globo; aquí van la imagen y las opciones.
      if (ex.value !== undefined) {
        const holder = document.createElement('div');
        holder.className = 'exercise-abacus';
        body.appendChild(holder);
        new window.Soroban(holder, { rods: ex.rods, value: ex.value, interactive: false, showLabels: data.settings.labels });
      }
      const options = document.createElement('div');
      options.className = 'options' + (ex.options.some(o => o.length > 6) ? ' is-long' : '');
      ex.options.forEach(opt => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'option';
        b.textContent = opt;
        b.addEventListener('click', () => chooseOption(opt, b));
        options.appendChild(b);
      });
      body.appendChild(options);
      mapi('bubble', ex.question);
    } else if (ex.type === 'leer') {
      const holder = document.createElement('div');
      holder.className = 'exercise-abacus';
      body.appendChild(holder);
      new window.Soroban(holder, { rods: ex.rods, value: ex.value, interactive: false, showLabels: data.settings.labels });
      cur.boxes = ex.rods;
      body.appendChild(answerRow());
      mapi('bubble', '¿Qué número muestra el ábaco?');
    } else if (ex.type === 'poner') {
      const counting = ex.from !== undefined;
      body.appendChild(textSpan(counting ? C.exprText(ex) : String(ex.value), 'target-number'));
      const what = counting ? C.sayCount(ex) : ex.value === 0 ? 'el 0: deja el ábaco limpio' : `el ${ex.value}`;
      if (useAbacus) {
        addAbacusAnswer(body, ex);
        if (counting) cur.soroban.setValue(ex.from);
        mapi('bubble', counting ? `Pon ${what} y toca «¡Listo!».` : 'Pon este número en el ábaco y toca «¡Listo!».', null, `Pon ${what} en el ábaco.`);
      } else {
        addAction('¡Listo! ✓', 'btn-go btn-xl', showSelfCheck);
        mapi('bubble', `Pon ${what} en tu ábaco y toca «¡Listo!».`);
      }
    } else if (ex.type === 'flash') {
      const stage = document.createElement('div');
      stage.className = 'flash-stage';
      stage.id = 'flash-stage';
      body.appendChild(stage);
      cur.boxes = Math.max(2, String(ex.answer).length);
      const row = answerRow();
      row.hidden = true;
      body.appendChild(row);
      mapi('bubble', 'Mira los números y calcula de memoria.');
      playFlash();
    } else {
      const termLen = Math.max(...ex.terms.map(t => String(Math.abs(t)).length));
      // Escribir unidades primero solo tiene sentido con números de varias cifras en columna.
      cur.rtl = data.settings.rtl && termLen > 1;
      cur.boxes = Math.max(String(ex.answer).length, termLen + (ex.terms.slice(1).some(t => t > 0) ? 1 : 0));
      body.appendChild(buildOperation(ex, answerBoxes(cur.boxes)));
      const spoken = spokenTerms(ex.terms);
      if (useAbacus) {
        addAbacusAnswer(body, ex);
        mapi('bubble', 'Mueve las bolitas y toca «¡Listo!».', null, `Mueve las bolitas: ${spoken}.`);
      } else {
        addAction('🧮 Ábaco en pantalla', 'btn-soft', () => openAbacusSheet(ex));
        mapi('bubble', 'Hazlo en tu ábaco y escribe el resultado.', null, `Hazlo en tu ábaco: ${spoken}.`);
      }
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

  // Ábaco en el que se responde: se toca «¡Listo!» cuando muestra el resultado.
  function addAbacusAnswer(body, ex) {
    const holder = document.createElement('div');
    holder.className = 'exercise-abacus';
    body.appendChild(holder);
    cur.soroban = new window.Soroban(holder, { rods: ex.rods, interactive: true, showLabels: data.settings.labels });
    const step = document.createElement('p');
    step.className = 'step-text';
    step.id = 'exercise-step';
    step.hidden = true;
    body.appendChild(step);
    addAction('¡Listo! ✓', 'btn-go', check);
    addAction('Limpiar', 'btn-soft', () => cur.soroban.clear());
  }

  // Con ábaco real: se muestra cómo debe verse y ella compara con el suyo.
  function showSelfCheck() {
    const ex = cur.ex;
    const body = $('exercise-body');
    let holder = body.querySelector('.exercise-abacus');
    if (!holder) {
      holder = document.createElement('div');
      holder.className = 'exercise-abacus';
      body.appendChild(holder);
    }
    new window.Soroban(holder, { rods: ex.rods, value: ex.value, interactive: false, showLabels: data.settings.labels });
    $('exercise-actions').innerHTML = '';
    addAction('Sí, igualito ✓', 'btn-go', () => selfCheck(true));
    addAction('No, lo arreglo', 'btn-soft', () => selfCheck(false));
    mapi('bubble', ex.from !== undefined ? `Es el ${ex.value}. ¿Tu ábaco se ve así?` : '¿Tu ábaco se ve así?');
  }

  // Preguntas de opción múltiple: dos intentos, como los demás ejercicios.
  function chooseOption(opt, button) {
    if (!cur || cur.done) return;
    if (opt === cur.ex.answer) {
      button.classList.add('is-right');
      markCorrect();
      return;
    }
    cur.attempts++;
    soundTry();
    button.classList.add('is-wrong');
    button.disabled = true;
    if (cur.attempts < 2) {
      mapi('bubble', 'Casi… ' + cur.ex.hint, 'try');
      return;
    }
    document.querySelectorAll('#exercise-body .option').forEach(b => {
      b.disabled = true;
      if (b.textContent === cur.ex.answer) b.classList.add('is-right');
    });
    reveal(`La respuesta es: ${cur.ex.answer}. ${cur.ex.hint}`);
  }

  function selfCheck(same) {
    if (same) { markCorrect(); return; }
    cur.attempts++;
    soundTry();
    if (cur.attempts < 2) {
      $('exercise-body').querySelector('.exercise-abacus').remove();
      $('exercise-actions').innerHTML = '';
      addAction('¡Listo! ✓', 'btn-go btn-xl', showSelfCheck);
      mapi('bubble', 'Arréglalo en tu ábaco. ' + session.level.hint, 'try');
    } else {
      reveal(`Así se pone el ${cur.ex.value}. ¡La próxima te sale!`);
    }
  }

  function answerBoxes(n) {
    const wrap = document.createElement('span');
    wrap.className = 'answer-boxes';
    wrap.id = 'answer-boxes';
    for (let i = 0; i < n; i++) wrap.appendChild(textSpan('', 'answer-box'));
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
    ex.terms.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'op-row';
      row.appendChild(textSpan(i === 0 ? '' : t < 0 ? '−' : '+', 'op-sign'));
      const cells = document.createElement('span');
      cells.className = 'op-cells';
      for (const ch of String(Math.abs(t)).padStart(width, ' ')) cells.appendChild(textSpan(ch.trim(), 'op-cell'));
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
    if (cls) s.className = cls;
    s.textContent = text;
    return s;
  }

  function renderAnswer(revealed) {
    const wrap = $('answer-boxes');
    if (!wrap || !cur) return;
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
    if (!cur || cur.locked || $('exercise').hidden) return;
    if (cur.done) {
      if (key === 'Enter' && cur.waitingNext) nextExercise();
      return;
    }
    const typed = !cur.useAbacus && cur.ex.type !== 'poner' && cur.ex.type !== 'opciones';
    if (key === 'Enter') {
      if (cur.useAbacus || typed) check();
      return;
    }
    if (!typed) return;
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
    if (cur.useAbacus) {
      given = cur.soroban.getValue();
      if (ex.type === 'calculo') cur.answer = String(given);
    } else {
      if (cur.answer === '') return;
      given = parseInt(cur.answer, 10);
    }
    if (given === ex.answer) { markCorrect(); return; }
    cur.attempts++;
    soundTry();
    const card = $('exercise');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    if (cur.attempts < 2) {
      // Pista específica del nivel, como guía para el segundo intento.
      mapi('bubble', 'Casi… ' + session.level.hint, 'try');
      cur.answer = '';
      renderAnswer();
      return;
    }
    reveal(`Es ${ex.answer}. ¡La próxima te sale!`);
  }

  function markCorrect() {
    cur.done = true;
    session.results[session.index] = { correct: cur.attempts === 0 };
    mapi('bubble', PRAISE[Math.floor(Math.random() * PRAISE.length)] + ' ⭐', 'ok');
    if (cur.soroban) cur.soroban.setInteractive(false);
    renderAnswer();
    soundOk();
    renderProgress();
    cur.locked = true;
    setTimeout(nextExercise, 1100);
  }

  // Segundo error: se muestra la respuesta y cómo llegar a ella.
  function reveal(message) {
    const ex = cur.ex;
    cur.done = true;
    cur.waitingNext = true;
    session.results[session.index] = { correct: false };
    mapi('bubble', message, 'miss');
    renderProgress();
    if (cur.soroban) {
      cur.soroban.setInteractive(false);
      cur.soroban.setValue(ex.answer);
    }
    renderAnswer(true);
    $('exercise-actions').innerHTML = '';
    if (ex.type !== 'opciones' && ex.type !== 'flash') addAction('🧮 Ver cómo se hace', 'btn-soft', () => playExplanation(ex));
    addAction('Siguiente ▶', 'btn-go', nextExercise);
  }

  function nextExercise() {
    session.index++;
    if (session.index >= session.exercises.length) finishSession();
    else loadExercise();
  }

  /* --- Ábaco en pantalla y explicación paso a paso --- */

  function openAbacusSheet(ex) {
    $('abacus-sheet').hidden = false;
    $('keypad').hidden = true;
    $('helper-step').hidden = true;
    helperSoroban = new window.Soroban($('helper-abacus'), {
      rods: ex.rods, interactive: true, showLabels: data.settings.labels
    });
  }

  $('abacus-sheet-close').addEventListener('click', () => {
    playToken++;
    $('abacus-sheet').hidden = true;
    $('keypad').hidden = !cur || cur.useAbacus || cur.ex.type === 'poner' || cur.ex.type === 'opciones';
  });

  $('helper-clear').addEventListener('click', () => {
    playToken++;
    $('helper-step').hidden = true;
    if (helperSoroban) { helperSoroban.highlight(null); helperSoroban.clear(); }
  });

  // Anima la solución en el ábaco de respuesta o, con ábaco real, en el ábaco en pantalla.
  function playExplanation(ex) {
    const token = ++playToken;
    const steps = C.guidedSteps(ex);
    let soroban = cur.soroban;
    let text = $('exercise-step');
    if (!soroban) {
      openAbacusSheet(ex);
      soroban = helperSoroban;
      soroban.setInteractive(false);
      text = $('helper-step');
    }
    text.hidden = false;
    let i = 0;
    (function step() {
      if (token !== playToken) return;
      const s = steps[i];
      soroban.setValue(s.value);
      soroban.highlight(s.place);
      text.textContent = s.text;
      say(s.text);
      if (++i < steps.length) setTimeout(step, 3200);
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

  /* --- Barra de la sesión --- */

  function updateVoiceButton() {
    ['session-voice', 'game-voice'].forEach(id => {
      $(id).classList.toggle('is-off', !data.settings.voice);
      $(id).textContent = data.settings.voice ? '🔊' : '🔇';
    });
  }

  $('session-voice').addEventListener('click', () => {
    data.settings.voice = !data.settings.voice;
    save();
    updateVoiceButton();
    if (data.settings.voice) say($('bubble').textContent);
    else hush();
  });

  $('session-fullscreen').addEventListener('click', () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch (e) { /* no disponible */ }
  });

  $('session-exit').addEventListener('click', () => {
    if (window.confirm('¿Salir de la sesión? No se guardará.')) show('home');
  });

  /* ---------- Resultado ---------- */

  function finishSession() {
    stopSession();
    const total = session.exercises.length;
    const correct = session.results.filter(r => r && r.correct).length;
    showResult({ levelId: session.level.id, correct, total, seconds: elapsed(), source: 'pantalla', review: session.review });
  }

  function showResult({ levelId, correct, total, seconds, source, review }) {
    const before = new Set(source === 'pantalla' && session ? session.badgesBefore : wonBadges().map(b => b.id));
    const stars = starsFor(correct, total);
    data.stars = (data.stars || 0) + stars;
    data.levelStars[levelId] = Math.max(data.levelStars[levelId] || 0, stars);
    const { entry, levelUp, stats } = recordSession({ levelId, correct, total, seconds, source });
    const fresh = wonBadges().filter(b => !before.has(b.id));
    const badgesBox = $('result-badges');
    badgesBox.innerHTML = '';
    fresh.forEach(b => badgesBox.appendChild(badgeCard(b, true, '¡Nueva medalla!')));
    $('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = stars === 3 ? '¡Increíble!' : stars === 2 ? '¡Muy bien!' : '¡Buen trabajo!';
    $('result-title').textContent = title;
    $('result-score').textContent = `${correct}/${total}`;
    $('result-time').textContent = formatTime(seconds);
    $('result-streak').textContent = streakInfo().current;
    const message = levelMessage(entry, levelUp, stats, review);
    $('result-level').textContent = message;
    $('result-more').dataset.level = review ? levelId : '';
    $('result-more').hidden = source === 'papel';
    // Después de practicar (sobre todo después de la hoja), el premio es un juego.
    $('result-game').hidden = false;
    $('result-home').className = 'btn btn-soft';
    show('result');
    say(`${title} ${correct} de ${total}. ${message}` + (fresh.length ? ` ¡Ganaste la medalla ${fresh[0].name}!` : '') + ' ¡Y ahora, hora del juego!');
    soundWin();
    confetti(stars === 3 || levelUp ? 70 : 30);
  }

  function levelMessage(entry, levelUp, stats, isReview) {
    const level = C.getLevel(entry.levelId);
    if (isReview) return entry.passed ? '¡Repaso dominado! 💪' : 'Repasar ayuda a no olvidar. ¡Bien hecho!';
    if (levelUp) return `🎉 ¡Subiste de nivel! Ahora: ${levelUp.id} · ${levelUp.name}. La próxima vez empezamos mirando su lección.`;
    if (entry.passed && stats.recentPassed >= 2) return `🏆 ¡Dominaste el último nivel! ${level.next}`;
    if (entry.passed) return '¡Dominaste esta sesión! Una más así y pasas de nivel.';
    if (entry.correct / entry.total >= 0.9) return '¡Todo muy bien! Ahora intenta ir un poquito más rápido.';
    if (stats.recentPassed === 1) return 'Ya tienes 1 sesión dominada: la próxima puede ser la segunda. 💪';
    return 'Repetiremos este nivel para dominarlo. ¡Practicar es el secreto! 💪';
  }

  $('result-game').addEventListener('click', () => show('games'));

  $('result-more').addEventListener('click', e => startSession(e.currentTarget.dataset.level || undefined));

  // Confeti de cuentas de colores.
  function confetti(n) {
    const box = $('confetti');
    box.innerHTML = '';
    const colors = ['var(--honey)', 'var(--tomato)', 'var(--leaf)', 'var(--berry)', 'var(--wood)'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.style.background = colors[i % colors.length];
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = Math.random() * 0.8 + 's';
      s.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
      box.appendChild(s);
    }
    setTimeout(() => { box.innerHTML = ''; }, 4000);
  }

  /* ---------- Hoja en papel: imprimir, cronometrar y corregir ---------- */

  let paper = null;

  // Los mismos 10 ejercicios que la hoja impresa de hoy.
  function todaysSheet() {
    return C.buildSheet(data.levelId, `${today()}|${data.levelId}|0`, 10);
  }

  function renderPaper() {
    stopPaperTimer();
    paper = { exercises: todaysSheet(), wrong: new Set(), seconds: 0, timer: null, start: 0 };
    const level = C.getLevel(data.levelId);
    $('paper-level').textContent = `${level.id} · ${level.name} · ${new Date().toLocaleDateString('es')}`;
    $('paper-step-1').hidden = false;
    $('paper-step-2').hidden = true;
    $('paper-step-3').hidden = true;
    $('paper-go').hidden = false;
    $('paper-stop').hidden = true;
    $('paper-timer').textContent = '0:00';
    mapi('paper-bubble', 'Imprime la hoja de hoy o usa la que ya tienes. ¡Trabaja con tu ábaco y tu lápiz!', null, '');
  }

  $('paper-print').addEventListener('click', () => {
    const box = $('print-sheets');
    box.innerHTML = '';
    box.appendChild(buildSheet(C.getLevel(data.levelId), today(), 1, paper.exercises, true));
    window.print();
  });

  $('paper-ready').addEventListener('click', () => {
    $('paper-step-1').hidden = true;
    $('paper-step-2').hidden = false;
    mapi('paper-bubble', 'Cuando tengas listos tu ábaco y tu lápiz, toca el botón verde.');
  });

  $('paper-go').addEventListener('click', () => {
    paper.start = Date.now();
    paper.timer = setInterval(() => {
      paper.seconds = Math.round((Date.now() - paper.start) / 1000);
      $('paper-timer').textContent = formatTime(paper.seconds);
    }, 1000);
    $('paper-go').hidden = true;
    $('paper-stop').hidden = false;
    mapi('paper-bubble', '¡A trabajar! Escribe bonito cada número. Cuando termines, toca «¡Terminé!».');
  });

  function stopPaperTimer() {
    if (paper && paper.timer) {
      clearInterval(paper.timer);
      paper.timer = null;
    }
  }

  $('paper-stop').addEventListener('click', () => {
    stopPaperTimer();
    paper.seconds = Math.max(1, Math.round((Date.now() - paper.start) / 1000));
    $('paper-step-2').hidden = true;
    $('paper-step-3').hidden = false;
    renderPaperList();
    mapi('paper-bubble', `¡Terminaste en ${formatTime(paper.seconds)}! Ahora revisemos juntos.`);
  });

  function exerciseText(ex) {
    if (ex.type === 'leer') return 'Leer el ábaco';
    if (ex.type === 'poner' && ex.from === undefined) return `Poner el ${ex.value}`;
    return C.exprText(ex).replace(' = ?', ' =');
  }

  function renderPaperList() {
    const list = $('paper-list');
    list.innerHTML = '';
    paper.exercises.forEach((ex, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.appendChild(textSpan(`(${i + 1}) ${exerciseText(ex)}`));
      const right = document.createElement('span');
      if (ex.type !== 'poner' || ex.from !== undefined) {
        const answer = document.createElement('b');
        answer.textContent = ex.answer;
        right.appendChild(answer);
      }
      right.appendChild(textSpan(' ✓', 'mark'));
      b.appendChild(right);
      b.addEventListener('click', () => {
        if (paper.wrong.has(i)) paper.wrong.delete(i);
        else paper.wrong.add(i);
        b.classList.toggle('is-wrong', paper.wrong.has(i));
        b.querySelector('.mark').textContent = paper.wrong.has(i) ? ' ✗' : ' ✓';
        updatePaperScore();
      });
      li.appendChild(b);
      list.appendChild(li);
    });
    updatePaperScore();
  }

  function updatePaperScore() {
    const total = paper.exercises.length;
    $('paper-score').textContent = `${total - paper.wrong.size} de ${total} bien`;
  }

  $('paper-save').addEventListener('click', () => {
    const total = paper.exercises.length;
    showResult({ levelId: data.levelId, correct: total - paper.wrong.size, total, seconds: paper.seconds, source: 'papel', review: false });
  });

  $('tile-caligrafia').addEventListener('click', () => {
    show('print');
    $('print-kind').value = 'caligrafia';
    syncPrintKind();
    buildSheets();
  });

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

  let printReady = false;
  function renderPrint() {
    if (!printReady) {
      fillLevelSelect($('print-level'));
      $('print-start').value = today();
      printReady = true;
    }
    syncPrintKind();
    buildSheets();
  }

  function syncPrintKind() {
    const kind = $('print-kind').value;
    document.querySelectorAll('#view-print [data-kind]').forEach(n => { n.hidden = !n.dataset.kind.split(' ').includes(kind); });
  }

  ['print-kind', 'print-level', 'print-start', 'print-pages', 'print-answers', 'print-warmup', 'print-digit'].forEach(id => {
    $(id).addEventListener('change', () => { syncPrintKind(); buildSheets(); });
  });

  function buildSheets() {
    const box = $('print-sheets');
    box.innerHTML = '';
    if ($('print-kind').value === 'caligrafia') {
      const choice = $('print-digit').value;
      if (choice === 'all') {
        box.appendChild(buildCalligraphySheet([0, 1, 2, 3, 4], 'números del 0 al 4'));
        box.appendChild(buildCalligraphySheet([5, 6, 7, 8, 9], 'números del 5 al 9'));
      } else {
        box.appendChild(buildCalligraphySheet([Number(choice)], `el número ${choice}`));
      }
      return;
    }
    const start = $('print-start').value || today();
    const pages = Math.min(14, Math.max(1, parseInt($('print-pages').value, 10) || 1));
    if ($('print-kind').value === 'dictado') {
      const digits = dictationDigits();
      const keys = [];
      for (let p = 0; p < pages; p++) {
        const date = addDays(start, p);
        const numbers = dictationNumbers(date, digits);
        keys.push({ date, exercises: numbers.map(n => ({ answer: n })) });
        box.appendChild(buildDictationSheet(date, p + 1, numbers.length, digits));
      }
      if ($('print-answers').checked) box.appendChild(buildAnswerSheet({ id: '👂', name: 'Dictado de números' }, keys));
      return;
    }
    const levelId = $('print-level').value;
    const level = C.getLevel(levelId);
    const keys = [];
    for (let p = 0; p < pages; p++) {
      const date = addDays(start, p);
      const exercises = C.buildSheet(levelId, `${date}|${levelId}|0`, 10);
      keys.push({ date, exercises });
      box.appendChild(buildSheet(level, date, p + 1, exercises, $('print-warmup').checked));
    }
    if ($('print-answers').checked) box.appendChild(buildAnswerSheet(level, keys));
  }

  function sheetHeader(code, title, date, label) {
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
    head.querySelector('b').textContent = code;
    head.querySelector('.sheet-code span').textContent = label;
    head.querySelector('.sheet-title').textContent = title;
    head.querySelector('.date').textContent = date ? parseKey(date).toLocaleDateString('es') : '';
    if (label === 'respuestas') head.querySelector('.sheet-fields').remove();
    return head;
  }

  function buildSheet(level, date, n, exercises, warmup) {
    const sheet = document.createElement('article');
    sheet.className = 'sheet';
    sheet.appendChild(sheetHeader(level.id, level.name, date, `hoja ${n}`));

    if (warmup) {
      // Fila de caligrafía del día: el modelo, para repasar y para escribir sin ayuda.
      const digit = K.digitOfDay(dayNumber(date));
      const row = document.createElement('div');
      row.className = 'sheet-warmup';
      row.appendChild(textSpan(`✏️ Escribe el ${digit}:`));
      ['modelo', 'punteado', 'punteado', 'punteado', 'tenue', 'tenue', 'vacio', 'vacio', 'vacio'].forEach(style => row.appendChild(K.cellSvg(digit, style)));
      sheet.appendChild(row);
    }

    const kinds = new Set(exercises.map(e => e.type));
    const instruction = document.createElement('p');
    instruction.className = 'sheet-instruction';
    instruction.textContent = '◆ ' + (kinds.has('opciones')
      ? 'Encierra la respuesta correcta. Colorea las bolitas del número que se pide.'
      : kinds.has('leer') || kinds.has('poner')
        ? 'Escribe el número que muestra el ábaco, o colorea las bolitas del número que se pide.'
        : kinds.has('flash') ? 'Calcula de memoria, sin ábaco:' : level.instruction + ' con tu ábaco:');
    sheet.appendChild(instruction);

    const grid = document.createElement('div');
    grid.className = 'sheet-grid' + (exercises.some(e => e.type === 'calculo' && e.terms.length > 2) ? ' cols-4' : '');
    exercises.forEach((ex, i) => {
      const item = document.createElement('div');
      item.className = 'sheet-item';
      item.appendChild(textSpan(`(${i + 1})`, 'sheet-num'));
      const content = document.createElement('div');
      content.className = 'sheet-content';
      if (ex.type === 'opciones') {
        const q = document.createElement('div');
        q.className = 'sheet-question';
        q.appendChild(textSpan(ex.question, ''));
        const opts = document.createElement('div');
        opts.className = 'sheet-options';
        ex.options.forEach(o => opts.appendChild(textSpan(o)));
        q.appendChild(opts);
        content.appendChild(q);
        if (ex.value !== undefined) {
          const holder = document.createElement('div');
          holder.className = 'sheet-abacus small';
          content.appendChild(holder);
          new window.Soroban(holder, { rods: ex.rods, value: ex.value, interactive: false, animate: false });
        }
      } else if (ex.type === 'poner' && ex.from !== undefined) {
        // Contar: escribir con lápiz el número de antes o de después.
        const line = document.createElement('div');
        line.className = 'op-inline';
        const blank = document.createElement('span');
        blank.className = 'answer-boxes paper';
        blank.appendChild(textSpan('', 'answer-box'));
        if (ex.value > ex.from) { line.appendChild(textSpan(String(ex.from), 'op-num')); line.appendChild(textSpan('→', 'op-sign')); line.appendChild(blank); }
        else { line.appendChild(blank); line.appendChild(textSpan('←', 'op-sign')); line.appendChild(textSpan(String(ex.from), 'op-num')); }
        content.appendChild(line);
      } else if (ex.type === 'leer' || ex.type === 'poner') {
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
        const count = Math.max(String(ex.answer).length, termLen + (ex.terms.slice(1).some(t => t > 0) ? 1 : 0));
        for (let k = 0; k < count; k++) blanks.appendChild(textSpan('', 'answer-box'));
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
    sheet.appendChild(sheetHeader(level.id, level.name, null, 'respuestas'));
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

  // Hoja de caligrafía estilo Kumon 4A: modelo con orden de trazo, repasar con puntos,
  // puntos cada vez más tenues y, al final, escribir sin ayuda desde el punto de inicio.
  function buildCalligraphySheet(digits, title) {
    const sheet = document.createElement('article');
    sheet.className = 'sheet';
    sheet.appendChild(sheetHeader('✏️', 'Caligrafía: ' + title, null, 'números'));
    const instruction = document.createElement('p');
    instruction.className = 'sheet-instruction';
    instruction.textContent = '◆ Empieza en el punto y sigue la flecha. Repasa los puntos y luego escribe tú.';
    sheet.appendChild(instruction);
    const rows = document.createElement('div');
    rows.className = 'cal-rows';
    const patterns = digits.length === 1
      ? [
        ['modelo', 'punteado', 'punteado', 'punteado', 'punteado', 'punteado', 'punteado', 'punteado'],
        ['punteado', 'punteado', 'punteado', 'punteado', 'tenue', 'tenue', 'tenue', 'tenue'],
        ['tenue', 'tenue', 'tenue', 'tenue', 'tenue', 'tenue', 'tenue', 'tenue'],
        ['tenue', 'tenue', 'tenue', 'tenue', 'vacio', 'vacio', 'vacio', 'vacio'],
        ['vacio', 'vacio', 'vacio', 'vacio', 'vacio', 'vacio', 'vacio', 'vacio'],
        ['vacio', 'vacio', 'vacio', 'vacio', 'vacio', 'vacio', 'vacio', 'vacio']
      ]
      : [['modelo', 'punteado', 'punteado', 'punteado', 'tenue', 'vacio', 'vacio']];
    digits.forEach(d => {
      patterns.forEach(pattern => {
        const row = document.createElement('div');
        row.className = 'cal-row';
        row.style.gridTemplateColumns = `repeat(${pattern.length}, 1fr)`;
        pattern.forEach(style => row.appendChild(K.cellSvg(d, style)));
        rows.appendChild(row);
      });
    });
    sheet.appendChild(rows);
    const foot = document.createElement('footer');
    foot.className = 'sheet-foot';
    foot.textContent = 'Encierra tu número más bonito de cada fila      ·      Mi Ábaco';
    sheet.appendChild(foot);
    return sheet;
  }

  $('print-go').addEventListener('click', () => { buildSheets(); window.print(); });

  /* ---------- Ábaco libre ---------- */

  let freeSoroban = null;
  let demoSoroban = null;
  let demo = { steps: [], i: 0 };

  function renderAbacus() {
    if (freeSoroban) return;
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
    say(s.text);
    $('demo-prev').disabled = demo.i === 0;
    $('demo-next').disabled = demo.i >= demo.steps.length - 1;
  }

  $('demo-start').addEventListener('click', startDemo);
  $('demo-prev').addEventListener('click', () => { if (demo.i > 0) { demo.i--; showDemoStep(); } });
  $('demo-next').addEventListener('click', () => { if (demo.i < demo.steps.length - 1) { demo.i++; showDemoStep(); } });

  /* ---------- Dictado de números en papel ---------- */

  const DICTATION_COUNT = 12;
  let dict = null;

  // Cifras del dictado: según la ruta (unidades → decenas → centenas) o lo que elijan los padres.
  function dictationDigits() {
    const fixed = parseInt(data.settings.dictation, 10);
    if (fixed) return fixed;
    const i = C.levelIndex(data.levelId);
    if (i < C.levelIndex('A6')) return 1;
    if (i < C.levelIndex('A8')) return 2;
    return 3;
  }

  function dictationRangeText(digits) {
    return digits === 1 ? 'del 0 al 9' : digits === 2 ? 'hasta el 99' : 'hasta el 999';
  }

  // Los mismos números en la hoja de respuestas impresa y en la app ese día.
  // Con una cifra salen los diez dígitos (y dos de repaso).
  function dictationNumbers(date, digits) {
    const rng = C.makeRng(`${date}|dictado|${digits}`);
    const pool = digits === 1 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [];
    const out = [];
    const shuffled = pool.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    out.push(...shuffled);
    const lo = digits === 1 ? 0 : 10 ** (digits - 1);
    const hi = 10 ** digits - 1;
    while (out.length < DICTATION_COUNT) {
      const n = rng.int(lo, hi);
      if (out[out.length - 1] === n || (digits > 1 && out.includes(n))) continue;
      out.push(n);
    }
    return out;
  }

  // El dictado siempre se escucha, aunque la voz de Mapi esté apagada en el resto de la app.
  function sayAlways(text) {
    const was = data.settings.voice;
    data.settings.voice = true;
    say(text);
    data.settings.voice = was;
  }

  function hasSpanishVoice() {
    return 'speechSynthesis' in window && spanishVoices().length > 0;
  }

  // Para «Escucha y calcula»: habla siempre y avisa al terminar la frase, así la
  // pausa para mover las bolitas empieza después. Si el navegador no avisa, sigue
  // tras un tiempo prudente.
  function speakAndWait(text) {
    return new Promise(resolve => {
      const timer = setTimeout(resolve, 700 + 70 * text.length);
      const done = () => { clearTimeout(timer); resolve(); };
      if (!hasSpanishVoice()) return;
      try {
        window.speechSynthesis.cancel();
        if (!voice) pickVoice();
        const u = new SpeechSynthesisUtterance(speakable(text));
        u.lang = voice ? voice.lang : 'es-MX';
        if (voice) u.voice = voice;
        u.rate = data.settings.voiceRate || 0.95;
        u.onend = done;
        u.onerror = done;
        window.speechSynthesis.speak(u);
      } catch (e) { done(); }
    });
  }

  function setDictationStage(stage) {
    $('dict-intro').hidden = stage !== 'intro';
    $('dict-run').hidden = stage !== 'run';
    $('dict-check').hidden = stage !== 'check';
  }

  function renderDictation() {
    const digits = dictationDigits();
    dict = null;
    setDictationStage('intro');
    $('dict-range').textContent = `Hoy: ${DICTATION_COUNT} números ${dictationRangeText(digits)}. Usa la hoja de dictado o cualquier hoja con 12 casillas.`;
    $('dict-novoice').hidden = hasSpanishVoice();
    $('dict-bubble').textContent = 'Yo digo un número y tú lo escribes con tu mejor letra, en la casilla que te diga. Si no lo escuchas bien, toca «Repetir».';
    $('dict-bubble').className = 'bubble';
  }

  $('dictation-start').addEventListener('click', () => show('dictation'));

  $('dict-print').addEventListener('click', () => {
    const box = $('print-sheets');
    box.innerHTML = '';
    box.appendChild(buildDictationSheet(today(), 1, DICTATION_COUNT, dictationDigits()));
    window.print();
  });

  $('dict-go').addEventListener('click', () => {
    const digits = dictationDigits();
    dict = { digits, numbers: dictationNumbers(today(), digits), i: 0, start: Date.now(), wrong: new Set() };
    setDictationStage('run');
    $('dict-novoice').hidden = hasSpanishVoice();
    dictateCurrent();
  });

  function dictateCurrent() {
    const i = dict.i;
    const n = dict.numbers[i];
    $('dict-count').textContent = `Número ${i + 1} de ${dict.numbers.length}`;
    $('dict-slot').textContent = `(${i + 1})`;
    $('dict-reveal').hidden = true;
    const progress = $('dict-progress');
    progress.innerHTML = '';
    dict.numbers.forEach((_, k) => {
      const li = document.createElement('li');
      li.className = k < i ? 'is-ok' : k === i ? 'is-current' : '';
      progress.appendChild(li);
    });
    $('dict-next').textContent = i === dict.numbers.length - 1 ? '¡Terminé! ▶' : 'Siguiente ▶';
    $('dict-bubble').textContent = `Casilla (${i + 1}): escucha bien…`;
    $('dict-bubble').className = 'bubble';
    sayAlways(`Casilla ${i + 1}. Escribe el ${n}. Otra vez: el ${n}.`);
  }

  $('dict-repeat').addEventListener('click', () => { if (dict) sayAlways(String(dict.numbers[dict.i])); });

  $('dict-show').addEventListener('click', () => {
    if (!dict) return;
    $('dict-reveal').textContent = dict.numbers[dict.i];
    $('dict-reveal').hidden = false;
  });

  $('dict-next').addEventListener('click', () => {
    if (!dict) return;
    dict.i++;
    if (dict.i < dict.numbers.length) { dictateCurrent(); return; }
    dict.seconds = Math.max(1, Math.round((Date.now() - dict.start) / 1000));
    setDictationStage('check');
    renderDictationCheck();
    mapi('dict-bubble', '¡Terminaste! Ahora compara tu hoja con los números. Toca los que estén mal.');
  });

  function renderDictationCheck() {
    const list = $('dict-list');
    list.innerHTML = '';
    dict.numbers.forEach((n, i) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.appendChild(textSpan(`(${i + 1})`));
      const right = document.createElement('span');
      const num = document.createElement('b');
      num.textContent = n;
      right.appendChild(num);
      right.appendChild(textSpan(' ✓', 'mark'));
      b.appendChild(right);
      b.addEventListener('click', () => {
        if (dict.wrong.has(i)) dict.wrong.delete(i);
        else dict.wrong.add(i);
        b.classList.toggle('is-wrong', dict.wrong.has(i));
        b.querySelector('.mark').textContent = dict.wrong.has(i) ? ' ✗' : ' ✓';
        updateDictationScore();
      });
      li.appendChild(b);
      list.appendChild(li);
    });
    updateDictationScore();
  }

  function updateDictationScore() {
    const total = dict.numbers.length;
    $('dict-score').textContent = `${total - dict.wrong.size} de ${total} bien`;
  }

  $('dict-save').addEventListener('click', () => {
    if (!dict) return;
    const total = dict.numbers.length;
    const correct = total - dict.wrong.size;
    const before = new Set(wonBadges().map(b => b.id));
    const stars = starsFor(correct, total);
    data.dictations = (data.dictations || []).concat({ date: today(), at: Date.now(), digits: dict.digits, correct, total, seconds: dict.seconds }).slice(-200);
    data.stars = (data.stars || 0) + stars;
    save();
    const fresh = wonBadges().filter(b => !before.has(b.id));
    const wrongNumbers = [...dict.wrong].sort((a, b) => a - b).map(i => dict.numbers[i]);
    const title = stars === 3 ? '¡Increíble!' : stars === 2 ? '¡Muy bien!' : '¡Buen trabajo!';
    const message = wrongNumbers.length
      ? `Dictado de números ${dictationRangeText(dict.digits)}. Repasa con lápiz: ${wrongNumbers.join(', ')}.`
      : `Dictado de números ${dictationRangeText(dict.digits)}. ¡Todos bien escritos!`;
    $('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    $('result-title').textContent = title;
    $('result-score').textContent = `${correct}/${total}`;
    $('result-time').textContent = formatTime(dict.seconds);
    $('result-streak').textContent = streakInfo().current;
    $('result-level').textContent = message;
    const badgesBox = $('result-badges');
    badgesBox.innerHTML = '';
    fresh.forEach(b => badgesBox.appendChild(badgeCard(b, true, '¡Nueva medalla!')));
    $('result-more').hidden = true;
    $('result-game').hidden = false;
    $('result-home').className = 'btn btn-soft';
    dict = null;
    show('result');
    say(`${title} ${correct} de ${total}. ${message}` + (fresh.length ? ` ¡Ganaste la medalla ${fresh[0].name}!` : '') + ' ¡Y ahora, hora del juego!');
    soundWin();
    confetti(stars === 3 ? 60 : 25);
  });

  // Hoja de dictado: solo casillas con renglón de caligrafía; los números los dice Mapi.
  function buildDictationSheet(date, n, count, digits) {
    const sheet = document.createElement('article');
    sheet.className = 'sheet';
    sheet.appendChild(sheetHeader('👂', `Dictado de números (${dictationRangeText(digits)})`, date, `hoja ${n}`));
    const instruction = document.createElement('p');
    instruction.className = 'sheet-instruction';
    instruction.textContent = '◆ Escucha a Mapi y escribe cada número en su casilla, con tu mejor letra.';
    sheet.appendChild(instruction);
    const grid = document.createElement('div');
    grid.className = `dict-grid d${digits}`;
    for (let i = 0; i < count; i++) {
      const item = document.createElement('div');
      item.className = 'dict-item';
      item.appendChild(textSpan(`(${i + 1})`, 'sheet-num'));
      const cells = document.createElement('div');
      cells.className = 'dict-cells';
      for (let d = 0; d < digits; d++) cells.appendChild(K.cellSvg(null, 'vacio'));
      item.appendChild(cells);
      grid.appendChild(item);
    }
    sheet.appendChild(grid);
    const practice = document.createElement('p');
    practice.className = 'sheet-instruction';
    practice.textContent = '◆ Escribe otra vez, con calma, los números que te costaron:';
    sheet.appendChild(practice);
    const row = document.createElement('div');
    row.className = 'dict-practice';
    for (let k = 0; k < 9; k++) row.appendChild(K.cellSvg(null, 'vacio'));
    sheet.appendChild(row);
    const foot = document.createElement('footer');
    foot.className = 'sheet-foot';
    foot.textContent = `Aciertos: ______ / ${count}      ·      Mi Ábaco`;
    sheet.appendChild(foot);
    return sheet;
  }

  $('tile-dictado').addEventListener('click', () => {
    show('print');
    $('print-kind').value = 'dictado';
    syncPrintKind();
    buildSheets();
  });

  /* ---------- Juegos de concentración ---------- */

  let stopCurrentGame = null;
  let gameAnswer = null;

  function gamesUnlocked() {
    return !data.settings.gamesLock || streakInfo().doneToday;
  }

  // Cifras que puede leer en el ábaco según lo que ya aprendió.
  function flashMaxDigits() {
    const i = C.levelIndex(data.levelId);
    if (i < C.levelIndex('A6')) return 1;
    if (i < C.levelIndex('A8')) return 2;
    return 3;
  }

  // Un número para leer o poner en el ábaco, sin pasar de lo que ya sabe:
  // 0–4, luego 0–5, luego 0–9; con dos cifras, primero solo decenas (10, 20…).
  function routeNumber(digits) {
    const i = C.levelIndex(data.levelId);
    if (digits <= 1) {
      const max = i < C.levelIndex('A3') ? 4 : i < C.levelIndex('A4') ? 5 : 9;
      return Math.floor(Math.random() * (max + 1));
    }
    if (digits === 2 && i < C.levelIndex('A7')) return 10 * (1 + Math.floor(Math.random() * 9));
    return 10 ** (digits - 1) + Math.floor(Math.random() * 9 * 10 ** (digits - 1));
  }

  // Nivel más alto que permite la ruta en cada juego (0 = sin límite).
  function gameLimit(g) {
    if (g.id === 'flash' || g.id === 'poner') return flashMaxDigits();
    if (g.chain) return C.levelIndex(data.levelId) < C.levelIndex('B3') ? 3 : 0;
    return 0;
  }

  // Los juegos con cuentas se abren cuando ya sabe sumar en la ruta.
  function gameOpen(g) {
    return !g.from || C.levelIndex(data.levelId) >= C.levelIndex(g.from);
  }

  function gameOfToday() {
    return J.gameOfDay(dayNumber(today()), J.GAMES.filter(gameOpen));
  }

  function renderGames() {
    const unlocked = gamesUnlocked();
    const today_ = gameOfToday();
    $('games-bubble').textContent = unlocked
      ? `¡Elige un juego! El de hoy es «${today_.name}». Unos son con tu ábaco y otros entrenan tu atención y tu memoria.`
      : 'Los juegos se abren cuando terminas tu práctica de hoy. ¡Vamos a practicar primero!';
    const box = $('games-list');
    box.innerHTML = '';
    J.GROUPS.forEach(group => {
      const head = document.createElement('div');
      head.className = 'games-group';
      head.appendChild(textSpan(`${group.icon} ${group.name}`, 'games-group-name'));
      head.appendChild(textSpan(group.note, 'games-group-note'));
      box.appendChild(head);
      J.GAMES.filter(g => g.group === group.id).forEach(g => box.appendChild(gameCard(g, unlocked, today_)));
    });
    if (!unlocked) {
      const go = document.createElement('button');
      go.type = 'button';
      go.className = 'btn btn-primary btn-block btn-xl';
      go.textContent = '▶ Ir a practicar';
      go.addEventListener('click', () => show('home'));
      box.appendChild(go);
    }
  }

  function gameCard(g, unlocked, today_) {
    const open = gameOpen(g);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'game-card' + (g.id === today_.id ? ' is-today' : '') + (unlocked && open ? '' : ' is-locked');
    card.appendChild(textSpan(g.icon, 'game-icon'));
    const info = document.createElement('span');
    info.className = 'game-info';
    info.appendChild(textSpan(g.name, 'game-name'));
    info.appendChild(textSpan(g.short, 'game-short'));
    const st = data.games[g.id];
    if (open) {
      info.appendChild(textSpan(`Nivel: ${g.levelShort(st.level)}`, 'game-record'));
      info.appendChild(masteryDots(st));
    } else {
      info.appendChild(textSpan(`🔒 Se abre en el nivel ${g.from}: ${C.getLevel(g.from).name}`, 'game-record'));
    }
    card.appendChild(info);
    if (g.id === today_.id) card.appendChild(textSpan('Hoy', 'game-badge'));
    card.addEventListener('click', () => {
      if (!open) {
        mapi('games-bubble', `«${g.name}» se abre cuando llegues a «${C.getLevel(g.from).name}». ¡Sigue tu camino!`, 'try');
        return;
      }
      if (!gamesUnlocked()) {
        mapi('games-bubble', 'Primero tu práctica de hoy y después, ¡a jugar!', 'try');
        return;
      }
      openGame(g);
    });
    return card;
  }

  // Pantalla de inicio de cada juego: Mapi explica antes de jugar.
  function openGame(g) {
    show('game');
    $('game-title').textContent = `${g.icon} ${g.name}`;
    $('game-status').textContent = '';
    $('game-keypad').hidden = true;
    updateVoiceButton();
    const st = data.games[g.id];
    const board = $('game-board');
    board.innerHTML = '';
    board.appendChild(textSpan(g.icon, 'game-hero'));
    board.appendChild(textSpan(`Nivel: ${g.levelShort(st.level)}`, 'game-level'));
    board.appendChild(textSpan(`🎯 Meta: ${g.goal(st.level)}`, 'game-goal'));
    board.appendChild(masteryDots(st));
    board.appendChild(recentPlays(g, st));
    const play = document.createElement('button');
    play.type = 'button';
    play.className = 'btn btn-primary btn-xl';
    play.textContent = '▶ ¡Jugar!';
    play.addEventListener('click', () => playGame(g));
    board.appendChild(play);
    mapi('game-bubble', `${g.intro()} Hoy: ${g.levelName(st.level)}. La meta es ${g.goal(st.level)}.`);
  }

  // Avance hacia el siguiente nivel: partidas seguidas dentro de la meta.
  function masteryDots(st) {
    const box = document.createElement('span');
    box.className = 'mastery';
    box.appendChild(textSpan('Para subir: ', ''));
    for (let i = 0; i < J.STREAK_UP; i++) box.appendChild(textSpan('', i < st.streak ? 'dot is-on' : 'dot'));
    box.setAttribute('aria-label', `${Math.min(st.streak, J.STREAK_UP)} de ${J.STREAK_UP} partidas seguidas dentro de la meta`);
    return box;
  }

  // Últimas marcas en este nivel, con ✓ las que cumplieron la meta.
  function recentPlays(g, st) {
    const list = J.recent(st, 5);
    const box = document.createElement('div');
    box.className = 'recent-plays';
    if (!list.length) {
      box.appendChild(textSpan('Aquí verás tus marcas.', 'muted'));
      return box;
    }
    box.appendChild(textSpan('Tus marcas:', 'recent-label'));
    list.forEach(p => box.appendChild(textSpan(g.scoreText(p.score) + (p.ok ? ' ✓' : ''), 'recent-chip' + (p.ok ? ' is-ok' : ''))));
    return box;
  }

  function playGame(g) {
    stopGame();
    $('game-keypad').hidden = true;
    const st = data.games[g.id];
    // Los juegos con el ábaco no pasan de lo que ya sabe en la ruta.
    const limit = gameLimit(g);
    if (limit) st.level = Math.min(st.level, limit);
    const skills = C.abacusSkills(data.levelId);
    stopCurrentGame = J.start(g.id, {
      board: $('game-board'),
      level: st.level,
      number: routeNumber,
      chain: count => C.skillChain(data.levelId, count) || C.skillChain(data.levelId, 2) || [1, 1],
      answerLength: skills ? String(skills.max).length : 1,
      canSpeak: hasSpanishVoice(),
      speak: speakAndWait,
      Soroban: window.Soroban,
      sounds: { ok: soundOk, bad: soundTry, tick: soundTick },
      say: (text, mood, speech) => mapi('game-bubble', text, mood, speech),
      status: text => { $('game-status').textContent = text; },
      ask: len => askGameNumber(len),
      finish: result => finishGame(g, result)
    });
  }

  function stopGame() {
    if (stopCurrentGame) stopCurrentGame();
    stopCurrentGame = null;
    gameAnswer = null;
  }

  // Casillas + teclado para escribir el número que recuerda.
  function askGameNumber(len) {
    return new Promise(resolve => {
      const board = $('game-board');
      const boxes = document.createElement('span');
      boxes.className = 'answer-boxes';
      for (let i = 0; i < len; i++) boxes.appendChild(textSpan('', 'answer-box'));
      const row = document.createElement('div');
      row.className = 'answer-row';
      row.appendChild(boxes);
      board.appendChild(row);
      $('game-keypad').hidden = false;
      gameAnswer = { text: '', len, boxes, resolve };
    });
  }

  function gameKey(key) {
    if (!gameAnswer) return;
    const a = gameAnswer;
    if (key === 'Enter') {
      if (!a.text) return;
      gameAnswer = null;
      $('game-keypad').hidden = true;
      a.resolve(a.text);
      return;
    }
    if (key === 'Backspace') a.text = a.text.slice(0, -1);
    else if (/^[0-9]$/.test(key) && a.text.length < a.len) a.text += key;
    [...a.boxes.children].forEach((box, i) => { box.textContent = a.text[i] || ''; });
  }

  $('game-keypad').addEventListener('click', e => {
    const b = e.target.closest('[data-key]');
    if (b) gameKey(b.dataset.key);
  });

  document.addEventListener('keydown', e => {
    if (currentView !== 'game' || e.target.closest('input, select, textarea')) return;
    if (/^[0-9]$/.test(e.key) || e.key === 'Backspace' || e.key === 'Enter') {
      e.preventDefault();
      gameKey(e.key);
    }
  });

  function finishGame(g, result) {
    stopCurrentGame = null;
    const before = new Set(wonBadges().map(b => b.id));
    const st = data.games[g.id];
    const playedLevel = st.level;
    const outcome = J.applyResult(g.id, st, result, gameLimit(g), today());
    data.games.log = (data.games.log || []).concat({ date: today(), game: g.id, level: playedLevel, score: result.score, stars: result.stars }).slice(-200);
    data.stars = (data.stars || 0) + result.stars;
    save();
    const fresh = wonBadges().filter(b => !before.has(b.id));
    $('game-status').textContent = '';
    $('game-keypad').hidden = true;
    const board = $('game-board');
    board.innerHTML = '';
    board.appendChild(textSpan('⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars), 'stars'));
    board.appendChild(textSpan(result.ok ? '🎯 ¡Meta cumplida!' : `🎯 Meta: ${g.goal(playedLevel)}`, result.ok ? 'game-goal is-ok' : 'game-goal'));
    if (outcome.record) board.appendChild(textSpan('🏆 ¡Tu mejor marca en este nivel!', 'game-new-record'));
    board.appendChild(textSpan(result.text, 'game-result-text'));
    board.appendChild(textSpan(outcome.message, outcome.change ? 'game-level-change' : 'game-result-text'));
    if (!outcome.change) board.appendChild(masteryDots(st));
    board.appendChild(recentPlays(g, st));
    const badges = document.createElement('div');
    badges.className = 'new-badges';
    fresh.forEach(b => badges.appendChild(badgeCard(b, true, '¡Nueva medalla!')));
    board.appendChild(badges);
    const row = document.createElement('div');
    row.className = 'row center';
    const again = document.createElement('button');
    again.type = 'button';
    again.className = 'btn btn-primary btn-xl';
    again.textContent = '↺ Otra vez';
    again.addEventListener('click', () => playGame(g));
    const other = document.createElement('button');
    other.type = 'button';
    other.className = 'btn btn-soft';
    other.textContent = 'Otros juegos';
    other.addEventListener('click', () => show('games'));
    row.appendChild(again);
    row.appendChild(other);
    board.appendChild(row);
    const cheer = result.stars === 3 ? '¡Increíble!' : result.stars === 2 ? '¡Muy bien!' : '¡Buen trabajo!';
    mapi('game-bubble', `${cheer} ${result.text} ${outcome.message}` + (fresh.length ? ` ¡Ganaste la medalla ${fresh[0].name}!` : ''), result.ok ? 'ok' : null);
    soundWin();
    confetti(outcome.change > 0 ? 80 : result.ok ? 40 : 15);
  }

  $('game-exit').addEventListener('click', () => show('games'));
  $('game-voice').addEventListener('click', () => {
    data.settings.voice = !data.settings.voice;
    save();
    updateVoiceButton();
    if (data.settings.voice) say($('game-bubble').textContent);
    else hush();
  });

  /* ---------- Logros ---------- */

  function statTile(label, value) {
    const div = document.createElement('div');
    div.appendChild(textSpan(value, 'stat-value'));
    div.appendChild(textSpan(label, 'stat-label'));
    return div;
  }

  // Medallas: se ganan practicando, con constancia y al terminar cada módulo.
  const MODULE_ICONS = ['🧮', '➕', '🖐️', '🔟', '2️⃣', '3️⃣', '📜', '🧠'];
  function badgeList() {
    const list = [
      { id: 'leccion1', icon: '🎓', name: 'Primera lección', desc: 'Terminar una lección con Mapi', won: d => Object.keys(d.lessons).length >= 1 },
      { id: 'sesion1', icon: '🌱', name: 'Primer día', desc: 'Terminar una sesión', won: d => d.history.length >= 1 },
      { id: 'perfecta', icon: '💯', name: 'Sesión perfecta', desc: 'Todo bien al primer intento', won: d => d.history.some(h => h.correct === h.total) },
      { id: 'papel', icon: '📄', name: 'Con lápiz', desc: 'Hacer una práctica en papel', won: d => d.history.some(h => h.source === 'papel') },
      { id: 'racha3', icon: '🔥', name: '3 días seguidos', desc: 'Practicar 3 días seguidos', won: (d, s) => s.best >= 3 },
      { id: 'racha7', icon: '🔥', name: 'Una semana', desc: 'Practicar 7 días seguidos', won: (d, s) => s.best >= 7 },
      { id: 'racha30', icon: '🏆', name: 'Un mes', desc: 'Practicar 30 días seguidos', won: (d, s) => s.best >= 30 },
      { id: 'estrellas50', icon: '🌟', name: '50 estrellas', desc: 'Juntar 50 estrellas', won: d => (d.stars || 0) >= 50 },
      { id: 'dictado1', icon: '👂', name: 'Buen oído', desc: 'Terminar un dictado de números', won: d => (d.dictations || []).length >= 1 },
      { id: 'dictado10', icon: '✍️', name: 'Mano firme', desc: 'Terminar 10 dictados', won: d => (d.dictations || []).length >= 10 },
      { id: 'juego1', icon: '🎮', name: 'A jugar', desc: 'Terminar un juego', won: d => (d.games.log || []).length >= 1 },
      { id: 'poner', icon: '✋', name: 'Dedos rápidos', desc: 'Cumplir la meta de «Pon el número»', won: d => Object.entries(d.games.poner.best).some(([l, s]) => s <= J.PONER_GOAL[l]) },
      { id: 'escucha4', icon: '🎧', name: 'Oído de soroban', desc: 'Acertar una cuenta dictada de 4 números', won: d => (d.games.escucha.best[4] || 0) >= 1 },
      { id: 'mira4', icon: '👀', name: 'Vista de soroban', desc: 'Acertar una cuenta de 4 números en «Mira y calcula»', won: d => (d.games.mira.best[4] || 0) >= 1 },
      { id: 'schulte4', icon: '🦅', name: 'Ojo de águila', desc: 'Terminar la tabla de Schulte de 4×4', won: d => d.games.schulte.best[4] !== undefined },
      { id: 'memoria5', icon: '🐘', name: 'Memoria de elefante', desc: 'Recordar un número de 5 cifras', won: d => (d.games.span.best[5] || 0) >= 1 },
      { id: 'corsi5', icon: '💡', name: 'Camino de luces', desc: 'Repetir 5 luces en orden', won: d => (d.games.corsi.best[5] || 0) >= 1 }
    ];
    C.MODULES.forEach((mod, m) => {
      const last = mod.levels[mod.levels.length - 1];
      list.push({
        id: 'modulo' + (m + 1), icon: MODULE_ICONS[m], name: mod.title, desc: `Terminar el módulo ${m + 1}`,
        won: d => C.levelIndex(d.levelId) > C.levelIndex(last.id) || (m === C.MODULES.length - 1 && levelStats(last.id).recentPassed >= 2)
      });
    });
    return list;
  }

  function wonBadges() {
    const streak = streakInfo();
    return badgeList().filter(b => b.won(data, streak));
  }

  function badgeCard(b, won, note) {
    const div = document.createElement('div');
    div.className = 'badge' + (won ? ' is-won' : '');
    div.appendChild(textSpan(b.icon, 'badge-icon'));
    div.appendChild(textSpan(b.name, ''));
    div.lastChild.style.fontWeight = '800';
    const small = document.createElement('small');
    small.textContent = note || b.desc;
    div.appendChild(small);
    return div;
  }

  function renderAwards() {
    const streak = streakInfo();
    const won = new Set(wonBadges().map(b => b.id));
    const tiles = $('awards-stats');
    tiles.innerHTML = '';
    tiles.appendChild(statTile('Estrellas', `⭐ ${data.stars || 0}`));
    tiles.appendChild(statTile('Racha actual', `🔥 ${streak.current}`));
    tiles.appendChild(statTile('Sesiones', String(data.history.length)));
    tiles.appendChild(statTile('Niveles superados', `${C.levelIndex(data.levelId)} / ${C.LEVELS.length}`));
    const grid = $('awards-grid');
    grid.innerHTML = '';
    const list = badgeList();
    list.forEach(b => grid.appendChild(badgeCard(b, won.has(b.id))));
    $('awards-count').textContent = `${won.size} de ${list.length} medallas`;
  }

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
    $('set-abacus').value = data.settings.abacus;
    $('set-voice').checked = data.settings.voice;
    fillVoiceSelect();
    $('set-voice-rate').value = String(data.settings.voiceRate || 0.95);
    $('set-sound').checked = data.settings.sound;
    $('set-games-lock').checked = data.settings.gamesLock;
    $('set-dictation').value = data.settings.dictation || 'auto';
    const dl = (data.dictations || []).slice(-5);
    $('dictation-progress').textContent = dl.length
      ? `Dictados: ${(data.dictations || []).length} en total · últimos: ${dl.map(d => `${d.correct}/${d.total}`).join(', ')} · hoy toca ${dictationRangeText(dictationDigits())}.`
      : `Dictados: todavía ninguno · toca ${dictationRangeText(dictationDigits())}.`;
    $('games-progress').textContent = 'Juegos · ' + J.GAMES.map(g => {
      if (!gameOpen(g)) return `${g.name}: se abre en ${g.from}`;
      const st = data.games[g.id];
      const last = J.recent(st, 3).map(p => g.scoreText(p.score)).join(', ');
      return `${g.name}: ${g.levelShort(st.level)}, ${st.count} ${st.count === 1 ? 'partida' : 'partidas'} en este nivel, ${Math.min(st.streak, J.STREAK_UP)} de ${J.STREAK_UP} seguidas en la meta` + (last ? ` (últimas: ${last})` : '');
    }).join(' · ') + `. Sube con al menos ${J.MIN_PLAYS} partidas y ${J.STREAK_UP} seguidas en la meta, en ${J.MIN_DAYS} días distintos; baja si hay ${J.HARD_DOWN} seguidas muy difíciles.`;
    $('set-rtl').checked = data.settings.rtl;
    $('set-labels').checked = data.settings.labels;
    const stats = levelStats(level.id);
    const tiles = $('route-stats');
    tiles.innerHTML = '';
    tiles.appendChild(statTile('Precisión', stats.accuracy === null ? '—' : stats.accuracy + ' %'));
    tiles.appendChild(statTile('Constancia', stats.consistency === null ? '—' : stats.consistency + ' %'));
    tiles.appendChild(statTile('Prácticas', String(stats.practices)));
    tiles.appendChild(statTile('Tiempo medio', stats.avgSeconds === null ? '—' : stats.avgSeconds + ' s'));
    $('route-rule').textContent = `${level.id} · ${level.name}: ${recommendation(level, stats)}`;
    $('level-progress').textContent = `Nivel ${level.id}: ${stats.recentPassed} de 2 sesiones dominadas (entre las últimas 3). Tiempo objetivo: ${level.targetSec} s por ejercicio.`;
    $('install-btn').hidden = !installPrompt;

    const atLevel = data.history.filter(h => h.levelId === level.id).slice(-2);
    const struggling = atLevel.length === 2 && atLevel.every(h => h.correct / h.total < 0.6);
    const suggestion = $('level-suggestion');
    suggestion.hidden = !struggling || C.levelIndex(level.id) === 0;
    suggestion.textContent = `Las dos últimas sesiones costaron trabajo. Considera volver a ${C.previousLevel(level.id).id} unos días para ganar confianza.`;

    const tbody = $('history-body');
    tbody.innerHTML = '';
    const rows = data.history.map((h, i) => ({ h, i })).reverse().slice(0, 60);
    if (!rows.length) {
      const td = tbody.insertRow().insertCell();
      td.colSpan = 6;
      td.textContent = 'Todavía no hay sesiones.';
    }
    rows.forEach(({ h, i }) => {
      const tr = tbody.insertRow();
      [shortDate(h.date), h.levelId, `${h.correct}/${h.total}${h.passed ? ' ✓' : ''}`, formatTime(h.seconds), h.source === 'papel' ? '📄 papel' : '📱 pantalla']
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
    if (parseInt($('gate-answer').value, 10) === gate[0] * gate[1]) parentsUnlocked = true;
    renderParents();
  });
  $('gate-answer').addEventListener('keydown', e => { if (e.key === 'Enter') $('gate-go').click(); });

  $('set-name').addEventListener('change', e => { data.name = e.target.value.trim(); save(); });
  $('set-level').addEventListener('change', e => { setLevel(e.target.value); save(); renderParents(); });
  $('set-count').addEventListener('change', e => { data.settings.perSession = parseInt(e.target.value, 10); save(); });
  $('set-abacus').addEventListener('change', e => { data.settings.abacus = e.target.value; save(); });
  $('set-voice').addEventListener('change', e => { data.settings.voice = e.target.checked; save(); });

  function fillVoiceSelect() {
    const select = $('set-voice-name');
    const voices = spanishVoices().sort((a, b) => voiceScore(b) - voiceScore(a));
    select.innerHTML = '';
    const auto = document.createElement('option');
    auto.value = '';
    auto.textContent = voices.length ? `Automática (${voices[0].name})` : 'Automática';
    select.appendChild(auto);
    voices.forEach(v => {
      const o = document.createElement('option');
      o.value = v.name;
      o.textContent = `${v.name} · ${v.lang}${v.localService ? '' : ' · en línea'}`;
      select.appendChild(o);
    });
    select.value = voices.some(v => v.name === data.settings.voiceName) ? data.settings.voiceName : '';
    $('voice-none').hidden = voices.length > 0;
  }

  const VOICE_SAMPLE = '¡Hola! Soy Mapi. Vamos a contar juntos: uno, dos, tres, cuatro. ¡Muy bien!';
  $('set-voice-name').addEventListener('change', e => { data.settings.voiceName = e.target.value; save(); pickVoice(); say(VOICE_SAMPLE); });
  $('set-voice-rate').addEventListener('change', e => { data.settings.voiceRate = parseFloat(e.target.value); save(); say(VOICE_SAMPLE); });
  $('voice-test').addEventListener('click', () => {
    const was = data.settings.voice;
    data.settings.voice = true;
    say(VOICE_SAMPLE);
    data.settings.voice = was;
  });
  $('set-sound').addEventListener('change', e => { data.settings.sound = e.target.checked; save(); });
  $('set-games-lock').addEventListener('change', e => { data.settings.gamesLock = e.target.checked; save(); });
  $('set-dictation').addEventListener('change', e => { data.settings.dictation = e.target.value; save(); renderParents(); });
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
        data.lessons = Object.assign({}, imported.lessons);
        data.games = Object.assign(defaults().games, imported.games);
        normalizeGames();
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
    normalizeGames();
    save();
    renderParents();
  });

  /* ---------- App instalable ---------- */

  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    installPrompt = e;
    $('install-btn').hidden = false;
  });

  $('install-btn').addEventListener('click', () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt = null;
    $('install-btn').hidden = true;
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => { /* sin modo sin conexión */ });
  }

  /* ---------- Arranque ---------- */

  renderAvatarPicker();
  show('home');
})();
