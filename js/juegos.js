/*
 * Ábaco – juegos para después de practicar.
 *
 * Con el ábaco físico (la app dicta o muestra, cronometra y revisa):
 *   Pon el número      ver un número y ponerlo rápido en su ábaco
 *   Escucha y calcula  Mapi dicta una cuenta en cadena y ella la hace en su ábaco
 *   Mira y calcula     los números aparecen uno por uno y los va sumando en su ábaco
 *
 * De concentración y memoria (solo en pantalla):
 *   Tabla de Schulte   encontrar los números en orden (atención y rapidez visual)
 *   Recuerda el número ver un número unos segundos y escribirlo (memoria de trabajo)
 *   Recuerda el ábaco  ver un número en el ábaco y decir cuál era (anzan, visualizar)
 *   Luces en orden     repetir el orden en que se encienden bloques (bloques de Corsi)
 *
 * Cada juego tiene niveles, como la ruta del ábaco. Una partida se juega siempre
 * en el nivel actual y queda registrada. El nivel solo sube cuando hay dominio:
 * al menos MIN_PLAYS partidas en ese nivel y las últimas STREAK_UP dentro de la
 * meta, logradas en al menos MIN_DAYS días distintos (que no sea una racha de
 * una sola tarde). Si hay HARD_DOWN partidas seguidas muy difíciles, baja un
 * nivel para no frustrar.
 */
(function (global) {
  'use strict';

  const MIN_PLAYS = 4;
  const STREAK_UP = 3;
  const HARD_DOWN = 3;
  const MIN_DAYS = 2;

  const SCHULTE_GOAL = { 3: 20, 4: 40, 5: 70 };
  // Segundos para poner los 8 números (solo cuenta el tiempo hasta tocar «¡Listo!»).
  const PONER_GOAL = { 1: 45, 2: 70, 3: 100 };
  // Tiempo para mover las bolitas después de cada número de una cuenta en cadena.
  const CHAIN_PAUSE = 2600;
  const lower = (a, b) => a < b;
  const higher = (a, b) => a > b;

  const GROUPS = [
    { id: 'abaco', icon: '🧮', name: 'Con tu ábaco', note: 'Ten tu ábaco a la mano: aquí calculas con tus dedos.' },
    { id: 'mente', icon: '🧠', name: 'Atención y memoria', note: 'Solo con tus ojos y tu cabeza.' }
  ];

  // from: nivel de la ruta desde el que se abre el juego.
  const GAMES = [
    {
      id: 'poner', group: 'abaco', icon: '✋', name: 'Pon el número', short: 'Mira el número y ponlo rápido en tu ábaco.',
      levels: [1, 2, 3], start: 1, rounds: 8, need: 7, better: lower,
      levelName: l => (l === 1 ? 'números de 1 cifra' : `números de ${l} cifras`),
      levelShort: l => (l === 1 ? '1 cifra' : `${l} cifras`),
      goal: l => `poner bien 7 de 8 en ${PONER_GOAL[l]} segundos o menos`,
      scoreText: s => `${s} s`,
      intro: () => 'Ten tu ábaco en 0. Va a salir un número: límpialo, pon el número en tu ábaco y toca «¡Listo!». Después revisamos si se ve igual.'
    },
    {
      id: 'escucha', group: 'abaco', from: 'B1', icon: '🎧', name: 'Escucha y calcula', short: 'Mapi dicta una cuenta: hazla en tu ábaco.',
      levels: [2, 3, 4, 5, 6, 7, 8], start: 2, rounds: 5, need: 4, better: higher, chain: true,
      levelName: l => `cuentas de ${l} números`,
      levelShort: l => `${l} números`,
      goal: () => 'acertar 4 de 5',
      scoreText: s => `${s} de 5`,
      intro: () => 'Ten tu ábaco en 0. Te voy a dictar una cuenta: «Pon 3… más 4… menos 2». Ve moviendo las bolitas mientras escuchas y al final escribe lo que te dio.'
    },
    {
      id: 'mira', group: 'abaco', from: 'B1', icon: '👀', name: 'Mira y calcula', short: 'Los números salen uno por uno: súmalos en tu ábaco.',
      levels: [2, 3, 4, 5, 6, 7, 8], start: 2, rounds: 5, need: 4, better: higher, chain: true,
      levelName: l => `cuentas de ${l} números`,
      levelShort: l => `${l} números`,
      goal: () => 'acertar 4 de 5',
      scoreText: s => `${s} de 5`,
      intro: () => 'Ten tu ábaco en 0. Los números van a salir uno por uno. Ve haciendo la cuenta en tu ábaco y al final escribe lo que te dio.'
    },
    {
      id: 'schulte', group: 'mente', icon: '🔢', name: 'Tabla de Schulte', short: 'Encuentra los números en orden, rápido.',
      levels: [3, 4, 5], start: 3, better: lower,
      levelName: l => `la tabla de ${l}×${l}`,
      levelShort: l => `${l}×${l}`,
      goal: l => `terminar en ${SCHULTE_GOAL[l]} segundos o menos`,
      scoreText: s => `${s} s`,
      intro: () => 'Toca los números en orden: 1, 2, 3… Mira toda la tabla con calma.'
    },
    {
      id: 'span', group: 'mente', icon: '🧠', name: 'Recuerda el número', short: 'Mira un número, guárdalo en tu cabeza y escríbelo.',
      levels: [2, 3, 4, 5, 6, 7, 8], start: 3, rounds: 5, need: 4, better: higher,
      levelName: l => `números de ${l} cifras`,
      levelShort: l => `${l} cifras`,
      goal: () => 'acertar 4 de 5',
      scoreText: s => `${s} de 5`,
      intro: () => 'Te voy a mostrar un número por unos segundos. Míralo bien, repítelo en tu cabeza y, cuando se esconda, escríbelo.'
    },
    {
      id: 'flash', group: 'mente', icon: '🧮', name: 'Recuerda el ábaco', short: 'Mira el ábaco un momento y di qué número era.',
      levels: [1, 2, 3], start: 1, rounds: 8, need: 7, better: higher,
      levelName: l => (l === 1 ? 'números de 1 cifra' : `números de ${l} cifras`),
      levelShort: l => (l === 1 ? '1 cifra' : `${l} cifras`),
      goal: () => 'acertar 7 de 8',
      scoreText: s => `${s} de 8`,
      intro: () => 'El ábaco va a aparecer un momento. Fíjate en las bolitas que tocan la barra y, cuando se esconda, escribe el número.'
    },
    {
      id: 'corsi', group: 'mente', icon: '💡', name: 'Luces en orden', short: 'Mira cómo se encienden las luces y repítelas.',
      levels: [2, 3, 4, 5, 6, 7, 8], start: 3, rounds: 5, need: 4, better: higher,
      levelName: l => `${l} luces`,
      levelShort: l => `${l} luces`,
      goal: () => 'acertar 4 de 5',
      scoreText: s => `${s} de 5`,
      intro: () => 'Algunas luces se van a encender, una por una. Mira bien el orden y después tócalas igual.'
    }
  ];
  const BY_ID = Object.fromEntries(GAMES.map(g => [g.id, g]));

  /* ---------- Niveles, registro y dominio ---------- */

  // Estado guardado de un juego. Los datos de la versión anterior (que subía de
  // nivel de inmediato) se convierten volviendo al nivel inicial.
  function normalize(id, st) {
    const def = BY_ID[id];
    if (st && st.v === 2) return st;
    const best = {};
    if (id === 'schulte' && st && st.best) Object.assign(best, st.best);
    return { v: 2, level: def.start, count: 0, streak: 0, streakDays: [], hard: 0, best, plays: [] };
  }

  function topLevel(def, maxLevel) {
    const last = def.levels[def.levels.length - 1];
    return maxLevel ? Math.min(maxLevel, last) : last;
  }

  function stepLevel(def, level, dir) {
    const i = def.levels.indexOf(level);
    return def.levels[Math.max(0, Math.min(def.levels.length - 1, i + dir))];
  }

  // Registra una partida y decide si el nivel sube, baja o se mantiene.
  function applyResult(id, st, result, maxLevel, date) {
    const def = BY_ID[id];
    const level = st.level;
    st.count++;
    st.streak = result.ok ? st.streak + 1 : 0;
    st.streakDays = result.ok ? Array.from(new Set((st.streakDays || []).concat(date))) : [];
    st.hard = result.stars === 1 ? st.hard + 1 : 0;
    const prev = st.best[level];
    // Un tiempo rápido con muchos errores no cuenta como marca.
    const record = !result.noRecord && (prev === undefined || def.better(result.score, prev));
    if (record) st.best[level] = result.score;
    st.plays = st.plays.concat({ date, level, score: result.score, ok: result.ok, stars: result.stars }).slice(-40);

    let change = 0;
    const mastered = st.count >= MIN_PLAYS && st.streak >= STREAK_UP && st.streakDays.length >= MIN_DAYS;
    if (mastered && level < topLevel(def, maxLevel)) change = 1;
    else if (st.hard >= HARD_DOWN && level > def.levels[0]) change = -1;
    if (change) {
      st.level = stepLevel(def, level, change);
      st.count = 0;
      st.streak = 0;
      st.streakDays = [];
      st.hard = 0;
    }

    let message;
    if (change > 0) message = `¡Dominaste este nivel! La próxima vez: ${def.levelName(st.level)}.`;
    else if (change < 0) message = `Para ganar confianza, la próxima vez jugamos con ${def.levelName(st.level)}.`;
    else if (result.ok && st.streak >= STREAK_UP && st.streakDays.length < MIN_DAYS) message = 'Hoy ya lo dominas. ¡Si mañana también lo logras, subes de nivel!';
    else if (result.ok && st.streak >= STREAK_UP && level < topLevel(def, maxLevel)) message = 'Ya lo dominas. Unas partidas más y subes de nivel.';
    else if (result.ok && st.streak >= STREAK_UP) message = '¡Lo dominas! Sigue así para mejorar tu marca.';
    else if (result.ok) message = `¡Meta cumplida! Llevas ${st.streak} de ${STREAK_UP} seguidas.`;
    else message = `La meta es ${def.goal(level)}. ¡Tú puedes!`;
    return { change, record: record && prev !== undefined, message };
  }

  // Últimas partidas del nivel actual, para que vea cómo va mejorando.
  function recent(st, n) {
    return st.plays.filter(p => p.level === st.level).slice(-(n || 5));
  }

  /* ---------- Utilidades ---------- */

  // Posiciones fijas de los 9 bloques, repartidas como en el tablero de Corsi.
  const CORSI_BLOCKS = [
    [0.08, 0.66], [0.40, 0.80], [0.74, 0.72], [0.04, 0.34], [0.36, 0.48],
    [0.68, 0.40], [0.24, 0.10], [0.56, 0.16], [0.82, 0.06]
  ];

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function randomNumber(digits) {
    if (digits <= 1) return Math.floor(Math.random() * 10);
    return Math.floor(10 ** (digits - 1) + Math.random() * 9 * 10 ** (digits - 1));
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // Estrellas de una partida por rondas: meta cumplida = 3 estrellas.
  function roundStars(def, score) {
    return score >= def.need ? 3 : score >= Math.ceil(def.rounds * 0.6) ? 2 : 1;
  }

  // Controla el ciclo de vida: al salir del juego, las esperas pendientes se cancelan.
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

  /* ---------- Tabla de Schulte ---------- */

  function schulte(env, life) {
    const size = env.level;
    const total = size * size;
    const numbers = shuffle(Array.from({ length: total }, (_, i) => i + 1));
    let next = 1;
    let errors = 0;
    let start = 0;

    env.board.innerHTML = '';
    const target = el('p', 'game-target', 'Busca el 1');
    const grid = el('div', 'schulte s' + size);
    numbers.forEach(n => {
      const b = el('button', 'schulte-cell', String(n));
      b.type = 'button';
      b.addEventListener('click', () => {
        if (!life.alive || !start) return;
        if (n !== next) {
          errors++;
          env.sounds.bad();
          b.classList.remove('is-wrong');
          void b.offsetWidth;
          b.classList.add('is-wrong');
          return;
        }
        b.classList.add('is-found');
        b.disabled = true;
        env.sounds.tick();
        next++;
        if (next > total) {
          const secs = Math.max(1, Math.round((Date.now() - start) / 1000));
          const goal = SCHULTE_GOAL[size];
          const ok = secs <= goal && errors <= 2;
          const stars = ok ? 3 : secs <= goal * 1.5 ? 2 : 1;
          env.finish({
            score: secs, ok, stars,
            text: `Terminaste en ${secs} ${secs === 1 ? 'segundo' : 'segundos'}` +
              (errors ? ` con ${errors} ${errors === 1 ? 'error' : 'errores'}.` : ' sin errores.')
          });
          return;
        }
        target.textContent = `Busca el ${next}`;
      });
      grid.appendChild(b);
    });
    env.board.appendChild(target);
    env.board.appendChild(grid);

    // Cuenta regresiva corta para que empiece mirando la tabla.
    (async () => {
      for (const n of ['3', '2', '1']) {
        env.status(n);
        await life.wait(600);
      }
      start = Date.now();
      env.say('¡Ya! Busca el 1.');
      const tick = () => {
        if (!life.alive || next > total) return;
        env.status(`${Math.round((Date.now() - start) / 1000)} s`);
        life.wait(500).then(tick);
      };
      tick();
    })();
  }

  /* ---------- Recuerda el número (memoria de cifras) ---------- */

  async function span(env, life) {
    const def = BY_ID.span;
    const len = env.level;
    let score = 0;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      env.status(`${round} de ${def.rounds}`);
      const value = String(randomNumber(len));
      env.board.innerHTML = '';
      const show = el('p', 'memory-number', value.split('').join(' '));
      env.board.appendChild(el('p', 'game-target', `Recuerda ${len} cifras`));
      env.board.appendChild(show);
      env.say('¡Mira bien!', null, '');
      await life.wait(800 + 750 * len);
      if (!life.alive) return;
      show.textContent = '? '.repeat(len).trim();
      show.classList.add('is-hidden');
      env.say('¿Qué número era?');
      const answer = await env.ask(len);
      if (!life.alive) return;
      if (answer === value) {
        score++;
        env.sounds.ok();
        env.say(`¡Sí! Era ${value}.`, 'ok');
      } else {
        env.sounds.bad();
        env.say(`Era ${value}.`, 'try');
      }
      await life.wait(1400);
    }
    if (!life.alive) return;
    env.finish({ score, ok: score >= def.need, stars: roundStars(def, score), text: `Acertaste ${score} de ${def.rounds}.` });
  }

  /* ---------- Recuerda el ábaco (flash) ---------- */

  async function flash(env, life) {
    const def = BY_ID.flash;
    const digits = env.level;
    let score = 0;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      env.status(`${round} de ${def.rounds}`);
      // Solo números que ya sabe leer en el ábaco (0–4, luego 0–5, luego 0–9; decenas…).
      const value = env.number(digits);
      env.board.innerHTML = '';
      const holder = el('div', 'exercise-abacus game-abacus');
      env.board.appendChild(holder);
      new env.Soroban(holder, { rods: Math.max(3, digits + 1), value, interactive: false, animate: false, showLabels: false });
      env.say('¡Mira!', null, '');
      await life.wait(1500 + 1000 * digits);
      if (!life.alive) return;
      holder.classList.add('is-hidden');
      env.say('¿Qué número era?');
      const answer = await env.ask(String(value).length);
      if (!life.alive) return;
      if (Number(answer) === value) {
        score++;
        env.sounds.ok();
        env.say(`¡Sí! Era el ${value}.`, 'ok');
      } else {
        env.sounds.bad();
        holder.classList.remove('is-hidden');
        env.say(`Era el ${value}. ¡Mira las bolitas!`, 'try');
        await life.wait(1200);
      }
      await life.wait(1200);
    }
    if (!life.alive) return;
    env.finish({ score, ok: score >= def.need, stars: roundStars(def, score), text: `Acertaste ${score} de ${def.rounds}.` });
  }

  /* ---------- Luces en orden (bloques de Corsi) ---------- */

  async function corsi(env, life) {
    const def = BY_ID.corsi;
    const len = env.level;
    env.board.innerHTML = '';
    const board = el('div', 'corsi');
    const blocks = CORSI_BLOCKS.map(([x, y], i) => {
      const b = el('button', 'corsi-block');
      b.type = 'button';
      b.style.left = (x * 100) + '%';
      b.style.top = (y * 100) + '%';
      b.setAttribute('aria-label', `Luz ${i + 1}`);
      board.appendChild(b);
      return b;
    });
    env.board.appendChild(board);

    const light = async (i, ms) => {
      blocks[i].classList.add('is-on');
      await life.wait(ms);
      blocks[i].classList.remove('is-on');
    };

    let score = 0;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      env.status(`${round} de ${def.rounds}`);
      const seq = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, len);
      board.classList.add('is-showing');
      env.say('Mira bien…', null, '');
      await life.wait(700);
      for (const i of seq) {
        if (!life.alive) return;
        await light(i, 650);
        await life.wait(250);
      }
      board.classList.remove('is-showing');
      env.say('¡Ahora tú!');
      const ok = await new Promise(resolve => {
        let k = 0;
        const handlers = blocks.map((b, i) => {
          const h = () => {
            if (!life.alive) return;
            light(i, 250);
            if (i !== seq[k]) { cleanup(); resolve(false); return; }
            env.sounds.tick();
            if (++k === seq.length) { cleanup(); resolve(true); }
          };
          b.addEventListener('click', h);
          return h;
        });
        function cleanup() { blocks.forEach((b, i) => b.removeEventListener('click', handlers[i])); }
      });
      if (!life.alive) return;
      if (ok) {
        score++;
        env.sounds.ok();
        env.say('¡Muy bien!', 'ok');
      } else {
        env.sounds.bad();
        env.say('Casi. ¡La siguiente!', 'try');
      }
      await life.wait(1200);
    }
    if (!life.alive) return;
    env.finish({ score, ok: score >= def.need, stars: roundStars(def, score), text: `Acertaste ${score} de ${def.rounds}.` });
  }

  /* ---------- Pon el número (ábaco físico) ---------- */

  // Espera a que toque uno de los botones; devuelve el índice del botón.
  function tap(buttons) {
    return new Promise(resolve => buttons.forEach((b, i) => b.addEventListener('click', () => resolve(i), { once: true })));
  }

  function button(cls, text) {
    const b = el('button', 'btn ' + cls, text);
    b.type = 'button';
    return b;
  }

  async function poner(env, life) {
    const def = BY_ID.poner;
    const digits = env.level;
    let correct = 0;
    let ms = 0;
    let prev = null;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      // Sin el 0 (sería solo limpiar) y sin repetir el anterior.
      let value = env.number(digits);
      for (let k = 0; k < 20 && (value === 0 || value === prev); k++) value = env.number(digits);
      prev = value;
      env.board.innerHTML = '';
      env.board.appendChild(el('p', 'game-target', 'Pon en tu ábaco:'));
      env.board.appendChild(el('p', 'memory-number', String(value)));
      const ready = button('btn-primary btn-xl', '✋ ¡Listo!');
      env.board.appendChild(ready);
      env.say(`Pon el ${value}.`);
      const start = Date.now();
      let waiting = true;
      const tick = () => {
        if (!life.alive || !waiting) return;
        env.status(`${round} de ${def.rounds} · ${Math.round((ms + Date.now() - start) / 1000)} s`);
        life.wait(500).then(tick);
      };
      tick();
      await tap([ready]);
      waiting = false;
      if (!life.alive) return;
      ms += Date.now() - start;
      env.status(`${round} de ${def.rounds} · ${Math.round(ms / 1000)} s`);

      // Revisión: el ábaco de la pantalla al lado del suyo.
      env.board.innerHTML = '';
      env.board.appendChild(el('p', 'game-target', '¿Tu ábaco se ve así?'));
      const holder = el('div', 'exercise-abacus game-abacus');
      env.board.appendChild(holder);
      new env.Soroban(holder, { rods: Math.max(3, digits + 1), value, interactive: false, animate: false, showLabels: false });
      const row = el('div', 'row center');
      const same = button('btn-primary btn-xl', '✓ ¡Igual!');
      const diff = button('btn-soft', '✗ No');
      row.appendChild(same);
      row.appendChild(diff);
      env.board.appendChild(row);
      env.say(`¿Tu ábaco se ve así? Es el ${value}.`, null, '¿Tu ábaco se ve así?');
      const answer = await tap([same, diff]);
      if (!life.alive) return;
      if (answer === 0) {
        correct++;
        env.sounds.ok();
        env.say('¡Muy bien!', 'ok');
        await life.wait(700);
      } else {
        env.sounds.bad();
        env.say(`Arréglalo en tu ábaco: mira las bolitas del ${value}.`, 'try');
        await life.wait(2600);
      }
    }
    if (!life.alive) return;
    const secs = Math.max(1, Math.round(ms / 1000));
    const goal = PONER_GOAL[digits];
    const ok = correct >= def.need && secs <= goal;
    const stars = ok ? 3 : correct >= def.need - 1 && secs <= goal * 1.5 ? 2 : 1;
    env.finish({
      score: secs, ok, stars, noRecord: correct < def.need,
      text: `Pusiste ${correct} de ${def.rounds} bien en ${secs} ${secs === 1 ? 'segundo' : 'segundos'}.`
    });
  }

  /* ---------- Escucha y calcula / Mira y calcula (ábaco físico) ---------- */

  // «3 + 4 − 2» para la pantalla y «Pon 3. Más 4. Menos 2.» para la voz.
  function chainText(terms) {
    return terms.map((t, i) => (i === 0 ? String(t) : (t < 0 ? ' − ' : ' + ') + Math.abs(t))).join('');
  }

  function termShown(t, i) {
    return i === 0 ? String(t) : (t < 0 ? '− ' : '+ ') + Math.abs(t);
  }

  function termSpoken(t, i) {
    return i === 0 ? `Pon ${t}.` : (t < 0 ? 'Menos ' : 'Más ') + Math.abs(t) + '.';
  }

  async function chainGame(env, life, def) {
    const count = env.level;
    // Sin voz en español, «Escucha y calcula» muestra los números como «Mira y calcula».
    const listen = def.id === 'escucha' && env.canSpeak;
    let score = 0;
    for (let round = 1; round <= def.rounds && life.alive; round++) {
      env.status(`${round} de ${def.rounds}`);
      const terms = env.chain(count);
      const total = terms.reduce((s, t) => s + t, 0);
      env.board.innerHTML = '';
      const hero = el('p', 'game-hero chain-hero', listen ? '🎧' : '👀');
      env.board.appendChild(hero);
      const shown = el('p', 'chain-term', '');
      env.board.appendChild(shown);
      const dots = el('div', 'chain-dots');
      terms.forEach(() => dots.appendChild(el('span', 'dot')));
      env.board.appendChild(dots);
      env.say('Limpia tu ábaco… ¡Atención!', null, '');
      if (listen) await env.speak(round === 1 ? 'Limpia tu ábaco. ¡Atención!' : 'Limpia tu ábaco. ¡La siguiente!');
      await life.wait(1600);
      for (let k = 0; k < terms.length; k++) {
        if (!life.alive) return;
        dots.children[k].classList.add('is-on');
        if (listen) {
          await env.speak(termSpoken(terms[k], k));
          if (!life.alive) return;
          await life.wait(CHAIN_PAUSE);
        } else {
          shown.textContent = termShown(terms[k], k);
          env.sounds.tick();
          await life.wait(CHAIN_PAUSE);
          shown.textContent = '';
          await life.wait(400);
        }
      }
      if (!life.alive) return;
      shown.textContent = '= ?';
      hero.hidden = true;
      env.say('¿Cuánto te dio?');
      const answer = await env.ask(env.answerLength);
      if (!life.alive) return;
      shown.textContent = `${chainText(terms)} = ${total}`;
      shown.classList.add('is-small');
      if (Number(answer) === total) {
        score++;
        env.sounds.ok();
        env.say(`¡Sí! Te dio ${total}.`, 'ok');
        await life.wait(1600);
      } else {
        env.sounds.bad();
        env.say(`Era ${total}. Mira la cuenta: ${chainText(terms)}.`, 'try');
        await life.wait(3600);
      }
      shown.classList.remove('is-small');
    }
    if (!life.alive) return;
    env.finish({ score, ok: score >= def.need, stars: roundStars(def, score), text: `Acertaste ${score} de ${def.rounds}.` });
  }

  const escucha = (env, life) => chainGame(env, life, BY_ID.escucha);
  const mira = (env, life) => chainGame(env, life, BY_ID.mira);

  const ENGINES = { poner, escucha, mira, schulte, span, flash, corsi };

  // Arranca un juego en el nivel indicado. Devuelve una función para detenerlo.
  function start(id, env) {
    const life = lifecycle();
    ENGINES[id](env, life);
    return () => life.stop();
  }

  // Juego sugerido del día: cambia cada día, entre los que ya están abiertos.
  function gameOfDay(dayNumber, list) {
    const games = list && list.length ? list : GAMES;
    return games[((dayNumber % games.length) + games.length) % games.length];
  }

  global.Juegos = { GAMES, GROUPS, BY_ID, MIN_PLAYS, STREAK_UP, HARD_DOWN, MIN_DAYS, PONER_GOAL, start, gameOfDay, normalize, applyResult, recent, topLevel };
})(window);
