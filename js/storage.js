/**
 * VIRTUAL NOTE JAR - STORAGE MODULE
 * -------------------------------------------------------------
 * Safely persists recipient progress, opened notes, and audio
 * preferences to localStorage, with automatic in-memory fallback.
 */

(function () {
  const STORAGE_KEY = "virtual_note_jar_progress_v1";

  // In-memory fallback if localStorage is disabled, private browsing, etc.
  const memoryStore = {};

  const StorageManager = {
    /**
     * Test whether localStorage is available and functional
     */
    isAvailable: function () {
      try {
        if (typeof window === "undefined" || !window.localStorage) {
          return false;
        }
        const testKey = "__note_jar_test__";
        window.localStorage.setItem(testKey, "1");
        window.localStorage.removeItem(testKey);
        return true;
      } catch (e) {
        return false;
      }
    },

    /**
     * Retrieve the stored state object
     */
    getState: function () {
      try {
        if (this.isAvailable()) {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
              return {
                hasStarted: Boolean(parsed.hasStarted),
                openedNoteIds: Array.isArray(parsed.openedNoteIds) ? parsed.openedNoteIds : [],
                isFinalUnlocked: Boolean(parsed.isFinalUnlocked),
                isFinalOpened: Boolean(parsed.isFinalOpened),
                isCompleted: Boolean(parsed.isCompleted),
                audioMuted: typeof parsed.audioMuted === "boolean" ? parsed.audioMuted : false,
              };
            }
          }
        } else if (memoryStore[STORAGE_KEY]) {
          return memoryStore[STORAGE_KEY];
        }
      } catch (err) {
        console.error("StorageManager: Failed to read state from storage", err);
      }

      // Default initial state
      return {
        hasStarted: false,
        openedNoteIds: [],
        isFinalUnlocked: false,
        isFinalOpened: false,
        isCompleted: false,
        audioMuted: false,
      };
    },

    /**
     * Save the entire state object
     */
    saveState: function (state) {
      const dataToSave = {
        hasStarted: Boolean(state.hasStarted),
        openedNoteIds: Array.isArray(state.openedNoteIds) ? state.openedNoteIds : [],
        isFinalUnlocked: Boolean(state.isFinalUnlocked),
        isFinalOpened: Boolean(state.isFinalOpened),
        isCompleted: Boolean(state.isCompleted),
        audioMuted: Boolean(state.audioMuted),
        lastUpdated: Date.now(),
      };

      try {
        if (this.isAvailable()) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } else {
          memoryStore[STORAGE_KEY] = dataToSave;
        }
        return true;
      } catch (err) {
        console.error("StorageManager: Failed to save state", err);
        memoryStore[STORAGE_KEY] = dataToSave;
        return false;
      }
    },

    /**
     * Clear all saved progress (for reset functionality)
     */
    resetState: function () {
      try {
        if (this.isAvailable()) {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        delete memoryStore[STORAGE_KEY];
        return true;
      } catch (err) {
        console.error("StorageManager: Failed to reset storage", err);
        return false;
      }
    },
  };

  // Expose to window
  window.StorageManager = StorageManager;
})();
