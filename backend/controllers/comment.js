const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const { commentDTO, photoDTO } = require("../models/mapper");

exports.addCommentToPhoto = async (req, res) => {
  const { photo_id } = req.params;
  const { comment } = req.body;
  const userId = req.user?._id;
  if (!mongoose.Types.ObjectId.isValid(photo_id)) {
    return res.status(400).json({ error: "Invalid photo ID" });
  }
  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: "Comment must not be empty" });
  }
  try {
    const photo = await Photo.findById(photo_id);
    if (!photo) return res.status(400).json({ error: "Photo not found" });
    photo.comments.push({
      comment,
      date_time: new Date(),
      user_id: userId,
    });
    await photo.save();
    // Lấy lại photo và gắn user cho từng comment (dùng DTO)
    const photoWithComments = await Photo.findById(photo_id)
      .select("_id user_id file_name date_time comments")
      .lean();
    const commentsWithUser = await Promise.all(
      (photoWithComments.comments || []).map(async (cmt) => {
        const commentUser = await User.findById(cmt.user_id)
          .select("_id first_name last_name")
          .lean();
        return commentDTO(cmt, commentUser);
      })
    );
    res.json(photoDTO(photoWithComments, commentsWithUser));
    return;
  } catch (error) {
    console.error("Lỗi thêm bình luận: ", error.message);
    res.status(500).json({ error: "Lỗi thêm bình luận: " + error.message });
  }
};
