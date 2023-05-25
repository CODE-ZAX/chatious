import React from "react";
import { useAuth } from "../context/AuthProvider";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h3>User Profile</h3>
      <div>{user.username}</div>
      <div>{user.email}</div>
    </div>
  );
};

export default Profile;
