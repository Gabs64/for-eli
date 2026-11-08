/**
 * VIRTUAL NOTE JAR - AUDIO MANAGER
 * -------------------------------------------------------------
 * Provides background music and realistic interactive sound effects
 * using HTML5 Audio with an automatic Web Audio API procedural synthesizer
 * fallback so the app sounds magical even without external mp3 files.
 */

(function () {
  const AudioManager = {
    audioContext: null,
    isMuted: false,
    bgMusicPlaying: false,
    externalAudio: null,
    synthLoopTimer: null,
    chordIndex: 0,

    init: function () {
      const config = window.NOTE_JAR_CONFIG?.audio || {};
      const savedState = window.StorageManager ? window.StorageManager.getState() : {};
      this.isMuted = Boolean(savedState.audioMuted);

      // Attempt to load external background music if configured
      if (config.backgroundMusicUrl) {
        try {
          this.externalAudio = new Audio(config.backgroundMusicUrl);
          this.externalAudio.loop = true;
          this.externalAudio.volume = config.musicVolume || 0.35;
          // Catch missing file errors gracefully
          this.externalAudio.addEventListener("error", () => {
            console.info("External background music file not found, using procedural ambient synthesizer.");
            this.externalAudio = null;
          });
        } catch (e) {
          this.externalAudio = null;
        }
      }

      this.updateUI();
    },

    /**
     * Ensure AudioContext is initialized and unlocked on user interaction
     */
    getAudioContext: function () {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
        }
      }
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume().catch(() => {});
      }
      return this.audioContext;
    },

    /**
     * Toggle Mute / Sound state
     */
    toggleMute: function () {
      this.isMuted = !this.isMuted;
      if (window.StorageManager) {
        const state = window.StorageManager.getState();
        state.audioMuted = this.isMuted;
        window.StorageManager.saveState(state);
      }

      if (this.isMuted) {
        this.pauseBackgroundMusic();
      } else {
        this.playBackgroundMusic();
      }

      this.updateUI();
      return this.isMuted;
    },

    updateUI: function () {
      const btn = document.getElementById("audio-toggle-btn");
      if (!btn) return;
      const icon = btn.querySelector(".audio-icon");
      const label = btn.querySelector(".audio-label");

      if (this.isMuted) {
        btn.classList.add("is-muted");
        btn.setAttribute("aria-label", "Turn sound on");
        if (icon) icon.textContent = "🔇";
        if (label) label.textContent = "Sound Off";
      } else {
        btn.classList.remove("is-muted");
        btn.setAttribute("aria-label", "Mute sound");
        if (icon) icon.textContent = "🎵";
        if (label) label.textContent = "Sound On";
      }
    },

    /**
     * Start Background Music
     */
    playBackgroundMusic: function () {
      if (this.isMuted) return;

      const config = window.NOTE_JAR_CONFIG?.audio || {};
      if (config.enabled === false) return;

      // If real audio file is loaded and playable
      if (this.externalAudio && !this.externalAudio.error) {
        this.externalAudio.play().then(() => {
          this.bgMusicPlaying = true;
        }).catch(() => {
          // If browser blocked or file missing, fallback to procedural ambient
          this.startProceduralAmbient();
        });
      } else {
        this.startProceduralAmbient();
      }
    },

    pauseBackgroundMusic: function () {
      if (this.externalAudio) {
        this.externalAudio.pause();
      }
      if (this.synthLoopTimer) {
        clearTimeout(this.synthLoopTimer);
        this.synthLoopTimer = null;
      }
      this.bgMusicPlaying = false;
    },

    /**
     * Procedural Ambient Lullaby / Music Box chords generator
     * Creates warm, gentle, dreamy Rhodes/Kalimba chords
     */
    startProceduralAmbient: function () {
      if (this.synthLoopTimer) return; // already running
      if (this.isMuted) return;

      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.bgMusicPlaying = true;

      // Chord progression in C Major / A Minor pentatonic (warm, comforting, romantic)
      // Cmaj7 -> Fmaj7 -> Am7 -> Gsus4
      const chords = [
        [261.63, 329.63, 392.0, 493.88], // C, E, G, B (Cmaj7)
        [349.23, 440.0, 523.25, 659.25], // F, A, C, E (Fmaj7)
        [220.0, 261.63, 329.63, 392.0],  // A, C, E, G (Am7)
        [392.0, 493.88, 523.25, 587.33], // G, B, C, D (Gsus)
      ];

      const playChordStep = () => {
        if (!this.bgMusicPlaying || this.isMuted) return;

        const chord = chords[this.chordIndex % chords.length];
        this.chordIndex++;

        // Stagger notes like a delicate harp or music box
        chord.forEach((freq, i) => {
          const delay = i * 0.18;
          this.playBellTone(freq, 2.2, 0.04, delay);
        });

        // Loop next chord in 3.6 seconds
        this.synthLoopTimer = setTimeout(playChordStep, 3600);
      };

      playChordStep();
    },

    playBellTone: function (freq, duration = 1.8, volume = 0.05, delay = 0) {
      const ctx = this.getAudioContext();
      if (!ctx || this.isMuted) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      // Gentle bell envelope
      const startTime = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    },

    // ==========================================
    // SOUND EFFECTS
    // ==========================================

    /**
     * Soft paper rustle / note extraction sound
     */
    playPaperExtractSound: function () {
      if (this.isMuted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      // Delicate filtered noise rustle + soft upward chime
      try {
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.2);
        filter.Q.value = 2;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noise.stop(ctx.currentTime + 0.22);

        // Soft chime
        this.playBellTone(587.33, 0.4, 0.03, 0.05); // D5
        this.playBellTone(880.0, 0.5, 0.03, 0.1);  // A5
      } catch (e) {
        // Safe fail
      }
    },

    /**
     * Note unfolding sound - soft gentle chime
     */
    playUnfoldSound: function () {
      if (this.isMuted) return;
      this.playBellTone(523.25, 0.8, 0.05, 0);    // C5
      this.playBellTone(659.25, 0.9, 0.05, 0.08); // E5
      this.playBellTone(783.99, 1.1, 0.06, 0.16); // G5
      this.playBellTone(1046.5, 1.3, 0.04, 0.24); // C6
    },

    /**
     * Soft pop when note is closed
     */
    playPopSound: function () {
      if (this.isMuted) return;
      const ctx = this.getAudioContext();
      if (!ctx) return;

      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } catch (e) {}
    },

    /**
     * Special magical sparkle sound during the Final Reveal
     */
    playFinalRevealSound: function () {
      if (this.isMuted) return;
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        this.playBellTone(freq, 2.0, 0.08, idx * 0.12);
      });
    },
  };

  window.AudioManager = AudioManager;
})();

