const Settlement = require("../models/Settlement");

exports.createSettlement = async (req, res) => {
  const settlement = await Settlement.create(req.body);
  res.json(settlement);
};

exports.getSettlements = async (req, res) => {
  const data = await Settlement.find().populate("from to", "name");
  res.json(data);
};