import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ChatPage = () => {
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const { socket, user } = useAuth();
  const [message, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = React.useState([]);

  const messageHandler = (e) => {
    e.preventDefault();
    if (message.length !== 0) {
      socket.emit("sendMessage", {
        userId: user._id,
        roomId,
        text: message,
      });
    }
  };

  useEffect(() => {
    socket.emit("joinRoom", { userId: user._id, roomId });
    socket.on("messageHistory", (messages) => {
      setRoomMessages(messages);
      console.log(messages);
      setIsLoading(false);
    });
    socket.on("message", (message) => {
      setRoomMessages((prev) => [...prev, message]);
    });
  }, [roomId, socket, user._id]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container">
      <div className="row">
        {/* Left side: Members */}
        <div className="col-4">
          <h2>Members</h2>
          <ul className="list-group">
            <li className="list-group-item">Member 1</li>
            <li className="list-group-item">Member 2</li>
            <li className="list-group-item">Member 3</li>
            {/* Render members here */}
          </ul>
        </div>

        {/* Right side: Chat */}
        <div className="col-8 position-relative">
          <h2>Chat</h2>

          {/* Chat messages */}
          <div
            className="chat-messages overflow-auto"
            style={{ height: "calc(100vh - 200px)" }}
          >
            {roomMessages.map((roomMessage) => (
              <div className="border-bottom mb-2">
                {console.log(roomMessage)}
                <strong>{roomMessage.name}:</strong> {roomMessage.text}
              </div>
            ))}

            {/* Render chat messages here */}
            <div className="position-absolute bottom-0 w-100 mb-4">
              <form onSubmit={messageHandler}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Message input */}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
