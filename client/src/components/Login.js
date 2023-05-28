import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import styles from "./LoginPage.module.css";
import { MdOutlineLogin } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      setUser(res.data.user);
      Cookies.set("token", res.data.token, { expires: 7, secure: true }); // The token is stored in a cookie that expires in 7 days

      setError("");
      setLoader(false);
      navigate("/profile/" + res.data.user.username);
    } catch (Err) {
      setError(Err.message);
      setLoader(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className={`container ${styles.loginPage} `}>
        <div className="text-center">
          <MdOutlineLogin className={styles.textColor} size={30} />
        </div>
        <h3 className={styles.textColor + " text-center"}>Welcome!</h3>
        <h5 className="text-muted text-center mb-4">
          <small>Sign in to your account</small>
        </h5>
        {error && (
          <p className="text-danger text-center" style={{ fontSize: "14px" }}>
            {error}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <div className="form-group form-floating mb-2">
            <input
              type="email"
              className={"form-control mb-2 " + styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="floating-label">Email</label>
          </div>
          <div className="form-group form-floating mb-3">
            <input
              type="password"
              className={"form-control mb-2 " + styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="floating-label">Password</label>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <input type="checkbox" />
              <div className="ms-2">Remember Me!</div>
            </div>
            <div>
              <Link className={styles.a} to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
          </div>
          <div className="text-center">
            {loader ? (
              <div class="d-flex justify-content-center">
                <div
                  class="spinner-border"
                  style={{ color: "#8e40f1" }}
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className={`d-flex justify-content-center align-items-center btn btn-primary btn-lg w-100 ${styles.btnPrm}`}
              >
                <div>Login</div>
                <div className="ms-2 text-light">
                  <BsArrowRight />
                </div>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
