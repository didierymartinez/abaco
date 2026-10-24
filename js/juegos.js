/*
 * Ábaco – juegos de concentración y memoria para después de practicar.
 *
 *   Tabla de Schulte   encontrar los números en orden (atención y rapidez visual)
 *   Recuerda el número ver un número unos segundos y escribirlo (memoria de trabajo)
 *   Recuerda el ábaco  ver un número en el ábaco y decir cuál era (anzan, visualizar)
 *   Luces en orden     repetir el orden en que se encienden bloques (bloques de Corsi)
 *
 * Cada juego empieza fácil y se adapta: sube de dificultad cuando sale bien.
 * Los motores solo dibujan en `env.board` y avisan con `env.finish(resultado)`.
 */
(function (global) {
  'use strict';

  const GAMES = [
    {
      id: 'schulte', icon: '🔢', name: 'Tabla de Schulte', short: 'Encuentra los números en orden, rápido.',
      intro: st => `Toca los números en orden: 1, 2, 3… lo más rápido que puedas. Mira toda la tabla con calma. Hoy: tabla de ${st.size || 3} por ${st.size || 3}.`,
      record: st => {
        const best = st.best || {};
        const sizes = Object.keys(best).sort();
        return sizes.length ? sizes.map(n => `${n}×${n}: ${best[n]} s`).join(' · ') : 'Sin récord todavía';
      }
    },
    {
      id: 'span', icon: '🧠', name: 'Recuerda el número', short: 'Mira un número, guárdalo en tu cabeza y escríbelo.',
      intro: () => 'Te voy a mostrar un número por unos segundos. Míralo bien, repítelo en tu cabeza y, cuando se esconda, escríbelo.',
      record: st => st.best ? `Récord: ${st.best} cifras` : 'Sin récord todavía'
    },
    {
      id: 'flash', icon: '🧮', name: 'Recuerda el ábaco', short: 'Mira el ábaco un momento y di qué número era.',
      intro: () => 'El ábaco va a aparecer un momento. Fíjate en las bolitas que tocan la barra y, cuando se esconda, escribe el número.',
      record: st => st.best ? `Récord: ${st.best} de 8` : 'Sin récord todavía'
    },
    {
      id: 'corsi', icon: '💡', name: 'Luces en orden', short: 'Mira cómo se encienden las luces y repítelas.',
      intro: () => 'Algunas luces se van a encender, una por una. Mira bien el orden y después tócalas igual.',
      record: st => st.best ? `Récord: ${st.best} luces` : 'Sin récord todavía'
    }
  ];

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

  const SCHULTE_STARS = { 3: [12, 20], 4: [30, 50], 5: [50, 80] };

  function schulte(env, life) {
    const st = env.state;
    const size = st.size || 3;
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
          const secs = Math.round((Date.now() - start) / 1000);
          const [three, two] = SCHULTE_STARS[size];
          let stars = secs <= three ? 3 : secs <= two ? 2 : 1;
          if (errors > 3) stars = Math.max(1, stars - 1);
          st.best = st.best || {};
          const record = !st.best[size] || secs < st.best[size];
          if (record) st.best[size] = secs;
          // Si salió muy bien, la próxima vez la tabla es más grande.
          const grow = stars === 3 && size < 5;
          if (grow) st.size = size + 1;
          env.finish({
            stars, record, score: secs, detail: `${size}×${size}`,
            text: `¡Lo lograste en ${secs} ${secs === 1 ? 'segundo' : 'segundos'}${errors ? ` con ${errors} ${errors === 1 ? 'error' : 'errores'}` : ''}!` +
              (grow ? ` La próxima vez: tabla de ${size + 1} por ${size + 1}.` : '')
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
    const st = env.state;
    let len = Math.max(2, (st.best || 2) - 1);
    let best = 0;
    let fails = 0;
    let round = 0;
    while (life.alive && round < 10) {
      round++;
      env.status(`Ronda ${round}`);
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
        best = Math.max(best, len);
        fails = 0;
        env.sounds.ok();
        env.say(`¡Sí! Era ${value}.`, 'ok');
        len++;
      } else {
        fails++;
        env.sounds.bad();
        env.say(`Era ${value}. ${fails === 1 ? '¡Otra vez con el mismo tamaño!' : ''}`, 'try');
        if (fails >= 2) break;
      }
      await life.wait(1400);
    }
    if (!life.alive) return;
    const record = best > (st.best || 0);
    if (record) st.best = best;
    const stars = best >= 5 ? 3 : best >= 4 ? 2 : 1;
    env.finish({ stars, record, score: best, text: best ? `Recordaste números de ${best} cifras.` : 'Los números largos cuestan. ¡Mañana lo intentamos otra vez!' });
  }

  /* ---------- Recuerda el ábaco (flash) ---------- */

  async function flash(env, life) {
    const st = env.state;
    const maxDigits = Math.max(1, env.maxDigits);
    let digits = Math.min(st.digits || 1, maxDigits);
    let streak = 0;
    let correct = 0;
    for (let round = 1; round <= 8 && life.alive; round++) {
      env.status(`${round} de 8`);
      // Con una cifra, solo números que ya sabe leer en el ábaco (0–4, luego 0–5, luego 0–9).
      const value = digits === 1 ? Math.floor(Math.random() * (env.maxOneDigit + 1)) : randomNumber(digits);
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
        correct++;
        streak++;
        env.sounds.ok();
        env.say(`¡Sí! Era el ${value}.`, 'ok');
        if (streak >= 2 && digits < maxDigits) { digits++; streak = 0; }
      } else {
        streak = 0;
        env.sounds.bad();
        holder.classList.remove('is-hidden');
        env.say(`Era el ${value}. ¡Mira las bolitas!`, 'try');
        await life.wait(1200);
      }
      await life.wait(1200);
    }
    if (!life.alive) return;
    st.digits = digits;
    const record = correct > (st.best || 0);
    if (record) st.best = correct;
    const stars = correct >= 8 ? 3 : correct >= 6 ? 2 : 1;
    env.finish({ stars, record, score: correct, text: `Acertaste ${correct} de 8.` });
  }

  /* ---------- Luces en orden (bloques de Corsi) ---------- */

  async function corsi(env, life) {
    const st = env.state;
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

    let len = 2;
    let best = 0;
    while (life.alive && len <= 9) {
      let passed = false;
      for (let trial = 0; trial < 2 && !passed && life.alive; trial++) {
        env.status(`${len} luces`);
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
          passed = true;
          best = len;
          env.sounds.ok();
          env.say(`¡Muy bien! ${len} luces.`, 'ok');
        } else {
          env.sounds.bad();
          env.say(trial === 0 ? 'Casi. ¡Otra vez!' : 'Ese orden era difícil.', 'try');
        }
        await life.wait(1200);
      }
      if (!passed) break;
      len++;
    }
    if (!life.alive) return;
    const record = best > (st.best || 0);
    if (record) st.best = best;
    const stars = best >= 5 ? 3 : best >= 4 ? 2 : 1;
    env.finish({ stars, record, score: best, text: best ? `Repetiste ${best} luces en orden.` : '¡Sigue practicando y verás cómo mejoras!' });
  }

  const ENGINES = { schulte, span, flash, corsi };

  // Arranca un juego. Devuelve una función para detenerlo.
  function start(id, env) {
    const life = lifecycle();
    ENGINES[id](env, life);
    return () => life.stop();
  }

  // Juego sugerido del día: cambia cada día.
  function gameOfDay(dayNumber) {
    return GAMES[((dayNumber % GAMES.length) + GAMES.length) % GAMES.length];
  }

  global.Juegos = { GAMES, start, gameOfDay };
})(window);
