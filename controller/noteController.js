const noteService = require('../backend/services/noteService');
const geminiService = require('../backend/services/geminiService');
const axios = require('axios');

const noteController = {};

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

noteController.createNote = (req, res) => {
    const { title, content, generated_content, difficulty_level } = req.body;

    noteService.createNote(
        title,
        content,
        generated_content ?? null,
        difficulty_level ?? 'medium',
        (err, noteId) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create note' });
            }
            res.status(201).json({ message: 'Note created', noteId });
        }
    );
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

        // Step 1: Generate study material via Gemini
        const generatedContent = await geminiService.generateStudyMaterial(notes);

        // Step 2: Save via internal API call to createNote endpoint
        const internalRes = await axios.post(`${BASE_URL}/api/notes`, {
            title: "AI Generated Study Material",
            content: notes,
            generated_content: generatedContent,
            difficulty_level: 'medium'
        });

        res.status(200).json({
            success: true,
            message: "Study material generated and saved successfully",
            noteId: internalRes.data.noteId,
            data: generatedContent
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