/*
 * Ábaco – caligrafía de números.
 *
 * Cada número se describe con sus trazos en orden, dentro de una caja de
 * 100 × 140 (renglón: arriba y = 15, mitad y = 70, base y = 125). Los mismos
 * trazos sirven para la demostración animada, el juego de trazado con el dedo
 * o el mouse, y las hojas impresas.
 */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const W = 100;
  const H = 140;

  const STROKES = {
    0: ['M50 15 C25 15 18 45 18 70 C18 100 30 125 50 125 C70 125 82 100 82 70 C82 40 72 15 50 15'],
    1: ['M30 38 L55 15 L55 125'],
    2: ['M22 40 C22 22 36 15 50 15 C66 15 78 26 78 42 C78 62 55 82 22 125 L80 125'],
    3: ['M24 28 C32 18 42 15 52 15 C68 15 76 27 76 40 C76 56 62 66 46 68 C66 68 80 80 80 96 C80 114 66 125 50 125 C38 125 28 120 21 110'],
    4: ['M56 15 L18 90 L84 90', 'M64 48 L64 125'],
    5: ['M30 15 L27 62 C37 55 46 52 54 52 C70 52 80 66 80 86 C80 108 66 125 48 125 C36 125 27 119 21 110', 'M30 15 L76 15'],
    6: ['M72 22 C64 16 58 15 52 15 C30 15 20 42 20 78 C20 108 34 125 52 125 C70 125 80 110 80 94 C80 76 67 66 52 66 C36 66 24 76 21 88'],
    7: ['M20 15 L80 15 L40 125'],
    8: ['M50 15 C32 15 24 26 24 40 C24 56 40 63 50 68 C62 74 78 82 78 98 C78 115 65 125 50 125 C35 125 22 115 22 98 C22 82 38 74 50 68 C60 63 76 56 76 40 C76 26 68 15 50 15'],
    9: ['M76 32 C70 20 60 15 50 15 C33 15 22 28 22 44 C22 61 34 72 50 72 C66 72 78 60 78 44 L76 125']
  };

  // Cómo se describe cada número en voz alta, para guiar el trazo.
  const HOW = {
    0: 'Empieza arriba y da la vuelta hacia la izquierda hasta cerrar.',
    1: 'Sube en diagonal hasta arriba y baja derecho.',
    2: 'Haz una curva arriba, baja en diagonal y termina con una raya acostada.',
    3: 'Dos pancitas hacia la derecha: una arriba y otra abajo.',
    4: 'Primero baja en diagonal y sigue derecho; luego una raya de arriba a abajo.',
    5: 'Baja un poquito, haz la pancita; al final ponle el sombrero arriba.',
    6: 'Baja con una curva hacia la izquierda y cierra la ronda abajo.',
    7: 'Una raya acostada arriba y luego baja en diagonal.',
    8: 'Empieza arriba, haz una S y vuelve a subir para cerrar.',
    9: 'Haz una ronda arriba y baja derecho por la derecha.'
  };

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // Puntos de un trazo cada `step` unidades (requiere el DOM para medir la curva).
  let measureSvg = null;
  function samplePath(d, step) {
    if (!measureSvg) {
      measureSvg = el('svg', { width: 0, height: 0, style: 'position:absolute;visibility:hidden' });
      document.body.appendChild(measureSvg);
    }
    const path = el('path', { d }, measureSvg);
    const len = path.getTotalLength();
    const pts = [];
    for (let s = 0; s <= len; s += step) {
      const p = path.getPointAtLength(s);
      pts.push({ x: p.x, y: p.y });
    }
    const end = path.getPointAtLength(len);
    pts.push({ x: end.x, y: end.y });
    path.remove();
    return { pts, len };
  }

  const cache = {};
  function strokesOf(digit) {
    if (!cache[digit]) cache[digit] = STROKES[digit].map(d => Object.assign({ d }, samplePath(d, 2)));
    return cache[digit];
  }

  /* ---------- Dibujo de una casilla (pantalla e impresión) ---------- */

  // style: 'modelo' (número completo con orden de trazo), 'punteado', 'tenue',
  // 'vacio' (solo el punto de inicio) o 'guia' (camino ancho para el juego).
  function drawCell(svg, digit, style) {
    el('line', { x1: 4, y1: 15, x2: 96, y2: 15, class: 'cal-line' }, svg);
    el('line', { x1: 4, y1: 70, x2: 96, y2: 70, class: 'cal-line cal-mid' }, svg);
    el('line', { x1: 4, y1: 125, x2: 96, y2: 125, class: 'cal-line cal-base' }, svg);
    if (digit === null || digit === undefined) return;
    const strokes = strokesOf(digit);
    const starts = [];
    strokes.forEach((s, i) => {
      if (style !== 'vacio') el('path', { d: s.d, class: 'cal-' + style }, svg);
      if (style === 'modelo' || style === 'guia' || style === 'vacio' || (style === 'punteado' && i === 0)) {
        // Si dos trazos empiezan en el mismo sitio (como en el 5), el segundo número se corre un poco.
        const a = s.pts[0];
        const at = starts.some(b => Math.hypot(a.x - b.x, a.y - b.y) < 14) ? 8 : 0;
        starts.push(s.pts[at]);
        startMarker(svg, s, i, at, style === 'modelo' || style === 'guia');
      }
    });
  }

  function startMarker(svg, stroke, i, at, withArrow) {
    const a = stroke.pts[at];
    if (withArrow) {
      const b = stroke.pts[Math.min(stroke.pts.length - 1, at + 10)];
      const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      const g = el('g', { transform: `translate(${b.x} ${b.y}) rotate(${ang})`, class: 'cal-arrow' }, svg);
      el('path', { d: 'M-5 -5 L4 0 L-5 5' }, g);
    }
    el('circle', { cx: a.x, cy: a.y, r: 7, class: 'cal-start' }, svg);
    const t = el('text', { x: a.x, y: a.y + 3.6, 'text-anchor': 'middle', class: 'cal-start-num' }, svg);
    t.textContent = i + 1;
  }

  function cellSvg(digit, style, cls) {
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'cal-cell ' + (cls || '') });
    drawCell(svg, digit, style);
    return svg;
  }

  /* ---------- Juego de trazado ---------- */

  function distToSet(p, pts) {
    let best = Infinity;
    for (const q of pts) {
      const d = (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }

  function pathLength(pts) {
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    return len;
  }

  // Punto a una fracción del largo de un trazo.
  function atFraction(pts, f) {
    const target = pathLength(pts) * f;
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      if (acc >= target) return pts[i];
    }
    return pts[pts.length - 1];
  }

  // Compara lo que trazó la niña con el modelo. Devuelve 0–3 estrellas y una pista.
  function scoreTrace(digit, userStrokes) {
    const tpl = strokesOf(digit);
    const tplPts = tpl.flatMap(s => s.pts);
    const userPts = userStrokes.flat();
    if (userPts.length < 4) return { stars: 0, score: 0, hint: '¡Traza el número con tu dedo!' };
    const tol = 10;
    const coverage = tplPts.filter(p => distToSet(p, userPts) <= tol).length / tplPts.length;
    const precision = userPts.filter(p => distToSet(p, tplPts) <= tol * 1.3).length / userPts.length;
    // Un garabato cubre el modelo pero con mucha más tinta de la necesaria.
    const inkLen = userStrokes.reduce((sum, u) => sum + pathLength(u), 0);
    const tplLen = tpl.reduce((sum, t) => sum + t.len, 0);
    const excess = Math.min(1, 1.7 / Math.max(1, inkLen / tplLen));
    const score = Math.min(coverage, precision) * excess;

    // Orden y dirección: cada trazo debe empezar en su punto y avanzar hacia su final.
    let orderOk = userStrokes.length === tpl.length;
    if (orderOk) {
      tpl.forEach((s, i) => {
        const u = userStrokes[i];
        const start = s.pts[0], end = s.pts[s.pts.length - 1];
        const near = (p, q, r) => Math.hypot(p.x - q.x, p.y - q.y) <= r;
        // El punto a un cuarto del camino distingue la dirección incluso en el 0 y el 8.
        if (!near(u[0], start, 20) || !near(u[u.length - 1], end, 26) || [0.12, 0.25].some(f => !near(atFraction(u, f), atFraction(s.pts, f), 24))) orderOk = false;
      });
    }
    let stars = score >= 0.85 ? 3 : score >= 0.7 ? 2 : score >= 0.5 ? 1 : 0;
    let hint = stars === 3 ? '¡Hermoso!' : stars === 2 ? '¡Muy bien! Intenta ir por encima de los puntos.' : stars === 1 ? 'Ve más despacio y sigue el camino.' : 'Mira otra vez cómo se hace e inténtalo.';
    if (!orderOk && stars > 0) {
      stars = Math.min(stars, 2);
      hint = tpl.length > 1 && userStrokes.length !== tpl.length
        ? `El ${digit} se hace en ${tpl.length} trazos. Empieza en el punto 1.`
        : 'Empieza en el punto verde y sigue la flecha.';
    }
    return { stars, score, hint };
  }

  class Tracer {
    constructor(container, opts) {
      this.container = container;
      this.digit = opts.digit;
      this.style = opts.style || 'guia';
      this.onDone = opts.onDone || null;
      this.strokes = [];
      this.current = null;
      this.build();
    }

    build() {
      this.container.innerHTML = '';
      const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, class: 'tracer' });
      drawCell(svg, this.digit, this.style);
      this.demoLayer = el('g', { class: 'cal-demo' }, svg);
      this.inkLayer = el('g', { class: 'cal-ink' }, svg);
      svg.addEventListener('pointerdown', e => this.down(e));
      svg.addEventListener('pointermove', e => this.move(e));
      svg.addEventListener('pointerup', e => this.up(e));
      svg.addEventListener('pointercancel', e => this.up(e));
      this.svg = svg;
      this.container.appendChild(svg);
    }

    point(e) {
      const pt = this.svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const p = pt.matrixTransform(this.svg.getScreenCTM().inverse());
      return { x: p.x, y: p.y };
    }

    down(e) {
      if (this.locked) return;
      e.preventDefault();
      this.svg.setPointerCapture(e.pointerId);
      clearTimeout(this.timer);
      const p = this.point(e);
      this.current = { pts: [p], node: el('polyline', { points: `${p.x},${p.y}` }, this.inkLayer) };
    }

    move(e) {
      if (!this.current) return;
      const p = this.point(e);
      const last = this.current.pts[this.current.pts.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) < 1.2) return;
      this.current.pts.push(p);
      this.current.node.setAttribute('points', this.current.pts.map(q => `${q.x},${q.y}`).join(' '));
    }

    up() {
      if (!this.current) return;
      if (this.current.pts.length > 2) this.strokes.push(this.current.pts);
      else this.current.node.remove();
      this.current = null;
      // Al completar los trazos del número, se califica solo.
      if (this.strokes.length >= STROKES[this.digit].length) {
        this.timer = setTimeout(() => this.finish(), 450);
      }
    }

    finish() {
      if (this.locked || !this.strokes.length) return;
      this.locked = true;
      const result = scoreTrace(this.digit, this.strokes);
      if (this.onDone) this.onDone(result);
    }

    clear() {
      clearTimeout(this.timer);
      this.strokes = [];
      this.inkLayer.innerHTML = '';
      this.locked = false;
    }

    // Anima el trazo correcto, uno tras otro.
    demo() {
      const token = (this.demoToken = (this.demoToken || 0) + 1);
      this.demoLayer.innerHTML = '';
      const strokes = strokesOf(this.digit);
      const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return strokes.reduce((p, s) => p.then(() => new Promise(resolve => {
        if (token !== this.demoToken) return resolve();
        const path = el('path', { d: s.d, class: 'cal-demo-path' }, this.demoLayer);
        path.style.strokeDasharray = s.len;
        path.style.strokeDashoffset = reduced ? 0 : s.len;
        const ms = reduced ? 0 : Math.max(700, s.len * 6);
        requestAnimationFrame(() => {
          path.style.transition = `stroke-dashoffset ${ms}ms linear`;
          path.style.strokeDashoffset = 0;
        });
        setTimeout(resolve, ms + 250);
      })), Promise.resolve()).then(() => {
        setTimeout(() => { if (token === this.demoToken) this.demoLayer.innerHTML = ''; }, 900);
      });
    }
  }

  // Número del día para el calentamiento: el que tenga menos estrellas; si hay empate, rota con la fecha.
  function digitOfDay(best, dayNumber) {
    let pick = null;
    for (let k = 0; k < 10; k++) {
      const d = (dayNumber + k) % 10;
      if (pick === null || (best[d] || 0) < (best[pick] || 0)) pick = d;
    }
    return pick;
  }

  global.Caligrafia = { STROKES, HOW, Tracer, cellSvg, scoreTrace, strokesOf, digitOfDay };
})(window);
