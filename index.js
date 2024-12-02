const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = [];

app.use(express.static("public"));

// Handle a basic route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Handle registration
  socket.on("register", (data) => {
    try {
      data = JSON.parse(data);
      console.log(`Registering user: ${JSON.stringify(data)}`);
      users.push({
        socketId: socket.id,
        id: data.id,
      });
    } catch (error) {
      console.error("Invalid JSON in 'register' event:", error.message);
    }
  });

  // Handle signaling
  socket.on("signal", (data) => {
    try {
      data = JSON.parse(data);
      const target = users.find((user) => user.id === data.target);

      if (target) {
        console.log(`Sending signal to ${data.target}`);
        io.to(target.socketId).emit("signal", data);
      } else {
        console.warn(`Target user not found: ${data.target}`);
      }
    } catch (error) {
      console.error("Invalid JSON in 'signal' event:", error.message);
    }
  });

  // Handle chat messages
  socket.on("message", (msg) => {
    console.log(`Message received from ${socket.id}: ${msg}`);
    socket.broadcast.emit("message", msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    const index = users.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      console.log(`Removing user: ${users[index].id}`);
      users.splice(index, 1);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
