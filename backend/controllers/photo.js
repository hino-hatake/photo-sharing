const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

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
            return {
              _id: comment._id,
              comment: comment.comment,
              date_time: comment.date_time,
              user: commentUser
                ? {
                    _id: commentUser._id,
                    first_name: commentUser.first_name,
                    last_name: commentUser.last_name,
                  }
                : null,
            };
          })
        );
        return {
          _id: photo._id,
          user_id: photo.user_id,
          file_name: photo.file_name,
          date_time: photo.date_time,
          comments,
        };
      })
    );
    res.json(photoData);
  } catch (err) {
    res.status(400).json({ error: "Lỗi lấy ảnh của user chưa rõ tại sao" });
  }
};

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
    // Lấy lại photo và gắn user cho từng comment (giống getPhotosOfUser)
    const photoWithComments = await Photo.findById(photo_id)
      .select("_id user_id file_name date_time comments")
      .lean();
    const commentsWithUser = await Promise.all(
      (photoWithComments.comments || []).map(async (cmt) => {
        const commentUser = await User.findById(cmt.user_id)
          .select("_id first_name last_name")
          .lean();
        return {
          _id: cmt._id,
          comment: cmt.comment,
          date_time: cmt.date_time,
          user: commentUser
            ? {
                _id: commentUser._id,
                first_name: commentUser.first_name,
                last_name: commentUser.last_name,
              }
            : null,
        };
      })
    );
    res.json({
      _id: photoWithComments._id,
      user_id: photoWithComments.user_id,
      file_name: photoWithComments.file_name,
      date_time: photoWithComments.date_time,
      comments: commentsWithUser,
    });
    return;
  } catch (err) {
    res.status(500).json({ error: "Lỗi thêm bình luận chưa rõ tại sao" });
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
    res.json({
      _id: newPhoto._id,
      user_id: newPhoto.user_id,
      file_name: newPhoto.file_name,
      date_time: newPhoto.date_time,
      comments: [],
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi upload ảnh chưa rõ tại sao" });
  }
};