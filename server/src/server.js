// /server/src/server.js
require("dotenv").config();
const express = require("express");
const { io, server, app } = require("./web/io");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const apiRoutes = require("./routes/api");

const PORT = process.env.PORT || 5000;

// Use middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

// Use routes
app.use("/api", apiRoutes);

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
