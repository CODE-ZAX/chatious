import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ImExit } from "react-icons/im";
const ChatPage = () => {
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { socket, user } = useAuth();
  const [message, setMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(0);
  const chatMessagesRef = useRef();
  const navigate = useNavigate();
  const messageHandler = (e) => {
    e.preventDefault();

    if (message.length !== 0) {
      socket.emit("sendMessage", {
        userId: user._id,
        roomId,
        text: message,
      });
      setMessage("");
    }
  };
  const leaveChat = () => {
    socket.emit("leaveRoom", { roomId, userId: user._id });
    navigate("/rooms");
  };
  const loadMoreMessages = () => {
    socket.emit("getMessages", { roomId, page });
    setPage(page + 1);
  };
  useEffect(() => {
    const handleMessages = (messages) => {
      setRoomMessages((prev) => [...messages, ...prev]);
      setIsLoading(false);
    };

    socket.on("messages", handleMessages);

    return () => {
      socket.off("messages", handleMessages);
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("joinRoom", { userId: user._id, roomId });

    // No cleanup required here as there's no listener added
  }, [roomId, socket, user._id]);

  useEffect(() => {
    const handleJoin = (payload) => {
      socket.emit("getMessages", { roomId, page });
      setPage(page + 1);
      setMembers(payload.members);
    };

    socket.on("joined", handleJoin);

    return () => {
      socket.off("joined", handleJoin);
    };
  }, [roomId, socket]);

  useEffect(() => {
    const handleMessage = (message) => {
      setRoomMessages((prev) => [...prev, message]);
      chatMessagesRef.current.scrollTop =
        chatMessagesRef.current.scrollHeight + 5;
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    const handleAdminMessage = (message) => {
      setRoomMessages((prev) => [...prev, message]);
    };

    socket.on("adminMessage", handleAdminMessage);

    return () => {
      socket.off("adminMessage", handleAdminMessage);
    };
  }, [socket]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-3 pt-5">
      <div className="row">
        {/* Left side: Members */}
        <div className="col-4">
          <div className="card">
            <div className="card-header bg-primary text-white">Members</div>
            <ul className="list-group list-group-flush">
              {members.length === 0 && <div>Feels so empty</div>}
              {members.map((member) => (
                <li className="list-group-item">{member}</li>
              ))}
              {/* Render members here */}
            </ul>
          </div>
        </div>

        {/* Right side: Chat */}
        <div className="col-8">
          <div className="card">
            <div className="card-header bg-primary text-white d-flex justify-content-between">
              <div className="mx-auto">Chats</div>
              <div onClick={leaveChat} style={{ cursor: "pointer" }}>
                <ImExit size={20} />
              </div>
            </div>
            {/* Chat messages */}
            <div
              ref={chatMessagesRef}
              onScroll={(e) => {
                if (e.target.scrollTop === 0) {
                  loadMoreMessages();
                }
              }}
              className="card-body chat-messages overflow-auto pb-5"
              style={{ height: "calc(100vh - 200px)" }}
            >
              {roomMessages.map((roomMessage, index) => (
                <div className="border-bottom mb-2" key={index}>
                  <strong>{roomMessage.name}:</strong> {roomMessage.text}
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="card-footer">
              <form onSubmit={messageHandler}>
                <div className="input-group">
                  <input
                    type="text"
                    value={message}
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
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
