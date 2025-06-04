import React, { useEffect, useState } from "react";
import fetchModel from "../../lib/fetchModelData";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModel("/user/list")
      .then(setUsers)
      .catch((err) => setError(err.message || "Lỗi tải danh sách người dùng"));
  }, []);

  if (error) return <div style={{color: 'red'}}>Lỗi: {error}</div>;
  if (!users.length) return <div>Đang tải danh sách người dùng...</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id} onClick={() => onSelectUser(user._id)} style={{cursor: 'pointer'}}>
          {user.first_name} {user.last_name}
        </li>
      ))}
    </ul>
  );
};

export default UserList;
