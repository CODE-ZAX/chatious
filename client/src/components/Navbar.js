import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="fixed-top navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Chatious
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={`/rooms`}>
                    Rooms
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={`/profile/${user.username}`}>
                    {user.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
