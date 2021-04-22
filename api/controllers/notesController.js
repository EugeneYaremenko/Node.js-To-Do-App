const noteModel = require('../models/noteModel');
const NotFoundError = require('../errors/NotFoundError');

class NotesController {
  async getNotes(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const skip = req.query.skip ? parseInt(req.query.skip) : 0;
      const sortOrder = req.query.sort == 'ASC' ? 1 : -1; //ASC || DESC

      const notes = await noteModel.find(
        { userId: req.user._id },
        { __v: 0 },
        { skip, limit, sort: { text: sortOrder } }
      );

      if (!notes) {
        res.json({ message: 'Notes not found' });
      }

      res.json({ notes });
    } catch (err) {
      next(err);
    }
  }

  async getNoteById(req, res, next) {
    try {
      const noteId = req.params.id;

      const note = await noteModel.findById(noteId, { __v: 0 });

      if (!note) {
        throw new NotFoundError();
      }

      return res.status(200).json(note);
    } catch (err) {
      next(err);
    }
  }

  async createNote(req, res, next) {
    const note = new noteModel({ text: req.body.text, userId: req.user._id });

    await note.save();

    return res.json({ message: 'Note created' });
  }

  async updateNote(req, res, next) {
    try {
      const noteId = req.params.id;

      const noteToUpdate = await noteModel.findByIdAndUpdate(
        noteId,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      if (!noteToUpdate) {
        throw new NotFoundError();
      }

      return res.status(200).send({ message: 'Note updated' });
    } catch (err) {
      next(err);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const noteId = req.params.id;

      const deleteNote = await noteModel.findByIdAndDelete(noteId);

      if (!deleteNote) {
        throw new NotFoundError();
      }

      return res.status(200).send({ message: 'Note deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotesController();
