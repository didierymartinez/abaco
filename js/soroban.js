/*
 * Ábaco – soroban interactivo en SVG.
 *
 * Cada varilla tiene 1 cuenta de cielo (vale 5) y 4 de tierra (valen 1).
 * Una cuenta cuenta cuando está pegada a la barra. La varilla de la derecha
 * son las unidades.
 */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const ROD_W = 60;
  const BEAD_W = 52;
  const BEAD_H = 24;
  const PAD = 14;
  const BEAM_H = 10;
  const BEAM_Y = PAD + BEAD_H * 2;
  const EARTH_Y = BEAM_Y + BEAM_H;
  const FRAME_H = EARTH_Y + BEAD_H * 5 + PAD;
  const DIGITS_H = 30;
  const LABELS_H = 26;
  const PLACE_SHORT = ['U', 'D', 'C', 'UM', 'DM', 'CM'];

  function el(name, attrs, parent) {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  // Cuenta redondeada, como las de un ábaco de madera.
  function beadPath() {
    const w = BEAD_W, h = BEAD_H - 2, r = h / 2;
    return `M${r} 1 H${w - r} A${r} ${r} 0 0 1 ${w - r} ${h + 1} H${r} A${r} ${r} 0 0 1 ${r} 1 Z`;
  }

  class Soroban {
    constructor(container, opts = {}) {
      this.container = container;
      this.rods = opts.rods || 3;
      this.interactive = opts.interactive !== false;
      this.showDigits = !!opts.showDigits;
      this.showLabels = !!opts.showLabels;
      this.animate = opts.animate !== false;
      this.onChange = opts.onChange || null;
      this.state = [];
      this.build();
      this.setValue(opts.value || 0);
    }

    build() {
      this.container.innerHTML = '';
      this.state = Array.from({ length: this.rods }, () => ({ upper: 0, lower: 0 }));
      const top = this.showDigits ? DIGITS_H : 0;
      const width = this.rods * ROD_W + PAD * 2;
      const height = top + FRAME_H + (this.showLabels ? LABELS_H : 0);
      const svg = el('svg', {
        viewBox: `0 0 ${width} ${height}`,
        class: 'soroban' + (this.interactive ? ' is-interactive' : '') + (this.animate ? ' is-animated' : ''),
        role: 'group',
        'aria-label': 'Ábaco soroban'
      });
      this.svg = svg;
      const g = el('g', { transform: `translate(0 ${top})` }, svg);

      el('rect', { x: 1, y: 1, width: width - 2, height: FRAME_H - 2, rx: 12, class: 'sb-frame' }, g);
      el('rect', { x: PAD - 4, y: PAD - 4, width: width - PAD * 2 + 8, height: FRAME_H - PAD * 2 + 8, rx: 6, class: 'sb-inner' }, g);

      this.rodNodes = [];
      for (let c = 0; c < this.rods; c++) {
        const place = this.rods - 1 - c;
        const cx = PAD + c * ROD_W + ROD_W / 2;
        const rodG = el('g', { class: 'sb-rod', 'data-place': place }, g);
        el('rect', { x: cx - ROD_W / 2 + 2, y: PAD - 2, width: ROD_W - 4, height: FRAME_H - PAD * 2 + 4, rx: 6, class: 'sb-highlight' }, rodG);
        el('line', { x1: cx, y1: PAD - 4, x2: cx, y2: FRAME_H - PAD + 4, class: 'sb-stick' }, rodG);

        const heaven = el('path', { d: beadPath(), class: 'sb-bead sb-heaven' }, rodG);
        const earth = [];
        for (let i = 0; i < 4; i++) earth.push(el('path', { d: beadPath(), class: 'sb-bead sb-earth' }, rodG));

        let digit = null;
        if (this.showDigits) {
          digit = el('text', { x: cx, y: -8, class: 'sb-digit', 'text-anchor': 'middle' }, rodG);
        }
        if (this.showLabels) {
          const label = el('text', { x: cx, y: FRAME_H + 19, class: 'sb-label', 'text-anchor': 'middle' }, rodG);
          label.textContent = PLACE_SHORT[place] || '';
        }

        // Área enfocable para usar el teclado (flechas arriba/abajo).
        if (this.interactive) {
          rodG.setAttribute('tabindex', '0');
          rodG.setAttribute('aria-label', `Varilla ${PLACE_SHORT[place] || place}`);
          rodG.addEventListener('keydown', e => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
              const d = this.getDigit(place) + (e.key === 'ArrowUp' ? 1 : -1);
              if (d >= 0 && d <= 9) this.setDigit(place, d, true);
            }
          });
        }
        this.rodNodes[place] = { cx, heaven, earth, digit, group: rodG };
      }

      el('rect', { x: PAD - 4, y: BEAM_Y, width: width - PAD * 2 + 8, height: BEAM_H, class: 'sb-beam' }, g);
      for (let place = 0; place < this.rods; place += 3) {
        el('circle', { cx: this.rodNodes[place].cx, cy: BEAM_Y + BEAM_H / 2, r: 2.6, class: 'sb-dot' }, g);
      }

      // Zonas de toque: toda la parte de cielo y toda la de tierra de cada varilla,
      // para no tener que acertar justo en la cuenta. También se puede deslizar.
      if (this.interactive) {
        for (let place = 0; place < this.rods; place++) {
          const x = this.rodNodes[place].cx - ROD_W / 2;
          const zones = [
            el('rect', { x, y: 0, width: ROD_W, height: BEAM_Y, class: 'sb-hit', 'data-zone': 'heaven' }, g),
            el('rect', { x, y: EARTH_Y, width: ROD_W, height: FRAME_H - EARTH_Y, class: 'sb-hit', 'data-zone': 'earth' }, g)
          ];
          zones.forEach(z => this.bindZone(z, place));
        }
        svg.style.touchAction = 'none';
      }
      this.container.appendChild(svg);
    }

    localY(e) {
      const pt = this.svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      return pt.matrixTransform(this.svg.querySelector('g').getScreenCTM().inverse()).y;
    }

    bindZone(zone, place) {
      let start = null;
      zone.addEventListener('pointerdown', e => {
        if (!this.interactive) return;
        e.preventDefault();
        zone.setPointerCapture(e.pointerId);
        start = this.localY(e);
      });
      const end = e => {
        if (start === null) return;
        const dy = this.localY(e) - start;
        const swipe = Math.abs(dy) > BEAD_H * 0.6 ? Math.sign(dy) : 0;
        if (zone.dataset.zone === 'heaven') this.moveHeaven(place, swipe);
        else this.moveEarth(place, start, swipe);
        start = null;
      };
      zone.addEventListener('pointerup', end);
      zone.addEventListener('pointercancel', () => { start = null; });
    }

    // Tocar alterna la cuenta del cielo; deslizar hacia abajo la pone y hacia arriba la quita.
    moveHeaven(place, swipe) {
      const rod = this.state[place];
      rod.upper = swipe > 0 ? 1 : swipe < 0 ? 0 : 1 - rod.upper;
      this.changed();
    }

    // En la tierra, el hueco bajo el dedo decide cuántas cuentas quedan pegadas a la barra:
    // tocar una cuenta sube (o baja) hasta ella; deslizar hacia arriba solo sube y hacia abajo solo baja.
    moveEarth(place, y, swipe) {
      const rod = this.state[place];
      const slot = Math.max(0, Math.min(4, Math.floor((y - EARTH_Y) / BEAD_H)));
      if (swipe < 0) rod.lower = Math.max(rod.lower, slot === rod.lower ? Math.min(4, slot + 1) : slot);
      else if (swipe > 0) rod.lower = Math.min(rod.lower, slot);
      else rod.lower = slot;
      this.changed();
    }

    changed() {
      if (navigator.vibrate) {
        try { navigator.vibrate(8); } catch (e) { /* sin vibración */ }
      }
      this.render();
      if (this.onChange) this.onChange(this.getValue());
    }

    getDigit(place) {
      const rod = this.state[place];
      return rod.upper * 5 + rod.lower;
    }

    setDigit(place, d, notify) {
      this.state[place] = { upper: d >= 5 ? 1 : 0, lower: d % 5 };
      if (notify) this.changed();
      else this.render();
    }

    getValue() {
      let v = 0;
      for (let place = this.rods - 1; place >= 0; place--) v = v * 10 + this.getDigit(place);
      return v;
    }

    setValue(n) {
      let v = Math.max(0, Math.floor(n)) % 10 ** this.rods;
      for (let place = 0; place < this.rods; place++) {
        const d = v % 10;
        this.state[place] = { upper: d >= 5 ? 1 : 0, lower: d % 5 };
        v = Math.floor(v / 10);
      }
      this.render();
    }

    clear() {
      this.setValue(0);
      if (this.onChange) this.onChange(0);
    }

    setInteractive(on) {
      this.interactive = on;
      this.svg.classList.toggle('is-interactive', on);
      this.svg.querySelectorAll('.sb-hit').forEach(z => { z.style.pointerEvents = on ? '' : 'none'; });
    }

    // Resalta la varilla con la que se está trabajando (o ninguna con null).
    highlight(place) {
      this.rodNodes.forEach((node, p) => node.group.classList.toggle('is-highlighted', p === place));
    }

    render() {
      for (let place = 0; place < this.rods; place++) {
        const node = this.rodNodes[place];
        const rod = this.state[place];
        const x = node.cx - BEAD_W / 2;
        positionBead(node.heaven, x, rod.upper ? BEAM_Y - BEAD_H : PAD, rod.upper);
        node.earth.forEach((bead, i) => {
          const on = i < rod.lower;
          positionBead(bead, x, on ? EARTH_Y + i * BEAD_H : EARTH_Y + (i + 1) * BEAD_H, on);
        });
        if (node.digit) node.digit.textContent = this.getDigit(place);
      }
    }
  }

  function positionBead(bead, x, y, on) {
    bead.style.transform = `translate(${x}px, ${y}px)`;
    bead.classList.toggle('is-on', !!on);
  }

  global.Soroban = Soroban;
})(window);
