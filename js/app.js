/**
 * VIRTUAL NOTE JAR - MAIN APPLICATION CONTROLLER
 * -------------------------------------------------------------
 * Initializes all components, coordinates state transitions,
 * floating particle backgrounds, progress updates, and user events.
 */

document.addEventListener("DOMContentLoaded", () => {
  const App = {
    init: function () {
      console.log("Initializing Virtual Note Jar...");

      // Apply site metadata
      this.applyConfig();

      // Initialize subsystems
      if (window.StateManager) window.StateManager.init();
      if (window.AudioManager) window.AudioManager.init();
      if (window.JarManager) window.JarManager.init();
      if (window.NotesModalManager) window.NotesModalManager.init();

      // Setup UI & Listeners
      this.bindUIEvents();
      this.subscribeToState();
      this.initBackgroundParticles();
      this.checkReducedMotion();

      // Check initial screen routing (welcome vs jar)
      this.renderScreenState();
      this.updateProgressUI();
    },

    /**
     * Apply configuration texts and titles to DOM
     */
    applyConfig: function () {
      const config = window.NOTE_JAR_CONFIG || {};

      // Window title
      if (config.meta?.siteTitle) {
        document.title = config.meta.siteTitle;
      }

      // Welcome Screen Texts
      const wBadge = document.getElementById("welcome-badge");
      const wTitle = document.getElementById("welcome-title");
      const wSubtitle = document.getElementById("welcome-subtitle");
      const wMsg = document.getElementById("welcome-message");
      const wBtn = document.getElementById("welcome-start-btn");

      if (wBadge && config.welcome?.badge) wBadge.textContent = config.welcome.badge;
      if (wTitle && config.welcome?.title) wTitle.textContent = config.welcome.title;
      if (wSubtitle && config.welcome?.subtitle) wSubtitle.textContent = config.welcome.subtitle;
      if (wMsg && config.welcome?.message) wMsg.textContent = config.welcome.message;
      if (wBtn && config.welcome?.buttonText) wBtn.innerHTML = `<span>${config.welcome.buttonText}</span>`;

      // Header sender name
      const headerTitle = document.getElementById("header-jar-title");
      if (headerTitle && config.meta?.senderName) {
        headerTitle.textContent = `${config.meta.senderName}'s Note Jar`;
      }
    },

    /**
     * Bind primary user interaction triggers
     */
    bindUIEvents: function () {
      // Start button on welcome screen
      const startBtn = document.getElementById("welcome-start-btn");
      if (startBtn) {
        startBtn.addEventListener("click", () => {
          if (window.AudioManager) {
            window.AudioManager.playBackgroundMusic();
            window.AudioManager.playPopSound();
          }
          window.StateManager.startExperience();
        });
      }

      // Audio mute/unmute toggle button
      const audioBtn = document.getElementById("audio-toggle-btn");
      if (audioBtn) {
        audioBtn.addEventListener("click", () => {
          if (window.AudioManager) {
            window.AudioManager.toggleMute();
          }
        });
      }

      // Reset jar button
      const resetBtn = document.getElementById("reset-jar-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          const ok = confirm("Are you sure you want to reset your jar? This will fold all notes back inside.");
          if (ok) {
            window.StateManager.resetProgress();
          }
        });
      }
    },

    /**
     * Subscribe to state updates
     */
    subscribeToState: function () {
      window.StateManager.subscribe((event, payload, state) => {
        switch (event) {
          case "started":
            this.renderScreenState();
            this.updateProgressUI();
            if (window.JarManager) {
              window.JarManager.renderNotesInJar();
              window.JarManager.updateJarState();
            }
            break;

          case "progressUpdated":
          case "noteOpened":
            this.updateProgressUI();
            if (window.JarManager) {
              window.JarManager.renderNotesInJar();
              window.JarManager.updateJarState();
            }
            break;

          case "finalUnlocked":
            this.updateProgressUI();
            if (window.JarManager) {
              window.JarManager.renderNotesInJar();
              window.JarManager.updateJarState();
            }
            // Sparkle pulse effect
            if (window.NotesModalManager) {
              window.NotesModalManager.triggerConfetti();
            }
            break;

          case "finalNoteOpened":
            this.updateProgressUI();
            if (window.JarManager) {
              window.JarManager.updateJarState();
            }
            break;

          case "reset":
            this.renderScreenState();
            this.updateProgressUI();
            if (window.JarManager) {
              window.JarManager.renderNotesInJar();
              window.JarManager.updateJarState();
            }
            break;
        }
      });
    },

    /**
     * Switch between Welcome view and Jar view
     */
    renderScreenState: function () {
      const state = window.StateManager.state;
      const welcomeScreen = document.getElementById("welcome-screen");
      const mainAppScreen = document.getElementById("main-jar-app");

      if (!welcomeScreen || !mainAppScreen) return;

      if (!state.hasStarted) {
        welcomeScreen.classList.remove("screen-hidden");
        mainAppScreen.classList.add("screen-hidden");
      } else {
        welcomeScreen.classList.add("screen-hidden");
        mainAppScreen.classList.remove("screen-hidden");
      }
    },

    /**
     * Update progress numbers, progress bar width, and status label
     */
    updateProgressUI: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      const regularNotes = config.notes || [];
      const totalRegular = regularNotes.length;
      const openedCount = window.StateManager.getOpenedRegularNotes().length;
      const state = window.StateManager.state;

      const countElem = document.getElementById("progress-count-text");
      const barFillElem = document.getElementById("progress-bar-fill");
      const statusPillElem = document.getElementById("progress-status-pill");

      // Calculate percentage of regular notes (0 to 100%)
      const percent = totalRegular > 0 ? Math.min(100, Math.round((openedCount / totalRegular) * 100)) : 0;

      if (countElem) {
        countElem.textContent = `${openedCount} of ${totalRegular} notes opened`;
      }

      if (barFillElem) {
        barFillElem.style.width = `${percent}%`;
        barFillElem.setAttribute("aria-valuenow", percent);
      }

      if (statusPillElem) {
        if (state.isFinalOpened) {
          statusPillElem.textContent = "All read";
          statusPillElem.className = "progress-status-pill pill-completed";
        } else if (state.isFinalUnlocked) {
          statusPillElem.textContent = "1 note left";
          statusPillElem.className = "progress-status-pill pill-final-unlocked";
        } else if (openedCount > 0) {
          const left = totalRegular - openedCount;
          statusPillElem.textContent = `${left} ${left === 1 ? "note" : "notes"} left`;
          statusPillElem.className = "progress-status-pill pill-in-progress";
        } else {
          statusPillElem.textContent = `${totalRegular} notes inside`;
          statusPillElem.className = "progress-status-pill pill-ready";
        }
      }

      // Update badge count on opened notes button
      const openedBadge = document.getElementById("opened-notes-count-badge");
      if (openedBadge) {
        const totalOpened = openedCount + (state.isFinalOpened ? 1 : 0);
        openedBadge.textContent = totalOpened;
        openedBadge.style.display = totalOpened > 0 ? "inline-flex" : "none";
      }
    },

    /**
     * Ambient floating background hearts and gentle light particles
     */
    initBackgroundParticles: function () {
      const bgContainer = document.getElementById("floating-bg-particles");
      if (!bgContainer) return;

      const particleIcons = ["✦", "·", "🤍", "🌸"];
      const particleCount = window.innerWidth < 640 ? 8 : 14;

      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("span");
        p.className = "ambient-particle";
        p.textContent = particleIcons[Math.floor(Math.random() * particleIcons.length)];
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;
        p.style.fontSize = `${9 + Math.random() * 10}px`;
        p.style.animationDuration = `${16 + Math.random() * 20}s`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        p.style.opacity = `${0.08 + Math.random() * 0.16}`;
        bgContainer.appendChild(p);
      }
    },

    /**
     * Check prefers-reduced-motion media query
     */
    checkReducedMotion: function () {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleMotionPref = (mq) => {
        if (mq.matches) {
          document.body.classList.add("reduced-motion");
        } else {
          document.body.classList.remove("reduced-motion");
        }
      };
      mediaQuery.addEventListener("change", handleMotionPref);
      handleMotionPref(mediaQuery);
    },
  };

  App.init();
  window.App = App;
});

