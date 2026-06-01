# Quick Note Taker

A desktop note-taking app built with Electron for my Software Engineering course.

---

## What it does

- Create and manage multiple notes
- Notes are saved automatically every 5 seconds
- All notes stored locally in a JSON file
- Sidebar shows all your notes with last modified date
- System tray icon keeps the app running in the background
- Native file menu with keyboard shortcuts (Ctrl+N, Ctrl+S, etc.)

---

## Tech

- Electron v40.8.3
- Node.js 18+
- Vanilla JavaScript (no frameworks)

---

## Getting started

```bash
git clone https://github.com/dahalaayush000-hue/notetaker.git
cd notetaker
npm install
npm start
```

---

## Project structure
notetaker/
├── main.js        # Main process – handles file system, IPC, tray, menu
├── preload.js     # Bridge between main and renderer
├── renderer.js    # UI logic – note list, editor, save, delete
├── index.html     # App layout and styles
└── package.json


---

## Where notes are saved

Notes are stored as a JSON file on your machine:

- Mac: `~/Library/Application Support/quick-note-taker/notes.json`
- Windows: `%APPDATA%\quick-note-taker\notes.json`

---

## Author

Aayush Dahal