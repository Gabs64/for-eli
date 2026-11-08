# 💌 Virtual Note Jar — Creator Customization Guide

Welcome! This guide explains how you can personalize every aspect of your **Virtual Note Jar** without touching any complex application code.

All personal messages, titles, notes, and the special final confession are managed in one simple configuration file:
👉 **[`js/notes.config.js`](../js/notes.config.js)**

---

## Quick Reference: What You Can Customize

1. [Website Title & Names](#1-website-title--names)
2. [Welcome Screen & Introduction](#2-welcome-screen--introduction)
3. [Note Opening Modes (Sequential vs Random)](#3-note-opening-modes)
4. [Regular Notes (Adding, Editing, Removing)](#4-regular-notes)
5. [Note Categories & Colors](#5-note-categories--colors)
6. [The Final Confession Note](#6-the-special-final-confession-note)
7. [Completion Screen](#7-completion-screen)
8. [Background Music & Sound Effects](#8-background-music--sound-effects)
9. [Visual Theme & Colors (CSS)](#9-visual-theme--styling)
10. [Deploying Your Gift](#10-deploying-your-gift)

---

## 1. Website Title & Names

In `js/notes.config.js`, find the `meta` section:

```javascript
meta: {
  siteTitle: "A Jar of Little Notes for You ✨",
  recipientName: "Eli",           // Appears in header as "Eli's Note Jar"
  senderName: "With all my love",
},
```

---

## 2. Welcome Screen & Introduction

Customize the welcoming card that your recipient sees when first opening the website:

```javascript
welcome: {
  badge: "A Special Digital Gift",
  title: "A Jar of Little Notes",
  subtitle: "Just for you, to open whenever you need a smile.",
  message: "I made something special for you. Inside this glass jar are little folded notes filled with thoughts, memories, and things I wanted you to know. Take your time and open them one by one.",
  buttonText: "Open the Jar ✨",
},
```

---

## 3. Note Opening Modes

You can decide how notes are drawn when the recipient taps the jar:

```javascript
openingMode: "sequential", // Options: "sequential" or "random"
```

- **`"sequential"` (Default / Recommended):** Notes are revealed in exact numerical order (Note 1, then Note 2, etc.). Ideal if you want to tell a story or build up toward the confession.
- **`"random"`:** The recipient randomly pulls any unopened regular note from the jar. Unopened notes never repeat.

> **Note:** Regardless of the mode chosen, the **Final Confession Note** stays safely locked until *every* regular note has been opened!

---

## 4. Regular Notes

Each note inside the `notes: [ ... ]` array is a folded paper card. You can have as many notes as you want (5, 7, 10, 20+).

### Note Structure:

```javascript
{
  id: "note-01",                                      // Unique identifier
  number: 1,                                          // Sequential number
  category: "Memories",                               // Category name
  title: "How We First Met",                          // Note heading
  prompt: "Open to remember our first hello...",       // Teaser quote on folded note
  color: "pink",                                      // "pink" | "yellow" | "lavender" | "blue" | "peach"
  symbol: "🌸",                                       // Emoji seal
  message: `Your heartfelt message goes here.\n\nParagraphs are automatically formatted with proper spacing!`,
}
```

### Tips for Formatting Messages:
- Use backticks (`` ` ``) to write multi-line messages easily.
- Separate paragraphs with a blank line (`\n\n`).
- Line breaks and lists (`1. ...`, `2. ...`) format cleanly inside the card.

---

## 5. Note Categories & Colors

You can organize your notes by themes:

| Category | Recommended Color | Best Used For |
|---|---|---|
| **Memories** | `pink` | Milestones, how you met, first impressions |
| **Appreciation** | `yellow` | Personality traits, reasons why you admire them |
| **Little Reminders** | `lavender` | Encouragement, gentle hugs on rough days |
| **Inside Jokes** | `blue` | Funny moments, silly shared memories |
| **Open When...** | `peach` | Specific moments (when sad, bored, or smiling) |

Available color keywords:
- `pink`
- `yellow`
- `lavender`
- `blue`
- `peach`

---

## 6. The Special Final Confession Note

The final note is configured separately in `finalConfession`. It has its own locked messages, distinctive deep rose / gold glow, and triggers the grand reveal animation with confetti when opened:

```javascript
finalConfession: {
  id: "note-final",
  category: "Final Message",
  title: "One Last Note for You",
  prompt: "The note that was saved for the very end...",
  color: "gold-rose",
  symbol: "💖",
  lockedMessage: "There's one more note waiting for you at the bottom of the jar...",
  unlockedMessage: "One last thing. Open this when you're ready.",
  badgeText: "A Special Confession",
  message: `Write your confession, love letter, or heartfelt closing words here...`,
}
```

---

## 7. Completion Screen

After the final confession note has been opened, the recipient sees a warm completion screen:

```javascript
completion: {
  badge: "All Notes Opened",
  title: "You've Found Every Note!",
  subtitle: "I hope each little paper brought a genuine smile to your face.",
  message: "You can reopen any of your notes anytime you want using the button below...",
  reviewButtonText: "Browse All Notes 💌",
  replayButtonText: "Start Over from the Beginning ↺",
}
```

---

## 8. Background Music & Sound Effects

The application features a built-in Web Audio synthesizer that automatically plays a soft ambient lullaby and paper rustling sounds without requiring any audio downloads.

If you would like to use your own song or sound effects:
1. Copy your song into: `assets/audio/background-music.mp3`
2. Copy your paper sound effect into: `assets/audio/paper-sound.mp3`
3. Configure `audio` in `js/notes.config.js`:

```javascript
audio: {
  enabled: true,
  musicVolume: 0.35,     // 0.0 (silent) to 1.0 (loud)
  soundVolume: 0.5,
  backgroundMusicUrl: "assets/audio/background-music.mp3",
  paperSoundUrl: "assets/audio/paper-sound.mp3",
}
```

---

## 9. Visual Theme & Styling

You can easily adjust the theme colors in [`css/style.css`](../css/style.css) under `:root`:

```css
:root {
  --accent-rose: #f43f5e;       /* Primary romantic accent */
  --accent-gold: #f59e0b;       /* Sparkle and glow accents */
  --accent-lavender: #8b5cf6;   /* Lavender notes */
  --bg-primary: #fdf8f5;        /* Background cream tint */
  --text-main: #3d2b27;         /* Warm dark text */
}
```

---

## 10. Deploying Your Gift

The Virtual Note Jar is 100% static (HTML, CSS, JS) with **zero dependencies** or server requirements:

### Option A: GitHub Pages (Free & Easy)
1. Push this folder to a GitHub repository.
2. In repository **Settings** → **Pages**, set source to `main` branch `/ (root)`.
3. Share the generated link with your recipient!

### Option B: Netlify or Vercel
1. Drag and drop the project folder directly onto Netlify Drop or import via Vercel.
2. Deploy in 5 seconds with a custom link.

### Option C: Local Testing
Double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox directly!

