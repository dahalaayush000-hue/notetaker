


window.addEventListener('DOMContentLoaded', async () => {
  const textarea = document.getElementById('note');
  const saveBtn = document.getElementById('save');
  
// NEW: Save As button
const saveAsBtn = document.getElementById('save-as');

saveAsBtn.addEventListener('click', async () => {
    const result = await window.electronAPI.saveAs(textarea.value);

    if (result.success) {
        lastSavedText = textarea.value;
        statusEl.textContent = `Saved to: ${result.filePath}`;
    } else {
        statusEl.textContent = 'Save As cancelled.';
    }
});


  // Load saved note on startup
  const savedNote = await window.electronAPI.loadNote();
  textarea.value = savedNote;

  saveBtn.addEventListener('click', async () => {
    await window.electronAPI.saveNote(textarea.value);
    alert('Note saved successfully!');
  });
});

