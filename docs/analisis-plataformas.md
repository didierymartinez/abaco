# Análisis: Kumon, Smartick y el soroban

Este análisis sirve de base para decidir qué hace **Mi Ábaco**. Es una app para practicar a diario con una niña de 7 años. Combina la constancia de Kumon, la sesión corta y adaptativa de Smartick y el método del soroban (ábaco japonés).

## 1. Kumon (hojas en papel)

| Qué hace | Por qué funciona | Cómo lo usamos |
|---|---|---|
| Hojas diarias por niveles (códigos como `4A`, `B`), con *Nombre / Fecha / Tiempo* | Rutina, autonomía y el niño ve que avanza | Hojas imprimibles con el mismo encabezado y un código de nivel (`A1`…`G2`) |
| Pasos muy pequeños entre una hoja y la siguiente | El niño casi siempre puede resolver solo | Muchos niveles cortos (amigos del 5 antes que amigos del 10, etc.) |
| Avanza solo cuando domina: precisión **y** tiempo estándar | Se asegura la automatización antes de seguir | 2 sesiones seguidas con ≥ 90 % de aciertos al primer intento y dentro del tiempo objetivo |
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

## 4. Lo que implementa Mi Ábaco (v1)

- **Inicio:** racha de días seguidos 🔥, los últimos 7 días, el nivel actual con un consejo y un botón para empezar.
- **Sesión diaria** (10 ejercicios por defecto, configurable):
  - *Leer el ábaco*: escribir el número que muestra.
  - *Poner en el ábaco*: mover las cuentas hasta formar el número.
  - *Cálculo*: en horizontal (`3 + 4 =`) o en columna al estilo Kumon, con teclado numérico grande.
  - *Flash anzan*: los números aparecen uno a uno.
  - Dos intentos por ejercicio; después se muestra la respuesta y el botón **«Ver cómo se hace»** anima la solución en el ábaco paso a paso.
  - Un ábaco de ayuda opcional en cada cálculo.
- **Resultado:** estrellas, aciertos, tiempo, racha y un mensaje sobre el avance de nivel.
- **Hojas imprimibles:** una por día, con encabezado Kumon (*Nombre / Fecha / Tiempo*), 10 ejercicios y una hoja de respuestas. **La hoja de un día tiene los mismos ejercicios que la sesión en pantalla de ese día.** La hoja hecha en papel se puede registrar para que cuente en la racha.
- **Aprende:** un ábaco libre, las tablas de amigos del 5 y del 10, y una demostración paso a paso de cualquier suma o resta.
- **Padres:** se entra resolviendo una multiplicación. Ahí se elige el nivel y la cantidad de ejercicios, se activan o desactivan el sonido, las etiquetas U/D/C y la escritura de derecha a izquierda, y se consultan el historial y las copias de seguridad (exportar e importar).

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

## 5. Ideas para siguientes versiones

- **Evaluación inicial** al estilo Smartick, para elegir el nivel de inicio automáticamente.
- **Adaptación dentro de la sesión**: si falla dos seguidos, intercalar un ejercicio del nivel anterior.
- **App instalable sin conexión** (PWA) para usarla en una tableta.
- **Varios perfiles**, por ejemplo para hermanos.
- **Sincronizar el progreso** entre dispositivos (hoy se guarda en el navegador y se pasa con exportar e importar).
- **Multiplicación y división** en el soroban.
- **Pegatinas o mascota** que crecen con la racha.

## Fuentes

- Smartick: [El Espectador](https://www.elespectador.com/actualidad/quince-minutos-diarios-para-aprender-matematicas-con-el-metodo-online-smartick-article/), [BioBioChile](https://www.biobiochile.cl/especial/e-learning/noticias/2020/11/13/smartick-la-plataforma-que-ayuda-a-los-ninos-a-reforzar-matematicas.shtml), [Colombia.com](https://www.colombia.com/tecnologia/aplicaciones/sdi/165664/smartick-el-secreto-contra-los-malos-resultados-en-matematicas-para-ninos), [Educación 3.0](https://www.educaciontrespuntocero.com/experiencias/smartick/)
- Kumon: la hoja de ejemplo compartida (niveles 4A y B) y el funcionamiento público del método.
- Soroban: [video de referencia](https://youtu.be/0tN_roxCV3A).
