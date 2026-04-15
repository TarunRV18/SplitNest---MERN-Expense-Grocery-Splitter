const Expense = require("../models/Expense");

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      paidBy: req.user.id,
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET EXPENSES
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find().populate("paidBy");
  res.json(expenses);
};