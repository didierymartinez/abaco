/* Textos originales para Mi Lectura: niveles 1 a 3 (inicio de la lectura). */
window.TEXTOS = (window.TEXTOS || []).concat([

  /* ───────────── NIVEL 1 ───────────── */
  {
    id: 'n1-01', level: 1, title: 'La gata Luna', emoji: '🐱',
    text: 'Luna es una gata gris. Le gusta jugar con su pelota roja. Un día, la pelota no está. Luna busca en la sala. Busca debajo de la mesa. ¡Nada! Luego mira en su cama. ¡Ahí está la pelota! Luna maúlla feliz.',
    questions: [
      { kind: 'literal', q: '¿De qué color es Luna?', options: ['gris', 'negra', 'blanca'] },
      { kind: 'inferencia', q: '¿Por qué Luna busca por toda la casa?', options: ['Porque no encuentra su pelota', 'Porque tiene hambre', 'Porque quiere dormir'] },
      { kind: 'vocabulario', q: '¿Qué hace Luna cuando «maúlla»?', options: ['Dice «miau»', 'Salta muy alto', 'Se duerme'] }
    ],
    recall: { q: '¿Dónde estaba la pelota de Luna?', options: ['en su cama', 'debajo de la mesa', 'en el jardín'] },
    order: ['La pelota de Luna no está', 'Luna busca debajo de la mesa', 'Luna encuentra la pelota en su cama']
  },
  {
    id: 'n1-02', level: 1, title: 'La rana', emoji: '🐸',
    text: 'Muchas ranas ponen huevos en el agua. De cada huevo sale un renacuajo. El renacuajo nada con su cola. Poco a poco le salen patas. La cola se hace pequeña. Al final, es una rana. ¡Ya puede saltar fuera del agua!',
    questions: [
      { kind: 'literal', q: '¿Dónde ponen sus huevos muchas ranas?', options: ['en el agua', 'en la arena', 'en la nieve'] },
      { kind: 'inferencia', q: '¿Por qué al final la rana puede saltar?', options: ['Porque ya tiene patas', 'Porque tiene una cola larga', 'Porque todavía es un huevo'] },
      { kind: 'vocabulario', q: '¿Qué es un renacuajo?', options: ['una rana bebé', 'un pez muy grande', 'un huevo de pájaro'] }
    ],
    recall: { q: '¿Con qué nada el renacuajo?', options: ['con su cola', 'con sus alas', 'con sus orejas'] },
    order: ['Las ranas ponen huevos en el agua', 'Del huevo sale un renacuajo', 'Al renacuajo le salen patas']
  },
  {
    id: 'n1-03', level: 1, title: 'Pepe y el charco', emoji: '☔',
    text: 'Hoy llueve mucho. Pepe mira por la ventana. Quiere salir a jugar. Mamá le da sus botas de caucho. Pepe y mamá salen al patio. Ven un charco grande. ¡Plaf! Pepe salta en el charco. El agua moja a mamá. ¡Los dos se ríen!',
    questions: [
      { kind: 'literal', q: '¿Qué le da mamá a Pepe?', options: ['sus botas de caucho', 'un paraguas rojo', 'una pelota'] },
      { kind: 'inferencia', q: '¿Por qué mamá le da botas a Pepe?', options: ['Para no mojarse los pies', 'Para jugar fútbol', 'Para irse a dormir'] },
      { kind: 'vocabulario', q: '¿Qué es un charco?', options: ['agua de lluvia en el suelo', 'un árbol muy grande', 'una casa pequeña'] }
    ],
    recall: { q: '¿A quién moja el agua del charco?', options: ['a mamá', 'al perro', 'a la abuela'] },
    order: ['Pepe mira la lluvia por la ventana', 'Pepe y mamá salen al patio', 'Pepe salta en el charco']
  },
  {
    id: 'n1-04', level: 1, title: 'El colibrí', emoji: '🐦',
    text: 'El colibrí es un pájaro muy pequeño. Mueve sus alas muy rápido. Sus alas hacen un zumbido. Mete su pico en las flores. Así toma néctar. Puede volar hacia atrás. También se queda quieto en el aire. En Colombia hay muchas clases de colibríes.',
    questions: [
      { kind: 'literal', q: '¿Cómo es el colibrí según el texto?', options: ['un pájaro muy pequeño', 'un pájaro muy grande', 'un pájaro que no vuela'] },
      { kind: 'inferencia', q: '¿Por qué las alas del colibrí hacen un zumbido?', options: ['Porque se mueven muy rápido', 'Porque el colibrí canta fuerte', 'Porque tiene el pico largo'] },
      { kind: 'vocabulario', q: '¿Qué es el néctar que toma el colibrí?', options: ['un jugo dulce de las flores', 'un insecto pequeño', 'una semilla dura'] }
    ],
    recall: { q: '¿Qué puede hacer el colibrí?', options: ['volar hacia atrás', 'nadar en el río', 'hablar como un loro'] },
    order: ['El colibrí mueve sus alas muy rápido', 'El colibrí mete su pico en las flores', 'En Colombia hay muchas clases de colibríes']
  },
  {
    id: 'n1-05', level: 1, title: 'La arepa de corazón', emoji: '🌽',
    text: 'La abuela Rosa hace arepas. Sara la ayuda. La abuela hace bolitas de masa. Sara las aplasta con las manos. ¡Una queda con forma de corazón! Las arepas se asan en la parrilla. La de corazón es para papá. ¡Papá sonríe!',
    questions: [
      { kind: 'literal', q: '¿Quién hace las bolitas de masa?', options: ['la abuela Rosa', 'Sara', 'papá'] },
      { kind: 'inferencia', q: '¿Cómo se siente papá con la arepa de corazón?', options: ['contento', 'triste', 'enojado'] },
      { kind: 'vocabulario', q: 'Sara «aplasta» las bolitas. ¿Qué significa?', options: ['Las pone planas', 'Las tira al piso', 'Las pinta de colores'] }
    ],
    recall: { q: '¿Qué forma tiene la arepa especial?', options: ['de corazón', 'de estrella', 'de gato'] },
    order: ['La abuela hace bolitas de masa', 'Sara aplasta las bolitas con las manos', 'La arepa de corazón es para papá']
  },
  {
    id: 'n1-06', level: 1, title: 'El perro Toto', emoji: '🐶',
    text: 'Toto es un perro café. Le gusta esconder cosas en el jardín. Hoy papá no encuentra su zapato. Busca y busca. Toto mueve la cola. Corre al jardín y escarba. ¡Ahí está el zapato! Está lleno de tierra. Papá se ríe.',
    questions: [
      { kind: 'literal', q: '¿Qué no encuentra papá?', options: ['su zapato', 'su sombrero', 'sus llaves'] },
      { kind: 'inferencia', q: '¿Quién escondió el zapato de papá?', options: ['Toto', 'papá', 'un gato'] },
      { kind: 'vocabulario', q: 'Toto «escarba» en el jardín. ¿Qué significa?', options: ['Hace un hueco en la tierra', 'Ladra muy fuerte', 'Duerme en el pasto'] }
    ],
    recall: { q: '¿Cómo estaba el zapato cuando apareció?', options: ['lleno de tierra', 'lleno de agua', 'limpio y nuevo'] },
    order: ['Papá no encuentra su zapato', 'Toto corre al jardín y escarba', 'Aparece el zapato lleno de tierra']
  },

  /* ───────────── NIVEL 2 ───────────── */
  {
    id: 'n2-01', level: 2, title: 'La cometa de Juana', emoji: '🪁',
    text: 'En agosto hace mucho viento. Juana y su abuelo hacen una cometa. Usan papel, palitos e hilo. Van al parque a elevarla. Al principio, la cometa da vueltas y cae. El abuelo dice que le falta cola. Juana le pega una cola larga de papel. Luego sostiene el hilo con fuerza. Ahora la cometa sube muy alto. ¡Parece un pájaro de colores!',
    questions: [
      { kind: 'literal', q: '¿Adónde van a elevar la cometa?', options: ['al parque', 'a la playa', 'al colegio'] },
      { kind: 'inferencia', q: '¿Por qué la cometa sube al final?', options: ['Porque ya tiene cola', 'Porque dejó de hacer viento', 'Porque le quitaron el hilo'] },
      { kind: 'vocabulario', q: 'Van al parque a «elevarla». ¿Qué significa?', options: ['hacerla subir al cielo', 'guardarla en una caja', 'pintarla de colores'] }
    ],
    recall: { q: '¿Con quién hace Juana la cometa?', options: ['con su abuelo', 'con su mamá', 'con su hermano'] },
    order: ['Juana y su abuelo hacen una cometa', 'La cometa da vueltas y cae', 'La cometa sube muy alto']
  },
  {
    id: 'n2-02', level: 2, title: 'La luna', emoji: '🌙',
    text: 'De noche miramos la luna en el cielo. La luna brilla, pero no tiene luz propia. La luz que vemos viene del sol. El sol ilumina la luna como una linterna. La luna también parece cambiar de forma. A veces la vemos redonda. Otras veces parece una sonrisa delgada. Pero la luna no cambia de verdad. Solo cambia la parte iluminada que vemos.',
    questions: [
      { kind: 'literal', q: '¿De dónde viene la luz de la luna?', options: ['del sol', 'de las nubes', 'de un volcán'] },
      { kind: 'inferencia', q: 'Si la luna parece una sonrisa delgada, ¿qué está pasando?', options: ['Vemos solo un pedacito iluminado', 'La luna se rompió', 'La luna se hizo más pequeña'] },
      { kind: 'vocabulario', q: 'La luna «no tiene luz propia». ¿Qué quiere decir?', options: ['Que no hace su propia luz', 'Que su luz es roja', 'Que nunca brilla'] }
    ],
    recall: { q: '¿Con qué compara el texto al sol?', options: ['con una linterna', 'con una vela', 'con un bombillo'] },
    order: ['La luna brilla de noche', 'La luz de la luna viene del sol', 'La luna parece cambiar de forma']
  },
  {
    id: 'n2-03', level: 2, title: 'El diente flojo', emoji: '🦷',
    text: 'Paula tiene un diente flojo. Se mueve como una puerta vieja. Ella lo toca con la lengua todo el día. En la tarde, come una manzana. ¡Crac! Algo cae en su mano. ¡Es el diente! Paula corre a mostrárselo a mamá. Mamá dice que pronto saldrá un diente nuevo. Paula se mira al espejo y se ríe. Ahora tiene una ventanita en la boca.',
    questions: [
      { kind: 'literal', q: '¿Qué come Paula en la tarde?', options: ['una manzana', 'una arepa', 'un helado'] },
      { kind: 'inferencia', q: '¿Cómo se siente Paula al mirarse al espejo?', options: ['alegre', 'asustada', 'enojada'] },
      { kind: 'vocabulario', q: '¿Qué es la «ventanita» en la boca de Paula?', options: ['el hueco del diente', 'una herida', 'un diente nuevo'] }
    ],
    recall: { q: '¿Qué le dice mamá a Paula?', options: ['Que pronto saldrá un diente nuevo', 'Que no coma más manzanas', 'Que se vaya a dormir'] },
    order: ['Paula tiene un diente flojo', 'El diente cae en su mano', 'Paula se ríe frente al espejo']
  },
  {
    id: 'n2-04', level: 2, title: 'Las abejas', emoji: '🐝',
    text: 'Las abejas viven juntas en una colmena. Vuelan de flor en flor. Toman néctar y lo llevan a la colmena. Con ese néctar hacen la miel. En las flores también hay polen. El polen es un polvito fino. Se les pega a las abejas en el cuerpo. Así lo llevan de una flor a otra. Eso ayuda a las plantas a dar frutas. ¡Las abejas son muy importantes!',
    questions: [
      { kind: 'literal', q: '¿Con qué hacen la miel las abejas?', options: ['con néctar', 'con hojas secas', 'con agua del río'] },
      { kind: 'inferencia', q: '¿Qué pasaría si no hubiera abejas?', options: ['Habría menos frutas', 'Habría más miel', 'Las flores serían azules'] },
      { kind: 'vocabulario', q: '¿Qué es una colmena?', options: ['la casa de las abejas', 'una flor amarilla', 'un tipo de miel'] }
    ],
    recall: { q: '¿Qué se les pega a las abejas en el cuerpo?', options: ['el polen', 'el barro', 'la pintura'] },
    order: ['Las abejas viven en una colmena', 'Con el néctar hacen la miel', 'Llevan polen de una flor a otra']
  },
  {
    id: 'n2-05', level: 2, title: 'La gallina Pinta', emoji: '🐣',
    text: 'Lucas está de vacaciones en la finca del abuelo. Cada mañana recogen huevos en el gallinero. Hoy falta la gallina Pinta. La buscan en la huerta y junto al río. No está por ningún lado. De pronto, Lucas oye un pío, pío. Viene de unos arbustos. ¡Ahí está Pinta con cinco pollitos! El abuelo y Lucas se ríen de la sorpresa.',
    questions: [
      { kind: 'literal', q: '¿Cuántos pollitos tiene Pinta?', options: ['cinco', 'dos', 'diez'] },
      { kind: 'inferencia', q: '¿Por qué Pinta no estaba en el gallinero?', options: ['Estaba cuidando a sus pollitos', 'Se fue a nadar al río', 'Estaba dormida en la casa'] },
      { kind: 'vocabulario', q: '¿Qué es un gallinero?', options: ['el lugar donde viven las gallinas', 'un gallo muy grande', 'una huerta de maíz'] }
    ],
    recall: { q: '¿Dónde encontraron a Pinta?', options: ['en unos arbustos', 'junto al río', 'en la huerta'] },
    order: ['Lucas y el abuelo recogen huevos', 'Buscan a Pinta en la huerta', 'Encuentran a Pinta con pollitos']
  },
  {
    id: 'n2-06', level: 2, title: 'El corazón', emoji: '❤️',
    text: 'El corazón está dentro de tu pecho. Es más o menos del tamaño de tu puño. El corazón es un músculo que trabaja sin parar. Late de día y de noche, aun cuando duermes. Con cada latido, mueve la sangre por el cuerpo. Cuando corres, late más rápido. Pon la mano en tu pecho después de saltar. ¿Sientes el pum, pum?',
    questions: [
      { kind: 'literal', q: '¿Cuándo late más rápido el corazón?', options: ['cuando corres', 'cuando duermes', 'cuando estás quieto'] },
      { kind: 'inferencia', q: '¿Para qué te pide el texto saltar antes de tocar tu pecho?', options: ['Para sentir mejor los latidos', 'Para calentar tu mano', 'Para que el corazón se detenga'] },
      { kind: 'vocabulario', q: '¿Qué es un «latido»?', options: ['cada golpecito del corazón', 'un tipo de sangre', 'un hueso del pecho'] }
    ],
    recall: { q: '¿De qué tamaño es el corazón, más o menos?', options: ['como tu puño', 'como una sandía', 'como un fríjol'] },
    order: ['El corazón está dentro de tu pecho', 'El corazón mueve la sangre por el cuerpo', 'Al correr, el corazón late más rápido']
  },

  /* ───────────── NIVEL 3 ───────────── */
  {
    id: 'n3-01', level: 3, title: 'El cóndor de los Andes', emoji: '🦅',
    text: 'El cóndor de los Andes es un ave enorme. Es una de las aves voladoras más grandes del mundo. Vive en las montañas altas. Sus plumas son negras, con un collar blanco en el cuello. Su cabeza no tiene plumas.\n\nEl cóndor casi no mueve las alas. Las abre bien y se deja llevar por el viento. Así puede planear durante mucho tiempo. Come animales que ya están muertos. De esa forma ayuda a limpiar el campo. El cóndor aparece en el escudo de Colombia. Hoy quedan pocos, por eso debemos cuidarlos.',
    questions: [
      { kind: 'literal', q: '¿De qué color es el collar del cóndor?', options: ['blanco', 'rojo', 'negro'] },
      { kind: 'inferencia', q: '¿Por qué el texto dice que el cóndor ayuda a limpiar el campo?', options: ['Porque se come los animales muertos', 'Porque barre con sus alas', 'Porque recoge la basura'] },
      { kind: 'vocabulario', q: 'El cóndor puede «planear». ¿Qué significa aquí?', options: ['volar casi sin mover las alas', 'hacer un plan', 'caminar despacio'] }
    ],
    recall: { q: '¿En qué símbolo de Colombia aparece el cóndor?', options: ['en el escudo', 'en la bandera', 'en el mapa'] },
    order: ['El cóndor es un ave enorme de las montañas', 'El cóndor planea casi sin mover las alas', 'El cóndor aparece en el escudo de Colombia']
  },
  {
    id: 'n3-02', level: 3, title: 'Las gafas de la abuela', emoji: '👓',
    text: 'La abuela Inés no encuentra sus gafas. Las busca en la cocina, en el patio y debajo del sofá. Martín, su nieto, la ayuda a buscar. Revisan los cajones y hasta la nevera. ¡Nada!\n\nEntonces Paco, el loro, empieza a gritar: —¡Cabeza, cabeza! —Ahora no, Paco —dice la abuela—. Estoy ocupada. Martín mira a la abuela y suelta una carcajada. ¡Las gafas estaban sobre su cabeza! —Gracias, Paco. ¡Eres un loro muy listo! —dice ella. Luego le da un pedacito de mango.',
    questions: [
      { kind: 'literal', q: '¿Quién ayuda a la abuela a buscar las gafas?', options: ['Martín, su nieto', 'su vecina', 'el cartero'] },
      { kind: 'inferencia', q: '¿Por qué Paco gritaba «¡Cabeza, cabeza!»?', options: ['Quería decir dónde estaban las gafas', 'Le dolía la cabeza', 'Quería comer mango'] },
      { kind: 'vocabulario', q: 'Martín «suelta una carcajada». ¿Qué significa?', options: ['Se ríe muy fuerte', 'Deja caer algo', 'Llora un poquito'] }
    ],
    recall: { q: '¿Dónde estaban las gafas de la abuela?', options: ['sobre su cabeza', 'en la nevera', 'debajo del sofá'] },
    order: ['La abuela busca sus gafas por toda la casa', 'Paco, el loro, grita «¡Cabeza, cabeza!»', 'Martín descubre dónde estaban las gafas']
  },
  {
    id: 'n3-03', level: 3, title: 'El páramo', emoji: '⛰️',
    text: 'El páramo es un lugar muy alto en las montañas. Allí hace frío y casi siempre hay niebla. Colombia es el país con más páramos del mundo. En el páramo crecen los frailejones. Sus hojas tienen pelitos suaves, como una cobija. Esos pelitos los protegen del frío.\n\nEl páramo funciona como una esponja gigante. Guarda el agua de la lluvia y de la niebla. Luego la suelta poco a poco. Así nacen muchos ríos y quebradas. Por eso, cuidar el páramo es cuidar el agua que tomamos.',
    questions: [
      { kind: 'literal', q: '¿Cómo es el clima del páramo?', options: ['frío y con niebla', 'caliente y seco', 'soleado y con arena'] },
      { kind: 'inferencia', q: '¿Qué les pasaría a los ríos si se daña el páramo?', options: ['Tendrían menos agua', 'Tendrían más agua', 'Tendrían más peces'] },
      { kind: 'vocabulario', q: 'El páramo funciona «como una esponja gigante». ¿Qué quiere decir?', options: ['Que guarda agua y la suelta despacio', 'Que es suave y amarillo', 'Que sirve para lavar platos'] }
    ],
    recall: { q: '¿Cómo se llaman las plantas del páramo que tienen pelitos?', options: ['los frailejones', 'los girasoles', 'los mangos'] },
    order: ['El páramo es frío y tiene niebla', 'Los frailejones tienen hojas con pelitos', 'Del páramo nacen ríos y quebradas']
  },
  {
    id: 'n3-04', level: 3, title: 'El fríjol de Valentina', emoji: '🌱',
    text: 'En el colegio, cada estudiante recibe un fríjol. Valentina pone el suyo en un vaso con algodón mojado. Lo deja junto a la ventana, donde entra el sol.\n\nAl día siguiente, corre a mirarlo. No pasa nada. Al otro día, tampoco. —¿Y si está dormido? —le pregunta a su papá. —Las semillas necesitan tiempo —responde él—. Solo dale agua y espera. Valentina espera con paciencia. Una mañana, el fríjol se abre y sale una raíz blanca. Días después, aparecen dos hojitas verdes. ¡Valentina aplaude feliz!',
    questions: [
      { kind: 'literal', q: '¿Dónde pone Valentina el fríjol?', options: ['en un vaso con algodón', 'en una maceta con tierra', 'en su lonchera'] },
      { kind: 'inferencia', q: '¿Por qué Valentina pregunta si el fríjol está dormido?', options: ['Porque no lo ve crecer', 'Porque ya es de noche', 'Porque el fríjol ronca'] },
      { kind: 'vocabulario', q: 'Valentina espera «con paciencia». ¿Cómo espera?', options: ['tranquila y sin afán', 'enojada y con prisa', 'dormida en su cama'] }
    ],
    recall: { q: '¿Qué le sale primero al fríjol?', options: ['una raíz blanca', 'dos hojitas verdes', 'una flor roja'] },
    order: ['Valentina pone el fríjol en algodón mojado', 'Papá le dice que las semillas necesitan tiempo', 'Al fríjol le salen raíz y hojitas']
  },
  {
    id: 'n3-05', level: 3, title: '¿De dónde viene la lluvia?', emoji: '🌧️',
    text: '¿Te has preguntado de dónde viene la lluvia? Todo empieza con el sol. El sol calienta el agua de mares, ríos y lagos. Parte de esa agua se convierte en vapor. El vapor es tan liviano que sube al cielo. Pero no lo podemos ver.\n\nArriba, en el cielo, hace frío. Allí el vapor forma gotitas muy pequeñas. Muchas gotitas juntas forman las nubes. Cuando las gotas crecen y pesan mucho, caen. ¡Eso es la lluvia! Después, el agua vuelve a los ríos y al mar. Y todo empieza otra vez.',
    questions: [
      { kind: 'literal', q: '¿Qué calienta el agua de mares, ríos y lagos?', options: ['el sol', 'la luna', 'el viento'] },
      { kind: 'inferencia', q: '¿Por qué el texto dice «todo empieza otra vez»?', options: ['Porque el agua vuelve a subir y a caer', 'Porque el sol se apaga', 'Porque la lluvia se acaba para siempre'] },
      { kind: 'vocabulario', q: 'El vapor es «liviano». ¿Qué significa?', options: ['Que pesa poco', 'Que es muy frío', 'Que es de color azul'] }
    ],
    recall: { q: '¿Qué forman muchas gotitas juntas en el cielo?', options: ['las nubes', 'las estrellas', 'la luna'] },
    order: ['El sol calienta el agua', 'El vapor sube al cielo', 'Las gotas pesadas caen como lluvia']
  },
  {
    id: 'n3-06', level: 3, title: 'La sorpresa para papá', emoji: '🎈',
    text: 'Hoy es el cumpleaños de papá. Ana y su hermano Nico preparan una sorpresa. Hacen una tarjeta con dibujos y llenan la sala de bombas. Luego apagan la luz y se esconden detrás del sofá.\n\nPapá se demora mucho en llegar. Nico bosteza una vez, y otra, y otra. Cuando por fin se abre la puerta, Ana grita: —¡Sorpresa! Nico se despierta de un salto y grita: —¡Buenos días! Papá se ríe tanto que se le salen las lágrimas. —¡Este es el mejor cumpleaños de mi vida! —dice, y los abraza a los dos.',
    questions: [
      { kind: 'literal', q: '¿Dónde se esconden Ana y Nico?', options: ['detrás del sofá', 'debajo de la cama', 'en la cocina'] },
      { kind: 'inferencia', q: '¿Por qué Nico grita «¡Buenos días!»?', options: ['Porque se había quedado dormido', 'Porque estaba enojado con papá', 'Porque no le gustan las sorpresas'] },
      { kind: 'vocabulario', q: 'Nico «bosteza». ¿Qué hace?', options: ['Abre la boca porque tiene sueño', 'Se ríe en voz alta', 'Se come un dulce'] }
    ],
    recall: { q: '¿Qué hacen Ana y Nico con dibujos para papá?', options: ['una tarjeta', 'una cometa', 'una torta'] },
    order: ['Ana y Nico preparan una sorpresa', 'Nico bosteza detrás del sofá', 'Nico grita «¡Buenos días!»']
  }
]);
