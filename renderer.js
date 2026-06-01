window.addEventListener('DOMContentLoaded', async () => {

    // ─── DOM REFERENCES ────────────────────────────────────────────────────
    const textarea    = document.getElementById('note');
    const titleInput  = document.getElementById('note-title');
    const saveBtn     = document.getElementById('save');
    const saveAsBtn   = document.getElementById('save-as');
    const openFileBtn = document.getElementById('open-file');
    const newNoteBtn  = document.getElementById('new-note');
    const noteList    = document.getElementById('note-list');
    const statusEl    = document.getElementById('save_status');
    const fontIncreaseBtn = document.getElementById('font-increase');
    const fontDecreaseBtn = document.getElementById('font-decrease');

    // ─── STATE ─────────────────────────────────────────────────────────────
    let notes           = [];       // all notes loaded from JSON
    let currentNoteId   = null;     // id of the note being edited
    let lastSavedContent = '';      // tracks unsaved changes
    let debounceTimer   = null;
    // NEW: Font size control
    let currentFontSize = 16;
    function applyFontSize(size) {
        currentFontSize = Math.min(32, Math.max(10, size));
        textarea.style.fontSize = `${currentFontSize}px`;
    }
    fontIncreaseBtn.addEventListener('click', async () => {
        applyFontSize(currentFontSize + 2);
        await window.electronAPI.saveSettings({ fontSize: currentFontSize });
    });
    fontDecreaseBtn.addEventListener('click', async () => {
        applyFontSize(currentFontSize - 2);
        await window.electronAPI.saveSettings({ fontSize: currentFontSize });
    });


    // NEW: Update word and character count
    function updateWordCount() {
        const text = textarea.value;
        const characters = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const wordCountEl = document.getElementById('word-count');
        wordCountEl.textContent = `Words: ${words} | Characters: ${characters}`;
    }

    // ─── RENDER NOTE LIST ──────────────────────────────────────────────────
    // Draws every note as a clickable item in the sidebar
    function renderNoteList() {
        noteList.innerHTML = ''; // clear existing list

        notes.forEach(note => {
            const item = document.createElement('div');
            // Add 'active' class to highlight the note currently open
            item.className = 'note-item' + (note.id === currentNoteId ? ' active' : '');
            item.innerHTML = `
                <button class="note-item-delete" data-id="${note.id}">x</button>
                <div class="note-item-title">${note.title || 'Untitled'}</div>
                <div class="note-item-date">${new Date(note.updatedAt).toLocaleDateString()}</div>
            `;

            // Click note item to open it
            item.addEventListener('click', async (e) => {
                // If the delete button was clicked, don't also open the note
                if (e.target.classList.contains('note-item-delete')) return;
                await switchNote(note.id);
            });

            // Delete button
            item.querySelector('.note-item-delete').addEventListener('click', async (e) => {
                e.stopPropagation(); // prevent triggering the note open click
                await deleteNote(note.id);
            });

            noteList.appendChild(item);
        });
    }

    // ─── SWITCH NOTE ───────────────────────────────────────────────────────
    // Loads a different note into the editor (with unsaved-changes warning)
    async function switchNote(id) {
        // Check for unsaved changes before switching
        if (textarea.value !== lastSavedContent) {
            const result = await window.electronAPI.newNote();
            if (!result.confirmed) return; // user cancelled – stay on current note
        }

        // Load the selected note
        const note = notes.find(n => n.id === id);
        if (!note) return;

        currentNoteId    = note.id;
        titleInput.value = note.title || '';
        textarea.value   = note.content || '';
        lastSavedContent = note.content || '';
         updateWordCount();
        statusEl.textContent = '';

        renderNoteList(); // refresh sidebar to show active state
    }

    // ─── SAVE CURRENT NOTE ─────────────────────────────────────────────────
    // Saves the currently open note to notes.json
    async function saveCurrentNote() {
        if (!currentNoteId) return;

        const note = {
            id:      currentNoteId,
            title:   titleInput.value || 'Untitled',
            content: textarea.value
        };

        await window.electronAPI.saveNoteJson(note);
        lastSavedContent = textarea.value;

        // Update the note in the local array too (keeps sidebar in sync)
        const index = notes.findIndex(n => n.id === currentNoteId);
        if (index !== -1) {
            notes[index] = { ...notes[index], ...note, updatedAt: new Date().toISOString() };
        }

        renderNoteList();
        statusEl.textContent = `Saved at ${new Date().toLocaleTimeString()}`;
    }

    // ─── DELETE NOTE ───────────────────────────────────────────────────────
    async function deleteNote(id) {
        const result = await window.electronAPI.newNote(); // reuse warning dialog as "are you sure?"
        if (!result.confirmed) return;

        await window.electronAPI.deleteNote(id);
        notes = notes.filter(n => n.id !== id); // remove from local array

        // If we deleted the note that was open, clear the editor
        if (currentNoteId === id) {
            currentNoteId        = null;
            titleInput.value     = '';
            textarea.value       = '';
            lastSavedContent     = '';
            statusEl.textContent = 'Note deleted.';
        }

        renderNoteList();
    }

    // ─── BUTTON LISTENERS ──────────────────────────────────────────────────

    // NEW NOTE BUTTON
    newNoteBtn.addEventListener('click', async () => {
        if (textarea.value !== lastSavedContent) {
            const result = await window.electronAPI.newNote();
            if (!result.confirmed) return;
        }

        // Create a new note object
        const newNote = {
            id:        Date.now().toString(), // unique id from timestamp
            title:     'Untitled',
            content:   '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await window.electronAPI.saveNoteJson(newNote);
        notes.unshift(newNote);             // add to the top of the list
        currentNoteId        = newNote.id;
        titleInput.value     = '';
        textarea.value       = '';
        lastSavedContent     = '';
        renderNoteList();
        titleInput.focus();                 // move cursor to title field
        statusEl.textContent = 'New note created.';
    });

    // SAVE BUTTON
    saveBtn.addEventListener('click', async () => {
        await saveCurrentNote();
         // NEW: Show native notification on manual save only
        new Notification('Note Saved', {
            body: `"${titleInput.value || 'Untitled'}" has been saved.`
        });
    });

    // SAVE AS BUTTON (exports to a .txt file, kept from previous version)
    saveAsBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.saveAs(textarea.value);
        if (result.success) {
            statusEl.textContent = `Exported to: ${result.filePath}`;
        }
    });

    // OPEN FILE BUTTON (imports a .txt file into the current note)
    openFileBtn.addEventListener('click', async () => {
        const result = await window.electronAPI.openFile();
        if (result.success) {
            textarea.value       = result.content;
            lastSavedContent     = result.content;
            statusEl.textContent = `Opened: ${result.filePath}`;
        } else {
            statusEl.textContent = 'Open cancelled.';
        }
    });

    // ─── AUTO-SAVE (5-second debounce) ─────────────────────────────────────

    // Auto-save when content changes
    textarea.addEventListener('input', () => {
        updateWordCount();
        statusEl.textContent = 'Unsaved changes...';
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(saveCurrentNote, 5000);
    });

    // Also auto-save when title changes
    titleInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(saveCurrentNote, 5000);
    });

    // ─── MENU ACTION LISTENERS ─────────────────────────────────────────────
    // These handle keyboard shortcuts from the File menu in main.js

    window.electronAPI.onMenuAction('menu-new-note', () => {
        newNoteBtn.click();
    });

    window.electronAPI.onMenuAction('menu-open-file', () => {
        openFileBtn.click();
    });

    window.electronAPI.onMenuAction('menu-save', () => {
        saveBtn.click();
    });

    window.electronAPI.onMenuAction('menu-save-as', () => {
        saveAsBtn.click();
    });

    // ─── STARTUP: LOAD ALL NOTES ───────────────────────────────────────────

    notes = await window.electronAPI.getNotes();
    // NEW: Load saved settings on startup
    const settings = await window.electronAPI.getSettings();
    applyFontSize(settings.fontSize || 16);

    if (notes.length > 0) {
        // Open the most recently updated note
        const mostRecent = notes.reduce((a, b) =>
            new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b
        );
        await switchNote(mostRecent.id);
    } else {
        // No notes yet – trigger New Note automatically
        newNoteBtn.click();
    }

    renderNoteList();
});