const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getNotes:     ()     => ipcRenderer.invoke('get-notes'),
    saveNoteJson: (note) => ipcRenderer.invoke('save-note-json', note),
    deleteNote:   (id)   => ipcRenderer.invoke('delete-note', id),
    getSettings:  ()         => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    exportPdf: (title,content) => ipcRenderer.invoke('export-pdf', {title, content}), //Feature 1: Exporting to pdf
    saveAs: (text) => ipcRenderer.invoke('save-as', text),
    newNote: () => ipcRenderer.invoke('new-note'),
    openFile: () => ipcRenderer.invoke('open-file'),
    onMenuAction: (channel, callback) => ipcRenderer.on(channel, callback)
});
