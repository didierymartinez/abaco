# Mi Ábaco y Mi Lectura

Este repositorio tiene dos apps hermanas, con la misma dinámica de sesión diaria, racha, estrellas y niveles que suben con dominio. Las dos se instalan en el celular o el computador y funcionan sin internet:
- **Mi Ábaco** (en la raíz): ábaco soroban, caligrafía de números, dictado y juegos.
- **[Mi Lectura](#mi-lectura)** (en `lectura/`): lectura diaria con Lino el búho para niños y adultos. Trabaja rango visual, velocidad, comprensión y memoria.

Cada una tiene un enlace a la otra en su pantalla de inicio.

## Mi Ábaco

Una app para que una niña practique a diario con el ábaco soroban y mejore la caligrafía de los números.

Los cálculos se hacen **en un ábaco real y con lápiz**. La app hace de guía: Mapi, la mascota, explica con voz, cronometra, corrige y lleva la racha.

Todo es **evolutivo**. La ruta empieza por conocer el ábaco y contar, y cada nivel se aprende en tres pasos:
1. **👀 Mira:** Mapi explica el concepto y resuelve ejemplos en el ábaco, paso a paso.
2. **🤝 Juntos:** ella hace 3 ejercicios en su ábaco siguiendo cada paso con Mapi.
3. **⭐ Tú:** practica sin ayuda. Solo esta parte cuenta para subir de nivel.

La app tiene cinco secciones en la barra inferior:

- 🗺️ **Camino (inicio):**
  - La tarjeta «Continuar» muestra el nivel actual y el estado de sus tres pasos. La lección siempre va antes de practicar.
  - Debajo está el mapa de la ruta: niveles superados con ✓ y estrellas, el nivel actual resaltado y los siguientes bloqueados.
  - También muestra la racha de la semana. Cuando ya vio la lección, puede hacer la práctica en papel con cronómetro y corrección.
  - **✏️ Dictado de números:** Mapi dice 12 números y ella los escribe con lápiz en la hoja de dictado, cada uno en su casilla. Al final compara con la lista y marca los que estén mal. Los números siguen la ruta: del 0 al 9 mientras aprende las unidades, hasta el 99 desde las decenas y hasta el 999 desde las centenas. El dictado también cuenta para la racha y abre los juegos.
- 🎮 **Juegos:** se abren como premio después de practicar ese día (en pantalla, con la hoja o con el dictado). Hay dos grupos.

  **🧮 Con tu ábaco** (se juegan con el ábaco físico; la app dicta o muestra, cronometra y revisa):
  - **Pon el número:** sale un número y ella lo pone rápido en su ábaco. Toca «¡Listo!» y compara su ábaco con el de la pantalla. Nivel = cantidad de cifras; meta: 7 de 8 bien dentro de un tiempo.
  - **Escucha y calcula:** Mapi dicta una cuenta en cadena («Pon 3… más 4… menos 2») y ella la hace en su ábaco mientras escucha. Al final escribe el resultado. Nivel = cantidad de números; meta: 4 de 5.
  - **Mira y calcula:** igual, pero los números aparecen en la pantalla uno por uno.

  Las cuentas solo usan los movimientos que ya aprendió en la ruta: sumas directas, luego amigos del 5, luego amigos del 10. Por eso se abren en el nivel B1, y antes de B3 tienen como máximo 3 números. «Pon el número» tampoco pasa de las cifras que ya sabe poner.

  **🧠 Atención y memoria** (solo en pantalla):
  - **Tabla de Schulte:** tocar los números en orden. Niveles 3×3, 4×4 y 5×5, con una meta de tiempo.
  - **Recuerda el número:** ver un número unos segundos y escribirlo. Nivel = cantidad de cifras; meta: 4 de 5.
  - **Recuerda el ábaco:** ver el ábaco un momento y decir qué número era. Solo usa números que ya sabe leer; meta: 7 de 8.
  - **Luces en orden** (bloques de Corsi): repetir el orden en que se encienden las luces. Nivel = cantidad de luces; meta: 4 de 5.

  Cada partida se juega en el nivel actual y queda registrada. El nivel **sube solo con dominio**: al menos 4 partidas en ese nivel y las últimas 3 seguidas dentro de la meta, en 2 días distintos. **Baja un nivel** si hay 3 partidas seguidas muy difíciles, para no frustrar. Antes de jugar se ven el nivel, la meta, el avance («Para subir: ●●○») y las últimas marcas.
- 🏅 **Logros:** estrellas, racha, sesiones y un álbum de medallas: primera lección, sesión perfecta, rachas, dictados, juegos y una por cada módulo terminado.
- 🧮 **Ábaco:** ábaco libre para jugar, y «¿Cómo se hace?» para ver paso a paso cualquier suma o resta.
- 👨‍👩‍👧 **Padres** (con una multiplicación para entrar):
  - hojas para imprimir del nivel, de caligrafía (estilo Kumon 4A, solo en papel) y de dictado, con hoja de respuestas;
  - progreso (ruta, juegos y dictados), ajustes (nivel, tipo de ábaco, voz, cifras del dictado), historial y copia de seguridad.

Durante la sesión, el botón **«?»** abre la guía del nivel en cualquier momento. Mientras está abierta el tiempo se pausa, y al terminar se vuelve al mismo ejercicio.

Está inspirada en Kumon (hojas diarias por niveles), Smartick (sesiones cortas con respuesta inmediata) y la ruta «Soroban desde cero» de Supercerebros. El análisis está en [docs/analisis-plataformas.md](docs/analisis-plataformas.md).

## Mi Lectura

Lectura diaria de unos 10 minutos con Lino, el búho. Sirve para niños (desde que empiezan a leer frases) y para adultos. Cada lector tiene su perfil, con su racha, su nivel y su progreso.

**Sesión de hoy, en cinco pasos:**
1. **👁️ Calienta:** un ejercicio corto que cambia cada día: palabras relámpago, ¿tiene sentido?, ojos de búho, ¿palabra real? o busca la palabra.
2. **📖 Lee:** el texto del día, a su ritmo. Se mide en palabras por minuto (ppm). Por defecto, los niños leen en voz alta.
3. **❓ Entiende:** tres preguntas sin mirar el texto: un dato, una deducción y una palabra.
4. **⚡ Relee:** el mismo texto, un poco más rápido. Hay tres formas:
   - **con guía:** un resaltador avanza por el texto;
   - **palabra a palabra:** como las apps de lectura rápida, con la letra de enfoque en rojo, pausa y «⟲ volver a la frase»;
   - **en eco:** Lino lee cada frase y ella la repite igual. Es lo mejor cuando está empezando.
5. **🧠 Recuerda:** una pregunta del texto de ayer y otra del de hace una semana (retención), ordenar lo que pasó y el juego del día: palabras para recordar, completa la frase, recuerda la frase o palabras amigas.

**Cómo avanza:**
- La velocidad de la guía se ajusta sola: sube cuando entiende y la sigue cómoda, y baja si fue muy rápida.
- Los niveles de texto de niños (del 1 al 6) suben con 3 lecturas seguidas con buena comprensión y a la velocidad del nivel, en al menos 2 días.
- Los adultos ven su **velocidad efectiva** (velocidad × comprensión).

**Secciones:**
- 🏠 **Hoy:** la sesión, la racha y la gráfica de velocidad.
- 👁️ **Ejercicios:** nueve, con niveles que suben con dominio:
  - **Ojos rápidos:** palabras relámpago, ojos de búho y busca la palabra.
  - **Leer y entender:** ¿tiene sentido?, ¿palabra real?, completa la frase y palabras amigas.
  - **Memoria:** palabras para recordar y recuerda la frase.
- 📚 **Lector:** releer textos anteriores, o pegar cualquier texto para leerlo palabra a palabra, con guía o en eco con Lino.
- 📈 **Progreso:** velocidad, comprensión, retención, medallas y velocidades de referencia por grado.
- ⚙️ **Ajustes:** lectores, nivel, modos de lectura y copia de seguridad. Para niños, se entra con una multiplicación.

Trae 46 textos originales: 36 para niños, 6 por nivel, y 10 para adultos, cada uno con sus preguntas. La investigación y las fuentes están en [docs/lectura.md](docs/lectura.md).

## Uso

Es HTML, CSS y JavaScript sin dependencias ni compilación. Para probarlas en el computador:

```sh
python3 -m http.server 8000
# Mi Ábaco: http://localhost:8000 · Mi Lectura: http://localhost:8000/lectura/
```

### Instalarla en el celular

Para instalarla y usarla sin internet, la app debe publicarse en una dirección **https**. Lo más sencillo es activar **GitHub Pages** en este repositorio (Settings → Pages → rama principal).

Después, desde el celular:
- **Android / Chrome:** menú ⋮ → *Instalar aplicación*.
- **iPhone / iPad (Safari):** Compartir → *Agregar a pantalla de inicio*.

Si se publica en IIS, hay que agregar el tipo MIME `.webmanifest` → `application/manifest+json`.

El progreso se guarda en el dispositivo. Para pasarlo a otro, usa *Padres → Exportar / Importar*.

### Publicar una versión nueva

Al cambiar archivos de una app, sube el número de versión en **dos lugares** para que los celulares no mezclen archivos viejos y nuevos:
- Mi Ábaco: `?v=` en los enlaces de `css/app.css` y `js/*.js` de `index.html`, y `ASSETS` y `VERSION` en `sw.js`.
- Mi Lectura: lo mismo en `lectura/index.html` y `lectura/sw.js`.

Cada app guarda sus propias copias sin conexión (`mi-abaco-…` y `mi-lectura-…`), y ninguna borra las de la otra.

Si GitHub Pages no publica un cambio (el paso «Deploy to GitHub Pages» se queda en cola y falla por tiempo), abre *Actions → pages build and deployment → Re-run failed jobs*, o sube otro cambio a `main`.

Con internet, la app siempre pide la versión actual. Al detectar una versión nueva se recarga sola, y sin internet usa la copia guardada.

## Estructura

| Archivo | Qué contiene |
|---|---|
| `index.html` | Vistas: camino, juegos, logros, ábaco libre, padres, sesión (Mira, Juntos, Tú), resultado, práctica en papel, dictado e imprimir; Mapi en SVG |
| `css/app.css` | Estilo claro y moderno (cielo, tarjetas blancas, azul y naranja), celular y computador, e impresión |
| `js/curriculum.js` | 25 niveles en 8 módulos con sus lecciones, generadores de ejercicios con semilla y pasos para enseñar, guiar y explicar |
| `js/soroban.js` | Soroban en SVG: tocar o deslizar las cuentas, flechas del teclado |
| `js/caligrafia.js` | Trazos de los números 0–9 con su orden, para las hojas de caligrafía |
| `js/juegos.js` | Los juegos con el ábaco físico (pon el número, escucha y calcula, mira y calcula) y los de concentración (Schulte, memoria de cifras, flash del ábaco y Corsi), con niveles que suben con dominio |
| `js/app.js` | Lógica de la app: mapa de progreso, sesión con ayuda «?», estrellas y medallas, Mapi y su voz, práctica en papel, dictado, impresión y padres |
| `manifest.webmanifest`, `sw.js`, `icons/` | App instalable y sin conexión |
| `lectura/index.html` | Mi Lectura: bienvenida y lectores, hoy, sesión, resultado, ejercicios, lector, progreso y ajustes; Lino en SVG |
| `lectura/css/lectura.css` | Estilo de Mi Lectura (violeta y ámbar), texto con letra muy legible (Atkinson Hyperlegible) |
| `lectura/js/textos-*.js` | Textos originales con preguntas, pregunta de retención y orden de sucesos (niños 1–3, 4–6 y adultos) |
| `lectura/js/act-*.js` | Contenido de las actividades: frases con y sin sentido, frases para completar, palabras amigas y palabras reales o inventadas |
| `lectura/js/palabras.js` | Palabras frecuentes, nombres y adjetivos para armar frases, letras y sílabas de los ejercicios |
| `lectura/js/ejercicios.js` | Los nueve ejercicios en tres grupos y ordena la historia, con niveles por dominio |
| `lectura/js/lector.js` | Texto por palabras, lectura con guía, palabra a palabra con letra de enfoque y en eco |
| `lectura/js/app.js` | Lógica: lectores, sesión diaria, velocidad y guía adaptativas, retención, medallas, gráfica y ajustes |
| `lectura/manifest.webmanifest`, `lectura/sw.js`, `lectura/icons/` | Mi Lectura instalable por separado y sin conexión |
