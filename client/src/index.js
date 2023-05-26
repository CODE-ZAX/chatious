import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import RoomProvider from "./context/RoomProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.Fragment>
    <AuthProvider>
      <RoomProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RoomProvider>
    </AuthProvider>
  </React.Fragment>
);
