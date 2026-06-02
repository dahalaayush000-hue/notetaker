# Quick Note Taker — Extended Edition

## 1. Group Information

| Name | Student ID | Role |
|------|------------|------|
| Dahal Aayush | [] | Export as PDF feature |
| Chapagain Shankar | [] | Zoom In/Out feature |
| Bhusal Prabin | [] | Note Statistics feature |
| Khadka Pawan | [] | Spell Check feature |
| Neupane Roshan | [] | Keyboard Shortcut Cheat Sheet feature |

**Group Number:** []

---

## 2. App Description

Quick Note Taker is a desktop note-taking application built with Electron. It allows users to create, edit, save, and manage multiple notes locally. Notes are stored in a JSON file on the user's machine. The app includes a sidebar for browsing notes, real-time search, dark mode, font size control, note pinning, categories, and automatic saving. It runs on both Windows and macOS.

---

## 3. New Features Added

### Export as PDF
**Built by:** Dahal Aayush  
**Description:** Exports the currently open note as a PDF file. A save dialog lets the user choose where to save it. A hidden BrowserWindow is created with just the note title and content, and Electron's `printToPDF` API converts it to a PDF file.  
**Files modified:** `main.js`, `preload.js`, `renderer.js`, `index.html`

### Zoom In/Out
**Built by:** Chapagain Shankar  
**Description:** Two buttons (🔍+ and 🔍-) zoom the entire app in and out using Electron's `webContents.setZoomFactor()` API. Zoom is capped between 0.5x and 2.0x to prevent unusable extremes.  
**Files modified:** `main.js`, `preload.js`, `renderer.js`, `index.html`

### Note Statistics
**Built by:** Bhusal Prabin  
**Description:** A Stats button shows a popup with live statistics calculated from all notes in memory — total notes, total words, average words per note, and the longest note title. Uses JavaScript's `reduce()` method to calculate totals.  
**Files modified:** `renderer.js`, `index.html`

### Spell Check
**Built by:** Khadka Pawan  
**Description:** Real-time spell checking is enabled in the note editor using Electron's built-in Chromium spell checker. Misspelled words are underlined in red. Right-clicking a misspelled word shows correction suggestions using a custom context menu built with Electron's `Menu` and `MenuItem` APIs.  
**Files modified:** `main.js`

### Keyboard Shortcut Cheat Sheet
**Built by:** Neupane Roshan  
**Description:** A Shortcuts button shows a popup listing all keyboard shortcuts available in the app — New Note, Save, Save As, Open File, and Quit. Built entirely in the renderer process with no IPC required.  
**Files modified:** `renderer.js`, `index.html`

---

## 4. How to Run the App

1. Install Node.js from https://nodejs.org
2. Open a terminal in the project folder
3. Run: `npm install`
4. Run: `npm start`

---

## 5. How to Install the App

**macOS:**
1. Open the `dist/` folder
2. Double-click `Quick Note Taker-1.0.0-arm64.dmg`
3. Drag the app to your Applications folder
4. Open from Applications

**Windows:**
1. Open the `dist/` folder
2. Run the `.exe` installer
3. Follow the installation steps
4. Open from the Start menu

---

## 6. Features from Class

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