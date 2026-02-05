const express = require("express");
const authApi = require("../middlewares/authValidation");
const router = express.Router();
const userModel = require("../models/userModel");

router.get("/home", authApi, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user)
      return res.status(404).json({success: false, message: "User not found"});

    res.status(200).json({
      cookieExist: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

router.get("/profile", authApi, async (req, res) => {
  try {
    const user = await userModel.findOne({_id: req.userId}).select("-password");
    res.status(200).json({message:'sucessfull',user:user});
  } catch (error) {
    res.status(500).json({message:'something went worng, refresh again or login again'});
  }
});

module.exports = router;
