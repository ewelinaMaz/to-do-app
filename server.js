const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();
const tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/src/index.js'));
});

const server = app.listen(8000, () => {
    console.log("Server is running on Port:", 8000);
  });

  const io = socket(server);

  io.on('connection', (socket) => {
      socket.emit('updateData', tasks);

      socket.on('addTask', (task) => {
          console.log('New task added' + task);
          tasks.push(task);
          socket.broadcast.emit('addTask', task);
      });
      socket.on('removeTask', id => {
          console.log('Task with index' + id + 'removed');
          tasks.filter(task => task.id !== id);
          socket.broadcast.emit('removeTask', id);
      });
  });