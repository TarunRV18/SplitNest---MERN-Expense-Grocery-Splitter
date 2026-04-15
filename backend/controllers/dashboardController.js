const Expense = require("../models/Expense");

// GET DASHBOARD DATA
exports.getDashboard = async (req, res) => {
  try {
    const expenses = await Expense.find();

    let total = 0;

    expenses.forEach(exp => {
      total += exp.amount;
    });

    res.json({
      totalExpenses: total,
      count: expenses.length,
      expenses,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};