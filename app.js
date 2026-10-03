/**
 * YuTa — AERO OS [PEAK FRUTIGER AERO ENGINE]
 * Interactive Water Ripples, Vista Gadgets, Ambient Synth, Fish Pet & Aero Audio
 */

// ==================== AUDIO SYNTHESIZER ====================
let audioCtx = null;
let isAudioMuted = false;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function toggleSoundFx() {
  isAudioMuted = !isAudioMuted;
  const btn = document.getElementById('btnSoundToggle');
  if (btn) btn.textContent = isAudioMuted ? '🔇' : '🔊';
  showToast(isAudioMuted ? 'Sound FX: Muted' : 'Sound FX: Enabled');
}

function playSound(type = 'bubble') {
  if (isAudioMuted) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'bubble') {
      // Natural bubbly water drop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(1150 + Math.random() * 120, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'splash') {
      // Water splash tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.22);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (type === 'chime' || type === 'xp') {
      // Classic Vista / XP chord
      const chords = [523.25, 659.25, 783.99, 1046.5];
      chords.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.12, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.62);
      });
    } else if (type === 'check') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'delete') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'purr') {
      // Realistic cat purring with amplitude modulation (AM) at 24Hz
      const purrOsc = ctx.createOscillator();
      const amGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      purrOsc.type = 'triangle';
      purrOsc.frequency.setValueAtTime(68, now);
      purrOsc.frequency.linearRampToValueAtTime(75, now + 0.25);
      purrOsc.frequency.linearRampToValueAtTime(65, now + 0.5);

      lfo.frequency.setValueAtTime(24, now); // Purr pulse rate
      lfoGain.gain.setValueAtTime(0.5, now);
      lfo.connect(amGain.gain);

      purrOsc.connect(amGain);
      amGain.connect(gain);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      purrOsc.start(now);
      lfo.start(now);
      purrOsc.stop(now + 0.56);
      lfo.stop(now + 0.56);
    } else if (type === 'meow' || type === 'meow_cute') {
      // Expressive multi-formant kitten meow: "Mee-oooww~"
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g1 = ctx.createGain();
      const g2 = ctx.createGain();

      o1.type = 'sine';
      o2.type = 'triangle';

      // Pitch glide: 480Hz -> 820Hz peak -> 540Hz
      o1.frequency.setValueAtTime(460, now);
      o1.frequency.exponentialRampToValueAtTime(840, now + 0.09);
      o1.frequency.exponentialRampToValueAtTime(560, now + 0.32);

      o2.frequency.setValueAtTime(920, now);
      o2.frequency.exponentialRampToValueAtTime(1680, now + 0.09);
      o2.frequency.exponentialRampToValueAtTime(1120, now + 0.32);

      g1.gain.setValueAtTime(0.01, now);
      g1.gain.linearRampToValueAtTime(0.22, now + 0.06);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      g2.gain.setValueAtTime(0.01, now);
      g2.gain.linearRampToValueAtTime(0.12, now + 0.06);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      o1.connect(g1);
      o2.connect(g2);
      g1.connect(gain);
      g2.connect(gain);

      o1.start(now);
      o2.start(now);
      o1.stop(now + 0.36);
      o2.stop(now + 0.36);
    } else if (type === 'meow_playful' || type === 'mrrp') {
      // Playful cat trill / chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(1050, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.16);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (type === 'crunch') {
      // 3 rapid snack crunches
      [0, 0.06, 0.12].forEach((offset, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(gain);
        o.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
        o.frequency.setValueAtTime(520 - idx * 60, now + offset);
        o.frequency.exponentialRampToValueAtTime(120, now + offset + 0.04);
        g.gain.setValueAtTime(0.18, now + offset);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);
        o.start(now + offset);
        o.stop(now + offset + 0.06);
      });
    } else if (type === 'snore') {
      // Cute sleeping cat breathing
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(420, now + 0.25);
      osc.frequency.linearRampToValueAtTime(280, now + 0.5);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.56);
    } else if (type === 'hiss') {
      // Cat hiss: Filtered white noise burst (KHSHSHSH!)
      const bufferSize = Math.floor(ctx.sampleRate * 0.4);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.18));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4200, now);
      filter.Q.setValueAtTime(3.5, now);

      noise.connect(filter);
      filter.connect(gain);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      noise.start(now);
    } else if (type === 'growl' || type === 'angry_meow') {
      // Fierce cat angry growl / yowl
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(260, now);
      o.frequency.linearRampToValueAtTime(180, now + 0.15);
      o.frequency.linearRampToValueAtTime(320, now + 0.35);
      o.frequency.exponentialRampToValueAtTime(110, now + 0.55);

      g.gain.setValueAtTime(0.01, now);
      g.gain.linearRampToValueAtTime(0.25, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      o.connect(g);
      g.connect(gain);
      o.start(now);
      o.stop(now + 0.56);
    }
  } catch (e) {}
}

// Ambient Background Music Generator (Lo-fi Aero Pad)
let ambientTimer = null;
let isMusicPlaying = false;
let currentTrackIndex = 0;
const TRACK_NAMES = [
  'Cozy Afternoon with You',
  'Stargazing & Low-fi Waves',
  'Warm Rain on the Window',
  'Sunlight & Liquid Crystal'
];

function togglePlayMusic() {
  const btn = document.getElementById('btnPlayPause');
  const widget = document.getElementById('mediaPlayerWidget');
  const miniDisc = document.getElementById('playerMiniDisc');

  if (isMusicPlaying) {
    isMusicPlaying = false;
    if (ambientTimer) clearInterval(ambientTimer);
    if (btn) btn.textContent = '▶';
    if (widget) widget.classList.remove('playing');
    if (miniDisc) miniDisc.style.animation = 'none';
    showToast('Playback paused');
  } else {
    isMusicPlaying = true;
    if (btn) btn.textContent = '⏸';
    if (widget) widget.classList.add('playing');
    if (miniDisc) miniDisc.style.animation = 'rotateCD 4s linear infinite';
    startAmbientSynth();
    showToast(`Playing: ${TRACK_NAMES[currentTrackIndex]}`);
  }
}

function switchAmbientSound() {
  currentTrackIndex = (currentTrackIndex + 1) % TRACK_NAMES.length;
  document.getElementById('nowPlayingTitle').textContent = TRACK_NAMES[currentTrackIndex];
  playSound('chime');
  if (isMusicPlaying) {
    if (ambientTimer) clearInterval(ambientTimer);
    startAmbientSynth();
  }
  showToast(`Track: ${TRACK_NAMES[currentTrackIndex]}`);
}

function startAmbientSynth() {
  const ambientChords = [
    [261.63, 329.63, 392.00], // C major
    [220.00, 261.63, 329.63], // A minor
    [349.23, 440.00, 523.25], // F major
    [392.00, 493.88, 587.33]  // G major
  ];

  // Upbeat Aqua Blue Sky Arpeggio
  const popOffRiffs = [
    [523.25, 659.25, 783.99, 1046.50],
    [587.33, 698.46, 880.00, 1174.66],
    [659.25, 783.99, 987.77, 1318.51],
    [523.25, 783.99, 1046.50, 1567.98]
  ];

  let loopIdx = 0;

  function playSynthStep() {
    if (!isMusicPlaying) return;
    try {
      const ctx = getAudioContext();
      const volInput = document.getElementById('playerVolume');
      const volumeLevel = volInput ? (volInput.value / 100) * 0.12 : 0.08;

      if (currentTrackIndex === 0) {
        // Sparkling Aqua Crystal Arpeggio
        const riff = popOffRiffs[loopIdx % popOffRiffs.length];
        loopIdx++;
        riff.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = i % 2 === 0 ? 'triangle' : 'sine';
          const t = ctx.currentTime + i * 0.16;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(volumeLevel * 1.2, t + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
          osc.start(t);
          osc.stop(t + 0.36);
        });
      } else {
        // Lush Ambient Pad Chords
        const chord = ambientChords[loopIdx % ambientChords.length];
        loopIdx++;
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(volumeLevel, ctx.currentTime + 0.6);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.6);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 2.7);
        });
      }
    } catch (e) {}
  }

  playSynthStep();
  const intervalTime = currentTrackIndex === 0 ? 1200 : 2800;
  ambientTimer = setInterval(playSynthStep, intervalTime);
}

// ==================== INTERACTIVE WATER RIPPLES SIMULATION ====================
let rippleCanvas, rippleCtx;
const ripples = [];

function initWaterRipples() {
  rippleCanvas = document.getElementById('waterRippleCanvas');
  if (!rippleCanvas) return;
  rippleCtx = rippleCanvas.getContext('2d');

  function resize() {
    rippleCanvas.width = window.innerWidth;
    rippleCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Trigger ripple anywhere clicked
  window.addEventListener('click', (e) => {
    // Exclude clicking on text inputs or select buttons
    if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) return;
    addRipple(e.clientX, e.clientY);
  });

  // Animation frame loop
  function animateRipples() {
    rippleCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += r.speed;
      r.alpha -= 0.015;

      if (r.alpha <= 0) {
        ripples.splice(i, 1);
        continue;
      }

      // Outer wave ring
      rippleCtx.beginPath();
      rippleCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      rippleCtx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.8})`;
      rippleCtx.lineWidth = 2.5;
      rippleCtx.stroke();

      // Cyan specular refraction ring
      rippleCtx.beginPath();
      rippleCtx.arc(r.x, r.y, Math.max(0, r.radius - 8), 0, Math.PI * 2);
      rippleCtx.strokeStyle = `rgba(56, 189, 248, ${r.alpha * 0.45})`;
      rippleCtx.lineWidth = 1.5;
      rippleCtx.stroke();
    }

    requestAnimationFrame(animateRipples);
  }

  animateRipples();
}

function addRipple(x, y) {
  ripples.push({
    x,
    y,
    radius: 4,
    speed: 3.5,
    alpha: 0.65
  });
}

// ==================== LUMINOUS CURSOR TRACKING ====================
function initCursorGlow() {
  const glow = document.getElementById('cursorAeroGlow');
  if (!glow) return;

  let lastX = 0, lastY = 0;

  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

    // Spawn subtle bubble if moved fast
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist > 45 && Math.random() < 0.18) {
      spawnMiniBubbleAt(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });
}

function spawnMiniBubbleAt(x, y) {
  const container = document.getElementById('bubblesContainer');
  if (!container) return;

  const b = document.createElement('div');
  b.className = 'bubble';
  const size = Math.floor(Math.random() * 18) + 12;
  b.style.width = `${size}px`;
  b.style.height = `${size}px`;
  b.style.left = `${x - size / 2}px`;
  b.style.top = `${y - size / 2}px`;
  b.style.animationDuration = '4s';

  b.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('bubble');
    spawnBubbleBurstAt(x, y);
    b.remove();
  });

  container.appendChild(b);
  setTimeout(() => {
    if (b.parentNode) b.remove();
  }, 4000);
}

// ==================== BUBBLE PARTICLE BURST ====================
function spawnBubbleBurst(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  spawnBubbleBurstAt(x, y);
  playSound('splash');
  addRipple(x, y);
}

function spawnBubbleBurstAt(x, y) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
    const dist = Math.random() * 40 + 25;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    const droplet = document.createElement('div');
    droplet.className = 'bubble-droplet';
    droplet.style.left = `${x}px`;
    droplet.style.top = `${y}px`;
    droplet.style.setProperty('--dx', `${dx}px`);
    droplet.style.setProperty('--dy', `${dy}px`);

    document.body.appendChild(droplet);
    setTimeout(() => droplet.remove(), 360);
  }
}

// ==================== 3D CARD TILT EFFECT ====================
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card, .aero-window');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  });
}

// ==================== VISTA GADGETS: CLOCK & HYDRATION ====================
function initVistaGadgets() {
  // 1. Analog Glass Clock
  const hourHand = document.getElementById('hourHand');
  const minHand = document.getElementById('minHand');
  const secHand = document.getElementById('secHand');
  const digitalTime = document.getElementById('gadgetDigitalTime');

  function updateClock() {
    const now = new Date();
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();

    const secDeg = (sec / 60) * 360;
    const minDeg = ((min + sec / 60) / 60) * 360;
    const hrDeg = (((hr % 12) + min / 60) / 12) * 360;

    if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
    if (minHand) minHand.style.transform = `rotate(${minDeg}deg)`;
    if (hourHand) hourHand.style.transform = `rotate(${hrDeg}deg)`;

    if (digitalTime) {
      const h = String(hr).padStart(2, '0');
      const m = String(min).padStart(2, '0');
      const s = String(sec).padStart(2, '0');
      digitalTime.textContent = `${h}:${m}:${s}`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  // 2. Hydration Meter
  loadWaterLevel();
}

let currentWaterML = 1250;
const MAX_WATER_ML = 2000;

function loadWaterLevel() {
  const saved = localStorage.getItem('aero_hydration_ml');
  if (saved !== null) {
    currentWaterML = parseInt(saved, 10) || 1250;
  }
  updateWaterDisplay();
}

function addWater(amount = 250) {
  currentWaterML = Math.min(MAX_WATER_ML, currentWaterML + amount);
  localStorage.setItem('aero_hydration_ml', currentWaterML);
  playSound('splash');
  updateWaterDisplay();
  showToast(`Hydration +${amount}ml logged`);
}

function resetWater() {
  currentWaterML = 0;
  localStorage.setItem('aero_hydration_ml', currentWaterML);
  playSound('delete');
  updateWaterDisplay();
  showToast('Hydration counter reset.');
}

function updateWaterDisplay() {
  const fill = document.getElementById('hydroWaterFill');
  const txt = document.getElementById('hydroLevelTxt');
  const pct = Math.min(100, Math.round((currentWaterML / MAX_WATER_ML) * 100));

  if (fill) fill.style.height = `${pct}%`;
  if (txt) txt.textContent = `${currentWaterML.toLocaleString()} / ${MAX_WATER_ML.toLocaleString()} ml`;
}

// ==================== INTERACTIVE GOLDFISH PET ====================
let fishTargetX = 20;
let fishTargetY = 30;
let fishHappiness = 0;

function initFishPet() {
  const fish = document.getElementById('goldfish1');
  const container = document.getElementById('fishContainer');
  if (!fish) return;

  fish.addEventListener('click', (e) => {
    e.stopPropagation();
    playSound('splash');
    fishHappiness += 2;
    showToast(`Blub blub! Goldfish Happiness: Level ${fishHappiness}`);
    spawnBubbleBurst(e);
    fish.style.transform = 'scale(1.35) rotate(25deg)';
    setTimeout(() => { fish.style.transform = ''; }, 450);
  });

  if (container) {
    container.addEventListener('click', (e) => {
      feedFishAt(e.clientX, e.clientY);
    });
  }

  // Random peaceful swimming every 7.5 seconds
  setInterval(() => {
    fishTargetX = Math.floor(Math.random() * 70) + 10;
    fishTargetY = Math.floor(Math.random() * 60) + 15;
    fish.style.left = `${fishTargetX}%`;
    fish.style.top = `${fishTargetY}%`;
    fish.style.transform = fishTargetX > 50 ? 'scaleX(-1)' : 'scaleX(1)';
  }, 7500);
}

function feedFishAt(clientX, clientY) {
  const crumb = document.getElementById('fishCrumb');
  const fish = document.getElementById('goldfish1');
  if (!crumb || !fish) return;

  const pctX = Math.max(5, Math.min(90, (clientX / window.innerWidth) * 100));
  const pctY = Math.max(5, Math.min(85, (clientY / window.innerHeight) * 100));

  crumb.style.left = `${pctX}%`;
  crumb.style.top = `${pctY}%`;
  crumb.style.display = 'block';

  playSound('bubble');
  if (typeof addRipple === 'function') addRipple(clientX, clientY);
  showToast('Dropped breadcrumb for the goldfish.');

  // Fish smoothly turns & swims to crumb
  const curX = parseFloat(fish.style.left) || 20;
  fish.style.transform = pctX > curX ? 'scaleX(-1)' : 'scaleX(1)';
  fish.style.left = `${pctX}%`;
  fish.style.top = `${pctY}%`;

  setTimeout(() => {
    crumb.style.display = 'none';
    playSound('splash');
    fishHappiness++;
    showToast(`Nom nom! Goldfish Happiness: Level ${fishHappiness}`);
    
    // Spawn floating heart particle
    const heart = document.createElement('div');
    heart.className = 'fish-heart-pop';
    heart.textContent = '❤️';
    heart.style.left = `${pctX}%`;
    heart.style.top = `${pctY}%`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);

    spawnBubbleBurstAt(clientX, clientY);
  }, 1600);
}

function feedFishAtCenter() {
  feedFishAt(window.innerWidth * 0.5, window.innerHeight * 0.4);
}

// ==================== STORAGE SYSTEM ====================
const STORAGE_KEYS = {
  TODOS: 'aero_retro_todos_en_v3',
  REMINDERS: 'aero_retro_reminders_en_v3',
  NOTES: 'aero_retro_notes_en_v3',
  COUNTDOWNS: 'aero_retro_countdowns_en_v3',
  MOODS: 'aero_retro_moods_en_v3',
  CATS: 'aero_virtual_cats_v1'
};

function getStorage(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

let isRemoteSyncing = false;

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}

  // Push to Cloud Realtime Database if connected and not handling an incoming remote update
  if (!isRemoteSyncing && typeof pushKeyToCloud === 'function') {
    pushKeyToCloud(key, value);
  }
}

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==================== BUBBLES GENERATOR ====================
function initBubbles() {
  const container = document.getElementById('bubblesContainer');
  if (!container) return;

  function spawnBubble() {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.floor(Math.random() * 45) + 20;
    const left = Math.random() * 100;
    const dur = Math.random() * 8 + 8;

    b.style.width = `${size}px`;
    b.style.height = `${size}px`;
    b.style.left = `${left}%`;
    b.style.animationDuration = `${dur}s`;

    b.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('bubble');
      const rect = b.getBoundingClientRect();
      spawnBubbleBurstAt(rect.left + size / 2, rect.top + size / 2);
      b.remove();
    });

    container.appendChild(b);
    setTimeout(() => {
      if (b.parentNode) b.remove();
    }, dur * 1000);
  }

  for (let i = 0; i < 15; i++) spawnBubble();
  setInterval(spawnBubble, 1500);
}

// ==================== STICKERS INTERACTION & DRAG ====================
function initStickers() {
  const stickers = [
    { id: 'stickerStar', sound: 'chime', toast: '⭐ Super Star boost activated!', action: (el) => {
      el.style.transform = 'scale(1.4) rotate(360deg)';
      setTimeout(() => { el.style.transform = ''; }, 600);
    }},
    { id: 'stickerClover', sound: 'check', toast: '🍀 +100 Luck granted today.' },
    { id: 'stickerCd', sound: 'bubble', action: () => toggleMediaPlayer() },
    { id: 'stickerXp', sound: 'xp', toast: '🫧 Windows XP Aero Edition — Online.' }
  ];

  stickers.forEach(cfg => {
    const el = document.getElementById(cfg.id);
    if (!el) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let origLeft = 0, origTop = 0;
    let hasMoved = false;

    el.addEventListener('pointerdown', (e) => {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      origLeft = rect.left;
      origTop = rect.top;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
    });

    el.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 5) {
        hasMoved = true;
        el.style.position = 'fixed';
        el.style.left = `${origLeft + dx}px`;
        el.style.top = `${origTop + dy}px`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      }
    });

    const endDrag = (e) => {
      if (!isDragging) return;
      isDragging = false;
      el.classList.remove('dragging');
      if (el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      if (!hasMoved) {
        if (cfg.sound) playSound(cfg.sound);
        spawnBubbleBurst(e);
        if (cfg.toast) showToast(cfg.toast);
        if (cfg.action) cfg.action(el);
      } else {
        playSound('bubble');
      }
    };

    el.addEventListener('pointerup', endDrag);
    el.addEventListener('pointercancel', endDrag);
  });
}

// ==================== CLOCKS ====================
function initClocks() {
  const menubarClock = document.getElementById('menubarClock');
  const taskbarClock = document.getElementById('taskbarClock');

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (menubarClock) menubarClock.textContent = `${h}:${m}:${s}`;
    if (taskbarClock) taskbarClock.textContent = `${h}:${m}`;
  }

  update();
  setInterval(update, 1000);
}

// ==================== TABS & WINDOW CONTROLS ====================
function switchTab(tabId) {
  playSound('bubble');
  const win = document.querySelector('.aero-window');
  if (win && (win.classList.contains('window-minimized') || win.classList.contains('window-closed'))) {
    restoreAppWindow();
  }

  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  const chips = document.querySelectorAll('.taskbar-chip');

  buttons.forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
  });

  panels.forEach(p => {
    p.classList.toggle('active', p.id === `panel-${tabId}`);
  });

  chips.forEach(c => {
    const text = c.textContent.toLowerCase();
    c.classList.toggle('active', text.includes(tabId));
  });

  if (tabId === 'countdown' && typeof renderCountdowns === 'function') {
    renderCountdowns();
  } else if (tabId === 'reminders' && typeof renderReminders === 'function') {
    renderReminders();
  }
}

function minimizeWindow() {
  const win = document.querySelector('.aero-window');
  if (!win) return;
  playSound('delete');
  const isMin = win.classList.contains('window-minimized');
  if (isMin) {
    restoreAppWindow();
  } else {
    win.classList.add('window-minimized');
    const restoreBtn = document.getElementById('taskbarRestoreBtn');
    if (restoreBtn) restoreBtn.classList.add('visible');
    showToast('Window minimized — click taskbar chip to restore.');
  }
}

function maximizeWindow() {
  const win = document.querySelector('.aero-window');
  if (!win) return;
  playSound('bubble');
  const isMax = win.classList.toggle('window-maximized');
  if (isMax) {
    win.style.transform = '';
    showToast('Jendela Layar Penuh (Maximized) 🖥️');
  } else {
    showToast('Jendela dikembalikan ke normal ✨');
  }
}

function closeAppWindow() {
  const win = document.querySelector('.aero-window');
  if (!win) return;
  playSound('delete');
  win.classList.add('window-closed');
  const restoreBtn = document.getElementById('taskbarRestoreBtn');
  if (restoreBtn) restoreBtn.classList.add('visible');
  showToast('Window closed — click YuTa OS on taskbar to reopen.');
}

function restoreAppWindow() {
  const win = document.querySelector('.aero-window');
  if (!win) return;
  playSound('bubble');
  win.classList.remove('window-closed', 'window-minimized');
  win.style.opacity = '';
  const restoreBtn = document.getElementById('taskbarRestoreBtn');
  if (restoreBtn) restoreBtn.classList.remove('visible');
  showToast('Welcome back to YuTa OS ✨');
}

function restoreAndSwitchTab(tabId) {
  restoreAppWindow();
  switchTab(tabId);
}

function initWindowDragAndControls() {
  const bar = document.getElementById('windowTitlebar');
  const win = document.getElementById('mainAeroWindow');
  if (!bar || !win) return;

  // Double-click titlebar → maximize
  bar.addEventListener('dblclick', (e) => {
    if (e.target.closest('.win-btn') || e.target.closest('.titlebar-controls')) return;
    maximizeWindow();
  });

  // ── PURE GPU TRANSFORM DRAG (NO WIDTH LOCKING, NO JITTER) ──
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let curX = 0;
  let curY = 0;
  let hasMoved = false;

  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.win-btn') || e.target.closest('.titlebar-controls')) return;
    if (win.classList.contains('window-maximized')) return;

    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;

    const style = window.getComputedStyle(win);
    const matrix = new WebKitCSSMatrix(style.transform);
    curX = matrix.m41 || 0;
    curY = matrix.m42 || 0;

    try {
      bar.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  bar.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!hasMoved && Math.hypot(dx, dy) < 5) return; // filter subtle clicks

    if (!hasMoved) {
      hasMoved = true;
      win.classList.add('is-dragging');
      win.style.zIndex = '500';
    }

    const nextX = curX + dx;
    const nextY = curY + dy;
    win.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    win.classList.remove('is-dragging');
    try {
      if (bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  bar.addEventListener('pointerup', stopDrag);
  bar.addEventListener('pointercancel', stopDrag);
}

// Global exposures
window.switchTab = switchTab;
window.minimizeWindow = minimizeWindow;
window.maximizeWindow = maximizeWindow;
window.closeAppWindow = closeAppWindow;
window.restoreAppWindow = restoreAppWindow;
window.restoreAndSwitchTab = restoreAndSwitchTab;

// ==================== WALLPAPER & CRT TOGGLES ====================
function toggleWallpaper() {
  playSound('bubble');
  const body = document.body;
  if (body.classList.contains('wallpaper-aero')) {
    body.classList.remove('wallpaper-aero');
    body.classList.add('wallpaper-bliss');
    showToast('Wallpaper: Classic Bliss Green Hills');
  } else if (body.classList.contains('wallpaper-bliss')) {
    body.classList.remove('wallpaper-bliss');
    body.classList.add('wallpaper-dolphins');
    showToast('Wallpaper: Crystal River & Dolphins');
  } else {
    body.classList.remove('wallpaper-dolphins');
    body.classList.add('wallpaper-aero');
    showToast('Wallpaper: Frutiger Aero Cyber World');
  }
}

function toggleCRT() {
  playSound('bubble');
  document.body.classList.toggle('crt-active');
  const active = document.body.classList.contains('crt-active');
  const badge = document.getElementById('crtStatusBadge');
  if (badge) {
    badge.textContent = active ? 'ON' : 'OFF';
    badge.classList.toggle('active', active);
  }
  const btn = document.getElementById('crtGadgetBtn');
  if (btn) {
    btn.classList.toggle('active', active);
  }
  showToast(active ? 'Retro CRT filter: ON' : 'Retro CRT filter: OFF');
}

function toggleMediaPlayer() {
  const widget = document.getElementById('mediaPlayerWidget');
  if (widget) {
    if (widget.classList.contains('closed')) {
      playSound('bubble');
      widget.classList.remove('closed');
      widget.classList.remove('minimized');
      showToast('Media Player opened 💿');
    } else {
      playSound('delete');
      widget.classList.add('closed');
      showToast('Media Player closed');
    }
  }
}

function closeMediaPlayer() {
  playSound('delete');
  const widget = document.getElementById('mediaPlayerWidget');
  if (widget) widget.classList.add('closed');
}

function toggleStartMenu() {
  playSound('bubble');
  const menu = document.getElementById('xpStartMenu');
  if (menu) menu.classList.toggle('open');
}

window.addEventListener('click', (e) => {
  if (!e.target.closest('.start-btn-wrap')) {
    const menu = document.getElementById('xpStartMenu');
    if (menu) menu.classList.remove('open');
  }
});

// ==================== TO-DO LIST ====================
let selectedTodoDate = getTodayString();

function setTodoToday() {
  selectedTodoDate = getTodayString();
  const dp = document.getElementById('todoDatePicker');
  if (dp) dp.value = selectedTodoDate;
  playSound('bubble');
  renderTodos();
}

// ==================== PERMANENT DAILY QUESTS ====================
const PERMANENT_ROUTINES = {
  yuki: [
    { id: 'y_lms', text: 'Open LMS & check courses 💻', done: false },
    { id: 'y_tugas', text: 'Work on assignments 📚', done: false },
    { id: 'y_skripsi', text: 'Work on thesis ✍️', done: false },
    { id: 'y_kerja', text: 'Job hunting & applications 💼', done: false }
  ],
  nata: [
    { id: 'n_spender', text: 'Reply to spenders 💬', done: false },
    { id: 'n_live', text: 'Daily 1-hour stream before dual persona stream 📹', done: false },
    { id: 'n_laporan', text: 'Send live stream report to group 📊', done: false },
    { id: 'n_absen', text: 'Clock-in & clock-out attendance ⏰', done: false }
  ],
  shared: [
    { id: 'duo_cuddles', text: 'Daily cuddles & cozy time 🫂💖', done: false },
    { id: 'duo_laundry', text: 'Weekly laundry 🧺🫧', done: false },
    { id: 'duo_date', text: 'Weekly date night 🍿✨', done: false },
    { id: 'duo_groceries', text: 'Grocery shopping 🛒🥑', done: false }
  ]
};

function ensureDayRoutines(dateStr) {
  const data = getStorage(STORAGE_KEYS.TODOS, {});
  if (!data[dateStr]) {
    data[dateStr] = { yuki: [], nata: [], shared: [] };
  }
  let modified = false;
  ['yuki', 'nata', 'shared'].forEach(owner => {
    if (!Array.isArray(data[dateStr][owner])) {
      data[dateStr][owner] = [];
      modified = true;
    }
    PERMANENT_ROUTINES[owner].forEach(task => {
      const exists = data[dateStr][owner].some(t => t.id === task.id || t.text.toLowerCase().includes(task.text.substring(0, 10).toLowerCase()));
      if (!exists) {
        data[dateStr][owner].unshift({ ...task, done: false });
        modified = true;
      }
    });
  });
  if (modified) {
    setStorage(STORAGE_KEYS.TODOS, data);
  }
  return data;
}

function initTodos() {
  const dp = document.getElementById('todoDatePicker');
  if (dp) {
    dp.value = selectedTodoDate;
    dp.addEventListener('change', (e) => {
      selectedTodoDate = e.target.value || getTodayString();
      playSound('bubble');
      ensureDayRoutines(selectedTodoDate);
      renderTodos();
    });
  }

  ['yuki', 'nata', 'shared'].forEach(owner => {
    const inp = document.getElementById(`${owner}TodoInput`);
    if (inp) {
      inp.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo(owner);
      });
    }
  });

  ensureDayRoutines(selectedTodoDate);
  renderTodos();
}

function loadYukiRoutine() {
  ensureDayRoutines(selectedTodoDate);
  playSound('chime');
  renderTodos();
  showToast('✨ Yuki’s permanent daily quests loaded!');
}

function loadNataRoutine() {
  ensureDayRoutines(selectedTodoDate);
  playSound('chime');
  renderTodos();
  showToast('✨ Nata’s permanent daily quests loaded!');
}

function loadDuoRoutine() {
  ensureDayRoutines(selectedTodoDate);
  playSound('chime');
  renderTodos();
  showToast('✨ Duo permanent quests loaded!');
}

function addTodo(owner) {
  const inp = document.getElementById(`${owner}TodoInput`);
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;

  const data = getStorage(STORAGE_KEYS.TODOS, {});
  if (!data[selectedTodoDate]) data[selectedTodoDate] = { yuki: [], nata: [], shared: [] };
  if (!data[selectedTodoDate][owner]) data[selectedTodoDate][owner] = [];

  data[selectedTodoDate][owner].push({
    id: 'td_' + Date.now() + '_' + Math.random().toString(36).substr(2, 3),
    text,
    done: false
  });

  setStorage(STORAGE_KEYS.TODOS, data);
  inp.value = '';
  playSound('bubble');
  renderTodos();
  showToast('Task added to queue.');
}

function toggleTodo(owner, id, evt) {
  const data = getStorage(STORAGE_KEYS.TODOS, {});
  const item = data[selectedTodoDate]?.[owner]?.find(t => t.id === id);
  if (item) {
    item.done = !item.done;
    setStorage(STORAGE_KEYS.TODOS, data);
    playSound(item.done ? 'check' : 'bubble');
    if (item.done && evt && evt.clientX) {
      spawnCelebrationSparkles(evt.clientX, evt.clientY);
    }
    renderTodos();
  }
}

function deleteTodo(owner, id) {
  const data = getStorage(STORAGE_KEYS.TODOS, {});
  if (data[selectedTodoDate]?.[owner]) {
    data[selectedTodoDate][owner] = data[selectedTodoDate][owner].filter(t => t.id !== id);
    setStorage(STORAGE_KEYS.TODOS, data);
    playSound('delete');
    renderTodos();
  }
}

function clearCompleted(owner) {
  const data = getStorage(STORAGE_KEYS.TODOS, {});
  if (data[selectedTodoDate]?.[owner]) {
    data[selectedTodoDate][owner] = data[selectedTodoDate][owner].filter(t => {
      const isPermanent = PERMANENT_ROUTINES[owner]?.some(p => p.id === t.id);
      if (isPermanent) {
        t.done = false;
        return true;
      }
      return !t.done;
    });
    setStorage(STORAGE_KEYS.TODOS, data);
    playSound('delete');
    renderTodos();
    showToast('Completed items cleared.');
  }
}

function renderTodos() {
  const data = ensureDayRoutines(selectedTodoDate);
  const dayTodos = data[selectedTodoDate] || { yuki: [], nata: [], shared: [] };

  ['yuki', 'nata', 'shared'].forEach(owner => {
    const listEl = document.getElementById(`${owner}TodoList`);
    const countEl = document.getElementById(`${owner}Count`);
    if (!listEl) return;

    const items = dayTodos[owner] || [];
    listEl.innerHTML = '';

    const completed = items.filter(t => t.done).length;
    if (countEl) countEl.textContent = `${completed} / ${items.length} completed`;

    if (items.length === 0) {
      listEl.innerHTML = `<li style="text-align:center; padding:18px 0; color:#8ba4b8; font-size:0.75rem; font-family:var(--font-pixel);">No tasks queued for this date 🫧</li>`;
      return;
    }

    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `todo-item ${item.done ? 'done' : ''}`;
      li.onclick = (e) => {
        if (e.target.closest('.todo-delete')) return;
        toggleTodo(owner, item.id, e);
      };
      li.innerHTML = `
        <div class="todo-checkbox">${item.done ? '✓' : ''}</div>
        <span class="todo-text">${escapeHtml(item.text)}</span>
        <button class="todo-delete" onclick="deleteTodo('${owner}', '${item.id}')">✕</button>
      `;
      listEl.appendChild(li);
    });
  });
}

// ==================== REMINDERS ====================
let selectedReminderColor = '#5bc8e8';

function initReminders() {
  document.querySelectorAll('#reminderColorPicker .color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('#reminderColorPicker .color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      selectedReminderColor = dot.getAttribute('data-color') || '#5bc8e8';
      playSound('bubble');
    });
  });

  ensureDefaultReminders();
  renderReminders();
  setInterval(checkReminders, 8000);
}

function ensureDefaultReminders() {
  let reminders = getStorage(STORAGE_KEYS.REMINDERS, [])
    .filter(r => !r.id.includes('bday') && !r.title.toLowerCase().includes('birthday') && !r.title.toLowerCase().includes('bday'));

  const GROUNDING_REMINDERS = [
    {
      id: 'rem_nata_semangat',
      title: 'Semangat Kerjanya Nata 🌸',
      desc: 'Semangat kerjanya, jangan kecapean ya! Take breathers & stay hydrated 💖',
      time: '09:00',
      color: '#f472b6',
      reminderFor: 'nata'
    },
    {
      id: 'rem_grounding_1',
      title: 'Eat regularly 🥗',
      desc: 'Skipping meals isn’t discipline. It backfires.',
      time: '12:30',
      color: '#10b981',
      reminderFor: 'both'
    },
    {
      id: 'rem_grounding_2',
      title: 'Reduce diet pills 💊',
      desc: 'This isn’t sustainable. Nurture your body with care.',
      time: '13:30',
      color: '#38bdf8',
      reminderFor: 'yuki'
    },
    {
      id: 'rem_grounding_3',
      title: 'Stop relying on medication 🌱',
      desc: 'Slow progress is still progress. Step by step.',
      time: '14:30',
      color: '#818cf8',
      reminderFor: 'yuki'
    },
    {
      id: 'rem_grounding_4',
      title: 'Address the eating disorder 🤍',
      desc: 'Avoidance won’t fix it. You deserve healing and peace.',
      time: '16:00',
      color: '#f472b6',
      reminderFor: 'yuki'
    },
    {
      id: 'rem_grounding_5',
      title: 'Get back to worship 🕊️',
      desc: 'For grounding, not perfection.',
      time: '18:00',
      color: '#fbbf24',
      reminderFor: 'both'
    },
    {
      id: 'rem_grounding_6',
      title: 'Choose healthy food 🥑',
      desc: 'Not just cheap—nutritionally worth it.',
      time: '19:30',
      color: '#34d399',
      reminderFor: 'both'
    },
    {
      id: 'rem_grounding_7',
      title: 'Don’t overpush work 🧘',
      desc: 'Burnout helps no one. Rest is productive.',
      time: '21:00',
      color: '#a78bfa',
      reminderFor: 'both'
    },
    {
      id: 'rem_nata_absen',
      title: 'Clock-In & Clock-Out Attendance ⏰',
      desc: 'Clock in & clock out on time',
      time: '09:00',
      color: '#ec4899',
      reminderFor: 'nata'
    },
    {
      id: 'rem_nata_spender',
      title: 'Reply to Spenders 💬',
      desc: 'Reply to all spender chats & messages',
      time: '14:00',
      color: '#f59e0b',
      reminderFor: 'nata'
    },
    {
      id: 'rem_nata_live',
      title: 'Daily 1-Hour Stream Before Dual Persona 📹',
      desc: 'Daily 1-hour live stream before dual persona stream',
      time: '18:00',
      color: '#8b5cf6',
      reminderFor: 'nata'
    },
    {
      id: 'rem_nata_laporan',
      title: 'Send Live Stream Report to Group 📊',
      desc: 'Submit live streaming report to group',
      time: '20:00',
      color: '#3b82f6',
      reminderFor: 'nata'
    },
    {
      id: 'rem_anniv_joint',
      title: 'Our Anniversary (17 Feb 2026)',
      desc: 'Happy Anniversary! Celebrate with love, warmth, and joy ✨🥂',
      time: '00:00',
      color: '#f43f5e',
      reminderFor: 'both'
    }
  ];

  GROUNDING_REMINDERS.forEach(gr => {
    const existingIndex = reminders.findIndex(r => r.id === gr.id || r.title.toLowerCase().includes(gr.title.toLowerCase().slice(0, 10)));
    if (existingIndex !== -1) {
      reminders[existingIndex].title = gr.title;
      reminders[existingIndex].desc = gr.desc;
      reminders[existingIndex].time = gr.time;
      reminders[existingIndex].reminderFor = gr.reminderFor || 'both';
      reminders[existingIndex].color = gr.color;
    } else {
      reminders.push({
        id: gr.id,
        title: gr.title,
        desc: gr.desc,
        date: getTodayString(),
        time: gr.time,
        reminderFor: gr.reminderFor || 'both',
        color: gr.color,
        done: false,
        notified: false
      });
    }
  });

  setStorage(STORAGE_KEYS.REMINDERS, reminders);
  return reminders;
}

function openReminderModal() {
  playSound('bubble');
  const titleInput = document.getElementById('reminderTitle');
  const descInput = document.getElementById('reminderDesc');
  if (titleInput) titleInput.value = '';
  if (descInput) descInput.value = '';
  openModal('reminderModal');
}

function saveReminder() {
  const titleInput = document.getElementById('reminderTitle');
  const descInput = document.getElementById('reminderDesc');
  const forInput = document.getElementById('reminderFor');

  const title = titleInput ? titleInput.value.trim() : '';
  if (!title) {
    alert('Please enter a reminder title.');
    return;
  }
  const desc = descInput ? descInput.value.trim() : '';
  const reminderFor = forInput ? forInput.value || 'both' : 'both';

  const reminders = getStorage(STORAGE_KEYS.REMINDERS, []);
  reminders.push({
    id: 'rem_' + Date.now(),
    title,
    desc,
    reminderFor,
    color: selectedReminderColor,
    done: false
  });
  setStorage(STORAGE_KEYS.REMINDERS, reminders);

  closeModal('reminderModal');
  playSound('chime');
  renderReminders();
  showToast('Everyday reminder saved.');
}

function toggleReminderDone(id) {
  const reminders = getStorage(STORAGE_KEYS.REMINDERS, []);
  const r = reminders.find(item => item.id === id);
  if (r) {
    r.done = !r.done;
    setStorage(STORAGE_KEYS.REMINDERS, reminders);
    playSound(r.done ? 'check' : 'bubble');
    renderReminders();
  }
}

function deleteReminder(id) {
  let reminders = getStorage(STORAGE_KEYS.REMINDERS, []);
  reminders = reminders.filter(r => r.id !== id);
  setStorage(STORAGE_KEYS.REMINDERS, reminders);
  playSound('delete');
  renderReminders();
  showToast('Reminder removed.');
}

function renderReminders() {
  let reminders = getStorage(STORAGE_KEYS.REMINDERS, []);
  if (!reminders || reminders.length === 0) {
    reminders = ensureDefaultReminders();
  }
  const grid = document.getElementById('remindersGrid');
  const empty = document.getElementById('remindersEmpty');
  if (!grid || !empty) return;

  if (reminders.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = reminders.map(r => {
    const forLabel = r.reminderFor === 'yuki' ? '🐱 Yuki' : r.reminderFor === 'nata' ? '🐈‍⬛ Nata' : '🤝 Joint';
    return `
      <div class="reminder-card-retro tilt-card" style="border-left-color:${r.color || '#5bc8e8'}; opacity:${r.done ? '0.6' : '1'}">
        <div class="reminder-top-row">
          <h4 class="reminder-title" style="${r.done ? 'text-decoration:line-through;' : ''}">${escapeHtml(r.title)}</h4>
          <button class="clear-btn" onclick="deleteReminder('${r.id}')">✕</button>
        </div>
        ${r.desc ? `<p class="reminder-desc">${escapeHtml(r.desc)}</p>` : ''}
        <div class="reminder-meta-badges">
          <span class="rem-badge">✨ Everyday</span>
          <span class="rem-badge">${forLabel}</span>
          <button class="retro-btn-today" style="margin-left:auto; font-size:0.7rem; padding:3px 8px;" onclick="toggleReminderDone('${r.id}')">
            ${r.done ? 'Mark Pending' : 'Complete ✓'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function checkReminders() {
  const now = new Date();
  const curDate = getTodayString();
  const curHours = String(now.getHours()).padStart(2, '0');
  const curMin = String(now.getMinutes()).padStart(2, '0');
  const curTime = `${curHours}:${curMin}`;

  const reminders = getStorage(STORAGE_KEYS.REMINDERS, []);
  let changed = false;

  reminders.forEach(r => {
    if (!r.done && !r.notified && r.date === curDate && r.time === curTime) {
      r.notified = true;
      changed = true;
      triggerAlert(r);
    }
  });

  if (changed) setStorage(STORAGE_KEYS.REMINDERS, reminders);
}

function triggerAlert(r) {
  playSound('chime');
  const alertBox = document.getElementById('reminderAlert');
  const alertTitle = document.getElementById('reminderAlertTitle');
  const alertDesc = document.getElementById('reminderAlertDesc');

  if (alertBox) {
    alertTitle.textContent = `🔔 Reminder: ${r.title}`;
    alertDesc.textContent = r.desc || 'Scheduled alert triggered.';
    alertBox.style.display = 'block';
  }
}

function dismissAlert() {
  const alertBox = document.getElementById('reminderAlert');
  if (alertBox) alertBox.style.display = 'none';
}

// ==================== MEMO BOARD & DOODLE ====================
let selectedNoteEmoji = '✨';

function initLoveNotes() {
  document.querySelectorAll('#noteEmojiPicker .emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#noteEmojiPicker .emoji-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedNoteEmoji = btn.getAttribute('data-emoji') || '✨';
      playSound('bubble');
    });
  });

  ensureDefaultNotes();
  renderNotes();
}

const DEFAULT_LOVE_NOTES = [
  {
    id: 'note_welcome_1',
    from: 'yuki',
    to: 'nata',
    title: 'Untuk Nata Tersayang 🌸',
    content: 'Semangat selalu yaa cantikk! Jangan lupa makan teratur dan minum air putih. Aku selalu ada buat kamu 💕',
    emoji: '💖',
    date: '17 Feb 2026'
  },
  {
    id: 'note_welcome_2',
    from: 'nata',
    to: 'yuki',
    title: 'Buat Yuki Hebat 💻',
    content: 'Semangat thesis dan job huntingnya! Jangan overthinking, kita lewatin semuanya bareng-bareng yaa ✨',
    emoji: '✨',
    date: '17 Feb 2026'
  }
];

function ensureDefaultNotes() {
  let notes = getStorage(STORAGE_KEYS.NOTES, []);
  if (!notes || notes.length === 0) {
    notes = DEFAULT_LOVE_NOTES;
    setStorage(STORAGE_KEYS.NOTES, notes);
  }
  return notes;
}

function openNoteModal() {
  playSound('bubble');
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';
  openModal('noteModal');
}

function saveNote() {
  const content = document.getElementById('noteContent').value.trim();
  if (!content) {
    alert('Please enter a message.');
    return;
  }
  const from = document.getElementById('noteFrom').value || 'yuki';
  const to = document.getElementById('noteTo').value || 'nata';
  const title = document.getElementById('noteTitle').value.trim() || 'Quick Note';

  const notes = getStorage(STORAGE_KEYS.NOTES, []);
  notes.unshift({
    id: 'note_' + Date.now(),
    from,
    to,
    title,
    content,
    emoji: selectedNoteEmoji,
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  });
  setStorage(STORAGE_KEYS.NOTES, notes);

  closeModal('noteModal');
  playSound('chime');
  renderNotes();
  showToast('Memo posted.');
}

function deleteNote(id) {
  let notes = getStorage(STORAGE_KEYS.NOTES, []);
  notes = notes.filter(n => n.id !== id);
  setStorage(STORAGE_KEYS.NOTES, notes);
  playSound('delete');
  renderNotes();
  showToast('Memo deleted.');
}

function renderNotes() {
  let notes = getStorage(STORAGE_KEYS.NOTES, []);
  if (!notes || notes.length === 0) {
    notes = ensureDefaultNotes();
  }
  const grid = document.getElementById('notesGrid');
  const empty = document.getElementById('notesEmpty');
  if (!grid || !empty) return;

  if (notes.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = notes.map(n => {
    const fromLabel = n.from === 'yuki' ? 'Yuki' : 'Nata';
    const toLabel = n.to === 'yuki' ? 'Yuki' : 'Nata';

    return `
      <div class="note-card-retro tilt-card">
        ${n.doodleData ? `<img src="${n.doodleData}" class="note-doodle-img" alt="Doodle" />` : ''}
        <div class="note-header-wrap">
          <span class="note-stamp">${n.emoji || '💌'}</span>
          <button class="clear-btn" onclick="deleteNote('${n.id}')">✕</button>
        </div>
        <div class="note-badge-to">From: ${fromLabel} ➔ To: ${toLabel}</div>
        <h4 class="note-title-text">${escapeHtml(n.title)}</h4>
        <p class="note-body-text">${escapeHtml(n.content)}</p>
        <span class="note-date-text">📅 ${n.date}</span>
      </div>
    `;
  }).join('');
}

// ==================== MS PAINT CANVAS ====================
let canvas, ctxCanvas;
let isPainting = false;
let paintTool = 'pencil';
let paintColor = '#000000';

const PALETTE_COLORS = [
  '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
  '#ffffff', '#c3c3c3', '#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7'
];

function initPaint() {
  canvas = document.getElementById('paintCanvas');
  if (!canvas) return;
  ctxCanvas = canvas.getContext('2d');

  clearCanvas();

  const paletteContainer = document.getElementById('paintPalette');
  if (paletteContainer) {
    paletteContainer.innerHTML = PALETTE_COLORS.map((c, i) => `
      <div class="palette-box ${i === 0 ? 'active' : ''}" style="background:${c};" onclick="setPaintColor('${c}', this)"></div>
    `).join('');
  }

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrawing({ offsetX: t.clientX - rect.left, offsetY: t.clientY - rect.top });
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw({ offsetX: t.clientX - rect.left, offsetY: t.clientY - rect.top });
  });
  canvas.addEventListener('touchend', stopDrawing);
}

function openPaintModal() {
  playSound('bubble');
  openModal('paintModal');
  if (!ctxCanvas) initPaint();
}

function setPaintTool(tool) {
  paintTool = tool;
  document.querySelectorAll('.paint-toolbar .tool-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(`tool${tool.charAt(0).toUpperCase() + tool.slice(1)}`);
  if (btn) btn.classList.add('active');
  playSound('bubble');
}

function setPaintColor(color, el) {
  paintColor = color;
  document.querySelectorAll('.palette-box').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  playSound('bubble');
}

function clearCanvas() {
  if (!ctxCanvas) return;
  ctxCanvas.fillStyle = '#ffffff';
  ctxCanvas.fillRect(0, 0, canvas.width, canvas.height);
  playSound('delete');
}

function startDrawing(e) {
  isPainting = true;
  const size = document.getElementById('brushSize')?.value || 4;

  if (paintTool === 'heart' || paintTool === 'star') {
    ctxCanvas.font = `${size * 6}px sans-serif`;
    ctxCanvas.fillText(paintTool === 'heart' ? '💖' : '⭐', e.offsetX - 10, e.offsetY + 10);
    playSound('bubble');
    isPainting = false;
    return;
  }

  ctxCanvas.beginPath();
  ctxCanvas.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!isPainting) return;
  const size = document.getElementById('brushSize')?.value || 4;

  ctxCanvas.lineWidth = paintTool === 'eraser' ? size * 4 : size;
  ctxCanvas.lineCap = 'round';
  ctxCanvas.lineJoin = 'round';
  ctxCanvas.strokeStyle = paintTool === 'eraser' ? '#ffffff' : paintColor;

  ctxCanvas.lineTo(e.offsetX, e.offsetY);
  ctxCanvas.stroke();
}

function stopDrawing() {
  isPainting = false;
  if (ctxCanvas) ctxCanvas.closePath();
}

function saveDoodleAsNote() {
  if (!canvas) return;
  const dataUrl = canvas.toDataURL('image/png');

  const notes = getStorage(STORAGE_KEYS.NOTES, []);
  notes.unshift({
    id: 'note_' + Date.now(),
    from: 'nata',
    to: 'yuki',
    title: 'Canvas Sketch #01',
    content: 'Handcrafted on Aero Paint Studio.',
    emoji: '🎨',
    doodleData: dataUrl,
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  });
  setStorage(STORAGE_KEYS.NOTES, notes);

  closeModal('paintModal');
  playSound('chime');
  switchTab('lovenotes');
  renderNotes();
  showToast('Doodle pinned to Memo Board.');
}

function downloadDoodle() {
  if (!canvas) return;
  const link = document.createElement('a');
  link.download = `yuki_nata_doodle_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  playSound('bubble');
  showToast('Doodle downloaded as PNG.');
}

// ==================== PURRR CAT DIALOG ====================
const CAT_PROMPTS = [
  'Did you remember to tell your favorite person how much they mean to you today?',
  'Daily reminder: You two are the cutest team ever.',
  'Just stopping by to say: You make every single day brighter.',
  'System notice: Extra hugs and warm energy sent your way.'
];

function openCatDialog() {
  playSound('purr');
  const promptEl = document.getElementById('catQuestionPrompt');
  if (promptEl) {
    const random = CAT_PROMPTS[Math.floor(Math.random() * CAT_PROMPTS.length)];
    promptEl.textContent = random;
  }
  openModal('catDialogModal');
}

function answerCatDialog(isYes) {
  closeModal('catDialogModal');
  playSound('chime');
  showToast('Purrr! Extra love sent your way 💕');
}

// ==================== LOVECAPTCHA ====================
function openCaptchaModal() {
  playSound('bubble');
  document.querySelectorAll('#captchaGrid .captcha-tile').forEach(t => t.classList.remove('selected'));
  openModal('captchaModal');
}

function toggleCaptchaTile(el) {
  el.classList.toggle('selected');
  playSound('bubble');
}

function verifyLoveCaptcha() {
  const selected = document.querySelectorAll('#captchaGrid .captcha-tile.selected');
  if (selected.length < 3) {
    alert('Select at least 3 verified traits!');
    return;
  }
  closeModal('captchaModal');
  playSound('xp');
  showToast('Verified: Peak Synergy Confirmed.');
}

// ==================== COUNTDOWN ====================
let selectedCountdownEmoji = '🎉';

function initCountdown() {
  document.querySelectorAll('#countdownEmojiPicker .emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#countdownEmojiPicker .emoji-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCountdownEmoji = btn.getAttribute('data-emoji') || '🎉';
      playSound('bubble');
    });
  });

  ensureDefaultCountdowns();
  renderCountdowns();
  setInterval(renderCountdowns, 1000);
}

function ensureDefaultCountdowns() {
  let cds = getStorage(STORAGE_KEYS.COUNTDOWNS, []);
  const curYear = new Date().getFullYear();
  const now = new Date();

  const hasYukie = cds.some(c => c.id === 'cd_yukie_bday' || c.name.toLowerCase().includes('yukie'));
  const hasNata = cds.some(c => c.id === 'cd_nata_bday' || c.name.toLowerCase().includes('nata'));

  // Yukie: 23 October 2005
  if (!hasYukie) {
    const nextYukieYear = (now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() > 23)) ? curYear + 1 : curYear;
    cds.push({
      id: 'cd_yukie_bday',
      name: "Yukie's Birthday (23 Oct 2005)",
      date: `${nextYukieYear}-10-23`,
      emoji: '🎂'
    });
  }

  // Nata: 24 September 2005
  if (!hasNata) {
    const nextNataYear = (now.getMonth() > 8 || (now.getMonth() === 8 && now.getDate() > 24)) ? curYear + 1 : curYear;
    cds.push({
      id: 'cd_nata_bday',
      name: "Nata's Birthday (24 Sep 2005)",
      date: `${nextNataYear}-09-24`,
      emoji: '🎂'
    });
  }

  // Anniversary: 17 February 2026
  const annivIndex = cds.findIndex(c => c.id === 'cd_anniv' || c.name.toLowerCase().includes('anniv') || c.date === '2026-02-17');
  if (annivIndex === -1) {
    cds.push({
      id: 'cd_anniv',
      name: 'Our Anniversary (17 Feb 2026)',
      date: '2026-02-17',
      emoji: '💖'
    });
  } else {
    cds[annivIndex].id = 'cd_anniv';
    cds[annivIndex].name = 'Our Anniversary (17 Feb 2026)';
    cds[annivIndex].date = '2026-02-17';
    cds[annivIndex].emoji = '💖';
  }

  if (!cds.some(c => c.id === 'cd_1')) {
    cds.push({
      id: 'cd_1',
      name: 'New Year Milestone',
      date: `${curYear + 1}-01-01`,
      emoji: '🎆'
    });
  }

  setStorage(STORAGE_KEYS.COUNTDOWNS, cds);
  return cds;
}

function openCountdownModal() {
  playSound('bubble');
  document.getElementById('countdownName').value = '';
  document.getElementById('countdownDate').value = getTodayString();
  openModal('countdownModal');
}

function saveCountdown() {
  const name = document.getElementById('countdownName').value.trim();
  const date = document.getElementById('countdownDate').value;
  if (!name || !date) {
    alert('Please complete the milestone name and date.');
    return;
  }
  const cds = getStorage(STORAGE_KEYS.COUNTDOWNS, []);
  cds.push({
    id: 'cd_' + Date.now(),
    name,
    date,
    emoji: selectedCountdownEmoji
  });
  setStorage(STORAGE_KEYS.COUNTDOWNS, cds);

  closeModal('countdownModal');
  playSound('chime');
  renderCountdowns();
  showToast('Milestone tracker added.');
}

function deleteCountdown(id) {
  let cds = getStorage(STORAGE_KEYS.COUNTDOWNS, []);
  cds = cds.filter(c => c.id !== id);
  setStorage(STORAGE_KEYS.COUNTDOWNS, cds);
  playSound('delete');
  renderCountdowns();
  showToast('Milestone removed.');
}

function renderCountdowns() {
  let cds = getStorage(STORAGE_KEYS.COUNTDOWNS, []);
  if (!cds || cds.length === 0) {
    cds = ensureDefaultCountdowns();
  }
  const grid = document.getElementById('countdownGrid');
  const empty = document.getElementById('countdownEmpty');
  if (!grid || !empty) return;

  if (cds.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const now = new Date();

  grid.innerHTML = cds.map(c => {
    const target = new Date(`${c.date}T00:00:00`);
    const diff = target - now;
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    return `
      <div class="countdown-card-retro tilt-card">
        <button class="clear-btn" style="position:absolute; top:8px; right:8px;" onclick="deleteCountdown('${c.id}')">✕</button>
        <span class="cd-emoji">${c.emoji || '🎉'}</span>
        <h4 class="cd-title">${escapeHtml(c.name)}</h4>
        <div class="cd-date">📅 ${c.date} ${isPast ? '(Milestone Achieved)' : ''}</div>
        <div class="cd-boxes">
          <div class="cd-unit"><span class="cd-num">${days}</span><span class="cd-label">Days</span></div>
          <div class="cd-unit"><span class="cd-num">${hours}</span><span class="cd-label">Hours</span></div>
          <div class="cd-unit"><span class="cd-num">${minutes}</span><span class="cd-label">Mins</span></div>
          <div class="cd-unit"><span class="cd-num">${seconds}</span><span class="cd-label">Secs</span></div>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== MOOD TRACKER ====================
let selectedMoodDate = getTodayString();
let selectedMoodYuki = '';
let selectedMoodNata = '';

function initMoodTracker() {
  const dp = document.getElementById('moodDatePicker');
  if (dp) {
    dp.value = selectedMoodDate;
    dp.addEventListener('change', (e) => {
      selectedMoodDate = e.target.value || getTodayString();
      playSound('bubble');
      loadMoodsForDate();
    });
  }

  document.querySelectorAll('#yukiMoodEmojis .mood-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#yukiMoodEmojis .mood-pick').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMoodYuki = btn.getAttribute('data-mood');
      document.getElementById('yukiSelectedEmoji').textContent = selectedMoodYuki;
      playSound('bubble');
    });
  });

  document.querySelectorAll('#nataMoodEmojis .mood-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#nataMoodEmojis .mood-pick').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMoodNata = btn.getAttribute('data-mood');
      document.getElementById('nataSelectedEmoji').textContent = selectedMoodNata;
      playSound('bubble');
    });
  });

  loadMoodsForDate();
  renderMoodHistory();
}

function loadMoodsForDate() {
  const moods = getStorage(STORAGE_KEYS.MOODS, {});
  const cur = moods[selectedMoodDate] || {};

  selectedMoodYuki = cur.yuki?.emoji || '';
  document.getElementById('yukiSelectedEmoji').textContent = selectedMoodYuki || '—';
  document.getElementById('yukiMoodNote').value = cur.yuki?.note || '';
  document.querySelectorAll('#yukiMoodEmojis .mood-pick').forEach(b => {
    b.classList.toggle('selected', b.getAttribute('data-mood') === selectedMoodYuki);
  });

  selectedMoodNata = cur.nata?.emoji || '';
  document.getElementById('nataSelectedEmoji').textContent = selectedMoodNata || '—';
  document.getElementById('nataMoodNote').value = cur.nata?.note || '';
  document.querySelectorAll('#nataMoodEmojis .mood-pick').forEach(b => {
    b.classList.toggle('selected', b.getAttribute('data-mood') === selectedMoodNata);
  });
}

function saveMood(person) {
  const emoji = person === 'yuki' ? selectedMoodYuki : selectedMoodNata;
  const note = document.getElementById(`${person}MoodNote`).value.trim();

  if (!emoji && !note) {
    alert('Please select an emoji or add a note.');
    return;
  }

  const moods = getStorage(STORAGE_KEYS.MOODS, {});
  if (!moods[selectedMoodDate]) moods[selectedMoodDate] = {};

  moods[selectedMoodDate][person] = { emoji: emoji || '😊', note };
  setStorage(STORAGE_KEYS.MOODS, moods);

  playSound('chime');
  renderMoodHistory();
  showToast(`Pulse logged for ${person === 'yuki' ? 'Yuki' : 'Nata'}.`);
}

function renderMoodHistory() {
  const container = document.getElementById('moodHistory');
  if (!container) return;

  const moods = getStorage(STORAGE_KEYS.MOODS, {});
  const dates = Object.keys(moods).sort().reverse().slice(0, 8);

  if (dates.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#94a3b8; font-size:0.8rem; font-family:var(--font-pixel);">No logs recorded yet</div>`;
    return;
  }

  container.innerHTML = dates.map(dt => {
    const data = moods[dt] || {};
    return `
      <div class="mood-hist-card tilt-card">
        <div class="mhc-date">📅 ${dt}</div>
        <div>Yuki: ${data.yuki?.emoji || '—'} ${data.yuki?.note ? `"${escapeHtml(data.yuki.note)}"` : ''}</div>
        <div>Nata: ${data.nata?.emoji || '—'} ${data.nata?.note ? `"${escapeHtml(data.nata.note)}"` : ''}</div>
      </div>
    `;
  }).join('');
}

// ==================== BACKUP & RESTORE DATA ====================
function exportDataBackup() {
  const fullBackup = {
    exportedAt: new Date().toISOString(),
    todos: getStorage(STORAGE_KEYS.TODOS, {}),
    reminders: getStorage(STORAGE_KEYS.REMINDERS, []),
    notes: getStorage(STORAGE_KEYS.NOTES, []),
    countdowns: getStorage(STORAGE_KEYS.COUNTDOWNS, []),
    moods: getStorage(STORAGE_KEYS.MOODS, {})
  };

  const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `yuki_nata_aero_backup_${getTodayString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  playSound('chime');
  showToast('Backup archive downloaded.');
}

function importDataBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.todos) setStorage(STORAGE_KEYS.TODOS, data.todos);
      if (data.reminders) setStorage(STORAGE_KEYS.REMINDERS, data.reminders);
      if (data.notes) setStorage(STORAGE_KEYS.NOTES, data.notes);
      if (data.countdowns) setStorage(STORAGE_KEYS.COUNTDOWNS, data.countdowns);
      if (data.moods) setStorage(STORAGE_KEYS.MOODS, data.moods);

      playSound('xp');
      showToast('Data restored from snapshot.');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      alert('Invalid backup JSON file.');
    }
  };
  reader.readAsText(file);
}

// ==================== GENERAL MODALS & TOAST ====================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    playSound('bubble');
  }
}

let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// Close modals on backdrop click or ESC
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    playSound('bubble');
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});

// ==================== INTERACTIVE BUBBLE LAB & SWARM ====================
let bubblesPoppedCount = 0;

function spawnFloatingBubbleSwarm(count = 14) {
  const container = document.getElementById('bubblesContainer');
  if (!container) return;

  playSound('bubble');
  showToast('🫧 Bubble Swarm Released! Click floating bubbles to pop them ✨');

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'bubble';
      const size = Math.floor(Math.random() * 55) + 25;
      const left = Math.random() * 92 + 4;
      const dur = Math.random() * 6 + 6;

      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      b.style.left = `${left}%`;
      b.style.animationDuration = `${dur}s`;

      const popAction = (e) => {
        e.stopPropagation();
        playSound('bubble');
        bubblesPoppedCount++;
        const rect = b.getBoundingClientRect();
        spawnBubbleBurstAt(rect.left + size / 2, rect.top + size / 2);
        b.remove();
        if (bubblesPoppedCount % 5 === 0) {
          showToast(`🫧 Nice! Bubbles Popped: ${bubblesPoppedCount} 🎉`);
        }
      };

      b.addEventListener('click', popAction);
      b.addEventListener('pointerenter', popAction);

      container.appendChild(b);
      setTimeout(() => {
        if (b.parentNode) b.remove();
      }, dur * 1000);
    }, i * 140);
  }
}

// ==================== YUTA SPARKLE BOOST ====================
const YUTA_SPARKLE_QUOTES = [
  'Main character duo energy unlocked ✨',
  'Always rooting for you, no matter what 💙',
  'You make every single day better, no cap 🌸',
  'Two cats locked in and thriving 🐱🐈‍⬛',
  'Soft days, good coffee & cozy vibes ☕',
  'My favorite human in every universe 💫',
  'Duo queue champions forever 🫧'
];

function triggerSparkleBoost() {
  playSound('chime');

  // Create energetic crystalline synth chord
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now + idx * 0.05);
      g.gain.setValueAtTime(0.12, now + idx * 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.45);
      o.start(now + idx * 0.05);
      o.stop(now + idx * 0.05 + 0.48);
    });
  } catch(e) {}

  // Spawn visual bursts of stars, bubbles, hearts, and clovers
  const emojis = ['⭐', '✨', '🫧', '💙', '🌸', '⚡', '🍀', '💎'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'popoff-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = `${Math.random() * 80 + 10}vw`;
    p.style.top = `${Math.random() * 70 + 15}vh`;
    p.style.fontSize = `${Math.random() * 26 + 18}px`;
    p.style.animation = `popOffFly ${0.8 + Math.random() * 0.8}s ease-out forwards`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1600);
  }

  // Flash vibrant body glow
  document.body.classList.add('popoff-flash-glow');
  setTimeout(() => document.body.classList.remove('popoff-flash-glow'), 600);

  // Trigger water ripple burst in center
  if (typeof createWaterDrop === 'function') {
    createWaterDrop(window.innerWidth / 2, window.innerHeight / 2, 45);
    createWaterDrop(window.innerWidth / 2 + 60, window.innerHeight / 2 - 40, 30);
    createWaterDrop(window.innerWidth / 2 - 60, window.innerHeight / 2 + 40, 30);
  }

  const quote = YUTA_SPARKLE_QUOTES[Math.floor(Math.random() * YUTA_SPARKLE_QUOTES.length)];
  showToast(quote);
}

// Compatibility alias
function triggerPopOffBoost() {
  triggerSparkleBoost();
}

// ==================== ATMOSPHERE / SKY MODES ====================
const ATMO_MODES = [
  { name: 'Aqua Breeze', sub: '[Live Sky]', cls: '' },
  { name: 'Rain Shower', sub: '[Rain Glass]', cls: 'atmo-rain' },
  { name: 'Sunset Prism', sub: '[Iridescent]', cls: 'atmo-sunset' },
  { name: 'Midnight Aero', sub: '[Deep Stars]', cls: 'atmo-midnight' }
];

let curAtmoIndex = 0;

function toggleAtmosphereMode() {
  playSound('bubble');
  const oldCls = ATMO_MODES[curAtmoIndex].cls;
  if (oldCls) document.body.classList.remove(oldCls);

  curAtmoIndex = (curAtmoIndex + 1) % ATMO_MODES.length;
  const current = ATMO_MODES[curAtmoIndex];
  if (current.cls) document.body.classList.add(current.cls);

  const titleEl = document.getElementById('atmoTitle');
  const subEl = document.getElementById('atmoSub');
  if (titleEl) titleEl.textContent = current.name.split(' ')[0];
  if (subEl) subEl.textContent = current.sub;

  if (current.name === 'Rain Shower') {
    playSound('splash');
  } else {
    playSound('chime');
  }

  showToast(`Atmosphere: ${current.name} ${current.sub}`);
}

// ==================== SLOSH WATER TANK ====================
function sloshWaterTank() {
  playSound('splash');
  const tank = document.querySelector('.hydro-tank-wrap');
  if (tank) {
    tank.classList.remove('sloshing');
    void tank.offsetWidth;
    tank.classList.add('sloshing');
  }
  showToast('Splash! Liquid waves sloshing in the tank.');
}

// ==================== CELEBRATION SPARKLES ====================
function spawnCelebrationSparkles(x, y) {
  const stars = ['⭐', '✨', '💖', '🌟', '🎉'];
  for (let i = 0; i < 8; i++) {
    const star = document.createElement('div');
    star.className = 'todo-sparkle-star';
    star.textContent = stars[Math.floor(Math.random() * stars.length)];
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    const angle = (i / 8) * Math.PI * 2;
    const dist = Math.random() * 45 + 30;
    star.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    star.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 700);
  }
  showToast('Nice work! Task checked off ✨');
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-tab');
      if (tabId) {
        window.location.hash = tabId;
        switchTab(tabId);
      }
    });
  });

  const initialHash = window.location.hash.replace("#", "");
  if (initialHash) {
    setTimeout(() => switchTab(initialHash), 50);
  }

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    if (hash) switchTab(hash);
  });
}

// Init on Load
document.addEventListener('DOMContentLoaded', () => {
  initWaterRipples();
  initCursorGlow();
  initVistaGadgets();
  initFishPet();
  initBubbles();
  initStickers();
  initTiltCards();
  initClocks();
  initTabs();
  initTodo();
  initReminders();
  initLoveNotes();
  initCountdown();
  initMoodTracker();
  initCatSanctuary();
  initWindowDragAndControls();
  initPixelBuddy();
  initSchedule();
  initCloudSync();
});

// ==================== PIXEL DUO TINY RIGHT-SIDE ACCESSORY ====================
function initPixelBuddy() {
  // Looping animated GIF is active on desktop
}

function sparklePixelBuddy(evt) {
  playSound('bubble');
  const img = document.getElementById('pixelSidebarGif') || document.getElementById('pixelBuddyImg');
  if (img) {
    img.style.transform = 'scale(1.2) rotate(6deg)';
    setTimeout(() => { img.style.transform = ''; }, 220);
  }
  if (evt && evt.clientX) {
    spawnCelebrationSparkles(evt.clientX, evt.clientY);
  }
}

function togglePixelBuddy() {
  const widget = document.getElementById('pixelBuddyWidget');
  if (!widget) return;
  const isHidden = widget.classList.toggle('hidden');
  playSound(isHidden ? 'delete' : 'chime');
  showToast(isHidden ? 'Pixel Buddy Hidden' : 'Pixel Buddy Active ✨');
}

// ==================== CLASS SCHEDULE ENGINE ====================
// Edit the schedule data below to match YuTa's actual timetable!
// who: 'yuki' | 'nata' | 'both'
const YUTA_SCHEDULE = {
  1: [ // Monday
    { time: '08:30', end: '11:30', code: 'CAK4IBB3', subject: 'Desain Interaksi', who: 'yuki' },
    { time: '09:30', end: '12:00', code: 'SIK3703', subject: 'Public Relations Writing', who: 'nata' },
    { time: '12:50', end: '15:20', code: 'SIK3506', subject: 'Manajemen Public Relations', who: 'nata' },
    { time: '13:30', end: '16:30', code: 'CAK4JBB3', subject: 'Forensik Digital', who: 'yuki' }
  ],
  2: [ // Tuesday
    { time: '08:30', end: '11:30', code: 'CAK4HBB3', subject: 'Big Data dan AI', who: 'yuki' },
    { time: '12:50', end: '15:20', code: 'SIK3704', subject: 'Public Relations Campaign', who: 'nata' }
  ],
  3: [], // Wednesday - Free day
  4: [ // Thursday
    { time: '11:30', end: '14:30', code: 'CAK4KAB3', subject: 'Bahasa Inggris untuk Karier', who: 'yuki' },
    { time: '12:50', end: '15:20', code: 'SIK3705', subject: 'Metodologi Penelitian Komunikasi', who: 'nata' }
  ],
  5: [ // Friday
    { time: '13:30', end: '16:30', code: 'CAK4TBB3', subject: 'Sistem Pemberi Rekomendasi', who: 'yuki' }
  ],
  6: [], // Saturday - Weekend
  7: []  // Sunday - Weekend
};

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let activeScheduleDay = 1;

function initSchedule() {
  const today = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const mappedDay = today === 0 ? 7 : today;
  // If today has classes, show today; otherwise show Monday (1) so schedule is immediately visible
  const hasClasses = YUTA_SCHEDULE[mappedDay] && YUTA_SCHEDULE[mappedDay].length > 0;
  activeScheduleDay = hasClasses ? mappedDay : 1;

  const badge = document.getElementById('scheduleTodayLabel');
  if (badge) {
    const now = new Date();
    const dayName = DAY_NAMES[today === 0 ? 7 : today] || 'Sunday';
    badge.textContent = `Today: ${dayName}, ${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
  }

  switchScheduleDay(activeScheduleDay);
}

function switchScheduleDay(day) {
  activeScheduleDay = day;
  playSound('bubble');

  document.querySelectorAll('.sched-day-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.day) === day);
  });

  const timeline = document.getElementById('scheduleTimeline');
  const emptyEl = document.getElementById('schedEmpty');
  if (!timeline) return;

  const slots = YUTA_SCHEDULE[day] || [];
  const filteredSlots = slots.filter(s => s && s.subject);

  if (filteredSlots.length === 0) {
    timeline.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  timeline.innerHTML = filteredSlots.map(slot => {
    const cardClass = slot.who === 'yuki' ? 'yuki-card' : slot.who === 'nata' ? 'nata-card' : 'both-card';
    const whoBadge = slot.who === 'yuki' ? '🐱 Yuki' : slot.who === 'nata' ? '🐈‍⬛ Nata' : 'YuTa Duo';
    return `
      <div class="sched-slot">
        <div class="sched-time-col">
          <span class="sched-time-start">${slot.time}</span>
          <div class="sched-time-dot"></div>
          <div class="sched-time-line"></div>
          <span class="sched-time-end">${slot.end}</span>
        </div>
        <div class="sched-card ${cardClass}">
          <div class="sched-card-header">
            <span class="sched-subject">${slot.subject}</span>
            <span class="sched-who-badge">${whoBadge}</span>
          </div>
          <div class="sched-card-meta">
            ${slot.code ? `<span class="sched-meta-item"><span class="sched-meta-icon">#</span>${slot.code}</span>` : ''}
            ${slot.room ? `<span class="sched-meta-item"><span class="sched-meta-icon">📍</span>${slot.room}</span>` : ''}
            ${slot.lecturer ? `<span class="sched-meta-item"><span class="sched-meta-icon">👤</span>${slot.lecturer}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.switchScheduleDay = switchScheduleDay;

// ==================== 3D ORANGE CAT COMPANION: RERU ====================
const STORAGE_KEY_RERU = 'aero_reru_pet_v3';

const DEFAULT_RERU_DATA = {
  name: 'Reru',
  type: '3D Kucing Oyen Barbar',
  avatarImg: 'assets/reru_cat.jpg',
  color: '#ea580c',
  sub: 'Bos Oyen Barbar • Penguasa YuTa OS ✨',
  level: 1,
  xp: 30,
  maxXp: 100,
  happiness: 90,
  hunger: 80,
  energy: 85,
  totalPets: 0,
  pokeCount: 0,
  mood: 'happy', // 'happy' | 'angry' | 'playful' | 'sleepy'
  dialog: "Ngapain liat-liat babu? Mau ngasih salmon apa cuma numpang lewat? 😼🐟"
};

const RERU_HAPPY_DIALOGS = [
  "Purrrrr enak bener... Dah pinter ya lu mijitnya, gue angkat jadi babu teladan! 🥰✨",
  "Aww yiss pas di dagu! Kalo rajin ngelus gini kan gue ga nyakar gorden lu 😸💖",
  "Muka gue pasrah banget ya? Ya abis elusan lu enak sih... Muehehe 🌸",
  "Meoong~ Lu mood booster gue hari ini, tapi tetep salmon nomer satu! 💕🍣",
  "Purrr... Makasih babu terbaikku! Besok jatah cemilan jangan lupa ya 🐾✨"
];

const RERU_ANGRY_DIALOGS = [
  "HISSS! 😾💢 Tangan lu ga bisa diem banget ya?! Gue cakar nih sofa kesayangan lu!",
  "HISSSS! 😾 Apaan sih toel-toel mulu! Gue oyen barbar bukan boneka capit! 🔥",
  "Grrrr... Senggol bacok nih! Jangan bikin jiwa preman oyen gue bangkit! 😼⚡",
  "HISS! 😾 Salmon mana salmon?! Minta maaf pake makanan sekarang cepet! 🐟💢",
  "Rawrr! Sekali lagi lu usil, kabel charger lu gue gigit putus ya! 😾🔥"
];

const RERU_PLAYFUL_DIALOGS = [
  "SERANGG! 🧶💨 Liat nih salto 360 derajat ala oyen profesional! (★ω★)",
  "Wushhh! Gaada yang bisa ngalahin kecepatan lari gue, zoomies mode on! 💨🐾",
  "Mana benangnya?! Sini gue acak-acak sampe kusut sedunia! 😼🧶",
  "Pounce! Kecepatan kilat oyen barbar beraksi! 🌪️🐾"
];

const RERU_SLEEPY_DIALOGS = [
  "Zzz... Capek abis jadi bos seharian, jangan berisik lu pada! 😴💤",
  "Zzz... Mimpi dapet traktiran salmon sekontainer... 💤🍣",
  "Hoammm... Jangan ganggu ritual tidur 18 jam gue! 💤✨"
];

let moodResetTimer = null;

function initCatSanctuary() {
  const data = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
  if (!data.name || data.name !== 'Reru' || !data.sub || data.sub.includes('Playful • Fluffy')) {
    data.sub = DEFAULT_RERU_DATA.sub;
    data.type = DEFAULT_RERU_DATA.type;
    data.dialog = DEFAULT_RERU_DATA.dialog;
    setStorage(STORAGE_KEY_RERU, data);
  }
  renderReruCard();
}

function renderReruCard() {
  const cardContainer = document.getElementById('reruCard');
  if (!cardContainer) return;

  const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
  const xpPercent = Math.min(100, Math.round((reru.xp / reru.maxXp) * 100));

  const rankBadge = document.getElementById('catsTrioLevelBadge');
  if (rankBadge) {
    const rankLabel = reru.mood === 'angry' ? '😾 Preman Oyen (GALAK)' : reru.level >= 10 ? 'Raja Oyen Barbar ⭐' : reru.level >= 5 ? 'Bos Oyen Elit 🌟' : reru.level >= 3 ? 'Kucing Oyen Tengil 🌸' : 'Anabul Gemoy 🐾';
    rankBadge.textContent = `Pangkat Reru: ${rankLabel} (Lv. ${reru.level})`;
  }

  const isAngry = reru.mood === 'angry';
  const moodClass = isAngry ? 'mood-angry' : reru.mood === 'happy' ? 'mood-happy' : reru.mood === 'playful' ? 'mood-playful' : reru.mood === 'sleepy' ? 'mood-sleepy' : '';
  const faceEmoji = isAngry ? '😾💢' : reru.mood === 'sleepy' ? '😴💤' : reru.mood === 'playful' ? '😺✨' : '😸🥰';
  const statusText = isAngry ? 'MARAH & GALAK' : reru.mood === 'sleepy' ? 'Tidur Zzz' : reru.mood === 'playful' ? 'Zoomies' : 'Senyum & Manja';
  const tagClass = isAngry ? 'tag-angry' : reru.mood === 'playful' ? 'tag-playful' : reru.mood === 'sleepy' ? 'tag-sleepy' : 'tag-happy';

  cardContainer.innerHTML = `
    <!-- Left 3D Visual Column (Photo 100% Unobstructed) -->
    <div class="reru-visual-col">
      <div class="reru-avatar-3d-wrap ${moodClass}" id="reruAvatarWrap" onclick="interactReruDirect(event)" title="Klik buat elus & dengerin suara Reru!">
        <img src="${reru.avatarImg || 'assets/reru_cat.jpg'}" alt="3D Kucing Oyen Reru" class="reru-3d-img" id="reruAvatarImg" />
        <div class="reru-shine-layer"></div>
        <div class="reru-glow-aura"></div>
      </div>
      <div class="reru-speech-bubble" id="reruSpeech" onclick="interactReruDirect(event)" title="Klik buat ngobrol sama Reru">
        "${reru.dialog || 'Purrr... Mau apa lu?'}"
      </div>
    </div>

    <!-- Right Stats & Actions Column -->
    <div class="reru-stats-col">
      <div class="reru-header-row">
        <div class="reru-name-group">
          <div class="reru-name-line">
            <span class="reru-name">🐾 ${reru.name}</span>
            <span class="reru-status-tag ${tagClass}">
              <span class="reru-pulse-dot ${isAngry ? 'pulse-red' : ''}"></span>
              <span>${faceEmoji} ${statusText}</span>
            </span>
          </div>
          <span class="reru-bio">${isAngry ? '⚠️ Awas: Mode preman oyen aktif! Kasih salmon biar jinak' : reru.sub}</span>
        </div>
        <div class="reru-lvl-badge">${isAngry ? '😾 GALAK' : `Lv. ${reru.level}`}</div>
      </div>

      <!-- XP Progress Track -->
      <div class="reru-xp-container">
        <div class="reru-xp-labels">
          <span>Progress Level</span>
          <span>${reru.xp} / ${reru.maxXp} XP</span>
        </div>
        <div class="cat-bar-track">
          <div class="cat-bar-fill fill-xp" style="width: ${xpPercent}%;"></div>
        </div>
      </div>

      <!-- Stat Bars -->
      <div class="cat-stats-list">
        <div class="cat-stat-item">
          <span class="cat-stat-label">${isAngry ? '💢 Emosi' : '💖 Senang'}</span>
          <div class="cat-bar-track">
            <div class="cat-bar-fill ${isAngry ? 'fill-hunger' : 'fill-happy'}" style="width: ${reru.happiness}%;"></div>
          </div>
          <span class="cat-stat-val">${reru.happiness}%</span>
        </div>

        <div class="cat-stat-item">
          <span class="cat-stat-label">🐟 Kenyang</span>
          <div class="cat-bar-track">
            <div class="cat-bar-fill fill-hunger" style="width: ${reru.hunger}%;"></div>
          </div>
          <span class="cat-stat-val">${reru.hunger}%</span>
        </div>

        <div class="cat-stat-item">
          <span class="cat-stat-label">⚡ Energi</span>
          <div class="cat-bar-track">
            <div class="cat-bar-fill fill-energy" style="width: ${reru.energy}%;"></div>
          </div>
          <span class="cat-stat-val">${reru.energy}%</span>
        </div>
      </div>

      <!-- Action Buttons Grid (6 Buttons) -->
      <div class="reru-actions-grid" style="grid-template-columns: repeat(6, 1fr);">
        <button class="reru-act-btn" onclick="petReru(event)" title="Elus Reru (Bikin purr & senyum)">
          <span class="cat-btn-icon">🖐️</span>
          <span>Elus</span>
        </button>
        <button class="reru-act-btn" onclick="feedReru(event)" title="Kasih makan salmon segar">
          <span class="cat-btn-icon">🐟</span>
          <span>Salmon</span>
        </button>
        <button class="reru-act-btn" onclick="playWithReru(event)" title="Ajak main bola benang (Salto 3D!)">
          <span class="cat-btn-icon">🧶</span>
          <span>Main</span>
        </button>
        <button class="reru-act-btn" onclick="brushReru(event)" title="Sisir bulu oyen biar kinclong">
          <span class="cat-btn-icon">✨</span>
          <span>Sisir</span>
        </button>
        <button class="reru-act-btn" onclick="teaseReru(event)" title="Culik / Toel Reru (Awas ngamuk & hissing!)" style="border-color: #ef4444; color: #b91c1c;">
          <span class="cat-btn-icon">🤪</span>
          <span>Toel</span>
        </button>
        <button class="reru-act-btn" onclick="napReru(event)" title="Suruh Reru tidur siang">
          <span class="cat-btn-icon">💤</span>
          <span>Tidur</span>
        </button>
      </div>
    </div>
  `;

  attachReru3DParallax(cardContainer);
}

function attachReru3DParallax(card) {
  if (!card) return;
  card.onmousemove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -6; // -6deg to +6deg
    const rotY = ((x - centerX) / centerX) * 6;  // -6deg to +6deg

    card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;

    const img = document.getElementById('reruAvatarImg');
    if (img) {
      const offsetX = ((x - centerX) / centerX) * 4;
      const offsetY = ((y - centerY) / centerY) * 4;
      img.style.transform = `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px) scale(1.04)`;
    }
  };

  card.onmouseleave = () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    const img = document.getElementById('reruAvatarImg');
    if (img) img.style.transform = 'translate(0px, 0px) scale(1)';
  };
}

function triggerReruAnimation(animClass, durationMs = 600) {
  const wrap = document.getElementById('reruAvatarWrap');
  if (wrap) {
    wrap.classList.remove('reru-wiggle-anim', 'reru-spin-3d-anim', 'reru-chomp-anim', 'reru-purr-anim', 'reru-groom-anim');
    void wrap.offsetWidth; // force reflow
    wrap.classList.add(animClass);
    setTimeout(() => {
      if (wrap) wrap.classList.remove(animClass);
    }, durationMs);
  }
}

function tossToyToReru(emoji, startX, startY, callback) {
  const wrap = document.getElementById('reruAvatarWrap');
  if (!wrap) {
    if (callback) callback();
    return;
  }

  const targetRect = wrap.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  const toy = document.createElement('div');
  toy.className = 'flying-toy-item';
  toy.textContent = emoji;
  toy.style.left = `${startX - 15}px`;
  toy.style.top = `${startY - 15}px`;
  document.body.appendChild(toy);

  void toy.offsetWidth; // force reflow

  // Animate flight
  toy.style.transform = `translate(${targetX - startX}px, ${targetY - startY}px) scale(1.3) rotate(360deg)`;
  toy.style.opacity = '0.9';

  setTimeout(() => {
    toy.remove();
    spawnCelebrationSparkles(targetX, targetY);
    if (callback) callback();
  }, 480);
}

function interactReruDirect(event) {
  const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
  if (reru.mood === 'angry') {
    // If clicked while angry, hiss more!
    playSound('hiss');
    setTimeout(() => playSound('growl'), 150);
    reru.dialog = RERU_ANGRY_DIALOGS[Math.floor(Math.random() * RERU_ANGRY_DIALOGS.length)];
    setStorage(STORAGE_KEY_RERU, reru);
    renderReruCard();
    if (event && event.clientX) spawnFloatingHeartAt(event.clientX, event.clientY, '💢');
    showToast("Reru: HISSS! 😾💢 Masih kesel, jangan deket-deket!");
    return;
  }

  // Happy smiling meow
  petReru(event);
}

function petReru(event) {
  if (moodResetTimer) clearTimeout(moodResetTimer);

  playSound('purr');
  setTimeout(() => playSound('meow_cute'), 160);

  triggerReruAnimation('reru-purr-anim', 600);

  const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
  reru.mood = 'happy';
  reru.pokeCount = 0;
  reru.happiness = Math.min(100, reru.happiness + 8);
  reru.totalPets = (reru.totalPets || 0) + 1;
  addReruXp(reru, 15);

  reru.dialog = RERU_HAPPY_DIALOGS[Math.floor(Math.random() * RERU_HAPPY_DIALOGS.length)];
  setStorage(STORAGE_KEY_RERU, reru);
  renderReruCard();

  if (event && event.clientX) {
    spawnFloatingHeartAt(event.clientX, event.clientY, '💖');
    setTimeout(() => spawnFloatingHeartAt(event.clientX + 14, event.clientY - 14, '😸'), 120);
  }
  showToast("Elus Reru! Purrrr... 😸 Manja banget!");
}

function teaseReru(event) {
  if (moodResetTimer) clearTimeout(moodResetTimer);

  const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
  reru.pokeCount = (reru.pokeCount || 0) + 1;

  if (reru.pokeCount >= 2) {
    // Fierce angry hissing / galak mode
    playSound('hiss');
    setTimeout(() => playSound('growl'), 180);

    reru.mood = 'angry';
    reru.happiness = Math.max(20, reru.happiness - 15);
    reru.dialog = RERU_ANGRY_DIALOGS[Math.floor(Math.random() * RERU_ANGRY_DIALOGS.length)];
    setStorage(STORAGE_KEY_RERU, reru);
    renderReruCard();

    if (event && event.clientX) {
      spawnFloatingHeartAt(event.clientX, event.clientY, '💢');
      setTimeout(() => spawnFloatingHeartAt(event.clientX + 10, event.clientY - 15, '🔥'), 100);
      setTimeout(() => spawnFloatingHeartAt(event.clientX - 10, event.clientY - 20, '😾'), 200);
    }
    showToast("⚠️ Reru: HISSSS! 😾💢 Marah & Galak!");

    // Auto calm down after 6s if not poked
    moodResetTimer = setTimeout(() => {
      const current = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
      if (current.mood === 'angry') {
        current.mood = 'happy';
        current.pokeCount = 0;
        current.dialog = "Purrr... Dah reda nih emosi gue. Jangan iseng lagi ya babu! 🐾";
        setStorage(STORAGE_KEY_RERU, current);
        renderReruCard();
      }
    }, 6000);
  } else {
    // Annoyed warning poke
    playSound('growl');
    reru.mood = 'angry';
    reru.dialog = "Heh! Ngapain toel-toel? 😼 Jangan macam-macam lu!";
    setStorage(STORAGE_KEY_RERU, reru);
    renderReruCard();

    if (event && event.clientX) {
      spawnFloatingHeartAt(event.clientX, event.clientY, '⚡');
    }
    showToast("Reru: Grrr... Jangan jailin gue! 😼");
  }
}

function feedReru(event) {
  if (moodResetTimer) clearTimeout(moodResetTimer);

  const startX = event && event.clientX ? event.clientX : window.innerWidth / 2;
  const startY = event && event.clientY ? event.clientY : window.innerHeight / 2;

  tossToyToReru('🐟', startX, startY, () => {
    playSound('crunch');
    triggerReruAnimation('reru-chomp-anim', 600);

    const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
    reru.mood = 'happy';
    reru.pokeCount = 0;
    reru.hunger = Math.min(100, reru.hunger + 22);
    reru.happiness = Math.min(100, reru.happiness + 8);
    addReruXp(reru, 18);

    reru.dialog = "Nyam nyam krauk! 🐟 Nah gitu dong peka, lu babu teladan hari ini! 😸✨";
    setStorage(STORAGE_KEY_RERU, reru);
    renderReruCard();
    showToast("Ngasih salmon segar ke Reru! 🐟✨");
  });
}

function playWithReru(event) {
  if (moodResetTimer) clearTimeout(moodResetTimer);

  const startX = event && event.clientX ? event.clientX : window.innerWidth / 2;
  const startY = event && event.clientY ? event.clientY : window.innerHeight / 2;

  tossToyToReru('🧶', startX, startY, () => {
    playSound('meow_playful');
    triggerReruAnimation('reru-spin-3d-anim', 750);

    const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
    reru.mood = 'playful';
    reru.pokeCount = 0;
    reru.happiness = Math.min(100, reru.happiness + 16);
    reru.energy = Math.max(10, reru.energy - 10);
    addReruXp(reru, 22);

    reru.dialog = RERU_PLAYFUL_DIALOGS[Math.floor(Math.random() * RERU_PLAYFUL_DIALOGS.length)];
    setStorage(STORAGE_KEY_RERU, reru);
    renderReruCard();

    spawnBubbleBurstAt(startX, startY);
    showToast("Main bola benang bareng Reru! 🧶🐾 Salto 3D!");
  });
}

function brushReru(event) {
  if (moodResetTimer) clearTimeout(moodResetTimer);
  playSound('purr');
  setTimeout(() => playSound('bubble'), 150);

  triggerReruAnimation('reru-groom-anim', 700);

  const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
  reru.mood = 'happy';
  reru.pokeCount = 0;
  reru.happiness = Math.min(100, reru.happiness + 10);
  reru.energy = Math.min(100, reru.energy + 10);
  addReruXp(reru, 14);

  reru.dialog = "Kinclong abis! ✨ Sekarang gue siap tebar pesona ke kucing tetangga 💅😼";
  setStorage(STORAGE_KEY_RERU, reru);
  renderReruCard();

  if (event && event.clientX) {
    spawnFloatingHeartAt(event.clientX, event.clientY, '✨');
    spawnFloatingHeartAt(event.clientX - 10, event.clientY - 20, '🌟');
  }
  showToast("Nyisir bulu oyen Reru sampe glowing ✨");
}

function napReru(event) {
  if (moodResetTimer) clearTimeout(moodResetTimer);
  playSound('snore');
  setTimeout(() => playSound('chime'), 400);

  const reru = getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA);
  reru.mood = 'sleepy';
  reru.pokeCount = 0;
  reru.energy = 100;
  reru.happiness = Math.min(100, reru.happiness + 8);
  addReruXp(reru, 12);

  reru.dialog = RERU_SLEEPY_DIALOGS[Math.floor(Math.random() * RERU_SLEEPY_DIALOGS.length)];
  setStorage(STORAGE_KEY_RERU, reru);
  renderReruCard();

  if (event && event.clientX) {
    spawnCelebrationSparkles(event.clientX, event.clientY);
    spawnFloatingHeartAt(event.clientX, event.clientY, '💤');
  }
  showToast("Reru bobo siang... Energi pulih 100% ⚡💤");
}

function addReruXp(reru, amount) {
  reru.xp += amount;
  if (reru.xp >= reru.maxXp) {
    reru.level += 1;
    reru.xp = reru.xp - reru.maxXp;
    reru.maxXp = Math.floor(reru.maxXp * 1.35);
    playSound('chime');
    showToast(`🎉 Reru naik ke Level ${reru.level}! ⭐`);
  }
}

function spawnFloatingHeartAt(clientX, clientY, emoji = '💖') {
  const heart = document.createElement('div');
  heart.className = 'popoff-particle';
  heart.textContent = emoji;
  heart.style.left = `${clientX - 10}px`;
  heart.style.top = `${clientY - 20}px`;
  heart.style.fontSize = '22px';
  heart.style.animation = 'popOffFly 0.9s ease-out forwards';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);
}

// ==================== REAL-TIME CLOUD LIVE SYNC (YUKI ↔ NATA) ====================
const STORAGE_KEY_SYNC_CONFIG = 'aero_cloud_sync_config_v1';
const OFFICIAL_RTDB_URL = 'https://yuta-os-f9a95-default-rtdb.asia-southeast1.firebasedatabase.app';
let firebaseApp = null;
let firebaseDb = null;
let cloudSyncListener = null;

const DEFAULT_SYNC_CONFIG = {
  enabled: true,
  roomId: 'yuta-space-2026',
  dbUrl: OFFICIAL_RTDB_URL
};

function getSyncConfig() {
  const cfg = getStorage(STORAGE_KEY_SYNC_CONFIG, DEFAULT_SYNC_CONFIG);
  return {
    enabled: cfg.enabled !== false,
    roomId: (cfg.roomId && cfg.roomId.trim()) ? cfg.roomId.trim() : DEFAULT_SYNC_CONFIG.roomId,
    dbUrl: (cfg.dbUrl && cfg.dbUrl.trim()) ? cfg.dbUrl.trim() : DEFAULT_SYNC_CONFIG.dbUrl
  };
}

function initCloudSync() {
  const config = getSyncConfig();
  updateSyncUIStatus(false, 'Menghubungkan ke Cloud...');

  if (!config.dbUrl || !config.roomId) {
    updateSyncUIStatus(false, 'Penyimpanan Lokal (Offline)');
    return;
  }

  connectFirebaseDatabase(config.dbUrl, config.roomId);
}

function connectFirebaseDatabase(dbUrl, roomId) {
  if (typeof firebase === 'undefined') {
    updateSyncUIStatus(false, 'SDK Firebase Tidak Termuat');
    return;
  }

  try {
    // Sanitize DB URL
    let cleanUrl = dbUrl.trim();
    if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl;
    if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);

    // Initialize or reuse app
    const appName = 'yutaSyncApp';
    try {
      firebaseApp = firebase.app(appName);
    } catch (_) {
      firebaseApp = firebase.initializeApp({ databaseURL: cleanUrl }, appName);
    }

    firebaseDb = firebase.database(firebaseApp);

    // Detach previous listener if any
    if (cloudSyncListener) {
      cloudSyncListener.off();
    }

    // Reference to shared room
    const cleanRoom = (roomId || 'yuta-space-2026').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const roomRef = firebaseDb.ref('yuta_spaces/' + cleanRoom);

    // Listen to real-time value changes
    cloudSyncListener = roomRef;
    roomRef.on('value', (snapshot) => {
      const remoteData = snapshot.val();
      if (!remoteData) {
        updateSyncUIStatus(true, `Live Sync Aktif: "${cleanRoom}" 🟢 (Kamar Baru)`);
        // If Cloud room is brand new & empty, push initial local data quietly
        forcePushToCloudQuiet(cleanRoom);
        return;
      }

      updateSyncUIStatus(true, `Live Sync Aktif: "${cleanRoom}" 🟢`);

      // Apply incoming updates
      applyRemoteData(remoteData);
    }, (err) => {
      console.warn('Firebase Sync Error:', err);
      updateSyncUIStatus(false, 'Gagal Menyambung: ' + (err.message || 'Izin ditolak'));
    });

    // Test connection ping
    firebaseDb.ref('.info/connected').on('value', (snap) => {
      if (snap.val() === true) {
        updateSyncUIStatus(true, `Live Sync Aktif: "${cleanRoom}" 🟢`);
      } else {
        updateSyncUIStatus(false, 'Mencoba Menyambung Ulang... 🟡');
      }
    });

  } catch (err) {
    console.error('Failed to init Firebase:', err);
    updateSyncUIStatus(false, 'Error: ' + err.message);
  }
}

function pushKeyToCloud(key, value) {
  if (!firebaseDb) return;
  const config = getSyncConfig();
  if (!config.dbUrl || !config.roomId) return;

  const cleanRoom = (config.roomId || 'yuta-space-2026').replace(/[^a-zA-Z0-9_\-]/g, '_');
  const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_');

  try {
    firebaseDb.ref(`yuta_spaces/${cleanRoom}/${safeKey}`).set({
      payload: value,
      updatedAt: Date.now(),
      sender: 'YuTa_Device'
    });
  } catch (e) {
    console.warn('Cloud Push Error:', e);
  }
}

function applyRemoteData(remoteData) {
  if (!remoteData || typeof remoteData !== 'object') return;

  isRemoteSyncing = true;
  let hasUpdatedAny = false;

  try {
    // Map remote keys to local storage keys
    const keyMap = {
      'aero_todos': STORAGE_KEYS.TODOS,
      'aero_reminders': STORAGE_KEYS.REMINDERS,
      'aero_notes': STORAGE_KEYS.NOTES,
      'aero_countdowns': STORAGE_KEYS.COUNTDOWNS,
      'aero_moods': STORAGE_KEYS.MOODS,
      'aero_reru_pet_v3': STORAGE_KEY_RERU
    };

    for (const [cloudKey, record] of Object.entries(remoteData)) {
      if (!record || typeof record !== 'object' || record.payload === undefined) continue;

      const localKey = keyMap[cloudKey] || cloudKey;
      const currentLocal = localStorage.getItem(localKey);
      const newPayloadJson = JSON.stringify(record.payload);

      if (currentLocal !== newPayloadJson) {
        localStorage.setItem(localKey, newPayloadJson);
        hasUpdatedAny = true;
      }
    }

    if (hasUpdatedAny) {
      ensureDayRoutines(selectedTodoDate);
      ensureDefaultReminders();
      ensureDefaultCountdowns();
      ensureDefaultNotes();

      // Re-render UI
      renderTodos();
      renderReminders();
      renderNotes();
      renderCountdowns();
      renderReruCard();
      if (typeof renderSchedule === 'function') {
        renderSchedule();
      } else if (typeof switchScheduleDay === 'function') {
        switchScheduleDay(activeScheduleDay);
      }

      playSound('chime');
      spawnCelebrationSparkles(window.innerWidth / 2, 80);
      showToast('✨ Update data baru masuk dari pasangan! (Live Sync)');
    }
  } catch (err) {
    console.warn('Apply Remote Data Error:', err);
  } finally {
    isRemoteSyncing = false;
  }
}

function updateSyncUIStatus(isConnected, message) {
  const pillText = document.getElementById('heroSyncPillText');
  if (pillText) {
    pillText.textContent = isConnected ? '🟢 Live Sync • Terhubung' : '☁️ Live Sync • Offline';
  }

  const card = document.getElementById('syncStatusCard');
  const title = document.getElementById('syncStatusTitle');
  const desc = document.getElementById('syncStatusDesc');
  const emoji = document.getElementById('syncStatusEmoji');

  if (card) {
    if (isConnected) {
      card.classList.add('connected');
      if (title) title.textContent = '🟢 Terhubung & Live (Real-Time)';
      if (emoji) emoji.textContent = '⚡';
    } else {
      card.classList.remove('connected');
      if (title) title.textContent = 'Penyimpanan Lokal (Offline)';
      if (emoji) emoji.textContent = '☁️';
    }
  }

  if (desc) desc.textContent = message;
}

function openCloudSyncModal() {
  const modal = document.getElementById('cloudSyncModal');
  if (!modal) return;

  const config = getSyncConfig();
  const roomInput = document.getElementById('syncRoomId');
  const dbUrlInput = document.getElementById('syncDbUrl');

  if (roomInput) roomInput.value = config.roomId || 'yuta-space-2026';
  if (dbUrlInput) dbUrlInput.value = config.dbUrl || '';

  modal.classList.add('open');
  playSound('bubble');
}

function saveAndConnectCloudSync() {
  const roomInput = document.getElementById('syncRoomId');
  const dbUrlInput = document.getElementById('syncDbUrl');

  const roomId = roomInput ? roomInput.value.trim() : 'yuta-space-2026';
  const dbUrl = dbUrlInput ? dbUrlInput.value.trim() : '';

  if (!dbUrl) {
    showToast('⚠️ Masukkan Firebase Database URL terlebih dahulu!');
    return;
  }

  const config = {
    enabled: true,
    roomId: roomId || 'yuta-space-2026',
    dbUrl: dbUrl
  };

  setStorage(STORAGE_KEY_SYNC_CONFIG, config);
  connectFirebaseDatabase(dbUrl, config.roomId);
  showToast('🔗 Menyambungkan ke Cloud Database...');
}

function forcePushToCloud() {
  if (!firebaseDb) {
    showToast('⚠️ Sambungkan Firebase terlebih dahulu sebelum Push!');
    return;
  }

  const config = getSyncConfig();
  const cleanRoom = (config.roomId || 'yuta-space-2026').replace(/[^a-zA-Z0-9_\-]/g, '_');

  const fullData = {
    'aero_todos': { payload: getStorage(STORAGE_KEYS.TODOS, {}), updatedAt: Date.now() },
    'aero_reminders': { payload: getStorage(STORAGE_KEYS.REMINDERS, []), updatedAt: Date.now() },
    'aero_notes': { payload: getStorage(STORAGE_KEYS.NOTES, []), updatedAt: Date.now() },
    'aero_countdowns': { payload: getStorage(STORAGE_KEYS.COUNTDOWNS, []), updatedAt: Date.now() },
    'aero_moods': { payload: getStorage(STORAGE_KEYS.MOODS, {}), updatedAt: Date.now() },
    'aero_reru_pet_v3': { payload: getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA), updatedAt: Date.now() }
  };

  firebaseDb.ref('yuta_spaces/' + cleanRoom).set(fullData).then(() => {
    playSound('chime');
    showToast('⬆️ Berhasil mengunggah semua data lokal ke Cloud!');
  }).catch((err) => {
    showToast('❌ Gagal upload ke Cloud: ' + err.message);
  });
}

function forcePushToCloudQuiet(cleanRoom) {
  if (!firebaseDb || !cleanRoom) return;
  const fullData = {
    'aero_todos': { payload: getStorage(STORAGE_KEYS.TODOS, {}), updatedAt: Date.now() },
    'aero_reminders': { payload: getStorage(STORAGE_KEYS.REMINDERS, []), updatedAt: Date.now() },
    'aero_notes': { payload: getStorage(STORAGE_KEYS.NOTES, []), updatedAt: Date.now() },
    'aero_countdowns': { payload: getStorage(STORAGE_KEYS.COUNTDOWNS, []), updatedAt: Date.now() },
    'aero_moods': { payload: getStorage(STORAGE_KEYS.MOODS, {}), updatedAt: Date.now() },
    'aero_reru_pet_v3': { payload: getStorage(STORAGE_KEY_RERU, DEFAULT_RERU_DATA), updatedAt: Date.now() }
  };
  try {
    firebaseDb.ref('yuta_spaces/' + cleanRoom).set(fullData);
  } catch (_) {}
}

function forcePullFromCloud() {
  if (!firebaseDb) {
    showToast('⚠️ Sambungkan Firebase terlebih dahulu sebelum Pull!');
    return;
  }

  const config = getSyncConfig();
  const cleanRoom = (config.roomId || 'yuta-space-2026').replace(/[^a-zA-Z0-9_\-]/g, '_');

  firebaseDb.ref('yuta_spaces/' + cleanRoom).once('value').then((snap) => {
    const data = snap.val();
    if (!data) {
      showToast('⚠️ Belum ada data di Cloud untuk kamar ini.');
      return;
    }
    applyRemoteData(data);
    playSound('chime');
    showToast('⬇️ Berhasil menarik data terbaru dari Cloud!');
  }).catch((err) => {
    showToast('❌ Gagal download dari Cloud: ' + err.message);
  });
}

// Global exposures
window.openCloudSyncModal = openCloudSyncModal;
window.saveAndConnectCloudSync = saveAndConnectCloudSync;
window.forcePushToCloud = forcePushToCloud;
window.forcePullFromCloud = forcePullFromCloud;
window.pushKeyToCloud = pushKeyToCloud;
window.interactReruDirect = interactReruDirect;
window.petReru = petReru;
window.teaseReru = teaseReru;
window.feedReru = feedReru;
window.playWithReru = playWithReru;
window.brushReru = brushReru;
window.napReru = napReru;
window.feedAllCats = feedReru;
window.petAllCats = petReru;
window.petCat = petReru;
window.feedCat = feedReru;
window.loadNataRoutine = loadNataRoutine;
window.loadYukiRoutine = loadYukiRoutine;
window.openGCalSyncModal = openGCalSyncModal;
window.syncEventToGoogleCalendar = syncEventToGoogleCalendar;
window.downloadLifetimeICS = downloadLifetimeICS;

// ==================== GOOGLE CALENDAR LIFETIME SYNC ====================

function openGCalSyncModal() {
  const modal = document.getElementById('gcalSyncModal');
  if (modal) {
    modal.classList.add('open');
    modal.classList.add('active');
    playSound('chime');
  }
}

function generateGoogleCalendarUrl(title, details, startDateIso, endDateIso, recurRule = '') {
  const formatGCalDate = (dateStr) => dateStr.replace(/[-:]/g, '');
  const startFormatted = formatGCalDate(startDateIso);
  const endFormatted = formatGCalDate(endDateIso);

  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(details)}`;
  if (recurRule) {
    url += `&recur=${encodeURIComponent(recurRule)}`;
  }
  return url;
}

function syncEventToGoogleCalendar(type) {
  let url = '';
  switch (type) {
    case 'anniversary':
      url = generateGoogleCalendarUrl(
        '💍 Our Anniversary (Yuki & Nata) 💖',
        'Happy Anniversary Yuki & Nata! 💖 Special lifetime love milestone and celebration.',
        '20260217T090000',
        '20260217T110000',
        'RRULE:FREQ=YEARLY'
      );
      break;

    case 'yuki_bday':
      url = generateGoogleCalendarUrl(
        '🎂 Yuki\'s Birthday 🐱🎉',
        'Happy Birthday Yuki! Wishing a fantastic year filled with joy and success.',
        '20261023T090000',
        '20261023T110000',
        'RRULE:FREQ=YEARLY'
      );
      break;

    case 'nata_bday':
      url = generateGoogleCalendarUrl(
        '🎂 Nata\'s Birthday 🐈‍⬛🌸',
        'Happy Birthday Nata! Wishing endless happiness, health and love.',
        '20260924T090000',
        '20260924T110000',
        'RRULE:FREQ=YEARLY'
      );
      break;

    case 'yuki_routine':
      url = generateGoogleCalendarUrl(
        '🐱 Yuki Daily Routine: 4 Quests 💻📚✍️💼',
        'Yuki\'s Daily Quests:\n1. 💻 Open LMS & check courses\n2. 📚 Work on assignments\n3. ✍️ Work on thesis\n4. 💼 Job hunting & applications',
        '20261004T080000',
        '20261004T180000',
        'RRULE:FREQ=DAILY'
      );
      break;

    case 'nata_routine':
      url = generateGoogleCalendarUrl(
        '🐈‍⬛ Nata Daily Routine: 4 Quests 💬📹📊⏰',
        'Nata\'s Daily Quests:\n1. 💬 Reply to spenders\n2. 📹 Daily 1-hour stream before dual persona stream\n3. 📊 Send live stream report to group\n4. ⏰ Clock-in & clock-out attendance',
        '20261004T170000',
        '20261004T210000',
        'RRULE:FREQ=DAILY'
      );
      break;

    case 'duo_date':
      url = generateGoogleCalendarUrl(
        '🍿 YuTa Date Night & Cozy Time 💖✨',
        'Weekly date night, movies, cuddle time & quality moments together.',
        '20261010T190000',
        '20261010T220000',
        'RRULE:FREQ=WEEKLY'
      );
      break;

    default:
      showToast('⚠️ Event type not recognized');
      return;
  }

  playSound('bubble');
  window.open(url, '_blank');
  showToast('📅 Buka Google Calendar...');
}

function downloadLifetimeICS() {
  const now = new Date();
  const formatICSStamp = (d) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  const stamp = formatICSStamp(now);

  let icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//YuTa Aero OS//Lifetime Couple Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:YuTa Couple & Routine (Lifetime)',
    'X-WR-TIMEZONE:Asia/Jakarta'
  ];

  const addICSEvent = (uid, summary, description, startIso, endIso, rrule) => {
    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${uid}@yuta.space`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`
    );
    if (rrule) {
      icsLines.push(`RRULE:${rrule}`);
    }
    icsLines.push(
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${summary}`,
      'END:VALARM',
      'END:VEVENT'
    );
  };

  // 1. Anniversary
  addICSEvent('anniv_20260217', '💍 Our Anniversary (Yuki & Nata) 💖', 'Happy Anniversary Yuki & Nata! Lifetime love milestone and celebration.', '20260217T090000', '20260217T110000', 'FREQ=YEARLY');

  // 2. Yuki Birthday
  addICSEvent('bday_yuki', '🎂 Yuki\'s Birthday 🐱🎉', 'Happy Birthday Yuki! Wishing you joy and blessings.', '20261023T090000', '20261023T110000', 'FREQ=YEARLY');

  // 3. Nata Birthday
  addICSEvent('bday_nata', '🎂 Nata\'s Birthday 🐈‍⬛🌸', 'Happy Birthday Nata! Wishing you endless happiness and love.', '20260924T090000', '20260924T110000', 'FREQ=YEARLY');

  // 4. Yuki\'s 4 Quests (Daily)
  addICSEvent('yuki_lms', '💻 Yuki: Open LMS & Check Courses', 'Daily Quest: Open LMS, check materials and course announcements.', '20261004T080000', '20261004T083000', 'FREQ=DAILY');
  addICSEvent('yuki_tugas', '📚 Yuki: Work on Assignments', 'Daily Quest: Complete coursework and study tasks.', '20261004T090000', '20261004T103000', 'FREQ=DAILY');
  addICSEvent('yuki_skripsi', '✍️ Yuki: Work on Thesis', 'Daily Quest: Research, draft writing, and thesis progress.', '20261004T130000', '20261004T150000', 'FREQ=DAILY');
  addICSEvent('yuki_kerja', '💼 Yuki: Job Hunting & Applications', 'Daily Quest: Apply for jobs and submit applications.', '20261004T160000', '20261004T173000', 'FREQ=DAILY');

  // 5. Nata\'s 4 Quests (Daily)
  addICSEvent('nata_spender', '💬 Nata: Reply to Spenders', 'Daily Quest: Reply to messages and spenders.', '20261004T163000', '20261004T173000', 'FREQ=DAILY');
  addICSEvent('nata_live', '📹 Nata: Daily 1-Hour Stream', 'Daily Quest: 1-hour live stream before dual persona stream.', '20261004T180000', '20261004T190000', 'FREQ=DAILY');
  addICSEvent('nata_laporan', '📊 Nata: Send Stream Report to Group', 'Daily Quest: Submit daily live stream report to group.', '20261004T200000', '20261004T201500', 'FREQ=DAILY');
  addICSEvent('nata_absen', '⏰ Nata: Clock-in & Attendance', 'Daily Quest: Clock-in & clock-out attendance.', '20261004T210000', '20261004T211500', 'FREQ=DAILY');

  // 6. Duo Weekly Date & Care
  addICSEvent('duo_date_weekly', '🍿 YuTa Weekly Date Night ✨', 'Cozy date night, movies, and quality time together.', '20261010T190000', '20261010T220000', 'FREQ=WEEKLY');
  addICSEvent('duo_laundry_weekly', '🧺 YuTa Weekly Laundry 🫧', 'Weekly laundry routine.', '20261011T100000', '20261011T120000', 'FREQ=WEEKLY');

  // 7. Grounding & Wellness reminders
  addICSEvent('ground_eat', '🥗 Gentle Reminder: Eat Regularly', 'Skipping meals isn’t discipline. Fuel your body with nutritious food.', '20261004T123000', '20261004T130000', 'FREQ=DAILY');
  addICSEvent('ground_rest', '🧘 Gentle Reminder: Don’t Overpush Work', 'Burnout helps no one. Rest is productive and necessary.', '20261004T213000', '20261004T220000', 'FREQ=DAILY');

  icsLines.push('END:VCALENDAR');

  const icsData = icsLines.join('\r\n');
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'YuTa_Couple_Calendar_Lifetime.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  playSound('chime');
  showToast('📥 Berhasil download YuTa_Couple_Calendar_Lifetime.ics!');
}

// ==================== TWO-WAY GOOGLE CALENDAR IMPORT ====================

const GCAL_LINKS = {
  yuki: 'https://calendar.google.com/calendar/ical/yukiekiyoshi123%40gmail.com/private-e1832b466c6cf6e5b6d9673f5b695038/basic.ics',
  nata: 'https://calendar.google.com/calendar/ical/heavcnlyours%40gmail.com/private-7f8ac755df1e414b14a30ec528881b66/basic.ics'
};

const GCAL_LOCAL_FILES = {
  yuki: 'gcal_yuki.ics',
  nata: 'gcal_nata.ics'
};

function parseAndApplyICS(icsText, target = 'yuki') {
  if (!icsText || typeof icsText !== 'string') {
    showToast('⚠️ File / data iCal kosong atau tidak valid.');
    return;
  }

  const lines = icsText.split(String.fromCharCode(10));
  const events = [];
  let curEvent = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('	'))) {
      line += lines[i + 1].slice(1);
      i++;
    }

    if (line.startsWith('BEGIN:VEVENT')) {
      curEvent = { summary: '', desc: '', dtstart: '', dtend: '', rrule: '', dateStr: '', endDateStr: '' };
    } else if (line.startsWith('END:VEVENT')) {
      if (curEvent && curEvent.summary) {
        if (curEvent.dtstart) {
          const cleanDt = curEvent.dtstart.replace(/[^0-9]/g, '');
          if (cleanDt.length >= 8) {
            curEvent.dateStr = cleanDt.substring(0, 4) + '-' + cleanDt.substring(4, 6) + '-' + cleanDt.substring(6, 8);
          }
        }
        if (curEvent.dtend) {
          const cleanEnd = curEvent.dtend.replace(/[^0-9]/g, '');
          if (cleanEnd.length >= 8) {
            curEvent.endDateStr = cleanEnd.substring(0, 4) + '-' + cleanEnd.substring(4, 6) + '-' + cleanEnd.substring(6, 8);
          }
        }
        events.push(curEvent);
      }
      curEvent = null;
    } else if (curEvent) {
      if (line.startsWith('SUMMARY:')) {
        curEvent.summary = line.substring(8).replace(/\,/g, ',').replace(/\;/g, ';').replace(/\n/g, ' ').trim();
      } else if (line.startsWith('DESCRIPTION:')) {
        curEvent.desc = line.substring(12).replace(/\,/g, ',').replace(/\;/g, ';').replace(/\n/g, ' ').trim();
      } else if (line.startsWith('DTSTART')) {
        const parts = line.split(':');
        if (parts.length > 1) curEvent.dtstart = parts[parts.length - 1].trim();
      } else if (line.startsWith('DTEND')) {
        const parts = line.split(':');
        if (parts.length > 1) curEvent.dtend = parts[parts.length - 1].trim();
      } else if (line.startsWith('RRULE:')) {
        curEvent.rrule = line.substring(6).trim();
      }
    }
  }

  if (events.length === 0) {
    showToast('⚠️ Tidak ada jadwal yang ditemukan di data iCal.');
    return;
  }

  const data = getStorage(STORAGE_KEYS.TODOS, {});
  const validTarget = ['yuki', 'nata', 'shared'].includes(target) ? target : 'yuki';

  // Clean out any old/mismatched gcal tasks from all dates to strictly align
  Object.keys(data).forEach(d => {
    if (data[d] && Array.isArray(data[d][validTarget])) {
      data[d][validTarget] = data[d][validTarget].filter(t => !t.id.startsWith('gcal_'));
    }
  });

  let totalMatched = 0;

  events.forEach((ev, idx) => {
    if (!ev.dateStr) return;

    // Put task ONLY on its exact date
    const targetDate = ev.dateStr;
    if (!data[targetDate]) {
      data[targetDate] = { yuki: [], nata: [], shared: [] };
    }
    if (!Array.isArray(data[targetDate][validTarget])) {
      data[targetDate][validTarget] = [];
    }

    const taskTitle = '📅 ' + ev.summary;
    const exists = data[targetDate][validTarget].some(t => t.text.toLowerCase() === taskTitle.toLowerCase());
    if (!exists) {
      data[targetDate][validTarget].push({
        id: 'gcal_' + Date.now() + '_' + idx,
        text: taskTitle,
        done: false
      });
      totalMatched++;
    }
  });

  setStorage(STORAGE_KEYS.TODOS, data);
  renderTodos();

  if (typeof pushKeyToCloud === 'function') {
    pushKeyToCloud(STORAGE_KEYS.TODOS);
  }

  const curDayCount = (data[selectedTodoDate] && data[selectedTodoDate][validTarget]) 
    ? data[selectedTodoDate][validTarget].filter(t => t.id.startsWith('gcal_')).length 
    : 0;

  playSound('chime');
  showToast();
}

async function fetchCalendarICS(owner = 'yuki') {
  const url = GCAL_LINKS[owner] || GCAL_LINKS.yuki;
  const localFile = GCAL_LOCAL_FILES[owner] || 'gcal_yuki.ics';

  const endpoints = [
    localFile,
    url,
    'https://corsproxy.io/?url=' + encodeURIComponent(url),
    'https://api.allorigins.win/raw?url=' + encodeURIComponent(url),
    'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url)
  ];

  for (const ep of endpoints) {
    try {
      const resp = await fetch(ep, { cache: 'no-store' });
      if (resp.ok) {
        const text = await resp.text();
        if (text && text.includes('BEGIN:VCALENDAR')) {
          return text;
        }
      }
    } catch (e) {}
  }
  return null;
}

async function syncYukiGCal() {
  showToast('⏳ Mengambil jadwal Google Calendar Yuki...');
  const ics = await fetchCalendarICS('yuki');
  if (ics) {
    parseAndApplyICS(ics, 'yuki');
  } else {
    showToast('❌ Gagal mengambil kalender Yuki.');
  }
}

async function syncNataGCal() {
  showToast('⏳ Mengambil jadwal Google Calendar Nata...');
  const ics = await fetchCalendarICS('nata');
  if (ics) {
    parseAndApplyICS(ics, 'nata');
  } else {
    showToast('❌ Gagal mengambil kalender Nata.');
  }
}

async function syncBothGCal() {
  showToast('⏳ Menyelaraskan Google Calendar Yuki & Nata...');
  const [yukiIcs, nataIcs] = await Promise.all([
    fetchCalendarICS('yuki'),
    fetchCalendarICS('nata')
  ]);

  if (yukiIcs) parseAndApplyICS(yukiIcs, 'yuki');
  if (nataIcs) parseAndApplyICS(nataIcs, 'nata');

  if (yukiIcs || nataIcs) {
    playSound('chime');
    showToast('🎉 Sukses sinkronisasi Google Calendar Yuki 🐱 & Nata 🐈‍⬛!');
  } else {
    showToast('⚠️ Gagal mengambil jadwal Google Calendar.');
  }
}

function handleGCalFileImport(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const target = document.getElementById('gcalImportTarget') ? document.getElementById('gcalImportTarget').value : 'yuki';
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    parseAndApplyICS(text, target);
    event.target.value = '';
  };
  reader.readAsText(file);
}

async function importFromGCalUrl() {
  const target = document.getElementById('gcalImportTarget') ? document.getElementById('gcalImportTarget').value : 'yuki';
  if (target === 'nata') {
    await syncNataGCal();
  } else if (target === 'yuki') {
    await syncYukiGCal();
  } else {
    await syncBothGCal();
  }
}

// Bind to window
window.handleGCalFileImport = handleGCalFileImport;
window.importFromGCalUrl = importFromGCalUrl;
window.parseAndApplyICS = parseAndApplyICS;
window.syncYukiGCal = syncYukiGCal;
window.syncNataGCal = syncNataGCal;
window.syncBothGCal = syncBothGCal;
