const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create an Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle a basic route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle WebSocket connections
io.on('connection', (socket) => {

  //write your code here

});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = {app}