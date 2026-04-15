const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ADD EXPENSE
router.post("/", async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const { amount, category, description, date, splits, paidBy } = req.body;

    // Validate
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (!splits || splits.length === 0) {
      return res.status(400).json({ error: "At least one split is required" });
    }

    const formattedSplits = splits.map((s) => ({
      user: s.user,
      amount: Number(s.amount),
    }));

    // Build expense object — only include paidBy if it's a valid value
    const expenseData = {
      amount: Number(amount),
      category,
      description: description || "",
      date: date ? new Date(date) : new Date(),
      splits: formattedSplits,
    };

    if (paidBy && String(paidBy).length === 24) {
      expenseData.paidBy = paidBy;
    }

    const expense = new Expense(expenseData);
    await expense.save();

    // Fetch fresh with populate instead of using .populate() on saved doc
    const populated = await Expense.findById(expense._id)
      .populate("splits.user", "name")
      .populate("paidBy", "name");

    console.log("Expense saved:", expense._id);
    res.status(201).json(populated);

  } catch (err) {
    console.error("EXPENSE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET ALL EXPENSES
router.get("/", async (req, res) => {
  try {
    const data = await Expense.find()
      .populate("splits.user", "name")
      .populate("paidBy", "name")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("GET EXPENSES ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE EXPENSE
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;