require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
app.use(cors({ origin: true, credentials: true }));
require("./models/connectDB");

const path = require("path");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", require("./router/authRouter"));
app.use("/note", require("./router/notesRouter"));
app.use("/", require("./router/profile"));

const frontendPath = path.join(__dirname,  "frontend");
console.log(frontendPath);
app.use(express.static(frontendPath));

app.get(["/", "/login"], (req, res) => {
  res.sendFile(path.join(frontendPath, '/html/signup.html'));
});


app.use((req, res) => {
  res.status(404).json({ success: false, message: "404 page" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://127.0.0.1:${port}`);
})
