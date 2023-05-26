import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthProvider";

const RoomContext = React.createContext();
export const useRoom = () => React.useContext(RoomContext);
const RoomProvider = ({ children }) => {
  const { socket } = useAuth();
  const [messages, setMessages] = useState([]);

  return (
    <RoomContext.Provider value={{ socket }}>{children}</RoomContext.Provider>
  );
};

export default RoomProvider;
