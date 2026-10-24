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
- 🎮 **Juegos:** cuatro juegos de concentración y memoria que se abren como premio después de practicar ese día (en pantalla o con la hoja):
  - **Tabla de Schulte:** tocar los números en orden. Empieza en 3×3 y crece a 4×4 y 5×5.
  - **Recuerda el número:** ver un número unos segundos y escribirlo. Agrega una cifra cada vez que acierta.
  - **Recuerda el ábaco:** ver el ábaco un momento y decir qué número era. Solo usa números que ya sabe leer.
  - **Luces en orden** (bloques de Corsi): repetir el orden en que se encienden las luces.

  Cada juego tiene la explicación de Mapi, estrellas y récords.
- 🏅 **Logros:** estrellas, racha, sesiones y un álbum de medallas: primera lección, sesión perfecta, rachas y una por cada módulo terminado.
- 🧮 **Ábaco:** ábaco libre para jugar, y «¿Cómo se hace?» para ver paso a paso cualquier suma o resta.
- 👨‍👩‍👧 **Padres** (con una multiplicación para entrar):
  - hojas para imprimir del nivel y de caligrafía (estilo Kumon 4A, solo en papel);
  - progreso, ajustes (nivel, tipo de ábaco, voz), historial y copia de seguridad.

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
| `index.html` | Vistas: camino, logros, ábaco libre, padres, sesión (Mira, Juntos, Tú), resultado, práctica en papel e imprimir; Mapi en SVG |
| `css/app.css` | Estilo claro y moderno (cielo, tarjetas blancas, azul y naranja), celular y computador, e impresión |
| `js/curriculum.js` | 25 niveles en 8 módulos con sus lecciones, generadores de ejercicios con semilla y pasos para enseñar, guiar y explicar |
| `js/soroban.js` | Soroban en SVG: tocar o deslizar las cuentas, flechas del teclado |
| `js/caligrafia.js` | Trazos de los números 0–9 con su orden, para las hojas de caligrafía |
| `js/juegos.js` | Los cuatro juegos de concentración (Schulte, memoria de cifras, flash del ábaco y Corsi), adaptativos |
| `js/app.js` | Lógica de la app: mapa de progreso, sesión con ayuda «?», estrellas y medallas, Mapi y su voz, práctica en papel, impresión y padres |
| `manifest.webmanifest`, `sw.js`, `icons/` | App instalable y sin conexión |
