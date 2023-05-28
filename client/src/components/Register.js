import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { BsArrowRight } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        username,
        email,
        password,
      });

      setError("");
      setLoader(false);
      navigate("/login");
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
      <div className={`container ${styles.loginPage}`}>
        <div className={"text-center " + styles.textColor}>
          <FaUserCircle size={40} />
        </div>
        <h3 className={styles.textColor + " text-center"}>Welcome!</h3>
        <h5 className="text-muted text-center mb-4">
          <small>Create a new account</small>
        </h5>
        {error && (
          <p className="text-danger text-center" style={{ fontSize: "14px" }}>
            {error}
          </p>
        )}
        <form onSubmit={handleRegister}>
          <div className="form-group form-floating mb-2">
            <input
              type="text"
              className={"form-control mb-2 " + styles.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="floating-label">Username</label>
          </div>
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
          <div className="form-group form-floating mb-5">
            <input
              type="password"
              className={"form-control mb-2 " + styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="floating-label">Password</label>
          </div>
          <div className="text-center">
            {loader ? (
              <div className="d-flex justify-content-center">
                <div
                  className="spinner-border"
                  style={{ color: "#8e40f1" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className={`d-flex justify-content-center align-items-center btn btn-primary btn-lg w-100 ${styles.btnPrm}`}
              >
                <div>Register</div>
                <div className="ms-2 text-light">
                  <BsArrowRight />
                </div>
              </button>
            )}
          </div>
          <hr />
          <div>
            <h6 className="text-center ">
              <small>Or create account using social media</small>
            </h6>
            <div className="d-flex justify-content-center my-2">
              <div className="me-2">
                <img
                  width="36"
                  height="36"
                  src="https://img.icons8.com/color/48/google-plus--v1.png"
                  alt="google-plus--v1"
                />
              </div>
              <div className="me-2">
                <img
                  width="36"
                  height="36"
                  src="https://img.icons8.com/color/48/facebook-new.png"
                  alt="facebook-new"
                />
              </div>
              <div>
                <img
                  width="36"
                  height="36"
                  src="https://img.icons8.com/color/48/twitter--v1.png"
                  alt="twitter--v1"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
