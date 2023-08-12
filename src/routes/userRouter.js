const express = require("express");
const {
  register,
  login,
  logout,
  userProfile,
  getUser,
  getUserById,
  updateUser,
  sendOTP,
  verifyOTP,
} = require("../controllers/userController");
const upload = require("../middleware/imageUpload");
const authMidddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/upload", authMidddleware, upload.single("image"), userProfile);
router.get("/", getUser);
router.get("/:id", getUserById);
router.post("/send-otp", authMidddleware, sendOTP);
router.post("/verify-otp", verifyOTP);
router.put("/:id", updateUser);
router.get("/logout", logout);

module.exports = router;
