# 🫙 Virtual Note Jar — An Interactive Digital Gift

> An interactive, responsive single-page web application designed as a personalized digital gift. Instead of a traditional letter, the recipient interacts with a beautifully illustrated glass jar containing colorful folded notes that float out, unfold in paper-style message cards, and unlock a special final confession.

---

## ✨ Features

- **Illustrated Glass Jar:** Layered SVG glass container featuring realistic transparency, curved reflections, cork stopper with tied ribbon, and dynamic fullness levels.
- **Dynamic Physics & Animations:**
  - Folded origami paper notes nestled inside the jar that decrease as notes are drawn.
  - Smooth multi-stage extraction animation: Note floats upward through the jar neck, glides to the center of the screen, and expands into a paper letter.
- **Paper-Style Message Modal:**
  - Textured paper card styling with washi tape, wax seals, category badge, and smooth paragraph formatting.
  - Safe text rendering protecting against code injection.
- **Two Note Opening Modes:**
  - **Sequential Story (Default):** Unfolds notes in predetermined narrative order.
  - **Random Draw:** Draws randomly from remaining unopened notes.
- **Locked Final Confession:**
  - Strictly locked until every regular note has been opened.
  - Distinct deep rose / gold appearance with glowing pulse effect.
  - Grand reveal animation with confetti burst, romantic background glow, and magical chimes.
- **Opened Notes Drawer ("Memory Box"):**
  - Allows recipient to revisit and re-read previously opened notes at any time without resetting progress.
- **Audio & Sound Design:**
  - Built-in Web Audio API synthesizer generating gentle lullaby chords and paper rustling effects without needing external MP3 downloads.
  - Seamless support for custom background music and sound effect MP3 files.
  - Audio mute/unmute control respecting browser autoplay policies.
- **Local Progress Persistence:**
  - Saves progress in `localStorage` with in-memory fallback for private/incognito browsing.
  - Refreshing does not lose opened notes or unlocked states.
  - Includes a clear "Reset Jar" option.
- **Accessibility & Responsiveness:**
  - Fully responsive across smartphones, tablets, laptops, and wide desktop screens.
  - Keyboard navigable (`Enter`/`Space` on jar, `Escape` to close modal).
  - Honors `prefers-reduced-motion` settings.

---

## 📁 Project Structure

```
virtual-note-jar/
├── index.html                   # Semantic HTML5 entry point
├── README.md                    # Project documentation & overview
├── .gitignore                   # Git ignore file
├── assets/
│   ├── audio/                   # Optional custom MP3 audio files
│   ├── images/
│   │   └── favicon.svg          # Glass jar SVG favicon
│   └── fonts/                   # Local fonts (if added)
├── css/
│   ├── style.css                # Design system, layout, glass jar & paper styling
│   ├── animations.css           # Keyframes, physics, extraction, unfolding, confetti
│   └── responsive.css           # Breakpoints for mobile, tablet, and desktop
├── js/
│   ├── notes.config.js          # Creator configuration (messages, colors, modes)
│   ├── storage.js               # Safe localStorage manager with fallback
│   ├── audio.js                 # Web Audio synthesizer & sound effects
│   ├── state.js                 # Progression logic & unlock rules
│   ├── jar.js                   # Jar rendering, pile layout, and extraction
│   ├── notes.js                 # Modal card, confetti, and opened notes drawer
│   └── app.js                   # Main application controller
└── docs/
    └── CUSTOMIZATION_GUIDE.md   # Step-by-step personalization guide
```

---

## 🚀 Getting Started

No build tools, bundlers, Node.js, or backend servers are required!

### Run Locally:
Simply double-click `index.html` to open it in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

Or run a lightweight local static server:
```bash
# Python 3
python -m http.server 8080

# Or Node.js
npx serve
```
Then visit `http://localhost:8080` in your browser.

---

## 🎨 Customizing Content & Notes

All notes, titles, messages, categories, and colors can be customized inside:
👉 **[`js/notes.config.js`](js/notes.config.js)**

For an extensive step-by-step walkthrough, see **[`docs/CUSTOMIZATION_GUIDE.md`](docs/CUSTOMIZATION_GUIDE.md)**.

---

## 🌐 Free Static Deployment

This project is 100% client-side and can be hosted for free on:
- **GitHub Pages:** Push to GitHub and enable Pages in repository settings.
- **Netlify Drop:** Drag and drop this folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel:** Import your repository or deploy via `vercel` CLI.

---

## 🔒 Privacy Notice

- No data or personal messages are ever sent to external servers or third-party analytics.
- Progress is stored strictly in the recipient's local browser `localStorage`.
- Note content in static web applications is embedded in JavaScript; anyone with direct access to the website source code or web inspector can view the messages.

---

Made with ❤️ as a timeless digital gift.

