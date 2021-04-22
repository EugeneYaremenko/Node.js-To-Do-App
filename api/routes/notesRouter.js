const express = require('express');
const router = express.Router();
const NotesController = require('../controllers/notesController');
const { authorize } = require('../routes/middlewares/authorize');

router.get('/', authorize, NotesController.getNotes);
router.get('/:id', authorize, NotesController.getNoteById);
router.post('/', authorize, NotesController.createNote);
router.put('/:id', authorize, NotesController.updateNote);
router.delete('/:id', authorize, NotesController.deleteNote);

module.exports = router;
