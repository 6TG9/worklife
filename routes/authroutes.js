const express = require("express");
const { register, login, getUser, googleAuth } = require("../controllers/authController");
const authMiddleman = require("../middleWares/authMiddleMan");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/user", authMiddleman, getUser);

router.post("/google", googleAuth); // ✅ new route

module.exports = router;
