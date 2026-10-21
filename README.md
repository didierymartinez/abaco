# Mi Ábaco

Una app para que una niña practique a diario con el ábaco soroban y mejore la caligrafía de los números. Se instala en el celular o el computador y funciona sin internet.

Los cálculos se hacen **en un ábaco real y con lápiz**. La app hace de guía: Mapi, la mascota, explica con voz, cronometra, corrige y lleva la racha.

Todo es **evolutivo**. La ruta empieza por conocer el ábaco y contar, y cada nivel se aprende en tres pasos:
1. **👀 Mira:** Mapi explica el concepto y resuelve ejemplos en el ábaco, paso a paso.
2. **🤝 Juntos:** ella hace 3 ejercicios en su ábaco siguiendo cada paso con Mapi.
3. **⭐ Tú:** practica sin ayuda. Solo esta parte cuenta para subir de nivel.

- 🔥 **Racha:** cada día practicado sube una cuenta en la varilla de la semana.
- 🧮 **Sesión diaria:** la primera vez en un nivel hace Mira → Juntos → Tú; después va directo a practicar, y puede volver a ver la lección. Resuelve en su ábaco y responde con un teclado grande, comparando su ábaco con la imagen o eligiendo entre opciones. Si falla dos veces, ve la solución paso a paso.
- 📄 **Hoja en papel:** se imprime la hoja del día, un cronómetro mide el tiempo mientras trabaja y al final se corrige tocando las respuestas equivocadas.
- ✏️ **Caligrafía, solo en papel:** hojas de los números al estilo Kumon 4A (modelo con orden de trazo, puntos para repasar y casillas para escribir). Cada hoja diaria empieza con una fila de caligrafía.
- 🖨️ **Imprimir:** hojas diarias por nivel (las del día coinciden con la sesión) y hoja de respuestas.
- 🗺️ **Mi camino:** la ruta por módulos, con progreso, estadísticas y repaso de niveles anteriores.
- 👨‍👩‍👧 **Padres:** nivel, tipo de ábaco (real o en pantalla), voz, historial y copia de seguridad.

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
| `index.html` | Vistas: inicio, sesión (Mira, Juntos, Tú), resultado, hoja en papel, mi camino, imprimir, aprende y padres |
| `css/app.css` | Estilo «juguete de madera», diseño para celular y computador, e impresión |
| `js/curriculum.js` | 25 niveles en 8 módulos con sus lecciones, generadores de ejercicios con semilla y pasos para enseñar, guiar y explicar |
| `js/soroban.js` | Soroban en SVG: tocar o deslizar las cuentas, flechas del teclado |
| `js/caligrafia.js` | Trazos de los números 0–9 con su orden, para las hojas de caligrafía |
| `js/app.js` | Lógica de la app: Mapi y su voz, racha, sesión, avance de nivel, hoja en papel e impresión |
| `manifest.webmanifest`, `sw.js`, `icons/` | App instalable y sin conexión |
