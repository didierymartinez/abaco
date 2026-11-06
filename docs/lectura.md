# Mi Lectura: qué funciona para leer mejor

Mi Lectura es la segunda app, al lado de Mi Ábaco (en `lectura/`). Sigue la misma dinámica: una sesión corta cada día, racha, estrellas, medallas y niveles que suben solo con dominio. Este documento resume la investigación que la guía y cómo se tradujo en la app.

## 1. Lo que dice la investigación

**La lectura rápida tiene un límite: velocidad contra comprensión.** La revisión más completa sobre el tema (Rayner, Schotter, Masson, Potter y Treiman, 2016) concluye que leer mucho más rápido casi siempre cuesta comprensión.
- **Los ojos no son el cuello de botella.** Moverlos ocupa una parte pequeña del tiempo de lectura (alrededor del 10 %). Lo que toma tiempo es reconocer las palabras y unir las ideas.
- **El vocabulario y la práctica sí suben la velocidad.** Leer mucho y conocer el tema hacen leer más rápido sin perder comprensión.
- **Lo que prometen los cursos no se sostiene.** Leer «fotografiando» páginas o eliminar del todo la voz interior no tiene respaldo.

**Palabra a palabra (RSVP).** Es lo que hacen apps como Spritz: las palabras aparecen una por una en el mismo punto, con una letra de enfoque en color. Funciona para leer textos cortos con comodidad, pero no deja volver atrás. En un experimento, la comprensión bajó de 75 % a 50 % cuando no se podía releer. Por eso en Mi Lectura:
- este modo tiene pausa y un botón **⟲** que vuelve al inicio de la frase;
- es opcional: para niños, la relectura viene **con guía** (un resaltador sobre el texto completo).

**Releer el mismo texto (lectura repetida).** Es de las prácticas con mejor evidencia para la fluidez. Los metaanálisis encuentran efectos grandes en fluidez y comprensión (alrededor de 0,7), sobre todo en niños que están aprendiendo. Por eso cada sesión lee el texto y luego lo relee un poco más rápido.

**Recordar al día siguiente (práctica de recuperación).** Responder preguntas sobre lo leído, después de un tiempo, fija la memoria mejor que volver a leer. Esto también vale en niños de primaria (Karpicke, Blunt y Smith, 2016). Por eso al día siguiente vuelve una pregunta del texto anterior, y a la semana, otra de repaso.

**Rango visual.** Los lectores que empiezan captan menos letras por fijación que los adultos: en 2.º grado, unas 11 a 12 letras a la derecha del punto que miran; en adultos, 14 a 15 (Rayner, 1986). Ese rango crece con la experiencia lectora y llega al nivel adulto hacia 6.º grado. Los ejercicios de campo visual (pirámides, columnas, letras a los lados de un punto) son clásicos en las escuelas de lectura veloz. Su efecto directo sobre la lectura no está probado, así que en la app son un calentamiento corto de atención visual, no el centro del entrenamiento.

**Medir la lectura silenciosa con frases.** La forma más práctica de medir la fluidez lectora en silencio es la verificación de frases. Las pruebas estandarizadas (como el TOSREC) dan unos minutos para leer frases sencillas y marcar si son verdaderas o falsas, y cada error resta. Así se mide a la vez la velocidad y que se entienda lo leído. Eso es «¿Tiene sentido?».

**Completar frases (maze).** Las pruebas tipo *maze* (cada cierto número de palabras hay un hueco con tres opciones) son una medida usada en los colegios para seguir la comprensión. Su relación con las pruebas de lectura es moderada. Eso es «Completa la frase».

**Modelo y eco.** En la revisión de Kuhn y Stahl (2003) sobre la enseñanza de la fluidez, la repetición, sola o con un **modelo** de lectura fluida, es el componente principal de casi todas las intervenciones que funcionan. Las que suman retroalimentación y un modelo de lectura expresiva parecen especialmente eficaces en los primeros grados. La lectura en eco (un adulto lee una frase y el niño la repite igual) es una forma sencilla de dar ese modelo.

**Velocidades de referencia en español.** Metaanálisis de Ripoll, Tapia y Aguado (2020), con 45 publicaciones de estudiantes hispanohablantes. Valores en palabras por minuto (ppm):

| Grado | En voz alta | En silencio |
|---|---|---|
| 1.º | 49 | 30 |
| 2.º | 73 | 79 |
| 3.º | 85 | 95 |
| 4.º | 104 | 125 |
| 5.º | 114 | 137 |
| 6.º | 124 | 155 |
| Adultos (estudios citados allí) | 191 | 278 |

El mismo estudio encuentra velocidades algo menores en Hispanoamérica que en España. El estándar internacional que usa Antioquia con la prueba EGRA es de 48 ppm en 1.º y 78 ppm en 2.º. En inglés, un adulto lee en silencio unas 238 ppm textos informativos y 260 ppm narrativos (Brysbaert, 2019).

## 2. Cómo se tradujo en la app

**Sesión diaria (unos 10 minutos):**
1. **👁️ Calienta:** un ejercicio corto que cambia cada día: palabras relámpago, ¿tiene sentido?, ojos de búho, ¿palabra real? o busca la palabra.
2. **📖 Lee:** el texto del día aparece borroso hasta tocar «Empezar», para que el tiempo sea justo. Al terminar se calcula su velocidad en ppm. Por defecto, los niños leen en voz alta, como se mide en el colegio. Si el resultado es imposible de rápido, Lino pregunta si leyó todo.
3. **❓ Entiende:** tres preguntas sin ver el texto: una literal (un dato), una de inferencia (por qué, qué sentía, para qué) y una de vocabulario en contexto.
4. **⚡ Relee:** el mismo texto, un poco más rápido:
   - **Con guía:** un resaltador avanza por grupos de 1 a 3 palabras, según el nivel, y hace una pausa al final de cada frase.
   - **Palabra a palabra:** como la app de lectura rápida, con la letra de enfoque en rojo, pausa y «⟲ Frase».
   - **En eco:** Lino lee una frase en voz alta (se marca en violeta) y después ella la lee igual (se marca en amarillo) y toca «Ya la leí». Es la mejor opción cuando está empezando a leer. Si el dispositivo no tiene voz en español, un adulto lee primero.

   Con la guía o palabra a palabra, al final dice cómo le fue: «Pude seguirla», «Muy rápido» o «Muy lenta».
5. **🧠 Recuerda:**
   - las preguntas de retención pendientes (la del texto de ayer y el repaso de hace una semana);
   - «Ordena la historia» con el texto de hoy;
   - el juego del día, que cambia: palabras para recordar, completa la frase, recuerda la frase o palabras amigas.

**La velocidad de la guía se adapta sola:**
- empieza un 15 % por encima de la primera lectura medida;
- sube 5 % cuando entendió (2 de 3 o más) y la siguió cómoda;
- sube 10 % si le pareció lenta y baja 10 % si fue muy rápida.

Así se empuja la velocidad sin sacrificar la comprensión.

**Los niveles de texto (niños) suben con dominio:** 3 lecturas seguidas con buena comprensión (2 de 3 o más) y a la velocidad del nivel, en al menos 2 días. Las metas son un poco más bajas que los promedios de cada grado, para no apurar. En silencio se pide un 20 % más.

| Nivel | Textos | Meta en voz alta |
|---|---|---|
| 1 · Primeras lecturas | 25–45 palabras, oraciones de hasta 7 | 35 ppm |
| 2 · Frases cortas | 45–70 palabras | 45 ppm |
| 3 · Cuentos cortos | 70–100 palabras, con diálogo | 60 ppm |
| 4 · Textos con párrafos | 100–140 palabras | 75 ppm |
| 5 · Lectura fluida | 140–190 palabras | 90 ppm |
| 6 · Textos largos | 190–250 palabras | 105 ppm |
| Adultos | 300–450 palabras, divulgativos | referencia 250 ppm |

**Lo que mide (en Progreso):**
- velocidad en ppm, con una gráfica de cada sesión coloreada según la comprensión, la guía y la meta del nivel;
- comprensión de las últimas sesiones;
- retención: cuánto recuerda al otro día;
- para adultos, la **velocidad efectiva** (velocidad × comprensión): leer rápido sin entender no cuenta.

**Ejercicios:** nueve, en tres grupos. Se pueden jugar aparte y suben de nivel con dominio, igual que los juegos de Mi Ábaco: al menos 4 partidas, las últimas 3 en la meta y en 2 días distintos.

*👁️ Ojos rápidos*
- **⚡ Palabras relámpago** (taquistoscopio): una palabra o frase aparece un instante y luego se tapa con una máscara. Hay que elegir cuál era entre opciones parecidas. Pasa de palabras de 3 letras a 800 ms a frases de 4 palabras a 300 ms.
- **🦉 Ojos de búho** (campo visual): mirando un punto, aparecen dos letras (luego sílabas) a los lados, cada vez más lejos.
- **🔍 Busca la palabra** (atención y escaneo): tocar todas las veces que aparece una palabra entre otras parecidas, con meta de tiempo.

*📖 Leer y entender*
- **✅ ¿Tiene sentido?** (fluidez silenciosa, como el TOSREC): en 60 segundos, leer frases y tocar «Sí» o «No». Puntaje = aciertos − errores. Va de frases de 3 a 6 palabras (meta de 5) a frases de 11 a 16 palabras (meta de 14).
- **🔤 ¿Palabra real?** (reconocimiento de palabras): ¿existe o es inventada? Las inventadas cambian una o dos letras de una real, así que hay que leerla bien y no adivinar por la forma. En los niveles altos la palabra se esconde a los 600–900 ms.
- **🧩 Completa la frase** (comprensión, tipo maze): elegir entre tres palabras la única que da sentido a la frase.
- **💬 Palabras amigas** (vocabulario): la palabra que significa lo mismo o lo contrario, desde palabras de todos los días hasta vocabulario de adulto.

*🧠 Memoria*
- **🧠 Palabras para recordar:** ver de 3 a 8 palabras y reconocerlas entre otras.
- **📝 Recuerda la frase** (memoria de trabajo): leer una frase, que se esconde, y armarla tocando sus palabras en orden, entre palabras que sobran. Va de 4 a 16 palabras.

El contenido es original: 254 frases con sentido o absurdas, 140 frases para completar, 119 pares de palabras amigas y 548 palabras (276 reales y 272 inventadas). Las inventadas se compararon con diccionarios de España, Colombia, México y Argentina y con listas de groserías, para que ninguna fuera una palabra real ni sonara a algo grosero.

**Textos:** 46 textos originales:
- 36 para niños, 6 por nivel, mitad cuentos y mitad informativos, con temas de Colombia: el cóndor, el páramo y los frailejones, Caño Cristales, el manatí, el café;
- 10 para adultos sobre cómo leen los ojos, la memoria, el sueño, el papel, el café, los páramos, los colibríes, la atención, el bilingüismo y la historia del soroban.

Cada texto trae tres preguntas, una pregunta para el día siguiente y los sucesos en orden. En «Lector» también se puede pegar cualquier texto para leerlo palabra a palabra, con guía o en eco con Lino.

**Varios lectores:** cada perfil (niño o adulto) tiene su racha, su nivel, su guía y sus ejercicios. El papá puede usar el modo adulto con textos largos y lectura palabra a palabra, y la niña el suyo.

## 3. Ideas para siguientes versiones

- **Grabar la lectura en voz alta** (con permiso) y contar las palabras bien leídas por minuto, como en las pruebas de fluidez.
- **Hojas impresas:** lectura repetida con registro de tiempos, como en Mi Ábaco.
- **Más textos**, y que los padres puedan agregar textos con sus propias preguntas.
- **Lectura en columnas y pirámides de palabras** como ejercicio de campo visual sobre texto real.

## Fuentes

- Rayner, K., Schotter, E. R., Masson, M. E. J., Potter, M. C. y Treiman, R. (2016). *So much to read, so little time: How do we read, and can speed reading help?* Psychological Science in the Public Interest, 17(1). Resúmenes: [ScienceDaily](https://sciencedaily.com/releases/2016/01/160114163035.htm), [EurekAlert](https://www.eurekalert.org/news-releases/726232), [Washington University](https://profiles.wustl.edu/en/publications/so-much-to-read-so-little-time-how-do-we-read-and-can-speed-readi/).
- Ripoll Salceda, J. C., Tapia Montesinos, M. M. y Aguado Alonso, G. (2020). *Reading rate in Spanish-speaking students: A meta-analysis.* Revista de Psicodidáctica, 25(2), 158–165. [PDF](https://ojs.ehu.eus/index.php/psicodidactica/article/download/23345/20702).
- Brysbaert, M. (2019). *How many words do we read per minute? A review and meta-analysis of reading rate.* Journal of Memory and Language, 109. [PDF](https://www.Gwern.net/doc/psychology/linguistics/2019-brysbaert.pdf).
- Lectura repetida: [metaanálisis de fluidez y comprensión (ASHA Evidence Maps)](https://apps.asha.org/EvidenceMaps/Articles/ArticleSummary/903ec865-92fd-4ca5-9cea-8534b161420a), [lectura repetida en dificultades de lectura](https://apps.asha.org/EvidenceMaps/Articles/ArticleSummary/c88f557d-4711-4446-a568-49c8bf8c881f), [estado de la evidencia, Exceptional Children 2009](https://apps.asha.org/EvidenceMaps/Articles/ArticleSummary/ff2ddb70-cd15-4587-8385-29f7b0196183).
- Karpicke, J. D., Blunt, J. R. y Smith, M. A. (2016). *Retrieval-based learning: Positive effects of retrieval practice in elementary school children.* Frontiers in Psychology, 7. [Artículo](https://www.frontiersin.org/articles/10.3389/fpsyg.2016.00350/full).
- Rango visual en niños: Rayner (1986) y Häikiö y otros (2009), citados en [Pagan, Blythe y Liversedge (2016)](https://eprints.soton.ac.uk/378366/1/Pagan_Blythe_Liversedge_2016.pdf) y [PMC4830847](https://pmc.ncbi.nlm.nih.gov/articles/PMC4830847).
- TOSREC (verificación de frases): [EdInstruments](https://edinstruments.org/node/112), [PRO-ED, validez de dos pruebas de fluidez silenciosa](https://www.proedinc.com/Downloads/ValidityTwoTestsofSilentReadingFluency.pdf).
- Maze: [metaanálisis de lectura oral y maze frente a pruebas estatales](https://conservancy.umn.edu/items/6abb7b79-98a6-4573-b298-39eae01da292).
- Kuhn, M. R. y Stahl, S. A. (2003). *Fluency: A review of developmental and remedial practices.* Journal of Educational Psychology, 95(1), 3–21. [DOI 10.1037/0022-0663.95.1.3](https://doi.org/10.1037/0022-0663.95.1.3).
- Estándares de fluidez en Antioquia (EGRA): [El Colombiano](https://www.elcolombiano.com/antioquia/estudiantes-primero-de-primaria-antioquia-problemas-de-lectura-OE27234749), [Telemedellín](https://telemedellin.tv/antioquia-alerta-bajos-niveles-lectura-ninos/).
- Spritz y la letra de enfoque (ORP): [New Statesman](https://newstatesman.com/?p=95908), [IndieReader](https://indiereader.com/2014/05/spritz/).
- Ejercicios escolares de velocidad lectora (pirámides, campo visual): [Orientación Andújar](https://www.orientacionandujar.es/wp-content/uploads/2023/10/EJERCICIOS-PARA-MEJORAR-LA-FLUIDEZ-Y-VELOCIDAD-LECTORA.pdf), [Educando Juntos](https://www.educandojuntos.cl/wp-content/uploads/2015/12/Ficha-T-cnica-de-actividades-velocidad-lectora-lectura-remedial.doc).
