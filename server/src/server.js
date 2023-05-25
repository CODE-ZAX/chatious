// /server/src/server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require("mongoose");

// Import routes
const apiRoutes = require("./routes/api");

const PORT = process.env.PORT || 5000;

// Use middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://zax:faraz123sad@chatious.15ypqdl.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

// Use routes
app.use("/api", apiRoutes);

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
