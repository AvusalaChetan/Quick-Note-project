const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {})
  .catch((error) => console.log(error));

module.exports = mongoose.connection; 