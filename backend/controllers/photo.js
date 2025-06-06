const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const { commentDTO, photoDTO } = require("../models/mapper");

exports.getPhotosOfUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  try {
    const user = await User.findById(req.params.user_id).lean();
    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const photos = await Photo.find({ user_id: req.params.user_id })
      .select("_id user_id file_name date_time comments")
      .lean();

    // Lấy thông tin user cho từng comment
    const photoData = await Promise.all(
      photos.map(async (photo) => {
        const comments = await Promise.all(
          (photo.comments || []).map(async (comment) => {
            const commentUser = await User.findById(comment.user_id)
              .select("_id first_name last_name")
              .lean();
            return commentDTO(comment, commentUser);
          })
        );
        return photoDTO(photo, comments);
      })
    );
    res.json(photoData);
  } catch (error) {
    console.error("Lỗi lấy ảnh của user: ", error);
    res.status(400).json({ error: "Lỗi lấy ảnh của user: " + error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  // Multer đã lưu file vào req.file
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const userId = req.user?._id;
    // Tạo đối tượng Photo mới
    const newPhoto = await Photo.create({
      file_name: req.file.filename,
      user_id: userId,
      date_time: new Date(),
      comments: [],
    });
    // Sử dụng photoDTO để trả về đúng format
    res.json(photoDTO(newPhoto, []));
  } catch (error) {
    console.error("Lỗi upload ảnh: ", error);
    res.status(500).json({ error: "Lỗi upload ảnh: " + error.message });
  }
};