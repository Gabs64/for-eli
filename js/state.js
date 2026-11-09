(function () {
  const listeners = [];

  const StateManager = {

    state: {
      hasStarted: false,
      openingMode: "sequential",
      openedNoteIds: [],
      isFinalUnlocked: false,
      isFinalOpened: false,
      isCompleted: false,
      isNoteModalOpen: false,
      isAnimating: false,
      currentActiveNote: null,
      audioMuted: false,
    },

    init: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      const saved = window.StorageManager ? window.StorageManager.getState() : {};

      this.state.openingMode = config.openingMode || "sequential";
      this.state.hasStarted = Boolean(saved.hasStarted);
      this.state.openedNoteIds = Array.isArray(saved.openedNoteIds) ? [...saved.openedNoteIds] : [];
      this.state.isFinalOpened = Boolean(saved.isFinalOpened);
      this.state.isCompleted = Boolean(saved.isCompleted);
      this.state.audioMuted = Boolean(saved.audioMuted);

      this.checkFinalNoteUnlock();
    },

    subscribe: function (fn) {
      if (typeof fn === "function") {
        listeners.push(fn);
      }
    },

    notify: function (event, payload) {
      listeners.forEach((fn) => {
        try {
          fn(event, payload, this.state);
        } catch (e) {
          console.error("StateManager listener error:", e);
        }
      });
    },

    save: function () {
      if (window.StorageManager) {
        window.StorageManager.saveState({
          hasStarted: this.state.hasStarted,
          openedNoteIds: this.state.openedNoteIds,
          isFinalUnlocked: this.state.isFinalUnlocked,
          isFinalOpened: this.state.isFinalOpened,
          isCompleted: this.state.isCompleted,
          audioMuted: this.state.audioMuted,
        });
      }
    },

    startExperience: function () {
      this.state.hasStarted = true;
      this.save();
      this.notify("started");
    },

    checkFinalNoteUnlock: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      const regularNotes = config.notes || [];
      const totalRegular = regularNotes.length;
      const openedRegularCount = this.getOpenedRegularNotes().length;

      const shouldUnlock = totalRegular > 0 && openedRegularCount >= totalRegular;
      const wasUnlocked = this.state.isFinalUnlocked;

      this.state.isFinalUnlocked = shouldUnlock;

      if (shouldUnlock && !wasUnlocked) {
        this.save();
        this.notify("finalUnlocked");
      }
      return this.state.isFinalUnlocked;
    },

    getOpenedRegularNotes: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      const regularNotes = config.notes || [];
      return regularNotes.filter((note) => this.state.openedNoteIds.includes(note.id));
    },

    getUnopenedRegularNotes: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      const regularNotes = config.notes || [];
      return regularNotes.filter((note) => !this.state.openedNoteIds.includes(note.id));
    },

    getNextAvailableNote: function () {

      if (this.state.isFinalUnlocked) {
        if (!this.state.isFinalOpened) {
          const config = window.NOTE_JAR_CONFIG || {};
          return { ...config.finalConfession, isFinal: true };
        }
        return null;
      }

      const unopened = this.getUnopenedRegularNotes();
      if (unopened.length === 0) {
        return null;
      }

      if (this.state.openingMode === "random") {
        const randomIndex = Math.floor(Math.random() * unopened.length);
        return unopened[randomIndex];
      }

      return unopened[0];
    },

    markNoteAsOpened: function (noteId) {
      if (!noteId) return;

      const config = window.NOTE_JAR_CONFIG || {};
      if (noteId === config.finalConfession?.id || noteId === "note-final") {
        this.state.isFinalOpened = true;
        this.state.isCompleted = true;
        this.save();
        this.notify("finalNoteOpened");
        this.notify("progressUpdated");
        return;
      }

      if (!this.state.openedNoteIds.includes(noteId)) {
        this.state.openedNoteIds.push(noteId);
        this.checkFinalNoteUnlock();
        this.save();
        this.notify("noteOpened", { noteId });
        this.notify("progressUpdated");
      }
    },

    resetProgress: function () {
      this.state.hasStarted = false;
      this.state.openedNoteIds = [];
      this.state.isFinalUnlocked = false;
      this.state.isFinalOpened = false;
      this.state.isCompleted = false;
      this.state.isNoteModalOpen = false;
      this.state.isAnimating = false;
      this.state.currentActiveNote = null;

      if (window.StorageManager) {
        window.StorageManager.resetState();
      }

      this.notify("reset");
    },
  };

  window.StateManager = StateManager;
})();
