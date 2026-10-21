/*
 * Ábaco – caligrafía de números.
 *
 * Cada número se describe con sus trazos en orden, dentro de una caja de
 * 100 × 140 (renglón: arriba y = 15, mitad y = 70, base y = 125). Con ellos
 * se dibujan las hojas impresas: modelo con orden de trazo, puntos para
 * repasar y casillas para escribir con lápiz.
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

  // style: 'modelo' (número completo con orden de trazo), 'punteado', 'tenue'
  // o 'vacio' (solo el punto de inicio).
  function drawCell(svg, digit, style) {
    el('line', { x1: 4, y1: 15, x2: 96, y2: 15, class: 'cal-line' }, svg);
    el('line', { x1: 4, y1: 70, x2: 96, y2: 70, class: 'cal-line cal-mid' }, svg);
    el('line', { x1: 4, y1: 125, x2: 96, y2: 125, class: 'cal-line cal-base' }, svg);
    if (digit === null || digit === undefined) return;
    const strokes = strokesOf(digit);
    const starts = [];
    strokes.forEach((s, i) => {
      if (style !== 'vacio') el('path', { d: s.d, class: 'cal-' + style }, svg);
      if (style === 'modelo' || style === 'vacio' || (style === 'punteado' && i === 0)) {
        // Si dos trazos empiezan en el mismo sitio (como en el 5), el segundo número se corre un poco.
        const a = s.pts[0];
        const at = starts.some(b => Math.hypot(a.x - b.x, a.y - b.y) < 14) ? 8 : 0;
        starts.push(s.pts[at]);
        startMarker(svg, s, i, at, style === 'modelo');
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

  // Número del día para la fila de caligrafía de las hojas: rota con la fecha.
  function digitOfDay(dayNumber) {
    return ((dayNumber % 10) + 10) % 10;
  }

  global.Caligrafia = { STROKES, cellSvg, strokesOf, digitOfDay };
})(window);
