import React, { useEffect } from "react";
import RoomsItem from "../components/Rooms/RoomsItem";
import { useAuth } from "../context/AuthProvider";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Rooms = () => {
  const { socket } = useAuth();
  const [_, setRooms] = useState([]);
  const [toggleCreate, setToggleCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (socket) {
      socket.emit("getAllRooms");
      socket.on("newRoom", (room) => {
        setRooms([..._, room]);
      });
      socket.on("allRoomsInfo", (rooms) => {
        console.log(rooms);
        if (rooms) {
          setRooms(rooms);
        } else {
          setRooms([]);
        }
      });
    }
  }, [socket]);

  return (
    <div className="container">
      <h3>Active Rooms</h3>
      <div className="container d-flex justify-content-between">
        <div>
          <label>
            <h5>search room</h5>
          </label>
          <div>
            <input type="text" placeholder="Search by id" className="me-2" />
            <input type="text" placeholder="Search by name" />
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              setToggleCreate((prev) => !prev);
            }}
          >
            Create
          </button>
        </div>
      </div>
      <hr />
      {toggleCreate && (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              axios
                .post(
                  "http://localhost:5000/api/rooms/",
                  {
                    name: title,
                    description: description,
                  },
                  { headers: { "x-auth-token": Cookies.get("token") } }
                )
                .then((res) => {
                  console.log(res.data);
                  setToggleCreate(false);
                  setTitle("");
                  setDescription("");
                });
            }}
          >
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <div>
              <label>Description</label>
              <input
                type="text"
                placeholder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div>
              <button>Create Room</button>
            </div>
          </form>
        </div>
      )}
      <div>
        {_.length === 0 && <div>No rooms Available</div>}
        {_.length !== 0 &&
          _.map((room) => <RoomsItem room={room} key={room} />)}
      </div>
    </div>
  );
};

export default Rooms;
