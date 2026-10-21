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

  function numberEx(rng, i, pick) {
    const value = pick(rng);
    return { type: i % 2 === 0 ? 'poner' : 'leer', value, answer: value };
  }

  const fromList = list => rng => rng.pick(list);
  const fromRange = (a, b) => rng => rng.int(a, b);

  // Pregunta de opción múltiple, con las opciones en orden aleatorio.
  function choice(rng, q) {
    const options = q.options.slice();
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return Object.assign({ type: 'opciones' }, q, { options });
  }

  const PARTS_QUESTIONS = [
    { question: '¿Cuánto vale la cuenta de arriba, la del cielo?', options: ['5', '1', '10'], answer: '5', hint: 'La cuenta del cielo vale 5 cuando toca la barra.' },
    { question: '¿Cuánto vale cada cuenta de abajo, las de tierra?', options: ['1', '5', '4'], answer: '1', hint: 'Cada cuenta de tierra vale 1 cuando toca la barra.' },
    { question: '¿Qué número muestra el ábaco?', value: 0, options: ['0', '4', '5'], answer: '0', hint: 'Ninguna cuenta toca la barra: es el 0.' },
    { question: '¿Qué número muestra el ábaco?', value: 5, options: ['1', '4', '5'], answer: '5', hint: 'Solo la cuenta del cielo toca la barra.' },
    { question: '¿Qué número muestra el ábaco?', value: 1, options: ['1', '2', '5'], answer: '1', hint: 'Una cuenta de tierra toca la barra.' },
    { question: '¿Qué cuentas cuentan?', options: ['Las que tocan la barra', 'Las que están lejos', 'Todas'], answer: 'Las que tocan la barra', hint: 'Solo cuentan las cuentas pegadas a la barra del medio.' },
    { question: '¿Cuál varilla es la de las unidades?', options: ['La de la derecha', 'La del medio', 'La de la izquierda'], answer: 'La de la derecha', hint: 'Las unidades son la varilla de la derecha, la del punto.' },
    { question: '¿Con qué dedo subes las cuentas de tierra?', options: ['El pulgar', 'El índice', 'El meñique'], answer: 'El pulgar', hint: 'El pulgar sube las cuentas de tierra; el índice las baja.' }
  ];

  const FIVE_QUESTIONS = [
    { question: '¿Cómo se pone el 5?', options: ['Con la cuenta del cielo', 'Con 5 cuentas de tierra', 'Con 1 cuenta de tierra'], answer: 'Con la cuenta del cielo', hint: 'Solo hay 4 cuentas de tierra: el 5 es la cuenta del cielo.' },
    { question: '¿Cuántas cuentas de tierra tiene cada varilla?', options: ['4', '5', '10'], answer: '4', hint: 'Cuéntalas en tu ábaco: son 4 cuentas abajo.' }
  ];

  // Contar: el número que va después (o antes) de otro.
  function countEx(rng, i) {
    if (i % 3 === 0) {
      const from = rng.int(0, 8);
      return { type: 'poner', from, value: from + 1, answer: from + 1 };
    }
    if (i % 3 === 1) {
      const from = rng.int(1, 9);
      return { type: 'poner', from, value: from - 1, answer: from - 1 };
    }
    const value = rng.int(0, 9);
    return { type: 'leer', value, answer: value };
  }

  /* ---------- Niveles ---------- */
  // Cada nivel es una lección evolutiva: primero se entiende («Mira»), luego se hace
  // con ayuda («Juntos») y al final se practica sin ayuda («Tú»).
  // lesson.cards: tarjetas con el ábaco en un número y una explicación.
  // lesson.examples: operaciones que Mapi resuelve paso a paso.
  // targetSec: segundos por ejercicio para dominar el nivel (como los tiempos estándar de Kumon).

  const LEVELS = [
    {
      id: 'A1', group: 'Conozco el ábaco', name: 'Las partes del ábaco', targetSec: 15,
      instruction: 'Responde',
      tip: 'La cuenta de arriba (cielo) vale 5 y cada una de abajo (tierra) vale 1. Solo cuentan las que tocan la barra.',
      hint: 'Mira la barra del medio: solo cuentan las cuentas pegadas a ella.',
      next: 'Ahora vamos a contar del 1 al 4.',
      lesson: {
        cards: [
          { value: 0, text: 'Este es el soroban, el ábaco japonés. Tiene un marco, varillas y una barra en el medio.' },
          { value: 0, place: 0, text: 'Cada varilla tiene 1 cuenta arriba, la cuenta del cielo, y 4 cuentas abajo, las cuentas de tierra.' },
          { value: 5, place: 0, text: 'La cuenta del cielo vale 5. Solo cuenta cuando baja y toca la barra.' },
          { value: 1, place: 0, text: 'Cada cuenta de tierra vale 1. Solo cuenta cuando sube y toca la barra.' },
          { value: 0, text: 'Si ninguna cuenta toca la barra, el ábaco marca 0. Así lo dejamos limpio antes de empezar.' },
          { value: 0, place: 0, text: 'La varilla de la derecha, la del punto, son las unidades. Ahí empezamos a contar.' },
          { value: 0, text: 'El pulgar sube las cuentas de tierra. El índice las baja y mueve la cuenta del cielo.' }
        ]
      },
      gen: (rng, i) => i % 5 === 4 ? { type: 'poner', value: 0, answer: 0 } : choice(rng, rng.pick(PARTS_QUESTIONS))
    },
    {
      id: 'A2', group: 'Conozco el ábaco', name: 'Contar del 1 al 4', targetSec: 10,
      instruction: 'Pon o lee el número',
      tip: 'Sube las cuentas de tierra con el pulgar, una por una: 1, 2, 3, 4.',
      hint: 'Cuenta las cuentas de tierra que tocan la barra.',
      next: 'Después viene el 5, con la cuenta del cielo.',
      lesson: {
        cards: [
          { value: 0, place: 0, text: 'Empezamos con el ábaco limpio, en 0.' },
          { value: 1, place: 0, text: 'Sube 1 cuenta de tierra con el pulgar: es el 1.' },
          { value: 2, place: 0, text: 'Sube otra: 2.' },
          { value: 3, place: 0, text: 'Una más: 3.' },
          { value: 4, place: 0, text: 'Y otra: 4. ¡Ya usamos las 4 cuentas de tierra!' },
          { value: 0, place: 0, text: 'Para volver a 0, bájalas con el índice.' }
        ]
      },
      gen: (rng, i) => numberEx(rng, i, fromList([1, 2, 3, 4]))
    },
    {
      id: 'A3', group: 'Conozco el ábaco', name: 'El 5: la cuenta del cielo', targetSec: 10,
      instruction: 'Pon o lee el número',
      tip: 'El 5 no son 5 cuentas de tierra: es la cuenta del cielo.',
      hint: '¿Está la cuenta del cielo en la barra? Entonces hay 5.',
      next: 'Después: del 6 al 9.',
      lesson: {
        cards: [
          { value: 4, place: 0, text: 'Contamos hasta 4 y ya no quedan cuentas de tierra.' },
          { value: 5, place: 0, text: 'Para el 5 usamos la cuenta del cielo: bájala con el índice y baja las 4 de tierra.' },
          { value: 5, place: 0, text: 'El 5 es solo la cuenta del cielo tocando la barra.' },
          { value: 0, place: 0, text: 'Para quitar el 5, sube la cuenta del cielo y el ábaco vuelve a 0.' }
        ]
      },
      gen: (rng, i) => i % 4 === 3 ? choice(rng, rng.pick(FIVE_QUESTIONS)) : numberEx(rng, i, fromList([5, 5, 1, 2, 3, 4]))
    },
    {
      id: 'A4', group: 'Conozco el ábaco', name: 'Del 6 al 9', targetSec: 12,
      instruction: 'Pon o lee el número',
      tip: '6 es 5 y 1: la cuenta del cielo y 1 de tierra. Así hasta el 9.',
      hint: 'Primero mira el cielo (5) y luego suma las de tierra.',
      next: 'Después contarás seguido del 0 al 9.',
      lesson: {
        cards: [
          { value: 5, place: 0, text: 'Ya sabemos el 5: la cuenta del cielo.' },
          { value: 6, place: 0, text: '6 es 5 y 1: la cuenta del cielo y 1 de tierra.' },
          { value: 7, place: 0, text: '7 es 5 y 2.' },
          { value: 8, place: 0, text: '8 es 5 y 3.' },
          { value: 9, place: 0, text: '9 es 5 y 4. ¡Es el número más grande de una varilla!' }
        ]
      },
      gen: (rng, i) => numberEx(rng, i, fromList([6, 7, 8, 9, 5]))
    },
    {
      id: 'A5', group: 'Conozco el ábaco', name: 'Contar del 0 al 9', targetSec: 12,
      instruction: 'Cuenta en tu ábaco',
      tip: 'Contar es subir de uno en uno. Al llegar a 5 cambia: baja el cielo y quita las 4 de tierra.',
      hint: 'Pon el primer número y mueve una sola cuenta más (o menos).',
      next: 'Después: el 10 y la varilla de las decenas.',
      lesson: {
        cards: [
          { value: 0, place: 0, text: 'Vamos a contar de uno en uno. Empezamos en 0.' },
          { value: 1, place: 0, text: '1: sube una cuenta de tierra.' },
          { value: 2, place: 0, text: '2: sube otra.' },
          { value: 3, place: 0, text: '3: una más.' },
          { value: 4, place: 0, text: '4: ya no quedan cuentas de tierra.' },
          { value: 5, place: 0, text: '5: aquí cambia. Baja el cielo y quita las 4 de tierra.' },
          { value: 6, place: 0, text: '6: el cielo y 1 de tierra.' },
          { value: 7, place: 0, text: '7: el cielo y 2.' },
          { value: 8, place: 0, text: '8: el cielo y 3.' },
          { value: 9, place: 0, text: '9: el cielo y 4. ¡La varilla está llena!' },
          { value: 8, place: 0, text: 'Contar hacia atrás también vale: 9, 8, 7… quitando de una en una.' }
        ]
      },
      gen: countEx
    },
    {
      id: 'A6', group: 'Conozco el ábaco', name: 'El 10 y las decenas', targetSec: 12,
      instruction: 'Pon o lee el número',
      tip: 'El 10 es 1 cuenta en la varilla de las decenas, a la izquierda de las unidades.',
      hint: 'Mira la segunda varilla desde la derecha: cada cuenta de tierra ahí vale 10.',
      next: 'Después: todos los números hasta el 99.',
      lesson: {
        cards: [
          { value: 9, place: 0, text: 'Después del 9 ya no caben más cuentas en las unidades.' },
          { value: 10, place: 1, text: 'El 10 se pone con 1 cuenta en la varilla de la izquierda: las decenas. Las unidades quedan en 0.' },
          { value: 20, place: 1, text: '20 son 2 cuentas en las decenas.' },
          { value: 50, place: 1, text: '50 es la cuenta del cielo en las decenas.' },
          { value: 90, place: 1, text: '90 es el cielo y 4 de tierra en las decenas.' }
        ]
      },
      gen: (rng, i) => numberEx(rng, i, fromList([10, 20, 30, 40, 50, 60, 70, 80, 90]))
    },
    {
      id: 'A7', group: 'Conozco el ábaco', name: 'Números hasta el 99', targetSec: 15,
      instruction: 'Pon o lee el número',
      tip: 'Las decenas a la izquierda y las unidades a la derecha. 24 son 2 decenas y 4 unidades.',
      hint: 'Mira cada varilla por separado: primero las decenas, luego las unidades.',
      next: 'Después vienen las centenas.',
      lesson: {
        cards: [
          { value: 24, place: 1, text: '24: primero 2 en las decenas…' },
          { value: 24, place: 0, text: '…y 4 en las unidades.' },
          { value: 57, place: 1, text: '57: 5 en las decenas, con la cuenta del cielo…' },
          { value: 57, place: 0, text: '…y 7 en las unidades: el cielo y 2 de tierra.' },
          { value: 99, text: '99 es el número más grande con dos varillas.' }
        ]
      },
      gen: (rng, i) => numberEx(rng, i, fromRange(11, 99))
    },
    {
      id: 'A8', group: 'Conozco el ábaco', name: 'Números hasta el 999', targetSec: 18,
      instruction: 'Pon o lee el número',
      tip: 'La tercera varilla desde la derecha son las centenas. Una varilla sin cuentas es un 0.',
      hint: 'Lee de izquierda a derecha: centenas, decenas y unidades.',
      next: 'Ya sabes formar números: ¡ahora a sumar!',
      lesson: {
        cards: [
          { value: 100, place: 2, text: '100 es 1 cuenta en la tercera varilla: las centenas.' },
          { value: 305, place: 1, text: '305: 3 centenas, 0 decenas y 5 unidades. La varilla vacía es el 0.' },
          { value: 999, text: '999 es el más grande con tres varillas.' }
        ]
      },
      gen: (rng, i) => numberEx(rng, i, fromRange(100, 999))
    },
    {
      id: 'B1', group: 'Sumas y restas directas', name: 'Sumar con las cuentas de tierra', targetSec: 10,
      instruction: 'Suma',
      tip: 'Sumar es agregar: pon el primer número y sube más cuentas de tierra.',
      hint: 'Pon el primer número y luego sube las cuentas del segundo.',
      next: 'Después sumarás 5 o más con la cuenta del cielo.',
      lesson: {
        cards: [{ value: 2, place: 0, text: 'Sumar es agregar cuentas: las acercamos a la barra.' }],
        examples: [[2, 1], [1, 3]]
      },
      gen: rng => calc(genPair(rng, { op: '+', a: [1, 9], b: [1, 4], rule: 'directo' }))
    },
    {
      id: 'B2', group: 'Sumas y restas directas', name: 'Sumar 5 o más', targetSec: 10,
      instruction: 'Suma',
      tip: 'Para sumar 5 baja la cuenta del cielo. Para sumar 6, el cielo y 1 de tierra.',
      hint: 'Si sumas 5 o más, usa la cuenta del cielo.',
      next: 'Después: restar quitando cuentas.',
      lesson: {
        cards: [{ value: 0, place: 0, text: 'Para sumar 5 bajamos la cuenta del cielo.' }],
        examples: [[2, 5], [1, 7]]
      },
      gen: rng => calc(genPair(rng, { op: '+', a: [1, 4], b: [5, 8], rule: 'directo' }))
    },
    {
      id: 'B3', group: 'Sumas y restas directas', name: 'Restas directas', targetSec: 10,
      instruction: 'Resta',
      tip: 'Restar es quitar: alejamos cuentas de la barra.',
      hint: 'Pon el primer número y luego quita las cuentas del segundo.',
      next: 'Pronto conocerás a los amigos del 5.',
      lesson: {
        cards: [{ value: 4, place: 0, text: 'Restar es quitar cuentas: las alejamos de la barra.' }],
        examples: [[4, -3], [8, -5], [9, -6]]
      },
      gen: rng => calc(genPair(rng, { op: '-', digits: 1, rule: 'directo' }))
    },
    {
      id: 'C1', group: 'Amigos del 5', name: 'Sumar con los amigos del 5', targetSec: 12,
      instruction: 'Suma',
      tip: 'Amigos del 5: 1 y 4, 2 y 3. Si no caben abajo, pon el 5 de arriba y quita al amigo.',
      hint: '¿Cuánto le falta para 5? Ese es su amigo: pon el 5 y quita al amigo.',
      next: 'Después usarás los amigos del 5 para restar.',
      lesson: {
        cards: [
          { value: 4, place: 0, text: 'Tengo 4 y quiero sumar 1… ¡ya no quedan cuentas de tierra!' },
          { value: 4, place: 0, text: 'Los amigos del 5 son parejas que juntas hacen 5: 1 y 4, 2 y 3.' }
        ],
        examples: [[4, 1], [3, 3]]
      },
      gen: rng => calc(genPair(rng, { op: '+', digits: 1, rule: 'amigo5' }))
    },
    {
      id: 'C2', group: 'Amigos del 5', name: 'Restar con los amigos del 5', targetSec: 12,
      instruction: 'Resta',
      tip: 'Si no hay cuentas de tierra para quitar, pon al amigo abajo y quita el 5 de arriba.',
      hint: 'Pon al amigo del número en la tierra y luego quita el cielo.',
      next: 'Luego vienen los amigos del 10, que pasan a la varilla de la izquierda.',
      lesson: {
        cards: [{ value: 5, place: 0, text: 'Tengo 5 y quiero quitar 1… ¡no hay cuentas de tierra para quitar!' }],
        examples: [[5, -1], [6, -3]]
      },
      gen: rng => calc(genPair(rng, { op: '-', digits: 1, rule: 'amigo5' }))
    },
    {
      id: 'D1', group: 'Amigos del 10', name: 'Sumas que llevan', targetSec: 14,
      instruction: 'Suma',
      tip: 'Amigos del 10: 1 y 9, 2 y 8, 3 y 7, 4 y 6, 5 y 5. Quita al amigo y suma 1 a la izquierda.',
      hint: 'Si no cabe, quita al amigo del 10 y suma 1 en la varilla de la izquierda.',
      next: 'Después restarás pidiendo prestado a la izquierda.',
      lesson: {
        cards: [
          { value: 9, place: 0, text: 'Tengo 9 y quiero sumar 1… ¡la varilla está llena!' },
          { value: 9, place: 0, text: 'Los amigos del 10 juntos hacen 10: 1 y 9, 2 y 8, 3 y 7, 4 y 6, 5 y 5.' }
        ],
        examples: [[9, 1], [7, 5]]
      },
      gen: rng => calc(genPair(rng, { op: '+', digits: 1, rule: 'amigo10' }))
    },
    {
      id: 'D2', group: 'Amigos del 10', name: 'Restas que piden prestado', targetSec: 14,
      instruction: 'Resta',
      tip: 'Si no alcanza, quita 1 a la izquierda (10) y pon al amigo del número en esta varilla.',
      hint: 'Quita 1 en las decenas y pon al amigo del 10 en las unidades.',
      next: 'Luego mezclarás sumas y restas.',
      lesson: {
        cards: [{ value: 10, place: 0, text: 'Tengo 10 y quiero quitar 1: ¡las unidades están vacías!' }],
        examples: [[10, -1], [13, -6]]
      },
      gen: rng => calc(genPair(rng, { op: '-', a: [10, 18], b: [2, 9], rule: 'amigo10' }))
    },
    {
      id: 'D3', group: 'Amigos del 10', name: 'Sumas y restas mezcladas', targetSec: 16,
      instruction: 'Calcula de arriba a abajo',
      tip: 'Ve número por número. Mira el signo antes de mover las cuentas.',
      hint: 'Detente, mira el signo y luego mueve. Un número a la vez.',
      next: 'Pronto sumarás números de dos cifras.',
      lesson: {
        cards: [{ value: 0, text: 'Ahora hay sumas y restas juntas. Mira el signo antes de mover.' }],
        examples: [[8, 5, -3]]
      },
      gen: rng => calc(genChain(rng, { count: 3, digits: 1, max: 18, rule: 'libre' }))
    },
    {
      id: 'E1', group: 'Dos cifras', name: 'Sumas de 2 cifras sin llevar', targetSec: 15,
      instruction: 'Suma',
      tip: 'En el soroban se suma de izquierda a derecha: primero las decenas, luego las unidades.',
      hint: 'Primero las decenas, luego las unidades. Cada varilla se trabaja sola.',
      next: 'Después habrá sumas que llevan a la izquierda.',
      lesson: {
        cards: [{ value: 0, text: 'Con números de dos cifras trabajamos dos varillas: primero decenas, luego unidades.' }],
        examples: [[23, 45]]
      },
      gen: rng => calc(genPair(rng, { op: '+', digits: 2, rule: 'sinLlevada' }))
    },
    {
      id: 'E2', group: 'Dos cifras', name: 'Sumas de 2 cifras llevando', targetSec: 18,
      instruction: 'Suma',
      tip: 'Cuando una varilla no alcanza, usa al amigo del 10 y suma 1 en la varilla de la izquierda.',
      hint: '¿Usaste al amigo del 10 y sumaste 1 a la izquierda?',
      next: 'Luego vienen las restas de dos cifras.',
      lesson: { cards: [], examples: [[38, 25]] },
      gen: rng => calc(genPair(rng, { op: '+', digits: 2, rule: 'amigo10' }))
    },
    {
      id: 'E3', group: 'Dos cifras', name: 'Restas de 2 cifras', targetSec: 18,
      instruction: 'Resta',
      tip: 'Primero las decenas, luego las unidades. Si no alcanza, pide prestado a la izquierda.',
      hint: 'Resta varilla por varilla. Si no alcanza, pide prestado a la izquierda.',
      next: 'Pronto trabajarás con centenas.',
      lesson: { cards: [], examples: [[75, -32], [62, -28]] },
      gen: rng => calc(genPair(rng, { op: '-', digits: 2, rule: 'libre' }))
    },
    {
      id: 'F1', group: 'Tres cifras', name: 'Sumas de 3 cifras', targetSec: 25,
      instruction: 'Suma',
      tip: 'Centenas, decenas y unidades: una varilla a la vez, de izquierda a derecha.',
      hint: 'Busca la varilla donde apareció el error y comprueba si tenías que llevar 1.',
      next: 'Después, restas de tres cifras.',
      lesson: { cards: [], examples: [[235, 149]] },
      gen: rng => calc(genPair(rng, { op: '+', digits: 3, rule: 'libre' }))
    },
    {
      id: 'F2', group: 'Tres cifras', name: 'Restas de 3 cifras', targetSec: 25,
      instruction: 'Resta',
      tip: 'Ve con calma: mira cada varilla antes de mover.',
      hint: 'Revisa una varilla a la vez; si pediste prestado, comprueba que quitaste 1 a la izquierda.',
      next: 'Luego vendrán listas de números, como en las competencias de soroban.',
      lesson: { cards: [], examples: [[376, -131]] },
      gen: rng => calc(genPair(rng, { op: '-', digits: 3, rule: 'libre' }))
    },
    {
      id: 'G1', group: 'Listas de soroban', name: 'Listas de 4 números (1 cifra)', targetSec: 20,
      instruction: 'Calcula de arriba a abajo',
      tip: 'No borres el ábaco entre números: cada número se suma o resta al anterior.',
      hint: 'No borres entre números. Si te pierdes, empieza la lista otra vez.',
      next: 'Luego harás listas con números de dos cifras.',
      lesson: {
        cards: [{ value: 0, text: 'En una lista no se borra el ábaco: cada número se suma o resta al anterior.' }],
        examples: [[4, 3, -2, 5]]
      },
      gen: rng => calc(genChain(rng, { count: 4, digits: 1, max: 99, rule: 'libre' }))
    },
    {
      id: 'G2', group: 'Listas de soroban', name: 'Listas de 4 números (2 cifras)', targetSec: 35,
      instruction: 'Calcula de arriba a abajo',
      tip: 'Decenas primero, unidades después, número por número.',
      hint: 'Decenas primero, unidades después. Revisa los signos.',
      next: 'Después calcularás con el ábaco imaginario: anzan.',
      lesson: { cards: [], examples: [[25, 13, -18, 30]] },
      gen: rng => calc(genChain(rng, { count: 4, digits: 2, max: 999, rule: 'libre' }))
    },
    {
      id: 'H1', group: 'Anzan (ábaco mental)', name: 'Flash de 3 números', targetSec: 15,
      instruction: 'Calcula de memoria',
      tip: 'Imagina el ábaco en tu cabeza y mueve las cuentas con la mente.',
      hint: 'Imagina el ábaco y mueve las cuentas en tu mente con cada número.',
      next: 'Luego, más números y más rápido.',
      lesson: {
        cards: [{ value: 0, text: 'Ahora el ábaco está en tu cabeza. Cierra los ojos e imagina las cuentas mientras ves cada número.' }],
        examples: [[3, 4, -2]]
      },
      gen: rng => calc(genChain(rng, { count: 3, digits: 1, max: 18, rule: 'libre' }), { type: 'flash', intervalMs: 1600 })
    },
    {
      id: 'H2', group: 'Anzan (ábaco mental)', name: 'Flash de 5 números', targetSec: 20,
      instruction: 'Calcula de memoria',
      tip: 'Respira, mira cada número y muévelo en tu ábaco imaginario.',
      hint: 'Ve con calma: es mejor acertar que ir rápido. Puedes ver los números otra vez.',
      next: '¡Completaste la ruta! Sigue practicando para ganar velocidad.',
      lesson: { cards: [], examples: [[2, 5, 1, -3, 4]] },
      gen: rng => calc(genChain(rng, { count: 5, digits: 1, max: 45, rule: 'libre' }), { type: 'flash', intervalMs: 1300 })
    }
  ];

  // Módulos de la ruta: agrupan niveles con un objetivo común.
  const MODULES = [
    { title: 'Conozco el ábaco', objective: 'Conocer el soroban, contar y formar números sin contar cuenta por cuenta.',
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
    let max = Math.max(ex.value || 0, ex.from || 0);
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
    return [ex.type, ex.question, ex.terms ? ex.terms.join(',') : ex.value, ex.from].join(':');
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
            steps.push({ value, place: k, text: `En las ${where} no ${n === 1 ? 'cabe' : 'caben'} ${n} abajo: pon la cuenta del cielo (+5)…` });
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

  // Cómo poner un número, varilla por varilla, de izquierda a derecha.
  function explainSet(v) {
    const ds = digitsOf(v);
    const steps = [{ value: 0, place: null, text: 'Empezamos con el ábaco limpio, en 0.' }];
    let value = 0;
    for (let k = ds.length - 1; k >= 0; k--) {
      const d = ds[k];
      if (!d) {
        if (ds.length > 1) steps.push({ value, place: k, text: `En las ${PLACE[k]} no ponemos nada: es un 0.` });
        continue;
      }
      value += d * 10 ** k;
      steps.push({ value, place: k, text: `En las ${PLACE[k]}: ${directText(d, 'pon')}.` });
    }
    steps.push({ value: v, place: null, text: v === 0 ? 'El 0 es el ábaco limpio: ninguna cuenta toca la barra.' : `¡Así se ve el ${v}!` });
    return steps;
  }

  function beadsText(d) {
    if (d === 0) return 'ninguna cuenta toca la barra';
    if (d === 5) return 'está la cuenta del cielo';
    if (d > 5) return `está la cuenta del cielo y ${cuentas(d - 5)} de tierra`;
    return `hay ${cuentas(d)} de tierra`;
  }

  // Cómo leer un número, varilla por varilla.
  function explainRead(v) {
    const ds = digitsOf(v);
    const steps = [{ value: v, place: null, text: ds.length > 1 ? 'Leemos de izquierda a derecha, varilla por varilla.' : 'Miramos la varilla de las unidades.' }];
    for (let k = ds.length - 1; k >= 0; k--) {
      steps.push({ value: v, place: k, text: `En las ${PLACE[k]} ${beadsText(ds[k])}: ${ds[k]}.` });
    }
    steps.push({ value: v, place: null, text: `Es el ${v}.` });
    return steps;
  }

  // Texto corto del ejercicio, para mostrarlo encima del ábaco o en la corrección.
  function exprText(ex) {
    if (ex.type === 'opciones') return ex.question;
    if (ex.type === 'leer') return '¿Qué número es?';
    if (ex.type === 'poner') {
      if (ex.from === undefined) return `Pon el ${ex.value}`;
      return ex.value > ex.from ? `${ex.from} → ?` : `? ← ${ex.from}`;
    }
    return ex.terms.map((t, i) => (i === 0 ? '' : t < 0 ? ' − ' : ' + ') + Math.abs(t)).join('') + ' = ?';
  }

  function sayCount(ex) {
    return ex.value > ex.from ? `el número que va después del ${ex.from}` : `el número que va antes del ${ex.from}`;
  }

  // Pasos para hacer un ejercicio juntos («Juntos»).
  function guidedSteps(ex) {
    if (ex.type === 'opciones') {
      return [
        { value: ex.value, place: null, text: `${ex.question} Pista: ${ex.hint}` },
        { value: ex.value, place: null, text: `La respuesta es: ${ex.answer}.` }
      ];
    }
    if (ex.type === 'leer') return explainRead(ex.value);
    if (ex.type === 'poner') {
      if (ex.from === undefined) return explainSet(ex.value);
      const steps = explain([ex.from, ex.value - ex.from]);
      steps[1] = Object.assign({}, steps[1], { text: ex.value > ex.from ? 'Contamos uno más.' : 'Contamos uno menos.' });
      steps[steps.length - 1] = { value: ex.value, place: null, text: `${ex.value} es ${sayCount(ex)}.` };
      return steps;
    }
    return explain(ex.terms);
  }

  // Lección «Mira»: tarjetas del concepto y ejemplos resueltos paso a paso.
  function lessonSteps(levelId) {
    const level = getLevel(levelId);
    const lesson = level.lesson || { cards: [] };
    const steps = lesson.cards.map(c => ({ value: c.value, place: c.place === undefined ? null : c.place, text: c.text }));
    (lesson.examples || []).forEach(terms => {
      const expr = exprText({ type: 'calculo', terms });
      explain(terms).forEach((s, i) => steps.push(Object.assign({ expr }, s, i === 0 ? { text: `Mira cómo se hace ${expr.replace(' = ?', '')}. ${s.text}` } : {})));
    });
    let max = 0;
    steps.forEach(s => { max = Math.max(max, s.value || 0); });
    return { steps, rods: Math.max(3, String(max).length + 1) };
  }

  global.Curriculum = {
    LEVELS, MODULES, moduleOf, getLevel, levelIndex, nextLevel, previousLevel,
    buildSheet, explain, explainSet, explainRead, guidedSteps, lessonSteps, exprText, sayCount, rodsFor, makeRng,
    addKind, subKind, columnKinds
  };
})(typeof window !== 'undefined' ? window : globalThis);
