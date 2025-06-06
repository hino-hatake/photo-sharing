const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../db/userModel");
const userBasicDTO = require("../models/mapper");

const JWT_SECRET = process.env.JWT_SECRET || "photoapp_secret";

exports.login = async (req, res) => {
  const { login_name, password } = req.body;
  if (!login_name || !password)
    return res
      .status(400)
      .json({ error: "login_name và password là bắt buộc" });
  try {
    const user = await User.findOne({ login_name });
    if (!user) return res.status(400).json({ error: "Sai login_name" });
    // So sánh password nhập vào với hash trong DB
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Sai password" });
    const token = jwt.sign(
      { _id: user._id, first_name: user.first_name, last_name: user.last_name },
      JWT_SECRET,
      { expiresIn: "2h" }
    );
    // Chỉ trả về các trường cần thiết
    res.json({
      token,
      user: {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi login: " + err.message });
  }
};

exports.logout = async (req, res) => {
  // Với JWT stateless, logout phía backend chỉ là client xoá token
  res.json({ message: "Logged out (client should remove token)" });
};
