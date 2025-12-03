const express = require("express");
const router = express.Router();
const authApi = require("../middlewares/authValidation");
const {
  createNotes,
  getAllNotes,
  editNotes,
  deleteNote,
} = require("../controllers/notesController");

const checkField = (req, res, next) => {
  const {title, content} = req.body;
  if (!title || !content)
    return res
      .status(404)
      .json({message: "title and content field are require", sucess: false});
  next();
};

router.post("/", authApi, checkField, createNotes);
router.get("/", authApi, getAllNotes);
router.patch("/:id", authApi, checkField, editNotes);
router.delete("/:id", authApi, deleteNote);

module.exports = router;
