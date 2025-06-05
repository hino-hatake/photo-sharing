import React, { useState, useEffect } from "react";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import './App.css';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (user) setSelectedUserId(user._id);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSelectedUserId(null);
  };

  if (!user) {
    return (
      <>
        <div style={{ background: "#282c34", color: "#fff", padding: 16, textAlign: "center" }}>
          Please Login
        </div>
        <LoginRegister onLogin={setUser} />
      </>
    );
  }

  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 250, borderRight: "1px solid #ccc", padding: 16 }}>
        <h3>Danh sách User</h3>
        <UserList onSelectUser={setSelectedUserId} />
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Hi {user.first_name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
        {selectedUserId ? (
          <>
            <UserDetail userId={selectedUserId} />
            <hr />
            <UserPhotos userId={selectedUserId} />
          </>
        ) : (
          <div>Chọn một user để xem chi tiết và ảnh.</div>
        )}
      </main>
    </div>
  );
}

export default App;
