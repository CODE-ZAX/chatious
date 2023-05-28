import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<h2 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rooms">
          <Route
            index
            element={
              <ProtectedRoute>
                <Rooms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/:roomId"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/profile/:uname"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </React.Fragment>
  );
}

export default App;
