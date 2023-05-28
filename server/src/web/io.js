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

const roomsUsers = {};

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
      socket.userId = userId;
      socket.roomId = roomId;
      if (!room.users.some((u) => u.toString() === user.id)) {
        room.users.unshift(user.id);
        await room.save();
      }

      socket.join(roomId);

      // Add user to roomsUsers object
      if (!roomsUsers[roomId]) {
        roomsUsers[roomId] = [];
      }
      roomsUsers[roomId].push(user.username); // Push user's name instead of object

      io.to(roomId).emit("adminMessage", {
        user: "admin",
        text: `${user.username} has joined the room!`,
      });

      io.to(roomId).emit("joined", {
        members: roomsUsers[roomId] || [],
      });
    } catch (err) {
      console.error(err.message);
    }
  });
  socket.on("getMessages", async ({ roomId, page }) => {
    try {
      const room = await Room.findById(roomId);
      const messages = room.messages
        .sort((a, b) => b._id - a._id) // Sort messages by id in descending order to get the latest messages first
        .slice(page * 30, (page + 1) * 30); // Skip messages that belong to pages before the current page and limit the result to 30 messages

      socket.emit("messages", messages);
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("leaveRoom", async ({ userId, roomId }) => {
    try {
      const user = await User.findById(userId); // Fetch user to get the username
      const room = await Room.findById(roomId);
      const removeIndex = room.users
        .map((user) => user.toString())
        .indexOf(userId);

      if (removeIndex !== -1) {
        room.users.splice(removeIndex, 1);
        await room.save();
      }

      socket.leave(roomId);

      // Remove user from roomsUsers object
      roomsUsers[roomId] = roomsUsers[roomId].filter(
        (username) => username !== user.username
      );
      io.to(roomId).emit("adminMessage", {
        user: "admin",
        text: `${user.username} has left the room!`,
      });
    } catch (err) {
      console.error(err.message);
    }
  });

  socket.on("sendMessage", async ({ userId, roomId, text }) => {
    try {
      const user = await User.findById(userId);
      const room = await Room.findById(roomId);
      console.log(room);
      const newMessage = {
        text: text,
        name: user.username,
        user: userId,
      };

      room.messages.push(newMessage);
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
        users: roomsUsers[roomId] || [], // Now contains usernames of users currently in the room
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
  socket.on("disconnect", async () => {
    try {
      const userId = socket.userId;
      const roomId = socket.roomId;
      console.log(userId, roomId);
      if (userId && roomId) {
        const user = await User.findById(userId); // Fetch user to get the username
        const room = await Room.findById(roomId);
        const removeIndex = room.users
          .map((user) => user.toString())
          .indexOf(userId);

        if (removeIndex !== -1) {
          room.users.splice(removeIndex, 1);
          await room.save();
        }

        // Remove user from roomsUsers object
        roomsUsers[roomId] = roomsUsers[roomId].filter(
          (username) => username !== user.username
        );

        // Emit a message indicating that the user has disconnected
        io.to(roomId).emit("adminMessage", {
          user: "admin",
          text: `${user.username} has disconnected!`,
        });
      }

      console.log("User had left!!!");
    } catch (err) {
      console.error(err.message);
    }
  });
});

module.exports = { io, server, app };
