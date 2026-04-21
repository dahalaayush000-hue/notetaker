const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

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
}

app.whenReady().then(createWindow);

// --- HANDLERS ---

ipcMain.handle('save-note', async (event, text, filePath) => {
    try {
        const savePath = filePath || path.join(app.getPath('documents'), 'quicknote.txt');
        fs.writeFileSync(savePath, text, 'utf-8');

        // This creates the "Success" popup
        await dialog.showMessageBox({
            type: 'info',
            title: 'Success',
            message: 'Note saved successfully!',
            buttons: ['OK']
        });

        return { success: true, filePath: savePath };
    } catch (err) {
        return { success: false };
    }
});

ipcMain.handle('load-note', async () => {
    const filePath = path.join(app.getPath('documents'), 'quicknote.txt');
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
});

ipcMain.handle('save-as', async (event, text) => {
    const result = await dialog.showSaveDialog({
        defaultPath: 'mynote.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });
    if (result.canceled) return { success: false };
    fs.writeFileSync(result.filePath, text, 'utf-8');
    return { success: true, filePath: result.filePath };
});

ipcMain.handle('open-file', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openFile'] });
    if (result.canceled) return { success: false };
    const content = fs.readFileSync(result.filePaths[0], 'utf-8');
    return { success: true, content, filePath: result.filePaths[0] };
});

ipcMain.handle('new-note', async () => {
    const result = await dialog.showMessageBox({
        type: 'warning',
        buttons: ['Discard', 'Cancel'],
        message: 'Unsaved changes will be lost. Continue?'
    });
    return { confirmed: result.response === 0 };
});