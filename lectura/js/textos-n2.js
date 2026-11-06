/* Textos originales para Mi Lectura: niveles 4 a 6. */
window.TEXTOS = (window.TEXTOS || []).concat([
  /* ───────────── Nivel 4 ───────────── */
  {
    id: 'n4-01', level: 4, title: 'Pancho y la palabra nueva', emoji: '🦜',
    text: 'La abuela Rosa tiene un loro verde que se llama Pancho. Pancho solo sabe decir una palabra: «¡Arepa!». Lo dice en el desayuno, en el almuerzo y hasta cuando llueve.\n\nSu nieta Valeria quiere enseñarle a decir «hola». Todas las tardes se sienta junto a él y repite despacio: «Ho-la, ho-la». Pancho la mira, mueve la cabeza y grita: «¡Arepa!». Un sábado, Valeria se cansa de repetir.\n\nEntonces se pone a conversar con la abuela. Las dos se ríen, cantan y se saludan muchas veces: «¡Hola, abuela!», «¡Hola, Valeria!». Pancho las escucha muy quieto, con la cabeza ladeada. Al día siguiente, Valeria entra a la cocina. El loro abre las alas y dice: «¡Hola, arepa!». La abuela se ríe tanto que casi se le caen las gafas.',
    questions: [
      { kind: 'literal', q: '¿Qué palabra sabía decir Pancho al principio?', options: ['Arepa', 'Hola', 'Abuela'] },
      { kind: 'inferencia', q: '¿Qué ayudó a Pancho a decir por fin «hola»?', options: ['Oír a Valeria y la abuela saludarse', 'Comer muchas arepas en el desayuno', 'Ver a Valeria dormir la siesta'] },
      { kind: 'vocabulario', q: 'Pancho escucha «con la cabeza ladeada». ¿Cómo tiene la cabeza?', options: ['Inclinada hacia un lado', 'Escondida debajo del ala', 'Mojada por la lluvia'] }
    ],
    recall: { q: '¿Qué dijo Pancho al final del cuento?', options: ['¡Hola, arepa!', '¡Buenos días, abuela!', '¡Arepa con queso!'] },
    order: ['Pancho solo sabe decir «arepa»', 'Valeria le repite «ho-la» cada tarde', 'Valeria y la abuela se saludan y cantan', 'Pancho dice «¡Hola, arepa!»']
  },
  {
    id: 'n4-02', level: 4, title: 'El frailejón del páramo', emoji: '🌿',
    text: 'En las montañas altas de Colombia hay un lugar frío y lleno de niebla. Se llama páramo. Allí vive una planta muy especial: el frailejón.\n\nLas hojas del frailejón están cubiertas de pelitos suaves. Esos pelitos lo protegen del frío y del sol fuerte, como una cobija. Cuando sus hojas viejas se secan, no se caen. Se quedan pegadas al tronco y lo cubren como un abrigo.\n\nEl frailejón también ayuda a guardar agua. Sus hojas atrapan gotitas de la niebla. El suelo del páramo la guarda como una esponja y la suelta poco a poco. Así nacen ríos y quebradas que llevan agua a muchas ciudades. Los frailejones crecen muy despacio. Por eso hay que cuidarlos y nunca arrancarlos.',
    questions: [
      { kind: 'literal', q: '¿Qué cubre las hojas del frailejón?', options: ['Pelitos suaves', 'Espinas duras', 'Escamas brillantes'] },
      { kind: 'inferencia', q: '¿Por qué es importante cuidar los páramos?', options: ['De ellos nace agua para las ciudades', 'Allí hace mucho calor', 'Los frailejones crecen muy rápido'] },
      { kind: 'vocabulario', q: 'En el texto, ¿qué es una «quebrada»?', options: ['Un río pequeño', 'Una planta del páramo', 'Una montaña muy alta'] }
    ],
    recall: { q: '¿Cómo se llama el lugar frío donde vive el frailejón?', options: ['El páramo', 'La selva', 'El desierto'] },
    order: ['El páramo es frío y con niebla', 'Los pelitos protegen al frailejón', 'Las hojas viejas cubren el tronco', 'Del páramo nacen ríos y quebradas']
  },
  {
    id: 'n4-03', level: 4, title: 'Juan y el frijol', emoji: '🌱',
    text: 'Juan sembró un frijol en un vaso con tierra. Lo regó con cuidado y lo puso junto a la ventana. Al día siguiente corrió a mirarlo, pero no había nada. «¿Y si se perdió?», pensó. Con una cuchara, sacó el frijol para revisarlo. Estaba igualito. Lo enterró otra vez, y al otro día hizo lo mismo.\n\nEl abuelo Ernesto lo vio y le explicó: «Las semillas necesitan calma. Si las sacas todos los días, no pueden echar raíces».\n\nJuan decidió tener paciencia. Para no sacar el frijol, cada mañana dibujaba el vaso en su cuaderno. Unos días después apareció un tallito verde y doblado, como un signo de pregunta. Juan lo dibujó feliz y le puso un título: «¡Hola, frijolito!».',
    questions: [
      { kind: 'literal', q: '¿Dónde puso Juan el vaso con el frijol?', options: ['Junto a la ventana', 'Debajo de la cama', 'Dentro de la nevera'] },
      { kind: 'inferencia', q: '¿Qué aprendió Juan en este cuento?', options: ['A tener paciencia', 'A regar muy poco las plantas', 'A cocinar frijoles'] },
      { kind: 'vocabulario', q: '«Estaba igualito» quiere decir que el frijol…', options: ['No había cambiado nada', 'Había crecido mucho', 'Se había partido en dos'] }
    ],
    recall: { q: '¿Qué apareció en el vaso unos días después?', options: ['Un tallito verde', 'Una flor roja', 'Un gusanito'] },
    order: ['Juan siembra un frijol en un vaso', 'Juan saca el frijol para revisarlo', 'El abuelo le dice que necesita calma', 'Aparece un tallito verde y doblado']
  },
  {
    id: 'n4-04', level: 4, title: 'Las abejas viajeras', emoji: '🐝',
    text: 'Las abejas pasan el día volando de flor en flor. En cada flor toman néctar, un líquido dulce. Con ese néctar, las abejas de la colmena hacen la miel.\n\nMientras visitan las flores, el polen se pega a su cuerpo peludo. Así lo llevan de una flor a otra. Gracias a ese viaje, muchas plantas pueden formar frutos y semillas. Sin las abejas, tendríamos menos frutas y verduras.\n\nEn Colombia hay muchas clases de abejas. Algunas no tienen aguijón y no pueden picar. Una de ellas se llama angelita y es muy pequeña. Las abejas necesitan flores y aire limpio para vivir. Sembrar flores en un balcón o en un jardín es una forma sencilla de ayudarlas.',
    questions: [
      { kind: 'literal', q: '¿Qué hacen las abejas con el néctar?', options: ['Hacen miel', 'Hacen semillas', 'Hacen flores'] },
      { kind: 'inferencia', q: '¿Por qué las abejas son importantes para las plantas?', options: ['Llevan el polen de flor en flor', 'Se comen las hojas secas', 'Les dan sombra a las flores'] },
      { kind: 'vocabulario', q: '¿Qué es el «aguijón» de una abeja?', options: ['La punta con la que pica', 'Las alas con las que vuela', 'El lugar donde guarda la miel'] }
    ],
    recall: { q: '¿Cómo se llama la abeja pequeña de Colombia que no pica?', options: ['Angelita', 'Abejorro', 'Colibrí'] },
    order: ['Las abejas toman néctar de las flores', 'El polen se pega a su cuerpo', 'Algunas abejas de Colombia no pican', 'Sembrar flores ayuda a las abejas']
  },
  {
    id: 'n4-05', level: 4, title: 'Lola no quiere bañarse', emoji: '🐶',
    text: 'Lola es una perrita café que adora el barro. Lo que no le gusta para nada es bañarse. Cuando ve la ponchera con agua, se esconde debajo del sofá.\n\nUn domingo, Martín y su papá intentaron de todo. Le ofrecieron una galleta, pero Lola se la comió y volvió a esconderse. Le cantaron una canción, pero ella solo movió una oreja. Hasta le mostraron su pelota favorita, y nada.\n\nEntonces Martín tuvo una idea. Salió al patio con jabón para perros y un aro de alambre. Empezó a soplar burbujas enormes que brillaban con el sol. Lola salió corriendo a perseguirlas. Saltaba, mordía el aire y las burbujas le reventaban encima. Sin darse cuenta, quedó llena de espuma. Luego, el papá la enjuagó con la manguera. Ahora, cada domingo, es ella quien pide el baño.',
    questions: [
      { kind: 'literal', q: '¿Dónde se escondía Lola cuando veía la ponchera?', options: ['Debajo del sofá', 'Detrás de la nevera', 'Dentro del carro'] },
      { kind: 'inferencia', q: '¿Por qué funcionó la idea de Martín?', options: ['Lola se divirtió persiguiendo burbujas', 'Lola tenía mucha hambre', 'Al papá le gustaba cantar'] },
      { kind: 'vocabulario', q: 'En el texto, ¿qué es una «ponchera»?', options: ['Un recipiente grande para agua', 'Una cama para perros', 'Una cobija de lana'] }
    ],
    recall: { q: '¿Qué usó Martín para soplar las burbujas?', options: ['Un aro de alambre', 'Un pitillo de papel', 'Una cuchara de palo'] },
    order: ['Lola se esconde debajo del sofá', 'Le ofrecen una galleta y una canción', 'Martín sopla burbujas en el patio', 'El papá enjuaga a Lola con la manguera']
  },
  {
    id: 'n4-06', level: 4, title: 'El viaje de una gota', emoji: '💧',
    text: 'El agua de la Tierra no se queda quieta. Siempre está viajando en un gran círculo llamado el ciclo del agua.\n\nPrimero, el sol calienta el agua de los mares, los ríos y los lagos. Una parte se convierte en vapor, que es invisible, y sube al cielo. Allá arriba hace más frío. El vapor se enfría y forma gotitas diminutas. Muchas gotitas juntas forman las nubes.\n\nCuando las gotitas se unen y se vuelven pesadas, caen como lluvia. En los lugares muy fríos, pueden caer como nieve. El agua de la lluvia corre por la tierra hasta los ríos. Los ríos la llevan al mar, y allí el sol la calienta otra vez. Así, el viaje vuelve a empezar. Por eso, el agua que bebes hoy lleva muchísimo tiempo dando vueltas.',
    questions: [
      { kind: 'literal', q: '¿Qué forman muchas gotitas juntas en el cielo?', options: ['Las nubes', 'El vapor', 'Los ríos'] },
      { kind: 'inferencia', q: '¿Cuál es la idea principal del texto?', options: ['El agua viaja sin parar en círculo', 'La nieve solo cae en el mar', 'El vapor de agua se puede ver'] },
      { kind: 'vocabulario', q: '«Gotitas diminutas» son gotitas…', options: ['Muy pequeñas', 'Muy calientes', 'Muy pesadas'] }
    ],
    recall: { q: '¿Qué calienta el agua de los mares y los ríos?', options: ['El sol', 'El viento', 'La luna'] },
    order: ['El sol calienta el agua', 'El vapor sube y se enfría', 'Las gotitas forman las nubes', 'El agua cae como lluvia']
  },

  /* ───────────── Nivel 5 ───────────── */
  {
    id: 'n5-01', level: 5, title: 'La cometa de Matías', emoji: '🪁',
    text: 'En agosto, el viento sopla fuerte en el barrio de Matías. Todos los niños sacan sus cometas al potrero. Matías hizo la suya con su mamá, usando papel de colores, palitos de bambú y mucha pita.\n\nEl sábado corrió con su cometa por todo el potrero. La cometa subía un poquito, daba vueltas como loca y caía de cabeza al pasto. Matías corrió más rápido, pero la cometa giró todavía más y volvió a caer. Se sentó en el pasto, con los cachetes inflados de rabia.\n\nSu vecina Daniela, que tiene diez años, se acercó a mirar. «Tu cometa no tiene cola», le dijo. «La cola la ayuda a mantenerse derecha». Entre los dos amarraron tiras de una camiseta vieja en la parte de abajo. Matías volvió a correr. Esta vez la cometa subió tranquila, alto, muy alto. Matías soltó más pita y se rio feliz. Desde el cielo, la cometa parecía saludar a todo el barrio.',
    questions: [
      { kind: 'literal', q: '¿Qué le faltaba a la cometa de Matías?', options: ['Una cola', 'Más papel', 'Palitos de bambú'] },
      { kind: 'inferencia', q: '¿Por qué no sirvió que Matías corriera más rápido?', options: ['Sin cola, la cometa no se mantenía derecha', 'El viento de agosto ya se había acabado', 'Matías corría hacia el lado equivocado'] },
      { kind: 'vocabulario', q: 'En el texto, ¿qué es un «potrero»?', options: ['Un terreno abierto con pasto', 'Una tienda de cometas', 'Un salón del colegio'] }
    ],
    recall: { q: '¿Con qué hicieron la cola de la cometa?', options: ['Con tiras de una camiseta vieja', 'Con hojas de periódico', 'Con cintas de regalo'] },
    order: ['Matías hace su cometa con su mamá', 'La cometa da vueltas y cae', 'Daniela le dice que le falta cola', 'La cometa sube muy alto']
  },
  {
    id: 'n5-02', level: 5, title: 'El manatí, un gigante tranquilo', emoji: '🌊',
    text: 'El manatí es un animal grande, gris y muy tranquilo. Vive en el agua, pero no es un pez. Es un mamífero, como los perros, las ballenas y nosotros. Por eso respira aire y tiene que subir a la superficie para tomarlo. Puede quedarse varios minutos bajo el agua antes de volver a respirar.\n\nEn Colombia hay manatíes en algunos ríos, ciénagas y costas. Nadan despacio y pasan muchas horas comiendo plantas acuáticas. Como comen tantas plantas, algunas personas los llaman vacas marinas. Son tan pacíficos que no atacan a nadie. Aunque parezca raro, son parientes lejanos de los elefantes.\n\nLa mamá manatí cuida a su cría durante mucho tiempo y la alimenta con su leche. Hoy los manatíes están en peligro. Las redes de pesca, los motores de las lanchas y la basura en el agua les hacen daño. Cuidar los ríos y navegar con cuidado ayuda a que estos gigantes tranquilos sigan nadando.',
    questions: [
      { kind: 'literal', q: '¿Qué comen los manatíes?', options: ['Plantas acuáticas', 'Peces pequeños', 'Frutas de los árboles'] },
      { kind: 'inferencia', q: '¿Para qué se escribió este texto?', options: ['Para conocer y cuidar al manatí', 'Para enseñar a pescar en el río', 'Para explicar cómo viven los elefantes'] },
      { kind: 'vocabulario', q: 'En el texto, una «cría» es…', options: ['Un manatí bebé', 'Una planta del río', 'Una red de pesca'] }
    ],
    recall: { q: '¿Qué clase de animal es el manatí?', options: ['Un mamífero', 'Un pez', 'Un reptil'] },
    order: ['El manatí es un mamífero que respira aire', 'Come plantas acuáticas durante horas', 'La mamá alimenta a su cría con leche', 'Los manatíes están en peligro']
  },
  {
    id: 'n5-03', level: 5, title: 'El robot de cartón', emoji: '🤖',
    text: 'Sofía quería llevar un robot a la feria de ciencias del colegio. Con su papá juntó cajas de cartón, tapas de botellas y dos linternas viejas. Durante una semana, la sala se llenó de recortes, pegante y risas.\n\nEl robot quedó precioso, pero tenía un problema. Su brazo derecho se caía cada vez que alguien lo tocaba. Primero le pusieron cinta, pero el brazo volvió a caerse. Luego le echaron mucho pegante. Esta vez el brazo quedó tieso y levantado, como si el robot pidiera la palabra. «Parece que quiere hacer una pregunta», dijo el papá, y los dos se rieron.\n\nSofía se quedó pensando. Dobló y estiró su propio brazo varias veces. «¡Necesita un codo que se mueva!», exclamó. Con un tornillo y una tuerca unieron el brazo al cuerpo, sin apretar demasiado. Ahora el brazo podía subir y bajar sin caerse. En la feria, Sofía explicó cómo funciona una articulación, y el robot saludó a cada visitante. La maestra Carmen dijo que era el robot más amable de la feria.',
    questions: [
      { kind: 'literal', q: '¿Qué parte del robot tenía un problema?', options: ['El brazo derecho', 'La cabeza', 'Las piernas'] },
      { kind: 'inferencia', q: '¿Qué le dio a Sofía la idea para arreglar el robot?', options: ['Mirar cómo se dobla su brazo', 'Una pregunta de la maestra', 'Un libro de la biblioteca'] },
      { kind: 'vocabulario', q: 'El brazo «quedó tieso». Eso quiere decir que quedó…', options: ['Duro y sin poder doblarse', 'Suelto y colgando', 'Pintado de colores'] }
    ],
    recall: { q: '¿Con qué unieron al final el brazo del robot?', options: ['Con un tornillo y una tuerca', 'Con cinta y pegante', 'Con un gancho de ropa'] },
    order: ['Sofía y su papá juntan cajas y tapas', 'La cinta no sostiene el brazo', 'Con pegante, el brazo queda tieso', 'Le ponen un tornillo como codo']
  },
  {
    id: 'n5-04', level: 5, title: 'Caño Cristales, el río de colores', emoji: '🌈',
    text: 'En el departamento del Meta, en la sierra de La Macarena, hay un río que parece pintado. Se llama Caño Cristales, y mucha gente lo conoce como el río de los cinco colores. Su agua es tan limpia que se ven claramente las piedras del fondo.\n\nEl color más famoso del río es el rojo. No viene de una pintura ni de la tierra, sino de una planta acuática. Esta planta vive pegada a las rocas, debajo del agua. Cuando recibe suficiente sol, se pone de un rojo brillante, y a veces rosado. Los demás colores también tienen explicación. El amarillo viene de la arena, y el verde, de otras plantas. El negro es de las rocas, y el azul es el reflejo del cielo.\n\nLa planta roja no luce así todo el año. Si el río crece mucho, el agua profunda la esconde. Si se seca, la planta pierde su color. Por eso los colores se ven mejor solo en algunos meses. Para proteger este lugar, los visitantes deben seguir reglas y caminar con guías.',
    questions: [
      { kind: 'literal', q: '¿De dónde viene el color rojo del río?', options: ['De una planta acuática', 'De una pintura especial', 'De la tierra del fondo'] },
      { kind: 'inferencia', q: '¿Qué pasaría si la planta roja desapareciera?', options: ['El río perdería su color más famoso', 'El agua se volvería toda roja', 'El río tendría más colores'] },
      { kind: 'vocabulario', q: 'Una planta «acuática» es una planta que…', options: ['Vive en el agua', 'Vive en el desierto', 'Vive sobre los árboles'] }
    ],
    recall: { q: '¿En qué departamento de Colombia está Caño Cristales?', options: ['En el Meta', 'En La Guajira', 'En Nariño'] },
    order: ['Caño Cristales queda en el Meta', 'El rojo viene de una planta acuática', 'Cada color tiene su explicación', 'Los visitantes deben ir con guías']
  },
  {
    id: 'n5-05', level: 5, title: 'Las pantuflas perdidas', emoji: '🐾',
    text: 'Todas las mañanas, el abuelo Julián buscaba sus pantuflas y no las encontraba. Las dejaba junto a la cama antes de dormir, pero al despertar ya no estaban. Un día aparecieron en la cocina. Otro día, detrás de la puerta. Una vez, una estaba en el patio y la otra en la ducha.\n\nSu nieta Luisa decidió resolver el misterio. Se puso una gorra de detective y sacó una libreta. Preguntó a todos en la casa y anotó dónde aparecía cada pantufla. Su hermano Felipe juró que él no había sido, y su mamá tampoco.\n\nEsa noche, Luisa se escondió detrás del sofá con una linterna. Un rato después, escuchó unos pasitos suaves. Era Toby, el cachorro de la familia. Agarró una pantufla con la boca, la llevó a su cojín y se acostó encima. Luisa entendió todo: las pantuflas olían al abuelo, y a Toby le encantaba ese olor. Al día siguiente, el abuelo le regaló a Toby un suéter viejo suyo. Desde entonces, las pantuflas no volvieron a desaparecer.',
    questions: [
      { kind: 'literal', q: '¿Dónde dejaba el abuelo sus pantuflas antes de dormir?', options: ['Junto a la cama', 'En la cocina', 'Detrás de la puerta'] },
      { kind: 'inferencia', q: '¿Por qué el abuelo le regaló a Toby un suéter viejo?', options: ['Para que tuviera algo con su olor', 'Para que jugara a ser detective', 'Para que dejara de ladrar'] },
      { kind: 'vocabulario', q: 'Felipe «juró» que no había sido. Eso quiere decir que…', options: ['Aseguró con seriedad que era verdad', 'Gritó muy enojado', 'Se escondió en su cuarto'] }
    ],
    recall: { q: '¿Quién se llevaba las pantuflas del abuelo?', options: ['Toby, el cachorro', 'Felipe, el hermano', 'La mamá de Luisa'] },
    order: ['Las pantuflas aparecen en lugares raros', 'Luisa anota dónde aparece cada pantufla', 'Luisa ve a Toby llevarse una pantufla', 'El abuelo le regala un suéter a Toby']
  },
  {
    id: 'n5-06', level: 5, title: 'El corazón no descansa', emoji: '❤️',
    text: 'Pon tu mano en el pecho, un poco hacia la izquierda, y quédate en silencio. ¿Sientes un golpecito? Es tu corazón. Tiene más o menos el tamaño de tu puño cerrado. Trabaja sin descansar ni un solo momento. Late cuando juegas, cuando comes y también cuando duermes.\n\nEl corazón es un músculo que funciona como una bomba. Con cada latido, empuja la sangre por unos tubos llamados vasos sanguíneos. La sangre viaja por todo el cuerpo y lleva oxígeno y alimento a cada parte. Luego regresa al corazón, y el viaje empieza otra vez. El sonido del latido lo hacen unas puertitas del corazón, llamadas válvulas, al cerrarse.\n\nCuando corres o saltas, tus músculos necesitan más oxígeno. Por eso el corazón late más rápido. Puedes comprobarlo: busca tu pulso en la muñeca y cuenta los latidos. Luego salta un rato y vuelve a contarlos. Verás que ahora son más. Para tener un corazón fuerte, ayuda moverse todos los días, comer frutas y verduras y dormir bien.',
    questions: [
      { kind: 'literal', q: '¿Qué lleva la sangre a cada parte del cuerpo?', options: ['Oxígeno y alimento', 'Arena y piedras', 'Leche y miel'] },
      { kind: 'inferencia', q: 'Si alguien sube corriendo muchas escaleras, ¿qué hará su corazón?', options: ['Latirá más rápido', 'Dejará de latir un rato', 'Latirá más despacio'] },
      { kind: 'vocabulario', q: 'En el texto, el corazón funciona como una «bomba». Aquí «bomba» es…', options: ['Algo que empuja un líquido', 'Un globo de fiesta', 'Algo que explota con ruido'] }
    ],
    recall: { q: '¿Más o menos de qué tamaño es tu corazón?', options: ['Como tu puño cerrado', 'Como tu cabeza', 'Como una uva'] },
    order: ['El corazón late también cuando duermes', 'Empuja la sangre por los vasos sanguíneos', 'Al correr, el corazón late más rápido', 'Moverse y comer bien cuidan el corazón']
  },

  /* ───────────── Nivel 6 ───────────── */
  {
    id: 'n6-01', level: 6, title: 'La huerta de la terraza', emoji: '🍅',
    text: 'En el edificio de Mariana no había jardín, pero sí una terraza grande y vacía. Allí solo había cuerdas para colgar ropa y una silla vieja. Un día, don Aurelio, el vecino del cuarto piso, subió con tierra y semillas. Le preguntó a Mariana si quería ayudarlo a sembrar una huerta. Ella dijo que sí antes de que él terminara la pregunta.\n\nLlenaron cajones de madera con tierra y sembraron tomates, cilantro, lechugas y frijoles. Regaron todo con cuidado y se fueron felices. Pero al día siguiente encontraron un desastre: las palomas se habían comido casi todas las semillas.\n\nMariana tuvo una idea. Con una escoba, un sombrero y una camisa vieja hicieron un espantapájaros, y lo llamaron don Ramiro. Durante dos días, las palomas lo miraron con desconfianza. Al tercero, una se paró en el sombrero, otra en el hombro y otra en la escoba. Don Aurelio se rio tanto que tuvo que sentarse en la silla vieja.\n\nEntonces pensaron en otra solución. Volvieron a sembrar y cubrieron los cajones con una malla delgada. La malla dejaba pasar el sol y el agua, pero no los picos. A las pocas semanas brotaron hojitas verdes por todas partes. Los vecinos empezaron a subir a mirar, y algunos trajeron sus propias semillas. Hoy la terraza tiene huerta, flores y hasta una banca. Don Ramiro sigue allí, aunque ahora es solo un adorno muy elegante.',
    questions: [
      { kind: 'literal', q: '¿Qué se comieron las palomas?', options: ['Las semillas', 'Los tomates maduros', 'El sombrero'] },
      { kind: 'inferencia', q: '¿Por qué funcionó la malla y no el espantapájaros?', options: ['Las palomas no podían meter el pico', 'La malla asustaba a las palomas', 'Las palomas se fueron a otro edificio'] },
      { kind: 'vocabulario', q: 'Las palomas miraron al espantapájaros «con desconfianza». Es decir…', options: ['Sin estar seguras de él', 'Con mucha alegría', 'Con ganas de jugar'] }
    ],
    recall: { q: '¿Qué hicieron Mariana y don Aurelio en la terraza?', options: ['Una huerta', 'Una piscina', 'Un parque de juegos'] },
    order: ['Don Aurelio sube con tierra y semillas', 'Las palomas se comen las semillas', 'Las palomas se paran en el espantapájaros', 'Cubren los cajones con una malla']
  },
  {
    id: 'n6-02', level: 6, title: 'Las tortugas marinas', emoji: '🐢',
    text: 'Las tortugas marinas pasan casi toda su vida en el mar. Nadan grandes distancias, comen y descansan entre las olas. Pero hay un momento en que las hembras regresan a la tierra: cuando van a poner sus huevos. Muchas vuelven a la misma región donde nacieron, aunque hayan pasado muchos años.\n\nLa tortuga sale del agua, casi siempre de noche, y camina despacio por la arena. Con sus aletas de atrás cava un hueco profundo y allí pone muchos huevos. Luego los tapa con arena y regresa al mar. Ella no se queda a cuidarlos: el calor de la arena hace el trabajo. Algo curioso es que la temperatura de la arena influye en si las crías serán machos o hembras.\n\nDespués de unas semanas, las tortuguitas rompen el cascarón y salen del nido. Casi siempre lo hacen de noche y corren hacia el mar. Para encontrar el camino, se guían por la luz del horizonte, que sobre el agua es más clara. Por eso, las luces de los hoteles y las casas pueden confundirlas y llevarlas en la dirección equivocada.\n\nA las costas de Colombia, en el Caribe y en el Pacífico, llegan varias especies de tortugas marinas. En muchas playas, comunidades y voluntarios cuidan los nidos. Tú también puedes ayudar: no dejes basura en la playa. Algunas tortugas confunden las bolsas plásticas con medusas y se las comen.',
    questions: [
      { kind: 'literal', q: '¿Con qué cava la tortuga el hueco para sus huevos?', options: ['Con sus aletas de atrás', 'Con su pico', 'Con su caparazón'] },
      { kind: 'inferencia', q: '¿Por qué es bueno apagar las luces cerca de las playas?', options: ['Para que las crías encuentren el mar', 'Para que las tortugas duerman más', 'Para que la arena se enfríe'] },
      { kind: 'vocabulario', q: 'Las tortuguitas «se guían» por la luz. Eso quiere decir que…', options: ['La usan para saber adónde ir', 'Se esconden de ella', 'Se la comen como alimento'] }
    ],
    recall: { q: '¿Qué influye en si las crías serán machos o hembras?', options: ['La temperatura de la arena', 'El color de la luna', 'El tamaño de la playa'] },
    order: ['Las hembras regresan a la tierra a poner huevos', 'La tortuga tapa los huevos con arena', 'Las crías salen y corren hacia el mar', 'En Colombia, voluntarios cuidan los nidos']
  },
  {
    id: 'n6-03', level: 6, title: 'Tomás y los anillos de Saturno', emoji: '🔭',
    text: 'Tomás tenía un sueño: ver los anillos de Saturno con sus propios ojos. Su tía Clara, que es profesora de física, le prestó un telescopio pequeño. Tomás lo armó en el balcón esa misma noche, muy emocionado.\n\nPero esa noche el cielo estaba cubierto de nubes. La siguiente, también. La tercera noche por fin despejó, y Tomás apuntó hacia el punto más brillante que encontró. Solo vio una bolita de luz que titilaba. «Este telescopio no sirve», se quejó, y se fue a dormir con cara larga.\n\nAl otro día, la tía Clara llegó con un mapa del cielo y una sonrisa. Le explicó que no todos los puntos brillantes son estrellas, y que los planetas cambian de lugar. Juntos buscaron en el mapa dónde estaría Saturno esa semana. Luego le enseñó a enfocar despacio, girando una ruedita hasta que la imagen se viera nítida.\n\nEsa noche, Tomás siguió el mapa y encontró a Saturno sobre los tejados. Era un punto amarillento que casi no titilaba. Giró la ruedita muy despacio. De pronto apareció un planeta diminuto con un anillo alrededor, como el ala de un sombrero. «¡Tía, Saturno tiene sombrero!», gritó Tomás. Esa noche aprendió que mirar el cielo pide paciencia, y también un buen mapa.',
    questions: [
      { kind: 'literal', q: '¿Qué llevó la tía Clara al otro día?', options: ['Un mapa del cielo', 'Unas gafas de sol', 'Un libro de cuentos'] },
      { kind: 'inferencia', q: '¿Por qué Tomás no vio los anillos la tercera noche?', options: ['No estaba mirando a Saturno', 'El telescopio estaba dañado', 'Saturno había perdido sus anillos'] },
      { kind: 'vocabulario', q: '«Una bolita de luz que titilaba» es una luz que…', options: ['Temblaba y brillaba a ratos', 'Era de color rojo', 'Se apagó para siempre'] }
    ],
    recall: { q: '¿Qué quería ver Tomás con el telescopio?', options: ['Los anillos de Saturno', 'Los cráteres de la Luna', 'Una estrella fugaz'] },
    order: ['La tía Clara le presta un telescopio', 'Las nubes tapan el cielo dos noches', 'La tía le enseña a usar un mapa', 'Tomás ve el anillo de Saturno']
  },
  {
    id: 'n6-04', level: 6, title: 'Del cafetal a la taza', emoji: '☕',
    text: 'En muchas montañas de Colombia, donde no hace ni mucho frío ni mucho calor, crece el café. Sus plantas son arbustos de hojas verdes y brillantes. A veces crecen a la sombra de plantas más altas, como el plátano o el guamo. El café viene originalmente de África, pero llegó a Colombia hace mucho tiempo.\n\nPrimero, la planta da unas flores blancas que huelen muy bien. Después de varios meses, las flores se convierten en frutos pequeños y redondos. Al principio son verdes, y cuando maduran casi siempre se ponen rojos. Por su color y su forma, mucha gente los llama cerezas. Dentro de cada fruto suele haber dos semillas: esos son los granos de café.\n\nEn muchas fincas, los recolectores recogen a mano solo los frutos maduros. Es un trabajo de mucha paciencia, porque en una misma rama hay frutos verdes y rojos. Luego les quitan la cáscara, lavan los granos y los ponen a secar al sol. En ese momento, los granos todavía son de color claro.\n\nEl color café y el rico aroma aparecen cuando los granos se tuestan, es decir, cuando se calientan mucho. Después, los granos tostados se muelen y quedan convertidos en polvo. Así, una semilla que creció en la montaña termina en la taza de algún adulto. Los niños, por ahora, pueden disfrutar del olor.',
    questions: [
      { kind: 'literal', q: '¿De qué color se ponen casi siempre los frutos maduros?', options: ['Rojos', 'Azules', 'Blancos'] },
      { kind: 'inferencia', q: '¿Cuál es la idea principal del texto?', options: ['El camino del café hasta la taza', 'Cómo se siembran plátanos y guamos', 'Por qué los niños no toman café'] },
      { kind: 'vocabulario', q: 'En el texto, ¿quiénes son los «recolectores»?', options: ['Personas que recogen los frutos', 'Máquinas que muelen el café', 'Árboles que dan sombra'] }
    ],
    recall: { q: '¿Qué hay dentro de cada fruto del café?', options: ['Dos semillas', 'Un líquido dulce', 'Muchas hojitas'] },
    order: ['El café llegó a Colombia desde África', 'La planta da flores blancas', 'Los recolectores recogen frutos maduros', 'Los granos se tuestan y se muelen']
  },
  {
    id: 'n6-05', level: 6, title: 'El nuevo del salón', emoji: '✏️',
    text: 'El lunes llegó un niño nuevo al salón de tercero. Se llamaba Andrés y venía de un pueblo cerca del mar. La profesora Marta lo presentó, y él solo dijo «hola» con una voz bajita. En el descanso se sentó solo en una banca, mirando sus zapatos.\n\nGabriela quiso hacerse su amiga. Primero lo invitó a jugar fútbol, pero él dijo que no con la cabeza. Luego le ofreció la mitad de su arepa, y él respondió «gracias» sin levantar la mirada. Gabriela pensó que tal vez ella no le caía bien. Esa tarde se lo contó a su papá mientras hacían la tarea.\n\n—A veces, cuando uno llega a un lugar nuevo, tiene muchas cosas en el corazón —le dijo su papá—. Extraña su casa, sus amigos y hasta el ruido del mar. Dale tiempo y fíjate en lo que le gusta.\n\nAl día siguiente, Gabriela notó algo: el cuaderno de Andrés estaba lleno de peces, barcos y pelícanos. A ella también le encantaba dibujar. En el descanso, se sentó a su lado y dibujó un pez globo con cara de sorpresa. Andrés se rio por primera vez. Luego le contó que los pelícanos se lanzan al agua de cabeza para pescar. Esa tarde dibujaron juntos un mar enorme, y Gabriela supo que había empezado una amistad.',
    questions: [
      { kind: 'literal', q: '¿Qué había en el cuaderno de Andrés?', options: ['Dibujos de peces, barcos y pelícanos', 'Tareas de matemáticas', 'Fotos de su pueblo'] },
      { kind: 'inferencia', q: '¿Por qué Andrés estaba tan callado al principio?', options: ['Extrañaba su casa y todo era nuevo', 'No le caía bien Gabriela', 'Le dolía la garganta'] },
      { kind: 'vocabulario', q: '«Tiene muchas cosas en el corazón» quiere decir que…', options: ['Siente muchas emociones a la vez', 'Le duele el pecho', 'Guarda juguetes en el bolsillo'] }
    ],
    recall: { q: '¿Qué hizo reír a Andrés por primera vez?', options: ['El pez globo que dibujó Gabriela', 'Un chiste de la profesora', 'Un partido de fútbol'] },
    order: ['La profesora presenta a Andrés', 'Gabriela lo invita a jugar fútbol', 'El papá le aconseja darle tiempo', 'Andrés y Gabriela dibujan un mar juntos']
  },
  {
    id: 'n6-06', level: 6, title: 'La Luna, nuestra vecina', emoji: '🌙',
    text: 'La Luna es el único satélite natural de la Tierra. Aunque de noche brilla mucho, no tiene luz propia. Lo que vemos es la luz del Sol que se refleja en su superficie.\n\nLa Luna gira alrededor de la Tierra y tarda más o menos un mes en dar la vuelta completa. Mientras viaja, el Sol ilumina siempre una mitad de ella. Desde aquí, a veces vemos toda la parte iluminada, y a veces solo un pedacito. Por eso parece que la Luna cambia de forma. Esos cambios se llaman fases: luna nueva, cuarto creciente, luna llena y cuarto menguante.\n\nSi miras la Luna con binoculares, verás manchas oscuras y muchos huecos redondos. Las manchas oscuras son grandes llanuras formadas por lava muy antigua. Los huecos se llaman cráteres. Se formaron hace muchísimo tiempo, cuando rocas del espacio chocaron contra ella. En la Luna no hay aire, ni viento, ni lluvia. Por eso los cráteres casi no se borran.\n\nEn 1969, dos astronautas caminaron por primera vez sobre la Luna. Allí todo pesa mucho menos que en la Tierra, así que daban saltos largos y lentos. Como no hay viento, las huellas de sus botas siguen marcadas en el suelo lunar. Quizás algún día tú puedas verlas de cerca.',
    questions: [
      { kind: 'literal', q: '¿Qué formó los cráteres de la Luna?', options: ['Rocas del espacio que chocaron', 'La lluvia y el viento', 'Las botas de los astronautas'] },
      { kind: 'inferencia', q: '¿Por qué en la Tierra las huellas se borran y en la Luna no?', options: ['Aquí el viento y la lluvia las borran', 'Aquí la gente pisa más suave', 'Allá el suelo es de cemento'] },
      { kind: 'vocabulario', q: '«No tiene luz propia» quiere decir que la Luna…', options: ['No produce su propia luz', 'Tiene luz de muchos colores', 'Solo brilla de día'] }
    ],
    recall: { q: '¿En qué año caminaron astronautas por primera vez en la Luna?', options: ['En 1969', 'En 1492', 'En 2010'] },
    order: ['La Luna refleja la luz del Sol', 'La Luna tiene fases', 'Rocas del espacio formaron los cráteres', 'Dos astronautas caminaron en la Luna en 1969']
  }
]);
