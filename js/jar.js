(function () {
  const JarManager = {
    jarElement: null,
    notesContainer: null,
    haloElement: null,
    statusTextElement: null,
    isShaking: false,

    init: function () {
      this.jarElement = document.getElementById("virtual-jar");
      this.notesContainer = document.getElementById("jar-notes-pile");
      this.haloElement = document.getElementById("jar-glow-halo");
      this.statusTextElement = document.getElementById("jar-status-prompt");

      if (!this.jarElement) return;

      this.bindEvents();
      this.renderNotesInJar();
      this.updateJarState();
    },

    bindEvents: function () {
      this.jarElement.addEventListener("click", (e) => {
        this.handleJarInteraction(e);
      });

      this.jarElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.handleJarInteraction(e);
        }
      });
    },

    handleJarInteraction: function () {
      const state = window.StateManager.state;

      if (state.isAnimating || state.isNoteModalOpen) {
        return;
      }

      if (state.isFinalOpened) {

        if (window.NotesModalManager) {
          window.NotesModalManager.showCompletionScreen();
        }
        return;
      }

      const nextNote = window.StateManager.getNextAvailableNote();
      if (!nextNote) {
        return;
      }

      this.triggerExtraction(nextNote);
    },

    renderNotesInJar: function () {
      if (!this.notesContainer) return;
      this.notesContainer.innerHTML = "";

      const state = window.StateManager.state;
      const unopenedNotes = window.StateManager.getUnopenedRegularNotes();
      const count = unopenedNotes.length;

      const colorMap = {
        pink: { bg: "#fda4af", border: "#f43f5e", shadow: "#e11d48" },
        yellow: { bg: "#fde047", border: "#eab308", shadow: "#ca8a04" },
        lavender: { bg: "#c4b5fd", border: "#8b5cf6", shadow: "#7c3aed" },
        blue: { bg: "#7dd3fc", border: "#0284c7", shadow: "#0369a1" },
        peach: { bg: "#fdba74", border: "#ea580c", shadow: "#c2410c" },
        "gold-rose": { bg: "#fb7185", border: "#e11d48", shadow: "#be123c" },
      };

      if (state.isFinalUnlocked && !state.isFinalOpened) {
        const finalNoteElem = document.createElement("div");
        finalNoteElem.className = "jar-folded-note jar-final-note-preview";
        finalNoteElem.setAttribute("data-note-id", "note-final");
        finalNoteElem.innerHTML = `
          <div class="folded-paper gold-rose-paper pulse-glow">
            <span class="folded-seal">💖</span>
            <div class="folded-crease"></div>
          </div>
        `;
        this.notesContainer.appendChild(finalNoteElem);
        return;
      }

      const positions = [
        { bottom: "16px", left: "28px", rotate: "-15deg", zIndex: 1 },
        { bottom: "18px", right: "26px", rotate: "22deg", zIndex: 2 },
        { bottom: "28px", left: "44px", rotate: "5deg", zIndex: 3 },
        { bottom: "38px", left: "20px", rotate: "-28deg", zIndex: 4 },
        { bottom: "42px", right: "32px", rotate: "18deg", zIndex: 5 },
        { bottom: "56px", left: "36px", rotate: "-8deg", zIndex: 6 },
        { bottom: "66px", right: "42px", rotate: "12deg", zIndex: 7 },
      ];

      unopenedNotes.forEach((note, index) => {
        const pos = positions[index % positions.length];
        const noteElem = document.createElement("div");
        noteElem.className = `jar-folded-note note-color-${note.color || "pink"}`;
        noteElem.id = `folded-${note.id}`;
        noteElem.style.bottom = pos.bottom;
        if (pos.left) noteElem.style.left = pos.left;
        if (pos.right) noteElem.style.right = pos.right;
        noteElem.style.transform = `rotate(${pos.rotate})`;
        noteElem.style.zIndex = pos.zIndex;

        noteElem.innerHTML = `
          <div class="folded-paper">
            <span class="folded-symbol">${note.symbol || "✨"}</span>
            <div class="folded-crease"></div>
          </div>
        `;

        this.notesContainer.appendChild(noteElem);
      });

      if (count > 0) {
        for (let i = 0; i < 3; i++) {
          const sparkle = document.createElement("div");
          sparkle.className = "jar-sparkle";
          sparkle.style.left = `${25 + i * 25}%`;
          sparkle.style.bottom = `${20 + i * 18}%`;
          sparkle.style.animationDelay = `${i * 0.7}s`;
          this.notesContainer.appendChild(sparkle);
        }
      }
    },

    updateJarState: function () {
      const state = window.StateManager.state;
      const config = window.NOTE_JAR_CONFIG || {};

      if (!this.jarElement) return;

      this.jarElement.classList.remove("has-final-unlocked", "is-completed", "is-shaking");

      if (state.isFinalOpened) {
        this.jarElement.classList.add("is-completed");
        if (this.statusTextElement) {
          this.statusTextElement.innerHTML = `
            <span class="status-badge complete">All Notes Read</span>
            <p class="status-msg">${config.completion?.subtitle || "Tap the jar to look back at your notes"}</p>
          `;
        }
      } else if (state.isFinalUnlocked) {
        this.jarElement.classList.add("has-final-unlocked");
        if (this.statusTextElement) {
          this.statusTextElement.innerHTML = `
            <span class="status-badge special-unlocked pulse-badge">One Last Note</span>
            <p class="status-msg special-msg">${config.finalConfession?.unlockedMessage || "There's one last note at the bottom. Open it whenever you're ready."}</p>
          `;
        }
      } else {
        const unopenedCount = window.StateManager.getUnopenedRegularNotes().length;
        if (this.statusTextElement) {
          this.statusTextElement.innerHTML = `
            <p class="status-msg">${config.jarScreen?.tapInstruction || "Tap the jar to pick a note"}</p>
            <span class="status-sub">${unopenedCount} ${unopenedCount === 1 ? "note" : "notes"} left inside</span>
          `;
        }
      }
    },

    triggerExtraction: function (noteData) {
      const state = window.StateManager.state;
      state.isAnimating = true;

      if (window.AudioManager) {
        window.AudioManager.playPaperExtractSound();
      }

      this.jarElement.classList.add("jar-active-wobble");
      setTimeout(() => {
        this.jarElement.classList.remove("jar-active-wobble");
      }, 600);

      const extractingNote = document.createElement("div");
      extractingNote.className = `extracting-note-token note-color-${noteData.color || "pink"}`;
      if (noteData.isFinal) {
        extractingNote.classList.add("final-extract-token");
      }

      extractingNote.innerHTML = `
        <div class="folded-paper-extract">
          <span class="extract-symbol">${noteData.symbol || (noteData.isFinal ? "💖" : "✨")}</span>
          <div class="folded-crease"></div>
        </div>
      `;

      const jarRect = this.jarElement.getBoundingClientRect();
      extractingNote.style.left = `${jarRect.left + jarRect.width / 2 - 25}px`;
      extractingNote.style.top = `${jarRect.top + jarRect.height * 0.45}px`;

      document.body.appendChild(extractingNote);

      requestAnimationFrame(() => {
        extractingNote.classList.add("float-up-and-center");
      });

      const extractionDuration = noteData.isFinal ? 1000 : 750;
      setTimeout(() => {
        if (document.body.contains(extractingNote)) {
          document.body.removeChild(extractingNote);
        }
        state.isAnimating = false;

        if (window.NotesModalManager) {
          window.NotesModalManager.openNoteModal(noteData);
        }
      }, extractionDuration);
    },
  };

  window.JarManager = JarManager;
})();
