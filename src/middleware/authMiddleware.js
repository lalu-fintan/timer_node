const jwt = require("jsonwebtoken");

const authMidddleware = async (req, res, next) => {
  const token = req.headers.token;

  if (token) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;

    next();
  } else {
    res.status(402).json({ message: "you don't have  token" });
  }
};

module.exports = authMidddleware;
