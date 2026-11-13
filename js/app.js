document.addEventListener("DOMContentLoaded", () => {
  const App = {
    init: function () {
      console.log("Initializing Virtual Note Jar...");

      this.applyConfig();

      if (window.StateManager) window.StateManager.init();
      if (window.AudioManager) window.AudioManager.init();
      if (window.JarManager) window.JarManager.init();
      if (window.NotesModalManager) window.NotesModalManager.init();

      this.bindUIEvents();
      this.subscribeToState();
      this.initBackgroundParticles();
      this.checkReducedMotion();

      this.renderScreenState();
      this.updateProgressUI();
    },

    applyConfig: function () {
      const config = window.NOTE_JAR_CONFIG || {};

      if (config.meta?.siteTitle) {
        document.title = config.meta.siteTitle;
      }

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

      const headerTitle = document.getElementById("header-jar-title");
      if (headerTitle && config.meta?.senderName) {
        headerTitle.textContent = `${config.meta.senderName}'s Note Jar`;
      }
    },

    bindUIEvents: function () {

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

      const audioBtn = document.getElementById("audio-toggle-btn");
      if (audioBtn) {
        audioBtn.addEventListener("click", () => {
          if (window.AudioManager) {
            window.AudioManager.toggleMute();
          }
        });
      }

      const resetBtn = document.getElementById("reset-jar-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (window.NotesModalManager && window.NotesModalManager.showConfirmModal) {
            window.NotesModalManager.showConfirmModal({
              title: "Put Notes Back in the Jar?",
              message: "This will fold all the notes back inside the jar so you can open them again from the beginning.",
              confirmText: "Yes, Start Over",
              onConfirm: () => {
                window.StateManager.resetProgress();
              },
            });
          } else {
            window.StateManager.resetProgress();
          }
        });
      }
    },

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

    updateProgressUI: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      const regularNotes = config.notes || [];
      const totalRegular = regularNotes.length;
      const openedCount = window.StateManager.getOpenedRegularNotes().length;
      const state = window.StateManager.state;

      const countElem = document.getElementById("progress-count-text");
      const barFillElem = document.getElementById("progress-bar-fill");
      const statusPillElem = document.getElementById("progress-status-pill");

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
          statusPillElem.textContent = "1 secret note";
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

      const openedBadge = document.getElementById("opened-notes-count-badge");
      if (openedBadge) {
        const totalOpened = openedCount + (state.isFinalOpened ? 1 : 0);
        openedBadge.textContent = totalOpened;
        openedBadge.style.display = totalOpened > 0 ? "inline-flex" : "none";
      }
    },

    initBackgroundParticles: function () {
      const bgContainer = document.getElementById("floating-bg-particles");
      if (bgContainer) bgContainer.innerHTML = "";
    },

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
