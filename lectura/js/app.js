/*
 * Mi Lectura – lógica de la app.
 *
 * Sesión diaria (unos 10 minutos), igual para niños y adultos:
 *   1. 👁️ Calienta   un ejercicio visual corto (rango visual, rapidez, atención)
 *   2. 📖 Lee        el texto del día a su ritmo; se mide en palabras por minuto
 *   3. ❓ Entiende   tres preguntas sin mirar el texto
 *   4. ⚡ Relee      el mismo texto un poco más rápido, con guía o palabra a palabra
 *   5. 🧠 Recuerda   ordenar lo que pasó, juego de memoria y la pregunta de un texto anterior
 *
 * Cada lector (perfil) tiene su racha, su nivel, su velocidad de guía y sus ejercicios.
 */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const E = window.Ejercicios;
  const L = window.Lector;
  const TEXTS = (window.TEXTOS || []).slice();
  const BY_TEXT = Object.fromEntries(TEXTS.map(t => [t.id, t]));
  const STORE_KEY = 'lectura.v1';

  // Niveles de los textos. target: palabras por minuto en voz alta para pasar de nivel
  // (por debajo de los promedios por grado de Ripoll y otros, 2020, para no apurar).
  const LEVELS = {
    1: { name: 'Primeras lecturas', target: 35, chunk: 1 },
    2: { name: 'Frases cortas', target: 45, chunk: 1 },
    3: { name: 'Cuentos cortos', target: 60, chunk: 2 },
    4: { name: 'Textos con párrafos', target: 75, chunk: 2 },
    5: { name: 'Lectura fluida', target: 90, chunk: 3 },
    6: { name: 'Textos largos', target: 105, chunk: 3 },
    A: { name: 'Adultos', target: 250, chunk: 3 }
  };
  const KID_LEVELS = [1, 2, 3, 4, 5, 6];
  const START_OPTIONS = [
    { level: 1, text: 'Está empezando: lee palabras y frases muy cortas' },
    { level: 2, text: 'Lee frases cortas' },
    { level: 3, text: 'Lee cuentos cortos' },
    { level: 4, text: 'Lee párrafos con soltura' }
  ];
  // Promedios de estudiantes hispanohablantes (Ripoll Salceda, Tapia y Aguado, 2020) y de adultos
  // en español citados allí (Brysbaert, 2019).
  const NORMS = [
    ['1.º', 49, 30], ['2.º', 73, 79], ['3.º', 85, 95], ['4.º', 104, 125], ['5.º', 114, 137], ['6.º', 124, 155],
    ['Adultos', 191, 278]
  ];
  const AVATARS = ['🦊', '🐼', '🐯', '🦄', '🐸', '🐙', '🦁', '🐨', '🐰', '🐵', '🧑', '👩', '👨', '👵', '👴'];
  const STEPS = [
    { id: 'calienta', icon: '👁️', name: 'Calienta' },
    { id: 'lee', icon: '📖', name: 'Lee' },
    { id: 'entiende', icon: '❓', name: 'Entiende' },
    { id: 'relee', icon: '⚡', name: 'Relee' },
    { id: 'recuerda', icon: '🧠', name: 'Recuerda' }
  ];

  /* ---------- Datos: varios lectores ---------- */

  function loadStore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved && saved.profiles) return saved;
    } catch (e) { /* sin almacenamiento */ }
    return { current: null, profiles: {} };
  }

  let store = loadStore();
  let data = null;

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* modo privado */ }
  }

  function newProfile({ name, avatar, kind, level }) {
    const adult = kind === 'adulto';
    return {
      id: 'p' + Date.now().toString(36), name, avatar, kind,
      level: adult ? 'A' : level, pace: null,
      settings: { readMode: adult ? 'silencio' : 'voz', reread: adult ? 'rsvp' : 'guia', voice: !adult, voiceName: '', voiceRate: 0.95 },
      sessions: [], reads: {}, lastRead: {}, exercises: {}, recalls: [], badges: {}, stars: 0, levelUps: 0, today: null, ownText: ''
    };
  }

  function normalize(p) {
    const fresh = newProfile({ name: p.name, avatar: p.avatar, kind: p.kind, level: p.level });
    const settings = Object.assign({}, fresh.settings, p.settings);
    const out = Object.assign(fresh, p, { settings });
    E.EXERCISES.forEach(ex => { out.exercises[ex.id] = E.normalize(ex.id, out.exercises[ex.id], out.kind); });
    return out;
  }

  function useProfile(id) {
    if (!store.profiles[id]) return;
    store.current = id;
    store.profiles[id] = normalize(store.profiles[id]);
    data = store.profiles[id];
    save();
    pickVoice();
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

  // Racha: días seguidos con la sesión del día terminada.
  function streakInfo(p) {
    const days = new Set((p || data).sessions.map(s => s.date));
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

  /* ---------- Sonido, voz y Lino ---------- */

  let audioCtx = null;
  function playTones(freqs) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t = audioCtx.currentTime + i * 0.12;
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
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
  const SOUNDS = { ok: soundOk, bad: soundTry, tick: soundTick };

  let voice = null;
  function spanishVoices() {
    try { return window.speechSynthesis.getVoices().filter(v => /^es/i.test(v.lang)); } catch (e) { return []; }
  }
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
    voice = voices.find(v => data && v.name === data.settings.voiceName)
      || voices.slice().sort((a, b) => voiceScore(b) - voiceScore(a))[0] || null;
  }
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = pickVoice;

  function speakable(text) {
    return text
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/[«»]/g, '')
      .replace(/…/g, ', ')
      .replace(/\bppm\b/g, 'palabras por minuto')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function say(text) {
    if (!data || !data.settings.voice || !('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      if (!voice) pickVoice();
      speakable(text).split(/(?<=[.!?])\s+/).filter(Boolean).forEach(part => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = voice ? voice.lang : 'es-MX';
        if (voice) u.voice = voice;
        u.rate = data.settings.voiceRate || 0.95;
        window.speechSynthesis.speak(u);
      });
    } catch (e) { /* sin voz */ }
  }
  // Para la lectura en eco: Lino lee la frase aunque su voz esté apagada en el resto
  // de la app, y avisa al terminar. Si el navegador no avisa, sigue tras un tiempo prudente.
  function speakWait(text) {
    return new Promise(resolve => {
      const timer = setTimeout(resolve, 900 + 75 * text.length);
      const done = () => { clearTimeout(timer); resolve(); };
      if (!hasVoice()) return;
      try {
        window.speechSynthesis.cancel();
        if (!voice) pickVoice();
        const u = new SpeechSynthesisUtterance(speakable(text));
        u.lang = voice ? voice.lang : 'es-MX';
        if (voice) u.voice = voice;
        u.rate = Math.min(data.settings.voiceRate || 0.95, kid() ? 0.85 : 1);
        u.onend = done;
        u.onerror = done;
        window.speechSynthesis.speak(u);
      } catch (e) { done(); }
    });
  }
  const hasVoice = () => 'speechSynthesis' in window && spanishVoices().length > 0;

  function hush() {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { /* sin voz */ }
  }

  // Lino dice algo: globo de texto, voz y un gesto.
  function lino(bubbleId, text, mood, speech) {
    const bubble = $(bubbleId);
    bubble.textContent = text;
    bubble.className = 'bubble' + (mood ? ' is-' + mood : '');
    const mascot = bubble.parentElement.querySelector('.mascot');
    if (mascot) {
      mascot.classList.remove('is-happy', 'is-thinking');
      void mascot.offsetWidth;
      if (mood === 'ok') mascot.classList.add('is-happy');
      if (mood === 'try') mascot.classList.add('is-thinking');
    }
    say(speech === undefined ? text : speech);
  }

  function confetti(n) {
    let box = $('confetti');
    if (!box) {
      box = document.createElement('div');
      box.id = 'confetti';
      box.className = 'confetti';
      document.body.appendChild(box);
    }
    box.innerHTML = '';
    const colors = ['#7b5cff', '#ffb02e', '#22c08b', '#ff5d6c', '#3d9bff'];
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

  /* ---------- Utilidades de pantalla ---------- */

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function btn(cls, text, onClick) {
    const b = el('button', 'btn ' + cls, text);
    b.type = 'button';
    if (onClick) b.addEventListener('click', onClick);
    return b;
  }
  function tile(value, label) {
    const d = el('div', 'stat');
    d.appendChild(el('span', 'stat-value', value));
    d.appendChild(el('span', 'stat-label', label));
    return d;
  }
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const kid = () => data.kind !== 'adulto';

  /* ---------- Textos, niveles y velocidad ---------- */

  function levelLabel(level) {
    return level === 'A' ? 'Textos para adultos' : `Nivel ${level} · ${LEVELS[level].name}`;
  }

  function targetWpm(p) {
    const base = LEVELS[p.level].target;
    return Math.round(base * (p.settings.readMode === 'silencio' && p.level !== 'A' ? 1.2 : 1));
  }

  function textsOf(level) { return TEXTS.filter(t => String(t.level) === String(level)); }

  // Texto siguiente: el primero sin leer del nivel; si ya leyó todos, el que hace más que no lee.
  function nextText(p, skip) {
    const list = textsOf(p.level).filter(t => t.id !== skip);
    if (!list.length) return TEXTS[0];
    const unread = list.find(t => !p.reads[t.id]);
    if (unread) return unread;
    return list.slice().sort((a, b) => (p.lastRead[a.id] || '').localeCompare(p.lastRead[b.id] || ''))[0];
  }

  // El texto de hoy queda fijo durante el día.
  function todayText() {
    if (!data.today || data.today.date !== today() || !BY_TEXT[data.today.textId] || String(BY_TEXT[data.today.textId].level) !== String(data.level)) {
      data.today = { date: today(), textId: nextText(data).id };
      save();
    }
    return BY_TEXT[data.today.textId];
  }

  function clampPace(v) {
    const [min, max] = kid() ? [20, 250] : [100, 1000];
    return Math.max(min, Math.min(max, Math.round(v / 5) * 5));
  }

  // Avance del nivel: lecturas seguidas (al final) con buena comprensión y a la velocidad del nivel.
  function levelProgress(p) {
    const target = targetWpm(p);
    const at = p.sessions.filter(s => String(s.level) === String(p.level));
    let good = 0;
    for (let i = at.length - 1; i >= 0 && good < 3; i--) {
      const s = at[i];
      if (s.correct / s.total >= 2 / 3 && s.wpm >= target) good++;
      else break;
    }
    const days = new Set(at.slice(-good).map(s => s.date)).size;
    return { target, good, days, ready: good >= 3 && days >= 2 };
  }

  /* ---------- Medallas ---------- */

  const BADGES = [
    { id: 'primera', icon: '📖', name: 'Primera lectura', desc: 'Terminar una sesión', won: p => p.sessions.length >= 1 },
    { id: 'perfecta', icon: '💯', name: '3 de 3', desc: 'Responder bien las 3 preguntas', won: p => p.sessions.some(s => s.correct === s.total) },
    { id: 'racha3', icon: '🔥', name: '3 días seguidos', desc: 'Leer 3 días seguidos', won: (p, s) => s.best >= 3 },
    { id: 'racha7', icon: '🔥', name: 'Una semana', desc: 'Leer 7 días seguidos', won: (p, s) => s.best >= 7 },
    { id: 'racha30', icon: '🏆', name: 'Un mes', desc: 'Leer 30 días seguidos', won: (p, s) => s.best >= 30 },
    { id: 'memoria', icon: '🐘', name: 'Buena memoria', desc: 'Recordar 5 textos al día siguiente', won: p => p.recalls.filter(r => r.ok).length >= 5 },
    { id: 'textos10', icon: '📚', name: '10 textos', desc: 'Leer 10 textos distintos', won: p => Object.keys(p.reads).length >= 10 },
    { id: 'textos30', icon: '🏰', name: '30 textos', desc: 'Leer 30 textos distintos', won: p => Object.keys(p.reads).length >= 30 },
    { id: 'veloz', icon: '🚀', name: 'Más rápido', desc: 'Leer un 20 % más rápido que la primera vez, entendiendo', won: p => p.sessions.length >= 2 && p.sessions.slice(1).some(s => s.wpm >= p.sessions[0].wpm * 1.2 && s.correct / s.total >= 2 / 3) },
    { id: 'nivel', icon: '⬆️', name: 'Nuevo nivel', desc: 'Pasar a textos de un nivel nuevo', won: p => p.levelUps >= 1 },
    { id: 'buho', icon: '🦉', name: 'Ojos de búho', desc: 'Llegar al nivel 4 de «Ojos de búho»', won: p => p.exercises.buho.level >= 4 },
    { id: 'relampago', icon: '⚡', name: 'Ojo relámpago', desc: 'Cumplir la meta con frases en «Palabras relámpago»', won: p => p.exercises.relampago.plays.some(x => x.level >= 5 && x.ok) },
    { id: 'elefante', icon: '🧠', name: 'Memoria de elefante', desc: 'Recordar 6 palabras en «Palabras para recordar»', won: p => p.exercises.recuerda.plays.some(x => x.level >= 6 && x.ok) },
    { id: 'sentido', icon: '✅', name: 'Lectura veloz', desc: 'Cumplir la meta de «¿Tiene sentido?»', won: p => p.exercises.sentido.plays.some(x => x.ok) },
    { id: 'diccionario', icon: '💬', name: 'Diccionario andante', desc: 'Cumplir la meta de «Palabras amigas» en el nivel 2 o más', won: p => p.exercises.amigas.plays.some(x => x.level >= 2 && x.ok) },
    { id: 'frase', icon: '📝', name: 'Memoria de frase', desc: 'Armar de memoria frases de 8 palabras o más', won: p => p.exercises.frase.plays.some(x => x.level >= 4 && x.ok) },
    { id: 'eco', icon: '🔊', name: 'Lectura en eco', desc: 'Leer un texto completo en eco con Lino', won: p => p.sessions.some(s => s.feel === 'eco') }
  ];

  // Las medallas ganadas se guardan: no se pierden aunque cambie el historial.
  function checkBadges() {
    const s = streakInfo();
    const fresh = BADGES.filter(b => !data.badges[b.id] && b.won(data, s));
    fresh.forEach(b => { data.badges[b.id] = today(); });
    return fresh;
  }

  function badgeCard(b, won, note) {
    const d = el('div', 'badge' + (won ? ' is-won' : ''));
    d.appendChild(el('span', 'badge-icon', b.icon));
    d.appendChild(el('b', '', b.name));
    d.appendChild(el('small', '', note || b.desc));
    return d;
  }

  /* ---------- Navegación ---------- */

  let currentView = null;
  const TAB_OF = { result: 'home', exercise: 'exercises', reader: 'library', welcome: null };
  const FULL = new Set(['session', 'exercise', 'reader']);

  function show(view) {
    if (currentView === 'session' && view !== 'session') stopSession();
    if (currentView === 'exercise' && view !== 'exercise') stopExercise();
    if (currentView === 'reader' && view !== 'reader') stopReader();
    hush();
    if (!data && view !== 'welcome') view = 'welcome';
    currentView = view;
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== 'view-' + view; });
    document.body.classList.toggle('in-session', FULL.has(view));
    $('tabbar').hidden = view === 'welcome';
    const tab = view in TAB_OF ? TAB_OF[view] : view;
    document.querySelectorAll('#tabbar [data-tab]').forEach(b => b.classList.toggle('is-active', b.dataset.tab === tab));
    if (view === 'home') renderHome();
    if (view === 'exercises') renderExercises();
    if (view === 'library') renderLibrary();
    if (view === 'progress') renderProgress();
    if (view === 'settings') renderSettings();
    if (view === 'welcome') renderWelcome();
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if (go) show(go.dataset.go);
  });

  /* ---------- Bienvenida (nuevo lector) ---------- */

  let welcome = { avatar: AVATARS[0], kind: 'nino', level: 2 };

  function renderWelcome() {
    const first = !Object.keys(store.profiles).length;
    $('welcome-title').textContent = first ? '¡Hola! Soy Lino' : 'Nuevo lector';
    $('welcome-cancel').hidden = first;
    $('welcome-name').value = '';
    const pickers = $('welcome-avatars');
    pickers.innerHTML = '';
    AVATARS.forEach(a => {
      const b = el('button', 'avatar-option' + (a === welcome.avatar ? ' is-selected' : ''), a);
      b.type = 'button';
      b.addEventListener('click', () => { welcome.avatar = a; renderWelcomeChoices(); });
      pickers.appendChild(b);
    });
    renderWelcomeChoices();
  }

  function renderWelcomeChoices() {
    document.querySelectorAll('#welcome-avatars .avatar-option').forEach(b => b.classList.toggle('is-selected', b.textContent === welcome.avatar));
    document.querySelectorAll('#welcome-kind [data-kind]').forEach(b => b.classList.toggle('is-selected', b.dataset.kind === welcome.kind));
    $('welcome-level-box').hidden = welcome.kind === 'adulto';
    const box = $('welcome-level');
    box.innerHTML = '';
    START_OPTIONS.forEach(o => {
      const b = el('button', 'level-option' + (o.level === welcome.level ? ' is-selected' : ''));
      b.type = 'button';
      b.appendChild(el('b', '', `Nivel ${o.level}`));
      b.appendChild(el('span', '', o.text));
      b.addEventListener('click', () => { welcome.level = o.level; renderWelcomeChoices(); });
      box.appendChild(b);
    });
  }

  $('welcome-kind').addEventListener('click', e => {
    const b = e.target.closest('[data-kind]');
    if (!b) return;
    welcome.kind = b.dataset.kind;
    renderWelcomeChoices();
  });

  $('welcome-go').addEventListener('click', () => {
    const name = $('welcome-name').value.trim() || (welcome.kind === 'adulto' ? 'Lector' : 'Campeón');
    const p = newProfile({ name, avatar: welcome.avatar, kind: welcome.kind, level: welcome.level });
    store.profiles[p.id] = p;
    useProfile(p.id);
    show('home');
  });
  $('welcome-cancel').addEventListener('click', () => show('settings'));

  /* ---------- Inicio ---------- */

  function renderHome() {
    const s = streakInfo();
    const text = todayText();
    const words = L.countWords(text.text);
    $('home-avatar').textContent = data.avatar;
    $('home-hello').textContent = `¡Hola, ${data.name}!`;
    $('home-date').textContent = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' });
    $('home-streak').textContent = s.current;
    $('home-stars').textContent = data.stars;
    $('today-level').textContent = levelLabel(data.level);
    $('today-emoji').textContent = text.emoji;
    $('today-title').textContent = text.title;
    $('today-meta').textContent = `${words} palabras · ${data.reads[text.id] ? `ya lo leíste ${data.reads[text.id]} ${data.reads[text.id] === 1 ? 'vez' : 'veces'}` : 'texto nuevo'}`;
    const steps = $('today-steps');
    steps.innerHTML = '';
    STEPS.forEach(st => {
      const li = el('li', s.doneToday ? 'is-done' : '');
      li.appendChild(el('span', 'step-icon', st.icon));
      li.appendChild(el('span', '', st.name));
      steps.appendChild(li);
    });
    $('start-session').textContent = s.doneToday ? '📖 Leer otro texto' : '▶ Empezar la sesión de hoy';
    const prog = levelProgress(data);
    $('today-why').textContent = data.level === 'A'
      ? `Meta de referencia: ${prog.target} ppm entendiendo lo que lees.`
      : data.level === 6 && prog.ready ? '¡Llegaste al nivel más alto!'
        : `Para subir de nivel: 3 lecturas seguidas con buena comprensión y ${prog.target} ppm o más (llevas ${prog.good}).`;
    let msg;
    if (s.doneToday) msg = `¡Ya leíste hoy! ${s.current === 1 ? 'Empezaste tu racha' : `Llevas ${s.current} días seguidos`}. Si quieres, practica un ejercicio o lee otro texto.`;
    else if (!data.sessions.length) msg = kid() ? 'Hoy es tu primera lectura conmigo. Son unos 10 minutos: ¡vamos paso a paso!' : 'Primera sesión: mediremos tu velocidad y tu comprensión. Son unos 10 minutos.';
    else msg = s.current > 1 ? `¡Llevas ${s.current} días seguidos! Hoy toca «${text.title}».` : s.current ? `Ayer leíste: ¡sigamos la racha! Hoy toca «${text.title}».` : `Hoy toca «${text.title}». ¡Empecemos una nueva racha!`;
    lino('home-bubble', msg);

    const week = $('week-strip');
    week.innerHTML = '';
    for (let i = 6; i >= 0; i--) {
      const key = addDays(today(), -i);
      const li = el('li', (s.days.has(key) ? 'is-done' : '') + (i === 0 ? ' is-today' : ''), parseKey(key).toLocaleDateString('es', { weekday: 'narrow' }).toUpperCase());
      week.appendChild(li);
    }
    $('streak-best').textContent = s.best ? `Mejor racha: ${s.best}` : '';
    renderStats($('home-stats'), true);
    chart($('home-chart'), 12);
  }

  $('start-session').addEventListener('click', () => {
    if (streakInfo().doneToday && data.today && data.today.date === today()) {
      data.today = { date: today(), textId: nextText(data, data.today.textId).id };
      save();
    }
    startSession();
  });
  $('home-avatar').addEventListener('click', () => openWho());

  function renderStats(box, compact) {
    box.innerHTML = '';
    const ss = data.sessions;
    if (!ss.length) {
      box.appendChild(el('p', 'muted', 'Aquí verás tu velocidad y tu comprensión después de la primera sesión.'));
      return;
    }
    const last = ss[ss.length - 1];
    const lastFive = ss.slice(-5);
    const comp = pct(lastFive.reduce((a, s) => a + s.correct, 0), lastFive.reduce((a, s) => a + s.total, 0));
    box.appendChild(tile(`${last.wpm}`, 'ppm (última)'));
    box.appendChild(tile(`${comp} %`, 'comprensión'));
    const done = data.recalls.filter(r => r.done);
    box.appendChild(tile(done.length ? `${pct(done.filter(r => r.ok).length, done.length)} %` : '—', 'recuerda al otro día'));
    if (!compact) {
      box.appendChild(tile(`${Math.max(...ss.map(s => s.wpm))}`, 'mejor ppm'));
      box.appendChild(tile(`${Math.round(last.wpm * last.correct / last.total)}`, 'velocidad efectiva'));
      box.appendChild(tile(`${Object.keys(data.reads).length}`, 'textos leídos'));
    }
  }

  // Gráfica de velocidad: puntos por sesión (color = comprensión), la guía y la meta del nivel.
  function chart(box, n) {
    box.innerHTML = '';
    const ss = data.sessions.slice(-n);
    if (ss.length < 2) return;
    const W = 320, H = 130, pad = 26;
    const target = targetWpm(data);
    const values = ss.map(s => s.wpm).concat(ss.map(s => s.pace || 0), [target]);
    const max = Math.max(...values) * 1.1;
    const min = Math.max(0, Math.min(target, ...ss.map(s => s.wpm)) * 0.8);
    const x = i => pad + (i * (W - pad - 8)) / (ss.length - 1);
    const y = v => H - 18 - ((v - min) / (max - min || 1)) * (H - 30);
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `Velocidad en las últimas ${ss.length} sesiones: de ${ss[0].wpm} a ${ss[ss.length - 1].wpm} palabras por minuto`);
    const add = (tag, attrs) => {
      const node = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
      svg.appendChild(node);
      return node;
    };
    add('line', { x1: pad, x2: W - 8, y1: y(target), y2: y(target), class: 'chart-target' });
    const paced = ss.filter(s => s.pace);
    if (paced.length > 1) add('polyline', { points: ss.map((s, i) => s.pace ? `${x(i)},${y(s.pace)}` : '').filter(Boolean).join(' '), class: 'chart-pace' });
    add('polyline', { points: ss.map((s, i) => `${x(i)},${y(s.wpm)}`).join(' '), class: 'chart-line' });
    ss.forEach((s, i) => {
      const ratio = s.correct / s.total;
      add('circle', { cx: x(i), cy: y(s.wpm), r: 5, class: ratio >= 1 ? 'dot-ok' : ratio >= 2 / 3 ? 'dot-mid' : 'dot-low' });
    });
    add('text', { x: 2, y: y(ss[0].wpm) + 4, class: 'chart-label' }).textContent = ss[0].wpm;
    box.appendChild(svg);
    const legend = el('p', 'chart-legend');
    legend.innerHTML = `<span class="key key-line"></span> tu velocidad <span class="key key-pace"></span> guía <span class="key key-target"></span> meta (${target} ppm) · <span class="dot-key ok"></span> 3/3 <span class="dot-key mid"></span> 2/3 <span class="dot-key low"></span> menos`;
    box.appendChild(legend);
  }

  /* ---------- ¿Quién lee? ---------- */

  function openWho() {
    const dlg = $('who');
    const list = $('who-list');
    list.innerHTML = '';
    Object.values(store.profiles).forEach(p => {
      const b = el('button', 'who-option' + (p.id === data.id ? ' is-selected' : ''));
      b.type = 'button';
      b.appendChild(el('span', 'who-avatar', p.avatar));
      b.appendChild(el('span', '', `${p.name} · 🔥 ${streakInfo(normalize(p)).current}`));
      b.addEventListener('click', () => { useProfile(p.id); dlg.close(); show('home'); });
      list.appendChild(b);
    });
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  $('who-new').addEventListener('click', () => { $('who').close(); welcome = { avatar: AVATARS[0], kind: 'nino', level: 2 }; show('welcome'); });
  $('who-close').addEventListener('click', () => $('who').close());

  /* ---------- Sesión diaria ---------- */

  let S = null;

  function startSession() {
    const text = todayText();
    S = {
      text, words: L.countWords(text.text), step: 0, stop: null,
      warmup: null, seconds: 0, wpm: 0, correct: 0, total: text.questions.length,
      pace: null, feel: null, order: null, recall: [], memory: null
    };
    show('session');
    renderSessionSteps();
    stepCalienta();
  }

  function stopSession() {
    if (S && S.stop) S.stop();
    if (S) S.stop = null;
    S = null;
  }

  function renderSessionSteps() {
    const box = $('session-steps');
    box.innerHTML = '';
    STEPS.forEach((st, i) => {
      const li = el('li', i < S.step ? 'is-done' : i === S.step ? 'is-current' : '');
      li.appendChild(el('span', 'phase-icon', st.icon));
      li.appendChild(el('span', 'phase-name', st.name));
      box.appendChild(li);
    });
    $('session-voice').classList.toggle('is-off', !data.settings.voice);
  }

  function goStep(i, fn) {
    if (S.stop) S.stop();
    S.stop = null;
    S.step = i;
    renderSessionSteps();
    $('s-stage').innerHTML = '';
    $('s-stage').scrollTop = 0;
    fn();
  }

  function stage() { return $('s-stage'); }
  const sb = (text, mood, speech) => lino('s-bubble', text, mood, speech);

  function actions(...buttons) {
    const row = el('div', 'stage-actions');
    buttons.forEach(b => row.appendChild(b));
    stage().appendChild(row);
    return row;
  }

  $('session-exit').addEventListener('click', () => {
    if (S && S.step >= 1 && !window.confirm('¿Salir? La sesión de hoy no quedará guardada.')) return;
    show('home');
  });
  $('session-voice').addEventListener('click', () => {
    data.settings.voice = !data.settings.voice;
    save();
    $('session-voice').classList.toggle('is-off', !data.settings.voice);
    if (data.settings.voice) say($('s-bubble').textContent); else hush();
  });

  // Un ejercicio dentro de la sesión (calentamiento o memoria). Al terminar llama a done(resultado).
  function sessionExercise(def, intro, done) {
    const box = stage();
    box.innerHTML = '';
    const st = data.exercises[def.id];
    const head = el('div', 'stage-head');
    head.appendChild(el('span', 'stage-title', `${def.icon} ${def.name}`));
    const status = el('span', 'chip-stat small', `Nivel ${def.levels.indexOf(st.level) + 1}`);
    head.appendChild(status);
    box.appendChild(head);
    const board = el('div', 'game-board');
    box.appendChild(board);
    board.appendChild(el('span', 'game-hero', def.icon));
    board.appendChild(el('span', 'game-goal', `🎯 Meta: ${def.goal(st.level)}`));
    board.appendChild(btn('btn-primary btn-xl', '▶ ¡Vamos!', () => {
      board.innerHTML = '';
      S.stop = E.start(def.id, {
        board, level: st.level, kind: data.kind, sounds: SOUNDS,
        say: (text, mood, speech) => sb(text, mood, speech),
        status: text => { status.textContent = text; },
        finish: result => {
          S.stop = null;
          const outcome = E.applyResult(def.id, st, result, today());
          save();
          board.innerHTML = '';
          board.appendChild(el('div', 'stars', '⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars)));
          board.appendChild(el('p', 'game-result-text', result.text));
          board.appendChild(el('p', outcome.change ? 'game-level-change' : 'game-result-text', outcome.message));
          sb(`${result.stars === 3 ? '¡Excelente!' : '¡Bien!'} ${result.text}`, result.ok ? 'ok' : null);
          (result.ok ? soundWin : soundTick)();
          done({ id: def.id, level: st.level, score: result.score, ok: result.ok, stars: result.stars });
        }
      });
    }));
    sb(intro + ' ' + def.intro());
  }

  // 1. Calienta: el ejercicio visual del día.
  function stepCalienta() {
    const def = E.warmupOfDay(dayNumber(today()));
    sessionExercise(def, 'Primero calentamos los ojos.', result => {
      S.warmup = result;
      actions(btn('btn-primary btn-xl', 'Siguiente: leer ▶', () => goStep(1, stepLee)));
    });
  }

  // 2. Lee: el texto a su ritmo, cronometrado.
  function stepLee() {
    const box = stage();
    const card = el('article', 'reading-card' + (kid() ? ' kid' : ''));
    card.appendChild(el('h2', 'reading-title', `${S.text.emoji} ${S.text.title}`));
    const body = el('div', 'reading-text is-blurred');
    L.render(body, S.text.text);
    card.appendChild(body);
    box.appendChild(card);
    const aloud = data.settings.readMode === 'voz';
    let start = 0;
    const go = btn('btn-primary btn-xl', '▶ Empezar a leer', () => {
      body.classList.remove('is-blurred');
      start = Date.now();
      go.hidden = true;
      done.hidden = false;
      sb(aloud ? 'Lee en voz alta, con calma y sin saltarte palabras.' : 'Lee en silencio, con atención.', null, '');
    });
    const done = btn('btn-success btn-xl', '✓ ¡Terminé!', () => finishReading((Date.now() - start) / 1000));
    done.hidden = true;
    actions(go, done);
    sb(aloud
      ? `Ahora lee «${S.text.title}» en voz alta, a tu ritmo. Toca «Empezar» y, al terminar, «¡Terminé!». Después te haré preguntas.`
      : `Lee «${S.text.title}» a tu ritmo, entendiendo. Toca «Empezar» y, al terminar, «¡Terminé!». Después vienen preguntas.`);
  }

  function finishReading(seconds) {
    const wpm = Math.round(S.words / (seconds / 60));
    // Si fue demasiado rápido para leerlo de verdad, pregunta antes de guardar.
    const tooFast = kid() ? wpm > Math.max(220, targetWpm(data) * 3) : wpm > 1200;
    const box = stage();
    box.querySelector('.stage-actions').remove();
    if (tooFast) {
      sb(`¡Eso fue rapidísimo! ¿Leíste todo el texto?`, 'try');
      actions(
        btn('btn-soft', '↺ Volver a leer', () => goStep(1, stepLee)),
        btn('btn-primary', 'Sí, lo leí todo', () => saveReading(seconds, wpm))
      );
      return;
    }
    saveReading(seconds, wpm);
  }

  function saveReading(seconds, wpm) {
    S.seconds = Math.round(seconds);
    S.wpm = wpm;
    const prev = data.sessions.filter(s => s.textId !== S.text.id).slice(-1)[0];
    const cmp = prev ? (wpm > prev.wpm ? ` ¡Más que la vez anterior (${prev.wpm})!` : '') : '';
    sb(`Leíste a ${wpm} palabras por minuto.${cmp} Ahora, sin mirar el texto, responde.`, 'ok');
    goStep(2, stepEntiende);
  }

  // 3. Entiende: tres preguntas, sin el texto a la vista.
  function stepEntiende() {
    let i = 0;
    S.correct = 0;
    const ask = () => {
      const q = S.text.questions[i];
      const box = stage();
      box.innerHTML = '';
      box.appendChild(el('p', 'eyebrow center-text', `Pregunta ${i + 1} de ${S.total}`));
      box.appendChild(el('p', 'q-text', q.q));
      askChoice(box, q, ok => {
        if (ok) S.correct++;
        const last = i === S.total - 1;
        actions(btn('btn-primary btn-xl', last ? 'Siguiente: releer ▶' : 'Siguiente ▶', () => {
          if (last) goStep(3, stepRelee);
          else { i++; ask(); }
        }));
      });
      if (i > 0 || !S.wpm) sb(q.q); else say(q.q);
    };
    ask();
  }

  // Opciones de una pregunta (la primera del texto es la correcta; se barajan).
  function askChoice(box, q, done) {
    const right = q.options[0];
    const grid = el('div', 'choice-grid wide');
    const buttons = E.shuffle(q.options).map(o => {
      const b = el('button', 'choice', o);
      b.type = 'button';
      grid.appendChild(b);
      return b;
    });
    box.appendChild(grid);
    buttons.forEach(b => b.addEventListener('click', () => {
      buttons.forEach(x => { x.disabled = true; });
      const ok = b.textContent === right;
      b.classList.add(ok ? 'is-ok' : 'is-wrong');
      if (!ok) buttons.find(x => x.textContent === right).classList.add('is-ok');
      if (ok) { soundOk(); sb(E.shuffle(['¡Muy bien!', '¡Exacto!', '¡Así es!'])[0], 'ok'); } else { soundTry(); sb(`Era: «${right}».`, 'try'); }
      done(ok);
    }, { once: true }));
  }

  // 4. Relee: más rápido, con guía o palabra a palabra.
  function stepRelee() {
    if (!data.pace) data.pace = clampPace(S.wpm * 1.15);
    S.pace = data.pace;
    const mode = data.settings.reread;
    const box = stage();
    if (mode === 'eco') {
      box.appendChild(el('p', 'eyebrow center-text', 'Lectura en eco'));
      box.appendChild(el('p', 'pace-big', '🔊 → 🗣️'));
      box.appendChild(el('p', 'muted center-text', hasVoice()
        ? 'Lino lee una frase en voz alta y después tú la lees igual: con su ritmo y su entonación.'
        : 'Este dispositivo no tiene voz en español: un adulto lee cada frase y después la lees tú.'));
      actions(btn('btn-primary btn-xl', '▶ Empezar', () => runEcho()));
      sb('Ahora leemos en eco: primero leo yo una frase y después la lees tú, igualito. ¡Escucha bien!');
      return;
    }
    box.appendChild(el('p', 'eyebrow center-text', mode === 'rsvp' ? 'Palabra a palabra' : 'Lectura con guía'));
    box.appendChild(el('p', 'pace-big', `${S.pace} ppm`));
    box.appendChild(el('p', 'muted center-text', mode === 'rsvp'
      ? 'Las palabras aparecen una a una en el centro. Mira la letra de color.'
      : 'Un resaltador avanza por el texto. Léelo siguiéndolo, sin quedarte atrás.'));
    actions(btn('btn-primary btn-xl', '▶ Empezar', () => runReread(mode)));
    const faster = S.pace > S.wpm ? ' un poco más rápido que antes' : '';
    sb(mode === 'rsvp'
      ? `Ahora relee el mismo texto${faster}: las palabras pasan solas, a ${S.pace} palabras por minuto. Puedes pausar o volver a la frase.`
      : `Ahora relee el mismo texto${faster}, siguiendo la guía de color. Va a ${S.pace} palabras por minuto.`);
  }

  function runReread(mode) {
    const box = stage();
    box.innerHTML = '';
    const opts = { wpm: S.pace, chunk: mode === 'rsvp' ? 1 : LEVELS[data.level].chunk, onEnd: () => askFeel() };
    let ctrl;
    if (mode === 'rsvp') {
      const word = el('div', 'rsvp-word');
      const bar = el('div', 'rsvp-bar');
      const fill = el('span');
      bar.appendChild(fill);
      box.appendChild(el('p', 'reading-title center-text', `${S.text.emoji} ${S.text.title}`));
      box.appendChild(word);
      box.appendChild(bar);
      opts.onProgress = (i, n) => { fill.style.width = `${(i / n) * 100}%`; };
      ctrl = L.rsvp(word, S.text.text, opts);
    } else {
      const card = el('article', 'reading-card' + (kid() ? ' kid' : ''));
      card.appendChild(el('h2', 'reading-title', `${S.text.emoji} ${S.text.title}`));
      const body = el('div', 'reading-text');
      card.appendChild(body);
      box.appendChild(card);
      ctrl = L.guide(body, S.text.text, opts);
    }
    S.stop = () => ctrl.stop();
    const pause = btn('btn-soft', '⏸️ Pausa', () => {
      if (ctrl.paused) { ctrl.resume(); pause.textContent = '⏸️ Pausa'; } else { ctrl.pause(); pause.textContent = '▶ Seguir'; }
    });
    const row = actions(pause);
    if (mode === 'rsvp') row.insertBefore(btn('btn-soft', '⟲ Frase', () => ctrl.back()), pause);
    sb('¡Sigue la lectura!', null, '');
  }

  // Lectura en eco dentro de la sesión (no cambia la velocidad de la guía).
  function runEcho() {
    const box = stage();
    box.innerHTML = '';
    const card = el('article', 'reading-card' + (kid() ? ' kid' : ''));
    card.appendChild(el('h2', 'reading-title', `${S.text.emoji} ${S.text.title}`));
    const body = el('div', 'reading-text');
    card.appendChild(body);
    box.appendChild(card);
    const ctrl = L.eco(body, S.text.text, {
      speak: text => { sb('🔊 Escucha…', null, ''); return speakWait(text); },
      turn: (k, n) => echoTurn(box, k, n, msg => sb(msg, null, '')),
      onEnd: () => {
        S.stop = null;
        S.feel = 'eco';
        soundOk();
        sb('¡Muy bien leído! Ahora vamos a recordar.', 'ok');
        const old = box.querySelector('.stage-actions');
        if (old) old.remove();
        actions(btn('btn-primary btn-xl', 'Siguiente: recordar ▶', () => goStep(4, stepRecuerda)));
      }
    });
    S.stop = () => { ctrl.stop(); hush(); };
  }

  // Turno de leer en eco: espera a que toque «Ya la leí».
  function echoTurn(box, k, n, tell) {
    return new Promise(resolve => {
      const old = box.querySelector('.stage-actions');
      if (old) old.remove();
      tell(`🗣️ ¡Tu turno! Lee la frase amarilla en voz alta (${k + 1} de ${n}).`);
      const row = el('div', 'stage-actions');
      row.appendChild(btn('btn-success btn-xl', '✓ Ya la leí', () => { row.remove(); resolve(); }));
      box.appendChild(row);
    });
  }

  function askFeel() {
    S.stop = null;
    const box = stage();
    const old = box.querySelector('.stage-actions');
    if (old) old.remove();
    sb('¿Cómo te fue con esa velocidad?');
    const set = feel => {
      S.feel = feel;
      const good = S.correct / S.total >= 2 / 3;
      if (feel === 'rapido') data.pace = clampPace(data.pace * 0.9);
      else if (feel === 'lento') data.pace = clampPace(data.pace * 1.1);
      else if (good) data.pace = clampPace(data.pace * 1.05);
      save();
      goStep(4, stepRecuerda);
    };
    const row = actions(
      btn('btn-soft', '😅 Muy rápido', () => set('rapido')),
      btn('btn-primary', '😊 Pude seguirla', () => set('bien')),
      btn('btn-soft', '🐢 Muy lenta', () => set('lento'))
    );
    row.classList.add('feel');
  }

  // 5. Recuerda: textos anteriores (retención), orden de la historia y memoria.
  function stepRecuerda() {
    const due = data.recalls
      .filter(r => !r.done && r.due <= today() && r.textId !== S.text.id && BY_TEXT[r.textId])
      .sort((a, b) => a.due.localeCompare(b.due))
      .slice(0, 2);
    let i = 0;
    const nextRecall = () => {
      if (i >= due.length) { stepOrden(); return; }
      const r = due[i];
      const t = BY_TEXT[r.textId];
      const q = r.kind === 'repaso' ? t.questions.find(x => x.kind === 'literal') : t.recall;
      const box = stage();
      box.innerHTML = '';
      box.appendChild(el('p', 'eyebrow center-text', r.kind === 'repaso' ? 'Repaso de hace una semana' : 'De tu lectura anterior'));
      box.appendChild(el('p', 'recall-title', `${t.emoji} ${t.title}`));
      box.appendChild(el('p', 'q-text', q.q));
      sb(`¿Te acuerdas de «${t.title}»? ${q.q}`);
      askChoice(box, q, ok => {
        r.done = today();
        r.ok = ok;
        S.recall.push({ textId: t.id, kind: r.kind, ok });
        save();
        actions(btn('btn-primary btn-xl', 'Siguiente ▶', () => { i++; nextRecall(); }));
      });
    };
    nextRecall();
  }

  function stepOrden() {
    const box = stage();
    box.innerHTML = '';
    const board = el('div', 'game-board');
    box.appendChild(board);
    const life = E.lifecycle();
    S.stop = () => life.stop();
    sb(`¿Recuerdas el orden de «${S.text.title}»? Toca lo que pasó primero.`);
    E.ordena({ board, sounds: SOUNDS, say: (t, m, s) => sb(t, m, s) }, life, S.text.order).then(errors => {
      if (!life.alive) return;
      S.order = errors;
      S.stop = null;
      soundOk();
      sb(errors ? `¡Listo! Con ${errors} ${errors === 1 ? 'intento de más' : 'intentos de más'}.` : '¡Perfecto, en orden!', 'ok');
      // Para terminar, el juego del día: memoria, comprensión o vocabulario.
      const game = E.finalOfDay(dayNumber(today()));
      actions(btn('btn-primary btn-xl', `Siguiente: ${game.name} ▶`, () => {
        sessionExercise(game, 'Un juego más para terminar.', result => {
          S.memory = result;
          actions(btn('btn-primary btn-xl', 'Terminar ▶', finishSession));
        });
      }));
    });
  }

  function finishSession() {
    const t = S.text;
    const before = levelProgress(data);
    const entry = {
      date: today(), at: Date.now(), textId: t.id, level: data.level, words: S.words, seconds: S.seconds, wpm: S.wpm,
      correct: S.correct, total: S.total, pace: S.pace, feel: S.feel, order: S.order,
      warmup: S.warmup, memory: S.memory, recall: S.recall
    };
    data.sessions = data.sessions.concat(entry).slice(-400);
    data.reads[t.id] = (data.reads[t.id] || 0) + 1;
    data.lastRead[t.id] = today();
    // Retención: una pregunta mañana y un repaso en una semana.
    if (!data.recalls.some(r => r.textId === t.id && !r.done)) {
      data.recalls.push({ textId: t.id, due: addDays(today(), 1), kind: 'recall' }, { textId: t.id, due: addDays(today(), 7), kind: 'repaso' });
    }
    data.recalls = data.recalls.slice(-300);
    const stars = S.correct === S.total ? 3 : S.correct / S.total >= 2 / 3 ? 2 : 1;
    data.stars += stars + S.recall.filter(r => r.ok).length;
    // Subir de nivel (niños): 3 lecturas seguidas buenas en al menos 2 días.
    let levelUp = false;
    const prog = levelProgress(data);
    if (data.level !== 'A' && data.level < 6 && prog.ready) {
      data.level += 1;
      data.levelUps += 1;
      data.today = null;
      levelUp = true;
    }
    const fresh = checkBadges();
    save();
    showResult(entry, stars, levelUp, before, fresh);
    S = null;
  }

  function showResult(entry, stars, levelUp, before, fresh) {
    show('result');
    $('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = stars === 3 ? '¡Excelente lectura!' : stars === 2 ? '¡Muy bien!' : '¡Buen trabajo!';
    $('result-title').textContent = title;
    const box = $('result-stats');
    box.innerHTML = '';
    box.appendChild(tile(`${entry.wpm}`, 'ppm'));
    box.appendChild(tile(`${entry.correct}/${entry.total}`, 'comprensión'));
    if (entry.recall.length) box.appendChild(tile(`${entry.recall.filter(r => r.ok).length}/${entry.recall.length}`, 'recordaste'));
    const days = streakInfo().current;
    box.appendChild(tile(`🔥 ${days}`, days === 1 ? 'día de racha' : 'días seguidos'));
    let msg;
    if (levelUp) msg = `¡Subiste al nivel ${data.level}: ${LEVELS[data.level].name}! Los textos serán un poco más largos.`;
    else if (data.level === 'A') msg = `Velocidad efectiva: ${Math.round(entry.wpm * entry.correct / entry.total)} ppm (velocidad × comprensión). La guía queda en ${data.pace} ppm.`;
    else {
      const p = levelProgress(data);
      msg = entry.wpm < p.target
        ? `Para subir de nivel la meta es ${p.target} ppm entendiendo. ¡Cada día lees más fluido!`
        : entry.correct / entry.total < 2 / 3
          ? 'Leíste rápido. Para subir de nivel, lee con calma para entender más.'
          : p.good >= 3 ? '¡Ya lo dominas! Mañana otra buena lectura y subes de nivel.' : `¡Buena lectura! Llevas ${p.good} de 3 para subir de nivel.`;
    }
    $('result-message').textContent = msg;
    const badges = $('result-badges');
    badges.innerHTML = '';
    fresh.forEach(b => badges.appendChild(badgeCard(b, true, '¡Nueva medalla!')));
    lino('home-bubble', title);
    say(`${title} Leíste a ${entry.wpm} palabras por minuto y respondiste ${entry.correct} de ${entry.total}. ${msg}` + (fresh.length ? ` ¡Ganaste la medalla ${fresh[0].name}!` : ''));
    soundWin();
    confetti(levelUp ? 80 : stars === 3 ? 50 : 20);
  }
  $('result-home').addEventListener('click', () => show('home'));

  /* ---------- Ejercicios libres ---------- */

  let stopEx = null;

  function masteryDots(st) {
    const box = el('span', 'mastery');
    box.appendChild(el('span', '', 'Para subir: '));
    for (let i = 0; i < E.STREAK_UP; i++) box.appendChild(el('span', i < st.streak ? 'dot is-on' : 'dot'));
    return box;
  }

  function recentPlays(def, st) {
    const box = el('div', 'recent-plays');
    const list = E.recent(st, 5);
    if (!list.length) { box.appendChild(el('span', 'muted', 'Aquí verás tus marcas.')); return box; }
    box.appendChild(el('span', 'recent-label', 'Tus marcas:'));
    list.forEach(p => box.appendChild(el('span', 'recent-chip' + (p.ok ? ' is-ok' : ''), def.scoreText(p.score) + (p.ok ? ' ✓' : ''))));
    return box;
  }

  function renderExercises() {
    const box = $('ex-list');
    box.innerHTML = '';
    E.GROUPS.forEach(group => {
      const head = el('div', 'games-group');
      head.appendChild(el('span', 'games-group-name', `${group.icon} ${group.name}`));
      head.appendChild(el('span', 'games-group-note', group.note));
      box.appendChild(head);
      E.EXERCISES.filter(def => def.group === group.id).forEach(def => box.appendChild(exerciseCard(def)));
    });
  }

  function exerciseCard(def) {
    const st = data.exercises[def.id];
    const card = el('button', 'game-card');
    card.type = 'button';
    card.appendChild(el('span', 'game-icon', def.icon));
    const info = el('span', 'game-info');
    info.appendChild(el('span', 'game-name', def.name));
    info.appendChild(el('span', 'game-short', def.short));
    info.appendChild(el('span', 'game-record', `${def.skill} · Nivel ${def.levels.indexOf(st.level) + 1} de ${def.levels.length}`));
    info.appendChild(masteryDots(st));
    card.appendChild(info);
    card.addEventListener('click', () => openExercise(def));
    return card;
  }

  function openExercise(def) {
    show('exercise');
    const st = data.exercises[def.id];
    $('ex-title').textContent = `${def.icon} ${def.name}`;
    $('ex-status').textContent = '';
    const board = $('ex-board');
    board.innerHTML = '';
    board.appendChild(el('span', 'game-hero', def.icon));
    board.appendChild(el('span', 'game-level', `Nivel ${def.levels.indexOf(st.level) + 1}: ${def.levelName(st.level)}`));
    board.appendChild(el('span', 'game-goal', `🎯 Meta: ${def.goal(st.level)}`));
    board.appendChild(masteryDots(st));
    board.appendChild(recentPlays(def, st));
    board.appendChild(btn('btn-primary btn-xl', '▶ ¡Jugar!', () => playExercise(def)));
    lino('ex-play-bubble', def.intro());
  }

  function playExercise(def) {
    stopExercise();
    const st = data.exercises[def.id];
    const board = $('ex-board');
    board.innerHTML = '';
    stopEx = E.start(def.id, {
      board, level: st.level, kind: data.kind, sounds: SOUNDS,
      say: (text, mood, speech) => lino('ex-play-bubble', text, mood, speech),
      status: text => { $('ex-status').textContent = text; },
      finish: result => finishExercise(def, result)
    });
  }

  function stopExercise() {
    if (stopEx) stopEx();
    stopEx = null;
  }

  function finishExercise(def, result) {
    stopEx = null;
    const st = data.exercises[def.id];
    const outcome = E.applyResult(def.id, st, result, today());
    const fresh = checkBadges();
    data.stars += result.stars;
    save();
    $('ex-status').textContent = '';
    const board = $('ex-board');
    board.innerHTML = '';
    board.appendChild(el('div', 'stars', '⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars)));
    board.appendChild(el('span', result.ok ? 'game-goal is-ok' : 'game-goal', result.ok ? '🎯 ¡Meta cumplida!' : `🎯 Meta: ${def.goal(st.level)}`));
    if (outcome.record) board.appendChild(el('span', 'game-new-record', '🏆 ¡Tu mejor marca en este nivel!'));
    board.appendChild(el('p', 'game-result-text', result.text));
    board.appendChild(el('p', outcome.change ? 'game-level-change' : 'game-result-text', outcome.message));
    if (!outcome.change) board.appendChild(masteryDots(st));
    board.appendChild(recentPlays(def, st));
    const badges = el('div', 'new-badges');
    fresh.forEach(b => badges.appendChild(badgeCard(b, true, '¡Nueva medalla!')));
    board.appendChild(badges);
    const row = el('div', 'row center');
    row.appendChild(btn('btn-primary btn-xl', '↺ Otra vez', () => playExercise(def)));
    row.appendChild(btn('btn-soft', 'Otros ejercicios', () => show('exercises')));
    board.appendChild(row);
    lino('ex-play-bubble', `${result.stars === 3 ? '¡Increíble!' : result.stars === 2 ? '¡Muy bien!' : '¡Buen trabajo!'} ${result.text} ${outcome.message}`, result.ok ? 'ok' : null);
    soundWin();
    confetti(outcome.change > 0 ? 70 : result.ok ? 35 : 12);
  }
  $('ex-exit').addEventListener('click', () => show('exercises'));

  /* ---------- Lector: biblioteca y texto propio ---------- */

  let reader = null;

  function renderLibrary() {
    $('own-text').value = data.ownText || '';
    $('own-mode').value = data.settings.reread;
    $('own-wpm').value = data.pace || targetWpm(data);
    const levels = data.level === 'A' ? ['A'] : KID_LEVELS.filter(l => l <= data.level);
    $('library-note').textContent = data.level === 'A'
      ? 'Toca un texto para leerlo con tu modo de relectura.'
      : 'Los textos de tu nivel y de los anteriores. Releer los que ya conoces ayuda a leer con fluidez.';
    const list = $('library-list');
    list.innerHTML = '';
    levels.slice().reverse().forEach(level => {
      textsOf(level).forEach(t => {
        const li = el('li');
        const b = el('button', 'library-item');
        b.type = 'button';
        b.appendChild(el('span', 'library-emoji', t.emoji));
        const info = el('span', 'library-info');
        info.appendChild(el('b', '', t.title));
        const reads = data.reads[t.id] || 0;
        info.appendChild(el('span', 'muted', `${level === 'A' ? 'Adultos' : `Nivel ${level}`} · ${L.countWords(t.text)} palabras · ${reads ? `leído ${reads} ${reads === 1 ? 'vez' : 'veces'}` : 'sin leer'}`));
        b.appendChild(info);
        b.addEventListener('click', () => openReader(t.title, t.text, data.settings.reread, data.pace || targetWpm(data), data.settings.reread === 'guia' ? LEVELS[data.level].chunk : 1));
        li.appendChild(b);
        list.appendChild(li);
      });
    });
    if (data.level !== 'A' && data.level < 6) list.appendChild(el('li', 'muted library-more', `🔒 Al subir de nivel se abren ${textsOf(data.level + 1).length} textos nuevos.`));
  }

  $('own-go').addEventListener('click', () => {
    const text = $('own-text').value.trim();
    if (L.countWords(text) < 3) { $('own-text').focus(); return; }
    data.ownText = text.slice(0, 20000);
    save();
    const wpm = Math.max(40, Math.min(1000, parseInt($('own-wpm').value, 10) || 250));
    openReader('Mi texto', text, $('own-mode').value, wpm, parseInt($('own-chunk').value, 10) || 1);
  });

  function openReader(title, text, mode, wpm, chunk) {
    show('reader');
    $('reader-title').textContent = title;
    reader = { title, text, mode, wpm, chunk, ctrl: null };
    startReader();
  }

  function startReader() {
    const r = reader;
    const box = $('reader-stage');
    box.innerHTML = '';
    $('reader-wpm').textContent = `${r.wpm} ppm`;
    $('reader-pause').textContent = '⏸️';
    $('reader-back').hidden = r.mode !== 'rsvp';
    $('reader-controls').hidden = r.mode === 'eco';
    $('reader-wpm').hidden = r.mode === 'eco';
    const onEnd = () => {
      $('reader-controls').hidden = true;
      const end = el('div', 'reader-end center-text');
      end.appendChild(el('p', 'q-text', '¡Terminaste! 🎉'));
      end.appendChild(el('p', 'muted', r.mode === 'eco' ? `${L.countWords(r.text)} palabras leídas en eco con Lino.` : `${L.countWords(r.text)} palabras a ${r.wpm} ppm.`));
      const row = el('div', 'row center');
      row.appendChild(btn('btn-primary', '↺ Otra vez', startReader));
      row.appendChild(btn('btn-soft', 'Salir', () => show('library')));
      end.appendChild(row);
      box.appendChild(end);
      soundWin();
    };
    if (r.mode === 'eco') {
      const card = el('article', 'reading-card' + (kid() ? ' kid' : ''));
      const body = el('div', 'reading-text');
      card.appendChild(body);
      box.appendChild(card);
      const note = el('p', 'muted center-text echo-note', hasVoice() ? '🔊 Escucha a Lino y lee la frase después de él.' : 'Sin voz en español: un adulto lee cada frase primero.');
      box.insertBefore(note, card);
      r.ctrl = L.eco(body, r.text, {
        speak: text => { note.textContent = '🔊 Escucha…'; return speakWait(text); },
        turn: (k, n) => echoTurn(box, k, n, msg => { note.textContent = msg; }),
        onEnd: () => { note.textContent = ''; onEnd(); }
      });
    } else if (r.mode === 'rsvp') {
      const word = el('div', 'rsvp-word');
      const bar = el('div', 'rsvp-bar');
      const fill = el('span');
      bar.appendChild(fill);
      box.appendChild(word);
      box.appendChild(bar);
      r.ctrl = L.rsvp(word, r.text, { wpm: r.wpm, chunk: r.chunk, onEnd, onProgress: (i, n) => { fill.style.width = `${(i / n) * 100}%`; } });
    } else {
      const card = el('article', 'reading-card' + (kid() ? ' kid' : ''));
      const body = el('div', 'reading-text');
      card.appendChild(body);
      box.appendChild(card);
      r.ctrl = L.guide(body, r.text, { wpm: r.wpm, chunk: r.chunk, onEnd });
    }
  }

  function stopReader() {
    if (reader && reader.ctrl) reader.ctrl.stop();
    $('reader-wpm').hidden = false;
    reader = null;
  }

  function changeReaderWpm(factor) {
    if (!reader || !reader.ctrl.setWpm) return;
    reader.wpm = Math.max(40, Math.min(1000, Math.round((reader.wpm * factor) / 10) * 10));
    reader.ctrl.setWpm(reader.wpm);
    $('reader-wpm').textContent = `${reader.wpm} ppm`;
  }
  $('reader-slower').addEventListener('click', () => changeReaderWpm(0.9));
  $('reader-faster').addEventListener('click', () => changeReaderWpm(1.1));
  $('reader-back').addEventListener('click', () => { if (reader && reader.ctrl.back) { reader.ctrl.back(); $('reader-pause').textContent = '⏸️'; } });
  $('reader-pause').addEventListener('click', () => {
    if (!reader || !reader.ctrl.pause) return;
    if (reader.ctrl.paused) { reader.ctrl.resume(); $('reader-pause').textContent = '⏸️'; } else { reader.ctrl.pause(); $('reader-pause').textContent = '▶'; }
  });
  $('reader-exit').addEventListener('click', () => show('library'));

  /* ---------- Progreso ---------- */

  function renderProgress() {
    const prog = levelProgress(data);
    $('progress-speed-note').textContent = data.sessions.length
      ? `${levelLabel(data.level)}. Meta de este nivel: ${prog.target} ppm ${data.settings.readMode === 'voz' ? 'en voz alta' : 'en silencio'}, entendiendo.`
      : 'Después de la primera sesión verás aquí cómo sube tu velocidad.';
    chart($('progress-chart'), 30);
    renderStats($('progress-stats'), false);
    $('progress-level').textContent = data.level === 'A'
      ? `Guía actual: ${data.pace || '—'} ppm. Velocidad efectiva = velocidad × comprensión: subir rápido sin entender no cuenta.`
      : `Para subir de nivel: 3 lecturas seguidas con 2 de 3 preguntas o más y ${prog.target} ppm (llevas ${prog.good}), en al menos 2 días. Guía actual: ${data.pace || '—'} ppm.`;
    const badges = $('progress-badges');
    badges.innerHTML = '';
    BADGES.forEach(b => badges.appendChild(badgeCard(b, !!data.badges[b.id])));
    $('progress-exercises').textContent = E.EXERCISES.map(def => {
      const st = data.exercises[def.id];
      const last = E.recent(st, 3).map(p => def.scoreText(p.score)).join(', ');
      return `${def.name}: nivel ${def.levels.indexOf(st.level) + 1} (${def.levelName(st.level)}), ${st.streak} de ${E.STREAK_UP} seguidas en la meta` + (last ? `, últimas: ${last}` : '');
    }).join(' · ');
    const body = $('norms-body');
    body.innerHTML = '';
    NORMS.forEach(([grade, aloud, silent]) => {
      const tr = el('tr');
      tr.appendChild(el('td', '', grade));
      tr.appendChild(el('td', '', `${aloud}`));
      tr.appendChild(el('td', '', `${silent}`));
      body.appendChild(tr);
    });
  }

  /* ---------- Ajustes ---------- */

  let gateAnswer = 0;
  let gateOpen = false;

  function renderSettings() {
    const needsGate = kid() && !gateOpen;
    $('gate').hidden = !needsGate;
    $('settings-body').hidden = needsGate;
    if (needsGate) {
      const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
      gateAnswer = a * b;
      $('gate-question').textContent = `${a} × ${b}`;
      $('gate-answer').value = '';
      return;
    }
    const list = $('profile-list');
    list.innerHTML = '';
    Object.values(store.profiles).forEach(p => {
      const li = el('li', 'profile' + (p.id === data.id ? ' is-current' : ''));
      li.appendChild(el('span', 'who-avatar', p.avatar));
      const info = el('span', 'profile-info');
      info.appendChild(el('b', '', p.name));
      info.appendChild(el('span', 'muted', `${p.kind === 'adulto' ? 'Adulto' : `Niño/a · nivel ${p.level}`} · ${p.sessions.length} sesiones`));
      li.appendChild(info);
      if (p.id !== data.id) li.appendChild(btn('btn-soft', 'Usar', () => { useProfile(p.id); renderSettings(); }));
      else li.appendChild(el('span', 'chip', 'Ahora'));
      list.appendChild(li);
    });
    $('settings-who').textContent = `Ajustes de ${data.name}`;
    const level = $('set-level');
    level.innerHTML = '';
    (data.kind === 'adulto' ? ['A'] : KID_LEVELS).forEach(l => {
      const o = el('option', '', levelLabel(l));
      o.value = l;
      level.appendChild(o);
    });
    level.value = data.level;
    level.disabled = data.kind === 'adulto';
    $('set-read-mode').value = data.settings.readMode;
    $('set-reread').value = data.settings.reread;
    $('set-pace').value = data.pace || '';
    $('set-pace').placeholder = 'Se calcula en la 1.ª sesión';
    $('set-voice').checked = data.settings.voice;
    $('settings-pace-note').textContent = `La guía arranca un 15 % más rápido que su primera lectura. Sube 5 % cuando entiende y la sigue cómoda, sube 10 % si le pareció lenta y baja 10 % si fue muy rápida.`;
  }

  $('gate-go').addEventListener('click', () => {
    if (parseInt($('gate-answer').value, 10) === gateAnswer) { gateOpen = true; renderSettings(); } else { $('gate-answer').value = ''; $('gate-answer').focus(); }
  });
  $('gate-answer').addEventListener('keydown', e => { if (e.key === 'Enter') $('gate-go').click(); });

  $('set-level').addEventListener('change', e => {
    data.level = e.target.value === 'A' ? 'A' : parseInt(e.target.value, 10);
    data.today = null;
    save();
  });
  $('set-read-mode').addEventListener('change', e => { data.settings.readMode = e.target.value; save(); });
  $('set-reread').addEventListener('change', e => { data.settings.reread = e.target.value; save(); });
  $('set-pace').addEventListener('change', e => {
    const v = parseInt(e.target.value, 10);
    data.pace = v ? clampPace(v) : null;
    e.target.value = data.pace || '';
    save();
  });
  $('set-voice').addEventListener('change', e => { data.settings.voice = e.target.checked; save(); });
  $('profile-add').addEventListener('click', () => { welcome = { avatar: AVATARS[0], kind: 'nino', level: 2 }; show('welcome'); });
  $('profile-delete').addEventListener('click', () => {
    if (!window.confirm(`¿Borrar a ${data.name} y todo su progreso? No se puede deshacer.`)) return;
    delete store.profiles[data.id];
    const rest = Object.keys(store.profiles);
    data = null;
    store.current = null;
    if (rest.length) useProfile(rest[0]); else save();
    gateOpen = false;
    show(data ? 'settings' : 'welcome');
  });

  $('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(store, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mi-lectura-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('import-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then(txt => {
      const saved = JSON.parse(txt);
      if (!saved || !saved.profiles) throw new Error('formato');
      store = saved;
      const id = store.current && store.profiles[store.current] ? store.current : Object.keys(store.profiles)[0];
      if (id) useProfile(id);
      save();
      show('home');
    }).catch(() => window.alert('Ese archivo no es una copia de Mi Lectura.'));
    e.target.value = '';
  });

  /* ---------- Arranque ---------- */

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => { /* sin modo sin conexión */ });
  }

  if (store.current && store.profiles[store.current]) useProfile(store.current);
  show(data ? 'home' : 'welcome');
})();
