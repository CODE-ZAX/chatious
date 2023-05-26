import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import Rooms from "./pages/Rooms";
import Room from "./pages/Room";

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rooms">
          <Route index element={<Rooms />} />
          <Route path="/rooms/:roomId" element={<Room />} />
        </Route>
        <Route path="/profile/:uname" element={<Profile />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
