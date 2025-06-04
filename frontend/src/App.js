import React, { useState } from "react";
import logo from './logo.svg';
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import './App.css';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div className="App" style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 250, borderRight: "1px solid #ccc", padding: 16 }}>
        <h3>Danh sách User</h3>
        <UserList onSelectUser={setSelectedUserId} />
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
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
