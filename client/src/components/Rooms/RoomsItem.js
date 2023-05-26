import React from "react";
import { Link } from "react-router-dom";
const RoomsItem = ({ room }) => {
  console.log(room);
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <div className="">
          <small>Title</small>
        </div>
        <h5>{room.name}</h5>
      </div>
      <div className="d-flex align-items-center">
        <div className="me-2">
          <Link to={`/rooms/${room.roomId}`}>Join</Link>
        </div>
        <div>{room.users}/10</div>
      </div>
    </div>
  );
};

export default RoomsItem;
