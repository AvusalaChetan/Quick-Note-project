const mongoose = require("mongoose");
const { emailRegex } = require("../utils/emailformat");

const allowedDomains = ["gmail.com", "outlook.com"];

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (value) => {
        if (!emailRegex.test(value)) return false;
        const domain = value.split("@")[1].toLowerCase();
        if (!allowedDomains.includes(domain)) return false;
        return true;
      },
      message: "invalid email",
    },
  },
  password: { type: String },
  notes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Notes"},
  ],
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
