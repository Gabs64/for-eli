(function () {
  const NotificationManager = {
    webhookUrl: null,

    init: function () {
      const config = window.NOTE_JAR_CONFIG || {};
      this.webhookUrl = config.webhook?.url || null;

      if (config.webhook?.enabled !== false && this.webhookUrl) {
        this.notifySiteVisit();
      }

      if (window.StateManager) {
        window.StateManager.subscribe((event) => {
          if (event === "reset") {
            this.resetSession();
          }
        });
      }
    },

    send: function (payload) {
      if (!this.webhookUrl) return;

      try {
        fetch(this.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }).catch(() => {});
      } catch (e) {}
    },

    notifySiteVisit: function () {
      try {
        if (sessionStorage.getItem("discord_site_visit")) return;
        sessionStorage.setItem("discord_site_visit", "true");
      } catch (e) {}

      this.send({
        content: "💌 **Eli opened the website!**",
        embeds: [
          {
            title: "Website Visited",
            description: "Eli just opened the page.",
            color: 13198443,
            timestamp: new Date().toISOString(),
          },
        ],
      });
    },

    notifyNoteOpened: function (note) {
      if (!note) return;

      const noteKey = "discord_note_" + (note.id || note.number);
      try {
        if (sessionStorage.getItem(noteKey)) return;
        sessionStorage.setItem(noteKey, "true");
      } catch (e) {}

      if (note.isFinal) {
        this.send({
          content: `💖 **Eli opened the Final Note: ${note.title || "One Last Note"}!**`,
          embeds: [
            {
              title: "Final Note Opened",
              description: `Eli opened the final confession note: **${note.title || "One Last Note"}**`,
              color: 14753096,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      } else {
        const paddedNum = String(note.number || "").padStart(2, "0");
        this.send({
          content: `📖 **Eli opened Note ${paddedNum}: ${note.title || "A Note"}**`,
          embeds: [
            {
              title: `Note ${paddedNum} Opened`,
              description: `Eli is reading: **${note.title || "Note"}**`,
              color: 13933396,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    },

    notifyCompletion: function () {
      try {
        if (sessionStorage.getItem("discord_completed")) return;
        sessionStorage.setItem("discord_completed", "true");
      } catch (e) {}

      this.send({
        content: "🎉 **Eli finished reading all the notes!**",
        embeds: [
          {
            title: "All Notes Completed",
            description: "Eli has opened and read through all the notes.",
            color: 2000787,
            timestamp: new Date().toISOString(),
          },
        ],
      });
    },

    resetSession: function () {
      try {
        sessionStorage.removeItem("discord_completed");
        sessionStorage.removeItem("discord_note_note-final");
        for (let i = 1; i <= 10; i++) {
          sessionStorage.removeItem("discord_note_note-0" + i);
          sessionStorage.removeItem("discord_note_" + i);
        }
      } catch (e) {}
    },
  };

  window.NotificationManager = NotificationManager;
})();
