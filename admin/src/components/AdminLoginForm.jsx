import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './styles/AdminLoginForm.css';

const AdminLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", { username, password });
      const { token } = response.data;

      // Store token in localStorage or state for later use (for example, in a Redux store)
      localStorage.setItem("adminToken", token);

      // Redirect to admin dashboard or another page after login
      navigate("/dashboard");
    } catch (err) {
      // Handle errors from backend
      if (err.response && err.response.data) {
        setError(err.response.data.message || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="form-container">
      <div className="login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
