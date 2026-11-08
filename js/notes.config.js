/**
 * VIRTUAL NOTE JAR - CONFIGURATION FILE
 * -------------------------------------------------------------
 * Personalized for Eli from Gab.
 * All personal messages, notes, and the final confession are here.
 */

const NOTE_JAR_CONFIG = {
  // Website Metadata
  meta: {
    siteTitle: "A Jar of Little Notes for Eli ✨",
    recipientName: "Eli",
    senderName: "Gab",
  },

  // Note Opening Mode:
  // "sequential" - Notes open in predetermined order (Building the story to Note 7)
  // "random"     - Recipient draws random unopened notes until all are unlocked
  openingMode: "sequential",

  // Audio & Sound Effects
  audio: {
    enabled: true,
    autoPlayPrompt: true, // Will request audio toggle on first tap
    soundEffects: true,   // Subtle paper rustle, pop, chimes
    musicVolume: 0.35,
    soundVolume: 0.5,
    // Custom audio paths if you supply real MP3s in assets/audio/
    // If not supplied, soothing procedural Web Audio synthesizer plays automatically!
    backgroundMusicUrl: "assets/audio/background-music.mp3",
    paperSoundUrl: "assets/audio/paper-sound.mp3",
  },

  // Welcome Screen
  welcome: {
    badge: "",
    title: "For Eli",
    subtitle: "A few notes I put together for you.",
    message: "I made this little jar of notes for you—filled with a few memories, small things I appreciate, and thoughts I wanted to share. Take your time and open them one by one.",
    buttonText: "Open the Jar",
    jarPreviewNote: "Tap to reach inside",
  },

  // Main Jar Screen Texts
  jarScreen: {
    tapInstruction: "Tap the jar to pick a note",
    jarEmptyInstruction: "You've read all the notes so far",
    openNotesButton: "Opened Notes",
    resetButton: "Start Over",
  },

  // Note Categories & Matching Visual Colors
  categories: {
    "Memories": {
      name: "Memories",
      color: "pink",
      badgeBg: "#fce7f3",
      badgeColor: "#be185d",
      noteBg: "#fff1f2",
      icon: "🌸",
    },
    "Appreciation": {
      name: "Things I Appreciate",
      color: "yellow",
      badgeBg: "#fef3c7",
      badgeColor: "#b45309",
      noteBg: "#fffbeb",
      icon: "☀️",
    },
    "Little Reminders": {
      name: "Little Reminders",
      color: "lavender",
      badgeBg: "#ede9fe",
      badgeColor: "#6d28d9",
      noteBg: "#f5f3ff",
      icon: "🌙",
    },
    "Inside Jokes": {
      name: "Inside Jokes",
      color: "blue",
      badgeBg: "#e0f2fe",
      badgeColor: "#0369a1",
      noteBg: "#f0f9ff",
      icon: "🧸",
    },
    "Open When": {
      name: "Open When...",
      color: "peach",
      badgeBg: "#ffedd5",
      badgeColor: "#c2410c",
      noteBg: "#fff7ed",
      icon: "💌",
    },
  },

  // Regular Notes List (6 Notes leading up to the final confession)
  // The final confession note MUST NOT be included here.
  notes: [
    {
      id: "note-01",
      number: 1,
      category: "Memories",
      title: "Day 1",
      prompt: "How it all started that afternoon...",
      color: "pink",
      symbol: "🌸",
      message: `'Twas during a cozy afternoon when my friend and I went out just to catch up. Later on, after we finished our kwento, the idea of trying out Litmatch suddenly crossed my mind, so I decided to give it a try. I joined the first voice game, which was where I met you. At that time, my only intention was to talk to a random person.

A lot of things happened on that first day. We talked about our lives, our school experiences, and our interests. We even had our first movie night when I found out that you also liked horror movies.

Day 1 was the beginning of everything.`,
    },
    {
      id: "note-02",
      number: 2,
      category: "Memories",
      title: "First Impression",
      prompt: "What I noticed about you early on...",
      color: "peach",
      symbol: "✨",
      message: `My first impression of you was that you were someone who was very mahinhin, smart, fun to be around, and caring.

I genuinely hope that your caring heart stays with you for a lifetime because it's one of the things that makes you special.`,
    },
    {
      id: "note-03",
      number: 3,
      category: "Little Reminders",
      title: "The Little Things",
      prompt: "Ordinary moments that make me smile...",
      color: "lavender",
      symbol: "🌙",
      message: `Random VC nights have become something we've gotten used to at this point.

I like the way you talk, the way you smile, and all those little things you do that might seem ordinary to you but somehow make me smile.`,
    },
    {
      id: "note-04",
      number: 4,
      category: "Inside Jokes",
      title: "5 AM Calls & Movie Nights",
      prompt: "November 7, spam calls, and 'Ate Gab'...",
      color: "blue",
      symbol: "🧸",
      message: `I remember that early Saturday morning, November 7, when I kept spam-calling you because you asked me to wake you up at 5 AM.

And, of course, there's the moment when your little sister called me "Ate Gab" HAHAHAHAHAHAHA!

Those are definitely some of the fun memories I'll remember. I also can't forget our very first movie night together.`,
    },
    {
      id: "note-05",
      number: 5,
      category: "Open When",
      title: "Whenever Things Feel Heavy",
      prompt: "Just one call away whenever you need me...",
      color: "peach",
      symbol: "💌",
      message: `Always remember this: whenever things get rough on your end or you feel like opening up about something, I'm literally just one call away whenever you need me.

Whether it's through chat, voice messages, or, of course, a voice call, I'm always willing to listen.

You don't have to go through everything alone.`,
    },
    {
      id: "note-06",
      number: 6,
      category: "Appreciation",
      title: "Getting to Know You",
      prompt: "What I've come to appreciate about you so far...",
      color: "yellow",
      symbol: "☀️",
      message: `I appreciate and admire you for who you truly are.

Maybe there are still a lot of things I don't know about you, but that's also one of the reasons why I want to get to know you more.

I may still be seeing things from afar, but these are the things I've come to notice and appreciate about you so far.`,
    },
  ],

  // Special Final Confession Note (Note 7)
  // Unlocks ONLY after all 6 regular notes above have been opened.
  finalConfession: {
    id: "note-final",
    category: "One Last Note",
    title: "I Like You, Eli",
    prompt: "Something I've been meaning to tell you...",
    color: "gold-rose",
    symbol: "❤️",
    lockedMessage: "There's one more note waiting at the bottom of the jar...",
    unlockedMessage: "There's one last note at the bottom. Open it whenever you're ready.",
    badgeText: "One Last Note",
    message: `There is one thing I can say, and that is: I like you, Eli.

I like you as a whole human being in this world. I like the person you are, the way you carry yourself, and the little things that make you who you are.

I don't know what the future holds for us, but I just wanted you to know how I genuinely feel. I'm not expecting anything from you. I simply wanted to be honest about my feelings because I think you deserve to know. ❤️`,
  },

  // Completion Screen Settings
  completion: {
    badge: "All Read",
    title: "That's All of Them, Eli",
    subtitle: "I hope reading these brought a little smile to your face.",
    message: "You can look back at any of the notes whenever you feel like it.",
    reviewButtonText: "Read Notes Again",
    replayButtonText: "Put Notes Back in the Jar",
  },
};

// Export to window object for standalone browser compatibility
if (typeof window !== "undefined") {
  window.NOTE_JAR_CONFIG = NOTE_JAR_CONFIG;
}
