const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const User = require("../db/userModel");
// const userBasicDTO = require("../models/mapper");

const JWT_SECRET = process.env.JWT_SECRET || "photoapp_secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "2h";

exports.login = async (req, res) => {
  const { login_name, password } = req.body;
  if (!login_name || !password)
    return res
      .status(400)
      .json({ error: "login_name và password là bắt buộc" });
  try {
    const user = await User.findOne({ login_name });
    if (!user) return res.status(400).json({ error: "Sai login_name" });
    // TODO So sánh password nhập vào với hash trong DB
    // const match = await bcrypt.compare(password, user.password);
    const match = password === user.password;
    if (!match) return res.status(400).json({ error: "Sai password" });
    const token = jwt.sign(
      { _id: user._id, first_name: user.first_name, last_name: user.last_name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
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
  } catch (error) {
    console.error("Lỗi login: ", error.message);
    res.status(500).json({ error: "Lỗi login: " + error.message });
  }
};

exports.logout = async (req, res) => {
  // Với JWT stateless, logout phía backend chỉ là client xoá token
  console.log("User logged out: ", req.user?._id);
  res.json({ message: "Logged out (client should remove token): " + req.user?._id });
};
