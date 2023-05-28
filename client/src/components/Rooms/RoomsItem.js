import React from "react";
import { Link } from "react-router-dom";

const RoomsItem = ({ room }) => {
  console.log(room);
  return (
    <div className="card my-2">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">{room.name}</h5>
            <p className="card-text text-muted">
              <small>{room.description}</small>
            </p>
          </div>
          <div className="d-flex align-items-center">
            <div className="me-2">
              <Link to={`/rooms/${room.roomId}`} className="btn btn-primary">
                Join
              </Link>
            </div>
            <div className="badge bg-secondary">{room.users}/10</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsItem;
