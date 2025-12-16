const mongoose = require("mongoose");
const { emailRegex } = require("../utils/emailformat");
const allowedDomains = ["gmail.com", "outlook.com"];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]  
  },
  email: {
    type: String,
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true, 
    trim: true,      
    validate: {
      validator: (value) => {
        if (!emailRegex.test(value)) return false;
        const domain = value.split("@")[1].toLowerCase();
        return allowedDomains.includes(domain);
      },
      message: "Invalid email or domain not allowed"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"], 
    minlength: [6, "Password must be at least 6 characters"]  
  },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notes" }]
}, {
  timestamps: true  
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
