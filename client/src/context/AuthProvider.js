import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { io } from "socket.io-client";

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  // const [socket,setSocket]
  const logout = () => {
    Cookies.remove("token"); // remove the token from cookie
    setUser(null); // set the user state to null
  };

  useEffect(() => {
    const authenticate = async () => {
      try {
        const token = Cookies.get("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token, // replace this with the name you gave your JWT token in the header
          },
        };
        const response = await axios.get(
          "http://localhost:5000/api/users/auth",
          config
        );
        setUser(response.data.user);
      } catch (err) {
        logout(); // if there is an error (the token is expired, etc.), log out
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    console.log(user);
    if (user) {
      setSocket(io("http://localhost:5000"));
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("connection Established");
      });
    }
  }, [socket]);
  const value = { user, setUser, logout, setSocket, socket };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
