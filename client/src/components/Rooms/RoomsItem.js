import React from "react";
import { Link } from "react-router-dom";
const RoomsItem = () => {
  return (
    <div>
      <div>
        <div>
          <small>Title</small>
        </div>
        <h5>{"roomTitle"}</h5>
      </div>
      <div>
        <div>
          <Link>Join</Link>
        </div>
        <div>3/10</div>
      </div>
    </div>
  );
};

export default RoomsItem;
