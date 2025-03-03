import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { showSnackbar } from "../redux/snackbarSlice";
import Logo from "../assets/download-removebg-preview.png";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showSnackbar({message:"Logged out successfully! ✅",severity:"success"}));
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    navigate("/login");
  };

  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark shadow mb-5">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={Logo} className="img-fluid w-25" alt=""/>
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {/* <li className="nav-item">
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
            </li> */}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white">Hello, {user.username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="btn btn-primary" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
