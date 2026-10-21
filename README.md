# Mi Ábaco

Herramientas para aprender a usar el ábaco soroban. Es una app web para niños que combina tres ideas:

- **Kumon:** hojas diarias por niveles.
- **Smartick:** sesiones cortas con respuesta inmediata.
- **Soroban:** amigos del 5 y del 10, y cálculo mental (anzan).

- 🔥 **Racha** de días seguidos practicando.
- 🧮 **Sesión diaria:** leer el ábaco, poner números, sumas y restas en columna y *flash anzan*.
- 🖨️ **Hojas imprimibles** con encabezado Nombre / Fecha / Tiempo y hoja de respuestas.
- 👣 **Explicación paso a paso** en el ábaco cuando la niña se equivoca.
- 👨‍👩‍👧 **Panel de padres** con nivel, ajustes, historial y copia de seguridad.

El análisis de las plataformas está en [docs/analisis-plataformas.md](docs/analisis-plataformas.md).

## Uso

Es HTML, CSS y JavaScript sin dependencias ni compilación. Basta con abrir `index.html` en el navegador o servir la carpeta:

```sh
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

El progreso se guarda en el navegador (`localStorage`). Para pasarlo a otro dispositivo, usa *Padres → Exportar / Importar*.

## Estructura

| Archivo | Qué contiene |
|---|---|
| `index.html` | Vistas: inicio, sesión, resultado, imprimir, aprende y padres |
| `css/app.css` | Estilos, incluidos los de impresión |
| `js/curriculum.js` | Niveles, generadores de ejercicios con semilla y explicación paso a paso |
| `js/soroban.js` | Soroban interactivo en SVG (clic o flechas del teclado) |
| `js/app.js` | Lógica de la app: racha, sesión, avance de nivel, impresión y panel de padres |
