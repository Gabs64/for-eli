(function () {
  const NotesModalManager = {
    modalOverlay: null,
    cardElement: null,
    completionOverlay: null,
    confirmOverlay: null,
    currentNote: null,
    isRevisit: false,
    isClosing: false,

    init: function () {
      this.modalOverlay = document.getElementById("note-modal-overlay");
      this.cardElement = document.getElementById("note-card");
      this.completionOverlay = document.getElementById("completion-modal-overlay");
      this.confirmOverlay = document.getElementById("confirm-modal-overlay");

      this.bindEvents();
    },

    bindEvents: function () {
      const closeBtn = document.getElementById("modal-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.closeNoteModal());
      }

      const bottomCloseBtn = document.getElementById("modal-card-bottom-close");
      if (bottomCloseBtn) {
        bottomCloseBtn.addEventListener("click", () => this.closeNoteModal());
      }

      if (this.modalOverlay) {
        this.modalOverlay.addEventListener("click", (e) => {
          if (e.target === this.modalOverlay) {
            this.closeNoteModal();
          }
        });
      }

      const compBrowseBtn = document.getElementById("completion-browse-btn");
      if (compBrowseBtn) {
        compBrowseBtn.addEventListener("click", () => this.closeCompletionModal());
      }

      const compCloseBtn = document.getElementById("completion-close-btn");
      if (compCloseBtn) {
        compCloseBtn.addEventListener("click", () => this.closeCompletionModal());
      }

      const compReplayBtn = document.getElementById("completion-replay-btn");
      if (compReplayBtn) {
        compReplayBtn.addEventListener("click", () => {
          this.closeCompletionModal();
          this.showConfirmModal({
            title: "Start over?",
            message: "This will reset your reading progress so you can experience opening the notes again from the beginning.",
            confirmText: "Yes, Start Over",
            cancelText: "Cancel",
            onConfirm: () => {
              window.StateManager.resetProgress();
            },
          });
        });
      }

      if (this.completionOverlay) {
        this.completionOverlay.addEventListener("click", (e) => {
          if (e.target === this.completionOverlay) {
            this.closeCompletionModal();
          }
        });
      }

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (this.confirmOverlay && this.confirmOverlay.classList.contains("active")) {
            this.closeConfirmModal();
          } else if (this.completionOverlay && this.completionOverlay.classList.contains("active")) {
            this.closeCompletionModal();
          } else if (this.modalOverlay && this.modalOverlay.classList.contains("active")) {
            this.closeNoteModal();
          }
        }
      });
    },

    openNoteModal: function (noteData, isRevisit = false) {
      if (!this.modalOverlay || !this.cardElement) return;

      this.currentNote = noteData;
      this.isRevisit = isRevisit;

      const state = window.StateManager.state;
      state.isNoteModalOpen = true;
      state.currentActiveNote = noteData;

      this.populateCardContent(noteData);

      if (window.AudioManager) {
        if (noteData.isFinal) {
          window.AudioManager.playFinalRevealSound();
        } else {
          window.AudioManager.playUnfoldSound();
        }
      }

      this.cardElement.className = "note-card";
      if (noteData.isFinal) {
        this.cardElement.classList.add("card-final-confession");
      }

      this.modalOverlay.classList.remove("hidden");
      this.modalOverlay.classList.add("active");

      const closeBtn = document.getElementById("modal-close-btn");
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 150);
      }
    },

    populateCardContent: function (note) {
      const numberElem = document.getElementById("modal-note-number");
      const titleElem = document.getElementById("modal-note-title");
      const bodyElem = document.getElementById("modal-note-body");

      if (numberElem) {
        if (note.isFinal) {
          numberElem.textContent = "Special Note";
        } else if (note.number) {
          numberElem.textContent = `Note ${note.number} of 6`;
        } else {
          numberElem.textContent = "";
        }
      }

      if (titleElem) {
        titleElem.textContent = note.title || "A Note For You";
      }

      if (bodyElem) {
        bodyElem.innerHTML = "";
        const rawMessage = note.message || "";
        const paragraphs = rawMessage.split(/\n\s*\n/);

        paragraphs.forEach((paraText) => {
          const trimmed = paraText.trim();
          if (trimmed.length > 0) {
            const p = document.createElement("p");
            const lines = trimmed.split("\n");

            lines.forEach((line, idx) => {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              parts.forEach((part) => {
                if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
                  const strong = document.createElement("strong");
                  strong.textContent = part.slice(2, -2);
                  p.appendChild(strong);
                } else if (part.length > 0) {
                  p.appendChild(document.createTextNode(part));
                }
              });

              if (idx < lines.length - 1) {
                p.appendChild(document.createElement("br"));
              }
            });

            bodyElem.appendChild(p);
          }
        });
      }
    },

    closeNoteModal: function () {
      if (this.isClosing || !this.modalOverlay) return;
      this.isClosing = true;

      if (window.AudioManager) {
        window.AudioManager.playPopSound();
      }

      this.modalOverlay.classList.remove("active");

      setTimeout(() => {
        this.modalOverlay.classList.add("hidden");

        const state = window.StateManager.state;
        state.isNoteModalOpen = false;

        const closedNote = this.currentNote;
        const wasRevisit = this.isRevisit;

        this.currentNote = null;
        this.isClosing = false;

        if (closedNote && !wasRevisit) {
          window.StateManager.markNoteAsOpened(closedNote.id);
        }

        if (closedNote && closedNote.isFinal) {
          setTimeout(() => {
            this.showCompletionScreen();
          }, 350);
        }
      }, 200);
    },

    showCompletionScreen: function () {
      if (!this.completionOverlay) return;

      const config = window.NOTE_JAR_CONFIG?.completion || {};
      const titleElem = document.getElementById("completion-title");
      const subElem = document.getElementById("completion-subtitle");
      const msgElem = document.getElementById("completion-message");

      if (titleElem && config.title) titleElem.textContent = config.title;
      if (subElem && config.subtitle) subElem.textContent = config.subtitle;
      if (msgElem && config.message) msgElem.textContent = config.message;

      this.completionOverlay.classList.remove("hidden");
      this.completionOverlay.classList.add("active");

      const browseBtn = document.getElementById("completion-browse-btn");
      if (browseBtn) {
        setTimeout(() => browseBtn.focus(), 150);
      }
    },

    closeCompletionModal: function () {
      if (!this.completionOverlay) return;
      this.completionOverlay.classList.remove("active");
      setTimeout(() => {
        this.completionOverlay.classList.add("hidden");
      }, 200);
    },

    showConfirmModal: function (options = {}) {
      if (!this.confirmOverlay) return;

      const titleElem = document.getElementById("confirm-modal-title");
      const msgElem = document.getElementById("confirm-modal-message");
      const okBtn = document.getElementById("confirm-ok-btn");
      const cancelBtn = document.getElementById("confirm-cancel-btn");

      if (titleElem) titleElem.textContent = options.title || "Start over?";
      if (msgElem) {
        msgElem.textContent =
          options.message ||
          "This will reset your reading progress so you can experience opening the notes again from the beginning.";
      }
      if (okBtn) {
        okBtn.innerHTML = `<span>${options.confirmText || "Yes, Start Over"}</span>`;
      }
      if (cancelBtn) {
        cancelBtn.innerHTML = `<span>${options.cancelText || "Cancel"}</span>`;
      }

      this.confirmOverlay.classList.remove("hidden");
      this.confirmOverlay.classList.add("active");

      const handleConfirm = () => {
        this.closeConfirmModal();
        if (typeof options.onConfirm === "function") {
          options.onConfirm();
        }
      };

      const handleCancel = () => {
        this.closeConfirmModal();
      };

      if (okBtn) okBtn.onclick = handleConfirm;
      if (cancelBtn) cancelBtn.onclick = handleCancel;
      this.confirmOverlay.onclick = (e) => {
        if (e.target === this.confirmOverlay) handleCancel();
      };

      if (cancelBtn) {
        setTimeout(() => cancelBtn.focus(), 100);
      }
    },

    closeConfirmModal: function () {
      if (!this.confirmOverlay) return;
      this.confirmOverlay.classList.remove("active");
      setTimeout(() => {
        this.confirmOverlay.classList.add("hidden");
      }, 200);
    },
  };

  window.NotesModalManager = NotesModalManager;
})();
