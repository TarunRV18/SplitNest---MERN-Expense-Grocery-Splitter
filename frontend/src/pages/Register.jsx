import { useState } from "react";
import { API } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const register = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required ⚠️");
      return;
    }
    try {
      await API.post("/auth/register", form);
      alert("Registration successful! Please login. ✅");
      navigate("/");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.msg || "Registration failed ❌");
    }
  };

  return (
    <div className="app-shell">
      <div className="auth-card">
        <h2>Register</h2>

        <div className="form-group">
          <label>Name</label>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

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

        <button onClick={register} className="btn btn-secondary" style={{ width: "100%" }}>
          Register
        </button>

        <p style={{ fontSize: "0.9rem", marginTop: "0.75rem", textAlign: "center" }}>
          Already have an account? <Link to="/" className="nav-link">Login</Link>
        </p>
      </div>
    </div>
  );
}
