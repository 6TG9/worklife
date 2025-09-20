const express = require("express");
const { register, login, getUser } = require("../controllers/authController");
const authMiddleman = require("../middleWares/authMiddleMan");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/user", authMiddleman, getUser);

module.exports = router;
