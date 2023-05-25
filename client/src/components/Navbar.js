import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        {!user ? (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to={`/profile/${user.username}`}>{user.username}</Link>
            </li>
            <li>
              <button
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
    </nav>
  );
}

export default Navbar;
