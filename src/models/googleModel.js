const mongoose = require("mongoose");

const googleSchema = new mongoose.Schema(
  {
    googleId: String,
    displayName: String,
    email: String,
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Google", googleSchema);
