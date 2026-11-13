(function () {
  const CardsManager = {
    gridElement: null,
    finalContainer: null,

    init: function () {
      this.gridElement = document.getElementById("notes-grid");
      this.finalContainer = document.getElementById("final-note-container");

      this.render();
    },

    render: function () {
      if (!this.gridElement) return;

      const state = window.StateManager.state;
      const config = window.NOTE_JAR_CONFIG || {};
      const notes = config.notes || [];

      this.gridElement.innerHTML = "";

      const openedIds = state.openedNoteIds || [];
      const nextIndex = openedIds.length;

      notes.forEach((note, index) => {
        const isOpened = openedIds.includes(note.id);
        const isReady = !isOpened && index === nextIndex;
        const isLocked = !isOpened && !isReady;

        const card = document.createElement("div");
        card.className = "note-grid-card";

        if (isOpened) {
          card.classList.add("card-opened");
        } else if (isReady) {
          card.classList.add("card-ready");
        } else {
          card.classList.add("card-locked");
        }

        const paddedNum = String(note.number || index + 1).padStart(2, "0");

        let badgeHtml = "";
        let actionHtml = "";

        if (isOpened) {
          badgeHtml = '<span class="status-badge badge-read">Read ✓</span>';
          actionHtml = '<span class="card-action">Re-read &rarr;</span>';
        } else if (isReady) {
          badgeHtml = '<span class="status-badge badge-ready">Ready</span>';
          actionHtml = '<span class="card-action">Open note &rarr;</span>';
        } else {
          badgeHtml = '<span class="status-badge badge-locked">Locked</span>';
          actionHtml = '<span class="card-action text-locked">Locked</span>';
        }

        card.innerHTML = `
          <div class="card-header">
            <span class="card-label">Note ${paddedNum}</span>
            ${badgeHtml}
          </div>
          <h3 class="card-title">${note.title || "Note"}</h3>
          <p class="card-prompt">${note.prompt || ""}</p>
          <div class="card-footer">
            ${actionHtml}
          </div>
        `;

        if (!isLocked) {
          card.setAttribute("role", "button");
          card.setAttribute("tabindex", "0");
          card.addEventListener("click", () => {
            if (window.NotesModalManager) {
              window.NotesModalManager.openNoteModal(note, isOpened);
            }
          });
          card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (window.NotesModalManager) {
                window.NotesModalManager.openNoteModal(note, isOpened);
              }
            }
          });
        }

        this.gridElement.appendChild(card);
      });

      this.renderFinalCard();
    },

    renderFinalCard: function () {
      if (!this.finalContainer) return;

      const state = window.StateManager.state;
      const config = window.NOTE_JAR_CONFIG || {};
      const finalNote = config.finalConfession;
      if (!finalNote) return;

      this.finalContainer.innerHTML = "";

      const isOpened = Boolean(state.isFinalOpened);
      const isReady = Boolean(state.isFinalUnlocked && !state.isFinalOpened);
      const isLocked = !state.isFinalUnlocked;

      const finalCard = document.createElement("div");
      finalCard.className = "final-grid-card";

      if (isOpened) {
        finalCard.classList.add("card-opened");
      } else if (isReady) {
        finalCard.classList.add("card-ready", "final-ready");
      } else {
        finalCard.classList.add("card-locked");
      }

      let badgeHtml = "";
      let actionHtml = "";
      let descHtml = "";

      if (isOpened) {
        badgeHtml = '<span class="status-badge badge-read">Read ✓</span>';
        descHtml = finalNote.prompt || "Something I've been meaning to tell you...";
        actionHtml = '<span class="card-action">Re-read letter &rarr;</span>';
      } else if (isReady) {
        badgeHtml = '<span class="status-badge badge-final-ready">One Last Note</span>';
        descHtml = finalNote.unlockedMessage || "There's one last note at the bottom. Open it whenever you're ready.";
        actionHtml = '<span class="card-action">Open final letter &rarr;</span>';
      } else {
        badgeHtml = '<span class="status-badge badge-locked">Locked</span>';
        descHtml = "Unlocks after reading notes 01 through 06.";
        actionHtml = '<span class="card-action text-locked">Locked</span>';
      }

      finalCard.innerHTML = `
        <div class="card-header">
          <span class="card-label">Special Note</span>
          ${badgeHtml}
        </div>
        <h3 class="card-title">${isLocked ? "One Last Note" : (finalNote.title || "One Last Note")}</h3>
        <p class="card-prompt">${descHtml}</p>
        <div class="card-footer">
          ${actionHtml}
        </div>
      `;

      if (!isLocked) {
        finalCard.setAttribute("role", "button");
        finalCard.setAttribute("tabindex", "0");
        finalCard.addEventListener("click", () => {
          if (window.NotesModalManager) {
            window.NotesModalManager.openNoteModal({ ...finalNote, isFinal: true }, isOpened);
          }
        });
        finalCard.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (window.NotesModalManager) {
              window.NotesModalManager.openNoteModal({ ...finalNote, isFinal: true }, isOpened);
            }
          }
        });
      }

      this.finalContainer.appendChild(finalCard);
    },
  };

  window.CardsManager = CardsManager;
})();

