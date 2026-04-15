const express = require("express");
const router = express.Router();
const Settlement = require("../models/Settlement");

// GET all settlements
router.get("/", async (req, res) => {
  try {
    const data = await Settlement.find()
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("GET SETTLEMENTS ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// RECORD a settlement payment
router.post("/", async (req, res) => {
  try {
    const { from, to, amount, note } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ error: "from, to and amount are required" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const settlement = new Settlement({
      from,
      to,
      amount: Number(amount),
      note: note || "",
    });

    const saved = await settlement.save();
    const populated = await Settlement.findById(saved._id)
      .populate("from", "name email")
      .populate("to", "name email");

    console.log(`Settlement recorded: ${populated.from.name} → ${populated.to.name} ₹${amount}`);
    res.status(201).json(populated);
  } catch (err) {
    console.error("RECORD SETTLEMENT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a settlement (undo)
router.delete("/:id", async (req, res) => {
  try {
    await Settlement.findByIdAndDelete(req.params.id);
    res.json({ message: "Settlement removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;