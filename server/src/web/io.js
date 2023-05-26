const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const Room = require("../models/Room");
const User = require("../models/User");

const roomChangeStream = Room.watch(); // Watch for changes in the Room collection

roomChangeStream.on("change", async (change) => {
  if (change.operationType === "insert") {
    const room = await Room.findById(change.documentKey._id);
    const roomInfo = {
      roomId: room._id,
      name: room.name,
      description: room.description,
      users: room.users.length,
    };
    io.emit("newRoom", roomInfo); // Emit event for new room creation
  }
});

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("joinRoom", async ({ userId, roomId }) => {
    try {
      const user = await User.findById(userId);
      const room = await Room.findById(roomId);

      if (!room.users.some((u) => u.toString() === user.id)) {
        room.users.unshift(user.id);
        await room.save();
      }

      socket.join(roomId);

      const messageHistory = room.messages;
      socket.emit("messageHistory", messageHistory);

      io.to(roomId).emit("message", {
        user: "admin",
        text: `${user.username} has joined the room!`,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("leaveRoom", async ({ userId, roomId }) => {
    try {
      const room = await Room.findById(roomId);
      const removeIndex = room.users
        .map((user) => user.toString())
        .indexOf(userId);

      if (removeIndex !== -1) {
        room.users.splice(removeIndex, 1);
        await room.save();
      }

      socket.leave(roomId);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("sendMessage", async ({ userId, roomId, text }) => {
    try {
      console.log(text);
      const user = await User.findById(userId);
      const room = await Room.findById(roomId);
      console.log(room);
      const newMessage = {
        text: text,
        name: user.username,
        user: userId,
      };

      room.messages.unshift(newMessage);
      await room.save();

      io.to(roomId).emit("message", newMessage);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("getRoomInfo", async (roomId) => {
    try {
      const room = await Room.findById(roomId);
      const roomInfo = {
        roomId: room._id,
        name: room.name,
        description: room.description,
        users: room.users.length,
      };
      socket.emit("roomInfo", roomInfo);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("getAllRooms", async () => {
    try {
      const rooms = await Room.find();
      const roomsInfo = rooms.map((room) => ({
        roomId: room._id,
        name: room.name,
        description: room.description,
        users: room.users.length,
      }));
      socket.emit("allRoomsInfo", roomsInfo);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User had left!!!");
  });
});

module.exports = { io, server, app };
