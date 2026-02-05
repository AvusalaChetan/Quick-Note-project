require("dotenv").config();
const express = require("express");
const connectDB = require("./models/connectDB");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const PORT = Number(process.env.PORT) || 8080;
app.use(cors({ origin: true, credentials: true }));

const path = require("path");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/auth", require("./router/authRouter"));
app.use("/note", require("./router/notesRouter"));
app.use("/", require("./router/profile"));


const frontendPath = path.join(__dirname, "views");
app.use(express.static(frontendPath));

app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const isDbUp = dbState === 1;
  return res.status(isDbUp ? 200 : 503).json({ ok: true, dbState });
});

app.get("/", (req, res) => {
  return res.redirect("/html/signup.html");
});


app.use((req, res) => {
  return res.sendFile(path.join(frontendPath, '/html/404.html'));
});

app.use((err, req, res, next) => {
  return res.status(500).json({ success: false, message: "Something went wrong!" });
});


// fun start server 
const startServer = async () => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
  });

  const dbReady = await connectDB();
  if (!dbReady) {
    console.warn("MongoDB not available. Server is running without DB.");
  }
};

startServer();

