const jwt = require("jsonwebtoken");

const authApi = (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token)
      return res
        .status(401)
        .json({ message: "you are token are expired. So, login again" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decode.id;
    req.userEmail = decode.email;
  
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Invalid token. Please log in again" });
  }
};

module.exports = authApi;
