const mongoose = require("mongoose");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (retries = 5, delayMs = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      console.log("MongoDB connected");
      return true;
    } catch (err) {
      console.error(`MongoDB connection failed (attempt ${attempt}/${retries})`, err);
      if (attempt < retries) {
        await sleep(delayMs);
      }
    }
  }
  return false;
};

module.exports = connectDB;
