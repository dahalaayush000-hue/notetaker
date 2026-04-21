window.addEventListener('DOMContentLoaded', async () => {
    const textarea = document.getElementById('note');
    const statusEl = document.getElementById('status');
    let currentFilePath = null;
    let lastSavedText = '';

    // Load initial data
    const saved = await window.electronAPI.loadNote();
    textarea.value = saved;
    lastSavedText = saved;

    // SAVE BUTTON
    document.getElementById('save').addEventListener('click', async () => {
        const result = await window.electronAPI.smartSave(textarea.value, currentFilePath);
        if (result.success) {
            currentFilePath = result.filePath;
            lastSavedText = textarea.value;
            if(statusEl) statusEl.textContent = "Saved!";
        }
    });

    // OPEN BUTTON
    document.getElementById('open-file').addEventListener('click', async () => {
        const result = await window.electronAPI.openFile();
        if (result.success) {
            textarea.value = result.content;
            currentFilePath = result.filePath;
            lastSavedText = result.content;
        }
    });

    // SAVE AS BUTTON
    document.getElementById('save-as').addEventListener('click', async () => {
        const result = await window.electronAPI.saveAs(textarea.value);
        if (result.success) {
            currentFilePath = result.filePath;
            lastSavedText = textarea.value;
        }
    });

    // NEW NOTE BUTTON
    document.getElementById('new-note').addEventListener('click', async () => {
        if (textarea.value !== lastSavedText) {
            const res = await window.electronAPI.newNote();
            if (!res.confirmed) return;
        }
        textarea.value = '';
        currentFilePath = null;
        lastSavedText = '';
    });
});