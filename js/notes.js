/**
 * VIRTUAL NOTE JAR - NOTES & MODAL MANAGER
 * -------------------------------------------------------------
 * Manages the paper-style unfolding modal, text formatting,
 * final confession special reveal effects, and the opened notes drawer.
 */

(function () {
  const NotesModalManager = {
    modalOverlay: null,
    cardElement: null,
    drawerOverlay: null,
    currentNote: null,
    isClosing: false,

    init: function () {
      this.modalOverlay = document.getElementById("note-modal-overlay");
      this.cardElement = document.getElementById("note-card");
      this.drawerOverlay = document.getElementById("opened-notes-drawer");

      this.bindEvents();
    },

    bindEvents: function () {
      // Close modal on close button click
      const closeBtn = document.getElementById("modal-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.closeNoteModal());
      }

      // Close modal on clicking outside background overlay
      if (this.modalOverlay) {
        this.modalOverlay.addEventListener("click", (e) => {
          if (e.target === this.modalOverlay) {
            this.closeNoteModal();
          }
        });
      }

      // Escape key closes confirm modal, note modal, or drawer
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const confirmOverlay = document.getElementById("confirm-modal-overlay");
          if (confirmOverlay && confirmOverlay.classList.contains("active")) {
            this.closeConfirmModal();
          } else if (window.StateManager.state.isNoteModalOpen) {
            this.closeNoteModal();
          } else if (this.isDrawerOpen()) {
            this.closeOpenedNotesDrawer();
          }
        }
      });

      // Drawer open/close buttons
      const openDrawerBtn = document.getElementById("view-opened-notes-btn");
      if (openDrawerBtn) {
        openDrawerBtn.addEventListener("click", () => {
          openDrawerBtn.classList.remove("notes-btn-clicked");
          void openDrawerBtn.offsetWidth;
          openDrawerBtn.classList.add("notes-btn-clicked");
          this.openOpenedNotesDrawer();
        });
      }

      const closeDrawerBtn = document.getElementById("drawer-close-btn");
      if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener("click", () => this.closeOpenedNotesDrawer());
      }

      if (this.drawerOverlay) {
        this.drawerOverlay.addEventListener("click", (e) => {
          if (e.target === this.drawerOverlay) {
            this.closeOpenedNotesDrawer();
          }
        });
      }
    },

    /**
     * Open and animate the paper-style message modal
     */
    openNoteModal: function (noteData, isRevisit = false) {
      if (!this.modalOverlay || !this.cardElement) return;

      this.currentNote = noteData;
      this.isRevisit = isRevisit;

      const state = window.StateManager.state;
      state.isNoteModalOpen = true;
      state.currentActiveNote = noteData;

      // Populate content safely (using textContent to prevent any XSS)
      this.populateCardContent(noteData);

      // Play unfolding chime sound
      if (window.AudioManager) {
        if (noteData.isFinal) {
          window.AudioManager.playFinalRevealSound();
        } else {
          window.AudioManager.playUnfoldSound();
        }
      }

      // Set theme classes
      this.cardElement.className = "note-card paper-texture";
      if (noteData.color) {
        this.cardElement.classList.add(`card-color-${noteData.color}`);
      }
      if (noteData.isFinal) {
        this.cardElement.classList.add("card-final-confession");
        document.body.classList.add("final-reveal-active");
        this.triggerConfetti();
      }

      // Show overlay and trigger unfold animation
      this.modalOverlay.classList.remove("hidden");
      this.modalOverlay.classList.add("active");
      this.cardElement.classList.add("unfolding");

      // Trap focus in modal for accessibility
      const closeBtn = document.getElementById("modal-close-btn");
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 300);
      }

      setTimeout(() => {
        this.cardElement.classList.remove("unfolding");
      }, 600);
    },

    /**
     * Safely format paragraphs into the modal card
     */
    populateCardContent: function (note) {
      const categoryElem = document.getElementById("modal-category-badge");
      const titleElem = document.getElementById("modal-note-title");
      const promptElem = document.getElementById("modal-note-prompt");
      const bodyElem = document.getElementById("modal-note-body");
      const sealElem = document.getElementById("modal-wax-seal");
      const numberElem = document.getElementById("modal-note-number");

      if (categoryElem) {
        categoryElem.textContent = note.category || "Little Note";
      }

      if (numberElem) {
        if (note.number) {
          numberElem.textContent = `${note.number} / 6`;
          numberElem.classList.remove("hidden");
        } else if (note.isFinal) {
          numberElem.textContent = "Last Note";
          numberElem.classList.remove("hidden");
        } else {
          numberElem.classList.add("hidden");
        }
      }

      if (titleElem) {
        titleElem.textContent = note.title || "A Note For You";
      }

      if (promptElem) {
        if (note.prompt) {
          promptElem.textContent = `"${note.prompt}"`;
          promptElem.classList.remove("hidden");
        } else {
          promptElem.classList.add("hidden");
        }
      }

      if (sealElem) {
        sealElem.textContent = note.symbol || (note.isFinal ? "💖" : "✨");
      }

      // Format message into paragraphs cleanly
      if (bodyElem) {
        bodyElem.innerHTML = "";
        const rawMessage = note.message || "";
        const paragraphs = rawMessage.split(/\n\s*\n/);

        paragraphs.forEach((paraText) => {
          const trimmed = paraText.trim();
          if (trimmed.length > 0) {
            const p = document.createElement("p");
            // Also handle single newlines inside paragraph with br and **bold** text
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

    /**
     * Close the paper modal and update progression
     */
    closeNoteModal: function () {
      if (this.isClosing || !this.modalOverlay || !this.cardElement) return;
      this.isClosing = true;

      // Play soft pop sound
      if (window.AudioManager) {
        window.AudioManager.playPopSound();
      }

      this.cardElement.classList.add("folding-closed");
      this.modalOverlay.classList.remove("active");

      setTimeout(() => {
        this.modalOverlay.classList.add("hidden");
        this.cardElement.classList.remove("folding-closed");
        document.body.classList.remove("final-reveal-active");

        const state = window.StateManager.state;
        state.isNoteModalOpen = false;

        const closedNote = this.currentNote;
        this.currentNote = null;
        this.isClosing = false;

        // If not just revisiting from the drawer, record as opened!
        if (closedNote && !this.isRevisit) {
          window.StateManager.markNoteAsOpened(closedNote.id);
        }

        // Return focus to jar
        const jar = document.getElementById("virtual-jar");
        if (jar) {
          jar.focus();
        }

        // If this was the final note, check if we should display completion modal
        if (closedNote && closedNote.isFinal) {
          setTimeout(() => {
            this.showCompletionScreen();
          }, 800);
        }
      }, 350);
    },

    /**
     * Show Completion Screen modal / view
     */
    showCompletionScreen: function () {
      const compOverlay = document.getElementById("completion-modal-overlay");
      if (!compOverlay) return;

      const config = window.NOTE_JAR_CONFIG?.completion || {};
      const titleElem = document.getElementById("completion-title");
      const msgElem = document.getElementById("completion-message");
      const subElem = document.getElementById("completion-subtitle");

      if (titleElem) titleElem.textContent = config.title || "You've Found Every Note!";
      if (subElem) subElem.textContent = config.subtitle || "";
      if (msgElem) msgElem.textContent = config.message || "";

      compOverlay.classList.remove("hidden");
      compOverlay.classList.add("active");

      this.triggerConfetti();

      // Hook up completion action buttons
      const browseBtn = document.getElementById("completion-browse-btn");
      if (browseBtn) {
        browseBtn.onclick = () => {
          compOverlay.classList.remove("active");
          compOverlay.classList.add("hidden");
          this.openOpenedNotesDrawer();
        };
      }

      const replayBtn = document.getElementById("completion-replay-btn");
      if (replayBtn) {
        replayBtn.onclick = () => {
          this.showConfirmModal({
            title: "Put Notes Back in the Jar?",
            message: "Would you like to fold all the notes back inside and open them again from the beginning?",
            confirmText: "Yes, Start Over",
            onConfirm: () => {
              compOverlay.classList.remove("active");
              compOverlay.classList.add("hidden");
              window.StateManager.resetProgress();
            },
          });
        };
      }

      const closeCompBtn = document.getElementById("completion-close-btn");
      if (closeCompBtn) {
        closeCompBtn.onclick = () => {
          compOverlay.classList.remove("active");
          compOverlay.classList.add("hidden");
        };
      }
    },

    /**
     * Custom Styled Confirmation Modal (replaces native window.confirm)
     */
    showConfirmModal: function (options = {}) {
      const overlay = document.getElementById("confirm-modal-overlay");
      if (!overlay) return;

      const titleElem = document.getElementById("confirm-modal-title");
      const msgElem = document.getElementById("confirm-modal-message");
      const okBtn = document.getElementById("confirm-ok-btn");
      const cancelBtn = document.getElementById("confirm-cancel-btn");

      if (titleElem) titleElem.textContent = options.title || "Put Notes Back in the Jar?";
      if (msgElem) {
        msgElem.textContent =
          options.message ||
          "This will fold all the notes back inside the jar so you can open them again from the beginning.";
      }
      if (okBtn) {
        okBtn.innerHTML = `<span>${options.confirmText || "Yes, Start Over"}</span>`;
      }
      if (cancelBtn) {
        cancelBtn.innerHTML = `<span>${options.cancelText || "Cancel"}</span>`;
      }

      overlay.classList.remove("hidden");
      overlay.classList.add("active");

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
      overlay.onclick = (e) => {
        if (e.target === overlay) handleCancel();
      };

      if (cancelBtn) {
        setTimeout(() => cancelBtn.focus(), 100);
      }
    },

    closeConfirmModal: function () {
      const overlay = document.getElementById("confirm-modal-overlay");
      if (!overlay) return;
      overlay.classList.remove("active");
      setTimeout(() => {
        overlay.classList.add("hidden");
      }, 250);
    },

    /**
     * Opened Notes Drawer / Memory Box
     */
    openOpenedNotesDrawer: function () {
      if (!this.drawerOverlay) return;

      if (window.AudioManager) {
        window.AudioManager.playPopSound();
      }

      this.renderOpenedNotesList();
      this.drawerOverlay.classList.remove("hidden", "closing");

      // Force browser reflow so CSS slide-in transition always plays smoothly
      void this.drawerOverlay.offsetWidth;
      this.drawerOverlay.classList.add("active");

      const closeBtn = document.getElementById("drawer-close-btn");
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 200);
      }
    },

    closeOpenedNotesDrawer: function () {
      if (!this.drawerOverlay) return;
      this.drawerOverlay.classList.remove("active");
      this.drawerOverlay.classList.add("closing");
      setTimeout(() => {
        this.drawerOverlay.classList.remove("closing");
        this.drawerOverlay.classList.add("hidden");
      }, 320);
    },

    isDrawerOpen: function () {
      return this.drawerOverlay && this.drawerOverlay.classList.contains("active");
    },

    renderOpenedNotesList: function () {
      const listContainer = document.getElementById("drawer-notes-list");
      if (!listContainer) return;
      listContainer.innerHTML = "";

      const state = window.StateManager.state;
      const openedNotes = window.StateManager.getOpenedRegularNotes();
      const config = window.NOTE_JAR_CONFIG || {};

      if (openedNotes.length === 0 && !state.isFinalOpened) {
        listContainer.innerHTML = `
          <div class="empty-drawer-state">
            <span class="empty-icon">🫙</span>
            <p>You haven't opened any notes yet!</p>
            <small>Tap the jar to draw your first note.</small>
          </div>
        `;
        return;
      }

      // Render all opened regular notes with staggered entrance animation
      openedNotes.forEach((note, index) => {
        const item = document.createElement("button");
        item.className = `opened-note-item color-${note.color || "pink"}`;
        item.setAttribute("type", "button");
        item.style.animationDelay = `${0.08 + index * 0.055}s`;
        item.innerHTML = `
          <div class="item-left">
            <span class="item-symbol">${note.symbol || "✨"}</span>
            <div class="item-text">
              <span class="item-category">${note.category}</span>
              <h4 class="item-title">${note.title}</h4>
            </div>
          </div>
          <span class="item-action">Read ➔</span>
        `;

        item.addEventListener("click", () => {
          item.classList.add("item-selecting");
          setTimeout(() => {
            this.closeOpenedNotesDrawer();
          }, 140);
          setTimeout(() => {
            this.openNoteModal(note, true);
          }, 380);
        });

        listContainer.appendChild(item);
      });

      // If final confession is opened, display it prominently at the bottom
      if (state.isFinalOpened && config.finalConfession) {
        const finalItem = document.createElement("button");
        finalItem.className = "opened-note-item item-final-confession";
        finalItem.setAttribute("type", "button");
        finalItem.style.animationDelay = `${0.08 + openedNotes.length * 0.055}s`;
        finalItem.innerHTML = `
          <div class="item-left">
            <span class="item-symbol">❤️</span>
            <div class="item-text">
              <span class="item-category">One Last Note</span>
              <h4 class="item-title">${config.finalConfession.title}</h4>
            </div>
          </div>
          <span class="item-action">Re-read ➔</span>
        `;

        finalItem.addEventListener("click", () => {
          finalItem.classList.add("item-selecting");
          setTimeout(() => {
            this.closeOpenedNotesDrawer();
          }, 140);
          setTimeout(() => {
            this.openNoteModal({ ...config.finalConfession, isFinal: true }, true);
          }, 380);
        });

        listContainer.appendChild(finalItem);
      }
    },

    /**
     * Confetti & Sparkles Particle Generator
     */
    triggerConfetti: function () {
      const container = document.getElementById("confetti-container");
      if (!container) return;

      const colors = ["#e5b8bd", "#c9646b", "#e6cb94", "#cbbcd9", "#f5dfe1", "#f9eaec"];
      const shapes = ["circle", "heart"];

      for (let i = 0; i < 24; i++) {
        const confetti = document.createElement("div");
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        confetti.className = `confetti-piece shape-${shape}`;
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${3 + Math.random() * 2.5}s`;
        confetti.style.animationDelay = `${Math.random() * 0.8}s`;
        confetti.style.transform = `scale(${0.55 + Math.random() * 0.65}) rotate(${Math.random() * 360}deg)`;

        container.appendChild(confetti);

        setTimeout(() => {
          if (container.contains(confetti)) {
            container.removeChild(confetti);
          }
        }, 5500);
      }
    },
  };

  window.NotesModalManager = NotesModalManager;
})();

