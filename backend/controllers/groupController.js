const Group = require("../models/Group");

// CREATE GROUP
exports.createGroup = async (req, res) => {
  const group = await Group.create({
    name: req.body.name,
    members: [req.user.id],
  });

  res.json(group);
};