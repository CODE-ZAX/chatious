import React from "react";
import { useAuth } from "../context/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();
  return <div>{user.toString()}</div>;
};

export default Dashboard;
