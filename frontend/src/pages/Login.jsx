import { useState } from "react";
import { API } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const login = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password ⚠️");
      return;
    }
    try {
      const res = await API.post("/auth/login", form);
      loginUser(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Login failed ❌");
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-card">
        <h2>Login</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button onClick={login} className="btn btn-primary" style={{ width: "100%" }}>
          Login
        </button>

        <p style={{ fontSize: "0.9rem", marginTop: "0.75rem", textAlign: "center" }}>
          No account? <Link to="/register" className="nav-link">Register</Link>
        </p>
      </div>
    </div>
  );
}
