# Análisis: Kumon, Smartick y el soroban

Este análisis sirve de base para decidir qué hace **Mi Ábaco**. Es una app para practicar a diario con una niña de 7 años. Combina la constancia de Kumon, la sesión corta y adaptativa de Smartick y el método del soroban (ábaco japonés).

## 1. Kumon (hojas en papel)

| Qué hace | Por qué funciona | Cómo lo usamos |
|---|---|---|
| Hojas diarias por niveles (códigos como `4A`, `B`), con *Nombre / Fecha / Tiempo* | Rutina, autonomía y el niño ve que avanza | Hojas imprimibles con el mismo encabezado y un código de nivel (`A1`…`G2`) |
| Pasos muy pequeños entre una hoja y la siguiente | El niño casi siempre puede resolver solo | Muchos niveles cortos (amigos del 5 antes que amigos del 10, etc.) |
| Avanza solo cuando domina: precisión **y** tiempo estándar | Se asegura la automatización antes de seguir | Sesión dominada = ≥ 90 % de aciertos al primer intento y dentro del tiempo objetivo; 2 de las últimas 3 para subir |
| Repetir es normal y se empieza por debajo del nivel real | Da confianza y fluidez | Si no domina, se repite el nivel; los padres pueden bajarlo |
| El niño corrige sus propios errores | Aprende del error | Segundo intento antes de mostrar la respuesta |

**Límites:** la corrección es manual, no hay explicación cuando se equivoca y las hojas no se adaptan durante la sesión.

## 2. Smartick (en línea, adaptativo)

Según lo que publican la empresa y la prensa:

- **Sesiones de 15 minutos al día**, sin horario fijo.
- **Adaptación automática**: hace una evaluación inicial y luego ajusta los ejercicios al nivel y a la velocidad del niño.
- **Respuesta inmediata** a cada ejercicio, con explicaciones cuando falla.
- **Motivación**: recompensas virtuales y un mundo propio al terminar la sesión.
- **Informes para padres** cada día.
- Edades de 4 a 14 años; además de cálculo trabaja lógica y resolución de problemas.

**Qué tomamos:** la sesión corta y diaria, la respuesta inmediata, la explicación paso a paso cuando se equivoca, la racha y las estrellas, y un panel para padres.

**Qué dejamos fuera (por ahora):** la evaluación inicial automática y el mundo virtual. Los padres eligen el nivel de inicio.

## 3. El soroban (ábaco japonés)

Video de referencia: *El secreto del cálculo japonés: aprende soroban paso a paso*, de Jaime García Serrano (https://youtu.be/0tN_roxCV3A). Aquí solo se verificaron el título y el autor del video, no su contenido.

Conceptos clave del método, en el orden en que se enseñan:

1. **Representar números.** Cada varilla tiene una cuenta de cielo (vale 5) y cuatro de tierra (valen 1). Solo cuentan las que tocan la barra.
2. **Sumas y restas directas.** Las cuentas caben sin ayuda.
3. **Amigos del 5** (1↔4, 2↔3). Por ejemplo, +4 = +5 −1.
4. **Amigos del 10** (1↔9, 2↔8, 3↔7, 4↔6, 5↔5). Por ejemplo, +7 = −3 +10.
5. **Varias cifras.** Se calcula de **izquierda a derecha**.
6. **Listas.** Se suman y restan varios números seguidos, sin borrar el ábaco.
7. **Anzan.** Es el cálculo mental imaginando el ábaco. Se entrena con números que aparecen y desaparecen (*flash*).
8. **Digitación.** El pulgar sube las cuentas de tierra. El índice las baja y mueve la cuenta del cielo.

Las academias de ábaco mental suelen seguir esta misma progresión: niveles con hojas, práctica diaria corta y luego *flash anzan*.

## 4. Supercerebros Play: ruta «Soroban desde cero»

Es la plataforma del mismo autor del video ([supercerebros.org/play/routes/soroban-desde-cero](https://supercerebros.org/play/routes/soroban-desde-cero)). La ruta tiene **3 módulos y 10 niveles**; los 3 primeros son gratuitos.

| Módulo | Niveles |
|---|---|
| 1. Representar números | 1 Introducción al soroban (1–9) · 2 Decenas y unidades (10–99) |
| 2. Sumar con los amigos del 5 y del 10 | 3 Sumas simples · 4 Restas simples · 5 Complemento a 5 · 6 Complemento a 10 · 7 Sumas y restas combinadas |
| 3. Cálculo fluido | 8 Centenas · 9 Velocidad mental · 10 Gran maestro del ábaco |

Cómo funciona cada nivel:

- **Pantalla «Antes de empezar»** con el objetivo, el «cómo practicar» y tres recordatorios (valor de las cuentas, cuentas activas, valor posicional).
- **Partidas de 5 rondas.** El niño responde **moviendo las cuentas** de un soroban en pantalla y los aciertos avanzan solos. Hay un temporizador por ronda.
- Cada nivel tiene un **mensaje de error específico** (por ejemplo: «Pregunta ¿cuánto falta para 5?: 1 y 4 son amigos…») y un **siguiente paso**.
- **Criterio de dominio:** 80 % de precisión, al menos 5 respuestas por intento, 67 % de constancia y 2 intentos exitosos.
- **Ruta visual** con módulos bloqueados hasta completar el anterior, porcentaje de avance y una **«recomendación explicable»** que dice por qué toca esa actividad.
- **Estadísticas:** precisión, constancia, prácticas y tiempo medio.

Una observación: en su nivel «Sumas simples (sin llevadas)» aparece `1 + 4`, que en el soroban ya necesita amigos del 5. Mi Ábaco evita eso porque revisa el movimiento que pide cada varilla.

**Qué adoptamos de Supercerebros:**

| Idea | En Mi Ábaco |
|---|---|
| Ruta por módulos con candados y % | Vista **Mi camino**: 8 módulos, niveles dominados, actual y bloqueados, y botón «Repasar» en los ya superados |
| «Antes de empezar» | Pantalla previa a la sesión con objetivo, consejo y 3 recordatorios del módulo |
| Responder moviendo las cuentas | Opción por defecto en los cálculos; también se puede responder con teclado |
| Mensaje de error específico | Pista propia de cada nivel tras el primer fallo |
| Siguiente paso | Se muestra al subir de nivel |
| Dominio con constancia | **2 sesiones dominadas entre las últimas 3**, en vez de 2 seguidas |
| Recomendación explicable y estadísticas | Frase en la tarjeta de hoy y panel con precisión, constancia, prácticas y tiempo medio |

No adoptamos el temporizador con cuenta regresiva por ronda: a los 7 años preferimos medir el tiempo sin presionar.

## 5. Rediseño v2: ¿app móvil? y una identidad propia

**Qué falló en la v1 (medido en celular y tableta):**
- En el celular había que desplazarse para responder: el botón ✓ quedaba 250 px por debajo de la pantalla.
- Las cuentas del ábaco medían 52×22 px en las sumas de 3 cifras, por debajo del mínimo de 44 px para tocar. Además había que acertar justo en la cuenta.
- La tableta estaba desaprovechada, había mucho texto sin voz y la apariencia era genérica: tarjetas blancas, naranja y botones redondeados.

**Decisión sobre la app móvil:** el problema era el diseño táctil, no la tecnología. Por eso se rediseñó la experiencia y se convirtió en una **app instalable (PWA)**: ícono en la pantalla de inicio, pantalla completa y uso sin internet, sin tiendas ni costos. Si más adelante se quiere un recordatorio diario o publicarla en tiendas, el mismo código se puede empaquetar con Capacitor.

**Decisiones con la familia:**
- **Estilo C, «juguete de madera»:** ábaco con cuentas redondas tipo Montessori y colores miel, tomate y hoja. Lo guía Mapi, una mascota que habla.
- **Dispositivos:** celular y computador.
- **Las cuentas se hacen en un ábaco real y con lápiz.** La pantalla guía, cronometra y corrige.
- **Caligrafía de los números** como objetivo explícito, al estilo de las hojas Kumon 4A de trazado.

## 6. Rediseño v3: aprendizaje evolutivo

Al probarla con la niña aparecieron dos problemas:

1. **Las lecciones no eran evolutivas.** Empezaba leyendo números sin haber enseñado a contar, y pedía resolver sin mostrar antes cómo se hace.
2. **Escribir números en el celular no aportaba.** La caligrafía se practica mejor con lápiz.

**Principio adoptado: «yo lo hago, lo hacemos juntos, tú lo haces»** (liberación gradual de la responsabilidad):
- **👀 Mira:** Mapi enseña el concepto con tarjetas en el ábaco y resuelve ejemplos paso a paso, con voz.
- **🤝 Juntos:** 3 ejercicios guiados. Mapi dice cada movimiento, ella lo hace en su ábaco real, compara con la pantalla y toca «Hecho».
- **⭐ Tú:** práctica sin ayuda, con una pista tras el primer error y la solución paso a paso tras el segundo. Solo esta parte cuenta para el avance.

La primera vez en un nivel se hacen los tres pasos. Las siguientes sesiones van directo a «Tú», con la opción «Ver la lección otra vez».

**La ruta empieza desde cero** (25 niveles en 8 módulos):

| Módulo | Niveles |
|---|---|
| 1. Conozco el ábaco | A1 Partes del ábaco · A2 Contar del 1 al 4 · A3 El 5 (cuenta del cielo) · A4 Del 6 al 9 · A5 Contar del 0 al 9 (antes y después) · A6 El 10 y las decenas · A7 Hasta el 99 · A8 Hasta el 999 |
| 2. Sumas y restas directas | B1 Sumar con cuentas de tierra · B2 Sumar 5 o más · B3 Restas directas |
| 3. Amigos del 5 | C1 Sumas · C2 Restas |
| 4. Amigos del 10 | D1 Sumas que llevan · D2 Restas que piden prestado · D3 Mezcladas |
| 5. Dos cifras | E1 Sin llevar · E2 Llevando · E3 Restas |
| 6. Tres cifras | F1 Sumas · F2 Restas |
| 7. Listas de soroban | G1 De 1 cifra · G2 De 2 cifras |
| 8. Anzan | H1 Flash de 3 · H2 Flash de 5 |

**Tipos de ejercicio:**
- *Preguntas de comprensión* con tres opciones (por ejemplo, «¿Cuánto vale la cuenta del cielo?»).
- *Poner* un número en el ábaco real y compararlo con la imagen.
- *Contar* uno más o uno menos («6 → ?»).
- *Leer* el ábaco.
- *Cálculos*.
- *Flash anzan*.

**Caligrafía solo en papel:** se quitó el trazado en pantalla. Quedan las hojas de caligrafía y una fila de caligrafía en cada hoja diaria. En las hojas de contar, la respuesta se escribe a mano («6 → __»).

## 7. Rediseño v4: moderno, guiado y con progreso (referencia: Smartick)

**Comentarios al probar la v3:**
- El diseño se veía viejo.
- Había menús abajo que confundían: «Aprende» tenía tutoriales, pero el primer botón empezaba como si la niña ya supiera.
- No se veía el progreso.

**Lo que hace bien la app infantil de Smartick** (según su web, smartick.com, y la ayuda sobre el Mundo Virtual):
- Estética limpia y luminosa: blanco, celeste y nubes, con un acento naranja.
- Una sola entrada a la sesión del día.
- Ayuda «?» y tutoriales dentro del ejercicio.
- Recompensas (ticks, avatar, Mundo Virtual) y progreso visible.

**Cambios:**
1. **El inicio es el camino.** Una sola tarjeta «Continuar» con los pasos Mira / Juntos / Tú del nivel actual y un mapa de niveles por módulos. Los niveles superados llevan ✓ y estrellas; el actual tiene la marca «¡Empieza aquí!»; los siguientes están bloqueados. Ya no hay atajos que salten la lección, y la práctica en papel solo aparece después de ver la lección.
2. **Las guías van dentro del nivel:** el botón «?» de la sesión abre la lección, pausa el tiempo y vuelve al mismo ejercicio.
3. **Progreso y logros:** estrellas por sesión (la mejor de cada nivel se ve en el mapa), racha y 16 medallas. Las medallas nuevas se celebran al terminar.
4. **Barra inferior con solo cuatro lugares:** Camino, Logros, Ábaco y Padres. Imprimir y caligrafía pasan al área de padres.
5. **Estilo moderno:** fuentes Baloo 2 y Nunito, tarjetas blancas con sombras suaves, botones con relieve, cielo con nubes y un ábaco azul marino con cuentas naranjas y azules. Mapi pasa a ser un mapache dibujado en SVG en lugar del emoji.

## 8. Uso real y juegos de concentración

**Lo que funcionó con la niña:**
- La alternancia entre hacerlo en el ábaco físico y responder en el celular.
- La hoja impresa, que refuerza lo aprendido.

**Explicaciones más claras.** En español «cuenta» es la pieza del ábaco y también el verbo contar. Frases como «¿Qué cuentas cuentan?» o «Cuenta las cuentas» confundían. Ahora las piezas se llaman **bolitas** («la bolita de arriba vale 5», «las bolitas de abajo valen 1») y el verbo es «valen». «Cielo» y «tierra» se mencionan una sola vez, en la primera lección.

**Juegos para la concentración y la motivación (7 años).** Se abren solo después de practicar ese día, como el Mundo Virtual de Smartick, para que sean un premio y no un atajo. El ajuste está en Padres. Al terminar la sesión o la hoja aparece «🎮 ¡Hora del juego!», y cada día se sugiere uno.

| Juego | Qué entrena | Niveles y meta por partida |
|---|---|---|
| Tabla de Schulte | Atención visual sostenida y búsqueda rápida | 3×3 (≤ 20 s), 4×4 (≤ 40 s), 5×5 (≤ 70 s), con máximo 2 errores |
| Recuerda el número | Memoria de trabajo (secuencia de cifras) | Cantidad de cifras (empieza en 3); 5 rondas, meta 4 de 5 |
| Recuerda el ábaco | Visualizar el ábaco (base del anzan) | 1, 2 o 3 cifras, sin pasar de lo que ya sabe leer en la ruta; 8 rondas, meta 7 de 8 |
| Luces en orden (Corsi) | Memoria visoespacial | Cantidad de luces (empieza en 3); 5 rondas, meta 4 de 5 |

**Avance gradual (pedido después de probarlo):** la primera versión subía de 3×3 a 4×4 tras una sola partida rápida, y eso podía frustrar. Ahora cada juego mantiene su nivel varias partidas:
- **Registro:** cada partida guarda su tiempo o puntaje.
- **Sube:** con al menos 4 partidas en ese nivel y las últimas 3 seguidas dentro de la meta, logradas en 2 días distintos. Si las logra el mismo día, Mapi le dice «si mañana también lo logras, subes».
- **Baja:** un nivel tras 3 partidas seguidas muy difíciles.
- **Ella ve:** el nivel, la meta, los puntos de avance y sus últimas marcas.
- **Los padres ven:** el detalle en Padres → Progreso.

Cada juego tiene la explicación de Mapi antes de jugar, estrellas, récords y medallas: «A jugar», «Ojo de águila» (Schulte 4×4), «Memoria de elefante» (5 cifras) y «Camino de luces» (5 luces).

## 9. Dictado de números en papel

En Kumon y en la escuela, el dictado une tres cosas: escuchar el número, reconocer su forma y escribirlo bien. Aquí completa la caligrafía, que hasta ahora solo se practicaba copiando un modelo.

- **Cómo funciona:** en el inicio está la tarjeta «Dictado de números». Mapi dice «Casilla 3. Escribe el 7. Otra vez: el 7.», y ella lo escribe con lápiz en esa casilla de su hoja. Puede tocar «Repetir» las veces que quiera, y avanza con «Siguiente» a su ritmo. En pantalla nunca ve el número: solo escucha.
- **La hoja:** 12 casillas con renglón de caligrafía (una por cifra) y una fila para repasar con calma los números que le costaron. Se imprime desde el dictado o desde Padres, varios días con hoja de respuestas.
- **Los números:** son evolutivos y siguen la ruta. Mientras aprende las unidades, salen del 0 al 9 (los diez dígitos en desorden y dos de repaso). Desde las decenas (A6) salen hasta el 99, y desde las centenas (A8) hasta el 999. En Padres se puede fijar 1, 2 o 3 cifras. Cada día tiene sus números, así que la hoja de respuestas impresa coincide con lo que dicta Mapi ese día.
- **Corrección:** al terminar, la app muestra los 12 números. Ella (o un adulto) compara con su hoja y toca los que estén equivocados o mal escritos. Se guardan los aciertos y el tiempo, y gana estrellas. Mapi le dice cuáles repasar con lápiz.
- **Motivación:** el dictado cuenta para la racha del día y abre los juegos. Hay dos medallas: «Buen oído» (el primer dictado) y «Mano firme» (10 dictados). En Padres → Progreso se ve el total y los últimos resultados.
- **Sin voz:** si el dispositivo no tiene voz en español, un adulto puede dictar tocando «👁 Ver número».

## 10. Ideas para siguientes versiones

- **Evaluación inicial** al estilo Smartick o la «recomendación» de Supercerebros, para elegir el nivel de inicio automáticamente.
- **Adaptación dentro de la sesión**: si falla dos seguidos, intercalar un ejercicio del nivel anterior.
- **Recordatorio diario** («¡Hora del ábaco!»), empaquetando la app con Capacitor.
- **Varios perfiles**, por ejemplo para hermanos.
- **Sincronizar el progreso** entre dispositivos (hoy se guarda en el navegador y se pasa con exportar e importar).
- **Multiplicación y división** en el soroban.
- **Mapi que se viste:** gastar las estrellas en accesorios para Mapi, como el Mundo Virtual de Smartick.

## Fuentes

- Smartick: [El Espectador](https://www.elespectador.com/actualidad/quince-minutos-diarios-para-aprender-matematicas-con-el-metodo-online-smartick-article/), [BioBioChile](https://www.biobiochile.cl/especial/e-learning/noticias/2020/11/13/smartick-la-plataforma-que-ayuda-a-los-ninos-a-reforzar-matematicas.shtml), [Colombia.com](https://www.colombia.com/tecnologia/aplicaciones/sdi/165664/smartick-el-secreto-contra-los-malos-resultados-en-matematicas-para-ninos), [Educación 3.0](https://www.educaciontrespuntocero.com/experiencias/smartick/)
- Kumon: la hoja de ejemplo compartida (niveles 4A y B) y el funcionamiento público del método.
- Smartick (app y recompensas): [smartick.com](https://www.smartick.com/), [¿Qué es el Mundo Virtual?](https://support.smartickmethod.com/en/articles/615497-what-is-the-virtual-world)
- Soroban: [video de referencia](https://youtu.be/0tN_roxCV3A) y [Supercerebros Play – Soroban desde cero](https://supercerebros.org/play/routes/soroban-desde-cero).
