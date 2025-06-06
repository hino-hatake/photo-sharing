const User = require("../db/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

exports.getUserList = async (req, res) => {
  try {
    const users = await User.find().select("_id first_name last_name").lean();
    res.json(users);
  } catch (error) {
    console.error("Lỗi lấy danh sách user: ", error.message);
    res.status(500).json({ error: "Lỗi lấy danh sách user: " + error.message });
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
  } catch (error) {
    res.status(400).json({ error: "Invalid user ID" });
  }
};

exports.registerUser = async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }
  try {
    // Kiểm tra login_name trùng lặp
    const existed = await User.findOne({ login_name });
    if (existed) {
      return res.status(400).json({ error: "login_name đã tồn tại" });
    }
    // TODO Hash password trước khi lưu
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      login_name,
      // password: hashedPassword, // TODO
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });
    res.json({ login_name: user.login_name, _id: user._id });
  } catch (error) {
    console.error("Lỗi đăng ký user: ", error.message);
    res.status(500).json({ error: "Lỗi đăng ký user: " + error.message });
  }
};