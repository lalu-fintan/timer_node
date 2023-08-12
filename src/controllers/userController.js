const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { genreateRefreshToken } = require("../helper/refreshToken");
const cloudinary = require("../config/cloudinary_Config");
const client = require("../config/twilio_Config");

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) res.status(400).json("email already exist");
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: passwordHash,
    });
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (user && (await bcrypt.compare(password, user.password))) {
      const refreshToken = genreateRefreshToken(user.id);

      const updateUser = await User.findByIdAndUpdate(
        user.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      const validUser = jwt.sign(
        {
          id: user.id,
          email: user.email,
          password: user.password,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        message: "login successfull",
        data: user,
        token: validUser,
      });
    } else {
      throw new Error("email or password is invalid");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  try {
    if (!cookie.refreshToken) {
      throw new Error("you don't have a refresh token in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", { httpOnly: true, secure: true });
      res.sendStatus(403);
    }
    await User.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: "",
      }
    );
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});

const userProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);

    const user = await User.findByIdAndUpdate(
      id,
      {
        profileImg: result.secure_url,
        cloudinary_id: result.public_id,
      },

      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getUser = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.status(200).json(user);
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  try {
    if (user) {
      const updateuser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(updateuser);
    } else {
      res.status(400).json("user not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const sendOTP = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  const { id } = req.user;

  // Generate OTP
  const otp = Math.floor(10000 + Math.random() * 900000);

  // Save OTP and expiration time in the database
  const otpExpiration = new Date();
  otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { mobile, otp, otpExpiration },
      { new: true }
    );
    console.log(user);

    // Send OTP via SMS using Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.MOBILE_NUMBER,
      to: user.mobile,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { mobile, enteredOTP } = req.body;

  try {
    const user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== enteredOTP) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiration < new Date()) {
      return res.status(401).json({ message: "OTP has expired" });
    }

    await client.messages.create({
      body: `otp verified successfully ${user.email}`,
      from: process.env.MOBILE_NUMBER,
      to: user.mobile,
    });
    // Clear OTP and expiration time after successful verification
    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

module.exports = {
  register,
  login,
  logout,
  updateUser,
  userProfile,
  getUser,
  getUserById,
  sendOTP,
  verifyOTP,
};
