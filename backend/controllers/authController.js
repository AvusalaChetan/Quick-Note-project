const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const { setCookie } = require("../helpers/setCookie");
const { genHash } = require("../helpers/genHash");

function checkInputs(data, res) {
  if (!data.email || !data.password)
    return { valid: false, error: "email and password required" };
  return { valid: true };
}

const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  const result = checkInputs(req.body);
  if (!result.valid) return res.status(400).json({ message: result.error });

  try {
    const userExist = await userModel.findOne({ email });
    if (userExist)
      return res.status(400).json({
        message: "you already have a account here go to login page ",
        signup: false,
      });
    const hash = await genHash(password);
    const newUser = await userModel.create({
      name,
      email,
      password: hash,
    });
    setCookie(newUser, res);
    return res.status(200).json({ message: "signup sucessfull", signup: true });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ message: messages.join(", "), signup: false });
    }
    return res
      .status(500)
      .json({ message: err.message, signup: false });
  }
};

// login --------------------------------------------------------------------------------------

const logIn = async (req, res) => {
  const { email, password } = req.body;
  const result = checkInputs(req.body);
  if (!result.valid) return res.status(400).json({ message: result.error });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "you dont have a account here go to signup page ",
        login: false,
      });
    const comResult = await bcrypt.compare(password, user.password);

    if (comResult) {
      setCookie(user, res);
      return res.status(200).json({ message: "login sucessfull", login: true });
    } else {
      return res
        .status(401)
        .json({ message: "email or password is worng", login: false });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ messages: messages.join(", "), login: false });
    }
    return res
      .status(500)
      .json({ message: "some thing went worng", login: false });
  }
};

const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successful", logOut: true });
};

module.exports = { signUp, logIn, logOut };
