import React, { useEffect, useState } from "react";
import { fetchModel, postModel } from "../../lib/fetchModelData";

const UserPhotos = ({ userId }) => {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({}); // { photoId: commentText }
  const [posting, setPosting] = useState({}); // { photoId: true/false }
  // Thêm state cho upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

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

  // Xử lý upload ảnh mới
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const token = localStorage.getItem("token");
      const res = await fetch("/photosOfUser/new", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Lỗi upload ảnh");
      }
      const newPhoto = await res.json();
      setPhotos((prev) => [newPhoto, ...prev]);
      setUploadSuccess("Tải ảnh thành công!");
    } catch (err) {
      setUploadError(err.message || "Lỗi upload ảnh");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input file
    }
  };

  if (error) return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  if (!photos.length) return <div>Không có ảnh hoặc đang tải...</div>;

  return (
    <div>
      {/* Form upload ảnh */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 600 }}>
          <span style={{ marginRight: 8 }}>Thêm ảnh mới:</span>
          <input
            type="file"
            accept="image/*"
            style={{ display: "inline-block" }}
            onChange={handlePhotoUpload}
            disabled={uploading}
          />
        </label>
        {uploading && <span style={{ marginLeft: 8 }}>Đang tải lên...</span>}
        {uploadError && (
          <span style={{ color: "red", marginLeft: 8 }}>{uploadError}</span>
        )}
        {uploadSuccess && (
          <span style={{ color: "green", marginLeft: 8 }}>{uploadSuccess}</span>
        )}
      </div>
      {/* Danh sách ảnh */}
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
