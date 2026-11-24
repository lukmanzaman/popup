/* ============================================================================
   The Folded Atlas — 3D Pop-Up Book Engine, Interactions & Sound Foley
   ============================================================================ */

(function () {
  const CHAPTERS = window.ATLAS_CHAPTERS;
  const MAX_POS = CHAPTERS.length - 1; // 4.0

  // ---------- DOM Elements ----------
  const dom = {
    stage: document.getElementById('stageViewport'),
    bookScene: document.getElementById('bookScene'),
    bookRig: document.getElementById('bookRig'),
    turningLeaf: document.getElementById('turningLeaf'),
    staticLeftSurface: document.getElementById('staticLeftSurface'),
    staticRightSurface: document.getElementById('staticRightSurface'),
    staticLeftPopups: document.getElementById('staticLeftPopups'),
    staticRightPopups: document.getElementById('staticRightPopups'),
    leafFrontSurface: document.getElementById('leafFrontSurface'),
    leafBackSurface: document.getElementById('leafBackSurface'),
    leafFrontPopups: document.getElementById('leafFrontPopups'),
    leafBackPopups: document.getElementById('leafBackPopups'),
    leafFrontShade: document.getElementById('leafFrontShade'),
    leafBackShade: document.getElementById('leafBackShade'),
    dragEdgeLeft: document.getElementById('dragEdgeLeft'),
    dragEdgeRight: document.getElementById('dragEdgeRight'),

    chapterHeader: document.getElementById('chapterHeader'),
    chapterMeta: document.getElementById('chapterMeta'),
    chapterTitle: document.getElementById('chapterTitle'),
    chapterLocation: document.getElementById('chapterLocation'),
    chapterHint: document.getElementById('chapterHint'),

    storyEyebrow: document.getElementById('storyEyebrow'),
    storyBadge: document.getElementById('storyBadge'),
    storyCopy: document.getElementById('storyCopy'),
    progressDots: document.getElementById('progressDots'),
    turnStatus: document.getElementById('turnStatus'),
    turnCounter: document.getElementById('turnCounter'),
    scrubber: document.getElementById('pageScrubber'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnResetView: document.getElementById('btnResetView'),
    btnAutoRotate: document.getElementById('btnAutoRotate'),
    btnSound: document.getElementById('btnSound'),
    btnMap: document.getElementById('btnMap'),
    btnReadPage: document.getElementById('btnReadPage'),
    brandHome: document.getElementById('brandHome'),
    gestureToast: document.getElementById('gestureToast'),

    mapModal: document.getElementById('mapModal'),
    mapSvgContainer: document.getElementById('mapSvgContainer'),
    mapProgressLabel: document.getElementById('mapProgressLabel'),
    readerModal: document.getElementById('readerModal'),
    readerKicker: document.getElementById('readerKicker'),
    readerModalTitle: document.getElementById('readerModalTitle'),
    readerBody: document.getElementById('readerBody'),
    readerClue: document.getElementById('readerClue')
  };

  // ---------- Application State ----------
  const state = {
    bookPos: 0,           // Continuous 0.0 -> 4.0
    targetPos: 0,
    isScrubbing: false,
    isTurningDrag: false,

    // Mounted spread indices for the 4 page slots to avoid redundant DOM rebuilds
    mountedStaticLeft: -1,
    mountedStaticRight: -1,
    mountedLeafFront: -1,
    mountedLeafBack: -1,
    activeRestSpread: -1,

    // 3D Tabletop Camera Orbit
    camRotX: 54,
    camRotZ: -3,
    camZoom: 1,
    targetRotX: 54,
    targetRotZ: -3,
    targetZoom: 1,
    autoRotate: true,
    soundEnabled: true,
    isOrbitDragging: false,
    toastHidden: false,

    // Story & Puzzle States
    solved: new Set(),
    envelopeOpened: false,
    millAngle: 0,
    millTotalTurned: 0,
    millDragging: false,
    beaconRuns: 0,
    ribbonProgress: 0,

    // Real-time Walking & Living World State
    actorSpread: -1,
    pipX: 340,
    pipY: 406,
    pipDir: 1,
    pipPause: 0,
    pipBurstGoal: null, // Optional one-shot goal when user triggers puzzle!
    compX: 268,
    compY: 422,
    compDir: 1,
    compPause: 0.6
  };

  // ---------- Tactile Synthesized Web Audio Engine ----------
  const sound = {
    ctx: null,
    ensure() {
      if (!state.soundEnabled) return null;
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    tone(freq, dur, type = 'sine', vol = 0.09, delay = 0) {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    },
    pageRustle() {
      const ctx = this.ensure();
      if (!ctx) return;
      const dur = 0.22;
      const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / data.length) * Math.PI);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1250, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    },
    bellChime() {
      this.tone(587.33, 1.5, 'sine', 0.12, 0);
      this.tone(1174.66, 1.1, 'triangle', 0.06, 0.01);
      this.tone(1760, 0.7, 'sine', 0.04, 0.02);
    },
    woodPlank(i = 0) {
      this.tone(240 + i * 44, 0.11, 'triangle', 0.09, 0);
    },
    paperOpen() {
      this.pageRustle();
      this.tone(523.25, 0.25, 'sine', 0.07, 0.06);
      this.tone(659.25, 0.35, 'sine', 0.07, 0.14);
    },
    millTick() {
      this.tone(185, 0.045, 'square', 0.028, 0);
    },
    successChord() {
      this.tone(523.25, 0.45, 'sine', 0.08, 0);
      this.tone(659.25, 0.5, 'sine', 0.08, 0.09);
      this.tone(783.99, 0.65, 'sine', 0.09, 0.18);
    },
    beaconFlash(delay = 0) {
      this.tone(440, 0.32, 'sine', 0.09, delay);
      this.tone(880, 0.28, 'triangle', 0.045, delay + 0.02);
    },
    chirp() {
      this.tone(660, 0.09, 'sine', 0.06, 0);
      this.tone(880, 0.13, 'sine', 0.06, 0.06);
    }
  };

  // ---------- Responsive Book Scaling ----------
  function updateBookScale() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaleW = (vw - 80) / 1040;
    const scaleH = (vh - 150) / 680;
    const scale = Math.max(0.46, Math.min(1.06, Math.min(scaleW, scaleH)));
    document.documentElement.style.setProperty('--book-scale', scale.toFixed(3));
  }

  // ---------- Standee Rendering Helper ----------
  function buildPopupLayer(container, standees, isInteractiveHost) {
    container.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (const item of standees) {
      // Ground Contact Shadow
      if (item.shadowW) {
        const sh = document.createElement('div');
        sh.className = 'standee-shadow';
        sh.style.left = item.x + 'px';
        sh.style.top = item.y + 'px';
        sh.style.width = item.shadowW + 'px';
        sh.style.height = item.shadowH + 'px';
        sh.dataset.standeeId = item.id;
        frag.appendChild(sh);
      }

      // 3D Upright Standee
      const el = document.createElement('div');
      const isChar = item.role === 'pip' || item.role === 'companion';
      el.className = 'standee'
        + (item.interactive && isInteractiveHost ? ' is-interactive' : '')
        + (isChar && isInteractiveHost ? ' is-character' : '');
      el.style.left = item.x + 'px';
      el.style.top = item.y + 'px';
      el.style.width = item.w + 'px';
      el.style.height = item.h + 'px';
      el.style.setProperty('--yaw', (item.yaw || 0) + 'deg');
      el.dataset.standeeId = item.id;
      el.dataset.maxAngle = item.maxAngle || 86;
      if (item.kind) el.dataset.kind = item.kind;
      if (item.role) el.dataset.role = item.role;

      const inner = document.createElement('div');
      inner.className = 'standee-inner';
      inner.innerHTML = item.html;

      if (isChar && isInteractiveHost) {
        el.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          sound.chirp();
          const svg = el.querySelector('svg');
          if (svg) {
            svg.classList.remove('anim-hop');
            void svg.offsetWidth;
            svg.classList.add('anim-hop');
          }
        });
      }

      // Add subtle golden hotspot pulse ring for unsolved interactive props
      if (item.interactive && isInteractiveHost) {
        const ring = document.createElement('span');
        ring.className = 'hotspot-ring';
        if (item.kind === 'gate-bell') { ring.style.top = '54%'; }
        if (item.kind === 'ribbon-bridge') { ring.style.left = '28%'; ring.style.top = '58%'; }
        if (item.kind === 'library-envelope') { ring.style.top = '48%'; }
        if (item.kind === 'signal-mill') { ring.style.top = '40%'; }
        if (item.kind === 'lighthouse-beacon') { ring.style.left = '30%'; ring.style.top = '82%'; }
        inner.appendChild(ring);
      }

      el.appendChild(inner);
      frag.appendChild(el);
    }

    container.appendChild(frag);
  }

  function applyFoldFactor(container, factor) {
    const clamped = Math.max(0, Math.min(1, factor));
    // Smooth ease-out curve for natural paper hinge erection
    const eased = 1 - Math.pow(1 - clamped, 2.2);
    const items = container.children;
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      if (el.classList.contains('standee')) {
        const maxA = parseFloat(el.dataset.maxAngle) || 86;
        const angle = -(maxA * eased);
        el.style.setProperty('--fold-angle', angle.toFixed(2) + 'deg');
        el.style.opacity = clamped < 0.02 ? '0' : '1';
      } else if (el.classList.contains('standee-shadow')) {
        el.style.setProperty('--fold-e', eased.toFixed(3));
        el.style.setProperty('--shadow-scale', (0.55 + 0.45 * eased).toFixed(3));
      }
    }
  }

  // ---------- Mount Spread Pages & Apply Saved Puzzle Visuals ----------
  function mountSpreadSlot(slotName, chapterIdx, isInteractiveHost) {
    const ch = CHAPTERS[chapterIdx];
    if (!ch) return;

    if (slotName === 'staticLeft') {
      if (state.mountedStaticLeft === chapterIdx && dom.staticLeftPopups.dataset.host === String(isInteractiveHost)) return;
      state.mountedStaticLeft = chapterIdx;
      dom.staticLeftPopups.dataset.host = String(isInteractiveHost);
      dom.staticLeftSurface.innerHTML = ch.baseLeftSVG();
      buildPopupLayer(dom.staticLeftPopups, ch.leftPopups, isInteractiveHost);
    } else if (slotName === 'staticRight') {
      if (state.mountedStaticRight === chapterIdx && dom.staticRightPopups.dataset.host === String(isInteractiveHost)) return;
      state.mountedStaticRight = chapterIdx;
      dom.staticRightPopups.dataset.host = String(isInteractiveHost);
      dom.staticRightSurface.innerHTML = ch.baseRightSVG();
      buildPopupLayer(dom.staticRightPopups, ch.rightPopups, isInteractiveHost);
      restoreChapterVisuals(dom.staticRightPopups, chapterIdx);
      if (isInteractiveHost) bindChapterInteractions(dom.staticRightPopups, dom.staticLeftPopups, chapterIdx);
    } else if (slotName === 'leafFront') {
      if (state.mountedLeafFront === chapterIdx) return;
      state.mountedLeafFront = chapterIdx;
      dom.leafFrontSurface.innerHTML = ch.baseRightSVG();
      buildPopupLayer(dom.leafFrontPopups, ch.rightPopups, false);
      restoreChapterVisuals(dom.leafFrontPopups, chapterIdx);
    } else if (slotName === 'leafBack') {
      if (state.mountedLeafBack === chapterIdx) return;
      state.mountedLeafBack = chapterIdx;
      dom.leafBackSurface.innerHTML = ch.baseLeftSVG();
      buildPopupLayer(dom.leafBackPopups, ch.leftPopups, false);
    }
  }

  function restoreChapterVisuals(rightContainer, chapterIdx) {
    const isSolved = state.solved.has(chapterIdx);
    const standee = rightContainer.querySelector('.standee[data-kind]');
    if (!standee) return;
    if (isSolved) standee.classList.add('is-solved');

    if (chapterIdx === 0 && isSolved) {
      const gate = rightContainer.querySelector('.gate-root');
      if (gate) gate.classList.add('gate-lit');
    }
    if (chapterIdx === 1 && isSolved) {
      updateRibbonSVG(rightContainer, 1);
      const bridge = rightContainer.querySelector('.bridge-root');
      if (bridge) bridge.classList.add('bridge-solved');
      rightContainer.querySelectorAll('.bridge-plank').forEach(p => p.classList.add('is-placed'));
    }
    if (chapterIdx === 2) {
      const env = rightContainer.querySelector('[data-envelope-root]');
      if (env && (state.envelopeOpened || isSolved)) env.classList.add('envelope-open');
      if (env && isSolved) env.classList.add('route-touched');
    }
    if (chapterIdx === 3) {
      const sails = rightContainer.querySelector('.mill-sails-group');
      if (sails) sails.style.transform = `rotate(${state.millAngle}deg)`;
      const mill = rightContainer.querySelector('.mill-root');
      if (mill && isSolved) mill.classList.add('mill-printed');
    }
    if (chapterIdx === 4 && isSolved) {
      const lever = rightContainer.querySelector('.lighthouse-lever-arm');
      if (lever) lever.classList.add('is-lifted');
    }
  }

  // ---------- Helper to Celebrate Characters ----------
  function hopCharacters(leftLayer, rightLayer) {
    [leftLayer, rightLayer].forEach(layer => {
      if (!layer) return;
      layer.querySelectorAll('.pip-fox, .companion-char').forEach(el => {
        el.classList.remove('anim-hop');
        void el.offsetWidth;
        el.classList.add('anim-hop');
      });
    });
  }

  // ---------- Chapter-Specific Interactive Mechanics ----------
  function updateRibbonSVG(container, progress) {
    const line = container.querySelector('.ribbon-line');
    const handle = container.querySelector('.ribbon-handle');
    if (!line || !handle) return;
    const x = 112 + progress * (350 - 112);
    const sag = 128 - progress * 14;
    const y = 118 - progress * 6;
    const midX = (76 + x) / 2;
    line.setAttribute('d', `M 76 112 Q ${midX.toFixed(1)} ${sag.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`);
    handle.setAttribute('transform', `translate(${x.toFixed(1)}, ${y.toFixed(1)})`);
  }

  function completeChapter(idx, leftLayer, rightLayer) {
    const firstTime = !state.solved.has(idx);
    state.solved.add(idx);
    const standee = rightLayer.querySelector('.standee[data-kind]');
    if (standee) standee.classList.add('is-solved');
    if (firstTime) {
      hopCharacters(leftLayer, rightLayer);
      const spec = CHAPTERS[idx] && CHAPTERS[idx].walkSpec;
      if (spec && spec.pip) {
        if (spec.pip.solvedX != null) {
          state.pipBurstGoal = { x: spec.pip.solvedX, y: spec.pip.solvedY };
          state.pipPause = 0;
        } else if (spec.pip.solvedX2 != null) {
          // Chapter 2: Pip trots triumphantly across the repaired Ribbon Bridge!
          state.pipBurstGoal = { x: spec.pip.solvedX2, y: spec.pip.solvedY2 };
          state.pipPause = 0;
        }
      }
    }
    updateHUD(Math.round(state.bookPos), 0);
    renderProgressDots();
  }

  function bindChapterInteractions(rightLayer, leftLayer, chapterIdx) {
    // --- Chapter 0: The Lantern Gate (Brass Bell) ---
    if (chapterIdx === 0) {
      const bell = rightLayer.querySelector('[data-action="ring-bell"]');
      const gate = rightLayer.querySelector('.gate-root');
      if (!bell || !gate) return;

      bell.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        sound.bellChime();
        bell.classList.remove('is-ringing');
        gate.classList.remove('gate-lit');
        void bell.offsetWidth;
        bell.classList.add('is-ringing');
        gate.classList.add('gate-lit');
        completeChapter(0, leftLayer, rightLayer);
      });
    }

    // --- Chapter 1: The Ribbon Bridge (Drag Red Ribbon to Far Post) ---
    if (chapterIdx === 1) {
      const handle = rightLayer.querySelector('[data-action="drag-ribbon"]');
      const farPost = rightLayer.querySelector('[data-action="snap-ribbon-post"]');
      const bridge = rightLayer.querySelector('.bridge-root');
      if (!handle || !bridge) return;

      const solveBridge = () => {
        state.ribbonProgress = 1;
        updateRibbonSVG(rightLayer, 1);
        bridge.classList.add('bridge-solved');
        const planks = rightLayer.querySelectorAll('.bridge-plank');
        planks.forEach((p, idx) => {
          setTimeout(() => {
            p.classList.add('is-placed');
            sound.woodPlank(idx);
          }, idx * 95);
        });
        setTimeout(() => sound.successChord(), 480);
        completeChapter(1, leftLayer, rightLayer);
      };

      if (farPost) {
        farPost.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          if (!state.solved.has(1)) solveBridge();
        });
      }

      handle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (state.solved.has(1)) return;
        handle.classList.add('is-dragging');
        const startX = e.clientX;
        let moved = false;

        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          if (Math.abs(dx) > 6) moved = true;
          const p = Math.max(0, Math.min(1, dx / 210));
          state.ribbonProgress = p;
          updateRibbonSVG(rightLayer, p);

          // Preview planks as you pull across!
          const planks = rightLayer.querySelectorAll('.bridge-plank');
          planks.forEach((pl, i) => {
            const thresh = (i + 1) / (planks.length + 1);
            if (p >= thresh && !pl.classList.contains('is-placed')) {
              pl.classList.add('is-placed');
              sound.woodPlank(i);
            }
          });
        };

        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          handle.classList.remove('is-dragging');
          // Either dragged past 65% OR simple tap for easy accessibility
          if (!moved || state.ribbonProgress >= 0.62) {
            solveBridge();
          } else {
            state.ribbonProgress = 0;
            updateRibbonSVG(rightLayer, 0);
            rightLayer.querySelectorAll('.bridge-plank').forEach(p => p.classList.remove('is-placed'));
          }
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });
    }

    // --- Chapter 2: The Folded Library (Wax Envelope + [[Gull Point]]) ---
    if (chapterIdx === 2) {
      const envRoot = rightLayer.querySelector('[data-envelope-root]');
      const envBtn = rightLayer.querySelector('[data-action="open-envelope"]');
      const routeBtn = rightLayer.querySelector('[data-action="touch-gull-point"]');
      if (!envRoot || !envBtn || !routeBtn) return;

      envBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (!state.envelopeOpened) {
          state.envelopeOpened = true;
          envRoot.classList.add('envelope-open');
          sound.paperOpen();
          dom.chapterHint.textContent = 'The route note opens. Touch [[Gull Point]] inside.';
          dom.storyCopy.textContent = 'The route note opens. Touch [[Gull Point]] inside.';
        }
      });

      routeBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (state.solved.has(2)) {
          goToChapter(4);
          return;
        }
        envRoot.classList.add('route-touched');
        routeBtn.textContent = '[[Gull Point]] →';
        sound.successChord();
        completeChapter(2, leftLayer, rightLayer);
      });
    }

    // --- Chapter 3: The Signal Mill (Circular Windmill Sail Drag / Spin) ---
    if (chapterIdx === 3) {
      const sails = rightLayer.querySelector('[data-action="spin-mill"]');
      const mill = rightLayer.querySelector('.mill-root');
      if (!sails || !mill) return;

      let lastTickStep = 0;

      const applyAngle = (deltaDeg) => {
        state.millAngle += deltaDeg;
        state.millTotalTurned += Math.abs(deltaDeg);
        sails.style.transform = `rotate(${state.millAngle.toFixed(1)}deg)`;

        const step = Math.floor(state.millTotalTurned / 36);
        if (step > lastTickStep) {
          lastTickStep = step;
          sound.millTick();
        }
        if (state.millTotalTurned >= 340 && !state.solved.has(3)) {
          mill.classList.add('mill-printed');
          sound.successChord();
          completeChapter(3, leftLayer, rightLayer);
        }
      };

      sails.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        state.millDragging = true;
        sails.classList.add('is-dragging');
        const rect = sails.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let prevAng = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        let dragged = false;

        const onMove = (ev) => {
          const curAng = Math.atan2(ev.clientY - cy, ev.clientX - cx) * (180 / Math.PI);
          let diff = curAng - prevAng;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          if (Math.abs(diff) > 2) dragged = true;
          prevAng = curAng;
          applyAngle(diff);
        };

        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          state.millDragging = false;
          sails.classList.remove('is-dragging');
          // Gentle impulse spin on simple click/tap!
          if (!dragged) {
            let spun = 0;
            const spinStep = () => {
              const inc = 12;
              applyAngle(inc);
              spun += inc;
              if (spun < 180) requestAnimationFrame(spinStep);
            };
            requestAnimationFrame(spinStep);
          }
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });
    }

    // --- Chapter 4: The Last Light (Lighthouse Lever & Brass Lantern) ---
    if (chapterIdx === 4) {
      const lever = rightLayer.querySelector('[data-action="pull-lever"]');
      const orb = rightLayer.querySelector('[data-action="flash-lantern"]');
      const lh = rightLayer.querySelector('.lighthouse-root');
      if (!lever || !orb || !lh) return;

      let flashing = false;
      const runTwoFlashes = () => {
        if (flashing) return;
        flashing = true;
        lever.classList.add('is-lifted');
        state.beaconRuns += 1;

        const boat = leftLayer.querySelector('.boat-root');
        // Flash 1
        lh.classList.add('lighthouse-flashing');
        sound.beaconFlash(0);
        setTimeout(() => lh.classList.remove('lighthouse-flashing'), 340);

        // Flash 2
        setTimeout(() => {
          lh.classList.add('lighthouse-flashing');
          sound.beaconFlash(0);
        }, 560);
        setTimeout(() => lh.classList.remove('lighthouse-flashing'), 920);

        // Offshore Boats Answer!
        setTimeout(() => {
          if (boat) boat.classList.add('boat-answering');
          const smallBoat = rightLayer.querySelector('.boat-small');
          if (smallBoat) smallBoat.classList.add('boat-answering');
          sound.successChord();
          completeChapter(4, leftLayer, rightLayer);
          dom.storyCopy.textContent =
            state.beaconRuns > 1
              ? `Last run #${state.beaconRuns}: ✦ ✦. Touch the brass lantern to run it again.`
              : 'Last run: ✦ ✦. Touch the brass lantern to run it again.';
        }, 1080);

        setTimeout(() => {
          if (boat) boat.classList.remove('boat-answering');
          const smallBoat = rightLayer.querySelector('.boat-small');
          if (smallBoat) smallBoat.classList.remove('boat-answering');
          flashing = false;
        }, 2100);
      };

      lever.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        runTwoFlashes();
      });

      orb.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        runTwoFlashes();
      });
    }
  }

  // ---------- Core 3D Page-Turn Kinematics Renderer ----------
  function renderBookState(pos) {
    const clamped = Math.max(0, Math.min(MAX_POS, pos));
    const curr = Math.min(MAX_POS, Math.floor(clamped));
    const t = clamped - curr;
    const isAtRest = t < 0.002 || t > 0.998;
    const restIndex = Math.round(clamped);

    if (isAtRest) {
      // Resting squarely on a single open spread (all pop-ups fully upright & interactive!)
      dom.turningLeaf.style.visibility = 'hidden';
      dom.turningLeaf.style.transform = 'translateZ(2px) rotateY(0deg)';

      mountSpreadSlot('staticLeft', restIndex, true);
      mountSpreadSlot('staticRight', restIndex, true);

      applyFoldFactor(dom.staticLeftPopups, 1);
      applyFoldFactor(dom.staticRightPopups, 1);

      state.activeRestSpread = restIndex;
      dom.dragEdgeLeft.classList.toggle('is-disabled', restIndex === 0);
      dom.dragEdgeRight.classList.toggle('is-disabled', restIndex === MAX_POS);
      dom.chapterHeader.classList.remove('is-turning');
    } else {
      // Mid-turn between `curr` and `next`!
      const next = Math.min(MAX_POS, curr + 1);
      dom.turningLeaf.style.visibility = 'visible';
      dom.turningLeaf.style.transform = `translateZ(2px) rotateY(${(-t * 180).toFixed(2)}deg)`;

      // Static Left = Outgoing Left (curr)
      // Static Right = Incoming Right (next) revealed underneath
      // Turning Front = Outgoing Right (curr)
      // Turning Back = Incoming Left (next)
      mountSpreadSlot('staticLeft', curr, false);
      mountSpreadSlot('staticRight', next, false);
      mountSpreadSlot('leafFront', curr, false);
      mountSpreadSlot('leafBack', next, false);

      // Authentic Pop-Up Book Folding Kinematics:
      // Outgoing pop-ups fold smoothly flat as the leaf approaches vertical (t -> 0.52)
      const outLeftFold = Math.max(0, 1 - t / 0.56);
      const outRightFold = Math.max(0, 1 - t / 0.48);

      // Incoming pop-ups rise smoothly from flat to upright as the new spread opens!
      const inRightFold = Math.max(0, (t - 0.18) / 0.82);
      const inLeftFold = Math.max(0, (t - 0.52) / 0.48);

      applyFoldFactor(dom.staticLeftPopups, outLeftFold);
      applyFoldFactor(dom.leafFrontPopups, outRightFold);
      applyFoldFactor(dom.staticRightPopups, inRightFold);
      applyFoldFactor(dom.leafBackPopups, inLeftFold);

      // Dynamic Paper Lighting Shading on Turning Leaf
      dom.leafFrontShade.style.opacity = (Math.sin(t * Math.PI) * 0.55).toFixed(3);
      dom.leafBackShade.style.opacity = (Math.sin(t * Math.PI) * 0.48).toFixed(3);

      dom.chapterHeader.classList.add('is-turning');
    }

    // Update Dusk/Day Theme Backdrop based on proximity to Chapter 05
    const isDusk = clamped > 3.45;
    document.body.classList.toggle('theme-dusk', isDusk);

    updateHUD(Math.round(clamped), t);
  }

  // ---------- HUD & Hash Synchronization ----------
  let lastHudChapter = -1;
  function updateHUD(chIdx, turnFrac) {
    const ch = CHAPTERS[chIdx];
    const isSolved = state.solved.has(chIdx);

    if (chIdx !== lastHudChapter || turnFrac === 0) {
      lastHudChapter = chIdx;
      dom.chapterMeta.innerHTML = `CHAPTER ${ch.num} / 05 &nbsp;·&nbsp; ${ch.tag}`;
      dom.chapterTitle.textContent = ch.title;
      dom.chapterLocation.textContent = ch.location;
      dom.chapterHint.textContent = isSolved ? ch.solvedHint : ch.hint;

      if (chIdx === 4 && state.beaconRuns > 0) {
        dom.storyCopy.textContent =
          state.beaconRuns > 1
            ? `Last run #${state.beaconRuns}: ✦ ✦. Touch the brass lantern to run it again.`
            : ch.solvedStory;
      } else if (chIdx === 2 && state.envelopeOpened && !isSolved) {
        dom.storyCopy.textContent = 'The route note opens. Touch [[Gull Point]] inside.';
      } else {
        dom.storyCopy.textContent = isSolved ? ch.solvedStory : ch.story;
      }

      dom.storyBadge.textContent = isSolved ? '✦ SIGNAL COMPLETE' : '';
      dom.turnCounter.textContent = `${ch.num} / 05`;
      dom.btnPrev.disabled = chIdx === 0;
      dom.btnNext.disabled = chIdx === MAX_POS;

      // Update URL hash quietly
      const desiredHash = '#' + ch.id;
      if (window.location.hash !== desiredHash) {
        history.replaceState(null, '', desiredHash);
      }
      renderProgressDots();
    }

    if (turnFrac > 0.01 && turnFrac < 0.99) {
      const pct = Math.round(turnFrac * 100);
      dom.turnStatus.innerHTML = `PAGE TURN &nbsp;·&nbsp; ${pct}%`;
    } else {
      dom.turnStatus.innerHTML = state.autoRotate
        ? 'PAGE TURN &nbsp;·&nbsp; TABLE ROTATES'
        : 'PAGE TURN &nbsp;·&nbsp; VIEW LOCKED';
    }

    if (!state.isScrubbing) {
      dom.scrubber.value = Math.round(state.bookPos * 100);
    }
  }

  function renderProgressDots() {
    const current = Math.round(state.bookPos);
    dom.progressDots.innerHTML = CHAPTERS.map((c, idx) => {
      const cls = [
        'progress-dot',
        idx === current ? 'is-current' : '',
        state.solved.has(idx) ? 'is-done' : ''
      ].join(' ').trim();
      return `<button type="button" class="${cls}" data-dot-ch="${idx}" title="Chapter ${c.num}: ${c.title}"></button>`;
    }).join('');
  }

  // ---------- Smooth Navigation Helpers ----------
  function goToChapter(idx, playSound = true) {
    const clamped = Math.max(0, Math.min(MAX_POS, idx));
    if (Math.abs(clamped - state.targetPos) > 0.01 && playSound) {
      sound.pageRustle();
    }
    state.targetPos = clamped;
    hideToast();
  }

  function hideToast() {
    if (!state.toastHidden) {
      state.toastHidden = true;
      dom.gestureToast.classList.add('is-hidden');
    }
  }

  // ---------- Real-Time Living Character Walking & World Motion ----------
  function moveStandeeAndShadow(layer, standee, x, y) {
    standee.style.left = x.toFixed(1) + 'px';
    standee.style.top = y.toFixed(1) + 'px';
    const sh = layer.querySelector(`.standee-shadow[data-standee-id="${standee.dataset.standeeId}"]`);
    if (sh) {
      sh.style.left = x.toFixed(1) + 'px';
      sh.style.top = y.toFixed(1) + 'px';
    }
  }

  function updateLivingWorld(now, dt) {
    const tFrac = state.bookPos - Math.floor(state.bookPos);
    const isAtRest = tFrac < 0.004 || tFrac > 0.996;
    if (!isAtRest) return;

    const chIdx = Math.round(state.bookPos);
    const ch = CHAPTERS[chIdx];
    if (!ch || !ch.walkSpec) return;

    // Initialize actor positions cleanly whenever user arrives on a new spread
    if (state.actorSpread !== chIdx) {
      state.actorSpread = chIdx;
      state.pipX = ch.walkSpec.pip.x1 + (ch.walkSpec.pip.x2 - ch.walkSpec.pip.x1) * 0.55;
      state.pipY = ch.walkSpec.pip.y1 + (ch.walkSpec.pip.y2 - ch.walkSpec.pip.y1) * 0.55;
      state.pipDir = 1;
      state.pipPause = 0.25;
      state.pipBurstGoal = null;
      state.compX = (ch.walkSpec.companion.x1 + ch.walkSpec.companion.x2) * 0.5;
      state.compY = (ch.walkSpec.companion.y1 + ch.walkSpec.companion.y2) * 0.5;
      state.compDir = -1;
      state.compPause = 0.7;
    }

    const tSec = now * 0.001;

    // 1. PIP THE FOX: Articulated Strolling / Crossing Bridge / Investigating
    const pipStandee = dom.staticLeftPopups.querySelector('.standee[data-role="pip"]');
    if (pipStandee) {
      const pipSpec = ch.walkSpec.pip;
      const pipSvg = pipStandee.querySelector('.pip-fox');
      const useSolvedSpan = chIdx === 1 && state.solved.has(1) && pipSpec.solvedX2 != null;
      const minX = useSolvedSpan ? pipSpec.solvedX1 : pipSpec.x1;
      const maxX = useSolvedSpan ? pipSpec.solvedX2 : pipSpec.x2;
      const yAtMin = useSolvedSpan ? pipSpec.solvedY1 : pipSpec.y1;
      const yAtMax = useSolvedSpan ? pipSpec.solvedY2 : pipSpec.y2;

      let walking = false;

      if (state.pipBurstGoal) {
        const dx = state.pipBurstGoal.x - state.pipX;
        const dy = state.pipBurstGoal.y - state.pipY;
        const dist = Math.hypot(dx, dy);
        if (dist > 4) {
          const step = Math.min(dist, pipSpec.speed * 1.65 * dt);
          state.pipX += (dx / dist) * step;
          state.pipY += (dy / dist) * step;
          state.pipDir = dx >= 0 ? 1 : -1;
          walking = true;
        } else {
          state.pipBurstGoal = null;
          state.pipPause = 1.4;
        }
      } else if (state.pipPause > 0) {
        state.pipPause -= dt;
        walking = false;
      } else {
        const targetX = state.pipDir > 0 ? maxX : minX;
        const dx = targetX - state.pipX;
        if (Math.abs(dx) > 3) {
          const step = Math.min(Math.abs(dx), pipSpec.speed * dt);
          state.pipX += Math.sign(dx) * step;
          const u = Math.max(0, Math.min(1, (state.pipX - minX) / Math.max(1, maxX - minX)));
          state.pipY = yAtMin + (yAtMax - yAtMin) * u + Math.sin(u * Math.PI * 2) * 3.5;
          walking = true;
        } else {
          state.pipDir *= -1;
          state.pipPause = 0.9 + Math.random() * 1.1;
          walking = false;
        }
      }

      moveStandeeAndShadow(dom.staticLeftPopups, pipStandee, state.pipX, state.pipY);
      if (pipSvg) {
        pipSvg.classList.toggle('is-walking', walking);
        pipSvg.setAttribute('data-facing', state.pipDir >= 0 ? 'right' : 'left');
      }
    }

    // 2. COMPANION CHARACTER: Gentle Lively Patrol & Sway
    const compStandee = dom.staticRightPopups.querySelector('.standee[data-role="companion"]');
    if (compStandee) {
      const cSpec = ch.walkSpec.companion;
      if (state.compPause > 0) {
        state.compPause -= dt;
      } else {
        const targetX = state.compDir > 0 ? cSpec.x2 : cSpec.x1;
        const dx = targetX - state.compX;
        if (Math.abs(dx) > 2) {
          state.compX += Math.sign(dx) * Math.min(Math.abs(dx), cSpec.speed * dt);
          const u = (state.compX - cSpec.x1) / Math.max(1, cSpec.x2 - cSpec.x1);
          state.compY = cSpec.y1 + (cSpec.y2 - cSpec.y1) * u;
        } else {
          state.compDir *= -1;
          state.compPause = 1.4 + Math.random() * 1.2;
        }
      }
      moveStandeeAndShadow(dom.staticRightPopups, compStandee, state.compX, state.compY);
    }

    // 3. CHAPTER 4: Continuous Breeze Windmill Sail Rotation
    if (chIdx === 3 && !state.millDragging) {
      const sails = dom.staticRightPopups.querySelector('.mill-sails-group');
      if (sails) {
        const breezeSpeed = state.solved.has(3) ? 42 : 19;
        state.millAngle = (state.millAngle + breezeSpeed * dt) % 36000;
        sails.style.transform = `rotate(${state.millAngle.toFixed(1)}deg)`;
      }
    }

    // 4. CHAPTER 5: Soaring Seagulls & Gliding Offshore Sailboats
    if (chIdx === 4) {
      const boatMain = dom.staticLeftPopups.querySelector('.standee[data-role="boat-main"]');
      if (boatMain) {
        const bx = 178 + Math.sin(tSec * 0.55) * 44;
        const by = 360 + Math.cos(tSec * 0.9) * 11;
        moveStandeeAndShadow(dom.staticLeftPopups, boatMain, bx, by);
      }

      const boatSmall = dom.staticRightPopups.querySelector('.standee[data-role="boat-small"]');
      if (boatSmall) {
        const sx = 382 + Math.cos(tSec * 0.48) * 28;
        const sy = 342 + Math.sin(tSec * 0.85) * 9;
        moveStandeeAndShadow(dom.staticRightPopups, boatSmall, sx, sy);
      }

      const g1 = dom.staticLeftPopups.querySelector('.standee[data-role="gull-1"]');
      if (g1) {
        g1.style.left = (268 + Math.sin(tSec * 0.72) * 84).toFixed(1) + 'px';
        g1.style.top = (178 + Math.sin(tSec * 1.44) * 22).toFixed(1) + 'px';
      }
      const g2 = dom.staticLeftPopups.querySelector('.standee[data-role="gull-2"]');
      if (g2) {
        g2.style.left = (376 + Math.cos(tSec * 0.62 + 1.1) * 72).toFixed(1) + 'px';
        g2.style.top = (196 + Math.sin(tSec * 1.24 + 0.6) * 18).toFixed(1) + 'px';
      }
      const g3 = dom.staticRightPopups.querySelector('.standee[data-role="gull-3"]');
      if (g3) {
        g3.style.left = (118 + Math.sin(tSec * 0.66 + 2.2) * 68).toFixed(1) + 'px';
        g3.style.top = (182 + Math.cos(tSec * 1.32) * 20).toFixed(1) + 'px';
      }
    }
  }

  // ---------- Main Animation Loop (Spring Page Turn + Tabletop Orbit + Living World) ----------
  let lastTime = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    // Smoothly interpolate bookPos toward targetPos unless user is actively dragging/scrubbing
    if (!state.isScrubbing && !state.isTurningDrag) {
      const diff = state.targetPos - state.bookPos;
      if (Math.abs(diff) > 0.0008) {
        state.bookPos += diff * Math.min(1, dt * 8.5);
      } else {
        state.bookPos = state.targetPos;
      }
    }

    renderBookState(state.bookPos);
    updateLivingWorld(now, dt);

    // Smooth Tabletop 3D Camera Orbit + Subtle Gentle Idle Sway
    const swayZ = state.autoRotate && !state.isOrbitDragging ? Math.sin(now * 0.00055) * 3.8 : 0;
    const swayX = state.autoRotate && !state.isOrbitDragging ? Math.cos(now * 0.00042) * 1.4 : 0;

    state.camRotX += (state.targetRotX + swayX - state.camRotX) * Math.min(1, dt * 8);
    state.camRotZ += (state.targetRotZ + swayZ - state.camRotZ) * Math.min(1, dt * 8);
    state.camZoom += (state.targetZoom - state.camZoom) * Math.min(1, dt * 9);

    dom.bookRig.style.transform =
      `scale(${state.camZoom.toFixed(3)}) rotateX(${state.camRotX.toFixed(2)}deg) rotateZ(${state.camRotZ.toFixed(2)}deg)`;

    requestAnimationFrame(tick);
  }

  // ---------- Pointer Interactions: Desk Orbit + Direct Page Corner Drag ----------
  function bindStageControls() {
    // 1. Direct Page Corner Drag (Right Edge -> Next Page, Left Edge -> Prev Page)
    function startPageEdgeDrag(direction, e) {
      e.stopPropagation();
      const baseChapter = Math.round(state.bookPos);
      if (direction === 1 && baseChapter >= MAX_POS) return;
      if (direction === -1 && baseChapter <= 0) return;

      hideToast();
      state.isTurningDrag = true;
      const startX = e.clientX;
      let moved = false;

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        if (Math.abs(dx) > 8) moved = true;
        // Dragging left turns forward (+1), dragging right turns backward (-1)
        const deltaPos = -dx / 380;
        const nextPos = Math.max(
          Math.max(0, baseChapter - (direction === -1 ? 1 : 0)),
          Math.min(Math.min(MAX_POS, baseChapter + (direction === 1 ? 1 : 0)), baseChapter + deltaPos)
        );
        state.bookPos = nextPos;
        state.targetPos = nextPos;
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        state.isTurningDrag = false;

        if (!moved) {
          goToChapter(baseChapter + direction);
        } else {
          // Snap to nearest chapter cleanly
          const snapped = Math.round(state.bookPos);
          goToChapter(snapped, snapped !== baseChapter);
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    }

    dom.dragEdgeRight.addEventListener('pointerdown', (e) => startPageEdgeDrag(1, e));
    dom.dragEdgeLeft.addEventListener('pointerdown', (e) => startPageEdgeDrag(-1, e));

    // 2. Desk Tabletop Orbit Rotation
    dom.stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.is-interactive, .page-drag-edge, button')) return;
      hideToast();
      state.isOrbitDragging = true;
      dom.stage.classList.add('is-dragging');
      let lastX = e.clientX;
      let lastY = e.clientY;

      const onMove = (ev) => {
        const dx = ev.clientX - lastX;
        const dy = ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        state.targetRotZ = Math.max(-42, Math.min(42, state.targetRotZ - dx * 0.22));
        state.targetRotX = Math.max(24, Math.min(72, state.targetRotX - dy * 0.22));
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        state.isOrbitDragging = false;
        dom.stage.classList.remove('is-dragging');
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    // 3. Smooth Wheel Zoom
    dom.stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.06;
      state.targetZoom = Math.max(0.76, Math.min(1.28, state.targetZoom + delta));
    }, { passive: false });
  }

  // ---------- HUD Buttons, Modals & Keyboard Controls ----------
  function bindHUDControls() {
    dom.btnPrev.addEventListener('click', () => goToChapter(Math.round(state.targetPos) - 1));
    dom.btnNext.addEventListener('click', () => goToChapter(Math.round(state.targetPos) + 1));
    dom.brandHome.addEventListener('click', (e) => { e.preventDefault(); goToChapter(0); });

    dom.scrubber.addEventListener('pointerdown', () => { state.isScrubbing = true; hideToast(); });
    dom.scrubber.addEventListener('input', () => {
      state.isScrubbing = true;
      state.bookPos = parseFloat(dom.scrubber.value) / 100;
      state.targetPos = state.bookPos;
    });
    const finishScrub = () => {
      if (!state.isScrubbing) return;
      state.isScrubbing = false;
      const snapped = Math.round(state.bookPos);
      goToChapter(snapped);
    };
    dom.scrubber.addEventListener('change', finishScrub);
    dom.scrubber.addEventListener('pointerup', finishScrub);

    dom.progressDots.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dot-ch]');
      if (btn) goToChapter(parseInt(btn.dataset.dotCh, 10));
    });

    dom.btnResetView.addEventListener('click', () => {
      state.targetRotX = 54;
      state.targetRotZ = -3;
      state.targetZoom = 1;
    });

    dom.btnAutoRotate.addEventListener('click', () => {
      state.autoRotate = !state.autoRotate;
      dom.btnAutoRotate.setAttribute('aria-pressed', String(state.autoRotate));
      updateHUD(Math.round(state.bookPos), 0);
    });

    dom.btnSound.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      dom.btnSound.setAttribute('aria-pressed', String(state.soundEnabled));
      if (state.soundEnabled) sound.tone(587, 0.16, 'sine', 0.06);
    });

    // Map Modal
    dom.btnMap.addEventListener('click', () => {
      const curr = Math.round(state.bookPos);
      dom.mapSvgContainer.innerHTML = window.renderAtlasMapSVG(state.solved, curr);
      dom.mapProgressLabel.textContent = `${state.solved.size} / 5 signals completed`;
      dom.mapModal.hidden = false;
    });

    dom.mapSvgContainer.addEventListener('click', (e) => {
      const pin = e.target.closest('[data-jump-chapter]');
      if (!pin) return;
      const idx = parseInt(pin.dataset.jumpChapter, 10);
      dom.mapModal.hidden = true;
      goToChapter(idx);
    });

    // Read This Page Modal
    dom.btnReadPage.addEventListener('click', () => {
      const ch = CHAPTERS[Math.round(state.bookPos)];
      dom.readerKicker.innerHTML = `${ch.plate} &nbsp;·&nbsp; ${ch.location.toUpperCase()}`;
      dom.readerModalTitle.textContent = ch.title;
      dom.readerBody.innerHTML = ch.prose.map(p => `<p>${p}</p>`).join('');
      dom.readerClue.textContent = ch.clue;
      dom.readerModal.hidden = false;
    });

    // Modal Close Triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.closeModal).hidden = true;
      });
    });

    [dom.mapModal, dom.readerModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.hidden = true;
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dom.mapModal.hidden = true;
        dom.readerModal.hidden = true;
      } else if (e.key === 'ArrowRight') {
        goToChapter(Math.round(state.targetPos) + 1);
      } else if (e.key === 'ArrowLeft') {
        goToChapter(Math.round(state.targetPos) - 1);
      } else if (e.key === 'm' || e.key === 'M') {
        dom.btnMap.click();
      }
    });
  }

  // ---------- Initial Boot ----------
  function init() {
    updateBookScale();
    window.addEventListener('resize', updateBookScale);

    // Respect initial URL hash (#gate, #bridge, #library, #mill, #beacon)
    const hashId = window.location.hash.replace('#', '');
    const initialIdx = CHAPTERS.findIndex(c => c.id === hashId);
    if (initialIdx >= 0) {
      state.bookPos = initialIdx;
      state.targetPos = initialIdx;
    }

    renderProgressDots();
    bindStageControls();
    bindHUDControls();
    renderBookState(state.bookPos);
    requestAnimationFrame(tick);
  }

  init();
})();
