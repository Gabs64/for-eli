const NOTE_JAR_CONFIG = {

  meta: {
    siteTitle: "Capstone Demo",
    recipientName: "Eli",
    senderName: "Gab",
  },

  openingMode: "sequential",

  audio: {
    enabled: true,
    autoPlayPrompt: true,
    soundEffects: true,
    musicVolume: 0.35,
    soundVolume: 0.5,

    backgroundMusicUrl: "assets/audio/background-music.mp3",
    paperSoundUrl: "assets/audio/paper-sound.mp3",
  },

  welcome: {
    badge: "",
    title: "For Eli",
    subtitle: "A few notes I put together for you.",
    message: "I made this little jar of notes for you—filled with a few memories, small things I appreciate, and thoughts I wanted to share. Take your time and open them one by one.",
    buttonText: "Open the Jar",
    jarPreviewNote: "Tap to reach inside",
  },

  jarScreen: {
    tapInstruction: "Tap the jar to pick a note",
    jarEmptyInstruction: "You've read all the notes so far",
    openNotesButton: "Opened Notes",
    resetButton: "Start Over",
  },

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

  notes: [
    {
      id: "note-01",
      number: 1,
      category: "Where It All Began",
      title: "Where It All Began",
      prompt: "How a random afternoon turned into meeting you...",
      color: "pink",
      symbol: "🌸",
      message: `'Twas during a cozy afternoon when my friend and I decided to go out just to catch up. After we finished our kwento, the thought of trying out Litmatch suddenly crossed my mind, so I decided to give it a shot. I joined the first voice game, and that's where I met you. At that time, I honestly had no expectations other than having a casual conversation with a random person.

Little did I know that a simple decision would lead to something I would eventually look forward to.

We talked about so many things that first day, from our lives and school experiences to our interests and random stories. We even had our very first movie night, where I discovered that you were also into horror movies.

It's funny how something so unexpected can turn into a memory worth keeping.

**Day 1 was where our little story began.**`,
    },
    {
      id: "note-02",
      number: 2,
      category: "The First Thing I Noticed",
      title: "The Heart You Have",
      prompt: "What stood out to me from the very beginning...",
      color: "peach",
      symbol: "✨",
      message: `My first impression of you was that you were someone who was very mahinhin, smart, fun to be around, and genuinely caring.

As I got to know you a little more, I started noticing the little things that made those first impressions even more meaningful.

I genuinely hope that you never lose that caring heart of yours. It's something I admire about you, and I hope you continue carrying it with you wherever life takes you.

Never underestimate how special that part of you is.`,
    },
    {
      id: "note-03",
      number: 3,
      category: "Quiet Nights & Little Things",
      title: "Late-Night Calls & Quiet Comfort",
      prompt: "The ordinary moments I've grown so fond of...",
      color: "lavender",
      symbol: "🌙",
      message: `Random VC nights have slowly become one of the little things I've grown fond of.

Whether we're talking about random things, sharing stories about our day, scrolling through our phones, or simply enjoying each other's company in silence, I find comfort in those moments.

I like the way you talk, the way you smile, and all those little things you probably don't even notice yourself doing but somehow manage to make me smile.

You might consider them ordinary moments, but I hope you know that they're memories I genuinely appreciate.

Sometimes, it's the simplest moments that become the most memorable.`,
    },
    {
      id: "note-04",
      number: 4,
      category: "Moments That Made Me Smile",
      title: "5 AM Wake-Up Calls & 'Ate Gab'",
      prompt: "November 7, spam calls, and our first movie night...",
      color: "blue",
      symbol: "🧸",
      message: `I don't think I'll ever forget that early Saturday morning, November 7, when I kept spam-calling you because you asked me to wake you up at 5 AM. HAHAHAHAHA!

And, of course, who could forget the moment your little sister called me "Ate Gab"? That one definitely caught me off guard. HAHAHAHAHAHA!

Those little unexpected moments never fail to make me smile whenever I remember them.

I also can't leave out our very first movie night together. It's funny how these seemingly simple experiences have already become memories worth looking back on.

I hope we get to make even more silly, random, and unforgettable memories along the way.`,
    },
    {
      id: "note-05",
      number: 5,
      category: "For the Heavy Days",
      title: "Just One Call Away",
      prompt: "Whenever the world feels a little too loud...",
      color: "peach",
      symbol: "💌",
      message: `Whenever things get a little too heavy, when life becomes overwhelming, or when you simply feel like letting things out, I hope you remember that you have someone who's willing to listen.

I'm literally just one call away whenever you need someone to talk to.

Whether it's through chat, voice messages, or a good old-fashioned voice call, you can always share what's on your mind. You don't have to have the right words, and you don't have to pretend that everything is okay.

I may not always have the perfect advice or know exactly what to say, but I'll always do my best to listen and understand.

And please remember, you don't have to go through everything alone.`,
    },
    {
      id: "note-06",
      number: 6,
      category: "Everything You Are",
      title: "Learning Your Story, Page by Page",
      prompt: "Why getting to know you has been my favorite part...",
      color: "yellow",
      symbol: "☀️",
      message: `I genuinely appreciate and admire you for who you are.

I know there are still so many things I have yet to discover about you, stories I haven't heard, experiences I haven't gotten to know, and little things about you that I'm sure I'll come to appreciate along the way.

But perhaps that's one of the things I find exciting about getting to know you. There's still so much more to discover, and I'm looking forward to learning about those things at your own pace.

I may only be seeing a small part of who you are right now, but even from that little glimpse, I've already found so many things worth appreciating.

Thank you for being open with me, for the trust you've given me, and for allowing me to be part of some of your ordinary days.

I hope you never feel that you have to be anyone other than yourself around me.`,
    },
  ],

  finalConfession: {
    id: "note-final",
    category: "From the Bottom of the Jar",
    title: "What My Heart Wanted to Say",
    prompt: "Something I've been meaning to tell you, Eli...",
    color: "gold-rose",
    symbol: "❤️",
    lockedMessage: "There's one more note waiting at the bottom of the jar...",
    unlockedMessage: "There's one last note at the bottom. Open it whenever you're ready.",
    badgeText: "One Last Note",
    message: `There's one thing I've been wanting to tell you, and that is: **I like you, Eli.**

I like you not just because you're cute, but because of the person you are as a whole. I like the way you carry yourself, the way you interact with people, your caring nature, and even the little things that make you uniquely you.

I know there's still a lot I have yet to learn about you, and I'm not going to pretend that I already know everything about you. But that's exactly why I want to keep getting to know you.

I don't know what the future holds for us, and I don't want to rush anything. I'm more than willing to take things slowly and let whatever we have grow naturally, without putting unnecessary expectations on either of us.

I'm not telling you this because I'm expecting you to feel the same way or because I want you to give me an answer right away. I simply believe that genuine feelings deserve to be expressed, and I think you deserve to know how I truly feel about you.

Whatever happens from here, I'm genuinely grateful that a random decision to join a voice game led me to meet you.

**I'm glad I got to meet you, Eli. And I hope this is only the beginning of many more memories we get to share.** ❤️`,
  },

  completion: {
    badge: "All Read",
    title: "That's All of Them, Eli",
    subtitle: "I hope reading these brought a little smile to your face.",
    message: "You can look back at any of the notes whenever you feel like it.",
    reviewButtonText: "Read Notes Again",
    replayButtonText: "Put Notes Back in the Jar",
  },
};

if (typeof window !== "undefined") {
  window.NOTE_JAR_CONFIG = NOTE_JAR_CONFIG;
}
