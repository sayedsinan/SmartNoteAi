const noteService = require('../services/noteService');
const geminiService = require('../services/geminiService');
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
noteController.generateNote = async (req, res) => {
    try {
        const { notes } = req.body;

        if (!notes) {
            return res.status(400).json({
                success: false,
                message: "Notes are required"
            });
        }

        // Generate study material
        const generatedContent = await geminiService.generateStudyMaterial(notes);

        // Save generated content as a note
        const title = "AI Generated Study Material";

        noteService.createNote(title, generatedContent, (err, noteId) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to save generated note"
                });
            }

            res.status(200).json({
                success: true,
                message: "Study material generated and saved successfully",
                noteId,
                data: generatedContent
            });
        });

    } catch (error) {
        console.error("Generate Study Material Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = noteController;