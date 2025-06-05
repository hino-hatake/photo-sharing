import React, { useEffect, useState } from "react";
import { fetchModel, postModel } from "../../lib/fetchModelData";

const UserPhotos = ({ userId }) => {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // { photoId: commentText }
  const [posting, setPosting] = useState({}); // { photoId: true/false }

  useEffect(() => {
    if (!userId) return;
    // Gọi API lấy danh sách ảnh của user khi userId thay đổi
    fetchModel(`/photosOfUser/${userId}`)
      .then(setPhotos)
      .catch((err) => setError(err.message || "Lỗi tải ảnh"));
  }, [userId]);

  // Xử lý thay đổi input comment cho từng ảnh
  const handleInputChange = (photoId, value) => {
    setCommentInputs((prev) => ({ ...prev, [photoId]: value }));
  };

  // Xử lý gửi bình luận cho 1 ảnh
  const handleCommentSubmit = async (photoId) => {
    const comment = (commentInputs[photoId] || "").trim();
    if (!comment) {
      setError("Bình luận không được để trống");
      return;
    }
    setPosting((prev) => ({ ...prev, [photoId]: true })); // Đánh dấu đang gửi comment cho ảnh này
    setError(null);
    try {
      // Gửi comment lên server
      const updatedPhoto = await postModel(`/commentsOfPhoto/${photoId}`, {
        comment,
      });
      // Cập nhật lại danh sách ảnh với ảnh vừa được comment (server trả về ảnh đã có comment mới)
      setPhotos((prev) =>
        prev.map((p) => (p._id === photoId ? updatedPhoto : p))
      );
      // Xóa nội dung input comment sau khi gửi thành công
      setCommentInputs((prev) => ({ ...prev, [photoId]: "" }));
    } catch (err) {
      setError(err.message || "Lỗi gửi bình luận hoặc hết phiên đăng nhập");
    } finally {
      setPosting((prev) => ({ ...prev, [photoId]: false })); // Bỏ trạng thái đang gửi
    }
  };

  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  if (!photos.length) return <div>Không có ảnh hoặc đang tải...</div>;

  return (
    <div>
      {photos.map((photo) => (
        <div key={photo._id} style={{ marginBottom: 24 }}>
          <img
            src={`/images/${photo.file_name}`}
            alt=""
            style={{ maxWidth: 300 }}
          />
          <div>
            <b>Ngày:</b> {new Date(photo.date_time).toLocaleString()}
          </div>
          <div>
            <b>Bình luận:</b>
            <ul>
              {(photo.comments || []).map((cmt) => (
                <li key={cmt._id}>
                  <b>
                    {cmt.user?.first_name} {cmt.user?.last_name}:
                  </b>{" "}
                  {cmt.comment}{" "}
                  <i>({new Date(cmt.date_time).toLocaleString()})</i>
                </li>
              ))}
            </ul>
            {/* Form thêm bình luận */}
            <div style={{ marginTop: 8 }}>
              <input
                type="text"
                placeholder="Thêm bình luận..."
                value={commentInputs[photo._id] || ""}
                onChange={(e) => handleInputChange(photo._id, e.target.value)}
                style={{ width: 220, marginRight: 8 }}
                disabled={posting[photo._id]}
                onKeyDown={(e) => {
                  // Cho phép gửi bình luận bằng phím Enter
                  if (e.key === "Enter") handleCommentSubmit(photo._id);
                }}
              />
              <button
                onClick={() => handleCommentSubmit(photo._id)}
                disabled={posting[photo._id]}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPhotos;
