import React, { useEffect, useState } from "react";
import fetchModel from "../../lib/fetchModelData";

const UserPhotos = ({ userId }) => {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetchModel(`/photosOfUser/${userId}`)
      .then(setPhotos)
      .catch((err) => setError(err.message || "Lỗi tải ảnh"));
  }, [userId]);

  if (error) return <div style={{color: 'red'}}>Lỗi: {error}</div>;
  if (!photos.length) return <div>Không có ảnh hoặc đang tải...</div>;

  return (
    <div>
      {photos.map((photo) => (
        <div key={photo._id} style={{marginBottom: 24}}>
          <img src={`/images/${photo.file_name}`} alt="" style={{maxWidth: 300}} />
          <div><b>Ngày:</b> {new Date(photo.date_time).toLocaleString()}</div>
          <div>
            <b>Bình luận:</b>
            <ul>
              {(photo.comments || []).map((cmt) => (
                <li key={cmt._id}>
                  <b>{cmt.user?.first_name} {cmt.user?.last_name}:</b> {cmt.comment} <i>({new Date(cmt.date_time).toLocaleString()})</i>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPhotos;
