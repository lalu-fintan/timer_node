const jwt = require("jsonwebtoken");

const genreateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1d" });
};

module.exports = { genreateRefreshToken };
