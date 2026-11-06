/*
 * Mi Lectura – cómo se muestra un texto.
 *
 *   render     el texto completo, con cada palabra en su <span>
 *   guide      lectura con guía: un resaltador avanza por grupos de palabras
 *              a la velocidad elegida (como seguir la línea con el dedo)
 *   rsvp       palabra a palabra en el mismo lugar, con la letra de enfoque
 *              marcada (como las apps de lectura rápida). Se puede pausar y
 *              volver al inicio de la frase, porque releer ayuda a entender.
 */
(function (global) {
  'use strict';

  const countWords = text => text.split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;

  // Palabras del texto con su párrafo y si cierran frase.
  function tokens(text) {
    const out = [];
    text.split(/\n\s*\n/).forEach((para, p) => {
      para.split(/\s+/).filter(Boolean).forEach(w => {
        out.push({ w, p, end: /[.!?…]["»”)]*$/.test(w), comma: /[,;:]["»”)]*$/.test(w) });
      });
    });
    if (out.length) out[out.length - 1].last = true;
    return out;
  }

  // Texto completo; devuelve los <span> de cada palabra en orden.
  function render(box, text) {
    box.innerHTML = '';
    const spans = [];
    let current = null;
    let p = -1;
    tokens(text).forEach(t => {
      if (t.p !== p) {
        current = document.createElement('p');
        box.appendChild(current);
        p = t.p;
      } else {
        current.appendChild(document.createTextNode(' '));
      }
      const s = document.createElement('span');
      s.className = 'w';
      s.textContent = t.w;
      current.appendChild(s);
      spans.push(s);
    });
    return spans;
  }

  // Grupos de n palabras que no cruzan el final de una frase.
  function chunks(list, n) {
    const out = [];
    let group = [];
    list.forEach((t, i) => {
      group.push(i);
      if (group.length >= n || t.end || t.comma || t.last || (list[i + 1] && list[i + 1].p !== t.p)) {
        out.push(group);
        group = [];
      }
    });
    if (group.length) out.push(group);
    return out;
  }

  // Tiempo de un grupo: palabras × (60 s / ppm), con una pausa al final de frase y de párrafo.
  function chunkMs(list, group, wpm) {
    const base = 60000 / wpm;
    const last = list[group[group.length - 1]];
    const extra = last.end ? 1 : last.comma ? 0.5 : 0;
    const long = group.reduce((s, i) => s + (list[i].w.length > 8 ? 0.3 : 0), 0);
    return base * (group.length + extra + long);
  }

  /* ---------- Lectura con guía ---------- */

  function guide(box, text, opts) {
    const list = tokens(text);
    const spans = render(box, text);
    const groups = chunks(list, opts.chunk || 1);
    let wpm = opts.wpm;
    let k = 0;
    let timer = null;
    let paused = false;
    box.classList.add('is-guided');

    function show() {
      spans.forEach(s => s.classList.remove('is-now'));
      if (k >= groups.length) { finish(); return; }
      groups[k].forEach(i => spans[i].classList.add('is-now'));
      for (let i = 0; i < groups[k][0]; i++) spans[i].classList.add('is-read');
      const first = spans[groups[k][0]];
      if (first.scrollIntoView && opts.scroll !== false) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
      timer = setTimeout(() => { k++; show(); }, chunkMs(list, groups[k], wpm));
    }
    function finish() {
      clearTimeout(timer);
      spans.forEach(s => { s.classList.remove('is-now'); s.classList.add('is-read'); });
      if (opts.onEnd) opts.onEnd();
    }
    show();
    return {
      pause() { paused = true; clearTimeout(timer); },
      resume() { if (paused) { paused = false; show(); } },
      get paused() { return paused; },
      setWpm(v) { wpm = v; },
      stop() { clearTimeout(timer); k = groups.length; }
    };
  }

  /* ---------- Palabra a palabra (RSVP) ---------- */

  // Letra de enfoque: un poco a la izquierda del centro de la palabra.
  function focusIndex(word) {
    const n = [...word.replace(/[^\p{L}\p{N}]/gu, '')].length;
    return n <= 1 ? 0 : n <= 5 ? 1 : n <= 9 ? 2 : n <= 13 ? 3 : 4;
  }

  function showWord(stage, word) {
    stage.innerHTML = '';
    const letters = [...word];
    // La letra de enfoque se cuenta sin los signos de apertura (¿ ¡ « —).
    const lead = (word.match(/^[^\p{L}\p{N}]*/u) || [''])[0].length;
    const i = Math.min(letters.length - 1, lead + focusIndex(word));
    const left = document.createElement('span');
    left.className = 'rsvp-left';
    left.textContent = letters.slice(0, i).join('');
    const focus = document.createElement('span');
    focus.className = 'rsvp-focus';
    focus.textContent = letters[i] || '';
    const right = document.createElement('span');
    right.className = 'rsvp-right';
    right.textContent = letters.slice(i + 1).join('');
    stage.append(left, focus, right);
  }

  function rsvp(stage, text, opts) {
    const list = tokens(text);
    const groups = chunks(list, opts.chunk || 1);
    let wpm = opts.wpm;
    let k = 0;
    let timer = null;
    let paused = false;

    function show() {
      if (k >= groups.length) { if (opts.onEnd) opts.onEnd(); return; }
      const words = groups[k].map(i => list[i].w);
      stage.classList.toggle('is-group', words.length > 1);
      if (words.length === 1) showWord(stage, words[0]);
      else stage.textContent = words.join(' ');
      if (opts.onProgress) opts.onProgress(groups[k][0], list.length);
      timer = setTimeout(() => { k++; show(); }, chunkMs(list, groups[k], wpm));
    }
    show();
    return {
      pause() { paused = true; clearTimeout(timer); },
      resume() { if (paused) { paused = false; show(); } },
      get paused() { return paused; },
      setWpm(v) { wpm = v; },
      // Vuelve al inicio de la frase (o de la anterior, si ya estaba al inicio).
      back() {
        clearTimeout(timer);
        let i = Math.max(0, k - 1);
        while (i > 0 && !list[groups[i - 1][groups[i - 1].length - 1]].end) i--;
        k = i;
        paused = false;
        show();
      },
      stop() { clearTimeout(timer); k = groups.length; }
    };
  }

  global.Lector = { countWords, tokens, render, guide, rsvp, focusIndex };
})(window);
