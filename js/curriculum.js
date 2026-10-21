/*
 * Ábaco – currículo, generadores de ejercicios y explicaciones paso a paso.
 *
 * Los ejercicios se generan con una semilla (fecha + nivel), así la hoja
 * impresa de un día y la sesión en pantalla de ese mismo día coinciden.
 */
(function (global) {
  'use strict';

  /* ---------- Aleatoriedad con semilla ---------- */

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function makeRng(seed) {
    let a = hashString(String(seed));
    function next() {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      next,
      int(min, max) { return min + Math.floor(next() * (max - min + 1)); },
      pick(list) { return list[Math.floor(next() * list.length)]; }
    };
  }

  /* ---------- Movimientos en el soroban ---------- */

  // Dígitos de un número, empezando por las unidades.
  function digitsOf(n, len) {
    const out = [];
    let v = Math.abs(n);
    do { out.push(v % 10); v = Math.floor(v / 10); } while (v > 0);
    while (len && out.length < len) out.push(0);
    return out;
  }

  // Qué hace falta para sumar n a una varilla que muestra d.
  //   directo: caben las cuentas sin ayuda
  //   amigo5:  hay que usar la cuenta del cielo (+5 −amigo)
  //   amigo10: hay que llevar a la varilla de la izquierda (+10 −amigo)
  function addKind(d, n) {
    if (d + n >= 10) return 'amigo10';
    const lower = d % 5, upper = d >= 5;
    const nl = n % 5, nu = n >= 5;
    if (lower + nl <= 4 && (!nu || !upper)) return 'directo';
    return 'amigo5';
  }

  function subKind(d, n) {
    if (d - n < 0) return 'amigo10';
    const lower = d % 5, upper = d >= 5;
    const nl = n % 5, nu = n >= 5;
    if (lower >= nl && (!nu || upper)) return 'directo';
    return 'amigo5';
  }

  // Movimiento de cada columna al sumar b (con signo) a a.
  function columnKinds(a, b) {
    const len = Math.max(String(Math.abs(a)).length, String(Math.abs(b)).length);
    const da = digitsOf(a, len), db = digitsOf(b, len);
    const kinds = [];
    for (let i = 0; i < len; i++) {
      if (db[i] === 0) continue;
      kinds.push(b >= 0 ? addKind(da[i], db[i]) : subKind(da[i], db[i]));
    }
    return kinds;
  }

  const RULES = {
    directo: k => k.every(x => x === 'directo'),
    amigo5: k => k.includes('amigo5') && !k.includes('amigo10'),
    sinLlevada: k => !k.includes('amigo10'),
    amigo10: k => k.includes('amigo10'),
    libre: () => true
  };

  /* ---------- Generadores ---------- */

  function randomWithDigits(rng, digits) {
    if (digits <= 1) return rng.int(1, 9);
    return rng.int(10 ** (digits - 1), 10 ** digits - 1);
  }

  function pickNumber(rng, range, digits) {
    return range ? rng.int(range[0], range[1]) : randomWithDigits(rng, digits);
  }

  // Dos números: a ± b, respetando la regla de movimientos.
  function genPair(rng, spec) {
    for (let i = 0; i < 500; i++) {
      const a = pickNumber(rng, spec.a, spec.digits);
      let b = pickNumber(rng, spec.b, spec.digitsB || spec.digits);
      if (spec.op === '-') {
        if (b > a) continue;
        b = -b;
      }
      if (RULES[spec.rule](columnKinds(a, b))) return [a, b];
    }
    throw new Error('No se pudo generar el ejercicio');
  }

  // Cadena de números (lista de soroban), con total siempre entre 0 y max.
  function genChain(rng, spec) {
    for (let attempt = 0; attempt < 500; attempt++) {
      const terms = [randomWithDigits(rng, spec.digits)];
      let total = terms[0];
      let ok = true;
      for (let i = 1; i < spec.count && ok; i++) {
        ok = false;
        for (let j = 0; j < 40; j++) {
          const t = (rng.next() < 0.5 ? -1 : 1) * randomWithDigits(rng, spec.digits);
          const next = total + t;
          if (next < 0 || next > spec.max) continue;
          if (!RULES[spec.rule](columnKinds(total, t))) continue;
          terms.push(t);
          total = next;
          ok = true;
          break;
        }
      }
      if (ok) return terms;
    }
    throw new Error('No se pudo generar la cadena');
  }

  function calc(terms, extra) {
    return Object.assign({ type: 'calculo', terms, answer: terms.reduce((s, t) => s + t, 0) }, extra);
  }

  function abacusNumber(rng, i, range) {
    const value = rng.int(range[0], range[1]);
    return { type: i % 2 === 0 ? 'leer' : 'poner', value, answer: value };
  }

  /* ---------- Niveles ---------- */
  // targetSec: segundos por ejercicio para considerar el nivel dominado (como los tiempos estándar de Kumon).

  const LEVELS = [
    {
      id: 'A1', group: 'Conozco el ábaco', name: 'Números del 0 al 9', targetSec: 12,
      instruction: 'Lee o pon el número en el ábaco',
      tip: 'Cada cuenta de abajo (tierra) vale 1. La de arriba (cielo) vale 5. Solo cuentan las que tocan la barra.',
      hint: 'Solo cuentan las cuentas que tocan la barra: la de arriba vale 5 y cada una de abajo vale 1.',
      next: 'Cuando leas del 0 al 9 sin contar una por una, pasarás a las decenas.',
      gen: (rng, i) => abacusNumber(rng, i, [0, 9])
    },
    {
      id: 'A2', group: 'Conozco el ábaco', name: 'Números hasta el 99', targetSec: 15,
      instruction: 'Lee o pon el número en el ábaco',
      tip: 'La varilla de la derecha son las unidades; la de su izquierda, las decenas.',
      hint: 'Mira cada varilla por separado: la de la derecha son unidades y la de su izquierda, decenas.',
      next: 'Después vienen las centenas: una varilla más a la izquierda.',
      gen: (rng, i) => abacusNumber(rng, i, [10, 99])
    },
    {
      id: 'A3', group: 'Conozco el ábaco', name: 'Números hasta el 999', targetSec: 18,
      instruction: 'Lee o pon el número en el ábaco',
      tip: 'Unidades, decenas y centenas: una varilla para cada una, de derecha a izquierda.',
      hint: 'Lee de izquierda a derecha: centenas, decenas y unidades. Una varilla sin cuentas en la barra es un 0.',
      next: 'Ya sabes formar números: ¡ahora a sumar!',
      gen: (rng, i) => abacusNumber(rng, i, [100, 999])
    },
    {
      id: 'B1', group: 'Sumas y restas directas', name: 'Sumas directas', targetSec: 10,
      instruction: 'Suma',
      tip: 'Sumar es acercar cuentas a la barra. Usa el pulgar para subir las de tierra.',
      hint: 'Pon el primer número y luego acerca las cuentas del segundo. Si es 5 o más, usa la cuenta del cielo.',
      next: 'Luego aprenderás a restar quitando cuentas.',
      gen: rng => calc(genPair(rng, { op: '+', digits: 1, rule: 'directo' }))
    },
    {
      id: 'B2', group: 'Sumas y restas directas', name: 'Restas directas', targetSec: 10,
      instruction: 'Resta',
      tip: 'Restar es alejar cuentas de la barra. Usa el índice para bajar las de tierra.',
      hint: 'Restar es quitar: aleja de la barra las cuentas del número que restas.',
      next: 'Pronto conocerás a los amigos del 5.',
      gen: rng => calc(genPair(rng, { op: '-', digits: 1, rule: 'directo' }))
    },
    {
      id: 'B3', group: 'Amigos del 5', name: 'Sumas con amigos del 5', targetSec: 12,
      instruction: 'Suma',
      tip: 'Amigos del 5: 1 y 4, 2 y 3. Si no caben abajo, pon el 5 de arriba y quita a su amigo.',
      hint: '¿Cuánto le falta para 5? Ese es su amigo: 1 y 4, 2 y 3. Pon el 5 y quita al amigo.',
      next: 'Después usarás los amigos del 5 para restar.',
      gen: rng => calc(genPair(rng, { op: '+', digits: 1, rule: 'amigo5' }))
    },
    {
      id: 'B4', group: 'Amigos del 5', name: 'Restas con amigos del 5', targetSec: 12,
      instruction: 'Resta',
      tip: 'Si no hay suficientes cuentas abajo, pon al amigo abajo y quita el 5 de arriba.',
      hint: 'Si no hay cuentas abajo para quitar, pon al amigo del número y quita el 5 de arriba.',
      next: 'Luego vienen los amigos del 10, que pasan a la varilla de la izquierda.',
      gen: rng => calc(genPair(rng, { op: '-', digits: 1, rule: 'amigo5' }))
    },
    {
      id: 'C1', group: 'Amigos del 10', name: 'Sumas que llevan', targetSec: 14,
      instruction: 'Suma',
      tip: 'Amigos del 10: 1 y 9, 2 y 8, 3 y 7, 4 y 6, 5 y 5. Quita al amigo y suma 1 a la izquierda.',
      hint: 'Si no cabe, quita al amigo del 10 (1 y 9, 2 y 8, 3 y 7, 4 y 6, 5 y 5) y suma 1 a la izquierda.',
      next: 'Después restarás pidiendo prestado a la izquierda.',
      gen: rng => calc(genPair(rng, { op: '+', digits: 1, rule: 'amigo10' }))
    },
    {
      id: 'C2', group: 'Amigos del 10', name: 'Restas que piden prestado', targetSec: 14,
      instruction: 'Resta',
      tip: 'Si no alcanza, quita 1 a la izquierda (10) y pon al amigo del número en esta varilla.',
      hint: 'Si no alcanza, quita 1 de la varilla de la izquierda y pon al amigo del 10 en esta varilla.',
      next: 'Luego mezclarás sumas y restas.',
      gen: rng => calc(genPair(rng, { op: '-', a: [10, 18], b: [2, 9], rule: 'amigo10' }))
    },
    {
      id: 'C3', group: 'Amigos del 10', name: 'Sumas y restas mezcladas', targetSec: 16,
      instruction: 'Calcula de arriba a abajo',
      tip: 'Ve número por número. Mira el signo antes de mover las cuentas.',
      hint: 'Detente, mira el signo y luego mueve. Un número a la vez.',
      next: 'Pronto sumarás números de dos cifras.',
      gen: rng => calc(genChain(rng, { count: 3, digits: 1, max: 18, rule: 'libre' }))
    },
    {
      id: 'D1', group: 'Dos cifras', name: 'Sumas de 2 cifras sin llevar', targetSec: 15,
      instruction: 'Suma',
      tip: 'En el soroban se suma de izquierda a derecha: primero las decenas, luego las unidades.',
      hint: 'Primero las decenas, luego las unidades. Cada varilla se trabaja sola.',
      next: 'Después habrá sumas que llevan a la izquierda.',
      gen: rng => calc(genPair(rng, { op: '+', digits: 2, rule: 'sinLlevada' }))
    },
    {
      id: 'D2', group: 'Dos cifras', name: 'Sumas de 2 cifras llevando', targetSec: 18,
      instruction: 'Suma',
      tip: 'Cuando una varilla no alcanza, usa al amigo del 10 y suma 1 en la varilla de la izquierda.',
      hint: 'Revisa la varilla donde te equivocaste: ¿usaste al amigo del 10 y sumaste 1 a la izquierda?',
      next: 'Luego vienen las restas de dos cifras.',
      gen: rng => calc(genPair(rng, { op: '+', digits: 2, rule: 'amigo10' }))
    },
    {
      id: 'D3', group: 'Dos cifras', name: 'Restas de 2 cifras', targetSec: 18,
      instruction: 'Resta',
      tip: 'Primero las decenas, luego las unidades. Si no alcanza, pide prestado a la izquierda.',
      hint: 'Resta varilla por varilla, de izquierda a derecha. Si no alcanza, pide prestado a la izquierda.',
      next: 'Pronto trabajarás con centenas.',
      gen: rng => calc(genPair(rng, { op: '-', digits: 2, rule: 'libre' }))
    },
    {
      id: 'E1', group: 'Tres cifras', name: 'Sumas de 3 cifras', targetSec: 25,
      instruction: 'Suma',
      tip: 'Centenas, decenas y unidades: una varilla a la vez, de izquierda a derecha.',
      hint: 'Busca la varilla donde apareció el error y comprueba si tenías que llevar 1.',
      next: 'Después, restas de tres cifras.',
      gen: rng => calc(genPair(rng, { op: '+', digits: 3, rule: 'libre' }))
    },
    {
      id: 'E2', group: 'Tres cifras', name: 'Restas de 3 cifras', targetSec: 25,
      instruction: 'Resta',
      tip: 'Ve con calma: mira cada varilla antes de mover.',
      hint: 'Revisa una varilla a la vez; si pediste prestado, comprueba que quitaste 1 a la izquierda.',
      next: 'Luego vendrán listas de números, como en las competencias de soroban.',
      gen: rng => calc(genPair(rng, { op: '-', digits: 3, rule: 'libre' }))
    },
    {
      id: 'F1', group: 'Listas de soroban', name: 'Listas de 4 números (1 cifra)', targetSec: 20,
      instruction: 'Calcula de arriba a abajo',
      tip: 'No borres el ábaco entre números: cada número se suma o resta al anterior.',
      hint: 'No borres entre números. Si te pierdes, vuelve a empezar la lista desde arriba.',
      next: 'Luego harás listas con números de dos cifras.',
      gen: rng => calc(genChain(rng, { count: 4, digits: 1, max: 99, rule: 'libre' }))
    },
    {
      id: 'F2', group: 'Listas de soroban', name: 'Listas de 4 números (2 cifras)', targetSec: 35,
      instruction: 'Calcula de arriba a abajo',
      tip: 'Decenas primero, unidades después, número por número.',
      hint: 'Decenas primero, unidades después, número por número. Revisa los signos.',
      next: 'Después calcularás con el ábaco imaginario: anzan.',
      gen: rng => calc(genChain(rng, { count: 4, digits: 2, max: 999, rule: 'libre' }))
    },
    {
      id: 'G1', group: 'Anzan (ábaco mental)', name: 'Flash de 3 números', targetSec: 15,
      instruction: 'Calcula de memoria',
      tip: 'Imagina el ábaco en tu cabeza y mueve las cuentas con la mente.',
      hint: 'Imagina el ábaco y mueve las cuentas en tu mente con cada número.',
      next: 'Luego, más números y más rápido.',
      gen: rng => calc(genChain(rng, { count: 3, digits: 1, max: 18, rule: 'libre' }), { type: 'flash', intervalMs: 1600 })
    },
    {
      id: 'G2', group: 'Anzan (ábaco mental)', name: 'Flash de 5 números', targetSec: 20,
      instruction: 'Calcula de memoria',
      tip: 'Respira, mira cada número y muévelo en tu ábaco imaginario.',
      hint: 'Ve con calma: es mejor acertar que ir rápido. Puedes ver los números otra vez.',
      next: '¡Completaste la ruta! Sigue practicando para ganar velocidad.',
      gen: rng => calc(genChain(rng, { count: 5, digits: 1, max: 45, rule: 'libre' }), { type: 'flash', intervalMs: 1300 })
    }
  ];

  // Módulos de la ruta: agrupan niveles con un objetivo común.
  const MODULES = [
    { title: 'Conozco el ábaco', objective: 'Formar y leer números en el soroban sin contar cuenta por cuenta.',
      concepts: ['Arriba vale 5, abajo vale 1', 'Solo cuentan las que tocan la barra', 'Derecha → izquierda: U, D, C'] },
    { title: 'Sumas y restas directas', objective: 'Sumar y restar moviendo las cuentas que caben sin ayuda.',
      concepts: ['Sumar = acercar a la barra', 'Restar = alejar de la barra', 'El pulgar sube, el índice baja'] },
    { title: 'Amigos del 5', objective: 'Usar la cuenta del cielo cuando no caben las de tierra.',
      concepts: ['1 y 4 son amigos', '2 y 3 son amigos', '+4 = +5 −1'] },
    { title: 'Amigos del 10', objective: 'Pasar a la varilla de la izquierda con los amigos del 10.',
      concepts: ['1·9  2·8  3·7  4·6  5·5', '+9 = −1 +10', '−9 = −10 +1'] },
    { title: 'Dos cifras', objective: 'Sumar y restar números de dos cifras, de izquierda a derecha.',
      concepts: ['Primero decenas, luego unidades', 'Cada varilla se trabaja sola', 'Usa amigos cuando no quepa'] },
    { title: 'Tres cifras', objective: 'Calcular con centenas sin perder precisión.',
      concepts: ['Centenas → decenas → unidades', 'Revisa la varilla del error', 'Precisión antes que velocidad'] },
    { title: 'Listas de soroban', objective: 'Sumar y restar varios números seguidos sin borrar el ábaco.',
      concepts: ['Mira el signo antes de mover', 'No borres entre números', 'Un número a la vez'] },
    { title: 'Anzan (ábaco mental)', objective: 'Calcular con un ábaco imaginario.',
      concepts: ['Imagina las cuentas', 'Muévelas en tu mente', 'Precisión primero'] }
  ].map(m => Object.assign(m, { levels: LEVELS.filter(l => l.group === m.title) }));

  function moduleOf(levelId) { return MODULES.find(m => m.levels.some(l => l.id === levelId)); }

  const LEVEL_BY_ID = Object.fromEntries(LEVELS.map(l => [l.id, l]));

  function getLevel(id) { return LEVEL_BY_ID[id] || LEVELS[0]; }

  function levelIndex(id) { return Math.max(0, LEVELS.findIndex(l => l.id === id)); }

  function nextLevel(id) { return LEVELS[Math.min(LEVELS.length - 1, levelIndex(id) + 1)]; }

  function previousLevel(id) { return LEVELS[Math.max(0, levelIndex(id) - 1)]; }

  // Varillas necesarias para un ejercicio (una más que el número más largo, mínimo 3).
  function rodsFor(ex) {
    let max = ex.value || 0;
    if (ex.terms) {
      let total = 0;
      for (const t of ex.terms) {
        total += t;
        max = Math.max(max, Math.abs(t), total);
      }
    }
    return Math.max(3, String(max).length + 1);
  }

  function exerciseKey(ex) {
    return ex.type + ':' + (ex.terms ? ex.terms.join(',') : ex.value);
  }

  // Hoja de ejercicios. Los primeros N siempre son iguales para la misma semilla,
  // sin importar cuántos se pidan.
  function buildSheet(levelId, seed, count) {
    const level = getLevel(levelId);
    const rng = makeRng(seed);
    const seen = new Set();
    const out = [];
    for (let i = 0; i < count; i++) {
      let ex;
      for (let tries = 0; tries < 8; tries++) {
        ex = level.gen(rng, i);
        if (!seen.has(exerciseKey(ex))) break;
      }
      seen.add(exerciseKey(ex));
      ex.rods = rodsFor(ex);
      out.push(ex);
    }
    return out;
  }

  /* ---------- Explicación paso a paso en el soroban ---------- */

  const PLACE = ['unidades', 'decenas', 'centenas', 'unidades de mil', 'decenas de mil', 'centenas de mil'];

  function cuentas(n) { return n === 1 ? '1 cuenta' : n + ' cuentas'; }

  // Cómo poner (o quitar) un dígito sin ayuda de amigos.
  function directText(n, verb) {
    if (n === 5) return `${verb} la cuenta del cielo`;
    if (n > 5) return `${verb} la cuenta del cielo y ${cuentas(n - 5)} de tierra`;
    return `${verb} ${cuentas(n)} de tierra`;
  }

  // Devuelve una lista de pasos { value, place, text } para resolver la operación en el soroban.
  function explain(terms) {
    let value = terms[0];
    const steps = [{ value, place: null, text: `Pon el ${value} en el ábaco.` }];
    for (let t = 1; t < terms.length; t++) {
      const term = terms[t];
      const adding = term >= 0;
      const ds = digitsOf(term);
      const order = ds.length > 1 ? ', empezando por la izquierda' : '';
      steps.push({ value, place: null, text: `${adding ? 'Ahora suma' : 'Ahora resta'} ${Math.abs(term)}${order}.` });
      for (let k = ds.length - 1; k >= 0; k--) {
        const n = ds[k];
        if (!n) continue;
        const p = 10 ** k;
        const d = Math.floor(value / p) % 10;
        const where = PLACE[k];
        const left = PLACE[k + 1];
        if (adding) {
          const kind = addKind(d, n);
          if (kind === 'directo') {
            value += n * p;
            steps.push({ value, place: k, text: `En las ${where}: ${directText(n, 'pon')}.` });
          } else if (kind === 'amigo5') {
            value += 5 * p;
            steps.push({ value, place: k, text: `En las ${where} no caben ${n} abajo: pon la cuenta del cielo (+5)…` });
            value -= (5 - n) * p;
            steps.push({ value, place: k, text: `…y quita ${cuentas(5 - n)} de tierra. ¡${n} y ${5 - n} son amigos del 5!` });
          } else {
            value -= (10 - n) * p;
            steps.push({ value, place: k, text: `En las ${where} no cabe el ${n}: quita ${10 - n}, su amigo del 10…` });
            const chain = Math.floor(value / (10 * p)) % 10 === 9 ? ` Como ahí hay un 9, se vuelve 0 y el 1 pasa a la siguiente varilla.` : '';
            value += 10 * p;
            steps.push({ value, place: k + 1, text: `…y suma 1 en las ${left}.${chain}` });
          }
        } else {
          const kind = subKind(d, n);
          if (kind === 'directo') {
            value -= n * p;
            steps.push({ value, place: k, text: `En las ${where}: ${directText(n, 'quita')}.` });
          } else if (kind === 'amigo5') {
            value += (5 - n) * p;
            steps.push({ value, place: k, text: `En las ${where} no hay ${n} abajo: pon ${cuentas(5 - n)} de tierra…` });
            value -= 5 * p;
            steps.push({ value, place: k, text: `…y quita la cuenta del cielo (−5). ¡${n} y ${5 - n} son amigos del 5!` });
          } else {
            const chain = Math.floor(value / (10 * p)) % 10 === 0 ? '. Como ahí hay un 0, pide prestado a la siguiente varilla y deja un 9' : '';
            value -= 10 * p;
            steps.push({ value, place: k + 1, text: `En las ${where} no alcanza para quitar ${n}: quita 1 en las ${left} (−10)${chain}…` });
            value += (10 - n) * p;
            steps.push({ value, place: k, text: `…y pon ${10 - n} en las ${where}. ¡${n} y ${10 - n} son amigos del 10!` });
          }
        }
      }
    }
    steps.push({ value, place: null, text: `¡Listo! El resultado es ${value}.` });
    return steps;
  }

  global.Curriculum = {
    LEVELS, MODULES, moduleOf, getLevel, levelIndex, nextLevel, previousLevel,
    buildSheet, explain, rodsFor, makeRng,
    addKind, subKind, columnKinds
  };
})(typeof window !== 'undefined' ? window : globalThis);
