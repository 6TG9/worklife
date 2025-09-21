const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CONTROLLER NO 1. SIGNUP
const register = async (req, res) => {
  const { email, password, repeatPassword } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  if (password !== repeatPassword) {
    return res.status(400).json({ message: "Password Missmatch" });
  }

  const salt = await bcryptjs.genSalt(10);

  const hashedPassword = await bcryptjs.hash(password, salt);

  try {
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "3d",
    });

    res
      .status(201)
      .json({ message: "Registered Successfully", id: user._id, token });
  } catch (error) {
    console.log(error);
  }
};

// CONTROLLER NO 2. SIGNIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User does not exist" });
  }

  // ================

  const isPasswordMatch = await bcryptjs.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Wrong password" });
  }

  //   ==================

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, {
    expiresIn: "3d",
  });

  res.status(200).json({ message: "Login Successfully", id: user._id, token });
};

// CONTROLLER TO GET USERS THAT ARE ALREADY LOGGED-IN OR REGISTERED

const getUser = async (req, res) => {
  const user = await User.findById(req.user.userId);

  res
    .status(200)
    .json({ id: user._id, email: user.email, password: user.password });
};

// ✅ Google login/signup
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    // frontend sends: { googleJWT: token }
    const { googleJWT } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: googleJWT,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, avatar: picture, googleId });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT token for the user
    const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "3d",
    });
    res.json({ message: "Success", token: appToken, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

module.exports = { register, login, getUser, googleAuth };

// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc3OTVjMGU5OGEwMzQzNjEyMzViNjkiLCJpYXQiOjE3NTI2Njc1ODYsImV4cCI6MTc1MjkyNjc4Nn0.TIjPCOXq6Pn12L1qEXdospaDVrwsIRAyAcxaWXjW4CA";
