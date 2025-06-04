const User = require("../db/userModel");
const mongoose = require("mongoose");

exports.getUserList = async (req, res) => {
  try {
    const users = await User.find().select("_id first_name last_name").lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserDetail = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const user = await User.findById(req.params.id)
      .select("_id first_name last_name location description occupation")
      .lean();
    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
};