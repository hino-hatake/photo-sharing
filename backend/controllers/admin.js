const jwt = require('jsonwebtoken');
const User = require('../db/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'photoapp_secret';

exports.login = async (req, res) => {
  const { login_name, password } = req.body;
  if (!login_name || !password) return res.status(400).json({ error: 'login_name và password là bắt buộc' });
  try {
    const user = await User.findOne({ login_name, password }).select('_id first_name last_name').lean();
    if (!user) return res.status(400).json({ error: 'Sai login_name hoặc password' });
    const token = jwt.sign({ _id: user._id, first_name: user.first_name, last_name: user.last_name }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi login chưa rõ tại sao' });
  }
};

exports.logout = async (req, res) => {
  // Với JWT stateless, logout phía backend chỉ là client xoá token
  res.json({ message: 'Logged out (client should remove token)' });
};
