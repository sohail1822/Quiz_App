import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../redux/userSlice";
import { showSnackbar } from "../redux/snackbarSlice";
import Logo from '../assets/download-removebg-preview.png'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess({ user: data?.user || "Guest" }));
        dispatch(showSnackbar({ message: "Login Successful! 🎉", severity: "success" }));
        localStorage.setItem("access-token", data.access);
        localStorage.setItem("refresh-token", data.refresh);
        if (data?.user?.is_admin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        dispatch(showSnackbar({ message: data.message || "Invalid credentials ❌", severity: "error" }));
      }
    } catch (error) {
      dispatch(showSnackbar({ message: "Something went wrong. Try again later.", severity: "error" }));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <img src={Logo} className="img-fluid w-50 mx-auto" alt=""/>
        <h4 className="text-center m-3">Welcome Back!</h4>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div>
          <p className="text-center mt-3">
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Login;