import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();
  async function login(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      setUser(res.data.user);
      Cookies.set("token", res.data.token, { expires: 7, secure: true }); // The token is stored in a cookie that expires in 7 days

      navigate("/profile/" + res.data.user.username);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={login}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
