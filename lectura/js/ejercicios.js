/*
 * Mi Lectura – ejercicios de rango visual, atención y memoria.
 *
 *   Palabras relámpago     una palabra o frase aparece un instante (taquistoscopio)
 *   Ojos de búho           mirar el punto y ver las letras de los lados (campo visual)
 *   Busca la palabra       encontrar todas las veces que aparece una palabra (escaneo)
 *   Palabras para recordar ver unas palabras y reconocerlas después (memoria)
 *   Ordena la historia     poner en orden lo que pasó en el texto (retención)
 *
 * Como en los juegos de Mi Ábaco, cada ejercicio tiene niveles. El nivel solo
 * sube con dominio: al menos MIN_PLAYS partidas en ese nivel y las últimas
 * STREAK_UP dentro de la meta, en MIN_DAYS días distintos. Baja si hay
 * HARD_DOWN partidas seguidas muy difíciles.
 */
(function (global) {
  'use strict';

  const P = global.Palabras;
  const MIN_PLAYS = 4;
  const STREAK_UP = 3;
  const HARD_DOWN = 3;
  const MIN_DAYS = 2;
  const higher = (a, b) => a > b;
  const lower = (a, b) => a < b;

  // Palabras relámpago: qué se muestra y cuánto tiempo (ms).
  const FLASH = {
    1: { words: 1, min: 3, max: 4, ms: 800 },
    2: { words: 1, min: 4, max: 5, ms: 600 },
    3: { words: 1, min: 5, max: 6, ms: 500 },
    4: { words: 1, min: 6, max: 9, ms: 400 },
    5: { words: 2, ms: 450 },
    6: { words: 3, ms: 450 },
    7: { words: 3, ms: 300 },
    8: { words: 4, ms: 300 }
  };
  // Ojos de búho: distancia al punto (fracción de media pantalla) y tiempo.
  const SPAN = {
    1: { d: 0.18, ms: 450, syl: false },
    2: { d: 0.28, ms: 400, syl: false },
    3: { d: 0.38, ms: 400, syl: false },
    4: { d: 0.5, ms: 350, syl: false },
    5: { d: 0.5, ms: 350, syl: true },
    6: { d: 0.65, ms: 300, syl: true },
    7: { d: 0.8, ms: 300, syl: true }
  };
  // Busca la palabra: casillas, largo de palabras, veces que aparece y segundos por tablero.
  const SEARCH = {
    1: { cells: 9, cols: 3, min: 3, max: 4, hits: 2, sec: 8 },
    2: { cells: 12, cols: 3, min: 4, max: 5, hits: 3, sec: 11 },
    3: { cells: 16, cols: 4, min: 4, max: 6, hits: 3, sec: 14 },
    4: { cells: 20, cols: 4, min: 5, max: 7, hits: 3, sec: 17 },
    5: { cells: 25, cols: 5, min: 5, max: 8, hits: 4, sec: 22 },
    6: { cells: 30, cols: 5, min: 6, max: 9, hits: 4, sec: 27 }
  };
  const SEARCH_ROUNDS = 3;

  const EXERCISES = [
    {
      id: 'relampago', icon: '⚡', name: 'Palabras relámpago', skill: 'Rapidez visual',
      short: 'Una palabra aparece un instante: ¿cuál era?',
      levels: [1, 2, 3, 4, 5, 6, 7, 8], start: { nino: 1, adulto: 5 }, rounds: 8, need: 7, better: higher,
      levelName: l => FLASH[l].words === 1 ? `palabras de ${FLASH[l].min} a ${FLASH[l].max} letras` : `frases de ${FLASH[l].words} palabras`,
      levelShort: l => `Nivel ${l}`,
      goal: () => 'acertar 7 de 8',
      scoreText: s => `${s} de 8`,
      intro: () => 'Mira la cruz del centro. Una palabra va a aparecer muy rápido y se va a tapar. Después elige cuál era.'
    },
    {
      id: 'buho', icon: '🦉', name: 'Ojos de búho', skill: 'Campo visual',
      short: 'Mira el punto y descubre las letras de los lados.',
      levels: [1, 2, 3, 4, 5, 6, 7], start: { nino: 1, adulto: 3 }, rounds: 8, need: 6, better: higher,
      levelName: l => `${SPAN[l].syl ? 'sílabas' : 'letras'} a ${['', 'muy poca', 'poca', 'media', 'buena', 'buena', 'mucha', 'muchísima'][l]} distancia`,
      levelShort: l => `Nivel ${l}`,
      goal: () => 'acertar 6 de 8',
      scoreText: s => `${s} de 8`,
      intro: () => 'Mira solo el punto del centro, sin mover los ojos. A los lados van a aparecer dos letras. ¿Cuáles eran?'
    },
    {
      id: 'busca', icon: '🔍', name: 'Busca la palabra', skill: 'Atención',
      short: 'Encuentra todas las veces que aparece una palabra.',
      levels: [1, 2, 3, 4, 5, 6], start: { nino: 1, adulto: 4 }, better: lower,
      levelName: l => `tableros de ${SEARCH[l].cells} palabras`,
      levelShort: l => `Nivel ${l}`,
      goal: l => `terminar los ${SEARCH_ROUNDS} tableros en ${SEARCH[l].sec * SEARCH_ROUNDS} segundos o menos, con máximo 1 error`,
      scoreText: s => `${s} s`,
      intro: () => 'Arriba verás una palabra. Toca todas las veces que aparece en el tablero, lo más rápido que puedas.'
    },
    {
      id: 'recuerda', icon: '🧠', name: 'Palabras para recordar', skill: 'Memoria',
      short: 'Mira unas palabras, guárdalas y encuéntralas.',
      levels: [3, 4, 5, 6, 7, 8], start: { nino: 3, adulto: 5 }, rounds: 3, need: 2, better: higher,
      levelName: l => `${l} palabras`,
      levelShort: l => `${l} palabras`,
      goal: () => 'recordar todas las palabras en 2 de 3 rondas',
      scoreText: s => `${s} de 3`,
      intro: () => 'Vas a ver unas palabras. Léelas y guárdalas en tu memoria. Cuando se escondan, toca las que viste.'
    }
  ];
  const BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]));

  /* ---------- Niveles, registro y dominio ---------- */

  function normalize(id, st, kind) {
    const def = BY_ID[id];
    if (st && st.v === 1) return st;
    return { v: 1, level: def.start[kind] || def.start.nino, count: 0, streak: 0, streakDays: [], hard: 0, best: {}, plays: [] };
  }

  function stepLevel(def, level, dir) {
    const i = def.levels.indexOf(level);
    return def.levels[Math.max(0, Math.min(def.levels.length - 1, i + dir))];
  }

  // Registra una partida y decide si el nivel sube, baja o se mantiene.
  function applyResult(id, st, result, date) {
    const def = BY_ID[id];
    const level = st.level;
    st.count++;
    st.streak = result.ok ? st.streak + 1 : 0;
    st.streakDays = result.ok ? Array.from(new Set((st.streakDays || []).concat(date))) : [];
    st.hard = result.stars === 1 ? st.hard + 1 : 0;
    const prev = st.best[level];
    const record = !result.noRecord && (prev === undefined || def.better(result.score, prev));
    if (record) st.best[level] = result.score;
    st.plays = st.plays.concat({ date, level, score: result.score, ok: result.ok, stars: result.stars }).slice(-40);

    let change = 0;
    const last = def.levels[def.levels.length - 1];
    const mastered = st.count >= MIN_PLAYS && st.streak >= STREAK_UP && st.streakDays.length >= MIN_DAYS;
    if (mastered && level < last) change = 1;
    else if (st.hard >= HARD_DOWN && level > def.levels[0]) change = -1;
    if (change) {
      st.level = stepLevel(def, level, change);
      Object.assign(st, { count: 0, streak: 0, streakDays: [], hard: 0 });
    }

    let message;
    if (change > 0) message = `¡Dominaste este nivel! La próxima vez: ${def.levelName(st.level)}.`;
    else if (change < 0) message = `Para ganar confianza, la próxima vez practicamos con ${def.levelName(st.level)}.`;
    else if (result.ok && st.streak >= STREAK_UP && st.streakDays.length < MIN_DAYS) message = 'Hoy ya lo dominas. ¡Si mañana también lo logras, subes de nivel!';
    else if (result.ok && st.streak >= STREAK_UP && level < last) message = 'Ya lo dominas. Unas partidas más y subes de nivel.';
    else if (result.ok && st.streak >= STREAK_UP) message = '¡Lo dominas! Sigue así para mejorar tu marca.';
    else if (result.ok) message = `¡Meta cumplida! Llevas ${st.streak} de ${STREAK_UP} seguidas.`;
    else message = `La meta es ${def.goal(level)}. ¡Tú puedes!`;
    return { change, record: record && prev !== undefined, message };
  }

  function recent(st, n) {
    return st.plays.filter(p => p.level === st.level).slice(-(n || 5));
  }

  /* ---------- Utilidades ---------- */

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const pick = list => list[Math.floor(Math.random() * list.length)];

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function button(cls, text) {
    const b = el('button', cls, text);
    b.type = 'button';
    return b;
  }

  // Espera a que toque uno de los botones; devuelve su índice.
  function tap(buttons) {
    return new Promise(resolve => buttons.forEach((b, i) => b.addEventListener('click', () => resolve(i), { once: true })));
  }

  function roundStars(def, score) {
    return score >= def.need ? 3 : score >= Math.ceil(def.rounds * 0.6) ? 2 : 1;
  }

  function lifecycle() {
    let alive = true;
    const timers = new Set();
    return {
      get alive() { return alive; },
      wait(ms) {
        return new Promise(resolve => {
          const t = setTimeout(() => { timers.delete(t); if (alive) resolve(); }, ms);
          timers.add(t);
        });
      },
      stop() { alive = false; timers.forEach(clearTimeout); timers.clear(); }
    };
  }

  // Las palabras más parecidas a una dada (para que haya que mirar con cuidado).
  function similarWords(word, pool, n) {
    const others = shuffle(pool.filter(w => w !== word)).slice(0, 40);
    return others.sort((a, b) => P.similarity(word, b) - P.similarity(word, a)).slice(0, n);
  }

  // Frase de 2, 3 o 4 palabras que concuerda en género: «la nube», «el oso grande», «una flor muy bonita».
  function phrase(words, parts) {
    const [noun, g] = parts ? parts.noun : pick(P.NOUNS);
    const adj = parts ? parts.adj : pick(P.ADJECTIVES);
    const def = parts ? parts.def : Math.random() < 0.5;
    const art = def ? (g === 'm' ? 'el' : 'la') : (g === 'm' ? 'un' : 'una');
    const a = adj[g === 'm' ? 0 : 1];
    const text = words === 2 ? `${art} ${noun}` : words === 3 ? `${art} ${noun} ${a}` : `${art} ${noun} muy ${a}`;
    return { text, parts: { noun: [noun, g], adj, def } };
  }

  // Otras frases que cambian solo una parte (el nombre o el adjetivo).
  function similarPhrases(base, words, n) {
    const out = new Set();
    for (let k = 0; k < 60 && out.size < n; k++) {
      const parts = { noun: base.parts.noun, adj: base.parts.adj, def: base.parts.def };
      const change = words === 2 ? 'noun' : pick(['noun', 'adj', 'noun']);
      if (change === 'noun') {
        const [, g] = base.parts.noun;
        const same = P.NOUNS.filter(x => x[1] === g && x[0] !== base.parts.noun[0]);
        parts.noun = same.sort((a, b) => P.similarity(base.parts.noun[0], b[0]) - P.similarity(base.parts.noun[0], a[0]))[Math.floor(Math.random() * 6)];
      } else {
        parts.adj = pick(P.ADJECTIVES.filter(x => x !== base.parts.adj));
      }
      const text = phrase(words, parts).text;
      if (text !== base.text) out.add(text);
    }
    return [...out];
  }

  // Botones de opciones; devuelve el texto elegido y marca bien o mal.
  async function choose(env, life, options, right) {
    const grid = el('div', 'choice-grid' + (options.some(o => o.length > 12) ? ' wide' : ''));
    const buttons = options.map(o => {
      const b = button('choice', o);
      grid.appendChild(b);
      return b;
    });
    env.board.appendChild(grid);
    const i = await tap(buttons);
    if (!life.alive) return null;
    buttons.forEach(b => { b.disabled = true; });
    const ok = options[i] === right;
    buttons[i].classList.add(ok ? 'is-ok' : 'is-wrong');
    if (!ok) buttons[options.indexOf(right)].classList.add('is-ok');
    return ok;
  }

  /* ---------- Palabras relámpago (taquistoscopio) ---------- */

  async function relampago(env, life) {
    const def = BY_ID.relampago;
    const spec = FLASH[env.level];
    let score = 0;
    let prev = null;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      env.status(`${round} de ${def.rounds}`);
      let target, options;
      if (spec.words === 1) {
        const pool = P.byLength(spec.min, spec.max);
        do { target = pick(pool); } while (target === prev);
        options = shuffle([target].concat(similarWords(target, P.WORDS.filter(w => Math.abs(P.len(w) - P.len(target)) <= 1), 3)));
      } else {
        const base = phrase(spec.words);
        target = base.text;
        options = shuffle([target].concat(similarPhrases(base, spec.words, 3)));
      }
      prev = target;
      env.board.innerHTML = '';
      const stage = el('div', 'flash-stage');
      const shown = el('p', 'flash-word', '+');
      stage.appendChild(shown);
      env.board.appendChild(stage);
      if (round === 1) env.say('Mira la cruz…', null, '');
      await life.wait(700);
      shown.textContent = target;
      env.sounds.tick();
      await life.wait(spec.ms);
      // Máscara: tapa la imagen para que no quede en los ojos.
      shown.textContent = '#'.repeat(Math.min(14, target.length + 2));
      shown.classList.add('is-mask');
      await life.wait(250);
      shown.textContent = '?';
      shown.classList.remove('is-mask');
      env.say('¿Cuál era?', null, '');
      const ok = await choose(env, life, options, target);
      if (ok === null) return;
      if (ok) { score++; env.sounds.ok(); env.say('¡Ojo de águila!', 'ok', ''); } else { env.sounds.bad(); env.say(`Era «${target}».`, 'try', ''); }
      await life.wait(ok ? 700 : 1500);
    }
    if (!life.alive) return;
    env.finish({ score, ok: score >= def.need, stars: roundStars(def, score), text: `Acertaste ${score} de ${def.rounds}.` });
  }

  /* ---------- Ojos de búho (campo visual) ---------- */

  async function buho(env, life) {
    const def = BY_ID.buho;
    const spec = SPAN[env.level];
    const items = spec.syl ? P.SYLLABLES : P.LETTERS;
    let score = 0;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      env.status(`${round} de ${def.rounds}`);
      const left = pick(items);
      let right;
      do { right = pick(items); } while (right === left);
      const pair = `${left} · ${right}`;
      const options = new Set([pair]);
      while (options.size < 4) {
        const l = Math.random() < 0.5 ? left : pick(items);
        const r = l === left ? pick(items) : (Math.random() < 0.5 ? right : pick(items));
        if (l !== r) options.add(`${l} · ${r}`);
      }
      env.board.innerHTML = '';
      const field = el('div', 'span-field');
      const dot = el('span', 'span-dot');
      const L = el('span', 'span-item', '');
      const R = el('span', 'span-item', '');
      L.style.left = `${50 - spec.d * 50}%`;
      R.style.left = `${50 + spec.d * 50}%`;
      field.appendChild(L);
      field.appendChild(dot);
      field.appendChild(R);
      env.board.appendChild(field);
      if (round === 1) env.say('Mira el punto…', null, '');
      await life.wait(900);
      L.textContent = left;
      R.textContent = right;
      env.sounds.tick();
      await life.wait(spec.ms);
      L.textContent = '#';
      R.textContent = '#';
      await life.wait(200);
      L.textContent = '';
      R.textContent = '';
      env.say('¿Qué viste a los lados?', null, '');
      const ok = await choose(env, life, shuffle([...options]), pair);
      if (ok === null) return;
      if (ok) { score++; env.sounds.ok(); env.say('¡Ojos de búho!', 'ok', ''); } else { env.sounds.bad(); env.say(`Eran ${left} y ${right}.`, 'try', ''); }
      await life.wait(ok ? 700 : 1500);
    }
    if (!life.alive) return;
    env.finish({ score, ok: score >= def.need, stars: roundStars(def, score), text: `Acertaste ${score} de ${def.rounds}.` });
  }

  /* ---------- Busca la palabra (atención y escaneo) ---------- */

  async function busca(env, life) {
    const spec = SEARCH[env.level];
    let ms = 0;
    let errors = 0;
    for (let round = 1; round <= SEARCH_ROUNDS && life.alive; round++) {
      env.status(`${round} de ${SEARCH_ROUNDS}`);
      const pool = P.byLength(spec.min, spec.max);
      const target = pick(pool);
      const fillers = similarWords(target, pool, Math.min(8, pool.length - 1));
      const cells = [];
      for (let i = 0; i < spec.hits; i++) cells.push(target);
      while (cells.length < spec.cells) cells.push(pick(fillers));
      env.board.innerHTML = '';
      const head = el('p', 'search-target');
      head.appendChild(el('span', 'muted', 'Busca: '));
      head.appendChild(el('b', '', target));
      env.board.appendChild(head);
      const grid = el('div', 'search-grid');
      grid.style.gridTemplateColumns = `repeat(${spec.cols}, 1fr)`;
      env.board.appendChild(grid);
      let found = 0;
      const start = Date.now();
      await new Promise(resolve => {
        shuffle(cells).forEach(word => {
          const b = button('search-cell', word);
          b.addEventListener('click', () => {
            if (!life.alive || b.disabled) return;
            if (word === target) {
              b.disabled = true;
              b.classList.add('is-found');
              env.sounds.tick();
              if (++found === spec.hits) resolve();
            } else {
              errors++;
              env.sounds.bad();
              b.classList.remove('is-wrong');
              void b.offsetWidth;
              b.classList.add('is-wrong');
            }
          });
          grid.appendChild(b);
        });
        const tick = () => {
          if (!life.alive || found === spec.hits) return;
          env.status(`${round} de ${SEARCH_ROUNDS} · ${Math.round((ms + Date.now() - start) / 1000)} s`);
          life.wait(500).then(tick);
        };
        tick();
      });
      if (!life.alive) return;
      ms += Date.now() - start;
      env.sounds.ok();
      env.say(round < SEARCH_ROUNDS ? '¡Las encontraste todas! Otra…' : '¡Listo!', 'ok', '');
      await life.wait(800);
    }
    if (!life.alive) return;
    const secs = Math.max(1, Math.round(ms / 1000));
    const goal = spec.sec * SEARCH_ROUNDS;
    const ok = secs <= goal && errors <= 1;
    env.finish({
      score: secs, ok, stars: ok ? 3 : secs <= goal * 1.5 && errors <= 3 ? 2 : 1, noRecord: errors > 1,
      text: `Terminaste en ${secs} ${secs === 1 ? 'segundo' : 'segundos'}` + (errors ? ` con ${errors} ${errors === 1 ? 'error' : 'errores'}.` : ' sin errores.')
    });
  }

  /* ---------- Palabras para recordar (memoria) ---------- */

  async function recuerda(env, life) {
    const def = BY_ID.recuerda;
    const n = env.level;
    let score = 0;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      env.status(`${round} de ${def.rounds}`);
      const pool = shuffle(P.byLength(3, env.kind === 'adulto' ? 9 : 6));
      const words = pool.slice(0, n);
      const others = pool.slice(n, n * 2);
      env.board.innerHTML = '';
      env.board.appendChild(el('p', 'game-target', 'Guarda estas palabras:'));
      const list = el('div', 'memory-list');
      words.forEach(w => list.appendChild(el('span', 'memory-word', w)));
      env.board.appendChild(list);
      env.say('¡Léelas y guárdalas!', null, '');
      await life.wait((env.kind === 'adulto' ? 900 : 1500) * n + 1000);
      if (!life.alive) return;
      env.board.innerHTML = '';
      env.board.appendChild(el('p', 'game-target', `Toca las ${n} palabras que viste`));
      const grid = el('div', 'choice-grid memory-grid');
      env.board.appendChild(grid);
      env.say('¿Cuáles viste?', null, '');
      const chosen = new Set();
      let wrong = 0;
      await new Promise(resolve => {
        shuffle(words.concat(others)).forEach(w => {
          const b = button('choice', w);
          b.addEventListener('click', () => {
            if (!life.alive || b.disabled) return;
            b.disabled = true;
            if (words.includes(w)) { chosen.add(w); b.classList.add('is-ok'); env.sounds.tick(); } else { wrong++; b.classList.add('is-wrong'); env.sounds.bad(); }
            if (chosen.size + wrong >= n) resolve();
          });
          grid.appendChild(b);
        });
      });
      if (!life.alive) return;
      const perfect = chosen.size === n && !wrong;
      if (perfect) { score++; env.sounds.ok(); env.say('¡Memoria de elefante!', 'ok', ''); } else { env.say(`Recordaste ${chosen.size} de ${n}.`, 'try', ''); }
      grid.querySelectorAll('.choice').forEach(b => { if (words.includes(b.textContent)) b.classList.add('is-ok'); b.disabled = true; });
      await life.wait(perfect ? 900 : 2000);
    }
    if (!life.alive) return;
    env.finish({ score, ok: score >= def.need, stars: roundStars(def, score), text: `Recordaste todas en ${score} de ${def.rounds} rondas.` });
  }

  /* ---------- Ordena la historia (en la sesión, con el texto del día) ---------- */

  // Toca los sucesos en orden. Devuelve la cantidad de errores.
  function ordena(env, life, events) {
    return new Promise(resolve => {
      env.board.innerHTML = '';
      env.board.appendChild(el('p', 'game-target', '¿Qué pasó primero?'));
      const list = el('ol', 'order-list');
      env.board.appendChild(list);
      const grid = el('div', 'order-options');
      env.board.appendChild(grid);
      let next = 0;
      let errors = 0;
      shuffle(events.map((e, i) => ({ e, i }))).forEach(({ e, i }) => {
        const b = button('choice order-choice', e);
        b.addEventListener('click', () => {
          if (!life.alive || b.disabled) return;
          if (i === next) {
            b.disabled = true;
            b.classList.add('is-hidden');
            list.appendChild(el('li', 'order-item', e));
            env.sounds.tick();
            next++;
            if (next === events.length) resolve(errors);
            else env.say(next === events.length - 1 ? '¿Y al final?' : '¿Y después?', null, '');
          } else {
            errors++;
            env.sounds.bad();
            b.classList.remove('is-wrong');
            void b.offsetWidth;
            b.classList.add('is-wrong');
          }
        });
        grid.appendChild(b);
      });
    });
  }

  const ENGINES = { relampago, buho, busca, recuerda };

  // Arranca un ejercicio en el nivel indicado. Devuelve una función para detenerlo.
  function start(id, env) {
    const life = lifecycle();
    ENGINES[id](env, life);
    return () => life.stop();
  }

  // Ejercicio sugerido del día (rango visual y atención; la memoria va al final).
  function warmupOfDay(dayNumber) {
    const list = ['relampago', 'buho', 'busca'];
    return BY_ID[list[((dayNumber % list.length) + list.length) % list.length]];
  }

  global.Ejercicios = {
    EXERCISES, BY_ID, MIN_PLAYS, STREAK_UP, HARD_DOWN, MIN_DAYS,
    start, normalize, applyResult, recent, warmupOfDay, ordena, lifecycle, shuffle
  };
})(window);
