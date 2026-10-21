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

## 6. Lo que implementa Mi Ábaco

- **Inicio:** Mapi saluda; la racha se muestra como cuentas en una varilla con los 7 días; hay un botón grande para jugar, la hoja en papel y cuatro accesos.
- **Sesión diaria** (10 ejercicios por defecto), en una sola pantalla sin desplazarse:
  1. Mapi presenta el nivel con voz, con 3 recordatorios del módulo.
  2. **Calentamiento de caligrafía:** el número del día (el que tiene menos estrellas) se escribe una vez con camino y otra sin ayuda.
  3. **Ejercicios con el ábaco real:** ella calcula en su ábaco y escribe el resultado en un teclado grande. En «Pon el número» compara su ábaco con la imagen y responde «¿Se ve así?».
  4. Dos intentos, con una pista del nivel tras el primer fallo. Después, **«Ver cómo se hace»** anima la solución en el ábaco en pantalla y Mapi la explica con voz.
  5. Si no hay ábaco real, los padres pueden cambiar a «ábaco en pantalla»: las cuentas se tocan o se deslizan, con zonas de toque grandes.
- **Hoja en papel:** imprimir la hoja del día, cronómetro grande «▶ / ¡Terminé!» y corrección tocando las respuestas equivocadas. Cuenta para la racha y para el avance de nivel.
- **Escribir números:** los 10 números con orden de trazo, punto de inicio y flecha. Tres rondas (con camino, con puntos, sin ayuda); la puntuación revisa la forma, el orden y la dirección de los trazos.
- **Imprimir:** hojas del nivel (las del día coinciden con la sesión) con una fila de caligrafía arriba, hoja de respuestas, y hojas de caligrafía de todos los números o de uno solo, con el modelo, puntos que se van desvaneciendo y casillas para escribir solo.
- **Mi camino, Aprende y Padres**, como en la versión anterior, más los ajustes nuevos: tipo de ábaco, voz y calentamiento.
- **App instalable:** manifiesto, íconos y *service worker* para usarla sin conexión.

### Niveles

| Código | Contenido |
|---|---|
| A1–A3 | Leer y poner números (0–9, hasta 99, hasta 999) |
| B1–B2 | Sumas y restas directas de 1 cifra |
| B3–B4 | Amigos del 5 (sumas y restas) |
| C1–C3 | Amigos del 10 (llevar y pedir prestado), mezcla |
| D1–D3 | 2 cifras (sin llevar, llevando, restas) |
| E1–E2 | 3 cifras (como la hoja Kumon B91a) |
| F1–F2 | Listas de 4 números (1 y 2 cifras) |
| G1–G2 | Anzan: flash de 3 y 5 números |

Los generadores revisan qué movimiento pide cada varilla (directo, amigo del 5 o amigo del 10). Así, por ejemplo, un nivel de «sumas directas» nunca incluye un ejercicio que necesite amigos.

## 7. Ideas para siguientes versiones

- **Evaluación inicial** al estilo Smartick o la «recomendación» de Supercerebros, para elegir el nivel de inicio automáticamente.
- **Adaptación dentro de la sesión**: si falla dos seguidos, intercalar un ejercicio del nivel anterior.
- **Recordatorio diario** («¡Hora del ábaco!»), empaquetando la app con Capacitor.
- **Dictado de números:** Mapi dice un número y ella lo escribe con el dedo, para unir caligrafía y lectura de números.
- **Varios perfiles**, por ejemplo para hermanos.
- **Sincronizar el progreso** entre dispositivos (hoy se guarda en el navegador y se pasa con exportar e importar).
- **Multiplicación y división** en el soroban.
- **Mapi que crece** o se viste con la racha.

## Fuentes

- Smartick: [El Espectador](https://www.elespectador.com/actualidad/quince-minutos-diarios-para-aprender-matematicas-con-el-metodo-online-smartick-article/), [BioBioChile](https://www.biobiochile.cl/especial/e-learning/noticias/2020/11/13/smartick-la-plataforma-que-ayuda-a-los-ninos-a-reforzar-matematicas.shtml), [Colombia.com](https://www.colombia.com/tecnologia/aplicaciones/sdi/165664/smartick-el-secreto-contra-los-malos-resultados-en-matematicas-para-ninos), [Educación 3.0](https://www.educaciontrespuntocero.com/experiencias/smartick/)
- Kumon: la hoja de ejemplo compartida (niveles 4A y B) y el funcionamiento público del método.
- Soroban: [video de referencia](https://youtu.be/0tN_roxCV3A) y [Supercerebros Play – Soroban desde cero](https://supercerebros.org/play/routes/soroban-desde-cero).
