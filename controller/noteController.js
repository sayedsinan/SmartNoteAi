const noteService = require('../services/noteService');
const noteController = {};

noteController.createNote = (req, res) => {
    const { title, content } = req.body;
    noteService.createNote(title, content, (err, noteId) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create note' });
        }
        res.status(201||200).json({ message: 'Note created', noteId });
    });
};

noteController.getAllNotes = (req, res) => {
    noteService.getAllNotes((err, notes) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve notes' });
        }
        res.json(notes);
    });
};

noteController.getNoteById = (req, res) => {
    const { id } = req.params;
    noteService.getNoteById(id, (err, note) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve note' });
        }
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note);
    });
};

noteController.updateNote = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    noteService.updateNote(id, title, content, (err, affectedRows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update note' });
        }
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note updated' });
    });
};
noteController.deleteNote = (req, res) => {   
    const { id } = req.params;
    noteService.deleteNote(id, (err, affectedRows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete note' });
        }
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted' });
    });
};

module.exports = noteController;