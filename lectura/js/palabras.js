/*
 * Mi Lectura – palabras para los ejercicios visuales y de memoria.
 *
 * Son palabras frecuentes y conocidas por niños. Los ejercicios las agrupan
 * por número de letras y arman frases cortas (artículo + nombre + adjetivo)
 * que concuerdan en género.
 */
(function (global) {
  'use strict';

  const WORDS = (
    'sol mar pan luz paz oso ojo pie río mes día voz red sal flor ' +
    'casa mesa gato pato vaca mano nube lago pelo boca rosa luna cama sopa leche ' +
    'perro silla lápiz libro arena ratón verde azul rojo nido lobo foca tren isla ' +
    'mango arepa queso huevo fresa limón coco piña uva pera ' +
    'campo cielo playa monte selva nieve lluvia viento piedra tierra ' +
    'abuela abuelo mamá papá niña niño amiga amigo tío tía maestra ' +
    'escuela cuaderno ventana puerta camino jardín parque granja finca ' +
    'conejo caballo gallina tortuga ballena jirafa colibrí mariposa delfín cóndor ' +
    'zapato camisa sombrero pelota cometa globo dulce galleta ' +
    'cantar saltar correr leer jugar dormir comer reír mirar pintar ' +
    'grande pequeño feliz alegre rápido lento bonito suave fuerte nuevo ' +
    'estrella planeta cohete dragón castillo tesoro pirata sirena ' +
    'música guitarra tambor canción cuento dibujo regalo fiesta ' +
    'familia hermano hermana vecino doctora bombero cocinero ' +
    'mañana noche tarde invierno verano domingo semana ' +
    'naranja amarillo morado blanco negro rosado ' +
    'bicicleta mochila computador teléfono biblioteca ' +
    'montaña cascada volcán desierto bosque océano'
  ).split(/\s+/).filter(Boolean);

  // Nombres con su género para armar frases que concuerdan.
  const NOUNS = [
    ['gato', 'm'], ['perro', 'm'], ['oso', 'm'], ['pato', 'm'], ['libro', 'm'], ['globo', 'm'], ['tren', 'm'],
    ['sol', 'm'], ['río', 'm'], ['lago', 'm'], ['nido', 'm'], ['conejo', 'm'], ['caballo', 'm'], ['sombrero', 'm'],
    ['zapato', 'm'], ['cuento', 'm'], ['regalo', 'm'], ['dragón', 'm'], ['castillo', 'm'], ['tesoro', 'm'], ['cohete', 'm'],
    ['casa', 'f'], ['mesa', 'f'], ['vaca', 'f'], ['nube', 'f'], ['luna', 'f'], ['flor', 'f'], ['rosa', 'f'],
    ['silla', 'f'], ['pelota', 'f'], ['cometa', 'f'], ['tortuga', 'f'], ['ballena', 'f'], ['jirafa', 'f'],
    ['mariposa', 'f'], ['ventana', 'f'], ['puerta', 'f'], ['montaña', 'f'], ['estrella', 'f'], ['galleta', 'f'],
    ['mochila', 'f'], ['canción', 'f'], ['fiesta', 'f'], ['playa', 'f']
  ];

  // Adjetivos: [masculino, femenino].
  const ADJECTIVES = [
    ['grande', 'grande'], ['pequeño', 'pequeña'], ['feliz', 'feliz'], ['alegre', 'alegre'], ['rápido', 'rápida'],
    ['lento', 'lenta'], ['bonito', 'bonita'], ['suave', 'suave'], ['fuerte', 'fuerte'], ['nuevo', 'nueva'],
    ['rojo', 'roja'], ['azul', 'azul'], ['verde', 'verde'], ['blanco', 'blanca'], ['negro', 'negra'],
    ['amarillo', 'amarilla'], ['morado', 'morada'], ['dormido', 'dormida'], ['contento', 'contenta'], ['limpio', 'limpia']
  ];

  // Letras fáciles de distinguir (sin I ni l, que se confunden) y sílabas.
  const LETTERS = 'ABCDEFGHJKLMNOPRSTUVZ'.split('');
  const SYLLABLES = ['MA', 'PE', 'LU', 'SA', 'TO', 'NI', 'RO', 'DE', 'CA', 'FU', 'GO', 'BE', 'MI', 'PA', 'SU', 'TE', 'LO', 'NA', 'RI', 'VE'];

  const len = w => [...w].length;

  // Palabras de un largo (o rango de largos).
  function byLength(min, max) {
    return WORDS.filter(w => len(w) >= min && len(w) <= (max || min));
  }

  // Cuánto se parecen dos palabras: letras iguales en la misma posición y mismo largo.
  function similarity(a, b) {
    const A = [...a], B = [...b];
    let same = 0;
    for (let i = 0; i < Math.min(A.length, B.length); i++) if (A[i] === B[i]) same++;
    return same * 2 - Math.abs(A.length - B.length) * 3 + (A[0] === B[0] ? 2 : 0);
  }

  global.Palabras = { WORDS, NOUNS, ADJECTIVES, LETTERS, SYLLABLES, byLength, similarity, len };
})(window);
