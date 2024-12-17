const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const { join } = require('node:path');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: '*',
  credentials: true,
}));

// Create HTTP server
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('chat', (msg) => {
    console.log("received from : ", socket.id, " : ", msg)
    io.emit('chat', { user: socket.id, message: msg });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Listening on Port:${PORT}`);
});
