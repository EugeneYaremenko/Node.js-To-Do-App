const express = require("express");
const router = express.Router();

const notesController = require("../controllers/notesController");

router.get("/", notesController.getNotes);
router.get("/:id", notesController.getById);
router.post("/create", notesController.createNotes);
router.delete("/delete", notesController.deleteNotes);
router.putch("/update", notesController.updateNotes);

module.exports = router;
