const express = require('express');
const router = express.Router();

const NotesController = require('../controllers/notesController');
const NotesValidation = require('../helpers/validation/notesValidation');

const { authorize } = require('../routes/middlewares/authorize');

router.get(
  '/', 
  authorize,
  NotesController.getNotes
  );
router.get(
  '/:id',
  authorize,
  NotesValidation.validateNoteId,
  NotesController.getNoteById
);
router.post(
  '/',
  authorize,
  NotesValidation.validateCreateNote,
  NotesController.createNote
);
router.put(
  '/:id',
  authorize,
  NotesValidation.validateUpdateNote,
  NotesController.updateNote
);
router.delete(
  '/:id',
  authorize,
  NotesValidation.validateNoteId,
  NotesController.deleteNote
);

module.exports = router;
