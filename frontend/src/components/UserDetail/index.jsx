import React, { useEffect, useState } from "react";
import fetchModel from "../../lib/fetchModelData";

const UserDetail = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetchModel(`/user/${userId}`)
      .then(setUser)
      .catch((err) => setError(err.message || "Lỗi tải dữ liệu người dùng"));
  }, [userId]);

  if (error) return <div style={{color: 'red'}}>Lỗi: {error}</div>;
  if (!user) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>{user.first_name} {user.last_name}</h2>
      <p><b>Location:</b> {user.location}</p>
      <p><b>Description:</b> {user.description}</p>
      <p><b>Occupation:</b> {user.occupation}</p>
    </div>
  );
};

export default UserDetail;
