const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const { join } = require('node:path');
require('dotenv').config();

const app = express();
const server = createServer(app);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: '*',
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.send({
    status: "active",
    chat_app: "active"
  })
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName}`);
  })

  socket.on('chat', ({ roomName, msg }) => {
    console.log(`received from : ${socket.id} in Room ${roomName} : ${msg}`)
    io.to(roomName).emit('chat', { user: socket.id, message: msg });
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
