// utils/mapper.js

function userBasicDTO(user) {
  if (!user) return null;
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

function commentDTO(comment, user) {
  return {
    _id: comment._id,
    comment: comment.comment,
    date_time: comment.date_time,
    user: userBasicDTO(user),
  };
}

function photoDTO(photo, comments) {
  return {
    _id: photo._id,
    user_id: photo.user_id,
    file_name: photo.file_name,
    date_time: photo.date_time,
    comments,
  };
}

module.exports = { userBasicDTO, commentDTO, photoDTO };
