const noteService = require('../services/noteService');
const geminiService = require('../services/geminiService');

const noteController = {};

// Create Note
noteController.createNote = (req, res) => {

    const {
        title,
        original_notes,
        generated_content,
        difficulty_level
    } = req.body;

    noteService.createNote(
        title,
        original_notes,
        generated_content,
        difficulty_level,
        (err, noteId) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create note'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Note created',
                noteId
            });
        }
    );
};

// Get All Notes
noteController.getAllNotes = (req, res) => {

    noteService.getAllNotes((err, notes) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve notes'
            });
        }

        res.json({
            success: true,
            data: notes
        });
    });
};

// Get Note By Id
noteController.getNoteById = (req, res) => {

    const { id } = req.params;

    noteService.getNoteById(id, (err, note) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve note'
            });
        }

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            data: note
        });
    });
};

// Update Note
noteController.updateNote = (req, res) => {

    const { id } = req.params;

    const {
        title,
        original_notes,
        generated_content,
        difficulty_level
    } = req.body;

    noteService.updateNote(
        id,
        title,
        original_notes,
        generated_content,
        difficulty_level,
        (err, affectedRows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update note'
                });
            }

            if (!affectedRows) {
                return res.status(404).json({
                    success: false,
                    message: 'Note not found'
                });
            }

            res.json({
                success: true,
                message: 'Note updated'
            });
        }
    );
};

// Delete Note
noteController.deleteNote = (req, res) => {

    const { id } = req.params;

    noteService.deleteNote(id, (err, affectedRows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to delete note'
            });
        }

        if (!affectedRows) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            message: 'Note deleted'
        });
    });
};
noteController.generateNote = async (req, res) => {
    try {
        const { notes } = req.body;

        if (!notes) {
            return res.status(400).json({
                success: false,
                message: 'Notes are required'
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

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = noteController;