window.addEventListener('DOMContentLoaded', async () => {
    const textarea = document.getElementById('note');
    const statusEl = document.getElementById('status');
    let currentFilePath = null;
    let lastSavedText = '';

    // Load initial data
    const saved = await window.electronAPI.loadNote();
    textarea.value = saved;
    lastSavedText = saved;
    let autoSaveTimer;
    textarea.addEventListener('input', () => {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(async () => {
            await window.electronAPI.smartSave(textarea.value, currentFilePath);
            lastSavedText = textarea.value;
            statusEl.textContent = 'Auto-saved.';
        }, 5000);
    });

    // SAVE BUTTON
    document.getElementById('save').addEventListener('click', async () => {
        const result = await window.electronAPI.smartSave(textarea.value, currentFilePath);
        if (result.success) {
            currentFilePath = result.filePath;
            lastSavedText = textarea.value;
            // if(statusEl) statusEl.textContent = "Saved!";
            statusEl.textContent = `Saved to: ${result.filePath}`;
        }
    });

    // OPEN BUTTON
    document.getElementById('open-file').addEventListener('click', async () => {
        const result = await window.electronAPI.openFile();
        if (result.success) {
            textarea.value = result.content;
            currentFilePath = result.filePath;
            lastSavedText = result.content;
            statusEl.textContent = `Opened: ${result.filePath}`;
             } else {
            statusEl.textContent = 'Open cancelled.';
        }
            

        
    });

    // SAVE AS BUTTON
    document.getElementById('save-as').addEventListener('click', async () => {
        const result = await window.electronAPI.saveAs(textarea.value);
        if (result.success) {
            currentFilePath = result.filePath;
            lastSavedText = textarea.value;

            statusEl.textContent = `Saved to: ${result.filePath}`;

        }
    });

    // NEW NOTE BUTTON
    document.getElementById('new-note').addEventListener('click', async () => {
        if (textarea.value !== lastSavedText) {
            const res = await window.electronAPI.newNote();
          if (res.confirmed) {
            textarea.value = '';
            currentFilePath = null;
            lastSavedText = '';
            statusEl.textContent = 'New note started.';
            } else {
                statusEl.textContent = 'New note cancelled.';
            }
            return; 
        }
         textarea.value = '';
        currentFilePath = null;
        lastSavedText = '';
        statusEl.textContent = 'New note started.';
    });
});
// NEW: Menu action listeners
window.electronAPI.onMenuAction('menu-new-note', () => {
  document.getElementById('new-note').click();
});

window.electronAPI.onMenuAction('menu-open-file', () => {
  document.getElementById('open-file').click();
});

window.electronAPI.onMenuAction('menu-save', () => {
  document.getElementById('save').click();
});

window.electronAPI.onMenuAction('menu-save-as', () => {
  document.getElementById('save-as').click();
});