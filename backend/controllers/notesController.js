const notesModel = require("../models/notesModel");
const userModel = require("../models/userModel");

const createNotes = async (req, res) => {
  const {title, content} = req.body;

  try {
    const newNotes = await notesModel.create({
      title,
      content,
      owner: req.userId,
    });

    return res
      .status(200)
      .json({message: "Note created successfully.", success: true});
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to create note.", success: false});
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await notesModel.find({owner: req.userId});
    return res.status(200).json(notes);
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to get note.", success: false});
  }
};

const editNotes = async (req, res) => {
  const {title, content} = req.body;

  const {id} = req.params;
  const note = await notesModel.findById(req.params.id);
  if (!note) return 404;

  if (note.owner.toString() !== req.user.id) {
    return res.status(403).json({message: "Forbidden"});
  }
  try {
    const notes = await notesModel.findOneAndUpdate(
      {_id: id},
      {
        $set: {
          title,
          content,
        },
      },
      {new: true}
    );
    return res
      .status(200)
      .json({message: "successfully to edit note.", success: true});
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to edit note.", success: false});
  }
};

const deleteNote = async (req, res) => {
  const {id} = req.params;
  const note = await notesModel.findById(req.params.id);
  if (!note) return 404;

  if (note.owner.toString() !== req.user.id) {
    return res.status(403).json({message: "Forbidden"});
  }
  try {
    const deleteNote = await notesModel.findOneAndDelete({_id: id});
    res.send(deleteNote);
  } catch (error) {
    return res
      .status(500)
      .json({message: "Failed to delete note.", success: false});
  }
};

module.exports = {createNotes, getAllNotes, editNotes, deleteNote};
