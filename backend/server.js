require("dotenv").config();
const express = require("express");
const connectDB = require("./models/connectDB");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors({ origin: true, credentials: true }));

const path = require("path");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", require("./router/authRouter"));
app.use("/note", require("./router/notesRouter"));
app.use("/", require("./router/profile"));

const frontendPath = path.join(__dirname,  "views");
console.log(frontendPath);
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, '/html/signup.html'));
});


app.use((req, res) => {
  res.sendFile(path.join(frontendPath, '/html/404.html'));
  
});

app.use((err, req, res, next) => {
  res.status(500).json({ success: false, message: "Something went wrong!" });
});


// fun start server 
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

