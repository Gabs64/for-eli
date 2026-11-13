document.addEventListener("DOMContentLoaded", () => {
  const App = {
    init: function () {
      this.applyConfig();

      if (window.StateManager) window.StateManager.init();
      if (window.AudioManager) window.AudioManager.init();
      if (window.NotificationManager) window.NotificationManager.init();
      if (window.CardsManager) window.CardsManager.init();
      if (window.NotesModalManager) window.NotesModalManager.init();

      this.bindUIEvents();
      this.subscribeToState();
      this.checkReducedMotion();
      this.updateProgressUI();
    },

    applyConfig: function () {
      const config = window.NOTE_JAR_CONFIG || {};

      if (config.meta?.siteTitle) {
        document.title = config.meta.siteTitle;
      }

      const headerTitle = document.getElementById("header-site-title");
      if (headerTitle && config.meta?.senderName) {
        headerTitle.textContent = `${config.meta.senderName}'s Notes`;
      }
    },

    bindUIEvents: function () {
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
              title: "Start over?",
              message: "This will reset your reading progress so you can experience opening the notes again from the beginning.",
              confirmText: "Yes, Start Over",
              cancelText: "Cancel",
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
      window.StateManager.subscribe((event) => {
        this.updateProgressUI();
        if (window.CardsManager) {
          window.CardsManager.render();
        }
      });
    },

    updateProgressUI: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      const regularNotes = config.notes || [];
      const totalRegular = regularNotes.length;
      const openedCount = window.StateManager ? window.StateManager.getOpenedRegularNotes().length : 0;
      const state = window.StateManager ? window.StateManager.state : {};

      const countElem = document.getElementById("progress-count-text");
      const barFillElem = document.getElementById("progress-bar-fill");

      const percent = totalRegular > 0 ? Math.min(100, Math.round((openedCount / totalRegular) * 100)) : 0;

      if (countElem) {
        if (state.isFinalOpened) {
          countElem.textContent = "All notes read";
        } else if (state.isFinalUnlocked) {
          countElem.textContent = `${totalRegular} of ${totalRegular} notes read — 1 special note unlocked`;
        } else {
          countElem.textContent = `${openedCount} of ${totalRegular} notes read`;
        }
      }

      if (barFillElem) {
        barFillElem.style.width = `${percent}%`;
        barFillElem.setAttribute("aria-valuenow", percent);
      }
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
