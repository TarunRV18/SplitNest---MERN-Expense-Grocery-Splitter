function calculateBalances(expenses) {
  const balance = {};

  expenses.forEach(exp => {
    exp.splits.forEach(split => {
      if (!balance[split.user]) balance[split.user] = 0;

      balance[split.user] -= split.amount;
      balance[exp.paidBy] += split.amount;
    });
  });

  return balance;
}

module.exports = calculateBalances;