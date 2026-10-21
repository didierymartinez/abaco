# Mi Ábaco

Una app para que una niña practique a diario con el ábaco soroban y mejore la caligrafía de los números. Se instala en el celular o el computador y funciona sin internet.

Los cálculos se hacen **en un ábaco real y con lápiz**. La app hace de guía: Mapi, la mascota, explica con voz, cronometra, corrige y lleva la racha.

- 🔥 **Racha:** cada día practicado sube una cuenta en la varilla de la semana.
- 🧮 **Sesión diaria:** Mapi presenta el nivel, sigue un calentamiento de caligrafía y luego 10 ejercicios. Ella los resuelve en su ábaco y escribe el resultado en un teclado grande. Si falla dos veces, ve la solución paso a paso en el ábaco en pantalla.
- ✏️ **Hoja en papel:** se imprime la hoja del día, un cronómetro mide el tiempo mientras trabaja y al final se corrige tocando las respuestas equivocadas.
- ✍️ **Escribir números:** traza cada número con el dedo o el mouse en tres rondas (con camino, con puntos, sin ayuda). Muestra el orden de los trazos y califica con estrellas.
- 🖨️ **Imprimir:** hojas diarias por nivel con una fila de caligrafía y hoja de respuestas, más hojas de caligrafía de los números al estilo Kumon 4A.
- 🗺️ **Mi camino:** la ruta por módulos, con progreso, estadísticas y repaso de niveles anteriores.
- 👨‍👩‍👧 **Padres:** nivel, tipo de ábaco (real o en pantalla), voz, calentamiento, historial y copia de seguridad.

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

## Estructura

| Archivo | Qué contiene |
|---|---|
| `index.html` | Vistas: inicio, sesión, resultado, hoja en papel, escribir números, mi camino, imprimir, aprende y padres |
| `css/app.css` | Estilo «juguete de madera», diseño para celular y computador, e impresión |
| `js/curriculum.js` | Niveles y módulos, generadores de ejercicios con semilla y explicación paso a paso |
| `js/soroban.js` | Soroban en SVG: tocar o deslizar las cuentas, flechas del teclado |
| `js/caligrafia.js` | Trazos de los números 0–9, juego de trazado con puntuación y casillas para imprimir |
| `js/app.js` | Lógica de la app: Mapi y su voz, racha, sesión, avance de nivel, hoja en papel e impresión |
| `manifest.webmanifest`, `sw.js`, `icons/` | App instalable y sin conexión |
