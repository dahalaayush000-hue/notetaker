# Quick Note Taker

Group 3 — Software Engineering Final Project

## Group Members

| Name | Student ID | Feature |
|------|------------|---------|
| Dahal Aayush | [2024991017] | Export as PDF |
| Chapagain Shankar | [2024591075] | Zoom In/Out |
| Bhusal Prabin | [2024891036] | Note Statistics |
| Khadka Pawan | [2024991080] | Auto-backup |
| Neupane Roshan | [2024991012] | Keyboard Shortcuts |

---

## What the App Does

Quick Note Taker is a desktop app built with Electron. You can create multiple notes, edit them, and they save automatically. Notes are stored locally as a JSON file. The app has a sidebar to switch between notes, search, dark mode, categories, and runs in the system tray so it stays open in the background.

---

## New Features

Export as PDF— Dahal Aayush

Exports the current note as a PDF file. A save dialog lets you pick where to save it. The app creates a hidden window with just the note title and content, converts it to PDF using Electron's printToPDF API, then saves it to disk.

Files changed: `main.js`, `preload.js`, `renderer.js`, `index.html`

---

Zoom In/Out— Chapagain Shankar

Two buttons zoom the entire app in and out using Electron's webContents.setZoomFactor() API. Each click changes zoom by 10%. Zoom is limited between 50% and 200%.

Files changed: `main.js`, `preload.js`, `renderer.js`, `index.html`

---

Note Statistics— Bhusal Prabin

A Stats button shows a popup with live data about your notes — total notes, total words, average words per note, and the longest note title. All calculated from the notes already in memory, no file reading needed.

Files changed: `renderer.js`, `index.html`

---

Auto-backup— Khadka Pawan

Notes are automatically backed up every 5 minutes to a QuickNoteTaker_Backups folder in your Documents. Each backup is a timestamped copy of the notes file. There is also a manual Backup button for immediate backup.

Files changed: `main.js`, `preload.js`, `renderer.js`, `index.html`

---

Keyboard Shortcut Cheat Sheet— Neupane Roshan

A Shortcuts button shows a popup listing all keyboard shortcuts in the app. No IPC needed — runs entirely in the renderer process.

Files changed: `renderer.js`, `index.html`

---

## How to Run

```bash
git clone https://github.com/dahalaayush000-hue/notetaker.git
cd notetaker
npm install
npm start
```

---

## How to Install

macOS — open the `.dmg` file from the `dist/` folder and drag the app to Applications.

Windows — run the `.exe` installer from the `dist/` folder and follow the steps.

## Features from Class

- Create, edit, save, and delete multiple notes
- Auto-save with 5-second debounce timer
- Save As and Open File dialogs
- Smart Save to current file path
- New Note with unsaved changes warning
- Notes stored in JSON with title, content, and timestamps
- Sidebar with note list, active state, and delete support
- App Menu with keyboard shortcuts (Ctrl+N, S, O, Shift+S, Q)
- System Tray — app stays running when window is closed
- Live word and character count
- Font size control (A+ / A-) with saved preference
- Native notifications on manual save
- Dark mode and light mode toggle with saved preference
- Real-time note search by title and content
- Pin a note — pinned notes stay at top of sidebar
- Note categories with color-coded badges and filter
- App packaged as installable file using electron-builder
