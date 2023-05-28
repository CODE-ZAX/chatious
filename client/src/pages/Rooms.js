import React, { useEffect } from "react";
import RoomsItem from "../components/Rooms/RoomsItem";
import { useAuth } from "../context/AuthProvider";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Rooms = () => {
  const { socket } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [toggleCreate, setToggleCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (socket) {
      const handleNewRoom = (room) => {
        setRooms((prevRooms) => [...prevRooms, room]);
      };

      const handleAllRoomsInfo = (rooms) => {
        if (rooms) {
          setRooms(rooms);
        } else {
          setRooms([]);
        }
      };

      socket.emit("getAllRooms");
      socket.on("newRoom", handleNewRoom);
      socket.on("allRoomsInfo", handleAllRoomsInfo);

      return () => {
        socket.off("newRoom", handleNewRoom);
        socket.off("allRoomsInfo", handleAllRoomsInfo);
      };
    }
  }, [socket]);

  const filteredRooms = rooms.filter((room) => {
    return room.roomId.includes(searchId) && room.name.includes(searchName);
  });

  return (
    <div className="container mt-5 pt-3">
      <h3 className="mb-4">Active Rooms</h3>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <label className="form-label">
            <h5>Search room</h5>
          </label>
          <div className="d-flex">
            <input
              type="text"
              placeholder="Search by id"
              className="form-control me-2"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by name"
              className="form-control"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            onClick={() => {
              setToggleCreate((prev) => !prev);
            }}
            className="btn btn-primary"
          >
            Create
          </button>
        </div>
      </div>
      <hr />
      {toggleCreate && (
        <div className="mb-4">
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
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                placeholder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-success">Create Room</button>
            </div>
          </form>
        </div>
      )}
      <div>
        {filteredRooms.length === 0 && (
          <div className="alert alert-warning">No rooms Available</div>
        )}
        {filteredRooms.length !== 0 &&
          filteredRooms.map((room) => <RoomsItem room={room} key={room._id} />)}
      </div>
    </div>
  );
};

export default Rooms;
