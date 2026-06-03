const Router = require('express').Router();
const noteController = require('../controller/noteController');

Router.post('/notes', noteController.createNote);
Router.get('/notes', noteController.getAllNotes);
Router.get('/notes/:id', noteController.getNoteById);
Router.put('/notes/:id', noteController.updateNote);
Router.post('/generate', noteController.generateNote);
Router.delete('/notes/:id', noteController.deleteNote);

module.exports = Router;