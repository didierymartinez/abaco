# Mi Ábaco

Una app para que una niña practique a diario con el ábaco soroban y mejore la caligrafía de los números. Se instala en el celular o el computador y funciona sin internet.

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
- 🎮 **Juegos:** cuatro juegos de concentración y memoria que se abren como premio después de practicar ese día (en pantalla, con la hoja o con el dictado):
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

## Uso

Es HTML, CSS y JavaScript sin dependencias ni compilación. Para probarla en el computador:

```sh
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

### Instalarla en el celular

Para instalarla y usarla sin internet, la app debe publicarse en una dirección **https**. Lo más sencillo es activar **GitHub Pages** en este repositorio (Settings → Pages → rama principal).

Después, desde el celular:
- **Android / Chrome:** menú ⋮ → *Instalar aplicación*.
- **iPhone / iPad (Safari):** Compartir → *Agregar a pantalla de inicio*.

Si se publica en IIS, hay que agregar el tipo MIME `.webmanifest` → `application/manifest+json`.

El progreso se guarda en el dispositivo. Para pasarlo a otro, usa *Padres → Exportar / Importar*.

### Publicar una versión nueva

Al cambiar archivos de la app, sube el número de versión en **dos lugares** para que los celulares no mezclen archivos viejos y nuevos:
- `?v=` en los enlaces de `css/app.css` y `js/*.js` de `index.html`;
- `ASSETS` y `VERSION` en `sw.js`.

Con internet, la app siempre pide la versión actual. Al detectar una versión nueva se recarga sola, y sin internet usa la copia guardada.

## Estructura

| Archivo | Qué contiene |
|---|---|
| `index.html` | Vistas: camino, juegos, logros, ábaco libre, padres, sesión (Mira, Juntos, Tú), resultado, práctica en papel, dictado e imprimir; Mapi en SVG |
| `css/app.css` | Estilo claro y moderno (cielo, tarjetas blancas, azul y naranja), celular y computador, e impresión |
| `js/curriculum.js` | 25 niveles en 8 módulos con sus lecciones, generadores de ejercicios con semilla y pasos para enseñar, guiar y explicar |
| `js/soroban.js` | Soroban en SVG: tocar o deslizar las cuentas, flechas del teclado |
| `js/caligrafia.js` | Trazos de los números 0–9 con su orden, para las hojas de caligrafía |
| `js/juegos.js` | Los cuatro juegos de concentración (Schulte, memoria de cifras, flash del ábaco y Corsi), adaptativos |
| `js/app.js` | Lógica de la app: mapa de progreso, sesión con ayuda «?», estrellas y medallas, Mapi y su voz, práctica en papel, dictado, impresión y padres |
| `manifest.webmanifest`, `sw.js`, `icons/` | App instalable y sin conexión |
