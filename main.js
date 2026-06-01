const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
// NEW: Path for the notes JSON file
const notesFilePath = path.join(app.getPath('userData'), 'notes.json');
const settingsFilePath = path.join(app.getPath('userData'), 'settings.json');

// NEW: Helper – read all notes from the JSON file
function readNotes() {
    if (!fs.existsSync(notesFilePath)) {
        return [];
    }
    const raw = fs.readFileSync(notesFilePath, 'utf-8');
    return JSON.parse(raw);
}

// NEW: Helper – write all notes to the JSON file
function writeNotes(notes) {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf-8');
}
// NEW: Read settings from file
function readSettings() {
    if (!fs.existsSync(settingsFilePath)) {
        return { fontSize: 16 };
    }
    const raw = fs.readFileSync(settingsFilePath, 'utf-8');
    return JSON.parse(raw);
}

// NEW: Write settings to file
function writeSettings(settings) {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
}

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    win.loadFile('index.html');
    /// NEW: Hide window instead of closing
    win.on('close', (event) => {
        event.preventDefault();    // stop the window from actually closing
        win.hide();                // hide it instead 
});
}

// --- HANDLERS ---

ipcMain.handle('save-note', async (event, text, filePath) => {
    try {
        const savePath = filePath || path.join(app.getPath('documents'), 'quicknote.txt');
        fs.writeFileSync(savePath, text, 'utf-8');

        // // This creates the "Success" popup
        // await dialog.showMessageBox({
        //     type: 'info',
        //     title: 'Success',
        //     message: 'Note saved successfully!',
        //     buttons: ['OK']
        // });

        return { success: true, filePath: savePath };
    } catch (err) {
        return { success: false };
    }
});

// NEW: Load note

ipcMain.handle('load-note', async () => {
    const filePath = path.join(app.getPath('documents'), 'quicknote.txt');
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
});

// NEW: save as

ipcMain.handle('save-as', async (event, text) => {
    const result = await dialog.showSaveDialog({
        defaultPath: 'mynote.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });
    if (result.canceled) return { success: false };
    fs.writeFileSync(result.filePath, text, 'utf-8');
    return { success: true, filePath: result.filePath };
});

// NEW: Open files 

ipcMain.handle('open-file', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });
    if (result.canceled) return { success: false };
    const content = fs.readFileSync(result.filePaths[0], 'utf-8');
    return { success: true, content, filePath: result.filePaths[0] };
});

// NEW: new notes

ipcMain.handle('new-note', async () => {
    const result = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Discard', 'Cancel'],
        defaultId: 1,                            
        title: 'Unsaved Changes',     
        message: 'You have unsaved changes. Start a new note anyway?'

    });
    return { confirmed: result.response === 0 };
});

// NEW: smartsave

ipcMain.handle('smart-save', async (event, text, filePath) => {
    const targetPath = filePath || path.join(app.getPath('documents'), 'quicknote.txt');
    fs.writeFileSync(targetPath, text, 'utf-8');
    return { success: true, filePath: targetPath };
});
// NEW: Get all notes
ipcMain.handle('get-notes', async () => {
    return readNotes();
});

// NEW: Save a note (create or update)
ipcMain.handle('save-note-json', async (event, note) => {
    const notes = readNotes();
    const index = notes.findIndex(n => n.id === note.id);
    const now = new Date().toISOString();
    if (index === -1) {
        notes.push({ ...note, createdAt: now, updatedAt: now });
    } else {
        notes[index] = { ...notes[index], ...note, updatedAt: now };
    }
    writeNotes(notes);
    return { success: true };
});

// NEW: Delete a note
ipcMain.handle('delete-note', async (event, id) => {
    const notes = readNotes();
    const filtered = notes.filter(n => n.id !== id);
    writeNotes(filtered);
    return { success: true };
});

// NEW: Get settings
ipcMain.handle('get-settings', async () => {
    return readSettings();
});

// NEW: Save settings
ipcMain.handle('save-settings', async (event, settings) => {
    const current = readSettings();
    const updated = { ...current, ...settings };
    writeSettings(updated);
    return { success: true };
});

// NEW: App Menu
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Note',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu-new-note');
        }
      },

      {
        label: 'Open File',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu-open-file');
        }
      },

      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu-save');
        }
      },

      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.send('menu-save-as');
        }
      },

      { type: 'separator' },

      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit()
      }
    ]
  }
];
// NEW: System Tray
let tray = null;

app.whenReady().then(() => {
    createWindow();

    // ... menu setup code ...
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

    // Create tray icon
    tray = new Tray(path.join(__dirname, 'Vector.png'));
    // NEW: Double-click tray icon to show window
tray.on('double-click', () => {
    const win = BrowserWindow.getAllWindows()[0];

    if (win.isVisible()) {
        win.hide();
    } else {
        win.show();
    }
});

    // Tray context menu
    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: () => {
                BrowserWindow.getAllWindows()[0].show();
            }
        },
        {
            label: 'Quit',
            click: () => app.quit()
        }
    ]);

    tray.setToolTip('Quick Note Taker');
    tray.setContextMenu(trayMenu);
});
