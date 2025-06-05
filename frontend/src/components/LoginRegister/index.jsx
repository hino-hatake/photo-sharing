import React, { useState } from "react";
import axios from "axios";

const initialRegisterState = {
  login_name: "",
  password: "",
  password2: "",
  first_name: "",
  last_name: "",
  location: "",
  description: "",
  occupation: "",
};

const LoginRegister = ({ onLogin }) => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [register, setRegister] = useState(initialRegisterState);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("/admin/login", { login_name: loginName, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterSuccess(null);
    setError(null);
    if (!register.login_name || !register.password || !register.first_name || !register.last_name) {
      setError("Vui lòng nhập đầy đủ login_name, password, first_name, last_name");
      return;
    }
    if (register.password !== register.password2) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setRegisterLoading(true);
    try {
      const body = { ...register };
      delete body.password2;
      await axios.post("/user", body);
      setRegisterSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");
      setRegister(initialRegisterState);
    } catch (err) {
      setError(err.response?.data?.error || "Đăng ký thất bại");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 340,
        margin: "80px auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{showRegister ? "Đăng ký" : "Đăng nhập"}</h2>
        <button
          style={{ fontSize: 13, padding: "2px 8px" }}
          onClick={() => {
            setShowRegister((v) => !v);
            setError(null);
            setRegisterSuccess(null);
          }}
        >
          {showRegister ? "Đăng nhập" : "Đăng ký"}
        </button>
      </div>
      {!showRegister ? (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="login_name"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
          />
          <button
            type="submit"
            style={{ width: "100%", padding: 8 }}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="login_name"
            value={register.login_name}
            onChange={(e) => setRegister((r) => ({ ...r, login_name: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={register.password}
            onChange={(e) => setRegister((r) => ({ ...r, password: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={register.password2}
            onChange={(e) => setRegister((r) => ({ ...r, password2: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="text"
            placeholder="first_name"
            value={register.first_name}
            onChange={(e) => setRegister((r) => ({ ...r, first_name: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="text"
            placeholder="last_name"
            value={register.last_name}
            onChange={(e) => setRegister((r) => ({ ...r, last_name: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="text"
            placeholder="location (tùy chọn)"
            value={register.location}
            onChange={(e) => setRegister((r) => ({ ...r, location: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="text"
            placeholder="description (tùy chọn)"
            value={register.description}
            onChange={(e) => setRegister((r) => ({ ...r, description: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="text"
            placeholder="occupation (tùy chọn)"
            value={register.occupation}
            onChange={(e) => setRegister((r) => ({ ...r, occupation: e.target.value }))}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <button
            type="submit"
            style={{ width: "100%", padding: 8 }}
            disabled={registerLoading}
          >
            {registerLoading ? "Đang đăng ký..." : "Register Me"}
          </button>
        </form>
      )}
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      {registerSuccess && <div style={{ color: "green", marginTop: 12 }}>{registerSuccess}</div>}
    </div>
  );
};

export default LoginRegister;
