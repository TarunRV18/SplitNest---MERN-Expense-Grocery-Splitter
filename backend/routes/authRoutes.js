const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Member = require("../models/Member");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "splitwise_secret_key", { expiresIn: "30d" });

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered. Please login." });
    const user = await User.create({ name, email, password });
    // Link member with same email if exists
    await Member.findOneAndUpdate({ email: email.toLowerCase() }, { user: user._id });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (err) {
    console.error("SIGNUP ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "No account found with this email" });
    const match = await user.matchPassword(password);
    if (!match)
      return res.status(401).json({ error: "Incorrect password" });
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// VERIFY TOKEN
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "splitwise_secret_key");
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;