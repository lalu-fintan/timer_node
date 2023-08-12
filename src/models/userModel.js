const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: String,
    profileImg: String,
    cloudinary_id: String,
    otp: String,
    otpExpiration: Date,
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("User", userSchema);
