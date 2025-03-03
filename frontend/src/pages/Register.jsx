import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showSnackbar } from "../redux/snackbarSlice";
import { loginSuccess } from "../redux/userSlice";
import Logo from '../assets/download-removebg-preview.png';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    is_admin: false, // ✅ Default value set as Boolean
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, email, password, password2, is_admin } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value, // ✅ Fixes is_admin handling
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      dispatch(showSnackbar("Passwords do not match ❌"));
      return;
    }

    try {
      console.log(formData);
      
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, password2, is_admin }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        dispatch(loginSuccess({ user: data?.user || "Guest" }));
        dispatch(showSnackbar({ message: "Registration Successful! 🎉", severity: "success" }));
        navigate("/login"); // ✅ Redirects after successful registration
      } else {
        dispatch(showSnackbar({ message: data.message || "Registration failed ❌", severity: "error" }));
      }
    } catch (error) {
      dispatch(showSnackbar("Something went wrong. Try again later."));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <img src={Logo} className="img-fluid w-50 mx-auto" alt="Logo" />
        <h4 className="text-center m-3">Register</h4>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              name="password2"
              value={password2}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="is_admin"
              checked={is_admin} // ✅ Correctly reflects state
              onChange={handleChange}
              id="adminCheck"
            />
            <label className="form-check-label" htmlFor="adminCheck">Register as Admin</label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
