const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// GET all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find().populate("user", "name email").sort({ createdAt: 1 });
    res.json(members);
  } catch (err) {
    console.error("GET MEMBERS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ADD a member
router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || name.trim() === "")
      return res.status(400).json({ error: "Name is required" });

    const existing = await Member.findOne({ name: name.trim() });
    if (existing)
      return res.status(400).json({ error: `Member "${name}" already exists` });

    const member = new Member({
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : "",
    });
    const saved = await member.save();
    console.log("Member added:", saved.name);
    res.status(201).json(saved);
  } catch (err) {
    console.error("ADD MEMBER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a member
router.put("/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await Member.findByIdAndUpdate(
      req.params.id,
      { name: name?.trim(), email: email?.toLowerCase().trim() || "" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Member not found" });
    res.json(updated);
  } catch (err) {
    console.error("UPDATE MEMBER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a member
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE member id:", req.params.id);
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log("Member not found for id:", req.params.id);
      return res.status(404).json({ error: "Member not found" });
    }
    console.log("Member deleted:", deleted.name);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error("DELETE MEMBER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;