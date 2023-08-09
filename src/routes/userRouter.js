const express = require("express");
const {
  register,
  login,
  logout,
  userProfile,
  getUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const upload = require("../middleware/imageUpload");
const authMidddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/upload", authMidddleware, upload.single("image"), userProfile);
router.get("/", getUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.get("/logout", logout);

module.exports = router;
