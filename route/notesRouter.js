const router = require('express').Router();
const noteController = require('../controller/noteController');

router.post('/notes', noteController.createNote);
router.get('/notes', noteController.getAllNotes);
router.get('/notes/:id', noteController.getNoteById);
router.put('/notes/:id', noteController.updateNote);
router.post('/generate', noteController.generateNote);
router.delete('/notes/:id', noteController.deleteNote);

module.exports = router;