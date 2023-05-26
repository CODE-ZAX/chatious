import React from "react";
import RoomsItem from "../components/Rooms/RoomsItem";

const Rooms = () => {
  const rooms = [1, 2, 3];

  return (
    <div>
      <h3>Active Rooms</h3>
      <div>
        <label>search room</label>
        <input type="text" placeholder="id" />
        <input type="text" placeholder="name" />
      </div>
      <hr />
      <div>
        {rooms.map(() => (
          <RoomsItem />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
