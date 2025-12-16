const jwt = require("jsonwebtoken");


function generateToken(user) {
  const token = jwt.sign(
    { email: user.email, id: user._id,role:user.role },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "2d" }
  );

  return token;
}


function setCookie(user, res) {
  const token = generateToken(user);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

module.exports = {setCookie}